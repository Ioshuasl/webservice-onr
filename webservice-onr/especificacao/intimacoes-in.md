# WSOficio — Intimações (IN)

> Extraído de [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) (seções 3.11).

---
## **3.11 Intimações** 

O ONR disponibiliza os serviços referentes a Intimações através de web services contemplando as seguintes funcionalidades: 

- A. Importação de Prenotações via XML 

Habilita a importação de prenotações (associadas à um pedido de intimação) através de arquivos XML disponíveis na nuvem. 

- B. Listagem de Status de Intimação 

Retorna uma lista de status com os códigos de identificação para utilização em outros serviços. 

- C. Listagem de Pedidos de Intimação 

Retorna uma lista de pedidos de acordo com os parâmetros informados. 

- D. Listagem de Mensagens 

Retorna uma lista de mensagens (vinculadas à um pedido) de acordo com os parâmetros informados. 

- E. Adicionar nova mensagem de intimação 

Esse serviço permite a inclusão de uma nova mensagem de intimação. 

## F. Obter Detalhes 

Esse serviço permite recuperar os dados de um pedido de intimação específico. 

- G. Obter Mensagem 

Esse serviço permite recuperar os dados de uma mensagem específica. 

- H. Obter Emolumento 

Esse serviço permite recuperar os dados de um emolumento (custa) específico. 

- I. Adicionar novo emolumento 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

135 

Esse serviço permite a inclusão de custas de intimação para controle financeiro. 

- J. Exclusão de emolumento 

Habilita a exclusão de uma custa previamente cadastrada e que ainda não tenha sido gerado boleto ou paga. 

- K. Listagem de Pagamentos de Emolumentos Intimação 

Retorna uma lista de pagamentos das custas dos pedidos de intimação de acordo com os parâmetros informados. 

O contrato WSDL para homologação pode ser visualizado em: 

- https://hml3- wsoficio.onr.org.br/intimacoes.asmx?wsdl 

## Métodos a serem referenciados: **ImportarPrenotacaoIN** ; **ListPedidosIN** ; **ListMensagensPedidoIN** ; **AdicionarMensagemIN** ; **GetDetalhesIN_V2** ; **GetDetalhesIN_V3; GetMensagemIN** ; **GetEmolumentosIN** ; **AdicionarEmolumentoIN** ; **ExcluirEmolumentoIN; ListPagamentosIN, ListStatusIN** . 

## **3.11.1 Envelope de Entrada - ImportarPrenotacaoIN** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string(50)); 

- XMLs – Array de URLs referentes aos arquivos XML, disponíveis na nuvem, onde: `o` URLXML – URL do arquivo XML (tipo string). 

## **3.11.2 Envelope de Saída - ImportarPrenotacaoIN** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string(200)); 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|12|Nenhum arquivo foi informado.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|60|Não foi possível desbloquear os arquivos.|
|502|Já existe resposta para esse pedido. O status do|



**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

## 136 

pedido será alterado assim que todos os arquivos informados forem baixados pelo sistema do Ofício Eletrônico. 

## **3.11.3 Envelope de Entrada - ListStatusIN** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string(50)). 

## **3.11.4 Envelope de Saída - ListStatusIN** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string(200)); 

- Status  - (se RETORNO = true)  Array de todos os status de intimações disponíveis, apresentando as seguintes informações: 

   - IDStatus – Código do status (tipo int); 

   - NomeStatus  – Descrição/nome do status de intimação (tipo string(30)). 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|51|Não foi possível obter os status.|



## **3.11.5 Envelope de Entrada - ListPedidosIN** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string(50)); 

- MaxRowPerPage – Quantidade máxima de registros a serem retornados por página (tipo int); 

- PageNumber – Página a ser retornada (tipo int); 

- IDStatus – ID do status do pedido (tipo int), os mesmos podem ser obtidos através do serviço de listagem de status (ListStatusIN); para filtrar todos os status, o valor inserido deve ser 0 (zero); 

- Protocolo – Protocolo do pedido de intimação (tipo string(11)); 

- TipoDataPesquisa - Tipo de Pesquisa (tipo string(1)) pesquisa por padrão "P" data de cadastro do pedido ou "M" data da última mensagem; 

- DataInicial – Data inicial a serem filtrados, formato: aaaa-mm-dd (tipo string) verificando o tipo de pesquisa; 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

137 

- DataFinal – Data final a serem filtrados, formato: aaaa-mm-dd (tipo string)verificando o tipo de pesquisa. 

## **3.11.6 Envelope de Saída - ListPedidosIN** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string(200)); 

- QtdeRegistros – (se RETORNO = true)  Quantidade total de registros encontrados (tipo int); 

- QtdePaginas  – (se RETORNO = true)  Quantidade total de páginas, de acordo com o total de registros encontrados e com a quantidade máxima de registros por página que foi informada no envelope de entrada - MaxRowPerPage - (tipo int); 

- Pedidos - (se RETORNO = true)  Array dos pedidos encontrados, apresentando as seguintes informações: 

   - IDPedido – Código do pedido (tipo int); 

   - Protocolo – Protocolo do registro (tipo string(11)); 

   - Solicitante – Nome do solicitante (tipo string(300)) ; 

   - Status – Descrição do status do pedido - (tipo string(30)); 

   - DataPedido – Data de inclusão do pedido, formato: aaaa-mm-ddhh:mm:ss (tipo string); 

   - DataStatus – Data da última mensagem conforme status, formato: aaaa-mm-ddhh:mm:ss (tipo string). 

## Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|12|A quantidade de registros por página informada é<br>inválida. A quantidade mínima permitida é 10.|
|13|A página informada é inválida.|
|16|A data do pedido inicial é inválida.|
|17|A data do pedido final é inválida.|
|30|A página informada é inválida. Página máxima<br>possível: [PAGINA]|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|51|Não foi possível obter os pedidos.|



## **3.11.7 Envelope de Entrada - ListMensagensPedidoIN** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string(50)); 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

138 

- MaxRowPerPage – Quantidade máxima de registros a serem retornados por página (tipo int); 

- PageNumber – Página a ser retornada (tipo int); 

- IDPedido – Código do pedido de intimação obtido através da listagem anterior (tipo int); 

- IDStatus – Código do status de mensagem (tipo int), os mesmos podem ser obtidos através do serviço de listagem de status (ListStatusIN); para filtrar todos os status, o valor inserido deve ser 0 (zero); 

- Assunto – Descrição do assunto de mensagem (tipo string(100)); 

- IDFiltro – Filtro de leitura da mensagem (tipo int), onde: 

   - 1 - Todas; 

   - 2 - Não lidas; 

   - 3 - Lidas; 

   - 4 - Recebidas; 

   - 5 - Enviadas. 

## **3.11.8 Envelope de Saída - ListMensagensPedidoIN** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string(200)); 

- QtdeRegistros – (se RETORNO = true)  Quantidade total de registros encontrados (tipo int); 

- QtdePaginas  – (se RETORNO = true)  Quantidade total de páginas, de acordo com o total de registros encontrados e com a quantidade máxima de registros por página que foi informada no envelope de entrada - MaxRowPerPage - (tipo int); 

- Mensagens - (se RETORNO = true)  Array dos mensagens encontrados, apresentando as seguintes informações: 

   - IDMensagem – Código da mensagem (tipo int); 

   - Data – Data de inclusão da mensagem, formato: aaaa-mm-ddhh:mm:ss (tipo string); 

   - Status – Descrição do status (tipo string(30)); 

   - Assunto – Descrição do assunto da mensagem (tipo string(100)); 

   - Remetente – Nome do remetente (tipo string(100)); 

   - Lida – retorna True ou False se a mensagem foi ou não lida (tipo booleano). 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|12|A quantidade de registros por página informada é<br>inválida. A quantidade mínima permitida é 10.|
|13|A página informada é inválida.|
|14|O número do pedido informado é inválido.|
|30|A página informada é inválida. Página máxima<br>possível: [PAGINA]|
|45|Hash inválido.|



**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

## 139 

|46|Hash inválido: Hash já utilizado.|
|---|---|
|47|Hash inválido: Hash expirado.|
|51|Não foi possível obter o pedido solicitado.|
|52|O pedido solicitado não pertence ao cartório do<br>usuário autenticado.|
|53|Não foi possível obter as mensagens.|



## **3.11.9 Envelope de Entrada – GetDetalhesIN_V2** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string(50)); 

- IDPedido – Código do pedido (tipo int). 

## **3.11.10 Envelope de Saída – GetDetalhesIN_V2** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string(200)); 

- Quando RETORNO = true: 

   - IDPedido – ID do pedido (tipo int); 

   - IDStatus - ID do status do pedido (tipo int); 

   - Protocolo – Protocolo do pedido de intimação (tipo string(11)); 

   - Estado – Estado de solicitação (tipo string(50)); 

   - Cidade – Cidade de solicitação (tipo string(100)); 

   - IDCartorio – ID do cartório onde a intimação está registrada (tipo int); 

   - Cartorio – Descrição do cartório onde a intimação está registrada (tipo string(300)); 

   - NumeroContrato – Número do contrato gerado (tipo string(30)); 

   - DataRemessa – Data da remessa, formato aaaa-mm-ddhh:mm:ss (tipo string); 

   - Solicitante – Nome do solicitante (tipo string(120)); 

   - SolicitanteCPFCNPJ – Documento (CPF ou CNPJ) do solicitante (tipo string(14)); 

   - SolicitanteIM – Número de Inscrição Municipal do solicitante (tipo string(30)); 

   - SolicitanteEndereco – Endereço do solicitante (tipo string(150)); 

   - SolicitanteNumero – Número do solicitante (tipo string(10)); 

   - SolicitanteComplemento – Complemento do endereço do solicitante (tipo string(10)); 

   - SolicitanteBairro – Bairro do solicitante (tipo string(40)); 

   - SolicitanteCidade – Cidade do solicitante (tipo string(40)); 

   - SolicitanteEstado – Estado do solicitante (tipo string(2)); 

   - SolicitanteCEP– CEP do solicitante (tipo string(9)); 

   - SolicitanteDDD – DDD do solicitante (tipo string(4)); 

   - SolicitanteTelefone – Telefone do solicitante (tipo string(15)); 

   - SolicitanteEmail – Email do solicitante (tipo string(60)); 

   - Credor – Nome do credor (tipo string(120)); 

   - CredorCPFCNPJ – Documento (CPF ou CNPJ) do credor (tipo string(14)); 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

140 

- CredorIM – Número de Inscrição Municipal do credor (tipo string(30)); 

- CredorEndereco – Endereço do credor (tipo string(150)); 

