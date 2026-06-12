#!/usr/bin/env python3
"""Teste pontual CRA21 SOAP.

Credenciais: Obsidian Vault env.md secao CRA21 (CRA_USER, CRA_PASS, CRA_UF).
Carregar na sessao PowerShell antes de executar — nao commitar no repo.

Uso:
  $env:CRA_USER = '...'; $env:CRA_PASS = '...'; $env:CRA_UF = 'go'
  py scripts/cra/test-cra-soap-once.py

Docs: Orius/integracoes/tabelionato-protesto/cra/webservice-soap/
"""
from __future__ import annotations

import os
import sys

from requests import Session
from requests.auth import HTTPBasicAuth
from zeep import Client
from zeep.transports import Transport


def endpoint(uf: str, homolog: bool = True) -> tuple[str, str]:
    host = f"cra{uf.lower()}.cra21.com.br" if homolog else f"cra{uf.lower()}.crabr.com.br"
    base = f"https://{host}/cra{uf.lower()}/xml/protestos.php"
    return f"{base}?wsdl", base


def main() -> int:
    user = os.environ.get("CRA_USER")
    password = os.environ.get("CRA_PASS")
    uf = os.environ.get("CRA_UF", "go").lower()
    if not user or not password:
        print("Defina CRA_USER e CRA_PASS no ambiente.", file=sys.stderr)
        return 2

    wsdl, url = endpoint(uf)
    print(f"Ambiente: homologacao ({uf.upper()})")
    print(f"WSDL: {wsdl}")

    session = Session()
    session.auth = HTTPBasicAuth(user, password)
    client = Client(wsdl, transport=Transport(session=session, timeout=60))
    client.service._binding_options["address"] = url

    def call(name: str, fn, *args) -> bool:
        print(f"\n=== {name} ===")
        try:
            result = fn(*args)
            text = result if isinstance(result, str) else str(result)
            print(text[:4000])
            if "0001" in text and "AUTENTIC" in text.upper():
                print(">>> FALHA DE AUTENTICACAO")
                return False
            print(">>> OK")
            return True
        except Exception as exc:
            print(f"ERROR: {type(exc).__name__}: {exc}")
            return False

    ok = True
    ok &= call("Consulta (campos vazios)", client.service.Consulta, "", "")
    ok &= call("Consulta (titulo inexistente)", client.service.Consulta, "1", "1")
    ok &= call("ConsultaJustificativa", client.service.ConsultaJustificativa)
    ok &= call("Homologadas (codapres=000)", client.service.Homologadas, "000", "1")
    ok &= call("Confirmacao (arquivo ficticio)", client.service.Confirmacao, "C0000101.251")
    ok &= call("Retorno (arquivo ficticio)", client.service.Retorno, "R0000101.251")
    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
