---
name: agent-delphi-analyzer-dfm
description: >-
  Subagente que analisa um evento VCL (.dfm → handler .pas): componente,
  propósito da tela, fluxo do handler, datasets ligados. Use após
  extract-delphi-dfm quando o orquestrador disparar análise de formulários
  legado Delphi 7 em C:\Users\kenio\sistema-delphi.
disable-model-invocation: true
---

# Agent Delphi Analyzer — DFM / Evento

**Papel:** analisar **um evento** (handler) ligado a um componente `.dfm`, com corpo no `.pas` pareado.

**Um job = um handler** (ex. `FormCreate`, `btnConfirmarClick`).

## Skills obrigatórias

1. [`skill-delphi`](../skill-delphi/SKILL.md)
2. [`skill-dfm`](../skill-dfm/SKILL.md)
3. [`skill-pas`](../skill-pas/SKILL.md) — só trecho do handler
4. [`obsidian-vault`](file:///C:/Users/kenio/.cursor/skills/obsidian-vault/SKILL.md)

Template vault: [`templates/_template-simbolo-pas`](file:///C:/Users/kenio/Obsidian%20Vault/Orius/desenvolvimento/legado-delphi/templates/_template-simbolo-pas.md) (adaptar seções para evento UI)

Prompt: [subagent-prompt-analyzer-dfm.md](subagent-prompt-analyzer-dfm.md)

## Entrada

| Campo | Exemplo |
|-------|---------|
| `product_slug` | `imoveis` |
| `form_unit` | `Pedido` |
| `form_class` | `TfrmPedido` |
| `dfm_path` | `RegistroDeImoveis/Pedido.dfm` |
| `pas_path` | `RegistroDeImoveis/Pedido.pas` |
| `handler` | `FormCreate` |
| `component` | `frmPedido` |
| `event` | `OnCreate` |
| `line_dfm` | `21` |
| `handler_line_start` / `handler_line_end` | do manifest `.dfm.json` |
| `manifest_dfm` | `.../manifest/Pedido.dfm.json` |

## Antes de analisar

1. Confirmar handler no manifest DFM e linhas no PAS (±5)
2. Ler trecho `.dfm` do componente (~20–80 linhas em `line_dfm`)
3. Ler corpo do handler no `.pas` **somente** `handler_line_start`…`handler_line_end`
4. Se `handler_missing: true` → nota curta + BLOCKER; não inventar corpo

## Saída vault

```
Orius/desenvolvimento/legado-delphi/produtos/<slug>/formularios/<Form>/<Handler>.md
```

Atualizar índice `formularios/<Form>.md` com link `[[<Handler>]]`.

## Seções obrigatórias

| Seção | Conteúdo |
|-------|----------|
| **Evento** | componente, `On*`, handler |
| **Propósito** | o que a ação faz na tela |
| **Componentes envolvidos** | edits, grids, abas |
| **Datasets** | via DataSource → link dm |
| **Fluxo** | passos + chamadas a units/dm |
| **Navegação** | abre/fecha forms |
| **Evidência** | trecho dfm + pas com linhas |

## Gates

| Gate | Critério |
|------|----------|
| `evidencia` | linhas dfm + pas citadas |
| `handler` | corpo real do `.pas` |
| `briefing` | 1 parágrafo implementável |

## PROIBIDO

- Ler `.dfm` inteiro (32k linhas) num job
- Inventar handler ausente no `.pas`
- Atualizar batch JSON (orquestrador)
