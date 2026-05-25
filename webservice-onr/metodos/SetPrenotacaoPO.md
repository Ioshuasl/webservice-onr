# SetPrenotacaoPO

Método do WSOficio — **3.3 Penhora Online**.

## Resumo

| Campo | Valor |
|-------|-------|
| Tipo | Atualização / comando |
| Módulo | 3.3 Penhora Online |
| Operação SOAP | `SetPrenotacaoPO` |

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
| 4 | Chamar `SetPrenotacaoPO` passando `Hash` + demais parâmetros |

Implementação: [`lib/onr_hash.py`](../../lib/onr_hash.py) · Helper: `resolve_auth_hash()` em [`lib/onr_acompanhamento.py`](../../lib/onr_acompanhamento.py).

Erros comuns: **45** (hash inválido), **46** (token já usado), **47** (expirado) — ver tabela em [`../hash.md`](../hash.md).

## Pré-requisitos e validações de negócio

- **[IDTipoPedido = 3](../tabelas-dominio/IDTipoPedido-PO.md)** (Penhora) — erro **53**.
- Datas `aaaa-mm-dd` em `DATA_PRENOTACAO` / `DATA_VENCIMENTO`.

## Ordem do envelope (`oRequest`)

Tipo `SetPrenotacaoPO_WSReq` (ordem usada nos scripts):

1. `Hash`
2. `IDPedido`
3. `NumeroPrenotacao`
4. `DataPrenotacao`
5. `DataVencimento`

## Parâmetros de entrada

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `Hash` | Hash de autenticação | string | sim | — | _(SHA-1)_ |
| `IDPedido` | Pedido penhora | int | sim | IDTipoPedido=3 | 18014820 |
| `NumeroPrenotacao` | Número da prenotação | string | sim | — | 1516 |
| `DataPrenotacao` | Data da prenotação | string | sim | aaaa-mm-dd | 2025-01-09 |
| `DataVencimento` | Vencimento da prenotação | string | sim | aaaa-mm-dd | 2025-02-09 |

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
| 13 | O número da prenotação não foi informado. |
| 14 | A data da prenotação não foi informada. |
| 15 | A data da prenotação é inválida. |

## Implementação neste projeto

- Python: [`scripts/SetCustasPo/setCustasPo.py`](../../scripts/SetCustasPo/setCustasPo.py)
- JavaScript: [`scripts/SetCustasPo/setCustasPo.js`](../../scripts/SetCustasPo/setCustasPo.js)
- Variáveis `.env`: `PENHORA_ONLINE_SET_PRENOTACAO_*`
## Referências

- [`webservice/hash.md`](../hash.md) — geração do `Hash`
- [`webservice/list-metodos.md`](../list-metodos.md)
- [`webservice/tabelas-dominio/`](../tabelas-dominio/README.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — Envelope de Entrada/Saída `SetPrenotacaoPO`
