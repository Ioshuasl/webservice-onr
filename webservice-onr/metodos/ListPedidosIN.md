# ListPedidosIN

Método do WSOficio — **3.11 Intimações**.

## Resumo

| Campo | Valor |
|-------|-------|
| Tipo | Listagem |
| Módulo | 3.11 Intimações |
| Operação SOAP | `ListPedidosIN` |

## Serviço

- **WSDL (homologação):** `https://hml3-wsoficio.onr.org.br/intimacoes.asmx?wsdl`
- **Endpoint:** `https://hml3-wsoficio.onr.org.br/intimacoes.asmx`
- **WSDL local:** `wsdl/intimacoes.wsdl`

## Hash de autenticação

Parâmetro obrigatório **`Hash`** no envelope de entrada (`string(50)`).

Cálculo (detalhes em [`../hash.md`](../hash.md)):

```text
Hash = SHA1( ONR_SERVENTIA_CHAVE + token ).encode('utf-8').hexdigest().upper()
```

| Etapa | Ação |
|-------|------|
| 1 | `LoginUsuarioCertificado` → obter `Tokens` |
| 2 | Escolher token (`ONR_HASH_TOKEN_INDEX`, padrão `0`) |
| 3 | Calcular hash com a chave da serventia (não enviar chave na SOAP) |
| 4 | Chamar `ListPedidosIN` passando `Hash` + demais parâmetros |

Implementação: [`lib/onr_hash.py`](../../lib/onr_hash.py) · Helper: `resolve_auth_hash()` em [`lib/onr_acompanhamento.py`](../../lib/onr_acompanhamento.py).

Erros comuns: **45** (hash inválido), **46** (token já usado), **47** (expirado) — ver tabela em [`../hash.md`](../hash.md).

## Pré-requisitos e validações de negócio

_Documentar regras de negócio (ex.: IDTipoPedido, IDStatus) e linkar [`webservice/tabelas-dominio/`](../tabelas-dominio/README.md)._

## Ordem do envelope (`oRequest`)

_Listar campos na ordem de `<ListPedidosIN_WSReq>` no WSDL local._

## Parâmetros de entrada

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `Hash` | Hash para validação da mensagem | string(50 | — | — | — |
| `MaxRowPerPage` | Quantidade máxima de registros a serem retornados por página | int | — | — | — |
| `PageNumber` | Página a ser retornada | int | — | — | — |
| `IDStatus` | ID do status do pedido | int | — | — | — |
| `Protocolo` | Protocolo do pedido de intimação | string(11 | — | — | — |
| — | TipoDataPesquisa - Tipo de Pesquisa | string(1 | — | — | — |
| `DataInicial` | Data inicial a serem filtrados, formato: aaaa-mm-dd | string | — | — | — |
| `DataFinal` | Data final a serem filtrados, formato: aaaa-mm-dd | string | — | — | — |

> _Gerado da spec: revisar colunas Obrigatório, Condicional e Exemplo com WSDL + [`TEMPLATE.md`](TEMPLATE.md)._

## Parâmetros de saída

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `RETORNO` | Indica se houve erro ou não na execução do método | boolean | — | — | — |
| `CODIGOERRO` | Código do erro | int | — | (se RETORNO = false) | — |
| `ERRODESCRICAO` | Descrição do erro | string(200 | — | (se RETORNO = false) | — |
| `QtdeRegistros` | Quantidade total de registros encontrados | int | — | (se RETORNO = true) | — |
| `QtdePaginas` | Quantidade total de páginas, de acordo com o total de registros encontrados e com a quantidade máxima de registros por página que foi informada no envelope de entrada - MaxRowPerPage - | int | — | (se RETORNO = true) | — |
| `IDPedido` | Código do pedido | int | — | — | — |
| `Protocolo` | Protocolo do registro | string(11 | — | — | — |
| `Solicitante` | Nome do solicitante | string(300 | — | — | — |
| `Status` | Descrição do status do pedido - | string(30 | — | — | — |
| `DataPedido` | Data de inclusão do pedido, formato: aaaa-mm-ddhh:mm:ss | string | — | — | — |
| `DataStatus` | Data da última mensagem conforme status, formato: aaaa-mm-ddhh:mm:ss | string | — | — | — |

> _Gerado da spec: revisar colunas Obrigatório, Condicional e Exemplo com WSDL + [`TEMPLATE.md`](TEMPLATE.md)._

## Códigos de erro (amostra)

| Código | Descrição |
|--------|-----------|
| 0 | Erro de sistema. |
| 10 | Request inválido. |
| 11 | O Hash de validação não foi informado. |
| 12 | A quantidade de registros por página informada é inválida. A quantidade mínima permitida é 10. |
| 13 | A página informada é inválida. |
| 16 | A data do pedido inicial é inválida. |
| 17 | A data do pedido final é inválida. |
| 30 | A página informada é inválida. Página máxima possível: [PAGINA] |
| 45 | Hash inválido. |
| 46 | Hash inválido: Hash já utilizado. |
| 47 | Hash inválido: Hash expirado. |
| 51 | Não foi possível obter os pedidos. |

## Implementação neste projeto

- Script: _(ainda não implementado)_

## Referências

- [`webservice/hash.md`](../hash.md) — geração do `Hash`
- [`webservice/list-metodos.md`](../list-metodos.md)
- [`webservice/tabelas-dominio/`](../tabelas-dominio/README.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — Envelope de Entrada/Saída `ListPedidosIN`
