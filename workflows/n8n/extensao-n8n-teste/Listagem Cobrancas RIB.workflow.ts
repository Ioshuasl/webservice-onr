import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : [AUTORIB-31] (rib) ListagemCobrancas - RIB
// Nodes   : 7  |  Connections: 7
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// ReceiveRibListagemCobrancas        webhook                    [creds]
// ValidarEntrada                     code
// EntradaValida                      if
// RespostaErroEntrada                code
// ListagemCobrancasRib               httpRequest                [onError→regular]
// BuildListagemCobrancasResponse     code
// ReturnListagemCobrancasResponse    respondToWebhook
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// ReceiveRibListagemCobrancas
//    → ValidarEntrada
//      → EntradaValida
//        → ListagemCobrancasRib
//          → BuildListagemCobrancasResponse
//            → ReturnListagemCobrancasResponse
//       .out(1) → RespostaErroEntrada
//          → ReturnListagemCobrancasResponse (↩ loop)
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'zWqpw3J2H21zZIxl',
    name: '[AUTORIB-31] (rib) ListagemCobrancas - RIB',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class Autorib31RibListagemcobrancasRibWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'a121b1c2-d3e4-5f6a-7b8c-9d0e1f2a3b4c',
        webhookId: 'b121c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6e',
        name: 'Receive RIB Listagem Cobrancas',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 300],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    ReceiveRibListagemCobrancas = {
        httpMethod: 'GET',
        path: 'rib/cobranca',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'c121d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
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

const QUERY_KEYS = [
  'registrosPorPagina',
  'numeroPagina',
  'tipoCobranca',
  'status',
  'pagadorDocumento',
  'pagadorEmail',
  'dataInicialGeracao',
  'dataFinalGeracao',
  'dataInicialStatus',
  'dataFinalStatus',
  'dataInicialPagamento',
  'dataFinalPagamento',
];

const QUERY_ALIASES = {
  registros_por_pagina: 'registrosPorPagina',
  numero_pagina: 'numeroPagina',
  tipo_cobranca: 'tipoCobranca',
  pagador_documento: 'pagadorDocumento',
  pagador_email: 'pagadorEmail',
  data_inicial_geracao: 'dataInicialGeracao',
  data_final_geracao: 'dataFinalGeracao',
  data_inicial_status: 'dataInicialStatus',
  data_final_status: 'dataFinalStatus',
  data_inicial_pagamento: 'dataInicialPagamento',
  data_final_pagamento: 'dataFinalPagamento',
};

const MAX_REGISTROS_POR_PAGINA = 100;
const MIN_REGISTROS_POR_PAGINA = 1;
const MIN_NUMERO_PAGINA = 1;
const TIPOS_COBRANCA = new Set(['PIX', 'BOLETO']);
const DATE_RE = /^\\d{4}-\\d{2}-\\d{2}$/;

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
    return { ok: false, error: field + ' deve ser um numero inteiro.' };
  }
  const num = Number(text);
  if (!Number.isFinite(num) || num < 0) {
    return { ok: false, error: field + ' deve ser um numero inteiro valido.' };
  }
  return { ok: true, value: num };
}

function validateDate(value, field) {
  if (value === undefined || value === null || value === '') return { ok: true };
  const text = String(value).trim();
  if (!DATE_RE.test(text)) {
    return { ok: false, code: 'data_invalida', message: field + ' deve estar no formato YYYY-MM-DD.' };
  }
  return { ok: true };
}

