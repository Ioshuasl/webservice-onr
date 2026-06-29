import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : [AUTENOT-4] (enot) DocumentsList - Fluxo
// Nodes   : 7  |  Connections: 7
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// ReceiveEnotDocumentslist           webhook                    [creds]
// ValidarEntrada                     code
// EntradaValida                      if
// RespostaErroEntrada                code
// DocumentslistEnot                  httpRequest                [onError→regular]
// BuildDocumentslistResponse         code
// ReturnDocumentslistResponse        respondToWebhook
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// ReceiveEnotDocumentslist
//    → ValidarEntrada
//      → EntradaValida
//        → DocumentslistEnot
//          → BuildDocumentslistResponse
//            → ReturnDocumentslistResponse
//       .out(1) → RespostaErroEntrada
//          → ReturnDocumentslistResponse (↩ loop)
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'Tj8zhbIOzGlQ7HiV',
    name: '[AUTENOT-4] (enot) DocumentsList - Fluxo',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class Autenot4EnotDocumentslistFluxoWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'e1430004-0004-4000-8000-000000000001',
        webhookId: 'e1430004-0004-4000-8000-000000000011',
        name: 'Receive ENOT DocumentsList',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 300],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    ReceiveEnotDocumentslist = {
        httpMethod: 'POST',
        path: 'enot/fluxo/listar',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'e1430004-0004-4000-8000-000000000002',
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

const DOCUMENT_TYPES = new Set([
  'Deed',
  'PowerOfAttorney',
  'Testament',
  'NotarialMinutes',
  'TranscriptForPhysicalActs',
  'AcknowledgmentForPhysicalActs',
  'AcknowledgmentForDigitalActs',
  'PrivateDocument',
  'TravelPermit',
  'SignatureNotarizationTerm',
  'EnotAuto',
  'OrganDonationPermit',
  'OrganDonationPermitRevocation',
]);

const ORDER_VALUES = new Set(['asc', 'desc']);

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

function isBoolean(value) {
  return typeof value === 'boolean';
}

function appendBooleanParam(params, upstreamKey, value) {
  if (value === undefined || value === null) return;
  if (!isBoolean(value)) return { error: \`\${upstreamKey} deve ser boolean (true/false).\` };
  params.push(\`\${upstreamKey}=\${value}\`);
  return null;
}

function appendStringParam(params, upstreamKey, value) {
  if (value === undefined || value === null) return;
  const text = String(value).trim();
  if (!text) return;
  params.push(\`\${upstreamKey}=\${encodeURIComponent(text)}\`);
}

function appendNumberParam(params, upstreamKey, value, label) {
  if (value === undefined || value === null || value === '') return;
  const num = Number(value);
  if (Number.isNaN(num) || num < 0) {
    return { error: \`\${label} deve ser numero >= 0.\` };
  }
  params.push(\`\${upstreamKey}=\${num}\`);
  return null;
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

const queryParams = [];
const filters = {};

const isConcluded = pickField(body, 'is_concluded', 'isConcluded', 'IsConcluded');
const isConcludedErr = appendBooleanParam(queryParams, 'IsConcluded', isConcluded);
if (isConcludedErr) {
  return erro(422, 'is_concluded_invalido', isConcludedErr.error, null);
}
if (isConcluded !== undefined && isConcluded !== null) filters.is_concluded = isConcluded;

const isCanceled = pickField(body, 'is_canceled', 'isCanceled', 'IsCanceled');
const isCanceledErr = appendBooleanParam(queryParams, 'IsCanceled', isCanceled);
if (isCanceledErr) {
  return erro(422, 'is_canceled_invalido', isCanceledErr.error, null);
}
if (isCanceled !== undefined && isCanceled !== null) filters.is_canceled = isCanceled;

const documentType = pick(
  pickField(body, 'document_type', 'documentType', 'DocumentType'),
);
if (documentType) {
  if (!DOCUMENT_TYPES.has(documentType)) {
    return erro(
      422,
      'document_type_invalido',
      'document_type invalido. Consulte a documentacao CNB para TypeOfAct / DocumentType.',
      { informado: documentType, aceitos: [...DOCUMENT_TYPES] },
    );
  }
  appendStringParam(queryParams, 'DocumentType', documentType);
  filters.document_type = documentType;
}

const limit = pickField(body, 'limit', 'Limit');
const limitErr = appendNumberParam(queryParams, 'Limit', limit, 'limit');
if (limitErr) return erro(422, 'limit_invalido', limitErr.error, null);
if (limit !== undefined && limit !== null && limit !== '') filters.limit = Number(limit);

const offset = pickField(body, 'offset', 'Offset');
const offsetErr = appendNumberParam(queryParams, 'Offset', offset, 'offset');
if (offsetErr) return erro(422, 'offset_invalido', offsetErr.error, null);
if (offset !== undefined && offset !== null && offset !== '') filters.offset = Number(offset);

const order = pick(pickField(body, 'order', 'Order')).toLowerCase();
if (order) {
  if (!ORDER_VALUES.has(order)) {
    return erro(
      422,
      'order_invalido',
      'order deve ser asc ou desc.',
      { informado: order, aceitos: ['asc', 'desc'] },
    );
  }
  appendStringParam(queryParams, 'order', order);
  filters.order = order;
}

const baseUrl = amb.baseUrl.replace(/\\/$/, '');
const queryString = queryParams.length ? '?' + queryParams.join('&') : '';
const documentsUrl = baseUrl + '/api/documents' + queryString;

return [{
  json: {
    valid: true,
    documentsUrl,
    apiKey,
    meta: {
      ambiente: amb.key,
      baseUrl,
      endpoint: '/api/documents',
      filters,
      receivedAt: new Date().toISOString(),
      source: 'n8n-enot-documents-list',
    },
  },
}];
`,
    };

    @node({
        id: 'e1430004-0004-4000-8000-000000000003',
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
                    id: 'cond-enot-documents-list-valido',
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
        id: 'e1430004-0004-4000-8000-000000000004',
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
        id: 'e1430004-0004-4000-8000-000000000005',
        name: 'DocumentsList ENOT',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [840, 180],
        onError: 'continueRegularOutput',
    })
    DocumentslistEnot = {
        method: 'GET',
        url: '={{ $json.documentsUrl }}',
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
        id: 'e1430004-0004-4000-8000-000000000006',
        name: 'Build DocumentsList Response',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1060, 180],
    })
    BuildDocumentslistResponse = {
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
  const rawMessage = errorObject?.message ?? 'Erro desconhecido ao listar documentos na API e-Notariado.';
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
        endpoint: meta.endpoint ?? '/api/documents',
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
        mensagem: data.message ?? data.mensagem ?? data.title ?? 'A API e-Notariado retornou erro ao listar documentos.',
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
      mensagem: 'Lista de documentos do fluxo consultada com sucesso.',
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
        id: 'e1430004-0004-4000-8000-000000000007',
        name: 'Return DocumentsList Response',
        type: 'n8n-nodes-base.respondToWebhook',
        version: 1.5,
        position: [1280, 300],
    })
    ReturnDocumentslistResponse = {
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
        this.ReceiveEnotDocumentslist.out(0).to(this.ValidarEntrada.in(0));
        this.ValidarEntrada.out(0).to(this.EntradaValida.in(0));
        this.EntradaValida.out(0).to(this.DocumentslistEnot.in(0));
        this.EntradaValida.out(1).to(this.RespostaErroEntrada.in(0));
        this.DocumentslistEnot.out(0).to(this.BuildDocumentslistResponse.in(0));
        this.BuildDocumentslistResponse.out(0).to(this.ReturnDocumentslistResponse.in(0));
        this.RespostaErroEntrada.out(0).to(this.ReturnDocumentslistResponse.in(0));
    }
}
