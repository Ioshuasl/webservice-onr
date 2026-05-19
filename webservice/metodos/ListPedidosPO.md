# ListPedidosPO

Método do WSOficio — **3.3 Penhora Online**.

## Resumo

| Campo | Valor |
|-------|-------|
| Tipo | Listagem |
| Módulo | 3.3 Penhora Online |
| Operação SOAP | `ListPedidosPO` |

## Serviço

- **WSDL (homologação):** `https://hml3-wsoficio.onr.org.br/penhoraonline.asmx?wsdl`
- **Endpoint:** `https://hml3-wsoficio.onr.org.br/penhoraonline.asmx`
- **WSDL local:** `wsdl/penhoraonline.wsdl`

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
| 4 | Chamar `ListPedidosPO` passando `Hash` + demais parâmetros |

Implementação: [`lib/onr_hash.py`](../../lib/onr_hash.py) · Helper: `resolve_auth_hash()` em [`lib/onr_acompanhamento.py`](../../lib/onr_acompanhamento.py).

Erros comuns: **45** (hash inválido), **46** (token já usado), **47** (expirado) — ver tabela em [`../hash.md`](../hash.md).

## Parâmetros de entrada

| Parâmetro | Descrição |
|-----------|-----------|
| `Hash` | Hash para validação da mensagem (tipo string); |
| `MaxRowPerPage` | Quantidade máxima de registros a serem retornados por página (tipo int); |
| `● PageNumber` | Página a ser retornada (tipo int); |
| `Protocolo` | Protocolo a ser filtrado – * opcional (tipo string); |
| `IDVara` | Código da Vara a ser filtrado. Para retornar todos, informar -1. Para obter os códigos das Varas conferir o método ListVarasPO, item 3.3.3 (tipo int); |
| `IDTipoPedido` | Código do tipo do pedido a ser filtrado (tipo int). Valores possíveis: |
| `IDStatus` | Código do status a ser filtrado (tipo int). Valores possíveis: |
| `11 = Aguardando Pagto` | Vencido |
| `DataSolicitacaoInicial` | Data da solicitação inicial a ser filtrada, formato: aaaa-mm-dd (tipo string); |
| `DataSolicitacaoFinal` | Data da solicitação final a ser filtrada, formato: aaaa-mm-dd (tipo string); |
| `● DataRespostaInicial` | Data da resposta inicial a ser filtrada, formato: aaaa-mm-dd – * opcional |
| `DataRespostaFinal` | Data da resposta final a ser filtrada, formato: aaaa-mm-dd – * opcional (tipo string). |

## Parâmetros de saída

| Parâmetro | Descrição |
|-----------|-----------|
| `RETORNO` | Indica se houve erro ou não na execução do método (tipo boolean); |
| `CODIGOERRO` | (se RETORNO = false) Código do erro (tipo int); |
| `ERRODESCRICAO` | (se RETORNO = false) Descrição do erro (tipo string); |
| `QtdeRegistros` | (se RETORNO = true)  Quantidade total de registros encontrados (tipo int); |
| `QtdePaginas` | (se RETORNO = true)  Quantidade total de páginas, de acordo com o total de registros encontrados e com a quantidade máxima de registros por página que foi informada no envelope de entrada - MaxRowPerPage - (tipo int); |
| `IDPedido` | Código do pedido (tipo int); |
| `Protocolo` | Protocolo do Pedido (tipo string); |
| `IDVara` | Código da Vara (tipo int); |
| `Vara` | Nome da Vara (tipo string); |
| `IDTipoPedido` | Código do tipo do pedido – verificar tipos possíveis no item 3.3.1 - (tipo int). |
| `IDStatus` | Código do status – verificar tipos possíveis no item 3.3.1 -  (tipo int); |
| `DataSolicitacao` | Data da solicitação, formato: aaaa-mm-ddhh:mm:ss (tipo string); |
| `DataResposta` | Data da resposta, formato: aaaa-mm-ddhh:mm:ss  (tipo string). |

## Códigos de erro (amostra)

| Código | Descrição |
|--------|-----------|
| 0 | Erro de sistema. |
| 10 | Request inválido. |
| 11 | O Hash de validação não foi informado. |
| 12 | A quantidade de registros por página informada é inválida. A quantidade mínima permitida é 10. |
| 13 | A página informada é inválida. |
| 14 | A Vara informada é inválida. |
| 15 | O tipo do pedido informado é inválido. |
| 16 | O Status informado é inválido. |
| 17 | A data de solicitação inicial não foi informada. |
| 18 | A data de solicitação final não foi informada. |
| 19 | A data de solicitação inicial é inválida. |
| 20 | A data de solicitação final é inválida. |
| 21 | O período da data de solicitação não pode ser maior que 30 dias. |
| 22 | A data de resposta inicial é inválida. |
| 23 | A data de resposta final é inválida. |
| … | _+5 códigos na especificação_ |

## Implementação neste projeto

- Script Python: [`scripts/ListPedidosPo/listPedidosPo.py`](../../scripts/ListPedidosPo/listPedidosPo.py)
- Script JavaScript: [`scripts/ListPedidosPo/listPedidosPo.js`](../../scripts/ListPedidosPo/listPedidosPo.js)
- Lib: [`lib/onr_penhora_online.py`](../../lib/onr_penhora_online.py) · [`lib/onr_penhora_online.js`](../../lib/onr_penhora_online.js)
- Variáveis `.env`: prefixo `PENHORA_ONLINE_*` (ver `.env.example`)
- `oRequest` na ordem de `ListPedidosPO_WSReq` no WSDL; `Protocolo`, `DataRespostaInicial` e `DataRespostaFinal` enviados como `""` quando vazios (servidor .NET falha com NRE se omitidos)

## Referências

- [`webservice/hash.md`](../hash.md) — geração do `Hash`
- [`webservice/list-metodos.md`](../list-metodos.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — Envelope de Entrada/Saída `ListPedidosPO`
