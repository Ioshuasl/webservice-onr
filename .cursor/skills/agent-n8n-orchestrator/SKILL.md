---
name: agent-n8n-orchestrator
description: >-
  Orquestra criação completa de automações n8n Orius (8 etapas obrigatórias):
  pesquisa vault, montagem .workflow.ts, push n8n, Postman, sync, documentação
  vault e payload de teste. Roteia por palavras-chave (onr, wsoficio, censec,
  ccn, doi, sigef, rib, n8n, workflow, AUTONR). Use ao montar, implementar ou
  estender workflows n8n; invoque como @agent-n8n-orchestrator.
disable-model-invocation: true
---

# Agent n8n Orchestrator (Fase 1 + 2)

Orquestrador **obrigatório** para implementar novas automações n8n no contexto Orius.
Não substitui as skills filhas — **compõe, roteia e audita** o cumprimento das etapas.

**Context root:** `c:\Users\kenio\automacoes e testes`

## Quando usar

- Usuário pede **montar**, **criar**, **implementar** ou **estender** workflow n8n
- Menção a `AUTONR`, `workflow`, `n8n`, integração (ONR, CENSEC, CCN, DOI, SIGEF, RIB)
- Nova automação de ponta a ponta (código + Postman + vault)

**Não usar** para tarefas isoladas (só debug, só Postman, só pull) — nesses casos use a skill específica diretamente.

## Skills delegadas (não duplicar)

