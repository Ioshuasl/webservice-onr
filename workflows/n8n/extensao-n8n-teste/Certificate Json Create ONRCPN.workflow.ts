import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : [AUTONRCPN-1] (onrcpn) CertificateJsonCreate - Certidão
// Nodes   : 7  |  Connections: 7
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// ReceiveOnrcpnCertificateJsonCreate webhook                    [creds]
// ValidarEntrada                     code
// EntradaValida                      if
// RespostaErroEntrada                code
// CertificateJsonCreateOnrcpn        httpRequest                [onError→regular]
// BuildCertificateJsonCreateResponse code
// ReturnCertificateJsonCreateResponse respondToWebhook
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// ReceiveOnrcpnCertificateJsonCreate
//    → ValidarEntrada
//      → EntradaValida
//        → CertificateJsonCreateOnrcpn
//          → BuildCertificateJsonCreateResponse
//            → ReturnCertificateJsonCreateResponse
//       .out(1) → RespostaErroEntrada
//          → ReturnCertificateJsonCreateResponse (↩ loop)
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'KU15nttSxHXkarQG',
    name: '[AUTONRCPN-1] (onrcpn) CertificateJsonCreate - Certidão',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class Autonrcpn1OnrcpnCertificatejsoncreateCertidaoWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'a1b20001-0001-4000-8000-000000000001',
        webhookId: 'a1b20001-0001-4000-8000-000000000011',
        name: 'Receive ONRCPN Certificate Json Create',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 300],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    ReceiveOnrcpnCertificateJsonCreate = {
        httpMethod: 'POST',
        path: 'onrcpn/certificate-json/create',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'a1b20001-0001-4000-8000-000000000002',
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

const TIPOS_REGISTRO = ['nascimento', 'casamento', 'obito', 'inteiro_teor'];
const TIPOS_CERTIDAO = ['nascimento', 'casamento', 'obito'];
const MODALIDADES = ['eletronica', 'fisica'];

function resolveBaseUrl() {
  return pick(
    body.base_url,
    body.baseUrl,
    query.base_url,
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

const certidao = body.certidao;
const registro = body.registro;

if (!certidao || typeof certidao !== 'object' || Array.isArray(certidao)) {
  return erro(400, 'certidao_ausente', 'Informe o objeto certidao no body.', null);
}
if (!registro || typeof registro !== 'object' || Array.isArray(registro)) {
  return erro(400, 'registro_ausente', 'Informe o objeto registro no body.', null);
}

const tipoRegistro = pick(certidao.tipo_registro, certidao.tipoRegistro).toLowerCase();
if (!tipoRegistro) {
  return erro(400, 'tipo_registro_ausente', 'certidao.tipo_registro é obrigatório.', { aceitos: TIPOS_REGISTRO });
}
if (!TIPOS_REGISTRO.includes(tipoRegistro)) {
  return erro(
    400,
    'tipo_registro_invalido',
    'certidao.tipo_registro deve ser nascimento, casamento, obito ou inteiro_teor.',
    { informado: tipoRegistro, aceitos: TIPOS_REGISTRO },
  );
}

const tipoCertidao = pick(certidao.tipo_certidao, certidao.tipoCertidao).toLowerCase();
if (tipoRegistro === 'inteiro_teor') {
  if (!tipoCertidao) {
    return erro(400, 'tipo_certidao_ausente', 'certidao.tipo_certidao é obrigatório quando tipo_registro=inteiro_teor.', null);
  }
  if (!TIPOS_CERTIDAO.includes(tipoCertidao)) {
    return erro(
      400,
      'tipo_certidao_invalido',
      'certidao.tipo_certidao deve ser nascimento, casamento ou obito.',
      { informado: tipoCertidao, aceitos: TIPOS_CERTIDAO },
    );
  }
}

const modalidade = pick(certidao.modalidade).toLowerCase();
if (modalidade && !MODALIDADES.includes(modalidade)) {
  return erro(
    400,
    'modalidade_invalida',
    'certidao.modalidade deve ser eletronica ou fisica.',
    { informado: modalidade, aceitos: MODALIDADES },
  );
}

const plataformaId = pick(certidao.plataformaId, certidao.plataforma_id);
if (!plataformaId) {
  return erro(400, 'plataforma_id_ausente', 'certidao.plataformaId é obrigatório.', null);
}

const cartorioCns = pick(certidao.cartorio_cns, certidao.cartorioCns);
if (!cartorioCns) {
  return erro(400, 'cartorio_cns_ausente', 'certidao.cartorio_cns é obrigatório.', null);
}

const idrcToken = resolveIdrcToken();
const baseUrl = resolveBaseUrl();
const createUrl = baseUrl + '/api/v1.0/certificate-json';

const upstreamBody = {
  certidao: { ...certidao, tipo_registro: tipoRegistro },
  registro,
};

if (tipoRegistro === 'inteiro_teor') {
  upstreamBody.certidao.tipo_certidao = tipoCertidao;
}
if (modalidade) {
  upstreamBody.certidao.modalidade = modalidade;
}

const meta = {
  ambiente: 'homologacao',
  baseUrl,
  endpoint: '/api/v1.0/certificate-json',
  tipo_registro: tipoRegistro,
  token_configurado: Boolean(idrcToken),
  receivedAt: new Date().toISOString(),
  source: 'n8n-onrcpn-certificate-json-create',
};

if (!idrcToken) {
  meta.aviso_token = 'ONRCPN_IDRC_TOKEN ausente — upstream retornará 401 até credencial IdRC ser configurada';
}

return [{
  json: {
    valid: true,
    createUrl,
    idrcToken: idrcToken || '',
    upstreamBody,
    meta,
  },
}];
`,
    };

    @node({
        id: 'a1b20001-0001-4000-8000-000000000003',
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
                    id: 'cond-onrcpn-cert-create-valido',
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
        id: 'a1b20001-0001-4000-8000-000000000004',
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
        id: 'a1b20001-0001-4000-8000-000000000005',
        name: 'Certificate Json Create ONRCPN',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [840, 180],
        onError: 'continueRegularOutput',
    })
    CertificateJsonCreateOnrcpn = {
        method: 'POST',
        url: '={{ $json.createUrl }}',
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
                    value: '={{ $json.idrcToken ? "Bearer " + $json.idrcToken : "" }}',
                },
            ],
        },
        sendBody: true,
        jsonBody: '={{ JSON.stringify($json.upstreamBody) }}',
        contentType: 'json',
        options: {},
    };

    @node({
        id: 'a1b20001-0001-4000-8000-000000000006',
        name: 'Build Certificate Json Create Response',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1060, 180],
    })
    BuildCertificateJsonCreateResponse = {
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
  const rawMessage = errorObject?.message ?? 'Erro desconhecido ao criar certidao na API ONRCPN.';
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
        endpoint: meta.endpoint ?? '/api/v1.0/certificate-json',
      },
    },
  };
}

if (httpResult.error) {
  return [{ json: normalizeHttpError(httpResult.error) }];
}

const data = httpResult;
const upstreamStatus = Number(data.statusCode ?? data.status ?? 201);
const statusCode = upstreamStatus >= 100 && upstreamStatus < 600 ? upstreamStatus : 201;
const sucesso = data.success === true;

if (!sucesso) {
  const businessStatus = statusCode === 401 ? 401
    : statusCode === 403 ? 403
    : statusCode === 404 ? 404
    : statusCode >= 400 && statusCode < 500 ? 422
    : statusCode >= 500 ? 502
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

const okStatus = statusCode === 201 ? 201 : 200;

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
        id: 'a1b20001-0001-4000-8000-000000000007',
        name: 'Return Certificate Json Create Response',
        type: 'n8n-nodes-base.respondToWebhook',
        version: 1.5,
        position: [1280, 300],
    })
    ReturnCertificateJsonCreateResponse = {
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
        this.ReceiveOnrcpnCertificateJsonCreate.out(0).to(this.ValidarEntrada.in(0));
        this.ValidarEntrada.out(0).to(this.EntradaValida.in(0));
        this.EntradaValida.out(0).to(this.CertificateJsonCreateOnrcpn.in(0));
        this.EntradaValida.out(1).to(this.RespostaErroEntrada.in(0));
        this.CertificateJsonCreateOnrcpn.out(0).to(this.BuildCertificateJsonCreateResponse.in(0));
        this.BuildCertificateJsonCreateResponse.out(0).to(this.ReturnCertificateJsonCreateResponse.in(0));
        this.RespostaErroEntrada.out(0).to(this.ReturnCertificateJsonCreateResponse.in(0));
    }
}
