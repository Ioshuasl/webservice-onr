# Perfis de batch — famílias de automação

Cada perfil → **`batch_progress.md`** no vault Obsidian. Mapa: [batch-progress-paths.md](batch-progress-paths.md). **Nunca** misturar domínios no mesmo arquivo.

| Família | `batch_progress` (vault) |
|---------|--------------------------|
| AUTCCN | `Orius/integracoes/tabelionato-notas/ccn/automacao/batch-progress.md` |
| AUTCENSEC | `Orius/integracoes/tabelionato-notas/censec/automacao/batch-progress.md` |
| AUTCNIB | `Orius/integracoes/registro-imoveis/api-cnib-serventias/automacao/batch-progress.md` |
| AUTCRC | `Orius/integracoes/registro-civil/crc/automacao/batch-progress.md` |
| AUTDOI | `Orius/integracoes/tabelionato-notas/doi/automacao/batch-progress.md` |
| AUTENOT | `Orius/integracoes/tabelionato-notas/fluxo-assinaturas/automacao/batch-progress.md` |
| AUTOCRA | `Orius/integracoes/tabelionato-protesto/cra/webservice-soap/automacao/batch-progress.md` |
| AUTONR | `Orius/integracoes/registro-imoveis/onr/webservice-wsoficio/automacao/batch-progress.md` |
| AUTONRCPN | `Orius/integracoes/registro-civil/onrcpn/automacao/batch-progress.md` |
| AUTORIB | `Orius/integracoes/registro-imoveis/api-registro-imoveis/automacao/batch-progress.md` |
| AUTSEETJGO | `Orius/integracoes/see-tjgo/automacao/batch-progress.md` |
| AUTSIRC | `Orius/integracoes/registro-civil/sirc/automacao/batch-progress.md` |

**Legado (somente leitura/migração):** `scripts/aut*-batch-state.json`

**Identificadores Plane:** vault `Meta/integracoes/plane/palavras-chave-plane.md`.

<!-- batch-orchestrator:plane-slug-table:start -->
| Família | `plane_identifier` | `plane_slug` | Registry | Upstream |
|---------|-------------------|--------------|----------|----------|
| CCN | AUTCCN | `autccn` | `autccn-work-items.json` | REST (futuro) |
| CENSEC | AUTCENSEC | `autcensec` | `autcensec-work-items.json` | REST/JSON |
| CNIB | AUTCNIB | `autcnib` | `autcnib-work-items.json` | REST/JSON |
| CRC | AUTCRC | `autcrc` | `autcrc-work-items.json` | REST (futuro) |
| DOI | AUTDOI | `autdoi` | `autdoi-work-items.json` | REST (futuro) |
| E-Notariado Fluxo Assinaturas | AUTENOT | `autenot` | `autenot-work-items.json` | REST/JSON |
| CRA21 SOAP | AUTOCRA | `autocra` | `autocra-work-items.json` | SOAP/XML |
| ONR WSOficio | AUTONR | `autonr` | `autonr-work-items.json` | SOAP/XML |
| ONRCPN | AUTONRCPN | `autonrcpn` | `autonrcpn-work-items.json` | REST/JSON |
| RIB | AUTORIB | `autorib` | `autorib-work-items.json` | REST/JSON |
| SEE TJGO | AUTSEETJGO | `autseetjgo` | `autseetjgo-work-items.json` | REST/JSON |
| SIRC | AUTSIRC | `autsirc` | `autsirc-work-items.json` | REST (futuro) |
<!-- batch-orchestrator:plane-slug-table:end -->

> Cards legados `AUTONR-n` em projetos novos: usar `plane_legacy_key` no card do batch.

---

## AUTCNIB — API SERVENTIAS CNIB

| Campo | Valor |
|-------|-------|
| `batch_progress` | `Orius/integracoes/registro-imoveis/api-cnib-serventias/automacao/batch-progress.md` |
| `batch_id` exemplo | `cnib-1-6` |
| `integration` | `cnib` |
| `vault_hub` | `Orius/integracoes/registro-imoveis/api-cnib-serventias/` |
| `utilizacao` | `.../automacao/utilizacao/{operacao}.md` |
| `desenvolvimento` | `.../automacao/desenvolvimento/{operacao}.md` |
| `postman_collection` | `postman/cnib-n8n/collection_postman.json` |
| `postman_environment` | `postman/cnib-n8n/environment_postman.json` |
| `postman_sync` | `npm run postman:sync:cnib` · config `postman/.postman-sync-cnib.json` |
| `postman_autocreate` | `true` — criar coleção/environment somente se ausentes |
| `env_section` | `CNIB — API SERVENTIAS (serventia-api)` |
| `env_vars` | `CNIB_API_CLIENT_ID`, `CNIB_API_CLIENT_SECRET`, `CNIB_CPF_USUARIO`, `CNIB_API_BASE_URL`, `CNIB_AUTH_TOKEN_URL`, `CNIB_AUTH_SCOPE` |
| **Anchor** | AUTCNIB-1 — `Auth CNIB.workflow.ts` (`HZmL8lfjeauwkDzN`) — HTTP→REST reutilizável |
| **Subagente skills** | `agent-n8n-orchestrator`, `orius-n8n-integracoes`, `n8n-architect`, `obsidian-vault` |
| **Perfil upstream** | `rest-json` |
| **Proibido subagente** | perfis `soap-onr`, `soap-cra` |
| **Referência REST** | `workflows/n8n/extensao-n8n-teste/*RIB.workflow.ts`, `Auth CNIB.workflow.ts` |
| `postman_proxy_folder` | `n8n — proxy CNIB` |
| `auth_header` | `X-CNIB-Access-Token` (após AuthToken) |

