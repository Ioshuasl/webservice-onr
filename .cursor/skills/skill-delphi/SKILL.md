---
name: skill-delphi
description: >-
  Contexto Orius legado Embarcadero/Delphi: IDE Embarcadero RAD Studio, código
  alvo Delphi 7 (VCL), raiz C:\Users\kenio\sistema-delphi, produtos Orius,
  Firebird, vault Obsidian. Use em todo mapeamento — orquestrador, indexador e
  analisador devem carregar esta skill antes de qualquer tarefa.
---

# Skill Delphi — contexto Orius (Embarcadero / legado D7)

Conhecimento de domínio compartilhado por **orquestrador**, **indexador** e **analisador** do mapeamento legado.

## Raiz do código (obrigatório)

```
C:\Users\kenio\sistema-delphi
```

**Nunca** inferir outro path. Todos os paths relativos partem desta raiz.

## Versão e stack

| Item | Valor |
|------|-------|
| **IDE** | **Embarcadero RAD Studio** (personality Delphi) — IDE usada pela equipe Orius |
| **Alvo do código legado** | **Delphi 7** (VCL clássico; units `.pas` / `.dfm` / `.dcu` do ecossistema D7) |
| **Linguagem** | Object Pascal (`.pas`) |
| **UI** | VCL — formulários `.dfm` |
| **Banco** | **Firebird 4.0.5** |
| **Charset BD / conexão** | **`ISO8859_1`** — **não** UTF-8 |
| **Charset UI Delphi** | **`ANSI_CHARSET`** (VCL / fontes) — **não** Unicode (`string` UTF-16) como em Delphi moderno |
| **Relatórios** | FastReport (`frx*`) em vários módulos |
| **Build** | `.dcu` compilado — **não** é fonte de verdade |

> **Distinção:** a IDE é Embarcadero (atual); o repositório `sistema-delphi` é legado **Delphi 7**. Não assumir recursos de versões recentes (FireDAC moderno, Unicode-only, FMX) salvo evidência no fonte.

## Firebird e charset (obrigatório)

| Item | Valor Orius |
|------|-------------|
| **Servidor** | Firebird **4.0.5** |
| **Charset do banco** | `ISO8859_1` (grafia correta; não usar `UTF8` nem confundir com typo `ISO859_1`) |
| **Conexão Delphi** | `Charset=ISO8859_1` (ou equivalente em `TIBDatabase` / `TSQLConnection` / `Params`) |
| **Fontes VCL** | `ANSI_CHARSET` — formulários e controles legados |
| **Código `.pas`** | AnsiString / `string` de 1 byte por caractere no **Delphi 7** — alinhado a ISO-8859-1, **não** UTF-8 |

### Regras para agentes

1. **Nunca** assumir UTF-8 na conexão, no banco ou na leitura de arquivos legados.
2. Scripts de extração (`extract-delphi-symbols`, `split-delphi-symbol-segments`) leem `.pas` como **latin1** / ISO-8859-1.
3. Na documentação vault: preservar **identificadores** exatos do fonte; comentários/strings com mojibake (`Ttulo`, ``) → citar literal + tag `[encoding ISO8859_1]` — **não** “corrigir” para UTF-8 inventado.
4. SQL em `SQL.Text` / `TIBQuery`: tratar literais e `VARCHAR` como **ISO8859_1**; acentos em parâmetros seguem a mesma regra.
5. Cruzar tabelas com vault: `Orius/desenvolvimento/banco-de-dados/` (metadados exportados com `Charset ISO8859_1`).

Referência vault: [[Orius/desenvolvimento/banco-de-dados/visao-geral-firebird]] · [[Orius/desenvolvimento/banco-de-dados/extracao-metadados]]

| Pasta | Produto vault | Slug batch |
|-------|---------------|------------|
| `Caixa` | caixa | `caixa` |
| `RegistroCivil` | civil | `civil` |
| `RegistroDeImoveis` | imoveis | `imoveis` |
| `RegistroDeTitulosEDocumentos` | rtd | `rtd` |
| `TabelionatoDeProtesto` | protesto | `protesto` |

Índice vault: `Orius/desenvolvimento/legado-delphi/00-indice.md`  
Produto: `Orius/empresa/produtos/<produto>.md`  
Banco documentado: `Orius/desenvolvimento/banco-de-dados/`

## Firebird — prefixos por produto (cruzamento SQL)

Charset: **`ISO8859_1`**. Na documentação, wikilink para `Orius/desenvolvimento/banco-de-dados/inventario/...`.

