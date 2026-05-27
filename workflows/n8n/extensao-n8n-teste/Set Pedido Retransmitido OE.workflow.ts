import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : Set Pedido Retransmitido OE
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
    id: '9euY3Y5fEQ7QPin0',
    name: 'Set Pedido Retransmitido OE',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class SetPedidoRetransmitidoOeWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: '8c74ed02-3dde-4318-a736-6bc7a87c41a2',
        webhookId: '74213246-f338-4574-ae26-17a12337a247',
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 0],
        credentials: { httpBasicAuth: { id: 'CE3L7VlaRe4klqlk', name: 'ioshua + ioshua123' } },
    })
    Webhook = {
        httpMethod: 'POST',
        path: '74213246-f338-4574-ae26-17a12337a247',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: '8eac1f6c-d2ea-4abd-a8dc-c808e655eb27',
        name: 'normalizar-entrada',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [336, 0],
    })
    NormalizarEntrada = {
        mode: 'raw',
        jsonOutput: `={{
  hash: $json.body.hash ?? '',
  id_pedido: $json.body.id_pedido ?? null,
  id_cartorio: $json.body.id_cartorio ?? null,
  observacoes: $json.body.observacoes ?? '',
  url_servico_onr: $json.body.url_servico_onr ?? 'https://hml3-wsoficio.onr.org.br/oficios.asmx'
}}
 `,
        options: {},
    };

    @node({
        id: 'b84f3748-cf87-4f16-a34b-78d4a02f1e11',
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

function urlValida(valor) {
    try {
        const url = new URL(valor);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
}

const hash = String(item.hash ?? '').trim().toUpperCase();
const idPedido = normalizarInteiro(item.id_pedido);
const idCartorio = normalizarInteiro(item.id_cartorio);
const observacoes = String(item.observacoes ?? '').trim();
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
} else if (!Number.isFinite(idPedido) || idPedido < 1) {
    entrada_valida = false;
    codigo_erro = 12;
    mensagem_erro = 'id_pedido e obrigatorio e deve ser um inteiro positivo.';
} else if (!Number.isFinite(idCartorio) || idCartorio < 1) {
    entrada_valida = false;
    codigo_erro = 13;
    mensagem_erro = 'id_cartorio e obrigatorio e deve ser um inteiro positivo.';
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
        id_pedido: idPedido,
        id_cartorio: idCartorio,
        observacoes,
        url_servico_onr: urlServico,
        entrada_valida,
        codigo_erro,
        mensagem_erro
    }
}];`,
    };

    @node({
        id: 'dc8f7712-332e-4481-a0ee-a8ffbc76ad4d',
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
                    id: 'de1819cb-f750-4b54-afef-1d4f6b4afb81',
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
        id: '88df47d8-c4af-4a5d-a6ea-fd8e20f34375',
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

const observacoesTag = item.observacoes
    ? '\\n        <tns:Observacoes>' + escapeXml(item.observacoes) + '</tns:Observacoes>'
    : '';

const corpo = \`<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <tns:SetPedidoRetransmitidoOE xmlns:tns="http://tempuri.org/WSOficio">
      <tns:oRequest>
        <tns:Hash>\${escapeXml(item.hash)}</tns:Hash>
        <tns:IDPedido>\${item.id_pedido}</tns:IDPedido>
        <tns:IDCartorio>\${item.id_cartorio}</tns:IDCartorio>\${observacoesTag}
      </tns:oRequest>
    </tns:SetPedidoRetransmitidoOE>
  </soap:Body>
</soap:Envelope>\`;

return [{ json: { ...item, corpo_soap: corpo } }];`,
    };

    @node({
        id: 'ba191127-8f5c-4302-93c6-a5ab28da3b7d',
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
        id: '9ef66aaf-dda1-4ecb-9348-ef6f3f56fd43',
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
    if ([2, 10, 11, 12, 13].includes(codigoErro)) return 400;
    if ([45, 46, 47].includes(codigoErro)) return 401;
    if (codigoErro === 52) return 403;
    if (codigoErro === 51) return 404;
    if ([501, 502].includes(codigoErro)) return 409;
    if ([503, 504].includes(codigoErro)) return 422;
    if (codigoErro === 0) return 502;
    if (codigoErro === 1) return 503;
    return 422;
}

function dadosPadrao(sucesso = false) {
    return {
        id_pedido: entrada.id_pedido ?? 0,
        id_cartorio: entrada.id_cartorio ?? 0,
        observacoes: entrada.observacoes ?? '',
        retransmitido: sucesso
    };
}

function respostaErro(statusHttp, codigoErro, mensagemErro) {
    return {
        status_http: statusHttp,
        sucesso: false,
        codigo_erro: codigoErro,
        mensagem_erro: mensagemErro,
        dados: dadosPadrao(false)
    };
}

if (!xml || typeof xml !== 'string') {
    return { json: respostaErro(502, 0, 'Resposta invalida da ONR: XML nao encontrado.') };
}

const extrairTag = (tag, origem) => {
    const regex = new RegExp(\`<(?:\\\\w+:)?\${tag}(?:\\\\s[^>]*)?>(.*?)</(?:\\\\w+:)?\${tag}>\`, 's');
    const match = String(origem ?? '').match(regex);
    return match ? match[1].trim() : '';
};

const sucesso = extrairTag('RETORNO', xml).toLowerCase() === 'true';
const codigo_erro = parseInt(extrairTag('CODIGOERRO', xml) || '0', 10);
const mensagem_erro = extrairTag('ERRODESCRICAO', xml);

return {
    json: {
        status_http: mapearStatusHttp(sucesso, codigo_erro, 'onr'),
        sucesso,
        codigo_erro,
        mensagem_erro,
        dados: dadosPadrao(sucesso)
    }
};`,
    };

    @node({
        id: '3c7f6e93-69b0-40a3-822b-9f2b4c50f2c9',
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
            id_pedido: item.id_pedido ?? 0,
            id_cartorio: item.id_cartorio ?? 0,
            observacoes: item.observacoes ?? '',
            retransmitido: false
        }
    }
}];`,
    };

    @node({
        id: 'a3c0f35f-4d3f-4c42-8107-5b23c390e616',
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
            id_pedido: erro.id_pedido ?? 0,
            id_cartorio: erro.id_cartorio ?? 0,
            observacoes: erro.observacoes ?? '',
            retransmitido: false
        }
    }
}];`,
    };

    @node({
        id: '8f476387-c26f-42ee-9312-873fe6f954dd',
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
