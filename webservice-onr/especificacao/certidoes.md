# WSOficio — Certidões a Emitir

> Extraído de [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) (seções 3.6).

---
## **3.6 Certidões a Emitir** 

O ONR disponibiliza os serviços referentes à emissão de certidões através de web services contemplando as seguintes funcionalidades: 

- A. Consulta de solicitações 

Recupera a lista de pedidos baseada em filtros equivalente aos encontrados no módulo "Certidões a Emitir / Exportar", do Ofíco Eletrônico. 

- B. Devolução 

Responde uma solicitação com status "Devolvido" 

- C. Envio de anexo 

Anexa arquivos ao protocolo informado. 

- D. Finalização 

Modifica o status de uma solicitação para "Respondido", após ao menos um arquivo ter sido anexado. 

- E. Informação de Custas 

Permite que o cartório informe as custas do pedido. 

- O contrato WSDL para homologação pode ser visualizado em: https://hml3- wsoficio.onr.org.br/Certidoes.asmx?wsdl 

## **3.6.1 Envelope de Saída - ObterXMLSolicitacoes_v4** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string). 

- Protocolo - Filtro opcional para um protocolo específico (tipo string) 

- Solicitante - Filtro opcional para o nome do solicitante (tipo string) 

- TipoCertidao - Filtro opcional para o tipo de certidão, baseado na seguinte tabela: 

- 1 – POSITIVA/NEGATIVA DE PROPRIEDADE 

- 2 – VINTENÁRIA 

- 3 – MATRÍCULA – INTEIRO TEOR 

- 4 – TRANSCRIÇÃO 

- 5 – PACTO ANTENUPCIAL 

- 6 – ÔNUS E ALIENAÇÕES 

- 7 – DOCUMENTO ARQUIVADO 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

75 

- 8 – CONVENÇÃO DE CONDOMÍNIO 

- 9 – LIVRO3 – GARANTIAS 

- 10 – OUTROS REGISTROS LIVRO3 – AUXILIAR 

- 11 – OUTRAS CERTIDÕES 

- 12 – INTEIRO TEOR, ÔNUS E AÇÕES 

- 13 – POR QUESITO 

- 14 – NEGATIVA DE PENHOR 

- 15 – ÔNUS REAIS E AÇÕES REIPERSECUTÓRIAS 

- 16 – USUCAPIÃO 

- 17 – PROPRIEDADE, ÔNUS E ALIENAÇÕES 

- 18 – CADEIA DOMINIAL (FILIAÇÃO ATÉ ORIGEM) 

- 19 – AÇÕES REIPERSECUTÓRIAS 

- 20 – ÔNUS REAIS 

- 21 – CERTIDÃO DA SITUAÇÃO JURÍDICA ATUALIZADA DO IMÓVEL 

- 22 – CERTIDÃO AGRONEGÓCIO 

- PedidoPor - Filtro opcional para o tipo de pesquisa, baseado na seguinte tabela: 

- 1 – ENDEREÇO RUA 

- 2 – ENDEREÇO EDIFÍCIO 

- 3 – ENDEREÇO LOTEAMENTO 

- 4 – MATRÍCULA 

- 5 – TRANSCRIÇÃO 

- 6 – PESSOA 

- 7 – REGISTRO 

- 8 – PACTUANTES 

- 9 – ENDEREÇO 

- 10 – Nº DO PROTOCOLO 

- 11 – N° DO REGISTRO DO LIVRO 3 

- 12 – NOME DO CONDOMÍNIO 

- 13 – PARA FINS DE USUCAPIÃO 

- 14 – NEGATIVA DE PROPRIEDADE 

- 15 – BUSCA DE GARANTIAS 

- Status - Filtro opcional baseado na seguinte tabela: 

   - 1 - Em Aberto 

   - 2 - Processando 

   - 3 - Respondido 

   - 10 - Informar Valor dos Emolumentos 

   - 11 - Aguardando Pagamento 

   - 12 – Cancelado 

   - 13 – Pendente de Resposta 

   - 23 – Cancelado pelo Solicitante 

- TipoResposta - Filtro opcional, somente aplicável quando o filtro "Status = 3 (Respondido)". Baseia-se na seguinte tabela: 

   - "" (vazio) - Todos os respondidos 

   - "D" - Somente os respondidos com devolução (devolvidos). 

   - "C" - Somente respondidos com certidão. 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

