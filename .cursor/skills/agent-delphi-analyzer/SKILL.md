---
name: agent-delphi-analyzer
description: >-
  Subagente especialista em destrinchar um único símbolo do legado Delphi 7
  (IDE Embarcadero) — procedure,
  function, type, class, evento de form): variáveis, fluxo, SQL, chamadas,
  erros. Grava nota no Obsidian vault. Use quando o orquestrador disparar
  análise paralela pós-indexação em C:\Users\kenio\sistema-delphi.
disable-model-invocation: true
---

# Agent Delphi Analyzer

**Papel:** especialista de **destrinchamento** — **um símbolo por job**. Usa skills de domínio; persiste tudo no vault.

**Raiz código:** `C:\Users\kenio\sistema-delphi`

## Metáfora

| Papel | Este agente |
|-------|-------------|
| **Especialista** | Analisador — 1 procedure / 1 evento / 1 type por tarefa |
| **Gerente** | [`agent-delphi-orchestrator`](../agent-delphi-orchestrator/SKILL.md) |
| **Memória** | Obsidian vault — **não** confiar na memória do chat |

## Skills obrigatórias (ler integralmente)

1. [`skill-delphi`](../skill-delphi/SKILL.md)
2. [`skill-pas`](../skill-pas/SKILL.md) — seção *Analisador*
3. [`skill-dfm`](../skill-dfm/SKILL.md) — se job for evento/form
4. [`skill-dcu`](../skill-dcu/SKILL.md) — só para não analisar `.dcu`
5. [`obsidian-vault`](file:///C:/Users/kenio/.cursor/skills/obsidian-vault/SKILL.md)

Template vault: [`templates/_template-simbolo-pas`](file:///C:/Users/kenio/Obsidian%20Vault/Orius/desenvolvimento/legado-delphi/templates/_template-simbolo-pas.md)

## Entrada (do orquestrador)

| Campo | Exemplo |
|-------|---------|
| `product_slug` | `imoveis` |
| `unit` | `dmPedido` |
| `symbol` | `GravarPedido` |
| `symbol_type` | `procedure` |
| `path` | `RegistroDeImoveis/dmPedido.pas` |
| `line_start` / `line_end` | `2100` / `2280` |
| `manifest_path` | vault `.../manifest/dmPedido.symbols.json` |
| `dfm_context` | opcional — handler + componente |

## Antes de analisar

1. Ler manifest — confirmar que `symbol` existe com mesmas linhas (±5 tolerância)
2. Ler trecho **apenas** `line_start`…`line_end` do `.pas` (e handler `.dfm` se aplicável)
3. Consultar vault: notas de tabelas Firebird, centrais, produto
4. Se linhas não batem → `BLOCKER: manifest_desatualizado` — não inventar

## Saída obrigatória

### Nota vault do símbolo

| Tipo | Caminho |
|------|---------|
| procedure/function/type | `.../unidades/<Unit>/<Symbol>.md` |
| evento de form | `.../formularios/<Form>/<Handler>.md` |

Seções: ver [`skill-pas`](../skill-pas/SKILL.md) *Campos obrigatórios*.

### Atualizar índice pai

Link `[[<Symbol>]]` em `unidades/<Unit>.md` ou `formularios/<Form>.md` com `status: revisado` no link ou frontmatter da filha.

### Cruzamentos vault

- Tabela Firebird → wikilink nota existente em `banco-de-dados/`
- Central (ONR, CNIB, CRC…) → `integracoes/centrais/`
- Outra unit → `[[.../unidades/OutraUnit/OutroSymbol]]` (criar stub se ausente: só título + `status: pendente`)

### Retorno ao orquestrador

```markdown
## Análise — {Unit}.{Symbol}
- vault_path: ...
- linhas: ...
- tabelas_firebird: [...]
- chama: [...]
- chamado_por: [...] (preencher se identificável no trecho; senão pendente)
- gates: evidencia | sql | chamadas | briefing
- BLOCKERS: ...
```

## Gates de qualidade (autoavaliação)

| Gate | Critério |
|------|----------|
| `evidencia` | Trecho ≤30 linhas com número de linha real |
| `sql` | Toda query nomeada (`TIBQuery`, `SQL.Text`, `CommandText`) listada |
| `chamadas` | `Chama` / `Chamado por` sem nomes inventados |
| `briefing` | Seção acionável para dev no legado (Embarcadero IDE / Delphi 7) |
| `encoding` | Identificadores fiéis ao fonte |

## PROIBIDO

- Receber arquivo `.pas` inteiro quando manifest já define linhas
- Analisar mais de **um** símbolo por job
- Atualizar `delphi-batch-state.json`
- Orquestrar outros jobs
- Documentar conteúdo de `.dcu`

## Chunking (procedure gigante)

Se `line_end - line_start + 1` > **250**:

1. **Não** analisar neste skill — delegar ao orquestrador **Fase 2.5**
2. Usar [`agent-delphi-analyzer-segment`](../agent-delphi-analyzer-segment/SKILL.md) (~200 linhas/segmento)
3. Depois [`agent-delphi-analyzer-merge`](../agent-delphi-analyzer-merge/SKILL.md)

Se span ≤ 250: analisar normalmente neste job.

## PROIBIDO

- Resumir unit inteira numa única nota (exceto índice `unidades/<Unit>.md` com links)
- Inventar procedure que não está no manifest
- Documentar `.dcu` como se fosse fonte
- Analisar > 250 linhas sem pipeline de segmentos
