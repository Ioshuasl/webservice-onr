# Template — prompt subagente analisador de **segmento**

O orquestrador dispara segmentos **em série** (segmento 2 só após 1 `done`).

---

## Template

```markdown
Analisar **segmento {SEGMENT_ID}/{SEGMENTS_TOTAL}** de **{UNIT}.{SYMBOL}** — legado Delphi 7 / {PRODUCT_SLUG}.

**Arquivo:** `{FILE_PATH}`
**Linhas deste segmento:** {SEG_LINE_START}–{SEG_LINE_END} ({SEG_LINE_COUNT} linhas)
**Símbolo completo:** {LINE_START}–{LINE_END}

## Segmentação
- **segment_index:** {SEGMENT_INDEX}
- **segment_key:** {SEGMENT_KEY}
- **Plano:** Orius/desenvolvimento/legado-delphi/produtos/{PRODUCT_SLUG}/unidades/{UNIT}/{SYMBOL}/_segment-plan.json
- **Handoff (ler se index > 1):** .../{UNIT}/{SYMBOL}/_handoff.json

## Skills obrigatórias
1. `.cursor/skills/skill-delphi/SKILL.md`
2. `.cursor/skills/skill-pas/SKILL.md` (§ Segmentação)
3. `.cursor/skills/agent-delphi-analyzer-segment/SKILL.md`
4. `C:\Users\kenio\.cursor\skills\obsidian-vault\SKILL.md`

## Antes de escrever
1. Ler **somente** linhas {SEG_LINE_START}–{SEG_LINE_END} do `.pas`
2. Se segment_index > 1: ler `_handoff.json` integralmente
3. Não reler segmentos anteriores (.md) salvo se handoff incompleto

## Entregáveis
1. `.../unidades/{UNIT}/{SYMBOL}/segment-{SEGMENT_ID}.md`
2. Atualizar `.../unidades/{UNIT}/{SYMBOL}/_handoff.json` (cumulativo)
3. Marcar segmento `done` no retorno (orquestrador atualiza batch)

## PROIBIDO
- Mais de 220 linhas de código no contexto
- Analisar outro segmento no mesmo job
- Escrever nota final `{SYMBOL}.md` (merge é outro agente)
- Atualizar batch JSON

## Retorno
- handoff_updated: true/false
- open_branches: [...]
- sql_tables, calls neste trecho
- BLOCKERS
```

---

## Exemplo — Prenotar segmento 03

```markdown
Analisar **segmento 03/08** de **dmPedido.Prenotar** — imoveis.

**Linhas deste segmento:** 5203–5402
**Handoff:** ler `_handoff.json` (após segmentos 01 e 02)
```
