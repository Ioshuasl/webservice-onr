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

## Parâmetros de entrada

| Parâmetro | Descrição |
|-----------|-----------|
| `SUBJECTCN` | Valor SUBJECTCN do certificado do usuário (tipo string(100)); |
| `ISSUERO` | Valor ISSUERO do certificado do usuário (tipo string(10)); |
| `PUBLICKEY` | Valor PUBLICKEY do certificado do usuário (tipo string(1000)); |
| `SERIALNUMBER` | Valor SERIALNUMBER do certificado do usuário (tipo string(100)); |
| `VALIDUNTIL` | Valor VALIDUNTIL do certificado do usuário (tipo string); |
| `CPF` | CPF do usuário (tipo string(11)); |
| `EMAIL` | E-mail do usuário (tipo string(100)); |
| `IDParceiroWS` | Código do parceiro para utilização do sistema de Web Services (tipo int). Esse código deve ser solicitado previamente à ao ONR, assim como a chave para geração de hash. |

## Parâmetros de saída

| Parâmetro | Descrição |
|-----------|-----------|
| `RETORNO` | Indica se houve erro ou não na execução do método (tipo boolean); |
| `CODIGOERRO` | (se RETORNO = false) Código do erro (tipo int); |
| `ERRODESCRICAO` | (se RETORNO = false) Descrição do erro (tipo string(200)); |
| `IDUsuario` | (se RETORNO = true)  Código do usuário no Ofício Eletrônico (tipo int); |
| `IDInstituicao` | (se RETORNO = true)  Código da Instituição/Cartório no Ofício Eletrônico (tipo int); |
| `Ativo` | (se retorno = true) Indica se cliente está ativo ou não (tipo boolean); |
| `Tokens` | (se retorno = true) Tokens gerados (array de strings(6)). |

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

- Script: [`scripts/login/login_onr.py`](../../scripts/login/login_onr.py)

## Referências

- [`webservice/hash.md`](../hash.md) — geração do `Hash`
- [`webservice/list-metodos.md`](../list-metodos.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — Envelope de Entrada/Saída `LoginUsuarioCertificado`
