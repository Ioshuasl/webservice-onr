import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : [AUTSEETJGO-7] (see tjgo) ControleAtosRecebidos - Retorno Atos
// Nodes   : 9  |  Connections: 10
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// ReceiveSeeTjgoControleAtos         webhook                    [creds]
// ValidarEntrada                     code
// EntradaValida                      if
// RespostaErroEntrada                code
// FormatoMultipart                   if
// ControleAtosRecebidosMultipartSeeTjgo httpRequest                [onError→regular]
// ControleAtosRecebidosUrlencodedSeeTjgo httpRequest                [onError→regular]
// BuildControleAtosResponse          code
// ReturnControleAtosResponse         respondToWebhook
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// ReceiveSeeTjgoControleAtos
//    → ValidarEntrada
//      → EntradaValida
//        → FormatoMultipart
//          → ControleAtosRecebidosMultipartSeeTjgo
//            → BuildControleAtosResponse
//              → ReturnControleAtosResponse
//         .out(1) → ControleAtosRecebidosUrlencodedSeeTjgo
//            → BuildControleAtosResponse (↩ loop)
//       .out(1) → RespostaErroEntrada
//          → ReturnControleAtosResponse (↩ loop)
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'TmiUEhduZwskQHit',
    name: '[AUTSEETJGO-7] (see tjgo) ControleAtosRecebidos - Retorno Atos',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class Autseetjgo7SeeTjgoControleatosrecebidosRetornoAtosWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'e1f20007-0001-4000-8000-000000000001',
        webhookId: 'e1f20007-0001-4000-8000-000000000011',
        name: 'Receive SEE TJGO Controle Atos',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 300],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    ReceiveSeeTjgoControleAtos = {
        httpMethod: 'POST',
        path: 'see-tjgo/controle-atos-recebidos',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'e1f20007-0001-4000-8000-000000000002',
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
const binary = item.binary ?? {};

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

const ISO_DT = /^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d{3}Z|[+-]\\d{2}:\\d{2})$/;
const SEL0_LEN = 23;

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

function resolveAuthToken() {
  const seeHeader = pick(header('x-see-tjgo-auth-token'), header('X-SEE-TJGO-Auth-Token'));
  if (seeHeader) return seeHeader;
  const authHeader = pick(header('authorization'), header('Authorization'));
  const bearerMatch = authHeader.match(/^Bearer\\s+(.+)$/i);
  if (bearerMatch) return bearerMatch[1].trim();
  return pick(
    query.auth_token,
    query.authToken,
    query.token,
    body.auth_token,
    body.authToken,
    body.token,
  );
}

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

async function resolveArquivoArray() {
  const fromBody = body.arquivo ?? body.atos;
  if (Array.isArray(fromBody)) return fromBody;
  if (typeof fromBody === 'string') {
    const parsed = parseJsonSafe(fromBody);
    if (Array.isArray(parsed)) return parsed;
    if (parsed && Array.isArray(parsed.arquivo)) return parsed.arquivo;
    if (parsed && typeof parsed === 'object') return [parsed];
  }

  const binaryKeys = Object.keys(binary);
  for (const key of ['arquivo', 'file', 'json']) {
    if (!binary[key]) continue;
    let buffer;
    try {
      buffer = await this.helpers.getBinaryDataBuffer(0, key);
    } catch {
      const bin = binary[key];
      if (bin?.data) buffer = Buffer.from(bin.data, 'base64');
    }
    if (!buffer?.length) continue;
    const parsed = parseJsonSafe(buffer.toString('utf8'));
    if (Array.isArray(parsed)) return parsed;
    if (parsed && Array.isArray(parsed.arquivo)) return parsed.arquivo;
    if (parsed && typeof parsed === 'object') return [parsed];
  }

  if (binaryKeys.length) {
    return { parseError: true, binaryKeys };
  }
  return null;
}

