import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : [AUTONR-7] (webservice ONR) GetStatusAT - Acompanhamento de Títulos
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
    id: 'UEa8yh4vTd5MH371',
    name: '[AUTONR-7] (webservice ONR) GetStatusAT - Acompanhamento de Títulos',
    active: false,
    isArchived: false,
    settings: {
        executionOrder: 'v1',
        binaryMode: 'separate',
        availableInMCP: false,
        callerPolicy: 'workflowsFromSameOwner',
    },
})
export class Autonr7WebserviceOnrGetstatusatAcompanhamentoDeTitulosWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: '897a5292-9008-4434-9d95-32f739ef4e8b',
        webhookId: 'd7e8f9a0-b1c2-4d3e-9f0a-1b2c3d4e5f6a',
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [-1296, 128],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    Webhook = {
        httpMethod: 'POST',
        path: 'd7e8f9a0-b1c2-4d3e-9f0a-1b2c3d4e5f6a',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'c44d0e75-7c25-4708-884d-4318df131de1',
        name: 'normalizar-entrada',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [-960, 128],
    })
    NormalizarEntrada = {
        mode: 'raw',
        jsonOutput: `={
  "hash": "{{ $json.body.hash }}",
  "id_status": {{ $json.body.id_status }},
  "url_servico_onr": "{{ $json.body.url_servico_onr ?? 'https://hml3-wsoficio.onr.org.br/acompanhamentotitulos.asmx' }}"
}
 `,
        options: {},
    };

    @node({
        id: '93a99d5f-4ef5-40bf-a082-7b670f33e3a2',
        name: 'validar-entrada',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [-640, 128],
    })
    ValidarEntrada = {
        jsCode: `const item = $input.first().json;

const hash = String(item.hash ?? '').trim().toUpperCase();
const idStatus = Number(item.id_status);
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
} else if (!Number.isFinite(idStatus) || idStatus < 1) {
    entrada_valida = false;
    codigo_erro = 12;
    mensagem_erro = 'id_status é obrigatório e deve ser um inteiro positivo.';
} else if (!urlServico) {
    entrada_valida = false;
    codigo_erro = 10;
    mensagem_erro = 'url_servico_onr é obrigatória.';
}

return [{
    json: {
        ...item,
        hash,
        id_status: idStatus,
        url_servico_onr: urlServico,
        entrada_valida,
        codigo_erro,
        mensagem_erro
    }
}];`,
    };

    @node({
        id: '1d0b84d5-e235-4f11-8ce6-51ab81a65aff',
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
                    id: 'k5e6f7a8-b9c0-4123-e456-555544443333',
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
        id: 'eb8d9436-273a-4ab7-ab6d-b230a1a231da',
        name: 'montar-envelope-soap',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [0, 0],
    })
    MontarEnvelopeSoap = {
        jsCode: `const item = $input.first().json;

const corpo = \`<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <tns:GetStatusAT xmlns:tns="http://tempuri.org/WSOficio">
      <tns:oRequest>
        <tns:Hash>\${item.hash}</tns:Hash>
        <tns:IDStatus>\${item.id_status}</tns:IDStatus>
      </tns:oRequest>
    </tns:GetStatusAT>
  </soap:Body>
</soap:Envelope>\`;

return [{ json: { ...item, corpo_soap: corpo } }];`,
    };

    @node({
        id: '021d167f-f578-41f9-a5b7-57e2b40dde0b',
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
        id: '6c45d29f-4532-4a03-abba-048d3abd4c00',
        name: 'converter-resposta-onr',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [640, 0],
    })
    ConverterRespostaOnr = {
        jsCode: `const entrada = $input.first().json;
const xml = entrada.data;

function mapearStatusHttp(sucesso, codigoErro) {
    if (sucesso) return 200;
    if ([10, 11, 12].includes(codigoErro)) return 400;
    if ([45, 46, 47].includes(codigoErro)) return 401;
    if (codigoErro === 50) return 403;
    if (codigoErro === 0) return 502;
    if (codigoErro === 1) return 503;
    return 422;
}

function dadosVazio() {
    return {
        id_tipo_status: 0,
        data_status: '',
        descricao_status: '',
        protocolo: '',
        valor_deposito: 0,
        valor_emolumentos: 0,
        apresentante_nome: '',
        apresentante_cpf_cnpj: '',
        apresentante_email: '',
        modo_notificacao_status: '',
        apresentante_ddd_telefone: '',
        apresentante_numero_telefone: '',
        data_protocolo: '',
        data_previsao_entrega: '',
        natureza_titulo: '',
        interessado_nome: '',
        interessado_cpf_cnpj: '',
        codigo_verificador: '',
        tipo_solicitacao: 0
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

const extrairTag = (tag, origem) => {
    const regex = new RegExp(\`<(?:\\\\w+:)?\${tag}>(.*?)</(?:\\\\w+:)?\${tag}>\`, 's');
    const match = origem.match(regex);
    return match ? match[1].trim() : '';
};

const parseDecimal = (valor) => {
    const n = parseFloat(String(valor).replace(',', '.'));
    return Number.isFinite(n) ? n : 0;
};

const sucesso = extrairTag('RETORNO', xml) === 'true';
const codigo_erro = parseInt(extrairTag('CODIGOERRO', xml) || '0', 10);
const mensagem_erro = extrairTag('ERRODESCRICAO', xml);

return {
    json: {
        status_http: mapearStatusHttp(sucesso, codigo_erro),
        sucesso,
        codigo_erro,
        mensagem_erro,
        dados: sucesso ? {
            id_tipo_status: parseInt(extrairTag('IDTipoStatus', xml), 10) || 0,
            data_status: extrairTag('DataStatus', xml),
            descricao_status: extrairTag('DescricaoStatus', xml),
            protocolo: extrairTag('Protocolo', xml),
            valor_deposito: parseDecimal(extrairTag('ValorDeposito', xml)),
            valor_emolumentos: parseDecimal(extrairTag('ValorEmolumentos', xml)),
            apresentante_nome: extrairTag('ApresentanteNome', xml),
            apresentante_cpf_cnpj: extrairTag('ApresentanteCPFCNPJ', xml),
            apresentante_email: extrairTag('ApresentanteEmail', xml),
            modo_notificacao_status: extrairTag('ModoNotificacaoStatus', xml),
            apresentante_ddd_telefone: extrairTag('ApresentanteDDDTelefone', xml),
            apresentante_numero_telefone: extrairTag('ApresentanteNumeroTelefone', xml),
            data_protocolo: extrairTag('DataProtocolo', xml),
            data_previsao_entrega: extrairTag('DataPrevisaoEntrega', xml),
            natureza_titulo: extrairTag('NaturezaTitulo', xml),
            interessado_nome: extrairTag('InteressadoNome', xml),
            interessado_cpf_cnpj: extrairTag('InteressadoCPFCNPJ', xml),
            codigo_verificador: extrairTag('CodigoVerificador', xml),
            tipo_solicitacao: parseInt(extrairTag('TipoSolicitacao', xml), 10) || 0
        } : dadosVazio()
    }
};`,
    };

    @node({
        id: 'c33a76c8-2ddb-4854-b912-dda9569802c3',
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
            id_tipo_status: 0,
            data_status: '',
            descricao_status: '',
            protocolo: '',
            valor_deposito: 0,
            valor_emolumentos: 0,
            apresentante_nome: '',
            apresentante_cpf_cnpj: '',
            apresentante_email: '',
            modo_notificacao_status: '',
            apresentante_ddd_telefone: '',
            apresentante_numero_telefone: '',
            data_protocolo: '',
            data_previsao_entrega: '',
            natureza_titulo: '',
            interessado_nome: '',
            interessado_cpf_cnpj: '',
            codigo_verificador: '',
            tipo_solicitacao: 0
        }
    }
}];`,
    };

    @node({
        id: '2d847f40-6d39-49d9-8289-383ae74118a9',
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
            id_tipo_status: 0,
            data_status: '',
            descricao_status: '',
            protocolo: '',
            valor_deposito: 0,
            valor_emolumentos: 0,
            apresentante_nome: '',
            apresentante_cpf_cnpj: '',
            apresentante_email: '',
            modo_notificacao_status: '',
            apresentante_ddd_telefone: '',
            apresentante_numero_telefone: '',
            data_protocolo: '',
            data_previsao_entrega: '',
            natureza_titulo: '',
            interessado_nome: '',
            interessado_cpf_cnpj: '',
            codigo_verificador: '',
            tipo_solicitacao: 0
        }
    }
}];`,
    };

    @node({
        id: '93d4f1a8-e54a-4235-a883-3ee0479c9ea2',
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
