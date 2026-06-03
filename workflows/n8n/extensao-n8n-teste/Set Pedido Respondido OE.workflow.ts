import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : [AUTONR-33] (webservice ONR) SetPedidoRespondidoOE - Ofício Eletrônico
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
    id: 'N1epjGzDy1jDti4C',
    name: '[AUTONR-33] (webservice ONR) SetPedidoRespondidoOE - Ofício Eletrônico',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class Autonr33WebserviceOnrSetpedidorespondidooeOficioEletronicoWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: '8c9d0e1f-2a3b-4c5d-9e6f-7a8b9c0d1e2f',
        webhookId: '7b8c9d0e-1f2a-4b3c-8d4e-5f6a7b8c9d0e',
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 0],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    Webhook = {
        httpMethod: 'POST',
        path: '7b8c9d0e-1f2a-4b3c-8d4e-5f6a7b8c9d0e',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: '9d0e1f2a-3b4c-4d6e-8f7a-9b0c1d2e3f4a',
        name: 'normalizar-entrada',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [336, 0],
    })
    NormalizarEntrada = {
        mode: 'raw',
        jsonOutput: `={{
  hash: $json.body.hash ?? '',
  id_pedido: $json.body.id_pedido ?? null,
  resposta: $json.body.resposta ?? '',
  negativa: $json.body.negativa ?? false,
  anexos: $json.body.anexos ?? [],
  url_servico_onr: $json.body.url_servico_onr ?? 'https://hml3-wsoficio.onr.org.br/oficios.asmx'
}}
 `,
        options: {},
    };

    @node({
        id: 'a0b1c2d3-e4f5-4a6b-8c7d-9e0f1a2b3c4d',
        name: 'validar-entrada',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [656, 0],
    })
    ValidarEntrada = {
        jsCode: `const item = $input.first().json;

function parseNegativa(valor) {
    if (valor === true || valor === false) return valor;
    const texto = String(valor ?? '').trim().toLowerCase();
    if (!texto) return false;
    if (['1', 'true', 'yes', 'sim', 's'].includes(texto)) return true;
    if (['0', 'false', 'no', 'nao', 'não', 'n'].includes(texto)) return false;
    return null;
}

function normalizarAnexo(row, index) {
    if (!row || typeof row !== 'object') {
        return { erro: \`anexos[\${index}] deve ser um objeto com nome e url_arquivo.\`, codigo: 14 };
    }

    const nome = String(row.nome ?? row.Nome ?? '').trim();
    const urlArquivo = String(row.url_arquivo ?? row.urlArquivo ?? row.URLArquivo ?? '').trim();

    if (!nome) {
        return { erro: \`anexos[\${index}].nome é obrigatório.\`, codigo: 54 };
    }
    if (!urlArquivo) {
        return { erro: \`anexos[\${index}].url_arquivo é obrigatória.\`, codigo: 55 };
    }
    if (!/^https?:\\/\\//i.test(urlArquivo)) {
        return { erro: \`anexos[\${index}].url_arquivo deve ser uma URL pública http(s).\`, codigo: 102 };
    }

    return { nome, url_arquivo: urlArquivo };
}

const hash = String(item.hash ?? '').trim().toUpperCase();
const idPedido = Number(item.id_pedido);
const resposta = String(item.resposta ?? '').trim();
const negativa = parseNegativa(item.negativa);
const anexosEntrada = Array.isArray(item.anexos) ? item.anexos : [];
const urlServico = String(item.url_servico_onr ?? '').trim();

const anexos = [];
let erroAnexo = null;

for (let i = 0; i < anexosEntrada.length; i++) {
    const anexo = normalizarAnexo(anexosEntrada[i], i);
    if (anexo.erro) {
        erroAnexo = anexo;
        break;
    }
    anexos.push(anexo);
}

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
} else if (!resposta) {
    entrada_valida = false;
    codigo_erro = 13;
    mensagem_erro = 'resposta é obrigatória.';
} else if (negativa === null) {
    entrada_valida = false;
    codigo_erro = 10;
    mensagem_erro = 'negativa inválida. Use true/false ou 1/0.';
} else if (!anexosEntrada.length) {
    entrada_valida = false;
    codigo_erro = 14;
    mensagem_erro = 'Informe ao menos um anexo em anexos.';
} else if (erroAnexo) {
    entrada_valida = false;
    codigo_erro = erroAnexo.codigo;
    mensagem_erro = erroAnexo.erro;
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
        resposta,
        negativa,
        anexos,
        url_servico_onr: urlServico,
        entrada_valida,
        codigo_erro,
        mensagem_erro
    }
}];`,
    };

    @node({
        id: 'b1c2d3e4-f5a6-4b7c-8d9e-0f1a2b3c4d5e',
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
                    id: 'c2d3e4f5-a6b7-4c8d-9e0f-1a2b3c4d5e6',
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
        id: 'd3e4f5a6-b7c8-4d9e-8f0a-1b2c3d4e5f6a',
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

const anexosXml = item.anexos.map((anexo) => \`        <tns:SetPedidoRespondidoOE_Anexo_WSReq>
          <tns:Nome>\${xml(anexo.nome)}</tns:Nome>
          <tns:URLArquivo>\${xml(anexo.url_arquivo)}</tns:URLArquivo>
        </tns:SetPedidoRespondidoOE_Anexo_WSReq>\`).join('\\n');

const corpo = \`<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <tns:SetPedidoRespondidoOE xmlns:tns="http://tempuri.org/WSOficio">
      <tns:oRequest>
        <tns:Hash>\${xml(item.hash)}</tns:Hash>
        <tns:IDPedido>\${item.id_pedido}</tns:IDPedido>
        <tns:Resposta>\${xml(item.resposta)}</tns:Resposta>
        <tns:Negativa>\${item.negativa ? 'true' : 'false'}</tns:Negativa>
        <tns:Anexos>
\${anexosXml}
        </tns:Anexos>
      </tns:oRequest>
    </tns:SetPedidoRespondidoOE>
  </soap:Body>
</soap:Envelope>\`;

return [{ json: { ...item, corpo_soap: corpo } }];`,
    };

    @node({
        id: 'e4f5a6b7-c8d9-4e0f-9a1b-2c3d4e5f6a7b',
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
        id: 'f5a6b7c8-d9e0-4f1a-0b2c-3d4e5f6a7b8c',
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
    if ([2, 10, 11, 12, 13, 14, 54, 55, 501].includes(codigoErro)) return 400;
    if ([45, 46, 47].includes(codigoErro)) return 401;
    if (codigoErro === 52) return 403;
    if ([51, 102].includes(codigoErro)) return 404;
    if (codigoErro === 0) return 502;
    if (codigoErro === 1) return 503;
    if ([53, 56, 60, 101, 103, 104, 105, 502].includes(codigoErro)) return 422;
    return 422;
}

function dadosPadrao(respondido = false) {
    return {
        id_pedido: entrada.id_pedido ?? 0,
        negativa: entrada.negativa ?? false,
        quantidade_anexos: entrada.anexos?.length ?? 0,
        respondido
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
        status_http: mapearStatusHttp(sucesso, codigo_erro),
        sucesso,
        codigo_erro,
        mensagem_erro,
        dados: dadosPadrao(sucesso)
    }
};`,
    };

    @node({
        id: 'a6b7c8d9-e0f1-4a2b-1c3d-e4f5a6b7c8d9',
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
            id_pedido: item.id_pedido ?? 0,
            negativa: item.negativa ?? false,
            quantidade_anexos: item.anexos?.length ?? 0,
            respondido: false
        }
    }
}];`,
    };

    @node({
        id: 'b7c8d9e0-f1a2-4b3c-2d4e-f5a6b7c8d9e0',
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
            id_pedido: erro.id_pedido ?? 0,
            negativa: erro.negativa ?? false,
            quantidade_anexos: erro.anexos?.length ?? 0,
            respondido: false
        }
    }
}];`,
    };

    @node({
        id: 'c8d9e0f1-a2b3-4c4d-3e5f-a6b7c8d9e0f1',
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
