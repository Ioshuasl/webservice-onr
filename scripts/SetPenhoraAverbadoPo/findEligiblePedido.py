#!/usr/bin/env python3
"""Lista pedidos Penhora e encontra IDPedido elegível para SetPenhoraAverbadoPO."""

from __future__ import annotations

import json
import sys
from collections import Counter
from datetime import date, timedelta
from pathlib import Path

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))

from lib.onr_json import to_json_safe  # noqa: E402
from lib.onr_penhora_averbado import validate_pedido_for_averbado  # noqa: E402
from lib.onr_penhora_online import resolve_auth_hash  # noqa: E402
from lib.onr_soap import call_operation_from_cfg, create_client  # noqa: E402
from lib.onr_zeep_serialize import serialize_result, serialize_zeep_list  # noqa: E402
from scripts.ListPedidosPo.listPedidosPo import build_request, load_config  # noqa: E402

STATUS_LABELS = {
    1: "Aberto",
    2: "Respondido",
    3: "Devolvido",
    5: "Finalizado sem Pagamento",
    7: "Nota de Exigência",
    8: "Reaberto não Concluído",
    9: "Prenotado",
    10: "Aguardando Pagto",
    11: "Aguardando Pagto – Vencido",
    12: "Não Prenotado",
    13: "Pagamento Efetivado",
    14: "Registro / Averbação",
}


def _windows(start: date, end: date, *, days: int = 30):
    current = start
    while current <= end:
        window_end = min(current + timedelta(days=days - 1), end)
        yield current, window_end
        current = window_end + timedelta(days=1)


def _list_all_penhora(cfg: dict, start: date, end: date) -> dict[int, dict]:
    cfg = {**cfg, "id_tipo_pedido": 3, "id_status": -1, "max_row_per_page": 50}
    seen: dict[int, dict] = {}

    for w_start, w_end in _windows(start, end):
        cfg["data_solicitacao_inicial"] = w_start.isoformat()
        cfg["data_solicitacao_final"] = w_end.isoformat()
        page = 1
        while True:
            cfg["page_number"] = page
            hash_value = resolve_auth_hash(cfg["chave"], cfg["login_cfg"])
            result = call_operation_from_cfg(cfg, "ListPedidosPO", build_request(cfg, hash_value))
            data = to_json_safe(serialize_result(result))
            if not data.get("RETORNO"):
                print(
                    f"ListPedidosPO {w_start}..{w_end}: "
                    f"[{data.get('CODIGOERRO')}] {data.get('ERRODESCRICAO')}",
                    file=sys.stderr,
                )
                break

            items = serialize_zeep_list(result.Pedidos, "ListPedidosPO_Pedidos_WSResp")
            for row in items or []:
                pid = row.get("IDPedido")
                if pid is not None and pid not in seen:
                    seen[pid] = row

            total = data.get("QtdeRegistros", 0) or 0
            if not items or page * cfg["max_row_per_page"] >= total:
                break
            page += 1

        print(f"  {w_start}..{w_end}: {len(seen)} pedidos únicos", file=sys.stderr)

    return seen


def main() -> int:
    load_dotenv(ROOT / ".env", override=True)
    cfg = load_config()

    start = date(2025, 1, 1)
    end = date.today()
    print(f"Listando pedidos Penhora (tipo 3) de {start} a {end}...", file=sys.stderr)

    pedidos = _list_all_penhora(cfg, start, end)
    print(f"\nTotal únicos: {len(pedidos)}", file=sys.stderr)

    by_status = Counter(p.get("IDStatus") for p in pedidos.values())
    print("Por IDStatus:", file=sys.stderr)
    for status, count in sorted(by_status.items()):
        print(f"  {status} ({STATUS_LABELS.get(status, '?')}): {count}", file=sys.stderr)

    client = create_client(cfg["wsdl_path"], cfg["endpoint"])
    eligible: list[dict] = []
    near_miss: list[dict] = []

    for pid in sorted(pedidos):
        hash_value = resolve_auth_hash(cfg["chave"], cfg["login_cfg"])
        detail = to_json_safe(
            serialize_result(
                client.service.GetPedidoPO(oRequest={"Hash": hash_value, "IDPedido": pid})
            )
        )
        if not detail.get("RETORNO"):
            continue

        warnings = validate_pedido_for_averbado(detail)
        entry = {
            "IDPedido": pid,
            "Protocolo": detail.get("Protocolo"),
            "IDStatus": detail.get("IDStatus"),
            "Status": STATUS_LABELS.get(detail.get("IDStatus"), "?"),
            "NumeroPrenotacao": detail.get("NumeroPrenotacao"),
            "Matricula": detail.get("Matricula"),
            "DataSolicitacao": detail.get("DataSolicitacao"),
            "Pago": detail.get("Pago"),
            "Resposta": (detail.get("Resposta") or "")[:80] or None,
        }
        if not warnings:
            eligible.append(entry)
        elif detail.get("IDStatus") == 13 or detail.get("Pago"):
            near_miss.append({**entry, "warnings": warnings})

    preferidos = [e for e in eligible if e.get("IDStatus") == 13 and e.get("Pago")]
    recomendado = preferidos[0] if preferidos else (eligible[0] if eligible else None)

    out = {
        "total_listados": len(pedidos),
        "elegiveis_count": len(eligible),
        "elegiveis_preferidos_count": len(preferidos),
        "elegiveis": eligible,
        "elegiveis_preferidos": preferidos,
        "candidatos_com_aviso": near_miss[:10],
        "recomendado": recomendado,
    }
    print(json.dumps(out, ensure_ascii=False, indent=2))

    if recomendado:
        best = recomendado
        mat = best.get("Matricula") or "12345"
        print(
            f"\n>>> Sugestão .env:\n"
            f"    PENHORA_ONLINE_SET_PENHORA_AVERBADO_ID_PEDIDO={best['IDPedido']}\n"
            f"    PENHORA_ONLINE_ID_PEDIDO={best['IDPedido']}\n"
            f"    PENHORA_ONLINE_SET_PENHORA_AVERBADO_MATRICULA={mat}\n"
            f"    # URLArquivo: URL pública (.p7s na spec; homolog hml3 aceitou .pdf)",
            file=sys.stderr,
        )
        return 0

    print("\nNenhum pedido elegível para averbado no período.", file=sys.stderr)
    if near_miss:
        print("Candidatos próximos:", file=sys.stderr)
        for c in near_miss[:5]:
            print(f"  {c['IDPedido']} status={c['IDStatus']}: {c['warnings']}", file=sys.stderr)
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
