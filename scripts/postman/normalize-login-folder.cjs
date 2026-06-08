/**
 * Normaliza a pasta 3.1 Login — remove aninhamento duplicado de "n8n — Auth ONR" e "SOAP direto".
 */
const fs = require('fs');
const path = require('path');

const LOGIN_DESC =
  'Autenticação ONR (`LoginUsuarioCertificado`). Use **n8n — Auth ONR** em integrações; SOAP direto só para debug.';
const N8N_FOLDER_DESC = 'Proxy n8n. Documentação: `scripts/login/Auth WebService ONR.md`';
const SOAP_FOLDER_DESC =
  'Chamada SOAP nativa a `login.asmx` — sem n8n. Preferir **n8n — Auth ONR** para integrações.';

const { stripAutonrPrefix } = require('./onr-postman-autonr-registry.cjs');

const N8N_REQUEST_ORDER = ['Auth ONR — Login', 'Auth ONR — CPF inválido', 'Auth ONR — CPF ausente'];

function bareRequestName(name) {
  return stripAutonrPrefix(name);
}

function collectLeafRequests(items, out = []) {
  for (const it of items || []) {
    if (it.request) out.push(it);
    else if (it.item) collectLeafRequests(it.item, out);
  }
  return out;
}

function dedupeRequestsByName(requests) {
  const map = new Map();
  for (const r of requests) {
    const key = bareRequestName(r.name);
    if (!map.has(key)) map.set(key, r);
  }
  return map;
}

/**
 * @param {object} loginFolder pasta 3.1 Login (pode estar aninhada incorretamente)
 * @returns {object} estrutura canônica com 2 subpastas
 */
function normalizeLoginFolder(loginFolder) {
  const leaves = collectLeafRequests(loginFolder?.item);
  const byName = dedupeRequestsByName(leaves);

  const n8nItems = [];
  for (const name of N8N_REQUEST_ORDER) {
    if (byName.has(name)) n8nItems.push(byName.get(name));
  }
  for (const [name, req] of byName) {
    if (N8N_REQUEST_ORDER.includes(name)) continue;
    if (/^Auth ONR/i.test(name) && req.request) n8nItems.push(req);
  }

  const soapItems = [];
  for (const [name, req] of byName) {
    const bare = bareRequestName(name);
    if (/SOAP direto|LoginUsuarioCertificado/i.test(bare) || /SOAP direto|LoginUsuarioCertificado/i.test(name)) {
      soapItems.push(req);
    }
  }

  const item = [];
  if (n8nItems.length) {
    item.push({
      name: 'n8n — Auth ONR',
      description: N8N_FOLDER_DESC,
      item: n8nItems,
    });
  }
  if (soapItems.length) {
    item.push({
      name: 'SOAP direto (referência)',
      description: SOAP_FOLDER_DESC,
      item: soapItems,
    });
  }

  return {
    name: '3.1 Login',
    description: loginFolder?.description || LOGIN_DESC,
    item,
  };
}

/** Conta pastas "n8n — Auth ONR" em qualquer profundidade. */
function countNestedN8nAuthFolders(items, depth = 0) {
  let count = 0;
  for (const it of items || []) {
    if (it.name === 'n8n — Auth ONR' && it.item && !it.request) count += 1;
    if (it.item) count += countNestedN8nAuthFolders(it.item, depth + 1);
  }
  return count;
}

function main() {
  const collectionPath = process.argv[2] || path.join(__dirname, '../../postman/onr-webservice-n8n.postman_collection.json');
  const collection = JSON.parse(fs.readFileSync(collectionPath, 'utf8'));
  const idx = collection.item.findIndex((i) => i.name && i.name.startsWith('3.1'));
  if (idx < 0) {
    console.error('Pasta 3.1 Login não encontrada');
    process.exit(1);
  }
  const before = countNestedN8nAuthFolders(collection.item[idx].item);
  collection.item[idx] = normalizeLoginFolder(collection.item[idx]);
  const after = countNestedN8nAuthFolders(collection.item[idx].item);
  fs.writeFileSync(collectionPath, JSON.stringify(collection, null, 2) + '\n', 'utf8');
  console.log('OK —', collectionPath);
  console.log(`Pastas "n8n — Auth ONR": ${before} → ${after} (esperado 1)`);
  console.log('Subpastas 3.1:', collection.item[idx].item.map((i) => i.name).join(', '));
}

if (require.main === module) {
  main();
}

module.exports = {
  normalizeLoginFolder,
  collectLeafRequests,
  countNestedN8nAuthFolders,
};
