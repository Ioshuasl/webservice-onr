/**
 * Gera postman/assinador-onr.postman_collection.json com variáveis explícitas
 * (Collection variables), mesclando assinador-onr.postman_environment.template.json.
 *
 * Uso: node scripts/postman/build-assinador-collection.cjs
 */
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = path.resolve(__dirname, "../..");
const POSTMAN = path.join(ROOT, "postman");
const OUT = path.join(POSTMAN, "assinador-onr.postman_collection.json");
const ENV_TPL = path.join(POSTMAN, "assinador-onr.postman_environment.template.json");

const NS = "{{assinador_soap_namespace}}";
const WSA = "http://schemas.datacontract.org/2004/07/WSAssinador";

function loadJson(file) {
  return JSON.parse(fs.readFileSync(path.join(POSTMAN, file), "utf8"));
}

function envToCollectionVars(env) {
  const extra = [
    { key: "assinador_soapaction_prefix", value: "http://wsassinador.arisp.com.br/IAssinador/" },
  ];
  const map = new Map();
  for (const v of env.values || []) map.set(v.key, v.value ?? "");
  for (const v of extra) map.set(v.key, v.value);
  return [...map.entries()].map(([key, value]) => ({
    key,
    value: String(value),
    type: "string",
  }));
}

function soapAction(op) {
  return `{{assinador_soapaction_prefix}}${op}`;
}

function envelope(body) {
  return (
    `<?xml version="1.0" encoding="utf-8"?>\n` +
    `<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="${NS}">\n` +
    `  <soap:Body>\n${body}\n  </soap:Body>\n</soap:Envelope>`
  );
}

function soapRequest(name, op, body, description) {
  return {
    name,
    event: [
      {
        listen: "test",
        script: {
          type: "text/javascript",
          exec: [
            "pm.test('HTTP 200', () => pm.response.to.have.status(200));",
            "const body = pm.response.text();",
            "pm.test('SOAP Body presente', () => pm.expect(body.length).to.be.above(0));",
          ],
        },
      },
    ],
    request: {
      method: "POST",
      header: [
        { key: "Content-Type", value: "text/xml; charset=utf-8" },
        { key: "SOAPAction", value: soapAction(op) },
      ],
      body: { mode: "raw", raw: envelope(body), options: { raw: { language: "xml" } } },
      url: "{{assinador_endpoint}}",
      description,
    },
    response: [],
  };
}

function listarSolicitacoes(name, op, protocoloVar, desc) {
  const body = `    <tns:${op}>
      <tns:idInstituicao>{{id_instituicao}}</tns:idInstituicao>
      <tns:protocolo>{{${protocoloVar}}}</tns:protocolo>
      <tns:hash>{{assinador_hash}}</tns:hash>
    </tns:${op}>`;
  return soapRequest(name, op, body, desc);
}

function validarArquivo(protocoloVar, desc) {
  const body = `    <tns:ValidarArquivoOficial>
      <tns:file>{{assinador_pdf_base64}}</tns:file>
      <tns:strProtocolo>{{${protocoloVar}}}</tns:strProtocolo>
    </tns:ValidarArquivoOficial>`;
  return soapRequest("ValidarArquivoOficial", "ValidarArquivoOficial", body, desc);
}

function padesCadastrar(desc) {
  const body = `    <tns:PADES_CadastrarArquivo>
      <tns:oRequest xmlns:wsa="${WSA}">
        <wsa:HASH_Autenticacao>{{HASH_Autenticacao}}</wsa:HASH_Autenticacao>
        <wsa:HASH_UDDI>{{HASH_UDDI}}</wsa:HASH_UDDI>
        <wsa:IDCartorio>{{id_instituicao}}</wsa:IDCartorio>
        <wsa:file>{{assinador_pdf_base64}}</wsa:file>
      </tns:oRequest>
    </tns:PADES_CadastrarArquivo>`;
  return soapRequest("PADES_CadastrarArquivo", "PADES_CadastrarArquivo", body, desc);
}

function setPenhoraAverbado() {
  const body = `    <tns:SetPenhoraAverbadoPO>
      <tns:oRequest xmlns:wsa="${WSA}">
        <wsa:HASH_Autenticacao>{{HASH_Autenticacao}}</wsa:HASH_Autenticacao>
        <wsa:HASH_UDDI>{{HASH_UDDI}}</wsa:HASH_UDDI>
        <wsa:IDCartorio>{{id_instituicao}}</wsa:IDCartorio>
        <wsa:nrProtocolo>{{protocolo_penhora_ph}}</wsa:nrProtocolo>
        <wsa:NomeArquivo>{{assinador_nome_arquivo}}</wsa:NomeArquivo>
        <wsa:Matricula>{{penhora_matricula}}</wsa:Matricula>
        <wsa:Resposta>{{penhora_resposta}}</wsa:Resposta>
        <wsa:file>{{assinador_pdf_base64}}</wsa:file>
      </tns:oRequest>
    </tns:SetPenhoraAverbadoPO>`;
  return soapRequest(
    "SetPenhoraAverbadoPO",
    "SetPenhoraAverbadoPO",
    body,
    "Penhora PH — averbação. Arquivo sem sufixo N. Manual: assinador-onr/manual-endpoint-assinador-.md §4."
  );
}

