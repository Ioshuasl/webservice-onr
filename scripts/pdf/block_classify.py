from __future__ import annotations

import re
from dataclasses import dataclass
from enum import Enum


class BlockKind(str, Enum):
    TITLE = "title"
    PARAGRAPH = "paragraph"
    TABLE = "table"
    XML = "xml"
    IMAGE = "image"


@dataclass
class PageRegion:
    """Região da página em coordenadas de imagem (x0, y0, x1, y1)."""
    bbox: tuple[int, int, int, int]
    kind: BlockKind
    dpi: int
    engine: str


DPI_TEXT = 300
DPI_STRUCTURED = 400


def _gray(img):
    import cv2

    if img.ndim == 3:
        return cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
    return img


def detect_table_bboxes(gray, *, min_rel_area: float = 0.08) -> list[tuple[int, int, int, int]]:
    """Detecta regiões com grade (linhas H/V) típicas de tabelas CRA."""
    import cv2
    import numpy as np

    h, w = gray.shape[:2]
    if h < 40 or w < 40:
        return []

    blur = cv2.GaussianBlur(gray, (3, 3), 0)
    thr = cv2.adaptiveThreshold(
        blur, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 31, 9
    )

    scale = max(h, w) / 1000.0
    h_len = max(int(25 * scale), 10)
    v_len = max(int(25 * scale), 10)

    h_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (h_len, 1))
    v_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (1, v_len))
    horizontal = cv2.morphologyEx(thr, cv2.MORPH_OPEN, h_kernel, iterations=1)
    vertical = cv2.morphologyEx(thr, cv2.MORPH_OPEN, v_kernel, iterations=1)
    grid = cv2.add(horizontal, vertical)
    grid = cv2.dilate(grid, np.ones((3, 3), np.uint8), iterations=1)

    contours, _hier = cv2.findContours(grid, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    page_area = h * w
    boxes: list[tuple[int, int, int, int]] = []
    for cnt in contours:
        x, y, bw, bh = cv2.boundingRect(cnt)
        area = bw * bh
        if area < page_area * min_rel_area:
            continue
        if bw < w * 0.25 or bh < h * 0.08:
            continue
        boxes.append((x, y, x + bw, y + bh))

    boxes.sort(key=lambda b: (b[1], b[0]))
    return _merge_overlapping_boxes(boxes)


def _merge_overlapping_boxes(
    boxes: list[tuple[int, int, int, int]], overlap: float = 0.5
) -> list[tuple[int, int, int, int]]:
    if not boxes:
        return []
    merged: list[tuple[int, int, int, int]] = []
    for box in boxes:
        if not merged:
            merged.append(box)
            continue
        x0, y0, x1, y1 = box
        mx0, my0, mx1, my1 = merged[-1]
        ix0, iy0 = max(x0, mx0), max(y0, my0)
        ix1, iy1 = min(x1, mx1), min(y1, my1)
        if ix1 > ix0 and iy1 > iy0:
            inter = (ix1 - ix0) * (iy1 - iy0)
            area = min((x1 - x0) * (y1 - y0), (mx1 - mx0) * (my1 - my0))
            if area > 0 and inter / area >= overlap:
                merged[-1] = (min(x0, mx0), min(y0, my0), max(x1, mx1), max(y1, my1))
                continue
        merged.append(box)
    return merged


def _page_has_grid(gray) -> bool:
    return len(detect_table_bboxes(gray, min_rel_area=0.15)) > 0


def classify_page_kind(img) -> BlockKind:
    gray = _gray(img)
    if _page_has_grid(gray):
        return BlockKind.TABLE
    # páginas muito “vazias” de linhas → imagem
    edges = gray.std()
    if edges < 12:
        return BlockKind.IMAGE
    return BlockKind.PARAGRAPH


def dpi_for_kind(kind: BlockKind, *, adaptive: bool) -> int:
    if not adaptive:
        return DPI_TEXT
    if kind in (BlockKind.TABLE, BlockKind.XML):
        return DPI_STRUCTURED
    if kind == BlockKind.TITLE:
        return DPI_STRUCTURED
    return DPI_TEXT


def engine_for_kind(kind: BlockKind, default_engine: str, *, paddle_ok: bool) -> str:
    if kind == BlockKind.TABLE and paddle_ok:
        return "paddle"
    if kind == BlockKind.XML:
        return default_engine if default_engine != "paddle" else "rapidocr"
    return default_engine if default_engine != "auto" else "rapidocr"


def classify_regions(
    img,
    *,
    default_engine: str,
    adaptive_dpi: bool,
    paddle_ok: bool,
) -> list[PageRegion]:
    """Classifica regiões da página para roteamento OCR."""
    import numpy as np

    arr = np.asarray(img)
    h, w = arr.shape[:2]
    gray = _gray(arr)
    table_boxes = detect_table_bboxes(gray)

    if table_boxes:
        regions: list[PageRegion] = []
        for bbox in table_boxes:
            eng = engine_for_kind(BlockKind.TABLE, default_engine, paddle_ok=paddle_ok)
            regions.append(
                PageRegion(bbox, BlockKind.TABLE, dpi_for_kind(BlockKind.TABLE, adaptive=adaptive_dpi), eng)
            )
        return regions

    kind = classify_page_kind(arr)
    eng = engine_for_kind(kind, default_engine, paddle_ok=paddle_ok)
    dpi = dpi_for_kind(kind, adaptive=adaptive_dpi)
    return [PageRegion((0, 0, w, h), kind, dpi, eng)]


def sanitize_xml_text(text: str) -> str:
    """Limpa caracteres improváveis em trechos XML."""
    import re

    text = text.replace("″", '"').replace(""", '"').replace(""", '"')
    text = re.sub(r"\s+", " ", text).strip()
    text = text.replace("nome arquivo", "nome_arquivo")
    text = re.sub(r"<\s*(\w+)\s+([^>]+)>", _fix_xml_open_tag, text)
    return text


def _fix_xml_open_tag(match: re.Match) -> str:
    tag, attrs = match.group(1), match.group(2)
    attrs = re.sub(r"(\w+)\s*=\s*([^\"'\s>]+)", r'\1="\2"', attrs)
    return f"<{tag} {attrs}>"
