#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const BATCH_PATH = path.join(__dirname, 'autonr-batch-state.json');
const REG_PATH = path.join(
  process.env.USERPROFILE || '',
  'Obsidian Vault/Meta/integracoes/plane/maps/autccn-work-items.json',
);

const LEGACY_TO_SEQ = { 'AUTONR-88': 'AUTCCN-1', 'AUTONR-89': 'AUTCCN-2', 'AUTONR-90': 'AUTCCN-3' };

function migrateTitle(t) {
  if (!t) return t;
  let s = t.replace(/\(CCN\)/g, '(ccn)');
  for (const [leg, neo] of Object.entries(LEGACY_TO_SEQ)) {
    s = s.replace(new RegExp(`\\[${leg}\\]`, 'g'), `[${neo}]`);
    s = s.replace(new RegExp(leg, 'g'), neo);
  }
  return s;
}

const reg = JSON.parse(fs.readFileSync(REG_PATH, 'utf8'));
const state = JSON.parse(fs.readFileSync(BATCH_PATH, 'utf8'));

const newCards = {};
for (const [op, entry] of Object.entries(reg.items)) {
  const neoKey = entry.plane_key;
  newCards[neoKey] = {
    operacao: op,
    status: entry.automation_status === 'done' ? 'done' : 'pending',
    plane_legacy_key: entry.plane_legacy_key,
    card_title: entry.card_name,
    workflow_id_n8n: entry.workflow_id_n8n,
    gates: { vault: true, workflow: true, push: true, postman: true },
  };
}

state.batches['ccn-1-3'] = {
  batch_id: 'ccn-1-3',
  plane_project: 'autccn',
  plane_identifier: 'AUTCCN',
  started_at: new Date().toISOString(),
  completed_at: new Date().toISOString(),
  context_root: state.batches['rib-1-36']?.context_root || 'c:\\Users\\kenio\\automacoes e testes',
  workflows_path: 'workflows/n8n/extensao-n8n-teste',
  integration: 'ccn',
  postman_collection: 'postman/CCN-Upload-XML-n8n.postman_collection.json',
  range: { from: 'AUTCCN-1', to: 'AUTCCN-3' },
  status: 'complete',
  cards: newCards,
};

fs.writeFileSync(BATCH_PATH, JSON.stringify(state, null, 2) + '\n');
console.log('updated batch ccn-1-3 with', Object.keys(newCards).length, 'cards');
