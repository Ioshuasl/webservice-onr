const fs = require('fs');
const path = require('path');

const base =
  'C:/Users/kenio/Obsidian Vault/Orius/desenvolvimento/legado-delphi/produtos/imoveis/formularios/Pedido/';

for (const f of ['gridIntimacoesCustomDrawCell.md', 'VerificarSelonaCorregedoria2Click.md']) {
  const content = fs.readFileSync(path.join(base, f), 'utf8');
  const key = '## Briefing implementação / correção';
  const idx = content.indexOf(key);
  console.log('===', f);
  console.log('bytes before heading:', Buffer.from(content.slice(Math.max(0, idx - 20), idx), 'utf8').toString('hex'));
  console.log('char before # is newline?', content[idx - 1] === '\n' || content[idx - 1] === '\r');
  // test if ^ matches at idx
  const reLineStart = new RegExp(`^${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'm');
  console.log('^heading matches somewhere', reLineStart.test(content));
  const lines = content.split(/\r?\n/);
  const lineNo = lines.findIndex((l) => l.includes('Briefing'));
  console.log('line number', lineNo + 1, 'line starts with ##', lines[lineNo].startsWith('##'));
  console.log('line repr', JSON.stringify(lines[lineNo].slice(0, 5)));
}
