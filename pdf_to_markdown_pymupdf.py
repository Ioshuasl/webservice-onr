#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Converte PDF para Markdown usando PyMuPDF, via pacote pymupdf4llm (Artifex).

Dois motores:
  classic (padrão) — pymupdf4llm.helpers.pymupdf_rag: multi-coluna, tabelas
                    markdown, headers por tamanho de fonte. Costuma preservar
                    bem tabelas tipo “Nome do Campo | Descrição | …”.
  layout          — modelo pymupdf_layout (ML): bom para fluxo de leitura em
                    páginas complexas; pode alterar ordem relativa de blocos.

Dependências:
  py -m pip install pymupdf pymupdf4llm

Exemplos:
  py pdf_to_markdown_pymupdf.py Manual_Urbanos.pdf
  py pdf_to_markdown_pymupdf.py Manual_Rurais.pdf saida.md --engine layout
  py pdf_to_markdown_pymupdf.py doc.pdf --pages 1-5,10 --page-separators
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path


def parse_page_spec(spec: str, page_count: int) -> list[int]:
    """
    Interpreta páginas em formato 1-based, como em ferramentas comuns.
    Ex.: "1", "1-3", "5-N", "1-5,10,12-N". Retorna índices 0-based únicos e ordenados.
    """
    spec = spec.strip().upper().replace(" ", "")
    if not spec:
        raise ValueError("Especificação de páginas vazia.")

    last_1based = page_count

    def one_token(tok: str) -> list[int]:
        if "-" in tok:
            a, b = tok.split("-", 1)
            start = 1 if a == "" else int(a)
            if b == "N":
                end = last_1based
            else:
                end = int(b)
        else:
            start = end = int(tok)
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


def convert_pdf(
    pdf_path: Path,
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
) -> str:
    import pymupdf

    doc = pymupdf.open(pdf_path)
    try:
        if pages is None:
            pages = list(range(doc.page_count))

        if engine == "layout":
            import pymupdf4llm

            return pymupdf4llm.to_markdown(
                doc,
                pages=pages,
                page_separators=page_separators,
                show_progress=show_progress,
                use_ocr=use_ocr,
                force_ocr=force_ocr,
                ocr_language=ocr_language,
                ocr_dpi=ocr_dpi,
            )

        from pymupdf4llm.helpers import pymupdf_rag

        return pymupdf_rag.to_markdown(
            doc,
            pages=pages,
            page_separators=page_separators,
            show_progress=show_progress,
            table_strategy=table_strategy,
        )
    finally:
        doc.close()


def detect_image_only_pdf(
    pdf_path: Path,
    pages: list[int] | None,
    *,
    sample_pages: int = 5,
    min_text_chars: int = 80,
    min_text_pages: int = 1,
) -> tuple[bool, dict[str, int]]:
    """
    Detecta PDFs sem texto útil extraível (predominantemente imagem).

    Regra simples:
    - amostra até `sample_pages` páginas (ou páginas selecionadas)
    - soma caracteres de texto extraível por página
    - marca como "imagem" quando a amostra não atinge `min_text_chars`
      ou quando nenhuma página da amostra passa de 30 caracteres.
    """
    import pymupdf

    doc = pymupdf.open(pdf_path)
    try:
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
    finally:
        doc.close()


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(description="PDF -> Markdown com PyMuPDF / pymupdf4llm.")
    p.add_argument("pdf", type=Path, help="Arquivo PDF de entrada.")
    p.add_argument(
        "out",
        type=Path,
        nargs="?",
        help="Arquivo .md de saída (padrão: mesmo nome do PDF com .md).",
    )
    p.add_argument(
        "--engine",
        choices=("classic", "layout"),
        default="classic",
        help="classic = pymupdf_rag (padrão); layout = pymupdf_layout + ML.",
    )
    p.add_argument(
        "--pages",
        type=str,
        default=None,
        help='Páginas 1-based, ex.: "1-5,10" ou "3-N". Omitir = documento inteiro.',
    )
    p.add_argument(
        "--page-separators",
        action="store_true",
        help="Inserir separadores entre páginas no Markdown.",
    )
    p.add_argument(
        "--show-progress",
        action="store_true",
        help="Mostrar progresso por página.",
    )
    p.add_argument(
        "--table-strategy",
        default="lines_strict",
        help="Somente --engine classic: estratégia de detecção de tabelas (PyMuPDF).",
    )
    p.add_argument(
        "--use-ocr",
        dest="use_ocr",
        action="store_true",
        default=True,
        help="Habilita OCR no pipeline layout (padrão: ligado).",
    )
    p.add_argument(
        "--no-use-ocr",
        dest="use_ocr",
        action="store_false",
        help="Desabilita OCR no pipeline layout.",
    )
    p.add_argument(
        "--force-ocr",
        action="store_true",
        help="(layout) Força OCR inclusive em blocos onde já exista texto extraível.",
    )
    p.add_argument(
        "--ocr-language",
        default="por",
        help="(layout) Idioma OCR (ex.: por, eng, por+eng). Padrão: por.",
    )
    p.add_argument(
        "--ocr-dpi",
        type=int,
        default=300,
        help="(layout) Resolução para OCR quando aplicável (padrão: 300).",
    )
    p.add_argument(
        "--skip-image-check",
        action="store_true",
        help="Pula verificação prévia de PDF de imagem.",
    )
    args = p.parse_args(argv)

    pdf_path = args.pdf.resolve()
    if not pdf_path.is_file():
        print(f"Arquivo não encontrado: {pdf_path}", file=sys.stderr)
        return 1

    out_path = args.out.resolve() if args.out else pdf_path.with_suffix(".md")

    import pymupdf

    probe = pymupdf.open(pdf_path)
    try:
        n = probe.page_count
    finally:
        probe.close()

    pages: list[int] | None = None
    if args.pages:
        try:
            pages = parse_page_spec(args.pages, n)
        except ValueError as e:
            print(f"Erro em --pages: {e}", file=sys.stderr)
            return 1

    if not args.skip_image_check:
        is_image_like, metrics = detect_image_only_pdf(pdf_path, pages)
        if is_image_like:
            print(
                "Não foi possível extrair os dados: o PDF parece ser composto "
                "majoritariamente por imagem (sem texto extraível).",
                file=sys.stderr,
            )
            print(
                "Detalhes da verificação: "
                f"{metrics['sampled_pages']} página(s) amostradas, "
                f"{metrics['text_chars']} caracteres de texto, "
                f"{metrics['text_pages']} página(s) com texto útil.",
                file=sys.stderr,
            )
            return 2

    md = convert_pdf(
        pdf_path,
        engine=args.engine,
        pages=pages,
        page_separators=args.page_separators,
        show_progress=args.show_progress,
        table_strategy=args.table_strategy,
        use_ocr=args.use_ocr,
        force_ocr=args.force_ocr,
        ocr_language=args.ocr_language,
        ocr_dpi=args.ocr_dpi,
    )

    # Normaliza quebras de linha finais
    md = md.replace("\r\n", "\n").rstrip() + "\n"
    out_path.write_text(md, encoding="utf-8", newline="\n")
    print(f"Gerado: {out_path} ({len(md)} caracteres)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
