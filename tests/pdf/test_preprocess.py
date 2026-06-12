from __future__ import annotations

import sys
import unittest
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[2]
SCRIPTS = ROOT / "scripts"
sys.path.insert(0, str(SCRIPTS))

from pdf.preprocess import PreprocessConfig, load_preprocess_profile, preprocess_image


class TestPreprocess(unittest.TestCase):
    def test_load_cra_scan_profile(self) -> None:
        cfg = load_preprocess_profile("cra-scan")
        self.assertTrue(cfg.deskew)
        self.assertTrue(cfg.clahe)
        self.assertEqual(cfg.denoise, "bilateral")
        self.assertEqual(cfg.binarize, "adaptive")

    def test_preprocess_noop_when_disabled(self) -> None:
        img = np.zeros((40, 40, 3), dtype=np.uint8)
        out = preprocess_image(img, PreprocessConfig())
        np.testing.assert_array_equal(out, img)

    def test_preprocess_pipeline_runs(self) -> None:
        img = np.full((80, 120, 3), 200, dtype=np.uint8)
        cfg = PreprocessConfig(deskew=True, clahe=True, denoise="bilateral", binarize="adaptive")
        out = preprocess_image(img, cfg)
        self.assertEqual(out.shape[0], 80)
        self.assertEqual(out.shape[1], 120)


if __name__ == "__main__":
    unittest.main()
