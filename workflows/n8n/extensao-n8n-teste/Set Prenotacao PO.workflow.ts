import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : Set Prenotacao PO
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
    id: 'De1OE9zv9QYpyXpR',
    name: 'Set Prenotacao PO',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class SetPrenotacaoPoWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'e1f2a3b4-c5d6-4e7f-8a9b-c0d1e2f3a4b5',
        webhookId: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 0],
        credentials: { httpBasicAuth: { id: 'CE3L7VlaRe4klqlk', name: 'ioshua + ioshua123' } },
    })
    Webhook = {
        httpMethod: 'POST',
        path: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'f2a3b4c5-d6e7-4f8a-9b0c-d1e2f3a4b5c6',
        name: 'normalizar-entrada',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [336, 0],
    })
    NormalizarEntrada = {
        mode: 'raw',
        jsonOutput: `={
  "hash": "{{ $json.body.hash }}",
  "id_pedido": {{ $json.body.id_pedido ?? null }},
  "numero_prenotacao": "{{ $json.body.numero_prenotacao }}",
  "data_prenotacao": "{{ $json.body.data_prenotacao }}",
  "data_vencimento": "{{ $json.body.data_vencimento }}",
  "url_servico_onr": "{{ $json.body.url_servico_onr ?? 'https://hml3-wsoficio.onr.org.br/penhoraonline.asmx' }}"
}
 `,
        options: {},
    };

    @node({
        id: 'a3b4c5d6-e7f8-4a9b-0c1d-e2f3a4b5c6d7',
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

const hash = String(item.hash ?? '').trim().toUpperCase();
const idPedido = normalizarInteiro(item.id_pedido);
const numeroPrenotacao = String(item.numero_prenotacao ?? '').trim();
const dataPrenotacao = String(item.data_prenotacao ?? '').trim();
const dataVencimento = String(item.data_vencimento ?? '').trim();
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
} else if (!Number.isFinite(idPedido) || idPedido < 1) {
    entrada_valida = false;
    codigo_erro = 12;
    mensagem_erro = 'id_pedido é obrigatório e deve ser um inteiro positivo.';
} else if (!numeroPrenotacao) {
    entrada_valida = false;
    codigo_erro = 13;
    mensagem_erro = 'numero_prenotacao é obrigatório.';
} else if (!dataPrenotacao) {
    entrada_valida = false;
    codigo_erro = 14;
    mensagem_erro = 'data_prenotacao é obrigatória.';
} else if (!dataValida(dataPrenotacao)) {
    entrada_valida = false;
    codigo_erro = 15;
    mensagem_erro = 'data_prenotacao inválida. Use aaaa-mm-dd.';
} else if (!dataVencimento) {
    entrada_valida = false;
    codigo_erro = 16;
    mensagem_erro = 'data_vencimento é obrigatória.';
} else if (!dataValida(dataVencimento)) {
    entrada_valida = false;
    codigo_erro = 17;
    mensagem_erro = 'data_vencimento inválida. Use aaaa-mm-dd.';
} else if (parseData(dataVencimento) < parseData(dataPrenotacao)) {
    entrada_valida = false;
    codigo_erro = 18;
    mensagem_erro = 'data_vencimento não pode ser anterior à data_prenotacao.';
} else if (!urlServico) {
    entrada_valida = false;
    codigo_erro = 10;
    mensagem_erro = 'url_servico_onr é obrigatória.';
}

return [{
    json: {
        ...item,
        hash,
        id_pedido: idPedido,
        numero_prenotacao: numeroPrenotacao,
        data_prenotacao: dataPrenotacao,
        data_vencimento: dataVencimento,
        url_servico_onr: urlServico,
        entrada_valida,
        codigo_erro,
        mensagem_erro
    }
}];`,
    };

    @node({
        id: 'b4c5d6e7-f8a9-4b0c-1d2e-f3a4b5c6d7e8',
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
                    id: 'c5d6e7f8-a9b0-4c1d-2e3f-a4b5c6d7e8f9',
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
        id: 'd6e7f8a9-b0c1-4d2e-3f4a-b5c6d7e8f9a0',
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
    <tns:SetPrenotacaoPO xmlns:tns="http://tempuri.org/WSOficio">
      <tns:oRequest>
        <tns:Hash>\${escapeXml(item.hash)}</tns:Hash>
        <tns:IDPedido>\${item.id_pedido}</tns:IDPedido>
        <tns:NumeroPrenotacao>\${escapeXml(item.numero_prenotacao)}</tns:NumeroPrenotacao>
        <tns:DataPrenotacao>\${escapeXml(item.data_prenotacao)}</tns:DataPrenotacao>
        <tns:DataVencimento>\${escapeXml(item.data_vencimento)}</tns:DataVencimento>
      </tns:oRequest>
    </tns:SetPrenotacaoPO>
  </soap:Body>
</soap:Envelope>\`;

return [{ json: { ...item, corpo_soap: corpo } }];`,
    };

    @node({
        id: 'e7f8a9b0-c1d2-4e3f-4a5b-c6d7e8f9a0b1',
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
        id: 'f8a9b0c1-d2e3-4f4a-5b6c-d7e8f9a0b1c2',
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
    if ([2, 10, 11, 12, 13, 14, 15, 16, 17, 18].includes(codigoErro)) return 400;
    if ([45, 46, 47].includes(codigoErro)) return 401;
    if (codigoErro === 51) return 404;
    if (codigoErro === 52) return 403;
    if (codigoErro === 55) return 409;
    if (codigoErro === 0) return 502;
    if (codigoErro === 1) return 503;
    return 422;
}

function dadosPadrao(sucesso = false) {
    return {
        id_pedido: entrada.id_pedido ?? 0,
        numero_prenotacao: entrada.numero_prenotacao ?? '',
        data_prenotacao: entrada.data_prenotacao ?? '',
        data_vencimento: entrada.data_vencimento ?? '',
        prenotacao_registrada: sucesso
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
    return { json: respostaErro(502, 0, 'Resposta inválida da ONR: XML não encontrado.') };
}

const extrairTag = (tag, origem) => {
    const regex = new RegExp(\`<(?:\\\\w+:)?\${tag}>(.*?)</(?:\\\\w+:)?\${tag}>\`, 's');
    const match = origem.match(regex);
    return match ? match[1].trim() : '';
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
        dados: dadosPadrao(sucesso)
    }
};`,
    };

    @node({
        id: 'a9b0c1d2-e3f4-4a5b-6c7d-e8f9a0b1c2d3',
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
            numero_prenotacao: item.numero_prenotacao ?? '',
            data_prenotacao: item.data_prenotacao ?? '',
            data_vencimento: item.data_vencimento ?? '',
            prenotacao_registrada: false
        }
    }
}];`,
    };

    @node({
        id: 'b0c1d2e3-f4a5-4b6c-7d8e-f9a0b1c2d3e4',
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
            numero_prenotacao: erro.numero_prenotacao ?? '',
            data_prenotacao: erro.data_prenotacao ?? '',
            data_vencimento: erro.data_vencimento ?? '',
            prenotacao_registrada: false
        }
    }
}];`,
    };

    @node({
        id: 'c1d2e3f4-a5b6-4c7d-8e9f-a0b1c2d3e4f5',
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
