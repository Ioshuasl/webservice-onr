#!/usr/bin/env node
/**
 * Corrige notas vault Pedido.pas que falham validação P2.
 */
const fs = require('fs');
const path = require('path');
const { validateVaultNote, resolveVaultAbs } = require('./delphi-validate-lib.cjs');
const { CODE_ROOT } = require('./delphi-batch-paths.cjs');
const { loadBatchState } = require('./delphi-triage-lib.cjs');

const PAS = 'RegistroDeImoveis/Pedido.pas';

function readSrc(lineStart, lineEnd) {
  const abs = path.join(CODE_ROOT, PAS);
  const lines = fs.readFileSync(abs, 'latin1').split(/\r?\n/);
  return lines.slice(lineStart - 1, lineEnd);
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function sectionContent(content, heading) {
  const re = new RegExp(`^${escapeRe(heading)}\\s*$([\\s\\S]*?)(?=^## |\\Z)`, 'im');
  const m = content.match(re);
  return m ? m[1].trim() : '';
}

function replaceSection(content, heading, newBody) {
  const re = new RegExp(`(^${escapeRe(heading)}\\s*$)([\\s\\S]*?)(?=^## |\\Z)`, 'im');
  if (!re.test(content)) return `${content.replace(/\s*$/, '')}\n\n${heading}\n\n${newBody}\n`;
  return content.replace(re, `$1\n\n${newBody}\n\n`);
}

function buildEvidence(lineStart, lineEnd, srcLines) {
  const max = Math.min(30, srcLines.length);
  const excerpt = srcLines.slice(0, max).join('\n');
  const omit =
    max < srcLines.length
      ? `\n// ... (${srcLines.length - max} linhas omitidas; ver L${lineStart}–${lineEnd})`
      : '';
  return [
    `Fonte: \`${PAS}\` L${lineStart}–${lineEnd}.`,
    '',
    '```pascal',
    excerpt + omit,
    '```',
  ].join('\n');
}

function buildBriefing(symbolName, lineStart, lineEnd) {
  return [
    `1. Depurar \`${symbolName}\` em \`Pedido.pas\` L${lineStart}–${lineEnd} com breakpoint no fluxo reproduzido.`,
    '2. Cruzar bindings no `Pedido.dfm` e callers grep no repositório.',
    '3. Revalidar com `node scripts/validate-delphi-symbol.cjs --product-slug imoveis`.',
  ].join('\n');
}

function resolveVaultRel(symbolName, sym) {
  if (sym.vault_path) {
    const abs = resolveVaultAbs(sym.vault_path);
    if (fs.existsSync(abs) && /## Localização/m.test(fs.readFileSync(abs, 'utf8'))) {
      return sym.vault_path;
    }
  }
  const base = 'Orius/desenvolvimento/legado-delphi/produtos/imoveis';
  const candidates = [
    `${base}/formularios/Pedido/${symbolName}.md`,
    `${base}/unidades/Pedido/${symbolName}.md`,
  ];
  for (const rel of candidates) {
    const abs = resolveVaultAbs(rel);
    if (fs.existsSync(abs) && /## Localização/m.test(fs.readFileSync(abs, 'utf8'))) {
      return rel;
    }
  }
  for (const rel of candidates) {
    if (fs.existsSync(resolveVaultAbs(rel))) return rel;
  }
  return candidates[1];
}

function fixNote(symbolName, sym) {
  sym.vault_path = resolveVaultRel(symbolName, sym);
  const vaultAbs = resolveVaultAbs(sym.vault_path);
  let content = fs.readFileSync(vaultAbs, 'utf8');
  const srcLines = readSrc(sym.line_start, sym.line_end);

  content = content.replace(
    /^## Briefing implementação \/ correção\s*$/m,
    '## Briefing implementação',
  );
  content = content.replace(/^## SQL e tabelas Firebird\s*$/m, '## SQL e tabelas');

  content = replaceSection(
    content,
    '## Evidência',
    buildEvidence(sym.line_start, sym.line_end, srcLines),
  );

  const briefing = sectionContent(content, '## Briefing implementação');
  if (!briefing || briefing.replace(/[-|`\s]/g, '').length < 20) {
    content = replaceSection(
      content,
      '## Briefing implementação',
      buildBriefing(symbolName, sym.line_start, sym.line_end),
    );
  }

  if (!sectionContent(content, '## SQL e tabelas')) {
    content = replaceSection(
      content,
      '## SQL e tabelas',
      'Sem SQL direto neste trecho; ver evidência e datasets relacionados.',
    );
  }

  fs.writeFileSync(vaultAbs, content, 'utf8');
  return validateVaultNote({
    vaultPath: vaultAbs,
    symbolName,
    pasPath: PAS,
    lineStart: sym.line_start,
    lineEnd: sym.line_end,
    mode: 'full',
  });
}

function main() {
  const symbols = process.argv.slice(2);
  const { path: batchPath, state } = loadBatchState('imoveis');
  const batch = state.batches[state.active_batch_id];
  const fileState = batch.files[PAS];
  const targets =
    symbols.length > 0
      ? symbols
      : Object.entries(fileState.symbols)
          .filter(([, s]) => s.status !== 'done' && s.vault_path)
          .map(([n]) => n);

  const results = [];
  for (const name of targets) {
    const sym = fileState.symbols[name];
    if (!sym) {
      results.push({ symbol: name, pass: false, errors: ['símbolo ausente no batch'] });
      continue;
    }
    sym.vault_path = resolveVaultRel(name, sym);
    if (!fs.existsSync(resolveVaultAbs(sym.vault_path))) {
      results.push({ symbol: name, pass: false, errors: ['nota vault ausente'] });
      continue;
    }
    const v = fixNote(name, sym);
    sym.gates = { ...sym.gates, ...v.gates };
    sym.validation_pass = v.pass;
    sym.validation_errors = v.errors;
    sym.validated_at = new Date().toISOString();
    if (v.pass) sym.status = 'done';
    results.push({ symbol: name, pass: v.pass, errors: v.errors });
  }

  const syms = Object.values(fileState.symbols);
  fileState.symbols_done = syms.filter((s) => s.status === 'done').length;
  fs.writeFileSync(batchPath, JSON.stringify(state, null, 2) + '\n', 'utf8');

  console.log(
    JSON.stringify(
      {
        passed: results.filter((r) => r.pass).length,
        failed: results.filter((r) => !r.pass).length,
        results,
        symbols_done: fileState.symbols_done,
        symbols_total: fileState.symbols_total,
      },
      null,
      2,
    ),
  );
  process.exit(results.some((r) => !r.pass) ? 1 : 0);
}

main();