76 

- DataPedidoDe - Filtro opcional no formato: aaaa-mm-dd (tipo string), com a data inicial do período de solicitações 

- DataPedidoAte - Filtro opcional no formato: aaaa-mm-dd (tipo string), com a data final do período de solicitações 

- DataConferenciaDe - Filtro opcional no formato: aaaa-mm-dd (tipo string), com a data inicial do período de respostas 

- DataConferenciaAte - Filtro opcional no formato: aaaa-mm-dd (tipo string), com a data final do período de respostas 

## Observação 

Para os filtros não desejados, basta deixar o campo sem preenchimento. Para por exemplo uma filtragem de todos os pedidos solicitados no dia 2021-04-19, o envelope ficaria equivalente a: 

```
<soapenv:Envelopexmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
xmlns:wsof="http://tempuri.org/WSOficio">
<soapenv:Header/>
<soapenv:Body>
<wsof:ObterXMLSolicitacoes_v4>
<wsof:oRequest>
<wsof:Hash>...Hash obtido na autenticação ...</wsof:Hash>
<wsof:Protocolo></wsof:Protocolo>
<wsof:Solicitante></wsof:Solicitante>
<wsof:TipoCertidao></wsof:TipoCertidao>
<wsof:PesquisaPor></wsof:PesquisaPor>
<wsof:Status></wsof:Status>
<wsof:TipoResposta></wsof:TipoResposta>
<wsof:DataPedidoDe>2021-04-19</wsof:DataPedidoDe>
<wsof:DataPedidoAte>2021-04-19</wsof:DataPedidoAte>
<wsof:DataConferenciaDe></wsof:DataConferenciaDe>
<wsof:DataConferenciaAte></wsof:DataConferenciaAte>
</wsof:oRequest>
</wsof:ObterXMLSolicitacoes_v4>
</soapenv:Body>
</soapenv:Envelope>
```

## **3.6.2 Envelope de Saída - ObterXMLSolicitacoes_v4** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string); 

- XML - (se RETORNO = true), irá conter uma string com todo conteúdo XML equivalente ao obtido na opção do portal Ofício Eletrônico em Cartórios / Certidões a Emitir / Exportar 

Listagem de erros possíveis retornados no envelope de saída: 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

77 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|18|Status Inválido.|
|19|Data inválida em"DataPedidoDe"|
|20|Data inválida em"DataPedidoAte"|
|21|Data inválida em"DataConferenciaDe"|
|22|Data inválida em"DataConferenciaAte"|
|23|Campo "TipoCertidao" deve estar em branco ou entre<br>1 e 10.|
|24|Campo "PesquisaPor" deve estar em branco ou entre<br>4 e 12.|
|26|Campo "TipoResposta" inválido. Valores permitidos:<br>"" (vazio), "D" ou "C". Os valores "D" e "C" somente<br>são permitidos se o campo "Sttatus"  estiver<br>preenchido com"3"(Respondido).|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|200|Não foram localizados registros para exportação|



## **3.6.3 Envelope de Entrada - ObterXMLSolicitacoes_v5** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string). 

- Protocolo - Filtro opcional para um protocolo específico (tipo string) 

- Solicitante - Filtro opcional para o nome do solicitante (tipo string) 

- TipoCertidao - Filtro opcional para o tipo de certidão, baseado na seginte tabela: 

   - 1 - PROPRIEDADE/NEGATIVA DE PROPRIEDADE 

   - 2 -VINTENÁRIA 

   - 3 - MATRÍCULA DO IMÓVEL 

   - 4 - TRANSCRIÇÃO 

   - 5 - PACTO ANTENUPCIAL 

   - 6 - ONUS 

   - 7 - DOCUMENTO ARQUIVADO 

   - 8 - CONVENÇÃO DE CONDOMÍNIO 

   - 9 - LIVRO3–Garantias 

   - 10 - OUTROS REGISTROS LIVRO3–Auxiliar 

   - 12- INTEIRO TEOR, ÔNUS E AÇÕES 

   - 13 – POR QUESITO 

   - 14 – NEGATIVA DE PENHOR 

   - 15 – ÔNUS REAIS E AÇÕES REIPERSECUTÓRIAS 

   - 16 – USUCAPIÃO 

   - 17 – PROPRIEDADE, ÔNUS E ALIENAÇÕES 

   - 18 – CADEIA DOMINIAL (FILIAÇÃO ATÉ ORIGEM) 

   - 19 – AÇÕES REIPERSECUTÓRIAS 

   - 20 – ÔNUS REAIS 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

