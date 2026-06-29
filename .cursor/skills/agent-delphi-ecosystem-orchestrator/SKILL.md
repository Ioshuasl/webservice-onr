---
name: agent-delphi-ecosystem-orchestrator
description: >-
  Meta-orquestrador (diretor) do mapeamento legado Delphi: ecossistema de
  cafeterias Produto → Domínio → Arquivo → Símbolo. Retomável por JSON, horas
  de execução. Use com "mapear RegistroDeImoveis inteiro", "continue ecossistema
  imoveis", @agent-delphi-ecosystem-orchestrator.
disable-model-invocation: true
---

# Agent Delphi Ecosystem Orchestrator

**Papel:** **Diretor** do ecossistema — não destrincha código, não indexa, não analisa. Delega **gerentes de cafeteria** por produto/domínio; valida progresso; retoma lotes interrompidos.

**Raiz código:** `C:\Users\kenio\sistema-delphi`  
**Estado:** `scripts/delphi-<slug>-ecosystem-state.json`  
**Vault hub:** `Orius/desenvolvimento/legado-delphi/produtos/<slug>/`

## Metáfora — ecossistema de cafeterias

```
Diretor (este skill)
 └── Cafeteria PRODUTO (RegistroDeImoveis)     → agent-delphi-orchestrator (produto)
      └── Cafeteria DOMÍNIO (pedido-core, onr, eridf…)  → [`agent-delphi-domain-orchestrator`](../agent-delphi-domain-orchestrator/SKILL.md)
           └── Cafeteria ARQUIVO (dmPedido.pas)           → batch file JSON
                └── Especialistas (indexer, analyzer, analyzer-dfm, segment, merge)
```

| Nível | Quem | Estado | Paralelo |
|-------|------|--------|----------|
| **0 Diretor** | Este skill | `*-ecosystem-state.json` | 1 produto ativo |
| **1 Produto** | `agent-delphi-orchestrator` | `delphi-imoveis-batch-state.json` (vários batches) | 1 domínio ativo |
| **2 Domínio** | [`agent-delphi-domain-orchestrator`](../agent-delphi-domain-orchestrator/SKILL.md) | `domains[id]` no ecosystem | 1 arquivo ativo por vez |
| **3 Arquivo** | Batch arquivo (atual POC) | `symbols` por `.pas` | 3–5 **símbolos** (≤250L) |
| **4 Símbolo** | analyzer / segment / merge | vault + handoff | segmentos **em série** |

**Regra de ouro:** paralelo em **fronteiras de arquivo**; série dentro de **segmentos do mesmo símbolo**.

---

## Escala — RegistroDeImoveis (realista)

| Métrica | Valor |
|---------|-------|
| Arquivos fonte | ~920 (`.pas` + `.dfm` + `.dpr`) |
| `.pas` | 460 (~438k linhas) |
| Só `dmPedido.pas` | 157 símbolos; progresso em `00-cobertura.md` |

**Impossível** num único chat. **Possível** com:

1. **Triage** (nem tudo com mesma profundidade)
2. **Batches retomáveis** (JSON + vault)
3. **Runner autônomo** (`delphi:run-ecosystem`) — ver abaixo
4. **Scripts** (Fase 0 determinística) antes da IA

---

## Runner autônomo (kickoff único)

**Prompt do usuário:** destrinchar todo `RegistroDeImoveis` com qualidade máxima.

```bash
npm run delphi:ensure-product -- --product-slug imoveis --init-domains
npm run delphi:run-ecosystem:init
npm run delphi:run-ecosystem:imoveis   # repetir; exit 2 = lote IA
```

| Exit | Ação |
|------|------|
| `0` | Tick OK — rodar de novo |
| `2` | Abrir `registro-imoveis/runner-next-prompt.md` → executar lote no Cursor → rodar de novo |
| `1` | Erro — corrigir e retomar |

Schema: [runner-state-schema.md](runner-state-schema.md) · Kickoff: `registro-imoveis/runner-kickoff.md`

O runner executa **sozinho:** index, triage, validate, cobertura, grafo (fim domínio).  
**Pausa para IA:** lotes de 15 símbolos / 10 eventos — `done` só com `validation_pass: true`.

---

## Triage — profundidade por tier

| Tier | O quê | Profundidade | Exemplo RI |
|------|-------|--------------|------------|
| **T0** | `.dpr`, vendor, cópias, `dependencias/` | inventário só | `ResponsiveListDemo.dpr` → `skip` |
| **T1** | `dm*`, forms principais, `Pedido.pas` | completa + segmentos | `dmPedido`, `Pedido` |
| **T2** | `ws*`, integrações | completa (SQL + central vault) | `dmONR`, `wsOficio/` |
| **T3** | Frames | média | `FrameDoi_Reg` |
| **T4** | `sql*CalcFields`, `AfterScroll` | **stub** (1 parágrafo + link dataset) | dezenas em `dmPedido` |
| **T5** | `.dfm` sem lógica nova | índice eventos → link `.pas` | formulários auxiliares |

T4 reduz ~40% do volume em data modules sem perder debug de negócio.

Config: `ecosystem-state.json` → `triage_rules` por glob (`sql*CalcFields` → T4).

**Automatizar (obrigatório antes de lotes grandes):**

```bash
npm run delphi:apply-triage -- --product-slug imoveis
npm run delphi:report-coverage -- --product-slug imoveis --sync-vault
```

Script: `scripts/apply-delphi-triage.cjs` — grava `analyze_tier`, `analyze_action`, `nested_in`, `needs_split` em cada símbolo do batch + sync `file_progress` no ecosystem JSON.

