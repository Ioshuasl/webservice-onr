/**
 * Altera dados de um título (UpdateTituloAT) no webservice Acompanhamento de Títulos da ONR.
 */
import fs from "node:fs";
import soap from "soap";
import { envInt, envStr, requireEnvInt, resolvePath } from "../../lib/onr_env.js";
import {
  hashErrorHint,
  loadAcompanhamentoSoapConfig,
  loadLoginConfig,
  loadServentiaChave,
  resolveAuthHash,
} from "../../lib/onr_acompanhamento.js";
import { buildUpdateTituloRequest } from "../../lib/onr_update_titulo_at.js";

const PREFIX = "ACOMPANHAMENTO_TITULOS_UPDATE_";

function envDecimal(key, defaultValue = "0") {
  const raw = envStr(key, defaultValue);
  return Number(raw ?? defaultValue);
}

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
  const required = [
    `${PREFIX}PROTOCOLO`,
    `${PREFIX}APRESENTANTE_NOME`,
    `${PREFIX}DATA_PROTOCOLO`,
    `${PREFIX}DATA_PREVISAO_ENTREGA`,
    `${PREFIX}MODO_NOTIFICACAO`,
    `${PREFIX}INTERESSADO_NOME`,
    `${PREFIX}NATUREZA_TITULO`,
  ];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    throw new Error(`Variáveis ausentes no .env: ${missing.join(", ")}`);
  }

  const tipoSolicitacao = requireEnvInt(`${PREFIX}TIPO_SOLICITACAO`);
  if (tipoSolicitacao !== 1 && tipoSolicitacao !== 2) {
    throw new Error(
      `${PREFIX}TIPO_SOLICITACAO deve ser 1 (Prenotação) ou 2 (Exame e Cálculo).`
    );
  }

  const modo = (envStr(`${PREFIX}MODO_NOTIFICACAO`) || "").toUpperCase();
  if (modo !== "E" && modo !== "S") {
    throw new Error(`${PREFIX}MODO_NOTIFICACAO deve ser E (e-mail) ou S (SMS).`);
  }

  const apresentanteEmail = envStr(`${PREFIX}APRESENTANTE_EMAIL`);
  const apresentanteDdd = envStr(`${PREFIX}APRESENTANTE_DDD`);
  const apresentanteTelefone = envStr(`${PREFIX}APRESENTANTE_TELEFONE`);

  if (modo === "E" && !apresentanteEmail) {
    throw new Error(
      `Com MODO_NOTIFICACAO=E, defina ${PREFIX}APRESENTANTE_EMAIL no .env.`
    );
  }
  if (modo === "S" && (!apresentanteDdd || !apresentanteTelefone)) {
    throw new Error(
      `Com MODO_NOTIFICACAO=S, defina ${PREFIX}APRESENTANTE_DDD e ` +
        `${PREFIX}APRESENTANTE_TELEFONE no .env.`
    );
  }

  const protocoloRaw = envStr(`${PREFIX}PROTOCOLO`) || "";
  const protocolo = protocoloRaw.replace(/\D/g, "");
  if (!protocolo) {
    throw new Error(
      `${PREFIX}PROTOCOLO deve conter apenas dígitos (ex.: 605762). ` +
        `Valor atual: ${JSON.stringify(protocoloRaw)}`
    );
  }
  if (protocolo.length > 11) {
    throw new Error(
      `${PREFIX}PROTOCOLO aceita no máximo 11 dígitos (atual: ${protocolo.length}).`
    );
  }

  return {
    chave: loadServentiaChave(),
    loginCfg: loadLoginConfig(),
    idTitulo: resolveIdTitulo(),
    protocolo,
    apresentanteNome: envStr(`${PREFIX}APRESENTANTE_NOME`),
    apresentanteEmail,
    apresentanteDdd,
    apresentanteTelefone,
    apresentanteCpfcnpj: envStr(`${PREFIX}APRESENTANTE_CPFCNPJ`),
    valorDeposito: envDecimal(`${PREFIX}VALOR_DEPOSITO`, "0"),
    valorEmolumentos: envDecimal(`${PREFIX}VALOR_EMOLUMENTOS`, "0"),
    dataProtocolo: envStr(`${PREFIX}DATA_PROTOCOLO`),
    dataPrevisaoEntrega: envStr(`${PREFIX}DATA_PREVISAO_ENTREGA`),
    modoNotificacao: modo,
    interessadoNome: envStr(`${PREFIX}INTERESSADO_NOME`),
    interessadoCpfcnpj: envStr(`${PREFIX}INTERESSADO_CPFCNPJ`),
    naturezaTitulo: envStr(`${PREFIX}NATUREZA_TITULO`),
    codigoVerificador: envStr(`${PREFIX}CODIGO_VERIFICADOR`),
    tipoSolicitacao,
    ...loadAcompanhamentoSoapConfig(),
  };
}

async function updateTituloAt(cfg, oRequest) {
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
    [response] = await client.UpdateTituloATAsync({ oRequest });
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
    response?.UpdateTituloATResult ??
    response?.UpdateTituloATResponse?.UpdateTituloATResult ??
    response
  );
}

async function main() {
  const cfg = loadConfig();
  const hash = await resolveAuthHash(cfg.chave, cfg.loginCfg);
  const oRequest = buildUpdateTituloRequest(hash, cfg);

  console.log("=== Parâmetros UpdateTituloAT ===");
  console.log(JSON.stringify(oRequest, null, 2));
  console.log(`\nEndpoint: ${cfg.endpoint}`);

  const response = await updateTituloAt(cfg, oRequest);
  console.log("\n=== Resposta ===");
  console.log(JSON.stringify(response, null, 2));

  if (!response.RETORNO) {
    console.error(
      `\nUpdateTituloAT falhou: [${response.CODIGOERRO}] ${response.ERRODESCRICAO}`
    );
    if (response.CODIGOERRO === 12) {
      console.error(
        `Dica: ${PREFIX}ID_TITULO / ACOMPANHAMENTO_TITULOS_ID_TITULO inválido.`
      );
    }
    if (response.CODIGOERRO === 27 || response.CODIGOERRO === 28) {
      console.error(`Dica: ${PREFIX}PROTOCOLO só com dígitos (até 11).`);
    }
    if (response.CODIGOERRO === 32) {
      console.error("Dica: sem permissão para alterar título (spec cód. 32).");
    }
    if (
      response.CODIGOERRO === 0 &&
      response.ERRODESCRICAO?.includes("IDMsg")
    ) {
      console.error(
        "Dica: envie todos os elementos do WSDL (opcionais como string vazia)."
      );
    }
    const hint = hashErrorHint(response.CODIGOERRO);
    if (hint) console.error(hint);
    process.exit(1);
  }

  console.log(
    `\nOK — Título ${cfg.idTitulo} atualizado (protocolo ${cfg.protocolo}).`
  );
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
