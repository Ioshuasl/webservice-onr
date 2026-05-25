# DOI

> Este documento contém as especificações técnicas, layouts, dicionário de dados e regras de validação para a importação de arquivos da DOI via sistema web, conforme manual da Receita Federal.

## 1. Visão Geral

A DOI deve ser elaborada mediante acesso ao sistema DOI-Web. O sistema permite a importação de declarações em lote via arquivo JSON.

Prazo: Até o último dia útil do mês subsequente ao ato.

Formato do Arquivo: .json (ou .zip contendo um único .json).

Encoding: UTF-8 (Recomendado pelo padrão JSON).

Schema JSON: Versão 2020-12.

## 2. Estrutura Básica do JSON

O arquivo deve seguir o formato genérico abaixo, contendo um array de objetos declaracoes .

```json
{
  "declaracoes": [
    { ... },
    { ... }
  ]
}

```

## 3. Dicionário de Dados (Campos e Tipos)

### 3.1. Ficha: Dados Iniciais

Dados referentes ao ato notarial ou registral .

| Campo | Tipo | Tam. | Obrigatório | Descrição / Regra |
| --- | --- | --- | --- | --- |
| <b>tipoDeclaracao</b> | Alfanumérico | - | Sim | Deve ser "0" (Original). Retificadoras/Canceladoras não são importadas via lote. |
| <b>tipoServico</b> | Alfanumérico | - | Sim | Conforme Tabela de Domínio (Ver seção 4). |
| <b>dataLavraturaRegistroAverbacao</b> | Data | - | Sim | Formato: <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">YYYY-MM-DD</code>. |
| <b>tipoAto</b> | Alfanumérico | - | Sim | Conforme Tabela de Domínio. Varia segundo o <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">tipoServico</code>. |
| <b>tipoLivro</b> | Alfanumérico | - | Sim* | *Obrigatório se <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">tipoServico</code> for "Registro de Imóveis". Conforme domínio. |
| <b>numeroLivro</b> | Alfanumérico | 7 | Opcional* | Se <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">tipoServico</code>="Notarial", deve começar com número. Se "Registro de Imóveis", incluir apenas se <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">tipoLivro</code>="Transcrição". |
| <b>folha</b> | Alfanumérico | 7 | Sim | Páginas/Folhas (ex: início-fim). |
| <b>matriculaNotarialEletronica</b> | Alfanumérico | 24 | Não | MNE. Formato: <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">CCCCCC.AAAA.MM.DD.NNNNNNNN-DD</code> (sem traços/pontos). Validado por Mod 97 Base 10 (ISO 7064). |
| <b>matricula</b> | Alfanumérico | 15 | Opcional* | Obrigatório se <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">tipoServico</code>="Registro de Imóveis" e <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">tipoLivro</code>="Matrícula" (salvo se CNM preenchido). |
| <b>transcricao</b> | Inteiro | 8 | Opcional* | Obrigatório se <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">tipoLivro</code>="Transcrição das Transmissões". |
| <b>codigoNacionalMatricula</b> | Alfanumérico | - | Opcional* | CNM. Formato: <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">CCCCCC.L.NNNNNNN-DD</code> (sem pontos/traços). Validado por Mod 97 Base 10. |
| <b>numeroRegistroAverbacao</b> | Alfanumérico | 7 | Sim* | Obrigatório se <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">tipoServico</code>="Registro de Imóveis" e <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">tipoLivro</code>="Matrícula". |
| <b>naturezaTitulo</b> | Alfanumérico | - | Sim* | Obrigatório se <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">tipoServico</code>="Registro de Imóveis". Conforme domínio. |
| <b>numeroRegistro</b> | Alfanumérico | 30 | Sim* | Obrigatório se <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">tipoServico</code>="Registro de Títulos e Documentos". |
| <b>existeDoiAnterior</b> | Booleano | - | Sim* | Obrigatório se <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">tipoServico</code>="Registro de Imóveis". (<code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">true</code>/<code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">false</code>) . |

