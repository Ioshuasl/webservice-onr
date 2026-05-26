import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : List Pedidos Exportacao PO
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
    id: 'lY1cDcyN3GRAuh9f',
    name: 'List Pedidos Exportacao PO',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class ListPedidosExportacaoPoWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: '7a0d3f9e-9c54-4d6d-b8d8-29ff4c5f7f10',
        webhookId: 'b28f7a63-4d9d-40a3-a7ac-d7b53a6a8f1d',
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 0],
        credentials: { httpBasicAuth: { id: 'CE3L7VlaRe4klqlk', name: 'ioshua + ioshua123' } },
    })
    Webhook = {
        httpMethod: 'POST',
        path: 'b28f7a63-4d9d-40a3-a7ac-d7b53a6a8f1d',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: '8f42bbbe-86bd-4d8e-8846-f3ea8c9cf0c1',
        name: 'normalizar-entrada',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [336, 0],
    })
    NormalizarEntrada = {
        mode: 'raw',
        jsonOutput: `={{
  hash: $json.body.hash ?? '',
  protocolo: $json.body.protocolo ?? '',
  id_tipo_pedido: $json.body.id_tipo_pedido ?? -1,
  id_status: $json.body.id_status ?? -1,
  id_vara: $json.body.id_vara ?? -1,
  data_solicitacao_inicial: $json.body.data_solicitacao_inicial ?? '',
  data_solicitacao_final: $json.body.data_solicitacao_final ?? '',
  data_resposta_inicial: $json.body.data_resposta_inicial ?? '',
  data_resposta_final: $json.body.data_resposta_final ?? '',
  url_servico_onr: $json.body.url_servico_onr ?? 'https://hml3-wsoficio.onr.org.br/penhoraonline.asmx'
}}
 `,
        options: {},
    };

    @node({
        id: '6bca35bd-6739-4638-a94e-0a8f15979dac',
        name: 'validar-entrada',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [656, 0],
    })
    ValidarEntrada = {
        jsCode: `const item = $input.first().json;

const TIPOS_PEDIDO_VALIDOS = new Set([-1, 1, 2, 3]);
const STATUS_VALIDOS = new Set([-1, 1, 2, 3, 5, 7, 8, 9, 10, 11, 12, 13, 14]);

function normalizarInteiro(valor) {
    const numero = Number(valor);
    return Number.isInteger(numero) ? numero : NaN;
}

function dataValida(valor) {
    const texto = String(valor ?? '').trim();
    if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(texto)) return false;

    const [ano, mes, dia] = texto.split('-').map(Number);
    const data = new Date(ano, mes - 1, dia);

    return data.getFullYear() === ano
        && data.getMonth() === mes - 1
        && data.getDate() === dia;
}

function parseData(valor) {
    const [ano, mes, dia] = String(valor).trim().split('-').map(Number);
    return new Date(ano, mes - 1, dia);
}

function periodoEmDias(inicio, fim) {
    const msPorDia = 24 * 60 * 60 * 1000;
    return Math.round((parseData(fim) - parseData(inicio)) / msPorDia);
}

function urlValida(valor) {
    try {
        const url = new URL(valor);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
}

const hash = String(item.hash ?? '').trim().toUpperCase();
const protocolo = String(item.protocolo ?? '').trim();
const idTipoPedido = normalizarInteiro(item.id_tipo_pedido);
const idStatus = normalizarInteiro(item.id_status);
const idVara = normalizarInteiro(item.id_vara);
const dataSolicitacaoInicial = String(item.data_solicitacao_inicial ?? '').trim();
const dataSolicitacaoFinal = String(item.data_solicitacao_final ?? '').trim();
const dataRespostaInicial = String(item.data_resposta_inicial ?? '').trim();
const dataRespostaFinal = String(item.data_resposta_final ?? '').trim();
const urlServico = String(item.url_servico_onr ?? '').trim();

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
    mensagem_erro = 'Hash invalido: informe 40 caracteres hexadecimais.';
} else if (!Number.isFinite(idTipoPedido) || !TIPOS_PEDIDO_VALIDOS.has(idTipoPedido)) {
    entrada_valida = false;
    codigo_erro = 15;
    mensagem_erro = 'id_tipo_pedido invalido. Use -1, 1, 2 ou 3.';
} else if (!Number.isFinite(idStatus) || !STATUS_VALIDOS.has(idStatus)) {
    entrada_valida = false;
    codigo_erro = 16;
    mensagem_erro = 'id_status invalido para Penhora Online.';
} else if (!Number.isFinite(idVara) || idVara < -1 || idVara === 0) {
    entrada_valida = false;
    codigo_erro = 14;
    mensagem_erro = 'id_vara invalido. Use -1 para todas ou um inteiro positivo.';
} else if (!dataSolicitacaoInicial) {
    entrada_valida = false;
    codigo_erro = 17;
    mensagem_erro = 'data_solicitacao_inicial e obrigatoria.';
} else if (!dataSolicitacaoFinal) {
    entrada_valida = false;
    codigo_erro = 18;
    mensagem_erro = 'data_solicitacao_final e obrigatoria.';
} else if (!dataValida(dataSolicitacaoInicial)) {
    entrada_valida = false;
    codigo_erro = 19;
    mensagem_erro = 'data_solicitacao_inicial invalida. Use aaaa-mm-dd.';
} else if (!dataValida(dataSolicitacaoFinal)) {
    entrada_valida = false;
    codigo_erro = 20;
    mensagem_erro = 'data_solicitacao_final invalida. Use aaaa-mm-dd.';
} else if (parseData(dataSolicitacaoFinal) < parseData(dataSolicitacaoInicial)) {
    entrada_valida = false;
    codigo_erro = 20;
    mensagem_erro = 'data_solicitacao_final deve ser maior ou igual a inicial.';
} else if (periodoEmDias(dataSolicitacaoInicial, dataSolicitacaoFinal) > 30) {
    entrada_valida = false;
    codigo_erro = 21;
    mensagem_erro = 'O periodo de solicitacao nao pode ser maior que 30 dias.';
} else if (dataRespostaInicial && !dataValida(dataRespostaInicial)) {
    entrada_valida = false;
    codigo_erro = 22;
    mensagem_erro = 'data_resposta_inicial invalida. Use aaaa-mm-dd.';
} else if (dataRespostaFinal && !dataValida(dataRespostaFinal)) {
    entrada_valida = false;
    codigo_erro = 23;
    mensagem_erro = 'data_resposta_final invalida. Use aaaa-mm-dd.';
} else if (dataRespostaInicial && dataRespostaFinal && parseData(dataRespostaFinal) < parseData(dataRespostaInicial)) {
    entrada_valida = false;
    codigo_erro = 23;
    mensagem_erro = 'data_resposta_final deve ser maior ou igual a inicial.';
} else if (!urlServico) {
    entrada_valida = false;
    codigo_erro = 10;
    mensagem_erro = 'url_servico_onr e obrigatoria.';
} else if (!urlValida(urlServico)) {
    entrada_valida = false;
    codigo_erro = 10;
    mensagem_erro = 'url_servico_onr deve ser uma URL http ou https valida.';
}

return [{
    json: {
        ...item,
        hash,
        protocolo,
        id_tipo_pedido: idTipoPedido,
        id_status: idStatus,
        id_vara: idVara,
        data_solicitacao_inicial: dataSolicitacaoInicial,
        data_solicitacao_final: dataSolicitacaoFinal,
        data_resposta_inicial: dataRespostaInicial,
        data_resposta_final: dataRespostaFinal,
        url_servico_onr: urlServico,
        entrada_valida,
        codigo_erro,
        mensagem_erro
    }
}];`,
    };

    @node({
        id: 'aee6f7bf-cb73-45e0-aa55-2c798e9b8a17',
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
                    id: '18d6b356-f7c0-4732-8e05-46d1e1372791',
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
        id: 'b68e6d69-a547-4b79-891b-823e0b038743',
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
    <tns:ListPedidosExportacaoPO xmlns:tns="http://tempuri.org/WSOficio">
      <tns:oRequest>
        <tns:Hash>\${escapeXml(item.hash)}</tns:Hash>
        <tns:Protocolo>\${escapeXml(item.protocolo)}</tns:Protocolo>
        <tns:IDTipoPedido>\${item.id_tipo_pedido}</tns:IDTipoPedido>
        <tns:IDStatus>\${item.id_status}</tns:IDStatus>
        <tns:IDVara>\${item.id_vara}</tns:IDVara>
        <tns:DataSolicitacaoInicial>\${escapeXml(item.data_solicitacao_inicial)}</tns:DataSolicitacaoInicial>
        <tns:DataSolicitacaoFinal>\${escapeXml(item.data_solicitacao_final)}</tns:DataSolicitacaoFinal>
        <tns:DataRespostaInicial>\${escapeXml(item.data_resposta_inicial)}</tns:DataRespostaInicial>
        <tns:DataRespostaFinal>\${escapeXml(item.data_resposta_final)}</tns:DataRespostaFinal>
      </tns:oRequest>
    </tns:ListPedidosExportacaoPO>
  </soap:Body>
</soap:Envelope>\`;

return [{ json: { ...item, corpo_soap: corpo } }];`,
    };

    @node({
        id: 'c034336f-d676-4637-a9cf-93663409fe76',
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
        id: 'cf55db77-10d6-4a61-b022-472e8b9ae7a4',
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
    if ([2, 10, 11, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23].includes(codigoErro)) return 400;
    if ([45, 46, 47].includes(codigoErro)) return 401;
    if (codigoErro === 51) return 404;
    if (codigoErro === 50 || codigoErro === 52 || codigoErro === 53) return 403;
    if (codigoErro === 0) return 502;
    if (codigoErro === 1) return 503;
    return 422;
}

function dadosVazio() {
    return {
        filtros: {
            protocolo: entrada.protocolo ?? '',
            id_tipo_pedido: entrada.id_tipo_pedido ?? -1,
            id_status: entrada.id_status ?? -1,
            id_vara: entrada.id_vara ?? -1,
            data_solicitacao_inicial: entrada.data_solicitacao_inicial ?? '',
            data_solicitacao_final: entrada.data_solicitacao_final ?? '',
            data_resposta_inicial: entrada.data_resposta_inicial ?? '',
            data_resposta_final: entrada.data_resposta_final ?? ''
        },
        quantidade_pedidos: 0,
        pedidos: []
    };
}

function respostaErro(statusHttp, codigoErro, mensagemErro) {
    return {
        status_http: statusHttp,
        sucesso: false,
        codigo_erro: codigoErro,
        mensagem_erro: mensagemErro,
        dados: dadosVazio()
    };
}

if (!xml || typeof xml !== 'string') {
    return { json: respostaErro(502, 0, 'Resposta invalida da ONR: XML nao encontrado.') };
}

function decodificarXml(valor) {
    return String(valor ?? '')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&amp;/g, '&');
}

function extrairTag(tag, origem) {
    const regex = new RegExp(\`<(?:\\\\w+:)?\${tag}(?:\\\\s[^>]*)?>([\\\\s\\\\S]*?)</(?:\\\\w+:)?\${tag}>\`, 'i');
    const match = String(origem ?? '').match(regex);
    return match ? decodificarXml(match[1].trim()) : '';
}

function extrairBlocos(tag, origem) {
    const blocos = [];
    const regex = new RegExp(\`<(?:\\\\w+:)?\${tag}(?:\\\\s[^>]*)?>([\\\\s\\\\S]*?)</(?:\\\\w+:)?\${tag}>\`, 'gi');
    let match;

    while ((match = regex.exec(String(origem ?? ''))) !== null) {
        blocos.push(match[1]);
    }

    return blocos;
}

function inteiro(tag, origem) {
    const valor = parseInt(extrairTag(tag, origem), 10);
    return Number.isNaN(valor) ? 0 : valor;
}

function parsePartes(blocoPedido) {
    return extrairBlocos('ListPedidosExportacaoPO_Parte_WSResp', blocoPedido).map((bloco) => ({
        id_parte: inteiro('IDParte', bloco),
        nome: extrairTag('Nome', bloco),
        cpf_cnpj: extrairTag('CPFCNPJ', bloco),
        qualidade: extrairTag('Qualidade', bloco),
        passivo_penhora: extrairTag('PassivoPenhora', bloco)
    }));
}

function parseImoveis(blocoPedido) {
    return extrairBlocos('ListPedidosExportacaoPO_Imovel_WSResp', blocoPedido).map((bloco) => ({
        id_imovel: inteiro('IDImovel', bloco),
        proprietario: extrairTag('Proprietario', bloco),
        estado: extrairTag('Estado', bloco),
        comarca: extrairTag('Comarca', bloco),
        matricula: extrairTag('Matricula', bloco),
        endereco: extrairTag('Endereco', bloco),
        bairro: extrairTag('Bairro', bloco),
        municipio: extrairTag('Municipio', bloco),
        tipo_constricao: extrairTag('TipoConstricao', bloco),
        imovel_data_auto_termo: extrairTag('ImovelDataAutoTermo', bloco),
        polo_passivo: extrairTag('PoloPassivo', bloco),
        motivo_tipo: extrairTag('MotivoTipo', bloco),
        outros_motivos: extrairTag('OutrosMotivos', bloco),
        estado_civil: extrairTag('EstadoCivil', bloco),
        nome_conjuge: extrairTag('NomeConjuge', bloco),
        intimado_penhora: extrairTag('IntimadoPenhora', bloco),
        data_intimacao: extrairTag('DataIntimacao', bloco),
        motivo_dispensa: extrairTag('MotivoDispensa', bloco),
        nome_depositario: extrairTag('NomeDepositario', bloco),
        tipo_emolumento: extrairTag('TipoEmolumento', bloco),
        data_decisao: extrairTag('DataDecisao', bloco),
        folhas: extrairTag('Folhas', bloco),
        percentual_executado: extrairTag('PercentualExecutado', bloco),
        percentual_penhorado: extrairTag('PercentualPenhorado', bloco)
    }));
}

function parsePedidos(origem) {
    return extrairBlocos('ListPedidosExportacaoPO_Pedidos_WSResp', origem).map((bloco) => ({
        id_pedido: inteiro('IDPedido', bloco),
        id_processo: inteiro('IDProcesso', bloco),
        id_tipo_pedido: inteiro('IDTipoPedido', bloco),
        id_status: inteiro('IDStatus', bloco),
        tipo_penhora: inteiro('TipoPenhora', bloco),
        tipo_certidao: inteiro('TipoCertidao', bloco),
        protocolo: extrairTag('Protocolo', bloco),
        numero_processo: extrairTag('NumeroProcesso', bloco),
        data_pedido: extrairTag('DataPed', bloco),
        estado: extrairTag('Estado', bloco),
        comarca: extrairTag('Comarca', bloco),
        foro: extrairTag('Foro', bloco),
        id_vara: inteiro('IDVara', bloco),
        vara: extrairTag('Vara', bloco),
        nome_pesquisado: extrairTag('NomePesqPed', bloco),
        cpf_cnpj: extrairTag('CPFCNPJ', bloco),
        matricula_pesquisada: extrairTag('Matr1PesqPed', bloco),
        imoveis_direito: extrairTag('ImoveisDireito', bloco),
        data_transferencia: extrairTag('DataTransferencia', bloco),
        mandado: extrairTag('Mandado', bloco),
        natureza_execucao: extrairTag('NaturezaExecucao', bloco),
        id_grupo_reenvio: extrairTag('IDGrupoReenvio', bloco),
        usuario: extrairTag('Usuario', bloco),
        usuario_cpf: extrairTag('UsuarioCPF', bloco),
        valor_da_divida: extrairTag('ValorDaDivida', bloco),
        partes: parsePartes(bloco),
        imoveis: parseImoveis(bloco)
    }));
}

const sucesso = extrairTag('RETORNO', xml).toLowerCase() === 'true';
const codigo_erro = parseInt(extrairTag('CODIGOERRO', xml) || '0', 10);
const mensagem_erro = extrairTag('ERRODESCRICAO', xml);
const pedidos = sucesso ? parsePedidos(xml) : [];

return {
    json: {
        status_http: mapearStatusHttp(sucesso, codigo_erro, 'onr'),
        sucesso,
        codigo_erro,
        mensagem_erro,
        dados: sucesso ? {
            ...dadosVazio(),
            quantidade_pedidos: pedidos.length,
            pedidos
        } : dadosVazio()
    }
};`,
    };

    @node({
        id: '0b6d6809-c11b-47b9-b1ab-175dbcb6d58f',
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
            filtros: {
                protocolo: item.protocolo ?? '',
                id_tipo_pedido: item.id_tipo_pedido ?? -1,
                id_status: item.id_status ?? -1,
                id_vara: item.id_vara ?? -1,
                data_solicitacao_inicial: item.data_solicitacao_inicial ?? '',
                data_solicitacao_final: item.data_solicitacao_final ?? '',
                data_resposta_inicial: item.data_resposta_inicial ?? '',
                data_resposta_final: item.data_resposta_final ?? ''
            },
            quantidade_pedidos: 0,
            pedidos: []
        }
    }
}];`,
    };

    @node({
        id: '0b9e52a1-4188-467d-a9f9-6d0a2de9b07b',
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
            filtros: {
                protocolo: erro.protocolo ?? '',
                id_tipo_pedido: erro.id_tipo_pedido ?? -1,
                id_status: erro.id_status ?? -1,
                id_vara: erro.id_vara ?? -1,
                data_solicitacao_inicial: erro.data_solicitacao_inicial ?? '',
                data_solicitacao_final: erro.data_solicitacao_final ?? '',
                data_resposta_inicial: erro.data_resposta_inicial ?? '',
                data_resposta_final: erro.data_resposta_final ?? ''
            },
            quantidade_pedidos: 0,
            pedidos: []
        }
    }
}];`,
    };

    @node({
        id: '5b83cfb2-940d-467c-a909-46e06c1cfabc',
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
