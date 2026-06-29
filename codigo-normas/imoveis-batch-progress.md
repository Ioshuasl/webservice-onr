# Progresso Imóveis — Livro IX

Fonte: `codigo-normas/_ix_extract_full.json` (**174 itens**, **12 lotes** × 15; último lote com 9 itens)

| Lote | items[]   | Status    | Notas |
|------|-----------|-----------|-------|
| 1    | 0–14      | concluido | arts. 789–792 |
| 2    | 15–29     | concluido | arts. 792–796 |
| 3    | 30–44     | concluido | arts. 796–799 |
| 4    | 45–59     | concluido | arts. 800–809 |
| 5    | 60–74     | concluido | |
| 6    | 75–89     | concluido | arts. 814–818 |
| 7    | 90–104    | concluido | arts. 818–822 |
| 8    | 105–119   | concluido | arts. 822–824 |
| 9    | 120–134   | concluido | arts. 824–827 |
| 10   | 135–149   | concluido | arts. 827–831 |
| 11   | 150–164   | concluido | arts. 831–834 |
| 12   | 165–173   | concluido | arts. 834–837 (9 itens) |

**Cobertura normativa:** arts. **789–837** (títulos I–II do Livro IX na extração atual).

**Observações da extração:**
- 11 chaves duplicadas no JSON (`dup2`, etc.)
- ~50 trechos marcados como incompletos na fonte (ex.: art. 837 truncado)
- Piloto anterior (~49 notas agregadas) será **substituído/revalidado** pelas 174 notas atômicas

**Destino:** `Orius/desenvolvimento/regras-de-negocio/imoveis/regras/`

**Modelo:** `art-789-competencia-geral-ri.md` · Produto: `[[Orius/empresa/produtos/registro-imoveis]]`

**Estratégia:** geradores em paralelo (blocos de 6) → revisão em blocos → índice `00-indice-imoveis.md` ✅
