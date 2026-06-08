# WSOficio — Acompanhamento de Títulos (AT)

> Extraído de [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) (seções 3.2).

---
## **3.2 Acompanhamento de Títulos** 

O ONR disponibiliza o serviço de Acompanhamento de Títulos através de web services contemplando as seguintes funcionalidades: 

- A. Listagem de Títulos 

Retorna uma lista de títulos de acordo com os parâmetros informados. 

- B. Listagem de Status 

Retorna uma lista dos status cadastrados para o título informado. 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

17 

- C. Obter Título 

Esse serviço permite recuperar os dados de um título específico. 

- D. Obter Status 

Esse serviço permite recuperar os dados de um status específico. 

- E. Cadastro de Título 

Esse serviço permite o cadastro de títulos. Para o cadastro de títulos é sempre necessário o cadastro de um status inicial. 

- F. Alteração de Título 

Esse serviço permite a alteração dos dados de um título. 

- G. Excluir Título 

Permite excluir o título informado. 

- H. Cadastro de Status 

Esse serviço permite o cadastro de status. 

- I. Alteração de Status 

Esse serviço permite a alteração de status. 

- O contrato WSDL para homologação pode ser visualizado em: https://hml3- wsoficio.onr.org.br/acompanhamentotitulos.asmx?wsdl 

## Métodos a serem referenciados: **ListTitulosAT;  ListStatusAT;  GetTituloAT;  GetStatusAT; InsertTituloAT;  UpdateTituloAT; DeleteTituloAT;  InsertStatusAT;  UpdateStatusAT** 

## **3.2.1 Envelope de Entrada - ListTitulosAT** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem –  tipostring(50); 

- MaxRowPerPage – Quantidade máxima de registros a serem retornados por página –  tipoint; 

- PageNumber – Página a ser retornada –  tipoint; 

- Protocolo – Protocolo a ser filtrado – opcional –  tipostring(11); 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

18 

- DataProtocoloInicio – Data inicial a ser filtrada, formato: aaaa-mm-dd – tipo string(10); 

- DataProtocoloFinal – Data final a ser filtrada, formato: aaaa-mm-dd – tipo string(10); 

- IDTipoStatus – Código do tipo de status a ser filtrado – tipo int. Valores possíveis: 

   - 1 = Título com reingresso 

   - 2 = Exame e cálculo cancelado 

   - 3 = Título pronto para retirada 

   - 4 = Título prenotado 

   - 5 = Exame e cálculo concluído 

   - 6 = Título registrado 

   - 7 = Nota de exigência 

   - 8 = Título entregue 

   - 9 = Suscitação de dúvida 

   - 10 = Dúvida julgada procedente 

   - 11 = Dúvida julgada improcedente 

   - 12 = Exame e cálculo protocolado 

   - 13 = Exame e cálculo pronto para a retirada 

   - 14 = Bloqueio de matrículas 

   - 15 = Prorrogado o prazo da prenotação 

   - 16 = Prorrogado o prazo de entrega e devolução 

   - 17 = Prorrogado o prazo da Penhora Online 

   - 18 = Notificação 

   - 19 = Prorrogado o prazo da Notificação 

   - 20 = Processamento 

   - 21 = Aguardando Pagamento 

   - -1 = Todos 

- Exportado – Filtra por pedidos exportados – tipo int. Valores possíveis: 

   - 0 = Não 

   - 1 = Sim 

   - -1 = Todos 

- Apresentante – Nome do apresentante a ser filtrado – opcional – tipo string(120). 

## **1.1.1 Envelope de Saída - ListTitulosAT** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método – tipo boolean; 

- CODIGOERRO – (se RETORNO = false) Código do erro – tipo int; 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro – tipo string(200); 

- QtdeRegistros – (se RETORNO = true)  Quantidade total de registros encontrados – tipo int; 

- QtdePaginas  – (se RETORNO = true)  Quantidade total de páginas, de acordo com o total de registros encontrados e com a quantidade máxima de registros por página que foi informada no envelope de entrada - MaxRowPerPage – tipo int; 

- Titulos - (se RETORNO = true) Array dos títulos encontrados, apresentando as seguintes informações: 

   - IDTitulo – Código do título – tipo int; 

   - Apresentante – Nome do apresentante – tipo string(120); 

   - Protocolo – Protocolo do título – tipo string(11); 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

