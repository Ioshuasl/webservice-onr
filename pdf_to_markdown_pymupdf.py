#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Converte PDF para Markdown usando PyMuPDF, via pacote pymupdf4llm (Artifex).

Dois motores:
  classic (padrão) — pymupdf4llm.helpers.pymupdf_rag: multi-coluna, tabelas markdown.
  layout          — modelo pymupdf_layout (ML) + OCR (RapidOCR/Tesseract).

Perfis:
  cra-image       — PDFs escaneados CRA (Fase 1): layout, OCR, pré-processamento CV,
                    retry de imagens omitidas e pós-processamento estrutural.

Códigos de saída:
  0 — sucesso
  1 — erro de entrada (arquivo ausente, --pages inválido)
  2 — PDF predominantemente imagem (bloqueado sem --skip-image-check)
  3 — OCR exigido mas engine indisponível (instalar rapidocr-onnxruntime)
  4 — PDF corrompido ou ilegível

Dependências:
  py -m pip install -r requirements-pdf-ocr.txt

Exemplos:
  py pdf_to_markdown_pymupdf.py doc.pdf --profile cra-image --quality-report
  py pdf_to_markdown_pymupdf.py doc.pdf --preprocess-profile cra-scan --retry-omitted-pictures
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Callable

ROOT = Path(__file__).resolve().parent
SCRIPTS = ROOT / "scripts"
PROFILES_DIR = ROOT / "profiles"

if str(SCRIPTS) not in sys.path:
    sys.path.insert(0, str(SCRIPTS))

PROFILE_FLAG_NAMES: dict[str, list[str]] = {
    "engine": ["--engine"],
    "force_ocr": ["--force-ocr"],
    "skip_image_check": ["--skip-image-check"],
    "ocr_language": ["--ocr-language"],
    "page_separators": ["--page-separators"],
    "use_ocr": ["--use-ocr", "--no-use-ocr"],
    "ocr_dpi": ["--ocr-dpi"],
    "show_progress": ["--show-progress"],
    "table_strategy": ["--table-strategy"],
    "preprocess_profile": ["--preprocess-profile"],
    "retry_omitted_pictures": ["--retry-omitted-pictures", "--no-retry-omitted-pictures"],
    "omitted_ocr_dpi": ["--omitted-ocr-dpi"],
    "postprocess": ["--postprocess", "--no-postprocess"],
    "ocr_engine": ["--ocr-engine"],
    "adaptive_dpi": ["--adaptive-dpi", "--no-adaptive-dpi"],
}


def parse_page_spec(spec: str, page_count: int) -> list[int]:
    spec = spec.strip().upper().replace(" ", "")
    if not spec:
        raise ValueError("Especificação de páginas vazia.")

    last_1based = page_count

    def one_token(tok: str) -> list[int]:
        if "-" in tok:
            a, b = tok.split("-", 1)
            try:
                start = 1 if a == "" else int(a)
                end = last_1based if b == "N" else int(b)
            except ValueError as exc:
                raise ValueError(f"Token de página inválido: '{tok}'.") from exc
        else:
            try:
                start = end = int(tok)
            except ValueError as exc:
                raise ValueError(f"Token de página inválido: '{tok}'.") from exc
        if start < 1 or end < 1:
            raise ValueError(f"Página inválida em '{tok}' (use 1…{last_1based}).")
        if start > end:
            start, end = end, start
        return list(range(start - 1, min(end, last_1based)))

    seen: set[int] = set()
    out: list[int] = []
    for part in spec.split(","):
        if not part:
            continue
        for idx in one_token(part):
            if idx >= page_count:
                continue
            if idx not in seen:
                seen.add(idx)
                out.append(idx)
    if not out:
        raise ValueError("Nenhuma página válida na especificação.")
    out.sort()
    return out


def load_profile(name: str) -> dict[str, Any]:
    path = PROFILES_DIR / f"{name}.yaml"
    if not path.is_file():
        raise ValueError(f"Perfil não encontrado: {name} (esperado {path}).")

    out: dict[str, Any] = {}
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or ":" not in line:
            continue
        key, raw = line.split(":", 1)
        key = key.strip()
        value = raw.strip().strip('"').strip("'")
        if value.lower() == "true":
            out[key] = True
        elif value.lower() == "false":
            out[key] = False
        elif re.fullmatch(r"-?\d+", value):
            out[key] = int(value)
        else:
            out[key] = value
    if not out:
        raise ValueError(f"Perfil vazio ou inválido: {path}")
    return out


