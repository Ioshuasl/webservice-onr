**==> picture [341 x 179] intentionally omitted <==**

## **MANUAL DE RECOMENDAÇÕES TÉCNICAS** 

## **ESPECIFICAÇÕES DE INTERFACE DE CARGA** 

## **Versão 7.4** 

Janeiro de 2026 

--- end of page.page_number=1 ---

P á g i n a | 2 

## SIRC – Sistema Nacional de Informação de Registro Civil 

## **Histórico de Revisões** 

|**Data**|**Versão**|**Descrição**|**Autor**|
|---|---|---|---|
|25/08/2010|1.0|Elaboração inicial do documento.|Dataprev (SC)|
|25/08/2010|1.0|Elaboração inicial do documento.|Dataprev (SC)|
|28/09/2010|1.1|Alterações de layout de XML, XSD.<br>Complementação de regras.|Dataprev (SC)|
|28/12/2010|1.2|Alterações de layout de XML, XSD.<br>Complementação e Alteração de regras<br>referentes à reivindicação feita pelos<br>representantes das serventias.|Dataprev (SC)|
|04/01/2011|1.3|Atualização de WSDL.|Dataprev (SC)|
|21/03/2011|1.4|Inclusão de dados referentes aos registros de<br>óbito.|Dataprev (SC)|
|29/03/2011|1.5|Adição de informações complementares.|Dataprev (SC)|
|27/04/2011|1.6|Atualização da tabela de municípios (IBGE<br>2009), alteração de XSD de Óbito (Tag<br>documentosDeclaranteIngorado alterada para<br>documentosDeclaranteIgnorado).|Dataprev (SC)|
|09/06/2011|1.7|Alterações de layout de XML, XSD.<br>Complementação e Alteração de regras<br>referentes à reivindicação feita pelos<br>representantes das serventias. Adição de<br>capítulo notas de versão.|Dataprev (SC)|
|13/07/2011|1.8|Atualização de XSD de Nascimento (Validações<br>do conteúdo dos campos), XSD de Óbito<br>(Retirada de um dos campos de observação<br>que estava em duplicidade; Validações do<br>conteúdo dos campos) e XSD de Casamento<br>(Validações do conteúdo dos campos).<br>Atualização de RN sobre registro de Natimorto.|Dataprev (SC)|
|19/08/2011|1.9|Atualização de XSD de Nascimento, Óbito e<br>Casamento (Adição de campo para validação da<br>versão do layout do XML).<br>Alteração de XSD de Óbito (Tag<br>documentosDeclaranteIgnorado retirada).|Dataprev (SC)|



--- end of page.page_number=2 ---

P á g i n a | 3 

SIRC – Sistema Nacional de Informação de Registro Civil 

|24/11/2011|2.0|Atualização de endereço do Web Service.|Dataprev (SC)|
|---|---|---|---|
|09/04/2012|2.1|Correção de inconsistência nos algoritmos de<br>validação da DO e DNV.|Dataprev (SC)|
|08/05/2012|2.2|Alterações de layout de XML, XSD.<br>Complementação e Alteração de regras referentes<br>à inclusão de Registros Civis Judiciais.|Dataprev (SC)|
|04/06/2012|2.3|Alterações de layout de XML, XSD.<br>Complementação e Alteração de regras referentes<br>à manutenção de Impressos de Segurança em<br>Registros Civis.|<br>Dataprev (SC)|
|12/07/2012|2.4|Utilização do Gerid para autenticação e<br>autorização de usuários e Alteração no<br>Padrão de Criptografia do Arquivo.|Dataprev (SC)|
|14/01/2013|2.5|Inclusão da utilização de certificado digital para<br>autenticação no Web Service disponibilizado<br>pelo Sirc.|Dataprev (SC)|
|18/04/2013|2.6|Revisão de regras: Data de Nascimento dos<br>Registrados; Data de Óbito dos Registrados; Data<br>proclamas; Data em Cujas Notas Foi Tomada a<br>Escritura Ante-Nupcial; Data de Falecimento dos<br>Genitores do Cônjuge; Data da celebração do<br>casamento.|Dataprev (SC)|
|16/10/2013|2.7|Alteração dos endereços de acesso ao sistema e<br>Web Services; atualização do retorno SOAP dos<br>serviços disponibilizados (WebServices).|Dataprev (SC)|
|06/12/2013|2.8|Atualização da regra de validação de nomes;<br>Integração com CER; Atualização do XSD;<br>Atualização dos exemplos; Alteração do WSDL.|Dataprev (SC)|
|25/07/2014|2.9|Atualização de regras de validação; Inclusão de<br>regras referentes aos registros civis efetuados no<br>exterior; Inclusão do conceito de<br>multiparentalidade nos registros civis;<br>Atualização nos campos de registros civis;<br>Atualização dos XSD; Atualização dos exemplos de<br>acordo com as novas versões dos XSD; Atualização<br>do Anexo I; Retrocompatibilidade entre versões;<br>Inclusão de itens na seção de Dúvidas Frequentes;|<br> <br> <br>Dataprev (SC)|



--- end of page.page_number=3 ---

P á g i n a | 4 

SIRC – Sistema Nacional de Informação de Registro Civil 

|21/05/2015|3.0|Atualização de itens nas seguintes seções:<br>Acesso das Serventias ao SIRC, Descrição<br>Simplificada do Modelo Operacional, Padrão de<br>Documento XML, Padrão de Comunicação e<br>Transferência de Arquivo de Movimento.|Dataprev<br>(SC) INSS<br>(DF)|
|---|---|---|---|
|09/07/2015|3.1|Índice; Introdução; Descrição Simplificada do<br>Modelo Operacional: Acesso das Serventias ao<br>SIRC; Web Services; Serviços Síncronos; Envio de<br>Arquivos para o SIRC-Web; Envio de Registros<br>Civis para o SIRC via Web Service; Especificações<br>Técnicas das Interfaces: Tratamento de<br>Caracteres Especiais no Texto de XML; Padrão de<br>Compactação do Arquivo; Padrão de<br>Comunicação; Regras de Validação: Registro de<br>Casamento; Regras de Negócio: Registro de<br>Nascimento; Registro de Casamento; Registro<br>de Óbito; Conteúdo do Arquivo do Movimento:<br>Registro de Nascimento; Registro de Óbito;<br>Registro de Casamento; Dúvidas Frequentes:<br>Preenchimento de campos ignorados; Onde<br>Encontrar Ajuda; Anexos: Município; Anexo IV –<br>Comprovante de Envio de Arquivo (Registro de<br>Nascimento) (renumerado); Anexo V – Relatório<br>de Processamento de Registros (Registro de<br>Nascimento) (renumerado); Anexo VI - JAXB<br>(Java Architecture for XML Binding)<br>(renumerado); Anexo VII – TB0400 – Pequenas<br>Tabelas / 02 –Órgão Emissor (renumerado);<br>Anexo VIII - TB0400 – Pequenas Tabelas / 35 –<br>Tipo de Documento Civil (renumerado); Anexo IX<br>– WSDL (Web Service Definition Language) -<br>Descritor Web Service (renumerado); Anexo X –<br>Validação de DNV(renumerado); Anexo XI –<br>Validação de DO (renumerado); Anexo XII –<br>Comprovante de Envio de Arquivo (Registro<br>de Óbito) (renumerado); Anexo XIII – Relatório de<br>Processamento de Registros (Registro de Óbito)<br>(renumerado); Anexo XIV – Comprovante de Envio<br>de Arquivo (Registro de Casamento)<br>(renumerado); Anexo XV – Relatório de<br>Processamento de Registros (Registro de<br>Casamento) (renumerado); Anexo XVI – Certidões<br>Unificadas (suprimido)Anexo XVI – Integração Sirc<br>/ CER (Centralizadora de Envio de Registros)<br>(renumerado); Anexo XVII – Retrocompatilidade<br>entre versões (renumerado)|<br>Dataprev<br>(DF) INSS<br>(DF)|



--- end of page.page_number=4 ---

P á g i n a | 5 

SIRC – Sistema Nacional de Informação de Registro Civil 

|05/01/2016|3.2|Correção de Regime de Casamento de Participação<br>Final Aquestros para Participação Final Aquestos.|Dataprev (SC)|
|---|---|---|---|
|10/10/2016|3.2.1|Atualização da regra de validação de nomes;<br>Atualização de regras de negócio – Sexo da filiação|Dataprev (SC)|
|06/05/2016|3.3|Declaração de Inexistência de Movimento por<br>web service|Dataprev (SC)|
|19/09/2016|3.4|Introdução do layout XSD do serviço de<br>Cancelamento; Exemplo de layout de movimento de<br>cancelamento; Exemplo de layout de Relatório de<br>Processamento do cancelamento; Correção do<br>Índice;|Dataprev (SC)|
|07/12/2016|3.4.1|Descrição Simplificada do Modelo Operacional -<br>Acesso das Serventias ao SIRC; Atualização do<br>MovimentoObitoTO.xsd|Dataprev (SC)|
|10/2/2017|3.5|Alterados layouts XSD de movimento: 1) CPF para<br>registro de nascimento e 2) indicativo para nomes<br>especiais.<br>Alterada a regra de nomes que serão aceitos nos<br>registros civis.|Dataprev (SC)|
|28/03/2017|3.5.1|Inserção de avisos de atenção na regra de negócio<br>5.7 – Cancelamento de Termos e foi adicionado no<br>Anexo II a Tabela CBO-CNIS.<br>Foi incluída a seção com explicações e<br>esclarecimentos sobre o envio de declaração de<br>Inexistência item 5.8.<br>Modificado o Anexo II – Tabela de Profissões, com a<br>inclusão da tabela de CBO-CNIS.|Dataprev (SC)|
|18/04/2018|3.5.2|Foi trocado o tipoServico de 1 para 55 na seção<br>7.5 Exemplo 5 – Termo Cancelado (versão 1.0).|Dataprev (SC)|
|12/12/2019|4.0|Inclusão de Anotações, Averbações e Retificações;<br>Inclusão de Documentos para Filiação de Óbito<br>(natimorto); * Para o tipo de livro 4, a informação é<br>opcional;<br>Inclusão de Data de Nascimento para Filiação de<br>Óbito (natimorto); * Para o tipo de livro 4, a<br>informação é opcional;|Dataprev (SC)|



--- end of page.page_number=5 ---

P á g i n a | 6 

## SIRC – Sistema Nacional de Informação de Registro Civil 

|||Inclusão de Marcador de CPF Ignorado para o CPF do<br>nascido;<br>Inclusão de Marcador de Filiações com Nomes Iguais<br>para todos os tipos de registro;<br>Inclusão de Marcador de Cônjuges com Nomes<br>Iguais para os registros de casamento;<br>Inclusão de Marcador de CPF Ignorado para os<br>documentos de todos os tipos de registro;<br>Inclusão de Marcador de Outros Documentos<br>Ignorados para os documentos de todos os tipos de<br>registro;<br>Inclusão de Justificativa de Não Preenchimento de<br>Campos Obrigatórios (opcional).||
|---|---|---|---|
|15/04/2020|4.1|Inclusão de exemplos em 7 Layout XML do<br>Movimento|Dataprev (SC)|
|06/05/2020|5.0|- Alteração de Marcador de Data de Nascimento<br>Ignorada para a Data de Nascimento do nascido;<br>- Alteração de Marcador de Município de<br>Nascimento Ignorado para o Município de<br>Nascimento do nascido;<br>- Alteração de XSD de Nascimento (inseridas as<br>Tags codigoIBGEMunicipioIgnorado e<br>dataNascimentoIgnorada);<br>- Alteração de layouts XML de exemplos de<br>Nascimento (inseridas as Tags<br>codigoIBGEMunicipioIgnorado e<br>dataNascimentoIgnorada);<br>- Atualização das Versões do XSD e XML de exemplos<br>para 3.1;<br>- Ajustes nos Tipos de Registros Judiciais tal registro<br>já será considerado Justificado;<br>- Alterado o conceito de Termo, podendo existir<br>termos repetidos;<br>- Alterada a Descrição do Cancelamento de Termo e<br>Reverter Cancelamento de Termo;<br> -Inclusão em Notas da Versão o Item 9.2 Versão 5.0.<br>- Foi trocado o tipoServico de 1 para 55 na seção 7.5<br>Exemplo 5 – Termo Cancelado (versão 1.1).|Dataprev (SC)|



--- end of page.page_number=6 ---

P á g i n a | 7 

SIRC – Sistema Nacional de Informação de Registro Civil 

|15/03/2021|6.0|Alteração do tamanho dos dados complementares<br>da averbação.<br>Inclusão do tipo de documento ‘Matrícula da<br>Certidão de Casamento’.<br>Inclusão dos códigos de justificativa de não<br>preenchimento de campos obrigatórios (opcional).|Dataprev (SC)|
|---|---|---|---|
|01/12/2023|7.0|1 – Alteração do XSD de movimento de casamento p/ a<br>versão layout 4.2, onde o “CANCELAMENTO” foi incluído<br>no domínio do motivoAverbacaoCasamento.<br>2 – Formatações diversas para melhor visualização.<br>3 – Pequenas correções de ortografia e gramática.|Dataprev (SC)|
|25/04/2025|7.1|1 – Alteração do XSD de movimento de nascimento,<br>casamento e óbito p/ aversão layout 4.3.<br>2 – Atualização dos nomes especiais.|Dataprev (SC)|
|25/06/2025|7.2|1 – Alterado os valores de domínio dos campos de<br>sexo dos registros civis de: nascimento, casamento e<br>óbito.<br>2 – Alterado a tabela de Motivos de Averbações dos<br>registros civis de: nascimento, casamento e óbito|<br>Dataprev (SC)|
|04/11/2025|7.3|1 - Alteração do XSD de movimento de nascimento,<br>casamento e óbito p/ a versão layout 4.6.<br>2 - Registro de Nascimento: incluídos os campos: uf<br>do município de naturalidade, município de<br>naturalidade (IBGE) e município de naturalidade<br>(texto) para o nascido; incluídos os campos "sexo<br>ignorado" e "gênero" para o nascido; incluído o<br>campo gênero para filiação e progenitor; incluídas as<br>opções para sexo: "NAO_BINARIO", "OUTROS" e<br>"NAO_DECLARADO" e incluído campo “dados<br>complementares" para averbação, anotação e<br>retificação.<br>3 - Registro de Casamento: incluídos campos "sexo<br>ignorado" e "gênero" para os cônjuges; incluído<br>campo "gênero" para filiações dos cônjuges; incluídas<br>as opções para sexo dos cônjuges: "NAO_BINARIO",<br>"OUTROS" e "NAO_DECLARADO"; incluídas as opções<br>para “regime casamento”: "COMUNHAO_GERAL" e<br>"REGIME_HIBRIDO" e incluído campo “dados<br>complementares" para averbação, anotação e<br>retificação.<br>4 - Registro de Óbito: incluído campo "gênero" para<br>falecido e filiações; incluídas as opções para sexo:<br>"NAO_BINARIO", "OUTROS" e "NAO_DECLARADO" e<br>incluído campo “dados complementares" para<br>averbação, anotação e retificação.|<br> <br>Dataprev (SC)|



--- end of page.page_number=7 ---

P á g i n a | 8 

|P á g i n a| 8|P á g i n a| 8|P á g i n a| 8|P á g i n a| 8|
|---|---|---|---|
|SIRC–Sistema Nacional de Informação de Registro Civil<br>06/01/2026<br>7.4<br>1 - Diretrizes Técnicas para Registros Civis Legados:<br>Matrícula,<br>Campos<br>Obrigatórios<br>e<br>Ignorados,<br>Competência do Registro, Campos “Nome”, Campos<br>“Data”,<br>Sessão<br>“Dados<br>Gerais”,<br>Campos<br>“UF/Municípios”, Campos Enumerados, Anotações,<br>Averbações<br>e<br>Retificações,<br>Qualidade<br>de<br>Preenchimento de Dados Obrigatórios, Registros Fora<br>do Prazo, Validações de Documentos e Regras do<br>WebService.<br>Dataprev (CE)||||
||<br>7.4|<br>1 - Diretrizes Técnicas para Registros Civis Legados:<br>Matrícula,<br>Campos<br>Obrigatórios<br>e<br>Ignorados,<br>Competência do Registro, Campos “Nome”, Campos<br>“Data”,<br>Sessão<br>“Dados<br>Gerais”,<br>Campos<br>“UF/Municípios”, Campos Enumerados, Anotações,<br>Averbações<br>e<br>Retificações,<br>Qualidade<br>de<br>Preenchimento de Dados Obrigatórios, Registros Fora<br>do Prazo, Validações de Documentos e Regras do<br>WebService.|<br><br> <br> <br> <br><br> <br> <br>Dataprev (CE)|



--- end of page.page_number=8 ---

P á g i n a | 9 

## SIRC – Sistema Nacional de Informação de Registro Civil 

## **Índice** 

|1|Introdução ........................................................................................................................... 13|
|---|---|
|2|Descrição Simplificada do Modelo Operacional .................................................................. 14|
||2.1<br>Acesso das Serventias ao SIRC ..................................................................................... 15|
||2.1.1<br>Web Services ....................................................................................................... 16|
||2.1.2<br>Serviços Síncronos ............................................................................................... 17|
||2.2<br>Envio de Arquivos para o SIRC-Web ............................................................................ 18|
||2.3<br>Envio de Registros Civis para o SIRC via Web Service .................................................. 19|
||2.3.1<br>Autenticação via senha do usuário ...................................................................... 20|
||2.3.2<br>Autenticação via certificado digital ...................................................................... 20|
|3|Especificações Técnicas das Interfaces ................................................................................ 21|
||3.1<br>Padrão de Documento XML ......................................................................................... 21|
||3.1.1<br>Padrão de Codificação ......................................................................................... 22|
||3.1.2<br>Otimização na Montagem do XML....................................................................... 22|
||3.1.3<br>Validação de Schema XML ................................................................................... 23|
||3.1.4<br>Tratamento de Caracteres Especiais no Texto de XML ........................................ 23|
||3.2<br>Padrão de Compactação do Arquivo ........................................................................... 24|
||3.3<br>Padrão de Criptografia do Arquivo .............................................................................. 24|
||3.4<br>Extensão do Arquivo .................................................................................................... 24|
||3.5<br>Padrão de Comunicação .............................................................................................. 25|
|4|Regras de Validação ............................................................................................................. 26|
||4.1<br>Registro Civil ................................................................................................................ 26|
||4.2<br>Registro de Nascimento ............................................................................................... 28|
||4.3<br>Registro de Óbito ......................................................................................................... 29|
||4.4<br>Registro de Casamento ................................................................................................ 30|
||4.5<br>Registro Civil Efetuado no Exterior .............................................................................. 31|
||4.6<br>Transferência de Arquivo de Movimento .................................................................... 31|
||4.7<br>Cancelamento de Termos ............................................................................................ 32|



--- end of page.page_number=9 ---

P á g i n a | 10 

|||P ági n a|10|
|---|---|---|
|SIRC –||Sistema Nacional de Informação de Registro Civil|
||4.8|Anotação, Averbação e Retificação ............................................................................. 33|
||4.8.1<br>Anotação .............................................................................................................. 33||
||4.8.2<br>Averbação ............................................................................................................ 33||
||4.8.3<br>Retificação ........................................................................................................... 33||
|5|Regras de Negócio ............................................................................................................... 34||
||5.1|Registro Civil ................................................................................................................ 34|
||5.2|Registro de Nascimento .............................................................................................. 36|
||5.3|Registro de Casamento ............................................................................................... 36|
||5.4|Registro de Óbito......................................................................................................... 37|
||5.5|Registro Civil Efetuado no Exterior .............................................................................. 38|
||5.6|Transferência de Arquivo de Movimento ................................................................... 38|
||5.7|Cancelamento de Termos ........................................................................................... 39|
||5.8|Declaração de Inexistência .......................................................................................... 39|
||5.9|Anotação, Averbação e Retificação ............................................................................. 40|
||5.9.1<br>Anotação .............................................................................................................. 40||
||5.9.2<br>Averbação ............................................................................................................ 40||
||5.9.3<br>Retificação ........................................................................................................... 40||
|6|Conteúdo do Arquivo do Movimento .................................................................................. 41||
||6.1|Registro de Nascimento ............................................................................................... 41|
||6.2|Registro de Óbito ......................................................................................................... 44|
||6.3|Registro de Casamento ................................................................................................ 47|
||6.4|Cancelamento de Termo .............................................................................................. 50|
||6.5|Declaração de Inexistência de Movimento .................................................................. 51|
|7|Layout XML do Movimento ................................................................................................. 52||
||7.1|Exemplo 1 – Registro de Nascimento (Versão 5.0) ...................................................... 52|
||7.2|Exemplo 2 – Registro de Óbito (Versão 5.0) ................................................................ 54|
||7.3|Exemplo 3 – Registro de Casamento (Versão 5.0) ....................................................... 56|
||7.4|Exemplo 4 – Declaração de Inexistência de Movimento (Versão 1.0) ......................... 59|
||7.5|Exemplo 5 – Termo Cancelado (Versão 1.1) ................................................................ 60|
||7.6|Exemplo 6 – Registro de Nascimento com nome especial ........................................... 60|



--- end of page.page_number=10 ---

P á g i n a | 11 

|P ági n a|11|P ági n a|11|P ági n a|11|
|---|---|---|
|SIRC – Sistema Nacional de Informação de Registro Civil|||
|8|XSD do Movimento .............................................................................................................. 63||
||8.1|Registro de Nascimento (Versão 4.0) .......................................................................... 64|
||8.2|Registro de Óbito (Versão 4.0) ..................................................................................... 71|
||8.3|Registro de Casamento (Versão 4.0) ............................................................................ 79|
||8.4|Declaração de Inexistência de Movimento (Versão 1.0) ............................................ ..86|
||8.5|Cancelamento de Termos (Versão 1.1) ...................................................................... ..87|
|9|Notas de Versão ................................................................................................................. ..89||
||9.1|Versão 4.0 .................................................................................................................. ..89|
||9.2|Versão 5.0 .................................................................................................................. ..89|
||9.3|Versão 6.0 .................................................................................................................. ..89|
||9.4|Versão 7.0 .................................................................................................................. ..90|
||9.5|Versão 7.1 .................................................................................................................. ..90|
||9.6|Versão 7.2 .................................................................................................................. ..90|
||9.7|Versão 7.3 .................................................................................................................. ..90|
||9.8|Versão 7.4 .................................................................................................................. ..91|
|10||Dúvidas Frequentes ....................................................................................................... ..93|
||10.1|Preenchimento dos campos referentes ao país de nascimento, naturalidade e|
||nacionalidade ......................................................................................................................... ..93||
||10.2|XSD ............................................................................................................................. ..93|
||10.3|Geração do XML ......................................................................................................... ..94|
||10.4|Preenchimento de campos ignorados ....................................................................... ..94|
||10.5|Onde Encontrar Ajuda ................................................................................................ ..95|
|11||Anexos ........................................................................................................................... ..96|
||11.1|Anexo I - Tabelas de UF, Município e País.................................................................. ..96|
||11.1.1<br>UF ....................................................................................................................... ..96||
||11.1.2<br>Município ........................................................................................................... ..96||
||11.1.3<br>País ..................................................................................................................... ..96||
||11.2|Anexo II – Tabela de Profissões ................................................................................. ..97|
||11.2.1<br>Tabela CBO-CNIS ................................................................................................ ..98||



--- end of page.page_number=11 ---

P á g i n a | 12 

|SIRC – Sistema Nacional de Informação de Registro Civil|
|---|
|11.3<br>Anexo III – Comprovante de Envio de Arquivo (Registro de Nascimento) ................. ..99|
|11.4<br>Anexo IV – Relatório de Processamento de Registros (Registro de Nascimento) ...... .100|
|11.5<br>Anexo V - JAXB (Java Architecture for XML Binding)  ................................................. .101|
|11.6<br>Anexo VI – TB0400 – Pequenas Tabelas / 02 –Órgão Emissor   ................................. .102|
|11.7<br>Anexo VII - TB0400 – Pequenas Tabelas / 35 – Tipo de Documento Civil .................. 104|
|11.8<br>Anexo VII - TB0400 – Pequenas Tabelas / Sexo / regime de Casamento .................. 104|
|11.9<br>Anexo VIII – WSDL (Web Service Definition Language) -Descritor Web Service ........ 105|
|11.10 Anexo IX – Validação de DNV .................................................................................... 106|
|11.11 Anexo X – Validação de DO ....................................................................................... 108|
|11.12 Anexo XI – Comprovante de Envio de Arquivo (Registro de Óbito) .......................... 110|
|11.13 Anexo XII – Relatório de Processamento de Registros (Registro de Óbito) .............. 111|
|11.14 Anexo XIII – Comprovante de Envio de Arquivo (Registro de Casamento) ............... 112|
|11.15 Anexo XIV – Relatório de Processamento de Registros (Registro de Casamento)  ... 113|
|11.16 Anexo XV – Recibo de Declaração de Inexistência de Movimento ........................... 114|
|11.17 Anexo XVI – Integração Sirc / CER (Centralizadora de Envio de Registros)............... 115|
|11.17.1<br>XSD - Integração Sirc / CER ............................................................................. 117|
|11.17.2<br>WSDL - Integração Sirc / CER ......................................................................... 117|
|11.18 Anexo XVII – Motivos de Anotações e Averbações ................................................... 118|
|11.18.1<br>Registro de Nascimento ................................................................................. 118|
|11.18.2<br>Registro de Casamento .................................................................................. 118|
|11.18.3<br>Registro de Óbito ........................................................................................... 119|
|11.19<br>Anexo XVIII – Listas de Códigos de Justificativas de Ausência de Campos|
|Obrigatórios por Lei ............................................................................................................... 120|
|11.19.1<br>Registro de Nascimento ................................................................................. 120|
|11.19.2<br>Registro de Casamento .................................................................................. 120|
|11.19.3<br>Registro de Óbito ........................................................................................... 121|
|11.19.4<br>Registro de Natimorto ................................................................................... 121|



--- end of page.page_number=12 ---

P á g i n a | 13 

## SIRC – Sistema Nacional de Informação de Registro Civil 

## **1 Introdução** 

O governo federal instituiu o Sistema Nacional de Informações de Registro Civil - SIRC, por meio do Decreto nº 8.270/14 de 27 de junho de 2014, revogado e atualizado pelo Decreto nº 9.929/19. O Sistema conta com um Comitê Gestor que estabelece as diretrizes para funcionamento, gestão e disseminação do Sistema e monitora o uso dos dados nele contidos. A coordenação do Comitê é exercida de forma compartilhada entre o Ministério da Economia e o Ministério da Mulher, Família e Direitos Humanos. 

Participam do Comitê representantes do Ministério da Justiça e Segurança Pública, Ministério da Defesa, Ministério das Relações Exteriores, Ministério da Economia, Ministério da Cidadania, Ministério da Saúde, Ministério da Mulher, Família e Direitos Humanos, Instituto Nacional do Seguro Social – INSS e o Instituto Brasileiro de Geografia e Estatística - IBGE. A Dataprev acompanha como convidada. O INSS é responsável pelo desenvolvimento e operacionalização de manutenção do Sistema. Como uma das condições estruturantes do sistema brasileiro de registro civil, o SIRC consolida uma série de iniciativas que buscam a melhoria da gestão das informações dos cidadãos, aumentando a qualidade da prestação do serviço. 

Os primeiros passos foram dados quando do desenvolvimento do Código Nacional para todas as Serventias do país (CNS) que posteriormente possibilitou gerar a matrícula única para os atos registrais. 

A definição da matrícula única do ato de registro civil, da qual constam elementos que podem diferenciá-la das outras (tais como: o nome do cartório, nº do livro de registro, nº da folha e nº do termo), permite a verificação automática de seu conteúdo, a identificação de erros de transcrição e o controle automático para reduzir a multiplicidade de registros para uma mesma pessoa nos cadastros sociais e consequentemente a redução dos altos custos de processamento. 

O SIRC permitirá que seja estabelecido um único canal de comunicação entre as serventias de registro civil e o governo federal, o que será possível a partir da interoperabilidade entre os principais sistemas dos órgãos usuários e o SIRC. Desenvolve soluções para captura e armazenamento das informações de nascimento, casamento, óbito e natimorto, e permite a recuperação dos dados e controle da movimentação das serventias. 

A sistemática de captação dos dados de registros civis atende aos diversos cenários de disponibilidade tecnológica das serventias, provendo os serviços necessários para o tratamento e disponibilização da informação. 

--- end of page.page_number=13 ---

P á g i n a | 14 

SIRC – Sistema Nacional de Informação de Registro Civil 

## **2 Descrição Simplificada do Modelo Operacional** 

As serventias de registro civil deverão informar ao Poder Executivo Federal, utilizando a internet, os dados relativos aos registros de nascimento, casamento, óbito e natimorto, averbações, anotações e retificações por meio de um dos seguintes módulos do SIRC. 

## Sirc Web Internet 

- Utilizado para incluir, alterar e excluir dados de registros civis de forma individualizada por meio da internet. Este módulo permite, também, carregar arquivo gerado por meio de sistema próprio utilizado pelas serventias. 

## Sirc Carga (WebService) 

- Utilizado para transmissão de arquivos de dados de registros civis por meio da utilização direta do sistema próprio da serventiaCadastra registros civis utilizando sistema próprio. 

## Central de Envio de Registro Civil 

- Utilizado para recepcionar os dados de registros civis das serventias integradas a Centrais de Registros Civis. 

**Figura 1 – Descrição simplificado do modelo operacional.** 

--- end of page.page_number=14 ---

P á g i n a | 15 

SIRC – Sistema Nacional de Informação de Registro Civil 

## _**2.1 Acesso das Serventias ao SIRC**_ 

**==> picture [268 x 128] intentionally omitted <==**

**----- Start of picture text -----**<br>
•HTTPS<br>Serventia<br>•(Conexão segura)<br>**----- End of picture text -----**<br>


## Sirc Web 

## Web Service 

**Figura 2 - Comunicação das serventias com o SIRC.** 

Para a utilização da funcionalidade de envio de arquivo contendo o movimento da serventia, o SIRC disponibilizará dois ambientes síncronos (duas interfaces de comunicação síncrona, isto é, que devolvem um resultado de processamento imediato). O envio poderá ser realizado no **Sirc Web Internet[1]** acessando a opção desejada no menu principal, e ainda pelo **Web Service[2]** disponibilizado pela Dataprev. Além disso, em serventias que possuam sistema próprio, porém sem acesso a Internet, existe a possibilidade de transmissão do arquivo de movimento correspondente utilizando-se de computador com acesso à internet. 

_Observação_ : o envio paralelo do mesmo lote de registros civis não será processado. 

## Sirc Web 

**https://sirc.dataprev.gov.br** 

Web Service (Autenticação via senha do usuário) **https://sirc.dataprev.gov.br/SircWs/Movimento** 

Web Service (Autenticação via certificado digital) 

**https://sirc.dataprev.gov.br/SircWs/MovimentoCertificadoDigital** 

**Figura 3 - Endereços de acesso ao Sirc.** 

> 1 **https://sirc.dataprev.gov.br** 

> 2 **https://sirc.dataprev.gov.br/SircWs/Movimento (Autenticação via senha do usuário) https://sirc.dataprev.gov.br/SircWs/MovimentoCertificadoDigital (Autenticação via certificado digital)** 

--- end of page.page_number=15 ---

P á g i n a | 16 

SIRC – Sistema Nacional de Informação de Registro Civil 

## **2.1.1 Web Services** 

Um _Web Service_ é uma aplicação lógica, programável, que torna compatíveis entre si os mais diferentes aplicativos, capaz de prover conexões a um serviço. É um padrão que possibilita integrar aplicações _web_ a partir de outras tecnologias como _Extensible Markup Language_ (XML), _SimpleObject Access Protocol_ (SOAP) e correlatas. Para as empresas, o _Web Service_ pode trazer agilidade aos processos e eficiência na comunicação entre os seus sistemas os sistemas externos (outras empresas e clientes). 

Ao contrário dos modelos tradicionais, como por exemplo, o modelo cliente servidor, que oferece facilidade de interface ao usuário, o _Web Service_ não fornece interface gráfica aos usuários. Ao invés disso um _Web Service_ pode compartilhar informações de negócio, dados e processos através de uma interface de aplicação pública acessada pela rede. Essas _interfaces_ podem ser trabalhadas de acordo com a necessidade específica de cada um. 

Acima de tudo, é fundamental ressaltar que um _Web Service_ é interoperável entre plataformas e linguagens. 

A arquitetura de padrões de interoperabilidade (ePING) propõe o uso de _Web Services_ para demandas de integração entre sistemas de informação de governo, de modo a permitir a comunicação e intercâmbio de dados entre diferentes redes, independentemente do sistema operacional em que foram implementados. A adoção de um padrão de interoperabilidade deve garantir a escalabilidade, facilidade de uso, além de possibilitar atualização de forma simultânea e em tempo real. 

--- end of page.page_number=16 ---

P á g i n a | 17 

SIRC – Sistema Nacional de Informação de Registro Civil 

## **2.1.2 Serviços Síncronos** 

As solicitações de serviços de implementação síncrona são processadas imediatamente, sendo que o resultado do processamento é obtido em uma única conexão. O fluxo de funcionamento descrito de uma forma geral tende a funcionar da seguinte maneira: 

O aplicativo da serventia inicia a conexão enviando uma mensagem de solicitação de serviço para o _Web Service;_ 

O _Web Service_ recebe a mensagem de solicitação de serviço e encaminha ao aplicativo do SIRC que irá processar o serviço solicitado; 

O aplicativo do SIRC recebe a mensagem de solicitação de serviço e realiza o processamento, devolvendo uma mensagem de resultado do processamento ao _Web Service;_ 

O _Web Service_ recebe a mensagem de resultado do processamento e o encaminha ao aplicativo da serventia; 

O aplicativo da serventia recebe a mensagem de resultado do processamento e, caso não exista outra mensagem, encerra a conexão. 

**Figura 4 - Serviços síncronos.** 

--- end of page.page_number=17 ---

P á g i n a | 18 

SIRC – Sistema Nacional de Informação de Registro Civil 

## _**2.2 Envio de Arquivos para o SIRC-Web**_ 

