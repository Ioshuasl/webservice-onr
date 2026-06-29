---
name: agent-n8n-orchestrator
description: >-
  Orquestra criação completa de automações n8n Orius (8 etapas obrigatórias):
  pesquisa vault, montagem .workflow.ts, push n8n, Postman, sync, documentação
  vault e payload de teste. Roteia por palavras-chave (onr, wsoficio, censec,
  ccn, doi, sigef, rib, n8n, workflow, AUTONR). Use ao montar, implementar ou
  estender workflows n8n; invoque como @agent-n8n-orchestrator. Plane multi-projeto
  (autonr, autocra, autorib, autcnib, …). Inclui CNIB (serventia-api).
disable-model-invocation: true
---

# Agent n8n Orchestrator (Fase 1 + 2)

Orquestrador **obrigatório** para implementar novas automações n8n no contexto Orius.
Não substitui as skills filhas — **compõe, roteia e audita** o cumprimento das etapas.

**Context root:** `c:\Users\kenio\automacoes e testes`

## Quando usar

- Usuário pede **montar**, **criar**, **implementar** ou **estender** workflow n8n
- Menção a `AUTONR`, `workflow`, `n8n`, integração (ONR, CENSEC, CCN, DOI, SIGEF, RIB, CNIB)
- Nova automação de ponta a ponta (código + Postman + vault)

**Não usar** para tarefas isoladas (só debug, só Postman, só pull) — nesses casos use a skill específica diretamente.

**Lotes multi-card** (`AUTCNIB-2…6`, `AUTONRCPN-1…13`, `execution_order`): use [`agent-n8n-batch-orchestrator`](../agent-n8n-batch-orchestrator/SKILL.md) — estado do lote em **`batch-progress.md`** no vault Obsidian (não mais JSON em `scripts/`).

## Skills delegadas (não duplicar)

