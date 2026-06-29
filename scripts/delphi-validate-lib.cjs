/**
 * Validação determinística de notas vault Delphi (gates P2).
 */
const fs = require('fs');
const path = require('path');
const { CODE_ROOT, VAULT_ROOT, DELPHI_PRODUCTS } = require('./delphi-batch-paths.cjs');

const REQUIRED_SECTIONS = {
  full: [
    { keys: ['## Localização'], gate: null },
    { keys: ['## Resumo', '## Resumo global'], gate: null },
    { keys: ['## SQL e tabelas', '## SQL e tabelas Firebird'], gate: 'sql' },
    { keys: ['## Chama'], gate: 'chamadas' },
    { keys: ['## Chamado por'], gate: 'chamadas' },
    {
      keys: ['## Briefing implementação', '## Briefing implementação / correção', '## Briefing'],
      gate: 'briefing',
    },
    { keys: ['## Evidência'], gate: 'evidencia' },
  ],
  stub: [
    { keys: ['## Localização', '## Resumo'], gate: null },
  ],
};

function parseFrontmatter(content) {
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return { raw: null, fields: {} };
  const fields = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([\w_-]+):\s*(.*)$/);
    if (kv) fields[kv[1]] = kv[2].trim();
  }
  return { raw: m[1], fields };
}

function sectionContent(content, heading) {
  const re = new RegExp(
    `^${escapeRe(heading)}\\s*$([\\s\\S]*?)(?=^## |\\Z)`,
    'im',
  );
  const m = content.match(re);
  return m ? m[1].trim() : '';
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function hasMeaningfulContent(text) {
  const stripped = text
    .replace(/```[\s\S]*?```/g, 'X')
    .replace(/\[\[[^\]]+\]\]/g, 'X')
    .replace(/[-|]/g, '')
    .replace(/\s/g, '');
  return stripped.length > 8;
}

function findSection(content, keyList) {
  for (const key of keyList) {
    const body = sectionContent(content, key);
    if (body) return { heading: key, body };
  }
  return { heading: null, body: '' };
}

function parseLineRange(fields, fallback) {
  const src = fields.linhas || '';
  const m = src.match(/(\d+)\s*[-–]\s*(\d+)/);
  if (m) return { start: +m[1], end: +m[2] };
  if (fallback?.line_start) {
    return { start: fallback.line_start, end: fallback.line_end };
  }
  return null;
}

function readSourceLines(pasPath, lineStart, lineEnd) {
  const abs = path.isAbsolute(pasPath)
    ? pasPath
    : path.join(CODE_ROOT, pasPath.replace(/\\/g, '/'));
  if (!fs.existsSync(abs)) return null;
  const lines = fs.readFileSync(abs, 'latin1').split(/\r?\n/);
  const start = Math.max(1, lineStart);
  const end = Math.min(lines.length, lineEnd);
  return lines.slice(start - 1, end).join('\n');
}

function verifySourceEvidence(pasPath, symbolName, lineStart, lineEnd) {
  const chunk = readSourceLines(pasPath, lineStart, lineEnd);
  if (!chunk) {
    return { ok: false, error: `fonte não encontrada: ${pasPath}` };
  }
  const nameRe = new RegExp(`\\b${escapeRe(symbolName)}\\b`, 'i');
  const head = readSourceLines(pasPath, lineStart, Math.min(lineStart + 3, lineEnd));
  if (!nameRe.test(head || chunk.slice(0, 200))) {
    return {
      ok: false,
      error: `símbolo ${symbolName} não encontrado nas linhas ${lineStart}–${lineEnd}`,
    };
  }
  return { ok: true };
}

function checkSqlSection(body) {
  if (!hasMeaningfulContent(body)) return false;
  if (/sem\s+sql|não\s+há\s+sql|sem\s+alteração/i.test(body)) return true;
  return /[RCGP]_[A-Z0-9_]+|sql[A-Z]\w+|TIBQuery|ApplyUpdates|INSERT|SELECT|UPDATE/i.test(body);
}

