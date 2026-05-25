#!/usr/bin/env python3
"""Gera webservice/metodos/<Metodo>.md a partir de list-metodos.md e da especificação."""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LIST_PATH = Path(__file__).parent / "list-metodos.md"
SPEC_PATH = ROOT / "especificacao_wsoficio_dev.md"
OUT_DIR = Path(__file__).parent / "metodos"

WSDL_LOCAL = {
    "login.asmx": "wsdl/login.wsdl",
    "acompanhamentotitulos.asmx": "wsdl/acompanhamentotitulos.wsdl",
    "penhoraonline.asmx": "wsdl/penhoraonline.wsdl",
    "bdlight.asmx": "wsdl/bdlight.wsdl",
    "oficios.asmx": "wsdl/oficios.wsdl",
    "matriculaonline.asmx": "wsdl/matriculaonline.wsdl",
    "certidoes.asmx": "wsdl/certidoes.wsdl",
    "comunicacaomunicipios.asmx": "wsdl/comunicacaoprefeituras.wsdl",
    "eprotocolo.asmx": "wsdl/eprotocolo.wsdl",
    "intimacoes.asmx": "wsdl/intimacoes.wsdl",
}


def parse_list_metodos(text: str) -> list[dict]:
    methods: list[dict] = []
    current: dict | None = None
    for line in text.splitlines():
        if line.startswith("## 3."):
            title = line.lstrip("# ").strip()
            m = re.search(r"https://[^\s`]+", line)
            wsdl = m.group(0) if m else None
            if wsdl is None and current:
                pass
            current = {"modulo": title, "wsdl": None, "methods": []}
            methods.append(current)
        elif current and "**WSDL" in line:
            m = re.search(r"`(https://[^`]+)`", line)
            if m:
                current["wsdl"] = m.group(1)
        elif current and line.startswith("|") and not line.startswith("|---"):
            cols = [c.strip() for c in line.strip("|").split("|")]
            if len(cols) >= 2 and cols[0].isdigit():
                current["methods"].append(cols[1])
    return [b for b in methods if b.get("methods")]


def slug_wsdl_key(wsdl_url: str | None) -> str | None:
    if not wsdl_url:
        return None
    m = re.search(r"/([^/]+\.asmx)", wsdl_url, re.IGNORECASE)
    return m.group(1).lower() if m else None


def find_script(method: str) -> str | None:
    scripts = ROOT / "scripts"
    if not scripts.is_dir():
        return None
    for p in scripts.rglob("*.py"):
        if p.name in ("__init__.py",) or "extract" in p.name:
            continue
        if method.lower() in p.read_text(encoding="utf-8", errors="ignore").lower():
            return str(p.relative_to(ROOT)).replace("\\", "/")
    # folder name heuristic
    for p in scripts.iterdir():
        if p.is_dir() and method.lower().replace("_", "") in p.name.lower().replace("_", ""):
            py = next(p.glob("*.py"), None)
            if py:
                return str(py.relative_to(ROOT)).replace("\\", "/")
    return None


def extract_section(spec: str, method: str, kind: str) -> tuple[str, list[str], list[tuple[str, str]]]:
    """kind: 'Entrada' or 'Saída'. Returns (section_id, params, errors)."""
    pattern = rf"## \*\*[\d.]+\s+Envelope de {kind}\s*[-–]\s*{re.escape(method)}\*\*"
    m = re.search(pattern, spec, re.IGNORECASE)
    if not m:
        pattern2 = rf"## \*\*Envelope de {kind}\s*[-–]\s*{re.escape(method)}\*\*"
        m = re.search(pattern2, spec, re.IGNORECASE)
    if not m:
        return "", [], []

    start = m.start()
    section_id = m.group(0)
    rest = spec[m.end() :]
    nxt = re.search(r"\n## \*\*", rest)
    block = rest[: nxt.start()] if nxt else rest[:8000]

    params: list[str] = []
    for line in block.splitlines():
        line = line.strip()
        if line.startswith("- ") and "–" in line:
            params.append(line[2:].strip())
        elif line.startswith("- ") and "-" in line and "tipo" in line.lower():
            params.append(line[2:].strip())

    errors: list[tuple[str, str]] = []
    if "|Codigoerro|" in block or "|Codigo|" in block:
        in_table = False
        for line in block.splitlines():
            if re.match(r"\|Codigo", line, re.I):
                in_table = True
                continue
            if in_table and line.startswith("|---"):
                continue
            if in_table and line.startswith("|"):
                cols = [c.strip() for c in line.strip("|").split("|")]
                if len(cols) >= 2 and cols[0].isdigit():
                    errors.append((cols[0], cols[1].replace("<br>", " ")))
            elif in_table and line.startswith("##"):
                break

    return section_id, params, errors


