## Sumário 

|1|Definição e Escopo ................................................................................................................ 13|Definição e Escopo ................................................................................................................ 13|
|---|---|---|
|2|Requisitos de Segurança ....................................................................................................... 13||
|3|Definição e Regras de Serviços ............................................................................................. 13||
||3.1<br>Login .......................................................................................................................... 13||
||3.1.1|Envelope de Entrada - LoginUsuarioCertificado.............................................. 15|
||3.1.2|Envelope de Saída - LoginUsuarioCertificado ................................................. 16|
||3.2<br>Acompanhamento de Títulos ...................................................................................... 16||
||3.2.1|Envelope de Entrada - ListTitulosAT ............................................................... 17|
||1.1.1|Envelope de Saída - ListTitulosAT .................................................................. 18|
||3.2.2|Envelope de Entrada - GetTituloAT ................................................................ 19|
||3.2.3|Envelope de Saída - GetTituloAT ................................................................... 19|
||3.2.4|Envelope de Entrada - ListStatusAT ............................................................... 20|
||3.2.5|Envelope de Saída - ListStatusAT .................................................................. 21|
||3.2.6|Envelope de Entrada - GetStatusAT ............................................................... 22|
||3.2.7|Envelope de Saída - GetStatusAT .................................................................. 22|
||3.2.8|Envelope de Entrada - InsertTituloAT ............................................................. 23|
||3.2.9|Envelope de Saída - InsertTituloAT ................................................................ 24|
||3.2.10|Envelope de Entrada - DeleteTituloAT ............................................................ 25|
||3.2.11|Envelope de Saída - DeleteTituloAT ............................................................... 25|
||3.2.12|Envelope de Entrada - InsertStatusAT ............................................................ 25|
||3.2.13|Envelope de Saída - InsertStatusAT ............................................................... 26|
||3.2.14|Envelope de Entrada - UpdateTituloAT ........................................................... 26|
||3.2.15|Envelope de Saída - UpdateTituloAT .............................................................. 27|
||3.2.16|Envelope de Entrada - UpdateStatusAT ......................................................... 28|
||3.2.17|Envelope de Saída - UpdateStatusAT ............................................................ 28|
||3.2.18|Envelope de Entrada - ImportarArquivoAT ...................................................... 29|
||3.2.19|Envelope de Saída - ImportarArquivoAT ......................................................... 29|
||3.3<br>Penhora Online .......................................................................................................... 30||
||3.3.1|Envelope de Entrada - ListPedidosPO ............................................................ 31|
||3.3.2|Envelope de Saída - ListPedidosPO ............................................................... 32|
|**Especificação**||**de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)**|



## 9 

