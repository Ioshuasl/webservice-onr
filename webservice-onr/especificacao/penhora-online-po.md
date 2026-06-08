# WSOficio — Penhora Online (PO)

> Extraído de [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) (seções 3.3).

---
## **3.3 Penhora Online** 

O ONR disponibiliza o serviço de Penhora Online através de web services contemplando as seguintes funcionalidades: 

- A. Listagem de Pedidos 

Retorna uma lista de pedidos de acordo com os parâmetros informados. 

- B. Listagem de Varas 

Retorna uma lista das varas cadastradas e ativas no sistema o ONR. 

- C. Obter Pedido 

Esse serviço permite recuperar os dados de um pedido específico. 

- D. Listagem de Boletos Bancários 

Retorna uma lista dos boletos associados a um processo. 

- E. Baixa de Boleto Bancário 

Permite efetuar a baixa de um boleto no sistema do ONR. 

- F. Informar Prenotação 

Permite informar a prenotação de um pedido de penhora. 

- G. Informar Custas 

Permite informar custas de um pedido de penhora. 

- H. Responder pedido de penhora com averbação 

Permite responder um pedido de penhora com averbação. 

- I. Responder pedido de penhora com exigência Permite responder um pedido de penhora com exigências. 

- J. Responder pedido de certidão 

Permite responder um pedido de certidão - pessoa e matrícula. 

- K. Responder pedido de certidão com devolução 

Permite responder um pedido de certidão com devolução - pessoa e matrícula. 

- L. Responder pedidos com negativa em lote 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

31 

Permite responder um ou mais pedidos de pessoa com negativa. 

- M. Listagem de pedidos com a finalidade de importação de dados. 

Serviço com a finalidade de substituir o arquivo de exportação gerado no Ofício Eletrônico. 

- O contrato WSDL para homologação pode ser visualizado em: https://hml3- wsoficio.onr.org.br/penhoraonline.asmx?wsdl 

Métodos a serem referenciados: **ListPedidosPO;  ListVarasPO;  GetPedidoPO; ListBoletosPO; SetBaixaBoletoPO; SetPrenotacaoPO; SetCustasPO; SetPenhoraAverbadoPO; SetPenhoraExigenciaPO; SetPedidoPessoaRespondidoPO; SetPedidoPessoaDevolvidoPO; SetPedidoMatriculaRespondidoPO; SetPedidoMatriculaDevolvidoPO; SetPedidoNegativaLotePO; ListPedidosExportacaoPO; SetPedidoFinalizarPrenotacaoVencida.** 

## **3.3.1 Envelope de Entrada - ListPedidosPO** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string); 

- MaxRowPerPage – Quantidade máxima de registros a serem retornados por página (tipo int); 

- ● PageNumber – Página a ser retornada (tipo int); 

- Protocolo – Protocolo a ser filtrado – * opcional (tipo string); 

- IDVara – Código da Vara a ser filtrado. Para retornar todos, informar -1. Para obter os códigos das Varas conferir o método ListVarasPO, item 3.3.3 (tipo int); 

- IDTipoPedido – Código do tipo do pedido a ser filtrado (tipo int). Valores possíveis: 

   - 1 = Pedido Matrícula 

   - 2 = Pedido Pessoa 

   - 3 = Pedido Penhora 

   - -1 = Todos 

- IDStatus – Código do status a ser filtrado (tipo int). Valores possíveis: 

   - 1 = Aberto 

   - 2 = Respondido 

   - 3 = Devolvido 

   - 5 = Finalizado sem Pagamento 

   - 7 = Nota de Exigência 

   - 8 = Reaberto não Concluído 

   - 9 = Prenotado 

   - 10 = Aguardando Pagto 

   - 11 = Aguardando Pagto – Vencido 

   - 12 = Não Prenotado 

   - 13 = Pagamento Efetivado (Penhoras Pagas) 

   - 14 = Registro / Averbação 

   - -1 = Todos 

- DataSolicitacaoInicial – Data da solicitação inicial a ser filtrada, formato: aaaa-mm-dd (tipo string); 

- DataSolicitacaoFinal – Data da solicitação final a ser filtrada, formato: aaaa-mm-dd (tipo string); 

- ● DataRespostaInicial – Data da resposta inicial a ser filtrada, formato: aaaa-mm-dd – * opcional 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

32 

(tipo string); 

- DataRespostaFinal – Data da resposta final a ser filtrada, formato: aaaa-mm-dd – * opcional (tipo string). 

## **3.3.2 Envelope de Saída - ListPedidosPO** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string); 

- QtdeRegistros – (se RETORNO = true)  Quantidade total de registros encontrados (tipo int); 

- QtdePaginas  – (se RETORNO = true)  Quantidade total de páginas, de acordo com o total de registros encontrados e com a quantidade máxima de registros por página que foi informada no envelope de entrada - MaxRowPerPage - (tipo int); 

- Pedidos - (se RETORNO = true)  Array dos pedidos encontrados, apresentando as seguintes informações: 

   - IDPedido – Código do pedido (tipo int); 

   - Protocolo – Protocolo do Pedido (tipo string); 

   - IDVara – Código da Vara (tipo int); 

   - Vara – Nome da Vara (tipo string); 

   - IDTipoPedido – Código do tipo do pedido – verificar tipos possíveis no item 3.3.1 - (tipo int). 

   - IDStatus – Código do status – verificar tipos possíveis no item 3.3.1 -  (tipo int); 

   - DataSolicitacao – Data da solicitação, formato: aaaa-mm-ddhh:mm:ss (tipo string); 

   - DataResposta – Data da resposta, formato: aaaa-mm-ddhh:mm:ss  (tipo string). 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|12|A quantidade de registros por página informada é<br>inválida. A quantidade mínima permitida é 10.|
