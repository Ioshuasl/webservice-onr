# WSOficio — E-Protocolo (AC)

> Extraído de [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) (seções 3.10).

---
## **3.10 E-Protocolo** 

O ONR disponibiliza os serviços referentes ao E-Protocolo através de web services contemplando as seguintes funcionalidades: 

## A. Obter Extrato XML 

Retorna o arquivo referente ao Extrato XML de um pedido. 

- B. Listagem de Pedidos 

Retorna uma lista de pedidos de acordo com os parâmetros informados. 

- C. Listagem de Anexos 

Retorna uma lista dos anexos vinculados à um pedido de E-Protocolo. 

- D. Listagem de Boletos Bancários 

Retorna uma lista dos boletos associados a um processo. 

- E. Baixa de Boleto Bancário 

Permite efetuar a baixa de um boleto no sistema. 

- F. Obter Pedido 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

94 

Esse serviço permite recuperar os dados de um pedido específico. 

- G. Alterar Pedido 

Esse serviço permite alterar um grupo de dados específicos (ex.: dados do apresentante) de um contrato. 

- H. Informar Prenotação 

Permite informar a prenotação de um pedido de E-Protocolo. 

- I. Prorrogar Prenotação 

Permite prorrogar a prenotação de um pedido de E-Protocolo. 

- J. Informar Custas 

Permite informar custas de um pedido de E-Protocolo. 

- K. Informar Protocolo 

Permite informar os dados de prenotação de um contrato, quando solicitação do tipo Exame e Cálculo. 

- L. Responder pedido de E-Protocolo com averbação 

Permite responder um pedido de E-Protocolo com averbação. 

- M. Responder pedido de E-Protocolo com exigência 

Permite responder um pedido de E-Protocolo com exigências. 

- N. Responder pedido de E-Protocolo com devolução 

Permite responder um pedido de E-Protocolo com devolução. 

- O. Listagem de documentos (repositório de documentos) 

Listagem dos documentos vinculados a um contrato. 

- P. Converter arquivo de contrato XML para PDF. 

Converte um arquivo de contrato XML para PDF. 

O contrato WSDL para homologação pode ser visualizado em: 

- https://hml3- wsoficio.onr.org.br/eprotocolo.asmx?wsdl 

## Métodos a serem referenciados: **GetExtratoXMLAC** ; **ListPedidosAC** ; **ListAnexosAC** ; **ListBoletosAC** ; **SetBaixaBoletoAC** ; **GetPedidoAC_V3** ; **AlterarPedidoAC** ; **SetPrenotacaoAC** ; **SetCustasAC** ; **SetPrenotacaoExameCalculoAC** ; **SetContratoAverbadoAC** ; **SetContratoExigenciaAC** ; 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

## 95 

## **SetContratoDevolvidoAC** ; **ListDocumentosRepositorioAC, ContratoXMLtoPDF.** 

## **3.10.1 Envelope de Entrada - GetExtratoXMLAC** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string(50)); 

- Protocolo – Protocolo do pedido do Extrato a ser obtido (tipo string(12)). 

## **3.10.2 Envelope de Saída - GetExtratoXMLAC** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string(200)); 

- IDPedido – Código do pedido (tipo int); 

- URLArquivo – URL do Extrato XML (tipo string(300)); 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|12|O Protocolo informado é inválido.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|51|Usuário inválido. Apenas usuários de cartórios são<br>permitidos.|
|52|Extrato XML não encontrado. Verifique se o protocolo<br>informado está correto.|
|53|Não foi possível obter os dados do arquivo.|
|54|Não foi possível obter os dados do contrato.|
|55|Usuário não tem permissão para acessar esse<br>arquivo.|



## **3.10.3 Envelope de Entrada - ListPedidosAC** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string(50)); 

- MaxRowPerPage – Quantidade máxima de registros a serem retornados por página (tipo int); 

- PageNumber – Página a ser retornada (tipo int); 

- Protocolo – Protocolo do pedido do Extrato a ser obtido (tipo string(12)); 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

96 

- Instituicao - Nome da instituição solicitante vinculada ao contrato (tipo string); 

- IDTipoServico – Tipo de Serviço a ser filtrado (tipo int); Valores possíveis: 

   - 1 = Registro/Averbação; 

   - 2 = Exame e Cálculo; 

   - 3 = Requerimento de Cancelamento de Hipotéca. 

- IDStatus - Código do Status a ser filtrado. Para retornar todos, informar -1 (tipo int). Valores possíveis: 

   - 0 = Não concluído; 

   - 1 = Em aberto; 

   - 2 = Processando; 

   - 3 = Prenotado; 

   - 4 = Calculado; 

   - 5 = Devolvido; 

   - 6 = Nota de Exigência; 

   - 7 = Registrado/Averbado; 

   - 8 = Reaberto – Não Concluído; 

   - 9 = Aguardando Pagamento; 

   - 10 = Pagamento Efetivado. 

- DataSolicitacaoInicial - Data inicial da solicitação a ser filtrada, formato: aaaa-mm-dd (tipo string); 

- DataSolicitacaoFinal - Data final da solicitação a ser filtrada, formato: aaaa-mm-dd (tipo string); 

- NumeroBanco - Número do banco usado para Boleto Sem Registro. Para retornar todos, informar 0 ou -1. (tipo int). 

## ● 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|12|O código informado para o contrato é inválido.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|51|Não foi possível recuperar o contrato para edição.|
|52|Não foi possível concluir a alteração do contrato<br>informado.|
|53|Não foi possível obter os dados da Via|
|54|Não foi possível obter os dados do Estado.|
|55|Usuário não tem permissão para alterar o pedido da<br>instituição informada.|



## **3.10.4 Envelope de Saída - ListPedidosAC** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string(200)); 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

97 

- QtdeRegistros – (se RETORNO = true)  Quantidade total de registros encontrados (tipo int); 

- QtdePaginas  – (se RETORNO = true)  Quantidade total de páginas, de acordo com o total de registros encontrados e com a quantidade máxima de registros por página que foi informada no envelope de entrada - MaxRowPerPage - (tipo int); 

- Pedidos - (se RETORNO = true)  Array dos pedidos encontrados, apresentando as seguintes informações: 

      - IDPedido – Código do pedido (tipo int); 

      - Protocolo - Protocolo do pedido (tipo string); 

      - Instituição - Nome da instituição solicitante vinculada ao contrato (tipo string); 

   - IDTipoServico - Tipo de Serviço do contrato. Para uma lista dos valores possíveis abaixo (tipo int): 

## `o` 

1 - Certidão Digital; 

- 2 - Matrícula Online; 

- 3 - Consulta Eletrônica; 

- 4 - Monitor Registral; 

- 5 - EProtocolo; 

- 6 - Intimação. 

Ex.: 1 = Retorna todos os Estados ativos e que podem receber pedidos de certidão digital. 

- IDStatus – Código do Status.  Para uma lista dos valores possíveis abaixo (tipo int): 

   - 1 - Em aberto 

   - 2 - Processando 

   - 3 - Prenotado 

   - 4 - Calculado 

   - 5 - Devolvido 

   - 6 - Nota de Exigência 

   - 7 - Registrado /Averbado 

   - 8 - Reaberto - Não Concluído 

   - 9 - Aguardando Pagamento 

   - 10 - Pagamento Efetivado 

   - 18 - Finalizado sem prática do Ato 

   - 19 - Cancelamento de Prenotação 

100 - Prazo Suspenso 

`o` DataSolicitacao - Data final da solicitação a ser filtrada, formato: aaaa-mm-dd (tipo string). 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|12|A quantidade de registros por página informada é<br>inválida. A quantidade mínima permitida é 10.|
|13|A página informada é inválida.|
|16|A data de solicitação inicial é inválida.|



**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

## 98 

|17|A data de solicitação final é inválida.|
|---|---|
|30|A página informada é inválida. Página máxima<br>possível: [PAGINA]|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|51|Não foi possível obter os pedidos.|



## **3.10.5 Envelope de Entrada - ListAnexosAC** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string(50)); 

- IDContrato – ID do contrato obtido da listagem de pedidos (tipo int). 

## **3.10.6 Envelope de Saída - ListAnexosAC** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string(200)); 

- AnexosContrato – (se RETORNO = true) Array de anexos, apresentando as informações de anexos; 

- AnexosAverbacao – (se RETORNO = true) Array de anexos, apresentando as informações de anexos; 

- AnexosExigencia – (se RETORNO = true) Array de anexos, apresentando as informações de anexos. 

- OBS. => Informações de Anexos: 

   - IDAnexo – ID do anexo obtido (tipo int); 

   - URLAnexo – URL do anexo obtido (tipo string); 

   - Descricao – Descrição do anexo obtido (tipo string); 

   - DataInclusao - Data de cadastro do anexo, formato: aaaa-mm-dd (tipo string). 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|12|O código informado para o contrato não é válido.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|55|Usuário não tem permissão para consultar o pedido<br>da instituição informada.|



**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

99 

## **3.10.7 Envelope de Entrada - ListBoletosAC** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string(50)); 

- IDContrato – ID do contrato obtido da listagem de pedidos (tipo int). 

## **3.10.8 Envelope de Saída - ListBoletosAC** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string(200)); 

- Boletos – (se RETORNO = true) Array de boletos vinculados ao contrato, apresentando as seguintes informações: 

   - IDBoleto – ID do boleto vinculado ao contrato (tipo int); 

   - Convenio – Indica se o boleto foi gerado por um usuário de convênio (tipo boolean); 

   - URLBoleto – URL para visualização do boleto (tipo string); 

   - NumeroBoleto – Código literal referente ao código de barras do boleto (tipo string); 

   - NumeroBanco – Número do banco usado para Boleto Sem Registro (tipo string); 

   - Protocolos – Protocolos dos pedidos vinculados ao boleto (tipo string); 

   - DataGeracao – Data de geração do boleto, formato: aaaa-mm-dd (tipo string); 

   - DataVencimento – Data de vencimento do boleto, formato: aaaa-mm-dd (tipo string). 

   - Status – Status de pagamento do boleto (tipo string); 

   - DataPagamento – Data de pagamento quando o mesmo foi efetuado, formato: aaaa-mmdd (tipo string). 

   - Valor – Valor vinculado ao boleto (tipo decimal); 

   - NomeEfetivador – Nome do efetivador do boleto após pagamento confirmado (tipo string); 

   - PagamentoEfetuado – Indica se o pagamento já foi ou não efetuado (tipo boolean). 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|12|O código informado para o contrato não é válido.|
