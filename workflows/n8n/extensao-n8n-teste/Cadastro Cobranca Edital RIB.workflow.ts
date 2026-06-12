import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : [AUTORIB-15] (rib) CadastroCobrancaEdital - RIB
// Nodes   : 7  |  Connections: 7
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// ReceiveRibCadastroCobrancaEdital   webhook                    [creds]
// ValidarEntrada                     code
// EntradaValida                      if
// RespostaErroEntrada                code
// CadastroCobrancaEditalRib          httpRequest                [onError→regular]
// BuildCobrancaEditalResponse        code
// ReturnCobrancaEditalResponse       respondToWebhook
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// ReceiveRibCadastroCobrancaEdital
//    → ValidarEntrada
//      → EntradaValida
//        → CadastroCobrancaEditalRib
//          → BuildCobrancaEditalResponse
//            → ReturnCobrancaEditalResponse
//       .out(1) → RespostaErroEntrada
//          → ReturnCobrancaEditalResponse (↩ loop)
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'Q531L7yGaBjjgfmZ',
    name: '[AUTORIB-15] (rib) CadastroCobrancaEdital - RIB',
    active: true,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class Autorib15RibCadastrocobrancaeditalRibWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'a105b1c2-d3e4-5f6a-7b8c-9d0e1f2a3b4c',
        webhookId: 'b105c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6e',
        name: 'Receive RIB Cadastro Cobranca Edital',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 300],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    ReceiveRibCadastroCobrancaEdital = {
        httpMethod: 'POST',
        path: 'rib/edital/cobranca',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'c105d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
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
  cns_serventia: 'cnsServentia',
  url_acesso: 'urlAcesso',
  data_geracao: 'dataGeracao',
  data_vencimento: 'dataVencimento',
  numero_documento: 'numeroDocumento',
};

const DATE_REGEX = /^\\d{4}-\\d{2}-\\d{2}$/;
const URL_REGEX = /^https?:\\/\\//i;
const EMAIL_REGEX = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;

