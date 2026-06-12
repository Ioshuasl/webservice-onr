import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : [AUTORIB-33] (rib) GeracaoCobranca - RIB
// Nodes   : 7  |  Connections: 7
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// ReceiveRibGeracaoCobranca          webhook                    [creds]
// ValidarEntrada                     code
// EntradaValida                      if
// RespostaErroEntrada                code
// GeracaoCobrancaRib                 httpRequest                [onError→regular]
// BuildGeracaoCobrancaResponse       code
// ReturnGeracaoCobrancaResponse      respondToWebhook
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// ReceiveRibGeracaoCobranca
//    → ValidarEntrada
//      → EntradaValida
//        → GeracaoCobrancaRib
//          → BuildGeracaoCobrancaResponse
//            → ReturnGeracaoCobrancaResponse
//       .out(1) → RespostaErroEntrada
//          → ReturnGeracaoCobrancaResponse (↩ loop)
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'dCoacaX1Oj0hBOm5',
    name: '[AUTORIB-33] (rib) GeracaoCobranca - RIB',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class Autorib33RibGeracaocobrancaRibWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'a123b1c2-d3e4-5f6a-7b8c-9d0e1f2a3b4c',
        webhookId: 'b123c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6e',
        name: 'Receive RIB Geracao Cobranca',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 300],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    ReceiveRibGeracaoCobranca = {
        httpMethod: 'POST',
        path: 'rib/cobranca',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'c123d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
        name: 'Validar Entrada',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [280, 300],
    })
    ValidarEntrada = {
        mode: 'runOnceForAllItems',
        language: 'javaScript',
        jsCode: `
const item = $input.first();
const headers = item.json?.headers ?? {};
const body = item.json?.body ?? {};
const query = item.json?.query ?? {};

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

const PROXY_ONLY_KEYS = new Set([
  'ambiente', 'access_token', 'accessToken', 'token',
]);

const FIELD_ALIASES = {
  tipo_cobranca: 'tipoCobranca',
  data_vencimento: 'dataVencimento',
  identificador_cliente: 'identificadorCliente',
  tipo_pagamento: 'tipoPagamento',
  dados_pagador: 'dadosPagador',
  tipo_logradouro: 'tipoLogradouro',
};

const ENDERECO_ALIASES = {
  tipo_logradouro: 'tipoLogradouro',
};

const TIPOS_COBRANCA = new Set(['PIX', 'BOLETO']);
const WEBHOOK_METODOS = new Set(['GET', 'POST']);
const WEBHOOK_TIPO_TOKEN = new Set(['Bearer', 'Basic']);
const DATE_REGEX = /^\\d{4}-\\d{2}-\\d{2}$/;
const EMAIL_REGEX = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;

const LIMITS = {
  tipoCobranca: 10,
  observacao: 30,
  identificadorCliente: 100,
  dadosPagador: {
    nome: 60,
    documento: 14,
    email: 150,
    telefone: { ddd: 3, numero: 10 },
    endereco: {
      cep: 8,
      tipoLogradouro: 16,
      logradouro: 150,
      numero: 10,
      bairro: 100,
      cidade: 100,
      estado: 2,
    },
  },
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

function erro(status, code, message, technical) {
  const response = { sucesso: false, codigo_erro: code, mensagem_erro: message, sistema: 'RIB' };
  if (technical) response.detalhe_tecnico = technical;
  return [{ json: { valid: false, statusCode: status, response } }];
}

function normalizeKey(key) {
  return FIELD_ALIASES[key] ?? key;
}

function normalizeNestedObject(raw, aliases) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return raw;
  const out = {};
  for (const [key, value] of Object.entries(raw)) {
    out[aliases?.[key] ?? normalizeKey(key)] = value;
  }
  return out;
}

function normalizeInputBody(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const source = raw.cobranca && typeof raw.cobranca === 'object' && !Array.isArray(raw.cobranca)
    ? { ...raw, ...raw.cobranca }
    : raw;
  const out = {};
  for (const [key, value] of Object.entries(source)) {
    if (PROXY_ONLY_KEYS.has(key)) continue;
    if (key === 'cobranca') continue;
    const normalizedKey = normalizeKey(key);
    if (normalizedKey === 'dadosPagador' && value && typeof value === 'object') {
      const pagador = normalizeNestedObject(value, { dados_pagador: 'dadosPagador' });
      if (pagador.endereco && typeof pagador.endereco === 'object') {
        pagador.endereco = normalizeNestedObject(pagador.endereco, ENDERECO_ALIASES);
      }
      out.dadosPagador = pagador;
      continue;
    }
    if (normalizedKey === 'webhook' && value && typeof value === 'object') {
      out.webhook = normalizeNestedObject(value, { tipo_token: 'tipoToken' });
      continue;
    }
    out[normalizedKey] = value;
  }
  return out;
}

function checkMaxLength(value, max, field) {
  if (value === undefined || value === null || value === '') return null;
  const text = String(value);
  if (text.length > max) {
    return field + ' excede ' + max + ' caracteres (RFC-01).';
  }
  return null;
}

function validateEndereco(endereco) {
  if (!endereco || typeof endereco !== 'object' || Array.isArray(endereco)) {
    return { ok: false, code: 'endereco_ausente', message: 'dadosPagador.endereco e obrigatorio (objeto).' };
  }
  const required = ['cep', 'tipoLogradouro', 'logradouro', 'numero', 'bairro', 'cidade', 'estado'];
  for (const field of required) {
    if (!pick(endereco[field])) {
      return { ok: false, code: 'endereco_campo_ausente', message: 'dadosPagador.endereco.' + field + ' e obrigatorio.', technical: { campo: field } };
    }
  }
  for (const [field, max] of Object.entries(LIMITS.dadosPagador.endereco)) {
    const err = checkMaxLength(endereco[field], max, 'dadosPagador.endereco.' + field);
    if (err) return { ok: false, code: 'endereco_campo_invalido', message: err, technical: { campo: field } };
  }
  if (String(endereco.estado).trim().length !== 2) {
    return { ok: false, code: 'endereco_estado_invalido', message: 'dadosPagador.endereco.estado deve ter 2 caracteres (UF).' };
  }
  return { ok: true, endereco };
}

function validateDadosPagador(dadosPagador) {
  if (!dadosPagador || typeof dadosPagador !== 'object' || Array.isArray(dadosPagador)) {
    return { ok: false, code: 'dados_pagador_ausente', message: 'dadosPagador e obrigatorio (objeto).' };
  }
  const required = ['nome', 'documento', 'email'];
  for (const field of required) {
    if (!pick(dadosPagador[field])) {
      return { ok: false, code: 'dados_pagador_campo_ausente', message: 'dadosPagador.' + field + ' e obrigatorio.', technical: { campo: field } };
    }
  }
  for (const field of ['nome', 'documento', 'email']) {
    const err = checkMaxLength(dadosPagador[field], LIMITS.dadosPagador[field], 'dadosPagador.' + field);
    if (err) return { ok: false, code: 'dados_pagador_campo_invalido', message: err, technical: { campo: field } };
  }
  if (!EMAIL_REGEX.test(String(dadosPagador.email).trim())) {
    return { ok: false, code: 'dados_pagador_email_invalido', message: 'dadosPagador.email invalido.' };
  }
  if (dadosPagador.telefone !== undefined && dadosPagador.telefone !== null) {
    if (typeof dadosPagador.telefone !== 'object' || Array.isArray(dadosPagador.telefone)) {
      return { ok: false, code: 'telefone_invalido', message: 'dadosPagador.telefone deve ser um objeto.' };
    }
    for (const [field, max] of Object.entries(LIMITS.dadosPagador.telefone)) {
      if (dadosPagador.telefone[field] !== undefined && dadosPagador.telefone[field] !== null && dadosPagador.telefone[field] !== '') {
        const err = checkMaxLength(dadosPagador.telefone[field], max, 'dadosPagador.telefone.' + field);
        if (err) return { ok: false, code: 'telefone_campo_invalido', message: err, technical: { campo: field } };
      }
    }
  }
  const endVal = validateEndereco(dadosPagador.endereco);
  if (!endVal.ok) return endVal;
  return { ok: true, dadosPagador };
}

function validateServicos(servicos) {
  if (!Array.isArray(servicos) || servicos.length === 0) {
    return { ok: false, code: 'servicos_invalido', message: 'servicos deve ser um array nao vazio.' };
  }
  const normalized = [];
  for (let i = 0; i < servicos.length; i++) {
    const item = servicos[i];
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      return { ok: false, code: 'servico_invalido', message: 'servicos[' + i + '] deve ser um objeto.', technical: { indice: i } };
    }
    if (item.codigo === undefined || item.codigo === null || item.codigo === '') {
      return { ok: false, code: 'servico_codigo_ausente', message: 'servicos[' + i + '].codigo e obrigatorio.', technical: { indice: i } };
    }
    if (item.valor === undefined || item.valor === null || item.valor === '') {
      return { ok: false, code: 'servico_valor_ausente', message: 'servicos[' + i + '].valor e obrigatorio.', technical: { indice: i } };
    }
    const codigo = Number(item.codigo);
    const valor = Number(item.valor);
    if (!Number.isInteger(codigo)) {
      return { ok: false, code: 'servico_codigo_invalido', message: 'servicos[' + i + '].codigo deve ser inteiro.', technical: { indice: i } };
    }
    if (!Number.isInteger(valor)) {
      return { ok: false, code: 'servico_valor_invalido', message: 'servicos[' + i + '].valor deve ser inteiro (formato centavos x1000).', technical: { indice: i } };
    }
    normalized.push({ codigo, valor });
  }
  return { ok: true, servicos: normalized };
}

function validateWebhook(webhook) {
  if (webhook === undefined || webhook === null) return { ok: true, webhook: undefined };
  if (typeof webhook !== 'object' || Array.isArray(webhook)) {
    return { ok: false, code: 'webhook_invalido', message: 'webhook deve ser um objeto.' };
  }
  if (!pick(webhook.url)) {
    return { ok: false, code: 'webhook_url_ausente', message: 'webhook.url e obrigatorio quando webhook e informado.' };
  }
  const metodo = String(webhook.metodo ?? '').trim().toUpperCase();
  if (!metodo || !WEBHOOK_METODOS.has(metodo)) {
    return { ok: false, code: 'webhook_metodo_invalido', message: 'webhook.metodo deve ser GET ou POST.' };
  }
  const out = { url: String(webhook.url).trim(), metodo };
  if (webhook.token) out.token = String(webhook.token);
  if (webhook.tipoToken) {
    const tipo = String(webhook.tipoToken).trim();
    if (!WEBHOOK_TIPO_TOKEN.has(tipo)) {
      return { ok: false, code: 'webhook_tipo_token_invalido', message: 'webhook.tipoToken deve ser Bearer ou Basic.' };
    }
    out.tipoToken = tipo;
  }
  return { ok: true, webhook: out };
}

function validateCobrancaBody(payload) {
  const required = ['tipoCobranca', 'dataVencimento', 'dadosPagador', 'servicos'];
  for (const field of required) {
    if (field === 'servicos') continue;
    if (field === 'dadosPagador') continue;
    if (!pick(payload[field])) {
      return { ok: false, code: 'campo_ausente', message: field + ' e obrigatorio.', technical: { campo: field } };
    }
  }

  const tipo = String(payload.tipoCobranca).trim().toUpperCase();
  if (!TIPOS_COBRANCA.has(tipo)) {
    return { ok: false, code: 'tipo_cobranca_invalido', message: 'tipoCobranca deve ser PIX ou BOLETO.' };
  }
  const tipoErr = checkMaxLength(tipo, LIMITS.tipoCobranca, 'tipoCobranca');
  if (tipoErr) return { ok: false, code: 'tipo_cobranca_invalido', message: tipoErr };

  if (!DATE_REGEX.test(String(payload.dataVencimento).trim())) {
    return { ok: false, code: 'data_vencimento_invalida', message: 'dataVencimento deve estar no formato YYYY-MM-DD.' };
  }

  if (payload.observacao !== undefined && payload.observacao !== null && payload.observacao !== '') {
    const obsErr = checkMaxLength(payload.observacao, LIMITS.observacao, 'observacao');
    if (obsErr) return { ok: false, code: 'observacao_invalida', message: obsErr };
  }

  if (payload.identificadorCliente !== undefined && payload.identificadorCliente !== null && payload.identificadorCliente !== '') {
    const idErr = checkMaxLength(payload.identificadorCliente, LIMITS.identificadorCliente, 'identificadorCliente');
    if (idErr) return { ok: false, code: 'identificador_cliente_invalido', message: idErr };
  }

  if (payload.tipoPagamento !== undefined && payload.tipoPagamento !== null && payload.tipoPagamento !== '') {
    const tp = Number(payload.tipoPagamento);
    if (!Number.isInteger(tp)) {
      return { ok: false, code: 'tipo_pagamento_invalido', message: 'tipoPagamento deve ser inteiro.' };
    }
  }

  const pagadorVal = validateDadosPagador(payload.dadosPagador);
  if (!pagadorVal.ok) return pagadorVal;

  const servicosVal = validateServicos(payload.servicos);
  if (!servicosVal.ok) return servicosVal;

  const webhookVal = validateWebhook(payload.webhook);
  if (!webhookVal.ok) return webhookVal;

  const upstreamBody = {
    tipoCobranca: tipo,
    dataVencimento: String(payload.dataVencimento).trim(),
    dadosPagador: payload.dadosPagador,
    servicos: servicosVal.servicos,
  };

  if (payload.observacao !== undefined && payload.observacao !== null && String(payload.observacao).trim() !== '') {
    upstreamBody.observacao = String(payload.observacao).trim();
  }
  if (payload.identificadorCliente !== undefined && payload.identificadorCliente !== null && String(payload.identificadorCliente).trim() !== '') {
    upstreamBody.identificadorCliente = String(payload.identificadorCliente).trim();
  }
  if (payload.tipoPagamento !== undefined && payload.tipoPagamento !== null && payload.tipoPagamento !== '') {
    upstreamBody.tipoPagamento = Number(payload.tipoPagamento);
  }
  if (webhookVal.webhook) upstreamBody.webhook = webhookVal.webhook;

  return { ok: true, upstreamBody };
}

const amb = resolveAmbiente();
if (amb.invalid) {
  return erro(422, 'ambiente_invalido', 'ambiente deve ser producao ou homologacao.', { ambiente: amb.informado });
}

const accessToken = resolveAccessToken();
if (!accessToken) {
  return erro(422, 'access_token_ausente', 'Informe X-RIB-Access-Token ou access_token.', null);
}

const payload = normalizeInputBody(body);
if (!payload) {
  return erro(422, 'body_invalido', 'Envie JSON com os campos da cobranca (RFC-01).', null);
}

const cobranca = validateCobrancaBody(payload);
if (!cobranca.ok) {
  return erro(422, cobranca.code, cobranca.message, cobranca.technical ?? null);
}

const baseUrl = amb.baseUrl.replace(/\\/$/, '');
return [{
  json: {
    valid: true,
    upstreamUrl: baseUrl + '/v1/cobranca',
    accessToken,
    upstreamBody: cobranca.upstreamBody,
    meta: {
      ambiente: amb.key,
      baseUrl,
      endpoint: '/v1/cobranca',
      receivedAt: new Date().toISOString(),
      source: 'n8n-rib-geracao-cobranca',
    },
    errorDefaultMsg: 'Erro ao gerar cobranca na API RIB.',
  },
}];
`,
    };

    @node({
        id: 'd123e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
        name: 'Entrada valida?',
        type: 'n8n-nodes-base.if',
        version: 2.2,
        position: [560, 300],
    })
    EntradaValida = {
        conditions: {
            options: {
                caseSensitive: true,
                leftValue: '',
                typeValidation: 'strict',
                version: 2,
            },
            conditions: [
                {
                    id: 'cond-rib-geracao-cobranca-valido',
                    leftValue: '={{ $json.valid }}',
                    rightValue: true,
                    operator: {
                        type: 'boolean',
                        operation: 'true',
                    },
                },
            ],
            combinator: 'and',
        },
        options: {},
    };

    @node({
        id: 'e123f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a',
        name: 'Resposta Erro Entrada',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [840, 480],
    })
    RespostaErroEntrada = {
        mode: 'runOnceForAllItems',
        language: 'javaScript',
        jsCode: 'return [{ json: { statusCode: items[0].json.statusCode || 422, response: items[0].json.response } }];',
    };

    @node({
        id: 'f123a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b',
        name: 'Geracao Cobranca RIB',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [840, 180],
        onError: 'continueRegularOutput',
    })
    GeracaoCobrancaRib = {
        method: 'POST',
        url: '={{ $json.upstreamUrl }}',
        authentication: 'none',
        sendHeaders: true,
        specifyHeaders: 'keypair',
        headerParameters: {
            parameters: [
                {
                    name: 'Accept',
                    value: 'application/json',
                },
                {
                    name: 'Content-Type',
                    value: 'application/json',
                },
                {
                    name: 'Authorization',
                    value: '=Bearer {{ $json.accessToken }}',
                },
            ],
        },
        sendBody: true,
        jsonBody: '={{ JSON.stringify($json.upstreamBody) }}',
        contentType: 'json',
        options: {},
    };

    @node({
        id: 'a123b8c9-d0e1-2f3a-4b5c-6d7e8f9a0b1c',
        name: 'Build Geracao Cobranca Response',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1060, 180],
    })
    BuildGeracaoCobrancaResponse = {
        mode: 'runOnceForAllItems',
        language: 'javaScript',
        jsCode: `
const httpResult = items[0].json;
const entrada = $('Validar Entrada').first().json;
const meta = entrada.meta ?? {};

function parseJsonSafe(value) {
  if (value === undefined || value === null) return null;
  if (typeof value === 'object') return value;
  if (typeof value !== 'string') return null;
  try { return JSON.parse(value); } catch { return null; }
}

function normalizeHttpError(errorObject, meta, defaultMsg) {
  const rawMessage = errorObject?.message ?? defaultMsg;
  const status = Number(errorObject?.status ?? errorObject?.httpCode ?? rawMessage.match(/^\\s*(\\d{3})\\s*-/)?.[1] ?? 502);
  const parsed = parseJsonSafe(errorObject?.response?.body)
    ?? parseJsonSafe(errorObject?.response?.data)
    ?? (typeof errorObject?.response?.body === 'object' ? errorObject.response.body : null);

  return {
    statusCode: status === 401 ? 401 : (status === 422 ? 422 : (status || 502)),
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

if (httpResult.error) {
  return [{ json: normalizeHttpError(httpResult.error, meta, entrada.errorDefaultMsg ?? 'Erro na API RIB.') }];
}

const data = httpResult;
return [{
  json: {
    statusCode: 201,
    response: {
      sucesso: true,
      hash_cobranca: data.hash ?? null,
      status: data.status ?? null,
      data_status: data.dataStatus ?? null,
      url_pagamento: data.url ?? null,
      valor_total: data.valorTotal ?? null,
      qrcode: data.qrcode ?? null,
      resultado: data,
      ambiente: meta.ambiente ?? null,
      meta,
    },
  },
}];
`,
    };

    @node({
        id: 'b123c9d0-e1f2-3a4b-5c6d-7e8f9a0b1c2d',
        name: 'Return Geracao Cobranca Response',
        type: 'n8n-nodes-base.respondToWebhook',
        version: 1.5,
        position: [1280, 300],
    })
    ReturnGeracaoCobrancaResponse = {
        respondWith: 'json',
        responseBody: '={{ $json.response }}',
        options: {
            responseCode: '={{ $json.statusCode }}',
        },
    };

    // =====================================================================
    // ROUTAGE ET CONNEXIONS
    // =====================================================================

    @links()
    defineRouting() {
        this.ReceiveRibGeracaoCobranca.out(0).to(this.ValidarEntrada.in(0));
        this.ValidarEntrada.out(0).to(this.EntradaValida.in(0));
        this.EntradaValida.out(0).to(this.GeracaoCobrancaRib.in(0));
        this.EntradaValida.out(1).to(this.RespostaErroEntrada.in(0));
        this.GeracaoCobrancaRib.out(0).to(this.BuildGeracaoCobrancaResponse.in(0));
        this.BuildGeracaoCobrancaResponse.out(0).to(this.ReturnGeracaoCobrancaResponse.in(0));
        this.RespostaErroEntrada.out(0).to(this.ReturnGeracaoCobrancaResponse.in(0));
    }
}