`execution_order` típica: `1` (auth) → `3` (visualizar) → `2` (consultar) → `4`–`6`.

---

## AUTOCRA / CRA21 SOAP (legado AUTONR-127…142)

| Campo | Valor |
|-------|-------|
| `batch_progress` | `Orius/integracoes/tabelionato-protesto/cra/webservice-soap/automacao/batch-progress.md` |
| `batch_id` exemplo | `cra-1-16` |
| `plane_slug` | `autocra` ou `autonr` (legado) |
| `vault_hub` | `Orius/integracoes/tabelionato-protesto/cra/webservice-soap/` |
| `postman_collection` | `postman/cra-webservice-n8n.postman_collection.json` |
| `postman_environment` | sob demanda — criar apenas se a integração passar a exigir environment dedicado |
| `postman_sync` | `npm run postman:sync:cra` |
| `postman_build` | `npm run postman:build:cra` |
| `postman_autocreate` | `true` — criar coleção/environment somente se ausentes |
| `env_section` | `CRA21 — Webservice SOAP Protesto` |
| `env_vars` | `CRA_USER`, `CRA_PASS`, `CRA_UF`, `CRA_AMBIENTE` |
| **Anchor** | AUTONR-142 / AUTOCRA-142 — `Consulta Justificativa CRA.workflow.ts` |
| **Subagente skills** | `agent-n8n-orchestrator`, `orius-n8n-integracoes`, `n8n-architect`, `obsidian-vault` |
| **Perfil upstream** | `soap-cra` |
| **Proibido** | perfil `soap-onr` |
| `postman_proxy_folder` | `n8n — proxy CRA` |
| Card fields extra | `soap_op`, `soap_xml` (`scripts/cra/soap-requests/{SoapOp}.xml`) |

---

## AUTONR — ONR WSOficio SOAP

| Campo | Valor |
|-------|-------|
| `vault_hub` | `Orius/integracoes/registro-imoveis/onr/webservice-wsoficio/` |
| `postman_collection` | `postman/onr-webservice-n8n.postman_collection.json` |
| `postman_environment` | sob demanda — criar apenas se a integração passar a exigir environment dedicado |
| `postman_sync` | `npm run postman:sync` |
| `postman_build` | `npm run postman:build:onr` |
| `postman_autocreate` | `true` — criar coleção/environment somente se ausentes |
| `env_section` | ONR WSOficio (vault `env.md` seções homologação) |
| **Anchor** | Auth ONR — hash SHA-1 |
| **Subagente skills** | `agent-n8n-orchestrator`, `orius-n8n-integracoes`, `n8n-architect`, `obsidian-vault` |
| **Perfil upstream** | `soap-onr` |
| **Proibido** | perfil `soap-cra` |

---

## AUTORIB — API RIB

| Campo | Valor |
|-------|-------|
| `plane_slug` | `autorib` |
| `vault_hub` | `Orius/integracoes/registro-imoveis/api-registro-imoveis/` |
| `postman_collection` | `postman/RIB-n8n.postman_collection.json` |
| `postman_environment` | sob demanda — criar apenas se a integração passar a exigir environment dedicado |
| `postman_sync` | `npm run postman:sync:rib` |
| `postman_autocreate` | `true` — criar coleção/environment somente se ausentes |
| `env_section` | `RIB` (OAuth client_id/secret) |
| **Anchor** | Auth Token RIB |
| **Subagente skills** | `agent-n8n-orchestrator`, `n8n-architect`, `obsidian-vault` |
| **Proibido** | perfis `soap-onr`, `soap-cra` |
| `postman_proxy_folder` | pastas por módulo RIB |

---

## AUTCRC / AUTSIRC

Fase 3+ — criar `batch-progress.md` e briefing; **parar** se não houver adapter skill. Documentar BLOCKER e entregar brief + scaffold vault.

---

## Resolver perfil a partir do pedido

