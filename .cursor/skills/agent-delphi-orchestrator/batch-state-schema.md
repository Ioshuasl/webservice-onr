# Schema — Delphi batch state JSON

Um arquivo por **produto** em `scripts/`:

<!-- delphi-skills:products-table:start -->
| Slug | Pasta código | Batch JSON | Vault hub |
|------|--------------|------------|-----------|
| `imoveis` | `RegistroDeImoveis` | `scripts/delphi-imoveis-batch-state.json` | `Orius/desenvolvimento/legado-delphi/produtos/imoveis` |
| `civil` | `RegistroCivil` | `scripts/delphi-civil-batch-state.json` | `Orius/desenvolvimento/legado-delphi/produtos/civil` |
| `protesto` | `TabelionatoDeProtesto` | `scripts/delphi-protesto-batch-state.json` | `Orius/desenvolvimento/legado-delphi/produtos/protesto` |
| `rtd` | `RegistroDeTitulosEDocumentos` | `scripts/delphi-rtd-batch-state.json` | `Orius/desenvolvimento/legado-delphi/produtos/rtd` |
| `caixa` | `Caixa` | `scripts/delphi-caixa-batch-state.json` | `Orius/desenvolvimento/legado-delphi/produtos/caixa` |
<!-- delphi-skills:products-table:end -->

Sync: `npm run delphi:sync-skill-docs`

---

## Raiz (por arquivo)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `product_slug` | string | `imoveis`, `civil`, … |
| `code_root` | string | `C:\\Users\\kenio\\sistema-delphi` |
| `product_path` | string | ex. `RegistroDeImoveis` |
| `batch_state_file` | string | auto-referência |
| `active_batch_id` | string \| null | Batch em execução |
| `batches` | object | Mapa `batch_id` → batch |

## Batch

| Campo | Obrigatório | Descrição |
|-------|-------------|-----------|
| `batch_id` | ✅ | ex. `imoveis-core-pedido` |
| `product_slug` | ✅ | |
| `product_path` | ✅ | Pasta sob `code_root` |
| `vault_hub` | ✅ | Path relativo vault `legado-delphi/produtos/<slug>/` |
| `started_at` | ao iniciar | ISO8601 |
| `completed_at` | ao fechar | ISO8601 ou null |
| `execution_order` | ✅ | Array de paths relativos `.pas`/`.dfm` |
| `current_file` | | Path relativo ou null |
| `status` | ✅ | `pending` \| `in_progress` \| `complete` |
| `files` | ✅ | Mapa path → file state |

## File state (`files[path]`)

| Campo | Descrição |
|-------|-----------|
| `index_status` | `pending` \| `in_progress` \| `done` \| `skip` |
| `analyze_status` | `pending` \| `in_progress` \| `done` \| `skip` |
| `symbols_total` | número |
| `symbols_done` | número |
| `manifest_vault` | path relativo no vault |
| `priority_symbols` | array opcional |
| `vendor` | boolean |
| `duplicate` | boolean |
| `tier_default` | `T0`–`T4` (após `delphi:apply-triage`) |
| `analyze_action` | `skip` \| `index_only` \| `full` \| `stub` |
| `triage_rule` | glob que classificou o arquivo |
| `triaged_at` | ISO8601 |
| `symbols_pending` | contagem pós-triage |
| `symbols_skip` | nested / T0 |
| `symbols_stub_pending` | T4 pendentes |
| `symbols_full_pending` | T1/T2/T3 pendentes |
| `analyze_progress_pct` | % done excl. skip |

## Symbol card (`symbols` opcional por arquivo)

Mapa `symbol_name` →:

| Campo | Descrição |
|-------|-----------|
| `symbol_type` | procedure, function, type, event |
| `line_start`, `line_end` | |
| `status` | `pending` \| `in_progress` \| `done` \| `skip` \| `needs_split` |
| `vault_path` | nota gerada |
| `gates` | `{ evidencia, sql, chamadas, briefing }` |
| `analyze_tier` | `T0`–`T4` |
| `analyze_action` | `full` \| `stub` \| `skip_analyze` |
| `triage_rule` | glob que classificou |
| `stub` | `true` se T4 stub pendente |
| `nested_in` | símbolo pai (procedures aninhadas) |
| `triage_note` | motivo skip nested |
| `priority` | boolean |
| `validation_pass` | boolean — `validate-delphi-symbol.cjs` |
| `validation_errors` | string[] |
| `validated_at` | ISO8601 |

### Segmentação (span > 250)

Ver [symbol-segment-schema.md](symbol-segment-schema.md): `needs_split`, `split_threshold`, `chunk_size`, `segment_status`, `segments_total`, `segments_done`, `segment_plan_vault`, `merge_status`, `segments`.

## File state — `.dfm` (`artifact: dfm`)

| Campo | Descrição |
|-------|-----------|
| `artifact` | `dfm` |
| `form_class` | ex. `TfrmPedido` |
| `form_unit` | ex. `Pedido` |
| `pas_pair` | path `.pas` pareado |
| `events_total` | número |
| `events_done` | número |
| `handlers_missing` | handlers sem linha no PAS |
| `priority_handlers` | array de handlers críticos |
| `events` | mapa `handler` → event card |

### Event card (`events[handler]`)

| Campo | Descrição |
|-------|-----------|
| `component` | nome no `.dfm` |
| `event` | `OnClick`, `OnCreate`, … |
| `line_dfm` | linha no `.dfm` |
| `handler_line_start`, `handler_line_end` | no `.pas` |
| `handler_missing` | boolean |
| `status` | `pending` \| `done` \| `skip` |
| `analyze_tier` | geralmente `T3` |
| `vault_path` | nota em `formularios/<Form>/<Handler>.md` |

---

## Manifest (`*.symbols.json`)

Gerado pelo **indexador**; path vault:

`Orius/desenvolvimento/legado-delphi/produtos/<slug>/manifest/<base>.symbols.json`

```json
{
  "unit": "dmPedido",
  "path": "RegistroDeImoveis/dmPedido.pas",
  "product_slug": "imoveis",
  "delphi_version": 7,
  "ide": "Embarcadero RAD Studio",
  "line_count": 12179,
  "indexed_at": "2026-06-15T12:00:00Z",
  "vendor": false,
  "duplicate": false,
  "uses_interface": ["SysUtils", "Classes", "DB"],
  "uses_implementation": ["Dialogs"],
  "types": [
    { "name": "TdmPedido", "kind": "class", "ancestor": "TDataModule", "line": 95 }
  ],
  "procedures": [
    {
      "name": "GravarPedido",
      "class": "TdmPedido",
      "line_start": 2100,
      "line_end": 2280,
      "visibility": "public"
    }
  ],
  "functions": [],
  "dfm_pair": {
    "path": "RegistroDeImoveis/dmPedido.dfm",
    "form_class": "TdmPedido"
  },
  "related_units": ["Pedido", "dmONR"]
}
```

### Manifest DFM (`*.dfm.json`)

Gerado por `npm run delphi:extract-dfm` — path vault:

`Orius/desenvolvimento/legado-delphi/produtos/<slug>/manifest/<Form>.dfm.json`

---

## Exemplo — batch vazio (imóveis)

```json
{
  "product_slug": "imoveis",
  "code_root": "C:\\Users\\kenio\\sistema-delphi",
  "product_path": "RegistroDeImoveis",
  "batch_state_file": "scripts/delphi-imoveis-batch-state.json",
  "active_batch_id": null,
  "batches": {}
}
```

Popular `execution_order` e `files` ao criar lote `imoveis-core-pedido` (ver [product-profiles.md](product-profiles.md)).