Os passos definidos para o recebimento de arquivos pelo SIRC **(https://sirc.dataprev.gov.br)** são os seguintes: 

- [Usuário] Transmissão de arquivo com os dados do movimento do cartório via HTTPS (Navegador. Ex: Chrome, Firefox.); 

- [SIRC] Captação de arquivo pelo servidor SIRC; 

- [SIRC] Descriptografia e descompactação de arquivo; 

- [SIRC] Validação de dados presentes no arquivo; 

- [SIRC] Inserção de dados no banco de dados do SIRC; 

- [SIRC] Geração de registro no histórico de transmissões. 

- [SIRC] Geração de recibo comprovando o envio dos arquivos; 

A partir do menu principal do sistema o usuário seleciona a opção para transmissão de arquivos e geração de recibos e relatórios de processamento. **Os serviços disponibilizados pelo Sirc Internet Web, também serão disponibilizados via** _**Web Service** (vide capítulo Envio de Registros Civis para o SIRC via Web Service)._ 

Após o envio de um arquivo, o SIRC disponibilizará um recibo (Anexo IV) e um relatório detalhado da transmissão (Anexo V), contendo o resultado detalhado do processamento de cada registro. 

--- end of page.page_number=18 ---

P á g i n a | 19 

## SIRC – Sistema Nacional de Informação de Registro Civil 

## _**2.3 Envio de Registros Civis para o SIRC via Web Service**_ 

Na alternativa de transmissão de movimento da serventia por Web Service, **não há geração de arquivos** . A informação do movimento deverá ser transmitida da seguinte forma: 

- Sistema próprio da serventia **gera uma sequência de texto XML conforme layout especificado** ; 

- Localiza e chama remotamente (via Internet) ao Web Service do SIRC passando os parâmetros necessários. 

A sequência lógica do SIRC, no recebimento do texto XML é a seguinte: 

- [Usuário] Transmissão de texto com a informação do movimento do cartório via SOAP/HTTPS; 

- [SIRC] Captação do texto pelo SIRC; 

- [SIRC] Validação de dados presentes no arquivo; 

- [SIRC] Inserção de dados no banco de dados do SIRC; 

- [SIRC] Geração e disponibilização para consulta no SIRC-Web do recibo comprovando o envio do movimento (Anexo IV); 

- [SIRC] Geração dos registros no histórico de transmissão e devolução via Web Service do relatório de transmissão no formato XML (Anexo V). 

Nessa modalidade de transmissão, existem duas formas de autenticação: via **senha do usuário** e via **certificado digital** . 

--- end of page.page_number=19 ---

P á g i n a | 20 

SIRC – Sistema Nacional de Informação de Registro Civil 

## **2.3.1 Autenticação via senha do usuário** 

Para utilização dessa modalidade de autenticação, é necessário enviar o usuário, senha e conteúdo contendo os movimentos da serventia. 

A descrição desse serviço está disponibilizada em: 

**https://sirc.dataprev.gov.br/SircWs/Movimento?wsdl** 

## **2.3.2 Autenticação via certificado digital** 

Para o caso de autenticação via certificado digital, existem algumas peculiaridades a serem observadas: 

**O certificado digital utilizado para transmissão deve ser do tipo A3** , e deverá ter sido emitido por uma Autoridade Certificadora credenciada pela Infraestrutura de Chaves Públicas Brasileira - ICP-Brasil. 

**O serviço de autenticação via certificado digital utiliza a especificação WS-Security[3]** , que, por sua vez, possui as seguintes características: 

- O certificado do usuário é enviado no cabeçalho do pacote SOAP. Esse certificado contém informações que permitem identificar o usuário e verificar se possui permissão para o envio do movimento. 

- No cabeçalho do pacote SOAP também deve constar a assinatura do próprio pacote, que deve ser feita utilizando a especificação **XML Signature**[4] . O timestamp de segurança também deve estar contido no mesmo local. 

A descrição do serviço está disponibilizada em: 

**https://sirc.dataprev.gov.br/SircWs/MovimentoCertificadoDigital?wsdl** 

> 3 Maiores informações podem ser obtidas em: **http://www.w3.org/TR/ws-arch/#security; http://docs.oasis-open.org/wss-m/wss/v1.1.1/os/wss-SOAPMessageSecurity-v1.1.1-os.html** 

> 4 **http://www.w3.org/TR/xmldsig-core/** 

--- end of page.page_number=20 ---

P á g i n a | 21 

SIRC – Sistema Nacional de Informação de Registro Civil 

## **3 Especificações Técnicas das Interfaces** 

## _**3.1 Padrão de Documento XML**_ 

A _Extensible Markup Language_ (XML) é um formato simples e flexível de texto derivado do SGML (ISO 8879). Originalmente concebido para responder aos desafios de publicações eletrônicas em larga escala, o XML também desempenha um papel cada vez mais importante na troca de uma ampla variedade de dados na Web e em outros lugares onde haja necessidade. 

O XML permite codificar dados complexos, independente de qualquer linguagem de programação, de forma que o destinatário possa facilmente analisar os mesmos. A vantagem da utilização de XML é clara: você pode olhar para os dados e entender o que eles significam. 

Dentre os principais fatores vantajosos do XML estão: 

- Arquivos XML são lidos tanto por programas de computador quanto por seres humanos; 

- Arquivos em formato XML são resistentes à mudança; 

- XML descreve o significado dos dados, não como exibi-los; 

- XML é uma sintaxe extensível que pode ser usada para especificar vários tipos de dados. 

Seguindo os conceitos apresentados pelo ePING[5] , que preconiza a adoção do XML e o desenvolvimento de XML Schemas como fundamentos para a integração e interoperabilidade eletrônica do governo, o arquivo de movimentosdo SIRC, contendo os registros civis e suas respectivas averbações e anotações, deverá ser descrito com a linguagem XML e estar de acordo com as especificações (schemas) definidos no documento XSD[6] disponibilizado pela Dataprev. 

5A arquitetura ePING – Padrões de Interoperabilidade de Governo Eletrônico – define um conjunto mínimo de premissas, políticas e especificações técnicas que regulamentam a utilização da Tecnologia de Informação e Comunicação (TIC) na interoperabilidade de Serviços de Governo Eletrônico, estabelecendo as condições de interação com os demais Poderes e esferas de governo e com a sociedade em geral. Todo o conteúdo deste documento de referência está em consonância com as diretrizes do Comitê Executivo de Governo Eletrônico, criado pelo Decreto de 18 de outubro de 2000, e está publicado em sítio específico na Internet (http:// www.eping.e.gov.br), garantindo acesso público às informações de interesse geral e transparência intrínseca à iniciativa. O governo brasileiro está comprometido em assegurar que estas políticas e especificações permaneçam alinhadas com as necessidades da sociedade e com a evolução do mercado e da tecnologia. 

--- end of page.page_number=21 ---

P á g i n a | 22 

SIRC – Sistema Nacional de Informação de Registro Civil 

## **3.1.1 Padrão de Codificação** 

O documento XML deve adotar os padrões e recomendações da W3C[7] para XML 1.0, sendo que a codificação dos caracteres presentes no arquivo deve ser **UTF-8** . Deste modo, quaisquer arquivos enviados ao SIRC terão a seguinte declaração no início de seu escopo: 

## **<?xml version="1.0" encoding="UTF-8"?>** 

## **3.1.2 Otimização na Montagem do XML** 

Na geração do arquivo XML contendo os registros para envio ao SIRC, excetuando-se os campos identificados como obrigatórios no modelo, não deverão ser incluídas TAGS de campos com conteúdo vazio. A regra anterior também deve ser aplicada em campos que tem seu preenchimento opcional de acordo com as regras de negócio definidas. 

A fim de reduzir o tamanho final do XML, devem ser tomados alguns cuidados em sua construção: 

- É recomendado que não sejam incluídos, em campos numéricos, zeros não significativos. 

- É recomendado que não sejam incluídos espaços em branco no início ou no final de campos numéricos e alfanuméricos; 

- É recomendado que não sejam incluídos comentários no arquivo XML; 

- Não incluir anotação e documentação no XML (TAG annotation e TAG documentation); 

- Não incluir caracteres de formatação no XML ("line-feed", "carriage return","tab", caractere de "espaço" entre as TAGs). 

6 XML Schema é uma linguagem baseada no formato XML para definição de regras de validação ("esquemas") em documentos no formato XML. Foi a primeira linguagem de esquema para XML a obter o status de recomendação por parte do W3C. Um arquivo contendo as definições na linguagem XML Schema é chamado de XSD (XML Schema Definition), este descreve a estrutura de um documento XML. 

> 7 www.w3.org 

--- end of page.page_number=22 ---

P á g i n a | 23 

SIRC – Sistema Nacional de Informação de Registro Civil 

## **3.1.3 Validação de Schema XML** 

Para que seja garantido que a formação dos XML esteja correta e que as informações prestadas sejam minimamente validadas, o XML contendo os dados do movimento deve ser submetido a uma validação a partir do XSD (XML Schema Definition: **MovimentoNascimentoTO.xsd; MovimentoObitoTO.xsd; MovimentoCasamentoTO.xsd** ), disponibilizado pela Dataprev. 

## **3.1.4 Tratamento de Caracteres Especiais no Texto de XML** 

Todo o conteúdo de um documento XML é submetido a uma análise de _parser_ específico da linguagem. Essa análise tem seu funcionamento afetado quando da aparição de alguns caracteres de uma forma não controlada. Os caracteres que afetam o _parser_ são os seguintes: 

- > (sinal de maior); 

- < (sinal de menor); 

- & (e-comercial); 

- “ (aspas); 

- ‘ (sinal de apóstrofe); 

A utilização desses caracteres é permitida em alguns campos. Para tanto, é recomendável que, ao invés da utilização desses caracteres especiais, sejam utilizadas algumas sequencias de caracteres que os representam: 

- < ➔ &lt; 

- > ➔ &gt; 

- & ➔&amp; 

- " ➔ &quot; 

- ' ➔ &#39; 

Apesar da utilização de diversos caracteres nessas sequências, esses aglomerados figuram como um único caractere quando de uma eventual validação de tamanho de campo pelo XSD. Outra solução seria a utilização de [CDATA] no conteúdo dos campos. 

--- end of page.page_number=23 ---

P á g i n a | 24 

SIRC – Sistema Nacional de Informação de Registro Civil 

## _**3.2 Padrão de Compactação do Arquivo**_ 

Após as informações do movimento da serventia serem formatadas na linguagem XML, o arquivo contendo essa informação deve ser comprimido em um arquivo no formato GZIP usando o seu algoritmo de compressão padrão (DEFLATE). 

_**gzip <nome arquivo>.xml**_ 

## _**3.3 Padrão de Criptografia do Arquivo**_ 

Depois de comprimido, o arquivo deve então ser cifrado com o algoritmo de criptografia simétrica AES com bloco de cifra de 128 bits no modo ECB, com _padding_ no padrão PKCS#5 e sem utilização de _salt_ . **A chave para cifrar deve ser o hash MD5[8] do CNS** (Código Nacional de Serventias) **da serventia** . 

Como exemplo, o comando openssl para cifrar um arquivo que o SIRC aceitará é o descrito abaixo. O openssl por padrão faz _padding_ PKCS#5: 

_**openssl aes-128-ecb -k <código serventia sem zeros à esquerda> -e -nosalt - in <nome arquivo>.xml.gz -out <nome arquivo>.mrc**_ 

Esse comando já converte o CNS informado por default em um hash MD5 de 128 bits, ou seja, deve-se informar o CNS plano e não o seu hash. 

## _**3.4 Extensão do Arquivo**_ 

Após o processo de criptografia, para o posterior envio ao SIRC, o arquivo contendo o movimento da serventia deve ter sua extensão definida como “.mrc”. 

> 8 O MD5 (Message-Digest algorithm 5) é um algoritmo de hash de 128 bits unidirecional desenvolvido pela RSA Data Security, Inc., descrito na RFC 1321. 

--- end of page.page_number=24 ---

P á g i n a | 25 

SIRC – Sistema Nacional de Informação de Registro Civil 

## _**3.5 Padrão de Comunicação**_ 

Para entrega do movimento da serventia no SIRC-Web, o meio de comunicação é o arquivo XML cifrado e compactado de acordo com as especificações descritas anteriormente. Este arquivo deverá ser submetido ao SIRC-Web Internet em um navegador Web. O meio de comunicação usará o protocolo HTTPS para transferir o arquivo do navegador para o SIRC, observando os padrões do ePING. 

Para envio do movimento via _Web Service_ , a comunicação será feita de acordo com as especificações do capítulo Envio de Registros Civis para o SIRC via _Web Service_ . O modelo de comunicação segue o padrão de Web Services definido pelo WS-I Basic Profile. A troca de mensagens entre o _Web Service_ do ambiente do Sistema SIRC e o aplicativo da serventia será realizada no padrão SOAP versão 1.0, com troca de mensagens XML no padrão Style/Enconding: Document/Literal. 

--- end of page.page_number=25 ---

P á g i n a | 26 

SIRC – Sistema Nacional de Informação de Registro Civil 

## **4 Regras de Validação** 

As regras de validação estão divididas em seções para melhor compreensão, porém, é importante ressaltar que existem regras comuns aos registros civis. 

## _**4.1 Registro Civil**_ 

**Nomes: t** odos os nomes devem obedecer às regras abaixo: 

- **Regras válidas –** são as regras que serão aceitas pelo sistema: 

   - a. Conter ao menos uma palavra; 

   - b. Somente letras de a..z (maiúsculas ou minúsculas); 

   - c. Pode haver palavras de somente uma letra; 

   - d. O apóstrofo será aceito, como regra válida, quando está entre duas letras. Ex.: a'a; 

   - e. O hífen somente será aceito, como regra válida, quando estiver entre duas letras (maiúsculas ou minúsculas). Ex.: a-a A-A a-A A-a 

   - f. Letras 2 vezes repetidas. Ex.: aa AA; 

   - g. Palavras escritas com acentuação, cedilha e demais sinais ortográficos. 

_Caso exista mais de um espaço entre palavras, o sistema ajustará_ 

_-- automaticamente para somente um. Ex: Fulano da Silva > Fulano da Silva;_ 

- **Regras especiais –** são as regras que necessitam de **confirmação** para serem aceitas pelo sistema. Cada nome possui um identificador, que deve ser marcado com verdadeiro ou falso, indicando se o nome é, ou não, especial. 

   - a. Nomes Especiais (considerar masculino, feminino e plural, quando aplicável): avô, cadáver, cadavérico, cancelado, cancelamento, celebrante, companheiro, complementado, complemento, cônjuge, corpo, cujus, cumprimento, cumprindo, cunhado, declarado, declarante, defunto, desconhecido, documento, efeito, esposo, existe, falecido, feto, fulano, identidade, identificação, identificado, ignorado, indefinido, indigente, inexistente, informado, invalidado, inválido, judicial, juiz, juíza, mãe, marido, materno, mesmo, morto, mulher, não, nascido, natimorto, noivo, nome, nubente, numeral, número, nunca, omitido, ordem, pai, paterno, recém, registrado, registro, testando, teste, testemunha, vivo. 

## Métodos de pesquisa: 

- i. Palavra chave de forma contínua no **início do nome** : **FALECIDA** MARIA DA SILVA 

- ii. Palavra chave de forma contínua ao **final do nome** : MARIA **FALECIDA** DA SILVA 

- iii. Palavra chave no **meio do nome:** 

--- end of page.page_number=26 ---

P á g i n a | 27 

## SIRC – Sistema Nacional de Informação de Registro Civil 

- iv. MARIA **FALECIDA** JOSE DA SILVA 

Palavras como **expressão:** 

      - v. MARIA **FALECIDA** DA SILVA ou MARIA DA SILVA **FALECIDA** 

   - b. Letras 3 ou mais vezes repetidas. Ex.: aaa aaaa aaaaa; 

   - c. O apóstrofo será aceito, como regras especiais, nos seguintes casos: i. Ex.: a' aa _(Apóstrofo seguido de espaços);_ 

      - ii. Ex.: a'. ( _Apóstrofo terminando um nome_ ). 

- **Regras inválidas –** são as regras que **não** serão aceitas pelo sistema: 

   - a. Algarismos arábicos (0...9) serão considerados inválidos; 

   - b. Com exceção às regras apresentadas, os demais caracteres serão considerados inválidos. _Ex.: # ! ? '''' -a a-;_ 

   - c. Nomes abreviados serão considerados inválidos, entendendo-se por abreviatura uma letra seguida de um ponto. Ex.: Jr. 

   - d. O apóstrofo será considerado inválido nos seguintes casos: Ex.: a 'aa (Apóstrofo após um espaço) 

   - Ex.: 'a aa (Apóstrofo iniciando um nome) 

**Matrícula:** ser representada por um campo numérico composto de 32 Dígitos, assim divididos: 

- Identificador da Serventia: 5 Dígitos + 1 DV (Dígito Verificador): Deve ser o mesmo da sessão DV calculado com algoritmo módulo 10 (Conforme disponibilizado pelo CNJ); 

- Acervo: 2 Dígitos. Deve pertencer aos acervos da serventia; 

- Tipo de Serviço: 2 Dígitos. Constante de valor pré-definido ( _55_ ); 

- Ano do Registro: 4 Dígitos. Deve ser o mesmo ano da data de registro; 

- Tipo Livro: 1 Dígito. 

- Número Livro: 5 Dígitos; 

- Número Folha: 3 Dígitos; 

- Número Termo: 7 Dígitos; 

- DV: 2 Dígitos. Verificado de acordo com algoritmo módulo 11 (Conforme disponibilizado pelo CNJ). 

## **Documentos:** 

- **CPF:** verificado de acordo com algoritmo módulo 11. 

- **NIT:** verificado de acordo com algoritmo módulo 11. 

- **Título de Eleitor:** verificado de acordo com regras disponibilizadas pela justiça eleitoral. 

**Profissão:** o código da profissão deve estar contemplado nos valores contidos na tabela CBOCNIS,   que   é   uma   versão   ampliada   da   tabela   CBO   - Classificação Brasileira De Ocupação. Além disso, é permitido o valor “-1” referente à opção “sem profissão remunerada” e o valor “-2” referente à opção “outras”." 

**Nacionalidade:** deve estar compreendido entre os valores contidos na tabela SDC - TB0085 – Países. 

**País:** deve estar compreendido entre os valores contidos na tabela SDC - TB0085 – Países. **Código do Impresso de Segurança:** deve ser formado por 11 caracteres distribuídos da seguinte forma: AAnnnnnnnnn, onde A = caractere alfanumérico e n = número. 

--- end of page.page_number=27 ---

P á g i n a | 28 

## SIRC – Sistema Nacional de Informação de Registro Civil 

## _**4.2 Registro de Nascimento**_ 

**Data de Nascimento:** a data deve ser menor ou igual à data atual; possuir formato dd/mm/aaaa, sendo dd um número natural refletindo um dia válido, mm um número entre um e doze e aaaa um número natural representando um ano válido. 

**Hora:** a hora deve possuir formato hh:mm, sendo hh um número natural representando uma hora válida e mm um número natural representando um total de minutos válido. 

**Município:** o município deve ser representado por um código – número inteiro - de município com base em dados do SDC (Sistema de Dados Corporativos), compatíveis com o IBGE; 

**Data do Registro:** a data de registro deve ser maior ou igual à data de nascimento e menor ou igual à data atual; possuir formato dd/mm/aaaa, sendo dd um número natural refletindo um dia válido, mm um número entre um e doze e aaaa um número natural representando um ano válido. 

**Local de Nascimento:** composto da enumeração de locais (Unidade de Saúde; Fora de Unidade de Saúde). 

**DNV:** o número da DNV deve ser validado de acordo com as validações disponibilizadas pelo Ministério da Saúde [Anexo X]. 

**Inexistência da DNV:** deve estar compreendido nos valores da enumeração de inexistência (Sim; ou Não). 

**Sexo:** para todos os campos de sexo do registro civil de nascimento devem estar compreendidos nos seguintes valores de domínio: MASCULINO, FEMININO, NAO_BINARIO, OUTROS, NAO_DECLARADO ou IGNORADO. 

- `<xs:element name="sexo" type="sexo" minOccurs="0"/>` 

**Sexo ignorado:** marcação de sexo ignorado para o nascido. 

- `<xs:element name="sexoIgnorado" type="xs:boolean" minOccurs="0"/>` 

**Gênero:** campo destinado à inserção livre de informação de gênero, devendo conter no máximo 100 caracteres e disponível para o nascido, filiação e progenitor. 

- `<xs:element name="genero" type="string100" minOccurs="0" />` 

**UF do Município de Naturalidade:** UF do município de naturalidade do nascido. 

- `<xs:element name="codigoIBGEUFNaturalidade" type="xs:int" minOccurs="0"/>` 

**Município de Naturalidade (IBGE):** código do IBGE para o município de naturalidade do nascido. 

- `<xs:element name="codigoIBGEMunicipioNaturalidade" type="xs:int" minOccurs="0"/>` 

**Município de Naturalidade:** campo destinado à inserção livre de informação de município de naturalidade, devendo conter no máximo 100 caracteres e disponível para o nascido. Deverá ser utilizado quando não tiver a informação de município do IBGE. Não deverá ser utilizado em conjunto com o código do município de naturalidade do IBGE, sendo um ou outro. 

- `<xs:element name="municipioNaturalidadeTexto" type="string100" minOccurs="0"/>` 

--- end of page.page_number=28 ---

P á g i n a | 29 

SIRC – Sistema Nacional de Informação de Registro Civil 

## _**4.3 Registro de Óbito**_ 

**Data de Nascimento do Falecido:** a data de nascimento do falecido deve ser menor ou igual à data do óbito; deve ser menor ou igual a data de lavratura do óbito; menor ou igual à data atual; possuir formato dd/mm/aaaa, sendo dd um número natural refletindo um dia válido, mm um número entre um e doze e aaaa um número natural representando um ano válido. 

**Data de Lavratura do Óbito:** a data de lavratura de óbito deve ser maior ou igual à data do óbito; deve ser maior ou igual a data de nascimento; menor ou igual à data atual; possuir formato dd/mm/aaaa, sendo dd um número natural refletindo um dia válido, mm um número entre um e doze e aaaa um número natural representando um ano válido. 

**Data do Óbito:** a data do óbito deve ser maior ou igual à data de nascimento; deve ser menor ou igual a data de lavratura do óbito; menor ou igual à data atual; possuir formato dd/mm/aaaa, sendo dd um número natural refletindo um dia válido, mm um número entre um e doze e aaaa um número natural representando um ano válido. 

**Número do Benefício do INSS:** O número do benefício do INSS deve ser representado por um campo numérico de dez dígitos, sendo o último número um dígito verificador calculado a partir do módulo 11. Informar o número do benefício (NB) caso o falecido tenha seu benefício previdenciário ou assistencial pago pelo INSS. Preencher o campo com o número do benefício constante da Carta de Concessão, do cartão magnético, ou de extrato/documento fornecido pelo INSS. Somente preencher este campo se o falecido for beneficiário do INSS. Este número é de grande valia para impedir o recebimento indevido de pagamentos feitos pelo INSS, solicitando-se especial empenho por parte do cartório no preenchimento desta informação. 

**Cor:** deve estar compreendido nos valores da enumeração de cor do IBGE (branca; preta; amarela; parda ou indígena). 

**Estado Civil:** deve estar compreendida entre os valores contidos na tabela SDC - TB0400 – Pequenas Tabelas / 34 – Estado Civil, **exceto o valor “União Estável”.** 

**Tipo da Morte:** deve estar compreendido nos valores da enumeração de tipo de morte (Natural ou Acidental). 

**Eleitor:** deve estar compreendido nos valores da enumeração “Sim” ou “Não”. **Declaração de óbito (DO):** O número da DO deve ser validado de acordo com as validações disponibilizadas pelo Ministério da Saúde [Anexo XI]. 

**Tipo do Local de Falecimento:** deve estar compreendido nos valores da enumeração de tipos de local (Hospital; Outros Serviços de Saúde; Domicílio; Via Pública; Outros). 

**Sexo:** para todos os campos de sexo do registro civil de óbito devem estar compreendidos nos seguintes valores de domínio: MASCULINO, FEMININO, NAO_BINARIO, OUTROS, NAO_DECLARADO ou IGNORADO. 

- `<xs:element name="sexo" type="sexo" minOccurs="0"/>` 

**Gênero:** campo destinado à inserção livre de informação de gênero, devendo conter no máximo 100 caracteres e disponível para o falecido e filiação. 

- `<xs:element name="genero" type="string100" minOccurs="0" />` 

--- end of page.page_number=29 ---

P á g i n a | 30 

SIRC – Sistema Nacional de Informação de Registro Civil 

## _**4.4 Registro de Casamento**_ 

**Data da publicação dos proclamas:** a data deve ser menor que a data do registro do casamento; formato dd/mm/aaaa, sendo dd um número natural refletindo um dia válido, mm um número entre um e doze e aaaa um número natural representando um ano válido. 

**Data da celebração do casamento:** a data deve ser menor ou igual à data do registro do casamento; formato dd/mm/aaaa, sendo dd um número natural refletindo um dia válido, mm um número entre um e doze e aaaa um número natural representando um ano válido. 

**Data de registro do casamento:** a data deve ser menor ou igual à data atual; formato dd/mm/aaaa, sendo dd um número natural refletindo um dia válido, mm um número entre um e doze e aaaa um número natural representando um ano válido. 

**Regime de Casamento:** deve estar compreendido nos valores da enumeração de regime de casamento (Comunhão Parcial; Comunhão Universal; Participação Final nos Aqüestros; Separação de Bens, Comunhão Geral, Regime Híbrido e Outros). 

**Data em Cujas Notas Foi Tomada a Escritura Ante-Nupcial:** a data deve ser menor que a data do registro do casamento; possuir formato dd/mm/aaaa, sendo dd um número natural refletindo um dia válido, mm um número entre um e doze e aaaa um número natural representando um ano válido. 

**Data da Dissolução do Casamento Anterior:** a data deve ser menor que a data da celebração do casamento; menor que a data do registro do casamento; possuir formato dd/mm/aaaa, sendo dd um número natural refletindo um dia válido, mm um número entre um e doze e aaaa um número natural representando um ano válido. 

**Data de Nascimento do Cônjuge:** a data deve ser menor que a data da celebração do casamento; menor que a data atual; possuir formato dd/mm/aaaa, sendo dd um número natural refletindo um dia válido, mm um número entre um e doze e aaaa um número natural representando um ano válido. 

**Data de Nascimento da Filiação do Cônjuge:** a data deve ser menor que a data da celebração do casamento; menor que a data atual; possuir formato dd/mm/aaaa, sendo dd um número natural refletindo um dia válido, mm um número entre um e doze e aaaa um número natural representando um ano válido. 

**Data de Falecimento da Filiação do Cônjuge:** a data deve ser menor ou igual à data de registro do casamento; possuir formato dd/mm/aaaa, sendo dd um número natural refletindo um dia válido, mm um número entre um e doze e aaaa um número natural representando um ano válido. 

**Sexo:** para todos os campos de sexo do registro civil de casamento devem estar compreendidos nos seguintes valores de domínio: MASCULINO, FEMININO, NAO_BINARIO, OUTROS, NAO_DECLARADO ou IGNORADO. 

- `<xs:element name="sexo" type="sexoConjuge" minOccurs="0"/>` 

**Sexo ignorado:** marcação de sexo ignorado para o cônjuge. 

- `<xs:element name="sexoIgnorado" type="xs:boolean" minOccurs="0" />` 

**Gênero:** campo destinado à inserção livre de informação de gênero, devendo conter no máximo 100 caracteres e disponível para o cônjuge e filiação. 

- `<xs:element name="genero" type="string100" minOccurs="0" />` 

--- end of page.page_number=30 ---

P á g i n a | 31 

SIRC – Sistema Nacional de Informação de Registro Civil 

## _**4.5 Registro Civil Efetuado no Exterior**_ 

**CNS do Consulado** : 5 Dígitos + 1 DV (Dígito Verificador): Deve ser o mesmo da sessão DV calculado com algoritmo módulo 10 (Conforme disponibilizado pelo CNJ); 

## _**4.6 Transferência de Arquivo de Movimento**_ 

**Formato do arquivo:** o formato do arquivo a ser transferido deve ser XML, sendo que deve ser válido perante as definições do arquivo XSD disponibilizado pela Dataprev. Esse arquivo XSD[9] será disponibilizado pela Dataprev. O conteúdo do arquivo deve estar em codificação UTF-8. 

**Tamanho do arquivo:** o arquivo deve conter no máximo **1024** Kbytes. 

**Quantidade de registros do arquivo:** O arquivo deve conter no máximo **250** Registros. 

**Intervalo entre submissões:** o intervalo mínimo entre submissões de arquivos deve ser de, no mínimo, **1** minuto. 

**Compactação do arquivo:** o arquivo deve ser compactado a partir de algorítimo GZIP (formato aberto para compactação de arquivos). 

**Criptografia do arquivo:** o arquivo deve ser criptografado a partir do algoritmo AES[10] (Advanced Encryption Standard ou Padrão de _Criptografia_ Avançada), sendo que a senha para criptografia deve ser o hash, calculado a partir de MD5[11] , do código CNS da serventia para acesso ao Sirc. 

**Extensão do arquivo:** o arquivo a ser transferido deve possuir a extensão “.mrc”, quaisquer outras extensões serão ignoradas pelo SIRC. 

> 9 XML Schema é uma linguagem baseada no formato XML para definição de regras de validação ("esquemas") em documentos no formato XML. Foi a primeira linguagem de esquema para XML a obter o status de recomendação por parte do W3C. Um arquivo contendo as definições na linguagem XML Schema é chamado de XSD (XML Schema Definition), este descreve a estrutura de um documento XML. 

> 10 Algoritmo AES, chave de 128 bits, bloco de cifra no modo ECB, _/Padding /PKCS5, sem utilização de /salt/_ . A chave utilizada para a cifragem corresponde ao hash MD5 do código da serventia. Comando openssl para cifragem: 

> openssl aes-128-ecb -k <código serventia sem zeros à esquerda> -e -nosalt -in <nome arquivo>.xml.gz -out <nome arquivo>.mrc 

11 O MD5 (Message-Digest algorithm 5) é um algoritmo de hash de 128 bits unidirecional desenvolvido pela RSA Data Security, Inc., descrito na RFC 1321. 

--- end of page.page_number=31 ---

P á g i n a | 32 

SIRC – Sistema Nacional de Informação de Registro Civil 

## _**4.7 Cancelamento de Termos**_ 

**Motivo** : o motivo do cancelamento deve conter no mínimo 15 caracteres e no máximo 350 caracteres. 

**Tipo de Registro Civil** : o tipo de registro civil deve ser um dos seguintes valores: _NASCIMENTO_ , _CASAMENTO_ ou _OBITO_ . 

**Identificador da Serventia** : 5 Dígitos + 1 DV (Dígito Verificador): Deve ser o mesmo da sessão DV calculado com algoritmo módulo 10 (Conforme disponibilizado pelo CNJ). 

**Acervo** : 2 Dígitos. Deve pertencer aos acervos da serventia. 

**Tipo de Serviço** : 2 Dígitos. Constante de valor pré-definido (55). 

**Número Termo** : 7 Dígitos. 

**Tipo Livro** : 1 Dígito. 

**Ano do Registro** : 4 Dígitos. Deve ser o mesmo ano da data de registro. 

**Data de envio para CER** : data de envio do registro da serventia para a CER (quando aplicável). 

**Número Folha** : 3 Dígitos; 

**Número Livro** : 5 Dígitos; 

--- end of page.page_number=32 ---

P á g i n a | 33 

SIRC – Sistema Nacional de Informação de Registro Civil 

## _**4.8 Anotação, Averbação e Retificação**_ 

## **4.8.1 Anotação** 

**Data da Anotação:** deve ser maior ou igual à data do registro civil; deve ser menor ou igual à data atual. 

**Dados Complementares:** campo destinado à inserção livre de informações adicionais, devendo conter no mínimo 10 e no máximo 1.000 caracteres. 

- `<xs:element name="dadosComplementares" type="xs:string" minOccurs="0"/>` 

## **4.8.2 Averbação** 

**Data da Averbação:** deve ser maior ou igual à data do registro civil; deve ser menor ou igual à data atual. 

**Data do Motivo:** deve ser menor ou igual à data averbação. 

**Data da Sentença:** deve ser menor ou igual à data da averbação. 

**Dados Complementares:** campo destinado à inserção livre de informações adicionais, devendo conter no mínimo 10 e no máximo 1.000 caracteres. 

- `<xs:element name="dadosComplementares" type="xs:string" minOccurs="0"/>` 

## **4.8.3 Retificação** 

**Data da Retificação:** deve ser maior ou igual à data do registro civil; deve ser menor ou igual à data atual. 

**Data da Sentença:** deve ser menor ou igual à data da retificação. 

**Dados Complementares:** campo destinado à inserção livre de informações adicionais, devendo conter no mínimo 10 e no máximo 1.000 caracteres. 

- `<xs:element name="dadosComplementares" type="xs:string" minOccurs="0"/>` 

--- end of page.page_number=33 ---

P á g i n a | 34 

SIRC – Sistema Nacional de Informação de Registro Civil 

## **5 Regras de Negócio** 

As regras de negócio estão divididas em seções para melhor compreensão, porém, é importante ressaltar que existem regras comuns aos registros civis. 

## _**5.1 Registro Civil**_ 

**Preenchimento de endereço:** Deve ser preenchido somente um dos endereços, ou seja, preencher o endereço nacional ou o endereço estrangeiro. 

**Dados da Filiação:** Quando os dados de qualquer filiação não forem ignorados, as informações inseridas devem estar coerentes. Ou seja, no mínimo, o nome e sexo da filiação devem ser preenchido. Ex: Os dados de idade/data de nascimento/profissão/naturalidade/documentos da filiação não podem ser informados sem que o seu nome e sexo seja informado. 

**Campo Ignorado:** Quando um campo não estiver informado, o marcador de campo ignorado deve ser informado. Analogamente, o marcador de campo ignorado não pode estar informado quando houver preenchimento do campo. 

**Nacionalidade:** Quando o país de nascimento do indivíduo for diferente de Brasil, o código de município e UF de nascimento não deve ser informado nem ignorado. Analogamente, quando o país de nascimento for Brasil o município e UF de nascimento devem ser informados. O preenchimento do campo de nacionalidade é obrigatório, podendo ser ignorado, em ambos os casos. 

**Termo:** Conforme a Lei 6015, que cita no Art. 7: "Os números de ordem dos registros não serão interrompidos no fim de cada livro, mas continuarão, indefinidamente, nos seguintes da mesma espécie.", **não devem existir números de termos iguais** para uma mesma serventia, acervo, tipo de registro civil e tipo do livro, mas são aceitos se tiverem sido registrados em livro e/ou folha diferentes que possibilitem a formação de matrícula própria a cada registro. 

**Município:** Para contemplar todas as situações referentes ao município, estão disponíveis para preenchimento, em alguns casos, dois campos de município – a partir do código do IBGE e em texto livre (para os casos em que os municípios não constem na lista do IBGE). Essas duas informações não podem estar preenchidas simultaneamente. Ademais, quando o município for ignorado, nenhum outro campo referente ao município deve ser preenchido. 

**Documentos:** Para que o SIRC contemple, onde for o caso, o cadastro de todos os documentos especificados em lei, a lista de documentos passíveis de cadastramento no sistema deve ser retirada da tabela **Tipo de Documento Civil** . Cada tipo de documento exige uma ou mais informações complementares ao conteúdo do documento propriamente dito. A regra de preenchimento dos documentos se dará da seguinte forma: 

--- end of page.page_number=34 ---

P á g i n a | 35 

SIRC – Sistema Nacional de Informação de Registro Civil 

|**Documento**|**Estrutura de dados**|
|---|---|
|**Carteira de Marítimo**|Dígitos do Documento + Data de Emissão.|
|**Certidão de Casamento**|Matrícula da Certidão de Casamento.|
|**Certidão de Nascimento**|Matrícula da Certidão de Nascimento.|
|**Certidão de Reservista**|Dígitos do Documento.|
|**CNH**|Dígitos do Documento + Data da Primeira Habilitação.|
|**CPF**|Dígitos do Documento.|
|**CTPS**|Dígitos do Documento + Série + UF de Emissão + Data de|
||Emissão.|
|**Identidades Estrangeiras**|Dígitos do Documento + Texto livre indicando qual o tipo|
|**Aceitas por Tratados**|de documento.|
|**Outros**|Dígitos do Documento + Texto livre indicando qual o tipo|
||de documento.|
|**Passaporte**|Dígitos do Documento + Série + Data de Emissão.|
|**RG / Carteira de Identificação**|Dígitos do Documento + Órgão de Emissão (TB0400 –|
|**Profissional**|Pequenas Tabelas / 02 – Órgão Emissor) + UF de Emissão +|
||Data de Emissão (Opcional).|
|**RIC**|Dígitos do Documento.|
|**RNE**|Dígitos do Documento.|
|**Título de Eleitor**|Dígitos do Documento + Data de Emissão (Opcional).|



Para cada indivíduo e tipo de registros civis existem os tipos de documentos passíveis de preenchimento. Esses devem ser informados conforme segue abaixo: 

|**Local onde os documentos**|**Registro de**|**Registro de Óbito**|**Registro de**|
|---|---|---|---|
|**devem ser preenchidos**|**Nascimento**|**(Falecido,**|**Casamento**|
||**(Filiação)**|**Filiação,**|**(Primeiro e**|
|||**Declarante)**|**Segundo Cônjuge)**|
|||||
|**Carteira de Marítimo**|**Sim**|**Sim**|**Não**|
|**Certidão de Casamento**|**Sim**|**Sim**|**Sim**|
|**Certidão de Nascimento**|**Sim**|**Sim**|**Sim**|
|**Certidão de Reservista**|**Sim**|**Sim**|**Não**|
|**CNH**|**Sim**|**Sim**|**Sim**|
|**CPF**|**Sim**|**Sim**|**Sim**|
|**CTPS**|**Sim**|**Sim**|**Sim**|
|**Identidades Estrangeiras**<br>**Aceitas por Tratados**|**Sim**|**Sim**|**Sim**|
|**Outros**|**Sim**|**Sim**|**Não***|
|**Passaporte**|**Sim**|**Sim**|**Sim**|
|**RG / Carteira de**|**Sim**|**Sim**|**Sim**|
|**Identificação Profissional**||||
|**RIC**|**Sim**|**Sim**|**Sim**|
|**RNE**|**Sim**|**Sim**|**Sim**|
|**Título de Eleitor**|**Sim**|**Sim**|**Sim**|



* Para os registros de casamento efetuados no exterior e posteriormente transcritos no Brasil (Tipo de livro 7) esse tipo documento está habilitado para preenchimento. 

--- end of page.page_number=35 ---

P á g i n a | 36 

SIRC – Sistema Nacional de Informação de Registro Civil 

## _**5.2 Registro de Nascimento**_ 

**Preenchimento da DNV e local de nascimento:** Obrigatoriamente deve-se incluir o número da DNV ou declará-la como inexistente. Nunca devem ser preenchidos os dois campos simultaneamente, ou seja, não se deve preencher a DNV e o marcador de inexistência de DNV em um mesmo registro de nascimento. 

**Nomes Ignorados:** O nome do nascido não pode ser ignorado. Os nomes da filiação podem ser ignorados. Os nomes dos progenitores podem ser nulos. 

**Gêmeos:** Quando houver a marcação da existência de gêmeos, o preenchimento da quantidade de irmãos gêmeos do registrado é obrigatória. Analogamente, quando não existirem gêmeos, essa quantidade não deve ser preenchida. 

**Hora de Nascimento Ignorada:** Quando a hora de nascimento não estiver informada, o marcador de hora ignorada deve ser informado. Analogamente, o marcador de hora ignorada não pode estar informado quando houver uma hora preenchida. **CPF Ignorado:** Quando o CPF não estiver informado, o marcador de CPF ignorado deve ser informado. Analogamente, o marcador de CPF ignorado não pode estar informado quando houver um CPF preenchido. 

**Data de Nascimento Ignorada:** Quando a data de nascimento não estiver informada, o marcador de data de nascimento ignorada deve ser informado. Analogamente, o marcador de data de nascimento ignorada não pode estar informado quando houver uma data de nascimento preenchida. 

**Local de Nascimento Ignorado:** Quando o local de nascimento não estiver informado, o marcador de local de nascimento ignorado deve ser informado. Analogamente, o marcador de local de nascimento ignorado não pode estar informado quando houver um local de nascimento preenchido. 

**Município de Naturalidade (texto):** Deverá ser utilizado quando não tiver a informação de município do IBGE. Não deverá ser utilizado em conjunto com o código do município de naturalidade do IBGE, sendo um ou outro. 

## _**5.3 Registro de Casamento**_ 

**Preenchimento de endereço:** Deve ser preenchido somente um dos endereços, ou seja, preencher o endereço nacional ou o endereço estrangeiro. 

--- end of page.page_number=36 ---

P á g i n a | 37 

## SIRC – Sistema Nacional de Informação de Registro Civil 

## _**5.4 Registro de Óbito**_ 

**Finado Desconhecido:** Art. 81. Sendo o finado desconhecido, o assento deverá conter declaração de estatura ou medida, se for possível, cor, sinais aparentes, idade presumida, vestuário e qualquer outra indicação que possa auxiliar de futuro o seu reconhecimento; e, no caso de ter sido encontrado morto, serão mencionados esta circunstância e o lugar em que se achava e o da necropsia, se tiver havido. (Renumerado do art. 82 pela, Lei nº 6.216, de 1975). Parágrafo único. Neste caso, será extraída a individual dactiloscópica, se no local existir esse serviço. 

**Assento Posterior ao Enterro:** Art. 83. Quando o assento for posterior ao enterro, faltando atestado de médico ou de duas pessoas qualificadas, assinarão, com a que fizer a declaração, duas testemunhas que tiverem assistido ao falecimento ou ao funeral e puderem atestar, por conhecimento próprio ou por informação que tiverem colhido, a identidade do cadáver. (Renumerado do art. 84 pela Lei nº 6.216, de 1975). 

**Cremação de Cadáver** : Art. 77 § 2º A cremação de cadáver somente será feita daquele que houver manifestado a vontade de ser incinerado ou no interesse da saúde pública e se o atestado de óbito houver sido firmado por 2 (dois) médicos ou por 1 (um) médico legista e, no caso de morte violenta, depois de autorizada pela autoridade judiciária. (Incluído pela Lei nº 6.216, de 1975). 

**Idade do Falecido** : Caso a data de nascimento do falecido seja informada, a idade será calculada automaticamente. Quando essa data for desconhecida, a idade pode ser informada manualmente. 

**Natimorto** : Para os casos em que o falecido seja um natimorto, o tipo do livro (pertencente à matrícula do registro) deve possuir o valor "5". 

--- end of page.page_number=37 ---

P á g i n a | 38 

SIRC – Sistema Nacional de Informação de Registro Civil 

## _**5.5 Registro Civil Efetuado no Exterior**_ 

Para os registros civis efetuados no exterior[12] e posteriormente transcritos no Brasil são apresentados campos complementares para o preenchimento do usuário, são eles: 

- _Órgão Emissor do Documento Original;_ 

- _CNS do Consulado;_ 

- _Informações Complementares sobre o Consulado._ 

Além dos campos complementares, existem algumas particularidades desse tipo de registro, como segue: 

- Para o **registro de nascimento não é permitido** o preenchimento dos seguintes campos: 

   - UF/Município de Nascimento do Registrado; 

   - Local de Nascimento do Registrado; 

   - DNV. 

- Para o **registro de nascimento deve ser permitido** o preenchimento dos seguintes campos: 

   - País de Nascimento do Registrado; 

   - Nacionalidade do Registrado. 

- Para o **registro de óbito não é permitido** o preenchimento dos seguintes campos: 

   - DO; 

   - Endereço do local de falecimento no Brasil (É permitido somente que esse endereço seja no exterior). 

- Para o **registro de óbito deve ser permitido** o preenchimento dos seguintes campos: 

   - País de falecimento do Registrado. 

- Para o **registro de casamento devem ser incluídas** as seguintes opções: 

   - Opção "Outros" no campo Regime de Casamento; 

   - Opção "Outros" para o preenchimento de documento dos cônjuges; 

   - País de celebração do casamento. 

Para os registros civis do exterior não existem campos obrigatórios, além disso, as validações são mais flexíveis. Obs: Seguem a mesma dinâmica dos registros civis judiciais. 

## _**5.6 Transferência de Arquivo de Movimento**_ 

Transferência de arquivo contendo movimento da serventia: A serventia autenticada no Sirc Web Internet somente poderá enviar arquivos contendo movimento da própria serventia. No caso de transferência através do Sirc Web Intranet o usuário da GEX poderá enviar arquivos de quaisquer serventias. 

12 

--- end of page.page_number=38 ---

P á g i n a | 39 

SIRC – Sistema Nacional de Informação de Registro Civil 

## _**5.7 Cancelamento de Termos**_ 

Esta funcionalidade deve ser utilizada apenas para termos que não foram utilizados para fins de registro civil e/ou que foram cancelados no livro pela serventia. 

Para o cancelamento de termos, os campos a seguir são **obrigatórios** : 

- _Motivo;_ 

- _Tipo Registro Civil;_ 

- _Código Serventia;_ 

- _Acervo;_ 

- _Tipo de Serviço;_ 

- _Número do Termo;_ 

- _Tipo do Livro;_ 

- _Ano do Registro;_ 

- _Número da Folha;_ 

- _Número do Livro_ . 

- Data de envio para CER é **opcional** . 

O termo cancelado é único para serventia, acervo e tipo de livro. Portanto, quando um 

termo é cancelado, não será permitido o registro de nenhuma outra matrícula que possua esses mesmos 4 campos. 

## **5.7.1 Cancelamento de um Termo Existente** 

Para cancelar um termo existente, deve-se seguir às seguintes regras: 

- a. O registro civil, cuja matrícula pretende-se cancelar, deve estar excluído no sistema; 

- b. A matrícula (associada ou não a um registro civil) não pode estar cancelada no sistema, ou seja, não se pode cancelar uma matrícula já cancelada previamente. 

## **5.7.2 Cancelamento de um Termo Inexistente** 

Para cancelar um termo inexistente, a matrícula não deve existir no sistema, isto é, matrículas nunca utilizadas em Registros Civis com ou sem histórico associado. 

## _**5.8 Declaração de Inexistência**_ 

São passíveis de declaração de inexistência, os seguintes tipos de registro: 

- Nascimento (livro 1) 

- Casamento (livros 2 e 3) 

- Óbito (livro 4) 

- Natimorto (livro 5) 

Obs.: 

É dispensado o envio de declaração de inexistência de movimento para o livro 7. É obrigatório o envio de declaração de inexistência de movimento para o livro 5 (natimorto) a partir da competência 07/2019. 

--- end of page.page_number=39 ---

P á g i n a | 40 

SIRC – Sistema Nacional de Informação de Registro Civil 

## _**5.9 Anotação, Averbação e Retificação**_ 

**Dados de retificação são informados quando efetuados no registro da Serventia. Para a simples correção de erro de digitação no SIRC basta alterar o campo correspondente.** 

## **5.9.1 Anotação** 

Motivos e campos da anotação: 

Deve ser informada a matrícula ou o complemento da anotação. O preenchimento de ao menos um dos campos é obrigatório. 

Quando da seleção do motivo “Outros”, o complemento é obrigatório. 

## **5.9.2 Averbação** 

Motivos e campos da averbação: 

Quando da seleção do motivo “Outros”, o complemento é obrigatório. 

## **5.9.3 Retificação** 

Motivos e campos da retificação: 

Em caso de retificação, o registro civil deve ter ao menos um campo alterado ou o complemento da retificação deve ser preenchido. 

--- end of page.page_number=40 ---

P á g i n a | 41 

SIRC – Sistema Nacional de Informação de Registro Civil 

## **6 Conteúdo do Arquivo do Movimento** 

O arquivo de movimento, a ser submetido ao SIRC, deve conter toda a movimentação da serventia em relação aos registros civis pertencentes a ela, quais sejam: 

- Registros de Nascimento; 

- Registros de Casamento; 

- Registros de Óbito; 

- Cancelamento de Termos; 

- Declarações de Inexistência de Movimentos. 

## _**6.1 Registro de Nascimento**_ 

O Quadro 1 demonstra situações que podem ser encontradas dentro de um arquivo de movimento de registro de nascimento. 

|Inclusão de Registro de Nascimento<br><registroNascimentoInclusao>|Inclusão de Registro de Nascimento<br><registroNascimentoInclusao>|Inclusão de Registro de Nascimento<br><registroNascimentoInclusao>|
|---|---|---|
|[Dados do registro de nascimento]<br></registroNascimentoInclusao>|||
|Alteração de Registro de Nascimento<br><registroNascimentoAlteracao>|||
|[Dados do registro de nascimento]<br></registroNascimentoAlteracao><br>Obs: Devem ser enviados**todos**os dados do<br>registro. Os campos que não forem enviados<br>terão seus valores considerados_NULL13_.|||
|Exclusão de Registro de Nascimento<br><registroNascimentoExclusao>|||
||[Dados do registro de nascimento]<br></registroNascimentoExclusao>||
|Legenda:|<br>Inclusão<br>Alteração<br>Exclusão|13 **O termo é usado para representar algo sem valor definido.**|



**Quadro 1 - Situações encontradas no envio de arquivo de movimento de registro de nascimento.** 

## Para a **inserção ou alteração** de um **registro de nascimento** , os campos mínimos 

necessários são: 

- Matrícula do Registro; 

- Nome; 

- Data de Nascimento ou Marcador de Data de Nascimento Ignorada; 

- Hora de Nascimento ou Marcador de Hora Ignorada; 

- Município de Nascimento ou Marcador Municipio de Nascimento Ignorado; 

- Sexo; 

- Data do Registro de Nascimento; 

- CPF ou Marcador de CPF Ignorado; 

- Local de Nascimento; 

- Número da DNV ou Marcador de Inexistência de DNV. 

De acordo com as regras de negócio do sistema, outros campos podem se tornar obrigatórios. 

--- end of page.page_number=41 ---

P á g i n a | 42 

## SIRC – Sistema Nacional de Informação de Registro Civil 

Existe também a possibilidade de cadastramento de registros de nascimento judiciais. Nesta modalidade, os dados podem ser enviados de acordo com a sua existência. Nesta modalidade, os dados podem ser enviados de acordo com a sua existência. Os dados básicos necessários para o preenchimento desse tipo de registro são: Matrícula; Número do Processo; Data da Sentença e Data do Registro. Torna-se desnecessária a apuração de campos obrigatórios uma vez que já preenchem esses quesitos o número de processo e a data de sentença. O fato de ser um Tipo de registro judicial já o considera como justificado. Neste caso, a tag <registroJudicial> deve ser informada como “true”. Os demais comportamentos e regras continuam com seu funcionamento normal. 

Para os registros de nascimento efetuados no exterior e posteriormente transcritos no Brasil devem ser seguidas as regras apresentadas em capítulo anterior. 

## **Layout do Registro de Nascimento** 

**Matrícula do Registro** Serventia Acervo Tipo Ano do Registro Tipo do Livro Número do Livro Número da Folha Número do Termo Dígito verificador da matrícula **Dados do Nascido** Nome do Individuo Data de Nascimento Data de Nascimento Ignorada Hora de Nascimento Hora Ignorada Sexo Data do Registro CPF Município de Nascimento – Código IBGE Município de Nascimento Ignorado – Código IBGE Local de nascimento DNV DNV Inexistente 

--- end of page.page_number=42 ---

P á g i n a | 43 

SIRC – Sistema Nacional de Informação de Registro Civil 

Existência de gêmeo(s) Quantidade de gêmeos (irmãos) País de Nascimento* Nacionalidade* **Filiação (Cada registrado pode possuir múltiplas filiações)** Nome da Filiação Sexo da Filiação Data de Nascimento da Filiação Idade da Filiação País de Nascimento da Filiação Município de Nascimento da Filiação – Código do IBGE Município/UF de Nascimento da Filiação – Campo Livre (Caso não conste na lista de municípios do IBGE) Nacionalidade da Filiação Profissão da Filiação Documentos da Filiação **Progenitores ** (Os progenitores estão vinculados a filiação do registrado, sendo que podem existir múltiplos progenitores para cada uma das filiações)** Nome do Progenitor Sexo do Progenitor Logradouro de Domicílio da Filiação Numero de Domicílio da Filiação Complemento de Domicílio da Filiação Bairro de Domicílio da Filiação Município de Domicílio da Filiação Domicílio Estrangeiro da Filiação Impressos de Segurança (habilitados somente na alteração de registros)*** Observações Anotações, Averbações e Retificações Justificativa de ausência dos campos obrigatórios em lei Códigos das Justificativas de ausência dos campos obrigatórios em lei Órgão Emissor do Documento Original * CNS do Consulado * Informações Complementares sobre o Consulado * 

## **Quadro 2 - Campos de um registro de nascimento.** 

- Somente para os registros civis efetuados no exterior e posteriormente transcritos no Brasil. 

- ** O envio dos nomes dos progenitores, ainda que existentes, é opcional. 

*** O envio da informação é opcional, ainda que existente. 

--- end of page.page_number=43 ---

P á g i n a | 44 

SIRC – Sistema Nacional de Informação de Registro Civil 

## _**6.2 Registro de Óbito**_ 

O Quadro 3 demonstra situações que podem ser encontradas dentro de um arquivo de movimento de registro de óbito. 

|Inclusão de Registro de Óbito<br><registroObitoInclusao>|Inclusão de Registro de Óbito<br><registroObitoInclusao>|Inclusão de Registro de Óbito<br><registroObitoInclusao>|
|---|---|---|
|[Dados do registro de óbito]<br></registroObitoInclusao>|||
|Alteração de Registro de Óbito<br><registroObitoAlteracao>|||
|[Dados do registro de óbito]<br></registroObitoAlteracao><br>Obs: Devem ser enviados**todos**os dados do<br>registro. Os campos que não forem enviados<br>terão seus valores considerados_NULL14_.|||
|Exclusão de Registro de Óbito<br><registroObitoExclusao>|||
||[Dados do registro de óbito]<br></registroObitoExclusao>||
|Legenda:|Inclusão<br>Alteração<br>Exclusão|14 **O termo é usado para representar algo sem valor definido.**|



**Quadro 3 - Situações encontradas no envio de arquivo de movimento de registro de óbito.** 

Com a exceção dos campos Matrícula do Registro e Data da Lavratura do Óbito, os demais campos podem ter sua informação ignorada quando ela não existir. 

Existe também a possibilidade de cadastramento de registros de óbito judiciais. Nesta modalidade, os dados podem ser enviados de acordo com a sua existência. Os dados básicos necessários para o preenchimento desse tipo de registro são: Matrícula; Número do Processo; Data da Sentença e Data da Lavratura do Registro. Torna-se desnecessária a apuração de campos obrigatórios uma vez que já preenchem esses quesitos o número de processo e a data de sentença. O fato de ser um Tipo de registro judicial já o considera como justificado. Neste caso, a tag <registroJudicial> deve ser informada como “true”. Os demais comportamentos e regras continuam com seu funcionamento normal. 

Para os registros de óbito efetuados no exterior e posteriormente transcritos no Brasil devem ser seguidas as regras apresentadas em capítulo anterior. 

## **Layout do Registro de Óbito** 

**Matrícula do Registro** Serventia Acervo Tipo Ano do Registro Tipo do Livro Número do Livro Número da Folha Número do Termo 

--- end of page.page_number=44 ---

P á g i n a | 45 

SIRC – Sistema Nacional de Informação de Registro Civil 

Dígito verificador da matrícula 

**Cronologia e Número da Declaração de Óbito** Número da DO (Declaração de Óbito) Data de Lavratura do Falecimento Hora do Falecimento Data do Falecimento 

## **Lugar do falecimento, com indicação precisa** 

País de falecimento** Tipo do Local de Falecimento Nome do Local de Falecimento Logradouro do Local de Falecimento Número do Local de Falecimento Complemento do Local de Falecimento Bairro do Local de Falecimento Município do Local de Falecimento – Código do IBGE Domicílio Estrangeiro do Local de Falecimento 

## **Dados do Falecido** 

Nome Sexo Data de Nascimento Idade Raça/Cor * Profissão País de Nascimento Município de Nascimento – Código do IBGE Município/UF de Nascimento – Campo Livre (Caso não conste na lista de municípios do IBGE) Nacionalidade Estado Civil 

## **Domicílio do Falecido** 

Logradouro de Domicílio e Residência do Falecido Número de Domicílio e Residência do Falecido Complemento de Domicílio e Residência do Falecido Bairro de Domicílio e Residência do Falecido Município de Domicílio e Residência do Falecido – Código IBGE Domicílio Estrangeiro do Falecido 

## **Filiação** 

## **(Cada registrado pode possuir múltiplas filiações)** 

Nome da Filiação Sexo da Filiação 

--- end of page.page_number=45 ---

P á g i n a | 46 

SIRC – Sistema Nacional de Informação de Registro Civil 

Data de Nascimento da Filiação *** Documentos da Filiação (preferencialmente **CPF** ) *** País de Nascimento da Filiação * Município de Nascimento da Filiação – Código do IBGE * Município/UF de Nascimento da Filiação – Campo Livre (Caso não conste na lista de municípios do IBGE) * Nacionalidade da Filiação * Profissão da Filiação * **Se a morte foi natural ou violenta e a causa conhecida, com o nome dos atestantes** Tipo da Morte Causa Conhecida Nome do Atestante Primário **Lugar do Sepultamento** Lugar do Sepultamento (Município/Cemitério) Era eleitor Documentos do Falecido (preferencialmente **CPF** ) Número do Benefício do INSS Nome do Declarante Documentos Declarante (preferencialmente **CPF** ) Impressos de Segurança (habilitados somente na alteração de registros)* Observações Anotações, Averbações e Retificações Justificativa de ausência dos campos obrigatórios em lei Códigos das Justificativas de ausência dos campos obrigatórios em lei Órgão Emissor do Documento Original ** CNS do Consulado ** IRC – Sistema Nacional de Informação de Registro Civil Informações Complementares sobre o Consulado ** 

## **Quadro 4 - Campos de um registro de óbito.** 

* Envio opcional da informação, ainda que existente. 

** Somente para os registros civis efetuados no exterior e posteriormente transcritos no Brasil. 

*** Obrigatórios para livro 5 (natimorto) 

--- end of page.page_number=46 ---

P á g i n a | 47 

SIRC – Sistema Nacional de Informação de Registro Civil 

## _**6.3 Registro de Casamento**_ 

O Quadro 5 demonstra situações que podem ser encontradas dentro de um arquivo de movimento de registro de óbito. 

|Inclusão de Registro de Casamento<br><registroCasamentoInclusao>|Inclusão de Registro de Casamento<br><registroCasamentoInclusao>|Inclusão de Registro de Casamento<br><registroCasamentoInclusao>|
|---|---|---|
|[Dados do registro de Casamento]<br></registroCasamentoInclusao>|||
|Alteração de Registro de Casamento<br><registroCasamentoAlteracao>|||
|[Dados do registro de Casamento]<br></registroCasamentoAlteracao><br>Obs: Devem ser enviados**todos**os dados do<br>registro. Os campos que não forem enviados<br>terão seu valores considerados_NULL15_.|||
|Exclusão de Registro de Casamento<br><registroCasamentoExclusao>|||
||[Dados do registro de Casamento]<br></registroCasamentoExclusao>||
|Legenda:|<br>Inclusão<br>Alteração<br>Exclusão|15 **O termo é usado para representar algo sem valor definido.**|



**Quadro 5 - Situações encontradas no envio de arquivo de movimento de registro de casamento.** 

Com a exceção dos campos Matrícula do Registro; Nomes; Sexo dos Cônjuges e Data de Registro do Casamento, os demais campos podem ter sua informação ignorada quando ela não existir. 

Existe também a possibilidade de cadastramento de registros de casamento judiciais. Nesta modalidade, os dados podem ser enviados de acordo com a sua existência. Os dados básicos necessários para o preenchimento desse tipo de registro são: Matrícula; Número do Processo; Data da Sentença e Data do Registro. Torna-se desnecessária a apuração de campos obrigatórios uma vez que já preenchem esses quesitos o número de processo e a data de sentença. O fato de ser um Tipo de registro judicial já o considera como justificado. Neste caso, a tag <registroJudicial> deve ser informada como “true”. Os demais comportamentos e regras continuam com seu funcionamento normal. 

Para os registros de casamento efetuados no exterior e posteriormente transcritos no Brasil devem ser seguidas as regras apresentadas em capítulo anterior. 

**Layout do Registro de Casamento Matrícula do Registro** Serventia Acervo Tipo Ano do Registro Tipo do Livro Número do Livro 

--- end of page.page_number=47 ---

P á g i n a | 48 

## SIRC – Sistema Nacional de Informação de Registro Civil 

Número da Folha Número do Termo Dígito verificador da matrícula **Dados do Casamento** Data da publicação dos proclamas Data da celebração do casamento Data de registro do casamento Regime de casamento Data em cujas notas foi tomada a escritura ante-nupcial * Serventia em cujas notas foi tomada a escritura ante-nupcial * País de celebração do casamento **Casamento Religioso** Descrição do Local Município do Local – Código do IBGE Qualidade do celebrante * Nome do celebrante * **Dados do Cônjuge (Primeiro e Segundo Cônjuge)** Nome O nome, que passa a ter o cônjuge, em virtude do casamento Sexo Data de Nascimento Profissão País de Nascimento Município de Nascimento – Código do IBGE Município/UF de Nascimento – Campo Livre (Caso não conste na lista de municípios do IBGE) Nacionalidade Nome do cônjuge precedente Data da dissolução do casamento anterior Documentos do cônjuge (preferencialmente **CPF** ) **Domicílio e Residência do Cônjuge** Logradouro * Número * Complemento * Bairro * Município – Código do IBGE Domicílio Estrangeiro **Filiação do Cônjuge (Cada cônjuge pode possuir múltiplas filiações)** Nome da Filiação 

--- end of page.page_number=48 ---

P á g i n a | 49 

SIRC – Sistema Nacional de Informação de Registro Civil 

Sexo da Filiação País de Nascimento * Município de Nascimento – Código do IBGE * Município/UF de Nascimento – Campo Livre (Caso não conste na lista de municípios do IBGE) * Nacionalidade Data de Nascimento * Data de Falecimento * **Domicílio da Filiação** Logradouro de Domicílio da Filiação * Número de Domicílio da Filiação * Complemento de Domicílio da Filiação * Bairro de Domicílio da Filiação * Município de Domicílio da Filiação * Domicílio Estrangeiro da Filiação * Impressos de Segurança (habilitados somente na alteração de registros) * Observações * Anotações, Averbações e Retificações Justificativa no caso de ausência de preenchimento de campos obrigatórios Códigos das Justificativas no caso de ausência de preenchimento de campos obrigatórios Órgão Emissor do Documento Original ** CNS do Consulado ** Informações Complementares sobre o Consulado ** 

**Quadro 6 - Campos de um registro de casamento.** 

* O envio da informação é opcional, ainda que existente 

- ** Somente para os registros civis efetuados no exterior e posteriormente transcritos no Brasil. 

--- end of page.page_number=49 ---

P á g i n a | 50 

## SIRC – Sistema Nacional de Informação de Registro Civil 

## _**6.4 Cancelamento de Termo**_ 

O Quadro 7 demonstra situações que podem ser encontradas dentro de um arquivo de movimento de cancelamento de termo. 

Inclusão de Registro de Termo Cancelado <registroTermoCancelado> [Dados do registro de Cancelamento] </registroTermoCancelado> Legenda: Inclusão 

**Quadro 7 - Situações encontradas no envio de arquivo de movimento de cancelamento de termo.** 

**==> picture [431 x 270] intentionally omitted <==**

**----- Start of picture text -----**<br>
Layout do Registro de Cancelamento de Termo<br>Motivo<br>Tipo do Registro Civil<br>Código da Serventia<br>Acervo<br>Tipo do Serviço<br>Termo<br>Tipo do Livro<br>Ano do Registro<br>Data de Envio para CER *<br>Dígito Verificador da Matrícula<br>Número da Folha<br>Número do Livro<br>**----- End of picture text -----**<br>


**Quadro 8 - Campos de um termo cancelado.** 

- O envio da informação é opcional, ainda que existente 

--- end of page.page_number=50 ---

P á g i n a | 51 

SIRC – Sistema Nacional de Informação de Registro Civil 

## _**6.5 Declaração de Inexistência de Movimento**_ 

O Quadro 9 demonstra situações que podem ser encontradas dentro de um arquivo de 

movimento de declaração de inexistência de movimento de termos. 

Inclusão de Declaração de Inexistência de Movimento < declaracaoInexistenciaMovimentoTO> [Dados da Declaração por Competência] </declaracaoInexistenciaMovimentoTO> Legenda: Inclusão 

**Quadro 9 - Situações encontradas no envio de arquivo de movimento de declaração de inexistência.** 

**Layout do Registro de Declaração de Inexistência de Movimento** Competência Indicador de inexistência de movimento de Casamento Indicador de inexistência de movimento de Nascimento Indicador de inexistência de movimento de Óbito Indicador de inexistência de movimento de Natimorto 

**Quadro 10 - Campos de uma declaração de inexistência de movimento por competência.** 

--- end of page.page_number=51 ---

P á g i n a | 52 

## SIRC – Sistema Nacional de Informação de Registro Civil 

## **7 Layout XML do Movimento** 

Os dados apresentados no exemplo **são fictícios** , esses devem ser trocados pelos dados reais dos registros a serem enviados ao SIRC. 

## _**7.1 Exemplo 1 – Registro de Nascimento (Versão layout 5.0)**_ 

## **`<movimentoNascimentoTO>`** 

```
<versaoLayoutNascimento>5.0</versaoLayoutNascimento>
<registroNascimentoInclusao>
<acervo>1</acervo>
<anoRegistro>2023</anoRegistro>
<codServentia>100719</codServentia>
<dataRegistro>2023-11-30T00:00:00.000-03:00</dataRegistro>
<dvMatricula>30</dvMatricula>
<folha>002</folha>
<numeroLivro>00001</numeroLivro>
```

```
<observacoes>Observacoes do Registro</observacoes>
<registroJudicial>false</registroJudicial>
<termo>000010</termo>
<tipoLivro>1</tipoLivro>
<tipoServico>55</tipoServico>
<bairroFiliacao>Centro</bairroFiliacao>
<codigoIBGEMunicipio>314230</codigoIBGEMunicipio>
<codigoIBGEMunicipioFiliacao>314260</codigoIBGEMunicipioFiliacao>
<codigoIBGEMunicipioFiliacaoIgnorado>false
</codigoIBGEMunicipioFiliacaoIgnorado>
<complementoLogradouroFiliacao>apto 1029
</complementoLogradouroFiliacao>
<cpf>00632515074</cpf>
<dataNascimento>01/01/2016</dataNascimento>
<dnv>00015112015</dnv>
<dnvInexistente>false</dnvInexistente>
<filiacoesNascimento>
<codigoIBGEMunicipioNaturalidade>120001
</codigoIBGEMunicipioNaturalidade>
<codigoOcupacaoSDC>376205</codigoOcupacaoSDC>
<codigoOcupacaoSDCIgnorado>false</codigoOcupacaoSDCIgnorado>
<documentos>
<dono>FILIACAO_NASCIMENTO</dono>
<numero>11111111116</numero>
<tipo>NIT</tipo>
</documentos>
<documentos>
<dono>FILIACAO_NASCIMENTO</dono>
<numero>97190858008</numero>
<tipo>CPF</tipo>
</documentos>
<cpfIgnorado>false</cpfIgnorado>
<documentosIgnorado>false</documentosIgnorado>
<idade>19</idade>
<idadeIgnorada>false</idadeIgnorada>
<municipioNaturalidadeIgnoradoDuplo>false
</municipioNaturalidadeIgnoradoDuplo>
<nacionalidade>76</nacionalidade>
<nacionalidadeIgnorada>false</nacionalidadeIgnorada>
<nome>Maria da Silva Carga</nome>
<nomeIgnorado>false</nomeIgnorado>
<paisNascimento>76</paisNascimento>
<paisNascimentoIgnorado>false</paisNascimentoIgnorado>
<progenitores>
<nome>Joao da Silva Carga</nome>
<nomeEspecial>false</nomeEspecial>
<sexo>MASCULINO</sexo>
</progenitores>
<progenitores>
<nome>Mariana da Silva Carga</nome>
<sexo>FEMININO</sexo>
</progenitores>
<sexo>FEMININO</sexo>
<sexoIgnorado>false</sexoIgnorado>
</filiacoesNascimento>
<filiacoesNascimento>
<codigoIBGEMunicipioNaturalidade>313860
</codigoIBGEMunicipioNaturalidade>
```

--- end of page.page_number=52 ---

P á g i n a | 53 

## SIRC – Sistema Nacional de Informação de Registro Civil 

```
<codigoOcupacaoSDC>322420</codigoOcupacaoSDC>
<codigoOcupacaoSDCIgnorado>false</codigoOcupacaoSDCIgnorado>
<documentos>
```

```
<dono>FILIACAO_NASCIMENTO</dono>
<numero>11111111116</numero>
<tipo>NIT</tipo>
</documentos>
<documentos>
<dono>FILIACAO_NASCIMENTO</dono>
<numero>89208881083</numero>
<tipo>CPF</tipo>
</documentos>
<cpfIgnorado>false</cpfIgnorado>
<documentosIgnorado>false</documentosIgnorado>
<idade>19</idade>
<idadeIgnorada>false</idadeIgnorada>
<municipioNaturalidadeIgnoradoDuplo>false
</municipioNaturalidadeIgnoradoDuplo>
<nacionalidade>76</nacionalidade>
<nacionalidadeIgnorada>false</nacionalidadeIgnorada>
<nome>Jose da Silva Carga</nome>
<nomeIgnorado>false</nomeIgnorado>
<paisNascimento>76</paisNascimento>
<paisNascimentoIgnorado>false</paisNascimentoIgnorado>
<progenitores>
<nome>Maria da Silva Carga</nome>
<sexo>FEMININO</sexo>
</progenitores>
<progenitores>
<nome>Jose da Silva Carga</nome>
<sexo>MASCULINO</sexo>
</progenitores>
<sexo>MASCULINO</sexo>
```

```
<sexoIgnorado>false</sexoIgnorado>
</filiacoesNascimento>
<horaNascimento>14:32</horaNascimento>
<horaNascimentoIgnorada>false</horaNascimentoIgnorada>
<impressosSegurancaNascimento>
<dataUtilizacao>2016-01-02T00:00:00-03:00</dataUtilizacao>
<numeroSerie>AA000000001</numeroSerie>
<segundaVia>false</segundaVia>
</impressosSegurancaNascimento>
<local>UNIDADE_SAUDE</local>
<logradouroFiliacao>Logradouro da Filiação</logradouroFiliacao>
<logradouroFiliacaoIgnorado>false</logradouroFiliacaoIgnorado>
<nome>NILDO DA SILVA</nome>
<nomeEspecial>false</nomeEspecial>
<numeroLogradouroFiliacao>1234</numeroLogradouroFiliacao>
<numeroLogradouroFiliacaoIgnorado>false
</numeroLogradouroFiliacaoIgnorado>
<possuiGemeos>false</possuiGemeos>
<sexo>MASCULINO</sexo>
</registroNascimentoInclusao>
```

```
</movimentoNascimentoTO>
```

--- end of page.page_number=53 ---

P á g i n a | 54 

## SIRC – Sistema Nacional de Informação de Registro Civil 

## _**7.2 Exemplo 2 – Registro de Óbito (Versão layout 5.0)**_ 

## **`<movimentoObitoTO>`** 

```
<versaoLayoutObito>5.0</versaoLayoutObito>
<registroObitoInclusao>
<acervo>1</acervo>
<anoRegistro>2023</anoRegistro>
<codServentia>149468</codServentia>
<dataRegistro>2023-11-30T00:00:00</dataRegistro>
<dvMatricula>17</dvMatricula>
<folha>001</folha>
<numeroLivro>10000</numeroLivro>
<registroJudicial>false</registroJudicial>
<termo>0000002</termo>
<tipoLivro>4</tipoLivro>
<tipoServico>55</tipoServico>
<beneficiosPrevidenciariosIgnorado>true
</beneficiosPrevidenciariosIgnorado>
<causaMorteConhecida>Síndrome Neoplásica, Neoplasia Maligna de Madibuna</causaMorteConhecida>
<causaMorteConhecidaIgnorada>false</causaMorteConhecidaIgnorada>
<codigoIBGEMunicipioLogradouro>251540</codigoIBGEMunicipioLogradouro>
<codigoIBGEMunicipioLogradouroIgnorado>false
</codigoIBGEMunicipioLogradouroIgnorado>
<codigoIBGEMunicipioLogradouroObito>250400
</codigoIBGEMunicipioLogradouroObito>
<codigoIBGEMunicipioLogradouroObitoIgnorado>false
</codigoIBGEMunicipioLogradouroObitoIgnorado>
<codigoIBGEMunicipioNaturalidade>251110
</codigoIBGEMunicipioNaturalidade>
<corPeleIgnorada>true</corPeleIgnorada>
<dataNascimentoFalecido>1970-09-09T00:00:00</dataNascimentoFalecido>
<dataNascimentoFalecidoIgnorada>false</dataNascimentoFalecidoIgnorada>
<dataObito>20/09/2023</dataObito>
<dataObitoIgnorada>false</dataObitoIgnorada>
<declaracaoObito>292010958</declaracaoObito>
<declaracaoObitoIgnorada>false</declaracaoObitoIgnorada>
<documentosDeclarante>
<dono>DECLARANTE</dono>
<numero>09363240401</numero>
<tipo>CPF</tipo>
</documentosDeclarante>
<documentosFalecido>
<dono>FALECIDO</dono>
<numero>41260961400</numero>
<tipo>CPF</tipo>
</documentosFalecido>
<documentosFalecido>
<dono>FALECIDO</dono>
<numero>011272771651</numero>
<tipo>TITULO_DE_ELEITOR</tipo>
</documentosFalecido>
<cpfFalecidoIgnorado>false</cpfFalecidoIgnorado>
<documentosFalecidoIgnorado>false</documentosFalecidoIgnorado>
<estadoCivil>CASADO</estadoCivil>
<estadoCivilIgnorado>false</estadoCivilIgnorado>
<filiacoesObito>
<dataNascimentoIgnorada>true</dataNascimentoIgnorada>
<cpfIgnorado>true</cpfIgnorado>
<documentosIgnorado>true</documentosIgnorado>
<nacionalidadeIgnorada>true</nacionalidadeIgnorada>
<!--
************************************************************************************* -->
<!-- FILIACAO 1 -->
<nome>JOSE PEREIRA DA SILVA</nome>
<nomeEspecial>false</nomeEspecial>
<nomeIgnorado>false</nomeIgnorado>
<paisNascimentoIgnorado>true</paisNascimentoIgnorado>
<sexo>MASCULINO</sexo>
<sexoIgnorado>false</sexoIgnorado>
</filiacoesObito>
<filiacoesObito>
<dataNascimentoIgnorada>true</dataNascimentoIgnorada>
<cpfIgnorado>true</cpfIgnorado>
<documentosIgnorado>true</documentosIgnorado>
<nacionalidadeIgnorada>true</nacionalidadeIgnorada>
<!-- FILIACAO 2 -->
<nome>MARIA ALVES</nome>
<nomeEspecial>false</nomeEspecial>
<nomeIgnorado>false</nomeIgnorado>
```

--- end of page.page_number=54 ---

P á g i n a | 55 

## SIRC – Sistema Nacional de Informação de Registro Civil 

```
<paisNascimentoIgnorado>true</paisNascimentoIgnorado>
<sexo>FEMININO</sexo>
<sexoIgnorado>false</sexoIgnorado>
</filiacoesObito>
<horaObito>10:20</horaObito>
<horaObitoIgnorada>false</horaObitoIgnorada>
<logradouro>Rua José Barbosa de Medeiros, centro, CEP: 58159-000</logradouro>
<logradouroIgnorado>false</logradouroIgnorado>
<logradouroObito>Maternidade da FAP</logradouroObito>
<logradouroObitoIgnorado>false</logradouroObitoIgnorado>
<lugarSepultamentoCemiterio>CEMITÉRIO PÚBLICO São Vicente do Seridó
PB</lugarSepultamentoCemiterio>
<lugarSepultamentoCemiterioIgnorado>false</lugarSepultamentoCemiterioIgnorado>
<nacionalidadeIgnorada>true</nacionalidadeIgnorada>
<!-- REGISTRADO -->
<nome>PAULO MARCOS SILVA</nome>
<nomeEspecial>false</nomeEspecial>
<!-- DECLARANTE -->
<nomeDeclarante>ROBERTA MARIA</nomeDeclarante>
<nomeDeclaranteEspecial>false</nomeDeclaranteEspecial>
<nomeDeclaranteIgnorado>false</nomeDeclaranteIgnorado>
<nomeIgnorado>false</nomeIgnorado>
<nomeLocalObito>Maternidade da FAP</nomeLocalObito>
<nomeLocalObitoIgnorado>false</nomeLocalObitoIgnorado>
<numeroLogradouroIgnorado>true</numeroLogradouroIgnorado>
<numeroLogradouroObitoIgnorado>true</numeroLogradouroObitoIgnorado>
<paisNascimento>76</paisNascimento>
<paisNascimentoIgnorado>false</paisNascimentoIgnorado>
<!-- SEXO REGISTRADO -->
<sexo>MASCULINO</sexo>
<!-- ************************************************************************************* -->
<sexoIgnorado>false</sexoIgnorado>
<tipoLocalObito>HOSPITAL</tipoLocalObito>
<tipoLocalObitoIgnorado>false</tipoLocalObitoIgnorado>
<tipoMorteIgnorado>true</tipoMorteIgnorado>
<filiacaoNomesIguais>false</filiacaoNomesIguais>
</registroObitoInclusao>
```

```
</movimentoObitoTO>
```

--- end of page.page_number=55 ---

P á g i n a | 56 

SIRC – Sistema Nacional de Informação de Registro Civil 

## _**7.3 Exemplo 3 – Registro de Casamento (Versão layout 5.0)**_ 

```
<movimentoCasamentoTO>
```

```
<versaoLayoutCasamento>5.0</versaoLayoutCasamento>
<registroCasamentoInclusao>
<acervo>1</acervo>
<anoRegistro>2023</anoRegistro>
<codServentia>100719</codServentia>
<dataRegistro>2023-11-20T00:00:00.000-03:00</dataRegistro>
<!-- MATRÍCULA -->
<dvMatricula>10</dvMatricula>
<folha>002</folha>
<numeroLivro>10000</numeroLivro>
<observacoes>Observacoes de registro de casamento</observacoes>
<registroJudicial>false</registroJudicial>
<termo>0000101</termo>
<tipoLivro>2</tipoLivro>
<tipoServico>55</tipoServico>
<codigoServentiaEscrituraAntenupcial>123455
</codigoServentiaEscrituraAntenupcial>
<dataCelebracaoCasamento>2014-07-22T00:00:00-03:00
</dataCelebracaoCasamento>
<dataCelebracaoCasamentoIgnorada>false
</dataCelebracaoCasamentoIgnorada>
<dataEscrituraAntenupcial>2014-07-20T00:00:00-03:00
</dataEscrituraAntenupcial>
<dataPublicacaoProclamas>2014-07-21T00:00:00-03:00
</dataPublicacaoProclamas>
<!--CELEBRANTE -->
<nomeCelebranteCasamentoReligioso>JOAO SILVA</nomeCelebranteCasamentoReligioso>
<nomeCelebranteCasamentoReligiosoEspecial>false</nomeCelebranteCasamentoReligiosoEspecial>
<regimeCasamento>SEPARACAO_BENS</regimeCasamento>
<conjuge1>
<bairroConjuge>Centro</bairroConjuge>
<codigoIBGEMunicipioLogradouroConjuge>120001
</codigoIBGEMunicipioLogradouroConjuge>
<codigoIBGEMunicipioLogradouroConjugeIgnorado>false
</codigoIBGEMunicipioLogradouroConjugeIgnorado>
<codigoIBGEMunicipioNaturalidade>420245
</codigoIBGEMunicipioNaturalidade>
<codigoIBGEUFLogradouroConjuge>12</codigoIBGEUFLogradouroConjuge>
<codigoIBGEUFNaturalidade>42</codigoIBGEUFNaturalidade>
<codigoOcupacaoSDC>10205</codigoOcupacaoSDC>
<codigoOcupacaoSDCIgnorado>false</codigoOcupacaoSDCIgnorado>
<complementoLogradouroConjuge>Complemento endereço
</complementoLogradouroConjuge>
<dataNascimento>1982-06-21T00:00:00-03:00</dataNascimento>
<dataNascimentoIgnorada>false</dataNascimentoIgnorada>
<documentosConjuge>
<dono>CONJUGE1</dono>
<numero>11111111116</numero>
<tipo>NIT</tipo>
</documentosConjuge>
<documentosConjuge>
<dono>CONJUGE1</dono>
<numero>11111111111</numero>
<tipo>RIC</tipo>
</documentosConjuge>
<documentosConjuge>
<dataEmissao>2014-07-23T00:00:00.000-03:00</dataEmissao>
<dono>CONJUGE1</dono>
<numero>123456789</numero>
<tipo>CNH</tipo>
</documentosConjuge>
<cpfConjugeIgnorado>true</cpfConjugeIgnorado>
<documentosConjugeIgnorado>false</documentosConjugeIgnorado>
<filiacoesConjuge>
<bairro>Centro</bairro>
<codigoIBGEMunicipioLogradouro>430910
</codigoIBGEMunicipioLogradouro>
<codigoIBGEMunicipioNaturalidade>420245
</codigoIBGEMunicipioNaturalidade>
<codigoIBGEUFLogradouro>43</codigoIBGEUFLogradouro>
<codigoIBGEUFNaturalidade>42</codigoIBGEUFNaturalidade>
<complementoLogradouro>Complemento endereço</complementoLogradouro>
<dataFalecimento>1997-08-31T00:00:00-03:00</dataFalecimento>
<dataFalecimentoIgnorada>false</dataFalecimentoIgnorada>
```

--- end of page.page_number=56 ---

P á g i n a | 57 

## SIRC – Sistema Nacional de Informação de Registro Civil 

```
<dataNascimento>1961-07-01T00:00:00-03:00</dataNascimento>
<dataNascimentoIgnorada>false</dataNascimentoIgnorada>
<logradouro>Palacio de Buckingham</logradouro>
<municipioNaturalidadeIgnoradoDuplo>false
</municipioNaturalidadeIgnoradoDuplo>
<nacionalidade>76</nacionalidade>
<nacionalidadeIgnorada>false</nacionalidadeIgnorada>
<!-- FILIAÇÃO 1 CONJUGE 1 -->
<nome>AMANDA SOUZA</nome>
<nomeEspecial>false</nomeEspecial>
<nomeIgnorado>false</nomeIgnorado>
<numeroLogradouro>1</numeroLogradouro>
<paisNascimento>76</paisNascimento>
<paisNascimentoIgnorado>false</paisNascimentoIgnorado>
<sexo>FEMININO</sexo>
<sexoIgnorado>false</sexoIgnorado>
</filiacoesConjuge>
<filiacoesConjuge>
<bairro>Centro</bairro>
<codigoIBGEMunicipioLogradouro>120001
</codigoIBGEMunicipioLogradouro>
<codigoIBGEMunicipioNaturalidade>120001
</codigoIBGEMunicipioNaturalidade>
<complementoLogradouro>Complemento endereço</complementoLogradouro>
<dataFalecimento>1997-08-31T00:00:00-03:00</dataFalecimento>
<dataFalecimentoIgnorada>false</dataFalecimentoIgnorada>
<dataNascimento>1961-07-01T00:00:00-03:00</dataNascimento>
<dataNascimentoIgnorada>false</dataNascimentoIgnorada>
<logradouro>Palacio de Buckingham</logradouro>
<municipioNaturalidadeIgnoradoDuplo>false
</municipioNaturalidadeIgnoradoDuplo>
<nacionalidade>76</nacionalidade>
<nacionalidadeIgnorada>false</nacionalidadeIgnorada>
<!-- FILIAÇÃO 2 CONJUGE 1 -->
<nome>TIBURCIO SAULO</nome>
<nomeEspecial>false</nomeEspecial>
<nomeIgnorado>false</nomeIgnorado>
<numeroLogradouro>1</numeroLogradouro>
<paisNascimento>76</paisNascimento>
<paisNascimentoIgnorado>false</paisNascimentoIgnorado>
<sexo>FEMININO</sexo>
<sexoIgnorado>false</sexoIgnorado>
</filiacoesConjuge>
<logradouroConjuge>Palacio de Buckingham</logradouroConjuge>
<logradouroConjugeIgnorado>false</logradouroConjugeIgnorado>
<municipioNaturalidadeIgnoradoDuplo>false
</municipioNaturalidadeIgnoradoDuplo>
<nacionalidade>76</nacionalidade>
<nacionalidadeIgnorada>false</nacionalidadeIgnorada>
<!--CONJUGE 1 -->
<nome>TIBURCIO SILVA</nome>
<nomeEspecial>false</nomeEspecial>
<nomeConjugePosCasamento>TIBURCIO SILVA</nomeConjugePosCasamento>
<nomeConjugePosCasamentoEspecial>false</nomeConjugePosCasamentoEspecial>
<nomeConjugePosCasamentoIgnorado>false</nomeConjugePosCasamentoIgnorado>
<nomeConjugePrecedente></nomeConjugePrecedente>
<numeroLogradouroConjuge>1</numeroLogradouroConjuge>
<numeroLogradouroConjugeIgnorado>false
</numeroLogradouroConjugeIgnorado>
<paisNascimento>76</paisNascimento>
<paisNascimentoIgnorado>false</paisNascimentoIgnorado>
<sexo>MASCULINO</sexo>
</conjuge1>
<conjuge2>
<bairroConjuge>Centro</bairroConjuge>
<codigoIBGEMunicipioLogradouroConjuge>120001
</codigoIBGEMunicipioLogradouroConjuge>
<codigoIBGEMunicipioLogradouroConjugeIgnorado>false
</codigoIBGEMunicipioLogradouroConjugeIgnorado>
<codigoIBGEMunicipioNaturalidade>420200
</codigoIBGEMunicipioNaturalidade>
<codigoIBGEUFLogradouroConjuge>12</codigoIBGEUFLogradouroConjuge>
<codigoIBGEUFNaturalidade>42</codigoIBGEUFNaturalidade>
<codigoOcupacaoSDC>10205</codigoOcupacaoSDC>
<codigoOcupacaoSDCIgnorado>false</codigoOcupacaoSDCIgnorado>
<complementoLogradouroConjuge>Complemento endereço
</complementoLogradouroConjuge>
<dataNascimento>1982-01-09T00:00:00-03:00</dataNascimento>
<dataNascimentoIgnorada>false</dataNascimentoIgnorada>
<documentosConjuge>
<dono>CONJUGE2</dono>
```

--- end of page.page_number=57 ---

P á g i n a | 58 

## SIRC – Sistema Nacional de Informação de Registro Civil 

```
<numero>11111111116</numero>
<tipo>NIT</tipo>
</documentosConjuge>
<documentosConjuge>
<dono>CONJUGE2</dono>
<numero>11111111111</numero>
<tipo>RIC</tipo>
</documentosConjuge>
<documentosConjuge>
<dataEmissao>2014-07-23T00:00:00.000-03:00</dataEmissao>
<dono>CONJUGE2</dono>
<numero>123456789</numero>
<tipo>CNH</tipo>
</documentosConjuge>
<cpfConjugeIgnorado>true</cpfConjugeIgnorado>
<documentosConjugeIgnorado>false</documentosConjugeIgnorado>
<filiacoesConjuge>
<bairro>Centro</bairro>
<codigoIBGEMunicipioLogradouro>430910
</codigoIBGEMunicipioLogradouro>
<codigoIBGEMunicipioNaturalidade>420245
</codigoIBGEMunicipioNaturalidade>
<codigoIBGEUFLogradouro>43</codigoIBGEUFLogradouro>
<codigoIBGEUFNaturalidade>42</codigoIBGEUFNaturalidade>
<complementoLogradouro>Complemento endereço</complementoLogradouro>
<dataFalecimento>1997-08-31T00:00:00-03:00</dataFalecimento>
<dataFalecimentoIgnorada>false</dataFalecimentoIgnorada>
<dataNascimento>1961-07-01T00:00:00-03:00</dataNascimento>
<dataNascimentoIgnorada>false</dataNascimentoIgnorada>
<logradouro>Palacio de Buckingham</logradouro>
<municipioNaturalidadeIgnoradoDuplo>false
</municipioNaturalidadeIgnoradoDuplo>
<nacionalidade>76</nacionalidade>
<nacionalidadeIgnorada>false</nacionalidadeIgnorada>
<!-- FILIAÇÃO 1 CONJUGE 2 -->
<nome>AMANDA SILVA</nome>
<nomeEspecial>false</nomeEspecial>
<nomeIgnorado>false</nomeIgnorado>
<numeroLogradouro>1</numeroLogradouro>
<paisNascimento>76</paisNascimento>
<paisNascimentoIgnorado>false</paisNascimentoIgnorado>
<sexo>FEMININO</sexo>
<sexoIgnorado>false</sexoIgnorado>
</filiacoesConjuge>
<filiacoesConjuge>
<bairro>Centro</bairro>
<codigoIBGEMunicipioLogradouro>120001
</codigoIBGEMunicipioLogradouro>
<codigoIBGEMunicipioNaturalidade>120001
</codigoIBGEMunicipioNaturalidade>
<complementoLogradouro>Complemento endereço</complementoLogradouro>
<dataFalecimento>1997-08-31T00:00:00-03:00</dataFalecimento>
<dataFalecimentoIgnorada>false</dataFalecimentoIgnorada>
<dataNascimento>1961-07-01T00:00:00-03:00</dataNascimento>
<dataNascimentoIgnorada>false</dataNascimentoIgnorada>
<logradouro>Palacio de Buckingham</logradouro>
<municipioNaturalidadeIgnoradoDuplo>false
</municipioNaturalidadeIgnoradoDuplo>
<nacionalidade>76</nacionalidade>
<nacionalidadeIgnorada>false</nacionalidadeIgnorada>
<!-- FILIAÇÃO 2 CONJUGE 2 -->
<nome>TIBURCIO SILVA</nome>
<nomeEspecial>false</nomeEspecial>
<nomeIgnorado>false</nomeIgnorado>
<numeroLogradouro>1</numeroLogradouro>
<paisNascimento>76</paisNascimento>
<paisNascimentoIgnorado>false</paisNascimentoIgnorado>
<sexo>FEMININO</sexo>
<sexoIgnorado>false</sexoIgnorado>
</filiacoesConjuge>
<logradouroConjuge>Palacio de Buckingham</logradouroConjuge>
<logradouroConjugeIgnorado>false</logradouroConjugeIgnorado>
<nacionalidade>76</nacionalidade>
<nacionalidadeIgnorada>false</nacionalidadeIgnorada>
<!-- CONJUGE 2 -->
<nome>AMANDA SILVA</nome>
<nomeEspecial>false</nomeEspecial>
<nomeConjugePosCasamento>AMANDA SILVA</nomeConjugePosCasamento>
<nomeConjugePosCasamentoEspecial>false
</nomeConjugePosCasamentoEspecial>
<nomeConjugePosCasamentoIgnorado>false
```

--- end of page.page_number=58 ---

P á g i n a | 59 

## SIRC – Sistema Nacional de Informação de Registro Civil 

```
</nomeConjugePosCasamentoIgnorado>
<nomeConjugePrecedente></nomeConjugePrecedente>
<numeroLogradouroConjuge>1</numeroLogradouroConjuge>
<numeroLogradouroConjugeIgnorado>false
</numeroLogradouroConjugeIgnorado>
<paisNascimento>76</paisNascimento>
<paisNascimentoIgnorado>false</paisNascimentoIgnorado>
<sexo>MASCULINO</sexo>
```

```
</conjuge2>
</registroCasamentoInclusao>
</movimentoCasamentoTO>
```

## _**7.4 Exemplo 4 – Declaração de Inexistência de Movimento (Versão 1.0)**_ 

O usuário pode informar a inexistência de movimentos de nascimento, casamento, óbito ou natimorto em uma mesma requisição: 

## **`Exemplo 01: Declaração Inexistência de Casamento, Nascimento, Óbito e Natimorto`** 

```
<declaracaoInexistenciaMovimentoServicoTO>
```

```
<competencia>12/2019</competencia>
```

```
<declaracaoInexistenciaMovimentoCasamento>true</declaracaoInexistenciaMovimentoCasamento>
<declaracaoInexistenciaMovimentoNascimento>true</declaracaoInexistenciaMovimentoNascimento>
<declaracaoInexistenciaMovimentoObito>true</declaracaoInexistenciaMovimentoObito>
```

```
<declaracaoInexistenciaMovimentoObitoNatimorto>true</declaracaoInexistenciaMovimentoObitoNatimor to>
</declaracaoInexistenciaMovimentoServicoTO>
```

## **`Exemplo 02: Declaração de Inexistência de Nascimento`** 

```
<declaracaoInexistenciaMovimentoServicoTO>
```

```
<competencia>12/2019</competencia>
```

```
<declaracaoInexistenciaMovimentoCasamento>false</declaracaoInexistenciaMovimentoCasamento>
<declaracaoInexistenciaMovimentoNascimento>true</declaracaoInexistenciaMovimentoNascimento>
<declaracaoInexistenciaMovimentoObito>false</declaracaoInexistenciaMovimentoObito>
```

```
<declaracaoInexistenciaMovimentoObitoNatimorto>false</declaracaoInexistenciaMovimentoObitoNatimo rto>
</declaracaoInexistenciaMovimentoServicoTO>
```

--- end of page.page_number=59 ---

P á g i n a | 60 

## SIRC – Sistema Nacional de Informação de Registro Civil 

## _**7.5 Exemplo 5 – Termo Cancelado (Versão 1.1)**_ 

O usuário deve informar o cancelamento de termos, conforme: 

```
Exemplo 01: Cancelamento de Termo
```

```
<movimentoCancelamentoTO>
<versaoLayoutCancelamento>1.1</versaoLayoutCancelamento>
<registroTermoCancelado>
<motivo>Motivo Cancelamento</motivo>
<tipoRegistroCivil>NASCIMENTO</tipoRegistroCivil>
<codServentia>011700</codServentia>
<acervo>1</acervo>
<tipoServico>1</tipoServico>
<termo>100</termo>
<tipoLivro>1</tipoLivro>
<anoRegistro>2005</anoRegistro>
<dvMatricula>XX</dvMatricula>
<folha>101</folha>
<numeroLivro>100</numeroLivro>
</registroTermoCancelado>
</movimentoCancelamentoTO>
```

## _**7.6 Exemplo 6 – Registro de Nascimento com nome especial**_ 

O usuário deve informar a tag para nomes especiais sempre que o nome civil contiver uma das palavras listadas, conforme regras apresentadas no capítulo Registro Civil. 

## `Exemplo 1: Registro de nascimento com nome especial preenchido corretamente` 

```
...
<nome>Maria da Silva Teste</nome>
<nomeIgnorado>false</nomeIgnorado>
<nomeEspecial>true</nomeEspecial>
<paisNascimento>76</paisNascimento>
<paisNascimentoIgnorado>false</paisNascimentoIgnorado>
...
```

## `Exemplo 2: Registro de nascimento com nome especial preenchido INCORRETAMENTE` 

**a)** O nome contém a palavra "Falecida", portanto é um nome especial. Neste caso, é necessário preencher a tag <nomeEspecial> com o valor "true". **`... <nome>Maria da Silva Falecida</nome> <nomeIgnorado>false</nomeIgnorado> <nomeEspecial>false</nomeEspecial> <paisNascimento>76</paisNascimento> <paisNascimentoIgnorado>false</paisNascimentoIgnorado > ...` b)** O nome contém a palavra "Falecida", portanto é um nome especial. Neste caso, é necessário preencher a tag <nomeEspecial> com o valor "true". **`... <nome>Maria da Silva Falecida</nome> <nomeIgnorado>false</nomeIgnorado> <paisNascimento>76</paisNascimento> <paisNascimentoIgnorado>false</paisNascimentoIgnorado ...`** `Exemplo 3: Registro de nascimento com nome inválido` **a)** O nome contém o caractere "#", portanto é um nome inválido. * O preenchimento da tag <nomeEspecial> não é considerado. **`... <nome>Maria da Silva #</nome> <nomeIgnorado>false</nomeIgnorado> <nomeEspecial>false</nomeEspecial> <paisNascimento>76</paisNascimento> <paisNascimentoIgnorado>false</paisNascimentoIgnorado ...`** 

