/**
 * Devolve pedido de certidão por matrícula (SetPedidoMatriculaDevolvidoPO) no webservice Penhora Online da ONR.
 */
import fs from "node:fs";
import soap from "soap";
import { envInt, envStr, resolvePath } from "../../lib/onr_env.js";
import {
  hashErrorHint,
  loadLoginConfig,
  loadPenhoraOnlineSoapConfig,
  loadServentiaChave,
  resolveAuthHash,
} from "../../lib/onr_penhora_online.js";

const PREFIX = "PENHORA_ONLINE_SET_PEDIDO_MATRICULA_DEVOLVIDO_";
const FIELD_ORDER = ["Hash", "IDPedido", "Resposta"];

function resolveIdPedido() {
  const id =
    envInt(`${PREFIX}ID_PEDIDO`) ?? envInt("PENHORA_ONLINE_ID_PEDIDO");
  if (id === undefined) {
    throw new Error(
      `Defina ${PREFIX}ID_PEDIDO ou PENHORA_ONLINE_ID_PEDIDO no .env ` +
        "(IDPedido de ListPedidosPO / GetPedidoPO; tipo Matrícula = IDTipoPedido 1)."
    );
  }
  return id;
}

function loadConfig() {
  const resposta = envStr(`${PREFIX}RESPOSTA`);
  if (!resposta) {
    throw new Error(`Defina ${PREFIX}RESPOSTA no .env (motivo da devolução).`);
  }

  return {
    chave: loadServentiaChave(),
    loginCfg: loadLoginConfig(),
    idPedido: resolveIdPedido(),
    resposta,
    ...loadPenhoraOnlineSoapConfig(),
  };
}

function buildRequest(cfg, hashValue) {
  const values = {
    Hash: hashValue,
    IDPedido: cfg.idPedido,
    Resposta: cfg.resposta,
  };
  return Object.fromEntries(FIELD_ORDER.map((key) => [key, values[key]]));
}

function businessErrorHint(codigo) {
  const hints = {
    12: "IDPedido inválido.",
    13: "Informe Resposta (motivo da devolução).",
    51: "Não foi possível obter dados do pedido (tipo Matrícula / IDTipoPedido=1?).",
    52: "Sem permissão para devolver este pedido.",
    53: "Operação só para pedidos tipo Certidão por Matrícula (IDTipoPedido=1).",
  };
  return hints[codigo] ?? null;
}

async function setPedidoMatriculaDevolvidoPo(cfg, oRequest) {
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
    [response] = await client.SetPedidoMatriculaDevolvidoPOAsync({ oRequest });
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
    response?.SetPedidoMatriculaDevolvidoPOResult ??
    response?.SetPedidoMatriculaDevolvidoPOResponse
      ?.SetPedidoMatriculaDevolvidoPOResult ??
    response
  );
}

async function main() {
  const cfg = loadConfig();
  const hash = await resolveAuthHash(cfg.chave, cfg.loginCfg);
  const oRequest = buildRequest(cfg, hash);

  console.log("=== Parâmetros SetPedidoMatriculaDevolvidoPO ===");
  console.log(JSON.stringify(oRequest, null, 2));
  console.log(`\nEndpoint: ${cfg.endpoint}`);

  const response = await setPedidoMatriculaDevolvidoPo(cfg, oRequest);
  console.log("\n=== Resposta ===");
  console.log(JSON.stringify(response, null, 2));

  if (!response.RETORNO) {
    console.error(
      `\nSetPedidoMatriculaDevolvidoPO falhou: [${response.CODIGOERRO}] ${response.ERRODESCRICAO}`
    );
    const hint =
      businessErrorHint(response.CODIGOERRO) ?? hashErrorHint(response.CODIGOERRO);
    if (hint) console.error(hint);
    process.exit(1);
  }

  console.log(
    `\nOK — Pedido matrícula ${cfg.idPedido} devolvido (motivo registrado no ONR).`
  );
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
