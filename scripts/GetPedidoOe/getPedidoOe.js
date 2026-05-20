/**
 * Consulta um pedido de ofício eletrônico (GetPedidoOE) no webservice Ofícios da ONR.
 */
import fs from "node:fs";
import soap from "soap";
import { envInt, resolvePath } from "../../lib/onr_env.js";
import {
  hashErrorHint,
  loadLoginConfig,
  loadOficiosSoapConfig,
  loadServentiaChave,
  resolveAuthHash,
} from "../../lib/onr_oficios.js";

const FIELD_ORDER = ["Hash", "IDPedido"];

function loadConfig() {
  const idPedido = envInt("OFICIOS_ID_PEDIDO");
  if (idPedido === undefined) {
    throw new Error(
      "Defina OFICIOS_ID_PEDIDO no .env com o ID do pedido " +
        "(obtido em ListPedidosOE / ListPedidosOE_V2)."
    );
  }

  return {
    chave: loadServentiaChave(),
    loginCfg: loadLoginConfig(),
    idPedido,
    ...loadOficiosSoapConfig(),
  };
}

function buildRequest(cfg, hashValue) {
  const values = { Hash: hashValue, IDPedido: cfg.idPedido };
  return Object.fromEntries(FIELD_ORDER.map((key) => [key, values[key]]));
}

function businessErrorHint(codigo) {
  const hints = {
    12: "IDPedido inválido ou inexistente.",
    51: "Não foi possível obter os dados do pedido.",
    56: "Usuário sem permissão para acessar o pedido informado.",
  };
  return hints[codigo] ?? null;
}

async function getPedidoOe(cfg, oRequest) {
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
    [response] = await client.GetPedidoOEAsync({ oRequest });
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
    response?.GetPedidoOEResult ??
    response?.GetPedidoOEResponse?.GetPedidoOEResult ??
    response
  );
}

async function main() {
  const cfg = loadConfig();
  const hash = await resolveAuthHash(cfg.chave, cfg.loginCfg);
  const oRequest = buildRequest(cfg, hash);

  console.log("=== Parâmetros GetPedidoOE ===");
  console.log(JSON.stringify(oRequest, null, 2));
  console.log(`\nEndpoint: ${cfg.endpoint}`);

  const response = await getPedidoOe(cfg, oRequest);
  console.log("\n=== Resposta ===");
  console.log(JSON.stringify(response, null, 2));

  if (!response.RETORNO) {
    console.error(
      `\nGetPedidoOE falhou: [${response.CODIGOERRO}] ${response.ERRODESCRICAO}`
    );
    const hint =
      businessErrorHint(response.CODIGOERRO) ?? hashErrorHint(response.CODIGOERRO);
    if (hint) console.error(hint);
    process.exit(1);
  }

  console.log(
    `\nOK — Pedido ${cfg.idPedido}: ` +
      `protocolo ${response.Protocolo ?? "—"}, ` +
      `IDStatus=${response.IDStatus ?? "—"}, ` +
      `instituição ${response.Instituicao ?? "—"}`
  );
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
