import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : [AUTONRCPN-5] (onrcpn) GetCertificateJson - Certidão
// Nodes   : 7  |  Connections: 7
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// ReceiveOnrcpnCertificateJsonGet    webhook                    [creds]
// ValidarEntrada                     code
// EntradaValida                      if
// RespostaErroEntrada                code
// GetCertificateJsonOnrcpn           httpRequest                [onError→regular]
// BuildGetCertificateJsonResponse    code
// ReturnGetCertificateJsonResponse   respondToWebhook
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// ReceiveOnrcpnCertificateJsonGet
//    → ValidarEntrada
//      → EntradaValida
//        → GetCertificateJsonOnrcpn
//          → BuildGetCertificateJsonResponse
//            → ReturnGetCertificateJsonResponse
//       .out(1) → RespostaErroEntrada
//          → ReturnGetCertificateJsonResponse (↩ loop)
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'HXfIyLqYyAIiUv8T',
    name: '[AUTONRCPN-5] (onrcpn) GetCertificateJson - Certidão',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class Autonrcpn5OnrcpnGetcertificatejsonCertidaoWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'a1b20005-0001-4000-8000-000000000001',
        webhookId: 'a1b20005-0001-4000-8000-000000000011',
        name: 'Receive ONRCPN Certificate Json Get',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 300],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    ReceiveOnrcpnCertificateJsonGet = {
        httpMethod: 'GET',
        path: 'onrcpn/certificate-json/get',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'a1b20005-0001-4000-8000-000000000002',
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

function resolveBaseUrl() {
  return pick(
    query.base_url,
    body.base_url,
    body.baseUrl,
    header('x-onrcpn-base-url'),
    $env.ONRCPN_CERTIDAO_BASE_URL,
    'https://certidaoh.registrocivil.org.br',
  ).replace(/\\/$/, '');
}

function resolveIdrcToken() {
  const onrcpnHeader = pick(header('x-onrcpn-idrc-token'), header('X-ONRCPN-IdRC-Token'));
  if (onrcpnHeader) return onrcpnHeader;
  const authHeader = pick(header('authorization'), header('Authorization'));
  const bearerMatch = authHeader.match(/^Bearer\\s+(.+)$/i);
  if (bearerMatch) return bearerMatch[1].trim();
  return pick(
    query.idrc_token,
    query.idrcToken,
    query.access_token,
    query.token,
    body.idrc_token,
    body.idrcToken,
    body.access_token,
    body.token,
    $env.ONRCPN_IDRC_TOKEN,
  );
}

function erro(status, code, message, technical) {
  const response = {
    sucesso: false,
    codigo_erro: code,
    mensagem_erro: message,
    sistema: 'ONRCPN',
    status_http: status,
    dados: {},
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

const certidaoId = pick(
  query.certidao_id,
  query.certidaoId,
  query.id,
  params.certidao_id,
  params.id,
  body.certidao_id,
  body.id,
);

if (!certidaoId) {
  return erro(
    400,
    'certidao_id_ausente',
    'Informe certidao_id ou id na query do webhook.',
    { fontes: ['query.certidao_id', 'query.id'] },
  );
}

const idrcToken = resolveIdrcToken();
const baseUrl = resolveBaseUrl();
const getUrl = baseUrl + '/api/v1.0/get-certificate-json/' + encodeURIComponent(certidaoId);

const meta = {
  ambiente: 'homologacao',
  baseUrl,
  certidao_id: certidaoId,
  endpoint: '/api/v1.0/get-certificate-json/{id}',
  token_configurado: Boolean(idrcToken),
  receivedAt: new Date().toISOString(),
  source: 'n8n-onrcpn-certificate-json-get',
};

if (!idrcToken) {
  meta.aviso_token = 'ONRCPN_IDRC_TOKEN ausente — upstream retornará 401 até credencial IdRC ser configurada';
}

return [{
  json: {
    valid: true,
    getUrl,
    certidaoId,
    idrcToken: idrcToken || '',
    meta,
  },
}];
`,
    };

    @node({
        id: 'a1b20005-0001-4000-8000-000000000003',
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
                    id: 'cond-onrcpn-cert-get-valido',
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
        id: 'a1b20005-0001-4000-8000-000000000004',
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
    statusCode: data.statusCode || 400,
    response: data.response ?? {
      sucesso: false,
      codigo_erro: 'entrada_invalida',
      mensagem_erro: 'Entrada rejeitada pela validacao local.',
      sistema: 'ONRCPN',
      status_http: data.statusCode || 400,
      dados: {},
    },
  },
}];
`,
    };

    @node({
        id: 'a1b20005-0001-4000-8000-000000000005',
        name: 'Get Certificate Json ONRCPN',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [840, 180],
        onError: 'continueRegularOutput',
    })
    GetCertificateJsonOnrcpn = {
        method: 'GET',
        url: '={{ $json.getUrl }}',
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
                    value: '={{ $json.idrcToken ? "Bearer " + $json.idrcToken : "" }}',
                },
            ],
        },
        options: {},
    };

    @node({
        id: 'a1b20005-0001-4000-8000-000000000006',
        name: 'Build Get Certificate Json Response',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1060, 180],
    })
    BuildGetCertificateJsonResponse = {
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
  const rawMessage = errorObject?.message ?? 'Erro desconhecido ao buscar certidao na API ONRCPN.';
  const status = Number(
    errorObject?.status
      ?? errorObject?.httpCode
      ?? rawMessage.match(/^\\s*(\\d{3})\\s*-/)?.[1]
      ?? 502,
  );
  const parsed = parseJsonSafe(errorObject?.response?.body)
    ?? parseJsonSafe(errorObject?.response?.data)
    ?? (typeof errorObject?.response?.body === 'object' ? errorObject.response.body : null);

  const httpStatus = status === 401 ? 401 : status === 403 ? 403 : status === 404 ? 404 : (status || 502);

  return {
    statusCode: httpStatus,
    response: {
      sucesso: false,
      codigo_erro: parsed?.codigo ?? parsed?.error ?? 'onrcpn_http_error',
      mensagem_erro: parsed?.message ?? parsed?.mensagem ?? rawMessage,
      sistema: 'ONRCPN',
      status_http: httpStatus,
      dados: parsed?.data ?? {},
      meta,
      detalhe_tecnico: {
        name: errorObject?.name ?? null,
        code: errorObject?.code ?? null,
        status: status || null,
        endpoint: meta.endpoint ?? '/api/v1.0/get-certificate-json/{id}',
      },
    },
  };
}