78 

## `o` 21 – CERTIDÃO DA SITUAÇÃO JURÍDICA ATUALIZADA DO IMÓVEL 

- PesquisaPor - Filtro opcional para o tipo de pesquisa, baseado na seguinte tabela: 

   - 4 – MATRÍCULA 

   - 5 – TRANSCRIÇÃO 

   - 6 – PESSOA 

   - 7 - NUMERO REGISTRO 

   - 8 - NOME DOS PACTUANTES 

   - 9 – ENDEREÇO 

   - 10 – PROTOCOLO 

   - 11 - N° DO REGISTRO LIVRO3 

   - 12 - NOME CONDOMINIO 

   - 13 - Nº DE MATRÍCULA COM COMPLEMENTO 

   - 14 - Nº DE TRANSCRIÇÃO COM COMPLEMENTO 

- Status - Filtro opcional baseado na seguinte tabela: 

   - 1 - Em Aberto 

   - 2 - Processando 

   - 3 - Respondido 

   - 10 - Informar Valor dos Emolumentos 

   - 11 - Aguardando Pagamento 

   - 12 – Cancelado 

   - 13 – Pendente de Resposta 

   - 23 – Cancelado pelo Solicitante 

- TipoResposta - Filtro opcional, somente aplicável quando o filtro "Status = 3 (Respondido)". Baseia-se na seguinte tabela: 

   - "" (vazio) - Todos os respondidos 

   - "D" - Somente os respondidos com devolução (devolvidos). 

   - "C" - Somente respondidos com certidão. 

- DataPedidoDe - Filtro opcional no formato: aaaa-mm-dd (tipo string), com a data inicial do período de solicitações 

- DataPedidoAte - Filtro opcional no formato: aaaa-mm-dd (tipo string), com a data final do período de solicitações 

- DataConferenciaDe - Filtro opcional no formato: aaaa-mm-dd (tipo string), com a data inicial do período de respostas 

- DataConferenciaAte - Filtro opcional no formato: aaaa-mm-dd (tipo string), com a data final do período de respostas 

## Observação 

Para os filtros não desejados, basta deixar o campo sem preenchimento. Para por exemplo uma filtragem de todos os pedidos solicitados no dia 2021-04-19, o envelope ficaria equivalente a: 

```
<soapenv:Envelopexmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
xmlns:wsof="http://tempuri.org/WSOficio">
<soapenv:Header/>
```

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

79 

```
<soapenv:Body>
<wsof:ObterXMLSolicitacoes_v5>
<wsof:oRequest>
<wsof:Hash>...Hash obtido na autenticação ...</wsof:Hash>
<wsof:Protocolo></wsof:Protocolo>
<wsof:Solicitante></wsof:Solicitante>
<wsof:TipoCertidao></wsof:TipoCertidao>
<wsof:PesquisaPor></wsof:PesquisaPor>
<wsof:Status></wsof:Status>
<wsof:TipoResposta></wsof:TipoResposta>
<wsof:DataPedidoDe>2021-04-19</wsof:DataPedidoDe>
<wsof:DataPedidoAte>2021-04-19</wsof:DataPedidoAte>
<wsof:DataConferenciaDe></wsof:DataConferenciaDe>
<wsof:DataConferenciaAte></wsof:DataConferenciaAte>
</wsof:oRequest>
</wsof:ObterXMLSolicitacoes_v5>
</soapenv:Body>
</soapenv:Envelope>
```

## **3.6.4 Envelope de Saída - ObterXMLSolicitacoes_v5** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string); 

