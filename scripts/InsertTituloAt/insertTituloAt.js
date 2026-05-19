/**
 * Cadastra um título com status inicial (InsertTituloAT) no webservice Acompanhamento de Títulos da ONR.
 */
import fs from "node:fs";
import soap from "soap";
import { envStr, requireEnvInt, resolvePath } from "../../lib/onr_env.js";
import {
  hashErrorHint,
  loadAcompanhamentoSoapConfig,
  loadLoginConfig,
  loadServentiaChave,
  resolveAuthHash,
} from "../../lib/onr_acompanhamento.js";
import { buildInsertTituloRequest } from "../../lib/onr_insert_titulo_at.js";

const PREFIX = "ACOMPANHAMENTO_TITULOS_INSERT_";

function envDecimal(key, defaultValue = "0") {
  const raw = envStr(key, defaultValue);
  return Number(raw ?? defaultValue);
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
    `${PREFIX}ID_TIPO_STATUS`,
    `${PREFIX}DATA_STATUS`,
    `${PREFIX}CODIGO_VERIFICADOR`,
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

  const idTipoStatus = requireEnvInt(`${PREFIX}ID_TIPO_STATUS`);

  const codigoVerificador = envStr(`${PREFIX}CODIGO_VERIFICADOR`);
  if (!codigoVerificador?.trim()) {
    throw new Error(
      `Defina ${PREFIX}CODIGO_VERIFICADOR no .env. ` +
        "O serviço ONR exige este campo (erro 36 se omitido). " +
        "Copie de um título existente (GetTituloAT → CodigoVerificador)."
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
    codigoVerificador: codigoVerificador.trim(),
    tipoSolicitacao,
    idTipoStatus,
    dataStatus: envStr(`${PREFIX}DATA_STATUS`),
    descricaoStatus: envStr(`${PREFIX}DESCRICAO_STATUS`),
    ...loadAcompanhamentoSoapConfig(),
  };
}

async function insertTituloAt(cfg, oRequest) {
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
    [response] = await client.InsertTituloATAsync({ oRequest });
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
    response?.InsertTituloATResult ??
    response?.InsertTituloATResponse?.InsertTituloATResult ??
    response
  );
}

async function main() {
  const cfg = loadConfig();
  const hash = await resolveAuthHash(cfg.chave, cfg.loginCfg);
  const oRequest = buildInsertTituloRequest(hash, cfg);

  console.log("=== Parâmetros InsertTituloAT ===");
  console.log(JSON.stringify(oRequest, null, 2));
  console.log(`\nEndpoint: ${cfg.endpoint}`);

  const response = await insertTituloAt(cfg, oRequest);
  console.log("\n=== Resposta ===");
  console.log(JSON.stringify(response, null, 2));

  if (!response.RETORNO) {
    console.error(
      `\nInsertTituloAT falhou: [${response.CODIGOERRO}] ${response.ERRODESCRICAO}`
    );
    if (response.CODIGOERRO === 501 && response.IDTitulo) {
      console.error(
        `Dica: protocolo já cadastrado — IDTitulo existente: ${response.IDTitulo}`
      );
    }
    if (response.CODIGOERRO === 36) {
      console.error(
        `Dica: informe ${PREFIX}CODIGO_VERIFICADOR no .env ` +
          "(até 20 caracteres; veja CodigoVerificador em GetTituloAT)."
      );
    }
    if (response.CODIGOERRO === 13 || response.CODIGOERRO === 50) {
      console.error(
        `Dica: ${PREFIX}PROTOCOLO só com dígitos (até 11), único no cartório. ` +
          "Exemplo real: 605762. Status inicial sugerido: ID_TIPO_STATUS=4 (Título prenotado)."
      );
    }
    if (response.CODIGOERRO === 22) {
      console.error(
        `Dica: ${PREFIX}ID_TIPO_STATUS inválido — veja § 3.2.1 (ex.: 4 = Título prenotado).`
      );
    }
    if (
      response.CODIGOERRO === 0 &&
      response.ERRODESCRICAO?.includes("IDMsg")
    ) {
      console.error(
        "Dica: o serviço .NET exige todos os elementos do WSDL no XML, " +
          "inclusive opcionais vazios (telefone, CPF/CNPJ, DescricaoStatus). " +
          "Os scripts já enviam string vazia nesses campos; se persistir, informe o IDMsg à ONR."
      );
    }
    if (response.CODIGOERRO === 101) {
      console.error(
        "Dica: erro ao persistir o título (101). Verifique permissão (cód. 32), CNS (502) e dados do .env."
      );
    }
    const hint = hashErrorHint(response.CODIGOERRO);
    if (hint) console.error(hint);
    process.exit(1);
  }

  console.log(
    `\nOK — Título cadastrado: IDTitulo=${response.IDTitulo}, ` +
      `IDStatus=${response.IDStatus}, protocolo ${cfg.protocolo}`
  );
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
