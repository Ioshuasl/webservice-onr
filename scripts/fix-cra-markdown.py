#!/usr/bin/env python3

"""Compat: delega para cra_markdown_postprocess.py (Fase 1)."""



from __future__ import annotations



import sys

from pathlib import Path



_SCRIPTS = Path(__file__).resolve().parent

if str(_SCRIPTS) not in sys.path:

    sys.path.insert(0, str(_SCRIPTS))



from cra_markdown_postprocess import fix_markdown, main, validate_markdown



__all__ = ["fix_markdown", "validate_markdown", "main"]



if __name__ == "__main__":

    raise SystemExit(main())

