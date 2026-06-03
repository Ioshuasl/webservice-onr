MANUAL - ASSINADOR WEB V 2.3

##### APRESENTAÇÃO


O Assinador Web ONR é uma ferramenta para os cartórios de Registro de Imóveis disponibilizarem os documentos dentro do padrão nacional de
documento eletrônico do ONR, com inclusão de carimbo de tempo, certificado de atributo, QRCode, marca d’água e hash de validação do documento,
na plataforma do ONR.


**2 |**


###### índice


|1.|Acesso ao site.................................................................................................................................................................................................................4|
|---|---|
|2.|Responder lote................................................................................................................................................................................................................6|
|3.|Respondendo Certidão Digital............................................................................................................................................................................11|
|4.|Respondendo ofício**.**.................................................................................................................................................................................................19|
|5.|Respondendo Penhora Online (SPH)............................................................................................................................................................28|
|6.|Respondendo Penhora Online (PH)**.**...............................................................................................................................................................37|
||6.1 Respondendo Penhora Online (PH) - Nota de Exigência**.**...................................................................................................................................................46|
|7.|Respondendo E-PROTOCOLO**.**..........................................................................................................................................................................55|
||7.1 Respondendo E-PROTOCOLO - Registro/Averbação............................................................................................................................................................64|
|8.|Respondendo Certidão - Balcão RI.................................................................................................................................................................74|
|9.|Respondendo Intimação/Consolidação - SEIC**.**...................................................................................................................................83|


MANUAL - ASSINADOR WEB V 2.3

##### 1. ACESSO AO SITE