function normalizeParte(parte) {
  if (!parte || typeof parte !== 'object') return null;
  const out = {};
  const nome = pick(parte.nome);
  const cpf = pick(parte.cpf_cnpj, parte.cpfCnpj);
  const dataNasc = pick(parte.data_nascimento, parte.dataNascimento);
  const telefone = pick(parte.telefone);
  const nomeMae = pick(parte.nome_mae, parte.nomeMae);
  const tipo = pick(parte.tipo);
  if (nome) out.nome = nome;
  if (cpf) out.cpf_cnpj = cpf;
  if (dataNasc) out.data_nascimento = dataNasc;
  if (telefone) out.telefone = telefone;
  if (nomeMae) out.nome_mae = nomeMae;
  if (tipo) out.tipo = tipo;
  return Object.keys(out).length ? out : null;
}

function normalizeInformacao(info) {
  if (!info || typeof info !== 'object') return null;
  const chave = pick(info.chave, info.key);
  const valor = info.valor ?? info.value;
  if (!chave) return null;
  return { chave, valor };
}

function normalizeRetornoAto(raw) {
  const out = {};
  const pedido = raw.identificacao_pedido_na_cgj ?? raw.identificacaoPedidoNaCgj;
  const tipo = raw.tipo_de_ato ?? raw.tipoDeAto;
  const codigoSelo = pick(raw.codigo_do_selo, raw.codigoDoSelo);
  const codigoAto = pick(raw.codigo_do_ato, raw.codigoDoAto);
  const nomeCivil = pick(raw.nome_do_civil_do_ato, raw.nomeDoCivilDoAto);
  const nomeServentuario = pick(
    raw.nome_do_serventuario_que_praticou_ato,
    raw.nomeDoServentuarioQuePraticouAto,
  );
  const dataHora = pick(raw.data_hora_da_solicitacao, raw.dataHoraDaSolicitacao);
  const ip = pick(raw.ip_da_maquina_que_praticou_ato, raw.ipDaMaquinaQuePraticouAto);
  const valorEntrada = pick(raw.valor_de_entrada_do_ato, raw.valorDeEntradaDoAto);
  const emolumento = pick(raw.emolumento_do_ato, raw.emolumentoDoAto);
  const taxa = pick(raw.taxa_judiciaria_do_ato, raw.taxaJudiciariaDoAto);
  const fundos = pick(raw.fundos_estaduais_do_ato, raw.fundosEstaduaisDoAto);
  const iss = pick(raw.valor_iss, raw.valorIss);
  const isentado = raw.id_do_ato_isentado ?? raw.idDoAtoIsentado;
  const protesto = raw.protocolo_do_protesto ?? raw.protocoloDoProtesto;
  const imovel = raw.protocolo_do_imovel ?? raw.protocoloDoImovel;
  const infos = raw.informacoes_adicionais ?? raw.informacoesAdicionais;
  const partes = raw.partes;

  if (pedido !== undefined && pedido !== null && String(pedido).trim() !== '') {
    out.identificacao_pedido_na_cgj = Number(pedido);
  }
  if (tipo !== undefined && tipo !== null && String(tipo).trim() !== '') {
    out.tipo_de_ato = Number(tipo);
  }
  if (codigoSelo) out.codigo_do_selo = codigoSelo;
  if (codigoAto) out.codigo_do_ato = codigoAto;
  if (nomeCivil) out.nome_do_civil_do_ato = nomeCivil;
  if (nomeServentuario) out.nome_do_serventuario_que_praticou_ato = nomeServentuario;
  if (dataHora) out.data_hora_da_solicitacao = dataHora;
  if (ip) out.ip_da_maquina_que_praticou_ato = ip;
  if (valorEntrada) out.valor_de_entrada_do_ato = valorEntrada;
  if (emolumento) out.emolumento_do_ato = emolumento;
  if (taxa) out.taxa_judiciaria_do_ato = taxa;
  if (fundos) out.fundos_estaduais_do_ato = fundos;
  if (iss) out.valor_iss = iss;
  if (isentado !== undefined && isentado !== null && String(isentado).trim() !== '') {
    out.id_do_ato_isentado = Number(isentado);
  }
  if (protesto !== undefined && protesto !== null && String(protesto).trim() !== '') {
    out.protocolo_do_protesto = Number(protesto);
  }
  if (imovel !== undefined && imovel !== null && String(imovel).trim() !== '') {
    out.protocolo_do_imovel = Number(imovel);
  }
  if (Array.isArray(infos)) {
    const normalized = infos.map(normalizeInformacao).filter(Boolean);
    if (normalized.length) out.informacoes_adicionais = normalized;
  }
  if (Array.isArray(partes)) {
    const normalized = partes.map(normalizeParte).filter(Boolean);
    if (normalized.length) out.partes = normalized;
  }
  return out;
}

