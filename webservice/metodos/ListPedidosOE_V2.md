# ListPedidosOE_V2

Método do WSOficio — **3.5 Ofícios** (evolução de `ListPedidosOE` com `CNPJInstituicao` por pedido).

## Resumo

| Campo | Valor |
|-------|-------|
| Tipo | Listagem |
| Módulo | 3.5 Ofícios Eletrônicos |
| Operação SOAP | `ListPedidosOE_V2` |

## Serviço

- **WSDL (homologação):** `https://hml3-wsoficio.onr.org.br/oficios.asmx?wsdl`
- **Endpoint:** `https://hml3-wsoficio.onr.org.br/oficios.asmx`
- **WSDL local:** `wsdl/oficios.wsdl`

## Hash de autenticação

Implementação: [`lib/onr_oficios.py`](../../lib/onr_oficios.py) · `resolve_auth_hash()`.

## Pré-requisitos e validações de negócio

- `DataSolicitacaoInicial` e `DataSolicitacaoFinal` obrigatórias (aaaa-mm-dd), período máximo **30 dias** (erro **18**).
- `MaxRowPerPage` mínimo **10** (erro **12**).
- `IDInstituicao`: **-1** = todas; códigos via [`ListInstituicoesOE`](ListInstituicoesOE.md).
- `IDTipoPesquisa` / `IDStatus`: **-1** = todos; domínios em spec § 3.5.4 (`GetPedidoOE`).
- Filtros opcionais de resposta: `DataRespostaInicial` / `DataRespostaFinal` (enviar `""` se não usar).

## Ordem do envelope (`oRequest`)

Tipo `ListPedidosOE_V2_WSReq` (`wsdl/oficios.wsdl`):

1. `Hash`
2. `MaxRowPerPage`
3. `PageNumber`
4. `Protocolo`
5. `IDInstituicao`
6. `IDTipoPesquisa`
7. `IDStatus`
8. `DataSolicitacaoInicial`
9. `DataSolicitacaoFinal`
10. `DataRespostaInicial`
11. `DataRespostaFinal`

## Parâmetros de entrada

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `Hash` | Hash de autenticação | string | sim | — | _(SHA-1)_ |
| `MaxRowPerPage` | Registros por página (mín. 10) | int | sim | — | 50 |
| `PageNumber` | Página | int | sim | — | 1 |
| `Protocolo` | Filtro por protocolo | string | não | — | — |
| `IDInstituicao` | Instituição (-1 = todas) | int | sim | — | -1 |
| `IDTipoPesquisa` | Tipo pesquisa (-1 = todos) | int | sim | — | -1 |
| `IDStatus` | Status (-1 = todos) | int | sim | — | -1 |
| `DataSolicitacaoInicial` | Data início solicitação | string | sim | aaaa-mm-dd | 2025-01-01 |
| `DataSolicitacaoFinal` | Data fim solicitação | string | sim | máx. 30 dias | 2025-01-31 |
| `DataRespostaInicial` | Filtro resposta início | string | não | — | — |
| `DataRespostaFinal` | Filtro resposta fim | string | não | — | — |

## Parâmetros de saída

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `RETORNO` | Sucesso | boolean | sim | — | true |
| `CODIGOERRO` | Código do erro | int | sim | — | 0 |
| `ERRODESCRICAO` | Descrição do erro | string | não | se RETORNO=false | — |
| `QtdeRegistros` | Total de registros | int | sim | se RETORNO=true | — |
| `QtdePaginas` | Total de páginas | int | sim | se RETORNO=true | — |
| `Pedidos[].IDPedido` | Código do pedido | int | sim | por item | — |
| `Pedidos[].IDStatus` | Status | int | sim | por item | — |
| `Pedidos[].IDInstituicao` | Instituição | int | sim | por item | — |
| `Pedidos[].CNPJInstituicao` | CNPJ da instituição | string | não | **v2** | — |
| `Pedidos[].Instituicao` | Nome da instituição | string | não | por item | — |
| `Pedidos[].IDTipoPesquisa` | Tipo de pesquisa | int | sim | por item | — |
| `Pedidos[].Protocolo` | Protocolo | string | não | por item | — |
| `Pedidos[].NumeroOficio` | Número do ofício | string | não | por item | — |
| `Pedidos[].DataSolicitacao` | Data solicitação | string | não | por item | — |
| `Pedidos[].DataResposta` | Data resposta | string | não | por item | — |

## Códigos de erro (amostra)

| Código | Descrição |
|--------|-----------|
| 12–20 | Paginação / datas inválidas ou ausentes |
| 18 | Período > 30 dias |
| 30 | Página além do máximo |
| 45–47 | Erros de hash |
| 51 | Não foi possível obter os pedidos |

## Implementação neste projeto

- Python: [`scripts/ListPedidosOe_v2/listPedidosOe_v2.py`](../../scripts/ListPedidosOe_v2/listPedidosOe_v2.py)
- JavaScript: [`scripts/ListPedidosOe_v2/listPedidosOe_v2.js`](../../scripts/ListPedidosOe_v2/listPedidosOe_v2.js)
- Lib: [`lib/onr_oficios.py`](../../lib/onr_oficios.py) · [`lib/onr_oficios.js`](../../lib/onr_oficios.js)
- Variáveis `.env`: `OFICIOS_DATA_SOLICITACAO_*`, `OFICIOS_MAX_ROW_PER_PAGE`, filtros `OFICIOS_*`
- npm: `npm run list-pedidos-oe-v2`

## Referências

- [`webservice/hash.md`](../hash.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — § 3.5.7–3.5.8
