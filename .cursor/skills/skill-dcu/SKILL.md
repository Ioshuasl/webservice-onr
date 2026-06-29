---
name: skill-dcu
description: >-
  Regras para artefatos .dcu legado Delphi 7 (Embarcadero): binário compilado,
  não destrinchar com
  IA. Inventário opcional, detecção de unit órfã (só .dcu sem .pas). Use no
  pipeline legado C:\Users\kenio\sistema-delphi.
---

# Skill DCU — artefatos compilados (legado Delphi 7)

Complementa [`skill-delphi`](../skill-delphi/SKILL.md).

## Regra principal

**`.dcu` não entra no pipeline de destrinchamento semântico.**

| Extensão | Conteúdo | Ação do pipeline |
|----------|----------|------------------|
| `.pas` | Fonte | Indexar + analisar |
| `.dfm` | Form | Indexar + analisar |
| `.dcu` | Bytecode compilado | Somente inventário |

## O que o indexador pode fazer com `.dcu`

1. **Contagem** por pasta/produto (métrica de build).
2. **Paridade** — para cada `NomeUnit.dcu`, verificar se existe `NomeUnit.pas`:
   - `.pas` existe → ignorar `.dcu` no batch.
   - só `.dcu` → nota `unidades-orfas/NomeUnit.md` com `status: somente-dcu`.
3. **Vendor** — `frx*.dcu`, `cx*.dcu`, etc. → tag `vendor: true`, sem nota detalhada.

## O que NUNCA fazer

- Pedir à IA para "ler" ou "destrinchar" conteúdo de `.dcu`
- Tratar `.dcu` como substituto de `.pas` ausente na documentação de negócio
- Incluir `.dcu` em `execution_order` de análise

## Grafo de dependências

Preferir:

1. Arquivo `.dpr` do produto (`uses` clauses)
2. `uses` extraídos dos `.pas` (manifest)
3. Opcional futuro: ferramenta Delphi / map file — fora do escopo da IA

## Nota vault — unit órfã (template mínimo)

`Orius/desenvolvimento/legado-delphi/produtos/<slug>/unidades-orfas/<Unit>.md`

```yaml
---
tipo: legado-delphi
area: orius
artefato: dcu
unit: NomeUnit
status: somente-dcu
arquivo_dcu: Produto/NomeUnit.dcu
pas_ausente: true
---
```

Corpo: data da verificação, pasta, ação sugerida (recuperar fonte do backup ou SVN).
