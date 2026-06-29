const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'codigo-normas', '_ix_extract_full.json');
const VAULT = path.join('C:', 'Users', 'kenio', 'Obsidian Vault', 'Orius', 'desenvolvimento', 'regras-de-negocio', 'imoveis', 'regras');
const OUT = path.join('C:', 'Users', 'kenio', 'Obsidian Vault', 'Orius', 'desenvolvimento', 'regras-de-negocio', 'imoveis', '00-indice-imoveis.md');

const j = JSON.parse(fs.readFileSync(SRC, 'utf8'));
const files = fs.readdirSync(VAULT).filter((f) => f.endsWith('.md'));

function parseFm(text) {
  const fm = {};
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return fm;
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) fm[kv[1]] = kv[2].replace(/^"|"$/g, '').trim();
  }
  return fm;
}

function normPar(p) {
  if (!p) return '';
  return p.replace(/^§\s*/, '').replace(/º$/, 'º').trim();
}

function normInc(i) {
  if (!i) return '';
  return i.replace(/^inc\.?\s*/i, '').trim();
}

function metaKey(m) {
  const t = m.titulo?.id || m.titulo || '';
  return [t, m.artigo, normPar(m.paragrafo), normInc(m.inciso)].join('|');
}

const filePool = files.map((f) => {
  const text = fs.readFileSync(path.join(VAULT, f), 'utf8');
  const fm = parseFm(text);
  return {
    slug: f.replace(/\.md$/, ''),
    art: fm.artigo,
    par: normPar(fm.paragrafo),
    inc: normInc(fm.inciso),
    titulo: fm.titulo,
    fonte: fm.fonte,
    criado: fm.criado,
    key: [fm.titulo, fm.artigo, normPar(fm.paragrafo), normInc(fm.inciso)].join('|'),
  };
});

const used = new Set();
const itemToSlug = [];

for (let i = 0; i < j.items.length; i++) {
  const item = j.items[i];
  const m = item.metadados_origem;
  const ch = item.chave;
  const isDup = ch.includes('-dup2') || ch.includes('-dup3');
  const key = metaKey(m);

  let candidates = filePool.filter((f) => !used.has(f.slug) && f.key === key);
  if (candidates.length === 0) {
    candidates = filePool.filter(
      (f) =>
        !used.has(f.slug) &&
        f.art === m.artigo &&
        f.par === normPar(m.paragrafo) &&
        f.inc === normInc(m.inciso)
    );
  }
  if (candidates.length === 0 && isDup) {
    const base = ch.replace(/-dup\d+$/, '').split('/').pop();
    candidates = filePool.filter((f) => !used.has(f.slug) && f.slug.includes('dup'));
  }
  if (candidates.length === 0) {
    const artTag = `art-${m.artigo}`;
    candidates = filePool.filter((f) => !used.has(f.slug) && f.slug.startsWith(artTag));
  }
  if (candidates.length === 0) {
    itemToSlug.push({ i, ch, slug: null });
    continue;
  }
  candidates.sort((a, b) => {
    const dupA = a.slug.includes('dup') ? 1 : 0;
    const dupB = b.slug.includes('dup') ? 1 : 0;
    if (isDup !== (dupA || dupB)) return isDup ? (dupB - dupA) : (dupA - dupB);
    return a.slug.localeCompare(b.slug);
  });
  const pick = candidates[0];
  used.add(pick.slug);
  itemToSlug.push({ i, ch, slug: pick.slug });
}

const missing = itemToSlug.filter((x) => !x.slug);
if (missing.length) {
  console.error('Unmatched items:', missing.length);
  missing.slice(0, 20).forEach((x) => console.error(x.i, x.ch));
  process.exit(1);
}

function artRange(start, end) {
  const arts = j.items.slice(start, end + 1).map((it) => it.metadados_origem.artigo);
  const min = arts[0];
  const max = arts[arts.length - 1];
  return min === max ? `art. ${min}` : `arts. ${min}-${max}`;
}

let md = `# Regras de negocio - Imoveis

Livro de referencia: IX (Registro de Imoveis)

Extracao fonte: \`codigo-normas/_ix_extract_full.json\` (${j.total} itens, ${j.lotes} lotes de 15; ultimo lote com 9 itens)

## Regras (atomicas)

`;

for (let lot = 1; lot <= j.lotes; lot++) {
  const start = (lot - 1) * 15;
  const end = Math.min(start + 14, j.items.length - 1);
  const count = end - start + 1;
  md += `### Lote ${lot} (itens ${start + 1}-${end + 1}) — ${artRange(start, end)}\n\n`;
  for (let i = start; i <= end; i++) {
    const slug = itemToSlug[i].slug;
    md += `- [[Orius/desenvolvimento/regras-de-negocio/imoveis/regras/${slug}]]\n`;
  }
  md += '\n';
}

md += `_Progresso: ${j.lotes}/${j.lotes} lotes gerados e indexados (${j.total} notas, arts. 789-837)_\n\n`;
md += `## Guias para leigos

- [[Orius/desenvolvimento/regras-de-negocio/imoveis/guias-leigos/guia-matricula-registro-averbacao]]
- [[Orius/desenvolvimento/regras-de-negocio/imoveis/guias-leigos/guia-onus-e-restricoes-matricula]]

## Atalhos de busca

- livro ix
- registro de imoveis
- matricula averbacoes registro
`;

fs.writeFileSync(OUT, md, 'utf8');
console.log('Wrote', OUT);
console.log('Matched', itemToSlug.length, 'items,', used.size, 'files used,', files.length, 'total files');
