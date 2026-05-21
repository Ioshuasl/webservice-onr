# ListCartoriosRestransmitirOE

Método do WSOficio — **3.5 Ofícios**.

## Resumo

| Campo | Valor |
|-------|-------|
| Tipo | Consulta / listagem |
| Módulo | 3.5 Ofícios Eletrônicos |
| Operação SOAP | `ListCartoriosRestransmitirOE` |

## Serviço

- **WSDL (homologação):** `https://hml3-wsoficio.onr.org.br/oficios.asmx?wsdl`
- **Endpoint:** `https://hml3-wsoficio.onr.org.br/oficios.asmx`
- **WSDL local:** `wsdl/oficios.wsdl`

## Hash de autenticação

Implementação: [`lib/onr_oficios.py`](../../lib/onr_oficios.py) · `resolve_auth_hash()`.

## Pré-requisitos e validações de negócio

- Usuário autenticado deve ser de **cartório** (erro **51**).
- Retorna cartórios aos quais o pedido pode ser **retransmitido** via `SetPedidoRetransmitidoOE` (usar `IDCartorio` da lista).
- Não confundir com `ListInstituicoesOE` (instituições solicitantes).

## Ordem do envelope (`oRequest`)

Tipo `ListCartoriosRestransmitirOE_WSReq` (`wsdl/oficios.wsdl`):

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
| `Cartorios[].IDCartorio` | Código do cartório | int | sim | se RETORNO=true | — |
| `Cartorios[].Cartorio` | Nome/número do cartório | string | não | se RETORNO=true | 01º |

## Códigos de erro (amostra)

| Código | Descrição |
|--------|-----------|
| 11 | Hash não informado |
| 45–47 | Erros de hash |
| 51 | Apenas usuários de cartórios |
| 52 | Dados do cartório do usuário indisponíveis |
| 53 | Não foi possível obter os cartórios |

## Implementação neste projeto

- Python: [`scripts/ListCartoriosRestransmitirOe/listCartoriosRestransmitirOe.py`](../../scripts/ListCartoriosRestransmitirOe/listCartoriosRestransmitirOe.py)
- JavaScript: [`scripts/ListCartoriosRestransmitirOe/listCartoriosRestransmitirOe.js`](../../scripts/ListCartoriosRestransmitirOe/listCartoriosRestransmitirOe.js)
- Lib: [`lib/onr_oficios.py`](../../lib/onr_oficios.py) · [`lib/onr_oficios.js`](../../lib/onr_oficios.js)
- Credenciais: variáveis globais `ONR_*`, `OFICIOS_*` (sem parâmetros extras além do hash)
- npm: `npm run list-cartorios-retransmitir-oe`

## Referências

- [`webservice/hash.md`](../hash.md)
- [`SetPedidoRetransmitidoOE.md`](SetPedidoRetransmitidoOE.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — § 3.5.17–3.5.18
