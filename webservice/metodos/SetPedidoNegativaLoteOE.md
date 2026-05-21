# SetPedidoNegativaLoteOE

Método do WSOficio — **3.5 Ofícios**.

## Resumo

| Campo | Valor |
|-------|-------|
| Tipo | Escrita / negativa em lote |
| Módulo | 3.5 Ofícios Eletrônicos |
| Operação SOAP | `SetPedidoNegativaLoteOE` |

## Serviço

- **WSDL (homologação):** `https://hml3-wsoficio.onr.org.br/oficios.asmx?wsdl`
- **Endpoint:** `https://hml3-wsoficio.onr.org.br/oficios.asmx`
- **WSDL local:** `wsdl/oficios.wsdl`

## Hash de autenticação

Implementação: [`lib/onr_oficios.py`](../../lib/onr_oficios.py) · `resolve_auth_hash()`.

## Pré-requisitos e validações de negócio

- Pelo menos um `IDPedido` em `Pedidos` (erro **12**).
- Pedidos em status elegível para negativa (não respondido — erro **154** por item).
- Resposta por pedido em `Pedidos[]` com `RETORNO`, `CODIGOERRO`, `ERRODESCRICAO`, `IDPedido` (spec § 3.5.16).
- Diferente de `SetPedidoNegativaLotePO` (Penhora): Ofícios usa `ArrayOfInt` (`int[]`), não array de objetos `IDPedido`.

Status após negativa: conforme fluxo ONR (consultar `GetPedidoOE` / `ListPedidosOE_V2`).

## Ordem do envelope (`oRequest`)

Tipo `SetPedidoNegativaLoteOE_WSReq` (`wsdl/oficios.wsdl`):

1. `Hash`
2. `Pedidos` → `ArrayOfInt`
   - `int` (repetido, um por pedido)

## Parâmetros de entrada

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `Hash` | Hash de autenticação | string | sim | — | _(SHA-1)_ |
| `Pedidos` | IDs dos pedidos a negativar | `ArrayOfInt` | sim | — | `{ "int": [101, 102] }` |

## Parâmetros de saída

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `RETORNO` | Sucesso global | boolean | sim | — | true |
| `CODIGOERRO` | Código do erro global | int | sim | — | 0 |
| `ERRODESCRICAO` | Descrição do erro global | string | não | se RETORNO=false | — |
| `Pedidos[].IDPedido` | ID do pedido no lote | int | sim | se RETORNO=true | 101 |
| `Pedidos[].RETORNO` | Sucesso por pedido | boolean | sim | por item | true |
| `Pedidos[].CODIGOERRO` | Código por pedido | int | sim | por item | 0 |
| `Pedidos[].ERRODESCRICAO` | Descrição por pedido | string | não | se item RETORNO=false | — |

## Códigos de erro (amostra)

| Código | Escopo | Descrição |
|--------|--------|-----------|
| 12 | global | Nenhum pedido informado |
| 45–47 | global | Erros de hash |
| 151–155 | por pedido | ID / permissão / já respondido / falha na negativa |

## Implementação neste projeto

- Python: [`scripts/SetPedidoNegativaLoteOe/setPedidoNegativaLoteOe.py`](../../scripts/SetPedidoNegativaLoteOe/setPedidoNegativaLoteOe.py)
- JavaScript: [`scripts/SetPedidoNegativaLoteOe/setPedidoNegativaLoteOe.js`](../../scripts/SetPedidoNegativaLoteOe/setPedidoNegativaLoteOe.js)
- Lib: [`lib/onr_oficios.py`](../../lib/onr_oficios.py) · [`lib/onr_oficios_negativa_lote.py`](../../lib/onr_oficios_negativa_lote.py)
- Variáveis `.env`: `OFICIOS_SET_PEDIDO_NEGATIVA_LOTE_*` (`PEDIDOS_JSON`, `ID_PEDIDOS` ou `ID_PEDIDO`)
- npm: `npm run set-pedido-negativa-lote-oe`

## Referências

- [`webservice/hash.md`](../hash.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — § 3.5.15–3.5.16
