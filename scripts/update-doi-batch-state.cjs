#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const { DOMAIN_BATCH_FILES } = require('./batch-state-paths.cjs');

const BATCH_PATH = DOMAIN_BATCH_FILES.autdoi.file;
const REG_PATH = path.join(
  process.env.USERPROFILE || '',
  'Obsidian Vault/Meta/integracoes/plane/maps/autdoi-work-items.json',
);

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

state.batches['doi-1'] = {
  batch_id: 'doi-1',
  plane_project: 'autdoi',
  plane_identifier: 'AUTDOI',
  started_at: new Date().toISOString(),
  completed_at: new Date().toISOString(),
  context_root: state.batches['ccn-1-3']?.context_root || 'c:\\Users\\kenio\\automacoes e testes',
  workflows_path: 'workflows/n8n/extensao-n8n-teste',
  integration: 'doi',
  postman_collection: 'postman/DOI-Validate-JSON-n8n.postman_collection.json',
  range: { from: 'AUTDOI-1', to: 'AUTDOI-1' },
  status: 'complete',
  cards: newCards,
};

fs.writeFileSync(BATCH_PATH, JSON.stringify(state, null, 2) + '\n');
console.log('updated batch doi-1 with', Object.keys(newCards).length, 'cards');
