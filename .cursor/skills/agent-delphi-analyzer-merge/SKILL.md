---
name: agent-delphi-analyzer-merge
description: >-
  Subagente que consolida notas segment-NN.md e _handoff.json em uma nota final
  do símbolo Delphi (procedure gigante). Use após todos os segmentos done.
disable-model-invocation: true
---

# Agent Delphi Analyzer — Merge

**Papel:** produzir a nota **final** `unidades/<Unit>/<Symbol>.md` a partir dos segmentos — **sem reler o `.pas` inteiro**.

## Quando usar

Todos os segmentos em `_segment-plan.json` com `status: done` e `_handoff.json` presente.

## Skills obrigatórias

1. [`skill-delphi`](../skill-delphi/SKILL.md)
2. [`skill-pas`](../skill-pas/SKILL.md)
3. [`agent-delphi-analyzer`](../agent-delphi-analyzer/SKILL.md) — seções da nota final
4. [`obsidian-vault`](file:///C:/Users/kenio/.cursor/skills/obsidian-vault/SKILL.md)

## Entrada

| Campo | Exemplo |
|-------|---------|
| `symbol`, `unit`, `file_path` | `Prenotar`, `dmPedido`, … |
| `line_start`, `line_end` | 4803, 6247 (símbolo completo) |
| `segment_dir` | vault `.../unidades/dmPedido/Prenotar/` |
| `segment_count` | 8 |

## Fontes (ler nesta ordem)

1. `_segment-plan.json`
2. `_handoff.json` (estado final)
3. `segment-01.md` … `segment-NN.md` (todas)
4. Declaração na interface — **só** assinatura (manifest ou `unidades/<Unit>.md`)

**Não** abrir `dmPedido.pas` salvo para confirmar assinatura (≤5 linhas na interface).

## Saída — nota final

`.../unidades/<Unit>/<Symbol>.md`

Seções completas (skill-pas): Localização, Assinatura, Resumo **global**, Parâmetros, Efeitos colaterais **consolidados**, SQL/tabelas **deduplicadas**, Erros, Chama, Chamado por, Regras de negócio, Evidência (2–3 trechos curtos de segmentos distintos), Briefing implementação.

Frontmatter nota **final**:

```yaml
status: revisado
fonte: agent-delphi-analyzer-merge
segmentos: 8
linhas: 4803-6247
```

### Notas de segmento (`segment-NN.md`)

Após merge aprovado, segmentos passam a **referência** — não são fonte primária para debug:

```yaml
status: referencia
fonte: agent-delphi-analyzer-segment
```

Automatizar:

```bash
npm run delphi:sync-segment-status -- --product-slug imoveis --unit dmPedido --symbol Prenotar
```

Na nota final, linkar segmentos com texto explícito que são detalhamento histórico:

```markdown
## Detalhamento por segmento (referência)

> Segmentos com `status: referencia` — usar esta nota (merge) para debug.

- [[Prenotar/segment-01]] … [[Prenotar/segment-08]]
```

### Subnotas

## Gates merge

| Gate | Critério |
|------|----------|
| `cobertura` | Todos segmentos linkados |
| `sql` | União deduplicada de todos segmentos |
| `fluxo` | Resumo global coerente com handoff final |
| `briefing` | Acionável para debug/implementação |
| `sem_contradicao` | Sem trechos conflitantes entre segmentos |

## Retorno ao orquestrador

```markdown
## Merge — {Unit}.{Symbol}
- vault_path: .../Prenotar.md
- segments_merged: 8
- gates: cobertura | sql | fluxo | briefing
- merge_status: done
```

## PROIBIDO

- Reler 1400+ linhas do `.pas` de uma vez
- Ignorar segmento `pending`
- Atualizar batch JSON

## Template

[subagent-prompt-analyzer-merge.md](../agent-delphi-orchestrator/subagent-prompt-analyzer-merge.md)
