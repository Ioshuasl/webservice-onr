# Orquestrador — SEE TJGO n8n (batch AUTSEETJGO-1…25)

Copie o bloco **Prompt único** abaixo em um novo chat com **Multitask Mode** ativo.

## Delegação por card (subagentes)

O orquestrador **gerencia**; o especialista **implementa** um card por vez. Use esta ordem de preferência:

| Prioridade | Mecanismo | Quando usar |
|------------|-----------|-------------|
| **1** | `Task` · `generalPurpose` **sem** `model` | Padrão — subagente nativo Cursor; prompt em [subagent-prompt.md](../.cursor/skills/agent-n8n-batch-orchestrator/subagent-prompt.md) |
| **2** | `Task` · `generalPurpose` + `model` explícito | Opcional — só se cota on-demand disponível e quiser modelo premium |
| **2b** | `Task` · `explore` / `shell` | Pesquisa ou gates isolados (não substitui implementação ponta a ponta) |
| **3** | Implementação **inline** no chat do orquestrador | `Task` indisponível de forma persistente; orquestrador valida gates no shell |

### Subagentes nativos vs modelos

- **Modelos on-demand** (`gpt-5.3-codex`, `claude-4.6-sonnet`, etc.): passar `model` no `Task` consome cota mensal; ao esgotar, **não** parar o lote.
- **Nativos Cursor**: `Task` com `generalPurpose` **sem** parâmetro `model`, ou `explore` (pesquisa/read-only) / `shell` (comandos). Não dependem da mesma cota de modelos premium.
- **Multitask Mode**: com o modo ativo, cada `Task` roda em subprocesso isolado; aguardar conclusão antes do próximo card (passo 4 do prompt).

### Resolver `plane_work_item_id` (cards 14–25)

O registry `autseetjgo-work-items.json` pode estar incompleto. **Sempre** conferir estado live:

```bash
cd "C:\Users\kenio\Obsidian Vault\Meta\integracoes\plane\scripts"
node -e "
const { loadInstanceEnv, loadProject } = require('./lib/plane-config');
const { listAllWorkItems } = require('./lib/plane-api');
(async () => {
  const items = await listAllWorkItems(loadInstanceEnv(), loadProject('autseetjgo'));
  const w = items.find(i => i.sequence_id === 22);
  console.log(w && { id: w.id, name: w.name, state: w.state });
})();
"
```

## Modelo 1:1 (pós-refatoração)

| Conceito | Significado |
|----------|-------------|
| **25 cards Plane** | `AUTSEETJGO-1` … `AUTSEETJGO-25` — número = `plane_sequence_id` (imutável no Plane) |
| **25 endpoints OpenAPI** | Catálogo canônico `seq` 1…25 em `scripts/see-tjgo-endpoints.cjs` |
| **1 workflow = 1 endpoint** | Cada card proxy exatamente um path/método upstream |
| **`[AUTSEETJGO-n]`** | Sempre `plane_sequence_id` — **não** confundir com `canonical_seq` do OpenAPI |
| **Lote ativo** | `seetjgo-1-25` (legado `seetjgo-1-13` → `status: superseded`) |

## Artefatos provisionados

| Item | Caminho |
|------|---------|
| Batch progress (vault) | `Orius/integracoes/see-tjgo/automacao/batch-progress.md` (`batch_id`: `seetjgo-1-25`) |
| Catálogo endpoints | `scripts/see-tjgo-endpoints.cjs` (`PLANE_SEQ_OPERACAO`, `BATCH_EXECUTION_ORDER`) |
| Rebuild batch | Migrar de `scripts/autseetjgo-batch-state.json` → vault `batch-progress.md` (legado) |
| Specs vault (1:1) | `Orius/integracoes/see-tjgo/endpoints/{method}-{path}.md` |
| Automação vault | `Orius/integracoes/see-tjgo/automacao/utilizacao/` + `desenvolvimento/` |
| Índice vault | `Orius/integracoes/see-tjgo/00-indice.md`, `automacao/00-indice-automacao.md` |
| Domínio batch | [batch-progress-paths.md](../.cursor/skills/agent-n8n-batch-orchestrator/batch-progress-paths.md) → `autseetjgo` |
| Perfil | `.cursor/skills/agent-n8n-batch-orchestrator/batch-profiles.md` § AUTSEETJGO |
| Registry Plane | vault `Meta/integracoes/plane/maps/autseetjgo-work-items.json` (conferir live para seq > 13) |
| Template subagente | `.cursor/skills/agent-n8n-batch-orchestrator/subagent-prompt.md` |
| Postman proxy | `postman/see-tjgo/collection_postman.json` |
| Postman upstream | `see-tjgo/Portal de Sistemas do Extrajudicial - CGJ GO.postman_collection.json` |
| Credenciais | vault `env.md` § **SEE TJGO — API Sistema Extrajudicial (CGJ GO)** |