|13|A página informada é inválida.|
|14|A Vara informada é inválida.|
|15|O tipo do pedido informado é inválido.|
|16|O Status informado é inválido.|
|17|A data de solicitação inicial não foi informada.|
|18|A data de solicitação final não foi informada.|
|19|A data de solicitação inicial é inválida.|
|20|A data de solicitação final é inválida.|
|21|O período da data de solicitação não pode ser maior<br>que 30 dias.|
|22|A data de resposta inicial é inválida.|
|23|A data de resposta final é inválida.|
|30|A página informada é inválida. Página máxima<br>possível: [PAGINA]|



**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

33 

|45|Hash inválido.|
|---|---|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|51|Não foi possível obter os pedidos.|



## **3.3.3 Envelope de Entrada - ListVarasPO** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string); 

- IDEstado – Código do Estado a ser filtrado. Para retornar todos, informar -1 (tipo int); 

- IDComarca – Código da Comarca a ser filtrada. Para retornar todas, informar -1 (tipo int); 

- IDForo – Código do Foro a ser filtrado. Para retornar todos, informar -1 (tipo int). 

## **3.3.4 Envelope de Saída - ListVarasPO** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string); 

- Varas - (se RETORNO = true)  Array das Varas encontradas, apresentando as seguintes informações: 

   - IDVara – Código da Vara(tipo int); 

   - IDForo – Código do Foro (tipo int); 

   - IDComarca – Código da Comarca (tipo int); 

   - IDEstado – Código do Estado (tipo int); 

   - Vara – Nome da Vara (tipo string); 

   - Foro – Nome do Foro (tipo string); 

   - Comarca – Nome da Comarca (tipo string); 

   - Estado – Nome do Estado (tipo string). 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|12|O IDEstado informado é inválido.|
|13|O IDComarca informado é inválido.|
|14|O IDForo informado é inválido.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|51|Não foi possível obter as Varas.|



**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

34 

## **3.3.5 Envelope de Entrada - GetPedidoPO** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string); 

- IDPedido – Código do pedido (tipo int); 

## **3.3.6 Envelope de Saída - GetPedidoPO** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string); 

- IDTipoPedido – (se RETORNO = true)  Código do tipo do pedido – verificar tipos possíveis no item 3.3.1 - (tipo int); 

- IDStatus – (se RETORNO = true)  Código do status do pedido – verificar tipos possíveis no item 3.3.1 - (tipo int); 

- IDProcesso  – (se RETORNO = true)  Código do processo (tipo int); 

- IDVara – (se RETORNO = true)  Código da Vara (tipo int); 

- IDBoleto – (se RETORNO = true) Código do boleto, se existir. Se não existir retorna 0 (zero) (tipo int); 

- Protocolo – (se RETORNO = true) Protocolo do pedido (tipo string); 

- NumeroProcesso – (se RETORNO = true) Número do processo (tipo string); 

- Observacao – (se RETORNO = true) Observações (tipo string); 

- DataSolicitacao – (se RETORNO = true)  Data da solicitação, formato: aaaa-mm-ddhh:mm:ss (tipo string); 

- TipoResposta – (se RETORNO = true e se foi respondido)  Tipo da resposta (tipo string). Valores possíveis: 

   - C = Certidão 

   - D = Devolução 

- Negativa – (se RETORNO = true e se foi respondido) Indica se a resposta foi negativa (tipo boolean); 

- Resposta – (se RETORNO = true e se foi respondido) Descrição da resposta (tipo string); 

- DataResposta – (se RETORNO = true e se foi respondido)  Data da Resposta, formato: aaaa-mmddhh:mm:ss (tipo string); 

- MotivoDevolucao – (se RETORNO = true e se foi respondido)  Motivo da devolução, caso a resposta tenha sido devolução (tipo string); 

- Pago – (se RETORNO = true) Indica se o pedido foi pago (tipo boolean); 

- ValorCustas – (se RETORNO = true e IDTipoPedido = 3) Valor das custas. Retorna 0 (zero) se o cartório ainda não informou as custas (tipo decimal); 

- ValorBoletoAnexado – (se RETORNO = true e IDTipoPedido = 3)  Valor do boleto anexado. Apenas para cartórios de Estados que permitem o anexo de boletos. Retorna 0 (zero) se o cartório ainda não anexou o boleto (tipo decimal); 

- NumeroPrenotacao – (se RETORNO = true e IDTipoPedido = 3 e se foi prenotado) Número da prenotação (tipo string); 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

35 

- DataPrenotacao – (se RETORNO = true e IDTipoPedido = 3 e se foi prenotado) Data da prenotação, formato: aaaa-mm-ddhh:mm:ss (tipo string); 

- DataVencimentoPrenotacao – (se RETORNO = true e IDTipoPedido = 3 e se foi prenotado) Data de vencimento da prenotação, formato: aaaa-mm-ddhh:mm:ss (tipo string); 

- AdvogadoNome – (se RETORNO = true e IDTipoPedido = 3)  Nome do advogado (tipo string); 

- AdvogadoTelefone – (se RETORNO = true e IDTipoPedido = 3) Telefone do advogado (tipo string); 

- AdvogadoEmail – (se RETORNO = true e IDTipoPedido = 3) E-mail do advogado (tipo string); 

- ParteID – (se RETORNO = true e IDTipoPedido = 3) Código da Parte (tipo int); 

- ParteNome – (se RETORNO = true e IDTipoPedido = 3) Nome da Parte (tipo string); 

- ParteIDTipo – (se RETORNO = true e IDTipoPedido = 3) Tipo da Parte (tipo int). Valores possíveis: `o` 1 = Pessoa física 

   - 2 = Pessoa jurídica 

- ParteCPFCNPJ – (se RETORNO = true e IDTipoPedido = 3) CPF ou CNPJ da Parte (tipo string); 

