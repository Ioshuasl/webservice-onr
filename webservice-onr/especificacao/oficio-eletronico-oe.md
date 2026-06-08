# WSOficio — Ofício Eletrônico (OE)

> Extraído de [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) (seções 3.5).

---
## **3.5 Ofícios** 

O ONR disponibiliza os serviços referentes aos Ofícios através de web services contemplando as seguintes funcionalidades: 

- A. Listagem de instituições 

Retorna uma lista das Instituições cadastradas e ativas no sistema do Ofício Eletrônico. 

- B. Obter pedido 

Obtém dados de um pedido. 

- C. Listar pedidos 

Retorna uma lista dos pedidos de acordo com os parâmetros informados. 

- D. Responder pedido 

Permite responder um pedido. 

- E. Responder pedido – Devolução 

Permite responder um pedido com devolução. 

- F. Responder pedido – Negativa em Lote 

Permite responder um ou mais pedidos com negativa. 

- G. Listar cartórios permitidos para retransmissão 

Retorna uma lista dos cartórios permitidos para retransmissão. 

- H. Retransmitir pedido 

Permite retransmitir um pedido para outro cartório. 

- O contrato WSDL para homologação pode ser visualizado em: https://hml3- wsoficio.onr.org.br/oficios.asmx?wsdl 

Métodos a serem referenciados: **ListInstituicoesOE; GetPedidoOE;** 

## **ListPedidosOE;ListPedidosOE_V2; SetPedidoRespondidoOE; SetPedidoDevolvidoOE; SetPedidoNegativaLoteOE; SetPedidoRetransmitidoOE; ListCartoriosRestransmitirOE.** 

## **3.5.1 Envelope de Entrada - ListInstituicoesOE** 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

62 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string). 

## **3.5.2 Envelope de Saída - ListInstituicoesOE** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string); 

- Instituicoes - (se RETORNO = true)  Array das Instituições encontradas, apresentando as seguintes informações: 

   - IDInstituicao – Código da Instituição (tipo int); 

   - Instituicao – Nome da Instituição (tipo string). 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|51|Não foi possível obter as Instituições.|



## **3.5.3 Envelope de Entrada - GetPedidoOE** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string); 

- IDPedido – Código do pedido (tipo int). 

## **3.5.4 Envelope de Saída - GetPedidoOE** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string); 

- IDPedido - (se RETORNO = true) Código do pedido (tipo int); 

- IDStatus - (se RETORNO = true) Código do status (tipo int). Valores possíveis: 

   - 1 = Aberto 

   - 2 = Respondido 

   - 3 = Devolvido 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

## 63 

      - 5 = Finalizado sem Pagamento 

      - 7 = Nota de Exigência 

      - 8 = Reaberto não Concluído 

      - 9 = Prenotado 

      - 10 = Aguardando Pagto 

      - 11 = Aguardando Pagto – Vencido 

      - 12 = Não Prenotado 

      - 13 = Pagamento Efetivado (Penhoras Pagas) 

      - 14 = Registro / Averbação 

- IDInstituicao - (se RETORNO = true) Código da Instituição solicitante (tipo int); 

- Instituicao - (se RETORNO = true) Nome da Instituição solicitante (tipo string); 

- Departamento - (se RETORNO = true) Departamento da Instituição solicitante (tipo string); 

- IDUsuario - (se RETORNO = true) Código do usuário solicitante (tipo int); 

- Usuario - (se RETORNO = true) Nome do usuário solicitante (tipo string); 

- IDTipoPesquisa - (se RETORNO = true) Código do tipo da pesquisa (tipo int). Valores possíveis: 

      - 1 = Endereço Rua 

      - 2 = Endereço Edifício 

      - 3 = Endereço Loteamento 

      - 4 = Matrícula 

   - 5 = Transcrição 

      - 6 = Pessoa 

      - 7 = Registro 

      - 8 = Pactuantes 

- IDTipoCertidao - (se RETORNO = true) Código do tipo de certidão (tipo int). Valores possíveis: 

      - 1 = Propriedade/Negativa de Propriedade 

      - 2 = Vintenária 

      - 3 = Matrícula 

      - 4 = Transcrição 

      - 5 = Registro de Pacto Antenupcial 

