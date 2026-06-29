# Orquestrador — ONRCPN n8n (batch AUTONRCPN-1…13)

Copie o bloco **Prompt único** abaixo em um novo chat com **Multitask Mode** ativo.

## Artefatos do lote

| Item | Caminho |
|------|---------|
| Batch progress (vault) | `Orius/integracoes/registro-civil/onrcpn/automacao/batch-progress.md` (`batch_id`: `onrcpn-1-13`) |
| Registry Plane | `Meta/integracoes/plane/maps/autonrcpn-work-items.json` |
| Projeto Plane | `Meta/integracoes/plane/projetos/autonrcpn.md` |
| Hub vault | `Orius/integracoes/registro-civil/onrcpn/00-indice-onrcpn.md` |
| Certidão (Postman/Swagger) | `onrcpn/certidao-eletronica/certidao-eletronica.json` |
| e-Proclamas | `onrcpn/e-proclamas/proclama-swagger.json` |
| Perfil batch | `.cursor/skills/agent-n8n-batch-orchestrator/batch-profiles.md` § AUTONRCPN |
| Postman (criar se ausente) | `postman/onrcpn-n8n/collection_postman.json` + `environment_postman.json` |
| Credenciais | vault `env.md` § **ONRCPN — IdRC / Certidão Eletrônica** (IdRC **ainda ausente** — lote em modo scaffold) |

## URLs upstream (homologação)

| Serviço | Base URL |
|---------|----------|
| Certidão Eletrônica (cards 1–10) | `https://certidaoh.registrocivil.org.br` |
| e-Proclamas (cards 11–13) | `https://servicosh.registrocivil.org.br/api/proclama` |

## `execution_order` (não usar ordem 1…13)

1. AUTONRCPN-1 → 5 → 2 → 6 → 3 → 4 → 7 → 8 → 9 → 10 → 11 → 12 → 13

## Notas

- **Perfil upstream:** `rest-json` (`orius-n8n-integracoes`)
- **Modo atual:** scaffold — montar workflow, Postman, vault e push; **sem** teste upstream real (IdRC ainda não disponível)
- **Auth (futuro):** Bearer IdRC nos dois serviços — workflows devem ler `$env.ONRCPN_IDRC_TOKEN` quando existir
- **Âncora:** após AUTONRCPN-1, reutilizar pipeline REST em `Auth CNIB` / `*RIB.workflow.ts`
- **Subagentes:** `Task` · `generalPurpose` **sem** parâmetro `model` (cota esgotada — obrigatório)

---

## Prompt único (copiar abaixo)

