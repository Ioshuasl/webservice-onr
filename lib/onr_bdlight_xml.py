"""Validação do XML BANCOLIGHT (BD Light) — modelo spec § 4.1 / bdlight-exemplo-1.xml."""

from __future__ import annotations

import re
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import urlopen
from xml.etree import ElementTree as ET

ROOT_TAG = "BANCOLIGHT"
INDIVIDUO_TAG = "INDIVIDUO"
REQUIRED_FIELDS = (
    "NOME",
    "CNPJCPF",
    "NMATRICULA",
    "TIPODEATO",
    "DTREGAVERB",
    "DTVENDA",
)
MAX_BYTES = 5 * 1024 * 1024
DATE_RE = re.compile(r"^\d{8}$")
CPF_CNPJ_RE = re.compile(r"^\d{11}$|^\d{14}$")
FETCH_TIMEOUT_SEC = 60


class BdlightXmlValidationError(Exception):
    """XML fora do padrão BANCOLIGHT."""

    def __init__(self, source: str, errors: list[str]):
        self.source = source
        self.errors = errors
        detail = "\n".join(f"  - {e}" for e in errors)
        super().__init__(f"XML BD Light inválido ({source}):\n{detail}")


def _validation_enabled() -> bool:
    import os

    raw = (os.getenv("BDLIGHT_IMPORTAR_VALIDAR_XML") or "true").strip().lower()
    return raw in ("1", "true", "yes")


def _decode_xml(content: bytes) -> str:
    if len(content) > MAX_BYTES:
        raise BdlightXmlValidationError(
            "conteúdo",
            [f"Tamanho {len(content)} bytes excede o máximo de {MAX_BYTES} (5MB)."],
        )
    for encoding in ("utf-8", "iso-8859-1", "latin-1"):
        try:
            return content.decode(encoding)
        except UnicodeDecodeError:
            continue
    raise BdlightXmlValidationError(
        "conteúdo", ["Não foi possível decodificar o XML (utf-8 / iso-8859-1)."]
    )


def _element_text(parent: ET.Element, tag: str) -> str:
    child = parent.find(tag)
    if child is None:
        return ""
    return "".join(child.itertext()).strip()


def _validate_date(value: str, field: str, *, required: bool) -> list[str]:
    if not value:
        return [] if not required else [f"{field} é obrigatório."]
    if not DATE_RE.match(value):
        return [f"{field} deve ter 8 dígitos (DDMMAAAA), recebido: {value!r}."]
    return []


def _validate_individuo(node: ET.Element, index: int) -> list[str]:
    errors: list[str] = []
    label = f"INDIVIDUO[{index}]"

    for field in REQUIRED_FIELDS:
        if node.find(field) is None:
            errors.append(f"{label}: campo obrigatório ausente: {field}.")

    nome = _element_text(node, "NOME")
    if not nome:
        errors.append(f"{label}: NOME não pode ser vazio.")

    cpf_cnpj = re.sub(r"\D", "", _element_text(node, "CNPJCPF"))
    if not CPF_CNPJ_RE.match(cpf_cnpj):
        errors.append(
            f"{label}: CNPJCPF deve ter 11 (CPF) ou 14 (CNPJ) dígitos, "
            f"recebido: {_element_text(node, 'CNPJCPF')!r}."
        )

    matricula = _element_text(node, "NMATRICULA")
    if not matricula:
        errors.append(f"{label}: NMATRICULA não pode ser vazio.")

    tipo = _element_text(node, "TIPODEATO")
    if not tipo:
        errors.append(f"{label}: TIPODEATO não pode ser vazio.")

    errors.extend(
        _validate_date(_element_text(node, "DTREGAVERB"), f"{label}.DTREGAVERB", required=True)
    )
    dtvenda = _element_text(node, "DTVENDA")
    if dtvenda:
        errors.extend(
            _validate_date(dtvenda, f"{label}.DTVENDA", required=False)
        )

    allowed = set(REQUIRED_FIELDS)
    for child in node:
        tag = child.tag.split("}")[-1] if "}" in child.tag else child.tag
        if tag not in allowed:
            errors.append(f"{label}: elemento não esperado: {tag}.")

    return errors


def validate_bdlight_xml(content: bytes | str, *, source: str = "XML") -> dict:
    """
    Valida estrutura BANCOLIGHT/INDIVIDUO conforme bdlight-exemplo-1.xml.

    Retorna dict com valid=True e quantidade de INDIVIDUO.
    Levanta BdlightXmlValidationError se inválido.
    """
    raw = content.encode("utf-8") if isinstance(content, str) else content
    text = _decode_xml(raw).strip()
    if not text:
        raise BdlightXmlValidationError(source, ["Arquivo XML vazio."])

    errors: list[str] = []
    try:
        root = ET.fromstring(text)
    except ET.ParseError as exc:
        raise BdlightXmlValidationError(source, [f"XML malformado: {exc}"]) from exc

    tag = root.tag.split("}")[-1] if "}" in root.tag else root.tag
    if tag != ROOT_TAG:
        errors.append(
            f"Elemento raiz deve ser {ROOT_TAG}, encontrado: {tag!r}."
        )

    individuos = [
        el
        for el in root
        if (el.tag.split("}")[-1] if "}" in el.tag else el.tag) == INDIVIDUO_TAG
    ]
    if not individuos:
        errors.append(f"É necessário ao menos um {INDIVIDUO_TAG}.")

    for i, node in enumerate(individuos, start=1):
        errors.extend(_validate_individuo(node, i))

    if errors:
        raise BdlightXmlValidationError(source, errors)

    return {"valid": True, "individuos": len(individuos), "source": source}


def validate_bdlight_xml_file(path: str | Path) -> dict:
    p = Path(path)
    if not p.is_file():
        raise BdlightXmlValidationError(str(p), ["Arquivo não encontrado."])
    return validate_bdlight_xml(p.read_bytes(), source=str(p))


def validate_bdlight_xml_url(url: str) -> dict:
    try:
        with urlopen(url, timeout=FETCH_TIMEOUT_SEC) as resp:
            content = resp.read()
    except HTTPError as exc:
        raise BdlightXmlValidationError(
            url, [f"HTTP {exc.code} ao baixar URL."]
        ) from exc
    except URLError as exc:
        raise BdlightXmlValidationError(
            url, [f"Erro ao baixar URL: {exc.reason}"]
        ) from exc
    return validate_bdlight_xml(content, source=url)


def assert_bdlight_xml_valid(content: bytes | str, *, source: str = "XML") -> dict:
    return validate_bdlight_xml(content, source=source)


def load_xml_paths_from_env() -> list[str]:
    import os

    raw = (os.getenv("BDLIGHT_IMPORTAR_XML_PATH") or "").strip()
    if not raw:
        return []
    return [p for p in re.split(r"[,;]+", raw) if p.strip()]


def validate_import_inputs(
    arquivos: list[dict[str, str]],
    *,
    xml_paths: list[str] | None = None,
) -> list[dict]:
    """Valida paths locais e URLs antes do ImportarArquivoBDL."""
    if not _validation_enabled():
        return []

    results: list[dict] = []
    paths = xml_paths if xml_paths is not None else load_xml_paths_from_env()

    for path in paths:
        results.append(validate_bdlight_xml_file(path.strip()))

    for row in arquivos:
        url = row.get("URLArquivo", "")
        if url:
            results.append(validate_bdlight_xml_url(url))

    return results
