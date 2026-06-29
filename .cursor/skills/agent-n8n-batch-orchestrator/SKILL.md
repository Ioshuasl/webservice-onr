---
name: agent-n8n-batch-orchestrator
description: >-
  Orquestra lotes de cards n8n (AUTCNIB, AUTONRCPN, AUTSEETJGO, AUTOCRA, …) de forma autônoma:
  briefing vault, batch-progress.md no Obsidian, Plane in_progress/done, Postman sync,
  subagente por card, validação de gates. O orquestrador NÃO implementa workflows — só gerencia.
  Use com "orquestre batch", "integrar AUTONRCPN-1 a 13", @agent-n8n-batch-orchestrator.
disable-model-invocation: true
---

# Agent n8n Batch Orchestrator

Orquestrador de **lotes** de automação n8n Orius. Papel: **gerente** — divide pedidos, delega a especialistas, confere entrega. **Não** monta workflow, **não** edita nós, **não** faz push sozinho.

**Context root:** `c:\Users\kenio\automacoes e testes`

## Metáfora (obrigatória)

| Papel | Quem | Faz | Não faz |
|-------|------|-----|---------|
| **Gerente** | Este skill (chat principal) | Briefing, `batch-progress.md`, Plane, Postman sync, spawn subagente, validar gates, tabela por iteração | Implementar `.workflow.ts`, push, vault docs por card |
| **Especialista** | Subagente (`Task` / `generalPurpose`) | Um card = uma implementação ponta a ponta | Orquestrar lote, tocar outros cards |
| **Caixa/TI** | Scripts (`n8nac`, `npm run postman:*`) | Validação objetiva | Decidir escopo |

## Quando usar

- `"Orquestre o batch …"`, `"integrar AUTCNIB-2 a AUTCNIB-6"`, `"batch cra-127-142"`
- Lote com `execution_order` explícita (não ordem numérica do range)
- Retomar lote: abrir `batch-progress.md` do domínio (ver [batch-progress-paths.md](batch-progress-paths.md)) — `status` + `current`

**Não usar** para card único — use `@agent-n8n-orchestrator` + adapter de domínio.

## batch-progress.md — um arquivo por domínio (obrigatório)

Cada família Plane mantém **seu próprio** `batch-progress.md` no **vault Obsidian**. **Nunca** misturar domínios no mesmo arquivo.

Mapa completo: [batch-progress-paths.md](batch-progress-paths.md)  
Schema: [batch-progress-schema.md](batch-progress-schema.md)  
Template vault: `Orius/integracoes/automacao/templates/_template-batch-progress-n8n.md`

| Domínio | `plane_identifier` | `batch_progress` (vault) | Registry |
|---------|-------------------|--------------------------|----------|
| CNIB | AUTCNIB | `.../api-cnib-serventias/automacao/batch-progress.md` | `autcnib-work-items.json` |
| ONRCPN | AUTONRCPN | `.../onrcpn/automacao/batch-progress.md` | `autonrcpn-work-items.json` |
| SEE TJGO | AUTSEETJGO | `.../see-tjgo/automacao/batch-progress.md` | `autseetjgo-work-items.json` |
| CRA21 SOAP | AUTOCRA | `.../cra/webservice-soap/automacao/batch-progress.md` | `autocra-work-items.json` |
| ONR WSOficio | AUTONR | `.../webservice-wsoficio/automacao/batch-progress.md` | `autonr-work-items.json` |
| _(demais)_ | — | Ver [batch-progress-paths.md](batch-progress-paths.md) | `maps/{slug}-work-items.json` |

**Legado (não usar):** `scripts/aut*-batch-state.json` — apenas leitura para migração.

### Provisionar domínio novo

1. Duplicar template vault `_template-batch-progress-n8n.md` no `vault_hub` da integração.
2. Registrar path em [batch-progress-paths.md](batch-progress-paths.md) + [batch-profiles.md](batch-profiles.md).
3. Preencher `execution_order` e tabela de cards a partir do registry Plane (`Meta/integracoes/plane/maps/{slug}-work-items.json`).

**Não** rodar `npm run batch:ensure-domain` para novos lotes (gerava JSON legado).

## Skills obrigatórias do orquestrador

