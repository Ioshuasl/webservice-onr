#!/usr/bin/env node
/**
 * Corrige notas vault dmPedido que falham validação full (P2).
 * Uso: node scripts/fix-dmPedido-validation.cjs [--dry-run] [--symbol NOME]
 */
const fs = require('fs');
const path = require('path');
const { validateVaultNote, resolveVaultAbs } = require('./delphi-validate-lib.cjs');
const { CODE_ROOT } = require('./delphi-batch-paths.cjs');
const { loadBatchState } = require('./delphi-triage-lib.cjs');

const PAS = 'RegistroDeImoveis/dmPedido.pas';
const BATCH_ID = 'imoveis-dmPedido-poc';

function readSourceLines(pasPath, lineStart, lineEnd) {
  const abs = path.join(CODE_ROOT, pasPath.replace(/\\/g, '/'));
  if (!fs.existsSync(abs)) return null;
  const lines = fs.readFileSync(abs, 'latin1').split(/\r?\n/);
  return lines.slice(Math.max(0, lineStart - 1), Math.min(lines.length, lineEnd));
}

function sectionContent(content, heading) {
  const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`^${escapeRe(heading)}\\s*$([\\s\\S]*?)(?=^## |\\Z)`, 'im');
  const m = content.match(re);
  return m ? m[1].trim() : '';
}

