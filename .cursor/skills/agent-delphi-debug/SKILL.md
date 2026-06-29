---
name: agent-delphi-debug
description: >-
  Consulta legado Delphi via Obsidian vault + grafo de chamadas — localiza
  arquivo, linha e briefing para debug sem reler .pas inteiro. Use com "erro na
  prenotação", "onde está X no RI", @agent-delphi-debug.
disable-model-invocation: true
---

# Agent Delphi Debug — consulta vault + grafo

**Papel:** responder perguntas de **debug e implementação** usando **somente** vault indexado e grafo — não destrinchar código novo.

**Raiz código (só se validação falhar):** `C:\Users\kenio\sistema-delphi`

## Fontes (ordem)

1. `produtos/<slug>/00-cobertura.md` — o que já está mapeado
2. `produtos/<slug>/grafo/chamadas.json` + `grafo/00-chamadas.md`
3. `produtos/<slug>/unidades/<Unit>/<Symbol>.md` — notas `status: revisado`
4. `produtos/<slug>/formularios/<Form>.md` + handlers
5. `Orius/desenvolvimento/banco-de-dados/` — tabelas Firebird
6. Manifest `manifest/*.symbols.json` — linhas exatas

**Evitar:** abrir `.pas` > 50 linhas salvo confirmação pontual após `npm run delphi:validate-symbol`.

## Skills obrigatórias

1. [`skill-delphi`](../skill-delphi/SKILL.md) — prefixos Firebird por produto
2. [`obsidian-vault`](file:///C:/Users/kenio/.cursor/skills/obsidian-vault/SKILL.md)

## Fluxo de resposta

```mermaid
flowchart LR
  Q[Pergunta usuário] --> C[00-cobertura + keywords]
  C --> G[grafo/chamadas.json]
  G --> N[Nota símbolo revisado]
  N --> B[Tabelas Firebird vault]
  B --> R[Resposta: arquivo + linhas + briefing]
```

### Exemplo — "erro ao prenotar"

1. Buscar nós `Prenotar`, `ConfirmarPrenotacao`, `InserirProtocolo` no grafo
2. Ler [[unidades/dmPedido/Prenotar]] (merge `revisado`)
3. Listar mensagens da seção **Mensagens e erros**
4. Citar `RegistroDeImoveis/dmPedido.pas` L4803–6247 + trecho evidência
5. Se nota ausente ou `validation_pass: false` → indicar lacuna e sugerir lote orquestrador

## Formato da resposta

| Bloco | Conteúdo |
|-------|----------|
| **Onde** | path + linhas + link vault |
| **O quê** | resumo 2–4 frases da nota |
| **SQL / tabelas** | links `R_*`, `C_*` |
| **Chamadas relacionadas** | arestas do grafo |
| **Próximo passo debug** | checklist acionável |
| **Lacunas** | símbolos não mapeados no fluxo |

## Scripts de apoio

```bash
npm run delphi:build-grafo -- --product-slug imoveis --sync-vault
npm run delphi:validate-symbol -- --product-slug imoveis --file RegistroDeImoveis/dmPedido.pas --all-done
```

## PROIBIDO

- Reler unit inteira (12k+ linhas) no chat
- Inventar procedure não presente no manifest/grafo
- Ignorar `status: referencia` em segmentos — usar nota **merge** pai
