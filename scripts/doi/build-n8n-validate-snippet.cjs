/**
 * Gera snippets n8n a partir de doi-validate-payload.cjs
 * Uso: node scripts/doi/build-n8n-validate-snippet.cjs
 */
'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '../..');
const source = fs.readFileSync(path.join(root, 'scripts/doi/doi-validate-payload.cjs'), 'utf8');

const core = source
  .replace(/^[\s\S]*?'use strict';\s*/, '')
  .replace(/\nmodule\.exports[\s\S]*$/, '')
  .trim();

function writeSnippet(filename, wrapper) {
  const snippet = `${core}\n\n${wrapper}\n`;
  const out = path.join(root, 'scripts/doi', filename);
  fs.writeFileSync(out, snippet, 'utf8');
  console.log('Wrote', out, snippet.length, 'chars');
}

writeSnippet('doi-validate-n8n-snippet.js', `const item = items[0].json;
const payload = item.payload ?? {};
const result = validateDoiPayload(payload, { scopeField: 'sistema', scopeLabel: 'DOI' });
item.validation.errors.push(...result.errors);
item.validation.warnings.push(...result.warnings);
item.validation.hasErrors = item.validation.errors.length > 0;
item.validation.declarationCount = result.declarationCount;
return items;`);

writeSnippet('censec-ctp-validate-n8n-snippet.js', `const item = items[0].json;
const payload = item.payload ?? {};

if (payload.declaracoes === undefined) {
  item.validation.hasErrors = item.validation.errors.length > 0;
  return items;
}

const result = validateDoiPayload(payload, { scopeField: 'central', scopeLabel: 'CTP' });
item.validation.errors.push(...result.errors);
item.validation.warnings.push(...result.warnings);
item.validation.hasErrors = item.validation.errors.length > 0;
return items;`);
