#!/usr/bin/env node
/**
 * Deduplicate extensao-n8n-teste workflows:
 * - Group by workflow name from n8nac list --json
 * - Keep file with _<idPrefix>.workflow.ts (canonical remote id) OR single plain file
 * - Delete duplicate local files and remote workflow IDs
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const wfDir = path.join(root, 'workflows', 'n8n', 'extensao-n8n-teste');

function loadN8nApiKey() {
  if (process.env.N8N_API_KEY) return process.env.N8N_API_KEY.trim();
  const dotenvPath = path.join(root, '.env');
  if (fs.existsSync(dotenvPath)) {
    for (const line of fs.readFileSync(dotenvPath, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^N8N_API_KEY=(.+)$/);
      if (m) return m[1].trim();
    }
  }
  const vaultEnv = path.join(
    process.env.USERPROFILE || '',
    'OneDrive',
    'Documentos',
    'Obsidian Vault',
    'env.md'
  );
  if (fs.existsSync(vaultEnv)) {
    const m = fs.readFileSync(vaultEnv, 'utf8').match(/^N8N_API_KEY=(.+)$/m);
    if (m) return m[1].trim();
  }
  throw new Error('N8N_API_KEY not found (.env, env var, or Obsidian env.md)');
}

function n8nBaseUrl() {
  const cfg = JSON.parse(fs.readFileSync(path.join(root, 'n8nac-config.json'), 'utf8'));
  const target = cfg.environmentTargets.find((t) => t.id === 'extensao-n8n-teste');
  if (!target?.url) throw new Error('extensao-n8n-teste URL missing in n8nac-config.json');
  return target.url.replace(/\/$/, '');
}

async function deleteRemoteWorkflow(id) {
  const base = n8nBaseUrl();
  const apiKey = loadN8nApiKey();
  const res = await fetch(`${base}/api/v1/workflows/${id}`, {
    method: 'DELETE',
    headers: { 'X-N8N-API-KEY': apiKey },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`DELETE ${id} → ${res.status}: ${body.slice(0, 200)}`);
  }
}

function run(cmd) {
  return execSync(cmd, { cwd: root, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
}

function runN8n(args) {
  try {
    return run(`npx --yes n8nac ${args}`);
  } catch (e) {
    const out = (e.stdout || '') + (e.stderr || '');
    if (e.status === 0 || /✔|Pushed|Pulled|deleted/i.test(out)) return out;
    throw new Error(out || e.message);
  }
}

function parseListJson() {
  const raw = runN8n('list --json');
  const start = raw.indexOf('[');
  const end = raw.lastIndexOf(']');
  if (start === -1) throw new Error('list --json failed');
  return JSON.parse(raw.slice(start, end + 1));
}

function baseName(filename) {
  return filename.replace(/\.workflow\.ts$/, '');
}

function isSuffixFile(filename) {
  return /^(.+)_([A-Za-z0-9]{6,})\.workflow\.ts$/.test(filename);
}

function plainNameFromSuffix(filename) {
  const m = filename.match(/^(.+)_([A-Za-z0-9]{6,})\.workflow\.ts$/);
  return m ? m[1] : null;
}

function idPrefixFromSuffix(filename) {
  const m = filename.match(/_([A-Za-z0-9]{6,})\.workflow\.ts$/);
  return m ? m[1] : null;
}

runN8n('env use "extensao n8n teste"');
const items = parseListJson();

const byName = new Map();
for (const w of items) {
  if (!byName.has(w.name)) byName.set(w.name, []);
  byName.get(w.name).push(w);
}

const toDeleteRemote = [];
const toDeleteLocal = [];
const toRename = [];

for (const [name, group] of byName.entries()) {
  if (group.length === 1) {
    const w = group[0];
    const plain = `${name}.workflow.ts`;
    const plainPath = path.join(wfDir, plain);
    if (w.filename !== plain && isSuffixFile(w.filename)) {
      const suffixPath = path.join(wfDir, w.filename);
      if (fs.existsSync(suffixPath)) {
        toRename.push({ from: suffixPath, to: plainPath, id: w.id, name });
      }
    }
    continue;
  }

  // Multiple remote IDs for same name — keep entry whose filename has _id suffix matching w.id
  let keeper = null;
  for (const w of group) {
    const prefix = idPrefixFromSuffix(w.filename);
    if (prefix && w.id.startsWith(prefix)) {
      keeper = w;
      break;
    }
  }
  if (!keeper) {
    // fallback: prefer _suffix file, else latest id (longer file name)
    keeper =
      group.find((w) => isSuffixFile(w.filename)) ||
      group.sort((a, b) => b.id.localeCompare(a.id))[0];
  }

  const plain = `${name}.workflow.ts`;
  const keeperPath = path.join(wfDir, keeper.filename);
  const plainPath = path.join(wfDir, plain);

  if (keeper.filename !== plain && fs.existsSync(keeperPath)) {
    toRename.push({ from: keeperPath, to: plainPath, id: keeper.id, name });
  } else if (keeper.filename === plain) {
    // ok
  }

  for (const w of group) {
    if (w.id === keeper.id) continue;
    toDeleteRemote.push({ id: w.id, name, filename: w.filename });
  }

  for (const w of group) {
    if (w.id === keeper.id) continue;
    const p = path.join(wfDir, w.filename);
    if (fs.existsSync(p)) toDeleteLocal.push(p);
  }

  // Also remove plain file if we're keeping suffix and will rename
  if (keeper.filename !== plain) {
    for (const w of group) {
      if (w.filename === plain && w.id !== keeper.id) {
        const p = path.join(wfDir, plain);
        if (fs.existsSync(p)) toDeleteLocal.push(p);
      }
    }
  }
}

// Orphan suffix/plain files not in list
const listed = new Set(items.map((w) => w.filename));
for (const f of fs.readdirSync(wfDir)) {
  if (!f.endsWith('.workflow.ts')) continue;
  if (listed.has(f)) continue;
  toDeleteLocal.push(path.join(wfDir, f));
}

console.log('=== PLAN ===');
console.log('Rename:', toRename.length);
toRename.forEach((r) => console.log(`  ${path.basename(r.from)} -> ${path.basename(r.to)} (${r.id})`));
console.log('Delete remote:', toDeleteRemote.length);
toDeleteRemote.forEach((d) => console.log(`  ${d.name} ${d.id} (${d.filename})`));
console.log('Delete local:', toDeleteLocal.length);
[...new Set(toDeleteLocal.map((p) => path.basename(p)))].forEach((f) => console.log(`  ${f}`));

if (process.argv.includes('--dry-run')) {
  process.exit(0);
}

// Execute renames (update id in file if needed)
for (const r of toRename) {
  let content = fs.readFileSync(r.from, 'utf8');
  content = content.replace(/id:\s*['"][^'"]+['"]/, `id: '${r.id}'`);
  if (fs.existsSync(r.to) && r.from !== r.to) fs.unlinkSync(r.to);
  fs.writeFileSync(r.to, content, 'utf8');
  if (r.from !== r.to && fs.existsSync(r.from)) fs.unlinkSync(r.from);
  console.log('Renamed:', path.basename(r.to));
}

const keepLocalPaths = new Set(toRename.map((r) => path.resolve(r.to)));
for (const p of [...new Set(toDeleteLocal)]) {
  const abs = path.resolve(p);
  if (keepLocalPaths.has(abs)) continue;
  if (fs.existsSync(p)) {
    fs.unlinkSync(p);
    console.log('Deleted local:', path.basename(p));
  }
}

(async () => {
  for (const d of toDeleteRemote) {
    try {
      await deleteRemoteWorkflow(d.id);
      console.log('Deleted remote:', d.name, d.id);
    } catch (e) {
      console.error('Failed remote delete:', d.id, e.message?.slice(0, 200));
      process.exitCode = 1;
    }
  }

  console.log('\n=== Final list ===');
  console.log(runN8n('list').split('\n').slice(-12).join('\n'));
})();
