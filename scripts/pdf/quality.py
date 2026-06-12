from __future__ import annotations

import re
from pathlib import Path
from typing import Any

XML_FENCE_RE = re.compile(r"```(?:xml)?\s*\n(.*?)```", re.DOTALL | re.IGNORECASE)
XML_SNIPPET_RE = re.compile(r"(<\?xml[\s\S]*?</[\w:]+>|<[\w:]+[\s\S]*?</[\w:]+>)", re.IGNORECASE)
CRA_TABLE_ROW_RE = re.compile(r"^\| *(h\d{2}|t\d{2}) ", re.MULTILINE)
HEADING_RE = re.compile(r"^#{1,3} .+", re.MULTILINE)


def count_omitted_pictures(md: str) -> int:
    return md.count("intentionally omitted")


def omitted_ratio(md: str) -> float:
    lines = max(md.count("\n"), 1)
    return round(count_omitted_pictures(md) / lines, 4)


def count_cra_table_rows(md: str) -> int:
    return len(CRA_TABLE_ROW_RE.findall(md))


def count_headings(md: str) -> int:
    return len(HEADING_RE.findall(md))


def _try_parse_xml(snippet: str) -> bool:
    snippet = snippet.strip()
    if not snippet:
        return False
    try:
        from lxml import etree

        parser = etree.XMLParser(recover=True)
        etree.fromstring(snippet.encode("utf-8"), parser=parser)
        return True
    except ImportError:
        pass
    except Exception:
        return False

    if snippet.count("<") != snippet.count(">"):
        return False
    if re.search(r"<\s*/?\s*[\w:-]+", snippet) is None:
        return False
    return "<" in snippet and ">" in snippet


def analyze_xml_blocks(md: str) -> dict[str, int]:
    blocks: list[str] = []
    blocks.extend(m.group(1) for m in XML_FENCE_RE.finditer(md))
    for m in XML_SNIPPET_RE.finditer(md):
        if m.group(1) not in blocks:
            blocks.append(m.group(1))

    valid = sum(1 for b in blocks if _try_parse_xml(b))
    return {
        "xml_blocks": len(blocks),
        "xml_valid": valid,
    }


def compute_quality_score(md: str, *, pdf_name: str | None = None) -> int:
    """
    Score composto 0–100 (Fase 2).
    Penaliza omitidos, XML inválido, strikethrough; bonifica tabelas CRA e headings.
    """
    score = 100.0

    ratio = omitted_ratio(md)
    score -= min(35.0, ratio * 600.0)
    score -= min(15.0, count_omitted_pictures(md) * 3.0)

    if md.count("~~") > 5:
        score -= 8.0

    xml = analyze_xml_blocks(md)
    invalid = max(0, xml["xml_blocks"] - xml["xml_valid"])
    score -= min(20.0, invalid * 10.0)
    if xml["xml_valid"] > 0:
        score += min(5.0, xml["xml_valid"] * 2.0)

    table_rows = count_cra_table_rows(md)
    if table_rows > 0:
        score += min(10.0, table_rows * 0.5)

    headings = count_headings(md)
    if len(md) > 500 and headings == 0:
        score -= 8.0
    elif headings > 0:
        score += min(5.0, headings)

    if len(md.strip()) < 200:
        score -= 25.0

    name = (pdf_name or "").upper()
    if "REMESSA" in name or "XML" in name:
        if table_rows < 3:
            score -= 10.0

    return max(0, min(100, int(round(score))))


def build_quality_metrics(md: str, **extra: Any) -> dict[str, Any]:
    xml = analyze_xml_blocks(md)
    pdf_name = None
    if extra.get("pdf"):
        pdf_name = Path(str(extra["pdf"])).name

    metrics = {
        "chars_out": len(md),
        "omitted_count": count_omitted_pictures(md),
        "omitted_ratio": omitted_ratio(md),
        "quality_score": compute_quality_score(md, pdf_name=pdf_name),
        "table_rows_detected": count_cra_table_rows(md),
        "heading_count": count_headings(md),
        **xml,
    }
    metrics.update(extra)
    return metrics
