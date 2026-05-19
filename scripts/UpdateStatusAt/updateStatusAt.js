/**
 * Altera um status de título (UpdateStatusAT) no webservice Acompanhamento de Títulos da ONR.
 */
import fs from "node:fs";
import soap from "soap";
import { envInt, envStr, requireEnvInt, resolvePath } from "../../lib/onr_env.js";
import {
  hashErrorHint,
  loadAcompanhamentoSoapConfig,
  loadLoginConfig,
  loadServentiaChave,
  resolveAuthHash,
} from "../../lib/onr_acompanhamento.js";
import { buildUpdateStatusRequest } from "../../lib/onr_update_status_at.js";

const PREFIX = "ACOMPANHAMENTO_TITULOS_UPDATE_STATUS_";

function resolveIdStatus() {
  let idStatus = envInt(`${PREFIX}ID_STATUS`);
  if (idStatus === undefined) {
    idStatus = envInt("ACOMPANHAMENTO_TITULOS_ID_STATUS");
  }
  if (idStatus === undefined) {
    throw new Error(
      `Defina ${PREFIX}ID_STATUS ou ACOMPANHAMENTO_TITULOS_ID_STATUS no .env.`
    );
  }
  return idStatus;
}

function loadConfig() {
  const required = [
    `${PREFIX}ID_TIPO_STATUS`,
    `${PREFIX}DATA_STATUS`,
    `${PREFIX}DESCRICAO_STATUS`,
  ];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    throw new Error(`Variáveis ausentes no .env: ${missing.join(", ")}`);
  }

  const idTipoStatus = requireEnvInt(`${PREFIX}ID_TIPO_STATUS`);
  const dataStatus = envStr(`${PREFIX}DATA_STATUS`);
  const descricaoStatus = envStr(`${PREFIX}DESCRICAO_STATUS`);

  if (!dataStatus?.trim()) {
    throw new Error(
      `Defina ${PREFIX}DATA_STATUS no .env (formato: aaaa-mm-dd hh:mm:ss).`
    );
  }
  if (!descricaoStatus?.trim()) {
    throw new Error(
      `Defina ${PREFIX}DESCRICAO_STATUS no .env (obrigatório na spec — erro 17 se vazio).`
    );
  }

  return {
    chave: loadServentiaChave(),
    loginCfg: loadLoginConfig(),
    idStatus: resolveIdStatus(),
    idTipoStatus,
    dataStatus: dataStatus.trim(),
    descricaoStatus: descricaoStatus.trim(),
    ...loadAcompanhamentoSoapConfig(),
  };
}

async function updateStatusAt(cfg, oRequest) {
  const wsdlPath = resolvePath(cfg.wsdlPath);
  if (!fs.existsSync(wsdlPath)) {
    throw new Error(`WSDL não encontrado: ${wsdlPath}`);
  }

  const client = await soap.createClientAsync(wsdlPath, {
    endpoint: cfg.endpoint,
    forceSoap12Headers: false,
    wsdl_options: { timeout: 60000 },
  });

  let response;
  try {
    [response] = await client.UpdateStatusATAsync({ oRequest });
  } catch (err) {
    const status = err?.response?.status;
    const body =
      typeof err?.body === "string"
        ? err.body
        : typeof err?.response?.data === "string"
          ? err.response.data
          : null;

    if (status === 503 || (body && !body.trimStart().startsWith("<"))) {
      throw new Error(
        `Servidor ONR indisponível (HTTP ${status ?? "?"}): ${body ?? err.message}`
      );
    }
    throw err;
  }

  return (
    response?.UpdateStatusATResult ??
    response?.UpdateStatusATResponse?.UpdateStatusATResult ??
    response
  );
}

async function main() {
  const cfg = loadConfig();
  const hash = await resolveAuthHash(cfg.chave, cfg.loginCfg);
  const oRequest = buildUpdateStatusRequest(hash, cfg);

  console.log("=== Parâmetros UpdateStatusAT ===");
  console.log(JSON.stringify(oRequest, null, 2));
  console.log(`\nEndpoint: ${cfg.endpoint}`);

  const response = await updateStatusAt(cfg, oRequest);
  console.log("\n=== Resposta ===");
  console.log(JSON.stringify(response, null, 2));

  if (!response.RETORNO) {
    console.error(
      `\nUpdateStatusAT falhou: [${response.CODIGOERRO}] ${response.ERRODESCRICAO}`
    );
    if (response.CODIGOERRO === 12) {
      console.error(
        `Dica: status inválido — confira ${PREFIX}ID_STATUS / ACOMPANHAMENTO_TITULOS_ID_STATUS.`
      );
    }
    if (response.CODIGOERRO === 13) {
      console.error(`Dica: ${PREFIX}ID_TIPO_STATUS inválido — veja § 3.2.1.`);
    }
    if ([14, 15, 16].includes(response.CODIGOERRO)) {
      console.error(`Dica: revise ${PREFIX}DATA_STATUS (19 caracteres).`);
    }
    if (response.CODIGOERRO === 17) {
      console.error(`Dica: informe ${PREFIX}DESCRICAO_STATUS.`);
    }
    if (response.CODIGOERRO === 30) {
      console.error("Dica: não foi possível localizar o status (30).");
    }
    if (response.CODIGOERRO === 32) {
      console.error("Dica: sem permissão para alterar o status (spec cód. 32).");
    }
    if (
      response.CODIGOERRO === 0 &&
      response.ERRODESCRICAO?.includes("IDMsg")
    ) {
      console.error(
        "Dica: envie DataStatus e DescricaoStatus no XML; se persistir, informe IDMsg à ONR."
      );
    }
    const hint = hashErrorHint(response.CODIGOERRO);
    if (hint) console.error(hint);
    process.exit(1);
  }

  console.log(
    `\nOK — Status ${cfg.idStatus} atualizado (tipo ${cfg.idTipoStatus}).`
  );
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
