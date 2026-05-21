/**
 * Negativa em lote de pedidos de ofício (SetPedidoNegativaLoteOE) no webservice Ofícios da ONR.
 */
import fs from "node:fs";
import soap from "soap";
import { resolvePath } from "../../lib/onr_env.js";
import {
  hashErrorHint,
  loadLoginConfig,
  loadOficiosSoapConfig,
  loadServentiaChave,
  resolveAuthHash,
} from "../../lib/onr_oficios.js";
import {
  buildPedidosArrayOfInt,
  loadPedidoIds,
} from "../../lib/onr_oficios_negativa_lote.js";

const PREFIX = "OFICIOS_SET_PEDIDO_NEGATIVA_LOTE_";
const RESP_PEDIDO_ITEM = "SetPedidoNegativaLoteOE_Pedido_WSResp";
const FIELD_ORDER = ["Hash", "Pedidos"];

function loadConfig() {
  return {
    chave: loadServentiaChave(),
    loginCfg: loadLoginConfig(),
    pedidoIds: loadPedidoIds(PREFIX),
    ...loadOficiosSoapConfig(),
  };
}

function buildRequest(cfg, hashValue) {
  const values = {
    Hash: hashValue,
    Pedidos: buildPedidosArrayOfInt(cfg.pedidoIds),
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
    12: "Informe ao menos um pedido em Pedidos (erro 12).",
  };
  return hints[codigo] ?? null;
}

function pedidoErrorHint(codigo) {
  const hints = {
    151: "IDPedido inválido.",
    152: "Não foi possível obter dados do pedido.",
    153: "Sem permissão para negativar este pedido.",
    154: "Pedido já respondido.",
    155: "Não foi possível negativar o pedido.",
  };
  return hints[codigo] ?? null;
}

async function setPedidoNegativaLoteOe(cfg, oRequest) {
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
    [response] = await client.SetPedidoNegativaLoteOEAsync({ oRequest });
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
    response?.SetPedidoNegativaLoteOEResult ??
    response?.SetPedidoNegativaLoteOEResponse?.SetPedidoNegativaLoteOEResult ??
    response;

  return normalizeResponse(result);
}

async function main() {
  const cfg = loadConfig();
  const hash = await resolveAuthHash(cfg.chave, cfg.loginCfg);
  const oRequest = buildRequest(cfg, hash);

  console.log("=== Parâmetros SetPedidoNegativaLoteOE ===");
  console.log(JSON.stringify(oRequest, null, 2));
  console.log(`\nEndpoint: ${cfg.endpoint}`);

  const response = await setPedidoNegativaLoteOe(cfg, oRequest);
  console.log("\n=== Resposta ===");
  console.log(JSON.stringify(response, null, 2));

  if (!response.RETORNO) {
    console.error(
      `\nSetPedidoNegativaLoteOE falhou: [${response.CODIGOERRO}] ${response.ERRODESCRICAO}`
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
