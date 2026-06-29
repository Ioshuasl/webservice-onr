# Template — prompt subagente analisador

O **orquestrador** dispara **um símbolo por subagente** (paralelo em lotes de 3–8).

O analisador **destrincha** e grava no vault; não orquestra, não atualiza batch JSON.

---

## Template (copiar e preencher)

```markdown
Destrinchar **{UNIT}.{SYMBOL}** ({SYMBOL_TYPE}) — legado Delphi 7 / Embarcadero / {PRODUCT_SLUG}.

**Raiz código:** `C:\Users\kenio\sistema-delphi`
**Arquivo:** `{FILE_PATH}`
**Linhas:** {LINE_START}–{LINE_END}

## Brief
- **batch_id:** {BATCH_ID}
- **product_slug:** {PRODUCT_SLUG}
- **manifest:** Orius/desenvolvimento/legado-delphi/produtos/{PRODUCT_SLUG}/manifest/{MANIFEST_BASE}.symbols.json
{DFM_CONTEXT_BLOCK}

## Skills obrigatórias (ler e seguir integralmente)
1. `.cursor/skills/skill-delphi/SKILL.md`
2. `.cursor/skills/skill-pas/SKILL.md`
3. `.cursor/skills/skill-dfm/SKILL.md` (se evento/form)
4. `.cursor/skills/skill-dcu/SKILL.md`
5. `.cursor/skills/agent-delphi-analyzer/SKILL.md`
6. `C:\Users\kenio\.cursor\skills\obsidian-vault\SKILL.md`

## Antes de escrever
1. Confirmar símbolo e linhas no manifest
2. Ler **somente** o trecho {LINE_START}–{LINE_END} do `.pas`
3. Consultar notas Firebird / integração no vault se SQL ou webservice aparecer

## Entregáveis obrigatórios
1. Nota vault: `.../unidades/{UNIT}/{SYMBOL}.md` (ou `formularios/...` se evento)
2. Seções: Localização, Assinatura, Resumo, Parâmetros, Efeitos, SQL/tabelas, Erros, Chama, Chamado por, Regras, Evidência (≤30 linhas), Briefing implementação
3. Wikilinks para tabelas `Orius/desenvolvimento/banco-de-dados/...`
4. Atualizar link no índice pai (`unidades/{UNIT}.md`)

## Gates (autoavaliação)
- [ ] evidencia
- [ ] sql
- [ ] chamadas (sem inventar)
- [ ] briefing

## PROIBIDO
- Atualizar batch JSON
- Ler arquivo inteiro se linhas já definidas
- Mais de um símbolo por job
- Documentar `.dcu`

Se linhas > 250: **não** usar este template — orquestrador aciona Fase 2.5 (segmentos).

## Retorno ao orquestrador
- vault_path
- tabelas_firebird, chama, chamado_por
- gates + BLOCKERS
```

---

## Bloco opcional DFM (`{DFM_CONTEXT_BLOCK}`)

```markdown
## Contexto DFM
- **Form:** Pedido.dfm
- **Componente:** btnConfirmar
- **Evento:** OnClick → btnConfirmarClick
- **Trecho dfm:** linhas 120–135
```

---

## Exemplo — GravarPedido

```markdown
Destrinchar **dmPedido.GravarPedido** (procedure) — legado Delphi 7 / Embarcadero / imoveis.

**Arquivo:** `RegistroDeImoveis/dmPedido.pas`
**Linhas:** 2100–2280

## Brief
- **batch_id:** imoveis-core-pedido
- **manifest:** .../manifest/dmPedido.symbols.json
```
