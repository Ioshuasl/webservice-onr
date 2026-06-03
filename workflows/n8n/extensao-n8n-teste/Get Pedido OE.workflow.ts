import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : [AUTONR-29] (webservice ONR) GetPedidoOE - Ofício Eletrônico
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
    id: 'Y93ngHiK9eZqS6JX',
    name: '[AUTONR-29] (webservice ONR) GetPedidoOE - Ofício Eletrônico',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class Autonr29WebserviceOnrGetpedidooeOficioEletronicoWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: '1e2f3a4b-5c6d-4e7f-8a9b-0c1d2e3f4a5b',
        webhookId: '2f3a4b5c-6d7e-4f8a-9b0c-1d2e3f4a5b6c',
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 0],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    Webhook = {
        httpMethod: 'POST',
        path: '2f3a4b5c-6d7e-4f8a-9b0c-1d2e3f4a5b6c',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: '3a4b5c6d-7e8f-4a9b-8c0d-1e2f3a4b5c6d',
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
  "url_servico_onr": "{{ $json.body.url_servico_onr ?? 'https://hml3-wsoficio.onr.org.br/oficios.asmx' }}"
}
 `,
        options: {},
    };

    @node({
        id: '4b5c6d7e-8f9a-4b0c-9d1e-2f3a4b5c6d7e',
        name: 'validar-entrada',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [656, 0],
    })
    ValidarEntrada = {
        jsCode: `const item = $input.first().json;

