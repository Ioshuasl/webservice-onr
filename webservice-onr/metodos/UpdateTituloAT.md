# UpdateTituloAT

Método do WSOficio — **3.2 Acompanhamento de Títulos**.

## Resumo

| Campo | Valor |
|-------|-------|
| Tipo | Alteração |
| Módulo | 3.2 Acompanhamento de Títulos |
| Operação SOAP | `UpdateTituloAT` |

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
| 4 | Chamar `UpdateTituloAT` passando `Hash` + demais parâmetros |

Implementação: [`lib/onr_hash.py`](../../lib/onr_hash.py) · Helper: `resolve_auth_hash()` em [`lib/onr_acompanhamento.py`](../../lib/onr_acompanhamento.py).

Erros comuns: **45** (hash inválido), **46** (token já usado), **47** (expirado) — ver tabela em [`../hash.md`](../hash.md).

## Pré-requisitos e validações de negócio

- Mesmas regras de envelope que `InsertTituloAT` (ordem WSDL + opcionais `""`).
- Requer `IDTitulo` existente.

## Ordem do envelope (`oRequest`)

Tipo `UpdateTituloAT_WSReq` (ordem usada nos scripts):

1. `Hash`
2. `IDTitulo`
3. `… (mesmos campos de InsertTituloAT)`

## Parâmetros de entrada

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `Hash` | Hash de autenticação | string | sim | — | _(SHA-1)_ |
| `IDTitulo` | Título a alterar | int | sim | — | 1001 |
| `_(demais campos)_` | Igual InsertTituloAT — ver `lib/onr_update_titulo_at` | — | sim | — | — |

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
| 12 | O código do título informado é inválido. |
| 13 | O nome do apresentante não foi informado. |
| 14 | O CPF/CNPJ do apresentante é inválido. |
| 15 | O nome do interessado não foi informado. |
| 16 | O CPF/CNPJ do interessado é inválido. |
| 17 | A natureza do título não foi informada. |
| 18 | O modo de notificação não foi informado. |
| 19 | O e-mail do apresentante não foi informado. |
| 20 | O telefone do apresentante não foi informado. |
| 21 | A data do protocolo não foi informada. |
| 22 | A data do protocolo é inválida. |
| 23 | A data do protocolo é inválida. Não pode ser anterior |

## Implementação neste projeto

- Python: [`scripts/UpdateTituloAt/updateTituloAt.py`](../../scripts/UpdateTituloAt/updateTituloAt.py)
- JavaScript: [`scripts/UpdateTituloAt/updateTituloAt.js`](../../scripts/UpdateTituloAt/updateTituloAt.js)
- Variáveis `.env`: `ACOMPANHAMENTO_TITULOS_UPDATE_*`
- Helper: `lib/onr_update_titulo_at`
## Referências

- [`webservice/hash.md`](../hash.md) — geração do `Hash`
- [`webservice/list-metodos.md`](../list-metodos.md)
- [`webservice/tabelas-dominio/`](../tabelas-dominio/README.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — Envelope de Entrada/Saída `UpdateTituloAT`
