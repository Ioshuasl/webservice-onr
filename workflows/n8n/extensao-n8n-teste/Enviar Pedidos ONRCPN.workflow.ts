import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : [AUTONRCPN-9] (onrcpn) EnviarPedidos - Pedidos
// Nodes   : 7  |  Connections: 7
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// ReceiveOnrcpnPedidosEnviar         webhook                    [creds]
// ValidarEntrada                     code
// EntradaValida                      if
// RespostaErroEntrada                code
// EnviarPedidosOnrcpn                httpRequest                [onError→regular]
// BuildEnviarPedidosResponse         code
// ReturnEnviarPedidosResponse        respondToWebhook
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// ReceiveOnrcpnPedidosEnviar
//    → ValidarEntrada
//      → EntradaValida
//        → EnviarPedidosOnrcpn
//          → BuildEnviarPedidosResponse
//            → ReturnEnviarPedidosResponse
//       .out(1) → RespostaErroEntrada
//          → ReturnEnviarPedidosResponse (↩ loop)
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'bj54E3wFSVjL75zp',
    name: '[AUTONRCPN-9] (onrcpn) EnviarPedidos - Pedidos',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class Autonrcpn9OnrcpnEnviarpedidosPedidosWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'a1b20009-0001-4000-8000-000000000001',
        webhookId: 'a1b20009-0001-4000-8000-000000000011',
        name: 'Receive ONRCPN Pedidos Enviar',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 300],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    ReceiveOnrcpnPedidosEnviar = {
        httpMethod: 'POST',
        path: 'onrcpn/pedidos/enviar',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'a1b20009-0001-4000-8000-000000000002',
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

const MODULOS = ['CRC', 'REG', 'JUD', 'EPR', 'P13', 'RSE', 'EOB'];

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

const numeroPedido = pick(body.numero_pedido, body.numeroPedido, query.numero_pedido);
if (!numeroPedido) {
  return erro(400, 'numero_pedido_ausente', 'Informe numero_pedido no body.', null);
}

const moduloRaw = pick(body.modulo, body.module, query.modulo, query.module);
if (!moduloRaw) {
  return erro(400, 'modulo_ausente', 'Informe modulo no body (CRC, REG, JUD, EPR, P13, RSE ou EOB).', { aceitos: MODULOS });
}

const modulo = moduloRaw.toUpperCase();
if (!MODULOS.includes(modulo)) {
  return erro(
    400,
    'modulo_invalido',
    'modulo deve ser CRC, REG, JUD, EPR, P13, RSE ou EOB.',
    { informado: moduloRaw, aceitos: MODULOS },
  );
}

const idExterno = pick(body.id_externo, body.idExterno, query.id_externo);
if (!idExterno) {
  return erro(400, 'id_externo_ausente', 'Informe id_externo (ID da certidão no cartório) no body.', null);
}

const idVerificador = pick(body.id_verificador, body.idVerificador, query.id_verificador);
if (!idVerificador) {
  return erro(400, 'id_verificador_ausente', 'Informe id_verificador (ID pós-assinatura) no body.', null);
}

const valorEmolumentos = pick(body.valor_emolumentos, body.valorEmolumentos);
if (!valorEmolumentos) {
  return erro(400, 'valor_emolumentos_ausente', 'Informe valor_emolumentos no body (ex.: "1.00").', null);
}

const valorAdicional = pick(body.valor_adicional, body.valorAdicional) || '0.00';
const observacoesEmissao = pick(body.observacoes_emissao, body.observacoesEmissao) || '';

let quantidadeAverbacao = body.quantidade_averbacao ?? body.quantidadeAverbacao ?? null;
if (quantidadeAverbacao !== null && quantidadeAverbacao !== undefined && quantidadeAverbacao !== '') {
  const parsed = Number(quantidadeAverbacao);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return erro(400, 'quantidade_averbacao_invalida', 'quantidade_averbacao deve ser número >= 0 ou null.', { informado: quantidadeAverbacao });
  }
  quantidadeAverbacao = parsed;
} else {
  quantidadeAverbacao = null;
}

const idrcToken = resolveIdrcToken();
const baseUrl = resolveBaseUrl();
const enviarUrl = baseUrl + '/api/v1.0/enviar-pedidos';

const upstreamBody = {
  numero_pedido: numeroPedido,
  modulo,
  quantidade_averbacao: quantidadeAverbacao,
  valor_adicional: valorAdicional,
  valor_emolumentos: valorEmolumentos,
  observacoes_emissao: observacoesEmissao,
  id_externo: idExterno,
  id_verificador: idVerificador,
};

const meta = {
  ambiente: 'homologacao',
  baseUrl,
  endpoint: '/api/v1.0/enviar-pedidos',
  modulo,
  numero_pedido: numeroPedido,
  id_externo: idExterno,
  token_configurado: Boolean(idrcToken),
  receivedAt: new Date().toISOString(),
  source: 'n8n-onrcpn-pedidos-enviar',
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
  },
}];
`,
    };

    @node({
        id: 'a1b20009-0001-4000-8000-000000000003',
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
                    id: 'cond-onrcpn-pedidos-enviar-valido',
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
        id: 'a1b20009-0001-4000-8000-000000000004',
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
        id: 'a1b20009-0001-4000-8000-000000000005',
        name: 'Enviar Pedidos ONRCPN',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [840, 180],
        onError: 'continueRegularOutput',
    })
    EnviarPedidosOnrcpn = {
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
        id: 'a1b20009-0001-4000-8000-000000000006',
        name: 'Build Enviar Pedidos Response',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1060, 180],
    })
    BuildEnviarPedidosResponse = {
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
  const rawMessage = errorObject?.message ?? 'Erro desconhecido ao enviar pedidos na API ONRCPN.';
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
        endpoint: meta.endpoint ?? '/api/v1.0/enviar-pedidos',
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
        dados: { codigo_retorno: data.message ?? null },
        meta,
        resposta_api: data,
      },
    },
  }];
}

return [{
  json: {
    statusCode: 200,
    response: {
      sucesso: true,
      codigo_erro: 0,
      mensagem_erro: '',
      status_http: 200,
      dados: {
        codigo_retorno: data.message ?? null,
      },
      meta,
    },
  },
}];
`,
    };

    @node({
        id: 'a1b20009-0001-4000-8000-000000000007',
        name: 'Return Enviar Pedidos Response',
        type: 'n8n-nodes-base.respondToWebhook',
        version: 1.5,
        position: [1280, 300],
    })
    ReturnEnviarPedidosResponse = {
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
        this.ReceiveOnrcpnPedidosEnviar.out(0).to(this.ValidarEntrada.in(0));
        this.ValidarEntrada.out(0).to(this.EntradaValida.in(0));
        this.EntradaValida.out(0).to(this.EnviarPedidosOnrcpn.in(0));
        this.EntradaValida.out(1).to(this.RespostaErroEntrada.in(0));
        this.EnviarPedidosOnrcpn.out(0).to(this.BuildEnviarPedidosResponse.in(0));
        this.BuildEnviarPedidosResponse.out(0).to(this.ReturnEnviarPedidosResponse.in(0));
        this.RespostaErroEntrada.out(0).to(this.ReturnEnviarPedidosResponse.in(0));
    }
}
