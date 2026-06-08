#!/usr/bin/env node
/**
 * Pausa AUTONR-84 e AUTONR-85 no Plane (CTP) — instabilidade webservice ONR.
 * Uso: node scripts/plane/pause-autonr-ctp-cards.cjs
 */
const fs = require("fs");
const path = require("path");
const { loadInstanceEnv, loadProject, VAULT_ROOT } = require(
  path.resolve(
    process.env.USERPROFILE || "",
    "Obsidian Vault/Meta/integracoes/plane/scripts/lib/plane-config.js"
  )
);
const { patchWorkItem } = require(
  path.resolve(
    process.env.USERPROFILE || "",
    "Obsidian Vault/Meta/integracoes/plane/scripts/lib/plane-api.js"
  )
);

const PAUSED_STATE = "70fb516a-8f93-46c9-be74-33eff6881a67";
const MSG = "Interrompido por instabilidade do webservice da onr";
const HTML = `<div class="plane-doc"><p><strong>${MSG}</strong></p></div>`;

const ITEMS = [
  { key: "AUTONR-84", id: "f474a5bd-f387-460f-ad6c-60f7591adbc2", op: "ImportacaoArquivos" },
  { key: "AUTONR-85", id: "0be02326-93f7-43c4-93e6-4d0e29553275", op: "AtualizarStatusProcesso" },
];

async function main() {
  const inst = loadInstanceEnv();
  const proj = loadProject("autonr");

  for (const it of ITEMS) {
    const res = await patchWorkItem(inst, proj, it.id, {
      state: PAUSED_STATE,
      description_html: HTML,
      description: "",
    });
    console.log(`${it.key} → estado Paused | ${res.name}`);
  }

  const regPath = path.join(VAULT_ROOT, "Meta/integracoes/plane/maps/autonr-work-items.json");
  const reg = JSON.parse(fs.readFileSync(regPath, "utf8"));
  reg.plane_state_paused = PAUSED_STATE;
  for (const it of ITEMS) {
    const entry = reg.items[it.op];
    entry.plane_state = PAUSED_STATE;
    entry.automation_status = "paused";
    entry.paused_reason = MSG;
    entry.paused_at = new Date().toISOString().slice(0, 10);
  }
  reg.updated_at = new Date().toISOString().slice(0, 10);
  fs.writeFileSync(regPath, JSON.stringify(reg, null, 2) + "\n", "utf8");
  console.log("Registry:", regPath);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
