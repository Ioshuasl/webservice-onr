/**
 * Snippet embarcado no no Validar Xml Entrada (CCN Upload XML).
 * Sincronizar: node scripts/ccn/build-ccn-validate-snippet.cjs
 */
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
  let value = String(text).slice(0, 131072);
  if (value.charCodeAt(0) === 0xfeff) value = value.slice(1);
  value = value.trimStart();
  if (value.startsWith('<?xml')) {
    const endDecl = value.indexOf('?>');
    if (endDecl >= 0) value = value.slice(endDecl + 2).trimStart();
  }

  const lower = value.toLowerCase();
  if (lower.startsWith('<pessoas')) {
    const next = lower.charAt(8) || '';
    const code = next ? next.charCodeAt(0) : 0;
    return next === '' || next === '>' || next === '/' || next === ':'
      || code === 9 || code === 10 || code === 13 || next === ' ';
  }
  return false;
}

function looksLikePathNotXml(text) {
  const trimmed = String(text).trim();
  return trimmed.length > 0
    && trimmed.length < 512
    && !trimmed.includes('<')
    && /\.xml$/i.test(trimmed)
    && (/\\/.test(trimmed) || trimmed.includes('/'));
}

function looksLikeFilenameOnly(text) {
  const trimmed = String(text).trim();
  return trimmed.length > 0
    && trimmed.length < 260
    && !trimmed.includes('<')
    && /\.xml$/i.test(trimmed)
    && !trimmed.includes('\\')
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
    preview: xmlText.slice(0, 160).replace(/\s+/g, ' '),
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
