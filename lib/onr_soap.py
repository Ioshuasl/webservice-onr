"""Cliente SOAP (zeep) para webservices ONR."""

from __future__ import annotations

from pathlib import Path

from zeep import Client
from zeep.transports import Transport

from lib.onr_env import resolve_path

DEFAULT_TIMEOUT = 60


def create_client(wsdl_path: str | Path, endpoint: str, *, timeout: int = DEFAULT_TIMEOUT) -> Client:
    wsdl = resolve_path(str(wsdl_path))
    if not wsdl.is_file():
        raise FileNotFoundError(f"WSDL não encontrado: {wsdl_path}")

    transport = Transport(timeout=timeout)
    client = Client(str(wsdl), transport=transport)
    client.service._binding_options["address"] = endpoint
    return client


def call_operation(
    wsdl_path: str | Path,
    endpoint: str,
    operation: str,
    o_request: dict,
    *,
    timeout: int = DEFAULT_TIMEOUT,
):
    """Invoca uma operação SOAP (ex.: GetTituloAT, ListTitulosAT)."""
    client = create_client(wsdl_path, endpoint, timeout=timeout)
    service_operation = getattr(client.service, operation)
    return service_operation(oRequest=o_request)


def call_operation_from_cfg(cfg: dict, operation: str, o_request: dict, *, timeout: int = DEFAULT_TIMEOUT):
    """Atalho usando dict com wsdl_path e endpoint."""
    return call_operation(
        cfg["wsdl_path"],
        cfg["endpoint"],
        operation,
        o_request,
        timeout=timeout,
    )
