# GetMensagemIN

Método do WSOficio — **3.11 Intimações**.

## Resumo

| Campo | Valor |
|-------|-------|
| Tipo | Consulta |
| Módulo | 3.11 Intimações |
| Operação SOAP | `GetMensagemIN` |

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
| 4 | Chamar `GetMensagemIN` passando `Hash` + demais parâmetros |

Implementação: [`lib/onr_hash.py`](../../lib/onr_hash.py) · Helper: `resolve_auth_hash()` em [`lib/onr_acompanhamento.py`](../../lib/onr_acompanhamento.py).

Erros comuns: **45** (hash inválido), **46** (token já usado), **47** (expirado) — ver tabela em [`../hash.md`](../hash.md).

## Pré-requisitos e validações de negócio

_Documentar regras de negócio (ex.: IDTipoPedido, IDStatus) e linkar [`webservice/tabelas-dominio/`](../tabelas-dominio/README.md)._

## Ordem do envelope (`oRequest`)

_Listar campos na ordem de `<GetMensagemIN_WSReq>` no WSDL local._

## Parâmetros de entrada

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `Hash` | Hash para validação da mensagem | string(50 | — | — | — |
| `IDMensagem` | Código da mensagem | int | — | — | — |

> _Gerado da spec: revisar colunas Obrigatório, Condicional e Exemplo com WSDL + [`TEMPLATE.md`](TEMPLATE.md)._

## Parâmetros de saída

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `RETORNO` | Indica se houve erro ou não na execução do método | boolean | — | — | — |
| `CODIGOERRO` | Código do erro | int | — | (se RETORNO = false) | — |
| `ERRODESCRICAO` | Descrição do erro | string(200 | — | (se RETORNO = false) | — |
| `IDMensagem` | ID da mensagem | int | — | — | — |
| `IDStatus` | Código do status da mensagem | int | — | — | — |
| `Assunto` | Descrição do assunto da mensagem | string(100 | — | — | — |
| `Mensagem` | Descrição da mensagem | string(3000 | — | — | — |
| `ValorServico` | Valor das custas de operações cartorárias, no formato XX.XX | decimal | — | — | — |
| `DataPagamento` | Data de pagamento (formato aaaa-mm-ddhh:mm:ss), quando IDStatus = 14 | string | — | — | — |
| `PrenotacaoNumero` | Número da prenotação, quando IDStatus = 4 | string(30 | — | — | — |
| `PrenotacaoData` | Data de inclusão da prenotação (formato aaaa-mm-ddhh:mm:ss), quando IDStatus = 4 | string | — | — | — |
| `PrenotacaoVencimento` | Data de vencimento da prenotação (formato aaaa-mmddhh:mm:ss), quando IDStatus = 4 | string | — | — | — |
| `PrenotacaoValor` | Valor das custas de prenotação, quando IDStatus = 4, no formato XX.XX | decimal | — | — | — |
| `PrenotacaoTipoDestinacaoMutuo` | Descrição do tipo destinação mútuo, quando IDStatus = 4. | string | — | — | — |
| `TipoDeterminacaoJudicial` | Descrição do tipo determinação judicial, quando IDStatus = 28. | string | — | — | — |
| `CanceladoJudicialmente` | Indicação se pedido foi cancelado judicialmente, true ou false. | boolean | — | — | — |
| `DataCancelamentoJudicial` | Data do cancelamento judicial realizada no sistema, (formato aaaa-mm-ddhh:mm:ss) quando CanceladoJudicialmente = true. | string | — | — | — |
| `DataAverbacaoJudicial` | Data da averbação judicial, (formato aaaa-mm-ddhh:mm:ss) quando CanceladoJudicialmente = true. | string | — | — | — |
| `Boletos` | Array de boletos, onde: | — | — | — | — |
| `DataVencimento` | Data de vencimento do boleto, formato aaaa-mm-ddhh:mm:ss | string | — | — | — |
| `Valor` | Valor do boleto, no formato XX.XX | decimal | — | — | — |
| `URL` | URL do boleto gerado, para download ou visualização | string(500 | — | — | — |
| `Anexos` | Array de arquivos anexados à mensagem, onde: | — | — | — | — |
| `Nome` | Nome ou descrição do arquivo anexado | string(100 | — | — | — |
| `URL` | URL do anexo para download ou visualização | string(500 | — | — | — |

> _Gerado da spec: revisar colunas Obrigatório, Condicional e Exemplo com WSDL + [`TEMPLATE.md`](TEMPLATE.md)._

## Códigos de erro (amostra)

| Código | Descrição |
|--------|-----------|
| 0 | Erro de sistema. |
| 10 | Request inválido. |
| 11 | O Hash de validação não foi informado. |
| 12 | O código informado para a mensagem não é válido. |
| 45 | Hash inválido. |
| 46 | Hash inválido: Hash já utilizado. |
| 47 | Hash inválido: Hash expirado. |
| 51 | Não foi possível pegar os dados da mensagem. |
| 52 | Não foi possível obter os dados do pedido de intimação solicitado. |
| 53 | O pedido da mensagem solicitada não pertence ao cartório do usuário autenticado. |
| 54 | Não foi possível obter os dados do cartório. |
| 55 | Não foi possível pegar os dados da prenotação. |
| 56 | Não foi possível obter os anexos da mensagem. |
| 57 | Não foi possível obter os boletos vinculados à mensagem. |

## Implementação neste projeto

- Script: _(ainda não implementado)_

## Referências

- [`webservice/hash.md`](../hash.md) — geração do `Hash`
- [`webservice/list-metodos.md`](../list-metodos.md)
- [`webservice/tabelas-dominio/`](../tabelas-dominio/README.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — Envelope de Entrada/Saída `GetMensagemIN`
