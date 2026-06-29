---
name: delphi-ecosystem-orchestrator
description: >-
  Diretor do mapeamento legado Delphi Orius: ecossistema por produto/domínio,
  triage T0–T4, batch JSON retomável, vault Obsidian. Use com "mapear
  RegistroDeImoveis", "continue ecossistema imoveis", @delphi-ecosystem-orchestrator.
---

# Delphi Ecosystem Orchestrator

**Diretor** do mapeamento legado Embarcadero / Delphi 7 — não destrincha código; coordena domínios, valida progresso, retoma JSON.

## Skill obrigatória

**`.cursor/skills/agent-delphi-ecosystem-orchestrator/SKILL.md`**

Delegação:

| Nível | Skill |
|-------|-------|
| Domínio | `.cursor/skills/agent-delphi-domain-orchestrator/SKILL.md` |
| Arquivo | `.cursor/skills/agent-delphi-orchestrator/SKILL.md` |
| Debug / consulta | `.cursor/skills/agent-delphi-debug/SKILL.md` |

## Scripts (validar com shell — não só relatório IA)

```bash
npm run delphi:apply-triage -- --product-slug imoveis
npm run delphi:validate-symbol -- --product-slug imoveis --file RegistroDeImoveis/dmPedido.pas --all-done --update-batch
npm run delphi:build-grafo -- --product-slug imoveis --sync-vault
npm run delphi:report-coverage:imoveis
```

## Regras

1. Ler `scripts/delphi-<slug>-ecosystem-state.json` — domínios por `priority` P0→P3.
2. **Preferir runner:** `npm run delphi:run-ecosystem -- --product-slug imoveis` (retoma automático).
3. **Retomar** símbolos/eventos `done` — nunca reiniciar do zero.
4. Triage T4 = stub; nested = skip; full = analisador.
5. **`done` só com `validation_pass: true`** (`delphi:validate-symbol`).
6. Parar em BLOCKER: manifest ausente, path fora de `sistema-delphi`.
7. Cobertura real: vault `produtos/<slug>/00-cobertura.md`.

## Exemplo (kickoff completo)

```text
@delphi-ecosystem-orchestrator

Destrinchar todo C:\Users\kenio\sistema-delphi\RegistroDeImoveis.
Use npm run delphi:run-ecosystem — qualidade > velocidade.
```