| Papel | Skill / agente |
|-------|----------------|
| Tooling n8n-as-code | [`.agents/skills/n8n-architect/SKILL.md`](../../../.agents/skills/n8n-architect/SKILL.md) |
| **Workflows proxy (único)** | [`.cursor/skills/orius-n8n-integracoes/SKILL.md`](../orius-n8n-integracoes/SKILL.md) |
| Scripts ONR CLI (referência) | `scripts/`, `webservice/` — não adapter n8n |
| Vault + roteamento notas | [`obsidian-vault`](file:///C:/Users/kenio/.cursor/skills/obsidian-vault/SKILL.md) |
| Plane (multi-projeto) | vault `Meta/integracoes/plane/agente-plane.md` · `palavras-chave-plane.md` · `projetos/<slug>.md` |
| Matriz integração → Postman/sync | [routing-matrix.md](routing-matrix.md) |

## Plane — um projeto por integração (2026-06-12)

Antes de criar card ou sync, resolver **slug** e **identificador** via vault `Meta/integracoes/plane/palavras-chave-plane.md` ou `env.md` (seção **Plane — projetos de automação por integração**).

| Integração | Slug | Identificador | Nota vault |
|------------|------|---------------|------------|
| ONR WSOficio | `autonr` | AUTONR | `projetos/autonr.md` |
| CRA21 SOAP | `autocra` | AUTOCRA | `projetos/autocra.md` |
| RIB API | `autorib` | AUTORIB | `projetos/autorib.md` |
| CNIB SERVENTIAS | `autcnib` | AUTCNIB | `projetos/autcnib.md` |
| CCN | `autccn` | AUTCCN | `projetos/autccn.md` |
| CENSEC | `autcensec` | AUTCENSEC | `projetos/autcensec.md` |
| DOI | `autdoi` | AUTDOI | `projetos/autdoi.md` |
| CENPROT | `autcenprot` | AUTCENPROT | `projetos/autcenprot.md` |
| CRC | `autcrc` | AUTCRC | `projetos/autcrc.md` |
| SIRC | `autsirc` | AUTSIRC | `projetos/autsirc.md` |
| ONRCPN (Certidão + e-Proclamas) | `autonrcpn` | AUTONRCPN | `projetos/autonrcpn.md` |
| SEE TJGO | `autseetjgo` | AUTSEETJGO | `projetos/autseetjgo.md` |

**Novos cards:** `[{IDENTIFICADOR}-n] (<integração>) <Método> - <Classificação>` — skill `@padronizacao-nomenclatura-automacao`. Ex.: `[AUTCNIB-1] (cnib) AuthToken - CNIB`.  
**Legado:** cards `AUTONR-n` de outras integrações ainda no projeto `autonr` até migração; registry histórico em `maps/autonr-work-items.json`.

## Roteamento por palavra-chave

Antes da etapa 1, classificar a integração. Em **ambiguidade**, **perguntar** (nunca deduzir).

| Palavras-chave | Integração | Adapter |
|----------------|------------|---------|
| `wsoficio`, `webservice onr`, `loginusuario`, `*AT`, `*PO`, `*OE`, `certidoes`, `*IN`, `*AC`, `matricula online`, `bdlight` | ONR WSOficio | `orius-n8n-integracoes` · perfil `soap-onr` |
| `webservice cra`, `cra21`, `cra soap`, `protestos.php`, `protesto soap`, `autonr-127`…`142` | CRA21 SOAP | `orius-n8n-integracoes` · perfil `soap-cra` |
| `censec`, `cep censec`, `cesdi`, `ctp censec`, `upload json censec`, `censec_uploadjson` | CENSEC | `orius-n8n-integracoes` · perfil `rest-json` |
| `soap` (sem contexto) | **Ambíguo** | Perguntar: ONR WSOficio ou CRA21? |
| `onr` (sem contexto) | **Ambíguo** | Perguntar: WSOficio SOAP ou RIB? |
| `ctp` (sem contexto) | **Ambíguo** | Perguntar: ONR CTP (SOAP) ou CENSEC CTP (declarações)? |
| `cnib`, `serventia-api`, `serventias api`, `indisponibilidade`, `autcnib`, `autcnib-1`…`6` | API CNIB SERVENTIAS | `orius-n8n-integracoes` · perfil `rest-json` |
| `onrcpn`, `autonrcpn`, `certidão eletrônica`, `e-proclamas`, `idrc` | API ONRCPN (REST) | `orius-n8n-integracoes` · perfil `rest-json` |
| `see tjgo`, `autseetjgo` | SEE TJGO REST | `orius-n8n-integracoes` · perfil `rest-json` |
| `rib`, `autorib` | RIB REST | `orius-n8n-integracoes` · perfil `rest-json` |

| `ccn`, `doi`, `sigef` | Outras REST | `orius-n8n-integracoes` · perfil `rest-json` — ver [routing-matrix.md](routing-matrix.md) |

Detalhes completos: [routing-matrix.md](routing-matrix.md).

**Lotes:** mapa `batch-progress.md` → [batch-progress-paths.md](../agent-n8n-batch-orchestrator/batch-progress-paths.md). Ex.: CNIB `Orius/integracoes/registro-imoveis/api-cnib-serventias/automacao/batch-progress.md`; ONRCPN `.../onrcpn/automacao/batch-progress.md`.

## Protocolo BLOCKERS — perguntar antes de codar

**Parar e perguntar** se qualquer item abaixo estiver indefinido:

| # | Pergunta | Por quê |
|---|----------|---------|
| B1 | Card já existe no Plane ou é novo? Qual **projeto** (`plane_slug`) e **sequence** (`{IDENTIFICADOR}-n`)? | Nome do workflow e Postman |
| B2 | Operação exata (`OperacaoSOAP` / path webhook / método REST)? | Escopo da implementação |
| B3 | Integração e domínio (`(webservice ONR) … - Certidões`, etc.)? | Nomenclatura canônica |
| B4 | Workflow **novo** ou **extensão** de existente? | pull vs create |
| B5 | Referências além do vault? (ex.: `especificacao_wsoficio_dev.md`, pasta `scripts/`) | Etapa 2 |
| B6 | Ambiente de teste (HML / prod)? | URLs e variáveis Postman |
| B7 | Card Plane no **projeto correto** com título 1:1 ao workflow? | Rastreio `{IDENTIFICADOR}-n` |

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
5. Projeto Plane: `Meta/integracoes/plane/projetos/<slug>.md` → `plane_project_id`, estados UUID
6. Registry: `Meta/integracoes/plane/maps/autonr-work-items.json` (legado) ou registry da integração quando existir
7. `env.md` / seções de variáveis (sem copiar segredos)

**Entregável:** brief (operação, domínio, `plane_slug`, `{IDENTIFICADOR}-n`, paths vault, variáveis env, pré-requisitos).

### Etapa 2 — Referências complementares

- Se o usuário **informou** referências → ler e cruzar com o vault.
- Se **não informou** → usar **somente** vault + adapter de domínio (ONR: `webservice/metodos/`, `scripts/`, WSDL).
- Para ONR: seguir checklist de leitura em `agent-onr-n8n-soap` (método `.md`, `list-metodos.md`, hash, script espelho).

### Etapa 3 — Montagem do `.workflow.ts`

1. Resolver ambiente: `npx --yes n8nac env status --json` → `workflowsPath`
2. Seguir **integralmente** `n8n-architect` (schema-first, decorators, validate)
3. Aplicar skill única [`orius-n8n-integracoes`](../orius-n8n-integracoes/SKILL.md) + perfil upstream ([perfis-upstream.md](../orius-n8n-integracoes/perfis-upstream.md)):
   - **SOAP ONR:** perfil `soap-onr`
   - **SOAP CRA:** perfil `soap-cra`
   - **REST/JSON:** perfil `rest-json` (CNIB, RIB, SEE TJGO, ONRCPN, CENSEC, …)
4. Nome publicado no `@workflow({ name })` — **igual ao título do card** no projeto Plane da integração:

```text
[{IDENTIFICADOR}-n] (<integração>) <OperacaoSOAP> - <Domínio>
```

Ex.: `[AUTCNIB-1] (cnib) AuthToken - CNIB` · `[AUTOCRA-1] (cra) Consulta - Consulta`.  
Workflows legados `[AUTONR-n] …` permanecem até renomeação/migração.

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

**Regra de autonomia (Postman):**

- Se o arquivo de **coleção** já existir no path esperado, **atualizar** esse JSON; não recriar.
- Se o arquivo de **environment** já existir no path esperado, **atualizar** esse JSON; não recriar.
- Somente se a coleção e/ou o environment **não existirem** ou **não forem encontrados** no repo, a skill pode **criar automaticamente** o(s) arquivo(s) base no diretório `postman/` da integração antes de continuar.
- Ao criar arquivo novo, seguir o padrão de nomenclatura e estrutura da integração mais próxima na [routing-matrix.md](routing-matrix.md) e registrar o path final no brief/entrega.
- A criação automática vale para **artefatos JSON locais do Postman**; não pressupõe sync cloud, ID remoto, ou configuração `.postman-sync-*.json`.

**ONR WSOficio (Fase 1):**

1. Adicionar/atualizar request com nome `[AUTONR-n] …` (regra `.cursor/rules/postman-autonr-naming.mdc`)
2. Body snake_case alinhado ao workflow; teste `pm.response.code === json.status_http` (ONR)
3. Regenerar se necessário: `npm run postman:build:onr`
4. Validar: `npm run postman:validate:naming -- postman/onr-webservice-n8n.postman_collection.json`

**CENSEC:**

1. Atualizar `postman/censec-n8n.postman_collection.json` — `[AUTONR-n]`, Basic Auth + `X-Api-Key`
2. `npm run postman:validate:naming -- postman/censec-n8n.postman_collection.json`
3. `npm run postman:sync:censec`

**CRA21 SOAP:**

1. Atualizar pasta **n8n — proxy CRA** em `postman/cra-webservice-n8n.postman_collection.json`
2. `npm run postman:build:cra` (se XML/runbooks mudaram)
3. `npm run postman:validate:naming -- postman/cra-webservice-n8n.postman_collection.json`

**CNIB SERVENTIAS (Fase 3+):**

1. Atualizar pasta **n8n — proxy CNIB** em `postman/cnib-n8n/collection_postman.json`
2. Environment: `postman/cnib-n8n/environment_postman.json`
3. `npm run postman:validate:naming -- postman/cnib-n8n/collection_postman.json`
4. `npm run postman:sync:cnib` (após configurar `postman/.postman-sync-cnib.json`)

**Lotes ativos:** consultar `batch-progress.md` do domínio no vault — campo `execution_order` no frontmatter. Legado JSON em `scripts/aut*-batch-state.json` não é mais atualizado.

**Outras integrações (Fase 3+):** editar JSON em `postman/` conforme matriz; validar naming antes de sync.

Se a integração ainda **não** tiver `collection_postman.json` e/ou `environment_postman.json`, a etapa 5 pode começar pela **criação automática** desses arquivos e só depois seguir com update, validate naming e sync aplicável.

### Etapa 6 — Sincronização

Executar **todos** os comandos aplicáveis à integração (ver matriz):

| Destino | Comando típico |
|---------|----------------|
| Postman Cloud (coleção alterada) | `npm run postman:sync` ou `postman:sync:<integração>` |
| Repo Orius N8N (JSON nativo) | `npm run n8n:sync:orius` |
| Repo Orius N8N (espelho Postman) | `npm run n8n:sync:postman:orius` |
| Plane (descrição HTML) | `npm run plane:sync:utilizacao` (após etapa 7) — usar `--project <slug>` quando o script suportar |

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
[ ] Etapa 5 — Request Postman `[{IDENTIFICADOR}-n] …` na coleção correta
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

| Integração | Skill etapa 3 | Postman/sync etapas 5–6 |
|------------|---------------|-------------------------|
| ONR WSOficio SOAP | ✅ `orius-n8n-integracoes` (`soap-onr`) | ✅ `postman:build:onr` + syncs |
| CRA21 SOAP (protesto) | ✅ `orius-n8n-integracoes` (`soap-cra`) | ✅ `postman:build:cra` + validate naming |
| CENSEC | ✅ `orius-n8n-integracoes` (`rest-json`) | ✅ `postman:sync:censec` |
| CNIB, RIB, SEE TJGO, ONRCPN | ✅ `orius-n8n-integracoes` (`rest-json`) | 📋 matriz + autocreate Postman se ausente |
| CCN, DOI, SIGEF | ✅ `orius-n8n-integracoes` (`rest-json`) | 📋 matriz documentada |

Para integrações sem documentação vault suficiente: completar etapas 1–2, pausar na 3 e avisar BLOCKER.

## Referências

- Padronização Orius: vault `Orius/desenvolvimento/padronizacao-n8n-autonr-plane-postman.md`
- Postman: `postman/README.md`
- Templates docs: vault `Orius/integracoes/automacao/templates/00-indice-templates-automacao-n8n.md`
- Pipeline workflow: [`.cursor/skills/orius-n8n-integracoes/SKILL.md`](../orius-n8n-integracoes/SKILL.md)