- Protocolo - (se RETORNO = true) Protocolo do pedido (tipo string); 

- Ticket - (se RETORNO = true) Ticket do pedido (tipo int); 

- NumeroOficio - (se RETORNO = true) Número do Ofício (tipo string); 

- DataSolicitacao - (se RETORNO = true) Data do pedido, formato: aaaa-mm-dd (tipo string); 

- DataResposta - (se RETORNO = true) Data da resposta, formato: aaaa-mm-dd (tipo string); 

- Resposta - (se RETORNO = true) Resposta (tipo string); 

- Retransmitido - (se RETORNO = true) true/false indicando se o pedido foi retransmitido (tipo boolean); 

- TipoPessoa - (se RETORNO = true) Tipo da pessoa (tipo int). Valores possíveis: 

      - 1 = Pessoa física 

      - 2 = Pessoa jurídica 

- NomeRazao - (se RETORNO = true) Nome ou Razão (tipo string); 

- CPFCNPJ - (se RETORNO = true) CPF ou CNPJ (tipo string); 

- RGIE - (se RETORNO = true) RG ou IE (tipo string); 

- ImoveisDireitos - (se RETORNO = true) (tipo int). Valores possíveis: 

      - 1 = Informar somente os imóveis/direitos que seja proprietário/titular 

      - 2 = Informar também os imóveis/direitos que foram transferidos 

- DataTransferencia - (se RETORNO = true) Data da transferência, formato: aaaa-mm-dd (tipo string); 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

64 

- Observacoes - (se RETORNO = true) Observações (tipo string); 

- Matricula - (se RETORNO = true) Número da Matrícula (tipo string); 

- Transcricao - (se RETORNO = true) Número da Transcrição (tipo string); 

- DataTranscricao - (se RETORNO = true) Data da transcrição, formato: aaaa-mm-dd (tipo string); 

- LivroNumero - (se RETORNO = true) Número do Livro (tipo string); 

- Endereco - (se RETORNO = true) Endereço (tipo string); 

- Numero - (se RETORNO = true) Número do Endereço (tipo string); 

- Complemento - (se RETORNO = true) Complemento do Endereço (tipo string); 

- CEP - (se RETORNO = true) CEP do Endereço (tipo string); 

- Edificio - (se RETORNO = true) Nome do edifício (tipo string); 

- Apartamento - (se RETORNO = true) Número do Apartamento (tipo string); 

- ComplementoApto - (se RETORNO = true) Complemento do Edifício (tipo string); 

- Loteamento - (se RETORNO = true) Loteamento (tipo string); 

- Lote - (se RETORNO = true) Lote (tipo string); 

- Quadra - (se RETORNO = true) Quadra (tipo string); 

- NContribuinte - (se RETORNO = true) Nº Contribuinte(IPTU) (tipo string); 

- Registro - (se RETORNO = true) Registro (tipo string); 

- DataCasamento - (se RETORNO = true) Data do Casamento, formato: aaaa-mm-dd (tipo string); 

- NomeMarido - (se RETORNO = true) Nome do marido (tipo string); 

- NomeEsposa - (se RETORNO = true) Nome da esposa (tipo string). 

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
|51|Não foi possível pegar os dados do pedido.|
|56|Usuário não tem permissão para acessar o pedido<br>informado.|



## **3.5.5 Envelope de Entrada - ListPedidosOE** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string); 

- MaxRowPerPage – Quantidade máxima de registros a serem retornados por página (tipo int); 

- PageNumber – Página a ser retornada (tipo int); 

- Protocolo – Protocolo a ser filtrado – opcional (tipo string); 

- IDInstituicao – Código da Instituição solicitante a ser filtrado. Para retornar todos, informar -1. Para obter os códigos das Instituições conferir o método ListInstituicoesOE, item 3.5.1 (tipo int); 

- IDTipoPesquisa – Código do Tipo de Pesquisa a ser filtrado. Para retornar todos, informar -1. Para uma lista dos valores possíveis, conferir o item 3.5.4 (tipo int); 

- IDStatus – Código do Status a ser filtrado. Para retornar todos, informar -1. Para uma lista dos 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

