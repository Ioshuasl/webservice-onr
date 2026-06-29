import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : [AUTSEETJGO-13] (see tjgo) CorreicaoAtualizarAcesso - Correição Online
// Nodes   : 7  |  Connections: 7
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// ReceiveSeeTjgoCorreicaoAtualizar   webhook                    [creds]
// ValidarEntrada                     code
// EntradaValida                      if
// RespostaErroEntrada                code
// CorreicaoAtualizarAcessoSeeTjgo    httpRequest                [onError→regular]
// BuildCorreicaoAtualizarResponse    code
// ReturnCorreicaoAtualizarResponse   respondToWebhook
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// ReceiveSeeTjgoCorreicaoAtualizar
//    → ValidarEntrada
//      → EntradaValida
//        → CorreicaoAtualizarAcessoSeeTjgo
//          → BuildCorreicaoAtualizarResponse
//            → ReturnCorreicaoAtualizarResponse
//       .out(1) → RespostaErroEntrada
//          → ReturnCorreicaoAtualizarResponse (↩ loop)
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'TmhJqbRSnFW1FH68',
    name: '[AUTSEETJGO-13] (see tjgo) CorreicaoAtualizarAcesso - Correição Online',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class Autseetjgo13SeeTjgoCorreicaoatualizaracessoCorreicaoOnlineWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'e1f20013-0001-4000-8000-000000000001',
        webhookId: 'e1f20013-0001-4000-8000-000000000011',
        name: 'Receive SEE TJGO Correicao Atualizar',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 300],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    ReceiveSeeTjgoCorreicaoAtualizar = {
        httpMethod: 'POST',
        path: 'see-tjgo/empresas-correicao/atualizar-dados-acesso',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'e1f20013-0001-4000-8000-000000000002',
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

function normalizeNull(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === 'string' && (value.trim() === '' || value.trim().toLowerCase() === 'null')) return null;
  return value;
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

const TIPOS_ACESSO = new Set(['Web', 'Desktop']);

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

const hash = pick(body.hash, $env.SEE_TJGO_HASH_CARTORIO);
const password = pick(body.password);

if (!hash) {
  return erro(
    422,
    'hash_ausente',
    'Informe hash no body ou configure SEE_TJGO_HASH_CARTORIO no n8n.',
    { campo: 'hash' },
  );
}

if (!password) {
  return erro(
    422,
    'password_ausente',
    'Informe password no body.',
    { campo: 'password' },
  );
}

const tipoAcesso = normalizeNull(body.tipo_acesso ?? body.tipoAcesso);
if (tipoAcesso !== null && !TIPOS_ACESSO.has(String(tipoAcesso))) {
  return erro(
    422,
    'tipo_acesso_invalido',
    'tipo_acesso deve ser Web ou Desktop.',
    { informado: tipoAcesso, aceitos: ['Web', 'Desktop'] },
  );
}

const upstreamBody = {
  hash,
  password,
};

const optionalFields = [
  ['username', body.username],
  ['chave_acesso', body.chave_acesso ?? body.chaveAcesso],
  ['tipo_acesso', tipoAcesso],
  ['email_contato', body.email_contato ?? body.emailContato],
  ['telefone_contato', body.telefone_contato ?? body.telefoneContato],
  ['url', body.url],
  ['periodo_acesso', body.periodo_acesso ?? body.periodoAcesso],
];

for (const [key, value] of optionalFields) {
  const normalized = normalizeNull(value);
  if (normalized !== null) {
    upstreamBody[key] = String(normalized);
  }
}

const baseUrl = amb.baseUrl.replace(/\\/$/, '');
const atualizarUrl = baseUrl + '/empresas_correicao/atualizar_dados_acesso';

return [{
  json: {
    valid: true,
    atualizarUrl,
    upstreamBody,
    meta: {
      ambiente: amb.key,
      baseUrl,
      endpoint: '/empresas_correicao/atualizar_dados_acesso',
      receivedAt: new Date().toISOString(),
      source: 'n8n-see-tjgo-correicao-atualizar-acesso',
      auth_required: false,
    },
    errorDefaultMsg: 'Erro ao atualizar dados de acesso na API SEE TJGO (correicao online).',
  },
}];
`,
    };

    @node({
        id: 'e1f20013-0001-4000-8000-000000000003',
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
                    id: 'cond-see-correicao-atualizar-valido',
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
        id: 'e1f20013-0001-4000-8000-000000000004',
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
        id: 'e1f20013-0001-4000-8000-000000000005',
        name: 'Correicao Atualizar Acesso SEE TJGO',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [840, 180],
        onError: 'continueRegularOutput',
    })
    CorreicaoAtualizarAcessoSeeTjgo = {
        method: 'POST',
        url: '={{ $json.atualizarUrl }}',
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
            ],
        },
        sendBody: true,
        jsonBody: '={{ JSON.stringify($json.upstreamBody) }}',
        contentType: 'json',
        options: {},
    };

    @node({
        id: 'e1f20013-0001-4000-8000-000000000006',
        name: 'Build Correicao Atualizar Response',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1060, 180],
    })
    BuildCorreicaoAtualizarResponse = {
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
  const statusCode = status >= 100 && status < 600 ? status : 502;

  return {
    statusCode,
    response: {
      sucesso: false,
      codigo_erro: 'see_http_error',
      mensagem_erro: formatMensagens(parsed) ?? rawMessage,
      sistema: 'SEE TJGO',
      status_http: statusCode,
      ambiente: meta.ambiente ?? null,
      meta,
      detalhe_tecnico: {
        name: errorObject?.name ?? null,
        code: errorObject?.code ?? null,
        status: status || null,
        endpoint: meta.endpoint ?? '/empresas_correicao/atualizar_dados_acesso',
      },
      resposta_api: parsed,
    },
  };
}

function extractPayload(data) {
  const parsed = parseJsonSafe(data?.body) ?? (typeof data?.body === 'object' ? data.body : data);
  if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
    return parsed;
  }
  return null;
}

if (httpResult.error) {
  return [{ json: normalizeHttpError(httpResult.error, entrada.errorDefaultMsg ?? 'Erro na API SEE TJGO.') }];
}

const statusCode = Number(httpResult?.statusCode ?? httpResult?.status ?? 200);
const payload = extractPayload(httpResult) ?? httpResult;

if (statusCode >= 400) {
  return [{
    json: {
      statusCode: statusCode >= 100 && statusCode < 600 ? statusCode : 502,
      response: {
        sucesso: false,
        codigo_erro: 'see_api_error',
        mensagem_erro: formatMensagens(payload) ?? payload?.message ?? 'A API SEE TJGO rejeitou a atualizacao de dados de acesso.',
        message: payload?.message ?? null,
        error: payload?.error ?? null,
        sistema: 'SEE TJGO',
        status_http: statusCode,
        ambiente: meta.ambiente ?? null,
        meta,
        resposta_api: payload,
      },
    },
  }];
}

return [{
  json: {
    statusCode: 200,
    response: {
      sucesso: true,
      status_http: 200,
      message: payload?.message ?? 'Dados atualizados com sucesso!',
      mensagem: payload?.message ?? 'Dados atualizados com sucesso!',
      ambiente: meta.ambiente ?? null,
      meta,
      resposta_api: payload,
    },
  },
}];
`,
    };

    @node({
        id: 'e1f20013-0001-4000-8000-000000000007',
        name: 'Return Correicao Atualizar Response',
        type: 'n8n-nodes-base.respondToWebhook',
        version: 1.5,
        position: [1280, 300],
    })
    ReturnCorreicaoAtualizarResponse = {
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
        this.ReceiveSeeTjgoCorreicaoAtualizar.out(0).to(this.ValidarEntrada.in(0));
        this.ValidarEntrada.out(0).to(this.EntradaValida.in(0));
        this.EntradaValida.out(0).to(this.CorreicaoAtualizarAcessoSeeTjgo.in(0));
        this.EntradaValida.out(1).to(this.RespostaErroEntrada.in(0));
        this.CorreicaoAtualizarAcessoSeeTjgo.out(0).to(this.BuildCorreicaoAtualizarResponse.in(0));
        this.BuildCorreicaoAtualizarResponse.out(0).to(this.ReturnCorreicaoAtualizarResponse.in(0));
        this.RespostaErroEntrada.out(0).to(this.ReturnCorreicaoAtualizarResponse.in(0));
    }
}
