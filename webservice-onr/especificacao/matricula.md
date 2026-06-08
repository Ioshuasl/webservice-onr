# WSOficio — Matrícula Online (VM)

> Extraído de [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) (seções 3.9).

---
## **3.9 Matrícula Online / Rel. VM** 

A ONR disponibiliza os serviços referentes à Matrícula Online através de web services contemplando as seguintes funcionalidades: 

A. Obter XML de solicitações de pedidos de matrículas 

Retorna um XML CDATA com um ou mais pedidos de matrículas. 

O contrato WSDL para homologação pode ser visualizado em: 

- https://hml3- wsoficio.onr.org.br/matriculaonline.asmx?wsdl 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

90 

## Métodos a serem referenciados: **ObterXMLSolicitacoes e ObterXMLSolicitacoesV2** . 

## **3.9.1 Envelope de Entrada - ObterXMLSolicitacoes** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string(50)); 

- Protocolo – Protocolo da solicitação de matrícula (tipo string); 

- Data Inicial – Data inicial da solicitação de matrícula a ser pesquisada (tipo string). 

- Data Final - Data final da solicitação de matrícula a ser pesquisada, com intervalo de 30 dias a partir da data inicial (tipo string). 

- ID Pedido – ID do pedido de matrícula (tipo string) 

## **3.9.2 Envelope de Saída - ObterXMLSolicitacoes** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string(200)); 

- XML da Matricula – Retorna o XML com uma ou mais matrículas solicitadas(tipo XML CDATA). 

<?xml version="1.0" encoding="UTF-16"?> 

<ROOT> 

<PEDIDO> 

<VISUALIZACAOMATRICULA> 

<NOMESOLICPED>DAIANE DOS SANTOS DA COSTA</NOMESOLICPED> 

<INSTITUICAOSOLICITANTE /> 

<ENDSOLICPED>Água Funda</ENDSOLICPED> 

<NUMENDSOLICPED></NUMENDSOLICPED> 

<COMPLENDSOLICPED /> 

<BAIRROSOLICPED></BAIRROSOLICPED> 

<CIDADESOLICPED> </CIDADESOLICPED> 

<ESTADOSOLICPED></ESTADOSOLICPED> 

<CEPSOLICPED></CEPSOLICPED> 

<FONESOLICPED></FONESOLICPED> 

<MAILSOLICPED> </MAILSOLICPED> 

<CPFCNPJSOLICPED></CPFCNPJSOLICPED> 

<INCRICAOSOLICPED></INCRICAOSOLICPED> 

<NUMSOLICITACAOPED> </NUMSOLICITACAOPED> 

<MATRICULASOLICITACAOPED></MATRICULASOLICITACAOPED> 

<DATAPED></DATAPED> 

<VLRRECPED></VLRRECPED> 

<TIPOCOBRANCA></TIPOCOBRANCA> 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

91 

<COD_ISENCAO /> 

</VISUALIZACAOMATRICULA> </PEDIDO> 

</ROOT> 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|12|O IDCartório informado é inválido.|
|13|Formato de data inválido, utilize o padrão AAAA-MM-<br>DD.|
|13|Você deve informar a DATA INICIAL, utilize o padrão<br>AAAA-MM-DD.|
|13|Você deve informar a DATA FINAL, utilize o padrão<br>AAAA-<br>MM-DD.|
|13|Você deve informar um intervalo de data menor ou<br>igual a<br>30 dias.|
|13|IDPedido inválido, utilize o padrão de número inteiro,<br>ex:<br>12345|
|14|Não foram encontrados resultados para o período<br>Informado.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|



## **3.9.3 Envelope de Entrada - ObterXMLSolicitacoesV2** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string(50)); 

- Protocolo – Protocolo da solicitação de matrícula (tipo string); 

- Data Inicial – Data inicial da solicitação de matrícula a ser pesquisada (tipo string). 

- Data Final - Data final da solicitação de matrícula a ser pesquisada, com intervalo de 30 dias a partir da data inicial (tipo string). 

- ID Pedido – ID do pedido de matrícula (tipo string) 

## **3.9.4 Envelope de Saída - ObterXMLSolicitacoesV2** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string(200)); 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

## 92 

- XML da Matricula – Retorna o XML com uma ou mais matrículas solicitadas(tipo XML CDATA). 

<?xml version="1.0" encoding="UTF-16"?> <ROOT> <PEDIDO> <VISUALIZACAOMATRICULA> <NOMESOLICPED>DAIANE DOS SANTOS DA COSTA</NOMESOLICPED> <INSTITUICAOSOLICITANTE /> <ENDSOLICPED>Água Funda</ENDSOLICPED> <NUMENDSOLICPED></NUMENDSOLICPED> <COMPLENDSOLICPED /> <BAIRROSOLICPED></BAIRROSOLICPED> <CIDADESOLICPED> </CIDADESOLICPED> <ESTADOSOLICPED></ESTADOSOLICPED> <CEPSOLICPED></CEPSOLICPED> <FONESOLICPED></FONESOLICPED> <MAILSOLICPED> </MAILSOLICPED> <CPFCNPJSOLICPED></CPFCNPJSOLICPED> <INCRICAOSOLICPED></INCRICAOSOLICPED> <NUMSOLICITACAOPED> </NUMSOLICITACAOPED> <MATRICULASOLICITACAOPED></MATRICULASOLICITACAOPED> <DATAPED></DATAPED> <VLRRECPED></VLRRECPED> <TIPOCOBRANCA></TIPOCOBRANCA> <COD_ISENCAO /> <FINALIDADE /> </VISUALIZACAOMATRICULA> </PEDIDO> </ROOT> 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|12|O IDCartório informado é inválido.|
|13|Formato de data inválido, utilize o padrão AAAA-MM-<br>DD.|
|13|Você deve informar a DATA INICIAL, utilize o padrão<br>AAAA-MM-DD.|
|13|Você deve informar a DATA FINAL, utilize o padrão<br>AAAA-<br>MM-DD.|
|13|Você deve informar um intervalo de data menor ou<br>igual a<br>30 dias.|
|13|IDPedido inválido, utilize o padrão de número inteiro,<br>ex:|



**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

93 

||12345|
|---|---|
|14|Não foram encontrados resultados para o período<br>Informado.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
