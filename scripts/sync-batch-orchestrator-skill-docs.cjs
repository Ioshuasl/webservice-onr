#!/usr/bin/env node
/**
 * Regenera tabelas de domínios nos markdown de
 * .cursor/skills/agent-n8n-batch-orchestrator/
 * a partir de scripts/batch-state-paths.cjs (fonte única).
 */
const fs = require('fs');
const path = require('path');
const { DOMAIN_BATCH_FILES } = require('./batch-state-paths.cjs');

const SKILL_DIR = path.join(__dirname, '..', '.cursor', 'skills', 'agent-n8n-batch-orchestrator');

/** @returns {Array<{ key: string } & typeof DOMAIN_BATCH_FILES[string]>} */
function sortedDomains() {
  return Object.entries(DOMAIN_BATCH_FILES)
    .map(([key, meta]) => ({ key, ...meta }))
    .sort((a, b) => a.plane_identifier.localeCompare(b.plane_identifier));
}

function relBatchFile(meta) {
  return `scripts/${path.basename(meta.file)}`;
}

function replaceBlock(content, blockId, newBody) {
  const start = `<!-- batch-orchestrator:${blockId}:start -->`;
  const end = `<!-- batch-orchestrator:${blockId}:end -->`;
  const re = new RegExp(`${escapeRe(start)}[\\s\\S]*?${escapeRe(end)}`, 'm');
  if (!re.test(content)) {
    throw new Error(`Marker block "${blockId}" not found`);
  }
  return content.replace(re, `${start}\n${newBody}\n${end}`);
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function skillDomainsTable(domains) {
  const lines = [
    '| Domínio | `plane_identifier` | Arquivo batch | Registry |',
    '|---------|-------------------|---------------|----------|',
  ];
  for (const d of domains) {
    lines.push(
      `| ${d.label} | ${d.plane_identifier} | \`${relBatchFile(d)}\` | \`${d.registry}\` |`
    );
  }
  return lines.join('\n');
}

function schemaDomainsTable(domains) {
  const lines = ['| Domínio | Arquivo |', '|---------|---------|'];
  for (const d of domains) {
    lines.push(`| ${d.plane_identifier} | \`${relBatchFile(d)}\` |`);
  }
  return lines.join('\n');
}

function profilesBatchFilesTable(domains) {
  const lines = ['| Família | `batch_state_file` |', '|---------|-------------------|'];
  for (const d of domains) {
    lines.push(`| ${d.plane_identifier} | \`${relBatchFile(d)}\` |`);
  }
  return lines.join('\n');
}

function profilesPlaneSlugTable(domains) {
  const lines = [
    '| Família | `plane_identifier` | `plane_slug` | Registry | Upstream |',
    '|---------|-------------------|--------------|----------|----------|',
  ];
  for (const d of domains) {
    lines.push(
      `| ${d.label} | ${d.plane_identifier} | \`${d.plane_slug}\` | \`${d.registry}\` | ${d.upstream} |`
    );
  }
  return lines.join('\n');
}

function profilesResolverTable(domains) {
  const lines = ['| Padrão no pedido | Perfil |', '|------------------|--------|'];
  for (const d of domains) {
    const patterns = [
      `\`${d.plane_identifier}-n\``,
      `\`${d.integration}\``,
      ...(d.resolver_patterns || []).map((p) => `\`${p}\``),
    ];
    lines.push(`| ${patterns.join(', ')} | ${d.plane_identifier} |`);
  }
  return lines.join('\n');
}

function hasProfileSection(content, planeIdentifier) {
  const re = new RegExp(`^##\\s+${escapeRe(planeIdentifier)}\\b`, 'm');
  return re.test(content);
}

function profilesStubBody(domains, existingContent) {
  const stubs = [];
  for (const d of domains) {
    if (hasProfileSection(existingContent, d.plane_identifier)) continue;
    stubs.push(`## ${d.plane_identifier} — ${d.label}

| Campo | Valor |
|-------|-------|
| \`batch_state_file\` | \`${relBatchFile(d)}\` |
| \`batch_id\` exemplo | \`${d.batch_id_prefix}1\` |
| \`plane_slug\` | \`${d.plane_slug}\` |
| \`integration\` | \`${d.integration}\` |
| **Subagente skills** | \`agent-n8n-orchestrator\`, \`n8n-architect\`, \`obsidian-vault\` |

> Perfil gerado automaticamente — orquestrador deve preencher vault_hub, postman, env_section e adapter antes do lote.
`);
  }
  if (stubs.length === 0) {
    return '_Todos os domínios registrados já possuem seção de perfil detalhada._';
  }
  return stubs.join('\n');
}

function subagentBatchFilesList(domains) {
  const lines = ['| Domínio | `batch_state_file` |', '|---------|-------------------|'];
  for (const d of domains) {
    lines.push(`| ${d.plane_identifier} | \`${relBatchFile(d)}\` |`);
  }
  return lines.join('\n');
}

function skillDescriptionList(domains) {
  return domains.map((d) => d.plane_identifier).join(', ');
}

function skillReferencesExamples(domains) {
  const withBatches = domains
    .map((d) => relBatchFile(d))
    .slice(0, 4);
  if (withBatches.length === 0) return '`scripts/autonr-batch-state.json`';
  return withBatches.map((f) => `\`${f}\``).join(', ');
}

function updateSkillMd(domains) {
  const file = path.join(SKILL_DIR, 'SKILL.md');
  let content = fs.readFileSync(file, 'utf8');
  content = replaceBlock(content, 'domains-table', skillDomainsTable(domains));
  content = replaceBlock(
    content,
    'references-examples',
    `- Exemplos: ${skillReferencesExamples(domains)}`
  );

  const descList = skillDescriptionList(domains);
  content = content.replace(
    /Orquestra lotes de cards n8n \([^)]+\) de forma autônoma/,
    `Orquestra lotes de cards n8n (${descList}) de forma autônoma`
  );
  fs.writeFileSync(file, content, 'utf8');
}

function updateSchemaMd(domains) {
  const file = path.join(SKILL_DIR, 'batch-state-schema.md');
  let content = fs.readFileSync(file, 'utf8');
  content = replaceBlock(content, 'schema-domains-table', schemaDomainsTable(domains));
  fs.writeFileSync(file, content, 'utf8');
}

function updateProfilesMd(domains) {
  const file = path.join(SKILL_DIR, 'batch-profiles.md');
  let content = fs.readFileSync(file, 'utf8');
  content = replaceBlock(content, 'batch-files-table', profilesBatchFilesTable(domains));
  content = replaceBlock(content, 'plane-slug-table', profilesPlaneSlugTable(domains));
  content = replaceBlock(content, 'resolver-table', profilesResolverTable(domains));
  content = replaceBlock(content, 'profile-stubs', profilesStubBody(domains, content));
  fs.writeFileSync(file, content, 'utf8');
}

function updateSubagentPromptMd(domains) {
  const file = path.join(SKILL_DIR, 'subagent-prompt.md');
  let content = fs.readFileSync(file, 'utf8');
  content = replaceBlock(content, 'batch-files-list', subagentBatchFilesList(domains));
  fs.writeFileSync(file, content, 'utf8');
}

function main() {
  const domains = sortedDomains();
  updateSkillMd(domains);
  updateSchemaMd(domains);
  updateProfilesMd(domains);
  updateSubagentPromptMd(domains);
  console.log(`Synced ${domains.length} domain(s) → ${SKILL_DIR}`);
  for (const d of domains) {
    console.log(`  ${d.plane_identifier} → ${relBatchFile(d)}`);
  }
}

main();
