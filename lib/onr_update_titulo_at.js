/** Montagem do oRequest UpdateTituloAT (ordem e campos exigidos pelo WSDL/.NET). */

export const UPDATE_TITULO_FIELD_ORDER = [
  "Hash",
  "IDTitulo",
  "Protocolo",
  "ApresentanteNome",
  "ApresentanteEmail",
  "ApresentanteDDDTelefone",
  "ApresentanteNumeroTelefone",
  "ApresentanteCPFCNPJ",
  "ValorDeposito",
  "ValorEmolumentos",
  "DataProtocolo",
  "DataPrevisaoEntrega",
  "ModoNotificacaoStatus",
  "InteressadoNome",
  "InteressadoCPFCNPJ",
  "NaturezaTitulo",
  "CodigoVerificador",
  "TipoSolicitacao",
];

function strField(value) {
  return String(value ?? "").trim();
}

function decimalField(value) {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? Number(n.toFixed(2)) : 0;
}

/**
 * Monta oRequest com todos os elementos do WSDL.
 * Elementos opcionais omitidos no XML podem gerar erro genérico (código 0) no .NET.
 */
export function buildUpdateTituloRequest(hashValue, cfg) {
  const values = {
    Hash: hashValue,
    IDTitulo: cfg.idTitulo,
    Protocolo: cfg.protocolo,
    ApresentanteNome: cfg.apresentanteNome,
    ApresentanteEmail: strField(cfg.apresentanteEmail),
    ApresentanteDDDTelefone: strField(cfg.apresentanteDdd),
    ApresentanteNumeroTelefone: strField(cfg.apresentanteTelefone),
    ApresentanteCPFCNPJ: strField(cfg.apresentanteCpfcnpj),
    ValorDeposito: decimalField(cfg.valorDeposito),
    ValorEmolumentos: decimalField(cfg.valorEmolumentos),
    DataProtocolo: cfg.dataProtocolo,
    DataPrevisaoEntrega: cfg.dataPrevisaoEntrega,
    ModoNotificacaoStatus: cfg.modoNotificacao,
    InteressadoNome: cfg.interessadoNome,
    InteressadoCPFCNPJ: strField(cfg.interessadoCpfcnpj),
    NaturezaTitulo: cfg.naturezaTitulo,
    CodigoVerificador: strField(cfg.codigoVerificador),
    TipoSolicitacao: cfg.tipoSolicitacao,
  };
  return Object.fromEntries(
    UPDATE_TITULO_FIELD_ORDER.map((key) => [key, values[key]])
  );
}
