import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : [AUTSEETJGO-2] (see tjgo) Status - Geral
// Nodes   : 7  |  Connections: 7
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// ReceiveSeeTjgoStatus               webhook                    [creds]
// ValidarEntrada                     code
// EntradaValida                      if
// RespostaErroEntrada                code
// StatusSeeTjgo                      httpRequest                [onError→regular]
// BuildStatusResponse                code
// ReturnStatusResponse               respondToWebhook
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// ReceiveSeeTjgoStatus
//    → ValidarEntrada
//      → EntradaValida
//        → StatusSeeTjgo
//          → BuildStatusResponse
//            → ReturnStatusResponse
//       .out(1) → RespostaErroEntrada
//          → ReturnStatusResponse (↩ loop)
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: '8G7QL5Hbu4sWuZL2',
    name: '[AUTSEETJGO-2] (see tjgo) Status - Geral',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class Autseetjgo2SeeTjgoStatusGeralWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'e1f20002-0001-4000-8000-000000000001',
        webhookId: 'e1f20002-0001-4000-8000-000000000011',
        name: 'Receive SEE TJGO Status',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 300],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    ReceiveSeeTjgoStatus = {
        httpMethod: 'GET',
        path: 'see-tjgo/status',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'e1f20002-0001-4000-8000-000000000002',
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
  return {
    key: cfg.key,
    baseUrl: cfg.baseUrl(),
  };
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
  return [{
    json: {
      valid: false,
      statusCode: status,
      response,
    },
  }];
}

const amb = resolveAmbiente();
if (amb.invalid) {
  return erro(
    422,
    'ambiente_invalido',
    'ambiente deve ser producao ou homologacao.',
    { ambiente: amb.informado, aceitos: ['producao', 'homologacao'] },
  );
}

const baseUrl = amb.baseUrl.replace(/\\/$/, '');
const statusUrl = baseUrl + '/status';

return [{
  json: {
    valid: true,
    statusUrl,
    meta: {
      ambiente: amb.key,
      baseUrl,
      endpoint: '/status',
      receivedAt: new Date().toISOString(),
      source: 'n8n-see-tjgo-status',
      auth_required: false,
    },
    errorDefaultMsg: 'Erro ao consultar status da API SEE TJGO.',
  },
}];
`,
    };

    @node({
        id: 'e1f20002-0001-4000-8000-000000000003',
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
                    id: 'cond-see-status-valido',
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
        id: 'e1f20002-0001-4000-8000-000000000004',
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
        id: 'e1f20002-0001-4000-8000-000000000005',
        name: 'Status SEE TJGO',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [840, 180],
        onError: 'continueRegularOutput',
    })
    StatusSeeTjgo = {
        method: 'GET',
        url: '={{ $json.statusUrl }}',
        authentication: 'none',
        sendHeaders: true,
        specifyHeaders: 'keypair',
        headerParameters: {
            parameters: [
                {
                    name: 'Accept',
                    value: 'application/json',
                },
            ],
        },
        options: {},
    };

    @node({
        id: 'e1f20002-0001-4000-8000-000000000006',
        name: 'Build Status Response',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1060, 180],
    })
    BuildStatusResponse = {
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
  try {
    return JSON.parse(value);
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
  const statusCode = status === 500 ? 500 : (status || 502);

  return {
    statusCode,
    response: {
      sucesso: false,
      codigo_erro: 'see_http_error',
      mensagem_erro: formatMensagens(parsed) ?? rawMessage,
      sistema: 'SEE TJGO',
      status_http: statusCode,
      ambiente: meta.ambiente ?? null,
      meta,
      detalhe_tecnico: {
        name: errorObject?.name ?? null,
        code: errorObject?.code ?? null,
        status: status || null,
        endpoint: meta.endpoint ?? '/status',
      },
      resposta_api: parsed,
    },
  };
}

function extractStatusPayload(data) {
  const parsed = parseJsonSafe(data?.body) ?? (typeof data?.body === 'object' ? data.body : data);
  if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
    return parsed;
  }
  return null;
}

if (httpResult.error) {
  return [{ json: normalizeHttpError(httpResult.error, entrada.errorDefaultMsg ?? 'Erro na API SEE TJGO.') }];
}

const statusCode = Number(httpResult?.statusCode ?? httpResult?.status ?? 200);
const payload = extractStatusPayload(httpResult);

if (statusCode >= 400) {
  return [{
    json: {
      statusCode: statusCode >= 100 && statusCode < 600 ? statusCode : 502,
      response: {
        sucesso: false,
        codigo_erro: 'see_api_error',
        mensagem_erro: formatMensagens(payload) ?? payload?.message ?? 'A API SEE TJGO reportou indisponibilidade.',
        message: payload?.message ?? null,
        status: payload?.status ?? statusCode,
        sistema: 'SEE TJGO',
        status_http: statusCode,
        ambiente: meta.ambiente ?? null,
        meta,
        resposta_api: payload,
      },
    },
  }];
}

if (!payload) {
  return [{
    json: {
      statusCode: 502,
      response: {
        sucesso: false,
        codigo_erro: 'resposta_inesperada',
        mensagem_erro: 'Resposta da API SEE TJGO em formato nao reconhecido (esperado message/status).',
        sistema: 'SEE TJGO',
        status_http: 502,
        ambiente: meta.ambiente ?? null,
        meta,
        resposta_api: httpResult,
      },
    },
  }];
}

return [{
  json: {
    statusCode: 200,
    response: {
      sucesso: true,
      status_http: 200,
      message: payload.message ?? 'OK',
      status: payload.status ?? 200,
      sistema_online: (payload.status ?? 200) === 200,
      ambiente: meta.ambiente ?? null,
      meta,
    },
  },
}];
`,
    };

    @node({
        id: 'e1f20002-0001-4000-8000-000000000007',
        name: 'Return Status Response',
        type: 'n8n-nodes-base.respondToWebhook',
        version: 1.5,
        position: [1280, 300],
    })
    ReturnStatusResponse = {
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
        this.ReceiveSeeTjgoStatus.out(0).to(this.ValidarEntrada.in(0));
        this.ValidarEntrada.out(0).to(this.EntradaValida.in(0));
        this.EntradaValida.out(0).to(this.StatusSeeTjgo.in(0));
        this.EntradaValida.out(1).to(this.RespostaErroEntrada.in(0));
        this.StatusSeeTjgo.out(0).to(this.BuildStatusResponse.in(0));
        this.BuildStatusResponse.out(0).to(this.ReturnStatusResponse.in(0));
        this.RespostaErroEntrada.out(0).to(this.ReturnStatusResponse.in(0));
    }
}
