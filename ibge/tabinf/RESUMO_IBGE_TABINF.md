# Resumo IBGE TABINF (Registro Civil)

Base: `IBGE_RCIVIL_LAYOUT_TABINF_31_05_2020.md` (atualizado em 31/05/2020).

## O que é o IBGE TABINF e quando usar

O **IBGE TABINF** e o layout de integração para envio de dados de **Divórcios Extrajudiciais** de tabelionatos informatizados ao sistema do IBGE (Registro Civil), sem necessidade de questionários/digitação manual.

Use quando o cartório:
- possui sistema informatizado próprio;
- precisa gerar e entregar dados trimestrais ao IBGE;
- deve seguir layout fixo de arquivos, tamanhos de registro, codificações e validações do documento oficial.

Fluxo esperado:
1. Gerar `TABINF07.TXT` (detalhe dos divórcios).
2. Gerar `TABINF12.TXT` (resumo/recibo).
3. Gerar `CONTROLE.SIS` (arquivo vazio para controle).
4. Compactar os 3 arquivos em `TABINF.ZIP`.
5. Encaminhar para a unidade IBGE para homologação/processamento.

## Especificação dos arquivos gerados

### Pacote final
- Nome do ZIP: `TABINF.ZIP`
- Conteúdo obrigatório:
  - `TABINF07.TXT` - Divórcios Extrajudiciais (modelo 07)
  - `TABINF12.TXT` - Resumo dos dados (recibo, modelo 12)
  - `CONTROLE.SIS` - Controle do IBGE (vazio)

### Tamanho de registro
- `TABINF07.TXT`: **121 bytes por registro**
- `TABINF12.TXT`: **26 bytes por registro**
- `CONTROLE.SIS`: **0 byte**

### Chave de identificação do tabelionato
Informada pelo IBGE e presente nos arquivos `TABINF07.TXT` e `TABINF12.TXT`:
- `UF-PESQUISA` (2)
- `MUN-PESQUISA` (5)
- `DIST-PESQUISA` (2)
- `COD_CARTORIO` (2)

## Especificação dos campos

###[1] TABINF12.TXT (Resumo / Recibo)

| # | Campo | Tipo | Tam | Regra de preenchimento |
|---|---|---|---:|---|
| 1 | `UF-PESQUISA` | CHAR | 2 | Fornecido pelo IBGE |
| 2 | `MUN-PESQUISA` | CHAR | 5 | Fornecido pelo IBGE |
| 3 | `DIST-PESQUISA` | CHAR | 2 | Fornecido pelo IBGE |
| 4 | `COD_CARTORIO` | CHAR | 2 | Fornecido pelo IBGE |
| 5 | `ANO-PESQUISA` | CHAR | 4 | Ano da pesquisa (numérico, 4 dígitos) |
| 6 | `TRIM-PESQUISA` | CHAR | 1 | Trimestre: `1`, `2`, `3` ou `4` |
| 7 | `TOTAL-DIV` | CHAR | 6 | Total de escrituras válidas do `TABINF07` = total geral - repetidos |
| 8 | `TOTAL-REPETIDOS` | CHAR | 4 | Quantidade de chaves repetidas em `TABINF07` |

Observação (base centralizada): pode haver mais de um registro no `TABINF12`, um por tabelionato.

###[2] TABINF07.TXT (Divórcios Extrajudiciais)

### Campos 1 a 13 (identificação e dados do ato)

| # | Campo | Tipo | Tam | Regra resumida |
|---|---|---|---:|---|
| 1 | `UF-PESQUISA` | CHAR | 2 | Fornecido pelo IBGE |
| 2 | `MUN-PESQUISA` | CHAR | 5 | Fornecido pelo IBGE |
| 3 | `DIST-PESQUISA` | CHAR | 2 | Fornecido pelo IBGE |
| 4 | `COD_CARTORIO` | CHAR | 2 | Fornecido pelo IBGE |
| 5 | `ANO-PESQUISA` | CHAR | 4 | Ano com 4 dígitos |
| 6 | `TRIM-PESQUISA` | CHAR | 1 | `1` a `4` |
| 7 | `NUM-LIVRO` | CHAR | 18 | Número do livro |
| 8 | `NUM-INICIAL-FOLHA` | CHAR | 4 | Folha inicial (numérico) |
| 9 | `NUM-FINAL-FOLHA` | CHAR | 4 | Folha final; se só houver inicial, repetir valor |
| 10 | `COMPL-FOLHA` | CHAR | 1 | `1=Frente`, `2=Verso`, `9=Sem complemento` |
| 11 | `DATA-ABERT-ESCRIT` | CHAR | 8 | `DDMMAAAA` |
| 12 | `DATA-ATO-NOTARIAL` | CHAR | 8 | `DDMMAAAA` e coerente com trimestre |
| 13 | `DATA-CASAMENTO` | CHAR | 8 | `DDMMAAAA` |

### Campos 14 a 31 (características, residência, nascimento e sexo)

