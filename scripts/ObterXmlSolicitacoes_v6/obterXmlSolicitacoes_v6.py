#!/usr/bin/env python3
"""Exporta solicitações de certidões em XML (ObterXMLSolicitacoes_v6) no webservice Certidões da ONR."""

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
from lib.onr_certidoes_obter_xml import (  # noqa: E402
    build_obter_xml_solicitacoes_request,
    business_error_hint_obter_xml,
    load_obter_xml_filters,
    response_for_display,
)
from lib.onr_env import resolve_path  # noqa: E402
from lib.onr_json import to_json_safe  # noqa: E402
from lib.onr_soap import call_operation_from_cfg  # noqa: E402
from lib.onr_zeep_serialize import serialize_result  # noqa: E402

PREFIX = "CERTIDOES_OBTER_XML_V6_"
OPERATION = "ObterXMLSolicitacoes_v6"


def load_config() -> dict:
    load_dotenv(ROOT / ".env")
    return {
        "chave": load_serventia_chave(),
        "login_cfg": load_login_config(),
        "filters": load_obter_xml_filters(PREFIX),
        **load_certidoes_soap_config(),
    }


def _build_response(result) -> dict:
    data = serialize_result(result)
    return {
        "RETORNO": data.get("RETORNO"),
        "CODIGOERRO": data.get("CODIGOERRO"),
        "ERRODESCRICAO": data.get("ERRODESCRICAO"),
        "XML": data.get("XML") or "",
    }


def main() -> int:
    cfg = load_config()
    hash_value = resolve_auth_hash(cfg["chave"], cfg["login_cfg"])
    o_request = build_obter_xml_solicitacoes_request(hash_value, cfg["filters"])

    print(f"=== Parâmetros {OPERATION} ===")
    print(json.dumps(o_request, ensure_ascii=False, indent=2))
    print(f"\nEndpoint: {cfg['endpoint']}")

    result = call_operation_from_cfg(cfg, OPERATION, o_request)
    response = to_json_safe(_build_response(result))

    print("\n=== Resposta (XML resumido) ===")
    print(json.dumps(response_for_display(response), ensure_ascii=False, indent=2))

    if not response.get("RETORNO"):
        codigo = response.get("CODIGOERRO", "?")
        descricao = response.get("ERRODESCRICAO", "")
        print(f"\n{OPERATION} falhou: [{codigo}] {descricao}", file=sys.stderr)
        if isinstance(codigo, int):
            hint = business_error_hint_obter_xml(codigo) or hash_error_hint(codigo)
            if hint:
                print(hint, file=sys.stderr)
        return 1

    xml = response.get("XML") or ""
    if not xml:
        print("\nRETORNO=true mas XML vazio.", file=sys.stderr)
        return 1

    out_raw = cfg["filters"].get("xml_output_path")
    if out_raw:
        out_path = Path(resolve_path(out_raw))
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_text(xml, encoding="utf-8")
        print(f"\nOK — XML gravado em {out_path} ({len(xml)} caracteres).")
    else:
        print(
            f"\nOK — XML exportado ({len(xml)} caracteres). "
            f"Defina {PREFIX}XML_OUTPUT_PATH para salvar em arquivo."
        )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
