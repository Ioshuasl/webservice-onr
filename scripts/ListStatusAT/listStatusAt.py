#!/usr/bin/env python3
"""Lista status de um título (ListStatusAT) no webservice Acompanhamento de Títulos da ONR."""

from __future__ import annotations

import json
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

    id_titulo = env_int("ACOMPANHAMENTO_TITULOS_ID_TITULO")
    if id_titulo is None:
        raise SystemExit(
            "Defina ACOMPANHAMENTO_TITULOS_ID_TITULO no .env com o ID do título."
        )

    data_inicio = env_str("ACOMPANHAMENTO_TITULOS_DATA_STATUS_INICIO")
    data_final = env_str("ACOMPANHAMENTO_TITULOS_DATA_STATUS_FINAL")

    return {
        "chave": load_serventia_chave(),
        "login_cfg": load_login_config(),
        "id_titulo": id_titulo,
        "max_row_per_page": env_int("ACOMPANHAMENTO_TITULOS_MAX_ROW_PER_PAGE", 50),
        "page_number": env_int("ACOMPANHAMENTO_TITULOS_PAGE_NUMBER", 1),
        "id_tipo_status": env_int("ACOMPANHAMENTO_TITULOS_ID_TIPO_STATUS", -1),
        "data_status_inicio": data_inicio or None,
        "data_status_final": data_final or None,
        **load_acompanhamento_soap_config(),
    }


def build_request(cfg: dict, hash_value: str) -> dict:
    o_request = {
        "Hash": hash_value,
        "MaxRowPerPage": cfg["max_row_per_page"],
        "PageNumber": cfg["page_number"],
        "IDTitulo": cfg["id_titulo"],
        "IDTipoStatus": cfg["id_tipo_status"],
    }
    if cfg["data_status_inicio"]:
        o_request["DataStatusInicio"] = cfg["data_status_inicio"]
    if cfg["data_status_final"]:
        o_request["DataStatusFinal"] = cfg["data_status_final"]
    return o_request


def build_response(result) -> dict:
    return {
        "RETORNO": result.RETORNO,
        "CODIGOERRO": result.CODIGOERRO,
        "ERRODESCRICAO": result.ERRODESCRICAO,
        "QtdeRegistros": result.QtdeRegistros,
        "QtdePaginas": result.QtdePaginas,
        "IDTitulo": result.IDTitulo,
        "IDCartorio": result.IDCartorio,
        "Protocolo": result.Protocolo,
        "ApresentanteNome": result.ApresentanteNome,
        "Status": serialize_zeep_list(result.Status, "ListStatusAT_Status_WSResp"),
    }


def main() -> int:
    cfg = load_config()
    hash_value = resolve_auth_hash(cfg["chave"], cfg["login_cfg"])
    o_request = build_request(cfg, hash_value)

    print("=== Parâmetros ListStatusAT ===")
    print(json.dumps(o_request, ensure_ascii=False, indent=2))
    print(f"\nEndpoint: {cfg['endpoint']}")

    result = call_operation_from_cfg(cfg, "ListStatusAT", o_request)
    response = to_json_safe(build_response(result))

    print("\n=== Resposta ===")
    print(json.dumps(response, ensure_ascii=False, indent=2))

    if not response.get("RETORNO"):
        codigo = response.get("CODIGOERRO", "?")
        descricao = response.get("ERRODESCRICAO", "")
        print(f"\nListStatusAT falhou: [{codigo}] {descricao}", file=sys.stderr)
        hint = hash_error_hint(codigo) if isinstance(codigo, int) else None
        if hint:
            print(hint, file=sys.stderr)
        return 1

    status_count = len(response.get("Status") or [])
    print(
        f"\nOK — Título {response.get('IDTitulo')}: "
        f"{response.get('QtdeRegistros')} status no total, "
        f"{response.get('QtdePaginas')} página(s), "
        f"{status_count} status nesta página."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
