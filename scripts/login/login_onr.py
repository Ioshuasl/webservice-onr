#!/usr/bin/env python3
"""Extrai dados do PFX e chama LoginUsuarioCertificado na ONR."""

from __future__ import annotations

import json
import os
import sys
from pathlib import Path

from dotenv import load_dotenv
from zeep import Client
from zeep.transports import Transport

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))

from lib.cert_extract import extract_from_pfx  # noqa: E402


def load_config() -> dict:
    load_dotenv(ROOT / ".env")

    required = ["CERT_PATH", "CERT_PASSWORD", "CPF", "EMAIL", "ONR_SERVENTIA_ID"]
    missing = [k for k in required if not os.getenv(k)]
    if missing:
        raise SystemExit(
            f"Variáveis ausentes no .env: {', '.join(missing)}\n"
            f"Copie .env.example para .env e preencha os valores."
        )

    def strip_quotes(value: str) -> str:
        value = value.strip()
        if len(value) >= 2 and value[0] == value[-1] and value[0] in "\"'":
            return value[1:-1]
        return value

    return {
        "cert_path": strip_quotes(os.environ["CERT_PATH"]),
        "cert_password": strip_quotes(os.environ["CERT_PASSWORD"]),
        "cpf": os.environ["CPF"].strip().replace(".", "").replace("-", ""),
        "email": os.environ["EMAIL"].strip(),
        "id_parceiro_ws": int(os.environ["ONR_SERVENTIA_ID"]),
        "wsdl_path": os.getenv("ONR_WSDL_LOGIN_PATH", str(ROOT / "wsdl" / "login.wsdl")),
        "endpoint": os.getenv(
            "ONR_LOGIN_ENDPOINT",
            "https://hml3-wsoficio.onr.org.br/login.asmx",
        ),
        "publickey_format": os.getenv("PUBLICKEY_FORMAT", "base64_der"),
        "validuntil_format": os.getenv("VALIDUNTIL_FORMAT", "iso"),
        "dump_only": os.getenv("DUMP_CERT_ONLY", "").lower() in ("1", "true", "yes"),
    }


def build_login_request(cert_fields: dict, cfg: dict) -> dict:
    return {
        "SUBJECTCN": cert_fields["SUBJECTCN"],
        "ISSUERO": cert_fields["ISSUERO"],
        "PUBLICKEY": cert_fields["PUBLICKEY"],
        "SERIALNUMBER": cert_fields["SERIALNUMBER"],
        "VALIDUNTIL": cert_fields["VALIDUNTIL"],
        "CPF": cfg["cpf"],
        "EMAIL": cfg["email"],
        "IDParceiroWS": cfg["id_parceiro_ws"],
    }


def login(cfg: dict, o_request: dict) -> dict:
    wsdl = Path(cfg["wsdl_path"])
    if not wsdl.is_file():
        wsdl = ROOT / cfg["wsdl_path"]
    if not wsdl.is_file():
        raise FileNotFoundError(f"WSDL não encontrado: {cfg['wsdl_path']}")

    transport = Transport(timeout=60)
    client = Client(str(wsdl), transport=transport)
    client.service._binding_options["address"] = cfg["endpoint"]

    result = client.service.LoginUsuarioCertificado(oRequest=o_request)
    return {
        "RETORNO": result.RETORNO,
        "CODIGOERRO": result.CODIGOERRO,
        "ERRODESCRICAO": result.ERRODESCRICAO,
        "IDUsuario": result.IDUsuario,
        "IDInstituicao": result.IDInstituicao,
        "Ativo": result.Ativo,
        "Tokens": list(result.Tokens.string) if result.Tokens else [],
    }


def main() -> int:
    cfg = load_config()

    cert_fields = extract_from_pfx(
        cfg["cert_path"],
        cfg["cert_password"],
        publickey_format=cfg["publickey_format"],
        validuntil_format=cfg["validuntil_format"],
    )

    o_request = build_login_request(cert_fields, cfg)

    print("=== Campos extraídos do certificado ===")
    preview = {k: v for k, v in cert_fields.items() if not k.startswith("_")}
    preview["PUBLICKEY"] = f"{preview['PUBLICKEY'][:48]}... ({len(preview['PUBLICKEY'])} chars)"
    print(json.dumps(preview, ensure_ascii=False, indent=2))

    if cfg["dump_only"]:
        out = ROOT / "cert-fields.json"
        full = {k: v for k, v in cert_fields.items() if not k.startswith("_")}
        full.update(
            {
                "CPF": cfg["cpf"],
                "EMAIL": cfg["email"],
                "IDParceiroWS": cfg["id_parceiro_ws"],
            }
        )
        out.write_text(json.dumps(full, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"\nSomente extração (DUMP_CERT_ONLY). Salvo em: {out}")
        return 0

    print("\n=== Chamando LoginUsuarioCertificado ===")
    response = login(cfg, o_request)

    print(json.dumps(response, ensure_ascii=False, indent=2))

    if not response["RETORNO"]:
        print(
            f"\nLogin falhou: [{response['CODIGOERRO']}] {response['ERRODESCRICAO']}",
            file=sys.stderr,
        )
        return 1

    print("\nLogin OK.")
    if response["Tokens"]:
        print(f"Token(s): {', '.join(response['Tokens'])}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
