# LoginUsuarioCertificado

Método do WSOficio — **3.1 Login**.

## Resumo

| Campo | Valor |
|-------|-------|
| Tipo | Autenticação |
| Módulo | 3.1 Login |
| Operação SOAP | `LoginUsuarioCertificado` |

## Serviço

- **WSDL (homologação):** `https://hml3-wsoficio.onr.org.br/login.asmx?wsdl`
- **Endpoint:** `https://hml3-wsoficio.onr.org.br/login.asmx`
- **WSDL local:** `wsdl/login.wsdl`

## Hash de autenticação

Este método **não envia** `Hash`. Ele **retorna tokens** usados no cálculo das demais operações. Ver fluxo completo em [`../hash.md`](../hash.md).

1. Autenticar com certificado digital (`SUBJECTCN`, `ISSUERO`, `PUBLICKEY`, `SERIALNUMBER`, `VALIDUNTIL`, `CPF`, `EMAIL`, `IDParceiroWS`).
2. Ler `Tokens[]` da resposta (strings de 6 caracteres, uso único, validade 8 h).
3. Para cada operação posterior: `Hash = SHA1_UTF8_HEX_UPPER(ONR_SERVENTIA_CHAVE + token)` — ver [`../hash.md`](../hash.md).

## Pré-requisitos e validações de negócio

- Certificado PFX válido (`CERT_PATH`, `CERT_PASSWORD`) e `ONR_SERVENTIA_ID` correspondente ao parceiro.
- Não usa `Hash`; retorna `Tokens[]` para as demais operações.

## Ordem do envelope (`oRequest`)

Tipo `LoginUsuarioCertificado_WSReq` (ordem usada nos scripts):

1. `SUBJECTCN`
2. `ISSUERO`
3. `PUBLICKEY`
4. `SERIALNUMBER`
5. `VALIDUNTIL`
6. `CPF`
7. `EMAIL`
8. `IDParceiroWS`

## Parâmetros de entrada

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `SUBJECTCN` | Subject CN do certificado | string | sim | — | _(do PFX)_ |
| `ISSUERO` | Emissor do certificado | string | sim | — | _(do PFX)_ |
| `PUBLICKEY` | Chave pública do certificado | string | sim | — | _(base64 DER)_ |
| `SERIALNUMBER` | Número de série do certificado | string | sim | — | _(do PFX)_ |
| `VALIDUNTIL` | Validade do certificado | string | sim | — | _(ISO ou epoch)_ |
| `CPF` | CPF do usuário | string(11) | sim | — | 12345678901 |
| `EMAIL` | E-mail do usuário | string | sim | — | usuario@cartorio.org |
| `IDParceiroWS` | ID da serventia/parceiro | int | sim | — | 12345 |

## Parâmetros de saída

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `RETORNO` | Sucesso da operação | boolean | sim | — | true |
| `CODIGOERRO` | Código do erro | int | sim | — | 0 |
| `ERRODESCRICAO` | Descrição do erro | string | não | se RETORNO=false | — |
| `Tokens` | Tokens de uso único (6 caracteres) | string[] | sim | se RETORNO=true | `["ABC123", ...]` |
## Códigos de erro (amostra)

| Código | Descrição |
|--------|-----------|
| 0 | Erro de sistema. |
| 1 | Não foi possível gerar os tokens. |
| 2 | Request inválido. |
| 10 | O SUBJECTCN não foi informado. |
| 11 | O ISSUERO não foi informado. |
| 12 | O PUBLICKEY não foi informado. |
| 13 | O SERIALNUMBER não foi informado. |
| 14 | O VALIDUNTIL não foi informado. |
| 15 | O CPF não foi informado. |
| 16 | O EMAIL não foi informado. |
| 17 | O IDParceiroWS informado é inválido. |
| 51 | Usuário não encontrado. |
| 52 | O departamento ou instituição do usuário não estão ativados. |
| 53 | Usuário não está ativo. |

## Implementação neste projeto

- Python: [`scripts/login/login_onr.py`](../../scripts/login/login_onr.py)
- JavaScript: [`scripts/login/login_onr.js`](../../scripts/login/login_onr.js)
- npm: `npm run login`
- Extrai campos do PFX via `lib/cert_extract`
## Referências

- [`webservice/hash.md`](../hash.md) — geração do `Hash`
- [`webservice/list-metodos.md`](../list-metodos.md)
- [`webservice/tabelas-dominio/`](../tabelas-dominio/README.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — Envelope de Entrada/Saída `LoginUsuarioCertificado`
