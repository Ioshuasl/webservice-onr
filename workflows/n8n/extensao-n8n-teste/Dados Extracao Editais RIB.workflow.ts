import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : [AUTORIB-28] (rib) DadosExtracaoEditais - RIB
// Nodes   : 7  |  Connections: 7
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// ReceiveRibDadosExtracaoEditais     webhook                    [creds]
// ValidarEntrada                     code
// EntradaValida                      if
// RespostaErroEntrada                code
// DadosExtracaoEditaisRib            httpRequest                [onError→regular]
// BuildDadosExtracaoResponse         code
// ReturnDadosExtracaoResponse        respondToWebhook
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// ReceiveRibDadosExtracaoEditais
//    → ValidarEntrada
//      → EntradaValida
//        → DadosExtracaoEditaisRib
//          → BuildDadosExtracaoResponse
//            → ReturnDadosExtracaoResponse
//       .out(1) → RespostaErroEntrada
//          → ReturnDadosExtracaoResponse (↩ loop)
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'pF2SRsZ4m1cA3fzV',
    name: '[AUTORIB-28] (rib) DadosExtracaoEditais - RIB',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class Autorib28RibDadosextracaoeditaisRibWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'a118b1c2-d3e4-5f6a-7b8c-9d0e1f2a3b4c',
        webhookId: 'b118c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6e',
        name: 'Receive RIB Dados Extracao Editais',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 300],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    ReceiveRibDadosExtracaoEditais = {
        httpMethod: 'GET',
        path: 'rib/edital/extracao/dados',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'c118d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
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

const PAGINATION_KEYS = ['registrosPorPagina', 'numeroPagina'];
const PAGINATION_ALIASES = {
  registros_por_pagina: 'registrosPorPagina',
  numero_pagina: 'numeroPagina',
};

const MAX_REGISTROS_POR_PAGINA = 100;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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

function buildPaginationParams() {
  const params = {};
  const sources = [query, body];
  for (const source of sources) {
    for (const [key, value] of Object.entries(source ?? {})) {
      if (value === undefined || value === null || value === '') continue;
      const upstreamKey = PAGINATION_ALIASES[key] ?? (PAGINATION_KEYS.includes(key) ? key : null);
      if (upstreamKey) params[upstreamKey] = String(value).trim();
    }
  }
  return params;
}

function parsePositiveInt(value, field) {
  if (value === undefined || value === null || value === '') return { ok: true, value: null };
  const text = String(value).trim();
  if (!/^\\d+$/.test(text)) {
    return { ok: false, code: field + '_invalido', message: field + ' deve ser um numero inteiro positivo.' };
  }
  const num = Number(text);
  if (!Number.isFinite(num) || num < 1) {
    return { ok: false, code: field + '_invalido', message: field + ' deve ser um numero inteiro positivo.' };
  }
  return { ok: true, value: num, text };
}

function validatePaginacao(params) {
  const registros = parsePositiveInt(params.registrosPorPagina, 'registrosPorPagina');
  if (!registros.ok) {
    return { ok: false, code: 'registros_por_pagina_invalido', message: registros.message };
  }
  if (registros.value !== null) {
    if (registros.value > MAX_REGISTROS_POR_PAGINA) {
      return {
        ok: false,
        code: 'registros_por_pagina_excedido',
        message: 'registrosPorPagina pode ter no maximo 100 (RFX-05).',
        technical: { informado: registros.value, maximo: MAX_REGISTROS_POR_PAGINA },
      };
    }
    params.registrosPorPagina = registros.text;
  }

  const pagina = parsePositiveInt(params.numeroPagina, 'numeroPagina');
  if (!pagina.ok) return { ok: false, code: 'numero_pagina_invalido', message: pagina.message };
  if (pagina.value !== null) {
    params.numeroPagina = pagina.text;
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
    status_http: status,
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

const hashExtracao = pick(
  query.hash,
  query.hash_extracao,
  query.hashExtracao,
  body.hash,
  body.hash_extracao,
  body.hashExtracao,
);

if (!hashExtracao) {
  return erro(
    422,
    'hash_ausente',
    'Informe hash (UUID da solicitacao) na query ou body.',
    { fontes: ['query.hash', 'query.hash_extracao', 'body.hash'] },
  );
}

if (!UUID_REGEX.test(hashExtracao)) {
  return erro(
    422,
    'hash_invalido',
    'hash deve ser um UUID valido (36 caracteres).',
    { informado: hashExtracao },
  );
}

const paginationParams = buildPaginationParams();
const paginacao = validatePaginacao(paginationParams);
if (!paginacao.ok) {
  return erro(422, paginacao.code, paginacao.message, paginacao.technical ?? null);
}

const queryString = encodeQueryString(paginacao.params);
const baseUrl = amb.baseUrl.replace(/\\/$/, '');
const encoded = encodeURIComponent(hashExtracao);
const dadosPath = baseUrl + '/v1/edital/extracao/dados/' + encoded;
const upstreamUrl = dadosPath + (queryString ? '?' + queryString : '');

return [{
  json: {
    valid: true,
    upstreamUrl,
    accessToken,
    hashExtracao,
    queryParams: paginacao.params,
    meta: {
      ambiente: amb.key,
      baseUrl,
      endpoint: '/v1/edital/extracao/dados/{hash}',
      receivedAt: new Date().toISOString(),
      source: 'n8n-rib-dados-extracao-editais',
    },
    errorDefaultMsg: 'Erro ao obter dados da extracao de editais na API RIB.',
  },
}];
`,
    };

    @node({
        id: 'd118e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
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
                    id: 'cond-rib-dados-extracao-valido',
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
        id: 'e118f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a',
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
      status_http: 422,
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
        id: 'f118a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b',
        name: 'Dados Extracao Editais RIB',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [840, 180],
        onError: 'continueRegularOutput',
    })
    DadosExtracaoEditaisRib = {
        method: 'GET',
        url: '={{ $json.upstreamUrl }}',
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
        id: 'a118b8c9-d0e1-2f3a-4b5c-6d7e8f9a0b1c',
        name: 'Build Dados Extracao Response',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1060, 180],
    })
    BuildDadosExtracaoResponse = {
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

function normalizeHttpError(errorObject, meta, defaultMsg) {
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
      status_http: statusCode,
      sucesso: false,
      codigo_erro: parsed?.codigo ?? (status === 404 ? 'extracao_nao_encontrada' : 'rib_http_error'),
      mensagem_erro: parsed?.descricao ?? parsed?.mensagem ?? rawMessage,
      campos: parsed?.campos ?? null,
      sistema: 'RIB',
      ambiente: meta.ambiente ?? null,
      meta,
      detalhe_tecnico: {
        name: errorObject?.name ?? null,
        code: errorObject?.code ?? null,
        status: status || null,
        endpoint: meta.endpoint ?? '/v1/edital/extracao/dados/{hash}',
      },
    },
  };
}

function mapEndereco(end) {
  if (!end || typeof end !== 'object') return null;
  return {
    logradouro: end.logradouro ?? null,
    numero: end.numero ?? null,
    complemento: end.complemento ?? null,
    bairro: end.bairro ?? null,
    cidade: end.cidade ?? null,
    uf: end.uf ?? null,
    cep: end.cep ?? null,
    latitude: end.latitude ?? end.lat ?? null,
    longitude: end.longitude ?? end.lng ?? end.long ?? null,
  };
}

function mapParte(p) {
  if (!p || typeof p !== 'object') return null;
  return {
    documento: p.documento ?? null,
    nome: p.nome ?? null,
  };
}

function mapRegistro(item) {
  if (!item || typeof item !== 'object') return item;
  const serventia = item.serventia ?? {};
  const edital = item.edital ?? {};
  const imovel = item.imovel ?? item.imóvel ?? {};
  const contrato = item.contrato ?? {};
  return {
    serventia: {
      cns: serventia.cns ?? null,
      denominacao: serventia.denominacao ?? null,
    },
    edital: {
      tipo: edital.tipo ?? null,
      data_cadastro: edital.dataCadastro ?? null,
      total_publicacoes: edital.totalPublicacoes ?? null,
      data_publicacoes: Array.isArray(edital.dataPublicacoes) ? edital.dataPublicacoes : [],
    },
    partes: Array.isArray(item.partes) ? item.partes.map(mapParte).filter(Boolean) : [],
    imovel: {
      matricula: imovel.matricula ?? null,
      cnm: imovel.cnm ?? null,
      prenotacao: imovel.prenotacao ?? null,
      endereco: mapEndereco(imovel.endereco),
    },
    contrato: {
      nome_credor: contrato.nomeCredor ?? null,
      documento_credor: contrato.documentoCredor ?? null,
      numero: contrato.numero ?? null,
      data_contrato: contrato.dataContrato ?? null,
    },
    detalhe: item,
  };
}

if (httpResult.error) {
  return [{ json: normalizeHttpError(httpResult.error, meta, entrada.errorDefaultMsg ?? 'Erro na API RIB.') }];
}

const data = httpResult;
const registros = Array.isArray(data.dados) ? data.dados : [];

return [{
  json: {
    statusCode: 200,
    response: {
      status_http: 200,
      sucesso: true,
      hash: entrada.hashExtracao ?? null,
      total_registros: data.totalRegistros ?? registros.length,
      total_paginas: data.totalPaginas ?? null,
      pagina_atual: data.paginaAtual ?? null,
      dados: registros.map(mapRegistro),
      paginacao: entrada.queryParams ?? {},
      ambiente: meta.ambiente ?? null,
      meta,
    },
  },
}];
`,
    };

    @node({
        id: 'b118c9d0-e1f2-3a4b-5c6d-7e8f9a0b1c2d',
        name: 'Return Dados Extracao Response',
        type: 'n8n-nodes-base.respondToWebhook',
        version: 1.5,
        position: [1280, 300],
    })
    ReturnDadosExtracaoResponse = {
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
        this.ReceiveRibDadosExtracaoEditais.out(0).to(this.ValidarEntrada.in(0));
        this.ValidarEntrada.out(0).to(this.EntradaValida.in(0));
        this.EntradaValida.out(0).to(this.DadosExtracaoEditaisRib.in(0));
        this.EntradaValida.out(1).to(this.RespostaErroEntrada.in(0));
        this.DadosExtracaoEditaisRib.out(0).to(this.BuildDadosExtracaoResponse.in(0));
        this.BuildDadosExtracaoResponse.out(0).to(this.ReturnDadosExtracaoResponse.in(0));
        this.RespostaErroEntrada.out(0).to(this.ReturnDadosExtracaoResponse.in(0));
    }
}