|13|Não foi possível recuperar o número de loja dos<br>boletos comuns.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|51|Não foi possível obter os boletos.|
|55|Usuário não tem permissão para consultar o pedido<br>da instituição informada.|



**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

100 

## **3.10.9 Envelope de Entrada - SetBaixaBoletoAC** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string(50)); 

- IDBoleto – ID do boleto obtido da listagem de boletos (tipo int); 

- Convenio – Indicar se o boleto foi gerado por um convênio, obtido através da listagem anterior de boletos (tipo boolean). 

## **3.10.10 Envelope de Saída - SetBaixaBoletoAC** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string(200)). 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|12|O código de boleto informado não é válido.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|51|Não foi possível realizar a baixa do pagamento de<br>convênio.|
|52|Não foi possível realizar a baixa do pagamento de<br>cliente comum.|



## **3.10.11 Envelope de Entrada – GetPedidoAC_V3** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string(50)); 

- IDContrato – ID do contrato obtido da listagem de pedidos (tipo int). 

## **3.10.12 Envelope de Saída – GetPedidoAC_V3** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

101 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string(200)); 

- IDContrato - ID do contrato retornado pelo serviço (tipo int); 

- Protocolo - Protocolo do contrato retornado (tipo string); 

- IDStatus - Código do Status a ser filtrado. Para retornar todos, informar -1. Para uma lista dos valores possíveis abaixo (tipo int): 

1 - Em aberto 

- 2 - Processando 

- 3 - Prenotado 

- 4 - Calculado 

- 5 - Devolvido 

- 6 - Nota de Exigência 

- 7 - Registrado /Averbado 

- 8 - Reaberto - Não Concluído 

- 9 - Aguardando Pagamento 

10 - Pagamento Efetivado 

18 - Finalizado sem prática do Ato 

19 - Cancelamento de Prenotação 

100 - Prazo Suspenso 

- IDCartorio - Código do cartório cujo contrato foi direcionado. Para uma lista dos cartórios possíveis conferir serviço CartoriosListar, item 3.17.1.1  (tipo int); 

- DataRemessa - Data de remessa do contrato obtido, formato: aaaa-mm-dd (tipo string); 

- Solicitante - Nome do solicitante informado na geração do contrato (tipo string); 

- Telefone - Telefone do solicitante informado na geração do contrato (tipo string); 

- Instituicao - Instituição do solicitante informada na geração do contrato (tipo string); 

- Email - E-mail do solicitante informado na geração do contrato (tipo string); 

- TipoDocumento - Tipo do contrato, onde 1 = Escritura Pública (tipo string); 

- TipoServico - Tipo do Serviço indicado, onde 1 = Registro/Averbação e 2 = Exame/Cálculo (tipo string); 

- ImportacaoExtratoXML - Indica se o contrato foi gerado a partir de uma importação de XML (tipo boolean); 

- DadosApresentante - Cadeia de elementos referentes ao apresentante, onde: 

   - Nome – nome do apresentante (tipo String); 

   - CPFCNPJ – CPF ou CNPJ do apresentante (tipo String); 

   - Email – e-mail do apresentante (tipo String); 

   - Via – tipo de via correspondente ao endereço do apresentante (tipo String); 

   - Endereco – endereço do apresentante (tipo String); 

   - Numero – número correspondente ao endereço do apresentante (tipo String); 

   - Complemento – complemento correspondente ao endereço do apresentante (tipo String); 

   - Bairro – bairro correspondente ao endereço do apresentante (tipo String); 

   - Cidade – cidade correspondente ao endereço do apresentante (tipo String); 

   - Estado – UF correspondente ao endereço do apresentante (tipo String); 

   - CEP – CEP correspondente ao endereço do apresentante (tipo String); 

   - DDD – DDD correspondente ao telefone do apresentante (tipo String); 

   - Telefone – telefone do apresentante (tipo String); 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

102 

- PrenotacaoNumero - Quando prenotado, contém o número da prenotação (tipo string); 

- PrenotacaoSenha - Quando prenotado, e se a senha foi informada, contém o dado correspondente (tipo string); 

- PrenotacaoDataInclusao - Quando prenotado, contém a data de inclusão da prenotação no formato aaaa-mm-dd (tipo string); 

- PrenotacaoDataVencimento - Quando prenotado, contém a data de vencimento da prenotação no formato aaaa-mm-dd (tipo string); 

- PrenotacaoDataReenvio - Quando prenotado, e se a prenotaçao foi reenviada, contém a data correspondente no formato aaaa-mm-dd (tipo string); 

- ValorServico - Valor de serviço informado pelo cartório (tipo decimal); 

- DataResposta - Data de resposta do contrato obtido, formato: aaaa-mm-dd (tipo string); 

- Resposta - Resposta fornecida na finalização do contrato (tipo string); 

- DadosAceite - Dados do aceite quando o contrato foi finalizado, contendo nome do responsável e data do aceite no formato aaaa-mm-dd(tipo string); 

- DataCumprimentoRI- Data do informe de cumprimento de exigência pelo RI no formato aaaa-mmdd(tipo string); 

- DadosImovel - Cadeia de elementos referentes ao imóvel do contrato, onde: 

   - Matricula – matrícula do imóvel (tipo String); 

   - Via – tipo de via correspondente ao endereço do imóvel (tipo String); 

   - Endereco – endereço do imóvel (tipo String); 

   - Numero – número correspondente ao endereço do imóvel (tipo String); 

   - Complemento – complemento correspondente ao endereço do imóvel (tipo String); 

   - Bairro – bairro correspondente ao endereço do imóvel (tipo String); 

   - Cidade – cidade correspondente ao endereço do imóvel (tipo String); 

   - Estado – UF correspondente ao endereço do imóvel (tipo String); 

- Compradores – Array de compradores vinculados ao contrato, onde cada elemento possui os campos: 

   - Nome – nome do comprador (tipo String); 

   - CPFCNPJ – CPF ou CNPJ do comprador (tipo String); 

- Vendedores – Array de vendedores vinculados ao contrato, onde cada elemento possui os campos: 

   - Nome – nome do vendedor (tipo String); 

   - CPFCNPJ – CPF ou CNPJ do vendedor (tipo String); 

- TipoCobranca - Tipo de Cobrança, onde 1 = INTEGRAL; 2 = PREFEITURA; 3 = ISENÇÃO TOTAL (tipo int); 

- CertidaoInteiroTeor - Certidão Inteiro Teor, onde: 0 = Não; 1  = Sim (tipo int); 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|12|O código informado para o contrato não é válido.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|51|Não foi possível obter os dados do contrato solicitado.|
|52|Não foi possível obter os dados dos compradores|



**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

## 103 

||vinculados ao contrato.|
|---|---|
|53|Não foi possível obter os dados dos vendedores<br>vinculados ao contrato.|
|55|Usuário não tem permissão para consultar o pedido<br>da instituição informada.|



## **3.10.13 Envelope de Entrada – GetPedidoAC_V4** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string(50)); 

- IDContrato – ID do contrato obtido da listagem de pedidos (tipo int). 

## **3.10.14 Envelope de Saída – GetPedidoAC_V4** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string(200)); 

- IDContrato - ID do contrato retornado pelo serviço (tipo int); 

- Protocolo - Protocolo do contrato retornado (tipo string); 

- IDStatus - Código do Status a ser filtrado. Para retornar todos, informar -1. Para uma lista dos valores possíveis abaixo (tipo int): 

## 1 - Em aberto 

- 2 - Processando 

- 3 - Prenotado 

- 4 - Calculado 

- 5 - Devolvido 

- 6 - Nota de Exigência 

- 7 - Registrado /Averbado 

- 8 - Reaberto - Não Concluído 

- 9 - Aguardando Pagamento 

- 10 - Pagamento Efetivado 

- 18 - Finalizado sem prática do Ato 

19 - Cancelamento de Prenotação 

100 - Prazo Suspenso 

- IDCartorio - Código do cartório cujo contrato foi direcionado. Para uma lista dos cartórios possíveis conferir serviço CartoriosListar, item 3.17.1.1  (tipo int); 

- DataRemessa - Data de remessa do contrato obtido, formato: aaaa-mm-dd (tipo string); 

- Solicitante - Nome do solicitante informado na geração do contrato (tipo string); 

- Telefone - Telefone do solicitante informado na geração do contrato (tipo string); 

- Instituicao - Instituição do solicitante informada na geração do contrato (tipo string); 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

104 

- Email - E-mail do solicitante informado na geração do contrato (tipo string); 

- TipoDocumento - Tipo do contrato, onde 1 = Escritura Pública (tipo string); 

- TipoServico - Tipo do Serviço indicado, onde 1 = Registro/Averbação e 2 = Exame/Cálculo (tipo string); 

- ImportacaoExtratoXML - Indica se o contrato foi gerado a partir de uma importação de XML (tipo boolean); 

