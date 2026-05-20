# ListPedidosExportacaoPO

Método do WSOficio — **3.3 Penhora Online**.

## Resumo

| Campo | Valor |
|-------|-------|
| Tipo | Listagem (exportação / detalhada) |
| Módulo | 3.3 Penhora Online |
| Operação SOAP | `ListPedidosExportacaoPO` |

Diferente de `ListPedidosPO`: retorna pedidos com **partes**, **imóveis** e campos de processo/penhora/certidão (sem paginação no envelope).

Variante v2 (campos `ValorDaDivida`, `Imovel[].PercentualExecutado`, `PercentualPenhorado`): [`ListPedidosExportacaoPO_v2.md`](ListPedidosExportacaoPO_v2.md).

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

Implementação: [`lib/onr_penhora_online.py`](../../lib/onr_penhora_online.py) · `resolve_auth_hash()`.

## Pré-requisitos e validações de negócio

- Filtros iguais a `ListPedidosPO`: [`IDTipoPedido`](../tabelas-dominio/IDTipoPedido-PO.md), [`IDStatus`](../tabelas-dominio/IDStatus-PO.md), `IDVara` (-1 = todas).
- `DataSolicitacaoInicial` e `DataSolicitacaoFinal` obrigatórias (aaaa-mm-dd), período **máx. 30 dias** (erro **21**).
- `Protocolo` e datas de resposta opcionais.

## Ordem do envelope (`oRequest`)

Tipo `ListPedidosExportacaoPO_WSReq` (`wsdl/penhoraonline.wsdl`):

1. `Hash`
2. `Protocolo`
3. `IDTipoPedido`
4. `IDStatus`
5. `IDVara`
6. `DataSolicitacaoInicial`
7. `DataSolicitacaoFinal`
8. `DataRespostaInicial`
9. `DataRespostaFinal`

> Ordem distinta de `ListPedidosPO` (lá `IDVara` vem antes de `IDTipoPedido`).

## Parâmetros de entrada

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `Hash` | Hash de autenticação | string | sim | — | _(SHA-1)_ |
| `Protocolo` | Filtro por protocolo | string | não | — | — |
| `IDTipoPedido` | Tipo do pedido | int | sim | ver domínio | -1 |
| `IDStatus` | Status | int | sim | ver domínio | -1 |
| `IDVara` | Vara (-1 = todas) | int | sim | — | -1 |
| `DataSolicitacaoInicial` | Data início solicitação | string | sim | aaaa-mm-dd | 2025-02-01 |
| `DataSolicitacaoFinal` | Data fim solicitação | string | sim | máx. 30 dias | 2025-02-28 |
| `DataRespostaInicial` | Filtro resposta início | string | não | — | — |
| `DataRespostaFinal` | Filtro resposta fim | string | não | — | — |

## Parâmetros de saída

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `RETORNO` | Sucesso global | boolean | sim | — | true |
| `CODIGOERRO` | Código global | int | sim | — | 0 |
| `ERRODESCRICAO` | Descrição global | string | não | se RETORNO=false | — |
| `Pedidos[].IDPedido` | Código do pedido | int | sim | — | — |
| `Pedidos[].IDProcesso` | Processo | int | sim | — | — |
| `Pedidos[].IDTipoPedido` | Tipo | int | sim | — | 3 |
| `Pedidos[].Parte[]` | Partes do processo | array | não | — | — |
| `Pedidos[].Imovel[]` | Imóveis | array | não | penhora | — |

Demais campos do pedido/imóvel conforme WSDL e especificação § 3.3.37.

## Códigos de erro (amostra)

| Código | Descrição |
|--------|-----------|
| 11 | Hash não informado |
| 14–16 | Vara / tipo / status inválidos |
| 17–23 | Datas inválidas ou período > 30 dias |
| 21 | Período da data de solicitação > 30 dias |
| 45–47 | Erros de hash |

## Implementação neste projeto

- Python: [`scripts/ListPedidosExportacaoPo/listPedidosExportacaoPo.py`](../../scripts/ListPedidosExportacaoPo/listPedidosExportacaoPo.py)
- JavaScript: [`scripts/ListPedidosExportacaoPo/listPedidosExportacaoPo.js`](../../scripts/ListPedidosExportacaoPo/listPedidosExportacaoPo.js)
- Variáveis `.env`: mesmas de `ListPedidosPO` (`PENHORA_ONLINE_DATA_SOLICITACAO_*`, `ID_TIPO_PEDIDO`, `ID_STATUS`, `ID_VARA`, `PROTOCOLO`)
- npm: `npm run list-pedidos-exportacao-po`

## Referências

- [`webservice/hash.md`](../hash.md)
- [`webservice/list-metodos.md`](../list-metodos.md)
- [`webservice/metodos/ListPedidosPO.md`](ListPedidosPO.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — § 3.3.36–3.3.37
