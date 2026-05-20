#!/usr/bin/env python3
"""Finaliza pedido com prenotação vencida (SetPedidoFinalizarPrenotacaoVencida) no webservice Penhora Online da ONR."""

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
from lib.onr_penhora_online import (  # noqa: E402
    hash_error_hint,
    load_login_config,
    load_penhora_online_soap_config,
    load_serventia_chave,
    resolve_auth_hash,
)
from lib.onr_soap import call_operation_from_cfg  # noqa: E402
from lib.onr_zeep_serialize import serialize_result  # noqa: E402

PREFIX = "PENHORA_ONLINE_SET_FINALIZAR_PRENOTACAO_VENCIDA_"
ANEXO_ITEM = "SetPedidoFinalizarPrenotacaoVencida_Anexo_WSReq"
FIELD_ORDER = ("Hash", "IDPedido", "Resposta", "Anexos")


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
            nome = (
                row.get("Nome")
                or row.get("nome")
                or row.get("Matricula")
                or row.get("matricula")
            )
            url = row.get("URLArquivo") or row.get("urlArquivo") or row.get("url_arquivo")
            if not nome or not url:
                raise SystemExit(
                    f"Item {i}: informe Nome (ou Matricula) e URLArquivo "
                    "(URL pública; spec .p7s)."
                )
            items.append({"Nome": str(nome), "URLArquivo": str(url)})
        return items

    nome = env_str(f"{PREFIX}NOME") or env_str(f"{PREFIX}MATRICULA")
    url_arquivo = env_str(f"{PREFIX}URL_ARQUIVO")
    if nome and url_arquivo:
        return [{"Nome": nome, "URLArquivo": url_arquivo}]

    raise SystemExit(
        f"Defina {PREFIX}ANEXOS_JSON (array) ou "
        f"{PREFIX}NOME + {PREFIX}URL_ARQUIVO no .env."
    )


def _build_anexos(items: list[dict[str, str]]) -> dict[str, Any]:
    return {ANEXO_ITEM: items}


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
        "anexos": _load_anexos(),
        **load_penhora_online_soap_config(),
    }


def build_request(cfg: dict, hash_value: str) -> dict:
    values = {
        "Hash": hash_value,
        "IDPedido": cfg["id_pedido"],
        "Resposta": cfg["resposta"],
        "Anexos": _build_anexos(cfg["anexos"]),
    }
    return {key: values[key] for key in FIELD_ORDER}


def _business_error_hint(codigo: int) -> str | None:
    hints = {
        12: "IDPedido inválido.",
        13: "Informe Resposta.",
        14: "Informe ao menos um anexo (Anexos).",
        51: "Não foi possível obter dados do pedido (tipo Matrícula / IDTipoPedido=1?).",
        52: "Sem permissão para responder este pedido.",
        53: "Operação só para pedidos tipo Certidão por Matrícula (IDTipoPedido=1).",
        54: "Nome/matrícula de um ou mais anexos não informada.",
        55: "URL de um ou mais arquivos não informada.",
        60: "Não foi possível desbloquear os arquivos.",
        101: "Não foi possível cadastrar o arquivo.",
        102: "Arquivo não encontrado na URL informada.",
        103: "Não foi possível verificar se o arquivo existe.",
        104: "Extensão não permitida — spec exige .p7s (homolog pode aceitar .pdf).",
        105: "Aplicação inválida.",
        501: "Campos obrigatórios não informados.",
        502: "Resposta já cadastrada; aguardando download dos arquivos pelo ONR.",
    }
    return hints.get(codigo)


def main() -> int:
    cfg = load_config()
    hash_value = resolve_auth_hash(cfg["chave"], cfg["login_cfg"])
    o_request = build_request(cfg, hash_value)

    print("=== Parâmetros SetPedidoFinalizarPrenotacaoVencida ===")
    print(json.dumps(o_request, ensure_ascii=False, indent=2))
    print(f"\nEndpoint: {cfg['endpoint']}")

    result = call_operation_from_cfg(
        cfg, "SetPedidoFinalizarPrenotacaoVencida", o_request
    )
    response = to_json_safe(serialize_result(result))

    print("\n=== Resposta ===")
    print(json.dumps(response, ensure_ascii=False, indent=2))

    if not response.get("RETORNO"):
        codigo = response.get("CODIGOERRO", "?")
        descricao = response.get("ERRODESCRICAO", "")
        print(
            f"\nSetPedidoFinalizarPrenotacaoVencida falhou: [{codigo}] {descricao}",
            file=sys.stderr,
        )
        if isinstance(codigo, int):
            hint = _business_error_hint(codigo) or hash_error_hint(codigo)
            if hint:
                print(hint, file=sys.stderr)
        return 1

    print(
        f"\nOK — Prenotação vencida finalizada no pedido {cfg['id_pedido']} "
        f"({len(cfg['anexos'])} anexo(s))."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
