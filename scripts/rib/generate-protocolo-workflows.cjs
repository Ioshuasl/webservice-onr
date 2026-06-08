#!/usr/bin/env node
/**
 * Gera workflows n8n RIB protocolo AUTONR-93…102.
 * Uso: node scripts/rib/generate-protocolo-workflows.js
 */
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '../../workflows/n8n/extensao-n8n-teste');

const RIB_COMMON = `
function header(name) {
  const lower = name.toLowerCase();
  return headers[lower] ?? headers[name] ?? '';
}
function pick(...values) {
  for (const value of values) {
    const text = String(value ?? '').trim();
    if (text) return text;
  }
  return '';
}
const AMBIENTES_RIB = {
  producao: { key: 'producao', baseUrl: () => pick($env.RIB_API_BASE_URL, 'https://api.registrodeimoveis.org.br') },
  homologacao: { key: 'homologacao', baseUrl: () => pick($env.RIB_API_BASE_URL_HML, 'https://testes-api.registrodeimoveis.org.br') },
};
const AMBIENTE_ALIASES = {
  producao: 'producao', prod: 'producao', production: 'producao',
  homologacao: 'homologacao', homolog: 'homologacao', hml: 'homologacao', testes: 'homologacao',
};
function resolveAmbiente() {
  const raw = pick(query.ambiente, body.ambiente, header('x-ambiente'), $env.RIB_API_AMBIENTE, 'producao').toLowerCase();
  const key = AMBIENTE_ALIASES[raw];
  if (!key) return { invalid: true, informado: raw };
  const cfg = AMBIENTES_RIB[key];
  return { key: cfg.key, baseUrl: cfg.baseUrl() };
}
function resolveAccessToken() {
  const ribHeader = pick(header('x-rib-access-token'), header('X-RIB-Access-Token'));
  if (ribHeader) return ribHeader;
  const authHeader = pick(header('authorization'), header('Authorization'));
  const bearerMatch = authHeader.match(/^Bearer\\s+(.+)$/i);
  if (bearerMatch) return bearerMatch[1].trim();
  return pick(query.access_token, query.accessToken, query.token, body.access_token, body.accessToken, body.token);
}
function resolveProtocoloToken() {
  return pick(header('x-rib-protocolo-token'), header('X-RIB-Protocolo-Token'), query.token_protocolo, query.tokenProtocolo, body.token_protocolo, body.tokenProtocolo);
}
function encodeQueryString(params) {
  const parts = [];
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value === undefined || value === null || value === '') continue;
    parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(String(value)));
  }
  return parts.join('&');
}
function erro(status, code, message, technical) {
  const response = { sucesso: false, codigo_erro: code, mensagem_erro: message, sistema: 'RIB' };
  if (technical) response.detalhe_tecnico = technical;
  return [{ json: { valid: false, statusCode: status, response } }];
}
function parseJsonSafe(value) {
  if (value === undefined || value === null) return null;
  if (typeof value === 'object') return value;
  if (typeof value !== 'string') return null;
  try { return JSON.parse(value); } catch { return null; }
}
function normalizeHttpError(errorObject, meta, defaultMsg) {
  const rawMessage = errorObject?.message ?? defaultMsg;
  const status = Number(errorObject?.status ?? errorObject?.httpCode ?? rawMessage.match(/^\\s*(\\d{3})\\s*-/)?.[1] ?? 502);
  const parsed = parseJsonSafe(errorObject?.response?.body) ?? parseJsonSafe(errorObject?.response?.data)
    ?? (typeof errorObject?.response?.body === 'object' ? errorObject.response.body : null);
  return {
    statusCode: status === 401 ? 401 : (status || 502),
    response: {
      sucesso: false,
      codigo_erro: parsed?.codigo ?? 'rib_http_error',
      mensagem_erro: parsed?.descricao ?? parsed?.mensagem ?? rawMessage,
      campos: parsed?.campos ?? null,
      sistema: 'RIB',
      ambiente: meta.ambiente ?? null,
      meta,
      detalhe_tecnico: { name: errorObject?.name ?? null, code: errorObject?.code ?? null, status: status || null },
    },
  };
}
`;

