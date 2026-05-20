#!/usr/bin/env python3
"""Enriquece webservice/metodos/<Op>.md para operações com script .js em scripts/."""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
METODOS = Path(__file__).parent / "metodos"
SCRIPTS = ROOT / "scripts"

TABLE_HEAD = (
    "| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |",
    "|-------|-----------|------|-------------|-------------|---------|",
)


def r(campo: str, desc: str, tipo: str, obr: str, cond: str = "—", ex: str = "—") -> tuple[str, ...]:
    return (campo, desc, tipo, obr, cond, ex)


def table(rows: list[tuple[str, ...]]) -> str:
    lines = list(TABLE_HEAD)
    for row in rows:
        campo = row[0]
        field = f"`{campo}`" if campo and not campo.startswith("`") else campo
        lines.append(f"| {field} | {row[1]} | {row[2]} | {row[3]} | {row[4]} | {row[5]} |")
    return "\n".join(lines)


def bullets(items: list[str]) -> str:
    return "\n".join(f"- {x}" for x in items)


def primary_operation_from_js(text: str) -> str | None:
    """Operação principal: preferir chamada com { oRequest } (evita GetPedidoPO auxiliar)."""
    oreq_calls = list(re.finditer(r"client\.(\w+)Async\(\s*\{\s*oRequest", text))
    if oreq_calls:
        for m in reversed(oreq_calls):
            if m.group(1).startswith(("Set", "List", "Insert", "Update", "Delete", "Login")):
                return m.group(1)
        return oreq_calls[-1].group(1)
    matches = re.findall(r"client\.(\w+)Async", text)
    for name in matches:
        if re.match(r"^(Set|List|Get|Insert|Update|Delete|Login)", name):
            return name
    return matches[-1] if matches else None


def discover_js_operations() -> dict[str, Path]:
    found: dict[str, Path] = {}
    for path in SCRIPTS.rglob("*.js"):
        rel = str(path.relative_to(ROOT)).replace("\\", "/")
        if "/postman/" in rel or rel.startswith("scripts/extract_cert/"):
            continue
        text = path.read_text(encoding="utf-8", errors="ignore")
        op = primary_operation_from_js(text)
        if op:
            found[op] = path
    return found


def script_paths(operation: str) -> tuple[str | None, str | None]:
    py_path = js_path = None
    for p in SCRIPTS.rglob("*.py"):
        if p.name == "findEligiblePedido.py":
            continue
        if operation in p.read_text(encoding="utf-8", errors="ignore"):
            py_path = str(p.relative_to(ROOT)).replace("\\", "/")
            break
    for p in SCRIPTS.rglob("*.js"):
        if "/postman/" in str(p) or "extract_cert" in str(p):
            continue
        if operation in p.read_text(encoding="utf-8", errors="ignore"):
            js_path = str(p.relative_to(ROOT)).replace("\\", "/")
            break
    return py_path, js_path


def extract_errors_section(content: str) -> str:
    m = re.search(r"(## Códigos de erro.*?\n)(.*?)(?=\n## |\Z)", content, re.DOTALL)
    if not m:
        return ""
    return m.group(0).rstrip() + "\n\n"


