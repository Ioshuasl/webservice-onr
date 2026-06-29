const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const parteArg = args.find((a) => a.startsWith('--parte='));
const parteKey = parteArg ? parteArg.split('=')[1].toLowerCase() : 'especial';
const PARTE_NOME =
  parteKey === 'geral' ? 'PARTE GERAL' : parteKey === 'especial' ? 'PARTE ESPECIAL' : parteArg.split('=')[1].toUpperCase();
const LIVRO_ID = args.find((a) => !a.startsWith('--')) || 'V';
const OUT = path.join(__dirname, '..', 'codigo-normas', `_${LIVRO_ID.toLowerCase()}_extract_full.json`);

const j = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'codigo-normas', 'codigo_normas.json'), 'utf8'));
const parte = j.partes.find((p) => p.nome === PARTE_NOME);
if (!parte) {
  console.error('Parte não encontrada:', PARTE_NOME);
  process.exit(1);
}
const livro = parte.livros.find((l) => l.id === LIVRO_ID);
if (!livro) {
  console.error('Livro não encontrado:', LIVRO_ID);
  process.exit(1);
}

const items = [];
const dupKeys = [];
const incompletosChaves = [];
const seen = new Map();

function normPar(id) {
  if (!id) return null;
  const s = id.replace(/\.$/, '').trim();
  if (/único|unico/i.test(s)) return '§único';
  const m = s.match(/§\s*(\d+)/);
  if (m) return `§${m[1]}º`;
  return s;
}

function parSlug(p) {
  if (!p) return null;
  if (p === '§único') return 'paragrafo-unico';
  const m = p.match(/§(\d+)/);
  return m ? `paragrafo-${m[1]}` : `paragrafo-${p.replace(/\s+/g, '-').toLowerCase()}`;
}

function incSlug(i) {
  if (!i) return null;
  return `inciso-${String(i).toLowerCase().replace(/\.$/, '')}`;
}

function buildBase(titulo, capitulo, artigo) {
  const cap = capitulo ? capitulo.id : '_';
  return `${LIVRO_ID}/${titulo.id}/${cap}/art-${artigo}`;
}

function isIncompleto(texto) {
  const t = (texto || '').trim();
  if (!t) return true;
  if (t.startsWith('.')) return true;
  if (/[,:;]$/.test(t) && t.length < 120) return true;
  if (/\b(e|ou|nos?|nas?|aos?|às?|do|da|de|em|com|que|para)$/i.test(t)) return true;
  if (t.length < 15 && !/[.!?]$/.test(t)) return true;
  return false;
}

function addItem(base, suffix, meta, texto) {
  let chave = suffix ? `${base}/${suffix}` : base;
  const dupKey = `${meta.artigo}|${meta.paragrafo || ''}|${meta.inciso || ''}|${(texto || '').slice(0, 40)}`;
  const n = seen.get(chave) || 0;
  if (n > 0) {
    chave = `${base}-dup${n + 1}${suffix ? '/' + suffix.split('/').pop() : ''}`;
    if (!suffix && n === 1) dupKeys.push(`${base}`);
    dupKeys.push(chave);
  }
  seen.set(base, n + 1);

  const item = {
    chave,
    metadados_origem: {
      livro: LIVRO_ID,
      livro_nome: livro.nome,
      titulo: { id: meta.tituloId, nome: meta.tituloNome },
      capitulo: meta.capituloId ? { id: meta.capituloId, nome: meta.capituloNome } : null,
      artigo: meta.artigo,
      paragrafo: meta.paragrafo,
      inciso: meta.inciso,
    },
    texto_normativo_exato: (texto || '').trim(),
  };
  items.push(item);
  if (isIncompleto(item.texto_normativo_exato)) incompletosChaves.push(chave);
}

function walkArt(art, titulo, capitulo) {
  const metaBase = {
    tituloId: titulo.id,
    tituloNome: titulo.nome,
    capituloId: capitulo?.id || null,
    capituloNome: capitulo?.nome || null,
    artigo: art.numero,
  };
  const base = buildBase(titulo, capitulo, art.numero);
  const hasIncisos = (art.incisos || []).length > 0;
  const caput = (art.texto || '').trim();

  if (caput || !hasIncisos) {
    addItem(base, null, { ...metaBase, paragrafo: null, inciso: null }, caput || art.texto);
  }

  for (const inc of art.incisos || []) {
    addItem(base, incSlug(inc.id), { ...metaBase, paragrafo: null, inciso: inc.id }, inc.texto);
  }

  for (const par of art.paragrafos || []) {
    const pNorm = normPar(par.id);
    const pMeta = { ...metaBase, paragrafo: pNorm, inciso: null };
    addItem(base, parSlug(pNorm), pMeta, par.texto);
    for (const inc of par.incisos || []) {
      addItem(
        base,
        `${parSlug(pNorm)}/${incSlug(inc.id)}`,
        { ...metaBase, paragrafo: pNorm, inciso: inc.id },
        inc.texto
      );
    }
  }
}

for (const titulo of livro.titulos || []) {
  for (const art of titulo.artigos || []) walkArt(art, titulo, null);
  for (const cap of titulo.capitulos || []) {
    for (const art of cap.artigos || []) walkArt(art, titulo, cap);
  }
}

const out = {
  parte: PARTE_NOME,
  livro: LIVRO_ID,
  livro_nome: livro.nome,
  total: items.length,
  lotes: Math.ceil(items.length / 15),
  dupKeys: [...new Set(dupKeys)],
  incompletos: incompletosChaves.length,
  incompletosChaves,
  items,
};

fs.writeFileSync(OUT, JSON.stringify(out, null, 2), 'utf8');
console.log(JSON.stringify({ livro: LIVRO_ID, total: out.total, lotes: out.lotes, dupKeys: out.dupKeys.length, incompletos: out.incompletos, out: OUT }, null, 2));