## `Exemplo 3: Registro de nascimento com nome inválido` 

--- end of page.page_number=60 ---

P á g i n a | 61 

## SIRC – Sistema Nacional de Informação de Registro Civil 

**b)** O nome contém o caractere "#", portanto é um nome inválido. 

```
...
<nome>Maria da Silva #</nome>
<nomeIgnorado>false</nomeIgnorado>
<paisNascimento>76</paisNascimento>
<paisNascimentoIgnorado>false</paisNascimentoIgnorado
```

```
...
```

**c)** O nome contém o caractere "#", portanto é um nome inválido. * O preenchimento da tag <nomeEspecial> não é considerado. 

```
...
<nome>Maria da Silva #</nome>
<nomeIgnorado>false</nomeIgnorado>
<nomeEspecial>True</nomeEspecial>
<paisNascimento>76</paisNascimento>
<paisNascimentoIgnorado>false</paisNascimentoIgnorado
```

```
...
```

## _**7.7 XML mínimo para registro legado (anterior a 2016)**_ 

```
-
Exemplo1  Registro de Nascimento (versão layout 5.0):
```

```
<movimentoNascimentoTO>
<versaoLayoutNascimento>5.0</versaoLayoutNascimento>
<registroNascimentoInclusao>
<acervo>1</acervo>
<anoRegistro>2015</anoRegistro>
<codServentia>100719</codServentia>
<dvMatricula>77</dvMatricula>
<folha>1</folha>
<indicadorMatriculaRepetida>2</indicadorMatriculaRepetida>
<numeroLivro>1</numeroLivro>
<termo>1</termo>
<tipoLivro>1</tipoLivro>
<tipoServico>55</tipoServico>
<filiacoesNascimento>
</filiacoesNascimento>
<filiacoesNascimento>
</filiacoesNascimento>
</registroNascimentoInclusao>
</movimentoNascimentoTO>
```

