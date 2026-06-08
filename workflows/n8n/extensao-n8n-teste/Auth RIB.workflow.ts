import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : [AUTONR-91] (integração) AuthToken - RIB
// Nodes   : 10  |  Connections: 11
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// ReceiveRibAuth                     webhook                    [creds]
// ValidarEntrada                     code
// EntradaValida                      if
// RespostaErroEntrada                code
// AuthTokenRib                       httpRequest                [onError→regular]
// ParseTokenResponse                 code
// TokenObtido                        if
// ValidarTokenRib                    httpRequest                [onError→regular]
// BuildAuthResponse                  code
// ReturnAuthResponse                 respondToWebhook
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// ReceiveRibAuth
//    → ValidarEntrada
//      → EntradaValida
//        → AuthTokenRib
//          → ParseTokenResponse
//            → TokenObtido
//              → ValidarTokenRib
//                → BuildAuthResponse
//                  → ReturnAuthResponse
//             .out(1) → ReturnAuthResponse (↩ loop)
//       .out(1) → RespostaErroEntrada
//          → ReturnAuthResponse (↩ loop)
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'Idas4wAPEfIA17xq',
    name: '[AUTONR-91] (integração) AuthToken - RIB',
    active: true,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class Autonr91IntegracaoAuthtokenRibWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'b1c2d3e4-f5a6-4789-b0c1-d2e3f4a5b6c7',
        webhookId: 'c2d3e4f5-a6b7-4890-c1d2-e3f4a5b6c7d8',
        name: 'Receive RIB Auth',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 300],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    ReceiveRibAuth = {
        httpMethod: 'POST',
        path: 'rib/auth/token',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'd3e4f5a6-b7c8-4901-d2e3-f4a5b6c7d8e9',
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

const AMBIENTES_RIB = {
  producao: {
    key: 'producao',
    baseUrl: () => pick($env.RIB_API_BASE_URL, 'https://api.registrodeimoveis.org.br'),
  },
  homologacao: {
    key: 'homologacao',
    baseUrl: () => pick($env.RIB_API_BASE_URL_HML, 'https://testes-api.registrodeimoveis.org.br'),
  },
};

const AMBIENTE_ALIASES = {
  producao: 'producao',
  prod: 'producao',
  production: 'producao',
  homologacao: 'homologacao',
  homolog: 'homologacao',
  hml: 'homologacao',
  testes: 'homologacao',
};

function resolveAmbiente() {
  const raw = pick(
    body.ambiente,
    query.ambiente,
    header('x-ambiente'),
    $env.RIB_API_AMBIENTE,
    'producao',
  ).toLowerCase();
  const key = AMBIENTE_ALIASES[raw];
  if (!key) {
    return { invalid: true, informado: raw };
  }
  const cfg = AMBIENTES_RIB[key];
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
    sistema: 'RIB',
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

const clientId = pick(body.client_id, body.clientId, $env.RIB_API_CLIENT_ID);
const clientSecret = pick(body.client_secret, body.clientSecret, $env.RIB_API_CLIENT_SECRET);
const grantType = pick(body.grant_type, body.grantType, $env.RIB_API_GRANT_TYPE, 'client_credentials');
const username = pick(body.username, $env.RIB_API_USERNAME);
const password = pick(body.password, $env.RIB_API_PASSWORD);

if (!clientId) {
  return erro(422, 'client_id_ausente', 'Informe client_id no body ou configure RIB_API_CLIENT_ID no n8n.');
}
if (!clientSecret) {
  return erro(422, 'client_secret_ausente', 'Informe client_secret no body ou configure RIB_API_CLIENT_SECRET no n8n.');
}
if (!['client_credentials', 'password'].includes(grantType)) {
  return erro(422, 'grant_type_invalido', 'grant_type deve ser client_credentials ou password.', { grantType });
}
if (grantType === 'password' && (!username || !password)) {
  return erro(422, 'credenciais_password_ausentes', 'grant_type password exige username e password.');
}

const baseUrl = amb.baseUrl.replace(/\\/$/, '');
const tokenUrl = baseUrl + '/v1/auth/token';
const validacaoUrl = baseUrl + '/v1/auth/validacao';
const formBody = {
  client_id: clientId,
  client_secret: clientSecret,
  grant_type: grantType,
};
if (grantType === 'password') {
  formBody.username = username;
  formBody.password = password;
}

return [{
  json: {
    valid: true,
    tokenUrl,
    validacaoUrl,
    formBody,
    meta: {
      ambiente: amb.key,
      baseUrl,
      validacaoUrl,
      grantType,
      clientIdPrefix: clientId.slice(0, 8) + '…',
      receivedAt: new Date().toISOString(),
      source: 'n8n-rib-auth-token',
    },
  },
}];
`,
    };

    @node({
        id: 'e4f5a6b7-c8d9-4012-e3f4-a5b6c7d8e9f0',
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
                    id: 'cond-rib-auth-valido',
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
        id: 'f5a6b7c8-d9e0-4123-f4a5-b6c7d8e9f0a1',
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
      sistema: 'RIB',
    },
  },
}];
`,
    };

    @node({
        id: 'a6b7c8d9-e0f1-4234-a5b6-c7d8e9f0a1b2',
        name: 'Auth Token RIB',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [840, 180],
        onError: 'continueRegularOutput',
    })
    AuthTokenRib = {
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
                    name: 'username',
                    value: '={{ $json.formBody.username }}',
                },
                {
                    name: 'password',
                    value: '={{ $json.formBody.password }}',
                },
            ],
        },
        options: {},
    };

    @node({
        id: 'b7c8d9e0-f1a2-4345-b6c7-d8e9f0a1b2c3',
        name: 'Parse Token Response',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1060, 180],
    })
    ParseTokenResponse = {
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
  const rawMessage = errorObject?.message ?? 'Erro desconhecido ao autenticar na API RIB.';
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
      codigo_erro: parsed?.codigo ?? 'rib_http_error',
      mensagem_erro: parsed?.descricao ?? parsed?.mensagem ?? rawMessage,
      campos: parsed?.campos ?? null,
      sistema: 'RIB',
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
        mensagem_erro: 'A API RIB respondeu sem access_token.',
        sistema: 'RIB',
        meta,
        resposta_api: data,
      },
    },
  }];
}

