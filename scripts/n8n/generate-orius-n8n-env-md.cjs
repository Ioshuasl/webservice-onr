/**
 * Gera env.md por integração em orius N8N/ com valores HML explícitos.
 * Fontes: .env.example, templates/coleções Postman, Obsidian Vault/env.md, manifest.json
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "../..");
const ORIUS_N8N = path.join(ROOT, "orius N8N");
const POSTMAN = path.join(ROOT, "postman");
const ENV_EXAMPLE = path.join(ROOT, ".env.example");
const VAULT_ENV = path.join(
  process.env.USERPROFILE || "",
  "OneDrive/Documentos/Obsidian Vault/env.md"
);

/** Valores não secretos (URLs, IDs públicos HML) — seguros para versionar no Git. */
const PUBLIC_DEFAULTS = {
  N8N_BASE_URL: "https://api-n8n.gbrqne.easypanel.host",
  N8N_BASIC_AUTH_USER: "orius",
  POSTMAN_COLLECTION_UID_CCN: "35976147-b300e43d-cdf7-4230-8db5-ca4fd7d28e27",
  CCN_X_SUBSCRIPTION: "d2efe9cc-23f9-4bd2-06c0-08ddf76de010",
  CNS_HOMOLOGACAO: "995936",
};

/** Nunca gravar no env.md do repo — GitHub push protection / secret scanning. */
const GIT_REDACT_KEYS = new Set([
  "POSTMAN_API_KEY",
  "N8N_API_KEY",
  "N8N_BASIC_AUTH_PASSWORD",
  "CCN_X_API_KEY",
  "CENSEC_API_KEY",
  "MAPA_ONR_API_BEARER_POLIGONOS",
  "CERT_PASSWORD",
]);

const INCLUDE_SECRETS = process.argv.includes("--include-secrets");

const RUNTIME_EMPTY_HINT = new Set([
  "onr_hash",
  "onr_token",
  "onr_tokens",
  "onr_id_usuario",
  "onr_id_instituicao",
  "certidoes_protocolo",
  "ccn_upload_id",
  "ccn_upload_location",
  "ccn_import_id",
  "sigef_memorial_uuid",
  "sigef_memorial_nome",
  "sigef_codigo_incra_sncr",
  "POSTMAN_COLLECTION_UID",
  "POSTMAN_WORKSPACE_ID",
]);