function validarRetornoAto(ato, index) {
  const errors = [];
  const pedido = ato.identificacao_pedido_na_cgj;
  const tipo = ato.tipo_de_ato;
  const codigoSelo = String(ato.codigo_do_selo ?? '').trim();
  const codigoAto = String(ato.codigo_do_ato ?? '').trim();
  const nomeServentuario = String(ato.nome_do_serventuario_que_praticou_ato ?? '').trim();
  const dataHora = String(ato.data_hora_da_solicitacao ?? '').trim();

  if (pedido === undefined || pedido === null || Number.isNaN(Number(pedido))) {
    errors.push(\`arquivo[\${index}].identificacao_pedido_na_cgj obrigatorio (inteiro).\`);
  }
  if (tipo === undefined || tipo === null || Number.isNaN(Number(tipo))) {
    errors.push(\`arquivo[\${index}].tipo_de_ato obrigatorio (inteiro).\`);
  }
  if (!codigoSelo) {
    errors.push(\`arquivo[\${index}].codigo_do_selo obrigatorio.\`);
  } else if (codigoSelo.length !== SEL0_LEN) {
    errors.push(\`arquivo[\${index}].codigo_do_selo deve ter exatamente 23 caracteres (informado: \${codigoSelo.length}).\`);
  }
  if (!codigoAto) {
    errors.push(\`arquivo[\${index}].codigo_do_ato obrigatorio.\`);
  } else if (codigoAto.length !== SEL0_LEN) {
    errors.push(\`arquivo[\${index}].codigo_do_ato deve ter exatamente 23 caracteres (informado: \${codigoAto.length}).\`);
  }
  if (!nomeServentuario) {
    errors.push(\`arquivo[\${index}].nome_do_serventuario_que_praticou_ato obrigatorio.\`);
  }
  if (!dataHora) {
    errors.push(\`arquivo[\${index}].data_hora_da_solicitacao obrigatorio.\`);
  } else if (!ISO_DT.test(dataHora)) {
    errors.push(\`arquivo[\${index}].data_hora_da_solicitacao deve ser ISO 8601 com timezone (ex.: 2026-06-15T10:00:00-03:00).\`);
  }
  return errors;
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

const authToken = resolveAuthToken();
if (!authToken) {
  return erro(
    422,
    'auth_token_ausente',
    'Informe auth_token no body, header X-SEE-TJGO-Auth-Token ou Authorization Bearer.',
    { fontes: ['body.auth_token', 'X-SEE-TJGO-Auth-Token', 'Authorization: Bearer'] },
  );
}

const rawArquivo = await resolveArquivoArray.call(this);
if (rawArquivo?.parseError) {
  return erro(
    422,
    'arquivo_ilegivel',
    'Nao foi possivel interpretar o JSON do campo multipart arquivo.',
    { binaryKeys: rawArquivo.binaryKeys },
  );
}
if (!Array.isArray(rawArquivo) || !rawArquivo.length) {
  return erro(
    422,
    'arquivo_ausente',
    'Informe arquivo (RetornoAto[]) no body JSON ou multipart campo arquivo.',
    { campos: ['body.arquivo', 'body.atos', 'multipart.arquivo'] },
  );
}

const retornoAtos = rawArquivo.map(normalizeRetornoAto);
const validationErrors = [];
retornoAtos.forEach((ato, index) => {
  validationErrors.push(...validarRetornoAto(ato, index));
});
if (validationErrors.length) {
  return erro(
    422,
    'retorno_ato_invalido',
    'Um ou mais itens de RetornoAto falharam na validacao local.',
    { erros: validationErrors, quantidade: retornoAtos.length },
  );
}

const formatoRaw = pick(
  body.formato_envio,
  body.formatoEnvio,
  query.formato_envio,
  query.formatoEnvio,
  'urlencoded',
).toLowerCase();
const formatoEnvio = formatoRaw === 'multipart' ? 'multipart' : 'urlencoded';

const urlencodedBody = retornoAtos
  .map((ato) => 'arquivo=' + encodeURIComponent(JSON.stringify(ato)))
  .join('&');

const baseUrl = amb.baseUrl.replace(/\\/$/, '');
const controleUrl = baseUrl + '/controle_atos_recebidos';
const jsonArquivo = JSON.stringify(retornoAtos);

return [{
  json: {
    valid: true,
    controleUrl,
    authToken,
    formatoEnvio,
    urlencodedBody,
    retornoAtos,
    meta: {
      ambiente: amb.key,
      baseUrl,
      endpoint: '/controle_atos_recebidos',
      formato_envio: formatoEnvio,
      quantidade_atos: retornoAtos.length,
      receivedAt: new Date().toISOString(),
      source: 'n8n-see-tjgo-controle-atos-recebidos',
    },
  },
  binary: {
    arquivo: {
      data: Buffer.from(jsonArquivo, 'utf8').toString('base64'),
      mimeType: 'application/json',
      fileName: 'retorno-atos.json',
    },
  },
}];
`,
    };

    @node({
        id: 'e1f20007-0001-4000-8000-000000000003',
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
                    id: 'cond-see-controle-atos-valido',
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
        id: 'e1f20007-0001-4000-8000-000000000004',
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
        id: 'e1f20007-0001-4000-8000-000000000005',
        name: 'Formato multipart?',
        type: 'n8n-nodes-base.if',
        version: 2.2,
        position: [840, 180],
    })
    FormatoMultipart = {
        conditions: {
            options: {
                caseSensitive: true,
                leftValue: '',
                typeValidation: 'strict',
                version: 2,
            },
            conditions: [
                {
                    id: 'cond-see-controle-atos-multipart',
                    leftValue: '={{ $json.formatoEnvio }}',
                    rightValue: 'multipart',
                    operator: {
                        type: 'string',
                        operation: 'equals',
                    },
                },
            ],
            combinator: 'and',
        },
        options: {},
    };

    @node({
        id: 'e1f20007-0001-4000-8000-000000000006',
        name: 'Controle Atos Recebidos Multipart SEE TJGO',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [1120, 80],
        onError: 'continueRegularOutput',
    })
    ControleAtosRecebidosMultipartSeeTjgo = {
        method: 'POST',
        url: '={{ $json.controleUrl }}',
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
                    value: '=Bearer {{ $json.authToken }}',
                },
            ],
        },
        sendBody: true,
        contentType: 'multipart-form-data',
        specifyBody: 'keypair',
        bodyParameters: {
            parameters: [
                {
                    name: 'arquivo',
                    parameterType: 'formBinaryData',
                    inputDataFieldName: 'arquivo',
                },
            ],
        },
        options: {},
    };

    @node({
        id: 'e1f20007-0001-4000-8000-000000000007',
        name: 'Controle Atos Recebidos Urlencoded SEE TJGO',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [1120, 280],
        onError: 'continueRegularOutput',
    })
    ControleAtosRecebidosUrlencodedSeeTjgo = {
        method: 'POST',
        url: '={{ $json.controleUrl }}',
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
                    value: 'application/x-www-form-urlencoded',
                },
                {
                    name: 'Authorization',
                    value: '=Bearer {{ $json.authToken }}',
                },
            ],
        },
        sendBody: true,
        contentType: 'raw',
        rawContentType: 'application/x-www-form-urlencoded',
        body: '={{ $json.urlencodedBody }}',
        options: {},
    };

    @node({
        id: 'e1f20007-0001-4000-8000-000000000008',
        name: 'Build Controle Atos Response',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1340, 180],
    })
    BuildControleAtosResponse = {
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
    if (Array.isArray(parsed.criticas) && parsed.criticas.length) {
      return parsed.criticas.map((c) => c?.message ?? c?.mensagem ?? String(c)).join('; ');
    }
    return parsed.message ?? parsed.mensagem ?? parsed.error ?? null;
  }
  return null;
}

