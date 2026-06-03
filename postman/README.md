# Postman — ONR WebService (WSOficio)

> **Fonte canônica (Git):** [OriusTecnologia/N8N](https://git.oriustecnologia.com/OriusTecnologia/N8N.git) — branch `main`, arquivos em `*/postman/*.postman_collection.json`.  
> Clone: `git clone https://git.oriustecnologia.com/OriusTecnologia/N8N.git` · espelho em `orius N8N/` neste repo · publicar: `npm run n8n:sync:postman:orius`.

## Coleção unificada ONR (desenvolvimento local)

| Arquivo | Descrição |
|---------|-----------|
| [`onr-webservice-n8n.postman_collection.json`](onr-webservice-n8n.postman_collection.json) | **Única coleção** para proxies n8n + SOAP login de referência |
| [`onr-webservice-n8n.postman_environment.template.json`](onr-webservice-n8n.postman_environment.template.json) | Environment opcional (sobrescreve Collection variables) |

**Variáveis HML:** todas em **Collection variables** (aba Variables da coleção), no estilo CCN. O environment é opcional para secrets locais ou overrides.

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

## Outras coleções (fora do WSOficio ONR)

Estas **não** entram na coleção unificada ONR (outros produtos/domínios):

| Coleção | Domínio |
|---------|---------|
| [`CCN-Upload-XML-n8n`](CCN-Upload-XML-n8n.postman_collection.json) | CCN / e-notariado |
| [`censec-n8n`](censec-n8n.postman_collection.json) | CENSEC |
| [`DOI-Validate-JSON-n8n`](DOI-Validate-JSON-n8n.postman_collection.json) | DOI validação local |
| [`Parse-Memorial-SIGEF-n8n`](Parse-Memorial-SIGEF-n8n.postman_collection.json) | SIGEF memorial |

CCN: `npm run postman:sync:ccn` · variáveis explícitas na própria coleção CCN.

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
