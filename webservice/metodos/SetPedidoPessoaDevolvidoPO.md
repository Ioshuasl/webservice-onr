# SetPedidoPessoaDevolvidoPO

Método do WSOficio — **3.3 Penhora Online**.

## Resumo

| Campo | Valor |
|-------|-------|
| Tipo | Atualização / comando |
| Módulo | 3.3 Penhora Online |
| Operação SOAP | `SetPedidoPessoaDevolvidoPO` |

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
| 4 | Chamar `SetPedidoPessoaDevolvidoPO` passando `Hash` + demais parâmetros |

Implementação: [`lib/onr_hash.py`](../../lib/onr_hash.py) · Helper: `resolve_auth_hash()` em [`lib/onr_penhora_online.py`](../../lib/onr_penhora_online.py).

Erros comuns: **45** (hash inválido), **46** (token já usado), **47** (expirado) — ver tabela em [`../hash.md`](../hash.md).

## Pré-requisitos e validações de negócio

- **[IDTipoPedido = 2](../tabelas-dominio/IDTipoPedido-PO.md)** (Certidão por Pessoa) — mesma família que `SetPedidoPessoaRespondidoPO`.
- Informar texto em `Resposta` (motivo da devolução).

## Ordem do envelope (`oRequest`)

Tipo `SetPedidoPessoaDevolvidoPO_WSReq` (`wsdl/penhoraonline.wsdl`):

1. `Hash`
2. `IDPedido`
3. `Resposta`

## Parâmetros de entrada

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `Hash` | Hash de autenticação | string | sim | — | _(SHA-1)_ |
| `IDPedido` | Código do pedido pessoa | int | sim | IDTipoPedido=2 | 12345 |
| `Resposta` | Motivo da devolução | string | sim | — | Documentação incompleta |

## Parâmetros de saída

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `RETORNO` | Sucesso | boolean | sim | — | true |
| `CODIGOERRO` | Código do erro | int | sim | — | 0 |
| `ERRODESCRICAO` | Descrição do erro | string | não | se RETORNO=false | — |

## Códigos de erro (amostra)

| Código | Descrição |
|--------|-----------|
| 0 | Erro de sistema. |
| 10 | Request inválido. |
| 11 | O Hash de validação não foi informado. |
| 12 | O IDPedido informado é inválido. |
| 13 | A Resposta não foi informada. |
| 45 | Hash inválido. |
| 46 | Hash inválido: Hash já utilizado. |
| 47 | Hash inválido: Hash expirado. |

## Implementação neste projeto

- Python: [`scripts/SetPedidoPessoaDevolvidoPo/setPedidoPessoaDevolvidoPo.py`](../../scripts/SetPedidoPessoaDevolvidoPo/setPedidoPessoaDevolvidoPo.py)
- JavaScript: [`scripts/SetPedidoPessoaDevolvidoPo/setPedidoPessoaDevolvidoPo.js`](../../scripts/SetPedidoPessoaDevolvidoPo/setPedidoPessoaDevolvidoPo.js)
- Variáveis `.env`: `PENHORA_ONLINE_SET_PEDIDO_PESSOA_DEVOLVIDO_*` (fallback `PENHORA_ONLINE_ID_PEDIDO`)
- npm: `npm run set-pedido-pessoa-devolvido-po`

## Referências

- [`webservice/hash.md`](../hash.md) — geração do `Hash`
- [`webservice/list-metodos.md`](../list-metodos.md)
- [`webservice/tabelas-dominio/`](../tabelas-dominio/README.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — Envelope de Entrada/Saída `SetPedidoPessoaDevolvidoPO`