const INTEGRATIONS = {
  shared: {
    dir: ORIUS_N8N,
    title: "Variáveis compartilhadas — n8n Orius",
    description:
      "Instância n8n, Basic Auth dos webhooks, certificado ONR e sync Postman. Usadas por várias integrações.",
    match: (key) =>
      /^(N8N_|POSTMAN_|CERT_|CERT_PASSWORD|CPF|EMAIL|PUBLICKEY|VALIDUNTIL|SUBJECTCN|ISSUERO|SERIALNUMBER|IDParceiroWS|PUBLICKEY_FORMAT|VALIDUNTIL_FORMAT|ONR_SERVENTIA|ONR_HASH|MAPA_)/.test(
        key
      ),
    extraSections: [
      {
        heading: "Certificado digital (Auth ONR / SOAP)",
        body:
          "Após configurar `CERT_PATH` e `CERT_PASSWORD`, rode no repo automacoes e testes:\n\n```bash\nnode scripts/extract_cert/extract_cert.js\nnode scripts/postman/export-postman-env.js\n```\n\nIsso preenche `SUBJECTCN`, `PUBLICKEY`, `ISSUERO`, `SERIALNUMBER`, `VALIDUNTIL`, `CPF`, `EMAIL`, `IDParceiroWS` no `.env` local e no Postman.",
      },
    ],
  },
  onr: {
    dir: path.join(ORIUS_N8N, "WebService ONR"),
    title: "WebService ONR (WSOficio)",
    description:
      "Proxies n8n para login.asmx, acompanhamentotitulos.asmx, penhoraonline.asmx, oficios.asmx, Certidoes.asmx e bdlight.asmx.",
    match: (key) =>
      /^(ACOMPANHAMENTO_TITULOS_|PENHORA_ONLINE_|BDLIGHT_|OFICIOS_|CERTIDOES_|ONR_)/.test(key) ||
      /^(n8n_|url_servico_|onr_|certidoes_)/i.test(key),
    postmanCollection: path.join(POSTMAN, "onr-webservice-n8n.postman_collection.json"),
    extraSections: [
      {
        heading: "Uso no Postman",
        body:
          "Coleção `automacoes e testes/postman/onr-webservice-n8n.postman_collection.json` (cópia em `WebService ONR/onr-webservice-n8n.postman_collection.json`). Fluxo: **3.1 Login** grava `onr_hash` → requests 3.2–3.6.",
      },
    ],
  },
  ccn: {
    dir: path.join(ORIUS_N8N, "CCN"),
    title: "CCN — Cadastro de pessoas (e-notariado)",
    description:
      "Gateways n8n: Upload XML, Get Import Status, Get Import Erros. API pessoas-hml.e-notariado.org.br.",
    postmanEnv: path.join(POSTMAN, "CCN-Upload-XML-n8n.postman_environment.template.json"),
    extraSections: [
      {
        heading: "Headers na API e-notariado",
        body:
          "| Header | Variável |\n|--------|----------|\n| X-Api-Key | CCN_X_API_KEY (app + pipe + token) |\n| X-Subscription | CCN_X_SUBSCRIPTION — obrigatório em POST /api/imports |\n| X-Ambiente | homologacao ou producao (gateway n8n) |",
      },
      {
        heading: "Workflows n8n (manifest)",
        body:
          "| Workflow | ID n8n |\n|----------|--------|\n| CCN Upload XML | oy22MYSQfB7CYcbl |\n| CCN Get Import Status | STRA45Ya8zFPl8YM |\n| CCN Get Import Erros | TUbsvYHrfuS9xf2P |",
      },
    ],
  },
  censec: {
    dir: path.join(ORIUS_N8N, "Censec"),
    title: "CENSEC — Upload JSON",
    description: "Gateway n8n CENSEC Upload JSON Gateway → censec.org.br/api/cargas/upload-json.",
    postmanCollection: path.join(ORIUS_N8N, "Censec/postman/censec-n8n.postman_collection.json"),
    extraSections: [
      {
        heading: "Autenticação",
        body:
          "- Webhook n8n: Basic Auth (N8N_BASIC_AUTH_USER / N8N_BASIC_AUTH_PASSWORD)\n- API CENSEC: header X-Api-Key = CENSEC_API_KEY",
      },
    ],
  },
  doi: {
    dir: path.join(ORIUS_N8N, "DOI"),
    title: "DOI — Validação JSON",
    description: "Workflow DOI Validate JSON — validação local de payload.",
    postmanEnv: path.join(POSTMAN, "DOI-Validate-JSON-n8n.postman_environment.template.json"),
    manifestName: "DOI Validate JSON",
    extraSections: [],
  },
  sigef: {
    dir: path.join(ORIUS_N8N, "SIGEF"),
    title: "SIGEF — Parse memorial",
    description: "Workflow Parse Memorial SIGEF — upload PDF memorial via multipart.",
    postmanEnv: path.join(POSTMAN, "Parse-Memorial-SIGEF-n8n.postman_environment.template.json"),
    manifestName: "Parse Memorial SIGEF",
    extraSections: [
      {
        heading: "PDF de teste",
        body:
          "Defina MEMORIAL_PDF_PATH com caminho absoluto para um PDF de memorial SIGEF (INCRA). Exemplo no repo: buscar em `scripts/` ou documentação SIGEF do projeto automacoes e testes.",
      },
    ],
  },
};

function loadPostmanVars(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const list = data.variable || data.values || [];
  const map = {};
  for (const v of list) {
    if (v.key) map[v.key] = v.value ?? "";
  }
  return map;
}