| # | Campo | Tipo | Tam | Regra resumida |
|---|---|---|---:|---|
| 14 | `REGIME-BENS` | CHAR | 1 | `1=Comunhão universal`, `2=Comunhão parcial`, `3=Separação`, `9=Sem declaração` |
| 15 | `NUM-FILHO-MAIOR` | CHAR | 2 | Número de filhos maiores |
| 16 | `NUM-FILHO-MENOR` | CHAR | 2 | Número de filhos menores |
| 17 | `COD-RESP-FILHO` | CHAR | 1 | `1=Conjuge 1`, `2=Conjuge 2`, `3=Ambos`, `4=Outro`, `9=Sem declaração` |
| 18 | `COD-UF-RES-CONJ1` | CHAR | 2 | Código UF (tabela IBGE) |
| 19 | `COD-MUN-RES-CONJ1` | CHAR | 5 | Código município (tabela IBGE) |
| 20 | `COD-PAIS-RES-CONJ1` | CHAR | 3 | Preencher quando UF=98; tabela ONU |
| 21 | `COD-UF-RES-CONJ2` | CHAR | 2 | Código UF (tabela IBGE) |
| 22 | `COD-MUN-RES-CONJ2` | CHAR | 5 | Código município (tabela IBGE) |
| 23 | `COD-PAIS-RES-CONJ2` | CHAR | 3 | Preencher quando UF=98; tabela ONU |
| 24 | `COD-UF-NASC-CONJ1` | CHAR | 2 | Código UF (tabela IBGE) |
| 25 | `COD-PAIS-NASC-CONJ1` | CHAR | 3 | Preencher quando UF=98; tabela ONU |
| 26 | `COD-UF-NASC-CONJ2` | CHAR | 2 | Código UF (tabela IBGE) |
| 27 | `COD-PAIS-NASC-CONJ2` | CHAR | 3 | Preencher quando UF=98; tabela ONU |
| 28 | `DATA-NASC-CONJ1` | CHAR | 8 | `DDMMAAAA` |
| 29 | `DATA-NASC-CONJ2` | CHAR | 8 | `DDMMAAAA` |
| 30 | `SEXO-CONJ1` | CHAR | 1 | `1=Masculino`, `2=Feminino` |
| 31 | `SEXO-CONJ2` | CHAR | 1 | `1=Masculino`, `2=Feminino` |

## Regras de validação

### Regras gerais de formatação
- Campos numéricos menores que o tamanho: **completar com zeros a esquerda**.
- Campos alfanuméricos menores que o tamanho: **completar com espaços a direita**.
- Campo numérico sem valor: preencher com **9** repetido no tamanho do campo (ex.: data desconhecida de 8 posicoes = `99999999`).

### Regras de consistência entre arquivos
- `TABINF.ZIP` deve conter exatamente `TABINF07.TXT`, `TABINF12.TXT` e `CONTROLE.SIS`.
- `TABINF12.TXT`:
  - `TOTAL-DIV` deve refletir o total valido do `TABINF07`.
  - `TOTAL-REPETIDOS` deve refletir chaves duplicadas no `TABINF07`.
- Chave considerada repetida em `TABINF07`:
  - `UF-PESQUISA`, `MUN-PESQUISA`, `DIST-PESQUISA`, `COD_CARTORIO`, `ANO-PESQUISA`, `TRIM-PESQUISA`, `NUM-LIVRO`, `NUM-INICIAL-FOLHA`, `NUM-FINAL-FOLHA`, `COMPL-FOLHA`.

### Regras de datas e trimestre
- Datas do layout: formato estrito `DDMMAAAA`.
- `TRIM-PESQUISA` deve estar em `1..4`.
- `DATA-ATO-NOTARIAL` deve ser coerente com o trimestre informado.

### Regra especial de folha
- Se so houver folha inicial, repetir o valor em `NUM-FINAL-FOLHA`.

## Tabelas de domínio

### Domínios codificados no layout
- **Trimestre**: `1`, `2`, `3`, `4`
- **Complemento da folha**: `1=Frente`, `2=Verso`, `9=Sem complemento`
- **Regime de bens**: `1=Comunhao universal`, `2=Comunhao parcial`, `3=Separacao`, `9=Sem declaracao`
- **Responsável por filhos menores**: `1`, `2`, `3`, `4`, `9`
- **Sexo**: `1=Masculino`, `2=Feminino`

### Domínio UF/Município/País (regra combinada)

| Regra | UF | Município | País |
|---|---|---|---|
| 1 (estrangeiro) | `98` | `99999` | Código ONU ou `999` |
| 2 (Brasil sem município informado) | `59` | `99999` | `999` |
| 3 (ignorado) | `99` | `99999` | `999` |
| 4 (UF nacional válida) | diferente de `98`, `59`, `99` | Código município IBGE ou `99999` | `999` |

Observação importante:
- Não usar o código ONU `076` (Brasil) nos campos de país deste layout; usar `999` quando aplicável.

### Fontes das tabelas externas
- **UF e Município**: tabela de municípios do IBGE (Sistema de Estatísticas Vitais).
- **País**: tabela de países/territórios da ONU disponibilizada via IBGE.

## Observações práticas para implementação

- O documento convertido apresenta repetições e pequenas distorções de OCR; usar este resumo como guia funcional.
- Há divergência no campo `NUM-LIVRO` na fonte (estrutura indica tamanho 18; texto de norma menciona 12). Para manter compatibilidade de registro de **121 bytes**, adotar o tamanho da estrutura: **18**.
