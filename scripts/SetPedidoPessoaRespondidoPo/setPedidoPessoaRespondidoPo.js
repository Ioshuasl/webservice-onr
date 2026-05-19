/**
 * Responde pedido de certidão por pessoa (SetPedidoPessoaRespondidoPO) no webservice Penhora Online da ONR.
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

const PREFIX = "PENHORA_ONLINE_SET_PEDIDO_PESSOA_RESPONDIDO_";
const ANEXO_ITEM = "SetPedidoPessoaRespondidoPO_Anexo_WSReq";
const FIELD_ORDER = ["Hash", "IDPedido", "Resposta", "Negativa", "Anexos"];

function parseNegativa(raw) {
  if (raw === undefined || raw === null || String(raw).trim() === "") {
    return false;
  }
  const text = String(raw).trim().toLowerCase();
  if (["1", "true", "yes", "sim", "s"].includes(text)) return true;
  if (["0", "false", "no", "nao", "não", "n"].includes(text)) return false;
  throw new Error(
    `${PREFIX}NEGATIVA inválido (${JSON.stringify(raw)}). Use true/false ou 1/0.`
  );
}

function resolveIdPedido() {
  const id =
    envInt(`${PREFIX}ID_PEDIDO`) ?? envInt("PENHORA_ONLINE_ID_PEDIDO");
  if (id === undefined) {
    throw new Error(
      `Defina ${PREFIX}ID_PEDIDO ou PENHORA_ONLINE_ID_PEDIDO no .env ` +
        "(IDPedido de ListPedidosPO / GetPedidoPO; tipo Pessoa = IDTipoPedido 2)."
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
    `Defina ${PREFIX}ANEXOS_JSON (array) ou ` +
      `${PREFIX}MATRICULA + ${PREFIX}URL_ARQUIVO no .env.`
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
    negativa: parseNegativa(envStr(`${PREFIX}NEGATIVA`)),
    anexos: loadAnexos(),
    ...loadPenhoraOnlineSoapConfig(),
  };
}

function buildRequest(cfg, hashValue) {
  const values = {
    Hash: hashValue,
    IDPedido: cfg.idPedido,
    Resposta: cfg.resposta,
    Negativa: cfg.negativa,
    Anexos: buildAnexos(cfg.anexos),
  };
  return Object.fromEntries(FIELD_ORDER.map((key) => [key, values[key]]));
}

function businessErrorHint(codigo) {
  const hints = {
    12: "IDPedido inválido.",
    13: "Informe Resposta.",
    14: "Informe ao menos um anexo (Anexos).",
    51: "Não foi possível obter dados do pedido (tipo Pessoa / IDTipoPedido=2?).",
    52: "Sem permissão para responder este pedido.",
    53: "Operação só para pedidos tipo Certidão por Pessoa (IDTipoPedido=2).",
    54: "Matrícula de um ou mais anexos não informada.",
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

async function setPedidoPessoaRespondidoPo(cfg, oRequest) {
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
    [response] = await client.SetPedidoPessoaRespondidoPOAsync({ oRequest });
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
    response?.SetPedidoPessoaRespondidoPOResult ??
    response?.SetPedidoPessoaRespondidoPOResponse?.SetPedidoPessoaRespondidoPOResult ??
    response
  );
}

async function main() {
  const cfg = loadConfig();
  const hash = await resolveAuthHash(cfg.chave, cfg.loginCfg);
  const oRequest = buildRequest(cfg, hash);

  console.log("=== Parâmetros SetPedidoPessoaRespondidoPO ===");
  console.log(JSON.stringify(oRequest, null, 2));
  console.log(`\nEndpoint: ${cfg.endpoint}`);

  const response = await setPedidoPessoaRespondidoPo(cfg, oRequest);
  console.log("\n=== Resposta ===");
  console.log(JSON.stringify(response, null, 2));

  if (!response.RETORNO) {
    console.error(
      `\nSetPedidoPessoaRespondidoPO falhou: [${response.CODIGOERRO}] ${response.ERRODESCRICAO}`
    );
    const hint =
      businessErrorHint(response.CODIGOERRO) ?? hashErrorHint(response.CODIGOERRO);
    if (hint) console.error(hint);
    process.exit(1);
  }

  const neg = cfg.negativa ? "negativa" : "positiva";
  console.log(
    `\nOK — Resposta ${neg} registrada no pedido ${cfg.idPedido} ` +
      `(${cfg.anexos.length} anexo(s)).`
  );
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
