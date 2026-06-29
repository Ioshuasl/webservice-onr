# Matriz de roteamento — integrações × artefatos

Referência do orquestrador (`agent-n8n-orchestrator`).  
Context root: `c:\Users\kenio\automacoes e testes` · Vault: `C:\Users\kenio\Obsidian Vault`

## Legenda de fases

| Símbolo | Significado |
|---------|-------------|
| ✅ | Adapter + fluxo testado (orquestrador completo) |
| 📋 F3 | Documentado; adapter dedicado na Fase 3 |
| ❓ | Ambíguo — orquestrador deve perguntar |

---

## Tabela principal

| Integração | Palavras-chave | Label `(integração)` | Skill workflow | Perfil upstream |
|------------|----------------|----------------------|----------------|-----------------|
| ONR WSOficio | `wsoficio`, `webservice onr`, … | `webservice ONR` | ✅ `orius-n8n-integracoes` | `soap-onr` |
| CRA21 SOAP | `webservice cra`, `cra21`, … | `webservice CRA` | ✅ `orius-n8n-integracoes` | `soap-cra` |
| CENSEC | `censec`, `cesdi`, … | `CENSEC` | ✅ `orius-n8n-integracoes` | `rest-json` |
| CCN | `ccn`, … | `CCN` | ✅ `orius-n8n-integracoes` | `rest-json` |
| DOI | `doi`, … | `DOI` | ✅ `orius-n8n-integracoes` | `rest-json` |
| SIGEF | `sigef`, … | `SIGEF` | ✅ `orius-n8n-integracoes` | `rest-json` |
| RIB | `rib`, … | `RIB` | ✅ `orius-n8n-integracoes` | `rest-json` |
| CNIB SERVENTIAS | `cnib`, … | `API CNIB` | ✅ `orius-n8n-integracoes` | `rest-json` |
| ONRCPN | `onrcpn`, `certidão eletrônica`, … | `onrcpn` | ✅ `orius-n8n-integracoes` | `rest-json` |
| SEE TJGO | `see tjgo`, … | `see tjgo` | ✅ `orius-n8n-integracoes` | `rest-json` |
| SOAP (ambíguo) | `soap` sozinho | — | ❓ | ONR WSOficio vs CRA21 |
| ONR (ambíguo) | `onr` sozinho | — | ❓ | WSOficio vs RIB vs Mapa ONR |
| CTP (ambíguo) | `ctp` sozinho | — | ❓ | ONR CTP (SOAP) vs CENSEC CTP (declarações) |

---

## Workflows (n8n-as-code)

| Item | Valor |
|------|-------|
| Pasta ativa (env) | Resolver com `npx --yes n8nac env status --json` → `workflowsPath` |
| Padrão atual | `workflows/n8n/extensao-n8n-teste/*.workflow.ts` |
| Nome `@workflow.name` | `[AUTONR-n] (<integração>) <OperacaoSOAP> - <Domínio>` |
| Registry AUTONR | vault `Meta/integracoes/plane/maps/autonr-work-items.json` |

### Workflow canônico por integração

| Integração | Referência |
|------------|------------|
| Todas | Pipeline em `.cursor/skills/orius-n8n-integracoes/SKILL.md` |
| ONR Auth | `Auth ONR.workflow.ts` — perfil `soap-onr` |
| CRA21 | `Consulta CRA.workflow.ts` — perfil `soap-cra` |
| REST | `Auth CNIB.workflow.ts`, `Auth RIB.workflow.ts`, `Sessions SEE TJGO.workflow.ts` |
| CENSEC | `CENSEC Upload JSON Gateway.workflow.ts` |

---

## Postman — coleção local (`postman/`)

| Integração | Arquivo coleção | Build / update | Sync Postman Cloud |
|------------|-----------------|----------------|---------------------|
| ONR WSOficio | `onr-webservice-n8n.postman_collection.json` (+ espelho `onr-webservice-n8n-variaveis-explicitas.postman_collection.json`) | `npm run postman:build:onr` | `npm run postman:sync` |
| CCN | `CCN-Upload-XML-n8n.postman_collection.json` | Manual + naming | `npm run postman:sync:ccn` |
| CENSEC | `censec-n8n.postman_collection.json` | Manual + naming | `npm run postman:sync:censec` |
| DOI | `DOI-Validate-JSON-n8n.postman_collection.json` | Manual + naming | `npm run postman:sync:doi` |
| SIGEF | `Parse-Memorial-SIGEF-n8n.postman_collection.json` | Manual + naming | `npm run postman:sync:sigef` |
| RIB | `RIB-n8n.postman_collection.json` | `scripts/rib/update-postman-rib-collection.cjs` | `npm run postman:sync:rib` |
| CRA21 SOAP | `cra-webservice-n8n.postman_collection.json` | `npm run postman:build:cra` | `npm run postman:sync:cra` |
| CNIB SERVENTIAS | `cnib-n8n/collection_postman.json` (+ `cnib-n8n/environment_postman.json`) | Manual + naming | `npm run postman:sync:cnib` |
| Assinador (ref.) | `assinador-onr.postman_collection.json` | `npm run postman:build:assinador` | Isento AUTONR |

