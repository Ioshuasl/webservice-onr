import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : [AUTONR-89] (CCN) CCN_ImportsGet - CCN
// Nodes   : 7  |  Connections: 7
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// ReceiveCcnImportStatus             webhook                    [creds]
// ValidarEntrada                     code
// EntradaValida                      if
// RespostaErroEntrada                code
// GetImportCcn                       httpRequest                [onError→regular]
// BuildImportResponse                code
// ReturnImportResponse               respondToWebhook
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// ReceiveCcnImportStatus
//    → ValidarEntrada
//      → EntradaValida
//        → GetImportCcn
//          → BuildImportResponse
//            → ReturnImportResponse
//       .out(1) → RespostaErroEntrada
//          → ReturnImportResponse (↩ loop)
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'STRA45Ya8zFPl8YM',
    name: '[AUTONR-89] (CCN) CCN_ImportsGet - CCN',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class Autonr89CcnCcnImportsgetCcnWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'a1e2f3b4-c5d6-4789-a0b1-c2d3e4f5a6b7',
        webhookId: 'b2f3a4c5-d6e7-4890-b1c2-d3e4f5a6b7c8',
        name: 'Receive CCN Import Status',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 300],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    ReceiveCcnImportStatus = {
        httpMethod: 'GET',
        path: 'ccn/imports/:id',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'c3d4e5f6-a7b8-4901-c2d3-e4f5a6b7c8d9',
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
const params = item.json?.params ?? {};
const query = item.json?.query ?? {};

function header(name) {
  const lower = name.toLowerCase();
  return headers[lower] ?? headers[name] ?? '';
}

function resolveAmbiente() {
  const raw = String(header('x-ambiente') || 'homologacao').toLowerCase();
  if (raw === 'producao' || raw === 'production' || raw === 'prod') {
    return { key: 'producao', baseUrl: 'https://pessoas.e-notariado.org.br' };
  }
  return { key: 'homologacao', baseUrl: 'https://pessoas-hml.e-notariado.org.br' };
}

function erro(status, code, message, technical) {
  const response = {
    success: false,
    message,
    errors: [{ code, message, sistema: 'CCN' }],
  };
  if (technical) response.technical = technical;
  return [{
    json: {
      valid: false,
      statusCode: status,
      response,
    },
  }];
}

const importId = String(params.id ?? params.ID ?? '').trim();
const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

if (!importId) {
  return erro(422, 'import_id_ausente', 'Informe o UUID da importacao na URL (/ccn/imports/{id}).');
}

if (!uuidRe.test(importId)) {
  return erro(422, 'import_id_invalido', 'O id da importacao deve ser um UUID valido.', { importId });
}

const amb = resolveAmbiente();
const ccnApiKey = header('x-ccn-api-key') || header('x-api-key') || ($env.CCN_X_API_KEY ?? '');
if (!ccnApiKey) {
  return erro(
    422,
    'api_key_ausente',
    'Informe header X-Ccn-Api-Key (ou X-Api-Key) ou configure CCN_X_API_KEY no n8n.',
  );
}

const includeErrosRaw = String(query.include_erros ?? query.includeErros ?? 'false').toLowerCase();
const includeErros = includeErrosRaw === 'true' || includeErrosRaw === '1' || includeErrosRaw === 'yes';

return [{
  json: {
    valid: true,
    importId,
    importUrl: amb.baseUrl + '/api/imports/' + importId,
    errosUrl: amb.baseUrl + '/api/imports/' + importId + '/errors',
    includeErros,
    meta: {
      ambiente: amb.key,
      baseUrl: amb.baseUrl,
      ccnApiKey,
      importId,
      includeErros,
      receivedAt: new Date().toISOString(),
      source: 'n8n-ccn-get-import-status',
    },
  },
}];
`,
    };

    @node({
        id: 'd4e5f6a7-b8c9-4012-d3e4-f5a6b7c8d9e0',
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
                    id: 'cond-import-get-valido',
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
        id: 'e5f6a7b8-c9d0-4123-e4f5-a6b7c8d9e0f1',
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
      success: false,
      message: 'Entrada rejeitada pela validacao local.',
      errors: [],
    },
  },
}];
`,
    };

    @node({
        id: 'f6a7b8c9-d0e1-4234-f5a6-b7c8d9e0f1a2',
        name: 'Get Import CCN',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [840, 180],
        onError: 'continueRegularOutput',
    })
    GetImportCcn = {
        method: 'GET',
        url: '={{ $json.importUrl }}',
        authentication: 'none',
        sendHeaders: true,
        specifyHeaders: 'keypair',
        headerParameters: {
            parameters: [
                {
                    name: 'X-Api-Key',
                    value: '={{ $json.meta.ccnApiKey }}',
                },
                {
                    name: 'Accept',
                    value: 'application/json',
                },
            ],
        },
        options: {},
    };

    @node({
        id: 'a7b8c9d0-e1f2-4345-a6b7-c8d9e0f1a2b3',
        name: 'Build Import Response',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1060, 180],
    })
    BuildImportResponse = {
        mode: 'runOnceForAllItems',
        language: 'javaScript',
        jsCode: `
const importResult = items[0].json;
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
  const rawMessage = errorObject?.message ?? 'Erro desconhecido ao consultar importacao CCN.';
  const status = Number(
    errorObject?.status
      ?? errorObject?.httpCode
      ?? rawMessage.match(/^\\s*(\\d{3})\\s*-/)?.[1]
      ?? 502,
  );
  const parsed = parseJsonSafe(errorObject?.response?.body)
    ?? parseJsonSafe(errorObject?.response?.data)
    ?? (typeof errorObject?.response?.body === 'object' ? errorObject.response.body : null);

  return {
    statusCode: status || 502,
    message: parsed?.message ?? parsed?.title ?? rawMessage,
    errors: [{ code: 'ccn_http_error', message: parsed?.message ?? rawMessage, sistema: 'CCN' }],
    technical: {
      name: errorObject?.name ?? null,
      code: errorObject?.code ?? null,
      status: status || null,
    },
  };
}

if (importResult.error) {
  const normalized = normalizeHttpError(importResult.error);
  return [{
    json: {
      statusCode: normalized.statusCode,
      response: {
        success: false,
        message: normalized.message,
        stage: 'import_get',
        errors: normalized.errors,
        meta,
        technical: normalized.technical,
      },
    },
  }];
}

const imp = importResult;
const failedRecords = Number(imp.failedRecords ?? 0);
let erros = null;

if (entrada.includeErros && failedRecords > 0) {
  try {
    erros = await this.helpers.httpRequest({
      method: 'GET',
      url: entrada.errosUrl,
      headers: {
        'X-Api-Key': meta.ccnApiKey,
        Accept: 'application/json',
      },
      json: true,
    });
  } catch (err) {
    erros = {
      fetchFailed: true,
      message: err?.message ?? 'Falha ao consultar erros da importacao.',
    };
  }
}

const response = {
  success: true,
  message: 'Status da importacao CCN consultado com sucesso.',
  importacao: {
    id: imp.id ?? meta.importId,
    status: imp.status,
    type: imp.type ?? null,
    processedRecords: imp.processedRecords,
    failedRecords: imp.failedRecords,
    totalRecords: imp.totalRecords,
    fileName: imp.fileName,
    uploadId: imp.uploadId,
  },
  meta,
};

if (erros !== null) {
  response.erros = erros;
}

return [{
  json: {
    statusCode: 200,
    response,
  },
}];
`,
    };

    @node({
        id: 'b8c9d0e1-f2a3-4456-b7c8-d9e0f1a2b3c4',
        name: 'Return Import Response',
        type: 'n8n-nodes-base.respondToWebhook',
        version: 1.5,
        position: [1280, 300],
    })
    ReturnImportResponse = {
        respondWith: 'json',
        responseBody: '={{ $json.response }}',
        options: {
            responseCode: '={{ $json.statusCode || 200 }}',
        },
    };

    // =====================================================================
    // ROUTAGE ET CONNEXIONS
    // =====================================================================

    @links()
    defineRouting() {
        this.ReceiveCcnImportStatus.out(0).to(this.ValidarEntrada.in(0));
        this.ValidarEntrada.out(0).to(this.EntradaValida.in(0));
        this.EntradaValida.out(0).to(this.GetImportCcn.in(0));
        this.EntradaValida.out(1).to(this.RespostaErroEntrada.in(0));
        this.GetImportCcn.out(0).to(this.BuildImportResponse.in(0));
        this.BuildImportResponse.out(0).to(this.ReturnImportResponse.in(0));
        this.RespostaErroEntrada.out(0).to(this.ReturnImportResponse.in(0));
    }
}
