import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : [AUTSEETJGO-6] (see tjgo) DistribuicaoAtosDownload - Pedido de Atos
// Nodes   : 7  |  Connections: 7
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// ReceiveSeeTjgoDistribuicaoAtosDownload webhook                    [creds]
// ValidarEntrada                     code
// EntradaValida                      if
// RespostaErroEntrada                code
// DistribuicaoAtosDownloadSeeTjgo    httpRequest                [onError→regular]
// BuildDistribuicaoAtosDownloadResponse code
// ReturnDistribuicaoAtosDownloadResponse respondToWebhook
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// ReceiveSeeTjgoDistribuicaoAtosDownload
//    → ValidarEntrada
//      → EntradaValida
//        → DistribuicaoAtosDownloadSeeTjgo
//          → BuildDistribuicaoAtosDownloadResponse
//            → ReturnDistribuicaoAtosDownloadResponse
//       .out(1) → RespostaErroEntrada
//          → ReturnDistribuicaoAtosDownloadResponse (↩ loop)
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: '6kIcIgmFxE8IK2t5',
    name: '[AUTSEETJGO-6] (see tjgo) DistribuicaoAtosDownload - Pedido de Atos',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class Autseetjgo6SeeTjgoDistribuicaoatosdownloadPedidoDeAtosWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'e1f20006-0001-4000-8000-000000000001',
        webhookId: 'e1f20006-0001-4000-8000-000000000011',
        name: 'Receive SEE TJGO Distribuicao Atos Download',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 300],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    ReceiveSeeTjgoDistribuicaoAtosDownload = {
        httpMethod: 'GET',
        path: 'see-tjgo/distribuicao-atos/:id/download',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'e1f20006-0001-4000-8000-000000000002',
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

const pedidoId = pick(
  params.id,
  params.ID,
  query.id,
  body.id,
  query.identificacao_pedido,
  body.identificacao_pedido,
);

if (!pedidoId) {
  return erro(
    422,
    'id_ausente',
    'Informe o ID/protocolo do pedido na URL (/see-tjgo/distribuicao-atos/{id}/download).',
    { fontes: ['params.id', 'query.id'] },
  );
}

if (!/^\\d+$/.test(pedidoId)) {
  return erro(
    422,
    'id_invalido',
    'O ID do pedido deve ser um numero inteiro positivo.',
    { informado: pedidoId },
  );
}

const baseUrl = amb.baseUrl.replace(/\\/$/, '');
const downloadUrl = baseUrl + '/distribuicao_de_atos/' + encodeURIComponent(pedidoId) + '/download';

return [{
  json: {
    valid: true,
    downloadUrl,
    authToken,
    pedidoId,
    meta: {
      ambiente: amb.key,
      baseUrl,
      pedidoId,
      endpoint: '/distribuicao_de_atos/{id}/download',
      receivedAt: new Date().toISOString(),
      source: 'n8n-see-tjgo-distribuicao-atos-download',
    },
    errorDefaultMsg: 'Erro ao baixar arquivo de importacao do lote na API SEE TJGO.',
  },
}];
`,
    };

    @node({
        id: 'e1f20006-0001-4000-8000-000000000003',
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
                    id: 'cond-see-distribuicao-atos-download-valido',
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
        id: 'e1f20006-0001-4000-8000-000000000004',
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
        id: 'e1f20006-0001-4000-8000-000000000005',
        name: 'Distribuicao Atos Download SEE TJGO',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [840, 180],
        onError: 'continueRegularOutput',
    })
    DistribuicaoAtosDownloadSeeTjgo = {
        method: 'GET',
        url: '={{ $json.downloadUrl }}',
        authentication: 'none',
        sendHeaders: true,
        specifyHeaders: 'keypair',
        headerParameters: {
            parameters: [
                {
                    name: 'Accept',
                    value: 'application/json, application/octet-stream, */*',
                },
                {
                    name: 'Authorization',
                    value: '=Bearer {{ $json.authToken }}',
                },
            ],
        },
        sendBody: false,
        options: {
            response: {
                response: {
                    fullResponse: true,
                    responseFormat: 'file',
                },
            },
        },
    };

    @node({
        id: 'e1f20006-0001-4000-8000-000000000006',
        name: 'Build Distribuicao Atos Download Response',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1060, 180],
    })
    BuildDistribuicaoAtosDownloadResponse = {
        mode: 'runOnceForAllItems',
        language: 'javaScript',
        jsCode: `
const entrada = $('Validar Entrada').first().json;
const meta = entrada.meta ?? {};
const item = items[0];

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
      codigo_erro: status === 404 ? 'pedido_nao_encontrado' : 'see_http_error',
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
        endpoint: meta.endpoint ?? '/distribuicao_de_atos/{id}/download',
      },
      resposta_api: parsed,
    },
  };
}

function isPedidoJson(data) {
  return data
    && typeof data === 'object'
    && !Array.isArray(data)
    && (data.identificacao_pedido !== undefined || data.tipo_de_ato !== undefined);
}

if (item.json?.error) {
  return [{ json: normalizeHttpError(item.json.error, entrada.errorDefaultMsg ?? 'Erro na API SEE TJGO.') }];
}

