# ListTitulosAT

Método do WSOficio — **3.2 Acompanhamento de Títulos**.

## Resumo

| Campo | Valor |
|-------|-------|
| Tipo | Listagem |
| Módulo | 3.2 Acompanhamento de Títulos |
| Operação SOAP | `ListTitulosAT` |

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
| 4 | Chamar `ListTitulosAT` passando `Hash` + demais parâmetros |

Implementação: [`lib/onr_hash.py`](../../lib/onr_hash.py) · Helper: `resolve_auth_hash()` em [`lib/onr_acompanhamento.py`](../../lib/onr_acompanhamento.py).

Erros comuns: **45** (hash inválido), **46** (token já usado), **47** (expirado) — ver tabela em [`../hash.md`](../hash.md).

## Parâmetros de entrada

| Parâmetro | Descrição |
|-----------|-----------|
| `Hash` | Hash para validação da mensagem –  tipostring(50); |
| `MaxRowPerPage` | Quantidade máxima de registros a serem retornados por página –  tipoint; |
| `PageNumber` | Página a ser retornada –  tipoint; |
| `Protocolo` | Protocolo a ser filtrado – opcional –  tipostring(11); |
| `DataProtocoloInicio` | Data inicial a ser filtrada, formato: aaaa-mm-dd – tipo string(10); |
| `DataProtocoloFinal` | Data final a ser filtrada, formato: aaaa-mm-dd – tipo string(10); |
| `IDTipoStatus` | Código do tipo de status a ser filtrado – tipo int. Valores possíveis: |
| `Exportado` | Filtra por pedidos exportados – tipo int. Valores possíveis: |
| `Apresentante` | Nome do apresentante a ser filtrado – opcional – tipo string(120). |

## Parâmetros de saída

| Parâmetro | Descrição |
|-----------|-----------|
| `RETORNO` | Indica se houve erro ou não na execução do método – tipo boolean; |
| `CODIGOERRO` | (se RETORNO = false) Código do erro – tipo int; |
| `ERRODESCRICAO` | (se RETORNO = false) Descrição do erro – tipo string(200); |
| `QtdeRegistros` | (se RETORNO = true)  Quantidade total de registros encontrados – tipo int; |
| `QtdePaginas` | (se RETORNO = true)  Quantidade total de páginas, de acordo com o total de registros encontrados e com a quantidade máxima de registros por página que foi informada no envelope de entrada - MaxRowPerPage – tipo int; |
| `IDTitulo` | Código do título – tipo int; |
| `Apresentante` | Nome do apresentante – tipo string(120); |
| `Protocolo` | Protocolo do título – tipo string(11); |
| `DataUltimoStatus` | Data do último status cadastrado, formato: aaaa-mm-ddhh:mm:ss – tipo string(10); |
| `IDStatus` | Código do cadastro de status – tipo int; |
| `IDTipoStatus` | Código do tipo de status – verificar tipos possíveis no item 3.2.1 – tipo int. |

## Códigos de erro (amostra)

| Código | Descrição |
|--------|-----------|
| 0 | Erro de sistema. |
| 10 | Request inválido. |
| 11 | O Hash de validação não foi informado. |
| 12 | A quantidade de registros por página informada é inválida. A quantidade mínima permitida é 10. |
| 13 | A página informada é inválida. |
| 14 | A data inicial não foi informada. Campo obrigatório. |
| 15 | A data final não foi informada. Campo obrigatório. |
| 16 | A data inicial informada é inválida. |
| 17 | A data final informada é inválida. |
| 18 | O código do tipo de status informado é inválido. |
| 19 | O valor informado para Exportado é inválido. |
| 20 | O protocolo informado é inválido. Informe apenas números. |
| 21 | A página informada é inválida. Página máxima possível: [PAGINA] |
| 22 | A data final deve ser maior que a data inicial. |
| 45 | Hash inválido. |
| … | _+2 códigos na especificação_ |

## Implementação neste projeto

- Script: [`scripts/DeleteTituloAt/deleteTituloAt.py`](../../scripts/DeleteTituloAt/deleteTituloAt.py)

## Referências

- [`webservice/hash.md`](../hash.md) — geração do `Hash`
- [`webservice/list-metodos.md`](../list-metodos.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — Envelope de Entrada/Saída `ListTitulosAT`
