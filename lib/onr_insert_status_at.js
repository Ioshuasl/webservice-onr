/** Montagem do oRequest InsertStatusAT (ordem e campos exigidos pelo WSDL/.NET). */

export const INSERT_STATUS_FIELD_ORDER = [
  "Hash",
  "IDTitulo",
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
export function buildInsertStatusRequest(hashValue, cfg) {
  const values = {
    Hash: hashValue,
    IDTitulo: cfg.idTitulo,
    IDTipoStatus: cfg.idTipoStatus,
    DataStatus: cfg.dataStatus,
    DescricaoStatus: strField(cfg.descricaoStatus),
  };
  return Object.fromEntries(
    INSERT_STATUS_FIELD_ORDER.map((key) => [key, values[key]])
  );
}
