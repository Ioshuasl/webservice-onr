# Postman — ONR WebService n8n

## Coleção unificada

| Arquivo | Descrição |
|---------|-----------|
| `onr-webservice-n8n.postman_collection.json` | Auth ONR + List Titulos AT (webhooks n8n) |
| `onr-webservice-n8n.postman_environment.template.json` | Ambiente com todas as variáveis |

Coleções legadas (mantidas como referência): `Auth-ONR-n8n.postman_collection.json`, `ListTitulosAT-n8n.postman_collection.json`.

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

Importe `onr-webservice-n8n.postman_environment.template.json` e preencha `N8N_BASIC_AUTH_*` + certificado.
