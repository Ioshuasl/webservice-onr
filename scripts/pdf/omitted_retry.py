from __future__ import annotations

import re
from typing import Any

from pdf.preprocess import PreprocessConfig, pixmap_to_numpy, preprocess_image
from pdf.quality import count_omitted_pictures

OMITTED_BLOCK_RE = re.compile(
    r"\*\*==> picture \[\d+ x \d+\] intentionally omitted <==\*\*"
    r"(?:\s*\n\*\*----- Start of picture text -----.*?----- End of picture text -----\*\*)?",
    re.DOTALL,
)
PAGE_MARKER_RE = re.compile(
    r"--- end of page\.page_number=(\d+) ---|<!-- page (\d+) -->"
)


def ocr_page_plaintext(
    doc: Any,
    page_index: int,
    *,
    dpi: int,
    config: PreprocessConfig,
    ocr_engine: str = "auto",
) -> str:
    from pdf.ocr_engines.registry import ocr_page_plaintext_routed

    page = doc[page_index]
    pixmap = page.get_pixmap(dpi=dpi)
    raw = pixmap_to_numpy(pixmap)
    return ocr_page_plaintext_routed(
        raw, engine=ocr_engine, preprocess_config=config, language="por"
    )


def _replace_omitted_in_chunk(chunk: str, page_1based: int, ocr_text: str) -> str:
    replacement = f"\n\n<!-- ocr-retry page {page_1based} -->\n\n{ocr_text}\n\n"
    chunk, _n = OMITTED_BLOCK_RE.subn(replacement, chunk, count=1)
    return OMITTED_BLOCK_RE.sub("", chunk)


def _apply_retry_to_chunk(
    chunk: str,
    page_idx: int,
    page_1based: int,
    doc: Any,
    *,
    omitted_ocr_dpi: int,
    preprocess_config: PreprocessConfig,
    ocr_engine: str,
    warnings: list[str],
) -> str:
    if "intentionally omitted" not in chunk or not (0 <= page_idx < doc.page_count):
        return chunk
    try:
        ocr_text = ocr_page_plaintext(
            doc,
            page_idx,
            dpi=omitted_ocr_dpi,
            config=preprocess_config,
            ocr_engine=ocr_engine,
        )
    except Exception as exc:
        warnings.append(f"page {page_1based}: retry OCR falhou ({exc})")
        return chunk
    if not ocr_text:
        warnings.append(f"page {page_1based}: retry OCR sem texto")
        return chunk
    warnings.append(f"page {page_1based}: retry OCR aplicado ({len(ocr_text)} chars)")
    return _replace_omitted_in_chunk(chunk, page_1based, ocr_text)


def retry_omitted_pictures(
    md: str,
    doc: Any,
    *,
    omitted_ocr_dpi: int,
    preprocess_config: PreprocessConfig,
    ocr_engine: str = "auto",
) -> tuple[str, list[str]]:
    if count_omitted_pictures(md) == 0:
        return md, []

    warnings: list[str] = []
    parts = PAGE_MARKER_RE.split(md)

    if len(parts) == 1:
        chunk = _apply_retry_to_chunk(
            parts[0], 0, 1, doc,
            omitted_ocr_dpi=omitted_ocr_dpi,
            preprocess_config=preprocess_config,
            ocr_engine=ocr_engine,
            warnings=warnings,
        )
        return chunk, warnings

    preamble = _apply_retry_to_chunk(
        parts[0], 0, 1, doc,
        omitted_ocr_dpi=omitted_ocr_dpi,
        preprocess_config=preprocess_config,
        ocr_engine=ocr_engine,
        warnings=warnings,
    )
    out: list[str] = [preamble]
    i = 1
    while i < len(parts):
        g1 = parts[i]
        g2 = parts[i + 1] if i + 1 < len(parts) else ""
        content = parts[i + 2] if i + 2 < len(parts) else ""
        page_1based = int(g1 or g2)
        page_idx = page_1based - 1
        marker = (
            f"--- end of page.page_number={page_1based} ---"
            if g1
            else f"<!-- page {page_1based} -->"
        )
        content = _apply_retry_to_chunk(
            content, page_idx, page_1based, doc,
            omitted_ocr_dpi=omitted_ocr_dpi,
            preprocess_config=preprocess_config,
            ocr_engine=ocr_engine,
            warnings=warnings,
        )
        out.append(marker)
        out.append(content)
        i += 3

    return "".join(out), warnings
