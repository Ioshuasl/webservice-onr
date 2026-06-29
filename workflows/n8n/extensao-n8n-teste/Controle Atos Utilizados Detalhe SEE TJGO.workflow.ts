import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : [AUTSEETJGO-23] (see tjgo) ControleAtosUtilizadosDetalhe - Atos Utilizados
// Nodes   : 7  |  Connections: 7
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// ReceiveSeeTjgoControleAtosUtilizadosDetalhe webhook                    [creds]
// ValidarEntrada                     code
// EntradaValida                      if
// RespostaErroEntrada                code
// ControleAtosUtilizadosDetalheSeeTjgo httpRequest                [onError→regular]
// BuildControleAtosUtilizadosDetalheResponse code
// ReturnControleAtosUtilizadosDetalheResponse respondToWebhook
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// ReceiveSeeTjgoControleAtosUtilizadosDetalhe
//    → ValidarEntrada
//      → EntradaValida
//        → ControleAtosUtilizadosDetalheSeeTjgo
//          → BuildControleAtosUtilizadosDetalheResponse
//            → ReturnControleAtosUtilizadosDetalheResponse
//       .out(1) → RespostaErroEntrada
//          → ReturnControleAtosUtilizadosDetalheResponse (↩ loop)
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'H4BNsBf6vM11Slmp',
    name: '[AUTSEETJGO-23] (see tjgo) ControleAtosUtilizadosDetalhe - Atos Utilizados',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class Autseetjgo23SeeTjgoControleatosutilizadosdetalheAtosUtilizadosWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'e1f20023-0001-4000-8000-000000000001',
        webhookId: 'e1f20023-0001-4000-8000-000000000011',
        name: 'Receive SEE TJGO Controle Atos Utilizados Detalhe',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 300],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    ReceiveSeeTjgoControleAtosUtilizadosDetalhe = {
        httpMethod: 'GET',
        path: 'see-tjgo/controle-atos-utilizados/:codigo_do_ato',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'e1f20023-0001-4000-8000-000000000002',
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
const params = item.json?.params ?? {};

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
    query.ambiente,
    body.ambiente,
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

function resolveAuthToken() {
  const seeHeader = pick(header('x-see-tjgo-auth-token'), header('X-SEE-TJGO-Auth-Token'));
  if (seeHeader) return seeHeader;
  const authHeader = pick(header('authorization'), header('Authorization'));
  const bearerMatch = authHeader.match(/^Bearer\\s+(.+)$/i);
  if (bearerMatch) return bearerMatch[1].trim();
  return pick(
    query.auth_token,
    query.authToken,
    query.token,
    body.auth_token,
    body.authToken,
    body.token,
  );
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

const authToken = resolveAuthToken();
if (!authToken) {
  return erro(
    422,
    'auth_token_ausente',
    'Informe auth_token na query, header X-SEE-TJGO-Auth-Token ou Authorization Bearer.',
    { fontes: ['query.auth_token', 'X-SEE-TJGO-Auth-Token', 'Authorization: Bearer'] },
  );
}

const codigoDoAto = pick(
  params.codigo_do_ato,
  params.codigoDoAto,
  query.codigo_do_ato,
  body.codigo_do_ato,
);

if (!codigoDoAto) {
  return erro(
    422,
    'codigo_do_ato_ausente',
    'Informe codigo_do_ato na URL (/see-tjgo/controle-atos-utilizados/{codigo_do_ato}).',
    { fontes: ['params.codigo_do_ato', 'query.codigo_do_ato'] },
  );
}

if (codigoDoAto.length !== 23) {
  return erro(
    422,
    'codigo_do_ato_invalido',
    'codigo_do_ato deve ter exatamente 23 caracteres.',
    { informado: codigoDoAto, tamanho: codigoDoAto.length, esperado: 23 },
  );
}

const baseUrl = amb.baseUrl.replace(/\\/$/, '');
const detalheUrl = baseUrl + '/controle_de_atos_utilizados/' + encodeURIComponent(codigoDoAto);

return [{
  json: {
    valid: true,
    detalheUrl,
    authToken,
    codigoDoAto,
    meta: {
      ambiente: amb.key,
      baseUrl,
      codigo_do_ato: codigoDoAto,
      endpoint: '/controle_de_atos_utilizados/{codigo_do_ato}',
      receivedAt: new Date().toISOString(),
      source: 'n8n-see-tjgo-controle-atos-utilizados-detalhe',
    },
    errorDefaultMsg: 'Erro ao consultar detalhe do ato utilizado na API SEE TJGO.',
  },
}];
`,
    };

    @node({
        id: 'e1f20023-0001-4000-8000-000000000003',
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
                    id: 'cond-see-controle-atos-utilizados-detalhe-valido',
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
        id: 'e1f20023-0001-4000-8000-000000000004',
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
        id: 'e1f20023-0001-4000-8000-000000000005',
        name: 'Controle Atos Utilizados Detalhe SEE TJGO',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [840, 180],
        onError: 'continueRegularOutput',
    })
    ControleAtosUtilizadosDetalheSeeTjgo = {
        method: 'GET',
        url: '={{ $json.detalheUrl }}',
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
                    value: '=Bearer {{ $json.authToken }}',
                },
            ],
        },
        options: {},
    };

    @node({
        id: 'e1f20023-0001-4000-8000-000000000006',
        name: 'Build Controle Atos Utilizados Detalhe Response',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1060, 180],
    })
    BuildControleAtosUtilizadosDetalheResponse = {
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

function formatMensagens(parsed) {
  if (Array.isArray(parsed)) {
    return parsed.map((entry) => entry?.message ?? entry?.mensagem ?? String(entry)).join('; ');
  }
  if (parsed && typeof parsed === 'object') {
    return parsed.message ?? parsed.mensagem ?? parsed.error ?? null;
  }
  return null;
}

function normalizeHttpError(errorObject, defaultMsg) {
  const rawMessage = errorObject?.message ?? defaultMsg;
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
      codigo_erro: status === 404 ? 'ato_nao_encontrado' : 'see_http_error',
      mensagem_erro: formatMensagens(parsed) ?? rawMessage,
      erros: Array.isArray(parsed) ? parsed : null,
      sistema: 'SEE TJGO',
      status_http: statusCode,
      ambiente: meta.ambiente ?? null,
      meta,
      detalhe_tecnico: {
        name: errorObject?.name ?? null,
        code: errorObject?.code ?? null,
        status: status || null,
        endpoint: meta.endpoint ?? '/controle_de_atos_utilizados/{codigo_do_ato}',
      },
      resposta_api: parsed,
    },
  };
}

function isAtoUtilizado(data) {
  return data
    && typeof data === 'object'
    && !Array.isArray(data)
    && data.codigo_ato !== undefined;
}

function extractAtoUtilizado(data) {
  if (isAtoUtilizado(data)) return data;
  const parsed = parseJsonSafe(data?.body);
  if (isAtoUtilizado(parsed)) return parsed;
  if (isAtoUtilizado(data?.body)) return data.body;
  return null;
}

if (httpResult.error) {
  return [{ json: normalizeHttpError(httpResult.error, entrada.errorDefaultMsg ?? 'Erro na API SEE TJGO.') }];
}

const statusCode = Number(httpResult?.statusCode ?? httpResult?.status ?? 200);
if (statusCode >= 400) {
  const parsed = parseJsonSafe(httpResult?.body) ?? (typeof httpResult?.body === 'object' ? httpResult.body : httpResult);
  return [{
    json: {
      statusCode: statusCode >= 100 && statusCode < 600 ? statusCode : 502,
      response: {
        sucesso: false,
        codigo_erro: statusCode === 404 ? 'ato_nao_encontrado' : 'see_api_error',
        mensagem_erro: formatMensagens(parsed) ?? 'A API SEE TJGO rejeitou a consulta do ato utilizado.',
        erros: Array.isArray(parsed) ? parsed : null,
        sistema: 'SEE TJGO',
        status_http: statusCode,
        ambiente: meta.ambiente ?? null,
        meta,
        resposta_api: parsed,
      },
    },
  }];
}

const ato = extractAtoUtilizado(httpResult);
if (ato === null) {
  return [{
    json: {
      statusCode: 502,
      response: {
        sucesso: false,
        codigo_erro: 'resposta_inesperada',
        mensagem_erro: 'Resposta da API SEE TJGO em formato nao reconhecido (esperado AtoUtilizado).',
        sistema: 'SEE TJGO',
        status_http: 502,
        ambiente: meta.ambiente ?? null,
        meta,
        resposta_api: httpResult,
      },
    },
  }];
}

return [{
  json: {
    statusCode: 200,
    response: {
      sucesso: true,
      status_http: 200,
      codigo_do_ato: ato.codigo_ato ?? entrada.codigoDoAto ?? null,
      protocolo_pedido: ato.protocolo_pedido ?? null,
      tipo_ato_id: ato.tipo_ato_id ?? null,
      inutilizado: ato.inutilizado ?? null,
      vinculados: Array.isArray(ato.vinculados) ? ato.vinculados : [],
      controle_ato_utilizado: ato,
      ambiente: meta.ambiente ?? null,
      meta,
    },
  },
}];
`,
    };

    @node({
        id: 'e1f20023-0001-4000-8000-000000000007',
        name: 'Return Controle Atos Utilizados Detalhe Response',
        type: 'n8n-nodes-base.respondToWebhook',
        version: 1.5,
        position: [1280, 300],
    })
    ReturnControleAtosUtilizadosDetalheResponse = {
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
        this.ReceiveSeeTjgoControleAtosUtilizadosDetalhe.out(0).to(this.ValidarEntrada.in(0));
        this.ValidarEntrada.out(0).to(this.EntradaValida.in(0));
        this.EntradaValida.out(0).to(this.ControleAtosUtilizadosDetalheSeeTjgo.in(0));
        this.EntradaValida.out(1).to(this.RespostaErroEntrada.in(0));
        this.ControleAtosUtilizadosDetalheSeeTjgo.out(0).to(this.BuildControleAtosUtilizadosDetalheResponse.in(0));
        this.BuildControleAtosUtilizadosDetalheResponse.out(0).to(
            this.ReturnControleAtosUtilizadosDetalheResponse.in(0)
        );
        this.RespostaErroEntrada.out(0).to(this.ReturnControleAtosUtilizadosDetalheResponse.in(0));
    }
}