19 

- DataUltimoStatus – Data do último status cadastrado, formato: aaaa-mm-ddhh:mm:ss – tipo string(10); 

- IDStatus – Código do cadastro de status – tipo int; 

- IDTipoStatus – Código do tipo de status – verificar tipos possíveis no item 3.2.1 – tipo int. 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|12|A quantidade de registros por página informada é<br>inválida. A quantidade mínima permitida é 10.|
|13|A página informada é inválida.|
|14|A data inicial não foi informada. Campo obrigatório.|
|15|A data final não foi informada. Campo obrigatório.|
|16|A data inicial informada é inválida.|
|17|A data final informada é inválida.|
|18|O código do tipo de status informado é inválido.|
|19|O valor informado para Exportado é inválido.|
|20|O protocolo informado é inválido. Informe apenas<br>números.|
|21|A página informada é inválida. Página máxima<br>possível: [PAGINA]|
|22|A data final deve ser maior que a data inicial.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|



## **3.2.2 Envelope de Entrada - GetTituloAT** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem – tipo string(50); 

- IDTitulo– Código do título – tipo int; 

## **3.2.3 Envelope de Saída - GetTituloAT** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método – tipo boolean; 

- CODIGOERRO – (se RETORNO = false) Código do erro – tipo int; 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro – tipo string(200); 

- IDCartorio – (se RETORNO = true)  Código do cartório – tipo int; 

- Protocolo  – (se RETORNO = true)  Protocolo do título – tipo string(11); 

- ValorDeposito  – (se RETORNO = true)  Valor do depósito – tipo decimal; 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

20 

- ValorEmolumentos – (se RETORNO = true)  Valor dos emolumentos – tipo decimal; 

- ApresentanteNome – (se RETORNO = true)  Nome do apresentante – tipo string(120); 

- ApresentanteCPFCNPJ – (se RETORNO = true)  CPF/CNPJ do apresentante – tipo string(14); 

- ApresentanteEmail – (se RETORNO = true)  E-mail do apresentante – tipo string(120); 

- ModoNotificacaoStatus – (se RETORNO = true)  Modo de notificação – tipo string(1). Se for retornado uma string vazia, nenhum modo de notificação foi informado.  Valores possíveis: `o` E = E-mail; 

   - S = SMS 

- ApresentanteDDDTelefone – (se RETORNO = true)  DDD do telefone do apresentante – tipo string(4); 

- ApresentanteNumeroTelefone – (se RETORNO = true)  Número do telefone do apresentante – tipo string(15); 

- DataProtocolo – (se RETORNO = true)  Data do protocolo, formato: aaaa-mm-ddhh:mm:ss – tipo string(19); 

- DataPrevisaoEntrega – (se RETORNO = true)  Data de previsão de entrega, formato: aaaa-mmddhh:mm:ss – tipo string(19); 

- NaturezaTitulo – (se RETORNO = true)  Natureza do título – tipo string(150); 

- InteressadoNome – (se RETORNO = true)  Nome do interessado – tipo string(120); 

- InteressadoCPFCNPJ – (se RETORNO = true)  CPF/CNPJ do interessado – tipo string(14); 

- CodigoVerificador – (se RETORNO = true)  Código verificador – tipo string(20); 

- TipoSolicitacao – (se RETORNO = true)  Tipo da solicitação – tipo int. Valores possíveis: `o` 0 ou 1 = Prenotação 

   - 2 = Exame e Cálculo 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|12|O IDTitulo informado é inválido.|
|30|Não foi possível pegar os dados do título.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|50|Usuário não tem permissão para acessar o título<br>informado.|



## **3.2.4 Envelope de Entrada - ListStatusAT** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem – tipo string(50); 

- MaxRowPerPage – Quantidade máxima de registros a serem retornados por página – tipo int; 

- PageNumber – Página a ser retornada – tipo int; 

- IDTitulo – Código do título dos status a serem retornados – tipo int; 

- DataStatusInicio – Data inicial a ser filtrada, formato: aaaa-mm-dd – opcional – tipo string(10); 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

21 

