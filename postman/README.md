# Postman — ONR WebService n8n

## Coleção unificada

| Arquivo | Descrição |
|---------|-----------|
| `onr-webservice-n8n.postman_collection.json` | Auth ONR + List Titulos AT (webhooks n8n) |
| `onr-webservice-n8n.postman_environment.template.json` | Ambiente com todas as variáveis |

Coleções legadas (mantidas como referência): `Auth-ONR-n8n.postman_collection.json`, `ListTitulosAT-n8n.postman_collection.json`.

### Parse Memorial SIGEF (n8n)

| Arquivo | Descrição |
|---------|-----------|
| `Parse-Memorial-SIGEF-n8n.postman_collection.json` | Upload PDF memorial SIGEF → JSON estruturado (workflow `drRULxhBQUk10wbw`) |
| `Parse-Memorial-SIGEF-n8n.postman_environment.template.json` | Ambiente: Basic Auth n8n + `MEMORIAL_PDF_PATH` |

Webhook: `POST {{n8n_base_url}}/{{n8n_webhook_mode}}/sigef/memorial/parse` com `multipart/form-data`, campo **`memorial`** (PDF).

### DOI Validate JSON (n8n)

| Arquivo | Descrição |
|---------|-----------|
| `DOI-Validate-JSON-n8n.postman_collection.json` | Validação local de payload DOI-Web (`declaracoes[]`) — workflow `HewsInHfw3Gfrs5Z` |
| `DOI-Validate-JSON-n8n.postman_environment.template.json` | Ambiente: `n8n_base_url`, `n8n_webhook_mode`, `doi_n8n_webhook_path` |

Webhook: `POST {{n8n_base_url}}/{{n8n_webhook_mode}}/doi/validate-json` com `application/json`. Sem Basic Auth no nó (diferente dos workflows ONR/CENSEC).

Para teste no editor n8n: `n8n_webhook_mode` = `webhook-test` e **Execute workflow** antes de enviar.

### CCN Upload XML (n8n)

| Arquivo | Descrição |
|---------|-----------|
| `CCN-Upload-XML-n8n.postman_collection.json` | Upload XML CCN → e-notariado (`POST /api/uploads`) — workflow `oy22MYSQfB7CYcbl` |
| `CCN-Upload-XML-n8n.postman_environment.template.json` | Ambiente: Basic Auth n8n + `CCN_X_API_KEY` + `CCN_XML_PATH` |

Webhook: `POST {{n8n_base_url}}/{{n8n_webhook_mode}}/ccn/uploads` com `multipart/form-data`, campo **`file`** (XML). Headers: `X-Ambiente`, `X-Ccn-Api-Key`.

Exemplo XML local: `scripts/ccn/exemplo-ccn-minimo.xml` (1 pessoa, estrutura CCN16052023-1) · lista vazia: `exemplo-ccn-sem-pessoas.xml` · raiz inválida: `exemplo-ccn-raiz-invalida.xml`

## Sync em tempo real (Postman API)

1. Gere uma API key em [Postman → Settings → API keys](https://go.postman.co/settings/me/api-keys).
2. No `.env`:
   ```env
   POSTMAN_API_KEY=sua-chave
   POSTMAN_COLLECTION_UID=uid-da-colecao
   ```
3. **Primeira vez** — cria a coleção na nuvem e grava o UID:
   ```bash
   npm run postman:sync:create
   ```
   Ou importe manualmente o JSON, copie o UID em **Share → Via API** e salve em `.env` ou `postman/.postman-sync.json` (copie de `.postman-sync.json.example`).

4. **Push único** após editar o JSON local:
   ```bash
   npm run postman:sync
   ```

5. **Watch** — envia cada vez que você salva a coleção:
   ```bash
   npm run postman:sync:watch
   ```

O Postman desktop atualiza a coleção na nuvem após o PUT; pode ser necessário recarregar a aba da coleção.

### Erro 400: "The specified uid is invalid"

A API exige `info._postman_id` em formato **UUID** (não use slugs como `onr-webservice-n8n-2026`). O script `sync-postman-collection.js` corrige isso automaticamente no `--create`. O `POSTMAN_COLLECTION_UID` deve ser o UID completo (Share → Via API), ex.: `35976147-c006bdfe-e1be-4773-80d2-5fa0effed952`.

## Ambiente

```bash
node scripts/extract_cert/extract_cert.js
node scripts/postman/export-postman-env.js
```

Importe `onr-webservice-n8n.postman_environment.template.json` ou o ambiente local `n8n-orius.postman_environment.json` (gitignored, já com `n8n_base_url` e Basic Auth). Preencha certificado quando necessário.

**n8n (Easypanel):** `https://api-n8n.gbrqne.easypanel.host` · Basic Auth: `orius` / ver ambiente local (não commitar senha em templates públicos).
