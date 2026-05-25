import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : Update Titulo AT
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
    name: 'Update Titulo AT',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class UpdateTituloAtWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'c2f3a4b5-c6d7-4890-e123-222233334477',
        webhookId: 'a4b5c6d7-e8f9-4a0b-1c2d-3e4f5a6b7c8d',
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 0],
    })
    Webhook = {
        httpMethod: 'POST',
        path: 'a4b5c6d7-e8f9-4a0b-1c2d-3e4f5a6b7c8d',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'd3a4b5c6-d7e8-4901-f234-333344445588',
        name: 'normalizar-entrada',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [336, 0],
    })
    NormalizarEntrada = {
        mode: 'raw',
        jsonOutput: `={
  "hash": "{{ $json.body.hash }}",
  "id_titulo": {{ $json.body.id_titulo }},
  "protocolo": "{{ $json.body.protocolo ?? '' }}",
  "apresentante_nome": "{{ $json.body.apresentante_nome ?? '' }}",
  "apresentante_email": "{{ $json.body.apresentante_email ?? '' }}",
  "apresentante_ddd_telefone": "{{ $json.body.apresentante_ddd_telefone ?? '' }}",
  "apresentante_numero_telefone": "{{ $json.body.apresentante_numero_telefone ?? '' }}",
  "apresentante_cpf_cnpj": "{{ $json.body.apresentante_cpf_cnpj ?? '' }}",
  "valor_deposito": {{ $json.body.valor_deposito ?? 0 }},
  "valor_emolumentos": {{ $json.body.valor_emolumentos ?? 0 }},
  "data_protocolo": "{{ $json.body.data_protocolo ?? '' }}",
  "data_previsao_entrega": "{{ $json.body.data_previsao_entrega ?? '' }}",
  "modo_notificacao_status": "{{ $json.body.modo_notificacao_status ?? '' }}",
  "interessado_nome": "{{ $json.body.interessado_nome ?? '' }}",
  "interessado_cpf_cnpj": "{{ $json.body.interessado_cpf_cnpj ?? '' }}",
  "natureza_titulo": "{{ $json.body.natureza_titulo ?? '' }}",
  "codigo_verificador": "{{ $json.body.codigo_verificador ?? '' }}",
  "tipo_solicitacao": {{ $json.body.tipo_solicitacao }},
  "url_servico_onr": "{{ $json.body.url_servico_onr ?? 'https://hml3-wsoficio.onr.org.br/acompanhamentotitulos.asmx' }}"
}
 `,
        options: {},
    };

    @node({
        id: 'e4b5c6d7-e8f9-4012-a345-444455556699',
        name: 'validar-entrada',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [656, 0],
    })
    ValidarEntrada = {
        jsCode: `const item = $input.first().json;

const hash = String(item.hash ?? '').trim().toUpperCase();
const idTitulo = Number(item.id_titulo);
const protocolo = String(item.protocolo ?? '').replace(/\\D/g, '');
const apresentanteNome = String(item.apresentante_nome ?? '').trim();
const apresentanteEmail = String(item.apresentante_email ?? '').trim();
const apresentanteDdd = String(item.apresentante_ddd_telefone ?? '').trim();
const apresentanteTelefone = String(item.apresentante_numero_telefone ?? '').trim();
const apresentanteCpfCnpj = String(item.apresentante_cpf_cnpj ?? '').trim();
const valorDeposito = Number(item.valor_deposito ?? 0);
const valorEmolumentos = Number(item.valor_emolumentos ?? 0);
const dataProtocolo = String(item.data_protocolo ?? '').trim();
const dataPrevisaoEntrega = String(item.data_previsao_entrega ?? '').trim();
const modo = String(item.modo_notificacao_status ?? '').trim().toUpperCase();
const interessadoNome = String(item.interessado_nome ?? '').trim();
const interessadoCpfCnpj = String(item.interessado_cpf_cnpj ?? '').trim();
const naturezaTitulo = String(item.natureza_titulo ?? '').trim();
const codigoVerificador = String(item.codigo_verificador ?? '').trim();
const tipoSolicitacao = Number(item.tipo_solicitacao);
const urlServico = String(item.url_servico_onr ?? '').trim();

let entrada_valida = true;
let codigo_erro = 0;
let mensagem_erro = '';

function decimalOk(n) {
    return Number.isFinite(n) && n >= 0;
}

if (!hash) {
    entrada_valida = false;
    codigo_erro = 11;
    mensagem_erro = 'O hash de validação não foi informado.';
} else if (!/^[0-9A-F]{40}$/.test(hash)) {
    entrada_valida = false;
    codigo_erro = 11;
    mensagem_erro = 'Hash inválido: informe 40 caracteres hexadecimais maiúsculos.';
} else if (!Number.isFinite(idTitulo) || idTitulo < 1) {
    entrada_valida = false;
    codigo_erro = 12;
    mensagem_erro = 'id_titulo é obrigatório e deve ser um inteiro positivo.';
} else if (!protocolo) {
    entrada_valida = false;
    codigo_erro = 10;
    mensagem_erro = 'protocolo é obrigatório (apenas dígitos, até 11).';
} else if (protocolo.length > 11) {
    entrada_valida = false;
    codigo_erro = 27;
    mensagem_erro = 'protocolo inválido: máximo 11 dígitos.';
} else if (!apresentanteNome) {
    entrada_valida = false;
    codigo_erro = 13;
    mensagem_erro = 'apresentante_nome é obrigatório.';
} else if (!modo) {
    entrada_valida = false;
    codigo_erro = 18;
    mensagem_erro = 'modo_notificacao_status é obrigatório (E ou S).';
} else if (modo !== 'E' && modo !== 'S') {
    entrada_valida = false;
    codigo_erro = 18;
    mensagem_erro = 'modo_notificacao_status inválido: use E (e-mail) ou S (SMS).';
} else if (modo === 'E' && !apresentanteEmail) {
    entrada_valida = false;
    codigo_erro = 19;
    mensagem_erro = 'Com modo_notificacao_status=E, apresentante_email é obrigatório.';
} else if (modo === 'S' && (!apresentanteDdd || !apresentanteTelefone)) {
    entrada_valida = false;
    codigo_erro = 20;
    mensagem_erro = 'Com modo_notificacao_status=S, apresentante_ddd_telefone e apresentante_numero_telefone são obrigatórios.';
} else if (!decimalOk(valorDeposito) || !decimalOk(valorEmolumentos)) {
    entrada_valida = false;
    codigo_erro = 10;
    mensagem_erro = 'valor_deposito e valor_emolumentos devem ser números >= 0.';
} else if (!dataProtocolo) {
    entrada_valida = false;
    codigo_erro = 21;
    mensagem_erro = 'data_protocolo é obrigatória.';
} else if (!dataPrevisaoEntrega) {
    entrada_valida = false;
    codigo_erro = 10;
    mensagem_erro = 'data_previsao_entrega é obrigatória.';
} else if (!interessadoNome) {
    entrada_valida = false;
    codigo_erro = 15;
    mensagem_erro = 'interessado_nome é obrigatório.';
} else if (!naturezaTitulo) {
    entrada_valida = false;
    codigo_erro = 17;
    mensagem_erro = 'natureza_titulo é obrigatória.';
} else if (!Number.isFinite(tipoSolicitacao) || (tipoSolicitacao !== 1 && tipoSolicitacao !== 2)) {
    entrada_valida = false;
    codigo_erro = 10;
    mensagem_erro = 'tipo_solicitacao inválido: use 1 (Prenotação) ou 2 (Exame e Cálculo).';
} else if (!urlServico) {
    entrada_valida = false;
    codigo_erro = 10;
    mensagem_erro = 'url_servico_onr é obrigatória.';
}

const valorDepositoFmt = decimalOk(valorDeposito) ? Number(valorDeposito.toFixed(2)) : 0;
const valorEmolumentosFmt = decimalOk(valorEmolumentos) ? Number(valorEmolumentos.toFixed(2)) : 0;

return [{
    json: {
        ...item,
        hash,
        id_titulo: idTitulo,
        protocolo,
        apresentante_nome: apresentanteNome,
        apresentante_email: apresentanteEmail,
        apresentante_ddd_telefone: apresentanteDdd,
        apresentante_numero_telefone: apresentanteTelefone,
        apresentante_cpf_cnpj: apresentanteCpfCnpj,
        valor_deposito: valorDepositoFmt,
        valor_emolumentos: valorEmolumentosFmt,
        data_protocolo: dataProtocolo,
        data_previsao_entrega: dataPrevisaoEntrega,
        modo_notificacao_status: modo,
        interessado_nome: interessadoNome,
        interessado_cpf_cnpj: interessadoCpfCnpj,
        natureza_titulo: naturezaTitulo,
        codigo_verificador: codigoVerificador,
        tipo_solicitacao: tipoSolicitacao,
        url_servico_onr: urlServico,
        entrada_valida,
        codigo_erro,
        mensagem_erro
    }
}];`,
    };

    @node({
        id: 'f5c6d7e8-f9a0-4123-b456-555566667700',
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
                    id: 'a6d7e8f9-a0b1-4234-c567-666677778811',
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
        id: 'b7e8f9a0-b1c2-4345-d678-777788889922',
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

const corpo = \`<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <tns:UpdateTituloAT xmlns:tns="http://tempuri.org/WSOficio">
      <tns:oRequest>
        <tns:Hash>\${xml(item.hash)}</tns:Hash>
        <tns:IDTitulo>\${item.id_titulo}</tns:IDTitulo>
        <tns:Protocolo>\${xml(item.protocolo)}</tns:Protocolo>
        <tns:ApresentanteNome>\${xml(item.apresentante_nome)}</tns:ApresentanteNome>
        <tns:ApresentanteEmail>\${xml(item.apresentante_email)}</tns:ApresentanteEmail>
        <tns:ApresentanteDDDTelefone>\${xml(item.apresentante_ddd_telefone)}</tns:ApresentanteDDDTelefone>
        <tns:ApresentanteNumeroTelefone>\${xml(item.apresentante_numero_telefone)}</tns:ApresentanteNumeroTelefone>
        <tns:ApresentanteCPFCNPJ>\${xml(item.apresentante_cpf_cnpj)}</tns:ApresentanteCPFCNPJ>
        <tns:ValorDeposito>\${item.valor_deposito}</tns:ValorDeposito>
        <tns:ValorEmolumentos>\${item.valor_emolumentos}</tns:ValorEmolumentos>
        <tns:DataProtocolo>\${xml(item.data_protocolo)}</tns:DataProtocolo>
        <tns:DataPrevisaoEntrega>\${xml(item.data_previsao_entrega)}</tns:DataPrevisaoEntrega>
        <tns:ModoNotificacaoStatus>\${xml(item.modo_notificacao_status)}</tns:ModoNotificacaoStatus>
        <tns:InteressadoNome>\${xml(item.interessado_nome)}</tns:InteressadoNome>
        <tns:InteressadoCPFCNPJ>\${xml(item.interessado_cpf_cnpj)}</tns:InteressadoCPFCNPJ>
        <tns:NaturezaTitulo>\${xml(item.natureza_titulo)}</tns:NaturezaTitulo>
        <tns:CodigoVerificador>\${xml(item.codigo_verificador)}</tns:CodigoVerificador>
        <tns:TipoSolicitacao>\${item.tipo_solicitacao}</tns:TipoSolicitacao>
      </tns:oRequest>
    </tns:UpdateTituloAT>
  </soap:Body>
</soap:Envelope>\`;

return [{ json: { ...item, corpo_soap: corpo } }];`,
    };

    @node({
        id: 'c8f9a0b1-c2d3-4456-e789-888899990033',
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
        id: 'd9a0b1c2-d3e4-4567-f890-999900001144',
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
    if ([2, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 27, 28].includes(codigoErro)) return 400;
    if ([45, 46, 47].includes(codigoErro)) return 401;
    if (codigoErro === 32 || codigoErro === 50) return 403;
    if (codigoErro === 0) return 502;
    if (codigoErro === 1 || codigoErro === 101) return 503;
    return 422;
}

function respostaErro(statusHttp, codigoErro, mensagemErro) {
    return {
        status_http: statusHttp,
        sucesso: false,
        codigo_erro: codigoErro,
        mensagem_erro: mensagemErro,
        dados: { id_titulo: entrada.id_titulo ?? 0 }
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
        dados: { id_titulo: entrada.id_titulo ?? 0 }
    }
};`,
    };

    @node({
        id: 'e0b1c2d3-e4f5-4678-a901-000011112255',
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
        dados: { id_titulo: item.id_titulo ?? 0 }
    }
}];`,
    };

    @node({
        id: 'f1c2d3e4-f5a6-4789-b012-111122223366',
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
        dados: { id_titulo: erro.id_titulo ?? 0 }
    }
}];`,
    };

    @node({
        id: 'a2d3e4f5-a6b7-4890-c123-222233334488',
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
