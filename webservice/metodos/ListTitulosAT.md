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

## Pré-requisitos e validações de negócio

- Datas de protocolo obrigatórias no script (`ACOMPANHAMENTO_TITULOS_DATA_PROTOCOLO_*`, formato `aaaa-mm-dd`).
- Filtro [IDTipoStatus](../tabelas-dominio/IDTipoStatus-AT.md) (`-1` = todos).

## Ordem do envelope (`oRequest`)

Tipo `ListTitulosAT_WSReq` (ordem usada nos scripts):

1. `Hash`
2. `MaxRowPerPage`
3. `PageNumber`
4. `DataProtocoloInicio`
5. `DataProtocoloFinal`
6. `IDTipoStatus`
7. `Exportado`
8. `Protocolo?`
9. `Apresentante?`

## Parâmetros de entrada

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `Hash` | Hash de autenticação | string | sim | — | _(SHA-1)_ |
| `MaxRowPerPage` | Máximo de registros por página | int | sim | — | 50 |
| `PageNumber` | Número da página | int | sim | — | 1 |
| `DataProtocoloInicio` | Data inicial do protocolo | string | sim | — | 2025-01-01 |
| `DataProtocoloFinal` | Data final do protocolo | string | sim | — | 2025-12-31 |
| `IDTipoStatus` | Filtro por tipo de status | int | sim | ver [IDTipoStatus-AT](../tabelas-dominio/IDTipoStatus-AT.md) | -1 |
| `Exportado` | Filtro exportado | int | sim | — | 0 |
| `Protocolo` | Filtro por protocolo | string | não | omitido se vazio | 20250100001 |
| `Apresentante` | Filtro por apresentante | string | não | omitido se vazio | — |

## Parâmetros de saída

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `RETORNO` | Sucesso | boolean | sim | — | true |
| `CODIGOERRO` | Código do erro | int | sim | — | 0 |
| `ERRODESCRICAO` | Descrição do erro | string | não | se RETORNO=false | — |
| `QtdeRegistros` | Total de registros | int | sim | se RETORNO=true | 10 |
| `QtdePaginas` | Total de páginas | int | sim | se RETORNO=true | 1 |
| `Titulos` | Lista de títulos | ListTitulosAT_Titulos_WSResp[] | não | se RETORNO=true | — |
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

- **n8n webhook:** [`scripts/ListTitulosAt/List Titulos AT WebService ONR.md`](../../scripts/ListTitulosAt/List%20Titulos%20AT%20WebService%20ONR.md)

- Python: [`scripts/DeleteTituloAt/deleteTituloAt.py`](../../scripts/DeleteTituloAt/deleteTituloAt.py)
- JavaScript: [`scripts/DeleteTituloAt/deleteTituloAt.js`](../../scripts/DeleteTituloAt/deleteTituloAt.js)
- Variáveis `.env`: `ACOMPANHAMENTO_TITULOS_*`
## Referências

- [`webservice/hash.md`](../hash.md) — geração do `Hash`
- [`webservice/list-metodos.md`](../list-metodos.md)
- [`webservice/tabelas-dominio/`](../tabelas-dominio/README.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — Envelope de Entrada/Saída `ListTitulosAT`