- DadosApresentante - Cadeia de elementos referentes ao apresentante, onde: 

   - Nome – nome do apresentante (tipo String); 

   - CPFCNPJ – CPF ou CNPJ do apresentante (tipo String); 

   - Email – e-mail do apresentante (tipo String); 

   - Via – tipo de via correspondente ao endereço do apresentante (tipo String); 

   - Endereco – endereço do apresentante (tipo String); 

   - Numero – número correspondente ao endereço do apresentante (tipo String); 

   - Complemento – complemento correspondente ao endereço do apresentante (tipo String); 

   - Bairro – bairro correspondente ao endereço do apresentante (tipo String); 

   - Cidade – cidade correspondente ao endereço do apresentante (tipo String); 

   - Estado – UF correspondente ao endereço do apresentante (tipo String); 

   - CEP – CEP correspondente ao endereço do apresentante (tipo String); 

   - DDD – DDD correspondente ao telefone do apresentante (tipo String); 

   - Telefone – telefone do apresentante (tipo String); 

- PrenotacaoNumero - Quando prenotado, contém o número da prenotação (tipo string); 

- PrenotacaoSenha - Quando prenotado, e se a senha foi informada, contém o dado correspondente (tipo string); 

- PrenotacaoDataInclusao - Quando prenotado, contém a data de inclusão da prenotação no formato aaaa-mm-dd (tipo string); 

- PrenotacaoDataVencimento - Quando prenotado, contém a data de vencimento da prenotação no formato aaaa-mm-dd (tipo string); 

- PrenotacaoDataReenvio - Quando prenotado, e se a prenotaçao foi reenviada, contém a data correspondente no formato aaaa-mm-dd (tipo string); 

- ValorServico - Valor de serviço informado pelo cartório (tipo decimal); 

- DataResposta - Data de resposta do contrato obtido, formato: aaaa-mm-dd (tipo string); 

- Resposta - Resposta fornecida na finalização do contrato (tipo string); 

- DadosAceite - Dados do aceite quando o contrato foi finalizado, contendo nome do responsável e data do aceite no formato aaaa-mm-dd(tipo string); 

- DataCumprimentoRI- Data do informe de cumprimento de exigência pelo RI no formato aaaa-mmdd(tipo string); 

- DadosImovel - Cadeia de elementos referentes ao imóvel do contrato, onde: 

   - Matricula – matrícula do imóvel (tipo String); 

   - Via – tipo de via correspondente ao endereço do imóvel (tipo String); 

   - Endereco – endereço do imóvel (tipo String); 

   - Numero – número correspondente ao endereço do imóvel (tipo String); 

   - Complemento – complemento correspondente ao endereço do imóvel (tipo String); 

   - Bairro – bairro correspondente ao endereço do imóvel (tipo String); 

   - Cidade – cidade correspondente ao endereço do imóvel (tipo String); 

   - Estado – UF correspondente ao endereço do imóvel (tipo String); 

- Compradores – Array de compradores vinculados ao contrato, onde cada elemento possui os campos: 

   - Nome – nome do comprador (tipo String); 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

105 

`o` CPFCNPJ – CPF ou CNPJ do comprador (tipo String); 

- Vendedores – Array de vendedores vinculados ao contrato, onde cada elemento possui os campos: 

   - Nome – nome do vendedor (tipo String); 

   - CPFCNPJ – CPF ou CNPJ do vendedor (tipo String); 

- TipoCobranca - Tipo de Cobrança, onde 1 = INTEGRAL; 2 = PREFEITURA; 3 = ISENÇÃO TOTAL (tipo int); 

- CertidaoInteiroTeor - Certidão Inteiro Teor, onde: 0 = Não; 1  = Sim (tipo int); 

- TipoIsencao: 0 = Nenhuma; 1 = Assistência jurídica gratuita (tipo int); 

- NrProcesso: Número do processo (tipo string, preenchido quando TipoIsencao = 1) 

- Folhas: Folhas / processo (tipo string, preenchido quando TipoIsencao = 1) 

- DataGratuidade: Data da concessão da justiça gratuita (tipo string, preenchido quando TipoIsencao = 1) 

- UrlArquivoGratuidade: Url para download do anexo com despacho (tipo string, preenchido quando TipoIsencao = 1) 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|12|O código informado para o contrato não é válido.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|51|Não foi possível obter os dados do contrato solicitado.|
|52|Não foi possível obter os dados dos compradores<br>vinculados ao contrato.|
|53|Não foi possível obter os dados dos vendedores<br>vinculados ao contrato.|
|55|Usuário não tem permissão para consultar o pedido<br>da instituição informada.|



## **3.10.15 Envelope de Entrada – GetPedidoAC_V5** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string(50)); 

- IDContrato – ID do contrato obtido da listagem de pedidos (tipo int). 

## **3.10.16 Envelope de Saída – GetPedidoAC_V5** 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

106 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string(200)); 

- IDContrato - ID do contrato retornado pelo serviço (tipo int); 

- Protocolo - Protocolo do contrato retornado (tipo string); 

- IDStatus - Código do Status a ser filtrado. Para retornar todos, informar -1. Para uma lista dos valores possíveis abaixo (tipo int): 

1 - Em aberto 

- 2 - Processando 

- 3 - Prenotado 

- 4 - Calculado 

- 5 - Devolvido 

- 6 - Nota de Exigência 

- 7 - Registrado /Averbado 

- 8 - Reaberto - Não Concluído 

- 9 - Aguardando Pagamento 

- 10 - Pagamento Efetivado 

- 18 - Finalizado sem prática do Ato 

19 - Cancelamento de Prenotação 

100 - Prazo Suspenso 

- IDCartorio - Código do cartório cujo contrato foi direcionado. Para uma lista dos cartórios possíveis conferir serviço CartoriosListar, item 3.17.1.1  (tipo int); 

- DataRemessa - Data de remessa do contrato obtido, formato: aaaa-mm-dd (tipo string); 

- Solicitante - Nome do solicitante informado na geração do contrato (tipo string); 

- Telefone - Telefone do solicitante informado na geração do contrato (tipo string); 

- Instituicao - Instituição do solicitante informada na geração do contrato (tipo string); 

- Email - E-mail do solicitante informado na geração do contrato (tipo string); 

- TipoDocumento - Tipo do contrato, onde 1 = Escritura Pública (tipo string); 

- TipoServico - Tipo do Serviço indicado, onde 1 = Registro/Averbação e 2 = Exame/Cálculo (tipo string); 

- ImportacaoExtratoXML - Indica se o contrato foi gerado a partir de uma importação de XML (tipo boolean); 

- DadosApresentante - Cadeia de elementos referentes ao apresentante, onde: 

   - Nome – nome do apresentante (tipo String); 

   - CPFCNPJ – CPF ou CNPJ do apresentante (tipo String); 

   - Email – e-mail do apresentante (tipo String); 

   - Via – tipo de via correspondente ao endereço do apresentante (tipo String); 

   - Endereco – endereço do apresentante (tipo String); 

   - Numero – número correspondente ao endereço do apresentante (tipo String); 

   - Complemento – complemento correspondente ao endereço do apresentante (tipo String); 

   - Bairro – bairro correspondente ao endereço do apresentante (tipo String); 

   - Cidade – cidade correspondente ao endereço do apresentante (tipo String); 

   - Estado – UF correspondente ao endereço do apresentante (tipo String); 

   - CEP – CEP correspondente ao endereço do apresentante (tipo String); 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

107 

   - DDD – DDD correspondente ao telefone do apresentante (tipo String); 

   - Telefone – telefone do apresentante (tipo String); 

- PrenotacaoNumero - Quando prenotado, contém o número da prenotação (tipo string); 

- PrenotacaoSenha - Quando prenotado, e se a senha foi informada, contém o dado correspondente (tipo string); 

- PrenotacaoDataInclusao - Quando prenotado, contém a data de inclusão da prenotação no formato aaaa-mm-dd (tipo string); 

- PrenotacaoDataVencimento - Quando prenotado, contém a data de vencimento da prenotação no formato aaaa-mm-dd (tipo string); 

- PrenotacaoDataReenvio - Quando prenotado, e se a prenotaçao foi reenviada, contém a data correspondente no formato aaaa-mm-dd (tipo string); 

- ValorServico - Valor de serviço informado pelo cartório (tipo decimal); 

- DataResposta - Data de resposta do contrato obtido, formato: aaaa-mm-dd (tipo string); 

- Resposta - Resposta fornecida na finalização do contrato (tipo string); 

- DadosAceite - Dados do aceite quando o contrato foi finalizado, contendo nome do responsável e data do aceite no formato aaaa-mm-dd(tipo string); 

- DataCumprimentoRI- Data do informe de cumprimento de exigência pelo RI no formato aaaa-mmdd(tipo string); 

- DadosImovel - Cadeia de elementos referentes ao imóvel do contrato, onde: 

   - Matricula – matrícula do imóvel (tipo String); 

   - Via – tipo de via correspondente ao endereço do imóvel (tipo String); 

   - Endereco – endereço do imóvel (tipo String); 

   - Numero – número correspondente ao endereço do imóvel (tipo String); 

   - Complemento – complemento correspondente ao endereço do imóvel (tipo String); 

   - Bairro – bairro correspondente ao endereço do imóvel (tipo String); 

   - Cidade – cidade correspondente ao endereço do imóvel (tipo String); 

   - Estado – UF correspondente ao endereço do imóvel (tipo String); 

- Compradores – Array de compradores vinculados ao contrato, onde cada elemento possui os campos: 

   - Nome – nome do comprador (tipo String); 

   - CPFCNPJ – CPF ou CNPJ do comprador (tipo String); 

- Vendedores – Array de vendedores vinculados ao contrato, onde cada elemento possui os campos: 

   - Nome – nome do vendedor (tipo String); 

   - CPFCNPJ – CPF ou CNPJ do vendedor (tipo String); 

- TipoCobranca - Tipo de Cobrança, onde 1 = INTEGRAL; 2 = PREFEITURA; 3 = ISENÇÃO TOTAL (tipo int); 

- CertidaoInteiroTeor - Certidão Inteiro Teor, onde: 0 = Não; 1  = Sim (tipo int); 

- TipoIsencao: 0 = Nenhuma; 1 = Assistência jurídica gratuita (tipo int); 

- NrProcesso: Número do processo (tipo string, preenchido quando TipoIsencao = 1) 