- CredorNumero – Número do credor (tipo string(10)); 

- CredorComplemento – Complemento do endereço do credor (tipo string(10)); 

- CredorBairro – Bairro do credor (tipo string(40)); 

- CredorCidade – Cidade do credor (tipo string(40)); 

- CredorEstado – Estado do credor (tipo string(2)); 

- CredorCEP– CEP do credor (tipo string(9)); 

- CredorDDD – DDD do credor (tipo string(4)); 

- CredorTelefone – Telefone do credor (tipo string(15)); 

- CredorEmail – Email do credor (tipo string(60)); 

- PrestacaoAgencia – Dados da agência de cobrança (tipo string(6)); 

- PrestacaoEndereco – Endereço de cobrança (tipo string(150)); 

- TipoDeterminacaoJudicial – Tipo de determinação judicial quando status 28 (Determinação Judicial)(tipo string); 

- CanceladoJudicialmente – Indica se pedido foi cancelado judicialmente (tipo boolean); 

- DataCancelamentoJudicial–  Data que indica quando ocorreu a alteração de status (cancelamento por ordem judicial) no sistema (tipo string); 

- DataAverbacaoJudicial–  Data referente a averbação do cancelamento judicial (tipo string); 

- `o` Prenotacoes – Array de prenotações, onde: 

   - Numero – Número da prenotação (tipo string(30)); 

   - Data – Data de inclusão da prenotação, formato aaaa-mm-ddhh:mm:ss (tipo string); 

   - DataVencimento – Data de vencimento da prenotação, formato aaaa-mmddhh:mm:ss (tipo string); 

   - ValorServico – Valor das custas de prenotação, no formato XX.XX (tipo decimal). 

- Devedores – Array de devedores do pedido de intimação, onde: 

   - Nome – Nome completo do devedor (tipo string(120)); 

   - Participacao – Descrição da participação do devedor na intimação (tipo string(100)); 

   - CPFCNPJ – Documento (CPF ou CNPJ) do devedor (tipo string(14)); 

- Imoveis – Array de imóveis, onde: 

   - Matricula – Número de matrícula do imóvel (tipo string(10)); 

- EnderecosIntimacoes – Array de endereços de intimações, onde: 

   - NomeDevedor - Nome completo do devedor (tipo string(120)); 

   - EnderecoCompleto – Endereço completo de um intimado (tipo string(150)); 

- Reingressos – Array de dados referentes aos reingressos, onde: 

   - Protocolo – Número do protocolo de reingresso (tipo string(100)); 

   - DataPrenotacao – Data de prenotação do reingresso, formato aaaa-mmddhh:mm:ss (tipo string); 

- Boletos – Array de boletos, onde: 

   - DataVencimento – Data de vencimento do boleto, formato aaaa-mm-ddhh:mm:ss (tipo string); 

   - Valor – Valor do boleto, no formato XX.XX (tipo decimal); 

   - URL – URL do boleto gerado, para download ou visualização (tipo string(500)); 

- PrestacoesVencidas – Array de prestações vencidas, onde: 

   - Numero – Número da cobrança/prestação (tipo string); 

   - DataVencimento – Data de vencimento da prestação, formato aaaa-mmddhh:mm:ss (tipo string); 

   - Valor – Valor devido, no formato XX.XX (tipo decimal); 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

141 

- Purgas – Array de dados referentes às purgas, onde: 

   - DataVencimento – Data de vencimento da purga, formato aaaa-mm-ddhh:mm:ss (tipo string); 

   - Valor – Valor da purga, no formato XX.XX (tipo decimal). 

- TipoCobranca - Tipo de Cobrança, onde 1 = INTEGRAL; 2 = PREFEITURA; 3 = ISENÇÃO TOTAL (tipo int); 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|12|O código informado para o pedido de intimação não é<br>válido.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|51|Não foi possível obter os dados do pedido de<br>intimação solicitado.|
|52|O pedido solicitado não pertence ao cartório do<br>usuário autenticado.|
|53|Não foi possível obter os dados do cartório.|
|54|Não foi possível obter as prenotações.|
|55|Não foi possível obter os participantes do pedido.|
|56|Não foi possível obter os imóveis do pedido.|
|57|Não foi possível obter os endereços de<br>correspondência do pedido.|
|58|Não foi possível obter a lista de reingressos do<br>pedido.|
|59|Não foi possível obter os boletos do pedido.|
|60|Não foi possível obter os boletos vencidos do pedido.|
|61|Não foi possível obter as purgas do pedido.|



## **3.11.11 Envelope de Entrada – GetDetalhesIN_V3** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string(50)); 

- IDPedido – Código do pedido (tipo int). 

## **3.11.12 Envelope de Saída – GetDetalhesIN_V3** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

142 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string(200)); 

