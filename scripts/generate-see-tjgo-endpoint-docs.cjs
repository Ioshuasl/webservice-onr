#!/usr/bin/env node
/**
 * Gera specs vault 1:1 por endpoint OpenAPI SEE TJGO.
 * Uso: node scripts/generate-see-tjgo-endpoint-docs.cjs [--dry-run]
 */
const fs = require('fs');
const path = require('path');
const {
  ENDPOINTS,
  cardTitle,
  specFilename,
} = require('./see-tjgo-endpoints.cjs');

const VAULT_SEE = path.join(
  process.env.USERPROFILE || '',
  'Obsidian Vault',
  'Orius',
  'integracoes',
  'see-tjgo',
);
const ENDPOINTS_DIR = path.join(VAULT_SEE, 'endpoints');
const dryRun = process.argv.includes('--dry-run');

function specBody(ep) {
  const code = `SEE-${String(ep.seq).padStart(2, '0')}`;
  return `---
tipo: integracao-endpoint
area: orius
central: see-tjgo
tags: [see-tjgo, api, endpoint, ${ep.method.toLowerCase()}, ${ep.operacao}]
codigo: ${code}
operacao: ${ep.operacao}
method: ${ep.method}
upstream_path: ${ep.upstream}
webhook_n8n: ${ep.webhook}
plane_key: AUTSEETJGO-${ep.seq}
plane_card: "${cardTitle(ep)}"
status: documentado
criado: ${new Date().toISOString().slice(0, 10)}
---

> **Índice:** [[../00-indice]] · **Catálogo:** [[../endpoints/00-indice-endpoints]]

# ${code} — \`${ep.method} ${ep.upstream}\`

**Tag OpenAPI:** ${ep.tag} · **Domínio:** ${ep.dominio}

${ep.desc}

---

## Endpoint upstream

| | |
|---|---|
| **Método** | \`${ep.method}\` |
| **URL** | \`{baseUrl}${ep.upstream}\` |
| **Auth** | ${ep.auth ? 'Bearer `auth_token` (exceto Sessions)' : 'Não'} |

Base URL produção: \`https://see.tjgo.jus.br/api/v1\`  
Base URL HML: \`https://portal-hextrajudicial.tjgo.jus.br/api/v1\`

---

## Proxy n8n (1 workflow = 1 endpoint)

| Campo | Valor |
|-------|-------|
| Card Plane | **AUTSEETJGO-${ep.seq}** |
| Título | \`${cardTitle(ep)}\` |
| Webhook | \`${ep.webhook}\` |
| Operação | \`${ep.operacao}\` |
| Prioridade | ${ep.priority} |

Spec detalhada OpenAPI: \`see-tjgo/openapi.yaml\` · Postman upstream: [[../postman-colecao]]

---

## Automação

| Doc | Caminho |
|-----|---------|
| Utilização | \`automacao/utilizacao/${ep.operacao}.md\` |
| Desenvolvimento | \`automacao/desenvolvimento/${ep.operacao}.md\` |
`;
}

function indexBody() {
  const rows = ENDPOINTS.map(
    (ep) =>
      `| ${ep.seq} | \`${ep.method} ${ep.upstream}\` | ${ep.operacao} | [[${specFilename(ep).replace('endpoints/', '')}|${ep.method}]] | AUTSEETJGO-${ep.seq} |`,
  ).join('\n');
  return `---
tipo: indice
area: orius
central: see-tjgo
tags: [see-tjgo, endpoints, openapi]
status: revisado
criado: ${new Date().toISOString().slice(0, 10)}
---

> **Hub:** [[../00-indice]] · **Regra:** 1 endpoint OpenAPI = 1 card Plane = 1 workflow n8n

# SEE TJGO — Catálogo de endpoints (25)

OpenAPI **v0.4.2** — um documento por operação HTTP.

| # | Upstream | Operação | Spec | Plane |
|---|----------|----------|------|-------|
${rows}

## Docs agregados (legado)

Os arquivos \`SEE-01\`…\`SEE-08\` na raiz agrupavam vários endpoints — **não usar** para novos workflows. Consulte esta pasta.

| Legado | Substituído por |
|--------|-----------------|
| SEE-01-status | [[get-status]] |
| SEE-02-autenticacao | [[post-sessions]] |
| SEE-03-cartorios | [[get-cartorios]], [[get-cartorios-id]] |
| SEE-04-tipo-atos | [[get-tipo_atos]], [[get-tipo_atos-disponiveis]], … |
| SEE-05-distribuicao-atos | endpoints \`distribuicao_de_atos*\` |
| SEE-06-controle-atos-utilizados | endpoints \`controle_de_atos_utilizados*\` |
| SEE-07-controle-atos-recebidos | endpoints \`controle_atos_recebidos*\` |
| SEE-08-correicao-online | [[post-empresas_correicao-atualizar_dados_acesso]] |
`;
}

if (!dryRun) fs.mkdirSync(ENDPOINTS_DIR, { recursive: true });

let created = 0;
for (const ep of ENDPOINTS) {
  const rel = specFilename(ep);
  const full = path.join(VAULT_SEE, rel);
  const content = specBody(ep);
  if (dryRun) {
    console.log('would write', rel);
  } else {
    fs.writeFileSync(full, content);
    created += 1;
  }
}

const indexPath = path.join(ENDPOINTS_DIR, '00-indice-endpoints.md');
if (dryRun) {
  console.log('would write endpoints/00-indice-endpoints.md');
} else {
  fs.writeFileSync(indexPath, indexBody());
  console.log(`Wrote ${created} endpoint specs + index`);
}