---

## Prompt único (copiar abaixo)

```text
@.cursor/skills/agent-n8n-batch-orchestrator/SKILL.md
@.cursor/skills/agent-n8n-orchestrator/SKILL.md
@c:\Users\kenio\.cursor\skills\obsidian-vault\SKILL.md

Orquestre o lote em Orius/integracoes/see-tjgo/automacao/batch-progress.md
(batch_id = seetjgo-1-25).

Leia execution_order do batch — NÃO use ordem numérica 1…25.
Fonte canônica: BATCH_EXECUTION_ORDER em scripts/see-tjgo-endpoints.cjs.

Pule cards com status "done".

Para cada AUTSEETJGO na execution_order com status "pending":

1. Atualize batch-progress.md: current = AUTSEETJGO-n, status card = "in_progress",
   started_at do card se ausente; batch.status = "in_progress" e started_at no primeiro card.
2. Marque card Plane (projeto autseetjgo) como In Progress (PATCH via plane-api.js).
   Resolver plane_work_item_id: registry autseetjgo-work-items.json OU listAllWorkItems live
   (sequence_id = n do card). Não confiar só no registry para AUTSEETJGO-14…25.
3. Delegue AUTSEETJGO-n a um especialista (um card por subprocesso):
   a) Montar prompt com template .cursor/skills/agent-n8n-batch-orchestrator/subagent-prompt.md
      e brief de batch.cards[AUTSEETJGO-n]:
      - card_title, operacao, dominio, direcao, method, webhook, upstream, see_spec
      - utilizacao, desenvolvimento, workflow_path proposto
      - canonical_seq (OpenAPI) vs plane_sequence_id (card) — ver catálogo
   b) Disparar subagente — ordem de tentativa:
      1º Task generalPurpose (SEM parâmetro model — subagente nativo Cursor)
      2º Se precisar de modelo premium e cota disponível: Task generalPurpose + model explícito
      3º Se Task indisponível: implementar inline no orquestrador (mesmo brief + skills)
   c) Skills obrigatórias do especialista:
      @.cursor/skills/agent-n8n-orchestrator/SKILL.md
      @.agents/skills/n8n-architect/SKILL.md
      @c:\Users\kenio\.cursor\skills\obsidian-vault\SKILL.md
   d) Referência REST (não é skill): Auth CNIB.workflow.ts, *RIB.workflow.ts,
      workflows SEE já implementados (Sessions, Cartorios Listar, Distribuicao Atos Listar, etc.)
   e) Proibido no especialista: agent-onr-n8n-soap, agent-cra-n8n-soap (SEE é REST→REST);
      atualizar batch-progress.md, PATCH Plane, alterar registry de outros cards
   f) Credenciais: vault env.md § "SEE TJGO — API Sistema Extrajudicial (CGJ GO)"
      (SEE_TJGO_EMAIL, SEE_TJGO_PASSWORD, SEE_TJGO_HASH_CARTORIO,
      SEE_TJGO_API_BASE_URL, SEE_TJGO_API_BASE_URL_HML, SEE_TJGO_AMBIENTE) — nunca commitar
   g) AUTSEETJGO-1 (anchor): Sessions SEE TJGO.workflow.ts — demais com auth usam Bearer
   h) Spec 1:1: batch.cards[].see_spec → Orius/integracoes/see-tjgo/endpoints/
4. Aguarde conclusão do especialista (Task ou inline) antes do próximo card.
   Limite de modelo on-demand NÃO é BLOCKER — usar subagente nativo ou inline.
5. Valide gates objetivos no card:
   - vault: utilizacao + desenvolvimento em Orius/integracoes/see-tjgo/automacao/
   - workflow: n8nac skills validate OK
   - push: n8nac push --verify + workflow_id gravado
   - postman: request em postman/see-tjgo/collection_postman.json pasta "n8n — proxy SEE TJGO"
     + npm run postman:validate:naming -- postman/see-tjgo/collection_postman.json
   - sync: n8n:sync:orius (postman:sync:seetjgo = partial se .postman-sync-seetjgo.json ausente)
   - docs: desenvolvimento/{operacao}.md revisado (alinhado à see_spec do endpoint)
   - payload: JSON de teste entregue (Bearer após Sessions, exceto cards sem auth)
6. Se todos os gates OK: card status "done", gates atualizados,
   workflow_id_n8n + workflow_path preenchidos,
   Meta/integracoes/plane/maps/autseetjgo-work-items.json automation_status = done,
   Plane PATCH Done (sempre conferir estado live — não confiar só no registry).
7. Só então dispare o próximo da execution_order.

Ao concluir os 25 cards: batch status "complete", current = null, completed_at = now.

execution_order (seetjgo-1-25 — não reordenar sem atualizar catálogo + rebuild):

AUTSEETJGO-1 → 5 → 6 → 7 → 3 → 4 → 15 → 16 → 17 → 18 → 19 → 9 → 8 → 22 → 10 → 23 → 11 → 24 → 25 → 12 → 14 → 20 → 21 → 2 → 13

Tabela upstream por card (plane_sequence_id = AUTSEETJGO-n):

| Card | Operação | Upstream SEE TJGO | Auth Bearer |
|------|----------|-------------------|-------------|
| AUTSEETJGO-1 | Sessions | POST /sessions (form: email, password, hash_cartorio) | — (anchor JWT) |
| AUTSEETJGO-2 | Status | GET /status | — (público) |
| AUTSEETJGO-3 | CartoriosListar | GET /cartorios | sim |
| AUTSEETJGO-4 | TipoAtosDisponiveis | GET /tipo_atos/disponiveis | sim |
| AUTSEETJGO-5 | DistribuicaoAtosPedir | POST /distribuicao_de_atos | sim |
| AUTSEETJGO-6 | DistribuicaoAtosDownload | GET /distribuicao_de_atos/{id}/download | sim |
| AUTSEETJGO-7 | ControleAtosRecebidos | POST /controle_atos_recebidos (campo arquivo JSON) | sim |
| AUTSEETJGO-8 | ControleAtosRecebidosDetalhe | GET /controle_atos_recebidos/{id} | sim |
| AUTSEETJGO-9 | DistribuicaoAtosPendentes | GET /distribuicao_de_atos/pendentes | sim |
| AUTSEETJGO-10 | ControleAtosUtilizadosListar | GET /controle_de_atos_utilizados | sim |
| AUTSEETJGO-11 | ControleAtosInutilizar | PUT /controle_de_atos_utilizados/{codigo_do_ato}/inutilizar | sim |
| AUTSEETJGO-12 | DistribuicaoAtosRollback | DELETE /distribuicao_de_atos/{id} | sim |
| AUTSEETJGO-13 | CorreicaoAtualizarAcesso | POST /empresas_correicao/atualizar_dados_acesso | — |
| AUTSEETJGO-14 | CartoriosDetalhe | GET /cartorios/{hash_cartorio} | sim |
| AUTSEETJGO-15 | TipoAtosListar | GET /tipo_atos | sim |
| AUTSEETJGO-16 | TipoAtosIndisponiveis | GET /tipo_atos/indisponiveis | sim |
| AUTSEETJGO-17 | TipoAtosDetalhe | GET /tipo_atos/{id} | sim |
| AUTSEETJGO-18 | DistribuicaoAtosListar | GET /distribuicao_de_atos | sim |
| AUTSEETJGO-19 | DistribuicaoAtosDetalhe | GET /distribuicao_de_atos/{id} | sim |
| AUTSEETJGO-20 | DistribuicaoAtosDownloadAll | GET /distribuicao_de_atos/download_all | sim |
| AUTSEETJGO-21 | DistribuicaoAtosRedimensionar | PUT /distribuicao_de_atos/{id}/redimensionar | sim |
| AUTSEETJGO-22 | ControleAtosRecebidosListar | GET /controle_atos_recebidos | sim |
| AUTSEETJGO-23 | ControleAtosUtilizadosDetalhe | GET /controle_de_atos_utilizados/{codigo_do_ato} | sim |
| AUTSEETJGO-24 | ControleAtosReativar | PUT /controle_de_atos_utilizados/{codigo_do_ato}/reativar | sim |
| AUTSEETJGO-25 | ControleAtosCheck | GET /controle_de_atos_utilizados/{codigo_do_ato}/check | sim |

Catálogo completo (canonical_seq, webhook, see_spec): scripts/see-tjgo-endpoints.cjs

Base URL HML: https://portal-hextrajudicial.tjgo.jus.br/api/v1
Base URL prod: https://see.tjgo.jus.br/api/v1

Regras SEE para todos os subagentes:
- @workflow.name = card_title 1:1
- Ambiente: homologacao | producao (aliases hml→homologacao)
- Token upstream: Authorization: Bearer {auth_token} (exceto AUTSEETJGO-1, AUTSEETJGO-2 e AUTSEETJGO-13)
- Resposta proxy: envelope JSON pt-BR com status_http quando aplicável (padrão RIB/CNIB)
- AUTSEETJGO-7: validar RetornoAto[] antes do POST upstream; suportar multipart ou urlencoded conforme spec
- Codigo do ato/selo: 23 caracteres
- Brief see_spec: ler Orius/integracoes/see-tjgo/endpoints/ antes de implementar

BLOCKER real (pare o lote):
- validate ou push falhou
- SEE_TJGO_EMAIL, SEE_TJGO_PASSWORD ou SEE_TJGO_HASH_CARTORIO ausentes em env.md
- conflito n8n sem resolução (perguntar keep-current vs keep-incoming)
- adapter SOAP errado (ONR/CRA em vez de REST)
- 401 persistente após Sessions em HML

NÃO é BLOCKER:
- 400/406 de validação TJGO em HML (regras de negócio)
- sync Postman Cloud ausente (marcar sync: partial)
- AUTSEETJGO-2 Status sem auth upstream (GET /status é público)
- Task com modelo on-demand esgotado (usar Task nativo sem model ou implementação inline)

Entregue tabela de gates por card ao final de cada iteração.
```

