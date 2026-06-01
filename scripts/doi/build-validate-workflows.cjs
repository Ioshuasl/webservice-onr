/**
 * Regenera workflows n8n (DOI Validate JSON + CTP no gateway CENSEC).
 * Uso: node scripts/doi/build-validate-workflows.cjs
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.resolve(__dirname, '../..');

execSync('node scripts/doi/build-n8n-validate-snippet.cjs', { cwd: root, stdio: 'inherit' });

function escapeForTemplateLiteral(code) {
  return code.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
}

function readSnippet(name) {
  return fs.readFileSync(path.join(root, 'scripts/doi', name), 'utf8');
}

function extractWorkflowMeta(content) {
  const idMatch = content.match(/@workflow\(\{[\s\S]*?id:\s*'([^']+)'/);
  const activeMatch = content.match(/active:\s*(true|false)/);
  return {
    id: idMatch ? idMatch[1] : null,
    active: activeMatch ? activeMatch[1] === 'true' : false,
  };
}

function extractNodeIds(content) {
  const ids = {};
  const re = /@node\(\{[\s\S]*?id:\s*'([^']+)'[\s\S]*?name:\s*'([^']+)'/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    ids[m[2]] = m[1];
  }
  return ids;
}

function patchCtpNode(filePath, snippet) {
  const content = fs.readFileSync(filePath, 'utf8');
  const re = /(ValidateCtpDeclarations = \{\s*mode: 'runOnceForAllItems',\s*language: 'javaScript',\s*jsCode: `)[\s\S]*?(`,\s*\};)/;
  if (!re.test(content)) {
    throw new Error('ValidateCtpDeclarations block not found in ' + filePath);
  }
  const escaped = escapeForTemplateLiteral(snippet.trim());
  const next = content.replace(re, `$1\n${escaped}\n$2`);
  fs.writeFileSync(filePath, next, 'utf8');
  console.log('Patched CTP node in', filePath);
}

function buildDoiWorkflow() {
  const outPath = path.join(root, 'workflows/n8n/extensao-n8n-teste/DOI Validate JSON.workflow.ts');
  const existing = fs.existsSync(outPath) ? fs.readFileSync(outPath, 'utf8') : '';
  const meta = extractWorkflowMeta(existing);
  const nodeIds = extractNodeIds(existing);
  const validateJs = escapeForTemplateLiteral(readSnippet('doi-validate-n8n-snippet.js'));

  const workflowId = meta.id ? `\n    id: '${meta.id}',` : '';
  const active = meta.active;

  const nodeId = (name, fallback) => (nodeIds[name] ? `\n        id: '${nodeIds[name]}',` : '');

  const workflow = `import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : DOI Validate JSON
// Nodes   : 5  |  Connections: 4
//
// NODE INDEX
// Property name                    Node type (short)         Flags
// ReceiveDoiPayload                webhook
// NormalizePayload                 code
// ValidateDoiDeclarations          code
// BuildValidationResponse            code
// ReturnValidationResponse           respondToWebhook
//
// ROUTING MAP
// ReceiveDoiPayload
//   -> NormalizePayload
//     -> ValidateDoiDeclarations
//       -> BuildValidationResponse
//         -> ReturnValidationResponse
// </workflow-map>

@workflow({${workflowId}
  name: 'DOI Validate JSON',
  active: ${active},
  isArchived: false,
  settings: {
    executionOrder: 'v1',
    availableInMCP: false,
    callerPolicy: 'workflowsFromSameOwner',
  },
})
export class DoiValidateJsonWorkflow {
  @node({${nodeId('Receive DOI Payload')}
    name: 'Receive DOI Payload',
    type: 'n8n-nodes-base.webhook',
    version: 2.1,
    position: [0, 300],
  })
  ReceiveDoiPayload = {
    httpMethod: 'POST',
    path: 'doi/validate-json',
    authentication: 'none',
    responseMode: 'responseNode',
    options: {},
  };

  @node({${nodeId('Normalize Payload')}
    name: 'Normalize Payload',
    type: 'n8n-nodes-base.code',
    version: 2,
    position: [280, 300],
  })
  NormalizePayload = {
    mode: 'runOnceForAllItems',
    language: 'javaScript',
    jsCode: \`
const input = items[0]?.json ?? {};
const payload = input.body && typeof input.body === 'object' && !Array.isArray(input.body)
  ? input.body
  : input;

return [{
  json: {
    payload,
    validation: {
      errors: [],
      warnings: [],
      hasErrors: false,
      declarationCount: 0,
    },
    meta: {
      receivedAt: new Date().toISOString(),
      source: 'n8n-doi-validate-json',
      sistema: 'DOI-Web',
      produtos: ['Tabelionato de Notas', 'Registro de Imoveis'],
      fonteRegras: 'Obsidian doi/campos-json + tabelas-dominio + regras-validacao',
    },
  },
}];
\`,
  };

  @node({${nodeId('Validate DOI Declarations')}
    name: 'Validate DOI Declarations',
    type: 'n8n-nodes-base.code',
    version: 2,
    position: [560, 300],
  })
  ValidateDoiDeclarations = {
    mode: 'runOnceForAllItems',
    language: 'javaScript',
    jsCode: \`
${validateJs}
\`,
  };

  @node({${nodeId('Build Validation Response')}
    name: 'Build Validation Response',
    type: 'n8n-nodes-base.code',
    version: 2,
    position: [840, 300],
  })
  BuildValidationResponse = {
    mode: 'runOnceForAllItems',
    language: 'javaScript',
    jsCode: \`
const data = items[0].json;
const ok = !data.validation.hasErrors;
return [{
  json: {
    statusCode: ok ? 200 : 400,
    response: {
      success: ok,
      valid: ok,
      message: ok
        ? 'Payload DOI valido na validacao local (sem envio ao DOI-Web).'
        : 'Payload DOI rejeitado pela validacao local.',
      declarationCount: data.validation.declarationCount ?? 0,
      errorCount: data.validation.errors.length,
      warningCount: data.validation.warnings.length,
      errors: data.validation.errors,
      warnings: data.validation.warnings,
      meta: data.meta,
    },
  },
}];
\`,
  };

  @node({${nodeId('Return Validation Response')}
    name: 'Return Validation Response',
    type: 'n8n-nodes-base.respondToWebhook',
    version: 1.5,
    position: [1120, 300],
  })
  ReturnValidationResponse = {
    respondWith: 'json',
    responseBody: '={{ $json.response }}',
    options: {
      responseCode: '={{ $json.statusCode || 200 }}',
    },
  };

  @links()
  defineRouting() {
    this.ReceiveDoiPayload.out(0).to(this.NormalizePayload.in(0));
    this.NormalizePayload.out(0).to(this.ValidateDoiDeclarations.in(0));
    this.ValidateDoiDeclarations.out(0).to(this.BuildValidationResponse.in(0));
    this.BuildValidationResponse.out(0).to(this.ReturnValidationResponse.in(0));
  }
}
`;

  fs.writeFileSync(outPath, workflow, 'utf8');
  console.log('Wrote', outPath);
}

buildDoiWorkflow();

const ctpSnippet = readSnippet('censec-ctp-validate-n8n-snippet.js');
[
  'workflows/n8n/extensao-n8n-teste/CENSEC Upload JSON Gateway.workflow.ts',
  'workflows/n8n-censec/censec-upload-json.workflow.ts',
].forEach((rel) => patchCtpNode(path.join(root, rel), ctpSnippet));

console.log('Done. Run doi-validate-payload.cjs on exemplo-doi-valido.json to smoke-test.');
