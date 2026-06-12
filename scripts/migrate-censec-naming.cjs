#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const WF_DIR = path.join(__dirname, '../workflows/n8n/extensao-n8n-teste');
const POSTMAN = path.join(__dirname, '../postman/censec-n8n.postman_collection.json');

function migrateText(c) {
  c = c.replace(/\[AUTONR-13\]/g, '[AUTCENSEC-1]');
  c = c.replace(/AUTONR-13(?!\d)/g, 'AUTCENSEC-1');
  c = c.replace(/\(CENSEC\)/g, '(censec)');
  return c;
}

const wfFiles = fs.readdirSync(WF_DIR).filter((f) => f.startsWith('CENSEC ') && f.endsWith('.workflow.ts'));
const renamed = [];
for (const f of wfFiles) {
  const fp = path.join(WF_DIR, f);
  const before = fs.readFileSync(fp, 'utf8');
  const after = migrateText(before);
  if (after !== before) {
    fs.writeFileSync(fp, after);
    renamed.push(f);
  }
}

let postman = false;
if (fs.existsSync(POSTMAN)) {
  const before = fs.readFileSync(POSTMAN, 'utf8');
  const after = migrateText(before);
  if (after !== before) {
    fs.writeFileSync(POSTMAN, after);
    postman = true;
  }
}

console.log(JSON.stringify({ workflows: renamed.length, postman }, null, 2));
