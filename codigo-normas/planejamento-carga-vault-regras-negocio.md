# Planejamento de carga do Código de Normas para o Vault (sem scripts)

## Objetivo

Estruturar a alimentação de regras de negócio no vault em `Orius/desenvolvimento/regras-de-negocio` a partir de `codigo-normas/codigo_normas.json`, com:

- execução por skills e subagentes nativos do Cursor (sem `.js`, `.cjs`, `.py`);
- escrita orientada a público leigo;
- consulta ágil por produto, tema e artigo;
- metadados padronizados para manutenção contínua.

---

## Restrições e decisões

- Não usar scripts de automação (`.js`, `.cjs`, `.py`) para extração/geração.
- Operar por orquestração de agentes/skills e produção incremental de notas.
- Manter texto explicativo em linguagem clara, com precisão normativa.
- Preservar rastreabilidade da fonte (artigo/parágrafo/inciso e livro).

---

## Mapeamento oficial livro -> produto/cartório

### Parte Geral (transversal — todos os cartórios)

- **Livro II** -> **Responsáveis pela serventia** (`responsaveis/`, `produto: transversal`)
- **Livro III** -> **Serviços extrajudiciais** (`servicos-extrajudiciais/`, `produto: transversal`)

Planejamento detalhado: `codigo-normas/planejamento-livros-ii-iii-parte-geral.md`

### Parte Especial (por cartório)

- **Livro IV** -> **Tabelionato de Protesto de Títulos**
- **Livro V** -> **Tabelionato de Notas**
- **Livro VI** -> **Registro Civil de Pessoas Jurídicas (RCPJ)**
- **Livro VII** -> **Registro de Títulos e Documentos (RTD)**
- **Livro VIII** -> **Registro Civil de Pessoas Naturais (RCPN)**
- **Livro IX** -> **Registro de Imóveis**

---

## Arquitetura de conteúdo no vault

Base: `C:\Users\kenio\Obsidian Vault\Orius\desenvolvimento\regras-de-negocio`

Estrutura proposta:

- `00-indice-regras-negocio.md` (índice mestre)
- `fontes/codigo-normas-goias.md` (fonte, escopo, premissas e governança)
- `protesto/`
- `notas/`
- `rcpj/`
- `rtd/`
- `rcpn/`
- `imoveis/`
- `responsaveis/` (Livro II — Parte Geral)
- `servicos-extrajudiciais/` (Livro III — Parte Geral)
- `temas-transversais/`

Cada domínio terá:

- `00-indice-<dominio>.md`
- `regras/` (notas atômicas por regra)
- `guias-leigos/` (explicações por fluxo real de atendimento)
- `glossario.md`

---

## Padrão de metadados (frontmatter)

Modelo mínimo por nota:

```yaml
---
tipo: regra-negocio
area: orius
status: rascunho
fonte: cursor
fonte_normativa: codigo_normas_goias
parte_normativa: parte_especial
livro: IX
livro_nome: DO REGISTRO DE IMOVEIS
titulo: I
capitulo:
artigo: "789"
paragrafo:
inciso:
produto: imoveis
publico_alvo: leigo
categoria_regra: obrigacao
criticidade: media
palavras_chave: [registro, imovel, averbacoes, requisitos]
criado: YYYY-MM-DD
atualizado_em: YYYY-MM-DD
---
```

Observações:

- `categoria_regra`: obrigacao | vedacao | prazo | documento | competencia | custo | excecao.
- `criticidade`: baixa | media | alta.
- `palavras_chave`: orientadas a busca leiga e operacional.

---

## Estrutura de cada nota de regra

1. **Resumo para leigos** (3 a 6 linhas, sem juridiquês desnecessário)
2. **Quando se aplica**
3. **O que é obrigatório**
4. **O que é proibido**
5. **Prazos e documentos**
6. **Impacto no sistema Orius** (campos, validações, bloqueios, alertas)
7. **Exceções**
8. **Base legal rastreável** (livro/título/capítulo/artigo/parágrafo/inciso)
9. **Links internos** (produto, central, regra relacionada)

---

## Estratégia de consulta ágil no Obsidian

- Índice mestre com atalhos por produto, categoria e criticidade.
- Índices por domínio com:
  - regras por artigo;
  - regras por tipo (`obrigacao`, `vedacao`, etc.);
  - regras por fluxo (`abertura`, `registro`, `averbacao`, `certidao`, etc.).
- Alias por nota, por exemplo:
  - `art 790`, `artigo 790`, `livro ix art 790`, `registro de imoveis art 790`.
- Glossário por domínio com termos técnicos em linguagem simples.

---

## Operação com skills e subagentes nativos (sem script)

### Skill principal (sempre ativa)

- `obsidian-vault` para roteamento, padrão de documentação e proposta de memória durável.

### Skills de apoio por contexto

- `n8n-orchestrator` somente quando houver desdobramento para automações n8n.
- `skill-delphi` e correlatas somente quando a regra tocar legado Delphi.

### Padrão de execução com subagentes (fracionado para evitar alucinação)

Para cada **livro** e por **lotes (15 notas atômicas)**:

1. **Subagente 1 — Filtro determinístico do JSON**
   - Entrada: `livro` selecionado (ex.: `IX`) e critérios (prioridade por título/capítulo, se aplicável).
   - Saída (obrigatória, em texto estruturado): lista de itens no formato:
     - `chave`: `livro/titulo/capitulo?` + `artigo` + `paragrafo` + `inciso` (quando existir)
     - `texto_normativo_exato`: o trecho exatamente como aparece no JSON
     - `metadados_origem`: `livro`, `titulo`, `capitulo`, `artigo`, `paragrafo`, `inciso`
   - Regra: o subagente **não interpreta**; apenas filtra e extrai.

