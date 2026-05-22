/**
 * Sincroniza postman/onr-webservice-n8n.postman_collection.json com o Postman Cloud.
 *
 * Uso:
 *   node scripts/postman/sync-postman-collection.js           # push único
 *   node scripts/postman/sync-postman-collection.js --watch    # observa alterações
 *   node scripts/postman/sync-postman-collection.js --create   # cria coleção nova na API
 *
 * Variáveis (.env ou postman/.postman-sync.json):
 *   POSTMAN_API_KEY          — API key (https://go.postman.co/settings/me/api-keys)
 *   POSTMAN_COLLECTION_UID   — UID da coleção (Share → Via API → UID)
 *   POSTMAN_WORKSPACE_ID     — opcional, ao usar --create
 */
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const POSTMAN_UID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const COLLECTION_PATH = path.join(ROOT, "postman", "onr-webservice-n8n.postman_collection.json");
const SYNC_CONFIG_PATH = path.join(ROOT, "postman", ".postman-sync.json");
const API_BASE = "https://api.getpostman.com";

dotenv.config({ path: path.join(ROOT, ".env") });

const args = new Set(process.argv.slice(2));
const watchMode = args.has("--watch");
const createMode = args.has("--create");

function loadSyncConfig() {
  if (!fs.existsSync(SYNC_CONFIG_PATH)) return {};
  try {
    return JSON.parse(fs.readFileSync(SYNC_CONFIG_PATH, "utf8"));
  } catch (e) {
    throw new Error(`JSON inválido em ${SYNC_CONFIG_PATH}: ${e.message}`);
  }
}

function saveSyncConfig(patch) {
  const current = loadSyncConfig();
  const next = { ...current, ...patch, updatedAt: new Date().toISOString() };
  fs.writeFileSync(SYNC_CONFIG_PATH, JSON.stringify(next, null, 2) + "\n", "utf8");
  return next;
}

function resolveConfig() {
  const file = loadSyncConfig();
  const apiKey = normalizeConfigValue(
    process.env.POSTMAN_API_KEY || file.apiKey
  );
  const collectionUid = normalizeConfigValue(
    process.env.POSTMAN_COLLECTION_UID || file.collectionUid
  );
  const workspaceId = normalizeConfigValue(
    process.env.POSTMAN_WORKSPACE_ID || file.workspaceId
  );
  return { apiKey, collectionUid, workspaceId, file };
}

function readCollection() {
  if (!fs.existsSync(COLLECTION_PATH)) {
    throw new Error(`Coleção não encontrada: ${COLLECTION_PATH}`);
  }
  return JSON.parse(fs.readFileSync(COLLECTION_PATH, "utf8"));
}

function isValidPostmanId(value) {
  return typeof value === "string" && (UUID_RE.test(value) || POSTMAN_UID_RE.test(value));
}

function isValidCollectionUid(value) {
  return typeof value === "string" && value.length > 0 && POSTMAN_UID_RE.test(value);
}

function isValidWorkspaceId(value) {
  return typeof value === "string" && value.length > 0 && UUID_RE.test(value);
}

/** A API exige info._postman_id em formato UUID (não aceita slugs como onr-webservice-n8n-2026). */
function prepareCollectionForApi(collection, { forCreate }) {
  const next = structuredClone(collection);
  const postmanId = next.info?._postman_id;
  if (forCreate || !isValidPostmanId(postmanId)) {
    next.info = { ...next.info, _postman_id: randomUUID() };
  }
  return next;
}

function normalizeConfigValue(value) {
  if (value == null) return "";
  const s = String(value).trim();
  if (!s || s.startsWith("COLE-") || s.includes("AQUI")) return "";
  return s;
}

