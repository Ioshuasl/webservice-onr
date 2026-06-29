import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : [AUTENOT-3] (enot) DocumentsCreate - Fluxo
// Nodes   : 7  |  Connections: 7
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// ReceiveEnotDocumentscreate         webhook                    [creds]
// ValidarEntrada                     code
// EntradaValida                      if
// RespostaErroEntrada                code
// DocumentscreateEnot                httpRequest                [onError→regular]
// BuildDocumentscreateResponse       code
// ReturnDocumentscreateResponse      respondToWebhook
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// ReceiveEnotDocumentscreate
//    → ValidarEntrada
//      → EntradaValida
//        → DocumentscreateEnot
//          → BuildDocumentscreateResponse
//            → ReturnDocumentscreateResponse
//       .out(1) → RespostaErroEntrada
//          → ReturnDocumentscreateResponse (↩ loop)
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'w816W2A5Ho874UJF',
    name: '[AUTENOT-3] (enot) DocumentsCreate - Fluxo',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class Autenot3EnotDocumentscreateFluxoWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'e1430003-0003-4000-8000-000000000001',
        webhookId: 'e1430003-0003-4000-8000-000000000011',
        name: 'Receive ENOT DocumentsCreate',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 300],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    ReceiveEnotDocumentscreate = {
        httpMethod: 'POST',
        path: 'enot/fluxo/criar',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'e1430003-0003-4000-8000-000000000002',
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

function pickField(obj, ...keys) {
  for (const key of keys) {
    if (obj && obj[key] !== undefined && obj[key] !== null) return obj[key];
  }
  return undefined;
}

const AMBIENTES_ENOT = {
  homologacao: {
    key: 'homologacao',
    baseUrl: () => pick($env.ENOT_API_BASE_URL, 'https://assinatura-hml.e-notariado.org.br'),
  },
  producao: {
    key: 'producao',
    baseUrl: () => pick($env.ENOT_API_BASE_URL_PROD, 'https://assinatura.e-notariado.org.br'),
  },
};

const AMBIENTE_ALIASES = {
  homologacao: 'homologacao',
  homolog: 'homologacao',
  hml: 'homologacao',
  staging: 'homologacao',
  producao: 'producao',
  prod: 'producao',
  production: 'producao',
};

const TYPES_OF_ACT = new Set([
  'Deed',
  'PowerOfAttorney',
  'NotarialMinutes',
  'Testament',
  'AcknowledgmentForPhysicalActs',
  'TranscriptForPhysicalActs',
]);

const TYPES_REQUIRING_BOOK_PAGE = new Set([
  'AcknowledgmentForPhysicalActs',
  'TranscriptForPhysicalActs',
]);

const PARTICIPANT_TYPES = new Set(['Signer', 'Approver']);

function resolveAmbiente() {
  const raw = pick(
    body.ambiente,
    query.ambiente,
    header('x-ambiente'),
    $env.ENOT_AMBIENTE,
    'homologacao',
  ).toLowerCase();
  const key = AMBIENTE_ALIASES[raw];
  if (!key) {
    return { invalid: true, informado: raw };
  }
  const cfg = AMBIENTES_ENOT[key];
  return {
    key: cfg.key,
    baseUrl: cfg.baseUrl(),
  };
}

function resolveAuth() {
  const requestedMode = pick(body.auth_mode, body.authMode).toLowerCase();
  const authHeader = pick(header('authorization'), header('Authorization'));
  const bearerFromHeader = authHeader.match(/^Bearer\\s+(.+)$/i)?.[1]?.trim();
  const bearerToken = pick(
    bearerFromHeader,
    body.bearer_token,
    body.bearerToken,
    body.token,
  );
  const apiKey = pick(
    body.api_key,
    body.apiKey,
    header('x-api-key'),
    header('X-Api-Key'),
    $env.ENOT_API_KEY,
  );

  if (requestedMode === 'bearer') {
    if (!bearerToken && apiKey) {
      return { mode: 'bearer', value: apiKey, source: 'api_key_as_bearer' };
    }
    if (bearerToken) return { mode: 'bearer', value: bearerToken, source: 'bearer' };
    return null;
  }

  if (requestedMode === 'api_key' || requestedMode === 'x-api-key') {
    if (apiKey) return { mode: 'api_key', value: apiKey, source: 'api_key' };
    return null;
  }

  if (bearerToken) return { mode: 'bearer', value: bearerToken, source: 'bearer' };
  if (apiKey) return { mode: 'api_key', value: apiKey, source: 'api_key' };
  return null;
}

function erro(status, code, message, technical) {
  const response = {
    sucesso: false,
    codigo_erro: code,
    mensagem: message,
    status_http: status,
    sistema: 'ENOT',
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

function isBoolean(value) {
  return typeof value === 'boolean';
}

function requireBooleanField(obj, snakeKey, camelKey, label) {
  const value = pickField(obj, snakeKey, camelKey);
  if (value === undefined || value === null) {
    validationErrors.push({ campo: label, codigo: 'campo_obrigatorio', mensagem: \`\${label} obrigatorio (v2.3+).\` });
    return null;
  }
  if (!isBoolean(value)) {
    validationErrors.push({ campo: label, codigo: 'tipo_booleano', mensagem: \`\${label} deve ser boolean (true/false).\` });
    return null;
  }
  return value;
}

function normalizeFiles(rawFiles) {
  if (!Array.isArray(rawFiles)) return null;
  return rawFiles.map((file, index) => {
    const id = pick(pickField(file, 'id'));
    const name = pick(pickField(file, 'name'));
    const displayName = pick(pickField(file, 'display_name', 'displayName'));
    const contentType = pick(pickField(file, 'content_type', 'contentType'), 'application/pdf');
    const location = pickField(file, 'location');
    const mapped = { id, name, displayName, contentType };
    if (location) mapped.location = location;
    if (!id) {
      return { error: \`files[\${index}].id obrigatorio (id do AUTENOT-2 Uploads).\` };
    }
    if (!name) {
      return { error: \`files[\${index}].name obrigatorio.\` };
    }
    if (!displayName) {
      return { error: \`files[\${index}].display_name obrigatorio.\` };
    }
    return { mapped };
  });
}

function normalizeFlowActions(rawActions) {
  if (!Array.isArray(rawActions)) return null;
  return rawActions.map((action, index) => {
    const type = pick(pickField(action, 'type'));
    const step = pickField(action, 'step');
    const user = pickField(action, 'user');
    if (!type || !PARTICIPANT_TYPES.has(type)) {
      return { error: \`flow_actions[\${index}].type invalido (Signer ou Approver).\` };
    }
    if (step === undefined || step === null || Number.isNaN(Number(step))) {
      return { error: \`flow_actions[\${index}].step obrigatorio (numero).\` };
    }
    if (!user || typeof user !== 'object') {
      return { error: \`flow_actions[\${index}].user obrigatorio.\` };
    }
    const name = pick(pickField(user, 'name'));
    const identifier = String(pick(pickField(user, 'identifier'))).replace(/\\D/g, '');
    const email = pick(pickField(user, 'email'));
    if (!name || !identifier || !email) {
      return { error: \`flow_actions[\${index}].user requer name, identifier (CPF) e email.\` };
    }
    const mapped = {
      type,
      step: Number(step),
      user: { name, identifier, email },
    };
    const title = pickField(action, 'title');
    if (title !== undefined && title !== null) mapped.title = title;
    const prepositionedMarks = pickField(action, 'prepositioned_marks', 'prepositionedMarks');
    if (prepositionedMarks !== undefined) mapped.prepositionedMarks = prepositionedMarks;
    return { mapped };
  });
}

function normalizeRealEstates(raw, hasRealEstates) {
  if (!Array.isArray(raw)) return { error: 'real_estates deve ser array.' };
  if (!hasRealEstates) return { mapped: [] };
  if (raw.length === 0) {
    return { error: 'real_estates deve ter ao menos um item quando has_real_estates for true.' };
  }
  const mapped = [];
  for (let i = 0; i < raw.length; i += 1) {
    const row = raw[i] ?? {};
    const quantity = pickField(row, 'quantity');
    const cityId = pick(pickField(row, 'city_id', 'cityId', 'cityld'));
    if (quantity === undefined || quantity === null || Number.isNaN(Number(quantity))) {
      return { error: \`real_estates[\${i}].quantity obrigatorio.\` };
    }
    if (!cityId) {
      return { error: \`real_estates[\${i}].city_id obrigatorio (AUTENOT-1 Cities).\` };
    }
    mapped.push({ quantity: Number(quantity), cityId });
  }
  return { mapped };
}

function normalizeResidences(raw) {
  if (!Array.isArray(raw)) return { error: 'residences deve ser array com ao menos um item.' };
  if (raw.length === 0) {
    return { error: 'residences obrigatorio (v2.3+): informe ao menos uma residencia.' };
  }
  const mapped = [];
  for (let i = 0; i < raw.length; i += 1) {
    const row = raw[i] ?? {};
    const isForeign = pickField(row, 'is_foreign', 'isForeign');
    const quantity = pickField(row, 'quantity');
    const cityId = pick(pickField(row, 'city_id', 'cityId', 'cityld'));
    if (!isBoolean(isForeign)) {
      return { error: \`residences[\${i}].is_foreign deve ser boolean.\` };
    }
    if (quantity === undefined || quantity === null || Number.isNaN(Number(quantity))) {
      return { error: \`residences[\${i}].quantity obrigatorio.\` };
    }
    if (!isForeign && !cityId) {
      return { error: \`residences[\${i}].city_id obrigatorio quando is_foreign for false.\` };
    }
    const item = { isForeign, quantity: Number(quantity) };
    if (cityId) item.cityId = cityId;
    mapped.push(item);
  }
  return { mapped };
}

function normalizeFindings(raw, actType) {
  if (!Array.isArray(raw)) {
    if (actType === 'NotarialMinutes') {
      return { error: 'findings obrigatorio para atos do tipo NotarialMinutes (Ata Notarial).' };
    }
    return { mapped: [] };
  }
  if (actType === 'NotarialMinutes' && raw.length === 0) {
    return { error: 'findings deve ter ao menos um item para NotarialMinutes.' };
  }
  const mapped = [];
  for (let i = 0; i < raw.length; i += 1) {
    const row = raw[i] ?? {};
    const isDigital = pickField(row, 'is_digital', 'isDigital');
    const cityId = pick(pickField(row, 'city_id', 'cityId', 'cityld'));
    if (!isBoolean(isDigital)) {
      return { error: \`findings[\${i}].is_digital deve ser boolean.\` };
    }
    if (!isDigital && !cityId) {
      return { error: \`findings[\${i}].city_id obrigatorio quando is_digital for false.\` };
    }
    const item = { isDigital };
    if (cityId) item.cityId = cityId;
    mapped.push(item);
  }
  return { mapped };
}

const amb = resolveAmbiente();
if (amb.invalid) {
  return erro(
    422,
    'ambiente_invalido',
    'ambiente deve ser homologacao ou producao.',
    { ambiente: amb.informado, aceitos: ['homologacao', 'producao'] },
  );
}

const auth = resolveAuth();
if (!auth) {
  return erro(
    422,
    'credencial_ausente',
    'Informe api_key (X-Api-Key / ENOT_API_KEY) ou bearer_token (Authorization Bearer). Opcional: auth_mode api_key|bearer.',
    { fontes: ['body.api_key', 'X-Api-Key', 'ENOT_API_KEY', 'body.bearer_token', 'Authorization: Bearer', 'body.auth_mode'] },
  );
}

const organizationId = pick(
  body.organization_id,
  body.organizationId,
  $env.ENOT_ORGANIZATION_ID,
);
if (!organizationId) {
  return erro(
    422,
    'organization_id_ausente',
    'Informe organization_id no body ou configure ENOT_ORGANIZATION_ID no n8n.',
    { fontes: ['body.organization_id', 'ENOT_ORGANIZATION_ID'] },
  );
}

const actType = pick(body.type);
if (!actType || !TYPES_OF_ACT.has(actType)) {
  return erro(
    422,
    'type_invalido',
    'type obrigatorio e deve ser um TypeOfAct valido (ex.: Deed, PowerOfAttorney, NotarialMinutes).',
    { aceitos: [...TYPES_OF_ACT] },
  );
}

const validationErrors = [];

const isHybridAct = requireBooleanField(body, 'is_hybrid_act', 'isHybridAct', 'is_hybrid_act');
const hasRealEstates = requireBooleanField(body, 'has_real_estates', 'hasRealEstates', 'has_real_estates');

const rawFiles = pickField(body, 'files');
if (!rawFiles) {
  validationErrors.push({ campo: 'files', codigo: 'campo_obrigatorio', mensagem: 'files obrigatorio (resultado do AUTENOT-2 Uploads).' });
}

const rawFlowActions = pickField(body, 'flow_actions', 'flowActions');
if (!rawFlowActions) {
  validationErrors.push({ campo: 'flow_actions', codigo: 'campo_obrigatorio', mensagem: 'flow_actions obrigatorio com ao menos um participante.' });
}

const rawResidences = pickField(body, 'residences');
if (rawResidences === undefined) {
  validationErrors.push({ campo: 'residences', codigo: 'campo_obrigatorio', mensagem: 'residences obrigatorio (v2.3+).' });
}

const rawRealEstates = pickField(body, 'real_estates', 'realEstates');
if (rawRealEstates === undefined && hasRealEstates !== null) {
  validationErrors.push({ campo: 'real_estates', codigo: 'campo_obrigatorio', mensagem: 'real_estates obrigatorio (array; vazio se has_real_estates for false).' });
}

if (TYPES_REQUIRING_BOOK_PAGE.has(actType)) {
  if (!pick(body.book)) validationErrors.push({ campo: 'book', codigo: 'campo_obrigatorio', mensagem: 'book obrigatorio para este type.' });
  if (!pick(body.page)) validationErrors.push({ campo: 'page', codigo: 'campo_obrigatorio', mensagem: 'page obrigatorio para este type.' });
}

if (validationErrors.length) {
  return erro(422, 'entrada_invalida', 'Corrija os campos indicados em detalhe_tecnico.erros.', { erros: validationErrors });
}

let filesMapped = [];
if (rawFiles) {
  const normalizedFiles = normalizeFiles(rawFiles);
  if (!normalizedFiles) {
    return erro(422, 'files_invalido', 'files deve ser array.', null);
  }
  for (const entry of normalizedFiles) {
    if (entry.error) return erro(422, 'files_invalido', entry.error, null);
    filesMapped.push(entry.mapped);
  }
}

let flowActionsMapped = [];
if (rawFlowActions) {
  if (!Array.isArray(rawFlowActions) || rawFlowActions.length === 0) {
    return erro(422, 'flow_actions_invalido', 'flow_actions deve ser array com ao menos um item.', null);
  }
  const normalizedActions = normalizeFlowActions(rawFlowActions);
  if (!normalizedActions) {
    return erro(422, 'flow_actions_invalido', 'flow_actions deve ser array.', null);
  }
  for (const entry of normalizedActions) {
    if (entry.error) return erro(422, 'flow_actions_invalido', entry.error, null);
    flowActionsMapped.push(entry.mapped);
  }
}

const realEstatesResult = normalizeRealEstates(rawRealEstates ?? [], hasRealEstates === true);
if (realEstatesResult.error) {
  return erro(422, 'real_estates_invalido', realEstatesResult.error, null);
}

const residencesResult = normalizeResidences(rawResidences);
if (residencesResult.error) {
  return erro(422, 'residences_invalido', residencesResult.error, null);
}

const rawFindings = pickField(body, 'findings');
const findingsResult = normalizeFindings(rawFindings ?? [], actType);
if (findingsResult.error) {
  return erro(422, 'findings_invalido', findingsResult.error, null);
}

const upstreamBody = {
  flowActions: flowActionsMapped,
  observers: pickField(body, 'observers') ?? [],
  folderId: pickField(body, 'folder_id', 'folderId') ?? null,
  newFolderName: pickField(body, 'new_folder_name', 'newFolderName') ?? null,
  organizationId,
  type: actType,
  notaryType: pickField(body, 'notary_type', 'notaryType') ?? null,
  book: pick(body.book) || null,
  page: pick(body.page) || null,
  referenceDocumentId: pickField(body, 'reference_document_id', 'referenceDocumentId') ?? null,
  notarizationDate: pickField(body, 'notarization_date', 'notarizationDate') ?? null,
  files: filesMapped,
  areFilesScanned: pickField(body, 'are_files_scanned', 'areFilesScanned') ?? false,
  isHybridAct,
  hasRealEstates,
  realEstates: realEstatesResult.mapped,
  residences: residencesResult.mapped,
  findings: findingsResult.mapped,
};

const protocol = pick(body.protocol);
if (protocol) upstreamBody.protocol = protocol;

const baseUrl = amb.baseUrl.replace(/\\/$/, '');

return [{
  json: {
    valid: true,
    documentsUrl: baseUrl + '/api/documents',
    upstreamBody,
    useBearer: auth.mode === 'bearer',
    authCredential: auth.value,
    meta: {
      ambiente: amb.key,
      baseUrl,
      endpoint: '/api/documents',
      authMode: auth.mode,
      authSource: auth.source,
      receivedAt: new Date().toISOString(),
      source: 'n8n-enot-documents-create',
    },
  },
}];
`,
    };

    @node({
        id: 'e1430003-0003-4000-8000-000000000003',
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
                    id: 'cond-enot-documents-create-valido',
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
        id: 'e1430003-0003-4000-8000-000000000004',
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
      mensagem: 'Entrada rejeitada pela validacao local.',
      status_http: data.statusCode || 422,
      sistema: 'ENOT',
    },
  },
}];
`,
    };

    @node({
        id: 'e1430003-0003-4000-8000-000000000005',
        name: 'DocumentsCreate ENOT',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [840, 180],
        onError: 'continueRegularOutput',
    })
    DocumentscreateEnot = {
        method: 'POST',
        url: '={{ $json.documentsUrl }}',
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
                    name: '={{ $json.useBearer ? "Authorization" : "X-Api-Key" }}',
                    value: '={{ $json.useBearer ? "Bearer " + $json.authCredential : $json.authCredential }}',
                },
            ],
        },
        sendBody: true,
        jsonBody: '={{ JSON.stringify($json.upstreamBody) }}',
        contentType: 'json',
        options: {},
    };

    @node({
        id: 'e1430003-0003-4000-8000-000000000006',
        name: 'Build DocumentsCreate Response',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1060, 180],
    })
    BuildDocumentscreateResponse = {
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
  const rawMessage = errorObject?.message ?? 'Erro desconhecido ao criar fluxo na API e-Notariado.';
  const status = Number(
    errorObject?.status
      ?? errorObject?.httpCode
      ?? rawMessage.match(/^\\s*(\\d{3})\\s*-/)?.[1]
      ?? 502,
  );
  const parsed = parseJsonSafe(errorObject?.response?.body)
    ?? parseJsonSafe(errorObject?.response?.data)
    ?? (typeof errorObject?.response?.body === 'object' ? errorObject.response.body : null);

  const statusCode = status === 401 ? 401 : (status || 502);

  return {
    statusCode,
    response: {
      sucesso: false,
      codigo_erro: parsed?.codigo ?? parsed?.code ?? parsed?.error ?? 'enot_http_error',
      mensagem: parsed?.message ?? parsed?.mensagem ?? parsed?.title ?? rawMessage,
      status_http: statusCode,
      sistema: 'ENOT',
      ambiente: meta.ambiente ?? null,
      meta,
      detalhe_tecnico: {
        name: errorObject?.name ?? null,
        code: errorObject?.code ?? null,
        status: status || null,
        endpoint: meta.endpoint ?? '/api/documents',
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

if (statusCode >= 400) {
  return [{
    json: {
      statusCode,
      response: {
        sucesso: false,
        codigo_erro: data.code ?? data.error ?? 'enot_api_error',
        mensagem: data.message ?? data.mensagem ?? data.title ?? 'A API e-Notariado retornou erro ao criar o fluxo.',
        status_http: statusCode,
        sistema: 'ENOT',
        ambiente: meta.ambiente ?? null,
        meta,
        dados: data,
      },
    },
  }];
}

const payload = data.data ?? data.body ?? data;
const documentId = payload?.id ?? payload?.documentId ?? data.id ?? null;

return [{
  json: {
    statusCode,
    response: {
      sucesso: true,
      status_http: statusCode,
      mensagem: 'Fluxo de assinaturas criado com sucesso.',
      codigo_erro: null,
      dados: {
        id: documentId,
        ...((typeof payload === 'object' && payload !== null) ? payload : { resposta: payload }),
      },
      ambiente: meta.ambiente ?? null,
      meta,
    },
  },
}];
`,
    };

    @node({
        id: 'e1430003-0003-4000-8000-000000000007',
        name: 'Return DocumentsCreate Response',
        type: 'n8n-nodes-base.respondToWebhook',
        version: 1.5,
        position: [1280, 300],
    })
    ReturnDocumentscreateResponse = {
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
        this.ReceiveEnotDocumentscreate.out(0).to(this.ValidarEntrada.in(0));
        this.ValidarEntrada.out(0).to(this.EntradaValida.in(0));
        this.EntradaValida.out(0).to(this.DocumentscreateEnot.in(0));
        this.EntradaValida.out(1).to(this.RespostaErroEntrada.in(0));
        this.DocumentscreateEnot.out(0).to(this.BuildDocumentscreateResponse.in(0));
        this.BuildDocumentscreateResponse.out(0).to(this.ReturnDocumentscreateResponse.in(0));
        this.RespostaErroEntrada.out(0).to(this.ReturnDocumentscreateResponse.in(0));
    }
}