const bin = item.binary?.data ?? item.binary?.file;
if (bin?.data) {
  const mime = String(bin.mimeType ?? bin.fileType ?? '').toLowerCase();
  if (mime.includes('json') || mime.includes('text')) {
    const text = Buffer.from(bin.data, 'base64').toString('utf8');
    const parsed = parseJsonSafe(text);
    if (parsed && !isPedidoJson(parsed)) {
      const status = Number(parsed?.status ?? 404);
      if (status >= 400 || parsed?.message || parsed?.mensagem) {
        return [{
          json: {
            statusCode: status >= 100 && status < 600 ? status : 404,
            response: {
              sucesso: false,
              codigo_erro: status === 404 ? 'pedido_nao_encontrado' : 'see_api_error',
              mensagem_erro: formatMensagens(parsed) ?? 'A API SEE TJGO rejeitou o download do lote.',
              sistema: 'SEE TJGO',
              status_http: status >= 100 && status < 600 ? status : 404,
              ambiente: meta.ambiente ?? null,
              meta,
              resposta_api: parsed,
            },
          },
        }];
      }
    }
    if (isPedidoJson(parsed)) {
      return [{
        json: {
          statusCode: 200,
          response: {
            sucesso: true,
            status_http: 200,
            identificacao_pedido: parsed.identificacao_pedido ?? Number(entrada.pedidoId) ?? null,
            tipo_de_ato: parsed.tipo_de_ato ?? null,
            data_da_solicitacao: parsed.data_da_solicitacao ?? null,
            codigo_inicial_do_selo: parsed.codigo_inicial_do_selo ?? null,
            codigo_final_do_selo: parsed.codigo_final_do_selo ?? null,
            quantidade_de_selos: parsed.quantidade_de_selos ?? null,
            pedido: parsed,
            formato: 'json',
            ambiente: meta.ambiente ?? null,
            meta,
          },
        },
      }];
    }
  }

  return [{
    json: {
      statusCode: 200,
      response: {
        sucesso: true,
        status_http: 200,
        identificacao_pedido: Number(entrada.pedidoId) || null,
        content_type: bin.mimeType ?? bin.fileType ?? 'application/octet-stream',
        file_name: bin.fileName ?? ('lote-' + entrada.pedidoId + '.dat'),
        conteudo_base64: bin.data,
        formato: 'binario',
        ambiente: meta.ambiente ?? null,
        meta,
      },
    },
  }];
}

const raw = item.json;
const statusCode = Number(raw?.statusCode ?? raw?.status ?? 200);
if (statusCode >= 400) {
  const parsed = parseJsonSafe(raw?.body) ?? (typeof raw?.body === 'object' ? raw.body : raw);
  return [{
    json: {
      statusCode: statusCode >= 100 && statusCode < 600 ? statusCode : 502,
      response: {
        sucesso: false,
        codigo_erro: statusCode === 404 ? 'pedido_nao_encontrado' : 'see_api_error',
        mensagem_erro: formatMensagens(parsed) ?? 'A API SEE TJGO rejeitou o download do lote.',
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

const data = parseJsonSafe(raw?.body) ?? raw?.body ?? raw;
if (isPedidoJson(data)) {
  return [{
    json: {
      statusCode: 200,
      response: {
        sucesso: true,
        status_http: 200,
        identificacao_pedido: data.identificacao_pedido ?? Number(entrada.pedidoId) ?? null,
        tipo_de_ato: data.tipo_de_ato ?? null,
        data_da_solicitacao: data.data_da_solicitacao ?? null,
        codigo_inicial_do_selo: data.codigo_inicial_do_selo ?? null,
        codigo_final_do_selo: data.codigo_final_do_selo ?? null,
        quantidade_de_selos: data.quantidade_de_selos ?? null,
        pedido: data,
        formato: 'json',
        ambiente: meta.ambiente ?? null,
        meta,
      },
    },
  }];
}

if (typeof data === 'string' && data.trim()) {
  return [{
    json: {
      statusCode: 200,
      response: {
        sucesso: true,
        status_http: 200,
        identificacao_pedido: Number(entrada.pedidoId) || null,
        content_type: 'text/plain',
        file_name: 'lote-' + entrada.pedidoId + '.txt',
        conteudo_base64: Buffer.from(data, 'utf8').toString('base64'),
        formato: 'binario',
        ambiente: meta.ambiente ?? null,
        meta,
      },
    },
  }];
}

return [{
  json: {
    statusCode: 502,
    response: {
      sucesso: false,
      codigo_erro: 'resposta_inesperada',
      mensagem_erro: 'Resposta da API SEE TJGO em formato nao reconhecido.',
      sistema: 'SEE TJGO',
      status_http: 502,
      ambiente: meta.ambiente ?? null,
      meta,
    },
  },
}];
`,
    };

    @node({
        id: 'e1f20006-0001-4000-8000-000000000007',
        name: 'Return Distribuicao Atos Download Response',
        type: 'n8n-nodes-base.respondToWebhook',
        version: 1.5,
        position: [1280, 300],
    })
    ReturnDistribuicaoAtosDownloadResponse = {
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
        this.ReceiveSeeTjgoDistribuicaoAtosDownload.out(0).to(this.ValidarEntrada.in(0));
        this.ValidarEntrada.out(0).to(this.EntradaValida.in(0));
        this.EntradaValida.out(0).to(this.DistribuicaoAtosDownloadSeeTjgo.in(0));
        this.EntradaValida.out(1).to(this.RespostaErroEntrada.in(0));
        this.DistribuicaoAtosDownloadSeeTjgo.out(0).to(this.BuildDistribuicaoAtosDownloadResponse.in(0));
        this.BuildDistribuicaoAtosDownloadResponse.out(0).to(this.ReturnDistribuicaoAtosDownloadResponse.in(0));
        this.RespostaErroEntrada.out(0).to(this.ReturnDistribuicaoAtosDownloadResponse.in(0));
    }
}
