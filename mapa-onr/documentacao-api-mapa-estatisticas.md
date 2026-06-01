##### APRESENTAÇÃO

O presente documento tem como propósito descrever o funcionamento e a utilização da API de envio de dados de
registros de imóveis para o Mapa e Estatísticas.


Os dados, assim como enviados em formato JSON e as respostas também serão no formato JSON.



2 |


|1.|Processo para Envio para o Mapa e Estatísticas …………………………………………………………………………|Col3|4|
|---|---|---|---|
|**2.**|**Geração de chave para API do Mapa e Estatísticas ………………………………………………………………. …..**|**Geração de chave para API do Mapa e Estatísticas ………………………………………………………………. …..**|**  6**|
|**3.**|**Rota da API ………………………………………………………………………………………………………………………….**|**Rota da API ………………………………………………………………………………………………………………………….**|**  7**|
||3.1.|Autenticação ……………………………………………………………………………………………………………………………………………………|7|
||3.2.|Envio  de  dados ……………………………………………………………………………………………………………………………………………..|8|
||3.3.|Retorno …………………………………………………………………………………………………………………………………………………………….|8|
|**4.**|**Envio para o Mapa e Estatísticas ……………………………………………………………………………………………..**|**Envio para o Mapa e Estatísticas ……………………………………………………………………………………………..**|**10**|
||**4.1.**|**Envio  de  dados……………………………………………………………………………………………………………..**|**10**|
|||4.1.1.<br>Envio DOI JSON……………………………………………………………………………………………………………………………………….|10|
|||4.1.2.<br>Envio DOIWEB JSON……………………………………………………………………………………………………………………………….|13|
||**4.2.**|**Retorno………………………………………………………………………………………………………………………….**|**17**|
|**5.**|**Consulta de Processamento do Arquivo Enviado…………………………………………………………………………**|**Consulta de Processamento do Arquivo Enviado…………………………………………………………………………**|**20**|
||5.1.|Envio de dados …………………………………………………………………………………………………………………………………………………|20|
||5.2.|Retorno………………………………………………………………………………………………………………………………………………………………|20|
|**6.**|**Validações …………………………………………………………………………………………………………………………….**|**Validações …………………………………………………………………………………………………………………………….**|**23**|
||**6.1.**|**DOI JSON……………………………………………………………………………………………………………………….**|**23**|
|||6.1.1.<br>Dados da Operação………………………………………………………………………………………………………………………………….|24|
|||6.1.2.<br>Dados da Alienante………………………………………………………………………………………………………………………………….|26|
|||6.1.3.<br>Dados da Adquirente……………………………………………………………………………………………………………………………….|26|
||**6.2.**|**DOIWEB JSON…………………………………………………………………………………………………………………**|**27**|
|||6.2.1.<br>Dados Iniciais…………………………………………………………………………………………………………………………………………..|27|
|||6.2.2.<br>Operações Imobiliárias…………………………………………………………………………………………………………………………….|29|
|||6.2.3.<br>Dados do Imóvel………………………………………………………………………………………………………………………………………|31|
|||6.2.4.<br>Alienantes…………………………………………………………………………………………………………………………………………………|33|
|||6.2.5.<br>Adquirentes………………………………………………………………………………………………………………………………………………|35|



3 |


4 |


5 |


##### 2. GERAÇÃO DE CHAVE PARA API DO MAPA E ESTATÍSTICAS

Para que a autenticação na API seja realizada, é necessário gerar a **chave única** através do módulo “ **Configurações**

