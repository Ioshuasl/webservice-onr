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

| Integração | Palavras-chave | Label `(integração)` | Adapter skill | Domínios típicos |
|------------|----------------|----------------------|---------------|------------------|
| ONR WSOficio | `wsoficio`, `webservice onr`, `soap`, `ws oficio`, `acompanhamento titulos`, `penhora`, `oficio`, `certidoes`, `intimacoes`, `e-protocolo`, `matricula online`, `bdlight`, `bdl`, `ctp onr` | `webservice ONR` | ✅ `agent-onr-n8n-soap` | Autenticação, AT, PO, OE, Certidões, IN, AC, CTP, Matrícula Online |
| CENSEC | `censec`, `cesdi`, `cep censec`, `rcto`, `ctp censec`, `upload json`, `censec_uploadjson` | `CENSEC` | ✅ `agent-censec-n8n` | Upload JSON (CEP, CESDI, CTP) |
| CCN | `ccn`, `e-notariado`, `upload xml ccn` | `CCN` | 📋 F3 | CCN |
| DOI | `doi`, `validate json doi` | `DOI` | 📋 F3 | DOI |
| SIGEF | `sigef`, `memorial sigef`, `parse memorial` | `SIGEF` | 📋 F3 | SIGEF |
| RIB | `rib`, `registro imoveis brasil`, `protocolo rib`, `edital rib` | `RIB` | 📋 F3 | Auth, protocolo, edital, cobrança |
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
| ONR Auth | `workflows/n8n/gentle-juniper-bb6f8f0940a3/Auth ONR.workflow.ts` ou `extensao-n8n-teste/Auth ONR.workflow.ts` |
| ONR demais | Pipeline em `agent-onr-n8n-soap` |
| CENSEC | `extensao-n8n-teste/CENSEC Upload JSON Gateway.workflow.ts` — pipeline em `agent-censec-n8n` |
| CCN / DOI / SIGEF | workflows homônimos em `extensao-n8n-teste/` |

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
