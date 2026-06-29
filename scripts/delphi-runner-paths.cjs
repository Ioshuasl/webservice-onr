/**
 * Paths do runner autônomo Delphi legado.
 */
const path = require('path');

const ROOT = path.join(__dirname);

function runnerStateFile(productSlug) {
  return path.join(ROOT, `delphi-${productSlug}-runner-state.json`);
}

function runnerNextJobsFile(productSlug) {
  return path.join(ROOT, `delphi-${productSlug}-runner-next.json`);
}

function runnerPromptFile(productSlug) {
  return path.join(ROOT, '..', 'registro-imoveis', 'runner-next-prompt.md');
}

function riPlanFile(productSlug) {
  return path.join(ROOT, `delphi-${productSlug}-ri-plan.json`);
}

function kickoffPromptFile() {
  return path.join(ROOT, '..', 'registro-imoveis', 'runner-kickoff.md');
}

const DEFAULT_RUNNER_CONFIG = {
  symbols_per_ai_batch: 15,
  events_per_ai_batch: 10,
  stub_per_ai_batch: 20,
  require_validation_pass: true,
  auto_validate: true,
  auto_grafo_on_domain_complete: true,
  auto_coverage_each_tick: true,
};

module.exports = {
  runnerStateFile,
  runnerNextJobsFile,
  runnerPromptFile,
  kickoffPromptFile,
  riPlanFile,
  DEFAULT_RUNNER_CONFIG,
};
