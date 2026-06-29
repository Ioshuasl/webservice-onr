/**
 * Consumo de ri-plan.json pelo runner (Fase 2 + 3).
 */
const fs = require('fs');
const path = require('path');

const SCRIPTS_DIR = __dirname;

function riPlanPath(productSlug) {
  return path.join(SCRIPTS_DIR, `delphi-${productSlug}-ri-plan.json`);
}

function loadRiPlan(productSlug) {
  const p = riPlanPath(productSlug);
  if (!fs.existsSync(p)) return { path: p, plan: null };
  try {
    return { path: p, plan: JSON.parse(fs.readFileSync(p, 'utf8')) };
  } catch (e) {
    return { path: p, plan: null, error: e.message };
  }
}

function buildPlanFileMap(plan) {
  const map = new Map();
  if (!plan?.files) return map;
  for (const f of plan.files) {
    map.set(f.file_key, f);
  }
  return map;
}

/**
 * Fase 2: primeiro item da execution_queue que ainda precisa de trabalho.
 */
function resolvePlanHead(plan, batch, isFileCompleteFn, config) {
  if (!plan?.execution_queue?.length) return null;

  const requireValidation = config?.require_validation_pass !== false;

  for (const item of plan.execution_queue) {
    const fp = item.file_key;
    const fs = batch?.files?.[fp];

    if (item.pipeline_status === 'await_index' || item.reason === 'needs_index') {
      return {
        filePath: fp,
        domainId: item.domain_id,
        reason: item.reason || 'needs_index',
        fromPlan: true,
      };
    }

    if (!fs || fs.index_status !== 'done') {
      return {
        filePath: fp,
        domainId: item.domain_id,
        reason: 'needs_index',
        fromPlan: true,
      };
    }

    if (!isFileCompleteFn(fs, requireValidation)) {
      return {
        filePath: fp,
        domainId: item.domain_id,
        reason: item.reason || item.tasks_remaining > 0 ? 'plan_tasks_remaining' : 'next_in_plan',
        fromPlan: true,
      };
    }

    // batch completo — plano pode estar desatualizado; seguir fila
  }

  return null;
}

function normalizePlanJob(planJob, filePath) {
  const job = {
    type: planJob.type,
    file: filePath,
    lines: planJob.lines,
    priority: Boolean(planJob.priority),
    source: 'ri-plan',
  };

  if (planJob.symbol) job.symbol = planJob.symbol;
  if (planJob.segment_id) job.segment_id = planJob.segment_id;
  if (planJob.needs_split != null) job.needs_split = Boolean(planJob.needs_split);
  if (planJob.reason) job.reason = planJob.reason;
  if (planJob.handler) job.handler = planJob.handler;
  if (planJob.component) job.component = planJob.component;
  if (planJob.event) job.event = planJob.event;

  return job;
}

/**
 * Fase 3: pending_jobs do plano → fila IA (respeita limites do runner).
 */
function collectJobsFromPlan(planFileEntry, filePath, config) {
  if (!planFileEntry?.pending_jobs?.length) return [];

  const maxTotal = Math.max(
    config.symbols_per_ai_batch || 15,
    config.events_per_ai_batch || 10,
  );

  const jobs = [];
  for (const pj of planFileEntry.pending_jobs) {
    if (jobs.length >= maxTotal) break;
    jobs.push(normalizePlanJob(pj, filePath));
  }
  return jobs;
}

/**
 * Plan primário; batch collectAIJobs como fallback / complemento stub.
 */
function resolveAIJobs(planFileEntry, fileState, filePath, config, collectAIJobsFn) {
  const fromPlan = collectJobsFromPlan(planFileEntry, filePath, config);
  if (fromPlan.length > 0) return { jobs: fromPlan, source: 'ri-plan' };

  const fromBatch = collectAIJobsFn(fileState, filePath, config);
  return { jobs: fromBatch, source: 'batch' };
}

function buildRunnerNextPayload(ctx) {
  const {
    productSlug,
    domainId,
    filePath,
    jobs,
    jobSource,
    plan,
    planFileEntry,
  } = ctx;

  return {
    generated_at: new Date().toISOString(),
    source: jobSource,
    plan_file: plan ? `scripts/delphi-${productSlug}-ri-plan.json` : null,
    plan_generated_at: plan?.generated_at ?? null,
    schema_version: plan?.schema_version ?? null,
    domain: domainId,
    file: filePath,
    vault_key: planFileEntry?.vault_key ?? null,
    tasks_remaining: planFileEntry?.tasks?.remaining ?? null,
    pipeline_status: planFileEntry?.pipeline_status ?? null,
    jobs,
  };
}

module.exports = {
  riPlanPath,
  loadRiPlan,
  buildPlanFileMap,
  resolvePlanHead,
  collectJobsFromPlan,
  resolveAIJobs,
  buildRunnerNextPayload,
  normalizePlanJob,
};
