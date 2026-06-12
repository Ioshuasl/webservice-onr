#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const BATCH_PATH = path.join(__dirname, 'autonr-batch-state.json');
const state = JSON.parse(fs.readFileSync(BATCH_PATH, 'utf8'));
const old = state.batches['cra-127-142'];
if (!old) {
  console.error('cra-127-142 batch not found');
  process.exit(1);
}

const LEGACY_TO_SEQ = {};
for (let i = 127; i <= 142; i++) LEGACY_TO_SEQ[`AUTONR-${i}`] = `AUTOCRA-${i - 126}`;

function migrateTitle(t) {
  let s = t.replace(/\(webservice CRA\)/g, '(cra)');
  for (const [leg, neo] of Object.entries(LEGACY_TO_SEQ)) {
    s = s.replace(new RegExp(`\\[${leg}\\]`, 'g'), `[${neo}]`);
    s = s.replace(new RegExp(leg, 'g'), neo);
  }
  return s;
}

const newCards = {};
for (const [legKey, card] of Object.entries(old.cards)) {
  const neoKey = LEGACY_TO_SEQ[legKey];
  newCards[neoKey] = {
    ...card,
    plane_legacy_key: legKey,
    card_title: migrateTitle(card.card_title),
  };
}

const newBatch = {
  ...old,
  batch_id: 'cra-1-16',
  plane_project: 'autocra',
  plane_identifier: 'AUTOCRA',
  integration: 'cra',
  range: { from: 'AUTOCRA-1', to: 'AUTOCRA-16' },
  execution_order: old.execution_order.map((k) => LEGACY_TO_SEQ[k]),
  cards: newCards,
};

delete state.batches['cra-127-142'];
state.batches['cra-1-16'] = newBatch;
fs.writeFileSync(BATCH_PATH, JSON.stringify(state, null, 2) + '\n');
console.log('updated batch cra-1-16');
