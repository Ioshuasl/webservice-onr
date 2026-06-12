from __future__ import annotations

import json
import os
import subprocess
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CRA_DIR = ROOT / "webservice-cra"
CONVERTER = ROOT / "pdf_to_markdown_pymupdf.py"

GOLDEN_PDFS = [
    "ARQUVIO REMESSA XML.pdf",
    "RESPOSTAS DO WEBSERVICE.pdf",
    "MÉTODOS E PARÂMETROS.pdf",
    "BOLETO DE AUTORIZAÇÃO.pdf",
    "IRREGULARIDADES.pdf",
]

INTEGRATION = os.environ.get("PDF_CONVERT_GOLDEN") == "1"


@unittest.skipUnless(INTEGRATION, "Defina PDF_CONVERT_GOLDEN=1 para testes de conversão completa")
class TestGoldenConversion(unittest.TestCase):
    def test_boleto_profile_cra_image(self) -> None:
        pdf = CRA_DIR / "BOLETO DE AUTORIZAÇÃO.pdf"
        if not pdf.is_file():
            self.skipTest("PDF golden ausente")
        out = CRA_DIR / "_test_golden_boleto.md"
        quality = CRA_DIR / "_test_golden_boleto.quality.json"
        for p in (out, quality):
            if p.is_file():
                p.unlink()
        cmd = [
            sys.executable,
            str(CONVERTER),
            str(pdf),
            str(out),
            "--profile",
            "cra-image",
            "--quality-report",
        ]
        proc = subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True, timeout=900)
        self.assertEqual(proc.returncode, 0, proc.stderr or proc.stdout)
        self.assertTrue(out.is_file())
        md = out.read_text(encoding="utf-8")
        self.assertGreaterEqual(len(md), 500)
        self.assertTrue(quality.is_file())
        report = json.loads(quality.read_text(encoding="utf-8"))
        self.assertIn("quality_score", report)
        self.assertIn("omitted_ratio", report)
        out.unlink(missing_ok=True)
        quality.unlink(missing_ok=True)


class TestGoldenBaselines(unittest.TestCase):
    """Valida MDs existentes com métricas (rápido, sem OCR)."""

    def test_remessa_xml_has_table_markers(self) -> None:
        md_path = CRA_DIR / "ARQUVIO REMESSA XML.md"
        if not md_path.is_file():
            self.skipTest("MD baseline ausente")
        text = md_path.read_text(encoding="utf-8")
        self.assertIn("| h01 ", text)
        self.assertIn("| t01 ", text)

    def test_golden_pdf_files_exist(self) -> None:
        missing = [n for n in GOLDEN_PDFS if not (CRA_DIR / n).is_file()]
        self.assertEqual(missing, [], f"PDFs golden ausentes: {missing}")


if __name__ == "__main__":
    unittest.main()
