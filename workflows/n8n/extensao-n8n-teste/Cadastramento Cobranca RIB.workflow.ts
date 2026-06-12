import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : [AUTORIB-36] (rib) CadastramentoCobranca - RIB
// Nodes   : 7  |  Connections: 7
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// ReceiveRibCadastramentoCobranca    webhook                    [creds]
// ValidarEntrada                     code
// EntradaValida                      if
// RespostaErroEntrada                code
// CadastramentoCobrancaRib           httpRequest                [onError→regular]
// BuildCadastramentoCobrancaResponse code
// ReturnCadastramentoCobrancaResponse respondToWebhook
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// ReceiveRibCadastramentoCobranca
//    → ValidarEntrada
//      → EntradaValida
//        → CadastramentoCobrancaRib
//          → BuildCadastramentoCobrancaResponse
//            → ReturnCadastramentoCobrancaResponse
//       .out(1) → RespostaErroEntrada
//          → ReturnCadastramentoCobrancaResponse (↩ loop)
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'WXOPh0N92vCWkh5B',
    name: '[AUTORIB-36] (rib) CadastramentoCobranca - RIB',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class Autorib36RibCadastramentocobrancaRibWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'a126b1c2-d3e4-5f6a-7b8c-9d0e1f2a3b4c',
        webhookId: 'b126c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6e',
        name: 'Receive RIB Cadastramento Cobranca',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 300],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    ReceiveRibCadastramentoCobranca = {
        httpMethod: 'POST',
        path: 'rib/cobranca/externa',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'c126d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
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
  data_geracao: 'dataGeracao',
  data_vencimento: 'dataVencimento',
  numero_pagamento: 'numeroPagamento',
  dados_pagador: 'dadosPagador',
  tipo_logradouro: 'tipoLogradouro',
};

const ENDERECO_ALIASES = {
  tipo_logradouro: 'tipoLogradouro',
};

const DATE_REGEX = /^\\d{4}-\\d{2}-\\d{2}$/;
const DATETIME_REGEX = /^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}$/;
const URL_REGEX = /^https?:\\/\\//i;
const EMAIL_REGEX = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;

const LIMITS = {
  url: 500,
  descricao: 250,
  numeroPagamento: 100,
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
    out[normalizedKey] = value;
  }
  return out;
}

function checkMaxLength(value, max, field) {
  if (value === undefined || value === null || value === '') return null;
  const text = String(value);
  if (text.length > max) {
    return field + ' excede ' + max + ' caracteres (cobranca externa).';
  }
  return null;
}

