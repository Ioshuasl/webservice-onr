import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : Set Pedido Negativa Lote OE
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
    id: 'ergNGHwTWWl6rPpa',
    name: 'Set Pedido Negativa Lote OE',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class SetPedidoNegativaLoteOeWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'a4c5d6e7-f8a9-40b1-c2d3-e4f5a6b7c8d9',
        webhookId: 'e6f7a8b9-c0d1-4e2f-b3a4-c5d6e7f8a9b0',
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 0],
        credentials: { httpBasicAuth: { id: 'CE3L7VlaRe4klqlk', name: 'ioshua + ioshua123' } },
    })
    Webhook = {
        httpMethod: 'POST',
        path: 'e6f7a8b9-c0d1-4e2f-b3a4-c5d6e7f8a9b0',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'b5d6e7f8-a9b0-41c2-d3e4-f5a6b7c8d9e0',
        name: 'normalizar-entrada',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [336, 0],
    })
    NormalizarEntrada = {
        mode: 'raw',
        jsonOutput: `={{
  hash: $json.body.hash ?? '',
  pedidos: $json.body.pedidos ?? [],
  url_servico_onr: $json.body.url_servico_onr ?? 'https://hml3-wsoficio.onr.org.br/oficios.asmx'
}}
 `,
        options: {},
    };

    @node({
        id: 'c6e7f8a9-b0c1-42d3-e4f5-a6b7c8d9e0f1',
        name: 'validar-entrada',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [656, 0],
    })
    ValidarEntrada = {
        jsCode: `const item = $input.first().json;

function normalizarPedido(valor, index) {
    const bruto = valor && typeof valor === 'object'
        ? (valor.id_pedido ?? valor.idPedido ?? valor.IDPedido)
        : valor;
    const numero = Number(bruto);

    if (!Number.isInteger(numero) || numero < 1) {
        return { erro: \`pedidos[\${index}] deve conter id_pedido inteiro positivo.\`, codigo: 151 };
    }

    return { id_pedido: numero };
}

const hash = String(item.hash ?? '').trim().toUpperCase();
const pedidosEntrada = Array.isArray(item.pedidos) ? item.pedidos : [];
const urlServico = String(item.url_servico_onr ?? '').trim();

const pedidos = [];
const ids = new Set();
let erroPedido = null;

for (let i = 0; i < pedidosEntrada.length; i++) {
    const pedido = normalizarPedido(pedidosEntrada[i], i);
    if (pedido.erro) {
        erroPedido = pedido;
        break;
    }
    if (ids.has(pedido.id_pedido)) {
        erroPedido = { erro: \`pedidos[\${i}] duplicado: \${pedido.id_pedido}.\`, codigo: 10 };
        break;
    }
    ids.add(pedido.id_pedido);
    pedidos.push(pedido);
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
} else if (!pedidosEntrada.length) {
    entrada_valida = false;
    codigo_erro = 12;
    mensagem_erro = 'Informe ao menos um pedido em pedidos.';
} else if (erroPedido) {
    entrada_valida = false;
    codigo_erro = erroPedido.codigo;
    mensagem_erro = erroPedido.erro;
} else if (!urlServico) {
    entrada_valida = false;
    codigo_erro = 10;
    mensagem_erro = 'url_servico_onr é obrigatória.';
}

return [{
    json: {
        ...item,
        hash,
        pedidos,
        url_servico_onr: urlServico,
        entrada_valida,
        codigo_erro,
        mensagem_erro
    }
}];`,
    };

    @node({
        id: 'd7f8a9b0-c1d2-43e4-f5a6-b7c8d9e0f1a2',
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
                    id: 'e8a9b0c1-d2e3-44f5-a6b7-c8d9e0f1a2b3',
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
        id: 'f9b0c1d2-e3f4-45a6-b7c8-d9e0f1a2b3c4',
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

const pedidosXml = item.pedidos
    .map((pedido) => \`          <tns:int>\${pedido.id_pedido}</tns:int>\`)
    .join('\\n');

const corpo = \`<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <tns:SetPedidoNegativaLoteOE xmlns:tns="http://tempuri.org/WSOficio">
      <tns:oRequest>
        <tns:Hash>\${xml(item.hash)}</tns:Hash>
        <tns:Pedidos>
\${pedidosXml}
        </tns:Pedidos>
      </tns:oRequest>
    </tns:SetPedidoNegativaLoteOE>
  </soap:Body>
</soap:Envelope>\`;

return [{ json: { ...item, corpo_soap: corpo } }];`,
    };

    @node({
        id: 'a0c1d2e3-f4a5-46b7-c8d9-e0f1a2b3c4d5',
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
        id: 'b1d2e3f4-a5b6-47c8-d9e0-f1a2b3c4d5e6',
        name: 'converter-resposta-onr',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1936, -128],
    })
    ConverterRespostaOnr = {
        jsCode: `const entrada = $input.first().json;
const xml = entrada.data;

function mapearStatusHttp(sucesso, codigoErro, pedidosFalha = []) {
    if (sucesso && pedidosFalha.length === 0) return 200;
    if ([2, 10, 11, 12].includes(codigoErro)) return 400;
    if ([45, 46, 47].includes(codigoErro)) return 401;
    if (codigoErro === 0) return 502;
    if (codigoErro === 1) return 503;

    const primeiroCodigoPedido = pedidosFalha[0]?.codigo_erro ?? 0;
    if (primeiroCodigoPedido === 151) return 400;
    if (primeiroCodigoPedido === 152) return 404;
    if (primeiroCodigoPedido === 153) return 403;
    return 422;
}

function respostaErro(statusHttp, codigoErro, mensagemErro) {
    return {
        status_http: statusHttp,
        sucesso: false,
        codigo_erro: codigoErro,
        mensagem_erro: mensagemErro,
        dados: { operacao_soap: 'SetPedidoNegativaLoteOE', quantidade_pedidos: entrada.pedidos?.length ?? 0, pedidos: [] }
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

const extrairPedidos = (origem) => {
    const pedidos = [];
    const regex = /<(?:\\w+:)?SetPedidoNegativaLoteOE_Pedido_WSResp[^>]*>([\\s\\S]*?)<\\/(?:\\w+:)?SetPedidoNegativaLoteOE_Pedido_WSResp>/g;
    let match;

    while ((match = regex.exec(origem)) !== null) {
        const bloco = match[1];
        pedidos.push({
            id_pedido: parseInt(extrairTag('IDPedido', bloco), 10) || 0,
            sucesso: extrairTag('RETORNO', bloco) === 'true',
            codigo_erro: parseInt(extrairTag('CODIGOERRO', bloco) || '0', 10),
            mensagem_erro: extrairTag('ERRODESCRICAO', bloco)
        });
    }

    return pedidos;
};

const sucessoGlobal = extrairTag('RETORNO', xml) === 'true';
const codigo_erro_global = parseInt(extrairTag('CODIGOERRO', xml) || '0', 10);
const mensagem_erro_global = extrairTag('ERRODESCRICAO', xml);
const pedidos = extrairPedidos(xml);
const pedidosFalha = pedidos.filter((pedido) => !pedido.sucesso);
const sucesso = sucessoGlobal && pedidosFalha.length === 0;
const codigo_erro = sucesso ? 0 : (codigo_erro_global || pedidosFalha[0]?.codigo_erro || 0);
const mensagem_erro = sucesso
    ? ''
    : (mensagem_erro_global || (pedidosFalha.length ? \`\${pedidosFalha.length} pedido(s) com falha no lote.\` : 'Falha ao negativar lote de pedidos.'));

return {
    json: {
        status_http: mapearStatusHttp(sucessoGlobal, codigo_erro_global, pedidosFalha),
        sucesso,
        codigo_erro,
        mensagem_erro,
        dados: {
            operacao_soap: 'SetPedidoNegativaLoteOE',
            quantidade_pedidos: pedidos.length || entrada.pedidos?.length || 0,
            quantidade_falhas: pedidosFalha.length,
            pedidos
        }
    }
};`,
    };

    @node({
        id: 'c2e3f4a5-b6c7-48d9-e0f1-a2b3c4d5e6f7',
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
            operacao_soap: 'SetPedidoNegativaLoteOE',
            quantidade_pedidos: item.pedidos?.length ?? 0,
            quantidade_falhas: 0,
            pedidos: []
        }
    }
}];`,
    };

    @node({
        id: 'd3f4a5b6-c7d8-49e0-f1a2-b3c4d5e6f7a8',
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
            operacao_soap: 'SetPedidoNegativaLoteOE',
            quantidade_pedidos: erro.pedidos?.length ?? 0,
            quantidade_falhas: 0,
            pedidos: []
        }
    }
}];`,
    };

    @node({
        id: 'e4a5b6c7-d8e9-40f1-a2b3-c4d5e6f7a8b9',
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
