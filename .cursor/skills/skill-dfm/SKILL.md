---
name: skill-dfm
description: >-
  Regras para indexar e destrinchar formulários VCL (.dfm) legado Delphi 7
  (IDE Embarcadero): hierarquia
  de componentes, DataSource, eventos OnClick/OnCreate, ligação com métodos .pas.
  Use com agent-delphi-indexer, agent-delphi-analyzer em C:\Users\kenio\sistema-delphi.
---

# Skill DFM — formulários VCL (legado Delphi 7 / IDE Embarcadero)

Complementa [`skill-delphi`](../skill-delphi/SKILL.md) e [`skill-pas`](../skill-pas/SKILL.md).

## Charset (obrigatório — legado D7)

| Item | Valor |
|------|-------|
| Arquivo `.dfm` | Texto **latin1** / ISO-8859-1 (mesmo que `.pas`) |
| `Font.Charset` | **`ANSI_CHARSET`** — padrão VCL legado |
| Literais em `Caption` / `Text` | Preservar grafia do fonte; tag `[encoding ISO8859_1]` se mojibake |

Scripts de inventário DFM (quando existir `extract-delphi-dfm`) devem ler como **latin1**, nunca UTF-8.

## Relação DFM ↔ PAS

| Regra | Detalhe |
|-------|---------|
| Par padrão | `Formulario.pas` + `Formulario.dfm` (mesmo nome base) |
| Data Module | `dmPedido.dfm` ↔ `dmPedido.pas`, classe `TdmPedido` |
| Evento | `OnClick = btnSalvarClick` → procedure `TFormulario.btnSalvarClick` no `.pas` |
| Frame | `inline FrameX: TFrameX` → unit `FrameX.pas` |

O indexador deve cruzar **todo** evento `On*` com método existente no `.pas` pareado; marcar `handler_missing: true` se ausente.

## Indexador — o que listar

```json
{
  "form_class": "TPedido",
  "form_unit": "Pedido",
  "path": "RegistroDeImoveis/Pedido.dfm",
  "pas_pair": "RegistroDeImoveis/Pedido.pas",
  "components": [
    { "name": "btnConfirmar", "class": "TcxButton", "parent": "Pedido", "line": 42 }
  ],
  "data_sources": [
    { "name": "dsPedido", "dataset": "cdsPedido", "line": 10 }
  ],
  "events": [
    { "component": "btnConfirmar", "event": "OnClick", "handler": "btnConfirmarClick", "pas_line": null }
  ],
  "frames": [
    { "name": "FrameAndamento", "frame_class": "TFrameAndamento", "unit": "FrameAndamento" }
  ],
  "menus_actions": []
}
```

**Não** destrinchar fluxo de negócio no indexador.

## Analisador — escopo por job

| Job | Escopo |
|-----|--------|
| Form inteiro (índice) | Hierarquia resumida + links para eventos críticos |
| Um evento | Handler no `.pas` + componentes visuais envolvidos |
| Um Frame embutido | Nota em `formularios/<Form>/frames/<Frame>.md` |
| DataModule visual | Componentes não-visuais (datasets, connections) |

Contexto: trecho `.dfm` do componente (~20–80 linhas) + corpo do handler no `.pas`.

## Campos obrigatórios da nota vault (form)

`Orius/desenvolvimento/legado-delphi/produtos/<slug>/formularios/<Form>.md`

| Seção | Conteúdo |
|-------|----------|
| **Classe e unit** | `TPedido` / `Pedido.pas` |
| **Propósito da tela** | menu ou módulo que a abre |
| **Componentes principais** | grids, edits, abas — tabela nome / classe / função |
| **Datasets ligados** | via `TDataSource` → link para notas do dm |
| **Eventos críticos** | tabela evento → handler → link nota filha |
| **Navegação** | abre de / abre para (outras forms) |
| **Evidência** | trecho `.dfm` + handler `.pas` |

Nota por evento crítico:  
`.../formularios/<Form>/<Handler>.md`

## Eventos prioritários (destrinchar primeiro)

`OnCreate`, `OnShow`, `OnClose`, `OnClick`, `OnChange`, `OnExit`, `OnKeyPress`, ações de menu (`TMenuItem.OnClick`), `OnDestroy`.

## Legado Delphi 7 / VCL (Embarcadero IDE)

- Componentes comuns: `TForm`, `TPanel`, `TPageControl`, `TTabSheet`, `TDBGrid`, `TClientDataSet` no dm
- DevExpress antigo (`Tcx*`) em alguns módulos — tag `third_party: cx`
- `.dfm` em texto; propriedade `object` / `inherited`

## PROIBIDO

- Analisar `.dfm` sem verificar handler no `.pas`
- Inventar componente que não está no arquivo
- Substituir nota de procedure duplicada — linkar para `unidades/<Unit>/<Handler>.md` se já existir
