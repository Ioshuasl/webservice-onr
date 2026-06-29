# Template — prompt subagente analyzer DFM

O **orquestrador** ou **gerente de domínio** preenche `{placeholders}`.

---

## Template

```markdown
Analise o evento **{HANDLER}** do form **{FORM_UNIT}** ({PRODUCT_SLUG}).

## Contexto
- **DFM:** `{DFM_PATH}` — componente `{COMPONENT}`, evento `{EVENT}`, linha DFM {LINE_DFM}
- **PAS:** `{PAS_PATH}` — handler L{LINE_START}–{LINE_END}
- **manifest:** Orius/desenvolvimento/legado-delphi/produtos/{PRODUCT_SLUG}/manifest/{FORM_UNIT}.dfm.json

## Skills obrigatórias
1. `.cursor/skills/skill-delphi/SKILL.md`
2. `.cursor/skills/skill-dfm/SKILL.md`
3. `.cursor/skills/skill-pas/SKILL.md`
4. `.cursor/skills/agent-delphi-analyzer-dfm/SKILL.md`
5. `C:\Users\kenio\.cursor\skills\obsidian-vault\SKILL.md`

## Entregável
Nota: `Orius/desenvolvimento/legado-delphi/produtos/{PRODUCT_SLUG}/formularios/{FORM_UNIT}/{HANDLER}.md`

Template base: `Orius/desenvolvimento/legado-delphi/templates/_template-simbolo-pas.md`

## Retorno ao orquestrador
- vault_path
- gates: evidencia, handler, briefing
- BLOCKERS se handler_missing
```

---

## Exemplo — Pedido FormCreate

```markdown
Analise **FormCreate** do form **Pedido** (imoveis).

- DFM: `RegistroDeImoveis/Pedido.dfm` — `frmPedido`, `OnCreate`, L21
- PAS: `RegistroDeImoveis/Pedido.pas` — usar linhas do manifest
```
