# ListPedidosPO

Método do WSOficio — **3.3 Penhora Online**.

## Resumo

| Campo | Valor |
|-------|-------|
| Tipo | Listagem |
| Módulo | 3.3 Penhora Online |
| Operação SOAP | `ListPedidosPO` |

## Serviço

- **WSDL (homologação):** `https://hml3-wsoficio.onr.org.br/penhoraonline.asmx?wsdl`
- **Endpoint:** `https://hml3-wsoficio.onr.org.br/penhoraonline.asmx`
- **WSDL local:** `wsdl/penhoraonline.wsdl`

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
| 4 | Chamar `ListPedidosPO` passando `Hash` + demais parâmetros |

Implementação: [`lib/onr_hash.py`](../../lib/onr_hash.py) · Helper: `resolve_auth_hash()` em [`lib/onr_acompanhamento.py`](../../lib/onr_acompanhamento.py).

Erros comuns: **45** (hash inválido), **46** (token já usado), **47** (expirado) — ver tabela em [`../hash.md`](../hash.md).

## Pré-requisitos e validações de negócio

- Datas de solicitação obrigatórias (`PENHORA_ONLINE_DATA_SOLICITACAO_*`).
- `MaxRowPerPage` ≥ 10 (regra do serviço).
- Homologação .NET: opcionais enviados como `""` (ver script) para evitar `NullReferenceException`.
- Filtros [IDTipoPedido](../tabelas-dominio/IDTipoPedido-PO.md) e [IDStatus](../tabelas-dominio/IDStatus-PO.md) (`-1` = todos).

## Ordem do envelope (`oRequest`)

Tipo `ListPedidosPO_WSReq` (ordem usada nos scripts):

1. `Hash`
2. `MaxRowPerPage`
3. `PageNumber`
4. `Protocolo`
5. `IDVara`
6. `IDTipoPedido`
7. `IDStatus`
8. `DataSolicitacaoInicial`
9. `DataSolicitacaoFinal`
10. `DataRespostaInicial`
11. `DataRespostaFinal`

## Parâmetros de entrada

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `Hash` | Hash de autenticação | string | sim | — | _(SHA-1)_ |
| `MaxRowPerPage` | Máximo por página | int | sim | ≥ 10 | 50 |
| `PageNumber` | Página | int | sim | — | 1 |
| `Protocolo` | Filtro protocolo | string | sim | vazio = sem filtro | "" |
| `IDVara` | Vara | int | sim | `-1` = todas | -1 |
| `IDTipoPedido` | Tipo do pedido | int | sim | ver [IDTipoPedido-PO](../tabelas-dominio/IDTipoPedido-PO.md) | -1 |
| `IDStatus` | Status do pedido | int | sim | ver [IDStatus-PO](../tabelas-dominio/IDStatus-PO.md) | -1 |
| `DataSolicitacaoInicial` | Data solicitação inicial | string | sim | aaaa-mm-dd | 2025-01-01 |
| `DataSolicitacaoFinal` | Data solicitação final | string | sim | aaaa-mm-dd | 2025-12-31 |
| `DataRespostaInicial` | Data resposta inicial | string | sim | vazio se não usar | "" |
| `DataRespostaFinal` | Data resposta final | string | sim | vazio se não usar | "" |

## Parâmetros de saída

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `RETORNO` | Sucesso | boolean | sim | — | true |
| `CODIGOERRO` | Código do erro | int | sim | — | 0 |
| `ERRODESCRICAO` | Descrição do erro | string | não | se RETORNO=false | — |
| `QtdeRegistros` | Total de registros | int | sim | se RETORNO=true | — |
| `QtdePaginas` | Total de páginas | int | sim | se RETORNO=true | — |
| `Pedidos` | Lista de pedidos | ListPedidosPO_Pedidos_WSResp[] | não | se RETORNO=true | — |
## Códigos de erro (amostra)

| Código | Descrição |
|--------|-----------|
| 0 | Erro de sistema. |
| 10 | Request inválido. |
| 11 | O Hash de validação não foi informado. |
| 12 | A quantidade de registros por página informada é inválida. A quantidade mínima permitida é 10. |
| 13 | A página informada é inválida. |
| 14 | A Vara informada é inválida. |
| 15 | O tipo do pedido informado é inválido. |
| 16 | O Status informado é inválido. |
| 17 | A data de solicitação inicial não foi informada. |
| 18 | A data de solicitação final não foi informada. |
| 19 | A data de solicitação inicial é inválida. |
| 20 | A data de solicitação final é inválida. |
| 21 | O período da data de solicitação não pode ser maior que 30 dias. |
| 22 | A data de resposta inicial é inválida. |
| 23 | A data de resposta final é inválida. |
| … | _+5 códigos na especificação_ |

## Implementação neste projeto

- Python: [`scripts/GetPedidoPo/getPedidoPo.py`](../../scripts/GetPedidoPo/getPedidoPo.py)
- JavaScript: [`scripts/GetPedidoPo/getPedidoPo.js`](../../scripts/GetPedidoPo/getPedidoPo.js)
- Variáveis `.env`: `PENHORA_ONLINE_*`
## Referências

- [`webservice/hash.md`](../hash.md) — geração do `Hash`
- [`webservice/list-metodos.md`](../list-metodos.md)
- [`webservice/tabelas-dominio/`](../tabelas-dominio/README.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — Envelope de Entrada/Saída `ListPedidosPO`
