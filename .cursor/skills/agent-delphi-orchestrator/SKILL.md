---
name: agent-delphi-orchestrator
description: >-
  Orquestra mapeamento do legado Orius (IDE Embarcadero, código Delphi 7) em
  C:\Users\kenio\sistema-delphi:
  batch JSON, indexação (subagente indexer), destrinchamento paralelo (subagente
  analyzer), vault Obsidian como repositório. Gerente — não destrincha código.
  Use com "orquestre delphi", "mapear dmPedido", @agent-delphi-orchestrator.
disable-model-invocation: true
---

# Agent Delphi Orchestrator

Orquestrador do **mapeamento legado Embarcadero / Delphi 7** Orius. Papel: **gerente** — divide lotes, delega a indexador e analisadores, valida gates, persiste estado no batch JSON e no vault.

**Raiz código:** `C:\Users\kenio\sistema-delphi`  
**Context root (batch/scripts):** `c:\Users\kenio\automacoes e testes`  
**Vault:** `C:\Users\kenio\Obsidian Vault`

## Metáfora (obrigatória)

| Papel | Quem | Faz | Não faz |
|-------|------|-----|---------|
| **Gerente** | Este skill | Batch JSON, prioridades, spawn indexer/analyzer, validar cobertura, atualizar índices vault | Ler 12k linhas, documentar procedure |
| **Indexador** | [`agent-delphi-indexer`](../agent-delphi-indexer/SKILL.md) | Manifest + listas de símbolos | Destrinchar negócio |
| **Analisador** | [`agent-delphi-analyzer`](../agent-delphi-analyzer/SKILL.md) | Um símbolo → nota vault | Orquestrar lote |
| **Caixa/TI** | `scripts/extract-delphi-symbols.cjs` (`npm run delphi:extract`) | Parser determinístico | Decidir escopo de negócio |

## Quando usar

- `"Orquestre o mapeamento Delphi …"`
- `"Indexar RegistroDeImoveis/dmPedido.pas"`
- `"Destrinchar procedures de pedido no RI"`
- Retomar lote: `scripts/delphi-<slug>-batch-state.json` → `active_batch_id`

**Não usar** para um único símbolo sem batch — pode invocar `@agent-delphi-analyzer` direto com manifest já pronto.

## Skills obrigatórias do orquestrador

