#!/usr/bin/env node
/**
 * Aplica domínios v2 + triage T0 do ri-roadmap-v2.md ao ecosystem imoveis.
 *
 * Uso:
 *   node scripts/apply-roadmap-v2-ecosystem.cjs --product-slug imoveis
 *   node scripts/apply-roadmap-v2-ecosystem.cjs --product-slug imoveis --dry-run
 */
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.join(__dirname, '..');

const NEW_TRIAGE_RULES = [
  { glob: '**/*.old/**', tier: 'T0', action: 'skip' },
  { glob: '**/wsEmail.old/**', tier: 'T0', action: 'skip' },
  { glob: '**/*baguncado*', tier: 'T0', action: 'skip' },
  { glob: '**/ultimo feito/**', tier: 'T0', action: 'skip' },
  { glob: '**/*_old.*', tier: 'T0', action: 'skip' },
  { glob: '**/wsInterface.pas', tier: 'T4', action: 'stub' },
];

const PREFIX = 'RegistroDeImoveis/';

const RI_ERIDF_PROD_ORDER = [
  `${PREFIX}eridf/wsConsultarProtocolo/teste.pas`,
  `${PREFIX}eridf/wsConsultarProtocolo/wsImplementacao.pas`,
  `${PREFIX}eridf/wsConsultarProtocolo/wsInterface.pas`,
  `${PREFIX}eridf/wsConsultarProtocolo/wsWebModule.pas`,
  `${PREFIX}eridf/wsERIDF/teste.pas`,
  `${PREFIX}eridf/wsERIDF/wsCertidao.pas`,
  `${PREFIX}eridf/wsERIDF/wsHistorico.pas`,
  `${PREFIX}eridf/wsERIDF/wsImplementacao.pas`,
  `${PREFIX}eridf/wsERIDF/wsInterface.pas`,
  `${PREFIX}eridf/wsERIDF/wsOficio.pas`,
  `${PREFIX}eridf/wsERIDF/wsPedido.pas`,
  `${PREFIX}eridf/wsERIDF/wsRealPessoal.pas`,
  `${PREFIX}eridf/wsERIDF/wsRelatorio.pas`,
  `${PREFIX}eridf/wsERIDF/wsSoapDM.pas`,
  `${PREFIX}eridf/wsERIDF/wsUsuario.pas`,
  `${PREFIX}eridf/wsERIDF/wsWebModule.pas`,
  `${PREFIX}eridf/wsERIDF_Auxiliar/teste.pas`,
  `${PREFIX}eridf/wsERIDF_Auxiliar/wsImplementacao.pas`,
  `${PREFIX}eridf/wsERIDF_Auxiliar/wsInterface.pas`,
  `${PREFIX}eridf/wsERIDF_Auxiliar/wsPrincipal.pas`,
  `${PREFIX}eridf/wsERIDF_Auxiliar/wsWebModule.pas`,
  `${PREFIX}eridf/wsERIDF_Cloud/dmBoletoCloud.pas`,
  `${PREFIX}eridf/wsERIDF_Cloud/teste.pas`,
  `${PREFIX}eridf/wsERIDF_Cloud/wsImplementacao.pas`,
  `${PREFIX}eridf/wsERIDF_Cloud/wsInterface.pas`,
  `${PREFIX}eridf/wsERIDF_Cloud/wsIntimacao.pas`,
  `${PREFIX}eridf/wsERIDF_Cloud/wsPedido.pas`,
  `${PREFIX}eridf/wsERIDF_Cloud/wsRelatorio.pas`,
  `${PREFIX}eridf/wsERIDF_Cloud/wsUsuarioOnline.pas`,
  `${PREFIX}eridf/wsERIDF_Cloud/wsWebModule.pas`,
  `${PREFIX}eridf/wsERIDF_TerraRural/teste.pas`,
  `${PREFIX}eridf/wsERIDF_TerraRural/wsImplementacao.pas`,
  `${PREFIX}eridf/wsERIDF_TerraRural/wsInterface.pas`,
  `${PREFIX}eridf/wsERIDF_TerraRural/wsTerraRural.pas`,
  `${PREFIX}eridf/wsERIDF_TerraRural/wsTraslado.pas`,
  `${PREFIX}eridf/wsERIDF_TerraRural/wsWebModule.pas`,
  `${PREFIX}eridf/wsERIDF_Traslado/teste.pas`,
  `${PREFIX}eridf/wsERIDF_Traslado/wsImplementacao.pas`,
  `${PREFIX}eridf/wsERIDF_Traslado/wsInterface.pas`,
  `${PREFIX}eridf/wsERIDF_Traslado/wsTraslado.pas`,
  `${PREFIX}eridf/wsERIDF_Traslado/wsWebModule.pas`,
  `${PREFIX}eridf/wsNotificacao/Unit1.pas`,
  `${PREFIX}eridf/wsNotificacao/wsImplementacao.pas`,
  `${PREFIX}eridf/wsNotificacao/wsInterface.pas`,
  `${PREFIX}eridf/wsNotificacao/wsPrincipal.pas`,
  `${PREFIX}eridf/wsNotificacao/wsWebModule.pas`,
  `${PREFIX}eridf/wsONR/WSBDLightSystem/wsImplementacao.pas`,
  `${PREFIX}eridf/wsONR/WSBDLightSystem/wsInterface.pas`,
  `${PREFIX}eridf/wsONR/WSBDLightSystem/wsPesquisaPessoa.pas`,
  `${PREFIX}eridf/wsONR/WSBDLightSystem/wsWebModule.pas`,
  `${PREFIX}eridf/wsONR/WSMatriculaOnlineSystem/ServerConst.pas`,
  `${PREFIX}eridf/wsONR/WSMatriculaOnlineSystem/wsImplementacao.pas`,
  `${PREFIX}eridf/wsONR/WSMatriculaOnlineSystem/wsInterface.pas`,
  `${PREFIX}eridf/wsONR/WSMatriculaOnlineSystem/wsWebModule.pas`,
  `${PREFIX}eridf/wsERIDF_ServicosAutomaticos/Principal.pas`,
  `${PREFIX}eridf/wsERIDF_ServicosAutomaticos/Teste.pas`,
  `${PREFIX}eridf/wsERIDF_Novo/wsImplementacao.pas`,
  `${PREFIX}eridf/wsERIDF_Novo/wsInterface.pas`,
  `${PREFIX}eridf/wsERIDF_Novo/wsWebModule.pas`,
];

