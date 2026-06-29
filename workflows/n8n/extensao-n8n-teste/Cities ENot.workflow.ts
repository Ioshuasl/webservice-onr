import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : [AUTENOT-1] (enot) Cities - Catálogo
// Nodes   : 7  |  Connections: 7
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// ReceiveEnotCities                  webhook                    [creds]
// ValidarEntrada                     code
// EntradaValida                      if
// RespostaErroEntrada                code
// CitiesEnot                         httpRequest                [onError→regular]
// BuildCitiesResponse                code
// ReturnCitiesResponse               respondToWebhook
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// ReceiveEnotCities
//    → ValidarEntrada
//      → EntradaValida
//        → CitiesEnot
//          → BuildCitiesResponse
//            → ReturnCitiesResponse
//       .out(1) → RespostaErroEntrada
//          → ReturnCitiesResponse (↩ loop)
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'xNEOLoiusslcjYPy',
    name: '[AUTENOT-1] (enot) Cities - Catálogo',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class Autenot1EnotCitiesCatalogoWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'e1430001-0001-4000-8000-000000000001',
        webhookId: 'e1430001-0001-4000-8000-000000000011',
        name: 'Receive ENOT Cities',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 300],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    ReceiveEnotCities = {
        httpMethod: 'POST',
        path: 'enot/catalogo/cities',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'e1430001-0001-4000-8000-000000000002',
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

const AMBIENTES_ENOT = {
  homologacao: {
    key: 'homologacao',
    baseUrl: () => pick($env.ENOT_API_BASE_URL, 'https://assinatura-hml.e-notariado.org.br'),
  },
  producao: {
    key: 'producao',
    baseUrl: () => pick($env.ENOT_API_BASE_URL_PROD, 'https://assinatura.e-notariado.org.br'),
  },
};

const AMBIENTE_ALIASES = {
  homologacao: 'homologacao',
  homolog: 'homologacao',
  hml: 'homologacao',
  staging: 'homologacao',
  producao: 'producao',
  prod: 'producao',
  production: 'producao',
};

function resolveAmbiente() {
  const raw = pick(
    body.ambiente,
    query.ambiente,
    header('x-ambiente'),
    $env.ENOT_AMBIENTE,
    'homologacao',
  ).toLowerCase();
  const key = AMBIENTE_ALIASES[raw];
  if (!key) {
    return { invalid: true, informado: raw };
  }
  const cfg = AMBIENTES_ENOT[key];
  return {
    key: cfg.key,
    baseUrl: cfg.baseUrl(),
  };
}

function resolveApiKey() {
  return pick(
    body.api_key,
    body.apiKey,
    header('x-api-key'),
    header('X-Api-Key'),
    $env.ENOT_API_KEY,
  );
}

function erro(status, code, message, technical) {
  const response = {
    sucesso: false,
    codigo_erro: code,
    mensagem: message,
    status_http: status,
    sistema: 'ENOT',
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
    'ambiente deve ser homologacao ou producao.',
    { ambiente: amb.informado, aceitos: ['homologacao', 'producao'] },
  );
}

const apiKey = resolveApiKey();
if (!apiKey) {
  return erro(
    422,
    'api_key_ausente',
    'Informe api_key no body, header X-Api-Key ou configure ENOT_API_KEY no n8n.',
    { fontes: ['body.api_key', 'X-Api-Key', 'ENOT_API_KEY'] },
  );
}

const baseUrl = amb.baseUrl.replace(/\\/$/, '');
const citiesUrl = baseUrl + '/api/parent/cities';

return [{
  json: {
    valid: true,
    citiesUrl,
    apiKey,
    meta: {
      ambiente: amb.key,
      baseUrl,
      endpoint: '/api/parent/cities',
      receivedAt: new Date().toISOString(),
      source: 'n8n-enot-cities',
    },
  },
}];
`,
    };

    @node({
        id: 'e1430001-0001-4000-8000-000000000003',
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
                    id: 'cond-enot-cities-valido',
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
        id: 'e1430001-0001-4000-8000-000000000004',
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
      mensagem: 'Entrada rejeitada pela validacao local.',
      status_http: data.statusCode || 422,
      sistema: 'ENOT',
    },
  },
}];
`,
    };

    @node({
        id: 'e1430001-0001-4000-8000-000000000005',
        name: 'Cities ENOT',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [840, 180],
        onError: 'continueRegularOutput',
    })
    CitiesEnot = {
        method: 'GET',
        url: '={{ $json.citiesUrl }}',
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
                    name: 'X-Api-Key',
                    value: '={{ $json.apiKey }}',
                },
            ],
        },
        options: {},
    };

    @node({
        id: 'e1430001-0001-4000-8000-000000000006',
        name: 'Build Cities Response',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1060, 180],
    })
    BuildCitiesResponse = {
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

function normalizeHttpError(errorObject) {
  const rawMessage = errorObject?.message ?? 'Erro desconhecido ao consultar cidades na API e-Notariado.';
  const status = Number(
    errorObject?.status
      ?? errorObject?.httpCode
      ?? rawMessage.match(/^\\s*(\\d{3})\\s*-/)?.[1]
      ?? 502,
  );
  const parsed = parseJsonSafe(errorObject?.response?.body)
    ?? parseJsonSafe(errorObject?.response?.data)
    ?? (typeof errorObject?.response?.body === 'object' ? errorObject.response.body : null);

  const statusCode = status === 401 ? 401 : (status || 502);

  return {
    statusCode,
    response: {
      sucesso: false,
      codigo_erro: parsed?.codigo ?? parsed?.code ?? parsed?.error ?? 'enot_http_error',
      mensagem: parsed?.message ?? parsed?.mensagem ?? parsed?.title ?? rawMessage,
      status_http: statusCode,
      sistema: 'ENOT',
      ambiente: meta.ambiente ?? null,
      meta,
      detalhe_tecnico: {
        name: errorObject?.name ?? null,
        code: errorObject?.code ?? null,
        status: status || null,
        endpoint: meta.endpoint ?? '/api/parent/cities',
      },
    },
  };
}

if (httpResult.error) {
  return [{ json: normalizeHttpError(httpResult.error) }];
}

const data = httpResult;
const upstreamStatus = Number(data.statusCode ?? data.status ?? 200);
const statusCode = upstreamStatus >= 100 && upstreamStatus < 600 ? upstreamStatus : 200;

if (statusCode >= 400) {
  return [{
    json: {
      statusCode,
      response: {
        sucesso: false,
        codigo_erro: data.code ?? data.error ?? 'enot_api_error',
        mensagem: data.message ?? data.mensagem ?? data.title ?? 'A API e-Notariado retornou erro.',
        status_http: statusCode,
        sistema: 'ENOT',
        ambiente: meta.ambiente ?? null,
        meta,
        dados: data,
      },
    },
  }];
}

const dados = data.data ?? data.body ?? data;

return [{
  json: {
    statusCode,
    response: {
      sucesso: true,
      status_http: statusCode,
      mensagem: 'Catálogo de municípios consultado com sucesso.',
      codigo_erro: null,
      dados,
      ambiente: meta.ambiente ?? null,
      meta,
    },
  },
}];
`,
    };

    @node({
        id: 'e1430001-0001-4000-8000-000000000007',
        name: 'Return Cities Response',
        type: 'n8n-nodes-base.respondToWebhook',
        version: 1.5,
        position: [1280, 300],
    })
    ReturnCitiesResponse = {
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
        this.ReceiveEnotCities.out(0).to(this.ValidarEntrada.in(0));
        this.ValidarEntrada.out(0).to(this.EntradaValida.in(0));
        this.EntradaValida.out(0).to(this.CitiesEnot.in(0));
        this.EntradaValida.out(1).to(this.RespostaErroEntrada.in(0));
        this.CitiesEnot.out(0).to(this.BuildCitiesResponse.in(0));
        this.BuildCitiesResponse.out(0).to(this.ReturnCitiesResponse.in(0));
        this.RespostaErroEntrada.out(0).to(this.ReturnCitiesResponse.in(0));
    }
}
