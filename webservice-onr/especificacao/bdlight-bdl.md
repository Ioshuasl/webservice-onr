# WSOficio — Banco de Dados Light (BDL)

> Extraído de [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) (seções 3.4 e Anexo 4.1).
> Serviço desativado em 31/07/2023 (Indicador Pessoal). Anexo 4.1 contém o modelo XML de importação.

---
**3.4 Envio e Controle de Arquivos – Banco de Dados Light** 

> **Desativação do webservice (Indicador Pessoal / BD Light)**  
> O envio do **Indicador Pessoal** (Banco de Dados Light) via WSOficio foi **desativado em 31/07/2023**.  
> As operações deste capítulo (`ListArquivosXMLBDL`, `GetArquivoXMLBDL`, `ImportarArquivoBDL`, `SetBDLightAtualizado`) não devem ser usadas em integrações ativas: o ambiente ONR responde com **CODIGOERRO 404** e a mensagem *«O envio do Indicador Pessoal via WS foi desativado em 31/07/2023.»*  
> O texto abaixo descreve o contrato **histórico** da especificação; para o estado atual do serviço, consultar a ONR.

O ONR disponibiliza o serviço de Envio e Controle de Arquivos – Banco de Dados Light através de web services contemplando as seguintes funcionalidades: 

## A. Listagem de Arquivos 

Retorna uma lista dos arquivos XML importados no sistema. 

## B. Obter Arquivo XML 

Obtém dados de um arquivo XML importado no sistema. 

- C. Importar Arquivo XML 

Permite importar um arquivo XML. O tamanho máximo permitido do arquivo para importação por 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

56 

meio desse serviço é de 5MB. 

- D. Definir como Atualizado 

Esse serviço permite definir o Banco de Dados Light como atualizado sem precisar enviar arquivo. 

- O contrato WSDL para homologação pode ser visualizado em: https://hml3- wsoficio.onr.org.br/bdlight.asmx?wsdl 

## Métodos a serem referenciados: **ListArquivosXMLBDL; GetArquivoXMLBDL; ImportarArquivoBDL; SetBDLightAtualizado** 

## **3.4.1 Envelope de Entrada - ListArquivosXMLBDL** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string); 

- MaxRowPerPage – Quantidade máxima de registros a serem retornados por página (tipo int); 

- PageNumber – Página a ser retornada (tipo int); 

- DataInicial – Data da importação inicial a ser filtrada, formato: aaaa-mm-dd (tipo string); 

- DataFinal – Data da importação final a ser filtrada, formato: aaaa-mm-dd (tipo string). 

## **3.4.2 Envelope de Saída - ListArquivosXMLBDL** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string); 

- QtdeRegistros – (se RETORNO = true)  Quantidade total de registros encontrados (tipo int); 

- QtdePaginas  – (se RETORNO = true)  Quantidade total de páginas, de acordo com o total de registros encontrados e com a quantidade máxima de registros por página que foi informada no envelope de entrada - MaxRowPerPage - (tipo int); 

- Arquivos - (se RETORNO = true) Array dos arquivos encontrados, apresentando as seguintes informações: 

   - IDArquivo – Código do arquivo (tipo int); 

   - IDStatus – Código do Status (tipo int).  Valores possíveis: 

      - 1 = Processando 

      - 2 = Importado 

      - 3 = Não Importado 

   - IDUsuario – Código do Usuário que realizou a importação (tipo int); 

   - Usuario – Nome do Usuário que realizou a importação (tipo string); 

   - DataImportacao – Data da importação, formato: aaaa-mm-ddhh:mm:ss (tipo string); 

   - QtdeRegistros – Quantidade de registros importados (tipo int); 

   - QtdeInvalidos – Quantidade de CPFs/CNPJs inválidos (tipo int). 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

57 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|12|A quantidade de registros por página informada é<br>inválida. A quantidade mínima permitida é 10.|
|13|A página informada é inválida.|
|14|A data de importação inicial não foi informada.|
|15|A data de importação final não foi informada.|
|16|A data de importação inicial é inválida.|
|17|A data de importação final é inválida.|
|18|O período da data de solicitação não pode ser maior<br>que 90 dias.|
|30|A página informada é inválida. Página máxima<br>possível: [PAGINA]|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|51|Não foi possível obter os arquivos.|



## **3.4.3 Envelope de Entrada - GetArquivoXMLBDL** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string); 

- IDArquivo – Código do arquivo (tipo int). 

## **3.4.4 Envelope de Saída - GetArquivoXMLBDL** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string); 

- IDStatus – (se RETORNO = true)  Código do status. Cf. status possíveis no item 3.4.2 (tipo int); 

- IDUsuario – (se RETORNO = true)  Código do usuário (tipo int); 

- DataImportacao – (se RETORNO = true)  Data da importação, formato: aaaa-mm-ddhh:mm:ss (tipo string); 

- QtdeRegistros – (se RETORNO = true)  Quantidade de registros importados (tipo int); 

- QtdeInvalidos – Quantidade de CPFs/CNPJs inválidos (tipo int); 

- URLArquivo – (se RETORNO = true)  URL para download do arquivo. Obs.: É possível que o arquivo nem sempre esteja disponível ou disponível apenas por um tempo (tipo string); 

- ErrosImportacao – (se RETORNO = true)  Erros da importação, caso tenha ocorrido erro (tipo 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

58 

string); 

