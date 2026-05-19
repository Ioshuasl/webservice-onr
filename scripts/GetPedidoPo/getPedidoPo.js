/**
 * Consulta um pedido de penhora online (GetPedidoPO) no webservice Penhora Online da ONR.
 */
import fs from "node:fs";
import soap from "soap";
import { envInt, resolvePath } from "../../lib/onr_env.js";
import {
  hashErrorHint,
  loadLoginConfig,
  loadPenhoraOnlineSoapConfig,
  loadServentiaChave,
  resolveAuthHash,
} from "../../lib/onr_penhora_online.js";

function loadConfig() {
  const idPedido = envInt("PENHORA_ONLINE_ID_PEDIDO");
  if (idPedido === undefined) {
    throw new Error(
      "Defina PENHORA_ONLINE_ID_PEDIDO no .env com o ID do pedido (obtido em ListPedidosPO)."
    );
  }

  return {
    chave: loadServentiaChave(),
    loginCfg: loadLoginConfig(),
    idPedido,
    ...loadPenhoraOnlineSoapConfig(),
  };
}

function buildRequest(hashValue, idPedido) {
  return {
    Hash: hashValue,
    IDPedido: idPedido,
  };
}

async function getPedidoPo(cfg, oRequest) {
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
    [response] = await client.GetPedidoPOAsync({ oRequest });
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
    response?.GetPedidoPOResult ??
    response?.GetPedidoPOResponse?.GetPedidoPOResult ??
    response
  );
}

async function main() {
  const cfg = loadConfig();
  const hash = await resolveAuthHash(cfg.chave, cfg.loginCfg);
  const oRequest = buildRequest(hash, cfg.idPedido);

  console.log("=== Parâmetros GetPedidoPO ===");
  console.log(JSON.stringify(oRequest, null, 2));
  console.log(`\nEndpoint: ${cfg.endpoint}`);

  const response = await getPedidoPo(cfg, oRequest);
  console.log("\n=== Resposta ===");
  console.log(JSON.stringify(response, null, 2));

  if (!response.RETORNO) {
    console.error(
      `\nGetPedidoPO falhou: [${response.CODIGOERRO}] ${response.ERRODESCRICAO}`
    );
    const hint = hashErrorHint(response.CODIGOERRO);
    if (hint) console.error(hint);
    process.exit(1);
  }

  console.log(
    `\nOK — Pedido ${cfg.idPedido}: protocolo ${response.Protocolo ?? "—"}, ` +
      `tipo ${response.IDTipoPedido ?? "—"}, status ${response.IDStatus ?? "—"}`
  );
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
