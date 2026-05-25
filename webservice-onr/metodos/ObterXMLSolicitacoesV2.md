# ObterXMLSolicitacoesV2

Método do WSOficio — **3.9 Matrícula Online / Rel. VM**.

## Resumo

| Campo | Valor |
|-------|-------|
| Tipo | Consulta |
| Módulo | 3.9 Matrícula Online / Rel. VM |
| Operação SOAP | `ObterXMLSolicitacoesV2` |

## Serviço

- **WSDL (homologação):** `https://hml3-wsoficio.onr.org.br/matriculaonline.asmx?wsdl`
- **Endpoint:** `https://hml3-wsoficio.onr.org.br/matriculaonline.asmx`
- **WSDL local:** `wsdl/matriculaonline.wsdl`

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
| 4 | Chamar `ObterXMLSolicitacoesV2` passando `Hash` + demais parâmetros |

Implementação: [`lib/onr_hash.py`](../../lib/onr_hash.py) · Helper: `resolve_auth_hash()` em [`lib/onr_acompanhamento.py`](../../lib/onr_acompanhamento.py).

Erros comuns: **45** (hash inválido), **46** (token já usado), **47** (expirado) — ver tabela em [`../hash.md`](../hash.md).

## Pré-requisitos e validações de negócio

_Documentar regras de negócio (ex.: IDTipoPedido, IDStatus) e linkar [`webservice/tabelas-dominio/`](../tabelas-dominio/README.md)._

## Ordem do envelope (`oRequest`)

_Listar campos na ordem de `<ObterXMLSolicitacoesV2_WSReq>` no WSDL local._

## Parâmetros de entrada

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `Hash` | Hash para validação da mensagem | string(50 | — | — | — |
| `Protocolo` | Protocolo da solicitação de matrícula | string | — | — | — |
| `Data Inicial` | Data inicial da solicitação de matrícula a ser pesquisada | string | — | — | — |
| — | Data Final - Data final da solicitação de matrícula a ser pesquisada, com intervalo de 30 dias a partir da data inicial | string | — | — | — |
| `ID Pedido` | ID do pedido de matrícula | string | — | — | — |

> _Gerado da spec: revisar colunas Obrigatório, Condicional e Exemplo com WSDL + [`TEMPLATE.md`](TEMPLATE.md)._

## Parâmetros de saída

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `RETORNO` | Indica se houve erro ou não na execução do método | boolean | — | — | — |
| `CODIGOERRO` | Código do erro | int | — | (se RETORNO = false) | — |
| `ERRODESCRICAO` | Descrição do erro | string(200 | — | (se RETORNO = false) | — |
| `XML da Matricula` | Retorna o XML com uma ou mais matrículas solicitadas | XML CDATA | — | — | — |

> _Gerado da spec: revisar colunas Obrigatório, Condicional e Exemplo com WSDL + [`TEMPLATE.md`](TEMPLATE.md)._

## Códigos de erro (amostra)

| Código | Descrição |
|--------|-----------|
| 0 | Erro de sistema. |
| 10 | Request inválido. |
| 11 | O Hash de validação não foi informado. |
| 12 | O IDCartório informado é inválido. |
| 13 | Formato de data inválido, utilize o padrão AAAA-MM- DD. |
| 13 | Você deve informar a DATA INICIAL, utilize o padrão AAAA-MM-DD. |
| 13 | Você deve informar a DATA FINAL, utilize o padrão AAAA- MM-DD. |
| 13 | Você deve informar um intervalo de data menor ou igual a 30 dias. |
| 13 | IDPedido inválido, utilize o padrão de número inteiro, ex: |
| 14 | Não foram encontrados resultados para o período Informado. |
| 45 | Hash inválido. |
| 46 | Hash inválido: Hash já utilizado. |
| 47 | Hash inválido: Hash expirado. |

## Implementação neste projeto

- Script: _(ainda não implementado)_

## Referências

- [`webservice/hash.md`](../hash.md) — geração do `Hash`
- [`webservice/list-metodos.md`](../list-metodos.md)
- [`webservice/tabelas-dominio/`](../tabelas-dominio/README.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — Envelope de Entrada/Saída `ObterXMLSolicitacoesV2`