const RI_DFM_DEFERRED_ORDER = [
  `${PREFIX}eridf/wsERIDF_Cloud/dmBoletoCloud.dfm`,
  `${PREFIX}eridf/wsConsultarProtocolo/teste.dfm`,
  `${PREFIX}eridf/wsConsultarProtocolo/wsWebModule.dfm`,
  `${PREFIX}eridf/wsERIDF_Auxiliar/teste.dfm`,
  `${PREFIX}eridf/wsERIDF_Auxiliar/wsWebModule.dfm`,
  `${PREFIX}eridf/wsERIDF_Cloud/teste.dfm`,
  `${PREFIX}eridf/wsERIDF_Cloud/wsRelatorio.dfm`,
  `${PREFIX}eridf/wsERIDF_Cloud/wsWebModule.dfm`,
  `${PREFIX}eridf/wsERIDF_Novo/wsWebModule.dfm`,
  `${PREFIX}eridf/wsERIDF_ServicosAutomaticos/Principal.dfm`,
  `${PREFIX}eridf/wsERIDF_ServicosAutomaticos/Teste.dfm`,
  `${PREFIX}eridf/wsERIDF_TerraRural/teste.dfm`,
  `${PREFIX}eridf/wsERIDF_TerraRural/wsWebModule.dfm`,
  `${PREFIX}eridf/wsERIDF_Traslado/teste.dfm`,
  `${PREFIX}eridf/wsERIDF_Traslado/wsWebModule.dfm`,
  `${PREFIX}eridf/wsERIDF/teste.dfm`,
  `${PREFIX}eridf/wsERIDF/wsRelatorio.dfm`,
  `${PREFIX}eridf/wsERIDF/wsSoapDM.dfm`,
  `${PREFIX}eridf/wsERIDF/wsWebModule.dfm`,
  `${PREFIX}eridf/wsNotificacao/Unit1.dfm`,
  `${PREFIX}eridf/wsNotificacao/wsWebModule.dfm`,
  `${PREFIX}eridf/wsONR/WSBDLightSystem/wsWebModule.dfm`,
  `${PREFIX}eridf/wsONR/WSMatriculaOnlineSystem/wsWebModule.dfm`,
];

