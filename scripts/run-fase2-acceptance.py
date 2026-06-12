#!/usr/bin/env python3
"""Testes de aceite Fase 2 — golden PDFs CRA + relatório JSON."""

from __future__ import annotations

import json
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CRA_DIR = ROOT / "webservice-cra"
CONVERTER = ROOT / "pdf_to_markdown_pymupdf.py"
OUT_DIR = ROOT / "tests" / "pdf" / "_fase2_output"
REPORT_PATH = ROOT / "tests" / "pdf" / "fase2-acceptance-report.json"

MIN_QUALITY_SCORE = 70
MAX_OMITTED_RATIO = 0.05

GOLDEN_PDFS = [
    "ARQUVIO REMESSA XML.pdf",
    "RESPOSTAS DO WEBSERVICE.pdf",
    "MÉTODOS E PARÂMETROS.pdf",
    "BOLETO DE AUTORIZAÇÃO.pdf",
    "IRREGULARIDADES.pdf",
]

EXTRA_PDFS = [
    "WEBSERVICE SOAPUI.pdf",
]


def now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def convert_one(pdf_name: str, timeout: int = 1800) -> dict:
    pdf_path = CRA_DIR / pdf_name
    stem = pdf_path.stem
    md_path = OUT_DIR / f"{stem}.md"
    quality_path = OUT_DIR / f"{stem}.quality.json"

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for p in (md_path, quality_path):
        if p.is_file():
            p.unlink()

    entry: dict = {
        "pdf": pdf_name,
        "started_at": now_iso(),
        "pass": False,
        "issues": [],
    }

    if not pdf_path.is_file():
        entry["issues"].append("PDF não encontrado")
        entry["finished_at"] = now_iso()
        return entry

    cmd = [
        sys.executable,
        str(CONVERTER),
        str(pdf_path),
        str(md_path),
        "--profile",
        "cra-image",
        "--quality-report",
    ]
    proc = subprocess.run(
        cmd,
        cwd=ROOT,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        timeout=timeout,
    )
    entry["exit_code"] = proc.returncode
    entry["log_tail"] = ((proc.stdout or "") + (proc.stderr or ""))[-3000:]

    if proc.returncode != 0:
        entry["issues"].append(f"conversão falhou (exit {proc.returncode})")
        entry["finished_at"] = now_iso()
        return entry

    if not md_path.is_file():
        entry["issues"].append("MD não gerado")
        entry["finished_at"] = now_iso()
        return entry

    md = md_path.read_text(encoding="utf-8")
    entry["chars_out"] = len(md)

    if quality_path.is_file():
        report = json.loads(quality_path.read_text(encoding="utf-8"))
        entry["quality"] = {
            k: report.get(k)
            for k in (
                "quality_score",
                "omitted_count",
                "omitted_ratio",
                "table_rows_detected",
                "xml_blocks",
                "xml_valid",
                "ocr_engine",
                "duration_sec",
            )
        }
        score = report.get("quality_score", 0)
        ratio = report.get("omitted_ratio", 1.0)
        if score < MIN_QUALITY_SCORE:
            entry["issues"].append(f"quality_score {score} < {MIN_QUALITY_SCORE}")
        if ratio > MAX_OMITTED_RATIO:
            entry["issues"].append(f"omitted_ratio {ratio} > {MAX_OMITTED_RATIO}")
    else:
        entry["issues"].append("quality.json ausente")

    if "REMESSA XML" in pdf_name.upper():
        if "| h01 " not in md and "| h01|" not in md:
            entry["issues"].append("tabela h01 não detectada no MD")
        if "| t01 " not in md and "| t01|" not in md:
            entry["issues"].append("tabela t01 não detectada no MD")

    if "RESPOSTAS DO WEBSERVICE" in pdf_name.upper():
        xml_valid = entry.get("quality", {}).get("xml_valid", 0)
        if xml_valid < 1 and "```xml" not in md.lower():
            entry["issues"].append("xml_valid < 1 e sem fence xml")

    entry["pass"] = len(entry["issues"]) == 0
    entry["finished_at"] = now_iso()
    return entry


def main() -> int:
    all_pdfs = GOLDEN_PDFS + [p for p in EXTRA_PDFS if p not in GOLDEN_PDFS]
    results = [convert_one(name) for name in all_pdfs]
    passed = sum(1 for r in results if r["pass"])
    failed = len(results) - passed

    report = {
        "phase": 2,
        "run_at": now_iso(),
        "thresholds": {
            "min_quality_score": MIN_QUALITY_SCORE,
            "max_omitted_ratio": MAX_OMITTED_RATIO,
        },
        "summary": {
            "total": len(results),
            "passed": passed,
            "failed": failed,
        },
        "results": results,
    }
    REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    REPORT_PATH.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(f"Relatório: {REPORT_PATH}")
    print(f"Resumo: {passed}/{len(results)} passou")
    for r in results:
        status = "PASS" if r["pass"] else "FAIL"
        q = r.get("quality", {})
        print(
            f"  [{status}] {r['pdf']} — score={q.get('quality_score', '?')}, "
            f"omitted={q.get('omitted_ratio', '?')}, chars={r.get('chars_out', '?')}"
        )
        if r["issues"]:
            print(f"         issues: {'; '.join(r['issues'])}")

    return 0 if failed == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