65 

valores possíveis, conferir o item 3.5.4 (tipo int); 

- DataSolicitacaoInicial – Data inicial da solicitação a ser filtrada, formato: aaaa-mm-dd (tipo string); 

- DataSolicitacaoFinal – Data final da solicitação a ser filtrada, formato: aaaa-mm-dd (tipo string); 

- DataRespostaInicial – Data inicial da resposta a ser filtrada, formato: aaaa-mm-dd - opcional (tipo string); 

- DataRespostaFinal – Data final da resposta a ser filtrada, formato: aaaa-mm-dd - opcional (tipo string). 

## **3.5.6 Envelope de Saída - ListPedidosOE** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string); 

- QtdeRegistros – (se RETORNO = true)  Quantidade total de registros encontrados (tipo int); 

- QtdePaginas  – (se RETORNO = true)  Quantidade total de páginas, de acordo com o total de registros encontrados e com a quantidade máxima de registros por página que foi informada no envelope de entrada - MaxRowPerPage - (tipo int); 

- Pedidos - (se RETORNO = true)  Array dos pedidos encontrados, apresentando as seguintes informações: 

   - IDPedido – Código do pedido (tipo int); 

   - IDStatus – Código do Status.  Para uma lista dos valores possíveis, conferir o item 3.5.4 (tipo int); 

   - IDInstituicao – Código da Instituição solicitante (tipo int); 

   - Instituicao – Nome da Instituição solicitante (tipo string); 

   - IDTipoPesquisa – Código do Tipo de Pesquisa.  Para uma lista dos valores possíveis, conferir o item 3.5.4 (tipo int); 

   - Protocolo – Protocolo do título (tipo string); 

   - NumeroOficio – Número do Ofício (tipo string); 

   - DataSolicitacao – Data do pedido, formato: aaaa-mm-dd (tipo string); 

   - DataResposta – Data da resposta, formato: aaaa-mm-dd (tipo string). 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|12|A quantidade de registros por página informada é<br>inválida. A quantidade mínima permitida é 10.|
|13|A página informada é inválida.|
|14|A data de solicitação inicial não foi informada.|
|15|A data de solicitação inicial informada é inválida.|
|16|A data de solicitação final não foi informada.|
|17|A data de solicitação final informada é inválida.|
|18|O período da data de solicitação não pode ser maior|



**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

66 

||que 30 dias.|
|---|---|
|19|A data da resposta inicial informada é inválida.|
|20|A data da resposta final informada é inválida.|
|30|A página informada é inválida. Página máxima<br>possível: [PAGINA]|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|51|Não foi possível obter os pedidos.|



## **3.5.7 Envelope de Entrada – ListPedidosOE_V2** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string); 

- MaxRowPerPage – Quantidade máxima de registros a serem retornados por página (tipo int); 

- PageNumber – Página a ser retornada (tipo int); 

- Protocolo – Protocolo a ser filtrado – opcional (tipo string); 

- IDInstituicao – Código da Instituição solicitante a ser filtrado. Para retornar todos, informar -1. Para obter os códigos das Instituições conferir o método ListInstituicoesOE, item 3.5.1 (tipo int); 

- IDTipoPesquisa – Código do Tipo de Pesquisa a ser filtrado. Para retornar todos, informar -1. Para uma lista dos valores possíveis, conferir o item 3.5.4 (tipo int); 

- IDStatus – Código do Status a ser filtrado. Para retornar todos, informar -1. Para uma lista dos valores possíveis, conferir o item 3.5.4 (tipo int); 

- DataSolicitacaoInicial – Data inicial da solicitação a ser filtrada, formato: aaaa-mm-dd (tipo string); 

- DataSolicitacaoFinal – Data final da solicitação a ser filtrada, formato: aaaa-mm-dd (tipo string); 

- DataRespostaInicial – Data inicial da resposta a ser filtrada, formato: aaaa-mm-dd - opcional (tipo string); 

- DataRespostaFinal – Data final da resposta a ser filtrada, formato: aaaa-mm-dd - opcional (tipo string). 

## **3.5.8 Envelope de Saída – ListPedidosOE_V2** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string); 

