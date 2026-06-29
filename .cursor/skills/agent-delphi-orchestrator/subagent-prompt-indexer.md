# Template — prompt subagente indexador

O **orquestrador** preenche `{placeholders}` e lança `Task` (`generalPurpose` ou `explore` readonly para indexação).

O indexador **lista símbolos**; não orquestra, não atualiza batch JSON.

---

## Template (copiar e preencher)

```markdown
Indexe **{FILE_PATH}** (legado Delphi 7 / Embarcadero — {PRODUCT_SLUG}).

**Raiz código:** `C:\Users\kenio\sistema-delphi`
**Path relativo:** `{FILE_PATH}`

## Brief (batch)
- **batch_id:** {BATCH_ID}
- **product_slug:** {PRODUCT_SLUG}
- **product_path:** {PRODUCT_PATH}
- **manifest_vault:** Orius/desenvolvimento/legado-delphi/produtos/{PRODUCT_SLUG}/manifest/{BASE}.symbols.json

## Skills obrigatórias (ler e seguir integralmente)
1. `.cursor/skills/skill-delphi/SKILL.md`
2. `.cursor/skills/skill-pas/SKILL.md` (se .pas) OU `.cursor/skills/skill-dfm/SKILL.md` (se .dfm)
3. `.cursor/skills/skill-dcu/SKILL.md`
4. `.cursor/skills/agent-delphi-indexer/SKILL.md`
5. `C:\Users\kenio\.cursor\skills\obsidian-vault\SKILL.md`

## Entregáveis obrigatórios
1. Manifest JSON no vault (`manifest/{BASE}.symbols.json`)
2. Índice markdown:
   - `.pas` → `unidades/{UNIT}.md`
   - `.dfm` → `formularios/{FORM}.md`
3. Cruzar eventos `.dfm` com handlers `.pas` (se par existir)
4. Marcar `vendor: true` se unit de terceiros
5. Marcar `duplicate: true` se cópia de arquivo

## PROIBIDO para este subagente
- Atualizar `scripts/delphi-{PRODUCT_SLUG}-batch-state.json`
- Destrinchar regra de negócio ou escrever briefing
- Analisar conteúdo de `.dcu`
- Inventar símbolos

## Retorno ao orquestrador
- symbols_total, procedures, functions, types, events
- manifest_path (vault)
- vendor_skipped, duplicate
- BLOCKERS se houver
```

---

## Exemplo — dmPedido.pas

```markdown
Indexe **RegistroDeImoveis/dmPedido.pas** (legado Delphi 7 / Embarcadero — imoveis).

## Brief
- **batch_id:** imoveis-core-pedido
- **product_slug:** imoveis
- **product_path:** RegistroDeImoveis
- **manifest_vault:** Orius/desenvolvimento/legado-delphi/produtos/imoveis/manifest/dmPedido.symbols.json
```