- DataStatusFinal – Data final a ser filtrada, formato: aaaa-mm-dd – opcional – tipo string(10); 

- IDTipoStatus – Código do tipo de status a ser filtrado - verificar tipos possíveis no item 3.2.1 – tipo int. 

## **3.2.5 Envelope de Saída - ListStatusAT** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método – tipo boolean; 

- CODIGOERRO – (se RETORNO = false) Código do erro – tipo int; 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro – tipo string(200); 

- QtdeRegistros – (se RETORNO = true) Quantidade total de registros encontrados – tipo int; 

- QtdePaginas  – (se RETORNO = true) Quantidade total de páginas, de acordo com o total de registros encontrados e com a quantidade máxima de registros por página que foi informada no envelope de entrada - MaxRowPerPage – tipo int; 

- IDTitulo – (se RETORNO = true) Código do título – tipo int; 

- IDCartorio – (se RETORNO = true) Código do cartório – tipo int; 

- Protocolo – (se RETORNO = true) Protocolo do título – tipo string(11); 

- ApresentanteNome – (se RETORNO = true) Nome do apresentante – tipo string(120); 

- Status - (se RETORNO = true) Array dos status encontrados, apresentando as seguintes informações: 

   - IDStatus – Código do status – tipo int; 

   - IDTipoStatus – Código do tipo de status – verificar tipos possíveis no item 3.2.1 – tipo int; 

   - DataStatus – Data do status, formato: aaaa-mm-ddhh:mm:ss – tipo string(19); 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|12|A quantidade de registros por página informada é<br>inválida. A quantidade mínima permitida é 10.|
|13|A página informada é inválida.|
|14|O código do título informado é inválido.|
|15|A data inicial informada é inválida.|
|16|A data final informada é inválida.|
|17|O código do tipo de status informado é inválido.|
|18|A data final deve ser maior que a data inicial.|
|25|A página informada é inválida. Página máxima<br>possível: [PAGINA]|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|50|Usuário não tem permissão para acessar a lista de<br>status do título informado.|



**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

22 

## **3.2.6 Envelope de Entrada - GetStatusAT** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem – tipo string(50); 

- IDStatus – Código do cadastro de status – tipo int; 

## **3.2.7 Envelope de Saída - GetStatusAT** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método – tipo boolean; 

- CODIGOERRO – (se RETORNO = false) Código do erro – tipo int; 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro – tipo string(200); 

- Protocolo – (se RETORNO = true)  Protocolo do título – tipo string(11); 

- ValorDeposito  – (se RETORNO = true)  Valor do depósito – tipo decimal; 

- ValorEmolumentos – (se RETORNO = true)  Valor dos emolumentos – tipo decimal; 

- ApresentanteNome – (se RETORNO = true)  Nome do apresentante – tipo string(120); 

- ApresentanteCPFCNPJ – (se RETORNO = true)  CPF/CNPJ do apresentante – tipo string(14); 

- ApresentanteEmail – (se RETORNO = true)  E-mail do apresentante – tipo string(120); 

- ModoNotificacaoStatus – (se RETORNO = true)  Modo de notificação – tipo string(1). Se for retornado uma string vazia, nenhum modo de notificação foi informado.  Valores possíveis: 

   - E = E-mail; 

   - S = SMS 

- ApresentanteDDDTelefone – (se RETORNO = true)  DDD do telefone do apresentante – tipo string(4); 

- ApresentanteNumeroTelefone – (se RETORNO = true)  Número do telefone do apresentante – tipo string(15); 

- DataProtocolo – (se RETORNO = true)  Data do protocolo, formato: aaaa-mm-ddhh:mm:ss – tipo string(19); 

- DataPrevisaoEntrega – (se RETORNO = true)  Data de previsão de entrega, formato: aaaa-mmddhh:mm:ss – tipo string(19); 

- IDTipoStatus – (se RETORNO = true)  Código do tipo de status – verificar tipos possíveis no item 3.2.1 – tipo int. 

- DataStatus – (se RETORNO = true)  Data do Status, formato: aaaa-mm-ddhh:mm:ss – tipo string(19); 

- DescricaoStatus – (se RETORNO = true) Descrição do Status – tipo text; 

