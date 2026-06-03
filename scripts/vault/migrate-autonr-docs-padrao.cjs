#!/usr/bin/env node
/**
 * Migra documentação de automações n8n para o padrão:
 *   utilizacao/{Operacao}.md + desenvolvimento/{Operacao}.md
 *   por-metodo/{Operacao}.md → redirecionamento
 *
 * Uso:
 *   node scripts/vault/migrate-autonr-docs-padrao.cjs
 *   node scripts/vault/migrate-autonr-docs-padrao.cjs --dry-run
 */

const fs = require('fs');
const path = require('path');
const {
  buildPostmanGitSection,
  buildRequestDefinitionSection,
} = require('./postman-n8n-doc.cjs');

const REPO_ROOT = path.resolve(__dirname, '../..');
const WORKFLOWS_DIR = path.join(REPO_ROOT, 'workflows', 'n8n', 'extensao-n8n-teste');
const VAULT = path.join(
  process.env.USERPROFILE || '',
  'OneDrive/Documentos/Obsidian Vault',
);
const REGISTRY_PATH = path.join(VAULT, 'Meta/integracoes/plane/maps/autonr-work-items.json');
const ENV_EXAMPLE = path.join(REPO_ROOT, '.env.example');
const N8N_BASE = 'https://api-n8n.gbrqne.easypanel.host';

const DOMAIN_LABEL = {
  auth: 'Autenticação',
  PO: 'Penhora Online',
  OE: 'Ofício Eletrônico',
  AT: 'Acompanhamento de Títulos',
  certidoes: 'Certidões',
  CENSEC: 'CENSEC',
  CCN: 'CCN',
  DOI: 'DOI',
  SIGEF: 'SIGEF',
  geral: 'Geral',
};

const INTEGRATION_LABEL = {
  auth: 'webservice ONR',
  PO: 'webservice ONR',
  OE: 'webservice ONR',
  AT: 'webservice ONR',
  certidoes: 'webservice ONR',
  CENSEC: 'CENSEC',
  CCN: 'CCN',
  DOI: 'DOI',
  SIGEF: 'SIGEF',
  geral: 'webservice ONR',
};

const SOAP_ENDPOINT = {
  AT: 'https://hml3-wsoficio.onr.org.br/acompanhamentotitulos.asmx',
  PO: 'https://hml3-wsoficio.onr.org.br/penhoraonline.asmx',
  OE: 'https://hml3-wsoficio.onr.org.br/oficios.asmx',
  certidoes: 'https://hml3-wsoficio.onr.org.br/Certidoes.asmx',
  auth: 'https://hml3-wsoficio.onr.org.br/login.asmx',
};

const OP_DOMAIN_OVERRIDE = {
  LoginUsuarioCertificado: 'auth',
  CENSEC_UploadJSON: 'CENSEC',
  SetPedidoFinalizarPrenotacaoVencida: 'PO',
  DOI_ValidateJSON: 'DOI',
  CCN_Uploads: 'CCN',
  CCN_ImportsGet: 'CCN',
  CCN_ImportsErros: 'CCN',
  ParseMemorialSIGEF: 'SIGEF',
};

const FILE_TO_OP = {
  'Auth WebService ONR.workflow.ts': 'LoginUsuarioCertificado',
  'Obter XML Solicitacoes V6.workflow.ts': 'ObterXMLSolicitacoes_v6',
  'Devolver Certidao.workflow.ts': 'DevolverCertidao',
  'CCN Upload XML.workflow.ts': 'CCN_Uploads',
  'CCN Get Import Status.workflow.ts': 'CCN_ImportsGet',
  'CCN Get Import Erros.workflow.ts': 'CCN_ImportsErros',
  'CENSEC Upload JSON Gateway.workflow.ts': 'CENSEC_UploadJSON',
  'DOI Validate JSON.workflow.ts': 'DOI_ValidateJSON',
  'Parse Memorial SIGEF.workflow.ts': 'ParseMemorialSIGEF',
};

const LEGACY_GATEWAY = {
  CCN_Uploads: 'n8n-upload-xml-gateway.md',
  CCN_ImportsGet: 'n8n-get-import-status-gateway.md',
  CCN_ImportsErros: 'n8n-get-import-erros-gateway.md',
  CENSEC_UploadJSON: 'n8n-upload-json-gateway.md',
  DOI_ValidateJSON: 'n8n-validate-json-gateway.md',
};

