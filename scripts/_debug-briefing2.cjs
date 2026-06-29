const fs = require('fs');
const path = require('path');

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function sectionContent(content, heading) {
  const re = new RegExp(
    `^${escapeRe(heading)}\\s*$([\\s\\S]*?)(?=^## |\\Z)`,
    'im',
  );
  const m = content.match(re);
  return m ? m[1].trim() : '';
}

const base =
  'C:/Users/kenio/Obsidian Vault/Orius/desenvolvimento/legado-delphi/produtos/imoveis/formularios/Pedido/';

for (const f of [
  'gridIntimacoesCustomDrawCell.md',
  'VerificarSelonaCorregedoria2Click.md',
]) {
  const content = fs.readFileSync(path.join(base, f), 'utf8');
  for (const key of [
    '## Briefing implementação',
    '## Briefing implementação / correção',
  ]) {
    const body = sectionContent(content, key);
    console.log(f, JSON.stringify(key), 'body len:', body.length);
  }
}

// test fix with $ instead of \Z
const content = fs.readFileSync(path.join(base, 'gridIntimacoesCustomDrawCell.md'), 'utf8');
const key = '## Briefing implementação';
const reFix = new RegExp(
  `^${escapeRe(key)}\\s*$([\\s\\S]*?)(?=^## |$)`,
  'im',
);
console.log('fix match', !!content.match(reFix));
