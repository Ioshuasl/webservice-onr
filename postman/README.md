# Postman — ONR WebService (WSOficio)

> **Fonte canônica (Git):** [OriusTecnologia/N8N](https://git.oriustecnologia.com/OriusTecnologia/N8N.git) — branch `main`, arquivos em `*/postman/*.postman_collection.json`.  
> Clone: `git clone https://git.oriustecnologia.com/OriusTecnologia/N8N.git` · espelho em `orius N8N/` neste repo · publicar: `npm run n8n:sync:postman:orius`.

## Nomenclatura AUTONR (obrigatório)

Todo request que corresponde a um card **AUTONR** no Plane deve seguir o formato:

```text
[AUTONR-n] Nome descritivo
```

Exemplos: `[AUTONR-2] Auth ONR — Login` · `[AUTONR-91] Auth Token` · `[AUTONR-84] Importacao Arquivos CTP — Solicitar URL upload`

| Regra | Detalhe |
|-------|---------|
| **Formato** | `[AUTONR-<n>]` + espaço + nome legível (use ` — ` para ação ou cenário de teste) |
| **Pastas** | Sem prefixo — só folhas com `request` |
| **Fonte do `n`** | `Obsidian Vault/.../plane/maps/autonr-work-items.json` → `plane_key` |
| **Proibido** | `AUTONR-n: Nome` (legado com dois-pontos; migrar com `--fix`) |
| **Isentas** | `assinador-onr` e coleções sem card AUTONR |

**Validar** (falha o sync se houver violação):

```bash
npm run postman:validate:naming
npm run postman:validate:naming:fix   # migra AUTONR-n: → [AUTONR-n] e aplica prefixos pendentes
```

Helpers: `scripts/postman/postman-request-naming.cjs` · registry ONR: `onr-postman-autonr-registry.cjs` · regra Cursor: `.cursor/rules/postman-autonr-naming.mdc`.

## Coleção unificada ONR (variáveis explícitas)

| Arquivo | Descrição |
|---------|-----------|
| [`onr-webservice-n8n-variaveis-explicitas.postman_collection.json`](onr-webservice-n8n-variaveis-explicitas.postman_collection.json) | **Coleção canônica** — nome no Postman: *ONR WebService — n8n (variáveis explícitas)* |
| [`onr-webservice-n8n.postman_collection.json`](onr-webservice-n8n.postman_collection.json) | Espelho idêntico (sync legado / links antigos) |
| [`onr-webservice-n8n.postman_environment.template.json`](onr-webservice-n8n.postman_environment.template.json) | Environment **opcional** (sobrescreve Collection variables) |

**Variáveis HML:** o JSON traz a lista **completa** em `variable[]` (template + webhooks dos workflows + chaves usadas nos requests). Ao reimportar, use **Replace** na coleção para **sobrescrever todas** as Collection variables — não faz merge com variáveis antigas nem importa environment automaticamente.

### Pastas por domínio (spec WSOficio)

| Pasta | Serviço |
|-------|---------|
| **3.1 Login** | `login.asmx` — subpastas `n8n — Auth ONR` e `SOAP direto (referência)` |
| **3.2 Acompanhamento de Títulos** | `acompanhamentotitulos.asmx` |
| **3.3 Penhora Online** | `penhoraonline.asmx` |
| **3.5 Ofícios** | `oficios.asmx` |
| **3.6 Certidões a Emitir** | `Certidoes.asmx` |

### Fluxo recomendado

1. Preencha certificado e `ONR_SERVENTIA_CHAVE` nas **Collection variables**
2. **3.1 Login → n8n — Auth ONR** (grava `onr_hash` na coleção e no environment, se houver)
3. Execute requests do domínio desejado

### Inventário (proxies n8n por pasta)

Gerado a partir de `workflows/n8n/extensao-n8n-teste/*.workflow.ts` (36 workflows ONR; exclui CCN, CENSEC, DOI, SIGEF).

| Pasta | Requests | Workflows cobertos |
|-------|----------|-------------------|
| **3.2 Acompanhamento de Títulos** | 9 | List/Get Titulo e Status, Insert/Update/Delete Titulo, Insert/Update Status |
| **3.3 Penhora Online** | 15 | List/Get Pedidos, List Varas, List Exportação, Set Prenotacao/Baixa/Custas/Penhora/Pedido* |
| **3.5 Ofícios** | 10 | List Pedidos (v1 e v2), Get Pedido, List Instituições/Cartórios, Set Respondido/Devolvido/Retransmitido/Negativa Lote |
| **3.6 Certidões a Emitir** | 3 | Obter XML v6 (+ por protocolo), Devolver Certidao |
| **3.1 Login** | 4+ | Auth ONR (n8n) + SOAP direto (referência) |

### Regenerar após mudanças

Lê os workflows, preserva bodies/tests já refinados e aplica login + certidões:

```bash
npm run postman:build:onr
```

Script: `scripts/postman/build-onr-collection-from-workflows.cjs` → `build-onr-unified-collection.js`.

Coleções antigas arquivadas em [`legacy/`](legacy/).

### Sync Postman Cloud

```bash
npm run postman:sync
```

---

## Assinador ONR (SOAP direto)

| Arquivo | Descrição |
|---------|-----------|
| [`assinador-onr.postman_collection.json`](assinador-onr.postman_collection.json) | **wsassinador** — variáveis HML explícitas em **Collection variables** |
| [`assinador-onr.postman_environment.template.json`](assinador-onr.postman_environment.template.json) | Template opcional (sobrescreve a coleção) |

Regenerar após editar o template ou o script:

```bash
npm run postman:build:assinador
```

Documentação: `assinador-onr/manual-endpoint-assinador-.md`. O `assinador_hash` costuma ser o `onr_hash` do login em `onr-webservice-n8n` (3.1 Login).

---

## Outras coleções (fora do WSOficio ONR)

Estas **não** entram na coleção unificada ONR (outros produtos/domínios):

| Coleção | Domínio |
|---------|---------|
| [`CCN-Upload-XML-n8n`](CCN-Upload-XML-n8n.postman_collection.json) | CCN / e-notariado |
| [`censec-n8n`](censec-n8n.postman_collection.json) | CENSEC |
| [`censec-n8n.postman_environment.template.json`](censec-n8n.postman_environment.template.json) | Environment CENSEC (opcional; sobrescreve Collection variables) |
| [`DOI-Validate-JSON-n8n`](DOI-Validate-JSON-n8n.postman_collection.json) | DOI validação local |
| [`Parse-Memorial-SIGEF-n8n`](Parse-Memorial-SIGEF-n8n.postman_collection.json) | SIGEF memorial |
| [`RIB-n8n`](RIB-n8n.postman_collection.json) | API Registro de Imóveis do Brasil (RIB) |
| [`RIB-n8n.postman_environment.template.json`](RIB-n8n.postman_environment.template.json) | Environment RIB (opcional; sobrescreve Collection variables) |

CCN: `npm run postman:sync:ccn` · variáveis explícitas na própria coleção CCN.

**Sync Postman Cloud (CCN, CENSEC, DOI, SIGEF):**

```bash
npm run postman:sync:integrations   # valida [AUTONR-n] + publica as 4 coleções
npm run postman:sync:ccn
npm run postman:sync:censec
npm run postman:sync:doi
npm run postman:sync:sigef
```

Configs locais (gitignored): `.postman-sync-ccn.json`, `.postman-sync-censec.json`, `.postman-sync-doi.json`, `.postman-sync-sigef.json` (templates `.example`).

**RIB:** coleção canônica em [`RIB-n8n`](RIB-n8n.postman_collection.json). **Não reimporte** após cada alteração — publique no Postman Cloud:

```bash
npm run postman:sync:rib          # push único
npm run postman:sync:rib:watch    # observa o JSON e publica automaticamente
```

Config local (gitignored): `postman/.postman-sync-rib.json` (UID `35976147-81ffb313-b01c-419e-941c-f97156a7fbd5`). API key: `POSTMAN_API_KEY` no `.env`. Primeira vez em workspace novo: `npm run postman:sync:rib:create`.

Environment opcional: [`RIB-n8n.postman_environment.template.json`](RIB-n8n.postman_environment.template.json) — preencha `RIB_API_CLIENT_ID` / `RIB_API_CLIENT_SECRET` (vault `[[env#RIB]]`). Use `RIB_AMBIENTE` (`producao` ou `homologacao`). Fluxo: **autenticacao → Token — produção** (grava `rib_access_token`).

**CENSEC:** importe [`censec-n8n`](censec-n8n.postman_collection.json) + [`censec-n8n.postman_environment.template.json`](censec-n8n.postman_environment.template.json). Preencha `CENSEC_API_KEY` e `N8N_BASIC_AUTH_PASSWORD` no environment (valores em Obsidian `[[env]]` ou `.env` local). A coleção já traz defaults HML em Collection variables; o environment opcional sobrescreve. Fonte: `orius N8N/Censec/env.md`.

---

## Sync em tempo real (Postman API)

1. API key em [Postman → Settings → API keys](https://go.postman.co/settings/me/api-keys).
2. `.env`: `POSTMAN_API_KEY`, `POSTMAN_COLLECTION_UID`
3. Primeira vez: `npm run postman:sync:create`
4. Push: `npm run postman:sync` · watch: `npm run postman:sync:watch`

### Erro 400: UID inválido

`info._postman_id` deve ser UUID. UID completo em Share → Via API.

## Ambiente local

```bash
node scripts/extract_cert/extract_cert.js
node scripts/postman/export-postman-env.js
```

Importe o template ou ambiente local gitignored. **n8n:** `https://api-n8n.gbrqne.easypanel.host` · Basic Auth nas Collection variables.

**Auth ONR:** preencha `ONR_SERVENTIA_CHAVE` nas Collection variables (mesmo valor do `.env` local) para o workflow calcular `hashes`/`hash` corretamente no login.