const claims = decodeJwtPayload(data.access_token);
const validacaoUrl = entrada.validacaoUrl
  ?? meta.validacaoUrl
  ?? String(meta.baseUrl ?? '').replace(/\\/$/, '') + '/v1/auth/validacao';

return [{
  json: {
    tokenOk: true,
    access_token: data.access_token,
    tokenData: data,
    claims,
    validacaoUrl,
    meta,
  },
}];
`,
    };

    @node({
        id: 'c1d2e3f4-a5b6-4789-c0d1-e2f3a4b5c6d7',
        name: 'Token obtido?',
        type: 'n8n-nodes-base.if',
        version: 2.2,
        position: [1280, 180],
    })
    TokenObtido = {
        conditions: {
            options: {
                caseSensitive: true,
                leftValue: '',
                typeValidation: 'strict',
                version: 2,
            },
            conditions: [
                {
                    id: 'cond-rib-token-ok',
                    leftValue: '={{ $json.tokenOk }}',
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
        id: 'd2e3f4a5-b6c7-4890-d1e2-f3a4b5c6d7e8',
        name: 'Validar Token RIB',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [1500, 100],
        onError: 'continueRegularOutput',
    })
    ValidarTokenRib = {
        method: 'GET',
        url: '={{ $json.validacaoUrl }}',
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
                    value: '=Bearer {{ $json.access_token }}',
                },
            ],
        },
        options: {},
    };

    @node({
        id: 'e3f4a5b6-c7d8-4901-e2f3-a4b5c6d7e8f9',
        name: 'Build Auth Response',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1720, 100],
    })
    BuildAuthResponse = {
        mode: 'runOnceForAllItems',
        language: 'javaScript',
        jsCode: `
