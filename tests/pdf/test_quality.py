from __future__ import annotations

import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SCRIPTS = ROOT / "scripts"
sys.path.insert(0, str(SCRIPTS))

from pdf.quality import (
    analyze_xml_blocks,
    compute_quality_score,
    count_cra_table_rows,
    count_omitted_pictures,
    omitted_ratio,
)


class TestQuality(unittest.TestCase):
    def test_omitted_ratio(self) -> None:
        md = "line\n**==> picture [1 x 1] intentionally omitted <==**\n" * 3
        self.assertEqual(count_omitted_pictures(md), 3)
        self.assertGreater(omitted_ratio(md), 0)

    def test_xml_fence_valid(self) -> None:
        md = '```xml\n<?xml version="1.0"?><root><a/></root>\n```'
        stats = analyze_xml_blocks(md)
        self.assertGreaterEqual(stats["xml_blocks"], 1)

    def test_quality_score_penalizes_omitted(self) -> None:
        clean = "# Título\n\n" + ("texto útil\n" * 50)
        dirty = clean + ("**==> picture [10 x 10] intentionally omitted <==**\n" * 20)
        self.assertGreater(compute_quality_score(clean), compute_quality_score(dirty))

    def test_cra_table_rows_bonus(self) -> None:
        md = "# Remessa\n\n" + ("| h01 | desc |\n| --- | --- |\n| t01 | x |\n" * 5)
        self.assertGreaterEqual(count_cra_table_rows(md), 2)
        score_with = compute_quality_score(md, pdf_name="ARQUVIO REMESSA XML.pdf")
        score_without = compute_quality_score("# Título\n\ntexto\n", pdf_name="ARQUVIO REMESSA XML.pdf")
        self.assertGreater(score_with, score_without)


if __name__ == "__main__":
    unittest.main()
