#!/usr/bin/env node
/**
 * Gera documentação Obsidian — WS Assinador ONR (32 operações IAssinador).
 * Fonte: wsdl/assinador-onr.wsdl + assinador-onr/manual-endpoint-assinador-.md
 *
 * npm run vault:sync-assinador-docs
 */
const fs = require("fs");
const path = require("path");

const REPO = path.resolve(__dirname, "..");
const VAULT_ROOT = path.join(
  process.env.OBSIDIAN_VAULT || "C:/Users/kenio/Obsidian Vault",
  "Orius/integracoes/registro-imoveis/onr/webservice-assinador"
);

const NS = "http://wsassinador.arisp.com.br";
const ENDPOINT = "http://wsassinador.onr.org.br/Assinador.svc";
const WSDL_LOCAL = "wsdl/assinador-onr.wsdl";

const DOMAINS = {
  diagnostico: {
    title: "Diagnóstico / WCF",
    sigla: "diag",
    guia: null,
    wsoficio: null,
  },
  certidao: {
    title: "Certidão digital",
    sigla: "cert",
    guia: "§1 Certidão Digital",
    wsoficio: "Certidoes.asmx — *_DocID_V2",
  },
  oficio: {
    title: "Ofício eletrônico",
    sigla: "ofic",
    guia: "§2 Ofício",
    wsoficio: "oficios.asmx",
  },
  "penhora-sph": {
    title: "Penhora online — SPH",
    sigla: "sph",
    guia: "§3 Penhora SPH",
    wsoficio: "penhoraonline.asmx",
  },
  "penhora-ph": {
    title: "Penhora online — PH",
    sigla: "ph",
    guia: "§4 Penhora PH",
    wsoficio: "penhoraonline.asmx — SetPenhora*_DocID",
  },
  eprotocolo: {
    title: "E-Protocolo (AC)",
    sigla: "ac",
    guia: "§5 E-Protocolo",
    wsoficio: "eprotocolo.asmx — SetContrato*_DocID",
  },
  lotes: {
    title: "Lotes / histórico",
    sigla: "lot",
    guia: "Consultar lotes",
    wsoficio: null,
  },
  transversal: {
    title: "Transversal (vários fluxos)",
    sigla: "trx",
    guia: "Todos os fluxos UI",
    wsoficio: "DocumentID nos *_DocID",
  },
  infra: {
    title: "Infraestrutura",
    sigla: "inf",
    guia: null,
    wsoficio: null,
  },
  cdhu: {
    title: "CDHU (caso especial)",
    sigla: "cdhu",
    guia: null,
    wsoficio: null,
  },
};