- Folhas: Folhas / processo (tipo string, preenchido quando TipoIsencao = 1) 

- DataGratuidade: Data da concessão da justiça gratuita (tipo string, preenchido quando TipoIsencao = 1) 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

108 

- UrlArquivoGratuidade: Url para download do anexo com despacho (tipo string, preenchido quando TipoIsencao = 1) 

- ProtocoloOrigem: Protocolo origem de um pedido que foi reenviado 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|12|O código informado para o contrato não é válido.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|51|Não foi possível obter os dados do contrato solicitado.|
|52|Não foi possível obter os dados dos compradores<br>vinculados ao contrato.|
|53|Não foi possível obter os dados dos vendedores<br>vinculados ao contrato.|
|55|Usuário não tem permissão para consultar o pedido<br>da instituição informada.|



## **3.10.17 Envelope de Entrada – GetPedidoAC_V6** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string(50)); 

- IDContrato – ID do contrato obtido da listagem de pedidos (tipo int). 

## **3.10.18 Envelope de Saída – GetPedidoAC_V6** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string(200)); 

- IDContrato - ID do contrato retornado pelo serviço (tipo int); 

- Protocolo - Protocolo do contrato retornado (tipo string); 

- IDStatus - Código do Status a ser filtrado. Para retornar todos, informar -1. Para uma lista dos valores possíveis abaixo (tipo int): 

## 1 - Em aberto 

- 2 - Processando 

- 3 - Prenotado 

- 4 - Calculado 

- 5 - Devolvido 

- 6 - Nota de Exigência 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

109 

7 - Registrado /Averbado 

8 - Reaberto - Não Concluído 

9 - Aguardando Pagamento 

10 - Pagamento Efetivado 

18 - Finalizado sem prática do Ato 

19 - Cancelamento de Prenotação 

100 - Prazo Suspenso 

- IDCartorio - Código do cartório cujo contrato foi direcionado. Para uma lista dos cartórios possíveis conferir serviço CartoriosListar, item 3.17.1.1  (tipo int); 

- DataRemessa - Data de remessa do contrato obtido, formato: aaaa-mm-dd (tipo string); 

- Solicitante - Nome do solicitante informado na geração do contrato (tipo string); 

- Telefone - Telefone do solicitante informado na geração do contrato (tipo string); 

- Instituicao - Instituição do solicitante informada na geração do contrato (tipo string); 

- Email - E-mail do solicitante informado na geração do contrato (tipo string); 

- TipoDocumento - Tipo do contrato, onde 1 = Escritura Pública (tipo string); 

- TipoServico - Tipo do Serviço indicado, onde 1 = Registro/Averbação e 2 = Exame/Cálculo (tipo string); 

- ImportacaoExtratoXML - Indica se o contrato foi gerado a partir de uma importação de XML (tipo boolean); 

- DadosApresentante - Cadeia de elementos referentes ao apresentante, onde: 

   - Nome – nome do apresentante (tipo String); 

   - CPFCNPJ – CPF ou CNPJ do apresentante (tipo String); 

   - Email – e-mail do apresentante (tipo String); 

   - Via – tipo de via correspondente ao endereço do apresentante (tipo String); 

   - Endereco – endereço do apresentante (tipo String); 

   - Numero – número correspondente ao endereço do apresentante (tipo String); 

   - Complemento – complemento correspondente ao endereço do apresentante (tipo String); 

   - Bairro – bairro correspondente ao endereço do apresentante (tipo String); 

   - Cidade – cidade correspondente ao endereço do apresentante (tipo String); 

   - Estado – UF correspondente ao endereço do apresentante (tipo String); 

   - CEP – CEP correspondente ao endereço do apresentante (tipo String); 

   - DDD – DDD correspondente ao telefone do apresentante (tipo String); 

   - Telefone – telefone do apresentante (tipo String); 

- PrenotacaoDataInclusao - Quando prenotado, contém a data de inclusão da prenotação no formato aaaa-mm-dd (tipo string); 

- PrenotacaoDataVencimento - Quando prenotado, contém a data de vencimento da prenotação no formato aaaa-mm-dd (tipo string); 

- PrenotacaoDataReenvio - Quando prenotado, e se a prenotaçao foi reenviada, contém a data correspondente no formato aaaa-mm-dd (tipo string); 

- ValorServico - Valor de serviço informado pelo cartório (tipo decimal); 

- DataResposta - Data de resposta do contrato obtido, formato: aaaa-mm-dd (tipo string); 

- Resposta - Resposta fornecida na finalização do contrato (tipo string); 

- DadosAceite - Dados do aceite quando o contrato foi finalizado, contendo nome do responsável e data do aceite no formato aaaa-mm-dd(tipo string); 

- DadosImovel – Array de imóveis do contrato, onde: 

   - Matricula – matrícula do imóvel (tipo String); 

   - Via – tipo de via correspondente ao endereço do imóvel (tipo String); 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

110 

   - Endereco – endereço do imóvel (tipo String); 

   - Numero – número correspondente ao endereço do imóvel (tipo String); 

   - Complemento – complemento correspondente ao endereço do imóvel (tipo String); 

   - Bairro – bairro correspondente ao endereço do imóvel (tipo String); 

   - Cidade – cidade correspondente ao endereço do imóvel (tipo String); 

   - Estado – UF correspondente ao endereço do imóvel (tipo String); 

- Partes  –Array de partes vinculados ao contrato, onde cada elemento possui os campos: 

   - Nome – nome do comprador (tipo String); 

   - CPFCNPJ – CPF ou CNPJ do comprador (tipo String); 

   - Qualidade – Indica se são Compradores, Vendedores, Executado, Exequente, Adquirente, Transmitente ou Terceiro (tipo String). 

- TipoCobranca - Tipo de Cobrança, onde 1 = INTEGRAL; 2 = PREFEITURA; 3 = ISENÇÃO TOTAL (tipo int); 

- CertidaoInteiroTeor - Certidão Inteiro Teor, onde: 0 = Não; 1  = Sim (tipo int); 

- TipoIsencao: 0 = Nenhuma; 1 = Assistência jurídica gratuita (tipo int); 

- NrProcesso: Número do processo (tipo string, preenchido quando TipoIsencao = 1) 

- FolhasProcesso: Folhas / processo (tipo string, preenchido quando TipoIsencao = 1) 

- DataGratuidade: Data da concessão da justiça gratuita (tipo string, preenchido quando TipoIsencao = 1) 

- FundamentoLegal: Fundamento legal (tipo string) 

- UrlArquivoGratuidade: Url para download do anexo com despacho (tipo string, preenchido quando TipoIsencao = 1) 

- ProtocoloOrigem: Protocolo origem de um pedido que foi reenviado 

- DadosConstrição: Cadeia de elementos referentes aos dados de do contrato quando pedido de constrição, onde: 

   - TipoConstricao – Informar o tipo de constrição do pedido (tipo String), onde PENHORA; ARRESTO, SEQUESTRO; 

   - Processo: Número do processo vinculado ao pedido de constrição (tipo String); 

   - Vara: Nome da vara vinculado ao pedido de constrição (tipo String); 

   - Usuario: Nome do usuário vinculado ao pedido de constrição (tipo String); 

   - NumeroProcesso: Número do processo vinculado ao pedido de constrição (tipo String); 

   - NaturezaProcesso: Natureza do processo vinculado ao pedido de constrição (tipo String), onde: EXECUÇÃO CIVIL; EXECUÇÃO TRABALISTA; EXECUÇÃO FISCAL, Ação Criminal; 

   - `o` ValorDivida: Valor da dívida informado no pedido de constrição (tipo Decimal); 

   - DataAutoTermo: Data do auto termo vinculado ao pedido de constrição, no formato aaaamm-dd (tipo string); 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|



**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

## 111 

|10|Request inválido.|
|---|---|
|11|O Hash de validação não foi informado.|
|12|O código informado para o contrato não é válido.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|51|Não foi possível obter os dados do contrato solicitado.|
|52|Não foi possível obter os dados dos compradores<br>vinculados ao contrato.|
|53|Não foi possível obter os dados dos vendedores<br>vinculados ao contrato.|
|54|Não foi possível obter os dados dos imovies de<br>constrição vinculados ao contrato.|
|55|Usuário não tem permissão para consultar o pedido<br>da instituição informada.|
|56|Não foi possível obter os dados das partes de<br>constrição vinculados ao contrato.|



## **3.10.19 Envelope de Entrada – GetPedidoAC_V7** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string(50)); 

- IDContrato – ID do contrato obtido da listagem de pedidos (tipo int). 

## **3.10.20 Envelope de Saída – GetPedidoAC_V7** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string(200)); 

- IDContrato - ID do contrato retornado pelo serviço (tipo int); 

- Protocolo - Protocolo do contrato retornado (tipo string); 

- IDStatus - Código do Status a ser filtrado. Para retornar todos, informar -1. Para uma lista dos valores possíveis abaixo (tipo int): 

## 1 - Em aberto 

- 2 - Processando 

- 3 - Prenotado 

- 4 - Calculado 

- 5 - Devolvido 

- 6 - Nota de Exigência 

- 7 - Registrado /Averbado 

- 8 - Reaberto - Não Concluído 

- 9 - Aguardando Pagamento 

- 10 - Pagamento Efetivado 

- 18 - Finalizado sem prática do Ato 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

112 

19 - Cancelamento de Prenotação 100 - Prazo Suspenso 

- IDCartorio - Código do cartório cujo contrato foi direcionado. Para uma lista dos cartórios possíveis conferir serviço CartoriosListar, item 3.17.1.1  (tipo int); 

- DataRemessa - Data de remessa do contrato obtido, formato: aaaa-mm-dd (tipo string); 

- Solicitante - Nome do solicitante informado na geração do contrato (tipo string); 

- Telefone - Telefone do solicitante informado na geração do contrato (tipo string); 

- Instituicao - Instituição do solicitante informada na geração do contrato (tipo string); 

