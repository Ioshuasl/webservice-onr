#!/usr/bin/env python3
"""Exclui um título (DeleteTituloAT) no webservice Acompanhamento de Títulos da ONR."""

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
from lib.onr_env import env_int  # noqa: E402
from lib.onr_json import to_json_safe  # noqa: E402
from lib.onr_soap import call_operation_from_cfg  # noqa: E402
from lib.onr_zeep_serialize import serialize_result  # noqa: E402

_PREFIX = "ACOMPANHAMENTO_TITULOS_DELETE_"


def _resolve_id_titulo() -> int:
    id_titulo = env_int(f"{_PREFIX}ID_TITULO")
    if id_titulo is None:
        id_titulo = env_int("ACOMPANHAMENTO_TITULOS_ID_TITULO")
    if id_titulo is None:
        raise SystemExit(
            f"Defina {_PREFIX}ID_TITULO ou ACOMPANHAMENTO_TITULOS_ID_TITULO no .env."
        )
    return id_titulo


def load_config() -> dict:
    load_dotenv(ROOT / ".env")

    return {
        "chave": load_serventia_chave(),
        "login_cfg": load_login_config(),
        "id_titulo": _resolve_id_titulo(),
        **load_acompanhamento_soap_config(),
    }


def build_request(hash_value: str, id_titulo: int) -> dict:
    """Ordem WSDL DeleteTituloAT_WSReq: Hash → IDTitulo."""
    return {"Hash": hash_value, "IDTitulo": id_titulo}


def main() -> int:
    cfg = load_config()
    hash_value = resolve_auth_hash(cfg["chave"], cfg["login_cfg"])
    o_request = build_request(hash_value, cfg["id_titulo"])

    print("=== Parâmetros DeleteTituloAT ===")
    print(json.dumps(o_request, ensure_ascii=False, indent=2))
    print(f"\nEndpoint: {cfg['endpoint']}")

    result = call_operation_from_cfg(cfg, "DeleteTituloAT", o_request)
    response = to_json_safe(serialize_result(result))

    print("\n=== Resposta ===")
    print(json.dumps(response, ensure_ascii=False, indent=2))

    if not response.get("RETORNO"):
        codigo = response.get("CODIGOERRO", "?")
        descricao = response.get("ERRODESCRICAO", "")
        print(f"\nDeleteTituloAT falhou: [{codigo}] {descricao}", file=sys.stderr)
        if codigo == 12:
            print(
                f"Dica: {_PREFIX}ID_TITULO / ACOMPANHAMENTO_TITULOS_ID_TITULO inválido ou "
                "título já excluído.",
                file=sys.stderr,
            )
        if codigo == 30:
            print(
                "Dica: não foi possível localizar o título (30). Confira o ID com ListTitulosAT.",
                file=sys.stderr,
            )
        if codigo == 50:
            print(
                "Dica: usuário sem permissão para excluir o título (spec cód. 50).",
                file=sys.stderr,
            )
        hint = hash_error_hint(codigo) if isinstance(codigo, int) else None
        if hint:
            print(hint, file=sys.stderr)
        return 1

    print(f"\nOK — Título {cfg['id_titulo']} excluído.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
