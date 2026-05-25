import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : Insert Status AT
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
    id: 'vVAREdSNXOu9HTT6',
    name: 'Insert Status AT',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class InsertStatusAtWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'd6e7f8a9-b0c1-4d2e-a3b4-c5d6e7f8a9b0',
        webhookId: 'c6d7e8f9-a0b1-4c2d-3e4f-5a6b7c8d9e0f',
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 0],
        credentials: { httpBasicAuth: { id: 'CE3L7VlaRe4klqlk', name: 'ioshua + ioshua123' } },
    })
    Webhook = {
        httpMethod: 'POST',
        path: 'c6d7e8f9-a0b1-4c2d-3e4f-5a6b7c8d9e0f',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'e7f8a9b0-c1d2-4e3f-b4c5-d6e7f8a9b0c1',
        name: 'normalizar-entrada',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [336, 0],
    })
    NormalizarEntrada = {
        mode: 'raw',
        jsonOutput: `={
  "hash": "{{ $json.body.hash ?? '' }}",
  "id_titulo": {{ $json.body.id_titulo ?? null }},
  "id_tipo_status": {{ $json.body.id_tipo_status ?? null }},
  "data_status": "{{ $json.body.data_status ?? '' }}",
  "descricao_status": "{{ $json.body.descricao_status ?? '' }}",
  "url_servico_onr": "{{ $json.body.url_servico_onr ?? 'https://hml3-wsoficio.onr.org.br/acompanhamentotitulos.asmx' }}"
}
 `,
        options: {},
    };

    @node({
        id: 'f8a9b0c1-d2e3-4f4a-c5d6-e7f8a9b0c1d2',
        name: 'validar-entrada',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [656, 0],
    })
    ValidarEntrada = {
        jsCode: `const item = $input.first().json;

const hash = String(item.hash ?? '').trim().toUpperCase();
const idTitulo = Number(item.id_titulo);
const idTipoStatus = Number(item.id_tipo_status);
const dataStatusOriginal = String(item.data_status ?? '').trim();
const dataStatus = dataStatusOriginal.replace('T', ' ');
const descricaoStatus = String(item.descricao_status ?? '').trim();
const urlServico = String(item.url_servico_onr ?? '').trim();

let entrada_valida = true;
let codigo_erro = 0;
let mensagem_erro = '';

const tiposStatusValidos = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);

function validarDataStatus(valor) {
    const match = valor.match(/^(\\d{4})-(\\d{2})-(\\d{2}) (\\d{2}):(\\d{2}):(\\d{2})$/);
    if (!match) return { valida: false, anteriorLimite: false };

    const [, ano, mes, dia, hora, minuto, segundo] = match.map(Number);
    const data = new Date(Date.UTC(ano, mes - 1, dia, hora, minuto, segundo));
    const componentesConferem =
        data.getUTCFullYear() === ano &&
        data.getUTCMonth() === mes - 1 &&
        data.getUTCDate() === dia &&
        data.getUTCHours() === hora &&
        data.getUTCMinutes() === minuto &&
        data.getUTCSeconds() === segundo;

    if (!componentesConferem) return { valida: false, anteriorLimite: false };

    return {
        valida: true,
        anteriorLimite: data < new Date(Date.UTC(2011, 0, 1, 0, 0, 0))
    };
}

const dataValidada = validarDataStatus(dataStatus);

if (!hash) {
    entrada_valida = false;
    codigo_erro = 11;
    mensagem_erro = 'O hash de validacao nao foi informado.';
} else if (!/^[0-9A-F]{40}$/.test(hash)) {
    entrada_valida = false;
    codigo_erro = 11;
    mensagem_erro = 'Hash invalido: informe 40 caracteres hexadecimais maiusculos.';
} else if (!Number.isInteger(idTitulo) || idTitulo < 1) {
    entrada_valida = false;
    codigo_erro = 12;
    mensagem_erro = 'id_titulo e obrigatorio e deve ser um inteiro positivo.';
} else if (!Number.isInteger(idTipoStatus) || !tiposStatusValidos.has(idTipoStatus)) {
    entrada_valida = false;
    codigo_erro = 13;
    mensagem_erro = 'id_tipo_status invalido: use um valor de 1 a 13 conforme IDTipoStatus-AT.';
} else if (!dataStatusOriginal) {
    entrada_valida = false;
    codigo_erro = 14;
    mensagem_erro = 'data_status e obrigatoria no formato aaaa-mm-dd hh:mm:ss.';
} else if (!dataValidada.valida) {
    entrada_valida = false;
    codigo_erro = 15;
    mensagem_erro = 'data_status invalida: use o formato aaaa-mm-dd hh:mm:ss.';
} else if (dataValidada.anteriorLimite) {
    entrada_valida = false;
    codigo_erro = 16;
    mensagem_erro = 'data_status invalida: nao pode ser anterior a 01/01/2011.';
} else if (!descricaoStatus) {
    entrada_valida = false;
    codigo_erro = 17;
    mensagem_erro = 'descricao_status e obrigatoria.';
} else if (!urlServico) {
    entrada_valida = false;
    codigo_erro = 10;
    mensagem_erro = 'url_servico_onr e obrigatoria.';
}

return [{
    json: {
        ...item,
        hash,
        id_titulo: idTitulo,
        id_tipo_status: idTipoStatus,
        data_status: dataStatus,
        descricao_status: descricaoStatus,
        url_servico_onr: urlServico,
        entrada_valida,
        codigo_erro,
        mensagem_erro
    }
}];`,
    };

    @node({
        id: 'a9b0c1d2-e3f4-405a-d6e7-f8a9b0c1d2e3',
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
                    id: 'b0c1d2e3-f4a5-416b-e7f8-a9b0c1d2e3f4',
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
        id: 'c1d2e3f4-a5b6-427c-f8a9-b0c1d2e3f4a5',
        name: 'montar-envelope-soap',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1296, -128],
    })
    MontarEnvelopeSoap = {
        jsCode: `const item = $input.first().json;

function xml(valor) {
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
    <tns:InsertStatusAT xmlns:tns="http://tempuri.org/WSOficio">
      <tns:oRequest>
        <tns:Hash>\${xml(item.hash)}</tns:Hash>
        <tns:IDTitulo>\${item.id_titulo}</tns:IDTitulo>
        <tns:IDTipoStatus>\${item.id_tipo_status}</tns:IDTipoStatus>
        <tns:DataStatus>\${xml(item.data_status)}</tns:DataStatus>
        <tns:DescricaoStatus>\${xml(item.descricao_status)}</tns:DescricaoStatus>
      </tns:oRequest>
    </tns:InsertStatusAT>
  </soap:Body>
</soap:Envelope>\`;

return [{ json: { ...item, corpo_soap: corpo } }];`,
    };

    @node({
        id: 'd2e3f4a5-b6c7-438d-a9b0-c1d2e3f4a5b6',
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
        id: 'e3f4a5b6-c7d8-449e-b0c1-d2e3f4a5b6c7',
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
    if ([10, 11, 12, 13, 14, 15, 16, 17].includes(codigoErro)) return 400;
    if ([45, 46, 47].includes(codigoErro)) return 401;
    if ([31, 32, 50].includes(codigoErro)) return 403;
    if (codigoErro === 30) return 404;
    if (codigoErro === 501) return 409;
    if (codigoErro === 0) return 502;
    if (codigoErro === 1 || codigoErro === 101) return 503;
    return 422;
}

function respostaErro(statusHttp, codigoErro, mensagemErro) {
    return {
        status_http: statusHttp,
        sucesso: false,
        codigo_erro: codigoErro,
        mensagem_erro: mensagemErro,
        dados: {
            id_titulo: entrada.id_titulo ?? 0,
            id_tipo_status: entrada.id_tipo_status ?? 0,
            id_status: 0,
            status_cadastrado: false
        }
    };
}

if (!xml || typeof xml !== 'string') {
    return { json: respostaErro(502, 0, 'Resposta invalida da ONR: XML nao encontrado.') };
}

const extrairTag = (tag, origem) => {
    const regex = new RegExp('<(?:\\\\w+:)?' + tag + '>(.*?)</(?:\\\\w+:)?' + tag + '>', 's');
    const match = origem.match(regex);
    return match ? match[1].trim() : '';
};

const sucesso = extrairTag('RETORNO', xml) === 'true';
const codigo_erro = parseInt(extrairTag('CODIGOERRO', xml) || '0', 10);
const mensagem_erro = extrairTag('ERRODESCRICAO', xml);
const idStatus = parseInt(extrairTag('IDStatus', xml) || '0', 10) || 0;

return {
    json: {
        status_http: mapearStatusHttp(sucesso, codigo_erro),
        sucesso,
        codigo_erro,
        mensagem_erro,
        dados: {
            id_titulo: entrada.id_titulo ?? 0,
            id_tipo_status: entrada.id_tipo_status ?? 0,
            id_status: idStatus,
            status_cadastrado: sucesso
        }
    }
};`,
    };

    @node({
        id: 'f4a5b6c7-d8e9-45af-c1d2-e3f4a5b6c7d8',
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
            id_titulo: item.id_titulo ?? 0,
            id_tipo_status: item.id_tipo_status ?? 0,
            id_status: 0,
            status_cadastrado: false
        }
    }
}];`,
    };

    @node({
        id: 'a5b6c7d8-e9f0-46b1-d2e3-f4a5b6c7d8e9',
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
            id_titulo: erro.id_titulo ?? 0,
            id_tipo_status: erro.id_tipo_status ?? 0,
            id_status: 0,
            status_cadastrado: false
        }
    }
}];`,
    };

    @node({
        id: 'b6c7d8e9-f0a1-47c2-e3f4-a5b6c7d8e9f0',
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
