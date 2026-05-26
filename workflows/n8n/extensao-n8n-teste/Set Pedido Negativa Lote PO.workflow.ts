import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : Set Pedido Negativa Lote PO
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
    id: 'cy8zOBAwuY0bXXYP',
    name: 'Set Pedido Negativa Lote PO',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class SetPedidoNegativaLotePoWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'c3d4e5f6-a7b8-49c0-8d1e-f2a3b4c5d6e7',
        webhookId: 'f0a1b2c3-d4e5-4f6a-8b9c-d0e1f2a3b4c6',
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 0],
        credentials: { httpBasicAuth: { id: 'CE3L7VlaRe4klqlk', name: 'ioshua + ioshua123' } },
    })
    Webhook = {
        httpMethod: 'POST',
        path: 'f0a1b2c3-d4e5-4f6a-8b9c-d0e1f2a3b4c6',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'd4e5f6a7-b8c9-40d1-9e2f-a3b4c5d6e7f8',
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
  url_servico_onr: $json.body.url_servico_onr ?? 'https://hml3-wsoficio.onr.org.br/penhoraonline.asmx'
}}
 `,
        options: {},
    };

    @node({
        id: 'e5f6a7b8-c9d0-41e2-af3a-b4c5d6e7f8a9',
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
        return { erro: \`pedidos[\${index}] deve conter IDPedido/id_pedido inteiro positivo.\`, codigo: 151 };
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
        id: 'f6a7b8c9-d0e1-42f3-b0a1-c5d6e7f8a9b0',
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
                    id: 'a7b8c9d0-e1f2-4304-a1b2-d6e7f8a9b0c1',
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
        id: 'b8c9d0e1-f2a3-4415-b2c3-e7f8a9b0c1d2',
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

const pedidosXml = item.pedidos.map((pedido) => \`        <tns:SetPedidoNegativaLotePO_Pedido_WSReq>
          <tns:IDPedido>\${pedido.id_pedido}</tns:IDPedido>
        </tns:SetPedidoNegativaLotePO_Pedido_WSReq>\`).join('\\n');

const corpo = \`<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <tns:SetPedidoNegativaLotePO xmlns:tns="http://tempuri.org/WSOficio">
      <tns:oRequest>
        <tns:Hash>\${xml(item.hash)}</tns:Hash>
        <tns:Pedidos>
\${pedidosXml}
        </tns:Pedidos>
      </tns:oRequest>
    </tns:SetPedidoNegativaLotePO>
  </soap:Body>
</soap:Envelope>\`;

return [{ json: { ...item, corpo_soap: corpo } }];`,
    };

    @node({
        id: 'c9d0e1f2-a3b4-4526-c3d4-f8a9b0c1d2e3',
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
        id: 'd0e1f2a3-b4c5-4637-d4e5-a9b0c1d2e3f4',
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
        dados: { quantidade_pedidos: entrada.pedidos?.length ?? 0, pedidos: [] }
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
    const regex = /<(?:\\w+:)?SetPedidoNegativaLotePO_Pedido_WSResp[^>]*>([\\s\\S]*?)<\\/(?:\\w+:)?SetPedidoNegativaLotePO_Pedido_WSResp>/g;
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
            quantidade_pedidos: pedidos.length || entrada.pedidos?.length || 0,
            quantidade_falhas: pedidosFalha.length,
            pedidos
        }
    }
};`,
    };

    @node({
        id: 'e1f2a3b4-c5d6-4748-e5f6-b0c1d2e3f4a5',
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
            quantidade_pedidos: item.pedidos?.length ?? 0,
            quantidade_falhas: 0,
            pedidos: []
        }
    }
}];`,
    };

    @node({
        id: 'f2a3b4c5-d6e7-4859-f6a7-c1d2e3f4a5b6',
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
            quantidade_pedidos: erro.pedidos?.length ?? 0,
            quantidade_falhas: 0,
            pedidos: []
        }
    }
}];`,
    };

    @node({
        id: 'a3b4c5d6-e7f8-496a-a7b8-d2e3f4a5b6c7',
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