- Invalidos – (se RETORNO = true) Array contendo informações dos registros inválidos, apresentando as seguintes informações: 

   - CPFCNPJ – CPF ou CNPJ inválido (tipo string); 

   - NomeRazao – Nome da pessoa (tipo string); 

   - NMatricula – Número da matrícula (tipo string). 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|12|O IDArquivo informado é inválido.|
|30|Não foi possível pegar os dados do arquivo.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|50|Usuário não tem permissão para acessar o arquivo<br>informado.|



## **3.4.5 Envelope de Entrada - ImportarArquivoBDL** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string); 

- Arquivos – Array dos arquivos a serem importados, apresentando as seguintes informações: 

   - URLArquivo – O cartório precisa informar uma URL válida para download do arquivo XML anexado. Os arquivos informados serão colocados em uma fila e serão baixados e processados posteriormente pelo sistema do Ofício Eletrônico. Cf. Anexo 1 para modelo do XML a ser usado. 

## **3.4.6 Envelope de Saída - ImportarArquivoBDL** 

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
|12|Nenhum arquivo foi informado.|



**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

## 59 

|45|Hash inválido.|
|---|---|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|50|Usuário não tem permissão para acessar o arquivo<br>informado.|
|60|Não foi possível desbloquear os arquivos.|
|101|Não foi possível cadastrar o arquivo.|
|102|Arquivo não encontrado: [URL]|
|103|Não foi possível verificar se o arquivo existe.|
|104|Extensão não permitida. Apenas arquivos .xml são<br>permitidos.|
|105|Aplicação inválida.|
|106|Não é permitido o envio de arquivos com mais de<br>5MB.|
|501|Campos obrigatórios não foram informados.|
|502|Já existe resposta para esse pedido. O status do<br>pedido será alterado assim que todos os arquivos<br>informados forem baixados pelo sistema do Ofício<br>Eletrônico.|



## **3.4.7 Envelope de Entrada - SetBDLightAtualizado** 

Os parâmetros de entrada são: 

- Hash – Hash para validação da mensagem (tipo string). 

## **3.4.8 Envelope de Saída - SetBDLightAtualizado** 

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
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|
|51|Não foi possível alterar o BDLight para atualizado.|
|502|Já existe resposta para esse pedido. O status do<br>pedido será alterado assim que todos os arquivos<br>informados forem baixados pelo sistema do Ofício<br>Eletrônico.|



**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

60 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

61

## **4 Anexos** 

## **4.1 Anexo 1 – Modelo de arquivo XML de importação do Banco Light** 

```
<?xmlversion="1.0"encoding="iso-8859-1"?>
<BANCOLIGHTxmlns:xsi="http://www.w3.org/2001/XMLSchema-
instance"xsi:noNamespaceSchemaLocation="https://registradores.onr.org.br/xsd/BDLIGHT_OPCAO1.xsd">
<INDIVIDUO>
<NOME><![CDATA[TESTEA1]]></NOME><!-- NOME DA PESSOA -->
<CNPJCPF>31413692834</CNPJCPF><!-- DOCUMENTO (CPF ou CNPJ) -->
<NMATRICULA>44421</NMATRICULA><!-- NÚMERO DA MATRÍCULA -->
<TIPODEATO>COMPRA</TIPODEATO><!-- ATO PRATICADO: COMPRA; VENDA; ETC -->
<DTREGAVERB>08022013</DTREGAVERB><!-- DATA DA COMPRA OU AVERBAÇÃO --
><DTVENDA>03042012</DTVENDA><!-- DATA DE VENDA -->
</INDIVIDUO>
<INDIVIDUO>
<NOME><![CDATA[TESTEA2]]></NOME><!-- NOME DA PESSOA -->
<CNPJCPF>39141942434</CNPJCPF><!-- DOCUMENTO (CPF ou CNPJ) -->
<NMATRICULA>44422</NMATRICULA><!-- NÚMERO DA MATRÍCULA -->
<TIPODEATO>COMPRA</TIPODEATO><!-- ATO PRATICADO: COMPRA; VENDA; ETC --
><DTREGAVERB>04042012</DTREGAVERB><!-- DATA DA COMPRA OU AVERBAÇÃO --
><DTVENDA>03042012</DTVENDA><!-- DATA DE VENDA -->
</INDIVIDUO>
<INDIVIDUO>
<NOME><![CDATA[TESTEAC]]></NOME>
<CNPJCPF>31889151106</CNPJCPF>
<NMATRICULA>44433</NMATRICULA>
<TIPODEATO>VENDA</TIPODEATO>
<DTREGAVERB>09022013</DTREGAVERB>
<DTVENDA></DTVENDA>
</INDIVIDUO>
<INDIVIDUO>
<NOME><![CDATA[INVÁLIDO]]></NOME><!-- NOME DA PESSOA -->
<CNPJCPF>39141942400</CNPJCPF><!-- DOCUMENTO (CPF ou CNPJ) -->
<NMATRICULA>44422</NMATRICULA><!-- NÚMERO DA MATRÍCULA -->
<TIPODEATO>COMPRA</TIPODEATO><!-- ATO PRATICADO: COMPRA; VENDA; ETC --
><DTREGAVERB>04042012</DTREGAVERB><!-- DATA DA COMPRA OU AVERBAÇÃO --
><DTVENDA>03042012</DTVENDA><!-- DATA DE VENDA -->
</INDIVIDUO>
</BANCOLIGHT>
```

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)**