- Email - E-mail do solicitante informado na geração do contrato (tipo string); 

- TipoDocumento - Tipo do contrato, onde 1 = Escritura Pública (tipo string); 

- TipoServico - Tipo do Serviço indicado, onde 1 = Registro/Averbação e 2 = Exame/Cálculo (tipo string); 

- ImportacaoExtratoXML - Indica se o contrato foi gerado a partir de uma importação de XML (tipo boolean); 

- DadosApresentante - Cadeia de elementos referentes ao apresentante, onde: 

   - Nome – nome do apresentante (tipo String); 

   - CPFCNPJ – CPF ou CNPJ do apresentante (tipo String); 

   - Email – e-mail do apresentante (tipo String); 

   - Via – tipo de via correspondente ao endereço do apresentante (tipo String); 

   - Endereco – endereço do apresentante (tipo String); 

   - Numero – número correspondente ao endereço do apresentante (tipo String); 

   - Complemento – complemento correspondente ao endereço do apresentante (tipo String); 

   - Bairro – bairro correspondente ao endereço do apresentante (tipo String); 

   - Cidade – cidade correspondente ao endereço do apresentante (tipo String); 

   - Estado – UF correspondente ao endereço do apresentante (tipo String); 

   - CEP – CEP correspondente ao endereço do apresentante (tipo String); 

   - DDD – DDD correspondente ao telefone do apresentante (tipo String); 

   - Telefone – telefone do apresentante (tipo String); 

- PrenotacaoDataInclusao - Quando prenotado, contém a data de inclusão da prenotação no formato aaaa-mm-dd (tipo string); 

- PrenotacaoDataVencimento - Quando prenotado, contém a data de vencimento da prenotação no formato aaaa-mm-dd (tipo string); 

- PrenotacaoDataReenvio - Quando prenotado, e se a prenotaçao foi reenviada, contém a data correspondente no formato aaaa-mm-dd (tipo string); 

- ValorServico - Valor de serviço informado pelo cartório (tipo decimal); 

- DataResposta - Data de resposta do contrato obtido, formato: aaaa-mm-dd (tipo string); 

- Resposta - Resposta fornecida na finalização do contrato (tipo string); 

- DadosAceite - Dados do aceite quando o contrato foi finalizado, contendo nome do responsável e data do aceite no formato aaaa-mm-dd(tipo string); 

- DadosImovel – Array de imóveis do contrato, onde: 

   - Matricula – matrícula do imóvel (tipo String); 

   - Via – tipo de via correspondente ao endereço do imóvel (tipo String); 

   - Endereco – endereço do imóvel (tipo String); 

   - Numero – número correspondente ao endereço do imóvel (tipo String); 

   - Complemento – complemento correspondente ao endereço do imóvel (tipo String); 

   - Bairro – bairro correspondente ao endereço do imóvel (tipo String); 

   - Cidade – cidade correspondente ao endereço do imóvel (tipo String); 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

113 

`o` Estado – UF correspondente ao endereço do imóvel (tipo String); 

- Partes  –Array de partes vinculados ao contrato, onde cada elemento possui os campos: 

   - Nome – nome do comprador (tipo String); 

   - CPFCNPJ – CPF ou CNPJ do comprador (tipo String); 

   - Qualidade – Indica se são Compradores, Vendedores, Executado, Exequente, Adquirente, Transmitente ou Terceiro (tipo String). 

- TipoCobranca - Tipo de Cobrança, onde 1 = INTEGRAL; 2 = PREFEITURA; 3 = ISENÇÃO TOTAL (tipo int); 

- CertidaoInteiroTeor - Certidão Inteiro Teor, onde: 0 = Não; 1  = Sim (tipo int); 

- TipoIsencao: 0 = Nenhuma; 1 = Assistência jurídica gratuita (tipo int); 

- NrProcesso: Número do processo (tipo string, preenchido quando TipoIsencao = 1) 

- FolhasProcesso: Folhas / processo (tipo string, preenchido quando TipoIsencao = 1) 

- DataGratuidade: Data da concessão da justiça gratuita (tipo string, preenchido quando TipoIsencao = 1) 

- FundamentoLegal: Fundamento legal (tipo string) 

- UrlArquivoGratuidade: Url para download do anexo com despacho (tipo string, preenchido quando TipoIsencao = 1) 

- ProtocoloOrigem: Protocolo origem de um pedido que foi reenviado 

- DadosConstrição: Cadeia de elementos referentes aos dados de do contrato quando pedido de constrição, onde: 

   - TipoConstricao – Informar o tipo de constrição do pedido (tipo String), onde PENHORA; ARRESTO, SEQUESTRO; 

   - Processo: Número do processo vinculado ao pedido de constrição (tipo String); 

   - Vara: Nome da vara vinculado ao pedido de constrição (tipo String); 

   - Usuario: Nome do usuário vinculado ao pedido de constrição (tipo String); 

   - NumeroProcesso: Número do processo vinculado ao pedido de constrição (tipo String); 

   - NaturezaProcesso: Natureza do processo vinculado ao pedido de constrição (tipo String), onde: EXECUÇÃO CIVIL; EXECUÇÃO TRABALISTA; EXECUÇÃO FISCAL, Ação Criminal; 

   - `o` ValorDivida: Valor da dívida informado no pedido de constrição (tipo Decimal); 

   - DataAutoTermo: Data do auto termo vinculado ao pedido de constrição, no formato aaaamm-dd (tipo string); 

- UrlArquivoMandado: Url para download do anexo com mandado (tipo string) 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|12|O código informado para o contrato não é válido.|
|45|Hash inválido.|



**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

## 114 

|46|Hash inválido: Hash já utilizado.|
|---|---|
|47|Hash inválido: Hash expirado.|
|51|Não foi possível obter os dados do contrato solicitado.|
|52|Não foi possível obter os dados dos compradores<br>vinculados ao contrato.|
|53|Não foi possível obter os dados dos vendedores<br>vinculados ao contrato.|
|54|Não foi possível obter os dados dos imovies de<br>constrição vinculados ao contrato.|
|55|Usuário não tem permissão para consultar o pedido<br>da instituição informada.|
|56|Não foi possível obter os dados das partes de<br>constrição vinculados ao contrato.|



## **3.10.21 Envelope de Entrada – GetPedidoAC_V8** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string(50)); 

- IDContrato – ID do contrato obtido da listagem de pedidos (tipo int). 

## **3.10.22 Envelope de Saída – GetPedidoAC_V8** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string(200)); 

- IDContrato - ID do contrato retornado pelo serviço (tipo int); 

- Protocolo - Protocolo do contrato retornado (tipo string); 

- IDStatus - Código do Status a ser filtrado. Para retornar todos, informar -1. Para uma lista dos valores possíveis abaixo (tipo int): 

1 - Em aberto 

- 2 - Processando 

- 3 - Prenotado 

- 4 - Calculado 

- 5 - Devolvido 

- 6 - Nota de Exigência 

- 7 - Registrado /Averbado 

- 8 - Reaberto - Não Concluído 

- 9 - Aguardando Pagamento 

- 10 - Pagamento Efetivado 

- 18 - Finalizado sem prática do Ato 

- 19 - Cancelamento de Prenotação 

- 100 - Prazo Suspenso 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

115 

- IDCartorio - Código do cartório cujo contrato foi direcionado. Para uma lista dos cartórios possíveis conferir serviço CartoriosListar, item 3.17.1.1  (tipo int); 

- DataRemessa - Data de remessa do contrato obtido, formato: aaaa-mm-dd (tipo string); 

- Solicitante - Nome do solicitante informado na geração do contrato (tipo string); 

- Telefone - Telefone do solicitante informado na geração do contrato (tipo string); 

- Instituicao - Instituição do solicitante informada na geração do contrato (tipo string); 

- Email - E-mail do solicitante informado na geração do contrato (tipo string); 

- TipoDocumento - Tipo do contrato, onde 1 = Escritura Pública (tipo string); 

- TipoServico - Tipo do Serviço indicado, onde 1 = Registro/Averbação e 2 = Exame/Cálculo (tipo string); 

- ImportacaoExtratoXML - Indica se o contrato foi gerado a partir de uma importação de XML (tipo boolean); 

- DadosApresentante - Cadeia de elementos referentes ao apresentante, onde: 

   - Nome – nome do apresentante (tipo String); 

   - CPFCNPJ – CPF ou CNPJ do apresentante (tipo String); 

   - Email – e-mail do apresentante (tipo String); 

   - Via – tipo de via correspondente ao endereço do apresentante (tipo String); 

   - Endereco – endereço do apresentante (tipo String); 

   - Numero – número correspondente ao endereço do apresentante (tipo String); 

   - Complemento – complemento correspondente ao endereço do apresentante (tipo String); 

   - Bairro – bairro correspondente ao endereço do apresentante (tipo String); 

   - Cidade – cidade correspondente ao endereço do apresentante (tipo String); 

   - Estado – UF correspondente ao endereço do apresentante (tipo String); 

   - CEP – CEP correspondente ao endereço do apresentante (tipo String); 

   - DDD – DDD correspondente ao telefone do apresentante (tipo String); 

   - Telefone – telefone do apresentante (tipo String); 

- PrenotacaoDataInclusao - Quando prenotado, contém a data de inclusão da prenotação no formato aaaa-mm-dd (tipo string); 

- PrenotacaoDataVencimento - Quando prenotado, contém a data de vencimento da prenotação no formato aaaa-mm-dd (tipo string); 

- PrenotacaoDataReenvio - Quando prenotado, e se a prenotaçao foi reenviada, contém a data correspondente no formato aaaa-mm-dd (tipo string); 

- ValorServico - Valor de serviço informado pelo cartório (tipo decimal); 

- DataResposta - Data de resposta do contrato obtido, formato: aaaa-mm-dd (tipo string); 

- Resposta - Resposta fornecida na finalização do contrato (tipo string); 

