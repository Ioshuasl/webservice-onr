#!/usr/bin/env node
/**
 * Extração determinística de símbolos Delphi 7 (.pas) — Fase 0 do pipeline legado.
 *
 * Uso:
 *   node scripts/extract-delphi-symbols.cjs --file RegistroDeImoveis/dmPedido.pas --product-slug imoveis
 *   node scripts/extract-delphi-symbols.cjs --file ... --sync-vault --update-batch
 */
const fs = require('fs');
const path = require('path');
const {
  CODE_ROOT,
  VAULT_ROOT,
  DELPHI_PRODUCTS,
  VENDOR_UNIT_PATTERNS,
} = require('./delphi-batch-paths.cjs');

const RTL_UNITS = new Set([
  'SysUtils', 'Classes', 'Forms', 'Dialogs', 'Windows', 'Controls', 'Graphics',
  'DB', 'DBClient', 'Variants', 'Math', 'ClipBrd', 'ComCtrls', 'StdCtrls',
  'EncdDecd', 'xmldom', 'XMLIntf', 'msxmldom', 'XMLDoc', 'InvokeRegistry',
  'Rio', 'SimpleDS', 'Data', 'DBXFirebird', 'Soap', 'NetEncoding', 'ShellAPI',
]);

function parseArgs(argv) {
  const args = {
    file: null,
    productSlug: null,
    syncVault: false,
    updateBatch: false,
    writeIndex: true,
    out: null,
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--file') args.file = argv[++i];
    else if (a === '--product-slug') args.productSlug = argv[++i];
    else if (a === '--sync-vault') args.syncVault = true;
    else if (a === '--update-batch') args.updateBatch = true;
    else if (a === '--no-index') args.writeIndex = false;
    else if (a === '--out') args.out = argv[++i];
    else if (a === '--help' || a === '-h') args.help = true;
  }
  return args;
}

function usage() {
  console.log(`Uso:
  node scripts/extract-delphi-symbols.cjs --file <path-relativo> --product-slug <slug> [opções]

Opções:
  --sync-vault       Grava manifest + índice no Obsidian Vault
  --update-batch     Atualiza scripts/delphi-<slug>-batch-state.json
  --no-index         Não gera unidades/<Unit>.md
  --out <path>       JSON de saída (default: stdout se sem --sync-vault)

Slugs: ${Object.keys(DELPHI_PRODUCTS).join(', ')}
`);
}

function readPasFile(absPath) {
  return fs.readFileSync(absPath, 'latin1');
}

function stripLineComment(line) {
  let inStr = false;
  let strChar = '';
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inStr) {
      if (c === strChar) inStr = false;
      continue;
    }
    if (c === "'" || c === '"') {
      inStr = true;
      strChar = c;
      continue;
    }
    if (c === '{' ) return line.slice(0, i);
    if (c === '/' && line[i + 1] === '/') return line.slice(0, i);
  }
  return line;
}

function removeBlockComments(text) {
  return text.replace(/\{[\s\S]*?\}/g, '\n');
}

