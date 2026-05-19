#!/usr/bin/env python3
"""Cadastra um status em título existente (InsertStatusAT) no webservice Acompanhamento de Títulos da ONR."""

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
from lib.onr_env import env_int, env_str, require_env_int  # noqa: E402
from lib.onr_insert_status_at import build_insert_status_request  # noqa: E402
from lib.onr_json import to_json_safe  # noqa: E402
from lib.onr_soap import call_operation_from_cfg  # noqa: E402
from lib.onr_zeep_serialize import serialize_result  # noqa: E402

_PREFIX = "ACOMPANHAMENTO_TITULOS_INSERT_STATUS_"


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

    required = [
        f"{_PREFIX}ID_TIPO_STATUS",
        f"{_PREFIX}DATA_STATUS",
        f"{_PREFIX}DESCRICAO_STATUS",
    ]
    missing = [k for k in required if not os.getenv(k)]
    if missing:
        raise SystemExit(f"Variáveis ausentes no .env: {', '.join(missing)}")

    id_tipo_status = require_env_int(f"{_PREFIX}ID_TIPO_STATUS")
    data_status = env_str(f"{_PREFIX}DATA_STATUS")
    descricao_status = env_str(f"{_PREFIX}DESCRICAO_STATUS")

    if not data_status or not data_status.strip():
        raise SystemExit(f"Defina {_PREFIX}DATA_STATUS no .env (formato: aaaa-mm-dd hh:mm:ss).")
    if not descricao_status or not descricao_status.strip():
        raise SystemExit(
            f"Defina {_PREFIX}DESCRICAO_STATUS no .env (obrigatório na spec — erro 17 se vazio)."
        )

    return {
        "chave": load_serventia_chave(),
        "login_cfg": load_login_config(),
        "id_titulo": _resolve_id_titulo(),
        "id_tipo_status": id_tipo_status,
        "data_status": data_status.strip(),
        "descricao_status": descricao_status.strip(),
        **load_acompanhamento_soap_config(),
    }


def main() -> int:
    cfg = load_config()
    hash_value = resolve_auth_hash(cfg["chave"], cfg["login_cfg"])
    o_request = build_insert_status_request(hash_value, cfg)

    print("=== Parâmetros InsertStatusAT ===")
    print(json.dumps(o_request, ensure_ascii=False, indent=2))
    print(f"\nEndpoint: {cfg['endpoint']}")

    result = call_operation_from_cfg(cfg, "InsertStatusAT", o_request)
    response = to_json_safe(serialize_result(result))

    print("\n=== Resposta ===")
    print(json.dumps(response, ensure_ascii=False, indent=2))

    if not response.get("RETORNO"):
        codigo = response.get("CODIGOERRO", "?")
        descricao = response.get("ERRODESCRICAO", "")
        print(f"\nInsertStatusAT falhou: [{codigo}] {descricao}", file=sys.stderr)
        if codigo == 12:
            print(
                f"Dica: título inválido — confira {_PREFIX}ID_TITULO / "
                "ACOMPANHAMENTO_TITULOS_ID_TITULO.",
                file=sys.stderr,
            )
        if codigo == 13:
            print(
                f"Dica: {_PREFIX}ID_TIPO_STATUS inválido — veja tipos em § 3.2.1 "
                "(ex.: 3 = pronto para retirada, 7 = nota de exigência).",
                file=sys.stderr,
            )
        if codigo in (14, 15, 16):
            print(
                f"Dica: revise {_PREFIX}DATA_STATUS (19 caracteres, ex.: 2026-05-19 10:00:00).",
                file=sys.stderr,
            )
        if codigo == 17:
            print(
                f"Dica: informe {_PREFIX}DESCRICAO_STATUS (nota de devolução neste campo).",
                file=sys.stderr,
            )
        if codigo == 501 and response.get("IDStatus"):
            print(
                f"Dica: status já cadastrado — IDStatus existente: {response['IDStatus']}",
                file=sys.stderr,
            )
        if codigo == 0 and descricao and "IDMsg" in descricao:
            print(
                "Dica: envie DataStatus e DescricaoStatus no XML (mesmo vazios). "
                "Os scripts já incluem ambos; se persistir, informe o IDMsg à ONR.",
                file=sys.stderr,
            )
        if codigo == 101:
            print("Dica: erro ao persistir o status (101).", file=sys.stderr)
        hint = hash_error_hint(codigo) if isinstance(codigo, int) else None
        if hint:
            print(hint, file=sys.stderr)
        return 1

    print(
        f"\nOK — Status cadastrado: IDStatus={response.get('IDStatus')}, "
        f"título {cfg['id_titulo']}, tipo {cfg['id_tipo_status']}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
