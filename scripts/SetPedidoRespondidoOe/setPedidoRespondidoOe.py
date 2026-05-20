#!/usr/bin/env python3
"""Responde pedido de ofício (SetPedidoRespondidoOE) no webservice Ofícios da ONR."""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))

from lib.onr_env import env_int, env_str  # noqa: E402
from lib.onr_json import to_json_safe  # noqa: E402
from lib.onr_oficios import (  # noqa: E402
    hash_error_hint,
    load_login_config,
    load_oficios_soap_config,
    load_serventia_chave,
    resolve_auth_hash,
)
from lib.onr_oficios_respondido import validate_pedido_for_respondido_oe  # noqa: E402
from lib.onr_soap import call_operation_from_cfg  # noqa: E402
from lib.onr_zeep_serialize import serialize_result  # noqa: E402

PREFIX = "OFICIOS_SET_PEDIDO_RESPONDIDO_"
ANEXO_ITEM = "SetPedidoRespondidoOE_Anexo_WSReq"
FIELD_ORDER = ("Hash", "IDPedido", "Resposta", "Negativa", "Anexos")


def _parse_negativa(raw: str | None) -> bool:
    if raw is None or raw.strip() == "":
        return False
    text = raw.strip().lower()
    if text in ("1", "true", "yes", "sim", "s"):
        return True
    if text in ("0", "false", "no", "nao", "não", "n"):
        return False
    raise SystemExit(
        f"{PREFIX}NEGATIVA inválido ({raw!r}). Use true/false ou 1/0."
    )


def _resolve_id_pedido() -> int:
    id_pedido = env_int(f"{PREFIX}ID_PEDIDO")
    if id_pedido is None:
        id_pedido = env_int("OFICIOS_ID_PEDIDO")
    if id_pedido is None:
        raise SystemExit(
            f"Defina {PREFIX}ID_PEDIDO ou OFICIOS_ID_PEDIDO no .env "
            "(IDPedido de ListPedidosOE_V2 / GetPedidoOE)."
        )
    return id_pedido


def _load_anexos() -> list[dict[str, str]]:
    json_raw = env_str(f"{PREFIX}ANEXOS_JSON")
    if json_raw:
        try:
            data = json.loads(json_raw)
        except json.JSONDecodeError as exc:
            raise SystemExit(f"{PREFIX}ANEXOS_JSON inválido: {exc}") from exc
        if not isinstance(data, list) or not data:
            raise SystemExit(f"{PREFIX}ANEXOS_JSON deve ser um array JSON não vazio.")
        items: list[dict[str, str]] = []
        for i, row in enumerate(data):
            if not isinstance(row, dict):
                raise SystemExit(f"Item {i} em ANEXOS_JSON deve ser um objeto.")
            nome = row.get("Nome") or row.get("nome")
            url = row.get("URLArquivo") or row.get("urlArquivo") or row.get("url_arquivo")
            if not nome or not url:
                raise SystemExit(
                    f"Item {i}: informe Nome e URLArquivo (URL pública; spec .p7s)."
                )
            items.append({"Nome": str(nome), "URLArquivo": str(url)})
        return items

    nome = env_str(f"{PREFIX}NOME")
    url_arquivo = env_str(f"{PREFIX}URL_ARQUIVO")
    if nome and url_arquivo:
        return [{"Nome": nome, "URLArquivo": url_arquivo}]

    raise SystemExit(
        f"Defina {PREFIX}ANEXOS_JSON (array) ou "
        f"{PREFIX}NOME + {PREFIX}URL_ARQUIVO no .env."
    )


def _build_anexos(items: list[dict[str, str]]) -> dict[str, Any]:
    return {ANEXO_ITEM: items}


def _parse_skip_validar_status() -> bool:
    raw = env_str(f"{PREFIX}SKIP_VALIDAR_STATUS")
    if not raw:
        return False
    return raw.strip().lower() in ("1", "true", "yes", "sim", "s")


def load_config() -> dict:
    load_dotenv(ROOT / ".env")

    resposta = env_str(f"{PREFIX}RESPOSTA")
    if not resposta:
        raise SystemExit(f"Defina {PREFIX}RESPOSTA no .env.")

    return {
        "chave": load_serventia_chave(),
        "login_cfg": load_login_config(),
        "id_pedido": _resolve_id_pedido(),
        "resposta": resposta,
        "negativa": _parse_negativa(env_str(f"{PREFIX}NEGATIVA")),
        "anexos": _load_anexos(),
        "skip_validar_status": _parse_skip_validar_status(),
        **load_oficios_soap_config(),
    }


def build_request(cfg: dict, hash_value: str) -> dict:
    values = {
        "Hash": hash_value,
        "IDPedido": cfg["id_pedido"],
        "Resposta": cfg["resposta"],
        "Negativa": cfg["negativa"],
        "Anexos": _build_anexos(cfg["anexos"]),
    }
    return {key: values[key] for key in FIELD_ORDER}


