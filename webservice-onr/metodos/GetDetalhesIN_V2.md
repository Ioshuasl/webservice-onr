# GetDetalhesIN_V2

Método do WSOficio — **3.11 Intimações**.

## Resumo

| Campo | Valor |
|-------|-------|
| Tipo | Consulta |
| Módulo | 3.11 Intimações |
| Operação SOAP | `GetDetalhesIN_V2` |

## Serviço

- **WSDL (homologação):** `https://hml3-wsoficio.onr.org.br/intimacoes.asmx?wsdl`
- **Endpoint:** `https://hml3-wsoficio.onr.org.br/intimacoes.asmx`
- **WSDL local:** `wsdl/intimacoes.wsdl`

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
| 4 | Chamar `GetDetalhesIN_V2` passando `Hash` + demais parâmetros |

Implementação: [`lib/onr_hash.py`](../../lib/onr_hash.py) · Helper: `resolve_auth_hash()` em [`lib/onr_acompanhamento.py`](../../lib/onr_acompanhamento.py).

Erros comuns: **45** (hash inválido), **46** (token já usado), **47** (expirado) — ver tabela em [`../hash.md`](../hash.md).

## Pré-requisitos e validações de negócio

_Documentar regras de negócio (ex.: IDTipoPedido, IDStatus) e linkar [`webservice/tabelas-dominio/`](../tabelas-dominio/README.md)._

## Ordem do envelope (`oRequest`)

_Listar campos na ordem de `<GetDetalhesIN_V2_WSReq>` no WSDL local._

## Parâmetros de entrada

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `Hash` | Hash para validação da mensagem | string(50 | — | — | — |
| `IDPedido` | Código do pedido | int | — | — | — |

> _Gerado da spec: revisar colunas Obrigatório, Condicional e Exemplo com WSDL + [`TEMPLATE.md`](TEMPLATE.md)._

## Parâmetros de saída

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `RETORNO` | Indica se houve erro ou não na execução do método | boolean | — | — | — |
| `CODIGOERRO` | Código do erro | int | — | (se RETORNO = false) | — |
| `ERRODESCRICAO` | Descrição do erro | string(200 | — | (se RETORNO = false) | — |
| `IDPedido` | ID do pedido | int | — | — | — |
| — | IDStatus - ID do status do pedido | int | — | — | — |
| `Protocolo` | Protocolo do pedido de intimação | string(11 | — | — | — |
| `Estado` | Estado de solicitação | string(50 | — | — | — |
| `Cidade` | Cidade de solicitação | string(100 | — | — | — |
| `IDCartorio` | ID do cartório onde a intimação está registrada | int | — | — | — |
| `Cartorio` | Descrição do cartório onde a intimação está registrada | string(300 | — | — | — |
| `NumeroContrato` | Número do contrato gerado | string(30 | — | — | — |
| `DataRemessa` | Data da remessa, formato aaaa-mm-ddhh:mm:ss | string | — | — | — |
| `Solicitante` | Nome do solicitante | string(120 | — | — | — |
| `SolicitanteCPFCNPJ` | Documento (CPF ou CNPJ) do solicitante | string(14 | — | — | — |
| `SolicitanteIM` | Número de Inscrição Municipal do solicitante | string(30 | — | — | — |
| `SolicitanteEndereco` | Endereço do solicitante | string(150 | — | — | — |
| `SolicitanteNumero` | Número do solicitante | string(10 | — | — | — |
| `SolicitanteComplemento` | Complemento do endereço do solicitante | string(10 | — | — | — |
| `SolicitanteBairro` | Bairro do solicitante | string(40 | — | — | — |
| `SolicitanteCidade` | Cidade do solicitante | string(40 | — | — | — |
| `SolicitanteEstado` | Estado do solicitante | string(2 | — | — | — |
| `SolicitanteCEP` | CEP do solicitante | string(9 | — | — | — |
| `SolicitanteDDD` | DDD do solicitante | string(4 | — | — | — |
| `SolicitanteTelefone` | Telefone do solicitante | string(15 | — | — | — |
| `SolicitanteEmail` | Email do solicitante | string(60 | — | — | — |
| `Credor` | Nome do credor | string(120 | — | — | — |
| `CredorCPFCNPJ` | Documento (CPF ou CNPJ) do credor | string(14 | — | — | — |
| `CredorIM` | Número de Inscrição Municipal do credor | string(30 | — | — | — |
| `CredorEndereco` | Endereço do credor | string(150 | — | — | — |
| `CredorNumero` | Número do credor | string(10 | — | — | — |
| `CredorComplemento` | Complemento do endereço do credor | string(10 | — | — | — |
| `CredorBairro` | Bairro do credor | string(40 | — | — | — |
| `CredorCidade` | Cidade do credor | string(40 | — | — | — |
| `CredorEstado` | Estado do credor | string(2 | — | — | — |
| `CredorCEP` | CEP do credor | string(9 | — | — | — |
| `CredorDDD` | DDD do credor | string(4 | — | — | — |
| `CredorTelefone` | Telefone do credor | string(15 | — | — | — |
| `CredorEmail` | Email do credor | string(60 | — | — | — |
| `PrestacaoAgencia` | Dados da agência de cobrança | string(6 | — | — | — |
| `PrestacaoEndereco` | Endereço de cobrança | string(150 | — | — | — |
| … | _+33 parâmetros — ver especificação_ | — | — | — | — |

> _Gerado da spec: revisar colunas Obrigatório, Condicional e Exemplo com WSDL + [`TEMPLATE.md`](TEMPLATE.md)._

## Códigos de erro (amostra)

| Código | Descrição |
|--------|-----------|
| 0 | Erro de sistema. |
| 10 | Request inválido. |
| 11 | O Hash de validação não foi informado. |
| 12 | O código informado para o pedido de intimação não é válido. |
| 45 | Hash inválido. |
| 46 | Hash inválido: Hash já utilizado. |
| 47 | Hash inválido: Hash expirado. |
| 51 | Não foi possível obter os dados do pedido de intimação solicitado. |
| 52 | O pedido solicitado não pertence ao cartório do usuário autenticado. |
| 53 | Não foi possível obter os dados do cartório. |
| 54 | Não foi possível obter as prenotações. |
| 55 | Não foi possível obter os participantes do pedido. |
| 56 | Não foi possível obter os imóveis do pedido. |
| 57 | Não foi possível obter os endereços de correspondência do pedido. |
| 58 | Não foi possível obter a lista de reingressos do pedido. |
| … | _+3 códigos na especificação_ |

## Implementação neste projeto

- Script: _(ainda não implementado)_

## Referências

- [`webservice/hash.md`](../hash.md) — geração do `Hash`
- [`webservice/list-metodos.md`](../list-metodos.md)
- [`webservice/tabelas-dominio/`](../tabelas-dominio/README.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — Envelope de Entrada/Saída `GetDetalhesIN_V2`
