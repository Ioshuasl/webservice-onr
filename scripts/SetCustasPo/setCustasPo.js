/**
 * Informa valor de custas de pedido penhora (SetCustasPO) no webservice Penhora Online da ONR.
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

const PREFIX = "PENHORA_ONLINE_SET_CUSTAS_";
const FIELD_ORDER = ["Hash", "IDPedido", "ValorCustas"];

function envDecimal(key) {
  const raw = envStr(key);
  if (!raw || raw.trim() === "") {
    throw new Error(`Defina ${key} no .env (valor decimal, ex.: 50.00).`);
  }
  const text = raw.replace(",", ".").trim();
  const value = Number(text);
  if (Number.isNaN(value)) {
    throw new Error(`${key} deve ser um valor decimal (valor atual: ${raw}).`);
  }
  return value;
}

function resolveIdPedido() {
  const id =
    envInt(`${PREFIX}ID_PEDIDO`) ?? envInt("PENHORA_ONLINE_ID_PEDIDO");
  if (id === undefined) {
    throw new Error(
      `Defina ${PREFIX}ID_PEDIDO ou PENHORA_ONLINE_ID_PEDIDO no .env ` +
        "(IDPedido de ListPedidosPO / GetPedidoPO)."
    );
  }
  return id;
}

function loadConfig() {
  return {
    chave: loadServentiaChave(),
    loginCfg: loadLoginConfig(),
    idPedido: resolveIdPedido(),
    valorCustas: envDecimal(`${PREFIX}VALOR`),
    ...loadPenhoraOnlineSoapConfig(),
  };
}

function buildRequest(cfg, hashValue) {
  const values = {
    Hash: hashValue,
    IDPedido: cfg.idPedido,
    ValorCustas: cfg.valorCustas,
  };
  return Object.fromEntries(FIELD_ORDER.map((key) => [key, values[key]]));
}

function businessErrorHint(codigo) {
  const hints = {
    12: "IDPedido inválido.",
    13: "ValorCustas inválido.",
    51: "Não foi possível obter dados do pedido.",
    52: "Sem permissão para informar custas neste pedido.",
    53: "Custas só para pedidos tipo Penhora (IDTipoPedido=3).",
    54: "Pedido ainda sem prenotação — execute SetPrenotacaoPO antes.",
    55: "Valor das custas já informado.",
    56: "Pedido não exige emolumentos.",
    57: "Não foi possível obter dados do cartório.",
    58: "Cartório sem permissão para informar custas.",
    59: "Não foi possível informar custas.",
  };
  return hints[codigo] ?? null;
}

async function setCustasPo(cfg, oRequest) {
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
    [response] = await client.SetCustasPOAsync({ oRequest });
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
    response?.SetCustasPOResult ??
    response?.SetCustasPOResponse?.SetCustasPOResult ??
    response
  );
}

async function main() {
  const cfg = loadConfig();
  const hash = await resolveAuthHash(cfg.chave, cfg.loginCfg);
  const oRequest = buildRequest(cfg, hash);

  console.log("=== Parâmetros SetCustasPO ===");
  console.log(JSON.stringify(oRequest, null, 2));
  console.log(`\nEndpoint: ${cfg.endpoint}`);

  const response = await setCustasPo(cfg, oRequest);
  console.log("\n=== Resposta ===");
  console.log(JSON.stringify(response, null, 2));

  if (!response.RETORNO) {
    console.error(
      `\nSetCustasPO falhou: [${response.CODIGOERRO}] ${response.ERRODESCRICAO}`
    );
    const hint =
      businessErrorHint(response.CODIGOERRO) ?? hashErrorHint(response.CODIGOERRO);
    if (hint) console.error(hint);
    process.exit(1);
  }

  console.log(
    `\nOK — Custas R$ ${cfg.valorCustas} informadas no pedido ${cfg.idPedido}.`
  );
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
