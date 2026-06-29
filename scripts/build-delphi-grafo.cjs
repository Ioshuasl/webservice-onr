#!/usr/bin/env node
/**
 * Agrega Chama / Chamado por das notas vault → grafo JSON + índice markdown.
 *
 * Uso:
 *   node scripts/build-delphi-grafo.cjs --product-slug imoveis
 *   node scripts/build-delphi-grafo.cjs --product-slug imoveis --sync-vault
 */
const fs = require('fs');
const path = require('path');
const { VAULT_ROOT, DELPHI_PRODUCTS } = require('./delphi-batch-paths.cjs');
const { parseFrontmatter } = require('./delphi-validate-lib.cjs');

function parseArgs(argv) {
  const args = { syncVault: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--product-slug') args.productSlug = argv[++i];
    else if (a === '--sync-vault') args.syncVault = true;
    else if (a === '--help' || a === '-h') args.help = true;
  }
  return args;
}

function usage() {
  console.log(`Uso:
  node scripts/build-delphi-grafo.cjs --product-slug <slug> [--sync-vault]
`);
}

function sectionContent(content, heading) {
  const re = new RegExp(
    `^${heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$([\\s\\S]*?)(?=^## |\\Z)`,
    'im',
  );
  const m = content.match(re);
  return m ? m[1].trim() : '';
}

function extractRefs(text) {
  const refs = new Set();
  const wiki = /\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g;
  let m;
  while ((m = wiki.exec(text))) {
    const link = m[1].trim();
    const base = path.basename(link, '.md');
    if (base && !base.startsWith('_')) refs.add(base);
  }
  const backtick = /`([A-Za-z_][\w]*)`/g;
  while ((m = backtick.exec(text))) {
    const name = m[1];
    if (!/^(T[A-Z]|string|Integer|Boolean|procedure|function)$/i.test(name)) {
      refs.add(name);
    }
  }
  const dotted = /\b([A-Za-z_]\w*)\.([A-Za-z_]\w*)\b/g;
  while ((m = dotted.exec(text))) {
    refs.add(m[2]);
  }
  return [...refs];
}

function walkSymbolNotes(unidadesDir) {
  const notes = [];
  if (!fs.existsSync(unidadesDir)) return notes;

  for (const ent of fs.readdirSync(unidadesDir, { withFileTypes: true })) {
    if (ent.isFile() && ent.name.endsWith('.md')) {
      continue;
    }
    if (!ent.isDirectory()) continue;

    const unitName = ent.name;
    const unitDir = path.join(unidadesDir, unitName);

    for (const file of fs.readdirSync(unitDir, { withFileTypes: true })) {
      if (!file.isFile() || !file.name.endsWith('.md')) continue;
      if (file.name === '_segmentos.md') continue;

      notes.push({
        unit: unitName,
        symbol: file.name.replace(/\.md$/, ''),
        path: path.join(unitDir, file.name),
      });
    }
  }

  return notes;
}