def _preflight_get_pedido_oe(cfg: dict) -> int:
    """GetPedidoOE antes da escrita. Retorna código de saída (0 = ok)."""
    if cfg["skip_validar_status"]:
        return 0

    base_index = env_int("ONR_HASH_TOKEN_INDEX", 0) or 0
    hash_value = resolve_auth_hash(
        cfg["chave"], cfg["login_cfg"], token_index=base_index
    )
    o_request = {"Hash": hash_value, "IDPedido": cfg["id_pedido"]}

    result = call_operation_from_cfg(cfg, "GetPedidoOE", o_request)
    pedido = to_json_safe(serialize_result(result))

    if not pedido.get("RETORNO"):
        codigo = pedido.get("CODIGOERRO", "?")
        descricao = pedido.get("ERRODESCRICAO", "")
        print(f"GetPedidoOE falhou: [{codigo}] {descricao}", file=sys.stderr)
        if isinstance(codigo, int):
            hint = _business_error_hint(codigo) or hash_error_hint(codigo)
            if hint:
                print(hint, file=sys.stderr)
        return 1

    warnings = validate_pedido_for_respondido_oe(pedido)
    if not warnings:
        print(
            f"Pré-validação OK — pedido {cfg['id_pedido']}: "
            f"IDStatus={pedido.get('IDStatus', '—')} "
            f"(protocolo {pedido.get('Protocolo', '—')})."
        )
        return 0

    print(
        "=== Pré-validação GetPedidoOE — pedido já respondido ou inelegível ===",
        file=sys.stderr,
    )
    for w in warnings:
        print(f"  • {w}", file=sys.stderr)
    print(
        "\nSetPedidoRespondidoOE não será chamado (evita erro 53 e consumo extra de hash). "
        "Use outro IDPedido em status Aberto (IDStatus=1). Para ignorar: "
        f"{PREFIX}SKIP_VALIDAR_STATUS=true",
        file=sys.stderr,
    )
    return 1


def _business_error_hint(codigo: int) -> str | None:
    hints = {
        12: "IDPedido inválido.",
        13: "Informe Resposta.",
        14: "Informe ao menos um anexo (Anexos).",
        51: "Não foi possível obter dados do pedido.",
        52: "Sem permissão para responder este pedido.",
        53: "Pedido já respondido.",
        54: "Nome de um ou mais anexos não informado.",
        55: "URL de um ou mais anexos não informada.",
        56: "Não foi possível responder o pedido.",
        60: "Não foi possível desbloquear os arquivos.",
        101: "Não foi possível cadastrar o arquivo.",
        102: "Arquivo não encontrado na URL informada.",
        103: "Não foi possível verificar se o arquivo existe.",
        104: "Extensão não permitida — apenas .p7s (homolog pode aceitar .pdf).",
        105: "Aplicação inválida.",
        501: "Campos obrigatórios não informados.",
        502: "Resposta já cadastrada; aguarde download dos anexos pelo ONR.",
    }
    return hints.get(codigo)


def main() -> int:
    cfg = load_config()

    base_index = env_int("ONR_HASH_TOKEN_INDEX", 0) or 0
    preflight_ran = not cfg["skip_validar_status"]

    if preflight_ran and _preflight_get_pedido_oe(cfg) != 0:
        return 1

    hash_value = resolve_auth_hash(
        cfg["chave"],
        cfg["login_cfg"],
        token_index=base_index + 1 if preflight_ran else base_index,
    )
    o_request = build_request(cfg, hash_value)

    print("=== Parâmetros SetPedidoRespondidoOE ===")
    print(json.dumps(o_request, ensure_ascii=False, indent=2))
    print(f"\nEndpoint: {cfg['endpoint']}")

    result = call_operation_from_cfg(cfg, "SetPedidoRespondidoOE", o_request)
    response = to_json_safe(serialize_result(result))

    print("\n=== Resposta ===")
    print(json.dumps(response, ensure_ascii=False, indent=2))

    if not response.get("RETORNO"):
        codigo = response.get("CODIGOERRO", "?")
        descricao = response.get("ERRODESCRICAO", "")
        print(
            f"\nSetPedidoRespondidoOE falhou: [{codigo}] {descricao}",
            file=sys.stderr,
        )
        if isinstance(codigo, int):
            hint = _business_error_hint(codigo) or hash_error_hint(codigo)
            if hint:
                print(hint, file=sys.stderr)
        return 1

    neg = "negativa" if cfg["negativa"] else "positiva"
    print(
        f"\nOK — Resposta {neg} registrada no pedido {cfg['id_pedido']} "
        f"({len(cfg['anexos'])} anexo(s); status após download dos arquivos)."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