PARAM_TABLE_HEADER = (
    "| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |",
    "|-------|-----------|------|-------------|-------------|---------|",
)


def parse_spec_param(line: str) -> tuple[str, str, str, str, str, str]:
    """Extrai colunas da tabela a partir de uma linha da spec (- Nome – descrição (tipo …))."""
    raw = line.strip()
    name = "—"
    desc = raw
    if "–" in raw:
        name_part, desc = raw.split("–", 1)
        name = name_part.strip()
        desc = desc.strip()

    tipo = "—"
    m_tipo = re.search(r"\(tipo\s+([^)]+)\)", desc, re.IGNORECASE)
    if m_tipo:
        tipo = m_tipo.group(1).strip().rstrip(";").strip()
        desc = desc[: m_tipo.start()].strip().rstrip(";").strip()

    condicional = "—"
    m_cond = re.search(r"\(se [^)]+\)", desc, re.IGNORECASE)
    if m_cond:
        condicional = m_cond.group(0).strip()
        desc = (desc[: m_cond.start()] + desc[m_cond.end() :]).strip().rstrip(";").strip()

    obrigatorio = "—"
    if re.search(r"\bopcional\b", desc, re.I) or name.startswith("●"):
        obrigatorio = "não"
    elif name and name != "—":
        obrigatorio = "—"  # enriquecer manualmente / WSDL

    exemplo = "—"
    return name, desc or raw, tipo, obrigatorio, condicional, exemplo


def render_param_table(params: list[str]) -> list[str]:
    lines = list(PARAM_TABLE_HEADER)
    if not params:
        return lines
    for p in params:
        name, desc, tipo, obr, cond, ex = parse_spec_param(p)
        field = f"`{name}`" if name != "—" else "—"
        lines.append(f"| {field} | {desc} | {tipo} | {obr} | {cond} | {ex} |")
    return lines


def infer_operation_type(method: str) -> str:
    for prefix, label in (
        ("List", "Listagem"),
        ("Get", "Consulta"),
        ("Insert", "Inclusão"),
        ("Update", "Alteração"),
        ("Delete", "Exclusão"),
        ("Set", "Atualização / comando"),
        ("Import", "Importação"),
        ("Adicionar", "Inclusão"),
        ("Excluir", "Exclusão"),
        ("Alterar", "Alteração"),
        ("Obter", "Consulta"),
        ("Login", "Autenticação"),
        ("Contrato", "Conversão"),
    ):
        if method.startswith(prefix):
            return label
    return "Operação"


