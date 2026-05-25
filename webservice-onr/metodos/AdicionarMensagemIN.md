# AdicionarMensagemIN

Método do WSOficio — **3.11 Intimações**.

## Resumo

| Campo | Valor |
|-------|-------|
| Tipo | Inclusão |
| Módulo | 3.11 Intimações |
| Operação SOAP | `AdicionarMensagemIN` |

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
| 4 | Chamar `AdicionarMensagemIN` passando `Hash` + demais parâmetros |

Implementação: [`lib/onr_hash.py`](../../lib/onr_hash.py) · Helper: `resolve_auth_hash()` em [`lib/onr_acompanhamento.py`](../../lib/onr_acompanhamento.py).

Erros comuns: **45** (hash inválido), **46** (token já usado), **47** (expirado) — ver tabela em [`../hash.md`](../hash.md).

## Pré-requisitos e validações de negócio

_Documentar regras de negócio (ex.: IDTipoPedido, IDStatus) e linkar [`webservice/tabelas-dominio/`](../tabelas-dominio/README.md)._

## Ordem do envelope (`oRequest`)

_Listar campos na ordem de `<AdicionarMensagemIN_WSReq>` no WSDL local._

## Parâmetros de entrada

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `Hash` | Hash para validação da mensagem | string(50 | — | — | — |
| `IDIntimacao` | Código do pedido | int | — | — | — |
| `IDStatus` | Código do status de mensagem | int | — | — | — |
| `29` | Nova Projeção; | — | — | — | — |
| `Assunto` | Assunto da mensagem | string(100 | — | — | — |
| `Mensagem` | Descrição da mensagem | string(3000 | — | — | — |
| `NumeroPrenotacao` | Número de prenotação, obrigatório apenas quando o IDStatus for = 4 (tipo | — | — | — | — |
| `DataPrenotacao` | Data de prenotação (formato: aaaa-mm-ddhh:mm:ss) , obrigatório apenas | — | — | — | — |
| — | quando o IDStatus for = 4 | string | — | — | — |
| `VencimentoPrenotacao` | Data de vencimento da prenotação (formato: aaaa-mm-ddhh:mm:ss) , | — | — | — | — |
| — | obrigatório apenas quando o IDStatus for = 4 | string | — | — | — |
| `13 - Não Habitacional - Construção` | empreendimento; | — | — | — | — |
| `ValorServico` | Valor das custas  referentes aos tramites burocráticos, obrigatório apenas quando o | — | — | — | — |
| — | IDStatus for = 6 ou 22 | decimal | — | — | — |
| `DataPagamento` | Data do pagamento (formato: aaaa-mm-ddhh:mm:ss) , obrigatório apenas | — | — | — | — |
| — | quando o IDStatus for = 14 | string | — | — | — |

> _Gerado da spec: revisar colunas Obrigatório, Condicional e Exemplo com WSDL + [`TEMPLATE.md`](TEMPLATE.md)._

## Parâmetros de saída

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `RETORNO` | Indica se houve erro ou não na execução do método | boolean | — | — | — |
| `CODIGOERRO` | Código do erro | int | — | (se RETORNO = false) | — |
| `ERRODESCRICAO` | Descrição do erro | string(20 | — | (se RETORNO = false) | — |
| — | URLBoleto -  URL do boleto gerado, quando o IDStatus for = 6 ou 22 (tipo | — | — | (se RETORNO = true) | — |
| — | 22 | int | — | — | — |

> _Gerado da spec: revisar colunas Obrigatório, Condicional e Exemplo com WSDL + [`TEMPLATE.md`](TEMPLATE.md)._

## Códigos de erro (amostra)

| Código | Descrição |
|--------|-----------|
| 0 | Erro de sistema. |
| 10 | Request inválido. |
| 11 | O Hash de validação não foi informado. |
| 12 | O código informadopara a intimação não é válido. |
| 13 | O código informadopara o status da mensagem não é válido. |
| 14 | O assunto da mensagem deve ser informado. |
| 15 | O texto da mensagem não foi informado. |
| 16 | Não foipossível carregar opedido de intimação informado. |
| 17 | O status informado não é válidopara a operação de cadastramento de mensagem. |
| 18 | É obrigatória a inclusão depelo menos um anexopara os status 3, 10, 12, 23 ou 25. |
| 19 | Um dos anexos da requisição não teve o DOC_ID informado. |
| 20 | É obrigatório informar o número daprenotaçãopara o status Prenotado. |
| 21 | É obrigatório informar uma data deprenotaçãopara o status Prenotado. |
| 22 | A data deprenotação informada é inválida. |
| 23 | É obrigatório informar o vencimento daprenotaçãopara o status Prenotado. |
| … | _+26 códigos na especificação_ |

## Implementação neste projeto

- Script: _(ainda não implementado)_

## Referências

- [`webservice/hash.md`](../hash.md) — geração do `Hash`
- [`webservice/list-metodos.md`](../list-metodos.md)
- [`webservice/tabelas-dominio/`](../tabelas-dominio/README.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — Envelope de Entrada/Saída `AdicionarMensagemIN`
