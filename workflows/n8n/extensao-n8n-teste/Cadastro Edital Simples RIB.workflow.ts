import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : [AUTORIB-17] (rib) CadastroEditalSimples - RIB
// Nodes   : 7  |  Connections: 7
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// ReceiveRibCadastroEditalSimples    webhook                    [creds]
// ValidarEntrada                     code
// EntradaValida                      if
// RespostaErroEntrada                code
// CadastroEditalSimplesRib           httpRequest                [onError→regular]
// BuildCadastroEditalResponse        code
// ReturnCadastroEditalResponse       respondToWebhook
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// ReceiveRibCadastroEditalSimples
//    → ValidarEntrada
//      → EntradaValida
//        → CadastroEditalSimplesRib
//          → BuildCadastroEditalResponse
//            → ReturnCadastroEditalResponse
//       .out(1) → RespostaErroEntrada
//          → ReturnCadastroEditalResponse (↩ loop)
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'xTiINK2TQ7WswSrD',
    name: '[AUTORIB-17] (rib) CadastroEditalSimples - RIB',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class Autorib17RibCadastroeditalsimplesRibWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'a107b1c2-d3e4-5f6a-7b8c-9d0e1f2a3b4c',
        webhookId: 'b107c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6e',
        name: 'Receive RIB Cadastro Edital Simples',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 300],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    ReceiveRibCadastroEditalSimples = {
        httpMethod: 'POST',
        path: 'rib/edital/envio',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'c107d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
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
  producao: { key: 'producao', baseUrl: () => pick($env.RIB_API_BASE_URL, 'https://api.registrodeimoveis.org.br') },
  homologacao: { key: 'homologacao', baseUrl: () => pick($env.RIB_API_BASE_URL_HML, 'https://testes-api.registrodeimoveis.org.br') },
};

const AMBIENTE_ALIASES = {
  producao: 'producao', prod: 'producao', production: 'producao',
  homologacao: 'homologacao', homolog: 'homologacao', hml: 'homologacao', testes: 'homologacao',
};

const PROXY_ONLY_KEYS = new Set(['ambiente', 'access_token', 'accessToken', 'token']);

const ROOT_ALIASES = {
  tipo_edital: 'tipoEdital',
  dados_serventia: 'dadosServentia',
  numero_matricula: 'numeroMatricula',
  numero_protocolo: 'numeroProtocolo',
  numero_ato: 'numeroAto',
  texto_edital: 'textoEdital',
  primeiro_requerente: 'primeiroRequerente',
  dados_contrato: 'dadosContrato',
};

function resolveAmbiente() {
  const raw = pick(query.ambiente, body.ambiente, header('x-ambiente'), $env.RIB_API_AMBIENTE, 'producao').toLowerCase();
  const key = AMBIENTE_ALIASES[raw];
  if (!key) return { invalid: true, informado: raw };
  const cfg = AMBIENTES_RIB[key];
  return { key: cfg.key, baseUrl: cfg.baseUrl() };
}

function resolveAccessToken() {
  const ribHeader = pick(header('x-rib-access-token'), header('X-RIB-Access-Token'));
  if (ribHeader) return ribHeader;
  const authHeader = pick(header('authorization'), header('Authorization'));
  const bearerMatch = authHeader.match(/^Bearer\\s+(.+)$/i);
  if (bearerMatch) return bearerMatch[1].trim();
  return pick(query.access_token, query.accessToken, query.token, body.access_token, body.accessToken, body.token);
}

function erro(status, code, message, technical) {
  const response = { sucesso: false, codigo_erro: code, mensagem_erro: message, sistema: 'RIB' };
  if (technical) response.detalhe_tecnico = technical;
  return [{ json: { valid: false, statusCode: status, response } }];
}

function normalizeRootBody(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const source = raw.edital && typeof raw.edital === 'object' && !Array.isArray(raw.edital)
    ? { ...raw, ...raw.edital }
    : raw;
  const out = {};
  for (const [key, value] of Object.entries(source)) {
    if (PROXY_ONLY_KEYS.has(key)) continue;
    if (key === 'edital') continue;
    out[ROOT_ALIASES[key] ?? key] = value;
  }
  return out;
}