def render_md(meta: dict) -> str:
    method = meta["method"]
    modulo = meta["modulo"]
    wsdl = meta["wsdl"] or "—"
    endpoint = wsdl.replace("?wsdl", "") if wsdl != "—" else "—"
    wsdl_key = slug_wsdl_key(wsdl)
    wsdl_local = WSDL_LOCAL.get(wsdl_key or "", None) if wsdl_key else None

    entrada_params = meta["entrada_params"]
    saida_params = meta["saida_params"]
    errors = meta["errors"]
    script = meta["script"]
    op_type = infer_operation_type(method)

    lines = [
        f"# {method}",
        "",
        f"Método do WSOficio — **{modulo}**.",
        "",
        "## Resumo",
        "",
        f"| Campo | Valor |",
        f"|-------|-------|",
        f"| Tipo | {op_type} |",
        f"| Módulo | {modulo} |",
        f"| Operação SOAP | `{method}` |",
        "",
        "## Serviço",
        "",
        f"- **WSDL (homologação):** `{wsdl}`",
        f"- **Endpoint:** `{endpoint}`",
    ]
    if wsdl_local:
        lines.append(f"- **WSDL local:** `{wsdl_local}`")
    else:
        lines.append("- **WSDL local:** _(não disponível no repositório)_")

    lines.extend(["", "## Hash de autenticação", ""])
    if method == "LoginUsuarioCertificado":
        lines.extend(
            [
                "Este método **não envia** `Hash`. Ele **retorna tokens** usados no cálculo das demais "
                "operações. Ver fluxo completo em [`../hash.md`](../hash.md).",
                "",
                "1. Autenticar com certificado digital (`SUBJECTCN`, `ISSUERO`, `PUBLICKEY`, "
                "`SERIALNUMBER`, `VALIDUNTIL`, `CPF`, `EMAIL`, `IDParceiroWS`).",
                "2. Ler `Tokens[]` da resposta (strings de 6 caracteres, uso único, validade 8 h).",
                "3. Para cada operação posterior: "
                "`Hash = SHA1_UTF8_HEX_UPPER(ONR_SERVENTIA_CHAVE + token)` — ver [`../hash.md`](../hash.md).",
            ]
        )
    else:
        lines.extend(
            [
                "Parâmetro obrigatório **`Hash`** no envelope de entrada (`string(50)`).",
                "",
                "Cálculo (detalhes em [`../hash.md`](../hash.md)):",
                "",
                "```text",
                "Hash = SHA1( ONR_SERVENTIA_CHAVE + token ).encode('utf-8').hexdigest().upper()",
                "```",
                "",
                "| Etapa | Ação |",
                "|-------|------|",
                "| 1 | `LoginUsuarioCertificado` → obter `Tokens` |",
                "| 2 | Escolher token (`ONR_HASH_TOKEN_INDEX`, padrão `0`) |",
                "| 3 | Calcular hash com a chave da serventia (não enviar chave na SOAP) |",
                f"| 4 | Chamar `{method}` passando `Hash` + demais parâmetros |",
                "",
                "Implementação: [`lib/onr_hash.py`](../../lib/onr_hash.py) · "
                "Helper: `resolve_auth_hash()` em [`lib/onr_acompanhamento.py`](../../lib/onr_acompanhamento.py).",
                "",
                "Erros comuns: **45** (hash inválido), **46** (token já usado), **47** (expirado) — ver tabela em [`../hash.md`](../hash.md).",
            ]
        )

    lines.extend(
        [
            "",
            "## Pré-requisitos e validações de negócio",
            "",
            "_Documentar regras de negócio (ex.: IDTipoPedido, IDStatus) e linkar "
            "[`webservice/tabelas-dominio/`](../tabelas-dominio/README.md)._",
            "",
            "## Ordem do envelope (`oRequest`)",
            "",
            f"_Listar campos na ordem de `<{method}_WSReq>` no WSDL local._",
            "",
            "## Parâmetros de entrada",
            "",
        ]
    )
    if entrada_params:
        lines.extend(render_param_table(entrada_params))
        lines.append("")
        lines.append(
            "> _Gerado da spec: revisar colunas Obrigatório, Condicional e Exemplo "
            "com WSDL + [`TEMPLATE.md`](TEMPLATE.md)._"
        )
    else:
        lines.append("_Consultar `especificacao_wsoficio_dev.md` — Envelope de Entrada._")

    lines.extend(["", "## Parâmetros de saída", ""])
    if saida_params:
        lines.extend(render_param_table(saida_params[:40]))
        if len(saida_params) > 40:
            lines.append(
                f"| … | _+{len(saida_params) - 40} parâmetros — ver especificação_ | — | — | — | — |"
            )
        lines.append("")
        lines.append(
            "> _Gerado da spec: revisar colunas Obrigatório, Condicional e Exemplo "
            "com WSDL + [`TEMPLATE.md`](TEMPLATE.md)._"
        )
    else:
        lines.extend(
            render_param_table(
                [
                    "RETORNO – Indica se houve erro ou não (tipo boolean);",
                    "CODIGOERRO – Código do erro (tipo int);",
                    "ERRODESCRICAO – Descrição do erro (tipo string);",
                ]
            )
        )

    if errors:
        lines.extend(["", "## Códigos de erro (amostra)", ""])
        lines.append("| Código | Descrição |")
        lines.append("|--------|-----------|")
        for code, desc in errors[:15]:
            lines.append(f"| {code} | {desc} |")
        if len(errors) > 15:
            lines.append(f"| … | _+{len(errors) - 15} códigos na especificação_ |")

    lines.extend(["", "## Implementação neste projeto", ""])
    if script:
        lines.append(f"- Script: [`{script}`](../../{script})")
    else:
        lines.append("- Script: _(ainda não implementado)_")

    lines.extend(
        [
            "",
            "## Referências",
            "",
            f"- [`webservice/hash.md`](../hash.md) — geração do `Hash`",
            f"- [`webservice/list-metodos.md`](../list-metodos.md)",
            f"- [`webservice/tabelas-dominio/`](../tabelas-dominio/README.md)",
            f"- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — Envelope de Entrada/Saída `{method}`",
            "",
        ]
    )
    return "\n".join(lines)


def main() -> None:
    spec = SPEC_PATH.read_text(encoding="utf-8")
    blocks = parse_list_metodos(LIST_PATH.read_text(encoding="utf-8"))
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    count = 0
    for block in blocks:
        for method in block["methods"]:
            entrada_id, entrada_params, _ = extract_section(spec, method, "Entrada")
            _, saida_params, errors = extract_section(spec, method, "Saída")
            meta = {
                "method": method,
                "modulo": block["modulo"],
                "wsdl": block["wsdl"],
                "entrada_params": entrada_params,
                "saida_params": saida_params,
                "errors": errors,
                "script": find_script(method),
            }
            out = OUT_DIR / f"{method}.md"
            out.write_text(render_md(meta), encoding="utf-8", newline="\n")
            count += 1
            print(f"  {out.name}")

    print(f"\nGerados {count} arquivos em {OUT_DIR}")


if __name__ == "__main__":
    main()
