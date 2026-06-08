import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : [AUTONR-68] (webservice ONR) SetContratoExigenciaAC - E-Protocolo
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
    id: '9bJqJFuIWICCJxxS',
    name: '[AUTONR-68] (webservice ONR) SetContratoExigenciaAC - E-Protocolo',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class Autonr68WebserviceOnrSetcontratoexigenciaacEProtocoloWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'e7f8a9b0-c1d2-4345-e678-9abcdef01238',
        webhookId: 'f8a9b0c1-e2f3-4c5d-6e7f-8a9b0c1d2e3f',
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [-1296, 128],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    Webhook = {
        httpMethod: 'POST',
        path: 'f8a9b0c1-e2f3-4c5d-6e7f-8a9b0c1d2e3f',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'f8a9b0c1-d2e3-4456-f789-0abcdef12349',
        name: 'normalizar-entrada',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [-960, 128],
    })
    NormalizarEntrada = {
        mode: 'raw',
        jsonOutput: `={{
  hash: $json.body.hash ?? '',
  id_contrato: $json.body.id_contrato ?? 0,
  exigencia_final: $json.body.exigencia_final ?? false,
  resposta: $json.body.resposta ?? '',
  anexos: $json.body.anexos ?? [],
  url_servico_onr: $json.body.url_servico_onr ?? 'https://hml3-wsoficio.onr.org.br/eprotocolo.asmx'
}}
 `,
        options: {},
    };

    @node({
        id: 'a9b0c1d2-e3f4-4567-a890-1abcdef2345a',
        name: 'validar-entrada',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [-640, 128],
    })
    ValidarEntrada = {
        jsCode: `const item = $input.first().json;

const hash = String(item.hash ?? '').trim().toUpperCase();
const idContrato = parseInt(item.id_contrato, 10);
const resposta = String(item.resposta ?? '').trim();
const urlServico = String(item.url_servico_onr ?? '').trim();
const anexosEntrada = Array.isArray(item.anexos) ? item.anexos : [];

let exigenciaFinal = item.exigencia_final;
if (typeof exigenciaFinal === 'string') {
    exigenciaFinal = exigenciaFinal.toLowerCase() === 'true';
} else {
    exigenciaFinal = Boolean(exigenciaFinal);
}

let entrada_valida = true;
let codigo_erro = 0;
let mensagem_erro = '';

function normalizarAnexo(row, index) {
    if (!row || typeof row !== 'object') {
        return { erro: \`anexos[\${index}] deve ser um objeto com nome e url_arquivo.\`, codigo: 501 };
    }

    const nome = String(row.nome ?? row.Nome ?? row.descricao ?? row.Descricao ?? '').trim();
    const urlArquivo = String(row.url_arquivo ?? row.urlArquivo ?? row.URLArquivo ?? '').trim();

    if (!nome) {
        return { erro: \`anexos[\${index}].nome é obrigatório.\`, codigo: 501 };
    }
    if (!urlArquivo) {
        return { erro: \`anexos[\${index}].url_arquivo é obrigatório.\`, codigo: 501 };
    }
    if (!/^https?:\\/\\//i.test(urlArquivo)) {
        return { erro: \`anexos[\${index}].url_arquivo deve ser uma URL pública http(s).\`, codigo: 102 };
    }

    return { nome, url_arquivo: urlArquivo };
}

const anexos = [];
let erroAnexo = null;

for (let i = 0; i < anexosEntrada.length; i++) {
    const anexo = normalizarAnexo(anexosEntrada[i], i);
    if (anexo.erro) {
        erroAnexo = anexo;
        break;
    }
    anexos.push(anexo);
}

if (!hash) {
    entrada_valida = false;
    codigo_erro = 11;
    mensagem_erro = 'O hash de validação não foi informado.';
} else if (!/^[0-9A-F]{40}$/.test(hash)) {
    entrada_valida = false;
    codigo_erro = 11;
    mensagem_erro = 'Hash inválido: informe 40 caracteres hexadecimais maiúsculos.';
} else if (!Number.isFinite(idContrato) || idContrato < 1) {
    entrada_valida = false;
    codigo_erro = 12;
    mensagem_erro = 'O código informado para o contrato não é válido.';
} else if (!resposta) {
    entrada_valida = false;
    codigo_erro = 13;
    mensagem_erro = 'A Resposta não foi informada.';
} else if (!anexosEntrada.length) {
    entrada_valida = false;
    codigo_erro = 14;
    mensagem_erro = 'Não foi informado nenhum anexo para vincular à exigência.';
} else if (erroAnexo) {
    entrada_valida = false;
    codigo_erro = erroAnexo.codigo ?? 501;
    mensagem_erro = erroAnexo.erro;
} else if (!urlServico) {
    entrada_valida = false;
    codigo_erro = 10;
    mensagem_erro = 'url_servico_onr é obrigatória.';
}

return [{
    json: {
        ...item,
        hash,
        id_contrato: idContrato,
        exigencia_final: exigenciaFinal,
        resposta,
        anexos,
        url_servico_onr: urlServico,
        entrada_valida,
        codigo_erro,
        mensagem_erro
    }
}];`,
    };

    @node({
        id: 'b0c1d2e3-f4a5-4678-b901-2abcdef3456b',
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
                    id: 'c1d2e3f4-a5b6-4789-c012-3abcdef4567c',
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
        id: 'd2e3f4a5-b6c7-4890-d123-4abcdef5678d',
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

const anexosXml = item.anexos.map((anexo) => \`        <tns:SetContratoExigenciaAC_Anexo_WSReq>
          <tns:Nome>\${escapeXml(anexo.nome)}</tns:Nome>
          <tns:URLArquivo>\${escapeXml(anexo.url_arquivo)}</tns:URLArquivo>
        </tns:SetContratoExigenciaAC_Anexo_WSReq>\`).join('\\n');

const corpo = \`<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <tns:SetContratoExigenciaAC xmlns:tns="http://tempuri.org/WSOficio">
      <tns:oRequest>
        <tns:Hash>\${escapeXml(item.hash)}</tns:Hash>
        <tns:IDContrato>\${item.id_contrato}</tns:IDContrato>
        <tns:ExigenciaFinal>\${item.exigencia_final ? 'true' : 'false'}</tns:ExigenciaFinal>
        <tns:Resposta>\${escapeXml(item.resposta)}</tns:Resposta>
        <tns:Anexos>
\${anexosXml}
        </tns:Anexos>
      </tns:oRequest>
    </tns:SetContratoExigenciaAC>
  </soap:Body>
</soap:Envelope>\`;

return [{ json: { ...item, corpo_soap: corpo } }];`,
    };

    @node({
        id: 'e3f4a5b6-c7d8-4901-e234-5abcdef6789e',
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
        id: 'f4a5b6c7-d8e9-4901-f345-6abcdef7890f',
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
    if ([2, 10, 11, 12, 13, 14, 501].includes(codigoErro)) return 400;
    if ([45, 46, 47].includes(codigoErro)) return 401;
    if (codigoErro === 51) return 404;
    if (codigoErro === 52) return 403;
    if ([53, 502].includes(codigoErro)) return 409;
    if (codigoErro === 0) return 502;
    if (codigoErro === 1) return 503;
    return 422;
}

function dadosPadrao(sucesso = false) {
    return {
        id_contrato: entrada.id_contrato ?? 0,
        exigencia_final: entrada.exigencia_final ?? false,
        resposta: entrada.resposta ?? '',
        quantidade_anexos: entrada.anexos?.length ?? 0,
        exigencia_registrada: sucesso
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
        id: 'a5b6c7d8-e9f0-4901-a456-7abcdef89020',
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
            id_contrato: item.id_contrato ?? 0,
            exigencia_final: item.exigencia_final ?? false,
            resposta: item.resposta ?? '',
            quantidade_anexos: item.anexos?.length ?? 0,
            exigencia_registrada: false
        }
    }
}];`,
    };

    @node({
        id: 'b6c7d8e9-f0a1-4901-b567-8abcdef90121',
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
            id_contrato: erro.id_contrato ?? 0,
            exigencia_final: erro.exigencia_final ?? false,
            resposta: erro.resposta ?? '',
            quantidade_anexos: erro.anexos?.length ?? 0,
            exigencia_registrada: false
        }
    }
}];`,
    };

    @node({
        id: 'c7d8e9f0-a1b2-4901-c678-9abcdef01222',
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
