"""Login ONR (LoginUsuarioCertificado) para obter tokens/Hash."""

from __future__ import annotations

from zeep import Client
from zeep.transports import Transport

from lib.cert_extract import extract_from_pfx
from lib.onr_env import resolve_path


def login_tokens(cfg: dict) -> list[str]:
    wsdl = resolve_path(cfg["wsdl_path"])
    if not wsdl.is_file():
        raise FileNotFoundError(f"WSDL de login não encontrado: {cfg['wsdl_path']}")

    cert_fields = extract_from_pfx(
        cfg["cert_path"],
        cfg["cert_password"],
        publickey_format=cfg.get("publickey_format", "base64_der"),
        validuntil_format=cfg.get("validuntil_format", "iso"),
    )

    o_request = {
        "SUBJECTCN": cert_fields["SUBJECTCN"],
        "ISSUERO": cert_fields["ISSUERO"],
        "PUBLICKEY": cert_fields["PUBLICKEY"],
        "SERIALNUMBER": cert_fields["SERIALNUMBER"],
        "VALIDUNTIL": cert_fields["VALIDUNTIL"],
        "CPF": cfg["cpf"],
        "EMAIL": cfg["email"],
        "IDParceiroWS": cfg["id_parceiro_ws"],
    }

    transport = Transport(timeout=60)
    client = Client(str(wsdl), transport=transport)
    client.service._binding_options["address"] = cfg["endpoint"]

    result = client.service.LoginUsuarioCertificado(oRequest=o_request)
    if not result.RETORNO:
        raise RuntimeError(
            f"Login falhou: [{result.CODIGOERRO}] {result.ERRODESCRICAO}"
        )

    if not result.Tokens:
        raise RuntimeError("Login OK, porém nenhum token (Hash) foi retornado.")

    tokens = result.Tokens.string
    return list(tokens) if isinstance(tokens, list) else [tokens]
