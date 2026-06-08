import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : [AUTONR-55] (webservice ONR) ObterXMLSolicitacoes - Matricula Online
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
    id: 'IeIifIa6MDnhcKIr',
    name: '[AUTONR-55] (webservice ONR) ObterXMLSolicitacoes - Matricula Online',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class Autonr55WebserviceOnrObterxmlsolicitacoesMatriculaOnlineWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'f7a8b9c0-d1e2-4f3a-8b4c-5d6e7f8a9b0c',
        webhookId: 'a855m001-4b2c-4d5e-9f60-123456789abc',
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 0],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    Webhook = {
        httpMethod: 'POST',
        path: 'a855m001-4b2c-4d5e-9f60-123456789abc',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'b8c9d0e1-f2a3-4b4c-5d6e-7f8a9b0c1d2',
        name: 'normalizar-entrada',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [336, 0],
    })
    NormalizarEntrada = {
        mode: 'raw',
        jsonOutput: `={
  "hash": "{{ $json.body.hash ?? '' }}",
  "protocolo": "{{ $json.body.protocolo ?? '' }}",
  "data_inicial": "{{ $json.body.data_inicial ?? '' }}",
  "data_final": "{{ $json.body.data_final ?? '' }}",
  "id_pedido": "{{ $json.body.id_pedido ?? '' }}",
  "url_servico_onr": "{{ $json.body.url_servico_onr ?? 'https://hml3-wsoficio.onr.org.br/matriculaonline.asmx' }}"
}
 `,
        options: {},
    };

    @node({
        id: 'c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3f',
        name: 'validar-entrada',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [656, 0],
    })
    ValidarEntrada = {
        jsCode: `const item = $input.first().json;

function normalizarCampo(valor) {
    return String(valor ?? '').trim();
}

function dataValida(valor) {
    const texto = normalizarCampo(valor);
    if (!texto) return true;
    if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(texto)) return false;
    const [ano, mes, dia] = texto.split('-').map(Number);
    const data = new Date(ano, mes - 1, dia);
    return data.getFullYear() === ano && data.getMonth() === mes - 1 && data.getDate() === dia;
}

function diasEntre(inicio, fim) {
    const [aY, aM, aD] = inicio.split('-').map(Number);
    const [bY, bM, bD] = fim.split('-').map(Number);
    const a = new Date(aY, aM - 1, aD);
    const b = new Date(bY, bM - 1, bD);
    return Math.round((b.getTime() - a.getTime()) / 86400000);
}

const hash = normalizarCampo(item.hash).toUpperCase();
const protocolo = normalizarCampo(item.protocolo);
const dataInicial = normalizarCampo(item.data_inicial);
const dataFinal = normalizarCampo(item.data_final);
const idPedido = normalizarCampo(item.id_pedido);
const urlServico = normalizarCampo(item.url_servico_onr);

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
} else if (!urlServico) {
    entrada_valida = false;
    codigo_erro = 10;
    mensagem_erro = 'url_servico_onr é obrigatória.';
} else if (idPedido && !/^\\d+$/.test(idPedido)) {
    entrada_valida = false;
    codigo_erro = 13;
    mensagem_erro = 'id_pedido inválido: utilize número inteiro, ex.: 12345.';
} else if ((dataInicial && !dataFinal) || (!dataInicial && dataFinal)) {
    entrada_valida = false;
    codigo_erro = 13;
    mensagem_erro = 'Informe data_inicial e data_final juntas (aaaa-mm-dd).';
} else if (dataInicial && !dataValida(dataInicial)) {
    entrada_valida = false;
    codigo_erro = 13;
    mensagem_erro = 'Formato de data inválido em data_inicial (use aaaa-mm-dd).';
} else if (dataFinal && !dataValida(dataFinal)) {
    entrada_valida = false;
    codigo_erro = 13;
    mensagem_erro = 'Formato de data inválido em data_final (use aaaa-mm-dd).';
} else if (dataInicial && dataFinal && diasEntre(dataInicial, dataFinal) > 30) {
    entrada_valida = false;
    codigo_erro = 13;
    mensagem_erro = 'Intervalo entre data_inicial e data_final deve ser menor ou igual a 30 dias.';
} else if (dataInicial && dataFinal && diasEntre(dataInicial, dataFinal) < 0) {
    entrada_valida = false;
    codigo_erro = 13;
    mensagem_erro = 'data_final deve ser igual ou posterior a data_inicial.';
}

return [{
    json: {
        hash,
        protocolo,
        data_inicial: dataInicial,
        data_final: dataFinal,
        id_pedido: idPedido,
        url_servico_onr: urlServico,
        entrada_valida,
        codigo_erro,
        mensagem_erro
    }
}];`,
    };

    @node({
        id: 'd0e1f2a3-b4c5-4d6e-7f8a-9b0c1d2e3f4a',
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
                    id: 'e1f2a3b4-c5d6-4e7f-8a9b-0c1d2e3f4a5b',
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
        id: 'f2a3b4c5-d6e7-4f8a-9b0c-1d2e3f4a5b6c',
        name: 'montar-envelope-soap',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1296, -128],
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
    <tns:ObterXmlSolicitacoes xmlns:tns="http://tempuri.org/WSOficio">
      <tns:oRequest>
        <tns:Hash>\${escapeXml(item.hash)}</tns:Hash>
        <tns:Protocolo>\${escapeXml(item.protocolo)}</tns:Protocolo>
        <tns:DataInicial>\${escapeXml(item.data_inicial)}</tns:DataInicial>
        <tns:DataFinal>\${escapeXml(item.data_final)}</tns:DataFinal>
        <tns:idPedido>\${escapeXml(item.id_pedido)}</tns:idPedido>
      </tns:oRequest>
    </tns:ObterXmlSolicitacoes>
  </soap:Body>
</soap:Envelope>\`;

return [{ json: { ...item, corpo_soap: corpo } }];`,
    };

    @node({
        id: 'a3b4c5d6-e7f8-4a9b-0c1d-2e3f4a5b6c7d',
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
        rawContentType: 'text/xml; charset=utf-8',
        body: '={{ $json.corpo_soap }}',
        options: {
            timeout: 120000,
        },
    };

    @node({
        id: 'b4c5d6e7-f8a9-4b0c-1d2e-3f4a5b6c7d8e',
        name: 'converter-resposta-onr',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1936, -128],
    })
    ConverterRespostaOnr = {
        jsCode: `const entrada = $input.first().json;
const xmlResposta = entrada.data;

function mapearStatusHttp(sucesso, codigoErro, origem = 'onr') {
    if (sucesso) return 200;
    if (origem === 'validacao') return 400;
    if ([2, 10, 11, 12, 13].includes(codigoErro)) return 400;
    if (codigoErro === 14) return 404;
    if ([45, 46, 47].includes(codigoErro)) return 401;
    if (codigoErro === 0) return 502;
    if (codigoErro === 1) return 503;
    return 422;
}

function decodeXmlEntities(texto) {
    let s = String(texto ?? '');
    let prev;
    do {
        prev = s;
        s = s
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&apos;/g, "'")
            .replace(/&amp;/g, '&');
    } while (s !== prev);
    return s;
}

function tagParaSnake(tag) {
    return String(tag).toLowerCase();
}

function extrairProximoElemento(xml, pos) {
    const start = xml.indexOf('<', pos);
    if (start < 0) return null;

    if (xml[start + 1] === '/' || xml[start + 1] === '?' || xml[start + 1] === '!') {
        const fim = xml.indexOf('>', start);
        return extrairProximoElemento(xml, fim >= 0 ? fim + 1 : xml.length);
    }

    const tagMatch = xml.slice(start).match(/^<([\\w]+)(\\s[^>]*)?>/);
    if (!tagMatch) return null;

    const tag = tagMatch[1];
    const selfClose = tagMatch[0].endsWith('/>');

    if (selfClose) {
        return { tag, inner: '', hasChildren: false, end: start + tagMatch[0].length };
    }

    const closeStr = \`</\${tag}>\`;
    let depth = 0;
    let search = start;
    let endIdx = -1;

    while (search < xml.length) {
        const nextOpen = xml.indexOf(\`<\${tag}\`, search);
        const nextClose = xml.indexOf(closeStr, search);
        if (nextClose < 0) break;

        let isOpen = false;
        if (nextOpen >= 0 && nextOpen < nextClose) {
            const afterTag = xml[nextOpen + tag.length + 1];
            if (afterTag !== '/') isOpen = true;
        }

        if (isOpen && (depth > 0 || nextOpen !== start)) {
            depth += 1;
            search = nextOpen + 1;
            continue;
        }

        if (depth > 0) {
            depth -= 1;
            search = nextClose + closeStr.length;
            continue;
        }

        endIdx = nextClose + closeStr.length;
        break;
    }

    if (endIdx < 0) return null;

    const chunk = xml.slice(start, endIdx);
    const innerMatch = chunk.match(new RegExp(\`^<\${tag}(?:\\\\s[^>]*)?>([\\\\s\\\\S]*)</\${tag}>$\`));
    const inner = innerMatch ? innerMatch[1] : '';
    const hasChildren = /<[\\w]+/.test(inner);

    return { tag, inner, hasChildren, end: endIdx };
}

function xmlBlocoParaObjeto(xml) {
    const resultado = {};
    let pos = 0;

    while (pos < xml.length) {
        const el = extrairProximoElemento(xml, pos);
        if (!el) break;

        const chave = tagParaSnake(el.tag);
        const valor = el.hasChildren ? xmlBlocoParaObjeto(el.inner) : el.inner.trim();

        if (resultado[chave] === undefined) {
            resultado[chave] = valor;
        } else if (!Array.isArray(resultado[chave])) {
            resultado[chave] = [resultado[chave], valor];
        } else {
            resultado[chave].push(valor);
        }

        pos = el.end;
    }

    return resultado;
}

function parseXmlMatriculaExport(xmlExport) {
    if (!xmlExport || typeof xmlExport !== 'string') return null;

    const xml = decodeXmlEntities(xmlExport);
    const rootMatch = xml.match(/<ROOT>([\\s\\S]*)<\\/ROOT>/i);
    const conteudo = rootMatch ? rootMatch[1] : xml;
    const pedidos = [];
    let pos = 0;

    while (pos < conteudo.length) {
        const el = extrairProximoElemento(conteudo, pos);
        if (!el) break;
        if (el.tag.toUpperCase() === 'PEDIDO') {
            pedidos.push(xmlBlocoParaObjeto(el.inner));
        }
        pos = el.end;
    }

    return { pedidos };
}

function dadosPadrao(sucesso = false, xmlExport = '', linhaDigitavel = '') {
    return {
        protocolo: entrada.protocolo ?? '',
        data_inicial: entrada.data_inicial ?? '',
        data_final: entrada.data_final ?? '',
        id_pedido: entrada.id_pedido ?? '',
        xml: sucesso ? xmlExport : '',
        linha_digitavel: sucesso ? linhaDigitavel : '',
        tamanho_xml: sucesso ? xmlExport.length : 0,
        xml_matricula_json: sucesso && xmlExport ? parseXmlMatriculaExport(xmlExport) : null
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

if (!xmlResposta || typeof xmlResposta !== 'string') {
    return { json: respostaErro(502, 0, 'Resposta inválida da ONR: XML não encontrado.') };
}

const extrairTag = (tag, origem) => {
    const regex = new RegExp(\`<(?:\\\\w+:)?\${tag}>(.*?)</(?:\\\\w+:)?\${tag}>\`, 'is');
    const match = origem.match(regex);
    return match ? decodeXmlEntities(match[1].trim()) : '';
};

const sucesso = extrairTag('RETORNO', xmlResposta).toLowerCase() === 'true';
const codigo_erro = parseInt(extrairTag('CODIGOERRO', xmlResposta) || '0', 10);
const mensagem_erro = extrairTag('ERRODESCRICAO', xmlResposta);
const xmlExport = sucesso ? (extrairTag('Xml', xmlResposta) || extrairTag('XML', xmlResposta)) : '';
const linhaDigitavel = sucesso ? extrairTag('LinhaDigitavel', xmlResposta) : '';

if (sucesso && !xmlExport) {
    return {
        json: respostaErro(502, 0, 'RETORNO=true mas XML de matrícula vazio.')
    };
}

return {
    json: {
        status_http: mapearStatusHttp(sucesso, codigo_erro, 'onr'),
        sucesso,
        codigo_erro,
        mensagem_erro,
        dados: dadosPadrao(sucesso, xmlExport, linhaDigitavel)
    }
};`,
    };

    @node({
        id: 'c5d6e7f8-a9b0-4c1d-2e3f-4a5b6c7d8e9f',
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
            protocolo: item.protocolo ?? '',
            data_inicial: item.data_inicial ?? '',
            data_final: item.data_final ?? '',
            id_pedido: item.id_pedido ?? '',
            xml: '',
            linha_digitavel: '',
            tamanho_xml: 0,
            xml_matricula_json: null
        }
    }
}];`,
    };

    @node({
        id: 'd6e7f809-ab01-4d2e-3f4a-5b6c7d8e9f0a',
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
            protocolo: erro.protocolo ?? '',
            data_inicial: erro.data_inicial ?? '',
            data_final: erro.data_final ?? '',
            id_pedido: erro.id_pedido ?? '',
            xml: '',
            linha_digitavel: '',
            tamanho_xml: 0,
            xml_matricula_json: null
        }
    }
}];`,
    };

    @node({
        id: 'e7f8091a-bc02-4e3f-4a5b-6c7d8e9f0a1b',
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