const VAULT_BASE = {
  auth: 'Orius/integracoes/registro-imoveis/onr/webservice-wsoficio/automacao',
  AT: 'Orius/integracoes/registro-imoveis/onr/webservice-wsoficio/automacao',
  PO: 'Orius/integracoes/registro-imoveis/onr/webservice-wsoficio/automacao',
  OE: 'Orius/integracoes/registro-imoveis/onr/webservice-wsoficio/automacao',
  certidoes: 'Orius/integracoes/registro-imoveis/onr/webservice-wsoficio/automacao',
  CCN: 'Orius/integracoes/tabelionato-notas/ccn/automacao',
  CENSEC: 'Orius/integracoes/tabelionato-notas/censec/automacao',
  DOI: 'Orius/integracoes/tabelionato-notas/doi/automacao',
  SIGEF: 'Orius/integracoes/registro-imoveis/automacao/sigef',
  geral: 'Orius/integracoes/registro-imoveis/onr/webservice-wsoficio/automacao',
};

const PRODUTO = {
  auth: 'imoveis',
  AT: 'imoveis',
  PO: 'imoveis',
  OE: 'imoveis',
  certidoes: 'imoveis',
  CCN: 'notas',
  CENSEC: 'notas',
  DOI: 'notas',
  SIGEF: 'imoveis',
  geral: 'imoveis',
};

const POSTMAN_REF = {
  auth: '3.1 Login',
  AT: '3.2 Acompanhamento de Títulos',
  PO: '3.3 Penhora Online',
  OE: '3.5 Ofícios',
  certidoes: '3.6 Certidões',
  CCN: 'CCN',
  CENSEC: 'CENSEC',
  DOI: 'DOI',
  SIGEF: 'SIGEF',
};

function workflowFileNameToOp(fileName) {
  if (FILE_TO_OP[fileName]) return FILE_TO_OP[fileName];
  const base = fileName.replace(/\.workflow\.ts$/i, '').trim();
  if (/auth\s*onr/i.test(base)) return 'LoginUsuarioCertificado';
  const parts = base.split(/\s+/);
  let op = '';
  for (let i = 0; i < parts.length; i += 1) {
    const p = parts[i];
    if (p.toUpperCase() === 'V2' && i === parts.length - 1) {
      op += '_V2';
      continue;
    }
    if (/^(PO|OE|AT|AC|IN)$/i.test(p)) {
      op += p.toUpperCase();
      continue;
    }
    op += p.charAt(0).toUpperCase() + p.slice(1).toLowerCase();
  }
  return op;
}

function inferModule(op) {
  if (OP_DOMAIN_OVERRIDE[op]) return OP_DOMAIN_OVERRIDE[op];
  if (
    op.includes('Certidao') ||
    /^ObterXMLSolicitacoes_v[456]$/i.test(op) ||
    (op.startsWith('Enviar') && op.includes('Certidao')) ||
    op.startsWith('DevolverCertidao')
  ) {
    return 'certidoes';
  }
  if (op.endsWith('PO') || op.includes('ExportacaoPO')) return 'PO';
  if (op.endsWith('OE') || /OE_V\d+$/i.test(op)) return 'OE';
  if (op.endsWith('AT')) return 'AT';
  return 'geral';
}

function metodosSubdir(mod, op) {
  if (mod === 'certidoes') return 'certidoes';
  if (mod === 'AT') return 'AT';
  if (mod === 'PO') return 'PO';
  if (mod === 'OE') return 'OE';
  if (mod === 'auth') return 'login';
  return 'geral';
}

function parseYamlFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  const out = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([\w_-]+):\s*(.*)$/);
    if (kv) out[kv[1]] = kv[2].replace(/^["']|["']$/g, '');
  }
  return out;
}

function extractJsonBlocks(text) {
  const blocks = [];
  const re = /```json\r?\n([\s\S]*?)```/g;
  let m;
  while ((m = re.exec(text))) blocks.push(m[1].trim());
  return blocks;
}

function extractSection(text, heading) {
  const re = new RegExp(`## ${heading}[\\s\\S]*?(?=\\n## |$)`, 'i');
  const m = text.match(re);
  return m ? m[0].trim() : '';
}

