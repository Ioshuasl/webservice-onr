# **DIRETORIA DE INFORMÁTICA** **CINPR/GESIP** **REGISTRO CIVIL** **DOCUMENTO DO LAYOUT DO ARQUIVO GERADO PELOS** **TABELIONATOS INFORMATIZADOS** **PARA O SISTEMA REGISTRO CIVIL DO IBGE** **DE ACORDO COM A** **EMENDA CONSTITUCIONAL nº66 de 14/07/2010**

**(Atualizado em: 31/05/2020)**


**MAIO / 2020**


**INDICE**

|1 - NOVIDADES ..........................................................................................................................................|2|
|---|---|
|**_2 – INTRODUÇÃO ........................................................................................................................................_**|**_2 _**|
|**_3 - NOMENCLATURA DOS ARQUIVOS ................................................................................................._**|**_3 _**|
|**_4 - IDENTIFICAÇÃO DO TABELIONATO..............................................................................................._**|**_3 _**|
|**_5 -  MODELO DO RESUMO DOS DADOS (RECIBO) ............................................................................._**|**_3 _**|
|_5.1 - Definição da Estrutura do Arquivo TABINF12.TXT............................................................................_|_3 _|
|_5.2 - Norma de Preenchimento dos Campos do Arquivo TABINF12.TXT...................................................._|_4 _|
|**_6 - MODELO 7 - DIVÓRCIOS EXTRAJUDICIAIS.................................................................................._**|**_5 _**|
|_6.1 - Definição da Estrutura do Arquivo TABINF07.TXT............................................................................_|_5 _|
|_6.2 - Norma de Preenchimento dos Campos do Arquivo TABINF07.TXT...................................................._|_6 _|
|**_7 - ARQUIVO PARA CONTROLE DO IBGE ............................................................................................._**|**_9 _**|
|**_8 - TAMANHO DOS REGISTROS ............................................................................................................_**|**_9 _**|
|**_9 – REGRAS PARA O PREENCHIMENTO DOS CAMPOS NUMÉRICOS, ALFANUMÉRICOS E_**||
|**_SEM VALOR ................................................................................................................................................_**|**_       9_**|
|**_10 – REGRAS PARA O PREENCHIMENTO DOS CAMPOS DE UF, MUNICÍPIO E PAÍS................._**|**_10_**|
|**_11 – ORIENTAÇÕES PARA BAIXAR A TABELA DE MUNICÍPIOS DO IBGE ...................................._**|**_11_**|
|**_12 – ORIENTAÇÕES PARA BAIXAR A TABELA DE PAISES DA ONU ATRAVÉS DO SITE DO_**||
|**_IBGE .............................................................................................................................................................._**|**_     12_**|



IBGE – Registro Civil – Instruções para a geração dos arquivos dos Tabelionatos Informatizados – Pág: 1


**1** **– NOVIDADES !!!**


_**1.1**_ _OS ARQUIVOS QUE SERÃO COMPACTADOS E O ARQUIVO ZIPADO POSSUEM NOMENCLATURA NOVA._


_**1.2**_ _FOI RETIRADO O CAMPO DIFERENCIADOR DOS ARQUIVOS._


_**1.3**_ _O MODELO DE DIVÓRCIOS EXTRAJUDICIAIS FOI ALTERADO PARA ATENDER A NOVA LEI DE CASAMENTOS_

_HOMOAFETIVOS DE 2013._


**Resolução nº 175, de 14 de maio de 2013**


Art. 1º É vedada às autoridades competentes a recusa de habilitação, celebração de casamento civil ou de conversão de união

estável em casamento entre pessoas de mesmo sexo.


Art. 2º A recusa prevista no artigo 1º implicará a imediata comunicação ao respectivo juiz corregedor para as providências

cabíveis.


Art. 3º Esta resolução entra em vigor na data de sua publicação.


**Ministro Joaquim Barbosa**


_**1.4**_ _OS CAMPOS DE UF, MUNICÍPIO E PAIS POSSUEM NOVAS REGRAS DE PREENCHIMENTO. ESSES CAMPOS_

_DEVERÃO SER PREENCHIDOS COM OS CÓDIGOS EXISTENTES NAS TABELAS DO IBGE DE UF, MUNICÍPIO E_
_PAÍS. (VERIFICAR OS PROCEDIMENTOS PARA BAIXAR ESSAS TABELAS NOS ITENS 11 E 12)._


**2** **- INTRODUÇÃO**


O IBGE implantou em suas Unidades Descentralizadas de Apuração o Sistema de Administração de Tabelionatos, que


a partir dos dados gravados em um arquivo compactado de extensão (.zip) enviado por qualquer tipo de Dispositivo de


Armazenamento (CD/Pen drive,etc) ou pela Internet, possibilita receber todos os registros de Divórcios Extrajudiciais sem a


necessidade de emissão de questionários e conseqüentemente sem digitação. Para tal, será preciso que os Tabelionatos que


possuam Sistema Informatizado próprio gerem os dados necessários no formato descrito nesse documento, obedecendo à


nomenclatura e tamanho dos campos dos modelos, para que o Sistema do IBGE possa realizar a leitura e gravação dos mesmos.


**ATENÇÃO !!! Após a criação do arquivo, entregá-lo na Unidade do IBGE mais próxima para que**


**seja encaminhado para homologação a ser realizada pela Equipe de Informática.**


IBGE – Registro Civil – Instruções para a geração dos arquivos dos Tabelionatos Informatizados – Pág: 2


**3** **- NOMENCLATURA DOS ARQUIVOS**


Deverão ser gerados três arquivos, um para o modelo de **Divórcios Extrajudiciais**, outro para o **Resumo dos Dados**


**(Recibo)** e o último para **controle do IBGE** conforme mostra a tabela abaixo. Esses três arquivos deverão ser compactados


através de um **Software de Compactação (Ex: Winzip, WinRAR, Brazip, 7-zip, etc.)** para um único arquivo chamado


**TABINF.ZIP** .

|NOME DOS ARQUIVOS IDENTIFICAÇÃO DO MODELO|Col2|
|---|---|
|TABINF**07**.TXT<br>DIVÓRCIOS EXTRAJUDICIAIS|TABINF**07**.TXT<br>DIVÓRCIOS EXTRAJUDICIAIS|
|TABINF**12**.TXT<br>RESUMO DOS DADOS (RECIBO)|TABINF**12**.TXT<br>RESUMO DOS DADOS (RECIBO)|
|CONTROLE.SIS|CONTROLE DO IBGE|



**4** **- IDENTIFICAÇÃO DO TABELIONATO**


O IBGE fornecerá uma chave de identificação do Tabelionato que deverá constar em todos os registros dos arquivos


( **TABINF07.TXT** e **TABINF12.TXT** ) conforme descrito nos próximos itens.


A chave de identificação é composta pelos seguintes campos: **UF DA PESQUISA + MUNICÍPIO DA PESQUISA**


**+ DISTRITO DA PESQUISA + CÓDIGO DO CARTÓRIO.**


**5** **- MODELO DO RESUMO DOS DADOS (RECIBO)**


**5.1** **- DEFINIÇÃO DA ESTRUTURA DO ARQUIVO TABINF12.TXT**


