Acesse o site **[https://ofcioeletronico.com.br/](https://oficioeletronico.com.br/)** e realize login com o uso do certificado digital clicando em “ **AUTENTICAR COM CERTIFICADO DIGITAL** ”.


**4 |**


MANUAL - ASSINADOR WEB V 2.3


Após reconhecer o certificado digital, informe sua senha _**PIN**_ .



**5 |**


MANUAL - ASSINADOR WEB V 2.3

##### 2. RESPONDER LOTE


Selecione o menu _**CARTÓRIOS**_ e clique em _**RESPONDER LOTE.**_



**6 |**


MANUAL - ASSINADOR WEB V 2.3


Nessa tela, é possível realizar filtros por meio de status ou período de resposta. Abaixo são apresentados os lotes já assinados pelo Cartório.


Clique em para acessar os detalhes do lote já assinado.



**7 |**


MANUAL - ASSINADOR WEB V 2.3


Ao acessar os detalhes do pedido, o sistema exibirá todas as informações.



**8 |**


MANUAL - ASSINADOR WEB V 2.3


**TIPO PEDIDO:** Mostra o serviço ao qual refere-se o arquivo assinado;


**PROTOCOLO:** É o protocolo do sistema que foi respondido;


**DATA SOLICITAÇÃO:** Data em que o pedido foi realizado;


**STATUS:** Status da assinatura;


**DATA PROCESSADO:** Quando o arquivo foi processado e o pedido respondido;


**HASH:** Hash do protocolo. Com ele, o solicitante conseguirá acessar o Registradores/SAEC e ter acesso ao documento assinado digitalmente;


**NOME ANEXO:** Nome do arquivo que foi realizado o upload;


**DOWNLOAD:** Faz o download individual de cada documento assinado.



**9 |**


MANUAL - ASSINADOR WEB V 2.3


Para que o Assinador WEB insira QR Code, hash de validação, marca d’água, carimbo de tempo, realize a assinatura e responda automaticamente o
pedido, é necessário que a nomenclatura do documento que for realizado o upload tenha o número do protocolo do sistema conforme indicado abaixo:






|SERVIÇO|DESCRIÇÃO|EXEMPLO PROTOCOLO|OBSERVAÇÃO|
|---|---|---|---|
|CERTIDÃO DIGITAL|Responder pedido de Certidão Digital|S20120000001D / S20120000001D-1234|quando houver mais que uma resposta no mesmo pedido, utilizar o protocolo com hífen e<br>o número da matrícula|
|OFÍCIO|Responder pedido de Ofício|2101000001 / 2101000001-1234|quando houver mais que uma resposta no mesmo pedido, utilizar o protocolo com hífen e<br>o número da matrícula|
|PENHORA ONLINE (SPH)|Responder pedido de busca/certidão de penhora|SPH21010000001D / SPH2101000000-1234|quando houver mais que uma resposta no mesmo pedido, utilizar o protocolo com hífen e<br>o número da matrícula|
|PENHORA ONLINE (PH)|Responder pedido de Penhora registrada|PH000007167||
|PENHORA ONLINE (PH)|Responder pedido de Penhora com Nota de Exigência|PH000007167N||
|E-PROTOCOLO|Responder pedido e-Protocolo registrado|AC000570464||
|E-PROTOCOLO|Responder pedido e-Protocolo com recibo/talão|AC000570464T||
|E-PROTOCOLO|Responder pedido e-Protocolo com XML|AC000570464X||
|E-PROTOCOLO|Responder pedido e-Protocolo com nota de exigência|AC000570464N||
|* BALCÃO RI|Pedido de balcão|matricula-1234||
|* BALCÃO RI|Pedido de balcão|certidao-1234||
|* BALCÃO RI|Pedido de balcão|talao-1234||
|* BALCÃO RI|Pedido de balcão|notaexig-1234||
|INTIMAÇÃO|Responder pedido com Nota de Exigência|IN00905472CN|Pode responder em qualquer status menos no EM ABERTO|
|INTIMAÇÃO|Responder pedido com Negativa de Pagamento|IN00905472CP|Pode responder somente no status INTIMADO|
|INTIMAÇÃO|Responder Arquivamento por desinteresse|IN00905472CD|Pode responder somento no status NEGATIVA DE PAGAMENTO e NOTA DE EXIGÊNCIA|
|INTIMAÇÃO|Responder Intimação em novo endereço|IN00905472CE|Pode responder somente no status EXPEDIÇÃO DE INTIMAÇÃO|
|INTIMAÇÃO|Responder Registro/Averbação|IN00905472CR / IN00905472CR-1234|Pode responder somente no status PAGAMENTO EFETUADO|
|INTIMAÇÃO|Responder Projeção Atualizada|IN00905472CA|Pode responder em qualquer status menos no EM ABERTO|



**Poderão também ser inseridos arquivos de pedidos tramitados no balcão do RI, com as nomenclaturas destacadas nas linhas verdes.**



**10 |**


MANUAL - ASSINADOR WEB V 2.3

##### 3. RESPONDENDO CERTIDÃO DIGITAL


É necessário que o status do pedido esteja: **EM ABERTO** ou **PROCESSANDO** . A nomenclatura do arquivo deve ser: **N° DO PROTOCOLO / N° DO**
**PROTOCOLO-1234** . Use o hífen quando for responder com mais de uma matrícula no mesmo protocolo.


Na tela inicial do Assinador WEB, realize o upload dos arquivos de **CERTIDÃO DIGITAL** que deseja assinar. Para inserir documentos, basta arrastar os


arquivos para dentro do quadro ou clicar na opção      para buscar o documento no computador.


**11 |**


MANUAL - ASSINADOR WEB V 2.3


Após o upload dos arquivos de pedidos de certidão, verifique que foram exibidas as mensagens “ **PRONTO PARA ASSINAR** ” e “ **ARQUIVO RECUSADO** ”
mostrando o motivo ao lado.


Ao lado, é exibido o status dos documentos adicionados, Para prosseguir, clique em .


**12 |**


MANUAL - ASSINADOR WEB V 2.3


Informe o PIN do certificado digital e clique em **OK** .



**13 |**


MANUAL - ASSINADOR WEB V 2.3


Os arquivos foram assinados. Para concluir, clique em .



**14 |**


MANUAL - ASSINADOR WEB V 2.3


O sistema irá redirecionar para a tela do Ofício Eletrônico e a mensagem **LOTE CADASTRADO COM SUCESSO** será exibida. O lote assinado ficará com

   - status **PROCESSANDO PEDIDOS** . O sistema realiza a atualização dos pedidos a cada 3 minutos.


**15 |**


MANUAL - ASSINADOR WEB V 2.3


Após os 3 minutos, o sistema atualiza o lote assinado para o status **CONCLUÍDO** . Veja que o sistema inclusive registrou o dia e horário da resposta e a
quantidade de arquivos assinados.


Clique em     para ver os protocolos assinados e respondidos.


**16 |**


MANUAL - ASSINADOR WEB V 2.3


Ao acessar os detalhes, o sistema apresentará todas as informações dos pedidos respondidos. É possível fazer o download individual de cada certidão


clicando na     ou fazer download de todas as certidões clicando em .


**17 |**


MANUAL - ASSINADOR WEB V 2.3


Ao clicar na   , a certidão assinada será exibida com o QR Code, marca d’água, hash de validação e o carimbo de tempo.



**18 |**


MANUAL - ASSINADOR WEB V 2.3

##### 4. RESPONDENDO OFÍCIO


É necessário que o status do pedido seja **EM ABERTO** . A nomenclatura do arquivo deve ser:


**N° DO PROTOCOLO**
**N° DO PROTOCOLO-1234**


Use o hífen quando for responder com mais de uma matrícula no mesmo protocolo.



**19 |**


MANUAL - ASSINADOR WEB V 2.3


Na tela inicial do Assinador WEB, realize o upload dos arquivos de **OFÍCIO** que deseja assinar. Para inserir documentos, basta arrastar os arquivos para


dentro do quadro ou clicar na opção     para buscar o documento no computador.


**20 |**


MANUAL - ASSINADOR WEB V 2.3


Após o upload dos arquivos, verifique que foram exibidas as mensagens “ **PRONTO PARA ASSINAR** ” e “ **ARQUIVO RECUSADO** ” mostrando o motivo ao
lado.


Ao lado, é exibido o status dos documentos adicionados. Para prosseguir, clique em .


**21 |**


MANUAL - ASSINADOR WEB V 2.3


Informe o PIN do certificado digital e clique em **OK** .



**22 |**


MANUAL - ASSINADOR WEB V 2.3


Os arquivos foram assinados. Para concluir, clique em .



**23 |**


MANUAL - ASSINADOR WEB V 2.3


O sistema irá redirecionar para a tela do Ofício Eletrônico e a mensagem **LOTE CADASTRADO COM SUCESSO** será exibida.


O lote assinado ficará com o status **PROCESSANDO PEDIDOS** . O sistema realiza a atualização dos pedidos a cada 3 minutos.



**24 |**


MANUAL - ASSINADOR WEB V 2.3


Após os 3 minutos, o sistema atualiza o lote assinado para o status **CONCLUÍDO** . Veja que o sistema inclusive registrou o dia e horário da resposta e a
quantidade de arquivos assinados.


Clique em     para ver os protocolos assinados e respondidos.


**25 |**


MANUAL - ASSINADOR WEB V 2.3


Ao acessar os detalhes, o sistema apresentará todas as informações dos pedidos respondidos. É possível fazer o download individual de cada ofício


clicando na      ou fazer download de todos os ofícios clicando em .


**26 |**


MANUAL - ASSINADOR WEB V 2.3


Ao clicar na   , a certidão assinada será exibida com o QR Code, marca d’água, hash de validação e o carimbo de tempo.



**27 |**


MANUAL - ASSINADOR WEB V 2.3

##### 5. RESPONDENDO PENHORA ONLINE (SPH)


É necessário que o status do pedido seja **EM ABERTO** ou **PROCESSANDO** . A nomenclatura do arquivo deve ser:


**N° DO PROTOCOLO**
**N° DO PROTOCOLO-1234**


Usar o hífen quando for responder com mais de uma matrícula no mesmo protocolo.



**28 |**


MANUAL - ASSINADOR WEB V 2.3


Na tela inicial do Assinador WEB, realize o upload dos arquivos de **PENHORA** **(apenas SPH)** que deseja assinar.


Para inserir documentos, basta arrastar os arquivos para dentro do quadro ou clicar na opção     para buscar o documento no computador.



**29 |**


MANUAL - ASSINADOR WEB V 2.3


Após o upload dos arquivos, verifique que foram exibidas as mensagens “ **PRONTO PARA ASSINAR** ” e “ **ARQUIVO RECUSADO** ” mostrando o motivo ao
lado.


**30 |**


MANUAL - ASSINADOR WEB V 2.3


Informe o PIN do certificado digital e clique em **OK** .



**31 |**


MANUAL - ASSINADOR WEB V 2.3


Os arquivos foram assinados. Para concluir, clique em             .



**32 |**


MANUAL - ASSINADOR WEB V 2.3


O sistema irá redirecionar para a tela do Ofício Eletrônico e a mensagem **LOTE CADASTRADO COM SUCESSO** será exibida. O lote assinado ficará com

   - status **PROCESSANDO PEDIDOS** . O sistema realiza a atualização dos pedidos a cada 3 minutos.


**33 |**


MANUAL - ASSINADOR WEB V 2.3


Após 3 minutos, o sistema atualiza o lote assinado para o status **CONCLUÍDO** . Veja que o sistema inclusive registrou o dia e horário da resposta e a


quantidade de arquivos assinados. Clique em      para ver os protocolos assinados e respondidos.


**34 |**


MANUAL - ASSINADOR WEB V 2.3


Ao acessar os detalhes, o sistema apresentará todas as informações dos pedidos respondidos. É possível fazer o download individual de cada certidão


clicando na     ou fazer download de todas as certidões clicando em .


**35 |**


MANUAL - ASSINADOR WEB V 2.3


Ao clicar na   , a certidão assinada será exibida com o QR Code, marca d’água, hash de validação e o carimbo de tempo.



**36 |**


MANUAL - ASSINADOR WEB V 2.3

##### 6. RESPONDENDO PENHORA ONLINE (PH)


Permitirá a resposta de **NOTA DE EXIGÊNCIA** ou **REGISTRO/AVERBAÇÃO** .


**Beneficiário de Justiça GRATUITA**
É necessário que o status do pedido seja: **PRENOTADO** ou **REABERTO NÃO CONCLUÍDO** .
A nomenclatura do arquivo deve ser: **N° DO PROTOCOLO** .


**Processo com PAGAMENTO DE REGISTRO**
É necessário que o status do pedido esteja: **PAGAMENTO EFETIVADO** .
A nomenclatura do arquivo deve ser: **N° DO PROTOCOLO** .



**37 |**


MANUAL - ASSINADOR WEB V 2.3


Na tela inicial do Assinador WEB, realize o upload dos arquivos de **PENHORA (PH)** que deseja assinar.


Para inserir documentos, basta arrastar os arquivos para dentro do quadro ou clicar na opção    para buscar o documento no computador.



**38 |**


MANUAL - ASSINADOR WEB V 2.3


Após o upload dos arquivos, verifique que foram exibidas as mensagens “ **PRONTO PARA ASSINAR** ” e “ **ARQUIVO RECUSADO** ” mostrando o motivo ao
lado.


Ao lado, é exibido o status dos documentos adicionados.


Para prosseguir clique em             .


**39 |**


MANUAL - ASSINADOR WEB V 2.3


Informe o PIN do certificado digital e clique em **OK** .



**40 |**


MANUAL - ASSINADOR WEB V 2.3


Os arquivos foram assinados. Para concluir, clique em            .



**41 |**


MANUAL - ASSINADOR WEB V 2.3


O sistema irá redirecionar para a tela do Ofício Eletrônico e a mensagem **LOTE CADASTRADO COM SUCESSO** será exibida.


O lote assinado ficará com o status **PROCESSANDO PEDIDOS** . O sistema realiza a atualização dos pedidos a cada 3 minutos.



**42 |**


MANUAL - ASSINADOR WEB V 2.3


Após os 3 minutos, o sistema atualiza o lote assinado para o status **CONCLUÍDO** . Veja que o sistema inclusive registrou o dia e horário da resposta e a


quantidade de arquivos assinados. Clique em     para ver os protocolos assinados e respondidos.


**43 |**


MANUAL - ASSINADOR WEB V 2.3


Ao acessar os detalhes, o sistema apresentará todas as informações dos pedidos respondidos. É possível fazer o download individual de cada certidão


clicando na     ou fazer download de todas as certidões clicando em .


**44 |**


MANUAL - ASSINADOR WEB V 2.3


Ao clicar na   , a certidão assinada será exibida com o QR Code, marca d’água, hash de validação e o carimbo de tempo.



**45 |**


MANUAL - ASSINADOR WEB V 2.3

##### 6.1 RESPONDENDO PENHORA ONLINE (PH) - NOTA DE EXIGÊNCIA


É necessário que o status do pedido esteja: **PRENOTADO** ou **REABERTO NÃO CONCLUÍDO** .


A nomenclatura do arquivo deverá ficar: **N° DO PROTOCOLON** .


O protocolo precisa conter a letra **N**   - de **NOTA**   - ao final do número do protocolo.



**46 |**


MANUAL - ASSINADOR WEB V 2.3


Na tela inicial do Assinador WEB, realize o upload dos arquivos de **PENHORA (PH)** que deseja assinar.


Para inserir documentos, basta arrastar os arquivos para dentro do quadro ou clicar na opção    para buscar o documento no computador.



**47 |**


MANUAL - ASSINADOR WEB V 2.3


Após o upload dos arquivos, verifique que foi exibida a mensagem “ **PRONTO PARA ASSINAR** ”.



**48 |**


MANUAL - ASSINADOR WEB V 2.3


Informe o PIN do certificado digital e clique em **OK** .



**49 |**


MANUAL - ASSINADOR WEB V 2.3


Os arquivos foram assinados. Para concluir, clique em .



**50 |**


MANUAL - ASSINADOR WEB V 2.3


O sistema irá redirecionar para a tela do Ofício Eletrônico e a mensagem **LOTE CADASTRADO COM SUCESSO** será exibida.


O lote assinado ficará com o status **PROCESSANDO PEDIDOS** . O sistema realiza a atualização dos pedidos a cada 3 minutos.



**51 |**


MANUAL - ASSINADOR WEB V 2.3


Após os 3 minutos, o sistema atualiza o lote assinado para o status **CONCLUÍDO** . Veja que o sistema inclusive registrou o dia e horário da resposta e a
quantidade de arquivos assinados.


Clique em     para ver os protocolos assinados e respondidos.


**52 |**


MANUAL - ASSINADOR WEB V 2.3


Ao acessar os detalhes, o sistema apresentará todas as informações dos pedidos respondidos. É possível fazer o download individual de cada certidão


clicando na     ou fazer download de todas as certidões clicando em .


**53 |**


MANUAL - ASSINADOR WEB V 2.3


Ao clicar na   , a certidão assinada será exibida com o QR Code, marca d’água, hash de validação e o carimbo de tempo.



**54 |**


MANUAL - ASSINADOR WEB V 2.3

##### 7. RESPONDENDO E-PROTOCOLO


Permitirá a resposta de **NOTA DE EXIGÊNCIA** ou **REGISTRO/AVERBAÇÃO** .


**RESPONDENDO COM NOTA DE EXIGÊNCIA**


Poderá responder com **NOTA DE EXIGÊNCIA**, pedidos que o status esteja: **PRENOTADO** ou **REABERTO**
**NÃO CONCLUÍDO** .


A nomenclatura do arquivo deverá ficar: **N° DO PROTOCOLON** .


O protocolo precisa conter a letra **N**   - de **NOTA**   - ao final do número do protocolo.



**55 |**


MANUAL - ASSINADOR WEB V 2.3


Na tela inicial do Assinador WEB, realize o upload dos arquivos de **E-PROTOCOLO** que deseja assinar.


Para inserir documentos, basta arrastar os arquivos para dentro do quadro ou clicar na opção      para buscar o documento no computador.



**56 |**


MANUAL - ASSINADOR WEB V 2.3


Após o upload dos arquivos, verifique que foi exibida a mensagem “ **PRONTO PARA ASSINAR** ”.


Ao lado, é exibido o status do documento adicionado.


Para prosseguir clique em          .



**57 |**


MANUAL - ASSINADOR WEB V 2.3


Informe o PIN do certificado digital e clique em **OK** .



**58 |**


MANUAL - ASSINADOR WEB V 2.3


Os arquivos foram assinados. Para concluir, clique em .



**59 |**


MANUAL - ASSINADOR WEB V 2.3


O sistema irá redirecionar para a tela do Ofício Eletrônico e a mensagem **LOTE CADASTRADO COM SUCESSO** será exibida.


O lote assinado ficará com o status **PROCESSANDO PEDIDOS** . O sistema realiza a atualização dos pedidos a cada 3 minutos.



**60 |**


MANUAL - ASSINADOR WEB V 2.3


Após os 3 minutos, o sistema atualiza o lote assinado para o status **CONCLUÍDO** . Veja que o sistema inclusive registrou o dia e horário da resposta e a
quantidade de arquivos assinados.


Clique em     para ver os protocolos assinados e respondidos.


**61 |**


MANUAL - ASSINADOR WEB V 2.3


Ao acessar os detalhes, o sistema apresentará todas as informações dos pedidos respondidos. É possível fazer o download individual de cada certidão


clicando na     ou fazer download de todas as certidões clicando em .


**62 |**


MANUAL - ASSINADOR WEB V 2.3


Ao clicar na   , a certidão assinada será exibida com o QR Code, marca d’água, hash de validação e o carimbo de tempo.



**63 |**


MANUAL - ASSINADOR WEB V 2.3

##### 7.1 RESPONDENDO E-PROTOCOLO - REGISTRO/AVERBAÇÃO


Permitirá a resposta de **NOTA DE EXIGÊNCIA** ou **REGISTRO/AVERBAÇÃO** .


**RESPONDENDO COM REGISTRO/AVERBAÇÃO**


Ao responder o pedido com **REGISTRO/AVERBAÇÃO**, poderá enviar junto a certidão talão/recibo.
Quando o pedido for **TÍTULO ESTRUTURADO**, deverá ser anexado também o XML da Certidão Estruturada.


Veja abaixo a nomenclatura que deverá conter os arquivos.


**RESPONDENDO COM REGISTRO/AVERBAÇÃO + CERTIDÃO TALÃO/RECIBO**


Para esta resposta, o pedido deverá estar com o status **PAGAMENTO EFETIVADO** .
Para isso, as nomenclaturas dos arquivos deverão ficar:


**N° DO PROTOCOLO**
**N° DO PROTOCOLOT**


**RESPONDENDO COM REGISTRO/AVERBAÇÃO + CERTIDÃO TALÃO/RECIBO + CERTIDÃO ESTRUTURADA XML**


Para esta resposta, o pedido deverá estar com o status **PAGAMENTO EFETIVADO** .
Para isso, as nomenclaturas dos arquivos deverão ficar:


**N° DO PROTOCOLO**
**N° DO PROTOCOLOT**
**N° DO PROTOCOLOX**



**64 |**


MANUAL - ASSINADOR WEB V 2.3


**TÍTULO DIGITAL – RESPONDENDO COM REGISTRO/AVERBAÇÃO**


**RESPONDENDO COM REGISTRO/AVERBAÇÃO + TALÃO/RECIBO**


Para esta resposta, o pedido deverá estar com o status: **PAGAMENTO EFETIVADO** .
As nomenclaturas dos arquivos deverão ficar:


**N° DO PROTOCOLO**
**N° DO PROTOCOLO-123**
**N° DO PROTOCOLOT**


Usar o hífen, quando for responder com mais de uma matrícula no mesmo protocolo AC.


Para enviar o **TALÃO/RECIBO**   - protocolo precisa conter a letra **T** ao final do número do protocolo.



**65 |**


MANUAL - ASSINADOR WEB V 2.3


Na tela inicial do Assinador WEB, realize o upload dos arquivos de **E-PROTOCOLO** que deseja assinar.


Para inserir documentos, basta arrastar os arquivos para dentro do quadro ou clicar na opção     para buscar o documento no computador.



**66 |**


MANUAL - ASSINADOR WEB V 2.3


Após o upload dos arquivos, verifique que foi exibida a mensagem “ **PRONTO PARA ASSINAR** ”.


Ao lado, é exibido o status do documento adicionado.


Para prosseguir clique em .



**67 |**


MANUAL - ASSINADOR WEB V 2.3


Informe o PIN do certificado digital e clique em **OK** .



**68 |**


MANUAL - ASSINADOR WEB V 2.3


Os arquivos foram assinados. Para concluir, clique em             .



**69 |**


MANUAL - ASSINADOR WEB V 2.3


O sistema irá redirecionar para a tela do Ofício Eletrônico e a mensagem **LOTE CADASTRADO COM SUCESSO** será exibida.


O lote assinado ficará com o status **PROCESSANDO PEDIDOS** . O sistema realiza a atualização dos pedidos a cada 3 minutos.



**70 |**


MANUAL - ASSINADOR WEB V 2.3


Após os 3 minutos, o sistema atualiza o lote assinado para o status CONCLUÍDO. Veja que o sistema inclusive registrou o dia e horário da resposta e a
quantidade de arquivos assinados.


Clique em     para ver os protocolos assinados e respondidos.


**71 |**


MANUAL - ASSINADOR WEB V 2.3


Ao acessar os detalhes, o sistema apresentará todas as informações dos pedidos respondidos. É possível fazer o download individual de cada certidão


clicando na     ou fazer download de todas as certidões clicando em .


**72 |**


MANUAL - ASSINADOR WEB V 2.3


Ao clicar na   , a certidão assinada será exibida com o QR Code, marca d’água, hash de validação e o carimbo de tempo.



**73 |**


MANUAL - ASSINADOR WEB V 2.3

##### 8. RESPONDENDO CERTIDÃO - BALCÃO RI


A nomenclatura dos arquivos deverá ficar com a palavra, hífen e número do documento/matrícula.


EXEMPLO:


**MINÚSCULO:** **MAIÚSCULO**

matricula-1234 MATRICULA-1234
certidao-1234 CERTIDAO-1234
talao-1234 TALAO-1234
notaexig-1234 NOTAEXIG-1234


O sistema não reconhecerá se houver acentuação ou se não houver a numeração após o hífen.



**74 |**


MANUAL - ASSINADOR WEB V 2.3


Na tela inicial do Assinador WEB, realize o upload dos arquivos de **CERTIDÃO BALCÃO-RI** que deseja assinar.


Para inserir documentos, basta arrastar os arquivos para dentro do quadro ou clicar na opção     para buscar o documento no computador.



**75 |**


MANUAL - ASSINADOR WEB V 2.3


Após o upload dos arquivos, verifique que foi exibida a mensagem “ **PRONTO PARA ASSINAR** ”.


Ao lado, é exibido o status do documento adicionado.


Para prosseguir clique em           .



**76 |**


MANUAL - ASSINADOR WEB V 2.3


Informe o PIN do certificado digital e clique em **OK** .



**77 |**


MANUAL - ASSINADOR WEB V 2.3


Os arquivos foram assinados. Para concluir, clique em .



**78 |**


MANUAL - ASSINADOR WEB V 2.3


O sistema irá redirecionar para a tela do Ofício Eletrônico e a mensagem **LOTE CADASTRADO COM SUCESSO** será exibida.


O lote assinado ficará com o status **PROCESSANDO PEDIDOS** . O sistema realiza a atualização dos pedidos a cada 3 minutos.



**79 |**


MANUAL - ASSINADOR WEB V 2.3


Após os 3 minutos, o sistema atualiza o lote assinado para o status **CONCLUÍDO** . Veja que o sistema inclusive registrou o dia e horário da resposta e a
quantidade de arquivos assinados.


Clique em     para ver os protocolos assinados e respondidos.


**80 |**


MANUAL - ASSINADOR WEB V 2.3


Ao acessar os detalhes, o sistema apresentará todas as informações dos pedidos respondidos. É possível fazer o download individual de cada certidão


clicando na     ou fazer download de todas as certidões clicando em .


**81 |**


MANUAL - ASSINADOR WEB V 2.3


Ao clicar na   , a certidão assinada será exibida com o QR Code, marca d’água, hash de validação e o carimbo de tempo.



**82 |**


MANUAL - ASSINADOR WEB V 2.3

##### 9. RESPONDENDO INTIMAÇÃO/CONSOLIDAÇÃO - SEIC:


Permitirá a resposta de **NOTA DE EXIGÊNCIA**, **NEGATIVA DE PAGAMENTO**, **ARQUIVAMENTO POR DESINTERESSE**, **INTIMAÇÃO EM NOVO ENDEREÇO**,
**REGISTRO/AVERBAÇÃO** e **PROJEÇÃO ATUALIZADA** .


**RESPONDENDO COM NOTA DE EXIGÊNCIA** :


Para esta resposta, o pedido deverá estar em qualquer status, menos no status **EM ABERTO** .
Para isso, as nomenclaturas dos arquivos deverão ficar: **N° DO PROTOCOLON**
O protocolo precisa conter a letra **N** ao final do protocolo.


**RESPONDENDO COM NEGATIVA DE PAGAMENTO:**


Para esta resposta, o pedido deverá estar no status **INTIMADO** .
Para isso, as nomenclaturas dos arquivos deverão ficar: **N° DO PROTOCOLOP**
O protocolo precisa conter a letra **P** ao final do protocolo.


**RESPONDENDO COM ARQUIVAMENTO POR DESINTERESSE:**


Para esta resposta, o pedido deverá estar nos status **NEGATIVA DE PAGAMENTO** e **NOTA DE EXIGÊNCIA** .
Para isso, as nomenclaturas dos arquivos deverão ficar: **N° DO PROTOCOLOD**
O protocolo precisa conter a letra **D** ao final do protocolo.


**RESPONDENDO COM INTIMAÇÃO EM NOVO ENDEREÇO:**


Para esta resposta, o pedido deverá estar no status **EXPEDIÇÃO DE INTIMAÇÃO** .
Para isso, as nomenclaturas dos arquivos deverão ficar: **N° DO PROTOCOLOE**
O protocolo precisa conter a letra **E** ao final do protocolo.


**83 |**


MANUAL - ASSINADOR WEB V 2.3


**RESPONDENDO COM REGISTRO/AVERBAÇÃO:**


Para esta resposta, o pedido deverá estar no status **PAGAMENTO EFETUADO** .
Para isso, as nomenclaturas dos arquivos deverão ficar: **N° DO PROTOCOLOR**
O protocolo precisa conter a letra **R** ao final do protocolo.


**RESPONDENDO COM PROJEÇÃO ATUALIZADA:**


Para esta resposta, o pedido deverá estar em qualquer status, menos no status **EM ABERTO** .
Para isso, as nomenclaturas dos arquivos deverão ficar: **N° DO PROTOCOLOA**
O protocolo precisa conter a letra **A** ao final do protocolo.



**84 |**


MANUAL - ASSINADOR WEB V 2.3


Na tela inicial do Assinador WEB, realize o upload dos arquivos de **INTIMAÇÃO/CONSOLIDAÇÃO - SEIC** que deseja assinar.



**85 |**


MANUAL - ASSINADOR WEB V 2.3


Após o upload dos arquivos, verifique que foi exibida a mensagem “ **PRONTO PARA ASSINAR** ”.



**86 |**


MANUAL - ASSINADOR WEB V 2.3


Informe o PIN do certificado digital e clique em **OK** .



**87 |**


MANUAL - ASSINADOR WEB V 2.3


Os arquivos foram assinados. Para concluir, clique em .



**88 |**


MANUAL - ASSINADOR WEB V 2.3


O sistema irá redirecionar para a tela do Ofício Eletrônico e a mensagem **LOTE CADASTRADO COM SUCESSO** será exibida.


O lote assinado ficará com o status **PROCESSANDO PEDIDOS** . O sistema realiza a atualização dos pedidos a cada 3 minutos.



**89 |**


MANUAL - ASSINADOR WEB V 2.3


Após os 3 minutos, o sistema atualiza o lote assinado para o status **CONCLUÍDO** . Veja que o sistema inclusive registrou o dia e horário da resposta e a
quantidade de arquivos assinados.


Clique em     para ver os protocolos assinados e respondidos.


**90 |**


MANUAL - ASSINADOR WEB V 2.3


Ao acessar os detalhes, o sistema apresentará todas as informações dos pedidos respondidos. É possível fazer o download individual de cada certidão


clicando na seta ( ) ou fazer download de todas as certidões clicando em .


**91 |**


MANUAL - ASSINADOR WEB V 2.3


Ao clicar na seta ( ), o arquivo assinado será exibido com o QR Code, marca d’água, hash de validação e o carimbo de tempo.



**92 |**


## **DÚVIDAS?**






#### (11) 3195-2299 oficioeletronico@onr.org.br (61) 2780-0800

**Q SCS Quadra 9, S/N, Bloco A, Sala 1104 – Asa Sul – CEP: 70308-200 – Brasília/DF**
**E-mail: oficioeletronico@onr.org.br - www.oficioeletronico.org.br**