- Matricula – (se RETORNO = true e IDTipoPedido = 1) Matrícula solicitada (tipo string); 

- ImoveisDireitos – (se RETORNO = true e IDTipoPedido = 1 ou 2) Indica se deve “Informar também os imóveis/direitos que foram transferidos” (tipo boolean); 

- DataTransferencia – (se RETORNO = true e IDTipoPedido = 1 ou 2 e ImoveisDireitos = true) Data da transferência, formato: aaaa-mm-ddhh:mm:ss (tipo string); 

- Arquivo – (se RETORNO = true e IDTipoPedido = 3) URL do Mandado ou Certidão (tipo string); 

- TipoArquivo – (se RETORNO = true e IDTipoPedido = 3) Tipo do arquivo (tipo string). Valores possíveis: 

   - 1 = Certidão 

   - 2 = Mandado 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|12|O IDPedido informado é inválido.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|51|Não foi possível verificar o tipo de pedido.|
|52|Não foi possível obter os dados do pedido de<br>matrícula.|
|53|Não foi possível obter os dados do pedido de pessoa.|
|54|Não foi possível obter os dados do pedido de<br>penhora.|
|55|Não foi possível obter o mandado/certidão.|
|56|Usuário não tem permissão para acessar o pedido<br>informado.|
|57|O pedido informado não foi encontrado.|



## **3.3.7 Envelope de Entrada - ListBoletosPO** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string); 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

36 

- IDProcesso – Código do Processo a ser filtrado (tipo int). 

## **3.3.8 Envelope de Saída - ListBoletosPO** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string); 

- Boletos - (se RETORNO = true)  Arraydas boletos encontrados, apresentando as seguintes informações: 

   - IDBoleto – Código do boleto (tipo int); 

   - NumeroBoleto – Número do boleto (tipo string); 

   - DataGerado – Data que o boleto foi gerado, formato: aaaa-mm-ddhh:mm:ss (tipo string); 

   - DataVencimento – Data de vencimento do boleto, formato: aaaa-mm-ddhh:mm:ss (tipo string); 

   - DataPagamento – Data da baixa do boleto, formato: aaaa-mm-ddhh:mm:ss (tipo string); 

   - ValorBoleto – Valor do boleto (tipo decimal); 

   - Pago – Indica se foi pago (tipo boolean); 

   - Protocolos – Protocolos associados com o boleto (tipo string); 

   - BoletoAnexado – Indica se o boleto é do tipo anexado ou gerado (tipo boolean); 

   - URLBoleto–  URL do boleto (tipo string). 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|12|O IDProcesso informado é inválido.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|51|Não foi possível obter os boletos.|



## **3.3.9 Envelope de Entrada - SetBaixaBoletoPO** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string); 

- IDBoleto – Código do boleto (tipo int). 

## **3.3.10 Envelope de Saída - SetBaixaBoletoPO** 

Os parâmetros de saída são: 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

37 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string); 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|12|O IDBoleto informado é inválido.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|51|Não foi possível obter os dados do boleto.|
|52|Não foi possível efetuar a baixa no boleto.|
|501|Não foi possível efetuar a baixa no boleto. Baixa já<br>efetuada anteriormente.|



## **3.3.11 Envelope de Entrada - SetPrenotacaoPO** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string); 

- IDPedido – Código do pedido (tipo int); 

- NumeroPrenotacao – Número da prenotação (tipo string); 

- DataPrenotacao – Data da prenotação, formato: aaaa-mm-dd (tipo string); 

- DataVencimento – Data de vencimento, formato: aaaa-mm-dd (tipo string). 

## **3.3.12 Envelope de Saída - SetPrenotacaoPO** 

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
|12|O IDPedido informado é inválido.|
|13|O número da prenotação não foi informado.|
|14|A data da prenotação não foi informada.|
|15|A data da prenotação é inválida.|



**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

## 38 

|16|A data de vencimento não foi informada.|
|---|---|
|17|A data de vencimento é inválida.|
|18|A data de vencimento não pode ser menor que a data<br>de prenotação.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|51|Não foi possível pegar os dados do pedido.|
|52|Usuário não tem permissão para cadastrar<br>prenotação para esse pedido.|
|53|A prenotação só pode ser informada para pedidos do<br>tipo Penhora.|
|54|Não foi possível cadastrar prenotação.|
|55|Não é possível prenotar pois o pedido informado já foi<br>prenotado.|



## **3.3.13 Envelope de Entrada - SetCustasPO** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string); 

- IDPedido – Código do pedido (tipo int); 

- ValorCustas – Valor das custas (tipo decimal). 

## **3.3.14 Envelope de Saída - SetCustasPO** 

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
|12|O IDPedido informado é inválido.|
|13|O valor das custas informado é inválido.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|51|Não foi possível pegar os dados do pedido.|
|52|Usuário não tem permissão para informar custas para<br>esse pedido.|
|53|As custas só podem ser informadas para pedidos do<br>tipo Penhora.|
|54|Pedido ainda sem prenotação.|



**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

## 39 

|55|Valor das custas já informado.|
|---|---|
|56|Esse pedido não exige emolumentos.|
|57|Não foi possível pegar os dados do cartório.|
|58|Cartório não tem permissão para informar custas.|
|59|Não foi possível informar custas.|



## **3.3.15 Envelope de Entrada - SetPenhoraAverbadoPO** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string); 

- IDPedido – Código do pedido (tipo int); 

- Resposta – Resposta do pedido (tipo string); 

- CertidaoPenhora - Array de certidões, apresentando as seguintes informações: 

   - Matricula – Número da matrícula (tipo string); 

   - URLArquivo – URL do arquivo. O cartório precisa informar uma URL válida para download do arquivo anexado. Os arquivos informados serão colocados em uma fila e serão baixados posteriormente pelo sistema do Ofício Eletrônico. O pedido não será efetivamente respondido antes que todos os arquivos sejam baixados. (tipo string). 