|3.3.3|Envelope de Entrada - ListVarasPO ............................................................... 33|
|---|---|
|3.3.4|Envelope de Saída - ListVarasPO .................................................................. 33|
|3.3.5|Envelope de Entrada - GetPedidoPO ............................................................. 34|
|3.3.6|Envelope de Saída - GetPedidoPO................................................................. 34|
|3.3.7|Envelope de Entrada - ListBoletosPO ............................................................. 35|
|3.3.8|Envelope de Saída - ListBoletosPO ................................................................ 36|
|3.3.9|Envelope de Entrada - SetBaixaBoletoPO ...................................................... 36|
|3.3.10|Envelope de Saída - SetBaixaBoletoPO ......................................................... 36|
|3.3.11|Envelope de Entrada - SetPrenotacaoPO ....................................................... 37|
|3.3.12|Envelope de Saída - SetPrenotacaoPO .......................................................... 37|
|3.3.13|Envelope de Entrada - SetCustasPO .............................................................. 38|
|3.3.14|Envelope de Saída - SetCustasPO ................................................................. 38|
|3.3.15|Envelope de Entrada - SetPenhoraAverbadoPO ............................................ 39|
|3.3.16|Envelope de Saída - SetPenhoraAverbadoPO ............................................... 39|
|3.3.17|Envelope de Entrada –  SetPenhoraAverbadoPO_DocID ............................... 40|
|3.3.18|Envelope de Saída –  SetPenhoraAverbadoPO_DocID .................................. 40|
|3.3.19|Envelope de Entrada - SetPenhoraExigenciaPO ............................................ 41|
|3.3.20|Envelope de Saída - SetPenhoraExigenciaPO ............................................... 41|
|3.3.21|Envelope de Entrada – SetPenhoraExigenciaPO_DocID ................................ 42|
|3.3.22|Envelope de Saída – SetPenhoraExigenciaPO_DocID ................................... 43|
|3.3.23|Envelope de Entrada - SetPedidoPessoaRespondidoPO ............................... 44|
|3.3.24|Envelope de Saída - SetPedidoPessoaRespondidoPO .................................. 44|
|3.3.25|Envelope de Entrada – SetPedidoPessoaRespondidoPO_DocID ................... 45|
|3.3.26|Envelope de Saída – SetPedidoPessoaRespondidoPO_DocID ...................... 45|
|3.3.27|Envelope de Entrada - SetPedidoPessoaDevolvidoPO ................................... 46|
|3.3.28|Envelope de Saída - SetPedidoPessoaDevolvidoPO ...................................... 46|
|3.3.29|Envelope de Entrada - SetPedidoMatriculaRespondidoPO ............................. 47|
|3.3.30|Envelope de Saída - SetPedidoMatriculaRespondidoPO ................................ 47|
|3.3.31|Envelope de Entrada – SetPedidoMatriculaRespondidoPO_DocID ................ 48|
|3.3.32|Envelope de Saída – SetPedidoMatriculaRespondidoPO_DocID ................... 48|
|Envelope de Entrada - SetPedidoMatriculaDevolvidoPO .............................................. 49||
|3.3.33|Envelope de Saída - SetPedidoMatriculaDevolvidoPO ................................... 49|
|3.3.34|Envelope de Entrada - SetPedidoNegativaLotePO ......................................... 50|
|3.3.35|Envelope de Saída - SetPedidoNegativaLotePO ............................................ 50|
|3.3.36|Envelope de Entrada – ListPedidosExportacaoPO ......................................... 51|
|3.3.37|Envelope de Saída – ListPedidosExportacaoPO ............................................ 51|
|3.3.38|Envelope de Entrada – SetPedidoFinalizarPrenotacaoVencida ...................... 54|
|3.3.39|Envelope de Saída – SetPedidoFinalizarPrenotacaoVencida ......................... 54|
|3.4<br>Envio e Controle de Arquivos – Banco de Dados Light ............................................... 55||
|3.4.1|Envelope de Entrada - ListArquivosXMLBDL .................................................. 56|
|3.4.2|Envelope de Saída - ListArquivosXMLBDL ..................................................... 56|
|3.4.3|Envelope de Entrada - GetArquivoXMLBDL ................................................... 57|
|3.4.4|Envelope de Saída - GetArquivoXMLBDL....................................................... 57|
|3.4.5|Envelope de Entrada - ImportarArquivoBDL ................................................... 58|
|3.4.6|Envelope de Saída - ImportarArquivoBDL ...................................................... 58|
|3.4.7|Envelope de Entrada - SetBDLightAtualizado ................................................. 59|
|3.4.8|Envelope de Saída - SetBDLightAtualizado .................................................... 59|
|3.5<br>Ofícios ........................................................................................................................ 61||
|3.5.1|Envelope de Entrada - ListInstituicoesOE ....................................................... 61|
|3.5.2|Envelope de Saída - ListInstituicoesOE .......................................................... 62|
|3.5.3|Envelope de Entrada - GetPedidoOE ............................................................. 62|
|3.5.4|Envelope de Saída - GetPedidoOE................................................................. 62|
|3.5.5|Envelope de Entrada - ListPedidosOE ............................................................ 64|
|3.5.6|Envelope de Saída - ListPedidosOE ............................................................... 65|



**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

## 10 

