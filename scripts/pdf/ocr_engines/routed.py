from __future__ import annotations

from pathlib import Path
from typing import Callable

import pymupdf

from pdf.block_classify import (
    BlockKind,
    PageRegion,
    classify_regions,
    dpi_for_kind,
    engine_for_kind,
    sanitize_xml_text,
)
from pdf.ocr_engines._insert import clear_fffd_spans, insert_ocr_lines, prepare_pixmap
from pdf.ocr_engines.registry import paddle_usable, resolve_engine, run_ocr_on_image
from pdf.preprocess import PreprocessConfig, pixmap_to_numpy, preprocess_image, save_debug_pair


def build_routed_ocr_function(
    config: PreprocessConfig,
    *,
    ocr_engine: str = "auto",
    adaptive_dpi: bool = True,
    debug_dir: Path | None = None,
) -> Callable:
    """OCR com classificação de bloco, DPI adaptativo e engine selecionável."""

    try:
        default_engine = resolve_engine(ocr_engine)
    except RuntimeError:
        default_engine = "rapidocr"

    paddle_ok = paddle_usable()

    def exec_ocr(page, dpi=300, pixmap=None, language="eng", keep_ocr_text=False):
        base_dpi = dpi
        pixmap, fffd_spans = prepare_pixmap(page, base_dpi, keep_ocr_text=keep_ocr_text)
        raw_img = pixmap_to_numpy(pixmap)
        processed = preprocess_image(raw_img, config)

        if debug_dir is not None:
            save_debug_pair(debug_dir, page.number + 1, raw_img, processed)

        regions = classify_regions(
            processed,
            default_engine=default_engine,
            adaptive_dpi=adaptive_dpi,
            paddle_ok=paddle_ok,
        )
        if not regions:
            h, w = processed.shape[:2]
            regions = [
                PageRegion(
                    (0, 0, w, h),
                    BlockKind.PARAGRAPH,
                    dpi_for_kind(BlockKind.PARAGRAPH, adaptive=adaptive_dpi),
                    default_engine,
                )
            ]

        matrix = pymupdf.Rect(pixmap.irect).torect(page.rect)

        for region in regions:
            x0, y0, x1, y1 = region.bbox
            crop = processed[y0:y1, x0:x1]
            if crop.size == 0:
                continue

            eng = region.engine
            if eng == "auto":
                eng = engine_for_kind(region.kind, default_engine, paddle_ok=paddle_ok)

            lines = run_ocr_on_image(crop, eng, language=language)
            if region.kind == BlockKind.XML:
                lines = [
                    (ln[0], sanitize_xml_text(str(ln[1])), ln[2] if len(ln) > 2 else 1.0)
                    for ln in lines
                ]

            # Ajusta boxes do crop para coordenadas da página
            offset_lines = []
            for ln in lines:
                box, text, conf = ln[0], ln[1], ln[2] if len(ln) > 2 else 1.0
                adj = [[p[0] + x0, p[1] + y0] for p in box]
                offset_lines.append((adj, text, conf))

            insert_ocr_lines(page, matrix, offset_lines)

        clear_fffd_spans(page, fffd_spans)

    return exec_ocr
