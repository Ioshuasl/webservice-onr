import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : [AUTENOT-8] (enot) ENotAssinaRecognitions - e-Not Assina
// Nodes   : 7  |  Connections: 7
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// ReceiveEnotAssinaRecognitions      webhook                    [creds]
// ValidarEntrada                     code
// EntradaValida                      if
// RespostaErroEntrada                code
// EnotassinarecognitionsEnot         httpRequest                [onError→regular]
// BuildEnotassinarecognitionsResponse code
// ReturnEnotassinarecognitionsResponse respondToWebhook
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// ReceiveEnotAssinaRecognitions
//    → ValidarEntrada
//      → EntradaValida
//        → EnotassinarecognitionsEnot
//          → BuildEnotassinarecognitionsResponse
//            → ReturnEnotassinarecognitionsResponse
//       .out(1) → RespostaErroEntrada
//          → ReturnEnotassinarecognitionsResponse (↩ loop)
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'AXiG6PeTO9X7AcYV',
    name: '[AUTENOT-8] (enot) ENotAssinaRecognitions - e-Not Assina',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class Autenot8EnotEnotassinarecognitionsENotAssinaWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'e1430008-0008-4000-8000-000000000001',
        webhookId: 'e1430008-0008-4000-8000-000000000011',
        name: 'Receive ENOT Assina Recognitions',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 300],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    ReceiveEnotAssinaRecognitions = {
        httpMethod: 'POST',
        path: 'enot/assina/reconhecimentos',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'e1430008-0008-4000-8000-000000000002',
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

function pickField(obj, ...keys) {
  for (const key of keys) {
    if (obj && obj[key] !== undefined && obj[key] !== null) return obj[key];
  }
  return undefined;
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

function isIsoDateTime(value) {
  const text = String(value ?? '').trim();
  if (!text) return false;
  const parsed = Date.parse(text);
  return !Number.isNaN(parsed);
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

const organizationId = pick(
  pickField(body, 'organization_id', 'organizationId'),
  $env.ENOT_ORGANIZATION_ID,
);
if (!organizationId) {
  return erro(
    422,
    'organization_id_ausente',
    'Informe organization_id no body ou configure ENOT_ORGANIZATION_ID no n8n.',
    { fontes: ['body.organization_id', 'ENOT_ORGANIZATION_ID'] },
  );
}

const startDateUtc = pick(
  pickField(body, 'start_date_utc', 'startDateUtc', 'StartDateUtc'),
);
if (!startDateUtc) {
  return erro(
    422,
    'start_date_utc_ausente',
    'Informe start_date_utc (inicio do intervalo, ISO 8601 UTC).',
    { exemplo: '2023-01-01T00:00:00.001Z' },
  );
}
if (!isIsoDateTime(startDateUtc)) {
  return erro(
    422,
    'start_date_utc_invalido',
    'start_date_utc deve ser data/hora ISO 8601 valida em UTC.',
    { informado: startDateUtc },
  );
}

const endDateUtc = pick(
  pickField(body, 'end_date_utc', 'endDateUtc', 'EndDateUtc'),
);
if (!endDateUtc) {
  return erro(
    422,
    'end_date_utc_ausente',
    'Informe end_date_utc (fim do intervalo, ISO 8601 UTC).',
    { exemplo: '2023-01-02T00:00:00.001Z' },
  );
}
if (!isIsoDateTime(endDateUtc)) {
  return erro(
    422,
    'end_date_utc_invalido',
    'end_date_utc deve ser data/hora ISO 8601 valida em UTC.',
    { informado: endDateUtc },
  );
}

if (Date.parse(startDateUtc) > Date.parse(endDateUtc)) {
  return erro(
    422,
    'intervalo_datas_invalido',
    'start_date_utc deve ser anterior ou igual a end_date_utc.',
    { start_date_utc: startDateUtc, end_date_utc: endDateUtc },
  );
}

const encodedOrg = encodeURIComponent(organizationId);
const queryParams = [
  'StartDateUtc=' + encodeURIComponent(startDateUtc),
  'EndDateUtc=' + encodeURIComponent(endDateUtc),
];

const baseUrl = amb.baseUrl.replace(/\\/$/, '');
const endpoint = '/api/reports/organizations/' + encodedOrg + '/e-not-assina-recognitions';
const recognitionsUrl = baseUrl + endpoint + '?' + queryParams.join('&');

return [{
  json: {
    valid: true,
    recognitionsUrl,
    apiKey,
    meta: {
      ambiente: amb.key,
      baseUrl,
      endpoint,
      organization_id: organizationId,
      start_date_utc: startDateUtc,
      end_date_utc: endDateUtc,
      receivedAt: new Date().toISOString(),
      source: 'n8n-enot-assina-recognitions',
    },
  },
}];
`,
    };

    @node({
        id: 'e1430008-0008-4000-8000-000000000003',
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
                    id: 'cond-enot-assina-recognitions-valido',
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
        id: 'e1430008-0008-4000-8000-000000000004',
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
        id: 'e1430008-0008-4000-8000-000000000005',
        name: 'ENotAssinaRecognitions ENOT',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [840, 180],
        onError: 'continueRegularOutput',
    })
    EnotassinarecognitionsEnot = {
        method: 'GET',
        url: '={{ $json.recognitionsUrl }}',
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
        id: 'e1430008-0008-4000-8000-000000000006',
        name: 'Build ENotAssinaRecognitions Response',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1060, 180],
    })
    BuildEnotassinarecognitionsResponse = {
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
  const rawMessage = errorObject?.message ?? 'Erro desconhecido ao consultar reconhecimentos e-Not Assina na API e-Notariado.';
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
        endpoint: meta.endpoint ?? null,
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
        mensagem: data.message ?? data.mensagem ?? data.title ?? 'A API e-Notariado retornou erro ao consultar reconhecimentos e-Not Assina.',
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
      mensagem: 'Reconhecimentos e-Not Assina consultados com sucesso.',
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
        id: 'e1430008-0008-4000-8000-000000000007',
        name: 'Return ENotAssinaRecognitions Response',
        type: 'n8n-nodes-base.respondToWebhook',
        version: 1.5,
        position: [1280, 300],
    })
    ReturnEnotassinarecognitionsResponse = {
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
        this.ReceiveEnotAssinaRecognitions.out(0).to(this.ValidarEntrada.in(0));
        this.ValidarEntrada.out(0).to(this.EntradaValida.in(0));
        this.EntradaValida.out(0).to(this.EnotassinarecognitionsEnot.in(0));
        this.EntradaValida.out(1).to(this.RespostaErroEntrada.in(0));
        this.EnotassinarecognitionsEnot.out(0).to(this.BuildEnotassinarecognitionsResponse.in(0));
        this.BuildEnotassinarecognitionsResponse.out(0).to(this.ReturnEnotassinarecognitionsResponse.in(0));
        this.RespostaErroEntrada.out(0).to(this.ReturnEnotassinarecognitionsResponse.in(0));
    }
}