- QtdeRegistros – (se RETORNO = true)  Quantidade total de registros encontrados (tipo int); 

- QtdePaginas  – (se RETORNO = true)  Quantidade total de páginas, de acordo com o total de registros encontrados e com a quantidade máxima de registros por página que foi informada no envelope de entrada - MaxRowPerPage - (tipo int); 

- Pedidos - (se RETORNO = true)  Array dos pedidos encontrados, apresentando as seguintes informações: 

   - IDPedido – Código do pedido (tipo int); 

   - IDStatus – Código do Status.  Para uma lista dos valores possíveis, conferir o item 3.5.4 (tipo int); 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

67 

- IDInstituicao – Código da Instituição solicitante (tipo int); 

- CNPJInstituicao – CNPJ da Instituição solicitante (tipo string); 

- Instituicao – Nome da Instituição solicitante (tipo string); 

- IDTipoPesquisa – Código do Tipo de Pesquisa.  Para uma lista dos valores possíveis, conferir o item 3.5.4 (tipo int); 

- Protocolo – Protocolo do título (tipo string); 

- NumeroOficio – Número do Ofício (tipo string); 

- DataSolicitacao – Data do pedido, formato: aaaa-mm-dd (tipo string); 

- DataResposta – Data da resposta, formato: aaaa-mm-dd (tipo string). 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|12|A quantidade de registros por página informada é<br>inválida. A quantidade mínima permitida é 10.|
|13|A página informada é inválida.|
|14|A data de solicitação inicial não foi informada.|
|15|A data de solicitação inicial informada é inválida.|
|16|A data de solicitação final não foi informada.|
|17|A data de solicitação final informada é inválida.|
|18|O período da data de solicitação não pode ser maior<br>que 30 dias.|
|19|A data da resposta inicial informada é inválida.|
|20|A data da resposta final informada é inválida.|
|30|A página informada é inválida. Página máxima<br>possível: [PAGINA]|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|51|Não foi possível obter os pedidos.|



## **3.5.9 Envelope de Entrada - SetPedidoRespondidoOE** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string); 

- IDPedido – Código do pedido (tipo int); 

- Resposta – Resposta a ser cadastrada para o pedido (tipo string); 

- Negativa – 1/0, indica se é uma negativa – (tipo boolean); 

- Anexos - Array de arquivos, apresentando as seguintes informações: 

   - Nome – Nome do arquivo (tipo string); 

   - URLArquivo – URL do arquivo. O cartório precisa informar uma URL válida para download do arquivo anexado. Os arquivos informados serão colocados em uma fila e serão baixados posteriormente pelo sistema do Ofício Eletrônico. O pedido 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

68 

não será efetivamente respondido antes que todos os arquivos sejam baixados. (tipo string). 

## **3.5.10 Envelope de Saída - SetPedidoRespondidoOE** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string). 

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
|51|Não foi possível pegar os dados do pedido.|
|52|Usuário não tem permissão para cadastrar resposta<br>para esse pedido.|
|53|Pedido já respondido.|
|54|O nome de um ou mais anexos não foi informado.|
|55|Não foi informada a URL de um ou mais anexos.|
|56|Não foi possível responder o pedido.|
|60|Não foi possível desbloquear os arquivos.|
|101|Não foi possível cadastrar o arquivo.|
|102|Arquivo não encontrado: [URL]|
|103|Não foi possível verificar se o arquivo existe.|
|104|Extensão não permitida. Apenas arquivos .p7s são<br>permitidos.|
|105|Aplicação inválida.|
|501|Campos obrigatórios não foram informados.|
|502|Já existe resposta para esse pedido. O status do<br>pedido será alterado assim que todos os arquivos<br>informados forem baixados pelo sistema do Ofício<br>Eletrônico.|



**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

69 

## **3.5.11 Envelope de Entrada – SetPedidoRespondidoOE_DocID** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string); 

- IDPedido – Código do pedido (tipo int); 

- Resposta – Resposta a ser cadastrada para o pedido (tipo string); 

- Negativa – 1/0, indica se é uma negativa – (tipo boolean); 

- Anexos - Array de arquivos, apresentando as seguintes informações: 

   - Nome – Nome do arquivo (tipo string); 

   - DocumentID - Identifica o anexo no AssinadorWeb (tipo string) 