- XML - (se RETORNO = true), irá conter uma string com todo conteúdo XML equivalente ao obtido na opção do portal Ofício Eletrônico em Cartórios / Certidões a Emitir / Exportar 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|18|Status Inválido.|
|19|Data inválida em"DataPedidoDe"|
|20|Data inválida em"DataPedidoAte"|
|21|Data inválida em"DataConferenciaDe"|
|22|Data inválida em"DataConferenciaAte"|
|23|Campo "TipoCertidao" deve estar em branco ou entre<br>1 e 10.|
|24|Campo "PesquisaPor" deve estar em branco ou entre<br>4 e 12.|
|26|Campo "TipoResposta" inválido. Valores permitidos:<br>"" (vazio), "D" ou "C". Os valores "D" e "C" somente<br>são permitidos se o campo "Sttatus"  estiver<br>preenchido com"3"(Respondido).|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|200|Não foram localizados registros para exportação|



**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

80 

**3.6.5 Envelope de Entrada - ObterXMLSolicitacoes_v6** Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string). 

- Protocolo - Filtro opcional para um protocolo específico (tipo string) 

- Solicitante - Filtro opcional para o nome do solicitante (tipo string) 

- TipoCertidao - Filtro opcional para o tipo de certidão, baseado na seginte tabela: 

   - 1 - PROPRIEDADE/NEGATIVA DE PROPRIEDADE 

   - 2 -VINTENÁRIA 

   - 3 - MATRÍCULA DO IMÓVEL 

   - 4 - TRANSCRIÇÃO 

   - 5 - PACTO ANTENUPCIAL 

   - 6 - ONUS 

   - 7 - DOCUMENTO ARQUIVADO 

   - 8 - CONVENÇÃO DE CONDOMÍNIO 

   - 9 - LIVRO3–Garantias 

   - 10 - OUTROS REGISTROS LIVRO3–Auxiliar 

   - 12- INTEIRO TEOR, ÔNUS E AÇÕES 

   - 13 – POR QUESITO 

   - 14 – NEGATIVA DE PENHOR 

   - 15 – ÔNUS REAIS E AÇÕES REIPERSECUTÓRIAS 

   - 16 – USUCAPIÃO 

   - 17 – PROPRIEDADE, ÔNUS E ALIENAÇÕES 

   - 18 – CADEIA DOMINIAL (FILIAÇÃO ATÉ ORIGEM) 

   - 19 – AÇÕES REIPERSECUTÓRIAS 

   - 20 – ÔNUS REAIS 

   - 21 – CERTIDÃO DA SITUAÇÃO JURÍDICA ATUALIZADA DO IMÓVEL 

   - `o` 22 – CERTIDÃO AGRONEGÓCIO 

- PesquisaPor - Filtro opcional para o tipo de pesquisa, baseado na seguinte tabela: 

   - 4 – MATRÍCULA 

   - 5 – TRANSCRIÇÃO 

   - 6 – PESSOA 

   - 7 - NUMERO REGISTRO 

   - 8 - NOME DOS PACTUANTES 

   - 9 – ENDEREÇO 

   - 10 – PROTOCOLO 

   - 11 - N° DO REGISTRO LIVRO3 

   - 12 - NOME CONDOMINIO 

   - 13 - Nº DE MATRÍCULA COM COMPLEMENTO 

   - 14 - Nº DE TRANSCRIÇÃO COM COMPLEMENTO 

   - `o` 15 – BUSCA DE GARANTIAS 

- Status - Filtro opcional baseado na seguinte tabela: 

   - 1 - Em Aberto 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

81 

   - 2 - Processando 

   - 3 - Respondido 

   - 10 - Informar Valor dos Emolumentos 

   - 11 - Aguardando Pagamento 

   - 12 – Cancelado 

   - 13 – Pendente de Resposta 

   - 23 – Cancelado pelo Solicitante 

- TipoResposta - Filtro opcional, somente aplicável quando o filtro "Status = 3 (Respondido)". Baseia-se na seguinte tabela: 

   - "" (vazio) - Todos os respondidos 

   - "D" - Somente os respondidos com devolução (devolvidos). 

   - "C" - Somente respondidos com certidão. 

- DataPedidoDe - Filtro opcional no formato: aaaa-mm-dd (tipo string), com a data inicial do período de solicitações 

- DataPedidoAte - Filtro opcional no formato: aaaa-mm-dd (tipo string), com a data final do período de solicitações 

- DataConferenciaDe - Filtro opcional no formato: aaaa-mm-dd (tipo string), com a data inicial do período de respostas 

- DataConferenciaAte - Filtro opcional no formato: aaaa-mm-dd (tipo string), com a data final do período de respostas 

## Observação 

