# Schema — runner state JSON

`scripts/delphi-<slug>-runner-state.json`

## Campos

| Campo | Descrição |
|-------|-----------|
| `product_slug` | `imoveis` |
| `status` | `running` \| `needs_ai` \| `complete` \| `paused` |
| `started_at` | ISO8601 |
| `last_tick_at` | ISO8601 |
| `ticks` | contador de invocações |
| `active_domain_id` | domínio corrente |
| `active_file` | path relativo corrente |
| `config` | ver abaixo |
| `last_actions` | array da última tick |

## Config (`config`)

| Campo | Default | Descrição |
|-------|---------|-----------|
| `symbols_per_ai_batch` | 15 | Símbolos full por lote IA |
| `events_per_ai_batch` | 10 | Eventos DFM por lote |
| `stub_per_ai_batch` | 20 | Stubs T4 agrupados |
| `require_validation_pass` | true | Arquivo só `done` se gates OK |
| `auto_validate` | true | Roda validate após index/triage |
| `auto_grafo_on_domain_complete` | true | `build-grafo` ao fechar domínio |
| `auto_coverage_each_tick` | true | Atualiza `00-cobertura.md` |

## Exit codes (`delphi-ecosystem-runner.cjs`)

| Code | Significado |
|------|-------------|
| 0 | Tick OK / domínio ou ecossistema completo |
| 2 | **needs_ai** — ler `registro-imoveis/runner-next-prompt.md` |
| 1 | Erro |

## Arquivos gerados

| Arquivo | Conteúdo |
|---------|----------|
| `scripts/delphi-<slug>-runner-next.json` | fila JSON do lote |
| `registro-imoveis/runner-next-prompt.md` | prompt Cursor |

## Comandos

```bash
npm run delphi:ensure-product -- --product-slug imoveis --init-domains
npm run delphi:run-ecosystem:init
npm run delphi:run-ecosystem -- --product-slug imoveis
npm run delphi:run-ecosystem:loop -- --product-slug imoveis
```
