/**
 * Gera workflows n8n Fase 1 — Intimações (AUTONR-72, 73, 77).
 * Uso: node scripts/n8n/generate-intimacoes-fase1-workflows.cjs
 */
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '../../workflows/n8n/extensao-n8n-teste');

const COMMON_IDS = {
  creds: "zyTOdADUUemJkEzk",
  ifCond: 'e3f4a5b6-c7d8-4e9f-a0b1-c2d3d4e5f6a7',
};

function uid(prefix, n) {
  const hex = n.toString(16).padStart(4, '0');
  return `${prefix}${hex}-0000-4000-8000-00000000000${n}`.slice(0, 36);
}

function buildWorkflow(cfg) {
  const n = cfg.nodes;
  return `import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : ${cfg.title}
// Nodes   : 10  |  Connections: 11
// </workflow-map>

@workflow({
    id: '${cfg.workflowId}',
    name: '${cfg.title}',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class ${cfg.className} {
    @node({
        id: '${n.webhook}',
        webhookId: '${cfg.webhookId}',
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [-1296, 128],
        credentials: { httpBasicAuth: { id: '${COMMON_IDS.creds}', name: 'orius - master@orius' } },
    })
    Webhook = {
        httpMethod: 'POST',
        path: '${cfg.webhookId}',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({ id: '${n.normalizar}', name: 'normalizar-entrada', type: 'n8n-nodes-base.set', version: 3.4, position: [-960, 128] })
    NormalizarEntrada = {
        mode: 'raw',
        jsonOutput: \`=${cfg.normalizeJson}\`,
        options: {},
    };

    @node({ id: '${n.validar}', name: 'validar-entrada', type: 'n8n-nodes-base.code', version: 2, position: [-640, 128] })
    ValidarEntrada = { jsCode: ${JSON.stringify(cfg.validateJs)} };

    @node({ id: '${n.if}', name: 'if-entrada-valida', type: 'n8n-nodes-base.if', version: 2.2, position: [-320, 128] })
    IfEntradaValida = {
        conditions: {
            options: { caseSensitive: true, leftValue: '', typeValidation: 'strict', version: 2 },
            conditions: [{
                id: '${COMMON_IDS.ifCond}',
                leftValue: '={{ $json.entrada_valida }}',
                rightValue: '',
                operator: { type: 'boolean', operation: 'true', singleValue: true },
            }],
            combinator: 'and',
        },
        options: {},
    };

    @node({ id: '${n.montar}', name: 'montar-envelope-soap', type: 'n8n-nodes-base.code', version: 2, position: [0, 0] })
    MontarEnvelopeSoap = { jsCode: ${JSON.stringify(cfg.mountSoapJs)} };

    @node({
        id: '${n.consumir}',
        name: 'consumir-soap-onr',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [320, 0],
        onError: 'continueErrorOutput',
    })
    ConsumirSoapOnr = {
        method: 'POST',
        url: '={{ $json.url_servico_onr }}',
        sendBody: true,
        contentType: 'raw',
        rawContentType: 'text/xml',
        body: '={{ $json.corpo_soap }}',
        options: {},
    };

    @node({ id: '${n.converter}', name: 'converter-resposta-onr', type: 'n8n-nodes-base.code', version: 2, position: [640, 0] })
    ConverterRespostaOnr = { jsCode: ${JSON.stringify(cfg.converterJs)} };

    @node({ id: '${n.respVal}', name: 'resposta-validacao', type: 'n8n-nodes-base.code', version: 2, position: [0, 256] })
    RespostaValidacao = { jsCode: ${JSON.stringify(cfg.respostaValidacaoJs)} };

    @node({ id: '${n.respErr}', name: 'resposta-erro-conexao-onr', type: 'n8n-nodes-base.code', version: 2, position: [640, 256] })
    RespostaErroConexaoOnr = { jsCode: ${JSON.stringify(cfg.respostaErroJs)} };

    @node({ id: '${n.respond}', name: 'Respond to Webhook', type: 'n8n-nodes-base.respondToWebhook', version: 1.5, position: [960, 128] })
    RespondToWebhook = { options: { responseCode: '={{ $json.status_http }}' } };

    @links()
    defineRouting() {
        this.Webhook.out(0).to(this.NormalizarEntrada.in(0));
        this.NormalizarEntrada.out(0).to(this.ValidarEntrada.in(0));
        this.ValidarEntrada.out(0).to(this.IfEntradaValida.in(0));
        this.IfEntradaValida.out(0).to(this.MontarEnvelopeSoap.in(0));
        this.IfEntradaValida.out(1).to(this.RespostaValidacao.in(0));
        this.MontarEnvelopeSoap.out(0).to(this.ConsumirSoapOnr.in(0));
        this.ConsumirSoapOnr.out(0).to(this.ConverterRespostaOnr.in(0));
        this.ConsumirSoapOnr.out(0).to(this.RespostaErroConexaoOnr.in(0));
        this.ConverterRespostaOnr.out(0).to(this.RespondToWebhook.in(0));
        this.RespostaValidacao.out(0).to(this.RespondToWebhook.in(0));
        this.RespostaErroConexaoOnr.out(0).to(this.RespondToWebhook.in(0));
    }
}
`;
}

