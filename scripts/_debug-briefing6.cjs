const fs = require('fs');
const path = require('path');

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const base =
  'C:/Users/kenio/Obsidian Vault/Orius/desenvolvimento/legado-delphi/produtos/imoveis/formularios/Pedido/';

for (const f of ['gridIntimacoesCustomDrawCell.md', 'VerificarSelonaCorregedoria2Click.md']) {
  const buf = fs.readFileSync(path.join(base, f));
  const content = buf.toString('utf8');
  const key = '## Briefing implementação / correção';
  console.log('===', f, 'total len', content.length, 'ends with newline', /\n$/.test(content));
  console.log('last 30 bytes hex', buf.slice(-30).toString('hex'));

  // manual simulation
  const idx = content.indexOf(key);
  const headingEnd = content.indexOf('\n', idx);
  let pos = headingEnd + 1;
  if (content[pos] === '\n') pos++;
  let body = '';
  let ok = false;
  while (pos <= content.length) {
    const atEnd = pos === content.length;
    const nextIsHash = content.slice(pos).match(/^## /m);
    const nextIsZ = content[pos] === 'Z';
    if (atEnd || nextIsHash || nextIsZ) {
      ok = true;
      break;
    }
    body += content[pos];
    pos++;
  }
  console.log('manual sim ok', ok, 'body len', body.trim().length);

  const re = new RegExp(
    `^${escapeRe(key)}\\s*$([\\s\\S]*?)(?=^## |\\Z)`,
    'im',
  );
  const all = [...content.matchAll(new RegExp(re.source, re.flags + 'g'))];
  console.log('matchAll count', all.length);
}
