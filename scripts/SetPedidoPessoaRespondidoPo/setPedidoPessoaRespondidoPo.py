#!/usr/bin/env python3
"""Responde pedido de certidão por pessoa (SetPedidoPessoaRespondidoPO) no webservice Penhora Online da ONR."""

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

PREFIX = "PENHORA_ONLINE_SET_PEDIDO_PESSOA_RESPONDIDO_"
ANEXO_ITEM = "SetPedidoPessoaRespondidoPO_Anexo_WSReq"
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
        id_pedido = env_int("PENHORA_ONLINE_ID_PEDIDO")
    if id_pedido is None:
        raise SystemExit(
            f"Defina {PREFIX}ID_PEDIDO ou PENHORA_ONLINE_ID_PEDIDO no .env "
            "(IDPedido de ListPedidosPO / GetPedidoPO; tipo Pessoa = IDTipoPedido 2)."
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
            matricula = row.get("Matricula") or row.get("matricula")
            url = row.get("URLArquivo") or row.get("urlArquivo") or row.get("url_arquivo")
            if not matricula or not url:
                raise SystemExit(
                    f"Item {i}: informe Matricula e URLArquivo (URL pública; spec .p7s)."
                )
            items.append({"Matricula": str(matricula), "URLArquivo": str(url)})
        return items

    matricula = env_str(f"{PREFIX}MATRICULA")
    url_arquivo = env_str(f"{PREFIX}URL_ARQUIVO")
    if matricula and url_arquivo:
        return [{"Matricula": matricula, "URLArquivo": url_arquivo}]

    raise SystemExit(
        f"Defina {PREFIX}ANEXOS_JSON (array) ou "
        f"{PREFIX}MATRICULA + {PREFIX}URL_ARQUIVO no .env."
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
        "negativa": _parse_negativa(env_str(f"{PREFIX}NEGATIVA")),
        "anexos": _load_anexos(),
        **load_penhora_online_soap_config(),
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


def _business_error_hint(codigo: int) -> str | None:
    hints = {
        12: "IDPedido inválido.",
        13: "Informe Resposta.",
        14: "Informe ao menos um anexo (Anexos).",
        51: "Não foi possível obter dados do pedido (tipo Pessoa / IDTipoPedido=2?).",
        52: "Sem permissão para responder este pedido.",
        53: "Operação só para pedidos tipo Certidão por Pessoa (IDTipoPedido=2).",
        54: "Matrícula de um ou mais anexos não informada.",
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

    print("=== Parâmetros SetPedidoPessoaRespondidoPO ===")
    print(json.dumps(o_request, ensure_ascii=False, indent=2))
    print(f"\nEndpoint: {cfg['endpoint']}")

    result = call_operation_from_cfg(cfg, "SetPedidoPessoaRespondidoPO", o_request)
    response = to_json_safe(serialize_result(result))

    print("\n=== Resposta ===")
    print(json.dumps(response, ensure_ascii=False, indent=2))

    if not response.get("RETORNO"):
        codigo = response.get("CODIGOERRO", "?")
        descricao = response.get("ERRODESCRICAO", "")
        print(
            f"\nSetPedidoPessoaRespondidoPO falhou: [{codigo}] {descricao}",
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
        f"({len(cfg['anexos'])} anexo(s))."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
