---
name: skill-pas
description: >-
  Regras para indexar e destrinchar units Pascal (.pas) legado Delphi 7 Orius
  (IDE Embarcadero RAD Studio):
  interface/implementation, classes, procedures, uses, SQL, datasets.
  Use com agent-delphi-indexer, agent-delphi-analyzer ou ao documentar .pas
  em C:\Users\kenio\sistema-delphi.
---

# Skill PAS — units Pascal (legado Delphi 7 / IDE Embarcadero)

Complementa [`skill-delphi`](../skill-delphi/SKILL.md). Aplica-se a arquivos `.pas` sob `C:\Users\kenio\sistema-delphi`.

## Anatomia de uma unit

```pascal
unit NomeUnit;

interface
  uses ...;
  type ...;
  const ...;
  var ...;
  procedure Foo;           // declaração
  function Bar: Integer;

implementation
  uses ...;
  procedure Foo;
  begin
    ...
  end;
end.
```

| Seção | O que extrair |
|-------|---------------|
| `unit` | Nome da unit (= nome do arquivo sem extensão) |
| `interface uses` | Dependências públicas |
| `implementation uses` | Dependências internas |
| `type` | records, classes, enums, aliases |
| `procedure` / `function` | Assinatura, classe dona (`TdmPedido.Gravar`), visibilidade |
| `implementation` | Corpo — **somente o bloco do símbolo alvo** na análise |

## Indexador — o que listar (sem destrinchar)

Saída **estruturada** (JSON manifest ou lista markdown):

- `unit`, `path`, `line_count`
- `uses_interface[]`, `uses_implementation[]`
- `types[]` → `{ name, kind, line }`
- `classes[]` → `{ name, ancestor, line }`
- `procedures[]` / `functions[]` → `{ name, class?, line_start, line_end, visibility }`
- `properties[]` (se classe)
- `dfm_pair` → caminho do `.dfm` com mesmo nome, se existir
- `related_units[]` → inferido de `uses` (nomes de units Orius, não RTL)

**Não** incluir: explicação de negócio, SQL interpretado, fluxo de tela.

## Analisador — escopo por job

**Um job = um símbolo** (ou um `type` record/class pequeno &lt; 150 linhas).

Contexto máximo recomendado por chamada:

| Tipo | Linhas no prompt |
|------|------------------|
| procedure / function | corpo + assinatura na interface (~50–250 linhas por job) |
| class (data module) | só seções relevantes + lista de métodos já indexados |
| record / enum | definição completa + comentários adjacentes |

Se `line_end - line_start > **250**`, o orquestrador deve **segmentar** (chunks de **200** linhas) — ver [symbol-segment-schema](../agent-delphi-orchestrator/symbol-segment-schema.md). **Nunca** um único job com 400+ linhas.

## Campos obrigatórios da nota vault (símbolo)

Criar/atualizar em  
`Orius/desenvolvimento/legado-delphi/produtos/<slug>/unidades/<Unit>/<Simbolo>.md`

| Seção | Conteúdo |
|-------|----------|
| **Localização** | path absoluto relativo à raiz, linhas |
| **Assinatura** | texto exato da declaração |
| **Resumo** | 1–3 frases do propósito |
| **Parâmetros e retorno** | tabela nome / tipo / direção / significado |
| **Efeitos colaterais** | datasets abertos, Post, Commit, Rollback, ApplyUpdates |
| **SQL e tabelas** | queries nomeadas; wikilinks por prefixo — ver [skill-delphi § Firebird](../skill-delphi/SKILL.md): imóveis `R_`/`G_`/`C_`, protesto `P_` |
| **Mensagens e erros** | `ShowMessage`, `MessageDlg`, `raise`, códigos string |
| **Chamado por** | units/procedures (links vault) |
| **Chama** | units/procedures/queries externas |
| **Regras de negócio** | códigos de domínio (ex. `tipo_andamento`, situações ONR) |
| **Evidência** | trecho ≤ 30 linhas do `.pas` |
| **Briefing implementação** | o que alterar/criar para estender ou corrigir |

