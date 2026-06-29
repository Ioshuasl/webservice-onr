'use strict';
const fs = require('fs');
const path = 'C:\\Users\\kenio\\Downloads\\ITNs\\ITN-003\\Anexo_II_Layout_Padrao_de_Arquivo_JSON_Schema\\Imoveis_Urbanos_Schema.txt';
let raw = fs.readFileSync(path, 'utf8');
const jsonStart = raw.indexOf('{');
let text = raw.slice(jsonStart);
text = text.replace(/\f/g, '');
text = text.replace(/\r\n/g, '\n');
// PDF extract breaks multiline/broken "description" strings
function stripDescriptions(s) {
  let out = '';
  let i = 0;
  while (i < s.length) {
    const idx = s.indexOf('"description"', i);
    if (idx === -1) {
      out += s.slice(i);
      break;
    }
    out += s.slice(i, idx);
    let j = idx + '"description"'.length;
    while (j < s.length && /\s/.test(s[j])) j++;
    if (s[j] !== ':') {
      out += '"description"';
      i = idx + 13;
      continue;
    }
    j++;
    while (j < s.length && /\s/.test(s[j])) j++;
    if (s[j] === '"') {
      j++;
      while (j < s.length) {
        if (s[j] === '\\') {
          j += 2;
          continue;
        }
        if (s[j] === '"') {
          j++;
          break;
        }
        j++;
      }
    } else {
      while (j < s.length && s[j] !== ',' && s[j] !== '}') j++;
    }
    out += '"description": ""';
    while (j < s.length && /\s/.test(s[j])) j++;
    if (j < s.length && s[j] === '"') out += ',';
    i = j;
  }
  return out;
}
text = stripDescriptions(text);
// PDF sometimes drops opening quote of property after broken description
text = text.replace(/""(\s*)([a-zA-Z_][a-zA-Z0-9_]*)":/g, '"",$1"$2":');

function tryParse(s) {
  try {
    return { ok: true, schema: JSON.parse(s) };
  } catch (e) {
    return { ok: false, error: e };
  }
}

let result = tryParse(text);
if (!result.ok) {
  // Fix truncated string literals: pattern/value cut mid-line without closing quote
  const lines = text.split('\n');
  const fixed = [];
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    // line has opening quote but no closing quote before EOL (and not escaped end)
    const unclosed = /:\s*"[^"]*$/.test(line) && !/\\"$/.test(line);
    if (unclosed) {
      // peek ahead - if next line doesn't continue JSON string, close it
      const next = lines[i + 1] || '';
      if (!/^\s*[^",}\]]/.test(next) || /^\s*[,}\]]/.test(next)) {
        line = line + '"';
      }
    }
    fixed.push(line);
  }
  text = fixed.join('\n');
  result = tryParse(text);
}

if (!result.ok) {
  const pos = Number(result.error.message.match(/position (\d+)/)?.[1] || 0);
  console.error('Parse failed:', result.error.message);
  console.error('Context:', JSON.stringify(text.slice(Math.max(0, pos - 80), pos + 80)));
  process.exit(1);
}

const schema = result.schema;
fs.writeFileSync(
  'c:\\Users\\kenio\\automacoes e testes\\scripts\\_itn-urbanos-schema-parsed.json',
  JSON.stringify(schema, null, 2)
);
console.log('Parsed OK. Root keys:', Object.keys(schema.properties || {}));
console.log('Required root:', schema.required);
console.log('Version:', schema.properties?.version?.const);
console.log('CNS pattern:', schema.properties?.cns?.pattern);

const anyOf = schema.properties?.imoveis?.items?.allOf?.[0]?.anyOf || [];
console.log('Branches (anyOf):', anyOf.length);

function getConst(obj) {
  if (!obj) return undefined;
  if (obj.const !== undefined) return obj.const;
  if (obj.anyOf) {
    const vals = obj.anyOf.map(getConst).filter((v) => v !== undefined);
    if (vals.length) return vals.length === 1 ? vals[0] : vals;
  }
  return undefined;
}

function branchLabel(branch) {
  const p = branch.properties || {};
  return [
    `tipo_imovel=${JSON.stringify(getConst(p.tipo_imovel))}`,
    `contexto_urbano=${JSON.stringify(getConst(p.contexto_urbano))}`,
    `ato=${JSON.stringify(getConst(p.ato))}`,
    `tipo_matricula_transcricao=${JSON.stringify(getConst(p.tipo_matricula_transcricao))}`,
  ].join(' | ');
}

for (let i = 0; i < anyOf.length; i++) {
  const b = anyOf[i];
  console.log(`\n--- Branch ${i + 1}: ${branchLabel(b)}`);
  console.log('required:', b.required?.join(', '));
  console.log('top props:', Object.keys(b.properties || {}).join(', '));
  console.log('motivo_envio:', getConst(b.properties?.motivo_envio));
}

function walkPatterns(node, out = new Set(), field = '') {
  if (!node || typeof node !== 'object') return out;
  if (node.pattern) out.add(`${field || '?'}: ${node.pattern}`);
  for (const [k, v] of Object.entries(node)) {
    if (k === 'pattern') continue;
    walkPatterns(v, out, field ? `${field}.${k}` : k);
  }
  return out;
}
console.log('\n--- Patterns ---');
for (const p of [...walkPatterns(schema)].sort()) console.log(p);