function parseVaultEnvBlocks() {
  const map = { ...PUBLIC_DEFAULTS };
  if (!INCLUDE_SECRETS || !fs.existsSync(VAULT_ENV)) return map;
  const text = fs.readFileSync(VAULT_ENV, "utf8");
  let inEnv = false;
  for (const line of text.split("\n")) {
    if (line.trim() === "```env") {
      inEnv = true;
      continue;
    }
    if (inEnv && line.trim() === "```") {
      inEnv = false;
      continue;
    }
    if (!inEnv) continue;
    const m = line.match(/^([A-Za-z][A-Za-z0-9_]*)=(.*)$/);
    if (m) map[m[1]] = m[2];
  }
  return map;
}

function parseEnvExample(content) {
  const blocks = [];
  let currentComment = [];
  let currentVars = [];

  const flush = () => {
    if (currentComment.length || currentVars.length) {
      blocks.push({ comments: [...currentComment], vars: [...currentVars] });
      currentComment = [];
      currentVars = [];
    }
  };

  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) {
      flush();
      continue;
    }
    if (trimmed.startsWith("#")) {
      if (currentVars.length) flush();
      currentComment.push(trimmed.replace(/^#\s?/, ""));
      continue;
    }
    const m = trimmed.match(/^([A-Z][A-Z0-9_]*)=(.*)$/);
    if (m) currentVars.push({ key: m[1], value: m[2] });
  }
  flush();
  return blocks;
}

function resolveValue(key, rawValue, overrides) {
  if (overrides[key] !== undefined && overrides[key] !== "") return overrides[key];
  if (rawValue !== undefined && rawValue !== "") return rawValue;
  if (overrides[key] !== undefined) return overrides[key];
  return rawValue ?? "";
}

function redactForGit(key, value) {
  if (INCLUDE_SECRETS) return value;
  if (GIT_REDACT_KEYS.has(key)) return "";
  if (/API_KEY|BEARER|_PASSWORD$/i.test(key) && String(value).length > 8) return "";
  return value;
}

function formatEnvLine(key, value) {
  const v = redactForGit(key, value);
  if (GIT_REDACT_KEYS.has(key) && !INCLUDE_SECRETS) {
    return `${key}=  # preencher: Obsidian Vault env.md ou .env local (não versionar)`;
  }
  if (v === "" && RUNTIME_EMPTY_HINT.has(key)) {
    return `${key}=  # preenchido em runtime (login/upload/parse)`;
  }
  return `${key}=${v}`;
}

function buildEnvBlock(blocks, overrides) {
  const lines = [];
  for (const block of blocks) {
    if (block.comments.length) {
      for (const c of block.comments) lines.push(`# ${c}`);
    }
    for (const v of block.vars) {
      const val = resolveValue(v.key, v.value, overrides);
      lines.push(formatEnvLine(v.key, val));
    }
    if (block.vars.length) lines.push("");
  }
  return lines.join("\n").trim();
}

function buildEnvFromMap(map, comment) {
  const lines = comment ? [`# ${comment}`, ""] : [];
  for (const [key, value] of Object.entries(map).sort(([a], [b]) => a.localeCompare(b))) {
    lines.push(formatEnvLine(key, resolveValue(key, value, {})));
  }
  return lines.join("\n").trim();
}

function routeBlocks(blocks, matchFn) {
  const routed = [];
  for (const block of blocks) {
    const vars = block.vars.filter((v) => matchFn(v.key));
    if (vars.length) routed.push({ comments: block.comments, vars });
  }
  return routed;
}

function loadManifestWorkflowId(name) {
  const manifestPath = path.join(ORIUS_N8N, "manifest.json");
  if (!fs.existsSync(manifestPath)) return "";
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const wf = (manifest.workflows || []).find((w) => w.name === name);
  return wf?.id || "";
}