|3.5.7|Envelope de Entrada – ListPedidosOE_V2 ..................................................... 66|
|---|---|
|3.5.8|Envelope de Saída – ListPedidosOE_V2 ........................................................ 66|
|3.5.9|Envelope de Entrada - SetPedidoRespondidoOE ........................................... 67|
|3.5.10|Envelope de Saída - SetPedidoRespondidoOE .............................................. 68|
|3.5.11|Envelope de Entrada – SetPedidoRespondidoOE_DocID .............................. 69|
|3.5.12|Envelope de Saída – SetPedidoRespondidoOE_DocID .................................. 69|
|3.5.13|Envelope de Entrada - SetPedidoDevolvidoOE .............................................. 70|
|3.5.14|Envelope de Saída - SetPedidoDevolvidoOE ................................................. 70|
|3.5.15|Envelope de Entrada - SetPedidoNegativaLoteOE ......................................... 70|
|3.5.16|Envelope de Saída - SetPedidoNegativaLoteOE ............................................ 71|
|3.5.17|Envelope de Entrada - ListCartoriosRestransmitirOE...................................... 71|
|3.5.18|Envelope de Saída - ListCartoriosRestransmitirOE ......................................... 71|
|3.5.19|Envelope de Entrada - SetPedidoRetransmitidoOE ........................................ 72|
|3.5.20|Envelope de Saída - SetPedidoRetransmitidoOE ........................................... 72|
|3.6<br>Certidões a Emitir ....................................................................................................... 74||
|3.6.1|Envelope de Saída - ObterXMLSolicitacoes_v4 .............................................. 74|
|3.6.2|Envelope de Saída - ObterXMLSolicitacoes_v4 .............................................. 76|
|3.6.3|Envelope de Entrada - ObterXMLSolicitacoes_v5 ........................................... 77|
|3.6.4|Envelope de Saída - ObterXMLSolicitacoes_v5 .............................................. 79|
|3.6.5|Envelope de Entrada - ObterXMLSolicitacoes_v6 ........................................... 80|
|3.6.6|Envelope de Saída - ObterXMLSolicitacoes_v6 .............................................. 82|
|3.6.7|Envelope de Entrada - DevolverCertidao ........................................................ 82|
|3.6.8|Envelope de Saída - DevolverCertidao ........................................................... 82|
|3.6.9|Envelope de Entrada - EnviarAnexoCertidao .................................................. 83|
|3.6.10|Envelope de Saída - EnviarAnexoCertidao ..................................................... 83|
|3.6.11|Envelope de Entrada – EnviarAnexoCertidao_DocID ..................................... 83|
|3.6.12|Envelope de Saída – EnviarAnexoCertidao_DocID ........................................ 84|
|3.6.13|Envelope de Entrada - EnviarAnexosListCertidao_DocID ............................... 84|
|3.6.14|Envelope de Saída - EnviarAnexosListCertidao_DocID .................................. 84|
|3.6.15|Envelope de Entrada - FinalizarRespostaCertidao .......................................... 85|
|3.6.16|Envelope de Saída - FinalizarRespostaCertidao ............................................. 85|
|3.6.17|Envelope de Entrada - InformarCustasCertidao .............................................. 87|
|3.6.18|Envelope de Saída - InformarCustasCertidao ................................................. 87|
|3.6.19|Envelope de Entrada – EnviarAnexoCertidao_DocID_V2 ............................... 87|
|3.6.20|Envelope de Saída – EnviarAnexoCertidao_DocID_V2 .................................. 87|
|3.6.21|Envelope de Entrada - EnviarAnexosListCertidao_DocID_V2......................... 88|
|3.6.22|Envelope de Saída - EnviarAnexosListCertidao_DocID_V2 ............................ 88|
|3.7<br>Consulta CPF/CNPJ ................................................................................................... 89||
|3.8<br>Consutla Eletrônica / Rel. CE ..................................................................................... 89||
|3.9<br>Matrícula Online / Rel. VM .......................................................................................... 89||
|3.9.1|Envelope de Entrada - ObterXMLSolicitacoes ................................................ 90|
|3.9.2|Envelope de Saída - ObterXMLSolicitacoes ................................................... 90|
|3.9.3|Envelope de Entrada - ObterXMLSolicitacoesV2 ............................................ 91|
|3.9.4|Envelope de Saída - ObterXMLSolicitacoesV2 ............................................... 91|
|3.10<br>E-Protocolo ................................................................................................................ 93||
|3.10.1|Envelope de Entrada - GetExtratoXMLAC ...................................................... 95|
|3.10.2|Envelope de Saída - GetExtratoXMLAC ......................................................... 95|
|3.10.3|Envelope de Entrada - ListPedidosAC ............................................................ 95|
|3.10.4|Envelope de Saída - ListPedidosAC ............................................................... 96|
|3.10.5|Envelope de Entrada - ListAnexosAC ............................................................. 98|
|3.10.6|Envelope de Saída - ListAnexosAC ................................................................ 98|
|3.10.7|Envelope de Entrada - ListBoletosAC ............................................................. 99|
|3.10.8|Envelope de Saída - ListBoletosAC ................................................................ 99|
|3.10.9|Envelope de Entrada - SetBaixaBoletoAC .................................................... 100|