```
-
Exemplo2  Registro de Casamento (versão layout 5.0):
```

```
<movimentoCasamentoTO>
<versaoLayoutCasamento>5.0</versaoLayoutCasamento>
<registroCasamentoInclusao>
<acervo>1</acervo>
<anoRegistro>2014</anoRegistro>
<codServentia>100719</codServentia>
<dvMatricula>86</dvMatricula>
<folha>1</folha>
<indicadorMatriculaRepetida>2</indicadorMatriculaRepetida>
<numeroLivro>1</numeroLivro>
<termo>1</termo>
<tipoLivro>2</tipoLivro>
<tipoServico>55</tipoServico>
<conjuge1>
<filiacoesConjuge></filiacoesConjuge>
<filiacoesConjuge></filiacoesConjuge>
</conjuge1>
<conjuge2>
<filiacoesConjuge></filiacoesConjuge>
<filiacoesConjuge></filiacoesConjuge>
</conjuge2>
</registroCasamentoInclusao>
</movimentoCasamentoTO>
```

```
-
Exemplo3  Registro de Óbito (versão layout 5.0):
```

```
<movimentoObitoTO>
<versaoLayoutObito>5.0</versaoLayoutObito>
```

--- end of page.page_number=61 ---

P á g i n a | 62 

## SIRC – Sistema Nacional de Informação de Registro Civil 

```
<registroObitoInclusao>
<acervo>1</acervo>
<anoRegistro>2014</anoRegistro>
<codServentia>100719</codServentia>
<dvMatricula>75</dvMatricula>
<folha>1</folha>
<indicadorMatriculaRepetida>2</indicadorMatriculaRepetida>
<numeroLivro>1</numeroLivro>
<termo>1</termo>
<tipoLivro>4</tipoLivro>
<tipoServico>55</tipoServico>
<filiacoesObito>
</filiacoesObito>
<filiacoesObito>
</filiacoesObito>
</registroObitoInclusao>
</movimentoObitoTO>
```

--- end of page.page_number=62 ---

P á g i n a | 63 

## SIRC – Sistema Nacional de Informação de Registro Civil 

## **8 XSD do Movimento** 

O XML Schema é uma linguagem baseada no formato XML para definição de regras de validação (esquemas) em documentos nesse mesmo formato. Um arquivo contendo as definições na linguagem XML Schema é chamado de XSD (XML Schema Definition), este descreve a estrutura de um documento XML. 

Algumas observações são importantes para utilização do XSD: 

- O atributo “minoccurs” tem por padrão o valor 1 (um), ou seja, a ausência do atributo indica que o elemento é obrigatório. 

- A ordem dos elementos deve ser seguida para a criação do arquivo XML. Os elementos estão ordenados alfabeticamente. 

**Cada tipo de registro civil (Nascimento; Óbito e Casamento) possui um XSD diferente, ou seja, deverão ser preparados e enviados separadamente.** 

--- end of page.page_number=63 ---

P á g i n a | 64 

## SIRC – Sistema Nacional de Informação de Registro Civil 

## _**8.1 Registro de Nascimento (Versão layout 5.0)**_ 

## **MovimentoNascimentoTO.xsd** 

```
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
```

```
<xs:schema version="1.0" xmlns:xs="http://www.w3.org/2001/XMLSchema">
```

```
  <xs:element name="movimentoNascimentoTO" type="movimentoNascimentoTO"/>
```

```
  <xs:complexType name="movimentoNascimentoTO">
    <xs:sequence>
      <xs:element name="versaoLayoutNascimento" type="versaoLayoutNascimento" />
      <xs:element name="registroNascimentoInclusao" type="registroNascimento" minOccurs="0"
maxOccurs="unbounded"/>
      <xs:element name="registroNascimentoExclusao" type="registroNascimento" minOccurs="0"
maxOccurs="unbounded"/>
      <xs:element name="registroNascimentoAlteracao" type="registroNascimento" minOccurs="0"
maxOccurs="unbounded"/>
    </xs:sequence>
  </xs:complexType>
```

```
  <xs:simpleType name="versaoLayoutNascimento">
    <xs:restriction base="xs:string">
```

```
      <xs:enumeration value="5.0"/>
```

```
</xs:restriction>
  </xs:simpleType>
```

```
  <xs:complexType name="registroNascimento">
    <xs:complexContent>
      <xs:extension base="registroNascimentoAbstrato">
        <xs:sequence/>
      </xs:extension>
    </xs:complexContent>
  </xs:complexType>
  <xs:complexType name="registroNascimentoAbstrato" abstract="true">
    <xs:complexContent>
      <xs:extension base="registroCivil">
        <xs:sequence>
          <xs:element name="bairroFiliacao" type="string100" minOccurs="0"/>
          <xs:element name="codigoIBGEMunicipio" type="xs:int" minOccurs="0"/>
          <xs:element name="textoLivreMunicipioNascimento" type="string100" minOccurs="0"/>
          <xs:element name="codigoIBGEMunicipioIgnorado" type="xs:boolean" minOccurs="0"/>
          <xs:element name="codigoIBGEMunicipioFiliacao" type="xs:int" minOccurs="0"/>
          <xs:element name="textoLivreMunicipioLogradouroFiliacao" type="string100" minOccurs="0"/>
          <xs:element name="codigoIBGEMunicipioFiliacaoIgnorado" type="xs:boolean" minOccurs="0"/>
          <xs:element name="codigoIBGEUF" type="xs:int" minOccurs="0"/>
          <xs:element name="codigoIBGEUFIgnorado" type="xs:boolean" minOccurs="0"/>
          <xs:element name="codigoIBGEUFFiliacao" type="xs:int" minOccurs="0"/>
          <xs:element name="codigoIBGEUFFiliacaoIgnorado" type="xs:boolean" minOccurs="0"/>
          <xs:element name="codigoIBGEMunicipioNaturalidade" type="xs:int" minOccurs="0"/>
          <xs:element name="codigoIBGEUFNaturalidade" type="xs:int" minOccurs="0"/>
          <xs:element name="municipioNaturalidadeTexto" type="string100" minOccurs="0"/>
          <xs:element name="complementoLogradouroFiliacao" type="string100" minOccurs="0"/>
          <xs:element name="cpf" type="xs:long" nillable="true" minOccurs="0"/>
          <xs:element name="cpfIgnorado" type="xs:boolean" minOccurs="0"/>
          <xs:element name="dataNascimento" type="data" minOccurs="0"/>
          <xs:element name="dataNascimentoIgnorada" type="xs:boolean" minOccurs="0"/>
          <xs:element name="dnv" type="string11" minOccurs="0"/>
          <xs:element name="dnvInexistente" type="xs:boolean" minOccurs="0"/>
          <xs:element name="domicilioEstrangeiroFiliacao" type="string255" minOccurs="0"/>
          <xs:element name="domicilioEstrangeiroFiliacaoIgnorado" type="xs:boolean" minOccurs="0"/>
          <xs:element name="filiacoesNascimento" type="filiacaoNascimento" minOccurs="2" maxOccurs="unbounded" />
          <xs:element name="horaNascimento" type="hora" minOccurs="0"/>
          <xs:element name="horaNascimentoIgnorada" type="xs:boolean" minOccurs="0"/>
          <xs:element name="impressosSegurancaNascimento" type="impressoSeguranca" nillable="true" minOccurs="0"
maxOccurs="unbounded"/>
          <xs:element name="local" type="localNascimento" minOccurs="0"/>
          <xs:element name="logradouroFiliacao" type="string255" minOccurs="0"/>
          <xs:element name="logradouroFiliacaoIgnorado" type="xs:boolean" minOccurs="0"/>
          <xs:element name="nacionalidadeRegistrado" type="xs:int" minOccurs="0"/>
          <xs:element name="nome" type="string100" minOccurs="0"/>
```

