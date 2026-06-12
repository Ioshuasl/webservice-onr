## Respostas do Servico 

Estimated reading: 7 minutes : 48 views 

## Atributos da Resposta 

> Atributo Descricao 

> nome arguivo Nome do arquivo no processamento datahora Data e hora do processamento no WebService dataoperacao Data do movimento considerada pelo sistema da CRA codigo Codigo da mensagem ocorrencia Descricao da mensagem registro Linha do registro do arquivo com erro total registros Total de registros que foram processados com sucesso 

## Exemplos de Respostas 

## Envio de Remessa 

## Sucesso 

> <!--?xml version="1.o" ou=uoTep ~~es~~ T- ~~68~~ 8-sI=buTpoou Copiar <relatorio> <nome arquivo>B9901308.121</nome arquivo> <comarca codmun="3550308"> 

--- end of page.page_number=1 ---

<datahora>201208131020</datahora> 

## />8> 

<codigo>0000</codigo> 

<total registros>lo</total registros> 

</comarca> 

</relatorio> 

## Excecao (Recusa Parcial) 

Como um arquivo de remessa pode conter titulos para varias comarcas, o servico de upload pode recusar uma remessa parcialmente ou completamente. 

<!--?xml version="1.0" encoding="IsO ~~-8~~ 85 ~~9-~~ 1" standalone="no" ?- 

Copiar 

<relatorio> 

<nome arquivo>B9901308.121</nome arquivo> 

<comarca codmun="3550308"> 

<datahora>201208131020</datahora> 

<codigo>0000</codigo> 

<total registros>lo</total registros> 

</comarca> 

<comarca codmun="3509502"> 

<datahora>201208101020</datahora> 

<dataoperacao>20120814</dataoperacao> 

<registro>l0</registro> 

<codigo>1217</codigo> 

<OCOrrenCia>APRESENTANTE NAO AUTORIZADO A ENVIAR TiTULOS 

> PARA MUNICiPIO (3509502 ~~-~~ PIRACURUCA)</oCorrenia> 

<total registros>o</total registros> 

</comarca> 

</relatorio> 

## Excecao (Recusa Completa) 

> <!--?xml version="1.o" eencoding="IS ~~O~~ -885 ~~9~~ -1"standalone="no"?<relatorio> 

Copiar 

<nome arquivo>B9901008.121</nome arquivo> 

<comarca codmun="3550308"> 

--- end of page.page_number=2 ---

<datahora>201804181559</datahora> 

<total registros>o</total registros> 

</comarca> 

<comarca codmun="3509502"> 

<datahora>201208101020</datahora> 

<registro>l0</registro> 

<codigo>1217</codigo> 

SER 

NUMERICO</ocorrencia> 

<total registros>o</total registros> 

</comarca> 

</relatorio> 

## Erro no Arguivo 

<!--?xml version="1.0" encoding="IsO ~~-8~~ 859 ~~-1~~ " standalone="no"?-- 

Copiar 

<relatorio> 

<nome arquivo> B9901008.12l</nome arquivo> 

<codigo>100l</codigo> 

</relatorio> 

## Erro no Codigo de Barras 

<!--?xml version="1.0" encoding="IsO ~~-8~~ 85 ~~9-1~~ " standalone="no"?-<ｒelatoｒio> 

Copiar 

<nome arquivo>BG132205.251</nome arquivo> 

<comarca CodMun="4300307"> 

<datahora>202505221733</datahora> 

<dataoperacao>20250522</dataoperacao> 

<total registros>0</total registros> 

<codigo>1309</codigo> 

## INVALIDA</ocorrencia> 

</comarca> 

</relatorio> 

--- end of page.page_number=3 ---

Envio de Imagem 

## Envio de Remessa com Imagem 

**==> picture [450 x 673] intentionally omitted <==**

