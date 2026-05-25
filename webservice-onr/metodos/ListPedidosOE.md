# ListPedidosOE

Método do WSOficio — **3.5 Ofícios**.

## Resumo

| Campo | Valor |
|-------|-------|
| Tipo | Listagem |
| Módulo | 3.5 Ofícios |
| Operação SOAP | `ListPedidosOE` |

## Serviço

- **WSDL (homologação):** `https://hml3-wsoficio.onr.org.br/oficios.asmx?wsdl`
- **Endpoint:** `https://hml3-wsoficio.onr.org.br/oficios.asmx`
- **WSDL local:** `wsdl/oficios.wsdl`

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
| 4 | Chamar `ListPedidosOE` passando `Hash` + demais parâmetros |

Implementação: [`lib/onr_hash.py`](../../lib/onr_hash.py) · Helper: `resolve_auth_hash()` em [`lib/onr_acompanhamento.py`](../../lib/onr_acompanhamento.py).

Erros comuns: **45** (hash inválido), **46** (token já usado), **47** (expirado) — ver tabela em [`../hash.md`](../hash.md).

## Pré-requisitos e validações de negócio

_Documentar regras de negócio (ex.: IDTipoPedido, IDStatus) e linkar [`webservice/tabelas-dominio/`](../tabelas-dominio/README.md)._

## Ordem do envelope (`oRequest`)

_Listar campos na ordem de `<ListPedidosOE_WSReq>` no WSDL local._

## Parâmetros de entrada

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `Hash` | Hash para validação da mensagem | string | — | — | — |
| `MaxRowPerPage` | Quantidade máxima de registros a serem retornados por página | int | — | — | — |
| `PageNumber` | Página a ser retornada | int | — | — | — |
| `Protocolo` | Protocolo a ser filtrado – opcional | string | não | — | — |
| `IDInstituicao` | Código da Instituição solicitante a ser filtrado. Para retornar todos, informar -1. Para obter os códigos das Instituições conferir o método ListInstituicoesOE, item 3.5.1 | int | — | — | — |
| `IDTipoPesquisa` | Código do Tipo de Pesquisa a ser filtrado. Para retornar todos, informar -1. Para uma lista dos valores possíveis, conferir o item 3.5.4 | int | — | — | — |
| `IDStatus` | Código do Status a ser filtrado. Para retornar todos, informar -1. Para uma lista dos | — | — | — | — |
| `DataSolicitacaoInicial` | Data inicial da solicitação a ser filtrada, formato: aaaa-mm-dd | string | — | — | — |
| `DataSolicitacaoFinal` | Data final da solicitação a ser filtrada, formato: aaaa-mm-dd | string | — | — | — |
| `DataRespostaInicial` | Data inicial da resposta a ser filtrada, formato: aaaa-mm-dd - opcional | string | não | — | — |
| `DataRespostaFinal` | Data final da resposta a ser filtrada, formato: aaaa-mm-dd - opcional | string | não | — | — |

> _Gerado da spec: revisar colunas Obrigatório, Condicional e Exemplo com WSDL + [`TEMPLATE.md`](TEMPLATE.md)._

## Parâmetros de saída

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `RETORNO` | Indica se houve erro ou não na execução do método | boolean | — | — | — |
| `CODIGOERRO` | Código do erro | int | — | (se RETORNO = false) | — |
| `ERRODESCRICAO` | Descrição do erro | string | — | (se RETORNO = false) | — |
| `QtdeRegistros` | Quantidade total de registros encontrados | int | — | (se RETORNO = true) | — |
| `QtdePaginas` | Quantidade total de páginas, de acordo com o total de registros encontrados e com a quantidade máxima de registros por página que foi informada no envelope de entrada - MaxRowPerPage - | int | — | (se RETORNO = true) | — |
| `IDPedido` | Código do pedido | int | — | — | — |
| `IDStatus` | Código do Status.  Para uma lista dos valores possíveis, conferir o item 3.5.4 | int | — | — | — |
| `IDInstituicao` | Código da Instituição solicitante | int | — | — | — |
| `Instituicao` | Nome da Instituição solicitante | string | — | — | — |
| `IDTipoPesquisa` | Código do Tipo de Pesquisa.  Para uma lista dos valores possíveis, conferir o item 3.5.4 | int | — | — | — |
| `Protocolo` | Protocolo do título | string | — | — | — |
| `NumeroOficio` | Número do Ofício | string | — | — | — |
| `DataSolicitacao` | Data do pedido, formato: aaaa-mm-dd | string | — | — | — |
| `DataResposta` | Data da resposta, formato: aaaa-mm-dd | string | — | — | — |

> _Gerado da spec: revisar colunas Obrigatório, Condicional e Exemplo com WSDL + [`TEMPLATE.md`](TEMPLATE.md)._

## Códigos de erro (amostra)

| Código | Descrição |
|--------|-----------|
| 0 | Erro de sistema. |
| 10 | Request inválido. |
| 11 | O Hash de validação não foi informado. |
| 12 | A quantidade de registros por página informada é inválida. A quantidade mínima permitida é 10. |
| 13 | A página informada é inválida. |
| 14 | A data de solicitação inicial não foi informada. |
| 15 | A data de solicitação inicial informada é inválida. |
| 16 | A data de solicitação final não foi informada. |
| 17 | A data de solicitação final informada é inválida. |
| 18 | O período da data de solicitação não pode ser maior |
| 19 | A data da resposta inicial informada é inválida. |
| 20 | A data da resposta final informada é inválida. |
| 30 | A página informada é inválida. Página máxima possível: [PAGINA] |
| 45 | Hash inválido. |
| 46 | Hash inválido: Hash já utilizado. |
| … | _+2 códigos na especificação_ |

## Implementação neste projeto

- Script: _(ainda não implementado)_

## Referências

- [`webservice/hash.md`](../hash.md) — geração do `Hash`
- [`webservice/list-metodos.md`](../list-metodos.md)
- [`webservice/tabelas-dominio/`](../tabelas-dominio/README.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — Envelope de Entrada/Saída `ListPedidosOE`
