---
name: agent-delphi-analyzer-segment
description: >-
  Subagente que analisa UM segmento (~200 linhas) de uma procedure Delphi gigante.
  Lê handoff do segmento anterior no vault, grava nota do segmento + handoff
  cumulativo para o próximo. Use quando line_end - line_start > 250 ou
  needs_split no batch. Encadeamento sequencial — não paralelo entre segmentos.
disable-model-invocation: true
---

# Agent Delphi Analyzer — Segmento

**Papel:** analisar **um único segmento** de um símbolo fatiado. Memória entre segmentos = vault (`_handoff.json` + notas `segment-NN.md`).

**Limite:** ~**200 linhas** por job (`line_end - line_start + 1 ≤ 220`).

## Quando usar

| Condição | Agente |
|----------|--------|
| Símbolo ≤ 250 linhas | [`agent-delphi-analyzer`](../agent-delphi-analyzer/SKILL.md) |
| Símbolo > 250 linhas ou `needs_split: true` | **Este skill** (N jobs sequenciais) + depois [`agent-delphi-analyzer-merge`](../agent-delphi-analyzer-merge/SKILL.md) |

Exemplo real: `Prenotar` em `dmPedido.pas` → linhas 4803–6247 (~1445 linhas) → **8 segmentos**.

## Skills obrigatórias

1. [`skill-delphi`](../skill-delphi/SKILL.md)
2. [`skill-pas`](../skill-pas/SKILL.md) — § Segmentação
3. Este skill
4. [`obsidian-vault`](file:///C:/Users/kenio/.cursor/skills/obsidian-vault/SKILL.md)

Template segmento: [`templates/_template-segmento-pas`](file:///C:/Users/kenio/Obsidian%20Vault/Orius/desenvolvimento/legado-delphi/templates/_template-segmento-pas.md)

## Entrada (orquestrador)

| Campo | Exemplo |
|-------|---------|
| `symbol` | `Prenotar` |
| `unit` | `dmPedido` |
| `segment_id` | `03` |
| `segment_key` | `segment-03` |
| `line_start` / `line_end` | `5203` / `5402` |
| `segment_index` | 3 |
| `segments_total` | 8 |
| `file_path` | `RegistroDeImoveis/dmPedido.pas` |
| `handoff_path` | vault `.../dmPedido/Prenotar/_handoff.json` |
| `segment_plan` | vault `.../Prenotar/_segment-plan.json` |

## Antes de analisar

1. Ler `_segment-plan.json` — confirmar `line_start`/`line_end` do segmento
2. Se `segment_index > 1`: ler **`_handoff.json`** (saída do segmento anterior)
3. Ler **somente** linhas `line_start`…`line_end` do `.pas`
4. **Não** reler segmentos anteriores inteiros — só o handoff

## Saída obrigatória

### 1. Nota do segmento

`.../unidades/<Unit>/<Symbol>/segment-<id>.md`

| Seção | Conteúdo |
|-------|----------|
| **Escopo** | linhas exatas deste segmento |
| **Continuação** | o que o handoff anterior já estabeleceu (1 parágrafo) |
| **Fluxo neste trecho** | passo a passo |
| **Variáveis locais novas** | declaradas neste trecho |
| **SQL / datasets** | só neste trecho |
| **Chamadas** | procedures/functions chamadas aqui |
| **Decisões / branches** | if/case/try — marcar `aberto` se não fechado no trecho |
| **Evidência** | ≤ 25 linhas com número |
| **Handoff para próximo** | bullet list objetiva |

### 2. Handoff cumulativo (`_handoff.json`)

Atualizar (merge com handoff anterior):

```json
{
  "symbol": "Prenotar",
  "unit": "dmPedido",
  "last_segment_id": "03",
  "last_line": 5402,
  "flow_summary": "texto acumulado do fluxo até aqui",
  "variables_in_scope": ["vTotal", "..."],
  "datasets_touched": ["sqlPedido", "..."],
  "sql_tables": ["RI_PEDIDO", "..."],
  "calls_made": ["InserirCaixa", "..."],
  "open_branches": ["try linha 5380 sem except neste segmento"],
  "errors_messages": ["..."],
  "business_rules": ["códigos de domínio encontrados"]
}
```

### 3. Retorno ao orquestrador

```markdown
## Segmento {id} — {Unit}.{Symbol}
- linhas: {start}–{end}
- vault_segment: .../segment-{id}.md
- handoff_updated: true
- open_branches: N
- BLOCKERS: ...
```

## Regras anti-alucinação

- Citar **só** o que aparece nas linhas do segmento + handoff explícito
- Branch `aberto` no fim do segmento → listar em `open_branches` para o próximo agente resolver
- **Não** completar o fluxo além do trecho
- **Não** escrever a nota final `Prenotar.md` — isso é o merge

## PROIBIDO

- Analisar mais de um segmento por job
- Paralelizar segmentos do **mesmo** símbolo
- Pular handoff quando `segment_index > 1`
- Atualizar batch JSON (orquestrador)

## Template

[subagent-prompt-analyzer-segment.md](../agent-delphi-orchestrator/subagent-prompt-analyzer-segment.md)