/** @type {Array<object>} */
const OPERATIONS = [
  {
    name: "GetData",
    domain: "diagnostico",
    tipo: "Leitura / teste",
    auth: "none",
    summary: "Endpoint de teste WCF — não usar em produção.",
    inputs: [{ name: "value", type: "int", req: true, desc: "Valor inteiro de teste" }],
    outputs: [{ name: "GetDataResult", type: "string", desc: "Echo" }],
    automacao: "nao",
  },
  {
    name: "GetDataUsingDataContract",
    domain: "diagnostico",
    tipo: "Leitura / teste",
    auth: "none",
    summary: "Teste WCF com DataContract — não usar em produção.",
    inputs: [{ name: "composite", type: "CompositeType", req: true, desc: "Objeto de teste WCF" }],
    outputs: [{ name: "GetDataUsingDataContractResult", type: "CompositeType", desc: "Echo" }],
    automacao: "nao",
  },
  {
    name: "ObterVersao",
    domain: "diagnostico",
    tipo: "Leitura",
    auth: "none",
    summary: "Retorna versão do serviço Assinador (diagnóstico de conectividade).",
    inputs: [],
    outputs: [{ name: "ObterVersaoResult", type: "string", desc: "Ex.: 201807181715" }],
    automacao: "facade",
    notas: "Usado em health-check antes de proxies n8n.",
  },
  {
    name: "ListarSolicitacoes",
    domain: "certidao",
    tipo: "Consulta",
    auth: "hash",
    summary: "Lista pedidos de certidão digital da instituição.",
    inputs: [
      { name: "idInstituicao", type: "int", req: true, desc: "ID cartório (login → IDInstituicao)" },
      { name: "protocolo", type: "string", req: false, desc: "Filtro ex. S20120000001D" },
      { name: "hash", type: "string", req: true, desc: "SHA1(chave + token login WSOficio)" },
    ],
    outputs: [
      { name: "Mensagem.Codigo", type: "int", desc: "0 = OK" },
      { name: "Mensagem.Descricao", type: "string", desc: "Texto" },
      { name: "Solicitacoes[]", type: "Solicitacao", desc: "Protocolo, Matricula, StatusSolicitacao, …" },
    ],
    automacao: "pending",
  },
  {
    name: "InserirAnexoSolicitacao",
    domain: "certidao",
    tipo: "Escrita",
    auth: "hash",
    summary: "Anexa arquivo a solicitação de certidão já identificada.",
    inputs: [
      { name: "IdSolicitacao", type: "int", req: true, desc: "ID da solicitação" },
      { name: "NomeArquivo", type: "string", req: true, desc: "Nome do arquivo" },
      { name: "ExtensaoArquivo", type: "string", req: true, desc: "Extensão" },
      { name: "Arquivo", type: "base64Binary", req: true, desc: "Conteúdo" },
      { name: "hash", type: "string", req: true, desc: "Hash de sessão" },
    ],
    outputs: [
      { name: "Mensagem.Codigo", type: "int", desc: "Código retorno" },
      { name: "Mensagem.Descricao", type: "string", desc: "Descrição" },
    ],
    automacao: "pending",
  },
  {
    name: "ListarSolicitacoesOficio",
    domain: "oficio",
    tipo: "Consulta",
    auth: "hash",
    summary: "Lista pedidos de ofício eletrônico.",
    inputs: [
      { name: "idInstituicao", type: "int", req: true, desc: "ID cartório" },
      { name: "protocolo", type: "string", req: false, desc: "Ex. 2101000001" },
      { name: "hash", type: "string", req: true, desc: "Hash de sessão" },
    ],
    outputs: [
      { name: "Mensagem", type: "MensagemRetorno", desc: "Codigo, Descricao" },
      { name: "Solicitacoes[]", type: "Pedido", desc: "Protocolo, StatusPedido, NOficio, …" },
    ],
    automacao: "pending",
  },
  {
    name: "ListarSolicitacoesPenhora",
    domain: "penhora-sph",
    tipo: "Consulta",
    auth: "hash",
    summary: "Lista pedidos penhora SPH (prefixo SPH…).",
    inputs: [
      { name: "idInstituicao", type: "int", req: true, desc: "ID cartório" },
      { name: "protocolo", type: "string", req: false, desc: "Ex. SPH21010000001D" },
      { name: "hash", type: "string", req: true, desc: "Hash de sessão" },
    ],
    outputs: [
      { name: "Solicitacoes[]", type: "SolicitacaoPenhora", desc: "Estrutura Assinador.DAL.BE" },
    ],
    automacao: "pending",
  },
  {
    name: "ListarSolicitacoesStatusPO",
    domain: "penhora-ph",
    tipo: "Consulta",
    auth: "Hash",
    summary: "Consulta status do pedido PH antes de responder (averbação ou nota N).",
    inputs: [
      { name: "ProtocoloPenhora", type: "string", req: true, desc: "PH000007167 ou PH000007167N" },
      { name: "IdInstituicao", type: "int", req: true, desc: "ID cartório" },
      { name: "Hash", type: "string", req: true, desc: "Hash de sessão (capital H no XSD)" },
    ],
    outputs: [
      { name: "ProtocoloPedido", type: "string", desc: "Protocolo" },
      { name: "DescricaoStatusCompleto", type: "string", desc: "Ex. Pagamento Efetivado" },
      { name: "Prenotado", type: "boolean", desc: "Flag prenotação" },
      { name: "Matriculas[]", type: "string", desc: "Matrículas do pedido" },
      { name: "Mensagem", type: "MensagemRetorno", desc: "Codigo, Descricao" },
    ],
    automacao: "pending",
  },
  {
    name: "SetPenhoraAverbadoPO",
    domain: "penhora-ph",
    tipo: "Escrita",
    auth: "hash_uddi",
    summary: "Responde penhora PH com averbação/registro (arquivo sem sufixo N).",
    inputs: [
      { name: "oRequest.HASH_Autenticacao", type: "string", req: true, desc: "Credencial ONR" },
      { name: "oRequest.HASH_UDDI", type: "string", req: true, desc: "Chave integração / UDDI" },
      { name: "oRequest.IDCartorio", type: "int", req: true, desc: "ID cartório" },
      { name: "oRequest.nrProtocolo", type: "string", req: true, desc: "PH000007167" },
      { name: "oRequest.NomeArquivo", type: "string", req: true, desc: "Nome do PDF" },
      { name: "oRequest.Matricula", type: "string", req: "cond", desc: "Se várias matrículas" },
      { name: "oRequest.Resposta", type: "string", req: true, desc: "Texto da resposta" },
      { name: "oRequest.file", type: "base64Binary", req: true, desc: "PDF assinado" },
    ],
    outputs: [
      { name: "OK", type: "boolean", desc: "Sucesso" },
      { name: "ID", type: "int", desc: "ID anexo / documento" },
      { name: "Erro", type: "string", desc: "Mensagem de erro" },
    ],
    automacao: "pending",
    wsoficioAlt: "SetPenhoraAverbadoPO_DocID no WSOficio",
  },
  {
    name: "SetPenhoraExigenciaPO",
    domain: "penhora-ph",
    tipo: "Escrita",
    auth: "hash_uddi",
    summary: "Responde penhora PH com nota de exigência (protocolo com sufixo N).",
    inputs: [
      { name: "oRequest.HASH_Autenticacao", type: "string", req: true, desc: "Credencial ONR" },
      { name: "oRequest.HASH_UDDI", type: "string", req: true, desc: "UDDI" },
      { name: "oRequest.IDCartorio", type: "int", req: true, desc: "ID cartório" },
      { name: "oRequest.nrProtocolo", type: "string", req: true, desc: "PH000007167N" },
      { name: "oRequest.NomeArquivo", type: "string", req: true, desc: "Nome arquivo" },
      { name: "oRequest.file", type: "base64Binary", req: true, desc: "PDF assinado" },
    ],
    outputs: [
      { name: "OK", type: "boolean", desc: "Sucesso" },
      { name: "ID", type: "int", desc: "ID" },
      { name: "Erro", type: "string", desc: "Erro" },
    ],
    automacao: "pending",
  },
  {
    name: "ListarSolicitacoesEProtocolo",
    domain: "eprotocolo",
    tipo: "Consulta",
    auth: "Hash",
    summary: "Consulta contrato e-protocolo (AC…) antes de enviar resposta.",
    inputs: [
      { name: "nrProtocolo", type: "string", req: true, desc: "Ex. AC000570464" },
      { name: "IdInstituicao", type: "int", req: true, desc: "ID cartório" },
      { name: "Hash", type: "string", req: true, desc: "Hash de sessão" },
    ],
    outputs: [
      { name: "Contrato", type: "ContratoACResult", desc: "Protocolo, Status, IdStatus, ID" },
    ],
    automacao: "pending",
  },
  {
    name: "SetContratoExigenciaAC",
    domain: "eprotocolo",
    tipo: "Escrita",
    auth: "hash_uddi",
    summary: "Nota de exigência e-protocolo (protocolo …N).",
    inputs: [
      { name: "oRequest.ProtocoloContrato", type: "string", req: true, desc: "AC000570464N" },
      { name: "oRequest.Descricao", type: "string", req: true, desc: "Descrição" },
      { name: "oRequest.Resposta", type: "string", req: true, desc: "Resposta" },
      { name: "oRequest.file", type: "base64Binary", req: true, desc: "PDF" },
      { name: "oRequest.HASH_*", type: "string", req: true, desc: "HASH_Autenticacao, HASH_UDDI, IDCartorio" },
    ],
    outputs: [{ name: "OK", type: "boolean" }, { name: "ID", type: "int" }, { name: "Erro", type: "string" }],
    automacao: "pending",
  },
  {
    name: "SetContratoAverbadoAC",
    domain: "eprotocolo",
    tipo: "Escrita",
    auth: "hash_uddi",
    summary: "Averbação/registro e-protocolo (AC…, …T, …X — um call por arquivo).",
    inputs: [
      { name: "oRequest.ProtocoloContrato", type: "string", req: true, desc: "AC000570464 / …T / …X" },
      { name: "oRequest.file", type: "base64Binary", req: true, desc: "PDF assinado" },
      { name: "oRequest.HASH_*", type: "string", req: true, desc: "HASH_Autenticacao, HASH_UDDI, IDCartorio" },
    ],
    outputs: [{ name: "OK", type: "boolean" }, { name: "ID", type: "int" }, { name: "NomeArquivo", type: "string" }],
    automacao: "pending",
  },
  {
    name: "ListarPedidosClientes",
    domain: "lotes",
    tipo: "Consulta",
    auth: "hash",
    summary: "Lista lotes/pedidos do cliente por período (histórico UI «Responder lote»).",
    inputs: [
      { name: "IdInstituicao", type: "int", req: true, desc: "ID cartório" },
      { name: "dtPedidoInicial", type: "dateTime", req: true, desc: "Início período" },
      { name: "dtPedidoFinal", type: "dateTime", req: true, desc: "Fim período" },
      { name: "hash", type: "string", req: true, desc: "Hash de sessão" },
    ],
    outputs: [{ name: "Pedidos[]", type: "PedidoCliente", desc: "Numero, DataPedido, ID" }],
    automacao: "pending",
  },
  {
    name: "ListarAnexosSolicitacoes",
    domain: "lotes",
    tipo: "Consulta",
    auth: "hash",
    summary: "Detalhe de anexos de um lote/solicitação (download, hash protocolo).",
    inputs: [
      { name: "IdSolicitacao", type: "int", req: true, desc: "ID solicitação" },
      { name: "hash", type: "string", req: true, desc: "Hash de sessão" },
    ],
    outputs: [{ name: "Anexos[]", type: "AnexoSolicitacao", desc: "ID, Nome, Chave, Descricao" }],
    automacao: "pending",
  },
  {
    name: "ValidarArquivoOficial",
    domain: "transversal",
    tipo: "Validação",
    auth: "none",
    summary: "Valida PDF + protocolo (nome arquivo = protocolo). Equivalente UI «Pronto para assinar» / «Arquivo recusado».",
    inputs: [
      { name: "file", type: "base64Binary", req: true, desc: "PDF" },
      { name: "strProtocolo", type: "string", req: true, desc: "Nome sem .pdf — ex. S…D, PH…N, certidao-1234" },
    ],
    outputs: [
      { name: "Mensagem.Codigo", type: "int", desc: "0 = válido" },
      { name: "Mensagem.Descricao", type: "string", desc: "Motivo recusa" },
      { name: "IDCartorio", type: "int", desc: "Cartório identificado" },
      { name: "token", type: "string", desc: "Token auxiliar assinatura" },
    ],
    automacao: "pending",
    guiaFluxos: "Certidão, Ofício, SPH, PH, AC, Balcão RI, SEIC",
  },
  {
    name: "PADES_CadastrarArquivo",
    domain: "transversal",
    tipo: "Escrita",
    auth: "hash_uddi",
    summary: "Cadastra PDF no pipeline PAdES → retorna ID usado como DocumentID no WSOficio (*_DocID_V2).",
    inputs: [
      { name: "oRequest.HASH_Autenticacao", type: "string", req: true, desc: "Pendente ONR (homologação)" },
      { name: "oRequest.HASH_UDDI", type: "string", req: true, desc: "Chave integração" },
      { name: "oRequest.IDCartorio", type: "int", req: true, desc: "2492 (HML teste)" },
      { name: "oRequest.file", type: "base64Binary", req: true, desc: "PDF assinado/padronizado" },
    ],
    outputs: [
      { name: "OK", type: "boolean", desc: "Sucesso" },
      { name: "ID", type: "int", desc: "→ document_id / DocumentID WSOficio" },
      { name: "NomeArquivo", type: "string", desc: "Nome registrado" },
      { name: "Erro", type: "string", desc: "Ex. 45: Hash inválido" },
    ],
    automacao: "pending",
    wsoficioAlt: "EnviarAnexosCertidao_DocID_V2 (AUTONR-50)",
  },
  {
    name: "ValidarPedidoCertidaoCDHU",
    domain: "cdhu",
    tipo: "Validação",
    auth: "hash",
    summary: "Fluxo CDHU — fora do manual Assinador Web v2.3.",
    inputs: [
      { name: "codPedido", type: "string", req: true, desc: "Código pedido CDHU" },
      { name: "hash", type: "string", req: true, desc: "Hash de sessão" },
    ],
    outputs: [{ name: "Mensagem", type: "MensagemRetorno", desc: "Codigo, Descricao" }],
    automacao: "nao",
  },
  {
    name: "ObterTokensOficial",
    domain: "infra",
    sub: "validacao",
    tipo: "Infra",
    auth: "hash_auth_only",
    summary: "Obtém tokens para assinatura oficial a partir do PDF.",
    inputs: [
      { name: "file", type: "base64Binary", req: true, desc: "PDF" },
      { name: "HASH_Autenticacao", type: "string", req: true, desc: "Credencial ONR" },
    ],
    outputs: [{ name: "ValidarArquivoOficialResponse", type: "complex", desc: "Tokens / metadados" }],
    automacao: "nao",
  },
  {
    name: "ValidarArquivoAssinado",
    domain: "infra",
    sub: "validacao",
    tipo: "Validação",
    auth: "hash_uddi",
    summary: "Valida P7S/PDF já assinado.",
    inputs: [
      { name: "file", type: "base64Binary", req: true, desc: "Arquivo assinado" },
      { name: "Protocolo", type: "string", req: true, desc: "Protocolo" },
      { name: "HASH_Autenticacao", type: "string", req: true, desc: "Auth" },
      { name: "HASH_UDDI", type: "string", req: true, desc: "UDDI" },
      { name: "CPF", type: "string", req: true, desc: "CPF signatário" },
    ],
    outputs: [
      { name: "OK", type: "boolean", desc: "Válido" },
      { name: "Assinaturas", type: "complex", desc: "Detalhe assinaturas" },
      { name: "DocumentoBase64", type: "string", desc: "Documento" },
    ],
    automacao: "nao",
  },
  {
    name: "TipoArquivoAssinado",
    domain: "infra",
    sub: "tipos",
    tipo: "Infra",
    auth: "none",
    summary: "Detecta tipo MIME do arquivo a partir de Base64.",
    inputs: [{ name: "fileBase64", type: "string", req: true, desc: "Arquivo Base64" }],
    outputs: [{ name: "TipoArquivo", type: "string", desc: "Tipo detectado" }],
    automacao: "nao",
  },
  {
    name: "TipoAnexoAssinado",
    domain: "infra",
    sub: "tipos",
    tipo: "Infra",
    auth: "none",
    summary: "Tipo de anexo a partir de IdAnexoP7S.",
    inputs: [{ name: "IdAnexoP7S", type: "int", req: true, desc: "ID anexo P7S" }],
    outputs: [{ name: "boolean", type: "boolean", desc: "É assinado" }, { name: "TipoArquivo", type: "string" }],
    automacao: "nao",
  },
  {
    name: "TipoAnexoTempURL",
    domain: "infra",
    sub: "tipos",
    tipo: "Infra",
    auth: "none",
    summary: "Tipo de anexo a partir de URL temporária.",
    inputs: [{ name: "TempURL", type: "string", req: true, desc: "URL temp" }],
    outputs: [{ name: "boolean", type: "boolean" }, { name: "TipoArquivo", type: "string" }],
    automacao: "nao",
  },
  {
    name: "GetTimeStamp",
    domain: "infra",
    sub: "carimbo",
    tipo: "Infra",
    auth: "token",
    summary: "Carimbo de tempo — variante com campos soltos.",
    inputs: [
      { name: "TokenUsuario", type: "string", req: true, desc: "Token carimbo" },
      { name: "Base64Binary", type: "string", req: true, desc: "Documento" },
      { name: "DocumentoSolicitante", type: "string", req: false, desc: "CPF/CNPJ" },
      { name: "Protocolo", type: "string", req: false, desc: "Protocolo" },
      { name: "Origem", type: "string", req: false, desc: "Origem" },
    ],
    outputs: [{ name: "Timestamp", type: "string" }, { name: "Erro", type: "string" }],
    automacao: "nao",
  },
  {
    name: "GetTimeStamp2",
    domain: "infra",
    sub: "carimbo",
    tipo: "Infra",
    auth: "token",
    summary: "Carimbo de tempo — request `tspRequest` encapsulado.",
    inputs: [{ name: "tspRequest", type: "TSPRequest", req: true, desc: "base64Binary, protocolo, tokenUsuario, origem" }],
    outputs: [{ name: "TimestampResponse", type: "complex", desc: "Timestamp, Erro" }],
    automacao: "nao",
  },
  {
    name: "GetTimeStampFromBase64",
    domain: "infra",
    sub: "carimbo",
    tipo: "Infra",
    auth: "token",
    summary: "Carimbo de tempo a partir de request Base64.",
    inputs: [{ name: "tspRequestBase64", type: "string", req: true, desc: "Request serializado" }],
    outputs: [{ name: "TimestampResponse", type: "complex", desc: "Timestamp, Erro" }],
    automacao: "nao",
  },
  {
    name: "ObterAtributoAmplia",
    domain: "infra",
    sub: "amplia",
    tipo: "Infra",
    auth: "none",
    summary: "Consulta certificado de atributo Amplia por CPF.",
    inputs: [{ name: "cpf", type: "string", req: true, desc: "CPF" }],
    outputs: [
      { name: "AtributoJSON", type: "string", desc: "JSON atributo" },
      { name: "ContemAtributo", type: "boolean", desc: "Possui atributo" },
    ],
    automacao: "nao",
  },
  {
    name: "GerarAtributoAmplia",
    domain: "infra",
    sub: "amplia",
    tipo: "Infra",
    auth: "none",
    summary: "Gera certificado de atributo ONR (dados cartório + signatário).",
    inputs: [{ name: "dados", type: "DadosAtributo", req: true, desc: "CPF, Nome, Funcao, DadosCartorio (CNS, …)" }],
    outputs: [{ name: "AssinadorResponse", type: "complex", desc: "Retorno Amplia" }],
    automacao: "nao",
  },
  {
    name: "CriptografarDados",
    domain: "infra",
    sub: "criptografia",
    tipo: "Auxiliar",
    auth: "hash",
    summary: "Criptografia auxiliar — possível derivação de credenciais.",
    inputs: [
      { name: "dados", type: "string", req: true, desc: "Texto a criptografar" },
      { name: "hash", type: "string", req: true, desc: "Hash de sessão" },
    ],
    outputs: [{ name: "Dado", type: "string", desc: "Dado criptografado" }, { name: "Mensagem", type: "string" }],
    automacao: "nao",
  },
  {
    name: "DescriptografarDados",
    domain: "infra",
    sub: "criptografia",
    tipo: "Auxiliar",
    auth: "hash",
    summary: "Descriptografia auxiliar (par de CriptografarDados).",
    inputs: [
      { name: "dados", type: "string", req: true, desc: "Texto criptografado" },
      { name: "hash", type: "string", req: true, desc: "Hash de sessão" },
    ],
    outputs: [{ name: "Dado", type: "string", desc: "Texto claro" }],
    automacao: "nao",
  },
  {
    name: "CriptografarChaveCartorio",
    domain: "infra",
    sub: "criptografia",
    tipo: "Auxiliar",
    auth: "hash",
    summary: "Criptografia de chave cartório — investigar relação com HASH_Autenticacao.",
    inputs: [
      { name: "dados", type: "string", req: true, desc: "Dados" },
      { name: "hash", type: "string", req: true, desc: "Hash" },
    ],
    outputs: [{ name: "Dado", type: "string" }, { name: "Mensagem", type: "string" }],
    automacao: "nao",
  },
  {
    name: "DescriptografarChaveCartorio",
    domain: "infra",
    sub: "criptografia",
    tipo: "Auxiliar",
    auth: "hash",
    summary: "Descriptografia de chave cartório.",
    inputs: [
      { name: "dados", type: "string", req: true, desc: "Dados" },
      { name: "hash", type: "string", req: true, desc: "Hash" },
    ],
    outputs: [{ name: "Dado", type: "string" }],
    automacao: "nao",
  },
];