function validateVaultNote(options) {
  const {
    vaultPath,
    symbolName,
    pasPath,
    lineStart,
    lineEnd,
    mode = 'full',
  } = options;

  const result = {
    vault_path: vaultPath,
    symbol: symbolName,
    mode,
    pass: true,
    gates: {
      evidencia: false,
      sql: false,
      chamadas: false,
      briefing: false,
    },
    errors: [],
    warnings: [],
  };

  if (!vaultPath || !fs.existsSync(vaultPath)) {
    result.pass = false;
    result.errors.push(`nota vault ausente: ${vaultPath || '(null)'}`);
    return result;
  }

  const content = fs.readFileSync(vaultPath, 'utf8');
  const { fields } = parseFrontmatter(content);
  const sections = REQUIRED_SECTIONS[mode] || REQUIRED_SECTIONS.full;

  for (const req of sections) {
    const { heading, body } = findSection(content, req.keys);
    if (!heading) {
      if (mode === 'full') {
        result.pass = false;
        result.errors.push(`seção ausente: ${req.keys[0]}`);
      }
      continue;
    }
    if (req.gate === 'sql') {
      result.gates.sql = checkSqlSection(body);
      if (!result.gates.sql && mode === 'full') {
        result.warnings.push('seção SQL vazia ou sem tabelas identificáveis');
      }
    } else if (req.gate === 'chamadas') {
      const ok = hasMeaningfulContent(body);
      if (heading === '## Chama' || heading.includes('Chama')) {
        result.gates.chamadas = result.gates.chamadas || ok;
      }
    } else if (req.gate === 'briefing') {
      result.gates.briefing = hasMeaningfulContent(body);
      if (!result.gates.briefing && mode === 'full') {
        result.pass = false;
        result.errors.push('briefing vazio ou placeholder');
      }
    } else if (req.gate === 'evidencia') {
      const hasBlock = /```pascal[\s\S]*?```/i.test(body);
      const hasLines = /L\d{3,}/.test(body);
      result.gates.evidencia = hasBlock || hasLines;
      if (!result.gates.evidencia && mode === 'full') {
        result.pass = false;
        result.errors.push('evidência sem bloco pascal nem referência de linha');
      }
    }
  }

  if (mode === 'full' && !result.gates.chamadas) {
    const chama = findSection(content, ['## Chama']).body;
    const chamado = findSection(content, ['## Chamado por']).body;
    result.gates.chamadas = hasMeaningfulContent(chama) || hasMeaningfulContent(chamado);
    if (!result.gates.chamadas) {
      result.warnings.push('seções Chama/Chamado por fracas');
    }
  }

  const range = parseLineRange(fields, { line_start: lineStart, line_end: lineEnd });
  if (range && pasPath && symbolName) {
    const src = verifySourceEvidence(pasPath, symbolName, range.start, range.end);
    if (!src.ok) {
      result.pass = false;
      result.errors.push(src.error);
    }
  } else if (mode === 'full' && pasPath) {
    result.warnings.push('linhas frontmatter ausentes — validação de fonte ignorada');
  }

  if (fields.status === 'rascunho' && mode === 'full') {
    result.warnings.push('frontmatter status: rascunho (esperado revisado após merge)');
  }

  return result;
}

function resolveVaultAbs(vaultRel) {
  return path.join(VAULT_ROOT, vaultRel.replace(/\//g, path.sep));
}

function loadBatchState(productSlug) {
  const profile = DELPHI_PRODUCTS[productSlug];
  if (!profile) throw new Error(`Slug desconhecido: ${productSlug}`);
  const batchPath = profile.batch_file;
  if (!fs.existsSync(batchPath)) throw new Error(`Batch ausente: ${batchPath}`);
  return { profile, path: batchPath, state: JSON.parse(fs.readFileSync(batchPath, 'utf8')) };
}

function validateBatchSymbols(state, options = {}) {
  const { fileFilter, statusFilter = ['done'], updateBatch = false, batchId } = options;
  const activeId = batchId || state.active_batch_id;
  const batch = state.batches[activeId];
  if (!batch) throw new Error(`Batch não encontrado: ${activeId}`);

  const results = [];
  const filePaths = fileFilter ? [fileFilter] : Object.keys(batch.files);

  for (const filePath of filePaths) {
    const fileState = batch.files[filePath];
    if (!fileState || fileState.artifact === 'dfm') continue;

    for (const [symbolName, sym] of Object.entries(fileState.symbols || {})) {
      if (!statusFilter.includes(sym.status)) continue;
      if (!sym.vault_path) {
        results.push({
          file: filePath,
          symbol: symbolName,
          pass: false,
          errors: ['vault_path ausente no batch'],
        });
        continue;
      }

      const mode = sym.analyze_action === 'stub' ? 'stub' : 'full';
      const validation = validateVaultNote({
        vaultPath: resolveVaultAbs(sym.vault_path),
        symbolName,
        pasPath: filePath,
        lineStart: sym.line_start,
        lineEnd: sym.line_end,
        mode,
      });

      const entry = {
        file: filePath,
        symbol: symbolName,
        ...validation,
      };
      results.push(entry);

      if (updateBatch) {
        sym.gates = { ...sym.gates, ...validation.gates };
        sym.validation_pass = validation.pass;
        sym.validation_errors = validation.errors;
        sym.validated_at = new Date().toISOString();
      }
    }
  }

  if (updateBatch) {
    fs.writeFileSync(
      options.batchPath,
      JSON.stringify(state, null, 2) + '\n',
      'utf8',
    );
  }

  const passed = results.filter((r) => r.pass).length;
  return {
    batch_id: activeId,
    total: results.length,
    passed,
    failed: results.length - passed,
    results,
  };
}

module.exports = {
  validateVaultNote,
  validateBatchSymbols,
  resolveVaultAbs,
  parseFrontmatter,
  hasMeaningfulContent,
};
