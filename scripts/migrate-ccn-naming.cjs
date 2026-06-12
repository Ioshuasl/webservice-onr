#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const WF_DIR = path.join(__dirname, '../workflows/n8n/extensao-n8n-teste');
const POSTMAN = path.join(__dirname, '../postman/CCN-Upload-XML-n8n.postman_collection.json');

const MAP = { 88: 1, 89: 2, 90: 3 };

function migrateText(c) {
  for (const [leg, seq] of Object.entries(MAP)) {
    c = c.replace(new RegExp(`\\[AUTONR-${leg}\\]`, 'g'), `[AUTCCN-${seq}]`);
    c = c.replace(new RegExp(`AUTONR-${leg}`, 'g'), `AUTCCN-${seq}`);
  }
  c = c.replace(/\(CCN\)/g, '(ccn)');
  c = c.replace(/AUTONR-88…90/g, 'AUTCCN-1…3');
  return c;
}

const wfFiles = fs.readdirSync(WF_DIR).filter((f) => f.startsWith('CCN ') && f.endsWith('.workflow.ts'));
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
