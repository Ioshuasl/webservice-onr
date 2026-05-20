# GetPedidoAC_V3

Método do WSOficio — **3.10 E-Protocolo**.

## Resumo

| Campo | Valor |
|-------|-------|
| Tipo | Consulta |
| Módulo | 3.10 E-Protocolo |
| Operação SOAP | `GetPedidoAC_V3` |

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
| 4 | Chamar `GetPedidoAC_V3` passando `Hash` + demais parâmetros |

Implementação: [`lib/onr_hash.py`](../../lib/onr_hash.py) · Helper: `resolve_auth_hash()` em [`lib/onr_acompanhamento.py`](../../lib/onr_acompanhamento.py).

Erros comuns: **45** (hash inválido), **46** (token já usado), **47** (expirado) — ver tabela em [`../hash.md`](../hash.md).

## Pré-requisitos e validações de negócio

_Documentar regras de negócio (ex.: IDTipoPedido, IDStatus) e linkar [`webservice/tabelas-dominio/`](../tabelas-dominio/README.md)._

## Ordem do envelope (`oRequest`)

_Listar campos na ordem de `<GetPedidoAC_V3_WSReq>` no WSDL local._

## Parâmetros de entrada

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `Hash` | Hash para validação da mensagem | string(50 | — | — | — |
| `IDContrato` | ID do contrato obtido da listagem de pedidos | int | — | — | — |

> _Gerado da spec: revisar colunas Obrigatório, Condicional e Exemplo com WSDL + [`TEMPLATE.md`](TEMPLATE.md)._

## Parâmetros de saída

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `RETORNO` | Indica se houve erro ou não na execução do método | boolean | — | — | — |
| `CODIGOERRO` | Código do erro | int | — | (se RETORNO = false) | — |
| `ERRODESCRICAO` | Descrição do erro | string(200 | — | (se RETORNO = false) | — |
| — | IDContrato - ID do contrato retornado pelo serviço | int | — | — | — |
| — | Protocolo - Protocolo do contrato retornado | string | — | — | — |
| — | IDStatus - Código do Status a ser filtrado. Para retornar todos, informar -1. Para uma lista dos valores possíveis abaixo | int | — | — | — |
| — | IDCartorio - Código do cartório cujo contrato foi direcionado. Para uma lista dos cartórios possíveis conferir serviço CartoriosListar, item 3.17.1.1 | int | — | — | — |
| — | DataRemessa - Data de remessa do contrato obtido, formato: aaaa-mm-dd | string | — | — | — |
| — | Solicitante - Nome do solicitante informado na geração do contrato | string | — | — | — |
| — | Telefone - Telefone do solicitante informado na geração do contrato | string | — | — | — |
| — | Instituicao - Instituição do solicitante informada na geração do contrato | string | — | — | — |
| — | Email - E-mail do solicitante informado na geração do contrato | string | — | — | — |
| — | TipoDocumento - Tipo do contrato, onde 1 = Escritura Pública | string | — | — | — |
| — | TipoServico - Tipo do Serviço indicado, onde 1 = Registro/Averbação e 2 = Exame/Cálculo | string | — | — | — |
| — | ImportacaoExtratoXML - Indica se o contrato foi gerado a partir de uma importação de XML | boolean | — | — | — |
| `Nome` | nome do apresentante | String | — | — | — |
| `CPFCNPJ` | CPF ou CNPJ do apresentante | String | — | — | — |
| `Email` | e-mail do apresentante | String | — | — | — |
| `Via` | tipo de via correspondente ao endereço do apresentante | String | — | — | — |
| `Endereco` | endereço do apresentante | String | — | — | — |
| `Numero` | número correspondente ao endereço do apresentante | String | — | — | — |
| `Complemento` | complemento correspondente ao endereço do apresentante | String | — | — | — |
| `Bairro` | bairro correspondente ao endereço do apresentante | String | — | — | — |
| `Cidade` | cidade correspondente ao endereço do apresentante | String | — | — | — |
| `Estado` | UF correspondente ao endereço do apresentante | String | — | — | — |
| `CEP` | CEP correspondente ao endereço do apresentante | String | — | — | — |
| `DDD` | DDD correspondente ao telefone do apresentante | String | — | — | — |
| `Telefone` | telefone do apresentante | String | — | — | — |
| — | PrenotacaoNumero - Quando prenotado, contém o número da prenotação | string | — | — | — |
| — | PrenotacaoSenha - Quando prenotado, e se a senha foi informada, contém o dado correspondente | string | — | — | — |
| — | PrenotacaoDataInclusao - Quando prenotado, contém a data de inclusão da prenotação no formato aaaa-mm-dd | string | — | — | — |
| — | PrenotacaoDataVencimento - Quando prenotado, contém a data de vencimento da prenotação no formato aaaa-mm-dd | string | — | — | — |
| — | PrenotacaoDataReenvio - Quando prenotado, e se a prenotaçao foi reenviada, contém a data correspondente no formato aaaa-mm-dd | string | — | — | — |
| — | ValorServico - Valor de serviço informado pelo cartório | decimal | — | — | — |
| — | DataResposta - Data de resposta do contrato obtido, formato: aaaa-mm-dd | string | — | — | — |
| — | Resposta - Resposta fornecida na finalização do contrato | string | — | — | — |
| — | DadosAceite - Dados do aceite quando o contrato foi finalizado, contendo nome do responsável e data do aceite no formato aaaa-mm-dd | string | — | — | — |
| — | DataCumprimentoRI- Data do informe de cumprimento de exigência pelo RI no formato aaaa-mmdd | string | — | — | — |
| `Matricula` | matrícula do imóvel | String | — | — | — |
| `Via` | tipo de via correspondente ao endereço do imóvel | String | — | — | — |
| … | _+14 parâmetros — ver especificação_ | — | — | — | — |

> _Gerado da spec: revisar colunas Obrigatório, Condicional e Exemplo com WSDL + [`TEMPLATE.md`](TEMPLATE.md)._

## Códigos de erro (amostra)

| Código | Descrição |
|--------|-----------|
| 0 | Erro de sistema. |
| 10 | Request inválido. |
| 11 | O Hash de validação não foi informado. |
| 12 | O código informado para o contrato não é válido. |
| 45 | Hash inválido. |
| 46 | Hash inválido: Hash já utilizado. |
| 47 | Hash inválido: Hash expirado. |
| 51 | Não foi possível obter os dados do contrato solicitado. |
| 52 | Não foi possível obter os dados dos compradores |

## Implementação neste projeto

- Script: _(ainda não implementado)_

## Referências

- [`webservice/hash.md`](../hash.md) — geração do `Hash`
- [`webservice/list-metodos.md`](../list-metodos.md)
- [`webservice/tabelas-dominio/`](../tabelas-dominio/README.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — Envelope de Entrada/Saída `GetPedidoAC_V3`
