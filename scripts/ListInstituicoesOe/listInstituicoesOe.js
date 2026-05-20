/**
 * Lista instituições solicitantes (ListInstituicoesOE) no webservice Ofícios da ONR.
 */
import fs from "node:fs";
import soap from "soap";
import { resolvePath } from "../../lib/onr_env.js";
import {
  hashErrorHint,
  loadLoginConfig,
  loadOficiosSoapConfig,
  loadServentiaChave,
  resolveAuthHash,
} from "../../lib/onr_oficios.js";

const INSTITUICAO_ITEM = "ListInstOE_Inst_WSResp";

function loadConfig() {
  return {
    chave: loadServentiaChave(),
    loginCfg: loadLoginConfig(),
    ...loadOficiosSoapConfig(),
  };
}

function buildRequest(hashValue) {
  return { Hash: hashValue };
}

function serializeInstituicoes(instituicoes) {
  if (!instituicoes) return [];
  const items = instituicoes[INSTITUICAO_ITEM];
  if (!items) return [];
  return Array.isArray(items) ? items : [items];
}

function normalizeResponse(result) {
  return {
    RETORNO: result.RETORNO,
    CODIGOERRO: result.CODIGOERRO,
    ERRODESCRICAO: result.ERRODESCRICAO,
    Instituicoes: serializeInstituicoes(result.Instituicoes),
  };
}

async function listInstituicoesOe(cfg, oRequest) {
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
    [response] = await client.ListInstituicoesOEAsync({ oRequest });
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

  const result =
    response?.ListInstituicoesOEResult ??
    response?.ListInstituicoesOEResponse?.ListInstituicoesOEResult ??
    response;

  return normalizeResponse(result);
}

async function main() {
  const cfg = loadConfig();
  const hash = await resolveAuthHash(cfg.chave, cfg.loginCfg);
  const oRequest = buildRequest(hash);

  console.log("=== Parâmetros ListInstituicoesOE ===");
  console.log(JSON.stringify(oRequest, null, 2));
  console.log(`\nEndpoint: ${cfg.endpoint}`);

  const response = await listInstituicoesOe(cfg, oRequest);
  console.log("\n=== Resposta ===");
  console.log(JSON.stringify(response, null, 2));

  if (!response.RETORNO) {
    console.error(
      `\nListInstituicoesOE falhou: [${response.CODIGOERRO}] ${response.ERRODESCRICAO}`
    );
    const hint = hashErrorHint(response.CODIGOERRO);
    if (hint) console.error(hint);
    process.exit(1);
  }

  console.log(`\nOK — ${response.Instituicoes.length} instituição(ões) retornada(s).`);
  for (const row of response.Instituicoes.slice(0, 10)) {
    console.log(
      `  IDInstituicao=${row.IDInstituicao}: ${row.Instituicao ?? "—"}`
    );
  }
  if (response.Instituicoes.length > 10) {
    console.log(`  ... e mais ${response.Instituicoes.length - 10}`);
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
