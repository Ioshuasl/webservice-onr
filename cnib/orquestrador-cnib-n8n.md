Orquestre o batch ativo em scripts/autcnib-batch-state.json
(batches[active_batch_id] = cnib-1-6).

Leia execution_order do batch — NÃO use ordem numérica 1…6.

Pule cards com status "done" (AUTCNIB-1 já concluído).

Para cada AUTCNIB na execution_order com status "pending":

1. Atualize batch: current = AUTCNIB-n, status card = "in_progress",
   started_at do card se ausente.
2. Marque card Plane (projeto autcnib) como in_progress.
3. Crie um subagente com prompt focado em implementar AUTCNIB-n usando o brief
   de batch.cards[AUTCNIB-n]:
   - card_title, operacao, dominio, direcao, webhook, utilizacao
   - upstream (derivar do vault CNIB-0x ou tabela abaixo)
   - workflow_path proposto, anchor workflow AUTCNIB-1
   - Skills obrigatórias do subagente:
     @.cursor/skills/agent-n8n-orchestrator/SKILL.md
     @.agents/skills/n8n-architect/SKILL.md
     @c:\Users\kenio\.cursor\skills\obsidian-vault\SKILL.md
   - Referência REST (não é skill): workflows RIB em
     workflows/n8n/extensao-n8n-teste/*RIB.workflow.ts
   - Proibido: agent-onr-n8n-soap, agent-cra-n8n-soap (CNIB é REST→REST)
   - Credenciais: vault env.md seção "CNIB — API SERVENTIAS (serventia-api)"
     (CNIB_API_CLIENT_ID, CNIB_API_CLIENT_SECRET, CNIB_CPF_USUARIO,
     CNIB_API_BASE_URL, CNIB_AUTH_TOKEN_URL, CNIB_AUTH_SCOPE) — nunca commitar
   - AUTCNIB-1 (anchor, já done): pipeline HTTP→REST CNIB reutilizável
     (Auth CNIB.workflow.ts, id HZmL8lfjeauwkDzN)
4. Aguarde conclusão do subagente.
5. Valide gates objetivos no card:
   - vault: utilizacao + desenvolvimento atualizados
   - workflow: n8nac skills validate OK
   - push: n8nac push --verify + workflow_id gravado
   - postman: request em postman/cnib-n8n/collection_postman.json
     + npm run postman:validate:naming -- postman/cnib-n8n/collection_postman.json
   - sync: n8n:sync:orius (postman:sync:cnib = partial se .postman-sync-cnib.json ausente)
   - docs: desenvolvimento/{operacao}.md revisado
   - payload: JSON de teste entregue (header X-CNIB-Access-Token após AuthToken)
6. Se todos os gates OK: card status "done", gates atualizados,
   workflow_id_n8n + workflow_path preenchidos,
   Meta/integracoes/plane/maps/autcnib-work-items.json automation_status = done.
7. Só então dispare o próximo da execution_order.

Ao concluir os 5 pendentes (3,2,4,5,6): batch status "complete", current = null,
completed_at = now.

Tabela upstream por card (para o subagente):

| Card | Upstream |
|------|----------|
| AUTCNIB-3 | POST /api/v2/ordem/visualizar |
| AUTCNIB-2 | POST /api/ordem/consultar |
| AUTCNIB-4 | POST /api/ordem/responder |
| AUTCNIB-5 | POST /api/ordem/responder/lista |
| AUTCNIB-6 | POST /api/documentos/tipos |

Arquivos .workflow.ts propostos:
- AUTCNIB-3 → Visualizar Ordens CNIB.workflow.ts
- AUTCNIB-2 → Consultar CNIB.workflow.ts
- AUTCNIB-4 → Responder Ordem CNIB.workflow.ts
- AUTCNIB-5 → Responder Lista CNIB.workflow.ts
- AUTCNIB-6 → Documentos Tipos CNIB.workflow.ts

BLOCKER real (pare o lote):
- validate ou push falhou
- credencial CNIB ausente em env.md
- conflito n8n sem resolução (perguntar keep-current vs keep-incoming)
- adapter errado (SOAP ONR/CRA em vez de REST CNIB)
- token OAuth2 inválido em produção (401 persistente após AuthToken)

NÃO é BLOCKER:
- API CNIB retorna success:false com HTTP 400 + notifications[] (validação de negócio)
- VisualizarOrdens retorna formato legado dentro do endpoint v2 (repassar dados)
- sync Postman Cloud ausente (marcar sync: partial)
- AUTCNIB-1 com sync:false (já done; não reimplementar)

Regras CNIB para todos os subagentes:
- @workflow.name = card_title 1:1
- Ambiente: producao | stg (aliases homologacao→stg)
- Token upstream: X-CNIB-Access-Token ou Bearer
- null no JSON upstream: null real, nunca "null"
- Responder*: campo upstream bens_detalhe (corrigir Postman se bens_detalhes)
- VisualizarOrdens: não forçar schema Swagger inglês

Entregue tabela de gates por card ao final de cada iteração.