**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

## 11 

|3.10.10|Envelope de Saída - SetBaixaBoletoAC ................................................... 100|
|---|---|
|3.10.11|Envelope de Entrada – GetPedidoAC_V3 ................................................. 100|
|3.10.12|Envelope de Saída – GetPedidoAC_V3 .................................................... 100|
|3.10.13|Envelope de Entrada – GetPedidoAC_V4 ................................................. 103|
|3.10.14|Envelope de Saída – GetPedidoAC_V4 .................................................... 103|
|3.10.15|Envelope de Entrada – GetPedidoAC_V5 ................................................. 105|
|3.10.16|Envelope de Saída – GetPedidoAC_V5 .................................................... 105|
|3.10.17|Envelope de Entrada – GetPedidoAC_V6 ................................................. 108|
|3.10.18|Envelope de Saída – GetPedidoAC_V6 .................................................... 108|
|3.10.19|Envelope de Entrada – GetPedidoAC_V7 ................................................. 111|
|3.10.20|Envelope de Saída – GetPedidoAC_V7 .................................................... 111|
|3.10.21|Envelope de Entrada – GetPedidoAC_V8 ................................................. 114|
|3.10.22|Envelope de Saída – GetPedidoAC_V8 .................................................... 114|
|3.10.23|Envelope de Entrada - AlterarPedidoAC ................................................... 117|
|3.10.24|Envelope de Saída - AlterarPedidoAC ...................................................... 118|
|3.10.25|Envelope de Entrada - SetPrenotacaoAC ................................................. 118|
|3.10.26|Envelope de Saída - SetPrenotacaoAC .................................................... 118|
|3.10.27|Envelope de Entrada - SetProrrogarPrenotacaoAC .................................. 119|
|3.10.28|Envelope de Saída - SetProrrogarPrenotacaoAC ..................................... 119|
|3.10.29|Envelope de Entrada - SetCustasAC ........................................................ 120|
|3.10.30|Envelope de Saída - SetCustasAC ........................................................... 120|
|3.10.31|Envelope de Entrada - SetCustasComplementarAC ................................. 121|
|3.10.32|Envelope de Saída - SetCustasComplementarAC .................................... 121|
|3.10.33|Envelope de Entrada - SetPrenotacaoExameCalculoAC .......................... 121|
|3.10.34|Envelope de Saída - SetPrenotacaoExameCalculoAC ............................. 122|
|3.10.35|Envelope de Entrada - SetContratoAverbadoAC ...................................... 122|
|3.10.36|Envelope de Saída - SetContratoAverbadoAC .......................................... 124|
|3.10.37|Envelope de Entrada – SetContratoAverbadoAC_DocID .......................... 125|
|3.10.38|Envelope de Saída – SetContratoAverbadoAC_DocID ............................. 126|
|3.10.39|Envelope de Entrada - SetContratoExigenciaAC ...................................... 127|
|3.10.40|Envelope de Saída - SetContratoExigenciaAC ......................................... 127|
|3.10.41|Envelope de Entrada – SetContratoExigenciaAC_DocID .......................... 128|
|3.10.42|Envelope de Saída - SetContratoExigenciaAC_DocID .............................. 128|
|3.10.43|Envelope de Entrada - SetContratoDevolvidoAC ...................................... 129|
|3.10.44|Envelope de Saída - SetContratoDevolvidoAC ......................................... 129|
|3.10.45|Envelope de Entrada - ListDocumentosRepositorioAC ............................. 130|
|3.10.46|Envelope de Saída - ListDocumentosRepositorioAC ................................ 130|
|3.10.47|Envelope de Entrada - ContratoXMLtoPDF............................................... 131|
|3.10.48|Envelope de Saída - ContratoXMLtoPDF .................................................. 131|
|3.10.49|Envelope de Entrada - SetContratoCumprimentoExigenciaRI................... 131|
|3.10.50|Envelope de Saída - SetContratoCumprimentoExigenciaRI ...................... 131|
|3.10.51|Envelope de Entrada - SetFinalizarProtocoloAC ....................................... 132|
|3.10.52|Envelope de Saída - SetFinalizarProtocoloAC .......................................... 132|
|3.10.53|Envelope de entrada – ListCustasAC ........................................................ 133|
|3.10.54|Envelope de Saída – ListaCustasAC ........................................................ 133|
|3.10.55|Envelope de Entrada – SetBaixacustasAC ............................................... 133|
|3.10.56|Envelope de Saída – SetBaixaCustasAC .................................................. 133|
|3.11<br>Intimações .................................................................................................................134||
|3.11.1|Envelope de Entrada - ImportarPrenotacaoIN .............................................. 135|
|3.11.2|Envelope de Saída - ImportarPrenotacaoIN .................................................. 135|
|3.11.3|Envelope de Entrada - ListStatusIN .............................................................. 136|
|3.11.4|Envelope de Saída - ListStatusIN ................................................................. 136|
|3.11.5|Envelope de Entrada - ListPedidosIN ........................................................... 136|
|3.11.6|Envelope de Saída - ListPedidosIN............................................................... 137|



