#!/usr/bin/env node
/**
 * Gera árvore markdown + inventário JSON do código Delphi no Obsidian Vault.
 *
 *   node scripts/sync-delphi-tree-vault.cjs
 *   node scripts/sync-delphi-tree-vault.cjs --product-slug civil
 *   node scripts/sync-delphi-tree-vault.cjs --scaffold-batch
 */
const fs = require('fs');
const path = require('path');
const {
  CODE_ROOT,
  VAULT_ROOT,
  DELPHI_PRODUCTS,
  VENDOR_UNIT_PATTERNS,
} = require('./delphi-batch-paths.cjs');

const INDEX_NOTE = {
  imoveis: '00-indice-imoveis',
  civil: '00-indice-civil',
  protesto: '00-indice-protesto',
  rtd: '00-indice-rtd',
  caixa: '00-indice-caixa',
};

const SOURCE_EXTS = new Set(['.pas', '.dfm', '.dpr']);
const SKIP_DIRS = new Set([
  '__history',
  '__recovery',
  'dcu',
  'bkpLivroPagamento130624',
]);

function parseArgs(argv) {
  const args = { products: [], scaffoldBatch: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--product-slug') args.products.push(argv[++i]);
    else if (a === '--scaffold-batch') args.scaffoldBatch = true;
    else if (a === '--help' || a === '-h') args.help = true;
  }
  return args;
}

function isVendorName(name) {
  const base = path.basename(name, path.extname(name));
  return VENDOR_UNIT_PATTERNS.some((re) => re.test(base));
}

function categorize(relPath, ext) {
  const base = path.basename(relPath, ext);
  const lower = relPath.replace(/\\/g, '/').toLowerCase();
  if (ext === '.dpr') return 'project';
  if (ext === '.dfm') return 'form';
  if (/^dm/i.test(base)) return 'datamodule';
  if (/^frame/i.test(base) || lower.includes('/frame/')) return 'frame';
  if (/^ws/i.test(base) || lower.includes('/ws')) return 'webservice';
  if (/^u[A-Z]/.test(base)) return 'unit';
  if (/c[oó]pia de/i.test(base)) return 'duplicate';
  if (isVendorName(base)) return 'vendor';
  if (lower.includes('dependencias')) return 'dependency';
  return 'other';
}

function countLines(absPath) {
  try {
    const buf = fs.readFileSync(absPath);
    let n = 0;
    for (let i = 0; i < buf.length; i++) {
      if (buf[i] === 0x0a) n++;
    }
    if (buf.length > 0 && buf[buf.length - 1] !== 0x0a) n++;
    return n;
  } catch {
    return 0;
  }
}

function walkProduct(productPath) {
  const absRoot = path.join(CODE_ROOT, productPath);
  const nodes = [];

  function walk(dir, rel = '') {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }

    const dirs = [];
    const files = [];

    for (const ent of entries) {
      const name = ent.name;
      if (ent.isDirectory()) {
        if (SKIP_DIRS.has(name)) continue;
        dirs.push(name);
      } else if (ent.isFile()) {
        const ext = path.extname(name).toLowerCase();
        if (SOURCE_EXTS.has(ext)) files.push(name);
      }
    }

    dirs.sort((a, b) => a.localeCompare(b, 'pt-BR'));
    files.sort((a, b) => a.localeCompare(b, 'pt-BR'));

    for (const file of files) {
      const relPath = rel ? `${rel}/${file}` : file;
      const abs = path.join(dir, file);
      const ext = path.extname(file).toLowerCase();
      nodes.push({
        relPath: relPath.replace(/\\/g, '/'),
        name: file,
        ext,
        category: categorize(relPath, ext),
        lines: ext === '.pas' ? countLines(abs) : null,
        vendor: isVendorName(file),
        duplicate: /c[oó]pia de/i.test(file),
      });
    }

    for (const d of dirs) {
      walk(path.join(dir, d), rel ? `${rel}/${d}` : d);
    }
  }

  walk(absRoot);
  return nodes;
}