**Validação naming (todas com AUTONR):**

```bash
npm run postman:validate:naming -- postman/<coleção>.postman_collection.json
```

**Batch integrações não-ONR:**

```bash
npm run postman:sync:integrations
```

Helpers: `scripts/postman/postman-request-naming.cjs`, `scripts/postman/onr-postman-autonr-registry.cjs`.

---

## Sync — etapa 6 (ordem recomendada)

Após alterar workflow + Postman:

| # | Ação | Comando | Quando |
|---|------|---------|--------|
| 1 | Validar nomes Postman | `npm run postman:validate:naming -- <coleção>` | Sempre |
| 2 | Publicar Postman Cloud | Ver tabela acima (`postman:sync*`) | Coleção JSON alterada |
| 3 | Espelhar JSON nativo n8n | `npm run n8n:sync:orius` | Após `n8nac push` |
| 4 | Espelhar Postman → repo N8N Orius | `npm run n8n:sync:postman:orius` | Após etapa 2 |
| 5 | Sync descrição Plane | `npm run plane:sync:utilizacao` | Após docs vault etapa 7 |

Dry-run útil: `npm run n8n:sync:orius:dry-run`, `npm run plane:sync:utilizacao:dry-run`.

Configs Postman locais (gitignored): `postman/.postman-sync-*.json` (templates `.example`).

---

## Vault — documentação (etapa 7)

Templates: `Orius/integracoes/automacao/templates/`

| Integração | `utilizacao/` | `desenvolvimento/` |
|------------|---------------|-------------------|
| ONR WSOficio | `Orius/integracoes/registro-imoveis/onr/webservice-wsoficio/automacao/utilizacao/` | `.../desenvolvimento/` |
| CENSEC | `Orius/integracoes/tabelionato-notas/censec/automacao/utilizacao/` | `.../desenvolvimento/` |
| CCN | `Orius/integracoes/tabelionato-notas/ccn/automacao/utilizacao/` | `.../desenvolvimento/` |
| DOI | `Orius/integracoes/tabelionato-notas/doi/automacao/utilizacao/` | `.../desenvolvimento/` |
| SIGEF | `Orius/integracoes/registro-imoveis/automacao/sigef/utilizacao/` | `.../desenvolvimento/` |
| RIB | Confirmar path no vault (produto imóveis / `rib-*.md`) | Idem |
| CNIB SERVENTIAS | `Orius/integracoes/registro-imoveis/api-cnib-serventias/automacao/utilizacao/` | `.../automacao/desenvolvimento/` |
| CRA21 SOAP | `Orius/integracoes/tabelionato-protesto/cra/webservice-soap/automacao/utilizacao/` | `.../automacao/desenvolvimento/` |

Nome arquivo: `{OperacaoSOAP}.md` ou nome da operação REST.

---

## Referências no repo (etapa 2 — quando usuário indicar ou ONR)

| Integração | Referências típicas |
|------------|---------------------|
| ONR WSOficio | `webservice/metodos/<Op>.md`, `webservice/list-metodos.md`, `especificacao_wsoficio_dev.md`, `webservice-onr/especificacao/`, `scripts/<Op>/`, `webservice/hash.md` |
| CENSEC | `censec/`, workflows + `postman/censec-n8n.postman_collection.json` |
| CCN | `postman/CCN-Upload-XML-n8n.postman_collection.json`, vault CCN |
| DOI | `censec/DOI.md`, coleção DOI |
| SIGEF | coleção SIGEF, vault SIGEF |
| RIB | `api-registro-imoveis/`, `scripts/rib/`, coleção RIB |
| CRA21 SOAP | `webservice-cra/`, `scripts/cra/soap-requests/`, `wsdl/cra-webservice.wsdl`, vault `tabelionato-protesto/cra/` |
| CNIB SERVENTIAS | `cnib/`, `postman/SERVENTIAS API.postman_collection.json`, vault `api-cnib-serventias/`, Swagger `serventia-api.onr.org.br` |

---

## Repo espelho Git Orius

| Repo | Caminho local típico |
|------|----------------------|
| N8N (JSON + Postman) | `C:\Users\kenio\projetos-orius\N8N` |

Sync: `npm run n8n:sync:orius`, `npm run n8n:sync:postman:orius`.

---

## Pré-requisitos de teste por integração

| Integração | Ordem / dependência |
|------------|---------------------|
| ONR WSOficio | **3.1 Login / Auth ONR** primeiro → grava `onr_hash` → demais módulos |
| CENSEC | `CENSEC_API_KEY` + Basic Auth n8n |
| CCN | Credenciais CCN + Basic Auth n8n |
| DOI | Variáveis DOI na coleção |
| RIB | **Auth Token** → `rib_access_token` → demais requests |
| CRA21 SOAP | **Sem Auth separado** — Basic `CRA_USER`/`CRA_PASS` em cada request upstream; variáveis vault `env#CRA21` |
| CNIB SERVENTIAS | **Auth Token (143)** primeiro → grava `cnib_access_token` → demais requests; OAuth form-urlencoded upstream; variáveis vault `env#CNIB` |