def flag_present(argv: list[str], names: list[str]) -> bool:
    for arg in argv:
        for name in names:
            if arg == name or arg.startswith(f"{name}="):
                return True
    return False


def apply_profile(args: argparse.Namespace, argv: list[str]) -> None:
    if not args.profile:
        return
    preset = load_profile(args.profile)
    for key, value in preset.items():
        if key in ("name", "description"):
            continue
        if not hasattr(args, key):
            continue
        flags = PROFILE_FLAG_NAMES.get(key, [f"--{key.replace('_', '-')}"])
        if not flag_present(argv, flags):
            setattr(args, key, value)


def warn_ocr_flags_with_classic(args: argparse.Namespace, argv: list[str]) -> None:
    if args.engine != "classic":
        return
    ocr_flags = ["--force-ocr", "--no-use-ocr", "--ocr-language", "--ocr-dpi", "--preprocess-profile"]
    if args.force_ocr or not args.use_ocr or flag_present(argv, ocr_flags):
        print(
            "Aviso: flags de OCR/pré-processamento são ignoradas com --engine classic.",
            file=sys.stderr,
        )


def convert_pdf(
    doc: Any,
    *,
    engine: str,
    pages: list[int] | None,
    page_separators: bool,
    show_progress: bool,
    table_strategy: str,
    use_ocr: bool,
    force_ocr: bool,
    ocr_language: str,
    ocr_dpi: int,
    ocr_function: Callable | None = None,
) -> str:
    if pages is None:
        pages = list(range(doc.page_count))

    if engine == "layout":
        import pymupdf4llm

        kwargs: dict[str, Any] = {
            "pages": pages,
            "page_separators": page_separators,
            "show_progress": show_progress,
            "use_ocr": use_ocr,
            "force_ocr": force_ocr,
            "ocr_language": ocr_language,
            "ocr_dpi": ocr_dpi,
        }
        if ocr_function is not None:
            kwargs["ocr_function"] = ocr_function
        return pymupdf4llm.to_markdown(doc, **kwargs)

    from pymupdf4llm.helpers import pymupdf_rag

    return pymupdf_rag.to_markdown(
        doc,
        pages=pages,
        page_separators=page_separators,
        show_progress=show_progress,
        table_strategy=table_strategy,
    )


def detect_image_only_pdf(
    doc: Any,
    pages: list[int] | None,
    *,
    sample_pages: int = 5,
    min_text_chars: int = 80,
    min_text_pages: int = 1,
) -> tuple[bool, dict[str, int]]:
    selected = pages if pages is not None else list(range(doc.page_count))
    selected = selected[:sample_pages]
    if not selected:
        return True, {"sampled_pages": 0, "text_chars": 0, "text_pages": 0}

    total_chars = 0
    text_pages = 0
    for idx in selected:
        text = doc[idx].get_text("text") or ""
        chars = len(text.strip())
        total_chars += chars
        if chars >= 30:
            text_pages += 1

    is_image_like = total_chars < min_text_chars or text_pages < min_text_pages
    return is_image_like, {
        "sampled_pages": len(selected),
        "text_chars": total_chars,
        "text_pages": text_pages,
    }


def classify_conversion_error(exc: BaseException) -> int:
    msg = str(exc).lower()
    ocr_markers = ("ocr", "tesseract", "rapidocr", "rapid ocr")
    install_markers = ("install", "missing", "not found", "unavailable", "no module")
    if any(m in msg for m in ocr_markers) and any(m in msg for m in install_markers):
        return 3
    if "ocr" in msg and "required" in msg:
        return 3
    return 4