**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

## 12 

||3.11.7|Envelope de Entrada - ListMensagensPedidoIN ........................................... 137|
|---|---|---|
||3.11.8|Envelope de Saída - ListMensagensPedidoIN .............................................. 138|
||3.11.9|Envelope de Entrada – GetDetalhesIN_V2 ................................................... 139|
||3.11.10|Envelope de Saída – GetDetalhesIN_V2 .................................................. 139|
||3.11.11|Envelope de Entrada – GetDetalhesIN_V3 ............................................... 141|
||3.11.12|Envelope de Saída – GetDetalhesIN_V3 .................................................. 141|
||3.11.13|Envelope de Entrada - GetMensagemIN ................................................... 144|
||3.11.14|Envelope de Saída - GetMensagemIN ...................................................... 144|
||3.11.15|Envelope de Entrada - GetEmolumentosIN............................................... 145|
||3.11.16|Envelope de Saída - GetEmolumentosIN .................................................. 145|
||3.11.17|Envelope de Entrada - AdicionarEmolumentoIN ....................................... 151|
||3.11.18|Envelope de Saída - AdicionarEmolumentoIN .......................................... 151|
||3.11.19|Envelope de Entrada - ExcluirEmolumentoIN ........................................... 152|
||3.11.20|Envelope de Saída - ExcluirEmolumentoIN............................................... 152|
||3.11.21|Envelope de Entrada – ListPagamentosIN ................................................ 152|
||3.11.22|Envelope de Saída - ListPagamentosIN .................................................... 153|
||3.12<br>Comunicação Prefeituras ..........................................................................................154||
||3.12.1<br>Importação Arquivos ..............................................................................................154||
||3.12.1.1|Envelope de Entrada – ImportacaoArquivos ............................................. 154|
||3.12.1.2|Envelope de Saída - ImportacaoArquivos ................................................. 154|
||3.12.2<br>Atualizar status processo .......................................................................................155||
||3.12.2.1|Envelope de Entrada – AtualizarStatusProcesso ...................................... 155|
||3.12.2.2|Envelope de Saída - AtualizarStatusProcesso .......................................... 155|
|4|Anexos ................................................................................................................................ 156||
||4.1<br>Anexo 1 – Modelo de arquivo XML de importação do Banco Light ............................156||



