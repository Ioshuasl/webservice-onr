import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : List Status AT
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
    id: 'MUChLALDYxCFeeyf',
    name: 'List Status AT',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class ListStatusAtWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'f1a2b3c4-d5e6-4789-a012-3456789abcde',
        webhookId: 'b4c5d6e7-f8a9-4b0c-9d1e-2f3a4b5c6d7e',
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 0],
    })
    Webhook = {
        httpMethod: 'POST',
        path: 'b4c5d6e7-f8a9-4b0c-9d1e-2f3a4b5c6d7e',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'a2b3c4d5-e6f7-4890-b123-456789abcdef',
        name: 'normalizar-entrada',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [336, 0],
    })
    NormalizarEntrada = {
        mode: 'raw',
        jsonOutput: `={
  "hash": "{{ $json.body.hash }}",
  "max_registros_por_pagina": {{ $json.body.max_registros_por_pagina ?? 50 }},
  "numero_pagina": {{ $json.body.numero_pagina ?? 1 }},
  "id_titulo": {{ $json.body.id_titulo }},
  "id_tipo_status": {{ $json.body.id_tipo_status ?? -1 }},
  "data_status_inicio": "{{ $json.body.data_status_inicio ?? '' }}",
  "data_status_final": "{{ $json.body.data_status_final ?? '' }}",
  "url_servico_onr": "{{ $json.body.url_servico_onr ?? 'https://hml3-wsoficio.onr.org.br/acompanhamentotitulos.asmx' }}"
}
 `,
        options: {},
    };

    @node({
        id: 'b3c4d5e6-f7a8-4901-c234-56789abcdef0',
        name: 'validar-entrada',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [656, 0],
    })
    ValidarEntrada = {
        jsCode: `const item = $input.first().json;

const TIPOS_STATUS_VALIDOS = new Set([-1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);

function dataValida(valor) {
    return /^\\d{4}-\\d{2}-\\d{2}$/.test(String(valor ?? '').trim());
}

function parseData(valor) {
    const [y, m, d] = String(valor).trim().split('-').map(Number);
    return new Date(y, m - 1, d);
}

const hash = String(item.hash ?? '').trim().toUpperCase();
const maxRegistros = Number(item.max_registros_por_pagina);
const numeroPagina = Number(item.numero_pagina);
const idTitulo = Number(item.id_titulo);
const idTipoStatus = Number(item.id_tipo_status);
const dataInicio = String(item.data_status_inicio ?? '').trim();
const dataFinal = String(item.data_status_final ?? '').trim();
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
} else if (!Number.isFinite(maxRegistros) || maxRegistros < 10) {
    entrada_valida = false;
    codigo_erro = 12;
    mensagem_erro = 'max_registros_por_pagina inválido: mínimo 10.';
} else if (!Number.isFinite(numeroPagina) || numeroPagina < 1) {
    entrada_valida = false;
    codigo_erro = 13;
    mensagem_erro = 'numero_pagina inválido: mínimo 1.';
} else if (!Number.isFinite(idTitulo) || idTitulo < 1) {
    entrada_valida = false;
    codigo_erro = 14;
    mensagem_erro = 'id_titulo é obrigatório e deve ser um inteiro positivo.';
} else if (!Number.isFinite(idTipoStatus) || !TIPOS_STATUS_VALIDOS.has(idTipoStatus)) {
    entrada_valida = false;
    codigo_erro = 17;
    mensagem_erro = 'id_tipo_status inválido. Use -1 (todos) ou 1–13.';
} else if (dataInicio && !dataValida(dataInicio)) {
    entrada_valida = false;
    codigo_erro = 15;
    mensagem_erro = 'data_status_inicio inválida. Use aaaa-mm-dd.';
} else if (dataFinal && !dataValida(dataFinal)) {
    entrada_valida = false;
    codigo_erro = 16;
    mensagem_erro = 'data_status_final inválida. Use aaaa-mm-dd.';
} else if (dataInicio && dataFinal && parseData(dataFinal) < parseData(dataInicio)) {
    entrada_valida = false;
    codigo_erro = 18;
    mensagem_erro = 'data_status_final deve ser maior ou igual à data_status_inicio.';
} else if (!urlServico) {
    entrada_valida = false;
    codigo_erro = 2;
    mensagem_erro = 'url_servico_onr é obrigatória.';
}

return [{
    json: {
        ...item,
        hash,
        max_registros_por_pagina: maxRegistros,
        numero_pagina: numeroPagina,
        id_titulo: idTitulo,
        id_tipo_status: idTipoStatus,
        data_status_inicio: dataInicio,
        data_status_final: dataFinal,
        url_servico_onr: urlServico,
        entrada_valida,
        codigo_erro,
        mensagem_erro
    }
}];`,
    };

    @node({
        id: 'c4d5e6f7-a8b9-4012-d345-6789abcdef01',
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
                    id: 'd5e6f7a8-b9c0-4123-e456-789abcdef012',
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
        id: 'e6f7a8b9-c0d1-4234-f567-89abcdef0123',
        name: 'montar-envelope-soap',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1296, -128],
    })
    MontarEnvelopeSoap = {
        jsCode: `const item = $input.first().json;

let corpo = \`<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <tns:ListStatusAT xmlns:tns="http://tempuri.org/WSOficio">
      <tns:oRequest>
        <tns:Hash>\${item.hash}</tns:Hash>
        <tns:MaxRowPerPage>\${item.max_registros_por_pagina}</tns:MaxRowPerPage>
        <tns:PageNumber>\${item.numero_pagina}</tns:PageNumber>
        <tns:IDTitulo>\${item.id_titulo}</tns:IDTitulo>
        <tns:IDTipoStatus>\${item.id_tipo_status}</tns:IDTipoStatus>\`;

if (item.data_status_inicio) {
    corpo += \`\\n        <tns:DataStatusInicio>\${item.data_status_inicio}</tns:DataStatusInicio>\`;
}
if (item.data_status_final) {
    corpo += \`\\n        <tns:DataStatusFinal>\${item.data_status_final}</tns:DataStatusFinal>\`;
}

corpo += \`
      </tns:oRequest>
    </tns:ListStatusAT>
  </soap:Body>
</soap:Envelope>\`;

return [{ json: { ...item, corpo_soap: corpo } }];`,
    };

    @node({
        id: 'f7a8b9c0-d1e2-4345-a678-9abcdef01234',
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
        id: 'a8b9c0d1-e2f3-4456-b789-abcdef012345',
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
    if ([2, 10, 11, 12, 13, 14, 15, 16, 17, 18, 25].includes(codigoErro)) return 400;
    if ([45, 46, 47].includes(codigoErro)) return 401;
    if (codigoErro === 51) return 404;
    if (codigoErro === 52 || codigoErro === 53) return 403;
    if (codigoErro === 50) return 403;
    if (codigoErro === 0) return 502;
    if (codigoErro === 1) return 503;
    return 422;
}

function respostaErro(statusHttp, codigoErro, mensagemErro) {
    return {
        status_http: statusHttp,
        sucesso: false,
        codigo_erro: codigoErro,
        mensagem_erro: mensagemErro,
        dados: {
            quantidade_registros: 0,
            quantidade_paginas: 0,
            id_titulo: 0,
            id_cartorio: 0,
            protocolo: '',
            apresentante_nome: '',
            status: []
        }
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

const extrairStatus = (origem) => {
    const lista = [];
    const regex = /<(?:\\w+:)?ListStatusAT_Status_WSResp[^>]*>([\\s\\S]*?)<\\/(?:\\w+:)?ListStatusAT_Status_WSResp>/g;
    let match;

    while ((match = regex.exec(origem)) !== null) {
        const bloco = match[1];
        lista.push({
            id_status: parseInt(extrairTag('IDStatus', bloco), 10) || 0,
            id_tipo_status: parseInt(extrairTag('IDTipoStatus', bloco), 10) || 0,
            data_status: extrairTag('DataStatus', bloco)
        });
    }
    return lista;
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
        dados: {
            quantidade_registros: parseInt(extrairTag('QtdeRegistros', xml), 10) || 0,
            quantidade_paginas: parseInt(extrairTag('QtdePaginas', xml), 10) || 0,
            id_titulo: parseInt(extrairTag('IDTitulo', xml), 10) || 0,
            id_cartorio: parseInt(extrairTag('IDCartorio', xml), 10) || 0,
            protocolo: extrairTag('Protocolo', xml),
            apresentante_nome: extrairTag('ApresentanteNome', xml),
            status: sucesso ? extrairStatus(xml) : []
        }
    }
};`,
    };

    @node({
        id: 'b9c0d1e2-f3a4-4567-c890-abcdef0123456',
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
            quantidade_registros: 0,
            quantidade_paginas: 0,
            id_titulo: 0,
            id_cartorio: 0,
            protocolo: '',
            apresentante_nome: '',
            status: []
        }
    }
}];`,
    };

    @node({
        id: 'c0d1e2f3-a4b5-4678-d901-abcdef01234567',
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
            quantidade_registros: 0,
            quantidade_paginas: 0,
            id_titulo: 0,
            id_cartorio: 0,
            protocolo: '',
            apresentante_nome: '',
            status: []
        }
    }
}];`,
    };

    @node({
        id: 'd1e2f3a4-b5c6-4789-e012-3456789abcdef',
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
