#!/usr/bin/env python3
"""Envia anexo a solicitação de certidão (EnviarAnexoCertidao) no webservice Certidões da ONR."""

from __future__ import annotations

import json
import sys
from pathlib import Path

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))

from lib.onr_certidoes import (  # noqa: E402
    hash_error_hint,
    load_certidoes_soap_config,
    load_login_config,
    load_serventia_chave,
    resolve_auth_hash,
)
from lib.onr_certidoes_anexo import (  # noqa: E402
    business_error_hint_anexo,
    load_anexo_arquivo,
    resolve_certidoes_protocolo,
)
from lib.onr_json import to_json_safe  # noqa: E402
from lib.onr_soap import call_operation_from_cfg  # noqa: E402
from lib.onr_zeep_serialize import serialize_result  # noqa: E402

PREFIX = "CERTIDOES_ENVIAR_ANEXO_"
FIELD_ORDER = ("Hash", "Protocolo", "NomeArquivo", "ArquivoBase64")


def load_config() -> dict:
    load_dotenv(ROOT / ".env")
    anexo = load_anexo_arquivo(PREFIX)
    return {
        "chave": load_serventia_chave(),
        "login_cfg": load_login_config(),
        "protocolo": resolve_certidoes_protocolo(PREFIX),
        "nome_arquivo": anexo["nome_arquivo"],
        "arquivo_base64": anexo["arquivo_base64"],
        "arquivo_bytes": anexo.get("bytes"),
        **load_certidoes_soap_config(),
    }


def build_request(cfg: dict, hash_value: str) -> dict:
    values = {
        "Hash": hash_value,
        "Protocolo": cfg["protocolo"],
        "NomeArquivo": cfg["nome_arquivo"],
        "ArquivoBase64": cfg["arquivo_base64"],
    }
    return {key: values[key] for key in FIELD_ORDER}


def _request_for_log(o_request: dict) -> dict:
    b64 = o_request.get("ArquivoBase64") or ""
    preview = (
        f"{b64[:80]}... ({len(b64)} chars base64)"
        if len(b64) > 80
        else b64
    )
    return {**o_request, "ArquivoBase64": preview}


def main() -> int:
    cfg = load_config()
    hash_value = resolve_auth_hash(cfg["chave"], cfg["login_cfg"])
    o_request = build_request(cfg, hash_value)

    print("=== Parâmetros EnviarAnexoCertidao ===")
    print(json.dumps(_request_for_log(o_request), ensure_ascii=False, indent=2))
    if cfg.get("arquivo_bytes") is not None:
        print(
            f"Arquivo: {cfg['nome_arquivo']} ({cfg['arquivo_bytes']} bytes → base64)"
        )
    print(f"\nEndpoint: {cfg['endpoint']}")

    result = call_operation_from_cfg(cfg, "EnviarAnexoCertidao", o_request)
    response = to_json_safe(serialize_result(result))

    print("\n=== Resposta ===")
    print(json.dumps(response, ensure_ascii=False, indent=2))

    if not response.get("RETORNO"):
        codigo = response.get("CODIGOERRO", "?")
        descricao = response.get("ERRODESCRICAO", "")
        print(
            f"\nEnviarAnexoCertidao falhou: [{codigo}] {descricao}",
            file=sys.stderr,
        )
        if isinstance(codigo, int):
            hint = business_error_hint_anexo(codigo) or hash_error_hint(codigo)
            if hint:
                print(hint, file=sys.stderr)
        return 1

    print(
        f"\nOK — Anexo {cfg['nome_arquivo']} enviado ao protocolo {cfg['protocolo']}."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
