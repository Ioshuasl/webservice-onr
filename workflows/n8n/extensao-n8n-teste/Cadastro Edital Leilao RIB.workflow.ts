import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : [AUTORIB-21] (rib) CadastroEditalLeilao - RIB
// Nodes   : 7  |  Connections: 7
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// ReceiveRibCadastroEditalLeilao     webhook                    [creds]
// ValidarEntrada                     code
// EntradaValida                      if
// RespostaErroEntrada                code
// CadastroEditalLeilaoRib            httpRequest                [onError→regular]
// BuildCadastroEditalResponse        code
// ReturnCadastroEditalResponse       respondToWebhook
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// ReceiveRibCadastroEditalLeilao
//    → ValidarEntrada
//      → EntradaValida
//        → CadastroEditalLeilaoRib
//          → BuildCadastroEditalResponse
//            → ReturnCadastroEditalResponse
//       .out(1) → RespostaErroEntrada
//          → ReturnCadastroEditalResponse (↩ loop)
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'qLFf5nViKJCLKuSs',
    name: '[AUTORIB-21] (rib) CadastroEditalLeilao - RIB',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class Autorib21RibCadastroeditalleilaoRibWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'a111b1c2-d3e4-5f6a-7b8c-9d0e1f2a3b4c',
        webhookId: 'b111c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6e',
        name: 'Receive RIB Cadastro Edital Leilao',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 300],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    ReceiveRibCadastroEditalLeilao = {
        httpMethod: 'POST',
        path: 'rib/edital/leilao/envio',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'c111d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
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
  sumario: 'sumario',
  leilao: 'leilao',
  intimados: 'intimados',
  imoveis: 'imoveis',
  dados_credor: 'dadosCredor',
  informacoes_gerais: 'informacoesGerais',
  exibe_mencao: 'exibeMencao',
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

function isObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

function validateIntimado(item, index) {
  if (!isObject(item)) {
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
  return { ok: true };
}

function validateEnderecoImovel(endereco, prefix) {
  if (!isObject(endereco)) {
    return { ok: false, code: 'endereco_ausente', message: prefix + '.endereco e obrigatorio.' };
  }
  for (const field of ['cep', 'tipoLogradouro', 'logradouro', 'numero', 'bairro', 'cidade', 'estado']) {
    if (!pick(endereco[field])) {
      return { ok: false, code: 'endereco_campo_ausente', message: prefix + '.endereco.' + field + ' e obrigatorio.' };
    }
  }
  return { ok: true };
}

function validateImovel(item, index) {
  if (!isObject(item)) {
    return { ok: false, code: 'imovel_invalido', message: 'imoveis[' + index + '] deve ser objeto.' };
  }
  for (const field of ['numeroLote', 'idImovel', 'numeroMatricula', 'tipoImovel', 'condicoes', 'cns']) {
    if (!pick(item[field])) {
      return { ok: false, code: 'imovel_campo_ausente', message: 'imoveis[' + index + '].' + field + ' e obrigatorio.' };
    }
  }
  const endereco = validateEnderecoImovel(item.endereco, 'imoveis[' + index + ']');
  if (!endereco.ok) return endereco;
  return { ok: true };
}

function validateLeilao(leilao) {
  if (!isObject(leilao)) {
    return { ok: false, code: 'leilao_ausente', message: 'leilao e obrigatorio.' };
  }
  for (const field of ['modalidade', 'modoDisputa', 'tipo']) {
    if (!pick(leilao[field])) {
      return { ok: false, code: 'leilao_campo_ausente', message: 'leilao.' + field + ' e obrigatorio.' };
    }
  }
  if (!Array.isArray(leilao.leiloes) || leilao.leiloes.length === 0) {
    return { ok: false, code: 'leilao_datas_ausente', message: 'leilao.leiloes deve ser um array nao vazio.' };
  }
  for (let i = 0; i < leilao.leiloes.length; i++) {
    const sessao = leilao.leiloes[i];
    if (!isObject(sessao) || !pick(sessao.data) || !pick(sessao.hora)) {
      return { ok: false, code: 'leilao_sessao_invalida', message: 'leilao.leiloes[' + i + '] exige data e hora.' };
    }
  }
  const leiloeiro = leilao.leiloeiro;
  if (!isObject(leiloeiro)) {
    return { ok: false, code: 'leiloeiro_ausente', message: 'leilao.leiloeiro e obrigatorio.' };
  }
  for (const field of ['documento', 'nome', 'numeroInscricao', 'numeroTelefone', 'email']) {
    if (!pick(leiloeiro[field])) {
      return { ok: false, code: 'leiloeiro_campo_ausente', message: 'leilao.leiloeiro.' + field + ' e obrigatorio.' };
    }
  }
  if (!isObject(leilao.preposto)) {
    return { ok: false, code: 'preposto_ausente', message: 'leilao.preposto e obrigatorio (objeto).' };
  }
  return { ok: true };
}

function validateSumario(sumario) {
  if (!isObject(sumario)) {
    return { ok: false, code: 'sumario_ausente', message: 'sumario e obrigatorio.' };
  }
  const publicacao = sumario.publicacao;
  if (!isObject(publicacao)) {
    return { ok: false, code: 'publicacao_ausente', message: 'sumario.publicacao e obrigatorio.' };
  }
  if (!pick(publicacao.numeroPublicacao)) {
    return { ok: false, code: 'numero_publicacao_ausente', message: 'sumario.publicacao.numeroPublicacao e obrigatorio.' };
  }
  if (!pick(publicacao.objeto)) {
    return { ok: false, code: 'objeto_publicacao_ausente', message: 'sumario.publicacao.objeto e obrigatorio.' };
  }
  return { ok: true };
}

function validateDadosCredor(dadosCredor) {
  if (!isObject(dadosCredor)) {
    return { ok: false, code: 'dados_credor_ausente', message: 'dadosCredor e obrigatorio.' };
  }
  for (const field of ['documento', 'nome', 'cidade', 'estado']) {
    if (!pick(dadosCredor[field])) {
      return { ok: false, code: 'dados_credor_campo_ausente', message: 'dadosCredor.' + field + ' e obrigatorio.' };
    }
  }
  return { ok: true };
}

function validateInformacoesGerais(informacoesGerais) {
  if (!isObject(informacoesGerais)) {
    return { ok: false, code: 'informacoes_gerais_ausente', message: 'informacoesGerais e obrigatorio.' };
  }
  if (!pick(informacoesGerais.titulo)) {
    return { ok: false, code: 'informacoes_titulo_ausente', message: 'informacoesGerais.titulo e obrigatorio.' };
  }
  if (!pick(informacoesGerais.texto)) {
    return { ok: false, code: 'informacoes_texto_ausente', message: 'informacoesGerais.texto e obrigatorio.' };
  }
  return { ok: true };
}

function validateEditalLeilaoBody(payload) {
  if (payload.tipoEdital === undefined || payload.tipoEdital === null || payload.tipoEdital === '') {
    return { ok: false, code: 'tipo_edital_ausente', message: 'tipoEdital e obrigatorio (consulte AUTORIB-13 / RFE-01 — LEILAO_IMOVEL).' };
  }
  if (typeof payload.tipoEdital !== 'number' || !Number.isFinite(payload.tipoEdital)) {
    return { ok: false, code: 'tipo_edital_invalido', message: 'tipoEdital deve ser numerico.' };
  }
  const sumario = validateSumario(payload.sumario);
  if (!sumario.ok) return sumario;
  const leilao = validateLeilao(payload.leilao);
  if (!leilao.ok) return leilao;
  if (!Array.isArray(payload.intimados) || payload.intimados.length === 0) {
    return { ok: false, code: 'intimados_invalido', message: 'intimados deve ser um array nao vazio.' };
  }
  for (let i = 0; i < payload.intimados.length; i++) {
    const intimado = validateIntimado(payload.intimados[i], i);
    if (!intimado.ok) return intimado;
  }
  if (!Array.isArray(payload.imoveis) || payload.imoveis.length === 0) {
    return { ok: false, code: 'imoveis_invalido', message: 'imoveis deve ser um array nao vazio.' };
  }
  for (let i = 0; i < payload.imoveis.length; i++) {
    const imovel = validateImovel(payload.imoveis[i], i);
    if (!imovel.ok) return imovel;
  }
  const credor = validateDadosCredor(payload.dadosCredor);
  if (!credor.ok) return credor;
  const info = validateInformacoesGerais(payload.informacoesGerais);
  if (!info.ok) return info;
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
  return erro(422, 'body_invalido', 'Envie JSON com os campos do edital leilao (RFL-01).', null);
}

const edital = validateEditalLeilaoBody(payload);
if (!edital.ok) {
  return erro(422, edital.code, edital.message, edital.technical ?? null);
}

const baseUrl = amb.baseUrl.replace(/\\/$/, '');
return [{
  json: {
    valid: true,
    upstreamUrl: baseUrl + '/v1/edital/leilao',
    accessToken,
    upstreamBody: payload,
    meta: {
      ambiente: amb.key,
      baseUrl,
      endpoint: '/v1/edital/leilao',
      receivedAt: new Date().toISOString(),
      source: 'n8n-rib-cadastro-edital-leilao',
    },
    errorDefaultMsg: 'Erro ao cadastrar edital leilao na API RIB.',
  },
}];
`,
    };

    @node({
        id: 'd111e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
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
                    id: 'cond-rib-cadastro-edital-leilao-valido',
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
        id: 'e111f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a',
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
        id: 'f111a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b',
        name: 'Cadastro Edital Leilao RIB',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [840, 180],
        onError: 'continueRegularOutput',
    })
    CadastroEditalLeilaoRib = {
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
        id: 'a111b8c9-d0e1-2f3a-4b5c-6d7e8f9a0b1c',
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
        id: 'b111c9d0-e1f2-3a4b-5c6d-7e8f9a0b1c2d',
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
        this.ReceiveRibCadastroEditalLeilao.out(0).to(this.ValidarEntrada.in(0));
        this.ValidarEntrada.out(0).to(this.EntradaValida.in(0));
        this.EntradaValida.out(0).to(this.CadastroEditalLeilaoRib.in(0));
        this.EntradaValida.out(1).to(this.RespostaErroEntrada.in(0));
        this.CadastroEditalLeilaoRib.out(0).to(this.BuildCadastroEditalResponse.in(0));
        this.BuildCadastroEditalResponse.out(0).to(this.ReturnCadastroEditalResponse.in(0));
        this.RespostaErroEntrada.out(0).to(this.ReturnCadastroEditalResponse.in(0));
    }
}
