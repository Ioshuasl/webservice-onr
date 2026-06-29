import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : [AUTCNIB-4] (cnib) ResponderOrdem - Ordem
// Nodes   : 7  |  Connections: 7
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// ReceiveCnibResponderOrdem          webhook                    [creds]
// ValidarEntrada                     code
// EntradaValida                      if
// RespostaErroEntrada                code
// ResponderOrdemCnib                 httpRequest                [onError→regular]
// BuildResponderResponse             code
// ReturnResponderResponse            respondToWebhook
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// ReceiveCnibResponderOrdem
//    → ValidarEntrada
//      → EntradaValida
//        → ResponderOrdemCnib
//          → BuildResponderResponse
//            → ReturnResponderResponse
//       .out(1) → RespostaErroEntrada
//          → ReturnResponderResponse (↩ loop)
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'hdWyT41QufksSxRa',
    name: '[AUTCNIB-4] (cnib) ResponderOrdem - Ordem',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class Autcnib4CnibResponderordemOrdemWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'c1430004-0001-4000-8000-000000000001',
        webhookId: 'c1430004-0001-4000-8000-000000000011',
        name: 'Receive CNIB Responder Ordem',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 300],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    ReceiveCnibResponderOrdem = {
        httpMethod: 'POST',
        path: 'cnib/ordem/responder',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'c1430004-0001-4000-8000-000000000002',
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

const TIPOS_MATRICULA_VALIDOS = new Set([22, 24, 25, 26, 27]);
const TIPOS_COM_NUMERO_MATRICULA = new Set([22, 24, 25, 27]);

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

function resolveInteger(value) {
  if (value === undefined || value === null || value === '') return undefined;
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

const protocolo = normalizeNull(body.protocolo);
if (protocolo === null || String(protocolo).trim() === '') {
  return erro(
    422,
    'protocolo_ausente',
    'Informe protocolo da ordem de indisponibilidade.',
    null,
  );
}

const tipoMatricula = resolveInteger(body.tipo_matricula ?? body.tipoMatricula);
if (tipoMatricula === undefined) {
  return erro(
    422,
    'tipo_matricula_ausente',
    'Informe tipo_matricula como inteiro (22, 24, 25, 26 ou 27).',
    { aceitos: [22, 24, 25, 26, 27] },
  );
}
if (!TIPOS_MATRICULA_VALIDOS.has(tipoMatricula)) {
  return erro(
    422,
    'tipo_matricula_invalido',
    'tipo_matricula deve ser 22, 24, 25, 26 ou 27.',
    { informado: tipoMatricula, aceitos: [22, 24, 25, 26, 27] },
  );
}

const cpfCnpj = normalizeNull(body.cpf_cnpj ?? body.cpfCnpj);
if (cpfCnpj === null || String(cpfCnpj).trim() === '') {
  return erro(
    422,
    'cpf_cnpj_ausente',
    'Informe cpf_cnpj da parte indisponibilizada.',
    null,
  );
}

const numeroMatricula = normalizeNull(body.numero_matricula ?? body.numeroMatricula);
const numeroInscricao = normalizeNull(body.numero_inscricao ?? body.numeroInscricao);
const bensDetalhe = normalizeNull(
  body.bens_detalhe ?? body.bensDetalhe ?? body.bens_detalhes ?? body.bensDetalhes,
);
const bensParteCpfCnpj = normalizeNull(body.bens_parte_cpf_cnpj ?? body.bensParteCpfCnpj);
const bensParteNomeRazao = normalizeNull(body.bens_parte_nome_razao ?? body.bensParteNomeRazao);

if (TIPOS_COM_NUMERO_MATRICULA.has(tipoMatricula)) {
  if (numeroMatricula === null || String(numeroMatricula).trim() === '') {
    return erro(
      422,
      'numero_matricula_ausente',
      'numero_matricula e obrigatorio para tipo_matricula ' + tipoMatricula + '.',
      { tipo_matricula: tipoMatricula },
    );
  }
}

if (tipoMatricula === 24) {
  if (numeroInscricao === null || String(numeroInscricao).trim() === '') {
    return erro(
      422,
      'numero_inscricao_ausente',
      'numero_inscricao e obrigatorio para tipo_matricula 24 (inscricao).',
      { tipo_matricula: 24 },
    );
  }
}

if (tipoMatricula === 26) {
  const faltando = [];
  if (bensDetalhe === null || String(bensDetalhe).trim() === '') faltando.push('bens_detalhe');
  if (bensParteCpfCnpj === null || String(bensParteCpfCnpj).trim() === '') faltando.push('bens_parte_cpf_cnpj');
  if (bensParteNomeRazao === null || String(bensParteNomeRazao).trim() === '') faltando.push('bens_parte_nome_razao');
  if (faltando.length > 0) {
    return erro(
      422,
      'campos_bens_ausentes',
      'Para tipo_matricula 26 (bens), informe: ' + faltando.join(', ') + '.',
      { tipo_matricula: 26, campos_obrigatorios: ['bens_detalhe', 'bens_parte_cpf_cnpj', 'bens_parte_nome_razao'] },
    );
  }
}

const upstreamBody = {
  cpf_usuario: cpfUsuario,
  protocolo: String(protocolo).trim(),
  tipo_matricula: tipoMatricula,
  cpf_cnpj: String(cpfCnpj).trim(),
  numero_matricula: numeroMatricula !== null ? String(numeroMatricula).trim() : null,
  numero_inscricao: numeroInscricao !== null ? String(numeroInscricao).trim() : null,
  bens_detalhe: bensDetalhe !== null ? String(bensDetalhe).trim() : null,
  bens_parte_cpf_cnpj: bensParteCpfCnpj !== null ? String(bensParteCpfCnpj).trim() : null,
  bens_parte_nome_razao: bensParteNomeRazao !== null ? String(bensParteNomeRazao).trim() : null,
};

const baseUrl = amb.baseUrl.replace(/\\/$/, '');
const responderUrl = baseUrl + '/api/ordem/responder';

return [{
  json: {
    valid: true,
    responderUrl,
    accessToken,
    upstreamBody,
    meta: {
      ambiente: amb.key,
      baseUrl,
      endpoint: '/api/ordem/responder',
      tipo_matricula: tipoMatricula,
      receivedAt: new Date().toISOString(),
      source: 'n8n-cnib-responder-ordem',
    },
  },
}];
`,
    };

    @node({
        id: 'c1430004-0001-4000-8000-000000000003',
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
                    id: 'cond-cnib-responder-valido',
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
        id: 'c1430004-0001-4000-8000-000000000004',
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
        id: 'c1430004-0001-4000-8000-000000000005',
        name: 'Responder Ordem CNIB',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [840, 180],
        onError: 'continueRegularOutput',
    })
    ResponderOrdemCnib = {
        method: 'POST',
        url: '={{ $json.responderUrl }}',
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
        id: 'c1430004-0001-4000-8000-000000000006',
        name: 'Build Responder Response',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1060, 180],
    })
    BuildResponderResponse = {
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
  const rawMessage = errorObject?.message ?? 'Erro desconhecido ao responder ordem na API CNIB.';
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
        endpoint: meta.endpoint ?? '/api/ordem/responder',
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
        id: 'c1430004-0001-4000-8000-000000000007',
        name: 'Return Responder Response',
        type: 'n8n-nodes-base.respondToWebhook',
        version: 1.5,
        position: [1280, 300],
    })
    ReturnResponderResponse = {
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
        this.ReceiveCnibResponderOrdem.out(0).to(this.ValidarEntrada.in(0));
        this.ValidarEntrada.out(0).to(this.EntradaValida.in(0));
        this.EntradaValida.out(0).to(this.ResponderOrdemCnib.in(0));
        this.EntradaValida.out(1).to(this.RespostaErroEntrada.in(0));
        this.ResponderOrdemCnib.out(0).to(this.BuildResponderResponse.in(0));
        this.BuildResponderResponse.out(0).to(this.ReturnResponderResponse.in(0));
        this.RespostaErroEntrada.out(0).to(this.ReturnResponderResponse.in(0));
    }
}
