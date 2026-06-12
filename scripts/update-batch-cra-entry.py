#!/usr/bin/env python3
"""Atualiza uma entrada em batch-convert-pdf-webservice-cra-md.json (sem orquestrar)."""

from __future__ import annotations

import json
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BATCH = ROOT / "batch-convert-pdf-webservice-cra-md.json"


def main() -> int:
    if len(sys.argv) < 3:
        print("Uso: update-batch-cra-entry.py <pdf_name> <status> [notes]", file=sys.stderr)
        return 1

    pdf_name, status = sys.argv[1], sys.argv[2]
    notes = sys.argv[3] if len(sys.argv) > 3 else ""
    md_chars = int(sys.argv[4]) if len(sys.argv) > 4 else None

    data = json.loads(BATCH.read_text(encoding="utf-8"))
    now = datetime.now(timezone.utc).replace(microsecond=0).isoformat()

    for entry in data["files"]:
        if entry["pdf"] != pdf_name:
            continue
        entry["status"] = status
        if notes:
            entry["notes"] = notes
        if md_chars is not None:
            entry["md_chars"] = md_chars
        if status == "done":
            entry["finished_at"] = now
        elif status == "converting":
            entry["started_at"] = now
        elif status == "blocked":
            entry["blocked_at"] = now
        break
    else:
        print(f"PDF não encontrado no batch: {pdf_name}", file=sys.stderr)
        return 1

    done = sum(1 for f in data["files"] if f["status"] == "done")
    blocked = sum(1 for f in data["files"] if f["status"] == "blocked")
    pending = [f["pdf"] for f in data["files"] if f["status"] == "pending"]
    data["status_summary"] = {
        "total": len(data["files"]),
        "pending": len(pending),
        "done": done,
        "blocked": blocked,
    }
    data["current_file"] = pending[0] if pending else None
    data["updated_at"] = now
    if not pending and not blocked:
        data["completed_at"] = now

    BATCH.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"{done}/{len(data['files'])} done | current: {data['current_file']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
