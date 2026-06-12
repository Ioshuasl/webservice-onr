import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : [AUTORIB-22] (rib) DetalheEditalLeilao - RIB
// Nodes   : 7  |  Connections: 7
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// ReceiveRibDetalheEditalLeilao      webhook                    [creds]
// ValidarEntrada                     code
// EntradaValida                      if
// RespostaErroEntrada                code
// DetalheEditalLeilaoRib             httpRequest                [onError→regular]
// BuildDetalheEditalLeilaoResponse   code
// ReturnDetalheEditalLeilaoResponse  respondToWebhook
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// ReceiveRibDetalheEditalLeilao
//    → ValidarEntrada
//      → EntradaValida
//        → DetalheEditalLeilaoRib
//          → BuildDetalheEditalLeilaoResponse
//            → ReturnDetalheEditalLeilaoResponse
//       .out(1) → RespostaErroEntrada
//          → ReturnDetalheEditalLeilaoResponse (↩ loop)
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'ITjatOxJvXB93x48',
    name: '[AUTORIB-22] (rib) DetalheEditalLeilao - RIB',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class Autorib22RibDetalheeditalleilaoRibWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'a112b1c2-d3e4-5f6a-7b8c-9d0e1f2a3b4c',
        webhookId: 'b112c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6e',
        name: 'Receive RIB Detalhe Edital Leilao',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 300],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    ReceiveRibDetalheEditalLeilao = {
        httpMethod: 'GET',
        path: 'rib/edital/leilao/detalhes',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'c112d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
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

const amb = resolveAmbiente();
if (amb.invalid) {
  return erro(422, 'ambiente_invalido', 'ambiente deve ser producao ou homologacao.', { ambiente: amb.informado });
}

const accessToken = resolveAccessToken();
if (!accessToken) {
  return erro(422, 'access_token_ausente', 'Informe X-RIB-Access-Token ou access_token.', null);
}

const numeroEdital = pick(
  query.numero_edital,
  query.numeroEdital,
  query.numero,
  body.numero_edital,
  body.numeroEdital,
  body.numero,
);

if (!numeroEdital) {
  return erro(422, 'numero_edital_ausente', 'Informe numero_edital ou numeroEdital na query ou body.', null);
}

const baseUrl = amb.baseUrl.replace(/\\/$/, '');
const encoded = encodeURIComponent(numeroEdital);

return [{
  json: {
    valid: true,
    upstreamUrl: baseUrl + '/v1/edital/leilao/' + encoded,
    accessToken,
    numeroEdital,
    meta: {
      ambiente: amb.key,
      baseUrl,
      endpoint: '/v1/edital/leilao/{numeroEdital}',
      receivedAt: new Date().toISOString(),
      source: 'n8n-rib-detalhe-edital-leilao',
    },
    errorDefaultMsg: 'Erro ao obter detalhe do edital leilao na API RIB.',
  },
}];
`,
    };

    @node({
        id: 'd112e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
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
                    id: 'cond-rib-detalhe-edital-leilao-valido',
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
        id: 'e112f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a',
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
        id: 'f112a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b',
        name: 'Detalhe Edital Leilao RIB',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [840, 180],
        onError: 'continueRegularOutput',
    })
    DetalheEditalLeilaoRib = {
        method: 'GET',
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
                    name: 'Authorization',
                    value: '=Bearer {{ $json.accessToken }}',
                },
            ],
        },
        options: {},
    };

    @node({
        id: 'a112b8c9-d0e1-2f3a-4b5c-6d7e8f9a0b1c',
        name: 'Build Detalhe Edital Leilao Response',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1060, 180],
    })
    BuildDetalheEditalLeilaoResponse = {
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
    statusCode: status === 401 ? 401 : (status === 404 ? 404 : (status || 502)),
    response: {
      sucesso: false,
      codigo_erro: parsed?.codigo ?? (status === 404 ? 'edital_nao_encontrado' : 'rib_http_error'),
      mensagem_erro: parsed?.descricao ?? parsed?.mensagem ?? rawMessage,
      campos: parsed?.campos ?? null,
      sistema: 'RIB',
      ambiente: meta.ambiente ?? null,
      meta,
      detalhe_tecnico: {
        name: errorObject?.name ?? null,
        code: errorObject?.code ?? null,
        status: status || null,
        endpoint: meta.endpoint ?? '/v1/edital/leilao/{numeroEdital}',
      },
    },
  };
}

if (httpResult.error) {
  return [{ json: normalizeHttpError(httpResult.error, meta, entrada.errorDefaultMsg ?? 'Erro na API RIB.') }];
}

const data = httpResult;
return [{
  json: {
    statusCode: 200,
    response: {
      sucesso: true,
      numero_edital: entrada.numeroEdital ?? data.numeroEdital ?? null,
      uuid: data.uuid ?? null,
      cnm: data.cnm ?? null,
      tipo_edital: data.tipoEdital ?? null,
      descricao_tipo: data.descricaoTipo ?? null,
      numero_publicacao: data.numeroPublicacao ?? null,
      status: data.status ?? null,
      descricao_status: data.descricaoStatus ?? null,
      data_publicacao: data.dataPublicacao ?? null,
      data_cadastro: data.dataCadastro ?? null,
      url_pagamento: data.urlPagamento ?? null,
      url_recibo: data.urlRecibo ?? null,
      editais_vinculados: data.editaisVinculados ?? [],
      anexo: data.anexo ?? null,
      sumario: data.sumario ?? null,
      leilao: data.leilao ?? null,
      imoveis: data.imoveis ?? [],
      intimados: data.intimados ?? [],
      dados_credor: data.dadosCredor ?? null,
      informacoes_gerais: data.informacoesGerais ?? null,
      detalhe: data,
      ambiente: meta.ambiente ?? null,
      meta,
    },
  },
}];
`,
    };

    @node({
        id: 'b112c9d0-e1f2-3a4b-5c6d-7e8f9a0b1c2d',
        name: 'Return Detalhe Edital Leilao Response',
        type: 'n8n-nodes-base.respondToWebhook',
        version: 1.5,
        position: [1280, 300],
    })
    ReturnDetalheEditalLeilaoResponse = {
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
        this.ReceiveRibDetalheEditalLeilao.out(0).to(this.ValidarEntrada.in(0));
        this.ValidarEntrada.out(0).to(this.EntradaValida.in(0));
        this.EntradaValida.out(0).to(this.DetalheEditalLeilaoRib.in(0));
        this.EntradaValida.out(1).to(this.RespostaErroEntrada.in(0));
        this.DetalheEditalLeilaoRib.out(0).to(this.BuildDetalheEditalLeilaoResponse.in(0));
        this.BuildDetalheEditalLeilaoResponse.out(0).to(this.ReturnDetalheEditalLeilaoResponse.in(0));
        this.RespostaErroEntrada.out(0).to(this.ReturnDetalheEditalLeilaoResponse.in(0));
    }
}