| Skill | Uso |
|-------|-----|
| [`skill-delphi`](../skill-delphi/SKILL.md) | IDE Embarcadero, legado D7, paths, vault |
| [`obsidian-vault`](file:///C:/Users/kenio/.cursor/skills/obsidian-vault/SKILL.md) | Briefing vault, produtos, banco |
| [`agent-delphi-indexer`](../agent-delphi-indexer/SKILL.md) | Delegar indexação |
| [`agent-delphi-analyzer`](../agent-delphi-analyzer/SKILL.md) | Delegar análise (≤250 linhas) |
| [`agent-delphi-analyzer-segment`](../agent-delphi-analyzer-segment/SKILL.md) | Segmento ~200 linhas |
| [`agent-delphi-analyzer-merge`](../agent-delphi-analyzer-merge/SKILL.md) | Consolidar segmentos |
| [`agent-delphi-analyzer-dfm`](../agent-delphi-analyzer-dfm/SKILL.md) | Evento `.dfm` → handler |
| [`agent-delphi-domain-orchestrator`](../agent-delphi-domain-orchestrator/SKILL.md) | Gerente por domínio ecosystem |

Referência: [product-profiles.md](product-profiles.md) · [batch-state-schema.md](batch-state-schema.md) · [symbol-segment-schema.md](symbol-segment-schema.md)  
Prompts: [subagent-prompt-indexer.md](subagent-prompt-indexer.md) · [subagent-prompt-analyzer.md](subagent-prompt-analyzer.md) · [subagent-prompt-analyzer-segment.md](subagent-prompt-analyzer-segment.md) · [subagent-prompt-analyzer-merge.md](subagent-prompt-analyzer-merge.md) · [../agent-delphi-analyzer-dfm/subagent-prompt-analyzer-dfm.md](../agent-delphi-analyzer-dfm/subagent-prompt-analyzer-dfm.md)

---

## Fase 0 — Resolver produto e lote

1. Identificar **produto** pela pasta ou pedido → perfil em [product-profiles.md](product-profiles.md)
2. Arquivo batch: `scripts/delphi-<slug>-batch-state.json` (ex. `delphi-imoveis-batch-state.json`)
3. Se ausente → criar scaffold (ver schema)
4. Ler `active_batch_id` e `execution_order` — **nunca** ordem alfabética de arquivos
5. Consultar vault:
   - `Orius/desenvolvimento/legado-delphi/00-indice.md`
   - `Orius/empresa/produtos/<produto>.md`
   - `Orius/desenvolvimento/banco-de-dados/produtos/...` (cruzamento SQL)

---

## Fase 1 — Indexação (sequencial por arquivo)

Para cada arquivo em `execution_order` com `index_status != done`:

1. Atualizar batch: `current_file`, `index_status: in_progress`
2. **Script Fase 0** (preferir a subagente):
   - `.pas` → `npm run delphi:extract -- --file … --product-slug <slug> --sync-vault --update-batch`
   - `.dfm` → `npm run delphi:extract-dfm -- --file … --product-slug <slug> --sync-vault --update-batch`
3. Ou spawn subagente indexador — [subagent-prompt-indexer.md](subagent-prompt-indexer.md)
4. Gates indexador:
   - `symbols_total > 0` ou `events_total > 0` (ou vendor/skip)
   - JSON válido em `manifest/`
   - Índice `unidades/` ou `formularios/` criado
5. Atualizar batch: `index_status: done`

**Ordem típica:** `.pas` do núcleo antes do `.dfm` pareado (cruzamento handlers).

---

## Fase 1.5 — Triage (obrigatório após index)

```bash
npm run delphi:apply-triage -- --product-slug <slug> --file <path>
```

Classifica `analyze_tier` / `analyze_action` (T4 stub, nested skip). Analisar só símbolos/eventos com `analyze_action: full`.

Métricas: `npm run delphi:report-coverage -- --product-slug <slug> --sync-vault`

---

## Fase 2 — Análise (paralelo por símbolo)

Para cada arquivo com `index_status: done` e `analyze_status != done`:

1. Ler manifest → fila `symbols_pending[]` (ou `execution_order_symbols` no batch)
2. Para **cada** símbolo, calcular `span = line_end - line_start + 1`:
   - **span ≤ 250** → analisador simples (paralelo OK, 3–8 por vez)
   - **span > 250** ou `needs_split: true` → **Fase 2.5** (segmentos — **sequencial**)
3. Template simples: [subagent-prompt-analyzer.md](subagent-prompt-analyzer.md)
4. Gates símbolo simples: `evidencia`, `sql`, `briefing`

Quando `symbols_done === symbols_total` → `analyze_status: done` no arquivo.

---

## Fase 2.5 — Análise segmentada (símbolos gigantes)

**Obrigatório** quando `span > 250` (ex.: `Prenotar` 4803–6247 ≈ 1445 linhas).

Schema: [symbol-segment-schema.md](symbol-segment-schema.md)

### Passo A — Plano de segmentos (script)

```powershell
npm run delphi:split-segments -- --product-slug imoveis --symbol Prenotar --sync-vault --update-batch
```

Gera vault `.../unidades/<Unit>/<Symbol>/_segment-plan.json` e atualiza batch.

### Passo B — Loop sequencial (não paralelizar segmentos do mesmo símbolo)

Para `segment-01` … `segment-NN` com `status: pending`:

1. Batch: segmento `in_progress`
2. Spawn **agent-delphi-analyzer-segment** — [subagent-prompt-analyzer-segment.md](subagent-prompt-analyzer-segment.md)
3. Aguardar `segment-NN.md` + `_handoff.json` atualizado
4. Marcar segmento `done`, `segments_done++`
5. Próximo segmento **só após** handoff gravado

### Passo C — Merge

Quando `segments_done === segments_total`:

1. Spawn **agent-delphi-analyzer-merge** — [subagent-prompt-analyzer-merge.md](subagent-prompt-analyzer-merge.md)
2. Nota final `unidades/<Unit>/<Symbol>.md`
3. `merge_status: done` → símbolo `done` no batch, `symbols_done++`

| Papel | Skill |
|-------|-------|
| Segmento | [`agent-delphi-analyzer-segment`](../agent-delphi-analyzer-segment/SKILL.md) |
| Merge | [`agent-delphi-analyzer-merge`](../agent-delphi-analyzer-merge/SKILL.md) |

**PROIBIDO:** um único analisador com 1400+ linhas; segmentos paralelos do **mesmo** símbolo.

---

## Fase 3 — Grafo, validação e fechamento

Após análise de um arquivo (ou lote de símbolos `done`):

### A — Validar gates (script, não só IA)

```bash
npm run delphi:validate-symbol -- --product-slug imoveis --file RegistroDeImoveis/dmPedido.pas --all-done --update-batch
```

Falha → símbolo permanece `done` mas `validation_pass: false`; corrigir nota ou re-analisar.

### B — Grafo de chamadas

```bash
npm run delphi:build-grafo -- --product-slug imoveis --sync-vault
```

Saída: vault `produtos/<slug>/grafo/chamadas.json` + `00-chamadas.md`.

### C — Segmentos pós-merge

```bash
npm run delphi:sync-segment-status -- --product-slug imoveis --unit dmPedido --symbol Prenotar
```

### D — Fechar arquivo e lote

1. `analyze_status: done` quando símbolos/eventos pendentes = 0
2. Se batch completo → `batch.status: complete`, `completed_at`
3. `npm run delphi:report-coverage -- --product-slug <slug> --sync-vault`

Consultas futuras: [`agent-delphi-debug`](../agent-delphi-debug/SKILL.md) — vault + grafo, sem `.pas` inteiro.

---

## Fase 3 (legado) — referência rápida fechar lote

1. Atualizar `grafo/` (comando acima)
2. Marcar arquivo `status: done` no batch
3. Entregar tabela de cobertura por arquivo e símbolo

---

## Batch JSON — um arquivo por produto

| Produto | Pasta código | Arquivo batch |
|---------|--------------|---------------|
| Imóveis | `RegistroDeImoveis` | `scripts/delphi-imoveis-batch-state.json` |
| Civil | `RegistroCivil` | `scripts/delphi-civil-batch-state.json` |
| Protesto | `TabelionatoDeProtesto` | `scripts/delphi-protesto-batch-state.json` |
| RTD | `RegistroDeTitulosEDocumentos` | `scripts/delphi-rtd-batch-state.json` |
| Caixa | `Caixa` | `scripts/delphi-caixa-batch-state.json` |

Schema completo: [batch-state-schema.md](batch-state-schema.md)

---

## BLOCKER (parar o lote)

- Manifest ausente após indexação
- Path fora de `C:\Users\kenio\sistema-delphi`
- Símbolo no batch não existe no manifest
- Vault inacessível

## NÃO é BLOCKER

- `chamado_por` pendente (preencher em passagem de grafo posterior)
- Unit vendor marcada `skip`
- Encoding legado em comentários

---

## Consulta futura (objetivo do mapeamento)

Após cobertura, perguntas como *"erro na prenotação RI"* devem ser respondidas consultando:

1. Tags/fluxos em `legado-delphi/produtos/imoveis/grafo/`
2. Notas de símbolos linkadas a `pedido`, `prenotacao`, `ONR`
3. Tabelas Firebird no vault

O orquestrador **não** responde debug de produção — garante que o vault tenha material para o agente de suporte.

---

## Arquivos desta skill

| Arquivo | Conteúdo |
|---------|----------|
| [product-profiles.md](product-profiles.md) | Slug, pasta, vault hub, prioridades |
| [batch-state-schema.md](batch-state-schema.md) | JSON batch + manifest |
| [subagent-prompt-indexer.md](subagent-prompt-indexer.md) | Prompt indexador |
| [subagent-prompt-analyzer.md](subagent-prompt-analyzer.md) | Prompt analisador (≤250 linhas) |
| [subagent-prompt-analyzer-segment.md](subagent-prompt-analyzer-segment.md) | Prompt segmento |
| [subagent-prompt-analyzer-merge.md](subagent-prompt-analyzer-merge.md) | Prompt merge |
| [symbol-segment-schema.md](symbol-segment-schema.md) | Fatiamento + handoff |
