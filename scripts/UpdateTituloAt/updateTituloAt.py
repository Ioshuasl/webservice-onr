#!/usr/bin/env python3
"""Altera dados de um título (UpdateTituloAT) no webservice Acompanhamento de Títulos da ONR."""

from __future__ import annotations

import json
import os
import sys
from decimal import Decimal
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
from lib.onr_update_titulo_at import build_update_titulo_request  # noqa: E402
from lib.onr_zeep_serialize import serialize_result  # noqa: E402

_PREFIX = "ACOMPANHAMENTO_TITULOS_UPDATE_"


def _env_decimal(key: str, default: str = "0") -> Decimal:
    raw = env_str(key, default)
    return Decimal(raw or default)


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
        f"{_PREFIX}PROTOCOLO",
        f"{_PREFIX}APRESENTANTE_NOME",
        f"{_PREFIX}DATA_PROTOCOLO",
        f"{_PREFIX}DATA_PREVISAO_ENTREGA",
        f"{_PREFIX}MODO_NOTIFICACAO",
        f"{_PREFIX}INTERESSADO_NOME",
        f"{_PREFIX}NATUREZA_TITULO",
    ]
    missing = [k for k in required if not os.getenv(k)]
    if missing:
        raise SystemExit(f"Variáveis ausentes no .env: {', '.join(missing)}")

    tipo_solicitacao = require_env_int(f"{_PREFIX}TIPO_SOLICITACAO")
    if tipo_solicitacao not in (1, 2):
        raise SystemExit(
            f"{_PREFIX}TIPO_SOLICITACAO deve ser 1 (Prenotação) ou 2 (Exame e Cálculo)."
        )

    modo = (env_str(f"{_PREFIX}MODO_NOTIFICACAO") or "").upper()
    if modo not in ("E", "S"):
        raise SystemExit(f"{_PREFIX}MODO_NOTIFICACAO deve ser E (e-mail) ou S (SMS).")

    apresentante_email = env_str(f"{_PREFIX}APRESENTANTE_EMAIL")
    apresentante_ddd = env_str(f"{_PREFIX}APRESENTANTE_DDD")
    apresentante_telefone = env_str(f"{_PREFIX}APRESENTANTE_TELEFONE")

    if modo == "E" and not apresentante_email:
        raise SystemExit(
            f"Com MODO_NOTIFICACAO=E, defina {_PREFIX}APRESENTANTE_EMAIL no .env."
        )
    if modo == "S" and (not apresentante_ddd or not apresentante_telefone):
        raise SystemExit(
            f"Com MODO_NOTIFICACAO=S, defina {_PREFIX}APRESENTANTE_DDD e "
            f"{_PREFIX}APRESENTANTE_TELEFONE no .env."
        )

    protocolo_raw = env_str(f"{_PREFIX}PROTOCOLO") or ""
    protocolo = "".join(c for c in protocolo_raw if c.isdigit())
    if not protocolo:
        raise SystemExit(
            f"{_PREFIX}PROTOCOLO deve conter apenas dígitos (ex.: 605762). "
            f"Valor atual: {protocolo_raw!r}"
        )
    if len(protocolo) > 11:
        raise SystemExit(
            f"{_PREFIX}PROTOCOLO aceita no máximo 11 dígitos (atual: {len(protocolo)})."
        )

    return {
        "chave": load_serventia_chave(),
        "login_cfg": load_login_config(),
        "id_titulo": _resolve_id_titulo(),
        "protocolo": protocolo,
        "apresentante_nome": env_str(f"{_PREFIX}APRESENTANTE_NOME"),
        "apresentante_email": apresentante_email,
        "apresentante_ddd": apresentante_ddd,
        "apresentante_telefone": apresentante_telefone,
        "apresentante_cpfcnpj": env_str(f"{_PREFIX}APRESENTANTE_CPFCNPJ"),
        "valor_deposito": _env_decimal(f"{_PREFIX}VALOR_DEPOSITO", "0"),
        "valor_emolumentos": _env_decimal(f"{_PREFIX}VALOR_EMOLUMENTOS", "0"),
        "data_protocolo": env_str(f"{_PREFIX}DATA_PROTOCOLO"),
        "data_previsao_entrega": env_str(f"{_PREFIX}DATA_PREVISAO_ENTREGA"),
        "modo_notificacao": modo,
        "interessado_nome": env_str(f"{_PREFIX}INTERESSADO_NOME"),
        "interessado_cpfcnpj": env_str(f"{_PREFIX}INTERESSADO_CPFCNPJ"),
        "natureza_titulo": env_str(f"{_PREFIX}NATUREZA_TITULO"),
        "codigo_verificador": env_str(f"{_PREFIX}CODIGO_VERIFICADOR"),
        "tipo_solicitacao": tipo_solicitacao,
        **load_acompanhamento_soap_config(),
    }


def main() -> int:
    cfg = load_config()
    hash_value = resolve_auth_hash(cfg["chave"], cfg["login_cfg"])
    o_request = build_update_titulo_request(hash_value, cfg)

    print("=== Parâmetros UpdateTituloAT ===")
    print(json.dumps(o_request, ensure_ascii=False, indent=2, default=str))
    print(f"\nEndpoint: {cfg['endpoint']}")

    result = call_operation_from_cfg(cfg, "UpdateTituloAT", o_request)
    response = to_json_safe(serialize_result(result))

    print("\n=== Resposta ===")
    print(json.dumps(response, ensure_ascii=False, indent=2))

    if not response.get("RETORNO"):
        codigo = response.get("CODIGOERRO", "?")
        descricao = response.get("ERRODESCRICAO", "")
        print(f"\nUpdateTituloAT falhou: [{codigo}] {descricao}", file=sys.stderr)
        if codigo == 12:
            print(
                f"Dica: {_PREFIX}ID_TITULO / ACOMPANHAMENTO_TITULOS_ID_TITULO inválido — "
                "confira com ListTitulosAT ou GetTituloAT.",
                file=sys.stderr,
            )
        if codigo in (27, 28):
            print(
                f"Dica: {_PREFIX}PROTOCOLO só com dígitos (até 11), coerente com o título.",
                file=sys.stderr,
            )
        if codigo == 32:
            print(
                "Dica: usuário sem permissão para alterar título (spec cód. 32).",
                file=sys.stderr,
            )
        if codigo == 0 and descricao and "IDMsg" in descricao:
            print(
                "Dica: envie todos os elementos do WSDL (opcionais como string vazia). "
                "Os scripts já fazem isso; se persistir, informe o IDMsg à ONR.",
                file=sys.stderr,
            )
        hint = hash_error_hint(codigo) if isinstance(codigo, int) else None
        if hint:
            print(hint, file=sys.stderr)
        return 1

    print(
        f"\nOK — Título {cfg['id_titulo']} atualizado (protocolo {cfg['protocolo']})."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