function validateIntimado(item, index) {
  if (!item || typeof item !== 'object' || Array.isArray(item)) {
    return { ok: false, code: 'intimado_invalido', message: 'intimados[' + index + '] deve ser objeto.' };
  }
  if (!pick(item.nome)) {
    return { ok: false, code: 'intimado_nome_ausente', message: 'intimados[' + index + '].nome e obrigatorio.' };
  }
  const doc = pick(item.documento);
  const docDesconhecido = item.documentoDesconhecido === true || item.documento_desconhecido === true;
  if (!doc && !docDesconhecido) {
    return {
      ok: false,
      code: 'intimado_documento_ausente',
      message: 'intimados[' + index + ']: informe documento ou documentoDesconhecido.',
    };
  }
  const endereco = item.endereco;
  if (!endereco || typeof endereco !== 'object' || Array.isArray(endereco)) {
    return { ok: false, code: 'intimado_endereco_ausente', message: 'intimados[' + index + '].endereco e obrigatorio.' };
  }
  return { ok: true };
}

function validateDadosServentia(dadosServentia) {
  if (!dadosServentia || typeof dadosServentia !== 'object' || Array.isArray(dadosServentia)) {
    return { ok: false, code: 'dados_serventia_ausente', message: 'dadosServentia e obrigatorio.' };
  }
  if (!pick(dadosServentia.cns)) {
    return { ok: false, code: 'cns_ausente', message: 'dadosServentia.cns e obrigatorio.' };
  }
  if (!pick(dadosServentia.denominacao)) {
    return { ok: false, code: 'denominacao_ausente', message: 'dadosServentia.denominacao e obrigatorio.' };
  }
  return { ok: true };
}

function validateEditalBody(payload) {
  if (payload.tipoEdital === undefined || payload.tipoEdital === null || payload.tipoEdital === '') {
    return { ok: false, code: 'tipo_edital_ausente', message: 'tipoEdital e obrigatorio (consulte AUTORIB-13 / RFE-01).' };
  }
  if (typeof payload.tipoEdital !== 'number' || !Number.isFinite(payload.tipoEdital)) {
    return { ok: false, code: 'tipo_edital_invalido', message: 'tipoEdital deve ser numerico.' };
  }
  if (!Array.isArray(payload.intimados) || payload.intimados.length === 0) {
    return { ok: false, code: 'intimados_invalido', message: 'intimados deve ser um array nao vazio.' };
  }
  for (let i = 0; i < payload.intimados.length; i++) {
    const intimado = validateIntimado(payload.intimados[i], i);
    if (!intimado.ok) return intimado;
  }
  const serventia = validateDadosServentia(payload.dadosServentia);
  if (!serventia.ok) return serventia;
  return { ok: true };
}

const amb = resolveAmbiente();
if (amb.invalid) {
  return erro(422, 'ambiente_invalido', 'ambiente deve ser producao ou homologacao.', { ambiente: amb.informado });
}

const accessToken = resolveAccessToken();
if (!accessToken) {
  return erro(422, 'access_token_ausente', 'Informe X-RIB-Access-Token ou access_token.', null);
}

const payload = normalizeRootBody(body);
if (!payload) {
  return erro(422, 'body_invalido', 'Envie JSON com os campos do edital simples (RFS-01).', null);
}

const edital = validateEditalBody(payload);
if (!edital.ok) {
  return erro(422, edital.code, edital.message, edital.technical ?? null);
}