- Quando RETORNO = true: 

   - IDPedido – ID do pedido (tipo int); 

   - IDStatus - ID do status do pedido (tipo int); 

   - Protocolo – Protocolo do pedido de intimação (tipo string(11)); 

   - Estado – Estado de solicitação (tipo string(50)); 

   - Cidade – Cidade de solicitação (tipo string(100)); 

   - IDCartorio – ID do cartório onde a intimação está registrada (tipo int); 

   - Cartorio – Descrição do cartório onde a intimação está registrada (tipo string(300)); 

   - NumeroContrato – Número do contrato gerado (tipo string(30)); 

   - DataRemessa – Data da remessa, formato aaaa-mm-ddhh:mm:ss (tipo string); 

   - Solicitante – Nome do solicitante (tipo string(120)); 

   - SolicitanteCPFCNPJ – Documento (CPF ou CNPJ) do solicitante (tipo string(14)); 

   - SolicitanteIM – Número de Inscrição Municipal do solicitante (tipo string(30)); 

   - SolicitanteEndereco – Endereço do solicitante (tipo string(150)); 

   - SolicitanteNumero – Número do solicitante (tipo string(10)); 

   - SolicitanteComplemento – Complemento do endereço do solicitante (tipo string(10)); 

   - SolicitanteBairro – Bairro do solicitante (tipo string(40)); 

   - SolicitanteCidade – Cidade do solicitante (tipo string(40)); 

   - SolicitanteEstado – Estado do solicitante (tipo string(2)); 

   - SolicitanteCEP– CEP do solicitante (tipo string(9)); 

   - SolicitanteDDD – DDD do solicitante (tipo string(4)); 

   - SolicitanteTelefone – Telefone do solicitante (tipo string(15)); 

   - SolicitanteEmail – Email do solicitante (tipo string(60)); 

   - Credor – Nome do credor (tipo string(120)); 

   - CredorCPFCNPJ – Documento (CPF ou CNPJ) do credor (tipo string(14)); 

   - CredorIM – Número de Inscrição Municipal do credor (tipo string(30)); 

   - CredorEndereco – Endereço do credor (tipo string(150)); 

   - CredorNumero – Número do credor (tipo string(10)); 

   - CredorComplemento – Complemento do endereço do credor (tipo string(10)); 

   - CredorBairro – Bairro do credor (tipo string(40)); 

   - CredorCidade – Cidade do credor (tipo string(40)); 

   - CredorEstado – Estado do credor (tipo string(2)); 

   - CredorCEP– CEP do credor (tipo string(9)); 

   - CredorDDD – DDD do credor (tipo string(4)); 

   - CredorTelefone – Telefone do credor (tipo string(15)); 

   - CredorEmail – Email do credor (tipo string(60)); 

   - PrestacaoAgencia – Dados da agência de cobrança (tipo string(6)); 

   - PrestacaoEndereco – Endereço de cobrança (tipo string(150)); 

   - Prenotacoes – Array de prenotações, onde: 

      - Numero – Número da prenotação (tipo string(30)); 

      - Data – Data de inclusão da prenotação, formato aaaa-mm-ddhh:mm:ss (tipo string); 

      - DataVencimento – Data de vencimento da prenotação, formato aaaa-mmddhh:mm:ss (tipo string); 

      - ValorServico – Valor das custas de prenotação, no formato XX.XX (tipo decimal). 

   - Devedores – Array de devedores do pedido de intimação, onde: 

      - Nome – Nome completo do devedor (tipo string(120)); 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

143 

   - Participacao – Descrição da participação do devedor na intimação (tipo string(100)); 

   - ▪ CPFCNPJ – Documento (CPF ou CNPJ) do devedor (tipo string(14)); 

- Imoveis – Array de imóveis, onde: 

   - Matricula – Número de matrícula do imóvel (tipo string(10)); 

- EnderecosIntimacoes – Array de endereços de intimações, onde: 

   - NomeDevedor - Nome completo do devedor (tipo string(120)); 

   - EnderecoCompleto – Endereço completo de um intimado (tipo string(150)); 

- Reingressos – Array de dados referentes aos reingressos, onde: 

   - Protocolo – Número do protocolo de reingresso (tipo string(100)); 

   - DataPrenotacao – Data de prenotação do reingresso, formato aaaa-mmddhh:mm:ss (tipo string); 

- Boletos – Array de boletos, onde: 

   - DataVencimento – Data de vencimento do boleto, formato aaaa-mm-ddhh:mm:ss (tipo string); 

   - Valor – Valor do boleto, no formato XX.XX (tipo decimal); 

   - URL – URL do boleto gerado, para download ou visualização (tipo string(500)); 

- PrestacoesVencidas – Array de prestações vencidas, onde: 

   - Numero – Número da cobrança/prestação (tipo string); 

   - DataVencimento – Data de vencimento da prestação, formato aaaa-mmddhh:mm:ss (tipo string); 

   - Valor – Valor devido, no formato XX.XX (tipo decimal); 

- Purgas – Array de dados referentes às purgas, onde: 

   - DataVencimento – Data de vencimento da purga, formato aaaa-mm-ddhh:mm:ss (tipo string); 

   - Valor – Valor da purga, no formato XX.XX (tipo decimal). 

- TipoCobranca - Tipo de Cobrança, onde 1 = INTEGRAL; 2 = PREFEITURA; 3 = ISENÇÃO TOTAL (tipo int); 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|12|O código informado para o pedido de intimação não é<br>válido.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|51|Não foi possível obter os dados do pedido de<br>intimação solicitado.|
|52|O pedido solicitado não pertence ao cartório do<br>usuário autenticado.|
|53|Não foi possível obter os dados do cartório.|
|54|Não foi possível obter as prenotações.|
|55|Não foi possível obter os participantes do pedido.|
|56|Não foi possível obter os imóveis do pedido.|
|57|Não foi possível obter os endereços de|



**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

144 

