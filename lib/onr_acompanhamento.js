import path from "node:path";
import { envInt, envStr, ROOT, stripQuotes } from "./onr_env.js";
import { computeOnrAuthHash, pickToken } from "./onr_hash.js";
import { loginTokens } from "./onr_login.js";

export function loadServentiaChave() {
  const chave = envStr("ONR_SERVENTIA_CHAVE");
  if (!chave) {
    throw new Error(
      "Defina ONR_SERVENTIA_CHAVE no .env com a chave única da serventia " +
        "(fornecida pela ONR via oficioeletronico@onr.org)."
    );
  }
  return chave;
}

export function loadLoginConfig() {
  const autoLogin = ["1", "true", "yes"].includes(
    (process.env.ACOMPANHAMENTO_TITULOS_AUTO_LOGIN || "true").toLowerCase()
  );
  const hashOverride = envStr("ONR_HASH_OVERRIDE");
  if (!autoLogin || hashOverride) return null;

  const loginRequired = [
    "CERT_PATH",
    "CERT_PASSWORD",
    "CPF",
    "EMAIL",
    "ONR_SERVENTIA_ID",
  ];
  const loginMissing = loginRequired.filter((k) => !process.env[k]);
  if (loginMissing.length) {
    throw new Error(`Para login automático, preencha: ${loginMissing.join(", ")}`);
  }

  return {
    certPath: stripQuotes(process.env.CERT_PATH),
    certPassword: stripQuotes(process.env.CERT_PASSWORD),
    cpf: process.env.CPF.replace(/\D/g, ""),
    email: process.env.EMAIL.trim(),
    idParceiroWs: Number(process.env.ONR_SERVENTIA_ID),
    wsdlPath:
      process.env.ONR_WSDL_LOGIN_PATH || path.join(ROOT, "wsdl", "login.wsdl"),
    endpoint:
      process.env.ONR_LOGIN_ENDPOINT ||
      "https://hml3-wsoficio.onr.org.br/login.asmx",
    publickeyFormat: process.env.PUBLICKEY_FORMAT || "base64_der",
    validuntilFormat: process.env.VALIDUNTIL_FORMAT || "iso",
  };
}

export function loadAcompanhamentoSoapConfig() {
  return {
    wsdlPath:
      process.env.ACOMPANHAMENTO_TITULOS_WSDL_PATH ||
      path.join(ROOT, "wsdl", "acompanhamentotitulos.wsdl"),
    endpoint:
      process.env.ACOMPANHAMENTO_TITULOS_ENDPOINT ||
      "https://hml3-wsoficio.onr.org.br/acompanhamentotitulos.asmx",
  };
}

export async function resolveAuthHash(chave, loginCfg) {
  const hashOverride = envStr("ONR_HASH_OVERRIDE");
  if (hashOverride) return hashOverride;

  if (!loginCfg) {
    throw new Error(
      "Defina ONR_HASH_OVERRIDE ou ACOMPANHAMENTO_TITULOS_AUTO_LOGIN=true " +
        "com credenciais de login."
    );
  }

  const tokens = await loginTokens(loginCfg);
  const tokenIndex = envInt("ONR_HASH_TOKEN_INDEX", 0);
  const token = pickToken(tokens, tokenIndex);
  const hash = computeOnrAuthHash(chave, token);
  console.log(
    `Token usado: ${token} (índice ${tokenIndex}, ${tokens.length} disponíveis)`
  );
  console.log(`Hash SHA-1(chave+token): ${hash}`);
  return hash;
}

export function hashErrorHint(codigoErro) {
  if (codigoErro === 45) {
    return (
      "Dica: cada token só pode ser usado uma vez. Aumente ONR_HASH_TOKEN_INDEX " +
      "ou execute login novamente para obter novos tokens."
    );
  }
  return null;
}
