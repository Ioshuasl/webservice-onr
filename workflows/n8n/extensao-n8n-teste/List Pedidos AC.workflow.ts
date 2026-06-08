import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : [AUTONR-58] (webservice ONR) ListPedidosAC - E-Protocolo
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
    id: '4YWN4anTgRkBFH2e',
    name: '[AUTONR-58] (webservice ONR) ListPedidosAC - E-Protocolo',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class Autonr58WebserviceOnrListpedidosacEProtocoloWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: '8c730537-c95d-4229-8024-facbd18be7c2',
        webhookId: 'a8b9c0d1-e2f3-4a5b-9c0d-1e2f3a4b5c6d',
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [-1296, 128],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    Webhook = {
        httpMethod: 'POST',
        path: 'a8b9c0d1-e2f3-4a5b-9c0d-1e2f3a4b5c6d',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: '371e2b6e-3fe4-4c78-aaa5-b490cb6e0abd',
        name: 'normalizar-entrada',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [-960, 128],
    })
    NormalizarEntrada = {
        mode: 'raw',
        jsonOutput: `={
  "hash": "{{ $json.body.hash ?? '' }}",
  "max_registros_por_pagina": {{ $json.body.max_registros_por_pagina ?? 50 }},
  "numero_pagina": {{ $json.body.numero_pagina ?? 1 }},
  "protocolo": "{{ $json.body.protocolo ?? '' }}",
  "instituicao": "{{ $json.body.instituicao ?? '' }}",
  "id_tipo_servico": {{ $json.body.id_tipo_servico ?? -1 }},
  "id_status": {{ $json.body.id_status ?? -1 }},
  "data_solicitacao_inicial": "{{ $json.body.data_solicitacao_inicial ?? '' }}",
  "data_solicitacao_final": "{{ $json.body.data_solicitacao_final ?? '' }}",
  "numero_banco": {{ $json.body.numero_banco ?? -1 }},
  "url_servico_onr": "{{ $json.body.url_servico_onr ?? 'https://hml3-wsoficio.onr.org.br/eprotocolo.asmx' }}"
}
 `,
        options: {},
    };

    @node({
        id: '54d4f10e-a9c4-4a91-9a51-180029e9df51',
        name: 'validar-entrada',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [-640, 128],
    })
    ValidarEntrada = {
        jsCode: `const item = $input.first().json;

const TIPOS_SERVICO_VALIDOS = new Set([-1, 1, 2, 3]);
const STATUS_VALIDOS = new Set([-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

function normalizarInteiro(valor) {
    const numero = Number(valor);
    return Number.isInteger(numero) ? numero : NaN;
}

function dataValida(valor) {
    const texto = String(valor ?? '').trim();
    if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(texto)) return false;
    const [ano, mes, dia] = texto.split('-').map(Number);
    const data = new Date(ano, mes - 1, dia);
    return data.getFullYear() === ano && data.getMonth() === mes - 1 && data.getDate() === dia;
}

function parseData(valor) {
    const [ano, mes, dia] = String(valor).trim().split('-').map(Number);
    return new Date(ano, mes - 1, dia);
}

const hash = String(item.hash ?? '').trim().toUpperCase();
const maxRegistros = normalizarInteiro(item.max_registros_por_pagina);
const numeroPagina = normalizarInteiro(item.numero_pagina);
const protocolo = String(item.protocolo ?? '').trim();
const instituicao = String(item.instituicao ?? '').trim();
const idTipoServico = normalizarInteiro(item.id_tipo_servico);
const idStatus = normalizarInteiro(item.id_status);
const dataInicial = String(item.data_solicitacao_inicial ?? '').trim();
const dataFinal = String(item.data_solicitacao_final ?? '').trim();
const numeroBanco = normalizarInteiro(item.numero_banco);
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
} else if (!Number.isFinite(idTipoServico) || !TIPOS_SERVICO_VALIDOS.has(idTipoServico)) {
    entrada_valida = false;
    codigo_erro = 10;
    mensagem_erro = 'id_tipo_servico inválido. Use -1, 1, 2 ou 3.';
} else if (!Number.isFinite(idStatus) || !STATUS_VALIDOS.has(idStatus)) {
    entrada_valida = false;
    codigo_erro = 10;
    mensagem_erro = 'id_status inválido. Use -1 para todos ou 0 a 10.';
} else if (!Number.isFinite(numeroBanco) || (numeroBanco < -1)) {
    entrada_valida = false;
    codigo_erro = 10;
    mensagem_erro = 'numero_banco inválido. Use -1 ou 0 para todos.';
} else if (protocolo && protocolo.length > 12) {
    entrada_valida = false;
    codigo_erro = 10;
    mensagem_erro = 'protocolo inválido: máximo 12 caracteres.';
} else if (dataInicial && !dataValida(dataInicial)) {
    entrada_valida = false;
    codigo_erro = 16;
    mensagem_erro = 'data_solicitacao_inicial inválida. Use aaaa-mm-dd.';
} else if (dataFinal && !dataValida(dataFinal)) {
    entrada_valida = false;
    codigo_erro = 16;
    mensagem_erro = 'data_solicitacao_final inválida. Use aaaa-mm-dd.';
} else if (dataInicial && dataFinal && parseData(dataFinal) < parseData(dataInicial)) {
    entrada_valida = false;
    codigo_erro = 16;
    mensagem_erro = 'data_solicitacao_final deve ser maior ou igual à inicial.';
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
        instituicao,
        id_tipo_servico: idTipoServico,
        id_status: idStatus,
        data_solicitacao_inicial: dataInicial,
        data_solicitacao_final: dataFinal,
        numero_banco: numeroBanco,
        url_servico_onr: urlServico,
        entrada_valida,
        codigo_erro,
        mensagem_erro
    }
}];`,
    };

    @node({
        id: 'd0a4bdd0-724a-40db-a755-ad7b7c74742e',
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
                    id: 'b2c3d4e5-f6a7-4890-b123-456789abcdef',
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
        id: '6b34d258-65d0-4516-8d82-7d55d148d1bf',
        name: 'montar-envelope-soap',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [0, 0],
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
    <tns:ListPedidosAC xmlns:tns="http://tempuri.org/WSOficio">
      <tns:oRequest>
        <tns:Hash>\${escapeXml(item.hash)}</tns:Hash>
        <tns:MaxRowPerPage>\${item.max_registros_por_pagina}</tns:MaxRowPerPage>
        <tns:PageNumber>\${item.numero_pagina}</tns:PageNumber>
        <tns:Protocolo>\${escapeXml(item.protocolo)}</tns:Protocolo>
        <tns:Instituicao>\${escapeXml(item.instituicao)}</tns:Instituicao>
        <tns:IDTipoServico>\${item.id_tipo_servico}</tns:IDTipoServico>
        <tns:IDStatus>\${item.id_status}</tns:IDStatus>
        <tns:DataSolicitacaoInicial>\${escapeXml(item.data_solicitacao_inicial)}</tns:DataSolicitacaoInicial>
        <tns:DataSolicitacaoFinal>\${escapeXml(item.data_solicitacao_final)}</tns:DataSolicitacaoFinal>
        <tns:NumeroBanco>\${item.numero_banco}</tns:NumeroBanco>
      </tns:oRequest>
    </tns:ListPedidosAC>
  </soap:Body>
</soap:Envelope>\`;

return [{ json: { ...item, corpo_soap: corpo } }];`,
    };

    @node({
        id: '129f31a4-a064-48b7-a916-40576fe101a6',
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
        id: '169ec205-045b-4d2f-80a3-c2109257ef6f',
        name: 'converter-resposta-onr',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [640, 0],
    })
    ConverterRespostaOnr = {
        jsCode: `const entrada = $input.first().json;
const xml = entrada.data;

function mapearStatusHttp(sucesso, codigoErro, origem = 'onr') {
    if (sucesso) return 200;
    if (origem === 'validacao') return 400;
    if ([2, 10, 11, 12, 13, 16].includes(codigoErro)) return 400;
    if ([45, 46, 47].includes(codigoErro)) return 401;
    if (codigoErro === 55) return 403;
    if (codigoErro === 0) return 502;
    if (codigoErro === 1) return 503;
    return 422;
}

function decodeXml(valor) {
    return String(valor ?? '')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&amp;/g, '&');
}

function extrairTag(tag, origem) {
    const regex = new RegExp('<(?:\\\\w+:)?' + tag + '>(.*?)</(?:\\\\w+:)?' + tag + '>', 's');
    const match = origem.match(regex);
    return match ? decodeXml(match[1].trim()) : '';
}

function extrairPedidos(origem) {
    const pedidos = [];
    const regex = /<(?:\\w+:)?ListPedidosAC_Pedidos_WSResp[^>]*>([\\s\\S]*?)<\\/(?:\\w+:)?ListPedidosAC_Pedidos_WSResp>/g;
    let match;

    while ((match = regex.exec(origem)) !== null) {
        const bloco = match[1];
        pedidos.push({
            id_contrato: parseInt(extrairTag('IDContrato', bloco), 10) || 0,
            protocolo: extrairTag('Protocolo', bloco),
            instituicao: extrairTag('Instituicao', bloco),
            id_tipo_servico: parseInt(extrairTag('IDTipoServico', bloco), 10) || 0,
            id_status: parseInt(extrairTag('IDStatus', bloco), 10) || 0,
            data_solicitacao: extrairTag('DataSolicitacao', bloco)
        });
    }

    return pedidos;
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

const sucesso = extrairTag('RETORNO', xml).toLowerCase() === 'true';
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
        id: '7ea8a5ac-167f-47f6-9988-3ee5a4bf1cf4',
        name: 'resposta-validacao',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [0, 256],
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
        id: '6a5345b1-8fe3-4850-b783-adc287bda220',
        name: 'resposta-erro-conexao-onr',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [640, 256],
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
        id: '3b424835-6eea-4f19-8e88-3d5077df00c1',
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
        this.ConsumirSoapOnr.error().to(this.RespostaErroConexaoOnr.in(0));
        this.ConverterRespostaOnr.out(0).to(this.RespondToWebhook.in(0));
        this.RespostaValidacao.out(0).to(this.RespondToWebhook.in(0));
        this.RespostaErroConexaoOnr.out(0).to(this.RespondToWebhook.in(0));
    }
}
