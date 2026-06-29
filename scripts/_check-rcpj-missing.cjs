const fs = require('fs');
const path = require('path');
const j = JSON.parse(fs.readFileSync('codigo-normas/_vi_extract_full.json', 'utf8'));
const dir = 'C:/Users/kenio/Obsidian Vault/Orius/desenvolvimento/regras-de-negocio/rcpj/regras';
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'));
const byChave = new Map();
for (const f of files) {
  const t = fs.readFileSync(path.join(dir, f), 'utf8');
  const m = t.match(/^chave_origem:\s*"?([^"\n]+)"?/m);
  if (m) byChave.set(m[1].trim(), f);
}
const missing = [];
for (let i = 0; i < j.items.length; i++) {
  if (!byChave.has(j.items[i].chave)) missing.push({ i, ch: j.items[i].chave });
}
console.log('files', files.length, 'missing', missing.length);
missing.forEach((x) => console.log(x.i, x.ch));