function parseUsesBlock(section) {
  const m = section.match(/\buses\b([\s\S]*?);/i);
  if (!m) return [];
  return m[1]
    .split(',')
    .map((s) => s.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .map((s) => s.split(/\s+/)[0]);
}

function splitInterfaceImplementation(content) {
  const implMatch = content.match(/^implementation\b/im);
  if (!implMatch) return { interface: content, implementation: '' };
  const idx = implMatch.index;
  return {
    interface: content.slice(0, idx),
    implementation: content.slice(idx),
  };
}

function parseUnitName(content) {
  const m = content.match(/^unit\s+(\w+)\s*;/im);
  return m ? m[1] : null;
}

function parseTypes(interfacePart) {
  const types = [];
  const typeSection = interfacePart.match(/\btype\b([\s\S]*?)\bvar\b/i);
  if (!typeSection) return types;
  const block = typeSection[1];
  const classRe = /(\w+)\s*=\s*class\s*(?:\((\w+)\))?/gi;
  let m;
  while ((m = classRe.exec(block))) {
    types.push({
      name: m[1],
      kind: 'class',
      ancestor: m[2] || null,
      line: contentLineAt(block, m.index, interfacePart),
    });
  }
  const recordRe = /(\w+)\s*=\s*record\b/gi;
  while ((m = recordRe.exec(block))) {
    types.push({
      name: m[1],
      kind: 'record',
      ancestor: null,
      line: contentLineAt(block, m.index, interfacePart),
    });
  }
  return types;
}

function contentLineAt(sub, index, fullBeforeImpl) {
  const before = fullBeforeImpl.slice(0, fullBeforeImpl.indexOf(sub) + index);
  return before.split(/\r?\n/).length;
}

function parseInterfaceDeclarations(interfacePart, mainClass) {
  const decls = [];
  const classMatch = interfacePart.match(
    new RegExp(`\\b${mainClass}\\s*=\\s*class[\\s\\S]*?\\bend\\s*;`, 'i'),
  );
  const searchIn = classMatch ? classMatch[0] : interfacePart;
  const re = /^\s*(procedure|function)\s+([\w.]+)\s*(\([^)]*\))?/gim;
  let m;
  while ((m = re.exec(searchIn))) {
    const fullName = m[2];
    const parts = fullName.split('.');
    const name = parts.length > 1 ? parts[1] : parts[0];
    const cls = parts.length > 1 ? parts[0] : mainClass;
    decls.push({
      name,
      class: cls,
      kind: m[1].toLowerCase(),
      visibility: 'published',
      line_declaration: contentLineAt(searchIn, m.index, interfacePart),
    });
  }
  return decls;
}

function countBeginEnd(line) {
  const s = stripLineComment(line).toLowerCase();
  let begins = 0;
  let ends = 0;
  const re = /\b(begin|end)\b/g;
  let m;
  while ((m = re.exec(s))) {
    if (m[1] === 'begin') begins++;
    else ends++;
  }
  return { begins, ends };
}

function findImplementationSymbols(lines, implStartIdx, className) {
  const symbols = [];
  const re = new RegExp(
    `^(procedure|function)\\s+(?:(${className})\\.)?(\\w+)`,
    'i',
  );
  let blockDepth = 0;

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const line = stripLineComment(raw).trim();
    if (!line || line.startsWith('//')) continue;
    if (line.startsWith('{') || line.startsWith('(*')) continue;

    const m = line.match(re);
    if (m && blockDepth === 0) {
      const kind = m[1].toLowerCase();
      const cls = m[2] || className;
      const name = m[3];
      const lineStart = implStartIdx + i + 1;

      const lineEnd = findBlockEnd(lines, implStartIdx, i);
      symbols.push({
        name,
        class: cls,
        kind,
        line_start: lineStart,
        line_end: lineEnd,
        visibility: 'public',
      });
      continue;
    }

    const { begins, ends } = countBeginEnd(stripLineComment(raw));
    blockDepth += begins - ends;
    if (blockDepth < 0) blockDepth = 0;
  }
  return symbols;
}

function markNestedSymbols(items) {
  const list = items.filter((s) => s.has_body && s.line_start && s.line_end);
  for (const inner of list) {
    const innerSpan = inner.line_end - inner.line_start;
    if (innerSpan < 5) continue;
    for (const outer of list) {
      if (inner.name === outer.name) continue;
      const outerSpan = outer.line_end - outer.line_start;
      if (outerSpan <= innerSpan) continue;
      if (
        inner.line_start >= outer.line_start
        && inner.line_end <= outer.line_end
      ) {
        inner.nested_in = outer.name;
        inner.skip_analyze = true;
        break;
      }
    }
  }
  return items;
}

function findBlockEnd(lines, implStartIdx, startIdx) {
  let i = startIdx + 1;
  let depth = 0;
  let foundBegin = false;

  while (i < lines.length) {
    const line = stripLineComment(lines[i]);
    const trimmed = line.trim();
    if (!foundBegin) {
      if (/\bbegin\b/i.test(trimmed)) {
        foundBegin = true;
        depth = 1;
        i++;
        continue;
      }
      if (/^end\s*;/i.test(trimmed) && depth === 0) {
        return i + 1;
      }
      i++;
      continue;
    }
    const { begins, ends } = countBeginEnd(line);
    depth += begins - ends;
    if (depth <= 0 && /\bend\b/i.test(trimmed)) {
      return implStartIdx + i + 1;
    }
    i++;
  }
  return implStartIdx + startIdx + 1;
}