const BATCH_ALIAS_MAP = {
  'RegistroDeImoveis/dmONR.pas': 'RegistroDeImoveis/geral_sistemas/wsgeral/dmONR.pas',
  'RegistroDeImoveis/dmPix.pas': 'RegistroDeImoveis/geral_sistemas/wsgeral/dmPix.pas',
  'RegistroDeImoveis/dmOnrPix.pas': 'RegistroDeImoveis/geral_sistemas/wsgeral/dmOnrPix.pas',
  'RegistroDeImoveis/dmBoleto.pas': 'RegistroDeImoveis/geral_ri/dmBoleto.pas',
  'RegistroDeImoveis/wsImplementacao.pas': 'RegistroDeImoveis/eridf/wsConsultarProtocolo/wsImplementacao.pas',
  'RegistroDeImoveis/wsInterface.pas': 'RegistroDeImoveis/eridf/wsConsultarProtocolo/wsInterface.pas',
  'RegistroDeImoveis/wsWebModule.pas': 'RegistroDeImoveis/eridf/wsConsultarProtocolo/wsWebModule.pas',
  'RegistroDeImoveis/wsCertidao.pas': 'RegistroDeImoveis/eridf/wsERIDF/wsCertidao.pas',
  'RegistroDeImoveis/wsHistorico.pas': 'RegistroDeImoveis/eridf/wsERIDF/wsHistorico.pas',
  'RegistroDeImoveis/wsOficio.pas': 'RegistroDeImoveis/eridf/wsERIDF/wsOficio.pas',
  'RegistroDeImoveis/wsPedido.pas': 'RegistroDeImoveis/eridf/wsERIDF/wsPedido.pas',
};

function parseArgs(argv) {
  const args = { dryRun: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--product-slug') args.productSlug = argv[++i];
    else if (a === '--dry-run') args.dryRun = true;
    else if (a === '--help' || a === '-h') args.help = true;
  }
  return args;
}

function mergeTriageRules(existing) {
  const out = [...existing];
  const keys = new Set(existing.map((r) => `${r.glob}|${r.tier}|${r.action}`));
  for (const rule of NEW_TRIAGE_RULES) {
    const k = `${rule.glob}|${rule.tier}|${rule.action}`;
    if (!keys.has(k)) {
      out.push(rule);
      keys.add(k);
    }
  }
  return out;
}

function countFilesDone(order, fileProgress) {
  return order.filter((fp) => fileProgress[fp]?.analyze_status === 'done').length;
}

function resolveCurrentFile(order, fileProgress, batch, fallback) {
  for (const fp of order) {
    const fs = batch?.files?.[fp];
    const prog = fileProgress[fp];
    if (prog?.analyze_status === 'partial') return fp;
    if (fs && fs.analyze_status === 'partial') return fp;
    if (prog?.analyze_status !== 'done' && fs?.index_status === 'done') return fp;
    if (!prog && fs) return fp;
  }
  return fallback || order.find((fp) => fileProgress[fp]?.analyze_status !== 'done') || null;
}

