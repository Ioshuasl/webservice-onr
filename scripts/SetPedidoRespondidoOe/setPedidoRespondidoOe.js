/**
 * Responde pedido de ofício (SetPedidoRespondidoOE) no webservice Ofícios da ONR.
 */
import fs from "node:fs";
import soap from "soap";
import { envInt, envStr, resolvePath } from "../../lib/onr_env.js";
import { validatePedidoForRespondidoOE } from "../../lib/onr_oficios_respondido.js";
import {
  hashErrorHint,
  loadLoginConfig,
  loadOficiosSoapConfig,
  loadServentiaChave,
  resolveAuthHash,
} from "../../lib/onr_oficios.js";

const PREFIX = "OFICIOS_SET_PEDIDO_RESPONDIDO_";
const ANEXO_ITEM = "SetPedidoRespondidoOE_Anexo_WSReq";
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
    envInt(`${PREFIX}ID_PEDIDO`) ?? envInt("OFICIOS_ID_PEDIDO");
  if (id === undefined) {
    throw new Error(
      `Defina ${PREFIX}ID_PEDIDO ou OFICIOS_ID_PEDIDO no .env ` +
        "(IDPedido de ListPedidosOE_V2 / GetPedidoOE)."
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
      const url = row.URLArquivo ?? row.urlArquivo ?? row.url_arquivo;
      if (!nome || !url) {
        throw new Error(
          `Item ${i}: informe Nome e URLArquivo (URL pública; spec .p7s).`
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

function buildAnexos(items) {
  return { [ANEXO_ITEM]: items };
}

function parseSkipValidarStatus() {
  const raw = envStr(`${PREFIX}SKIP_VALIDAR_STATUS`);
  if (!raw) return false;
  return ["1", "true", "yes", "sim", "s"].includes(String(raw).trim().toLowerCase());
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
    skipValidarStatus: parseSkipValidarStatus(),
    ...loadOficiosSoapConfig(),
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
    51: "Não foi possível obter dados do pedido.",
    52: "Sem permissão para responder este pedido.",
    53: "Pedido já respondido.",
    54: "Nome de um ou mais anexos não informado.",
    55: "URL de um ou mais anexos não informada.",
    56: "Não foi possível responder o pedido.",
    60: "Não foi possível desbloquear os arquivos.",
    101: "Não foi possível cadastrar o arquivo.",
    102: "Arquivo não encontrado na URL informada.",
    103: "Não foi possível verificar se o arquivo existe.",
    104: "Extensão não permitida — apenas .p7s (homolog pode aceitar .pdf).",
    105: "Aplicação inválida.",
    501: "Campos obrigatórios não informados.",
    502: "Resposta já cadastrada; aguarde download dos anexos pelo ONR.",
  };
  return hints[codigo] ?? null;
}

function extractGetPedidoOeResult(response) {
  return (
    response?.GetPedidoOEResult ??
    response?.GetPedidoOEResponse?.GetPedidoOEResult ??
    response
  );
}

function extractSetPedidoRespondidoOeResult(response) {
  return (
    response?.SetPedidoRespondidoOEResult ??
    response?.SetPedidoRespondidoOEResponse?.SetPedidoRespondidoOEResult ??
    response
  );
}

async function createOficiosClient(cfg) {
  const wsdlPath = resolvePath(cfg.wsdlPath);
  if (!fs.existsSync(wsdlPath)) {
    throw new Error(`WSDL não encontrado: ${wsdlPath}`);
  }

  return soap.createClientAsync(wsdlPath, {
    endpoint: cfg.endpoint,
    forceSoap12Headers: false,
    wsdl_options: { timeout: 60000 },
  });
}

function isOnrUnavailableError(err) {
  const status = err?.response?.status;
  const body =
    typeof err?.body === "string"
      ? err.body
      : typeof err?.response?.data === "string"
        ? err.response.data
        : null;
  return status === 503 || (body && !body.trimStart().startsWith("<"));
}

function formatOnrUnavailableError(err) {
  const status = err?.response?.status;
  const body =
    typeof err?.body === "string"
      ? err.body
      : typeof err?.response?.data === "string"
        ? err.response.data
        : null;
  return `Servidor ONR indisponível (HTTP ${status ?? "?"}): ${body ?? err.message}`;
}

async function preflightGetPedidoOe(client, cfg) {
  if (cfg.skipValidarStatus) return 0;

  const baseIndex = envInt("ONR_HASH_TOKEN_INDEX", 0) ?? 0;
  const hash = await resolveAuthHash(cfg.chave, cfg.loginCfg, {
    tokenIndex: baseIndex,
  });

  let response;
  try {
    [response] = await client.GetPedidoOEAsync({
      oRequest: { Hash: hash, IDPedido: cfg.idPedido },
    });
  } catch (err) {
    if (isOnrUnavailableError(err)) {
      throw new Error(formatOnrUnavailableError(err));
    }
    throw err;
  }

  const pedido = extractGetPedidoOeResult(response);

  if (!pedido?.RETORNO) {
    console.error(
      `GetPedidoOE falhou: [${pedido?.CODIGOERRO}] ${pedido?.ERRODESCRICAO}`
    );
    const hint =
      businessErrorHint(pedido?.CODIGOERRO) ??
      hashErrorHint(pedido?.CODIGOERRO);
    if (hint) console.error(hint);
    return 1;
  }

  const warnings = validatePedidoForRespondidoOE(pedido);
  if (!warnings.length) {
    console.log(
      `Pré-validação OK — pedido ${cfg.idPedido}: IDStatus=${pedido.IDStatus ?? "—"} ` +
        `(protocolo ${pedido.Protocolo ?? "—"}).`
    );
    return 0;
  }

  console.error("=== Pré-validação GetPedidoOE — pedido já respondido ou inelegível ===");
  for (const w of warnings) {
    console.error(`  • ${w}`);
  }
  console.error(
    "\nSetPedidoRespondidoOE não será chamado (evita erro 53 e consumo extra de hash). " +
      "Use outro IDPedido em status Aberto (IDStatus=1). Para ignorar: " +
      `${PREFIX}SKIP_VALIDAR_STATUS=true`
  );
  return 1;
}

async function setPedidoRespondidoOe(client, oRequest) {
  let response;
  try {
    [response] = await client.SetPedidoRespondidoOEAsync({ oRequest });
  } catch (err) {
    if (isOnrUnavailableError(err)) {
      throw new Error(formatOnrUnavailableError(err));
    }
    throw err;
  }

  return extractSetPedidoRespondidoOeResult(response);
}

async function main() {
  const cfg = loadConfig();
  const client = await createOficiosClient(cfg);

  const baseIndex = envInt("ONR_HASH_TOKEN_INDEX", 0) ?? 0;
  const preflightRan = !cfg.skipValidarStatus;

  if (preflightRan && (await preflightGetPedidoOe(client, cfg)) !== 0) {
    process.exit(1);
  }

  const hash = await resolveAuthHash(cfg.chave, cfg.loginCfg, {
    tokenIndex: preflightRan ? baseIndex + 1 : baseIndex,
  });
  const oRequest = buildRequest(cfg, hash);

  console.log("\n=== Parâmetros SetPedidoRespondidoOE ===");
  console.log(JSON.stringify(oRequest, null, 2));
  console.log(`\nEndpoint: ${cfg.endpoint}`);

  const response = await setPedidoRespondidoOe(client, oRequest);
  console.log("\n=== Resposta ===");
  console.log(JSON.stringify(response, null, 2));

  if (!response.RETORNO) {
    console.error(
      `\nSetPedidoRespondidoOE falhou: [${response.CODIGOERRO}] ${response.ERRODESCRICAO}`
    );
    const hint =
      businessErrorHint(response.CODIGOERRO) ?? hashErrorHint(response.CODIGOERRO);
    if (hint) console.error(hint);
    process.exit(1);
  }

  const neg = cfg.negativa ? "negativa" : "positiva";
  console.log(
    `\nOK — Resposta ${neg} registrada no pedido ${cfg.idPedido} ` +
      `(${cfg.anexos.length} anexo(s); status após download dos arquivos).`
  );
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
