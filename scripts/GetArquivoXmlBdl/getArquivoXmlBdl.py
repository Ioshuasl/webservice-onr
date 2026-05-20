#!/usr/bin/env python3
"""Consulta detalhes de um arquivo BD Light (GetArquivoXMLBDL) no webservice ONR."""

from __future__ import annotations

import json
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
from lib.onr_env import env_int  # noqa: E402
from lib.onr_json import to_json_safe  # noqa: E402
from lib.onr_soap import call_operation_from_cfg  # noqa: E402
from lib.onr_zeep_serialize import serialize_zeep_list  # noqa: E402

FIELD_ORDER = ("Hash", "IDArquivo")

INVALIDO_ITEM = "GetArquivoXMLBDL_Invalido_WSResp"


def load_config() -> dict:
    load_dotenv(ROOT / ".env")

    id_arquivo = env_int("BDLIGHT_ID_ARQUIVO")
    if id_arquivo is None:
        raise SystemExit(
            "Defina BDLIGHT_ID_ARQUIVO no .env com o código do arquivo (IDArquivo)."
        )

    return {
        "chave": load_serventia_chave(),
        "login_cfg": load_login_config(),
        "id_arquivo": id_arquivo,
        **load_bdlight_soap_config(),
    }


def build_request(cfg: dict, hash_value: str) -> dict:
    values = {"Hash": hash_value, "IDArquivo": cfg["id_arquivo"]}
    return {key: values[key] for key in FIELD_ORDER}


def build_response(result) -> dict:
    return {
        "RETORNO": result.RETORNO,
        "CODIGOERRO": result.CODIGOERRO,
        "ERRODESCRICAO": result.ERRODESCRICAO,
        "IDStatus": result.IDStatus,
        "IDUsuario": result.IDUsuario,
        "DataImportacao": result.DataImportacao,
        "QtdeRegistros": result.QtdeRegistros,
        "QtdeInvalidos": result.QtdeInvalidos,
        "URLArquivo": result.URLArquivo,
        "ErrosImportacao": result.ErrosImportacao,
        "Invalidos": serialize_zeep_list(result.Invalidos, INVALIDO_ITEM),
    }


def _business_error_hint(codigo: int) -> str | None:
    hints = {
        12: "IDArquivo inválido ou inexistente.",
        30: "Não foi possível obter os dados do arquivo.",
        50: "Usuário sem permissão para acessar o arquivo informado.",
    }
    return hints.get(codigo)


def main() -> int:
    cfg = load_config()
    hash_value = resolve_auth_hash(cfg["chave"], cfg["login_cfg"])
    o_request = build_request(cfg, hash_value)

    print("=== Parâmetros GetArquivoXMLBDL ===")
    print(json.dumps(o_request, ensure_ascii=False, indent=2))
    print(f"\nEndpoint: {cfg['endpoint']}")

    result = call_operation_from_cfg(cfg, "GetArquivoXMLBDL", o_request)
    response = to_json_safe(build_response(result))

    print("\n=== Resposta ===")
    print(json.dumps(response, ensure_ascii=False, indent=2))

    if not response.get("RETORNO"):
        codigo = response.get("CODIGOERRO", "?")
        descricao = response.get("ERRODESCRICAO", "")
        print(
            f"\nGetArquivoXMLBDL falhou: [{codigo}] {descricao}",
            file=sys.stderr,
        )
        if isinstance(codigo, int):
            hint = _business_error_hint(codigo) or hash_error_hint(codigo)
            if hint:
                print(hint, file=sys.stderr)
        return 1

    invalidos = response.get("Invalidos") or []
    print(
        f"\nOK — Arquivo {cfg['id_arquivo']}: "
        f"IDStatus={response.get('IDStatus')}, "
        f"{response.get('QtdeRegistros')} registro(s), "
        f"{response.get('QtdeInvalidos')} inválido(s), "
        f"{len(invalidos)} item(ns) em Invalidos."
    )
    if response.get("URLArquivo"):
        print(f"URLArquivo: {response['URLArquivo']}")
    if response.get("ErrosImportacao"):
        print(f"ErrosImportacao: {response['ErrosImportacao']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