function parseWorkflow(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const idM = content.match(/@workflow\(\{[\s\S]*?id:\s*'([^']+)'/);
  const nameM = content.match(/@workflow\(\{[\s\S]*?name:\s*'([^']+)'/);
  const pathM = content.match(/path:\s*'([^']+)'/);
  const webhookIdM = content.match(/webhookId:\s*'([^']+)'/);
  const nodes = [];
  const mapRe = /^\/\/\s+(\S+)\s+(\S+)/gm;
  let mm;
  const mapSection = content.match(/\/\/ <workflow-map>[\s\S]*?\/\/ <\/workflow-map>/);
  if (mapSection) {
    const lines = mapSection[0].split('\n').slice(2);
    for (const line of lines) {
      const nm = line.match(/^\/\/\s+(\S+)\s+(\S+)/);
      if (nm && !nm[1].startsWith('─') && nm[1] !== 'NODE' && nm[1] !== 'ROUTING') {
        nodes.push({ prop: nm[1], type: nm[2] });
      }
    }
  }
  const nameNodes = [...content.matchAll(/name:\s*'([^']+)'/g)].map((x) => x[1]);
  const workflowNodes = nameNodes.filter(
    (n) =>
      !['orius - master@orius', 'orius'].includes(n) &&
      !/^[0-9a-f-]{36}$/i.test(n),
  );
  return {
    workflowId: idM?.[1] || '',
    workflowName: nameM?.[1] || '',
    webhookPath: pathM?.[1] || webhookIdM?.[1] || '',
    nodes: nodes.length ? nodes : workflowNodes.slice(0, 15).map((n) => ({ prop: n, type: '' })),
  };
}

function loadRegistry() {
  const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
  const byOp = {};
  for (const entry of Object.values(registry.items || {})) {
    byOp[entry.operacao] = entry;
  }
  return byOp;
}

function envVarsFromExample(prefix) {
  if (!prefix || !fs.existsSync(ENV_EXAMPLE)) return [];
  const lines = fs.readFileSync(ENV_EXAMPLE, 'utf8').split('\n');
  return lines
    .filter((l) => /^[A-Z_][A-Z0-9_]*=/.test(l) && l.startsWith(prefix))
    .map((l) => l.split('=')[0]);
}

/** Prefixos .env.example por operação (só métodos com vars dedicadas). */
const OP_ENV_PREFIX = {
  ObterXMLSolicitacoes_v6: 'CERTIDOES_OBTER_XML_V6_',
  DevolverCertidao: 'CERTIDOES_DEVOLVER_CERTIDAO_',
  ListTitulosAT: 'ACOMPANHAMENTO_TITULOS_',
  GetTituloAT: 'ACOMPANHAMENTO_TITULOS_',
  InsertTituloAT: 'ACOMPANHAMENTO_TITULOS_',
  UpdateTituloAT: 'ACOMPANHAMENTO_TITULOS_',
  DeleteTituloAT: 'ACOMPANHAMENTO_TITULOS_',
  ListStatusAT: 'ACOMPANHAMENTO_TITULOS_',
  GetStatusAT: 'ACOMPANHAMENTO_TITULOS_',
  InsertStatusAT: 'ACOMPANHAMENTO_TITULOS_',
  UpdateStatusAT: 'ACOMPANHAMENTO_TITULOS_',
};

