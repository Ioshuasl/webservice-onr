#!/usr/bin/env python3
"""Pós-processamento estrutural de markdown OCR (CRA)."""

from __future__ import annotations

import re
import sys
from pathlib import Path

_SCRIPTS = Path(__file__).resolve().parent
if str(_SCRIPTS) not in sys.path:
    sys.path.insert(0, str(_SCRIPTS))

from pdf.quality import analyze_xml_blocks, compute_quality_score, count_omitted_pictures, omitted_ratio


def fix_markdown(text: str) -> str:
    text = text.replace("\r\n", "\n")

    # Remove artefatos de strikethrough do OCR (~~...~~)
    text = re.sub(r"~~[^~]*~~", "", text)

    # Normaliza separadores de página
    text = re.sub(
        r"--- end of page\.page_number=(\d+) ---",
        r"\n---\n\n<!-- page \1 -->\n",
        text,
    )

    # Ruído de UI da documentação online
    text = re.sub(r"(?m)^Estimated reading:.*$\n?", "", text)
    text = re.sub(r"(?m)^\d+ minutes\s*:\s*\d+ views\s*$\n?", "", text)
    text = re.sub(r"(?m)^Views:\s*\d+\s*$\n?", "", text)
    text = re.sub(r"(?m)^Copiar\s*$\n?", "", text)

    # Remove linhas só com "Copiar" coladas
    text = re.sub(r"\bCopiar\s+(?=</)", "", text)

    text = re.sub(r"[ \t]+\n", "\n", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = re.sub(r"([^\n#])(## )", r"\1\n\n\2", text)

    replacements = {
        "informacoes": "informações",
        "Informacoes": "Informações",
        "opcoes": "opções",
        "Opcoes": "Opções",
        "disposicao": "disposição",
        "aplicacao": "aplicação",
        "opcao": "opção",
        "Opcao": "Opção",
        "disponiveis": "disponíveis",
        "Requisicao": "Requisição",
        "requisicao": "requisição",
        "necessario": "necessário",
        "Codigo": "Código",
        "codigo": "código",
        "Mes": "Mês",
        "Numero": "Número",
        "numero": "número",
        "minimo": "mínimo",
        "maximo": "máximo",
        "tambem": "também",
        "ficticios": "fictícios",
        "SoapUl": "SoapUI",
        "Soapul": "SoapUI",
        "Exemplode": "Exemplo de",
        "vocé": "você",
        "0o0": "000",
        "nome arquivo": "nome_arquivo",
        "<nome arquivo>": "<nome_arquivo>",
        "SOA P-": "SOAP-",
        "SOA~~P-~~": "SOAP-",
        "SOA ~~P-~~": "SOAP-",
        "soAP": "SOAP",
        "protocolo soAP": "protocolo SOAP",
        "Parametros": "Parâmetros",
        "parametros": "parâmetros",
        "Autenticacao": "Autenticação",
        "autenticacao": "autenticação",
        "usuärio": "usuário",
        "Servico": "Serviço",
        "servico": "serviço",
        "Servicos": "Serviços",
        "Descricao": "Descrição",
        "descricao": "descrição",
        "Excecao": "Exceção",
        "titulos": "títulos",
        "comarca codmun": 'comarca CodMun',
        "codmun=": 'CodMun="',
        "t0l": "t01",
        "tO4": "t04",
        "tO5": "t05",
        "tO8": "t08",
        "tO9": "t09",
        "t１1": "t11",
        "t35=″0″ t36=w": 't35="0" t36=""',
        'version="1.o"': 'version="1.0"',
        "encoding=\"IsO": 'encoding="ISO',
        "8-sI=buTpoou": '8859-1" standalone="no"',
        "<total registros>lo</total registros>": "<total_registros>10</total_registros>",
    }
    for old, new in replacements.items():
        text = text.replace(old, new)

    # XML: aspas em atributos comuns
    text = re.sub(
        r'(\bh\d{2}|t\d{2}|CodMun)="?([^\s">]+)"?',
        lambda m: f'{m.group(1)}="{m.group(2).strip()}"',
        text,
    )

    text = text.replace("″", '"').replace(""", '"').replace(""", '"')
    text = text.replace("'", "'").replace("'", "'")

    return text.rstrip() + "\n"


def validate_markdown(text: str) -> tuple[bool, list[str]]:
    issues: list[str] = []
    if len(text.strip()) < 200:
        issues.append("conteúdo muito curto (< 200 caracteres)")

    ratio = omitted_ratio(text)
    if count_omitted_pictures(text) > 0 and ratio >= 0.2:
        issues.append(f"predominância de imagens omitidas (omitted_ratio={ratio})")

    if text.count("~~") > 5:
        issues.append("artefatos ~~ strikethrough OCR restantes")

    if not re.search(r"^#{1,3} .+", text, re.MULTILINE) and len(text) > 500:
        issues.append("sem headings markdown detectados")

    xml = analyze_xml_blocks(text)
    if xml["xml_blocks"] > 0 and xml["xml_valid"] == 0:
        issues.append("nenhum bloco XML válido detectado")

    score = compute_quality_score(text)
    if score < 40:
        issues.append(f"quality_score baixo ({score})")

    return len(issues) == 0, issues


def main() -> int:
    if len(sys.argv) < 2:
        print("Uso: cra_markdown_postprocess.py arquivo.md [--check-only]", file=sys.stderr)
        return 1

    path = Path(sys.argv[1])
    check_only = "--check-only" in sys.argv

    if not path.is_file():
        print(f"Arquivo não encontrado: {path}", file=sys.stderr)
        return 1

    original = path.read_text(encoding="utf-8")
    ok, issues = validate_markdown(original)

    if check_only:
        if ok:
            print("OK")
            return 0
        print("ISSUES:", "; ".join(issues))
        return 2

    fixed = fix_markdown(original)
    path.write_text(fixed, encoding="utf-8", newline="\n")

    ok2, issues2 = validate_markdown(fixed)
    if ok2:
        print(f"Corrigido e validado: {path} ({len(fixed)} chars)")
        return 0
    print(f"Corrigido com ressalvas: {path} — {'; '.join(issues2)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
