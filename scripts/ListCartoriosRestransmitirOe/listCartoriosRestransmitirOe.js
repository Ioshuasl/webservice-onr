/**
 * Lista cartórios permitidos para retransmissão (ListCartoriosRestransmitirOE) no webservice Ofícios da ONR.
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

const CARTORIO_ITEM = "ListRIRetransOE_WSResp";
const FIELD_ORDER = ["Hash"];

function loadConfig() {
  return {
    chave: loadServentiaChave(),
    loginCfg: loadLoginConfig(),
    ...loadOficiosSoapConfig(),
  };
}

function buildRequest(hashValue) {
  return Object.fromEntries(FIELD_ORDER.map((key) => [key, hashValue]));
}

function serializeCartorios(cartorios) {
  if (!cartorios) return [];
  const items = cartorios[CARTORIO_ITEM];
  if (!items) return [];
  return Array.isArray(items) ? items : [items];
}

function normalizeResponse(result) {
  return {
    RETORNO: result.RETORNO,
    CODIGOERRO: result.CODIGOERRO,
    ERRODESCRICAO: result.ERRODESCRICAO,
    Cartorios: serializeCartorios(result.Cartorios),
  };
}

function businessErrorHint(codigo) {
  const hints = {
    51: "Apenas usuários de cartórios são permitidos.",
    52: "Não foi possível obter os dados do cartório do usuário.",
    53: "Não foi possível obter os cartórios.",
  };
  return hints[codigo] ?? null;
}

async function listCartoriosRestransmitirOe(cfg, oRequest) {
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
    [response] = await client.ListCartoriosRestransmitirOEAsync({ oRequest });
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
    response?.ListCartoriosRestransmitirOEResult ??
    response?.ListCartoriosRestransmitirOEResponse?.ListCartoriosRestransmitirOEResult ??
    response;

  return normalizeResponse(result);
}

async function main() {
  const cfg = loadConfig();
  const hash = await resolveAuthHash(cfg.chave, cfg.loginCfg);
  const oRequest = buildRequest(hash);

  console.log("=== Parâmetros ListCartoriosRestransmitirOE ===");
  console.log(JSON.stringify(oRequest, null, 2));
  console.log(`\nEndpoint: ${cfg.endpoint}`);

  const response = await listCartoriosRestransmitirOe(cfg, oRequest);
  console.log("\n=== Resposta ===");
  console.log(JSON.stringify(response, null, 2));

  if (!response.RETORNO) {
    console.error(
      `\nListCartoriosRestransmitirOE falhou: [${response.CODIGOERRO}] ${response.ERRODESCRICAO}`
    );
    const hint =
      businessErrorHint(response.CODIGOERRO) ?? hashErrorHint(response.CODIGOERRO);
    if (hint) console.error(hint);
    process.exit(1);
  }

  const cartorios = response.Cartorios ?? [];
  console.log(`\nOK — ${cartorios.length} cartório(s) permitido(s) para retransmissão.`);
  for (const row of cartorios.slice(0, 15)) {
    console.log(`  IDCartorio=${row.IDCartorio}: ${row.Cartorio ?? "—"}`);
  }
  if (cartorios.length > 15) {
    console.log(`  ... e mais ${cartorios.length - 15}`);
  }
  console.log(
    "\nUse IDCartorio em OFICIOS_SET_PEDIDO_RETRANSMITIDO_ID_CARTORIO (SetPedidoRetransmitidoOE)."
  );
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