## **3.3.16 Envelope de Saída - SetPenhoraAverbadoPO** 

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
|12|O IDPedido informado é inválido.|
|13|A Resposta não foi informada.|
|14|Não foi informada nenhuma certidão de penhora.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|51|Não foi possível pegar os dados do pedido.<br>Certifique-se que o pedido é do tipo Penhora.|
|52|Usuário não tem permissão para cadastrar resposta<br>para esse pedido.|
|53|Essa operação só pode ser realizada para pedidos do<br>tipo Penhora.|
|54|Pedido ainda sem prenotação.|
|55|Esse pedido já foi respondido.|
|56|Pedido ainda sem confirmação de pagamento.|



**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

## 40 

|57|Não foi possível obter as matrículas do pedido.|
|---|---|
|58|Não foi informado certidão para a matrícula:<br>[MATRICULA]|
|59|Existe mais de uma certidão para uma ou mais<br>matrículas. É permitido apenas um arquivo por<br>matrícula.|
|60|Não foi possível desbloquear os arquivos.|
|101|Não foi possível cadastrar o arquivo.|
|102|Arquivo não encontrado: [URLArquivo]|
|103|Não foi possível verificar se o arquivo existe.|
|104|Extensão não permitida. Apenas arquivos .p7s são<br>permitidos.|
|105|Aplicação inválida.|
|501|Campos obrigatórios não foram informados.|
|502|Já existe resposta para essa penhora. O status do<br>pedido será alterado assim que todos os arquivos<br>informados forem baixados pelo sistema do Ofício<br>Eletrônico.|



## **3.3.17 Envelope de Entrada –  SetPenhoraAverbadoPO_DocID** 

Permite responder informando arquivo assinado pelo Assinador Web. 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string); 

- IDPedido – Código do pedido (tipo int); 

- Resposta – Resposta do pedido (tipo string); 

- CertidaoPenhora - Array de certidões, apresentando as seguintes informações: 

   - Matricula – Número da matrícula (tipo string); 

   - DocumentID - Identifica o anexo no AssinadorWeb (tipo string) 

## **3.3.18 Envelope de Saída –  SetPenhoraAverbadoPO_DocID** 

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
|12|O IDPedido informado é inválido.|
|13|A Resposta não foi informada.|



**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

## 41 

|14|Não foi informada nenhuma certidão de penhora.|
|---|---|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|51|Não foi possível pegar os dados do pedido.<br>Certifique-se que o pedido é do tipo Penhora.|
|52|Usuário não tem permissão para cadastrar resposta<br>para esse pedido.|
|53|Essa operação só pode ser realizada para pedidos do<br>tipo Penhora.|
|54|Pedido ainda sem prenotação.|
|55|Esse pedido já foi respondido.|
|56|Pedido ainda sem confirmação de pagamento.|
|57|Não foi possível obter as matrículas do pedido.|
|58|Não foi informado certidão para a matrícula:<br>[MATRICULA]|
|59|Existe mais de uma certidão para uma ou mais<br>matrículas. É permitido apenas um arquivo por<br>matrícula.|
|60|Não foi possível desbloquear os arquivos.|
|101|Não foi possível cadastrar o arquivo.|
|102|Arquivo não encontrado: [DocumentID]|
|103|Não foi possível verificar se o arquivo existe.|
|104|Extensão não permitida. Apenas arquivos .p7s são<br>permitidos.|
|105|Aplicação inválida.|
|501|Campos obrigatórios não foram informados.|
|502|Já existe resposta para essa penhora. O status do<br>pedido será alterado assim que todos os arquivos<br>informados forem baixados pelo sistema do Ofício<br>Eletrônico.|



## **3.3.19 Envelope de Entrada - SetPenhoraExigenciaPO** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string); 

- IDPedido – Código do pedido (tipo int); Resposta – Resposta do pedido (tipo string); 

- Anexos - Array de arquivos, apresentando as seguintes informações: 

   - Nome – Nome que descreve o arquivo (tipo string); 

   - URLArquivo – URL do arquivo. O cartório precisa informar uma URL válida para download do arquivo anexado. Os arquivos informados serão colocados em uma fila e serão baixados posteriormente pelo sistema do Ofício Eletrônico. O pedido não será efetivamente respondido antes que todos os arquivos sejam baixados. (tipo string). 

## **3.3.20 Envelope de Saída - SetPenhoraExigenciaPO** 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

42 

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
|12|O IDPedido informado é inválido.|
|13|A Resposta não foi informada.|
|14|Não foi informado nenhum anexo.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|51|Não foi possível pegar os dados do pedido.<br>Certifique-se que o pedido é do tipo Penhora.|
|52|Usuário não tem permissão para cadastrar resposta<br>para esse pedido.|
|53|Essa operação só pode ser realizada para pedidos do<br>tipo Penhora.|
|54|Pedido ainda sem prenotação.|
|55|O nome de um ou mais anexos não foi informado.|
|56|Não foi informada a URL de um ou mais arquivos.|
|60|Não foi possível desbloquear os arquivos.|
|101|Não foi possível cadastrar o arquivo.|
|102|Arquivo não encontrado: [URLArquivo]|
|103|Não foi possível verificar se o arquivo existe.|
|104|Extensão não permitida. Apenas arquivos .pdfou .p7s<br>são permitidos.|
|105|Aplicação inválida.|
|501|Campos obrigatórios não foram informados.|
|502|Já existe resposta para essa penhora. O status do<br>pedido será alterado assim que todos os arquivos<br>informados forem baixados pelo sistema do Ofício<br>Eletrônico.|



## **3.3.21 Envelope de Entrada – SetPenhoraExigenciaPO_DocID** 

