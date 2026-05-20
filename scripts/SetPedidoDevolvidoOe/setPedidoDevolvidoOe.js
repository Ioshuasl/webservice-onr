/**
 * Devolve pedido de ofício (SetPedidoDevolvidoOE) no webservice Ofícios da ONR.
 */
import fs from "node:fs";
import soap from "soap";
import { envInt, envStr, resolvePath } from "../../lib/onr_env.js";
import { validatePedidoForDevolvidoOE } from "../../lib/onr_oficios_devolvido.js";
import {
  hashErrorHint,
  loadLoginConfig,
  loadOficiosSoapConfig,
  loadServentiaChave,
  resolveAuthHash,
} from "../../lib/onr_oficios.js";

const PREFIX = "OFICIOS_SET_PEDIDO_DEVOLVIDO_";
const FIELD_ORDER = ["Hash", "IDPedido", "MotivoDevolucao"];

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

function parseSkipValidarStatus() {
  const raw = envStr(`${PREFIX}SKIP_VALIDAR_STATUS`);
  if (!raw) return false;
  return ["1", "true", "yes", "sim", "s"].includes(String(raw).trim().toLowerCase());
}

function loadConfig() {
  const motivoDevolucao = envStr(`${PREFIX}MOTIVO_DEVOLUCAO`);
  if (!motivoDevolucao) {
    throw new Error(`Defina ${PREFIX}MOTIVO_DEVOLUCAO no .env (motivo da devolução).`);
  }

  return {
    chave: loadServentiaChave(),
    loginCfg: loadLoginConfig(),
    idPedido: resolveIdPedido(),
    motivoDevolucao,
    skipValidarStatus: parseSkipValidarStatus(),
    ...loadOficiosSoapConfig(),
  };
}

function buildRequest(cfg, hashValue) {
  const values = {
    Hash: hashValue,
    IDPedido: cfg.idPedido,
    MotivoDevolucao: cfg.motivoDevolucao,
  };
  return Object.fromEntries(FIELD_ORDER.map((key) => [key, values[key]]));
}

function businessErrorHint(codigo) {
  const hints = {
    12: "IDPedido inválido.",
    13: "Informe MotivoDevolucao.",
    51: "Não foi possível obter dados do pedido.",
    52: "Sem permissão para devolver este pedido.",
    53: "Pedido já respondido.",
    54: "Não foi possível devolver o pedido.",
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

function extractSetPedidoDevolvidoOeResult(response) {
  return (
    response?.SetPedidoDevolvidoOEResult ??
    response?.SetPedidoDevolvidoOEResponse?.SetPedidoDevolvidoOEResult ??
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

  const warnings = validatePedidoForDevolvidoOE(pedido);
  if (!warnings.length) {
    console.log(
      `Pré-validação OK — pedido ${cfg.idPedido}: IDStatus=${pedido.IDStatus ?? "—"} ` +
        `(protocolo ${pedido.Protocolo ?? "—"}).`
    );
    return 0;
  }

  console.error(
    "=== Pré-validação GetPedidoOE — pedido inelegível para devolução ==="
  );
  for (const w of warnings) {
    console.error(`  • ${w}`);
  }
  console.error(
    "\nSetPedidoDevolvidoOE não será chamado. Use pedido em status Aberto (IDStatus=1). " +
      "Para ignorar: " +
      `${PREFIX}SKIP_VALIDAR_STATUS=true`
  );
  return 1;
}

async function setPedidoDevolvidoOe(client, oRequest) {
  let response;
  try {
    [response] = await client.SetPedidoDevolvidoOEAsync({ oRequest });
  } catch (err) {
    if (isOnrUnavailableError(err)) {
      throw new Error(formatOnrUnavailableError(err));
    }
    throw err;
  }

  return extractSetPedidoDevolvidoOeResult(response);
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

  console.log("\n=== Parâmetros SetPedidoDevolvidoOE ===");
  console.log(JSON.stringify(oRequest, null, 2));
  console.log(`\nEndpoint: ${cfg.endpoint}`);

  const response = await setPedidoDevolvidoOe(client, oRequest);
  console.log("\n=== Resposta ===");
  console.log(JSON.stringify(response, null, 2));

  if (!response.RETORNO) {
    console.error(
      `\nSetPedidoDevolvidoOE falhou: [${response.CODIGOERRO}] ${response.ERRODESCRICAO}`
    );
    const hint =
      businessErrorHint(response.CODIGOERRO) ?? hashErrorHint(response.CODIGOERRO);
    if (hint) console.error(hint);
    process.exit(1);
  }

  console.log(
    `\nOK — Pedido ${cfg.idPedido} devolvido (IDStatus passa a 3 após processamento).`
  );
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