--- end of page.page_number=64 ---

P á g i n a | 65 

SIRC – Sistema Nacional de Informação de Registro Civil 

```
          <xs:element name="nomeEspecial" type="xs:boolean" minOccurs="0" />
          <xs:element name="numeroGemeos" minOccurs="0">
<xs:simpleType>
<xs:restriction base="xs:int">
<xs:minInclusive value="0"/>
<xs:maxInclusive value="9"/>
</xs:restriction>
       </xs:simpleType>
      </xs:element>
          <xs:element name="numeroLogradouroFiliacao" type="string20" minOccurs="0"/>
          <xs:element name="numeroLogradouroFiliacaoIgnorado" type="xs:boolean" minOccurs="0"/>
          <xs:element name="paisNascimentoRegistrado" type="xs:int" minOccurs="0"/>
          <xs:element name="possuiGemeos" type="xs:boolean" minOccurs="0"/>
          <xs:element name="sexo" type="sexo" minOccurs="0"/>
          <xs:element name="sexoIgnorado" type="xs:boolean" minOccurs="0"/>
          <xs:element name="genero" type="string100" minOccurs="0" />
          <xs:element name="averbacoesNascimento" type="averbacaoNascimento" minOccurs="0"
maxOccurs="unbounded"/>
          <xs:element name="anotacoesNascimento" type="anotacaoNascimento" minOccurs="0" maxOccurs="unbounded"/>
          <xs:element name="retificacoesNascimento" type="retificacaoNascimento" minOccurs="0"
maxOccurs="unbounded"/>
          <xs:element name="filiacaoNomesIguais" type="xs:boolean" minOccurs="0"/>
        </xs:sequence>
      </xs:extension>
    </xs:complexContent>
  </xs:complexType>
```

```
  <xs:complexType name="filiacaoNascimento">
<xs:sequence>
      <xs:element name="codigoIBGEMunicipioNaturalidade" type="xs:int" minOccurs="0"/>
      <xs:element name="codigoIBGEUFNaturalidade" type="xs:int" minOccurs="0"/>
      <xs:element name="codigoIBGEUFNaturalidadeIgnorado" type="xs:boolean" minOccurs="0"/>
      <xs:element name="codigoOcupacaoSDC" type="xs:int" minOccurs="0"/>
      <xs:element name="codigoOcupacaoSDCIgnorado" type="xs:boolean" minOccurs="0" />
      <xs:element name="dataNascimento" type="xs:dateTime" minOccurs="0"/>
      <xs:element name="dataNascimentoIgnorada" type="xs:boolean" minOccurs="0" />
      <xs:element name="documentos" type="documento" minOccurs="0" maxOccurs="unbounded"/>
      <xs:element name="cpfIgnorado" type="xs:boolean" minOccurs="0" />
      <xs:element name="documentosIgnorado" type="xs:boolean" minOccurs="0" />
      <xs:element name="idade" type="idadeFiliacao" minOccurs="0"/>
      <xs:element name="idadeIgnorada" type="xs:boolean" minOccurs="0" />
      <xs:element name="municipioNaturalidadeIgnoradoDuplo" type="xs:boolean" minOccurs="0" />
      <xs:element name="nacionalidade" type="xs:int" minOccurs="0"/>
      <xs:element name="nacionalidadeIgnorada" type="xs:boolean" minOccurs="0" />
      <xs:element name="nome" type="string100" minOccurs="0" />
      <xs:element name="nomeIgnorado" type="xs:boolean" minOccurs="0" />
  <xs:element name="nomeEspecial" type="xs:boolean" minOccurs="0" />
      <xs:element name="paisNascimento" type="xs:int" minOccurs="0"/>
      <xs:element name="paisNascimentoIgnorado" type="xs:boolean" minOccurs="0" />
      <xs:element name="progenitores" type="progenitorNascimento" minOccurs="0" maxOccurs="unbounded"/>
      <xs:element name="sexo" type="sexo" minOccurs="0"/>
      <xs:element name="sexoIgnorado" type="xs:boolean" minOccurs="0" />
      <xs:element name="genero" type="string100" minOccurs="0" />
      <xs:element name="textoLivreMunicipioNaturalidade" type="string100" minOccurs="0"/>
    </xs:sequence>
  </xs:complexType>
```

```
  <xs:complexType name="progenitorNascimento">
<xs:sequence>
      <xs:element name="nome" type="string100" minOccurs="0" />
      <xs:element name="nomeEspecial" type="xs:boolean" minOccurs="0" />
      <xs:element name="sexo" type="sexo" minOccurs="0"/>
      <xs:element name="genero" type="string100" minOccurs="0" />
    </xs:sequence>
  </xs:complexType>
  <xs:complexType name="registroCivil" abstract="true">
    <xs:sequence>
      <xs:element name="acervo">
       <xs:simpleType>
<xs:restriction base="xs:byte">
<xs:minInclusive value="0"/>
<xs:maxInclusive value="99"/>
</xs:restriction>
```

```
       </xs:simpleType>
      </xs:element>
```

```
      <xs:element name="anoRegistro">
```

--- end of page.page_number=65 ---

P á g i n a | 66 

## SIRC – Sistema Nacional de Informação de Registro Civil 

```
       <xs:simpleType>
```

```
<xs:restriction base="xs:short">
<xs:minInclusive value="0"/>
<xs:maxInclusive value="9999"/>
```

```
</xs:restriction>
```

```
       </xs:simpleType>
      </xs:element>
```

```
      <xs:element name="cnsConsuladoRegistro" minOccurs="0">
```

```
       <xs:simpleType>
```

```
<xs:restriction base="xs:int">
<xs:minInclusive value="0"/>
<xs:maxInclusive value="999999"/>
</xs:restriction>
```

```
       </xs:simpleType>
      </xs:element>
```

```
      <xs:element name="codServentia">
```

```
       <xs:simpleType>
```

```
<xs:restriction base="xs:int">
<xs:minInclusive value="0"/>
<xs:maxInclusive value="999999"/>
</xs:restriction>
```

```
       </xs:simpleType>
      </xs:element>
```

```
       <xs:element name="cpfEnvioParaCER"  minOccurs="0">
       <xs:simpleType>
<xs:restriction base="xs:string">
<xs:pattern value="[0-9]{11}"/>
</xs:restriction>
```

```
       </xs:simpleType>
      </xs:element>
```

```
  <xs:element name="dataEnvioParaCER" type="xs:dateTime"  minOccurs="0"/>
```

```
      <xs:element name="dataRegistro" type="xs:dateTime" minOccurs="0"/>
```

```
      <xs:element name="dataSentencaJudicial" type="xs:dateTime" minOccurs="0"/>
```

```
      <xs:element name="dataTransitoJulgadoJudicial" type="xs:dateTime" minOccurs="0"/>
```

```
      <xs:element name="dvMatricula">
       <xs:simpleType>
<xs:restriction base="xs:string">
<xs:pattern value="[0-9]{2}|XX"/>
</xs:restriction>
```

```
       </xs:simpleType>
      </xs:element>
```

```
      <xs:element name="folha">
       <xs:simpleType>
<xs:restriction base="xs:short">
<xs:minInclusive value="0"/>
<xs:maxInclusive value="999"/>
</xs:restriction>
```

```
       </xs:simpleType>
      </xs:element>
      <xs:element name="indicadorMatriculaRepetida" minOccurs="0">
       <xs:simpleType>
<xs:restriction base="xs:int">
<xs:minInclusive value="1"/>
<xs:maxInclusive value="999"/>
</xs:restriction>
       </xs:simpleType>
      </xs:element>
      <xs:element name="informacoesConsulado" type="string200" minOccurs="0"/>
      <xs:element name="justificativaAusenciaCamposObrigatorios" minOccurs="0">
       <xs:simpleType>
<xs:restriction base="xs:string">
<xs:minLength value="10"/>
<xs:maxLength value="4000"/>
</xs:restriction>
```

```
       </xs:simpleType>
      </xs:element>
```

```
      <xs:element name="justificativasAusenciaCamposObrigatorios" type="justificativasNascimento" nillable="true"
minOccurs="0" maxOccurs="unbounded"/>
```

--- end of page.page_number=66 ---

P á g i n a | 67 

## SIRC – Sistema Nacional de Informação de Registro Civil 

```
      <xs:element name="nomeJuizJudicial" type="string100" minOccurs="0"/>
```

```
      <xs:element name="nomeJuizadoJudicial" type="string100" minOccurs="0"/>
```

```
      <xs:element name="numeroLivro">
```

```
       <xs:simpleType>
```

```
<xs:restriction base="xs:int">
<xs:minInclusive value="0"/>
<xs:maxInclusive value="99999"/>
</xs:restriction>
       </xs:simpleType>
      </xs:element>
```

```
      <xs:element name="numeroProcessoJudicial" type="string30" minOccurs="0"/>
```

```
      <xs:element name="observacoes" type="string4000" minOccurs="0"/>
```

```
      <xs:element name="orgaoEmissorExterior" type="string200" minOccurs="0"/>
```

```
      <xs:element name="registroJudicial" type="xs:boolean" minOccurs="0"/>
```

```
      <xs:element name="termo">
       <xs:simpleType>
<xs:restriction base="xs:int">
<xs:minInclusive value="0"/>
<xs:maxInclusive value="9999999"/>
</xs:restriction>
```

```
       </xs:simpleType>
      </xs:element>
```

```
      <xs:element name="tipoLivro">
       <xs:simpleType>
<xs:restriction base="xs:byte">
<xs:minInclusive value="1"/>
<xs:maxInclusive value="9"/>
</xs:restriction>
```

```
       </xs:simpleType>
      </xs:element>
```

```
      <xs:element name="tipoServico">
       <xs:simpleType>
<xs:restriction base="xs:byte">
<xs:minInclusive value="1"/>
<xs:maxInclusive value="99"/>
</xs:restriction>
       </xs:simpleType>
      </xs:element>
    </xs:sequence>
  </xs:complexType>
```

```
  <xs:complexType name="documentoRegistroNascimento">
    <xs:complexContent>
      <xs:extension base="documento">
        <xs:sequence/>
      </xs:extension>
    </xs:complexContent>
  </xs:complexType>
  <xs:complexType name="documento">
    <xs:sequence>
      <xs:element name="dataEmissao" type="xs:dateTime" minOccurs="0"/>
      <xs:element name="descricao" type="string100" minOccurs="0"/>
      <xs:element name="dono" type="donoDocumento"/>
      <xs:element name="numero" type="string32" minOccurs="0"/>
      <xs:element name="numeroSerie" type="string5" minOccurs="0"/>
      <xs:element name="orgaoEmissao" type="xs:int" minOccurs="0"/>
      <xs:element name="tipo" type="tipoDocumento"/>
      <xs:element name="ufEmissao" type="xs:int" minOccurs="0"/>
    </xs:sequence>
  </xs:complexType>
  <xs:complexType name="impressoSeguranca">
    <xs:sequence>
      <xs:element name="dataUtilizacao" type="xs:dateTime"/>
      <xs:element name="numeroSerie" type="numeroSerie"/>
      <xs:element name="segundaVia" type="xs:boolean" />
    </xs:sequence>
  </xs:complexType>
```

--- end of page.page_number=67 ---

P á g i n a | 68 

## SIRC – Sistema Nacional de Informação de Registro Civil 

```
  <xs:simpleType name="idadeFiliacao">
```

```
<xs:restriction base="xs:int">
<xs:totalDigits value="3"/>
<xs:minInclusive value="0"/>
</xs:restriction>
  </xs:simpleType>
```

```
  <xs:simpleType name="donoDocumento">
    <xs:restriction base="xs:string">
      <xs:enumeration value="FILIACAO_NASCIMENTO"/>
    </xs:restriction>
  </xs:simpleType>
  <xs:simpleType name="tipoDocumento">
    <xs:restriction base="xs:string">
      <xs:enumeration value="CPF"/>
      <xs:enumeration value="RG"/>
      <xs:enumeration value="NIT"/>
      <xs:enumeration value="RIC"/>
      <xs:enumeration value="RNE"/>
      <xs:enumeration value="TITULO_DE_ELEITOR"/>
      <xs:enumeration value="PASSAPORTE"/>
      <xs:enumeration value="CNH"/>
      <xs:enumeration value="CTPS"/>
      <xs:enumeration value="CARTEIRA_DE_MARITIMO"/>
      <xs:enumeration value="DOC_ESTRANGEIRO"/>
      <xs:enumeration value="CERT_DE_NASCIMENTO"/>
      <xs:enumeration value="CERT_DE_CASAMENTO"/>
      <xs:enumeration value="CERT_DE_RESERVISTA"/>
      <xs:enumeration value="NAO_IDENTIFICADO"/>
    </xs:restriction>
  </xs:simpleType>
  <xs:simpleType name="localNascimento">
    <xs:restriction base="xs:string">
      <xs:enumeration value="UNIDADE_SAUDE"/>
      <xs:enumeration value="FORA_UNIDADE_SAUDE"/>
    </xs:restriction>
  </xs:simpleType>
  <xs:simpleType name="sexo">
    <xs:restriction base="xs:string">
      <xs:enumeration value="MASCULINO"/>
      <xs:enumeration value="FEMININO"/>
      <xs:enumeration value="NAO_BINARIO"/>
      <xs:enumeration value="OUTROS"/>
      <xs:enumeration value="NAO_DECLARADO"/>
      <xs:enumeration value="IGNORADO"/>
    </xs:restriction>
  </xs:simpleType>
  <xs:complexType name="justificativasNascimento">
    <xs:sequence>
      <xs:element name="codigoJustificativa" type="codigoJustificativa"/>
    </xs:sequence>
  </xs:complexType>
  <xs:simpleType name="codigoJustificativa">
    <xs:restriction base="xs:string">
      <xs:enumeration value="RFB_INDISPONIVEL"/>
      <xs:enumeration value="CPF_REGISTRADO_NAO_APRESENTADO"/>
      <xs:enumeration value="CPF_REGISTRADO_INEXISTENTE"/>
      <xs:enumeration value="SEXO_REGISTRADO_INDEFINIDO"/>
      <xs:enumeration value="DATA_NASCIMENTO_REGISTRADO_INCOMPLETA"/>
      <xs:enumeration value="DATA_NASCIMENTO_REGISTRADO_DESCONHECIDA"/>
      <xs:enumeration value="MUNICIPIO_REGISTRADO_DESCONHECIDO"/>
      <xs:enumeration value="CPF_FILIACAO_NAO_APRESENTADO"/>
      <xs:enumeration value="CPF_FILIACAO_INEXISTENTE"/>
      <xs:enumeration value="FILIACAO_DESCONHECIDA"/>
      <xs:enumeration value="UMA_FILIACAO_NAO_INFORMADA"/>
      <xs:enumeration value="DATA_NASCIMENTO_FILIACAO_DESCONHECIDA"/>
      <xs:enumeration value="MUNICIPIO_FILIACAO_DESCONHECIDO"/>
      <xs:enumeration value="OUTROS"/>
    </xs:restriction>
  </xs:simpleType>
  <xs:complexType name="averbacaoNascimento">
      <xs:sequence>
          <xs:element name="dataAverbacao" type="xs:dateTime" minOccurs="0"/>
          <xs:element name="motivoAverbacao" type="motivoAverbacaoNascimento" minOccurs="0"/>
```

--- end of page.page_number=68 ---

P á g i n a | 69 

## SIRC – Sistema Nacional de Informação de Registro Civil 

```
          <xs:element name="dataMotivoAverbacao" type="xs:dateTime" minOccurs="0"/>
          <xs:element name="processoJudicial" type="string30" minOccurs="0"/>
          <xs:element name="dataSentencaJudicial" type="xs:dateTime" minOccurs="0"/>
          <xs:element name="dadosComplementares" type="xs:string" minOccurs="0"/>
      </xs:sequence>
  </xs:complexType>
  <xs:simpleType name="motivoAverbacaoNascimento">
      <xs:restriction base="xs:string">
          <xs:enumeration value="RECONHECIMENTO_FILIACAO"/>
          <xs:enumeration value="ALTERACAO_NOME"/>
          <xs:enumeration value="ALTERACAO_SOBRENOME"/>
          <xs:enumeration value="ALTERACAO_NOME_SEXO"/>
          <xs:enumeration value="CANCELAMENTO"/>
          <xs:enumeration value="MUDANCA_PRENOME"/>
          <xs:enumeration value="DESTITUICAO"/>
          <xs:enumeration value="CONCESSAO"/>
          <xs:enumeration value="EXCLUSAO"/>
          <xs:enumeration value="RECONHECIMENTO"/>
          <xs:enumeration value="PERDA_NACIONALIDADE"/>
          <xs:enumeration value="ANOTACAO_CPF"/>
          <xs:enumeration value="FILIACAO"/>
          <xs:enumeration value="OUTROS"/>
          <xs:enumeration value="NOME_ABREVIADO"/>
          <xs:enumeration value="ACRESCIMO_SOBRENOME"/>
          <xs:enumeration value="ALTERACAO_NOME_ACRESCIMO"/>
          <xs:enumeration value="ALTERACAO_NOME_FILIACAO"/>
      </xs:restriction>
  </xs:simpleType>
  <xs:complexType name="anotacaoNascimento">
       <xs:sequence>
           <xs:element name="dataAnotacao" type="xs:dateTime" minOccurs="0"/>
           <xs:element name="motivoAnotacao" type="motivoAnotacaoNascimento" minOccurs="0"/>
           <xs:element name="matricula" type="string32" minOccurs="0"/>
           <xs:element name="dadosComplementares" type="xs:string" minOccurs="0"/>
       </xs:sequence>
  </xs:complexType>
  <xs:simpleType name="motivoAnotacaoNascimento">
       <xs:restriction base="xs:string">
           <xs:enumeration value="CASAMENTO"/>
           <xs:enumeration value="OBITO"/>
           <xs:enumeration value="OUTROS"/>
           <xs:enumeration value="REESTABELECIMENTO"/>
           <xs:enumeration value="EMANCIPACAO"/>
           <xs:enumeration value="INTERDICAO"/>
           <xs:enumeration value="AUSENCIA"/>
           <xs:enumeration value="MORTE_PRESUMIDA"/>
       </xs:restriction>
  </xs:simpleType>
  <xs:complexType name="retificacaoNascimento">
       <xs:sequence>
           <xs:element name="dataRetificacao" type="xs:dateTime" minOccurs="0"/>
           <xs:element name="processoJudicial" type="string30" minOccurs="0"/>
           <xs:element name="dataSentencaJudicial" type="xs:dateTime" minOccurs="0"/>
           <xs:element name="dadosComplementares" type="xs:string" minOccurs="0"/>
       </xs:sequence>
  </xs:complexType>
  <xs:simpleType name="hora">
<xs:restriction base="xs:string">
<xs:pattern value="([0-1][0-9]|2[0-3]):[0-5][0-9]"/>
</xs:restriction>
  </xs:simpleType>
  <xs:simpleType name="data">
<xs:restriction base="xs:string">
<xs:pattern value="(((0[1-9]|[1-2][0-9]|30)/(04|06|09|11))|((0[1-9]|[1-2][0-9]|3[0-
1])/(01|03|05|07|08|10|12))|(0[1-9]|[1-2][0-9])/02)/[0-9]{4}"/>
</xs:restriction>
  </xs:simpleType>
  <xs:simpleType name="string5">
    <xs:restriction base="xs:string">
      <xs:maxLength value="5"></xs:maxLength>
    </xs:restriction>
  </xs:simpleType>
  <xs:simpleType name="string11">
```

--- end of page.page_number=69 ---

P á g i n a | 70 

SIRC – Sistema Nacional de Informação de Registro Civil 

```
    <xs:restriction base="xs:string">
      <xs:maxLength value="11"></xs:maxLength>
    </xs:restriction>
  </xs:simpleType>
```

```
  <xs:simpleType name="string20">
    <xs:restriction base="xs:string">
      <xs:maxLength value="20"></xs:maxLength>
    </xs:restriction>
  </xs:simpleType>
  <xs:simpleType name="string30">
    <xs:restriction base="xs:string">
      <xs:maxLength value="30"></xs:maxLength>
    </xs:restriction>
  </xs:simpleType>
  <xs:simpleType name="string32">
    <xs:restriction base="xs:string">
      <xs:maxLength value="32"></xs:maxLength>
    </xs:restriction>
  </xs:simpleType>
  <xs:simpleType name="string100">
    <xs:restriction base="xs:string">
      <xs:maxLength value="100"></xs:maxLength>
    </xs:restriction>
  </xs:simpleType>
  <xs:simpleType name="string200">
    <xs:restriction base="xs:string">
      <xs:maxLength value="200"></xs:maxLength>
    </xs:restriction>
  </xs:simpleType>
  <xs:simpleType name="string255">
    <xs:restriction base="xs:string">
      <xs:maxLength value="255"></xs:maxLength>
    </xs:restriction>
  </xs:simpleType>
  <xs:simpleType name="string1000">
    <xs:restriction base="xs:string">
      <xs:maxLength value="1000"></xs:maxLength>
    </xs:restriction>
  </xs:simpleType>
  <xs:simpleType name="string2000">
    <xs:restriction base="xs:string">
      <xs:maxLength value="2000"></xs:maxLength>
    </xs:restriction>
  </xs:simpleType>
  <xs:simpleType name="string4000">
    <xs:restriction base="xs:string">
      <xs:maxLength value="4000"></xs:maxLength>
    </xs:restriction>
  </xs:simpleType>
  <xs:simpleType name="numeroSerie">
    <xs:restriction base="xs:string">
<xs:pattern value="[a-zA-Z]{2}[0-9]{9}"/>
    </xs:restriction>
  </xs:simpleType>
</xs:schema>
```

--- end of page.page_number=70 ---

P á g i n a | 71 

SIRC – Sistema Nacional de Informação de Registro Civil 

## _**8.2 Registro de Óbito (Versão layout 5.0)**_ 

## **MovimentoObitoTO.xsd** 

```
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
```

```
<xs:schema version="1.0" xmlns:xs="http://www.w3.org/2001/XMLSchema">
```

```
  <xs:element name="movimentoObitoTO" type="movimentoObitoTO"/>
```

```
  <xs:complexType name="movimentoObitoTO">
```

```
    <xs:sequence>
```

```
      <xs:element name="versaoLayoutObito" type="versaoLayoutObito" />
```

```
      <xs:element name="registroObitoInclusao" type="registroObito" minOccurs="0" maxOccurs="unbounded"/>
      <xs:element name="registroObitoExclusao" type="registroObito" minOccurs="0" maxOccurs="unbounded"/>
```

```
      <xs:element name="registroObitoAlteracao" type="registroObito" minOccurs="0" maxOccurs="unbounded"/>
    </xs:sequence>
```

```
  </xs:complexType>
```

```
  <xs:simpleType name="versaoLayoutObito">
```

```
    <xs:restriction base="xs:string">
```

```
      <xs:enumeration value="5.0"/>
```

```
</xs:restriction>
```

```
  </xs:simpleType>
```

```
  <xs:complexType name="registroObito">
```

```
    <xs:complexContent>
```

```
      <xs:extension base="registroObitoAbstrato">
```

```
        <xs:sequence/>
```

```
      </xs:extension>
```

```
    </xs:complexContent>
```

```
  </xs:complexType>
```

```
  <xs:complexType name="registroObitoAbstrato" abstract="true">
```

```
    <xs:complexContent>
```

```
      <xs:extension base="registroCivil">
```

```
        <xs:sequence>
```

```
          <xs:element name="bairro" type="string100" minOccurs="0"/>
```

```
          <xs:element name="bairroObito" type="string100" minOccurs="0"/>
```

```
          <xs:element name="beneficiosPrevidenciarios" type="beneficioPrevidenciarioObito" nillable="true"
minOccurs="0" maxOccurs="unbounded"/>
          <xs:element name="beneficiosPrevidenciariosIgnorado" type="xs:boolean" minOccurs="0"/>
```

```
          <xs:element name="causaMorteConhecida" type="string1024" minOccurs="0"/>
```

```
          <xs:element name="causaMorteConhecidaIgnorada" type="xs:boolean" minOccurs="0"/>
```

```
          <xs:element name="codigoIBGEMunicipioLogradouro" type="xs:int" minOccurs="0"/>
```

```
          <xs:element name="textoLivreMunicipioLogradouro" type="string100" minOccurs="0"/>
```

```
          <xs:element name="codigoIBGEMunicipioLogradouroIgnorado" type="xs:boolean" minOccurs="0"/>
```

```
          <xs:element name="codigoIBGEMunicipioLogradouroObito" type="xs:int" minOccurs="0"/>
          <xs:element name="textoLivreMunicipioLogradouroObito" type="string100" minOccurs="0"/>
          <xs:element name="codigoIBGEMunicipioLogradouroObitoIgnorado" type="xs:boolean" minOccurs="0"/>
          <xs:element name="codigoIBGEMunicipioNaturalidade" type="xs:int" minOccurs="0"/>
          <xs:element name="codigoIBGEUFLogradouro" type="xs:int" minOccurs="0"/>
          <xs:element name="codigoIBGEUFLogradouroIgnorado" type="xs:boolean" minOccurs="0"/>
          <xs:element name="codigoIBGEUFLogradouroObito" type="xs:int" minOccurs="0"/>
          <xs:element name="codigoIBGEUFLogradouroObitoIgnorado" type="xs:boolean" minOccurs="0"/>
          <xs:element name="codigoIBGEUFNaturalidade" type="xs:int" minOccurs="0"/>
          <xs:element name="codigoIBGEUFNaturalidadeIgnorado" type="xs:boolean" minOccurs="0"/>
          <xs:element name="codigoOcupacaoSDC" type="xs:int" minOccurs="0"/>
          <xs:element name="complementoLogradouro" type="string100" minOccurs="0"/>
          <xs:element name="complementoLogradouroObito" type="string100" minOccurs="0"/>
          <xs:element name="corPele" type="corPele" minOccurs="0"/>
          <xs:element name="corPeleIgnorada" type="xs:boolean" minOccurs="0"/>
          <xs:element name="dataNascimentoFalecido" type="xs:dateTime" minOccurs="0"/>
          <xs:element name="dataNascimentoFalecidoIgnorada" type="xs:boolean" minOccurs="0"/>
          <xs:element name="dataObito" type="data" minOccurs="0"/>
          <xs:element name="dataObitoIgnorada" type="xs:boolean" minOccurs="0"/>
          <xs:element name="declaracaoObito" type="string9" minOccurs="0"/>
          <xs:element name="declaracaoObitoIgnorada" type="xs:boolean" minOccurs="0"/>
          <xs:element name="documentosDeclarante" type="documentoRegistroObito" nillable="true" minOccurs="0"
maxOccurs="unbounded"/>
          <xs:element name="documentosFalecido" type="documentoRegistroObito" nillable="true" minOccurs="0"
maxOccurs="unbounded"/>
          <xs:element name="cpfFalecidoIgnorado" type="xs:boolean" minOccurs="0"/>
          <xs:element name="documentosFalecidoIgnorado" type="xs:boolean" minOccurs="0"/>
          <xs:element name="domicilioEstrangeiroFalecido" type="string500" minOccurs="0"/>
```

--- end of page.page_number=71 ---

P á g i n a | 72 

## SIRC – Sistema Nacional de Informação de Registro Civil 

- **`<xs:element name="domicilioEstrangeiroFalecidoIgnorado" type="xs:boolean" minOccurs="0"/> <xs:element name="eleitor" type="xs:boolean" minOccurs="0"/>`** 

- **`<xs:element name="enderecoLocalObitoEstrangeiro" type="string500" minOccurs="0"/>`** 

- **`<xs:element name="enderecoLocalObitoEstrangeiroIgnorado" type="xs:boolean" minOccurs="0"/>`** 

- **`<xs:element name="estadoCivil" type="estadoCivil" minOccurs="0"/>`** 

- **`<xs:element name="estadoCivilIgnorado" type="xs:boolean" minOccurs="0"/>`** 

- **`<xs:element name="filiacoesObito" type="filiacaoObito" minOccurs="2" maxOccurs="unbounded" /> <xs:element name="horaObito" type="hora" minOccurs="0"/>`** 

- **`<xs:element name="horaObitoIgnorada" type="xs:boolean" minOccurs="0"/>`** 

- **`<xs:element name="idade" type="idadeFalecido" minOccurs="0"/>`** 

```
          <xs:element name="impressosSegurancaObito" type="impressoSeguranca" nillable="true" minOccurs="0"
maxOccurs="unbounded"/>
          <xs:element name="logradouro" type="string255" minOccurs="0"/>
```

```
          <xs:element name="logradouroIgnorado" type="xs:boolean" minOccurs="0"/>
```

```
          <xs:element name="logradouroObito" type="string100" minOccurs="0"/>
```

```
          <xs:element name="logradouroObitoIgnorado" type="xs:boolean" minOccurs="0"/>
          <xs:element name="lugarFalecimento" type="string500" minOccurs="0"/>
```

```
          <xs:element name="lugarSepultamentoCemiterio" type="string255" minOccurs="0"/>
          <xs:element name="lugarSepultamentoCemiterioIgnorado" type="xs:boolean" minOccurs="0"/>
          <xs:element name="municipioNaturalidadeIgnoradoDuplo" type="xs:boolean" minOccurs="0"/>
          <xs:element name="nacionalidade" type="xs:int" minOccurs="0"/>
          <xs:element name="nacionalidadeIgnorada" type="xs:boolean" minOccurs="0"/>
          <xs:element name="nome" type="string100" minOccurs="0"/>
```

```
          <xs:element name="nomeEspecial" type="xs:boolean" minOccurs="0"/>
          <xs:element name="nomeAtestantePrimario" type="string100" minOccurs="0"/>
          <xs:element name="nomeDeclarante" type="string100" minOccurs="0"/>
          <xs:element name="nomeDeclaranteEspecial" type="xs:boolean" minOccurs="0"/>
          <xs:element name="nomeDeclaranteIgnorado" type="xs:boolean" minOccurs="0"/>
          <xs:element name="nomeIgnorado" type="xs:boolean" minOccurs="0"/>
          <xs:element name="nomeLocalObito" type="string255" minOccurs="0"/>
          <xs:element name="nomeLocalObitoIgnorado" type="xs:boolean" minOccurs="0"/>
          <xs:element name="numeroLogradouro" type="string20" minOccurs="0"/>
          <xs:element name="numeroLogradouroIgnorado" type="xs:boolean" minOccurs="0"/>
          <xs:element name="numeroLogradouroObito" type="string20" minOccurs="0"/>
          <xs:element name="numeroLogradouroObitoIgnorado" type="xs:boolean" minOccurs="0"/>
          <xs:element name="paisFalecimento" type="xs:int" minOccurs="0"/>
```

```
          <xs:element name="paisNascimento" type="xs:int" minOccurs="0"/>
```

```
          <xs:element name="paisNascimentoIgnorado" type="xs:boolean" minOccurs="0"/>
```

```
          <xs:element name="sexo" type="sexo" minOccurs="0"/>
```

```
          <xs:element name="sexoIgnorado" type="xs:boolean" minOccurs="0"/>
```

```
          <xs:element name="genero" type="string100" minOccurs="0" />
```

```
          <xs:element name="textoLivreMunicipioNaturalidade" type="string100" minOccurs="0"/>
```

```
          <xs:element name="tipoLocalObito" type="tipoLocalObito" minOccurs="0"/>
```

```
          <xs:element name="tipoLocalObitoIgnorado" type="xs:boolean" minOccurs="0"/>
```

```
          <xs:element name="tipoMorte" type="tipoMorte" minOccurs="0"/>
```

```
          <xs:element name="tipoMorteIgnorado" type="xs:boolean" minOccurs="0"/>
```

```
      <xs:element name="averbacoesObito" type="averbacaoObito" minOccurs="0" maxOccurs="unbounded"/>
```

```
      <xs:element name="anotacoesObito" type="anotacaoObito" minOccurs="0" maxOccurs="unbounded"/>
```

```
      <xs:element name="retificacoesObito" type="retificacaoObito" minOccurs="0" maxOccurs="unbounded"/>
```

```
          <xs:element name="filiacaoNomesIguais" type="xs:boolean" minOccurs="0"/>
```

```
        </xs:sequence>
```

```
      </xs:extension>
```

```
    </xs:complexContent>
```

```
  </xs:complexType>
```

```
  <xs:complexType name="filiacaoObito">
```

```
<xs:sequence>
```

```
      <xs:element name="codigoIBGEMunicipioNaturalidade" type="xs:int" minOccurs="0"/>
```

```
      <xs:element name="codigoIBGEUFNaturalidade" type="xs:int" minOccurs="0"/>
```

```
      <xs:element name="codigoIBGEUFNaturalidadeIgnorado" type="xs:boolean" minOccurs="0"/>
```

```
      <xs:element name="codigoOcupacaoSDC" type="xs:int" minOccurs="0"/>
```

```
      <xs:element name="dataNascimento" type="xs:dateTime" minOccurs="0"/>
```

```
      <xs:element name="dataNascimentoIgnorada" type="xs:boolean" minOccurs="0" />
```

```
      <xs:element name="documentos" type="documento" minOccurs="0" maxOccurs="unbounded"/>
      <xs:element name="cpfIgnorado" type="xs:boolean" minOccurs="0" />
```

```
      <xs:element name="documentosIgnorado" type="xs:boolean" minOccurs="0" />
```

