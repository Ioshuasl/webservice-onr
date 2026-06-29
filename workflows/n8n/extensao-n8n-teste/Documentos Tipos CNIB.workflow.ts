import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : [AUTCNIB-6] (cnib) DocumentosTipos - Documentos
// Nodes   : 7  |  Connections: 7
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// ReceiveCnibDocumentosTipos         webhook                    [creds]
// ValidarEntrada                     code
// EntradaValida                      if
// RespostaErroEntrada                code
// DocumentosTiposCnib                httpRequest                [onError→regular]
// BuildDocumentosTiposResponse       code
// ReturnDocumentosTiposResponse      respondToWebhook
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// ReceiveCnibDocumentosTipos
//    → ValidarEntrada
//      → EntradaValida
//        → DocumentosTiposCnib
//          → BuildDocumentosTiposResponse
//            → ReturnDocumentosTiposResponse
//       .out(1) → RespostaErroEntrada
//          → ReturnDocumentosTiposResponse (↩ loop)
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'c7ZOZAU1IjHOk20P',
    name: '[AUTCNIB-6] (cnib) DocumentosTipos - Documentos',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class Autcnib6CnibDocumentostiposDocumentosWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'c1430006-0001-4000-8000-000000000001',
        webhookId: 'c1430006-0001-4000-8000-000000000011',
        name: 'Receive CNIB Documentos Tipos',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 300],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    ReceiveCnibDocumentosTipos = {
        httpMethod: 'POST',
        path: 'cnib/documentos/tipos',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'c1430006-0001-4000-8000-000000000002',
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

const AMBIENTES_CNIB = {
  producao: {
    key: 'producao',
    baseUrl: () => pick($env.CNIB_API_BASE_URL, 'https://serventia-api.onr.org.br'),
  },
  stg: {
    key: 'stg',
    baseUrl: () => pick($env.CNIB_API_BASE_URL_STG, 'https://stg-serventia-api.onr.org.br'),
  },
};

const AMBIENTE_ALIASES = {
  producao: 'producao',
  prod: 'producao',
  production: 'producao',
  stg: 'stg',
  homologacao: 'stg',
  homolog: 'stg',
  hml: 'stg',
  staging: 'stg',
};

function resolveAmbiente() {
  const raw = pick(
    body.ambiente,
    query.ambiente,
    header('x-ambiente'),
    $env.CNIB_API_AMBIENTE,
    'producao',
  ).toLowerCase();
  const key = AMBIENTE_ALIASES[raw];
  if (!key) {
    return { invalid: true, informado: raw };
  }
  const cfg = AMBIENTES_CNIB[key];
  return {
    key: cfg.key,
    baseUrl: cfg.baseUrl(),
  };
}

function resolveAccessToken() {
  const cnibHeader = pick(header('x-cnib-access-token'), header('X-CNIB-Access-Token'));
  if (cnibHeader) return cnibHeader;
  const authHeader = pick(header('authorization'), header('Authorization'));
  const bearerMatch = authHeader.match(/^Bearer\\s+(.+)$/i);
  if (bearerMatch) return bearerMatch[1].trim();
  return pick(
    query.access_token,
    query.accessToken,
    query.token,
    body.access_token,
    body.accessToken,
    body.token,
  );
}

function erro(status, code, message, technical) {
  const response = {
    sucesso: false,
    codigo_erro: code,
    mensagem_erro: message,
    sistema: 'CNIB',
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
    'ambiente deve ser producao ou stg.',
    { ambiente: amb.informado, aceitos: ['producao', 'stg'] },
  );
}

const accessToken = resolveAccessToken();
if (!accessToken) {
  return erro(
    422,
    'access_token_ausente',
    'Informe access_token no body, header X-CNIB-Access-Token ou Authorization Bearer.',
    { fontes: ['body.access_token', 'X-CNIB-Access-Token', 'Authorization: Bearer'] },
  );
}

const baseUrl = amb.baseUrl.replace(/\\/$/, '');
const documentosTiposUrl = baseUrl + '/api/documentos/tipos';

return [{
  json: {
    valid: true,
    documentosTiposUrl,
    accessToken,
    upstreamBody: {},
    meta: {
      ambiente: amb.key,
      baseUrl,
      endpoint: '/api/documentos/tipos',
      receivedAt: new Date().toISOString(),
      source: 'n8n-cnib-documentos-tipos',
    },
  },
}];
`,
    };

    @node({
        id: 'c1430006-0001-4000-8000-000000000003',
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
                    id: 'cond-cnib-documentos-tipos-valido',
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
        id: 'c1430006-0001-4000-8000-000000000004',
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
      sistema: 'CNIB',
      status_http: data.statusCode || 422,
    },
  },
}];
`,
    };

    @node({
        id: 'c1430006-0001-4000-8000-000000000005',
        name: 'Documentos Tipos CNIB',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [840, 180],
        onError: 'continueRegularOutput',
    })
    DocumentosTiposCnib = {
        method: 'POST',
        url: '={{ $json.documentosTiposUrl }}',
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
                    name: 'Content-Type',
                    value: 'application/json',
                },
                {
                    name: 'Authorization',
                    value: '=Bearer {{ $json.accessToken }}',
                },
            ],
        },
        sendBody: true,
        jsonBody: '={}',
        contentType: 'json',
        options: {},
    };

    @node({
        id: 'c1430006-0001-4000-8000-000000000006',
        name: 'Build Documentos Tipos Response',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1060, 180],
    })
    BuildDocumentosTiposResponse = {
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
  const rawMessage = errorObject?.message ?? 'Erro desconhecido ao consultar tipos de documento na API CNIB.';
  const status = Number(
    errorObject?.status
      ?? errorObject?.httpCode
      ?? rawMessage.match(/^\\s*(\\d{3})\\s*-/)?.[1]
      ?? 502,
  );
  const parsed = parseJsonSafe(errorObject?.response?.body)
    ?? parseJsonSafe(errorObject?.response?.data)
    ?? (typeof errorObject?.response?.body === 'object' ? errorObject.response.body : null);

  const notificacoes = parsed?.notifications ?? parsed?.notificacoes ?? null;

  return {
    statusCode: status === 401 ? 401 : (status || 502),
    response: {
      sucesso: false,
      codigo_erro: parsed?.codigo ?? parsed?.error ?? 'cnib_http_error',
      mensagem_erro: parsed?.message ?? parsed?.mensagem ?? parsed?.error_description ?? rawMessage,
      notificacoes,
      sistema: 'CNIB',
      status_http: status === 401 ? 401 : (status || 502),
      ambiente: meta.ambiente ?? null,
      meta,
      detalhe_tecnico: {
        name: errorObject?.name ?? null,
        code: errorObject?.code ?? null,
        status: status || null,
        endpoint: meta.endpoint ?? '/api/documentos/tipos',
      },
    },
  };
}