function buildTreeLines(productPath, nodes) {
  /** @type {Map<string, string[]>} */
  const byDir = new Map();
  byDir.set('', []);

  for (const n of nodes) {
    const parts = n.relPath.split('/');
    const file = parts.pop();
    const dir = parts.join('/');
    if (!byDir.has(dir)) byDir.set(dir, []);
    byDir.get(dir).push(n);
  }

  const lines = [`${productPath}/`];

  function renderDir(dirPath, prefix) {
    const subdirs = [...byDir.keys()]
      .filter((d) => {
        if (d === dirPath) return false;
        const parent = d.includes('/') ? d.slice(0, d.lastIndexOf('/')) : '';
        return parent === dirPath;
      })
      .sort((a, b) => a.localeCompare(b, 'pt-BR'));

    const files = (byDir.get(dirPath) || []).sort((a, b) =>
      a.relPath.localeCompare(b.relPath, 'pt-BR'),
    );

    const children = [
      ...subdirs.map((d) => ({ type: 'dir', name: d.split('/').pop(), full: d })),
      ...files.map((f) => ({ type: 'file', node: f })),
    ];

    children.forEach((child, idx) => {
      const isLast = idx === children.length - 1;
      const branch = isLast ? '└── ' : '├── ';
      const nextPrefix = prefix + (isLast ? '    ' : '│   ');

      if (child.type === 'dir') {
        lines.push(`${prefix}${branch}${child.name}/`);
        renderDir(child.full, nextPrefix);
      } else {
        const n = child.node;
        const tag = [];
        if (n.category === 'datamodule') tag.push('dm');
        if (n.category === 'project') tag.push('dpr');
        if (n.lines && n.lines > 5000) tag.push(`${n.lines}L`);
        if (n.vendor) tag.push('vendor');
        if (n.duplicate) tag.push('dup');
        const suffix = tag.length ? `  \`${tag.join(', ')}\`` : '';
        lines.push(`${prefix}${branch}${n.name}${suffix}`);
      }
    });
  }

  renderDir('', '');
  return lines;
}

function summarize(nodes) {
  const byExt = {};
  const byCat = {};
  let pasLines = 0;
  let pasCount = 0;

  for (const n of nodes) {
    byExt[n.ext] = (byExt[n.ext] || 0) + 1;
    byCat[n.category] = (byCat[n.category] || 0) + 1;
    if (n.ext === '.pas' && n.lines) {
      pasLines += n.lines;
      pasCount++;
    }
  }

  const topPas = nodes
    .filter((n) => n.ext === '.pas' && n.lines)
    .sort((a, b) => b.lines - a.lines)
    .slice(0, 15);

  const dpr = nodes.filter((n) => n.ext === '.dpr');
  const dm = nodes
    .filter((n) => n.ext === '.pas' && n.category === 'datamodule' && !n.duplicate)
    .map((n) => n.relPath)
    .sort();

  return { byExt, byCat, pasLines, pasCount, topPas, dpr, dm };
}

function generateResumoMd(profile, nodes, summary) {
  const { byExt, byCat, topPas, dpr, dm } = summary;
  const relRoot = profile.product_path;

  return `---
tipo: documentacao
area: orius
produto: ${profile.product_slug}
tags: [orius, delphi7, inventario, arvore-fontes]
status: revisado
fonte: sync-delphi-tree-vault
atualizado: ${new Date().toISOString().slice(0, 10)}
---

# Inventário — árvore de fontes (${relRoot})

**Código:** \`${CODE_ROOT}/${relRoot}\`  
**Gerado por:** \`npm run delphi:sync-tree\`

## Totais

| Extensão | Arquivos |
|----------|----------|
${Object.entries(byExt)
  .sort()
  .map(([k, v]) => `| \`${k}\` | ${v} |`)
  .join('\n')}

| Categoria | Arquivos |
|-----------|----------|
${Object.entries(byCat)
  .sort((a, b) => b[1] - a[1])
  .map(([k, v]) => `| ${k} | ${v} |`)
  .join('\n')}

- **Linhas .pas (soma):** ${summary.pasLines.toLocaleString('pt-BR')} em ${summary.pasCount} units

## Projetos (\`.dpr\`)

${dpr.length ? dpr.map((n) => `- \`${n.relPath}\``).join('\n') : '_nenhum_'}

## Data modules (\`dm*\`) — candidatos a batch

${dm.length ? dm.map((p) => `- \`${p}\``).join('\n') : '_nenhum_'}

## Maiores \`.pas\` (priorizar fatiamento)

| Linhas | Arquivo |
|--------|---------|
${topPas.map((n) => `| ${n.lines} | \`${n.relPath}\` |`).join('\n')}

## Árvore completa

