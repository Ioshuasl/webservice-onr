from __future__ import annotations

import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SCRIPTS = ROOT / "scripts"
sys.path.insert(0, str(SCRIPTS))

from cra_markdown_postprocess import fix_markdown, validate_markdown


class TestPostprocess(unittest.TestCase):
    def test_removes_ui_noise(self) -> None:
        raw = "Estimated reading: 2 minutes\nViews: 80\n\n# Título\n\nConteúdo.\n"
        fixed = fix_markdown(raw)
        self.assertNotIn("Estimated reading", fixed)
        self.assertNotIn("Views:", fixed)
        self.assertIn("# Título", fixed)

    def test_fixes_nome_arquivo(self) -> None:
        raw = "<nome arquivo>teste</nome arquivo>\n"
        fixed = fix_markdown(raw)
        self.assertIn("nome_arquivo", fixed)

    def test_validate_rejects_high_omitted_ratio(self) -> None:
        bad = "\n".join(["**==> picture [1 x 1] intentionally omitted <==**"] * 30)
        ok, issues = validate_markdown(bad)
        self.assertFalse(ok)
        self.assertTrue(any("omitted" in i for i in issues))


if __name__ == "__main__":
    unittest.main()
