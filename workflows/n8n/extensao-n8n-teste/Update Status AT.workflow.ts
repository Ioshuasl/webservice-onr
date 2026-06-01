import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : Update Status AT
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
    id: 'OtgoVSVOl1u8LWl1',
    name: 'Update Status AT',
    active: false,
    isArchived: false,
    projectId: 'PP65Me8T4KDNsx9m',
    settings: { executionOrder: 'v1', binaryMode: 'separate', availableInMCP: false },
})
export class UpdateStatusAtWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'f82b0fc6-fb4f-4dd4-b886-f58de32a3259',
        webhookId: 'd8e9f0a1-b2c3-4d5e-8f90-a1b2c3d4e5f6',
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [-1296, 128],
    })
    Webhook = {
        httpMethod: 'POST',
        path: 'd8e9f0a1-b2c3-4d5e-8f90-a1b2c3d4e5f6',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: '57837888-aa93-4283-bb39-4f7f5d9c1cc6',
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
  "id_tipo_status": {{ $json.body.id_tipo_status }},
  "data_status": "{{ $json.body.data_status }}",
  "descricao_status": "{{ $json.body.descricao_status }}",
  "url_servico_onr": "{{ $json.body.url_servico_onr ?? 'https://hml3-wsoficio.onr.org.br/acompanhamentotitulos.asmx' }}"
}
 `,
        options: {},
    };

    @node({
        id: 'b4cbfbd8-931e-48a2-b96c-e007c4dc301d',
        name: 'validar-entrada',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [-640, 128],
    })
    ValidarEntrada = {
        jsCode: `const item = $input.first().json;

const TIPOS_STATUS_VALIDOS = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);

function normalizarInteiro(valor) {
    const numero = Number(valor);
    return Number.isInteger(numero) ? numero : NaN;
}

function dataStatusValida(valor) {
    const texto = String(valor ?? '').trim();
    if (!/^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}$/.test(texto)) return false;

    const [data, hora] = texto.split(' ');
    const [ano, mes, dia] = data.split('-').map(Number);
    const [hh, mm, ss] = hora.split(':').map(Number);
    const dt = new Date(ano, mes - 1, dia, hh, mm, ss);

    return dt.getFullYear() === ano
        && dt.getMonth() === mes - 1
        && dt.getDate() === dia
        && dt.getHours() === hh
        && dt.getMinutes() === mm
        && dt.getSeconds() === ss;
}

function dataStatusPermitida(valor) {
    const [data] = String(valor).split(' ');
    const [ano, mes, dia] = data.split('-').map(Number);
    return new Date(ano, mes - 1, dia) >= new Date(2011, 0, 1);
}

const hash = String(item.hash ?? '').trim().toUpperCase();
const idStatus = normalizarInteiro(item.id_status);
const idTipoStatus = normalizarInteiro(item.id_tipo_status);
const dataStatus = String(item.data_status ?? '').trim();
const descricaoStatus = String(item.descricao_status ?? '').trim();
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
} else if (!Number.isFinite(idTipoStatus) || !TIPOS_STATUS_VALIDOS.has(idTipoStatus)) {
    entrada_valida = false;
    codigo_erro = 13;
    mensagem_erro = 'id_tipo_status inválido. Use um valor entre 1 e 13.';
} else if (!dataStatus) {
    entrada_valida = false;
    codigo_erro = 14;
    mensagem_erro = 'data_status é obrigatória.';
} else if (!dataStatusValida(dataStatus)) {
    entrada_valida = false;
    codigo_erro = 15;
    mensagem_erro = 'data_status inválida. Use aaaa-mm-dd hh:mm:ss.';
} else if (!dataStatusPermitida(dataStatus)) {
    entrada_valida = false;
    codigo_erro = 16;
    mensagem_erro = 'data_status inválida: não pode ser anterior a 2011-01-01.';
} else if (!descricaoStatus) {
    entrada_valida = false;
    codigo_erro = 17;
    mensagem_erro = 'descricao_status é obrigatória.';
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
        id: 'a619cdb4-7984-4244-8ce7-6e5c9f0e8b0d',
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
                    id: 'e0f1a2b3-c4d5-4e6f-f7a8-b9c0d1e2f3a4',
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
        id: '6b9f2832-f9db-4326-b435-c3d022372c6e',
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
    <tns:UpdateStatusAT xmlns:tns="http://tempuri.org/WSOficio">
      <tns:oRequest>
        <tns:Hash>\${escapeXml(item.hash)}</tns:Hash>
        <tns:IDStatus>\${item.id_status}</tns:IDStatus>
        <tns:IDTipoStatus>\${item.id_tipo_status}</tns:IDTipoStatus>
        <tns:DataStatus>\${escapeXml(item.data_status)}</tns:DataStatus>
        <tns:DescricaoStatus>\${escapeXml(item.descricao_status)}</tns:DescricaoStatus>
      </tns:oRequest>
    </tns:UpdateStatusAT>
  </soap:Body>
</soap:Envelope>\`;

return [{ json: { ...item, corpo_soap: corpo } }];`,
    };

    @node({
        id: 'b7c0b637-d31f-4a48-a2d7-8642fe78fa7e',
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
        id: '8fc9a6b8-2407-4397-a200-bab519ea8d9b',
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
    if (codigoErro === 30) return 404;
    if (codigoErro === 32 || codigoErro === 50 || codigoErro === 52 || codigoErro === 53) return 403;
    if (codigoErro === 0) return 502;
    if (codigoErro === 1) return 503;
    return 422;
}

function dadosPadrao(sucesso = false) {
    return {
        id_status: entrada.id_status ?? 0,
        id_tipo_status: entrada.id_tipo_status ?? 0,
        data_status: entrada.data_status ?? '',
        descricao_status: entrada.descricao_status ?? '',
        atualizado: sucesso
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
        id: 'bb4f5834-1bc6-4864-ba03-88f0d0ef478e',
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
            id_status: item.id_status ?? 0,
            id_tipo_status: item.id_tipo_status ?? 0,
            data_status: item.data_status ?? '',
            descricao_status: item.descricao_status ?? '',
            atualizado: false
        }
    }
}];`,
    };

    @node({
        id: '24ad0e5f-bc4b-4fd1-8e2b-9dc3677dea55',
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
            id_status: erro.id_status ?? 0,
            id_tipo_status: erro.id_tipo_status ?? 0,
            data_status: erro.data_status ?? '',
            descricao_status: erro.descricao_status ?? '',
            atualizado: false
        }
    }
}];`,
    };

    @node({
        id: 'e59e91a0-2048-4ad3-92f2-e30ad5d1e23b',
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
