#!/usr/bin/env python3
"""Apenas extrai e exibe os campos do certificado (sem chamar o WS)."""

from __future__ import annotations

import json
import os
import sys
from pathlib import Path

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))

from lib.cert_extract import extract_from_pfx  # noqa: E402


def main() -> int:
    load_dotenv(ROOT / ".env")

    cert_path = os.getenv("CERT_PATH")
    cert_password = os.getenv("CERT_PASSWORD", "")
    if not cert_path:
        print("Defina CERT_PATH no arquivo .env", file=sys.stderr)
        return 1

    fields = extract_from_pfx(
        cert_path,
        cert_password,
        publickey_format=os.getenv("PUBLICKEY_FORMAT", "base64_der"),
        validuntil_format=os.getenv("VALIDUNTIL_FORMAT", "iso"),
    )

    preview = {k: v for k, v in fields.items() if not k.startswith("_")}
    pk = preview["PUBLICKEY"]
    preview["PUBLICKEY"] = f"{pk[:48]}... ({len(pk)} chars)"
    print(json.dumps(preview, ensure_ascii=False, indent=2))

    out = ROOT / "cert-fields.json"
    full = {k: v for k, v in fields.items() if not k.startswith("_")}
    out.write_text(json.dumps(full, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\nCampos completos salvos em: {out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
