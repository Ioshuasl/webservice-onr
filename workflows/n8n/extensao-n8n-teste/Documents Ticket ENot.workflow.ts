import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : [AUTENOT-6] (enot) DocumentsTicket - Fluxo
// Nodes   : 7  |  Connections: 7
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// ReceiveEnotDocumentsticket         webhook                    [creds]
// ValidarEntrada                     code
// EntradaValida                      if
// RespostaErroEntrada                code
// DocumentsticketEnot                httpRequest                [onError→regular]
// BuildDocumentsticketResponse       code
// ReturnDocumentsticketResponse      respondToWebhook
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// ReceiveEnotDocumentsticket
//    → ValidarEntrada
//      → EntradaValida
//        → DocumentsticketEnot
//          → BuildDocumentsticketResponse
//            → ReturnDocumentsticketResponse
//       .out(1) → RespostaErroEntrada
//          → ReturnDocumentsticketResponse (↩ loop)
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'uh0ciGpB8O9JwQxV',
    name: '[AUTENOT-6] (enot) DocumentsTicket - Fluxo',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class Autenot6EnotDocumentsticketFluxoWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'e1430006-0006-4000-8000-000000000001',
        webhookId: 'e1430006-0006-4000-8000-000000000011',
        name: 'Receive ENOT DocumentsTicket',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 300],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    ReceiveEnotDocumentsticket = {
        httpMethod: 'POST',
        path: 'enot/fluxo/download',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'e1430006-0006-4000-8000-000000000002',
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

const documentId = pick(
  pickField(body, 'document_id', 'documentId', 'id'),
  pickField(query, 'document_id', 'documentId', 'id'),
);
if (!documentId) {
  return erro(
    422,
    'document_id_ausente',
    'Informe document_id (id do documento obtido em AUTENOT-4 DocumentsList).',
    { fontes: ['body.document_id', 'body.id', 'query.document_id'] },
  );
}

const ticketType = pick(pickField(body, 'type', 'Type')) || 'Signatures';
const previewRaw = pickField(body, 'preview', 'Preview');
const preview = previewRaw === undefined || previewRaw === null ? false : previewRaw;

const queryParams = [];
appendStringParam(queryParams, 'type', ticketType);
const previewErr = appendBooleanParam(queryParams, 'preview', preview);
if (previewErr) {
  return erro(422, 'preview_invalido', previewErr.error, null);
}

const baseUrl = amb.baseUrl.replace(/\\/$/, '');
const encodedId = encodeURIComponent(documentId);
const queryString = queryParams.length ? '?' + queryParams.join('&') : '';
const ticketUrl = baseUrl + '/api/documents/' + encodedId + '/ticket' + queryString;

return [{
  json: {
    valid: true,
    ticketUrl,
    documentId,
    apiKey,
    meta: {
      ambiente: amb.key,
      baseUrl,
      endpoint: '/api/documents/{id}/ticket',
      document_id: documentId,
      type: ticketType,
      preview,
      receivedAt: new Date().toISOString(),
      source: 'n8n-enot-documents-ticket',
    },
  },
}];
`,
    };

    @node({
        id: 'e1430006-0006-4000-8000-000000000003',
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
                    id: 'cond-enot-documents-ticket-valido',
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
        id: 'e1430006-0006-4000-8000-000000000004',
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
        id: 'e1430006-0006-4000-8000-000000000005',
        name: 'DocumentsTicket ENOT',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [840, 180],
        onError: 'continueRegularOutput',
    })
    DocumentsticketEnot = {
        method: 'GET',
        url: '={{ $json.ticketUrl }}',
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
        id: 'e1430006-0006-4000-8000-000000000006',
        name: 'Build DocumentsTicket Response',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1060, 180],
    })
    BuildDocumentsticketResponse = {
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
  const rawMessage = errorObject?.message ?? 'Erro desconhecido ao obter ticket de download na API e-Notariado.';
  const status = Number(
    errorObject?.status
      ?? errorObject?.httpCode
      ?? rawMessage.match(/^\\s*(\\d{3})\\s*-/)?.[1]
      ?? 502,
  );
  const parsed = parseJsonSafe(errorObject?.response?.body)
    ?? parseJsonSafe(errorObject?.response?.data)
    ?? (typeof errorObject?.response?.body === 'object' ? errorObject.response.body : null);

  const statusCode = status === 401 ? 401 : (status === 404 ? 404 : (status || 502));

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
        endpoint: meta.endpoint ?? '/api/documents/{id}/ticket',
        document_id: meta.document_id ?? null,
        type: meta.type ?? null,
        preview: meta.preview ?? null,
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
        mensagem: data.message ?? data.mensagem ?? data.title ?? 'A API e-Notariado retornou erro ao obter ticket de download.',
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
      mensagem: 'Ticket de download do documento assinado obtido com sucesso.',
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
        id: 'e1430006-0006-4000-8000-000000000007',
        name: 'Return DocumentsTicket Response',
        type: 'n8n-nodes-base.respondToWebhook',
        version: 1.5,
        position: [1280, 300],
    })
    ReturnDocumentsticketResponse = {
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
        this.ReceiveEnotDocumentsticket.out(0).to(this.ValidarEntrada.in(0));
        this.ValidarEntrada.out(0).to(this.EntradaValida.in(0));
        this.EntradaValida.out(0).to(this.DocumentsticketEnot.in(0));
        this.EntradaValida.out(1).to(this.RespostaErroEntrada.in(0));
        this.DocumentsticketEnot.out(0).to(this.BuildDocumentsticketResponse.in(0));
        this.BuildDocumentsticketResponse.out(0).to(this.ReturnDocumentsticketResponse.in(0));
        this.RespostaErroEntrada.out(0).to(this.ReturnDocumentsticketResponse.in(0));
    }
}
