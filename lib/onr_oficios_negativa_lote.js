/** Helpers para SetPedidoNegativaLoteOE — ArrayOfInt no envelope. */

import { envInt, envStr } from "./onr_env.js";

export const ARRAY_OF_INT_ITEM = "int";

export function parseIdPedido(value, context) {
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

/**
 * Carrega lista de IDs a partir de PEDIDOS_JSON, ID_PEDIDOS ou ID_PEDIDO único.
 */
export function loadPedidoIds(prefix, fallbackIdEnv = "OFICIOS_ID_PEDIDO") {
  const jsonRaw = envStr(`${prefix}PEDIDOS_JSON`);
  if (jsonRaw) {
    let data;
    try {
      data = JSON.parse(jsonRaw);
    } catch (err) {
      throw new Error(`${prefix}PEDIDOS_JSON inválido: ${err.message}`);
    }
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error(`${prefix}PEDIDOS_JSON deve ser um array JSON não vazio.`);
    }
    return data.map((row, i) => parseIdPedido(row, `Item ${i}`));
  }

  const idsRaw = envStr(`${prefix}ID_PEDIDOS`);
  if (idsRaw) {
    const parts = idsRaw
      .split(/[,;\s]+/)
      .map((p) => p.trim())
      .filter(Boolean);
    if (!parts.length) {
      throw new Error(`${prefix}ID_PEDIDOS está vazio.`);
    }
    return parts.map((p) => parseIdPedido(p, "ID_PEDIDOS"));
  }

  const single = envInt(`${prefix}ID_PEDIDO`) ?? envInt(fallbackIdEnv);
  if (single !== undefined) {
    return [single];
  }

  throw new Error(
    `Defina ${prefix}PEDIDOS_JSON, ${prefix}ID_PEDIDOS ou ${prefix}ID_PEDIDO no .env.`
  );
}

/** Monta Pedidos conforme ArrayOfInt do WSDL (`wsdl/oficios.wsdl`). */
export function buildPedidosArrayOfInt(ids) {
  return { [ARRAY_OF_INT_ITEM]: ids };
}
