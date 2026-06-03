#!/usr/bin/env node
/**
 * Copia coleções Postman para projetos-orius/N8N (somente .postman_collection.json).
 * Variáveis HML explícitas ficam em collection.variable — não gera ambiente separado.
 *
 * Uso: node scripts/postman/sync-postman-to-orius-n8n.cjs
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const REPO_ROOT = path.resolve(__dirname, '../..');
const POSTMAN_SRC = path.join(REPO_ROOT, 'postman');
const DEFAULT_ORIUS_N8N = path.resolve(process.env.USERPROFILE || '', 'projetos-orius/N8N');
const VAULT_ENV = path.resolve(
  process.env.USERPROFILE || '',
  'OneDrive/Documentos/Obsidian Vault/env.md',
);

const OUT_DIR = (() => {
  const i = process.argv.indexOf('--out');
  return i >= 0 && process.argv[i + 1] ? path.resolve(process.argv[i + 1]) : DEFAULT_ORIUS_N8N;
})();

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeCollection(postmanDir, fileName, collection) {
  fs.mkdirSync(postmanDir, { recursive: true });
  cleanupPostmanDir(postmanDir);
  writeJson(path.join(postmanDir, fileName), collection);
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function cleanupPostmanDir(dir) {
  if (!fs.existsSync(dir)) return;
  for (const name of fs.readdirSync(dir)) {
    if (
      name.endsWith('.postman_environment.json') ||
      name === 'README.md' ||
      name === '.readme-content.json'
    ) {
      fs.unlinkSync(path.join(dir, name));
    }
  }
}

function readVaultEnv() {
  const env = {};
  if (!fs.existsSync(VAULT_ENV)) return env;
  for (const line of fs.readFileSync(VAULT_ENV, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.+)$/);
    if (m) env[m[1]] = m[2];
  }
  return env;
}

function readCertFields() {
  const certPath = path.join(REPO_ROOT, 'cert-fields.json');
  if (!fs.existsSync(certPath)) return {};
  return readJson(certPath);
}

function uuid() {
  return crypto.randomUUID();
}

/** Mescla overrides em collection.variable (Postman collection variables). */
function applyCollectionVariables(collection, overrides) {
  const map = new Map();
  for (const v of collection.variable || []) {
    map.set(v.key, { key: v.key, value: String(v.value ?? ''), type: v.type || 'string' });
  }
  for (const [key, value] of Object.entries(overrides)) {
    map.set(key, { key, value: String(value ?? ''), type: 'string' });
  }
  collection.variable = Array.from(map.values());
  return collection;
}

function templateValues(template, overrides = {}) {
  const values = {};
  for (const v of template.values || []) {
    values[v.key] = overrides[v.key] !== undefined ? overrides[v.key] : v.value;
  }
  for (const [key, value] of Object.entries(overrides)) {
    if (values[key] === undefined) values[key] = value;
  }
  return values;
}

function filterKeys(allValues, predicate) {
  const filtered = allValues.filter((v) => predicate(v.key));
  const always = [
    'n8n_base_url',
    'n8n_webhook_mode',
    'N8N_BASIC_AUTH_USER',
    'N8N_BASIC_AUTH_PASSWORD',
    'onr_hash',
    'onr_token',
    'onr_tokens',
    'onr_id_usuario',
    'onr_id_instituicao',
  ];
  for (const key of always) {
    if (!filtered.some((v) => v.key === key)) {
      const src = allValues.find((v) => v.key === key);
      if (src) filtered.unshift(src);
    }
  }
  return Object.fromEntries(filtered.map((v) => [v.key, v.value]));
}

function extractOnrSlice(source, folderName, collectionTitle) {
  const folder = source.item.find((i) => i.name === folderName);
  if (!folder) throw new Error(`Pasta não encontrada na coleção ONR: ${folderName}`);

  return {
    info: {
      _postman_id: uuid(),
      name: collectionTitle,
      description: `${folder.description || folderName}\n\nVariáveis HML explícitas em **Collection variables** (aba Variables da coleção).\n\n**Pré-requisito Auth ONR:** execute **Auth ONR — Login** (pasta Auth) antes dos demais métodos — grava \`onr_hash\`.`,
      schema: source.info.schema,
    },
    auth: source.auth,
    variable: [...(source.variable || [])],
    event: source.event,
    item: folder.item || [folder],
  };
}