# fmt: off
ENRICH: dict[str, dict] = {
    "LoginUsuarioCertificado": {
        "prereq": [
            "Certificado PFX válido (`CERT_PATH`, `CERT_PASSWORD`) e `ONR_SERVENTIA_ID` correspondente ao parceiro.",
            "Não usa `Hash`; retorna `Tokens[]` para as demais operações.",
        ],
        "ordem": ["SUBJECTCN", "ISSUERO", "PUBLICKEY", "SERIALNUMBER", "VALIDUNTIL", "CPF", "EMAIL", "IDParceiroWS"],
        "entrada": [
            r("SUBJECTCN", "Subject CN do certificado", "string", "sim", "—", "_(do PFX)_"),
            r("ISSUERO", "Emissor do certificado", "string", "sim", "—", "_(do PFX)_"),
            r("PUBLICKEY", "Chave pública do certificado", "string", "sim", "—", "_(base64 DER)_"),
            r("SERIALNUMBER", "Número de série do certificado", "string", "sim", "—", "_(do PFX)_"),
            r("VALIDUNTIL", "Validade do certificado", "string", "sim", "—", "_(ISO ou epoch)_"),
            r("CPF", "CPF do usuário", "string(11)", "sim", "—", "12345678901"),
            r("EMAIL", "E-mail do usuário", "string", "sim", "—", "usuario@cartorio.org"),
            r("IDParceiroWS", "ID da serventia/parceiro", "int", "sim", "—", "12345"),
        ],
        "saida": [
            r("RETORNO", "Sucesso da operação", "boolean", "sim", "—", "true"),
            r("CODIGOERRO", "Código do erro", "int", "sim", "—", "0"),
            r("ERRODESCRICAO", "Descrição do erro", "string", "não", "se RETORNO=false", "—"),
            r("Tokens", "Tokens de uso único (6 caracteres)", "string[]", "sim", "se RETORNO=true", "`[\"ABC123\", ...]`"),
        ],
        "impl_extra": ["npm: `npm run login`", "Extrai campos do PFX via `lib/cert_extract`"],
    },
    "ListTitulosAT": {
        "prereq": [
            "Datas de protocolo obrigatórias no script (`ACOMPANHAMENTO_TITULOS_DATA_PROTOCOLO_*`, formato `aaaa-mm-dd`).",
            "Filtro [IDTipoStatus](../tabelas-dominio/IDTipoStatus-AT.md) (`-1` = todos).",
        ],
        "ordem": ["Hash", "MaxRowPerPage", "PageNumber", "DataProtocoloInicio", "DataProtocoloFinal", "IDTipoStatus", "Exportado", "Protocolo?", "Apresentante?"],
        "entrada": [
            r("Hash", "Hash de autenticação", "string", "sim", "—", "_(SHA-1)_"),
            r("MaxRowPerPage", "Máximo de registros por página", "int", "sim", "—", "50"),
            r("PageNumber", "Número da página", "int", "sim", "—", "1"),
            r("DataProtocoloInicio", "Data inicial do protocolo", "string", "sim", "—", "2025-01-01"),
            r("DataProtocoloFinal", "Data final do protocolo", "string", "sim", "—", "2025-12-31"),
            r("IDTipoStatus", "Filtro por tipo de status", "int", "sim", "ver [IDTipoStatus-AT](../tabelas-dominio/IDTipoStatus-AT.md)", "-1"),
            r("Exportado", "Filtro exportado", "int", "sim", "—", "0"),
            r("Protocolo", "Filtro por protocolo", "string", "não", "omitido se vazio", "20250100001"),
            r("Apresentante", "Filtro por apresentante", "string", "não", "omitido se vazio", "—"),
        ],
        "saida": [
            r("RETORNO", "Sucesso", "boolean", "sim", "—", "true"),
            r("CODIGOERRO", "Código do erro", "int", "sim", "—", "0"),
            r("ERRODESCRICAO", "Descrição do erro", "string", "não", "se RETORNO=false", "—"),
            r("QtdeRegistros", "Total de registros", "int", "sim", "se RETORNO=true", "10"),
            r("QtdePaginas", "Total de páginas", "int", "sim", "se RETORNO=true", "1"),
            r("Titulos", "Lista de títulos", "ListTitulosAT_Titulos_WSResp[]", "não", "se RETORNO=true", "—"),
        ],
        "env": "`ACOMPANHAMENTO_TITULOS_*`",
    },
    "GetTituloAT": {
        "prereq": ["`ACOMPANHAMENTO_TITULOS_ID_TITULO` definido no `.env`."],
        "ordem": ["Hash", "IDTitulo"],
        "entrada": [
            r("Hash", "Hash de autenticação", "string", "sim", "—", "_(SHA-1)_"),
            r("IDTitulo", "Código do título", "int", "sim", "—", "1001"),
        ],
        "saida": [
            r("RETORNO", "Sucesso", "boolean", "sim", "—", "true"),
            r("CODIGOERRO", "Código do erro", "int", "sim", "—", "0"),
            r("ERRODESCRICAO", "Descrição do erro", "string", "não", "se RETORNO=false", "—"),
            r("_(demais campos)_", "Dados do título (protocolo, status, ModoNotificacaoStatus, …)", "—", "não", "se RETORNO=true", "—"),
        ],
        "env": "`ACOMPANHAMENTO_TITULOS_ID_TITULO`",
    },
    "InsertTituloAT": {
        "prereq": [
            "Envelope completo na ordem WSDL — opcionais omitidos podem gerar erro **0** / `IDMsg` (.NET).",
            "[ModoNotificacaoStatus](../tabelas-dominio/ModoNotificacaoStatus-AT.md): `E` exige e-mail; `S` exige DDD e telefone.",
            "[TipoSolicitacao](../tabelas-dominio/TipoSolicitacao-AT.md) e [IDTipoStatus](../tabelas-dominio/IDTipoStatus-AT.md) no status inicial.",
        ],
        "ordem": [
            "Hash", "Protocolo", "ApresentanteNome", "ApresentanteEmail", "ApresentanteDDDTelefone",
            "ApresentanteNumeroTelefone", "ApresentanteCPFCNPJ", "ValorDeposito", "ValorEmolumentos",
            "DataProtocolo", "DataPrevisaoEntrega", "ModoNotificacaoStatus", "InteressadoNome",
            "InteressadoCPFCNPJ", "NaturezaTitulo", "CodigoVerificador", "TipoSolicitacao",
            "IDTipoStatus", "DataStatus", "DescricaoStatus",
        ],
        "entrada": [
            r("Hash", "Hash de autenticação", "string", "sim", "—", "_(SHA-1)_"),
            r("Protocolo", "Número do protocolo", "string", "sim", "—", "20250100001"),
            r("ModoNotificacaoStatus", "Modo de notificação", "string(1)", "sim", "ver [ModoNotificacaoStatus-AT](../tabelas-dominio/ModoNotificacaoStatus-AT.md)", "E"),
            r("TipoSolicitacao", "Tipo da solicitação", "int", "sim", "ver [TipoSolicitacao-AT](../tabelas-dominio/TipoSolicitacao-AT.md)", "1"),
            r("IDTipoStatus", "Status inicial do título", "int", "sim", "ver [IDTipoStatus-AT](../tabelas-dominio/IDTipoStatus-AT.md)", "4"),
            r("_(+ demais campos)_", "Apresentante, valores, datas, interessado — ver `lib/onr_insert_titulo_at`", "—", "sim", "vários opcionais enviados como `\"\"`", "—"),
        ],
        "saida": [
            r("RETORNO", "Sucesso", "boolean", "sim", "—", "true"),
            r("CODIGOERRO", "Código do erro", "int", "sim", "—", "0"),
            r("ERRODESCRICAO", "Descrição do erro", "string", "não", "se RETORNO=false", "—"),
            r("IDTitulo", "ID do título criado", "int", "sim", "se RETORNO=true", "1001"),
        ],
        "env": "`ACOMPANHAMENTO_TITULOS_INSERT_*`",
        "impl_extra": ["Helper: `lib/onr_insert_titulo_at`"],
    },
    "UpdateTituloAT": {
        "prereq": [
            "Mesmas regras de envelope que `InsertTituloAT` (ordem WSDL + opcionais `\"\"`).",
            "Requer `IDTitulo` existente.",
        ],
        "ordem": ["Hash", "IDTitulo", "… (mesmos campos de InsertTituloAT)"],
        "entrada": [
            r("Hash", "Hash de autenticação", "string", "sim", "—", "_(SHA-1)_"),
            r("IDTitulo", "Título a alterar", "int", "sim", "—", "1001"),
            r("_(demais campos)_", "Igual InsertTituloAT — ver `lib/onr_update_titulo_at`", "—", "sim", "—", "—"),
        ],
        "saida": [
            r("RETORNO", "Sucesso", "boolean", "sim", "—", "true"),
            r("CODIGOERRO", "Código do erro", "int", "sim", "—", "0"),
            r("ERRODESCRICAO", "Descrição do erro", "string", "não", "se RETORNO=false", "—"),
        ],
        "env": "`ACOMPANHAMENTO_TITULOS_UPDATE_*`",
        "impl_extra": ["Helper: `lib/onr_update_titulo_at`"],
    },
    "DeleteTituloAT": {
        "prereq": ["Título existente e permissão de exclusão."],
        "ordem": ["Hash", "IDTitulo"],
        "entrada": [
            r("Hash", "Hash de autenticação", "string", "sim", "—", "_(SHA-1)_"),
            r("IDTitulo", "Título a excluir", "int", "sim", "—", "1001"),
        ],
        "saida": [
            r("RETORNO", "Sucesso", "boolean", "sim", "—", "true"),
            r("CODIGOERRO", "Código do erro", "int", "sim", "—", "0"),
            r("ERRODESCRICAO", "Descrição do erro", "string", "não", "se RETORNO=false", "—"),
        ],
        "env": "`DELETE_ID_TITULO` ou `ACOMPANHAMENTO_TITULOS_ID_TITULO`",
    },
    "GetStatusAT": {
        "prereq": ["`ACOMPANHAMENTO_TITULOS_ID_STATUS` no `.env`."],
        "ordem": ["Hash", "IDStatus"],
        "entrada": [
            r("Hash", "Hash de autenticação", "string", "sim", "—", "_(SHA-1)_"),
            r("IDStatus", "Código do status", "int", "sim", "—", "5001"),
        ],
        "saida": [
            r("RETORNO", "Sucesso", "boolean", "sim", "—", "true"),
            r("CODIGOERRO", "Código do erro", "int", "sim", "—", "0"),
            r("ERRODESCRICAO", "Descrição do erro", "string", "não", "se RETORNO=false", "—"),
            r("_(demais campos)_", "Dados do status", "—", "não", "se RETORNO=true", "—"),
        ],
        "env": "`ACOMPANHAMENTO_TITULOS_ID_STATUS`",
    },
    "ListStatusAT": {
        "prereq": [
            "`ACOMPANHAMENTO_TITULOS_ID_TITULO` obrigatório.",
            "Filtro [IDTipoStatus](../tabelas-dominio/IDTipoStatus-AT.md) (`-1` = todos).",
        ],
        "ordem": ["Hash", "MaxRowPerPage", "PageNumber", "IDTitulo", "IDTipoStatus", "DataStatusInicio?", "DataStatusFinal?"],
        "entrada": [
            r("Hash", "Hash de autenticação", "string", "sim", "—", "_(SHA-1)_"),
            r("MaxRowPerPage", "Máximo por página", "int", "sim", "—", "50"),
            r("PageNumber", "Página", "int", "sim", "—", "1"),
            r("IDTitulo", "Título", "int", "sim", "—", "1001"),
            r("IDTipoStatus", "Filtro tipo de status", "int", "sim", "ver [IDTipoStatus-AT](../tabelas-dominio/IDTipoStatus-AT.md)", "-1"),
            r("DataStatusInicio", "Data inicial do status", "string", "não", "omitido se vazio", "2025-01-01"),
            r("DataStatusFinal", "Data final do status", "string", "não", "omitido se vazio", "2025-12-31"),
        ],
        "saida": [
            r("RETORNO", "Sucesso", "boolean", "sim", "—", "true"),
            r("CODIGOERRO", "Código do erro", "int", "sim", "—", "0"),
            r("ERRODESCRICAO", "Descrição do erro", "string", "não", "se RETORNO=false", "—"),
            r("QtdeRegistros", "Total de registros", "int", "sim", "se RETORNO=true", "—"),
            r("QtdePaginas", "Total de páginas", "int", "sim", "se RETORNO=true", "—"),
            r("Status", "Lista de status", "ListStatusAT_Status_WSResp[]", "não", "se RETORNO=true", "—"),
        ],
        "env": "`ACOMPANHAMENTO_TITULOS_ID_TITULO`, datas opcionais",
    },
    "InsertStatusAT": {
        "prereq": [
            "Envelope na ordem WSDL; opcionais omitidos podem falhar (.NET).",
            "[IDTipoStatus](../tabelas-dominio/IDTipoStatus-AT.md) válido para o título.",
        ],
        "ordem": ["Hash", "IDTitulo", "IDTipoStatus", "DataStatus", "DescricaoStatus"],
        "entrada": [
            r("Hash", "Hash de autenticação", "string", "sim", "—", "_(SHA-1)_"),
            r("IDTitulo", "Título", "int", "sim", "—", "1001"),
            r("IDTipoStatus", "Tipo de status", "int", "sim", "ver [IDTipoStatus-AT](../tabelas-dominio/IDTipoStatus-AT.md)", "7"),
            r("DataStatus", "Data do status", "string", "sim", "—", "2025-05-19 10:00:00"),
            r("DescricaoStatus", "Descrição", "string", "sim", "—", "Nota de exigência"),
        ],
        "saida": [
            r("RETORNO", "Sucesso", "boolean", "sim", "—", "true"),
            r("CODIGOERRO", "Código do erro", "int", "sim", "—", "0"),
            r("ERRODESCRICAO", "Descrição do erro", "string", "não", "se RETORNO=false", "—"),
            r("IDStatus", "ID do status criado", "int", "sim", "se RETORNO=true", "5001"),
        ],
        "env": "`ACOMPANHAMENTO_TITULOS_INSERT_STATUS_*`",
        "impl_extra": ["Helper: `lib/onr_insert_status_at`"],
    },
    "UpdateStatusAT": {
        "prereq": ["Status existente (`IDStatus`). Mesma ordem WSDL que insert."],
        "ordem": ["Hash", "IDStatus", "IDTitulo", "IDTipoStatus", "DataStatus", "DescricaoStatus"],
        "entrada": [
            r("Hash", "Hash de autenticação", "string", "sim", "—", "_(SHA-1)_"),
            r("IDStatus", "Status a alterar", "int", "sim", "—", "5001"),
            r("IDTitulo", "Título", "int", "sim", "—", "1001"),
            r("IDTipoStatus", "Tipo de status", "int", "sim", "ver [IDTipoStatus-AT](../tabelas-dominio/IDTipoStatus-AT.md)", "7"),
            r("DataStatus", "Data do status", "string", "sim", "—", "2025-05-19 10:00:00"),
            r("DescricaoStatus", "Descrição", "string", "sim", "—", "Atualizado"),
        ],
        "saida": [
            r("RETORNO", "Sucesso", "boolean", "sim", "—", "true"),
            r("CODIGOERRO", "Código do erro", "int", "sim", "—", "0"),
            r("ERRODESCRICAO", "Descrição do erro", "string", "não", "se RETORNO=false", "—"),
        ],
        "env": "`ACOMPANHAMENTO_TITULOS_UPDATE_STATUS_*`",
        "impl_extra": ["Helper: `lib/onr_update_status_at`"],
    },
    "ListPedidosPO": {
        "prereq": [
            "Datas de solicitação obrigatórias (`PENHORA_ONLINE_DATA_SOLICITACAO_*`).",
            "`MaxRowPerPage` ≥ 10 (regra do serviço).",
            "Homologação .NET: opcionais enviados como `\"\"` (ver script) para evitar `NullReferenceException`.",
            "Filtros [IDTipoPedido](../tabelas-dominio/IDTipoPedido-PO.md) e [IDStatus](../tabelas-dominio/IDStatus-PO.md) (`-1` = todos).",
        ],
        "ordem": [
            "Hash", "MaxRowPerPage", "PageNumber", "Protocolo", "IDVara", "IDTipoPedido",
            "IDStatus", "DataSolicitacaoInicial", "DataSolicitacaoFinal",
            "DataRespostaInicial", "DataRespostaFinal",
        ],
        "entrada": [
            r("Hash", "Hash de autenticação", "string", "sim", "—", "_(SHA-1)_"),
            r("MaxRowPerPage", "Máximo por página", "int", "sim", "≥ 10", "50"),
            r("PageNumber", "Página", "int", "sim", "—", "1"),
            r("Protocolo", "Filtro protocolo", "string", "sim", "vazio = sem filtro", "\"\""),
            r("IDVara", "Vara", "int", "sim", "`-1` = todas", "-1"),
            r("IDTipoPedido", "Tipo do pedido", "int", "sim", "ver [IDTipoPedido-PO](../tabelas-dominio/IDTipoPedido-PO.md)", "-1"),
            r("IDStatus", "Status do pedido", "int", "sim", "ver [IDStatus-PO](../tabelas-dominio/IDStatus-PO.md)", "-1"),
            r("DataSolicitacaoInicial", "Data solicitação inicial", "string", "sim", "aaaa-mm-dd", "2025-01-01"),
            r("DataSolicitacaoFinal", "Data solicitação final", "string", "sim", "aaaa-mm-dd", "2025-12-31"),
            r("DataRespostaInicial", "Data resposta inicial", "string", "sim", "vazio se não usar", "\"\""),
            r("DataRespostaFinal", "Data resposta final", "string", "sim", "vazio se não usar", "\"\""),
        ],
        "saida": [
            r("RETORNO", "Sucesso", "boolean", "sim", "—", "true"),
            r("CODIGOERRO", "Código do erro", "int", "sim", "—", "0"),
            r("ERRODESCRICAO", "Descrição do erro", "string", "não", "se RETORNO=false", "—"),
            r("QtdeRegistros", "Total de registros", "int", "sim", "se RETORNO=true", "—"),
            r("QtdePaginas", "Total de páginas", "int", "sim", "se RETORNO=true", "—"),
            r("Pedidos", "Lista de pedidos", "ListPedidosPO_Pedidos_WSResp[]", "não", "se RETORNO=true", "—"),
        ],
        "env": "`PENHORA_ONLINE_*`",
    },
    "ListVarasPO": {
        "prereq": ["Filtros geográficos opcionais (`PENHORA_ONLINE_ID_ESTADO/COMARCA/FORO`)."],
        "ordem": ["Hash", "IDEstado", "IDComarca", "IDForo"],
        "entrada": [
            r("Hash", "Hash de autenticação", "string", "sim", "—", "_(SHA-1)_"),
            r("IDEstado", "Estado", "int", "sim", "—", "0"),
            r("IDComarca", "Comarca", "int", "sim", "—", "0"),
            r("IDForo", "Foro", "int", "sim", "—", "0"),
        ],
        "saida": [
            r("RETORNO", "Sucesso", "boolean", "sim", "—", "true"),
            r("CODIGOERRO", "Código do erro", "int", "sim", "—", "0"),
            r("ERRODESCRICAO", "Descrição do erro", "string", "não", "se RETORNO=false", "—"),
            r("Varas", "Lista de varas", "ListVarasPO_Vara_WSResp[]", "não", "se RETORNO=true", "—"),
        ],
        "env": "`PENHORA_ONLINE_ID_ESTADO`, `ID_COMARCA`, `ID_FORO`",
    },
    "GetPedidoPO": {
        "prereq": ["`PENHORA_ONLINE_ID_PEDIDO` definido."],
        "ordem": ["Hash", "IDPedido"],
        "entrada": [
            r("Hash", "Hash de autenticação", "string", "sim", "—", "_(SHA-1)_"),
            r("IDPedido", "Código do pedido", "int", "sim", "—", "18014820"),
        ],
        "saida": [
            r("RETORNO", "Sucesso", "boolean", "sim", "—", "true"),
            r("CODIGOERRO", "Código do erro", "int", "sim", "—", "0"),
            r("ERRODESCRICAO", "Descrição do erro", "string", "não", "se RETORNO=false", "—"),
            r("IDTipoPedido", "Tipo do pedido", "int", "sim", "se RETORNO=true", "ver [IDTipoPedido-PO](../tabelas-dominio/IDTipoPedido-PO.md)"),
            r("IDStatus", "Status do pedido", "int", "sim", "se RETORNO=true", "ver [IDStatus-PO](../tabelas-dominio/IDStatus-PO.md)"),
            r("_(+ demais campos)_", "Processo, protocolo, resposta, prenotação, …", "—", "não", "conforme tipo", "—"),
        ],
        "env": "`PENHORA_ONLINE_ID_PEDIDO`",
    },
    "ListBoletosPO": {
        "prereq": ["`PENHORA_ONLINE_ID_PROCESSO` de `GetPedidoPO`."],
        "ordem": ["Hash", "IDProcesso"],
        "entrada": [
            r("Hash", "Hash de autenticação", "string", "sim", "—", "_(SHA-1)_"),
            r("IDProcesso", "Código do processo", "int", "sim", "—", "2642149"),
        ],
        "saida": [
            r("RETORNO", "Sucesso", "boolean", "sim", "—", "true"),
            r("CODIGOERRO", "Código do erro", "int", "sim", "—", "0"),
            r("ERRODESCRICAO", "Descrição do erro", "string", "não", "se RETORNO=false", "—"),
            r("Boletos", "Lista de boletos", "ListBoletosPO_Boleto_WSResp[]", "não", "se RETORNO=true", "—"),
        ],
        "env": "`PENHORA_ONLINE_ID_PROCESSO`",
    },
    "SetBaixaBoletoPO": {
        "prereq": ["`IDBoleto` de `ListBoletosPO`."],
        "ordem": ["Hash", "IDBoleto"],
        "entrada": [
            r("Hash", "Hash de autenticação", "string", "sim", "—", "_(SHA-1)_"),
            r("IDBoleto", "Código do boleto", "int", "sim", "—", "184569"),
        ],
        "saida": [
            r("RETORNO", "Sucesso", "boolean", "sim", "—", "true"),
            r("CODIGOERRO", "Código do erro", "int", "sim", "—", "0"),
            r("ERRODESCRICAO", "Descrição do erro", "string", "não", "se RETORNO=false", "—"),
        ],
        "env": "`PENHORA_ONLINE_SET_BAIXA_ID_BOLETO`",
    },
    "SetPrenotacaoPO": {
        "prereq": [
            "**[IDTipoPedido = 3](../tabelas-dominio/IDTipoPedido-PO.md)** (Penhora) — erro **53**.",
            "Datas `aaaa-mm-dd` em `DATA_PRENOTACAO` / `DATA_VENCIMENTO`.",
        ],
        "ordem": ["Hash", "IDPedido", "NumeroPrenotacao", "DataPrenotacao", "DataVencimento"],
        "entrada": [
            r("Hash", "Hash de autenticação", "string", "sim", "—", "_(SHA-1)_"),
            r("IDPedido", "Pedido penhora", "int", "sim", "IDTipoPedido=3", "18014820"),
            r("NumeroPrenotacao", "Número da prenotação", "string", "sim", "—", "1516"),
            r("DataPrenotacao", "Data da prenotação", "string", "sim", "aaaa-mm-dd", "2025-01-09"),
            r("DataVencimento", "Vencimento da prenotação", "string", "sim", "aaaa-mm-dd", "2025-02-09"),
        ],
        "saida": [
            r("RETORNO", "Sucesso", "boolean", "sim", "—", "true"),
            r("CODIGOERRO", "Código do erro", "int", "sim", "—", "0"),
            r("ERRODESCRICAO", "Descrição do erro", "string", "não", "se RETORNO=false", "—"),
        ],
        "env": "`PENHORA_ONLINE_SET_PRENOTACAO_*`",
    },
    "SetCustasPO": {
        "prereq": [
            "**[IDTipoPedido = 3](../tabelas-dominio/IDTipoPedido-PO.md)** — erro **53**.",
            "Pedido prenotado (erro **54** se não).",
        ],
        "ordem": ["Hash", "IDPedido", "ValorCustas"],
        "entrada": [
            r("Hash", "Hash de autenticação", "string", "sim", "—", "_(SHA-1)_"),
            r("IDPedido", "Pedido penhora", "int", "sim", "IDTipoPedido=3", "18014820"),
            r("ValorCustas", "Valor das custas", "decimal", "sim", "—", "50.00"),
        ],
        "saida": [
            r("RETORNO", "Sucesso", "boolean", "sim", "—", "true"),
            r("CODIGOERRO", "Código do erro", "int", "sim", "—", "0"),
            r("ERRODESCRICAO", "Descrição do erro", "string", "não", "se RETORNO=false", "—"),
        ],
        "env": "`PENHORA_ONLINE_SET_CUSTAS_VALOR`, `ID_PEDIDO`",
    },
    "SetPenhoraAverbadoPO": {
        "prereq": [
            "**[IDTipoPedido = 3](../tabelas-dominio/IDTipoPedido-PO.md)** — erro **53**.",
            "Prenotação e pagamento conforme spec (erros **54–56**).",
            "Ao menos uma certidão (`CertidaoPenhora`) com URL pública; spec **.p7s** (homolog pode aceitar `.pdf`).",
        ],
        "ordem": ["Hash", "IDPedido", "Resposta", "CertidaoPenhora"],
        "entrada": [
            r("Hash", "Hash de autenticação", "string", "sim", "—", "_(SHA-1)_"),
            r("IDPedido", "Pedido penhora", "int", "sim", "IDTipoPedido=3", "18014820"),
            r("Resposta", "Texto da resposta", "string", "sim", "—", "Penhora averbada conforme mandado."),
            r("CertidaoPenhora", "Lista de certidões", "ArrayOf…", "sim", "—", "—"),
            r("CertidaoPenhora[].Matricula", "Matrícula", "string", "sim", "por item", "12345"),
            r("CertidaoPenhora[].URLArquivo", "URL do arquivo", "string", "sim", "por item", "https://…/doc.p7s"),
        ],
        "saida": [
            r("RETORNO", "Sucesso", "boolean", "sim", "—", "true"),
            r("CODIGOERRO", "Código do erro", "int", "sim", "—", "0"),
            r("ERRODESCRICAO", "Descrição do erro", "string", "não", "se RETORNO=false", "—"),
        ],
        "env": "`PENHORA_ONLINE_SET_PENHORA_AVERBADO_*`, `CERTIDOES_JSON`",
    },
    "SetPenhoraExigenciaPO": {
        "prereq": [
            "**[IDTipoPedido = 3](../tabelas-dominio/IDTipoPedido-PO.md)**.",
            "Pedido prenotado; **não** respondido (IDStatus 2/5/14) — ver `lib/onr_penhora_exigencia.validatePedidoForExigencia`.",
            "Pré-checagem opcional via `GetPedidoPO` no script.",
        ],
        "ordem": ["Hash", "IDPedido", "Resposta", "Anexos"],
        "entrada": [
            r("Hash", "Hash de autenticação", "string", "sim", "—", "_(SHA-1)_"),
            r("IDPedido", "Pedido penhora", "int", "sim", "IDTipoPedido=3", "18014871"),
            r("Resposta", "Texto da nota de exigência", "string", "sim", "—", "Segue nota de exigência…"),
            r("Anexos", "Anexos da exigência", "ArrayOf…", "sim", "—", "—"),
            r("Anexos[].Nome", "Nome do anexo", "string", "sim", "por item", "Nota de exigência"),
            r("Anexos[].URLArquivo", "URL pública", "string", "sim", "por item", "https://…/doc.pdf"),
        ],
        "saida": [
            r("RETORNO", "Sucesso", "boolean", "sim", "—", "true"),
            r("CODIGOERRO", "Código do erro", "int", "sim", "—", "0"),
            r("ERRODESCRICAO", "Descrição do erro", "string", "não", "se RETORNO=false", "—"),
        ],
        "env": "`PENHORA_ONLINE_SET_PENHORA_EXIGENCIA_*`, `ANEXOS_JSON`",
        "impl_extra": ["Helper: `lib/onr_penhora_exigencia`", "`findEligiblePedido.py`"],
    },
    "SetPedidoPessoaRespondidoPO": {
        "prereq": [
            "**[IDTipoPedido = 2](../tabelas-dominio/IDTipoPedido-PO.md)** (Certidão por Pessoa) — erro **53**.",
            "Ao menos um anexo com matrícula e URL pública.",
        ],
        "ordem": ["Hash", "IDPedido", "Resposta", "Negativa", "Anexos"],
        "entrada": [
            r("Hash", "Hash de autenticação", "string", "sim", "—", "_(SHA-1)_"),
            r("IDPedido", "Pedido pessoa", "int", "sim", "IDTipoPedido=2", "—"),
            r("Resposta", "Texto da resposta", "string", "sim", "—", "—"),
            r("Negativa", "Resposta negativa", "boolean", "sim", "—", "false"),
            r("Anexos[].Matricula", "Matrícula", "string", "sim", "por item", "12345"),
            r("Anexos[].URLArquivo", "URL do arquivo", "string", "sim", "por item", "https://…/doc.p7s"),
        ],
        "saida": [
            r("RETORNO", "Sucesso", "boolean", "sim", "—", "true"),
            r("CODIGOERRO", "Código do erro", "int", "sim", "—", "0"),
            r("ERRODESCRICAO", "Descrição do erro", "string", "não", "se RETORNO=false", "—"),
        ],
        "env": "`PENHORA_ONLINE_SET_PEDIDO_PESSOA_RESPONDIDO_*`",
        "skip_if_enriched": True,
    },
}
# fmt: on


