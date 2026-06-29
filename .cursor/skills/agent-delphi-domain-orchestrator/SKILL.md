---
name: agent-delphi-domain-orchestrator
description: >-
  Gerente de domínio do mapeamento legado Delphi: executa execution_order de um
  domínio (ri-core-pedido, ri-onr-pix) no ecosystem JSON, aplica triage,
  delega indexação/análise por arquivo. Use com "continue domínio ri-core-pedido",
  gerente domínio imoveis, @agent-delphi-domain-orchestrator.
disable-model-invocation: true
---

# Agent Delphi Domain Orchestrator

**Papel:** **gerente de cafeteria domínio** — entre o diretor (ecosystem) e o gerente de arquivo (`agent-delphi-orchestrator`). Não destrincha código; coordena um `domain_id` de ponta a ponta.

**Estado:** `scripts/delphi-<slug>-ecosystem-state.json` + `scripts/delphi-<slug>-batch-state.json`

## Hierarquia

```
Diretor → agent-delphi-ecosystem-orchestrator
    └── Domínio (este skill) → domain_id ex. ri-core-pedido
            └── Arquivo → agent-delphi-orchestrator
                    └── Símbolo / evento → analyzer | analyzer-dfm | segment | merge
```

## Skills obrigatórias

1. [`skill-delphi`](../skill-delphi/SKILL.md)
2. [`agent-delphi-ecosystem-orchestrator`](../agent-delphi-ecosystem-orchestrator/SKILL.md) — triage, domínios
3. [`agent-delphi-orchestrator`](../agent-delphi-orchestrator/SKILL.md) — fases por arquivo
4. [`obsidian-vault`](file:///C:/Users/kenio/.cursor/skills/obsidian-vault/SKILL.md)

Prompt: [subagent-prompt-domain.md](subagent-prompt-domain.md)

## Entrada

| Campo | Exemplo |
|-------|---------|
| `product_slug` | `imoveis` |
| `domain_id` | `ri-core-pedido` |
| `batch_id` | `imoveis-dmPedido-poc` (opcional — usa `active_file_batch_id`) |
| `symbols_per_lot` | `15` (só `analyze_action: full`) |

## Fluxo por domínio

### 1. Bootstrap

1. Ler `delphi-<slug>-ecosystem-state.json` → `domains[domain_id]`
2. Definir `active_domain_id` e `status: in_progress`
3. Ler `execution_order` do domínio

### 2. Por arquivo (ordem do domínio)

| Extensão | Script Fase 0 | Gerente |
|----------|---------------|---------|
| `.pas` | `npm run delphi:extract -- --file … --sync-vault --update-batch` | `agent-delphi-orchestrator` |
| `.dfm` | `npm run delphi:extract-dfm -- --file … --sync-vault --update-batch` | `agent-delphi-orchestrator` + `agent-delphi-analyzer-dfm` |

**Ordem:** `.pas` pareado **antes** do `.dfm` (cruzamento handlers).

### 3. Triage (obrigatório após index)

```bash
npm run delphi:apply-triage -- --product-slug imoveis --file <path>
```

Respeitar `analyze_action`:
- `full` → fila de análise
- `stub` → nota mínima ou pular se T4
- `skip` / `skip_analyze` / `nested_in` → não analisar

### 4. Lotes de análise

- **PAS:** até **5** símbolos `full` pendentes por lote
- **DFM:** até **10** eventos `priority` ou críticos por lote → `agent-delphi-analyzer-dfm`
- **Segmentos:** série 1 por símbolo >250L

### 5. Métricas e fechamento

```bash
npm run delphi:report-coverage -- --product-slug imoveis --sync-vault
```

Atualizar `domains[domain_id].files_done` via ecosystem `file_progress`.

Quando todos os arquivos do domínio `analyze_status: done` → `domains[domain_id].status: done`.

## Retomada

Nunca reiniciar símbolos/eventos `done`. Ler `00-cobertura.md` no vault para progresso real.

## PROIBIDO

- Reiniciar domínio do zero com arquivos já `done`
- Analisar símbolos `skip` / `nested_in`
- Paralelizar segmentos do mesmo símbolo