if (httpResult.error) {
  return [{ json: normalizeHttpError(httpResult.error) }];
}

const data = httpResult;
const upstreamStatus = Number(data.status ?? 200);
const statusCode = upstreamStatus >= 100 && upstreamStatus < 600 ? upstreamStatus : 200;
const sucesso = data.success === true || (data.success === undefined && statusCode >= 200 && statusCode < 300);

if (!sucesso) {
  return [{
    json: {
      statusCode: statusCode >= 400 ? statusCode : 400,
      response: {
        sucesso: false,
        codigo_erro: 'cnib_api_error',
        mensagem_erro: data.message ?? 'A API CNIB retornou success=false.',
        notificacoes: data.notifications ?? data.notificacoes ?? null,
        identificador_requisicao: data.identifierRequest ?? null,
        sistema: 'CNIB',
        status_http: statusCode >= 400 ? statusCode : 400,
        ambiente: meta.ambiente ?? null,
        meta,
        resposta_api: data,
      },
    },
  }];
}

return [{
  json: {
    statusCode,
    response: {
      sucesso: true,
      status_http: statusCode,
      mensagem: data.message ?? null,
      identificador_requisicao: data.identifierRequest ?? null,
      dados: data.data ?? null,
      notificacoes: data.notifications ?? data.notificacoes ?? null,
      ambiente: meta.ambiente ?? null,
      meta,
    },
  },
}];
`,
    };

    @node({
        id: 'c1430006-0001-4000-8000-000000000007',
        name: 'Return Documentos Tipos Response',
        type: 'n8n-nodes-base.respondToWebhook',
        version: 1.5,
        position: [1280, 300],
    })
    ReturnDocumentosTiposResponse = {
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
        this.ReceiveCnibDocumentosTipos.out(0).to(this.ValidarEntrada.in(0));
        this.ValidarEntrada.out(0).to(this.EntradaValida.in(0));
        this.EntradaValida.out(0).to(this.DocumentosTiposCnib.in(0));
        this.EntradaValida.out(1).to(this.RespostaErroEntrada.in(0));
        this.DocumentosTiposCnib.out(0).to(this.BuildDocumentosTiposResponse.in(0));
        this.BuildDocumentosTiposResponse.out(0).to(this.ReturnDocumentosTiposResponse.in(0));
        this.RespostaErroEntrada.out(0).to(this.ReturnDocumentosTiposResponse.in(0));
    }
}
