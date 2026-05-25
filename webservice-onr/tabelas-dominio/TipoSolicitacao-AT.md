# TipoSolicitacao — Acompanhamento de Títulos

Tipo da solicitação do título (`InsertTituloAT`, `UpdateTituloAT`).

Fonte: especificação § **3.2.12** (`InsertTituloAT`).

| Valor | Descrição |
|-------|-----------|
| `1` | Prenotação |
| `2` | Exame e Cálculo |

Na spec, retornos de consulta podem citar `0` ou `1` como Prenotação — validar em homologação o valor enviado no insert.
