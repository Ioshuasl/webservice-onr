import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : Get Titulo AT
// Nodes   : 10  |  Connections: 11
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// Webhook                            webhook
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
    id: 'kE8NSdNR0Ek5ds4v',
    name: 'Get Titulo AT',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class GetTituloAtWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'e1f2a3b4-c5d6-4789-e012-111122223333',
        webhookId: 'c8d9e0f1-a2b3-4c5d-8e9f-0a1b2c3d4e5f',
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 0],
    })
    Webhook = {
        httpMethod: 'POST',
        path: 'c8d9e0f1-a2b3-4c5d-8e9f-0a1b2c3d4e5f',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'f2a3b4c5-d6e7-4890-f123-222233334444',
        name: 'normalizar-entrada',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [336, 0],
    })
    NormalizarEntrada = {
        mode: 'raw',
        jsonOutput: `={
  "hash": "{{ $json.body.hash }}",
  "id_titulo": {{ $json.body.id_titulo }},
  "url_servico_onr": "{{ $json.body.url_servico_onr ?? 'https://hml3-wsoficio.onr.org.br/acompanhamentotitulos.asmx' }}"
}
 `,
        options: {},
    };

    @node({
        id: 'a3b4c5d6-e7f8-4901-a234-333344445555',
        name: 'validar-entrada',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [656, 0],
    })
    ValidarEntrada = {
        jsCode: `const item = $input.first().json;

const hash = String(item.hash ?? '').trim().toUpperCase();
const idTitulo = Number(item.id_titulo);
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
} else if (!Number.isFinite(idTitulo) || idTitulo < 1) {
    entrada_valida = false;
    codigo_erro = 12;
    mensagem_erro = 'id_titulo é obrigatório e deve ser um inteiro positivo.';
} else if (!urlServico) {
    entrada_valida = false;
    codigo_erro = 10;
    mensagem_erro = 'url_servico_onr é obrigatória.';
}

return [{
    json: {
        ...item,
        hash,
        id_titulo: idTitulo,
        url_servico_onr: urlServico,
        entrada_valida,
        codigo_erro,
        mensagem_erro
    }
}];`,
    };

    @node({
        id: 'b4c5d6e7-f8a9-4012-b345-444455556666',
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
                    id: 'c5d6e7f8-a9b0-4123-c456-555566667777',
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
        id: 'd6e7f8a9-b0c1-4234-d567-666677778888',
        name: 'montar-envelope-soap',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1296, -128],
    })
    MontarEnvelopeSoap = {
        jsCode: `const item = $input.first().json;

const corpo = \`<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <tns:GetTituloAT xmlns:tns="http://tempuri.org/WSOficio">
      <tns:oRequest>
        <tns:Hash>\${item.hash}</tns:Hash>
        <tns:IDTitulo>\${item.id_titulo}</tns:IDTitulo>
      </tns:oRequest>
    </tns:GetTituloAT>
  </soap:Body>
</soap:Envelope>\`;

return [{ json: { ...item, corpo_soap: corpo } }];`,
    };

    @node({
        id: 'e7f8a9b0-c1d2-4345-e678-777788889999',
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
        id: 'f8a9b0c1-d2e3-4456-f789-888899990000',
        name: 'converter-resposta-onr',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1936, -128],
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
        id_cartorio: 0,
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
            id_cartorio: parseInt(extrairTag('IDCartorio', xml), 10) || 0,
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
        id: 'a9b0c1d2-e3f4-4567-a890-999900001111',
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
            id_cartorio: 0,
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
        id: 'b0c1d2e3-f4a5-4678-b901-000011112222',
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
            id_cartorio: 0,
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
        id: 'c1d2e3f4-a5b6-4789-c012-111122334455',
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
