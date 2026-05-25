# ListDocumentosRepositorioAC

Método do WSOficio — **3.10 E-Protocolo**.

## Resumo

| Campo | Valor |
|-------|-------|
| Tipo | Listagem |
| Módulo | 3.10 E-Protocolo |
| Operação SOAP | `ListDocumentosRepositorioAC` |

## Serviço

- **WSDL (homologação):** `https://hml3-wsoficio.onr.org.br/eprotocolo.asmx?wsdl`
- **Endpoint:** `https://hml3-wsoficio.onr.org.br/eprotocolo.asmx`
- **WSDL local:** `wsdl/eprotocolo.wsdl`

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
| 4 | Chamar `ListDocumentosRepositorioAC` passando `Hash` + demais parâmetros |

Implementação: [`lib/onr_hash.py`](../../lib/onr_hash.py) · Helper: `resolve_auth_hash()` em [`lib/onr_acompanhamento.py`](../../lib/onr_acompanhamento.py).

Erros comuns: **45** (hash inválido), **46** (token já usado), **47** (expirado) — ver tabela em [`../hash.md`](../hash.md).

## Pré-requisitos e validações de negócio

_Documentar regras de negócio (ex.: IDTipoPedido, IDStatus) e linkar [`webservice/tabelas-dominio/`](../tabelas-dominio/README.md)._

## Ordem do envelope (`oRequest`)

_Listar campos na ordem de `<ListDocumentosRepositorioAC_WSReq>` no WSDL local._

## Parâmetros de entrada

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `Hash` | Hash para validação da mensagem | string(50 | — | — | — |
| — | IDContrato - ID do contrato obtido da listagem de pedidos | int | — | — | — |
| — | IDDepartamento - ID do departamento vinculado ao documento do repositório (opcional, tipo int); | — | não | — | — |
| — | CPFVinculado - CPF vinculado ao documento do repositório (opcional, tipo string); | — | não | — | — |
| — | DataVencimentoInicial - Data de vencimento inicial do documento do repositório, no formato aaaamm-dd (opcional, tipo string); | — | não | — | — |
| — | DataVencimentoFinal - Data de vencimento final do documento do repositório, no formato aaaamm-dd (opcional, tipo string). | — | não | — | — |

> _Gerado da spec: revisar colunas Obrigatório, Condicional e Exemplo com WSDL + [`TEMPLATE.md`](TEMPLATE.md)._

## Parâmetros de saída

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `RETORNO` | Indica se houve erro ou não na execução do método | boolean | — | — | — |
| `CODIGOERRO` | Código do erro | int | — | (se RETORNO = false) | — |
| `ERRODESCRICAO` | Descrição do erro | string(200 | — | (se RETORNO = false) | — |
| `IDArquivo` | Código do documento retornado | int | — | — | — |
| — | Convenio - Nome do departamento vinculado ao documento do repositório | int | — | — | — |
| — | CPFAssociado - CPF vinculado ao documento do repositório | string | — | — | — |
| — | DataCadastro - Data de cadastro do documento retornado, no formato aaaa-mm-dd | string | — | — | — |
| — | DataVencimento - Data de vencimento do documento retornado, no formato aaaa-mm-dd | string | — | — | — |

> _Gerado da spec: revisar colunas Obrigatório, Condicional e Exemplo com WSDL + [`TEMPLATE.md`](TEMPLATE.md)._

## Códigos de erro (amostra)

| Código | Descrição |
|--------|-----------|
| 0 | Erro de sistema. |
| 10 | Request inválido. |
| 11 | O Hash de validação não foi informado. |
| 12 | O código informado para o contrato não é válido. |
| 13 | A data de vencimento inicial é inválida. |
| 14 | A data de vencimento final é inválida. |
| 15 | O período da data de vencimento não pode ser maior que 7 dias. |
| 45 | Hash inválido. |
| 46 | Hash inválido: Hash já utilizado. |
| 47 | Hash inválido: Hash expirado. |
| 51 | Não foi possível obter os pedidos. |

## Implementação neste projeto

- Script: _(ainda não implementado)_

## Referências

- [`webservice/hash.md`](../hash.md) — geração do `Hash`
- [`webservice/list-metodos.md`](../list-metodos.md)
- [`webservice/tabelas-dominio/`](../tabelas-dominio/README.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — Envelope de Entrada/Saída `ListDocumentosRepositorioAC`
