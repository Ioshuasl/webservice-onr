/**
 * Gera workflows n8n Fase 2 — Intimações (AUTONR-75, 76, 79).
 * Uso: node scripts/n8n/generate-intimacoes-fase2-workflows.cjs
 */
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '../../workflows/n8n/extensao-n8n-teste');

const COMMON_IDS = {
  creds: 'zyTOdADUUemJkEzk',
  ifCond: 'e3f4a5b6-c7d8-4e9f-a0b1-c2d3d4e5f6a7',
};

function uid(prefix, n) {
  const hex = n.toString(16).padStart(4, '0');
  return `${prefix}${hex}-0000-4000-8000-00000000000${n}`.slice(0, 36);
}

function buildWorkflow(cfg) {
  const n = cfg.nodes;
  return `import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : ${cfg.title}
// Nodes   : 10  |  Connections: 11
// </workflow-map>

@workflow({
    id: '${cfg.workflowId}',
    name: '${cfg.title}',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class ${cfg.className} {
    @node({
        id: '${n.webhook}',
        webhookId: '${cfg.webhookId}',
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [-1296, 128],
        credentials: { httpBasicAuth: { id: '${COMMON_IDS.creds}', name: 'orius - master@orius' } },
    })
    Webhook = {
        httpMethod: 'POST',
        path: '${cfg.webhookId}',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({ id: '${n.normalizar}', name: 'normalizar-entrada', type: 'n8n-nodes-base.set', version: 3.4, position: [-960, 128] })
    NormalizarEntrada = { mode: 'raw', jsonOutput: \`=${cfg.normalizeJson}\`, options: {} };

    @node({ id: '${n.validar}', name: 'validar-entrada', type: 'n8n-nodes-base.code', version: 2, position: [-640, 128] })
    ValidarEntrada = { jsCode: ${JSON.stringify(cfg.validateJs)} };

    @node({ id: '${n.if}', name: 'if-entrada-valida', type: 'n8n-nodes-base.if', version: 2.2, position: [-320, 128] })
    IfEntradaValida = {
        conditions: {
            options: { caseSensitive: true, leftValue: '', typeValidation: 'strict', version: 2 },
            conditions: [{
                id: '${COMMON_IDS.ifCond}',
                leftValue: '={{ $json.entrada_valida }}',
                rightValue: '',
                operator: { type: 'boolean', operation: 'true', singleValue: true },
            }],
            combinator: 'and',
        },
        options: {},
    };

    @node({ id: '${n.montar}', name: 'montar-envelope-soap', type: 'n8n-nodes-base.code', version: 2, position: [0, 0] })
    MontarEnvelopeSoap = { jsCode: ${JSON.stringify(cfg.mountSoapJs)} };

    @node({
        id: '${n.consumir}',
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

    @node({ id: '${n.converter}', name: 'converter-resposta-onr', type: 'n8n-nodes-base.code', version: 2, position: [640, 0] })
    ConverterRespostaOnr = { jsCode: ${JSON.stringify(cfg.converterJs)} };

    @node({ id: '${n.respVal}', name: 'resposta-validacao', type: 'n8n-nodes-base.code', version: 2, position: [0, 256] })
    RespostaValidacao = { jsCode: ${JSON.stringify(cfg.respostaValidacaoJs)} };

    @node({ id: '${n.respErr}', name: 'resposta-erro-conexao-onr', type: 'n8n-nodes-base.code', version: 2, position: [640, 256] })
    RespostaErroConexaoOnr = { jsCode: ${JSON.stringify(cfg.respostaErroJs)} };

    @node({ id: '${n.respond}', name: 'Respond to Webhook', type: 'n8n-nodes-base.respondToWebhook', version: 1.5, position: [960, 128] })
    RespondToWebhook = { options: { responseCode: '={{ $json.status_http }}' } };

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
`;
}

