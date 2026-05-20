#!/usr/bin/env python3
"""Importa arquivo(s) XML no BD Light (ImportarArquivoBDL) no webservice ONR."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))

from lib.onr_bdlight import (  # noqa: E402
    hash_error_hint,
    load_bdlight_soap_config,
    load_login_config,
    load_serventia_chave,
    resolve_auth_hash,
)
from lib.onr_bdlight_xml import (  # noqa: E402
    BdlightXmlValidationError,
    validate_import_inputs,
)
from lib.onr_env import env_str  # noqa: E402
from lib.onr_json import to_json_safe  # noqa: E402
from lib.onr_soap import call_operation_from_cfg  # noqa: E402
from lib.onr_zeep_serialize import serialize_result  # noqa: E402

PREFIX = "BDLIGHT_IMPORTAR_"
ARQUIVO_ITEM = "ImportarArquivoBDL_Arquivo_WSReq"
FIELD_ORDER = ("Hash", "Arquivos")


def _parse_url_arquivo(value: Any, *, context: str) -> str:
    if isinstance(value, str) and value.strip():
        url = value.strip()
    elif isinstance(value, dict):
        raw = (
            value.get("URLArquivo")
            or value.get("urlArquivo")
            or value.get("url_arquivo")
        )
        if raw is None:
            raise SystemExit(f"{context}: informe URLArquivo.")
        url = str(raw).strip()
    else:
        raise SystemExit(f"{context}: informe URL pública do arquivo .xml.")

    parsed = urlparse(url)
    if parsed.scheme not in ("http", "https") or not parsed.netloc:
        raise SystemExit(f"{context}: URL inválida ({url!r}). Use http(s)://...")
    return url


def _load_arquivos() -> list[dict[str, str]]:
    json_raw = env_str(f"{PREFIX}ARQUIVOS_JSON")
    if json_raw:
        try:
            data = json.loads(json_raw)
        except json.JSONDecodeError as exc:
            raise SystemExit(f"{PREFIX}ARQUIVOS_JSON inválido: {exc}") from exc
        if not isinstance(data, list) or not data:
            raise SystemExit(
                f"{PREFIX}ARQUIVOS_JSON deve ser um array JSON não vazio."
            )
        return [
            {"URLArquivo": _parse_url_arquivo(row, context=f"Item {i}")}
            for i, row in enumerate(data)
        ]

    urls_raw = env_str(f"{PREFIX}URLS")
    if urls_raw:
        parts = [p for p in re.split(r"[,;\s]+", urls_raw.strip()) if p]
        if not parts:
            raise SystemExit(f"{PREFIX}URLS está vazio.")
        return [
            {"URLArquivo": _parse_url_arquivo(p, context="URLS")} for p in parts
        ]

    single = env_str(f"{PREFIX}URL_ARQUIVO")
    if single:
        return [{"URLArquivo": _parse_url_arquivo(single, context="URL_ARQUIVO")}]

    raise SystemExit(
        f"Defina {PREFIX}URL_ARQUIVO, {PREFIX}URLS ou "
        f"{PREFIX}ARQUIVOS_JSON no .env. "
        "A URL deve apontar para um .xml público (máx. 5MB, modelo spec § 4.1)."
    )


def _build_arquivos(items: list[dict[str, str]]) -> dict[str, Any]:
    return {ARQUIVO_ITEM: items}


def load_config() -> dict:
    load_dotenv(ROOT / ".env")

    arquivos = _load_arquivos()
    return {
        "chave": load_serventia_chave(),
        "login_cfg": load_login_config(),
        "arquivos": arquivos,
        **load_bdlight_soap_config(),
    }


def build_request(cfg: dict, hash_value: str) -> dict:
    values = {
        "Hash": hash_value,
        "Arquivos": _build_arquivos(cfg["arquivos"]),
    }
    return {key: values[key] for key in FIELD_ORDER}


def _business_error_hint(codigo: int) -> str | None:
    hints = {
        12: "Nenhum arquivo informado no envelope.",
        50: "Usuário sem permissão para o arquivo informado.",
        60: "Não foi possível desbloquear os arquivos.",
        101: "Não foi possível cadastrar o arquivo.",
        102: "Arquivo não encontrado na URL informada.",
        103: "Não foi possível verificar se o arquivo existe.",
        104: "Extensão não permitida — apenas .xml.",
        105: "Aplicação inválida (conteúdo XML fora do modelo BANCOLIGHT).",
        106: "Arquivo maior que 5MB.",
        501: "Campos obrigatórios não informados no XML.",
        502: "Resposta já existente; aguarde download dos arquivos pela ONR.",
    }
    return hints.get(codigo)


def main() -> int:
    cfg = load_config()

    try:
        checks = validate_import_inputs(cfg["arquivos"])
    except BdlightXmlValidationError as exc:
        print(exc, file=sys.stderr)
        return 1

    for check in checks:
        print(
            f"XML OK ({check['source']}): "
            f"{check['individuos']} INDIVIDUO(s) — padrão BANCOLIGHT."
        )

    hash_value = resolve_auth_hash(cfg["chave"], cfg["login_cfg"])
    o_request = build_request(cfg, hash_value)

    print("=== Parâmetros ImportarArquivoBDL ===")
    print(json.dumps(o_request, ensure_ascii=False, indent=2))
    print(f"\nEndpoint: {cfg['endpoint']}")

    result = call_operation_from_cfg(cfg, "ImportarArquivoBDL", o_request)
    response = to_json_safe(serialize_result(result))

    print("\n=== Resposta ===")
    print(json.dumps(response, ensure_ascii=False, indent=2))

    if not response.get("RETORNO"):
        codigo = response.get("CODIGOERRO", "?")
        descricao = response.get("ERRODESCRICAO", "")
        print(
            f"\nImportarArquivoBDL falhou: [{codigo}] {descricao}",
            file=sys.stderr,
        )
        if isinstance(codigo, int):
            hint = _business_error_hint(codigo) or hash_error_hint(codigo)
            if hint:
                print(hint, file=sys.stderr)
        return 1

    urls = [a["URLArquivo"] for a in cfg["arquivos"]]
    print(
        f"\nOK — {len(urls)} arquivo(s) enfileirado(s) para importação. "
        "Consulte o status com ListArquivosXMLBDL após o processamento."
    )
    for url in urls:
        print(f"  - {url}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
