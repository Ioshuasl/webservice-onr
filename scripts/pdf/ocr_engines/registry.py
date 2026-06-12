from __future__ import annotations

import sys

OCR_ENGINES = ("auto", "rapidocr", "paddle", "tesseract")

_PADDLE: object | None = None
_PADDLE_RUNTIME_OK: bool | None = None
_TESSERACT_OK: bool | None = None


def rapidocr_available() -> bool:
    try:
        import rapidocr_onnxruntime  # noqa: F401

        return True
    except ImportError:
        return False


def paddle_available() -> bool:
    try:
        from paddleocr import PaddleOCR  # noqa: F401

        return True
    except ImportError:
        return False


def paddle_usable() -> bool:
    """Paddle instalado; False após primeira falha em runtime (_run_paddle)."""
    global _PADDLE_RUNTIME_OK
    if _PADDLE_RUNTIME_OK is not None:
        return _PADDLE_RUNTIME_OK
    if not paddle_available():
        _PADDLE_RUNTIME_OK = False
        return False
    return True


def tesseract_available() -> bool:
    global _TESSERACT_OK
    if _TESSERACT_OK is not None:
        return _TESSERACT_OK
    try:
        from pymupdf4llm.ocr import tesseract_api  # noqa: F401

        _TESSERACT_OK = True
    except ImportError:
        _TESSERACT_OK = False
    return _TESSERACT_OK


def resolve_engine(name: str) -> str:
    name = (name or "auto").lower()
    if name not in OCR_ENGINES:
        raise ValueError(f"OCR engine inválido: {name}. Use: {', '.join(OCR_ENGINES)}")

    if name == "auto":
        # RapidOCR primeiro — Paddle 3.x pode falhar em Windows/Python 3.13 (oneDNN).
        if rapidocr_available():
            return "rapidocr"
        if paddle_usable():
            return "paddle"
        if tesseract_available():
            return "tesseract"
        raise RuntimeError(
            "Nenhum engine OCR disponível. Instale: py -m pip install -r requirements-pdf-ocr.txt"
        )

    if name == "paddle" and not paddle_available():
        raise RuntimeError("PaddleOCR indisponível. Instale paddlepaddle + paddleocr.")
    if name == "rapidocr" and not rapidocr_available():
        raise RuntimeError("RapidOCR indisponível. Instale rapidocr-onnxruntime.")
    if name == "tesseract" and not tesseract_available():
        raise RuntimeError("Tesseract indisponível via pymupdf4llm.")
    return name


def get_paddle_engine():
    global _PADDLE
    if _PADDLE is None:
        from paddleocr import PaddleOCR

        _PADDLE = PaddleOCR(lang="pt")
    return _PADDLE


def _normalize_paddle_result(result) -> list[tuple]:
    out: list[tuple] = []
    if not result:
        return out

    # PaddleOCR 2.x: [[[box, (text, conf)], ...]]
    if isinstance(result, list) and result and isinstance(result[0], list):
        page = result[0]
        for line in page:
            if not line or len(line) < 2:
                continue
            box, text_conf = line[0], line[1]
            text = text_conf[0] if isinstance(text_conf, (list, tuple)) else str(text_conf)
            conf = text_conf[1] if isinstance(text_conf, (list, tuple)) and len(text_conf) > 1 else 1.0
            out.append((box, text, conf))
        return out

    # PaddleOCR 3.x / PaddleX: lista de objetos com rec_texts / dt_polys
    for item in result:
        if isinstance(item, dict):
            texts = item.get("rec_texts") or item.get("texts") or []
            scores = item.get("rec_scores") or item.get("scores") or []
            polys = item.get("dt_polys") or item.get("rec_polys") or []
            for i, text in enumerate(texts):
                if not str(text).strip():
                    continue
                box = polys[i] if i < len(polys) else [[0, 0], [1, 0], [1, 1], [0, 1]]
                conf = scores[i] if i < len(scores) else 1.0
                out.append((box, str(text), float(conf)))
    return out


def run_ocr_on_image(img, engine: str, *, language: str = "por") -> list[tuple]:
    engine = resolve_engine(engine) if engine == "auto" else engine

    if engine == "paddle":
        return _run_paddle(img)
    if engine == "tesseract":
        return _run_tesseract_crop(img, language=language)
    return _run_rapidocr(img)


def _run_rapidocr(img) -> list[tuple]:
    from rapidocr_onnxruntime import RapidOCR

    result = RapidOCR()(img)
    lines = result[0] or []
    return [(ln[0], ln[1], ln[2] if len(ln) > 2 else 1.0) for ln in lines if ln]


def _run_paddle(img) -> list[tuple]:
    global _PADDLE_RUNTIME_OK
    try:
        ocr = get_paddle_engine()
        if hasattr(ocr, "predict"):
            result = ocr.predict(img)
        else:
            result = ocr.ocr(img)
        lines = _normalize_paddle_result(result)
        if lines:
            return lines
    except Exception as exc:
        _PADDLE_RUNTIME_OK = False
        print(f"Aviso: PaddleOCR falhou ({exc}); fallback RapidOCR.", file=sys.stderr)
    return _run_rapidocr(img)


def _run_tesseract_crop(img, *, language: str) -> list[tuple]:
    if not rapidocr_available():
        return []
    _ = language
    return _run_rapidocr(img)


def ocr_page_plaintext_routed(
    img,
    *,
    engine: str,
    preprocess_config,
    language: str = "por",
) -> str:
    from pdf.block_classify import BlockKind, classify_regions, sanitize_xml_text
    from pdf.preprocess import preprocess_image

    processed = preprocess_image(img, preprocess_config)
    try:
        default = resolve_engine(engine)
    except RuntimeError:
        default = "rapidocr"

    regions = classify_regions(
        processed,
        default_engine=default,
        adaptive_dpi=True,
        paddle_ok=paddle_usable(),
    )

    chunks: list[str] = []
    for region in regions:
        x0, y0, x1, y1 = region.bbox
        crop = processed[y0:y1, x0:x1]
        if crop.size == 0:
            continue
        lines = run_ocr_on_image(crop, region.engine, language=language)
        texts = [str(t[1]).strip() for t in lines if t and str(t[1]).strip()]
        if region.kind == BlockKind.TABLE:
            chunks.append(_table_lines_to_markdown(texts, lines))
        elif region.kind == BlockKind.XML:
            chunks.append(sanitize_xml_text("\n".join(texts)))
        else:
            chunks.append("\n".join(texts))
    return "\n\n".join(c for c in chunks if c.strip())


def _table_lines_to_markdown(texts: list[str], line_boxes: list[tuple]) -> str:
    if not texts:
        return ""
    if len(texts) <= 2:
        return "\n".join(texts)

    rows: dict[int, list[str]] = {}
    for item in line_boxes:
        box, text, _ = item[0], item[1], item[2] if len(item) > 2 else 1.0
        if not str(text).strip():
            continue
        y_key = int(sum(p[1] for p in box) / len(box) / 8)
        rows.setdefault(y_key, []).append(str(text).strip())

    if len(rows) < 2:
        return "\n".join(texts)

    sorted_rows = [" | ".join(rows[k]) for k in sorted(rows)]
    if all("|" in r for r in sorted_rows[:3]):
        header = sorted_rows[0]
        sep = " | ".join("---" for _ in header.split(" | "))
        return "\n".join([f"| {header} |", f"| {sep} |", *[f"| {r} |" for r in sorted_rows[1:]]])
    return "\n".join(sorted_rows)
