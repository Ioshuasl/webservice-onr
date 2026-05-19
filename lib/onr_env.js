import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(__dirname, "..");

dotenv.config({ path: path.join(ROOT, ".env") });

export function stripQuotes(value) {
  const trimmed = String(value ?? "").trim();
  if (
    trimmed.length >= 2 &&
    ((trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith("'") && trimmed.endsWith("'")))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

export function envStr(key, defaultValue = undefined) {
  const raw = process.env[key];
  if (raw === undefined || raw === "") return defaultValue;
  return stripQuotes(raw);
}

export function envInt(key, defaultValue = undefined) {
  const raw = process.env[key];
  if (raw === undefined || raw === "") return defaultValue;
  const text = stripQuotes(raw).trim();
  if (!/^-?\d+$/.test(text)) {
    throw new Error(
      `${key} deve ser um número inteiro (valor atual: ${JSON.stringify(text)}). ` +
        "Remova placeholders de exemplo do .env."
    );
  }
  return Number(text);
}

export function requireEnvInt(key) {
  const value = envInt(key);
  if (value === undefined) {
    throw new Error(`Defina ${key} no .env (número inteiro).`);
  }
  return value;
}

export function resolvePath(relativeOrAbsolute) {
  if (path.isAbsolute(relativeOrAbsolute)) return relativeOrAbsolute;
  return path.join(ROOT, relativeOrAbsolute);
}
