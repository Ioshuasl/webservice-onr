/**
 * Unifica coleções Postman do WSOficio ONR com variáveis explícitas na coleção
 * (onr-webservice-n8n-variaveis-explicitas.postman_collection.json + espelho legado).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { normalizeLoginFolder, collectLeafRequests } = require("./normalize-login-folder.cjs");
const {
  COLLECTION_NAME,
  COLLECTION_DESCRIPTION,
  COLLECTION_FILE_LEGACY,
  writeCollectionJson,
  collectionOutputPaths,
} = require("./onr-postman-collection-meta.cjs");
const {
  buildExplicitCollectionVariables,
  listWorkflowVariableSources,
} = require("./onr-postman-variables.cjs");
const { requestDisplayName } = require("./onr-postman-request-names.cjs");
const {
  loadRegistryByOp,
  buildRequestNameIndex,
  applyAutonrPrefixes,
  stripAutonrPrefix,
} = require("./onr-postman-autonr-registry.cjs");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const POSTMAN = path.join(ROOT, "postman");

const GET_VAR_HELPER = [
  "function getVar(key) {",
  "  const fromCollection = pm.collectionVariables.get(key);",
  "  if (fromCollection !== undefined && fromCollection !== null && String(fromCollection).length > 0) return fromCollection;",
  "  const fromEnv = pm.environment.get(key);",
  "  if (fromEnv !== undefined && fromEnv !== null && String(fromEnv).length > 0) return fromEnv;",
  "  const fromGlobals = pm.globals.get(key);",
  "  if (fromGlobals !== undefined && fromGlobals !== null && String(fromGlobals).length > 0) return fromGlobals;",
  "  return pm.variables.get(key);",
  "}",
];

const HASH_FROM_LOGIN_TEST = [
  "  if (json.id_usuario != null) {",
  "    pm.collectionVariables.set('onr_id_usuario', String(json.id_usuario));",
  "    pm.environment.set('onr_id_usuario', String(json.id_usuario));",
  "  }",
  "  if (json.id_instituicao != null) {",
  "    pm.collectionVariables.set('onr_id_instituicao', String(json.id_instituicao));",
  "    pm.environment.set('onr_id_instituicao', String(json.id_instituicao));",
  "  }",
  "  pm.collectionVariables.set('onr_tokens', JSON.stringify(json.tokens || []));",
  "  pm.environment.set('onr_tokens', JSON.stringify(json.tokens || []));",
  "  if (Array.isArray(json.hashes)) {",
  "    pm.collectionVariables.set('onr_hashes', JSON.stringify(json.hashes));",
  "    pm.environment.set('onr_hashes', JSON.stringify(json.hashes));",
  "  }",
  "  const tokenIndex = parseInt(getVar('ONR_HASH_TOKEN_INDEX') || '0', 10);",
  "  const token = (json.tokens || [])[tokenIndex] ?? (json.tokens || [])[0];",
  "  pm.collectionVariables.set('onr_token', token || '');",
  "  pm.environment.set('onr_token', token || '');",
  "  const hashFromWorkflow = json.hash || (json.hashes || [])[tokenIndex] || (json.hashes || [])[0];",
  "  if (hashFromWorkflow) {",
  "    pm.collectionVariables.set('onr_hash', hashFromWorkflow);",
  "    pm.environment.set('onr_hash', hashFromWorkflow);",
  "    console.log('onr_hash (workflow):', hashFromWorkflow);",
  "  } else {",
  "    const chave = getVar('ONR_SERVENTIA_CHAVE');",
  "    if (chave && token) {",
  "      const hash = CryptoJS.SHA1(chave + token).toString(CryptoJS.enc.Hex).toUpperCase();",
  "      pm.collectionVariables.set('onr_hash', hash);",
  "      pm.environment.set('onr_hash', hash);",
  "      console.log('onr_hash (Postman):', hash);",
  "    }",
  "  }",
];

function loadJson(file) {
  return JSON.parse(fs.readFileSync(path.join(POSTMAN, file), "utf8"));
}

/** Remove definição legada inteira de getVar antes de injetar GET_VAR_HELPER. */
function stripLegacyGetVar(exec) {
  const out = [];
  let skipping = false;
  let depth = 0;
  for (const line of exec) {
    if (line.includes("function getVar(key)")) {
      skipping = true;
      depth = 0;
      for (const ch of line) {
        if (ch === "{") depth++;
        if (ch === "}") depth--;
      }
      if (depth <= 0) skipping = false;
      continue;
    }
    if (skipping) {
      for (const ch of line) {
        if (ch === "{") depth++;
        if (ch === "}") depth--;
      }
      if (depth <= 0) skipping = false;
      continue;
    }
    out.push(line);
  }
  return out;
}

