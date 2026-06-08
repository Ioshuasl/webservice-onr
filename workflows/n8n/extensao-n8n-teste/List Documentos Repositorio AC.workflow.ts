import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : [AUTONR-70] (webservice ONR) ListDocumentosRepositorioAC - E-Protocolo
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
    id: 'U45GIXKKi6jKadU9',
    name: '[AUTONR-70] (webservice ONR) ListDocumentosRepositorioAC - E-Protocolo',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class Autonr70WebserviceOnrListdocumentosrepositorioacEProtocoloWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'b2c3d4e5-f6a7-4890-b123-4cdef5678124',
        webhookId: 'fa0b1c2d-e3f4-4a5b-6c7d-9e0f1a2b3c5e',
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [-1296, 128],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    Webhook = {
        httpMethod: 'POST',
        path: 'fa0b1c2d-e3f4-4a5b-6c7d-9e0f1a2b3c5e',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'c3d4e5f6-a7b8-4901-c234-5def6789235a',
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
  id_departamento: $json.body.id_departamento ?? 0,
  cpf_vinculado: $json.body.cpf_vinculado ?? '',
  data_vencimento_inicial: $json.body.data_vencimento_inicial ?? '',
  data_vencimento_final: $json.body.data_vencimento_final ?? '',
  url_servico_onr: $json.body.url_servico_onr ?? 'https://hml3-wsoficio.onr.org.br/eprotocolo.asmx'
}}
 `,
        options: {},
    };

    @node({
        id: 'd4e5f6a7-b8c9-4901-d345-6ef78903456b',
        name: 'validar-entrada',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [-640, 128],
    })
    ValidarEntrada = {
        jsCode: `const item = $input.first().json;

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
const idContrato = parseInt(item.id_contrato, 10);
const idDepartamento = parseInt(item.id_departamento, 10);
const cpfVinculado = String(item.cpf_vinculado ?? '').trim();
const dataInicial = String(item.data_vencimento_inicial ?? '').trim();
const dataFinal = String(item.data_vencimento_final ?? '').trim();
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
} else if (!Number.isFinite(idContrato) || idContrato < 1) {
    entrada_valida = false;
    codigo_erro = 12;
    mensagem_erro = 'O código informado para o contrato não é válido.';
} else if (!Number.isFinite(idDepartamento) || idDepartamento < 0) {
    entrada_valida = false;
    codigo_erro = 10;
    mensagem_erro = 'id_departamento inválido: informe 0 ou maior.';
} else if (dataInicial && !dataValida(dataInicial)) {
    entrada_valida = false;
    codigo_erro = 13;
    mensagem_erro = 'A data de vencimento inicial é inválida. Use aaaa-mm-dd.';
} else if (dataFinal && !dataValida(dataFinal)) {
    entrada_valida = false;
    codigo_erro = 14;
    mensagem_erro = 'A data de vencimento final é inválida. Use aaaa-mm-dd.';
} else if (dataInicial && dataFinal) {
    const diffDias = (parseData(dataFinal) - parseData(dataInicial)) / (1000 * 60 * 60 * 24);
    if (diffDias < 0) {
        entrada_valida = false;
        codigo_erro = 14;
        mensagem_erro = 'data_vencimento_final deve ser maior ou igual à inicial.';
    } else if (diffDias > 7) {
        entrada_valida = false;
        codigo_erro = 15;
        mensagem_erro = 'O período da data de vencimento não pode ser maior que 7 dias.';
    }
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
        id_departamento: idDepartamento,
        cpf_vinculado: cpfVinculado,
        data_vencimento_inicial: dataInicial,
        data_vencimento_final: dataFinal,
        url_servico_onr: urlServico,
        entrada_valida,
        codigo_erro,
        mensagem_erro
    }
}];`,
    };

    @node({
        id: 'e5f6a7b8-c9d0-4901-e456-7f89014567c',
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
                    id: 'f6a7b8c9-d0e1-4901-f567-8901234567d',
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
        id: 'a7b8c9d0-e1f2-4901-a678-9012345678e',
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

const opcionais = [];
if (item.cpf_vinculado) {
    opcionais.push(\`        <tns:CPFVinculado>\${escapeXml(item.cpf_vinculado)}</tns:CPFVinculado>\`);
}
if (item.data_vencimento_inicial) {
    opcionais.push(\`        <tns:DataVencimentoInicial>\${escapeXml(item.data_vencimento_inicial)}</tns:DataVencimentoInicial>\`);
}
if (item.data_vencimento_final) {
    opcionais.push(\`        <tns:DataVencimentoFinal>\${escapeXml(item.data_vencimento_final)}</tns:DataVencimentoFinal>\`);
}

const corpo = \`<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <tns:ListRepositorioDocumentosAC xmlns:tns="http://tempuri.org/WSOficio">
      <tns:oRequest>
        <tns:Hash>\${escapeXml(item.hash)}</tns:Hash>
        <tns:IDContrato>\${item.id_contrato}</tns:IDContrato>
        <tns:IDDepartamento>\${item.id_departamento}</tns:IDDepartamento>
\${opcionais.join('\\n')}
      </tns:oRequest>
    </tns:ListRepositorioDocumentosAC>
  </soap:Body>
</soap:Envelope>\`;

return [{ json: { ...item, corpo_soap: corpo } }];`,
    };

    @node({
        id: 'b8c9d0e1-f2a3-4901-b789-0123456789f',
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
        id: 'c9d0e1f2-a3b4-4901-c890-1234567890a',
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
    if ([2, 10, 11, 12, 13, 14, 15].includes(codigoErro)) return 400;
    if ([45, 46, 47].includes(codigoErro)) return 401;
    if (codigoErro === 51) return 404;
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

function extrairDocumentos(origem) {
    const documentos = [];
    const regex = /<(?:\\w+:)?ListRepositorioDocumentosAC_Documentos_WSResp[^>]*>([\\s\\S]*?)<\\/(?:\\w+:)?ListRepositorioDocumentosAC_Documentos_WSResp>/g;
    let match;

    while ((match = regex.exec(origem)) !== null) {
        const bloco = match[1];
        documentos.push({
            id_arquivo: parseInt(extrairTag('IDArquivo', bloco), 10) || 0,
            convenio: extrairTag('Convenio', bloco),
            cpf_associado: extrairTag('CPFAssociado', bloco),
            data_cadastro: extrairTag('DataCadastro', bloco),
            data_vencimento: extrairTag('DataVencimento', bloco)
        });
    }

    return documentos;
}

function dadosVazio() {
    return {
        documentos: [],
        quantidade_documentos: 0
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
const documentos = sucesso ? extrairDocumentos(xml) : [];

return {
    json: {
        status_http: mapearStatusHttp(sucesso, codigo_erro, 'onr'),
        sucesso,
        codigo_erro,
        mensagem_erro,
        dados: sucesso ? {
            documentos,
            quantidade_documentos: documentos.length
        } : dadosVazio()
    }
};`,
    };

    @node({
        id: 'd0e1f2a3-b4c5-4901-d901-2345678901b',
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
            documentos: [],
            quantidade_documentos: 0
        }
    }
}];`,
    };

    @node({
        id: 'e1f2a3b4-c5d6-4901-e012-3456789012c',
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
            documentos: [],
            quantidade_documentos: 0
        }
    }
}];`,
    };

    @node({
        id: 'f2a3b4c5-d6e7-4901-f123-4567890123d',
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
