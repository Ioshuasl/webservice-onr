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

## Pré-requisitos e validações de negócio

- `ACOMPANHAMENTO_TITULOS_ID_TITULO` obrigatório.
- Filtro [IDTipoStatus](../tabelas-dominio/IDTipoStatus-AT.md) (`-1` = todos).

## Ordem do envelope (`oRequest`)

Tipo `ListStatusAT_WSReq` (ordem usada nos scripts):

1. `Hash`
2. `MaxRowPerPage`
3. `PageNumber`
4. `IDTitulo`
5. `IDTipoStatus`
6. `DataStatusInicio?`
7. `DataStatusFinal?`

## Parâmetros de entrada

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `Hash` | Hash de autenticação | string | sim | — | _(SHA-1)_ |
| `MaxRowPerPage` | Máximo por página | int | sim | — | 50 |
| `PageNumber` | Página | int | sim | — | 1 |
| `IDTitulo` | Título | int | sim | — | 1001 |
| `IDTipoStatus` | Filtro tipo de status | int | sim | ver [IDTipoStatus-AT](../tabelas-dominio/IDTipoStatus-AT.md) | -1 |
| `DataStatusInicio` | Data inicial do status | string | não | omitido se vazio | 2025-01-01 |
| `DataStatusFinal` | Data final do status | string | não | omitido se vazio | 2025-12-31 |

## Parâmetros de saída

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `RETORNO` | Sucesso | boolean | sim | — | true |
| `CODIGOERRO` | Código do erro | int | sim | — | 0 |
| `ERRODESCRICAO` | Descrição do erro | string | não | se RETORNO=false | — |
| `QtdeRegistros` | Total de registros | int | sim | se RETORNO=true | — |
| `QtdePaginas` | Total de páginas | int | sim | se RETORNO=true | — |
| `Status` | Lista de status | ListStatusAT_Status_WSResp[] | não | se RETORNO=true | — |
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

- Python: [`scripts/ListStatusAT/listStatusAt.py`](../../scripts/ListStatusAT/listStatusAt.py)
- JavaScript: [`scripts/ListStatusAT/listStatusAt.js`](../../scripts/ListStatusAT/listStatusAt.js)
- Variáveis `.env`: `ACOMPANHAMENTO_TITULOS_ID_TITULO`, datas opcionais
## Referências

- [`webservice/hash.md`](../hash.md) — geração do `Hash`
- [`webservice/list-metodos.md`](../list-metodos.md)
- [`webservice/tabelas-dominio/`](../tabelas-dominio/README.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — Envelope de Entrada/Saída `ListStatusAT`
