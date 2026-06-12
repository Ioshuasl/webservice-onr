import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : [AUTORIB-27] (rib) DetalheExtracaoEditais - RIB
// Nodes   : 7  |  Connections: 7
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// ReceiveRibDetalheExtracaoEditais   webhook                    [creds]
// ValidarEntrada                     code
// EntradaValida                      if
// RespostaErroEntrada                code
// DetalheExtracaoEditaisRib          httpRequest                [onError→regular]
// BuildDetalheExtracaoResponse       code
// ReturnDetalheExtracaoResponse      respondToWebhook
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// ReceiveRibDetalheExtracaoEditais
//    → ValidarEntrada
//      → EntradaValida
//        → DetalheExtracaoEditaisRib
//          → BuildDetalheExtracaoResponse
//            → ReturnDetalheExtracaoResponse
//       .out(1) → RespostaErroEntrada
//          → ReturnDetalheExtracaoResponse (↩ loop)
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'rGzcWmnpPnTUKbGK',
    name: '[AUTORIB-27] (rib) DetalheExtracaoEditais - RIB',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class Autorib27RibDetalheextracaoeditaisRibWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'a117b1c2-d3e4-5f6a-7b8c-9d0e1f2a3b4c',
        webhookId: 'b117c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6e',
        name: 'Receive RIB Detalhe Extracao Editais',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 300],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    ReceiveRibDetalheExtracaoEditais = {
        httpMethod: 'GET',
        path: 'rib/edital/extracao/detalhes',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'c117d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
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

const baseUrl = amb.baseUrl.replace(/\\/$/, '');
const encoded = encodeURIComponent(hashExtracao);

return [{
  json: {
    valid: true,
    upstreamUrl: baseUrl + '/v1/edital/extracao/' + encoded,
    accessToken,
    hashExtracao,
    meta: {
      ambiente: amb.key,
      baseUrl,
      endpoint: '/v1/edital/extracao/{hash}',
      receivedAt: new Date().toISOString(),
      source: 'n8n-rib-detalhe-extracao-editais',
    },
    errorDefaultMsg: 'Erro ao obter detalhe da extracao de editais na API RIB.',
  },
}];
`,
    };

    @node({
        id: 'd117e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
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
                    id: 'cond-rib-detalhe-extracao-valido',
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
        id: 'e117f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a',
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
        id: 'f117a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b',
        name: 'Detalhe Extracao Editais RIB',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [840, 180],
        onError: 'continueRegularOutput',
    })
    DetalheExtracaoEditaisRib = {
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
        id: 'a117b8c9-d0e1-2f3a-4b5c-6d7e8f9a0b1c',
        name: 'Build Detalhe Extracao Response',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1060, 180],
    })
    BuildDetalheExtracaoResponse = {
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
        endpoint: meta.endpoint ?? '/v1/edital/extracao/{hash}',
      },
    },
  };
}

function mapFinanceiro(fin) {
  if (!fin || typeof fin !== 'object') return null;
  return {
    valor: fin.valor ?? null,
    quantidade_registros: fin.quantidadeRegistros ?? null,
    situacao: fin.situacao ?? null,
    url_cobranca: fin.urlCobranca ?? null,
    url_recibo: fin.urlRecibo ?? null,
  };
}

if (httpResult.error) {
  return [{ json: normalizeHttpError(httpResult.error, meta, entrada.errorDefaultMsg ?? 'Erro na API RIB.') }];
}

const data = httpResult;

return [{
  json: {
    statusCode: 200,
    response: {
      status_http: 200,
      sucesso: true,
      hash: data.hash ?? entrada.hashExtracao ?? null,
      filtros: data.filtros ?? null,
      situacao: data.situacao ?? null,
      data_cadastro: data.dataCadastro ?? null,
      financeiro: mapFinanceiro(data.financeiro),
      detalhe: data,
      ambiente: meta.ambiente ?? null,
      meta,
    },
  },
}];
`,
    };

    @node({
        id: 'b117c9d0-e1f2-3a4b-5c6d-7e8f9a0b1c2d',
        name: 'Return Detalhe Extracao Response',
        type: 'n8n-nodes-base.respondToWebhook',
        version: 1.5,
        position: [1280, 300],
    })
    ReturnDetalheExtracaoResponse = {
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
        this.ReceiveRibDetalheExtracaoEditais.out(0).to(this.ValidarEntrada.in(0));
        this.ValidarEntrada.out(0).to(this.EntradaValida.in(0));
        this.EntradaValida.out(0).to(this.DetalheExtracaoEditaisRib.in(0));
        this.EntradaValida.out(1).to(this.RespostaErroEntrada.in(0));
        this.DetalheExtracaoEditaisRib.out(0).to(this.BuildDetalheExtracaoResponse.in(0));
        this.BuildDetalheExtracaoResponse.out(0).to(this.ReturnDetalheExtracaoResponse.in(0));
        this.RespostaErroEntrada.out(0).to(this.ReturnDetalheExtracaoResponse.in(0));
    }
}
