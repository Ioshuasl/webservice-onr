import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : CCN Upload XML
// Nodes   : 7  |  Connections: 7
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// ReceiveCcnUpload                   webhook                    [creds]
// ValidarXmlEntrada                  code
// EntradaValida                      if
// RespostaErroEntrada                code
// UploadXmlToCcn                     httpRequest                [onError→regular]
// BuildUploadResponse                code
// ReturnUploadResponse               respondToWebhook
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// ReceiveCcnUpload
//    → ValidarXmlEntrada
//      → EntradaValida
//        → UploadXmlToCcn
//          → BuildUploadResponse
//            → ReturnUploadResponse
//       .out(1) → RespostaErroEntrada
//          → ReturnUploadResponse (↩ loop)
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'oy22MYSQfB7CYcbl',
    name: 'CCN Upload XML',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class CcnUploadXmlWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: '8b7c5d6e-7132-4dd6-9e5a-d372708ff5f4',
        webhookId: '9899d3fe-8c27-42ee-a3b1-899b4a297cd6',
        name: 'Receive CCN Upload',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 300],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    ReceiveCcnUpload = {
        httpMethod: 'POST',
        path: 'ccn/uploads',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: '6bdf34ac-3807-45a2-9aaf-8f3b0858c716',
        name: 'Validar Xml Entrada',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [280, 300],
    })
    ValidarXmlEntrada = {
        mode: 'runOnceForAllItems',
        language: 'javaScript',
        jsCode: `
const item = $input.first();
const binary = item.binary ?? {};
const keys = Object.keys(binary);
const body = item.json?.body ?? {};

function header(name) {
  const headers = item.json?.headers ?? {};
  const lower = name.toLowerCase();
  return headers[lower] ?? headers[name] ?? '';
}

function resolveAmbiente() {
  const raw = String(header('x-ambiente') || 'homologacao').toLowerCase();
  if (raw === 'producao' || raw === 'production' || raw === 'prod') {
    return { key: 'producao', baseUrl: 'https://pessoas.e-notariado.org.br' };
  }
  return { key: 'homologacao', baseUrl: 'https://pessoas-hml.e-notariado.org.br' };
}

function erro(status, code, message, technical) {
  const response = {
    success: false,
    message,
    errors: [{ code, message, sistema: 'CCN' }],
  };
  if (technical) response.technical = technical;
  return [{
    json: {
      valid: false,
      statusCode: status,
      response,
    },
  }];
}

if (!keys.length) {
  return erro(422, 'arquivo_ausente', 'Envie o XML CCN no campo multipart "file" (ou "xml").');
}

function decodeXmlBuffer(buffer) {
  const head = buffer.slice(0, Math.min(buffer.length, 256)).toString('latin1').toLowerCase();
  if (head.includes('encoding="utf-8"') || head.includes("encoding='utf-8'")) {
    return buffer.toString('utf8');
  }
  return buffer.toString('latin1');
}

function stripLeadingNoise(text) {
  let value = String(text);
  if (value.charCodeAt(0) === 0xfeff) value = value.slice(1);
  value = value.trim();
  if (value.startsWith('<?xml')) {
    const endDecl = value.indexOf('?>');
    if (endDecl >= 0) value = value.slice(endDecl + 2).trim();
  }
  return value;
}

function hasPessoasRoot(text) {
  const sample = String(text).slice(0, 131072);
  const lower = sample.toLowerCase();
  let idx = lower.indexOf('<pessoas');
  while (idx >= 0) {
    const next = lower.charAt(idx + 9);
    if (next === '>' || next === ' ' || next === '/' || next === ':' || next === '') {
      return true;
    }
    idx = lower.indexOf('<pessoas', idx + 9);
  }
  return false;
}

function looksLikePathNotXml(text) {
  const trimmed = String(text).trim();
  return trimmed.length > 0
    && trimmed.length < 512
    && !trimmed.includes('<')
    && /\\.xml$/i.test(trimmed)
    && (/\\\\/.test(trimmed) || trimmed.includes('/'));
}

function looksLikeFilenameOnly(text) {
  const trimmed = String(text).trim();
  return trimmed.length > 0
    && trimmed.length < 260
    && !trimmed.includes('<')
    && /\\.xml$/i.test(trimmed)
    && !trimmed.includes('\\\\')
    && !trimmed.includes('/');
}

async function loadBinaryCandidates() {
  const candidates = [];
  for (const key of keys) {
    let buffer;
    try {
      buffer = await this.helpers.getBinaryDataBuffer(0, key);
    } catch {
      const bin = binary[key];
      if (bin?.data) buffer = Buffer.from(bin.data, 'base64');
    }
    if (buffer?.length) {
      candidates.push({ key, buffer, bin: binary[key] });
    }
  }
  return candidates;
}

function pickBestXmlCandidate(candidates) {
  let best = null;
  let bestScore = -Infinity;
  for (const candidate of candidates) {
    const xmlText = decodeXmlBuffer(candidate.buffer);
    let score = 0;
    if (hasPessoasRoot(xmlText)) score += 10000;
    else if (hasPessoasRoot(stripLeadingNoise(xmlText))) score += 9000;
    if (xmlText.includes('<?xml')) score += 200;
    if (xmlText.toLowerCase().includes('<pessoas')) score += 500;
    if (looksLikeFilenameOnly(xmlText)) score -= 20000;
    if (looksLikePathNotXml(xmlText)) score -= 20000;
    score += Math.min(candidate.buffer.length, 500000) / 1000;
    if (candidate.key === 'file') score += 50;
    if (candidate.key === 'xml') score += 40;
    if (candidate.key === 'data') score += 10;
    if (score > bestScore) {
      bestScore = score;
      best = { ...candidate, xmlText };
    }
  }
  return best;
}

const candidates = await loadBinaryCandidates.call(this);
if (!candidates.length) {
  return erro(422, 'xml_ilegivel', 'Nao foi possivel ler o conteudo do XML enviado.', {
    binaryKeys: keys,
  });
}

const picked = pickBestXmlCandidate(candidates);
if (!picked) {
  return erro(422, 'xml_ilegivel', 'Nao foi possivel identificar o arquivo XML no multipart.', {
    binaryKeys: keys,
  });
}

const fileName = String(
  body.name || picked.bin?.fileName || picked.bin?.file_name || 'CCN-upload.xml',
);
const mime = String(picked.bin?.mimeType || picked.bin?.mime_type || 'text/xml').toLowerCase();

if (!fileName.toLowerCase().endsWith('.xml') && !mime.includes('xml')) {
  return erro(422, 'arquivo_invalido', 'O arquivo deve ser XML (.xml ou content-type xml).', {
    binaryKeys: keys,
    selectedKey: picked.key,
  });
}

const maxBytes = 25 * 1024 * 1024;
if (picked.buffer.length > maxBytes) {
  return erro(422, 'arquivo_muito_grande', 'Arquivo excede o limite de 25MB.');
}

const xmlText = picked.xmlText;

if (looksLikeFilenameOnly(xmlText) || looksLikePathNotXml(xmlText)) {
  return erro(
    422,
    'arquivo_invalido',
    'O Postman nao anexou o XML (so o nome do arquivo). Selecione o .xml no campo file (tipo File) com caminho completo ou defina CCN_XML_PATH.',
    {
      binaryKeys: keys,
      selectedKey: picked.key,
      bytesReceived: picked.buffer.length,
      preview: xmlText.slice(0, 120),
    },
  );
}

if (!hasPessoasRoot(stripLeadingNoise(xmlText)) && !hasPessoasRoot(xmlText)) {
  return erro(422, 'xml_raiz_invalida', 'XML deve conter elemento raiz <pessoas>.', {
    binaryKeys: keys,
    selectedKey: picked.key,
    bytesReceived: picked.buffer.length,
    preview: xmlText.slice(0, 160).replace(/\\s+/g, ' '),
  });
}

const amb = resolveAmbiente();
const ccnApiKey = header('x-ccn-api-key') || header('x-api-key') || ($env.CCN_X_API_KEY ?? '');
if (!ccnApiKey) {
  return erro(
    422,
    'api_key_ausente',
    'Informe header X-Ccn-Api-Key (ou X-Api-Key) ou configure CCN_X_API_KEY no n8n.',
  );
}

const contentType = String(body.contentType || 'text/xml');
const preparedFile = await this.helpers.prepareBinaryData(picked.buffer, fileName, contentType);

return [{
  json: {
    valid: true,
    fileName,
    contentType,
    uploadUrl: amb.baseUrl + '/api/uploads',
    meta: {
      ambiente: amb.key,
      baseUrl: amb.baseUrl,
      ccnApiKey,
      receivedAt: new Date().toISOString(),
      source: 'n8n-ccn-upload-xml',
      binaryKey: picked.key,
      bytesReceived: picked.buffer.length,
    },
  },
  binary: { file: preparedFile },
}];
`,
    };

    @node({
        id: 'cbb53dc1-5beb-45e7-8339-cdb1c4f6f869',
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
                    id: 'cond-xml-valido',
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
        id: '78c05aff-232a-47b9-af47-fa4052cf4805',
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
      success: false,
      message: 'Entrada rejeitada pela validacao local.',
      errors: [],
    },
  },
}];
`,
    };

    @node({
        id: 'fbaa715d-b0a5-449b-85e6-6b38196d1ad4',
        name: 'Upload XML to CCN',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [840, 180],
        onError: 'continueRegularOutput',
    })
    UploadXmlToCcn = {
        method: 'POST',
        url: '={{ $json.uploadUrl }}',
        authentication: 'none',
        sendHeaders: true,
        specifyHeaders: 'keypair',
        headerParameters: {
            parameters: [
                {
                    name: 'X-Api-Key',
                    value: '={{ $json.meta.ccnApiKey }}',
                },
                {
                    name: 'Accept',
                    value: 'application/json',
                },
            ],
        },
        sendBody: true,
        contentType: 'multipart-form-data',
        specifyBody: 'keypair',
        bodyParameters: {
            parameters: [
                {
                    name: 'name',
                    value: '={{ $json.fileName }}',
                    parameterType: 'formData',
                },
                {
                    name: 'contentType',
                    value: '={{ $json.contentType }}',
                    parameterType: 'formData',
                },
                {
                    name: 'file',
                    parameterType: 'formBinaryData',
                    inputDataFieldName: 'file',
                },
            ],
        },
        options: {},
    };

    @node({
        id: '7445bc44-424b-47d1-acb2-09da04995589',
        name: 'Build Upload Response',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1120, 180],
    })
    BuildUploadResponse = {
        mode: 'runOnceForAllItems',
        language: 'javaScript',
        jsCode: `
