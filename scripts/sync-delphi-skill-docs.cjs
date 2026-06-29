#!/usr/bin/env node
/**
 * Sincroniza tabelas de produtos/scripts Delphi nas skills do pipeline legado.
 * Fonte única: scripts/delphi-batch-paths.cjs
 */
const fs = require('fs');
const path = require('path');
const { DELPHI_PRODUCTS } = require('./delphi-batch-paths.cjs');

const SKILLS_ROOT = path.join(
  'C:',
  'Users',
  'kenio',
  'Obsidian Vault',
  'Meta',
  'cursor',
  'skills',
  'delphi',
);

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function replaceBlock(content, blockId, newBody) {
  const start = `<!-- delphi-skills:${blockId}:start -->`;
  const end = `<!-- delphi-skills:${blockId}:end -->`;
  const re = new RegExp(`${escapeRe(start)}[\\s\\S]*?${escapeRe(end)}`, 'm');
  if (!re.test(content)) {
    throw new Error(`Marker block "${blockId}" not found in content`);
  }
  return content.replace(re, `${start}\n${newBody}\n${end}`);
}

function productsTable() {
  const lines = [
    '| Slug | Pasta código | Batch JSON | Vault hub |',
    '|------|--------------|------------|-----------|',
  ];
  for (const p of Object.values(DELPHI_PRODUCTS)) {
    lines.push(
      `| \`${p.product_slug}\` | \`${p.product_path}\` | \`scripts/${path.basename(p.batch_file)}\` | \`${p.vault_hub}\` |`,
    );
  }
  return lines.join('\n');
}

function npmScriptsTable() {
  return `| Comando | Descrição |
|---------|-----------|
| \`npm run delphi:extract\` | Fase 0 — manifest \`.pas\` |
| \`npm run delphi:extract-dfm\` | Fase 0 — manifest \`.dfm\` + form index |
| \`npm run delphi:sync-tree\` | Inventário árvore → vault |
| \`npm run delphi:split-segments\` | Segmentos ~200L (threshold 250) |
| \`npm run delphi:apply-triage\` | Triage T0–T4 no batch JSON |
| \`npm run delphi:report-coverage\` | Métricas → \`00-cobertura.md\` |
| \`npm run delphi:validate-symbol\` | Gates determinísticos nas notas vault |
| \`npm run delphi:build-grafo\` | Grafo Chama/Chamado por → vault |
| \`npm run delphi:sync-segment-status\` | Segmentos → \`status: referencia\` |
| \`npm run delphi:ensure-product\` | Scaffold ecosystem + runner |
| \`npm run delphi:run-ecosystem\` | **Runner autônomo** (1 tick) |
| \`npm run delphi:sync-skill-docs\` | Regenera tabelas nas skills |`;
}

function parallelTable() {
  return `| Recurso | Limite |
|---------|--------|
| Símbolos ≤250L | máx. **5** analisadores em paralelo |
| Arquivos | máx. **2–3** em paralelo |
| Segmentos (>250L) | **série 1** por símbolo |
| Merge | após todos segmentos \`done\` |`;
}

function updateFile(relPath, updates) {
  const abs = path.join(SKILLS_ROOT, relPath);
  let content = fs.readFileSync(abs, 'utf8');
  for (const [blockId, body] of Object.entries(updates)) {
    content = replaceBlock(content, blockId, body);
  }
  fs.writeFileSync(abs, content, 'utf8');
  console.log(`Updated: Meta/cursor/skills/delphi/${relPath}`);
}

function ensureMarkers(filePath, blocks) {
  const abs = path.join(SKILLS_ROOT, filePath);
  let content = fs.readFileSync(abs, 'utf8');
  let changed = false;
  for (const [blockId, defaultBody] of Object.entries(blocks)) {
    const start = `<!-- delphi-skills:${blockId}:start -->`;
    if (!content.includes(start)) {
      content += `\n\n${start}\n${defaultBody}\n<!-- delphi-skills:${blockId}:end -->\n`;
      changed = true;
    }
  }
  if (changed) fs.writeFileSync(abs, content, 'utf8');
}