const validacaoHttp = items[0].json;
const tokenCtx = $('Parse Token Response').first().json;
const meta = tokenCtx.meta ?? {};
const data = tokenCtx.tokenData ?? {};
const claims = tokenCtx.claims ?? {};

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

function normalizeValidacao(result) {
  if (result?.error) {
    const err = result.error;
    const status = Number(
      err.status
        ?? err.httpCode
        ?? String(err.message ?? '').match(/^\\s*(\\d{3})\\s*-/)?.[1]
        ?? 502,
    );
    const body = parseJsonSafe(err.response?.body)
      ?? parseJsonSafe(err.response?.data)
      ?? (typeof err.response?.body === 'object' ? err.response.body : null);
    return {
      sucesso: false,
      status_http: status || 502,
      endpoint: tokenCtx.validacaoUrl,
      codigo: body?.codigo ?? null,
      descricao: body?.descricao ?? err.message ?? null,
      campos: body?.campos ?? null,
    };
  }

  const status = Number(result?.statusCode ?? result?.status ?? 200);
  const body = result?.body ?? result?.data ?? null;
  return {
    sucesso: status === 200,
    status_http: status,
    endpoint: tokenCtx.validacaoUrl,
    corpo: body,
  };
}

const validacao = normalizeValidacao(validacaoHttp);

if (!validacao.sucesso) {
  return [{
    json: {
      statusCode: validacao.status_http === 401 ? 401 : 502,
      response: {
        sucesso: false,
        codigo_erro: 'token_nao_validado',
        mensagem_erro: 'Token gerado, mas rejeitado em GET /v1/auth/validacao.',
        sistema: 'RIB',
        access_token: tokenCtx.access_token,
        token_valido: false,
        validacao,
        ambiente: meta.ambiente ?? null,
        meta,
      },
    },
  }];
}

return [{
  json: {
    statusCode: 201,
    response: {
      sucesso: true,
      access_token: data.access_token,
      expires_in: data.expires_in ?? null,
      token_type: data.token_type ?? 'Bearer',
      cns: claims?.cns ?? null,
      tipo_cliente: claims?.tipoCliente ?? null,
      escopos: claims?.scope ? String(claims.scope).split(',') : [],
      ambiente: meta.ambiente ?? null,
      token_valido: true,
      validacao,
      meta,
    },
  },
}];
`,
    };

    @node({
        id: 'c8d9e0f1-a2b3-4456-c7d8-e9f0a1b2c3d4',
        name: 'Return Auth Response',
        type: 'n8n-nodes-base.respondToWebhook',
        version: 1.5,
        position: [1940, 300],
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
        this.ReceiveRibAuth.out(0).to(this.ValidarEntrada.in(0));
        this.ValidarEntrada.out(0).to(this.EntradaValida.in(0));
        this.EntradaValida.out(0).to(this.AuthTokenRib.in(0));
        this.EntradaValida.out(1).to(this.RespostaErroEntrada.in(0));
        this.AuthTokenRib.out(0).to(this.ParseTokenResponse.in(0));
        this.ParseTokenResponse.out(0).to(this.TokenObtido.in(0));
        this.TokenObtido.out(0).to(this.ValidarTokenRib.in(0));
        this.TokenObtido.out(1).to(this.ReturnAuthResponse.in(0));
        this.ValidarTokenRib.out(0).to(this.BuildAuthResponse.in(0));
        this.BuildAuthResponse.out(0).to(this.ReturnAuthResponse.in(0));
        this.RespostaErroEntrada.out(0).to(this.ReturnAuthResponse.in(0));
    }
}
