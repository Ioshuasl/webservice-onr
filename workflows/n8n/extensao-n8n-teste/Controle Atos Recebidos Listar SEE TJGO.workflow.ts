import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : [AUTSEETJGO-22] (see tjgo) ControleAtosRecebidosListar - Retorno Atos
// Nodes   : 7  |  Connections: 7
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// ReceiveSeeTjgoControleAtosRecebidosListar webhook                    [creds]
// ValidarEntrada                     code
// EntradaValida                      if
// RespostaErroEntrada                code
// ControleAtosRecebidosListarSeeTjgo httpRequest                [onError→regular]
// BuildControleAtosRecebidosListarResponse code
// ReturnControleAtosRecebidosListarResponse respondToWebhook
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// ReceiveSeeTjgoControleAtosRecebidosListar
//    → ValidarEntrada
//      → EntradaValida
//        → ControleAtosRecebidosListarSeeTjgo
//          → BuildControleAtosRecebidosListarResponse
//            → ReturnControleAtosRecebidosListarResponse
//       .out(1) → RespostaErroEntrada
//          → ReturnControleAtosRecebidosListarResponse (↩ loop)
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'EY9jsHiPzI79tsyT',
    name: '[AUTSEETJGO-22] (see tjgo) ControleAtosRecebidosListar - Retorno Atos',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class Autseetjgo22SeeTjgoControleatosrecebidoslistarRetornoAtosWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'e1f20022-0001-4000-8000-000000000001',
        webhookId: 'e1f20022-0001-4000-8000-000000000011',
        name: 'Receive SEE TJGO Controle Atos Recebidos Listar',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 300],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    ReceiveSeeTjgoControleAtosRecebidosListar = {
        httpMethod: 'GET',
        path: 'see-tjgo/controle-atos-recebidos',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'e1f20022-0001-4000-8000-000000000002',
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

const AMBIENTES_SEE = {
  producao: {
    key: 'producao',
    baseUrl: () => pick($env.SEE_TJGO_API_BASE_URL, 'https://see.tjgo.jus.br/api/v1'),
  },
  homologacao: {
    key: 'homologacao',
    baseUrl: () => pick(
      $env.SEE_TJGO_API_BASE_URL_HML,
      'https://portal-hextrajudicial.tjgo.jus.br/api/v1',
    ),
  },
};

const AMBIENTE_ALIASES = {
  producao: 'producao',
  prod: 'producao',
  production: 'producao',
  homologacao: 'homologacao',
  homolog: 'homologacao',
  hml: 'homologacao',
};

const QUERY_KEYS = ['page', 'status', 'data_inicial', 'data_final'];
const PROXY_ONLY_KEYS = new Set(['ambiente', 'auth_token', 'authToken', 'token']);

function resolveAmbiente() {
  const raw = pick(
    query.ambiente,
    body.ambiente,
    header('x-ambiente'),
    $env.SEE_TJGO_AMBIENTE,
    'producao',
  ).toLowerCase();
  const key = AMBIENTE_ALIASES[raw];
  if (!key) {
    return { invalid: true, informado: raw };
  }
  const cfg = AMBIENTES_SEE[key];
  return { key: cfg.key, baseUrl: cfg.baseUrl() };
}

function resolveAuthToken() {
  const seeHeader = pick(header('x-see-tjgo-auth-token'), header('X-SEE-TJGO-Auth-Token'));
  if (seeHeader) return seeHeader;
  const authHeader = pick(header('authorization'), header('Authorization'));
  const bearerMatch = authHeader.match(/^Bearer\\s+(.+)$/i);
  if (bearerMatch) return bearerMatch[1].trim();
  return pick(
    query.auth_token,
    query.authToken,
    query.token,
    body.auth_token,
    body.authToken,
    body.token,
  );
}

function buildQueryParams() {
  const params = {};
  const sources = [query, body];
  for (const source of sources) {
    for (const [key, value] of Object.entries(source ?? {})) {
      if (value === undefined || value === null || value === '') continue;
      if (PROXY_ONLY_KEYS.has(key)) continue;
      if (!QUERY_KEYS.includes(key)) continue;
      params[key] = String(value).trim();
    }
  }
  return params;
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
  const response = {
    sucesso: false,
    codigo_erro: code,
    mensagem_erro: message,
    sistema: 'SEE TJGO',
    status_http: status,
  };
  if (technical) response.detalhe_tecnico = technical;
  return [{ json: { valid: false, statusCode: status, response } }];
}

const amb = resolveAmbiente();
if (amb.invalid) {
  return erro(422, 'ambiente_invalido', 'ambiente deve ser producao ou homologacao.', {
    ambiente: amb.informado,
    aceitos: ['producao', 'homologacao'],
  });
}

const authToken = resolveAuthToken();
if (!authToken) {
  return erro(
    422,
    'auth_token_ausente',
    'Informe auth_token na query, header X-SEE-TJGO-Auth-Token ou Authorization Bearer.',
    { fontes: ['query.auth_token', 'X-SEE-TJGO-Auth-Token', 'Authorization: Bearer'] },
  );
}

const queryParams = buildQueryParams();
const queryString = encodeQueryString(queryParams);
const baseUrl = amb.baseUrl.replace(/\\/$/, '');
const listarUrl = baseUrl + '/controle_atos_recebidos' + (queryString ? '?' + queryString : '');

return [{
  json: {
    valid: true,
    listarUrl,
    authToken,
    queryParams,
    meta: {
      ambiente: amb.key,
      baseUrl,
      endpoint: '/controle_atos_recebidos',
      filtros: queryParams,
      receivedAt: new Date().toISOString(),
      source: 'n8n-see-tjgo-controle-atos-recebidos-listar',
    },
    errorDefaultMsg: 'Erro ao listar retornos de atos na API SEE TJGO.',
  },
}];
`,
    };

    @node({
        id: 'e1f20022-0001-4000-8000-000000000003',
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
                    id: 'cond-see-controle-atos-recebidos-listar-valido',
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
        id: 'e1f20022-0001-4000-8000-000000000004',
        name: 'Resposta Erro Entrada',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [840, 480],
    })
    RespostaErroEntrada = {
        mode: 'runOnceForAllItems',
        language: 'javaScript',
        jsCode: `
const data = items[0].json;
return [{
  json: {
    statusCode: data.statusCode || 422,
    response: data.response ?? {
      sucesso: false,
      codigo_erro: 'entrada_invalida',
      mensagem_erro: 'Entrada rejeitada pela validacao local.',
      sistema: 'SEE TJGO',
      status_http: data.statusCode || 422,
    },
  },
}];
`,
    };

    @node({
        id: 'e1f20022-0001-4000-8000-000000000005',
        name: 'Controle Atos Recebidos Listar SEE TJGO',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [840, 180],
        onError: 'continueRegularOutput',
    })
    ControleAtosRecebidosListarSeeTjgo = {
        method: 'GET',
        url: '={{ $json.listarUrl }}',
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
                    name: 'Authorization',
                    value: '=Bearer {{ $json.authToken }}',
                },
            ],
        },
        options: {
            response: {
                response: {
                    fullResponse: true,
                },
            },
        },
    };

    @node({
        id: 'e1f20022-0001-4000-8000-000000000006',
        name: 'Build Controle Atos Recebidos Listar Response',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1060, 180],
    })
    BuildControleAtosRecebidosListarResponse = {
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

function formatMensagens(parsed) {
  if (Array.isArray(parsed)) {
    return parsed.map((e) => e?.message ?? e?.mensagem ?? String(e)).join('; ');
  }
  if (parsed && typeof parsed === 'object') {
    return parsed.message ?? parsed.mensagem ?? parsed.error ?? null;
  }
  return null;
}

function normalizeHttpError(errorObject, defaultMsg) {
  const rawMessage = errorObject?.message ?? defaultMsg;
  const status = Number(
    errorObject?.status ?? errorObject?.httpCode ?? rawMessage.match(/^\\s*(\\d{3})\\s*-/)?.[1] ?? 502,
  );
  const parsed = parseJsonSafe(errorObject?.response?.body)
    ?? parseJsonSafe(errorObject?.response?.data)
    ?? (typeof errorObject?.response?.body === 'object' ? errorObject.response.body : null);
  const statusCode = status === 401 ? 401 : (status || 502);
  return {
    statusCode,
    response: {
      sucesso: false,
      codigo_erro: 'see_http_error',
      mensagem_erro: formatMensagens(parsed) ?? rawMessage,
      erros: Array.isArray(parsed) ? parsed : null,
      sistema: 'SEE TJGO',
      status_http: statusCode,
      ambiente: meta.ambiente ?? null,
      meta,
      resposta_api: parsed,
    },
  };
}

function extractLista(data) {
  const body = data?.body ?? data;
  if (Array.isArray(body)) return body;
  if (Array.isArray(body?.body)) return body.body;
  const parsed = parseJsonSafe(body);
  if (Array.isArray(parsed)) return parsed;
  return null;
}

function extractPaginationHeaders(data) {
  const headers = data?.headers ?? {};
  const pickHeader = (name) => {
    const lower = name.toLowerCase();
    return headers[lower] ?? headers[name] ?? null;
  };
  const limit = pickHeader('x-pagination-limit');
  const count = pickHeader('x-pagination-count');
  const page = pickHeader('x-pagination-page');
  if (limit === null && count === null && page === null) return null;
  return {
    limite: limit !== null ? Number(limit) : null,
    total: count !== null ? Number(count) : null,
    pagina: page !== null ? Number(page) : null,
  };
}

if (httpResult.error) {
  return [{ json: normalizeHttpError(httpResult.error, entrada.errorDefaultMsg ?? 'Erro na API SEE TJGO.') }];
}

const statusCode = Number(httpResult?.statusCode ?? httpResult?.status ?? 200);
if (statusCode >= 400) {
  const parsed = parseJsonSafe(httpResult?.body) ?? (typeof httpResult?.body === 'object' ? httpResult.body : httpResult);
  return [{
    json: {
      statusCode: statusCode >= 100 && statusCode < 600 ? statusCode : 502,
      response: {
        sucesso: false,
        codigo_erro: 'see_api_error',
        mensagem_erro: formatMensagens(parsed) ?? 'A API SEE TJGO rejeitou a listagem de retornos de atos.',
        erros: Array.isArray(parsed) ? parsed : null,
        sistema: 'SEE TJGO',
        status_http: statusCode,
        ambiente: meta.ambiente ?? null,
        meta,
        resposta_api: parsed,
      },
    },
  }];
}

const lista = extractLista(httpResult);
if (lista === null) {
  return [{
    json: {
      statusCode: 502,
      response: {
        sucesso: false,
        codigo_erro: 'resposta_inesperada',
        mensagem_erro: 'Resposta da API SEE TJGO em formato nao reconhecido (esperado array de ControleAtoRecebido).',
        sistema: 'SEE TJGO',
        status_http: 502,
        ambiente: meta.ambiente ?? null,
        meta,
        resposta_api: httpResult,
      },
    },
  }];
}

const paginacao = extractPaginationHeaders(httpResult);
const response = {
  sucesso: true,
  status_http: 200,
  total_controle_atos_recebidos: lista.length,
  controle_atos_recebidos: lista,
  filtros: entrada.queryParams ?? {},
  ambiente: meta.ambiente ?? null,
  meta,
};
if (paginacao) response.paginacao = paginacao;

return [{ json: { statusCode: 200, response } }];
`,
    };

    @node({
        id: 'e1f20022-0001-4000-8000-000000000007',
        name: 'Return Controle Atos Recebidos Listar Response',
        type: 'n8n-nodes-base.respondToWebhook',
        version: 1.5,
        position: [1280, 300],
    })
    ReturnControleAtosRecebidosListarResponse = {
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
        this.ReceiveSeeTjgoControleAtosRecebidosListar.out(0).to(this.ValidarEntrada.in(0));
        this.ValidarEntrada.out(0).to(this.EntradaValida.in(0));
        this.EntradaValida.out(0).to(this.ControleAtosRecebidosListarSeeTjgo.in(0));
        this.EntradaValida.out(1).to(this.RespostaErroEntrada.in(0));
        this.ControleAtosRecebidosListarSeeTjgo.out(0).to(this.BuildControleAtosRecebidosListarResponse.in(0));
        this.BuildControleAtosRecebidosListarResponse.out(0).to(this.ReturnControleAtosRecebidosListarResponse.in(0));
        this.RespostaErroEntrada.out(0).to(this.ReturnControleAtosRecebidosListarResponse.in(0));
    }
}