||correspondência do pedido.|
|---|---|
|58|Não foi possível obter a lista de reingressos do<br>pedido.|
|59|Não foi possível obter os boletos do pedido.|
|60|Não foi possível obter os boletos vencidos do pedido.|
|61|Não foi possível obter as purgas do pedido.|



## **3.11.13 Envelope de Entrada - GetMensagemIN** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string(50)); 

- IDMensagem – Código da mensagem (tipo int). 

## **3.11.14 Envelope de Saída - GetMensagemIN** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string(200)); 

- Quando RETORNO = true: 

   - IDMensagem – ID da mensagem (tipo int); 

   - IDStatus – Código do status da mensagem (tipo int); 

   - Assunto – Descrição do assunto da mensagem (tipo string(100)); 

   - Mensagem – Descrição da mensagem (tipo string(3000)); 

   - ValorServico – Valor das custas de operações cartorárias, no formato XX.XX (tipo decimal); 

   - DataPagamento – Data de pagamento (formato aaaa-mm-ddhh:mm:ss), quando IDStatus = 14(tipo string); 

   - PrenotacaoNumero – Número da prenotação, quando IDStatus = 4 (tipo string(30)); 

   - PrenotacaoData – Data de inclusão da prenotação (formato aaaa-mm-ddhh:mm:ss), quando IDStatus = 4 (tipo string); 

   - PrenotacaoVencimento – Data de vencimento da prenotação (formato aaaa-mmddhh:mm:ss), quando IDStatus = 4 (tipo string); 

   - PrenotacaoValor – Valor das custas de prenotação, quando IDStatus = 4, no formato XX.XX (tipo decimal); 

   - PrenotacaoTipoDestinacaoMutuo– Descrição do tipo destinação mútuo, quando IDStatus = 4.(tipo string); 

   - TipoDeterminacaoJudicial– Descrição do tipo determinação judicial, quando IDStatus = 28.(tipo string); 

   - CanceladoJudicialmente– Indicação se pedido foi cancelado judicialmente, true ou false.(tipo boolean); 

   - DataCancelamentoJudicial– Data do cancelamento judicial realizada no sistema, (formato aaaa-mm-ddhh:mm:ss) quando CanceladoJudicialmente = true.(tipo string); 

   - DataAverbacaoJudicial– Data da averbação judicial, (formato aaaa-mm-ddhh:mm:ss) quando CanceladoJudicialmente = true.(tipo string). 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

145 

- Boletos – Array de boletos, onde: 

   - DataVencimento – Data de vencimento do boleto, formato aaaa-mm-ddhh:mm:ss (tipo string); 

   - Valor – Valor do boleto, no formato XX.XX (tipo decimal); 

   - URL – URL do boleto gerado, para download ou visualização (tipo string(500)); 

- Anexos – Array de arquivos anexados à mensagem, onde: 

   - Nome – Nome ou descrição do arquivo anexado (tipo string(100)); 

   - URL – URL do anexo para download ou visualização (tipo string(500)) esse parâmetro pode retornar vazio pois existe a possibilidade de ocorrer um atraso na gravação física do arquivo. 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|12|O código informado para a mensagem não é válido.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|51|Não foi possível pegar os dados da mensagem.|
|52|Não foi possível obter os dados do pedido de<br>intimação solicitado.|
|53|O pedido da mensagem solicitada não pertence ao<br>cartório do usuário autenticado.|
|54|Não foi possível obter os dados do cartório.|
|55|Não foi possível pegar os dados da prenotação.|
|56|Não foi possível obter os anexos da mensagem.|
|57|Não foi possível obter os boletos vinculados à<br>mensagem.|



## **3.11.15 Envelope de Entrada - GetEmolumentosIN** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string(50)); 

- IDPedido – Código do pedido de intimação (tipo int). 

## **3.11.16 Envelope de Saída - GetEmolumentosIN** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string(200)); 

- Emolumentos – (se RETORNO = true) Array de emolumentos, onde: 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

146 

- IDEmolumento – ID do registro correspondente ao emolumento (tipo int); 

- Data – Data de inclusão do emolumento, formato aaaa-mm-ddhh:mm:ss (tipo string); 

- ProtocoloPagamento – Protocolo de identificação do pagamento gerado (tipo string(12)); 

- Status – Descrição do tipo de status de emolumentos das custas (tipo string(150)); 

- Descricao – Descrição dos emolumentos pelo usuário (tipo string(150)); 

- Valor – Valor do emolumento cadastrada, no formato XX.XX (tipo decimal); 

- Pago – Retorna TRUE ou FALSE para identificar se já foi identificado pagamento para a cobrança gerada (tipo booleano); 

- DataCompensacao – O valor do campo será vazio pois ele foi direcionado para o método ListPagamentosIN(); 

- DataRepasse – O valor do campo será vazio pois ele foi direcionado para o método ListPagamentosIN(). 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|12|O código informado para o pedido não é válido.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|51|Não foi possível obter os dados do pedido de<br>intimação solicitado.|
|52|O pedido da mensagem solicitada não pertence ao<br>cartório do usuário autenticado.|
|53|Não foi possível obter as custas do pedido.|
|54|Não foi possível obter os dados do cartório.|



Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|12|O código informado para a intimação não é válido.|
|13|O código informado para o status da mensagem não<br>é válido.|
|14|O assunto da mensagem deve ser informado.|
|15|O texto da mensagem não foi informado.|
|16|Não foi possível carregar o pedido de intimação<br>informado.|
|17|O status informado não é válido para a operação de<br>cadastramento de mensagem.|
|18|É obrigatória a inclusão de pelo menos um anexo<br>para os status 3, 10, 12, 23 ou 25.|
|19|Um dos anexos da requisição não teve o DOC_ID<br>informado.|