function canonizeBatchAliases(batch) {
  const stats = { aliases_marked: 0, removed_from_order: 0 };
  const order = batch.execution_order || [];
  const newOrder = [];

  for (const fp of order) {
    if (BATCH_ALIAS_MAP[fp]) {
      stats.removed_from_order++;
      continue;
    }
    newOrder.push(fp);
  }

  for (const [alias, canonical] of Object.entries(BATCH_ALIAS_MAP)) {
    const entry = batch.files[alias];
    if (!entry) continue;
    entry.duplicate = true;
    entry.alias_of = canonical;
    entry.analyze_action = 'skip_alias';
    if (entry.index_status === 'pending') entry.index_status = 'skip';
    stats.aliases_marked++;
  }

  if (!newOrder.includes(`${PREFIX}eridf/wsERIDF/wsPedido.pas`)) {
    newOrder.push(`${PREFIX}eridf/wsERIDF/wsPedido.pas`);
  }

  batch.execution_order = newOrder;
  batch.current_file = `${PREFIX}eridf/wsERIDF/wsPedido.pas`;
  return stats;
}

function applyEcosystemV2(ecoState, batch) {
  const fileProgress = ecoState.file_progress || {};
  const oldEridf = ecoState.domains['ri-eridf'] || {};

  delete ecoState.domains['ri-eridf'];
  delete ecoState.domains['ri-restante'];

  const filesDone = countFilesDone(RI_ERIDF_PROD_ORDER, fileProgress);
  const currentFile = resolveCurrentFile(
    RI_ERIDF_PROD_ORDER,
    fileProgress,
    batch,
    `${PREFIX}eridf/wsERIDF/wsPedido.pas`,
  );

  ecoState.domains['ri-eridf-prod'] = {
    domain_id: 'ri-eridf-prod',
    label: 'ERIDF produção (.dpr ativos)',
    priority: 'P2',
    status: filesDone >= RI_ERIDF_PROD_ORDER.length ? 'done' : 'in_progress',
    execution_order: RI_ERIDF_PROD_ORDER,
    files_total: RI_ERIDF_PROD_ORDER.length,
    files_done: filesDone,
    current_file: currentFile,
    active_file_batch_id: oldEridf.active_file_batch_id || null,
    notes: 'Curado ri-roadmap-v2.md §5 — sem wsEmail.old, baguncado, Copia, ultimo feito',
  };

  ecoState.domains['ri-dfm-deferred'] = {
    domain_id: 'ri-dfm-deferred',
    label: 'DFMs ERIDF (após .pas do domínio)',
    priority: 'P3',
    status: 'pending',
    execution_order: RI_DFM_DEFERRED_ORDER,
    files_total: RI_DFM_DEFERRED_ORDER.length,
    files_done: 0,
    current_file: null,
    active_file_batch_id: null,
    notes: 'Não bloqueia ri-eridf-prod; ex-T0 removidos',
  };

  ecoState.domains['ri-onr-assinatura'] = {
    domain_id: 'ri-onr-assinatura',
    label: 'ONR assinatura / RestPKI / CNIB2',
    priority: 'P1',
    status: 'pending',
    execution_order: [
      `${PREFIX}geral_sistemas/wsONR/dmAssinaturaOnr.pas`,
      `${PREFIX}geral_sistemas/wsONR/dmRestPKI.pas`,
      `${PREFIX}geral_sistemas/wsONR/dmOnrCNIB2.pas`,
    ],
    files_total: 3,
    files_done: 0,
    current_file: null,
    active_file_batch_id: null,
    notes: 'Fila §6 posições 47–49',
  };

  ecoState.domains['ri-pessoas'] = {
    domain_id: 'ri-pessoas',
    label: 'Pessoas / Real_Pessoal',
    priority: 'P2',
    status: 'pending',
    execution_order: [`${PREFIX}Real_Pessoal.pas`],
    files_total: 1,
    files_done: 0,
    current_file: null,
    active_file_batch_id: null,
    notes: 'needs_split (~14k L) — após ri-eridf-prod',
  };

  ecoState.active_domain_id = 'ri-eridf-prod';
  ecoState.triage_rules = mergeTriageRules(ecoState.triage_rules || []);

  return {
    eridf_prod_files: RI_ERIDF_PROD_ORDER.length,
    eridf_prod_done: filesDone,
    dfm_deferred: RI_DFM_DEFERRED_ORDER.length,
    current_file: currentFile,
  };
}