- NaturezaTitulo – (se RETORNO = true)  Natureza do título – tipo string(150); 

- InteressadoNome – (se RETORNO = true)  Nome do interessado – tipo string(120); 

- InteressadoCPFCNPJ – (se RETORNO = true)  CPF/CNPJ do interessado – tipo string(14); 

- CodigoVerificador – (se RETORNO = true)  Código verificador – tipo string(20); 

- TipoSolicitacao – (se RETORNO = true)  Tipo da solicitação – tipo int. Valores possíveis: 

   - 0 ou 1 = Prenotação 

   - 2 = Exame e Cálculo 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

23 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|12|O IDStatus informado é inválido.|
|1|Não foi possível pegar os dados do título.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|50|Usuário não tem permissão para acessar o Status<br>informado.|



## **3.2.8 Envelope de Entrada - InsertTituloAT** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem – tipo string(50); 

- Protocolo – Protocolo do título – tipo string(11); 

- ApresentanteNome – Nome do apresentante – tipo string(120); 

- ApresentanteEmail – E-mail do apresentante – opcional (obrigatório se ModoNotificacaoStatus = E) – tipo string(120); 

- ApresentanteDDDTelefone – DDD do telefone do apresentante – opcional (obrigatório se ModoNotificacaoStatus = S) –  tipostring(4); 

- ApresentanteNumeroTelefone – Número do telefone do apresentante – opcional (obrigatório se ModoNotificacaoStatus = S) – tipo string(15); 

- ApresentanteCPFCNPJ – CPF/CNPJ do apresentante – opcional –  tipostring(14); 

- ValorDeposito  – Valor do depósito – opcional –  tipo decimal; 

- ValorEmolumentos – Valor dos emolumentos – opcional –  tipo decimal; 

- DataProtocolo – Data do protocolo. Formato: aaaa-mm-ddhh:mm:ss – tipo string(19); 

- DataPrevisaoEntrega – Data de previsão de entrega . Formato: aaaa-mm-ddhh:mm:ss – tipo string(19); 

- ModoNotificacaoStatus – Modo de notificação – tipo string(1). Valores permitidos: 

   - E = E-mail; 

   - S = SMS 

- InteressadoNome – Nome do interessado – tipo string(120); 

- InteressadoCPFCNPJ–  CPF/CNPJ do interessado – opcional –  tipostring(14); 

- NaturezaTitulo – Natureza do título – tipo string(150); 

- CodigoVerificador – Código verificador – opcional –  tipostring(20); 

- TipoSolicitacao – Tipo da solicitação – tipo int. Valores permitidos: 

   - 1 = Prenotação 

   - 2 = Exame e Cálculo 

Além dos dados do título é necessário informar um status inicial: 

- IDTipoStatus – Código do tipo de status – verificar tipos permitidos no item 3.2.1 – tipo int; 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

24 

- DataStatus – Data do Status. Formato: aaaa-mm-ddhh:mm:ss – tipo string(19); 

- DescricaoStatus – Descrição do Status (obs.: A nota de devolução deve ser informada nesse campo) – opcional –  tipotext. 

## **3.2.9 Envelope de Saída - InsertTituloAT** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método – tipo boolean; 

- CODIGOERRO – (se RETORNO = false) Código do erro – tipo int; 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro – tipo string(200); 

- IDTitulo – (se RETORNO = true)  Código do título cadastrado – tipo int; 

- IDStatus  – (se RETORNO = true)  Código do status cadastrado – tipo int. 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|12|O protocolo não foi informado.|
|13|Protocolo inválido. Apenas valores numéricos são<br>permitidos.|
|14|O nome do apresentante não foi informado.|
|15|O CPF/CNPJ do apresentante é inválido.|
|16|O nome do interessado não foi informado.|
|17|O CPF/CNPJ do interessado é inválido.|
|18|A natureza do título não foi informada.|
|19|O modo de notificação não foi informado.|
|20|O e-mail do apresentante não foi informado.|
|21|O telefone do apresentante não foi informado.|
|22|O código do tipo de status informado é inválido.|
|23|A data do protocolo não foi informada.|
|24|A data do protocolo é inválida.|
|25|A data do protocolo é inválida. Não pode ser anterior<br>a 01/01/2011.|
|26|A data de previsão de entrega não foi informada.|
|27|A data de previsão de entrega é inválida.|
|28|A data de previsão de entrega é inválida. Não pode<br>ser anterior a 01/01/2011.|
|29|A data do status não foi informada.|
|30|A data do status é inválida.|
|31|A data do status é inválida. Não pode ser anterior a<br>01/01/2011.|
|32|Apenas usuários de cartórios podem cadastrar títulos.|
|34|A data do status não pode ser menor que a data do<br>protocolo.|
|35|O tipo da solicitação informado é inválido.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|



