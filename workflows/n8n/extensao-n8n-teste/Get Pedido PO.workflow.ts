import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : Get Pedido PO
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
    id: '6du4sS2cZBhagiEu',
    name: 'Get Pedido PO',
    active: false,
    isArchived: false,
    projectId: 'PP65Me8T4KDNsx9m',
    settings: { executionOrder: 'v1', binaryMode: 'separate', availableInMCP: false },
})
export class GetPedidoPoWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: '28d822d6-a772-42c1-92ad-7b080e747399',
        webhookId: 'a0b1c2d3-e4f5-4a6b-8c9d-0e1f2a3b4c5d',
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [-1296, 128],
    })
    Webhook = {
        httpMethod: 'POST',
        path: 'a0b1c2d3-e4f5-4a6b-8c9d-0e1f2a3b4c5d',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: '2dc3d6d0-be86-4a39-86a2-04e9e4ee538b',
        name: 'normalizar-entrada',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [-960, 128],
    })
    NormalizarEntrada = {
        mode: 'raw',
        jsonOutput: `={
  "hash": "{{ $json.body.hash ?? '' }}",
  "id_pedido": {{ $json.body.id_pedido ?? null }},
  "url_servico_onr": "{{ $json.body.url_servico_onr ?? 'https://hml3-wsoficio.onr.org.br/penhoraonline.asmx' }}"
}
 `,
        options: {},
    };

    @node({
        id: 'abb643be-777e-49bb-a1e3-9d7c13bda5a7',
        name: 'validar-entrada',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [-640, 128],
    })
    ValidarEntrada = {
        jsCode: `const item = $input.first().json;

const hash = String(item.hash ?? '').trim().toUpperCase();
const idPedido = Number(item.id_pedido);
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
} else if (!Number.isInteger(idPedido) || idPedido < 1) {
    entrada_valida = false;
    codigo_erro = 12;
    mensagem_erro = 'id_pedido é obrigatório e deve ser um inteiro positivo.';
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
        url_servico_onr: urlServico,
        entrada_valida,
        codigo_erro,
        mensagem_erro
    }
}];`,
    };

    @node({
        id: 'c4f0b820-5cc6-487b-aee1-d7c72c395f6d',
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
                    id: 'd4e5f6a7-b8c9-4d0e-e1f2-a3b4c5d6e7f8',
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
        id: '9f02230c-c712-474b-81d8-2a53397a69af',
        name: 'montar-envelope-soap',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [0, 0],
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
    <tns:GetPedidoPO xmlns:tns="http://tempuri.org/WSOficio">
      <tns:oRequest>
        <tns:Hash>\${escapeXml(item.hash)}</tns:Hash>
        <tns:IDPedido>\${item.id_pedido}</tns:IDPedido>
      </tns:oRequest>
    </tns:GetPedidoPO>
  </soap:Body>
</soap:Envelope>\`;

return [{ json: { ...item, corpo_soap: corpo } }];`,
    };

    @node({
        id: '0e548d67-4c3e-4afb-9ae5-162e97f23b43',
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
        id: '42b2590e-6c42-49a6-8b21-dd31bf98086e',
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
    if ([2, 10, 11, 12].includes(codigoErro)) return 400;
    if ([45, 46, 47].includes(codigoErro)) return 401;
    if (codigoErro === 56) return 403;
    if (codigoErro === 57) return 404;
    if (codigoErro === 0) return 502;
    if (codigoErro === 1) return 503;
    return 422;
}

function decodeXml(valor) {
    return String(valor ?? '')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&amp;/g, '&');
}

function extrairTag(tag, origem) {
    const regex = new RegExp('<(?:\\\\w+:)?' + tag + '>(.*?)</(?:\\\\w+:)?' + tag + '>', 's');
    const match = origem.match(regex);
    return match ? decodeXml(match[1].trim()) : '';
}

function inteiro(tag, origem) {
    return parseInt(extrairTag(tag, origem), 10) || 0;
}

function decimal(tag, origem) {
    const texto = extrairTag(tag, origem).replace(',', '.');
    const numero = Number(texto);
    return Number.isFinite(numero) ? numero : 0;
}

function booleano(tag, origem) {
    return extrairTag(tag, origem).toLowerCase() === 'true';
}

function dadosVazio() {
    return {
        id_pedido: entrada.id_pedido ?? 0,
        id_tipo_pedido: 0,
        id_status: 0,
        id_processo: 0,
        id_vara: 0,
        id_boleto: 0,
        protocolo: '',
        numero_processo: '',
        observacao: '',
        data_solicitacao: '',
        tipo_resposta: '',
        negativa: false,
        resposta: '',
        data_resposta: '',
        motivo_devolucao: '',
        pago: false,
        valor_custas: 0,
        valor_boleto_anexado: 0,
        numero_prenotacao: '',
        data_prenotacao: '',
        data_vencimento_prenotacao: '',
        advogado_nome: '',
        advogado_telefone: '',
        advogado_email: '',
        parte_id: 0,
        parte_nome: '',
        parte_id_tipo: 0,
        parte_cpf_cnpj: '',
        matricula: '',
        imoveis_direitos: false,
        data_transferencia: '',
        arquivo: '',
        tipo_arquivo: 0
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
    return { json: respostaErro(502, 0, 'Resposta inválida da ONR: XML não encontrado.') };
}

const sucesso = extrairTag('RETORNO', xml).toLowerCase() === 'true';
const codigo_erro = parseInt(extrairTag('CODIGOERRO', xml) || '0', 10);
const mensagem_erro = extrairTag('ERRODESCRICAO', xml);

return {
    json: {
        status_http: mapearStatusHttp(sucesso, codigo_erro, 'onr'),
        sucesso,
        codigo_erro,
        mensagem_erro,
        dados: sucesso ? {
            id_pedido: entrada.id_pedido ?? 0,
            id_tipo_pedido: inteiro('IDTipoPedido', xml),
            id_status: inteiro('IDStatus', xml),
            id_processo: inteiro('IDProcesso', xml),
            id_vara: inteiro('IDVara', xml),
            id_boleto: inteiro('IDBoleto', xml),
            protocolo: extrairTag('Protocolo', xml),
            numero_processo: extrairTag('NumeroProcesso', xml),
            observacao: extrairTag('Observacao', xml),
            data_solicitacao: extrairTag('DataSolicitacao', xml),
            tipo_resposta: extrairTag('TipoResposta', xml),
            negativa: booleano('Negativa', xml),
            resposta: extrairTag('Resposta', xml),
            data_resposta: extrairTag('DataResposta', xml),
            motivo_devolucao: extrairTag('MotivoDevolucao', xml),
            pago: booleano('Pago', xml),
            valor_custas: decimal('ValorCustas', xml),
            valor_boleto_anexado: decimal('ValorBoletoAnexado', xml),
            numero_prenotacao: extrairTag('NumeroPrenotacao', xml),
            data_prenotacao: extrairTag('DataPrenotacao', xml),
            data_vencimento_prenotacao: extrairTag('DataVencimentoPrenotacao', xml),
            advogado_nome: extrairTag('AdvogadoNome', xml),
            advogado_telefone: extrairTag('AdvogadoTelefone', xml),
            advogado_email: extrairTag('AdvogadoEmail', xml),
            parte_id: inteiro('ParteID', xml),
            parte_nome: extrairTag('ParteNome', xml),
            parte_id_tipo: inteiro('ParteIDTipo', xml),
            parte_cpf_cnpj: extrairTag('ParteCPFCNPJ', xml),
            matricula: extrairTag('Matricula', xml),
            imoveis_direitos: booleano('ImoveisDireitos', xml),
            data_transferencia: extrairTag('DataTransferencia', xml),
            arquivo: extrairTag('Arquivo', xml),
            tipo_arquivo: inteiro('TipoArquivo', xml)
        } : dadosVazio()
    }
};`,
    };

    @node({
        id: '90cce31e-6662-4c3d-a4c8-00d17610c8ba',
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
            id_pedido: item.id_pedido ?? 0
        }
    }
}];`,
    };

    @node({
        id: 'a46db058-9bd6-4710-ba10-ba30c7b303e4',
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
            id_pedido: erro.id_pedido ?? 0
        }
    }
}];`,
    };

    @node({
        id: 'bc8c19df-6618-496b-b37a-be281bef844b',
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