|Nº DESCRIÇÃO NOME CAMPO TIPO TAMANHO|Col2|Col3|Col4|Col5|
|---|---|---|---|---|
|**1 **<br>**UF DA PESQUISA**<br>**UF-PESQUISA**<br>**CHAR**<br>**02**|**1 **<br>**UF DA PESQUISA**<br>**UF-PESQUISA**<br>**CHAR**<br>**02**|**1 **<br>**UF DA PESQUISA**<br>**UF-PESQUISA**<br>**CHAR**<br>**02**|**1 **<br>**UF DA PESQUISA**<br>**UF-PESQUISA**<br>**CHAR**<br>**02**|**1 **<br>**UF DA PESQUISA**<br>**UF-PESQUISA**<br>**CHAR**<br>**02**|
|**2 **<br>**MUNICÍPIO DA PESQUISA**<br>**MUN-PESQUISA**<br>**CHAR**<br>**05**|**2 **<br>**MUNICÍPIO DA PESQUISA**<br>**MUN-PESQUISA**<br>**CHAR**<br>**05**|**2 **<br>**MUNICÍPIO DA PESQUISA**<br>**MUN-PESQUISA**<br>**CHAR**<br>**05**|**2 **<br>**MUNICÍPIO DA PESQUISA**<br>**MUN-PESQUISA**<br>**CHAR**<br>**05**|**2 **<br>**MUNICÍPIO DA PESQUISA**<br>**MUN-PESQUISA**<br>**CHAR**<br>**05**|
|**3 **<br>**DISTRITO DA PESQUISA**<br>**DIST-PESQUISA**<br>**CHAR**<br>**02**|**3 **<br>**DISTRITO DA PESQUISA**<br>**DIST-PESQUISA**<br>**CHAR**<br>**02**|**3 **<br>**DISTRITO DA PESQUISA**<br>**DIST-PESQUISA**<br>**CHAR**<br>**02**|**3 **<br>**DISTRITO DA PESQUISA**<br>**DIST-PESQUISA**<br>**CHAR**<br>**02**|**3 **<br>**DISTRITO DA PESQUISA**<br>**DIST-PESQUISA**<br>**CHAR**<br>**02**|
|**4 **<br>**CÓDIGO DO CARTÓRIO**<br>**COD_CARTORIO**<br>**CHAR**<br>**02**|**4 **<br>**CÓDIGO DO CARTÓRIO**<br>**COD_CARTORIO**<br>**CHAR**<br>**02**|**4 **<br>**CÓDIGO DO CARTÓRIO**<br>**COD_CARTORIO**<br>**CHAR**<br>**02**|**4 **<br>**CÓDIGO DO CARTÓRIO**<br>**COD_CARTORIO**<br>**CHAR**<br>**02**|**4 **<br>**CÓDIGO DO CARTÓRIO**<br>**COD_CARTORIO**<br>**CHAR**<br>**02**|
|**5 **<br>ANO DA PESQUISA<br>ANO-PESQUISA<br>CHAR<br>04|**5 **<br>ANO DA PESQUISA<br>ANO-PESQUISA<br>CHAR<br>04|**5 **<br>ANO DA PESQUISA<br>ANO-PESQUISA<br>CHAR<br>04|**5 **<br>ANO DA PESQUISA<br>ANO-PESQUISA<br>CHAR<br>04|**5 **<br>ANO DA PESQUISA<br>ANO-PESQUISA<br>CHAR<br>04|
|**6 **<br>TRIMESTRE DA PESQUISA<br>TRIM-PESQUISA<br>CHAR<br>01|**6 **<br>TRIMESTRE DA PESQUISA<br>TRIM-PESQUISA<br>CHAR<br>01|**6 **<br>TRIMESTRE DA PESQUISA<br>TRIM-PESQUISA<br>CHAR<br>01|**6 **<br>TRIMESTRE DA PESQUISA<br>TRIM-PESQUISA<br>CHAR<br>01|**6 **<br>TRIMESTRE DA PESQUISA<br>TRIM-PESQUISA<br>CHAR<br>01|
|**7 **<br>TOTAL DE REGISTROS DE DIVÓRCIOS<br>TOTAL-DIV<br>CHAR<br>06|**7 **<br>TOTAL DE REGISTROS DE DIVÓRCIOS<br>TOTAL-DIV<br>CHAR<br>06|**7 **<br>TOTAL DE REGISTROS DE DIVÓRCIOS<br>TOTAL-DIV<br>CHAR<br>06|**7 **<br>TOTAL DE REGISTROS DE DIVÓRCIOS<br>TOTAL-DIV<br>CHAR<br>06|**7 **<br>TOTAL DE REGISTROS DE DIVÓRCIOS<br>TOTAL-DIV<br>CHAR<br>06|
|**8 **|TOTAL<br>DE<br>REGISTROS<br>COM<br>CHAVES<br> <br>REPETIDAS|TOTAL-REPETIDOS|CHAR|04|



IBGE – Registro Civil – Instruções para a geração dos arquivos dos Tabelionatos Informatizados – Pág: 3


**5.2** **- NORMA DE PREENCHIMENTO DOS CAMPOS DO ARQUIVO TABINF12.TXT**









|Nº NOME CAMPO DESCRIÇÃO|Col2|Col3|
|---|---|---|
|**1 **<br>**UF-PESQUISA**<br>**O valor desse campo será fornecido pelo IBGE.**|**1 **<br>**UF-PESQUISA**<br>**O valor desse campo será fornecido pelo IBGE.**|**1 **<br>**UF-PESQUISA**<br>**O valor desse campo será fornecido pelo IBGE.**|
|**2 **<br>**MUN-PESQUISA**<br>**O valor desse campo será fornecido pelo IBGE.**|**2 **<br>**MUN-PESQUISA**<br>**O valor desse campo será fornecido pelo IBGE.**|**2 **<br>**MUN-PESQUISA**<br>**O valor desse campo será fornecido pelo IBGE.**|
|**3 **<br>**DIST-PESQUISA**<br>**O valor desse campo será fornecido pelo IBGE.**|**3 **<br>**DIST-PESQUISA**<br>**O valor desse campo será fornecido pelo IBGE.**|**3 **<br>**DIST-PESQUISA**<br>**O valor desse campo será fornecido pelo IBGE.**|
|**4 **<br>**COD_CARTORIO**<br>**O valor desse campo será fornecido pelo IBGE.**|**4 **<br>**COD_CARTORIO**<br>**O valor desse campo será fornecido pelo IBGE.**|**4 **<br>**COD_CARTORIO**<br>**O valor desse campo será fornecido pelo IBGE.**|
|5 <br>ANO-PESQUISA<br>Preencher com oano da pesquisa. Campo numérico de quatro posições.|5 <br>ANO-PESQUISA<br>Preencher com oano da pesquisa. Campo numérico de quatro posições.|5 <br>ANO-PESQUISA<br>Preencher com oano da pesquisa. Campo numérico de quatro posições.|
|6 <br>TRIM-PESQUISA<br>Preencher com o trimestre em questão. Campo numérico de uma posição.<br> <br>Valores válidos: **1, 2, 3 e 4**.|6 <br>TRIM-PESQUISA<br>Preencher com o trimestre em questão. Campo numérico de uma posição.<br> <br>Valores válidos: **1, 2, 3 e 4**.|6 <br>TRIM-PESQUISA<br>Preencher com o trimestre em questão. Campo numérico de uma posição.<br> <br>Valores válidos: **1, 2, 3 e 4**.|
|7 <br>TOTAL-DIV<br>Preencher com o**total de escrituras**existentes no modelo de DIVÓRCIOS<br>EXTRAJUDICIAIS (**TABINF07.TXT)**. Campo numérico de seis posições.<br> **Total de Escrituras = Qtde Total de Escrituras – Total-Repetidos**|7 <br>TOTAL-DIV<br>Preencher com o**total de escrituras**existentes no modelo de DIVÓRCIOS<br>EXTRAJUDICIAIS (**TABINF07.TXT)**. Campo numérico de seis posições.<br> **Total de Escrituras = Qtde Total de Escrituras – Total-Repetidos**|7 <br>TOTAL-DIV<br>Preencher com o**total de escrituras**existentes no modelo de DIVÓRCIOS<br>EXTRAJUDICIAIS (**TABINF07.TXT)**. Campo numérico de seis posições.<br> **Total de Escrituras = Qtde Total de Escrituras – Total-Repetidos**|
|8|TOTAL-REPETIDOS|Preencher com o**total de escrituras **existentes no modelo de DIVÓRCIOS<br>EXTRAJUDICIAIS**(TABINF07.TXT)**que possui a mesma chave**(uf-pesquisa, mun-**<br>**pesquisa, dist-pesquisa, cod-cartorio, ano-pesquisa, trim-pesquisa, num-livro, num-**<br>**inicial-folha, num-final-folha e compl-folha)**de outro registro do arquivo. Campo<br>numérico de quatro posições.|


**ATENÇÃO !!!** Caso seja um **Banco de Dados Centralizado**, deverá existir no arquivo **TABINF12.TXT**


um registro referente a quantidade de registros de Divórcios Extrajudiciais gravados no arquivo


**TABINF07.TXT** para cada Tabelionato.