function isCanonicalGetVar(exec) {
  for (let i = 0; i < GET_VAR_HELPER.length; i++) {
    if (exec[i] !== GET_VAR_HELPER[i]) return false;
  }
  return exec.length >= GET_VAR_HELPER.length;
}

function mergeGetVarHelper(exec) {
  if (isCanonicalGetVar(exec)) return exec;
  if (exec.some((l) => l.includes("function getVar(key)"))) {
    return [...GET_VAR_HELPER, ...stripLegacyGetVar(exec)];
  }
  return [...GET_VAR_HELPER, ...exec];
}

function walkItems(items, fn) {
  for (const item of items) {
    fn(item);
    if (item.item) walkItems(item.item, fn);
  }
}

function certidoesFolder() {
  const src = loadJson("legacy/Certidoes-ONR-n8n.postman_collection.json");

  const requests = [];
  for (const top of src.item) {
    if (top.item) requests.push(...top.item);
  }

  const patched = requests.map((req) => {
    const copy = JSON.parse(JSON.stringify(req));
    for (const ev of copy.event || []) {
      if (ev.listen === "prerequest" && ev.script?.exec) {
        ev.script.exec = mergeGetVarHelper(ev.script.exec);
      }
      const bareName = stripAutonrPrefix(copy.name);
      if (ev.listen === "test" && bareName.includes("Obter XML Solicitacoes v6") && !bareName.includes("protocolo")) {
        const exec = ev.script.exec || [];
        if (!exec.some((l) => l.includes("collectionVariables.set('certidoes_protocolo'"))) {
          exec.push(
            "if (json && json.sucesso && json.dados && json.dados.xml) {",
            "  const match = json.dados.xml.match(/<Protocolo[^>]*>([^<]+)</i) || json.dados.xml.match(/protocolo=\"([^\"]+)\"/i);",
            "  if (match && match[1]) {",
            "    pm.collectionVariables.set('certidoes_protocolo', match[1].trim());",
            "    pm.environment.set('certidoes_protocolo', match[1].trim());",
            "  }",
            "}"
          );
        }
        ev.script.exec = exec;
      }
    }
    return copy;
  });

  return {
    name: "3.6 Certidões a Emitir",
    description:
      "Proxies do módulo 3.6 (`Certidoes.asmx`). Requer `onr_hash` do login.\n\nDocumentação: `webservice-onr/metodos/ObterXMLSolicitacoes_v6.md`, `DevolverCertidao.md`.",
    item: patched,
  };
}

