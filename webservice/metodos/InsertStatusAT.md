# InsertStatusAT

Método do WSOficio — **3.2 Acompanhamento de Títulos**.

## Resumo

| Campo | Valor |
|-------|-------|
| Tipo | Inclusão |
| Módulo | 3.2 Acompanhamento de Títulos |
| Operação SOAP | `InsertStatusAT` |

## Serviço

- **WSDL (homologação):** `https://hml3-wsoficio.onr.org.br/acompanhamentotitulos.asmx?wsdl`
- **Endpoint:** `https://hml3-wsoficio.onr.org.br/acompanhamentotitulos.asmx`
- **WSDL local:** `wsdl/acompanhamentotitulos.wsdl`

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
| 4 | Chamar `InsertStatusAT` passando `Hash` + demais parâmetros |

Implementação: [`lib/onr_hash.py`](../../lib/onr_hash.py) · Helper: `resolve_auth_hash()` em [`lib/onr_acompanhamento.py`](../../lib/onr_acompanhamento.py).

Erros comuns: **45** (hash inválido), **46** (token já usado), **47** (expirado) — ver tabela em [`../hash.md`](../hash.md).

## Parâmetros de entrada

| Parâmetro | Descrição |
|-----------|-----------|
| `Hash` | Hash para validação da mensagem – tipo string(50); |
| `IDTitulo` | Código do título no Ofício Eletrônico. Código obtido no momento do cadastro do título, ver item 3.2.10 – tipo int; |
| `IDTipoStatus` | Código do tipo de status – verificar tipos permitidos no item 3.2.1 – tipo int; |
| `DataStatus` | Data do Status. Formato: aaaa-mm-ddhh:mm:ss – tipo string(19); |
| `DescricaoStatus` | Descrição do status (obs.: A nota de devolução deve ser informada nesse campo)  – tipo text. |

## Parâmetros de saída

| Parâmetro | Descrição |
|-----------|-----------|
| `RETORNO` | Indica se houve erro ou não na execução do método – tipo boolean; |
| `CODIGOERRO` | (se RETORNO = false) Código do erro – tipo int; |
| `ERRODESCRICAO` | (se RETORNO = false) Descrição do erro – tipo string(200); |
| `IDStatus` | (se RETORNO = true)  Código do status cadastrado – tipo int. |

## Códigos de erro (amostra)

| Código | Descrição |
|--------|-----------|
| 0 | Erro de sistema. |
| 10 | Request inválido. |
| 11 | O Hash de validação não foi informado. |
| 12 | O código do título informado é inválido. |
| 13 | O código do tipo de status informado é inválido. |
| 14 | A data do status não foi informada. |
| 15 | A data do status é inválida. |
| 16 | A data do status é inválida. Não pode ser anterior a 01/01/2011. |
| 17 | A descrição não foi informada. |
| 30 | Não foi possível pegar os dados do título. |
| 31 | Apenas usuários de cartórios podem cadastrar status. |
| 32 | O usuário não tem permissão para cadastrar status para esse título. |
| 45 | Hash inválido. |
| 46 | Hash inválido: Hash já utilizado. |
| 47 | Hash inválido: Hash expirado. |
| … | _+2 códigos na especificação_ |

## Implementação neste projeto

- Script: [`scripts/InsertStatusAt/insertStatusAt.py`](../../scripts/InsertStatusAt/insertStatusAt.py)

## Referências

- [`webservice/hash.md`](../hash.md) — geração do `Hash`
- [`webservice/list-metodos.md`](../list-metodos.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — Envelope de Entrada/Saída `InsertStatusAT`