IBGE – Registro Civil – Instruções para a geração dos arquivos dos Tabelionatos Informatizados – Pág: 4


**6** **- MODELO 7 - DIVÓRCIOS EXTRAJUDICIAIS**


**6.1** **- DEFINIÇÃO DA ESTRUTURA DO ARQUIVO TABINF07.TXT**













|DESCRIÇÃO NOME DO CAMPO TIPO TAMANHO<br>Nº|Col2|Col3|Col4|Col5|
|---|---|---|---|---|
|**1 **<br>**UF DA PESQUISA**<br>**UF-PESQUISA**<br>**CHAR**<br>**02**|**1 **<br>**UF DA PESQUISA**<br>**UF-PESQUISA**<br>**CHAR**<br>**02**|**1 **<br>**UF DA PESQUISA**<br>**UF-PESQUISA**<br>**CHAR**<br>**02**|**1 **<br>**UF DA PESQUISA**<br>**UF-PESQUISA**<br>**CHAR**<br>**02**|**1 **<br>**UF DA PESQUISA**<br>**UF-PESQUISA**<br>**CHAR**<br>**02**|
|**2 **<br>**MUNICÍPIO DA PESQUISA**<br>**MUN-PESQUISA**<br>**CHAR**<br>**05**|**2 **<br>**MUNICÍPIO DA PESQUISA**<br>**MUN-PESQUISA**<br>**CHAR**<br>**05**|**2 **<br>**MUNICÍPIO DA PESQUISA**<br>**MUN-PESQUISA**<br>**CHAR**<br>**05**|**2 **<br>**MUNICÍPIO DA PESQUISA**<br>**MUN-PESQUISA**<br>**CHAR**<br>**05**|**2 **<br>**MUNICÍPIO DA PESQUISA**<br>**MUN-PESQUISA**<br>**CHAR**<br>**05**|
|**3 **<br>**DISTRITO DA PESQUISA**<br>**DIST-PESQUISA**<br>**CHAR**<br>**02**|**3 **<br>**DISTRITO DA PESQUISA**<br>**DIST-PESQUISA**<br>**CHAR**<br>**02**|**3 **<br>**DISTRITO DA PESQUISA**<br>**DIST-PESQUISA**<br>**CHAR**<br>**02**|**3 **<br>**DISTRITO DA PESQUISA**<br>**DIST-PESQUISA**<br>**CHAR**<br>**02**|**3 **<br>**DISTRITO DA PESQUISA**<br>**DIST-PESQUISA**<br>**CHAR**<br>**02**|
|**4 **<br>**CÓDIGO DO CARTORIO**<br>**COD_CARTORIO**<br>**CHAR**<br>**02**|**4 **<br>**CÓDIGO DO CARTORIO**<br>**COD_CARTORIO**<br>**CHAR**<br>**02**|**4 **<br>**CÓDIGO DO CARTORIO**<br>**COD_CARTORIO**<br>**CHAR**<br>**02**|**4 **<br>**CÓDIGO DO CARTORIO**<br>**COD_CARTORIO**<br>**CHAR**<br>**02**|**4 **<br>**CÓDIGO DO CARTORIO**<br>**COD_CARTORIO**<br>**CHAR**<br>**02**|
|**5 **<br>ANO DA PESQUISA<br>ANO-PESQUISA<br>CHAR<br>04|**5 **<br>ANO DA PESQUISA<br>ANO-PESQUISA<br>CHAR<br>04|**5 **<br>ANO DA PESQUISA<br>ANO-PESQUISA<br>CHAR<br>04|**5 **<br>ANO DA PESQUISA<br>ANO-PESQUISA<br>CHAR<br>04|**5 **<br>ANO DA PESQUISA<br>ANO-PESQUISA<br>CHAR<br>04|
|**6 **<br>TRIMESTRE DA PESQUISA<br>TRIM-PESQUISA<br>CHAR<br>01|**6 **<br>TRIMESTRE DA PESQUISA<br>TRIM-PESQUISA<br>CHAR<br>01|**6 **<br>TRIMESTRE DA PESQUISA<br>TRIM-PESQUISA<br>CHAR<br>01|**6 **<br>TRIMESTRE DA PESQUISA<br>TRIM-PESQUISA<br>CHAR<br>01|**6 **<br>TRIMESTRE DA PESQUISA<br>TRIM-PESQUISA<br>CHAR<br>01|
|**7 **<br>NÚMERO DO LIVRO<br>NUM-LIVRO<br>CHAR<br>18|**7 **<br>NÚMERO DO LIVRO<br>NUM-LIVRO<br>CHAR<br>18|**7 **<br>NÚMERO DO LIVRO<br>NUM-LIVRO<br>CHAR<br>18|**7 **<br>NÚMERO DO LIVRO<br>NUM-LIVRO<br>CHAR<br>18|**7 **<br>NÚMERO DO LIVRO<br>NUM-LIVRO<br>CHAR<br>18|
|**8 **<br>NÚMERO INICIAL DA FOLHA<br>NUM-INICIAL-FOLHA<br>CHAR<br>04|**8 **<br>NÚMERO INICIAL DA FOLHA<br>NUM-INICIAL-FOLHA<br>CHAR<br>04|**8 **<br>NÚMERO INICIAL DA FOLHA<br>NUM-INICIAL-FOLHA<br>CHAR<br>04|**8 **<br>NÚMERO INICIAL DA FOLHA<br>NUM-INICIAL-FOLHA<br>CHAR<br>04|**8 **<br>NÚMERO INICIAL DA FOLHA<br>NUM-INICIAL-FOLHA<br>CHAR<br>04|
|**9 **<br>NÚMERO FINAL DA FOLHA<br>NUM-FINAL-FOLHA<br>CHAR<br>04|**9 **<br>NÚMERO FINAL DA FOLHA<br>NUM-FINAL-FOLHA<br>CHAR<br>04|**9 **<br>NÚMERO FINAL DA FOLHA<br>NUM-FINAL-FOLHA<br>CHAR<br>04|**9 **<br>NÚMERO FINAL DA FOLHA<br>NUM-FINAL-FOLHA<br>CHAR<br>04|**9 **<br>NÚMERO FINAL DA FOLHA<br>NUM-FINAL-FOLHA<br>CHAR<br>04|
|**10**<br>COMPLEMENTO DA FOLHA<br>COMPL-FOLHA<br>CHAR<br>01|**10**<br>COMPLEMENTO DA FOLHA<br>COMPL-FOLHA<br>CHAR<br>01|**10**<br>COMPLEMENTO DA FOLHA<br>COMPL-FOLHA<br>CHAR<br>01|**10**<br>COMPLEMENTO DA FOLHA<br>COMPL-FOLHA<br>CHAR<br>01|**10**<br>COMPLEMENTO DA FOLHA<br>COMPL-FOLHA<br>CHAR<br>01|
|**11**<br>DATA DA ABERTURA DA ESCRITURA<br>DATA-ABERT-ESCRIT<br>CHAR<br>08|**11**<br>DATA DA ABERTURA DA ESCRITURA<br>DATA-ABERT-ESCRIT<br>CHAR<br>08|**11**<br>DATA DA ABERTURA DA ESCRITURA<br>DATA-ABERT-ESCRIT<br>CHAR<br>08|**11**<br>DATA DA ABERTURA DA ESCRITURA<br>DATA-ABERT-ESCRIT<br>CHAR<br>08|**11**<br>DATA DA ABERTURA DA ESCRITURA<br>DATA-ABERT-ESCRIT<br>CHAR<br>08|
|**12**<br>DATA DO ATO NOTARIAL<br>DATA-ATO-NOTARIAL<br>CHAR<br>08|**12**<br>DATA DO ATO NOTARIAL<br>DATA-ATO-NOTARIAL<br>CHAR<br>08|**12**<br>DATA DO ATO NOTARIAL<br>DATA-ATO-NOTARIAL<br>CHAR<br>08|**12**<br>DATA DO ATO NOTARIAL<br>DATA-ATO-NOTARIAL<br>CHAR<br>08|**12**<br>DATA DO ATO NOTARIAL<br>DATA-ATO-NOTARIAL<br>CHAR<br>08|
|**13**<br>DATA DO CASAMENTO<br>DATA-CASAMENTO<br>CHAR<br>08|**13**<br>DATA DO CASAMENTO<br>DATA-CASAMENTO<br>CHAR<br>08|**13**<br>DATA DO CASAMENTO<br>DATA-CASAMENTO<br>CHAR<br>08|**13**<br>DATA DO CASAMENTO<br>DATA-CASAMENTO<br>CHAR<br>08|**13**<br>DATA DO CASAMENTO<br>DATA-CASAMENTO<br>CHAR<br>08|
|**14**<br>REGIME DE BENS<br>REGIME-BENS<br>CHAR<br>01|**14**<br>REGIME DE BENS<br>REGIME-BENS<br>CHAR<br>01|**14**<br>REGIME DE BENS<br>REGIME-BENS<br>CHAR<br>01|**14**<br>REGIME DE BENS<br>REGIME-BENS<br>CHAR<br>01|**14**<br>REGIME DE BENS<br>REGIME-BENS<br>CHAR<br>01|
|**15**<br>FILHOS MAIORES<br>NUM-FILHO-MAIOR<br>CHAR<br>02|**15**<br>FILHOS MAIORES<br>NUM-FILHO-MAIOR<br>CHAR<br>02|**15**<br>FILHOS MAIORES<br>NUM-FILHO-MAIOR<br>CHAR<br>02|**15**<br>FILHOS MAIORES<br>NUM-FILHO-MAIOR<br>CHAR<br>02|**15**<br>FILHOS MAIORES<br>NUM-FILHO-MAIOR<br>CHAR<br>02|
|**16**<br>FILHOS MENORES<br>NUM-FILHO-MENOR<br>CHAR<br>02|**16**<br>FILHOS MENORES<br>NUM-FILHO-MENOR<br>CHAR<br>02|**16**<br>FILHOS MENORES<br>NUM-FILHO-MENOR<br>CHAR<br>02|**16**<br>FILHOS MENORES<br>NUM-FILHO-MENOR<br>CHAR<br>02|**16**<br>FILHOS MENORES<br>NUM-FILHO-MENOR<br>CHAR<br>02|
|**17**<br>COD_RESPONSAVEL_FILHOS<br>COD_RESP_FILHO<br>CHAR<br>01|**17**<br>COD_RESPONSAVEL_FILHOS<br>COD_RESP_FILHO<br>CHAR<br>01|**17**<br>COD_RESPONSAVEL_FILHOS<br>COD_RESP_FILHO<br>CHAR<br>01|**17**<br>COD_RESPONSAVEL_FILHOS<br>COD_RESP_FILHO<br>CHAR<br>01|**17**<br>COD_RESPONSAVEL_FILHOS<br>COD_RESP_FILHO<br>CHAR<br>01|
|**18**<br>UF DE RESIDÊNCIA DO CONJUGE 1<br>COD-UF-RES-CONJ1<br>CHAR<br>02|**18**<br>UF DE RESIDÊNCIA DO CONJUGE 1<br>COD-UF-RES-CONJ1<br>CHAR<br>02|**18**<br>UF DE RESIDÊNCIA DO CONJUGE 1<br>COD-UF-RES-CONJ1<br>CHAR<br>02|**18**<br>UF DE RESIDÊNCIA DO CONJUGE 1<br>COD-UF-RES-CONJ1<br>CHAR<br>02|**18**<br>UF DE RESIDÊNCIA DO CONJUGE 1<br>COD-UF-RES-CONJ1<br>CHAR<br>02|
|**19**<br>MUNICÍPIO DE RESIDÊNCIA DO CONJUGE 1<br>COD-MUN-RES-CONJ1<br>CHAR<br>05|**19**<br>MUNICÍPIO DE RESIDÊNCIA DO CONJUGE 1<br>COD-MUN-RES-CONJ1<br>CHAR<br>05|**19**<br>MUNICÍPIO DE RESIDÊNCIA DO CONJUGE 1<br>COD-MUN-RES-CONJ1<br>CHAR<br>05|**19**<br>MUNICÍPIO DE RESIDÊNCIA DO CONJUGE 1<br>COD-MUN-RES-CONJ1<br>CHAR<br>05|**19**<br>MUNICÍPIO DE RESIDÊNCIA DO CONJUGE 1<br>COD-MUN-RES-CONJ1<br>CHAR<br>05|
|**20**<br>PAÍS DE RESIDÊNCIA DO CONJUGE 1<br>COD-PAIS-RES-CONJ1<br>CHAR<br>03|**20**<br>PAÍS DE RESIDÊNCIA DO CONJUGE 1<br>COD-PAIS-RES-CONJ1<br>CHAR<br>03|**20**<br>PAÍS DE RESIDÊNCIA DO CONJUGE 1<br>COD-PAIS-RES-CONJ1<br>CHAR<br>03|**20**<br>PAÍS DE RESIDÊNCIA DO CONJUGE 1<br>COD-PAIS-RES-CONJ1<br>CHAR<br>03|**20**<br>PAÍS DE RESIDÊNCIA DO CONJUGE 1<br>COD-PAIS-RES-CONJ1<br>CHAR<br>03|
|**21**<br>UF DE RESIDÊNCIA DO CONJUGE 2<br>COD-UF-RES-CONJ2<br>CHAR<br>02|**21**<br>UF DE RESIDÊNCIA DO CONJUGE 2<br>COD-UF-RES-CONJ2<br>CHAR<br>02|**21**<br>UF DE RESIDÊNCIA DO CONJUGE 2<br>COD-UF-RES-CONJ2<br>CHAR<br>02|**21**<br>UF DE RESIDÊNCIA DO CONJUGE 2<br>COD-UF-RES-CONJ2<br>CHAR<br>02|**21**<br>UF DE RESIDÊNCIA DO CONJUGE 2<br>COD-UF-RES-CONJ2<br>CHAR<br>02|
|**22**<br>MUNICÍPIO DE RESIDÊNCIA DO CONJUGE 2<br>COD-MUN-RES-CONJ2<br>CHAR<br>05|**22**<br>MUNICÍPIO DE RESIDÊNCIA DO CONJUGE 2<br>COD-MUN-RES-CONJ2<br>CHAR<br>05|**22**<br>MUNICÍPIO DE RESIDÊNCIA DO CONJUGE 2<br>COD-MUN-RES-CONJ2<br>CHAR<br>05|**22**<br>MUNICÍPIO DE RESIDÊNCIA DO CONJUGE 2<br>COD-MUN-RES-CONJ2<br>CHAR<br>05|**22**<br>MUNICÍPIO DE RESIDÊNCIA DO CONJUGE 2<br>COD-MUN-RES-CONJ2<br>CHAR<br>05|
|**23**<br>PAÍS DE RESIDÊNCIA DO CONJUGE 2<br>COD-PAIS-RES-CONJ2<br>CHAR<br>03|**23**<br>PAÍS DE RESIDÊNCIA DO CONJUGE 2<br>COD-PAIS-RES-CONJ2<br>CHAR<br>03|**23**<br>PAÍS DE RESIDÊNCIA DO CONJUGE 2<br>COD-PAIS-RES-CONJ2<br>CHAR<br>03|**23**<br>PAÍS DE RESIDÊNCIA DO CONJUGE 2<br>COD-PAIS-RES-CONJ2<br>CHAR<br>03|**23**<br>PAÍS DE RESIDÊNCIA DO CONJUGE 2<br>COD-PAIS-RES-CONJ2<br>CHAR<br>03|
|**24**<br>UF DE NASCIMENTO DO CONJUGE 1<br>COD-UF-NASC-CONJ1<br>CHAR<br>02|**24**<br>UF DE NASCIMENTO DO CONJUGE 1<br>COD-UF-NASC-CONJ1<br>CHAR<br>02|**24**<br>UF DE NASCIMENTO DO CONJUGE 1<br>COD-UF-NASC-CONJ1<br>CHAR<br>02|**24**<br>UF DE NASCIMENTO DO CONJUGE 1<br>COD-UF-NASC-CONJ1<br>CHAR<br>02|**24**<br>UF DE NASCIMENTO DO CONJUGE 1<br>COD-UF-NASC-CONJ1<br>CHAR<br>02|
|**25**<br>PAÍS DE NASCIMENTO DO CONJUGE 1<br>COD-PAIS-NASC-CONJ1<br>CHAR<br>03|**25**<br>PAÍS DE NASCIMENTO DO CONJUGE 1<br>COD-PAIS-NASC-CONJ1<br>CHAR<br>03|**25**<br>PAÍS DE NASCIMENTO DO CONJUGE 1<br>COD-PAIS-NASC-CONJ1<br>CHAR<br>03|**25**<br>PAÍS DE NASCIMENTO DO CONJUGE 1<br>COD-PAIS-NASC-CONJ1<br>CHAR<br>03|**25**<br>PAÍS DE NASCIMENTO DO CONJUGE 1<br>COD-PAIS-NASC-CONJ1<br>CHAR<br>03|
|**26**<br>UF DE NASCIMENTO DO CONJUGE 2<br>COD-UF-NASC-CONJ2<br>CHAR<br>02|**26**<br>UF DE NASCIMENTO DO CONJUGE 2<br>COD-UF-NASC-CONJ2<br>CHAR<br>02|**26**<br>UF DE NASCIMENTO DO CONJUGE 2<br>COD-UF-NASC-CONJ2<br>CHAR<br>02|**26**<br>UF DE NASCIMENTO DO CONJUGE 2<br>COD-UF-NASC-CONJ2<br>CHAR<br>02|**26**<br>UF DE NASCIMENTO DO CONJUGE 2<br>COD-UF-NASC-CONJ2<br>CHAR<br>02|
|**27**<br>PAÍS DE NASCIMENTO DO CONJUGE 2<br>COD-PAIS-NASC-CONJ2<br>CHAR<br>03|**27**<br>PAÍS DE NASCIMENTO DO CONJUGE 2<br>COD-PAIS-NASC-CONJ2<br>CHAR<br>03|**27**<br>PAÍS DE NASCIMENTO DO CONJUGE 2<br>COD-PAIS-NASC-CONJ2<br>CHAR<br>03|**27**<br>PAÍS DE NASCIMENTO DO CONJUGE 2<br>COD-PAIS-NASC-CONJ2<br>CHAR<br>03|**27**<br>PAÍS DE NASCIMENTO DO CONJUGE 2<br>COD-PAIS-NASC-CONJ2<br>CHAR<br>03|
|**28**<br>DATA DE NASCIMENTO DO CONJUGE 1<br>DATA-NASC-CONJ1<br>CHAR<br>08|**28**<br>DATA DE NASCIMENTO DO CONJUGE 1<br>DATA-NASC-CONJ1<br>CHAR<br>08|**28**<br>DATA DE NASCIMENTO DO CONJUGE 1<br>DATA-NASC-CONJ1<br>CHAR<br>08|**28**<br>DATA DE NASCIMENTO DO CONJUGE 1<br>DATA-NASC-CONJ1<br>CHAR<br>08|**28**<br>DATA DE NASCIMENTO DO CONJUGE 1<br>DATA-NASC-CONJ1<br>CHAR<br>08|
|**29**|DATA DE NASCIMENTO DO CONJUGE 2|DATA-NASC-CONJ2|CHAR|08|