function buildGraph(productSlug, vaultHub) {
  const hub = path.join(VAULT_ROOT, vaultHub.replace(/\//g, path.sep));
  const unidadesDir = path.join(hub, 'unidades');
  const notes = walkSymbolNotes(unidadesDir);

  const nodes = {};
  const edges = [];
  const edgeKeys = new Set();

  for (const note of notes) {
    const content = fs.readFileSync(note.path, 'utf8');
    const { fields } = parseFrontmatter(content);
    const nodeId = `${note.unit}.${note.symbol}`;
    const vaultRel = `${vaultHub}/unidades/${note.unit}/${note.symbol}.md`;
    const actualVault = fields.unit && fields.simbolo
      ? `${vaultHub}/unidades/${fields.unit}/${fields.simbolo}.md`
      : vaultRel;

    nodes[nodeId] = {
      id: nodeId,
      unit: fields.unit || note.unit,
      symbol: fields.simbolo || note.symbol,
      vault_path: actualVault,
      linhas: fields.linhas || null,
      status: fields.status || null,
    };

    const chama = sectionContent(content, '## Chama');
    const chamadoPor = sectionContent(content, '## Chamado por');

    for (const target of extractRefs(chama)) {
      const toId = resolveTargetId(target, note.unit, nodes);
      if (!toId || toId === nodeId) continue;
      const key = `${nodeId}->${toId}:chama`;
      if (edgeKeys.has(key)) continue;
      edgeKeys.add(key);
      edges.push({ from: nodeId, to: toId, kind: 'chama', source: nodeId });
    }

    for (const source of extractRefs(chamadoPor)) {
      const fromId = resolveTargetId(source, note.unit, nodes);
      if (!fromId || fromId === nodeId) continue;
      const key = `${fromId}->${nodeId}:chamado_por`;
      if (edgeKeys.has(key)) continue;
      edgeKeys.add(key);
      edges.push({ from: fromId, to: nodeId, kind: 'chamado_por', source: nodeId });
    }
  }

  return {
    product_slug: productSlug,
    generated_at: new Date().toISOString(),
    nodes_count: Object.keys(nodes).length,
    edges_count: edges.length,
    nodes,
    edges,
  };
}

function resolveTargetId(name, defaultUnit, nodes) {
  const direct = `${defaultUnit}.${name}`;
  if (nodes[direct]) return direct;
  for (const id of Object.keys(nodes)) {
    if (id.endsWith(`.${name}`)) return id;
  }
  return `${defaultUnit}.${name}`;
}

function formatGrafoMarkdown(graph, vaultHub) {
  const date = graph.generated_at.slice(0, 10);
  const topEdges = graph.edges.slice(0, 40);
  const rows = topEdges.map(
    (e) => `| ${e.from} | ${e.kind} | ${e.to} |`,
  );

  return `---
tipo: documentacao
area: orius
produto: ${graph.product_slug}
tags: [orius, delphi7, legado, grafo, chamadas]
status: revisado
fonte: build-delphi-grafo
atualizado: ${date}
---

# Grafo de chamadas — ${graph.product_slug}

Gerado por \`npm run delphi:build-grafo -- --product-slug ${graph.product_slug} --sync-vault\`

| Métrica | Valor |
|---------|-------|
| Nós (notas) | ${graph.nodes_count} |
| Arestas | ${graph.edges_count} |
| JSON | [[${vaultHub}/grafo/chamadas.json]] |

## Amostra de arestas

| De | Relação | Para |
|----|---------|------|
${rows.length ? rows.join('\n') : '| — | — | — |'}

## Uso (debug)

Consultar com \`@agent-delphi-debug\` — não reler \`.pas\` inteiro; seguir links vault + este grafo.
`;
}

function main() {
  const args = parseArgs(process.argv);
  if (args.help || !args.productSlug) {
    usage();
    process.exit(args.help ? 0 : 1);
  }

  const profile = DELPHI_PRODUCTS[args.productSlug];
  if (!profile) {
    console.error(`Slug desconhecido: ${args.productSlug}`);
    process.exit(1);
  }

  const graph = buildGraph(args.productSlug, profile.vault_hub);

  if (args.syncVault) {
    const grafoDir = path.join(
      VAULT_ROOT,
      profile.vault_hub.replace(/\//g, path.sep),
      'grafo',
    );
    fs.mkdirSync(grafoDir, { recursive: true });
    const jsonPath = path.join(grafoDir, 'chamadas.json');
    const mdPath = path.join(grafoDir, '00-chamadas.md');
    fs.writeFileSync(jsonPath, JSON.stringify(graph, null, 2), 'utf8');
    fs.writeFileSync(mdPath, formatGrafoMarkdown(graph, profile.vault_hub), 'utf8');
    console.error(`Vault: ${jsonPath}`);
    console.error(`Vault: ${mdPath}`);
    console.error(`Nós: ${graph.nodes_count} | Arestas: ${graph.edges_count}`);
  } else {
    console.log(JSON.stringify(graph, null, 2));
  }
}

main();
