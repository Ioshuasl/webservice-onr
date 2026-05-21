/** Helpers para EnviarAnexoCertidao — leitura de arquivo e protocolo. */

import fs from "node:fs";
import path from "node:path";
import { envStr, resolvePath } from "./onr_env.js";

const EXTENSOES_PERMITIDAS = new Set([".pdf", ".p7s"]);

export function resolveCertidoesProtocolo(prefix) {
  const protocolo =
    envStr(`${prefix}PROTOCOLO`) ?? envStr("CERTIDOES_PROTOCOLO");
  if (!protocolo) {
    throw new Error(
      `Defina ${prefix}PROTOCOLO ou CERTIDOES_PROTOCOLO no .env ` +
        "(protocolo obtido em ObterXMLSolicitacoes_v6 / portal)."
    );
  }
  return protocolo;
}

function assertExtensaoPermitida(nomeArquivo) {
  const ext = path.extname(nomeArquivo).toLowerCase();
  if (!EXTENSOES_PERMITIDAS.has(ext)) {
    throw new Error(
      `Extensão não permitida (${ext || "sem extensão"}). Use .pdf ou .p7s (erro 25).`
    );
  }
}

/**
 * Carrega NomeArquivo + ArquivoBase64 a partir de ARQUIVO_PATH ou ARQUIVO_BASE64 no .env.
 */
export function loadAnexoArquivo(prefix) {
  const base64Raw = envStr(`${prefix}ARQUIVO_BASE64`);
  const nomeEnv = envStr(`${prefix}NOME_ARQUIVO`);

  if (base64Raw) {
    const nome = nomeEnv || "anexo.pdf";
    assertExtensaoPermitida(nome);
    return { nomeArquivo: nome, arquivoBase64: base64Raw.replace(/\s/g, "") };
  }

  const arquivoPath = envStr(`${prefix}ARQUIVO_PATH`);
  if (!arquivoPath) {
    throw new Error(
      `Defina ${prefix}ARQUIVO_PATH (caminho local .pdf/.p7s) ou ` +
        `${prefix}ARQUIVO_BASE64 no .env.`
    );
  }

  const resolved = resolvePath(arquivoPath);
  if (!fs.existsSync(resolved)) {
    throw new Error(`Arquivo não encontrado: ${resolved}`);
  }

  const nomeArquivo = nomeEnv || path.basename(resolved);
  assertExtensaoPermitida(nomeArquivo);

  const buffer = fs.readFileSync(resolved);
  return {
    nomeArquivo,
    arquivoBase64: buffer.toString("base64"),
    bytes: buffer.length,
  };
}

export function businessErrorHintAnexo(codigo) {
  const hints = {
    14: "Informe NomeArquivo.",
    15: "Informe ArquivoBase64 (conteúdo do arquivo).",
    25: "Somente arquivos .PDF ou .P7S.",
    200: "Protocolo não localizado.",
  };
  return hints[codigo] ?? null;
}
