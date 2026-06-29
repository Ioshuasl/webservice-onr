const fs = require('fs');
const path = require('path');

const base =
  'C:/Users/kenio/Obsidian Vault/Orius/desenvolvimento/legado-delphi/produtos/imoveis/formularios/Pedido/';
const content = fs.readFileSync(path.join(base, 'gridIntimacoesCustomDrawCell.md'), 'utf8');
const key = '## Briefing implementação / correção';
const idx = content.indexOf(key);
const before = content.slice(0, idx);

let pos = 0;
const hits = [];
while ((pos = before.indexOf('Z', pos)) !== -1) {
  hits.push({ pos, ctx: before.slice(Math.max(0, pos - 15), pos + 15) });
  pos++;
}
console.log('Z count before briefing', hits.length);
hits.slice(0, 10).forEach((h) => console.log(h.pos, JSON.stringify(h.ctx)));

// try regex on substring from briefing only
const sub = content.slice(idx);
const re = /^## Briefing implementação \/ correção\s*$([\s\S]*?)(?=^## |\Z)/im;
console.log('substring only match', !!sub.match(re));