Permite responder informando arquivo assinado pelo Assinador Web. 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string); 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

43 

- IDPedido – Código do pedido (tipo int); 

- Resposta – Resposta do pedido (tipo string); 

- Anexos - Array de arquivos, apresentando as seguintes informações: 

   - Nome – Nome que descreve o arquivo (tipo string); 

   - DocumentID - Identifica o anexo no AssinadorWeb (tipo string). 

## **3.3.22 Envelope de Saída – SetPenhoraExigenciaPO_DocID** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string); 

## Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|12|O IDPedido informado é inválido.|
|13|A Resposta não foi informada.|
|14|Não foi informado nenhum anexo.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|51|Não foi possível pegar os dados do pedido.<br>Certifique-se que o pedido é do tipo Penhora.|
|52|Usuário não tem permissão para cadastrar resposta<br>para esse pedido.|
|53|Essa operação só pode ser realizada para pedidos do<br>tipo Penhora.|
|54|Pedido ainda sem prenotação.|
|55|O nome de um ou mais anexos não foi informado.|
|56|Não foi informada a Document de um ou mais<br>arquivos.|
|60|Não foi possível desbloquear os arquivos.|
|101|Não foi possível cadastrar o arquivo.|
|102|Arquivo não encontrado: [DocumentID]|
|103|Não foi possível verificar se o arquivo existe.|
|104|Extensão não permitida. Apenas arquivos .pdfou .p7s<br>são permitidos.|
|105|Aplicação inválida.|
|501|Campos obrigatórios não foram informados.|
|502|Já existe resposta para essa penhora. O status do<br>pedido será alterado assim que todos os arquivos<br>informados forem baixados pelo sistema do Ofício<br>Eletrônico.|



**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

44 

## **3.3.23 Envelope de Entrada - SetPedidoPessoaRespondidoPO** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string); 

- IDPedido – Código do pedido (tipo int); 

- Resposta – Resposta do pedido (tipo string); 

- Negativa – Indica se é negativa (tipo boolean); 

- Anexos - Array de arquivos, apresentando as seguintes informações: 

   - Matricula – Número da matrícula referente ao arquivo (tipo string); 

   - URLArquivo – URL do arquivo. O cartório precisa informar uma URL válida para download do arquivo anexado. Os arquivos informados serão colocados em uma fila e serão baixados posteriormente pelo sistema do Ofício Eletrônico. O pedido não será efetivamente respondido antes que todos os arquivos sejam baixados. (tipo string). 

## **3.3.24 Envelope de Saída - SetPedidoPessoaRespondidoPO** 

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
|12|O IDPedido informado é inválido.|
|13|A Resposta não foi informada.|
|14|Não foi informado nenhum anexo.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|51|Não foi possível pegar os dados do pedido.<br>Certifique-se que o pedido é do tipo Pessoa.|
|52|Usuário não tem permissão para cadastrar resposta<br>para esse pedido.|
|53|Essa operação só pode ser realizada para pedidos do<br>tipo Pedido de Certidão por Pessoa.|
|54|A matrícula de um ou mais anexos não foi informada.|
|55|Não foi informada a URL de um ou mais arquivos.|
|60|Não foi possível desbloquear os arquivos.|
|101|Não foi possível cadastrar o arquivo.|



**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

## 45 

|102|Arquivo não encontrado: [URLArquivo]|
|---|---|
|103|Não foi possível verificar se o arquivo existe.|
|104|Extensão não permitida. Apenas arquivos .p7s são<br>permitidos.|
|105|Aplicação inválida.|
|501|Campos obrigatórios não foram informados.|
|502|Já existe resposta para esse pedido. O status do<br>pedido será alterado assim que todos os arquivos<br>informados forem baixados pelo sistema do Ofício<br>Eletrônico.|



## **3.3.25 Envelope de Entrada – SetPedidoPessoaRespondidoPO_DocID** 

Permite responder informando anexo assinado pelo Assinador Web. 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string); 

- IDPedido – Código do pedido (tipo int); 

- Resposta – Resposta do pedido (tipo string); 

- Negativa – Indica se é negativa (tipo boolean); 

- Anexos - Array de arquivos, apresentando as seguintes informações: 

   - Matricula – Número da matrícula referente ao arquivo (tipo string); 

   - DocumentID– Identifica o anexo no AssinadorWeb (tipo string) 

## **3.3.26 Envelope de Saída – SetPedidoPessoaRespondidoPO_DocID** 

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
|12|O IDPedido informado é inválido.|
|13|A Resposta não foi informada.|
|14|Não foi informado nenhum anexo.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|51|Não foi possível pegar os dados do pedido.<br>Certifique-se que o pedido é do tipo Pessoa.|



**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

## 46 

|52|Usuário não tem permissão para cadastrar resposta<br>para esse pedido.|
|---|---|
|53|Essa operação só pode ser realizada para pedidos do<br>tipo Pedido de Certidão por Pessoa.|
|54|A matrícula de um ou mais anexos não foi informada.|
|55|Não foi informada a DocumentID de um ou mais<br>arquivos.|
|60|Não foi possível desbloquear os arquivos.|
|101|Não foi possível cadastrar o arquivo.|
|102|Arquivo não encontrado: [URLArquivo]|
|103|Não foi possível verificar se o arquivo existe.|
|104|Extensão não permitida. Apenas arquivos .p7s são<br>permitidos.|
|105|Aplicação inválida.|
|501|Campos obrigatórios não foram informados.|
|502|Já existe resposta para esse pedido. O status do<br>pedido será alterado assim que todos os arquivos<br>informados forem baixados pelo sistema do Ofício<br>Eletrônico.|



## **3.3.27 Envelope de Entrada - SetPedidoPessoaDevolvidoPO** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string); 