## Padrões Orius em `.pas`

| Padrão | Onde documentar |
|--------|-----------------|
| `TClientDataSet` + `Provider` | datasets envolvidos |
| `TIBQuery` / `TSimpleDataSet` / `TIBDatabase` | SQL na seção SQL; conexão `Charset=ISO8859_1` |
| Transação explícita (`StartTransaction`) | Efeitos colaterais |
| Integração SOAP (`THTTPRIO`, `InvokeRegistry`) | Chama + link central no vault |
| FastReport (`TfrxReport`, `PrepareReport`) | Briefing + form relacionado |
| `Application.CreateForm` | link para `.dfm` |

## Charset — Firebird 4.0.5 + ANSI (não UTF-8)

Stack real Orius (ver [`skill-delphi`](../skill-delphi/SKILL.md)):

| Camada | Charset |
|--------|---------|
| Firebird **4.0.5** (banco + conexão) | **`ISO8859_1`** |
| VCL / fontes nos `.dfm` | **`ANSI_CHARSET`** |
| Units `.pas` (Delphi 7) | bytes **ANSI** / ISO-8859-1 — **não** UTF-8 |

### Ao ler ou documentar `.pas`

- Scripts do repo leem fonte com **latin1** (ISO-8859-1) — igual ao legado.
- **Identificadores** (`procedure`, campos, tabelas): copiar **exatamente** como no arquivo.
- **Strings e comentários** com acentuação quebrada na UI do editor (`Ã§`, `Ttulo`): é efeito de misturar UTF-8 com ISO-8859-1 — na nota vault:
  - citar o trecho **literal** do `.pas` na Evidência;
  - opcionalmente acrescentar leitura humana entre parênteses se óbvio pelo contexto;
  - tag `[encoding ISO8859_1]` — **não** regravar como UTF-8.
- **SQL** (`SQL.Add`, `CommandText`): literais com acento são ISO-8859-1; não sugerir `UTF8` em `Charset` de conexão.

### Ao cruzar com banco documentado

- Notas em `Orius/desenvolvimento/banco-de-dados/` usam export com **`ISO8859_1`**.
- Não inferir collation Unicode nem `UTF8` em migrations/correções salvo pedido explícito de migração.

### PROIBIDO (charset)

- Assumir `Charset=UTF8` ou `UTF8` no Firebird para o legado.
- “Normalizar” todo texto para UTF-8 nas notas de mapeamento.
- Tratar `string` Delphi 7 como Unicode (`UnicodeString`).

## Chunking — dois modos

| Span (`line_end - line_start + 1`) | Modo | Agente |
|-------------------------------------|------|--------|
| ≤ **250** | Análise única | `agent-delphi-analyzer` |
| > **250** | Segmentos de **200** linhas + merge | `agent-delphi-analyzer-segment` → `agent-delphi-analyzer-merge` |

### Modo segmentado (obrigatório se > 250)

1. Orquestrador roda `npm run delphi:split-segments` → `_segment-plan.json`
2. Cada segmento: ler `_handoff.json` do anterior + **só** suas ~200 linhas
3. Gravar `segment-NN.md` + atualizar `_handoff.json`
4. Após todos: merge em `unidades/<Unit>/<Symbol>.md`

Handoff leva: variáveis em escopo, datasets, SQL, chamadas, branches abertos, resumo de fluxo.

**Nunca** enviar 1400 linhas num único prompt (ex.: `Prenotar` 4803–6247).

Ver [symbol-segment-schema.md](../agent-delphi-orchestrator/symbol-segment-schema.md).

## PROIBIDO

- Resumir unit inteira numa única nota (exceto índice `unidades/<Unit>.md` com links)
- Inventar procedure que não está no manifest
- Documentar `.dcu` como se fosse fonte
- Analisar > 250 linhas num único job sem segmentação
