/**
 * Consulta um título (GetTituloAT) no webservice Acompanhamento de Títulos da ONR.
 */
import fs from "node:fs";
import soap from "soap";
import { envInt, resolvePath } from "../../lib/onr_env.js";
import {
  hashErrorHint,
  loadAcompanhamentoSoapConfig,
  loadLoginConfig,
  loadServentiaChave,
  resolveAuthHash,
} from "../../lib/onr_acompanhamento.js";

function loadConfig() {
  const idTitulo = envInt("ACOMPANHAMENTO_TITULOS_ID_TITULO");
  if (idTitulo === undefined) {
    throw new Error(
      "Defina ACOMPANHAMENTO_TITULOS_ID_TITULO no .env com o ID do título."
    );
  }

  return {
    chave: loadServentiaChave(),
    loginCfg: loadLoginConfig(),
    idTitulo,
    ...loadAcompanhamentoSoapConfig(),
  };
}

function buildRequest(hashValue, idTitulo) {
  return {
    Hash: hashValue,
    IDTitulo: idTitulo,
  };
}

async function getTituloAt(cfg, oRequest) {
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
    [response] = await client.GetTituloATAsync({ oRequest });
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
    response?.GetTituloATResult ??
    response?.GetTituloATResponse?.GetTituloATResult ??
    response
  );
}

async function main() {
  const cfg = loadConfig();
  const hash = await resolveAuthHash(cfg.chave, cfg.loginCfg);
  const oRequest = buildRequest(hash, cfg.idTitulo);

  console.log("=== Parâmetros GetTituloAT ===");
  console.log(JSON.stringify(oRequest, null, 2));
  console.log(`\nEndpoint: ${cfg.endpoint}`);

  const response = await getTituloAt(cfg, oRequest);
  console.log("\n=== Resposta ===");
  console.log(JSON.stringify(response, null, 2));

  if (!response.RETORNO) {
    console.error(
      `\nGetTituloAT falhou: [${response.CODIGOERRO}] ${response.ERRODESCRICAO}`
    );
    const hint = hashErrorHint(response.CODIGOERRO);
    if (hint) console.error(hint);
    process.exit(1);
  }

  console.log(
    `\nOK — Título ${cfg.idTitulo}: protocolo ${response.Protocolo ?? "—"}, ` +
      `apresentante ${response.ApresentanteNome ?? "—"}`
  );
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
