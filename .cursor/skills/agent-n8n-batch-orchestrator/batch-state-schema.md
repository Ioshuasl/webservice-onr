# Schema — batch state JSON (**legado — deprecado**)

> **Substituído por:** [batch-progress-schema.md](batch-progress-schema.md)  
> Estado de lote agora vive em **`batch-progress.md`** no vault Obsidian.

Não criar nem atualizar `scripts/aut*-batch-state.json` para novos lotes.

---

## Migração

| Antes | Depois |
|-------|--------|
| `scripts/autcnib-batch-state.json` | `Orius/integracoes/.../automacao/batch-progress.md` |
| `npm run batch:ensure-domain` (JSON) | Copiar template vault `_template-batch-progress-n8n.md` |
| `batch-state-paths.cjs` | [batch-progress-paths.md](batch-progress-paths.md) |

Arquivos JSON existentes no repo podem ser consultados para migração pontual; o orquestrador **não** os grava mais.

Schema JSON histórico (referência): ver commits anteriores ou `scripts/autcnib-batch-state.json` como exemplo.
