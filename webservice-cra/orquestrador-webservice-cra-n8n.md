Orquestre o batch ativo em scripts/autcra-batch-state.json
(batches[active_batch_id] = cra-1-16).

Leia execution_order do batch — NÃO use ordem numérica 127…142.

Para cada AUTCRA na execution_order com status "pending":

1. Atualize batch: current = AUTCRA-n, status card = "in_progress",
   started_at do batch se for o primeiro card.
2. Marque card Plane como in_progress.
3. Crie um subagente com prompt focado em implementar AUTCRA usando com brief do batch.cards[AUTCRA-n]:
   - card_title, operacao, soap_op, dominio, direcao, webhook, soap_xml, utilizacao
   - Skills obrigatórias:
     @.cursor/skills/agent-n8n-orchestrator/SKILL.md
     @.cursor/skills/agent-cra-n8n-soap/SKILL.md
     @.agents/skills/n8n-architect/SKILL.md
     @c:\Users\kenio\.cursor\skills\obsidian-vault\SKILL.md
   - Proibido: agent-onr-n8n-soap
   - Credenciais: vault env.md seção "CRA21 — Webservice SOAP Protesto"
     (CRA_USER, CRA_PASS, CRA_UF) — nunca commitar
   - AUTCRA-142 (anchor): define pipeline HTTP→SOAP CRA reutilizável
4. Aguarde conclusão do subagente.
5. Valide gates objetivos no card:
   - vault: utilizacao + desenvolvimento atualizados
   - workflow: n8nac skills validate OK
   - push: n8nac push --verify + workflow_id gravado
   - postman: request em n8n — proxy CRA + npm run postman:validate:naming
   - sync: n8n:sync:orius (postman cloud = partial se ausente)
   - docs: desenvolvimento/{operacao}.md criado
   - payload: JSON de teste entregue
6. Se todos os gates OK: card status "done", gates atualizados,
   workflow_id_n8n preenchido, Plane registry automation_status atualizado.
7. Só então dispare o próximo da execution_order.

Ao concluir os 16: batch status "complete", current = null, completed_at = now.

BLOCKER real (pare o lote):
- validate ou push falhou
- credencial CRA ausente em env.md
- conflito n8n sem resolução
- adapter errado (ONR em vez de CRA)

NÃO é BLOCKER:
- SOAP retorna código de negócio CRA (10000, 2118, 2233) com HTTP 200 em homologação

Entregue tabela de gates por card ao final de cada iteração.