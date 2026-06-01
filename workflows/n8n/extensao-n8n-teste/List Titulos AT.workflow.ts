import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : List Titulos AT
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
    id: 'xEmLaoNHR9WPY7Vg',
    name: 'List Titulos AT',
    active: false,
    isArchived: false,
    projectId: 'PP65Me8T4KDNsx9m',
    settings: { executionOrder: 'v1', binaryMode: 'separate', availableInMCP: false },
})
export class ListTitulosAtWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: '7cf29332-b773-49ac-bd6e-21d9f0ddd80d',
        webhookId: 'f8e2a1b0-9c3d-4e5f-a6b7-8d9e0f1a2b3c',
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [-1296, 128],
    })
    Webhook = {
        httpMethod: 'POST',
        path: 'f8e2a1b0-9c3d-4e5f-a6b7-8d9e0f1a2b3c',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: '5ab23769-2b68-461c-9899-521bdb308a7b',
        name: 'normalizar-entrada',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [-960, 128],
    })
    NormalizarEntrada = {
        mode: 'raw',
        jsonOutput: `={
  "hash": "{{ $json.body.hash }}",
  "max_registros_por_pagina": {{ $json.body.max_registros_por_pagina ?? 50 }},
  "numero_pagina": {{ $json.body.numero_pagina ?? 1 }},
  "data_protocolo_inicio": "{{ $json.body.data_protocolo_inicio }}",
  "data_protocolo_final": "{{ $json.body.data_protocolo_final }}",
  "id_tipo_status": {{ $json.body.id_tipo_status ?? -1 }},
  "exportado": {{ $json.body.exportado ?? -1 }},
  "protocolo": "{{ $json.body.protocolo ?? '' }}",
  "apresentante": "{{ $json.body.apresentante ?? '' }}",
  "url_servico_onr": "{{ $json.body.url_servico_onr ?? 'https://hml3-wsoficio.onr.org.br/acompanhamentotitulos.asmx' }}"
}
 `,
        options: {},
    };

    @node({
        id: 'b7f8a5d5-8470-4099-9580-4b2d9bf710af',
        name: 'validar-entrada',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [-640, 128],
    })
    ValidarEntrada = {
        jsCode: `const item = $input.first().json;

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
const dataInicio = String(item.data_protocolo_inicio ?? '').trim();
const dataFinal = String(item.data_protocolo_final ?? '').trim();
const idTipoStatus = Number(item.id_tipo_status);
const exportado = Number(item.exportado);
const protocolo = String(item.protocolo ?? '').trim();
const apresentante = String(item.apresentante ?? '').trim();
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
} else if (!dataInicio) {
    entrada_valida = false;
    codigo_erro = 14;
    mensagem_erro = 'data_protocolo_inicio é obrigatória (aaaa-mm-dd).';
} else if (!dataFinal) {
    entrada_valida = false;
    codigo_erro = 15;
    mensagem_erro = 'data_protocolo_final é obrigatória (aaaa-mm-dd).';
} else if (!dataValida(dataInicio)) {
    entrada_valida = false;
    codigo_erro = 16;
    mensagem_erro = 'data_protocolo_inicio inválida. Use aaaa-mm-dd.';
} else if (!dataValida(dataFinal)) {
    entrada_valida = false;
    codigo_erro = 17;
    mensagem_erro = 'data_protocolo_final inválida. Use aaaa-mm-dd.';
} else if (parseData(dataFinal) < parseData(dataInicio)) {
    entrada_valida = false;
    codigo_erro = 22;
    mensagem_erro = 'data_protocolo_final deve ser maior ou igual à data_protocolo_inicio.';
} else if (!Number.isFinite(idTipoStatus)) {
    entrada_valida = false;
    codigo_erro = 18;
    mensagem_erro = 'id_tipo_status inválido.';
} else if (!Number.isFinite(exportado)) {
    entrada_valida = false;
    codigo_erro = 19;
    mensagem_erro = 'exportado inválido.';
} else if (protocolo && !/^\\d+$/.test(protocolo)) {
    entrada_valida = false;
    codigo_erro = 20;
    mensagem_erro = 'protocolo inválido: informe apenas números.';
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
        data_protocolo_inicio: dataInicio,
        data_protocolo_final: dataFinal,
        id_tipo_status: idTipoStatus,
        exportado,
        protocolo,
        apresentante,
        url_servico_onr: urlServico,
        entrada_valida,
        codigo_erro,
        mensagem_erro
    }
}];`,
    };

    @node({
        id: 'fe289fb6-8263-4a34-98da-20891cceb1ed',
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
                    id: 'a1b2c3d4-e5f6-7890-abcd-111111111111',
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
        id: 'dea67578-db45-46b1-a4d5-922d4a1e3f32',
        name: 'montar-envelope-soap',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [0, 0],
    })
    MontarEnvelopeSoap = {
        jsCode: `const item = $input.first().json;

let corpo = \`<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <tns:ListTitulosAT xmlns:tns="http://tempuri.org/WSOficio">
      <tns:oRequest>
        <tns:Hash>\${item.hash}</tns:Hash>
        <tns:MaxRowPerPage>\${item.max_registros_por_pagina}</tns:MaxRowPerPage>
        <tns:PageNumber>\${item.numero_pagina}</tns:PageNumber>
        <tns:DataProtocoloInicio>\${item.data_protocolo_inicio}</tns:DataProtocoloInicio>
        <tns:DataProtocoloFinal>\${item.data_protocolo_final}</tns:DataProtocoloFinal>
        <tns:IDTipoStatus>\${item.id_tipo_status}</tns:IDTipoStatus>
        <tns:Exportado>\${item.exportado}</tns:Exportado>\`;

if (item.protocolo) {
    corpo += \`\\n        <tns:Protocolo>\${item.protocolo}</tns:Protocolo>\`;
}
if (item.apresentante) {
    corpo += \`\\n        <tns:Apresentante>\${item.apresentante}</tns:Apresentante>\`;
}

corpo += \`
      </tns:oRequest>
    </tns:ListTitulosAT>
  </soap:Body>
</soap:Envelope>\`;

return [{ json: { ...item, corpo_soap: corpo } }];`,
    };

    @node({
        id: 'b59e560e-da90-4da3-9e67-0d13d9f62017',
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
        id: '4656de12-01f2-43af-b1e2-3ebfc52306be',
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
    if ([2, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22].includes(codigoErro)) return 400;
    if ([45, 46, 47].includes(codigoErro)) return 401;
    if (codigoErro === 51) return 404;
    if (codigoErro === 52 || codigoErro === 53) return 403;
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
            titulos: []
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

const extrairTitulos = (origem) => {
    const titulos = [];
    const regex = /<(?:\\w+:)?ListTitulosAT_Titulos_WSResp[^>]*>([\\s\\S]*?)<\\/(?:\\w+:)?ListTitulosAT_Titulos_WSResp>/g;
    let match;

    while ((match = regex.exec(origem)) !== null) {
        const bloco = match[1];
        titulos.push({
            id_titulo: parseInt(extrairTag('IDTitulo', bloco), 10) || 0,
            apresentante: extrairTag('Apresentante', bloco),
            protocolo: extrairTag('Protocolo', bloco),
            data_ultimo_status: extrairTag('DataUltimoStatus', bloco),
            id_status: parseInt(extrairTag('IDStatus', bloco), 10) || 0,
            id_tipo_status: parseInt(extrairTag('IDTipoStatus', bloco), 10) || 0
        });
    }
    return titulos;
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
            titulos: sucesso ? extrairTitulos(xml) : []
        }
    }
};`,
    };

    @node({
        id: '88e4a6cb-cdb5-471d-9dd7-d1ce89d208a5',
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
            quantidade_registros: 0,
            quantidade_paginas: 0,
            titulos: []
        }
    }
}];`,
    };

    @node({
        id: 'eebd20aa-2ef3-4923-b26d-31a98baf2d2b',
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
            quantidade_registros: 0,
            quantidade_paginas: 0,
            titulos: []
        }
    }
}];`,
    };

    @node({
        id: '75e451c2-9e30-4c79-9926-0b308dc616e7',
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
