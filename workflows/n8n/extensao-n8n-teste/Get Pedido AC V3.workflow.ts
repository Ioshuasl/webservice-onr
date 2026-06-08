import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : [AUTONR-62] (webservice ONR) GetPedidoAC_V3 - E-Protocolo
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
    id: 'efoufPoQAxTh1PlE',
    name: '[AUTONR-62] (webservice ONR) GetPedidoAC_V3 - E-Protocolo',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class Autonr62WebserviceOnrGetpedidoacV3EProtocoloWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'a1b2c3d4-e5f6-4789-a012-3456789abcde',
        webhookId: 'e2f3a4b5-c6d7-4e8f-9a0b-1c2d3e4f5a6b',
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [-1296, 128],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    Webhook = {
        httpMethod: 'POST',
        path: 'e2f3a4b5-c6d7-4e8f-9a0b-1c2d3e4f5a6b',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'b2c3d4e5-f6a7-4890-b123-456789abcdef',
        name: 'normalizar-entrada',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [-960, 128],
    })
    NormalizarEntrada = {
        mode: 'raw',
        jsonOutput: `={
  "hash": "{{ $json.body.hash ?? '' }}",
  "id_contrato": {{ $json.body.id_contrato ?? 0 }},
  "url_servico_onr": "{{ $json.body.url_servico_onr ?? 'https://hml3-wsoficio.onr.org.br/eprotocolo.asmx' }}"
}
 `,
        options: {},
    };

    @node({
        id: 'c3d4e5f6-a7b8-4901-c234-56789abcdef0',
        name: 'validar-entrada',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [-640, 128],
    })
    ValidarEntrada = {
        jsCode: `const item = $input.first().json;

const hash = String(item.hash ?? '').trim().toUpperCase();
const idContrato = parseInt(item.id_contrato, 10);
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
        url_servico_onr: urlServico,
        entrada_valida,
        codigo_erro,
        mensagem_erro
    }
}];`,
    };

    @node({
        id: 'd4e5f6a7-b8c9-4012-d345-6789abcdef01',
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
                    id: 'e5f6a7b8-c9d0-4123-e456-789abcdef012',
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
        id: 'f6a7b8c9-d0e1-4234-f567-89abcdef0123',
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

const corpo = \`<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <tns:GetPedidoAC_V3 xmlns:tns="http://tempuri.org/WSOficio">
      <tns:oRequest>
        <tns:Hash>\${escapeXml(item.hash)}</tns:Hash>
        <tns:IDContrato>\${item.id_contrato}</tns:IDContrato>
      </tns:oRequest>
    </tns:GetPedidoAC_V3>
  </soap:Body>
</soap:Envelope>\`;

return [{ json: { ...item, corpo_soap: corpo } }];`,
    };

    @node({
        id: 'a7b8c9d0-e1f2-4345-a678-9abcdef01234',
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
        id: 'b8c9d0e1-f2a3-4456-b789-0abcdef12345',
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
    if ([2, 10, 11, 12].includes(codigoErro)) return 400;
    if ([45, 46, 47].includes(codigoErro)) return 401;
    if (codigoErro === 51) return 404;
    if ([52, 53].includes(codigoErro)) return 422;
    if (codigoErro === 55) return 403;
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
    const match = String(origem ?? '').match(regex);
    return match ? decodeXml(match[1].trim()) : '';
}

function extrairBloco(tag, origem) {
    const regex = new RegExp('<(?:\\\\w+:)?' + tag + '[^>]*>([\\\\s\\\\S]*?)</(?:\\\\w+:)?' + tag + '>', 's');
    const match = String(origem ?? '').match(regex);
    return match ? match[1] : '';
}

function extrairBlocos(tag, origem) {
    const blocos = [];
    const regex = new RegExp('<(?:\\\\w+:)?' + tag + '[^>]*>([\\\\s\\\\S]*?)</(?:\\\\w+:)?' + tag + '>', 'gi');
    let match;
    while ((match = regex.exec(String(origem ?? ''))) !== null) {
        blocos.push(match[1]);
    }
    return blocos;
}

function inteiro(tag, origem) {
    const valor = parseInt(extrairTag(tag, origem), 10);
    return Number.isNaN(valor) ? 0 : valor;
}

function decimal(tag, origem) {
    const valor = parseFloat(extrairTag(tag, origem).replace(',', '.'));
    return Number.isNaN(valor) ? 0 : valor;
}

function booleano(tag, origem) {
    return extrairTag(tag, origem).toLowerCase() === 'true';
}

function mapApresentante(bloco) {
    return {
        nome: extrairTag('Nome', bloco),
        cpf_cnpj: extrairTag('CPFCNPJ', bloco),
        email: extrairTag('Email', bloco),
        via: extrairTag('Via', bloco),
        endereco: extrairTag('Endereco', bloco),
        numero: extrairTag('Numero', bloco),
        complemento: extrairTag('Complemento', bloco),
        bairro: extrairTag('Bairro', bloco),
        cidade: extrairTag('Cidade', bloco),
        estado: extrairTag('Estado', bloco),
        cep: extrairTag('CEP', bloco),
        ddd: extrairTag('DDD', bloco),
        telefone: extrairTag('Telefone', bloco)
    };
}

function mapImovel(bloco) {
    return {
        matricula: extrairTag('Matricula', bloco),
        via: extrairTag('Via', bloco),
        endereco: extrairTag('Endereco', bloco),
        numero: extrairTag('Numero', bloco),
        complemento: extrairTag('Complemento', bloco),
        bairro: extrairTag('Bairro', bloco),
        cidade: extrairTag('Cidade', bloco),
        estado: extrairTag('Estado', bloco)
    };
}

function mapComponente(bloco) {
    return {
        nome: extrairTag('Nome', bloco),
        cpf_cnpj: extrairTag('CPFCNPJ', bloco)
    };
}

function dadosVazio() {
    return {
        id_contrato: entrada.id_contrato ?? 0,
        protocolo: '',
        id_status: 0,
        id_cartorio: 0,
        data_remessa: '',
        solicitante: '',
        telefone: '',
        instituicao: '',
        email: '',
        tipo_documento: '',
        tipo_servico: '',
        importacao_extrato_xml: false,
        dados_apresentante: mapApresentante(''),
        prenotacao_numero: '',
        prenotacao_senha: '',
        prenotacao_data_inclusao: '',
        prenotacao_data_vencimento: '',
        prenotacao_data_reenvio: '',
        valor_servico: 0,
        data_resposta: '',
        resposta: '',
        dados_aceite: '',
        dados_imovel: mapImovel(''),
        compradores: [],
        vendedores: [],
        tipo_cobranca: 0,
        certidao_inteiro_teor: 0
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

if (!sucesso) {
    return { json: respostaErro(mapearStatusHttp(false, codigo_erro, 'onr'), codigo_erro, mensagem_erro) };
}

const blocoCompradores = extrairBloco('Compradores', xml);
const blocoVendedores = extrairBloco('Vendedores', xml);

return {
    json: {
        status_http: 200,
        sucesso: true,
        codigo_erro,
        mensagem_erro,
        dados: {
            id_contrato: inteiro('IDContrato', xml),
            protocolo: extrairTag('Protocolo', xml),
            id_status: inteiro('IDStatus', xml),
            id_cartorio: inteiro('IDCartorio', xml),
            data_remessa: extrairTag('DataRemessa', xml),
            solicitante: extrairTag('Solicitante', xml),
            telefone: extrairTag('Telefone', xml),
            instituicao: extrairTag('Instituicao', xml),
            email: extrairTag('Email', xml),
            tipo_documento: extrairTag('TipoDocumento', xml),
            tipo_servico: extrairTag('TipoServico', xml),
            importacao_extrato_xml: booleano('ImportacaoExtratoXML', xml),
            dados_apresentante: mapApresentante(extrairBloco('DadosApresentante', xml)),
            prenotacao_numero: extrairTag('PrenotacaoNumero', xml),
            prenotacao_senha: extrairTag('PrenotacaoSenha', xml),
            prenotacao_data_inclusao: extrairTag('PrenotacaoDataInclusao', xml),
            prenotacao_data_vencimento: extrairTag('PrenotacaoDataVencimento', xml),
            prenotacao_data_reenvio: extrairTag('PrenotacaoDataReenvio', xml),
            valor_servico: decimal('ValorServico', xml),
            data_resposta: extrairTag('DataResposta', xml),
            resposta: extrairTag('Resposta', xml),
            dados_aceite: extrairTag('DadosAceite', xml),
            dados_imovel: mapImovel(extrairBloco('DadosImovel', xml)),
            compradores: extrairBlocos('GetPedidoAC_DadosComponente_WSResp', blocoCompradores).map(mapComponente),
            vendedores: extrairBlocos('GetPedidoAC_DadosComponente_WSResp', blocoVendedores).map(mapComponente),
            tipo_cobranca: inteiro('TipoCobranca', xml),
            certidao_inteiro_teor: inteiro('CertidaoInteiroTeor', xml)
        }
    }
};`,
    };

    @node({
        id: 'c9d0e1f2-a3b4-4567-c890-1abcdef23456',
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
            protocolo: '',
            id_status: 0,
            id_cartorio: 0,
            compradores: [],
            vendedores: []
        }
    }
}];`,
    };

    @node({
        id: 'd0e1f2a3-b4c5-4678-d901-2abcdef34567',
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
            protocolo: '',
            id_status: 0,
            id_cartorio: 0,
            compradores: [],
            vendedores: []
        }
    }
}];`,
    };

    @node({
        id: 'e1f2a3b4-c5d6-4789-e012-3abcdef45678',
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