function buildN8nEnvBlock(webhookPath, isPathSlug, mod) {
  const prodUrl = isPathSlug
    ? `${N8N_BASE}/webhook/${webhookPath}`
    : `${N8N_BASE}/webhook/${webhookPath}`;
  const testUrl = isPathSlug
    ? `${N8N_BASE}/webhook-test/${webhookPath}`
    : `${N8N_BASE}/webhook-test/${webhookPath}`;
  return `## Variáveis de ambiente (testes — valores explícitos)

> Canônico: [[env#n8n — Easypanel (API + webhooks Basic Auth)]]. WSOficio ONR: [[env#WSOficio ONR — login, hash e Certidões (homologação)]]. Repo: \`automacoes e testes/.env.example\`.

### n8n (webhook)

\`\`\`env
N8N_BASE_URL=${N8N_BASE}
N8N_BASIC_AUTH_USER=orius
N8N_BASIC_AUTH_PASSWORD=master@orius
n8n_webhook_mode=webhook-test
\`\`\`

| Variável | Valor (HML) | Uso |
|----------|-------------|-----|
| \`N8N_BASE_URL\` | \`${N8N_BASE}\` | Produção: \`${prodUrl}\` |
| | | Teste: \`${testUrl}\` |
| \`n8n_webhook_mode\` | \`webhook-test\` | **Execute workflow** no editor antes do POST |

${mod !== 'auth' ? `### ONR — hash (quando aplicável)

\`\`\`env
ONR_SERVENTIA_CHAVE=3BE1BF10-6792-4563-9ED7-9C2DA455F233
ONR_HASH_TOKEN_INDEX=0
\`\`\`

| Variável Postman | Body JSON |
|------------------|-----------|
| \`onr_hash\` | \`hash\` — obter em **3.1 Login → Auth ONR** |
` : ''}`;
}

function extractPreservedExamples(markdown) {
  const m = markdown.match(/## Exemplo de corpo[\s\S]*?(?=\n## Resposta esperada)/);
  if (!m) return '';
  return `\n${m[0].replace(/^## Exemplo de corpo de requisição/, '### Exemplos adicionais (cenários)')}\n`;
}

function buildCcnEnvBlock() {
  return `## Variáveis de ambiente (testes — valores explícitos)

> Canônico: [[env#n8n — Easypanel (API + webhooks Basic Auth)]] · [[env#CCN — Cadastro de pessoas e-notariado (homologação)]].

\`\`\`env
N8N_BASE_URL=${N8N_BASE}
N8N_BASIC_AUTH_USER=orius
N8N_BASIC_AUTH_PASSWORD=master@orius
CNS_HOMOLOGACAO=995936
CCN_HML_BASE_URL=https://pessoas-hml.e-notariado.org.br
CCN_X_API_KEY=<ver env.md>
CCN_X_SUBSCRIPTION=d2efe9cc-23f9-4bd2-06c0-08ddf76de010
CCN_X_AMBIENTE=homologacao
\`\`\`
`;
}

function buildUtilizacao({
  op,
  mod,
  domain,
  integration,
  entry,
  wf,
  wfFile,
  legacyContent,
  porMetodoContent,
  preservedExamples,
}) {
  const planeKey = entry?.plane_key || '';
  const planeUrl = entry?.plane_url || '';
  const workflowName =
    wf.workflowName || `[${planeKey}] (${integration}) ${op} - ${domain}`;
  const isSlug = wf.webhookPath.includes('/');
  const webhookProd = `${N8N_BASE}/webhook/${wf.webhookPath}`;
  const webhookTest = `${N8N_BASE}/webhook-test/${wf.webhookPath}`;
  const soapUrl = SOAP_ENDPOINT[mod] || '';
  const produto = PRODUTO[mod] || 'imoveis';
  const central = mod === 'auth' ? 'onr' : mod === 'geral' ? 'onr' : mod.toLowerCase();
  const metodoLink = `../../metodos/${metodosSubdir(mod, op)}/${op}`;
  const workflowFile = path.basename(wfFile);

  const jsonBlocks = extractJsonBlocks(porMetodoContent || legacyContent || '');
  const requestExample =
    jsonBlocks.find((b) => !b.includes('status_http') && !b.includes('"sucesso": false')) ||
    jsonBlocks[0] ||
    (mod === 'auth' ? '{\n  "assunto_certificado": "{{SUBJECTCN}}"\n}' : '{\n  "hash": "{{onr_hash}}"\n}');
  const successExample = jsonBlocks.find((b) => b.includes('status_http') && b.includes('"sucesso": true')) || '';
  const errorExample = jsonBlocks.find((b) => b.includes('"sucesso": false')) || '';

  let envSection;
  if (mod === 'CCN') {
    envSection = buildCcnEnvBlock();
  } else {
    envSection = buildN8nEnvBlock(wf.webhookPath, isSlug, mod);
    const envPrefix = OP_ENV_PREFIX[op];
    const envVars = envVarsFromExample(envPrefix);
    if (envVars.length) {
      envSection += `\n### ${op} — CLI (\`.env.example\`)\n\n\`\`\`env\n${envVars.map((v) => `${v}=`).join('\n')}\n\`\`\`\n`;
    }
    if (mod === 'CENSEC') {
      envSection += `\n### CENSEC\n\n\`\`\`env\nCENSEC_API_KEY=<ver [[env#CCN — Cadastro de pessoas e-notariado (homologação)]] ou CENSEC em env.md>\nCNS_HOMOLOGACAO=995936\n\`\`\`\n`;
    }
  }

  const reqDef = buildRequestDefinitionSection({
    mod,
    op,
    webhookProd,
    webhookTest,
    jsonExample: requestExample,
    workflowFileName: workflowFile,
  });
  const postmanGit = buildPostmanGitSection(mod, op, workflowFile);

  const prereqNote =
    mod === 'auth'
      ? '\n> **Pré-requisito:** certificado A1 — campos em [[../auth-n8n]].\n'
      : ['CCN', 'CENSEC', 'DOI', 'SIGEF'].includes(mod)
        ? '\n> **Pré-requisito:** credenciais em [[env]]; conferir headers na coleção Git.\n'
        : '\n> **Pré-requisito:** executar **Auth ONR — Login** na coleção Git (grava `onr_hash`).\n';

  return `---
tipo: runbook
area: orius
produto: ${produto}
central: ${central === 'censec' ? 'censec' : central === 'ccn' ? 'ccn' : central === 'doi' ? 'doi' : central === 'sigef' ? 'sigef' : 'onr'}
integracao: ${integration}
dominio: ${domain}
operacao: ${op}
tags: [orius, n8n, automacao, utilizacao, ${op}]
status: revisado
tem-n8n: true
plane_work_item_id: ${entry?.plane_work_item_id || ''}
plane_sequence_id: ${entry?.plane_sequence_id || ''}
plane_key: ${planeKey}
plane_url: ${planeUrl}
plane_automation_status: ${entry?.automation_status || 'done'}
workflow_n8n: "${workflowName.replace(/"/g, '\\"')}"
workflow_id_n8n: ${wf.workflowId}
fonte_repositorio: C:/Users/kenio/automacoes e testes/workflows/n8n/extensao-n8n-teste/
documentacao_desenvolvimento: "[[../desenvolvimento/${op}|documentação detalhada]]"
criado: 2026-06-03
atualizado: 2026-06-03
fonte: migrate-autonr-docs-padrao
---

# Utilização da automação — ${domain} — ${op}

> Runbook para **testes**, **integração** e **sync Plane**. Desenvolvimento: [[../desenvolvimento/${op}]].

## Atividade Plane

| Campo | Valor |
|-------|-------|
| Card | **${planeKey}** |
| Link | [${planeKey} no Plane](${planeUrl}) |
| Workflow n8n | \`${workflowName}\` |

## Endpoint (resumo)

| Item | Valor |
|------|-------|
| Método HTTP | \`POST\` |
| URL (produção) | \`${webhookProd}\` |
| URL (teste) | \`${webhookTest}\` |
${soapUrl ? `| SOAP upstream (\`url_servico_onr\`) | \`${soapUrl}\` |` : ''}

${envSection}
${prereqNote}
${reqDef}
${preservedExamples || ''}

${postmanGit}

## Resposta esperada

Envelope padrão:

\`\`\`json
{
  "status_http": 200,
  "sucesso": true,
  "codigo_erro": 0,
  "mensagem_erro": "",
  "dados": {}
}
\`\`\`

${successExample ? `### Sucesso (\`status_http\` 200)\n\n\`\`\`json\n${successExample}\n\`\`\`\n` : ''}

### Erros comuns

| Situação | \`status_http\` | \`codigo_erro\` |
|----------|---------------|---------------|
| Validação local | 400 | — |
| Hash inválido | 401 | 45–47 |
| Regra de negócio ONR | 422 | — |
| Falha rede / SOAP | 502 | 0 |

${errorExample ? `\`\`\`json\n${errorExample}\n\`\`\`\n` : ''}

## Referências

- Método SOAP / spec: [[${metodoLink}]]
- Desenvolvimento: [[../desenvolvimento/${op}]]
- Workflow: \`workflows/n8n/extensao-n8n-teste/${workflowFile}\`
- Coleções Postman: [repositório N8N](https://git.oriustecnologia.com/OriusTecnologia/N8N.git) (branch \`main\`)
`;
}

