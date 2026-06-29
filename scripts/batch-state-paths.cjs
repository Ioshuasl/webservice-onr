/**
 * Um arquivo batch-state por domínio Plane (AUTONR, AUTOCRA, AUTCNIB, …).
 * Fonte única para orquestrador, ensure-batch-domain e sync-batch-orchestrator-skill-docs.
 */
const path = require('path');

const ROOT = path.join(__dirname);

/** @type {Record<string, {
 *   file: string,
 *   plane_identifier: string,
 *   batch_id_prefix: string,
 *   label: string,
 *   registry: string,
 *   plane_slug: string,
 *   integration: string,
 *   upstream: string,
 *   resolver_patterns?: string[]
 * }>} */
const DOMAIN_BATCH_FILES = {
  autonr: {
    file: path.join(ROOT, 'autonr-batch-state.json'),
    plane_identifier: 'AUTONR',
    batch_id_prefix: 'onr-',
    label: 'ONR WSOficio',
    registry: 'autonr-work-items.json',
    plane_slug: 'autonr',
    integration: 'onr',
    upstream: 'SOAP/XML',
    resolver_patterns: ['wsoficio', 'webservice onr'],
  },
  autocra: {
    file: path.join(ROOT, 'autcra-batch-state.json'),
    plane_identifier: 'AUTOCRA',
    batch_id_prefix: 'cra-',
    label: 'CRA21 SOAP',
    registry: 'autocra-work-items.json',
    plane_slug: 'autocra',
    integration: 'cra',
    upstream: 'SOAP/XML',
    resolver_patterns: ['cra-127', 'webservice cra'],
  },
  autcnib: {
    file: path.join(ROOT, 'autcnib-batch-state.json'),
    plane_identifier: 'AUTCNIB',
    batch_id_prefix: 'cnib-',
    label: 'CNIB',
    registry: 'autcnib-work-items.json',
    plane_slug: 'autcnib',
    integration: 'cnib',
    upstream: 'REST/JSON',
    resolver_patterns: ['serventia-api'],
  },
  autorib: {
    file: path.join(ROOT, 'autorib-batch-state.json'),
    plane_identifier: 'AUTORIB',
    batch_id_prefix: 'rib-',
    label: 'RIB',
    registry: 'autorib-work-items.json',
    plane_slug: 'autorib',
    integration: 'rib',
    upstream: 'REST/JSON',
  },
  autccn: {
    file: path.join(ROOT, 'autccn-batch-state.json'),
    plane_identifier: 'AUTCCN',
    batch_id_prefix: 'ccn-',
    label: 'CCN',
    registry: 'autccn-work-items.json',
    plane_slug: 'autccn',
    integration: 'ccn',
    upstream: 'REST (futuro)',
    resolver_patterns: ['e-notariado'],
  },
  autdoi: {
    file: path.join(ROOT, 'autdoi-batch-state.json'),
    plane_identifier: 'AUTDOI',
    batch_id_prefix: 'doi-',
    label: 'DOI',
    registry: 'autdoi-work-items.json',
    plane_slug: 'autdoi',
    integration: 'doi',
    upstream: 'REST (futuro)',
  },
  autcensec: {
    file: path.join(ROOT, 'autcensec-batch-state.json'),
    plane_identifier: 'AUTCENSEC',
    batch_id_prefix: 'censec-',
    label: 'CENSEC',
    registry: 'autcensec-work-items.json',
    plane_slug: 'autcensec',
    integration: 'censec',
    upstream: 'REST/JSON',
  },
  autcrc: {
    file: path.join(ROOT, 'autcrc-batch-state.json'),
    plane_identifier: 'AUTCRC',
    batch_id_prefix: 'crc-',
    label: 'CRC',
    registry: 'autcrc-work-items.json',
    plane_slug: 'autcrc',
    integration: 'crc',
    upstream: 'REST (futuro)',
  },
  autsirc: {
    file: path.join(ROOT, 'autsirc-batch-state.json'),
    plane_identifier: 'AUTSIRC',
    batch_id_prefix: 'sirc-',
    label: 'SIRC',
    registry: 'autsirc-work-items.json',
    plane_slug: 'autsirc',
    integration: 'sirc',
    upstream: 'REST (futuro)',
  },
  autseetjgo: {
    file: path.join(ROOT, 'autseetjgo-batch-state.json'),
    plane_identifier: 'AUTSEETJGO',
    batch_id_prefix: 'seetjgo-',
    label: 'SEE TJGO',
    registry: 'autseetjgo-work-items.json',
    plane_slug: 'autseetjgo',
    integration: 'see tjgo',
    upstream: 'REST/JSON',
    resolver_patterns: ["see tjgo"],
  },
  autenot: {
    file: path.join(ROOT, 'autenot-batch-state.json'),
    plane_identifier: 'AUTENOT',
    batch_id_prefix: 'enot-',
    label: 'E-Notariado Fluxo Assinaturas',
    registry: 'autenot-work-items.json',
    plane_slug: 'autenot',
    integration: 'enot',
    upstream: 'REST/JSON',
    resolver_patterns: ['fluxo de assinaturas', 'e-not assina', 'autenot'],
  },
};

function resolveDomainFromBatch(batch) {
  const id = batch.plane_identifier;
  if (id) {
    const hit = Object.values(DOMAIN_BATCH_FILES).find((d) => d.plane_identifier === id);
    if (hit) return hit;
  }
  const batchId = batch.batch_id || '';
  const byPrefix = Object.values(DOMAIN_BATCH_FILES).find((d) =>
    batchId.startsWith(d.batch_id_prefix)
  );
  return byPrefix || DOMAIN_BATCH_FILES.autonr;
}

function relativePath(absPath) {
  return path.relative(path.join(ROOT, '..'), absPath).replace(/\\/g, '/');
}

function findByPlaneIdentifier(planeIdentifier) {
  return Object.entries(DOMAIN_BATCH_FILES).find(
    ([, m]) => m.plane_identifier === planeIdentifier
  );
}

module.exports = {
  DOMAIN_BATCH_FILES,
  resolveDomainFromBatch,
  relativePath,
  findByPlaneIdentifier,
};