function mergeDeclarationsWithImpl(interfaceDecls, implSymbols) {
  const byName = new Map();
  for (const s of implSymbols) {
    byName.set(s.name.toLowerCase(), s);
  }
  const merged = [];
  const seen = new Set();

  for (const d of interfaceDecls) {
    const impl = byName.get(d.name.toLowerCase());
    merged.push({
      name: d.name,
      class: d.class,
      kind: d.kind,
      visibility: d.visibility,
      line_declaration: d.line_declaration,
      line_start: impl?.line_start ?? null,
      line_end: impl?.line_end ?? null,
      has_body: Boolean(impl),
    });
    seen.add(d.name.toLowerCase());
  }

  for (const s of implSymbols) {
    if (seen.has(s.name.toLowerCase())) continue;
    merged.push({
      name: s.name,
      class: s.class,
      kind: s.kind,
      visibility: 'implementation-only',
      line_declaration: null,
      line_start: s.line_start,
      line_end: s.line_end,
      has_body: true,
    });
  }
  return merged;
}

function isVendorUnit(unitName) {
  return VENDOR_UNIT_PATTERNS.some((re) => re.test(unitName));
}

function isDuplicateFile(filePath) {
  return /c[oó]pia\s+de/i.test(path.basename(filePath));
}

function findDfmPair(absPas, productPath, unitName) {
  const dfmSame = absPas.replace(/\.pas$/i, '.dfm');
  if (fs.existsSync(dfmSame)) {
    return {
      path: path.join(productPath, path.basename(dfmSame)).replace(/\\/g, '/'),
      form_class: null,
    };
  }
  const alt = path.join(path.dirname(absPas), `${unitName}.dfm`);
  if (fs.existsSync(alt)) {
    return {
      path: path.join(productPath, `${unitName}.dfm`).replace(/\\/g, '/'),
      form_class: null,
    };
  }
  return null;
}

function inferFormClass(types) {
  const dm = types.find((t) => t.kind === 'class' && /Tdm\w+/i.test(t.name));
  if (dm) return dm.name;
  const form = types.find((t) => t.kind === 'class' && /^T\w+/.test(t.name));
  return form?.name ?? null;
}

function extractPas(absPath, productProfile) {
  const raw = readPasFile(absPath);
  const contentNoBlocks = removeBlockComments(raw);
  const lines = raw.split(/\r?\n/);
  const { interface: iface, implementation: impl } = splitInterfaceImplementation(contentNoBlocks);

  const unit = parseUnitName(contentNoBlocks);
  const usesInterface = parseUsesBlock(iface);
  const usesImplementation = parseUsesBlock(impl);
  const types = parseTypes(iface);
  const mainClass =
    types.find((t) => t.kind === 'class' && /^Tdm/i.test(t.name))?.name ||
    types.find((t) => t.kind === 'class')?.name ||
    null;

  const implStartIdx = raw.match(/^implementation\b/im)
    ? raw.slice(0, raw.match(/^implementation\b/im).index).split(/\r?\n/).length - 1
    : lines.length - 1;

  const implLines = lines.slice(implStartIdx);
  const interfaceDecls = mainClass
    ? parseInterfaceDeclarations(iface, mainClass)
    : [];
  const implSymbols = mainClass
    ? findImplementationSymbols(implLines, implStartIdx, mainClass)
    : [];

  const merged = markNestedSymbols(
    mergeDeclarationsWithImpl(interfaceDecls, implSymbols),
  );
  const procedures = merged.filter((s) => s.kind === 'procedure');
  const functions = merged.filter((s) => s.kind === 'function');

  const related = [...usesInterface, ...usesImplementation].filter(
    (u) => !RTL_UNITS.has(u) && !isVendorUnit(u),
  );
  const uniqueRelated = [...new Set(related)];

  const relPath = path
    .join(productProfile.product_path, path.basename(absPath))
    .replace(/\\/g, '/');

  const dfmPair = findDfmPair(absPath, productProfile.product_path, unit);
  if (dfmPair && mainClass) {
    dfmPair.form_class = inferFormClass(types);
  }

  return {
    unit,
    path: relPath,
    product_slug: productProfile.product_slug,
    delphi_version: 7,
    ide: 'Embarcadero RAD Studio',
    line_count: lines.length,
    indexed_at: new Date().toISOString(),
    vendor: isVendorUnit(unit),
    duplicate: isDuplicateFile(absPath),
    main_class: mainClass,
    uses_interface: usesInterface,
    uses_implementation: usesImplementation,
    types,
    procedures,
    functions,
    symbols_total: procedures.length + functions.length,
    symbols_with_body: merged.filter((s) => s.has_body && s.line_start).length,
    dfm_pair: dfmPair,
    related_units: uniqueRelated,
  };
}

