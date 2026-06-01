import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : Insert Titulo AT
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
    id: 'JpX3lA5QNgKwehRV',
    name: 'Insert Titulo AT',
    active: false,
    isArchived: false,
    projectId: 'PP65Me8T4KDNsx9m',
    settings: { executionOrder: 'v1', binaryMode: 'separate', availableInMCP: false },
})
export class InsertTituloAtWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: '41efef37-f9dc-471b-b948-48008deea26f',
        webhookId: 'f3a4b5c6-d7e8-4f9a-0b1c-2d3e4f5a6b7c',
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [976, 1440],
    })
    Webhook = {
        httpMethod: 'POST',
        path: 'f3a4b5c6-d7e8-4f9a-0b1c-2d3e4f5a6b7c',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: '81241ebb-51cb-4c90-a8db-7946298c501f',
        name: 'normalizar-entrada',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [1312, 1440],
    })
    NormalizarEntrada = {
        mode: 'raw',
        jsonOutput: `={
  "hash": "{{ $json.body.hash }}",
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
  "id_tipo_status": {{ $json.body.id_tipo_status }},
  "data_status": "{{ $json.body.data_status ?? '' }}",
  "descricao_status": "{{ $json.body.descricao_status ?? '' }}",
  "url_servico_onr": "{{ $json.body.url_servico_onr ?? 'https://hml3-wsoficio.onr.org.br/acompanhamentotitulos.asmx' }}"
}
 `,
        options: {},
    };

    @node({
        id: 'cf84405e-38e7-4fcc-8ec2-d4d3fff0857e',
        name: 'validar-entrada',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1632, 1440],
    })
    ValidarEntrada = {
        jsCode: `const item = $input.first().json;

const TIPOS_STATUS_VALIDOS = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);

const hash = String(item.hash ?? '').trim().toUpperCase();
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
const idTipoStatus = Number(item.id_tipo_status);
const dataStatus = String(item.data_status ?? '').trim();
const descricaoStatus = String(item.descricao_status ?? '').trim();
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
} else if (!protocolo) {
    entrada_valida = false;
    codigo_erro = 12;
    mensagem_erro = 'protocolo é obrigatório (apenas dígitos, até 11).';
} else if (protocolo.length > 11) {
    entrada_valida = false;
    codigo_erro = 13;
    mensagem_erro = 'protocolo inválido: máximo 11 dígitos.';
} else if (!apresentanteNome) {
    entrada_valida = false;
    codigo_erro = 14;
    mensagem_erro = 'apresentante_nome é obrigatório.';
} else if (!modo) {
    entrada_valida = false;
    codigo_erro = 19;
    mensagem_erro = 'modo_notificacao_status é obrigatório (E ou S).';
} else if (modo !== 'E' && modo !== 'S') {
    entrada_valida = false;
    codigo_erro = 19;
    mensagem_erro = 'modo_notificacao_status inválido: use E (e-mail) ou S (SMS).';
} else if (modo === 'E' && !apresentanteEmail) {
    entrada_valida = false;
    codigo_erro = 20;
    mensagem_erro = 'Com modo_notificacao_status=E, apresentante_email é obrigatório.';
} else if (modo === 'S' && (!apresentanteDdd || !apresentanteTelefone)) {
    entrada_valida = false;
    codigo_erro = 21;
    mensagem_erro = 'Com modo_notificacao_status=S, apresentante_ddd_telefone e apresentante_numero_telefone são obrigatórios.';
} else if (!decimalOk(valorDeposito) || !decimalOk(valorEmolumentos)) {
    entrada_valida = false;
    codigo_erro = 10;
    mensagem_erro = 'valor_deposito e valor_emolumentos devem ser números >= 0.';
} else if (!dataProtocolo) {
    entrada_valida = false;
    codigo_erro = 23;
    mensagem_erro = 'data_protocolo é obrigatória.';
} else if (!dataPrevisaoEntrega) {
    entrada_valida = false;
    codigo_erro = 10;
    mensagem_erro = 'data_previsao_entrega é obrigatória.';
} else if (!interessadoNome) {
    entrada_valida = false;
    codigo_erro = 16;
    mensagem_erro = 'interessado_nome é obrigatório.';
} else if (!naturezaTitulo) {
    entrada_valida = false;
    codigo_erro = 18;
    mensagem_erro = 'natureza_titulo é obrigatória.';
} else if (!codigoVerificador) {
    entrada_valida = false;
    codigo_erro = 10;
    mensagem_erro = 'codigo_verificador é obrigatório (até 20 caracteres; veja GetTituloAT).';
} else if (codigoVerificador.length > 20) {
    entrada_valida = false;
    codigo_erro = 10;
    mensagem_erro = 'codigo_verificador aceita no máximo 20 caracteres.';
} else if (!Number.isFinite(tipoSolicitacao) || (tipoSolicitacao !== 1 && tipoSolicitacao !== 2)) {
    entrada_valida = false;
    codigo_erro = 10;
    mensagem_erro = 'tipo_solicitacao inválido: use 1 (Prenotação) ou 2 (Exame e Cálculo).';
} else if (!Number.isFinite(idTipoStatus) || !TIPOS_STATUS_VALIDOS.has(idTipoStatus)) {
    entrada_valida = false;
    codigo_erro = 22;
    mensagem_erro = 'id_tipo_status inválido: use 1–13 (ex.: 4 = Título prenotado).';
} else if (!dataStatus) {
    entrada_valida = false;
    codigo_erro = 10;
    mensagem_erro = 'data_status é obrigatória.';
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
        id_tipo_status: idTipoStatus,
        data_status: dataStatus,
        descricao_status: descricaoStatus,
        url_servico_onr: urlServico,
        entrada_valida,
        codigo_erro,
        mensagem_erro
    }
}];`,
    };

    @node({
        id: 'bf73d5b3-4bdf-45ac-910a-10089af3dcc3',
        name: 'if-entrada-valida',
        type: 'n8n-nodes-base.if',
        version: 2.2,
        position: [1952, 1440],
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
                    id: 'v5e6f7a8-b9c0-4123-e456-555566667788',
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
        id: 'd639bb22-82e5-4d17-a95a-abb29f78837a',
        name: 'montar-envelope-soap',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [2272, 1312],
    })
    MontarEnvelopeSoap = {
        jsCode: `const item = $input.first().json;

const corpo = \`<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <tns:InsertTituloAT xmlns:tns="http://tempuri.org/WSOficio">
      <tns:oRequest>
        <tns:Hash>\${item.hash}</tns:Hash>
        <tns:Protocolo>\${item.protocolo}</tns:Protocolo>
        <tns:ApresentanteNome>\${item.apresentante_nome}</tns:ApresentanteNome>
        <tns:ApresentanteEmail>\${item.apresentante_email}</tns:ApresentanteEmail>
        <tns:ApresentanteDDDTelefone>\${item.apresentante_ddd_telefone}</tns:ApresentanteDDDTelefone>
        <tns:ApresentanteNumeroTelefone>\${item.apresentante_numero_telefone}</tns:ApresentanteNumeroTelefone>
        <tns:ApresentanteCPFCNPJ>\${item.apresentante_cpf_cnpj}</tns:ApresentanteCPFCNPJ>
        <tns:ValorDeposito>\${item.valor_deposito}</tns:ValorDeposito>
        <tns:ValorEmolumentos>\${item.valor_emolumentos}</tns:ValorEmolumentos>
        <tns:DataProtocolo>\${item.data_protocolo}</tns:DataProtocolo>
        <tns:DataPrevisaoEntrega>\${item.data_previsao_entrega}</tns:DataPrevisaoEntrega>
        <tns:ModoNotificacaoStatus>\${item.modo_notificacao_status}</tns:ModoNotificacaoStatus>
        <tns:InteressadoNome>\${item.interessado_nome}</tns:InteressadoNome>
        <tns:InteressadoCPFCNPJ>\${item.interessado_cpf_cnpj}</tns:InteressadoCPFCNPJ>
        <tns:NaturezaTitulo>\${item.natureza_titulo}</tns:NaturezaTitulo>
        <tns:CodigoVerificador>\${item.codigo_verificador}</tns:CodigoVerificador>
        <tns:TipoSolicitacao>\${item.tipo_solicitacao}</tns:TipoSolicitacao>
        <tns:IDTipoStatus>\${item.id_tipo_status}</tns:IDTipoStatus>
        <tns:DataStatus>\${item.data_status}</tns:DataStatus>
        <tns:DescricaoStatus>\${item.descricao_status}</tns:DescricaoStatus>
      </tns:oRequest>
    </tns:InsertTituloAT>
  </soap:Body>
</soap:Envelope>\`;

return [{ json: { ...item, corpo_soap: corpo } }];`,
    };

    @node({
        id: '189a9164-9b62-4a13-8d11-78b61f36221a',
        name: 'consumir-soap-onr',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [2592, 1312],
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
        id: '74ba843f-abe4-441e-a247-a8528d5ec16e',
        name: 'converter-resposta-onr',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [2912, 1312],
    })
    ConverterRespostaOnr = {
        jsCode: `const entrada = $input.first().json;
const xml = entrada.data;

function mapearStatusHttp(sucesso, codigoErro) {
    if (sucesso) return 200;
    if ([2, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 25, 36].includes(codigoErro)) return 400;
    if ([45, 46, 47].includes(codigoErro)) return 401;
    if (codigoErro === 50 || codigoErro === 32) return 403;
    if (codigoErro === 0) return 502;
    if (codigoErro === 1 || codigoErro === 101) return 503;
    if (codigoErro === 501) return 422;
    return 422;
}

function dadosVazio() {
    return { id_titulo: 0, id_status: 0 };
}

function respostaErro(statusHttp, codigoErro, mensagemErro, idTitulo = 0, idStatus = 0) {
    return {
        status_http: statusHttp,
        sucesso: false,
        codigo_erro: codigoErro,
        mensagem_erro: mensagemErro,
        dados: { id_titulo: idTitulo, id_status: idStatus }
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
const id_titulo = parseInt(extrairTag('IDTitulo', xml), 10) || 0;
const id_status = parseInt(extrairTag('IDStatus', xml), 10) || 0;

return {
    json: {
        status_http: mapearStatusHttp(sucesso, codigo_erro),
        sucesso,
        codigo_erro,
        mensagem_erro,
        dados: sucesso
            ? { id_titulo, id_status }
            : { id_titulo, id_status }
    }
};`,
    };

    @node({
        id: 'dff3fc48-7fb2-4499-892c-3d60fc0a7476',
        name: 'resposta-validacao',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [2272, 1568],
    })
    RespostaValidacao = {
        jsCode: `const item = $input.first().json;

return [{
    json: {
        status_http: 400,
        sucesso: false,
        codigo_erro: item.codigo_erro,
        mensagem_erro: item.mensagem_erro,
        dados: { id_titulo: 0, id_status: 0 }
    }
}];`,
    };

    @node({
        id: 'fe1451ed-1372-4cd6-ba68-35586b20cb00',
        name: 'resposta-erro-conexao-onr',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [2912, 1568],
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
        dados: { id_titulo: 0, id_status: 0 }
    }
}];`,
    };

    @node({
        id: '48919b41-d922-46a5-8efe-391cf44c3c78',
        name: 'Respond to Webhook',
        type: 'n8n-nodes-base.respondToWebhook',
        version: 1.5,
        position: [3232, 1440],
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
