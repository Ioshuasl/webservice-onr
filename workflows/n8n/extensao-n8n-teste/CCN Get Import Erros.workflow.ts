import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : [AUTONR-90] (CCN) CCN_ImportsErros - CCN
// Nodes   : 7  |  Connections: 7
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// ReceiveCcnImportErros              webhook                    [creds]
// ValidarEntrada                     code
// EntradaValida                      if
// RespostaErroEntrada                code
// GetImportErrosCcn                  httpRequest                [onError→regular] [alwaysOutput]
// BuildErrosResponse                 code
// ReturnErrosResponse                respondToWebhook
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// ReceiveCcnImportErros
//    → ValidarEntrada
//      → EntradaValida
//        → GetImportErrosCcn
//          → BuildErrosResponse
//            → ReturnErrosResponse
//       .out(1) → RespostaErroEntrada
//          → ReturnErrosResponse (↩ loop)
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'TUbsvYHrfuS9xf2P',
    name: '[AUTONR-90] (CCN) CCN_ImportsErros - CCN',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class Autonr90CcnCcnImportserrosCcnWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'd1e2f3a4-b5c6-4789-d0e1-f2a3b4c5d6e7',
        webhookId: 'c4d5e6f7-a8b9-4012-d3e4-f5a6b7c8d9e0',
        name: 'Receive CCN Import Erros',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 300],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    ReceiveCcnImportErros = {
        httpMethod: 'GET',
        path: 'ccn/imports/:id/erros',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'e2f3a4b5-c6d7-4890-e1f2-a3b4c5d6e7f8',
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
  return erro(422, 'import_id_ausente', 'Informe o UUID da importacao na URL (/ccn/imports/{id}/erros).');
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

return [{
  json: {
    valid: true,
    importId,
    errosUrl: amb.baseUrl + '/api/imports/' + importId + '/errors',
    meta: {
      ambiente: amb.key,
      baseUrl: amb.baseUrl,
      ccnApiKey,
      importId,
      receivedAt: new Date().toISOString(),
      source: 'n8n-ccn-get-import-erros',
    },
  },
}];
`,
    };

    @node({
        id: 'f3a4b5c6-d7e8-4901-f2a3-b4c5d6e7f8a9',
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
                    id: 'cond-import-erros-valido',
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
        id: 'a4b5c6d7-e8f9-4012-a3b4-c5d6e7f8a9b0',
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
        id: 'b5c6d7e8-f9a0-4123-b4c5-d6e7f8a9b0c1',
        name: 'Get Import Erros CCN',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [840, 180],
        onError: 'continueRegularOutput',
        alwaysOutputData: true,
    })
    GetImportErrosCcn = {
        method: 'GET',
        url: '={{ $json.errosUrl }}',
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
        id: 'c6d7e8f9-a0b1-4234-c5d6-e7f8a9b0c1d2',
        name: 'Build Erros Response',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1060, 180],
    })
    BuildErrosResponse = {
        mode: 'runOnceForAllItems',
        language: 'javaScript',
        jsCode: `
const allItems = $input.all();
const entrada = $('Validar Entrada').first().json;
const meta = entrada.meta ?? {};

function buildSuccess(erros) {
  return [{
    json: {
      statusCode: 200,
      response: {
        success: true,
        message: 'Erros da importacao CCN consultados com sucesso.',
        importId: meta.importId,
        erros,
        meta,
      },
    },
  }];
}

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
  const rawMessage = errorObject?.message ?? 'Erro desconhecido ao consultar erros da importacao CCN.';
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

function isPassthroughEntrada(body) {
  return body && (body.errosUrl || body.valid === true);
}

function normalizeErrosPayload(body, itemCount) {
  if (itemCount > 1) {
    return allItems.map((item) => item.json);
  }
  if (body === undefined || body === null) return [];
  if (isPassthroughEntrada(body)) return [];
  if (Array.isArray(body)) return body;
  if (Array.isArray(body.items)) return body.items;
  if (Array.isArray(body.erros)) return body.erros;
  if (Array.isArray(body.errors)) return body.errors;
  if (Array.isArray(body.data)) return body.data;
  if (Object.keys(body).length === 0) return [];
  return [body];
}

if (!allItems.length) {
  return buildSuccess([]);
}

const errosResult = allItems[0].json;

if (errosResult.error) {
  const normalized = normalizeHttpError(errosResult.error);
  return [{
    json: {
      statusCode: normalized.statusCode,
      response: {
        success: false,
        message: normalized.message,
        stage: 'import_erros_get',
        erros: [],
        errors: normalized.errors,
        meta,
        technical: normalized.technical,
      },
    },
  }];
}

return buildSuccess(normalizeErrosPayload(errosResult, allItems.length));
`,
    };

    @node({
        id: 'd7e8f9a0-b1c2-4345-d6e7-f8a9b0c1d2e3',
        name: 'Return Erros Response',
        type: 'n8n-nodes-base.respondToWebhook',
        version: 1.5,
        position: [1280, 300],
    })
    ReturnErrosResponse = {
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
        this.ReceiveCcnImportErros.out(0).to(this.ValidarEntrada.in(0));
        this.ValidarEntrada.out(0).to(this.EntradaValida.in(0));
        this.EntradaValida.out(0).to(this.GetImportErrosCcn.in(0));
        this.EntradaValida.out(1).to(this.RespostaErroEntrada.in(0));
        this.GetImportErrosCcn.out(0).to(this.BuildErrosResponse.in(0));
        this.BuildErrosResponse.out(0).to(this.ReturnErrosResponse.in(0));
        this.RespostaErroEntrada.out(0).to(this.ReturnErrosResponse.in(0));
    }
}
