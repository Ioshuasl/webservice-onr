# SetPedidoDevolvidoOE

Método do WSOficio — **3.5 Ofícios**.

## Resumo

| Campo | Valor |
|-------|-------|
| Tipo | Escrita / devolução |
| Módulo | 3.5 Ofícios Eletrônicos |
| Operação SOAP | `SetPedidoDevolvidoOE` |

## Serviço

- **WSDL (homologação):** `https://hml3-wsoficio.onr.org.br/oficios.asmx?wsdl`
- **Endpoint:** `https://hml3-wsoficio.onr.org.br/oficios.asmx`
- **WSDL local:** `wsdl/oficios.wsdl`

## Hash de autenticação

Implementação: [`lib/onr_oficios.py`](../../lib/onr_oficios.py) · `resolve_auth_hash()`.

## Pré-requisitos e validações de negócio

- **Pré-validação local (scripts):** antes de `SetPedidoDevolvidoOE`, o script chama `GetPedidoOE` e bloqueia se `IDStatus=3` (já devolvido), `IDStatus=2` (Respondido — erro **53**), ou se `DataResposta` / `Resposta` já estiverem preenchidos. Usa dois tokens do login (`ONR_HASH_TOKEN_INDEX` e `+1`). Desligar: `OFICIOS_SET_PEDIDO_DEVOLVIDO_SKIP_VALIDAR_STATUS=true`.
- Pedido em status elegível (em geral **Aberto**, `IDStatus=1` — ver spec § 3.5.4 em [`GetPedidoOE.md`](GetPedidoOE.md)).
- `MotivoDevolucao` obrigatório (erro **13**).
- Não confundir com `SetPedidoRespondidoOE` (resposta com anexos `.p7s`).

Status após devolução: `IDStatus=3` (Devolvido) — spec § 3.5.4.

## Ordem do envelope (`oRequest`)

Tipo `SetPedidoDevolvidoOE_WSReq` (`wsdl/oficios.wsdl`):

1. `Hash`
2. `IDPedido`
3. `MotivoDevolucao`

## Parâmetros de entrada

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `Hash` | Hash de autenticação | string | sim | — | _(SHA-1)_ |
| `IDPedido` | Código do pedido | int | sim | — | — |
| `MotivoDevolucao` | Motivo da devolução | string | sim | — | Documentação incompleta no ofício |

## Parâmetros de saída

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `RETORNO` | Sucesso | boolean | sim | — | true |
| `CODIGOERRO` | Código do erro | int | sim | — | 0 |
| `ERRODESCRICAO` | Descrição do erro | string | não | se RETORNO=false | — |

## Códigos de erro (amostra)

| Código | Descrição |
|--------|-----------|
| 12 | IDPedido inválido |
| 13 | MotivoDevolucao não informado |
| 45–47 | Erros de hash |
| 51–54 | Pedido / permissão / devolução |
| 53 | Pedido já respondido |

## Implementação neste projeto

- Python: [`scripts/SetPedidoDevolvidoOe/setPedidoDevolvidoOe.py`](../../scripts/SetPedidoDevolvidoOe/setPedidoDevolvidoOe.py)
- JavaScript: [`scripts/SetPedidoDevolvidoOe/setPedidoDevolvidoOe.js`](../../scripts/SetPedidoDevolvidoOe/setPedidoDevolvidoOe.js)
- Lib: [`lib/onr_oficios.py`](../../lib/onr_oficios.py) · [`lib/onr_oficios.js`](../../lib/onr_oficios.js)
- Pré-validação: [`lib/onr_oficios_devolvido.py`](../../lib/onr_oficios_devolvido.py) · [`lib/onr_oficios_devolvido.js`](../../lib/onr_oficios_devolvido.js)
- Variáveis `.env`: `OFICIOS_SET_PEDIDO_DEVOLVIDO_*` (ou `OFICIOS_ID_PEDIDO`)
- npm: `npm run set-pedido-devolvido-oe`

## Referências

- [`webservice/hash.md`](../hash.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — § 3.5.13–3.5.14