### 3.2. Ficha: Operações Imobiliárias

Detalhes da transação financeira e contratual .

| Campo | Tipo | Tam. | Obrigatório | Descrição / Regra |
| --- | --- | --- | --- | --- |
| <b>dataNegocioJuridico</b> | Data | - | Sim | Data da celebração. Formato: <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">YYYY-MM-DD</code>. |
| <b>tipoOperacaoImobiliaria</b> | Alfanumérico | - | Sim | Conforme Tabela de Domínio. |
| <b>descricaoOutrasOperacoesImobiliarias</b> | Alfanumérico | 30 | Não* | Obrigatório apenas se <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">tipoOperacaoImobiliaria</code> for "Outras". |
| <b>valorOperacaoImobiliaria</b> | Monetário | 20.2 | Sim* | Valor da operação. Obrigatório se <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">indicadorNaoConstaValorOperacaoImobiliaria</code> for falso ou não enviado. |
| <b>indicadorNaoConstaValorOperacaoImobiliaria</b> | Booleano | - | * | Enviar <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">true</code> se o valor não constar nos documentos. Se <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">true</code>, não enviar o campo <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">valorOperacaoImobiliaria</code>. |
| <b>valorBaseCalculoItbiItcmd</b> | Monetário | 20.2 | Sim* | Valor base ITBI/ITCMD. |
| <b>indicadorNaoConstaValorBaseCalculoItbiItcmd</b> | Booleano | - | * | Enviar <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">true</code> se o valor base não constar. |
| <b>formaPagamento</b> | Alfanumérico | - | Sim | Conforme Tabela de Domínio. |
| <b>indicadorAlienacaoFiduciaria</b> | Booleano | - | * | Obrigatório se <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">formaPagamento</code> for "A prazo". |
| <b>mesAnoUltimaParcela</b> | Data | - | * | Obrigatório se <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">formaPagamento</code> for "A prazo". Formato: <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">YYYY-MM-DD</code>. |
| <b>valorPagoAteDataAto</b> | Monetário | 20.2 | * | Obrigatório se <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">formaPagamento</code> for "A prazo". |
| <b>indicadorPermutaBens</b> | Booleano | - | Sim | Houve permuta?. |
| <b>indicadorPagamentoDinheiro</b> | Booleano | - | Sim | Houve pagamento em espécie?. |
| <b>valorPagoMoedaCorrenteDataAto</b> | Monetário | 20.2 | Sim* | Obrigatório se <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">indicadorPagamentoDinheiro</code> for <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">true</code>. |
| <b>tipoParteTransacionada</b> | Alfanumérico | - | Sim | Medida da parte (percentual ou física). Conforme domínio. |
| <b>valorParteTransacionada</b> | Alfanumérico | 20.2 | Sim | Quantidade de metros/hectares ou o percentual. |

### 3.3. Ficha: Dados do Imóvel

Identificação física e fiscal do imóvel .

