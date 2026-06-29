const fs = require('fs');
const path = require('path');

const base =
  'C:/Users/kenio/Obsidian Vault/Orius/desenvolvimento/legado-delphi/produtos/imoveis/formularios/Pedido/';
const content = fs.readFileSync(path.join(base, 'gridIntimacoesCustomDrawCell.md'), 'utf8');
const key = '## Briefing implementação / correção';
const idx = content.indexOf(key);
const sub = content.slice(idx);

for (const tail of ['\\Z', '$', '\\z']) {
  const re = new RegExp(
    `^## Briefing implementação / correção\\s*$([\\s\\S]*?)(?=^## |${tail})`,
    'im',
  );
  const m = sub.match(re);
  console.log('tail', tail, 'match', !!m, 'len', m ? m[1].trim().length : -1);
}

// greedy
const reG = /^## Briefing implementação \/ correção\s*$([\s\S]*)$/im;
console.log('greedy', !!sub.match(reG), sub.match(reG)?.[1]?.trim().length);
