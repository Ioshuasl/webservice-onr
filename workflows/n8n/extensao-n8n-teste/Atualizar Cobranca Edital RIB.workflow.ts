import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : [AUTORIB-16] (rib) AtualizarCobrancaEdital - RIB
// Nodes   : 7  |  Connections: 7
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// ReceiveRibAtualizarCobrancaEdital  webhook                    [creds]
// ValidarEntrada                     code
// EntradaValida                      if
// RespostaErroEntrada                code
// AtualizarCobrancaEditalRib         httpRequest                [onError→regular]
// BuildAtualizarCobrancaResponse     code
// ReturnAtualizarCobrancaResponse    respondToWebhook
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// ReceiveRibAtualizarCobrancaEdital
//    → ValidarEntrada
//      → EntradaValida
//        → AtualizarCobrancaEditalRib
//          → BuildAtualizarCobrancaResponse
//            → ReturnAtualizarCobrancaResponse
//       .out(1) → RespostaErroEntrada
//          → ReturnAtualizarCobrancaResponse (↩ loop)
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'yK0CLwoAhgnVFcIz',
    name: '[AUTORIB-16] (rib) AtualizarCobrancaEdital - RIB',
    active: true,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class Autorib16RibAtualizarcobrancaeditalRibWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'a106b1c2-d3e4-5f6a-7b8c-9d0e1f2a3b4c',
        webhookId: 'b106c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6e',
        name: 'Receive RIB Atualizar Cobranca Edital',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 300],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    ReceiveRibAtualizarCobrancaEdital = {
        httpMethod: 'PATCH',
        path: 'rib/edital/cobranca',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'c106d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
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

const PROXY_ONLY_KEYS = new Set(['ambiente', 'access_token', 'accessToken', 'token', 'numeroDocumento', 'numero_documento']);

const FIELD_ALIASES = {
  cns_serventia: 'cnsServentia',
  valor_pago: 'valorPago',
  data_pagamento: 'dataPagamento',
};

const DATE_REGEX = /^\\d{4}-\\d{2}-\\d{2}$/;
const PAGO_VALIDOS = new Set(['0', '1']);

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

function normalizePayloadBody(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  const out = {};
  for (const [key, value] of Object.entries(raw)) {
    if (PROXY_ONLY_KEYS.has(key)) continue;
    out[normalizeKey(key)] = value;
  }
  return out;
}

function validateUpdateBody(payload) {
  const required = ['cnsServentia', 'valorPago', 'pago', 'dataPagamento'];
  for (const field of required) {
    if (field === 'valorPago') {
      if (payload.valorPago === undefined || payload.valorPago === null || payload.valorPago === '') {
        return { ok: false, code: 'campo_ausente', message: 'valorPago e obrigatorio.', technical: { campo: 'valorPago' } };
      }
      if (typeof payload.valorPago !== 'number' || !Number.isFinite(payload.valorPago)) {
        return { ok: false, code: 'valor_pago_invalido', message: 'valorPago deve ser numerico.' };
      }
      continue;
    }
    if (payload[field] === undefined || payload[field] === null || payload[field] === '') {
      return { ok: false, code: 'campo_ausente', message: field + ' e obrigatorio.', technical: { campo: field } };
    }
  }

  const cns = String(payload.cnsServentia).trim();
  if (!/^\\d{6}$/.test(cns)) {
    return { ok: false, code: 'cns_serventia_invalido', message: 'cnsServentia deve ter 6 digitos (manual RFE-04).' };
  }

  const pagoText = String(payload.pago).trim();
  if (!PAGO_VALIDOS.has(pagoText)) {
    return { ok: false, code: 'pago_invalido', message: 'pago deve ser 0 (nao) ou 1 (sim).', technical: { informado: pagoText } };
  }

  if (!DATE_REGEX.test(String(payload.dataPagamento).trim())) {
    return { ok: false, code: 'data_pagamento_invalida', message: 'dataPagamento deve estar no formato YYYY-MM-DD.' };
  }

  return {
    ok: true,
    upstreamBody: {
      cnsServentia: cns,
      valorPago: payload.valorPago,
      pago: Number(pagoText),
      dataPagamento: String(payload.dataPagamento).trim(),
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

const numeroDocumento = pick(
  query.numero_documento,
  query.numeroDocumento,
  body.numero_documento,
  body.numeroDocumento,
);
if (!numeroDocumento) {
  return erro(422, 'numero_documento_ausente', 'Informe numeroDocumento ou numero_documento na query ou body.', null);
}

const payload = normalizePayloadBody(body);
const update = validateUpdateBody(payload);
if (!update.ok) {
  return erro(422, update.code, update.message, update.technical ?? null);
}

const baseUrl = amb.baseUrl.replace(/\\/$/, '');
const upstreamUrl = baseUrl + '/v1/edital/cobranca/' + encodeURIComponent(numeroDocumento);

return [{
  json: {
    valid: true,
    upstreamUrl,
    accessToken,
    upstreamBody: update.upstreamBody,
    numeroDocumento,
    meta: {
      ambiente: amb.key,
      baseUrl,
      endpoint: '/v1/edital/cobranca/{numeroDocumento}',
      receivedAt: new Date().toISOString(),
      source: 'n8n-rib-atualizar-cobranca-edital',
    },
    errorDefaultMsg: 'Erro ao atualizar cobranca de edital na API RIB.',
  },
}];
`,
    };

    @node({
        id: 'd106e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
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
                    id: 'cond-rib-atualizar-cobranca-edital-valido',
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
        id: 'e106f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a',
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
        id: 'f106a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b',
        name: 'Atualizar Cobranca Edital RIB',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [840, 180],
        onError: 'continueRegularOutput',
    })
    AtualizarCobrancaEditalRib = {
        method: 'PATCH',
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
        id: 'a106b8c9-d0e1-2f3a-4b5c-6d7e8f9a0b1c',
        name: 'Build Atualizar Cobranca Response',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1060, 180],
    })
    BuildAtualizarCobrancaResponse = {
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
      status_rib: parsed?.status ?? null,
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
    statusCode: 200,
    response: {
      sucesso: true,
      mensagem: data.mensagem ?? null,
      status_rib: data.status ?? null,
      numero_documento: entrada.numeroDocumento ?? null,
      resultado: data,
      ambiente: meta.ambiente ?? null,
      meta,
    },
  },
}];
`,
    };

    @node({
        id: 'b106c9d0-e1f2-3a4b-5c6d-7e8f9a0b1c2d',
        name: 'Return Atualizar Cobranca Response',
        type: 'n8n-nodes-base.respondToWebhook',
        version: 1.5,
        position: [1280, 300],
    })
    ReturnAtualizarCobrancaResponse = {
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
        this.ReceiveRibAtualizarCobrancaEdital.out(0).to(this.ValidarEntrada.in(0));
        this.ValidarEntrada.out(0).to(this.EntradaValida.in(0));
        this.EntradaValida.out(0).to(this.AtualizarCobrancaEditalRib.in(0));
        this.EntradaValida.out(1).to(this.RespostaErroEntrada.in(0));
        this.AtualizarCobrancaEditalRib.out(0).to(this.BuildAtualizarCobrancaResponse.in(0));
        this.BuildAtualizarCobrancaResponse.out(0).to(this.ReturnAtualizarCobrancaResponse.in(0));
        this.RespostaErroEntrada.out(0).to(this.ReturnAtualizarCobrancaResponse.in(0));
    }
}