| Campo | Tipo | Tam. | Obrigatório | Descrição / Regra |
| --- | --- | --- | --- | --- |
| <b>cib</b> | Alfanumérico | 8 | Sim | Cadastro Imobiliário Brasileiro. Obrigatório se o imóvel possuir CIB (substitui Nirf rural). Possui validação de DV específica. |
| <b>destinacao</b> | Alfanumérico | - | Sim | "1" (Urbano) ou "3" (Rural). |
| <b>indicadorImovelPublicoUniao</b> | Booleano | - | Sim | Imóvel da União?. |
| <b>registroImobiliarioPatrimonial</b> | Alfanumérico | 13 | * | Obrigatório se <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">indicadorImovelPublicoUniao</code>=<code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">true</code>. Número RIP. |
| <b>certidaoAutorizacaoTransferencia</b> | Alfanumérico | 11 | * | Obrigatório se <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">indicadorImovelPublicoUniao</code>=<code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">true</code>. Número CAT. |
| <b>matricula</b> | Alfanumérico | 15 | * | Obrigatório se <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">transcricao</code> não for informada. (Formato: 9999999) . |
| <b>transcricao</b> | Inteiro | 8 | * | Obrigatório se <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">matricula</code> não for informada. |
| <b>inscricaoMunicipal</b> | Alfanumérico | 45 | Sim* | Obrigatório se Urbano. |
| <b>codigoIbge</b> | Numérico | 7 | Sim | Código do município (do imóvel ou da sede se rural). |
| <b>areaImovel</b> | Numérico | 15.2 | Sim | Área em m² (Urbano) ou ha (Rural). |
| <b>indicadorAreaLoteNaoConsta</b> | Booleano | - | Sim | Se área não consta. |
| <b>areaConstruida</b> | Numérico | 16.4 | Sim* | Área construída em m² (Urbano). |
| <b>indicadorAreaConstruidaNaoConsta</b> | Booleano | - | Sim | Se área construída não consta. |
| <b>tipoImovel</b> | Alfanumérico | - | Sim | Conforme Tabela de Domínio. |
| <b>tipoLogradouro</b> | Alfanumérico | 30 | Sim | Ex: Rua, Avenida. |
| <b>nomeLogradouro</b> | Alfanumérico | 255 | Sim | Endereço. |
| <b>numeroImovel</b> | Alfanumérico | 10 | Sim | Número. |
| <b>complementoNumeroImovel</b> | Alfanumérico | 10 | Não | Ex: Bloco, Apto. |
| <b>complementoEndereco</b> | Alfanumérico | 100 | Não | Ex: Nome do condomínio. |
| <b>bairro</b> | Alfanumérico | 150 | Sim | Bairro. |
| <b>cep</b> | Alfanumérico | 8 | Sim | CEP. |
| <b>codigoIncra</b> | Alfanumérico | 13 | Sim* | Obrigatório se Rural. |
| <b>denominacao</b> | Alfanumérico | 200 | Sim* | Nome do imóvel rural (se houver). |
| <b>localizacao</b> | Alfanumérico | 200 | Sim* | Detalhes de localização rural. |
| <b>municipiosUF</b> | Alfanumérico | - | Sim* | Lista de outros municípios onde o imóvel se localiza (se multi-município). |

### 3.4. Ficha: Alienantes e Adquirentes

Estrutura idêntica para ambos os grupos .

