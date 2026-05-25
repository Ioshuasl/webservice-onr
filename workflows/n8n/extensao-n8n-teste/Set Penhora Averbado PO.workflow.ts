import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : Set Penhora Averbado PO
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
    id: 'JOrrjEb379A0TaEz',
    name: 'Set Penhora Averbado PO',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class SetPenhoraAverbadoPoWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'e1f2a3b4-c5d6-4e7f-8a9b-c0d1e2f3a4b5',
        webhookId: 'f1a2b3c4-d5e6-4f7a-8b9c-d0e1f2a3b4c5',
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 0],
        credentials: { httpBasicAuth: { id: 'CE3L7VlaRe4klqlk', name: 'ioshua + ioshua123' } },
    })
    Webhook = {
        httpMethod: 'POST',
        path: 'f1a2b3c4-d5e6-4f7a-8b9c-d0e1f2a3b4c5',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'f2a3b4c5-d6e7-4f8a-9b0c-d1e2f3a4b5c6',
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
  certidoes: $json.body.certidoes ?? $json.body.certidao_penhora ?? [],
  url_servico_onr: $json.body.url_servico_onr ?? 'https://hml3-wsoficio.onr.org.br/penhoraonline.asmx'
}}
 `,
        options: {},
    };

    @node({
        id: 'a3b4c5d6-e7f8-4091-a2b3-c4d5e6f7a8b9',
        name: 'validar-entrada',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [656, 0],
    })
    ValidarEntrada = {
        jsCode: `const item = $input.first().json;

const hash = String(item.hash ?? '').trim().toUpperCase();
const idPedido = Number(item.id_pedido);
const resposta = String(item.resposta ?? '').trim();
const urlServico = String(item.url_servico_onr ?? '').trim();
const certidoesEntrada = Array.isArray(item.certidoes) ? item.certidoes : [];

let entrada_valida = true;
let codigo_erro = 0;
let mensagem_erro = '';

function normalizarCertidao(row, index) {
    if (!row || typeof row !== 'object') {
        return { erro: \`certidoes[\${index}] deve ser um objeto com matricula e url_arquivo.\` };
    }

    const matricula = String(row.matricula ?? row.Matricula ?? '').trim();
    const urlArquivo = String(row.url_arquivo ?? row.urlArquivo ?? row.URLArquivo ?? '').trim();

    if (!matricula) {
        return { erro: \`certidoes[\${index}].matricula e obrigatoria.\`, codigo: 58 };
    }
    if (!urlArquivo) {
        return { erro: \`certidoes[\${index}].url_arquivo e obrigatoria.\`, codigo: 501 };
    }
    if (!/^https?:\\/\\//i.test(urlArquivo)) {
        return { erro: \`certidoes[\${index}].url_arquivo deve ser uma URL publica http(s).\`, codigo: 102 };
    }

    return { matricula, url_arquivo: urlArquivo };
}

const certidoes = [];
const matriculas = new Set();
let erroCertidao = null;

for (let i = 0; i < certidoesEntrada.length; i++) {
    const certidao = normalizarCertidao(certidoesEntrada[i], i);
    if (certidao.erro) {
        erroCertidao = certidao;
        break;
    }

    if (matriculas.has(certidao.matricula)) {
        erroCertidao = {
            codigo: 59,
            erro: 'Existe mais de uma certidao para uma ou mais matriculas. Envie apenas um arquivo por matricula.'
        };
        break;
    }

    matriculas.add(certidao.matricula);
    certidoes.push(certidao);
}

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
} else if (!certidoesEntrada.length) {
    entrada_valida = false;
    codigo_erro = 14;
    mensagem_erro = 'Informe ao menos uma certidao em certidoes.';
} else if (erroCertidao) {
    entrada_valida = false;
    codigo_erro = erroCertidao.codigo ?? 14;
    mensagem_erro = erroCertidao.erro;
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
        certidoes,
        url_servico_onr: urlServico,
        entrada_valida,
        codigo_erro,
        mensagem_erro
    }
}];`,
    };

    @node({
        id: 'b4c5d6e7-f8a9-4102-b3c4-d5e6f7a8b9c0',
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
                    id: 'c5d6e7f8-a9b0-4213-c4d5-e6f7a8b9c0d1',
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
        id: 'd6e7f8a9-b0c1-4324-d5e6-f7a8b9c0d1e2',
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

const certidoesXml = item.certidoes.map((certidao) => \`        <tns:SetPenhoraAverbadoPO_Certidao_WSReq>
          <tns:Matricula>\${xml(certidao.matricula)}</tns:Matricula>
          <tns:URLArquivo>\${xml(certidao.url_arquivo)}</tns:URLArquivo>
        </tns:SetPenhoraAverbadoPO_Certidao_WSReq>\`).join('\\n');

const corpo = \`<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <tns:SetPenhoraAverbadoPO xmlns:tns="http://tempuri.org/WSOficio">
      <tns:oRequest>
        <tns:Hash>\${xml(item.hash)}</tns:Hash>
        <tns:IDPedido>\${item.id_pedido}</tns:IDPedido>
        <tns:Resposta>\${xml(item.resposta)}</tns:Resposta>
        <tns:CertidaoPenhora>
\${certidoesXml}
        </tns:CertidaoPenhora>
      </tns:oRequest>
    </tns:SetPenhoraAverbadoPO>
  </soap:Body>
</soap:Envelope>\`;

return [{ json: { ...item, corpo_soap: corpo } }];`,
    };

    @node({
        id: 'e7f8a9b0-c1d2-4435-e6f7-a8b9c0d1e2f3',
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
        id: 'f8a9b0c1-d2e3-4546-f7a8-b9c0d1e2f3a4',
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
    if ([10, 11, 12, 13, 14, 58, 59, 104, 501].includes(codigoErro)) return 400;
    if ([45, 46, 47].includes(codigoErro)) return 401;
    if (codigoErro === 52) return 403;
    if ([51, 57, 102].includes(codigoErro)) return 404;
    if (codigoErro === 55 || codigoErro === 502) return 409;
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
            quantidade_certidoes: entrada.certidoes?.length ?? 0,
            penhora_averbada: false
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
            quantidade_certidoes: entrada.certidoes?.length ?? 0,
            penhora_averbada: sucesso
        }
    }
};`,
    };

    @node({
        id: 'a9b0c1d2-e3f4-4657-a8b9-c0d1e2f3a4b5',
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
            quantidade_certidoes: item.certidoes?.length ?? 0,
            penhora_averbada: false
        }
    }
}];`,
    };

    @node({
        id: 'b0c1d2e3-f4a5-4768-b9c0-d1e2f3a4b5c6',
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
            quantidade_certidoes: erro.certidoes?.length ?? 0,
            penhora_averbada: false
        }
    }
}];`,
    };

    @node({
        id: 'c1d2e3f4-a5b6-4879-c0d1-e2f3a4b5c6d7',
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