IBGE – Registro Civil – Instruções para a geração dos arquivos dos Tabelionatos Informatizados – Pág: 5


|30|SEXO DO CONJUGE|1|SEXO-CONJ1|CHAR|01|
|---|---|---|---|---|---|
|**31**|SEXO DO CONJUGE|2|SEXO-CONJ2|CHAR|01|


**6.2** **- NORMA DE PREENCHIMENTO DOS CAMPOS DO ARQUIVO TABINF07.TXT**









|Nº NOME CAMPO DESCRIÇÃO|Col2|Col3|
|---|---|---|
|**1 **<br>**UF-PESQUISA**<br>**O valor desse campo será fornecido pelo IBGE.**|**1 **<br>**UF-PESQUISA**<br>**O valor desse campo será fornecido pelo IBGE.**|**1 **<br>**UF-PESQUISA**<br>**O valor desse campo será fornecido pelo IBGE.**|
|**2 **<br>**MUN-PESQUISA**<br>**O valor desse campo será fornecido pelo IBGE.**|**2 **<br>**MUN-PESQUISA**<br>**O valor desse campo será fornecido pelo IBGE.**|**2 **<br>**MUN-PESQUISA**<br>**O valor desse campo será fornecido pelo IBGE.**|
|**3 **<br>**DIST-PESQUISA**<br>**O valor desse campo será fornecido pelo IBGE.**|**3 **<br>**DIST-PESQUISA**<br>**O valor desse campo será fornecido pelo IBGE.**|**3 **<br>**DIST-PESQUISA**<br>**O valor desse campo será fornecido pelo IBGE.**|
|**4 **<br>**COD_CARTORIO**<br>**O valor desse campo será fornecido pelo IBGE.**|**4 **<br>**COD_CARTORIO**<br>**O valor desse campo será fornecido pelo IBGE.**|**4 **<br>**COD_CARTORIO**<br>**O valor desse campo será fornecido pelo IBGE.**|
|5 <br>ANO-PESQUISA<br>Preencher com os quatro dígitos do ano da pesquisa. Campo numérico de quatro posições.|5 <br>ANO-PESQUISA<br>Preencher com os quatro dígitos do ano da pesquisa. Campo numérico de quatro posições.|5 <br>ANO-PESQUISA<br>Preencher com os quatro dígitos do ano da pesquisa. Campo numérico de quatro posições.|
|6 <br>TRIM-PESQUISA<br>Preencher com o trimestre do registro do Divórcio Extrajudicial. Campo numérico de uma<br> <br>posição.Códigos válidos**: 1, 2, 3 e 4**.|6 <br>TRIM-PESQUISA<br>Preencher com o trimestre do registro do Divórcio Extrajudicial. Campo numérico de uma<br> <br>posição.Códigos válidos**: 1, 2, 3 e 4**.|6 <br>TRIM-PESQUISA<br>Preencher com o trimestre do registro do Divórcio Extrajudicial. Campo numérico de uma<br> <br>posição.Códigos válidos**: 1, 2, 3 e 4**.|
|7 <br>NUM-LIVRO<br>Preencher com o número do livro do registro do Divórcio Extrajudicial. Campo<br> <br>alfanumérico de doze posições.|7 <br>NUM-LIVRO<br>Preencher com o número do livro do registro do Divórcio Extrajudicial. Campo<br> <br>alfanumérico de doze posições.|7 <br>NUM-LIVRO<br>Preencher com o número do livro do registro do Divórcio Extrajudicial. Campo<br> <br>alfanumérico de doze posições.|
|8 <br>NUM-INICIAL-FOLHA<br>Preencher com o número da folha inicial do livro do registro do Divórcio Extrajudicial.<br> <br>Campo numérico de quatro posições.|8 <br>NUM-INICIAL-FOLHA<br>Preencher com o número da folha inicial do livro do registro do Divórcio Extrajudicial.<br> <br>Campo numérico de quatro posições.|8 <br>NUM-INICIAL-FOLHA<br>Preencher com o número da folha inicial do livro do registro do Divórcio Extrajudicial.<br> <br>Campo numérico de quatro posições.|
|9 <br>NUM-FINAL-FOLHA<br>Preencher com o número da folha final do livro do registro do Divórcio Extrajudicial.<br>**Quando existir somente o número da folha inicial, repeti-lo nesse campo**. Campo<br>numérico de quatro posições.|9 <br>NUM-FINAL-FOLHA<br>Preencher com o número da folha final do livro do registro do Divórcio Extrajudicial.<br>**Quando existir somente o número da folha inicial, repeti-lo nesse campo**. Campo<br>numérico de quatro posições.|9 <br>NUM-FINAL-FOLHA<br>Preencher com o número da folha final do livro do registro do Divórcio Extrajudicial.<br>**Quando existir somente o número da folha inicial, repeti-lo nesse campo**. Campo<br>numérico de quatro posições.|
|10<br>COMPL-FOLHA<br>Preencher com o número do complemento da folha do livro do registro do Divórcio<br>Extrajudicial. Campo numérico de uma posição.<br>Códigos válidos: **1 = Frente; 2 = Verso; 9 = Sem complemento**|10<br>COMPL-FOLHA<br>Preencher com o número do complemento da folha do livro do registro do Divórcio<br>Extrajudicial. Campo numérico de uma posição.<br>Códigos válidos: **1 = Frente; 2 = Verso; 9 = Sem complemento**|10<br>COMPL-FOLHA<br>Preencher com o número do complemento da folha do livro do registro do Divórcio<br>Extrajudicial. Campo numérico de uma posição.<br>Códigos válidos: **1 = Frente; 2 = Verso; 9 = Sem complemento**|
|11<br>DATA-ABERT-ESCRIT<br>Preencher com a data da abertura da escritura do registro do Divórcio Extrajudicial. Campo<br>numérico de oito posições.<br>Este campo deverá ser gravado da seguinte forma: DDMMAAAA (DIA, MÊS e ANO).|11<br>DATA-ABERT-ESCRIT<br>Preencher com a data da abertura da escritura do registro do Divórcio Extrajudicial. Campo<br>numérico de oito posições.<br>Este campo deverá ser gravado da seguinte forma: DDMMAAAA (DIA, MÊS e ANO).|11<br>DATA-ABERT-ESCRIT<br>Preencher com a data da abertura da escritura do registro do Divórcio Extrajudicial. Campo<br>numérico de oito posições.<br>Este campo deverá ser gravado da seguinte forma: DDMMAAAA (DIA, MÊS e ANO).|
|12|DATA-ATO-NOTARIAL|Preencher com a data do ato notarial do Divórcio Extrajudicial. Campo numérico de oito<br>posições. Obedecer os limites do trimestre anteriormente fornecido.<br>Este campo deverá ser gravado da seguinte forma: DDMMAAAA (DIA, MÊS e ANO).|


