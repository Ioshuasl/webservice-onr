import crypto from "node:crypto";

/**
 * Hash ONR: SHA-1(chave + token), UTF-8, hexadecimal maiúsculo.
 */
export function computeOnrAuthHash(chave, token) {
  return crypto
    .createHash("sha1")
    .update(`${chave}${token}`, "utf8")
    .digest("hex")
    .toUpperCase();
}

export function pickToken(tokens, index) {
  if (!tokens.length) {
    throw new Error("Nenhum token disponível (faça login antes).");
  }
  const idx =
    index !== undefined ? index : Number(process.env.ONR_HASH_TOKEN_INDEX || "0");
  if (idx < 0 || idx >= tokens.length) {
    throw new Error(
      `ONR_HASH_TOKEN_INDEX=${idx} fora do intervalo (0..${tokens.length - 1}).`
    );
  }
  return tokens[idx];
}
