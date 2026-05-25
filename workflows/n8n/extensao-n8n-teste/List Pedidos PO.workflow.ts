import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : List Pedidos PO
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
    id: 'UDR1PYjNOEdCT4H9',
    name: 'List Pedidos PO',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class ListPedidosPoWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'a9b0c1d2-e3f4-4a5b-b6c7-d8e9f0a1b2c3',
        webhookId: 'e9f0a1b2-c3d4-4e5f-9a0b-c1d2e3f4a5b6',
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 0],
        credentials: { httpBasicAuth: { id: 'CE3L7VlaRe4klqlk', name: 'ioshua + ioshua123' } },
    })
    Webhook = {
        httpMethod: 'POST',
        path: 'e9f0a1b2-c3d4-4e5f-9a0b-c1d2e3f4a5b6',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'b0c1d2e3-f4a5-4b6c-c7d8-e9f0a1b2c3d4',
        name: 'normalizar-entrada',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [336, 0],
    })
    NormalizarEntrada = {
        mode: 'raw',
        jsonOutput: `={
  "hash": "{{ $json.body.hash }}",
  "max_registros_por_pagina": {{ $json.body.max_registros_por_pagina ?? 50 }},
  "numero_pagina": {{ $json.body.numero_pagina ?? 1 }},
  "protocolo": "{{ $json.body.protocolo ?? '' }}",
  "id_vara": {{ $json.body.id_vara ?? -1 }},
  "id_tipo_pedido": {{ $json.body.id_tipo_pedido ?? -1 }},
  "id_status": {{ $json.body.id_status ?? -1 }},
  "data_solicitacao_inicial": "{{ $json.body.data_solicitacao_inicial }}",
  "data_solicitacao_final": "{{ $json.body.data_solicitacao_final }}",
  "data_resposta_inicial": "{{ $json.body.data_resposta_inicial ?? '' }}",
  "data_resposta_final": "{{ $json.body.data_resposta_final ?? '' }}",
  "url_servico_onr": "{{ $json.body.url_servico_onr ?? 'https://hml3-wsoficio.onr.org.br/penhoraonline.asmx' }}"
}
 `,
        options: {},
    };

    @node({
        id: 'c1d2e3f4-a5b6-4c7d-d8e9-f0a1b2c3d4e5',
        name: 'validar-entrada',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [656, 0],
    })
    ValidarEntrada = {
        jsCode: `const item = $input.first().json;

const TIPOS_PEDIDO_VALIDOS = new Set([-1, 1, 2, 3]);
const STATUS_VALIDOS = new Set([-1, 1, 2, 3, 5, 7, 8, 9, 10, 11, 12, 13, 14]);

function normalizarInteiro(valor) {
    const numero = Number(valor);
    return Number.isInteger(numero) ? numero : NaN;
}

function dataValida(valor) {
    const texto = String(valor ?? '').trim();
    if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(texto)) return false;

    const [ano, mes, dia] = texto.split('-').map(Number);
    const data = new Date(ano, mes - 1, dia);

    return data.getFullYear() === ano
        && data.getMonth() === mes - 1
        && data.getDate() === dia;
}

function parseData(valor) {
    const [ano, mes, dia] = String(valor).trim().split('-').map(Number);
    return new Date(ano, mes - 1, dia);
}

function periodoEmDias(inicio, fim) {
    const msPorDia = 24 * 60 * 60 * 1000;
    return Math.round((parseData(fim) - parseData(inicio)) / msPorDia);
}

const hash = String(item.hash ?? '').trim().toUpperCase();
const maxRegistros = normalizarInteiro(item.max_registros_por_pagina);
const numeroPagina = normalizarInteiro(item.numero_pagina);
const protocolo = String(item.protocolo ?? '').trim();
const idVara = normalizarInteiro(item.id_vara);
const idTipoPedido = normalizarInteiro(item.id_tipo_pedido);
const idStatus = normalizarInteiro(item.id_status);
const dataSolicitacaoInicial = String(item.data_solicitacao_inicial ?? '').trim();
const dataSolicitacaoFinal = String(item.data_solicitacao_final ?? '').trim();
const dataRespostaInicial = String(item.data_resposta_inicial ?? '').trim();
const dataRespostaFinal = String(item.data_resposta_final ?? '').trim();
const urlServico = String(item.url_servico_onr ?? '').trim();

let entrada_valida = true;
let codigo_erro = 0;
let mensagem_erro = '';

if (!hash) {
    entrada_valida = false;
    codigo_erro = 11;
    mensagem_erro = 'O hash de validação não foi informado.';
} else if (!/^[0-9A-F]{40}$/.test(hash)) {
    entrada_valida = false;
    codigo_erro = 11;
    mensagem_erro = 'Hash inválido: informe 40 caracteres hexadecimais maiúsculos.';
} else if (!Number.isFinite(maxRegistros) || maxRegistros < 10) {
    entrada_valida = false;
    codigo_erro = 12;
    mensagem_erro = 'max_registros_por_pagina inválido: mínimo 10.';
} else if (!Number.isFinite(numeroPagina) || numeroPagina < 1) {
    entrada_valida = false;
    codigo_erro = 13;
    mensagem_erro = 'numero_pagina inválido: mínimo 1.';
} else if (!Number.isFinite(idVara) || idVara < -1 || idVara === 0) {
    entrada_valida = false;
    codigo_erro = 14;
    mensagem_erro = 'id_vara inválido. Use -1 para todas ou um inteiro positivo.';
} else if (!Number.isFinite(idTipoPedido) || !TIPOS_PEDIDO_VALIDOS.has(idTipoPedido)) {
    entrada_valida = false;
    codigo_erro = 15;
    mensagem_erro = 'id_tipo_pedido inválido. Use -1, 1, 2 ou 3.';
} else if (!Number.isFinite(idStatus) || !STATUS_VALIDOS.has(idStatus)) {
    entrada_valida = false;
    codigo_erro = 16;
    mensagem_erro = 'id_status inválido para Penhora Online.';
} else if (!dataSolicitacaoInicial) {
    entrada_valida = false;
    codigo_erro = 17;
    mensagem_erro = 'data_solicitacao_inicial é obrigatória.';
} else if (!dataSolicitacaoFinal) {
    entrada_valida = false;
    codigo_erro = 18;
    mensagem_erro = 'data_solicitacao_final é obrigatória.';
} else if (!dataValida(dataSolicitacaoInicial)) {
    entrada_valida = false;
    codigo_erro = 19;
    mensagem_erro = 'data_solicitacao_inicial inválida. Use aaaa-mm-dd.';
} else if (!dataValida(dataSolicitacaoFinal)) {
    entrada_valida = false;
    codigo_erro = 20;
    mensagem_erro = 'data_solicitacao_final inválida. Use aaaa-mm-dd.';
} else if (parseData(dataSolicitacaoFinal) < parseData(dataSolicitacaoInicial)) {
    entrada_valida = false;
    codigo_erro = 20;
    mensagem_erro = 'data_solicitacao_final deve ser maior ou igual à inicial.';
} else if (periodoEmDias(dataSolicitacaoInicial, dataSolicitacaoFinal) > 30) {
    entrada_valida = false;
    codigo_erro = 21;
    mensagem_erro = 'O período de solicitação não pode ser maior que 30 dias.';
} else if (dataRespostaInicial && !dataValida(dataRespostaInicial)) {
    entrada_valida = false;
    codigo_erro = 22;
    mensagem_erro = 'data_resposta_inicial inválida. Use aaaa-mm-dd.';
} else if (dataRespostaFinal && !dataValida(dataRespostaFinal)) {
    entrada_valida = false;
    codigo_erro = 23;
    mensagem_erro = 'data_resposta_final inválida. Use aaaa-mm-dd.';
} else if (dataRespostaInicial && dataRespostaFinal && parseData(dataRespostaFinal) < parseData(dataRespostaInicial)) {
    entrada_valida = false;
    codigo_erro = 23;
    mensagem_erro = 'data_resposta_final deve ser maior ou igual à inicial.';
} else if (!urlServico) {
    entrada_valida = false;
    codigo_erro = 10;
    mensagem_erro = 'url_servico_onr é obrigatória.';
}

return [{
    json: {
        ...item,
        hash,
        max_registros_por_pagina: maxRegistros,
        numero_pagina: numeroPagina,
        protocolo,
        id_vara: idVara,
        id_tipo_pedido: idTipoPedido,
        id_status: idStatus,
        data_solicitacao_inicial: dataSolicitacaoInicial,
        data_solicitacao_final: dataSolicitacaoFinal,
        data_resposta_inicial: dataRespostaInicial,
        data_resposta_final: dataRespostaFinal,
        url_servico_onr: urlServico,
        entrada_valida,
        codigo_erro,
        mensagem_erro
    }
}];`,
    };

    @node({
        id: 'd2e3f4a5-b6c7-4d8e-e9f0-a1b2c3d4e5f6',
        name: 'if-entrada-valida',
        type: 'n8n-nodes-base.if',
        version: 2.2,
        position: [976, 0],
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
                    id: 'e3f4a5b6-c7d8-4e9f-f0a1-b2c3d4e5f6a7',
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
        id: 'f4a5b6c7-d8e9-4f0a-a1b2-c3d4e5f6a7b8',
        name: 'montar-envelope-soap',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1296, -128],
    })
    MontarEnvelopeSoap = {
        jsCode: `const item = $input.first().json;

function escapeXml(valor) {
    return String(valor ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

const corpo = \`<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <tns:ListPedidosPO xmlns:tns="http://tempuri.org/WSOficio">
      <tns:oRequest>
        <tns:Hash>\${escapeXml(item.hash)}</tns:Hash>
        <tns:MaxRowPerPage>\${item.max_registros_por_pagina}</tns:MaxRowPerPage>
        <tns:PageNumber>\${item.numero_pagina}</tns:PageNumber>
        <tns:Protocolo>\${escapeXml(item.protocolo)}</tns:Protocolo>
        <tns:IDVara>\${item.id_vara}</tns:IDVara>
        <tns:IDTipoPedido>\${item.id_tipo_pedido}</tns:IDTipoPedido>
        <tns:IDStatus>\${item.id_status}</tns:IDStatus>
        <tns:DataSolicitacaoInicial>\${escapeXml(item.data_solicitacao_inicial)}</tns:DataSolicitacaoInicial>
        <tns:DataSolicitacaoFinal>\${escapeXml(item.data_solicitacao_final)}</tns:DataSolicitacaoFinal>
        <tns:DataRespostaInicial>\${escapeXml(item.data_resposta_inicial)}</tns:DataRespostaInicial>
        <tns:DataRespostaFinal>\${escapeXml(item.data_resposta_final)}</tns:DataRespostaFinal>
      </tns:oRequest>
    </tns:ListPedidosPO>
  </soap:Body>
</soap:Envelope>\`;

return [{ json: { ...item, corpo_soap: corpo } }];`,
    };

    @node({
        id: 'a5b6c7d8-e9f0-4a1b-b2c3-d4e5f6a7b8c9',
        name: 'consumir-soap-onr',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [1616, -128],
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
        id: 'b6c7d8e9-f0a1-4b2c-c3d4-e5f6a7b8c9d0',
        name: 'converter-resposta-onr',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1936, -128],
    })
    ConverterRespostaOnr = {
        jsCode: `const entrada = $input.first().json;
const xml = entrada.data;

function mapearStatusHttp(sucesso, codigoErro, origem = 'onr') {
    if (sucesso) return 200;
    if (origem === 'validacao') return 400;
    if ([2, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23].includes(codigoErro)) return 400;
    if ([45, 46, 47].includes(codigoErro)) return 401;
    if (codigoErro === 51) return 404;
    if (codigoErro === 50 || codigoErro === 52 || codigoErro === 53) return 403;
    if (codigoErro === 0) return 502;
    if (codigoErro === 1) return 503;
    return 422;
}

function dadosVazio() {
    return {
        quantidade_registros: 0,
        quantidade_paginas: 0,
        pedidos: []
    };
}

function respostaErro(statusHttp, codigoErro, mensagemErro) {
    return {
        status_http: statusHttp,
        sucesso: false,
        codigo_erro: codigoErro,
        mensagem_erro: mensagemErro,
        dados: dadosVazio()
    };
}

if (!xml || typeof xml !== 'string') {
    return { json: respostaErro(502, 0, 'Resposta inválida da ONR: XML não encontrado.') };
}

const extrairTag = (tag, origem) => {
    const regex = new RegExp(\`<(?:\\\\w+:)?\${tag}>(.*?)</(?:\\\\w+:)?\${tag}>\`, 's');
    const match = origem.match(regex);
    return match ? match[1].trim() : '';
};

const extrairPedidos = (origem) => {
    const pedidos = [];
    const regex = /<(?:\\w+:)?ListPedidosPO_Pedidos_WSResp[^>]*>([\\s\\S]*?)<\\/(?:\\w+:)?ListPedidosPO_Pedidos_WSResp>/g;
    let match;

    while ((match = regex.exec(origem)) !== null) {
        const bloco = match[1];
        pedidos.push({
            id_pedido: parseInt(extrairTag('IDPedido', bloco), 10) || 0,
            protocolo: extrairTag('Protocolo', bloco),
            id_vara: parseInt(extrairTag('IDVara', bloco), 10) || 0,
            vara: extrairTag('Vara', bloco),
            id_tipo_pedido: parseInt(extrairTag('IDTipoPedido', bloco), 10) || 0,
            id_status: parseInt(extrairTag('IDStatus', bloco), 10) || 0,
            data_solicitacao: extrairTag('DataSolicitacao', bloco),
            data_resposta: extrairTag('DataResposta', bloco)
        });
    }

    return pedidos;
};

const sucesso = extrairTag('RETORNO', xml) === 'true';
const codigo_erro = parseInt(extrairTag('CODIGOERRO', xml) || '0', 10);
const mensagem_erro = extrairTag('ERRODESCRICAO', xml);

return {
    json: {
        status_http: mapearStatusHttp(sucesso, codigo_erro, 'onr'),
        sucesso,
        codigo_erro,
        mensagem_erro,
        dados: sucesso ? {
            quantidade_registros: parseInt(extrairTag('QtdeRegistros', xml), 10) || 0,
            quantidade_paginas: parseInt(extrairTag('QtdePaginas', xml), 10) || 0,
            pedidos: extrairPedidos(xml)
        } : dadosVazio()
    }
};`,
    };

    @node({
        id: 'c7d8e9f0-a1b2-4c3d-d4e5-f6a7b8c9d0e1',
        name: 'resposta-validacao',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1296, 128],
    })
    RespostaValidacao = {
        jsCode: `const item = $input.first().json;

return [{
    json: {
        status_http: 400,
        sucesso: false,
        codigo_erro: item.codigo_erro,
        mensagem_erro: item.mensagem_erro,
        dados: {
            quantidade_registros: 0,
            quantidade_paginas: 0,
            pedidos: []
        }
    }
}];`,
    };

    @node({
        id: 'd8e9f0a1-b2c3-4d4e-e5f6-a7b8c9d0e1f2',
        name: 'resposta-erro-conexao-onr',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1936, 128],
    })
    RespostaErroConexaoOnr = {
        jsCode: `const erro = $input.first().json;
const mensagem = erro.error?.message || erro.message || 'Falha ao conectar com a ONR.';

return [{
    json: {
        status_http: 502,
        sucesso: false,
        codigo_erro: 0,
        mensagem_erro: mensagem,
        dados: {
            quantidade_registros: 0,
            quantidade_paginas: 0,
            pedidos: []
        }
    }
}];`,
    };

    @node({
        id: 'e9f0a1b2-c3d4-4e5f-f6a7-b8c9d0e1f2a3',
        name: 'Respond to Webhook',
        type: 'n8n-nodes-base.respondToWebhook',
        version: 1.5,
        position: [2256, 0],
    })
    RespondToWebhook = {
        respondWith: 'firstIncomingItem',
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
        this.ConsumirSoapOnr.error().to(this.RespostaErroConexaoOnr.in(0));
        this.ConverterRespostaOnr.out(0).to(this.RespondToWebhook.in(0));
        this.RespostaValidacao.out(0).to(this.RespondToWebhook.in(0));
        this.RespostaErroConexaoOnr.out(0).to(this.RespondToWebhook.in(0));
    }
}
