import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : [AUTSEETJGO-5] (see tjgo) DistribuicaoAtosPedir - Pedido de Atos
// Nodes   : 7  |  Connections: 7
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// ReceiveSeeTjgoDistribuicaoAtos     webhook                    [creds]
// ValidarEntrada                     code
// EntradaValida                      if
// RespostaErroEntrada                code
// DistribuicaoAtosPedirSeeTjgo       httpRequest                [onError→regular]
// BuildDistribuicaoAtosResponse      code
// ReturnDistribuicaoAtosResponse     respondToWebhook
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// ReceiveSeeTjgoDistribuicaoAtos
//    → ValidarEntrada
//      → EntradaValida
//        → DistribuicaoAtosPedirSeeTjgo
//          → BuildDistribuicaoAtosResponse
//            → ReturnDistribuicaoAtosResponse
//       .out(1) → RespostaErroEntrada
//          → ReturnDistribuicaoAtosResponse (↩ loop)
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'JlPORsoaxEKWtYa5',
    name: '[AUTSEETJGO-5] (see tjgo) DistribuicaoAtosPedir - Pedido de Atos',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class Autseetjgo5SeeTjgoDistribuicaoatospedirPedidoDeAtosWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'e1f20005-0001-4000-8000-000000000001',
        webhookId: 'e1f20005-0001-4000-8000-000000000011',
        name: 'Receive SEE TJGO Distribuicao Atos',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 300],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    ReceiveSeeTjgoDistribuicaoAtos = {
        httpMethod: 'POST',
        path: 'see-tjgo/distribuicao-atos',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'e1f20005-0001-4000-8000-000000000002',
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

function normalizeNull(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === 'string' && (value.trim() === '' || value.trim().toLowerCase() === 'null')) return null;
  return value;
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
    'Informe auth_token no body, header X-SEE-TJGO-Auth-Token ou Authorization Bearer.',
    { fontes: ['body.auth_token', 'X-SEE-TJGO-Auth-Token', 'Authorization: Bearer'] },
  );
}

const tipoAtoId = normalizeNull(body.tipo_ato_id ?? body.tipoAtoId);
const quantidade = normalizeNull(body.quantidade);
const codigoSeloPrenotacao = normalizeNull(body.codigo_selo_prenotacao ?? body.codigoSeloPrenotacao);

if (tipoAtoId === null || tipoAtoId === undefined || String(tipoAtoId).trim() === '') {
  return erro(
    422,
    'tipo_ato_id_ausente',
    'Informe tipo_ato_id no body.',
    { campo: 'tipo_ato_id' },
  );
}

if (quantidade === null || quantidade === undefined || String(quantidade).trim() === '') {
  return erro(
    422,
    'quantidade_ausente',
    'Informe quantidade no body.',
    { campo: 'quantidade' },
  );
}

const upstreamBody = {
  tipo_ato_id: Number(tipoAtoId),
  quantidade: Number(quantidade),
};

if (codigoSeloPrenotacao !== null && String(codigoSeloPrenotacao).trim() !== '') {
  upstreamBody.codigo_selo_prenotacao = String(codigoSeloPrenotacao).trim();
}

const baseUrl = amb.baseUrl.replace(/\\/$/, '');
const pedirUrl = baseUrl + '/distribuicao_de_atos';