**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

## 147 

|20|É obrigatório informar o número da prenotação para o<br>status Prenotado.|
|---|---|
|21|É obrigatório informar uma data de prenotação para o<br>status Prenotado.|
|22|A data de prenotação informada é inválida.|
|23|É obrigatório informar o vencimento da prenotação<br>para o status Prenotado.|
|24|A data de vencimento informada é inválida.|
|25|A data de vencimento informada deve ser maior que<br>a data atual.|
|26|É obrigatório informar o valor do serviço para os<br>status Boleto Consolidação ou Edital.|
|27|O valor do serviço informado é inválido.|
|28|O valor do serviço informado deve ser superior a<br>zero.|
|29|É obrigatório informar a data de pagamento para o<br>status Pagamento Cartório.|
|30|A data de pagamento informada é inválida.|
|31|É obrigatório informar o valor do pagamento para o<br>status Pagamento Cartório.|
|32|O valor do pagamento informado é inválido.|
|33|O valor do pagamento informado deve ser superior a<br>zero.|
|34|Não foi possível obter os dados para geração do<br>boleto.|
|35|Não foi possível gravar/gerar o boleto. Erro:<br>[DESCRICAO]|
|36|Não foi possível gerar os emolumentos.|
|37|Não foi possível gerar o pagamento.|
|38|Não foi possível concluir o cadastramento da<br>mensagem no sistema.|
|39|Não foi possível inclusão da mensagem pois o pedido<br>de intimação foi finalizado.|
|40|Não foi possível inclusão da mensagem de devolução<br>pois existe uma outra intimação ativa para esse<br>contrato|
|41|Não foi possível localizar a URL Boleto (MUP).|
|42|O código informado para o status da mensagem não<br>está com Desistência.|
|43|Não foi possível obter as mensagens.|
|44|O código informado para o status da mensagem não<br>é válido.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|48|Não foi possível inclusão da mensagem pois existe<br>uma mensagem anterior igual.|
|49|Apenas os status Prenotado ou Devolvido por<br>Incompetência são permitidos para um pedido Em<br>Aberto.|
|52|Tipo destinação mútuo informado é inválido.|
|56|Tipo Determinação Judicial informado inválido.|



**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

## 148 

|60|Não foi possível desbloquear os arquivos.|
|---|---|
|101|Não foi possível cadastrar o arquivo.|
|102|Arquivo não encontrado: [URLArquivo]|
|103|Não foi possível verificar se o arquivo existe.|
|104|Extensão não permitida. Apenas arquivos .pdf, .docou<br>.p7s são permitidos.|
|105|Aplicação inválida.|



## **3.11.15 Envelope de Entrada - AdicionarMensagemIN** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string(50)); 

- IDIntimacao – Código do pedido (tipo int); 

- IDStatus – Código do status de mensagem (tipo int), cujos tipos habilitados são: 

- 2 - Devolvido; 

- 3 - Devolvido com exigência; 

- 

- 

   - 4 - Prenotado; 

   - 6 - Boleto de consolidação; 

- 7 - Intimado; 

- 

- 

- 

- 

- 

   - 8 - Não Intimado; 

   - 10 - Negativa Pagamento; 

   - 12 - Registro / Averbação; 

   - 14 - Pagamento no Cartório; 

   - 16 - Expedição de Intimação; 

- 20 - Informação RI; 

- 

   - 22 - Boleto Intimação Edital; 

- 23 - Arquivamento por desinteresse; 

- 

   - 24 - Devolvido por Incompetência; 

- 25 - Desistência Concluída; 

- 29 – Nova Projeção; 

OBS.: para filtrar todos os status, o valor inserido deve ser 0 (zero); 

- Assunto – Assunto da mensagem (tipo string(100)); 

- Mensagem – Descrição da mensagem (tipo string(3000)); 

- NumeroPrenotacao – Número de prenotação, obrigatório apenas quando o IDStatus for = 4 (tipo 

- string(30)); 

- DataPrenotacao – Data de prenotação (formato: aaaa-mm-ddhh:mm:ss) , obrigatório apenas 

- quando o IDStatus for = 4 (tipo string); 

- VencimentoPrenotacao – Data de vencimento da prenotação (formato: aaaa-mm-ddhh:mm:ss) , 

- obrigatório apenas quando o IDStatus for = 4 (tipo string); 

● ValorPrenotacao – Valor da prenotação, obrigatório apenas quando o IDStatus for = 4 (tipo decimal); 

● TipoDestinacaoMutuo –Tipo de destinação mútuo de 1 a 20, obrigatório apenas quando o IDStatus for = 4 (tipo integer); 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

149 

- 1 - Comércio; 

- 2 - Exportação; 

- 3 - Habitacional - Compra de imóvel dado em garantia; 

- 4 - Habitacional - Compra de outro imóvel; 

- 5 - Habitacional - Construção - Autoconstrução; 

- 6 - Habitacional - Construção - Empreendimento; 

- 7 - Habitacional - Reforma e Ampliação; 

- 8 - Importação; 

