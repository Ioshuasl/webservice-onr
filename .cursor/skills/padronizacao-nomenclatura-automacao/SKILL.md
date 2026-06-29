---
name: padronizacao-nomenclatura-automacao
description: >-
  Padrão de nomenclatura multi-projeto Plane para automações n8n: título de card,
  workflow n8n, frontmatter vault e requests Postman. Use ao migrar integrações
  de AUTONR para projetos dedicados (AUTCNIB, AUTORIB, AUTOCRA, …) ou ao criar
  novos workflows/cards.
---

# Padronização — nomenclatura multi-projeto (Plane + n8n + vault + Postman)

Documento canônico no vault: `Orius/desenvolvimento/padronizacao-n8n-autonr-plane-postman.md`  
Catálogo projetos: `Meta/integracoes/plane/projetos/00-indice-projetos.md`

---

## Regra única (1:1 em todos os artefatos)

```text
[{IDENTIFICADOR}-<n>] (<integração>) <Método> - <Classificação>
```

| Campo | Origem | Exemplo CNIB |
|-------|--------|--------------|
| `{IDENTIFICADOR}` | `plane_identifier` do projeto Plane | `AUTCNIB` |
| `<n>` | `plane_sequence_id` **no projeto destino** (não legado AUTONR) | `1` |
| `<integração>` | Tag curta da central/API (minúsculas) | `cnib` |
| `<Método>` | Nome da operação (`operacao` no registry) | `AuthToken` |
| `<Classificação>` | Domínio funcional | `CNIB`, `Ordem`, `Documentos` |

**Exemplo completo:**

```text
[AUTCNIB-1] (cnib) AuthToken - CNIB
[AUTONR-46] (onr) ObterXMLSolicitacoes_v6 - Certidões
[AUTOCRA-1] (cra) Remessa - Remessa
[AUTCENSEC-1] (censec) CENSEC_UploadJSON - CENSEC
```

---

## Onde aplicar (obrigatório, mesmo texto)

| Artefato | Campo / local |
|----------|----------------|
| **Plane** | `name` do work item |
| **n8n** | `name` do workflow (`@workflow({ name: '…' })`) |
| **Vault** | `workflow_n8n` no frontmatter; tabela "Atividade Plane" |
| **Postman** | `name` do request na pasta **n8n — proxy** |
| **Registry** | `card_name` em `maps/<slug>-work-items.json` |

Postman upstream (referência direta na API) pode usar sufixo `— upstream (referência)`:

```text
[AUTCNIB-1] OAuth — upstream (referência)
```

---

## Frontmatter vault (utilizacao / desenvolvimento)

```yaml
plane_project: autcnib
plane_project_identifier: AUTCNIB
plane_key: AUTCNIB-1
plane_sequence_id: 1
plane_url: http://…/projects/<uuid-autcnib>/issues/1
workflow_n8n: "[AUTCNIB-1] (cnib) AuthToken - CNIB"
```

**Legado:** `plane_key: AUTONR-n` + `plane_legacy_key: AUTONR-143` (opcional, só durante migração).

---

## Mapeamento integração → projeto Plane

| Integração (`<integração>`) | Identificador | Slug registry |
|----------------------------|---------------|---------------|
| `onr` | AUTONR | `autonr` |
| `cnib` | AUTCNIB | `autcnib` |
| `rib` | AUTORIB | `autorib` |
| `cra` | AUTOCRA | `autocra` |
| `ccn` | AUTCCN | `autccn` |
| `censec` | AUTCENSEC | `autcensec` |
| `doi` | AUTDOI | `autdoi` |
| `sigef` | AUTONR *(por enquanto)* | `autonr` |
| `crc` | AUTCRC | `autcrc` |
| `onrcpn` | AUTONRCPN | `autonrcpn` |

SIGEF permanece em **AUTONR** até decisão de projeto dedicado.

---

## Migração AUTONR → projeto dedicado

1. Criar cards no projeto novo (`create-*-plane-tasks` ou `migrate-*-to-aut*.cjs`).
2. Gravar `maps/<slug>-work-items.json`.
3. Atualizar vault (`plane_key`, `plane_project`, URLs, `workflow_n8n`).
4. Renomear workflow n8n + `n8nac push`.
5. Renomear requests Postman + validar `npm run postman:validate`.
6. Cancelar ou arquivar cards legados no `autonr` (opcional, `--cancel-legacy`).

**CNIB (referência):** AUTONR-143…148 → AUTCNIB-1…6 — script `migrate-cnib-to-autcnib.cjs`.  
**CRA (referência):** AUTONR-127…142 → AUTOCRA-1…16 — script `migrate-cra-to-autocra.cjs`.  
**RIB (referência):** AUTONR-91…126 → AUTORIB-1…36 — script `migrate-rib-to-autorib.cjs` · batch `rib-1-36`.  
**CCN (referência):** AUTONR-88…90 → AUTCCN-1…3 — script `migrate-ccn-to-autccn.cjs` · batch `ccn-1-3`.  
**DOI (referência):** AUTONR-87 → AUTDOI-1 — script `migrate-doi-to-autdoi.cjs` · batch `doi-1`.  
**CENSEC (referência):** AUTONR-13 → AUTCENSEC-1 — script `migrate-censec-to-autcensec.cjs` · batch `censec-1`.

---

## Parsing de títulos (scripts Plane)

Regex canônica em `plane-registry.js`:

```javascript
/^\[([A-Z]+)-\d+\]\s+\([^)]+\)\s+(\S+)\s+-/i
// grupo 1 = identificador, grupo 2 = operacao
```