return [{
  json: {
    valid: true,
    pedirUrl,
    authToken,
    upstreamBody,
    meta: {
      ambiente: amb.key,
      baseUrl,
      endpoint: '/distribuicao_de_atos',
      receivedAt: new Date().toISOString(),
      source: 'n8n-see-tjgo-distribuicao-atos-pedir',
    },
  },
}];
`,
    };

    @node({
        id: 'e1f20005-0001-4000-8000-000000000003',
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
                    id: 'cond-see-distribuicao-atos-valido',
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
        id: 'e1f20005-0001-4000-8000-000000000004',
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
        id: 'e1f20005-0001-4000-8000-000000000005',
        name: 'Distribuicao Atos Pedir SEE TJGO',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [840, 180],
        onError: 'continueRegularOutput',
    })
    DistribuicaoAtosPedirSeeTjgo = {
        method: 'POST',
        url: '={{ $json.pedirUrl }}',
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
                    value: '=Bearer {{ $json.authToken }}',
                },
            ],
        },
        sendBody: true,
        jsonBody: '={{ JSON.stringify($json.upstreamBody) }}',
        contentType: 'json',
        options: {},
    };

    @node({
        id: 'e1f20005-0001-4000-8000-000000000006',
        name: 'Build Distribuicao Atos Response',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1060, 180],
    })
    BuildDistribuicaoAtosResponse = {
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
    return parsed.map((item) => item?.message ?? item?.mensagem ?? String(item)).join('; ');
  }
  if (parsed && typeof parsed === 'object') {
    return parsed.message ?? parsed.mensagem ?? parsed.error ?? null;
  }
  return null;
}

function normalizeHttpError(errorObject) {
  const rawMessage = errorObject?.message ?? 'Erro desconhecido ao solicitar atos na API SEE TJGO.';
  const status = Number(
    errorObject?.status
      ?? errorObject?.httpCode
      ?? rawMessage.match(/^\\s*(\\d{3})\\s*-/)?.[1]
      ?? 502,
  );
  const parsed = parseJsonSafe(errorObject?.response?.body)
    ?? parseJsonSafe(errorObject?.response?.data)
    ?? (typeof errorObject?.response?.body === 'object' ? errorObject.response.body : null);

  const mensagem = formatMensagens(parsed) ?? rawMessage;

  return {
    statusCode: status === 401 ? 401 : (status === 406 ? 406 : (status || 502)),
    response: {
      sucesso: false,
      codigo_erro: 'see_http_error',
      mensagem_erro: mensagem,
      erros: Array.isArray(parsed) ? parsed : null,
      sistema: 'SEE TJGO',
      status_http: status || 502,
      ambiente: meta.ambiente ?? null,
      meta,
      detalhe_tecnico: {
        name: errorObject?.name ?? null,
        code: errorObject?.code ?? null,
        status: status || null,
        endpoint: meta.endpoint ?? '/distribuicao_de_atos',
      },
      resposta_api: parsed,
    },
  };
}

if (httpResult.error) {
  return [{ json: normalizeHttpError(httpResult.error) }];
}

const data = httpResult;
const upstreamStatus = Number(data.status ?? 201);
const statusCode = upstreamStatus >= 100 && upstreamStatus < 600 ? upstreamStatus : 201;

if (statusCode >= 400) {
  const mensagem = formatMensagens(data) ?? 'A API SEE TJGO rejeitou o pedido de atos.';
  return [{
    json: {
      statusCode,
      response: {
        sucesso: false,
        codigo_erro: 'see_api_error',
        mensagem_erro: mensagem,
        erros: Array.isArray(data) ? data : null,
        sistema: 'SEE TJGO',
        status_http: statusCode,
        ambiente: meta.ambiente ?? null,
        meta,
        resposta_api: data,
      },
    },
  }];
}

return [{
  json: {
    statusCode: 201,
    response: {
      sucesso: true,
      status_http: 201,
      identificacao_pedido: data.identificacao_pedido ?? null,
      tipo_de_ato: data.tipo_de_ato ?? null,
      data_da_solicitacao: data.data_da_solicitacao ?? null,
      codigo_inicial_do_selo: data.codigo_inicial_do_selo ?? null,
      codigo_final_do_selo: data.codigo_final_do_selo ?? null,
      quantidade_de_selos: data.quantidade_de_selos ?? null,
      pedido: data,
      ambiente: meta.ambiente ?? null,
      meta,
    },
  },
}];
`,
    };

    @node({
        id: 'e1f20005-0001-4000-8000-000000000007',
        name: 'Return Distribuicao Atos Response',
        type: 'n8n-nodes-base.respondToWebhook',
        version: 1.5,
        position: [1280, 300],
    })
    ReturnDistribuicaoAtosResponse = {
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
        this.ReceiveSeeTjgoDistribuicaoAtos.out(0).to(this.ValidarEntrada.in(0));
        this.ValidarEntrada.out(0).to(this.EntradaValida.in(0));
        this.EntradaValida.out(0).to(this.DistribuicaoAtosPedirSeeTjgo.in(0));
        this.EntradaValida.out(1).to(this.RespostaErroEntrada.in(0));
        this.DistribuicaoAtosPedirSeeTjgo.out(0).to(this.BuildDistribuicaoAtosResponse.in(0));
        this.BuildDistribuicaoAtosResponse.out(0).to(this.ReturnDistribuicaoAtosResponse.in(0));
        this.RespostaErroEntrada.out(0).to(this.ReturnDistribuicaoAtosResponse.in(0));
    }
}