| Skill | Uso |
|-------|-----|
| [`obsidian-vault`](file:///C:/Users/kenio/.cursor/skills/obsidian-vault/SKILL.md) | Briefing vault, env.md, paths integração |
| [`agent-n8n-orchestrator`](../agent-n8n-orchestrator/SKILL.md) | 8 etapas, matriz Postman/sync |
| [`orius-n8n-integracoes`](../orius-n8n-integracoes/SKILL.md) | Pipeline workflow (delegado ao subagente) |
| [`padronizacao-nomenclatura-automacao`](../padronizacao-nomenclatura-automacao/SKILL.md) | Títulos `[IDENTIFICADOR-n]` |

Perfis por família: [batch-profiles.md](batch-profiles.md)  
Template prompt subagente: [subagent-prompt.md](subagent-prompt.md)  
Schema lote: [batch-progress-schema.md](batch-progress-schema.md)

---

## Fase 0 — Resolver lote

1. Identificar **família** (`AUTCNIB`, `AUTONRCPN`, `AUTOCRA`, …) pelo pedido ou prefixo do card.
2. Carregar perfil em [batch-profiles.md](batch-profiles.md): `batch_progress`, `plane_slug`, adapter, Postman, registry, anchor.
3. Abrir **`batch-progress.md`** do domínio ([batch-progress-paths.md](batch-progress-paths.md)).
   - Se **ausente** → criar a partir do template vault (§ Provisionar domínio).
4. Ler `execution_order` (frontmatter ou seção dedicada) — **nunca** ordem numérica implícita 1…n.
5. Pular cards com `status: done` na tabela mestre.

---

## Fase 1 — Briefing vault (orquestrador)

Consultar vault **antes** de criar batch ou disparar subagentes:

1. `Orius/desenvolvimento/padronizacao-n8n-autonr-plane-postman.md`
2. Índice da integração (perfil → `vault_hub`)
3. `automacao/roadmap-*-n8n.md` + `utilizacao/{operacao}.md` existentes
4. Registry Plane: `Meta/integracoes/plane/maps/{registry}.json`
5. `env.md` → seção credenciais do perfil (**sem copiar segredos** ao chat)
6. Classificar **upstream**: SOAP/XML vs REST/JSON (tabela no perfil)

**Entregável:** resumo do lote (cards, anchor, ordem, credenciais referenciadas, BLOCKERS B1–B7 do orquestrador).

---

## Fase 2 — batch-progress.md (por domínio)

**Um arquivo Markdown por domínio** no vault — ver [batch-progress-schema.md](batch-progress-schema.md).

O orquestrador **edita** o `.md` a cada iteração:

| Momento | Campos a atualizar |
|---------|-------------------|
| Início do lote | `status: in_progress`, `started_at`, tabela + Kanban |
| Início do card | `current`, card `in_progress`, `started_at` na seção do card |
| Fim do card | card `done`, gates, `workflow_id_n8n`, `completed_at`, resumo |
| Fim do lote | `status: complete`, `current: null`, `completed_at` |

Cada card na tabela mestre deve ter brief mínimo: `card_title`, `operacao`, `webhook`, `upstream`, paths `utilizacao`/`desenvolvimento`, `workflow_path` proposto.

Subagente **não** edita `batch-progress.md` — só o orquestrador.

---

## Fase 3 — Postman (orquestrador)

1. API key: vault `env.md` → **Postman — API key** → `POSTMAN_API_KEY` no `.env` local (gitignored)
2. Coleção: path do perfil (`postman_collection`)
3. Se o JSON da **coleção** não existir ou não for encontrado no path do perfil, o orquestrador pode **criar automaticamente** o arquivo base antes de delegar o card.
4. Se o JSON de **environment** do perfil existir, atualizar; se **não existir** ou **não for encontrado**, o orquestrador pode **criar automaticamente** o arquivo base.
5. Se `.postman-sync-{slug}.json` ausente: `npm run postman:sync:{slug}:create` (perfil), quando houver suporte de sync para a integração.
6. Antes do lote: `npm run postman:validate:naming -- <coleção>` (quando a coleção já existir ou tiver sido criada no passo 3)
7. Subagentes atualizam requests; orquestrador pode rodar `postman:sync:{slug}` após gates OK

**Regra de autonomia:** a criação automática vale **somente** para artefatos JSON locais do Postman (`collection*.json`, `environment*.json`) ausentes. Se o arquivo já existe, a skill deve **reaproveitar e editar** o existente.

---

## Fase 4 — Loop por card (`execution_order`)

Para cada `{IDENTIFICADOR}-n` com `status: "pending"` (ou retomar `in_progress` interrompido):

### 4.1 Orquestrador — preparar

1. `batch-progress.md`: `current = {IDENTIFICADOR}-n`, card `in_progress`, `started_at` se ausente; lote `status: in_progress` no primeiro card
2. **Plane → In Progress** (PATCH) + `start_date` (Brasil)
3. Montar prompt do subagente via [subagent-prompt.md](subagent-prompt.md) com brief da **seção do card** em `batch-progress.md`

### 4.2 Subagente — implementar (um card)

Lançar `Task` (`generalPurpose`) com prompt do template. **Aguardar conclusão** antes do próximo card.

Subagente **proibido** de: atualizar `plane_state` no registry, chamar `mark-plane-done`, iniciar outro card.

### 4.3 Orquestrador — validar gates (objetivo)

| Gate | Comando / verificação |
|------|------------------------|
| vault | `utilizacao/{operacao}.md` + `desenvolvimento/{operacao}.md` existem/atualizados |
| workflow | `npx --yes n8nac skills validate "<workflow_path>"` → exit 0 |
| push | `npx --yes n8nac push "<path>" --verify` + `workflow present <id>` |
| postman | Request na pasta proxy + coleção/environment existentes **ou criados automaticamente se ausentes** + `npm run postman:validate:naming -- <coleção>` |
| sync | `npm run n8n:sync:orius` OK; Postman Cloud = `partial` se sem `.postman-sync-*.json` |
| docs | `desenvolvimento/{operacao}.md` criado/revisado |
| payload | JSON de teste documentado na resposta do subagente |

**Não confiar** só na autoavaliação do subagente — rodar comandos no shell.

### 4.4 Orquestrador — fechar card

Se todos os gates OK (sync `partial` permitido):

1. `batch-progress.md`: card `done`, gates ✅, `workflow_id_n8n`, `workflow_path`, `completed_at` (ISO8601 UTC); atualizar Kanban
2. **Plane → Done** (PATCH direto — § Plane) + **`start_date`** e **`target_date`** (datas calendário Brasil)
3. Registry: `automation_status: done` **somente após** PATCH Plane OK
4. Tabela de gates na resposta ao usuário (uma linha por card da iteração)
5. Disparar **próximo** da `execution_order`

Se gate falhar → **BLOCKER** (parar lote). Ver § BLOCKERS.

---

## Fase 5 — Fechar lote

Quando todos os cards `done` no `batch-progress.md`:

- Frontmatter: `status: complete`, `current: null`, `completed_at`
- Opcional: arquivar lote em seção `## Histórico` e iniciar novo `batch_id`

Resumo final: tabela gates × cards, workflow IDs, links Postman/n8n.

---

## Plane — regras críticas (lição CRA-127-142)

**Nunca** confiar que registry = estado live no Plane.

1. **In Progress:** PATCH `state: PLANE_STATE_IN_PROGRESS` via `Meta/integracoes/plane/scripts/lib/plane-api.js` + `loadProject(plane_slug)`
2. **Done:** PATCH `state: PLANE_STATE_DONE` — **sempre**, mesmo se registry já diz `done`
3. **Datas obrigatórias** em todo PATCH de fechamento (e `start_date` ao iniciar) — ver § Datas Plane abaixo
4. **Não usar** `mark-plane-done.js` com skip quando subagente alterou registry
5. **Pausa** ≥ 400 ms entre PATCHes (evitar `429 RATE_LIMIT_EXCEEDED`)
6. Após PATCH Done, opcional: conferir estado live (script de auditoria) antes de avançar

```powershell
cd "C:\Users\kenio\Obsidian Vault\Meta\integracoes\plane\scripts"
node mark-plane-done.js --project <plane_slug> --plane-key <IDENTIFICADOR>-n
```

Preferir PATCH explícito se `mark-plane-done` puder pular por registry desatualizado.

### Datas Plane (`start_date` / `target_date`) — obrigatório

O time opera em **America/Sao_Paulo** (UTC−3). O Plane exibe **datas de calendário** (`YYYY-MM-DD`), não horário.

| Momento | Batch JSON (UTC) | Plane PATCH |
|---------|------------------|-------------|
| Início do card | `cards[{KEY}].started_at` | `start_date` |
| Fim do card | `cards[{KEY}].completed_at` | `target_date` |

**Regra:** nunca usar `.slice(0, 10)` em ISO UTC — converter para o **dia civil no Brasil**:

```javascript
function toBrazilDateOnly(isoUtc) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' })
    .format(new Date(isoUtc));
}
```

Exemplo: `2026-06-18T02:30:00.000Z` → `2026-06-17` (ainda dia 17 no Brasil).

**Ao fechar card (4.4), o PATCH Done deve incluir:**

```javascript
await patchWorkItem(instance, project, workItemId, {
  state: PLANE_STATE_DONE,
  start_date: toBrazilDateOnly(card.started_at),
  target_date: toBrazilDateOnly(card.completed_at),
});
```

**Ao iniciar card (4.1), o PATCH In Progress pode incluir** `start_date` (sem `target_date`).

**Retrofill datas Plane:** usar `started_at` / `completed_at` das seções de card no `batch-progress.md` (script `patch-plane-dates-from-batch.cjs` será adaptado para MD — até lá, PATCH manual).

Fonte de verdade temporal: timestamps nas seções de card em `batch-progress.md`.

---

## BLOCKERS (parar lote)

| BLOCKER | Ação |
|---------|------|
| `n8nac skills validate` falhou | Corrigir via subagente; não avançar |
| `n8nac push --verify` falhou | BLOCKER |
| Credencial ausente em `env.md` | BLOCKER — pedir ao usuário |
| Conflito n8n sem resolução | BLOCKER — perguntar `keep-current` vs `keep-incoming` |
| Adapter errado (ex. perfil `soap-cra` em lote CNIB REST) | BLOCKER |
| Plane 429 persistente | Pausar; retry com backoff |

**Não é BLOCKER:**

- Código de negócio upstream (CRA `10000`, CNIB 4xx de validação) com HTTP esperado em homologação
- `postman:sync:*` cloud ausente → gate `sync: partial`
- Workflow `active: false` (avisar usuário; não bloqueia lote)

---

## Invocação típica

```text
@agent-n8n-batch-orchestrator

Orquestre o lote em Orius/integracoes/registro-civil/onrcpn/automacao/batch-progress.md
(batch_id = onrcpn-1-13). Integre AUTONRCPN-1 a AUTONRCPN-13 seguindo execution_order.
Pule cards done.
```

```text
@agent-n8n-batch-orchestrator

Orquestre o lote em Orius/integracoes/see-tjgo/automacao/batch-progress.md.
Retome execution_order; pule cards done.
```

Ver também: `see-tjgo/orquestrador-see-tjgo-n8n.md` (atualizar para apontar ao vault).

---

## Tabela de gates (formato por iteração)

Ao fim de **cada** card, entregar:

| Card | vault | wf | push | postman | sync | docs | payload | workflow_id |
|------|-------|-----|------|---------|------|------|---------|-------------|
| AUTCNIB-2 | ✅ | ✅ | ✅ | ✅ | ⚠️ | ✅ | ✅ | `…` |

Legenda: ✅ OK · ⚠️ partial · ❌ falhou (BLOCKER)

---

## Referências

- Orquestrador unitário: [`agent-n8n-orchestrator`](../agent-n8n-orchestrator/SKILL.md)
- Matriz artefatos: [`routing-matrix.md`](../agent-n8n-orchestrator/routing-matrix.md)
- Mapa batch vault: [batch-progress-paths.md](batch-progress-paths.md)
- Schema: [batch-progress-schema.md](batch-progress-schema.md)
- Legado JSON: [batch-state-schema.md](batch-state-schema.md) (deprecado)
- Exemplo ativo: `Orius/integracoes/registro-civil/onrcpn/automacao/batch-progress.md`
