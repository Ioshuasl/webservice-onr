from __future__ import annotations

import sys
import unittest
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[2]
SCRIPTS = ROOT / "scripts"
sys.path.insert(0, str(SCRIPTS))

from pdf.block_classify import (
    BlockKind,
    classify_page_kind,
    classify_regions,
    dpi_for_kind,
    sanitize_xml_text,
)


class TestBlockClassify(unittest.TestCase):
    def test_dpi_adaptive_table(self) -> None:
        self.assertEqual(dpi_for_kind(BlockKind.TABLE, adaptive=True), 400)
        self.assertEqual(dpi_for_kind(BlockKind.PARAGRAPH, adaptive=True), 300)

    def test_classify_regions_full_page(self) -> None:
        rng = np.random.default_rng(42)
        img = rng.integers(120, 240, (200, 300, 3), dtype=np.uint8)
        regions = classify_regions(
            img, default_engine="rapidocr", adaptive_dpi=True, paddle_ok=False
        )
        self.assertEqual(len(regions), 1)
        self.assertIn(regions[0].kind, (BlockKind.PARAGRAPH, BlockKind.TITLE))

    def test_sanitize_xml_nome_arquivo(self) -> None:
        out = sanitize_xml_text("<nome arquivo>foo</nome arquivo>")
        self.assertIn("nome_arquivo", out)

    def test_table_grid_detection(self) -> None:
        import cv2

        img = np.ones((400, 600, 3), dtype=np.uint8) * 255
        for y in range(50, 350, 40):
            cv2.line(img, (30, y), (570, y), (0, 0, 0), 2)
        for x in range(30, 570, 80):
            cv2.line(img, (x, 50), (x, 350), (0, 0, 0), 2)
        kind = classify_page_kind(img)
        self.assertEqual(kind, BlockKind.TABLE)


if __name__ == "__main__":
    unittest.main()
