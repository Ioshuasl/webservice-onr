/**
 * Responde pedido penhora com nota de exigência (SetPenhoraExigenciaPO) no webservice Penhora Online da ONR.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import soap from "soap";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
dotenv.config({ path: path.join(ROOT, ".env"), override: true });
import { envInt, envStr, resolvePath } from "../../lib/onr_env.js";
import {
  buildORequest,
  soapFaultHint,
  validatePedidoForExigencia,
} from "../../lib/onr_penhora_exigencia.js";
import {
  hashErrorHint,
  loadLoginConfig,
  loadPenhoraOnlineSoapConfig,
  loadServentiaChave,
  resolveAuthHash,
} from "../../lib/onr_penhora_online.js";

const PREFIX = "PENHORA_ONLINE_SET_PENHORA_EXIGENCIA_";

function resolveIdPedido() {
  const id =
    envInt(`${PREFIX}ID_PEDIDO`) ?? envInt("PENHORA_ONLINE_ID_PEDIDO");
  if (id === undefined) {
    throw new Error(
      `Defina ${PREFIX}ID_PEDIDO ou PENHORA_ONLINE_ID_PEDIDO no .env ` +
        "(IDPedido de ListPedidosPO / GetPedidoPO)."
    );
  }
  return id;
}

function loadAnexos() {
  const jsonRaw = envStr(`${PREFIX}ANEXOS_JSON`);
  if (jsonRaw) {
    let data;
    try {
      data = JSON.parse(jsonRaw);
    } catch (err) {
      throw new Error(`${PREFIX}ANEXOS_JSON inválido: ${err.message}`);
    }
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error(`${PREFIX}ANEXOS_JSON deve ser um array JSON não vazio.`);
    }
    return data.map((row, i) => {
      if (!row || typeof row !== "object") {
        throw new Error(`Item ${i} em ANEXOS_JSON deve ser um objeto.`);
      }
      const nome = row.Nome ?? row.nome;
      const url =
        row.URLArquivo ?? row.urlArquivo ?? row.url_arquivo;
      if (!nome || !url) {
        throw new Error(
          `Item ${i}: informe Nome e URLArquivo (arquivo .pdf ou .p7s).`
        );
      }
      return { Nome: String(nome), URLArquivo: String(url) };
    });
  }

  const nome = envStr(`${PREFIX}NOME`);
  const urlArquivo = envStr(`${PREFIX}URL_ARQUIVO`);
  if (nome && urlArquivo) {
    return [{ Nome: nome, URLArquivo: urlArquivo }];
  }

  throw new Error(
    `Defina ${PREFIX}ANEXOS_JSON (array) ou ` +
      `${PREFIX}NOME + ${PREFIX}URL_ARQUIVO no .env.`
  );
}

function loadConfig() {
  const resposta = envStr(`${PREFIX}RESPOSTA`);
  if (!resposta) {
    throw new Error(`Defina ${PREFIX}RESPOSTA no .env.`);
  }

  const skipPedidoCheck = ["1", "true", "yes"].includes(
    (process.env.PENHORA_ONLINE_SET_PENHORA_EXIGENCIA_SKIP_PEDIDO_CHECK || "").toLowerCase()
  );

  return {
    chave: loadServentiaChave(),
    loginCfg: loadLoginConfig(),
    idPedido: resolveIdPedido(),
    resposta,
    anexos: loadAnexos(),
    skipPedidoCheck,
    ...loadPenhoraOnlineSoapConfig(),
  };
}

function businessErrorHint(codigo) {
  const hints = {
    12: "IDPedido inválido.",
    13: "Informe Resposta.",
    14: "Informe ao menos um anexo.",
    51: "Não foi possível obter dados do pedido (tipo Penhora?).",
    52: "Sem permissão para responder este pedido.",
    53: "Operação só para pedidos tipo Penhora (IDTipoPedido=3).",
    54: "Pedido sem prenotação.",
    55: "Nome do anexo não informado.",
    56: "URLArquivo não informada.",
    102: "Arquivo não encontrado na URL informada.",
    104: "Extensão não permitida — use .pdf ou .p7s.",
    501: "Campos obrigatórios não informados.",
    502: "Resposta já cadastrada; aguardando download dos arquivos pelo ONR.",
  };
  return hints[codigo] ?? null;
}

async function preflightGetPedido(client, cfg) {
  if (cfg.skipPedidoCheck) return 0;

  const baseIndex = envInt("ONR_HASH_TOKEN_INDEX", 0) ?? 0;
  const hash = await resolveAuthHash(cfg.chave, cfg.loginCfg, {
    tokenIndex: baseIndex,
  });

  const [getResp] = await client.GetPedidoPOAsync({
    oRequest: { Hash: hash, IDPedido: cfg.idPedido },
  });
  const pedido =
    getResp?.GetPedidoPOResult ??
    getResp?.GetPedidoPOResponse?.GetPedidoPOResult ??
    getResp;

  if (!pedido?.RETORNO) {
    console.error(
      `GetPedidoPO falhou: [${pedido?.CODIGOERRO}] ${pedido?.ERRODESCRICAO}`
    );
    return 1;
  }

  const warnings = validatePedidoForExigencia(pedido);
  if (!warnings.length) return 0;

  console.error("=== Pré-validação GetPedidoPO — pedido inelegível ===");
  for (const w of warnings) {
    console.error(`  • ${w}`);
  }
  console.error(
    "\nO pedido informado não aceita SetPenhoraExigenciaPO neste estado. " +
      "Escolha um pedido Penhora (tipo 3) prenotado e ainda sem resposta " +
      "(ex.: IDStatus 9 ou 10). Para forçar a chamada SOAP mesmo assim: " +
      "PENHORA_ONLINE_SET_PENHORA_EXIGENCIA_SKIP_PEDIDO_CHECK=true"
  );
  return 1;
}

async function setPenhoraExigenciaPo(client, oRequest) {
  const [response] = await client.SetPenhoraExigenciaPOAsync({ oRequest });
  return (
    response?.SetPenhoraExigenciaPOResult ??
    response?.SetPenhoraExigenciaPOResponse?.SetPenhoraExigenciaPOResult ??
    response
  );
}

async function main() {
  const cfg = loadConfig();
  const oRequest = buildORequest("", cfg.idPedido, cfg.resposta, cfg.anexos);

  const wsdlPath = resolvePath(cfg.wsdlPath);
  if (!fs.existsSync(wsdlPath)) {
    throw new Error(`WSDL não encontrado: ${wsdlPath}`);
  }

  const client = await soap.createClientAsync(wsdlPath, {
    endpoint: cfg.endpoint,
    forceSoap12Headers: false,
    wsdl_options: { timeout: 60000 },
  });

  if ((await preflightGetPedido(client, cfg)) !== 0) {
    process.exit(1);
  }

  const baseIndex = envInt("ONR_HASH_TOKEN_INDEX", 0) ?? 0;
  const hash = await resolveAuthHash(cfg.chave, cfg.loginCfg, {
    tokenIndex: baseIndex + 1,
  });
  oRequest.Hash = hash;

  console.log("=== Parâmetros SetPenhoraExigenciaPO ===");
  console.log(JSON.stringify(oRequest, null, 2));
  console.log(`\nEndpoint: ${cfg.endpoint}`);

  let response;
  try {
    response = await setPenhoraExigenciaPo(client, oRequest);
  } catch (err) {
    const status = err?.response?.status;
    const body =
      typeof err?.body === "string"
        ? err.body
        : typeof err?.response?.data === "string"
          ? err.response.data
          : null;

    if (status === 503 || (body && !body.trimStart().startsWith("<"))) {
      throw new Error(
        `Servidor ONR indisponível (HTTP ${status ?? "?"}): ${body ?? err.message}`
      );
    }

    const msg = err?.message || String(err);
    console.error(`\nSetPenhoraExigenciaPO falhou (SOAP Fault): ${msg}`);
    const hint = soapFaultHint(body || msg);
    if (hint) console.error(hint);
    process.exit(1);
  }

  console.log("\n=== Resposta ===");
  console.log(JSON.stringify(response, null, 2));

  if (!response.RETORNO) {
    console.error(
      `\nSetPenhoraExigenciaPO falhou: [${response.CODIGOERRO}] ${response.ERRODESCRICAO}`
    );
    const hint =
      businessErrorHint(response.CODIGOERRO) ?? hashErrorHint(response.CODIGOERRO);
    if (hint) console.error(hint);
    process.exit(1);
  }

  console.log(
    `\nOK — Nota de exigência registrada no pedido ${cfg.idPedido} ` +
      `(${cfg.anexos.length} anexo(s)).`
  );
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
