#!/usr/bin/env python3
"""Lista arquivos XML importados no BD Light (ListArquivosXMLBDL) no webservice ONR."""

from __future__ import annotations

import json
import os
import sys
from pathlib import Path

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
from lib.onr_env import env_int, env_str  # noqa: E402
from lib.onr_json import to_json_safe  # noqa: E402
from lib.onr_soap import call_operation_from_cfg  # noqa: E402
from lib.onr_zeep_serialize import serialize_zeep_list  # noqa: E402

FIELD_ORDER = (
    "Hash",
    "MaxRowPerPage",
    "PageNumber",
    "DataInicial",
    "DataFinal",
)

ARQUIVO_ITEM = "ListArquivosXMLBDL_Arquivos_WSResp"


def load_config() -> dict:
    load_dotenv(ROOT / ".env")

    required = ["BDLIGHT_DATA_INICIAL", "BDLIGHT_DATA_FINAL"]
    missing = [k for k in required if not os.getenv(k)]
    if missing:
        raise SystemExit(f"Variáveis ausentes no .env: {', '.join(missing)}")

    max_row = env_int("BDLIGHT_MAX_ROW_PER_PAGE", 50)
    if max_row is not None and max_row < 10:
        raise SystemExit(
            "BDLIGHT_MAX_ROW_PER_PAGE deve ser >= 10 (regra do webservice)."
        )

    return {
        "chave": load_serventia_chave(),
        "login_cfg": load_login_config(),
        "max_row_per_page": max_row or 50,
        "page_number": env_int("BDLIGHT_PAGE_NUMBER", 1),
        "data_inicial": env_str("BDLIGHT_DATA_INICIAL"),
        "data_final": env_str("BDLIGHT_DATA_FINAL"),
        **load_bdlight_soap_config(),
    }


def build_request(cfg: dict, hash_value: str) -> dict:
    values = {
        "Hash": hash_value,
        "MaxRowPerPage": cfg["max_row_per_page"],
        "PageNumber": cfg["page_number"],
        "DataInicial": cfg["data_inicial"],
        "DataFinal": cfg["data_final"],
    }
    return {key: values[key] for key in FIELD_ORDER}


def build_response(result) -> dict:
    return {
        "RETORNO": result.RETORNO,
        "CODIGOERRO": result.CODIGOERRO,
        "ERRODESCRICAO": result.ERRODESCRICAO,
        "QtdeRegistros": result.QtdeRegistros,
        "QtdePaginas": result.QtdePaginas,
        "Arquivos": serialize_zeep_list(result.Arquivos, ARQUIVO_ITEM),
    }


def _business_error_hint(codigo: int) -> str | None:
    hints = {
        12: "MaxRowPerPage inválido (mínimo 10).",
        13: "PageNumber inválido.",
        14: "Informe DataInicial (aaaa-mm-dd).",
        15: "Informe DataFinal (aaaa-mm-dd).",
        16: "DataInicial inválida.",
        17: "DataFinal inválida.",
        18: "Período de importação máximo 90 dias.",
        30: "Página além do máximo disponível.",
        51: "Não foi possível obter os arquivos.",
    }
    return hints.get(codigo)


def main() -> int:
    cfg = load_config()
    hash_value = resolve_auth_hash(cfg["chave"], cfg["login_cfg"])
    o_request = build_request(cfg, hash_value)

    print("=== Parâmetros ListArquivosXMLBDL ===")
    print(json.dumps(o_request, ensure_ascii=False, indent=2))
    print(f"\nEndpoint: {cfg['endpoint']}")

    result = call_operation_from_cfg(cfg, "ListArquivosXMLBDL", o_request)
    response = to_json_safe(build_response(result))

    print("\n=== Resposta ===")
    print(json.dumps(response, ensure_ascii=False, indent=2))

    if not response.get("RETORNO"):
        codigo = response.get("CODIGOERRO", "?")
        descricao = response.get("ERRODESCRICAO", "")
        print(
            f"\nListArquivosXMLBDL falhou: [{codigo}] {descricao}",
            file=sys.stderr,
        )
        if isinstance(codigo, int):
            hint = _business_error_hint(codigo) or hash_error_hint(codigo)
            if hint:
                print(hint, file=sys.stderr)
        return 1

    arquivos_count = len(response.get("Arquivos") or [])
    print(
        f"\nOK — {response.get('QtdeRegistros')} registro(s), "
        f"{response.get('QtdePaginas')} página(s), "
        f"{arquivos_count} arquivo(s) nesta página."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
