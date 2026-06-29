'use strict';
const fs = require('fs');
const schema = JSON.parse(
  fs.readFileSync('c:\\Users\\kenio\\automacoes e testes\\scripts\\_itn-urbanos-schema-parsed.json', 'utf8')
);

function getConst(obj) {
  if (!obj) return undefined;
  if (obj.const !== undefined) return obj.const;
  if (obj.anyOf) {
    const vals = obj.anyOf.map(getConst).filter((v) => v !== undefined);
    if (vals.length) return vals.length === 1 ? vals[0] : [...new Set(vals)];
  }
  if (obj.enum) return obj.enum.length === 1 ? obj.enum[0] : obj.enum;
  return undefined;
}

function fmtConst(v) {
  if (v === undefined) return '—';
  if (Array.isArray(v)) return v.join(' | ');
  return String(v);
}

function summarizeBranch(obj, depth = 0) {
  const p = obj.properties || {};
  const discriminators = {};
  for (const key of [
    'tipo_imovel',
    'contexto_urbano',
    'ato',
    'tipo_matricula_transcricao',
    'motivo_envio',
    'georreferenciamento',
    'tipo_registro',
    'tipo_ato',
  ]) {
    if (p[key]) discriminators[key] = getConst(p[key]);
  }
  return {
    discriminators,
    required: obj.required || [],
    properties: Object.keys(p),
    additionalProperties: obj.additionalProperties,
    nested: {
      dados_imovel: summarizeArray(p.dados_imovel),
      dados_pessoa: summarizePessoa(p.dados_pessoa),
      atos: summarizeArray(p.atos),
      unidades: summarizeArray(p.unidades),
      loteamento: p.loteamento ? summarizeObject(p.loteamento) : null,
      condominio: p.condominio ? summarizeObject(p.condominio) : null,
      georreferenciamento_coords: p.georreferenciamento_coordenadas
        ? summarizeObject(p.georreferenciamento_coordenadas)
        : null,
    },
  };
}

function summarizeObject(def) {
  if (!def) return null;
  const items = def.items || def;
  return {
    required: items.required || def.required || [],
    properties: Object.keys(items.properties || def.properties || {}),
  };
}

function summarizeArray(def) {
  if (!def) return null;
  const items = def.items;
  if (!items) return { minItems: def.minItems, type: def.type };
  if (items.anyOf) {
    return {
      minItems: def.minItems,
      branches: items.anyOf.map((b) => summarizeBranch(b)),
    };
  }
  return {
    minItems: def.minItems,
    required: items.required || [],
    properties: Object.keys(items.properties || {}),
    additionalProperties: items.additionalProperties,
  };
}

function summarizePessoa(def) {
  if (!def) return null;
  if (def.anyOf) {
    return def.anyOf.map((alt) => {
      if (alt.type === 'null') return { type: 'null' };
      return summarizeArray(alt);
    });
  }
  return summarizeArray(def);
}

function walkAllOf(allOf, path = 'items') {
  const out = [];
  if (!allOf) return out;
  allOf.forEach((clause, i) => {
    const clausePath = `${path}.allOf[${i}]`;
    if (clause.anyOf) {
      clause.anyOf.forEach((branch, j) => {
        if (branch.type === 'object' && branch.properties) {
          out.push({
            path: `${clausePath}.anyOf[${j}]`,
            ...summarizeBranch(branch),
          });
        } else if (branch.anyOf) {
          branch.anyOf.forEach((sub, k) => {
            if (sub.properties) {
              out.push({
                path: `${clausePath}.anyOf[${j}].anyOf[${k}]`,
                ...summarizeBranch(sub),
              });
            }
          });
        }
      });
    } else if (clause.if || clause.then || clause.else) {
      out.push({
        path: clausePath,
        kind: 'conditional',
        if: clause.if?.properties
          ? Object.fromEntries(
              Object.entries(clause.if.properties).map(([k, v]) => [k, getConst(v)])
            )
          : clause.if,
        thenRequired: clause.then?.required,
        elseRequired: clause.else?.required,
        thenProps: clause.then?.properties
          ? Object.keys(clause.then.properties)
          : undefined,
      });
    } else if (clause.required) {
      out.push({
        path: clausePath,
        kind: 'required-extension',
        required: clause.required,
      });
    } else if (clause.properties) {
      out.push({ path: clausePath, ...summarizeBranch(clause) });
    }
  });
  return out;
}

const items = schema.properties.imoveis.items;
const branches = walkAllOf(items.allOf);

// dedupe branches by discriminator signature
const seen = new Map();
for (const b of branches) {
  const sig = JSON.stringify(b.discriminators || b.if || b.kind);
  if (!seen.has(sig)) seen.set(sig, b);
}

const uniqueBranches = [...seen.values()];

const patterns = {
  cns: schema.properties.cns.pattern,
  data_dd_mm_aaaa: '^\\d{2}/\\d{2}/\\d{4}$',
  cnm: '^(?:\\d{6}\\.\\d\\.\\d{7}-\\d{2}|\\d{16})$',
  cep: '^(?:\\d{8}|\\d{2}\\.\\d{3}-\\d{3})$',
  cib: '^(?:[A-Za-z0-9]{8}|[A-Za-z0-9]{7}-[A-Za-z0-9])$',
  cpf_cnpj: '^(?:\\d{11}|\\d{14}|[A-Za-z0-9]{1,20})$', // truncated in source; inferred from partial
  cpf: '^(?:\\d{11}|\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2})$',
  cat: '^\\d{1,15}$',
  rip: '^\\d{1,13}$',
};

const report = {
  root: {
    required: schema.required,
    properties: {
      version: { type: 'string', const: schema.properties.version.const },
      cns: { type: 'string', pattern: schema.properties.cns.pattern },
      imoveis: { type: 'array', minItems: schema.properties.imoveis.minItems },
    },
    additionalProperties: schema.additionalProperties,
  },
  imovelItems: {
    allOfCount: items.allOf.length,
    branchCount: uniqueBranches.length,
    branches: uniqueBranches,
  },
  patterns,
};

fs.writeFileSync(
  'c:\\Users\\kenio\\automacoes e testes\\scripts\\_itn-urbanos-schema-report.json',
  JSON.stringify(report, null, 2)
);

console.log('allOf clauses:', items.allOf.length);
console.log('unique branches:', uniqueBranches.length);
for (const b of uniqueBranches) {
  const d = b.discriminators || {};
  console.log(
    '-',
    b.path || b.kind,
    '|',
    Object.entries(d)
      .map(([k, v]) => `${k}=${fmtConst(v)}`)
      .join(', ') || JSON.stringify(b.if),
    '| required:',
    (b.required || b.thenRequired || []).join(', ') || '—'
  );
}