**----- Start of picture text -----**<br>
Esse modo de mensagem é ativado por parametro interno do sistema devido ao<br>impacto no tempo da resposta. A mensagem considera as imagens no registro do<br>primeiro devedor.<br>Copiar<br><relatorio><br><nome arquivo>B9991001.186</nome arquivo><br><comarca codmun="2200202"><br><datahora>201901101714</datahora><br><dataoperacao>20190110</dataoperacao><br><total registros>lo</total registros><br><titulos><br><tｉｔulo><br><nome devedor>SR. AARON CoRTS</nome devedor><br><documento devedor>28891000141</documento devedor><br><saldo>692.91</saldo><br><un />68un ><br><imagem>Corrompida</imagem><br></titulo><br><titulo><br><nome devedor>RICARDO CALDEIRA</nome devedor><br><documento devedor>06572000199</documento devedor><br><saldo>60.23</saldo><br><nosso numero>426048244534158</nosso numero><br><imagem>Sem imagem</imagem><br></titulo><br><titulo><br><nome deVedor>DR. ZIRALDO PACHECO COLAO<br>FILHO</nome devedor><br><documento devedor>37015000185</documento devedor><br><saldo>766.11</saldo><br><n />９un ><br><imagem>Gravada</imagem><br></titulo><br>**----- End of picture text -----**<br>


--- end of page.page_number=4 ---

</titulos> 

<codigo>0000</codigo> 

<ocorrencia>REGIsTROS OK</ocorrencia> 

</comarca> 

</relatorio> 

## Envio de lmagem do Titulo Apos Remessa 

> <!--?xml version="1.o" e-o=oT ~~ps~~ - ~~6~~ 88-os=tpo Copiar 

<remessas> 

<remessa> <seguencial>33</sequencial> 

<titulos> 

<titulo> <documento devedor>39346889187</documento devedor> <nosso numero>2087753600052</noss0 numero> <numero titulo>l412650</numero titulo> <saldo>2442.86</saldo> <mensagem> <codigo>2196</codigo> <descricao>Titulo nao encontrado.</descricao> </mensagem> </titulo> </titulos> /remessa> </remessas> 

## Desistencia/Cancelamento/Autorizacao 

## Envio com Sucesso 

Copiar <!--?xml version="1.0" encoding="IS ~~0-~~ 885 ~~9~~ -1standalone="no" <relatorio> 

<nome arquivo>DP9901308.121</nome arquivo> <titulo> <datahora>201208101020</datahora> 

--- end of page.page_number=5 ---

<numero titulo>00345468</numero titulo> 

<numero protocolo>1234</numero protocolo> 

<data protocolo>13082012</data protocolo> 

<codigo>0000</codigo> 

<ocorrencia> SOLICITACAO RECEBIDA COM SUCESSO </ocorrencia> 

</titulo> 

</relatorio> 

## Envio com Erro 

> <!--?xml version="1.0" ou=oTs- ~~6~~ 88 ~~-~~ osI=butpou <ｒelatoｒiｏ> 

Copiar 

<nome arquivo>DP9901008.121</nome arquivo> 

<titulo> 

<datahora>201208101020</datahora> 

<numero cartorio>ol</numero cartorio> <numero titulo>003454689</numero titulo> 

<numero_protocolo>12345</numero_protocolo> 

<data protocolo>14082012</data protocolo> <codigo>2007</codigo> 

(DDMMAAAA) 

INVALIDA</ocorrencia> 

</titulo> 

</relatorio> 

## Downloads (Confirmacao e Retorno) 

## Download de Confirmacao 

<!--?xml version="1.0"encoding="IsO ~~-8~~ 85 ~~9-~~ 1" standalone="no"?- 

Copiar 

<relatorio> 

<nome arquivo>C9901308.111</nome arquivo> 

<datahora>201208131430</datahora> 

<codigo>0002</codigo> 

</relatorio> 

--- end of page.page_number=6 ---

## Download de Retorno 

<!--?xml version="l.o" encoding="I ~~s0~~ -88 ~~5~~ 9-1standalone="no" Copiar <relatorio> <nome arquivo>R9901508.121</nome arquivo> <datahora>201208151509</datahora> <codigo>0003</codigo> <ocorrencia>NAO HA REGISTROS DE RETORNO NESTA DATA</ocorrencia> </relatorio> 

Consulta de Titulo 

## Quando o titulo nao forencontrado 

**==> picture [434 x 68] intentionally omitted <==**

**----- Start of picture text -----**<br>
Copiar<br><!--?xml version="1.0" encoding="Iso -8 85 9- 1"standalone="no"?--<br><consulta><br><data consulta>30/09/2016</data consulta><br></consulta><br>**----- End of picture text -----**<br>


## Artigos 

Lista de mensagens 

--- end of page.page_number=7 ---