- 9 - Microcrédito; 

- 10 - Não declarada; 

- 11 - Não Habitacional - Compra de outro imóvel; 

- 12 - Não Habitacional - Construção - autoconstrução; 

- 13 - Não Habitacional - Construção – empreendimento; 

- 14 - Não Habitacional - Compra de imóvel dado em garantia; 

- 15 - Operações societárias; 

- 16 - Produção agrícola; 

- 17 - Produção industrial; 

- 18 - Produção pecuária; 

- 19 - Serviços; 

- 20 - Outras destinações; 

● TipoDeterminacaoJudicial– Tipo de determinaço judicial (1 - PARALISAÇÃO DO PROCEDIMENTO, 2 - OUTROS), obrigatório apenas quando o IDStatus for = 28 (tipo integer). 

- ValorServico – Valor das custas  referentes aos tramites burocráticos, obrigatório apenas quando o 

- IDStatus for = 6 ou 22 (tipo decimal) ou Valor de Devolução de custas ao cliente apenas para pedidos finalizado com IdStatus = 12 ou 25; 

- DataPagamento – Data do pagamento (formato: aaaa-mm-ddhh:mm:ss) , obrigatório apenas 

- quando o IDStatus for = 14 (tipo string); 

● ValorPagamento – Valor do pagamento, obrigatório apenas quando o IDStatus for = 14 (tipo decimal); 

## **3.11.16 Envelope de Saída - AdicionarMensagemIN** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string(20)); 

- URLBoleto - (se RETORNO = true) URL do boleto gerado, quando o IDStatus for = 6 ou 22 (tipo 

- string(500)); 

- IDPagamento - (se RETORNO = true) ID do pagamento cadastrado, quando o IDStatus for = 6 ou 

- 22 (tipo int). 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

150 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|12|O código informadopara a intimação não é válido.|
|13|O código informadopara o status da mensagem não é válido.|
|14|O assunto da mensagem deve ser informado.|
|15|O texto da mensagem não foi informado.|
|16|Não foipossível carregar opedido de intimação informado.|
|17|O status informado não é válidopara a operação de cadastramento de mensagem.|
|18|É obrigatória a inclusão depelo menos um anexopara os status 3, 10, 12, 23 ou 25.|
|19|Um dos anexos da requisição não teve o DOC_ID informado.|
|20|É obrigatório informar o número daprenotaçãopara o status Prenotado.|
|21|É obrigatório informar uma data deprenotaçãopara o status Prenotado.|
|22|A data deprenotação informada é inválida.|
|23|É obrigatório informar o vencimento daprenotaçãopara o status Prenotado.|
|24|A data de vencimento informada é inválida.|
|25|A data de vencimento informada deve ser maiorque a data atual.|
|26|É obrigatório informar o valor do serviçopara os status Boleto Consolidação ou Edital.|
|27|O valor do serviço informado é inválido.|
|28|O valor do serviço informado deve ser superior a zero.|
|29|É obrigatório informar a data depagamentopara o status Pagamento Cartório.|
|30|A data depagamento informada é inválida.|
|31|É obrigatório informar o valor dopagamentopara o status Pagamento Cartório.|
|32|O valor dopagamento informado é inválido.|
|33|O valor dopagamento informado deve ser superior a zero.|
|34|Não foipossível obter os dadosparageração do boleto.|
|35|Não foipossívelgravar/gerar o boleto. Erro:[DESCRICAO]|
|36|Não foipossívelgerar os emolumentos.|
|37|Não foipossívelgerar opagamento.|
|38|Não foipossível concluir o cadastramento da mensagem no sistema.|
|39|Não foipossível inclusão da mensagempois opedido de intimação foi finalizado.|
|40|Não foi possível inclusão da mensagem de devolução pois existe uma outra intimação ativa<br>para esse contrato|
|41|Não foipossível localizar a URL Boleto(MUP).|
|42|O código informadopara o status da mensagem não está com Desistência.|
|43|Não foipossível obter as mensagens.|
|44|O código informadopara o status da mensagem não é válido.|
|45|Hash inválido.|
|46|Hash inválido: Hashjá utilizado.|
|47|Hash inválido: Hash expirado.|
|48|Não foipossível inclusão da mensagempois existe uma mensagem anterior igual.|
|49|Apenas os status Prenotado ou Devolvido por Incompetência são permitidos para um<br>pedido Em Aberto.|



**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

## 151 

|52|Tipo destinação mútuo informado é inválido.|
|---|---|
|56|Tipo Determinação Judicial informado inválido.|
|60|Não foipossível desbloquear os arquivos.|
|101|Não foipossível cadastrar o arquivo.|
|102|Arquivo não encontrado:[URLArquivo]|
|103|Não foipossível verificar se o arquivo existe.|
|104|Extensão nãopermitida. Apenas arquivos .pdf, .docou .p7s sãopermitidos.|
|105|Aplicação inválida.|



## **3.11.17 Envelope de Entrada - AdicionarEmolumentoIN** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string(50)); 

- IDPedido – Código do pedido (tipo int); 

- IDStatus – Status vinculado ao tipo de emolumento informado (tipo int), cujos tipos habilitados são: 

   - 1 - Prenotacao; 

   - 2 - Outros; 

   - 3 - Intimação; 

- Descricao – Descrição do novo emolumento (tipo string(150)); 

- Valor – Valor das custas a serem cadastradas, no formato XX.XX (tipo decimal). 