Para os filtros não desejados, basta deixar o campo sem preenchimento. Para por exemplo uma filtragem de todos os pedidos solicitados no dia 2021-04-19, o envelope ficaria equivalente a: 

```
<soapenv:Envelopexmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
xmlns:wsof="http://tempuri.org/WSOficio">
<soapenv:Header/>
<soapenv:Body>
<wsof:ObterXMLSolicitacoes_v6>
<wsof:oRequest>
<wsof:Hash>...Hash obtido na autenticação ...</wsof:Hash>
<wsof:Protocolo></wsof:Protocolo>
<wsof:Solicitante></wsof:Solicitante>
<wsof:TipoCertidao></wsof:TipoCertidao>
<wsof:PesquisaPor></wsof:PesquisaPor>
<wsof:Status></wsof:Status>
<wsof:TipoResposta></wsof:TipoResposta>
<wsof:DataPedidoDe>2021-04-19</wsof:DataPedidoDe>
<wsof:DataPedidoAte>2021-04-19</wsof:DataPedidoAte>
<wsof:DataConferenciaDe></wsof:DataConferenciaDe>
<wsof:DataConferenciaAte></wsof:DataConferenciaAte>
</wsof:oRequest>
</wsof:ObterXMLSolicitacoes_v6>
</soapenv:Body>
</soapenv:Envelope>
```

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

82 

## **3.6.6 Envelope de Saída - ObterXMLSolicitacoes_v6** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string); 

- XML - (se RETORNO = true), irá conter uma string com todo conteúdo XML equivalente ao obtido na opção do portal Ofício Eletrônico em Cartórios / Certidões a Emitir / Exportar 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|18|Status Inválido.|
|19|Data inválida em"DataPedidoDe"|
|20|Data inválida em"DataPedidoAte"|
|21|Data inválida em"DataConferenciaDe"|
|22|Data inválida em"DataConferenciaAte"|
|23|Campo "TipoCertidao" deve estar em branco ou entre<br>1 e 10.|
|24|Campo "PesquisaPor" deve estar em branco ou entre<br>4 e 12.|
|26|Campo "TipoResposta" inválido. Valores permitidos:<br>"" (vazio), "D" ou "C". Os valores "D" e "C" somente<br>são permitidos se o campo "Sttatus"  estiver<br>preenchido com"3"(Respondido).|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|200|Não foram localizados registros para exportação|



## **3.6.7 Envelope de Entrada - DevolverCertidao** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string). 

- Protocolo - Identifica a solicitação a ser devolvida (tipo string) 

- Motivo - Razão da devolução (tipo string) 

## **3.6.8 Envelope de Saída - DevolverCertidao** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string); 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

83 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|13|O motivo da devolução não foi informado.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|200|Não foram localizados registros para exportação|



## **3.6.9 Envelope de Entrada - EnviarAnexoCertidao** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string). 

- Protocolo - Identifica a solicitação a ser devolvida (tipo string) 

- NomeArquivo - Nome original do arquivo no sistema de origem (tipo string) 

- ArquivoBase64 - Conteúdo do arquivo conveertido em Base64 (tipo string) 

## **3.6.10 Envelope de Saída - EnviarAnexoCertidao** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string); 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|14|O nome do arquivo não foi informado.|
|15|O campo ArquivoBase64 deve ser preenchido com o<br>conteúdo do arquivo.|
|25|Somente são permitidos arquivos com extensão .PDF<br>ouo .P7S.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|200|Não foram localizados registros para exportação|



## **3.6.11 Envelope de Entrada – EnviarAnexoCertidao_DocID** 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

84 

Permite a inclusão de um arquivo assinado via Assinador Web. 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string). 

- Protocolo - Identifica a solicitação a ser devolvida (tipo string) 

- DocumentID - Identifica o anexo no AssinadorWeb (tipo string) 

## **3.6.12 Envelope de Saída – EnviarAnexoCertidao_DocID** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string); 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O DocumentID não foi informado.|
|14|O nome do arquivo não foi informado.|
|15|O campo ArquivoBase64 deve ser preenchido com o<br>conteúdo do arquivo.|
|25|Somente são permitidos arquivos com extensão .PDF<br>ouo .P7S.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|200|Não foram localizados registros para exportação|



## **3.6.13 Envelope de Entrada - EnviarAnexosListCertidao_DocID** 