const result = items[0].json;
const error = result.error;
const failed = Boolean(error);
const meta = $('Validar Xml Entrada').first().json.meta ?? {};

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
  const rawMessage = errorObject?.message ?? 'Erro desconhecido ao chamar API CCN.';
  const status = Number(
    errorObject?.status
      ?? errorObject?.httpCode
      ?? rawMessage.match(/^\\s*(\\d{3})\\s*-/)?.[1]
      ?? 502,
  );
  const parsed = parseJsonSafe(errorObject?.response?.body)
    ?? parseJsonSafe(errorObject?.response?.data)
    ?? (typeof errorObject?.response?.body === 'object' ? errorObject.response.body : null);

  return {
    statusCode: status || 502,
    message: parsed?.message ?? parsed?.title ?? rawMessage,
    errors: [{ code: 'ccn_http_error', message: parsed?.message ?? rawMessage, sistema: 'CCN' }],
    technical: {
      name: errorObject?.name ?? null,
      code: errorObject?.code ?? null,
      status: status || null,
    },
  };
}

if (!failed) {
  const upload = result.id ? result : result;
  return [{
    json: {
      statusCode: 200,
      response: {
        success: true,
        message: 'Upload CCN realizado com sucesso.',
        upload: {
          id: upload.id,
          location: upload.location,
          name: upload.name,
          contentType: upload.contentType,
        },
        meta,
      },
    },
  }];
}