function setPenhoraExigencia() {
  const body = `    <tns:SetPenhoraExigenciaPO>
      <tns:oRequest xmlns:wsa="${WSA}">
        <wsa:HASH_Autenticacao>{{HASH_Autenticacao}}</wsa:HASH_Autenticacao>
        <wsa:HASH_UDDI>{{HASH_UDDI}}</wsa:HASH_UDDI>
        <wsa:IDCartorio>{{id_instituicao}}</wsa:IDCartorio>
        <wsa:nrProtocolo>{{protocolo_penhora_ph_nota}}</wsa:nrProtocolo>
        <wsa:NomeArquivo>{{assinador_nome_arquivo}}</wsa:NomeArquivo>
        <wsa:file>{{assinador_pdf_base64}}</wsa:file>
      </tns:oRequest>
    </tns:SetPenhoraExigenciaPO>`;
  return soapRequest(
    "SetPenhoraExigenciaPO",
    "SetPenhoraExigenciaPO",
    body,
    "Penhora PH — nota de exigência (sufixo N). Manual §4."
  );
}

function listarStatusPO() {
  const body = `    <tns:ListarSolicitacoesStatusPO>
      <tns:ProtocoloPenhora>{{protocolo_penhora_ph}}</tns:ProtocoloPenhora>
      <tns:IdInstituicao>{{id_instituicao}}</tns:IdInstituicao>
      <tns:Hash>{{assinador_Hash}}</tns:Hash>
    </tns:ListarSolicitacoesStatusPO>`;
  return soapRequest(
    "ListarSolicitacoesStatusPO",
    "ListarSolicitacoesStatusPO",
    body,
    "Consulta status PH antes de SetPenhora*. Use assinador_Hash (capital H)."
  );
}

function listarEProtocolo(protocoloVar) {
  const body = `    <tns:ListarSolicitacoesEProtocolo>
      <tns:nrProtocolo>{{${protocoloVar}}}</tns:nrProtocolo>
      <tns:IdInstituicao>{{id_instituicao}}</tns:IdInstituicao>
      <tns:Hash>{{assinador_Hash}}</tns:Hash>
    </tns:ListarSolicitacoesEProtocolo>`;
  return soapRequest(
    "ListarSolicitacoesEProtocolo",
    "ListarSolicitacoesEProtocolo",
    body,
    "E-Protocolo — consulta pedido AC…"
  );
}

function setContratoExigencia() {
  const body = `    <tns:SetContratoExigenciaAC>
      <tns:oRequest xmlns:wsa="${WSA}">
        <wsa:HASH_Autenticacao>{{HASH_Autenticacao}}</wsa:HASH_Autenticacao>
        <wsa:HASH_UDDI>{{HASH_UDDI}}</wsa:HASH_UDDI>
        <wsa:IDCartorio>{{id_instituicao}}</wsa:IDCartorio>
        <wsa:ProtocoloContrato>{{protocolo_eprot_nota}}</wsa:ProtocoloContrato>
        <wsa:NomeArquivo>{{assinador_nome_arquivo}}</wsa:NomeArquivo>
        <wsa:Descricao>{{contrato_descricao}}</wsa:Descricao>
        <wsa:Resposta>{{contrato_resposta}}</wsa:Resposta>
        <wsa:file>{{assinador_pdf_base64}}</wsa:file>
      </tns:oRequest>
    </tns:SetContratoExigenciaAC>`;
  return soapRequest("SetContratoExigenciaAC", "SetContratoExigenciaAC", body, "E-Protocolo — nota (…N).");
}