- DadosAceite - Dados do aceite quando o contrato foi finalizado, contendo nome do responsável e data do aceite no formato aaaa-mm-dd(tipo string); 

- DadosImovel – Array de imóveis do contrato, onde: 

   - Matricula – matrícula do imóvel (tipo String); 

   - Via – tipo de via correspondente ao endereço do imóvel (tipo String); 

   - Endereco – endereço do imóvel (tipo String); 

   - Numero – número correspondente ao endereço do imóvel (tipo String); 

   - Complemento – complemento correspondente ao endereço do imóvel (tipo String); 

   - Bairro – bairro correspondente ao endereço do imóvel (tipo String); 

   - Cidade – cidade correspondente ao endereço do imóvel (tipo String); 

   - Estado – UF correspondente ao endereço do imóvel (tipo String); 

- Partes  –Array de partes vinculados ao contrato, onde cada elemento possui os campos: `o` Nome – nome do comprador (tipo String); 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

116 

   - CPFCNPJ – CPF ou CNPJ do comprador (tipo String); 

   - Qualidade – Indica se são Compradores, Vendedores, Executado, Exequente, Adquirente, Transmitente ou Terceiro (tipo String). 

- TipoCobranca - Tipo de Cobrança, onde 1 = INTEGRAL; 2 = PREFEITURA; 3 = ISENÇÃO TOTAL (tipo int); 

- CertidaoInteiroTeor - Certidão Inteiro Teor, onde: 0 = Não; 1  = Sim (tipo int); 

- TipoIsencao: 0 = Nenhuma; 1 = Assistência jurídica gratuita (tipo int); 

- NrProcesso: Número do processo (tipo string, preenchido quando TipoIsencao = 1) 

- FolhasProcesso: Folhas / processo (tipo string, preenchido quando TipoIsencao = 1) 

- DataGratuidade: Data da concessão da justiça gratuita (tipo string, preenchido quando TipoIsencao = 1) 

- FundamentoLegal: Fundamento legal (tipo string) 

- UrlArquivoGratuidade: Url para download do anexo com despacho (tipo string, preenchido quando TipoIsencao = 1) 

- ProtocoloOrigem: Protocolo origem de um pedido que foi reenviado 

- DadosConstrição: Cadeia de elementos referentes aos dados de do contrato quando pedido de constrição, onde: 

   - TipoConstricao – Informar o tipo de constrição do pedido (tipo String), onde PENHORA; ARRESTO, SEQUESTRO; 

   - Processo: Número do processo vinculado ao pedido de constrição (tipo String); 

   - Vara: Nome da vara vinculado ao pedido de constrição (tipo String); 

   - Usuario: Nome do usuário vinculado ao pedido de constrição (tipo String); 

   - NumeroProcesso: Número do processo vinculado ao pedido de constrição (tipo String); 

   - NaturezaProcesso: Natureza do processo vinculado ao pedido de constrição (tipo String), onde: EXECUÇÃO CIVIL; EXECUÇÃO TRABALISTA; EXECUÇÃO FISCAL, Ação Criminal; 

   - `o` ValorDivida: Valor da dívida informado no pedido de constrição (tipo Decimal); 

   - DataAutoTermo: Data do auto termo vinculado ao pedido de constrição, no formato aaaamm-dd (tipo string); 

- UrlArquivoMandado: Url para download do anexo com mandado (tipo string) 

- AverbacaoCDA: Cadeia de elementos referentes aos dados de do contrato quando pedido de averbação CDA, onde: 

   - DeclaracaoCredor: declaração do credor do pedido de averbação. 

   - OrgaoApresentante: Orgão apresentante vinculado ao pedido de averbação. 

   - Dividas: Cadeia de elementos referentes aos dados de dividas do imóvel  do contrato quando pedido de averbação CDA, onde: 

      - NumeroCDA: número da CDA do titulo do imóvel vinculado ao pedido de averbação. 

      - Valor: valor do titulo do imóvel vinculado ao pedido de averbação. 

      - DataInscricao: data de inscrição do titulo do imóvel vinculado ao pedido de 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

117 

## averbação. 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|12|O código informado para o contrato não é válido.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|51|Não foi possível obter os dados do contrato solicitado.|
|52|Não foi possível obter os dados dos compradores<br>vinculados ao contrato.|
|53|Não foi possível obter os dados dos vendedores<br>vinculados ao contrato.|
|54|Não foi possível obter os dados dos imovies de<br>constrição vinculados ao contrato.|
|55|Usuário não tem permissão para consultar o pedido<br>da instituição informada.|
|56|Não foi possível obter os dados das partes de<br>constrição vinculados ao contrato.|



## **3.10.23 Envelope de Entrada - AlterarPedidoAC** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string(50)); 

- IDContrato - ID do contrato obtido da listagem de pedidos (tipo int); 

- TipoDocumento - Tipo de contrato a ser alterado, onde 1 = Escritura Pública (tipo int); 

- ApresentanteNome - Nome do apresentante vinculado ao contrato (tipo string); 

- ApresentanteEmail - E-mail do apresentante vinculado ao contrato (tipo string); 

- EnderecoVia - Via referente ao endereço do apresentante vinculado ao contrato (Rua, Avenida, etc) (tipo string(20)); 

- EnderecoLogradouro - Logradouro referente ao endereço do apresentante vinculado ao contrato (tipo string); 

- EnderecoNumero - Número referente ao endereço do apresentante vinculado ao contrato (tipo int); 

- EnderecoComplemento - Complemento referente ao endereço do apresentante vinculado ao contrato (tipo string); 

- EnderecoBairro - Bairro referente ao endereço do apresentante vinculado ao contrato (tipo string); 

- EnderecoUF – UF do Estado referente ao endereço do apresentante vinculado ao contrato (tipo string(2)); 

- EnderecoCidade - Cidade referente ao endereço do apresentante vinculado ao contrato (tipo string); 

- EnderecoCEP - CEP referente ao endereço do apresentante vinculado ao contrato (tipo int); 

- ContatoDDD - DDD referente ao telefone de contato do apresentante vinculado ao contrato (tipo string); 

- ContatoTelefone - Telefone de contato (sem DDD) do apresentante vinculado ao contrato (tipo 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

118 

string). 

## **3.10.24 Envelope de Saída - AlterarPedidoAC** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string(200)). 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|12|O código informado para o contrato não é válido.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|51|Não foi possível recuperar o contrato para edição.|
|55|Usuário não tem permissão para consultar o pedido<br>da instituição informada.|



## **3.10.25 Envelope de Entrada - SetPrenotacaoAC** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string(50)); 

- IDContrato - ID do contrato obtido da listagem de pedidos (tipo int); 

- NumeroPrenotacao - Número da prenotação a ser cadastrada (tipo string); 

- DataPrenotacao - Data da prenotação a ser cadastrada, no formato aaaa-mm-dd (tipo string); 

- DataVencimento - Data de vencimento da prenotação a ser cadastrada, no formato aaaa-mm-dd (tipo string); 

- Senha - Senha da prenotação a ser cadastrada (campo opcional, tipo string). 

## **3.10.26 Envelope de Saída - SetPrenotacaoAC** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string(200)). 

Listagem de erros possíveis retornados no envelope de saída: 

Codigoerro Errodescricao 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

## 119 

|0|Erro de sistema.|
|---|---|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|12|O código informado para o contrato não é válido.|
|13|O número de prenotação não é válido.|
|14|A data de prenotação não foi informada.|
|15|A data de vencimento não foi informada.|
|16|A data de prenotação é inválida.|
|17|A data de vencimento é inválida.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|51|Não foi possível recuperar o contrato para prosseguir<br>com a prenotação.|
|52|Usuário não tem permissão para alterar esse<br>contrato.|
|53|O contrato informado não é do tipo<br>Registro/Averbação e não é possível prosseguir com<br>a prenotação.|
|54|Não é possível prosseguir pois o contrato informado<br>já foi prenotado.|
|55|Não foi possível incluir a prenotação para o contrato<br>informado.|
|56|Não foi possível prenotar o pedido, o contrato<br>informado está com o status DEVOLVIDO.|



## **3.10.27 Envelope de Entrada - SetProrrogarPrenotacaoAC** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string(50)); 

- IDContrato – ID do contrato obtido da listagem de pedidos (tipo int); 

- Motivo – Motivo da prorrogação da prenotação (tipo string). 

## **3.10.28 Envelope de Saída - SetProrrogarPrenotacaoAC** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string(200)). 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|12|O código informado para o contrato não é válido.|
|13|O motivo da prorrogação da prenotação não foi|



**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

## 120 

||informado.|
|---|---|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|51|Não foi possível recuperar o contrato para prosseguir<br>com a prenotação.|
|52|Usuário não tem permissão para alterar esse<br>contrato.|
|53|Não é possível prosseguir pois não consta<br>prenotação no contrato informado.|



## **3.10.29 Envelope de Entrada - SetCustasAC** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string(50)); 

- IDContrato - ID do contrato obtido da listagem de pedidos (tipo int); 

- ValorCustas – Valor das custas a ser informado (tipo decimal). 

## **3.10.30 Envelope de Saída - SetCustasAC** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string(200)). 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|12|O código informado para o contrato não é válido.|
|13|O valor das custas deve ser positivo ou igual a zero.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|50|Não é possível informar custas de pedido com status<br>nota de exigência. Necessário aguardar o<br>cumprimento.|
|51|Não foi possível recuperar o contrato para prosseguir<br>com o valor das custas.|
|52|Usuário não tem permissão para alterar esse<br>contrato.|
|53|O contrato informado já teve o valor das custas<br>informado.|
|54|Não foi possível salvar o valor das custas para o<br>contrato informado.|
|55|Não foi possível identificar a forma de pagamento|



**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

121 

configurada ao cartório. 

## **3.10.31 Envelope de Entrada - SetCustasComplementarAC** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string(50)); 