**> Chave API Estatísticas** ” do INTRANET **[https://mapa.onr.org.br/intranet](https://mapa.onr.org.br/intranet)** .


Ao clicar no botão “ **Gerar Chave** ”, irá abrir a caixa de diálogo abaixo:


Ao clicar no botão “ **Estou ciente** ”, será realizada a geração de uma nova chave e, automaticamente, será inativada a
chave anterior.



6 |


No campo chave, será exibida a chave vigente. Para copiá-la, basta clicar no botão “ **Copiar Chave** ”.

##### 3. ROTAS DA API


Logo abaixo, seguem as rotas a serem utilizadas para autenticação e envio do arquivo para o Mapa e Estatísticas:

###### 3.1. ROTAS DA API


      - Ambiente de Homologação: **Em preparação**


      - Ambiente de Produção: **[https://mapa.onr.org.br/api-estatisticas/auth](https://mapa.onr.org.br/api-estatisticas/auth)**



7 |


###### 3.2 ENVIO DE DADOS

Para realizar a autenticação, deve ser enviado um JSON contendo cns|cpf em Base64, via método POST:


1. CNS = 999999
2. CPF = 94683200066
3. cns_cpf = base64(999999|94683200066) = OTk5OTk5fDk0NjgzMjAwMDY2


JSON a ser enviado para gerar o Token:

###### 3.3 RETORNOS


Caso o método da requisição não seja POST, será retornado o JSON abaixo, com o status **code 405** :


Caso o JSON enviado esteja inválido, será retornado o JSON abaixo, com o status **code 400** :



8 |


Caso o parâmetro **cns_cpf** não seja informado, será retornado o JSON abaixo, com o status **code 403** :


Caso o parâmetro **cns_cpf** esteja inválido, será retornado o JSON abaixo, com o status **code 400** :


Caso o usuário contido no parâmetro **cns_cpf** não possua permissão para utilizar a API, será retornado
   - JSON abaixo, com o status **code 401** :


Caso o usuário não tenha gerado a chave de autenticação no intranet, será retornado o JSON abaixo,
com o status **code 406** :



9 |


Caso haja um Token gerado, porém ainda não utilizado, será retornado o JSON abaixo, com o status **code 200** :


Caso não haja um Token gerado, e seja gerado um novo Token, será retornado o JSON abaixo, com o status **code 201** :


Caso seja realizada uma requisição para gerar o Token, e já exista um Token válido que ainda não tenha sido utilizado,
será retornado o token antigo, caso contrário será gerado um novo token.

##### 4. ENVIO PARA O MAPA E ESTATÍSTICAS


     - Ambiente de Homologação: Em preparação

     - Ambiente de Produção: **[https://mapa.onr.org.br/api-estatisticas/enviar-arquivo](https://mapa.onr.org.br/api-estatisticas/enviar-arquivo)**

###### 4.1 ENVIO DE DADOS 4.1.1 ENVIO DOI JSON


Para realizar o envio para o Mapa e Estatísticas, deve ser enviado o Hash de Autenticação com os dados para o Mapa e
Estatísticas no formato JSON, via método POST, conforme abaixo:



10
|


No JSON enviado, pode conter no máximo 1.000 extratos. Caso seja ultrapassada essa quantidade, o arquivo será marcado
como erro e não será importado.


{

"hash": "93104779dfbe834853c7a2146f5b5cb7821e8340",
"dataEnvio": "15\/10\/2019",
"sequencial": "0001",
"extratos": [


{

"cns": "999992",
"operacao":{

"numero_controle": "0",
"data_lavratura": "01\/01\/2018",
"livro": "2",


"folha": "12",
"matricula": "63767",
"registro": "1",
"situacao": "0",
"atribuicao_doi": "2",
"tipo_transacao": "11",
"descricao_tipo_transacao": "Outros",
"retificacao_ato": "0",
"data_alienacao": "29\/09\/2017",
"forma_alienacao_aquisicao": "5",


"valor_nao_consta_documentos": "0",
"valor_alienacao_aquisicao": "103790,00",
"base_calculo_itbi": "124740,00",
"tipo_imovel": "17",
"descricao_tipo_imovel": "Outros",
"situacao_construcao": "0",


"localizacao": "1",
"area_nao_consta": "1",
"area_imovel": "0",
"endereco_imovel": "AVENIDA MARIAT ERESA",
"numero_imovel": "260",
"complemento_imovel": "SL5 10",
"bairro_imovel": "CAMPO GRANDE",
"cep_imovel": "20000000",
"municipio_imovel": "RIO DE JANEIRO",

11 |


"uf_imovel": "RJ",


"inscricao_nirf": "32385171",
"valor_itbi_nao_consta_nos_documentos": "0"
},
"alienantes":[
{

"cpf_cnpj": "73155455063",
"participacao_na_operacao": "100,00",
"cpf_procurador": "19801776005"
}
],
"adquirentes":[
{

"cpf_cnpj": "76596482090",
"participacao_na_operacao": "50,00",
"cpf_procurador": "19801776005"
},
{

"cpf_cnpj": "01107774098",
"participacao_na_operacao": "50,00",
"cpf_procurador": "19801776005"
}
]
}
]
}


Para gerar o Hash, deve ser criptografado o Token + a chave única. Segue exemplo abaixo:


$token = "$2y$12$tgbYuxTNM7BTJ9Oxs5sEuFCWdrjPb3bQjtEBi6rxJgje";


$chave = "$1$Jiyopnge$VaPfrXXuVIYIR4w6tDl";
$hash= sha1($token.$chave);


Sendo assim, fica como responsabilidade da aplicação que irá consumir a API, gerar o Hash.



12 |


###### 4.1.2 ENVIO DOIWEB

Para realizar o envio para o Mapa e Estatísticas, deve ser enviado o Hash de Autenticação com os dados para o Mapa e
Estatísticas no formato JSON, via método POST, conforme abaixo:


{


"hash": "93104779dfbe834853c7a2146f5b5cb7821e8340",


"declaracoes": [


{


"adquirentes": [


{


"cpfConjuge": "00000000000",


"cpfInventariante": "00000000000",


"indicadorConjuge": false,


"indicadorConjugeParticipa": false,


"indicadorCpfConjugeIdentificado": false,


"indicadorEspolio": false,


"indicadorEstrangeiro": false,


"indicadorNaoConstaParticipacaoOperacao": false,


"indicadorNiIdentificado": false,


"indicadorRepresentante": false,


"motivoNaoIdentificacaoNi": 0,


"ni": "",


"nome": "Nome da parte",


"nomeConjuge": "",


"nomeInventariante": "",


"participacao": 100,


"regimeBens": "1",



13 |


"representantes": [


{


"ni": "",


"nome": ""


}


]


}


],


"alienantes": [


{


"cpfConjuge": "00000000000",


"cpfInventariante": "00000000000",


"indicadorConjuge": false,


"indicadorConjugeParticipa": false,


"indicadorCpfConjugeIdentificado": false,


"indicadorEspolio": false,


"indicadorEstrangeiro": false,


"indicadorNaoConstaParticipacaoOperacao": false,


"indicadorNiIdentificado": false,


"indicadorRepresentante": false,


"motivoNaoIdentificacaoNi": 0,


"ni": "",


"nome": "Nome da parte",


"nomeConjuge": "",


"nomeInventariante": "",


"participacao": 100,


"regimeBens": "1",



14 |


"representantes": [


{


"ni": "",


"nome": ""


}


]


}


],


"areaConstruida": 0,


"areaImovel": 0,


"bairro": "",


"cep": "00000000",


"certidaoAutorizacaoTransferencia": "",


"cib": "0",


"codigoIbge": "",


"codigoIncra": "",


"codigoNacionalMatricula": "",


"complementoEndereco": "",


"complementoNumeroImovel": "",


"dataLavraturaRegistroAverbacao": "0000-00-00",


"dataNegocioJuridico": "0000-00-00",


"denominacao": "",


"descricaoOutrasOperacoesImobiliarias": "",


"destinacao": "1",


"existeDoiAnterior": false,


"folha": "0",


"formaPagamento": "5",


"indicadorAlienacaoFiduciaria": false,



15
|


"indicadorAreaConstruidaNaoConsta": false,


"indicadorAreaLoteNaoConsta": false,


"indicadorImovelImportado": false,


"indicadorImovelPublicoUniao": false,


"indicadorNaoConstaValorBaseCalculoItbiItcmd": false,


"indicadorNaoConstaValorOperacaoImobiliaria": false,


"indicadorPagamentoDinheiro": false,


"indicadorPermutaBens": true,


"inscricaoMunicipal": "123456",


"localizacao": "distrito",


"matricula": "",


"matriculaNotarialEletronica": "",


"mesAnoUltimaParcela": "",


"motivoCancelamento": "",


"municipiosUF": [


"0000000"


],


"naturezaTitulo": "1",


"nomeLogradouro": "",


"numeroImovel": "",


"numeroLivro": "",


"numeroReciboDeclaracaoRetificada": 0,


"numeroRegistro": "",


"numeroRegistroAverbacao": "",


"registroImobiliarioPatrimonial": "",


"retificacaoAto": false,



16
|


"tipoAto": "1",


"tipoDeclaracao": "0",


"tipoImovel": "67",


"tipoLivro": "1",


"tipoLogradouro": "Rua",


"tipoOperacaoImobiliaria": "11",


"tipoParteTransacionada": "1",


"tipoServico": "2",


"transcricao": 0,


"valorBaseCalculoItbiItcmd": 0.00,


"valorOperacaoImobiliaria": 0.00,


"valorPagoAteDataAto": 0.00,


"valorPagoMoedaCorrenteDataAto": 0.00,


"valorParteTransacionada": 100.0


}


]


}

###### 4.2 RETORNOS


Caso o método da requisição não seja POST, será retornado o JSO abaixo, com status **code 405** :



17
|


Caso o JSON enviado esteja inválido, será retornado o JSON abaixo, com status **code 400** :


Caso o parâmetro **Hash** não seja informado, será retornado o JSON abaixo, com status **code 403** :


Caso seja realizada uma requisição de envio para o Mapa e Estatísticas com o Hash inválido, irá ocorrer o retorno abaixo
com o status **code 400** :



18
|


Caso seja realizada uma requisição de envio para o Mapa e Estatísticas com o Hash já vencido ou já utilizado, irá
ocorrer o retorno abaixo, com o status **code 401** :


Caso ocorra algum erro no servidor durante o envio do arquivo para o Mapa e Estatísticas, irá ocorrer o retorno abaixo,
com o status **code 500** :


Caso seja realizada uma requisição válida com o retorno de sucesso, irá ocorrer o retorno abaixo, com o status **code 201** :


19
|


###### 5.2 RETORNOS

Caso o método da requisição não seja GET, será retornado o JSON abaixo, com status **code 405** :



20 |


Caso o UUID enviado esteja inválido, será retornado o JSON abaixo, com status **code 400** :


Caso seja realizada uma requisição válida com o retorno de sucesso, irá ocorrer o retorno abaixo, com o status **code 200** :


**{**


**"dados_arquivo": {**


**"arquivo_uuid": "7243603176025dd18091c9.83878922",**


**"arquivo_data_envio": "15/10/2019 15:54:43",**


**"arquivo_status_envio": "OK",**


**"arquivo_status_processamento": "OK",**


**"descricao_erro": "",**


**"arquivo_nome_original": "JSON_API",**


**"arquivo_nome_salvo":**


**"999992_sinter_estatistica_json_20191015_155443_c3b30c31bac9905a3f93e76ad2d477c39e0497ef.json",**


**"arquivo_tamanho": "2.11 KB",**


**"arquivo_inconsistencias": "Registro(s) com inconsistência(s):1ª operação. Campo data da lavratura",**


**"cartorio_nome": "Nome do Cartório",**


**"cartorio_comarca": "Ilhéus",**


**"cartorio_estado": "Bahia",**


**"cartorio_cns": "999992",**


**"cartorio_ddd_telefone": "12",**


**"cartorio_telefone": "3900-1111",**


**"cartorio_email_principal": "teste@webcartorios.com.br",**


**"usuario_nome": "Nome de usuário"**


**},**


**"status": "200"**


**}**


21 |


Caso seja realizada uma requisição válida, e o status de envio seja de ERRO, irá ocorrer o retorno abaixo,
com o status **code 200** .


Nesse caso, também será exibida a **descrição do ERRO**, conforme abaixo:


{


"dados_arquivo": {


"arquivo_uuid": "2084421673835de90b297b5915.13417688",


"arquivo_data_envio": "05/12/2019 11:50:33",


"arquivo_status_envio": "OK",


"arquivo_status_processamento": "ERRO",


"descricao_erro": "Erro na validação do arquivo


157776_sinter__estatistica_json_20191205_115033_28002309e6103e ced360d0cbca0d84a02274b904.json. Erro, o arquivo


enviado possui dados de um lote já enviado, os campos duplicados foram: CNS, Sequencial e Data Envio",


"arquivo_nome_original": "JSON_API",


"arquivo_nome_salvo":


"157776_sinter__estatistica_json_20191205_115033_28002309e6103eced360d0cbca0d84a02274b904.json",


"arquivo_tamanho": "2.1 KB",


"arquivo_inconsistencias": "",


"cartorio_nome": "Nome do Cartório",


"cartorio_comarca": "Ilhéus",


"cartorio_estado": "Bahia",


"cartorio_cns": "999992",


"cartorio_ddd_telefone": "12",


"cartorio_telefone": "3900-1111",


"cartorio_email_principal": "teste@webcartorios.com.br",


"usuario_nome": "Nome de usuário"


},


"status": "200"


}



22 |


Caso ocorra um **ERRO crítico** durante o processamento do arquivo, irá ocorrer o retorno abaixo:


{


"dados_arquivo": {


"arquivo_uuid": "2084421673835de90b297b5915.13417688",


"arquivo_data_envio": "05/12/2019 11:50:33",


"arquivo_status_envio": "OK",


"arquivo_status_processamento": "ERRO",


"descricao_erro": "Erro crítico, entrar em contato com o Suporte Técnico.",


"arquivo_nome_original": "JSON_API",


"arquivo_nome_salvo": "157776_sinter__estatistica_json_20191205_115033_28002309e6103eced360d0cbca0d84a02274b904.json",


"arquivo_tamanho": "2.1 KB",


"arquivo_inconsistencias": "",


"cartorio_nome": "Nome do Cartório",


"cartorio_comarca": "Ilhéus",


"cartorio_estado": "Bahia",


"cartorio_cns": "999992",


"cartorio_ddd_telefone": "12",


"cartorio_telefone": "3900-1111",


"cartorio_email_principal": "teste@webcartorios.com.br",


"usuario_nome": "Nome de usuário"


},


"status": "200"


}

##### 6. VALIDAÇÕES

###### 6.1 DOI JSON


Segue abaixo os campos de Dados da Operação, Dados da Alienante e Dados da Adquirente, informando o tamanho
de cada campo e as validações realizadas.



23 |


###### 6.1.1 Dados da Operação



24 |


25 |


###### 6.1.2 DADOS DO ALIENANTE

Segue abaixo todos os campos da chave “ **alienantes** ” informando o tamanho de cada campo e as validações realizadas.


**A chave alienante deve ser informada, mesmo que com seu conteúdo vazio, para a validação do registro.**

###### 6.1.3  DADOS DO ADQUIRENTE


Segue abaixo todos os campos da chave “ **adquirentes** ” informando o tamanho de cada campo e as validações realizadas:


**A chave adquirente deve ser informada, mesmo que com seu conteúdo vazio, para a validação do registro.**



26 |


###### 6.2 DOIWEB JSON 6.2.1 Dados Iniciais



27 |


28 |


###### 6.2.2 Operações Imobiliárias



29 |


30 |


###### 6.2.3 Dados do Imóvel



31 |


32 |


###### 6.2.4 Alienantes

Segue abaixo todos os campos da chave “ **alienantes** ” informando o tamanho de cada campo e as validações realizadas.


**A chave alienante deve ser informada, mesmo que com seu conteúdo vazio, para a validação do registro.**



33 |


34 |


###### 6.2.5 Adquirentes

Segue abaixo todos os campos da chave “ **adquirentes** ” informando o tamanho de cada campo e as validações realizadas:


**A chave adquirente deve ser informada, mesmo que com seu conteúdo vazio, para a validação do registro.**


35 |


36 |


37 |


##### CEDIDO POR:



38 |


## DÚVIDAS?











39 |