- IDPedido – Código do pedido (tipo int); 

- Resposta – Resposta do pedido (tipo string); 

## **3.3.28 Envelope de Saída - SetPedidoPessoaDevolvidoPO** 

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
|12|O IDPedido informado é inválido.|
|13|A Resposta não foi informada.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|



**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

## 47 

|47|Hash inválido: Hash expirado.|
|---|---|
|51|Não foi possível pegar os dados do pedido.<br>Certifique-se que o pedido é do tipo Pessoa.|
|52|Usuário não tem permissão para cadastrar resposta<br>para esse pedido.|
|53|Essa operação só pode ser realizada para pedidos do<br>tipo Pedido de Certidão por Pessoa.|
|54|Não foi possível responder o pedido.|



## **3.3.29 Envelope de Entrada - SetPedidoMatriculaRespondidoPO** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string); 

- IDPedido – Código do pedido (tipo int); 

- Resposta – Resposta do pedido (tipo string); 

- Anexos - Array de arquivos, apresentando as seguintes informações: 

   - Matricula – Número da matrícula referente ao arquivo (tipo string); 

   - URLArquivo – URL do arquivo. O cartório precisa informar uma URL válida para download do arquivo anexado. Os arquivos informados serão colocados em uma fila e serão baixados posteriormente pelo sistema do Ofício Eletrônico. O pedido não será efetivamente respondido antes que todos os arquivos sejam baixados. (tipo string). 

## **3.3.30 Envelope de Saída - SetPedidoMatriculaRespondidoPO** 

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
|12|O IDPedido informado é inválido.|
|13|A Resposta não foi informada.|
|14|Não foi informado nenhum anexo.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|51|Não foi possível pegar os dados do pedido.<br>Certifique-se que o pedido é do tipo Matrícula.|
|52|Usuário não tem permissão para cadastrar resposta<br>para esse pedido.|
|53|Essa operação só pode ser realizada para pedidos do|



**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

## 48 

||tipo Pedido de Certidão por Matrícula.|
|---|---|
|54|A matrícula de um ou mais anexos não foi informada.|
|55|Não foi informada a URL de um ou mais arquivos.|
|60|Não foi possível desbloquear os arquivos.|
|101|Não foi possível cadastrar o arquivo.|
|102|Arquivo não encontrado: [URLArquivo]|
|103|Não foi possível verificar se o arquivo existe.|
|104|Extensão não permitida. Apenas arquivos .p7s são<br>permitidos.|
|105|Aplicação inválida.|
|501|Campos obrigatórios não foram informados.|
|502|Já existe resposta para esse pedido. O status do<br>pedido será alterado assim que todos os arquivos<br>informados forem baixados pelo sistema do Ofício<br>Eletrônico.|



54 Não foi possível responder o pedido. 

## **3.3.31 Envelope de Entrada – SetPedidoMatriculaRespondidoPO_DocID** 

Permite responder informando anexo assinador via Assinador Web 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string); 

- IDPedido – Código do pedido (tipo int); 

- Resposta – Resposta do pedido (tipo string); 

- Anexos - Array de arquivos, apresentando as seguintes informações: 

   - Matricula – Número da matrícula referente ao arquivo (tipo string); 

   - DocumentID– Identifica o anexo no AssinadorWeb (tipo string) 

## **3.3.32 Envelope de Saída – SetPedidoMatriculaRespondidoPO_DocID** 

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
|12|O IDPedido informado é inválido.|



**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

## 49 

|13|A Resposta não foi informada.|
|---|---|
|14|Não foi informado nenhum anexo.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|51|Não foi possível pegar os dados do pedido.<br>Certifique-se que o pedido é do tipo Matrícula.|
|52|Usuário não tem permissão para cadastrar resposta<br>para esse pedido.|
|53|Essa operação só pode ser realizada para pedidos do<br>tipo Pedido de Certidão por Matrícula.|
|54|A matrícula de um ou mais anexos não foi informada.|
|55|Não foi informada a URL de um ou mais arquivos.|
|60|Não foi possível desbloquear os arquivos.|
|101|Não foi possível cadastrar o arquivo.|
|102|Arquivo não encontrado: [URLArquivo]|
|103|Não foi possível verificar se o arquivo existe.|
|104|Extensão não permitida. Apenas arquivos .p7s são<br>permitidos.|
|105|Aplicação inválida.|
|501|Campos obrigatórios não foram informados.|
|502|Já existe resposta para esse pedido. O status do<br>pedido será alterado assim que todos os arquivos<br>informados forem baixados pelo sistema do Ofício<br>Eletrônico.|



## **Envelope de Entrada - SetPedidoMatriculaDevolvidoPO** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string); 

- IDPedido – Código do pedido (tipo int); 

- Resposta – Resposta do pedido (tipo string); 

## **3.3.33 Envelope de Saída - SetPedidoMatriculaDevolvidoPO** 

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

## 50 

|11|O Hash de validação não foi informado.|
|---|---|
|12|O IDPedido informado é inválido.|
|13|A Resposta não foi informada.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|51|Não foi possível pegar os dados do pedido.<br>Certifique-se que o pedido é do tipo Matrícula.|
|52|Usuário não tem permissão para cadastrar resposta<br>para esse pedido.|
|53|Essa operação só pode ser realizada para pedidos do<br>tipo Pedido de Certidão por Matrícula.|
|54|Não foi possível responder o pedido.|



## **3.3.34 Envelope de Entrada - SetPedidoNegativaLotePO** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string); 

- Pedidos - Array de pedidos, apresentando as seguintes informações: 

   - IDPedido – Código do pedido. Obs.: Apenas pedidos do tipo Pessoa podem ser negativados (tipo int). 

## **3.3.35 Envelope de Saída - SetPedidoNegativaLotePO** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string); 

