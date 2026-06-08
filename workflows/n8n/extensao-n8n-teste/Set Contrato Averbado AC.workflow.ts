import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : [AUTONR-67] (webservice ONR) SetContratoAverbadoAC - E-Protocolo
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
    id: 'O8xMiTpToF3J38Pg',
    name: '[AUTONR-67] (webservice ONR) SetContratoAverbadoAC - E-Protocolo',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class Autonr67WebserviceOnrSetcontratoaverbadoacEProtocoloWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'd6e7f8a9-b0c1-4234-d567-89abcdef0126',
        webhookId: 'f7a8b9c0-e1f2-4b3c-4d5e-6f7a8b9c0d1f',
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [-1296, 128],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    Webhook = {
        httpMethod: 'POST',
        path: 'f7a8b9c0-e1f2-4b3c-4d5e-6f7a8b9c0d1f',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'e7f8a9b0-c1d2-4345-e678-9abcdef01237',
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
  resposta: $json.body.resposta ?? '',
  certidoes_averbacao: $json.body.certidoes_averbacao ?? $json.body.certidao_averbacao ?? [],
  url_servico_onr: $json.body.url_servico_onr ?? 'https://hml3-wsoficio.onr.org.br/eprotocolo.asmx'
}}
 `,
        options: {},
    };

    @node({
        id: 'f8a9b0c1-d2e3-4456-f789-0abcdef12348',
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
const certidoesEntrada = Array.isArray(item.certidoes_averbacao) ? item.certidoes_averbacao : [];

let entrada_valida = true;
let codigo_erro = 0;
let mensagem_erro = '';

function normalizarCertidao(row, index) {
    if (!row || typeof row !== 'object') {
        return { erro: \`certidoes_averbacao[\${index}] deve ser um objeto com descricao e url_arquivo.\`, codigo: 501 };
    }

    const descricao = String(row.descricao ?? row.Descricao ?? '').trim();
    const urlArquivo = String(row.url_arquivo ?? row.urlArquivo ?? row.URLArquivo ?? '').trim();

    if (!descricao) {
        return { erro: \`certidoes_averbacao[\${index}].descricao é obrigatória.\`, codigo: 501 };
    }
    if (!urlArquivo) {
        return { erro: \`certidoes_averbacao[\${index}].url_arquivo é obrigatória.\`, codigo: 501 };
    }
    if (!/^https?:\\/\\//i.test(urlArquivo)) {
        return { erro: \`certidoes_averbacao[\${index}].url_arquivo deve ser uma URL pública http(s).\`, codigo: 102 };
    }

    return { descricao, url_arquivo: urlArquivo };
}

const certidoes_averbacao = [];
let erroCertidao = null;

for (let i = 0; i < certidoesEntrada.length; i++) {
    const certidao = normalizarCertidao(certidoesEntrada[i], i);
    if (certidao.erro) {
        erroCertidao = certidao;
        break;
    }
    certidoes_averbacao.push(certidao);
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
} else if (!certidoesEntrada.length) {
    entrada_valida = false;
    codigo_erro = 14;
    mensagem_erro = 'Não foi informada nenhuma certidão para anexar ao contrato.';
} else if (erroCertidao) {
    entrada_valida = false;
    codigo_erro = erroCertidao.codigo ?? 501;
    mensagem_erro = erroCertidao.erro;
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
        resposta,
        certidoes_averbacao,
        url_servico_onr: urlServico,
        entrada_valida,
        codigo_erro,
        mensagem_erro
    }
}];`,
    };

    @node({
        id: 'a9b0c1d2-e3f4-4567-a890-1abcdef23459',
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
                    id: 'b0c1d2e3-f4a5-4678-b901-2abcdef3456a',
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
        id: 'c1d2e3f4-a5b6-4789-c012-3abcdef4567b',
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

const certidoesXml = item.certidoes_averbacao.map((certidao) => \`        <tns:SetContratoAverbadoAC_Certidao_WSReq>
          <tns:Descricao>\${escapeXml(certidao.descricao)}</tns:Descricao>
          <tns:URLArquivo>\${escapeXml(certidao.url_arquivo)}</tns:URLArquivo>
        </tns:SetContratoAverbadoAC_Certidao_WSReq>\`).join('\\n');

const corpo = \`<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <tns:SetContratoAverbadoAC xmlns:tns="http://tempuri.org/WSOficio">
      <tns:oRequest>
        <tns:Hash>\${escapeXml(item.hash)}</tns:Hash>
        <tns:IDContrato>\${item.id_contrato}</tns:IDContrato>
        <tns:Resposta>\${escapeXml(item.resposta)}</tns:Resposta>
        <tns:CertidaoAverbacao>
\${certidoesXml}
        </tns:CertidaoAverbacao>
      </tns:oRequest>
    </tns:SetContratoAverbadoAC>
  </soap:Body>
</soap:Envelope>\`;

return [{ json: { ...item, corpo_soap: corpo } }];`,
    };

    @node({
        id: 'd2e3f4a5-b6c7-4890-d123-4abcdef5678c',
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
        id: 'e3f4a5b6-c7d8-4901-e234-5abcdef6789d',
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
        resposta: entrada.resposta ?? '',
        quantidade_certidoes: entrada.certidoes_averbacao?.length ?? 0,
        contrato_averbado: sucesso
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
        id: 'f4a5b6c7-d8e9-4901-f345-6abcdef7890e',
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
            resposta: item.resposta ?? '',
            quantidade_certidoes: item.certidoes_averbacao?.length ?? 0,
            contrato_averbado: false
        }
    }
}];`,
    };

    @node({
        id: 'a5b6c7d8-e9f0-4901-a456-7abcdef8901f',
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
            resposta: erro.resposta ?? '',
            quantidade_certidoes: erro.certidoes_averbacao?.length ?? 0,
            contrato_averbado: false
        }
    }
}];`,
    };

    @node({
        id: 'b6c7d8e9-f0a1-4901-b567-8abcdef90120',
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
