#!/usr/bin/env python3
"""Orquestra conversão PDF→MD da pasta webservice-cra com tracking JSON."""

from __future__ import annotations

import json
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BATCH_FILE = ROOT / "batch-convert-pdf-webservice-cra-md.json"
CONVERT_SCRIPT = ROOT / "pdf_to_markdown_pymupdf.py"
FIX_SCRIPT = ROOT / "scripts" / "fix-cra-markdown.py"
SOURCE_DIR = ROOT / "webservice-cra"

CONVERT_FLAGS = [
    "--profile",
    "cra-image",
    "--quality-report",
]

MIN_QUALITY_SCORE = 70
MAX_OMITTED_RATIO = 0.05


def now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def load_batch() -> dict:
    return json.loads(BATCH_FILE.read_text(encoding="utf-8"))


def save_batch(data: dict) -> None:
    data["updated_at"] = now_iso()
    done = sum(1 for f in data["files"] if f["status"] == "done")
    blocked = sum(1 for f in data["files"] if f["status"] == "blocked")
    pending = sum(1 for f in data["files"] if f["status"] == "pending")
    data["status_summary"] = {
        "total": len(data["files"]),
        "pending": pending,
        "done": done,
        "blocked": blocked,
    }
    BATCH_FILE.write_text(
        json.dumps(data, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def run(cmd: list[str], timeout: int = 600) -> tuple[int, str]:
    proc = subprocess.run(
        cmd,
        cwd=ROOT,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        timeout=timeout,
    )
    out = (proc.stdout or "") + (proc.stderr or "")
    return proc.returncode, out.strip()


def process_one(entry: dict) -> str:
    """Retorna 'done', 'blocked' ou 'skipped'."""
    pdf_path = SOURCE_DIR / entry["pdf"]
    md_path = SOURCE_DIR / entry["md"]

    if not pdf_path.is_file():
        entry["status"] = "blocked"
        entry["notes"] = f"PDF não encontrado: {pdf_path.name}"
        entry["blocked_at"] = now_iso()
        return "blocked"

    entry["started_at"] = now_iso()
    entry["status"] = "converting"

    if md_path.is_file() and entry.get("skip_convert_if_md_exists"):
        entry["notes"] = "MD já existia; pulando conversão"
    else:
        cmd = [
            sys.executable,
            str(CONVERT_SCRIPT),
            str(pdf_path),
            str(md_path),
            *CONVERT_FLAGS,
        ]
        code, out = run(cmd, timeout=900)
        entry["convert_exit_code"] = code
        entry["convert_log_tail"] = out[-2000:] if out else ""
        if code != 0:
            entry["status"] = "blocked"
            entry["notes"] = f"Conversão falhou (exit {code})"
            entry["blocked_at"] = now_iso()
            return "blocked"

        if not md_path.is_file() or md_path.stat().st_size < 100:
            entry["status"] = "blocked"
            entry["notes"] = "MD não gerado ou vazio"
            entry["blocked_at"] = now_iso()
            return "blocked"

        quality_path = md_path.with_suffix(".quality.json")
        if quality_path.is_file():
            try:
                report = json.loads(quality_path.read_text(encoding="utf-8"))
                entry["quality_report"] = {
                    "quality_score": report.get("quality_score"),
                    "omitted_ratio": report.get("omitted_ratio"),
                    "omitted_count": report.get("omitted_count"),
                    "xml_valid": report.get("xml_valid"),
                }
                score = report.get("quality_score", 0)
                ratio = report.get("omitted_ratio", 1.0)
                if score < MIN_QUALITY_SCORE:
                    entry["status"] = "blocked"
                    entry["notes"] = f"quality_score baixo ({score} < {MIN_QUALITY_SCORE})"
                    entry["blocked_at"] = now_iso()
                    return "blocked"
                if ratio > MAX_OMITTED_RATIO:
                    entry["status"] = "blocked"
                    entry["notes"] = f"omitted_ratio alto ({ratio} > {MAX_OMITTED_RATIO})"
                    entry["blocked_at"] = now_iso()
                    return "blocked"
            except (json.JSONDecodeError, OSError) as exc:
                entry["quality_report_error"] = str(exc)

    entry["status"] = "validating"
    code, out = run([sys.executable, str(FIX_SCRIPT), str(md_path), "--check-only"])
    entry["validate_before"] = out
    entry["validate_ok_before"] = code == 0

    entry["status"] = "fixing"
    code, out = run([sys.executable, str(FIX_SCRIPT), str(md_path)])
    entry["fix_log"] = out

    code, out = run([sys.executable, str(FIX_SCRIPT), str(md_path), "--check-only"])
    entry["validate_after"] = out
    entry["validate_ok_after"] = code == 0
    entry["md_chars"] = md_path.stat().st_size if md_path.is_file() else 0
    entry["finished_at"] = now_iso()

    if md_path.is_file() and md_path.stat().st_size >= 200:
        entry["status"] = "done"
        entry["notes"] = (
            "validado" if entry["validate_ok_after"] else "corrigido com ressalvas"
        )
        return "done"

    entry["status"] = "blocked"
    entry["notes"] = "MD insuficiente após correção"
    entry["blocked_at"] = now_iso()
    return "blocked"


def main() -> int:
    data = load_batch()
    data["current_file"] = None
    save_batch(data)

    for entry in data["files"]:
        if entry["status"] in ("done", "blocked"):
            continue

        data["current_file"] = entry["pdf"]
        save_batch(data)

        result = process_one(entry)
        save_batch(data)

        if result == "blocked":
            print(f"BLOCKER: {entry['pdf']} — {entry.get('notes', '')}", file=sys.stderr)
            return 2

        print(f"OK: {entry['pdf']} -> {entry['md']} ({entry.get('notes', '')})")

    data["current_file"] = None
    data["completed_at"] = now_iso()
    save_batch(data)
    print(f"Batch completo: {data['status_summary']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
