/**
 * Negativa em lote de pedidos pessoa (SetPedidoNegativaLotePO) no webservice Penhora Online da ONR.
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

const PREFIX = "PENHORA_ONLINE_SET_PEDIDO_NEGATIVA_LOTE_";
const PEDIDO_ITEM = "SetPedidoNegativaLotePO_Pedido_WSReq";
const RESP_PEDIDO_ITEM = "SetPedidoNegativaLotePO_Pedido_WSResp";
const FIELD_ORDER = ["Hash", "Pedidos"];

function parseIdPedido(value, context) {
  if (typeof value === "boolean") {
    throw new Error(`${context}: valor booleano inválido para IDPedido.`);
  }
  if (typeof value === "number" && Number.isInteger(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim() !== "" && /^\d+$/.test(value.trim())) {
    return Number(value.trim());
  }
  if (value && typeof value === "object") {
    const raw = value.IDPedido ?? value.idPedido ?? value.id_pedido;
    if (raw !== undefined) return parseIdPedido(raw, context);
  }
  throw new Error(`${context}: informe IDPedido numérico.`);
}

function loadPedidos() {
  const jsonRaw = envStr(`${PREFIX}PEDIDOS_JSON`);
  if (jsonRaw) {
    let data;
    try {
      data = JSON.parse(jsonRaw);
    } catch (err) {
      throw new Error(`${PREFIX}PEDIDOS_JSON inválido: ${err.message}`);
    }
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error(`${PREFIX}PEDIDOS_JSON deve ser um array JSON não vazio.`);
    }
    return data.map((row, i) => ({
      IDPedido: parseIdPedido(row, `Item ${i}`),
    }));
  }

  const idsRaw = envStr(`${PREFIX}ID_PEDIDOS`);
  if (idsRaw) {
    const parts = idsRaw
      .split(/[,;\s]+/)
      .map((p) => p.trim())
      .filter(Boolean);
    if (!parts.length) {
      throw new Error(`${PREFIX}ID_PEDIDOS está vazio.`);
    }
    return parts.map((p) => ({ IDPedido: parseIdPedido(p, "ID_PEDIDOS") }));
  }

  const single =
    envInt(`${PREFIX}ID_PEDIDO`) ?? envInt("PENHORA_ONLINE_ID_PEDIDO");
  if (single !== undefined) {
    return [{ IDPedido: single }];
  }

  throw new Error(
    `Defina ${PREFIX}PEDIDOS_JSON, ${PREFIX}ID_PEDIDOS ou ` +
      `${PREFIX}ID_PEDIDO no .env (tipo Pessoa = IDTipoPedido 2).`
  );
}

function buildPedidos(items) {
  return { [PEDIDO_ITEM]: items };
}

function loadConfig() {
  return {
    chave: loadServentiaChave(),
    loginCfg: loadLoginConfig(),
    pedidos: loadPedidos(),
    ...loadPenhoraOnlineSoapConfig(),
  };
}

function buildRequest(cfg, hashValue) {
  const values = {
    Hash: hashValue,
    Pedidos: buildPedidos(cfg.pedidos),
  };
  return Object.fromEntries(FIELD_ORDER.map((key) => [key, values[key]]));
}

function serializePedidosResp(pedidos) {
  if (!pedidos) return [];
  const items = pedidos[RESP_PEDIDO_ITEM];
  if (!items) return [];
  return Array.isArray(items) ? items : [items];
}

function normalizeResponse(result) {
  return {
    RETORNO: result.RETORNO,
    CODIGOERRO: result.CODIGOERRO,
    ERRODESCRICAO: result.ERRODESCRICAO,
    Pedidos: serializePedidosResp(result.Pedidos),
  };
}

function globalErrorHint(codigo) {
  const hints = {
    12: "Informe ao menos um pedido em Pedidos.",
  };
  return hints[codigo] ?? null;
}

function pedidoErrorHint(codigo) {
  const hints = {
    151: "IDPedido inválido.",
    152: "Pedido não é do tipo Pessoa (IDTipoPedido=2?).",
    153: "Sem permissão para negativar este pedido.",
    154: "Operação só para pedidos tipo Pessoa (IDTipoPedido=2).",
    155: "Não foi possível negativar o pedido.",
  };
  return hints[codigo] ?? null;
}

async function setPedidoNegativaLotePo(cfg, oRequest) {
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
    [response] = await client.SetPedidoNegativaLotePOAsync({ oRequest });
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

  const result =
    response?.SetPedidoNegativaLotePOResult ??
    response?.SetPedidoNegativaLotePOResponse?.SetPedidoNegativaLotePOResult ??
    response;

  return normalizeResponse(result);
}

async function main() {
  const cfg = loadConfig();
  const hash = await resolveAuthHash(cfg.chave, cfg.loginCfg);
  const oRequest = buildRequest(cfg, hash);

  console.log("=== Parâmetros SetPedidoNegativaLotePO ===");
  console.log(JSON.stringify(oRequest, null, 2));
  console.log(`\nEndpoint: ${cfg.endpoint}`);

  const response = await setPedidoNegativaLotePo(cfg, oRequest);
  console.log("\n=== Resposta ===");
  console.log(JSON.stringify(response, null, 2));

  if (!response.RETORNO) {
    console.error(
      `\nSetPedidoNegativaLotePO falhou: [${response.CODIGOERRO}] ${response.ERRODESCRICAO}`
    );
    const hint =
      globalErrorHint(response.CODIGOERRO) ?? hashErrorHint(response.CODIGOERRO);
    if (hint) console.error(hint);
    process.exit(1);
  }

  const falhas = (response.Pedidos ?? []).filter((p) => !p.RETORNO);
  if (falhas.length) {
    console.error(`\n${falhas.length} pedido(s) com falha no lote:`);
    for (const p of falhas) {
      console.error(
        `  IDPedido ${p.IDPedido}: [${p.CODIGOERRO}] ${p.ERRODESCRICAO ?? ""}`
      );
      const hint = pedidoErrorHint(p.CODIGOERRO);
      if (hint) console.error(`    ${hint}`);
    }
    process.exit(1);
  }

  const ids = (response.Pedidos ?? []).map((p) => p.IDPedido);
  console.log(
    `\nOK — Negativa em lote registrada para ${ids.length} pedido(s): ${ids.join(", ")}.`
  );
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
