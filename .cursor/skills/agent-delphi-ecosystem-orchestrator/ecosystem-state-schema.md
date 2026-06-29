# Schema — ecosystem state JSON (diretor)

Um arquivo por **produto**:

<!-- delphi-skills:products-table:start -->
| Slug | Pasta código | Batch JSON | Vault hub |
|------|--------------|------------|-----------|
| `imoveis` | `RegistroDeImoveis` | `scripts/delphi-imoveis-batch-state.json` | `Orius/desenvolvimento/legado-delphi/produtos/imoveis` |
| `civil` | `RegistroCivil` | `scripts/delphi-civil-batch-state.json` | `Orius/desenvolvimento/legado-delphi/produtos/civil` |
| `protesto` | `TabelionatoDeProtesto` | `scripts/delphi-protesto-batch-state.json` | `Orius/desenvolvimento/legado-delphi/produtos/protesto` |
| `rtd` | `RegistroDeTitulosEDocumentos` | `scripts/delphi-rtd-batch-state.json` | `Orius/desenvolvimento/legado-delphi/produtos/rtd` |
| `caixa` | `Caixa` | `scripts/delphi-caixa-batch-state.json` | `Orius/desenvolvimento/legado-delphi/produtos/caixa` |
<!-- delphi-skills:products-table:end -->

Sync: `npm run delphi:sync-skill-docs` · Triage: `npm run delphi:apply-triage`

Manifesto inventário: vault `.../inventario/inventario-fontes.json`  
Batch por arquivo: `scripts/delphi-<slug>-batch-state.json` (reutilizado)

---

## Raiz

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `product_slug` | string | `imoveis` |
| `product_path` | string | `RegistroDeImoveis` |
| `code_root` | string | `C:\\Users\\kenio\\sistema-delphi` |
| `ecosystem_state_file` | string | auto-referência |
| `vault_hub` | string | `Orius/.../produtos/imoveis` |
| `inventario_vault` | string | `.../inventario/inventario-fontes.json` |
| `active_domain_id` | string \| null | Domínio em execução |
| `status` | string | `pending` \| `in_progress` \| `complete` |
| `started_at` | ISO8601 | |
| `completed_at` | ISO8601 \| null | |
| `domains` | object | mapa `domain_id` → domínio |
| `triage_rules` | array | regras glob → tier |

## Domínio (`domains[id]`)

| Campo | Descrição |
|-------|-----------|
| `domain_id` | ex. `ri-core-pedido` |
| `label` | nome legível |
| `priority` | `P0` … `P3` |
| `status` | `pending` \| `in_progress` \| `partial` \| `done` |
| `execution_order` | paths relativos `.pas` / `.dfm` |
| `files_total` | |
| `files_done` | |
| `current_file` | path ou null |
| `active_file_batch_id` | ex. `imoveis-dmPedido-fase2` |
| `notes` | escopo, exclusões |

## Arquivo (referência cruzada)

Detalhe de símbolos permanece em `delphi-imoveis-batch-state.json` → `batches[batch_id].files[path]`.

O ecosystem só rastreia **progresso por arquivo**:

```json
"file_progress": {
  "RegistroDeImoveis/dmPedido.pas": {
    "batch_id": "imoveis-dmPedido-poc",
    "index_status": "done",
    "analyze_status": "partial",
    "symbols_done": 8,
    "symbols_total": 157,
    "tier_default": "T1"
  }
}
```

## Triage rules (exemplo)

```json
"triage_rules": [
  { "glob": "**/dependencias/**", "tier": "T0", "action": "skip" },
  { "glob": "**/*Cópia*", "tier": "T0", "action": "skip" },
  { "glob": "**/sql*CalcFields*", "tier": "T4", "action": "stub" },
  { "glob": "**/sql*AfterScroll*", "tier": "T4", "action": "stub" },
  { "glob": "dm*.pas", "tier": "T1", "action": "full" },
  { "glob": "ws*.pas", "tier": "T2", "action": "full" }
]
```

| `action` | Comportamento |
|----------|----------------|
| `skip` | só inventário |
| `stub` | nota mínima (dataset + 1 frase) |
| `full` | indexer + analyzer (+ segmentos) |
| `index_only` | manifest sem análise semântica |

---

## Ordem de execução global

1. Domínios por `priority` (`P0` primeiro)
2. Dentro do domínio: `execution_order` (dm antes de forms; `.pas` antes `.dfm` pareado)
3. Dentro do arquivo: símbolos por tier (T1 antes T4); segmentos em série

---

## Retomada

Campos obrigatórios para resume:

- `active_domain_id`
- `domains[id].current_file`
- `domains[id].active_file_batch_id`
- batch JSON com `symbols[].status`

Comando: `Continue ecossistema {slug}` — diretor lê JSON, não reinicia `done`.