function writeEnvMd(integrationKey, envContent) {
  const cfg = INTEGRATIONS[integrationKey];
  const sections = [
    `# ${cfg.title}`,
    "",
    `> ${cfg.description}`,
    "",
    "## Segurança",
    "",
    "- Repositório de uso interno Orius (homologação). Não expor fora do time.",
    "- Copie para `.env` local em automacoes e testes ou para Collection variables do Postman.",
    "- Secrets (Postman API key, n8n API key, CCN/CENSEC): Obsidian Vault `env.md` ou `.env` local.",
    "- Gerar env.md **com** secrets só na máquina: `node scripts/n8n/generate-orius-n8n-env-md.cjs --include-secrets` (não commitar).",
    "",
    "## Variáveis",
    "",
    "```env",
    envContent,
    "```",
    "",
  ];

  for (const extra of cfg.extraSections || []) {
    sections.push(`## ${extra.heading}`, "", extra.body, "", "");
  }

  if (integrationKey === "shared") {
    sections.push(
      "## Integrações (env.md por pasta)",
      "",
      "| Pasta | Arquivo |",
      "|-------|---------|",
      "| WebService ONR/ | [env.md](WebService%20ONR/env.md) |",
      "| CCN/ | [env.md](CCN/env.md) |",
      "| Censec/ | [env.md](Censec/env.md) |",
      "| DOI/ | [env.md](DOI/env.md) |",
      "| SIGEF/ | [env.md](SIGEF/env.md) |",
      ""
    );
  } else {
    sections.push(
      "## Ver também",
      "",
      "- [env.md compartilhado](../env.md)",
      "- Coleção Postman em postman/ desta pasta",
      "- [.env.example](../../.env.example) no repo automacoes e testes",
      ""
    );
  }

  const outPath = path.join(cfg.dir, "env.md");
  fs.mkdirSync(cfg.dir, { recursive: true });
  fs.writeFileSync(outPath, sections.join("\n"), "utf8");
  return outPath;
}

