const fs = require('fs');
const c = fs.readFileSync(
  'C:/Users/kenio/Obsidian Vault/Orius/desenvolvimento/legado-delphi/produtos/imoveis/formularios/Pedido/RetornarNomePessoa.md',
  'utf8',
);
const i = c.indexOf('## Briefing implementação / correção');
const b = c.slice(i);
for (let j = 0; j < b.length; j++) {
  if (/z/i.test(b[j])) console.log(j, JSON.stringify(b.slice(j - 10, j + 15)), b.charCodeAt(j));
}