def build_middle(enrich: dict, operation: str) -> str:
    e = enrich
    ordem = "\n".join(f"{i}. `{f}`" for i, f in enumerate(e["ordem"], 1))
    parts = [
        "## Pré-requisitos e validações de negócio",
        "",
        bullets(e["prereq"]),
        "",
        "## Ordem do envelope (`oRequest`)",
        "",
        f"Tipo `{operation}_WSReq` (ordem usada nos scripts):",
        "",
        ordem,
        "",
        "## Parâmetros de entrada",
        "",
        table(e["entrada"]),
        "",
        "## Parâmetros de saída",
        "",
        table(e["saida"]),
        "",
    ]
    return "\n".join(parts)


def build_implementation(operation: str, enrich: dict) -> str:
    py, js = script_paths(operation)
    lines = ["## Implementação neste projeto", ""]
    if py:
        lines.append(f"- Python: [`{py}`](../../{py})")
    if js:
        lines.append(f"- JavaScript: [`{js}`](../../{js})")
    if enrich.get("env"):
        lines.append(f"- Variáveis `.env`: {enrich['env']}")
    for extra in enrich.get("impl_extra", []):
        lines.append(f"- {extra}")
    lines.append("")
    return "\n".join(lines)


def patch_md(operation: str, enrich: dict) -> bool:
    path = METODOS / f"{operation}.md"
    if not path.is_file():
        print(f"  SKIP {operation}: {path.name} não existe")
        return False

    content = path.read_text(encoding="utf-8")
    if enrich.get("skip_if_enriched") and "_Documentar regras" not in content:
        print(f"  SKIP {operation}: já enriquecido manualmente")
        return False

    errors = extract_errors_section(content)
    start = content.find("## Pré-requisitos")
    if start == -1:
        start = content.find("## Parâmetros de entrada")
    if start == -1:
        print(f"  SKIP {operation}: sem âncora de seção")
        return False

    end = content.find("## Referências")
    if end == -1:
        end = len(content)

    head = content[:start]
    tail = content[end:]
    middle = build_middle(enrich, operation)
    if not errors:
        errors = "## Códigos de erro (amostra)\n\n_Ver especificação e script (hints de negócio)._\n\n"
    impl = build_implementation(operation, enrich)

    new_content = head + middle + errors + impl + tail
    path.write_text(new_content, encoding="utf-8", newline="\n")
    return True


