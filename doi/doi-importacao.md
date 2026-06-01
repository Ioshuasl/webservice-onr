**==> picture [203 x 62] intentionally omitted <==**

**==> picture [87 x 62] intentionally omitted <==**

declaração. Desta forma, será possível importar as declarações livres de erros mesmo que existam declarações com erros no mesmo arquivo de importação. 

- Cada uma das declarações passará pelo processo de verificação de pendências. 

- Serão consideradas aptas para importação aquelas declarações que não contiverem erros de validação que causem rejeição, bem como nenhuma pendência impeditiva após a verificação de pendências. 

- Toda declaração importada será salva na base com a situação RASCUNHO. 

## **3. ESTRUTURA E CAMPOS DO ARQUIVO JSON** 

## 3.1. Detalhes técnicos da estruturado arquivo json 

O formato do arquivo na DOIWEB será (.json), conforme detalhamento abaixo: 

- Extensão: .json ou .zip (Se zip, deve conter apenas um arquivo .json) 

- JSON SCHEMA - Versão: 2020-12 (https://json-schema.org/specification-links#2020-12) 

- O esquema define os elementos e atributos que podem ocorrer em um documento JSON utilizando-se da própria sintaxe JSON para especificar: 

   - a hierarquia; 

   - a sequência destes elementos; 

   - se os elementos são obrigatórios; 

   - o tipo de elemento; e 

   - os valores possíveis. 

- Orientações gerais para atender o esquema: 

   - Deve possuir o seguinte formato genérico: 

**==> picture [6 x 10] intentionally omitted <==**

**----- Start of picture text -----**<br>
{<br>**----- End of picture text -----**<br>


**==> picture [95 x 60] intentionally omitted <==**

**----- Start of picture text -----**<br>
"declaracoes": [<br>{...},<br>{...}<br>**----- End of picture text -----**<br>


] 

- Deve possuir todos os campos previstos. 

- Não pode ter campos estranhos ao esquema. 

- Atributos sem conteúdo não devem ser enviados. 

- Deve respeitar os tamanhos mínimo e máximo previstos para os atributos. 

- Os dados devem ser válidos conforme o seu tipo. 

**9** 

**==> picture [203 x 62] intentionally omitted <==**

**==> picture [87 x 62] intentionally omitted <==**

- Exemplo: 

- integer: precisa ser um número inteiro 

- data: precisa ser uma data válida no formato YYYY-MM-DD 

No link abaixo está disponível o esquema json do arquivo e exemplo de arquivo com dados fictícios. 

- doi.rfb.gov.br/api/layout doiweb.json 

## 3.2. Campos do arquivo ordenados pelas fichas da DOIWEB. 

3.2.1. Ficha: Dados Iniciais 

|**Campo**|**Tipo**|**Tama**<br>**nho**|**Obrigatório?**|**Descrição/Observações**|
|---|---|---|---|---|
|tipoDeclaracao|Alfanumérico|-|Sim|A importação só é válida para o tipo de declaração<br> g“ ”, j , g|
|tipoServico|Alfanumérico|-|Sim|Tipo do serviço realizado pela serventia na operação<br>imobiliária declarada.<br>Não confundir com a atribuição que faz parte dos<br>dados da serventia.<br>Opções conforme tabela de domínio.|
|dataLavraturaRegistr<br>oAverbacao|Data|-|Sim|Refere-se as datas da lavratura, registro ou<br>averbação.<br>Formato: YYYY-MM-DD|
|tipoAto|Alfanumérico|-|Sim|Tipo do ato da serventia na operação imobiliária<br>declarada.|
|||||Opções variam conforme o tipo do serviço. Se o tipo|
|||||de serviço for:|
|||||•<br>Notarial: Escritura / Procuração|
|||||•<br>Registro de Imóveis: Averbação / Registro|
|||||•<br>Registro de Título e Documentos: Registros para|
|||||fins de publicidade /Registro para fins de|
|||||conservação|
|||||Códigos conforme tabela de domínio.|
|tipoLivro|Alfanumérico|-|Sim|Tipo do livro.<br>Este campo somente deve ser incluído se o tipo de<br>serviço for "Registro de Imóveis".<br>Opções conforme tabela de domínio.|
|numeroLivro|Alfanumérico|7|Sim<br>Opcional, caso<br>o MNE esteja<br>preenchido.|Informar o número do livro.<br>Este campo pode ser incluído para os três tipos de<br>serviços, observando-se as seguintes regras<br>específicas:|
|||||•<br>Quando o tipo de serviço for  'Notarial' a|
|||||informação deve começar com número.|
|||||•<br>Quando o tipo de serviço for "Registro de|
|||||Imóveis", somente deve ser incluído este campo|
|||||se o tipo de livro for "Transcrição das|
|||||Transmissões".|
|folha|Alfanumérico|7|Sim|Páginas/Folhas(indicar nº início-fim)|
|matriculaNotarialElet<br>ronica|Alfanumérico|24|Não|Informar Matrícula Notarial Eletrônica – MNE se<br>houver.|



**10** 

**==> picture [203 x 62] intentionally omitted <==**

**==> picture [87 x 62] intentionally omitted <==**

|||||Este  campo somente deve ser incluído se o tipo de<br>serviço for "Notarial".<br>Formato: CCCCCC.AAAA.MM.DD.NNNNNNNN-DD –<br>sem traços e pontos.<br>A MNE deve ser validada através do DV informado,<br>seguindo o algoritmo módulo 97 base 10, conforme<br>norma ISO 7064:2023.|
|---|---|---|---|---|
|matricula|Alfanumérico|15|Sim<br>Opcional se o<br>CNM estiver<br>preenchido.|Informar o número de ordem da matrícula do imóvel.<br>Quando o serviço for "Registro de Imóveis" o campo<br>somente deve ser incluído  se o Tipo do livro for<br>"Lv.2-Registro Geral(matrícula)".|
|transcricao|Inteiro|8|Sim<br>Opcional se<br>Matrícula ou<br>CNM<br>estiverem<br>preenchidos.|Informar o número de ordem da transcrição.<br>Este campo somente  deve ser incluído se o Tipo do<br>livro for "Transcrição das Transmissões".<br>Até o limite de 8 inteiros.|
|codigoNacionalMatri<br>cula|Alfanumérico|-|Sim<br>Opcional se  a<br>Matrícula<br>estiver<br>preenchida.|Informar o Código Nacional de Matrícula - CNM<br>Formato:CCCCCC.L.NNNNNNN-DD sem pontos e<br>traços.<br>O CNM informado será validado através do DV<br>informado, seguindo o algoritmo módulo 97 base 10,<br>conforme norma ISO 7064:2023.|
|numeroRegistroAver<br>bacao|Alfanumérico|7|Sim|Este campo somente deve  ser incluído se o tipo de<br>serviço for "Registro de Imóveis" e o tipo do livro for<br>"Lv.2-Registro Geral(matrícula)".|
|naturezaTitulo|Alfanumérico|-|Sim|Este campo somente deve ser incluído se o tipo de<br>serviço for "Registro de Imóveis"<br>Opções conforme tabela de domínio.|
|numeroRegistro|Alfanumérico|30|Sim|Este campo somente deve ser incluído se o tipo de<br>serviço for "Registro de Títulos e Documentos".|
|existeDoiAnterior|Booleano|-|Sim|Este campo somente deve ser incluído se o tipo de<br>serviço for "Registro de Imóveis".<br>Informar se consta a expressão \"Emitida a DOI\" no<br>título registrado.<br>Opções:<br>_True/False_|



## 3.2.2. Ficha: Operações Imobiliárias 

|**Campo**|**Tipo**|**Tama**<br>**nho**|**Obrigatório?**|**Descrição/Validação**|
|---|---|---|---|---|
|dataNegocioJuridico|Data|-|Sim|Informar a data da celebração do negócio jurídico.<br>Formato: YYYY-MM-DD|
|tipoOperacaoImobiliari<br>a|Alfanumérico|-|Sim|Informar o tipo de operação imobiliária.<br>Opções conforme tabela de domínio.|
|descricaoOutrasOpera<br>coesImobiliarias|Alfanumérico|30|Não|Este campo somente deve ser    c  í   se Tipo da<br>operação for "Outras Operações Imobiliárias".<br>Descrever a operação imobiliária.|



**11** 

**==> picture [203 x 62] intentionally omitted <==**

**==> picture [87 x 62] intentionally omitted <==**

|valorOperacaoImobilia<br>ria|Monetário|20.2|Sim, se "Não<br>consta nos<br>documentos<br>(valor da<br>operação)".|Informar o valor da operação imobiliária.<br>Até o limite de 18 inteiros e 2 casas decimais.|
|---|---|---|---|---|
|indicadorNaoConstaVa<br>lorOperacaoImobiliaria|<br>Booleano|-|Sim, se o "Valor<br>da Operação<br>Imobiliária" não<br>for informado.|Este campo somente deve ser    c  í   se o valor da<br>operação não constar dos documentos.<br>Opções:<br>_True/False_|
|valorBaseCalculoItbiItc<br>md|Monetário|20.2|Sim|Informar o valor da base de cálculo do ITBI ou do<br>ITCMD.<br>Até o limite de 18 inteiros e 2 casas decimais.|
|indicadorNaoConstaVa<br>lorBaseCalculoItbiItcm<br>d|Booleano|-|Sim, se o "Valor<br>da Base de<br>cálculo<br>ITBI/ITCMD" não<br>for informado.|<br>Este campo somente deve ser    c  í   se o valor da<br>base de cálculo do ITBI/ITCMD não constar dos<br>documentos.<br>Opções:<br>_True/False_|
|formaPagamento|Alfanumérico|-|Sim|Informar a forma de pagamento.<br>Opções conforme tabela de domínio.|
|indicadorAlienacaoFid<br>uciaria|Booleano|-|Incluído se a<br>opção "A prazo"<br>do campo<br>"forma de<br>pagamento" for<br>escolhida.|Este campo somente deve ser  incluído se a opção "A<br>prazo" do campo "forma de pagamento" for<br>escolhida.<br>Opções:<br>_True/False_|
|mesAnoUltimaParcela|Data|-|Incluído se a<br>opção "A prazo"<br>do campo<br>"forma de<br>pagamento" for<br>escolhida.|Este campo somente deve ser  incluído se a opção "A<br>prazo" do campo "forma de pagamento" for<br>escolhida.<br>Opções:<br>_True/False_<br>Formato:YYYY-MM-DD|
|valorPagoAteDataAto|Monetário|20.2|Incluído se a<br>opção "A prazo"<br>do campo<br>"forma de<br>pagamento" for<br>escolhida.|Informar o valor pago até a data do ato.<br>Este campo somente deve ser  incluído se a opção "A<br>prazo" do campo "forma de pagamento" for<br>escolhida.|
|indicadorPermutaBens|Booleano|-|Sim|Informar se houve permuta de bens na operação<br>imobiliária.<br>Opções:<br>_True/False_|
|indicadorPagamentoDi<br>nheiro|Booleano|-|Sim|Informar se houve pagamento em espécie.<br>Opções:<br>_True/False_|
|valorPagoMoedaCorre<br>nteDataAto|Monetário|20.2|Sim, incluído se a<br>informação no<br>campo<br>“indicadorPagam|<br>Informar o valor pago em espécie até a data do ato.<br>Este campo somente deve ser  incluído se a<br>informação no campo<br>“indicadorPagamentoDinheiro” f_True_.|



**12** 

**==> picture [203 x 62] intentionally omitted <==**

**==> picture [87 x 62] intentionally omitted <==**

||||entoDinheiro”<br>for_True_.|Até o limite de 18 inteiros e 2 casas decimais.|
|---|---|---|---|---|
|tipoParteTransacionad<br>a|Alfanumérico|-|Sim|Informar a medida da parte do imóvel que está sendo<br>transacionada.<br>A informação poderá ser em metros/hectares ou em<br>percentual.<br>Opções conforme tabela de domínio.|
|valorParteTransaciona<br>da|Alfanumérico|20.2|Sim|Informar a quantidade de metros/hectares ou o<br>percentual que foi objeto da operação imobiliária,<br>conforme opção no campo tipoParteTransacionada.<br>Até o limite de 18 inteiros e 2 casas decimais.|



## 3.2.3. Ficha: Dados do imóvel 

|**Campo**|**Tipo**|**Taman**<br>**ho**|**Obrigatório?**|**Descrição/Validação**|
|---|---|---|---|---|
|cib|Alfanumérico|8|Sim|Número de identificação no Cadastro Imobiliário<br>Brasileiro (CIB). Instrução Normativa nº 2.030/2021.<br>Exibir caso o imóvel possua CIB.<br>O código CIB substitui o Número do Imóvel na<br>Receita Federal (Nirf) atribuído aos imóveis rurais.<br>Regra de validação no item 9.|
|destinacao|Alfanumérico|-|Sim|Informar se o imóvel é urbano ou rural.<br>Opções conforme tabela de domínio.|
|indicadorImovelPublic<br>oUniao|Boolean|-|Sim|Informar se o imóvel objeto da operação imobiliária é<br>imóvel público da União.<br>Opções:_True/False_|
|registroImobiliarioPatri<br>monial|Alfanumérico|13|Sim, se o campo<br>“indicadorImovel<br>PublicoUniao”<br>for "_True_"|Informar a identificação do imóvel no cadastro da<br>Secretaria de Patrimônio da União (SPU), ou seja, o<br>número do Registro Imobiliário Patrimonial (RIP).|
|certidaoAutorizacaoTr<br>ansferencia|Alfanumérico|11|Sim, se o campo<br>“indicadorImovel<br>PublicoUniao”<br>for "_True_"|Informar o número da Certidão de Autorização para<br>Transferência (CAT) emitida pela Secretaria de<br>Patrimônio da União (SPU).<br>Informado pelo declarante se o campo "É imóvel<br>público da união?" for "SIM".|
|matricula|Alfanumérico|15|Sim, se não<br>informado o<br>número da<br>transcrição ou<br>do CNM.|Somente enviar se o número da transcrição não for<br>informado.<br>Adicionar zero a esquerda caso o usuário não informe<br>os 7 dígitos.<br>Formato: 9999999|
|transcricao|Inteiro|8|Sim, se não<br>informado o<br>número da<br>matrícula ou<br>CNM.|Informar o número de ordem da transcrição.<br>Somente permitir informar se o número da matrícula<br>não for informado.|
||Campos a ser||em informados se|o imóvel for**urbano.**|
|inscricaoMunicipal|Alfanumérico|45|Sim|Código da inscrição imobiliária no cadastro do<br>município.|



**13** 

**==> picture [203 x 62] intentionally omitted <==**

**==> picture [87 x 62] intentionally omitted <==**

|codigoIbge|Numérico|7|Sim|Informar o código IBGE do município onde se localiza<br>o imóvel.|
|---|---|---|---|---|
|areaImovel|Numérico|15.2|Sim|Área do lote urbano. Preenchimento em m2.<br>Informar de acordo com a matrícula.<br>Até o limite de 13 inteiros e 2 casas decimais.<br>Este campo também é utilizadopara o imóvel rural.|
|indicadorAreaLoteNao<br>Consta|Boolean|-|Sim|Informado pelo declarante caso a área do lote não<br>constar no documento.|
|areaConstruida|Numérico|16.4|Sim|Área Construída (m2).<br>Informar de acordo com a matrícula.<br>Até o limite de 12 inteiros e 4 casas decimais.<br>Preenchimento em m2.|
|indicadorAreaConstrui<br>daNaoConsta|Boolean|-|Sim|Informado pelo declarante caso a área de construção<br>não constar no documento.|
|tipoImovel|Alfanumérico|-|Sim|Informar o tipo do imóvel.<br>Opções conforme tabela de domínio.|
|tipoLogradouro|Alfanumérico|30|Sim|Informar o tipo do logradouro. Ex: rua, avenida,<br>travessa etc.|
|nomeLogradouro|Alfanumérico|255|Sim|Informar o nome do logradouro do endereço do<br>imóvel.|
|numeroImovel|Alfanumérico|10|Sim|Informar o número do endereço do imóvel.|
|complementoNumeroI<br>movel|Alfanumérico|10|Não|Informar o complemento do número do imóvel que<br>posiciona a unidade imobiliária dentro do<br>lote/condomínio. Ex.: nº do apartamento,bloco.|
|complementoEnderec<br>o|Alfanumérico|100|Não|Informar o complemento da identificação do<br>logradouro. Ex: nome do condomínio.|
|bairro|Alfanumérico|150|Sim|Informar o bairro do endereço do imóvel.|
|cep|Alfanumérico|8|Sim|Informar o Código de Endereçamento Postal (CEP) do<br>endereço do imóvel.|
||Campos a se||rem informados s|e o imóvel for**rural**.|
|codigoIncra|Alfanumérico|13|Sim|Informar o Código da propriedade no Instituto<br>Nacional de Colonização Agrária(INCRA).|
|denominacao|Alfanumérico|200|Sim|Informar o nome do imóvel rural que consta no<br>documento (título a ser registrado,<br>matrícula/transcrição,escritura pública etc), caso<br>exista.|
|localizacao|Alfanumérico|200|Sim|Informar dados que possam ajudar na localização do<br>imóvel, tais como: distrito, povoado, colônia, núcleo,<br>rodovia/km,ramal, gleba,lote,etc.|
|areaImovel|Numérico|15.4|Sim|Área do imóvel rural. Preenchimento em ha.<br>Informar de acordo com a matrícula.<br>Até o limite de 13 inteiros e 2 casas decimais.<br>Este campo também é utilizado para o imóvel<br>urbano.|
|codigoIbge|Numérico|7|Sim|Informar o código IBGE do município onde se localiza<br>a sede do imóvel.|
|municipiosUF|Alfanumérico|-|Sim|Lista com os códigos IBGE dos demais municípios<br>onde se localiza o imóvel.<br>Se o imóvel se situar em apenas um município não<br>incluir o campo no registro.|



**14** 

**==> picture [203 x 62] intentionally omitted <==**

**==> picture [87 x 62] intentionally omitted <==**

## 3.2.4. Alienantes 

|**Campo**|**Tipo**|**Tama**<br>**nho**|**Obrigatório?**|**Descrição/Validação**|
|---|---|---|---|---|
|indicadorNiIdentificad<br>o|Boolean|-|Sim|Informar se consta no documento o CPF/CNPJ de<br>cada um dos alienantes.<br>Opções:_True/False_|
|motivoNaoIdentificaca<br>oNi|Alfanumérico|2|Sim,  quando a<br>opção do campo<br>o campo<br>indicadorNiIdentif<br>icado for_False_.|Informar o motivo da ausência do CPF da parte.<br>O campo somente deve ser incluído quando a opção<br>do campo indicadorNiIdentificado for_False_.<br>Opções conforme tabela de domínio.|
|ni|Alfanumérico|11 ou<br>14|Sim|Informar o CPF/CNPJ do(s) alienante(s).<br>Validação serápelo DV.|
|participacao|Numérico|7.4|Sim,  quando a<br>opção do campo<br>o campo<br>indicadorNiIdentif<br>icado for_True_.|Informar percentual conforme a participação de<br>cada parte na operação levada a cartório.<br>Exemplo: transmissão em razão de falecimento de<br>50% do imóvel. São dois herdeiros.<br>Cada um tem 50% de participação na operação, pois<br>ficou com metade da parte transmitida.<br>A soma das participações não poderá ser inferior a<br>99,00% ou superior 100,00%.<br>Até o limite de 3 inteiros e 4 casas decimais.|
|indicadorNaoConstaPa<br>rticipacaoOperacao|Boolean|-|Sim|Indicador que sinaliza que o percentual de<br>participação não consta nos documentos.<br>Opções:_True/False_|
|indicadorEstrangeiro|Boolean|-|Sim|Informar se o alienante é estrangeiro.<br>Opções:_True/False_|
|indicadorEspolio|Boolean|-|Sim|Informar se a alienação foi feita em nome de<br>espólio.<br>Opções:_True/False_|
|cpfInventariante|Alfanumérico|11|Sim,  quando for<br>marcado com<br>_True_o campo<br>indicadorEspolio|Informar o CPF do inventariante.<br>Este campo somente deve ser incluído se o campo "<br>indicadorEspolio " for marcado com_True_.|
|indicadorConjuge|Boolean|-|Sim|Informar se o alienante possui cônjuge.<br>Opções:_True/False_<br>Caso marcada a opção_True_devem ser<br>acrescentados os campos que contém informações<br>sobre o cônjuge.|
|indicadorConjugePartic<br>ipa|Boolean|-|Sim,  quando for<br>marcado com<br>_True_o  campo<br>indicadorConjuge|<br>Nos casos em que o alienante informa que possui<br>cônjuge, este último pode ou não participar da<br>operação.<br>Opções:_True/False_<br>Indicador de que o cônjuge também será um<br>alienante.|
|regimeBens|Alfanumérico|-|Sim,  quando for<br>marcado com<br>_True_o campo<br>indicadorConjuge|<br>Informar o regime de bens no casamento.<br>Opções conforme tabela de domínio.|
|indicadorCpfConjugeId<br>entificado|Boolean|-|Sim,  quando for<br>marcado com<br>_True_o campo|Informar se consta o CPF do cônjuge no documento<br>(título a ser registrado,|



**15** 

**==> picture [203 x 62] intentionally omitted <==**

**==> picture [87 x 62] intentionally omitted <==**

||||indicadorConjuge<br>Participa<br> <br>|matrícula/transcrição,escritura pública etc) Opções:<br>_True/False_|
|---|---|---|---|---|
|cpfConjuge|Alfanumérico|11|Sim,  quando for<br>marcado com<br>_True_o campo<br>indicadorCpfConj<br>ugeIdentificado<br> <br> <br> <br> <br>|Informar o CPF do cônjuge que consta no<br>documento (título a ser registrado,<br>matrícula/transcrição,escritura pública etc).<br>Se o CPF do cônjuge não constar no documento não<br>incluir este campo no registro.|
|indicadorRepresentant<br>e|Boolean|-|Sim<br> <br> <br> <br> <br> <br> <br>|Indicador que sinaliza que o(s) alienante(s) outorgou<br>(aram) mandato a pessoa física ou jurídica para<br>representá-lo(s) na operação imobiliária informada<br>pela serventia.<br>Opções:_True/False_<br>Se a opção for_True_deve ser informado ao menos<br>um CPF/CNPJ no campo.|
|representantes|Lista|-|-<br> <br>|Lista de Objetos no formato JSON com dados dos<br>representantes.|



## 3.2.5. Adquirentes 

|**Campo**|**Tipo**|**Taman**<br>**ho**|**Obrigatório?**|**Descrição/Validação**|
|---|---|---|---|---|
|indicadorNiIdentificad<br>o|Boolean|-|Sim|Informar se consta no documento o CPF/CNPJ de<br>cada um dos adquirentes.<br>Opções:_True/False_|
|motivoNaoIdentificaca<br>oNi|Alfanumérico|-|Sim,  quando a<br>opção do campo<br>o campo<br>indicadorNiIdenti<br>ficado for_False_.|Informar o motivo da ausência do CPF da parte.<br>O campo somente deve ser incluído quando a<br>opção do campo indicadorNiIdentificado for_False_.<br>Opções conforme tabela de domínio.|
|ni|Alfanumérico|11 ou<br>14|Sim|Informar o CPF/CNPJ do adquirente.<br>Validação serápelo DV.|
|participacao|Numérico|7.4|Sim,  quando a<br>opção do campo<br>indicadorNiIdenti<br>ficado for_True_.|Informar percentual conforme a participação de<br>cada parte na operação levada a cartório.<br>Exemplo: transmissão em razão de falecimento de<br>50% do imóvel. São dois herdeiros.<br>Cada um tem 50% de participação na operação,<br>pois ficou com metade da parte transmitida.<br>A soma das participações não poderá ser inferior a<br>99,00% ou superior 100,00%.<br>Até o limite de 3 inteiros e 4 casas decimais.|
|indicadorNaoConstaPa<br>rticipacaoOperacao|Boolean|-|Sim|Indicador que sinaliza que o percentual de<br>participação não consta nos documentos.<br>Opções:_True/False_|
|indicadorEstrangeiro|Boolean|-|Sim|Informar se o adquirente é estrangeiro.<br>Opções:_True/False_|
|indicadorEspolio|Boolean|-|Sim|Informar se a aquisição foi feita em nome de<br>espólio.<br>Opções:_True/False_|
|cpfInventariante|Alfanumérico|11|Sim,  quando for<br>marcado com|Informar o CPF do inventariante.|



**16** 

**==> picture [203 x 62] intentionally omitted <==**

**==> picture [87 x 62] intentionally omitted <==**

||||_True_o campo<br>indicadorEspolio|Este campo somente é incluído se o campo<br>indicadorEspolio for marcado com_True_.|
|---|---|---|---|---|
|indicadorConjuge|Boolean|-|Sim|Informar se o adquirente possui cônjuge.<br>Opções:_True/False_<br>Caso marcada a opção_True_devem ser<br>acrescentados os campos que contém informações<br>sobre o cônjuge.|
|indicadorConjugePartic<br>ipa|Boolean|-|Sim,  quando for<br>marcado com<br>_True_o  campo<br>indicadorConjuge|<br>Nos casos em que o adquirente informa que possui<br>cônjuge, este último pode ou não participar da<br>operação.<br>Opções:_True/False_<br>Indicador de que o cônjuge também será um<br>adquirente.|
|regimeBens|Alfanumérico|-|Sim,  quando for<br>marcado com<br>_True_o campo<br>indicadorConjuge|<br>Informar o regime de bens no casamento.<br>Opções conforme tabela de domínio.|
|indicadorCpfConjugeId<br>entificado|Boolean|-|Sim,  quando for<br>marcado com<br>_True_o campo<br>indicadorConjuge<br>Participa|Informar se consta o CPF do cônjuge no documento<br>(título a ser registrado,<br>matrícula/transcrição,escritura pública etc) Opções:<br>_True/False_|
|cpfConjuge|Alfanumérico|11|Sim,  quando for<br>marcado com<br>_True_o campo<br>indicadorCpfConj<br>ugeIdentificado|Informar o CPF do cônjuge que consta no<br>documento (título a ser registrado,<br>matrícula/transcrição,escritura pública etc).<br>Se o CPF do cônjuge não constar no documento não<br>incluir este campo no registro.|
|indicadorRepresentant<br>e|Boolean|-|Sim|Indicador que sinaliza que o(s) alienante(s)<br>outorgou (aram) mandato a pessoa física ou jurídica<br>para representá-lo(s) na operação imobiliária<br>informada pela serventia.<br>Opções:_True/False_<br>Se a opção for_True_deve ser informado ao menos<br>um CPF/CNPJ no campo.|
|representantes|Lista|-|-|Lista de Objetos no formato JSON com dados dos<br>representantes.|



## 3.3. Domínios 

Deve ser usado apenas o "Código" para representar uma informação de domínio. 

Tabela 1 – Tipo da declaração (tipoDeclaracao) 

|Código|Descrição|
|---|---|
|0|Original|
|1|Retificadora|
|3|Canceladora|



**17** 

**==> picture [203 x 62] intentionally omitted <==**

**==> picture [87 x 62] intentionally omitted <==**

Tabela 2 – Tipo do serviço (tipoServico) 

|Código|Descrição|
|---|---|
|1|Notarial|
|2|Registro de Imóveis|
|3|Registro de Títulos e Documentos|



Tabela 3 – Tipo do ato (tipoAto) 

|Código|Descrição|
|---|---|
|1|Escritura|
|2|Procuração|
|3|Averbação|
|4|Registro|
|5|Registrospara fins depublicidade|
|6|Registropara fins de conservação|



Tabela 4 – Tipo do livro (tipoLivro) 

|Código|Descrição|
|---|---|
|1|Lv.2-Registro Geral(matrícula)|
|2|Transcrição das Transmissões|



Tabela 5 – Natureza do título (naturezaTitulo) 

|Código|Descrição|
|---|---|
|1|Instrumentoparticular com força de escriturapública|
|2|Escritura Pública|
|3|Título Judicial|
|4|Contratos ou termos administrativos|
|5|Atos autênticos depaíses estrangeiros|



Tabela 6 – Tipo da operação imobiliária (tipoOperacaoImobiliaria) 

|Código|Descrição|
|---|---|
|11|Compra e Venda|
|13|Permuta|
|15|Adjudicação|
|19|Dação em Pagamento|
|21|Distrato de Negócio|
|31|Procuração em Causa Própria|
|33|Promessa de Compra e Venda|
|35|Promessa de Cessão de Direitos|



**18** 

**==> picture [203 x 62] intentionally omitted <==**

**==> picture [87 x 62] intentionally omitted <==**

|37|Cessão de Direitos|
|---|---|
|39|Outras operações imobiliárias|
|41|Alienaçãopor iniciativaparticular ou leilãojudicial|
|45|Incorporação e loteamento|
|47|Integralização/Subscrição de capital|
|55|Doação em adiantamento da legítima|
|56|Aforamento|
|57|Casamento em comunhão universal de bens|
|58|Cisão total ouparcial|
|59|Compra e venda de imóvelgravadopor enfiteuse|
|60|Concessão de Direito Real de Uso(CDRU)|
|61|Concessão de Uso Especialpara Fins de Moradia(CUEM)|
|62|Consolidação da Propriedade em Nome do Fiduciário|
|63|Desapropriaçãopara fins de Reforma Agrária|
|64|Desapropriação,excetopara Reforma Agrária|
|65|Direito de laje|
|66|Direito de superfície|
|67|Doação,exceto em Adiantamento de Legítima|
|68|Incorporação|
|69|Inventário|
|70|Part. Separação/Divórcio/União Estável|
|71|Retorno de Capital Próprio na Extinção de Pessoa Jurídica|
|72|Retorno de Capital Próprio,exceto na Extinção de Pessoa Jurídica|
|73|Título de Domínio - TD|
|74|Usucapião|



Tabela 7 – Forma de Pagamento (formaPagamento) 

|Código|Descrição|
|---|---|
|5|Quitado à vista|
|10|Quitado aprazo|
|11|Quitado sem informação da forma depagamento|
|7|Aprazo|
|9|Não se aplica|



Tabela 8 – Medida da parte transacionada do imóvel (tipoDeclaracao) 

|Código|Descrição|
|---|---|
|1|%|
|2|ha/m²|



Tabela 9 – Destinação (destinacao) 

|Código|Descrição|
|---|---|
|1|Urbano|
|3|Rural|



**19** 

**==> picture [203 x 62] intentionally omitted <==**

**==> picture [87 x 62] intentionally omitted <==**

Tabela 10 – Motivo da não identificação do NI (motivoNaoIdentificacaoNi) 

|Código|Descrição|
|---|---|
|1|Sem CPF/CNPJ - Decisão Judicial|
|2|Não consta no documento|



Tabela 11 – Regime de bens (regimeBens) 

|Código|Descrição|
|---|---|
|1|Separação de Bens|
|2|Comunhão Parcial de Bens|
|3|Comunhão Universal de Bens|
|4|Participação Final nos Aquestos|



Tabela 12 – Tipo do imóvel (tipoImovel) 

|Código|Descrição|
|---|---|
|15|Loja|
|31|Galpão|
|65|Apartamento|
|67|Casa|
|69|Fazenda/Sítio/Chácara|
|71|Terreno/Fração|
|89|Outros|
|90|Sala|
|91|Conjunto de salas|
|92|Sobreloja|
|93|Vaga de Garagem|
|94|Laje|
|95|Estacionamento|
|96|Barraco|



## 3.4. Regras de validação 

Há vários cenários possíveis após a validação: rejeição integral do arquivo; rejeição individual da declaração (declaração inapta) e geração de pendências na validação. 

3.4.1. Validações que geram erros e rejeitam o arquivo por completo 

Os arquivos deve ser do tipo texto e possuir a extensão .TXT para o PGD e formato .JSON para a DOI-WEB. 

Os arquivos de importação devem obedecer às definições de formato especificadas no item 1.1. 

O leiaute de importação varia de acordo com o formato do arquivo a ser validado. 

O arquivo json deve ter sua estrutura válida. A captura de tela abaixo mostra a mensagem da DOIWeb nos casos em que o arquivo não é estruturalmente válido. 

**20** 

**==> picture [203 x 62] intentionally omitted <==**

**==> picture [87 x 62] intentionally omitted <==**

**==> picture [393 x 213] intentionally omitted <==**

No caso o erro apontado é a ausência de vírgula em uma das linhas. 

Existem várias ferramentas online gratuitas que podem validar a estrutura de um JSON. Basta copiar e colar o conteúdo JSON na interface e ele fará a verificação. 

3.4.2. Validações que geram erros e rejeitam declarações individualmente 

_Inclusão de declarações retificadoras ou canceladoras_ 

Não será permitido a importação de declarações retificadoras e canceladoras. Somente declarações originais poderão ser importadas. 

Quando houver alguma declaração do tipo retificadora ou canceladora o sistema exibirá a seguinte mensagem: "Declarações retificadoras ou canceladoras não podem ser importadas" 

_Ausência de campo obrigatório para importação_ 

O arquivo json deve possuir uma estrutura de campos mínima para a declaração ser considerada apta para importação. Estes campos devem estar preenchidos de acordo com as regras do tópico 3.2. 

_Erros de campos_ 

Serão realizadas validações individuais em cada campo conforme o tipo e suas características conforme o leiaute de importação: 

- Para campos numéricos, avalia-se se estão sendo informados somente dígitos. 

**21** 

**==> picture [203 x 62] intentionally omitted <==**

**==> picture [87 x 62] intentionally omitted <==**

- Para campos de datas, avalia-se se estão sendo informadas datas válidas. 

- Para campos com domínio definido, avalia-se se os valores informados estão dentro do domínio. 

- Para campos que possuem regras de preenchimento específica (definidas no Leiaute de Importação), avalia-se se estas regras estão sendo obedecidas. 

O sistema exibirá mensagens de erro no seguinte formato: "Campo XXXXX, motivo: XXXX". 

## 3.4.3. Validações que geram pendências 

## _Duplicidade de declaração no arquivo_ 

A verificação de suspeita de duplicidade seguirá as seguintes regras: 

- A validação irá verificar os campos da Lista de Campos para Suspeita de Duplicidade. 

- A validação irá ocorrer apenas quando todos os campos da lista estiverem preenchidos. 

- A validação será feita comparando os valores dos campos na declaração aberta com declarações que já foram entregues. 

- Se a validação identificar possíveis duplicidades, será gerada uma pendência impeditiva. 

- A pendência irá aparecer junto com as outras na ficha de Pendências. 

- O usuário terá possibilidade de indicar que as suspeitas de duplicidade não procedem, neste caso o sistema irá gravar os IDs das declarações que o usuário verificou. 

- Em futuras verificações de pendências para a declaração, serão descartadas as declarações que o usuário já verificou (através dos IDs gravados). 

- Caso a validação identifique novas possíveis duplicidades, o sistema novamente irá gerar uma pendência impeditiva. 

- Caso algum dos campos da Lista de Campos para Suspeita de Duplicidade seja alterado, o sistema irá limpar os IDs das declarações já verificadas, de forma a considerá-las na próxima verificação de pendências 

Em caso de suspeita de duplicidade o sistema exibirá uma pendência de declaração, a seguinte mensagem: " Esta declaração já pode ter sido cadastrada. Analise a declaração existente e verifique se esta pendência é impeditiva. " A captura de tela abaixo demonstra a situação. 

**==> picture [426 x 64] intentionally omitted <==**

**==> picture [27 x 29] intentionally omitted <==**

Se não for o caso de duplicidade é possível clicar no ícone 

e mudar o _status_ da pendência. 

**22** 

**==> picture [203 x 62] intentionally omitted <==**

**==> picture [87 x 62] intentionally omitted <==**

**==> picture [426 x 54] intentionally omitted <==**

O aviso passa a ser amarelo e a declaração pode ser importada. 

Não será permitido a importação de declarações duplicadas no mesmo arquivo. Será considerada duplicada quando uma segunda declaração contiver valores idênticos para os campos definidos no item "Lista de Campos para Suspeita de Duplicidade" . 

## **Lista de Campos para Suspeita de Duplicidade** 

Campos CNS CNPJ do Cartório Tipo da Declaração Data de Anotação/Lavratura/Matrícula/Registro Livro Ficha/Folha Transcrição/Matrícula/Inscrição Averbação/Registro Tipo de Operação Imobiliária Data do Negócio Jurídico Valor da Operação CIB NIs dos Alienantes NIs dos Adquirentes 

_Lista de pendências_ 

Uma declaração apta pode apresentar uma lista de pendências. 

A lista de pendências será exibida para cada declaração. 

**==> picture [426 x 182] intentionally omitted <==**

**23** 

**==> picture [203 x 62] intentionally omitted <==**

**==> picture [87 x 62] intentionally omitted <==**

## _Relação de Avisos e Erros_ 

A  seguir a relação das verificações que serão efetuadas nos campos da declaração, com respectivas mensagens, organizadas pelos blocos de informações. 

||||
|---|---|---|
|**Ficha Dados Iniciais**|||
||||
||||
|**Campo**|**Mensagem para o declarante**|**Condição**|
||||
||||
|Tipo do Serviço|Obrigatório informar Tipo de Serviço|Quando o Tipo do Serviço<br>não for informado.|
||||
||||
|Tipo do Ato|Obrigatório informar Tipo do Ato|Quando o Tipo do Ato não<br>for informado.|
||||
||||
|Data do Ato|Obrigatório informar Data do Ato|Quando a Data do Ato não<br>for informada.|
||||
||||
|Folha|Obrigatório informar a Folha|Quando a Folha/Ficha não<br>for informada|
||||
||||
|Consta no<br>documento/escritura<br>informação de que<br>foi emitida DOI<br>anteriormente?|Consta no documento/escritura<br>informação que foi emitida DOI<br>anteriormente? deve estar preenchido<br>quando Tipo de Serviço for Registro de<br>Imóveis|Quando 'Tipo do Serviço'<br>for 'Registro de Imóveis' e<br>'Consta no<br>documento/escritura<br>informação de que foi<br>emitida DOI<br>anteriormente?' não for<br>informado.|
||||
||||
|Tipo do Livro|Tipo do Livro deve estar preenchido<br>quando Tipo de Serviço for Registro de<br>Imóveis|Quando 'Tipo do Serviço'<br>for 'Registro de Imóveis'<br>e Tipo do Livro não for<br>informado.|
||||
||||
|Motivo do<br>Cancelamento|Obrigatório informar 'Motivo do<br>Cancelamento'|Obrigatório informar<br>'Motivo do Cancelamento'<br>se declaração for do tipo<br>Canceladora.|
||||
||||
|Natureza do Título|Natureza do Título deve estar<br>preenchido quando Tipo de Serviço for<br>Registro de Imóveis.|Quando 'Tipo do Serviço'<br>for 'Registro de Imóveis' e<br>Natureza do Título não for<br>informado.|
||||
||||
|Data do Ato|Data do Ato informada é maior que a<br>data atual do sistema.|Quando a 'Data do Ato' for<br>maior que a data atual do<br>sistema.|
||||



**24** 

**==> picture [203 x 62] intentionally omitted <==**

**==> picture [87 x 62] intentionally omitted <==**

||||
|---|---|---|
|Número do livro|Obrigatório informar Número do livro.|Quando 'Tipo do Serviço'<br>for Registro de títulos e<br>documentos e o Número<br>do livro  não for<br>informado.|
||||
||||
|Matrícula/Transcrição|Matrícula deve estar preenchido<br>quando Tipo de Serviço for Registro de<br>Imóveis, Tipo do Livro for Lv.2-Registro<br>Geral(matrícula) e Código Nacional de<br>Matrícula não está preenchida.|Quando 'Tipo do Serviço'<br>for 'Registro de Imóveis' e<br>Matrícula não for<br>informado.|
||||
||||
|Código Nacional de<br>Matrícula|Código Nacional de Matrícula deve<br>estar preenchido quando Tipo de<br>Serviço for Registro de Imóveis, Tipo<br>do Livro for Lv.2-Registro<br>Geral(matrícula) e Matrícula não<br>estiver preenchida.|Quando 'Tipo do Serviço'<br>for 'Registro de Imóveis' e<br>Matrícula não for<br>informada.|
||||
||||
|Código Nacional de<br>Matrícula|Código Nacional de Matrícula com<br>dígito verificador inválido.|Quando  o Código Nacional<br>de Matrícula informado<br>está com o dígito<br>verificador inválido.|
||||
||||
|Averbação/ Registro|Número de Registro/Averbação deve<br>estar preenchido quando Tipo de<br>Serviço for Registro de Imóveis e Tipo<br>do Livro for Lv.2-Registro<br>Geral(matrícula).|Quando Tipo de Serviço for<br>Registro de Imóveis e Tipo<br>do Livro for Lv.2-Registro<br>Geral(matrícula) e o<br>Registro/Averbação não<br>for informado.|
||||
||||
|Transcrição|Transcrição deve estar preenchido<br>quando Tipo de Serviço for Registro de<br>Imóveis e Tipo do Livro for Transcrição<br>das Transmissões.|Quando 'Tipo do Serviço'<br>for 'Registro de Imóveis' e<br>Transcrição não for<br>informada.|
||||
||||
|MNE|MNE com dígito verificador inválido.|Quando MNE for<br>informado com dígito<br>verificador inválido.|
||||



**==> picture [429 x 34] intentionally omitted <==**

||||
|---|---|---|
|**Ficha Dados da Operação Imobiliária**|||
||||
||||
|**Campo**|**Mensagem para o declarante**|**Condição**|
||||
||||
|Data do Negócio<br>Jurídico|Obrigatório informar Data do Negócio<br>Jurídico.|Quando a 'Data do<br>Negócio Jurídico' não for<br>informada.|
||||



**25** 

**==> picture [203 x 62] intentionally omitted <==**

**==> picture [87 x 62] intentionally omitted <==**

||||
|---|---|---|
|Data do Negócio<br>Jurídico|Data do Negócio Jurídico informada é<br>maior que a data atual do sistema.|Quando a 'Data do<br>Negócio Jurídico' for maior<br>que a data atual do<br>sistema.|
||||
||||
|Data do Negócio<br>Jurídico|Data do Negócio Jurídico informada é<br>maior que Data do Ato|Quando a Data do Negócio<br>Jurídico informada é maior<br>que Data do Ato.|
||||
||||
|Tipo da Operação<br>Imobiliária|Obrigatório informar Tipo da<br>Operação.|Quando o Tipo da<br>Operação não for<br>informado.|
||||
||||
|Descrição de Outras<br>Operações<br>Imobiliárias|g  ó      f       ‘D  c      de<br>I      á    ’|Quando o 'Tipo da<br>Operação Imobiliária' for<br>'Outras Operações<br>Imobiliárias' e 'Descrição<br>de Outras Operações<br>Imobiliárias' não for<br>informado.|
||||
||||
|Indicador da Parte<br>Transacionada|Obrigatório informar Indicador da<br>Parte Transacionada.|Quando o Indicador da<br>Parte Transacionada não<br>for informado.|
||||
||||
|Valor da Parte<br>Transacionada|Obrigatório informar Valor da Parte<br>Transacionada.|Quando o Valor da Parte<br>Transacionada não for<br>informado.|
||||
||||
|Valor da Parte<br>Transacionada -<br>Percentual da Parte<br>Transacionada|O Percentual da Parte Transacionada<br>não pode ser maior que 100%.|Quando o Indicador da<br>Parte Transacionada for %<br>e o Percentual da Parte<br>Transacionada for maior<br>que 100%.|
||||
||||
|Valor da Parte<br>Transacionada -<br>Percentual da Parte<br>Transacionada|O Percentual da Parte Transacionada<br>tem que ser maior que 0%.|Quando o Indicador da<br>Parte Transacionada for %<br>e o Percentual da Parte<br>Transacionada for menor<br>igual a 0%.|
||||
||||
|Valor da Operação|Valor da Operação Imobiliária deve<br>estar preenchido quando Valor da<br>Operação Imobiliária Não consta nos<br>documentos não for marcado.|Quando o 'Valor da<br>Operação' não for<br>informado e não for<br>marcado 'Não Consta nos<br>Documentos'.|
||||
||||
|Não consta nos<br>documentos do<br>campo 'Valor da<br>Operação'|Valor da Operação Imobiliária Não<br>consta nos documentos deve estar<br>preenchido quando Valor da Operação<br>Imobiliária não for preenchido|Quando o 'Não consta nos<br>Documentos' do<br>campo 'Valor da Operação'<br>não for  marcado e o Valor|
||||



**26** 

**==> picture [203 x 62] intentionally omitted <==**

**==> picture [87 x 62] intentionally omitted <==**

||||
|---|---|---|
|||da Operação Imobiliária<br>não for informado.|
||||
||||
|Valor da Base de<br>Cálculo ITBI/ITCMD|Valor da Base de cálculo ITBI/ITCMD<br>deve estar preenchido quando Valor<br>da Base de cálculo ITBI/ITCMD Não<br>consta nos documentos não for<br>marcado.|Quando o Valor da Base de<br>Cálculo ITBI/ITCMD não for<br>informado e não for<br>marcado 'Não Consta nos<br>Documentos'.|
||||
||||
|Não consta nos<br>documentos do<br>campo Valor da Base<br>de cálculo<br>ITBI/ITCMD|Valor da Base de cálculo ITBI/ITCMD<br>Não consta nos documentos deve<br>estar preenchido quando Valor da<br>Base de cálculo ITBI/ITCMD não for<br>preenchido.|Quando o Não consta nos<br>documentos do<br>campo 'Valor da Operação'<br>não for  marcado.|
||||
||||
|Houve pagamento<br>em dinheiro?|Obrigatório informar Houve<br>pagamento em dinheiro?|Quando o 'Houve<br>pagamento em<br>dinheiro?'  não<br>for  marcado.|
||||
||||
|Houve permuta de<br>bens?|Obrigatório informar Houve permuta<br>de bens?|Quando o 'Houve permuta<br>de bens?' não<br>for  marcado.|
||||
||||
|Forma de Pagamento|Obrigatório informar Forma de<br>pagamento.|Quando a 'Forma de<br>Pagamento' não for<br>selecionada.|
||||
||||
|Mês/Ano da última<br>Parcela|Mês/Ano da última Parcela deve estar<br>preenchido quando Forma de<br>Pagamento for A prazo.|Quando a 'Forma de<br>Pagamento' for informada<br>com a opção 'A prazo ' e o<br>'Mês/Ano da última<br>Parcela' não for<br>informado.|
||||
||||
|Na compra e venda<br>houve alienação<br>fiduciária do imóvel?|Na compra e venda houve alienação<br>fiduciária do imóvel? deve estar<br>preenchido quando Forma de<br>Pagamento for A prazo.|Quando a 'Forma de<br>Pagamento' for informada<br>com a opção 'A prazo '<br>e 'Na compra e venda<br>houve alienação fiduciária<br>do imóvel?' não for<br>informado.|
||||
||||
|Valor pago até a data<br>do Ato|Valor pago até a data do Ato deve<br>estar preenchido quando Forma de<br>Pagamento for A prazo.|Quando a 'Forma de<br>Pagamento' for informada<br>com a opção 'A prazo '<br>e 'Valor pago até a data do<br>Ato' não for informado.|
||||
||||
|Valor pago em<br>moeda corrente até a<br>Data do Ato|Valor pago em moeda corrente até a<br>data do ato deve estar preenchido|Quando 'Houve<br>pagamento em dinheiro?'<br>for 'Sim'.|
||||



**27** 

**==> picture [203 x 62] intentionally omitted <==**

**==> picture [87 x 62] intentionally omitted <==**

quando Houve pagamento em dinheiro? for 'Sim'. 

## **Ficha Dados do Imóvel** 

|**Ficha Dados do Imóvel**|**Ficha Dados do Imóvel**|**Ficha Dados do Imóvel**|
|---|---|---|
||||
|**Campo**|**Mensagem para o declarante**|**Condição**|
||||
||||
|É imóvel público da<br>união?|Obrigatório informar É imóvel público<br>da união?|Quando o 'É imóvel<br>público da união?' não<br>for informada.|
||||
||||
|Município|Obrigatório informar O Município|Quando o 'Município' não<br>for informado.|
||||
||||
|UF|Obrigatório informar A UF|Quando a 'UF' não for<br>informada.|
||||
||||
|Inscrição Municipal|Obrigatório informar A Inscrição<br>Municipal|Quando o 'Inscrição<br>Municipal' não for<br>informada.|
||||
||||
|Área do Terreno(m2)|A Área do Terreno(m2) deve estar<br>preenchido quando A Área do lote não<br>consta nos documentos? não for<br>marcado|Quando a Área do<br>Terreno(m2) não for<br>informado e A Área do lote<br>não consta nos<br>documentos? não for<br>marcada|
||||
||||
|Área do lote não<br>consta nos<br>documentos?|A Área do lote não consta nos<br>documentos? deve estar preenchido<br>quando A Área do Terreno(m2) não for<br>preenchido|Quando a A Área do lote<br>não consta nos<br>documentos? não for<br>marcada e Área do<br>Terreno(m2) não for<br>informado .|
||||
||||
|Área Construída(m2)|A Área Construída(m2) deve estar<br>preenchido quando A Área Construída<br>não consta nos documentos? não for<br>marcado|Quando a A Área<br>Construída não consta nos<br>documentos? não for<br>marcada e Área<br>Construída(m2) não for<br>informado .|
||||
||||
|Área Construída(m2)<br>não consta nos<br>documentos?|A Área Construída não consta nos<br>documentos? deve estar preenchido<br>quando A Área Construída(m2) não for<br>preenchido|Quando a A Área<br>Construída não consta nos<br>documentos? não for<br>marcada e Área<br>Construída(m2) não for<br>informado .|
||||



**28** 

**==> picture [203 x 62] intentionally omitted <==**

**==> picture [87 x 62] intentionally omitted <==**

||||
|---|---|---|
|Tipo de Imóvel|Obrigatório informar O Tipo de Imóvel|Quando o Tipo de Imóvel<br>não for informado.|
||||
||||
|Tipo de Logradouro|Obrigatório informar O Tipo de<br>Logradouro|Quando o Tipo de<br>Logradouro não for<br>informado.|
||||
||||
|Nome de Logradouro|Obrigatório informar O Nome de<br>Logradouro|Quando o Nome de<br>Logradouro não for<br>informado.|
||||
||||
|Número Imóvel|Obrigatório informar O Número<br>Imóvel|Quando o Número Imóvel<br>não for informado.|
||||
||||
|Bairro|Obrigatório informar O Bairro|Quando o Bairro não for<br>informado.|
||||
||||
|CEP|Obrigatório informar O CEP|Quando o CEP não for<br>informado.|
||||
||||
|RIP|Obrigatório informar o RIP - Registro<br>Imobiliário Patrimônial|Quando o for marcado<br>com 'Sim' o campo É<br>imóvel público da união? o<br>RIP - Registro Imobiliário<br>Patrimônial deve ser<br>informado|
||||
||||
|CAT|Obrigatório informar a CAT - Certidão<br>de Autorização de Transferência|Quando o for marcado<br>com 'Sim' o campo É<br>imóvel público da união? a<br>CAT - Certidão de<br>Autorização de<br>Transferência deve ser<br>informado|
||||
||||
|Código Incra|Obrigatório informar O Código Incra|Quando o Código Incra não<br>for informado.|
||||
||||
|Denominação|Obrigatório informar A Denominação|Quando a Denominação<br>não for informada|
||||
||||
|Localização|Obrigatório informar A Localização|Quando a Localização não<br>for informada|
||||
||||
|Área Total|Obrigatório informar A Área Total(ha)|Quando a Área Total(ha)<br>não for informada|
||||



## **Fichas Adquirentes e Alienantes** 

**Campo Mensagem para o declarante Condição** 

**29** 

**==> picture [203 x 62] intentionally omitted <==**

**==> picture [87 x 62] intentionally omitted <==**

||||
|---|---|---|
|CPF/CNPJ|CPF/CNPJ deve estar preenchido<br>quando CPF/CNPJ Identificado? é<br>diferente de 'Não'|Quando o 'CPF/CNPJ' não<br>for informado e não for<br>marcado 'CPF/CNPJ não<br>identificado'.|
||||
||||
|CPF/CNPJ|Número do 'CPF/CNPJ' informado não<br>é válido.|Quando o 'CPF/CNPJ' for<br>inválido.|
||||
||||
|CPF/CNPJ|Número do CPF/CNPJ já informado.|Quando 'CPF/CNPJ' já<br>existe no conjunto de<br>CPF(s)/CNPJ(s).|
||||
||||
|CPF/CNPJ|'CPF/CNPJ' <CPF/CNPJ> informado em<br>duplicidade para partes distintas da<br>operação.Verifique se essa informação<br>está correta.*IMPORTANTE:esta<br>mensagem é só um aviso e não<br>impede a importação, nem a gravação<br>da declaração.|Quando um mesmo<br>CPF/CNPJ é informado em<br>partes distintas da<br>operação imobiliária.|
||||
||||
|Motivo da Não<br>Identificação do<br>CPF/CNPJ|Obrigatório informar o 'Motivo da Não<br>Identificação do CPF/CNPJ'.|Quando 'Motivo da Não<br>Identificação do CPF/CNPJ'<br>não for informado e<br>'CPF/CNPJ' não for<br>identificado'.|
||||
||||
|% de Participação|Obrigatório informar Percentual de<br>Participação na Operação|Quando o 'Percentual de<br>Participação na Operação'<br>não for informado e a<br>“N   C<br>D c       ”     f<br>marcada.|
||||
||||
|% de Participação|'Percentual de Participação na<br>Operação' informado com valor<br>inválido.|Quando o valor informado<br>para 'Percentual de<br>Participação na Operação'<br>for inválido.|
||||
||||
|% de Participação|A soma dos Percentuais de<br>Participação não pode ser menor que<br>100%.|Quando os percentuais de<br>participação de<br>intervenientes informados<br>tiver soma menor que<br>100%.|
||||
||||
|% de Participação|A soma dos Percentuais de<br>Participação está menor que 100%.|Quando a soma dos<br>percentuais de<br>participação de<br>intervenientes for menor<br>que 100%. e  as opções<br>'Não consta nos<br>Documentos' forem<br>marcadas.|
||||



**30** 

**==> picture [203 x 62] intentionally omitted <==**

**==> picture [87 x 62] intentionally omitted <==**

||||
|---|---|---|
|Escritura/Documento<br>assinado por<br>Representante/Assist<br>ente/Procurador?|Obrigatório informar 'Sim' ou 'Não'<br>para a pergunta Escritura/Documento<br>assinado por<br>Representante/Assistente/Procurador<br>?.|Quando não for informado<br>se ' Escritura/Documento<br>assinado por<br>Representante/Assistente/<br>Procurador?'.|
||||
||||
|CPF(s) do(s)<br>Representante(s)/Ass<br>istente(s)/Procurador<br>(es)|CPF(s) do(s)<br>'Representante(s)/Assistente(s)/Procur<br>ador(es)' não informado(s).|Quando não for informado<br>CPF(s) do(s)<br>Representante(s)/Assistent<br>e(s)/Procurador(es) e tiver<br>sido respondido 'Sim' para<br>pergunta<br>'Escritura/Documento<br>assinado por<br>Representante/<br>Assistente/ Procurador<br>identificado?'.|
||||
||||
|CPF(s) do(s)<br>Representante(s)/Ass<br>istente(s)/Procurador<br>(es)|CPF informado para<br>Representante/Assistente/Procurador<br>é inválido.|Quando algum CPF de<br>Representante/Assistente/<br>Procurador possui valor<br>inválido.|
||||
||||
|Possui Cônjuge?|Obrigatório informar 'Sim' ou 'Não'<br>para a pergunta Possui Cônjuge?.|Quando 'Possui Cônjuge?'<br>não for informado|
||||
||||
|Tem CPF?|Obrigatório informar 'Sim' ou 'Não'<br>para a pergunta Tem CPF?, pois a<br>pergunta Possui Cônjuge? foi marcada<br>com 'SIM'|Quando a pergunta Possui<br>Cônjuge? foi marcada com<br>'SIM' e  a pergunta Tem<br>CPF? não foi marcada.|
||||
||||
|CPF do Cônjuge|Obrigatório informar CPF do Cônjuge|Quando as<br>perguntas Possui Cônjuge?<br>e Tem CPF? foram<br>marcadas com 'SIM'.|
||||
||||
|O alienante é<br>estrangeiro?|Obrigatório informar 'Sim' ou 'Não'<br>para a pergunta O alienante é<br>estrangeiro?.|Quando 'O alienante é<br>estrangeiro?' não for<br>informado|
||||
||||
|O alienante é<br>espólio?|Obrigatório informar 'Sim' ou 'Não'<br>para a pergunta O alienante é<br>espólio?.|Quando 'O alienante é<br>espólio?'  não for<br>informado|
||||



*IMPORTANTE: a captura de tela abaixo demonstra uma situação em que ocorre a duplicidade para partes distintas da operação. 

**31** 

**==> picture [203 x 62] intentionally omitted <==**

**==> picture [87 x 62] intentionally omitted <==**

**==> picture [426 x 166] intentionally omitted <==**

Clicar em Ver Pendências. A mensagem com o ícone (em amarelo) é só um aviso e não impede nem a importação, nem a gravação da declaração para entrega. 

**==> picture [426 x 109] intentionally omitted <==**

3.4.4. Exemplos de inconsistências nos arquivos 

## _Rejeição do arquivo json por erro na estrutura_ 

A captura de tela abaixo demonstra um erro comum na estrutura do json. 

**==> picture [388 x 80] intentionally omitted <==**

O sistema exibe a seguinte mensagem: 

**==> picture [426 x 74] intentionally omitted <==**

O preenchimento deve ser efetuado de acordo com as instruções do schema: 

**==> picture [426 x 33] intentionally omitted <==**

**32** 

**==> picture [203 x 62] intentionally omitted <==**

**==> picture [87 x 62] intentionally omitted <==**

Preechimento correto: **4440.12** 

_Inaptidão em virtude do tipo de declaração informado_ 

**==> picture [426 x 103] intentionally omitted <==**

A captura de tela abaixo demonstra um erro comum na estrutura do json. 

**==> picture [426 x 106] intentionally omitted <==**

c     “    D c    c  ”                        ch    c           “ ” 

_Erro no preenchimento do campo_ 

**==> picture [348 x 110] intentionally omitted <==**

A captura de tela abaixo demonstra um erro comum na estrutura do json. 

**==> picture [426 x 101] intentionally omitted <==**

Preenchimento correto: **"motivoNaoIdentificacaoNi": "2",** 

**33** 

**==> picture [203 x 62] intentionally omitted <==**

**==> picture [87 x 62] intentionally omitted <==**

_Erro no campo CIB_ 

**==> picture [426 x 171] intentionally omitted <==**

A captura de tela abaixo demonstra um erro comum na estrutura do json. 

**==> picture [426 x 98] intentionally omitted <==**

## Preenchimento correto: **J7DNF01S (CIB calculado de acordo com a regra do tópico 4.** 

_Envio indevido do campo “valorOperacaoImobiliaria”_ 

Q                f          c     “indicadorNaoConstaValorOperacaoImobiliaria” f verdadeiro, não deve ser           f           c     “valorOperacaoImobiliaria” 

**==> picture [426 x 86] intentionally omitted <==**

A captura de tela abaixo demonstra um erro comum na estrutura do json. 

**==> picture [426 x 105] intentionally omitted <==**

**34** 

**==> picture [203 x 62] intentionally omitted <==**

**==> picture [87 x 62] intentionally omitted <==**

## **4. REGRA DE FORMAÇÃO E CÁLCULO DO DÍGITO VERIFICADOR DO CÓDIGO CIB** 

O Código CIB é composto por sete caracteres alfanuméricos acrescido de um dígito verificador (DV) também alfanumérico. O código utiliza a base 32 proposta por Douglas Crockford, com a exclusão dos caracteres I, i, L, l, O, o, U e u. 

A exclusão dos caracteres correspondentes às vogais “i”, “o” e “u” e à consoante “L” se justifica para evitar a confusão com os numerais 0 e 1 e para reduzir a ocorrência de palavras obscenas. 

Para decodificar (decode) são aceitas as letras maiúsculas ou minúsculas, a vogal “i” e a consoante “L” serão tratadas como numeral 1 e a vogal “o” será tratada como o numeral 0. Não será aceita a vogal “u” nem caracteres especiais na decodificação. No ato de codificar (encode), apenas as letras maiúsculas serão utilizadas. 

A conversão para o processo de decodificar e de codificar e o valor de cada caractere é o indicado na tabela a seguir: 

|Valor|0|1|2|3|3|4|4|5|5|6|6|7|
|---|---|---|---|---|---|---|---|---|---|---|---|---|
|Decode|0, O, o|1, I, i, L,<br>I|<br>2|3||4||5||6||7|
|Encode|0|1|2|3||4||5||6||7|
||||||||||||||
||||||||||||||
|Valor|8|9|10|11||12|||13||14|15|
|Decode|8|9|A a|B b||C c|||D d||E e|F f|
|Encode|8|9|A|B||C|||D||E|F|
||||||||||||||
|Valor|16|17|18|19||20||21|||22|23|
|Decode|G g|H h|J j|K k||M m||N n|||P p|Q q|
|Encode|G|H|J|K||M||N|||P|Q|
||||||||||||||
|Valor|24|25|26|27|28||29|||30||31|
|_Decode_|R r|S s|T t|V v|W w||X x|||Y y||Z z|
|_Encode_|R|S|T|V|W||X|||Y||Z|
||||||||||||||



O Código CIB terá uma máscara no formato AAAAAAA-D, sendo que o hífen tem a função apenas de particionar o código entre os caracteres originais e o dígito verificador. O hífen é ignorado durante o processo de decodificação. 

**35** 

**==> picture [203 x 62] intentionally omitted <==**

**==> picture [87 x 62] intentionally omitted <==**

O cálculo do dígito verificador será diferente a depender dos caracteres originais serem exclusivamente numéricos ou não. 

Cálculo do DV quando os caracteres originais são exclusivamente numéricos 

Neste caso, o cálculo do DV seguirá o mesmo algoritmo utilizado para o Nirf, segundo a regra do Módulo 11. Cada caractere é multiplicado pela sequência de fatores 8, 7, 6, 5, 4, 3 e 2, considerando a posição da esquerda para a direita. A soma dos produtos é dividida por 11 e o DV será a diferença entre 11 e o resto da divisão. Observa-se que, quando o resto da divisão for 0 ou 1, o DV calculado é 0. 

Cálculo do DV quando os caracteres originais não são exclusivamente numéricos 

Nesta situação, o cálculo do DV será efetuado da seguinte forma: 

1. Para cada caractere codificado, o seu valor, conforme a tabela acima, será multiplicado pela sequência de fatores 4, 3, 9, 5, 7, 1 e 8, considerando a posição da esquerda para a direita; 

2. A soma dos produtos será dividida por 31. O resto corresponderá ao valor do caractere que ocupará a posição do DV. 

Por exemplo, o cálculo do DV para o Código CIB com caracteres originais A3N8Z4F 

será: 

|será:||||||||
|---|---|---|---|---|---|---|---|
|Encode|A|3|N|8|Z|4|F|
|Valor|10|3|21|8|31|4|15|
|Fator|4|3|9|5|7|1|8|
|Produto|40|9|189|40|217|4|120|
|Soma dos Produtos||619|Resto da divisão da soma<br>dos produtos por 31||30|DV|Y|
|||||||||



Assim, o Código CIB será A3N8Z4F-Y. 

1. GLOSSÁRIO 

- **Conta gov.br:** mecanismo de acesso digital único do usuário aos serviços públicos com nível de segurança compatível com o grau de exigência, natureza e criticidade dos dados e das informações pertinentes ao serviço público solicitado. 

- **e-CAC:** canal de prestação de serviços digitais da Receita Federal do Brasil (RFB), disponível no portal único gov.br na internet, no endereço eletrônico https://www.gov.br/receitafederal. 

- **Identidade Digital Ouro:** aquela obtida por meio de cadastro validado em base de dados biométrica individualizada, de abrangência nacional, definida no inciso III do § 1º do art. 1º da Portaria SEDGGME nº 2.154, de 2021, ou em norma superveniente. 

**36** 

**==> picture [203 x 62] intentionally omitted <==**

**==> picture [87 x 62] intentionally omitted <==**

**Identidade Digital Prata:** aquela obtida por meio de cadastro com garantia de identidade mediante validador de acesso digital, nos termos do inciso II do § 1º do art. 1º da Portaria SEDGGME nº 2.154, de 23 de fevereiro de 2021. 

**Procuração digital:** a procuração emitida por meio do e-CAC, a qual permite ao titular da serventia extrajudicial outorgar poderes para que um terceiro, pessoa física ou jurídica, acesse o sistema DOI _online_ em seu nome. 

**37**