## **3.11.18 Envelope de Saída - AdicionarEmolumentoIN** 

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
|12|O código informado para a intimação não é válido.|
|13|O código informado para o status do emolumentos<br>não é válido.|
|14|A descrição do emolumento deve ser informado.|
|15|O valor do emolumento não foi informado.|
|16|O valor do emolumento que foi informado não é um<br>valor válido.|
|17|Não foi possível carregar o pedido de intimação<br>informado.|
|18|O pedido da mensagem solicitada não pertence ao<br>cartório do usuário autenticado.|
|19|Não foi possível cadastrar as custas.|
|45|Hash inválido.|



**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

152 

|46|Hash inválido: Hash já utilizado.|
|---|---|
|47|Hash inválido: Hash expirado.|



## **3.11.19 Envelope de Entrada - ExcluirEmolumentoIN** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string(50)); 

- IDEmolumento – Código do emolumento obtido através da listagem de emolumentos (tipo int). 

## **3.11.20 Envelope de Saída - ExcluirEmolumentoIN** 

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
|12|O IDEmolumento informado é inválido.|
|17|Não foi possível carregar os dados do emolumento<br>informado.|
|18|Não foi possível carregar o pedido de intimação<br>vinculado ao emolumento informado.|
|19|O pedido de intimação solicitado não pertence ao<br>cartório do usuário autenticado.|
|20|Não é possível excluir as custas, pois foi gerado um<br>boleto para custa selecionada.|
|21|Não é possível excluir as custas, pois foi já foi<br>efetuado pagamento para custa selecionada.|
|22|Não foi possível excluir as custas.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|||



## **3.11.21 Envelope de Entrada – ListPagamentosIN** Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string(50)); 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

153 

- MaxRowPerPage – Quantidade máxima de registros a serem retornados por página (tipo int); 

- PageNumber – Página a ser retornada (tipo int); 

- Protocolo – Protocolo do pedido de intimação (tipo string(11)); 

- IDStatusPagamentos – ID do status do pagamento (tipo int), o valor inserido deve ser 0 (zero) para qualquer status ou 1 - Em aberto / 2 - Em processamento / 3 - Concluido ; 

- IDStatusEmolumentos – ID do status do tipo de emolumentos (tipo int), o valor padrão inserido deve ser 0 (zero) para qualquer status ou 1 - Prenotação / 2 - Outros / 3 - Intimação / 5 - Boleto de Consolidação / 6 - Boleto Edital; 

- ProtocoloPagamento – Protocolo do Boleto de pagamento do pedido de intimação (tipo string(15)); 

- NossoNumero – Nosso Numero do Boleto de Pagamento do pedido de intimação (tipo string(20)); 

- DataCustasInicial – Data inicial das custas a serem filtrados, formato: aaaa-mm-dd (tipo string); 

- DataCustasFinal – Data final das custas a serem filtrados, formato: aaaa-mm-dd (tipo string); 

- DataPagamentoInicial – Data inicial dos pagamentos das custas a serem filtrados, formato: aaaamm-dd (tipo string); 

   - DataPagamentoFinal – Data final dos pagamentos das custas a serem filtrados, formato: 

   - aaaa-mm-dd (tipo string). 

## **3.11.22 Envelope de Saída - ListPagamentosIN** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string(200)); 

- QtdeRegistros – (se RETORNO = true)  Quantidade total de registros encontrados (tipo int); 

- QtdePaginas  – (se RETORNO = true)  Quantidade total de páginas, de acordo com o total de registros encontrados e com a quantidade máxima de registros por página que foi informada no envelope de entrada - MaxRowPerPage - (tipo int); 

- Pagamentos - (se RETORNO = true)  Array dos pagamentos encontrados, apresentando as seguintes informações: 

   - IDPedido – Código do pedido (tipo int); 

   - IDCustas – Código das custas (tipo int); 

   - Protocolo – Protocolo do pedido de intimação (tipo string(11)); 

   - ProtocoloPagamento– Protocolo do boleto de pagamento (tipo string(15)); 

   - DataVencimento – Data de vencimento do pedido, formato: aaaa-mm-ddhh:mm:ss (tipo string); 

   - TipoCustas – Descrição do tipo de Custas (tipo string(150)); 

   - NossoNumero – Numeração do Nosso Numero do boleto de pagamento (tipo string(20)) ; 

   - DescricaoStatus – Descrição do status das custas - (tipo string(150)); 

   - Valor – Valor das custas (tipo decimal); 

   - UsuarioEfetivou - o nome do usuário  que efetuou o pagamento das custas (tipo string(100)); 

   - DataCompensacao – Data de compensação após pagamento identificado, formato aaaamm-ddhh:mm:ss (tipo string); 

   - DataRepasse – Data de repasse das custas para o beneficiado, formato aaaa-mmddhh:mm:ss (tipo string); 

   - Pago – Retorna TRUE ou FALSE para identificar se já foi identificado pagamento para a cobrança gerada (tipo booleano). 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

154 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|12|A quantidade de registros por página informada é<br>inválida. A quantidade mínima permitida é 10.|
|13|A página informada é inválida.|
|16|A data das custas inicial é inválida.|
|17|A data das custas final é inválida.|
|30|A página informada é inválida. Página máxima<br>possível: [PAGINA]|
|51|Não foi possível obter os pagamentos.|