def write_audit(discovered: dict[str, Path], updated: list[str]) -> None:
    lines = [
        "# Auditoria — scripts `.js` × documentação",
        "",
        "Gerado por `webservice/enrich_implemented_metodos.py`.",
        "",
        "| Operação | Script `.js` | `metodos/<Op>.md` | Enriquecido |",
        "|----------|--------------|-------------------|-------------|",
    ]
    for op in sorted(discovered):
        md = METODOS / f"{op}.md"
        md_ok = "sim" if md.is_file() else "**não**"
        enr = "sim" if op in updated or (op == "SetPedidoPessoaRespondidoPO") else "—"
        js = discovered[op].relative_to(ROOT).as_posix()
        lines.append(f"| `{op}` | `{js}` | {md_ok} | {enr} |")
    lines.extend(
        [
            "",
            "## Domínios (`webservice/tabelas-dominio/`)",
            "",
            "- [IDTipoPedido-PO.md](tabelas-dominio/IDTipoPedido-PO.md)",
            "- [IDStatus-PO.md](tabelas-dominio/IDStatus-PO.md)",
            "- [IDTipoStatus-AT.md](tabelas-dominio/IDTipoStatus-AT.md)",
            "- [ModoNotificacaoStatus-AT.md](tabelas-dominio/ModoNotificacaoStatus-AT.md)",
            "- [TipoSolicitacao-AT.md](tabelas-dominio/TipoSolicitacao-AT.md)",
            "",
        ]
    )
    audit_path = Path(__file__).parent / "AUDIT-metodos-implementados.md"
    audit_path.write_text("\n".join(lines), encoding="utf-8", newline="\n")


def main() -> None:
    discovered = discover_js_operations()
    print(f"Scripts .js com operação SOAP: {len(discovered)}")
    updated: list[str] = []

    for op in sorted(discovered):
        if op not in ENRICH:
            print(f"  WARN {op}: sem dados em ENRICH (documentar manualmente)")
            continue
        if patch_md(op, ENRICH[op]):
            print(f"  OK   {op}")
            updated.append(op)

    write_audit(discovered, updated)
    print(f"\nAtualizados {len(updated)} métodos. Auditoria: webservice/AUDIT-metodos-implementados.md")


if __name__ == "__main__":
    main()
