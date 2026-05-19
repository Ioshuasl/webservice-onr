#!/usr/bin/env python3
"""Cadastra um título com status inicial (InsertTituloAT) no webservice Acompanhamento de Títulos da ONR."""

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
from lib.onr_insert_titulo_at import build_insert_titulo_request  # noqa: E402
from lib.onr_soap import call_operation_from_cfg  # noqa: E402
from lib.onr_zeep_serialize import serialize_result  # noqa: E402

_PREFIX = "ACOMPANHAMENTO_TITULOS_INSERT_"


def _env_decimal(key: str, default: str = "0") -> Decimal:
    raw = env_str(key, default)
    return Decimal(raw or default)


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
        f"{_PREFIX}ID_TIPO_STATUS",
        f"{_PREFIX}DATA_STATUS",
        f"{_PREFIX}CODIGO_VERIFICADOR",
    ]
    missing = [k for k in required if not os.getenv(k)]
    if missing:
        raise SystemExit(f"Variáveis ausentes no .env: {', '.join(missing)}")

    tipo_solicitacao = require_env_int(f"{_PREFIX}TIPO_SOLICITACAO")
    if tipo_solicitacao not in (1, 2):
        raise SystemExit(
            f"{_PREFIX}TIPO_SOLICITACAO deve ser 1 (Prenotação) ou 2 (Exame e Cálculo)."
        )

    id_tipo_status = require_env_int(f"{_PREFIX}ID_TIPO_STATUS")

    codigo_verificador = env_str(f"{_PREFIX}CODIGO_VERIFICADOR")
    if not codigo_verificador or not codigo_verificador.strip():
        raise SystemExit(
            f"Defina {_PREFIX}CODIGO_VERIFICADOR no .env. "
            "O serviço ONR exige este campo (erro 36 se omitido). "
            "Você pode copiar o valor de um título existente (GetTituloAT → CodigoVerificador)."
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
        "codigo_verificador": codigo_verificador.strip(),
        "tipo_solicitacao": tipo_solicitacao,
        "id_tipo_status": id_tipo_status,
        "data_status": env_str(f"{_PREFIX}DATA_STATUS"),
        "descricao_status": env_str(f"{_PREFIX}DESCRICAO_STATUS"),
        **load_acompanhamento_soap_config(),
    }


def main() -> int:
    cfg = load_config()
    hash_value = resolve_auth_hash(cfg["chave"], cfg["login_cfg"])
    o_request = build_insert_titulo_request(hash_value, cfg)

    print("=== Parâmetros InsertTituloAT ===")
    print(json.dumps(o_request, ensure_ascii=False, indent=2, default=str))
    print(f"\nEndpoint: {cfg['endpoint']}")

    result = call_operation_from_cfg(cfg, "InsertTituloAT", o_request)
    response = to_json_safe(serialize_result(result))

    print("\n=== Resposta ===")
    print(json.dumps(response, ensure_ascii=False, indent=2))

    if not response.get("RETORNO"):
        codigo = response.get("CODIGOERRO", "?")
        descricao = response.get("ERRODESCRICAO", "")
        print(f"\nInsertTituloAT falhou: [{codigo}] {descricao}", file=sys.stderr)
        if codigo == 501 and response.get("IDTitulo"):
            print(
                f"Dica: protocolo já cadastrado — IDTitulo existente: {response['IDTitulo']}",
                file=sys.stderr,
            )
        if codigo == 36:
            print(
                f"Dica: informe {_PREFIX}CODIGO_VERIFICADOR no .env "
                "(até 20 caracteres; veja CodigoVerificador em GetTituloAT).",
                file=sys.stderr,
            )
        if codigo in (13, 50):
            print(
                f"Dica: {_PREFIX}PROTOCOLO só com dígitos (até 11), único no cartório. "
                "Exemplo real: 605762 (GetTituloAT). Para status inicial use "
                f"{_PREFIX}ID_TIPO_STATUS=4 (Título prenotado).",
                file=sys.stderr,
            )
        if codigo == 22:
            print(
                f"Dica: {_PREFIX}ID_TIPO_STATUS inválido — veja tipos em § 3.2.1 "
                "(ex.: 4 = Título prenotado para cadastro novo).",
                file=sys.stderr,
            )
        if codigo == 0 and descricao and "IDMsg" in descricao:
            print(
                "Dica: o serviço .NET exige todos os elementos do WSDL no XML, "
                "inclusive opcionais vazios (telefone, CPF/CNPJ, DescricaoStatus). "
                "Os scripts já enviam string vazia nesses campos; se o erro persistir, "
                "informe o IDMsg ao suporte ONR.",
                file=sys.stderr,
            )
        if codigo == 101:
            print(
                "Dica: erro ao persistir o título (101). Verifique permissão do usuário "
                "(cód. 32 na spec: apenas cartório), CNS do cartório (502) e dados do .env.",
                file=sys.stderr,
            )
        hint = hash_error_hint(codigo) if isinstance(codigo, int) else None
        if hint:
            print(hint, file=sys.stderr)
        return 1

    print(
        f"\nOK — Título cadastrado: IDTitulo={response.get('IDTitulo')}, "
        f"IDStatus={response.get('IDStatus')}, protocolo {cfg['protocolo']}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
