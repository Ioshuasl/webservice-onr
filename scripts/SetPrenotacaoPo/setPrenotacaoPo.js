/**
 * Cadastra/atualiza prenotação de pedido penhora (SetPrenotacaoPO) no webservice Penhora Online da ONR.
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

const PREFIX = "PENHORA_ONLINE_SET_PRENOTACAO_";
const FIELD_ORDER = [
  "Hash",
  "IDPedido",
  "NumeroPrenotacao",
  "DataPrenotacao",
  "DataVencimento",
];

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
  const required = [
    `${PREFIX}NUMERO`,
    `${PREFIX}DATA_PRENOTACAO`,
    `${PREFIX}DATA_VENCIMENTO`,
  ];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    throw new Error(`Variáveis ausentes no .env: ${missing.join(", ")}`);
  }

  return {
    chave: loadServentiaChave(),
    loginCfg: loadLoginConfig(),
    idPedido: resolveIdPedido(),
    numeroPrenotacao: envStr(`${PREFIX}NUMERO`),
    dataPrenotacao: envStr(`${PREFIX}DATA_PRENOTACAO`),
    dataVencimento: envStr(`${PREFIX}DATA_VENCIMENTO`),
    ...loadPenhoraOnlineSoapConfig(),
  };
}

function buildRequest(cfg, hashValue) {
  const values = {
    Hash: hashValue,
    IDPedido: cfg.idPedido,
    NumeroPrenotacao: cfg.numeroPrenotacao,
    DataPrenotacao: cfg.dataPrenotacao,
    DataVencimento: cfg.dataVencimento,
  };
  return Object.fromEntries(FIELD_ORDER.map((key) => [key, values[key]]));
}

function businessErrorHint(codigo) {
  const hints = {
    12: "IDPedido inválido.",
    13: "Informe NumeroPrenotacao.",
    14: "Informe DataPrenotacao (aaaa-mm-dd).",
    15: "DataPrenotacao inválida.",
    16: "Informe DataVencimento (aaaa-mm-dd).",
    17: "DataVencimento inválida.",
    18: "DataVencimento não pode ser anterior à DataPrenotacao.",
    51: "Não foi possível obter dados do pedido.",
    52: "Sem permissão para cadastrar prenotação neste pedido.",
    53: "Prenotação só para pedidos tipo Penhora (IDTipoPedido=3).",
    54: "Não foi possível cadastrar prenotação.",
    55: "Pedido já possui prenotação cadastrada.",
  };
  return hints[codigo] ?? null;
}

async function setPrenotacaoPo(cfg, oRequest) {
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
    [response] = await client.SetPrenotacaoPOAsync({ oRequest });
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
    response?.SetPrenotacaoPOResult ??
    response?.SetPrenotacaoPOResponse?.SetPrenotacaoPOResult ??
    response
  );
}

async function main() {
  const cfg = loadConfig();
  const hash = await resolveAuthHash(cfg.chave, cfg.loginCfg);
  const oRequest = buildRequest(cfg, hash);

  console.log("=== Parâmetros SetPrenotacaoPO ===");
  console.log(JSON.stringify(oRequest, null, 2));
  console.log(`\nEndpoint: ${cfg.endpoint}`);

  const response = await setPrenotacaoPo(cfg, oRequest);
  console.log("\n=== Resposta ===");
  console.log(JSON.stringify(response, null, 2));

  if (!response.RETORNO) {
    console.error(
      `\nSetPrenotacaoPO falhou: [${response.CODIGOERRO}] ${response.ERRODESCRICAO}`
    );
    const hint =
      businessErrorHint(response.CODIGOERRO) ?? hashErrorHint(response.CODIGOERRO);
    if (hint) console.error(hint);
    process.exit(1);
  }

  console.log(
    `\nOK — Prenotação ${cfg.numeroPrenotacao} registrada no pedido ${cfg.idPedido}.`
  );
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