function main() {
  const overrides = parseVaultEnvBlocks();
  const example = fs.readFileSync(ENV_EXAMPLE, "utf8");
  const blocks = parseEnvExample(example);
  const written = [];

  // shared
  const sharedBlocks = routeBlocks(blocks, INTEGRATIONS.shared.match);
  const n8nShared = {
    N8N_BASE_URL: overrides.N8N_BASE_URL || PUBLIC_DEFAULTS.N8N_BASE_URL,
    N8N_API_KEY: overrides.N8N_API_KEY,
    N8N_BASIC_AUTH_USER: overrides.N8N_BASIC_AUTH_USER || PUBLIC_DEFAULTS.N8N_BASIC_AUTH_USER,
    N8N_BASIC_AUTH_PASSWORD: overrides.N8N_BASIC_AUTH_PASSWORD,
    MAPA_ONR_API_BEARER_POLIGONOS: overrides.MAPA_ONR_API_BEARER_POLIGONOS,
  };
  let sharedEnv = buildEnvFromMap(n8nShared, "n8n — Easypanel");
  sharedEnv += `\n\n${buildEnvBlock(sharedBlocks, overrides)}`;
  sharedEnv += `\n\n# Sync Postman — coleção CCN\nPOSTMAN_COLLECTION_UID_CCN=${overrides.POSTMAN_COLLECTION_UID_CCN}`;
  written.push(writeEnvMd("shared", sharedEnv));

  // ONR: .env.example + coleção Postman completa
  const onrBlocks = routeBlocks(blocks, INTEGRATIONS.onr.match);
  const postmanOnr = loadPostmanVars(INTEGRATIONS.onr.postmanCollection);
  const onrOverrides = { ...overrides, ...postmanOnr };
  // Garantir IDs de título/status do .env.example quando Postman deixa vazio
  onrOverrides.ACOMPANHAMENTO_TITULOS_ID_TITULO =
    onrOverrides.ACOMPANHAMENTO_TITULOS_ID_TITULO || "18151720";
  onrOverrides.ACOMPANHAMENTO_TITULOS_ID_STATUS =
    onrOverrides.ACOMPANHAMENTO_TITULOS_ID_STATUS || "66701083";
  onrOverrides.ONR_SERVENTIA_CHAVE =
    onrOverrides.ONR_SERVENTIA_CHAVE || "3BE1BF10-6792-4563-9ED7-9C2DA455F233";
  let onrEnv = buildEnvBlock(onrBlocks, onrOverrides);
  const postmanOnly = Object.keys(postmanOnr)
    .filter((k) => !onrBlocks.some((b) => b.vars.some((v) => v.key === k)))
    .sort();
  if (postmanOnly.length) {
    const extra = {};
    for (const k of postmanOnly) extra[k] = postmanOnr[k];
    onrEnv += `\n\n${buildEnvFromMap(extra, "Postman — variáveis adicionais (webhooks / runtime)")}`;
  }
  written.push(writeEnvMd("onr", onrEnv));

  // CCN
  const ccnMap = {
    ...loadPostmanVars(INTEGRATIONS.ccn.postmanEnv),
    ...Object.fromEntries(
      Object.entries(overrides).filter(([k]) => /^(CCN_|CNS_)/.test(k))
    ),
  };
  written.push(writeEnvMd("ccn", buildEnvFromMap(ccnMap, "CCN homologação + n8n")));

  // CENSEC
  const censecMap = loadPostmanVars(INTEGRATIONS.censec.postmanCollection);
  censecMap.n8n_workflow_id =
    censecMap.n8n_workflow_id || loadManifestWorkflowId("CENSEC Upload JSON Gateway");
  written.push(writeEnvMd("censec", buildEnvFromMap(censecMap, "CENSEC + n8n")));

  // DOI
  const doiMap = loadPostmanVars(INTEGRATIONS.doi.postmanEnv);
  doiMap.n8n_workflow_id =
    doiMap.n8n_workflow_id || loadManifestWorkflowId(INTEGRATIONS.doi.manifestName);
  doiMap.N8N_BASIC_AUTH_USER =
    doiMap.N8N_BASIC_AUTH_USER || overrides.N8N_BASIC_AUTH_USER || PUBLIC_DEFAULTS.N8N_BASIC_AUTH_USER;
  if (INCLUDE_SECRETS) {
    doiMap.N8N_BASIC_AUTH_PASSWORD =
      doiMap.N8N_BASIC_AUTH_PASSWORD || overrides.N8N_BASIC_AUTH_PASSWORD;
  }
  written.push(writeEnvMd("doi", buildEnvFromMap(doiMap, "DOI + n8n")));

  // SIGEF
  const sigefMap = loadPostmanVars(INTEGRATIONS.sigef.postmanEnv);
  sigefMap.n8n_workflow_id =
    sigefMap.n8n_workflow_id || loadManifestWorkflowId(INTEGRATIONS.sigef.manifestName);
  sigefMap.N8N_BASIC_AUTH_USER =
    sigefMap.N8N_BASIC_AUTH_USER || overrides.N8N_BASIC_AUTH_USER || PUBLIC_DEFAULTS.N8N_BASIC_AUTH_USER;
  if (INCLUDE_SECRETS) {
    sigefMap.N8N_BASIC_AUTH_PASSWORD =
      sigefMap.N8N_BASIC_AUTH_PASSWORD || overrides.N8N_BASIC_AUTH_PASSWORD;
  }
  // Defina no Postman ou .env local — não há PDF fixo no repo
  if (!sigefMap.MEMORIAL_PDF_PATH) {
    sigefMap.MEMORIAL_PDF_PATH =
      "c:/Users/kenio/automacoes e testes/caminho/para/memorial-sigef.pdf";
  }
  written.push(writeEnvMd("sigef", buildEnvFromMap(sigefMap, "SIGEF + n8n")));

  console.log("OK — env.md com valores explícitos:");
  for (const p of written) console.log(" ", p);
}

main();