**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

## 25 

|47|Hash inválido: Hash expirado.|
|---|---|
|101|Erro ao cadastrar o título|
|501|O protocolo informado já está cadastrado para este<br>cartório. Caso esteja correto, inclua um novo status.<br>[O código do título já cadastrado é retornado no<br>campo IDTitulo]|
|502|Não foi possível cadastrar o Título. O cartório não<br>possui CNS cadastrado no sistema do ONR.|



## **3.2.10 Envelope de Entrada - DeleteTituloAT** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem – tipo string(50); 

- IDTitulo – Código do cadastro do título – tipo int; 

## **3.2.11 Envelope de Saída - DeleteTituloAT** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método – tipo boolean; 

- CODIGOERRO – (se RETORNO = false) Código do erro – tipo int; 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro – tipo string(200); 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|12|O IDTitulo informado é inválido.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|30|Não foi possível pegar os dados do título.|
|50|Usuário não tem permissão para excluir o título<br>informado.|



## **3.2.12 Envelope de Entrada - InsertStatusAT** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem – tipo string(50); 

- IDTitulo – Código do título no Ofício Eletrônico. Código obtido no momento do cadastro do título, ver item 3.2.10 – tipo int; 

- IDTipoStatus – Código do tipo de status – verificar tipos permitidos no item 3.2.1 – tipo int; 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

26 

- DataStatus – Data do Status. Formato: aaaa-mm-ddhh:mm:ss – tipo string(19); 

- DescricaoStatus – Descrição do status (obs.: A nota de devolução deve ser informada nesse campo)  – tipo text. 

## **3.2.13 Envelope de Saída - InsertStatusAT** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método – tipo boolean; 

- CODIGOERRO – (se RETORNO = false) Código do erro – tipo int; 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro – tipo string(200); 

- IDStatus  – (se RETORNO = true)  Código do status cadastrado – tipo int. 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|12|O código do título informado é inválido.|
|13|O código do tipo de status informado é inválido.|
|14|A data do status não foi informada.|
|15|A data do status é inválida.|
|16|A data do status é inválida. Não pode ser anterior a<br>01/01/2011.|
|17|A descrição não foi informada.|
|30|Não foi possível pegar os dados do título.|
|31|Apenas usuários de cartórios podem cadastrar status.|
|32|O usuário não tem permissão para cadastrar status<br>para esse título.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|101|Erro ao cadastrar o status.|
|501|O status informado já está cadastrado para este<br>título. [O código do status já cadastrado é retornado<br>no campo IDStatus]|



## **3.2.14 Envelope de Entrada - UpdateTituloAT** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem – tipo string(50); 

- IDTitulo – Código do título no Ofício Eletrônico – tipo int. Código obtido no momento do cadastro do título, ver item 3.2.10; 

- Protocolo – Protocolo do título – tipo string(11); 

- ApresentanteNome – Nome do apresentante –  tipostring(120); 

- ApresentanteEmail – E-mail do apresentante –  opcional (obrigatório se ModoNotificacaoStatus = 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

27 

E) – tipo string(120); 

- ApresentanteDDDTelefone – DDD do telefone do apresentante – opcional (obrigatório se ModoNotificacaoStatus = S) –  tipostring(4); 

- ApresentanteNumeroTelefone – Número do telefone do apresentante –  opcional (obrigatório se ModoNotificacaoStatus = S) – tipo string(15); 

- ApresentanteCPFCNPJ – CPF/CNPJ do apresentante – opcional – tipo string(14); 

- ValorDeposito  – Valor do depósito – opcional – tipo decimal; 

- ValorEmolumentos – Valor dos emolumentos – opcional – tipo decimal; 

