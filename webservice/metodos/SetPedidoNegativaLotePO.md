# SetPedidoNegativaLotePO

Método do WSOficio — **3.3 Penhora Online**.

## Resumo

| Campo | Valor |
|-------|-------|
| Tipo | Atualização / comando (lote) |
| Módulo | 3.3 Penhora Online |
| Operação SOAP | `SetPedidoNegativaLotePO` |

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
| 4 | Chamar `SetPedidoNegativaLotePO` passando `Hash` + lista de pedidos |

Implementação: [`lib/onr_hash.py`](../../lib/onr_hash.py) · Helper: `resolve_auth_hash()` em [`lib/onr_penhora_online.py`](../../lib/onr_penhora_online.py).

Erros comuns: **45** (hash inválido), **46** (token já usado), **47** (expirado) — ver tabela em [`../hash.md`](../hash.md).

## Pré-requisitos e validações de negócio

- **[IDTipoPedido = 2](../tabelas-dominio/IDTipoPedido-PO.md)** (Certidão por Pessoa) — apenas pedidos **Pessoa** podem ser negativados em lote.
- Ao menos um `IDPedido` no array `Pedidos`.
- Resposta traz status **por pedido**; o script falha se algum item do lote retornar `RETORNO=false`.

## Ordem do envelope (`oRequest`)

Tipo `SetPedidoNegativaLotePO_WSReq` (`wsdl/penhoraonline.wsdl`):

1. `Hash`
2. `Pedidos` → `SetPedidoNegativaLotePO_Pedido_WSReq[]` com `IDPedido`

## Parâmetros de entrada

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `Hash` | Hash de autenticação | string | sim | — | _(SHA-1)_ |
| `Pedidos[].IDPedido` | Código do pedido pessoa | int | sim | IDTipoPedido=2 | 18014708 |

## Parâmetros de saída

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `RETORNO` | Sucesso global do método | boolean | sim | — | true |
| `CODIGOERRO` | Código do erro global | int | sim | — | 0 |
| `ERRODESCRICAO` | Descrição do erro global | string | não | se RETORNO=false | — |
| `Pedidos[].IDPedido` | Pedido processado | int | sim | — | 18014708 |
| `Pedidos[].RETORNO` | Sucesso por pedido | boolean | sim | — | true |
| `Pedidos[].CODIGOERRO` | Código por pedido | int | sim | — | 0 |
| `Pedidos[].ERRODESCRICAO` | Descrição por pedido | string | não | se Pedidos[].RETORNO=false | — |

## Códigos de erro (amostra)

### Envelope global

| Código | Descrição |
|--------|-----------|
| 0 | Erro de sistema. |
| 10 | Request inválido. |
| 11 | O Hash de validação não foi informado. |
| 12 | Não foi informado nenhum pedido. |
| 45 | Hash inválido. |
| 46 | Hash inválido: Hash já utilizado. |
| 47 | Hash inválido: Hash expirado. |

### Por pedido (`Pedidos[]`)

| Código | Descrição |
|--------|-----------|
| 151 | O IDPedido informado é inválido. |
| 152 | Não foi possível pegar os dados do pedido (tipo Pessoa?). |
| 153 | Sem permissão para negativar este pedido. |
| 154 | Operação só para pedidos do tipo Pessoa. |
| 155 | Não foi possível negativar o pedido. |

## Implementação neste projeto

- Python: [`scripts/SetPedidoNegativaLotePo/setPedidoNegativaLotePo.py`](../../scripts/SetPedidoNegativaLotePo/setPedidoNegativaLotePo.py)
- JavaScript: [`scripts/SetPedidoNegativaLotePo/setPedidoNegativaLotePo.js`](../../scripts/SetPedidoNegativaLotePo/setPedidoNegativaLotePo.js)
- Variáveis `.env`: `PENHORA_ONLINE_SET_PEDIDO_NEGATIVA_LOTE_*` (`PEDIDOS_JSON`, `ID_PEDIDOS` ou `ID_PEDIDO`)
- npm: `npm run set-pedido-negativa-lote-po`

## Referências

- [`webservice/hash.md`](../hash.md) — geração do `Hash`
- [`webservice/list-metodos.md`](../list-metodos.md)
- [`webservice/tabelas-dominio/`](../tabelas-dominio/README.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — Envelope de Entrada/Saída `SetPedidoNegativaLotePO`
