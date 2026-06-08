import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : [AUTONR-56] (webservice ONR) ObterXMLSolicitacoesV2 - Matricula Online
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
    id: '4PbucfLfZggmCn8b',
    name: '[AUTONR-56] (webservice ONR) ObterXMLSolicitacoesV2 - Matricula Online',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class Autonr56WebserviceOnrObterxmlsolicitacoesv2MatriculaOnlineWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'a856m002-d1e2-4f3a-8b4c-5d6e7f8a9b0c',
        webhookId: 'b856m002-5c3d-4e6f-0a71-234567890def',
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 0],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    Webhook = {
        httpMethod: 'POST',
        path: 'b856m002-5c3d-4e6f-0a71-234567890def',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'b956m002-e2f3-4a4b-5c6d-7e8f9a0b1c2d',
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
        id: 'c056m002-f3a4-4b5c-6d7e-8f9a0b1c2d3e',
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
        id: 'd156m002-a4b5-4c6d-7e8f-9a0b1c2d3e4f',
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
                    id: 'e256m002-b5c6-4d7e-8f9a-0b1c2d3e4f5a',
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
        id: 'f356m002-c6d7-4e8f-9a0b-1c2d3e4f5a6b',
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
    <tns:ObterXmlSolicitacoesV2 xmlns:tns="http://tempuri.org/WSOficio">
      <tns:oRequest>
        <tns:Hash>\${escapeXml(item.hash)}</tns:Hash>
        <tns:Protocolo>\${escapeXml(item.protocolo)}</tns:Protocolo>
        <tns:DataInicial>\${escapeXml(item.data_inicial)}</tns:DataInicial>
        <tns:DataFinal>\${escapeXml(item.data_final)}</tns:DataFinal>
        <tns:idPedido>\${escapeXml(item.id_pedido)}</tns:idPedido>
      </tns:oRequest>
    </tns:ObterXmlSolicitacoesV2>
  </soap:Body>
</soap:Envelope>\`;

return [{ json: { ...item, corpo_soap: corpo } }];`,
    };

    @node({
        id: 'a456m002-d7e8-4f9a-0b1c-2d3e4f5a6b7c',
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
        id: 'b556m002-e8f9-4a0b-1c2d-3e4f5a6b7c8d',
        name: 'converter-resposta-onr',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1936, -128],
    })
    ConverterRespostaOnr = {
        jsCode: `const entrada = $input.first().json;
const xmlResposta = entrada.data;

const MAPA_CAMPOS = {
    NOMESOLICPED: 'nome_solicitante',
    INSTITUICAOSOLICITANTE: 'instituicao_solicitante',
    ENDSOLICPED: 'logradouro',
    NUMENDSOLICPED: 'numero_endereco',
    COMPLENDSOLICPED: 'complemento',
    BAIRROSOLICPED: 'bairro',
    CIDADESOLICPED: 'cidade',
    ESTADOSOLICPED: 'estado',
    CEPSOLICPED: 'cep',
    FONESOLICPED: 'telefone',
    MAILSOLICPED: 'email',
    CPFCNPJSOLICPED: 'documento_solicitante',
    INCRICAOSOLICPED: 'inscricao_solicitante',
    NUMSOLICITACAOPED: 'numero_solicitacao',
    MATRICULASOLICITACAOPED: 'numero_matricula',
    DATAPED: 'data_pedido',
    VLRRECPED: 'valor_recebido',
    TIPOCOBRANCA: 'tipo_cobranca',
    COD_ISENCAO: 'codigo_isencao',
    FINALIDADE: 'finalidade',
};

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

        const chave = el.tag.toUpperCase();
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

function mapearSolicitacao(raw) {
    const item = {};
    for (const [tag, campo] of Object.entries(MAPA_CAMPOS)) {
        if (raw[tag] !== undefined) item[campo] = raw[tag];
    }
    return item;
}

function parseSolicitacoesMatricula(xmlExport) {
    if (!xmlExport || typeof xmlExport !== 'string') return [];

    const xml = decodeXmlEntities(xmlExport);
    const rootMatch = xml.match(/<ROOT>([\\s\\S]*)<\\/ROOT>/i);
    const conteudo = rootMatch ? rootMatch[1] : xml;
    const solicitacoes = [];
    let pos = 0;

    while (pos < conteudo.length) {
        const el = extrairProximoElemento(conteudo, pos);
        if (!el) break;

        const tag = el.tag.toUpperCase();
        if (tag === 'VISUALIZACAOMATRICULA') {
            solicitacoes.push(mapearSolicitacao(xmlBlocoParaObjeto(el.inner)));
        } else if (tag === 'PEDIDO') {
            let innerPos = 0;
            while (innerPos < el.inner.length) {
                const child = extrairProximoElemento(el.inner, innerPos);
                if (!child) break;
                if (child.tag.toUpperCase() === 'VISUALIZACAOMATRICULA') {
                    solicitacoes.push(mapearSolicitacao(xmlBlocoParaObjeto(child.inner)));
                }
                innerPos = child.end;
            }
        }

        pos = el.end;
    }

    return solicitacoes;
}

function dadosPadrao(sucesso = false, xmlExport = '', linhaDigitavel = '', solicitacoes = []) {
    return {
        protocolo: entrada.protocolo ?? '',
        data_inicial: entrada.data_inicial ?? '',
        data_final: entrada.data_final ?? '',
        id_pedido: entrada.id_pedido ?? '',
        operacao_soap: 'ObterXmlSolicitacoesV2',
        xml: sucesso ? xmlExport : '',
        linha_digitavel: sucesso ? linhaDigitavel : '',
        tamanho_xml: sucesso ? xmlExport.length : 0,
        quantidade_solicitacoes: sucesso ? solicitacoes.length : 0,
        solicitacoes: sucesso ? solicitacoes : [],
    };
}

function respostaErro(statusHttp, codigoErro, mensagemErro) {
    return {
        status_http: statusHttp,
        sucesso: false,
        codigo_erro: codigoErro,
        mensagem_erro: mensagemErro,
        dados: dadosPadrao(false),
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
const solicitacoes = sucesso && xmlExport ? parseSolicitacoesMatricula(xmlExport) : [];

if (sucesso && !xmlExport) {
    return {
        json: respostaErro(502, 0, 'RETORNO=true mas XML de matrícula vazio.'),
    };
}

return {
    json: {
        status_http: mapearStatusHttp(sucesso, codigo_erro, 'onr'),
        sucesso,
        codigo_erro,
        mensagem_erro,
        dados: dadosPadrao(sucesso, xmlExport, linhaDigitavel, solicitacoes),
    },
};`,
    };

    @node({
        id: 'c656m002-f9a0-4b1c-2d3e-4f5a6b7c8d9e',
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
            operacao_soap: 'ObterXmlSolicitacoesV2',
            xml: '',
            linha_digitavel: '',
            tamanho_xml: 0,
            quantidade_solicitacoes: 0,
            solicitacoes: [],
        },
    },
}];`,
    };

    @node({
        id: 'd756m002-a0b1-4c2d-3e4f-5a6b7c8d9e0f',
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
            operacao_soap: 'ObterXmlSolicitacoesV2',
            xml: '',
            linha_digitavel: '',
            tamanho_xml: 0,
            quantidade_solicitacoes: 0,
            solicitacoes: [],
        },
    },
}];`,
    };

    @node({
        id: 'e856m002-b1c2-4d3e-4f5a-6b7c8d9e0f1a',
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
