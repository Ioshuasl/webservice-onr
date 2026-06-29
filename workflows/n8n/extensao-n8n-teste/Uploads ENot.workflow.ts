import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : [AUTENOT-2] (enot) Uploads - Documento
// Nodes   : 7  |  Connections: 7
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// ReceiveEnotUpload                  webhook                    [creds]
// ValidarEntrada                     code
// EntradaValida                      if
// RespostaErroEntrada                code
// UploadEnot                         httpRequest                [onError→regular]
// BuildUploadResponse                code
// ReturnUploadResponse               respondToWebhook
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// ReceiveEnotUpload
//    → ValidarEntrada
//      → EntradaValida
//        → UploadEnot
//          → BuildUploadResponse
//            → ReturnUploadResponse
//       .out(1) → RespostaErroEntrada
//          → ReturnUploadResponse (↩ loop)
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'mDaDqI3A5OmKI6Zy',
    name: '[AUTENOT-2] (enot) Uploads - Documento',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class Autenot2EnotUploadsDocumentoWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'e1430002-0002-4000-8000-000000000001',
        webhookId: 'e1430002-0002-4000-8000-000000000011',
        name: 'Receive ENOT Upload',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 300],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    ReceiveEnotUpload = {
        httpMethod: 'POST',
        path: 'enot/documento/upload',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'e1430002-0002-4000-8000-000000000002',
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
const binaryKeys = Object.keys(binary);

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

function resolveApiKey() {
  return pick(
    body.api_key,
    body.apiKey,
    header('x-api-key'),
    header('X-Api-Key'),
    $env.ENOT_API_KEY,
  );
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

const amb = resolveAmbiente();
if (amb.invalid) {
  return erro(
    422,
    'ambiente_invalido',
    'ambiente deve ser homologacao ou producao.',
    { ambiente: amb.informado, aceitos: ['homologacao', 'producao'] },
  );
}

const apiKey = resolveApiKey();
if (!apiKey) {
  return erro(
    422,
    'api_key_ausente',
    'Informe api_key no body, header X-Api-Key ou configure ENOT_API_KEY no n8n.',
    { fontes: ['body.api_key', 'X-Api-Key', 'ENOT_API_KEY'] },
  );
}

const maxBytes = 50 * 1024 * 1024;
const preferredBinaryKeys = ['file', 'pdf', 'arquivo', 'documento'];

function isPdf(fileName, mime) {
  const name = String(fileName || '').toLowerCase();
  const type = String(mime || '').toLowerCase();
  return name.endsWith('.pdf') || type.includes('pdf');
}

async function loadBinaryCandidate(key) {
  let buffer;
  try {
    buffer = await this.helpers.getBinaryDataBuffer(0, key);
  } catch {
    const bin = binary[key];
    if (bin?.data) buffer = Buffer.from(bin.data, 'base64');
  }
  if (!buffer?.length) return null;
  return { key, buffer, bin: binary[key] };
}

async function resolveFromMultipart() {
  const orderedKeys = [
    ...preferredBinaryKeys.filter((key) => binaryKeys.includes(key)),
    ...binaryKeys.filter((key) => !preferredBinaryKeys.includes(key)),
  ];

  for (const key of orderedKeys) {
    const candidate = await loadBinaryCandidate.call(this, key);
    if (!candidate) continue;

    const fileName = pick(
      body.nome_arquivo,
      body.file_name,
      body.name,
      candidate.bin?.fileName,
      candidate.bin?.file_name,
      'ato-livro.pdf',
    );
    const contentType = pick(
      body.content_type,
      body.contentType,
      candidate.bin?.mimeType,
      candidate.bin?.mime_type,
      'application/pdf',
    );

    if (!isPdf(fileName, contentType)) {
      return {
        error: erro(
          422,
          'arquivo_invalido',
          'O arquivo deve ser PDF/A (extensao .pdf ou content-type application/pdf).',
          { binaryKey: key, fileName, contentType },
        ),
      };
    }

    if (candidate.buffer.length > maxBytes) {
      return {
        error: erro(422, 'arquivo_muito_grande', 'Arquivo excede o limite de 50MB.'),
      };
    }

    const preparedFile = await this.helpers.prepareBinaryData(
      candidate.buffer,
      fileName,
      contentType,
    );

    return {
      fileName,
      contentType,
      preparedFile,
      sourceFormat: 'multipart',
      binaryKey: key,
      bytesReceived: candidate.buffer.length,
    };
  }

  return null;
}

function decodeBase64Payload(raw) {
  const text = String(raw ?? '').trim();
  if (!text) return null;
  const cleaned = text.includes(',') ? text.split(',').pop() : text;
  try {
    const buffer = Buffer.from(cleaned, 'base64');
    return buffer.length ? buffer : null;
  } catch {
    return null;
  }
}

async function resolveFromJsonBase64() {
  const base64Raw = pick(
    body.arquivo_base64,
    body.file_base64,
    body.arquivo,
    body.file,
  );
  if (!base64Raw) return null;

  const buffer = decodeBase64Payload(base64Raw);
  if (!buffer) {
    return {
      error: erro(
        422,
        'arquivo_base64_invalido',
        'Nao foi possivel decodificar arquivo_base64 (base64 invalido).',
        { campos: ['arquivo_base64', 'file_base64', 'arquivo', 'file'] },
      ),
    };
  }

  const fileName = pick(body.nome_arquivo, body.file_name, body.name, 'ato-livro.pdf');
  const contentType = pick(body.content_type, body.contentType, 'application/pdf');

  if (!isPdf(fileName, contentType)) {
    return {
      error: erro(
        422,
        'arquivo_invalido',
        'O arquivo deve ser PDF/A (extensao .pdf ou content-type application/pdf).',
        { fileName, contentType },
      ),
    };
  }

  if (buffer.length > maxBytes) {
    return {
      error: erro(422, 'arquivo_muito_grande', 'Arquivo excede o limite de 50MB.'),
    };
  }

  const preparedFile = await this.helpers.prepareBinaryData(buffer, fileName, contentType);

  return {
    fileName,
    contentType,
    preparedFile,
    sourceFormat: 'json_base64',
    binaryKey: 'file',
    bytesReceived: buffer.length,
  };
}

const multipartResolved = await resolveFromMultipart.call(this);
if (multipartResolved?.error) return multipartResolved.error;

const jsonResolved = multipartResolved ? null : await resolveFromJsonBase64.call(this);
if (jsonResolved?.error) return jsonResolved.error;

const resolved = multipartResolved || jsonResolved;
if (!resolved) {
  return erro(
    422,
    'arquivo_ausente',
    'Envie o PDF/A via multipart (campo file, pdf ou arquivo) ou JSON com arquivo_base64.',
    {
      multipart_campos: preferredBinaryKeys,
      json_campos: ['arquivo_base64', 'nome_arquivo', 'content_type'],
    },
  );
}

const baseUrl = amb.baseUrl.replace(/\\/$/, '');

return [{
  json: {
    valid: true,
    uploadUrl: baseUrl + '/api/uploads',
    fileName: resolved.fileName,
    contentType: resolved.contentType,
    apiKey,
    meta: {
      ambiente: amb.key,
      baseUrl,
      endpoint: '/api/uploads',
      sourceFormat: resolved.sourceFormat,
      binaryKey: resolved.binaryKey,
      bytesReceived: resolved.bytesReceived,
      receivedAt: new Date().toISOString(),
      source: 'n8n-enot-upload',
    },
  },
  binary: { file: resolved.preparedFile },
}];
`,
    };

    @node({
        id: 'e1430002-0002-4000-8000-000000000003',
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
                    id: 'cond-enot-upload-valido',
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
        id: 'e1430002-0002-4000-8000-000000000004',
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
        id: 'e1430002-0002-4000-8000-000000000005',
        name: 'Upload ENOT',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [840, 180],
        onError: 'continueRegularOutput',
    })
    UploadEnot = {
        method: 'POST',
        url: '={{ $json.uploadUrl }}',
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
                    name: 'X-Api-Key',
                    value: '={{ $json.apiKey }}',
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
        id: 'e1430002-0002-4000-8000-000000000006',
        name: 'Build Upload Response',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1060, 180],
    })
    BuildUploadResponse = {
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
  const rawMessage = errorObject?.message ?? 'Erro desconhecido ao enviar documento na API e-Notariado.';
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
        endpoint: meta.endpoint ?? '/api/uploads',
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
        mensagem: data.message ?? data.mensagem ?? data.title ?? 'A API e-Notariado retornou erro no upload.',
        status_http: statusCode,
        sistema: 'ENOT',
        ambiente: meta.ambiente ?? null,
        meta,
        dados: data,
      },
    },
  }];
}

const upload = {
  id: data.id ?? data.data?.id ?? null,
  name: data.name ?? data.data?.name ?? entrada.fileName ?? null,
  contentType: data.contentType ?? data.data?.contentType ?? entrada.contentType ?? null,
  location: data.location ?? data.data?.location ?? null,
  displayName: data.displayName ?? data.data?.displayName ?? null,
};

if (!upload.id) {
  return [{
    json: {
      statusCode: 502,
      response: {
        sucesso: false,
        codigo_erro: 'upload_resposta_invalida',
        mensagem: 'Resposta de upload sem id do arquivo.',
        status_http: 502,
        sistema: 'ENOT',
        ambiente: meta.ambiente ?? null,
        meta,
        dados: data,
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
      mensagem: 'Documento PDF/A enviado com sucesso.',
      codigo_erro: null,
      dados: upload,
      ambiente: meta.ambiente ?? null,
      meta,
    },
  },
}];
`,
    };

    @node({
        id: 'e1430002-0002-4000-8000-000000000007',
        name: 'Return Upload Response',
        type: 'n8n-nodes-base.respondToWebhook',
        version: 1.5,
        position: [1280, 300],
    })
    ReturnUploadResponse = {
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
        this.ReceiveEnotUpload.out(0).to(this.ValidarEntrada.in(0));
        this.ValidarEntrada.out(0).to(this.EntradaValida.in(0));
        this.EntradaValida.out(0).to(this.UploadEnot.in(0));
        this.EntradaValida.out(1).to(this.RespostaErroEntrada.in(0));
        this.UploadEnot.out(0).to(this.BuildUploadResponse.in(0));
        this.BuildUploadResponse.out(0).to(this.ReturnUploadResponse.in(0));
        this.RespostaErroEntrada.out(0).to(this.ReturnUploadResponse.in(0));
    }
}
