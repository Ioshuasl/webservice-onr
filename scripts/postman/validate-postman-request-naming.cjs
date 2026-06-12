#!/usr/bin/env node
/**
 * Valida (e opcionalmente corrige) nomenclatura AUTONR nos requests Postman.
 *
 * Uso:
 *   node scripts/postman/validate-postman-request-naming.cjs
 *   node scripts/postman/validate-postman-request-naming.cjs --fix
 *   node scripts/postman/validate-postman-request-naming.cjs postman/RIB-n8n.postman_collection.json
 */
const fs = require("fs");
const path = require("path");
const {
  collectLeafRequests,
  ensureCanonicalPrefix,
  isCanonicalAutonrName,
  isLegacyColonAutonrName,
  migrateLegacyColonNaming,
  stripAutonrPrefix,
} = require("./postman-request-naming.cjs");

const ROOT = path.resolve(__dirname, "../..");
const POSTMAN = path.join(ROOT, "postman");

/** Coleções sem card AUTONR no Plane — requests não precisam de prefixo. */
const EXEMPT_COLLECTIONS = new Set([
  "assinador-onr.postman_collection.json",
  "ONR-Login-Pronto.postman_collection.json",
]);

/** Todas as folhas devem usar `[AUTONR-n] …` (formato canônico). */
const STRICT_COLLECTIONS = new Set([
  "onr-webservice-n8n.postman_collection.json",
  "onr-webservice-n8n-variaveis-explicitas.postman_collection.json",
  "RIB-n8n.postman_collection.json",
  "CCN-Upload-XML-n8n.postman_collection.json",
  "censec-n8n.postman_collection.json",
  "DOI-Validate-JSON-n8n.postman_collection.json",
  "Parse-Memorial-SIGEF-n8n.postman_collection.json",
  "cnib-n8n/collection_postman.json",
]);

/** Prefixo por pasta pai (ou `*` para folhas na raiz). */
const COLLECTION_FOLDER_KEYS = {
  "CCN-Upload-XML-n8n.postman_collection.json": {
    "CCN Upload XML": "AUTCCN-1",
    "CCN Get Import Status": "AUTCCN-2",
    "CCN Get Import Erros": "AUTCCN-3",
  },
  "censec-n8n.postman_collection.json": {
    "*": "AUTCENSEC-1",
  },
  "DOI-Validate-JSON-n8n.postman_collection.json": {
    "DOI Validate JSON": "AUTDOI-1",
  },
  "Parse-Memorial-SIGEF-n8n.postman_collection.json": {
    "Parse Memorial SIGEF": "AUTONR-86",
  },
};

function resolvePlaneKeyForLeaf(fileName, leaf) {
  const map = COLLECTION_FOLDER_KEYS[fileName];
  if (!map) return null;
  if (map["*"] && leaf.folders.length === 0) return map["*"];
  const parent = leaf.folders[leaf.folders.length - 1];
  return map[parent] || map["*"] || null;
}

function applyFolderPrefixes(collection, fileName) {
  const map = COLLECTION_FOLDER_KEYS[fileName];
  if (!map) return 0;
  let changed = 0;
  for (const leaf of collectLeafRequests(collection.item)) {
    if (isCanonicalAutonrName(leaf.name)) continue;
    const planeKey = resolvePlaneKeyForLeaf(fileName, leaf);
    if (!planeKey) continue;
    const next = ensureCanonicalPrefix(leaf.name, planeKey);
    if (next !== leaf.name) {
      leaf.item.name = next;
      changed += 1;
    }
  }
  return changed;
}

function validateCollection(collection, fileName) {
  const errors = [];
  const leaves = collectLeafRequests(collection.item);

  if (EXEMPT_COLLECTIONS.has(fileName)) {
    return { ok: true, errors, leaves: leaves.length };
  }

  const strict = STRICT_COLLECTIONS.has(fileName);

  for (const leaf of leaves) {
    const { name } = leaf;
    if (isLegacyColonAutonrName(name)) {
      errors.push(`${fileName}: formato legado AUTONR-n: — use "[AUTONR-n] …" → "${name}"`);
      continue;
    }
    if (strict && !isCanonicalAutonrName(name)) {
      const planeKey = resolvePlaneKeyForLeaf(fileName, leaf);
      if (planeKey) {
        errors.push(
          `${fileName}: request sem prefixo Plane — esperado "${ensureCanonicalPrefix(name, planeKey)}" → "${name}"`
        );
      } else {
        errors.push(`${fileName}: request sem prefixo Plane canônico → "${name}"`);
      }
    }
  }

  return { ok: errors.length === 0, errors, leaves: leaves.length };
}

function fixCollection(collection, fileName) {
  let changed = 0;
  changed += migrateLegacyColonNaming(collection);
  changed += applyFolderPrefixes(collection, fileName);
  return changed;
}

function isCollectionFile(name) {
  return name.endsWith(".postman_collection.json") || name === "collection_postman.json";
}

function collectionKey(filePath) {
  const rel = path.relative(POSTMAN, filePath).replace(/\\/g, "/");
  if (rel.startsWith("..")) return path.basename(filePath);
  return rel;
}

function listTargetCollections(argv) {
  const files = argv.filter((a) => isCollectionFile(path.basename(a)));
  if (files.length) {
    return files.map((f) => path.resolve(process.cwd(), f));
  }
  const fromRoot = fs
    .readdirSync(POSTMAN)
    .filter((f) => f.endsWith(".postman_collection.json") && !f.includes(" copy"))
    .map((f) => path.join(POSTMAN, f));
  const cnibDir = path.join(POSTMAN, "cnib-n8n");
  if (fs.existsSync(path.join(cnibDir, "collection_postman.json"))) {
    fromRoot.push(path.join(cnibDir, "collection_postman.json"));
  }
  return fromRoot;
}

function validateCollectionFile(filePath, { fix = false } = {}) {
  const fileName = collectionKey(filePath);
  const collection = JSON.parse(fs.readFileSync(filePath, "utf8"));

  if (fix) {
    const changed = fixCollection(collection, fileName);
    if (changed > 0) {
      fs.writeFileSync(filePath, JSON.stringify(collection, null, 2) + "\n", "utf8");
      console.log(`Corrigido ${changed} nome(s) em ${fileName}`);
    }
  }

  return validateCollection(collection, fileName);
}

function main() {
  const fix = process.argv.includes("--fix");
  const paths = listTargetCollections(process.argv.slice(2).filter((a) => !a.startsWith("--")));

  let totalErrors = 0;
  for (const filePath of paths) {
    const fileName = collectionKey(filePath);
    if (!fs.existsSync(filePath)) {
      console.warn("Arquivo não encontrado:", filePath);
      continue;
    }
    const result = validateCollectionFile(filePath, { fix });
    if (result.ok) {
      console.log(`OK — ${fileName} (${result.leaves} requests)`);
    } else {
      totalErrors += result.errors.length;
      console.error(`FALHA — ${fileName}:`);
      for (const err of result.errors) console.error("  •", err);
    }
  }

  if (totalErrors > 0) {
    console.error(`\n${totalErrors} violação(ões). Rode com --fix para corrigir migrações automáticas.`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  EXEMPT_COLLECTIONS,
  STRICT_COLLECTIONS,
  validateCollection,
  validateCollectionFile,
  fixCollection,
};
