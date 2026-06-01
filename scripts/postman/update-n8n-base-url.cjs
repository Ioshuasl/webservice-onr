#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '../../postman');
const oldUrl = 'https://n8n.ioshuavps.com.br';
const newUrl = 'https://api-n8n.gbrqne.easypanel.host';
const authUser = 'orius';
const authPass = 'master@orius';

function patch(content) {
  let s = content.split(oldUrl).join(newUrl);
  s = s.replace(
    /"key": "N8N_BASIC_AUTH_USER",\s*\n\s*"value": ""/g,
    `"key": "N8N_BASIC_AUTH_USER",\n      "value": "${authUser}"`
  );
  s = s.replace(
    /"key": "N8N_BASIC_AUTH_PASSWORD",\s*\n\s*"value": ""/g,
    `"key": "N8N_BASIC_AUTH_PASSWORD",\n      "value": "${authPass}"`
  );
  s = s.replace(
    /\{ "key": "N8N_BASIC_AUTH_USER", "value": "",/g,
    `{ "key": "N8N_BASIC_AUTH_USER", "value": "${authUser}",`
  );
  s = s.replace(
    /\{ "key": "N8N_BASIC_AUTH_PASSWORD", "value": "",/g,
    `{ "key": "N8N_BASIC_AUTH_PASSWORD", "value": "${authPass}",`
  );
  return s;
}

for (const name of fs.readdirSync(root)) {
  if (!name.endsWith('.json') || name === 'n8n-orius.postman_environment.json') continue;
  const file = path.join(root, name);
  const orig = fs.readFileSync(file, 'utf8');
  const next = patch(orig);
  if (next !== orig) {
    fs.writeFileSync(file, next);
    console.log('updated', name);
  }
}