function normalizeHttpError(errorObject) {
  const rawMessage = errorObject?.message ?? 'Erro desconhecido ao enviar retorno de atos na API SEE TJGO.';
  const status = Number(
    errorObject?.status
      ?? errorObject?.httpCode
      ?? rawMessage.match(/^\\s*(\\d{3})\\s*-/)?.[1]
      ?? 502,
  );
  const parsed = parseJsonSafe(errorObject?.response?.body)
    ?? parseJsonSafe(errorObject?.response?.data)
    ?? (typeof errorObject?.response?.body === 'object' ? errorObject.response.body : null);

  const mensagem = formatMensagens(parsed) ?? rawMessage;

  return {
    statusCode: status === 401 ? 401 : (status === 406 ? 406 : (status || 502)),
    response: {
      sucesso: false,
      codigo_erro: 'see_http_error',
      mensagem_erro: mensagem,
      criticas: parsed?.criticas ?? null,
      sistema: 'SEE TJGO',
      status_http: status || 502,
      ambiente: meta.ambiente ?? null,
      meta,
      detalhe_tecnico: {
        name: errorObject?.name ?? null,
        code: errorObject?.code ?? null,
        status: status || null,
        endpoint: meta.endpoint ?? '/controle_atos_recebidos',
        formato_envio: meta.formato_envio ?? null,
      },
      resposta_api: parsed,
    },
  };
}

