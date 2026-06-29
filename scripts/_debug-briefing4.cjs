const fs = require('fs');
const path = require('path');

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const base =
  'C:/Users/kenio/Obsidian Vault/Orius/desenvolvimento/legado-delphi/produtos/imoveis/formularios/Pedido/';

for (const f of ['gridIntimacoesCustomDrawCell.md', 'VerificarSelonaCorregedoria2Click.md']) {
  const content = fs.readFileSync(path.join(base, f), 'utf8');
  const key = '## Briefing implementação / correção';
  const idx = content.indexOf(key);
  const after = content.slice(idx + key.length);
  console.log('===', f, 'idx', idx);
  // find first Z after heading
  const zRel = after.search(/Z/);
  console.log('first Z after heading at', zRel, zRel >= 0 ? JSON.stringify(after.slice(zRel - 5, zRel + 10)) : 'none');
  const hashRel = after.search(/^## /m);
  console.log('first ## after heading at', hashRel);

  const re = new RegExp(
    `^${escapeRe(key)}\\s*$([\\s\\S]*?)(?=^## |\\Z)`,
    'im',
  );
  const m = content.match(re);
  console.log('match', !!m, 'body len', m ? m[1].length : -1);
  if (m) console.log('body end:', JSON.stringify(m[1].slice(-40)));
}
