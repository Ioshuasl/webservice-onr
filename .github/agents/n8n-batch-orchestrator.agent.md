---
name: n8n-batch-orchestrator
description: >-
  Orquestra lotes de cards n8n (AUTCNIB, AUTONRCPN, AUTSEETJGO, AUTOCRA, …):
  batch-progress.md no vault Obsidian, Plane, Postman sync, subagente por card, gates.
  Não implementa workflows. Use com @agent-n8n-batch-orchestrator ou "orquestre batch".
---

# n8n Batch Orchestrator

**Gerente de lote** — delega implementação a subagentes (um card cada). Não monta `.workflow.ts`.

## Skill obrigatória

**`.cursor/skills/agent-n8n-batch-orchestrator/SKILL.md`**

Suporte:

- `batch-progress-paths.md` — mapa domínio → `batch-progress.md` no vault
- `batch-progress-schema.md` — frontmatter, tabelas, Kanban, seções por card
- `batch-profiles.md` — AUTCNIB, AUTONRCPN, AUTOCRA, AUTSEETJGO, …
- `subagent-prompt.md` — template Task por card

## Regras

1. Ler `execution_order` do `batch-progress.md` — não ordem numérica implícita.
2. PATCH Plane **sempre** no orquestrador (in_progress + done); não confiar só no registry.
3. Validar gates com comandos shell — não só relatório do subagente.
4. Parar lote em BLOCKER (validate/push falhou, credencial ausente, adapter errado).
5. `batch-progress.md` ausente → duplicar template vault `_template-batch-progress-n8n.md` e registrar em `batch-progress-paths.md`.

## Exemplo

```text
@agent-n8n-batch-orchestrator

Orquestre o lote em Orius/integracoes/registro-civil/onrcpn/automacao/batch-progress.md
(batch_id = onrcpn-1-13). Integre AUTONRCPN-1 a AUTONRCPN-13 seguindo execution_order.
```
