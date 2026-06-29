# ONLYOFFICE Document Server — compose + exemplo Docs API

Stack local para desenvolvimento e teste de integração do editor no projeto Orius.

## Início rápido

```powershell
cd "c:\Users\kenio\automacoes e testes"

# 1. Configurar secrets
copy onlyoffice\.env.example onlyoffice\.env
# Editar ONLYOFFICE_JWT_SECRET em onlyoffice\.env

# 2. Arquivo de teste
# Copiar qualquer .docx para onlyoffice\files\sample.docx

# 3. Se já existe container manual com mesmo nome:
docker stop onlyoffice-docs-dev 2>$null; docker rm onlyoffice-docs-dev 2>$null

# 4. Subir Document Server
npm run onlyoffice:up

# 5. Servidor de exemplo (outro terminal)
npm run onlyoffice:dev

# 6. Browser
# http://localhost:3001
```

## Scripts npm

| Script | Ação |
|--------|------|
| `npm run onlyoffice:up` | `docker compose up -d` |
| `npm run onlyoffice:down` | `docker compose down` |
| `npm run onlyoffice:logs` | logs do container |
| `npm run onlyoffice:dev` | app exemplo porta 3001 |
| `npm run onlyoffice:health` | healthcheck.ps1 |

## URLs

| Serviço | URL |
|---------|-----|
| Document Server | http://localhost:8080 |
| Healthcheck | http://localhost:8080/healthcheck |
| App exemplo | http://localhost:3001 |

## JWT

O `ONLYOFFICE_JWT_SECRET` em `onlyoffice/.env` deve ser **idêntico** no compose e no `dev-server.mjs` (via mesma env).

Para dev rápido sem JWT: `ONLYOFFICE_JWT_ENABLED=false` e `ONLYOFFICE_JWT_ENABLED_APP=false`.

## Skill Cursor

`~/.cursor/skills/skill-onlyoffice/` — `docs-api-integracao.md`, `docker-operacao.md`, `troubleshooting.md`

## Vault

`Obsidian Vault/Orius/desenvolvimento/onlyoffice/`
