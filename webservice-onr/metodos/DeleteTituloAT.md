# DeleteTituloAT

Método do WSOficio — **3.2 Acompanhamento de Títulos**.

## Resumo

| Campo | Valor |
|-------|-------|
| Tipo | Exclusão |
| Módulo | 3.2 Acompanhamento de Títulos |
| Operação SOAP | `DeleteTituloAT` |

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
| 4 | Chamar `DeleteTituloAT` passando `Hash` + demais parâmetros |

Implementação: [`lib/onr_hash.py`](../../lib/onr_hash.py) · Helper: `resolve_auth_hash()` em [`lib/onr_acompanhamento.py`](../../lib/onr_acompanhamento.py).

Erros comuns: **45** (hash inválido), **46** (token já usado), **47** (expirado) — ver tabela em [`../hash.md`](../hash.md).

## Pré-requisitos e validações de negócio

- Título existente e permissão de exclusão.

## Ordem do envelope (`oRequest`)

Tipo `DeleteTituloAT_WSReq` (ordem usada nos scripts):

1. `Hash`
2. `IDTitulo`

## Parâmetros de entrada

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `Hash` | Hash de autenticação | string | sim | — | _(SHA-1)_ |
| `IDTitulo` | Título a excluir | int | sim | — | 1001 |

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
| 12 | O IDTitulo informado é inválido. |
| 45 | Hash inválido. |
| 46 | Hash inválido: Hash já utilizado. |
| 47 | Hash inválido: Hash expirado. |
| 30 | Não foi possível pegar os dados do título. |
| 50 | Usuário não tem permissão para excluir o título informado. |

## Implementação neste projeto

- Python: [`scripts/DeleteTituloAt/deleteTituloAt.py`](../../scripts/DeleteTituloAt/deleteTituloAt.py)
- JavaScript: [`scripts/DeleteTituloAt/deleteTituloAt.js`](../../scripts/DeleteTituloAt/deleteTituloAt.js)
- Variáveis `.env`: `DELETE_ID_TITULO` ou `ACOMPANHAMENTO_TITULOS_ID_TITULO`
## Referências

- [`webservice/hash.md`](../hash.md) — geração do `Hash`
- [`webservice/list-metodos.md`](../list-metodos.md)
- [`webservice/tabelas-dominio/`](../tabelas-dominio/README.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — Envelope de Entrada/Saída `DeleteTituloAT`
