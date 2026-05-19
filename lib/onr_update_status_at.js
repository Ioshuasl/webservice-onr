/** Montagem do oRequest UpdateStatusAT (ordem e campos exigidos pelo WSDL/.NET). */

export const UPDATE_STATUS_FIELD_ORDER = [
  "Hash",
  "IDStatus",
  "IDTipoStatus",
  "DataStatus",
  "DescricaoStatus",
];

function strField(value) {
  return String(value ?? "").trim();
}

/**
 * Monta oRequest com todos os elementos do WSDL.
 * Elementos opcionais omitidos no XML podem gerar erro genérico (código 0) no .NET.
 */
export function buildUpdateStatusRequest(hashValue, cfg) {
  const values = {
    Hash: hashValue,
    IDStatus: cfg.idStatus,
    IDTipoStatus: cfg.idTipoStatus,
    DataStatus: cfg.dataStatus,
    DescricaoStatus: strField(cfg.descricaoStatus),
  };
  return Object.fromEntries(
    UPDATE_STATUS_FIELD_ORDER.map((key) => [key, values[key]])
  );
}
