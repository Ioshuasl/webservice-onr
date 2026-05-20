# IDTipoPedido — Penhora Online

Código do **tipo de pedido** (filtro em `ListPedidosPO`, retorno em `GetPedidoPO`, validação em vários `Set*PO`).

Fonte: especificação § **3.3.1** (`ListPedidosPO`).

| Valor | Descrição |
|-------|-----------|
| `1` | Pedido Matrícula |
| `2` | Pedido Pessoa (certidão por pessoa) |
| `3` | Pedido Penhora |
| `-1` | Todos _(apenas filtro em listagem)_ |

## Métodos que exigem tipo específico

| IDTipoPedido | Métodos (exemplos) |
|--------------|-------------------|
| `1` | `SetPedidoMatriculaRespondidoPO`, `SetPedidoMatriculaDevolvidoPO`, `SetPedidoFinalizarPrenotacaoVencida` |
| `2` | `SetPedidoPessoaRespondidoPO`, `SetPedidoPessoaDevolvidoPO`, `SetPedidoNegativaLotePO` |
| `3` | `SetPenhoraAverbadoPO`, `SetPenhoraExigenciaPO`, `SetCustasPO`, `SetPrenotacaoPO`, … |

Erro comum quando o tipo não confere: **53** (“operação só pode ser realizada para pedidos do tipo …”).
