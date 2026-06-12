from __future__ import annotations

import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SCRIPTS = ROOT / "scripts"
sys.path.insert(0, str(SCRIPTS))

from pdf.ocr_engines.registry import OCR_ENGINES, rapidocr_available, resolve_engine


class TestRegistry(unittest.TestCase):
    def test_ocr_engines_list(self) -> None:
        self.assertIn("auto", OCR_ENGINES)
        self.assertIn("rapidocr", OCR_ENGINES)

    def test_resolve_rapidocr(self) -> None:
        if not rapidocr_available():
            self.skipTest("rapidocr não instalado")
        self.assertEqual(resolve_engine("rapidocr"), "rapidocr")

    def test_resolve_auto_prefers_rapidocr(self) -> None:
        if not rapidocr_available():
            self.skipTest("rapidocr não instalado")
        self.assertEqual(resolve_engine("auto"), "rapidocr")


if __name__ == "__main__":
    unittest.main()
