import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : [AUTORIB-2] (rib) ListagemProtocolos - RIB
// Nodes   : 7  |  Connections: 7
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// ReceiveRibListagemProtocolos       webhook                    [creds]
// ValidarEntrada                     code
// EntradaValida                      if
// RespostaErroEntrada                code
// ListagemProtocolosRib              httpRequest                [onError→regular]
// BuildListagemResponse              code
// ReturnListagemResponse             respondToWebhook
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// ReceiveRibListagemProtocolos
//    → ValidarEntrada
//      → EntradaValida
//        → ListagemProtocolosRib
//          → BuildListagemResponse
//            → ReturnListagemResponse
//       .out(1) → RespostaErroEntrada
//          → ReturnListagemResponse (↩ loop)
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'Sw88u5Dn1Wnbs9c6',
    name: '[AUTORIB-2] (rib) ListagemProtocolos - RIB',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class Autorib2RibListagemprotocolosRibWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'a92b1c2d-3e4f-5a6b-7c8d-9e0f1a2b3c4d',
        webhookId: 'b92c3d4e-5f6a-7b8c-9d0e-1f2a3b4c5d6e',
        name: 'Receive RIB Listagem Protocolos',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 300],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    ReceiveRibListagemProtocolos = {
        httpMethod: 'GET',
        path: 'rib/protocolo',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'c92d4e5f-6a7b-8c9d-0e1f-2a3b4c5d6e7f',
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
  'tipoSolicitacao',
  'dataInicialProtocolo',
  'dataFinalProtocolo',
  'dataInicialStatus',
  'dataFinalStatus',
  'dataInicialCadastro',
  'dataFinalCadastro',
  'cns',
  'documentoApresentante',
  'documentoInteressado',
  'protocolo',
];

const QUERY_ALIASES = {
  registros_por_pagina: 'registrosPorPagina',
  numero_pagina: 'numeroPagina',
  tipo_solicitacao: 'tipoSolicitacao',
  data_inicial_protocolo: 'dataInicialProtocolo',
  data_final_protocolo: 'dataFinalProtocolo',
  data_inicial_status: 'dataInicialStatus',
  data_final_status: 'dataFinalStatus',
  data_inicial_cadastro: 'dataInicialCadastro',
  data_final_cadastro: 'dataFinalCadastro',
  documento_apresentante: 'documentoApresentante',
  documento_interessado: 'documentoInteressado',
};

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
const queryString = encodeQueryString(queryParams);
const baseUrl = amb.baseUrl.replace(/\\/$/, '');
const listagemUrl = baseUrl + '/v1/protocolo' + (queryString ? '?' + queryString : '');

return [{
  json: {
    valid: true,
    listagemUrl,
    accessToken,
    queryParams,
    meta: {
      ambiente: amb.key,
      baseUrl,
      endpoint: '/v1/protocolo',
      receivedAt: new Date().toISOString(),
      source: 'n8n-rib-listagem-protocolos',
    },
  },
}];
`,
    };

    @node({
        id: 'd92e5f6a-7b8c-9d0e-1f2a-3b4c5d6e7f8a',
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
                    id: 'cond-rib-listagem-valido',
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
        id: 'e92f6a7b-8c9d-0e1f-2a3b-4c5d6e7f8a9b',
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
        id: 'f92a7b8c-9d0e-1f2a-3b4c-5d6e7f8a9b0c',
        name: 'Listagem Protocolos RIB',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [840, 180],
        onError: 'continueRegularOutput',
    })
    ListagemProtocolosRib = {
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
        id: 'a92b8c9d-0e1f-2a3b-4c5d-6e7f8a9b0c1d',
        name: 'Build Listagem Response',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1060, 180],
    })
    BuildListagemResponse = {
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
  const rawMessage = errorObject?.message ?? 'Erro desconhecido ao listar protocolos na API RIB.';
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
        endpoint: meta.endpoint ?? '/v1/protocolo',
      },
    },
  };
}

if (httpResult.error) {
  return [{ json: normalizeHttpError(httpResult.error) }];
}

const data = httpResult;
const protocolos = Array.isArray(data.dados) ? data.dados : [];

return [{
  json: {
    statusCode: 200,
    response: {
      sucesso: true,
      total_registros: data.totalRegistros ?? protocolos.length,
      total_paginas: data.totalPaginas ?? null,
      pagina_atual: data.paginaAtual ?? null,
      protocolos,
      filtros: entrada.queryParams ?? {},
      ambiente: meta.ambiente ?? null,
      meta,
    },
  },
}];
`,
    };

    @node({
        id: 'b92c9d0e-1f2a-3b4c-5d6e-7f8a9b0c1d2e',
        name: 'Return Listagem Response',
        type: 'n8n-nodes-base.respondToWebhook',
        version: 1.5,
        position: [1280, 300],
    })
    ReturnListagemResponse = {
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
        this.ReceiveRibListagemProtocolos.out(0).to(this.ValidarEntrada.in(0));
        this.ValidarEntrada.out(0).to(this.EntradaValida.in(0));
        this.EntradaValida.out(0).to(this.ListagemProtocolosRib.in(0));
        this.EntradaValida.out(1).to(this.RespostaErroEntrada.in(0));
        this.ListagemProtocolosRib.out(0).to(this.BuildListagemResponse.in(0));
        this.BuildListagemResponse.out(0).to(this.ReturnListagemResponse.in(0));
        this.RespostaErroEntrada.out(0).to(this.ReturnListagemResponse.in(0));
    }
}
