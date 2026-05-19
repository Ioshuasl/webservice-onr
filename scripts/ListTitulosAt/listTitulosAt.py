#!/usr/bin/env python3
"""Lista títulos (ListTitulosAT) no webservice Acompanhamento de Títulos da ONR."""

from __future__ import annotations

import json
import os
import sys
from pathlib import Path

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))

from lib.onr_acompanhamento import (  # noqa: E402
    hash_error_hint,
    load_acompanhamento_soap_config,
    load_login_config,
    load_serventia_chave,
    resolve_auth_hash,
)
from lib.onr_env import env_int, env_str  # noqa: E402
from lib.onr_json import to_json_safe  # noqa: E402
from lib.onr_soap import call_operation_from_cfg  # noqa: E402
from lib.onr_zeep_serialize import serialize_zeep_list  # noqa: E402


def load_config() -> dict:
    load_dotenv(ROOT / ".env")

    required = [
        "ACOMPANHAMENTO_TITULOS_DATA_PROTOCOLO_INICIO",
        "ACOMPANHAMENTO_TITULOS_DATA_PROTOCOLO_FINAL",
    ]
    missing = [k for k in required if not os.getenv(k)]
    if missing:
        raise SystemExit(f"Variáveis ausentes no .env: {', '.join(missing)}")

    protocolo = env_str("ACOMPANHAMENTO_TITULOS_PROTOCOLO")
    apresentante = env_str("ACOMPANHAMENTO_TITULOS_APRESENTANTE")

    return {
        "chave": load_serventia_chave(),
        "login_cfg": load_login_config(),
        "max_row_per_page": env_int("ACOMPANHAMENTO_TITULOS_MAX_ROW_PER_PAGE", 50),
        "page_number": env_int("ACOMPANHAMENTO_TITULOS_PAGE_NUMBER", 1),
        "protocolo": protocolo or None,
        "data_protocolo_inicio": env_str("ACOMPANHAMENTO_TITULOS_DATA_PROTOCOLO_INICIO"),
        "data_protocolo_final": env_str("ACOMPANHAMENTO_TITULOS_DATA_PROTOCOLO_FINAL"),
        "id_tipo_status": env_int("ACOMPANHAMENTO_TITULOS_ID_TIPO_STATUS", -1),
        "exportado": env_int("ACOMPANHAMENTO_TITULOS_EXPORTADO", -1),
        "apresentante": apresentante or None,
        **load_acompanhamento_soap_config(),
    }


def build_request(cfg: dict, hash_value: str) -> dict:
    o_request = {
        "Hash": hash_value,
        "MaxRowPerPage": cfg["max_row_per_page"],
        "PageNumber": cfg["page_number"],
        "DataProtocoloInicio": cfg["data_protocolo_inicio"],
        "DataProtocoloFinal": cfg["data_protocolo_final"],
        "IDTipoStatus": cfg["id_tipo_status"],
        "Exportado": cfg["exportado"],
    }
    if cfg["protocolo"]:
        o_request["Protocolo"] = cfg["protocolo"]
    if cfg["apresentante"]:
        o_request["Apresentante"] = cfg["apresentante"]
    return o_request


def build_response(result) -> dict:
    return {
        "RETORNO": result.RETORNO,
        "CODIGOERRO": result.CODIGOERRO,
        "ERRODESCRICAO": result.ERRODESCRICAO,
        "QtdeRegistros": result.QtdeRegistros,
        "QtdePaginas": result.QtdePaginas,
        "Titulos": serialize_zeep_list(result.Titulos, "ListTitulosAT_Titulos_WSResp"),
    }


def main() -> int:
    cfg = load_config()
    hash_value = resolve_auth_hash(cfg["chave"], cfg["login_cfg"])
    o_request = build_request(cfg, hash_value)

    print("=== Parâmetros ListTitulosAT ===")
    print(json.dumps(o_request, ensure_ascii=False, indent=2))
    print(f"\nEndpoint: {cfg['endpoint']}")

    result = call_operation_from_cfg(cfg, "ListTitulosAT", o_request)
    response = to_json_safe(build_response(result))

    print("\n=== Resposta ===")
    print(json.dumps(response, ensure_ascii=False, indent=2))

    if not response.get("RETORNO"):
        codigo = response.get("CODIGOERRO", "?")
        descricao = response.get("ERRODESCRICAO", "")
        print(f"\nListTitulosAT falhou: [{codigo}] {descricao}", file=sys.stderr)
        hint = hash_error_hint(codigo) if isinstance(codigo, int) else None
        if hint:
            print(hint, file=sys.stderr)
        return 1

    titulos_count = len(response.get("Titulos") or [])
    print(
        f"\nOK — {response.get('QtdeRegistros')} registro(s), "
        f"{response.get('QtdePaginas')} página(s), "
        f"{titulos_count} título(s) nesta página."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