```
      <xs:element name="municipioNaturalidadeIgnoradoDuplo" type="xs:boolean" minOccurs="0" />
      <xs:element name="nacionalidade" type="xs:int" minOccurs="0"/>
```

```
      <xs:element name="nacionalidadeIgnorada" type="xs:boolean" minOccurs="0" />
      <xs:element name="nome" type="string100" minOccurs="0" />
```

```
      <xs:element name="nomeEspecial" type="xs:boolean" minOccurs="0"/>
```

```
      <xs:element name="nomeIgnorado" type="xs:boolean" minOccurs="0" />
      <xs:element name="paisNascimento" type="xs:int" minOccurs="0"/>
```

```
      <xs:element name="paisNascimentoIgnorado" type="xs:boolean" minOccurs="0" />
```

```
      <xs:element name="sexo" type="sexo" minOccurs="0"/>
```

```
      <xs:element name="sexoIgnorado" type="xs:boolean" minOccurs="0" />
```

```
      <xs:element name="genero" type="string100" minOccurs="0" />
```

```
      <xs:element name="textoLivreMunicipioNaturalidade" type="string100" minOccurs="0"/>
```

```
    </xs:sequence>
```

```
  </xs:complexType>
```

--- end of page.page_number=72 ---

P á g i n a | 73 

## SIRC – Sistema Nacional de Informação de Registro Civil 

```
  <xs:complexType name="registroCivil" abstract="true">
```

```
    <xs:sequence>
```

```
      <xs:element name="acervo">
```

```
       <xs:simpleType>
```

```
<xs:restriction base="xs:byte">
```

```
<xs:minInclusive value="0"/>
```

```
<xs:maxInclusive value="99"/>
```

```
</xs:restriction>
```

```
       </xs:simpleType>
```

```
      </xs:element>
```

```
      <xs:element name="anoRegistro">
```

```
       <xs:simpleType>
```

```
<xs:restriction base="xs:short">
```

```
<xs:minInclusive value="0"/>
```

```
<xs:maxInclusive value="9999"/>
```

```
</xs:restriction>
```

```
       </xs:simpleType>
```

```
      </xs:element>
```

```
      <xs:element name="cnsConsuladoRegistro" minOccurs="0">
```

```
       <xs:simpleType>
```

```
<xs:restriction base="xs:int">
```

```
<xs:minInclusive value="0"/>
```

```
<xs:maxInclusive value="999999"/>
```

```
</xs:restriction>
```

```
       </xs:simpleType>
      </xs:element>
```

```
      <xs:element name="codServentia">
```

```
       <xs:simpleType>
<xs:restriction base="xs:int">
```

```
<xs:minInclusive value="0"/>
```

```
<xs:maxInclusive value="999999"/>
</xs:restriction>
```

```
       </xs:simpleType>
      </xs:element>
```

```
       <xs:element name="cpfEnvioParaCER"  minOccurs="0">
```

```
       <xs:simpleType>
<xs:restriction base="xs:string">
<xs:pattern value="[0-9]{11}"/>
</xs:restriction>
       </xs:simpleType>
      </xs:element>
```

```
  <xs:element name="dataEnvioParaCER" type="xs:dateTime"  minOccurs="0"/>
```

```
      <xs:element name="dataRegistro" type="xs:dateTime" minOccurs="0"/>
```

```
      <xs:element name="dataSentencaJudicial" type="xs:dateTime" minOccurs="0"/>
```

```
      <xs:element name="dataTransitoJulgadoJudicial" type="xs:dateTime" minOccurs="0"/>
```

```
      <xs:element name="dvMatricula">
```

```
       <xs:simpleType>
<xs:restriction base="xs:string">
<xs:pattern value="[0-9]{2}|XX"/>
</xs:restriction>
```

```
       </xs:simpleType>
      </xs:element>
```

```
      <xs:element name="folha">
```

```
       <xs:simpleType>
<xs:restriction base="xs:short">
<xs:minInclusive value="0"/>
<xs:maxInclusive value="999"/>
</xs:restriction>
```

```
       </xs:simpleType>
```

```
      </xs:element>
```

```
      <xs:element name="indicadorMatriculaRepetida" minOccurs="0">
```

```
       <xs:simpleType>
<xs:restriction base="xs:int">
<xs:minInclusive value="1"/>
<xs:maxInclusive value="999"/>
</xs:restriction>
       </xs:simpleType>
      </xs:element>
```

--- end of page.page_number=73 ---

P á g i n a | 74 

## SIRC – Sistema Nacional de Informação de Registro Civil 

- **`<xs:element name="informacoesConsulado" type="string200" minOccurs="0"/>`** 

```
      <xs:element name="justificativaAusenciaCamposObrigatorios" minOccurs="0">
```

```
       <xs:simpleType>
```

```
<xs:restriction base="xs:string">
<xs:minLength value="10"/>
<xs:maxLength value="4000"/>
</xs:restriction>
```

```
       </xs:simpleType>
```

```
      </xs:element>
```

```
      <xs:element name="justificativasAusenciaCamposObrigatorios" type="justificativasObito" nillable="true"
minOccurs="0" maxOccurs="unbounded"/>
```

```
      <xs:element name="nomeJuizJudicial" type="string100" minOccurs="0"/>
```

```
      <xs:element name="nomeJuizadoJudicial" type="string100" minOccurs="0"/>
```

```
      <xs:element name="numeroLivro">
```

```
       <xs:simpleType>
```

```
<xs:restriction base="xs:int">
```

```
<xs:minInclusive value="0"/>
<xs:maxInclusive value="99999"/>
</xs:restriction>
```

```
       </xs:simpleType>
```

```
      </xs:element>
```

```
      <xs:element name="numeroProcessoJudicial" type="string30" minOccurs="0"/>
```

```
      <xs:element name="observacoes" type="string4000" minOccurs="0"/>
```

```
      <xs:element name="orgaoEmissorExterior" type="string200" minOccurs="0"/>
```

```
      <xs:element name="registroJudicial" type="xs:boolean" minOccurs="0"/>
```

```
      <xs:element name="termo">
```

```
       <xs:simpleType>
```

```
<xs:restriction base="xs:int">
```

```
<xs:minInclusive value="0"/>
```

```
<xs:maxInclusive value="9999999"/>
```

```
</xs:restriction>
```

```
       </xs:simpleType>
```

```
      </xs:element>
```

```
      <xs:element name="tipoLivro">
```

```
       <xs:simpleType>
```

```
<xs:restriction base="xs:byte">
```

```
<xs:minInclusive value="1"/>
```

```
<xs:maxInclusive value="9"/>
</xs:restriction>
```

```
       </xs:simpleType>
```

```
      </xs:element>
```

```
      <xs:element name="tipoServico">
```

```
       <xs:simpleType>
<xs:restriction base="xs:byte">
<xs:minInclusive value="1"/>
<xs:maxInclusive value="99"/>
</xs:restriction>
```

```
       </xs:simpleType>
      </xs:element>
```

```
    </xs:sequence>
  </xs:complexType>
  <xs:complexType name="beneficioPrevidenciarioObito">
```

```
    <xs:complexContent>
      <xs:extension base="beneficioPrevidenciario">
        <xs:sequence/>
      </xs:extension>
    </xs:complexContent>
  </xs:complexType>
```

```
  <xs:complexType name="beneficioPrevidenciario" abstract="true">
```

```
    <xs:sequence>
      <xs:element name="numeroBeneficio" type="string10" minOccurs="0"/>
    </xs:sequence>
  </xs:complexType>
```

```
  <xs:complexType name="documentoRegistroObito">
```

```
    <xs:complexContent>
```

--- end of page.page_number=74 ---

P á g i n a | 75 

## SIRC – Sistema Nacional de Informação de Registro Civil 

```
      <xs:extension base="documento">
```

```
        <xs:sequence/>
      </xs:extension>
    </xs:complexContent>
  </xs:complexType>
```

```
  <xs:complexType name="documento">
```

```
    <xs:sequence>
      <xs:element name="dataEmissao" type="xs:dateTime" minOccurs="0"/>
      <xs:element name="descricao" type="string100" minOccurs="0"/>
      <xs:element name="dono" type="donoDocumento"/>
      <xs:element name="numero" type="string32"/>
      <xs:element name="numeroSerie" type="string5" minOccurs="0"/>
      <xs:element name="orgaoEmissao" type="xs:int" minOccurs="0"/>
      <xs:element name="tipo" type="tipoDocumento"/>
      <xs:element name="ufEmissao" type="xs:int" minOccurs="0"/>
    </xs:sequence>
  </xs:complexType>
```

```
  <xs:simpleType name="data">
<xs:restriction base="xs:string">
<xs:pattern value="(((0[1-9]|[1-2][0-9]|30)/(04|06|09|11))|((0[1-9]|[1-2][0-9]|3[0-
1])/(01|03|05|07|08|10|12))|(0[1-9]|[1-2][0-9])/02)/[0-9]{4}"/>
</xs:restriction>
  </xs:simpleType>
```

```
  <xs:simpleType name="hora">
<xs:restriction base="xs:string">
<xs:pattern value="([0-1][0-9]|2[0-3]):[0-5][0-9]"/>
</xs:restriction>
  </xs:simpleType>
```

```
  <xs:simpleType name="idadeFalecido">
```

```
<xs:restriction base="xs:int">
<xs:totalDigits value="3"/>
<xs:minInclusive value="0"/>
</xs:restriction>
  </xs:simpleType>
```

```
  <xs:complexType name="impressoSeguranca">
    <xs:sequence>
      <xs:element name="dataUtilizacao" type="xs:dateTime"/>
      <xs:element name="numeroSerie" type="numeroSerie"/>
      <xs:element name="segundaVia" type="xs:boolean" />
    </xs:sequence>
  </xs:complexType>
```

```
  <xs:simpleType name="corPele">
    <xs:restriction base="xs:string">
      <xs:enumeration value="BRANCA"/>
      <xs:enumeration value="PRETA"/>
      <xs:enumeration value="AMARELA"/>
      <xs:enumeration value="PARDA"/>
      <xs:enumeration value="INDIGENA"/>
    </xs:restriction>
  </xs:simpleType>
  <xs:simpleType name="donoDocumento">
    <xs:restriction base="xs:string">
      <xs:enumeration value="DECLARANTE"/>
      <xs:enumeration value="FALECIDO"/>
      <xs:enumeration value="FILIACAO_OBITO"/>
    </xs:restriction>
  </xs:simpleType>
  <xs:simpleType name="tipoDocumento">
    <xs:restriction base="xs:string">
      <xs:enumeration value="CPF"/>
      <xs:enumeration value="RG"/>
      <xs:enumeration value="NIT"/>
      <xs:enumeration value="RIC"/>
      <xs:enumeration value="RNE"/>
      <xs:enumeration value="TITULO_DE_ELEITOR"/>
      <xs:enumeration value="PASSAPORTE"/>
      <xs:enumeration value="CNH"/>
      <xs:enumeration value="CTPS"/>
      <xs:enumeration value="CARTEIRA_DE_MARITIMO"/>
      <xs:enumeration value="DOC_ESTRANGEIRO"/>
      <xs:enumeration value="CERT_DE_NASCIMENTO"/>
      <xs:enumeration value="CERT_DE_CASAMENTO"/>
      <xs:enumeration value="CERT_DE_RESERVISTA"/>
```

--- end of page.page_number=75 ---

P á g i n a | 76 

## SIRC – Sistema Nacional de Informação de Registro Civil 

```
      <xs:enumeration value="NAO_IDENTIFICADO"/>
```

```
    </xs:restriction>
```

```
  </xs:simpleType>
```

```
  <xs:simpleType name="estadoCivil">
```

```
    <xs:restriction base="xs:string">
      <xs:enumeration value="SOLTEIRO"/>
      <xs:enumeration value="CASADO"/>
      <xs:enumeration value="VIUVO"/>
      <xs:enumeration value="DIVORCIADO"/>
      <xs:enumeration value="SEPARADO"/>
    </xs:restriction>
  </xs:simpleType>
```

```
  <xs:simpleType name="sexo">
```

```
    <xs:restriction base="xs:string">
      <xs:enumeration value="MASCULINO"/>
      <xs:enumeration value="FEMININO"/>
      <xs:enumeration value="NAO_BINARIO"/>
      <xs:enumeration value="OUTROS"/>
      <xs:enumeration value="NAO_DECLARADO"/>
      <xs:enumeration value="IGNORADO"/>
    </xs:restriction>
  </xs:simpleType>
```

```
  <xs:simpleType name="tipoLocalObito">
    <xs:restriction base="xs:string">
      <xs:enumeration value="HOSPITAL"/>
      <xs:enumeration value="OUTROS_SERVICOS_SAUDE"/>
      <xs:enumeration value="DOMICILIO"/>
      <xs:enumeration value="VIA_PUBLICA"/>
      <xs:enumeration value="OUTROS"/>
    </xs:restriction>
  </xs:simpleType>
```

```
  <xs:simpleType name="tipoMorte">
    <xs:restriction base="xs:string">
      <xs:enumeration value="NATURAL"/>
      <xs:enumeration value="VIOLENTA"/>
    </xs:restriction>
  </xs:simpleType>
```

```
  <xs:complexType name="justificativasObito">
```

```
    <xs:sequence>
      <xs:element name="codigoJustificativa" type="codigoJustificativa"/>
    </xs:sequence>
  </xs:complexType>
```

```
  <xs:simpleType name="codigoJustificativa">
    <xs:restriction base="xs:string">
      <xs:enumeration value="RFB_INDISPONIVEL"/>
      <xs:enumeration value="CPF_REGISTRADO_NAO_APRESENTADO"/>
      <xs:enumeration value="CPF_REGISTRADO_INEXISTENTE"/>
      <xs:enumeration value="REGISTRADO_NAO_IDENTIFICADO"/>
      <xs:enumeration value="SEXO_REGISTRADO_INDEFINIDO"/>
      <xs:enumeration value="DATA_NASCIMENTO_REGISTRADO_INCOMPLETA"/>
      <xs:enumeration value="DATA_NASCIMENTO_REGISTRADO_DESCONHECIDA"/>
      <xs:enumeration value="MUNICIPIO_REGISTRADO_DESCONHECIDO"/>
      <xs:enumeration value="CPF_FILIACAO_NAO_APRESENTADO"/>
      <xs:enumeration value="CPF_FILIACAO_INEXISTENTE"/>
      <xs:enumeration value="FILIACAO_DESCONHECIDA"/>
      <xs:enumeration value="UMA_FILIACAO_NAO_INFORMADA"/>
      <xs:enumeration value="DATA_NASCIMENTO_FILIACAO_DESCONHECIDA"/>
      <xs:enumeration value="MUNICIPIO_FILIACAO_DESCONHECIDO"/>
      <xs:enumeration value="OUTROS"/>
    </xs:restriction>
  </xs:simpleType>
  <xs:complexType name="averbacaoObito">
      <xs:sequence>
          <xs:element name="dataAverbacao" type="xs:dateTime" minOccurs="0"/>
          <xs:element name="motivoAverbacao" type="motivoAverbacaoObito" minOccurs="0"/>
          <xs:element name="dataMotivoAverbacao" type="xs:dateTime" minOccurs="0"/>
          <xs:element name="processoJudicial" type="string30" minOccurs="0"/>
          <xs:element name="dataSentencaJudicial" type="xs:dateTime" minOccurs="0"/>
          <xs:element name="dadosComplementares" type="xs:string" minOccurs="0"/>
      </xs:sequence>
  </xs:complexType>
```

```
  <xs:simpleType name="motivoAverbacaoObito">
```

```
      <xs:restriction base="xs:string">
```

--- end of page.page_number=76 ---

P á g i n a | 77 

## SIRC – Sistema Nacional de Informação de Registro Civil 

```
          <xs:enumeration value="CANCELAMENTO"/>
```

```
          <xs:enumeration value="ALTERACAO_LOCAL_SEPULTAMENTO"/>
```

```
          <xs:enumeration value="CREMACAO"/>
```

```
          <xs:enumeration value="DOACAO_CADAVER"/>
          <xs:enumeration value="OUTROS"/>
          <xs:enumeration value="ANOTACAO_CPF"/>
      </xs:restriction>
```

```
  </xs:simpleType>
```

```
  <xs:complexType name="anotacaoObito">
```

```
      <xs:sequence>
          <xs:element name="dataAnotacao" type="xs:dateTime" minOccurs="0"/>
          <xs:element name="motivoAnotacao" type="motivoAnotacaoObito" minOccurs="0"/>
          <xs:element name="matricula" type="string32" minOccurs="0"/>
          <xs:element name="dadosComplementares" type="xs:string" minOccurs="0"/>
      </xs:sequence>
  </xs:complexType>
```

```
  <xs:simpleType name="motivoAnotacaoObito">
```

```
      <xs:restriction base="xs:string">
          <xs:enumeration value="NASCIMENTO"/>
          <xs:enumeration value="CASAMENTO"/>
          <xs:enumeration value="OUTROS"/>
      </xs:restriction>
  </xs:simpleType>
  <xs:complexType name="retificacaoObito">
      <xs:sequence>
          <xs:element name="dataRetificacao" type="xs:dateTime" minOccurs="0"/>
          <xs:element name="processoJudicial" type="string30" minOccurs="0"/>
          <xs:element name="dataSentencaJudicial" type="xs:dateTime" minOccurs="0"/>
          <xs:element name="dadosComplementares" type="xs:string" minOccurs="0"/>
      </xs:sequence>
  </xs:complexType>
  <xs:simpleType name="string5">
    <xs:restriction base="xs:string">
      <xs:maxLength value="5"></xs:maxLength>
    </xs:restriction>
  </xs:simpleType>
  <xs:simpleType name="string9">
    <xs:restriction base="xs:string">
      <xs:maxLength value="9"></xs:maxLength>
    </xs:restriction>
  </xs:simpleType>
```

```
  <xs:simpleType name="string10">
    <xs:restriction base="xs:string">
      <xs:maxLength value="10"></xs:maxLength>
    </xs:restriction>
  </xs:simpleType>
```

```
  <xs:simpleType name="string11">
    <xs:restriction base="xs:string">
      <xs:maxLength value="11"></xs:maxLength>
    </xs:restriction>
  </xs:simpleType>
```

```
  <xs:simpleType name="string20">
    <xs:restriction base="xs:string">
      <xs:maxLength value="20"></xs:maxLength>
    </xs:restriction>
  </xs:simpleType>
  <xs:simpleType name="string30">
    <xs:restriction base="xs:string">
      <xs:maxLength value="30"></xs:maxLength>
    </xs:restriction>
  </xs:simpleType>
```

```
  <xs:simpleType name="string32">
    <xs:restriction base="xs:string">
      <xs:maxLength value="32"></xs:maxLength>
    </xs:restriction>
  </xs:simpleType>
```

```
  <xs:simpleType name="string100">
    <xs:restriction base="xs:string">
      <xs:maxLength value="100"></xs:maxLength>
```

```
    </xs:restriction>
```

--- end of page.page_number=77 ---

P á g i n a | 78 

SIRC – Sistema Nacional de Informação de Registro Civil 

```
  </xs:simpleType>
  <xs:simpleType name="string200">
    <xs:restriction base="xs:string">
      <xs:maxLength value="200"></xs:maxLength>
    </xs:restriction>
  </xs:simpleType>
  <xs:simpleType name="string255">
    <xs:restriction base="xs:string">
      <xs:maxLength value="255"></xs:maxLength>
    </xs:restriction>
  </xs:simpleType>
  <xs:simpleType name="string500">
    <xs:restriction base="xs:string">
      <xs:maxLength value="500"></xs:maxLength>
    </xs:restriction>
  </xs:simpleType>
  <xs:simpleType name="string1000">
    <xs:restriction base="xs:string">
      <xs:maxLength value="1000"></xs:maxLength>
    </xs:restriction>
  </xs:simpleType>
  <xs:simpleType name="string2000">
    <xs:restriction base="xs:string">
      <xs:maxLength value="2000"></xs:maxLength>
    </xs:restriction>
  </xs:simpleType>
  <xs:simpleType name="string1024">
    <xs:restriction base="xs:string">
      <xs:maxLength value="1024"></xs:maxLength>
    </xs:restriction>
  </xs:simpleType>
  <xs:simpleType name="string4000">
    <xs:restriction base="xs:string">
      <xs:maxLength value="4000"></xs:maxLength>
    </xs:restriction>
  </xs:simpleType>
  <xs:simpleType name="numeroSerie">
    <xs:restriction base="xs:string">
<xs:pattern value="[a-zA-Z]{2}[0-9]{9}"/>
    </xs:restriction>
  </xs:simpleType>
```

```
</xs:schema>
```

--- end of page.page_number=78 ---

P á g i n a | 79 

## SIRC – Sistema Nacional de Informação de Registro Civil 

## _**8.3 Registro de Casamento (Versão layout 5.0)**_ 

## **MovimentoCasamentoTO.xsd** 

```
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
```

```
<xs:schema version="1.0" xmlns:xs="http://www.w3.org/2001/XMLSchema">
```

```
  <xs:element name="movimentoCasamentoTO" type="movimentoCasamentoTO"/>
```

```
  <xs:complexType name="movimentoCasamentoTO">
```

```
    <xs:sequence>
```

```
      <xs:element name="versaoLayoutCasamento" type="versaoLayoutCasamento" />
```

```
      <xs:element name="registroCasamentoInclusao" type="registroCasamento" minOccurs="0"
maxOccurs="unbounded"/>
```

```
      <xs:element name="registroCasamentoAlteracao" type="registroCasamento" minOccurs="0"
maxOccurs="unbounded"/>
      <xs:element name="registroCasamentoExclusao" type="registroCasamento" minOccurs="0"
maxOccurs="unbounded"/>
```

```
    </xs:sequence>
```

```
  </xs:complexType>
```

```
  <xs:simpleType name="versaoLayoutCasamento">
```

```
    <xs:restriction base="xs:string">
```

```
      <xs:enumeration value="5.0"/>
```

```
</xs:restriction>
```

```
  </xs:simpleType>
```

```
  <xs:complexType name="registroCasamento">
```

```
    <xs:complexContent>
```

```
      <xs:extension base="registroCasamentoAbstrato">
```

```
        <xs:sequence>
```

```
          <xs:element name="conjuge1" type="conjuge"/>
```

```
          <xs:element name="conjuge2" type="conjuge"/>
```

```
        </xs:sequence>
```

```
      </xs:extension>
```

```
    </xs:complexContent>
```

```
  </xs:complexType>
```

```
  <xs:complexType name="registroCasamentoAbstrato" abstract="true">
```

```
    <xs:complexContent>
```

```
      <xs:extension base="registroCivil">
```

```
        <xs:sequence>
```

```
          <xs:element name="codigoMunicipioIBGECasamentoReligioso" type="xs:int" minOccurs="0"/>
```

```
          <xs:element name="textoLivreMunicipioLocalCasamento" type="string100" minOccurs="0"/>
```

```
          <xs:element name="codigoUFIBGECasamentoReligioso" type="xs:int" minOccurs="0"/>
```

```
          <xs:element name="codigoServentiaEscrituraAntenupcial" type="xs:int" minOccurs="0"/>
```

```
          <xs:element name="dataCelebracaoCasamento" type="xs:dateTime" minOccurs="0"/>
```

```
          <xs:element name="dataCelebracaoCasamentoIgnorada" type="xs:boolean" minOccurs="0"/>
```

```
          <xs:element name="dataEscrituraAntenupcial" type="xs:dateTime" minOccurs="0"/>
```

```
          <xs:element name="dataPublicacaoProclamas" type="xs:dateTime" minOccurs="0"/>
```

```
          <xs:element name="descricaoLocalCasamentoReligioso" type="string1000" minOccurs="0"/>
```

```
          <xs:element name="impressosSegurancaCasamento" type="impressoSeguranca" nillable="true"
minOccurs="0" maxOccurs="unbounded"/>
          <xs:element name="nomeCelebranteCasamentoReligioso" type="string100" minOccurs="0"/>
```

```
          <xs:element name="nomeCelebranteCasamentoReligiosoEspecial" type="xs:boolean" minOccurs="0"/>
```

```
          <xs:element name="paisCelebracaoCasamento" type="xs:int" minOccurs="0"/>
```

```
          <xs:element name="qualidadeCelebranteCasamentoReligioso" type="string100" minOccurs="0"/>
```

```
          <xs:element name="regimeCasamento" type="regimeCasamento" minOccurs="0"/>
```

```
          <xs:element name="averbacoesCasamento" type="averbacaoCasamento" minOccurs="0"
maxOccurs="unbounded"/>
          <xs:element name="anotacoesCasamento" type="anotacaoCasamento" minOccurs="0" maxOccurs="unbounded"/>
          <xs:element name="retificacoesCasamento" type="retificacaoCasamento" minOccurs="0"
maxOccurs="unbounded"/>
```

```
          <xs:element name="conjugesNomesIguais" type="xs:boolean" minOccurs="0"/>
```

- **`<xs:element name="conjugesNomesIguaisPosCasamento" type="xs:boolean" minOccurs="0"/>`** 

```
        </xs:sequence>
```

```
      </xs:extension>
```

```
    </xs:complexContent>
```

```
  </xs:complexType>
```

```
  <xs:complexType name="registroCivil" abstract="true">
```

```
    <xs:sequence>
```

```
      <xs:element name="acervo">
```

```
<xs:simpleType>
```

```
<xs:restriction base="xs:byte">
```

--- end of page.page_number=79 ---

P á g i n a | 80 

## SIRC – Sistema Nacional de Informação de Registro Civil 

```
<xs:minInclusive value="0"/>
```

```
<xs:maxInclusive value="99"/>
```

```
</xs:restriction>
```

```
</xs:simpleType>
```

```
      </xs:element>
```

```
      <xs:element name="anoRegistro">
```

```
<xs:simpleType>
```

```
<xs:restriction base="xs:short">
```

```
<xs:minInclusive value="0"/>
```

```
<xs:maxInclusive value="9999"/>
```

```
</xs:restriction>
```

```
</xs:simpleType>
```

```
      </xs:element>
```

```
      <xs:element name="cnsConsuladoRegistro" minOccurs="0">
```

```
<xs:simpleType>
```

```
<xs:restriction base="xs:int">
```

```
<xs:minInclusive value="0"/>
```

```
<xs:maxInclusive value="999999"/>
```

```
</xs:restriction>
```

```
</xs:simpleType>
```

```
      </xs:element>
```

```
      <xs:element name="codServentia">
```

```
<xs:simpleType>
```

```
<xs:restriction base="xs:int">
```

```
<xs:minInclusive value="0"/>
```

```
<xs:maxInclusive value="999999"/>
```

```
</xs:restriction>
```

```
</xs:simpleType>
```

```
      </xs:element>
```

```
       <xs:element name="cpfEnvioParaCER"  minOccurs="0">
```

```
<xs:simpleType>
```

```
<xs:restriction base="xs:string">
<xs:pattern value="[0-9]{11}"/>
```

```
</xs:restriction>
```

```
</xs:simpleType>
```

```
      </xs:element>
```

```
  <xs:element name="dataEnvioParaCER" type="xs:dateTime"  minOccurs="0"/>
```

```
      <xs:element name="dataRegistro" type="xs:dateTime" minOccurs="0"/>
```

```
      <xs:element name="dataSentencaJudicial" type="xs:dateTime" minOccurs="0"/>
```

```
      <xs:element name="dataTransitoJulgadoJudicial" type="xs:dateTime" minOccurs="0"/>
```

```
      <xs:element name="dvMatricula">
```

```
<xs:simpleType>
<xs:restriction base="xs:string">
<xs:pattern value="[0-9]{2}|XX"/>
```

```
</xs:restriction>
```

```
</xs:simpleType>
```

```
      </xs:element>
```

```
      <xs:element name="folha">
```

```
<xs:simpleType>
```

```
<xs:restriction base="xs:short">
<xs:minInclusive value="0"/>
<xs:maxInclusive value="999"/>
```

```
</xs:restriction>
```

```
</xs:simpleType>
```

```
      </xs:element>
```

```
      <xs:element name="indicadorMatriculaRepetida" minOccurs="0">
```

```
<xs:simpleType>
```

```
<xs:restriction base="xs:int">
<xs:minInclusive value="1"/>
```

```
<xs:maxInclusive value="999"/>
```

```
</xs:restriction>
</xs:simpleType>
```

```
      </xs:element>
```

```
      <xs:element name="informacoesConsulado" type="string200" minOccurs="0"/>
```

```
      <xs:element name="justificativaAusenciaCamposObrigatorios" minOccurs="0">
<xs:simpleType>
```

```
<xs:restriction base="xs:string">
```

```
<xs:minLength value="10"/>
```

--- end of page.page_number=80 ---

P á g i n a | 81 

## SIRC – Sistema Nacional de Informação de Registro Civil 

```
<xs:maxLength value="4000"/>
```

```
</xs:restriction>
```

```
</xs:simpleType>
```

```
      </xs:element>
```

```
      <xs:element name="justificativasAusenciaCamposObrigatorios" type="justificativasCasamento"
nillable="true" minOccurs="0" maxOccurs="unbounded"/>
```

```
      <xs:element name="nomeJuizJudicial" type="string100" minOccurs="0"/>
```

```
      <xs:element name="nomeJuizadoJudicial" type="string100" minOccurs="0"/>
```

```
      <xs:element name="numeroLivro">
```

```
<xs:simpleType>
```

```
<xs:restriction base="xs:int">
```

```
<xs:minInclusive value="0"/>
```

```
<xs:maxInclusive value="99999"/>
</xs:restriction>
```

```
</xs:simpleType>
```

```
      </xs:element>
```

```
      <xs:element name="numeroProcessoJudicial" type="string30" minOccurs="0"/>
```

```
      <xs:element name="observacoes" type="string4000" minOccurs="0"/>
```

```
      <xs:element name="orgaoEmissorExterior" type="string200" minOccurs="0"/>
```

```
      <xs:element name="registroJudicial" type="xs:boolean" minOccurs="0"/>
```

```
      <xs:element name="termo">
```

```
<xs:simpleType>
<xs:restriction base="xs:int">
<xs:minInclusive value="0"/>
<xs:maxInclusive value="9999999"/>
</xs:restriction>
</xs:simpleType>
```

```
      </xs:element>
```

```
      <xs:element name="tipoLivro">
<xs:simpleType>
<xs:restriction base="xs:byte">
<xs:minInclusive value="1"/>
<xs:maxInclusive value="9"/>
```

```
</xs:restriction>
</xs:simpleType>
```

```
      </xs:element>
```

```
      <xs:element name="tipoServico">
<xs:simpleType>
<xs:restriction base="xs:byte">
<xs:minInclusive value="1"/>
<xs:maxInclusive value="99"/>
</xs:restriction>
```

```
</xs:simpleType>
```

```
      </xs:element>
```

```
    </xs:sequence>
  </xs:complexType>
```

```
  <xs:complexType name="conjuge">
```

```
    <xs:complexContent>
```

```
      <xs:extension base="conjugeAbstrato">
        <xs:sequence/>
      </xs:extension>
    </xs:complexContent>
  </xs:complexType>
```

```
  <xs:complexType name="conjugeAbstrato" abstract="true">
```

```
    <xs:sequence>
```

```
      <xs:element name="bairroConjuge" type="string100" minOccurs="0"/>
```

```
      <xs:element name="codigoIBGEMunicipioLogradouroConjuge" type="xs:int" minOccurs="0"/>
      <xs:element name="textoLivreMunicipioLogradouro" type="string100" minOccurs="0"/>
```

```
      <xs:element name="codigoIBGEMunicipioLogradouroConjugeIgnorado" type="xs:boolean" minOccurs="0"/>
      <xs:element name="codigoIBGEMunicipioNaturalidade" type="xs:int" minOccurs="0"/>
      <xs:element name="codigoIBGEUFLogradouroConjuge" type="xs:int" minOccurs="0"/>
      <xs:element name="codigoIBGEUFLogradouroConjugeIgnorado" type="xs:boolean" minOccurs="0"/>
      <xs:element name="codigoIBGEUFNaturalidade" type="xs:int" minOccurs="0"/>
      <xs:element name="codigoIBGEUFNaturalidadeIgnorado" type="xs:boolean" minOccurs="0"/>
      <xs:element name="codigoOcupacaoSDC" type="xs:int" minOccurs="0"/>
```

```
      <xs:element name="codigoOcupacaoSDCIgnorado" type="xs:boolean" minOccurs="0"/>
```

--- end of page.page_number=81 ---

P á g i n a | 82 

## SIRC – Sistema Nacional de Informação de Registro Civil 

- **`<xs:element name="complementoLogradouroConjuge" type="string100" minOccurs="0"/>`** 

- **`<xs:element name="dataDissolucaoCasamentoAnterior" type="xs:dateTime" minOccurs="0"/>`** 

- **`<xs:element name="dataNascimento" type="xs:dateTime" minOccurs="0"/>`** 

- **`<xs:element name="dataNascimentoIgnorada" type="xs:boolean" minOccurs="0"/> <xs:element name="documentosConjuge" type="documentoConjuge" nillable="true" minOccurs="0" maxOccurs="unbounded"/> <xs:element name="cpfConjugeIgnorado" type="xs:boolean" minOccurs="0"/>`** 

```
      <xs:element name="documentosConjugeIgnorado" type="xs:boolean" minOccurs="0"/>
```

```
      <xs:element name="domicilioEstrangeiroConjuge" type="string255" minOccurs="0"/>
```

```
      <xs:element name="domicilioEstrangeiroConjugeIgnorado" type="xs:boolean" minOccurs="0"/>
```

```
      <xs:element name="filiacoesConjuge" type="filiacaoConjuge" minOccurs="2" maxOccurs="unbounded" />
      <xs:element name="logradouroConjuge" type="string100" minOccurs="0"/>
```

```
      <xs:element name="logradouroConjugeIgnorado" type="xs:boolean" minOccurs="0"/>
```

```
      <xs:element name="municipioNaturalidadeIgnoradoDuplo" type="xs:boolean" minOccurs="0"/>
```

```
      <xs:element name="nacionalidade" type="xs:int" minOccurs="0"/>
```

```
      <xs:element name="nacionalidadeIgnorada" type="xs:boolean" minOccurs="0"/>
      <xs:element name="nome" type="string100" minOccurs="0"/>
```

```
      <xs:element name="nomeEspecial" type="xs:boolean" minOccurs="0" />
```

```
      <xs:element name="nomeConjugePosCasamento" type="string100" minOccurs="0"/>
```

```
      <xs:element name="nomeConjugePosCasamentoEspecial" type="xs:boolean" minOccurs="0" />
```

```
      <xs:element name="nomeConjugePosCasamentoIgnorado" type="xs:boolean" minOccurs="0"/>
      <xs:element name="nomeConjugePrecedente" type="string100" minOccurs="0"/>
```

```
      <xs:element name="nomeConjugePrecedenteEspecial" type="xs:boolean" minOccurs="0" />
```