const BUILD_ERROR_JS = `
const httpResult = items[0].json;
const entrada = $('Validar Entrada').first().json;
const meta = entrada.meta ?? {};
if (httpResult.error) {
  return [{ json: normalizeHttpError(httpResult.error, meta, entrada.errorDefaultMsg ?? 'Erro na API RIB.') }];
}
`;

const WORKFLOWS = [
  {
    autonr: 93,
    operacao: 'DetalheProtocoloV2',
    file: 'Detalhe Protocolo V2 RIB.workflow.ts',
    method: 'GET',
    webhookPath: 'rib/protocolo/detalhes',
    source: 'n8n-rib-detalhe-protocolo-v2',
    validateJs: `
const numero = pick(query.numero, query.numeroProtocolo, query.numero_protocolo, body.numero, body.numeroProtocolo);
if (!numero) return erro(422, 'numero_protocolo_ausente', 'Informe numero na query ou body.', null);
const versao = pick(query.versao, body.versao, '2');
const baseUrl = amb.baseUrl.replace(/\\/$/, '');
const encoded = encodeURIComponent(numero);
const upstreamUrl = baseUrl + '/v' + versao + '/protocolo/' + encoded + '/detalhes';
return [{ json: {
  valid: true, upstreamUrl, accessToken, protocoloToken: resolveProtocoloToken(),
  numero, versao, meta: { ambiente: amb.key, baseUrl, endpoint: '/v' + versao + '/protocolo/{numero}/detalhes', receivedAt: new Date().toISOString(), source: '${'n8n-rib-detalhe-protocolo-v2'}' },
  errorDefaultMsg: 'Erro ao obter detalhe do protocolo na API RIB.',
}}];`,
    httpHeaders: `[
      { name: 'Accept', value: 'application/json' },
      { name: 'Authorization', value: '=Bearer {{ $json.accessToken }}' },
      { name: 'access_token', value: '={{ $json.protocoloToken || "" }}' },
    ]`,
    buildJs: `
${BUILD_ERROR_JS}
const data = httpResult;
return [{ json: { statusCode: 200, response: { sucesso: true, detalhe: data, numero: entrada.numero, versao: entrada.versao, ambiente: meta.ambiente ?? null, meta } } }];
`,
  },
  {
    autonr: 94,
    operacao: 'TokenDetalheProtocolo',
    file: 'Token Detalhe Protocolo RIB.workflow.ts',
    method: 'POST',
    webhookPath: 'rib/protocolo/token',
    validateJs: `
const numero = pick(body.numero, body.numeroProtocolo, query.numero, query.numeroProtocolo);
const senha = pick(body.senha, query.senha);
const tipoSolicitacao = pick(body.tipoSolicitacao, body.tipo_solicitacao, query.tipoSolicitacao, '1');
const versao = pick(body.versao, query.versao, '2');
if (!numero) return erro(422, 'numero_protocolo_ausente', 'Informe numero no body.', null);
if (!senha) return erro(422, 'senha_ausente', 'Informe senha no body.', null);
const baseUrl = amb.baseUrl.replace(/\\/$/, '');
const upstreamUrl = baseUrl + '/v' + versao + '/protocolo/' + encodeURIComponent(numero) + '/token';
return [{ json: {
  valid: true, upstreamUrl, accessToken, upstreamBody: { senha, tipoSolicitacao: Number(tipoSolicitacao) },
  numero, versao, meta: { ambiente: amb.key, baseUrl, endpoint: '/v' + versao + '/protocolo/{numero}/token', receivedAt: new Date().toISOString(), source: 'n8n-rib-token-detalhe-protocolo' },
  errorDefaultMsg: 'Erro ao gerar token de detalhe do protocolo na API RIB.',
}}];`,
    httpMethod: 'POST',
    httpBody: `jsonBody: '={{ JSON.stringify($json.upstreamBody) }}', contentType: 'json'`,
    httpHeaders: `[
      { name: 'Accept', value: 'application/json' },
      { name: 'Authorization', value: '=Bearer {{ $json.accessToken }}' },
      { name: 'Content-Type', value: 'application/json' },
    ]`,
    buildJs: `
${BUILD_ERROR_JS}
const data = httpResult;
return [{ json: { statusCode: 201, response: { sucesso: true, access_token: data.access_token ?? null, expires_in: data.expires_in ?? null, token_type: data.token_type ?? null, numero: entrada.numero, versao: entrada.versao, ambiente: meta.ambiente ?? null, meta } } }];
`,
  },
  {
    autonr: 95,
    operacao: 'DetalheBasicoProtocolo',
    file: 'Detalhe Basico Protocolo RIB.workflow.ts',
    method: 'GET',
    webhookPath: 'rib/protocolo/basico',
    validateJs: `
const numero = pick(query.numero, query.numeroProtocolo, body.numero, body.numeroProtocolo);
if (!numero) return erro(422, 'numero_protocolo_ausente', 'Informe numero na query.', null);
const baseUrl = amb.baseUrl.replace(/\\/$/, '');
const upstreamUrl = baseUrl + '/v1/protocolo/' + encodeURIComponent(numero);
return [{ json: {
  valid: true, upstreamUrl, accessToken, numero,
  meta: { ambiente: amb.key, baseUrl, endpoint: '/v1/protocolo/{numero}', receivedAt: new Date().toISOString(), source: 'n8n-rib-detalhe-basico-protocolo' },
  errorDefaultMsg: 'Erro ao obter resumo do protocolo na API RIB.',
}}];`,
    buildJs: `
${BUILD_ERROR_JS}
return [{ json: { statusCode: 200, response: { sucesso: true, protocolo: httpResult, numero: entrada.numero, ambiente: meta.ambiente ?? null, meta } } }];
`,
  },
  {
    autonr: 96,
    operacao: 'DownloadAnexoProtocolo',
    file: 'Download Anexo Protocolo RIB.workflow.ts',
    method: 'GET',
    webhookPath: 'rib/protocolo/download',
    validateJs: `
const numero = pick(query.numero, query.numeroProtocolo, body.numero);
const hashArquivo = pick(query.hash_arquivo, query.hashArquivo, body.hash_arquivo, body.hashArquivo);
if (!numero) return erro(422, 'numero_protocolo_ausente', 'Informe numero na query.', null);
if (!hashArquivo) return erro(422, 'hash_arquivo_ausente', 'Informe hash_arquivo na query.', null);
const baseUrl = amb.baseUrl.replace(/\\/$/, '');
const upstreamUrl = baseUrl + '/v1/protocolo/' + encodeURIComponent(numero) + '/download/' + encodeURIComponent(hashArquivo);
return [{ json: {
  valid: true, upstreamUrl, accessToken, protocoloToken: resolveProtocoloToken(), numero, hashArquivo,
  meta: { ambiente: amb.key, baseUrl, endpoint: '/v1/protocolo/{numero}/download/{hash}', receivedAt: new Date().toISOString(), source: 'n8n-rib-download-anexo-protocolo' },
  errorDefaultMsg: 'Erro ao baixar anexo do protocolo na API RIB.',
}}];`,
    httpHeaders: `[
      { name: 'Authorization', value: '=Bearer {{ $json.accessToken }}' },
      { name: 'access_token', value: '={{ $json.protocoloToken || "" }}' },
    ]`,
    httpOptions: `options: { response: { response: { fullResponse: true, responseFormat: 'file' } } }`,
    buildJs: `
const entrada = $('Validar Entrada').first().json;
const meta = entrada.meta ?? {};
const item = items[0];
if (item.json?.error) {
  return [{ json: normalizeHttpError(item.json.error, meta, 'Erro ao baixar anexo na API RIB.') }];
}
let base64 = null;
let contentType = 'application/octet-stream';
let fileName = entrada.hashArquivo;
const bin = item.binary?.data ?? item.binary?.file;
if (bin?.data) {
  base64 = bin.data;
  contentType = bin.mimeType ?? bin.fileType ?? contentType;
  fileName = bin.fileName ?? fileName;
} else if (typeof item.json === 'string') {
  base64 = Buffer.from(item.json, 'utf8').toString('base64');
} else if (item.json?.data) {
  base64 = item.json.data;
}
return [{ json: { statusCode: 200, response: { sucesso: true, numero: entrada.numero, hash_arquivo: entrada.hashArquivo, content_type: contentType, file_name: fileName, conteudo_base64: base64, ambiente: meta.ambiente ?? null, meta } } }];
`,
  },
  {
    autonr: 97,
    operacao: 'EnvioProtocoloOnline',
    file: 'Envio Protocolo Online RIB.workflow.ts',
    method: 'POST',
    webhookPath: 'rib/protocolo/envio',
    validateJs: `
const payload = body && typeof body === 'object' && !Array.isArray(body) ? body : null;
if (!payload || !pick(payload.protocolo)) {
  return erro(422, 'body_invalido', 'Envie JSON com campo protocolo (cadastro RFP-01).', null);
}
const baseUrl = amb.baseUrl.replace(/\\/$/, '');
return [{ json: {
  valid: true, upstreamUrl: baseUrl + '/v1/protocolo', accessToken, upstreamBody: payload,
  meta: { ambiente: amb.key, baseUrl, endpoint: '/v1/protocolo', receivedAt: new Date().toISOString(), source: 'n8n-rib-envio-protocolo-online' },
  errorDefaultMsg: 'Erro ao enviar protocolo online na API RIB.',
}}];`,
    httpMethod: 'POST',
    httpBody: `jsonBody: '={{ JSON.stringify($json.upstreamBody) }}', contentType: 'json'`,
    buildJs: `
${BUILD_ERROR_JS}
const data = httpResult;
const statusCode = data.hash ? 201 : 200;
return [{ json: { statusCode, response: { sucesso: true, resultado: data, alertas: data.alertas ?? [], ambiente: meta.ambiente ?? null, meta } } }];
`,
  },
  {
    autonr: 98,
    operacao: 'EnvioProtocoloLote',
    file: 'Envio Protocolo Lote RIB.workflow.ts',
    method: 'POST',
    webhookPath: 'rib/protocolo/lote',
    validateJs: `
let payload = body;
if (payload?.lote && Array.isArray(payload.lote)) payload = payload.lote;
if (!Array.isArray(payload) || payload.length === 0) {
  return erro(422, 'body_invalido', 'Envie array JSON de protocolos (RFP-02) ou { lote: [...] }.', null);
}
const baseUrl = amb.baseUrl.replace(/\\/$/, '');
return [{ json: {
  valid: true, upstreamUrl: baseUrl + '/v1/protocolo/lote', accessToken, upstreamBody: payload,
  meta: { ambiente: amb.key, baseUrl, endpoint: '/v1/protocolo/lote', receivedAt: new Date().toISOString(), source: 'n8n-rib-envio-protocolo-lote' },
  errorDefaultMsg: 'Erro ao enviar lote de protocolos na API RIB.',
}}];`,
    httpMethod: 'POST',
    httpBody: `jsonBody: '={{ JSON.stringify($json.upstreamBody) }}', contentType: 'json'`,
    buildJs: `
${BUILD_ERROR_JS}
const data = httpResult;
return [{ json: { statusCode: 202, response: { sucesso: true, hash_fila: data.hash ?? data.hashFila ?? null, alertas: data.alertas ?? [], resultado: data, ambiente: meta.ambiente ?? null, meta } } }];
`,
  },
  {
    autonr: 99,
    operacao: 'ListagemFilaProtocolo',
    file: 'Listagem Fila Protocolo RIB.workflow.ts',
    method: 'GET',
    webhookPath: 'rib/fila/processamento/protocolo',
    validateJs: `
const QUERY_KEYS = ['registrosPorPagina','numeroPagina','situacao','dataInicialCadastro','dataFinalCadastro'];
const params = {};
for (const src of [query, body]) {
  for (const [k, v] of Object.entries(src ?? {})) {
    if (v === '' || v == null) continue;
    if (QUERY_KEYS.includes(k)) params[k] = String(v).trim();
  }
}
const qs = encodeQueryString(params);
const baseUrl = amb.baseUrl.replace(/\\/$/, '');
const upstreamUrl = baseUrl + '/v1/fila/processamento/protocolo' + (qs ? '?' + qs : '');
return [{ json: {
  valid: true, upstreamUrl, accessToken, queryParams: params,
  meta: { ambiente: amb.key, baseUrl, endpoint: '/v1/fila/processamento/protocolo', receivedAt: new Date().toISOString(), source: 'n8n-rib-listagem-fila-protocolo' },
  errorDefaultMsg: 'Erro ao listar fila de processamento na API RIB.',
}}];`,
    buildJs: `
${BUILD_ERROR_JS}
const data = httpResult;
const filas = Array.isArray(data.dados) ? data.dados : [];
return [{ json: { statusCode: 200, response: { sucesso: true, total_registros: data.totalRegistros ?? filas.length, total_paginas: data.totalPaginas ?? null, pagina_atual: data.paginaAtual ?? null, filas, filtros: entrada.queryParams ?? {}, ambiente: meta.ambiente ?? null, meta } } }];
`,
  },
  {
    autonr: 100,
    operacao: 'DetalheFilaProtocolo',
    file: 'Detalhe Fila Protocolo RIB.workflow.ts',
    method: 'GET',
    webhookPath: 'rib/fila/processamento/protocolo/detalhe',
    validateJs: `
const hashFila = pick(query.hash_fila, query.hashFila, body.hash_fila, body.hashFila);
if (!hashFila) return erro(422, 'hash_fila_ausente', 'Informe hash_fila na query.', null);
const baseUrl = amb.baseUrl.replace(/\\/$/, '');
const upstreamUrl = baseUrl + '/v1/fila/processamento/protocolo/' + encodeURIComponent(hashFila);
return [{ json: {
  valid: true, upstreamUrl, accessToken, hashFila,
  meta: { ambiente: amb.key, baseUrl, endpoint: '/v1/fila/processamento/protocolo/{hash}', receivedAt: new Date().toISOString(), source: 'n8n-rib-detalhe-fila-protocolo' },
  errorDefaultMsg: 'Erro ao obter detalhe da fila na API RIB.',
}}];`,
    buildJs: `
${BUILD_ERROR_JS}
return [{ json: { statusCode: 200, response: { sucesso: true, fila: httpResult, hash_fila: entrada.hashFila, ambiente: meta.ambiente ?? null, meta } } }];
`,
  },
  {
    autonr: 101,
    operacao: 'ExclusaoProtocolo',
    file: 'Exclusao Protocolo RIB.workflow.ts',
    method: 'DELETE',
    webhookPath: 'rib/protocolo/exclusao',
    validateJs: `
const numero = pick(query.numero, query.numeroProtocolo, body.numero, body.numeroProtocolo);
if (!numero) return erro(422, 'numero_protocolo_ausente', 'Informe numero na query ou body.', null);
const baseUrl = amb.baseUrl.replace(/\\/$/, '');
const upstreamUrl = baseUrl + '/v1/protocolo/' + encodeURIComponent(numero);
return [{ json: {
  valid: true, upstreamUrl, accessToken, numero,
  meta: { ambiente: amb.key, baseUrl, endpoint: '/v1/protocolo/{numero}', receivedAt: new Date().toISOString(), source: 'n8n-rib-exclusao-protocolo' },
  errorDefaultMsg: 'Erro ao excluir protocolo na API RIB.',
}}];`,
    httpMethod: 'DELETE',
    buildJs: `
${BUILD_ERROR_JS}
return [{ json: { statusCode: 200, response: { sucesso: true, numero: entrada.numero, resultado: httpResult, ambiente: meta.ambiente ?? null, meta } } }];
`,
  },
  {
    autonr: 102,
    operacao: 'AtualizarProtocoloCobranca',
    file: 'Atualizar Protocolo Cobranca RIB.workflow.ts',
    method: 'PATCH',
    webhookPath: 'rib/cobranca/protocolo',
    validateJs: `
const hashCobranca = pick(query.hash_cobranca, query.hashCobranca, body.hash_cobranca, body.hashCobranca);
const protocolo = pick(body.protocolo, query.protocolo);
if (!hashCobranca) return erro(422, 'hash_cobranca_ausente', 'Informe hash_cobranca na query ou body.', null);
if (!protocolo) return erro(422, 'protocolo_ausente', 'Informe protocolo no body.', null);
const baseUrl = amb.baseUrl.replace(/\\/$/, '');
const upstreamUrl = baseUrl + '/v1/cobranca/' + encodeURIComponent(hashCobranca) + '/protocolo';
return [{ json: {
  valid: true, upstreamUrl, accessToken, upstreamBody: { protocolo },
  hashCobranca, meta: { ambiente: amb.key, baseUrl, endpoint: '/v1/cobranca/{hash}/protocolo', receivedAt: new Date().toISOString(), source: 'n8n-rib-atualizar-protocolo-cobranca' },
  errorDefaultMsg: 'Erro ao atualizar protocolo na cobrança na API RIB.',
}}];`,
    httpMethod: 'PATCH',
    httpBody: `jsonBody: '={{ JSON.stringify($json.upstreamBody) }}', contentType: 'json'`,
    buildJs: `
${BUILD_ERROR_JS}
return [{ json: { statusCode: 200, response: { sucesso: true, hash_cobranca: entrada.hashCobranca, resultado: httpResult, ambiente: meta.ambiente ?? null, meta } } }];
`,
  },
];

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function className(autonr, operacao) {
  return `Autonr${autonr}Integracao${operacao.replace(/[^a-zA-Z0-9]/g, '')}RibWorkflow`;
}