---

## Pré-requisito antes de colar o prompt

Preencher em `env.md` (seção SEE TJGO):

```env
SEE_TJGO_EMAIL=<email tjgo>
SEE_TJGO_PASSWORD=<senha>
SEE_TJGO_HASH_CARTORIO=<hash serventia>
SEE_TJGO_API_BASE_URL=https://see.tjgo.jus.br/api/v1
SEE_TJGO_API_BASE_URL_HML=https://portal-hextrajudicial.tjgo.jus.br/api/v1
SEE_TJGO_AMBIENTE=homologacao
```

## Comandos úteis

```bash
cd "c:\Users\kenio\automacoes e testes"
# batch-progress.md: duplicar template vault se ausente (ver batch-progress-schema.md)
node scripts/generate-see-tjgo-endpoint-docs.cjs   # regenerar specs vault endpoints/
npm run postman:validate:naming -- postman/see-tjgo/collection_postman.json
```

## Retomar lote em andamento

1. Ler `Orius/integracoes/see-tjgo/automacao/batch-progress.md` → `current` e cards `done` na tabela mestre
2. Continuar na `execution_order` a partir do primeiro `pending` (ou retomar `current` se `in_progress`)
3. Não recriar batch `seetjgo-1-13` — usar apenas `seetjgo-1-25`

## Exemplo — disparo subagente nativo (um card)

```text
Task · subagent_type: generalPurpose · description: "Implement AUTSEETJGO-23"
(sem parâmetro model)

Prompt: [preencher subagent-prompt.md com brief de batch.cards[AUTSEETJGO-23]]
```

Se `Task` retornar erro de cota de modelo, **não** passar `model:` — o subprocesso usa o subagente padrão do Cursor.
