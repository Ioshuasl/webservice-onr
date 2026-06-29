const fs = require('fs');
const path = require('path');

const base =
  'C:/Users/kenio/Obsidian Vault/Orius/desenvolvimento/legado-delphi/produtos/imoveis/formularios/Pedido/';

for (const f of ['gridIntimacoesCustomDrawCell.md', 'VerificarSelonaCorregedoria2Click.md']) {
  const content = fs.readFileSync(path.join(base, f), 'utf8');
  const lines = content.split(/\r?\n/);
  const line = lines.find((l) => l.includes('Briefing'));
  console.log('===', f);
  console.log('line len', line.length);
  console.log('line hex', Buffer.from(line, 'utf8').toString('hex'));
  console.log('ends with space', /\s$/.test(line));
  const key = '## Briefing implementação / correção';
  const reFull = new RegExp(
    `^${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`,
    'm',
  );
  console.log('full line anchor match', reFull.test(line));
  console.log('full line anchor in content', reFull.test(content));
}