function main() {
  const vault = readVaultEnv();
  const cert = readCertFields();

  const n8nBase = vault.N8N_BASE_URL || 'https://api-n8n.gbrqne.easypanel.host';
  const n8nUser = vault.N8N_BASIC_AUTH_USER || 'orius';
  const n8nPass = vault.N8N_BASIC_AUTH_PASSWORD || 'master@orius';

  const commonOverrides = {
    n8n_base_url: n8nBase,
    N8N_BASIC_AUTH_USER: n8nUser,
    N8N_BASIC_AUTH_PASSWORD: n8nPass,
    N8N_BASE_URL: n8nBase,
  };

  const onrTemplate = readJson(
    path.join(POSTMAN_SRC, 'onr-webservice-n8n.postman_environment.template.json'),
  );
  const authTemplate = readJson(
    path.join(POSTMAN_SRC, 'Auth-ONR-n8n.postman_environment.template.json'),
  );
  const onrHomologTemplate = readJson(
    path.join(POSTMAN_SRC, 'ONR-Homologacao.postman_environment.template.json'),
  );

  const certOverrides = {
    SUBJECTCN: cert.SUBJECTCN || '',
    ISSUERO: cert.ISSUERO || '',
    PUBLICKEY: cert.PUBLICKEY || '',
    SERIALNUMBER: cert.SERIALNUMBER || '',
    VALIDUNTIL: cert.VALIDUNTIL || '',
    IDParceiroWS: onrHomologTemplate.values.find((v) => v.key === 'IDParceiroWS')?.value || '5',
    ONR_SERVENTIA_CHAVE: '',
    CPF: '',
    EMAIL: '',
    ONR_LOGIN_ENDPOINT: 'https://hml3-wsoficio.onr.org.br/login.asmx',
    n8n_webhook_id: '163d6b2d-36fa-4c1c-bb1b-ed6085de7de2',
  };

  const onrSource = readJson(path.join(POSTMAN_SRC, 'onr-webservice-n8n.postman_collection.json'));

  const onrSlices = [
    {
      folder: '3.1 Login — Auth ONR',
      dest: path.join(OUT_DIR, 'WebService ONR', 'Auth'),
      collectionFile: 'Auth-ONR-n8n.postman_collection.json',
      title: 'Auth ONR — n8n Webhook',
      vars: () => ({
        ...templateValues(authTemplate, { ...commonOverrides, ...certOverrides }),
      }),
    },
    {
      folder: '3.2 Acompanhamento de Títulos',
      dest: path.join(OUT_DIR, 'WebService ONR', 'Acompanhamento de titulos'),
      collectionFile: 'Acompanhamento-Titulos-AT-n8n.postman_collection.json',
      title: 'Acompanhamento de Títulos AT — n8n',
      vars: () =>
        filterKeys(onrTemplate.values, (k) =>
          k.startsWith('n8n_') ||
          k.startsWith('N8N_') ||
          k.startsWith('ACOMPANHAMENTO_') ||
          k.startsWith('onr_') ||
          k === 'url_servico_acompanhamento_titulos',
        ),
    },
    {
      folder: '3.3 Penhora Online',
      dest: path.join(OUT_DIR, 'WebService ONR', 'Penhora Online'),
      collectionFile: 'Penhora-Online-PO-n8n.postman_collection.json',
      title: 'Penhora Online PO — n8n',
      vars: () =>
        filterKeys(onrTemplate.values, (k) =>
          k.startsWith('n8n_') ||
          k.startsWith('N8N_') ||
          k.startsWith('PENHORA_') ||
          k.startsWith('onr_') ||
          k === 'url_servico_penhora_online',
        ),
    },
    {
      folder: '3.5 Ofícios',
      dest: path.join(OUT_DIR, 'WebService ONR', 'Oficios'),
      collectionFile: 'Oficios-OE-n8n.postman_collection.json',
      title: 'Ofícios OE — n8n',
      vars: () =>
        filterKeys(onrTemplate.values, (k) =>
          k.startsWith('n8n_') ||
          k.startsWith('N8N_') ||
          k.startsWith('OFICIOS_') ||
          k.startsWith('onr_') ||
          k === 'url_servico_oficios',
        ),
    },
  ];

  const certidoesPostmanDir = path.join(OUT_DIR, 'WebService ONR', 'Certidoes', 'postman');
  fs.mkdirSync(certidoesPostmanDir, { recursive: true });
  const fullOnrDest = path.join(certidoesPostmanDir, 'onr-webservice-n8n.postman_collection.json');
  fs.copyFileSync(
    path.join(POSTMAN_SRC, 'onr-webservice-n8n.postman_collection.json'),
    fullOnrDest,
  );
  console.log(`✓ ${path.relative(OUT_DIR, fullOnrDest)} (coleção unificada)`);

  for (const slice of onrSlices) {
    const postmanDir = path.join(slice.dest, 'postman');
    let collection = extractOnrSlice(onrSource, slice.folder, slice.title);
    const vars = { ...slice.vars(), ...commonOverrides };
    collection = applyCollectionVariables(collection, vars);
    writeCollection(postmanDir, slice.collectionFile, collection);
    console.log(`✓ ${path.relative(OUT_DIR, postmanDir)}/${slice.collectionFile}`);
  }

  const ccnTemplate = readJson(
    path.join(POSTMAN_SRC, 'CCN-Upload-XML-n8n.postman_environment.template.json'),
  );
  let ccn = readJson(path.join(POSTMAN_SRC, 'CCN-Upload-XML-n8n.postman_collection.json'));
  ccn.info.name = 'CCN Upload XML — n8n Webhook';
  ccn = applyCollectionVariables(ccn, {
    ...templateValues(ccnTemplate, {
      ...commonOverrides,
      n8n_webhook_mode: 'webhook-test',
      ccn_n8n_webhook_path: 'ccn/uploads',
      n8n_webhook_id_ccn_import_status: 'b2f3a4c5-d6e7-4890-b1c2-d3e4f5a6b7c8',
      n8n_webhook_id_ccn_import_erros: 'c4d5e6f7-a8b9-4012-d3e4-f5a6b7c8d9e0',
      n8n_workflow_id: 'oy22MYSQfB7CYcbl',
      n8n_import_status_workflow_id: 'STRA45Ya8zFPl8YM',
      n8n_import_erros_workflow_id: 'TUbsvYHrfuS9xf2P',
      CCN_X_API_KEY:
        vault.CCN_X_API_KEY ||
        'ORIUS TECNOLOGIA  GOIANIAGO|6e4aef5e74f09a4ebf029655e893c93812ecbf62179d6458911582e20a96c021',
      CCN_X_SUBSCRIPTION:
        vault.CCN_X_SUBSCRIPTION || 'd2efe9cc-23f9-4bd2-06c0-08ddf76de010',
      CCN_X_AMBIENTE: vault.CCN_X_AMBIENTE || 'homologacao',
      CNS_HOMOLOGACAO: vault.CNS_HOMOLOGACAO || '995936',
      CCN_HML_BASE_URL:
        vault.CCN_HML_BASE_URL || 'https://pessoas-hml.e-notariado.org.br',
      CCN_XML_PATH: path.join(REPO_ROOT, 'scripts/ccn/exemplo-ccn-minimo.xml').replace(/\\/g, '/'),
      CCN_XML_INVALID_PATH: path
        .join(REPO_ROOT, 'scripts/ccn/exemplo-ccn-raiz-invalida.xml')
        .replace(/\\/g, '/'),
      ccn_upload_id: '',
      ccn_upload_location: '',
      ccn_import_id: '',
    }),
  });
  writeCollection(path.join(OUT_DIR, 'CCN', 'postman'), 'CCN-Upload-XML-n8n.postman_collection.json', ccn);
  console.log('✓ CCN/postman/CCN-Upload-XML-n8n.postman_collection.json');

  let censec = readJson(path.join(POSTMAN_SRC, 'censec-n8n.postman_collection.json'));
  censec = applyCollectionVariables(censec, {
    ...commonOverrides,
    n8n_webhook_mode: 'webhook-test',
    censec_n8n_webhook_path: 'censec/cargas/upload-json',
    n8n_workflow_id: 'tav97HSLIT79LpwO',
    CENSEC_API_KEY:
      'ORIUS TECNOLOGIA   GOIANIAGO|2612740d82dfcc4a8a41e6ba22944c7a16090bc6c194d2099375aad63765f401',
    CENSEC_CARTORIO_ID: '2d25345a-8b82-4f93-5757-08ddfb6856c0',
    CENSEC_HML_BASE_URL: 'https://hml.censec.org.br',
    CNS_HOMOLOGACAO: '995936',
  });
  writeCollection(path.join(OUT_DIR, 'Censec', 'postman'), 'censec-n8n.postman_collection.json', censec);
  console.log('✓ Censec/postman/censec-n8n.postman_collection.json');

  const doiTemplate = readJson(
    path.join(POSTMAN_SRC, 'DOI-Validate-JSON-n8n.postman_environment.template.json'),
  );
  let doi = readJson(path.join(POSTMAN_SRC, 'DOI-Validate-JSON-n8n.postman_collection.json'));
  doi.info.name = 'DOI Validate JSON — n8n Webhook';
  doi = applyCollectionVariables(doi, {
    ...templateValues(doiTemplate, {
      ...commonOverrides,
      n8n_workflow_id: 'HewsInHfw3Gfrs5Z',
      doi_exemplo_json_path: path
        .join(REPO_ROOT, 'scripts/doi/exemplo-doi-valido.json')
        .replace(/\\/g, '/'),
    }),
  });
  writeCollection(path.join(OUT_DIR, 'DOI', 'postman'), 'DOI-Validate-JSON-n8n.postman_collection.json', doi);
  console.log('✓ DOI/postman/DOI-Validate-JSON-n8n.postman_collection.json');

  const sigefTemplate = readJson(
    path.join(POSTMAN_SRC, 'Parse-Memorial-SIGEF-n8n.postman_environment.template.json'),
  );
  let sigef = readJson(path.join(POSTMAN_SRC, 'Parse-Memorial-SIGEF-n8n.postman_collection.json'));
  sigef.info.name = 'Parse Memorial SIGEF — n8n Webhook';
  sigef = applyCollectionVariables(sigef, {
    ...templateValues(sigefTemplate, {
      ...commonOverrides,
      n8n_webhook_path: 'sigef/memorial/parse',
      n8n_workflow_id: 'drRULxhBQUk10wbw',
    }),
  });
  writeCollection(
    path.join(OUT_DIR, 'SIGEF', 'postman'),
    'Parse-Memorial-SIGEF-n8n.postman_collection.json',
    sigef,
  );
  console.log('✓ SIGEF/postman/Parse-Memorial-SIGEF-n8n.postman_collection.json');

  writeJson(path.join(OUT_DIR, 'postman-manifest.json'), {
    syncedAt: new Date().toISOString(),
    source: path.join(REPO_ROOT, 'postman'),
    format: 'collection-only (variables in collection.variable)',
    destinations: [
      'WebService ONR/Auth/postman/*.postman_collection.json',
      'WebService ONR/Acompanhamento de titulos/postman/*.postman_collection.json',
      'WebService ONR/Penhora Online/postman/*.postman_collection.json',
      'WebService ONR/Oficios/postman/*.postman_collection.json',
      'WebService ONR/Certidoes/postman/onr-webservice-n8n.postman_collection.json',
      'CCN/postman/*.postman_collection.json',
      'Censec/postman/*.postman_collection.json',
      'DOI/postman/*.postman_collection.json',
      'SIGEF/postman/*.postman_collection.json',
    ],
  });

  console.log(`\nPostman sync → ${OUT_DIR} (somente coleções)`);
}

main();
