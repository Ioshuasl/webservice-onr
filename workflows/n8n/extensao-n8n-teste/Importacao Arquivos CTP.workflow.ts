import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : [AUTONR-84] (webservice ONR) ImportacaoArquivos - CTP
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
    id: 'KLSkdDWPkX2tFufx',
    name: '[AUTONR-84] (webservice ONR) ImportacaoArquivos - CTP',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class Autonr84WebserviceOnrImportacaoarquivosCtpWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'a8840001-0000-4000-8000-000000000001',
        webhookId: 'a8840001-8f60-4b2c-93d4-567890123def',
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [-1296, 128],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    Webhook = {
        httpMethod: 'POST',
        path: 'a8840001-8f60-4b2c-93d4-567890123def',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'a8840002-0000-4000-8000-000000000002',
        name: 'normalizar-entrada',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [-960, 128],
    })
    NormalizarEntrada = {
        jsCode: `const root = $input.first().json;
const body = root.body ?? root;

return [{
    json: {
        hash: body.hash ?? '',
        formato: body.formato,
        nome_original_arquivo: body.nome_original_arquivo ?? '',
        url_callback: body.url_callback ?? '',
        url_servico_onr: body.url_servico_onr ?? 'https://hml3-wsoficio.onr.org.br/ComunicacaoMunicipios.asmx',
    },
}];`,
    };

    @node({
        id: 'a8840003-0000-4000-8000-000000000003',
        name: 'validar-entrada',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [-640, 128],
    })
    ValidarEntrada = {
        jsCode: `const item = $input.first().json;

const EXTENSOES_POR_FORMATO = {
    1: ['json'],
    2: ['txt'],
    3: ['dec'],
    4: ['zip'],
};

const hash = String(item.hash ?? '').trim().toUpperCase();
const formato = Number(item.formato);
const nomeOriginalArquivo = String(item.nome_original_arquivo ?? '').trim();
const urlCallback = String(item.url_callback ?? '').trim();
const urlServico = String(item.url_servico_onr ?? '').trim();

let entrada_valida = true;
let codigo_erro = 0;
let mensagem_erro = '';

function extrairExtensao(nome) {
    const idx = nome.lastIndexOf('.');
    if (idx <= 0 || idx === nome.length - 1) return '';
    return nome.slice(idx + 1).toLowerCase();
}

if (!hash) {
    entrada_valida = false;
    codigo_erro = 11;
    mensagem_erro = 'O hash de validação não foi informado.';
} else if (!/^[0-9A-F]{40}$/.test(hash)) {
    entrada_valida = false;
    codigo_erro = 11;
    mensagem_erro = 'Hash inválido: informe 40 caracteres hexadecimais maiúsculos.';
} else if (!Number.isInteger(formato) || !EXTENSOES_POR_FORMATO[formato]) {
    entrada_valida = false;
    codigo_erro = 12;
    mensagem_erro = 'formato inválido: use 1 (json), 2 (txt), 3 (dec) ou 4 (zip).';
} else if (!nomeOriginalArquivo) {
    entrada_valida = false;
    codigo_erro = 13;
    mensagem_erro = 'nome_original_arquivo é obrigatório.';
} else {
    const extensao = extrairExtensao(nomeOriginalArquivo);
    if (!extensao) {
        entrada_valida = false;
        codigo_erro = 14;
        mensagem_erro = 'Arquivo sem extensão.';
    } else if (!EXTENSOES_POR_FORMATO[formato].includes(extensao)) {
        entrada_valida = false;
        codigo_erro = 15;
        mensagem_erro = 'Extensão inválida para o formato informado.';
    }
}

if (entrada_valida && urlCallback) {
    if (/^\{\{[^}]+\}\}$/.test(urlCallback)) {
        entrada_valida = false;
        codigo_erro = 10;
        mensagem_erro = 'url_callback inválida: variável não resolvida (' + urlCallback + '). Preencha ctp_url_callback na coleção Postman ou envie a URL completa no JSON.';
    } else {
        try {
            const parsed = new URL(urlCallback);
            if (!['http:', 'https:'].includes(parsed.protocol)) {
                entrada_valida = false;
                codigo_erro = 10;
                mensagem_erro = 'url_callback inválida: use HTTP ou HTTPS.';
            }
        } catch {
            entrada_valida = false;
            codigo_erro = 10;
            mensagem_erro = 'url_callback inválida: informe uma URL completa (ex.: https://webhook.site/seu-uuid).';
        }
    }
}

if (entrada_valida && !urlServico) {
    entrada_valida = false;
    codigo_erro = 10;
    mensagem_erro = 'url_servico_onr é obrigatória.';
}

return [{
    json: {
        ...item,
        hash,
        formato,
        nome_original_arquivo: nomeOriginalArquivo,
        url_callback: urlCallback,
        url_servico_onr: urlServico,
        entrada_valida,
        codigo_erro,
        mensagem_erro,
    },
}];`,
    };

    @node({
        id: 'a8840004-0000-4000-8000-000000000004',
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
        id: 'a8840005-0000-4000-8000-000000000005',
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
const urlCallbackXml = item.url_callback
    ? \`        <tns:UrlCallback>\${escapeXml(item.url_callback)}</tns:UrlCallback>\`
    : '';

const corpo = \`<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <tns:ImportacaoArquivos xmlns:tns="http://tempuri.org/WSOficio">
      <tns:oRequest>
        <tns:Hash>\${escapeXml(item.hash)}</tns:Hash>
        <tns:Formato>\${item.formato}</tns:Formato>
        <tns:NomeOriginalArquivo>\${escapeXml(item.nome_original_arquivo)}</tns:NomeOriginalArquivo>
\${urlCallbackXml}
      </tns:oRequest>
    </tns:ImportacaoArquivos>
  </soap:Body>
</soap:Envelope>\`;

return [{ json: { ...item, corpo_soap: corpo } }];`,
    };

    @node({
        id: 'a8840006-0000-4000-8000-000000000006',
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
        id: 'a8840007-0000-4000-8000-000000000007',
        name: 'converter-resposta-onr',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [640, 0],
    })
    ConverterRespostaOnr = {
        jsCode: `function mapearStatusHttp(sucesso, codigoErro, origem = 'onr') {
    if (sucesso) return 200;
    if (origem === 'validacao') return 400;
    if ([10, 11, 12, 13, 14, 15].includes(codigoErro)) return 400;
    if ([45, 46, 47].includes(codigoErro)) return 401;
    if (codigoErro === 0) return 502;
    return 422;
}

function extrairTag(tag, origem) {
    const regex = new RegExp(\`<(?:\\\\w+:)?\${tag}>(.*?)</(?:\\\\w+:)?\${tag}>\`, 'is');
    const match = origem.match(regex);
    return match ? match[1].trim() : '';
}

function dadosVazio() {
    return { id_processo: '', url_para_upload: '' };
}

function respostaErro(statusHttp, codigoErro, mensagemErro) {
    return {
        status_http: statusHttp,
        sucesso: false,
        codigo_erro: codigoErro,
        mensagem_erro: mensagemErro,
        dados: dadosVazio(),
    };
}

const xml = $input.first().json.data;

if (!xml || typeof xml !== 'string') {
    return { json: respostaErro(502, 0, 'Resposta inválida da ONR: XML não encontrado.') };
}

const sucesso = extrairTag('RETORNO', xml).toLowerCase() === 'true';
const codigo_erro = parseInt(extrairTag('CODIGOERRO', xml) || '0', 10);
const mensagem_erro = extrairTag('ERRODESCRICAO', xml);
const id_processo = extrairTag('IdProcesso', xml);
const url_para_upload = extrairTag('UrlParaUpload', xml);

return {
    json: {
        status_http: mapearStatusHttp(sucesso, codigo_erro, 'onr'),
        sucesso,
        codigo_erro,
        mensagem_erro,
        dados: sucesso
            ? {
                operacao_soap: 'ImportacaoArquivos',
                id_processo,
                url_para_upload,
            }
            : dadosVazio(),
    },
};`,
    };

    @node({
        id: 'a8840008-0000-4000-8000-000000000008',
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
        dados: { id_processo: '', url_para_upload: '' },
    },
}];`,
    };

    @node({
        id: 'a8840009-0000-4000-8000-000000000009',
        name: 'resposta-erro-conexao-onr',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [640, 256],
    })
    RespostaErroConexaoOnr = {
        jsCode: `const erro = $input.first().json;
return [{
    json: {
        status_http: 502,
        sucesso: false,
        codigo_erro: 0,
        mensagem_erro: erro.error?.message || erro.message || 'Falha ao conectar com a ONR.',
        dados: { id_processo: '', url_para_upload: '' },
    },
}];`,
    };

    @node({
        id: 'a884000a-0000-4000-8000-00000000000a',
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