- Pedidos - Array de pedidos, apresentando as seguintes informações: 

   - IDPedido – Código do pedido (tipo int); 

   - RETORNO – Indica se houve erro ou não ao negativar o pedido ref. IDPedido. (tipo boolean); 

   - CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

   - ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string). 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|12|Não foi informado nenhum pedido.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|151|O IDPedido informado é inválido|



**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

## 51 

|152|Não foi possível pegar os dados do pedido.<br>Certifique-se que o pedido é do tipo Pessoa.|
|---|---|
|153|Usuário não tem permissão para cadastrar resposta<br>para esse pedido.|
|154|Essa operação só pode ser realizada para pedidos do<br>tipo Pessoa.|
|155|Não foi possível responder o pedido.|



## **3.3.36 Envelope de Entrada – ListPedidosExportacaoPO** 

* Observações: 

|ListPedidosExportacaoPO_v2|Adicionado novos campos de<br>Saída|ValorDaDivida<br>,PercentualExecutado<br>,PercentualPenhorado|
|---|---|---|



Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string); 

- Protocolo – Protocolo a ser filtrado – * opcional (tipo string(20)); 

- IDVara – Código da Vara a ser filtrado. Para retornar todos, informar -1. Para obter os códigos das Varas conferir o método ListVarasPO, item 3.3.3 (tipo int); 

- IDTipoPedido – Código do tipo do pedido -  verificar tipos possíveis no item 3.3.1 - (tipo int); 

- IDStatus – Código do status – verificar tipos possíveis no item 3.3.1 -  (tipo int); 

- DataSolicitacaoInicial – Data da solicitação inicial a ser filtrada, formato: aaaa-mm-dd (tipo string); 

- DataSolicitacaoFinal – Data da solicitação final a ser filtrada, formato: aaaa-mm-dd (tipo string); 

- DataRespostaInicial – Data da resposta inicial a ser filtrada, formato: aaaa-mm-dd – * opcional (tipo string); 

- DataRespostaFinal – Data da resposta final a ser filtrada, formato: aaaa-mm-dd – * opcional (tipo string). 

## **3.3.37 Envelope de Saída – ListPedidosExportacaoPO** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string); 

- Pedidos - (se RETORNO = true)  Array dos pedidos encontrados, apresentando as seguintes informações: 

   - IDPedido – Código do pedido (tipo int); 

   - IDProcesso – Código do processo (tipo int); 

   - IDTipoPedido – Código do tipo do pedido – verificar tipos possíveis no item 3.3.1 - (tipo int); 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

52 

- IDStatus – Código do status – verificar tipos possíveis no item 3.3.1 -  (tipo int); 

- TipoPenhora – Se for pedido de penhora (cf. IDTipoPedido), identifica o tipo de penhora (tipo int). Valores possíveis: 

   - 1 = Mandado de averbação de penhora; 

   - 2 = Mandado de cancelamento de averbação de penhora. 

- TipoCertidao – Se for pedido de certidão (cf. IDTipoPedido), identifica o tipo de certidão (tipo int). Valores possíveis: 

   - 1 = Solicitação por matrícula; 

   - 2 = Solicitação por pessoa. 

- Protocolo – Protocolo do Pedido (tipo string(20)); 

- NumeroProcesso – Número do processo (tipo string(35)); 

- DataPed - Data da solicitação, formato: aaaa-mm-ddhh:mm:ss (tipo string); 

- Estado – Estado do vara (tipo string(100)); 

- Comarca – Comarca da vara (tipo string(100)); 

- Foro – Foro da vara (tipo string(100)); 

- IDVara – Código da vara (tipo int); 

- Vara – Nome da vara (tipo string(100)); 

- `o` NomePesqPed – Se for pedidos de certidão, do tipo pessoa (cf. TipoCertidao) – Nome para pesquisa (tipo string(60)); 

- CPFCNPJ - Se for pedidos de certidão, do tipo pessoa (cf. TipoCertidao) – CPF ou CNPJ da pessoa pesquisada (tipo string(20)); 

- Matr1PesqPed - Se for pedidos de certidão, do tipo matrícula (cf. TipoCertidao) – Número da matrícula (tipo string(30)); 

- ImoveisDireito – Se for pedido de certidão (cf. IDTipoPedido) – Imóveis de direito (tipo string(1)). Valores possíveis: 

   - 1 = Informar somente os imóveis/direitos que seja proprietário/titular; 

   - 2 = Informar também os imóveis/direitos que foram transferidos. 

- DataTransferencia - Se for pedido de certidão (cf. IDTipoPedido) – Data de Transferência, formato: aaaa-mm-dd. Obrigatório caso ImoveisDireito = 2 (tipo string); 

- Mandado – Se for penhora (cf. IDTipoPedido) – Indica se é mandado ou certidão (tipo string(1)). Valores possíveis: 

   - 1 = Mandado; 

   - 2 = Certidão 

- NaturezaExecucao – Natureza da execução (tipo string(2)). Valores possíveis: 

   - 1 = Execução civil; 

   - 2 = Execução trabalhista; 

   - 3 = Execução fiscal; 

   - 4 = Ação criminal. 

- ValorDaDivida* – Valor da Divida do pedido (tipo string(20)); 

- IDGrupoReenvio – Indica se é um reenvio. Se for maior que “0” significa que o pedido foi reenviado. Para cada reenvio um número diferente é informado. (tipo int); 

- Usuario – Nome do usuário do sistema (usuário da Vara) que gerou o pedido (tipo string(100)); 

- UsuarioCPF – CPF do usuário do sistema (usuário da Vara) que gerou o pedido (tipo string(11)); 

- Parte - Array das partes encontradas, apresentando as seguintes informações: 

   - IDParte – Código da parte no sistema (tipo int); 

   - Nome – Nome da parte (tipo string(100)); 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

