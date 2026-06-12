from __future__ import annotations

from pathlib import Path
from typing import Callable

from pdf.preprocess import PreprocessConfig, pixmap_to_numpy, preprocess_image, save_debug_pair


def build_ocr_function(
    config: PreprocessConfig,
    *,
    debug_dir: Path | None = None,
) -> Callable:
    """
    Retorna callable compatível com pymupdf4llm (page, dpi, pixmap, language, keep_ocr_text).
    Aplica pré-processamento OpenCV antes do RapidOCR.
    """
    from rapidocr_onnxruntime import RapidOCR

    import pymupdf

    from pymupdf4llm.ocr.rapidocr_api import FONT, FONTNAME, REPLACEMENT_UNICODE, ocr_text

    engine = RapidOCR()

    def adjust_width(text: str, fontsize: float, rect: pymupdf.Rect) -> pymupdf.Matrix:
        tl = FONT.text_length(text, fontsize)
        if tl > 0:
            return pymupdf.Matrix(rect.width / tl, 1)
        return pymupdf.Matrix(1, 1)

    def exec_ocr(page, dpi=300, pixmap=None, language="eng", keep_ocr_text=False):
        text_blocks = page.get_text("dict", flags=pymupdf.TEXT_ACCURATE_BBOXES)["blocks"]
        spans: list = []
        fffd_spans: list = []
        for b in text_blocks:
            for line in b["lines"]:
                for s in line["spans"]:
                    if ocr_text(s):
                        (spans if keep_ocr_text else fffd_spans).append(s["bbox"])
                        continue
                    if REPLACEMENT_UNICODE not in s["text"]:
                        spans.append(s["bbox"])
                    else:
                        fffd_spans.append(s["bbox"])

        if spans:
            temp_pdf = pymupdf.open()
            temp_pdf.insert_pdf(page.parent, from_page=page.number, to_page=page.number)
            temp_page = temp_pdf[0]
            for sbbox in spans:
                temp_page.add_redact_annot(sbbox)
            temp_page.apply_redactions(
                images=pymupdf.PDF_REDACT_IMAGE_NONE,
                graphics=pymupdf.PDF_REDACT_LINE_ART_NONE,
                text=pymupdf.PDF_REDACT_TEXT_REMOVE,
            )
            pixmap = temp_page.get_pixmap(dpi=dpi)
            temp_pdf.close()

        if pixmap is None:
            pixmap = page.get_pixmap(dpi=dpi)

        raw_img = pixmap_to_numpy(pixmap)
        processed = preprocess_image(raw_img, config)

        if debug_dir is not None:
            save_debug_pair(debug_dir, page.number + 1, raw_img, processed)

        matrix = pymupdf.Rect(pixmap.irect).torect(page.rect)
        result = engine(processed)

        if fffd_spans:
            for sbbox in fffd_spans:
                page.add_redact_annot(sbbox)
            page.apply_redactions(
                images=pymupdf.PDF_REDACT_IMAGE_NONE,
                graphics=pymupdf.PDF_REDACT_LINE_ART_NONE,
                text=pymupdf.PDF_REDACT_TEXT_REMOVE,
            )

        page.insert_font(fontname=FONTNAME, fontbuffer=FONT.buffer)
        lines = result[0] or []
        for line in lines:
            if not line:
                continue
            box, text, _conf = line
            tl, _tr, br, _bl = box
            rect = pymupdf.Rect(tl[0], tl[1], br[0], br[1]) * matrix
            if not text.strip():
                continue
            fontsize = rect.height
            mat = adjust_width(text, fontsize, rect)
            page.insert_text(
                rect.bl + (0, -0.2 * fontsize),
                text,
                fontsize=fontsize,
                fontname=FONTNAME,
                render_mode=0,
                morph=(rect.bl, mat),
            )

    return exec_ocr
