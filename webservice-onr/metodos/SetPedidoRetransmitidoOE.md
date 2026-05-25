# SetPedidoRetransmitidoOE

Método do WSOficio — **3.5 Ofícios**.

## Resumo

| Campo | Valor |
|-------|-------|
| Tipo | Escrita / retransmissão |
| Módulo | 3.5 Ofícios Eletrônicos |
| Operação SOAP | `SetPedidoRetransmitidoOE` |

## Serviço

- **WSDL (homologação):** `https://hml3-wsoficio.onr.org.br/oficios.asmx?wsdl`
- **Endpoint:** `https://hml3-wsoficio.onr.org.br/oficios.asmx`
- **WSDL local:** `wsdl/oficios.wsdl`

## Hash de autenticação

Implementação: [`lib/onr_oficios.py`](../../lib/onr_oficios.py) · `resolve_auth_hash()`.

## Pré-requisitos e validações de negócio

- **Pré-validação local (scripts):** `GetPedidoOE` antes da escrita — bloqueia `IDStatus=2/3`, `Retransmitido=true`, `IDTipoPesquisa` fora de **1–3** (erro **54/503**), ou resposta já preenchida. Dois tokens (`ONR_HASH_TOKEN_INDEX` + `+1`). Desligar: `OFICIOS_SET_PEDIDO_RETRANSMITIDO_SKIP_VALIDAR_STATUS=true`.
- `IDCartorio` deve constar em `ListCartoriosRestransmitirOE` (erro **504**).
- Não retransmitir para o cartório de origem (erro **501**).
- Apenas pesquisas **Endereço Rua (1)**, **Edifício (2)**, **Loteamento (3)** — spec § 3.5.4.
- `Observacoes` opcional no WSDL.

## Ordem do envelope (`oRequest`)

Tipo `SetPedidoRetransmitidoOE_WSReq` (`wsdl/oficios.wsdl`):

1. `Hash`
2. `IDPedido`
3. `IDCartorio`
4. `Observacoes` (opcional — omitido pelo script se vazio)

## Parâmetros de entrada

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `Hash` | Hash de autenticação | string | sim | — | _(SHA-1)_ |
| `IDPedido` | Código do pedido | int | sim | — | — |
| `IDCartorio` | Cartório destino (`ListCartoriosRestransmitirOE`) | int | sim | — | — |
| `Observacoes` | Observações da retransmissão | string | não | — | — |

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
| 13 | IDCartorio inválido |
| 45–47 | Erros de hash |
| 51–55 | Pedido / permissão / tipo / falha |
| 501 | Mesmo cartório de origem |
| 502–504 | Já respondido / tipo / cartório não permitido |

## Implementação neste projeto

- Python: [`scripts/SetPedidoRetransmitidoOe/setPedidoRetransmitidoOe.py`](../../scripts/SetPedidoRetransmitidoOe/setPedidoRetransmitidoOe.py)
- JavaScript: [`scripts/SetPedidoRetransmitidoOe/setPedidoRetransmitidoOe.js`](../../scripts/SetPedidoRetransmitidoOe/setPedidoRetransmitidoOe.js)
- Lib: [`lib/onr_oficios.py`](../../lib/onr_oficios.py) · [`lib/onr_oficios_retransmitido.py`](../../lib/onr_oficios_retransmitido.py)
- Variáveis `.env`: `OFICIOS_SET_PEDIDO_RETRANSMITIDO_*`
- npm: `npm run set-pedido-retransmitido-oe`

## Referências

- [`webservice/hash.md`](../hash.md)
- [`GetPedidoOE.md`](GetPedidoOE.md) — `IDTipoPesquisa`, `Retransmitido`
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — § 3.5.19–3.5.20