IBGE – Registro Civil – Instruções para a geração dos arquivos dos Tabelionatos Informatizados – Pág: 6


|13 DATA-CASAMENTO Preencher com a data do casamento. Campo numérico de oito posições.<br>Este campo deverá ser gravado da seguinte forma: DDMMAAAA (DIA, MÊS e ANO).|Col2|Col3|
|---|---|---|
|14<br>REGIME-BENS<br>Preencher com o código do regime de bens.<br>Códigos válidos: **1 = comunhão universal, 2 = comunhão parcial, 3 = separação e 9 =**<br>**sem declaração**. Campo numérico de uma posição.|14<br>REGIME-BENS<br>Preencher com o código do regime de bens.<br>Códigos válidos: **1 = comunhão universal, 2 = comunhão parcial, 3 = separação e 9 =**<br>**sem declaração**. Campo numérico de uma posição.|14<br>REGIME-BENS<br>Preencher com o código do regime de bens.<br>Códigos válidos: **1 = comunhão universal, 2 = comunhão parcial, 3 = separação e 9 =**<br>**sem declaração**. Campo numérico de uma posição.|
|15<br>NUM-FILHO-MAIOR<br>Preencher com o número de filhos maiores do casal. Campo numérico de duas posições.|15<br>NUM-FILHO-MAIOR<br>Preencher com o número de filhos maiores do casal. Campo numérico de duas posições.|15<br>NUM-FILHO-MAIOR<br>Preencher com o número de filhos maiores do casal. Campo numérico de duas posições.|
|16<br>NUM-FILHO-MENOR<br>Preencher com o número de filhos menores do casal. Campo numérico de duas posições.|16<br>NUM-FILHO-MENOR<br>Preencher com o número de filhos menores do casal. Campo numérico de duas posições.|16<br>NUM-FILHO-MENOR<br>Preencher com o número de filhos menores do casal. Campo numérico de duas posições.|
|17<br>COD-RESP-FILHO<br>Preencher com o responsável pela guarda dos filhos menores. Campo numérico de uma<br>posição.<br>Códigos válidos: **1 = cônjuge 1**, **2 = cônjuge 2**, **3 = ambos os cônjuges**, **4 = outro**<br> <br>**e 9 = sem declaração**.|17<br>COD-RESP-FILHO<br>Preencher com o responsável pela guarda dos filhos menores. Campo numérico de uma<br>posição.<br>Códigos válidos: **1 = cônjuge 1**, **2 = cônjuge 2**, **3 = ambos os cônjuges**, **4 = outro**<br> <br>**e 9 = sem declaração**.|17<br>COD-RESP-FILHO<br>Preencher com o responsável pela guarda dos filhos menores. Campo numérico de uma<br>posição.<br>Códigos válidos: **1 = cônjuge 1**, **2 = cônjuge 2**, **3 = ambos os cônjuges**, **4 = outro**<br> <br>**e 9 = sem declaração**.|
|18<br>COD-UF-RES-CONJ1<br>Preencher com o código da Unidade da Federação de Residência do CONJ1 de acordo com<br>a Tabela de Unidades da Federação do IBGE. Campo alfanumérico de duas posições.<br>Códigos válidos: - Ver regras de preenchimento no item 10 e orientações no item 11.|18<br>COD-UF-RES-CONJ1<br>Preencher com o código da Unidade da Federação de Residência do CONJ1 de acordo com<br>a Tabela de Unidades da Federação do IBGE. Campo alfanumérico de duas posições.<br>Códigos válidos: - Ver regras de preenchimento no item 10 e orientações no item 11.|18<br>COD-UF-RES-CONJ1<br>Preencher com o código da Unidade da Federação de Residência do CONJ1 de acordo com<br>a Tabela de Unidades da Federação do IBGE. Campo alfanumérico de duas posições.<br>Códigos válidos: - Ver regras de preenchimento no item 10 e orientações no item 11.|
|19<br>COD-MUN-RES-CONJ1<br>Preencher com o código do Município de Residência do CONJ1 de acordo com a Tabela de<br> <br>Municípios do IBGE. Campo alfanumérico de cinco posições. Ver orientações no item 11.|19<br>COD-MUN-RES-CONJ1<br>Preencher com o código do Município de Residência do CONJ1 de acordo com a Tabela de<br> <br>Municípios do IBGE. Campo alfanumérico de cinco posições. Ver orientações no item 11.|19<br>COD-MUN-RES-CONJ1<br>Preencher com o código do Município de Residência do CONJ1 de acordo com a Tabela de<br> <br>Municípios do IBGE. Campo alfanumérico de cinco posições. Ver orientações no item 11.|
|20<br>COD-PAIS-RES-CONJ1<br>Preencher com o código do País de Residência do CONJ1, quando o COD-UF-RES-CONJ1<br>for igual a**98,**de acordo com a Tabela de Países da ONU. Campo alfanumérico de três<br>posições. Códigos válidos: - Ver regras de preenchimento no item 10 e orientações no item<br>12.|20<br>COD-PAIS-RES-CONJ1<br>Preencher com o código do País de Residência do CONJ1, quando o COD-UF-RES-CONJ1<br>for igual a**98,**de acordo com a Tabela de Países da ONU. Campo alfanumérico de três<br>posições. Códigos válidos: - Ver regras de preenchimento no item 10 e orientações no item<br>12.|20<br>COD-PAIS-RES-CONJ1<br>Preencher com o código do País de Residência do CONJ1, quando o COD-UF-RES-CONJ1<br>for igual a**98,**de acordo com a Tabela de Países da ONU. Campo alfanumérico de três<br>posições. Códigos válidos: - Ver regras de preenchimento no item 10 e orientações no item<br>12.|
|21<br>COD-UF-RES-CONJ2<br>Preencher com o código da Unidade da Federação de Residência do CONJ2 de acordo com<br>a Tabela de Unidades da Federação do IBGE. Campo alfanumérico de duas posições.<br>Códigos válidos: - Ver regras de preenchimento no item 10 e orientações no item 11.|21<br>COD-UF-RES-CONJ2<br>Preencher com o código da Unidade da Federação de Residência do CONJ2 de acordo com<br>a Tabela de Unidades da Federação do IBGE. Campo alfanumérico de duas posições.<br>Códigos válidos: - Ver regras de preenchimento no item 10 e orientações no item 11.|21<br>COD-UF-RES-CONJ2<br>Preencher com o código da Unidade da Federação de Residência do CONJ2 de acordo com<br>a Tabela de Unidades da Federação do IBGE. Campo alfanumérico de duas posições.<br>Códigos válidos: - Ver regras de preenchimento no item 10 e orientações no item 11.|
|22<br>COD-MUN-RES- CONJ2<br>Preencher com o código do Município de Residência do CONJ2 de acordo com a Tabela de<br> <br>Municípios do IBGE. Campo alfanumérico de cinco posições. Ver orientações no item 11.|22<br>COD-MUN-RES- CONJ2<br>Preencher com o código do Município de Residência do CONJ2 de acordo com a Tabela de<br> <br>Municípios do IBGE. Campo alfanumérico de cinco posições. Ver orientações no item 11.|22<br>COD-MUN-RES- CONJ2<br>Preencher com o código do Município de Residência do CONJ2 de acordo com a Tabela de<br> <br>Municípios do IBGE. Campo alfanumérico de cinco posições. Ver orientações no item 11.|
|23|COD-PAIS-RES- CONJ2|Preencher com o código do País de Residência do CONJ2, quando o COD-UF-RES-CONJ2<br>for igual a**98,**de acordo com a Tabela de Países da ONU. Campo alfanumérico de três<br>posições. Códigos válidos: - Ver regras de preenchimento no item 10 e orientações no item<br>12.|


