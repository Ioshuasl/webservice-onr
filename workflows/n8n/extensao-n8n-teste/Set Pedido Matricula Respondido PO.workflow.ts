import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : Set Pedido Matricula Respondido PO
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
    id: 'oPmLiNkrWez18FPW',
    name: 'Set Pedido Matricula Respondido PO',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class SetPedidoMatriculaRespondidoPoWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'd3e4f5a6-b7c8-49d0-a1b2-c3d4e5f6a7c9',
        webhookId: 'c3d4e5f6-a7b8-49c0-8d9e-f0a1b2c3d4e5',
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 0],
        credentials: { httpBasicAuth: { id: 'CE3L7VlaRe4klqlk', name: 'ioshua + ioshua123' } },
    })
    Webhook = {
        httpMethod: 'POST',
        path: 'c3d4e5f6-a7b8-49c0-8d9e-f0a1b2c3d4e5',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'e4f5a6b7-c8d9-40e1-b2c3-d4e5f6a7b8d0',
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
  anexos: $json.body.anexos ?? [],
  url_servico_onr: $json.body.url_servico_onr ?? 'https://hml3-wsoficio.onr.org.br/penhoraonline.asmx'
}}
 `,
        options: {},
    };

    @node({
        id: 'f5a6b7c8-d9e0-41f2-a3b4-c5d6e7f8a9e1',
        name: 'validar-entrada',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [656, 0],
    })
    ValidarEntrada = {
        jsCode: `const item = $input.first().json;

function normalizarAnexo(row, index) {
    if (!row || typeof row !== 'object') {
        return { erro: \`anexos[\${index}] deve ser um objeto com matricula e url_arquivo.\`, codigo: 14 };
    }

    const matricula = String(row.matricula ?? row.Matricula ?? '').trim();
    const urlArquivo = String(row.url_arquivo ?? row.urlArquivo ?? row.URLArquivo ?? '').trim();

    if (!matricula) {
        return { erro: \`anexos[\${index}].matricula e obrigatoria.\`, codigo: 54 };
    }
    if (!urlArquivo) {
        return { erro: \`anexos[\${index}].url_arquivo e obrigatoria.\`, codigo: 55 };
    }
    if (!/^https?:\\/\\//i.test(urlArquivo)) {
        return { erro: \`anexos[\${index}].url_arquivo deve ser uma URL publica http(s).\`, codigo: 102 };
    }

    return { matricula, url_arquivo: urlArquivo };
}

const hash = String(item.hash ?? '').trim().toUpperCase();
const idPedido = Number(item.id_pedido);
const resposta = String(item.resposta ?? '').trim();
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
    mensagem_erro = 'O hash de validacao nao foi informado.';
} else if (!/^[0-9A-F]{40}$/.test(hash)) {
    entrada_valida = false;
    codigo_erro = 11;
    mensagem_erro = 'Hash invalido: informe 40 caracteres hexadecimais maiusculos.';
} else if (!Number.isInteger(idPedido) || idPedido < 1) {
    entrada_valida = false;
    codigo_erro = 12;
    mensagem_erro = 'id_pedido e obrigatorio e deve ser um inteiro positivo.';
} else if (!resposta) {
    entrada_valida = false;
    codigo_erro = 13;
    mensagem_erro = 'resposta e obrigatoria.';
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
    mensagem_erro = 'url_servico_onr e obrigatoria.';
}

return [{
    json: {
        ...item,
        hash,
        id_pedido: idPedido,
        resposta,
        anexos,
        url_servico_onr: urlServico,
        entrada_valida,
        codigo_erro,
        mensagem_erro
    }
}];`,
    };

    @node({
        id: 'a6b7c8d9-e0f1-4203-b4c5-d6e7f8a9b0f2',
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
                    id: 'b7c8d9e0-f1a2-4314-c5d6-e7f8a9b0c1a3',
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
        id: 'c8d9e0f1-a2b3-4425-d6e7-f8a9b0c1d2b4',
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

const anexosXml = item.anexos.map((anexo) => \`        <tns:SetPedidoMatriculaRespondidoPO_Anexo_WSReq>
          <tns:Matricula>\${xml(anexo.matricula)}</tns:Matricula>
          <tns:URLArquivo>\${xml(anexo.url_arquivo)}</tns:URLArquivo>
        </tns:SetPedidoMatriculaRespondidoPO_Anexo_WSReq>\`).join('\\n');

const corpo = \`<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <tns:SetPedidoMatriculaRespondidoPO xmlns:tns="http://tempuri.org/WSOficio">
      <tns:oRequest>
        <tns:Hash>\${xml(item.hash)}</tns:Hash>
        <tns:IDPedido>\${item.id_pedido}</tns:IDPedido>
        <tns:Resposta>\${xml(item.resposta)}</tns:Resposta>
        <tns:Anexos>
\${anexosXml}
        </tns:Anexos>
      </tns:oRequest>
    </tns:SetPedidoMatriculaRespondidoPO>
  </soap:Body>
</soap:Envelope>\`;

return [{ json: { ...item, corpo_soap: corpo } }];`,
    };

    @node({
        id: 'd9e0f1a2-b3c4-4536-e7f8-a9b0c1d2e3c5',
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
        id: 'e0f1a2b3-c4d5-4647-f8a9-b0c1d2e3f4d6',
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
    if ([10, 11, 12, 13, 14, 54, 55, 104, 501].includes(codigoErro)) return 400;
    if ([45, 46, 47].includes(codigoErro)) return 401;
    if (codigoErro === 52) return 403;
    if ([51, 102].includes(codigoErro)) return 404;
    if (codigoErro === 502) return 409;
    if (codigoErro === 0 || codigoErro === 60 || codigoErro === 103) return 502;
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
            id_pedido: entrada.id_pedido ?? 0,
            quantidade_anexos: entrada.anexos?.length ?? 0,
            pedido_matricula_respondido: false
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

return {
    json: {
        status_http: mapearStatusHttp(sucesso, codigo_erro),
        sucesso,
        codigo_erro,
        mensagem_erro,
        dados: {
            id_pedido: entrada.id_pedido ?? 0,
            quantidade_anexos: entrada.anexos?.length ?? 0,
            pedido_matricula_respondido: sucesso
        }
    }
};`,
    };

    @node({
        id: 'f1a2b3c4-d5e6-4758-a9b0-c1d2e3f4a5e7',
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
            quantidade_anexos: item.anexos?.length ?? 0,
            pedido_matricula_respondido: false
        }
    }
}];`,
    };

    @node({
        id: 'a2b3c4d5-e6f7-4869-b0c1-d2e3f4a5b6f8',
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
            quantidade_anexos: erro.anexos?.length ?? 0,
            pedido_matricula_respondido: false
        }
    }
}];`,
    };

    @node({
        id: 'b3c4d5e6-f7a8-497a-c1d2-e3f4a5b6c7a9',
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