function authSection(op) {
  const lines = ["## Autenticação", ""];
  switch (op.auth) {
    case "none":
      lines.push("Sem parâmetro de hash no envelope (confirmado no WSDL).");
      break;
    case "hash":
      lines.push(
        "Parâmetro **`hash`** (minúsculo) — hash de sessão.",
        "",
        "Cálculo provável (modelo WSOficio): `SHA1(ASSINADOR_CHAVE_INTEGRACAO + token)` após `LoginUsuarioCertificado`.",
        "",
        "Ver [[hash]] · credenciais em `env.md` § Assinador Web ONR."
      );
      break;
    case "Hash":
      lines.push(
        "Parâmetro **`Hash`** (capital H no XSD) — mesmo modelo do `hash` minúsculo.",
        "",
        "Ver [[hash]]."
      );
      break;
    case "hash_uddi":
      lines.push(
        "Objeto **`oRequest`** (namespace `http://schemas.datacontract.org/2004/07/WSAssinador`):",
        "",
        "| Campo | Descrição |",
        "|-------|-----------|",
        "| `HASH_Autenticacao` | Credencial aplicação ONR — **pendente homologação** |",
        "| `HASH_UDDI` | Chave integração / UDDI |",
        "| `IDCartorio` | ID instituição (login → `IDInstituicao`, ex. 2492) |",
        "",
        "Erro comum: **45** — Hash inválido (teste 2026-06-15)."
      );
      break;
    case "hash_auth_only":
      lines.push("Parâmetro **`HASH_Autenticacao`** no body (sem `HASH_UDDI`).");
      break;
    case "token":
      lines.push("Usa **`TokenUsuario`** / token no objeto `tspRequest` — carimbo de tempo.");
      break;
    default:
      lines.push("_Ver [[hash]]._");
  }
  return lines.join("\n");
}

