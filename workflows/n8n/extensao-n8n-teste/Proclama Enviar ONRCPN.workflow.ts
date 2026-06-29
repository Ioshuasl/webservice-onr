import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : [AUTONRCPN-12] (onrcpn) ProclamaEnviar - e-Proclamas
// Nodes   : 7  |  Connections: 7
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// ReceiveOnrcpnProclamaEnviar        webhook                    [creds]
// ValidarEntrada                     code
// EntradaValida                      if
// RespostaErroEntrada                code
// ProclamaEnviarOnrcpn               httpRequest                [onError→regular]
// BuildProclamaEnviarResponse        code
// ReturnProclamaEnviarResponse       respondToWebhook
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// ReceiveOnrcpnProclamaEnviar
//    → ValidarEntrada
//      → EntradaValida
//        → ProclamaEnviarOnrcpn
//          → BuildProclamaEnviarResponse
//            → ReturnProclamaEnviarResponse
//       .out(1) → RespostaErroEntrada
//          → ReturnProclamaEnviarResponse (↩ loop)
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: '6THLGlwxk4NbBAwa',
    name: '[AUTONRCPN-12] (onrcpn) ProclamaEnviar - e-Proclamas',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class Autonrcpn12OnrcpnProclamaenviarEProclamasWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'a1b20012-0001-4000-8000-000000000001',
        webhookId: 'a1b20012-0001-4000-8000-000000000011',
        name: 'Receive ONRCPN Proclama Enviar',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 300],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    ReceiveOnrcpnProclamaEnviar = {
        httpMethod: 'POST',
        path: 'onrcpn/proclama/enviar',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'a1b20012-0001-4000-8000-000000000002',
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

const TIPOS_CASAMENTO = ['civil', 'religioso', 'conversao', 'afixacao'];

function resolveBaseUrl() {
  return pick(
    body.base_url,
    body.baseUrl,
    query.base_url,
    query.baseUrl,
    header('x-onrcpn-base-url'),
    header('X-ONRCPN-Base-Url'),
    $env.ONRCPN_PROCLAMA_BASE_URL,
    'https://servicosh.registrocivil.org.br/api/proclama',
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

const cns = pick(body.cns);
if (!cns) {
  return erro(400, 'cns_ausente', 'Informe cns (CNS do cartório emissor) no body.', null);
}

const proclamas = body.proclamas;
if (!Array.isArray(proclamas) || proclamas.length === 0) {
  return erro(400, 'proclamas_ausente', 'Informe proclamas como array não vazio no body.', null);
}

const invalidMatriculas = [];
const invalidTipos = [];

for (let i = 0; i < proclamas.length; i += 1) {
  const proclama = proclamas[i];
  if (!proclama || typeof proclama !== 'object' || Array.isArray(proclama)) {
    invalidMatriculas.push({ indice: i, motivo: 'objeto_invalido' });
    continue;
  }
  const matricula = pick(proclama.matricula);
  if (!matricula) {
    invalidMatriculas.push({ indice: i, motivo: 'matricula_ausente' });
  }
  const tipoCasamento = pick(proclama.tipo_casamento, proclama.tipoCasamento).toLowerCase();
  if (tipoCasamento && !TIPOS_CASAMENTO.includes(tipoCasamento)) {
    invalidTipos.push({ indice: i, informado: tipoCasamento, aceitos: TIPOS_CASAMENTO });
  }
}

if (invalidMatriculas.length > 0) {
  return erro(
    400,
    'matricula_ausente',
    'Cada item de proclamas deve conter matricula.',
    { itens_invalidos: invalidMatriculas },
  );
}

if (invalidTipos.length > 0) {
  return erro(
    400,
    'tipo_casamento_invalido',
    'tipo_casamento deve ser civil, religioso, conversao ou afixacao.',
    { itens_invalidos: invalidTipos },
  );
}

const idrcToken = resolveIdrcToken();
const baseUrl = resolveBaseUrl();
const enviarUrl = baseUrl + '/enviar';

const upstreamBody = {
  cns,
  proclamas: proclamas.map((proclama) => {
    const copy = { ...proclama };
    const tipo = pick(copy.tipo_casamento, copy.tipoCasamento).toLowerCase();
    if (tipo) copy.tipo_casamento = tipo;
    delete copy.tipoCasamento;
    return copy;
  }),
};

const meta = {
  servico: 'e-proclamas',
  ambiente: 'homologacao',
  baseUrl,
  endpoint: '/enviar',
  cns,
  quantidade_proclamas: proclamas.length,
  token_configurado: Boolean(idrcToken),
  auth_required: true,
  receivedAt: new Date().toISOString(),
  source: 'n8n-onrcpn-proclama-enviar',
};

if (!idrcToken) {
  meta.aviso_token = 'ONRCPN_IDRC_TOKEN ausente — upstream retornará 401 até credencial IdRC ser configurada';
}

return [{
  json: {
    valid: true,
    enviarUrl,
    idrcToken: idrcToken || '',
    upstreamBody,
    meta,
    errorDefaultMsg: 'Erro ao enviar lote de proclamas na API e-Proclamas ONRCPN.',
  },
}];
`,
    };

    @node({
        id: 'a1b20012-0001-4000-8000-000000000003',
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
                    id: 'cond-onrcpn-proclama-enviar-valido',
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
        id: 'a1b20012-0001-4000-8000-000000000004',
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
        id: 'a1b20012-0001-4000-8000-000000000005',
        name: 'Proclama Enviar ONRCPN',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [840, 180],
        onError: 'continueRegularOutput',
    })
    ProclamaEnviarOnrcpn = {
        method: 'POST',
        url: '={{ $json.enviarUrl }}',
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
        id: 'a1b20012-0001-4000-8000-000000000006',
        name: 'Build Proclama Enviar Response',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1060, 180],
    })
    BuildProclamaEnviarResponse = {
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
  const trimmed = value.trim();
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed);
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
  const statusCode = status === 401 ? 401
    : status === 403 ? 403
    : status === 404 ? 404
    : status === 503 ? 503
    : (status || 502);

  return {
    statusCode,
    response: {
      sucesso: false,
      codigo_erro: parsed?.codigo ?? parsed?.error ?? 'onrcpn_http_error',
      mensagem_erro: formatMensagens(parsed) ?? rawMessage,
      sistema: 'ONRCPN',
      status_http: statusCode,
      dados: parsed?.proclamas ?? parsed?.data ?? {},
      meta,
      detalhe_tecnico: {
        name: errorObject?.name ?? null,
        code: errorObject?.code ?? null,
        status: status || null,
        endpoint: meta.endpoint ?? '/enviar',
      },
      resposta_api: parsed,
    },
  };
}

function extractPayload(data) {
  const parsed = parseJsonSafe(data?.body) ?? (typeof data?.body === 'object' ? data.body : null);
  if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
    return parsed;
  }
  if (typeof data === 'object' && data && !data.body && (data.status || data.proclamas || data.message)) {
    return data;
  }
  return null;
}

if (httpResult.error) {
  return [{ json: normalizeHttpError(httpResult.error, entrada.errorDefaultMsg ?? 'Erro na API e-Proclamas ONRCPN.') }];
}

const statusCode = Number(httpResult?.statusCode ?? httpResult?.status ?? 200);
const payload = extractPayload(httpResult) ?? {};

if (statusCode >= 400) {
  const businessStatus = statusCode === 401 ? 401
    : statusCode === 403 ? 403
    : statusCode === 404 ? 404
    : statusCode === 503 ? 503
    : statusCode >= 500 ? 502
    : 422;

  return [{
    json: {
      statusCode: businessStatus,
      response: {
        sucesso: false,
        codigo_erro: 'onrcpn_api_error',
        mensagem_erro: formatMensagens(payload) ?? payload?.message ?? 'A API e-Proclamas rejeitou o lote de proclamas.',
        sistema: 'ONRCPN',
        status_http: businessStatus,
        dados: payload?.proclamas ?? {},
        meta,
        resposta_api: payload ?? httpResult,
      },
    },
  }];
}

const upstreamStatus = String(payload?.status ?? '').toLowerCase();
const sucessoNegocio = upstreamStatus === 'success' || (statusCode >= 200 && statusCode < 300 && !upstreamStatus);
const okStatus = statusCode >= 200 && statusCode < 300 ? (statusCode || 200) : 200;
const proclamasResult = payload?.proclamas ?? {};
const temErrosLote = Array.isArray(proclamasResult?.error) && proclamasResult.error.length > 0;
const sucesso = sucessoNegocio && !temErrosLote;

if (!sucesso && temErrosLote) {
  return [{
    json: {
      statusCode: 422,
      response: {
        sucesso: false,
        codigo_erro: 'proclama_lote_parcial',
        mensagem_erro: payload?.message ?? 'Um ou mais proclamas do lote falharam na validação upstream.',
        sistema: 'ONRCPN',
        status_http: 422,
        status: payload?.status ?? 'error',
        message: payload?.message ?? '',
        dados: proclamasResult,
        meta,
        resposta_api: payload,
      },
    },
  }];
}

return [{
  json: {
    statusCode: okStatus,
    response: {
      sucesso: true,
      codigo_erro: 0,
      mensagem_erro: '',
      status_http: okStatus,
      status: payload?.status ?? 'success',
      message: payload?.message ?? '',
      dados: proclamasResult,
      meta,
      resposta_api: payload,
    },
  },
}];
`,
    };

    @node({
        id: 'a1b20012-0001-4000-8000-000000000007',
        name: 'Return Proclama Enviar Response',
        type: 'n8n-nodes-base.respondToWebhook',
        version: 1.5,
        position: [1280, 300],
    })
    ReturnProclamaEnviarResponse = {
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
        this.ReceiveOnrcpnProclamaEnviar.out(0).to(this.ValidarEntrada.in(0));
        this.ValidarEntrada.out(0).to(this.EntradaValida.in(0));
        this.EntradaValida.out(0).to(this.ProclamaEnviarOnrcpn.in(0));
        this.EntradaValida.out(1).to(this.RespostaErroEntrada.in(0));
        this.ProclamaEnviarOnrcpn.out(0).to(this.BuildProclamaEnviarResponse.in(0));
        this.BuildProclamaEnviarResponse.out(0).to(this.ReturnProclamaEnviarResponse.in(0));
        this.RespostaErroEntrada.out(0).to(this.ReturnProclamaEnviarResponse.in(0));
    }
}
