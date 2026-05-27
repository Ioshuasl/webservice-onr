import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : List Pedidos OE V2
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
    id: 'IznqVifl4m45sGgW',
    name: 'List Pedidos OE V2',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class ListPedidosOeV2Workflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'e6f7a8b9-c0d1-4e2f-b3c4-d5e6f7a8b9d0',
        webhookId: 'd5e6f7a8-b9c0-4d1e-af2a-b3c4d5e6f7a9',
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 0],
        credentials: { httpBasicAuth: { id: 'CE3L7VlaRe4klqlk', name: 'ioshua + ioshua123' } },
    })
    Webhook = {
        httpMethod: 'POST',
        path: 'd5e6f7a8-b9c0-4d1e-af2a-b3c4d5e6f7a9',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'f7a8b9c0-d1e2-4f3a-c4d5-e6f7a8b9c0d1',
        name: 'normalizar-entrada',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [336, 0],
    })
    NormalizarEntrada = {
        mode: 'raw',
        jsonOutput: `={{
  hash: $json.body.hash ?? '',
  max_registros_por_pagina: $json.body.max_registros_por_pagina ?? 50,
  numero_pagina: $json.body.numero_pagina ?? 1,
  protocolo: $json.body.protocolo ?? '',
  id_instituicao: $json.body.id_instituicao ?? -1,
  id_tipo_pesquisa: $json.body.id_tipo_pesquisa ?? -1,
  id_status: $json.body.id_status ?? -1,
  data_solicitacao_inicial: $json.body.data_solicitacao_inicial ?? '',
  data_solicitacao_final: $json.body.data_solicitacao_final ?? '',
  data_resposta_inicial: $json.body.data_resposta_inicial ?? '',
  data_resposta_final: $json.body.data_resposta_final ?? '',
  url_servico_onr: $json.body.url_servico_onr ?? 'https://hml3-wsoficio.onr.org.br/oficios.asmx'
}}
 `,
        options: {},
    };

    @node({
        id: 'a8b9c0d1-e2f3-4a4b-95d6-e7f8a9b0c1e6',
        name: 'validar-entrada',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [656, 0],
    })
    ValidarEntrada = {
        jsCode: `const item = $input.first().json;

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

function urlValida(valor) {
    try {
        const url = new URL(valor);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
}

const hash = String(item.hash ?? '').trim().toUpperCase();
const maxRegistros = normalizarInteiro(item.max_registros_por_pagina);
const numeroPagina = normalizarInteiro(item.numero_pagina);
const protocolo = String(item.protocolo ?? '').trim();
const idInstituicao = normalizarInteiro(item.id_instituicao);
const idTipoPesquisa = normalizarInteiro(item.id_tipo_pesquisa);
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
    mensagem_erro = 'O hash de validacao nao foi informado.';
} else if (!/^[0-9A-F]{40}$/.test(hash)) {
    entrada_valida = false;
    codigo_erro = 11;
    mensagem_erro = 'Hash invalido: informe 40 caracteres hexadecimais maiusculos.';
} else if (!Number.isFinite(maxRegistros) || maxRegistros < 10) {
    entrada_valida = false;
    codigo_erro = 12;
    mensagem_erro = 'max_registros_por_pagina invalido: minimo 10.';
} else if (!Number.isFinite(numeroPagina) || numeroPagina < 1) {
    entrada_valida = false;
    codigo_erro = 13;
    mensagem_erro = 'numero_pagina invalido: minimo 1.';
} else if (!Number.isFinite(idInstituicao) || idInstituicao < -1 || idInstituicao === 0) {
    entrada_valida = false;
    codigo_erro = 10;
    mensagem_erro = 'id_instituicao invalido. Use -1 para todas ou um inteiro positivo.';
} else if (!Number.isFinite(idTipoPesquisa) || idTipoPesquisa < -1 || idTipoPesquisa === 0) {
    entrada_valida = false;
    codigo_erro = 10;
    mensagem_erro = 'id_tipo_pesquisa invalido. Use -1 para todos ou um inteiro positivo.';
} else if (!Number.isFinite(idStatus) || idStatus < -1 || idStatus === 0) {
    entrada_valida = false;
    codigo_erro = 10;
    mensagem_erro = 'id_status invalido. Use -1 para todos ou um inteiro positivo.';
} else if (!dataSolicitacaoInicial) {
    entrada_valida = false;
    codigo_erro = 14;
    mensagem_erro = 'data_solicitacao_inicial e obrigatoria.';
} else if (!dataValida(dataSolicitacaoInicial)) {
    entrada_valida = false;
    codigo_erro = 15;
    mensagem_erro = 'data_solicitacao_inicial invalida. Use aaaa-mm-dd.';
} else if (!dataSolicitacaoFinal) {
    entrada_valida = false;
    codigo_erro = 16;
    mensagem_erro = 'data_solicitacao_final e obrigatoria.';
} else if (!dataValida(dataSolicitacaoFinal)) {
    entrada_valida = false;
    codigo_erro = 17;
    mensagem_erro = 'data_solicitacao_final invalida. Use aaaa-mm-dd.';
} else if (parseData(dataSolicitacaoFinal) < parseData(dataSolicitacaoInicial)) {
    entrada_valida = false;
    codigo_erro = 17;
    mensagem_erro = 'data_solicitacao_final deve ser maior ou igual a inicial.';
} else if (periodoEmDias(dataSolicitacaoInicial, dataSolicitacaoFinal) > 30) {
    entrada_valida = false;
    codigo_erro = 18;
    mensagem_erro = 'O periodo de solicitacao nao pode ser maior que 30 dias.';
} else if (dataRespostaInicial && !dataValida(dataRespostaInicial)) {
    entrada_valida = false;
    codigo_erro = 19;
    mensagem_erro = 'data_resposta_inicial invalida. Use aaaa-mm-dd.';
} else if (dataRespostaFinal && !dataValida(dataRespostaFinal)) {
    entrada_valida = false;
    codigo_erro = 20;
    mensagem_erro = 'data_resposta_final invalida. Use aaaa-mm-dd.';
} else if (dataRespostaInicial && dataRespostaFinal && parseData(dataRespostaFinal) < parseData(dataRespostaInicial)) {
    entrada_valida = false;
    codigo_erro = 20;
    mensagem_erro = 'data_resposta_final deve ser maior ou igual a inicial.';
} else if (!urlServico) {
    entrada_valida = false;
    codigo_erro = 10;
    mensagem_erro = 'url_servico_onr e obrigatoria.';
} else if (!urlValida(urlServico)) {
    entrada_valida = false;
    codigo_erro = 10;
    mensagem_erro = 'url_servico_onr deve ser uma URL http ou https valida.';
}

return [{
    json: {
        ...item,
        hash,
        max_registros_por_pagina: maxRegistros,
        numero_pagina: numeroPagina,
        protocolo,
        id_instituicao: idInstituicao,
        id_tipo_pesquisa: idTipoPesquisa,
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
        id: 'b9c0d1e2-f3a4-4b5c-a6e7-f8a9b0c1d2e7',
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
                    id: 'c0d1e2f3-a4b5-4c6d-b7f8-a9b0c1d2e3f8',
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
        id: 'd0e1f2a3-b4c5-4d7e-c8f9-a0b1c2d3e4f9',
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
    <tns:ListPedidosOE_V2 xmlns:tns="http://tempuri.org/WSOficio">
      <tns:oRequest>
        <tns:Hash>\${escapeXml(item.hash)}</tns:Hash>
        <tns:MaxRowPerPage>\${item.max_registros_por_pagina}</tns:MaxRowPerPage>
        <tns:PageNumber>\${item.numero_pagina}</tns:PageNumber>
        <tns:Protocolo>\${escapeXml(item.protocolo)}</tns:Protocolo>
        <tns:IDInstituicao>\${item.id_instituicao}</tns:IDInstituicao>
        <tns:IDTipoPesquisa>\${item.id_tipo_pesquisa}</tns:IDTipoPesquisa>
        <tns:IDStatus>\${item.id_status}</tns:IDStatus>
        <tns:DataSolicitacaoInicial>\${escapeXml(item.data_solicitacao_inicial)}</tns:DataSolicitacaoInicial>
        <tns:DataSolicitacaoFinal>\${escapeXml(item.data_solicitacao_final)}</tns:DataSolicitacaoFinal>
        <tns:DataRespostaInicial>\${escapeXml(item.data_resposta_inicial)}</tns:DataRespostaInicial>
        <tns:DataRespostaFinal>\${escapeXml(item.data_resposta_final)}</tns:DataRespostaFinal>
      </tns:oRequest>
    </tns:ListPedidosOE_V2>
  </soap:Body>
</soap:Envelope>\`;

return [{ json: { ...item, corpo_soap: corpo } }];`,
    };

    @node({
        id: 'e1f2a3b4-c5d6-4e8f-99a0-b1c2d3e4f5a0',
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
        id: 'f2a3b4c5-d6e7-4f9a-a0b1-c2d3e4f5a1',
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
    if ([2, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 30].includes(codigoErro)) return 400;
    if ([45, 46, 47].includes(codigoErro)) return 401;
    if (codigoErro === 51) return 404;
    if (codigoErro === 0) return 502;
    if (codigoErro === 1) return 503;
    return 422;
}

function filtros() {
    return {
        max_registros_por_pagina: entrada.max_registros_por_pagina ?? 50,
        numero_pagina: entrada.numero_pagina ?? 1,
        protocolo: entrada.protocolo ?? '',
        id_instituicao: entrada.id_instituicao ?? -1,
        id_tipo_pesquisa: entrada.id_tipo_pesquisa ?? -1,
        id_status: entrada.id_status ?? -1,
        data_solicitacao_inicial: entrada.data_solicitacao_inicial ?? '',
        data_solicitacao_final: entrada.data_solicitacao_final ?? '',
        data_resposta_inicial: entrada.data_resposta_inicial ?? '',
        data_resposta_final: entrada.data_resposta_final ?? ''
    };
}

function dadosVazio() {
    return {
        operacao_soap: 'ListPedidosOE_V2',
        filtros: filtros(),
        quantidade_registros: 0,
        quantidade_paginas: 0,
        quantidade_pedidos: 0,
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
    return { json: respostaErro(502, 0, 'Resposta invalida da ONR: XML nao encontrado.') };
}

function decodificarXml(valor) {
    return String(valor ?? '')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&amp;/g, '&');
}

function extrairTag(tag, origem) {
    const regex = new RegExp(\`<(?:\\\\w+:)?\${tag}(?:\\\\s[^>]*)?>([\\\\s\\\\S]*?)</(?:\\\\w+:)?\${tag}>\`, 'i');
    const match = String(origem ?? '').match(regex);
    return match ? decodificarXml(match[1].trim()) : '';
}

function extrairBlocos(tag, origem) {
    const blocos = [];
    const regex = new RegExp(\`<(?:\\\\w+:)?\${tag}(?:\\\\s[^>]*)?>([\\\\s\\\\S]*?)</(?:\\\\w+:)?\${tag}>\`, 'gi');
    let match;

    while ((match = regex.exec(String(origem ?? ''))) !== null) {
        blocos.push(match[1]);
    }

    return blocos;
}

function inteiro(tag, origem) {
    const valor = parseInt(extrairTag(tag, origem), 10);
    return Number.isNaN(valor) ? 0 : valor;
}

function parsePedidos(origem) {
    return extrairBlocos('ListPedidosOE_V2_Pedidos_WSResp', origem).map((bloco) => ({
        id_pedido: inteiro('IDPedido', bloco),
        id_status: inteiro('IDStatus', bloco),
        id_instituicao: inteiro('IDInstituicao', bloco),
        cnpj_instituicao: extrairTag('CNPJInstituicao', bloco),
        instituicao: extrairTag('Instituicao', bloco),
        id_tipo_pesquisa: inteiro('IDTipoPesquisa', bloco),
        protocolo: extrairTag('Protocolo', bloco),
        numero_oficio: extrairTag('NumeroOficio', bloco),
        data_solicitacao: extrairTag('DataSolicitacao', bloco),
        data_resposta: extrairTag('DataResposta', bloco)
    }));
}

const sucesso = extrairTag('RETORNO', xml).toLowerCase() === 'true';
const codigo_erro = parseInt(extrairTag('CODIGOERRO', xml) || '0', 10);
const mensagem_erro = extrairTag('ERRODESCRICAO', xml);
const pedidos = sucesso ? parsePedidos(xml) : [];

return {
    json: {
        status_http: mapearStatusHttp(sucesso, codigo_erro, 'onr'),
        sucesso,
        codigo_erro,
        mensagem_erro,
        dados: sucesso ? {
            operacao_soap: 'ListPedidosOE_V2',
            filtros: filtros(),
            quantidade_registros: parseInt(extrairTag('QtdeRegistros', xml), 10) || 0,
            quantidade_paginas: parseInt(extrairTag('QtdePaginas', xml), 10) || 0,
            quantidade_pedidos: pedidos.length,
            pedidos
        } : dadosVazio()
    }
};`,
    };

    @node({
        id: 'a3b4c5d6-e7f8-4b0c-a1d2-e3f4a5b6c7e2',
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
            operacao_soap: 'ListPedidosOE_V2',
            filtros: {
                max_registros_por_pagina: item.max_registros_por_pagina ?? 50,
                numero_pagina: item.numero_pagina ?? 1,
                protocolo: item.protocolo ?? '',
                id_instituicao: item.id_instituicao ?? -1,
                id_tipo_pesquisa: item.id_tipo_pesquisa ?? -1,
                id_status: item.id_status ?? -1,
                data_solicitacao_inicial: item.data_solicitacao_inicial ?? '',
                data_solicitacao_final: item.data_solicitacao_final ?? '',
                data_resposta_inicial: item.data_resposta_inicial ?? '',
                data_resposta_final: item.data_resposta_final ?? ''
            },
            quantidade_registros: 0,
            quantidade_paginas: 0,
            quantidade_pedidos: 0,
            pedidos: []
        }
    }
}];`,
    };

    @node({
        id: 'b4c5d6e7-f8a9-4b1c-b2d3-e4f5a6b7c8e3',
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
            operacao_soap: 'ListPedidosOE_V2',
            filtros: {
                max_registros_por_pagina: erro.max_registros_por_pagina ?? 50,
                numero_pagina: erro.numero_pagina ?? 1,
                protocolo: erro.protocolo ?? '',
                id_instituicao: erro.id_instituicao ?? -1,
                id_tipo_pesquisa: erro.id_tipo_pesquisa ?? -1,
                id_status: erro.id_status ?? -1,
                data_solicitacao_inicial: erro.data_solicitacao_inicial ?? '',
                data_solicitacao_final: erro.data_solicitacao_final ?? '',
                data_resposta_inicial: erro.data_resposta_inicial ?? '',
                data_resposta_final: erro.data_resposta_final ?? ''
            },
            quantidade_registros: 0,
            quantidade_paginas: 0,
            quantidade_pedidos: 0,
            pedidos: []
        }
    }
}];`,
    };

    @node({
        id: 'c5d6e7f8-a9b0-4c2d-b3e4-f5a6b7c8d9e4',
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