IBGE – Registro Civil – Instruções para a geração dos arquivos dos Tabelionatos Informatizados – Pág: 7


|24 COD-UF-NASC- CONJ1 Preencher com o código da Unidade da Federação de Nascimento do CONJ1 de acordo com<br>a Tabela de Unidades da Federação do IBGE. Campo alfanumérico de duas posições.<br>Códigos válidos: - Ver regras de preenchimento no item 10 e orientações no item 11.|Col2|Col3|
|---|---|---|
|25<br>COD-PAIS-NASC- CONJ1<br>Preencher com o código do País de Nascimento do CONJ1, quando o COD-UF-NASC-<br>CONJ1 for igual a**98,**de acordo com a Tabela de Países da ONU. Campo alfanumérico de<br>três posições. Códigos válidos: - Ver regras de preenchimento no item 10 e orientações no<br>item 12.|25<br>COD-PAIS-NASC- CONJ1<br>Preencher com o código do País de Nascimento do CONJ1, quando o COD-UF-NASC-<br>CONJ1 for igual a**98,**de acordo com a Tabela de Países da ONU. Campo alfanumérico de<br>três posições. Códigos válidos: - Ver regras de preenchimento no item 10 e orientações no<br>item 12.|25<br>COD-PAIS-NASC- CONJ1<br>Preencher com o código do País de Nascimento do CONJ1, quando o COD-UF-NASC-<br>CONJ1 for igual a**98,**de acordo com a Tabela de Países da ONU. Campo alfanumérico de<br>três posições. Códigos válidos: - Ver regras de preenchimento no item 10 e orientações no<br>item 12.|
|26<br>COD-UF-NASC- CONJ2<br>Preencher com o código da Unidade da Federação de Nascimento do CONJ2 de acordo com<br>a Tabela de Unidades da Federação do IBGE. Campo alfanumérico de duas posições.<br>Códigos válidos: - Ver regras de preenchimento no item 10 e orientações no item 11.|26<br>COD-UF-NASC- CONJ2<br>Preencher com o código da Unidade da Federação de Nascimento do CONJ2 de acordo com<br>a Tabela de Unidades da Federação do IBGE. Campo alfanumérico de duas posições.<br>Códigos válidos: - Ver regras de preenchimento no item 10 e orientações no item 11.|26<br>COD-UF-NASC- CONJ2<br>Preencher com o código da Unidade da Federação de Nascimento do CONJ2 de acordo com<br>a Tabela de Unidades da Federação do IBGE. Campo alfanumérico de duas posições.<br>Códigos válidos: - Ver regras de preenchimento no item 10 e orientações no item 11.|
|27<br>COD-PAIS-NASC- CONJ2<br>Preencher com o código do País de Nascimento do CONJ2, quando o COD-UF-NASC-<br>CONJ2 for igual a**98,**de acordo com a Tabela de Países da ONU. Campo alfanumérico de<br>três posições. Códigos válidos: - Ver regras de preenchimento no item 10 e orientações no<br>item 12.|27<br>COD-PAIS-NASC- CONJ2<br>Preencher com o código do País de Nascimento do CONJ2, quando o COD-UF-NASC-<br>CONJ2 for igual a**98,**de acordo com a Tabela de Países da ONU. Campo alfanumérico de<br>três posições. Códigos válidos: - Ver regras de preenchimento no item 10 e orientações no<br>item 12.|27<br>COD-PAIS-NASC- CONJ2<br>Preencher com o código do País de Nascimento do CONJ2, quando o COD-UF-NASC-<br>CONJ2 for igual a**98,**de acordo com a Tabela de Países da ONU. Campo alfanumérico de<br>três posições. Códigos válidos: - Ver regras de preenchimento no item 10 e orientações no<br>item 12.|
|28<br>DATA-NASC- CONJ1<br>Preencher com a data de nascimento do Cônjuge 1. Campo numérico de oito posições. Este<br> <br>campo deverá ser gravado da seguinte forma: DDMMAAAA (DIA, MÊS e ANO).|28<br>DATA-NASC- CONJ1<br>Preencher com a data de nascimento do Cônjuge 1. Campo numérico de oito posições. Este<br> <br>campo deverá ser gravado da seguinte forma: DDMMAAAA (DIA, MÊS e ANO).|28<br>DATA-NASC- CONJ1<br>Preencher com a data de nascimento do Cônjuge 1. Campo numérico de oito posições. Este<br> <br>campo deverá ser gravado da seguinte forma: DDMMAAAA (DIA, MÊS e ANO).|
|29<br>DATA-NASC- CONJ2<br>Preencher com a data de nascimento do Cônjuge 2. Campo numérico de oito posições. Este<br> <br>campo deverá ser gravado da seguinte forma: DDMMAAAA (DIA, MÊS e ANO).|29<br>DATA-NASC- CONJ2<br>Preencher com a data de nascimento do Cônjuge 2. Campo numérico de oito posições. Este<br> <br>campo deverá ser gravado da seguinte forma: DDMMAAAA (DIA, MÊS e ANO).|29<br>DATA-NASC- CONJ2<br>Preencher com a data de nascimento do Cônjuge 2. Campo numérico de oito posições. Este<br> <br>campo deverá ser gravado da seguinte forma: DDMMAAAA (DIA, MÊS e ANO).|
|30<br>SEXO- CONJ1<br>Preencher com o sexo do Cônjuge 1. Campo numérico de uma posição.<br> <br>Códigos válidos: **1 = masculino e 2 = feminino**.|30<br>SEXO- CONJ1<br>Preencher com o sexo do Cônjuge 1. Campo numérico de uma posição.<br> <br>Códigos válidos: **1 = masculino e 2 = feminino**.|30<br>SEXO- CONJ1<br>Preencher com o sexo do Cônjuge 1. Campo numérico de uma posição.<br> <br>Códigos válidos: **1 = masculino e 2 = feminino**.|
|31|SEXO- CONJ2|Preencher com o sexo do Cônjuge 2. Campo numérico de uma posição.<br> <br>Códigos válidos: **1 = masculino e 2 = feminino**.|