| Campo | Tipo | Descrição / Regra |
| --- | --- | --- |
| <b>indicadorNiIdentificado</b> | Booleano | Se CPF/CNPJ consta no documento. |
| <b>motivoNaoIdentificacaoNi</b> | Alfanumérico | Código do motivo (se <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">indicadorNiIdentificado</code>=<code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">false</code>). |
| <b>ni</b> | Alfanumérico | CPF (11) ou CNPJ (14). Validado por DV. |
| <b>participacao</b> | Numérico (7.4) | Percentual de participação (Soma deve ser &gt;= 99% e &lt;= 100%). |
| <b>indicadorNaoConstaParticipacaoOperacao</b> | Booleano | Se percentual não consta. |
| <b>indicadorEstrangeiro</b> | Booleano | É estrangeiro?. |
| <b>indicadorEspolio</b> | Booleano | É espólio?. |
| <b>cpfInventariante</b> | Alfanumérico | Obrigatório se <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">indicadorEspolio</code>=<code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">true</code>. |
| <b>indicadorConjuge</b> | Booleano | Possui cônjuge?. |
| <b>indicadorConjugeParticipa</b> | Booleano | Cônjuge participa da operação? (Se <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">true</code>, cônjuge entra como parte) . |
| <b>regimeBens</b> | Alfanumérico | Obrigatório se possui cônjuge. Conforme domínio. |
| <b>indicadorCpfConjugeIdentificado</b> | Booleano | CPF do cônjuge consta?. |
| <b>cpfConjuge</b> | Alfanumérico | CPF do cônjuge. |
| <b>indicadorRepresentante</b> | Booleano | Há procurador/representante?. |
| <b>representantes</b> | Lista (JSON) | Lista de objetos com dados dos representantes (CPF/CNPJ). |

---

## 4. Tabelas de Domínio (Enums)

Use estes códigos para preencher os campos correspondentes.

Tabela 1 - Tipo da declaração (tipoDeclaracao)

- 0: Original

- 1: Retificadora (Não importável em lote)

- 3: Canceladora (Não importável em lote)

Tabela 2 - Tipo do serviço (tipoServico)

- 1: Notarial

- 2: Registro de Imóveis

- 3: Registro de Títulos e Documentos

Tabela 3 - Tipo do ato (tipoAto)

- 1: Escritura

- 2: Procuração

- 3: Averbação

- 4: Registro

- 5: Registros para fins de publicidade

- 6: Registro para fins de conservação

Tabela 4 - Tipo do livro (tipoLivro)

- 1: Lv.2-Registro Geral (matrícula)

- 2: Transcrição das Transmissões

Tabela 5 - Natureza do título (naturezaTitulo)

- 1: Instrumento particular com força de escritura pública

- 2: Escritura Pública

- 3: Título Judicial

- 4: Contratos ou termos administrativos

- 5: Atos autênticos de países estrangeiros

Tabela 6 - Tipo da operação imobiliária (tipoOperacaoImobiliaria)

- Principais: 11 (Compra e Venda), 13 (Permuta), 55 (Doação adiantamento legítima), 67 (Doação), 69 (Inventário).

- Ver lista completa na fonte para códigos de 11 a 74.

Tabela 7 - Forma de Pagamento (formaPagamento)

- 5: Quitado à vista

- 10: Quitado a prazo

- 11: Quitado sem informação da forma de pagamento

- 7: A prazo

- 9: Não se aplica

Tabela 8 - Medida da parte transacionada (tipoParteTransacionada)

- 1: % (Percentual)

- 2: ha/m² (Área) (Note: No PDF original a tabela chama tipoDeclaracao erroneamente, mas no contexto do campo é a medida).

Tabela 9 - Destinação (destinacao)

- 1: Urbano

- 3: Rural

Tabela 10 - Motivo da não identificação do NI (motivoNaoIdentificacaoNi)

- 1: Sem CPF/CNPJ - Decisão Judicial

- 2: Não consta no documento

Tabela 11 - Regime de bens (regimeBens)

- 1: Separação de Bens

- 2: Comunhão Parcial de Bens

- 3: Comunhão Universal de Bens

- 4: Participação Final nos Aquestos

Tabela 12 - Tipo do imóvel (tipoImovel)

- Exemplos: 15 (Loja), 65 (Apartamento), 67 (Casa), 69 (Fazenda/Sítio), 71 (Terreno).

---

## 5. Regras de Validação e Erros Comuns

O sistema realiza três tipos de validação:

1. Estrutural (JSON): Erros de sitaxe (vírgulas, chaves) ou tipos de dados (string em campo numérico) rejeitam o arquivo todo .

2. Individual (Inaptidão): Declarações com erro de lógica (ex: soma de participação < 100%, datas futuras) são rejeitadas individualmente, mas não impedem o arquivo se houver outras corretas .

3. Pendências/Avisos: Duplicidade suspeita ou inconsistências leves. Permitem importação, mas geram alertas.

### Validações Lógicas Críticas (Exemplos)

- Datas: dataNegocioJuridico não pode ser maior que dataAtual nem maior que dataAto.

- Participação: A soma das participações dos alienantes (ou adquirentes) não pode ser inferior a 99% nem superior a 100%, exceto se marcado "Não consta".

- Duplicidade: O sistema checa duplicidade baseada na combinação de: CNS, Data Ato, Livro, Folha, Tipo Operação, Data Negócio, Valor, CIB e NIs das partes.

---

## 6. Algoritmo de Validação do CIB

O Código CIB (Cadastro Imobiliário Brasileiro) usa um dígito verificador (DV) complexo .

Formato: AAAAAAA-D (7 caracteres + DV).

### Regras de Decodificação (Base 32 Crockford Modificada):

- Ignora-se o hífen.

- Exclusões: I, i, L, l, O, o, U, u.

- Tratamento Especial: i, I, l, L = 1; o, O = 0.

- Letras u, U não são aceitas.

### Cálculo do DV:

4. Se todos os caracteres forem numéricos: Usa-se Módulo 11 (Pesos: 8, 7, 6, 5, 4, 3, 2). Se resto 0 ou 1, DV = 0. Senão, DV = 11 - resto.

5. Se houver letras:

- Converte-se cada caractere para valor numérico conforme tabela de Encode/Decode  (Ex: A=10, B=11... Z=31).

- Pesos posicionais: 4, 3, 9, 5, 7, 1, 8.

- Soma-se os produtos.

- Divide-se a soma por 31.

- O Resto da divisão é convertido de volta para caractere (Encode) para obter o DV .

```json
{
  "declaracoes": [
    {
      "adquirentes": [
        {
          "indicadorEspolio": false,
          "indicadorEstrangeiro": false,
          "indicadorNaoConstaParticipacaoOperacao": false,
          "indicadorNiIdentificado": true,
          "ni": "12345678901",
          "participacao": 50.0,
          "indicadorConjuge": true,
          "indicadorConjugeParticipa": true,
          "indicadorCpfConjugeIdentificado": true,
          "cpfConjuge": "10987654321",
          "regimeBens": "2",
          "indicadorRepresentante": false,
          "representantes": []
        }
      ],
      "alienantes": [
        {
          "indicadorEspolio": false,
          "indicadorEstrangeiro": false,
          "indicadorNaoConstaParticipacaoOperacao": false,
          "indicadorNiIdentificado": true,
          "ni": "98765432100",
          "participacao": 100.0,
          "indicadorConjuge": false,
          "indicadorRepresentante": false,
          "representantes": []
        }
      ],
      "dataLavraturaRegistroAverbacao": "2025-08-15",
      "dataNegocioJuridico": "2025-08-10",
      "destinacao": "1",
      "formaPagamento": "5",
      "indicadorImovelPublicoUniao": false,
      "indicadorPagamentoDinheiro": true,
      "indicadorPermutaBens": false,
      "tipoDeclaracao": "0",
      "tipoOperacaoImobiliaria": "11",
      "tipoParteTransacionada": "1",
      "tipoServico": "1",
      "valorParteTransacionada": 100.0,
      "bairro": "Centro",
      "cep": "01001000",
      "codigoIbge": "3550308",
      "codigoNacionalMatricula": "123456L00000001AA",
      "nomeLogradouro": "Rua das Flores",
      "numeroImovel": "123",
      "complementoEndereco": "Apto 202",
      "tipoLogradouro": "Rua",
      "tipoImovel": "67",
      "numeroRegistro": "20250910001",
      "matricula": "1234567",
      "numeroLivro": "987",
      "folha": "10-12",
      "tipoAto": "1",
      "tipoLivro": "1",
      "naturezaTitulo": "2",
      "valorOperacaoImobiliaria": 450000.00,
      "valorBaseCalculoItbiItcmd": 450000.00,
      "valorPagoMoedaCorrenteDataAto": 450000.00,
      "existeDoiAnterior": false,
      "indicadorAlienacaoFiduciaria": false,
      "registroImobiliarioPatrimonial": "1234567890123"
    }
  ]
}

```
