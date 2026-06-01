'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '../..');
const snippet = fs.readFileSync(path.join(__dirname, 'ccn-xml-validation-snippet.js'), 'utf8');
const wfPath = path.join(root, 'workflows/n8n/extensao-n8n-teste/CCN Upload XML.workflow.ts');
let wf = fs.readFileSync(wfPath, 'utf8');

const startMarker = '        jsCode: `\nconst item = $input.first();';
const endMarker = '`,\n    };\n\n    @node({\n        id: \'cbb53dc1';

const start = wf.indexOf(startMarker);
const end = wf.indexOf(endMarker, start);
if (start < 0 || end < 0) {
  console.error('Markers not found in workflow file');
  process.exit(1);
}

const escaped = snippet.replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
const replacement = `        jsCode: \`\n${escaped}\`,`;

wf = wf.slice(0, start) + replacement + wf.slice(end);
fs.writeFileSync(wfPath, wf, 'utf8');
console.log('Updated', wfPath);