async function postmanRequest(method, urlPath, apiKey, body) {
  const res = await fetch(`${API_BASE}${urlPath}`, {
    method,
    headers: {
      "X-Api-Key": apiKey,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }
  if (!res.ok) {
    const msg =
      data?.error?.message ||
      data?.message ||
      (typeof data?.error === "string" ? data.error : null) ||
      text ||
      res.statusText;
    const hint =
      data?.error?.name === "invalidUidError"
        ? " Dica: info._postman_id no JSON deve ser UUID; POSTMAN_COLLECTION_UID no formato 12345678-xxxxxxxx-xxxx-xxxx-xxxxxxxxxxxx (Share → Via API)."
        : "";
    throw new Error(`Postman API ${res.status}: ${msg}${hint}`);
  }
  return data;
}

async function createCollection(apiKey, collection, workspaceId) {
  const payload = {
    collection: prepareCollectionForApi(collection, { forCreate: true }),
  };
  if (isValidWorkspaceId(workspaceId)) payload.workspace = workspaceId;
  const data = await postmanRequest("POST", "/collections", apiKey, payload);
  const uid = data.collection?.uid || data.uid;
  if (!uid) {
    throw new Error(
      "Coleção criada, mas UID não retornado. Copie o UID no Postman (Share → Via API)."
    );
  }
  const postmanId = payload.collection.info._postman_id;
  saveSyncConfig({
    collectionUid: uid,
    collectionName: collection.info?.name,
    postmanId,
  });
  persistLocalPostmanId(postmanId);
  return uid;
}

function persistLocalPostmanId(postmanId) {
  if (!isValidPostmanId(postmanId)) return;
  const raw = readCollection();
  if (raw.info?._postman_id === postmanId) return;
  raw.info = { ...raw.info, _postman_id: postmanId };
  fs.writeFileSync(COLLECTION_PATH, JSON.stringify(raw, null, 2) + "\n", "utf8");
  console.log(`_postman_id local atualizado: ${postmanId}`);
}

async function updateCollection(apiKey, collectionUid, collection) {
  if (!isValidCollectionUid(collectionUid)) {
    throw new Error(
      `POSTMAN_COLLECTION_UID inválido: "${collectionUid}". Use o UID completo (Share → Via API), ex.: 35976147-c006bdfe-e1be-4773-80d2-5fa0effed952`
    );
  }
  await postmanRequest(
    "PUT",
    `/collections/${encodeURIComponent(collectionUid)}`,
    apiKey,
    { collection: prepareCollectionForApi(collection, { forCreate: false }) }
  );
}

async function syncOnce() {
  const { apiKey, collectionUid, workspaceId } = resolveConfig();
  if (!apiKey) {
    throw new Error(
      "Defina POSTMAN_API_KEY no .env (ou apiKey em postman/.postman-sync.json)."
    );
  }

  const collection = readCollection();
  const name = collection.info?.name || "ONR WebService — n8n";

  let uid = isValidCollectionUid(collectionUid) ? collectionUid : "";

  if (createMode) {
    console.log(`Criando coleção "${name}" no Postman Cloud…`);
    uid = await createCollection(apiKey, collection, workspaceId);
    console.log(`Criada. UID salvo em postman/.postman-sync.json: ${uid}`);
    console.log(`Defina no .env: POSTMAN_COLLECTION_UID=${uid}`);
    return;
  }

  if (!uid) {
    throw new Error(
      "POSTMAN_COLLECTION_UID ausente ou inválido. Rode: npm run postman:sync:create " +
        "ou copie o UID (Share → Via API) para .env / postman/.postman-sync.json"
    );
  }

  console.log(`Atualizando coleção "${name}" (${uid})…`);
  await updateCollection(apiKey, uid, collection);
  saveSyncConfig({ collectionUid: uid, collectionName: name });
  console.log("OK — coleção sincronizada.");
}

function debounce(fn, ms) {
  let t;
  return (...a) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...a), ms);
  };
}

function startWatch() {
  const debounced = debounce(async () => {
    try {
      await syncOnce();
    } catch (e) {
      console.error("[postman:sync]", e.message);
    }
  }, 400);

  console.log(`Observando ${COLLECTION_PATH} (debounce 400ms)…`);
  fs.watch(COLLECTION_PATH, { persistent: true }, (eventType) => {
    if (eventType === "change") debounced();
  });
  debounced();
}

try {
  if (watchMode) {
    await syncOnce();
    startWatch();
  } else {
    await syncOnce();
  }
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