const normalized = normalizeHttpError(error);
return [{
  json: {
    statusCode: normalized.statusCode,
    response: {
      success: false,
      message: normalized.message,
      errors: normalized.errors,
      technical: normalized.technical,
      meta,
    },
  },
}];
`,
    };

    @node({
        id: '41fd071b-e82e-412a-848c-d202726b66fb',
        name: 'Return Upload Response',
        type: 'n8n-nodes-base.respondToWebhook',
        version: 1.5,
        position: [1400, 300],
    })
    ReturnUploadResponse = {
        respondWith: 'json',
        responseBody: '={{ $json.response }}',
        options: {
            responseCode: '={{ $json.statusCode || 200 }}',
        },
    };

    // =====================================================================
    // ROUTAGE ET CONNEXIONS
    // =====================================================================

    @links()
    defineRouting() {
        this.ReceiveCcnUpload.out(0).to(this.ValidarXmlEntrada.in(0));
        this.ValidarXmlEntrada.out(0).to(this.EntradaValida.in(0));
        this.EntradaValida.out(0).to(this.UploadXmlToCcn.in(0));
        this.EntradaValida.out(1).to(this.RespostaErroEntrada.in(0));
        this.UploadXmlToCcn.out(0).to(this.BuildUploadResponse.in(0));
        this.BuildUploadResponse.out(0).to(this.ReturnUploadResponse.in(0));
        this.RespostaErroEntrada.out(0).to(this.ReturnUploadResponse.in(0));
    }
}
