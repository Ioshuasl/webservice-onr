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

## Pré-requisitos e validações de negócio

- Envelope na ordem WSDL; opcionais omitidos podem falhar (.NET).
- [IDTipoStatus](../tabelas-dominio/IDTipoStatus-AT.md) válido para o título.

## Ordem do envelope (`oRequest`)

Tipo `InsertStatusAT_WSReq` (ordem usada nos scripts):

1. `Hash`
2. `IDTitulo`
3. `IDTipoStatus`
4. `DataStatus`
5. `DescricaoStatus`

## Parâmetros de entrada

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `Hash` | Hash de autenticação | string | sim | — | _(SHA-1)_ |
| `IDTitulo` | Título | int | sim | — | 1001 |
| `IDTipoStatus` | Tipo de status | int | sim | ver [IDTipoStatus-AT](../tabelas-dominio/IDTipoStatus-AT.md) | 7 |
| `DataStatus` | Data do status | string | sim | — | 2025-05-19 10:00:00 |
| `DescricaoStatus` | Descrição | string | sim | — | Nota de exigência |

## Parâmetros de saída

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `RETORNO` | Sucesso | boolean | sim | — | true |
| `CODIGOERRO` | Código do erro | int | sim | — | 0 |
| `ERRODESCRICAO` | Descrição do erro | string | não | se RETORNO=false | — |
| `IDStatus` | ID do status criado | int | sim | se RETORNO=true | 5001 |
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

- Python: [`scripts/InsertStatusAt/insertStatusAt.py`](../../scripts/InsertStatusAt/insertStatusAt.py)
- JavaScript: [`scripts/InsertStatusAt/insertStatusAt.js`](../../scripts/InsertStatusAt/insertStatusAt.js)
- Variáveis `.env`: `ACOMPANHAMENTO_TITULOS_INSERT_STATUS_*`
- Helper: `lib/onr_insert_status_at`
## Referências

- [`webservice/hash.md`](../hash.md) — geração do `Hash`
- [`webservice/list-metodos.md`](../list-metodos.md)
- [`webservice/tabelas-dominio/`](../tabelas-dominio/README.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — Envelope de Entrada/Saída `InsertStatusAT`