const LIMITS = {
  cnsServentia: 6,
  descricao: 250,
  pagador: {
    nome: 150,
    documento: 20,
    email: 150,
    cep: 9,
    logradouro: 150,
    numero: 15,
    complemento: 150,
    bairro: 150,
    cidade: 150,
    uf: 2,
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

function normalizeInputBody(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const source = raw.cobranca && typeof raw.cobranca === 'object' && !Array.isArray(raw.cobranca)
    ? { ...raw, ...raw.cobranca }
    : raw;
  const out = {};
  for (const [key, value] of Object.entries(source)) {
    if (PROXY_ONLY_KEYS.has(key)) continue;
    if (key === 'cobranca') continue;
    out[normalizeKey(key)] = value;
  }
  return out;
}

function checkMaxLength(value, max, field) {
  if (value === undefined || value === null || value === '') return null;
  const text = String(value);
  if (text.length > max) {
    return field + ' excede ' + max + ' caracteres (manual RFE-03).';
  }
  return null;
}

function validatePagador(pagador) {
  if (!pagador || typeof pagador !== 'object' || Array.isArray(pagador)) {
    return { ok: false, code: 'pagador_ausente', message: 'pagador e obrigatorio (objeto).' };
  }

  const requiredPagador = ['nome', 'documento', 'email'];
  for (const field of requiredPagador) {
    if (!pick(pagador[field])) {
      return { ok: false, code: 'pagador_campo_ausente', message: 'pagador.' + field + ' e obrigatorio.', technical: { campo: field } };
    }
  }

  for (const [field, max] of Object.entries(LIMITS.pagador)) {
    const err = checkMaxLength(pagador[field], max, 'pagador.' + field);
    if (err) return { ok: false, code: 'pagador_campo_invalido', message: err, technical: { campo: field } };
  }

  if (!EMAIL_REGEX.test(String(pagador.email).trim())) {
    return { ok: false, code: 'pagador_email_invalido', message: 'pagador.email invalido.' };
  }

  if (pagador.uf !== undefined && pagador.uf !== null && String(pagador.uf).trim() !== '') {
    if (String(pagador.uf).trim().length !== 2) {
      return { ok: false, code: 'pagador_uf_invalido', message: 'pagador.uf deve ter 2 caracteres.' };
    }
  }

  return { ok: true, pagador };
}

function validateCobrancaBody(payload) {
  const required = [
    'cnsServentia',
    'editais',
    'valor',
    'urlAcesso',
    'dataGeracao',
    'dataVencimento',
    'numeroDocumento',
    'descricao',
    'pagador',
  ];

  for (const field of required) {
    if (field === 'valor') {
      if (payload.valor === undefined || payload.valor === null || payload.valor === '') {
        return { ok: false, code: 'campo_ausente', message: 'valor e obrigatorio.', technical: { campo: 'valor' } };
      }
      if (typeof payload.valor !== 'number' || !Number.isFinite(payload.valor)) {
        return { ok: false, code: 'valor_invalido', message: 'valor deve ser numerico.' };
      }
      continue;
    }
    if (field === 'editais') {
      if (!Array.isArray(payload.editais) || payload.editais.length === 0) {
        return { ok: false, code: 'editais_invalido', message: 'editais deve ser um array nao vazio.' };
      }
      continue;
    }
    if (field === 'pagador') continue;
    if (!pick(payload[field])) {
      return { ok: false, code: 'campo_ausente', message: field + ' e obrigatorio.', technical: { campo: field } };
    }
  }

  const cns = String(payload.cnsServentia).trim();
  if (!/^\\d{6}$/.test(cns)) {
    return { ok: false, code: 'cns_serventia_invalido', message: 'cnsServentia deve ter 6 digitos (manual RFE-03).' };
  }

  const descErr = checkMaxLength(payload.descricao, LIMITS.descricao, 'descricao');
  if (descErr) return { ok: false, code: 'descricao_invalida', message: descErr };

  for (const dateField of ['dataGeracao', 'dataVencimento']) {
    if (!DATE_REGEX.test(String(payload[dateField]).trim())) {
      return { ok: false, code: 'data_invalida', message: dateField + ' deve estar no formato YYYY-MM-DD.', technical: { campo: dateField } };
    }
  }

  if (!URL_REGEX.test(String(payload.urlAcesso).trim())) {
    return { ok: false, code: 'url_acesso_invalida', message: 'urlAcesso deve ser uma URL http(s) valida.' };
  }

  const pagadorVal = validatePagador(payload.pagador);
  if (!pagadorVal.ok) return pagadorVal;

  return {
    ok: true,
    upstreamBody: {
      cnsServentia: cns,
      editais: payload.editais,
      valor: payload.valor,
      urlAcesso: String(payload.urlAcesso).trim(),
      dataGeracao: String(payload.dataGeracao).trim(),
      dataVencimento: String(payload.dataVencimento).trim(),
      numeroDocumento: String(payload.numeroDocumento).trim(),
      descricao: String(payload.descricao).trim(),
      pagador: payload.pagador,
    },
  };
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
  return erro(422, 'body_invalido', 'Envie JSON com os campos da cobranca (RFE-03).', null);
}

const cobranca = validateCobrancaBody(payload);
if (!cobranca.ok) {
  return erro(422, cobranca.code, cobranca.message, cobranca.technical ?? null);
}

const baseUrl = amb.baseUrl.replace(/\\/$/, '');
return [{
  json: {
    valid: true,
    upstreamUrl: baseUrl + '/v1/edital/cobranca',
    accessToken,
    upstreamBody: cobranca.upstreamBody,
    meta: {
      ambiente: amb.key,
      baseUrl,
      endpoint: '/v1/edital/cobranca',
      receivedAt: new Date().toISOString(),
      source: 'n8n-rib-cadastro-cobranca-edital',
    },
    errorDefaultMsg: 'Erro ao cadastrar cobranca de edital na API RIB.',
  },
}];
`,
    };

    @node({
        id: 'd105e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
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
                    id: 'cond-rib-cobranca-edital-valido',
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
        id: 'e105f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a',
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
        id: 'f105a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b',
        name: 'Cadastro Cobranca Edital RIB',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [840, 180],
        onError: 'continueRegularOutput',
    })
    CadastroCobrancaEditalRib = {
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
        id: 'a105b8c9-d0e1-2f3a-4b5c-6d7e8f9a0b1c',
        name: 'Build Cobranca Edital Response',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1060, 180],
    })
    BuildCobrancaEditalResponse = {
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
    statusCode: status === 401 ? 401 : (status || 502),
    response: {
      sucesso: false,
      codigo_erro: parsed?.codigo ?? 'rib_http_error',
      mensagem_erro: parsed?.mensagem ?? parsed?.descricao ?? rawMessage,
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
      mensagem: data.mensagem ?? null,
      resultado: data,
      ambiente: meta.ambiente ?? null,
      meta,
    },
  },
}];
`,
    };

    @node({
        id: 'b105c9d0-e1f2-3a4b-5c6d-7e8f9a0b1c2d',
        name: 'Return Cobranca Edital Response',
        type: 'n8n-nodes-base.respondToWebhook',
        version: 1.5,
        position: [1280, 300],
    })
    ReturnCobrancaEditalResponse = {
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
        this.ReceiveRibCadastroCobrancaEdital.out(0).to(this.ValidarEntrada.in(0));
        this.ValidarEntrada.out(0).to(this.EntradaValida.in(0));
        this.EntradaValida.out(0).to(this.CadastroCobrancaEditalRib.in(0));
        this.EntradaValida.out(1).to(this.RespostaErroEntrada.in(0));
        this.CadastroCobrancaEditalRib.out(0).to(this.BuildCobrancaEditalResponse.in(0));
        this.BuildCobrancaEditalResponse.out(0).to(this.ReturnCobrancaEditalResponse.in(0));
        this.RespostaErroEntrada.out(0).to(this.ReturnCobrancaEditalResponse.in(0));
    }
}
