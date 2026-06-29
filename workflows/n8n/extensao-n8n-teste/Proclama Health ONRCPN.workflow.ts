import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : [AUTONRCPN-11] (onrcpn) ProclamaHealth - e-Proclamas
// Nodes   : 7  |  Connections: 7
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// ReceiveOnrcpnProclamaHealth        webhook                    [creds]
// ValidarEntrada                     code
// EntradaValida                      if
// RespostaErroEntrada                code
// ProclamaHealthOnrcpn               httpRequest                [onError→regular]
// BuildProclamaHealthResponse        code
// ReturnProclamaHealthResponse       respondToWebhook
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// ReceiveOnrcpnProclamaHealth
//    → ValidarEntrada
//      → EntradaValida
//        → ProclamaHealthOnrcpn
//          → BuildProclamaHealthResponse
//            → ReturnProclamaHealthResponse
//       .out(1) → RespostaErroEntrada
//          → ReturnProclamaHealthResponse (↩ loop)
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'dNXpwlR198b2TUyX',
    name: '[AUTONRCPN-11] (onrcpn) ProclamaHealth - e-Proclamas',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class Autonrcpn11OnrcpnProclamahealthEProclamasWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'a1b20011-0001-4000-8000-000000000001',
        webhookId: 'a1b20011-0001-4000-8000-000000000011',
        name: 'Receive ONRCPN Proclama Health',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 300],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    ReceiveOnrcpnProclamaHealth = {
        httpMethod: 'GET',
        path: 'onrcpn/proclama/health',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'a1b20011-0001-4000-8000-000000000002',
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

function resolveBaseUrl() {
  return pick(
    query.base_url,
    query.baseUrl,
    body.base_url,
    body.baseUrl,
    header('x-onrcpn-base-url'),
    header('X-ONRCPN-Base-Url'),
    $env.ONRCPN_PROCLAMA_BASE_URL,
    'https://servicosh.registrocivil.org.br/api/proclama',
  ).replace(/\\/$/, '');
}

function resolveIdrcToken() {
  const onrcpnHeader = pick(header('x-onrcpn-idrc-token'), header('X-ONRCPN-IdRC-Token'));
  if (onrcpnHeader) return onrcpnHeader;
  const authHeader = pick(header('authorization'), header('Authorization'));
  const bearerMatch = authHeader.match(/^Bearer\\s+(.+)$/i);
  if (bearerMatch) return bearerMatch[1].trim();
  return pick(
    query.idrc_token,
    query.idrcToken,
    query.access_token,
    query.token,
    body.idrc_token,
    body.idrcToken,
    body.access_token,
    body.token,
    $env.ONRCPN_IDRC_TOKEN,
  );
}

const baseUrl = resolveBaseUrl();
const healthUrl = baseUrl + '/health';
const idrcToken = resolveIdrcToken();

const meta = {
  servico: 'e-proclamas',
  ambiente: 'homologacao',
  baseUrl,
  endpoint: '/health',
  token_configurado: Boolean(idrcToken),
  auth_required: false,
  receivedAt: new Date().toISOString(),
  source: 'n8n-onrcpn-proclama-health',
};

return [{
  json: {
    valid: true,
    healthUrl,
    idrcToken: idrcToken || '',
    meta,
    errorDefaultMsg: 'Erro ao consultar health da API e-Proclamas ONRCPN.',
  },
}];
`,
    };

    @node({
        id: 'a1b20011-0001-4000-8000-000000000003',
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
                    id: 'cond-onrcpn-proclama-health-valido',
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
        id: 'a1b20011-0001-4000-8000-000000000004',
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
    statusCode: data.statusCode || 400,
    response: data.response ?? {
      sucesso: false,
      codigo_erro: 'entrada_invalida',
      mensagem_erro: 'Entrada rejeitada pela validacao local.',
      sistema: 'ONRCPN',
      status_http: data.statusCode || 400,
      dados: {},
    },
  },
}];
`,
    };

    @node({
        id: 'a1b20011-0001-4000-8000-000000000005',
        name: 'Proclama Health ONRCPN',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [840, 180],
        onError: 'continueRegularOutput',
    })
    ProclamaHealthOnrcpn = {
        method: 'GET',
        url: '={{ $json.healthUrl }}',
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
                    value: '={{ $json.idrcToken ? "Bearer " + $json.idrcToken : "" }}',
                },
            ],
        },
        options: {},
    };

    @node({
        id: 'a1b20011-0001-4000-8000-000000000006',
        name: 'Build Proclama Health Response',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1060, 180],
    })
    BuildProclamaHealthResponse = {
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
  const trimmed = value.trim();
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed);
  } catch {
    return null;
  }
}

