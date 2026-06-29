import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : [AUTCNIB-3] (cnib) VisualizarOrdens - Ordem
// Nodes   : 7  |  Connections: 7
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// ReceiveCnibVisualizarOrdens        webhook                    [creds]
// ValidarEntrada                     code
// EntradaValida                      if
// RespostaErroEntrada                code
// VisualizarOrdensCnib               httpRequest                [onError→regular]
// BuildVisualizarResponse            code
// ReturnVisualizarResponse           respondToWebhook
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// ReceiveCnibVisualizarOrdens
//    → ValidarEntrada
//      → EntradaValida
//        → VisualizarOrdensCnib
//          → BuildVisualizarResponse
//            → ReturnVisualizarResponse
//       .out(1) → RespostaErroEntrada
//          → ReturnVisualizarResponse (↩ loop)
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: '3GIHtJDvhTQcW2N6',
    name: '[AUTCNIB-3] (cnib) VisualizarOrdens - Ordem',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class Autcnib3CnibVisualizarordensOrdemWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'c1430003-0001-4000-8000-000000000001',
        webhookId: 'c1430003-0001-4000-8000-000000000011',
        name: 'Receive CNIB Visualizar Ordens',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 300],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    ReceiveCnibVisualizarOrdens = {
        httpMethod: 'POST',
        path: 'cnib/ordem/visualizar',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'c1430003-0001-4000-8000-000000000002',
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

function normalizeNull(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === 'string' && (value.trim() === '' || value.trim().toLowerCase() === 'null')) return null;
  return value;
}

function resolveBoolean(value) {
  if (typeof value === 'boolean') return value;
  if (value === 'true' || value === 1 || value === '1') return true;
  if (value === 'false' || value === 0 || value === '0') return false;
  return undefined;
}

function resolveInteger(value, fallback) {
  if (value === undefined || value === null || value === '') return fallback;
  const num = Number(value);
  if (!Number.isFinite(num) || !Number.isInteger(num)) return undefined;
  return num;
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

const cpfUsuario = pick(body.cpf_usuario, body.cpfUsuario, $env.CNIB_CPF_USUARIO);
if (!cpfUsuario) {
  return erro(
    422,
    'cpf_usuario_ausente',
    'Informe cpf_usuario no body ou configure CNIB_CPF_USUARIO no n8n.',
    null,
  );
}

const ordensVisualizadas = resolveBoolean(body.ordens_visualizadas ?? body.ordensVisualizadas);
if (ordensVisualizadas === undefined) {
  return erro(
    422,
    'ordens_visualizadas_ausente',
    'Informe ordens_visualizadas como boolean (true ou false).',
    null,
  );
}

const proximaPagina = resolveBoolean(body.proxima_pagina ?? body.proximaPagina);
if (proximaPagina === undefined) {
  return erro(
    422,
    'proxima_pagina_ausente',
    'Informe proxima_pagina como boolean (true ou false).',
    null,
  );
}

const paginaInicial = resolveInteger(body.pagina_inicial ?? body.paginaInicial, 0);
if (paginaInicial === undefined || paginaInicial < 0) {
  return erro(
    422,
    'pagina_inicial_invalida',
    'pagina_inicial deve ser inteiro >= 0.',
    { informado: body.pagina_inicial ?? body.paginaInicial },
  );
}

const tamanhoPaginaRaw = body.tamanho_pagina ?? body.tamanhoPagina;
const tamanhoPagina = resolveInteger(tamanhoPaginaRaw, 10);
if (tamanhoPagina === undefined || tamanhoPagina < 1 || tamanhoPagina > 500) {
  return erro(
    422,
    'tamanho_pagina_invalido',
    'tamanho_pagina deve ser inteiro entre 1 e 500.',
    { informado: tamanhoPaginaRaw, maximo: 500 },
  );
}

const protocol = normalizeNull(body.protocol);
const dataInicial = normalizeNull(body.data_inicial ?? body.dataInicial);
const dataFinal = normalizeNull(body.data_final ?? body.dataFinal);

const upstreamBody = {
  cpf_usuario: cpfUsuario,
  ordens_visualizadas: ordensVisualizadas,
  protocol,
  data_inicial: dataInicial,
  data_final: dataFinal,
  pagina_inicial: paginaInicial,
  tamanho_pagina: tamanhoPagina,
  proxima_pagina: proximaPagina,
};

const baseUrl = amb.baseUrl.replace(/\\/$/, '');
const visualizarUrl = baseUrl + '/api/v2/ordem/visualizar';

return [{
  json: {
    valid: true,
    visualizarUrl,
    accessToken,
    upstreamBody,
    meta: {
      ambiente: amb.key,
      baseUrl,
      endpoint: '/api/v2/ordem/visualizar',
      receivedAt: new Date().toISOString(),
      source: 'n8n-cnib-visualizar-ordens',
    },
  },
}];
`,
    };

    @node({
        id: 'c1430003-0001-4000-8000-000000000003',
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
                    id: 'cond-cnib-visualizar-valido',
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
        id: 'c1430003-0001-4000-8000-000000000004',
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
        id: 'c1430003-0001-4000-8000-000000000005',
        name: 'Visualizar Ordens CNIB',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [840, 180],
        onError: 'continueRegularOutput',
    })
    VisualizarOrdensCnib = {
        method: 'POST',
        url: '={{ $json.visualizarUrl }}',
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
        jsonBody: '={{ JSON.stringify($json.upstreamBody) }}',
        contentType: 'json',
        options: {},
    };

    @node({
        id: 'c1430003-0001-4000-8000-000000000006',
        name: 'Build Visualizar Response',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1060, 180],
    })
    BuildVisualizarResponse = {
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
  const rawMessage = errorObject?.message ?? 'Erro desconhecido ao visualizar ordens na API CNIB.';
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
        endpoint: meta.endpoint ?? '/api/v2/ordem/visualizar',
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
        id: 'c1430003-0001-4000-8000-000000000007',
        name: 'Return Visualizar Response',
        type: 'n8n-nodes-base.respondToWebhook',
        version: 1.5,
        position: [1280, 300],
    })
    ReturnVisualizarResponse = {
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
        this.ReceiveCnibVisualizarOrdens.out(0).to(this.ValidarEntrada.in(0));
        this.ValidarEntrada.out(0).to(this.EntradaValida.in(0));
        this.EntradaValida.out(0).to(this.VisualizarOrdensCnib.in(0));
        this.EntradaValida.out(1).to(this.RespostaErroEntrada.in(0));
        this.VisualizarOrdensCnib.out(0).to(this.BuildVisualizarResponse.in(0));
        this.BuildVisualizarResponse.out(0).to(this.ReturnVisualizarResponse.in(0));
        this.RespostaErroEntrada.out(0).to(this.ReturnVisualizarResponse.in(0));
    }
}
