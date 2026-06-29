import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : [AUTSEETJGO-10] (see tjgo) ControleAtosUtilizadosListar - Atos Utilizados
// Nodes   : 7  |  Connections: 7
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// ReceiveSeeTjgoControleAtosUtilizadosListar webhook                    [creds]
// ValidarEntrada                     code
// EntradaValida                      if
// RespostaErroEntrada                code
// ControleAtosUtilizadosListarSeeTjgo httpRequest                [onError→regular]
// BuildControleAtosUtilizadosListarResponse code
// ReturnControleAtosUtilizadosListarResponse respondToWebhook
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// ReceiveSeeTjgoControleAtosUtilizadosListar
//    → ValidarEntrada
//      → EntradaValida
//        → ControleAtosUtilizadosListarSeeTjgo
//          → BuildControleAtosUtilizadosListarResponse
//            → ReturnControleAtosUtilizadosListarResponse
//       .out(1) → RespostaErroEntrada
//          → ReturnControleAtosUtilizadosListarResponse (↩ loop)
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'eyiEIbffXBqy2hNc',
    name: '[AUTSEETJGO-10] (see tjgo) ControleAtosUtilizadosListar - Atos Utilizados',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class Autseetjgo10SeeTjgoControleatosutilizadoslistarAtosUtilizadosWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'e1f20010-0001-4000-8000-000000000001',
        webhookId: 'e1f20010-0001-4000-8000-000000000011',
        name: 'Receive SEE TJGO Controle Atos Utilizados Listar',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 300],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    ReceiveSeeTjgoControleAtosUtilizadosListar = {
        httpMethod: 'GET',
        path: 'see-tjgo/controle-atos-utilizados',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'e1f20010-0001-4000-8000-000000000002',
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
function header(name) { const l = name.toLowerCase(); return headers[l] ?? headers[name] ?? ''; }
function pick(...values) { for (const v of values) { const t = String(v ?? '').trim(); if (t) return t; } return ''; }
const AMBIENTES_SEE = {
  producao: { key: 'producao', baseUrl: () => pick($env.SEE_TJGO_API_BASE_URL, 'https://see.tjgo.jus.br/api/v1') },
  homologacao: { key: 'homologacao', baseUrl: () => pick($env.SEE_TJGO_API_BASE_URL_HML, 'https://portal-hextrajudicial.tjgo.jus.br/api/v1') },
};
const ALIASES = { producao: 'producao', prod: 'producao', production: 'producao', homologacao: 'homologacao', homolog: 'homologacao', hml: 'homologacao' };
const QUERY_KEYS = ['page','per','codigo_selo','codigo_ato','tipo_ato_id','protocolo_pedido','inutilizado','limitar_solicitante','data_inicial_retorno','data_final_retorno','data_inicial_utilizacao','data_final_utilizacao'];
const PROXY_ONLY = new Set(['ambiente','auth_token','authToken','token']);
function resolveAmbiente() {
  const raw = pick(query.ambiente, body.ambiente, header('x-ambiente'), $env.SEE_TJGO_AMBIENTE, 'producao').toLowerCase();
  const key = ALIASES[raw];
  if (!key) return { invalid: true, informado: raw };
  return { key, baseUrl: AMBIENTES_SEE[key].baseUrl() };
}
function resolveAuthToken() {
  const see = pick(header('x-see-tjgo-auth-token'), header('X-SEE-TJGO-Auth-Token'));
  if (see) return see;
  const auth = pick(header('authorization'), header('Authorization'));
  const m = auth.match(/^Bearer\\s+(.+)$/i);
  if (m) return m[1].trim();
  return pick(query.auth_token, query.authToken, query.token, body.auth_token, body.authToken, body.token);
}
function buildQueryParams() {
  const params = {};
  for (const source of [query, body]) {
    for (const [key, value] of Object.entries(source ?? {})) {
      if (value === undefined || value === null || value === '') continue;
      if (PROXY_ONLY.has(key) || !QUERY_KEYS.includes(key)) continue;
      params[key] = String(value).trim();
    }
  }
  return params;
}
function encodeQueryString(params) {
  return Object.entries(params ?? {}).filter(([,v]) => v !== '').map(([k,v]) => encodeURIComponent(k)+'='+encodeURIComponent(String(v))).join('&');
}
function erro(status, code, message, technical) {
  const response = { sucesso: false, codigo_erro: code, mensagem_erro: message, sistema: 'SEE TJGO', status_http: status };
  if (technical) response.detalhe_tecnico = technical;
  return [{ json: { valid: false, statusCode: status, response } }];
}
const amb = resolveAmbiente();
if (amb.invalid) return erro(422, 'ambiente_invalido', 'ambiente deve ser producao ou homologacao.', { ambiente: amb.informado });
const authToken = resolveAuthToken();
if (!authToken) return erro(422, 'auth_token_ausente', 'Informe auth_token (Bearer ou query).', null);
const queryParams = buildQueryParams();
const qs = encodeQueryString(queryParams);
const baseUrl = amb.baseUrl.replace(/\\/$/, '');
const listarUrl = baseUrl + '/controle_de_atos_utilizados' + (qs ? '?' + qs : '');
return [{ json: { valid: true, listarUrl, authToken, queryParams, meta: { ambiente: amb.key, baseUrl, endpoint: '/controle_de_atos_utilizados', filtros: queryParams, source: 'n8n-see-tjgo-controle-atos-utilizados-listar' }, errorDefaultMsg: 'Erro ao listar atos utilizados na API SEE TJGO.' } }];
`,
    };

    @node({
        id: 'e1f20010-0001-4000-8000-000000000003',
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
                    id: 'c1',
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
        id: 'e1f20010-0001-4000-8000-000000000004',
        name: 'Resposta Erro Entrada',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [840, 480],
    })
    RespostaErroEntrada = {
        mode: 'runOnceForAllItems',
        language: 'javaScript',
        jsCode: "const data = items[0].json; return [{ json: { statusCode: data.statusCode || 422, response: data.response ?? { sucesso: false, codigo_erro: 'entrada_invalida', mensagem_erro: 'Entrada rejeitada.', sistema: 'SEE TJGO', status_http: data.statusCode || 422 } } }];",
    };

    @node({
        id: 'e1f20010-0001-4000-8000-000000000005',
        name: 'Controle Atos Utilizados Listar SEE TJGO',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [840, 180],
        onError: 'continueRegularOutput',
    })
    ControleAtosUtilizadosListarSeeTjgo = {
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
        id: 'e1f20010-0001-4000-8000-000000000006',
        name: 'Build Controle Atos Utilizados Listar Response',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1060, 180],
    })
    BuildControleAtosUtilizadosListarResponse = {
        mode: 'runOnceForAllItems',
        language: 'javaScript',
        jsCode: `
const httpResult = items[0].json;
const entrada = $('Validar Entrada').first().json;
const meta = entrada.meta ?? {};
function parseJsonSafe(v) { if (v == null) return null; if (typeof v === 'object') return v; if (typeof v !== 'string') return null; try { return JSON.parse(v); } catch { return null; } }
function fmt(parsed) { if (Array.isArray(parsed)) return parsed.map(e => e?.message ?? e?.mensagem ?? String(e)).join('; '); if (parsed && typeof parsed === 'object') return parsed.message ?? parsed.mensagem ?? null; return null; }
function errHttp(e, msg) {
  const status = Number(e?.status ?? e?.httpCode ?? 502);
  const parsed = parseJsonSafe(e?.response?.body) ?? null;
  return { statusCode: status === 401 ? 401 : status, response: { sucesso: false, codigo_erro: 'see_http_error', mensagem_erro: fmt(parsed) ?? e?.message ?? msg, sistema: 'SEE TJGO', status_http: status, ambiente: meta.ambiente, meta, resposta_api: parsed } };
}
function extractLista(data) {
  const body = data?.body ?? data;
  if (Array.isArray(body)) return body;
  const parsed = parseJsonSafe(body);
  if (Array.isArray(parsed)) return parsed;
  return null;
}
if (httpResult.error) return [{ json: errHttp(httpResult.error, entrada.errorDefaultMsg) }];
const statusCode = Number(httpResult?.statusCode ?? 200);
if (statusCode >= 400) {
  const parsed = parseJsonSafe(httpResult?.body) ?? httpResult;
  return [{ json: { statusCode, response: { sucesso: false, codigo_erro: 'see_api_error', mensagem_erro: fmt(parsed) ?? 'API rejeitou listagem.', sistema: 'SEE TJGO', status_http: statusCode, ambiente: meta.ambiente, meta, resposta_api: parsed } } }];
}
const lista = extractLista(httpResult);
if (lista === null) return [{ json: { statusCode: 502, response: { sucesso: false, codigo_erro: 'resposta_inesperada', mensagem_erro: 'Formato nao reconhecido.', sistema: 'SEE TJGO', status_http: 502, meta, resposta_api: httpResult } } }];
return [{ json: { statusCode: 200, response: { sucesso: true, status_http: 200, total_controle_atos_utilizados: lista.length, controle_atos_utilizados: lista, filtros: entrada.queryParams ?? {}, ambiente: meta.ambiente, meta } } }];
`,
    };

    @node({
        id: 'e1f20010-0001-4000-8000-000000000007',
        name: 'Return Controle Atos Utilizados Listar Response',
        type: 'n8n-nodes-base.respondToWebhook',
        version: 1.5,
        position: [1280, 300],
    })
    ReturnControleAtosUtilizadosListarResponse = {
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
        this.ReceiveSeeTjgoControleAtosUtilizadosListar.out(0).to(this.ValidarEntrada.in(0));
        this.ValidarEntrada.out(0).to(this.EntradaValida.in(0));
        this.EntradaValida.out(0).to(this.ControleAtosUtilizadosListarSeeTjgo.in(0));
        this.EntradaValida.out(1).to(this.RespostaErroEntrada.in(0));
        this.ControleAtosUtilizadosListarSeeTjgo.out(0).to(this.BuildControleAtosUtilizadosListarResponse.in(0));
        this.BuildControleAtosUtilizadosListarResponse.out(0).to(this.ReturnControleAtosUtilizadosListarResponse.in(0));
        this.RespostaErroEntrada.out(0).to(this.ReturnControleAtosUtilizadosListarResponse.in(0));
    }
}