## 53 

      - CPFCNPJ – CPF ou CNPJ da parte (tipo string(20)); 

      - Qualidade – Qualidade da parte (tipo string(10)). Valores possíveis: 

         - Executado; 

         - Exequente; 

         - Terceiro. 

      - PassivoPenhora – Indica se é passivo de penhora (tipo string(1)). Valores possíveis: ● 1 = Sim; 

         - 2 = Não. 

   - Imóvel - Array dos imóveis encontrados, apresentando as seguintes informações: 

      - IDImovel – Código da imóvel no sistema (tipo int); 

      - Proprietario – Nome do proprietário (tipo string(100)); 

      - Estado – Estado (UF) do imóvel (tipo string(2)); 

      - Comarca – Comarca do imóvel (tipo string(100)); 

      - Matricula – Matrícula do imóvel (tipo string(14)); 

      - Endereco – Endereço do imóvel (tipo string(150)); 

      - Bairro – Bairro do imóvel (tipo string(50)); 

      - Municipio – Municipio do imóvel (tipo string(100)); 

      - TipoConstricao – Tipo de  Constrição (tipo string(50)). Valores possíveis: 

         - Penhora; 

         - Arresto; 

         - Sequestro. 

      - ImovelDataAutoTermo – Data do auto ou termo, formato:  aaaa-mm-dd (tipo string); 

      - PoloPassivo – Indica se o proprietário do imóvel possui polo passivo (tipo string(1)). Valores possíveis: 

         - 1 = Sim; 

         - 2 = Não. 

      - MotivoTipo – Motivo (Polo Passivo). Valores Possíveis (tipo string(2)): 

         - 1 = Fraude de execução; 

         - 2 = Desconsideração da personalidade jurídica; 

         - 3 = Responsabilidade patrimonial da execução; 

         - 4 = Outros. 

      - OutrosMotivos – Outros motivos (Polo Passivo) (tipo string(50)); 

      - EstadoCivil – Estado civil do proprietário (tipo string(1)). Valores possíveis: 

         - 1 = Solteiro; 

         - 2 = Casado; 

         - 3 = Viúvo; 

         - 4 = Divorciado. 

      - NomeConjuge – Nome do cônjuge (string(100)); 

      - IntimadoPenhora – Indica se o cônjuge foi intimado da penhora. (tipo string(1)). Valores possíveis: 

         - 1 = Sim; 

         - 2 = Não. 

- DataIntimacao – Data da intimação do cônjuge, no formato: aaaa-mm-dd (tipo string); 

      - MotivoDispensa – Descreve o motivo da dispensa do cônjuge (tipo string(200)); 

      - NomeDepositario – Nome do depositário (tipo string(250)); 

      - TipoEmolumento – Tipo de emolumentos (tipo string(2)). Valores possíveis: 

         - 1 = Depósito prévio; 

         - 2 = Determinação de dispensa do depósito; 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

## 54 

   - 3 = Beneficiário de assistência judiciária gratuita. 

- DataDecisao – Data da decisão, no formato: aaaa-mm-dd (tipo string); 

- 

- 

   - Folhas  - Folhas da decisão (tipo string(100)). 

   - PercentualExecutado* – Percentual executado do pedido (tipo string(20)); 

- PercentualPenhorado* – Percentual penhorado do pedido (tipo string(20)); 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|14|A Vara informada é inválida.|
|15|O tipo do pedido informado é inválido.|
|16|O Status informado é inválido.|
|17|A data de solicitação inicial não foi informada.|
|18|A data de solicitação final não foi informada.|
|19|A data de solicitação inicial é inválida.|
|20|A data de solicitação final é inválida.|
|21|O período da data de solicitação não pode ser maior<br>que 30 dias.|
|22|A data de resposta inicial é inválida.|
|23|A data de resposta final é inválida.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|51|Não foi possível obter os pedidos.|



## **3.3.38 Envelope de Entrada – SetPedidoFinalizarPrenotacaoVencida** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string); 

- IDPedido – Código do pedido (tipo int); 

- Resposta – Resposta do pedido (tipo string); 

- Anexos - Array de arquivos, apresentando as seguintes informações: 

   - Matricula – Número da matrícula referente ao arquivo (tipo string); 

   - URLArquivo – URL do arquivo. O cartório precisa informar uma URL válida para download do arquivo anexado. Os arquivos informados serão colocados em uma fila e serão baixados posteriormente pelo sistema do Ofício Eletrônico. O pedido não será efetivamente respondido antes que todos os arquivos sejam baixados. (tipo string). 

## **3.3.39 Envelope de Saída – SetPedidoFinalizarPrenotacaoVencida** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

55 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string); 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|12|O IDPedido informado é inválido.|
|13|A Resposta não foi informada.|
|14|Não foi informado nenhum anexo.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|51|Não foi possível pegar os dados do pedido.<br>Certifique-se que o pedido é do tipo Matrícula.|
|52|Usuário não tem permissão para cadastrar resposta<br>para esse pedido.|
|53|Essa operação só pode ser realizada para pedidos do<br>tipo Pedido de Certidão por Matrícula.|
|54|A matrícula de um ou mais anexos não foi informada.|
|55|Não foi informada a URL de um ou mais arquivos.|
|60|Não foi possível desbloquear os arquivos.|
|101|Não foi possível cadastrar o arquivo.|
|102|Arquivo não encontrado: [URLArquivo]|
|103|Não foi possível verificar se o arquivo existe.|
|104|Extensão não permitida. Apenas arquivos .p7s são<br>permitidos.|
|105|Aplicação inválida.|
|501|Campos obrigatórios não foram informados.|
|502|Já existe resposta para esse pedido. O status do<br>pedido será alterado assim que todos os arquivos<br>informados forem baixados pelo sistema do Ofício<br>Eletrônico.|
