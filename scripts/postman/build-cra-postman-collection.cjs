#!/usr/bin/env node
/**
 * Gera postman/cra-webservice-n8n.postman_collection.json e environment template.
 * Uso: node scripts/postman/build-cra-postman-collection.cjs
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { formatAutonrRequestName } = require('./postman-request-naming.cjs');

const ROOT = path.resolve(__dirname, '..', '..');
const SOAP_DIR = path.join(ROOT, 'scripts', 'cra', 'soap-requests');
const OUT_COLLECTION = path.join(ROOT, 'postman', 'cra-webservice-n8n.postman_collection.json');
const OUT_ENV = path.join(ROOT, 'postman', 'cra-webservice-n8n.postman_environment.template.json');

const OPS = [
  { autonr: 127, operacao: 'Remessa', soapOp: 'Remessa', dominio: 'Remessa', grupo: 'upload', label: 'Remessa' },
  { autonr: 128, operacao: 'Confirmacao', soapOp: 'Confirmacao', dominio: 'Confirmação', grupo: 'download', label: 'Confirmação' },
  { autonr: 129, operacao: 'Retorno', soapOp: 'Retorno', dominio: 'Retorno', grupo: 'download', label: 'Retorno' },
  { autonr: 130, operacao: 'Desistencia', soapOp: 'Desistencia', dominio: 'Desistência', grupo: 'upload', label: 'Desistência' },
  { autonr: 131, operacao: 'Cancelamento', soapOp: 'Cancelamento', dominio: 'Cancelamento', grupo: 'upload', label: 'Cancelamento' },
  { autonr: 132, operacao: 'Autoriza_Cancelamento', soapOp: 'Autoriza_Cancelamento', dominio: 'Autorização', grupo: 'upload', label: 'Autoriza cancelamento' },
  { autonr: 133, operacao: 'Autoriza_Desistencia', soapOp: 'Autoriza_Desistencia', dominio: 'Autorização', grupo: 'upload', label: 'Autoriza desistência' },
  { autonr: 134, operacao: 'Homologadas', soapOp: 'Homologadas', dominio: 'Homologação', grupo: 'download', label: 'Homologadas' },
  { autonr: 135, operacao: 'Consulta', soapOp: 'Consulta', dominio: 'Consulta', grupo: 'consulta', label: 'Consulta título' },
  { autonr: 136, operacao: 'Consulta_Slip', soapOp: 'Consulta_Slip', dominio: 'Consulta', grupo: 'consulta', label: 'Consulta slip' },
  { autonr: 137, operacao: 'Instrumento', soapOp: 'Instrumento', dominio: 'Instrumento', grupo: 'download', label: 'Instrumento' },
  { autonr: 138, operacao: 'Imagem', soapOp: 'Imagem', dominio: 'Imagens', grupo: 'upload', label: 'Imagem' },
  { autonr: 139, operacao: 'BoletoAutorizacao', soapOp: 'BoletoAutorizacao', dominio: 'Autorização', grupo: 'download', label: 'Boleto autorização' },
  { autonr: 140, operacao: 'Andamento', soapOp: 'Andamento', dominio: 'Andamento', grupo: 'download', label: 'Andamento' },
  { autonr: 141, operacao: 'Oficio_Titulo', soapOp: 'Oficio_Titulo', dominio: 'Ofício', grupo: 'upload', label: 'Ofício título' },
  { autonr: 142, operacao: 'ConsultaJustificativa', soapOp: 'ConsultaJustificativa', dominio: 'Consulta', grupo: 'consulta', label: 'Consulta justificativas' },
];

const GRUPO_LABEL = {
  upload: 'Upload',
  download: 'Download',
  consulta: 'Consulta',
};

const COLLECTION_PREREQUEST = [
  'function getVar(key) {',
  '  const fromEnv = pm.environment.get(key);',
  '  if (fromEnv !== undefined && fromEnv !== null && String(fromEnv).length > 0) return fromEnv;',
  '  const fromCollection = pm.collectionVariables.get(key);',
  '  if (fromCollection !== undefined && fromCollection !== null && String(fromCollection).length > 0) return fromCollection;',
  '  return pm.variables.get(key);',
  '}',
  '',
  'const uf = String(getVar("CRA_UF") || "go").toLowerCase();',
  'const amb = String(getVar("CRA_AMBIENTE") || "homologacao").toLowerCase();',
  'const prod = amb === "producao";',
  'const host = prod ? `cra${uf}.crabr.com.br` : `cra${uf}.cra21.com.br`;',
  'const base = `https://${host}/cra${uf}/xml/protestos.php`;',
  'pm.collectionVariables.set("CRA_UF", uf);',
  'pm.collectionVariables.set("cra_soap_url", base);',
  'pm.collectionVariables.set("cra_wsdl_url", `${base}?wsdl`);',
  'pm.collectionVariables.set("cra_soap_namespace", prod ? `urn:cra${uf}.crabr.com.br` : `urn:cra${uf}.cra21.com.br`);',
];

const SOAP_TEST_SCRIPT = [
  'pm.test("HTTP 200", () => pm.response.to.have.status(200));',
  'const body = pm.response.text();',
  'pm.test("Resposta XML", () => {',
  '  pm.expect(body.length).to.be.above(0);',
  '});',
  'if (body.includes("0001") && /AUTENTIC/i.test(body)) {',
  '  console.warn("Possível falha de autenticação CRA (código 0001)");',
  '}',
];

function readSoapBody(soapOp) {
  const file = path.join(SOAP_DIR, `${soapOp}.xml`);
  if (!fs.existsSync(file)) throw new Error(`XML ausente: ${file}`);
  return fs.readFileSync(file, 'utf8');
}

function soapRequest(op) {
  const body = readSoapBody(op.soapOp);
  return {
    name: formatAutonrRequestName(`AUTONR-${op.autonr}`, `${op.label} — SOAP direto`),
    event: [
      {
        listen: 'prerequest',
        script: {
          type: 'text/javascript',
          exec: [
            `pm.variables.set("cra_soap_action", pm.collectionVariables.get("cra_soap_namespace") + "#${op.soapOp}");`,
          ],
        },
      },
      {
        listen: 'test',
        script: { type: 'text/javascript', exec: SOAP_TEST_SCRIPT },
      },
    ],
    request: {
      auth: {
        type: 'basic',
        basic: [
          { key: 'username', value: '{{CRA_USER}}', type: 'string' },
          { key: 'password', value: '{{CRA_PASS}}', type: 'string' },
        ],
      },
      method: 'POST',
      header: [
        { key: 'Content-Type', value: 'text/xml; charset=ISO-8859-1' },
        { key: 'SOAPAction', value: '{{cra_soap_action}}' },
      ],
      body: { mode: 'raw', raw: body },
      url: '{{cra_soap_url}}',
      description: `SOAP direto CRA21 — operação **${op.soapOp}** (AUTONR-${op.autonr}).\n\nXML fonte: \`scripts/cra/soap-requests/${op.soapOp}.xml\`\n\nVault: \`Orius/integracoes/tabelionato-protesto/cra/webservice-soap/automacao/utilizacao/${op.operacao}.md\``,
    },
  };
}

function n8nRequest(op) {
  const slug = op.operacao.replace(/_/g, '-').toLowerCase();
  return {
    name: formatAutonrRequestName(`AUTONR-${op.autonr}`, op.label),
    request: {
      auth: {
        type: 'basic',
        basic: [
          { key: 'username', value: '{{N8N_BASIC_AUTH_USER}}', type: 'string' },
          { key: 'password', value: '{{N8N_BASIC_AUTH_PASSWORD}}', type: 'string' },
        ],
      },
      method: 'POST',
      header: [{ key: 'Content-Type', value: 'application/json' }],
      body: {
        mode: 'raw',
        raw: JSON.stringify(
          {
            operacao: op.soapOp,
            user_arq: 'B0000101.251',
            user_dados: '<!-- XML conforme layout CRA -->',
            nota: 'Payload inicial — ajustar quando o workflow n8n existir',
          },
          null,
          2,
        ),
      },
      url: '{{n8n_base_url}}/{{n8n_webhook_mode}}/cra/{{cra_webhook_path_' + slug + '}}',
      description: `Proxy n8n **pendente** — workflow \`[AUTONR-${op.autonr}] (webservice CRA) ${op.soapOp} - ${op.dominio}\`.\n\nDefina \`cra_webhook_path_${slug}\` quando o webhook existir.`,
    },
  };
}

function buildSoapFolder() {
  const byGrupo = {};
  for (const op of OPS) {
    if (!byGrupo[op.grupo]) byGrupo[op.grupo] = [];
    byGrupo[op.grupo].push(soapRequest(op));
  }
  return {
    name: 'SOAP direto (referência)',
    description: 'Chamadas SOAP nativas ao `protestos.php` — HTTP Basic CRA. Preferir **n8n — proxy CRA** quando os workflows existirem.',
    item: ['upload', 'download', 'consulta'].map((g) => ({
      name: GRUPO_LABEL[g],
      item: byGrupo[g],
    })),
  };
}

function buildN8nFolder() {
  const byGrupo = {};
  for (const op of OPS) {
    if (!byGrupo[op.grupo]) byGrupo[op.grupo] = [];
    byGrupo[op.grupo].push(n8nRequest(op));
  }
  return {
    name: 'n8n — proxy CRA',
    description: 'Webhooks n8n (HTTP→SOAP). Paths e IDs serão preenchidos na implementação dos workflows AUTONR-127…142.',
    item: ['upload', 'download', 'consulta'].map((g) => ({
      name: GRUPO_LABEL[g],
      item: byGrupo[g],
    })),
  };
}

function collectionVariables() {
  const base = [
    { key: 'CRA_UF', value: 'go', type: 'string' },
    { key: 'CRA_AMBIENTE', value: 'homologacao', type: 'string' },
    { key: 'CRA_USER', value: '', type: 'string' },
    { key: 'CRA_PASS', value: '', type: 'string' },
    { key: 'cra_soap_url', value: 'https://crago.cra21.com.br/crago/xml/protestos.php', type: 'string' },
    { key: 'cra_wsdl_url', value: 'https://crago.cra21.com.br/crago/xml/protestos.php?wsdl', type: 'string' },
    { key: 'cra_soap_namespace', value: 'urn:crago.cra21.com.br', type: 'string' },
    { key: 'n8n_base_url', value: 'https://api-n8n.gbrqne.easypanel.host', type: 'string' },
    { key: 'N8N_BASE_URL', value: 'https://api-n8n.gbrqne.easypanel.host', type: 'string' },
    { key: 'n8n_webhook_mode', value: 'webhook-test', type: 'string' },
    { key: 'N8N_BASIC_AUTH_USER', value: 'orius', type: 'string' },
    { key: 'N8N_BASIC_AUTH_PASSWORD', value: 'master@orius', type: 'string' },
  ];
  for (const op of OPS) {
    const slug = op.operacao.replace(/_/g, '-').toLowerCase();
    base.push({
      key: `cra_webhook_path_${slug}`,
      value: `cra/${slug}`,
      type: 'string',
    });
    base.push({
      key: `n8n_workflow_id_${slug}`,
      value: '',
      type: 'string',
    });
  }
  return base;
}

function buildCollection() {
  const autonrTable = OPS.map(
    (o) => `| ${o.autonr} | ${o.soapOp} | ${o.dominio} |`,
  ).join('\n');

  return {
    info: {
      _postman_id: crypto.randomUUID(),
      name: 'cra webservice - n8n',
      description: `Coleção para testar o **webservice SOAP CRA21** (protestos) — proxy n8n e SOAP direto.\n\n## Workflows (AUTONR-127…142)\n\n| AUTONR | Operação | Domínio |\n|--------|----------|--------|\n${autonrTable}\n\n## Pastas\n\n| Pasta | Uso |\n|-------|-----|\n| **SOAP direto (referência)** | POST \`protestos.php\` com Basic Auth CRA — funciona hoje |\n| **n8n — proxy CRA** | Webhooks HTTP→SOAP — preencher quando workflows existirem |\n\n## Pré-requisitos (SOAP direto)\n\n1. \`CRA_USER\` / \`CRA_PASS\` / \`CRA_UF\` — vault \`env#CRA21\`\n2. \`CRA_AMBIENTE\`: \`homologacao\` (\`cra21.com.br\`) ou \`producao\` (\`crabr.com.br\`)\n3. Ajustar XML em \`scripts/cra/soap-requests/*.xml\` antes de testes reais\n\n## URLs CRA\n\n| Ambiente | SOAP |\n|----------|------|\n| Homologação | \`https://cra{uf}.cra21.com.br/cra{uf}/xml/protestos.php\` |\n| Produção | \`https://cra{uf}.crabr.com.br/cra{uf}/xml/protestos.php\` |\n\n## Regenerar\n\n\`\`\`bash\nnpm run postman:build:cra\n\`\`\`\n\nScript: \`scripts/postman/build-cra-postman-collection.cjs\`\n\n## Referências\n\n- Vault: \`Orius/integracoes/tabelionato-protesto/cra/webservice-soap/automacao/roadmap-cra-webservice-n8n\`\n- XML requests: \`scripts/cra/soap-requests/\``,
      schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
    },
    auth: {
      type: 'noauth',
    },
    variable: collectionVariables(),
    event: [
      {
        listen: 'prerequest',
        script: { type: 'text/javascript', exec: COLLECTION_PREREQUEST },
      },
    ],
    item: [buildSoapFolder(), buildN8nFolder()],
  };
}

function buildEnvironment() {
  return {
    id: 'cra-webservice-n8n-template',
    name: 'cra webservice - n8n (template)',
    values: [
      { key: 'CRA_UF', value: 'go', type: 'default', enabled: true },
      { key: 'CRA_AMBIENTE', value: 'homologacao', type: 'default', enabled: true },
      { key: 'CRA_USER', value: '', type: 'secret', enabled: true },
      { key: 'CRA_PASS', value: '', type: 'secret', enabled: true },
      { key: 'cra_soap_url', value: 'https://crago.cra21.com.br/crago/xml/protestos.php', type: 'default', enabled: true },
      { key: 'cra_wsdl_url', value: 'https://crago.cra21.com.br/crago/xml/protestos.php?wsdl', type: 'default', enabled: true },
      { key: 'cra_soap_namespace', value: 'urn:crago.cra21.com.br', type: 'default', enabled: true },
      { key: 'n8n_base_url', value: 'https://api-n8n.gbrqne.easypanel.host', type: 'default', enabled: true },
      { key: 'N8N_BASE_URL', value: 'https://api-n8n.gbrqne.easypanel.host', type: 'default', enabled: true },
      { key: 'n8n_webhook_mode', value: 'webhook-test', type: 'default', enabled: true },
      { key: 'N8N_BASIC_AUTH_USER', value: 'orius', type: 'secret', enabled: true },
      { key: 'N8N_BASIC_AUTH_PASSWORD', value: 'master@orius', type: 'secret', enabled: true },
    ],
    _postman_variable_scope: 'environment',
    _postman_exported_at: new Date().toISOString(),
    _postman_exported_using: 'automacoes-e-testes',
  };
}

function main() {
  fs.writeFileSync(OUT_COLLECTION, `${JSON.stringify(buildCollection(), null, 2)}\n`, 'utf8');
  fs.writeFileSync(OUT_ENV, `${JSON.stringify(buildEnvironment(), null, 2)}\n`, 'utf8');
  console.log('OK:', path.relative(ROOT, OUT_COLLECTION));
  console.log('OK:', path.relative(ROOT, OUT_ENV));
}

main();
