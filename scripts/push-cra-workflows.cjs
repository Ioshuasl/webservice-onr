#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const WF_DIR = path.join(__dirname, '../workflows/n8n/extensao-n8n-teste');
const files = fs.readdirSync(WF_DIR).filter((f) => f.endsWith(' CRA.workflow.ts'));
const root = path.join(__dirname, '..');
const results = [];

for (const f of files.sort()) {
  const rel = `workflows/n8n/extensao-n8n-teste/${f}`;
  try {
    execSync(`npx --yes n8nac push "${rel}"`, { cwd: root, stdio: 'pipe', encoding: 'utf8' });
    results.push({ file: f, ok: true });
  } catch (e) {
    results.push({ file: f, ok: false, err: (e.stderr || e.message).slice(0, 200) });
  }
}

const ok = results.filter((r) => r.ok).length;
console.log(JSON.stringify({ ok, total: results.length, failed: results.filter((r) => !r.ok) }, null, 2));