function main() {
  const prod = productsTable();
  const npm = npmScriptsTable();
  const par = parallelTable();

  ensureMarkers('skill-delphi/SKILL.md', {
    'npm-scripts': npm,
    'products-table': prod,
    'parallel-limits': par,
  });

  updateFile('skill-delphi/SKILL.md', {
    'npm-scripts': npm,
    'products-table': prod,
    'parallel-limits': par,
  });

  ensureMarkers('agent-delphi-orchestrator/batch-state-schema.md', {
    'products-table': prod,
  });
  updateFile('agent-delphi-orchestrator/batch-state-schema.md', {
    'products-table': prod,
  });

  ensureMarkers('agent-delphi-ecosystem-orchestrator/ecosystem-state-schema.md', {
    'products-table': prod,
  });
  updateFile('agent-delphi-ecosystem-orchestrator/ecosystem-state-schema.md', {
    'products-table': prod,
  });

  const indexPath = path.join(SKILLS_ROOT, '00-indice-delphi-skills.md');
  fs.writeFileSync(
    indexPath,
    `# Índice — skills Delphi legado

Fonte de produtos/scripts: \`scripts/delphi-batch-paths.cjs\` · sync: \`npm run delphi:sync-skill-docs\`

## Contexto

| Skill | Papel |
|-------|-------|
| [skill-delphi](skill-delphi/SKILL.md) | Contexto Orius, Firebird, charset, anti-alucinação |
| [skill-pas](skill-pas/SKILL.md) | Units \`.pas\`, segmentação 250L |
| [skill-dfm](skill-dfm/SKILL.md) | Formulários VCL |
| [skill-dcu](skill-dcu/SKILL.md) | Binários — só inventário |

## Orquestradores

| Skill | Papel |
|-------|-------|
| [agent-delphi-ecosystem-orchestrator](agent-delphi-ecosystem-orchestrator/SKILL.md) | Diretor por produto/domínio |
| [agent-delphi-domain-orchestrator](agent-delphi-domain-orchestrator/SKILL.md) | Gerente por domínio (execution_order) |
| [agent-delphi-orchestrator](agent-delphi-orchestrator/SKILL.md) | Gerente por arquivo |

## Subagentes

| Skill | Papel |
|-------|-------|
| [agent-delphi-indexer](agent-delphi-indexer/SKILL.md) | Fase 0 manifest |
| [agent-delphi-analyzer](agent-delphi-analyzer/SKILL.md) | Símbolo ≤250L |
| [agent-delphi-analyzer-dfm](agent-delphi-analyzer-dfm/SKILL.md) | Evento form → handler |
| [agent-delphi-analyzer-segment](agent-delphi-analyzer-segment/SKILL.md) | Segmento ~200L |
| [agent-delphi-analyzer-merge](agent-delphi-analyzer-merge/SKILL.md) | Merge pós-segmentos |
| [agent-delphi-debug](agent-delphi-debug/SKILL.md) | Consulta vault + grafo |

## Schemas

| Arquivo | Conteúdo |
|---------|----------|
| [batch-state-schema](agent-delphi-orchestrator/batch-state-schema.md) | JSON batch por produto |
| [ecosystem-state-schema](agent-delphi-ecosystem-orchestrator/ecosystem-state-schema.md) | Domínios + triage |
| [symbol-segment-schema](agent-delphi-orchestrator/symbol-segment-schema.md) | Segmentação 250/200 |

## Scripts npm

<!-- delphi-skills:npm-scripts:start -->
${npm}
<!-- delphi-skills:npm-scripts:end -->

## Produtos

<!-- delphi-skills:products-table:start -->
${prod}
<!-- delphi-skills:products-table:end -->

## Paralelismo

<!-- delphi-skills:parallel-limits:start -->
${par}
<!-- delphi-skills:parallel-limits:end -->
`,
    'utf8',
  );
  console.log('Updated: Meta/cursor/skills/delphi/00-indice-delphi-skills.md');
}

main();