**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

13 

**==> picture [176 x 137] intentionally omitted <==**

## **1 Definição e Escopo** 

O presente documento visa descrever e especificar os parâmetros de entrada e saída necessários para que sejam desenvolvidos internamente pelos parceiros do ONR – Operador Nacional do Sistema de Registro Eletrônico de imóveis – módulos de aplicação que ofereçam comunicação e integração com os diversos serviços oferecidos pela SAEC. 

A proposta contempla comunicação via Web Services, desta maneira serão detalhados neste documento os requisitos de segurança, bem como os dados componentes dos envelopes de entrada e retorno. 

## **2 Requisitos de Segurança** 

O modelo de segurança consiste em validação de hash entre as mensagens. Além disso, como acréscimo de segurança, o acesso aos serviços do ONR está restrito por IP. 

Um hash de autenticação é formado pela combinação da chave + token. O hash é então codificado no padrão SHA-1, codificação UTF-8. 

A chave é uma string única que é de conhecimento somente do ONR e da instituição. Essa chave não é transmitida entre as mensagens.  Para obter a chave única referente à sua instituição entre em contato com o ONR através do e-mail: oficioeletronico@onr.org. 

O token é uma string dinâmica criada para, em conjunto com a chave, gerar o hash de autenticação. Dessa forma o hash usado em cada mensagem será diferente e poderá ser usado apenas uma vez. Caso a mensagem seja interceptada, o mesmo hash não poderá ser reaproveitado impedindo assim o uso indevido da aplicação. 

Esse modelo de autenticação é de gerenciamento simples e seguro, pois o token é gerado no momento da requisição, além da chave que precisa ser de conhecimento para cada entidade envolvida. 

## **3 Definição e Regras de Serviços** 

## **3.1 Login** 

Todos os serviços disponibilizados pelo ONR através de Web Services utilizam um sistema de validação por hash. Um hash válido é gerado através da combinação de uma chave + token (Para mais informações consulte o capítulo 2). O token necessário para gerar o hash é obtido através da validação de usuário, utilizando um serviço de “Login”. 

O Web Service de Login tem o único propósito de retornar os tokens a serem utilizados para gerar o hash necessário para a troca das mensagens. Os tokens são apenas retornados após validação das credenciais de um usuário válido, previamente cadastrado no sistema OFÍCIO ELETRÔNICO. O serviço pode retornar vários tokens em uma única requisição, isso para que não seja 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

14 

necessário uma nova requisição de token sempre que for executado outro serviço. A quantidade padrão de tokens retornados pelo serviço em uma única requisição é 5, porém esse valor pode ser alterado. 

Os tokens são strings dinâmicas, formadas por 6 caracteres. Ex.: 

JGX3QL LGO8A7 XUWR08 AG5K3U 1MLG7B 

Cada token poderá ser usado apenas uma vez. Depois de usado o sistema não permitirá que o mesmo token seja reutilizado. Além disso cada token tem uma validade de 8 horas a partir de sua geração. 

Segue diagrama que contempla uma visão geral referente à utilização dos serviços oferecidos pelo ONR através de Web Services: 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

15 

**==> picture [525 x 428] intentionally omitted <==**

- O contrato WSDL para homologação pode ser visualizado em:  https://hml3- wsoficio.onr.org.br/login.asmx?wsdl 

Métodos a serem referenciados: **LoginUsuarioCertificado** 

## **3.1.1 Envelope de Entrada - LoginUsuarioCertificado** 

Os parâmetros de entrada são: 

