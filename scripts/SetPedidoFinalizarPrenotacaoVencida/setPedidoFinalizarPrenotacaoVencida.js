/**
 * Finaliza pedido com prenotação vencida (SetPedidoFinalizarPrenotacaoVencida) no webservice Penhora Online da ONR.
 */
import fs from "node:fs";
import soap from "soap";
import { envInt, envStr, resolvePath } from "../../lib/onr_env.js";
import {
  hashErrorHint,
  loadLoginConfig,
  loadPenhoraOnlineSoapConfig,
  loadServentiaChave,
  resolveAuthHash,
} from "../../lib/onr_penhora_online.js";

const PREFIX = "PENHORA_ONLINE_SET_FINALIZAR_PRENOTACAO_VENCIDA_";
const ANEXO_ITEM = "SetPedidoFinalizarPrenotacaoVencida_Anexo_WSReq";
const FIELD_ORDER = ["Hash", "IDPedido", "Resposta", "Anexos"];

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
      const nome = row.Nome ?? row.nome ?? row.Matricula ?? row.matricula;
      const url =
        row.URLArquivo ?? row.urlArquivo ?? row.url_arquivo;
      if (!nome || !url) {
        throw new Error(
          `Item ${i}: informe Nome (ou Matricula) e URLArquivo (URL pública; spec .p7s).`
        );
      }
      return { Nome: String(nome), URLArquivo: String(url) };
    });
  }

  const nome = envStr(`${PREFIX}NOME`) ?? envStr(`${PREFIX}MATRICULA`);
  const urlArquivo = envStr(`${PREFIX}URL_ARQUIVO`);
  if (nome && urlArquivo) {
    return [{ Nome: nome, URLArquivo: urlArquivo }];
  }

  throw new Error(
    `Defina ${PREFIX}ANEXOS_JSON (array) ou ` +
      `${PREFIX}NOME + ${PREFIX}URL_ARQUIVO no .env.`
  );
}

function buildAnexos(items) {
  return { [ANEXO_ITEM]: items };
}

function loadConfig() {
  const resposta = envStr(`${PREFIX}RESPOSTA`);
  if (!resposta) {
    throw new Error(`Defina ${PREFIX}RESPOSTA no .env.`);
  }

  return {
    chave: loadServentiaChave(),
    loginCfg: loadLoginConfig(),
    idPedido: resolveIdPedido(),
    resposta,
    anexos: loadAnexos(),
    ...loadPenhoraOnlineSoapConfig(),
  };
}

function buildRequest(cfg, hashValue) {
  const values = {
    Hash: hashValue,
    IDPedido: cfg.idPedido,
    Resposta: cfg.resposta,
    Anexos: buildAnexos(cfg.anexos),
  };
  return Object.fromEntries(FIELD_ORDER.map((key) => [key, values[key]]));
}

function businessErrorHint(codigo) {
  const hints = {
    12: "IDPedido inválido.",
    13: "Informe Resposta.",
    14: "Informe ao menos um anexo (Anexos).",
    51: "Não foi possível obter dados do pedido (tipo Matrícula / IDTipoPedido=1?).",
    52: "Sem permissão para responder este pedido.",
    53: "Operação só para pedidos tipo Certidão por Matrícula (IDTipoPedido=1).",
    54: "Nome/matrícula de um ou mais anexos não informada.",
    55: "URL de um ou mais arquivos não informada.",
    60: "Não foi possível desbloquear os arquivos.",
    101: "Não foi possível cadastrar o arquivo.",
    102: "Arquivo não encontrado na URL informada.",
    103: "Não foi possível verificar se o arquivo existe.",
    104: "Extensão não permitida — spec exige .p7s (homolog pode aceitar .pdf).",
    105: "Aplicação inválida.",
    501: "Campos obrigatórios não informados.",
    502: "Resposta já cadastrada; aguardando download dos arquivos pelo ONR.",
  };
  return hints[codigo] ?? null;
}

async function setPedidoFinalizarPrenotacaoVencida(cfg, oRequest) {
  const wsdlPath = resolvePath(cfg.wsdlPath);
  if (!fs.existsSync(wsdlPath)) {
    throw new Error(`WSDL não encontrado: ${wsdlPath}`);
  }

  const client = await soap.createClientAsync(wsdlPath, {
    endpoint: cfg.endpoint,
    forceSoap12Headers: false,
    wsdl_options: { timeout: 60000 },
  });

  let response;
  try {
    [response] = await client.SetPedidoFinalizarPrenotacaoVencidaAsync({
      oRequest,
    });
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
    throw err;
  }

  return (
    response?.SetPedidoFinalizarPrenotacaoVencidaResult ??
    response?.SetPedidoFinalizarPrenotacaoVencidaResponse
      ?.SetPedidoFinalizarPrenotacaoVencidaResult ??
    response
  );
}

async function main() {
  const cfg = loadConfig();
  const hash = await resolveAuthHash(cfg.chave, cfg.loginCfg);
  const oRequest = buildRequest(cfg, hash);

  console.log("=== Parâmetros SetPedidoFinalizarPrenotacaoVencida ===");
  console.log(JSON.stringify(oRequest, null, 2));
  console.log(`\nEndpoint: ${cfg.endpoint}`);

  const response = await setPedidoFinalizarPrenotacaoVencida(cfg, oRequest);
  console.log("\n=== Resposta ===");
  console.log(JSON.stringify(response, null, 2));

  if (!response.RETORNO) {
    console.error(
      `\nSetPedidoFinalizarPrenotacaoVencida falhou: [${response.CODIGOERRO}] ${response.ERRODESCRICAO}`
    );
    const hint =
      businessErrorHint(response.CODIGOERRO) ?? hashErrorHint(response.CODIGOERRO);
    if (hint) console.error(hint);
    process.exit(1);
  }

  console.log(
    `\nOK — Prenotação vencida finalizada no pedido ${cfg.idPedido} ` +
      `(${cfg.anexos.length} anexo(s)).`
  );
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
