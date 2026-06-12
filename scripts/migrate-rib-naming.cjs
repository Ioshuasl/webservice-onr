#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const WF_DIR = path.join(__dirname, '../workflows/n8n/extensao-n8n-teste');
const POSTMAN = path.join(__dirname, '../postman/RIB-n8n.postman_collection.json');

const MAP = {};
for (let leg = 91; leg <= 126; leg++) MAP[leg] = leg - 90;

function migrateText(c) {
  for (const [leg, seq] of Object.entries(MAP)) {
    c = c.replace(new RegExp(`\\[AUTONR-${leg}\\]`, 'g'), `[AUTORIB-${seq}]`);
    c = c.replace(new RegExp(`AUTONR-${leg}`, 'g'), `AUTORIB-${seq}`);
  }
  c = c.replace(/\(integração\)/gi, '(rib)');
  c = c.replace(/AUTONR-91…126/g, 'AUTORIB-1…36');
  c = c.replace(/AUTONR-91/g, 'AUTORIB-1');
  for (let leg = 92; leg <= 126; leg++) {
    c = c.replace(new RegExp(`AUTONR-${leg}`, 'g'), `AUTORIB-${leg - 90}`);
  }
  c = c.replace(/Uma request por AUTONR\./gi, 'Uma request por AUTORIB.');
  c = c.replace(/\| AUTONR \|/g, '| AUTORIB |');
  return c;
}

const wfFiles = fs.readdirSync(WF_DIR).filter((f) => f.endsWith(' RIB.workflow.ts'));
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