const baseUrl = amb.baseUrl.replace(/\\/$/, '');
return [{
  json: {
    valid: true,
    upstreamUrl: baseUrl + '/v1/edital',
    accessToken,
    upstreamBody: payload,
    meta: {
      ambiente: amb.key,
      baseUrl,
      endpoint: '/v1/edital',
      receivedAt: new Date().toISOString(),
      source: 'n8n-rib-cadastro-edital-simples',
    },
    errorDefaultMsg: 'Erro ao cadastrar edital simples na API RIB.',
  },
}];
`,
    };

    @node({
        id: 'd107e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
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
                    id: 'cond-rib-cadastro-edital-valido',
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
        id: 'e107f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a',
        name: 'Resposta Erro Entrada',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [840, 480],
    })
    RespostaErroEntrada = {
        mode: 'runOnceForAllItems',
        language: 'javaScript',
        jsCode: 'return [{ json: { statusCode: items[0].json.statusCode || 422, response: items[0].json.response } }];',
    };

    @node({
        id: 'f107a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b',
        name: 'Cadastro Edital Simples RIB',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [840, 180],
        onError: 'continueRegularOutput',
    })
    CadastroEditalSimplesRib = {
        method: 'POST',
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
        id: 'a107b8c9-d0e1-2f3a-4b5c-6d7e8f9a0b1c',
        name: 'Build Cadastro Edital Response',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1060, 180],
    })
    BuildCadastroEditalResponse = {
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
  try { return JSON.parse(value); } catch { return null; }
}

function normalizeHttpError(errorObject, meta, defaultMsg) {
  const rawMessage = errorObject?.message ?? defaultMsg;
  const status = Number(errorObject?.status ?? errorObject?.httpCode ?? rawMessage.match(/^\\s*(\\d{3})\\s*-/)?.[1] ?? 502);
  const parsed = parseJsonSafe(errorObject?.response?.body)
    ?? parseJsonSafe(errorObject?.response?.data)
    ?? (typeof errorObject?.response?.body === 'object' ? errorObject.response.body : null);

  return {
    statusCode: status === 401 ? 401 : (status || 502),
    response: {
      sucesso: false,
      codigo_erro: parsed?.codigo ?? 'rib_http_error',
      mensagem_erro: parsed?.descricao ?? parsed?.mensagem ?? rawMessage,
      campos: parsed?.campos ?? null,
      sistema: 'RIB',
      ambiente: meta.ambiente ?? null,
      meta,
      detalhe_tecnico: { name: errorObject?.name ?? null, code: errorObject?.code ?? null, status: status || null },
    },
  };
}

if (httpResult.error) {
  return [{ json: normalizeHttpError(httpResult.error, meta, entrada.errorDefaultMsg ?? 'Erro na API RIB.') }];
}

const data = httpResult;
return [{
  json: {
    statusCode: 201,
    response: {
      sucesso: true,
      status: data.status ?? null,
      data_status: data.dataStatus ?? null,
      url_pagamento: data.urlPagamento ?? null,
      valor: data.valor ?? null,
      total_publicacoes: data.totalPublicacoes ?? null,
      editais_cadastrados: data.editaisCadastrados ?? [],
      alertas: data.alertas ?? null,
      resultado: data,
      ambiente: meta.ambiente ?? null,
      meta,
    },
  },
}];
`,
    };

    @node({
        id: 'b107c9d0-e1f2-3a4b-5c6d-7e8f9a0b1c2d',
        name: 'Return Cadastro Edital Response',
        type: 'n8n-nodes-base.respondToWebhook',
        version: 1.5,
        position: [1280, 300],
    })
    ReturnCadastroEditalResponse = {
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
        this.ReceiveRibCadastroEditalSimples.out(0).to(this.ValidarEntrada.in(0));
        this.ValidarEntrada.out(0).to(this.EntradaValida.in(0));
        this.EntradaValida.out(0).to(this.CadastroEditalSimplesRib.in(0));
        this.EntradaValida.out(1).to(this.RespostaErroEntrada.in(0));
        this.CadastroEditalSimplesRib.out(0).to(this.BuildCadastroEditalResponse.in(0));
        this.BuildCadastroEditalResponse.out(0).to(this.ReturnCadastroEditalResponse.in(0));
        this.RespostaErroEntrada.out(0).to(this.ReturnCadastroEditalResponse.in(0));
    }
}