function setContratoAverbado(protocoloVar) {
  const body = `    <tns:SetContratoAverbadoAC>
      <tns:oRequest xmlns:wsa="${WSA}">
        <wsa:HASH_Autenticacao>{{HASH_Autenticacao}}</wsa:HASH_Autenticacao>
        <wsa:HASH_UDDI>{{HASH_UDDI}}</wsa:HASH_UDDI>
        <wsa:IDCartorio>{{id_instituicao}}</wsa:IDCartorio>
        <wsa:ProtocoloContrato>{{${protocoloVar}}}</wsa:ProtocoloContrato>
        <wsa:NomeArquivo>{{assinador_nome_arquivo}}</wsa:NomeArquivo>
        <wsa:Descricao>{{contrato_descricao}}</wsa:Descricao>
        <wsa:Resposta>{{contrato_resposta}}</wsa:Resposta>
        <wsa:file>{{assinador_pdf_base64}}</wsa:file>
      </tns:oRequest>
    </tns:SetContratoAverbadoAC>`;
  return soapRequest(
    "SetContratoAverbadoAC",
    "SetContratoAverbadoAC",
    body,
    "E-Protocolo — averbação/registro. Um call por arquivo (AC, ACT, ACX)."
  );
}

function main() {
  const envTpl = loadJson("assinador-onr.postman_environment.template.json");

  const collection = {
    info: {
      _postman_id: crypto.randomUUID(),
      name: "Assinador ONR — SOAP",
      description:
        "Coleção SOAP para **wsassinador.onr.org.br** (`IAssinador`).\n\n" +
        "**Variáveis explícitas** em **Collection variables** (aba Variables) — padrão CCN/ONR unificado. " +
        "Environment opcional sobrescreve.\n\n" +
        "## Credenciais\n\n" +
        "1. `id_instituicao` — ID do cartório no cadastro ONR.\n" +
        "2. `assinador_hash` — hash de sessão (operações `Listar*` com `hash` minúsculo). " +
        "Costuma ser o `onr_hash` do login WSOficio (`postman/onr-webservice-n8n` → 3.1 Login).\n" +
        "3. `assinador_Hash` — mesma origem, para `ListarSolicitacoesStatusPO` / `ListarSolicitacoesEProtocolo`.\n" +
        "4. `HASH_Autenticacao` + `HASH_UDDI` — credencial da aplicação (ONR/serventia).\n" +
        "5. `assinador_pdf_base64` — PDF em Base64 (sem quebras de linha).\n\n" +
        "## Regenerar\n\n" +
        "```bash\nnpm run postman:build:assinador\n```\n\n" +
        "Documentação: `assinador-onr/manual-endpoint-assinador-.md` · WSDL: `wsdl/assinador-onr.wsdl`",
      schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
    },
    variable: envToCollectionVars(envTpl),
    item: [
      {
        name: "0. Diagnóstico",
        item: [
          soapRequest(
            "ObterVersao",
            "ObterVersao",
            "    <tns:ObterVersao/>",
            "Versão do serviço — sem parâmetros."
          ),
        ],
      },
      {
        name: "1. Certidão digital",
        description: "Protocolo S… — Listar → Validar → PADES.",
        item: [
          listarSolicitacoes(
            "ListarSolicitacoes",
            "ListarSolicitacoes",
            "protocolo_certidao_s",
            "Lista pedidos certidão. `protocolo_certidao_s` ex.: S20120000001D."
          ),
          validarArquivo("protocolo_certidao_s", "Valida PDF + nome S… (Pronto para assinar / recusado)."),
          padesCadastrar("Cadastra PDF PAdES após assinatura."),
          soapRequest(
            "InserirAnexoSolicitacao",
            "InserirAnexoSolicitacao",
            `    <tns:InserirAnexoSolicitacao>
      <tns:IdSolicitacao>{{id_solicitacao}}</tns:IdSolicitacao>
      <tns:NomeArquivo>{{assinador_nome_arquivo}}</tns:NomeArquivo>
      <tns:ExtensaoArquivo>pdf</tns:ExtensaoArquivo>
      <tns:Arquivo>{{assinador_pdf_base64}}</tns:Arquivo>
      <tns:hash>{{assinador_hash}}</tns:hash>
    </tns:InserirAnexoSolicitacao>`,
            "Anexo em solicitação existente (`id_solicitacao`)."
          ),
        ],
      },
      {
        name: "2. Ofício eletrônico",
        item: [
          listarSolicitacoes("ListarSolicitacoesOficio", "ListarSolicitacoesOficio", "protocolo_oficio", "Lista ofícios."),
          validarArquivo("protocolo_oficio", "Valida nome 2101000001 ou 2101000001-1234."),
          padesCadastrar("Envio PDF assinado."),
        ],
      },
      {
        name: "3. Penhora SPH",
        item: [
          listarSolicitacoes("ListarSolicitacoesPenhora", "ListarSolicitacoesPenhora", "protocolo_penhora_sph", "Lista SPH…"),
          validarArquivo("protocolo_penhora_sph", "Valida SPH…"),
          padesCadastrar("Entrega certidão assinada SPH."),
        ],
      },
      {
        name: "4. Penhora PH",
        item: [listarStatusPO(), validarArquivo("protocolo_penhora_ph", "Valida PH…"), setPenhoraAverbado(), setPenhoraExigencia()],
      },
      {
        name: "5. E-Protocolo",
        item: [
          listarEProtocolo("protocolo_eprot"),
          validarArquivo("protocolo_eprot_nota", "Valida AC…N (nota)."),
          setContratoExigencia(),
          setContratoAverbado("protocolo_eprot"),
          setContratoAverbado("protocolo_eprot_talao"),
          setContratoAverbado("protocolo_eprot_xml"),
        ],
      },
      {
        name: "6. Balcão RI",
        item: [validarArquivo("protocolo_balcao_certidao", "certidao-1234 (sem acento)."), padesCadastrar("Balcão — PADES.")],
      },
      {
        name: "7. SEIC / Intimação",
        item: [validarArquivo("protocolo_seic", "IN…CN, CP, etc. — sufixo completo."), padesCadastrar("SEIC — PADES.")],
      },
      {
        name: "Consultar lotes",
        item: [
          soapRequest(
            "ListarPedidosClientes",
            "ListarPedidosClientes",
            `    <tns:ListarPedidosClientes>
      <tns:IdInstituicao>{{id_instituicao}}</tns:IdInstituicao>
      <tns:dtPedidoInicial>{{dt_pedido_inicial}}</tns:dtPedidoInicial>
      <tns:dtPedidoFinal>{{dt_pedido_final}}</tns:dtPedidoFinal>
      <tns:hash>{{assinador_hash}}</tns:hash>
    </tns:ListarPedidosClientes>`,
            "Pedidos por período."
          ),
          soapRequest(
            "ListarAnexosSolicitacoes",
            "ListarAnexosSolicitacoes",
            `    <tns:ListarAnexosSolicitacoes>
      <tns:IdSolicitacao>{{id_solicitacao}}</tns:IdSolicitacao>
      <tns:hash>{{assinador_hash}}</tns:hash>
    </tns:ListarAnexosSolicitacoes>`,
            "Anexos de uma solicitação."
          ),
        ],
      },
      {
        name: "Infraestrutura",
        item: [
          soapRequest(
            "ObterTokensOficial",
            "ObterTokensOficial",
            `    <tns:ObterTokensOficial>
      <tns:file>{{assinador_pdf_base64}}</tns:file>
      <tns:HASH_Autenticacao>{{HASH_Autenticacao}}</tns:HASH_Autenticacao>
    </tns:ObterTokensOficial>`,
            "Tokens para assinatura oficial."
          ),
          soapRequest(
            "ValidarArquivoAssinado",
            "ValidarArquivoAssinado",
            `    <tns:ValidarArquivoAssinado>
      <tns:file>{{assinador_pdf_base64}}</tns:file>
      <tns:Protocolo>{{protocolo_certidao_s}}</tns:Protocolo>
      <tns:HASH_Autenticacao>{{HASH_Autenticacao}}</tns:HASH_Autenticacao>
      <tns:HASH_UDDI>{{HASH_UDDI}}</tns:HASH_UDDI>
      <tns:CPF>{{assinador_cpf}}</tns:CPF>
    </tns:ValidarArquivoAssinado>`,
            "Valida P7S/PDF já assinado."
          ),
          soapRequest(
            "ObterAtributoAmplia",
            "ObterAtributoAmplia",
            `    <tns:ObterAtributoAmplia>
      <tns:cpf>{{assinador_cpf}}</tns:cpf>
    </tns:ObterAtributoAmplia>`,
            "Certificado de atributo Amplia."
          ),
          soapRequest(
            "GetTimeStamp",
            "GetTimeStamp",
            `    <tns:GetTimeStamp>
      <tns:TokenUsuario>{{token_usuario}}</tns:TokenUsuario>
      <tns:Base64Binary>{{assinador_pdf_base64}}</tns:Base64Binary>
      <tns:DocumentoSolicitante></tns:DocumentoSolicitante>
      <tns:Protocolo>{{protocolo_certidao_s}}</tns:Protocolo>
      <tns:Origem>ONR</tns:Origem>
    </tns:GetTimeStamp>`,
            "Carimbo de tempo."
          ),
        ],
      },
    ],
  };

  fs.writeFileSync(OUT, JSON.stringify(collection, null, 2) + "\n", "utf8");
  console.log(`✓ ${path.relative(ROOT, OUT)} (${collection.variable.length} variáveis, ${countRequests(collection.item)} requests)`);
}

function countRequests(items) {
  let n = 0;
  for (const it of items || []) {
    if (it.request) n++;
    if (it.item) n += countRequests(it.item);
  }
  return n;
}

main();
