"""Extrai campos do certificado PFX para LoginUsuarioCertificado (ONR)."""

from __future__ import annotations

import base64
from datetime import datetime, timezone
from pathlib import Path

from cryptography import x509
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.serialization import Encoding, PublicFormat, pkcs12
from cryptography.x509.oid import NameOID


def _attr_value(name, oid) -> str | None:
    attrs = name.get_attributes_for_oid(oid)
    if not attrs:
        return None
    return attrs[0].value


def _format_valid_until(not_after: datetime, fmt: str) -> str:
    if not_after.tzinfo is None:
        not_after = not_after.replace(tzinfo=timezone.utc)
    local = not_after.astimezone()
    if fmt == "br_datetime":
        return local.strftime("%d/%m/%Y %H:%M:%S")
    if fmt == "br_date":
        return local.strftime("%d/%m/%Y")
    return local.strftime("%Y-%m-%dT%H:%M:%S")


def _format_public_key(cert: x509.Certificate, fmt: str) -> str:
    key_bytes = cert.public_key().public_bytes(
        Encoding.DER,
        PublicFormat.SubjectPublicKeyInfo,
    )
    if fmt == "pem":
        pem = cert.public_key().public_bytes(
            Encoding.PEM,
            PublicFormat.SubjectPublicKeyInfo,
        )
        return pem.decode("utf-8")
    if fmt == "pem_stripped":
        pem = cert.public_key().public_bytes(
            Encoding.PEM,
            PublicFormat.SubjectPublicKeyInfo,
        )
        lines = pem.decode("utf-8").strip().splitlines()
        return "".join(line for line in lines if not line.startswith("-----"))
    return base64.b64encode(key_bytes).decode("ascii")


def _format_serial(serial: int) -> str:
    hex_serial = format(serial, "X")
    if len(hex_serial) % 2:
        hex_serial = "0" + hex_serial
    return hex_serial


def extract_from_pfx(
    pfx_path: str | Path,
    password: str,
    *,
    publickey_format: str = "base64_der",
    validuntil_format: str = "iso",
) -> dict[str, str | int]:
    path = Path(pfx_path)
    if not path.is_file():
        raise FileNotFoundError(f"Certificado não encontrado: {path}")

    raw = path.read_bytes()
    pwd = password.encode("utf-8") if password else None
    private_key, certificate, _extras = pkcs12.load_key_and_certificates(raw, pwd)
    if certificate is None:
        raise ValueError("Nenhum certificado encontrado no arquivo PFX.")

    subject_cn = _attr_value(certificate.subject, NameOID.COMMON_NAME)
    if not subject_cn:
        raise ValueError("CN (SUBJECTCN) não encontrado no certificado.")

    issuer_o = (
        _attr_value(certificate.issuer, NameOID.ORGANIZATION_NAME)
        or _attr_value(certificate.issuer, NameOID.ORGANIZATIONAL_UNIT_NAME)
        or _attr_value(certificate.issuer, NameOID.COMMON_NAME)
        or ""
    )
    issuer_o = issuer_o[:10]

    not_after = getattr(certificate, "not_valid_after_utc", None)
    if not_after is None:
        not_after = certificate.not_valid_after

    return {
        "SUBJECTCN": subject_cn,
        "ISSUERO": issuer_o,
        "PUBLICKEY": _format_public_key(certificate, publickey_format),
        "SERIALNUMBER": _format_serial(certificate.serial_number),
        "VALIDUNTIL": _format_valid_until(not_after, validuntil_format),
        "_has_private_key": private_key is not None,
    }
