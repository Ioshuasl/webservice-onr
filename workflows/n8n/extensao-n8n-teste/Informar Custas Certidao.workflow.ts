import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : [AUTONR-54] (webservice ONR) InformarCustasCertidao - Certidões
// Nodes   : 10  |  Connections: 11
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// Webhook                            webhook                    [creds]
// NormalizarEntrada                  code
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
    id: '9h33TU4MVJvPcz1A',
    name: '[AUTONR-54] (webservice ONR) InformarCustasCertidao - Certidões',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class Autonr54WebserviceOnrInformarcustascertidaoCertidoesWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'a54b1c2d-3e4f-5a6b-7c8d-9e0f1a2b3c54',
        webhookId: 'd4e5f6a7-b8c9-4012-d345-678901abcdef',
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 0],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    Webhook = {
        httpMethod: 'POST',
        path: 'd4e5f6a7-b8c9-4012-d345-678901abcdef',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'b54c2d3e-4f5a-6b7c-8d9e-0f1a2b3c4d54',
        name: 'normalizar-entrada',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [336, 0],
    })
    NormalizarEntrada = {
        jsCode: `const raw = $input.first().json;
const body = raw.body ?? raw;

const hash = String(body.hash ?? '').trim().toUpperCase();
const protocolo = String(body.protocolo ?? '').trim();
const url_servico_onr = String(
    body.url_servico_onr ?? 'https://hml3-wsoficio.onr.org.br/Certidoes.asmx'
).trim();

let valor_custas = body.valor_custas;
if (typeof valor_custas === 'string') {
    valor_custas = valor_custas.replace(',', '.');
}

return [{
    json: {
        hash,
        protocolo,
        valor_custas,
        url_servico_onr
    }
}];`,
    };

    @node({
        id: 'c54d3e4f-5a6b-7c8d-9e0f-1a2b3c4d5e54',
        name: 'validar-entrada',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [656, 0],
    })
    ValidarEntrada = {
        jsCode: `const item = $input.first().json;

const hash = String(item.hash ?? '').trim().toUpperCase();
const protocolo = String(item.protocolo ?? '').trim();
const valorCustas = Number(String(item.valor_custas ?? '').replace(',', '.'));
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
} else if (!protocolo) {
    entrada_valida = false;
    codigo_erro = 10;
    mensagem_erro = 'protocolo é obrigatório.';
} else if (!Number.isFinite(valorCustas) || valorCustas <= 0) {
    entrada_valida = false;
    codigo_erro = 14;
    mensagem_erro = 'valor_custas é obrigatório e deve ser um decimal maior que zero.';
} else if (!urlServico) {
    entrada_valida = false;
    codigo_erro = 10;
    mensagem_erro = 'url_servico_onr é obrigatória.';
}

return [{
    json: {
        ...item,
        hash,
        protocolo,
        valor_custas: Number.isFinite(valorCustas) ? Number(valorCustas.toFixed(2)) : 0,
        url_servico_onr: urlServico,
        entrada_valida,
        codigo_erro,
        mensagem_erro
    }
}];`,
    };

    @node({
        id: 'd54e4f5a-6b7c-8d9e-0f1a-2b3c4d5e6f54',
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
                    id: 'e54f5a6b-7c8d-9e0f-1a2b-3c4d5e6f7a54',
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
        id: 'f54a6b7c-8d9e-0f1a-2b3c-4d5e6f7a8b54',
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

const valorFormatado = Number(item.valor_custas).toFixed(2);

const corpo = \`<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <tns:InformarCustasCertidao xmlns:tns="http://tempuri.org/WSOficio">
      <tns:oRequest>
        <tns:Hash>\${escapeXml(item.hash)}</tns:Hash>
        <tns:Protocolo>\${escapeXml(item.protocolo)}</tns:Protocolo>
        <tns:ValorCustas>\${escapeXml(valorFormatado)}</tns:ValorCustas>
      </tns:oRequest>
    </tns:InformarCustasCertidao>
  </soap:Body>
</soap:Envelope>\`;

return [{ json: { ...item, corpo_soap: corpo } }];`,
    };

    @node({
        id: 'a54b7c8d-9e0f-1a2b-3c4d-5e6f7a8b9c54',
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
        id: 'b54c8d9e-0f1a-2b3c-4d5e-6f7a8b9c0d54',
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
    if ([2, 10, 11, 12, 13, 14].includes(codigoErro)) return 400;
    if ([45, 46, 47].includes(codigoErro)) return 401;
    if (codigoErro === 51) return 404;
    if (codigoErro === 52 || codigoErro === 53) return 403;
    if (codigoErro === 0) return 502;
    if (codigoErro === 1) return 503;
    if (codigoErro === 200) return 404;
    return 422;
}

function dadosPadrao(sucesso = false) {
    return {
        protocolo: entrada.protocolo ?? '',
        valor_custas: entrada.valor_custas ?? 0,
        custas_informadas: sucesso
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
        id: 'c54d9e0f-1a2b-3c4d-5e6f-7a8b9c0d1e54',
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
            protocolo: item.protocolo ?? '',
            valor_custas: item.valor_custas ?? 0,
            custas_informadas: false
        }
    }
}];`,
    };

    @node({
        id: 'd54e0f1a-2b3c-4d5e-6f7a-8b9c0d1e2f54',
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
            protocolo: erro.protocolo ?? '',
            valor_custas: erro.valor_custas ?? 0,
            custas_informadas: false
        }
    }
}];`,
    };

    @node({
        id: 'e54f1a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b54',
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
