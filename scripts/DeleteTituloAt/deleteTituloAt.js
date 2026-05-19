/**
 * Exclui um título (DeleteTituloAT) no webservice Acompanhamento de Títulos da ONR.
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

const PREFIX = "ACOMPANHAMENTO_TITULOS_DELETE_";

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
  return {
    chave: loadServentiaChave(),
    loginCfg: loadLoginConfig(),
    idTitulo: resolveIdTitulo(),
    ...loadAcompanhamentoSoapConfig(),
  };
}

/** Ordem WSDL DeleteTituloAT_WSReq: Hash → IDTitulo. */
function buildRequest(hashValue, idTitulo) {
  return {
    Hash: hashValue,
    IDTitulo: idTitulo,
  };
}

async function deleteTituloAt(cfg, oRequest) {
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
    [response] = await client.DeleteTituloATAsync({ oRequest });
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
    response?.DeleteTituloATResult ??
    response?.DeleteTituloATResponse?.DeleteTituloATResult ??
    response
  );
}

async function main() {
  const cfg = loadConfig();
  const hash = await resolveAuthHash(cfg.chave, cfg.loginCfg);
  const oRequest = buildRequest(hash, cfg.idTitulo);

  console.log("=== Parâmetros DeleteTituloAT ===");
  console.log(JSON.stringify(oRequest, null, 2));
  console.log(`\nEndpoint: ${cfg.endpoint}`);

  const response = await deleteTituloAt(cfg, oRequest);
  console.log("\n=== Resposta ===");
  console.log(JSON.stringify(response, null, 2));

  if (!response.RETORNO) {
    console.error(
      `\nDeleteTituloAT falhou: [${response.CODIGOERRO}] ${response.ERRODESCRICAO}`
    );
    if (response.CODIGOERRO === 12) {
      console.error(
        `Dica: ${PREFIX}ID_TITULO / ACOMPANHAMENTO_TITULOS_ID_TITULO inválido ou título já excluído.`
      );
    }
    if (response.CODIGOERRO === 30) {
      console.error(
        "Dica: não foi possível localizar o título (30). Confira o ID com ListTitulosAT."
      );
    }
    if (response.CODIGOERRO === 50) {
      console.error("Dica: sem permissão para excluir o título (spec cód. 50).");
    }
    const hint = hashErrorHint(response.CODIGOERRO);
    if (hint) console.error(hint);
    process.exit(1);
  }

  console.log(`\nOK — Título ${cfg.idTitulo} excluído.`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
