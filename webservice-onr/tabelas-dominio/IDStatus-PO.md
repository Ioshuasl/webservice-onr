# IDStatus — Penhora Online

Código do **status do pedido** (filtro em `ListPedidosPO`, retorno em `GetPedidoPO`).

Fonte: especificação § **3.3.1** (`ListPedidosPO`).

| Valor | Descrição |
|-------|-----------|
| `1` | Aberto |
| `2` | Respondido |
| `3` | Devolvido |
| `5` | Finalizado sem Pagamento |
| `7` | Nota de Exigência |
| `8` | Reaberto não Concluído |
| `9` | Prenotado |
| `10` | Aguardando Pagto |
| `11` | Aguardando Pagto — Vencido |
| `12` | Não Prenotado |
| `13` | Pagamento Efetivado (Penhoras Pagas) |
| `14` | Registro / Averbação |
| `-1` | Todos _(apenas filtro em listagem)_ |

## Elegibilidade (scripts de teste)

Regras usadas em `findEligiblePedido.py` (podem variar por método):

- Responder penhora (averbado/exigência): em geral **não** `2`, `5`, `14`; penhora costuma exigir prenotação/pagamento conforme método.
- Após `Set*Respondido*`: status pode ir para aguardando download (**502** até ONR baixar anexos).

Consulte o método específico e `GetPedidoPO` antes de chamar `Set*`.
