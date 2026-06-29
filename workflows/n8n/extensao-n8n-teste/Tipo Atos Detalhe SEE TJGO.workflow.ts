import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : [AUTSEETJGO-17] (see tjgo) TipoAtosDetalhe - Tipo Ato
// Nodes   : 7  |  Connections: 7
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// ReceiveSeeTjgoTipoAtosDetalhe      webhook                    [creds]
// ValidarEntrada                     code
// EntradaValida                      if
// RespostaErroEntrada                code
// TipoAtosDetalheSeeTjgo             httpRequest                [onError→regular]
// BuildTipoAtosDetalheResponse       code
// ReturnTipoAtosDetalheResponse      respondToWebhook
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// ReceiveSeeTjgoTipoAtosDetalhe
//    → ValidarEntrada
//      → EntradaValida
//        → TipoAtosDetalheSeeTjgo
//          → BuildTipoAtosDetalheResponse
//            → ReturnTipoAtosDetalheResponse
//       .out(1) → RespostaErroEntrada
//          → ReturnTipoAtosDetalheResponse (↩ loop)
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: '00sQ7uwp1qDomNfD',
    name: '[AUTSEETJGO-17] (see tjgo) TipoAtosDetalhe - Tipo Ato',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class Autseetjgo17SeeTjgoTipoatosdetalheTipoAtoWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'e1f20017-0001-4000-8000-000000000001',
        webhookId: 'e1f20017-0001-4000-8000-000000000011',
        name: 'Receive SEE TJGO Tipo Atos Detalhe',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 300],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    ReceiveSeeTjgoTipoAtosDetalhe = {
        httpMethod: 'GET',
        path: 'see-tjgo/tipo-atos/:id',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'e1f20017-0001-4000-8000-000000000002',
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

const tipoAtoId = pick(
  params.id,
  params.ID,
  query.id,
  body.id,
  query.tipo_ato_id,
  body.tipo_ato_id,
);

if (!tipoAtoId) {
  return erro(
    422,
    'id_ausente',
    'Informe o ID do tipo de ato na URL (/see-tjgo/tipo-atos/{id}).',
    { fontes: ['params.id', 'query.id'] },
  );
}

if (!/^\\d+$/.test(tipoAtoId)) {
  return erro(
    422,
    'id_invalido',
    'O ID do tipo de ato deve ser um numero inteiro positivo.',
    { informado: tipoAtoId },
  );
}

const baseUrl = amb.baseUrl.replace(/\\/$/, '');
const tipoAtoUrl = baseUrl + '/tipo_atos/' + encodeURIComponent(tipoAtoId);

return [{
  json: {
    valid: true,
    tipoAtoUrl,
    authToken,
    tipoAtoId,
    meta: {
      ambiente: amb.key,
      baseUrl,
      tipoAtoId: Number(tipoAtoId),
      endpoint: '/tipo_atos/{id}',
      receivedAt: new Date().toISOString(),
      source: 'n8n-see-tjgo-tipo-atos-detalhe',
    },
    errorDefaultMsg: 'Erro ao consultar tipo de ato na API SEE TJGO.',
  },
}];
`,
    };

    @node({
        id: 'e1f20017-0001-4000-8000-000000000003',
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
                    id: 'cond-see-tipo-atos-detalhe-valido',
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
        id: 'e1f20017-0001-4000-8000-000000000004',
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
        id: 'e1f20017-0001-4000-8000-000000000005',
        name: 'Tipo Atos Detalhe SEE TJGO',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [840, 180],
        onError: 'continueRegularOutput',
    })
    TipoAtosDetalheSeeTjgo = {
        method: 'GET',
        url: '={{ $json.tipoAtoUrl }}',
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
        id: 'e1f20017-0001-4000-8000-000000000006',
        name: 'Build Tipo Atos Detalhe Response',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1060, 180],
    })
    BuildTipoAtosDetalheResponse = {
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
      codigo_erro: status === 404 ? 'tipo_ato_nao_encontrado' : 'see_http_error',
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
        endpoint: meta.endpoint ?? '/tipo_atos/{id}',
      },
      resposta_api: parsed,
    },
  };
}

function isTipoAto(data) {
  return data
    && typeof data === 'object'
    && !Array.isArray(data)
    && (data.id !== undefined || data.codigo !== undefined || data.nome !== undefined);
}

function extractTipoAto(data) {
  if (isTipoAto(data)) return data;
  const parsed = parseJsonSafe(data?.body);
  if (isTipoAto(parsed)) return parsed;
  if (isTipoAto(data?.body)) return data.body;
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
        codigo_erro: statusCode === 404 ? 'tipo_ato_nao_encontrado' : 'see_api_error',
        mensagem_erro: formatMensagens(parsed) ?? 'A API SEE TJGO rejeitou a consulta do tipo de ato.',
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

const tipoAto = extractTipoAto(httpResult);
if (tipoAto === null) {
  return [{
    json: {
      statusCode: 502,
      response: {
        sucesso: false,
        codigo_erro: 'resposta_inesperada',
        mensagem_erro: 'Resposta da API SEE TJGO em formato nao reconhecido (esperado objeto TipoAto).',
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
      tipo_ato_id: tipoAto.id ?? Number(entrada.tipoAtoId) ?? null,
      tipo_ato: tipoAto,
      ambiente: meta.ambiente ?? null,
      meta,
    },
  },
}];
`,
    };

    @node({
        id: 'e1f20017-0001-4000-8000-000000000007',
        name: 'Return Tipo Atos Detalhe Response',
        type: 'n8n-nodes-base.respondToWebhook',
        version: 1.5,
        position: [1280, 300],
    })
    ReturnTipoAtosDetalheResponse = {
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
        this.ReceiveSeeTjgoTipoAtosDetalhe.out(0).to(this.ValidarEntrada.in(0));
        this.ValidarEntrada.out(0).to(this.EntradaValida.in(0));
        this.EntradaValida.out(0).to(this.TipoAtosDetalheSeeTjgo.in(0));
        this.EntradaValida.out(1).to(this.RespostaErroEntrada.in(0));
        this.TipoAtosDetalheSeeTjgo.out(0).to(this.BuildTipoAtosDetalheResponse.in(0));
        this.BuildTipoAtosDetalheResponse.out(0).to(this.ReturnTipoAtosDetalheResponse.in(0));
        this.RespostaErroEntrada.out(0).to(this.ReturnTipoAtosDetalheResponse.in(0));
    }
}