function propName(operacao) {
  return operacao.replace(/[^a-zA-Z0-9]/g, '');
}

function generateWorkflow(wf) {
  const cls = className(wf.autonr, wf.operacao);
  const httpMethod = wf.httpMethod || wf.method;
  const httpBody = wf.httpBody ? `\n        ${wf.httpBody},` : '';
  const httpOptions = wf.httpOptions ? `\n        ${wf.httpOptions},` : '';
  const defaultHeaders = `[
      { name: 'Accept', value: 'application/json' },
      { name: 'Authorization', value: '=Bearer {{ $json.accessToken }}' },
    ]`;

  return `import { workflow, node, links } from '@n8n-as-code/transformer';

@workflow({
    name: '[AUTONR-${wf.autonr}] (integração) ${wf.operacao} - RIB',
    active: true,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class ${cls} {
    @node({
        id: '${uuid()}',
        webhookId: '${uuid()}',
        name: 'Receive RIB ${wf.operacao}',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 300],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    Receive = {
        httpMethod: '${wf.method}',
        path: '${wf.webhookPath}',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({ id: '${uuid()}', name: 'Validar Entrada', type: 'n8n-nodes-base.code', version: 2, position: [280, 300] })
    ValidarEntrada = {
        mode: 'runOnceForAllItems',
        language: 'javaScript',
        jsCode: \`
const item = $input.first();
const headers = item.json?.headers ?? {};
const body = item.json?.body ?? {};
const query = item.json?.query ?? {};
${RIB_COMMON}
const amb = resolveAmbiente();
if (amb.invalid) return erro(422, 'ambiente_invalido', 'ambiente deve ser producao ou homologacao.', { ambiente: amb.informado });
const accessToken = resolveAccessToken();
if (!accessToken) return erro(422, 'access_token_ausente', 'Informe X-RIB-Access-Token ou access_token na query.', null);
${wf.validateJs}
\`,
    };

    @node({ id: '${uuid()}', name: 'Entrada valida?', type: 'n8n-nodes-base.if', version: 2.2, position: [560, 300] })
    EntradaValida = {
        conditions: { options: { caseSensitive: true, leftValue: '', typeValidation: 'strict', version: 2 }, conditions: [{ id: 'cond-valid', leftValue: '={{ $json.valid }}', rightValue: true, operator: { type: 'boolean', operation: 'true' } }], combinator: 'and' },
        options: {},
    };

    @node({ id: '${uuid()}', name: 'Resposta Erro Entrada', type: 'n8n-nodes-base.code', version: 2, position: [840, 480] })
    RespostaErroEntrada = {
        mode: 'runOnceForAllItems', language: 'javaScript',
        jsCode: \`return [{ json: { statusCode: items[0].json.statusCode || 422, response: items[0].json.response } }];\`,
    };

    @node({ id: '${uuid()}', name: 'HTTP RIB', type: 'n8n-nodes-base.httpRequest', version: 4.4, position: [840, 180], onError: 'continueRegularOutput' })
    HttpRib = {
        method: '${httpMethod}',
        url: '={{ $json.upstreamUrl }}',
        authentication: 'none',
        sendHeaders: true,
        specifyHeaders: 'keypair',
        headerParameters: { parameters: ${wf.httpHeaders || defaultHeaders} },
        ${httpBody ? `sendBody: true,\n        ${httpBody}` : 'sendBody: false,'}
        ${wf.httpOptions || 'options: {}'},
    };

    @node({ id: '${uuid()}', name: 'Build Response', type: 'n8n-nodes-base.code', version: 2, position: [1060, 180] })
    BuildResponse = {
        mode: 'runOnceForAllItems', language: 'javaScript',
        jsCode: \`${RIB_COMMON}${wf.buildJs}\`,
    };

    @node({ id: '${uuid()}', name: 'Return Response', type: 'n8n-nodes-base.respondToWebhook', version: 1.5, position: [1280, 300] })
    ReturnResponse = {
        respondWith: 'json', responseBody: '={{ $json.response }}', options: { responseCode: '={{ $json.statusCode }}' },
    };

    @links()
    defineRouting() {
        this.Receive.out(0).to(this.ValidarEntrada.in(0));
        this.ValidarEntrada.out(0).to(this.EntradaValida.in(0));
        this.EntradaValida.out(0).to(this.HttpRib.in(0));
        this.EntradaValida.out(1).to(this.RespostaErroEntrada.in(0));
        this.HttpRib.out(0).to(this.BuildResponse.in(0));
        this.BuildResponse.out(0).to(this.ReturnResponse.in(0));
        this.RespostaErroEntrada.out(0).to(this.ReturnResponse.in(0));
    }
}
`;
}

for (const wf of WORKFLOWS) {
  const out = path.join(OUT_DIR, wf.file);
  fs.writeFileSync(out, generateWorkflow(wf), 'utf8');
  console.log('OK', wf.file);
}

console.log(`Gerados ${WORKFLOWS.length} workflows em ${OUT_DIR}`);
