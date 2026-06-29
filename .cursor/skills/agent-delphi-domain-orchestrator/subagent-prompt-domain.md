# Template — prompt gerente de domínio

O **diretor** (ecosystem) ou o usuário preenche `{placeholders}` e lança `Task` com skill `agent-delphi-domain-orchestrator`.

---

## Template

```markdown
Continue domínio **{DOMAIN_ID}** — produto **{PRODUCT_SLUG}**.

## Estado
- **ecosystem:** `scripts/delphi-{PRODUCT_SLUG}-ecosystem-state.json`
- **batch:** `scripts/delphi-{PRODUCT_SLUG}-batch-state.json`
- **batch_id:** {BATCH_ID}
- **cobertura:** [[Orius/desenvolvimento/legado-delphi/produtos/{PRODUCT_SLUG}/00-cobertura]]

## Escopo desta sessão
- Próximo arquivo: `{CURRENT_FILE}` (ou primeiro `index_status != done` em execution_order)
- Lote: **{SYMBOLS_PER_LOT}** símbolos `analyze_action=full` pendentes
- Pular: T4 stub já feitos, `skip`, `nested_in`

## Skills obrigatórias
1. `.cursor/skills/agent-delphi-domain-orchestrator/SKILL.md`
2. `.cursor/skills/agent-delphi-orchestrator/SKILL.md`
3. `.cursor/skills/agent-delphi-ecosystem-orchestrator/SKILL.md`
4. `.cursor/skills/skill-delphi/SKILL.md`

## Scripts (antes de analisar)
- `.pas` indexado: `npm run delphi:extract -- --file {FILE} --product-slug {PRODUCT_SLUG} --sync-vault --update-batch`
- `.dfm` indexado: `npm run delphi:extract-dfm -- --file {FILE} --product-slug {PRODUCT_SLUG} --sync-vault --update-batch`
- Triage: `npm run delphi:apply-triage -- --product-slug {PRODUCT_SLUG} --file {FILE}`

## Entregáveis
1. Arquivo(s) do lote com `symbols_done` / `events_done` atualizados no batch JSON
2. `npm run delphi:report-coverage:imoveis` ao fechar sessão
3. Resumo: done/pending por tier (T1 full vs T4 stub)

## PROIBIDO
- Reiniciar símbolos `done`
- Full analysis em `sql*CalcFields` pendentes T4 (usar stub)
```

---

## Exemplo — ri-core-pedido

```markdown
Continue domínio **ri-core-pedido** — produto **imoveis**.

- **batch_id:** imoveis-dmPedido-poc
- **Lote:** 15 símbolos `analyze_action=full` pendentes em dmPedido.pas
- Depois: indexar `RegistroDeImoveis/Pedido.dfm` se PAS já indexado
```
