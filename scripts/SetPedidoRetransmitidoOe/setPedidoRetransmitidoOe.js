/**
 * Retransmite pedido de ofício (SetPedidoRetransmitidoOE) no webservice Ofícios da ONR.
 */
import fs from "node:fs";
import soap from "soap";
import { envInt, envStr, resolvePath } from "../../lib/onr_env.js";
import {
  hashErrorHint,
  loadLoginConfig,
  loadOficiosSoapConfig,
  loadServentiaChave,
  resolveAuthHash,
} from "../../lib/onr_oficios.js";
import { validatePedidoForRetransmitidoOE } from "../../lib/onr_oficios_retransmitido.js";

const PREFIX = "OFICIOS_SET_PEDIDO_RETRANSMITIDO_";
const FIELD_ORDER = ["Hash", "IDPedido", "IDCartorio", "Observacoes"];

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

function resolveIdCartorio() {
  const id = envInt(`${PREFIX}ID_CARTORIO`);
  if (id === undefined) {
    throw new Error(
      `Defina ${PREFIX}ID_CARTORIO no .env ` +
        "(obtido em ListCartoriosRestransmitirOE)."
    );
  }
  return id;
}

function parseSkipValidarStatus() {
  const raw = envStr(`${PREFIX}SKIP_VALIDAR_STATUS`);
  if (!raw) return false;
  return ["1", "true", "yes", "sim", "s"].includes(String(raw).trim().toLowerCase());
}

function loadConfig() {
  return {
    chave: loadServentiaChave(),
    loginCfg: loadLoginConfig(),
    idPedido: resolveIdPedido(),
    idCartorio: resolveIdCartorio(),
    observacoes: envStr(`${PREFIX}OBSERVACOES`) ?? "",
    skipValidarStatus: parseSkipValidarStatus(),
    ...loadOficiosSoapConfig(),
  };
}

function buildRequest(cfg, hashValue) {
  const values = {
    Hash: hashValue,
    IDPedido: cfg.idPedido,
    IDCartorio: cfg.idCartorio,
    Observacoes: cfg.observacoes,
  };
  const ordered = Object.fromEntries(
    FIELD_ORDER.filter((key) => key !== "Observacoes" || cfg.observacoes).map(
      (key) => [key, values[key]]
    )
  );
  return ordered;
}

function businessErrorHint(codigo) {
  const hints = {
    12: "IDPedido inválido.",
    13: "IDCartorio inválido — confira ListCartoriosRestransmitirOE (erro 504 se não permitido).",
    51: "Não foi possível obter dados do pedido.",
    52: "Sem permissão para retransmitir este pedido.",
    53: "Pedido já respondido.",
    54: "Apenas Endereço Rua/Edifício/Loteamento (IDTipoPesquisa 1–3).",
    55: "Não foi possível retransmitir o pedido.",
    501: "Não retransmitir para o cartório de origem do pedido.",
    502: "Pedido já respondido.",
    503: "Tipo de pesquisa não permite retransmissão.",
    504: "Cartório informado não é permitido para este pedido.",
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

function extractSetPedidoRetransmitidoOeResult(response) {
  return (
    response?.SetPedidoRetransmitidoOEResult ??
    response?.SetPedidoRetransmitidoOEResponse?.SetPedidoRetransmitidoOEResult ??
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

  const warnings = validatePedidoForRetransmitidoOE(pedido);
  if (!warnings.length) {
    console.log(
      `Pré-validação OK — pedido ${cfg.idPedido}: IDStatus=${pedido.IDStatus ?? "—"}, ` +
        `IDTipoPesquisa=${pedido.IDTipoPesquisa ?? "—"} ` +
        `(protocolo ${pedido.Protocolo ?? "—"}).`
    );
    return 0;
  }

  console.error(
    "=== Pré-validação GetPedidoOE — pedido inelegível para retransmissão ==="
  );
  for (const w of warnings) {
    console.error(`  • ${w}`);
  }
  console.error(
    "\nSetPedidoRetransmitidoOE não será chamado. Use pedido Aberto com IDTipoPesquisa 1–3. " +
      `Cartórios permitidos: ListCartoriosRestransmitirOE. Para ignorar: ${PREFIX}SKIP_VALIDAR_STATUS=true`
  );
  return 1;
}

async function setPedidoRetransmitidoOe(client, oRequest) {
  let response;
  try {
    [response] = await client.SetPedidoRetransmitidoOEAsync({ oRequest });
  } catch (err) {
    if (isOnrUnavailableError(err)) {
      throw new Error(formatOnrUnavailableError(err));
    }
    throw err;
  }

  return extractSetPedidoRetransmitidoOeResult(response);
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

  console.log("\n=== Parâmetros SetPedidoRetransmitidoOE ===");
  console.log(JSON.stringify(oRequest, null, 2));
  console.log(`\nEndpoint: ${cfg.endpoint}`);

  const response = await setPedidoRetransmitidoOe(client, oRequest);
  console.log("\n=== Resposta ===");
  console.log(JSON.stringify(response, null, 2));

  if (!response.RETORNO) {
    console.error(
      `\nSetPedidoRetransmitidoOE falhou: [${response.CODIGOERRO}] ${response.ERRODESCRICAO}`
    );
    const hint =
      businessErrorHint(response.CODIGOERRO) ?? hashErrorHint(response.CODIGOERRO);
    if (hint) console.error(hint);
    process.exit(1);
  }

  console.log(
    `\nOK — Pedido ${cfg.idPedido} retransmitido para cartório ${cfg.idCartorio}.`
  );
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