function generateUnitIndexMd(manifest) {
  const rows = [...manifest.procedures, ...manifest.functions]
    .filter((s) => s.has_body && s.line_start)
    .map((s) => {
      const link = `[[${s.name}]]`;
      const lines =
        s.line_end && s.line_end !== s.line_start
          ? `${s.line_start}–${s.line_end}`
          : `${s.line_start}`;
      return `| ${link} | ${s.kind} | ${s.class || '—'} | ${lines} | pendente |`;
    });

  return `---
tipo: legado-delphi
area: orius
produto: ${manifest.product_slug}
artefato: pas
unit: ${manifest.unit}
arquivo: ${manifest.path}
status: rascunho
fonte: extract-delphi-symbols
atualizado: ${manifest.indexed_at.slice(0, 10)}
---

# Unit \`${manifest.unit}\`

| Campo | Valor |
|-------|-------|
| Arquivo | \`${manifest.path}\` |
| Classe principal | \`${manifest.main_class || '—'}\` |
| Linhas | ${manifest.line_count} |
| Símbolos (interface) | ${manifest.symbols_total} |
| Com corpo (implementation) | ${manifest.symbols_with_body} |
| Manifest | [[Orius/desenvolvimento/legado-delphi/produtos/${manifest.product_slug}/manifest/${manifest.unit}.symbols.json]] |
| DFM | ${manifest.dfm_pair ? `\`${manifest.dfm_pair.path}\`` : '—'} |

## Uses (interface)

${manifest.uses_interface.map((u) => `- \`${u}\``).join('\n')}

## Uses (implementation)

${manifest.uses_implementation.map((u) => `- \`${u}\``).join('\n')}

## Símbolos com implementation

| Símbolo | Tipo | Classe | Linhas | Análise |
|---------|------|--------|--------|---------|
${rows.join('\n')}

## Types