const MAPEAR_STATUS = `function mapearStatusHttp(sucesso, codigoErro, origem = 'onr') {
    if (sucesso) return 200;
    if (origem === 'validacao') return 400;
    if ([2, 10, 11, 12, 13, 14, 15, 16, 17, 30].includes(codigoErro)) return 400;
    if ([45, 46, 47].includes(codigoErro)) return 401;
    if ([51, 52, 53, 54, 55, 56, 57, 58].includes(codigoErro)) return 404;
    if (codigoErro === 0) return 502;
    if (codigoErro === 1) return 503;
    return 422;
}

function extrairTag(tag, origem) {
    const regex = new RegExp(\`<(?:\\\\w+:)?\${tag}>(.*?)</(?:\\\\w+:)?\${tag}>\`, 'is');
    const match = origem.match(regex);
    return match ? match[1].trim() : '';
}`;

const ESCAPE_XML = `function escapeXml(valor) {
    return String(valor ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}`;

const HASH_VALIDATE = `const hash = String(item.hash ?? '').trim().toUpperCase();
if (!hash) {
    entrada_valida = false; codigo_erro = 11; mensagem_erro = 'O hash de validação não foi informado.';
} else if (!/^[0-9A-F]{40}$/.test(hash)) {
    entrada_valida = false; codigo_erro = 11; mensagem_erro = 'Hash inválido: informe 40 caracteres hexadecimais maiúsculos.';
}`;

const URL_VALIDATE = `const urlServico = String(item.url_servico_onr ?? '').trim();
if (entrada_valida && !urlServico) {
    entrada_valida = false; codigo_erro = 10; mensagem_erro = 'url_servico_onr é obrigatória.';
}`;

const DETALHES_CONVERTER_HELPERS = `function inteiro(tag, origem) { return parseInt(extrairTag(tag, origem), 10) || 0; }
function decimal(tag, origem) { const v = extrairTag(tag, origem); return v === '' ? 0 : Number(v); }
function extrairBlocos(origem, nome) {
    const itens = [];
    const regex = new RegExp(\`<(?:\\\\w+:)?\${nome}[^>]*>([\\\\s\\\\S]*?)<\\\\/(?:\\\\w+:)?\${nome}>\`, 'g');
    let match;
    while ((match = regex.exec(origem)) !== null) itens.push(match[1]);
    return itens;
}
function mapPrenotacao(b) {
    return { numero: extrairTag('Numero', b), data: extrairTag('Data', b), data_vencimento: extrairTag('DataVencimento', b), valor_servico: decimal('ValorServico', b) };
}
function mapDevedor(b) {
    return { nome: extrairTag('Nome', b), participacao: extrairTag('Participacao', b), documento: extrairTag('CPFCNPJ', b), email: extrairTag('Email', b) };
}
function mapImovel(b) { return { matricula: extrairTag('Matricula', b) }; }
function mapEndereco(b) { return { nome_devedor: extrairTag('NomeDevedor', b), endereco_completo: extrairTag('EnderecoCompleto', b) }; }
function mapReingresso(b) { return { protocolo: extrairTag('Protocolo', b), data_prenotacao: extrairTag('DataPrenotacao', b) }; }
function mapBoleto(b) { return { data_vencimento: extrairTag('DataVencimento', b), valor: decimal('Valor', b), url: extrairTag('URL', b) }; }
function mapPrestacao(b) { return { numero: extrairTag('Numero', b), data_vencimento: extrairTag('DataVencimento', b), valor: decimal('Valor', b) }; }
function mapPurga(b) { return { data_vencimento: extrairTag('DataVencimento', b), valor: decimal('Valor', b) }; }`;