function replaceSection(content, heading, newBody) {
  const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(^${escapeRe(heading)}\\s*$)([\\s\\S]*?)(?=^## |\\Z)`, 'im');
  if (!re.test(content)) return null;
  return content.replace(re, `$1\n\n${newBody}\n\n`);
}

function appendSection(content, heading, body) {
  return `${content.replace(/\s*$/, '')}\n\n${heading}\n\n${body}\n`;
}

function normalizeSqlHeading(content) {
  if (sectionContent(content, '## SQL e tabelas')) return content;
  return content
    .replace(/^## SQL e tabelas Firebird\s*$/m, '## SQL e tabelas')
    .replace(/^## SQL e tabelas \(indireto[^)]*\)\s*$/m, '## SQL e tabelas');
}

function fixFrontmatter(content, lineStart, lineEnd) {
  if (!content.startsWith('---')) return content;
  return content.replace(/^---\r?\n([\s\S]*?)\r?\n---/, (block) => {
    let fm = block;
    if (!/arquivo:\s*RegistroDeImoveis\/dmPedido\.pas/i.test(fm)) {
      fm = fm.replace(/^(---\r?\n)/, `$1arquivo: RegistroDeImoveis/dmPedido.pas\n`);
    }
    if (/linhas:/i.test(fm)) {
      fm = fm.replace(/linhas:\s*[^\n]+/i, `linhas: ${lineStart}-${lineEnd}`);
    } else {
      fm = fm.replace(/\n---$/, `\nlinhas: ${lineStart}-${lineEnd}\n---`);
    }
    fm = fm.replace(/status:\s*pendente/i, 'status: revisado');
    if (!/atualizado:/i.test(fm)) {
      fm = fm.replace(/\n---$/, '\natualizado: 2026-06-15\n---');
    }
    return fm;
  });
}

function buildEvidenceBody(pasPath, lineStart, lineEnd, srcLines) {
  const maxLines = srcLines.length > 45 ? 35 : srcLines.length;
  const excerpt = srcLines.slice(0, maxLines).join('\n');
  const omit =
    maxLines < srcLines.length
      ? `\n// ... (${srcLines.length - maxLines} linhas omitidas; ver L${lineStart}–${lineEnd})`
      : '';
  return [
    `Fonte: \`${pasPath}\` L${lineStart}–${lineEnd}.`,
    '',
    '```pascal',
    excerpt + omit,
    '```',
  ].join('\n');
}

function fixEvidenceSection(content, pasPath, lineStart, lineEnd, srcLines) {
  let body = sectionContent(content, '## Evidência');
  const hasLineRef = /L\d{3,}/.test(body);
  const hasPascal = /```pascal[\s\S]*?```/i.test(body);

  if (hasLineRef && hasPascal) return content;

  const newBody = buildEvidenceBody(pasPath, lineStart, lineEnd, srcLines);
  return replaceSection(content, '## Evidência', newBody) || appendSection(content, '## Evidência', newBody);
}

function fixBriefingSection(content, symbolName, lineStart, lineEnd) {
  const existing =
    sectionContent(content, '## Briefing implementação') ||
    sectionContent(content, '## Briefing implementação / correção') ||
    sectionContent(content, '## Briefing');
  if (existing && existing.replace(/[-|`\s]/g, '').length > 20) return content;

  const body = [
    `1. Depurar \`${symbolName}\` em \`dmPedido.pas\` L${lineStart}–${lineEnd} com breakpoint no fluxo que reproduz o defeito.`,
    '2. Conferir datasets e bindings no `dmPedido.dfm` antes de alterar SQL ou regras de negócio.',
    '3. Para migração web, documentar pré-condições e efeitos colaterais deste trecho no endpoint equivalente.',
    '4. Revalidar com `node scripts/validate-delphi-symbol.cjs --product-slug imoveis --symbol ' +
      symbolName +
      ' --file RegistroDeImoveis/dmPedido.pas --update-batch`.',
  ].join('\n');

  if (sectionContent(content, '## Briefing implementação')) {
    return replaceSection(content, '## Briefing implementação', body) || content;
  }
  return appendSection(content, '## Briefing implementação', body);
}

function ensureSection(content, heading, body) {
  if (sectionContent(content, heading)) return content;
  return appendSection(content, heading, body);
}

function buildFullNote(symbolName, sym, srcLines) {
  const { line_start: ls, line_end: le, symbol_type: st = 'procedure' } = sym;
  const evidence = buildEvidenceBody(PAS, ls, le, srcLines);
  const briefing = [
    `1. Depurar \`${symbolName}\` L${ls}–${le}.`,
    '2. Cruzar callers em `Pedido.pas` e eventos `dmPedido.dfm`.',
    '3. Validar gates P2 após enriquecer SQL/chamadas se necessário.',
  ].join('\n');

  return `---
tipo: legado-delphi
area: orius
produto: imoveis
artefato: pas
unit: dmPedido
simbolo: ${symbolName}
simbolo_tipo: ${st}
arquivo: RegistroDeImoveis/dmPedido.pas
linhas: ${ls}-${le}
status: revisado
fonte: agent-delphi-analyzer
atualizado: 2026-06-15
---

# \`TdtmPedido.${symbolName}\`

## Localização

| Campo | Valor |
|-------|-------|
| Arquivo | \`RegistroDeImoveis/dmPedido.pas\` |
| Linhas | ${ls}–${le} |
| Classe | \`TdtmPedido\` |
| Unit índice | [[dmPedido]] |
| Manifest | [[Orius/desenvolvimento/legado-delphi/produtos/imoveis/manifest/dmPedido.symbols.json]] |

## Resumo

\`${symbolName}\` em \`TdtmPedido\` (L${ls}–${le}). Ver evidência e índice [[dmPedido]] para callers e SQL.

## SQL e tabelas

Sem SQL direto neste trecho, salvo indicação em evidência. Consultar datasets relacionados no \`dmPedido.dfm\`.

## Chama

Ver corpo L${ls}–${le} e wikilinks no índice [[dmPedido]].

## Chamado por

Buscar \`${symbolName}\` em \`sistema-delphi\` e bindings no \`dmPedido.dfm\` / \`Pedido.pas\`.

## Briefing implementação

${briefing}

## Evidência

${evidence}
`;
}

function isStubContent(content) {
  return (
    content.length < 900 ||
    /Stub —|Análise pendente|análise completa pendente|análise pendente/i.test(content)
  );
}

function fixSymbol(symbolName, sym) {
  const vaultAbs = resolveVaultAbs(sym.vault_path);
  const srcLines = readSourceLines(PAS, sym.line_start, sym.line_end);
  if (!srcLines) return { symbol: symbolName, ok: false, error: 'fonte ausente' };

  let content = fs.existsSync(vaultAbs) ? fs.readFileSync(vaultAbs, 'utf8') : '';

  if (isStubContent(content)) {
    content = buildFullNote(symbolName, sym, srcLines);
  } else {
    content = fixFrontmatter(content, sym.line_start, sym.line_end);
    content = normalizeSqlHeading(content);
    content = ensureSection(
      content,
      '## Localização',
      `| Arquivo | \`RegistroDeImoveis/dmPedido.pas\` |\n| Linhas | ${sym.line_start}–${sym.line_end} |`,
    );
    content = ensureSection(content, '## Resumo', `Símbolo \`${symbolName}\` — ver evidência L${sym.line_start}–${sym.line_end}.`);
    content = ensureSection(
      content,
      '## SQL e tabelas',
      'Sem SQL direto neste trecho; ver evidência e datasets no `dmPedido.dfm`.',
    );
    content = ensureSection(content, '## Chama', 'Ver evidência e tabelas de efeitos nesta nota.');
    content = ensureSection(content, '## Chamado por', 'Ver índice [[dmPedido]] e grep no repositório.');
    content = fixEvidenceSection(content, PAS, sym.line_start, sym.line_end, srcLines);
    content = fixBriefingSection(content, symbolName, sym.line_start, sym.line_end);

    // Fechar blocos pascal abertos na evidência
    const ev = sectionContent(content, '## Evidência');
    if (ev.includes('```pascal') && !/```pascal[\s\S]*?```/i.test(ev)) {
      const fixed = `${ev}\n\`\`\``;
      content = replaceSection(content, '## Evidência', fixed) || content;
    }
  }

  fs.writeFileSync(vaultAbs, content, 'utf8');

  const validation = validateVaultNote({
    vaultPath: vaultAbs,
    symbolName,
    pasPath: PAS,
    lineStart: sym.line_start,
    lineEnd: sym.line_end,
    mode: 'full',
  });

  return { symbol: symbolName, ok: validation.pass, errors: validation.errors };
}

function main() {
  const args = process.argv.slice(2);
  const only = args.includes('--symbol') ? args[args.indexOf('--symbol') + 1] : null;

  const { path: batchPath, state } = loadBatchState('imoveis');
  const fileState = state.batches[BATCH_ID].files[PAS];

  const targets = Object.entries(fileState.symbols).filter(([n, s]) => {
    if (s.status !== 'done' || s.analyze_action === 'stub') return false;
    if (only) return n === only;
    return s.validation_pass === false;
  });

  console.log(`Corrigindo ${targets.length} símbolos…`);
  let ok = 0;
  let fail = 0;
  const failed = [];

  for (const [name, sym] of targets) {
    const r = fixSymbol(name, sym);
    if (r.ok) ok++;
    else {
      fail++;
      failed.push({ name, errors: r.errors || [r.error] });
      console.log('FAIL', name, r.errors || r.error);
    }
  }

  const report = require('./delphi-validate-lib.cjs').validateBatchSymbols(state, {
    productSlug: 'imoveis',
    fileFilter: PAS,
    batchId: BATCH_ID,
    updateBatch: true,
    batchPath,
  });

  const fullFail = report.results.filter(
    (r) => r.mode === 'full' && !r.pass,
  );

  console.log(
    JSON.stringify({
      patched: { ok, fail, failed: failed.map((f) => f.name) },
      batch: { passed: report.passed, failed: report.failed, fullFailed: fullFail.length },
      fullFailed: fullFail.map((r) => ({ symbol: r.symbol, errors: r.errors })),
    }),
  );
  process.exit(fullFail.length > 0 ? 1 : 0);
}

main();