const MAPEAR_STATUS = `function mapearStatusHttp(sucesso, codigoErro, origem = 'onr') {
    if (sucesso) return 200;
    if (origem === 'validacao') return 400;
    if ([2, 10, 11, 12, 13, 16, 17, 30].includes(codigoErro)) return 400;
    if ([45, 46, 47].includes(codigoErro)) return 401;
    if ([51, 52, 53, 54, 55, 56, 57, 58].includes(codigoErro)) return 404;
    if (codigoErro === 0) return 502;
    if (codigoErro === 1) return 503;
    return 422;
}

function extrairTag(tag, origem) {
    const regex = new RegExp(\`<(?:\\\\w+:)?\${tag}>(.*?)</(?:\\\\w+:)?\${tag}>\`, 'is');
    const match = origem.match(regex);
    return match ? match[1].trim() : '';
}`;

const ESCAPE_XML = `function escapeXml(valor) {
    return String(valor ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}`;

const HASH_VALIDATE = `const hash = String(item.hash ?? '').trim().toUpperCase();
if (!hash) {
    entrada_valida = false; codigo_erro = 11; mensagem_erro = 'O hash de validação não foi informado.';
} else if (!/^[0-9A-F]{40}$/.test(hash)) {
    entrada_valida = false; codigo_erro = 11; mensagem_erro = 'Hash inválido: informe 40 caracteres hexadecimais maiúsculos.';
}`;

const URL_VALIDATE = `const urlServico = String(item.url_servico_onr ?? '').trim();
if (entrada_valida && !urlServico) {
    entrada_valida = false; codigo_erro = 10; mensagem_erro = 'url_servico_onr é obrigatória.';
}`;