const hash = String(item.hash ?? '').trim().toUpperCase();
const idPedido = Number(item.id_pedido);
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
} else if (!Number.isInteger(idPedido) || idPedido < 1) {
    entrada_valida = false;
    codigo_erro = 12;
    mensagem_erro = 'id_pedido é obrigatório e deve ser um inteiro positivo.';
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
        url_servico_onr: urlServico,
        entrada_valida,
        codigo_erro,
        mensagem_erro
    }
}];`,
    };

    @node({
        id: '5c6d7e8f-9a0b-4c1d-8e2f-3a4b5c6d7e8f',
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
                    id: '6d7e8f9a-0b1c-4d2e-9f3a-4b5c6d7e8f9a',
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
        id: '7e8f9a0b-1c2d-4e3f-8a4b-5c6d7e8f9a0b',
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
    <tns:GetPedidoOE xmlns:tns="http://tempuri.org/WSOficio">
      <tns:oRequest>
        <tns:Hash>\${escapeXml(item.hash)}</tns:Hash>
        <tns:IDPedido>\${item.id_pedido}</tns:IDPedido>
      </tns:oRequest>
    </tns:GetPedidoOE>
  </soap:Body>
</soap:Envelope>\`;

return [{ json: { ...item, corpo_soap: corpo } }];`,
    };

    @node({
        id: '8f9a0b1c-2d3e-4f4a-9b5c-6d7e8f9a0b1c',
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
        id: '9a0b1c2d-3e4f-4a5b-8c6d-7e8f9a0b1c2d',
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
    if ([2, 10, 11, 12].includes(codigoErro)) return 400;
    if ([45, 46, 47].includes(codigoErro)) return 401;
    if (codigoErro === 51) return 404;
    if (codigoErro === 56) return 403;
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

function inteiro(tag, origem) {
    return parseInt(extrairTag(tag, origem), 10) || 0;
}

function booleano(tag, origem) {
    return extrairTag(tag, origem).toLowerCase() === 'true';
}

function dadosVazio() {
    return {
        id_pedido: entrada.id_pedido ?? 0,
        id_status: 0,
        id_instituicao: 0,
        instituicao: '',
        departamento: '',
        id_usuario: 0,
        usuario: '',
        id_tipo_pesquisa: 0,
        id_tipo_certidao: 0,
        protocolo: '',
        ticket: 0,
        numero_oficio: '',
        data_solicitacao: '',
        data_resposta: '',
        resposta: '',
        retransmitido: false,
        tipo_pessoa: 0,
        nome_razao: '',
        cpf_cnpj: '',
        rg_ie: '',
        imoveis_direitos: 0,
        data_transferencia: '',
        observacoes: '',
        matricula: '',
        transcricao: '',
        data_transcricao: '',
        livro_numero: '',
        endereco: '',
        numero: '',
        complemento: '',
        cep: '',
        edificio: '',
        apartamento: '',
        complemento_apto: '',
        loteamento: '',
        lote: '',
        quadra: '',
        n_contribuinte: '',
        registro: '',
        data_casamento: '',
        nome_marido: '',
        nome_esposa: ''
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

return {
    json: {
        status_http: mapearStatusHttp(sucesso, codigo_erro, 'onr'),
        sucesso,
        codigo_erro,
        mensagem_erro,
        dados: sucesso ? {
            id_pedido: inteiro('IDPedido', xml) || entrada.id_pedido || 0,
            id_status: inteiro('IDStatus', xml),
            id_instituicao: inteiro('IDInstituicao', xml),
            instituicao: extrairTag('Instituicao', xml),
            departamento: extrairTag('Departamento', xml),
            id_usuario: inteiro('IDUsuario', xml),
            usuario: extrairTag('Usuario', xml),
            id_tipo_pesquisa: inteiro('IDTipoPesquisa', xml),
            id_tipo_certidao: inteiro('IDTipoCertidao', xml),
            protocolo: extrairTag('Protocolo', xml),
            ticket: inteiro('Ticket', xml),
            numero_oficio: extrairTag('NumeroOficio', xml),
            data_solicitacao: extrairTag('DataSolicitacao', xml),
            data_resposta: extrairTag('DataResposta', xml),
            resposta: extrairTag('Resposta', xml),
            retransmitido: booleano('Retransmitido', xml),
            tipo_pessoa: inteiro('TipoPessoa', xml),
            nome_razao: extrairTag('NomeRazao', xml),
            cpf_cnpj: extrairTag('CPFCNPJ', xml),
            rg_ie: extrairTag('RGIE', xml),
            imoveis_direitos: inteiro('ImoveisDireitos', xml),
            data_transferencia: extrairTag('DataTransferencia', xml),
            observacoes: extrairTag('Observacoes', xml),
            matricula: extrairTag('Matricula', xml),
            transcricao: extrairTag('Transcricao', xml),
            data_transcricao: extrairTag('DataTranscricao', xml),
            livro_numero: extrairTag('LivroNumero', xml),
            endereco: extrairTag('Endereco', xml),
            numero: extrairTag('Numero', xml),
            complemento: extrairTag('Complemento', xml),
            cep: extrairTag('CEP', xml),
            edificio: extrairTag('Edificio', xml),
            apartamento: extrairTag('Apartamento', xml),
            complemento_apto: extrairTag('ComplementoApto', xml),
            loteamento: extrairTag('Loteamento', xml),
            lote: extrairTag('Lote', xml),
            quadra: extrairTag('Quadra', xml),
            n_contribuinte: extrairTag('NContribuinte', xml),
            registro: extrairTag('Registro', xml),
            data_casamento: extrairTag('DataCasamento', xml),
            nome_marido: extrairTag('NomeMarido', xml),
            nome_esposa: extrairTag('NomeEsposa', xml)
        } : dadosVazio()
    }
};`,
    };

    @node({
        id: '0b1c2d3e-4f5a-4b6c-9d7e-8f9a0b1c2d3e',
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
            id_pedido: item.id_pedido ?? 0
        }
    }
}];`,
    };

    @node({
        id: '1c2d3e4f-5a6b-4c7d-8e9f-0a1b2c3d4e5f',
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
            id_pedido: erro.id_pedido ?? 0
        }
    }
}];`,
    };

    @node({
        id: '2d3e4f5a-6b7c-4d8e-9f0a-1b2c3d4e5f6a',
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
