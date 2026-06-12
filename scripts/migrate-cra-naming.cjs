#!/usr/bin/env node
/** Renomeia workflows CRA e Postman: AUTONR-127…142 → AUTOCRA-1…16, (webservice CRA) → (cra) */
const fs = require('fs');
const path = require('path');

const WF_DIR = path.join(__dirname, '../workflows/n8n/extensao-n8n-teste');
const POSTMAN = path.join(__dirname, '../postman/cra-webservice-n8n.postman_collection.json');

const MAP = {};
for (let leg = 127; leg <= 142; leg++) MAP[leg] = leg - 126;

function migrateText(c) {
  for (const [leg, seq] of Object.entries(MAP)) {
    c = c.replace(new RegExp(`\\[AUTONR-${leg}\\]`, 'g'), `[AUTOCRA-${seq}]`);
    c = c.replace(new RegExp(`AUTONR-${leg}`, 'g'), `AUTOCRA-${seq}`);
  }
  c = c.replace(/\(webservice CRA\)/g, '(cra)');
  c = c.replace(/AUTONR-127…142/g, 'AUTOCRA-1…16');
  return c;
}

const wfFiles = fs.readdirSync(WF_DIR).filter((f) => f.endsWith(' CRA.workflow.ts'));
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