2. **Subagentes 2..N — Montagem das notas em lote**
   - Cada subagente recebe um subconjunto de **exatamente 15 itens** (ou menos, se o livro acabar).
   - Para cada item, produz **1 arquivo** de nota atômica no padrão:
     - frontmatter completo (livro/artigo/paragrafo/inciso -> espelhado da metadados_origem)
     - seções para leigos (Resumo, Quando se aplica, O que é obrigatório, etc.)
     - Base legal rastreável preenchida com os mesmos identificadores.
   - Regra anti-alucinação: o subagente deve usar o `texto_normativo_exato` como fonte para resumir (sem inventar conteúdo fora do trecho).

3. **Subagente Revisão  — Consistência e links**
   - Verifica:
     - integridade do frontmatter (campos não vazios onde obrigatórios)
     - duplicidades por chave `livro+artigo+paragrafo+inciso`
     - links e atalhos (ex.: `guia leigo relacionado` e `produto`)
     - se “título/categoria” está coerente com o trecho.

4. **Agente orquestrador (chat principal)**
   - Concatena resultados do lote, salva arquivos no vault e atualiza:
     - índice do domínio
     - índice global (`00-indice-regras`)
   - Dispara subagentes nativos do Cursor via ferramenta `Task` (`subagent_type: generalPurpose`).
   - **Sem parâmetro `model`** — usar apenas o runtime padrão disponível na conta.
   - Rodadas de **3–4 geradores em paralelo** por sessão; revisão em rodada seguinte.
   - Artefato de extração por livro: `codigo-normas/_viii_extract_full.json` (Livro VIII / RCPN) · `codigo-normas/_ix_extract_full.json` (Livro IX / Imóveis) · `codigo-normas/_v_extract_full.json` (Livro V / Notas) · `codigo-normas/_vi_extract_full.json` (Livro VI / RCPJ) · `codigo-normas/_iv_extract_full.json` (Livro IV / Protesto).

#### Prompt padrão — Subagente Gerador (copiar por lote)

Substituir `N`, `X` e `Y` (`Y = X + 14`):

```
Você é o Subagente 2 (Gerador — LOTE N) do pipeline RCPN.

ENTRADA: codigo-normas/_viii_extract_full.json — items[X] até items[Y] (15 itens).

SAÍDA: 15 arquivos .md em Orius/desenvolvimento/regras-de-negocio/rcpn/regras/

REGRAS ANTI-ALUCINAÇÃO:
- Frontmatter espelhando metadados_origem (livro VIII, produto rcpn)
- Resumo e Impacto Orius APENAS com base em texto_normativo_exato
- NÃO inventar livros, certidões, prazos ou referências a outros artigos
- Seções vazias: "O texto normativo deste trecho não enumera..."
- Link [[Orius/empresa/produtos/registro-civil]] em Impacto Orius
- Modelo: art-567-inc-i-nascimento.md

Retorne lista dos 15 arquivos criados.
```

#### Por que isso reduz alucinação

- Escrita sempre é baseada em `texto_normativo_exato` extraído do JSON.
- Metadados são “espelhados” da origem, não deduzidos.
- Dividir por lote limita a carga de contexto e mantém rastreabilidade.

---

## Fases de implantação

### Fase 1 - Fundação

- Criar estrutura de pastas e índices mestres.
- Criar template de nota de regra e template de guia leigo.
- Definir taxonomia final de `categoria_regra`, `criticidade` e `palavras_chave`.

### Fase 2 - Piloto (Livro IX - Imóveis)

- Executar piloto por lotes de 15 notas atômicas usando:
  - Subagente 1 (Filtro do JSON) -> Subagente(s) 2..N (Gerar notas) -> Subagente Revisão.
- Priorizar:
  - competências do oficial;
  - atos obrigatórios;
  - averbações e registros de alta incidência;
  - hipóteses de bloqueio/indisponibilidade.
- Revisar qualidade de linguagem para leigos e consistência de metadados.

### Fase 3 - Escala para os demais livros

- Livro VIII (RCPN), V (Notas), IV (Protesto), VII (RTD), VI (RCPJ).
- Repetir ciclo em lotes de 15 notas, por livro e por prioridade de temas.

### Fase 4 - Consolidação

- Publicar matriz de cobertura por livro.
- Mapear lacunas e regras ambíguas.
- Marcar notas com `status: revisado`.

---

## Critérios de qualidade por nota

- Linguagem clara para leigo (sem perda de precisão).
- Uma regra principal por nota (granularidade atômica).
- Fonte legal explicitada e rastreável.
- Metadados completos e consistentes.
- Link para pelo menos 2 notas relacionadas (navegação contextual).

---

## Priorização recomendada

1. **Registro de Imóveis (Livro IX)**  
2. **Registro Civil de Pessoas Naturais (Livro VIII)**  
3. **Tabelionato de Notas (Livro V)**  
4. **Tabelionato de Protesto (Livro IV)**  
5. **RTD (Livro VII)**  
6. **RCPJ (Livro VI)**

---

## Cadência operacional sugerida

- Sessões de carga em lotes de 10 a 20 regras.
- Ao fim de cada sessão:
  - atualizar índice do domínio;
  - revisar termos-chave;
  - registrar decisões editoriais em `fontes/codigo-normas-goias.md`.

---

## Próximo passo prático (sem script)

Executar um piloto guiado no **Livro IX** com:

- criação da estrutura `imoveis/`;
- produção das primeiras 15 notas atômicas;
- criação de `imoveis/00-indice-imoveis.md`;
- revisão de legibilidade para leigos;
- validação do padrão de metadados.