```
      <xs:element name="numeroLogradouroConjuge" type="string20" minOccurs="0"/>
```

```
      <xs:element name="numeroLogradouroConjugeIgnorado" type="xs:boolean" minOccurs="0"/>
      <xs:element name="paisNascimento" type="xs:int" minOccurs="0"/>
```

```
      <xs:element name="paisNascimentoIgnorado" type="xs:boolean" minOccurs="0"/>
```

```
      <xs:element name="sexo" type="sexoConjuge" minOccurs="0"/>
```

```
      <xs:element name="sexoIgnorado" type="xs:boolean" minOccurs="0" />
```

```
      <xs:element name="genero" type="string100" minOccurs="0" />
```

```
      <xs:element name="textoLivreMunicipioNaturalidade" type="string100" minOccurs="0"/>
```

```
      <xs:element name="filiacaoNomesIguais" type="xs:boolean" minOccurs="0"/>
```

```
    </xs:sequence>
```

```
  </xs:complexType>
```

## **`<xs:complexType name="filiacaoConjuge">`** 

```
<xs:sequence>
```

```
      <xs:element name="bairro" type="string100" minOccurs="0"/>
      <xs:element name="codigoIBGEMunicipioLogradouro" type="xs:int" minOccurs="0"/>
      <xs:element name="textoLivreMunicipioLogradouro" type="string100" minOccurs="0"/>
      <xs:element name="codigoIBGEMunicipioNaturalidade" type="xs:int" minOccurs="0"/>
      <xs:element name="codigoIBGEUFLogradouro" type="xs:int" minOccurs="0"/>
      <xs:element name="codigoIBGEUFNaturalidade" type="xs:int" minOccurs="0"/>
      <xs:element name="codigoIBGEUFNaturalidadeIgnorado" type="xs:boolean" minOccurs="0"/>
      <xs:element name="complementoLogradouro" type="string100" minOccurs="0"/>
      <xs:element name="dataFalecimento" type="xs:dateTime" minOccurs="0"/>
      <xs:element name="dataFalecimentoIgnorada" type="xs:boolean" minOccurs="0"/>
      <xs:element name="dataNascimento" type="xs:dateTime" minOccurs="0"/>
      <xs:element name="dataNascimentoIgnorada" type="xs:boolean" minOccurs="0"/>
      <xs:element name="domicilioEstrangeiro" type="string255" minOccurs="0"/>
      <xs:element name="logradouro" type="string100" minOccurs="0"/>
      <xs:element name="municipioNaturalidadeIgnoradoDuplo" type="xs:boolean" minOccurs="0"/>
      <xs:element name="nacionalidade" type="xs:int" minOccurs="0"/>
      <xs:element name="nacionalidadeIgnorada" type="xs:boolean" minOccurs="0"/>
      <xs:element name="nome" type="string100" minOccurs="0"/>
      <xs:element name="nomeEspecial" type="xs:boolean" minOccurs="0" />
      <xs:element name="nomeIgnorado" type="xs:boolean" minOccurs="0"/>
      <xs:element name="numeroLogradouro" type="string20" minOccurs="0"/>
      <xs:element name="paisNascimento" type="xs:int" minOccurs="0"/>
      <xs:element name="paisNascimentoIgnorado" type="xs:boolean" minOccurs="0"/>
      <xs:element name="sexo" type="sexoConjuge" minOccurs="0"/>
      <xs:element name="sexoIgnorado" type="xs:boolean" minOccurs="0" />
      <xs:element name="genero" type="string100" minOccurs="0" />
```

```
      <xs:element name="textoLivreMunicipioNaturalidade" type="string100" minOccurs="0"/>
    </xs:sequence>
```

```
  </xs:complexType>
```

```
  <xs:complexType name="documentoConjuge">
```

```
    <xs:complexContent>
      <xs:extension base="documento">
        <xs:sequence/>
      </xs:extension>
    </xs:complexContent>
  </xs:complexType>
```

```
  <xs:complexType name="documento">
```

```
    <xs:sequence>
```

```
      <xs:element name="dataEmissao" type="xs:dateTime" minOccurs="0"/>
```

```
      <xs:element name="descricao" type="string100" minOccurs="0"/>
```

```
      <xs:element name="dono" type="donoDocumento"/>
```

--- end of page.page_number=82 ---

P á g i n a | 83 

## SIRC – Sistema Nacional de Informação de Registro Civil 

```
      <xs:element name="numero" type="string32" minOccurs="0"/>
      <xs:element name="numeroSerie" type="string5" minOccurs="0"/>
      <xs:element name="orgaoEmissao" type="xs:int" minOccurs="0"/>
      <xs:element name="tipo" type="tipoDocumento"/>
      <xs:element name="ufEmissao" type="xs:int" minOccurs="0"/>
    </xs:sequence>
  </xs:complexType>
  <xs:simpleType name="donoDocumento">
    <xs:restriction base="xs:string">
      <xs:enumeration value="MAE_NASCIMENTO"/>
      <xs:enumeration value="PAI_NASCIMENTO"/>
      <xs:enumeration value="DECLARANTE"/>
      <xs:enumeration value="FALECIDO"/>
      <xs:enumeration value="CONJUGE1"/>
      <xs:enumeration value="CONJUGE2"/>
    </xs:restriction>
  </xs:simpleType>
```

```
  <xs:complexType name="impressoSeguranca">
    <xs:sequence>
      <xs:element name="dataUtilizacao" type="xs:dateTime"/>
      <xs:element name="numeroSerie" type="numeroSerie"/>
      <xs:element name="segundaVia" type="xs:boolean" />
    </xs:sequence>
  </xs:complexType>
```

```
  <xs:simpleType name="tipoDocumento">
    <xs:restriction base="xs:string">
      <xs:enumeration value="CPF"/>
      <xs:enumeration value="RG"/>
      <xs:enumeration value="NIT"/>
      <xs:enumeration value="RIC"/>
      <xs:enumeration value="RNE"/>
      <xs:enumeration value="TITULO_DE_ELEITOR"/>
      <xs:enumeration value="PASSAPORTE"/>
      <xs:enumeration value="CNH"/>
      <xs:enumeration value="CTPS"/>
      <xs:enumeration value="DOC_ESTRANGEIRO"/>
      <xs:enumeration value="CERT_DE_NASCIMENTO"/>
      <xs:enumeration value="CERT_DE_CASAMENTO"/>
    </xs:restriction>
  </xs:simpleType>
  <xs:simpleType name="sexoConjuge">
    <xs:restriction base="xs:string">
      <xs:enumeration value="MASCULINO"/>
      <xs:enumeration value="FEMININO"/>
      <xs:enumeration value="NAO_BINARIO"/>
      <xs:enumeration value="OUTROS"/>
      <xs:enumeration value="NAO_DECLARADO"/>
      <xs:enumeration value="IGNORADO"/>
    </xs:restriction>
  </xs:simpleType>
  <xs:simpleType name="regimeCasamento">
    <xs:restriction base="xs:string">
      <xs:enumeration value="COMUNHAO_PARCIAL"/>
      <xs:enumeration value="COMUNHAO_UNIVERSAL"/>
      <xs:enumeration value="PARTICIPACAO_FINAL_AQUESTOS"/>
      <xs:enumeration value="SEPARACAO_BENS"/>
      <xs:enumeration value="OUTROS"/>
      <xs:enumeration value="COMUNHAO_GERAL"/>
      <xs:enumeration value="REGIME_HIBRIDO"/>
      <xs:enumeration value="PARTICIPACAO_FINAL_AQUESTROS"/>
    </xs:restriction>
  </xs:simpleType>
  <xs:complexType name="justificativasCasamento">
    <xs:sequence>
      <xs:element name="codigoJustificativa" type="codigoJustificativa"/>
    </xs:sequence>
  </xs:complexType>
  <xs:simpleType name="codigoJustificativa">
    <xs:restriction base="xs:string">
      <xs:enumeration value="RFB_INDISPONIVEL"/>
      <xs:enumeration value="CPF_REGISTRADO_NAO_APRESENTADO"/>
      <xs:enumeration value="CPF_REGISTRADO_INEXISTENTE"/>
      <xs:enumeration value="DATA_NASCIMENTO_REGISTRADO_INCOMPLETA"/>
      <xs:enumeration value="DATA_NASCIMENTO_REGISTRADO_DESCONHECIDA"/>
```

--- end of page.page_number=83 ---

P á g i n a | 84 

## SIRC – Sistema Nacional de Informação de Registro Civil 

```
      <xs:enumeration value="MUNICIPIO_REGISTRADO_DESCONHECIDO"/>
      <xs:enumeration value="OUTROS"/>
    </xs:restriction>
  </xs:simpleType>
```

```
  <xs:complexType name="averbacaoCasamento">
      <xs:sequence>
          <xs:element name="dataAverbacao" type="xs:dateTime" minOccurs="0"/>
          <xs:element name="motivoAverbacao" type="motivoAverbacaoCasamento" minOccurs="0"/>
          <xs:element name="dataMotivoAverbacao" type="xs:dateTime" minOccurs="0"/>
          <xs:element name="processoJudicial" type="string30" minOccurs="0"/>
          <xs:element name="dataSentencaJudicial" type="xs:dateTime" minOccurs="0"/>
          <xs:element name="dadosComplementares" type="xs:string" minOccurs="0"/>
      </xs:sequence>
  </xs:complexType>
```

```
  <xs:simpleType name="motivoAverbacaoCasamento">
      <xs:restriction base="xs:string">
          <xs:enumeration value="SEPARACAO"/>
          <xs:enumeration value="DIVORCIO"/>
          <xs:enumeration value="ANULACAO"/>
          <xs:enumeration value="NULIDADE"/>
          <xs:enumeration value="CANCELAMENTO"/>
          <xs:enumeration value="ANOTACAO_CPF"/>
          <xs:enumeration value="CONVERSAO_SEPARACAO_DIVORCIO"/>
          <xs:enumeration value="ALTERACAO_REGIME_BENS"/>
          <xs:enumeration value="RESTABELECIMENTO_SOCIEDADE_CONJUGAL"/>
          <xs:enumeration value="OUTROS"/>
      </xs:restriction>
  </xs:simpleType>
  <xs:complexType name="anotacaoCasamento">
      <xs:sequence>
          <xs:element name="dataAnotacao" type="xs:dateTime" minOccurs="0"/>
          <xs:element name="motivoAnotacao" type="motivoAnotacaoCasamento" minOccurs="0"/>
          <xs:element name="matricula" type="string32" minOccurs="0"/>
          <xs:element name="dadosComplementares" type="xs:string" minOccurs="0"/>
      </xs:sequence>
  </xs:complexType>
  <xs:simpleType name="motivoAnotacaoCasamento">
      <xs:restriction base="xs:string">
          <xs:enumeration value="NASCIMENTO"/>
          <xs:enumeration value="OBITO"/>
          <xs:enumeration value="OUTROS"/>
          <xs:enumeration value="INTERDICAO"/>
          <xs:enumeration value="AUSENCIA"/>
          <xs:enumeration value="MORTE_PRESUMIDA"/>
      </xs:restriction>
  </xs:simpleType>
  <xs:complexType name="retificacaoCasamento">
      <xs:sequence>
          <xs:element name="dataRetificacao" type="xs:dateTime" minOccurs="0"/>
          <xs:element name="processoJudicial" type="string30" minOccurs="0"/>
          <xs:element name="dataSentencaJudicial" type="xs:dateTime" minOccurs="0"/>
          <xs:element name="dadosComplementares" type="xs:string" minOccurs="0"/>
      </xs:sequence>
  </xs:complexType>
  <xs:simpleType name="string5">
    <xs:restriction base="xs:string">
      <xs:maxLength value="5"></xs:maxLength>
    </xs:restriction>
  </xs:simpleType>
  <xs:simpleType name="string11">
    <xs:restriction base="xs:string">
      <xs:maxLength value="11"></xs:maxLength>
    </xs:restriction>
  </xs:simpleType>
  <xs:simpleType name="string20">
    <xs:restriction base="xs:string">
      <xs:maxLength value="20"></xs:maxLength>
    </xs:restriction>
  </xs:simpleType>
```

```
  <xs:simpleType name="string30">
```

```
    <xs:restriction base="xs:string">
```

```
      <xs:maxLength value="30"></xs:maxLength>
```

--- end of page.page_number=84 ---

P á g i n a | 85 

SIRC – Sistema Nacional de Informação de Registro Civil 

```
    </xs:restriction>
  </xs:simpleType>
  <xs:simpleType name="string32">
    <xs:restriction base="xs:string">
      <xs:maxLength value="32"></xs:maxLength>
    </xs:restriction>
  </xs:simpleType>
  <xs:simpleType name="string100">
    <xs:restriction base="xs:string">
      <xs:maxLength value="100"></xs:maxLength>
    </xs:restriction>
  </xs:simpleType>
```

```
  <xs:simpleType name="string200">
    <xs:restriction base="xs:string">
      <xs:maxLength value="200"></xs:maxLength>
    </xs:restriction>
  </xs:simpleType>
```

```
  <xs:simpleType name="string255">
    <xs:restriction base="xs:string">
      <xs:maxLength value="255"></xs:maxLength>
    </xs:restriction>
  </xs:simpleType>
```

```
  <xs:simpleType name="string1000">
    <xs:restriction base="xs:string">
      <xs:maxLength value="1000"></xs:maxLength>
    </xs:restriction>
  </xs:simpleType>
```

```
  <xs:simpleType name="string2000">
    <xs:restriction base="xs:string">
      <xs:maxLength value="2000"></xs:maxLength>
    </xs:restriction>
  </xs:simpleType>
```

```
  <xs:simpleType name="string4000">
    <xs:restriction base="xs:string">
      <xs:maxLength value="4000"></xs:maxLength>
    </xs:restriction>
  </xs:simpleType>
```

```
  <xs:simpleType name="numeroSerie">
    <xs:restriction base="xs:string">
<xs:pattern value="[a-zA-Z]{2}[0-9]{9}"/>
    </xs:restriction>
  </xs:simpleType>
```

```
</xs:schema>
```

--- end of page.page_number=85 ---

P á g i n a | 86 

## SIRC – Sistema Nacional de Informação de Registro Civil 

## _**8.4 Declaração de Inexistência de Movimento (Versão 1.0)**_ 

## **DeclaracaoInexistenciaMovimentoServicoTO.xsd** 

```
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
```

```
<xs:schema version="1.0" xmlns:xs="http://www.w3.org/2001/XMLSchema">
```

```
<xs:element name="declaracaoInexistenciaMovimentoServicoTO" type="declaracaoInexistenciaMovimentoTO" />
<xs:complexType name="declaracaoInexistenciaMovimentoTO">
```

```
<xs:sequence>
```

```
<xs:element name="competencia" type="competencia" />
```

```
<xs:element name="declaracaoInexistenciaMovimentoCasamento" type="xs:boolean"
```

```
minOccurs="0" />
```

```
<xs:element name="declaracaoInexistenciaMovimentoNascimento" type="xs:boolean"
```

```
minOccurs="0" />
<xs:element name="declaracaoInexistenciaMovimentoObito" type="xs:boolean"
```

```
minOccurs="0" />
<xs:element name="declaracaoInexistenciaMovimentoObitoNatimorto" type="xs:boolean"
minOccurs="0" />
```

```
</xs:sequence>
```

```
</xs:complexType>
```

```
<xs:simpleType name="competencia">
```

```
<xs:restriction base="xs:string">
<xs:pattern value="([0]?[1-9]|10|11|12)/[0-9]{4}" />
```

```
</xs:restriction>
```

```
</xs:simpleType>
```

```
</xs:schema>
```

--- end of page.page_number=86 ---

P á g i n a | 87 

## SIRC – Sistema Nacional de Informação de Registro Civil 

## _**8.5 Cancelamento de Termos (Versão layout 1.1)**_ 

## **MovimentoCancelamentoTO.xsd** 

```
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
```

```
<xs:schema version="1.0" xmlns:xs="http://www.w3.org/2001/XMLSchema">
```

```
  <xs:element name="movimentoCancelamentoTO" type="movimentoCancelamentoTO"/>
```

```
  <xs:complexType name="movimentoCancelamentoTO">
```

```
    <xs:sequence>
```

```
      <xs:element name="versaoLayoutCancelamento" type="versaoLayoutCancelamento" />
```

```
      <xs:element name="registroTermoCancelado" type="termoCancelado" minOccurs="0" maxOccurs="unbounded"/>
    </xs:sequence>
```

```
  </xs:complexType>
```

```
  <xs:simpleType name="versaoLayoutCancelamento">
```

```
    <xs:restriction base="xs:string">
```

```
      <xs:enumeration value="1.1"/>
```

```
</xs:restriction>
```

```
  </xs:simpleType>
```

```
  <xs:complexType name="termoCancelado" >
```

```
    <xs:sequence>
```

```
      <xs:element name="motivo" type="string350" minOccurs="1" />
```

```
      <xs:element name="tipoRegistroCivil" type="tipoRegistroCivil" minOccurs="1"/>
```

```
      <xs:element name="codServentia" minOccurs="1">
```

```
<xs:simpleType>
```

```
<xs:restriction base="xs:int">
```

```
<xs:minInclusive value="0"/>
<xs:maxInclusive value="999999"/>
</xs:restriction>
```

```
</xs:simpleType>
```

```
      </xs:element>
```

```
      <xs:element name="acervo" minOccurs="1">
```

```
<xs:simpleType>
<xs:restriction base="xs:int">
<xs:minInclusive value="0"/>
<xs:maxInclusive value="99"/>
```

```
</xs:restriction>
</xs:simpleType>
      </xs:element>
```

```
      <xs:element name="tipoServico" minOccurs="1">
```

```
<xs:simpleType>
<xs:restriction base="xs:byte">
<xs:minInclusive value="1"/>
<xs:maxInclusive value="99"/>
```

```
</xs:restriction>
</xs:simpleType>
```

```
      </xs:element>
```

```
      <xs:element name="termo" minOccurs="1">
```

```
<xs:simpleType>
<xs:restriction base="xs:int">
<xs:minInclusive value="1"/>
<xs:maxInclusive value="9999999"/>
```

```
</xs:restriction>
</xs:simpleType>
```

```
      </xs:element>
```

```
      <xs:element name="tipoLivro" minOccurs="1">
<xs:simpleType>
<xs:restriction base="xs:byte">
<xs:minInclusive value="1"/>
<xs:maxInclusive value="9"/>
</xs:restriction>
</xs:simpleType>
```

```
      </xs:element>
```

```
      <xs:element name="anoRegistro" minOccurs="0">
```

```
<xs:simpleType>
```

--- end of page.page_number=87 ---

P á g i n a | 88 

## SIRC – Sistema Nacional de Informação de Registro Civil 

```
<xs:restriction base="xs:short">
```

```
<xs:minInclusive value="1"/>
```

```
<xs:maxInclusive value="9999"/>
```

```
</xs:restriction>
```

```
</xs:simpleType>
```

```
      </xs:element>
```

```
      <xs:element name="dataEnvioParaCER" type="xs:dateTime"  minOccurs="0"/>
```

```
       <xs:element name="dvMatricula" minOccurs="0">
```

```
<xs:simpleType>
```

```
<xs:restriction base="xs:string">
<xs:pattern value="[0-9]{2}|XX"/>
```

```
</xs:restriction>
```

```
</xs:simpleType>
```

```
      </xs:element>
```

```
       <xs:element name="folha" minOccurs="0">
```

```
<xs:simpleType>
<xs:restriction base="xs:short">
<xs:minInclusive value="1"/>
```

```
<xs:maxInclusive value="999"/>
```

```
</xs:restriction>
```

```
</xs:simpleType>
```

```
      </xs:element>
```

```
       <xs:element name="numeroLivro" minOccurs="0">
```

```
<xs:simpleType>
<xs:restriction base="xs:int">
<xs:minInclusive value="1"/>
```

```
<xs:maxInclusive value="99999"/>
```

```
</xs:restriction>
```

```
</xs:simpleType>
```

```
      </xs:element>
```

```
    </xs:sequence>
  </xs:complexType>
```

```
  <xs:simpleType name="string30">
```

```
    <xs:restriction base="xs:string">
      <xs:maxLength value="30"></xs:maxLength>
    </xs:restriction>
  </xs:simpleType>
```

```
  <xs:simpleType name="string500">
```

```
    <xs:restriction base="xs:string">
```

```
      <xs:maxLength value="500"></xs:maxLength>
    </xs:restriction>
  </xs:simpleType>
```

```
    <xs:simpleType name="string350">
    <xs:restriction base="xs:string">
```

```
      <xs:maxLength value="350"></xs:maxLength>
    </xs:restriction>
```

```
  </xs:simpleType>
```

```
 <xs:simpleType name="tipoRegistroCivil">
```

```
    <xs:restriction base="xs:string">
      <xs:enumeration value="NASCIMENTO"/>
      <xs:enumeration value="CASAMENTO"/>
      <xs:enumeration value="OBITO"/>
    </xs:restriction>
  </xs:simpleType>
```

```
</xs:schema>
```

--- end of page.page_number=88 ---

P á g i n a | 89 

SIRC – Sistema Nacional de Informação de Registro Civil 

## **9 Notas de Versão** 

Nesta seção serão descritas as novidades, problemas conhecidos e dúvidas frequentes em relação à última versão do SIRC. 

## _**9.1 Versão 4.0**_ 

Alteração do layout de envio de registros civis para a versão 3.0, com as seguintes mudanças: 

- Inclusão de Documentos para Filiação de Óbito (natimorto); _* Para o tipo de livro 4, a informação é opcional._ 

- Inclusão de Data de Nascimento para Filiação de Óbito (natimorto); _* Para o tipo de livro 4, a informação é opcional._ 

- Inclusão de Marcador de CPF Ignorado para o CPF do nascido; 

- Inclusão de Marcador de Filiações com Nomes Iguais para todos os tipos de registro; 

- Inclusão de Marcador de Cônjuges com Nomes Iguais para os registros de casamento; 

- Inclusão de Marcador de CPF Ignorado para os documentos de todos os tipos de registro; 

- Inclusão de Marcador de Outros Documentos Ignorados para os documentos de todos os tipos de registro; 

- Inclusão de Justificativa de Não Preenchimento de Campos Obrigatórios (opcional). 

## _**9.2 Versão 5.0**_ 

Alteração do layout de envio de registros civis para a versão 5.0, com as seguintes mudanças: 

- Inclusão de Marcador de Data de Nascimento Ignorado para a Data de Nascimento do nascido; 

- Inclusão de Marcador de Município de Nascimento Ignorado para o Município de Nascimento do nascido; 

- Ajustes nos Tipos de Registros Judiciais para que deixe de ser obrigatório o preenchimento do Campo Justificativa; 

- Alterado o conceito de Termo, podendo existir termos repetidos; 

- Ajustes nas Funcionalidades Cancelamento de Termo e Reverter Cancelamento de Termo. 

## _**9.3 Versão 6.0**_ 

Alteração do layout de envio de registros civis para a versão 6.0, com as seguintes mudanças: 

- Alteração do tamanho dos dados complementares da averbação; 

- Inclusão do tipo de documento ‘Matrícula da Certidão de Casamento’; 

- Inclusão dos códigos de justificativa de não preenchimento de campos obrigatórios (opcional). 

--- end of page.page_number=89 ---

P á g i n a | 90 

SIRC – Sistema Nacional de Informação de Registro Civil 

## _**9.4 Versão 7.0**_ 

- Alteração do XSD de movimento de casamento p/ a versão layout 4.2, onde o “CANCELAMENTO” foi incluído no domínio do motivoAverbacaoCasamento. 

- Formatações diversas para melhor visualização. 

- Pequenas correções de ortografia e gramática. 

## _**9.5 Versão 7.1**_ 

- Alteração do XSD de movimento de nascimento, casamento e óbito p/ a versão layout 4.3. 

- Atualização dos nomes especiais. 

## _**9.6 Versão 7.2**_ 

- Alterado os valores de domínio dos campos de sexo dos registros civis de: nascimento, casamento e óbito. 

- Alterado a tabela de Motivos de Averbações dos registros civis de: nascimento, casamento e óbito. 

## _**9.7 Versão 7.3**_ 

- Alteração do XSD de movimento de nascimento, casamento e óbito p/ a versão layout 4.6. 

- Registro de Nascimento 

   - Incluídos os campos: uf do município de naturalidade, município de naturalidade (IBGE) e município de naturalidade (texto) para o nascido. 

   - Incluídos os campos "sexo ignorado" e "gênero" para o nascido 

   - Incluído o campo gênero para filiação e progenitor 

   - Incluídas as opções para sexo: "NAO_BINARIO", "OUTROS" e "NAO_DECLARADO" 

   - Incluído campo “dados complementares" para averbação, anotação e retificação 

- Registro de Casamento 

   - Incluídos campos "sexo ignorado" e "gênero" para os cônjuges 

   - Incluído campo "gênero" para filiações dos cônjuges 

   - Incluídas as opções para sexo dos cônjuges: "NAO_BINARIO", "OUTROS" e "NAO_DECLARADO" 

   - Incluídas as opções para “regime casamento”: "COMUNHAO_GERAL" e "REGIME_HIBRIDO" 

   - Incluído campo “dados complementares" para averbação, anotação e retificação 

- Registro de Óbito 

   - Incluído campo "gênero" para falecido e filiações 

   - Incluídas as opções para sexo: "NAO_BINARIO", "OUTROS" e "NAO_DECLARADO" 

   - Incluído campo “dados complementares" para averbação, anotação e retificação 

--- end of page.page_number=90 ---

P á g i n a | 91 

SIRC – Sistema Nacional de Informação de Registro Civil 

## _**9.8 Versão 7.4**_ 

## • **Matrícula** 