## **3.5.12 Envelope de Saída – SetPedidoRespondidoOE_DocID** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string). 

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
|51|Não foi possível pegar os dados do pedido.|
|52|Usuário não tem permissão para cadastrar resposta<br>para esse pedido.|
|53|Pedido já respondido.|
|54|O nome de um ou mais anexos não foi informado.|
|55|Não foi informada a DocumentID de um ou mais<br>anexos.|
|56|Não foi possível responder o pedido.|
|60|Não foi possível desbloquear os arquivos.|
|101|Não foi possível cadastrar o arquivo.|
|102|Arquivo não encontrado: [DocumentID]|
|103|Não foi possível verificar se o arquivo existe.|
|104|Extensão não permitida. Apenas arquivos .p7s são<br>permitidos.|
|105|Aplicação inválida.|



**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

## 70 

|501|Campos obrigatórios não foram informados.|
|---|---|
|502|Já existe resposta para esse pedido. O status do<br>pedido será alterado assim que todos os arquivos<br>informados forem baixados pelo sistema do Ofício<br>Eletrônico.|



## **3.5.13 Envelope de Entrada - SetPedidoDevolvidoOE** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string); 

- IDPedido – Código do pedido (tipo int); 

- MotivoDevolucao – Motivo da devolução (tipo string). 

## **3.5.14 Envelope de Saída - SetPedidoDevolvidoOE** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string). 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|12|O IDPedido informado é inválido.|
|13|O MotivoDevolucao não foi informado.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|51|Não foi possível pegar os dados do pedido.|
|52|Usuário não tem permissão para cadastrar resposta<br>para esse pedido.|
|53|Pedido já respondido.|
|54|Não foi possível responder o pedido.|



## **3.5.15 Envelope de Entrada - SetPedidoNegativaLoteOE** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string); 

- Pedidos – Código dos pedidos a serem negativados (array de int). 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

71 

## **3.5.16 Envelope de Saída - SetPedidoNegativaLoteOE** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string). 

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
|151|O IDPedido informado é inválido.|
|152|Não foi possível pegar os dados do pedido.|
|153|Usuário não tem permissão para cadastrar resposta<br>para esse pedido.|
|154|Pedido já respondido.|
|155|Não foi possível responder o pedido.|



## **3.5.17 Envelope de Entrada - ListCartoriosRestransmitirOE** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string). 

## **3.5.18 Envelope de Saída - ListCartoriosRestransmitirOE** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string); 

- Cartorios - (se RETORNO = true)  Array dos cartórios encontrados, apresentando as seguintes informações: 

   - IDCartorio – Código do cartório (tipo int); 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

72 

`o` Cartorio – Número do cartório. Ex.: 01º, 02º,03 º.  (tipo string). 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|51|Apenas usuários de cartórios são permitidos.|
|52|Não foi possível obter os dados do cartório do<br>usuário.|
|53|Não foi possível obter os cartórios.|



## **3.5.19 Envelope de Entrada - SetPedidoRetransmitidoOE** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string); 

- IDPedido – Código do pedido (tipo int); 

- IDCartorio – Código do cartório a ser retransmitido. A lista de cartórios permitidos para retransmissão pode ser obtida pelo método ListCartoriosRestransmitirOE, cf. item 3.5.13 (tipo int); 

- Observacoes – Observações - * opcional (tipo string). 

## **3.5.20 Envelope de Saída - SetPedidoRetransmitidoOE** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string). 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|12|O IDPedido informado é inválido.|
|13|O IDCartorio informado é inválido.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|51|Não foi possível pegar os dados do pedido.|
|52|Usuário não tem permissão para retransmitir para|



**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

73 

||esse pedido.|
|---|---|
|53; 502|Pedido já respondido.|
|54; 503|Apenas pedidos dos tipos Endereço Rua, Endereço<br>Edifício e Endereço Loteamento podem ser<br>retransmitidos.|
|55|Não foi possível retransmitir o pedido.|
|501|O pedido não pode ser retransmitido para o cartório<br>que ele pertence.|
|504|O cartório informado não é permitido.|



**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

74
