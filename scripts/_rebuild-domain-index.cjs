const fs = require('fs');
const path = require('path');

const livro = process.argv[2] || 'v';
const L = livro.toUpperCase();
const SRC = path.join(__dirname, '..', 'codigo-normas', `_${livro.toLowerCase()}_extract_full.json`);
const domain = { II: 'responsaveis', III: 'servicos-extrajudiciais', IV: 'protesto', V: 'notas', VI: 'rcpj', VII: 'rtd', VIII: 'rcpn', IX: 'imoveis' }[L] || livro.toLowerCase();
const VAULT = path.join('C:', 'Users', 'kenio', 'Obsidian Vault', 'Orius', 'desenvolvimento', 'regras-de-negocio', domain, 'regras');
const OUT = path.join('C:', 'Users', 'kenio', 'Obsidian Vault', 'Orius', 'desenvolvimento', 'regras-de-negocio', domain, `00-indice-${domain}.md`);

const j = JSON.parse(fs.readFileSync(SRC, 'utf8'));
const files = fs.readdirSync(VAULT).filter((f) => f.endsWith('.md'));

function parseFm(text) {
  const fm = {};
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return fm;
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([\w_]+):\s*(.*)$/);
    if (kv) fm[kv[1]] = kv[2].replace(/^["']|["']$/g, '').trim();
  }
  return fm;
}

function normPar(p) {
  if (!p) return '';
  return String(p).replace(/^§\s*/, '').replace(/º$/, 'º').trim();
}

function normInc(i) {
  if (!i) return '';
  return String(i).replace(/^inc\.?\s*/i, '').trim();
}

function metaKey(m) {
  const t = m.titulo?.id || m.titulo || '';
  const c = m.capitulo?.id || '';
  return [t, c, m.artigo, normPar(m.paragrafo), normInc(m.inciso)].join('|');
}

const filePool = files.map((f) => {
  const text = fs.readFileSync(path.join(VAULT, f), 'utf8');
  const fm = parseFm(text);
  const chave = fm.chave_origem || '';
  return {
    slug: f.replace(/\.md$/, ''),
    art: fm.artigo,
    par: normPar(fm.paragrafo),
    inc: normInc(fm.inciso),
    titulo: fm.titulo,
    capitulo: fm.capitulo,
    chave,
    key: [fm.titulo, fm.capitulo || '', fm.artigo, normPar(fm.paragrafo), normInc(fm.inciso)].join('|'),
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

  let candidates = filePool.filter((f) => !used.has(f.slug) && f.chave === ch);
  if (candidates.length === 0) candidates = filePool.filter((f) => !used.has(f.slug) && f.key === key);
  if (candidates.length === 0) {
    candidates = filePool.filter(
      (f) => !used.has(f.slug) && f.art === m.artigo && f.par === normPar(m.paragrafo) && f.inc === normInc(m.inciso)
    );
  }
  if (candidates.length === 0 && isDup) {
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
    if (isDup !== (dupA || dupB)) return isDup ? dupB - dupA : dupA - dupB;
    return a.slug.localeCompare(b.slug);
  });
  const pick = candidates[0];
  used.add(pick.slug);
  itemToSlug.push({ i, ch, slug: pick.slug });
}

const missing = itemToSlug.filter((x) => !x.slug);
if (missing.length) {
  console.error('Unmatched:', missing.length);
  missing.forEach((x) => console.error(x.i, x.ch));
  process.exit(1);
}

const labels = {
  II: ['II (Responsaveis pela serventia)', '32-83', '_ii_extract_full.json'],
  III: ['III (Servicos extrajudiciais)', '84-212', '_iii_extract_full.json'],
  IV: ['IV (Tabelionato de Protesto de Titulos)', '213-334', '_iv_extract_full.json'],
  V: ['V (Tabelionato de Notas)', '335-354', '_v_extract_full.json'],
  VI: ['VI (Registro Civil de Pessoas Juridicas)', '483-516', '_vi_extract_full.json'],
  VII: ['VII (Registro de Titulos e Documentos)', '517-566', '_vii_extract_full.json'],
  IX: ['IX (Registro de Imoveis)', '789-837', '_ix_extract_full.json'],
};
const [label, arts, extract] = labels[L] || [`${L}`, '', `_${livro}_extract_full.json`];
const lastCount = j.items.length - (j.lotes - 1) * 15;

let md = `# Regras de negocio - ${domain.charAt(0).toUpperCase() + domain.slice(1)}

Livro de referencia: ${label}

Extracao fonte: \`codigo-normas/${extract}\` (${j.total} itens, ${j.lotes} lotes de 15; ultimo lote com ${lastCount} itens)

## Regras (atomicas)

`;

for (let lot = 1; lot <= j.lotes; lot++) {
  const start = (lot - 1) * 15;
  const end = Math.min(start + 14, j.items.length - 1);
  const artsLot = j.items.slice(start, end + 1).map((it) => it.metadados_origem.artigo);
  const range = artsLot[0] === artsLot[artsLot.length - 1] ? `art. ${artsLot[0]}` : `arts. ${artsLot[0]}-${artsLot[artsLot.length - 1]}`;
  md += `### Lote ${lot} (itens ${start + 1}-${end + 1}) — ${range}\n\n`;
  for (let i = start; i <= end; i++) {
    md += `- [[Orius/desenvolvimento/regras-de-negocio/${domain}/regras/${itemToSlug[i].slug}]]\n`;
  }
  md += '\n';
}

md += `_Progresso: ${j.lotes}/${j.lotes} lotes gerados e indexados (${j.total} notas, arts. ${arts})_\n\n`;

if (domain === 'rcpj') {
  md += `## Guias para leigos

_(preencher com guias didaticos deste dominio)_

## Atalhos de busca

- livro vi
- rcpj
- pessoas juridicas
`;
} else if (domain === 'notas') {
  md += `## Guias para leigos

- [[Orius/desenvolvimento/regras-de-negocio/notas/guias-leigos/guia-matricula-registro-averbacao]]

## Atalhos de busca

- livro v
- tabelionato de notas
- escritura
`;
}

fs.writeFileSync(OUT, md, 'utf8');
console.log('Wrote', OUT);
