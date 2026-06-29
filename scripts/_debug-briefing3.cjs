const fs = require('fs');
const path = require('path');

const base =
  'C:/Users/kenio/Obsidian Vault/Orius/desenvolvimento/legado-delphi/produtos/imoveis/formularios/Pedido/';

for (const f of ['gridIntimacoesCustomDrawCell.md', 'VerificarSelonaCorregedoria2Click.md']) {
  const content = fs.readFileSync(path.join(base, f), 'utf8');
  const line = content.split(/\r?\n/).find((l) => l.includes('Briefing'));
  console.log('===', f);
  console.log('line:', JSON.stringify(line));
  console.log('hex:', Buffer.from(line, 'utf8').toString('hex'));
  const idx = content.indexOf('## Briefing');
  console.log('context hex around idx:', Buffer.from(content.slice(idx, idx + 60), 'utf8').toString('hex'));
}