def write_text_atomic(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(path.suffix + ".tmp")
    try:
        tmp.write_text(content, encoding="utf-8", newline="\n")
        tmp.replace(path)
    except Exception:
        if tmp.is_file():
            tmp.unlink(missing_ok=True)
        raise


def write_quality_report(path: Path, report: dict[str, Any]) -> None:
    write_text_atomic(path, json.dumps(report, ensure_ascii=False, indent=2) + "\n")


def build_ocr_pipeline(args: argparse.Namespace) -> Callable | None:
    if not args.preprocess_profile or args.engine != "layout":
        return None
    from pdf.ocr_engines.registry import resolve_engine
    from pdf.ocr_engines.routed import build_routed_ocr_function
    from pdf.preprocess import load_preprocess_profile

    try:
        resolved = resolve_engine(args.ocr_engine)
    except RuntimeError as exc:
        raise RuntimeError(str(exc)) from exc

    print(f"OCR engine: {resolved} (adaptive_dpi={args.adaptive_dpi})", file=sys.stderr)
    config = load_preprocess_profile(args.preprocess_profile)
    debug_dir = args.save_debug_images.resolve() if args.save_debug_images else None
    return build_routed_ocr_function(
        config,
        ocr_engine=args.ocr_engine,
        adaptive_dpi=args.adaptive_dpi,
        debug_dir=debug_dir,
    )


def main(argv: list[str] | None = None) -> int:
    raw_argv = list(argv) if argv is not None else sys.argv[1:]

    p = argparse.ArgumentParser(
        description="PDF -> Markdown com PyMuPDF / pymupdf4llm.",
        epilog=(
            "Códigos de saída: 0=ok, 1=entrada inválida, 2=PDF só imagem, "
            "3=OCR indisponível, 4=PDF corrompido."
        ),
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    p.add_argument("pdf", type=Path, help="Arquivo PDF de entrada.")
    p.add_argument("out", type=Path, nargs="?", help="Arquivo .md de saída.")
    p.add_argument("--profile", choices=("cra-image",), default=None, help="Preset CRA.")
    p.add_argument("--engine", choices=("classic", "layout"), default="classic")
    p.add_argument("--pages", type=str, default=None)
    p.add_argument("--page-separators", action="store_true")
    p.add_argument("--show-progress", action="store_true")
    p.add_argument("--table-strategy", default="lines_strict")
    p.add_argument("--use-ocr", dest="use_ocr", action="store_true", default=True)
    p.add_argument("--no-use-ocr", dest="use_ocr", action="store_false")
    p.add_argument("--force-ocr", action="store_true")
    p.add_argument("--ocr-language", default="por")
    p.add_argument("--ocr-dpi", type=int, default=300)
    p.add_argument("--skip-image-check", action="store_true")
    p.add_argument("--quality-report", action="store_true")
    p.add_argument(
        "--ocr-engine",
        choices=("auto", "rapidocr", "paddle", "tesseract"),
        default="auto",
        help="Engine OCR: auto (paddle→rapidocr→tesseract), rapidocr, paddle ou tesseract.",
    )
    p.add_argument(
        "--adaptive-dpi",
        dest="adaptive_dpi",
        action="store_true",
        default=True,
        help="DPI adaptativo: 400 para tabelas/XML, 300 para texto (padrão: ligado).",
    )
    p.add_argument(
        "--no-adaptive-dpi",
        dest="adaptive_dpi",
        action="store_false",
        help="Desabilita DPI adaptativo por tipo de bloco.",
    )
    p.add_argument(
        "--preprocess-profile",
        default=None,
        help="Pré-processamento OpenCV antes do OCR (ex.: cra-scan).",
    )
    p.add_argument(
        "--retry-omitted-pictures",
        action="store_true",
        help="Re-OCR páginas com blocos 'picture intentionally omitted'.",
    )
    p.add_argument(
        "--no-retry-omitted-pictures",
        dest="retry_omitted_pictures",
        action="store_false",
        help="Desabilita retry de imagens omitidas.",
    )
    p.set_defaults(retry_omitted_pictures=False)
    p.add_argument(
        "--omitted-ocr-dpi",
        type=int,
        default=400,
        help="DPI para retry de blocos omitidos (padrão: 400).",
    )
    p.add_argument(
        "--save-debug-images",
        type=Path,
        default=None,
        help="Salva PNG antes/depois do pré-processamento por página.",
    )
    p.add_argument(
        "--postprocess",
        dest="postprocess",
        action="store_true",
        help="Aplica pós-processamento CRA (scripts/cra_markdown_postprocess.py).",
    )
    p.add_argument(
        "--no-postprocess",
        dest="postprocess",
        action="store_false",
        help="Desabilita pós-processamento CRA.",
    )
    p.set_defaults(postprocess=False)
    args = p.parse_args(raw_argv)

    try:
        apply_profile(args, raw_argv)
    except ValueError as e:
        print(f"Erro em --profile: {e}", file=sys.stderr)
        return 1

    warn_ocr_flags_with_classic(args, raw_argv)

    pdf_path = args.pdf.resolve()
    if not pdf_path.is_file():
        print(f"Arquivo não encontrado: {pdf_path}", file=sys.stderr)
        return 1

    out_path = args.out.resolve() if args.out else pdf_path.with_suffix(".md")
    quality_path = out_path.with_suffix(".quality.json")

    import pymupdf

    try:
        doc = pymupdf.open(pdf_path)
    except Exception as e:
        print(f"PDF corrompido ou ilegível: {e}", file=sys.stderr)
        return 4

    started = time.perf_counter()
    retry_warnings: list[str] = []
    try:
        page_count = doc.page_count
        pages: list[int] | None = None
        if args.pages:
            try:
                pages = parse_page_spec(args.pages, page_count)
            except ValueError as e:
                print(f"Erro em --pages: {e}", file=sys.stderr)
                return 1

        if not args.skip_image_check:
            is_image_like, metrics = detect_image_only_pdf(doc, pages)
            if is_image_like:
                print(
                    "PDF predominantemente imagem. Use --skip-image-check ou --profile cra-image.",
                    file=sys.stderr,
                )
                print(
                    f"Verificação: {metrics['sampled_pages']} pág., "
                    f"{metrics['text_chars']} chars, {metrics['text_pages']} pág. com texto.",
                    file=sys.stderr,
                )
                return 2

        try:
            ocr_function = build_ocr_pipeline(args)
        except RuntimeError as e:
            print(f"OCR indisponível: {e}", file=sys.stderr)
            print("Instale: py -m pip install -r requirements-pdf-ocr.txt", file=sys.stderr)
            return 3

        try:
            md = convert_pdf(
                doc,
                engine=args.engine,
                pages=pages,
                page_separators=args.page_separators,
                show_progress=args.show_progress,
                table_strategy=args.table_strategy,
                use_ocr=args.use_ocr,
                force_ocr=args.force_ocr,
                ocr_language=args.ocr_language,
                ocr_dpi=args.ocr_dpi,
                ocr_function=ocr_function,
            )
        except Exception as e:
            code = classify_conversion_error(e)
            label = "OCR indisponível" if code == 3 else "Falha na conversão"
            print(f"{label}: {e}", file=sys.stderr)
            if code == 3:
                print("Instale: py -m pip install -r requirements-pdf-ocr.txt", file=sys.stderr)
            return code

        md = md.replace("\r\n", "\n").rstrip() + "\n"

        if args.retry_omitted_pictures:
            from pdf.omitted_retry import retry_omitted_pictures
            from pdf.preprocess import load_preprocess_profile

            retry_config = load_preprocess_profile("cra-scan-aggressive")
            md, retry_warnings = retry_omitted_pictures(
                md,
                doc,
                omitted_ocr_dpi=args.omitted_ocr_dpi,
                preprocess_config=retry_config,
                ocr_engine=args.ocr_engine,
            )
            for w in retry_warnings:
                print(f"Retry: {w}", file=sys.stderr)

        if args.postprocess:
            from cra_markdown_postprocess import fix_markdown

            md = fix_markdown(md)

        write_text_atomic(out_path, md)
        duration = time.perf_counter() - started
        pages_converted = len(pages) if pages is not None else page_count
        print(f"Gerado: {out_path} ({len(md)} caracteres)")

        if args.quality_report:
            from pdf.quality import build_quality_metrics

            report = build_quality_metrics(
                md,
                pdf=str(pdf_path),
                md_path=str(out_path),
                profile=args.profile,
                engine=args.engine,
                preprocess_profile=args.preprocess_profile,
                ocr_engine=args.ocr_engine,
                adaptive_dpi=args.adaptive_dpi,
                pages_total=page_count,
                pages_converted=pages_converted,
                duration_sec=round(duration, 3),
                retry_warnings=retry_warnings,
                postprocessed=args.postprocess,
                generated_at=datetime.now(timezone.utc).replace(microsecond=0).isoformat(),
            )
            write_quality_report(quality_path, report)
            print(f"Relatório: {quality_path}", file=sys.stderr)

        return 0
    finally:
        doc.close()


if __name__ == "__main__":
    raise SystemExit(main())
