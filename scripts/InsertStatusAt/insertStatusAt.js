/**
 * Cadastra um status em título existente (InsertStatusAT) no webservice Acompanhamento de Títulos da ONR.
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
import { buildInsertStatusRequest } from "../../lib/onr_insert_status_at.js";

const PREFIX = "ACOMPANHAMENTO_TITULOS_INSERT_STATUS_";

function resolveIdTitulo() {
  let idTitulo = envInt(`${PREFIX}ID_TITULO`);
  if (idTitulo === undefined) {
    idTitulo = envInt("ACOMPANHAMENTO_TITULOS_ID_TITULO");
  }
  if (idTitulo === undefined) {
    throw new Error(
      `Defina ${PREFIX}ID_TITULO ou ACOMPANHAMENTO_TITULOS_ID_TITULO no .env.`
    );
  }
  return idTitulo;
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
    idTitulo: resolveIdTitulo(),
    idTipoStatus,
    dataStatus: dataStatus.trim(),
    descricaoStatus: descricaoStatus.trim(),
    ...loadAcompanhamentoSoapConfig(),
  };
}

async function insertStatusAt(cfg, oRequest) {
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
    [response] = await client.InsertStatusATAsync({ oRequest });
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
    response?.InsertStatusATResult ??
    response?.InsertStatusATResponse?.InsertStatusATResult ??
    response
  );
}

async function main() {
  const cfg = loadConfig();
  const hash = await resolveAuthHash(cfg.chave, cfg.loginCfg);
  const oRequest = buildInsertStatusRequest(hash, cfg);

  console.log("=== Parâmetros InsertStatusAT ===");
  console.log(JSON.stringify(oRequest, null, 2));
  console.log(`\nEndpoint: ${cfg.endpoint}`);

  const response = await insertStatusAt(cfg, oRequest);
  console.log("\n=== Resposta ===");
  console.log(JSON.stringify(response, null, 2));

  if (!response.RETORNO) {
    console.error(
      `\nInsertStatusAT falhou: [${response.CODIGOERRO}] ${response.ERRODESCRICAO}`
    );
    if (response.CODIGOERRO === 12) {
      console.error(
        `Dica: título inválido — confira ${PREFIX}ID_TITULO / ACOMPANHAMENTO_TITULOS_ID_TITULO.`
      );
    }
    if (response.CODIGOERRO === 13) {
      console.error(
        `Dica: ${PREFIX}ID_TIPO_STATUS inválido — veja § 3.2.1 (ex.: 3, 7).`
      );
    }
    if ([14, 15, 16].includes(response.CODIGOERRO)) {
      console.error(`Dica: revise ${PREFIX}DATA_STATUS (19 caracteres).`);
    }
    if (response.CODIGOERRO === 17) {
      console.error(`Dica: informe ${PREFIX}DESCRICAO_STATUS.`);
    }
    if (response.CODIGOERRO === 501 && response.IDStatus) {
      console.error(
        `Dica: status já cadastrado — IDStatus existente: ${response.IDStatus}`
      );
    }
    if (
      response.CODIGOERRO === 0 &&
      response.ERRODESCRICAO?.includes("IDMsg")
    ) {
      console.error(
        "Dica: envie DataStatus e DescricaoStatus no XML; se persistir, informe IDMsg à ONR."
      );
    }
    if (response.CODIGOERRO === 101) {
      console.error("Dica: erro ao persistir o status (101).");
    }
    const hint = hashErrorHint(response.CODIGOERRO);
    if (hint) console.error(hint);
    process.exit(1);
  }

  console.log(
    `\nOK — Status cadastrado: IDStatus=${response.IDStatus}, ` +
      `título ${cfg.idTitulo}, tipo ${cfg.idTipoStatus}`
  );
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