function formatMensagens(parsed) {
  if (Array.isArray(parsed)) {
    return parsed.map((entry) => entry?.message ?? entry?.mensagem ?? String(entry)).join('; ');
  }
  if (parsed && typeof parsed === 'object') {
    return parsed.message ?? parsed.mensagem ?? parsed.error ?? null;
  }
  return null;
}

function normalizeHttpError(errorObject, defaultMsg) {
  const rawMessage = errorObject?.message ?? defaultMsg;
  const status = Number(
    errorObject?.status
      ?? errorObject?.httpCode
      ?? rawMessage.match(/^\\s*(\\d{3})\\s*-/)?.[1]
      ?? 502,
  );
  const parsed = parseJsonSafe(errorObject?.response?.body)
    ?? parseJsonSafe(errorObject?.response?.data)
    ?? (typeof errorObject?.response?.body === 'object' ? errorObject.response.body : null);
  const statusCode = status === 401 ? 401
    : status === 403 ? 403
    : status === 404 ? 404
    : status === 503 ? 503
    : (status || 502);

  return {
    statusCode,
    response: {
      sucesso: false,
      codigo_erro: parsed?.codigo ?? parsed?.error ?? 'onrcpn_http_error',
      mensagem_erro: formatMensagens(parsed) ?? rawMessage,
      sistema: 'ONRCPN',
      status_http: statusCode,
      dados: parsed?.data ?? {},
      meta,
      detalhe_tecnico: {
        name: errorObject?.name ?? null,
        code: errorObject?.code ?? null,
        status: status || null,
        endpoint: meta.endpoint ?? '/health',
      },
      resposta_api: parsed,
    },
  };
}

function extractPayload(data) {
  const parsed = parseJsonSafe(data?.body) ?? (typeof data?.body === 'object' ? data.body : null);
  if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
    return parsed;
  }
  if (typeof data?.body === 'string' && data.body.trim()) {
    return { message: data.body.trim() };
  }
  return null;
}

if (httpResult.error) {
  return [{ json: normalizeHttpError(httpResult.error, entrada.errorDefaultMsg ?? 'Erro na API e-Proclamas ONRCPN.') }];
}

const statusCode = Number(httpResult?.statusCode ?? httpResult?.status ?? 200);
const payload = extractPayload(httpResult);

if (statusCode >= 400) {
  const businessStatus = statusCode === 401 ? 401
    : statusCode === 403 ? 403
    : statusCode === 404 ? 404
    : statusCode === 503 ? 503
    : statusCode >= 500 ? 502
    : 422;

  return [{
    json: {
      statusCode: businessStatus,
      response: {
        sucesso: false,
        codigo_erro: 'onrcpn_api_error',
        mensagem_erro: formatMensagens(payload) ?? payload?.message ?? 'A API e-Proclamas reportou indisponibilidade.',
        sistema: 'ONRCPN',
        status_http: businessStatus,
        dados: payload ?? {},
        meta,
        resposta_api: payload ?? httpResult,
      },
    },
  }];
}

const okStatus = statusCode >= 200 && statusCode < 300 ? (statusCode || 200) : 200;

return [{
  json: {
    statusCode: okStatus,
    response: {
      sucesso: true,
      codigo_erro: 0,
      mensagem_erro: '',
      status_http: okStatus,
      message: payload?.message ?? 'OK',
      status: payload?.status ?? okStatus,
      sistema_online: okStatus >= 200 && okStatus < 300,
      dados: payload ?? {},
      meta,
    },
  },
}];
`,
    };

    @node({
        id: 'a1b20011-0001-4000-8000-000000000007',
        name: 'Return Proclama Health Response',
        type: 'n8n-nodes-base.respondToWebhook',
        version: 1.5,
        position: [1280, 300],
    })
    ReturnProclamaHealthResponse = {
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
        this.ReceiveOnrcpnProclamaHealth.out(0).to(this.ValidarEntrada.in(0));
        this.ValidarEntrada.out(0).to(this.EntradaValida.in(0));
        this.EntradaValida.out(0).to(this.ProclamaHealthOnrcpn.in(0));
        this.EntradaValida.out(1).to(this.RespostaErroEntrada.in(0));
        this.ProclamaHealthOnrcpn.out(0).to(this.BuildProclamaHealthResponse.in(0));
        this.BuildProclamaHealthResponse.out(0).to(this.ReturnProclamaHealthResponse.in(0));
        this.RespostaErroEntrada.out(0).to(this.ReturnProclamaHealthResponse.in(0));
    }
}