if (httpResult.error) {
  return [{ json: normalizeHttpError(httpResult.error) }];
}

const data = httpResult;
const upstreamStatus = Number(data.statusCode ?? data.status ?? 200);
const statusCode = upstreamStatus >= 100 && upstreamStatus < 600 ? upstreamStatus : 200;
const sucesso = data.success === true;

if (!sucesso) {
  const businessStatus = statusCode === 401 ? 401
    : statusCode === 403 ? 403
    : statusCode === 404 ? 404
    : statusCode >= 400 && statusCode < 500 ? 422
    : statusCode >= 500 ? (statusCode === 503 ? 503 : 502)
    : 422;

  return [{
    json: {
      statusCode: businessStatus,
      response: {
        sucesso: false,
        codigo_erro: 'onrcpn_api_error',
        mensagem_erro: data.message ?? 'A API ONRCPN retornou success=false.',
        sistema: 'ONRCPN',
        status_http: businessStatus,
        dados: data.data ?? {},
        meta,
        resposta_api: data,
      },
    },
  }];
}

const okStatus = statusCode === 200 ? 200 : 200;

return [{
  json: {
    statusCode: okStatus,
    response: {
      sucesso: true,
      codigo_erro: 0,
      mensagem_erro: '',
      status_http: okStatus,
      mensagem: data.message ?? null,
      dados: data.data ?? {},
      meta,
    },
  },
}];
`,
    };

    @node({
        id: 'a1b20005-0001-4000-8000-000000000007',
        name: 'Return Get Certificate Json Response',
        type: 'n8n-nodes-base.respondToWebhook',
        version: 1.5,
        position: [1280, 300],
    })
    ReturnGetCertificateJsonResponse = {
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
        this.ReceiveOnrcpnCertificateJsonGet.out(0).to(this.ValidarEntrada.in(0));
        this.ValidarEntrada.out(0).to(this.EntradaValida.in(0));
        this.EntradaValida.out(0).to(this.GetCertificateJsonOnrcpn.in(0));
        this.EntradaValida.out(1).to(this.RespostaErroEntrada.in(0));
        this.GetCertificateJsonOnrcpn.out(0).to(this.BuildGetCertificateJsonResponse.in(0));
        this.BuildGetCertificateJsonResponse.out(0).to(this.ReturnGetCertificateJsonResponse.in(0));
        this.RespostaErroEntrada.out(0).to(this.ReturnGetCertificateJsonResponse.in(0));
    }
}
