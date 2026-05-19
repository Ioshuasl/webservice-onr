# GetEmolumentosIN

Método do WSOficio — **3.11 Intimações**.

## Resumo

| Campo | Valor |
|-------|-------|
| Tipo | Consulta |
| Módulo | 3.11 Intimações |
| Operação SOAP | `GetEmolumentosIN` |

## Serviço

- **WSDL (homologação):** `https://hml3-wsoficio.onr.org.br/intimacoes.asmx?wsdl`
- **Endpoint:** `https://hml3-wsoficio.onr.org.br/intimacoes.asmx`
- **WSDL local:** `wsdl/intimacoes.wsdl`

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
| 4 | Chamar `GetEmolumentosIN` passando `Hash` + demais parâmetros |

Implementação: [`lib/onr_hash.py`](../../lib/onr_hash.py) · Helper: `resolve_auth_hash()` em [`lib/onr_acompanhamento.py`](../../lib/onr_acompanhamento.py).

Erros comuns: **45** (hash inválido), **46** (token já usado), **47** (expirado) — ver tabela em [`../hash.md`](../hash.md).

## Parâmetros de entrada

| Parâmetro | Descrição |
|-----------|-----------|
| `Hash` | Hash para validação da mensagem (tipo string(50)); |
| `IDPedido` | Código do pedido de intimação (tipo int). |

## Parâmetros de saída

| Parâmetro | Descrição |
|-----------|-----------|
| `RETORNO` | Indica se houve erro ou não na execução do método (tipo boolean); |
| `CODIGOERRO` | (se RETORNO = false) Código do erro (tipo int); |
| `ERRODESCRICAO` | (se RETORNO = false) Descrição do erro (tipo string(200)); |
| `Emolumentos` | (se RETORNO = true) Array de emolumentos, onde: |
| `IDEmolumento` | ID do registro correspondente ao emolumento (tipo int); |
| `Data` | Data de inclusão do emolumento, formato aaaa-mm-ddhh:mm:ss (tipo string); |
| `ProtocoloPagamento` | Protocolo de identificação do pagamento gerado (tipo string(12)); |
| `Status` | Descrição do tipo de status de emolumentos das custas (tipo string(150)); |
| `Descricao` | Descrição dos emolumentos pelo usuário (tipo string(150)); |
| `Valor` | Valor do emolumento cadastrada, no formato XX.XX (tipo decimal); |
| `Pago` | Retorna TRUE ou FALSE para identificar se já foi identificado pagamento para a cobrança gerada (tipo booleano); |
| `DataCompensacao` | O valor do campo será vazio pois ele foi direcionado para o método ListPagamentosIN(); |
| `DataRepasse` | O valor do campo será vazio pois ele foi direcionado para o método ListPagamentosIN(). |

## Códigos de erro (amostra)

| Código | Descrição |
|--------|-----------|
| 0 | Erro de sistema. |
| 10 | Request inválido. |
| 11 | O Hash de validação não foi informado. |
| 12 | O código informado para o pedido não é válido. |
| 45 | Hash inválido. |
| 46 | Hash inválido: Hash já utilizado. |
| 47 | Hash inválido: Hash expirado. |
| 51 | Não foi possível obter os dados do pedido de intimação solicitado. |
| 52 | O pedido da mensagem solicitada não pertence ao cartório do usuário autenticado. |
| 53 | Não foi possível obter as custas do pedido. |
| 54 | Não foi possível obter os dados do cartório. |
| 0 | Erro de sistema. |
| 10 | Request inválido. |
| 11 | O Hash de validação não foi informado. |
| 12 | O código informado para a intimação não é válido. |
| … | _+7 códigos na especificação_ |

## Implementação neste projeto

- Script: _(ainda não implementado)_

## Referências

- [`webservice/hash.md`](../hash.md) — geração do `Hash`
- [`webservice/list-metodos.md`](../list-metodos.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — Envelope de Entrada/Saída `GetEmolumentosIN`
