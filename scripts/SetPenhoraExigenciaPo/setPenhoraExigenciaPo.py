#!/usr/bin/env python3
"""Responde pedido penhora com nota de exigência (SetPenhoraExigenciaPO) no webservice Penhora Online da ONR."""

from __future__ import annotations

import json
import os
import sys
from pathlib import Path

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))

from lib.onr_env import env_int, env_str  # noqa: E402
from lib.onr_json import to_json_safe  # noqa: E402
from lib.onr_penhora_exigencia import (  # noqa: E402
    build_o_request_dict,
    soap_fault_hint,
    validate_pedido_for_exigencia,
)
from lib.onr_penhora_online import (  # noqa: E402
    hash_error_hint,
    load_login_config,
    load_penhora_online_soap_config,
    load_serventia_chave,
    resolve_auth_hash,
)
from lib.onr_soap import call_operation_from_cfg, create_client  # noqa: E402
from lib.onr_zeep_serialize import serialize_result  # noqa: E402
from zeep.exceptions import Fault  # noqa: E402

PREFIX = "PENHORA_ONLINE_SET_PENHORA_EXIGENCIA_"


def _resolve_id_pedido() -> int:
    id_pedido = env_int(f"{PREFIX}ID_PEDIDO")
    if id_pedido is None:
        id_pedido = env_int("PENHORA_ONLINE_ID_PEDIDO")
    if id_pedido is None:
        raise SystemExit(
            f"Defina {PREFIX}ID_PEDIDO ou PENHORA_ONLINE_ID_PEDIDO no .env "
            "(IDPedido de ListPedidosPO / GetPedidoPO)."
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
                raise SystemExit(f"Item {i}: informe Nome e URLArquivo (arquivo .pdf ou .p7s).")
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


def load_config() -> dict:
    load_dotenv(ROOT / ".env", override=True)

    resposta = env_str(f"{PREFIX}RESPOSTA")
    if not resposta:
        raise SystemExit(f"Defina {PREFIX}RESPOSTA no .env.")

    skip_check = os.getenv("PENHORA_ONLINE_SET_PENHORA_EXIGENCIA_SKIP_PEDIDO_CHECK", "").lower() in (
        "1",
        "true",
        "yes",
    )

    return {
        "chave": load_serventia_chave(),
        "login_cfg": load_login_config(),
        "id_pedido": _resolve_id_pedido(),
        "resposta": resposta,
        "anexos": _load_anexos(),
        "skip_pedido_check": skip_check,
        **load_penhora_online_soap_config(),
    }


def _preflight_get_pedido(cfg: dict) -> int:
    """GetPedidoPO antes da chamada. Retorna código de saída (0 = ok)."""
    if cfg["skip_pedido_check"]:
        return 0

    base_index = env_int("ONR_HASH_TOKEN_INDEX", 0) or 0
    hash_value = resolve_auth_hash(cfg["chave"], cfg["login_cfg"], token_index=base_index)

    client = create_client(cfg["wsdl_path"], cfg["endpoint"])
    result = client.service.GetPedidoPO(oRequest={"Hash": hash_value, "IDPedido": cfg["id_pedido"]})
    pedido = to_json_safe(serialize_result(result))

    if not pedido.get("RETORNO"):
        print(
            f"GetPedidoPO falhou: [{pedido.get('CODIGOERRO')}] {pedido.get('ERRODESCRICAO')}",
            file=sys.stderr,
        )
        return 1

    warnings = validate_pedido_for_exigencia(pedido)
    if not warnings:
        return 0

    print("=== Pré-validação GetPedidoPO — pedido inelegível ===")
    for w in warnings:
        print(f"  • {w}")
    print(
        "\nO pedido informado não aceita SetPenhoraExigenciaPO neste estado. "
        "Escolha um pedido Penhora (tipo 3) prenotado e ainda sem resposta "
        "(ex.: IDStatus 9 ou 10). Para forçar a chamada SOAP mesmo assim: "
        "PENHORA_ONLINE_SET_PENHORA_EXIGENCIA_SKIP_PEDIDO_CHECK=true"
    )
    return 1


def _business_error_hint(codigo: int) -> str | None:
    hints = {
        12: "IDPedido inválido.",
        13: "Informe Resposta.",
        14: "Informe ao menos um anexo.",
        51: "Não foi possível obter dados do pedido (tipo Penhora?).",
        52: "Sem permissão para responder este pedido.",
        53: "Operação só para pedidos tipo Penhora (IDTipoPedido=3).",
        54: "Pedido sem prenotação.",
        55: "Pedido já respondido — use outro IDPedido.",
        56: "URLArquivo não informada.",
        102: "Arquivo não encontrado na URL informada.",
        104: "Extensão não permitida — use .pdf ou .p7s.",
        501: "Campos obrigatórios não informados.",
        502: "Resposta já cadastrada; aguardando download dos arquivos pelo ONR.",
    }
    return hints.get(codigo)


def main() -> int:
    cfg = load_config()

    if _preflight_get_pedido(cfg) != 0:
        return 1

    base_index = env_int("ONR_HASH_TOKEN_INDEX", 0) or 0
    hash_value = resolve_auth_hash(
        cfg["chave"], cfg["login_cfg"], token_index=base_index + 1
    )

    o_request = build_o_request_dict(
        hash_value, cfg["id_pedido"], cfg["resposta"], cfg["anexos"]
    )

    print("=== Parâmetros SetPenhoraExigenciaPO ===")
    print(json.dumps(o_request, ensure_ascii=False, indent=2))
    print(f"\nEndpoint: {cfg['endpoint']}")

    try:
        result = call_operation_from_cfg(cfg, "SetPenhoraExigenciaPO", o_request)
    except Fault as exc:
        print(f"\nSetPenhoraExigenciaPO falhou (SOAP Fault): {exc}", file=sys.stderr)
        hint = soap_fault_hint(str(exc))
        if hint:
            print(hint, file=sys.stderr)
        return 1

    response = to_json_safe(serialize_result(result))

    print("\n=== Resposta ===")
    print(json.dumps(response, ensure_ascii=False, indent=2))

    if not response.get("RETORNO"):
        codigo = response.get("CODIGOERRO", "?")
        descricao = response.get("ERRODESCRICAO", "")
        print(f"\nSetPenhoraExigenciaPO falhou: [{codigo}] {descricao}", file=sys.stderr)
        if isinstance(codigo, int):
            hint = _business_error_hint(codigo) or hash_error_hint(codigo)
            if hint:
                print(hint, file=sys.stderr)
        return 1

    print(
        f"\nOK — Nota de exigência registrada no pedido {cfg['id_pedido']} "
        f"({len(cfg['anexos'])} anexo(s))."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
