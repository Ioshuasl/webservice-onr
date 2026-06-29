import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : [AUTSEETJGO-1] (see tjgo) Sessions - Autenticação
// Nodes   : 7  |  Connections: 7
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// ReceiveSeeTjgoSessions             webhook                    [creds]
// ValidarEntrada                     code
// EntradaValida                      if
// RespostaErroEntrada                code
// SessionsSeeTjgo                    httpRequest                [onError→regular]
// BuildSessionsResponse              code
// ReturnSessionsResponse             respondToWebhook
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// ReceiveSeeTjgoSessions
//    → ValidarEntrada
//      → EntradaValida
//        → SessionsSeeTjgo
//          → BuildSessionsResponse
//            → ReturnSessionsResponse
//       .out(1) → RespostaErroEntrada
//          → ReturnSessionsResponse (↩ loop)
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'r18lsI3VHRYY33OF',
    name: '[AUTSEETJGO-1] (see tjgo) Sessions - Autenticação',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class Autseetjgo1SeeTjgoSessionsAutenticacaoWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'e1f20001-0001-4000-8000-000000000001',
        webhookId: 'e1f20001-0001-4000-8000-000000000011',
        name: 'Receive SEE TJGO Sessions',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 300],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    ReceiveSeeTjgoSessions = {
        httpMethod: 'POST',
        path: 'see-tjgo/sessions',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'e1f20001-0001-4000-8000-000000000002',
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
    body.ambiente,
    query.ambiente,
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

const email = pick(body.email, $env.SEE_TJGO_EMAIL);
const password = pick(body.password, $env.SEE_TJGO_PASSWORD);
const hashCartorio = pick(body.hash_cartorio, body.hashCartorio, $env.SEE_TJGO_HASH_CARTORIO);

if (!email) {
  return erro(422, 'email_ausente', 'Informe email no body ou configure SEE_TJGO_EMAIL no n8n.');
}
if (!password) {
  return erro(422, 'password_ausente', 'Informe password no body ou configure SEE_TJGO_PASSWORD no n8n.');
}
if (!hashCartorio) {
  return erro(422, 'hash_cartorio_ausente', 'Informe hash_cartorio no body ou configure SEE_TJGO_HASH_CARTORIO no n8n.');
}

const baseUrl = amb.baseUrl.replace(/\\/$/, '');
const sessionsUrl = baseUrl + '/sessions';

return [{
  json: {
    valid: true,
    sessionsUrl,
    formBody: {
      email,
      password,
      hash_cartorio: hashCartorio,
    },
    meta: {
      ambiente: amb.key,
      baseUrl,
      sessionsUrl,
      emailPrefix: email.split('@')[0].slice(0, 3) + '…',
      receivedAt: new Date().toISOString(),
      source: 'n8n-see-tjgo-sessions',
    },
  },
}];
`,
    };

    @node({
        id: 'e1f20001-0001-4000-8000-000000000003',
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
                    id: 'cond-see-sessions-valido',
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
        id: 'e1f20001-0001-4000-8000-000000000004',
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
        id: 'e1f20001-0001-4000-8000-000000000005',
        name: 'Sessions SEE TJGO',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [840, 180],
        onError: 'continueRegularOutput',
    })
    SessionsSeeTjgo = {
        method: 'POST',
        url: '={{ $json.sessionsUrl }}',
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
                    name: 'email',
                    value: '={{ $json.formBody.email }}',
                },
                {
                    name: 'password',
                    value: '={{ $json.formBody.password }}',
                },
                {
                    name: 'hash_cartorio',
                    value: '={{ $json.formBody.hash_cartorio }}',
                },
            ],
        },
        options: {},
    };

    @node({
        id: 'e1f20001-0001-4000-8000-000000000006',
        name: 'Build Sessions Response',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1060, 180],
    })
    BuildSessionsResponse = {
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
  const rawMessage = errorObject?.message ?? 'Erro desconhecido ao autenticar na API SEE TJGO.';
  const status = Number(
    errorObject?.status
      ?? errorObject?.httpCode
      ?? rawMessage.match(/^\\s*(\\d{3})\\s*-/)?.[1]
      ?? 502,
  );
  const parsed = parseJsonSafe(errorObject?.response?.body)
    ?? parseJsonSafe(errorObject?.response?.data)
    ?? (typeof errorObject?.response?.body === 'object' ? errorObject.response.body : null);

  const mensagem = Array.isArray(parsed)
    ? parsed.join('; ')
    : (parsed?.message ?? parsed?.mensagem ?? parsed?.error ?? rawMessage);

  return {
    statusCode: status === 401 ? 401 : (status === 406 ? 406 : (status || 502)),
    response: {
      sucesso: false,
      codigo_erro: 'see_http_error',
      mensagem_erro: mensagem,
      sistema: 'SEE TJGO',
      status_http: status || 502,
      ambiente: meta.ambiente ?? null,
      meta,
      detalhe_tecnico: {
        name: errorObject?.name ?? null,
        code: errorObject?.code ?? null,
        status: status || null,
        endpoint: '/sessions',
      },
      resposta_api: parsed,
    },
  };
}

if (httpResult.error) {
  return [{ json: normalizeHttpError(httpResult.error) }];
}

const data = httpResult;
const authToken = data.auth_token ?? data.authToken;

if (!authToken) {
  return [{
    json: {
      statusCode: 502,
      response: {
        sucesso: false,
        codigo_erro: 'auth_token_ausente',
        mensagem_erro: 'A API SEE TJGO respondeu sem auth_token.',
        sistema: 'SEE TJGO',
        status_http: 502,
        ambiente: meta.ambiente ?? null,
        meta,
        resposta_api: data,
      },
    },
  }];
}

const claims = decodeJwtPayload(authToken);

return [{
  json: {
    statusCode: 201,
    response: {
      sucesso: true,
      status_http: 201,
      auth_token: authToken,
      expire_at: data.expire_at ?? data.expireAt ?? null,
      message: data.message ?? "Header: 'Authorization: Bearer <auth_token>'",
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
        id: 'e1f20001-0001-4000-8000-000000000007',
        name: 'Return Sessions Response',
        type: 'n8n-nodes-base.respondToWebhook',
        version: 1.5,
        position: [1280, 300],
    })
    ReturnSessionsResponse = {
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
        this.ReceiveSeeTjgoSessions.out(0).to(this.ValidarEntrada.in(0));
        this.ValidarEntrada.out(0).to(this.EntradaValida.in(0));
        this.EntradaValida.out(0).to(this.SessionsSeeTjgo.in(0));
        this.EntradaValida.out(1).to(this.RespostaErroEntrada.in(0));
        this.SessionsSeeTjgo.out(0).to(this.BuildSessionsResponse.in(0));
        this.BuildSessionsResponse.out(0).to(this.ReturnSessionsResponse.in(0));
        this.RespostaErroEntrada.out(0).to(this.ReturnSessionsResponse.in(0));
    }
}
