import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : [AUTONR-64] (webservice ONR) SetPrenotacaoAC - E-Protocolo
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
    id: 'wyZYBawQKNCOwNIc',
    name: '[AUTONR-64] (webservice ONR) SetPrenotacaoAC - E-Protocolo',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class Autonr64WebserviceOnrSetprenotacaoacEProtocoloWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'a3b4c5d6-e7f8-4901-a234-567890abcdef',
        webhookId: 'f4a5b6c7-e8f9-4a0b-1c2d-3e4f5a6b7c8e',
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [-1296, 128],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    Webhook = {
        httpMethod: 'POST',
        path: 'f4a5b6c7-e8f9-4a0b-1c2d-3e4f5a6b7c8e',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'b4c5d6e7-f8a9-4012-b345-6789abcdef01',
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
  "numero_prenotacao": "{{ $json.body.numero_prenotacao ?? '' }}",
  "data_prenotacao": "{{ $json.body.data_prenotacao ?? '' }}",
  "data_vencimento": "{{ $json.body.data_vencimento ?? '' }}",
  "senha": "{{ $json.body.senha ?? '' }}",
  "url_servico_onr": "{{ $json.body.url_servico_onr ?? 'https://hml3-wsoficio.onr.org.br/eprotocolo.asmx' }}"
}
 `,
        options: {},
    };

    @node({
        id: 'c5d6e7f8-a9b0-4123-c456-789abcdef012',
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

    return data.getFullYear() === ano
        && data.getMonth() === mes - 1
        && data.getDate() === dia;
}

function parseData(valor) {
    const [ano, mes, dia] = String(valor).trim().split('-').map(Number);
    return new Date(ano, mes - 1, dia);
}

const hash = String(item.hash ?? '').trim().toUpperCase();
const idContrato = parseInt(item.id_contrato, 10);
const numeroPrenotacao = String(item.numero_prenotacao ?? '').trim();
const dataPrenotacao = String(item.data_prenotacao ?? '').trim();
const dataVencimento = String(item.data_vencimento ?? '').trim();
const senha = String(item.senha ?? '').trim();
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
} else if (!numeroPrenotacao) {
    entrada_valida = false;
    codigo_erro = 13;
    mensagem_erro = 'O número de prenotação não é válido.';
} else if (!dataPrenotacao) {
    entrada_valida = false;
    codigo_erro = 14;
    mensagem_erro = 'A data de prenotação não foi informada.';
} else if (!dataValida(dataPrenotacao)) {
    entrada_valida = false;
    codigo_erro = 16;
    mensagem_erro = 'A data de prenotação é inválida. Use aaaa-mm-dd.';
} else if (!dataVencimento) {
    entrada_valida = false;
    codigo_erro = 15;
    mensagem_erro = 'A data de vencimento não foi informada.';
} else if (!dataValida(dataVencimento)) {
    entrada_valida = false;
    codigo_erro = 17;
    mensagem_erro = 'A data de vencimento é inválida. Use aaaa-mm-dd.';
} else if (parseData(dataVencimento) < parseData(dataPrenotacao)) {
    entrada_valida = false;
    codigo_erro = 10;
    mensagem_erro = 'data_vencimento não pode ser anterior à data_prenotacao.';
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
        numero_prenotacao: numeroPrenotacao,
        data_prenotacao: dataPrenotacao,
        data_vencimento: dataVencimento,
        senha,
        url_servico_onr: urlServico,
        entrada_valida,
        codigo_erro,
        mensagem_erro
    }
}];`,
    };

    @node({
        id: 'd6e7f8a9-b0c1-4234-d567-89abcdef0123',
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
                    id: 'e7f8a9b0-c1d2-4345-e678-9abcdef01234',
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
        id: 'f8a9b0c1-d2e3-4456-f789-0abcdef12345',
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

const senhaXml = item.senha
    ? \`        <tns:Senha>\${escapeXml(item.senha)}</tns:Senha>\\n\`
    : '';

const corpo = \`<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <tns:SetPrenotacaoAC xmlns:tns="http://tempuri.org/WSOficio">
      <tns:oRequest>
        <tns:Hash>\${escapeXml(item.hash)}</tns:Hash>
        <tns:IDContrato>\${item.id_contrato}</tns:IDContrato>
        <tns:NumeroPrenotacao>\${escapeXml(item.numero_prenotacao)}</tns:NumeroPrenotacao>
        <tns:DataPrenotacao>\${escapeXml(item.data_prenotacao)}</tns:DataPrenotacao>
        <tns:DataVencimento>\${escapeXml(item.data_vencimento)}</tns:DataVencimento>
\${senhaXml}      </tns:oRequest>
    </tns:SetPrenotacaoAC>
  </soap:Body>
</soap:Envelope>\`;

return [{ json: { ...item, corpo_soap: corpo } }];`,
    };

    @node({
        id: 'a9b0c1d2-e3f4-4567-a890-1abcdef23456',
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
        id: 'b0c1d2e3-f4a5-4678-b901-2abcdef34567',
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
    if ([2, 10, 11, 12, 13, 14, 15, 16, 17].includes(codigoErro)) return 400;
    if ([45, 46, 47].includes(codigoErro)) return 401;
    if (codigoErro === 51) return 404;
    if (codigoErro === 52) return 403;
    if ([54, 56].includes(codigoErro)) return 409;
    if (codigoErro === 0) return 502;
    if (codigoErro === 1) return 503;
    return 422;
}

function dadosPadrao(sucesso = false) {
    return {
        id_contrato: entrada.id_contrato ?? 0,
        numero_prenotacao: entrada.numero_prenotacao ?? '',
        data_prenotacao: entrada.data_prenotacao ?? '',
        data_vencimento: entrada.data_vencimento ?? '',
        senha: entrada.senha ?? '',
        prenotacao_registrada: sucesso
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
        id: 'c1d2e3f4-a5b6-4789-c012-3abcdef45678',
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
            numero_prenotacao: item.numero_prenotacao ?? '',
            data_prenotacao: item.data_prenotacao ?? '',
            data_vencimento: item.data_vencimento ?? '',
            senha: item.senha ?? '',
            prenotacao_registrada: false
        }
    }
}];`,
    };

    @node({
        id: 'd2e3f4a5-b6c7-4890-d123-4abcdef56789',
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
            numero_prenotacao: erro.numero_prenotacao ?? '',
            data_prenotacao: erro.data_prenotacao ?? '',
            data_vencimento: erro.data_vencimento ?? '',
            senha: erro.senha ?? '',
            prenotacao_registrada: false
        }
    }
}];`,
    };

    @node({
        id: 'e3f4a5b6-c7d8-4901-e234-5abcdef67890',
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