<!-- batch-orchestrator:resolver-table:start -->
| Padrão no pedido | Perfil |
|------------------|--------|
| `AUTCCN-n`, `ccn`, `e-notariado` | AUTCCN |
| `AUTCENSEC-n`, `censec` | AUTCENSEC |
| `AUTCNIB-n`, `cnib`, `serventia-api` | AUTCNIB |
| `AUTCRC-n`, `crc` | AUTCRC |
| `AUTDOI-n`, `doi` | AUTDOI |
| `AUTENOT-n`, `enot`, `fluxo de assinaturas`, `e-not assina`, `autenot` | AUTENOT |
| `AUTOCRA-n`, `cra`, `cra-127`, `webservice cra` | AUTOCRA |
| `AUTONR-n`, `onr`, `wsoficio`, `webservice onr` | AUTONR |
| `AUTORIB-n`, `rib` | AUTORIB |
| `AUTSEETJGO-n`, `see tjgo`, `see tjgo` | AUTSEETJGO |
| `AUTONRCPN-n`, `onrcpn`, `certidão eletrônica`, `e-proclamas` | AUTONRCPN |
| `AUTSIRC-n`, `sirc` | AUTSIRC |
<!-- batch-orchestrator:resolver-table:end -->

---

Ambiguidade → perguntar (nunca deduzir SOAP vs REST).

---

## AUTONRCPN — Certidão Eletrônica + e-Proclamas (ONRCPN)

| Campo | Valor |
|-------|-------|
| `batch_progress` | `Orius/integracoes/registro-civil/onrcpn/automacao/batch-progress.md` |
| `batch_id` exemplo | `onrcpn-1-13` |
| `plane_slug` | `autonrcpn` |
| `integration` | `onrcpn` |
| `vault_hub` | `Orius/integracoes/registro-civil/onrcpn/` |
| `utilizacao` | `.../automacao/utilizacao/{operacao}.md` |
| `desenvolvimento` | `.../automacao/desenvolvimento/{operacao}.md` |
| `postman_collection` | `postman/onrcpn-n8n/collection_postman.json` (a criar) |
| `postman_environment` | `postman/onrcpn-n8n/environment_postman.json` (a criar se necessário) |
| `postman_autocreate` | `true` — criar coleção/environment somente se ausentes |
| `env_section` | `ONRCPN — IdRC / Certidão Eletrônica` |
| `env_vars` | `ONRCPN_IDRC_TOKEN` (pendente), `ONRCPN_CERTIDAO_BASE_URL=https://certidaoh.registrocivil.org.br`, `ONRCPN_PROCLAMA_BASE_URL=https://servicosh.registrocivil.org.br/api/proclama` |
| **Modo lote** | `scaffold` — sem teste upstream até IdRC disponível |
| **Cards** | 13 (`AUTONRCPN-1`…`13`) — certidão (1–10) + e-Proclamas (11–13) |
| **Anchor** | TBD — auth Bearer IdRC compartilhado (sem card Auth dedicado ainda) |
| **Perfil upstream** | `rest-json` |
| **Subagente skills** | `agent-n8n-orchestrator`, `orius-n8n-integracoes`, `n8n-architect`, `obsidian-vault` |
| **Perfil upstream** | `rest-json` |
| **Proibido subagente** | perfis `soap-onr`, `soap-cra` |
| **Referência REST** | `*RIB.workflow.ts`, `Auth CNIB.workflow.ts` |
| `postman_proxy_folder` | `n8n — proxy ONRCPN` |

`execution_order` sugerida: `1` (create JSON) → `5` (get) → `2` (update) → `6` (sign) → demais certidão → `11` (health proclama) → `12`–`13`.

---

## AUTSEETJGO — API SEE TJGO (selo eletrônico GO)

