# ListInstituicoesOE

Método do WSOficio — **3.5 Ofícios**.

## Resumo

| Campo | Valor |
|-------|-------|
| Tipo | Listagem / domínio |
| Módulo | 3.5 Ofícios Eletrônicos |
| Operação SOAP | `ListInstituicoesOE` |

## Serviço

- **WSDL (homologação):** `https://hml3-wsoficio.onr.org.br/oficios.asmx?wsdl`
- **Endpoint:** `https://hml3-wsoficio.onr.org.br/oficios.asmx`
- **WSDL local:** `wsdl/oficios.wsdl`

## Hash de autenticação

Parâmetro obrigatório **`Hash`** no envelope de entrada.

Implementação: [`lib/onr_oficios.py`](../../lib/onr_oficios.py) · `resolve_auth_hash()`.

## Pré-requisitos e validações de negócio

- Retorna o catálogo de **instituições solicitantes** para filtros em `ListPedidosOE` / `ListPedidosOE_V2` (`IDInstituicao`; use **-1** para todas).
- Não exige parâmetros além do `Hash`.

## Ordem do envelope (`oRequest`)

Tipo `ListInstituicoesOE_WSReq` (`wsdl/oficios.wsdl`):

1. `Hash`

## Parâmetros de entrada

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `Hash` | Hash de autenticação | string | sim | — | _(SHA-1)_ |

## Parâmetros de saída

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `RETORNO` | Sucesso | boolean | sim | — | true |
| `CODIGOERRO` | Código do erro | int | sim | — | 0 |
| `ERRODESCRICAO` | Descrição do erro | string | não | se RETORNO=false | — |
| `Instituicoes[].IDInstituicao` | Código da instituição | int | sim | por item | — |
| `Instituicoes[].Instituicao` | Nome da instituição | string | não | por item | — |

## Códigos de erro (amostra)

| Código | Descrição |
|--------|-----------|
| 11 | Hash não informado |
| 45–47 | Erros de hash |
| 51 | Não foi possível obter as instituições |

## Implementação neste projeto

- Python: [`scripts/ListInstituicoesOe/listInstituicoesOe.py`](../../scripts/ListInstituicoesOe/listInstituicoesOe.py)
- JavaScript: [`scripts/ListInstituicoesOe/listInstituicoesOe.js`](../../scripts/ListInstituicoesOe/listInstituicoesOe.js)
- Lib: [`lib/onr_oficios.py`](../../lib/onr_oficios.py) · [`lib/onr_oficios.js`](../../lib/onr_oficios.js)
- Variáveis `.env`: `OFICIOS_WSDL_PATH`, `OFICIOS_ENDPOINT`, `OFICIOS_AUTO_LOGIN`
- npm: `npm run list-instituicoes-oe`

## Referências

- [`webservice/hash.md`](../hash.md)
- [`webservice/list-metodos.md`](../list-metodos.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — § 3.5.1–3.5.2
