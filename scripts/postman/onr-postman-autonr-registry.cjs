/**
 * Mapeia requests Postman ONR → AUTONR-n (registry Plane / vault Obsidian).
 */
const fs = require("fs");
const path = require("path");
const {
  formatAutonrRequestName,
  stripAutonrPrefix,
} = require("./postman-request-naming.cjs");

const ROOT = path.resolve(__dirname, "../..");
const DEFAULT_WORKFLOWS_DIR = path.join(ROOT, "workflows/n8n/extensao-n8n-teste");

const FILE_TO_OP = {
  "Auth WebService ONR.workflow.ts": "LoginUsuarioCertificado",
  "Obter XML Solicitacoes V6.workflow.ts": "ObterXMLSolicitacoes_v6",
  "Devolver Certidao.workflow.ts": "DevolverCertidao",
  "Finalizar Resposta Certidao.workflow.ts": "FinalizarRespostaCertidao",
  "Informar Custas Certidao.workflow.ts": "InformarCustasCertidao",
  "Importacao Arquivos CTP.workflow.ts": "ImportacaoArquivos",
  "Atualizar Status Processo CTP.workflow.ts": "AtualizarStatusProcesso",
  "Obter XML Solicitacoes V2 Matricula Online.workflow.ts": "ObterXMLSolicitacoesV2",
  "Obter XML Solicitacoes Matricula Online.workflow.ts": "ObterXMLSolicitacoes",
  "Get Extrato XML AC.workflow.ts": "GetExtratoXMLAC",
  "List Pedidos AC.workflow.ts": "ListPedidosAC",
  "List Anexos AC.workflow.ts": "ListAnexosAC",
  "List Boletos AC.workflow.ts": "ListBoletosAC",
  "Set Baixa Boleto AC.workflow.ts": "SetBaixaBoletoAC",
  "Get Pedido AC V3.workflow.ts": "GetPedidoAC_V3",
  "Alterar Pedido AC.workflow.ts": "AlterarPedidoAC",
  "Set Prenotacao AC.workflow.ts": "SetPrenotacaoAC",
  "Set Custas AC.workflow.ts": "SetCustasAC",
  "Set Prenotacao Exame Calculo AC.workflow.ts": "SetPrenotacaoExameCalculoAC",
  "Set Contrato Averbado AC.workflow.ts": "SetContratoAverbadoAC",
  "Set Contrato Exigencia AC.workflow.ts": "SetContratoExigenciaAC",
  "Set Contrato Devolvido AC.workflow.ts": "SetContratoDevolvidoAC",
  "List Documentos Repositorio AC.workflow.ts": "ListDocumentosRepositorioAC",
  "Contrato XML to PDF AC.workflow.ts": "ContratoXMLtoPDF",
};

/** Requests sem workflow 1:1 ou com nome diferente na coleção. */
const REQUEST_NAME_OVERRIDES = {
  "Auth ONR — Login": "AUTONR-2",
  "Auth ONR — CPF inválido": "AUTONR-2",
  "Auth ONR — CPF ausente": "AUTONR-2",
  "LoginUsuarioCertificado — SOAP direto": "AUTONR-2",
  "Obter XML Solicitacoes v6": "AUTONR-46",
  "Obter XML — por protocolo": "AUTONR-46",
  "Devolver Certidao": "AUTONR-47",
  "Finalizar Resposta Certidao": "AUTONR-53",
  "Informar Custas Certidao": "AUTONR-54",
};

function resolveRegistryPath() {
  const home = process.env.USERPROFILE || process.env.HOME || "";
  const candidates = [
    path.join(home, "Obsidian Vault/Meta/integracoes/plane/maps/autonr-work-items.json"),
    path.join(home, "OneDrive/Documentos/Obsidian Vault/Meta/integracoes/plane/maps/autonr-work-items.json"),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  throw new Error(`Registry AUTONR não encontrado. Caminhos tentados: ${candidates.join(", ")}`);
}

function loadRegistryByOp(registryPath) {
  const p = registryPath || resolveRegistryPath();
  const registry = JSON.parse(fs.readFileSync(p, "utf8"));
  const byOp = {};
  for (const entry of Object.values(registry.items || {})) {
    byOp[entry.operacao] = entry;
  }
  return { byOp, registryPath: p };
}

function workflowFileNameToOp(fileName) {
  if (FILE_TO_OP[fileName]) return FILE_TO_OP[fileName];
  const base = fileName.replace(/\.workflow\.ts$/i, "").trim();
  if (/auth\s*onr/i.test(base)) return "LoginUsuarioCertificado";

  const parts = base.split(/\s+/);
  let op = "";
  for (let i = 0; i < parts.length; i += 1) {
    const p = parts[i];
    if (/^V\d+$/i.test(p) && i === parts.length - 1) {
      op += `_${p.toUpperCase()}`;
      continue;
    }
    if (/^(PO|OE|AT|AC|IN)$/i.test(p)) {
      op += p.toUpperCase();
      continue;
    }
    op += p.charAt(0).toUpperCase() + p.slice(1).toLowerCase();
  }
  return op;
}

function resolveRegistryEntry(registryByOp, op) {
  if (registryByOp[op]) return registryByOp[op];
  const variants = new Set([op]);
  variants.add(op.replace(/_V(\d+)$/i, (_, n) => `_v${n}`));
  variants.add(op.replace(/_v(\d+)$/i, (_, n) => `_V${n}`));
  for (const key of variants) {
    if (registryByOp[key]) return registryByOp[key];
  }
  return null;
}

function buildRequestNameIndex({ registryByOp, requestDisplayName, workflowsDir = DEFAULT_WORKFLOWS_DIR }) {
  const index = new Map();

  for (const [name, planeKey] of Object.entries(REQUEST_NAME_OVERRIDES)) {
    index.set(name, planeKey);
  }

  if (!fs.existsSync(workflowsDir)) return index;

  for (const file of fs.readdirSync(workflowsDir).filter((f) => f.endsWith(".workflow.ts"))) {
    const op = workflowFileNameToOp(file);
    const entry = resolveRegistryEntry(registryByOp, op);
    if (!entry?.plane_key) continue;
    const wfName = file.replace(".workflow.ts", "");
    const baseName = requestDisplayName(wfName);
    index.set(baseName, entry.plane_key);
  }

  return index;
}

function applyAutonrPrefixes(collection, index, { warnUnmapped = true } = {}) {
  const unmapped = [];

  const walk = (items) => {
    for (const it of items || []) {
      if (it.request) {
        const bare = stripAutonrPrefix(it.name);
        const planeKey = index.get(bare) || index.get(it.name);
        if (planeKey) {
          it.name = formatAutonrRequestName(planeKey, bare);
        } else if (warnUnmapped) {
          unmapped.push(it.name);
        }
      }
      if (it.item) walk(it.item);
    }
  };

  walk(collection.item);
  return { unmapped };
}

module.exports = {
  REQUEST_NAME_OVERRIDES,
  resolveRegistryPath,
  loadRegistryByOp,
  workflowFileNameToOp,
  resolveRegistryEntry,
  stripAutonrPrefix,
  formatAutonrRequestName,
  buildRequestNameIndex,
  applyAutonrPrefixes,
};
