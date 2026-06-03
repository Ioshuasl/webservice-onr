import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : [AUTONR-50] (webservice ONR) EnviarAnexosCertidao_DocID_V2 - Certidões
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
    id: '8YXnN6lBQZqP962N',
    name: '[AUTONR-50] (webservice ONR) EnviarAnexosCertidao_DocID_V2 - Certidões',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class Autonr50WebserviceOnrEnviaranexoscertidaoDocidV2CertidoesWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'f1a0b1c2-d3e4-4f5a-8b9c-0d1e2f3a4b50',
        webhookId: 'b2c3d4e5-f6a7-4890-b123-4567890abcde',
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 0],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    Webhook = {
        httpMethod: 'POST',
        path: 'b2c3d4e5-f6a7-4890-b123-4567890abcde',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'a2b3c4d5-e6f7-4a8b-9c0d-1e2f3a4b5c6d',
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

let anexosRaw = body.anexos;
if (anexosRaw == null) anexosRaw = [];
if (!Array.isArray(anexosRaw)) anexosRaw = [anexosRaw];

const anexos = anexosRaw.map((item, indice) => {
    const row = item && typeof item === 'object' ? item : {};
    const document_id = String(
        row.document_id ?? row.documento_id ?? row.doc_id ?? row.DocID ?? row.DocumentID ?? ''
    ).trim();

    const certRaw = row.certidao_automatizada ?? row.certidaoAutomatizada;
    let certidao_automatizada = false;
    if (certRaw !== undefined && certRaw !== null && certRaw !== '') {
        if (typeof certRaw === 'boolean') {
            certidao_automatizada = certRaw;
        } else {
            certidao_automatizada = ['true', '1', 'sim', 's', 'yes'].includes(
                String(certRaw).trim().toLowerCase()
            );
        }
    }

    return { document_id, certidao_automatizada, indice };
});

return [{
    json: {
        hash,
        protocolo,
        url_servico_onr,
        anexos,
        quantidade_anexos: anexos.length
    }
}];`,
    };

    @node({
        id: 'b3c4d5e6-f7a8-4b9c-0d1e-2f3a4b5c6d7e',
        name: 'validar-entrada',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [656, 0],
    })
    ValidarEntrada = {
        jsCode: `const item = $input.first().json;

const hash = item.hash ?? '';
const protocolo = item.protocolo ?? '';
const urlServico = item.url_servico_onr ?? '';
const anexos = Array.isArray(item.anexos) ? item.anexos : [];

let entrada_valida = true;
let codigo_erro = 0;
let mensagem_erro = '';
let operacao_soap = '';

const falhar = (codigo, mensagem) => {
    entrada_valida = false;
    codigo_erro = codigo;
    mensagem_erro = mensagem;
};

if (!hash) {
    falhar(11, 'O hash de validação não foi informado.');
} else if (!/^[0-9A-F]{40}$/.test(hash)) {
    falhar(11, 'Hash inválido: informe 40 caracteres hexadecimais maiúsculos.');
} else if (!protocolo) {
    falhar(10, 'protocolo é obrigatório.');
} else if (!urlServico) {
    falhar(10, 'url_servico_onr é obrigatória.');
} else if (anexos.length < 1) {
    falhar(10, 'anexos deve conter ao menos um item.');
} else {
    for (let i = 0; i < anexos.length; i += 1) {
        const anexo = anexos[i];
        if (!anexo.document_id) {
            falhar(13, \`anexos[\${i}].document_id é obrigatório (DocumentID do Assinador Web).\`);
            break;
        }
    }
}

if (entrada_valida) {
    operacao_soap =
        anexos.length === 1
            ? 'EnviarAnexoCertidao_DocID_V2'
            : 'EnviarAnexosListCertidao_DocID_V2';
}

return [{
    json: {
        ...item,
        hash,
        protocolo,
        url_servico_onr: urlServico,
        anexos,
        quantidade_anexos: anexos.length,
        operacao_soap,
        entrada_valida,
        codigo_erro,
        mensagem_erro
    }
}];`,
    };

    @node({
        id: 'c4d5e6f7-a8b9-4c0d-1e2f-3a4b5c6d7e8f',
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
                    id: 'd5e6f7a8-b9c0-4d1e-2f3a-4b5c6d7e8f9a',
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
        id: 'e6f7a8b9-c0d1-4e2f-3a4b-5c6d7e8f9a0b',
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

function boolXml(valor) {
    return valor ? 'true' : 'false';
}

const operacao = item.operacao_soap;
let corpo = '';

if (operacao === 'EnviarAnexoCertidao_DocID_V2') {
    const anexo = item.anexos[0];
    corpo = \`<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <tns:EnviarAnexoCertidao_DocID_V2 xmlns:tns="http://tempuri.org/WSOficio">
      <tns:oRequest>
        <tns:Hash>\${escapeXml(item.hash)}</tns:Hash>
        <tns:Protocolo>\${escapeXml(item.protocolo)}</tns:Protocolo>
        <tns:DocumentID>\${escapeXml(anexo.document_id)}</tns:DocumentID>
        <tns:CertidaoAutomatizada>\${boolXml(anexo.certidao_automatizada)}</tns:CertidaoAutomatizada>
      </tns:oRequest>
    </tns:EnviarAnexoCertidao_DocID_V2>
  </soap:Body>
</soap:Envelope>\`;
} else if (operacao === 'EnviarAnexosListCertidao_DocID_V2') {
    const itensXml = item.anexos
        .map(
            (anexo) => \`        <tns:AnexoListCertidao_DocID_WSReq_V2>
          <tns:DocID>\${escapeXml(anexo.document_id)}</tns:DocID>
          <tns:CertidaoAutomatizada>\${boolXml(anexo.certidao_automatizada)}</tns:CertidaoAutomatizada>
        </tns:AnexoListCertidao_DocID_WSReq_V2>\`
        )
        .join('\\n');

    corpo = \`<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <tns:EnviarAnexosListCertidao_DocID_V2 xmlns:tns="http://tempuri.org/WSOficio">
      <tns:oRequest>
        <tns:Hash>\${escapeXml(item.hash)}</tns:Hash>
        <tns:Protocolo>\${escapeXml(item.protocolo)}</tns:Protocolo>
        <tns:AnexoList>
\${itensXml}
        </tns:AnexoList>
      </tns:oRequest>
    </tns:EnviarAnexosListCertidao_DocID_V2>
  </soap:Body>
</soap:Envelope>\`;
} else {
    throw new Error(\`operacao_soap inválida: \${operacao}\`);
}

return [{
    json: {
        ...item,
        corpo_soap: corpo,
        soap_action: \`http://tempuri.org/WSOficio/\${operacao}\`
    }
}];`,
    };

    @node({
        id: 'f7a8b9c0-d1e2-4f3a-4b5c-6d7e8f9a0b1c',
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
        sendHeaders: true,
        headerParameters: {
            parameters: [
                {
                    name: 'SOAPAction',
                    value: '={{ $json.soap_action }}',
                },
            ],
        },
        options: {},
    };

    @node({
        id: 'a8b9c0d1-e2f3-4a4b-5c6d-7e8f9a0b1c2d',
        name: 'converter-resposta-onr',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1936, -128],
    })
    ConverterRespostaOnr = {
        jsCode: `const entrada = $input.first().json;
const ctx = $('montar-envelope-soap').first().json;
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
    return 422;
}

function dadosResposta(sucesso) {
    return {
        protocolo: ctx.protocolo ?? '',
        operacao_soap: ctx.operacao_soap ?? '',
        quantidade_anexos: ctx.quantidade_anexos ?? 0,
        anexos: (ctx.anexos ?? []).map((a) => ({
            document_id: a.document_id,
            certidao_automatizada: a.certidao_automatizada
        })),
        enviado: sucesso
    };
}

function respostaErro(statusHttp, codigoErro, mensagemErro) {
    return {
        status_http: statusHttp,
        sucesso: false,
        codigo_erro: codigoErro,
        mensagem_erro: mensagemErro,
        dados: dadosResposta(false)
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
        dados: dadosResposta(sucesso)
    }
};`,
    };

    @node({
        id: 'b9c0d1e2-f3a4-4b5c-6d7e-8f9a0b1c2d3e',
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
            operacao_soap: item.operacao_soap ?? '',
            quantidade_anexos: item.quantidade_anexos ?? 0,
            anexos: item.anexos ?? [],
            enviado: false
        }
    }
}];`,
    };

    @node({
        id: 'c0d1e2f3-a4b5-4c6d-7e8f-9a0b1c2d3e4f',
        name: 'resposta-erro-conexao-onr',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1936, 128],
    })
    RespostaErroConexaoOnr = {
        jsCode: `const erro = $input.first().json;
const ctx = $('montar-envelope-soap').first()?.json ?? $('validar-entrada').first()?.json ?? {};
const mensagem = erro.error?.message || erro.message || 'Falha ao conectar com a ONR.';

return [{
    json: {
        status_http: 502,
        sucesso: false,
        codigo_erro: 0,
        mensagem_erro: mensagem,
        dados: {
            protocolo: ctx.protocolo ?? '',
            operacao_soap: ctx.operacao_soap ?? '',
            quantidade_anexos: ctx.quantidade_anexos ?? 0,
            anexos: ctx.anexos ?? [],
            enviado: false
        }
    }
}];`,
    };

    @node({
        id: 'd1e2f3a4-b5c6-4d7e-8f9a-0b1c2d3e4f5a',
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
