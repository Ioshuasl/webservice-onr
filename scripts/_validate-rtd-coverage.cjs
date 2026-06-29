const fs = require('fs');
const path = require('path');

const jsonPath = process.argv[2] || 'codigo-normas/_vii_extract_full.json';
const dir =
  process.argv[3] ||
  'C:/Users/kenio/Obsidian Vault/Orius/desenvolvimento/regras-de-negocio/rtd/regras';
const from = Number(process.argv[4] || 0);
const to = Number(process.argv[5] || 59);

const j = require(path.resolve(jsonPath));
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'));
const counts = {};
for (const f of files) {
  const t = fs.readFileSync(path.join(dir, f), 'utf8');
  const m = t.match(/^chave_origem:\s*["']?([^"'\n]+)["']?\s*$/m);
  if (m) {
    const k = m[1].trim();
    counts[k] = (counts[k] || 0) + 1;
  }
}

const slice = j.items.slice(from, to + 1);
const missing = [];
const dup = [];
for (const it of slice) {
  const c = counts[it.chave] || 0;
  if (c === 0) missing.push(it.chave);
  else if (c > 1) dup.push(`${it.chave} x${c}`);
}

console.log('files', files.length);
console.log(`items[${from}-${to}] covered`, `${slice.length - missing.length}/${slice.length}`);
if (missing.length) {
  console.log('MISSING:');
  missing.forEach((k) => console.log(' ', k));
}
if (dup.length) console.log('EXTRA dup:', dup.join(', '));
