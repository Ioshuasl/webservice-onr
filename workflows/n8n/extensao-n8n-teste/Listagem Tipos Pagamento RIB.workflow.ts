import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : [AUTONR-120] (integração) ListagemTiposPagamento - RIB
// Nodes   : 7  |  Connections: 7
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// ReceiveRibListagemTiposPagamento   webhook                    [creds]
// ValidarEntrada                     code
// EntradaValida                      if
// RespostaErroEntrada                code
// ListagemTiposPagamentoRib          httpRequest                [onError→regular]
// BuildListagemTiposPagamentoResponse code
// ReturnListagemTiposPagamentoResponse respondToWebhook
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// ReceiveRibListagemTiposPagamento
//    → ValidarEntrada
//      → EntradaValida
//        → ListagemTiposPagamentoRib
//          → BuildListagemTiposPagamentoResponse
//            → ReturnListagemTiposPagamentoResponse
//       .out(1) → RespostaErroEntrada
//          → ReturnListagemTiposPagamentoResponse (↩ loop)
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: '1C9hQMPCfrBuaJ78',
    name: '[AUTONR-120] (integração) ListagemTiposPagamento - RIB',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class Autonr120IntegracaoListagemtipospagamentoRibWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'a120b1c2-d3e4-5f6a-7b8c-9d0e1f2a3b4c',
        webhookId: 'b120c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6e',
        name: 'Receive RIB Listagem Tipos Pagamento',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 300],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    ReceiveRibListagemTiposPagamento = {
        httpMethod: 'GET',
        path: 'rib/cobranca/tipo/pagamento',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'c120d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
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

const QUERY_KEYS = ['registrosPorPagina', 'numeroPagina', 'status', 'descricao'];

const QUERY_ALIASES = {
  registros_por_pagina: 'registrosPorPagina',
  numero_pagina: 'numeroPagina',
};

const MAX_REGISTROS_POR_PAGINA = 100;
const MIN_REGISTROS_POR_PAGINA = 1;
const MIN_NUMERO_PAGINA = 1;
const STATUS_TIPO_PAGAMENTO = new Set(['0', '1']);

function resolveAmbiente() {
  const raw = pick(
    query.ambiente,
    body.ambiente,
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

function resolveAccessToken() {
  const ribHeader = pick(header('x-rib-access-token'), header('X-RIB-Access-Token'));
  if (ribHeader) return ribHeader;
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

function buildQueryParams() {
  const params = {};
  const sources = [query, body];
  for (const source of sources) {
    for (const [key, value] of Object.entries(source ?? {})) {
      if (value === undefined || value === null || value === '') continue;
      const upstreamKey = QUERY_ALIASES[key] ?? (QUERY_KEYS.includes(key) ? key : null);
      if (upstreamKey) params[upstreamKey] = String(value).trim();
    }
  }
  return params;
}

function parsePositiveInt(value, field) {
  if (value === undefined || value === null || value === '') return { ok: true, value: null };
  const text = String(value).trim();
  if (!/^\\d+$/.test(text)) {
    return { ok: false, error: field + ' deve ser um numero inteiro positivo.' };
  }
  const num = Number(text);
  if (!Number.isFinite(num) || num < 0) {
    return { ok: false, error: field + ' deve ser um numero inteiro valido.' };
  }
  return { ok: true, value: num };
}

function validatePaginacao(params) {
  const registros = parsePositiveInt(params.registrosPorPagina, 'registrosPorPagina');
  if (!registros.ok) return { ok: false, code: 'registros_por_pagina_invalido', message: registros.error };
  if (registros.value !== null) {
    if (registros.value > MAX_REGISTROS_POR_PAGINA) {
      return {
        ok: false,
        code: 'registros_por_pagina_excedido',
        message: 'registrosPorPagina pode ter no maximo 100 (manual RFC-05).',
        technical: { informado: registros.value, maximo: MAX_REGISTROS_POR_PAGINA },
      };
    }
    if (registros.value < MIN_REGISTROS_POR_PAGINA) {
      return {
        ok: false,
        code: 'registros_por_pagina_invalido',
        message: 'registrosPorPagina deve ser no minimo 1.',
        technical: { informado: registros.value, minimo: MIN_REGISTROS_POR_PAGINA },
      };
    }
    params.registrosPorPagina = String(registros.value);
  }

  const pagina = parsePositiveInt(params.numeroPagina, 'numeroPagina');
  if (!pagina.ok) return { ok: false, code: 'numero_pagina_invalido', message: pagina.error };
  if (pagina.value !== null) {
    if (pagina.value < MIN_NUMERO_PAGINA) {
      return {
        ok: false,
        code: 'numero_pagina_invalido',
        message: 'numeroPagina deve ser no minimo 1.',
        technical: { informado: pagina.value, minimo: MIN_NUMERO_PAGINA },
      };
    }
    params.numeroPagina = String(pagina.value);
  }

  if (params.status !== undefined && params.status !== null && params.status !== '') {
    const statusText = String(params.status).trim();
    if (!STATUS_TIPO_PAGAMENTO.has(statusText)) {
      return {
        ok: false,
        code: 'status_tipo_pagamento_invalido',
        message: 'status deve ser 0 (inativo) ou 1 (ativo).',
        technical: { informado: statusText, aceitos: ['0', '1'] },
      };
    }
    params.status = statusText;
  }

  return { ok: true, params };
}

function encodeQueryString(params) {
  const parts = [];
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value === undefined || value === null || value === '') continue;
    parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(String(value)));
  }
  return parts.join('&');
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

const accessToken = resolveAccessToken();
if (!accessToken) {
  return erro(
    422,
    'access_token_ausente',
    'Informe access_token na query, header X-RIB-Access-Token ou Authorization Bearer.',
    { fontes: ['query.access_token', 'X-RIB-Access-Token', 'Authorization: Bearer'] },
  );
}

const queryParams = buildQueryParams();
const paginacao = validatePaginacao(queryParams);
if (!paginacao.ok) {
  return erro(422, paginacao.code, paginacao.message, paginacao.technical ?? null);
}

const finalParams = paginacao.params;
const queryString = encodeQueryString(finalParams);
const baseUrl = amb.baseUrl.replace(/\\/$/, '');
const listagemUrl = baseUrl + '/v1/cobranca/tipo/pagamento' + (queryString ? '?' + queryString : '');

return [{
  json: {
    valid: true,
    listagemUrl,
    accessToken,
    queryParams: finalParams,
    meta: {
      ambiente: amb.key,
      baseUrl,
      endpoint: '/v1/cobranca/tipo/pagamento',
      receivedAt: new Date().toISOString(),
      source: 'n8n-rib-listagem-tipos-pagamento',
    },
  },
}];
`,
    };

    @node({
        id: 'd120e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
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
                    id: 'cond-rib-listagem-tipos-pagamento-valido',
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
        id: 'e120f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a',
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
        id: 'f120a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b',
        name: 'Listagem Tipos Pagamento RIB',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [840, 180],
        onError: 'continueRegularOutput',
    })
    ListagemTiposPagamentoRib = {
        method: 'GET',
        url: '={{ $json.listagemUrl }}',
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
                    value: '=Bearer {{ $json.accessToken }}',
                },
            ],
        },
        options: {},
    };

    @node({
        id: 'a120b8c9-d0e1-2f3a-4b5c-6d7e8f9a0b1c',
        name: 'Build Listagem Tipos Pagamento Response',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1060, 180],
    })
    BuildListagemTiposPagamentoResponse = {
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
  const rawMessage = errorObject?.message ?? 'Erro desconhecido ao listar tipos de pagamento na API RIB.';
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
    statusCode: status === 401 ? 401 : (status || 502),
    response: {
      sucesso: false,
      codigo_erro: parsed?.codigo ?? 'rib_http_error',
      mensagem_erro: parsed?.descricao ?? parsed?.mensagem ?? rawMessage,
      campos: parsed?.campos ?? null,
      sistema: 'RIB',
      ambiente: meta.ambiente ?? null,
      meta,
      detalhe_tecnico: {
        name: errorObject?.name ?? null,
        code: errorObject?.code ?? null,
        status: status || null,
        endpoint: meta.endpoint ?? '/v1/cobranca/tipo/pagamento',
      },
    },
  };
}

if (httpResult.error) {
  return [{ json: normalizeHttpError(httpResult.error) }];
}

const data = httpResult;
const tiposPagamento = Array.isArray(data.dados)
  ? data.dados
  : (Array.isArray(data.cobrancas) ? data.cobrancas : []);

return [{
  json: {
    statusCode: 200,
    response: {
      sucesso: true,
      total_registros: data.totalRegistros ?? tiposPagamento.length,
      total_paginas: data.totalPaginas ?? null,
      pagina_atual: data.paginaAtual ?? null,
      tipos_pagamento: tiposPagamento,
      filtros: entrada.queryParams ?? {},
      ambiente: meta.ambiente ?? null,
      meta,
    },
  },
}];
`,
    };

    @node({
        id: 'b120c9d0-e1f2-3a4b-5c6d-7e8f9a0b1c2d',
        name: 'Return Listagem Tipos Pagamento Response',
        type: 'n8n-nodes-base.respondToWebhook',
        version: 1.5,
        position: [1280, 300],
    })
    ReturnListagemTiposPagamentoResponse = {
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
        this.ReceiveRibListagemTiposPagamento.out(0).to(this.ValidarEntrada.in(0));
        this.ValidarEntrada.out(0).to(this.EntradaValida.in(0));
        this.EntradaValida.out(0).to(this.ListagemTiposPagamentoRib.in(0));
        this.EntradaValida.out(1).to(this.RespostaErroEntrada.in(0));
        this.ListagemTiposPagamentoRib.out(0).to(this.BuildListagemTiposPagamentoResponse.in(0));
        this.BuildListagemTiposPagamentoResponse.out(0).to(this.ReturnListagemTiposPagamentoResponse.in(0));
        this.RespostaErroEntrada.out(0).to(this.ReturnListagemTiposPagamentoResponse.in(0));
    }
}
