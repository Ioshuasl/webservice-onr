/**
 * Marca o BD Light como atualizado (SetBDLightAtualizado) no webservice ONR.
 */
import fs from "node:fs";
import soap from "soap";
import { resolvePath } from "../../lib/onr_env.js";
import {
  hashErrorHint,
  loadBdlightSoapConfig,
  loadLoginConfig,
  loadServentiaChave,
  resolveAuthHash,
} from "../../lib/onr_bdlight.js";

function loadConfig() {
  return {
    chave: loadServentiaChave(),
    loginCfg: loadLoginConfig(),
    ...loadBdlightSoapConfig(),
  };
}

function buildRequest(hashValue) {
  return { Hash: hashValue };
}

function businessErrorHint(codigo) {
  const hints = {
    51: "Não foi possível alterar o BD Light para atualizado.",
    502:
      "Já existe resposta pendente; aguarde o download/processamento " +
      "dos arquivos informados via ImportarArquivoBDL.",
  };
  return hints[codigo] ?? null;
}

async function setBdlightAtualizado(cfg, oRequest) {
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
    [response] = await client.SetBDLightAtualizadoAsync({ oRequest });
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
    response?.SetBDLightAtualizadoResult ??
    response?.SetBDLightAtualizadoResponse?.SetBDLightAtualizadoResult ??
    response
  );
}

async function main() {
  const cfg = loadConfig();
  const hash = await resolveAuthHash(cfg.chave, cfg.loginCfg);
  const oRequest = buildRequest(hash);

  console.log("=== Parâmetros SetBDLightAtualizado ===");
  console.log(JSON.stringify(oRequest, null, 2));
  console.log(`\nEndpoint: ${cfg.endpoint}`);

  const response = await setBdlightAtualizado(cfg, oRequest);
  console.log("\n=== Resposta ===");
  console.log(JSON.stringify(response, null, 2));

  if (!response.RETORNO) {
    console.error(
      `\nSetBDLightAtualizado falhou: [${response.CODIGOERRO}] ${response.ERRODESCRICAO}`
    );
    const hint =
      businessErrorHint(response.CODIGOERRO) ?? hashErrorHint(response.CODIGOERRO);
    if (hint) console.error(hint);
    process.exit(1);
  }

  console.log("\nOK — BD Light marcado como atualizado para a serventia.");
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