• Permitida a matrícula repetida, com controle interno sequencial (No WebService, criada tag com valor de identificação de repetição (Ex. Valor “2” para identificar a 2ª repetição de uma matrícula); 

- Mantida a informação do DV para matrícula de registros legados; 

- Aplicadas as regras para matrículas repetidas anteriores a 2016; 

- Permitidos valores zero (0) para ano do registro, livro, folha e termo; 

- Exibida tela de confirmação em casos de matrícula repetida; 

## • **Campos Obrigatórios e Ignorados** 

- Eliminada a exigência de campos obrigatórios tanto em tela quanto em WebService para registros legados; 

- Dispensada a necessidade de ignorar campos não informados; 

- Permitir o envio de registro civil legado somente com a matrícula; 

## • **Competência do Registro** 

   - Definida a competência pelo mês da data de registro, quando informada; 

   - Para registros sem data de registro: 

      - Fixada a competência 01/1976 quando o ano do registro na matrícula for 0; 

      - Fixada a competência 01/ **ANO** quando o **ANO** do registro estiver informado na matrícula; 

- 

## **Campos “Nome”** 

- Mantidas as validações de nomes (nascido, filiação, falecido, cônjuge etc.) conforme o padrão posterior a 2016; 

- Suprimida a exigência de marcador manual de “nome especial” - aplicada marcação automática pelo sistema; 

- Mantido o cálculo do indicador de grafia atípica; 

## • **Campos “Data”** 

      - Restritas as validações aos casos de: 

         - Data inválida (ex.: 99/99/9999); 

         - Data futura; 

- **Sessão “Dados Gerais”** 

      - Em tela, removidos os fieldsets: “Informações Faltantes”, “Justificativa de Ausência” e “Confirmação de Dados”; 

- **Campos “UF/Município”** 

   - Aplicada a regra para todos os registros, independente de data: 

      - Permitido o município em texto livre; 

      - Aceitos somente códigos IBGE válidos, quando informados; 

--- end of page.page_number=91 ---

P á g i n a | 92 

SIRC – Sistema Nacional de Informação de Registro Civil 

- **Campos Enumerados** 

   - Recusados valores fora das opções pré-definidas para campos enumerados (ex.: profissão, 

   - órgão emissor, UF, motivo de averbação etc.); 

## • **Anotações, Averbações e Retificações** 

- Descartadas quando nenhum campo for preenchido; 

## • **Qualidade de Preenchimento** 

- Mantido o cálculo da qualidade de preenchimento dos dados obrigatórios; 

## • **Prazo** 

- Não contabilizados como fora do prazo os registros legados. 

## • **Validações de Documentos** 

- Mantidas todas as validações de documentos já existentes. 

## • **Regras do Webservice** 

- Implementada nova tag de indicação de matrícula repetida: 

   - <xs:element name="indicadorMatriculaRepetida" minOccurs="0"> 

      - <xs:simpleType> 

<xs:restriction base="xs:int"> 

<xs:minInclusive value="1"/> 

<xs:maxInclusive value="999"/> 

</xs:restriction> 

</xs:simpleType> 

</xs:element> 

--- end of page.page_number=92 ---

P á g i n a | 93 

SIRC – Sistema Nacional de Informação de Registro Civil 

## **10 Dúvidas Frequentes** 

## _**10.1 Preenchimento dos campos referentes ao país de nascimento, naturalidade e nacionalidade**_ 

A fim de contemplar todas as situações referentes ao município, estão disponíveis para preenchimento, em alguns casos, dois campos de município – a partir do código do IBGE e em texto livre (para os casos em que os municípios não constem na lista do IBGE). Essas duas informações não podem estar preenchidas simultaneamente. Ademais, quando o município for ignorado, nenhum outro campo referente ao município deve ser preenchido. **Para verificar os municípios onde essa flexibilidade existe, basta consultar os campos previstos para captação – capítulos Registro de Nascimento, Registro de Óbito, Registro de Casamento - ou o XSD específico de cada tipo de registro civil.** 

Quando o país de nascimento do indivíduo for diferente de Brasil, o município e UF de nascimento não devem ser informados nem ignorados. Analogamente, quando o país de nascimento for Brasil o município e UF de nascimento devem ser informados. 

O preenchimento do campo de nacionalidade é obrigatório, podendo ser ignorado, em ambos os casos. 

## _**10.2 XSD**_ 

XML Schema é uma linguagem baseada no formato XML para definição de regras de validação ("esquemas") em documentos no formato XML. Foi a primeira linguagem de esquema para XML a obter o status de recomendação por parte do W3C. Um arquivo contendo as definições na linguagem XML Schema é chamado de XSD (XML Schema Definition), este descreve a estrutura de um documento XML. **Ou seja, não deve ser colocada nenhuma tag no XML que não esteja no XSD.** 

## **10.2.1 Atributo Minoccurs** 

O atributo “minoccurs” tem por padrão o valor 1 (um), ou seja, a ausência do atributo indica que o elemento é obrigatório. 

--- end of page.page_number=93 ---

P á g i n a | 94 

SIRC – Sistema Nacional de Informação de Registro Civil 

## **10.2.2 Atributos Boolean** 

Os atributos boolean do XML devem ser escritos em letra minúscula, ou seja, true e 

false. 

## _**10.3 Geração do XML**_ 

Nem todas as TAGS descritas no XSD existirão sempre. A geração do XML depende das **regras de negócio** descritas no MANUAL. 

## _**10.4 Preenchimento de campos ignorados**_ 

Alguns campos dos registros civis são de preenchimento obrigatório conforme as regras apresentadas em capítulos anteriores. Esses campos, quando não preenchidos, devem ter o seu marcador de ignorado indicado como "true", uma confirmação de que os dados não foram informados e serão ignorados. Segue abaixo um exemplo: 

```
Exemplo 01: O nome do falecido é obrigatório.
```

Quando não existir essa informação, o marcador de ignorado deve ser indicado como "true". O layout XML deve ser preenchido da seguinte forma: 

```
<nome></nome>
<nomeIgnorado>true</nomeIgnorado> ou
<nomeIgnorado>true</nomeIgnorado>
```

Obs.: As duas maneiras são equivalentes. 

Os campos obrigatórios e seus respectivos marcadores de campo ignorado podem ser consultados nas regras e XSD apresentados no manual. 

Essa regra de preenchimento não se aplica aos registros judiciais e registros civis efetuados no exterior e posteriormente transcritos no Brasil. Os marcadores de campos ignorados devem ser desconsiderados em ambos os casos. 

--- end of page.page_number=94 ---

P á g i n a | 95 

SIRC – Sistema Nacional de Informação de Registro Civil 

## _**10.5 Onde Encontrar Ajuda**_ 

**Dataprev, suporte ao SIRC, através do telefone 0800 081 5899** . Tem por objetivo esclarecer sobre acesso à aplicação, senha ou certificado digital e utilização da aplicação. 

**INSS prestará suporte ao Sirc** sobre questões de operacionalização e acesso, **por meio dos contatos nas Gerências Executivas.** 

--- end of page.page_number=95 ---

P á g i n a | 96 

SIRC – Sistema Nacional de Informação de Registro Civil 

## **11 Anexos** 

## _**11.1 Anexo I - Tabelas de UF, Município e País**_ 

## **11.1.1 UF** 

A Tabela de Códigos de UF, elaborada pelo IBGE, apresenta a lista de UF brasileiras associados a um código composto de 2 dígitos. A tabela está disponível em: 

## **http://servicodados.ibge.gov.br/Download/Download.ashx?u=geoftp.ibge.gov.br/organiza cao_territorial/divisao_territorial/2014/dtb_2014.zip** 

## **11.1.2 Município** 

A Tabela de Códigos de Municípios, elaborada pelo IBGE, apresenta a lista dos municípios brasileiros associados a um **código composto de 7 dígitos** , sendo os **dois primeiros referentes ao código do estado** . Esta tabela, que reflete a organização do território, é utilizada não apenas pelo IBGE para o processamento das informações de suas pesquisas e cadastros, como também por outras instituições. É atualizada sistematicamente de forma a incluir as alterações decorrentes do desdobramento de municípios e, conseqüentemente, da criação de novos municípios, mudanças de nome dos municípios, como também de processos de fusão que resultam na extinção ou modificação de nome de algum município. A tabela está disponível em: 

## **http://servicodados.ibge.gov.br/Download/Download.ashx?u=geoftp.ibge.gov.br/organiza cao_territorial/divisao_territorial/2014/dtb_2014.zip** 

Devido ao último dígito do código do município ser somente para fins de verificação, **devem ser enviados ao SIRC somente os seis primeiros dígitos do código.** 

## **11.1.3 País** 

A Tabela de Códigos de Países, elaborada pela Divisão de Estatísticas das Nações Unidas, Standard Country or Areas Codes for Statistical Use, apresenta uma lista com os nomes dos países ou áreas, em ordem alfabética, relacionados com códigos numéricos de três dígitos. A tabela está disponível em: 

http://unstats.un.org/unsd/methods/m49/m49.htm 

--- end of page.page_number=96 ---

P á g i n a | 97 

SIRC – Sistema Nacional de Informação de Registro Civil 

## _**11.2 Anexo II – Tabela de Profissões**_ 

Os códigos utilizados para os campos de profissão são os da tabela CBO-CNIS, uma versão ampliada da tabela CBO-Classificação Brasileira De Ocupação. 

A Classificação Brasileira de Ocupações - CBO, instituída por portaria ministerial nº. 397, de 9 de outubro de 2002, tem por finalidade a identificação das ocupações no mercado de trabalho, para fins classificatórios junto aos registros administrativos e domiciliares. Os efeitos de uniformização pretendida pela Classificação Brasileira de Ocupações são de ordem administrativa e não se estendem as relações de trabalho. Já a regulamentação da profissão, diferentemente da CBO é realizada por meio de lei, cuja apreciação é feita pelo Congresso Nacional, por meio de seus Deputados e Senadores, e levada à sanção do Presidente da República. 

Os códigos presentes na CBO e suas respectivas descrições podem ser acessados em: http://www.mtecbo.gov.br/cbosite/pages/home.jsf 

Os códigos adicionais, acrescentados nesta versão da tabela, que é usada pelo CNIS - Cadastro Nacional de Informações Sociais, descrevem algumas situações específicas, como "Dona de casa", "Estudante", etc,. 

## **Para o envio da opção “Sem profissão remunerada”, deve ser utilizado o código “-1”.** 

**Para o envio da opção “Outras”, deve ser utilizado o código “-2”.** 

--- end of page.page_number=97 ---

P á g i n a | 98 

## SIRC – Sistema Nacional de Informação de Registro Civil 

## **11.2.1 Tabela CBO-CNIS** 

**==> picture [418 x 589] intentionally omitted <==**

--- end of page.page_number=98 ---

P á g i n a | 99 

SIRC – Sistema Nacional de Informação de Registro Civil 

## _**11.3 Anexo III – Comprovante de Envio de Arquivo (Registro de**_ 

## _**Nascimento)**_ 

**==> picture [439 x 600] intentionally omitted <==**

--- end of page.page_number=99 ---

P á g i n a | 100 

SIRC – Sistema Nacional de Informação de Registro Civil 

## _**11.4 Anexo IV – Relatório de Processamento de Registros (Registro de Nascimento)**_ 

**==> picture [442 x 584] intentionally omitted <==**

--- end of page.page_number=100 ---

P á g i n a | 101 

SIRC – Sistema Nacional de Informação de Registro Civil 

## _**11.5 Anexo V - JAXB (Java Architecture for XML Binding)**_ 

O _JavaArchitectureforXMLBinding_ (JAXB) permite aos desenvolvedores mapear classes Java para representações XML. O JAXB fornece duas características principais: a capacidade de empacotar objetos Java em XML e o inverso, ou seja, transformar elementos XML em objetos Java. Em outras palavras, o JAXB permite armazenar e recuperar dados na memória em qualquer formato XML, sem a necessidade de implementar um conjunto específico de rotinas de carga e gravação para este fim. É semelhante ao XSD.exe e ao xmlserializers do _framework_ .Net. 

O JAXB é um dos APIs da plataforma Java EE, e faz parte do _Java Web Services Development Pack_ (JWSDP). É parte da versão 1.6 SE. 

--- end of page.page_number=101 ---

P á g i n a | 102 

## SIRC – Sistema Nacional de Informação de Registro Civil 

## _**11.6 Anexo VI – TB0400 – Pequenas Tabelas / 02 –Órgão Emissor**_ 

|**Código**|**Abreviatura**|**Descrição**|
|---|---|---|
|1|SSP|SECRETARIA DE SEGURANCA PUBLICA|
||||
|2|MIN.AERONAUT|MINISTERIO DA AERONAUTICA|
|3|MIN.EXERCITO|MINISTERIO DO EXERCITO|
||||
|4|MIN.MARINHA|MINISTERIO DA MARINHA|
|5|SE/DPMAF|POLICIA FEDERAL (DPMAF - DELEGACIA DE POLICIA|
|||MARITIMA, AEREA E DE FRONTEIRA)|
||||
|6|CRA|CONSELHO REGIONAL DE ADMINISTRACAO|
|7|CRAS|CONSELHO REGIONAL DE ASSISTENCIA SOCIAL|
||||
|8|CRB|CONSELHO REGIONAL DE BIBLIOTECONOMIA|
|9|CRC|CONSELHO REGIONAL DE CONTABILIDADE|
||||
|10|CRECI|CONSELHO REGIONAL DE CORRETORES DE IMOVEIS|
|11|CORECON|CONSELHO REGIONAL DE ECONOMIA|
||||
|12|COREN|CONSELHO REGIONAL DE ENFERMAGEM|
|13|CREA|CONSELHO REGIONAL DE ENGENHARIA, ARQUITETURA E|
|||AGRONOMIA|
||||
|14|CONRE|CONSELHO REGIONAL DE ESTATISTICA|
|15|CRF|CONSELHO REGIONAL DE FARMACIA|
||||
|16|CREFITO|CONSELHO REGIONAL DE FISIOTERAPIA E TERAPIA<br>OCUPACIONAL|
|17|CRM|CONSELHO REGIONAL DE MEDICINA|
||||
|18|CRMV|CONSELHO REGIONAL DE MEDICINA VETERINARIA|
|19|OMBCRE|ORDEM DOS MUSICOS DO BRASIL|
||||
|20|CRN|CONSELHO REGIONAL DE NUTRICAO|
|21|CRO|CONSELHO REGIONAL DE ODONTOLOGIA|
||||



--- end of page.page_number=102 ---

**P á g i n a | 103** 

SIRC – Sistema Nacional de Informação de Registro Civil 

|22|CONRERP|CONSELHO REGIONAL DE PROFISSIONAIS DE RELACOES<br>PUBLICAS|
|---|---|---|
|23|CRP|CONSELHO REGIONAL DE PSICOLOGIA|
||||
|24|CRQ|CONSELHO REGIONAL DE QUIMICA|
|25|CORE|CONSELHO REGIONAL DE REPRESENTANTES COMERCIAIS|
||||
|26|OAB|ORDEM DOS ADVOGADOS DO BRASIL|
|27|CRBIO|CONSELHO REGIONAL DE BIOLOGIA|
||||
|28|CRFA|CONSELHO REGIONAL DE FONOAUDIOLOGIA|
|29|CRESS|CONSELHO REGIONAL DE SERVICO SOCIAL|
||||
|30|CRTR|CONSELHO REGIONAL DE TECNICOS EM RADIOLOGIA|
|31|DETRAN|DEPARTAMENTO DE TRANSITO|
||||
|32|PM|POLICIA MILITAR|
|33|CBM|CORPO DE BOMBEIROS|
||||
|34|IBA|INSTITUTO BRASILEIRO DE ATUARIOS|
|35|SEDS|SECRETARIA OU COORDENAÇÃO ESTADUAL DA JUSTIÇA E|
|||DEFESA SOCIAL|
||||
|36|SMDS|SECRETARIA OU COORDENAÇÃO MUNICIPAL DA DEFESA<br>SOCIAL|
|90|DOCUMENT. EXPED.|DOCUMENTO EXPEDIDO NO EXTERIOR|
||EXT||
||||
|99|OUTROS|OUTROS|



--- end of page.page_number=103 ---

**P á g i n a | 104** 

## SIRC – Sistema Nacional de Informação de Registro Civil 

## _**11.7 Anexo VII - TB0400 – Pequenas Tabelas / 35 – Tipo de Documento Civil**_ 

```
<xs:simpleType name="tipoDocumento">
<xs:restriction base="xs:string">
<xs:enumeration value="CPF"/>
<xs:enumeration value="RG"/>
<xs:enumeration value="NIT"/>
<xs:enumeration value="RIC"/>
<xs:enumeration value="RNE"/>
<xs:enumeration value="TITULO_DE_ELEITOR"/>
<xs:enumeration value="PASSAPORTE"/>
<xs:enumeration value="CNH"/>
<xs:enumeration value="CTPS"/>
<xs:enumeration value="CARTEIRA_DE_MARITIMO"/>
<xs:enumeration value="DOC_ESTRANGEIRO"/>
<xs:enumeration value="CERT_DE_NASCIMENTO"/>
<xs:enumeration value="CERT_DE_CASAMENTO"/>
<xs:enumeration value="CERT_DE_RESERVISTA"/>
<xs:enumeration value="NAO_IDENTIFICADO"/>
</xs:restriction>
```

```
</xs:simpleType>
```

## _**11.8 Anexo VIII - Outras Tabelas Relevantes / Sexo / Regime de Casamento**_ 

## **`Sexo`** 

```
<xs:simpleType name="sexo">
      <xs:restriction base="xs:string">
        <xs:enumeration value="MASCULINO"/>
        <xs:enumeration value="FEMININO"/>
        <xs:enumeration value="NAO_BINARIO"/>
        <xs:enumeration value="OUTROS"/>
        <xs:enumeration value="NAO_DECLARADO"/>
        <xs:enumeration value="IGNORADO"/>
      </xs:restriction>
</xs:simpleType>
```

## **`Regime de Casamento`** 

```
<xs:simpleType name="regimeCasamento">
      <xs:restriction base="xs:string">
        <xs:enumeration value="COMUNHAO_PARCIAL"/>
        <xs:enumeration value="COMUNHAO_UNIVERSAL"/>
        <xs:enumeration value="PARTICIPACAO_FINAL_AQUESTOS"/>
        <xs:enumeration value="SEPARACAO_BENS"/>
        <xs:enumeration value="OUTROS"/>
        <xs:enumeration value="COMUNHAO_GERAL"/>
        <xs:enumeration value="REGIME_HIBRIDO"/>
        <xs:enumeration value="PARTICIPACAO_FINAL_AQUESTROS"/>
      </xs:restriction>
</xs:simpleType>
```

--- end of page.page_number=104 ---

**P á g i n a | 105** 

SIRC – Sistema Nacional de Informação de Registro Civil 

## _**11.9 Anexo VIII – WSDL (Web Service Definition Language) - Descritor Web Service**_ 

## **11.9.1 Autenticação via senha do usuário - https://sirc.dataprev.gov.br/SircWs/Movimento** 

São disponibilizadas no Web Service do Sirc nove funções: 

- enviarMovimentoNascimento 

**==> picture [130 x 122] intentionally omitted <==**

**----- Start of picture text -----**<br>
Produção<br>Testes<br>**----- End of picture text -----**<br>


- enviarMovimentoObito 

- enviarMovimentoCasamento 

- enviarMovimentoCancelamento 

- declararInexistenciaMovimento 

- validarMovimentoNascimento 

- validarMovimentoObito 

- validarMovimentoCasamento 

- validarMovimentoCancelamento 

## **As funções de validação estão disponíveis para testes, os dados enviados por meio dessas não serão inseridos na base de dados do SIRC.** Para a utilização das funções de teste os dados de autenticação devem ser os seguintes: 

**==> picture [428 x 63] intentionally omitted <==**

**----- Start of picture text -----**<br>
Serventia de teste  Código CNS<br>Usuário de teste 123456<br>Senha para usuário de teste 1234<br>**----- End of picture text -----**<br>


Para acessar o Web service disponibilizado pelo SIRC podem ser utilizados softwares - que realizam tal função (Ex: SoapUI http://www.soapui.org/). 

## **11.9.2 Autenticação via certificado digital – https://sirc.dataprev.gov.br/SircWs/ MovimentoCertificadoDigital (Versão 1.1)** 

Para essa modalidade de envio são disponibilizadas as mesmas funções descritas na autenticação via senha do usuário. No entanto, não é necessário informar nenhum usuário e senha para acessar as funções de validação, basta que o certificado utilizado seja válido. 

--- end of page.page_number=105 ---

**P á g i n a | 106** 

SIRC – Sistema Nacional de Informação de Registro Civil 

## _**11.10 Anexo IX – Validação de DNV**_ 

Cada formulário da DNV é pré-numerado com 11 (onze) algarismos. 

O 11º dígito é um dígito verificador. O número tem o seguinte formato XXXXXXXXXX-D, em que XXXXXXXXXX é uma série numérica sequencial. 

Existem 3 gerações de formulários de DNV, identificáveis com base nas datas de sua impressão e distribuição pelo Ministério da Saúde, e consequentemente nas sequências numéricas definidas. 

O armazenamento no banco de dados é feito em 3 campos NU_PREFIXO_DN, com 2 caracteres, NU_DN com 8 caracteres, e NU_DV, com 1 caracter. 

**1ª geração** – Números com 8 dígitos, sem DV - DN – numeração até 43700000 –impressos antes de 2006 e distribuídos até 1º semestre de 2006 

**2ª geração** – Números com 10 dígitos + 1 DV calculado método Divisão por 11 - DN numeração entre 00-43700001-X e 00-48101000- X, impressos no 2º semestre de 2006 e distribuídos até 1º semestre de 2008. 

Neste período, embora o número tenha 11 dígitos no papel (10 dígitos + 1 DV), os dois primeiros números são sempre 00. 

O 11º dígito é um dígito verificador calculado à partir da sequência formada do 

1º ao 10º caractere. 

Regra para Validação do Dígito Verificador – Módulo 11 

Exemplo: Validar o dígito verificador **X** do número 0045695844 **X** 

**Passo 1:** Obter o número 

Nº fornecido 0 0 4 5 6 9 5 8 4 4 X 

**Passo 2:** Dividir o número formado pelos dígitos do 1º ao 10º caractere por 11 0045695844 dividido por 11 = 4154167 

Resto = 7 (= Módulo 11 de 0045695844) 

## **Passo 3:** 

Se o resto da divisão é 0 ou 10, o dígito é 0. 

Caso contrário, o dígito é o resto da divisão. 

Dígito Verificador = Resto = **7** 

Novo Número com dígito verificador: 00456958447 **(o sistema deverá validar se este** 

## **realmente foi o número digitado)** 

--- end of page.page_number=106 ---

**P á g i n a | 107** 

SIRC – Sistema Nacional de Informação de Registro Civil 

**3ª geração** – Números com 10 dígitos + 1 DV calculado pelo método Módulo 11 DSR 

– novo método - DN numeração acima de 30-48101000-X, impressos no 2º semestre de 2008 e distribuídos a partir do 1º semestre de 2009. 

Nos documentos desta geração os dois primeiros dígitos do número da DNV são sempre 30. 

a) Multiplicar os 10 primeiros algarismos (X) pelos pesos conforme ilustração abaixo: pesos 3 2 9 8 7 6 5 4 3 2 dígito verificador 

X X X X X X X X X X D 

b) Somar todos os produtos obtidos no item "a" (X pelo peso, D não entra no cálculo). 

c) Dividir o somatório do item "b" por 11. 

d) Subtrair de 11 o resto da divisão do item "c". 

O resultado da operação do item “d” será o dígito verificador (D). Caso o resultado da subtração seja 10 

ou 11, o dígito será 0. 

Exemplo: Validar o dígito verificador **X** do número 3052350015 **X** 

**Passo 1:** Multiplica um peso, já definido abaixo, pelo dígito equivalente do número de inscrição: 

Nº fornecido 3 0 5 2 3 5 0 0 1 5 X 

Peso p/Multiplicar 3 2 9 8 7 6 5 4 3 2 DV 

**Passo 2:** Soma-se o resultado das multiplicações acima e divide-se por 11. 

Soma = (3x3) + (2x0) + (9x1) + (8x 2) + (7x 0) + (6x 0) + (5x 0) + (4x 0) + (3x 3) + (2x 8) = 

134 

**Passo 3:** Dividir 134 por 11 e obter o resultado. 

134 dividido por 11 = 12 

Resto = 2 ( = Módulo 11 de 134) 

Dígito Verificador = 11 – 2 = **9** 

Se o resto da divisão é 0 ou 1, o dígito é 0. Caso contrário, o dígito é o resultado da operação formada de 11 menos o resto da divisão do passo 3. 

Novo Número com dígito verificador: 3052350015 **9 (o sistema deverá validar se este** 

## **realmente foi o número digitado)** 

--- end of page.page_number=107 ---

**P á g i n a | 108** 

SIRC – Sistema Nacional de Informação de Registro Civil 

## _**11.11 Anexo X – Validação de DO**_ 

Atualmente cada formulário da DO é pré-numerado com 9 (nove) algarismos. 

O 9º dígito é um dígito verificador. O número tem o seguinte formato XXXXXXXX-D, em que XXXXXXXX é uma série numérica sequencial. 

Existem 3 gerações de formulários de DO, identificáveis com base nas datas de sua impressão e distribuição pelo Ministério da Saúde, e consequentemente nas sequências numéricas definidas. 

O armazenamento no banco de dados é feito em 2 campos NU_DO com 8 caracteres, e NU_DO, com 1 caractere. 

**1ª geração** – Números com 8 dígitos, sem DV - DO – numeração até 12075500 – impressos antes de 2006 e distribuídos até 1º semestre de 2006 

**2ª geração** – Números com 8 dígitos + 1 DV calculado método Divisão por 11 - DO numeração entre 12075501-X a 13599999-X, impressos no 2º semestre de 2006 e distribuídos até 1º semestre de 2008. 

O 9º dígito é um dígito verificador calculado à partir da sequência formada do 1º ao 8º caractere. 

Regra para Validação do Dígito Verificador – Módulo 11 

Exemplo: Validar o dígito verificador **X** do número 12075501- **X** 

**Passo 1:** Obter o número 

Nº fornecido 1 2 0 7 5 5 0 1 X 

**Passo 2:** Divide-se por 11 

12075501 dividido por 11 = 1097773 

Resto = 9 

## **Passo 3:** 

Se o resto da divisão é 0 ou 10, o dígito é 0. 

Caso contrário, o dígito é o resto da divisão. 

Dígito Verificador = Resto = **9** 

Novo Número com dígito verificador: 120755019 **(o sistema deverá validar se este realmente foi o número digitado)** 

--- end of page.page_number=108 ---

**P á g i n a | 109** 

SIRC – Sistema Nacional de Informação de Registro Civil 

**3ª geração** – Números com 8 dígitos + 1 DV calculado pelo método Módulo 11 DSR – novo método - DN numeração acima de 13600002-X, impressos no 2º semestre de 2008 e distribuídos a partir do 1º semestre de 2009. 

a) Multiplicar os 8 primeiros algarismos (X) pelos pesos conforme ilustração abaixo: 

pesos 9  8  7 6  5  4  3  2  dígito verificador X X X X X X X X D 

b) Somar todos os produtos obtidos no item "a" (X pelo peso, D não entra no cálculo). c) Dividir o somatório do item "b" por 11. 

d) Subtrair de 11 o resto da divisão do item "c". 

O resultado da operação do item “d” será o dígito verificador (D). Caso o resultado da subtração seja 10 ou 11, o dígito será 0. 

Exemplo: Validar o dígito verificador **X** do número 13600503 **X** 

**Passo 1:** Multiplicar um peso, já definido abaixo, pelo dígito equivalente do número de inscrição: 

|Nº fornecido|1|3|6|0|0|5|0|3|X|
|---|---|---|---|---|---|---|---|---|---|
|Peso p/Multiplicar|9|8|7|6|5|4|3|2|DV|



**Passo 2:** Soma-se o resultado das multiplicações acima e divide-se por 11. 

Soma = (9x1) + (8x3) + (7x 6) + (6x 0) + (5x 0) + (4x 5) + (3x 0) + (2x 3) = 101 

**Passo 3:** Dividir 101 por 11 e obter o resultado. 

101 dividido por 11 = 9 

Resto = 2 

Dígito Verificador = 11 – 2 = **9** 

Se o resto da divisão é 0 ou 1, o dígito é 0. Caso contrário, o dígito é 11 – resto da divisão. 

Novo Número com dígito verificador: 13600503 **9(o sistema deverá validar se este realmente foi o número digitado)** 

--- end of page.page_number=109 ---

**P á g i n a | 110** 

## SIRC – Sistema Nacional de Informação de Registro Civil 

## _**11.12Anexo XI – Comprovante de Envio de Arquivo (Registro de Óbito)**_ 

**==> picture [439 x 600] intentionally omitted <==**

--- end of page.page_number=110 ---

**P á g i n a | 111** 

SIRC – Sistema Nacional de Informação de Registro Civil 

## _**11.13Anexo XII – Relatório de Processamento de Registros (Registro de Óbito)**_ 

**==> picture [442 x 584] intentionally omitted <==**

--- end of page.page_number=111 ---

**P á g i n a | 112** 

## SIRC – Sistema Nacional de Informação de Registro Civil 

## _**11.14Anexo XIII – Comprovante de Envio de Arquivo (Registro de**_ 

## _**Casamento)**_ 

**==> picture [439 x 600] intentionally omitted <==**

--- end of page.page_number=112 ---

**P á g i n a | 113** 

SIRC – Sistema Nacional de Informação de Registro Civil 

## _**11.15Anexo XIV – Relatório de Processamento de Registros**_ 

## _**(Registro de Casamento)**_ 

**==> picture [442 x 584] intentionally omitted <==**

--- end of page.page_number=113 ---

**P á g i n a | 114** 

## SIRC – Sistema Nacional de Informação de Registro Civil 

## _**11.16Anexo XV – Recibo de Declaração de Inexistência de**_ 

## _**Movimento**_ 

**==> picture [422 x 332] intentionally omitted <==**

--- end of page.page_number=114 ---

**P á g i n a | 115** 

SIRC – Sistema Nacional de Informação de Registro Civil 

## _**11.17Anexo XVI – Integração Sirc / CER (Centralizadora de Envio de Registros)**_ 

Para a utilização da funcionalidade de envio de arquivos contendo o movimento das serventias pelas CER - Centralizadora de Envio de Registros, o SIRC disponibilizará um Web Service[16] - autenticado via certificação digital - nos mesmos moldes já disponibilizados anteriormente para integração direta com as serventias. 

- CER - Centralizadora de Envio de Registros •Envia para o Sirc os registros civis recebidos através dela 

**==> picture [187 x 137] intentionally omitted <==**

**----- Start of picture text -----**<br>
SIRC<br>**----- End of picture text -----**<br>


A informação do movimento deverá ser transmitida da seguinte forma: 

- CER gera uma sequência de texto XML conforme layout especificado[17] ; 

- Localização e chamada remota (via Internet) ao _Web Service_ do SIRC passando os parâmetros necessários. 

O certificado digital utilizado para transmissão deve ser do tipo A1, e deverá ter sido emitido por uma Autoridade Certificadora credenciada pela Infraestrutura de Chaves Públicas Brasileira - ICP-Brasil. 

O serviço de autenticação via certificado digital utiliza a especificação _WS-Security_ , que, por sua vez, possui as seguintes características: 

- O certificado do usuário é enviado no cabeçalho do pacote _SOAP_ . Esse certificado contém informações que permitem identificar o usuário e verificar se possui permissão para o envio do movimento. 

- No cabeçalho do pacote _SOAP_ também deve constar a assinatura do próprio pacote, que deve ser feita utilizando a especificação _XML Signature_ . O _timestamp_ de segurança também deve estar contido no mesmo local. 

> 16 **http://sirc.dataprev.gov.br/MovimentoCER** 

> 17 O layout contendo os dados dos registros civis será o mesmo para toda e qualquer modalidade de envio, seja ela via central ou pela própria serventia. Além disso, os envios efetuados pela CER devem ser agrupados por serventia e conter no máximo 250 registros (conforme manual de recomendações técnicas). 

--- end of page.page_number=115 ---

**P á g i n a | 116** 

## SIRC – Sistema Nacional de Informação de Registro Civil 

O _Web Service_ será disponibilizado conforme a figura a seguir: 

- **Esse serviço irá receber como parâmetros os seguintes itens:** 

Serviço •certificação digital Método de autorização e autenticação - • Layout contendo os dados dos registros civis disponibilizado (disponibilizado atráves do manual de recomendações técnicas do Sirc) **Obs: Conterá o CPF do usuário que efetuou a gravação dos** pelo Sirc **registros na central e a Data e hora da gravação dos registros na central** 

--- end of page.page_number=116 ---

**P á g i n a | 117** 

SIRC – Sistema Nacional de Informação de Registro Civil 

## **11.17.1 XSD - Integração Sirc / CER** 

O XML Schema é uma linguagem baseada no formato XML para definição de regras de validação (esquemas) em documentos nesse mesmo formato. Um arquivo contendo as definições na linguagem XML Schema é chamado de XSD (XML Schema Definition), este descreve a estrutura de um documento XML. 

Algumas observações são importantes para utilização do XSD: 

- O atributo “minoccurs” tem por padrão o valor 1 (um), ou seja, a ausência do atributo indica que o elemento é obrigatório. 

- A ordem dos elementos deve ser seguida para a criação do arquivo XML. Os elementos estão ordenados alfabeticamente. 

## **Cada tipo de registro civil (Nascimento; Óbito e Casamento) possui um XSD diferente, ou seja, deverão ser preparados e enviados separadamente.** 

## **11.17.2 WSDL - Integração Sirc / CER** 

A descrição do serviço está disponibilizada em **http://sirc.dataprev.gov.br/MovimentoCER?wsdl** . 

Existem também funções de validação disponíveis para testes. Dados enviados por meio dessas não serão inseridos na base de dados do SIRC. Para o acesso aos serviços de validação, basta que se utilize um certificado digital válido. 

--- end of page.page_number=117 ---

**P á g i n a | 118** 

SIRC – Sistema Nacional de Informação de Registro Civil 

## _**11.18 Anexo XVII – Motivos de Anotações e Averbações**_ 

## **11.18.1 Registro de Nascimento** 

## _11.18.1.1 Motivos de Anotações_ 

- _CASAMENTO("Casamento"),_ 

- _OBITO("Óbito"),_ 

- _OUTROS("Outros"),_ 

- _REESTABELECIMENTO("Nulidade, anulação, separação, restabelecimento da sociedade conjugal e divórcio"),_ 

- _EMANCIPACAO("Emancipação"),_ 

- _INTERDICAO("Interdição"),_ 

- _AUSENCIA("Ausência"),_ 

- _MORTE_PRESUMIDA("Morte presumida")._ 

## _11.18.1.2 Motivos de Averbações_ 

- _RECONHECIMENTO_FILIACAO("Reconhecimento de filiação"),_ 

- _ALTERACAO_NOME("Alteração de prenome e/ou sobrenome do registrado"),_ 

- _ALTERACAO_SOBRENOME("Alteração de nome e/ou sobrenome paterno ou materno"),_ 

- _ALTERACAO_NOME_SEXO("Alteração de nome e sexo"),_ 

- _CANCELAMENTO("Cancelamento"),_ 

- _MUDANCA_PRENOME("Mudança de prenome ou qualquer alteração de nome"),_ 

- _DESTITUICAO("Destituição e suspensão de pátrio poder familiar"),_ 

- _CONCESSAO("Concessão de guarda e tutela"),_ 

- _EXCLUSAO("Exclusão de paternidade ou maternidade"),_ 

- _RECONHECIMENTO("Reconhecimento de paternidade ou maternidade em ação de investigação"),_ 

- _PERDA_NACIONALIDADE("Perda ou reaquisição de nacionalidade brasileira"),_ 

- _ANOTACAO_CPF("Anotação de CPF"),_ 

- _FILIACAO("Filiação socioafetiva"),_ 

- _OUTROS("Outros"),_ 

- _NOME_ABREVIADO("Nome abreviado usado como firma comercial registrada ou atividade profissional"),_ 

- _ACRESCIMO_SOBRENOME("Acréscimo do sobrenome de companheiro, com quem se viva em união estável com impedimento para o casamento"),_ 

- _ALTERACAO_NOME_ACRESCIMO("Alteração de nome por acréscimo de sobrenome do padrasto ou da madrasta")._ 

## **11.18.2 Registro de Casamento** 

## _11.18.2.1 Motivos de Anotações_ 

- _NASCIMENTO("Nascimento"),_ 

- _OBITO("Óbito"),_ 

- _OUTROS("Outros"),_ 

- _INTERDICAO("Interdição"),_ 

- _AUSENCIA("Ausência"),_ 

- _MORTE_PRESUMIDA("Morte presumida")._ 

## _11.18.2.2 Motivos de Averbações_ 

- _SEPARACAO ("Separação"),_ 

- _DIVORCIO ("Divórcio"),_ 

- _ANULACAO ("Anulação"),_ 

- _NULIDADE ("Nulidade"),_ 

- _ANOTACAO_CPF ("Anotação CPF"),_ 

- _CONVERSAO_SEPARACAO_DIVORCIO ("Conversão da separação em divórcio"),_ 

- _ALTERACAO_REGIME_BENS ("Alteração do regime de bens"),_ 

- _RESTABELECIMENTO_SOCIEDADE_CONJUGAL ("Restabelecimento da sociedade conjugal"),_ 

- _OUTROS ("Outros"),_ 

- _CANCELAMENTO("Cancelamento")._ 

--- end of page.page_number=118 ---

**P á g i n a | 119** 

## SIRC – Sistema Nacional de Informação de Registro Civil 

## **11.18.3 Registro de Óbito** 

## _11.18.3.1 Motivos de Anotações_ 

- NASCIMENTO ("Nascimento"), 

- CASAMENTO ("Casamento"), 

- OUTROS ("Outros"). 

## _11.18.3.2 Motivos de Averbações_ 

- _CANCELAMENTO("Cancelamento"),_ 

- _ALTERACAO_LOCAL_SEPULTAMENTO("Alteração de local de sepultamento"),_ 

- _CREMACAO("Cremação"),_ 

- _DOACAO_CADAVER("Doação de cadáver"),_ 

- _OUTROS("Outros"),_ 

- _ANOTACAO_CPF("Anotação de CPF")._ 

--- end of page.page_number=119 ---

**P á g i n a | 120** 

SIRC – Sistema Nacional de Informação de Registro Civil 

## _**11.19 Anexo XVIII – Listas de Códigos de Justificativas de Ausência de Campos Obrigatórios por Lei**_ 

## **11.19.1 Registro de Nascimento** 

Códigos de Justificativas de Ausência de Campos Obrigatórios por Lei para os registros de nascimento: 

- RFB_INDISPONIVEL (Sistema da Receita Federal indisponível (ausente CPF do registrado e/ou filiação)); 

- CPF_REGISTRADO_NAO_APRESENTADO (CPF do registrado não apresentado no momento do registro); 

- CPF_REGISTRADO_INEXISTENTE (Registrado não possui CPF); 

- SEXO_REGISTRADO_INDEFINIDO (Registrado não possui sexo definido); 

- DATA_NASCIMENTO_REGISTRADO_INCOMPLETA (Data de nascimento incompleta (conhecido apenas mês e/ou ano de nascimento)); 

- DATA_NASCIMENTO_REGISTRADO_DESCONHECIDA (Data de nascimento do registrado desconhecida); 

- MUNICIPIO_REGISTRADO_DESCONHECIDO (Município de nascimento ou naturalidade do registrado desconhecido); 

- CPF_FILIACAO_NAO_APRESENTADO (Filiação do natimorto/nascido não apresentou CPF no momento do registro); 

- CPF_FILIACAO_INEXISTENTE (Filiação do natimorto/nascido não possui número de CPF); 

- FILIACAO_DESCONHECIDA (Nenhuma filiação do registrado conhecida (ausente: nome e sexo das duas filiações)); 

- UMA_FILIACAO_NAO_INFORMADA (Uma das filiações não informada - Opcional); 

- DATA_NASCIMENTO_FILIACAO_DESCONHECIDA (Data de nascimento da filiação desconhecida); 

- MUNICIPIO_FILIACAO_DESCONHECIDO (Município de nascimento ou naturalidade da filiação desconhecida); 

- OUTROS (Outros). 

## **11.19.2 Registro de Casamento** 

Códigos de Justificativas de Ausência de Campos Obrigatórios por Lei para os registros de casamento: 

- RFB_INDISPONIVEL (Sistema da Receita Federal indisponível (ausente CPF do registrado e/ou filiação)); 

- CPF_REGISTRADO_NAO_APRESENTADO (CPF do registrado não apresentado no momento do registro); 

- CPF_REGISTRADO_INEXISTENTE (Registrado não possui CPF); 

- DATA_NASCIMENTO_REGISTRADO_INCOMPLETA (Data de nascimento incompleta (conhecido apenas mês e/ou ano de nascimento)); 

- DATA_NASCIMENTO_REGISTRADO_DESCONHECIDA (Data de nascimento do registrado desconhecida); 

- MUNICIPIO_REGISTRADO_DESCONHECIDO (Município de nascimento ou naturalidade do registrado desconhecido); 

- OUTROS (Outros). 

--- end of page.page_number=120 ---

**P á g i n a | 121** 

## SIRC – Sistema Nacional de Informação de Registro Civil 

## **11.19.3 Registro de Óbito** 

Códigos de Justificativas de Ausência de Campos Obrigatórios por Lei para os registros 

de óbito: 

- RFB_INDISPONIVEL (Sistema da Receita Federal indisponível (ausente CPF do registrado e/ou filiação)); 

- CPF_REGISTRADO_NAO_APRESENTADO (CPF do registrado não apresentado no momento do registro); 

- CPF_REGISTRADO_INEXISTENTE (Registrado não possui CPF); 

- REGISTRADO_NAO_IDENTIFICADO (Registrado não identificado (ausente: nome, data de nascimento, naturalidade e CPF)); 

- SEXO_REGISTRADO_INDEFINIDO (Registrado não possui sexo definido); 

- DATA_NASCIMENTO_REGISTRADO_INCOMPLETA (Data de nascimento incompleta (conhecido apenas mês e/ou ano de nascimento)); 

- DATA_NASCIMENTO_REGISTRADO_DESCONHECIDA (Data de nascimento do registrado desconhecida); 

- MUNICIPIO_REGISTRADO_DESCONHECIDO (Município de nascimento ou naturalidade do registrado desconhecido); 

- OUTROS (Outros). 

## **11.19.4 Registro de Natimorto** 

Códigos de Justificativas de Ausência de Campos Obrigatórios por Lei para os registros de natimorto: 

- RFB_INDISPONIVEL (Sistema da Receita Federal indisponível (ausente CPF do registrado e/ou filiação)); 

- SEXO_REGISTRADO_INDEFINIDO (Registrado não possui sexo definido); 

- DATA_NASCIMENTO_REGISTRADO_DESCONHECIDA (Data de nascimento do registrado desconhecida); 

- MUNICIPIO_REGISTRADO_DESCONHECIDO (Município de nascimento ou naturalidade do registrado desconhecido); 

- CPF_FILIACAO_NAO_APRESENTADO (Filiação do natimorto/nascido não apresentou CPF no momento do registro); 

- CPF_FILIACAO_INEXISTENTE (Filiação do natimorto/nascido não possui número de CPF); 

- FILIACAO_DESCONHECIDA (Nenhuma filiação do registrado conhecida (ausente: nome e sexo das duas filiações)); 

- UMA_FILIACAO_NAO_INFORMADA (Uma das filiações não informada - Opcional); 

- DATA_NASCIMENTO_FILIACAO_DESCONHECIDA (Data de nascimento da filiação desconhecida); 

- MUNICIPIO_FILIACAO_DESCONHECIDO (Município de nascimento ou naturalidade da filiação desconhecida); 

- OUTROS (Outros). 

--- end of page.page_number=121 ---
