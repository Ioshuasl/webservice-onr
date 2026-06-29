# Schema — batch-progress.md (vault Obsidian)

**Fonte de verdade do lote** para o orquestrador n8n. Um arquivo Markdown por integração/domínio no vault — **não** mais `scripts/aut*-batch-state.json`.

Mapa de paths: [batch-progress-paths.md](batch-progress-paths.md)  
Template vault: `Orius/integracoes/automacao/templates/_template-batch-progress-n8n.md`

---

## Por que Markdown no vault

| JSON (`scripts/`) | Markdown (vault) |
|-------------------|------------------|
| Difícil para IA ler/editar em lote | Nativo para agentes e humanos |
| Fora do Brain | Versionado no Obsidian + Git do vault |
| Sem Dataview/Kanban | Frontmatter + tabelas + plugins Obsidian |

**Legado:** arquivos `scripts/aut*-batch-state.json` permanecem só como referência histórica até migração manual. **Não criar novos JSON.**

---

## Localização

```text
Orius/integracoes/<produto-ou-central>/<integracao>/automacao/batch-progress.md
```

Ex.: `Orius/integracoes/registro-civil/onrcpn/automacao/batch-progress.md`

---

## Frontmatter (lote ativo)

```yaml
---
tipo: batch-progress
area: orius
plane_identifier: AUTONRCPN
plane_slug: autonrcpn
batch_id: onrcpn-1-13
status: pending          # pending | in_progress | complete | superseded
integration: onrcpn
upstream: REST/JSON
current: null            # AUTONRCPN-n ou null
started_at: null         # ISO8601 UTC
completed_at: null
context_root: "c:\\Users\\kenio\\automacoes e testes"
workflows_path: workflows/n8n/extensao-n8n-teste
postman_collection: postman/onrcpn-n8n/collection_postman.json
env_section: "ONRCPN — IdRC / Certidão Eletrônica"
vault_hub: Orius/integracoes/registro-civil/onrcpn
anchor: null             # plane_key do card âncora (auth), quando houver
tags: [batch, n8n, onrcpn]
atualizado: 2026-06-23
---
```

| Campo | Obrigatório | Descrição |
|-------|-------------|-----------|
| `plane_identifier` | ✅ | `AUTCNIB`, `AUTONRCPN`, … |
| `plane_slug` | ✅ | Slug Plane (`autonrcpn`) |
| `batch_id` | ✅ | Id do lote (`onrcpn-1-13`, `cnib-1-6`) |
| `status` | ✅ | Estado do lote inteiro |
| `current` | | Card em execução |
| `execution_order` | ✅ | Lista YAML no frontmatter **ou** seção dedicada no corpo |
| `integration` | ✅ | Tag curta: `cnib`, `onrcpn`, `see tjgo` |
| `vault_hub` | ✅ | Hub da integração no vault |

### `execution_order` no frontmatter (recomendado)

```yaml
execution_order:
  - AUTONRCPN-1
  - AUTONRCPN-6
  - AUTONRCPN-2
```

**Regra:** ordem real de implementação — **nunca** só ordem numérica 1…n.

---

## Corpo do arquivo

### 1. Resumo (tabela)

| Métrica | Valor |
|---------|-------|
| Cards total | 13 |
| Concluídos | 0 |
| Em progresso | 0 |
| Pendentes | 13 |

Atualizar a cada iteração do orquestrador.

### 2. Tabela mestre (Dataview-friendly)

Cada linha = um card. Colunas mínimas:

| plane_key | status | operacao | dominio | method | upstream | workflow_id | gates_ok |
|-----------|--------|----------|---------|--------|----------|-------------|----------|

`status`: `pending` | `in_progress` | `done` | `blocked`  
`gates_ok`: fração `5/7` ou checklist na seção do card.

### 3. Kanban (opcional — plugin Kanban)

```markdown
## Kanban

### pending
- [ ] AUTONRCPN-1 — CertificateJsonCreate

### in_progress
- [ ] 

### done
- [x] 
```

O orquestrador **deve** manter tabela mestre e Kanban sincronizados ao mover cards.

### 4. Seção por card (`### AUTONRCPN-n`)

```markdown
### AUTONRCPN-1

| Campo | Valor |
|-------|-------|
| card_title | [AUTONRCPN-1] (onrcpn) CertificateJsonCreate - Certidão |
| operacao | CertificateJsonCreate |
| dominio | Certidão |
| method | POST |
| upstream | https://certidaoh.registrocivil.org.br/api/v1.0/certificate-json |
| webhook | POST /onrcpn/certificate-json/create |
| utilizacao | Orius/integracoes/registro-civil/onrcpn/automacao/utilizacao/CertificateJsonCreate.md |
| desenvolvimento | .../desenvolvimento/CertificateJsonCreate.md |
| workflow_path | workflows/n8n/extensao-n8n-teste/Certificate Json Create ONRCPN.workflow.ts |
| workflow_id_n8n | |
| plane_url | http://.../issues/1 |
| started_at | |
| completed_at | |

**Gates:** vault ☐ · workflow ☐ · push ☐ · postman ☐ · sync ☐ · docs ☐ · payload ☐
```

Subagente **não** edita `batch-progress.md` — somente o orquestrador (gerente).

---

## Ciclo de vida (orquestrador)

| Fase | Ação no `batch-progress.md` |
|------|------------------------------|
| Iniciar lote | `status: in_progress`, preencher `execution_order`, cards `pending` |
| Iniciar card | `current: AUTONRCPN-n`, card `in_progress`, `started_at` ISO UTC |
| Fechar card | card `done`, gates ✅, `workflow_id_n8n`, mover no Kanban |
| Fechar lote | `status: complete`, `current: null`, `completed_at` |
| Novo lote mesmo domínio | Arquivo novo ou seção `## Lote anterior` + frontmatter `superseded` |

**Plane:** PATCH `start_date` / `target_date` a partir de `started_at` / `completed_at` (fuso `America/Sao_Paulo`) — ver [SKILL.md](SKILL.md) § Datas Plane.

---

## Dataview (exemplos opcionais)

```dataview
TABLE status, operacao, workflow_id_n8n
FROM "Orius/integracoes/registro-civil/onrcpn/automacao"
WHERE tipo = "batch-progress"
```

Para cards inline, preferir **tabela mestre** no próprio `batch-progress.md` (funciona sem Dataview).

---

## Migração desde JSON legado

1. Ler `scripts/aut{slug}-batch-state.json` (lote ativo).
2. Copiar template vault `_template-batch-progress-n8n.md`.
3. Transpor `execution_order`, `cards`, gates, `workflow_id_n8n`.
4. Marcar JSON como `superseded` no comentário do arquivo ou arquivar.
5. Atualizar orquestradores/skills para apontar só ao `.md`.

---

## Relacionado

- [batch-progress-paths.md](batch-progress-paths.md) — mapa domínio → path vault
- [batch-profiles.md](batch-profiles.md) — perfil por família
- [batch-state-schema.md](batch-state-schema.md) — **legado JSON** (deprecado)