| Produto | Slug | Prefixos principais | Exemplos | Vault tabelas |
|---------|------|---------------------|----------|---------------|
| Registro de Imóveis | `imoveis` | **`R_`**, **`G_`**, **`C_`** | `R_PEDIDO`, `R_PROTOCOLO`, `R_CONTADOR`, `C_CAIXA_ITEM`, `C_BOLETO_BANCO` | `.../palmelo2/imoveis-tabelas` |
| Protesto | `protesto` | **`P_`** | `P_TITULO`, `P_CARTORIO` | `.../protesto-tabelas` |
| Registro Civil | `civil` | **`G_`**, **`C_`** | certidões, livros | `.../civil-tabelas` |
| RTD | `rtd` | **`R_`**, tabelas RTD | títulos e documentos | vault banco |
| Caixa | `caixa` | **`C_`** | caixa compartilhado entre produtos | `C_CAIXA_*` |

### Regras para agentes (SQL em `.pas`)

1. Identificar prefixo → produto; não misturar `P_` (protesto) com `R_` (imóveis).
2. Funções/views: `R_TOTAL_PEDIDO`, `GEN_ID(...)` — citar como objeto, linkar se existir no vault.
3. Se tabela não estiver no vault → citar literal do SQL + `status: pendente-evidencia` na nota.
4. Datasets `sql*` no Delphi mapeiam para tabela principal do `SELECT` / `INSERT` do `SQL.Text`.

## Convenções de nomenclatura (Orius)

| Padrão | Significado | Exemplo |
|--------|-------------|---------|
| `dm*.pas` | Data Module — regras, SQL, integrações | `dmPedido.pas` |
| `u*.pas` / nome direto | Unit utilitária ou tela | `Pedido.pas` |
| `Frame*.pas` | Frame reutilizável em forms | `FrameDoi_Reg.pas` |
| `ws*.pas` | Webservice / integração externa | `wsIntimacao.pas` |
| `Real_*.pas` | Módulos amplos (pessoas, cadastros) | `Real_Pessoal.pas` |
| `CRC_*`, `carga*` | Registro Civil — cargas e rotinas | `CRC_CargaRegistrosCompleto.pas` |
| Prefixo `P_`, `G_`, `C_`, `RI_` | Tabelas Firebird por produto | ver vault `banco-de-dados/` |

## Tipos de artefato

| Extensão | Papel | Skill dedicada |
|----------|-------|----------------|
| `.pas` | Fonte Pascal | [`skill-pas`](../skill-pas/SKILL.md) |
| `.dfm` | Formulário VCL | [`skill-dfm`](../skill-dfm/SKILL.md) |
| `.dcu` | Binário compilado | [`skill-dcu`](../skill-dcu/SKILL.md) — somente inventário |
| `.dpr` / `.dproj` | Projeto — grafo de dependências | referência do orquestrador |

## Regras anti-alucinação (obrigatórias)

1. **Nunca** enviar um `.pas` inteiro ao modelo — fatiar por símbolo (procedure, function, type, class).
2. **Sempre** citar `arquivo` + `linha_inicio`–`linha_fim` como evidência.
3. Símbolos listados pelo **indexador** ou **script** são a fonte; o analisador **não inventa** nomes.
4. Se o trecho não estiver no contexto, marcar `status: pendente-evidencia` — não preencher com suposição.
5. Units de terceiros (`GifImage`, `frxClass`, `gte*`) → tag `vendor: true`; documentação superficial ou `skip` no batch.
6. Arquivos duplicados (`Cópia de *.pas`) → marcar `duplicate: true`; orquestrador pode excluir do lote.

## Repositório de conhecimento (vault)

O vault **é** a memória de longo prazo — agentes **não** acumulam mapeamento só no chat.

| Artefato | Caminho vault |
|----------|---------------|
| Índice geral | `Orius/desenvolvimento/legado-delphi/00-indice.md` |
| Índice por produto | `Orius/desenvolvimento/legado-delphi/produtos/<slug>/00-indice.md` |
| Manifest JSON (script) | `Orius/desenvolvimento/legado-delphi/produtos/<slug>/manifest/*.symbols.json` |
| Índice da unit | `.../unidades/<UnitName>.md` |
| Símbolo (procedure, type…) | `.../unidades/<UnitName>/<Simbolo>.md` |
| Formulário | `.../formularios/<FormName>.md` |
| Grafo / fluxos | `.../grafo/<nome>.md` |

Frontmatter mínimo:

```yaml
---
tipo: legado-delphi
area: orius
produto: imoveis | civil | protesto | rtd | caixa
artefato: pas | dfm
unit: dmPedido
simbolo: GravarPedido
simbolo_tipo: procedure | function | type | class | property
arquivo: RegistroDeImoveis/dmPedido.pas
linhas: 2100-2280
tags: [embarcadero, delphi7, vcl, firebird, iso8859_1, ri, pedido]
status: rascunho | revisado | pendente-evidencia
fonte: extract-delphi-symbols | agent-delphi-analyzer
---
```

## Scripts npm (pipeline legado)

<!-- delphi-skills:npm-scripts:start -->
| Comando | Descrição |
|---------|-----------|
| `npm run delphi:extract` | Fase 0 — manifest `.pas` |
| `npm run delphi:extract-dfm` | Fase 0 — manifest `.dfm` + form index |
| `npm run delphi:sync-tree` | Inventário árvore → vault |
| `npm run delphi:split-segments` | Segmentos ~200L (threshold 250) |
| `npm run delphi:apply-triage` | Triage T0–T4 no batch JSON |
| `npm run delphi:report-coverage` | Métricas → `00-cobertura.md` |
| `npm run delphi:validate-symbol` | Gates determinísticos nas notas vault |
| `npm run delphi:build-grafo` | Grafo Chama/Chamado por → vault |
| `npm run delphi:sync-segment-status` | Segmentos → `status: referencia` |
| `npm run delphi:ensure-product` | Scaffold ecosystem + runner |
| `npm run delphi:run-ecosystem` | **Runner autônomo** (1 tick) |
| `npm run delphi:sync-skill-docs` | Regenera tabelas nas skills |
<!-- delphi-skills:npm-scripts:end -->

Índice completo: [00-indice-delphi-skills.md](../00-indice-delphi-skills.md)

## Paralelismo (obrigatório)

<!-- delphi-skills:parallel-limits:start -->
| Recurso | Limite |
|---------|--------|
| Símbolos ≤250L | máx. **5** analisadores em paralelo |
| Arquivos | máx. **2–3** em paralelo |
| Segmentos (>250L) | **série 1** por símbolo |
| Merge | após todos segmentos `done` |
<!-- delphi-skills:parallel-limits:end -->

## Produtos registrados

<!-- delphi-skills:products-table:start -->
| Slug | Pasta código | Batch JSON | Vault hub |
|------|--------------|------------|-----------|
| `imoveis` | `RegistroDeImoveis` | `scripts/delphi-imoveis-batch-state.json` | `Orius/desenvolvimento/legado-delphi/produtos/imoveis` |
| `civil` | `RegistroCivil` | `scripts/delphi-civil-batch-state.json` | `Orius/desenvolvimento/legado-delphi/produtos/civil` |
| `protesto` | `TabelionatoDeProtesto` | `scripts/delphi-protesto-batch-state.json` | `Orius/desenvolvimento/legado-delphi/produtos/protesto` |
| `rtd` | `RegistroDeTitulosEDocumentos` | `scripts/delphi-rtd-batch-state.json` | `Orius/desenvolvimento/legado-delphi/produtos/rtd` |
| `caixa` | `Caixa` | `scripts/delphi-caixa-batch-state.json` | `Orius/desenvolvimento/legado-delphi/produtos/caixa` |
<!-- delphi-skills:products-table:end -->

## Skills do pipeline

| Papel | Skill |
|-------|-------|
| Diretor | [`agent-delphi-ecosystem-orchestrator`](../agent-delphi-ecosystem-orchestrator/SKILL.md) |
| Gerente | [`agent-delphi-orchestrator`](../agent-delphi-orchestrator/SKILL.md) |
| Indexador | [`agent-delphi-indexer`](../agent-delphi-indexer/SKILL.md) |
| Analisador | [`agent-delphi-analyzer`](../agent-delphi-analyzer/SKILL.md) |
| Segmento / merge | [`agent-delphi-analyzer-segment`](../agent-delphi-analyzer-segment/SKILL.md), [`agent-delphi-analyzer-merge`](../agent-delphi-analyzer-merge/SKILL.md) |
| Vault | `C:\Users\kenio\.cursor\skills\obsidian-vault\SKILL.md` |

## Objetivo do mapeamento

Suportar consultas futuras do tipo:

- *"Estou com erro ao realizar prenotação no registro de imóveis"*
- *"Preciso implementar X no registro civil"*

Resposta esperada após cobertura: **arquivos exatos** (`.pas`/`.dfm`) + **linhas** + **briefing** de correção ou implementação, com links para tabelas Firebird e fluxos no vault.
