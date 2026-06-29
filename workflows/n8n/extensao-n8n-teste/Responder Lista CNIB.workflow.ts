import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : [AUTCNIB-5] (cnib) ResponderLista - Ordem
// Nodes   : 7  |  Connections: 7
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// ReceiveCnibResponderLista          webhook                    [creds]
// ValidarEntrada                     code
// EntradaValida                      if
// RespostaErroEntrada                code
// ResponderListaCnib                 httpRequest                [onError→regular]
// BuildResponderListaResponse        code
// ReturnResponderListaResponse       respondToWebhook
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// ReceiveCnibResponderLista
//    → ValidarEntrada
//      → EntradaValida
//        → ResponderListaCnib
//          → BuildResponderListaResponse
//            → ReturnResponderListaResponse
//       .out(1) → RespostaErroEntrada
//          → ReturnResponderListaResponse (↩ loop)
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'mjhtgURHIEY90sah',
    name: '[AUTCNIB-5] (cnib) ResponderLista - Ordem',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class Autcnib5CnibResponderlistaOrdemWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'b8b29e2d-ca9f-439e-8645-92c2fd64f96c',
        webhookId: 'c1430005-0001-4000-8000-000000000011',
        name: 'Receive CNIB Responder Lista',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 300],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    ReceiveCnibResponderLista = {
        httpMethod: 'POST',
        path: 'cnib/ordem/responder/lista',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: '5075a97f-a827-4728-895d-17f5a5357bfe',
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

function validarItemBem(raw, index) {
  const protocolo = normalizeNull(raw.protocolo);
  if (protocolo === null || String(protocolo).trim() === '') {
    return {
      ok: false,
      status: 422,
      code: 'protocolo_ausente',
      message: 'Informe protocolo da ordem de indisponibilidade no item bens[' + index + '].',
      technical: { indice: index },
    };
  }

  const tipoMatricula = resolveInteger(raw.tipo_matricula ?? raw.tipoMatricula);
  if (tipoMatricula === undefined) {
    return {
      ok: false,
      status: 422,
      code: 'tipo_matricula_ausente',
      message: 'Informe tipo_matricula como inteiro (22, 24, 25, 26 ou 27) no item bens[' + index + '].',
      technical: { indice: index, aceitos: [22, 24, 25, 26, 27] },
    };
  }
  if (!TIPOS_MATRICULA_VALIDOS.has(tipoMatricula)) {
    return {
      ok: false,
      status: 422,
      code: 'tipo_matricula_invalido',
      message: 'tipo_matricula deve ser 22, 24, 25, 26 ou 27 no item bens[' + index + '].',
      technical: { indice: index, informado: tipoMatricula, aceitos: [22, 24, 25, 26, 27] },
    };
  }

  const cpfCnpj = normalizeNull(raw.cpf_cnpj ?? raw.cpfCnpj);
  if (cpfCnpj === null || String(cpfCnpj).trim() === '') {
    return {
      ok: false,
      status: 422,
      code: 'cpf_cnpj_ausente',
      message: 'Informe cpf_cnpj da parte indisponibilizada no item bens[' + index + '].',
      technical: { indice: index },
    };
  }

  const numeroMatricula = normalizeNull(raw.numero_matricula ?? raw.numeroMatricula);
  const numeroInscricao = normalizeNull(raw.numero_inscricao ?? raw.numeroInscricao);
  const bensDetalhe = normalizeNull(
    raw.bens_detalhe ?? raw.bensDetalhe ?? raw.bens_detalhes ?? raw.bensDetalhes,
  );
  const bensParteCpfCnpj = normalizeNull(raw.bens_parte_cpf_cnpj ?? raw.bensParteCpfCnpj);
  const bensParteNomeRazao = normalizeNull(raw.bens_parte_nome_razao ?? raw.bensParteNomeRazao);

  if (TIPOS_COM_NUMERO_MATRICULA.has(tipoMatricula)) {
    if (numeroMatricula === null || String(numeroMatricula).trim() === '') {
      return {
        ok: false,
        status: 422,
        code: 'numero_matricula_ausente',
        message: 'numero_matricula e obrigatorio para tipo_matricula ' + tipoMatricula + ' no item bens[' + index + '].',
        technical: { indice: index, tipo_matricula: tipoMatricula },
      };
    }
  }

  if (tipoMatricula === 24) {
    if (numeroInscricao === null || String(numeroInscricao).trim() === '') {
      return {
        ok: false,
        status: 422,
        code: 'numero_inscricao_ausente',
        message: 'numero_inscricao e obrigatorio para tipo_matricula 24 no item bens[' + index + '].',
        technical: { indice: index, tipo_matricula: 24 },
      };
    }
  }

  if (tipoMatricula === 26) {
    const faltando = [];
    if (bensDetalhe === null || String(bensDetalhe).trim() === '') faltando.push('bens_detalhe');
    if (bensParteCpfCnpj === null || String(bensParteCpfCnpj).trim() === '') faltando.push('bens_parte_cpf_cnpj');
    if (bensParteNomeRazao === null || String(bensParteNomeRazao).trim() === '') faltando.push('bens_parte_nome_razao');
    if (faltando.length > 0) {
      return {
        ok: false,
        status: 422,
        code: 'campos_bens_ausentes',
        message: 'Para tipo_matricula 26 (bens) no item bens[' + index + '], informe: ' + faltando.join(', ') + '.',
        technical: { indice: index, tipo_matricula: 26, campos_obrigatorios: ['bens_detalhe', 'bens_parte_cpf_cnpj', 'bens_parte_nome_razao'] },
      };
    }
  }

  return {
    ok: true,
    item: {
      protocolo: String(protocolo).trim(),
      tipo_matricula: tipoMatricula,
      cpf_cnpj: String(cpfCnpj).trim(),
      numero_matricula: numeroMatricula !== null ? String(numeroMatricula).trim() : null,
      numero_inscricao: numeroInscricao !== null ? String(numeroInscricao).trim() : null,
      bens_detalhe: bensDetalhe !== null ? String(bensDetalhe).trim() : null,
      bens_parte_cpf_cnpj: bensParteCpfCnpj !== null ? String(bensParteCpfCnpj).trim() : null,
      bens_parte_nome_razao: bensParteNomeRazao !== null ? String(bensParteNomeRazao).trim() : null,
    },
  };
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

const rawBens = body.bens;
if (!Array.isArray(rawBens) || rawBens.length === 0) {
  return erro(
    422,
    'bens_ausente',
    'Informe bens como array nao vazio com pelo menos um item.',
    { esperado: 'bens: [{ protocolo, tipo_matricula, cpf_cnpj, ... }]' },
  );
}

const bensValidados = [];
for (let i = 0; i < rawBens.length; i++) {
  const resultado = validarItemBem(rawBens[i] ?? {}, i);
  if (!resultado.ok) {
    return erro(resultado.status, resultado.code, resultado.message, resultado.technical);
  }
  bensValidados.push(resultado.item);
}

const upstreamBody = {
  cpf_usuario: cpfUsuario,
  bens: bensValidados,
};

const baseUrl = amb.baseUrl.replace(/\\/$/, '');
const responderListaUrl = baseUrl + '/api/ordem/responder/lista';

return [{
  json: {
    valid: true,
    responderListaUrl,
    accessToken,
    upstreamBody,
    meta: {
      ambiente: amb.key,
      baseUrl,
      endpoint: '/api/ordem/responder/lista',
      quantidade_bens: bensValidados.length,
      receivedAt: new Date().toISOString(),
      source: 'n8n-cnib-responder-lista',
    },
  },
}];
`,
    };

    @node({
        id: '56ab78b9-a33e-4008-af0d-ff19b33f57a5',
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
                    id: 'cond-cnib-responder-lista-valido',
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
        id: 'ddf29e05-5d59-408f-ae93-83b572823604',
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
        id: 'c71e75bf-0367-4147-bebf-650b445b87c6',
        name: 'Responder Lista CNIB',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [840, 180],
        onError: 'continueRegularOutput',
    })
    ResponderListaCnib = {
        method: 'POST',
        url: '={{ $json.responderListaUrl }}',
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
        id: '21c8dacf-205f-4142-b86b-4c59dce1fd9e',
        name: 'Build Responder Lista Response',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1060, 180],
    })
    BuildResponderListaResponse = {
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
  const rawMessage = errorObject?.message ?? 'Erro desconhecido ao responder lista de ordens na API CNIB.';
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
        endpoint: meta.endpoint ?? '/api/ordem/responder/lista',
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
        id: '1e7b2efe-36b7-4ecb-81f2-03ca900621ba',
        name: 'Return Responder Lista Response',
        type: 'n8n-nodes-base.respondToWebhook',
        version: 1.5,
        position: [1280, 300],
    })
    ReturnResponderListaResponse = {
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
        this.ReceiveCnibResponderLista.out(0).to(this.ValidarEntrada.in(0));
        this.ValidarEntrada.out(0).to(this.EntradaValida.in(0));
        this.EntradaValida.out(0).to(this.ResponderListaCnib.in(0));
        this.EntradaValida.out(1).to(this.RespostaErroEntrada.in(0));
        this.ResponderListaCnib.out(0).to(this.BuildResponderListaResponse.in(0));
        this.BuildResponderListaResponse.out(0).to(this.ReturnResponderListaResponse.in(0));
        this.RespostaErroEntrada.out(0).to(this.ReturnResponderListaResponse.in(0));
    }
}