const workflows = [
  {
    file: 'Get Detalhes IN V2.workflow.ts',
    title: '[AUTONR-76] (webservice ONR) GetDetalhesIN_V2 - Intimações',
    className: 'Autonr76WebserviceOnrGetdetalhesinV2IntimacoesWorkflow',
    workflowId: 'kM76GetDetalhesINV2',
    webhookId: 'c876i008-7e5f-0a1b-82c3-456789013abc',
    nodes: {
      webhook: uid('a876', 1), normalizar: uid('b876', 2), validar: uid('c876', 3),
      if: uid('d876', 4), montar: uid('e876', 5), consumir: uid('f876', 6),
      converter: uid('a876', 7), respVal: uid('b876', 8), respErr: uid('c876', 9), respond: uid('d876', 10),
    },
    normalizeJson: `{
  "hash": "{{ $json.body.hash }}",
  "id_pedido": {{ $json.body.id_pedido ?? 0 }},
  "url_servico_onr": "{{ $json.body.url_servico_onr ?? 'https://hml3-wsoficio.onr.org.br/intimacoes.asmx' }}"
}`,
    validateJs: `const item = $input.first().json;
let entrada_valida = true; let codigo_erro = 0; let mensagem_erro = '';
function normalizarInteiro(v) { const n = Number(v); return Number.isInteger(n) ? n : NaN; }
${HASH_VALIDATE}
const idPedido = normalizarInteiro(item.id_pedido);
${URL_VALIDATE}
if (entrada_valida && (!Number.isFinite(idPedido) || idPedido < 1)) {
    entrada_valida = false; codigo_erro = 12; mensagem_erro = 'id_pedido inválido: informe um inteiro positivo.';
}
return [{ json: { ...item, hash, id_pedido: idPedido, url_servico_onr: urlServico, entrada_valida, codigo_erro, mensagem_erro } }];`,
    mountSoapJs: `${ESCAPE_XML}
const item = $input.first().json;
const corpo = \`<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <tns:GetDetalhesIN_V2 xmlns:tns="http://tempuri.org/WSOficio">
      <tns:oRequest>
        <tns:Hash>\${escapeXml(item.hash)}</tns:Hash>
        <tns:IDPedido>\${item.id_pedido}</tns:IDPedido>
      </tns:oRequest>
    </tns:GetDetalhesIN_V2>
  </soap:Body>
</soap:Envelope>\`;
return [{ json: { ...item, corpo_soap: corpo } }];`,
    converterJs: `${MAPEAR_STATUS}
const xml = $input.first().json.data;
function dadosVazio() { return { id_pedido: 0, operacao_soap: 'GetDetalhesIN_V2' }; }
function respostaErro(s, c, m) { return { status_http: s, sucesso: false, codigo_erro: c, mensagem_erro: m, dados: dadosVazio() }; }
${DETALHES_CONVERTER_HELPERS}
if (!xml || typeof xml !== 'string') return { json: respostaErro(502, 0, 'Resposta inválida da ONR: XML não encontrado.') };
const sucesso = extrairTag('RETORNO', xml).toLowerCase() === 'true';
const codigo_erro = parseInt(extrairTag('CODIGOERRO', xml) || '0', 10);
const mensagem_erro = extrairTag('ERRODESCRICAO', xml);
if (!sucesso) return { json: respostaErro(mapearStatusHttp(false, codigo_erro, 'onr'), codigo_erro, mensagem_erro) };
return { json: {
    status_http: 200, sucesso: true, codigo_erro, mensagem_erro,
    dados: {
        operacao_soap: 'GetDetalhesIN_V2',
        id_pedido: inteiro('IDPedido', xml),
        id_status: inteiro('IDStatus', xml),
        protocolo: extrairTag('Protocolo', xml),
        estado: extrairTag('Estado', xml),
        cidade: extrairTag('Cidade', xml),
        id_cartorio: inteiro('IDCartorio', xml),
        cartorio: extrairTag('Cartorio', xml),
        numero_contrato: extrairTag('NumeroContrato', xml),
        data_remessa: extrairTag('DataRemessa', xml),
        solicitante: extrairTag('Solicitante', xml),
        solicitante_documento: extrairTag('SolicitanteCPFCNPJ', xml),
        solicitante_im: extrairTag('SolicitanteIM', xml),
        solicitante_logradouro: extrairTag('SolicitanteEndereco', xml),
        solicitante_numero: extrairTag('SolicitanteNumero', xml),
        solicitante_complemento: extrairTag('SolicitanteComplemento', xml),
        solicitante_bairro: extrairTag('SolicitanteBairro', xml),
        solicitante_cidade: extrairTag('SolicitanteCidade', xml),
        solicitante_estado: extrairTag('SolicitanteEstado', xml),
        solicitante_cep: extrairTag('SolicitanteCEP', xml),
        solicitante_ddd: extrairTag('SolicitanteDDD', xml),
        solicitante_telefone: extrairTag('SolicitanteTelefone', xml),
        solicitante_email: extrairTag('SolicitanteEmail', xml),
        credor: extrairTag('Credor', xml),
        credor_documento: extrairTag('CredorCPFCNPJ', xml),
        credor_im: extrairTag('CredorIM', xml),
        credor_logradouro: extrairTag('CredorEndereco', xml),
        credor_numero: extrairTag('CredorNumero', xml),
        credor_complemento: extrairTag('CredorComplemento', xml),
        credor_bairro: extrairTag('CredorBairro', xml),
        credor_cidade: extrairTag('CredorCidade', xml),
        credor_estado: extrairTag('CredorEstado', xml),
        credor_cep: extrairTag('CredorCEP', xml),
        credor_ddd: extrairTag('CredorDDD', xml),
        credor_telefone: extrairTag('CredorTelefone', xml),
        credor_email: extrairTag('CredorEmail', xml),
        prestacao_agencia: extrairTag('PrestacaoAgencia', xml),
        prestacao_endereco: extrairTag('PrestacaoEndereco', xml),
        tipo_cobranca: inteiro('TipoCobranca', xml),
        prenotacoes: extrairBlocos(xml, 'GetDetalhesIN_Prenotacao_WSResp').map(mapPrenotacao),
        devedores: extrairBlocos(xml, 'GetDetalhesIN_Devedor_WSResp').map(mapDevedor),
        imoveis: extrairBlocos(xml, 'GetDetalhesIN_Imovel_WSResp').map(mapImovel),
        enderecos_intimacao: extrairBlocos(xml, 'GetDetalhesIN_EnderecoIntimacao_WSResp').map(mapEndereco),
        reingressos: extrairBlocos(xml, 'GetDetalhesIN_Reingresso_WSResp').map(mapReingresso),
        boletos: extrairBlocos(xml, 'GetDetalhesIN_Boleto_WSResp').map(mapBoleto),
        prestacoes_vencidas: extrairBlocos(xml, 'GetDetalhesIN_PrestacaoVencida_WSResp').map(mapPrestacao),
        purgas: extrairBlocos(xml, 'GetDetalhesIN_Purga_WSResp').map(mapPurga),
    }
}};`,
    respostaValidacaoJs: `const item = $input.first().json;
return [{ json: { status_http: 400, sucesso: false, codigo_erro: item.codigo_erro, mensagem_erro: item.mensagem_erro, dados: { id_pedido: item.id_pedido ?? 0, operacao_soap: 'GetDetalhesIN_V2' } } }];`,
    respostaErroJs: `const erro = $input.first().json;
return [{ json: { status_http: 502, sucesso: false, codigo_erro: 0, mensagem_erro: erro.error?.message || erro.message || 'Falha ao conectar com a ONR.', dados: { id_pedido: erro.id_pedido ?? 0, operacao_soap: 'GetDetalhesIN_V2' } } }];`,
  },
  {
    file: 'Get Emolumentos IN.workflow.ts',
    title: '[AUTONR-79] (webservice ONR) GetEmolumentosIN - Intimações',
    className: 'Autonr79WebserviceOnrGetemolumentosinIntimacoesWorkflow',
    workflowId: 'kM79GetEmolumentosIN',
    webhookId: 'c879i009-8f60-1b2c-93d4-567890124def',
    nodes: {
      webhook: uid('a879', 1), normalizar: uid('b879', 2), validar: uid('c879', 3),
      if: uid('d879', 4), montar: uid('e879', 5), consumir: uid('f879', 6),
      converter: uid('a879', 7), respVal: uid('b879', 8), respErr: uid('c879', 9), respond: uid('d879', 10),
    },
    normalizeJson: `{
  "hash": "{{ $json.body.hash }}",
  "id_pedido": {{ $json.body.id_pedido ?? 0 }},
  "url_servico_onr": "{{ $json.body.url_servico_onr ?? 'https://hml3-wsoficio.onr.org.br/intimacoes.asmx' }}"
}`,
    validateJs: `const item = $input.first().json;
let entrada_valida = true; let codigo_erro = 0; let mensagem_erro = '';
function normalizarInteiro(v) { const n = Number(v); return Number.isInteger(n) ? n : NaN; }
${HASH_VALIDATE}
const idPedido = normalizarInteiro(item.id_pedido);
${URL_VALIDATE}
if (entrada_valida && (!Number.isFinite(idPedido) || idPedido < 1)) {
    entrada_valida = false; codigo_erro = 12; mensagem_erro = 'id_pedido inválido: informe um inteiro positivo.';
}
return [{ json: { ...item, hash, id_pedido: idPedido, url_servico_onr: urlServico, entrada_valida, codigo_erro, mensagem_erro } }];`,
    mountSoapJs: `${ESCAPE_XML}
const item = $input.first().json;
const corpo = \`<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <tns:GetEmolumentosIN xmlns:tns="http://tempuri.org/WSOficio">
      <tns:oRequest>
        <tns:Hash>\${escapeXml(item.hash)}</tns:Hash>
        <tns:IDPedido>\${item.id_pedido}</tns:IDPedido>
      </tns:oRequest>
    </tns:GetEmolumentosIN>
  </soap:Body>
</soap:Envelope>\`;
return [{ json: { ...item, corpo_soap: corpo } }];`,
    converterJs: `${MAPEAR_STATUS}
const xml = $input.first().json.data;
function dadosVazio() { return { emolumentos: [], operacao_soap: 'GetEmolumentosIN' }; }
function respostaErro(s, c, m) { return { status_http: s, sucesso: false, codigo_erro: c, mensagem_erro: m, dados: dadosVazio() }; }
function decimal(tag, origem) { const v = extrairTag(tag, origem); return v === '' ? 0 : Number(v); }
function extrairEmolumentos(origem) {
    const itens = [];
    const regex = /<(?:\\w+:)?GetEmolumentosIN_Emolumento_WSResp[^>]*>([\\s\\S]*?)<\\/(?:\\w+:)?GetEmolumentosIN_Emolumento_WSResp>/g;
    let match;
    while ((match = regex.exec(origem)) !== null) {
        const b = match[1];
        itens.push({
            id_emolumento: parseInt(extrairTag('IDEmolumento', b), 10) || 0,
            data: extrairTag('Data', b),
            protocolo_pagamento: extrairTag('ProtocoloPagamento', b),
            status: extrairTag('Status', b),
            descricao: extrairTag('Descricao', b),
            valor: decimal('Valor', b),
            pago: extrairTag('Pago', b).toLowerCase() === 'true',
            data_compensacao: extrairTag('DataCompensacao', b),
            data_repasse: extrairTag('DataRepasse', b),
        });
    }
    return itens;
}
if (!xml || typeof xml !== 'string') return { json: respostaErro(502, 0, 'Resposta inválida da ONR: XML não encontrado.') };
const sucesso = extrairTag('RETORNO', xml).toLowerCase() === 'true';
const codigo_erro = parseInt(extrairTag('CODIGOERRO', xml) || '0', 10);
const mensagem_erro = extrairTag('ERRODESCRICAO', xml);
if (!sucesso) return { json: respostaErro(mapearStatusHttp(false, codigo_erro, 'onr'), codigo_erro, mensagem_erro) };
const emolumentos = extrairEmolumentos(xml);
return { json: {
    status_http: 200, sucesso: true, codigo_erro, mensagem_erro,
    dados: {
        operacao_soap: 'GetEmolumentosIN',
        id_pedido: $('validar-entrada').first().json.id_pedido,
        quantidade_emolumentos: emolumentos.length,
        emolumentos,
    }
}};`,
    respostaValidacaoJs: `const item = $input.first().json;
return [{ json: { status_http: 400, sucesso: false, codigo_erro: item.codigo_erro, mensagem_erro: item.mensagem_erro, dados: { emolumentos: [], operacao_soap: 'GetEmolumentosIN' } } }];`,
    respostaErroJs: `const erro = $input.first().json;
return [{ json: { status_http: 502, sucesso: false, codigo_erro: 0, mensagem_erro: erro.error?.message || erro.message || 'Falha ao conectar com a ONR.', dados: { emolumentos: [], operacao_soap: 'GetEmolumentosIN' } } }];`,
  },
  {
    file: 'Adicionar Mensagem IN.workflow.ts',
    title: '[AUTONR-75] (webservice ONR) AdicionarMensagemIN - Intimações',
    className: 'Autonr75WebserviceOnrAdicionarmensageminIntimacoesWorkflow',
    workflowId: 'kM75AdicionarMensagemIN',
    webhookId: 'c875i007-6d4e-5f0a-71b2-345678902def',
    nodes: {
      webhook: uid('a875', 1), normalizar: uid('b875', 2), validar: uid('c875', 3),
      if: uid('d875', 4), montar: uid('e875', 5), consumir: uid('f875', 6),
      converter: uid('a875', 7), respVal: uid('b875', 8), respErr: uid('c875', 9), respond: uid('d875', 10),
    },
    normalizeJson: `{
  "hash": "{{ $json.body.hash }}",
  "id_intimacao": {{ $json.body.id_intimacao ?? 0 }},
  "id_status": {{ $json.body.id_status ?? 0 }},
  "assunto": "{{ $json.body.assunto ?? '' }}",
  "mensagem": "{{ $json.body.mensagem ?? '' }}",
  "urls_anexos": {{ JSON.stringify($json.body.urls_anexos ?? []) }},
  "numero_prenotacao": "{{ $json.body.numero_prenotacao ?? '' }}",
  "data_prenotacao": "{{ $json.body.data_prenotacao ?? '' }}",
  "vencimento_prenotacao": "{{ $json.body.vencimento_prenotacao ?? '' }}",
  "valor_prenotacao": "{{ $json.body.valor_prenotacao ?? '' }}",
  "tipo_destinacao_mutuo": {{ $json.body.tipo_destinacao_mutuo ?? 0 }},
  "tipo_determinacao_judicial": {{ $json.body.tipo_determinacao_judicial ?? 0 }},
  "valor_servico": "{{ $json.body.valor_servico ?? '' }}",
  "data_pagamento": "{{ $json.body.data_pagamento ?? '' }}",
  "valor_pagamento": "{{ $json.body.valor_pagamento ?? '' }}",
  "url_servico_onr": "{{ $json.body.url_servico_onr ?? 'https://hml3-wsoficio.onr.org.br/intimacoes.asmx' }}"
}`,
    validateJs: `const item = $input.first().json;
let entrada_valida = true; let codigo_erro = 0; let mensagem_erro = '';
function normalizarInteiro(v) { const n = Number(v); return Number.isInteger(n) ? n : NaN; }
${HASH_VALIDATE}
const idIntimacao = normalizarInteiro(item.id_intimacao);
const idStatus = normalizarInteiro(item.id_status);
const assunto = String(item.assunto ?? '').trim();
const mensagem = String(item.mensagem ?? '').trim();
const urlsAnexos = Array.isArray(item.urls_anexos) ? item.urls_anexos.map((u) => String(u ?? '').trim()).filter(Boolean) : [];
const numeroPrenotacao = String(item.numero_prenotacao ?? '').trim();
const dataPrenotacao = String(item.data_prenotacao ?? '').trim();
const vencimentoPrenotacao = String(item.vencimento_prenotacao ?? '').trim();
const valorPrenotacao = String(item.valor_prenotacao ?? '').trim();
const tipoDestinacaoMutuo = normalizarInteiro(item.tipo_destinacao_mutuo);
const tipoDeterminacaoJudicial = normalizarInteiro(item.tipo_determinacao_judicial);
const valorServico = String(item.valor_servico ?? '').trim();
const dataPagamento = String(item.data_pagamento ?? '').trim();
const valorPagamento = String(item.valor_pagamento ?? '').trim();
${URL_VALIDATE}
if (entrada_valida && (!Number.isFinite(idIntimacao) || idIntimacao < 1)) { entrada_valida = false; codigo_erro = 12; mensagem_erro = 'id_intimacao inválido: informe um inteiro positivo.'; }
else if (entrada_valida && (!Number.isFinite(idStatus) || idStatus < 1)) { entrada_valida = false; codigo_erro = 13; mensagem_erro = 'id_status inválido: informe um status habilitado (> 0).'; }
else if (entrada_valida && !assunto) { entrada_valida = false; codigo_erro = 14; mensagem_erro = 'O assunto da mensagem deve ser informado.'; }
else if (entrada_valida && !mensagem) { entrada_valida = false; codigo_erro = 15; mensagem_erro = 'O texto da mensagem não foi informado.'; }
else if (entrada_valida && [3, 10, 12, 23, 25].includes(idStatus) && urlsAnexos.length === 0) { entrada_valida = false; codigo_erro = 10; mensagem_erro = 'urls_anexos é obrigatório para o status informado.'; }
else if (entrada_valida && idStatus === 4) {
    if (!numeroPrenotacao) { entrada_valida = false; codigo_erro = 20; mensagem_erro = 'numero_prenotacao é obrigatório para status Prenotado (4).'; }
    else if (!dataPrenotacao) { entrada_valida = false; codigo_erro = 21; mensagem_erro = 'data_prenotacao é obrigatória para status Prenotado (4).'; }
    else if (!vencimentoPrenotacao) { entrada_valida = false; codigo_erro = 23; mensagem_erro = 'vencimento_prenotacao é obrigatório para status Prenotado (4).'; }
    else if (!valorPrenotacao) { entrada_valida = false; codigo_erro = 10; mensagem_erro = 'valor_prenotacao é obrigatório para status Prenotado (4).'; }
    else if (!Number.isFinite(tipoDestinacaoMutuo) || tipoDestinacaoMutuo < 1 || tipoDestinacaoMutuo > 20) { entrada_valida = false; codigo_erro = 10; mensagem_erro = 'tipo_destinacao_mutuo inválido: use 1 a 20 para status Prenotado (4).'; }
}
else if (entrada_valida && idStatus === 28 && (!Number.isFinite(tipoDeterminacaoJudicial) || tipoDeterminacaoJudicial < 1 || tipoDeterminacaoJudicial > 2)) {
    entrada_valida = false; codigo_erro = 10; mensagem_erro = 'tipo_determinacao_judicial inválido: use 1 ou 2 para status 28.';
}
else if (entrada_valida && [6, 22].includes(idStatus) && !valorServico) { entrada_valida = false; codigo_erro = 26; mensagem_erro = 'valor_servico é obrigatório para status Boleto (6 ou 22).'; }
else if (entrada_valida && idStatus === 14) {
    if (!dataPagamento) { entrada_valida = false; codigo_erro = 29; mensagem_erro = 'data_pagamento é obrigatória para status Pagamento Cartório (14).'; }
    else if (!valorPagamento) { entrada_valida = false; codigo_erro = 31; mensagem_erro = 'valor_pagamento é obrigatório para status Pagamento Cartório (14).'; }
}
return [{ json: {
    ...item, hash, id_intimacao: idIntimacao, id_status: idStatus, assunto, mensagem, urls_anexos: urlsAnexos,
    numero_prenotacao: numeroPrenotacao, data_prenotacao: dataPrenotacao, vencimento_prenotacao: vencimentoPrenotacao,
    valor_prenotacao: valorPrenotacao, tipo_destinacao_mutuo: Number.isFinite(tipoDestinacaoMutuo) ? tipoDestinacaoMutuo : 0,
    tipo_determinacao_judicial: Number.isFinite(tipoDeterminacaoJudicial) ? tipoDeterminacaoJudicial : 0,
    valor_servico: valorServico, data_pagamento: dataPagamento, valor_pagamento: valorPagamento,
    url_servico_onr: urlServico, entrada_valida, codigo_erro, mensagem_erro
} }];`,
    mountSoapJs: `${ESCAPE_XML}
const item = $input.first().json;
const urlsAnexos = (item.urls_anexos || []).map((url) => \`          <tns:string>\${escapeXml(url)}</tns:string>\`).join('\\n');
const blocoAnexos = urlsAnexos
    ? \`<tns:URLAnexos>\\n\${urlsAnexos}\\n        </tns:URLAnexos>\`
    : '<tns:URLAnexos/>';
const corpo = \`<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <tns:AdicionarMensagemIN xmlns:tns="http://tempuri.org/WSOficio">
      <tns:oRequest>
        <tns:Hash>\${escapeXml(item.hash)}</tns:Hash>
        <tns:IDIntimacao>\${item.id_intimacao}</tns:IDIntimacao>
        <tns:IDStatus>\${item.id_status}</tns:IDStatus>
        <tns:Assunto>\${escapeXml(item.assunto)}</tns:Assunto>
        <tns:Mensagem>\${escapeXml(item.mensagem)}</tns:Mensagem>
        \${blocoAnexos}
        <tns:NumeroPrenotacao>\${escapeXml(item.numero_prenotacao)}</tns:NumeroPrenotacao>
        <tns:DataPrenotacao>\${escapeXml(item.data_prenotacao)}</tns:DataPrenotacao>
        <tns:VencimentoPrenotacao>\${escapeXml(item.vencimento_prenotacao)}</tns:VencimentoPrenotacao>
        <tns:ValorPrenotacao>\${escapeXml(item.valor_prenotacao)}</tns:ValorPrenotacao>
        <tns:TipoDestinacaoMutuo>\${item.tipo_destinacao_mutuo}</tns:TipoDestinacaoMutuo>
        <tns:TipoDeterminacaoJudicial>\${item.tipo_determinacao_judicial}</tns:TipoDeterminacaoJudicial>
        <tns:ValorServico>\${escapeXml(item.valor_servico)}</tns:ValorServico>
        <tns:DataPagamento>\${escapeXml(item.data_pagamento)}</tns:DataPagamento>
        <tns:ValorPagamento>\${escapeXml(item.valor_pagamento)}</tns:ValorPagamento>
      </tns:oRequest>
    </tns:AdicionarMensagemIN>
  </soap:Body>
</soap:Envelope>\`;
return [{ json: { ...item, corpo_soap: corpo } }];`,
    converterJs: `${MAPEAR_STATUS}
const xml = $input.first().json.data;
function dadosVazio() { return { id_pagamento: 0, url_boleto: '', operacao_soap: 'AdicionarMensagemIN' }; }
function respostaErro(s, c, m) { return { status_http: s, sucesso: false, codigo_erro: c, mensagem_erro: m, dados: dadosVazio() }; }
function inteiro(tag, origem) { return parseInt(extrairTag(tag, origem), 10) || 0; }
if (!xml || typeof xml !== 'string') return { json: respostaErro(502, 0, 'Resposta inválida da ONR: XML não encontrado.') };
const sucesso = extrairTag('RETORNO', xml).toLowerCase() === 'true';
const codigo_erro = parseInt(extrairTag('CODIGOERRO', xml) || '0', 10);
const mensagem_erro = extrairTag('ERRODESCRICAO', xml);
if (!sucesso) return { json: respostaErro(mapearStatusHttp(false, codigo_erro, 'onr'), codigo_erro, mensagem_erro) };
return { json: {
    status_http: 200, sucesso: true, codigo_erro, mensagem_erro,
    dados: {
        operacao_soap: 'AdicionarMensagemIN',
        id_intimacao: $('validar-entrada').first().json.id_intimacao,
        id_status: $('validar-entrada').first().json.id_status,
        url_boleto: extrairTag('URLBoleto', xml),
        id_pagamento: inteiro('IDPagamento', xml),
    }
}};`,
    respostaValidacaoJs: `const item = $input.first().json;
return [{ json: { status_http: 400, sucesso: false, codigo_erro: item.codigo_erro, mensagem_erro: item.mensagem_erro, dados: { id_pagamento: 0, url_boleto: '', operacao_soap: 'AdicionarMensagemIN' } } }];`,
    respostaErroJs: `const erro = $input.first().json;
return [{ json: { status_http: 502, sucesso: false, codigo_erro: 0, mensagem_erro: erro.error?.message || erro.message || 'Falha ao conectar com a ONR.', dados: { id_pagamento: 0, url_boleto: '', operacao_soap: 'AdicionarMensagemIN' } } }];`,
  },
];

for (const cfg of workflows) {
  fs.writeFileSync(path.join(OUT_DIR, cfg.file), buildWorkflow(cfg), 'utf8');
  console.log('OK', cfg.file);
}