- IDContrato - ID do contrato obtido da listagem de pedidos (tipo int); 

- ValorCustas – Valor das custas a ser informado (tipo decimal). 

## **3.10.32 Envelope de Saída - SetCustasComplementarAC** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string(200)). 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|12|O código informado para o contrato não é válido.|
|13|O valor das custas deve ser positivo ou igual a zero.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|50|Não é possível informar custas de pedido com status<br>nota de exigência. Necessário aguardar o<br>cumprimento.|
|51|Não foi possível recuperar o contrato para prosseguir<br>com o valor das custas.|
|52|Usuário não tem permissão para alterar esse<br>contrato.|
|53|O contrato informado já teve o valor das custas<br>informado.|
|54|Não foi possível salvar o valor das custas para o<br>contrato informado.|
|55|Não foi possível identificar a forma de pagamento<br>configurada ao cartório.|



## **3.10.33 Envelope de Entrada - SetPrenotacaoExameCalculoAC** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string(50)); 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

122 

- IDContrato - ID do contrato obtido da listagem de pedidos (tipo int); 

- NumeroPrenotacao - Número da prenotação a ser cadastrada (tipo string); 

- DataPrenotacao - Data da prenotação a ser cadastrada, no formato aaaa-mm-dd (tipo string); 

- DataVencimento - Data de vencimento da prenotação a ser cadastrada, no formato aaaa-mm-dd (tipo string). 

## **3.10.34 Envelope de Saída - SetPrenotacaoExameCalculoAC** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string(200)). 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|12|O código informado para o contrato não é válido.|
|13|O número de prenotação não é válido.|
|14|A data de prenotação não foi informada.|
|15|A data de prenotação é inválida.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|51|Não foi possível recuperar o contrato para prosseguir<br>com a protocolagem.|
|52|Usuário não tem permissão para alterar esse<br>contrato.|
|53|O contrato informado não é do tipo Exame/Cálculo e<br>não é possível prosseguir com a protocolagem.|
|54|Não é possível prosseguir pois o exame/cálculo do<br>contrato já foi realizado.|
|55|Não foi possível protocolar o contrato de<br>exame/cálculo.|



## **3.10.35 Envelope de Entrada - SetContratoAverbadoAC** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string(50)); 

- IDContrato - ID do contrato obtido da listagem de pedidos (tipo int); 

- Resposta – Resposta a ser adicionada na averbação do contrato (tipo string); 

- CertidaoAverbacao - Array de arquivos, apresentando as seguintes informações: 

   - Descricao – Nome que descreve o arquivo (tipo string); 

   - URLArquivo – URL do arquivo. O cartório precisa informar uma URL válida para download do arquivo anexado. Os arquivos informados serão colocados em uma 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

123 

fila e serão baixados posteriormente pelo sistema. O pedido não será efetivamente respondido antes que todos os arquivos sejam baixados. (tipo string). 

Layout Xml Retorno 

Para envio dos dados de retorno seguir o modelo abaixo: 

O parâmetro descrição do anexo deverá receber o seguinte nome “XMLRETORNO” 

<?xmlversion="1.0" encoding="UTF-8"?> <ROOT> <CONTRATO> <CNS></CNS> <PROTOCOLO_SAEC></PROTOCOLO_SAEC> <NUMERO_PRENOTACAO></NUMERO_PRENOTACAO> <DATA_REGISTRO></DATA_REGISTRO> <ATOS_PRATICADOS> <ATO_PRATICADO> <CODIGO_ATO></CODIGO_ATO><!— Lista abaixo --> <NUMERO_MATRICULA></NUMERO_MATRICULA> <NUMERO_ATO></NUMERO_ATO> 

<DESCRICAO_OUTROS></DESCRICAO_OUTROS><!-- usar somente quando o código ato for 999 - -> 

<ATO_PRATICADO> 

</ATOS_PRATICADOS> 

</CONTRATO> 

</ROOT> 

## **Lista dos atos praticados** 

|**Código**|**Descrição**|
|---|---|
|1|Venda e compra|
|2|Hipoteca|
|3|Alienação fiduciária|
|4|Portabilidade|
|6|Emissão da CCI|
|8|Convenio de Limite de Crédito com Alienação<br>Fiduciária|
|9|compromisso de venda e compra|
|10|Doação|
|11|Usufruto|
|12|Inventário|
|13|Part. Separação/Divórcio|
|14|Dação em pagamento|
|15|Permuta|
|16|Conferência de bens|



**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

124 

|17|Bem de família|
|---|---|
|18|Aditamento de cédula|
|19|Cancelamento de garantias|
|999|Outros|



## **3.10.36 Envelope de Saída - SetContratoAverbadoAC** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string(200)). 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|12|O código informado para o contrato não é válido.|
|13|A Resposta não foi informada.|
|14|Não foi informada nenhuma certidão para anexar ao<br>contrato.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|51|Não foi possível recuperar o contrato para prosseguir<br>com a resposta.|
|52|Usuário não tem permissão para alterar esse<br>contrato.|
|53|Esse contrato já foi respondido com averbação ou<br>devolução.|
|54|Contrato ainda sem confirmação de pagamento.|
|60|Não foi possível desbloquear os arquivos.|
|101|Não foi possível cadastrar o arquivo.|
|102|Arquivo não encontrado: [URLArquivo]|
|103|Não foi possível verificar se o arquivo existe.|
|104|Extensão não permitida. Apenas arquivos .pdf, .docou<br>.p7s são permitidos.|
|105|Aplicação inválida.|
|501|Campos obrigatórios não foram informados.|
|502|Já existe resposta para esse pedido. O status do<br>pedido será alterado assim que todos os arquivos<br>informados forem baixados pelo sistema do Ofício<br>Eletrônico.|
|505|Não Informado XML do retorno dos atos praticados<br>neste protocolo.|



**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

125 

## **3.10.37 Envelope de Entrada – SetContratoAverbadoAC_DocID** Os parâmetros de entrada são 

- Hash – Hash para validação da mensagem (tipo string(50)); 

- IDContrato - ID do contrato obtido da listagem de pedidos (tipo int); 

- Resposta – Resposta a ser adicionada na averbação do contrato (tipo string); 

- CertidaoAverbacao - Array de arquivos, apresentando as seguintes informações: 

   - Descricao – Nome que descreve o arquivo (tipo string); 

   - DocumentID - Identifica o anexo no AssinadorWeb (tipo string); 

Layout Xml Retorno 

Para envio dos dados de retorno seguir o modelo abaixo: 

O parâmetro descrição do anexo deverá receber o seguinte nome “XMLRETORNO” 

<?xmlversion="1.0" encoding="UTF-8"?> 

<ROOT> 

<CONTRATO> 

<CNS></CNS> 

<PROTOCOLO_SAEC></PROTOCOLO_SAEC> 

<NUMERO_PRENOTACAO></NUMERO_PRENOTACAO> 

<DATA_REGISTRO></DATA_REGISTRO> 

<ATOS_PRATICADOS> 

<ATO_PRATICADO> 

<CODIGO_ATO></CODIGO_ATO><!— Lista abaixo --> <NUMERO_MATRICULA></NUMERO_MATRICULA> <NUMERO_ATO></NUMERO_ATO> 

<DESCRICAO_OUTROS></DESCRICAO_OUTROS><!-- usar somente quando o código ato for 999 - 

-> 

<ATO_PRATICADO> 

</ATOS_PRATICADOS> 

</CONTRATO> 

</ROOT> 

## **Lista dos atos praticados** 

|**Código**|**Descrição**|
|---|---|
|1|Venda e compra|
|2|Hipoteca|
|3|Alienação fiduciária|
|4|Portabilidade|
|6|Emissão da CCI|
|8|Convenio de Limite de Crédito com Alienação<br>Fiduciária|
|9|compromisso de venda e compra|
|10|Doação|



**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

## 126 

|11|Usufruto|
|---|---|
|12|Inventário|
|13|Part. Separação/Divórcio|
|14|Dação em pagamento|
|15|Permuta|
|16|Conferência de bens|
|17|Bem de família|
|18|Aditamento de cédula|
|19|Cancelamento de garantias|
|999|Outros|



## **3.10.38 Envelope de Saída – SetContratoAverbadoAC_DocID** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string(200)). 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|12|O código informado para o contrato não é válido.|
|13|A Resposta não foi informada.|
|14|Não foi informada nenhuma certidão para anexar ao<br>contrato.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|51|Não foi possível recuperar o contrato para prosseguir<br>com a resposta.|
|52|Usuário não tem permissão para alterar esse<br>contrato.|
|53|Esse contrato já foi respondido com averbação ou<br>devolução.|
|54|Contrato ainda sem confirmação de pagamento.|
|60|Não foi possível desbloquear os arquivos.|
|101|Não foi possível cadastrar o arquivo.|
|102|Arquivo não encontrado: [DocumentID]|
|103|Não foi possível verificar se o arquivo existe.|
|104|Extensão não permitida. Apenas arquivos .pdf, .docou<br>.p7s são permitidos.|
|105|Aplicação inválida.|
|501|Campos obrigatórios não foram informados.|
|502|Já existe resposta para esse pedido. O status do<br>pedido será alterado assim que todos os arquivos<br>informados forem baixados pelo sistema do Ofício|



**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

127 

||Eletrônico.|
|---|---|
|505|Não Informado XML do retorno dos atos praticados<br>neste protocolo.|



## **3.10.39 Envelope de Entrada - SetContratoExigenciaAC** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string(50)); 

- IDContrato - ID do contrato obtido da listagem de pedidos (tipo int); 

- ExigenciaFinal – Quando um contrato do tipo de serviço Exame/Cálculo, a exigência final corresponde ao último ato cadastrado (impossibilitando cadastro de novas exigências), informando inclusive o valor do contrato se alterado posteriormente para Registro/Averbação (tipo boolean); 

- Resposta – Resposta a ser adicionada na exigência do contrato (tipo string); 

