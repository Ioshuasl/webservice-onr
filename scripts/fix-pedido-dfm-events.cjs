#!/usr/bin/env node
/**
 * Marca eventos Pedido.dfm done reutilizando notas .pas existentes.
 */
const fs = require('fs');
const path = require('path');
const { validateVaultNote, resolveVaultAbs } = require('./delphi-validate-lib.cjs');
const { loadBatchState } = require('./delphi-triage-lib.cjs');
const { CODE_ROOT } = require('./delphi-batch-paths.cjs');

const PAS = 'RegistroDeImoveis/Pedido.pas';
const DFM = 'RegistroDeImoveis/Pedido.dfm';
const BASE = 'Orius/desenvolvimento/legado-delphi/produtos/imoveis';

const HANDLERS = process.argv.slice(2);

function resolveVault(handler) {
  const candidates = [
    `${BASE}/formularios/Pedido/${handler}.md`,
    `${BASE}/unidades/Pedido/${handler}.md`,
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
  const body = [
    `Fonte: \`${PAS}\` L${lineStart}–${lineEnd}.`,
    '',
    '```pascal',
    excerpt + omit,
    '```',
  ].join('\n');
  const re = /^## Evidência\s*$([\s\S]*?)(?=^## |\Z)/im;
  if (re.test(content)) {
    return content.replace(re, `## Evidência\n\n${body}\n\n`);
  }
  return content + `\n\n## Evidência\n\n${body}\n`;
}

function main() {
  const { path: batchPath, state } = loadBatchState('imoveis');
  const fileState = state.batches[state.active_batch_id].files[DFM];
  const targets =
    HANDLERS.length > 0
      ? HANDLERS
      : Object.keys(fileState.events).filter((h) => {
          if (fileState.events[h].status !== 'pending') return false;
          return resolveVault(h) != null;
        });

  const results = [];
  for (const handler of targets) {
    const ev = fileState.events[handler];
    if (!ev) {
      results.push({ handler, pass: false, errors: ['evento ausente no batch'] });
      continue;
    }
    const vaultRel = resolveVault(handler);
    if (!vaultRel) {
      results.push({ handler, pass: false, errors: ['nota vault ausente'] });
      continue;
    }
    const vaultAbs = resolveVaultAbs(vaultRel);
    let content = fs.readFileSync(vaultAbs, 'utf8');
    const srcLines = readSrc(ev.handler_line_start, ev.handler_line_end);
    content = fixEvidence(content, ev.handler_line_start, ev.handler_line_end, srcLines);
    fs.writeFileSync(vaultAbs, content, 'utf8');

    const v = validateVaultNote({
      vaultPath: vaultAbs,
      symbolName: handler,
      pasPath: PAS,
      lineStart: ev.handler_line_start,
      lineEnd: ev.handler_line_end,
      mode: 'full',
    });

    ev.vault_path = vaultRel;
    ev.gates = { ...ev.gates, ...v.gates };
    ev.validation_pass = v.pass;
    ev.validation_errors = v.errors;
    ev.validated_at = new Date().toISOString();
    if (v.pass) ev.status = 'done';

    results.push({ handler, pass: v.pass, vault_path: vaultRel, errors: v.errors });
  }

  const events = Object.values(fileState.events);
  fileState.events_done = events.filter((e) => e.status === 'done').length;
  fileState.analyze_progress_pct =
    fileState.events_total > 0
      ? Math.round((fileState.events_done / fileState.events_total) * 1000) / 10
      : 0;
  if (fileState.events_done === fileState.events_total) {
    fileState.analyze_status = 'done';
  } else if (fileState.events_done > 0) {
    fileState.analyze_status = 'in_progress';
  }

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
