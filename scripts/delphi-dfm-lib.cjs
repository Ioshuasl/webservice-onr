/**
 * Parser DFM Delphi 7 — componentes, eventos, DataSource, frames.
 */
const fs = require('fs');
const path = require('path');

const OBJECT_RE = /^(\s*)(object|inherited|inline)\s+(\w+):\s*(\w+)/i;
const END_RE = /^(\s*)end\s*$/i;
const PROP_RE = /^(\s*)(\w+)\s*=\s*(.+)$/;

function readDfmFile(absPath) {
  return fs.readFileSync(absPath, 'latin1');
}

function parseDfm(content) {
  const lines = content.split(/\r?\n/);
  const components = [];
  const events = [];
  const dataSources = [];
  const frames = [];
  const stack = [];
  let root = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const om = line.match(OBJECT_RE);
    if (om) {
      const indent = om[1].length;
      const kind = om[2].toLowerCase();
      const name = om[3];
      const cls = om[4];
      while (stack.length && stack[stack.length - 1].indent >= indent) {
        stack.pop();
      }
      const parent = stack.length ? stack[stack.length - 1].name : null;
      const node = {
        name,
        class: cls,
        kind,
        parent,
        line: i + 1,
      };
      if (!root) {
        root = { name, class: cls, line: i + 1 };
      }
      components.push(node);
      if (kind === 'inline' || /^TFrame/i.test(cls)) {
        frames.push({
          name,
          frame_class: cls,
          unit: name.replace(/^Frame/i, 'Frame') === name ? name : name,
          line: i + 1,
          parent,
        });
      }
      stack.push({ name, class: cls, indent });
      continue;
    }

    const em = line.match(END_RE);
    if (em) {
      const indent = em[1].length;
      while (stack.length && stack[stack.length - 1].indent >= indent) {
        stack.pop();
      }
      continue;
    }

    const pm = line.match(PROP_RE);
    if (!pm || !stack.length) continue;

    const prop = pm[2];
    const value = pm[3].trim().replace(/\s+$/, '');
    const current = stack[stack.length - 1];

    if (/^On[A-Z]/.test(prop)) {
      let handler = value.split(/\s/)[0];
      handler = handler.replace(/^['"]+|['"]+$/g, '');
      events.push({
        component: current.name,
        component_class: current.class,
        event: prop,
        handler,
        line_dfm: i + 1,
        handler_line_start: null,
        handler_line_end: null,
        handler_missing: false,
      });
    }

    if (prop === 'DataSet' && /DataSource|TDataSource/i.test(current.class)) {
      dataSources.push({
        name: current.name,
        dataset: value,
        line: i + 1,
      });
    }
  }

  return {
    line_count: lines.length,
    root,
    components,
    events,
    data_sources: dataSources,
    frames,
    events_total: events.length,
    components_total: components.length,
  };
}

function findPasPair(absDfm, productPath) {
  const pasSame = absDfm.replace(/\.dfm$/i, '.pas');
  if (fs.existsSync(pasSame)) {
    return path.join(productPath, path.basename(pasSame)).replace(/\\/g, '/');
  }
  return null;
}

function loadPasManifest(vaultHub, unitBase) {
  const manifestPath = path.join(
    require('./delphi-batch-paths.cjs').VAULT_ROOT,
    vaultHub.replace(/\//g, path.sep),
    'manifest',
    `${unitBase}.symbols.json`,
  );
  if (!fs.existsSync(manifestPath)) return null;
  return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
}

function crossRefHandlers(events, pasManifest) {
  if (!pasManifest) {
    return events.map((e) => ({ ...e, handler_missing: true }));
  }

  const procedures = [
    ...(pasManifest.procedures || []),
    ...(pasManifest.functions || []),
  ];
  const byName = new Map();
  for (const p of procedures) {
    byName.set(p.name.toLowerCase(), p);
  }

  return events.map((ev) => {
    const proc = byName.get(ev.handler.toLowerCase());
    if (!proc) {
      return { ...ev, handler_missing: true };
    }
    return {
      ...ev,
      handler_line_start: proc.line_start ?? null,
      handler_line_end: proc.line_end ?? null,
      handler_missing: !proc.line_start,
      handler_class: proc.class ?? null,
    };
  });
}

function priorityEvents(events) {
  const priority = new Set([
    'OnCreate', 'OnShow', 'OnActivate', 'OnClick', 'OnClose', 'OnCloseQuery',
    'OnDestroy', 'OnChange', 'OnKeyDown', 'OnKeyPress',
  ]);
  return events
    .filter((e) => priority.has(e.event) || e.handler_missing)
    .slice(0, 30)
    .map((e) => e.handler);
}

function generateFormIndexMd(manifest) {
  const eventRows = manifest.events.map((e) => {
    const lines = e.handler_line_start
      ? `L${e.handler_line_start}–${e.handler_line_end}`
      : '—';
    const miss = e.handler_missing ? ' ⚠️' : '';
    return `| ${e.component} | ${e.event} | \`${e.handler}\` | ${lines} | ${e.handler_missing ? 'sim' : 'não'} |`;
  });

  const dsRows = manifest.data_sources.map(
    (d) => `| \`${d.name}\` | \`${d.dataset}\` | L${d.line} |`,
  );

  const compSummary = manifest.components
    .filter((c) => c.parent === (manifest.root?.name || null))
    .slice(0, 40)
    .map((c) => `- \`${c.name}\` (${c.class}) L${c.line}`)
    .join('\n');

  return `---
tipo: legado-delphi
area: orius
produto: ${manifest.product_slug}
artefato: dfm
form: ${manifest.form_unit}
arquivo: ${manifest.path}
status: rascunho
fonte: extract-delphi-dfm
atualizado: ${manifest.indexed_at.slice(0, 10)}
---

# Form \`${manifest.form_class}\` — ${manifest.form_unit}

| Campo | Valor |
|-------|-------|
| Arquivo DFM | \`${manifest.path}\` |
| Unit PAS | \`${manifest.pas_pair || '—'}\` |
| Objeto raiz | \`${manifest.root?.name}\` |
| Linhas DFM | ${manifest.line_count} |
| Componentes | ${manifest.components_total} |
| Eventos | ${manifest.events_total} |
| Manifest | [[Orius/desenvolvimento/legado-delphi/produtos/${manifest.product_slug}/manifest/${manifest.form_unit}.dfm.json]] |

## Componentes raiz (amostra)

${compSummary || '_Nenhum_'}

## DataSources

| Nome | DataSet | Linha |
|------|---------|-------|
${dsRows.length ? dsRows.join('\n') : '| — | — | — |'}

## Eventos → handlers

| Componente | Evento | Handler | Linhas PAS | Ausente |
|------------|--------|---------|------------|---------|
${eventRows.length ? eventRows.join('\n') : '| — | — | — | — | — |'}

## Frames embutidos

${manifest.frames.length ? manifest.frames.map((f) => `- \`${f.name}\` (${f.frame_class}) L${f.line}`).join('\n') : '_Nenhum_'}
`;
}

module.exports = {
  readDfmFile,
  parseDfm,
  findPasPair,
  loadPasManifest,
  crossRefHandlers,
  priorityEvents,
  generateFormIndexMd,
};
