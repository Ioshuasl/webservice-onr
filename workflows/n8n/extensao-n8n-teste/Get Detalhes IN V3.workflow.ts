import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : [AUTONR-77] (webservice ONR) GetDetalhesIN_V3 - Intimações
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
    id: 'Mk2RnHw9lffqudSb',
    name: '[AUTONR-77] (webservice ONR) GetDetalhesIN_V3 - Intimações',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class Autonr77WebserviceOnrGetdetalhesinV3IntimacoesWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'a8770001-0000-4000-8000-000000000001',
        webhookId: 'c877i003-6c4d-5e5f-0a71-234567890abc',
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [-1296, 128],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    Webhook = {
        httpMethod: 'POST',
        path: 'c877i003-6c4d-5e5f-0a71-234567890abc',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'b8770002-0000-4000-8000-000000000002',
        name: 'normalizar-entrada',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [-960, 128],
    })
    NormalizarEntrada = {
        mode: 'raw',
        jsonOutput: `={
  "hash": "{{ $json.body.hash }}",
  "id_pedido": {{ $json.body.id_pedido ?? 0 }},
  "url_servico_onr": "{{ $json.body.url_servico_onr ?? 'https://hml3-wsoficio.onr.org.br/intimacoes.asmx' }}"
}`,
        options: {},
    };

    @node({
        id: 'c8770003-0000-4000-8000-000000000003',
        name: 'validar-entrada',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [-640, 128],
    })
    ValidarEntrada = {
        jsCode: `const item = $input.first().json;
let entrada_valida = true; let codigo_erro = 0; let mensagem_erro = '';
function normalizarInteiro(v) { const n = Number(v); return Number.isInteger(n) ? n : NaN; }
const hash = String(item.hash ?? '').trim().toUpperCase();
if (!hash) {
    entrada_valida = false; codigo_erro = 11; mensagem_erro = 'O hash de validação não foi informado.';
} else if (!/^[0-9A-F]{40}$/.test(hash)) {
    entrada_valida = false; codigo_erro = 11; mensagem_erro = 'Hash inválido: informe 40 caracteres hexadecimais maiúsculos.';
}
const idPedido = normalizarInteiro(item.id_pedido);
const urlServico = String(item.url_servico_onr ?? '').trim();
if (entrada_valida && !urlServico) {
    entrada_valida = false; codigo_erro = 10; mensagem_erro = 'url_servico_onr é obrigatória.';
}
if (entrada_valida && (!Number.isFinite(idPedido) || idPedido < 1)) {
    entrada_valida = false; codigo_erro = 12; mensagem_erro = 'id_pedido inválido: informe um inteiro positivo.';
}
return [{ json: { ...item, hash, id_pedido: idPedido, url_servico_onr: urlServico, entrada_valida, codigo_erro, mensagem_erro } }];`,
    };

    @node({
        id: 'd8770004-0000-4000-8000-000000000004',
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
        id: 'e8770005-0000-4000-8000-000000000005',
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
const corpo = \`<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <tns:GetDetalhesIN_V3 xmlns:tns="http://tempuri.org/WSOficio">
      <tns:oRequest>
        <tns:Hash>\${escapeXml(item.hash)}</tns:Hash>
        <tns:IDPedido>\${item.id_pedido}</tns:IDPedido>
      </tns:oRequest>
    </tns:GetDetalhesIN_V3>
  </soap:Body>
</soap:Envelope>\`;
return [{ json: { ...item, corpo_soap: corpo } }];`,
    };

    @node({
        id: 'f8770006-0000-4000-8000-000000000006',
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
        id: 'a8770007-0000-4000-8000-000000000007',
        name: 'converter-resposta-onr',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [640, 0],
    })
    ConverterRespostaOnr = {
        jsCode: `function mapearStatusHttp(sucesso, codigoErro, origem = 'onr') {
    if (sucesso) return 200;
    if (origem === 'validacao') return 400;
    if ([2, 10, 11, 12, 13, 16, 17, 30].includes(codigoErro)) return 400;
    if ([45, 46, 47].includes(codigoErro)) return 401;
    if ([51, 52, 53, 54, 55, 56, 57, 58].includes(codigoErro)) return 404;
    if (codigoErro === 0) return 502;
    if (codigoErro === 1) return 503;
    return 422;
}

function extrairTag(tag, origem) {
    const regex = new RegExp(\`<(?:\\\\w+:)?\${tag}>(.*?)</(?:\\\\w+:)?\${tag}>\`, 'is');
    const match = origem.match(regex);
    return match ? match[1].trim() : '';
}
const xml = $input.first().json.data;
function dadosVazio() { return { id_pedido: 0, operacao_soap: 'GetDetalhesIN_V3' }; }
function respostaErro(s, c, m) { return { status_http: s, sucesso: false, codigo_erro: c, mensagem_erro: m, dados: dadosVazio() }; }
function inteiro(tag, origem) { return parseInt(extrairTag(tag, origem), 10) || 0; }
function decimal(tag, origem) { const v = extrairTag(tag, origem); return v === '' ? 0 : Number(v); }
function extrairBlocos(origem, nome) {
    const itens = [];
    const regex = new RegExp(\`<(?:\\\\w+:)?\${nome}[^>]*>([\\\\s\\\\S]*?)<\\\\/(?:\\\\w+:)?\${nome}>\`, 'g');
    let match;
    while ((match = regex.exec(origem)) !== null) itens.push(match[1]);
    return itens;
}
function mapPrenotacao(b) {
    return { numero: extrairTag('Numero', b), data: extrairTag('Data', b), data_vencimento: extrairTag('DataVencimento', b), valor_servico: decimal('ValorServico', b) };
}
function mapDevedor(b) {
    return { nome: extrairTag('Nome', b), participacao: extrairTag('Participacao', b), documento: extrairTag('CPFCNPJ', b), email: extrairTag('Email', b) };
}
function mapImovel(b) { return { matricula: extrairTag('Matricula', b) }; }
function mapEndereco(b) { return { nome_devedor: extrairTag('NomeDevedor', b), endereco_completo: extrairTag('EnderecoCompleto', b) }; }
function mapReingresso(b) { return { protocolo: extrairTag('Protocolo', b), data_prenotacao: extrairTag('DataPrenotacao', b) }; }
function mapBoleto(b) { return { data_vencimento: extrairTag('DataVencimento', b), valor: decimal('Valor', b), url: extrairTag('URL', b) }; }
function mapPrestacao(b) { return { numero: extrairTag('Numero', b), data_vencimento: extrairTag('DataVencimento', b), valor: decimal('Valor', b) }; }
function mapPurga(b) { return { data_vencimento: extrairTag('DataVencimento', b), valor: decimal('Valor', b) }; }
if (!xml || typeof xml !== 'string') return { json: respostaErro(502, 0, 'Resposta inválida da ONR: XML não encontrado.') };
const sucesso = extrairTag('RETORNO', xml).toLowerCase() === 'true';
const codigo_erro = parseInt(extrairTag('CODIGOERRO', xml) || '0', 10);
const mensagem_erro = extrairTag('ERRODESCRICAO', xml);
if (!sucesso) return { json: respostaErro(mapearStatusHttp(false, codigo_erro, 'onr'), codigo_erro, mensagem_erro) };
return { json: {
    status_http: 200, sucesso: true, codigo_erro, mensagem_erro,
    dados: {
        operacao_soap: 'GetDetalhesIN_V3',
        id_pedido: inteiro('IDPedido', xml),
        id_status: inteiro('IDStatus', xml),
        protocolo: extrairTag('Protocolo', xml),
        estado: extrairTag('Estado', xml),
        cidade: extrairTag('Cidade', xml),
        id_cartorio: inteiro('IDCartorio', xml),
        cartorio: extrairTag('Cartorio', xml),
        numero_contrato: extrairTag('NumeroContrato', xml),
        data_remessa: extrairTag('DataRemessa', xml),
        solicitante: extrairTag('Solicitante', xml),
        solicitante_documento: extrairTag('SolicitanteCPFCNPJ', xml),
        solicitante_im: extrairTag('SolicitanteIM', xml),
        solicitante_logradouro: extrairTag('SolicitanteEndereco', xml),
        solicitante_numero: extrairTag('SolicitanteNumero', xml),
        solicitante_complemento: extrairTag('SolicitanteComplemento', xml),
        solicitante_bairro: extrairTag('SolicitanteBairro', xml),
        solicitante_cidade: extrairTag('SolicitanteCidade', xml),
        solicitante_estado: extrairTag('SolicitanteEstado', xml),
        solicitante_cep: extrairTag('SolicitanteCEP', xml),
        solicitante_ddd: extrairTag('SolicitanteDDD', xml),
        solicitante_telefone: extrairTag('SolicitanteTelefone', xml),
        solicitante_email: extrairTag('SolicitanteEmail', xml),
        credor: extrairTag('Credor', xml),
        credor_documento: extrairTag('CredorCPFCNPJ', xml),
        credor_im: extrairTag('CredorIM', xml),
        credor_logradouro: extrairTag('CredorEndereco', xml),
        credor_numero: extrairTag('CredorNumero', xml),
        credor_complemento: extrairTag('CredorComplemento', xml),
        credor_bairro: extrairTag('CredorBairro', xml),
        credor_cidade: extrairTag('CredorCidade', xml),
        credor_estado: extrairTag('CredorEstado', xml),
        credor_cep: extrairTag('CredorCEP', xml),
        credor_ddd: extrairTag('CredorDDD', xml),
        credor_telefone: extrairTag('CredorTelefone', xml),
        credor_email: extrairTag('CredorEmail', xml),
        prestacao_agencia: extrairTag('PrestacaoAgencia', xml),
        prestacao_endereco: extrairTag('PrestacaoEndereco', xml),
        tipo_cobranca: inteiro('TipoCobranca', xml),
        prenotacoes: extrairBlocos(xml, 'GetDetalhesIN_Prenotacao_WSResp').map(mapPrenotacao),
        devedores: extrairBlocos(xml, 'GetDetalhesIN_Devedor_v2_WSResp').map(mapDevedor),
        imoveis: extrairBlocos(xml, 'GetDetalhesIN_Imovel_WSResp').map(mapImovel),
        enderecos_intimacao: extrairBlocos(xml, 'GetDetalhesIN_EnderecoIntimacao_WSResp').map(mapEndereco),
        reingressos: extrairBlocos(xml, 'GetDetalhesIN_Reingresso_WSResp').map(mapReingresso),
        boletos: extrairBlocos(xml, 'GetDetalhesIN_Boleto_WSResp').map(mapBoleto),
        prestacoes_vencidas: extrairBlocos(xml, 'GetDetalhesIN_PrestacaoVencida_WSResp').map(mapPrestacao),
        purgas: extrairBlocos(xml, 'GetDetalhesIN_Purga_WSResp').map(mapPurga),
    }
}};`,
    };

    @node({
        id: 'b8770008-0000-4000-8000-000000000008',
        name: 'resposta-validacao',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [0, 256],
    })
    RespostaValidacao = {
        jsCode: `const item = $input.first().json;
return [{ json: { status_http: 400, sucesso: false, codigo_erro: item.codigo_erro, mensagem_erro: item.mensagem_erro, dados: { id_pedido: item.id_pedido ?? 0, operacao_soap: 'GetDetalhesIN_V3' } } }];`,
    };

    @node({
        id: 'c8770009-0000-4000-8000-000000000009',
        name: 'resposta-erro-conexao-onr',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [640, 256],
    })
    RespostaErroConexaoOnr = {
        jsCode: `const erro = $input.first().json;
return [{ json: { status_http: 502, sucesso: false, codigo_erro: 0, mensagem_erro: erro.error?.message || erro.message || 'Falha ao conectar com a ONR.', dados: { id_pedido: erro.id_pedido ?? 0, operacao_soap: 'GetDetalhesIN_V3' } } }];`,
    };

    @node({
        id: 'd877000a-0000-4000-8000-000000000001',
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