function paramTable(params, title) {
  if (!params?.length) return "";
  const rows = params
    .map((p) => {
      const req = p.req === "cond" ? "condicional" : p.req ? "sim" : "não";
      return `| \`${p.name}\` | ${p.desc || "—"} | ${p.type} | ${req} | — |`;
    })
    .join("\n");
  return `## ${title}\n\n| Campo | Descrição | Tipo | Obrigatório | Exemplo |\n|-------|-----------|------|-------------|---------|\n${rows}\n`;
}

function methodBody(op) {
  const dom = DOMAINS[op.domain];
  const soapAction = `${NS}/IAssinador/${op.name}`;
  const relDom = op.sub ? `${op.domain}/${op.sub}` : op.domain;
  const lines = [
    `# ${op.name}`,
    "",
    `Operação **IAssinador** — ${dom.title}.`,
    "",
    "## Resumo",
    "",
    "| Campo | Valor |",
    "|-------|-------|",
    `| Tipo | ${op.tipo} |`,
    `| Domínio | ${dom.title} |`,
    `| Operação SOAP | \`${op.name}\` |`,
    `| SOAPAction | \`${soapAction}\` |`,
    `| Automação n8n | \`${op.automacao}\` |`,
    "",
    op.summary,
    "",
    "## Serviço",
    "",
    `- **Endpoint:** \`${ENDPOINT}\``,
    `- **WSDL local:** \`${WSDL_LOCAL}\``,
    `- **Namespace:** \`${NS}\``,
    `- **Postman:** \`postman/assinador-onr.postman_collection.json\``,
    "",
    authSection(op),
    "",
  ];

  if (dom.guia) {
    lines.push(
      "## Fluxo UI (guia Assinador Web)",
      "",
      `Seção [[../../../../onr-assinador-web-guia|guia Assinador Web]]: **${dom.guia}**.`,
      ...(op.guiaFluxos ? ["", `Também usado em: ${op.guiaFluxos}.`] : []),
      ""
    );
  }

  if (op.wsoficioAlt || dom.wsoficio) {
    lines.push(
      "## Relação WSOficio",
      "",
      ...(op.wsoficioAlt ? [`- Alternativa: **${op.wsoficioAlt}**`] : []),
      ...(dom.wsoficio ? [`- Módulo irmão: \`${dom.wsoficio}\``] : []),
      "- Índice WSOficio: [[../../webservice-wsoficio/00-indice-wsoficio]]",
      ""
    );
  }

  lines.push(paramTable(op.inputs, "Parâmetros de entrada"));
  lines.push(paramTable(op.outputs, "Parâmetros de saída"));

  if (op.notas) {
    lines.push("## Notas", "", op.notas, "");
  }

  lines.push(
    "## Automação n8n (futuro)",
    "",
    "| Artefato | Caminho previsto |",
    "|----------|------------------|",
    `| Workflow | \`workflows/n8n/extensao-n8n-teste/${op.name} Assinador ONR.workflow.ts\` |`,
    `| Utilização vault | \`automacao/utilizacao/${op.name}.md\` |`,
    `| Desenvolvimento vault | \`automacao/desenvolvimento/${op.name}.md\` |`,
    "| Roadmap | [[../../webservice-wsoficio/automacao/roadmap-assinador-onr-n8n]] |",
    "",
    "Ver [[../../../../onr-assinador-web-endpoints|manual SOAP repo]] · regenerar Postman: `npm run postman:build:assinador`.",
    "",
    "---",
    "",
    `Voltar: [[metodos/${relDom}/00-indice-${op.domain}${op.sub ? `-${op.sub}` : ""}|${dom.title}]] · [[../../00-indice-assinador]]`
  );

  return lines.join("\n");
}