const workflows = [
  {
    file: 'Importar Prenotacao IN.workflow.ts',
    title: '[AUTONR-72] (webservice ONR) ImportarPrenotacaoIN - Intimações',
    className: 'Autonr72WebserviceOnrImportarprenotacaoinIntimacoesWorkflow',
    workflowId: 'kM72ImportPrenotIN',
    webhookId: 'c872i001-4a2b-4c3d-8e5f-012345678abc',
    nodes: {
      webhook: uid('a872', 1), normalizar: uid('b872', 2), validar: uid('c872', 3),
      if: uid('d872', 4), montar: uid('e872', 5), consumir: uid('f872', 6),
      converter: uid('a872', 7), respVal: uid('b872', 8), respErr: uid('c872', 9), respond: uid('d872', 10),
    },
    normalizeJson: `{
  "hash": "{{ $json.body.hash }}",
  "urls_xml": {{ JSON.stringify($json.body.urls_xml ?? []) }},
  "url_servico_onr": "{{ $json.body.url_servico_onr ?? 'https://hml3-wsoficio.onr.org.br/intimacoes.asmx' }}"
}`,
    validateJs: `const item = $input.first().json;
let entrada_valida = true;
let codigo_erro = 0;
let mensagem_erro = '';
${HASH_VALIDATE}
const urls = Array.isArray(item.urls_xml) ? item.urls_xml.map((u) => String(u ?? '').trim()).filter(Boolean) : [];
if (entrada_valida && urls.length === 0) {
    entrada_valida = false; codigo_erro = 12; mensagem_erro = 'Nenhum arquivo foi informado (urls_xml).';
}
${URL_VALIDATE}
return [{ json: { ...item, hash, urls_xml: urls, url_servico_onr: urlServico, entrada_valida, codigo_erro, mensagem_erro } }];`,
    mountSoapJs: `${ESCAPE_XML}
const item = $input.first().json;
const urlsXml = (item.urls_xml || []).map((url) =>
    \`        <tns:ImportarPrenotacaoIN_XML_WSReq>
          <tns:URLXML>\${escapeXml(url)}</tns:URLXML>
        </tns:ImportarPrenotacaoIN_XML_WSReq>\`
).join('\\n');
const corpo = \`<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <tns:ImportarPrenotacaoIN xmlns:tns="http://tempuri.org/WSOficio">
      <tns:oRequest>
        <tns:Hash>\${escapeXml(item.hash)}</tns:Hash>
        <tns:XMLs>
\${urlsXml}
        </tns:XMLs>
      </tns:oRequest>
    </tns:ImportarPrenotacaoIN>
  </soap:Body>
</soap:Envelope>\`;
return [{ json: { ...item, corpo_soap: corpo } }];`,
    converterJs: `${MAPEAR_STATUS}
const xml = $input.first().json.data;
function dadosVazio() { return { quantidade_urls: 0, urls_xml: [] }; }
function respostaErro(statusHttp, codigoErro, mensagemErro) {
    return { status_http: statusHttp, sucesso: false, codigo_erro: codigoErro, mensagem_erro: mensagemErro, dados: dadosVazio() };
}
if (!xml || typeof xml !== 'string') return { json: respostaErro(502, 0, 'Resposta inválida da ONR: XML não encontrado.') };
const sucesso = extrairTag('RETORNO', xml).toLowerCase() === 'true';
const codigo_erro = parseInt(extrairTag('CODIGOERRO', xml) || '0', 10);
const mensagem_erro = extrairTag('ERRODESCRICAO', xml);
const entrada = $('validar-entrada').first().json;
return { json: {
    status_http: mapearStatusHttp(sucesso, codigo_erro, 'onr'),
    sucesso, codigo_erro, mensagem_erro,
    dados: sucesso ? { quantidade_urls: (entrada.urls_xml || []).length, urls_xml: entrada.urls_xml || [], operacao_soap: 'ImportarPrenotacaoIN' } : dadosVazio()
}};`,
    respostaValidacaoJs: `const item = $input.first().json;
return [{ json: { status_http: 400, sucesso: false, codigo_erro: item.codigo_erro, mensagem_erro: item.mensagem_erro, dados: { quantidade_urls: 0, urls_xml: [] } } }];`,
    respostaErroJs: `const erro = $input.first().json;
return [{ json: { status_http: 502, sucesso: false, codigo_erro: 0, mensagem_erro: erro.error?.message || erro.message || 'Falha ao conectar com a ONR.', dados: { quantidade_urls: 0, urls_xml: [] } } }];`,
  },
  {
    file: 'List Pedidos IN.workflow.ts',
    title: '[AUTONR-73] (webservice ONR) ListPedidosIN - Intimações',
    className: 'Autonr73WebserviceOnrListpedidosinIntimacoesWorkflow',
    workflowId: 'kM73ListPedidosIN',
    webhookId: 'c873i002-5b3c-4d4e-9f60-123456789def',
    nodes: {
      webhook: uid('a873', 1), normalizar: uid('b873', 2), validar: uid('c873', 3),
      if: uid('d873', 4), montar: uid('e873', 5), consumir: uid('f873', 6),
      converter: uid('a873', 7), respVal: uid('b873', 8), respErr: uid('c873', 9), respond: uid('d873', 10),
    },
    normalizeJson: `{
  "hash": "{{ $json.body.hash }}",
  "max_registros_por_pagina": {{ $json.body.max_registros_por_pagina ?? 50 }},
  "numero_pagina": {{ $json.body.numero_pagina ?? 1 }},
  "id_status": {{ $json.body.id_status ?? 0 }},
  "protocolo": "{{ $json.body.protocolo ?? '' }}",
  "tipo_data_pesquisa": "{{ $json.body.tipo_data_pesquisa ?? 'P' }}",
  "data_inicial": "{{ $json.body.data_inicial }}",
  "data_final": "{{ $json.body.data_final }}",
  "url_servico_onr": "{{ $json.body.url_servico_onr ?? 'https://hml3-wsoficio.onr.org.br/intimacoes.asmx' }}"
}`,
    validateJs: `const item = $input.first().json;
let entrada_valida = true; let codigo_erro = 0; let mensagem_erro = '';
function normalizarInteiro(v) { const n = Number(v); return Number.isInteger(n) ? n : NaN; }
function dataValida(v) {
    const t = String(v ?? '').trim();
    if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(t)) return false;
    const [a, m, d] = t.split('-').map(Number);
    const dt = new Date(a, m - 1, d);
    return dt.getFullYear() === a && dt.getMonth() === m - 1 && dt.getDate() === d;
}
function parseData(v) { const [a, m, d] = String(v).trim().split('-').map(Number); return new Date(a, m - 1, d); }
${HASH_VALIDATE}
const maxReg = normalizarInteiro(item.max_registros_por_pagina);
const numPag = normalizarInteiro(item.numero_pagina);
const idStatus = normalizarInteiro(item.id_status);
const protocolo = String(item.protocolo ?? '').trim();
const tipoData = String(item.tipo_data_pesquisa ?? 'P').trim().toUpperCase();
const dataInicial = String(item.data_inicial ?? '').trim();
const dataFinal = String(item.data_final ?? '').trim();
${URL_VALIDATE}
if (entrada_valida && (!Number.isFinite(maxReg) || maxReg < 10)) { entrada_valida = false; codigo_erro = 12; mensagem_erro = 'max_registros_por_pagina inválido: mínimo 10.'; }
else if (entrada_valida && (!Number.isFinite(numPag) || numPag < 1)) { entrada_valida = false; codigo_erro = 13; mensagem_erro = 'numero_pagina inválido: mínimo 1.'; }
else if (entrada_valida && !Number.isFinite(idStatus)) { entrada_valida = false; codigo_erro = 10; mensagem_erro = 'id_status inválido.'; }
else if (entrada_valida && !['P', 'M'].includes(tipoData)) { entrada_valida = false; codigo_erro = 10; mensagem_erro = 'tipo_data_pesquisa inválido. Use P ou M.'; }
else if (entrada_valida && !dataInicial) { entrada_valida = false; codigo_erro = 16; mensagem_erro = 'data_inicial é obrigatória.'; }
else if (entrada_valida && !dataFinal) { entrada_valida = false; codigo_erro = 17; mensagem_erro = 'data_final é obrigatória.'; }
else if (entrada_valida && !dataValida(dataInicial)) { entrada_valida = false; codigo_erro = 16; mensagem_erro = 'data_inicial inválida. Use aaaa-mm-dd.'; }
else if (entrada_valida && !dataValida(dataFinal)) { entrada_valida = false; codigo_erro = 17; mensagem_erro = 'data_final inválida. Use aaaa-mm-dd.'; }
else if (entrada_valida && parseData(dataFinal) < parseData(dataInicial)) { entrada_valida = false; codigo_erro = 17; mensagem_erro = 'data_final deve ser maior ou igual à data_inicial.'; }
return [{ json: { ...item, hash, max_registros_por_pagina: maxReg, numero_pagina: numPag, id_status: idStatus, protocolo, tipo_data_pesquisa: tipoData, data_inicial: dataInicial, data_final: dataFinal, url_servico_onr: urlServico, entrada_valida, codigo_erro, mensagem_erro } }];`,
    mountSoapJs: `${ESCAPE_XML}
const item = $input.first().json;
const corpo = \`<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <tns:ListPedidosIN xmlns:tns="http://tempuri.org/WSOficio">
      <tns:oRequest>
        <tns:Hash>\${escapeXml(item.hash)}</tns:Hash>
        <tns:MaxRowPerPage>\${item.max_registros_por_pagina}</tns:MaxRowPerPage>
        <tns:PageNumber>\${item.numero_pagina}</tns:PageNumber>
        <tns:IDStatus>\${item.id_status}</tns:IDStatus>
        <tns:Protocolo>\${escapeXml(item.protocolo)}</tns:Protocolo>
        <tns:TipoDataPesquisa>\${escapeXml(item.tipo_data_pesquisa)}</tns:TipoDataPesquisa>
        <tns:DataInicial>\${escapeXml(item.data_inicial)}</tns:DataInicial>
        <tns:DataFinal>\${escapeXml(item.data_final)}</tns:DataFinal>
      </tns:oRequest>
    </tns:ListPedidosIN>
  </soap:Body>
</soap:Envelope>\`;
return [{ json: { ...item, corpo_soap: corpo } }];`,
    converterJs: `${MAPEAR_STATUS}
const xml = $input.first().json.data;
function dadosVazio() { return { quantidade_registros: 0, quantidade_paginas: 0, pedidos: [] }; }
function respostaErro(s, c, m) { return { status_http: s, sucesso: false, codigo_erro: c, mensagem_erro: m, dados: dadosVazio() }; }
function extrairPedidos(origem) {
    const pedidos = [];
    const regex = /<(?:\\w+:)?ListPedidosIN_Pedidos_WSResp[^>]*>([\\s\\S]*?)<\\/(?:\\w+:)?ListPedidosIN_Pedidos_WSResp>/g;
    let match;
    while ((match = regex.exec(origem)) !== null) {
        const b = match[1];
        pedidos.push({
            id_pedido: parseInt(extrairTag('IDPedido', b), 10) || 0,
            protocolo: extrairTag('Protocolo', b),
            solicitante: extrairTag('Solicitante', b),
            id_status: parseInt(extrairTag('IDStatus', b), 10) || 0,
            data_pedido: extrairTag('DataPedido', b),
            data_status: extrairTag('DataStatus', b),
        });
    }
    return pedidos;
}
if (!xml || typeof xml !== 'string') return { json: respostaErro(502, 0, 'Resposta inválida da ONR: XML não encontrado.') };
const sucesso = extrairTag('RETORNO', xml).toLowerCase() === 'true';
const codigo_erro = parseInt(extrairTag('CODIGOERRO', xml) || '0', 10);
const mensagem_erro = extrairTag('ERRODESCRICAO', xml);
const pedidos = sucesso ? extrairPedidos(xml) : [];
return { json: {
    status_http: mapearStatusHttp(sucesso, codigo_erro, 'onr'),
    sucesso, codigo_erro, mensagem_erro,
    dados: sucesso ? {
        quantidade_registros: parseInt(extrairTag('QtdeRegistros', xml), 10) || 0,
        quantidade_paginas: parseInt(extrairTag('QtdePaginas', xml), 10) || 0,
        operacao_soap: 'ListPedidosIN',
        pedidos,
    } : dadosVazio()
}};`,
    respostaValidacaoJs: `const item = $input.first().json;
return [{ json: { status_http: 400, sucesso: false, codigo_erro: item.codigo_erro, mensagem_erro: item.mensagem_erro, dados: { quantidade_registros: 0, quantidade_paginas: 0, pedidos: [] } } }];`,
    respostaErroJs: `const erro = $input.first().json;
return [{ json: { status_http: 502, sucesso: false, codigo_erro: 0, mensagem_erro: erro.error?.message || erro.message || 'Falha ao conectar com a ONR.', dados: { quantidade_registros: 0, quantidade_paginas: 0, pedidos: [] } } }];`,
  },
  {
    file: 'Get Detalhes IN V3.workflow.ts',
    title: '[AUTONR-77] (webservice ONR) GetDetalhesIN_V3 - Intimações',
    className: 'Autonr77WebserviceOnrGetdetalhesinV3IntimacoesWorkflow',
    workflowId: 'kM77GetDetINv3',
    webhookId: 'c877i003-6c4d-5e5f-0a71-234567890abc',
    nodes: {
      webhook: uid('a877', 1), normalizar: uid('b877', 2), validar: uid('c877', 3),
      if: uid('d877', 4), montar: uid('e877', 5), consumir: uid('f877', 6),
      converter: uid('a877', 7), respVal: uid('b877', 8), respErr: uid('c877', 9), respond: uid('d877', 10),
    },
    normalizeJson: `{
  "hash": "{{ $json.body.hash }}",
  "id_pedido": {{ $json.body.id_pedido ?? 0 }},
  "url_servico_onr": "{{ $json.body.url_servico_onr ?? 'https://hml3-wsoficio.onr.org.br/intimacoes.asmx' }}"
}`,
    validateJs: `const item = $input.first().json;
let entrada_valida = true; let codigo_erro = 0; let mensagem_erro = '';
function normalizarInteiro(v) { const n = Number(v); return Number.isInteger(n) ? n : NaN; }
${HASH_VALIDATE}
const idPedido = normalizarInteiro(item.id_pedido);
${URL_VALIDATE}
if (entrada_valida && (!Number.isFinite(idPedido) || idPedido < 1)) {
    entrada_valida = false; codigo_erro = 12; mensagem_erro = 'id_pedido inválido: informe um inteiro positivo.';
}
return [{ json: { ...item, hash, id_pedido: idPedido, url_servico_onr: urlServico, entrada_valida, codigo_erro, mensagem_erro } }];`,
    mountSoapJs: `${ESCAPE_XML}
const item = $input.first().json;
const corpo = \`<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <tns:GetDetalhesIN_V3 xmlns:tns="http://tempuri.org/WSOficio">
      <tns:oRequest>
        <tns:Hash>\${escapeXml(item.hash)}</tns:Hash>
        <tns:IDPedido>\${item.id_pedido}</tns:IDPedido>
      </tns:oRequest>
    </tns:GetDetalhesIN_V3>
  </soap:Body>
</soap:Envelope>\`;
return [{ json: { ...item, corpo_soap: corpo } }];`,
    converterJs: `${MAPEAR_STATUS}
const xml = $input.first().json.data;
function dadosVazio() { return { id_pedido: 0, operacao_soap: 'GetDetalhesIN_V3' }; }
function respostaErro(s, c, m) { return { status_http: s, sucesso: false, codigo_erro: c, mensagem_erro: m, dados: dadosVazio() }; }
function inteiro(tag, origem) { return parseInt(extrairTag(tag, origem), 10) || 0; }
function decimal(tag, origem) { const v = extrairTag(tag, origem); return v === '' ? 0 : Number(v); }
function extrairBlocos(origem, nome) {
    const itens = [];
    const regex = new RegExp(\`<(?:\\\\w+:)?\${nome}[^>]*>([\\\\s\\\\S]*?)<\\\\/(?:\\\\w+:)?\${nome}>\`, 'g');
    let match;
    while ((match = regex.exec(origem)) !== null) itens.push(match[1]);
    return itens;
}
function mapPrenotacao(b) {
    return { numero: extrairTag('Numero', b), data: extrairTag('Data', b), data_vencimento: extrairTag('DataVencimento', b), valor_servico: decimal('ValorServico', b) };
}
function mapDevedor(b) {
    return { nome: extrairTag('Nome', b), participacao: extrairTag('Participacao', b), documento: extrairTag('CPFCNPJ', b), email: extrairTag('Email', b) };
}
function mapImovel(b) { return { matricula: extrairTag('Matricula', b) }; }
function mapEndereco(b) { return { nome_devedor: extrairTag('NomeDevedor', b), endereco_completo: extrairTag('EnderecoCompleto', b) }; }
function mapReingresso(b) { return { protocolo: extrairTag('Protocolo', b), data_prenotacao: extrairTag('DataPrenotacao', b) }; }
function mapBoleto(b) { return { data_vencimento: extrairTag('DataVencimento', b), valor: decimal('Valor', b), url: extrairTag('URL', b) }; }
function mapPrestacao(b) { return { numero: extrairTag('Numero', b), data_vencimento: extrairTag('DataVencimento', b), valor: decimal('Valor', b) }; }
function mapPurga(b) { return { data_vencimento: extrairTag('DataVencimento', b), valor: decimal('Valor', b) }; }
if (!xml || typeof xml !== 'string') return { json: respostaErro(502, 0, 'Resposta inválida da ONR: XML não encontrado.') };
const sucesso = extrairTag('RETORNO', xml).toLowerCase() === 'true';
const codigo_erro = parseInt(extrairTag('CODIGOERRO', xml) || '0', 10);
const mensagem_erro = extrairTag('ERRODESCRICAO', xml);
if (!sucesso) return { json: respostaErro(mapearStatusHttp(false, codigo_erro, 'onr'), codigo_erro, mensagem_erro) };
return { json: {
    status_http: 200, sucesso: true, codigo_erro, mensagem_erro,
    dados: {
        operacao_soap: 'GetDetalhesIN_V3',
        id_pedido: inteiro('IDPedido', xml),
        id_status: inteiro('IDStatus', xml),
        protocolo: extrairTag('Protocolo', xml),
        estado: extrairTag('Estado', xml),
        cidade: extrairTag('Cidade', xml),
        id_cartorio: inteiro('IDCartorio', xml),
        cartorio: extrairTag('Cartorio', xml),
        numero_contrato: extrairTag('NumeroContrato', xml),
        data_remessa: extrairTag('DataRemessa', xml),
        solicitante: extrairTag('Solicitante', xml),
        solicitante_documento: extrairTag('SolicitanteCPFCNPJ', xml),
        solicitante_im: extrairTag('SolicitanteIM', xml),
        solicitante_logradouro: extrairTag('SolicitanteEndereco', xml),
        solicitante_numero: extrairTag('SolicitanteNumero', xml),
        solicitante_complemento: extrairTag('SolicitanteComplemento', xml),
        solicitante_bairro: extrairTag('SolicitanteBairro', xml),
        solicitante_cidade: extrairTag('SolicitanteCidade', xml),
        solicitante_estado: extrairTag('SolicitanteEstado', xml),
        solicitante_cep: extrairTag('SolicitanteCEP', xml),
        solicitante_ddd: extrairTag('SolicitanteDDD', xml),
        solicitante_telefone: extrairTag('SolicitanteTelefone', xml),
        solicitante_email: extrairTag('SolicitanteEmail', xml),
        credor: extrairTag('Credor', xml),
        credor_documento: extrairTag('CredorCPFCNPJ', xml),
        credor_im: extrairTag('CredorIM', xml),
        credor_logradouro: extrairTag('CredorEndereco', xml),
        credor_numero: extrairTag('CredorNumero', xml),
        credor_complemento: extrairTag('CredorComplemento', xml),
        credor_bairro: extrairTag('CredorBairro', xml),
        credor_cidade: extrairTag('CredorCidade', xml),
        credor_estado: extrairTag('CredorEstado', xml),
        credor_cep: extrairTag('CredorCEP', xml),
        credor_ddd: extrairTag('CredorDDD', xml),
        credor_telefone: extrairTag('CredorTelefone', xml),
        credor_email: extrairTag('CredorEmail', xml),
        prestacao_agencia: extrairTag('PrestacaoAgencia', xml),
        prestacao_endereco: extrairTag('PrestacaoEndereco', xml),
        tipo_cobranca: inteiro('TipoCobranca', xml),
        prenotacoes: extrairBlocos(xml, 'GetDetalhesIN_Prenotacao_WSResp').map(mapPrenotacao),
        devedores: extrairBlocos(xml, 'GetDetalhesIN_Devedor_v2_WSResp').map(mapDevedor),
        imoveis: extrairBlocos(xml, 'GetDetalhesIN_Imovel_WSResp').map(mapImovel),
        enderecos_intimacao: extrairBlocos(xml, 'GetDetalhesIN_EnderecoIntimacao_WSResp').map(mapEndereco),
        reingressos: extrairBlocos(xml, 'GetDetalhesIN_Reingresso_WSResp').map(mapReingresso),
        boletos: extrairBlocos(xml, 'GetDetalhesIN_Boleto_WSResp').map(mapBoleto),
        prestacoes_vencidas: extrairBlocos(xml, 'GetDetalhesIN_PrestacaoVencida_WSResp').map(mapPrestacao),
        purgas: extrairBlocos(xml, 'GetDetalhesIN_Purga_WSResp').map(mapPurga),
    }
}};`,
    respostaValidacaoJs: `const item = $input.first().json;
return [{ json: { status_http: 400, sucesso: false, codigo_erro: item.codigo_erro, mensagem_erro: item.mensagem_erro, dados: { id_pedido: item.id_pedido ?? 0, operacao_soap: 'GetDetalhesIN_V3' } } }];`,
    respostaErroJs: `const erro = $input.first().json;
return [{ json: { status_http: 502, sucesso: false, codigo_erro: 0, mensagem_erro: erro.error?.message || erro.message || 'Falha ao conectar com a ONR.', dados: { id_pedido: erro.id_pedido ?? 0, operacao_soap: 'GetDetalhesIN_V3' } } }];`,
  },
];

for (const cfg of workflows) {
  const out = path.join(OUT_DIR, cfg.file);
  fs.writeFileSync(out, buildWorkflow(cfg), 'utf8');
  console.log('OK', cfg.file);
}