- Anexos - Array de arquivos, apresentando as seguintes informações: 

   - Descricao – Nome que descreve o arquivo (tipo string); 

   - URLArquivo – URL do arquivo. O cartório precisa informar uma URL válida para download do arquivo anexado. Os arquivos informados serão colocados em uma fila e serão baixados posteriormente pelo sistema. O pedido não será efetivamente respondido antes que todos os arquivos sejam baixados. (tipo string). 

## **3.10.40 Envelope de Saída - SetContratoExigenciaAC** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string(200)). 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|12|O código informado para o contrato não é válido.|
|13|A Resposta não foi informada.|
|14|Não foi informado nenhum anexo para vincular à<br>exigência.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|51|Não foi possível recuperar o contrato para prosseguir<br>com a resposta.|
|52|Usuário não tem permissão para alterar esse<br>contrato.|
|53|Esse contrato já foi respondido com averbação ou<br>devolução.|



**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

## 128 

|54|Contrato ainda sem confirmação de pagamento.|
|---|---|
|60|Não foi possível desbloquear os arquivos.|
|101|Não foi possível cadastrar o arquivo.|
|102|Arquivo não encontrado: [URLArquivo]|
|103|Não foi possível verificar se o arquivo existe.|
|104|Extensão não permitida. Apenas arquivos .pdf, .docou<br>.p7s são permitidos.|
|105|Aplicação inválida.|
|501|Campos obrigatórios não foram informados.|
|502|Já existe resposta para esse pedido. O status do<br>pedido será alterado assim que todos os arquivos<br>informados forem baixados pelo sistema.|



## **3.10.41 Envelope de Entrada – SetContratoExigenciaAC_DocID** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string(50)); 

- IDContrato - ID do contrato obtido da listagem de pedidos (tipo int); 

- ExigenciaFinal – Quando um contrato do tipo de serviço Exame/Cálculo, a exigência final corresponde ao último ato cadastrado (impossibilitando cadastro de novas exigências), informando inclusive o valor do contrato se alterado posteriormente para Registro/Averbação (tipo boolean); 

- Resposta – Resposta a ser adicionada na exigência do contrato (tipo string); 

- Anexos - Array de arquivos, apresentando as seguintes informações: 

   - Descricao – Nome que descreve o arquivo (tipo string); 

   - DocumentID - Identifica o anexo no AssinadorWeb (tipo string). 

## **3.10.42 Envelope de Saída - SetContratoExigenciaAC_DocID** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string(200)). 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|12|O código informado para o contrato não é válido.|
|13|A Resposta não foi informada.|
|14|Não foi informado nenhum anexo para vincular à<br>exigência.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|51|Não foi possível recuperar o contrato para prosseguir<br>com a resposta.|



**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

## 129 

|52|Usuário não tem permissão para alterar esse<br>contrato.|
|---|---|
|53|Esse contrato já foi respondido com averbação ou<br>devolução.|
|54|Contrato ainda sem confirmação de pagamento.|
|60|Não foi possível desbloquear os arquivos.|
|101|Não foi possível cadastrar o arquivo.|
|102|Arquivo não encontrado: [DocumentID]|
|103|Não foi possível verificar se o arquivo existe.|
|104|Extensão não permitida. Apenas arquivos .pdf, .docou<br>.p7s são permitidos.|
|105|Aplicação inválida.|
|501|Campos obrigatórios não foram informados.|
|502|Já existe resposta para esse pedido. O status do<br>pedido será alterado assim que todos os arquivos<br>informados forem baixados pelo sistema.|



## **3.10.43 Envelope de Entrada - SetContratoDevolvidoAC** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string(50)); 

- IDContrato - ID do contrato obtido da listagem de pedidos (tipo int); 

- Resposta – Resposta a ser adicionada na devolução do contrato (tipo string). 

## **3.10.44 Envelope de Saída - SetContratoDevolvidoAC** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string(200)). 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|12|O código informado para o contrato não é válido.|
|13|A Resposta não foi informada.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|51|Não foi possível recuperar o contrato para prosseguir<br>com a resposta.|
|52|Usuário não tem permissão para alterar esse<br>contrato.|
|54|O status atual do pedido não permite resposta com<br>exigência.|



**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

130 

## **3.10.45 Envelope de Entrada - ListDocumentosRepositorioAC** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string(50)); 

- IDContrato - ID do contrato obtido da listagem de pedidos (tipo int); 

- IDDepartamento - ID do departamento vinculado ao documento do repositório (opcional, tipo int); 

- CPFVinculado - CPF vinculado ao documento do repositório (opcional, tipo string); 

- DataVencimentoInicial - Data de vencimento inicial do documento do repositório, no formato aaaamm-dd (opcional, tipo string); 

- DataVencimentoFinal - Data de vencimento final do documento do repositório, no formato aaaamm-dd (opcional, tipo string). 

## **3.10.46 Envelope de Saída - ListDocumentosRepositorioAC** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string(200)); 

- Documentos - (se RETORNO = true)  Array dos documentos encontrados, apresentando as seguintes informações: 

   - IDArquivo – Código do documento retornado (tipo int); 

   - Convenio - Nome do departamento vinculado ao documento do repositório (tipo int); 

   - CPFAssociado - CPF vinculado ao documento do repositório (tipo string); 

   - DataCadastro - Data de cadastro do documento retornado, no formato aaaa-mm-dd (tipo string); 

   - DataVencimento - Data de vencimento do documento retornado, no formato aaaa-mm-dd (tipo string). 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|12|O código informado para o contrato não é válido.|
|13|A data de vencimento inicial é inválida.|
|14|A data de vencimento final é inválida.|
|15|O período da data de vencimento não pode ser maior<br>que 7 dias.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|51|Não foi possível obter os pedidos.|



**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

131 

## **3.10.47 Envelope de Entrada - ContratoXMLtoPDF** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string(50)); 

- URLArquivo – URL do Contrato XML (tipo string(300)); 

## **3.10.48 Envelope de Saída - ContratoXMLtoPDF** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string(200)); 

- Arquivo – (se RETORNO = true) String em formato BASE64, contendo os bytes do contrato enviado pela URL convertidos para o formato PDF e com formatação de campos. 

## Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|12|A URL informada é inválida|
|13|Arquivo informado está em formato inválido.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|51|Usuário inválido. Apenas usuários de cartórios são<br>permitidos.|
|55|Usuário não tem permissão para acessar esse<br>arquivo.|



## **3.10.49 Envelope de Entrada - SetContratoCumprimentoExigenciaRI** Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string(50)); 

- IDContrato - ID do contrato obtido da listagem de pedidos (tipo int); 

## **3.10.50 Envelope de Saída - SetContratoCumprimentoExigenciaRI** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string(200)). 

Listagem de erros possíveis retornados no envelope de saída: 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

## 132 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|12|O código informado para o contrato não é válido.|
|13|O valor das custas deve ser positivo e superior a<br>zero.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|51|Não foi possível recuperar o contrato para prosseguir.|
|52|Usuário não tem permissão para alterar esse<br>contrato.|
|53|Não foi possível alterar status desse contrato.|
|54|O status atual do pedido não permite resposta com<br>cumprimento de exigência|



## **3.10.51 Envelope de Entrada - SetFinalizarProtocoloAC** Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string(50)); 

- IDContrato - ID do contrato obtido da listagem de pedidos (tipo int); 

- Anexos 

   - NomeArquivo - Nome original do arquivo no sistema de origem (tipo string) 

   - `o` ArquivoBase64 - Conteúdo do arquivo convertido em Base64 (tipo string) 

## **3.10.52 Envelope de Saída - SetFinalizarProtocoloAC** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string(200)). 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|12|O código informado para o contrato não é válido.|
|14|O nome do arquivo não foi informado.|
|15|O campo ArquivoBase64 deve ser preenchido com o<br>conteúdo do arquivo.|
|16|Não foi possível efetuar o upload do arquivo.|
|25|Somente são permitidos arquivos com extensão .PDF|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|51|Não foi possível recuperar o contrato para prosseguir.|
|52|Usuário não tem permissão para alterar esse|



**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

## 133 

||contrato.|
|---|---|
|53|Não foi possível alterar status desse contrato.|
|54|O status atual do pedido não permite finalizar sem a<br>prática do ato.|
|160|Não são permitidos arquivos com extensão P7S.|
|**3.10.53**<br>**Envelope de entrada – ListCustasAC**<br>Os parâmetros de entrada são:||



   - ⚫ Hash – Hash para validação da mensagem (tipo string(50)); 

- ⚫ IDContrato – ID do contrato (tipo int) 

- **3.10.54 Envelope de Saída – ListaCustasAC** Os parâmetros de saída são: 

   - ⚫ RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

   - ⚫ CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

   - ⚫ IDCustas – ID da Custas vinculado ao contrato (tipo int); 

   - ⚫ Status – Status da Custas (tipo string); 

   - ⚫ ValorCustas - Valor das custas a serem pagas (tipo decimal); 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|12|O código informado para o contrato não é válido.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|51|Não foi possível obter as Custas|



|**3.10.55**<br>**Envelope de Entrada – SetBaixacustasAC**|
|---|
|Os parâmetros de entrada são:|



   - ⚫ Hash – Hash para validação da mensagem (tipo string(50)); ⚫ IDCustas – ID das Custas as ser baixada (tipo int); 

- **3.10.56 Envelope de Saída – SetBaixaCustasAC** Os parâmetros de saída são: 

   - ⚫ RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); ⚫ CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

   - ⚫ ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string(200)). 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|12|O código informado para as custas não é válido.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|51|Não foi possível obter o contrato relacionado as<br>custas.|
|52|Não foi possível obter o pagamento relacionado as|



**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

134 

||custas com convênio.|
|---|---|
|53|Não foi possível obter  o pagamento relacionado as<br>custas com cliente comum.|
|54|Não foi possível obter o pagamento relacionado as<br>custas.|
|55|Não foi possível realizar a baixa do pagamento.|
