"""Serialização de objetos zeep para dict/JSON."""

from __future__ import annotations

from zeep.helpers import serialize_object


def serialize_result(result) -> dict:
    """Converte o resultado de uma operação zeep em dict."""
    return serialize_object(result)


def serialize_zeep_list(container, item_attr: str) -> list[dict]:
    """
    Extrai lista de um ArrayOf* do WSDL.

    Ex.: serialize_zeep_list(result.Titulos, "ListTitulosAT_Titulos_WSResp")
    """
    if container is None:
        return []

    items = getattr(container, item_attr, None)
    if items is None:
        return []
    if not isinstance(items, list):
        items = [items]

    return [serialize_object(item) for item in items]