IBGE – Registro Civil – Instruções para a geração dos arquivos dos Tabelionatos Informatizados – Pág: 8


**7** **- ARQUIVO PARA CONTROLE DO IBGE**


Criar um arquivo físico chamado **CONTROLE.SIS,** com tamanho igual a 0 **byte (sem informação),** que servirá para


- IBGE identificar o novo arquivo TABINF.ZIP.


**8** **- TAMANHO DOS REGISTROS**


Os registros dos arquivos **TABINF07.TXT, TABINF12.TXT e CONTROLE.SIS** deverão possuir obrigatoriamente


- tamanho especificado na tabela abaixo:

|NOME DOS ARQUIVOS TAMANHO DO REGISTRO|Col2|
|---|---|
|TABINF**07**.TXT<br>**121**bytes|TABINF**07**.TXT<br>**121**bytes|
|TABINF**12**.TXT<br>**26**bytes|TABINF**12**.TXT<br>**26**bytes|
|CONTROLE.SIS|**0 **byte|



**9-** **REGRAS PARA O PREENCHIMENTO DOS CAMPOS NUMÉRICOS, ALFANUMÉRICOS E SEM VALOR**


Para que todos os registros possuam o mesmo tamanho é necessário que os registros sejam gravados nos arquivos de acordo
com as orientações descritas abaixo:


  - Quando o campo for **numérico** e o seu respectivo valor menor que o tamanho do campo, então deverão ser
