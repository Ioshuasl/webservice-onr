import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : [AUTONR-73] (webservice ONR) ListPedidosIN - Intimações
// Nodes   : 10  |  Connections: 11
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// Webhook                            webhook                    [creds]
// NormalizarEntrada                  set
// ValidarEntrada                     code
// IfEntradaValida                    if
// MontarEnvelopeSoap                 code
// ConsumirSoapOnr                    httpRequest                [onError→out(1)]
// ConverterRespostaOnr               code
// RespostaValidacao                  code
// RespostaErroConexaoOnr             code
// RespondToWebhook                   respondToWebhook
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// Webhook
//    → NormalizarEntrada
//      → ValidarEntrada
//        → IfEntradaValida
//          → MontarEnvelopeSoap
//            → ConsumirSoapOnr
//              → ConverterRespostaOnr
//                → RespondToWebhook
//              → RespostaErroConexaoOnr
//                → RespondToWebhook (↩ loop)
//         .out(1) → RespostaValidacao
//            → RespondToWebhook (↩ loop)
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'sPNhiTGukVm3uLow',
    name: '[AUTONR-73] (webservice ONR) ListPedidosIN - Intimações',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class Autonr73WebserviceOnrListpedidosinIntimacoesWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'a8730001-0000-4000-8000-000000000001',
        webhookId: 'c873i002-5b3c-4d4e-9f60-123456789def',
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [-1296, 128],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    Webhook = {
        httpMethod: 'POST',
        path: 'c873i002-5b3c-4d4e-9f60-123456789def',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'b8730002-0000-4000-8000-000000000002',
        name: 'normalizar-entrada',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [-960, 128],
    })
    NormalizarEntrada = {
        mode: 'raw',
        jsonOutput: `={
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
        options: {},
    };

    @node({
        id: 'c8730003-0000-4000-8000-000000000003',
        name: 'validar-entrada',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [-640, 128],
    })
    ValidarEntrada = {
        jsCode: `const item = $input.first().json;
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
const hash = String(item.hash ?? '').trim().toUpperCase();
if (!hash) {
    entrada_valida = false; codigo_erro = 11; mensagem_erro = 'O hash de validação não foi informado.';
} else if (!/^[0-9A-F]{40}$/.test(hash)) {
    entrada_valida = false; codigo_erro = 11; mensagem_erro = 'Hash inválido: informe 40 caracteres hexadecimais maiúsculos.';
}
const maxReg = normalizarInteiro(item.max_registros_por_pagina);
const numPag = normalizarInteiro(item.numero_pagina);
const idStatus = normalizarInteiro(item.id_status);
const protocolo = String(item.protocolo ?? '').trim();
const tipoData = String(item.tipo_data_pesquisa ?? 'P').trim().toUpperCase();
const dataInicial = String(item.data_inicial ?? '').trim();
const dataFinal = String(item.data_final ?? '').trim();
const urlServico = String(item.url_servico_onr ?? '').trim();
if (entrada_valida && !urlServico) {
    entrada_valida = false; codigo_erro = 10; mensagem_erro = 'url_servico_onr é obrigatória.';
}
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
    };

    @node({
        id: 'd8730004-0000-4000-8000-000000000004',
        name: 'if-entrada-valida',
        type: 'n8n-nodes-base.if',
        version: 2.2,
        position: [-320, 128],
    })
    IfEntradaValida = {
        conditions: {
            options: {
                caseSensitive: true,
                leftValue: '',
                typeValidation: 'strict',
                version: 2,
            },
            conditions: [
                {
                    id: 'e3f4a5b6-c7d8-4e9f-a0b1-c2d3d4e5f6a7',
                    leftValue: '={{ $json.entrada_valida }}',
                    rightValue: '',
                    operator: {
                        type: 'boolean',
                        operation: 'true',
                        singleValue: true,
                    },
                },
            ],
            combinator: 'and',
        },
        options: {},
    };

    @node({
        id: 'e8730005-0000-4000-8000-000000000005',
        name: 'montar-envelope-soap',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [0, 0],
    })
    MontarEnvelopeSoap = {
        jsCode: `function escapeXml(valor) {
    return String(valor ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}
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
    };

    @node({
        id: 'f8730006-0000-4000-8000-000000000006',
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

    @node({
        id: 'a8730007-0000-4000-8000-000000000007',
        name: 'converter-resposta-onr',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [640, 0],
    })
    ConverterRespostaOnr = {
        jsCode: `function mapearStatusHttp(sucesso, codigoErro, origem = 'onr') {
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
}
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
    };

    @node({
        id: 'b8730008-0000-4000-8000-000000000008',
        name: 'resposta-validacao',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [0, 256],
    })
    RespostaValidacao = {
        jsCode: `const item = $input.first().json;
return [{ json: { status_http: 400, sucesso: false, codigo_erro: item.codigo_erro, mensagem_erro: item.mensagem_erro, dados: { quantidade_registros: 0, quantidade_paginas: 0, pedidos: [] } } }];`,
    };

    @node({
        id: 'c8730009-0000-4000-8000-000000000009',
        name: 'resposta-erro-conexao-onr',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [640, 256],
    })
    RespostaErroConexaoOnr = {
        jsCode: `const erro = $input.first().json;
return [{ json: { status_http: 502, sucesso: false, codigo_erro: 0, mensagem_erro: erro.error?.message || erro.message || 'Falha ao conectar com a ONR.', dados: { quantidade_registros: 0, quantidade_paginas: 0, pedidos: [] } } }];`,
    };

    @node({
        id: 'd873000a-0000-4000-8000-000000000001',
        name: 'Respond to Webhook',
        type: 'n8n-nodes-base.respondToWebhook',
        version: 1.5,
        position: [960, 128],
    })
    RespondToWebhook = {
        options: {
            responseCode: '={{ $json.status_http }}',
        },
    };

    // =====================================================================
    // ROUTAGE ET CONNEXIONS
    // =====================================================================

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