Permite a inclusão de um arquivo assinado via Assinador Web. 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string). 

- Protocolo - Identifica a solicitação a ser devolvida (tipo string) 

- AnexoList – Identifica a lista de anexos (tipo List) 

   - AnexoListCertidao_DocID_WSReq  - Identifica o objeto que contém o DocId 

      - DocID- Identifica o anexo no AssinadorWeb (tipo string) 

## **3.6.14 Envelope de Saída - EnviarAnexosListCertidao_DocID** 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

85 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string); 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O DocumentID não foi informado.|
|14|O nome do arquivo não foi informado.|
|15|O campo ArquivoBase64 deve ser preenchido com o<br>conteúdo do arquivo.|
|25|Somente são permitidos arquivos com extensão .PDF<br>ouo .P7S.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|200|Não foram localizados registros para exportação|



## **3.6.15 Envelope de Entrada - FinalizarRespostaCertidao** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string). 

- Protocolo - Identifica a solicitação a ser finalizada (tipo string) 

- Matriculas - Opcional (tipo string) com a lista de matrículas adicionais, exclusiva para o tipo de pesquisa por PESSOA (PesquisaPor = 6) 

- InteresseSocial - Obrigatório: True ou False (tipo Boolean) 

## **3.6.16 Envelope de Saída - FinalizarRespostaCertidao** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string); 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|16|O campo "Matriculas" só deve ser preenchido quando<br>o tipo de pesquisa for por"Pessoa".|
|17|É necessáerio anexar ao menos um arqquivo para|



**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

86 

||finalizar a solicitação.|
|---|---|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|200|Não foram localizados registros para exportação|



**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

## 87 

## **3.6.17 Envelope de Entrada - InformarCustasCertidao** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string). 

- Protocolo - Identifica a solicitação a ser finalizada (tipo string) 

- ValorCustas - Valor das custas informado pelo cartório (tipo valor) 

## **3.6.18 Envelope de Saída - InformarCustasCertidao** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string); 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|14|Valor inválido.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|200|Não foram localizados registros para exportação|
|8306|Erro inesperado ao tentar informar custas:Operação<br>Cancelada: As custas deste pedido já foram<br>informadas|



## **3.6.19 Envelope de Entrada – EnviarAnexoCertidao_DocID_V2** 

Permite a inclusão de um arquivo assinado via Assinador Web. 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string). 

- Protocolo - Identifica a solicitação a ser devolvida (tipo string) 

- DocumentID - Identifica o anexo no AssinadorWeb (tipo string) 

- CertidaoAutomatizada - Identifica se é ou nao automatizada (tipo boolean) 

## **3.6.20 Envelope de Saída – EnviarAnexoCertidao_DocID_V2** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

88 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string); 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|13|Não foi informada a DocumentID do arquivo.|
|14|Não foi informada a CertidaoAutomatizada.|
|15|O campo ArquivoBase64 deve ser preenchido com o<br>conteúdo do arquivo.|
|25|Somente são permitidos arquivos com extensão .PDF<br>ouo .P7S.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|200|Não foram localizados registros para exportação|



## **3.6.21 Envelope de Entrada - EnviarAnexosListCertidao_DocID_V2** 

Permite a inclusão de um arquivo assinado via Assinador Web. 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string). 

- Protocolo - Identifica a solicitação a ser devolvida (tipo string) 

- AnexoList – Identifica a lista de anexos (tipo List) 

   - AnexoListCertidao_DocID_WSReq_V2  - Identifica o objeto que contém o DocId e CertidaoAutomatizada 

      - DocID- Identifica o anexo no AssinadorWeb (tipo string) 

      - CertidaoAutomatizada - Identifica se é ou não automatizada (tipo boolean) 

## **3.6.22 Envelope de Saída - EnviarAnexosListCertidao_DocID_V2** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string); 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|



**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

## 89 

|11|O DocumentID não foi informado.|
|---|---|
|13|Não foi informada a CertidaoAutomatizada|
|14|O nome do arquivo não foi informado.|
|15|O campo ArquivoBase64 deve ser preenchido com o<br>conteúdo do arquivo.|
|25|Somente são permitidos arquivos com extensão .PDF<br>ouo .P7S.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|200|Não foram localizados registros para exportação|