function patchRunnerFiles(productSlug, dryRun) {
  const runnerPath = path.join(__dirname, `delphi-${productSlug}-runner-state.json`);
  const nextPath = path.join(__dirname, `delphi-${productSlug}-runner-next.json`);
  const patches = [];

  if (fs.existsSync(runnerPath)) {
    const runner = JSON.parse(fs.readFileSync(runnerPath, 'utf8'));
    if (runner.active_domain_id === 'ri-eridf') {
      runner.active_domain_id = 'ri-eridf-prod';
      patches.push('runner-state: active_domain_id → ri-eridf-prod');
    }
    if (runner.active_file === 'RegistroDeImoveis/wsPedido.pas') {
      runner.active_file = `${PREFIX}eridf/wsERIDF/wsPedido.pas`;
      patches.push('runner-state: active_file → eridf/wsERIDF/wsPedido.pas');
    }
    if (!dryRun) fs.writeFileSync(runnerPath, JSON.stringify(runner, null, 2) + '\n', 'utf8');
  }

  if (fs.existsSync(nextPath)) {
    const next = JSON.parse(fs.readFileSync(nextPath, 'utf8'));
    if (next.domain === 'ri-eridf') {
      next.domain = 'ri-eridf-prod';
      patches.push('runner-next: domain → ri-eridf-prod');
    }
    if (!dryRun) fs.writeFileSync(nextPath, JSON.stringify(next, null, 2) + '\n', 'utf8');
  }

  return patches;
}

function main() {
  const args = parseArgs(process.argv);
  if (args.help || !args.productSlug) {
    console.log('Uso: node scripts/apply-roadmap-v2-ecosystem.cjs --product-slug imoveis [--dry-run]');
    process.exit(args.help ? 0 : 1);
  }

  if (args.productSlug !== 'imoveis') {
    console.error('Roadmap v2 só está definido para imoveis.');
    process.exit(1);
  }

  const ecoPath = path.join(__dirname, `delphi-${args.productSlug}-ecosystem-state.json`);
  const batchPath = path.join(__dirname, `delphi-${args.productSlug}-batch-state.json`);

  const ecoState = JSON.parse(fs.readFileSync(ecoPath, 'utf8'));
  const batchState = JSON.parse(fs.readFileSync(batchPath, 'utf8'));
  const batch = batchState.batches[batchState.active_batch_id];

  const ecoStats = applyEcosystemV2(ecoState, batch);
  const batchStats = canonizeBatchAliases(batch);
  const runnerPatches = patchRunnerFiles(args.productSlug, args.dryRun);

  const summary = { eco: ecoStats, batch: batchStats, runner: runnerPatches };

  if (args.dryRun) {
    console.log(JSON.stringify({ dry_run: true, ...summary }, null, 2));
    return;
  }

  fs.writeFileSync(ecoPath, JSON.stringify(ecoState, null, 2) + '\n', 'utf8');
  fs.writeFileSync(batchPath, JSON.stringify(batchState, null, 2) + '\n', 'utf8');

  console.log(JSON.stringify(summary, null, 2));
  console.error(`Ecosystem v2: ${ecoPath}`);
  console.error(`Batch aliases: ${batchPath}`);
  console.error('Próximo: npm run delphi:apply-triage -- --product-slug imoveis');
}

main();