Métricas: vault `produtos/<slug>/00-cobertura.md` via `scripts/report-delphi-coverage.cjs`.

**P2 — validação e grafo (após lote de análise):**

```bash
npm run delphi:validate-symbol -- --product-slug imoveis --file <path> --all-done --update-batch
npm run delphi:build-grafo -- --product-slug imoveis --sync-vault
```

Consulta debug: [`agent-delphi-debug`](../agent-delphi-debug/SKILL.md) · agente Copilot: `.github/agents/delphi-ecosystem-orchestrator.agent.md`

---

## Domínios sugeridos — RegistroDeImoveis

Derivados de `inventario-fontes.json` + pastas:

| `domain_id` | Pastas / foco | Prioridade |
|-------------|---------------|------------|
| `ri-core-pedido` | `dmPedido`, `Pedido`, frames pedido | P0 |
| `ri-onr-pix` | `geral_sistemas/wsgeral/dmONR*`, `dmPix`, `wsOficio/` | P1 |
| `ri-cnib` | `dmCNIB` | P1 |
| `ri-certidao-relatorio` | certidão, FastReport, `VisualizaRelatorios` | P2 |
| `ri-eridf` | `eridf/ws*` | P2 |
| `ri-geral-ri` | `geral_ri/` | P2 |
| `ri-matricula-online` | `wsONR/WSMatricula*` | P3 |
| `ri-restante` | `other` do inventário | P3 |

Cada domínio = um **batch_id** no ecosystem state com `execution_order` de arquivos.

---

## Estado — ecosystem JSON

Schema: [ecosystem-state-schema.md](ecosystem-state-schema.md)

Arquivo: `scripts/delphi-imoveis-ecosystem-state.json`

```json
{
  "product_slug": "imoveis",
  "product_path": "RegistroDeImoveis",
  "active_domain_id": "ri-core-pedido",
  "status": "in_progress",
  "domains": {
    "ri-core-pedido": {
      "priority": "P0",
      "status": "in_progress",
      "files_total": 45,
      "files_done": 1,
      "execution_order": ["RegistroDeImoveis/dmPedido.pas", "Pedido.pas", "..."],
      "current_file": "RegistroDeImoveis/dmPedido.pas",
      "active_file_batch_id": "imoveis-dmPedido-poc"
    }
  }
}
```

O **diretor** só avança `active_domain_id` quando domínio anterior atinge `files_done === files_total` (ou `partial` aceito com flag).

---

## Fluxo do diretor (Fase E0–E3)

### E0 — Bootstrap (uma vez por produto)

1. `npm run delphi:sync-tree -- --product-slug imoveis`
2. Criar `delphi-imoveis-ecosystem-state.json` a partir de domínios + inventário
3. Vault: `produtos/imoveis/ecossistema/00-plano-cobertura.md`

### E1 — Por domínio (loop externo)

1. Escolher próximo domínio `P0` → `P3` com `status != done`
2. Spawn **gerente domínio** (subagente com `agent-delphi-orchestrator` + escopo domínio)
3. Gerente cria/ativa batches por arquivo

### E2 — Por arquivo (gerente domínio = cafeteria arquivo)

Para cada `.pas` no domínio:

1. `npm run delphi:extract -- --file ... --sync-vault --update-batch`
2. Aplicar triage → marcar T4 como `analyze_tier: stub`
3. Analisar T1/T2 (segmentar se >250L)
4. Parear `.dfm` se existir (indexador DFM)

### E3 — Retomar após horas / novo chat

```
@agent-delphi-ecosystem-orchestrator
Continue ecossistema imoveis — ler scripts/delphi-imoveis-ecosystem-state.json
e retomar active_domain_id sem reprocessar done.
```

**Nunca** reindexar arquivo com `index_status: done` salvo `--force`.

---

## Prompt operacional (produto inteiro)

Repo: [`registro-imoveis/hands-off-supervisor.md`](../../registro-imoveis/hands-off-supervisor.md) · painel: [`batch-progress.md`](../../registro-imoveis/batch-progress.md)

Entrada do usuário:

> Mapeie todo o RegistroDeImoveis para debug futuro. Pode levar horas; retome de onde parar.

---

## Skills do ecossistema

| Nível | Skill |
|-------|-------|
| Diretor | **Este skill** |
| Produto/arquivo | [`agent-delphi-orchestrator`](../agent-delphi-orchestrator/SKILL.md) |
| Indexador | [`agent-delphi-indexer`](../agent-delphi-indexer/SKILL.md) |
| Analisador | [`agent-delphi-analyzer`](../agent-delphi-analyzer/SKILL.md) |
| Segmento | [`agent-delphi-analyzer-segment`](../agent-delphi-analyzer-segment/SKILL.md) |
| Merge | [`agent-delphi-analyzer-merge`](../agent-delphi-analyzer-merge/SKILL.md) |

---

## Estimativa honesta (RI completo)

| Cenário | Ordens de grandeza |
|---------|-------------------|
| T1+T2 full (~80 arquivos × média 30 símbolos) | centenas de jobs IA + dezenas de segmentações |
| Com T4 stub em dmPedido sozinho | −~60 jobs |
| Tempo | **várias sessões** (não um chat contínuo de 8h) |

O vault cresce incrementalmente — consultas futuras melhoram a cada domínio fechado.

---

## BLOCKER diretor

- `inventario-fontes.json` ausente → rodar `delphi:sync-tree`
- Domínio sem `execution_order`
- Reprocessar arquivo `done` sem `--force`

## NÃO é BLOCKER

- Domínio `partial` (ex. dmPedido 8/157 — continuar fase 2)
- `chamado_por` vazio
- Sessão Cursor encerrada (retomar via JSON)