function validateFiltros(params) {
  const registros = parsePositiveInt(params.registrosPorPagina, 'registrosPorPagina');
  if (!registros.ok) {
    return { ok: false, code: 'registros_por_pagina_invalido', message: registros.error };
  }
  if (registros.value !== null) {
    if (registros.value > MAX_REGISTROS_POR_PAGINA) {
      return {
        ok: false,
        code: 'registros_por_pagina_excedido',
        message: 'registrosPorPagina pode ter no maximo 100 (manual RFC-02).',
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
    const status = parsePositiveInt(params.status, 'status');
    if (!status.ok) return { ok: false, code: 'status_cobranca_invalido', message: status.error };
    params.status = String(status.value);
  }

  if (params.tipoCobranca) {
    const tipo = String(params.tipoCobranca).trim().toUpperCase();
    if (!TIPOS_COBRANCA.has(tipo)) {
      return {
        ok: false,
        code: 'tipo_cobranca_invalido',
        message: 'tipoCobranca deve ser PIX ou BOLETO.',
        technical: { informado: params.tipoCobranca, aceitos: ['PIX', 'BOLETO'] },
      };
    }
    params.tipoCobranca = tipo;
  }

  const dateFields = [
    'dataInicialGeracao',
    'dataFinalGeracao',
    'dataInicialStatus',
    'dataFinalStatus',
    'dataInicialPagamento',
    'dataFinalPagamento',
  ];
  for (const field of dateFields) {
    const dateCheck = validateDate(params[field], field);
    if (!dateCheck.ok) return dateCheck;
  }

  const hasStatusDate = params.dataInicialStatus || params.dataFinalStatus;
  if (hasStatusDate && !params.status) {
    return {
      ok: false,
      code: 'filtro_status_obrigatorio',
      message: 'dataInicialStatus e dataFinalStatus exigem o parametro status (RFC-02).',
      technical: { campos: ['dataInicialStatus', 'dataFinalStatus', 'status'] },
    };
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
const filtros = validateFiltros(queryParams);
if (!filtros.ok) {
  return erro(422, filtros.code, filtros.message, filtros.technical ?? null);
}

const finalParams = filtros.params;
const queryString = encodeQueryString(finalParams);
const baseUrl = amb.baseUrl.replace(/\\/$/, '');
const listagemUrl = baseUrl + '/v1/cobranca' + (queryString ? '?' + queryString : '');

return [{
  json: {
    valid: true,
    listagemUrl,
    accessToken,
    queryParams: finalParams,
    meta: {
      ambiente: amb.key,
      baseUrl,
      endpoint: '/v1/cobranca',
      receivedAt: new Date().toISOString(),
      source: 'n8n-rib-listagem-cobrancas',
    },
  },
}];
`,
    };

    @node({
        id: 'd121e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
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
                    id: 'cond-rib-listagem-cobrancas-valido',
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
        id: 'e121f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a',
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
        id: 'f121a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b',
        name: 'Listagem Cobrancas RIB',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [840, 180],
        onError: 'continueRegularOutput',
    })
    ListagemCobrancasRib = {
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
        id: 'a121b8c9-d0e1-2f3a-4b5c-6d7e8f9a0b1c',
        name: 'Build Listagem Cobrancas Response',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1060, 180],
    })
    BuildListagemCobrancasResponse = {
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
  const rawMessage = errorObject?.message ?? 'Erro desconhecido ao listar cobrancas na API RIB.';
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
        endpoint: meta.endpoint ?? '/v1/cobranca',
      },
    },
  };
}

if (httpResult.error) {
  return [{ json: normalizeHttpError(httpResult.error) }];
}

const data = httpResult;
const cobrancas = Array.isArray(data.cobrancas)
  ? data.cobrancas
  : (Array.isArray(data.dados) ? data.dados : []);

return [{
  json: {
    statusCode: 200,
    response: {
      sucesso: true,
      total_registros: data.totalRegistros ?? cobrancas.length,
      total_paginas: data.totalPaginas ?? null,
      pagina_atual: data.paginaAtual ?? null,
      cobrancas,
      filtros: entrada.queryParams ?? {},
      ambiente: meta.ambiente ?? null,
      meta,
    },
  },
}];
`,
    };

    @node({
        id: 'b121c9d0-e1f2-3a4b-5c6d-7e8f9a0b1c2d',
        name: 'Return Listagem Cobrancas Response',
        type: 'n8n-nodes-base.respondToWebhook',
        version: 1.5,
        position: [1280, 300],
    })
    ReturnListagemCobrancasResponse = {
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
        this.ReceiveRibListagemCobrancas.out(0).to(this.ValidarEntrada.in(0));
        this.ValidarEntrada.out(0).to(this.EntradaValida.in(0));
        this.EntradaValida.out(0).to(this.ListagemCobrancasRib.in(0));
        this.EntradaValida.out(1).to(this.RespostaErroEntrada.in(0));
        this.ListagemCobrancasRib.out(0).to(this.BuildListagemCobrancasResponse.in(0));
        this.BuildListagemCobrancasResponse.out(0).to(this.ReturnListagemCobrancasResponse.in(0));
        this.RespostaErroEntrada.out(0).to(this.ReturnListagemCobrancasResponse.in(0));
    }
}