function validateEndereco(endereco) {
  if (!endereco || typeof endereco !== 'object' || Array.isArray(endereco)) {
    return { ok: false, code: 'endereco_ausente', message: 'dadosPagador.endereco e obrigatorio (objeto).' };
  }
  const required = ['cep', 'tipoLogradouro', 'logradouro', 'bairro', 'cidade', 'estado'];
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

function validateCadastroBody(payload) {
  const required = ['editais', 'valor', 'url', 'dataGeracao', 'dataVencimento', 'numeroPagamento', 'dadosPagador'];
  for (const field of required) {
    if (field === 'valor') {
      if (payload.valor === undefined || payload.valor === null || payload.valor === '') {
        return { ok: false, code: 'valor_ausente', message: 'valor e obrigatorio.', technical: { campo: 'valor' } };
      }
      const num = Number(payload.valor);
      if (!Number.isInteger(num) || num <= 0) {
        return { ok: false, code: 'valor_invalido', message: 'valor deve ser inteiro positivo (formato centavos x1000).', technical: { valor: payload.valor } };
      }
      continue;
    }
    if (field === 'editais') {
      if (!Array.isArray(payload.editais) || payload.editais.length === 0) {
        return { ok: false, code: 'editais_invalido', message: 'editais deve ser um array nao vazio.' };
      }
      continue;
    }
    if (field === 'dadosPagador') continue;
    if (!pick(payload[field])) {
      return { ok: false, code: 'campo_ausente', message: field + ' e obrigatorio.', technical: { campo: field } };
    }
  }

  const urlText = String(payload.url).trim();
  if (!URL_REGEX.test(urlText)) {
    return { ok: false, code: 'url_invalida', message: 'url deve ser uma URL http(s) valida.' };
  }
  const urlErr = checkMaxLength(urlText, LIMITS.url, 'url');
  if (urlErr) return { ok: false, code: 'url_invalida', message: urlErr };

  if (!DATETIME_REGEX.test(String(payload.dataGeracao).trim())) {
    return { ok: false, code: 'data_geracao_invalida', message: 'dataGeracao deve estar no formato YYYY-MM-DD HH:mm:ss.' };
  }
  if (!DATE_REGEX.test(String(payload.dataVencimento).trim())) {
    return { ok: false, code: 'data_vencimento_invalida', message: 'dataVencimento deve estar no formato YYYY-MM-DD.' };
  }

  const numPagErr = checkMaxLength(payload.numeroPagamento, LIMITS.numeroPagamento, 'numeroPagamento');
  if (numPagErr) return { ok: false, code: 'numero_pagamento_invalido', message: numPagErr };

  if (payload.descricao !== undefined && payload.descricao !== null && payload.descricao !== '') {
    const descErr = checkMaxLength(payload.descricao, LIMITS.descricao, 'descricao');
    if (descErr) return { ok: false, code: 'descricao_invalida', message: descErr };
  }

  const pagadorVal = validateDadosPagador(payload.dadosPagador);
  if (!pagadorVal.ok) return pagadorVal;

  const upstreamBody = {
    editais: payload.editais.map((e) => String(e).trim()).filter(Boolean),
    valor: Number(payload.valor),
    url: urlText,
    dataGeracao: String(payload.dataGeracao).trim(),
    dataVencimento: String(payload.dataVencimento).trim(),
    numeroPagamento: String(payload.numeroPagamento).trim(),
    dadosPagador: payload.dadosPagador,
  };

  if (upstreamBody.editais.length === 0) {
    return { ok: false, code: 'editais_invalido', message: 'editais deve conter ao menos um id valido.' };
  }
  if (payload.descricao !== undefined && payload.descricao !== null && String(payload.descricao).trim() !== '') {
    upstreamBody.descricao = String(payload.descricao).trim();
  }

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
  return erro(422, 'body_invalido', 'Envie JSON com os campos da cobranca externa (POST /v1/cobranca/cadastrar).', null);
}

const cadastro = validateCadastroBody(payload);
if (!cadastro.ok) {
  return erro(422, cadastro.code, cadastro.message, cadastro.technical ?? null);
}

const baseUrl = amb.baseUrl.replace(/\\/$/, '');
return [{
  json: {
    valid: true,
    upstreamUrl: baseUrl + '/v1/cobranca/cadastrar',
    accessToken,
    upstreamBody: cadastro.upstreamBody,
    meta: {
      ambiente: amb.key,
      baseUrl,
      endpoint: '/v1/cobranca/cadastrar',
      receivedAt: new Date().toISOString(),
      source: 'n8n-rib-cadastramento-cobranca-externa',
    },
    errorDefaultMsg: 'Erro ao cadastrar cobranca externa na API RIB.',
  },
}];
`,
    };

    @node({
        id: 'd126e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
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
                    id: 'cond-rib-cadastramento-cobranca-valido',
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
        id: 'e126f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a',
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
        id: 'f126a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b',
        name: 'Cadastramento Cobranca RIB',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [840, 180],
        onError: 'continueRegularOutput',
    })
    CadastramentoCobrancaRib = {
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
        id: 'a126b8c9-d0e1-2f3a-4b5c-6d7e8f9a0b1c',
        name: 'Build Cadastramento Cobranca Response',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1060, 180],
    })
    BuildCadastramentoCobrancaResponse = {
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
    statusCode: status === 401 ? 401 : (status === 403 ? 403 : (status === 422 ? 422 : (status || 502))),
    response: {
      sucesso: false,
      codigo_erro: parsed?.codigo ?? (status === 403 ? 'cadastro_nao_liberado' : 'rib_http_error'),
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
      url_pagamento: data.url ?? null,
      descricao: data.descricao ?? null,
      mensagem: 'Cobranca externa cadastrada com sucesso.',
      resultado: data,
      ambiente: meta.ambiente ?? null,
      meta,
    },
  },
}];
`,
    };

    @node({
        id: 'b126c9d0-e1f2-3a4b-5c6d-7e8f9a0b1c2d',
        name: 'Return Cadastramento Cobranca Response',
        type: 'n8n-nodes-base.respondToWebhook',
        version: 1.5,
        position: [1280, 300],
    })
    ReturnCadastramentoCobrancaResponse = {
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
        this.ReceiveRibCadastramentoCobranca.out(0).to(this.ValidarEntrada.in(0));
        this.ValidarEntrada.out(0).to(this.EntradaValida.in(0));
        this.EntradaValida.out(0).to(this.CadastramentoCobrancaRib.in(0));
        this.EntradaValida.out(1).to(this.RespostaErroEntrada.in(0));
        this.CadastramentoCobrancaRib.out(0).to(this.BuildCadastramentoCobrancaResponse.in(0));
        this.BuildCadastramentoCobrancaResponse.out(0).to(this.ReturnCadastramentoCobrancaResponse.in(0));
        this.RespostaErroEntrada.out(0).to(this.ReturnCadastramentoCobrancaResponse.in(0));
    }
}