```text
@.cursor/skills/agent-n8n-batch-orchestrator/SKILL.md
@.cursor/skills/agent-n8n-orchestrator/SKILL.md
@.cursor/skills/orius-n8n-integracoes/SKILL.md
@c:\Users\kenio\.cursor\skills\obsidian-vault\SKILL.md

Orquestre o lote em Orius/integracoes/registro-civil/onrcpn/automacao/batch-progress.md
(batch_id = onrcpn-1-13).

Integre AUTONRCPN-1 a AUTONRCPN-13 seguindo execution_order do frontmatter do batch-progress.md
(NÃO use ordem numérica 1…13).

Pule cards com status done na tabela mestre.

## Contexto

- plane_slug: autonrcpn · plane_identifier: AUTONRCPN
- Perfil upstream: rest-json (orius-n8n-integracoes/perfis-upstream.md)
- workflows_path: workflows/n8n/extensao-n8n-teste
- postman_collection: postman/onrcpn-n8n/collection_postman.json (criar automaticamente se ausente)
- postman_environment: postman/onrcpn-n8n/environment_postman.json (criar se ausente)
- postman_proxy_folder: n8n — proxy ONRCPN
- vault_hub: Orius/integracoes/registro-civil/onrcpn
- Referências repo: onrcpn/certidao-eletronica/certidao-eletronica.json, onrcpn/e-proclamas/proclama-swagger.json
- ONRCPN_CERTIDAO_BASE_URL: https://certidaoh.registrocivil.org.br
- ONRCPN_PROCLAMA_BASE_URL: https://servicosh.registrocivil.org.br/api/proclama
- Modo: scaffold (sem IdRC_token — não executar testes upstream nem n8nac test --prod)

## Subagentes — SEM models (obrigatório)

Cota de models premium esgotada. Regras rígidas:

1. Lançar subagentes **somente** com `Task` · `subagent_type: generalPurpose` — **NUNCA** passar parâmetro `model`.
2. **Proibido** invocar modelos on-demand (gpt, claude, codex, etc.) em subagentes ou no orquestrador.
3. Se `Task` falhar, implementar o card **inline** no chat do orquestrador (mesma restrição: sem model explícito).
4. Multitask Mode ativo: um subagente por vez; aguardar conclusão antes do próximo.

## Delegação por card (subagentes)

O orquestrador GERENCIA; cada subagente implementa UM card via Task (generalPurpose) **sem parâmetro model**.
Aguardar conclusão do subagente antes do próximo card da execution_order.

Para cada AUTONRCPN-n pendente:

1. Atualizar batch-progress.md: current = AUTONRCPN-n, card in_progress, started_at; lote status in_progress no primeiro card.
2. PATCH Plane (projeto autonrcpn) → In Progress + start_date (America/Sao_Paulo).
3. Lançar subagente (generalPurpose, sem model) com prompt preenchido (subagent-prompt.md) usando a seção ### AUTONRCPN-n do batch-progress.md.
4. Validar gates no shell (não confiar só no relatório do subagente):
   - n8nac skills validate
   - n8nac push --verify + workflow present
   - postman request + npm run postman:validate:naming
   - npm run n8n:sync:orius
   - **Não** exigir n8nac test upstream nem chamada Postman com resposta 200 real (sem IdRC)
5. Se gates OK: fechar card no batch-progress.md, PATCH Plane Done + start_date/target_date, atualizar registry automation_status.
6. Tabela de gates na resposta e avançar para o próximo da execution_order.

Subagente PROIBIDO de: editar batch-progress.md, PATCH Plane, alterar registry de outros cards, usar parâmetro model em Task.

## Skills do subagente (cada card)

- agent-n8n-orchestrator (8 etapas)
- orius-n8n-integracoes (perfil rest-json)
- n8n-architect
- obsidian-vault

PROIBIDO: perfis soap-onr, soap-cra; skills legadas agent-onr-n8n-soap, agent-cra-n8n-soap, agent-censec-n8n.

## Primeiro card (AUTONRCPN-1)

Estabelece o pipeline REST reutilizável para os demais:
- Base URL certidão: https://certidaoh.registrocivil.org.br (ex.: POST /api/v1.0/certificate-json)
- Header upstream (quando IdRC existir): Authorization: Bearer {{ $env.ONRCPN_IDRC_TOKEN }}
- Por ora: documentar variável em utilizacao/desenvolvimento; workflow aceita token vazio com validação local clara
- Webhook path: POST /onrcpn/certificate-json/create
- Espelhar Auth CNIB.workflow.ts e *RIB.workflow.ts para estrutura de nós

Após AUTONRCPN-1 done, cards 2–10 (certidão) e 11–13 (e-Proclamas em https://servicosh.registrocivil.org.br/api/proclama) reutilizam o mesmo padrão.

## Gate payload (sem IdRC)

Entregar JSON de exemplo **válido contra o contrato** (body webhook + exemplo upstream documentado).
Marcar na resposta: `teste_upstream: pendente_idrc` — não é BLOCKER neste lote.

## BLOCKERS (parar lote)

- validate ou push falhou
- conflito n8n sem resolução
- subagente lançado com parâmetro model (violação de cota)

Não é BLOCKER:
- IdRC_token ausente em env.md (modo scaffold)
- postman:sync cloud ausente (gate sync partial)
- workflow active:false
- resposta 401/403 em teste upstream (sem credencial)

Ao final de cada card, entregar tabela de gates. Ao fechar o lote, resumo AUTONRCPN-1…13 com workflow_ids.
```