function buildDesenvolvimento({ op, mod, domain, integration, entry, wf, wfFile }) {
  const planeKey = entry?.plane_key || '';
  const workflowName = wf.workflowName || op;
  const nodeRows = wf.nodes
    .map((n, i) => {
      const display = n.prop
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
        .toLowerCase();
      return `| ${i + 1} | ${display || n.prop} | ${n.type || '—'} | Ver \`${path.basename(wfFile)}\` |`;
    })
    .join('\n');

  return `---
tipo: documentacao-tecnica
area: orius
produto: ${PRODUTO[mod] || 'imoveis'}
central: onr
integracao: ${integration}
dominio: ${domain}
operacao: ${op}
tags: [orius, n8n, automacao, desenvolvimento, ${op}]
status: revisado
tem-n8n: true
plane_key: ${planeKey}
workflow_n8n: "${workflowName.replace(/"/g, '\\"')}"
workflow_id_n8n: ${wf.workflowId}
fonte_workflow_ts: ${path.basename(wfFile)}
fonte_repositorio: C:/Users/kenio/automacoes e testes/workflows/n8n/extensao-n8n-teste/
documentacao_utilizacao: "[[../utilizacao/${op}|utilização da automação]]"
criado: 2026-06-03
atualizado: 2026-06-03
fonte: migrate-autonr-docs-padrao
---

# Documentação detalhada da automação — ${domain} — ${op}

> Proxy n8n-as-code. Runbook de testes: [[../utilizacao/${op}]].

## Visão geral

| Item | Valor |
|------|-------|
| Card Plane | **${planeKey}** |
| Arquivo | \`workflows/n8n/extensao-n8n-teste/${path.basename(wfFile)}\` |
| Workflow ID | \`${wf.workflowId}\` |
| Webhook path | \`${wf.webhookPath}\` |

### Objetivo

Proxy HTTP → ${mod === 'CCN' || mod === 'CENSEC' || mod === 'DOI' || mod === 'SIGEF' ? 'API upstream' : 'SOAP ONR'} para a operação **${op}**.

### Contrato de saída

Resposta JSON com \`status_http\`, \`sucesso\`, \`codigo_erro\`, \`mensagem_erro\`, \`dados\` (snake_case).

---

## Fluxo do workflow

\`\`\`mermaid
flowchart TD
  W[Webhook] --> N[normalizar-entrada]
  N --> V[validar-entrada]
  V --> I{if-entrada-valida}
  I -->|sim| U[upstream]
  U --> C[converter-resposta]
  C --> R[Respond to Webhook]
  I -->|não| RV[resposta-validacao]
  RV --> R
\`\`\`

---

## Nós do workflow

| # | Nó | Tipo | Objetivo |
|---|-----|------|----------|
${nodeRows || '| 1 | Webhook | webhook | Entrada POST + Basic Auth |'}

Detalhe de validação, envelope SOAP e mapeamento de códigos: código em \`${path.basename(wfFile)}\`.

---

## Mapeamento \`status_http\`

| Condição | HTTP |
|----------|------|
| Sucesso upstream | 200 |
| Validação local | 400 |
| Hash 45–47 | 401 |
| Erro de negócio | 422 |
| Falha rede / parse | 502 |

---

## Referências

- [[../utilizacao/${op}]]
- Spec: [[../../metodos/${metodosSubdir(mod, op)}/${op}]]
`;
}

