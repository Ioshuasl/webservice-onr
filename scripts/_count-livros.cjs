const fs = require('fs');
const j = JSON.parse(fs.readFileSync('codigo-normas/codigo_normas.json', 'utf8'));
const parte = j.partes.find((p) => p.nome === 'PARTE ESPECIAL');
const counts = {};

function walkArt(art, path) {
  const base = [...path, `art-${art.numero}`];
  counts[path[0]] = (counts[path[0]] || 0) + 1;
  for (const p of art.paragrafos || []) {
    const pp = [...base, p.id.replace(/\s+/g, '-').toLowerCase()];
    counts[path[0]]++;
    for (const inc of p.incisos || []) {
      counts[path[0]]++;
      for (const al of inc.alineas || []) counts[path[0]]++;
    }
  }
  for (const inc of art.incisos || []) {
    counts[path[0]]++;
    for (const al of inc.alineas || []) counts[path[0]]++;
  }
}

for (const livro of parte.livros) {
  counts[livro.id] = 0;
  for (const tit of livro.titulos || []) {
    for (const art of tit.artigos || []) walkArt(art, [livro.id]);
    for (const cap of tit.capitulos || []) {
      for (const art of cap.artigos || []) walkArt(art, [livro.id]);
    }
  }
}

for (const livro of parte.livros) {
  const lotes = Math.ceil(counts[livro.id] / 15);
  console.log(`${livro.id} | ${livro.nome} | ~${counts[livro.id]} itens | ~${lotes} lotes`);
}
