#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { validateVaultNote, resolveVaultAbs } = require('./delphi-validate-lib.cjs');
const { loadBatchState } = require('./delphi-triage-lib.cjs');
const { CODE_ROOT } = require('./delphi-batch-paths.cjs');

const PAS = 'RegistroDeImoveis/dmPedido.pas';
const DFM = 'RegistroDeImoveis/dmPedido.dfm';
const BASE = 'Orius/desenvolvimento/legado-delphi/produtos/imoveis';

function cleanHandler(h) {
  return h.replace(/^'|'$/g, '');
}

function resolveVault(handler) {
  const name = cleanHandler(handler);
  const candidates = [
    `${BASE}/unidades/dmPedido/${name}.md`,
    `${BASE}/formularios/dmPedido/${name}.md`,
  ];
  for (const rel of candidates) {
    const abs = resolveVaultAbs(rel);
    if (fs.existsSync(abs) && /## Localização/m.test(fs.readFileSync(abs, 'utf8'))) return rel;
  }
  for (const rel of candidates) {
    if (fs.existsSync(resolveVaultAbs(rel))) return rel;
  }
  return null;
}

function readSrc(lineStart, lineEnd) {
  const lines = fs.readFileSync(path.join(CODE_ROOT, PAS), 'latin1').split(/\r?\n/);
  return lines.slice(lineStart - 1, lineEnd);
}

function fixEvidence(content, lineStart, lineEnd, srcLines) {
  const max = Math.min(30, srcLines.length);
  const excerpt = srcLines.slice(0, max).join('\n');
  const omit =
    max < srcLines.length
      ? `\n// ... (${srcLines.length - max} linhas omitidas; ver L${lineStart}–${lineEnd})`
      : '';
  const body = [`Fonte: \`${PAS}\` L${lineStart}–${lineEnd}.`, '', '```pascal', excerpt + omit, '```'].join('\n');
  const re = /^## Evidência\s*$([\s\S]*?)(?=^## |\Z)/im;
  return re.test(content) ? content.replace(re, `## Evidência\n\n${body}\n\n`) : content + `\n\n## Evidência\n\n${body}\n`;
}

function main() {
  const { path: batchPath, state } = loadBatchState('imoveis');
  const fileState = state.batches[state.active_batch_id].files[DFM];
  const results = [];

  for (const [handler, ev] of Object.entries(fileState.events)) {
    if (ev.status !== 'pending') continue;
    if (ev.handler_missing) {
      ev.status = 'skip';
      ev.skip_reason = `handler_missing: ${ev.component}.${ev.event} (DFM L${ev.line_dfm})`;
      results.push({ handler, pass: true, skipped: true });
      continue;
    }
    const vaultRel = resolveVault(handler);
    if (!vaultRel) {
      results.push({ handler, pass: false, errors: ['nota vault ausente'] });
      continue;
    }
    const vaultAbs = resolveVaultAbs(vaultRel);
    let content = fs.readFileSync(vaultAbs, 'utf8');
    content = fixEvidence(content, ev.handler_line_start, ev.handler_line_end, readSrc(ev.handler_line_start, ev.handler_line_end));
    fs.writeFileSync(vaultAbs, content, 'utf8');
    const v = validateVaultNote({
      vaultPath: vaultAbs,
      symbolName: cleanHandler(handler),
      pasPath: PAS,
      lineStart: ev.handler_line_start,
      lineEnd: ev.handler_line_end,
      mode: 'full',
    });
    ev.vault_path = vaultRel;
    ev.validation_pass = v.pass;
    ev.validation_errors = v.errors;
    ev.validated_at = new Date().toISOString();
    if (v.pass) ev.status = 'done';
    results.push({ handler, pass: v.pass, vault_path: vaultRel, errors: v.errors });
  }

  const events = Object.values(fileState.events);
  fileState.events_done = events.filter((e) => e.status === 'done').length;
  const actionable = events.filter((e) => e.status !== 'skip');
  if (actionable.every((e) => e.status === 'done')) fileState.analyze_status = 'done';
  else if (fileState.events_done > 0) fileState.analyze_status = 'in_progress';

  fs.writeFileSync(batchPath, JSON.stringify(state, null, 2) + '\n', 'utf8');
  console.log(
    JSON.stringify(
      {
        passed: results.filter((r) => r.pass).length,
        failed: results.filter((r) => !r.pass).length,
        events_done: fileState.events_done,
        events_total: fileState.events_total,
        results,
      },
      null,
      2,
    ),
  );
  process.exit(results.some((r) => !r.pass) ? 1 : 0);
}

main();
