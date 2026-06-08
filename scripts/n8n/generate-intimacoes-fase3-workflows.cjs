/**
 * Gera workflows n8n Fase 3 — Intimações (AUTONR-80, 81, 82).
 * Uso: node scripts/n8n/generate-intimacoes-fase3-workflows.cjs
 */
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '../../workflows/n8n/extensao-n8n-teste');

const COMMON_IDS = {
  creds: 'zyTOdADUUemJkEzk',
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
    NormalizarEntrada = { mode: 'raw', jsonOutput: \`=${cfg.normalizeJson}\`, options: {} };

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
    if ([2, 10, 11, 12, 13, 14, 15, 16, 17, 30].includes(codigoErro)) return 400;
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

const DATE_HELPERS = `function dataValida(v) {
    const t = String(v ?? '').trim();
    if (!t) return true;
    if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(t)) return false;
    const [a, m, d] = t.split('-').map(Number);
    const dt = new Date(a, m - 1, d);
    return dt.getFullYear() === a && dt.getMonth() === m - 1 && dt.getDate() === d;
}
function parseData(v) { const [a, m, d] = String(v).trim().split('-').map(Number); return new Date(a, m - 1, d); }`;

const workflows = [
  {
    file: 'Adicionar Emolumento IN.workflow.ts',
    title: '[AUTONR-80] (webservice ONR) AdicionarEmolumentoIN - Intimações',
    className: 'Autonr80WebserviceOnrAdicionaremolumentoinIntimacoesWorkflow',
    workflowId: 'kM80AdicionarEmolumentoIN',
    webhookId: 'c880i010-9a70-2c3d-94e5-678901235abc',
    nodes: {
      webhook: uid('a880', 1), normalizar: uid('b880', 2), validar: uid('c880', 3),
      if: uid('d880', 4), montar: uid('e880', 5), consumir: uid('f880', 6),
      converter: uid('a880', 7), respVal: uid('b880', 8), respErr: uid('c880', 9), respond: uid('d880', 10),
    },
    normalizeJson: `{
  "hash": "{{ $json.body.hash }}",
  "id_pedido": {{ $json.body.id_pedido ?? 0 }},
  "id_status_emolumento": {{ $json.body.id_status_emolumento ?? 0 }},
  "descricao": "{{ $json.body.descricao ?? '' }}",
  "valor": "{{ $json.body.valor ?? '' }}",
  "url_servico_onr": "{{ $json.body.url_servico_onr ?? 'https://hml3-wsoficio.onr.org.br/intimacoes.asmx' }}"
}`,
    validateJs: `const item = $input.first().json;
let entrada_valida = true; let codigo_erro = 0; let mensagem_erro = '';
function normalizarInteiro(v) { const n = Number(v); return Number.isInteger(n) ? n : NaN; }
${HASH_VALIDATE}
const idPedido = normalizarInteiro(item.id_pedido);
const idStatus = normalizarInteiro(item.id_status_emolumento);
const descricao = String(item.descricao ?? '').trim();
const valor = String(item.valor ?? '').trim();
${URL_VALIDATE}
if (entrada_valida && (!Number.isFinite(idPedido) || idPedido < 1)) {
    entrada_valida = false; codigo_erro = 12; mensagem_erro = 'id_pedido inválido: informe um inteiro positivo.';
} else if (entrada_valida && (!Number.isFinite(idStatus) || ![1, 2, 3].includes(idStatus))) {
    entrada_valida = false; codigo_erro = 13; mensagem_erro = 'id_status_emolumento inválido: use 1 (Prenotação), 2 (Outros) ou 3 (Intimação).';
} else if (entrada_valida && !descricao) {
    entrada_valida = false; codigo_erro = 14; mensagem_erro = 'A descrição do emolumento deve ser informada.';
} else if (entrada_valida && !valor) {
    entrada_valida = false; codigo_erro = 15; mensagem_erro = 'O valor do emolumento não foi informado.';
} else if (entrada_valida && !/^\\d+(\\.\\d{1,2})?$/.test(valor)) {
    entrada_valida = false; codigo_erro = 16; mensagem_erro = 'valor inválido: informe decimal no formato XX.XX.';
}
return [{ json: { ...item, hash, id_pedido: idPedido, id_status_emolumento: idStatus, descricao, valor, url_servico_onr: urlServico, entrada_valida, codigo_erro, mensagem_erro } }];`,
    mountSoapJs: `${ESCAPE_XML}
const item = $input.first().json;
const corpo = \`<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <tns:AdicionarEmolumentoIN xmlns:tns="http://tempuri.org/WSOficio">
      <tns:oRequest>
        <tns:Hash>\${escapeXml(item.hash)}</tns:Hash>
        <tns:IDPedido>\${item.id_pedido}</tns:IDPedido>
        <tns:IDStatus>\${item.id_status_emolumento}</tns:IDStatus>
        <tns:Descricao>\${escapeXml(item.descricao)}</tns:Descricao>
        <tns:Valor>\${escapeXml(item.valor)}</tns:Valor>
      </tns:oRequest>
    </tns:AdicionarEmolumentoIN>
  </soap:Body>
</soap:Envelope>\`;
return [{ json: { ...item, corpo_soap: corpo } }];`,
    converterJs: `${MAPEAR_STATUS}
const xml = $input.first().json.data;
function dadosVazio() { return { operacao_soap: 'AdicionarEmolumentoIN', id_pedido: 0, id_status_emolumento: 0 }; }
function respostaErro(s, c, m) { return { status_http: s, sucesso: false, codigo_erro: c, mensagem_erro: m, dados: dadosVazio() }; }
if (!xml || typeof xml !== 'string') return { json: respostaErro(502, 0, 'Resposta inválida da ONR: XML não encontrado.') };
const sucesso = extrairTag('RETORNO', xml).toLowerCase() === 'true';
const codigo_erro = parseInt(extrairTag('CODIGOERRO', xml) || '0', 10);
const mensagem_erro = extrairTag('ERRODESCRICAO', xml);
if (!sucesso) return { json: respostaErro(mapearStatusHttp(false, codigo_erro, 'onr'), codigo_erro, mensagem_erro) };
return { json: {
    status_http: 200, sucesso: true, codigo_erro, mensagem_erro,
    dados: {
        operacao_soap: 'AdicionarEmolumentoIN',
        id_pedido: $('validar-entrada').first().json.id_pedido,
        id_status_emolumento: $('validar-entrada').first().json.id_status_emolumento,
    }
}};`,
    respostaValidacaoJs: `const item = $input.first().json;
return [{ json: { status_http: 400, sucesso: false, codigo_erro: item.codigo_erro, mensagem_erro: item.mensagem_erro, dados: { operacao_soap: 'AdicionarEmolumentoIN', id_pedido: item.id_pedido ?? 0, id_status_emolumento: item.id_status_emolumento ?? 0 } } }];`,
    respostaErroJs: `const erro = $input.first().json;
return [{ json: { status_http: 502, sucesso: false, codigo_erro: 0, mensagem_erro: erro.error?.message || erro.message || 'Falha ao conectar com a ONR.', dados: { operacao_soap: 'AdicionarEmolumentoIN', id_pedido: erro.id_pedido ?? 0, id_status_emolumento: erro.id_status_emolumento ?? 0 } } }];`,
  },
  {
    file: 'Excluir Emolumento IN.workflow.ts',
    title: '[AUTONR-81] (webservice ONR) ExcluirEmolumentoIN - Intimações',
    className: 'Autonr81WebserviceOnrExcluiremolumentoinIntimacoesWorkflow',
    workflowId: 'kM81ExcluirEmolumentoIN',
    webhookId: 'c881i011-0b81-3d4e-a5f6-789012346bcd',
    nodes: {
      webhook: uid('a881', 1), normalizar: uid('b881', 2), validar: uid('c881', 3),
      if: uid('d881', 4), montar: uid('e881', 5), consumir: uid('f881', 6),
      converter: uid('a881', 7), respVal: uid('b881', 8), respErr: uid('c881', 9), respond: uid('d881', 10),
    },
    normalizeJson: `{
  "hash": "{{ $json.body.hash }}",
  "id_emolumento": {{ $json.body.id_emolumento ?? 0 }},
  "url_servico_onr": "{{ $json.body.url_servico_onr ?? 'https://hml3-wsoficio.onr.org.br/intimacoes.asmx' }}"
}`,
    validateJs: `const item = $input.first().json;
let entrada_valida = true; let codigo_erro = 0; let mensagem_erro = '';
function normalizarInteiro(v) { const n = Number(v); return Number.isInteger(n) ? n : NaN; }
${HASH_VALIDATE}
const idEmolumento = normalizarInteiro(item.id_emolumento);
${URL_VALIDATE}
if (entrada_valida && (!Number.isFinite(idEmolumento) || idEmolumento < 1)) {
    entrada_valida = false; codigo_erro = 12; mensagem_erro = 'id_emolumento inválido: informe um inteiro positivo.';
}
return [{ json: { ...item, hash, id_emolumento: idEmolumento, url_servico_onr: urlServico, entrada_valida, codigo_erro, mensagem_erro } }];`,
    mountSoapJs: `${ESCAPE_XML}
const item = $input.first().json;
const corpo = \`<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <tns:ExcluirEmolumentoIN xmlns:tns="http://tempuri.org/WSOficio">
      <tns:oRequest>
        <tns:Hash>\${escapeXml(item.hash)}</tns:Hash>
        <tns:IDEmolumento>\${item.id_emolumento}</tns:IDEmolumento>
      </tns:oRequest>
    </tns:ExcluirEmolumentoIN>
  </soap:Body>
</soap:Envelope>\`;
return [{ json: { ...item, corpo_soap: corpo } }];`,
    converterJs: `${MAPEAR_STATUS}
const xml = $input.first().json.data;
function dadosVazio() { return { operacao_soap: 'ExcluirEmolumentoIN', id_emolumento: 0 }; }
function respostaErro(s, c, m) { return { status_http: s, sucesso: false, codigo_erro: c, mensagem_erro: m, dados: dadosVazio() }; }
if (!xml || typeof xml !== 'string') return { json: respostaErro(502, 0, 'Resposta inválida da ONR: XML não encontrado.') };
const sucesso = extrairTag('RETORNO', xml).toLowerCase() === 'true';
const codigo_erro = parseInt(extrairTag('CODIGOERRO', xml) || '0', 10);
const mensagem_erro = extrairTag('ERRODESCRICAO', xml);
if (!sucesso) return { json: respostaErro(mapearStatusHttp(false, codigo_erro, 'onr'), codigo_erro, mensagem_erro) };
return { json: {
    status_http: 200, sucesso: true, codigo_erro, mensagem_erro,
    dados: {
        operacao_soap: 'ExcluirEmolumentoIN',
        id_emolumento: $('validar-entrada').first().json.id_emolumento,
    }
}};`,
    respostaValidacaoJs: `const item = $input.first().json;
return [{ json: { status_http: 400, sucesso: false, codigo_erro: item.codigo_erro, mensagem_erro: item.mensagem_erro, dados: { operacao_soap: 'ExcluirEmolumentoIN', id_emolumento: item.id_emolumento ?? 0 } } }];`,
    respostaErroJs: `const erro = $input.first().json;
return [{ json: { status_http: 502, sucesso: false, codigo_erro: 0, mensagem_erro: erro.error?.message || erro.message || 'Falha ao conectar com a ONR.', dados: { operacao_soap: 'ExcluirEmolumentoIN', id_emolumento: erro.id_emolumento ?? 0 } } }];`,
  },
  {
    file: 'List Pagamentos IN.workflow.ts',
    title: '[AUTONR-82] (webservice ONR) ListPagamentosIN - Intimações',
    className: 'Autonr82WebserviceOnrListpagamentosinIntimacoesWorkflow',
    workflowId: 'kM82ListPagamentosIN',
    webhookId: 'c882i012-1c92-4e5f-b6a7-890123457cde',
    nodes: {
      webhook: uid('a882', 1), normalizar: uid('b882', 2), validar: uid('c882', 3),
      if: uid('d882', 4), montar: uid('e882', 5), consumir: uid('f882', 6),
      converter: uid('a882', 7), respVal: uid('b882', 8), respErr: uid('c882', 9), respond: uid('d882', 10),
    },
    normalizeJson: `{
  "hash": "{{ $json.body.hash }}",
  "max_registros_por_pagina": {{ $json.body.max_registros_por_pagina ?? 50 }},
  "numero_pagina": {{ $json.body.numero_pagina ?? 1 }},
  "protocolo": "{{ $json.body.protocolo ?? '' }}",
  "id_status_pagamento": {{ $json.body.id_status_pagamento ?? 0 }},
  "id_status_emolumentos": {{ $json.body.id_status_emolumentos ?? 0 }},
  "protocolo_pagamento": "{{ $json.body.protocolo_pagamento ?? '' }}",
  "nosso_numero": "{{ $json.body.nosso_numero ?? '' }}",
  "data_custas_inicial": "{{ $json.body.data_custas_inicial ?? '' }}",
  "data_custas_final": "{{ $json.body.data_custas_final ?? '' }}",
  "data_pagamento_inicial": "{{ $json.body.data_pagamento_inicial ?? '' }}",
  "data_pagamento_final": "{{ $json.body.data_pagamento_final ?? '' }}",
  "url_servico_onr": "{{ $json.body.url_servico_onr ?? 'https://hml3-wsoficio.onr.org.br/intimacoes.asmx' }}"
}`,
    validateJs: `const item = $input.first().json;
let entrada_valida = true; let codigo_erro = 0; let mensagem_erro = '';
function normalizarInteiro(v) { const n = Number(v); return Number.isInteger(n) ? n : NaN; }
${DATE_HELPERS}
${HASH_VALIDATE}
const maxReg = normalizarInteiro(item.max_registros_por_pagina);
const numPag = normalizarInteiro(item.numero_pagina);
const idStatusPagamento = normalizarInteiro(item.id_status_pagamento);
const idStatusEmolumentos = normalizarInteiro(item.id_status_emolumentos);
const protocolo = String(item.protocolo ?? '').trim();
const protocoloPagamento = String(item.protocolo_pagamento ?? '').trim();
const nossoNumero = String(item.nosso_numero ?? '').trim();
const dataCustasInicial = String(item.data_custas_inicial ?? '').trim();
const dataCustasFinal = String(item.data_custas_final ?? '').trim();
const dataPagamentoInicial = String(item.data_pagamento_inicial ?? '').trim();
const dataPagamentoFinal = String(item.data_pagamento_final ?? '').trim();
${URL_VALIDATE}
const statusPagValidos = [0, 1, 2, 3];
const statusEmolValidos = [0, 1, 2, 3, 5, 6];
if (entrada_valida && (!Number.isFinite(maxReg) || maxReg < 10)) { entrada_valida = false; codigo_erro = 12; mensagem_erro = 'max_registros_por_pagina inválido: mínimo 10.'; }
else if (entrada_valida && (!Number.isFinite(numPag) || numPag < 1)) { entrada_valida = false; codigo_erro = 13; mensagem_erro = 'numero_pagina inválido: mínimo 1.'; }
else if (entrada_valida && !statusPagValidos.includes(idStatusPagamento)) { entrada_valida = false; codigo_erro = 10; mensagem_erro = 'id_status_pagamento inválido: use 0, 1, 2 ou 3.'; }
else if (entrada_valida && !statusEmolValidos.includes(idStatusEmolumentos)) { entrada_valida = false; codigo_erro = 10; mensagem_erro = 'id_status_emolumentos inválido: use 0, 1, 2, 3, 5 ou 6.'; }
else if (entrada_valida && dataCustasInicial && !dataValida(dataCustasInicial)) { entrada_valida = false; codigo_erro = 16; mensagem_erro = 'data_custas_inicial inválida. Use aaaa-mm-dd.'; }
else if (entrada_valida && dataCustasFinal && !dataValida(dataCustasFinal)) { entrada_valida = false; codigo_erro = 17; mensagem_erro = 'data_custas_final inválida. Use aaaa-mm-dd.'; }
else if (entrada_valida && dataCustasInicial && dataCustasFinal && parseData(dataCustasFinal) < parseData(dataCustasInicial)) { entrada_valida = false; codigo_erro = 17; mensagem_erro = 'data_custas_final deve ser maior ou igual à data_custas_inicial.'; }
else if (entrada_valida && dataPagamentoInicial && !dataValida(dataPagamentoInicial)) { entrada_valida = false; codigo_erro = 16; mensagem_erro = 'data_pagamento_inicial inválida. Use aaaa-mm-dd.'; }
else if (entrada_valida && dataPagamentoFinal && !dataValida(dataPagamentoFinal)) { entrada_valida = false; codigo_erro = 17; mensagem_erro = 'data_pagamento_final inválida. Use aaaa-mm-dd.'; }
else if (entrada_valida && dataPagamentoInicial && dataPagamentoFinal && parseData(dataPagamentoFinal) < parseData(dataPagamentoInicial)) { entrada_valida = false; codigo_erro = 17; mensagem_erro = 'data_pagamento_final deve ser maior ou igual à data_pagamento_inicial.'; }
return [{ json: {
    ...item, hash, max_registros_por_pagina: maxReg, numero_pagina: numPag,
    id_status_pagamento: idStatusPagamento, id_status_emolumentos: idStatusEmolumentos,
    protocolo, protocolo_pagamento: protocoloPagamento, nosso_numero: nossoNumero,
    data_custas_inicial: dataCustasInicial, data_custas_final: dataCustasFinal,
    data_pagamento_inicial: dataPagamentoInicial, data_pagamento_final: dataPagamentoFinal,
    url_servico_onr: urlServico, entrada_valida, codigo_erro, mensagem_erro
} }];`,
    mountSoapJs: `${ESCAPE_XML}
const item = $input.first().json;
const corpo = \`<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <tns:ListPagamentoIN xmlns:tns="http://tempuri.org/WSOficio">
      <tns:oRequest>
        <tns:Hash>\${escapeXml(item.hash)}</tns:Hash>
        <tns:MaxRowPerPage>\${item.max_registros_por_pagina}</tns:MaxRowPerPage>
        <tns:PageNumber>\${item.numero_pagina}</tns:PageNumber>
        <tns:Protocolo>\${escapeXml(item.protocolo)}</tns:Protocolo>
        <tns:IDStatusPagamento>\${item.id_status_pagamento}</tns:IDStatusPagamento>
        <tns:IDStatusEmolumentos>\${item.id_status_emolumentos}</tns:IDStatusEmolumentos>
        <tns:ProtocoloPagamento>\${escapeXml(item.protocolo_pagamento)}</tns:ProtocoloPagamento>
        <tns:NossoNumero>\${escapeXml(item.nosso_numero)}</tns:NossoNumero>
        <tns:DataCustasInicial>\${escapeXml(item.data_custas_inicial)}</tns:DataCustasInicial>
        <tns:DataCustasFinal>\${escapeXml(item.data_custas_final)}</tns:DataCustasFinal>
        <tns:DataPagamentoInicial>\${escapeXml(item.data_pagamento_inicial)}</tns:DataPagamentoInicial>
        <tns:DataPagamentoFinal>\${escapeXml(item.data_pagamento_final)}</tns:DataPagamentoFinal>
      </tns:oRequest>
    </tns:ListPagamentoIN>
  </soap:Body>
</soap:Envelope>\`;
return [{ json: { ...item, corpo_soap: corpo } }];`,
    converterJs: `${MAPEAR_STATUS}
const xml = $input.first().json.data;
function dadosVazio() { return { operacao_soap: 'ListPagamentosIN', quantidade_registros: 0, quantidade_paginas: 0, pagamentos: [] }; }
function respostaErro(s, c, m) { return { status_http: s, sucesso: false, codigo_erro: c, mensagem_erro: m, dados: dadosVazio() }; }
function decimal(tag, origem) { const v = extrairTag(tag, origem); return v === '' ? 0 : Number(v); }
function extrairPagamentos(origem) {
    const itens = [];
    const regex = /<(?:\\w+:)?ListPagamentosIN_Pedidos_WSResp[^>]*>([\\s\\S]*?)<\\/(?:\\w+:)?ListPagamentosIN_Pedidos_WSResp>/g;
    let match;
    while ((match = regex.exec(origem)) !== null) {
        const b = match[1];
        itens.push({
            id_pedido: parseInt(extrairTag('IDPedido', b), 10) || 0,
            id_custas: parseInt(extrairTag('IDCustas', b), 10) || 0,
            protocolo: extrairTag('Protocolo', b),
            protocolo_pagamento: extrairTag('ProtocoloPagamento', b),
            data_vencimento: extrairTag('DataVencimento', b),
            tipo_custas: extrairTag('TipoCustas', b),
            nosso_numero: extrairTag('NossoNumero', b),
            descricao_status: extrairTag('DescricaoCustas', b),
            valor: decimal('Valor', b),
            usuario_efetivou: extrairTag('UsuarioEfetivou', b),
            data_compensacao: extrairTag('DataCompensacao', b),
            data_repasse: extrairTag('DataRepasse', b),
            pago: extrairTag('Pago', b).toLowerCase() === 'true',
        });
    }
    return itens;
}
if (!xml || typeof xml !== 'string') return { json: respostaErro(502, 0, 'Resposta inválida da ONR: XML não encontrado.') };
const sucesso = extrairTag('RETORNO', xml).toLowerCase() === 'true';
const codigo_erro = parseInt(extrairTag('CODIGOERRO', xml) || '0', 10);
const mensagem_erro = extrairTag('ERRODESCRICAO', xml);
if (!sucesso) return { json: respostaErro(mapearStatusHttp(false, codigo_erro, 'onr'), codigo_erro, mensagem_erro) };
const pagamentos = extrairPagamentos(xml);
return { json: {
    status_http: 200, sucesso: true, codigo_erro, mensagem_erro,
    dados: {
        operacao_soap: 'ListPagamentosIN',
        quantidade_registros: parseInt(extrairTag('QtdeRegistros', xml) || '0', 10),
        quantidade_paginas: parseInt(extrairTag('QtdePaginas', xml) || '0', 10),
        pagamentos,
    }
}};`,
    respostaValidacaoJs: `const item = $input.first().json;
return [{ json: { status_http: 400, sucesso: false, codigo_erro: item.codigo_erro, mensagem_erro: item.mensagem_erro, dados: { operacao_soap: 'ListPagamentosIN', quantidade_registros: 0, quantidade_paginas: 0, pagamentos: [] } } }];`,
    respostaErroJs: `const erro = $input.first().json;
return [{ json: { status_http: 502, sucesso: false, codigo_erro: 0, mensagem_erro: erro.error?.message || erro.message || 'Falha ao conectar com a ONR.', dados: { operacao_soap: 'ListPagamentosIN', quantidade_registros: 0, quantidade_paginas: 0, pagamentos: [] } } }];`,
  },
];

for (const cfg of workflows) {
  fs.writeFileSync(path.join(OUT_DIR, cfg.file), buildWorkflow(cfg), 'utf8');
  console.log('OK', cfg.file);
}
