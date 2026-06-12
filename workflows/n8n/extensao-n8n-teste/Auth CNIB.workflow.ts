import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : [AUTCNIB-1] (cnib) AuthToken - CNIB
// Nodes   : 7  |  Connections: 7
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// ReceiveCnibAuth                    webhook                    [creds]
// ValidarEntrada                     code
// EntradaValida                      if
// RespostaErroEntrada                code
// AuthTokenCnib                      httpRequest                [onError→regular]
// BuildAuthResponse                  code
// ReturnAuthResponse                 respondToWebhook
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// ReceiveCnibAuth
//    → ValidarEntrada
//      → EntradaValida
//        → AuthTokenCnib
//          → BuildAuthResponse
//            → ReturnAuthResponse
//       .out(1) → RespostaErroEntrada
//          → ReturnAuthResponse (↩ loop)
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'HZmL8lfjeauwkDzN',
    name: '[AUTCNIB-1] (cnib) AuthToken - CNIB',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class Autcnib1CnibAuthtokenCnibWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'c1430001-0001-4000-8000-000000000001',
        webhookId: 'c1430001-0001-4000-8000-000000000011',
        name: 'Receive CNIB Auth',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 300],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    ReceiveCnibAuth = {
        httpMethod: 'POST',
        path: 'cnib/auth/token',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'c1430001-0001-4000-8000-000000000002',
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

const clientId = pick(body.client_id, body.clientId, $env.CNIB_API_CLIENT_ID);
const clientSecret = pick(body.client_secret, body.clientSecret, $env.CNIB_API_CLIENT_SECRET);
const grantType = pick(body.grant_type, body.grantType, 'client_credentials');
const scope = pick(body.scope, $env.CNIB_AUTH_SCOPE, 'cnib-serventia-api');
const tokenUrl = pick($env.CNIB_AUTH_TOKEN_URL, 'https://auth.id.onr.org.br/connect/token');

if (!clientId) {
  return erro(422, 'client_id_ausente', 'Informe client_id no body ou configure CNIB_API_CLIENT_ID no n8n.');
}
if (!clientSecret) {
  return erro(422, 'client_secret_ausente', 'Informe client_secret no body ou configure CNIB_API_CLIENT_SECRET no n8n.');
}
if (grantType !== 'client_credentials') {
  return erro(422, 'grant_type_invalido', 'grant_type deve ser client_credentials.', { grantType });
}
if (!scope) {
  return erro(422, 'scope_ausente', 'Informe scope no body ou configure CNIB_AUTH_SCOPE no n8n.');
}

const baseUrl = amb.baseUrl.replace(/\\/$/, '');

return [{
  json: {
    valid: true,
    tokenUrl,
    formBody: {
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: grantType,
      scope,
    },
    meta: {
      ambiente: amb.key,
      baseUrl,
      authTokenUrl: tokenUrl,
      scope,
      grantType,
      clientIdPrefix: clientId.slice(0, 8) + '…',
      receivedAt: new Date().toISOString(),
      source: 'n8n-cnib-auth-token',
    },
  },
}];
`,
    };

    @node({
        id: 'c1430001-0001-4000-8000-000000000003',
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
                    id: 'cond-cnib-auth-valido',
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
        id: 'c1430001-0001-4000-8000-000000000004',
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
        id: 'c1430001-0001-4000-8000-000000000005',
        name: 'Auth Token CNIB',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [840, 180],
        onError: 'continueRegularOutput',
    })
    AuthTokenCnib = {
        method: 'POST',
        url: '={{ $json.tokenUrl }}',
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
        sendBody: true,
        contentType: 'form-urlencoded',
        specifyBody: 'keypair',
        bodyParameters: {
            parameters: [
                {
                    name: 'client_id',
                    value: '={{ $json.formBody.client_id }}',
                },
                {
                    name: 'client_secret',
                    value: '={{ $json.formBody.client_secret }}',
                },
                {
                    name: 'grant_type',
                    value: '={{ $json.formBody.grant_type }}',
                },
                {
                    name: 'scope',
                    value: '={{ $json.formBody.scope }}',
                },
            ],
        },
        options: {},
    };

    @node({
        id: 'c1430001-0001-4000-8000-000000000006',
        name: 'Build Auth Response',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1060, 180],
    })
    BuildAuthResponse = {
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

function decodeJwtPayload(token) {
  try {
    const part = String(token).split('.')[1];
    if (!part) return null;
    const pad = (4 - (part.length % 4)) % 4;
    const b64 = part.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat(pad);
    return JSON.parse(Buffer.from(b64, 'base64').toString('utf8'));
  } catch {
    return null;
  }
}

function normalizeHttpError(errorObject) {
  const rawMessage = errorObject?.message ?? 'Erro desconhecido ao autenticar na API CNIB.';
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
    response: {
      sucesso: false,
      codigo_erro: parsed?.error ?? parsed?.codigo ?? 'cnib_http_error',
      mensagem_erro: parsed?.error_description ?? parsed?.descricao ?? parsed?.mensagem ?? rawMessage,
      sistema: 'CNIB',
      status_http: status || 502,
      meta,
      detalhe_tecnico: {
        name: errorObject?.name ?? null,
        code: errorObject?.code ?? null,
        status: status || null,
      },
    },
  };
}

if (httpResult.error) {
  return [{ json: normalizeHttpError(httpResult.error) }];
}

const data = httpResult;
if (!data.access_token) {
  return [{
    json: {
      statusCode: 502,
      response: {
        sucesso: false,
        codigo_erro: 'token_ausente',
        mensagem_erro: 'O servidor de autenticacao CNIB respondeu sem access_token.',
        sistema: 'CNIB',
        status_http: 502,
        meta,
        resposta_api: data,
      },
    },
  }];
}

const claims = decodeJwtPayload(data.access_token);

return [{
  json: {
    statusCode: 201,
    response: {
      sucesso: true,
      status_http: 201,
      access_token: data.access_token,
      expires_in: data.expires_in ?? 3600,
      token_type: data.token_type ?? 'Bearer',
      scope: data.scope ?? meta.scope ?? null,
      ambiente: meta.ambiente ?? null,
      token_valido: true,
      claims: claims ?? null,
      meta,
    },
  },
}];
`,
    };

    @node({
        id: 'c1430001-0001-4000-8000-000000000007',
        name: 'Return Auth Response',
        type: 'n8n-nodes-base.respondToWebhook',
        version: 1.5,
        position: [1280, 300],
    })
    ReturnAuthResponse = {
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
        this.ReceiveCnibAuth.out(0).to(this.ValidarEntrada.in(0));
        this.ValidarEntrada.out(0).to(this.EntradaValida.in(0));
        this.EntradaValida.out(0).to(this.AuthTokenCnib.in(0));
        this.EntradaValida.out(1).to(this.RespostaErroEntrada.in(0));
        this.AuthTokenCnib.out(0).to(this.BuildAuthResponse.in(0));
        this.BuildAuthResponse.out(0).to(this.ReturnAuthResponse.in(0));
        this.RespostaErroEntrada.out(0).to(this.ReturnAuthResponse.in(0));
    }
}
