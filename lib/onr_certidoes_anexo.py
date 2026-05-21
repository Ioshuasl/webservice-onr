"""Helpers para EnviarAnexoCertidao — leitura de arquivo e protocolo."""

from __future__ import annotations

import base64
from pathlib import Path

from lib.onr_env import env_str, resolve_path

_EXTENSOES_PERMITIDAS = frozenset({".pdf", ".p7s"})


def resolve_certidoes_protocolo(prefix: str) -> str:
    protocolo = env_str(f"{prefix}PROTOCOLO")
    if not protocolo:
        protocolo = env_str("CERTIDOES_PROTOCOLO")
    if not protocolo:
        raise SystemExit(
            f"Defina {prefix}PROTOCOLO ou CERTIDOES_PROTOCOLO no .env "
            "(protocolo obtido em ObterXMLSolicitacoes_v6 / portal)."
        )
    return protocolo


def _assert_extensao_permitida(nome_arquivo: str) -> None:
    ext = Path(nome_arquivo).suffix.lower()
    if ext not in _EXTENSOES_PERMITIDAS:
        raise SystemExit(
            f"Extensão não permitida ({ext or 'sem extensão'}). Use .pdf ou .p7s (erro 25)."
        )


def load_anexo_arquivo(prefix: str) -> dict:
    """Retorna nome_arquivo, arquivo_base64 e opcionalmente bytes."""
    base64_raw = env_str(f"{prefix}ARQUIVO_BASE64")
    nome_env = env_str(f"{prefix}NOME_ARQUIVO")

    if base64_raw:
        nome = nome_env or "anexo.pdf"
        _assert_extensao_permitida(nome)
        return {
            "nome_arquivo": nome,
            "arquivo_base64": "".join(base64_raw.split()),
        }

    arquivo_path = env_str(f"{prefix}ARQUIVO_PATH")
    if not arquivo_path:
        raise SystemExit(
            f"Defina {prefix}ARQUIVO_PATH (caminho local .pdf/.p7s) ou "
            f"{prefix}ARQUIVO_BASE64 no .env."
        )

    resolved = resolve_path(arquivo_path)
    if not resolved.is_file():
        raise SystemExit(f"Arquivo não encontrado: {resolved}")

    nome_arquivo = nome_env or resolved.name
    _assert_extensao_permitida(nome_arquivo)

    data = resolved.read_bytes()
    return {
        "nome_arquivo": nome_arquivo,
        "arquivo_base64": base64.b64encode(data).decode("ascii"),
        "bytes": len(data),
    }


def business_error_hint_anexo(codigo: int) -> str | None:
    hints = {
        14: "Informe NomeArquivo.",
        15: "Informe ArquivoBase64 (conteúdo do arquivo).",
        25: "Somente arquivos .PDF ou .P7S.",
        200: "Protocolo não localizado.",
    }
    return hints.get(codigo)