function buildPorMetodoRedirect(op, mod) {
  return `---
tipo: automacao
area: orius
operacao: ${op}
status: revisado
---

> **Documentação dividida (padrão obrigatório):**
> - Utilização / testes / Plane: [[../utilizacao/${op}]]
> - Desenvolvimento (nós e fluxo): [[../desenvolvimento/${op}]]

Método: [[../../metodos/${metodosSubdir(mod, op)}/${op}]]
`;
}

const PRESERVE_EXAMPLES_OPS = new Set(['ObterXMLSolicitacoes_v6', 'DevolverCertidao']);

function readPreservedExamples(filePath, op) {
  if (!PRESERVE_EXAMPLES_OPS.has(op) || !fs.existsSync(filePath)) return '';
  return extractPreservedExamples(fs.readFileSync(filePath, 'utf8'));
}

function main() {
  const dryRun = process.argv.includes('--dry-run');
  const byOp = loadRegistry();
  const files = fs.readdirSync(WORKFLOWS_DIR).filter((f) => f.endsWith('.workflow.ts')).sort();
  const stats = { util: 0, dev: 0, redirect: 0, skippedUtil: 0, legacy: 0 };

  for (const file of files) {
    const op = workflowFileNameToOp(file);
    const mod = inferModule(op);
    const entry = byOp[op];
    const domain = DOMAIN_LABEL[mod] || DOMAIN_LABEL.geral;
    const integration = INTEGRATION_LABEL[mod] || INTEGRATION_LABEL.geral;
    const baseRel = VAULT_BASE[mod] || VAULT_BASE.geral;
    const baseAbs = path.join(VAULT, baseRel);
    const utilDir = path.join(baseAbs, 'utilizacao');
    const devDir = path.join(baseAbs, 'desenvolvimento');
    const porDir = path.join(VAULT, VAULT_BASE.AT, 'por-metodo');

    const wfPath = path.join(WORKFLOWS_DIR, file);
    const wf = parseWorkflow(wfPath);

    let porMetodoContent = '';
    const porFile = path.join(porDir, `${op}.md`);
    if (fs.existsSync(porFile)) porMetodoContent = fs.readFileSync(porFile, 'utf8');

    let legacyContent = '';
    const leg = LEGACY_GATEWAY[op];
    if (leg) {
      const legPath = path.join(baseAbs, leg);
      if (fs.existsSync(legPath)) {
        legacyContent = fs.readFileSync(legPath, 'utf8');
        stats.legacy += 1;
      }
    }

    if (mod === 'auth') {
      const utilPath = path.join(utilDir, 'LoginUsuarioCertificado.md');
      {
        const authDoc = fs.readFileSync(path.join(VAULT, VAULT_BASE.auth, 'auth-n8n.md'), 'utf8');
        const util = buildUtilizacao({
          op,
          mod,
          domain,
          integration,
          entry,
          wf,
          wfFile: wfPath,
          legacyContent: authDoc,
          porMetodoContent: authDoc,
          preservedExamples: '',
        });
        if (!dryRun) {
          fs.mkdirSync(utilDir, { recursive: true });
          fs.writeFileSync(utilPath, util, 'utf8');
        }
        stats.util += 1;
      }

      const devPath = path.join(devDir, 'LoginUsuarioCertificado.md');
      const dev = buildDesenvolvimento({ op, mod, domain, integration, entry, wf, wfFile: wfPath });
      if (!dryRun) {
        fs.mkdirSync(devDir, { recursive: true });
        fs.writeFileSync(devPath, dev, 'utf8');
      }
      stats.dev += 1;
      continue;
    }

    const utilPath = path.join(utilDir, `${op}.md`);
    const devPath = path.join(devDir, `${op}.md`);

    const util = buildUtilizacao({
      op,
      mod,
      domain,
      integration,
      entry,
      wf,
      wfFile: wfPath,
      legacyContent,
      porMetodoContent,
      preservedExamples: readPreservedExamples(utilPath, op),
    });
    if (!dryRun) {
      fs.mkdirSync(utilDir, { recursive: true });
      fs.writeFileSync(utilPath, util, 'utf8');
    }
    stats.util += 1;

    const dev = buildDesenvolvimento({ op, mod, domain, integration, entry, wf, wfFile: wfPath });
    if (!dryRun) {
      fs.mkdirSync(devDir, { recursive: true });
      fs.writeFileSync(devPath, dev, 'utf8');
    }
    stats.dev += 1;

    if (porMetodoContent && fs.existsSync(porFile)) {
      const redirect = buildPorMetodoRedirect(op, mod);
      if (!dryRun) fs.writeFileSync(porFile, redirect, 'utf8');
      stats.redirect += 1;
    }

    if (leg && !dryRun) {
      const legPath = path.join(baseAbs, leg);
      const redirectLeg = `---
tipo: automacao
operacao: ${op}
status: revisado
---

> Migrado para o padrão utilizacao + desenvolvimento:
> - [[utilizacao/${op}]]
> - [[desenvolvimento/${op}]]
`;
      fs.writeFileSync(legPath, redirectLeg, 'utf8');
    }

    console.log(`${dryRun ? '[dry-run] ' : ''}${op} → ${baseRel}`);
  }

  // Índice WSOficio
  const indexPath = path.join(VAULT, VAULT_BASE.AT, '00-indice-automacao.md');
  let index = fs.readFileSync(indexPath, 'utf8');
  index = index.replace(
    /\[\[por-metodo\/([^\]]+)\]\]/g,
    '[[utilizacao/$1]] · [[desenvolvimento/$1]]',
  );
  if (!dryRun) fs.writeFileSync(indexPath, index, 'utf8');

  console.log('\n', JSON.stringify(stats, null, 2));
}

main();