| Campo | Valor |
|-------|-------|
| `batch_progress` | `Orius/integracoes/see-tjgo/automacao/batch-progress.md` |
| `batch_id` exemplo | `seetjgo-1-25` |
| `catalog` | `scripts/see-tjgo-endpoints.cjs` (25 endpoints OpenAPI v0.4.2) |
| `see_spec` | `Orius/integracoes/see-tjgo/endpoints/{method}-{path}.md` |
| `plane_slug` | `autseetjgo` |
| `integration` | `see tjgo` |
| `vault_hub` | `Orius/integracoes/see-tjgo/` |
| `utilizacao` | `.../automacao/utilizacao/{operacao}.md` |
| `desenvolvimento` | `.../automacao/desenvolvimento/{operacao}.md` |
| `postman_collection` | `postman/see-tjgo/collection_postman.json` |
| `postman_environment` | `postman/see-tjgo/environment_postman.json` |
| `postman_sync` | `npm run postman:sync:seetjgo` · config `postman/.postman-sync-seetjgo.json` |
| `postman_autocreate` | `true` — criar coleção/environment somente se ausentes |
| `env_section` | `SEE TJGO — API Sistema Extrajudicial (CGJ GO)` |
| `env_vars` | `SEE_TJGO_EMAIL`, `SEE_TJGO_PASSWORD`, `SEE_TJGO_HASH_CARTORIO`, `SEE_TJGO_API_BASE_URL`, `SEE_TJGO_API_BASE_URL_HML`, `SEE_TJGO_AMBIENTE` |
| **Anchor** | AUTSEETJGO-1 — `Sessions SEE TJGO.workflow.ts` — JWT por cartório |
| **Perfil upstream** | `rest-json` |
| **Cards** | 25 (`AUTSEETJGO-1`…`25`) — `plane_sequence_id` ≠ `canonical_seq` OpenAPI |
| **Lote ativo** | `seetjgo-1-25` (legado `seetjgo-1-13` superseded) |
| **Migração** | Transpor `scripts/autseetjgo-batch-state.json` → vault `batch-progress.md` |
| **Subagente skills** | `agent-n8n-orchestrator`, `orius-n8n-integracoes`, `n8n-architect`, `obsidian-vault` |
| **Perfil upstream** | `rest-json` |
| **Proibido subagente** | perfis `soap-onr`, `soap-cra` |
| **Referência REST** | `Auth CNIB.workflow.ts`, `*RIB.workflow.ts` |
| `postman_proxy_folder` | `n8n — proxy SEE TJGO` |
| `auth_header` | `Authorization: Bearer` ou `X-SEE-TJGO-Auth-Token` (após AUTSEETJGO-1) |

`execution_order` (`seetjgo-1-25`): ver `BATCH_EXECUTION_ORDER` em `scripts/see-tjgo-endpoints.cjs` — P0 primeiro, **não** ordem numérica 1…25.

<!-- batch-orchestrator:profile-stubs:start -->
## AUTCCN — CCN

| Campo | Valor |
|-------|-------|
| `batch_progress` | `Orius/integracoes/tabelionato-notas/ccn/automacao/batch-progress.md` |
| `batch_id` exemplo | `ccn-1` |
| `plane_slug` | `autccn` |
| `integration` | `ccn` |
| **Subagente skills** | `agent-n8n-orchestrator`, `n8n-architect`, `obsidian-vault` |

> Perfil gerado automaticamente — orquestrador deve preencher vault_hub, postman, env_section e adapter antes do lote.

## AUTCENSEC — CENSEC

| Campo | Valor |
|-------|-------|
| `batch_progress` | `Orius/integracoes/tabelionato-notas/censec/automacao/batch-progress.md` |
| `batch_id` exemplo | `censec-1` |
| `plane_slug` | `autcensec` |
| `integration` | `censec` |
| **Subagente skills** | `agent-n8n-orchestrator`, `n8n-architect`, `obsidian-vault` |

> Perfil gerado automaticamente — orquestrador deve preencher vault_hub, postman, env_section e adapter antes do lote.

## AUTDOI — DOI

| Campo | Valor |
|-------|-------|
| `batch_progress` | `Orius/integracoes/tabelionato-notas/doi/automacao/batch-progress.md` |
| `batch_id` exemplo | `doi-1` |
| `plane_slug` | `autdoi` |
| `integration` | `doi` |
| **Subagente skills** | `agent-n8n-orchestrator`, `n8n-architect`, `obsidian-vault` |

> Perfil gerado automaticamente — orquestrador deve preencher vault_hub, postman, env_section e adapter antes do lote.

## AUTENOT — E-Notariado Fluxo Assinaturas

| Campo | Valor |
|-------|-------|
| `batch_progress` | `Orius/integracoes/tabelionato-notas/fluxo-assinaturas/automacao/batch-progress.md` |
| `batch_id` exemplo | `enot-1` |
| `plane_slug` | `autenot` |
| `integration` | `enot` |
| **Subagente skills** | `agent-n8n-orchestrator`, `n8n-architect`, `obsidian-vault` |

> Perfil gerado automaticamente — orquestrador deve preencher vault_hub, postman, env_section e adapter antes do lote.

## AUTSIRC — SIRC

| Campo | Valor |
|-------|-------|
| `batch_progress` | `Orius/integracoes/registro-civil/sirc/automacao/batch-progress.md` |
| `batch_id` exemplo | `sirc-1` |
| `plane_slug` | `autsirc` |
| `integration` | `sirc` |
| **Subagente skills** | `agent-n8n-orchestrator`, `n8n-architect`, `obsidian-vault` |

> Perfil gerado automaticamente — orquestrador deve preencher vault_hub, postman, env_section e adapter antes do lote.

<!-- batch-orchestrator:profile-stubs:end -->
