import fs from "node:fs";
import soap from "soap";
import { extractFromPfx } from "./cert_extract.js";
import { resolvePath } from "./onr_env.js";

export async function loginTokens(cfg) {
  const wsdlPath = resolvePath(cfg.wsdlPath);
  if (!fs.existsSync(wsdlPath)) {
    throw new Error(`WSDL de login não encontrado: ${wsdlPath}`);
  }

  const certFields = extractFromPfx(cfg.certPath, cfg.certPassword, {
    publickeyFormat: cfg.publickeyFormat || "base64_der",
    validuntilFormat: cfg.validuntilFormat || "iso",
  });

  const oRequest = {
    SUBJECTCN: certFields.SUBJECTCN,
    ISSUERO: certFields.ISSUERO,
    PUBLICKEY: certFields.PUBLICKEY,
    SERIALNUMBER: certFields.SERIALNUMBER,
    VALIDUNTIL: certFields.VALIDUNTIL,
    CPF: cfg.cpf,
    EMAIL: cfg.email,
    IDParceiroWS: cfg.idParceiroWs,
  };

  const client = await soap.createClientAsync(wsdlPath, {
    endpoint: cfg.endpoint,
    forceSoap12Headers: false,
    wsdl_options: { timeout: 60000 },
  });

  const [response] = await client.LoginUsuarioCertificadoAsync({ oRequest });
  const result =
    response?.LoginUsuarioCertificadoResult ??
    response?.LoginUsuarioCertificadoResponse?.LoginUsuarioCertificadoResult ??
    response;

  if (!result?.RETORNO) {
    throw new Error(
      `Login falhou: [${result?.CODIGOERRO}] ${result?.ERRODESCRICAO}`
    );
  }

  const tokens = result?.Tokens?.string;
  const list = Array.isArray(tokens) ? tokens : tokens ? [tokens] : [];
  if (!list.length) {
    throw new Error("Login OK, porém nenhum token (Hash) foi retornado.");
  }
  return list;
}