${manifest.types.map((t) => `- \`${t.name}\` (${t.kind}${t.ancestor ? ` → ${t.ancestor}` : ''}) L${t.line}`).join('\n')}
`;
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeVaultArtifacts(manifest, productProfile, writeIndex) {
  const hub = path.join(
    VAULT_ROOT,
    productProfile.vault_hub.replace(/\//g, path.sep),
  );
  const manifestDir = path.join(hub, 'manifest');
  ensureDir(manifestDir);

  const manifestPath = path.join(manifestDir, `${manifest.unit}.symbols.json`);
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

  const vaultManifestRel = `${productProfile.vault_hub}/manifest/${manifest.unit}.symbols.json`;

  if (writeIndex) {
    const unitDir = path.join(hub, 'unidades');
    ensureDir(unitDir);
    const indexPath = path.join(unitDir, `${manifest.unit}.md`);
    fs.writeFileSync(indexPath, generateUnitIndexMd(manifest), 'utf8');
  }

  return {
    manifestPath,
    vaultManifestRel,
    indexPath: writeIndex
      ? `${productProfile.vault_hub}/unidades/${manifest.unit}.md`
      : null,
  };
}

function updateBatchState(manifest, productProfile, prioritySymbols, vaultManifestRel) {
  const batchPath = productProfile.batch_file;
  let state;
  if (fs.existsSync(batchPath)) {
    state = JSON.parse(fs.readFileSync(batchPath, 'utf8'));
  } else {
    state = {
      product_slug: productProfile.product_slug,
      code_root: CODE_ROOT,
      product_path: productProfile.product_path,
      batch_state_file: `scripts/${path.basename(batchPath)}`,
      active_batch_id: null,
      batches: {},
    };
  }

  const batchId = state.active_batch_id || `imoveis-dmPedido-poc`;
  if (!state.batches[batchId]) {
    state.batches[batchId] = {
      batch_id: batchId,
      product_slug: productProfile.product_slug,
      product_path: productProfile.product_path,
      vault_hub: productProfile.vault_hub,
      started_at: new Date().toISOString(),
      completed_at: null,
      execution_order: [manifest.path],
      current_file: manifest.path,
      status: 'in_progress',
      files: {},
    };
  }

  const batch = state.batches[batchId];
  state.active_batch_id = batchId;

  const fileKey = manifest.path;
  if (!batch.execution_order.includes(fileKey)) {
    batch.execution_order.push(fileKey);
  }

  const symbolsMap = {};
  const allSymbols = [...manifest.procedures, ...manifest.functions].filter(
    (s) => s.has_body && s.line_start,
  );

  for (const s of allSymbols) {
    const isPriority = prioritySymbols.some(
      (p) => p.toLowerCase() === s.name.toLowerCase(),
    );
    symbolsMap[s.name] = {
      symbol_type: s.kind,
      class: s.class,
      line_start: s.line_start,
      line_end: s.line_end,
      status: s.skip_analyze ? 'skip' : 'pending',
      priority: isPriority,
      vault_path: null,
      nested_in: s.nested_in || null,
      skip_analyze: Boolean(s.skip_analyze),
      gates: {
        evidencia: false,
        sql: false,
        chamadas: false,
        briefing: false,
      },
    };
  }

  batch.files[fileKey] = {
    index_status: 'done',
    analyze_status: 'pending',
    symbols_total: allSymbols.length,
    symbols_done: 0,
    manifest_vault: vaultManifestRel,
    manifest_repo: null,
    priority_symbols: prioritySymbols.filter((p) =>
      allSymbols.some((s) => s.name.toLowerCase() === p.toLowerCase()),
    ),
    vendor: manifest.vendor,
    duplicate: manifest.duplicate,
    symbols: symbolsMap,
  };

  batch.current_file = fileKey;
  batch.status = 'in_progress';

  fs.writeFileSync(batchPath, JSON.stringify(state, null, 2), 'utf8');
  return { batchPath, batchId, symbolsTracked: allSymbols.length };
}

const DEFAULT_PRIORITY = [
  'ConfirmarPrenotacao',
  'Prenotar',
  'ValidacaoAntesPrenotacao',
  'NovoAndamento',
  'ExecutarVerificacoesDoAndamento',
  'EstornarProtocolo',
  'GerarSelosAindaNaoGerados',
  'AtualizarStatusAndamento',
];

function main() {
  const args = parseArgs(process.argv);
  if (args.help || !args.file || !args.productSlug) {
    usage();
    process.exit(args.help ? 0 : 1);
  }

  const productProfile = DELPHI_PRODUCTS[args.productSlug];
  if (!productProfile) {
    console.error(`Slug desconhecido: ${args.productSlug}`);
    process.exit(1);
  }

  const absPath = path.isAbsolute(args.file)
    ? args.file
    : path.join(CODE_ROOT, args.file);

  if (!fs.existsSync(absPath)) {
    console.error(`Arquivo não encontrado: ${absPath}`);
    process.exit(1);
  }

  const manifest = extractPas(absPath, productProfile);

  let vaultInfo = null;
  if (args.syncVault) {
    vaultInfo = writeVaultArtifacts(manifest, productProfile, args.writeIndex);
    console.error(`Vault manifest: ${vaultInfo.manifestPath}`);
    if (vaultInfo.indexPath) console.error(`Vault índice: ${vaultInfo.indexPath}`);
  }

  if (args.out) {
    ensureDir(path.dirname(args.out));
    fs.writeFileSync(args.out, JSON.stringify(manifest, null, 2), 'utf8');
    console.error(`JSON: ${args.out}`);
  }

  let batchInfo = null;
  if (args.updateBatch) {
    if (!vaultInfo) {
      console.error('--update-batch requer --sync-vault (manifest_vault path)');
      process.exit(1);
    }
    batchInfo = updateBatchState(
      manifest,
      productProfile,
      DEFAULT_PRIORITY,
      vaultInfo.vaultManifestRel,
    );
    console.error(`Batch: ${batchInfo.batchPath} (${batchInfo.batchId})`);
    console.error(`Símbolos rastreados: ${batchInfo.symbolsTracked}`);
    console.error(`Prioridade: ${DEFAULT_PRIORITY.join(', ')}`);
  }

  if (!args.syncVault && !args.out) {
    console.log(JSON.stringify(manifest, null, 2));
  }

  console.error(
    `\nResumo: ${manifest.unit} — ${manifest.symbols_total} declarações, ${manifest.symbols_with_body} com corpo`,
  );
}

main();