function frontmatter(op) {
  return `---
tipo: metodo
area: orius
central: onr
protocolo: soap
servico: wsassinador
operacao: ${op.name}
dominio: ${op.domain}
plane_automation_status: ${op.automacao === "pending" ? "pending" : op.automacao === "facade" ? "planned" : "nao"}
fonte_repositorio: C:/Users/kenio/automacoes e testes
atualizado: 2026-06-15
---

`;
}

function writeFile(rel, content) {
  const full = path.join(VAULT_ROOT, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, "utf8");
  return full;
}

function domainIndex(domainKey, ops) {
  const dom = DOMAINS[domainKey];
  const list = ops
    .map((o) => {
      const sub = o.sub ? `${domainKey}/${o.sub}/` : `${domainKey}/`;
      return `- [[${sub}${o.name}]] — ${o.tipo}`;
    })
    .join("\n");
  return `---
tipo: indice
area: orius
central: onr
protocolo: soap
servico: wsassinador
dominio: ${domainKey}
tags: [orius, onr, assinador, ${dom.sigla}, metodos]
---

# ${dom.title} — WS Assinador

${dom.guia ? `Guia operador: [[../../../../onr-assinador-web-guia|Assinador Web § ${dom.guia}]].` : ""}
${dom.wsoficio ? `\nPar WSOficio: \`${dom.wsoficio}\`.` : ""}

