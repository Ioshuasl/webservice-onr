import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : [AUTORIB-25] (rib) SolicitarExtracaoEditais - RIB
// Nodes   : 7  |  Connections: 7
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// ReceiveRibSolicitarExtracaoEditais webhook                    [creds]
// ValidarEntrada                     code
// EntradaValida                      if
// RespostaErroEntrada                code
// SolicitarExtracaoEditaisRib        httpRequest                [onError→regular]
// BuildExtracaoResponse              code
// ReturnExtracaoResponse             respondToWebhook
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// ReceiveRibSolicitarExtracaoEditais
//    → ValidarEntrada
//      → EntradaValida
//        → SolicitarExtracaoEditaisRib
//          → BuildExtracaoResponse
//            → ReturnExtracaoResponse
//       .out(1) → RespostaErroEntrada
//          → ReturnExtracaoResponse (↩ loop)
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'oifyx0PA6mcDAjtR',
    name: '[AUTORIB-25] (rib) SolicitarExtracaoEditais - RIB',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class Autorib25RibSolicitarextracaoeditaisRibWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'a115b1c2-d3e4-5f6a-7b8c-9d0e1f2a3b4c',
        webhookId: 'b115c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6e',
        name: 'Receive RIB Solicitar Extracao Editais',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 300],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    ReceiveRibSolicitarExtracaoEditais = {
        httpMethod: 'POST',
        path: 'rib/edital/extracao',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'c115d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
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

const PROXY_ONLY_KEYS = new Set(['ambiente', 'access_token', 'accessToken', 'token']);

const FIELD_ALIASES = {
  data_edital_inicial: 'dataEditalInicial',
  data_edital_final: 'dataEditalFinal',
  tipo_edital: 'tipoEdital',
};

const DATE_REGEX = /^\\d{4}-\\d{2}-\\d{2}$/;
const FILTER_FIELDS = ['dataEditalInicial', 'dataEditalFinal', 'documento', 'cns', 'matricula', 'tipoEdital'];

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

function normalizeRootBody(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const source = raw.extracao && typeof raw.extracao === 'object' && !Array.isArray(raw.extracao)
    ? { ...raw, ...raw.extracao }
    : raw;
  const out = {};
  for (const [key, value] of Object.entries(source)) {
    if (PROXY_ONLY_KEYS.has(key)) continue;
    if (key === 'extracao') continue;
    const normalizedKey = FIELD_ALIASES[key] ?? key;
    if (value === undefined || value === null || value === '') continue;
    out[normalizedKey] = value;
  }
  return out;
}

function hasFilterValue(payload, field) {
  const value = payload[field];
  if (value === undefined || value === null || value === '') return false;
  return true;
}

function validateExtracaoBody(payload) {
  const hasFilter = FILTER_FIELDS.some((field) => hasFilterValue(payload, field));
  if (!hasFilter) {
    return {
      ok: false,
      code: 'filtros_ausentes',
      message: 'Informe ao menos um filtro: dataEditalInicial, dataEditalFinal, documento, cns, matricula ou tipoEdital (RFX-02).',
    };
  }

  if (hasFilterValue(payload, 'dataEditalInicial') && !DATE_REGEX.test(String(payload.dataEditalInicial))) {
    return { ok: false, code: 'data_edital_inicial_invalida', message: 'dataEditalInicial deve estar no formato YYYY-MM-DD.' };
  }
  if (hasFilterValue(payload, 'dataEditalFinal') && !DATE_REGEX.test(String(payload.dataEditalFinal))) {
    return { ok: false, code: 'data_edital_final_invalida', message: 'dataEditalFinal deve estar no formato YYYY-MM-DD.' };
  }
  if (hasFilterValue(payload, 'dataEditalInicial') && hasFilterValue(payload, 'dataEditalFinal')) {
    if (String(payload.dataEditalInicial) > String(payload.dataEditalFinal)) {
      return { ok: false, code: 'intervalo_datas_invalido', message: 'dataEditalInicial nao pode ser posterior a dataEditalFinal.' };
    }
  }
  if (hasFilterValue(payload, 'tipoEdital')) {
    if (typeof payload.tipoEdital !== 'number' || !Number.isFinite(payload.tipoEdital)) {
      return { ok: false, code: 'tipo_edital_invalido', message: 'tipoEdital deve ser numerico (consulte AUTORIB-13 / RFE-01).' };
    }
  }

  return { ok: true };
}

const amb = resolveAmbiente();
if (amb.invalid) {
  return erro(422, 'ambiente_invalido', 'ambiente deve ser producao ou homologacao.', { ambiente: amb.informado });
}

const accessToken = resolveAccessToken();
if (!accessToken) {
  return erro(422, 'access_token_ausente', 'Informe X-RIB-Access-Token ou access_token.', null);
}

const payload = normalizeRootBody(body);
if (!payload) {
  return erro(422, 'body_invalido', 'Envie JSON com os filtros da extracao (RFX-02).', null);
}

const extracao = validateExtracaoBody(payload);
if (!extracao.ok) {
  return erro(422, extracao.code, extracao.message, extracao.technical ?? null);
}

const baseUrl = amb.baseUrl.replace(/\\/$/, '');
return [{
  json: {
    valid: true,
    upstreamUrl: baseUrl + '/v1/edital/extracao',
    accessToken,
    upstreamBody: payload,
    meta: {
      ambiente: amb.key,
      baseUrl,
      endpoint: '/v1/edital/extracao',
      receivedAt: new Date().toISOString(),
      source: 'n8n-rib-solicitar-extracao-editais',
    },
    errorDefaultMsg: 'Erro ao solicitar extracao de editais na API RIB.',
  },
}];
`,
    };

    @node({
        id: 'd115e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
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
                    id: 'cond-rib-solicitar-extracao-valido',
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
        id: 'e115f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a',
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
        id: 'f115a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b',
        name: 'Solicitar Extracao Editais RIB',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [840, 180],
        onError: 'continueRegularOutput',
    })
    SolicitarExtracaoEditaisRib = {
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
        id: 'a115b8c9-d0e1-2f3a-4b5c-6d7e8f9a0b1c',
        name: 'Build Extracao Response',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1060, 180],
    })
    BuildExtracaoResponse = {
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
      hash: data.hash ?? null,
      data_cadastro: data.dataCadastro ?? null,
      resultado: data,
      ambiente: meta.ambiente ?? null,
      meta,
    },
  },
}];
`,
    };

    @node({
        id: 'b115c9d0-e1f2-3a4b-5c6d-7e8f9a0b1c2d',
        name: 'Return Extracao Response',
        type: 'n8n-nodes-base.respondToWebhook',
        version: 1.5,
        position: [1280, 300],
    })
    ReturnExtracaoResponse = {
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
        this.ReceiveRibSolicitarExtracaoEditais.out(0).to(this.ValidarEntrada.in(0));
        this.ValidarEntrada.out(0).to(this.EntradaValida.in(0));
        this.EntradaValida.out(0).to(this.SolicitarExtracaoEditaisRib.in(0));
        this.EntradaValida.out(1).to(this.RespostaErroEntrada.in(0));
        this.SolicitarExtracaoEditaisRib.out(0).to(this.BuildExtracaoResponse.in(0));
        this.BuildExtracaoResponse.out(0).to(this.ReturnExtracaoResponse.in(0));
        this.RespostaErroEntrada.out(0).to(this.ReturnExtracaoResponse.in(0));
    }
}
