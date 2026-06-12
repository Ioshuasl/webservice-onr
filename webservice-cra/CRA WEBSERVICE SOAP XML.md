## WebService

Estimated reading: 3 minutes : 239 views

## Fluxo de Arquivos

A comunicacao para o protesto de titulos se baseia em um fluxo ordenado de arquivos XML, onde cada arquivo representa uma etapa especifica do processo, garantindo o registro e o acompanhamento de todas as acoes.

## Arquivo de Remessa

O convénio inicia o processo enviando o arquivo de Remessa. Este arquivo contém todos os dados dos titulos destinados a protesto, incluindo as informações do devedor e do credor. Sua funcao é formalizar a solicitacao de cobranca junto ao cartorio.

## Arquivo de Confirmacao

Em resposta, o cartorio envia o arquivo de Confirmacao. Ele valida o recebimento da Remessa, informa o número de protocolo atribuido a cada titulo e aponta eventuais devolucoes por irregularidades nos dados. A confirmacao garante ao convénio que os titulos deram entrada no sistema do cartorio para intimacao.

## Arquivo de Retorno

O cartorio envia o arquivo de Retorno. Este documento informa o resultado de cada titulo por meio de códigos de ocorréncia, indicando se foi pago, efetivamente protestado, retirado mediante solicitacao ou outras ocorréncias que podem se consultadas no Layout Febraban

## Arquivos de Desisténcia e Cancelamento

Além do fluxo padrao, o convénio pode intervir no processo por meio de arquivos especificos:

## Desisténcia: Acoes Realizadas ANTES do Protesto

A desisténcia tem como objetivo impedir que um titulo ja protocolado no cartorio seja protestado. A acao ocorre dentro do prazo legal de 3 dias uteis que o devedor tem para

pagamento.

## Pedido de Desistéencia

---

<!-- page 1 -->

## E uma solicitacao direta do credor para o cartorio. O credor ordena a retirada do titulo,

interrompendo o processo.

Cenarios comuns: O titulo foi enviado por engano; o devedor negociou ou quitou a divida

diretamente com o credor.

## Autorizacao de Desisténcia

E uma permissao concedida pelo credor. O credor autoriza o cartorio a aceitar o pagamento

ou a negociacao do devedor, caso ele compareca ao tabelionato para regularizar a situacao dentro do prazo.

## Cancelamento: Acoes Realizadas DEPOiS do Protesto

O cancelamento tem como objetivo reverter um protesto que ja foi lavrado, ou seja, ja existe um registro de inadimpléncia em nome do devedor.

## Pedido de Cancelamento

## E uma solicitacao direta do credor para o cartorio anular um protesto existente.

Cenario comum: O credor identifica que protestou um titulo indevidamente e precisa corrigir o erro ou o devedor quitou a divida diretamente com o credor.

## Autorizacao de Cancelamento

## E a Carta de Anuéncia Eletronica, o procedimento padrao para limpar um registro de

o devedor pode pagar as taxas no cartorio e solicitar o cancelamento definitivo do protesto.

O fluxo padrao de um titulo segue, portanto, a sequéncia: Remessa → Confirmacao → Retorno.

## Artigos

## Guia de Integracao via Webservice

Métodos e Parametros do Web Service

Estrutura de arquivos

Nomenclatura de Arquivos

Remessa

---

<!-- page 2 -->

## Confirmacao e Retorno

## Desisténcia

## Autorizacao de Cancelamento/Desisténcia

## Cancelamento

- Dados complementares do devedor

- Arquivo de andamento

- Imagens da remessa

## Oficio

## Download instrumento

- Envio de imagens

## Boletos de autorizacao

Consultas

## Respostas do Servico

Lista de mensagens

## Códigos de Ocorréencia

## Códigos de Irregularidades

- Exemplo em PHP

---

<!-- page 3 -->
