# Template — prompt subagente **merge** de segmentos

Disparar **uma vez** após todos os segmentos `done`.

---

## Template

```markdown
Consolidar nota final **{UNIT}.{SYMBOL}** a partir dos segmentos — {PRODUCT_SLUG}.

**Símbolo completo:** `{FILE_PATH}` linhas {LINE_START}–{LINE_END}
**Pasta segmentos:** Orius/desenvolvimento/legado-delphi/produtos/{PRODUCT_SLUG}/unidades/{UNIT}/{SYMBOL}/

## Skills obrigatórias
1. `.cursor/skills/skill-delphi/SKILL.md`
2. `.cursor/skills/skill-pas/SKILL.md`
3. `.cursor/skills/agent-delphi-analyzer-merge/SKILL.md`
4. `.cursor/skills/agent-delphi-analyzer/SKILL.md` (seções nota final)
5. `C:\Users\kenio\.cursor\skills\obsidian-vault\SKILL.md`

## Ler (ordem)
1. `_segment-plan.json` — todos status `done`
2. `_handoff.json`
3. `segment-01.md` … `segment-{NN}.md`
4. Assinatura na interface (manifest, ≤5 linhas) — **não** abrir corpo inteiro do `.pas`

## Entregável
- Nota final: `.../unidades/{UNIT}/{SYMBOL}.md` (status revisado, fonte merge)
- Seção "Detalhamento por segmento" com wikilinks
- Briefing implementação global

## PROIBIDO
- Ler {LINE_START}–{LINE_END} inteiro do `.pas`
- Merge com segmento `pending`
- Atualizar batch JSON

## Retorno
- merge_status: done
- gates: cobertura | sql | fluxo | briefing
```
