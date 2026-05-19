# GetDetalhesIN_V3

Método do WSOficio — **3.11 Intimações**.

## Resumo

| Campo | Valor |
|-------|-------|
| Tipo | Consulta |
| Módulo | 3.11 Intimações |
| Operação SOAP | `GetDetalhesIN_V3` |

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
| 4 | Chamar `GetDetalhesIN_V3` passando `Hash` + demais parâmetros |

Implementação: [`lib/onr_hash.py`](../../lib/onr_hash.py) · Helper: `resolve_auth_hash()` em [`lib/onr_acompanhamento.py`](../../lib/onr_acompanhamento.py).

Erros comuns: **45** (hash inválido), **46** (token já usado), **47** (expirado) — ver tabela em [`../hash.md`](../hash.md).

## Parâmetros de entrada

| Parâmetro | Descrição |
|-----------|-----------|
| `Hash` | Hash para validação da mensagem (tipo string(50)); |
| `IDPedido` | Código do pedido (tipo int). |

## Parâmetros de saída

| Parâmetro | Descrição |
|-----------|-----------|
| `RETORNO` | Indica se houve erro ou não na execução do método (tipo boolean); |
| `CODIGOERRO` | (se RETORNO = false) Código do erro (tipo int); |
| `ERRODESCRICAO` | (se RETORNO = false) Descrição do erro (tipo string(200)); |
| `IDPedido` | ID do pedido (tipo int); |
| — | IDStatus - ID do status do pedido (tipo int); |
| `Protocolo` | Protocolo do pedido de intimação (tipo string(11)); |
| `Estado` | Estado de solicitação (tipo string(50)); |
| `Cidade` | Cidade de solicitação (tipo string(100)); |
| `IDCartorio` | ID do cartório onde a intimação está registrada (tipo int); |
| `Cartorio` | Descrição do cartório onde a intimação está registrada (tipo string(300)); |
| `NumeroContrato` | Número do contrato gerado (tipo string(30)); |
| `DataRemessa` | Data da remessa, formato aaaa-mm-ddhh:mm:ss (tipo string); |
| `Solicitante` | Nome do solicitante (tipo string(120)); |
| `SolicitanteCPFCNPJ` | Documento (CPF ou CNPJ) do solicitante (tipo string(14)); |
| `SolicitanteIM` | Número de Inscrição Municipal do solicitante (tipo string(30)); |
| `SolicitanteEndereco` | Endereço do solicitante (tipo string(150)); |
| `SolicitanteNumero` | Número do solicitante (tipo string(10)); |
| `SolicitanteComplemento` | Complemento do endereço do solicitante (tipo string(10)); |
| `SolicitanteBairro` | Bairro do solicitante (tipo string(40)); |
| `SolicitanteCidade` | Cidade do solicitante (tipo string(40)); |
| `SolicitanteEstado` | Estado do solicitante (tipo string(2)); |
| `SolicitanteCEP` | CEP do solicitante (tipo string(9)); |
| `SolicitanteDDD` | DDD do solicitante (tipo string(4)); |
| `SolicitanteTelefone` | Telefone do solicitante (tipo string(15)); |
| `SolicitanteEmail` | Email do solicitante (tipo string(60)); |
| `Credor` | Nome do credor (tipo string(120)); |
| `CredorCPFCNPJ` | Documento (CPF ou CNPJ) do credor (tipo string(14)); |
| `CredorIM` | Número de Inscrição Municipal do credor (tipo string(30)); |
| `CredorEndereco` | Endereço do credor (tipo string(150)); |
| `CredorNumero` | Número do credor (tipo string(10)); |
| `CredorComplemento` | Complemento do endereço do credor (tipo string(10)); |
| `CredorBairro` | Bairro do credor (tipo string(40)); |
| `CredorCidade` | Cidade do credor (tipo string(40)); |
| `CredorEstado` | Estado do credor (tipo string(2)); |
| `CredorCEP` | CEP do credor (tipo string(9)); |
| `CredorDDD` | DDD do credor (tipo string(4)); |
| `CredorTelefone` | Telefone do credor (tipo string(15)); |
| `CredorEmail` | Email do credor (tipo string(60)); |
| `PrestacaoAgencia` | Dados da agência de cobrança (tipo string(6)); |
| `PrestacaoEndereco` | Endereço de cobrança (tipo string(150)); |
| … | _+29 parâmetros — ver especificação_ |

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
| 57 | Não foi possível obter os endereços de |
| 58 | Não foi possível obter a lista de reingressos do pedido. |
| … | _+3 códigos na especificação_ |

## Implementação neste projeto

- Script: _(ainda não implementado)_

## Referências

- [`webservice/hash.md`](../hash.md) — geração do `Hash`
- [`webservice/list-metodos.md`](../list-metodos.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — Envelope de Entrada/Saída `GetDetalhesIN_V3`
