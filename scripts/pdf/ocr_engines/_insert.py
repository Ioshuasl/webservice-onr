from __future__ import annotations

from typing import Any

import pymupdf

from pymupdf4llm.ocr.rapidocr_api import FONT, FONTNAME, REPLACEMENT_UNICODE, ocr_text


def prepare_pixmap(page, dpi: int, keep_ocr_text: bool = False):
    """Remove texto legível e retorna (pixmap, fffd_spans)."""
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

    pixmap = None
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
    return pixmap, fffd_spans


def clear_fffd_spans(page, fffd_spans: list) -> None:
    if not fffd_spans:
        return
    for sbbox in fffd_spans:
        page.add_redact_annot(sbbox)
    page.apply_redactions(
        images=pymupdf.PDF_REDACT_IMAGE_NONE,
        graphics=pymupdf.PDF_REDACT_LINE_ART_NONE,
        text=pymupdf.PDF_REDACT_TEXT_REMOVE,
    )


def adjust_width(text: str, fontsize: float, rect: pymupdf.Rect) -> pymupdf.Matrix:
    tl = FONT.text_length(text, fontsize)
    if tl > 0:
        return pymupdf.Matrix(rect.width / tl, 1)
    return pymupdf.Matrix(1, 1)


def insert_ocr_lines(page, matrix: pymupdf.Matrix, lines: list[Any]) -> None:
    """Insere linhas OCR: cada item é (box, text, conf) estilo RapidOCR/Paddle."""
    page.insert_font(fontname=FONTNAME, fontbuffer=FONT.buffer)
    for line in lines:
        if not line:
            continue
        box, text, _conf = line[0], line[1], line[2] if len(line) > 2 else 1.0
        if not str(text).strip():
            continue
        tl, _tr, br, _bl = box
        rect = pymupdf.Rect(tl[0], tl[1], br[0], br[1]) * matrix
        fontsize = max(rect.height, 6)
        mat = adjust_width(str(text), fontsize, rect)
        page.insert_text(
            rect.bl + (0, -0.2 * fontsize),
            str(text),
            fontsize=fontsize,
            fontname=FONTNAME,
            render_mode=0,
            morph=(rect.bl, mat),
        )
