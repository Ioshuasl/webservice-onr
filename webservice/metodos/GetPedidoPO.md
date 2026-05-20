# GetPedidoPO

Método do WSOficio — **3.3 Penhora Online**.

## Resumo

| Campo | Valor |
|-------|-------|
| Tipo | Consulta |
| Módulo | 3.3 Penhora Online |
| Operação SOAP | `GetPedidoPO` |

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
| 4 | Chamar `GetPedidoPO` passando `Hash` + demais parâmetros |

Implementação: [`lib/onr_hash.py`](../../lib/onr_hash.py) · Helper: `resolve_auth_hash()` em [`lib/onr_acompanhamento.py`](../../lib/onr_acompanhamento.py).

Erros comuns: **45** (hash inválido), **46** (token já usado), **47** (expirado) — ver tabela em [`../hash.md`](../hash.md).

## Pré-requisitos e validações de negócio

- `PENHORA_ONLINE_ID_PEDIDO` definido.

## Ordem do envelope (`oRequest`)

Tipo `GetPedidoPO_WSReq` (ordem usada nos scripts):

1. `Hash`
2. `IDPedido`

## Parâmetros de entrada

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `Hash` | Hash de autenticação | string | sim | — | _(SHA-1)_ |
| `IDPedido` | Código do pedido | int | sim | — | 18014820 |

## Parâmetros de saída

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `RETORNO` | Sucesso | boolean | sim | — | true |
| `CODIGOERRO` | Código do erro | int | sim | — | 0 |
| `ERRODESCRICAO` | Descrição do erro | string | não | se RETORNO=false | — |
| `IDTipoPedido` | Tipo do pedido | int | sim | se RETORNO=true | ver [IDTipoPedido-PO](../tabelas-dominio/IDTipoPedido-PO.md) |
| `IDStatus` | Status do pedido | int | sim | se RETORNO=true | ver [IDStatus-PO](../tabelas-dominio/IDStatus-PO.md) |
| `_(+ demais campos)_` | Processo, protocolo, resposta, prenotação, … | — | não | conforme tipo | — |
## Códigos de erro (amostra)

| Código | Descrição |
|--------|-----------|
| 0 | Erro de sistema. |
| 10 | Request inválido. |
| 11 | O Hash de validação não foi informado. |
| 12 | O IDPedido informado é inválido. |
| 45 | Hash inválido. |
| 46 | Hash inválido: Hash já utilizado. |
| 47 | Hash inválido: Hash expirado. |
| 51 | Não foi possível verificar o tipo de pedido. |
| 52 | Não foi possível obter os dados do pedido de matrícula. |
| 53 | Não foi possível obter os dados do pedido de pessoa. |
| 54 | Não foi possível obter os dados do pedido de penhora. |
| 55 | Não foi possível obter o mandado/certidão. |
| 56 | Usuário não tem permissão para acessar o pedido informado. |
| 57 | O pedido informado não foi encontrado. |

## Implementação neste projeto

- Python: [`scripts/GetPedidoPo/getPedidoPo.py`](../../scripts/GetPedidoPo/getPedidoPo.py)
- JavaScript: [`scripts/GetPedidoPo/getPedidoPo.js`](../../scripts/GetPedidoPo/getPedidoPo.js)
- Variáveis `.env`: `PENHORA_ONLINE_ID_PEDIDO`
## Referências

- [`webservice/hash.md`](../hash.md) — geração do `Hash`
- [`webservice/list-metodos.md`](../list-metodos.md)
- [`webservice/tabelas-dominio/`](../tabelas-dominio/README.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — Envelope de Entrada/Saída `GetPedidoPO`