- DataProtocolo – Data do protocolo. Formato: aaaa-mm-ddhh:mm:ss – tipo string(19); 

- DataPrevisaoEntrega – Data de previsão de entrega . Formato: aaaa-mm-ddhh:mm:ss – tipo string(19); 

- ModoNotificacaoStatus – Modo de notificação – tipo string(1). Valores permitidos: 

   - E = E-mail; 

   - S = SMS 

- InteressadoNome – Nome do interessado – tipo string(120); 

- InteressadoCPFCNPJ–  CPF/CNPJ do interessado – opcional – tipo string(14); 

- NaturezaTitulo – Natureza do título – tipo string(150); 

- CodigoVerificador – Código verificador – opcional – tipo string(20); 

- TipoSolicitacao – Tipo da solicitação - tipo int. Valores permitidos: 

   - 1 = Prenotação 

   - 2 = Exame e Cálculo 

## **3.2.15 Envelope de Saída - UpdateTituloAT** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método – tipo boolean; 

- CODIGOERRO – (se RETORNO = false) Código do erro – tipo int; 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro – tipo string(200). 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|12|O código do título informado é inválido.|
|13|O nome do apresentante não foi informado.|
|14|O CPF/CNPJ do apresentante é inválido.|
|15|O nome do interessado não foi informado.|
|16|O CPF/CNPJ do interessado é inválido.|
|17|A natureza do título não foi informada.|
|18|O modo de notificação não foi informado.|
|19|O e-mail do apresentante não foi informado.|
|20|O telefone do apresentante não foi informado.|
|21|A data do protocolo não foi informada.|
|22|A data do protocolo é inválida.|
|23|A data do protocolo é inválida. Não pode ser anterior|



**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

## 28 

||a 01/01/2011.|
|---|---|
|24|A data de previsão de entrega não foi informada.|
|25|A data de previsão de entrega é inválida.|
|26|A data de previsão de entrega é inválida. Não pode<br>ser anterior a 01/01/2011.|
|27|O protocolo não foi informado.|
|28|Protocolo inválido. Apenas valores numéricos são<br>permitidos.|
|30|Não foi possível pegar os dados do título.|
|31|O tipo da solicitação informado é inválido.|
|32|O usuário não tem permissão para alterar os dados<br>do título.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|



## **3.2.16 Envelope de Entrada - UpdateStatusAT** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem – tipo string(50); 

- IDStatus – Código do status no Ofício Eletrônico – tipo int. Código obtido no momento do cadastro do status, ver item 3.2.10 ou 3.2.14; 

- IDTipoStatus – Código do tipo de status – verificar tipos permitidos no item 3.2.1 - tipo int; 

- DataStatus – Data do Status. Formato: aaaa-mm-ddhh:mm:ss – tipo string(19); 

- DescricaoStatus – Descrição do status – tipo text. 

## **3.2.17 Envelope de Saída - UpdateStatusAT** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método – tipo boolean; 

- CODIGOERRO – (se RETORNO = false) Código do erro – tipo int; 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro – tipo string(200). 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|12|O código do status informado é inválido.|
|13|O código do tipo do status informado é inválido.|
|14|A data do status não foi informada.|
|15|A data do status é inválida.|
|16|A data do status é inválida. Não pode ser anterior a<br>01/01/2011.|
|17|A descrição do status não foi informada.|



**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

## 29 

|30|Não foi possível pegar os dados do status.|
|---|---|
|32|O usuário não tem permissão para alterar os dados<br>do status.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|



## **3.2.18 Envelope de Entrada - ImportarArquivoAT** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem – tipo string(50); 

- URLArquivo - URL do arquivo. O cartório precisa informar uma URL válida para download do arquivo anexado. Os arquivos informados serão colocados em uma fila e serão baixados posteriormente pelo sistema. O pedido não será efetivamente respondido antes que todos os arquivos sejam baixados. (tipo string). 

## **3.2.19 Envelope de Saída - ImportarArquivoAT** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método – tipo boolean; 

- CODIGOERRO – (se RETORNO = false) Código do erro – tipo int; 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro – tipo string(200); 

Listagem de erros possíveis retornados no envelope de saída: 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

30