function soapLoginFolder() {
  const src = loadJson("legacy/ONR-WSOficio-Login.postman_collection.json");
  const loginReq = src.item[0].item[0];
  const copy = JSON.parse(JSON.stringify(loginReq));
  copy.name = "LoginUsuarioCertificado — SOAP direto";

  for (const ev of copy.event || []) {
    if (ev.listen === "prerequest") {
      ev.script.exec = [
        ...GET_VAR_HELPER,
        "const required = ['SUBJECTCN', 'ISSUERO', 'PUBLICKEY', 'SERIALNUMBER', 'VALIDUNTIL', 'CPF', 'EMAIL', 'IDParceiroWS'];",
        "const missing = required.filter((k) => !getVar(k));",
        "if (missing.length) {",
        "  throw new Error('Variáveis ausentes: ' + missing.join(', ') + '. Preencha Collection Variables ou Environment.');",
        "}",
        "const endpoint = getVar('ONR_LOGIN_ENDPOINT') || getVar('onr_login_endpoint');",
        "pm.variables.set('onr_login_endpoint_resolved', endpoint);",
      ];
    }
    if (ev.listen === "test") {
      ev.script.exec = [
        "pm.test('HTTP 200', () => pm.response.to.have.status(200));",
        "const body = pm.response.text();",
        "const retornoMatch = body.match(/<(?:\\\\w+:)?RETORNO>(true|false)<\\\\/(?:\\\\w+:)?RETORNO>/i);",
        "const retorno = retornoMatch && retornoMatch[1].toLowerCase() === 'true';",
        "if (!retorno) {",
        "  const cod = body.match(/<(?:\\\\w+:)?CODIGOERRO>(\\\\d+)<\\\\/(?:\\\\w+:)?CODIGOERRO>/);",
        "  const desc = body.match(/<(?:\\\\w+:)?ERRODESCRICAO>([^<]*)<\\\\/(?:\\\\w+:)?ERRODESCRICAO>/);",
        "  pm.test('RETORNO=true', () => { throw new Error(`Login falhou: [${cod?.[1] ?? '?'}] ${desc?.[1] ?? ''}`); });",
        "} else {",
        "  const tokensBlock = body.match(/<(?:\\\\w+:)?Tokens>([\\\\s\\\\S]*?)<\\\\/(?:\\\\w+:)?Tokens>/i);",
        "  const tokens = [];",
        "  if (tokensBlock) {",
        "    const re = /<(?:\\\\w+:)?string[^>]*>([^<]+)<\\\\/(?:\\\\w+:)?string>/gi;",
        "    let m; while ((m = re.exec(tokensBlock[1])) !== null) { if (m[1]) tokens.push(m[1]); }",
        "  }",
        "  pm.test('Tokens retornados', () => pm.expect(tokens.length).to.be.above(0));",
        "  pm.collectionVariables.set('onr_tokens', JSON.stringify(tokens));",
        "  pm.environment.set('onr_tokens', JSON.stringify(tokens));",
        "  const tokenIndex = parseInt(getVar('ONR_HASH_TOKEN_INDEX') || '0', 10);",
        "  const token = tokens[tokenIndex] ?? tokens[0];",
        "  pm.collectionVariables.set('onr_token', token);",
        "  pm.environment.set('onr_token', token);",
        "  const chave = getVar('ONR_SERVENTIA_CHAVE');",
        "  if (chave) {",
        "    const hash = CryptoJS.SHA1(chave + token).toString(CryptoJS.enc.Hex).toUpperCase();",
        "    pm.collectionVariables.set('onr_hash', hash);",
        "    pm.environment.set('onr_hash', hash);",
        "    console.log('onr_hash:', hash);",
        "  }",
        "}",
      ];
    }
  }

  copy.request.url = "{{onr_login_endpoint_resolved}}";
  copy.request.header = copy.request.header.map((h) =>
    h.key === "SOAPAction" ? { ...h, value: "{{onr_soap_action_login}}" } : h
  );

  return {
    name: "SOAP direto (referência)",
    description: "Chamada SOAP nativa a `login.asmx` — sem n8n. Preferir **n8n — Auth ONR** para integrações.",
    item: [copy],
  };
}