| Papel | Skill / agente |
|-------|----------------|
| Tooling n8n-as-code | [`.agents/skills/n8n-architect/SKILL.md`](../../../.agents/skills/n8n-architect/SKILL.md) |
| Pipeline ONR WSOficio SOAP | [`.cursor/skills/agent-onr-n8n-soap/SKILL.md`](../agent-onr-n8n-soap/SKILL.md) |
| Gateway CENSEC REST JSON | [`.cursor/skills/agent-censec-n8n/SKILL.md`](../agent-censec-n8n/SKILL.md) |
| Scripts ONR (referência) | [`.cursor/skills/agent-webservice/SKILL.md`](../agent-webservice/SKILL.md) |
| Vault + roteamento notas | [`obsidian-vault`](file:///C:/Users/kenio/.cursor/skills/obsidian-vault/SKILL.md) |
| Plane (cards AUTONR) | vault `Meta/integracoes/plane/agente-plane.md` |
| Matriz integração → Postman/sync | [routing-matrix.md](routing-matrix.md) |

## Roteamento por palavra-chave

Antes da etapa 1, classificar a integração. Em **ambiguidade**, **perguntar** (nunca deduzir).

| Palavras-chave | Integração | Adapter |
|----------------|------------|---------|
| `wsoficio`, `webservice onr`, `soap`, `loginusuario`, `*AT`, `*PO`, `*OE`, `certidoes`, `*IN`, `*AC`, `matricula online`, `bdlight` | ONR WSOficio | `agent-onr-n8n-soap` |
| `censec`, `cep censec`, `cesdi`, `ctp censec`, `upload json censec`, `censec_uploadjson` | CENSEC | `agent-censec-n8n` |
| `onr` (sem contexto) | **Ambíguo** | Perguntar: WSOficio SOAP ou RIB? |
| `ctp` (sem contexto) | **Ambíguo** | Perguntar: ONR CTP (SOAP) ou CENSEC CTP (declarações)? |
| `ccn`, `doi`, `sigef`, `rib` | Outras | **Fase 3+** — ver [routing-matrix.md](routing-matrix.md); parar na etapa 3 sem adapter |

Detalhes completos: [routing-matrix.md](routing-matrix.md).

## Protocolo BLOCKERS — perguntar antes de codar

**Parar e perguntar** se qualquer item abaixo estiver indefinido:

| # | Pergunta | Por quê |
|---|----------|---------|
| B1 | `AUTONR-n` já existe no Plane ou é card novo? | Nome do workflow e Postman |
| B2 | Operação exata (`OperacaoSOAP` / path webhook / método REST)? | Escopo da implementação |
| B3 | Integração e domínio (`(webservice ONR) … - Certidões`, etc.)? | Nomenclatura canônica |
| B4 | Workflow **novo** ou **extensão** de existente? | pull vs create |
| B5 | Referências além do vault? (ex.: `especificacao_wsoficio_dev.md`, pasta `scripts/`) | Etapa 2 |
| B6 | Ambiente de teste (HML / prod)? | URLs e variáveis Postman |
| B7 | Card Plane já criado com título 1:1 ao workflow? | Rastreio AUTONR |

**Regra de ouro:** na dúvida, **perguntar ao usuário** em vez de assumir. Nenhum `push` sem B1–B4 resolvidos.

## Pipeline obrigatório (8 etapas)

Cada etapa termina com gate ✅ na resposta ao usuário. **Não avançar** sem concluir a anterior.

### Etapa 1 — Pesquisa aprofundada no vault

**Vault:** `C:\Users\kenio\Obsidian Vault`

Consultar, na ordem:

1. `Orius/desenvolvimento/padronizacao-n8n-autonr-plane-postman.md`
2. Nota da central / integração (`Orius/integracoes/centrais/<slug>.md`)
3. Roadmap do domínio (`Orius/integracoes/automacao/00-indice-roadmaps-integracao.md`)
4. Docs existentes do método: `.../automacao/utilizacao/{Operacao}.md` e `.../desenvolvimento/{Operacao}.md`
5. Registry Plane: `Meta/integracoes/plane/maps/autonr-work-items.json` → `plane_key`, `operacao`
6. `env.md` / seções de variáveis (sem copiar segredos)

**Entregável:** brief de implementação (operação, domínio, AUTONR-n, paths vault, variáveis env, pré-requisitos).

### Etapa 2 — Referências complementares

- Se o usuário **informou** referências → ler e cruzar com o vault.
- Se **não informou** → usar **somente** vault + adapter de domínio (ONR: `webservice/metodos/`, `scripts/`, WSDL).
- Para ONR: seguir checklist de leitura em `agent-onr-n8n-soap` (método `.md`, `list-metodos.md`, hash, script espelho).

### Etapa 3 — Montagem do `.workflow.ts`

1. Resolver ambiente: `npx --yes n8nac env status --json` → `workflowsPath`
2. Seguir **integralmente** `n8n-architect` (schema-first, decorators, validate)
3. Aplicar adapter de domínio:
   - **ONR WSOficio:** pipeline SOAP de `agent-onr-n8n-soap` + `workflow-template.md`
   - **CENSEC:** pipeline gateway REST de `agent-censec-n8n` + `workflow-template.md`
4. Nome publicado no `@workflow({ name })`:

```text
[AUTONR-n] (<integração>) <OperacaoSOAP> - <Domínio>
```

5. Validar localmente:

```bash
npx --yes n8nac skills validate "<workflowsPath>/<arquivo>.workflow.ts"
```

### Etapa 4 — Push no n8n

```bash
npx --yes n8nac push "<workflowsPath>/<arquivo>.workflow.ts" --verify
npx --yes n8nac workflow present <workflowId> --json
```

- Conflito: `npx --yes n8nac resolve <workflowId> --mode keep-current|keep-incoming` — **perguntar** ao usuário qual versão manter.
- Webhook: considerar `test-plan`, `activate`, `test --prod` (ver `n8n-architect`).

### Etapa 5 — Requests na coleção Postman

Usar [routing-matrix.md](routing-matrix.md) para coleção e script de build.

**ONR WSOficio (Fase 1):**

1. Adicionar/atualizar request com nome `[AUTONR-n] …` (regra `.cursor/rules/postman-autonr-naming.mdc`)
2. Body snake_case alinhado ao workflow; teste `pm.response.code === json.status_http` (ONR)
3. Regenerar se necessário: `npm run postman:build:onr`
4. Validar: `npm run postman:validate:naming -- postman/onr-webservice-n8n.postman_collection.json`

**CENSEC:**

1. Atualizar `postman/censec-n8n.postman_collection.json` — `[AUTONR-n]`, Basic Auth + `X-Api-Key`
2. `npm run postman:validate:naming -- postman/censec-n8n.postman_collection.json`
3. `npm run postman:sync:censec`

**Outras integrações (Fase 3+):** editar JSON em `postman/` conforme matriz; validar naming antes de sync.

### Etapa 6 — Sincronização

Executar **todos** os comandos aplicáveis à integração (ver matriz):

| Destino | Comando típico |
|---------|----------------|
| Postman Cloud (coleção alterada) | `npm run postman:sync` ou `postman:sync:<integração>` |
| Repo Orius N8N (JSON nativo) | `npm run n8n:sync:orius` |
| Repo Orius N8N (espelho Postman) | `npm run n8n:sync:postman:orius` |
| Plane (descrição HTML) | `npm run plane:sync:utilizacao` (após etapa 7) |

**Ordem recomendada pós-etapa 5:** validate naming → sync Postman Cloud → `n8n:sync:orius` + `n8n:sync:postman:orius`.

### Etapa 7 — Documentação no vault

Criar **dois** arquivos a partir dos templates:

- `Orius/integracoes/automacao/templates/_template-utilizacao-automacao.md`
- `Orius/integracoes/automacao/templates/_template-documentacao-detalhada-automacao.md`

| Arquivo | Pasta (ONR WSOficio) |
|---------|----------------------|
| `utilizacao/{OperacaoSOAP}.md` | `Orius/integracoes/registro-imoveis/onr/webservice-wsoficio/automacao/utilizacao/` |
| `desenvolvimento/{OperacaoSOAP}.md` | `.../automacao/desenvolvimento/` |

Outras integrações: paths em [routing-matrix.md](routing-matrix.md).

Depois: `npm run plane:sync:utilizacao` (ou sync manual conforme `agente-plane.md`).

### Etapa 8 — Finalização e payload de teste

Entregar ao usuário:

1. Resumo do que foi criado (workflow, Postman, docs, syncs executados)
2. Link do workflow (`workflow present`)
3. **Payload JSON válido** para teste (copiável)
4. Variáveis necessárias (sem valores secretos — referenciar `env.md`)
5. Ordem de execução (ex.: Auth ONR antes de métodos com `hash`)
6. Comando Postman ou `n8nac test` sugerido

## Checklist de entrega (todas obrigatórias)

```
[ ] Etapa 1 — Brief vault produzido
[ ] Etapa 2 — Referências consultadas (ou vault-only documentado)
[ ] Etapa 3 — .workflow.ts + n8nac skills validate OK
[ ] Etapa 4 — push --verify + workflow present
[ ] Etapa 5 — Request Postman [AUTONR-n] na coleção correta
[ ] Etapa 6 — Sync(s) executados conforme matriz
[ ] Etapa 7 — utilizacao + desenvolvimento no vault
[ ] Etapa 8 — Payload JSON de exemplo entregue
```

## Resposta ao usuário (formato)

Ao concluir (ou pausar por BLOCKER), usar estrutura:

```markdown
## Status do orquestrador

| Etapa | Status | Notas |
|-------|--------|-------|
| 1 Vault | ✅/⏸️/❌ | … |
| … | … | … |

## BLOCKERS (se houver)
- …

## Payload de teste
\`\`\`json
{ … }
\`\`\`

## Próximos passos
- …
```

## Escopo por fase

| Integração | Adapter etapa 3 | Postman/sync etapas 5–6 |
|------------|-----------------|-------------------------|
| ONR WSOficio SOAP | ✅ `agent-onr-n8n-soap` | ✅ `postman:build:onr` + syncs |
| CENSEC | ✅ `agent-censec-n8n` | ✅ `postman:sync:censec` |
| CCN, DOI, SIGEF, RIB | ⏳ Fase 3 | 📋 matriz documentada |

Para integrações sem adapter: completar etapas 1–2, pausar na 3 e avisar; **não improvisar** pipeline sem skill de domínio.

## Referências

- Padronização Orius: vault `Orius/desenvolvimento/padronizacao-n8n-autonr-plane-postman.md`
- Postman: `postman/README.md`
- Templates docs: vault `Orius/integracoes/automacao/templates/00-indice-templates-automacao-n8n.md`
