#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const base = path.join(root, 'workflows', 'n8n', 'extensao-n8n-teste');

function run(cmd) {
  return execSync(cmd, { cwd: root, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
}

function runN8n(args) {
  const out = run(`npx --yes n8nac ${args}`);
  return out.replace(/^\uFEFF/, '').trim();
}

function parseList(flag) {
  const raw = runN8n(`list ${flag} --json`);
  const start = raw.indexOf('[');
  const end = raw.lastIndexOf(']');
  if (start === -1 || end === -1) throw new Error(`JSON not found for list ${flag}`);
  return JSON.parse(raw.slice(start, end + 1));
}

runN8n('env use "extensao n8n teste"');
console.log('Environment: extensao n8n teste\n');

const remote = parseList('--remote');
const local = parseList('--local');

const failed = [];

console.log(`=== PULL remote-only (${remote.length}) ===`);
for (const w of remote) {
  try {
    console.log(`Pull: ${w.name} (${w.id})`);
    runN8n(`pull ${w.id}`);
  } catch (e) {
    failed.push({ op: 'pull', name: w.name, error: e.stderr || e.message });
    console.error(`  FAIL: ${w.name}`);
  }
}

console.log(`\n=== PUSH local-only (${local.length}) ===`);
for (const w of local) {
  const filePath = path.join(base, w.filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`  Skip missing: ${w.filename}`);
    continue;
  }
  try {
    console.log(`Push: ${w.name}`);
    const rel = path.relative(root, filePath).replace(/\\/g, '/');
    runN8n(`push "${rel}" --verify`);
  } catch (e) {
    failed.push({ op: 'push', name: w.name, error: e.stderr || e.message });
    console.error(`  FAIL: ${w.name}`);
  }
}

console.log('\n=== Final list (tail) ===');
console.log(runN8n('list').split('\n').slice(-10).join('\n'));

if (failed.length) {
  console.log('\n=== Failures ===');
  failed.forEach((f) => console.log(JSON.stringify(f, null, 2)));
  process.exit(1);
}