function main() {
  const base = loadJson(COLLECTION_FILE_LEGACY);
  base.variable = buildExplicitCollectionVariables({
    workflows: listWorkflowVariableSources(),
    collection: base,
  });

  walkItems(base.item, (item) => {
    if (!item.event) return;
    for (const ev of item.event) {
      if (ev.listen === "prerequest" && ev.script?.exec) {
        ev.script.exec = mergeGetVarHelper(ev.script.exec);
      }
    }
  });

  const loginFolderIdx = base.item.findIndex((i) => i.name.startsWith("3.1"));
  if (loginFolderIdx >= 0) {
    const authFolder = normalizeLoginFolder(base.item[loginFolderIdx]);
    const n8nLeaf = collectLeafRequests(
      authFolder.item?.find((f) => f.name === "n8n — Auth ONR")?.item
    );

    const n8nAuth = {
      name: "n8n — Auth ONR",
      description: "Proxy n8n. Documentação: `scripts/login/Auth WebService ONR.md`",
      item: n8nLeaf.map((req) => {
        const copy = JSON.parse(JSON.stringify(req));
        if (stripAutonrPrefix(copy.name) === "Auth ONR — Login") {
          for (const ev of copy.event || []) {
            if (ev.listen === "test") {
              ev.script.exec = [
                "pm.test('HTTP 200', () => pm.response.to.have.status(200));",
                "let json;",
                "pm.test('Resposta JSON válida', () => {",
                "  json = pm.response.json();",
                "  pm.expect(json.status_http).to.eql(pm.response.code);",
                "});",
                "if (!json || !json.sucesso) return;",
                "pm.test('Tokens retornados', () => { pm.expect(json.tokens.length).to.be.above(0); });",
                ...HASH_FROM_LOGIN_TEST,
              ];
            }
            if (ev.listen === "prerequest") {
              ev.script.exec = [
                ...GET_VAR_HELPER,
                "function hasBasicAuthConfigured() {",
                "  const auth = pm.request.auth;",
                "  if (!auth || auth.type !== 'basic' || !Array.isArray(auth.basic)) return false;",
                "  const user = auth.basic.find((x) => x.key === 'username')?.value;",
                "  const pass = auth.basic.find((x) => x.key === 'password')?.value;",
                "  return Boolean(user && pass && !String(user).includes('{{') && !String(pass).includes('{{'));",
                "}",
                "const required = ['SUBJECTCN', 'ISSUERO', 'PUBLICKEY', 'SERIALNUMBER', 'VALIDUNTIL', 'CPF', 'EMAIL', 'IDParceiroWS'];",
                "if (!getVar('N8N_BASIC_AUTH_USER') || !getVar('N8N_BASIC_AUTH_PASSWORD')) {",
                "  if (!hasBasicAuthConfigured()) required.push('N8N_BASIC_AUTH_USER', 'N8N_BASIC_AUTH_PASSWORD');",
                "}",
                "const missing = required.filter((k) => !getVar(k));",
                "if (missing.length) throw new Error('Variáveis ausentes: ' + missing.join(', '));",
                "pm.variables.set('onr_login_endpoint_resolved', getVar('ONR_LOGIN_ENDPOINT') || getVar('onr_login_endpoint'));",
              ];
            }
          }
          copy.request.body.raw = copy.request.body.raw.replace(
            "{{ONR_LOGIN_ENDPOINT}}",
            "{{onr_login_endpoint_resolved}}"
          );
        }
        return copy;
      }),
    };

    authFolder.item = [n8nAuth, soapLoginFolder()];
    base.item[loginFolderIdx] = authFolder;
  }

  base.item = base.item.filter((i) => !i.name.startsWith("3.6"));
  base.item.push(certidoesFolder());

  base.info.name = COLLECTION_NAME;
  base.info.description = COLLECTION_DESCRIPTION;

  const { byOp, registryPath } = loadRegistryByOp();
  const nameIndex = buildRequestNameIndex({
    registryByOp: byOp,
    requestDisplayName,
  });
  const { unmapped } = applyAutonrPrefixes(base, nameIndex);
  if (unmapped.length) {
    console.warn("AVISO — requests sem AUTONR no registry:", unmapped);
  }
  console.log("Registry AUTONR:", registryPath);
  console.log("Requests mapeados:", nameIndex.size);

  writeCollectionJson(base);
  console.log("OK —", collectionOutputPaths().join(" + "));
  console.log("Variáveis na coleção:", base.variable.length);
  console.log("Pastas raiz:", base.item.map((i) => i.name).join(", "));
}

main();
