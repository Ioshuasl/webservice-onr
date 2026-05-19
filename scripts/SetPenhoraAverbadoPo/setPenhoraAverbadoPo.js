/**
 * Responde pedido penhora como averbado (SetPenhoraAverbadoPO) no webservice Penhora Online da ONR.
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

const PREFIX = "PENHORA_ONLINE_SET_PENHORA_AVERBADO_";
const CERT_ITEM = "SetPenhoraAverbadoPO_Certidao_WSReq";
const FIELD_ORDER = ["Hash", "IDPedido", "Resposta", "CertidaoPenhora"];

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

function loadCertidoes() {
  const jsonRaw = envStr(`${PREFIX}CERTIDOES_JSON`);
  if (jsonRaw) {
    let data;
    try {
      data = JSON.parse(jsonRaw);
    } catch (err) {
      throw new Error(`${PREFIX}CERTIDOES_JSON inválido: ${err.message}`);
    }
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error(`${PREFIX}CERTIDOES_JSON deve ser um array JSON não vazio.`);
    }
    return data.map((row, i) => {
      if (!row || typeof row !== "object") {
        throw new Error(`Item ${i} em CERTIDOES_JSON deve ser um objeto.`);
      }
      const matricula = row.Matricula ?? row.matricula;
      const url =
        row.URLArquivo ?? row.urlArquivo ?? row.url_arquivo;
      if (!matricula || !url) {
        throw new Error(
          `Item ${i}: informe Matricula e URLArquivo (URL pública; spec .p7s).`
        );
      }
      return { Matricula: String(matricula), URLArquivo: String(url) };
    });
  }

  const matricula = envStr(`${PREFIX}MATRICULA`);
  const urlArquivo = envStr(`${PREFIX}URL_ARQUIVO`);
  if (matricula && urlArquivo) {
    return [{ Matricula: matricula, URLArquivo: urlArquivo }];
  }

  throw new Error(
    `Defina ${PREFIX}CERTIDOES_JSON (array) ou ` +
      `${PREFIX}MATRICULA + ${PREFIX}URL_ARQUIVO no .env.`
  );
}

function buildCertidaoPenhora(items) {
  return { [CERT_ITEM]: items };
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
    certidoes: loadCertidoes(),
    ...loadPenhoraOnlineSoapConfig(),
  };
}

function buildRequest(cfg, hashValue) {
  const values = {
    Hash: hashValue,
    IDPedido: cfg.idPedido,
    Resposta: cfg.resposta,
    CertidaoPenhora: buildCertidaoPenhora(cfg.certidoes),
  };
  return Object.fromEntries(FIELD_ORDER.map((key) => [key, values[key]]));
}

function businessErrorHint(codigo) {
  const hints = {
    12: "IDPedido inválido.",
    13: "Informe Resposta.",
    14: "Informe ao menos uma certidão (CertidaoPenhora).",
    51: "Não foi possível obter dados do pedido (tipo Penhora?).",
    52: "Sem permissão para responder este pedido.",
    53: "Operação só para pedidos tipo Penhora (IDTipoPedido=3).",
    54: "Pedido sem prenotação.",
    55: "Pedido já respondido.",
    56: "Pedido sem confirmação de pagamento.",
    57: "Não foi possível obter matrículas do pedido.",
    59: "Mais de uma certidão por matrícula não é permitido.",
    102: "Arquivo não encontrado na URL informada.",
    104: "Extensão não permitida — spec exige .p7s (homolog pode aceitar .pdf).",
    501: "Campos obrigatórios não informados.",
    502: "Resposta já cadastrada; aguardando download dos arquivos pelo ONR.",
  };
  return hints[codigo] ?? null;
}

async function setPenhoraAverbadoPo(cfg, oRequest) {
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
    [response] = await client.SetPenhoraAverbadoPOAsync({ oRequest });
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
    response?.SetPenhoraAverbadoPOResult ??
    response?.SetPenhoraAverbadoPOResponse?.SetPenhoraAverbadoPOResult ??
    response
  );
}

async function main() {
  const cfg = loadConfig();
  const hash = await resolveAuthHash(cfg.chave, cfg.loginCfg);
  const oRequest = buildRequest(cfg, hash);

  console.log("=== Parâmetros SetPenhoraAverbadoPO ===");
  console.log(JSON.stringify(oRequest, null, 2));
  console.log(`\nEndpoint: ${cfg.endpoint}`);

  const response = await setPenhoraAverbadoPo(cfg, oRequest);
  console.log("\n=== Resposta ===");
  console.log(JSON.stringify(response, null, 2));

  if (!response.RETORNO) {
    console.error(
      `\nSetPenhoraAverbadoPO falhou: [${response.CODIGOERRO}] ${response.ERRODESCRICAO}`
    );
    const hint =
      businessErrorHint(response.CODIGOERRO) ?? hashErrorHint(response.CODIGOERRO);
    if (hint) console.error(hint);
    process.exit(1);
  }

  console.log(
    `\nOK — Resposta averbado registrada no pedido ${cfg.idPedido} ` +
      `(${cfg.certidoes.length} certidão(ões)).`
  );
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