acrescentados **os zeros à esquerda** .


  - Quando o campo for **alfanumérico** e o seu respectivo valor menor que o tamanho do campo, então deverão ser
acrescentados **os espaços em branco à direita** .


  - Quando **não houver valor** para qualquer campo numérico, então preenchê-lo com o valor **9** de acordo com o tamanho
definido na estrutura do arquivo.


**Ex:** DATA-NASC-CONJ1 (tamanho 08) = 99999999


IBGE – Registro Civil – Instruções para a geração dos arquivos dos Tabelionatos Informatizados – Pág: 9


**10** **– REGRAS PARA O PREENCHIMENTO DOS CAMPOS DE UF, MUNICÍPIO E PAÍS**


É necessário que os campos de UF, Município e País sejam gravados de acordo com os códigos existentes nas Tabelas de
Unidades de Federação e de Municípios do IBGE e de Países da ONU obedecendo as regras descritas abaixo.


**OBS:** Não utilizar o código **076** da Tabela de Países da ONU. Deverá ser utilizado o código **999** conforme descrito abaixo.






|UF MUNICÍPIO PAÍS|Col2|Col3|Col4|
|---|---|---|---|
|**Regra 1**<br>**= 98 (Estrangeiro)**<br>**99999 (Ignorado)**<br>**Código do País existente no Território**<br>**Mundial (Tabela ONU)**<br>**ou**<br>**999 (Ignorado)**|**Regra 1**<br>**= 98 (Estrangeiro)**<br>**99999 (Ignorado)**<br>**Código do País existente no Território**<br>**Mundial (Tabela ONU)**<br>**ou**<br>**999 (Ignorado)**|**Regra 1**<br>**= 98 (Estrangeiro)**<br>**99999 (Ignorado)**<br>**Código do País existente no Território**<br>**Mundial (Tabela ONU)**<br>**ou**<br>**999 (Ignorado)**|**Regra 1**<br>**= 98 (Estrangeiro)**<br>**99999 (Ignorado)**<br>**Código do País existente no Território**<br>**Mundial (Tabela ONU)**<br>**ou**<br>**999 (Ignorado)**|
|**Regra 2**<br>**= 59 (Brasil)**<br>**99999 (Ignorado)**<br>**999 (Ignorado)**|**Regra 2**<br>**= 59 (Brasil)**<br>**99999 (Ignorado)**<br>**999 (Ignorado)**|**Regra 2**<br>**= 59 (Brasil)**<br>**99999 (Ignorado)**<br>**999 (Ignorado)**|**Regra 2**<br>**= 59 (Brasil)**<br>**99999 (Ignorado)**<br>**999 (Ignorado)**|
|**Regra 3**<br>**= 99 (Ignorado)**<br>**99999 (Ignorado)**<br>**999 (Ignorado)**|**Regra 3**<br>**= 99 (Ignorado)**<br>**99999 (Ignorado)**<br>**999 (Ignorado)**|**Regra 3**<br>**= 99 (Ignorado)**<br>**99999 (Ignorado)**<br>**999 (Ignorado)**|**Regra 3**<br>**= 99 (Ignorado)**<br>**99999 (Ignorado)**<br>**999 (Ignorado)**|
|**Regra 4**|**<> (98, 59, 99)**|**Código do Município existente no**<br>**Território Nacional (Tabela IBGE)**<br>**ou**<br>**99999 (Ignorado)**|**999 (Ignorado)**|










|Regra 1 Se UF = 98 Então MUNICÍPIO = 99999 e PAÍS = Código do País existente no<br>Território Mundial (Tabela ONU) ou 999<br>Regra 2 Se UF = 59 Então MUNICÍPIO = 99999 e PAÍS = 999<br>Regra 3 Se UF = 99 Então MUNICÍPIO = 99999 e PAÍS = 999<br>Regra 4 Se UF <> (98, 59, 99) Então MUNICÍPIO = Código e PAÍS = 999<br>do Município existente no<br>Território Nacional (Tabela<br>IBGE) ou 99999|Col2|Col3|Col4|
|---|---|---|---|
|**Regra 1** <br>**Se UF = 98** <br>**Então MUNICÍPIO = 99999      e PAÍS = Código do País existente no**<br>**Território Mundial (Tabela ONU) ou 999** <br> <br>**Regra 2** <br>**Se UF = 59** <br>**Então MUNICÍPIO = 99999**<br>**e PAÍS =  999** <br>**Regra 3** <br>**Se UF = 99** <br>**Então MUNICÍPIO = 99999**<br>**e PAÍS =  999** <br>**Regra 4** <br>**Se UF <> (98, 59, 99)**<br>**Então MUNICÍPIO = Código**<br>**do Município existente no**<br>**Território Nacional (Tabela**<br>**IBGE) ou 99999**<br>**e PAÍS =  999**|**Se UF <> (98, 59, 99)**|<br>**Então MUNICÍPIO = Código**<br>**do Município existente no**<br>**Território Nacional (Tabela**<br>**IBGE) ou 99999**|**e PAÍS =  999**|



IBGE – Registro Civil – Instruções para a geração dos arquivos dos Tabelionatos Informatizados – Pág: 10


**11** **– ORIENTAÇÕES PARA BAIXAR A TABELA DE MUNICÍPIOS DO IBGE**


**Passo 1** Acessar a Página do **IBGE (http://www.ibge.gov.br)** .


**Passo 2** No menu superior da Página, clicar em **Estatísticas**, no título **POR TEMA > SOCIAIS**, clicar em **População** . Nas
opções do título **Principais produtos deste tema**, clicar em **Sistema de** **Estatísticas Vitais** .


**Passo 3** Na Página do **Sistema de Estatísticas Vitais**, clicar em **Outras informações** que fica no menu lateral esquerdo,
conforme mostra a figura abaixo, e escolher **Códigos de municípios e países.** Para fazer o download do arquivo com os códigos
dos municípios clicar no link **“Tabela de Códigos de Municípios”** localizado à direita da tela **.**


**Passo 4** Após clicar no link **“Tabela de Códigos de Municípios”**, clicar em **“Download da tabela de códigos”** e o arquivo
**dtb_2018.zip** será baixado. Aparecerão seis arquivos quando aberto o zip. Para utilizar os códigos de **uf** e **município**, escolher
entre o arquivo RELATORIO_DTB_BRASIL_MUNICIPIO de formato BrOffice ou Excel, conforme figura abaixo.


IBGE – Registro Civil – Instruções para a geração dos arquivos dos Tabelionatos Informatizados – Pág: 11


Deverão ser utilizadas as variáveis **UF** (coluna A) com 02 dígitos e **Município** (coluna G) com 05 dígitos.


**12- ORIENTAÇÕES PARA BAIXAR A TABELA DE PAÍSES DA ONU ATRAVÉS DO SITE DO IBGE**


**Passo 1** Acessar a Página do **IBGE** ( **http://www.ibge.gov.br** ).


**Passo 2** No menu superior da Página, clicar em **Estatísticas**, em seguida **POR TEMA > SOCIAIS**, clicar em **População** . Nas
opções do título **Principais produtos deste tema**, clicar em **Sistema de Estatísticas Vitais** .


**Passo 3** Na Página do **Sistema de Estatísticas Vitais**, clicar em **Outras informações** que fica no menu lateral esquerdo,
conforme mostra a figura abaixo, e escolher **Códigos de municípios e países.** Para fazer o download do arquivo com os códigos
de países clicar à direita da tela no link **“Download da lista de países e territórios em português(xls/ods)”** . A lista em inglês
poderá ser obtida na Página da ONU. Ao clicar no link **“site da Organização das Nações Unidas”,** localizado à direita da tela, a
página será exibida.


IBGE – Registro Civil – Instruções para a geração dos arquivos dos Tabelionatos Informatizados – Pág: 12