Voltar: [[../README|Métodos por domínio]] · [[../../00-indice-assinador]]

## Operações (${ops.length})

${list}
`;
}

function main() {
  const dryRun = process.argv.includes("--dry-run");
  let count = 0;

  if (dryRun) console.log(`[dry-run] Vault: ${VAULT_ROOT}\n`);

  // visao-geral
  writeFile(
    "visao-geral.md",
    `---
tipo: referencia
area: orius
central: onr
protocolo: soap
servico: wsassinador
produto: imoveis
tags: [orius, onr, assinador-web, wsassinador, visao-geral]
status: revisado
atualizado: 2026-06-15
---

# WS Assinador ONR — visão geral

Web Service SOAP **IAssinador** (\`wsassinador.onr.org.br\`) — backend do **Assinador Web ONR** (PAdES, validação PDF, carimbo, cadastro de anexos, resposta direta a pedidos).

## Fonte da verdade

**Obsidian** — pasta [[00-indice-assinador|webservice-assinador]].  
Código, WSDL, Postman: \`C:\\Users\\kenio\\automacoes e testes\`

## UI vs SOAP

| Canal | URL | Auth |
|-------|-----|------|
| UI HML | https://assinador-web.hml.onr.org.br/ | Certificado A3 + PIN |
| UI prod | https://oficioeletronico.com.br/ | Certificado A3 + PIN |
| SOAP | http://wsassinador.onr.org.br/Assinador.svc | \`hash\` / \`HASH_Autenticacao\` + \`HASH_UDDI\` |

## Dois caminhos de integração

1. **UI** — operador renomeia PDF com protocolo → upload → pedido respondido **sem** WSOficio.
2. **SOAP + Orius** — \`ValidarArquivoOficial\` → \`PADES_CadastrarArquivo\` → \`DocumentID\` → proxies WSOficio \`*_DocID_V2\`.

Hub: [[../../onr-assinador-web]] · Guia: [[../../onr-assinador-web-guia]]

## Ambiente

| Item | Valor |
|------|--------|
| SOAP (prod) | \`${ENDPOINT}\` |
| SOAP HML | _Não encontrado_ (404 em hml3-wsoficio) |
| Credenciais HML | \`env.md\` § Assinador Web ONR |
| Login tokens | \`hml3-wsoficio.onr.org.br/login.asmx\` |

## Automação n8n

Roadmap: [[automacao/roadmap-assinador-onr-n8n]] (link simbólico — arquivo em \`onr/webservice-wsoficio/automacao/\` até Fase 1).

Postman: \`postman/assinador-onr.postman_collection.json\`

## Documentos

- [[00-indice-assinador]] — 32 operações
- [[hash]] — autenticação
- [[metodos/README]] — por domínio de negócio
`
  );
  count++;

  writeFile(
    "hash.md",
    `---
tipo: referencia
area: orius
central: onr
protocolo: soap
servico: wsassinador
tags: [orius, onr, assinador, hash, autenticacao]
atualizado: 2026-06-15
---

> **Credenciais HML:** \`env.md\` § Assinador Web ONR · **WSOficio (tokens):** [[../webservice-wsoficio/hash]]

# Hash e credenciais — WS Assinador ONR

O WSDL **não** define WS-Security. Três padrões de autenticação por operação:

## 1. Sem auth (\`ObterVersao\`, \`ValidarArquivoOficial\`, …)

Nenhum hash no envelope.

## 2. Hash de sessão — \`hash\` / \`Hash\`

Operações \`Listar*\`, \`Criptografar*\`, \`InserirAnexoSolicitacao\`, \`ValidarPedidoCertidaoCDHU\`.

\`\`\`text
hash = SHA1( ASSINADOR_CHAVE_INTEGRACAO + token_login )
\`\`\`

| Etapa | Ação |
|-------|------|
| 1 | \`LoginUsuarioCertificado\` em \`ASSINADOR_LOGIN_ENDPOINT\` com \`IDParceiroWS\` + certificado |
| 2 | Token 6 chars em \`Tokens[]\` |
| 3 | \`IDInstituicao\` do retorno → \`idInstituicao\` / \`IDCartorio\` |
| 4 | Calcular hash — **não** enviar chave na SOAP |

Implementação: \`lib/onr_hash.py\` · \`scripts/login/login_onr.py\`

**Teste 2026-06-15:** token HML rejeitado no **SOAP prod** (código **45**) — ambientes possivelmente isolados.

## 3. Credencial aplicação — \`HASH_Autenticacao\` + \`HASH_UDDI\`

Operações \`PADES_CadastrarArquivo\`, \`SetPenhora*\`, \`SetContrato*\`, \`ValidarArquivoAssinado\`.

| Campo | Origem (HML teste) |
|-------|-------------------|
| \`HASH_UDDI\` | Provável \`ASSINADOR_CHAVE_INTEGRACAO\` — **confirmar ONR** |
| \`HASH_Autenticacao\` | **Pendente** — solicitar ONR |
| \`IDCartorio\` | \`ASSINADOR_ID_INSTITUICAO\` (2492) |

## Erros comuns

| Código | Descrição | Ação |
|--------|-----------|------|
| **45** | Hash inválido | Credencial/ambiente/token |
| **46** | Hash já utilizado | Próximo token ou novo login |
| **47** | Hash expirado | Novo login |

## Referências

- [[00-indice-assinador]]
- [[../../onr-assinador-web-endpoints]]
- Repo: \`assinador-onr/manual-endpoint-assinador-.md\`
`
  );
  count++;

  // method files + domain indices
  const byDomain = {};
  for (const op of OPERATIONS) {
    const subPath = op.sub ? `metodos/${op.domain}/${op.sub}` : `metodos/${op.domain}`;
    writeFile(`${subPath}/${op.name}.md`, frontmatter(op) + methodBody(op));
    count++;
    const key = op.sub ? `${op.domain}/${op.sub}` : op.domain;
    if (!byDomain[key]) byDomain[key] = [];
    byDomain[key].push(op);
  }

  // índice pai infra (subpastas validacao, carimbo, …)
  const infraSubs = Object.keys(byDomain).filter((k) => k.startsWith("infra/"));
  if (infraSubs.length) {
    writeFile(
      "metodos/infra/00-indice-infra.md",
      `---
tipo: indice
area: orius
servico: wsassinador
dominio: infra
---

# Infraestrutura — WS Assinador

Voltar: [[../README|Métodos por domínio]] · [[../../00-indice-assinador]]

${infraSubs
  .map((k) => {
    const sub = k.split("/")[1];
    return `- [[${sub}/00-indice-infra-${sub}|${sub}]] (${byDomain[k].length} ops)`;
  })
  .join("\n")}
`
    );
    count++;
  }

  for (const [key, ops] of Object.entries(byDomain)) {
    const parts = key.split("/");
    const domainKey = parts[0];
    const sub = parts[1];
    const idxName = sub
      ? `metodos/${domainKey}/${sub}/00-indice-${domainKey}-${sub}.md`
      : `metodos/${domainKey}/00-indice-${domainKey}.md`;
    if (!sub) writeFile(idxName, domainIndex(domainKey, ops));
    else {
      const dom = DOMAINS[domainKey];
      writeFile(
        idxName,
        `---
tipo: indice
area: orius
servico: wsassinador
dominio: ${domainKey}
sub: ${sub}
---

# Infra — ${sub}

Voltar: [[../00-indice-${domainKey}|${dom.title}]]

${ops.map((o) => `- [[${o.name}]]`).join("\n")}
`
      );
    }
    count++;
  }

  // metodos README
  const domainRows = Object.entries(DOMAINS)
    .map(([k, d]) => {
      const n = OPERATIONS.filter((o) => o.domain === k).length;
      const idx =
        k === "infra" ? "infra/00-indice-infra" : `${k}/00-indice-${k}`;
      return `| **${d.sigla.toUpperCase()}** | ${d.title} | [[${idx}]] | ${n} |`;
    })
    .join("\n");

  writeFile(
    "metodos/README.md",
    `---
tipo: indice
area: orius
central: onr
servico: wsassinador
tags: [orius, onr, assinador, metodos, indice]
---

# Métodos WS Assinador — por domínio

Contrato \`IAssinador\` — **32 operações** (\`wsdl/assinador-onr.wsdl\`).

| Sigla | Domínio | Índice | Ops |
|-------|---------|--------|-----|
${domainRows}

Índice completo: [[../00-indice-assinador]]

**Autenticação:** [[../hash]] · **Automação n8n:** [[../../webservice-wsoficio/automacao/roadmap-assinador-onr-n8n]]

**Código local:** \`C:\\Users\\kenio\\automacoes e testes\`
`
  );
  count++;

  // main index
  const sections = Object.entries(DOMAINS)
    .filter(([k]) => OPERATIONS.some((o) => o.domain === k))
    .map(([k, d]) => {
      const ops = OPERATIONS.filter((o) => o.domain === k);
      const table = ops
        .map((o, i) => {
          const p = o.sub ? `metodos/${k}/${o.sub}/${o.name}` : `metodos/${k}/${o.name}`;
          return `| ${i + 1} | [[${p}]] |`;
        })
        .join("\n");
      return `## ${d.title}\n\n${d.guia ? `Guia: [[../../onr-assinador-web-guia|${d.guia}]]\n\n` : ""}| # | Método |\n|---|--------|\n${table}\n`;
    })
    .join("\n---\n\n");

  writeFile(
    "00-indice-assinador.md",
    `---
tipo: indice
area: orius
central: onr
protocolo: soap
servico: wsassinador
produto: imoveis
tags: [orius, onr, assinador-web, wsassinador, indice]
status: revisado
atualizado: 2026-06-15
fonte_repositorio: C:/Users/kenio/automacoes e testes/wsdl/assinador-onr.wsdl
---

> **Fonte da verdade:** este vault · **WSDL:** \`wsdl/assinador-onr.wsdl\` · **Hub:** [[../../onr-assinador-web]]
> **Central:** [[Orius/integracoes/centrais/onr|ONR]] · **ONR hub:** [[../00-indice-onr]]

# Índice WS Assinador ONR — 32 operações SOAP

- [[visao-geral]] · [[hash]] · [[metodos/README|Métodos por domínio]]
- **Automação n8n:** [[../webservice-wsoficio/automacao/roadmap-assinador-onr-n8n]]
- **Postman:** \`postman/assinador-onr.postman_collection.json\`
- **Regenerar docs:** \`npm run vault:sync-assinador-docs\`

**Endpoint:** \`${ENDPOINT}\` · **SOAPAction prefix:** \`${NS}/IAssinador/\`

---

${sections}
`
  );
  count++;

  // automacao stub index
  writeFile(
    "automacao/00-indice-automacao.md",
    `---
tipo: indice
area: orius
servico: wsassinador
---

# Automação n8n — WS Assinador

Roadmap ativo: [[../webservice-wsoficio/automacao/roadmap-assinador-onr-n8n]]

| Fase | Escopo | Status |
|------|--------|--------|
| 0 | Docs vault + WSDL + credenciais | em andamento |
| 1 | Facade \`PADES_CadastrarArquivo\` / DocumentID | pending |
| 2+ | Demais domínios conforme UAT | pending |

Templates: [[../../automacao/templates/00-indice-templates-automacao-n8n]]
`
  );
  count++;

  console.log(`${dryRun ? "[dry-run] " : ""}Gerados ${count} arquivos em:\n${VAULT_ROOT}`);
}

main();