[[Orius/desenvolvimento/legado-delphi/produtos/${profile.product_slug}/inventario/arvore-fontes]]

## JSON (batch / scripts)

[[Orius/desenvolvimento/legado-delphi/produtos/${profile.product_slug}/inventario/inventario-fontes.json]]

Voltar: [[Orius/desenvolvimento/legado-delphi/produtos/${profile.product_slug}/${INDEX_NOTE[profile.product_slug] || `00-indice-${profile.product_slug}`}]]
`;
}

function generateArvoreMd(profile, treeLines, nodeCount) {
  return `---
tipo: documentacao
area: orius
produto: ${profile.product_slug}
tags: [orius, delphi7, arvore-fontes]
status: revisado
fonte: sync-delphi-tree-vault
atualizado: ${new Date().toISOString().slice(0, 10)}
---

# Árvore de fontes — ${profile.product_path}

\`${CODE_ROOT}/${profile.product_path}\` — ${nodeCount} arquivos (\`.pas\`, \`.dfm\`, \`.dpr\`)

Legenda inline: \`dm\` = data module · \`dpr\` = projeto · \`NL\` = linhas · \`vendor\` · \`dup\`

\`\`\`
${treeLines.join('\n')}
\`\`\`

Resumo: [[Orius/desenvolvimento/legado-delphi/produtos/${profile.product_slug}/inventario/00-resumo-inventario]]
`;
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeProductArtifacts(profile, nodes) {
  const hub = path.join(VAULT_ROOT, profile.vault_hub.replace(/\//g, path.sep));
  const invDir = path.join(hub, 'inventario');
  ensureDir(invDir);

  const summary = summarize(nodes);
  const treeLines = buildTreeLines(profile.product_path, nodes);

  const inventario = {
    product_slug: profile.product_slug,
    product_path: profile.product_path,
    code_root: CODE_ROOT,
    generated_at: new Date().toISOString(),
    delphi_version: 7,
    ide: 'Embarcadero RAD Studio',
    totals: summary.byExt,
    categories: summary.byCat,
    pas_line_count_sum: summary.pasLines,
    projects: summary.dpr.map((n) => n.relPath),
    datamodules: summary.dm,
  top_pas_by_lines: summary.topPas.map((n) => ({
      path: n.relPath,
      lines: n.lines,
      category: n.category,
    })),
    files: nodes.map((n) => ({
      path: n.relPath,
      ext: n.ext,
      category: n.category,
      lines: n.lines,
      vendor: n.vendor,
      duplicate: n.duplicate,
    })),
    suggested_batch_order: suggestBatchOrder(nodes, summary),
  };

  fs.writeFileSync(
    path.join(invDir, 'inventario-fontes.json'),
    JSON.stringify(inventario, null, 2),
    'utf8',
  );
  fs.writeFileSync(
    path.join(invDir, 'arvore-fontes.md'),
    generateArvoreMd(profile, treeLines, nodes.length),
    'utf8',
  );
  fs.writeFileSync(
    path.join(invDir, '00-resumo-inventario.md'),
    generateResumoMd(profile, nodes, summary),
    'utf8',
  );

  return { invDir, inventario, summary };
}

function suggestBatchOrder(nodes, summary) {
  const phases = [];

  const dpr = summary.dpr.map((n) => n.relPath);
  if (dpr.length) {
    phases.push({ phase: 'projects', files: dpr });
  }

  const dmPas = nodes
    .filter(
      (n) =>
        n.ext === '.pas' &&
        n.category === 'datamodule' &&
        !n.vendor &&
        !n.duplicate,
    )
    .sort((a, b) => (b.lines || 0) - (a.lines || 0))
    .map((n) => n.relPath);

  if (dmPas.length) {
    phases.push({ phase: 'datamodules', files: dmPas });
  }

  const wsPas = nodes
    .filter(
      (n) =>
        n.ext === '.pas' &&
        n.category === 'webservice' &&
        !n.vendor &&
        !n.duplicate,
    )
    .map((n) => n.relPath)
    .sort();

  if (wsPas.length) {
    phases.push({ phase: 'webservices', files: wsPas });
  }

  return phases;
}

function scaffoldBatchJson(profile, inventario) {
  const batchPath = profile.batch_file;
  if (fs.existsSync(batchPath)) {
    return { skipped: true, path: batchPath };
  }

  const flatOrder = inventario.suggested_batch_order.flatMap((p) => p.files);
  const filesState = {};
  for (const f of flatOrder) {
    filesState[f] = {
      index_status: 'pending',
      analyze_status: 'pending',
      symbols_total: 0,
      symbols_done: 0,
      manifest_vault: null,
      priority_symbols: [],
      vendor: false,
      duplicate: false,
    };
  }

  const batchId = `${profile.product_slug}-inventario-fase1`;
  const state = {
    product_slug: profile.product_slug,
    code_root: CODE_ROOT,
    product_path: profile.product_path,
    batch_state_file: `scripts/${path.basename(batchPath)}`,
    active_batch_id: null,
    batches: {
      [batchId]: {
        batch_id: batchId,
        product_slug: profile.product_slug,
        product_path: profile.product_path,
        vault_hub: profile.vault_hub,
        vault_inventario:
          `${profile.vault_hub}/inventario/inventario-fontes.json`,
        started_at: null,
        completed_at: null,
        execution_order: flatOrder.slice(0, 50),
        execution_order_note:
          'Primeiros 50 do inventário; expandir conforme inventario-fontes.json',
        current_file: null,
        status: 'pending',
        files: Object.fromEntries(
          Object.entries(filesState).filter(([k]) =>
            flatOrder.slice(0, 50).includes(k),
          ),
        ),
      },
    },
  };

  fs.writeFileSync(batchPath, JSON.stringify(state, null, 2), 'utf8');
  return { skipped: false, path: batchPath, batchId };
}

function updateProductIndex(profile) {
  const slug = profile.product_slug;
  const indexNames = {
    imoveis: '00-indice-imoveis.md',
    civil: '00-indice-civil.md',
    protesto: '00-indice-protesto.md',
    rtd: '00-indice-rtd.md',
    caixa: '00-indice-caixa.md',
  };
  const indexFile = path.join(
    VAULT_ROOT,
    profile.vault_hub.replace(/\//g, path.sep),
    indexNames[slug] || `00-indice-${slug}.md`,
  );

  if (!fs.existsSync(indexFile)) return;

  let content = fs.readFileSync(indexFile, 'utf8');
  const invSection = `## Inventário de fontes (árvore)

- [[Orius/desenvolvimento/legado-delphi/produtos/${slug}/inventario/00-resumo-inventario]]
- [[Orius/desenvolvimento/legado-delphi/produtos/${slug}/inventario/arvore-fontes]]
- JSON: \`inventario/inventario-fontes.json\` (batch / \`suggested_batch_order\`)
`;

  if (content.includes('## Inventário de fontes')) return;

  const marker = '## Estrutura vault';
  if (content.includes(marker)) {
    const idx = content.indexOf(marker);
    const end = content.indexOf('\n## ', idx + marker.length);
    const insertAt = end === -1 ? content.length : end;
    content =
      content.slice(0, insertAt) + '\n' + invSection + content.slice(insertAt);
    fs.writeFileSync(indexFile, content, 'utf8');
  }
}

function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    console.log(`Uso:
  node scripts/sync-delphi-tree-vault.cjs [--product-slug <slug>] [--scaffold-batch]

Slugs: ${Object.keys(DELPHI_PRODUCTS).join(', ')}
`);
    process.exit(0);
  }

  const slugs = args.products.length
    ? args.products
    : ['civil', 'imoveis', 'rtd', 'protesto'];

  for (const slug of slugs) {
    const profile = DELPHI_PRODUCTS[slug];
    if (!profile) {
      console.error(`Slug desconhecido: ${slug}`);
      process.exit(1);
    }

    console.error(`\n=== ${slug} (${profile.product_path}) ===`);
    const nodes = walkProduct(profile.product_path);
    const { summary, inventario } = writeProductArtifacts(profile, nodes);
    updateProductIndex(profile);

    console.error(
      `Arquivos: ${nodes.length} | .pas: ${summary.byExt['.pas'] || 0} | dm: ${summary.dm.length}`,
    );
    console.error(
      `Vault: ${profile.vault_hub}/inventario/{00-resumo-inventario,arvore-fontes}.md`,
    );

    if (args.scaffoldBatch) {
      const batch = scaffoldBatchJson(profile, inventario);
      if (batch.skipped) {
        console.error(`Batch existente: ${batch.path}`);
      } else {
        console.error(`Batch criado: ${batch.path} (${batch.batchId})`);
      }
    }
  }

  console.error('\nConcluído.');
}

main();