- SUBJECTCN – Valor SUBJECTCN do certificado do usuário (tipo string(100)); 

- ISSUERO – Valor ISSUERO do certificado do usuário (tipo string(10)); 

- PUBLICKEY – Valor PUBLICKEY do certificado do usuário (tipo string(1000)); 

- SERIALNUMBER – Valor SERIALNUMBER do certificado do usuário (tipo string(100)); 

- VALIDUNTIL – Valor VALIDUNTIL do certificado do usuário (tipo string); 

- CPF – CPF do usuário (tipo string(11)); 

- EMAIL – E-mail do usuário (tipo string(100)); 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

16 

- IDParceiroWS – Código do parceiro para utilização do sistema de Web Services (tipo int). Esse código deve ser solicitado previamente à ao ONR, assim como a chave para geração de hash. 

## **3.1.2 Envelope de Saída - LoginUsuarioCertificado** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string(200)); 

- IDUsuario – (se RETORNO = true)  Código do usuário no Ofício Eletrônico (tipo int); 

- IDInstituicao – (se RETORNO = true)  Código da Instituição/Cartório no Ofício Eletrônico (tipo int); 

- Ativo – (se retorno = true) Indica se cliente está ativo ou não (tipo boolean); 

- Tokens – (se retorno = true) Tokens gerados (array de strings(6)). 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|1|Não foi possível gerar os tokens.|
|2|Request inválido.|
|10|O SUBJECTCN não foi informado.|
|11|O ISSUERO não foi informado.|
|12|O PUBLICKEY não foi informado.|
|13|O SERIALNUMBER não foi informado.|
|14|O VALIDUNTIL não foi informado.|
|15|O CPF não foi informado.|
|16|O EMAIL não foi informado.|
|17|O IDParceiroWS informado é inválido.|
|51|Usuário não encontrado.|
|52|O departamento ou instituição do usuário não estão<br>ativados.|
|53|Usuário não está ativo.|



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



## **3.7 Consulta CPF/CNPJ** 

## -- EM DESENVOLVIMENTO – 

## **3.8 Consutla Eletrônica / Rel. CE** 

## -- EM DESENVOLVIMENTO – 

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



## **3.12 Comunicação Prefeituras** 

Integração via WSOficio para envio seguro de arquivos de declarações do CTP entre o sistema do Cartório e a API do CTP, utilizando URL assinada de upload, validação por CNS, controle de processo/status, logs de integração e exibição das informações no módulo OE → Cartórios → CTP. 

- O contrato WSDL para homologação pode ser visualizado em: https://hml3- wsoficio.onr.org.br/ComunicacaoMunicipios.asmx?wsdl 

## **3.12.1 Importação Arquivos** 

## **3.12.1.1 Envelope de Entrada – ImportacaoArquivos** 

Os parâmetros de entrada são: 

- Hash – Hash para validação (tipo string(50)); 

- Formato (1-json, 2-txt, 3-dec e 4-zip) (tipo int); 

- NomeOriginalArquivo– (tipo string); 

- UrlCallback - (tipo string); 

## **3.12.1.2 Envelope de Saída - ImportacaoArquivos** 

Os parâmetros de saída são: 

- IdProcesso 

- UrlParaUpload 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string(200)). 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

155 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|
|11|O Hash de validação não foi informado.|
|12|Formato de arquivo inválido.|
|13|Nome do arquivo não informado.|
|14|Arquivo sem extensão.|
|15|Extensão inválida.|
|45|Hash inválido.|
|46|Hash inválido: Hash já utilizado.|
|47|Hash inválido: Hash expirado.|



## **3.12.2 Atualizar status processo** 

## **3.12.2.1 Envelope de Entrada – AtualizarStatusProcesso** 

Os parâmetros de entrada são: 

- IdProcesso – ID do processo (tipo string(50)); 

## **3.12.2.2 Envelope de Saída - AtualizarStatusProcesso** 

Os parâmetros de saída são: 

- IdStatus 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string(200)). 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|10|Request inválido.|



**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

156 

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
