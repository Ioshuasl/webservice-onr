#!/usr/bin/env python3
"""Altera um status de título (UpdateStatusAT) no webservice Acompanhamento de Títulos da ONR."""

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
from lib.onr_json import to_json_safe  # noqa: E402
from lib.onr_soap import call_operation_from_cfg  # noqa: E402
from lib.onr_update_status_at import build_update_status_request  # noqa: E402
from lib.onr_zeep_serialize import serialize_result  # noqa: E402

_PREFIX = "ACOMPANHAMENTO_TITULOS_UPDATE_STATUS_"


def _resolve_id_status() -> int:
    id_status = env_int(f"{_PREFIX}ID_STATUS")
    if id_status is None:
        id_status = env_int("ACOMPANHAMENTO_TITULOS_ID_STATUS")
    if id_status is None:
        raise SystemExit(
            f"Defina {_PREFIX}ID_STATUS ou ACOMPANHAMENTO_TITULOS_ID_STATUS no .env."
        )
    return id_status


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
        "id_status": _resolve_id_status(),
        "id_tipo_status": id_tipo_status,
        "data_status": data_status.strip(),
        "descricao_status": descricao_status.strip(),
        **load_acompanhamento_soap_config(),
    }


def main() -> int:
    cfg = load_config()
    hash_value = resolve_auth_hash(cfg["chave"], cfg["login_cfg"])
    o_request = build_update_status_request(hash_value, cfg)

    print("=== Parâmetros UpdateStatusAT ===")
    print(json.dumps(o_request, ensure_ascii=False, indent=2))
    print(f"\nEndpoint: {cfg['endpoint']}")

    result = call_operation_from_cfg(cfg, "UpdateStatusAT", o_request)
    response = to_json_safe(serialize_result(result))

    print("\n=== Resposta ===")
    print(json.dumps(response, ensure_ascii=False, indent=2))

    if not response.get("RETORNO"):
        codigo = response.get("CODIGOERRO", "?")
        descricao = response.get("ERRODESCRICAO", "")
        print(f"\nUpdateStatusAT falhou: [{codigo}] {descricao}", file=sys.stderr)
        if codigo == 12:
            print(
                f"Dica: status inválido — confira {_PREFIX}ID_STATUS / "
                "ACOMPANHAMENTO_TITULOS_ID_STATUS (GetStatusAT / InsertStatusAT).",
                file=sys.stderr,
            )
        if codigo == 13:
            print(
                f"Dica: {_PREFIX}ID_TIPO_STATUS inválido — veja tipos em § 3.2.1.",
                file=sys.stderr,
            )
        if codigo in (14, 15, 16):
            print(
                f"Dica: revise {_PREFIX}DATA_STATUS (19 caracteres, ex.: 2026-05-19 10:00:00).",
                file=sys.stderr,
            )
        if codigo == 17:
            print(
                f"Dica: informe {_PREFIX}DESCRICAO_STATUS.",
                file=sys.stderr,
            )
        if codigo == 30:
            print(
                "Dica: não foi possível localizar o status (30). Confira o IDStatus.",
                file=sys.stderr,
            )
        if codigo == 32:
            print(
                "Dica: sem permissão para alterar o status (spec cód. 32).",
                file=sys.stderr,
            )
        if codigo == 0 and descricao and "IDMsg" in descricao:
            print(
                "Dica: envie DataStatus e DescricaoStatus no XML. "
                "Os scripts já incluem ambos; se persistir, informe o IDMsg à ONR.",
                file=sys.stderr,
            )
        hint = hash_error_hint(codigo) if isinstance(codigo, int) else None
        if hint:
            print(hint, file=sys.stderr)
        return 1

    print(
        f"\nOK — Status {cfg['id_status']} atualizado (tipo {cfg['id_tipo_status']})."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
