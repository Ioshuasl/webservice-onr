# Template — prompt do subagente (um card)

O **orquestrador** preenche `{placeholders}` e lança `Task` (`generalPurpose`).  
O subagente **implementa**; não orquestra, não altera Plane/registry de outros cards.

---

## Template (copiar e preencher)

```markdown
Implemente **{PLANE_KEY}** ({INTEGRATION}) end-to-end.

**Context root:** `c:\Users\kenio\automacoes e testes`

## Card brief (batch)
- **PLANE_KEY:** {PLANE_KEY}
- **card_title:** {card_title}
- **operacao:** {operacao}
- **dominio:** {dominio}
- **direcao:** {direcao}
- **webhook:** {webhook}
- **utilizacao:** {utilizacao_vault_path}
- **workflow_path proposto:** {workflow_path}
{EXTRA_FIELDS}

## Anchor (pipeline reutilizável)
- **Card:** {ANCHOR_KEY}
- **Workflow:** {anchor_workflow_path}
- **ID:** {anchor_workflow_id}

## Skills obrigatórias (ler e seguir integralmente)
1. `.cursor/skills/agent-n8n-orchestrator/SKILL.md`
2. `.cursor/skills/orius-n8n-integracoes/SKILL.md` (+ perfil em `perfis-upstream.md`)
3. `.agents/skills/n8n-architect/SKILL.md`
4. `C:\Users\kenio\.cursor\skills\obsidian-vault\SKILL.md`
{EXTRA_SKILL_LINE}

## PROIBIDO
{FORBIDDEN_SKILLS}
- Skills legadas `agent-onr-n8n-soap`, `agent-cra-n8n-soap`, `agent-censec-n8n`, `agent-webservice` (substituídas por `orius-n8n-integracoes`)

## Credenciais
Vault `env.md` → seção **{env_section}**
Variáveis: {env_vars_list}
**Nunca** commitar credenciais.

## Referências REST/SOAP
{REFERENCE_WORKFLOWS_OR_XML}

## Entregáveis obrigatórios
1. `.workflow.ts` com pipeline completo (espelhar anchor)
2. `n8nac skills validate` OK
3. `n8nac push --verify` + gravar `workflow_id_n8n`
4. Request Postman na pasta **{postman_proxy_folder}**
5. `npm run postman:validate:naming -- {postman_collection}`
6. Vault: atualizar `utilizacao/{operacao}.md` + criar/revisar `desenvolvimento/{operacao}.md`
7. `npm run n8n:sync:orius`
8. Payload JSON de teste na resposta

## PROIBIDO para este subagente
- Atualizar o **`batch-progress.md`** do domínio — somente o orquestrador
- PATCH Plane (in_progress / done)
- Alterar `Meta/integracoes/plane/maps/*-work-items.json` (`plane_state`, `automation_status`)
- Implementar outro card do lote

## Retorno ao orquestrador
- `workflow_id_n8n`
- `workflow_path`
- Tabela autoavaliação de gates (vault, workflow, push, postman, sync, docs, payload)
- Payload JSON copiável
- BLOCKERS se houver
```

---

## Exemplo preenchido — AUTCNIB-2

```markdown
Implemente **AUTCNIB-2** (cnib) end-to-end.

## Card brief
- **card_title:** [AUTCNIB-2] (cnib) Consultar - Ordem
- **operacao:** Consultar
- **webhook:** POST /cnib/ordem/consultar
- **utilizacao:** Orius/integracoes/registro-imoveis/api-cnib-serventias/automacao/utilizacao/Consultar.md
- **workflow_path:** workflows/n8n/extensao-n8n-teste/Consultar CNIB.workflow.ts

## Anchor
- AUTCNIB-1 — `Auth CNIB.workflow.ts` (`HZmL8lfjeauwkDzN`)

## Skills obrigatórias
- agent-n8n-orchestrator, orius-n8n-integracoes (perfil `rest-json`), n8n-architect, obsidian-vault

## PROIBIDO: perfis `soap-onr`, `soap-cra`

## Credenciais: env.md → CNIB — API SERVENTIAS (serventia-api)

## Referência REST: `Visualizar Ordens CNIB.workflow.ts`, `*RIB.workflow.ts`

Header upstream: `X-CNIB-Access-Token` (token de AUTCNIB-1).
```

---

## Exemplo preenchido — AUTOCRA (SOAP)

Adicionar em `EXTRA_FIELDS`:

```markdown
- **soap_op:** Consulta_Slip
- **soap_xml:** scripts/cra/soap-requests/Consulta_Slip.xml
```

`EXTRA_SKILL_LINE` (opcional — perfil upstream explícito):

```markdown
Perfil upstream: `soap-cra` — ver `.cursor/skills/orius-n8n-integracoes/perfis-upstream.md`
```

`FORBIDDEN_SKILLS` (ex. CNIB REST):

```markdown
Usar perfil `soap-onr` ou `soap-cra` neste card
```

---

## Exemplo preenchido — AUTSEETJGO (REST, 25 cards)

```markdown
Implemente **AUTSEETJGO-9** (see tjgo) end-to-end.

## Card brief
- **card_title:** [AUTSEETJGO-9] (see tjgo) DistribuicaoAtosPendentes - Pedido de Atos
- **operacao:** DistribuicaoAtosPendentes
- **dominio:** Pedido de Atos
- **method:** GET
- **webhook:** GET /see-tjgo/distribuicao-atos/pendentes
- **upstream:** GET /distribuicao_de_atos/pendentes
- **see_spec:** Orius/integracoes/see-tjgo/endpoints/get-distribuicao_de_atos-pendentes.md
- **utilizacao:** Orius/integracoes/see-tjgo/automacao/utilizacao/DistribuicaoAtosPendentes.md
- **workflow_path:** workflows/n8n/extensao-n8n-teste/Distribuicao Atos Pendentes SEE TJGO.workflow.ts
- **plane_sequence_id:** 9 · **canonical_seq (OpenAPI):** 13

## Anchor
- AUTSEETJGO-1 — `Sessions SEE TJGO.workflow.ts` (`r18lsI3VHRYY33OF`)

## Skills obrigatórias
- agent-n8n-orchestrator, orius-n8n-integracoes (perfil `rest-json`), n8n-architect, obsidian-vault

## PROIBIDO: perfis `soap-onr`, `soap-cra`

## Credenciais: env.md → SEE TJGO — API Sistema Extrajudicial (CGJ GO)

## Referência REST: `Cartorios Listar SEE TJGO.workflow.ts`, `*RIB.workflow.ts`

Header upstream: `Authorization: Bearer {auth_token}` (token de AUTSEETJGO-1).
Ambiente: homologacao | producao (query/header).
```

> **AUTSEETJGO-n** = `plane_sequence_id` no Plane. O campo `canonical_seq` no batch espelha a ordem OpenAPI — podem divergir (ex.: card 5 = Pedir, canonical 10).

---

## batch-progress.md (orquestrador apenas)

Subagente **não** edita o arquivo de lote no vault. Mapa de paths: [batch-progress-paths.md](batch-progress-paths.md).
