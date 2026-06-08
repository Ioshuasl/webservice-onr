import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : [AUTONR-63] (webservice ONR) AlterarPedidoAC - E-Protocolo
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
    id: 'cysgYAGHHKi5u4yi',
    name: '[AUTONR-63] (webservice ONR) AlterarPedidoAC - E-Protocolo',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class Autonr63WebserviceOnrAlterarpedidoacEProtocoloWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'a2b3c4d5-e6f7-4890-a123-456789abcdef',
        webhookId: 'f3a4b5c6-d7e8-4f9a-0b1c-d2e3f4f5a6b7d',
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [-1296, 128],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    Webhook = {
        httpMethod: 'POST',
        path: 'f3a4b5c6-d7e8-4f9a-0b1c-d2e3f4f5a6b7d',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'b3c4d5e6-f7a8-4901-b234-56789abcdef0',
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
  "tipo_documento": {{ $json.body.tipo_documento ?? 1 }},
  "apresentante_nome": "{{ $json.body.apresentante_nome ?? '' }}",
  "apresentante_email": "{{ $json.body.apresentante_email ?? '' }}",
  "endereco_via": "{{ $json.body.endereco_via ?? '' }}",
  "endereco_logradouro": "{{ $json.body.endereco_logradouro ?? '' }}",
  "endereco_numero": {{ $json.body.endereco_numero ?? 0 }},
  "endereco_complemento": "{{ $json.body.endereco_complemento ?? '' }}",
  "endereco_bairro": "{{ $json.body.endereco_bairro ?? '' }}",
  "endereco_uf": "{{ $json.body.endereco_uf ?? '' }}",
  "endereco_cidade": "{{ $json.body.endereco_cidade ?? '' }}",
  "endereco_cep": {{ $json.body.endereco_cep ?? 0 }},
  "contato_ddd": "{{ $json.body.contato_ddd ?? '' }}",
  "contato_telefone": "{{ $json.body.contato_telefone ?? '' }}",
  "url_servico_onr": "{{ $json.body.url_servico_onr ?? 'https://hml3-wsoficio.onr.org.br/eprotocolo.asmx' }}"
}
 `,
        options: {},
    };

    @node({
        id: 'c4d5e6f7-a8b9-4012-c345-6789abcdef01',
        name: 'validar-entrada',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [-640, 128],
    })
    ValidarEntrada = {
        jsCode: `const item = $input.first().json;

const hash = String(item.hash ?? '').trim().toUpperCase();
const idContrato = parseInt(item.id_contrato, 10);
const tipoDocumento = parseInt(item.tipo_documento, 10);
const enderecoNumero = parseInt(item.endereco_numero, 10);
const enderecoCep = parseInt(item.endereco_cep, 10);
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
} else if (!Number.isFinite(tipoDocumento) || tipoDocumento < 1) {
    entrada_valida = false;
    codigo_erro = 10;
    mensagem_erro = 'tipo_documento é obrigatório (mínimo 1).';
} else if (!Number.isFinite(enderecoNumero)) {
    entrada_valida = false;
    codigo_erro = 10;
    mensagem_erro = 'endereco_numero é obrigatório.';
} else if (!Number.isFinite(enderecoCep)) {
    entrada_valida = false;
    codigo_erro = 10;
    mensagem_erro = 'endereco_cep é obrigatório.';
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
        tipo_documento: tipoDocumento,
        apresentante_nome: String(item.apresentante_nome ?? '').trim(),
        apresentante_email: String(item.apresentante_email ?? '').trim(),
        endereco_via: String(item.endereco_via ?? '').trim(),
        endereco_logradouro: String(item.endereco_logradouro ?? '').trim(),
        endereco_numero: enderecoNumero,
        endereco_complemento: String(item.endereco_complemento ?? '').trim(),
        endereco_bairro: String(item.endereco_bairro ?? '').trim(),
        endereco_uf: String(item.endereco_uf ?? '').trim(),
        endereco_cidade: String(item.endereco_cidade ?? '').trim(),
        endereco_cep: enderecoCep,
        contato_ddd: String(item.contato_ddd ?? '').trim(),
        contato_telefone: String(item.contato_telefone ?? '').trim(),
        url_servico_onr: urlServico,
        entrada_valida,
        codigo_erro,
        mensagem_erro
    }
}];`,
    };

    @node({
        id: 'd5e6f7a8-b9c0-4123-d456-789abcdef012',
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
                    id: 'e6f7a8b9-c0d1-4234-e567-89abcdef0123',
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
        id: 'f7a8b9c0-d1e2-4345-f678-9abcdef01234',
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
    <tns:AlterarPedidoAC xmlns:tns="http://tempuri.org/WSOficio">
      <tns:oRequest>
        <tns:Hash>\${escapeXml(item.hash)}</tns:Hash>
        <tns:IDContrato>\${item.id_contrato}</tns:IDContrato>
        <tns:TipoDocumento>\${item.tipo_documento}</tns:TipoDocumento>
        <tns:ApresentanteNome>\${escapeXml(item.apresentante_nome)}</tns:ApresentanteNome>
        <tns:ApresentanteEmail>\${escapeXml(item.apresentante_email)}</tns:ApresentanteEmail>
        <tns:EnderecoVia>\${escapeXml(item.endereco_via)}</tns:EnderecoVia>
        <tns:EnderecoLogradouro>\${escapeXml(item.endereco_logradouro)}</tns:EnderecoLogradouro>
        <tns:EnderecoNumero>\${item.endereco_numero}</tns:EnderecoNumero>
        <tns:EnderecoComplemento>\${escapeXml(item.endereco_complemento)}</tns:EnderecoComplemento>
        <tns:EnderecoBairro>\${escapeXml(item.endereco_bairro)}</tns:EnderecoBairro>
        <tns:EnderecoUF>\${escapeXml(item.endereco_uf)}</tns:EnderecoUF>
        <tns:EnderecoCidade>\${escapeXml(item.endereco_cidade)}</tns:EnderecoCidade>
        <tns:EnderecoCEP>\${item.endereco_cep}</tns:EnderecoCEP>
        <tns:ContatoDDD>\${escapeXml(item.contato_ddd)}</tns:ContatoDDD>
        <tns:ContatoTelefone>\${escapeXml(item.contato_telefone)}</tns:ContatoTelefone>
      </tns:oRequest>
    </tns:AlterarPedidoAC>
  </soap:Body>
</soap:Envelope>\`;

return [{ json: { ...item, corpo_soap: corpo } }];`,
    };

    @node({
        id: 'a8b9c0d1-e2f3-4456-a789-0abcdef12345',
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
        id: 'b9c0d1e2-f3a4-4567-b890-1abcdef23456',
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
    const match = origem.match(regex);
    return match ? decodeXml(match[1].trim()) : '';
}

function dadosVazio() {
    return {
        id_contrato: entrada.id_contrato ?? 0,
        alterado: false
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
        dados: {
            id_contrato: entrada.id_contrato ?? 0,
            alterado: sucesso
        }
    }
};`,
    };

    @node({
        id: 'c0d1e2f3-a4b5-4678-c901-2abcdef34567',
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
            alterado: false
        }
    }
}];`,
    };

    @node({
        id: 'd1e2f3a4-b5c6-4789-d012-3abcdef45678',
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
            alterado: false
        }
    }
}];`,
    };

    @node({
        id: 'e2f3a4b5-c6d7-4890-e123-4abcdef56789',
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