if (httpResult.error) {
  return [{ json: normalizeHttpError(httpResult.error) }];
}

const data = httpResult;
const upstreamStatus = Number(data.status ?? 200);
const statusCode = upstreamStatus >= 100 && upstreamStatus < 600 ? upstreamStatus : 200;

if (statusCode >= 400) {
  const mensagem = formatMensagens(data) ?? 'A API SEE TJGO rejeitou o retorno de atos.';
  return [{
    json: {
      statusCode,
      response: {
        sucesso: false,
        codigo_erro: 'see_api_error',
        mensagem_erro: mensagem,
        id: data.id ?? null,
        status: data.status ?? statusCode,
        data_cricao: data.data_cricao ?? data.data_criacao ?? null,
        criticas: Array.isArray(data.criticas) ? data.criticas : [],
        sistema: 'SEE TJGO',
        status_http: statusCode,
        ambiente: meta.ambiente ?? null,
        meta,
        retorno: data,
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
      status_http: 200,
      id: data.id ?? null,
      status: data.status ?? 200,
      data_cricao: data.data_cricao ?? data.data_criacao ?? null,
      criticas: Array.isArray(data.criticas) ? data.criticas : [],
      retorno: data,
      ambiente: meta.ambiente ?? null,
      meta,
    },
  },
}];
`,
    };

    @node({
        id: 'e1f20007-0001-4000-8000-000000000009',
        name: 'Return Controle Atos Response',
        type: 'n8n-nodes-base.respondToWebhook',
        version: 1.5,
        position: [1560, 300],
    })
    ReturnControleAtosResponse = {
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
        this.ReceiveSeeTjgoControleAtos.out(0).to(this.ValidarEntrada.in(0));
        this.ValidarEntrada.out(0).to(this.EntradaValida.in(0));
        this.EntradaValida.out(0).to(this.FormatoMultipart.in(0));
        this.EntradaValida.out(1).to(this.RespostaErroEntrada.in(0));
        this.FormatoMultipart.out(0).to(this.ControleAtosRecebidosMultipartSeeTjgo.in(0));
        this.FormatoMultipart.out(1).to(this.ControleAtosRecebidosUrlencodedSeeTjgo.in(0));
        this.ControleAtosRecebidosMultipartSeeTjgo.out(0).to(this.BuildControleAtosResponse.in(0));
        this.ControleAtosRecebidosUrlencodedSeeTjgo.out(0).to(this.BuildControleAtosResponse.in(0));
        this.BuildControleAtosResponse.out(0).to(this.ReturnControleAtosResponse.in(0));
        this.RespostaErroEntrada.out(0).to(this.ReturnControleAtosResponse.in(0));
    }
}
