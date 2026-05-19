# ListStatusAT

Método do WSOficio — **3.2 Acompanhamento de Títulos**.

## Resumo

| Campo | Valor |
|-------|-------|
| Tipo | Listagem |
| Módulo | 3.2 Acompanhamento de Títulos |
| Operação SOAP | `ListStatusAT` |

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
| 4 | Chamar `ListStatusAT` passando `Hash` + demais parâmetros |

Implementação: [`lib/onr_hash.py`](../../lib/onr_hash.py) · Helper: `resolve_auth_hash()` em [`lib/onr_acompanhamento.py`](../../lib/onr_acompanhamento.py).

Erros comuns: **45** (hash inválido), **46** (token já usado), **47** (expirado) — ver tabela em [`../hash.md`](../hash.md).

## Parâmetros de entrada

| Parâmetro | Descrição |
|-----------|-----------|
| `Hash` | Hash para validação da mensagem – tipo string(50); |
| `MaxRowPerPage` | Quantidade máxima de registros a serem retornados por página – tipo int; |
| `PageNumber` | Página a ser retornada – tipo int; |
| `IDTitulo` | Código do título dos status a serem retornados – tipo int; |
| `DataStatusInicio` | Data inicial a ser filtrada, formato: aaaa-mm-dd – opcional – tipo string(10); |
| `DataStatusFinal` | Data final a ser filtrada, formato: aaaa-mm-dd – opcional – tipo string(10); |
| `IDTipoStatus` | Código do tipo de status a ser filtrado - verificar tipos possíveis no item 3.2.1 – tipo int. |

## Parâmetros de saída

| Parâmetro | Descrição |
|-----------|-----------|
| `RETORNO` | Indica se houve erro ou não na execução do método – tipo boolean; |
| `CODIGOERRO` | (se RETORNO = false) Código do erro – tipo int; |
| `ERRODESCRICAO` | (se RETORNO = false) Descrição do erro – tipo string(200); |
| `QtdeRegistros` | (se RETORNO = true) Quantidade total de registros encontrados – tipo int; |
| `QtdePaginas` | (se RETORNO = true) Quantidade total de páginas, de acordo com o total de registros encontrados e com a quantidade máxima de registros por página que foi informada no envelope de entrada - MaxRowPerPage – tipo int; |
| `IDTitulo` | (se RETORNO = true) Código do título – tipo int; |
| `IDCartorio` | (se RETORNO = true) Código do cartório – tipo int; |
| `Protocolo` | (se RETORNO = true) Protocolo do título – tipo string(11); |
| `ApresentanteNome` | (se RETORNO = true) Nome do apresentante – tipo string(120); |
| `IDStatus` | Código do status – tipo int; |
| `IDTipoStatus` | Código do tipo de status – verificar tipos possíveis no item 3.2.1 – tipo int; |
| `DataStatus` | Data do status, formato: aaaa-mm-ddhh:mm:ss – tipo string(19); |

## Códigos de erro (amostra)

| Código | Descrição |
|--------|-----------|
| 0 | Erro de sistema. |
| 10 | Request inválido. |
| 11 | O Hash de validação não foi informado. |
| 12 | A quantidade de registros por página informada é inválida. A quantidade mínima permitida é 10. |
| 13 | A página informada é inválida. |
| 14 | O código do título informado é inválido. |
| 15 | A data inicial informada é inválida. |
| 16 | A data final informada é inválida. |
| 17 | O código do tipo de status informado é inválido. |
| 18 | A data final deve ser maior que a data inicial. |
| 25 | A página informada é inválida. Página máxima possível: [PAGINA] |
| 45 | Hash inválido. |
| 46 | Hash inválido: Hash já utilizado. |
| 47 | Hash inválido: Hash expirado. |
| 50 | Usuário não tem permissão para acessar a lista de status do título informado. |

## Implementação neste projeto

- Script: [`scripts/ListStatusAT/listStatusAt.py`](../../scripts/ListStatusAT/listStatusAt.py)

## Referências

- [`webservice/hash.md`](../hash.md) — geração do `Hash`
- [`webservice/list-metodos.md`](../list-metodos.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — Envelope de Entrada/Saída `ListStatusAT`
