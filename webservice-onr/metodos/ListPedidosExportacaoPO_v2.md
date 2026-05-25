# ListPedidosExportacaoPO_v2

Método do WSOficio — **3.3 Penhora Online**.

## Resumo

| Campo | Valor |
|-------|-------|
| Tipo | Listagem (exportação / detalhada) |
| Módulo | 3.3 Penhora Online |
| Operação SOAP | `ListPedidosExportacaoPO_v2` |

Evolução de [`ListPedidosExportacaoPO`](ListPedidosExportacaoPO.md): **mesmo envelope de entrada** (`ListPedidosExportacaoPO_WSReq`) e **mesmo tipo de saída** (`ListPedidosExportacaoPO_WSResp`), com campos adicionais preenchidos pelo serviço v2.

## Diferença em relação à v1

| Aspecto | `ListPedidosExportacaoPO` | `ListPedidosExportacaoPO_v2` |
|---------|---------------------------|------------------------------|
| Request | `ListPedidosExportacaoPO_WSReq` | Idem |
| Response type | `ListPedidosExportacaoPO_WSResp` | Idem |
| Campos extras (spec) | — | `ValorDaDivida` no pedido; `PercentualExecutado`, `PercentualPenhorado` em `Imovel[]` |

Fonte: especificação § **3.3.36** (tabela de observações).

## Serviço

- **WSDL local:** `wsdl/penhoraonline.wsdl`
- **Endpoint:** `PENHORA_ONLINE_ENDPOINT` (homolog: `penhoraonline.asmx`)

## Hash de autenticação

Igual aos demais métodos Penhora Online — [`../hash.md`](../hash.md), `resolve_auth_hash()` em [`lib/onr_penhora_online.py`](../../lib/onr_penhora_online.py).

## Pré-requisitos e validações de negócio

- Mesmos filtros que v1: [`IDTipoPedido`](../tabelas-dominio/IDTipoPedido-PO.md), [`IDStatus`](../tabelas-dominio/IDStatus-PO.md), `IDVara`, datas de solicitação (máx. **30 dias**).
- Reutiliza variáveis `.env` de `ListPedidosPO` / `ListPedidosExportacaoPO`.

## Ordem do envelope (`oRequest`)

Tipo `ListPedidosExportacaoPO_WSReq`:

1. `Hash` · 2. `Protocolo` · 3. `IDTipoPedido` · 4. `IDStatus` · 5. `IDVara` · 6–9. datas

## Parâmetros de entrada

Idênticos a [`ListPedidosExportacaoPO.md`](ListPedidosExportacaoPO.md#parâmetros-de-entrada).

## Parâmetros de saída (campos v2)

Além dos campos da v1, a spec destaca:

| Campo | Onde | Descrição |
|-------|------|-----------|
| `ValorDaDivida` | `Pedidos[]` | Valor da dívida |
| `PercentualExecutado` | `Pedidos[].Imovel[]` | Percentual executado |
| `PercentualPenhorado` | `Pedidos[].Imovel[]` | Percentual penhorado |

Demais campos: ver WSDL `ListPedidosExportacaoPO_Pedidos_WSResp` e v1.

## Códigos de erro

Mesmos de `ListPedidosExportacaoPO` (14–23, 45–47, etc.).

## Implementação neste projeto

- Python: [`scripts/ListPedidosExportacaoPo_v2/listPedidosExportacaoPo_v2.py`](../../scripts/ListPedidosExportacaoPo_v2/listPedidosExportacaoPo_v2.py)
- JavaScript: [`scripts/ListPedidosExportacaoPo_v2/listPedidosExportacaoPo_v2.js`](../../scripts/ListPedidosExportacaoPo_v2/listPedidosExportacaoPo_v2.js)
- Variáveis `.env`: `PENHORA_ONLINE_DATA_SOLICITACAO_*`, `ID_TIPO_PEDIDO`, `ID_STATUS`, `ID_VARA`, `PROTOCOLO`
- npm: `npm run list-pedidos-exportacao-po-v2`

## Referências

- [`webservice/metodos/ListPedidosExportacaoPO.md`](ListPedidosExportacaoPO.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — § 3.3.36
