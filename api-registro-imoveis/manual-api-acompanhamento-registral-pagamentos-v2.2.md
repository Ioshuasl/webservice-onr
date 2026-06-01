### ​ ​ ​ ​ ​ ​ ​


# Manual de integração da API do Acompanhamento Registral do Registro de Imóveis do Brasil

V.2.2
10 de dezembro de 2025


www.registrodeimoveis.org.br


## Histórico de Versões

|Versão|Data|Responsável|Alteração|
|---|---|---|---|
|1.0|19/07/2023|Equipe Técnica CORI-BR|Criação do Documento|
|1.1|10/08/2023|Equipe Técnica CORI-BR|Criação da Tabela de Domínio|
|1.2|24/07/2024|Equipe Técnica CORI-BR|No campo na cobrança<br>-​<br>tipoPagamento<br>Nova API para retornar os tipos<br>de pagamentos|
|1.3|30/08/2024|Equipe Técnica CORI-BR|Atualização campo<br>tipoPagamento|
|1.4|29/01/2025|Equipe Técnica CORI-BR|Novo campo<br>pagamentoVinculado na<br>consulta de pagamentos​<br>Nova API para devolução de<br>valores pagos no PIX|
|1.5|14/04/2025|Equipe Técnica CORI-BR|Nova API V2 de consulta dos<br>protocolos.​<br>Alterações dos campos<br>obrigatórios do envio de<br>protocolos.|
|1.6|15/05/2025|Equipe Técnica CORI-BR|Atualização da descrição do<br>campo código localizador.|
|1.7|28/05/2025|Equipe Técnica CORI-BR|Atualização do retorno da<br>geração de cobrança.|
|1.8|16/06/2025|Equipe Técnica CORI-BR|Novo campo para definição do<br>tipo da descrição da situação.|
|1.9|04/07/2025|Equipe Técnica CORI-BR|Nova API para atualização do<br>protocolo vinculado ao<br>pagamento.|
|2.0|14/07/2025|Equipe Técnica CORI-BR|Nova API para visualização das<br>respostas de exigência e para<br>responder uma exigência.|
|2.1|08/08/2025|Equipe Técnica CORI-BR|Novo campo para códigos<br>secundários ao protocolo.|
|2.2|10/12/205|Equipe Técnica CORI-BR|Novo campo da data da última<br>atualização do sistema.​<br>Novas situações do<br>acompanhamento registral|



www.registrodeimoveis.org.br


### Sumário

|Objetivo​|5|
|---|---|
|**Funcionalidades​**|**6 **|
|**Endereços da API​**|**7 **|
|**Endereço do Swagger​**|**8 **|
|**Descrição das Funcionalidades - Gerais​**|**9 **|
|[RFG-01] - Autenticação​|9|
|**Descrição das Funcionalidades - Acompanhamento Registral​**|**11 **|
|[RFP-01] - Envio do protocolo online​|11|
|[RFP-02] - Envio de protocolo em lote​|17|
|[RFP-03] - Geração de cobrança automatizada no protocolo​|27|
|[RFP-04] - Exclusão de protocolo​|37|
|[RFP-05] - Listagem dos protocolos integrados​|38|
|[RFP-06] - Detalhamento do protocolo - V1​|41|
|[RFP-07] - Detalhamento do protocolo - V2​|51|
|**Fluxo das Funcionalidades - Acompanhamento Registral​**|**63 **|
|[FFP-01] - Fluxo do envio do protocolo​|63|
|[FFP-02] - Fluxo de processamento do protocolo​|64|
|**Descrição das Funcionalidades - Cobrança​**|**65 **|
|[RFC-01] - Geração de cobrança​|65|
|[RFC-02] - Listagem das cobranças​|69|
|[RFC-03] - Detalhes da cobrança​|71|
|[RFC-04] - Cancelamento da cobrança​|78|
|[RFC-05] - Listagem dos tipos de pagamentos​|79|
|[RFC-06] - Devolução de valores pagos no PIX​|81|
|[RFC-07] - Atualização do protocolo vinculado ao pagamento​|83|
|**Descrição das Funcionalidades - Atendimento Eletrônico​**|**85 **|
|[RAE-01] - Listagem da resposta de exigência​|85|
|[RAE-02] - Detalhes da resposta de exigência​|87|
|[RAE-03] - Cadastramento de interação​|90|
|**Tabelas de Domínio​**|**93 **|
|[TBD-01] - StatusCobranca​|93|
|[TBD-02] - ACTipoSolicitacao​|93|
|[TBD-03] - ACCodigoStatus​|93|
|[TBD-04] - ACFilaSituacao​|95|
|[TBD-05] - StatusTipoPagamento​|95|
|[TBD-06] - ACTipoDescricao​|95|
|[TBD-07] - AETipoAtendimento​|96|
|[TBD-08] - AESituacao​|96|
|[TBD-09] - AEAtendimentoPrioritario​|97|
|[TBD-10] - AEFormaAtendimento​|98|
|[TBD-11] - AETipoContato​|98|



www.registrodeimoveis.org.br


[TBD-12] - AEOrigem​ 98

[TBD-13] - AEAcao​ 99

[TBD-14] - AEExtensoesArquivos​ 99


www.registrodeimoveis.org.br


### Objetivo

Esta documentação visa orientar as empresas desenvolvedoras de sistemas
para cartórios a realizar a integração com os serviços disponibilizados pelo Registro
de Imóveis do Brasil.


Neste documento, você encontrará informações abrangentes sobre as
funcionalidades disponibilizadas e formatos de dados.


Ao seguir as diretrizes fornecidas neste documento, as empresas
desenvolvedoras de sistemas poderão garantir a interoperabilidade dos seus
sistemas com o Registro de Imóveis do Brasil. Isso permitirá a troca de dados de
forma segura e confiável.


Recomendamos que as empresas desenvolvedoras de sistemas para
cartórios utilizem esta documentação como um guia completo para realizar a
integração com os serviços do Registro de Imóveis do Brasil. Com isso, poderão
proporcionar aos usuários uma experiência mais eficiente e moderna no acesso às
informações relacionadas a imóveis, contribuindo assim para o aprimoramento do
setor imobiliário todo.


www.registrodeimoveis.org.br


### Funcionalidades

As APIs disponibilizadas para o cartório realizar a integração automatizada
dos dados de registros.


As funcionalidades disponíveis para a integração são:

|#|Referência|Descrição|
|---|---|---|
|1|[RFG-01]|Autenticação|
|2|[RFP-01]|Envio de acompanhamento registral em formato online|
|3|[RFP-02]|Envio de acompanhamento registral em formato de lote com processamento|
|4|[RFP-03]|Geração de cobrança automatizada para o acompanhamento|
|5|[RFP-04]|Exclusão do acompanhamento registral|
|6|[RFP-05]|Listagem dos registros integrados do cartório|
|7|[RFP-06]|Detalhamento dos registros integrados do cartório|
|8|[RFC-01]|Geração de cobrança|
|9|[RFC-02]|Listagem das cobranças|
|10|[RFC-03]|Detalhes da cobrança|
|11|[RFC-04]|Cancelamento da cobrança|
|12|[RFC-05]|Listagem dos tipos de pagamentos|
|13|[RFC-06]|Atualização do protocolo vinculado ao pagamento|
|14|[RAE-01]|Listagem da resposta de exigência|
|15|[RAE-02]|Detalhes da resposta de exigência|
|16|[RAE-03]|Cadastramento de interação|



www.registrodeimoveis.org.br


### Endereços da API

Abaixo encontram-se os endereços disponibilizados as APIs.


●​ Produção: [https://api.registrodeimoveis.org.br](https://api.registrodeimoveis.org.br)
●​ [Homologação: https://testes-api.registrodeimoveis.org.br](https://testes-api.registrodeimoveis.org.br)


www.registrodeimoveis.org.br


### Endereço do Swagger

Abaixo encontram-se os endereços disponíveis do Swagger.


●​ [https://www.registrodeimoveis.org.br/swagger/index.html](https://www.registrodeimoveis.org.br/swagger/index.html)


www.registrodeimoveis.org.br


### Descrição das Funcionalidades - Gerais


[RFG-01] - Autenticação


Ao tentar utilizar os serviços disponíveis, se faz necessário realizar o
processo de autenticação. A função de autenticação deverá receber os valores via
POST, no qual será realizada a validação dos dados e retorna com o token JWT
quando bem sucedido.


API da funcionalidade:

|Método|Endpoint|Descrição|
|---|---|---|
|POST|/v1/auth/token|API para geração do token de autenticação.|
|<br>GET|<br>/v1/auth/validacao|<br>API para validação do token de autenticação.|



POST /v1/auth/token​
Campos do body da API:






|Campo|Tipo|Obrigatório|Descrição|
|---|---|---|---|
|client_id|String|Sim|Código do cliente.|
|<br>client_secret|<br>String|<br>Sim|<br>Chave secreta do cliente.|
|grant_type|String|Sim|Tipo da autenticação.​<br>Valores:<br>-​<br>client_credentials<br>-​<br>password|
|username|String|Não|Nome do usuário.<br>Utilizado quando grant_type definido como password.|
|<br>password|<br>String|<br>Não|<br>Senha do usuário.​<br>Utilizado quando grant_type definido como password.|



Modelo do JSON da resposta de sucesso da requisição:

```
   { ​
     "access_token": "string", ​
     "expires_in": 0, ​
     "token_type": "Bearer" ​
   }

```

Campos da resposta de sucesso da requisição:





|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|access_token|String||Sim|Token de acesso em JWT.|
|<br>expires_in|<br>Int|<br>|<br>Sim|<br>Tempo de expiração do token.|
|token_type|String||Sim|Tipo do token de autenticação.<br>Tipo:<br>-​<br>Bearer|


www.registrodeimoveis.org.br


Modelo do JSON da resposta de erro da requisição:

```
   { ​
   ​ "codigo": 0, ​
   ​ "descricao": "string", ​
   ​ "campos": {} ​
   }

```

Campos da resposta de erro da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>codigo|<br>String|<br>11|<br>Não|<br>Código interno.|
|descricao|String||Sim|Breve descrição interno referente ao código.|
|<br>campos|<br>Object|<br>|<br>Não|<br>Campos com erro na requisição.|



GET /v1/auth/validacao​
Campos do header da API:

|Campo|Tipo|Obrigatório|Descrição|
|---|---|---|---|
|Authorization|String|Sim|Token JWT gerado na API de token da autenticação.|



Modelo do JSON da resposta de erro da requisição:

```
   { ​
   ​ "codigo": 0, ​
   ​ "descricao": "string", ​
   ​ "campos": {} ​
   }

```

Campos da resposta de erro da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>codigo|<br>String|<br>11|<br>Não|<br>Código interno.|
|descricao|String||Sim|Breve descrição interno referente ao código.|
|<br>campos|<br>Object|<br>|<br>Não|<br>Campos com erro na requisição.|



www.registrodeimoveis.org.br


### Descrição das Funcionalidades - Acompanhamento Registral


[RFP-01] - Envio do protocolo online


A funcionalidade de envio do acompanhamento registral em formato online
disponibiliza o cadastramento instantâneo, porém possui a limitação que não
permite o envio de anexo. Para o envio de anexos, será necessário utilizar a
funcionalidade em lote que realiza o processamento em background.


No momento do cadastro são realizadas validações dos campos, e em caso
de problemas, os retornos são exibidos no campo de alertas.


API da funcionalidade:

|Método|Endpoint|Descrição|
|---|---|---|
|POST|/v1/protocolo|API de cadastramento do protocolo online|



POST /v1/protocolo​
Campos do header da API:

|Campo|Tipo|Obrigatório|Descrição|
|---|---|---|---|
|Authorization|String|Sim|Token JWT gerado na API de token da autenticação.|



POST /v1/protocolo​
Campos do body da API:







|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>protocolo|<br>String|<br>30|<br>Sim|<br>Protocolo de identificação do título fornecido<br>pelo cartório.|
|<br>codigoSecundari<br>o|<br>String|<br>50|<br>Não|<br>Código secundário ao protocolo|
|senha|String|20|Não|Código verificador/ senha para consulta ao<br>título.|
|tipoSolicitacao|Int|1|Sim|Identifica o tipo de solicitação​<br>_Tabela de domínio: ACTipoSolicitacao_|
|<br>datas|<br>Object|<br>|<br>Não|<br>Dados das datas.|
|valores|Object||Não|Dados dos valores.|
|<br>apresentante|<br>Object|<br>|<br>Sim|<br>Dados do apresentante.|
|interessado|Object||Não|Dados do interessado.|
|<br>status|<br>Object|<br>|<br>Não|<br>Dados da situação.|
|cobranca|Object||Não|Dados da cobrança.|


POST /v1/protocolo​
Campos do objeto data do body da API:


**Campo** **Tipo** **Tamanho** **Obrigatório Descrição**


www.registrodeimoveis.org.br


|protocolo|Date|10|Não|Data do protocolo.|
|---|---|---|---|---|
|<br>previsaoEntrega|<br>Date|<br>10|<br>Não|<br>Data prevista para entrega.|


POST /v1/protocolo​
Campos do objeto valores do body da API:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|deposito|Decimal|20.2|Não|Valor do depósito.|
|<br>emolumentos|<br>Decimal|<br> 20.2|<br>Não|<br>Valor dos emolumentos.|



POST /v1/protocolo​
Campos do objeto apresentante do body da API:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|nome|String|220|Não|Nome completo do Apresentante.|
|<br>documento|<br>String|<br>14|<br>Sim|<br>Número do documento (CPF ou CNPJ).|
|email|String|220|Não|Endereço de e-mail.|
|<br>telefone|<br>Object|<br>|<br>Não|<br>Dados do telefone.|



POST /v1/protocolo​
Campos telefone do objeto apresentante do body da API:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>ddd|<br>Number|<br>3|<br>Não|<br>Número do DDD do telefone.|
|numero|Number|10|Não|Número do telefone.|



POST /v1/protocolo​
Campos do objeto interessado do body da API:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>nome|<br>String|<br>220|<br>Não<br>|<br>Nome completo do interessado.|
|documento|String|14|Não<br>|Número do documento (CPF ou CNPJ).|
|<br>email|<br>String|<br>220|<br> <br>Não<br>|<br>Endereço de e-mail.|
|telefone|Object||Não<br>|Dados do telefone.|



POST /v1/protocolo​
Campos telefone do objeto interessado do body da API:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>ddd|<br>Number|<br>3|<br>Não|<br>Número do DDD do telefone.|
|numero|Number|10|Não|Número do telefone.|



www.registrodeimoveis.org.br


POST /v1/protocolo​
Campos do objeto status do body da API:



|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|status|Int|11|Não|Código da situação​<br>_Tabela de domínio: ACCodigoStatus_|
|data|DateTime|19|Não|Data da situação|
|<br>descricao|<br>String|<br>|<br>Não|<br>Descrição da situação|
|tipoDescricao|String|20|Não|Tipo do conteúdo da descrição.​<br>_Tabela de domínio: ACTipoDescricao_|


POST /v1/protocolo​
Campos do objeto cobrança do body da API:





|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>tipoCobranca|<br>String|<br>10|<br>Sim|<br>Tipo da cobrança que será gerada.​<br>Tipos:<br>PIX<br>BOLETO|
|<br>dataVencimento|<br>Date|<br>10|<br>Sim|<br>Data do vencimento da cobrança.|
|observacao|String|30|Não|Observações para serem adicionadas na<br>cobrança.|
|<br>dadosPagador|<br>Object|<br>|<br>Sim|<br>Dados do pagador.|
|servicos|Array||Sim|Dados dos serviços.|
|<br>webhook|<br>Object|<br>|<br>Não|<br>Dados do Webhook|


POST /v1/protocolo​
Campos dadosPagador do objeto cobrança do body da API:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|nome|String|60|Sim|Nome do pagador.|
|<br>documento|<br>String|<br>14|<br>Sim|<br>Número do documento (CPF/CNPJ) do pagador<br>(somente número).|
|<br>email|<br>String|<br>150|<br>Sim|<br>Endereço de e-mail do pagador.|
|telefone|Object||Não|Dados do telefone do pagador.|
|<br>endereco|<br>Object|<br>|<br>Sim|<br>Dados do endereço do pagador.|



POST /v1/protocolo​
Campos telefone do objeto dadosPagador que encontra-se no objeto cobrança do
body da API:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>ddd|<br>Number|<br>3|<br>Não|<br>Número do DDD do telefone.|
|numero|Number|10|Não|Número do telefone.|



www.registrodeimoveis.org.br


POST /v1/protocolo​
Campos endereço do objeto dadosPagador que encontra-se no objeto cobrança do
body da API:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|cep|String|8|Sim|CEP do endereço do pagador.|
|<br>tipoLogradouro|<br> String|<br>16|<br>Sim|<br>Tipo do logradouro do endereço do pagador.|
|logradouro|String|150|Sim|Logradouro do endereço do pagador.|
|<br>numero|<br>String|<br>10|<br>Não|<br>Número do imóvel do pagador.|
|bairro|String|100|Sim|Bairro do endereço do pagador.|
|<br>cidade|<br>String|<br>100|<br>Sim|<br>Cidade do endereço do pagador.|
|estado|String|2|Sim|Sigla do estado do endereço do pagador.|



POST /v1/protocolo​
Campos webhook que encontra-se no objeto cobrança da API:



|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>url|<br>String|<br>|<br>Sim|<br>URL do webhook.|
|metodo|String|10|Sim|Tipo do método de comunicação.​<br>Tipos:<br>-​<br>GET<br>-​<br>POST|
|token|String||Não|Token de autenticação para utilização no<br>webhook.|
|<br>tipoToken|<br>String|<br>10|<br>Não|<br>Tipo<br>do<br>token<br>de<br>autenticação<br>para<br>utilização no webhook.<br>Tipos:<br>-​<br>Bearer<br>-​<br>Basic|


Modelo do JSON da requisição no body:

```
   { ​
    "protocolo": "string",   ​
    "codigoSecundario": "string", ​
    "senha": "string", ​
    "tipoSolicitacao": 0, ​
    "datas": { ​
     "protocolo": "2022-08-04", ​
     "previsaoEntrega": "2022-08-04" ​
   }, ​
    "valores": { ​
     "deposito": 0, ​
     "emolumentos": 0 ​
   }, ​
    "apresentante": { ​
     "nome": "string", ​

```


www.registrodeimoveis.org.br


```
  "documento": "string", ​
  "email": "string", ​
  "telefone": { ​
    "ddd": 0, ​
    "numero": 0 ​
} ​
}, ​
 "interessado": { ​
  "nome": "string", ​
  "documento": "string", ​
  "email": "string", ​
  "telefone": { ​
    "ddd": 0, ​
    "numero": 0 ​
} ​
}, ​
 "status": { ​
  "status": 0, ​
  "data": "2023-04-24 11:50:00", ​
  "descricao": "string", ​
  "tipoDescricao": "string" ​
}, ​
 "cobranca": { ​
  "tipoCobranca": "PIX", ​
  "dataVencimento": "2022-08-04", ​
  "observacao": "string", ​
  "dadosPagador": { ​
    "nome": "string", ​
    "documento": "string", ​
    "email": "string", ​
    "telefone": { ​
     "ddd": 0, ​
     "numero": 0 ​
}, ​
    "endereco": { ​
     "cep": "string", ​
     "tipoLogradouro": "string", ​
     "logradouro": "string", ​
     "numero": "string", ​
     "bairro": "string", ​
     "cidade": "string", ​
     "estado": "st" ​

```


www.registrodeimoveis.org.br


```
   } ​
   }, ​
     "servicos": [ ​
   { ​
        "codigo": 0, ​
        "valor": 10000 ​
   } ​
   ], ​
     "webhook": { ​
       "url": "string", ​
       "metodo": "string", ​
       "token": "string", ​
       "tipoToken": 0 ​
   } ​
   } ​
   }

```

Modelo do JSON da resposta de sucesso da requisição:

```
   { ​
   ​ "hash": "3fa85f64-5717-4562-b3fc-2c963f66afa6", ​
   ​ "protocolo": "string", ​
   ​ "dataCadastro": "2022-08-04 10:00:00", ​
   ​ "alertas": [ ​
   ​ ​ { ​
   ​ ​ ​ "campo": "string", ​
   ​ ​ ​ "mensagem": "string" ​
   ​ ​ } ​
   ​ ] ​
   }

```

Campos da resposta de sucesso da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|hash|String|36|Sim|Hash do protocolo.|
|<br>protocolo|<br>String|<br>30|<br>Sim|<br>Protocolo de identificação do título fornecido<br>pelo cartório.|
|dataCadastro|DateTime|19|Sim|Data de cadastro.|
|<br>alertas|<br>Array|<br>|<br>Não|<br>Dados dos alertas gerados na validação.|



www.registrodeimoveis.org.br


Campos do array alertas da resposta de sucesso da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>campo|<br>String|<br>|<br>Sim|<br>Nome do campo que gerou o alerta.|
|mensagem|String||Sim|Mensagem de descrição do alerta.|



Modelo do JSON da resposta de erro da requisição:

```
   { ​
   ​ "codigo": 0, ​
   ​ "descricao": "string", ​
   ​ "campos": {} ​
   }

```

Campos da resposta de erro da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|codigo|String|11|Não|Código interno.|
|<br>descricao|<br>String|<br>|<br>Sim|<br>Breve descrição interno referente ao código.|
|campos|Object||Não|Campos com erro na requisição.|



[RFP-02] - Envio de protocolo em lote


A funcionalidade de envio do acompanhamento registral em formato de lote,
disponibiliza o cadastramento de um lote de protocolos, no qual é possível gerar
cobranças e envio de anexos. Os protocolos são cadastrados em uma fila de
processamento no qual será executado posteriormente. No retorno da solicitação,
será exibido o hash uuid da fila de processamento, no qual poderá ser consultada
posteriormente.


No momento do cadastro são realizadas validações dos campos, e em caso
de problemas, os retornos são exibidos no campo de alertas, porém não impedirá o
processamento do lote.


API da funcionalidade:

|Método|Endpoint|Descrição|
|---|---|---|
|POST|/v1/protocolo/lote|API de cadastramento do protocolo em lote|
|<br>GET|<br>/v1/fila/processamento/protocolo|<br>API da listagem da fila de processamento|
|GET|/v1/fila/processamento/protocolo/{hashFila}|API de detalhamento da fila de processamento|



www.registrodeimoveis.org.br


POST /v1/protocolo/lote​
Campos do header da API:

|Campo|Tipo|Obrigatório|Descrição|
|---|---|---|---|
|Authorization|String|Sim|Token JWT gerado na API de token da autenticação.|



POST /v1/protocolo/lote​
Campos do body da API:







|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>protocolo|<br>String|<br>30|<br>Sim|<br>Protocolo de identificação do título fornecido<br>pelo cartório.|
|<br>codigoSecundari<br>o|<br>String|<br>50|<br>Não|<br>Código secundário ao protocolo|
|senha|String|20|Não|Código verificador/ senha para consulta ao<br>título.|
|tipoSolicitacao|Int|1|Sim|Identifica o tipo de solicitação​<br>_Tabela de domínio: ACTipoSolicitacao_|
|<br>datas|<br>Object|<br>|<br>Não|<br>Dados das datas.|
|valores|Object||Não|Dados dos valores.|
|<br>apresentante|<br>Object|<br>|<br>Sim|<br>Dados do apresentante.|
|interessado|Object||Não|Dados do interessado.|
|<br>status|<br>Object|<br>|<br>Não|<br>Dados da situação.|
|cobranca|Object||Não|Dados da cobrança.|
|<br>arquivos|<br>Array|<br>|<br>Não|<br>Dados para envio de arquivos.|


POST /v1/protocolo/lote​
Campos do objeto data do body da API:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|protocolo|Date|10|Não|Data do protocolo.|
|<br>previsaoEntrega|<br>Date|<br>10|<br>Não|<br>Data prevista para entrega.|



POST /v1/protocolo/lote​
Campos do objeto valores do body da API:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|deposito|Decimal|20.2<br>|Não|Valor do depósito.|
|<br>emolumentos|<br>Decimal|<br> <br> 20.2<br>|<br>Não|<br>Valor dos emolumentos.|



POST /v1/protocolo/lote​
Campos do objeto apresentante do body da API:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|nome|String|220|Não|Nome completo do Apresentante.|
|<br>documento|<br>String|<br>14|<br>Sim|<br>Número do documento (CPF ou CNPJ).|
|email|String|220|Não|Endereço de e-mail.|
|<br>telefone|<br>Object|<br>|<br>Não|<br>Dados do telefone.|



www.registrodeimoveis.org.br


POST /v1/protocolo/lote​
Campos telefone do objeto apresentante do body da API:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|ddd|Number|3|Não|Número do DDD do telefone.|
|<br>numero|<br>Number|<br>10|<br>Não|<br>Número do telefone.|



POST /v1/protocolo/lote​
Campos do objeto interessado do body da API:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|nome|String|220|Não|Nome completo do interessado.|
|<br>documento|<br>String|<br>14|<br>Não|<br>Número do documento (CPF ou CNPJ).|
|email|String|220|Não|Endereço de e-mail.|
|<br>telefone|<br>Object|<br>|<br>Não|<br>Dados do telefone.|



POST /v1/protocolo/lote​
Campos telefone do objeto interessado do body da API:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|ddd|Number|3|Não|Número do DDD do telefone.|
|<br>numero|<br>Number|<br>10|<br>Não|<br>Número do telefone.|



POST /v1/protocolo/lote​
Campos do objeto status do body da API:



|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|status|Int|11|Não|Código da situação​<br>_Tabela de domínio: ACCodigoStatus_|
|<br>data|<br>DateTime|<br>19|<br>Não|<br>Data da situação|
|descricao|String||Não|Descrição da situação|
|<br>tipoDescricao|<br>String|<br>20|<br>Não|<br>Tipo do conteúdo da descrição.​<br>_Tabela de domínio: ACTipoDescricao_|


POST /v1/protocolo/lote​
Campos do objeto cobrança do body da API:





|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>tipoCobranca|<br>String|<br>10|<br>Sim|<br>Tipo da cobrança que será gerada.​<br>Tipos:<br>PIX<br>BOLETO|
|dataVencimento|Date|10|Sim|Data do vencimento da cobrança.|
|<br>observacao|<br>String|<br>30|<br>Não|<br>Observações para serem adicionadas na<br>cobrança.|
|<br>dadosPagador|<br>Object|<br>|<br>Sim|<br>Dados do pagador.|
|servicos|Array||Sim|Dados dos serviços.|


www.registrodeimoveis.org.br


webhook Object Não Dados do Webhook


POST /v1/protocolo/lote​
Campos dadosPagador do objeto cobrança do body da API:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>nome|<br>String|<br>60|<br>Sim|<br>Nome do pagador.|
|documento|String|14|Sim|Número do documento (CPF/CNPJ) do pagador<br>(somente número).|
|<br>email|<br>String|<br>150|<br>Sim|<br>Endereço de e-mail do pagador.|
|telefone|Object||Não|Dados do telefone do pagador.|
|<br>endereco|<br>Object|<br>|<br>Sim|<br>Dados do endereço do pagador.|



POST /v1/protocolo/lote​
Campos telefone do objeto dadosPagador que encontra-se no objeto cobrança do
body da API:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|ddd|Number|3|Não|Número do DDD do telefone.|
|<br>numero|<br>Number|<br>10|<br>Não|<br>Número do telefone.|



POST /v1/protocolo/lote​
Campos endereço do objeto dadosPagador que encontra-se no objeto cobrança do
body da API:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|cep|String|8|Sim|CEP do endereço do pagador.|
|<br>tipoLogradouro|<br> String|<br>16|<br>Sim|<br>Tipo do logradouro do endereço do pagador.|
|logradouro|String|150|Sim|Logradouro do endereço do pagador.|
|<br>numero|<br>String|<br>10|<br>Não|<br>Número do imóvel do pagador.|
|bairro|String|100|Sim|Bairro do endereço do pagador.|
|<br>cidade|<br>String|<br>100|<br>Sim|<br>Cidade do endereço do pagador.|
|estado|String|2|Sim|Sigla do estado do endereço do pagador.|



POST /v1/protocolo/lote​
Campos webhook que encontra-se no objeto cobrança da API:





|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|url|String||Sim|URL do webhook.|
|<br>metodo|<br>String|<br>10|<br>Sim|<br>Tipo do método de comunicação.​<br>Tipos:<br>-​<br>GET<br>-​<br>POST|
|<br>token|<br>String|<br>|<br>Não|<br>Token de autenticação para utilização no<br>webhook.|
|tipoToken|String|10|Não|Tipo<br>do<br>token<br>de<br>autenticação<br>para<br>utilização no webhook.<br>Tipos:|


www.registrodeimoveis.org.br


POST /v1/protocolo/lote​
Campos do array arquivos da API:


|-​|Bearer|
|---|---|
|-​|Basic|



|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>nome|<br>String|<br>150|<br>Sim|<br>Nome do arquivo.|
|url|String||Sim|URL/Link do arquivo para realização do<br>download.|


Modelo do JSON da requisição no body:

```
   [ ​
   { ​
    "protocolo": "string",   ​
    "codigoSecundario": "string", ​
    "senha": "string", ​
    "tipoSolicitacao": 0, ​
    "datas": { ​
     "protocolo": "2022-08-04", ​
     "previsaoEntrega": "2022-08-04" ​
   }, ​
    "valores": { ​
     "deposito": 0, ​
     "emolumentos": 0 ​
   }, ​
    "apresentante": { ​
     "nome": "string", ​
     "documento": "string", ​
     "email": "string", ​
     "telefone": { ​
       "ddd": 0, ​
       "numero": 0 ​
   } ​
   }, ​
    "interessado": { ​
     "nome": "string", ​
     "documento": "string", ​
     "email": "string", ​
     "telefone": { ​
       "ddd": 0, ​
       "numero": 0 ​

```


www.registrodeimoveis.org.br


```
} ​
}, ​
 "status": { ​
  "status": 0, ​
  "data": "2023-04-24 11:50:00", ​
  "descricao": "string", ​
  "tipoDescricao": "string" ​
}, ​
 "cobranca": { ​
  "tipoCobranca": "PIX", ​
  "dataVencimento": "2022-08-04", ​
  "observacao": "string", ​
  "dadosPagador": { ​
    "nome": "string", ​
    "documento": "string", ​
    "email": "string", ​
    "telefone": { ​
     "ddd": 0, ​
     "numero": 0 ​
}, ​
    "endereco": { ​
     "cep": "string", ​
     "tipoLogradouro": "string", ​
     "logradouro": "string", ​
     "numero": "string", ​
     "bairro": "string", ​
     "cidade": "string", ​
     "estado": "st" ​
} ​
}, ​
  "servicos": [ ​
{ ​
     "codigo": 0, ​
     "valor": 10000 ​
} ​
], ​
  "webhook": { ​
    "url": "string", ​
    "metodo": "string", ​
    "token": "string", ​
    "tipoToken": 0 ​
} ​

```


www.registrodeimoveis.org.br


```
   }, ​
   "arquivos": [ ​
   ​ { ​
   ​ ​ "nome": "string", ​
   ​ ​ "url": "string" ​
   ​ } ​
   ] ​
   } ​
   ]

```

Modelo do JSON da resposta de sucesso da requisição:

```
   { ​
   ​ "hash": "3fa85f64-5717-4562-b3fc-2c963f66afa6", ​
   ​ "dataCadastro": "2022-08-04 10:00:00", ​
   ​ "alertas": [ ​
   ​ ​ { ​
   ​ ​ ​ "protocolo": "string", ​
   ​ ​ ​ "campo": "string", ​
   ​ ​ ​ "mensagem": "string" ​
   ​ ​ } ​
   ​ ] ​
   }

```

Campos da resposta de sucesso da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|hash|String|36|Sim|Hash do protocolo.|
|<br>dataCadastro|<br>DateTime|<br> 19|<br>Sim|<br>Data de cadastro.|
|alertas|Array||Não|Dados dos alertas gerados na validação.|



Campos do array alertas da resposta de sucesso da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>protocolo|<br>String|<br>30|<br>Sim|<br>Protocolo de identificação do título fornecido pelo<br>cartório.|
|campo|String||Sim|Nome do campo que gerou o alerta.|
|<br>mensagem|<br>String|<br>|<br>Sim|<br>Mensagem de descrição do alerta.|



www.registrodeimoveis.org.br


Modelo do JSON da resposta de erro da requisição:

```
   { ​
   ​ "codigo": 0, ​
   ​ "descricao": "string", ​
   ​ "campos": {} ​
   }

```

Campos da resposta de erro da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>codigo|<br>String|<br>11|<br>Não|<br>Código interno.|
|descricao|String||Sim|Breve descrição interno referente ao código.|
|<br>campos|<br>Object|<br>|<br>Não|<br>Campos com erro na requisição.|



GET /v1/fila/processamento/protocolo​
Campos do header da API:

|Campo|Tipo|Obrigatório|Descrição|
|---|---|---|---|
|Authorization|String|Sim|Token JWT gerado na API de token da autenticação.|



GET /v1/fila/processamento/protocolo​
Campos da query da API:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>registrosPorPagina|<br> Int|<br>3|<br>Não|<br>Total de registros que deve retornar por<br>página. Padrão é de 50 registros e pode ter<br>no máximo 100.|
|numeroPagina|Int||Não|Número da página que deseja acessar.|
|<br>situacao|<br>Int|<br>1|<br>Não|<br>Situação do processamento.​<br>_Tabela de domínio: ACFilaSituacao_|
|dataInicialCadastro|Date|10|Não|Data inicial do cadastro que deseja filtrar.|
|<br>dataFinalCadastro|<br>Date|<br>10|<br>Não|<br>Data final do cadastro que deseja filtrar.|



Modelo do JSON da resposta de sucesso da requisição:

```
   { ​
     "totalRegistros": 0, ​
     "totalPaginas": 0, ​
     "paginaAtual": 0, ​
     "dados": [ ​
   { ​
          "hash": "3fa85f64-5717-4562-b3fc-2c963f66afa6", ​
          "dataCadastro": "2022-08-04 10:00:00", ​
          "situacao": 0, ​

```

www.registrodeimoveis.org.br


```
          "dataSituacao": "2022-08-04 10:00:00", ​
          "tentativasProcessamento": 0 ​
   } ​
   ] ​
   }

```

Campos da resposta de sucesso da requisição:






|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|totalRegistros|Int||Sim|Número total de registros encontrados.|
|<br>totalPaginas|<br>Int|<br>|<br>Sim|<br>Número total de páginas disponíveis.|
|paginaAtual|Int||Sim|Número da página atual.|
|<br>dados|<br>Array|<br>|<br>Sim|<br>Dados<br>dos<br>registros<br>da<br>fila<br>de<br>processamento.|



Campos do array dados da resposta de sucesso da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|hash|String|40|Não|Hash da fila de processamento.|
|<br>dataCadastro|<br>DateTime|<br>19|<br>Não|<br>Data e hora do cadastro.|
|situacao|Int|1|Não|Situação<br>em<br>que<br>encontra-se<br>o <br>processamento.​<br>_Tabela de domínio: ACFilaSituacao_|
|<br>dataSituacao|<br>DateTime|<br>19|<br>Não|<br>Data e hora da situação.|
|tentativasProce<br>ssamento|Int|1|Não|Número de tentativas de processamento.|



Modelo do JSON da resposta de erro da requisição:

```
   { ​
   ​ "codigo": 0, ​
   ​ "descricao": "string", ​
   ​ "campos": {} ​
   }

```

Campos da resposta de erro da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>codigo|<br>String|<br>11|<br>Não|<br>Código interno.|
|descricao|String||Sim|Breve descrição interno referente ao código.|
|<br>campos|<br>Object|<br>|<br>Não|<br>Campos com erro na requisição.|



www.registrodeimoveis.org.br


GET /v1/fila/processamento/protocolo/{hashFila}​
Campos do header da API:

|Campo|Tipo|Obrigatório|Descrição|
|---|---|---|---|
|Authorization|String|Sim|Token JWT gerado na API de token da autenticação.|



GET /v1/fila/processamento/protocolo/{hashFila}​
Campos da path da API:






|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>hashFila|<br>String|<br>40|<br>Sim|<br>Hash da fila de processamento que deseja<br>consultar os detalhes.|



Modelo do JSON da resposta de sucesso da requisição:

```
   { ​
     "hash": "3fa85f64-5717-4562-b3fc-2c963f66afa6", ​
     "dataCadastro": "2022-08-04 10:00:00", ​
     "dataAtualizacao": "2022-08-04 10:00:00", ​
     "situacao": 0, ​
     "dataSituacao": "2022-08-04 10:00:00", ​
     "tentativasProcessamento": 0, ​
     "nomeUsuario": "string", ​
     "historico": [ ​
   { ​
          "id": 0, ​
          "dataCadastro": "2022-08-04 10:00:00", ​
          "dataAtualizacao": "2022-08-04 10:00:00", ​
          "situacao": 0, ​
          "descricao": "string", ​
          "tipoDescricao": "string" ​
   } ​
   ] ​
   }

```

Campos da resposta de sucesso da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|hash|String|40|Sim|Hash da fila de processamento.|
|<br>dataCadastro|<br>DateTime|<br> 19|<br>Sim|<br>Data e hora do cadastro|
|dataAtualizacao|DateTime|19|Sim|Data e hora da última atualização|
|<br>situacao|<br>Int|<br>1|<br>Sim|<br>Situação<br>em<br>que<br>encontra-se<br>o <br>processamento.​<br>_Tabela de domínio: ACFilaSituacao_|
|<br>dataSituacao|<br>DateTime|<br> 19|<br>Sim|<br>Data e hora da situação|



www.registrodeimoveis.org.br


|tentativasProces<br>samento|Int|1|Sim|Número de tentativas de processamento.|
|---|---|---|---|---|
|<br>nomeUsuario|<br>String|<br>220|<br>Não|<br>Nome<br>do<br>usuário<br>que<br>realizou<br>as<br>solicitações de importação.|
|<br>historico|<br>Array|<br>|<br>Sim|<br>Históricos<br>gerados<br>na<br>fila<br>de<br>processamento.|



Campos do array histórico da resposta de sucesso da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|id|Int|11|Sim|Id do histórico.|
|<br>dataCadastro|<br>DateTime|<br>19|<br>Sim|<br>Data e hora do cadastro.|
|dataAtualizacao|DateTime|19|Sim|Data e hora da última atualização.|
|<br>situacao|<br>Int|<br>1|<br>Sim|<br>Situação que gerou o histórico.​<br>_Tabela de domínio: ACFilaSituacao_|
|<br>descricao|<br>String|<br>|<br>Sim|<br>Descrição do histórico.|



Modelo do JSON da resposta de erro da requisição:

```
   { ​
   ​ "codigo": 0, ​
   ​ "descricao": "string", ​
   ​ "campos": {} ​
   }

```

Campos da resposta de erro da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>codigo|<br>String|<br>11|<br>Não|<br>Código interno.|
|descricao|String||Sim|Breve descrição interno referente ao código.|
|<br>campos|<br>Object|<br>|<br>Não|<br>Campos com erro na requisição.|



[RFP-03] - Geração de cobrança automatizada no protocolo


A funcionalidade de geração automatizada de cobrança para um protocolo
encontra-se disponível no formato de cadastramento em lote, no qual o
processamento é realizado via background.


A geração de cobrança permite que o cartório envie um endpoint de webhook
que será chamado no momento da atualização da situação do pagamento (ex: baixa
por pagamento, baixa de cancelamento). O webhook permite que o cartório realize o
processo de baixa automatizada no sistema interno. Serão realizadas três tentativas
de comunicação com o webhook, caso as três falhem, não será mais possível
receber a notificação.


www.registrodeimoveis.org.br


Para o funcionamento, é necessário que o cartório realize a ativação dos
serviços de cobrança na intranet. O processo de ativação deverá ser verificado no
link [https://www.registrodeimoveis.org.br/manual-modulo-pagamentos](https://www.registrodeimoveis.org.br/manual-modulo-pagamentos)


API da funcionalidade:

|Método|Endpoint|Descrição|
|---|---|---|
|POST|/v1/protocolo/lote|API de cadastramento do protocolo em lote|
|<br>GET|<br>/v1/fila/processamento/protocolo|<br>API da listagem da fila de processamento|
|GET|/v1/fila/processamento/protocolo/{hashFila}|API de detalhamento da fila de processamento|



POST /v1/protocolo/lote​
Campos do header da API:

|Campo|Tipo|Obrigatório|Descrição|
|---|---|---|---|
|Authorization|String|Sim|Token JWT gerado na API de token da autenticação.|



POST /v1/protocolo/lote​
Campos do body da API:







|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>protocolo|<br>String|<br>30|<br>Sim|<br>Protocolo de identificação do título fornecido<br>pelo cartório.|
|codigoSecundari<br>o|String|50|Não|Código secundário ao protocolo|
|senha|String|20|Não|Código verificador/ senha para consulta ao<br>título.|
|<br>tipoSolicitacao|<br>Int|<br>1|<br>Sim|<br>Identifica o tipo de solicitação​<br>_Tabela de domínio: ACTipoSolicitacao_|
|<br>datas|<br>Object|<br>|<br>Não|<br>Dados das datas.|
|valores|Object||Não|Dados dos valores.|
|<br>apresentante|<br>Object|<br>|<br>Não|<br>Dados do apresentante.|
|interessado|Object||Não|Dados do interessado.|
|<br>status|<br>Object|<br>|<br>Não|<br>Dados da situação.|
|cobranca|Object||Não|Dados da cobrança.|
|<br>arquivos|<br>Array|<br>|<br>Não|<br>Dados para envio de arquivos.|


POST /v1/protocolo/lote​
Campos do objeto data do body da API:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>protocolo|<br>Date|<br>10|<br>Não|<br>Data do protocolo.|
|previsaoEntrega|Date|10|Não|Data prevista para entrega.|



www.registrodeimoveis.org.br


POST /v1/protocolo/lote​
Campos do objeto valores do body da API:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|deposito|Decimal|20.2|Não|Valor do depósito.|
|<br>emolumentos|<br>Decimal|<br> 20.2|<br>Não|<br>Valor dos emolumentos.|



POST /v1/protocolo/lote​
Campos do objeto apresentante do body da API:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|nome|String|220|Não|Nome completo do Apresentante.|
|<br>documento|<br>String|<br>14|<br>Não|<br>Número do documento (CPF ou CNPJ).|
|email|String|220|Não|Endereço de e-mail.|
|<br>telefone|<br>Object|<br>|<br>Não|<br>Dados do telefone.|



POST /v1/protocolo/lote​
Campos telefone do objeto apresentante do body da API:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|ddd|Number|3|Não|Número do DDD do telefone.|
|<br>numero|<br>Number|<br>10|<br>Não|<br>Número do telefone.|



POST /v1/protocolo/lote​
Campos do objeto interessado do body da API:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|nome|String|220|Não|Nome completo do interessado.|
|<br>documento|<br>String|<br>14|<br>Não|<br>Número do documento (CPF ou CNPJ).|
|email|String|220|Não|Endereço de e-mail.|
|<br>telefone|<br>Object|<br>|<br>Não|<br>Dados do telefone.|



POST /v1/protocolo/lote​
Campos telefone do objeto interessado do body da API:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|ddd|Number|3|Não|Número do DDD do telefone.|
|<br>numero|<br>Number|<br>10|<br>Não|<br>Número do telefone.|



POST /v1/protocolo/lote​
Campos do objeto status do body da API:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|status|Int|11|Não|Código da situação​<br>_Tabela de domínio: ACCodigoStatus_|
|data|DateTime|19|Não|Data da situação|
|<br>descricao|<br>String|<br>|<br>Não|<br>Descrição da situação|



www.registrodeimoveis.org.br


POST /v1/protocolo/lote​
Campos do objeto cobrança do body da API:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|tipoCobranca|String|10|Sim|Tipo da cobrança que será gerada.​<br>Tipos:<br>-​<br>PIX<br>-​<br>BOLETO|
|dataVencimento|Date|10|Sim|Data do vencimento da cobrança.|
|<br>observacao|<br>String|<br>30|<br>Não|<br>Observações para serem adicionadas na<br>cobrança.|
|dadosPagador|Object||Sim|Dados do pagador.|
|<br>servicos|<br>Array|<br>|<br>Sim|<br>Dados dos serviços.|
|webhook|Object||Não|Dados do Webhook|



POST /v1/protocolo/lote​
Campos dadosPagador do objeto cobrança do body da API:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>nome|<br>String|<br>60|<br>Sim|<br>Nome do pagador.|
|documento|String|14|Sim|Número do documento (CPF/CNPJ) do pagador<br>(somente número).|
|email|String|150|Sim|Endereço de e-mail do pagador.|
|telefone|Object||Não|Dados do telefone do pagador.|
|endereco|Object||Sim|Dados do endereço do pagador.|



POST /v1/protocolo/lote​
Campos telefone do objeto dadosPagador que encontra-se no objeto cobrança do
body da API:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|ddd|Number|3|Não|Número do DDD do telefone.|
|<br>numero|<br>Number|<br>10|<br>Não|<br>Número do telefone.|



POST /v1/protocolo/lote​
Campos endereço do objeto dadosPagador que encontra-se no objeto cobrança do
body da API:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|cep|String|8|Sim|CEP do endereço do pagador.|
|<br>tipoLogradouro|<br> String|<br>16|<br>Sim|<br>Tipo do logradouro do endereço do pagador.|
|logradouro|String|150|Sim|Logradouro do endereço do pagador.|
|<br>numero|<br>String|<br>10|<br>Não|<br>Número do imóvel do pagador.|
|bairro|String|100|Sim|Bairro do endereço do pagador.|
|<br>cidade|<br>String|<br>100|<br>Sim|<br>Cidade do endereço do pagador.|
|estado|String|2|Sim|Sigla do estado do endereço do pagador.|



www.registrodeimoveis.org.br


POST /v1/protocolo/lote​
Campos webhook que encontra-se no objeto cobrança da API:



|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|url|String||Sim|URL do webhook.|
|<br>metodo|<br>String|<br>10|<br>Sim|<br>Tipo do método de comunicação.​<br>Tipos:<br>-​<br>GET<br>-​<br>POST|
|<br>token|<br>String|<br>|<br>Não|<br>Token de autenticação para utilização no<br>webhook.|
|tipoToken|String|10|Não|Tipo<br>do<br>token<br>de<br>autenticação<br>para<br>utilização no webhook.<br>Tipos:<br>-​<br>Bearer<br>-​<br>Basic|


POST /v1/protocolo/lote​
Campos do array arquivos da API:







|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>nome|<br>String|<br>150|<br>Sim|<br>Nome do arquivo.|
|url|String||Sim|URL/Link do arquivo para realização do<br>download.|


Modelo do JSON da requisição no body:

```
   [ ​
   { ​
    "protocolo": "string",   ​
    "codigoSecundario": "string", ​
    "senha": "string", ​
    "tipoSolicitacao": 0, ​
    "datas": { ​
     "protocolo": "2022-08-04", ​
     "previsaoEntrega": "2022-08-04" ​
   }, ​
    "valores": { ​
     "deposito": 0, ​
     "emolumentos": 0 ​
   }, ​
    "apresentante": { ​
     "nome": "string", ​
     "documento": "string", ​
     "email": "string", ​
     "telefone": { ​
       "ddd": 0, ​

```


www.registrodeimoveis.org.br


```
    "numero": 0 ​
} ​
}, ​
 "interessado": { ​
  "nome": "string", ​
  "documento": "string", ​
  "email": "string", ​
  "telefone": { ​
    "ddd": 0, ​
    "numero": 0 ​
} ​
}, ​
 "status": { ​
  "status": 0, ​
  "data": "2023-04-24 11:50:00", ​
  "descricao": "string" ​
}, ​
 "cobranca": { ​
  "tipoCobranca": "PIX", ​
  "dataVencimento": "2022-08-04", ​
  "observacao": "string", ​
  "dadosPagador": { ​
    "nome": "string", ​
    "documento": "string", ​
    "email": "string", ​
    "telefone": { ​
     "ddd": 0, ​
     "numero": 0 ​
}, ​
    "endereco": { ​
     "cep": "string", ​
     "tipoLogradouro": "string", ​
     "logradouro": "string", ​
     "numero": "string", ​
     "bairro": "string", ​
     "cidade": "string", ​
     "estado": "st" ​
} ​
}, ​
  "servicos": [ ​
{ ​
     "codigo": 0, ​

```


www.registrodeimoveis.org.br


```
        "valor": 10000 ​
   } ​
   ], ​
     "webhook": { ​
       "url": "string", ​
       "metodo": "string", ​
       "token": "string", ​
       "tipoToken": 0 ​
   } ​
   }, ​
    "arquivos": [ ​
   ​ { ​
   ​ ​ "nome": "string", ​
   ​ ​ "url": "string" ​
   ​ } ​
   ] ​
   } ​
   ]

```

Modelo do JSON da resposta de sucesso da requisição:

```
   { ​
   ​ "hash": "3fa85f64-5717-4562-b3fc-2c963f66afa6", ​
   ​ "dataCadastro": "2022-08-04 10:00:00", ​
   ​ "alertas": [ ​
   ​ ​ { ​
   ​ ​ ​ "protocolo": "string", ​
   ​ ​ ​ "campo": "string", ​
   ​ ​ ​ "mensagem": "string" ​
   ​ ​ } ​
   ​ ] ​
   }

```

Campos da resposta de sucesso da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|hash|String|36|Sim|Hash do protocolo.|
|<br>dataCadastro|<br>DateTime|<br> 19|<br>Sim|<br>Data de cadastro.|
|alertas|Array||Não|Dados dos alertas gerados na validação.|



www.registrodeimoveis.org.br


Campos do array alertas da resposta de sucesso da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>protocolo|<br>String|<br>30|<br>Sim|<br>Protocolo de identificação do título fornecido pelo<br>cartório.|
|campo|String||Sim|Nome do campo que gerou o alerta.|
|<br>mensagem|<br>String|<br>|<br>Sim|<br>Mensagem de descrição do alerta.|



Modelo do JSON da resposta de erro da requisição:

```
   { ​
   ​ "codigo": 0, ​
   ​ "descricao": "string", ​
   ​ "campos": {} ​
   }

```

Campos da resposta de erro da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>codigo|<br>String|<br>11|<br>Não|<br>Código interno.|
|descricao|String||Sim|Breve descrição interno referente ao código.|
|<br>campos|<br>Object|<br>|<br>Não|<br>Campos com erro na requisição.|



GET /v1/fila/processamento/protocolo​
Campos do header da API:

|Campo|Tipo|Obrigatório|Descrição|
|---|---|---|---|
|Authorization|String|Sim|Token JWT gerado na API de token da autenticação.|



GET /v1/fila/processamento/protocolo​
Campos da query da API:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>registrosPorPagina|<br> Int|<br>3|<br>Não|<br>Total de registros que deve retornar por<br>página. Padrão é de 50 registros e pode ter<br>no máximo 100.|
|numeroPagina|Int||Não|Número da página que deseja acessar.|
|<br>situacao|<br>Int|<br>1|<br>Não|<br>Situação do processamento.​<br>_Tabela de domínio: ACFilaSituacao_|
|dataInicialCadastro|Date|10|Não|Data inicial do cadastro que deseja filtrar.|
|<br>dataFinalCadastro|<br>Date|<br>10|<br>Não|<br>Data final do cadastro que deseja filtrar.|



www.registrodeimoveis.org.br


Modelo do JSON da resposta de sucesso da requisição:

```
   { ​
     "totalRegistros": 0, ​
     "totalPaginas": 0, ​
     "paginaAtual": 0, ​
     "dados": [ ​
   { ​
          "hash": "3fa85f64-5717-4562-b3fc-2c963f66afa6", ​
          "dataCadastro": "2022-08-04 10:00:00", ​
          "situacao": 0, ​
          "dataSituacao": "2022-08-04 10:00:00", ​
          "tentativasProcessamento": 0 ​
   } ​
   ] ​
   }

```

Campos da resposta de sucesso da requisição:






|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|totalRegistros|Int||Sim|Número total de registros encontrados.|
|<br>totalPaginas|<br>Int|<br>|<br>Sim|<br>Número total de páginas disponíveis.|
|paginaAtual|Int||Sim|Número da página atual.|
|<br>dados|<br>Array|<br>|<br>Sim|<br>Dados<br>dos<br>registros<br>da<br>fila<br>de<br>processamento.|



Campos do array dados da resposta de sucesso da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>hash|<br>String|<br>40|<br>Não|<br>Hash da fila de processamento.|
|dataCadastro|DateTime|19|Não|Data e hora do cadastro.|
|<br>situacao|<br>Int|<br>1|<br>Não|<br>Situação<br>em<br>que<br>encontra-se<br>o <br>processamento.​<br>_Tabela de domínio: ACFilaSituacao_|
|<br>dataSituacao|<br>DateTime|<br>19|<br>Não|<br>Data e hora da situação.|
|tentativasProce<br>ssamento|Int|1|Não|Número de tentativas de processamento.|



Modelo do JSON da resposta de erro da requisição:

```
   { ​
   ​ "codigo": 0, ​
   ​ "descricao": "string", ​
   ​ "campos": {} ​
   }

```

www.registrodeimoveis.org.br


Campos da resposta de erro da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>codigo|<br>String|<br>11|<br>Não|<br>Código interno.|
|descricao|String||Sim|Breve descrição interno referente ao código.|
|<br>campos|<br>Object|<br>|<br>Não|<br>Campos com erro na requisição.|



GET /v1/fila/processamento/protocolo/{hashFila}​
Campos do header da API:

|Campo|Tipo|Obrigatório|Descrição|
|---|---|---|---|
|<br>Authorization|<br>String|<br>Sim|<br>Token JWT gerado na API de token da autenticação.|



GET /v1/fila/processamento/protocolo/{hashFila}​
Campos da path da API:






|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|hashFila|String|40|Sim|Hash da fila de processamento que deseja<br>consultar os detalhes.|



Modelo do JSON da resposta de sucesso da requisição:

```
{ ​
  "hash": "3fa85f64-5717-4562-b3fc-2c963f66afa6", ​
  "dataCadastro": "2022-08-04 10:00:00", ​
  "dataAtualizacao": "2022-08-04 10:00:00", ​
  "situacao": 0, ​
  "dataSituacao": "2022-08-04 10:00:00", ​
  "tentativasProcessamento": 0, ​
  "nomeUsuario": "string", ​
  "historico": [ ​
{ ​
       "id": 0, ​
       "dataCadastro": "2022-08-04 10:00:00", ​
       "dataAtualizacao": "2022-08-04 10:00:00", ​
       "situacao": 0, ​
       "descricao": "string" ​
} ​
] ​
}

```

www.registrodeimoveis.org.br


Campos da resposta de sucesso da requisição:






|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>hash|<br>String|<br>40|<br>Sim|<br>Hash da fila de processamento.|
|dataCadastro|DateTime|19|Sim|Data e hora do cadastro|
|<br>dataAtualizacao|<br>DateTime|<br> 19|<br>Sim|<br>Data e hora da última atualização|
|situacao|Int|1|Sim|Situação<br>em<br>que<br>encontra-se<br>o <br>processamento.​<br>_Tabela de domínio: ACFilaSituacao_|
|dataSituacao|DateTime|19|Sim|Data e hora da situação|
|<br>tentativasProces<br>samento|<br>Int|<br>1|<br>Sim|<br>Número de tentativas de processamento.|
|nomeUsuario|String|220|Não|Nome<br>do<br>usuário<br>que<br>realizou<br>as<br>solicitações de importação.|
|historico|Array||Sim|Históricos<br>gerados<br>na<br>fila<br>de<br>processamento.|



Campos do array histórico da resposta de sucesso da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|id|Int|11|Sim|Id do histórico.|
|<br>dataCadastro|<br>DateTime|<br>19|<br>Sim|<br>Data e hora do cadastro.|
|dataAtualizacao|DateTime|19|Sim|Data e hora da última atualização.|
|<br>situacao|<br>Int|<br>1|<br>Sim|<br>Situação que gerou o histórico.​<br>_Tabela de domínio: ACFilaSituacao_|
|descricao|String||Sim|Descrição do histórico.|



Modelo do JSON da resposta de erro da requisição:

```
   { ​
   ​ "codigo": 0, ​
   ​ "descricao": "string", ​
   ​ "campos": {} ​
   }

```

Campos da resposta de erro da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|codigo|String|11|Não|Código interno.|
|<br>descricao|<br>String|<br>|<br>Sim|<br>Breve descrição interno referente ao código.|
|campos|Object||Não|Campos com erro na requisição.|



[RFP-04] - Exclusão de protocolo


A funcionalidade de exclusão está disponível para caso o cartório deseje
excluir um protocolo previamente cadastrado. Caso seja necessário somente


www.registrodeimoveis.org.br


sobrescrever um conteúdo já cadastrado, não será necessário, pois ao enviar uma
nova atualização do protocolo, o mesmo irá sobrescrever o protocolo e a situação
atual do mesmo. A exclusão eliminará o registro e não estará mais disponível para
consulta, porém caso possua cobrança, a cobrança não será cancelada
automaticamente.


API da funcionalidade:

|Método|Endpoint|Descrição|
|---|---|---|
|<br>DELETE|<br>/v1/protocolo/{numeroProtocolo}|<br>API de exclusão do protocolo|



DELETE /v1/protocolo/{numeroProtocolo}​
Campos do header da API:

|Campo|Ti|po|Obrigatório|Col5|Descrição|Col7|
|---|---|---|---|---|---|---|
|Authorization<br>String<br>Sim<br>Token JWT gerado na API de token da autenticação.<br>DELETE /v1/protocolo/{numeroProtocolo}​<br>Campos da path da API:|Authorization<br>String<br>Sim<br>Token JWT gerado na API de token da autenticação.<br>DELETE /v1/protocolo/{numeroProtocolo}​<br>Campos da path da API:|Authorization<br>String<br>Sim<br>Token JWT gerado na API de token da autenticação.<br>DELETE /v1/protocolo/{numeroProtocolo}​<br>Campos da path da API:|Authorization<br>String<br>Sim<br>Token JWT gerado na API de token da autenticação.<br>DELETE /v1/protocolo/{numeroProtocolo}​<br>Campos da path da API:|Authorization<br>String<br>Sim<br>Token JWT gerado na API de token da autenticação.<br>DELETE /v1/protocolo/{numeroProtocolo}​<br>Campos da path da API:|Authorization<br>String<br>Sim<br>Token JWT gerado na API de token da autenticação.<br>DELETE /v1/protocolo/{numeroProtocolo}​<br>Campos da path da API:|Authorization<br>String<br>Sim<br>Token JWT gerado na API de token da autenticação.<br>DELETE /v1/protocolo/{numeroProtocolo}​<br>Campos da path da API:|
|**Campo**||**Tipo**|**Tamanho**|** Obrigatório**|** Obrigatório**|** Descrição**|
|numeroProtocolo||String|30||Sim|Hash do protocolo que deseja excluir.|



Em caso de sucesso é retornado o código HTTP 200 (OK)


Modelo do JSON da resposta de erro da requisição:

```
   { ​
   ​ "codigo": 0, ​
   ​ "descricao": "string", ​
   ​ "campos": {} ​
   }

```

Campos da resposta de erro da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|codigo|String|11|Não|Código interno.|
|<br>descricao|<br>String|<br>|<br>Sim|<br>Breve descrição interno referente ao código.|
|<br>campos|<br>Object|<br>|<br>Não|<br>Campos com erro na requisição.|



[RFP-05] - Listagem dos protocolos integrados


A funcionalidade de listagem, permite que o cartório realize a consulta de
todos os protocolos previamente cadastrados. O retorno possui paginação com
limite máximo de 50 registros por página que retorna somente dados base dos
protocolos, todos os detalhamentos devem ser consultados funcionalidade de


www.registrodeimoveis.org.br


detalhamento.


API da funcionalidade:

|Método|Endpoint|Descrição|
|---|---|---|
|GET|/v1/protocolo|API da listagem de protocolos cadastrados|



GET /v1/protocolo​
Campos do header da API:

|Campo|Tipo|Obrigatório|Descrição|
|---|---|---|---|
|<br>Authorization|<br>String|<br>Sim|<br>Token JWT gerado na API de token da autenticação.|



GET /v1/protocolo​
Campos da query da API:













|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|registrosPorPagina|Int|3|Não|Total de registros que deve retornar por<br>página. Padrão é de 50 registros e pode<br>ter no máximo 100.|
|<br>numeroPagina|<br>Int|<br>|<br>Não|<br>Número da página que deseja acessar.|
|tipoSolicitacao|Int|1|Não|Identifica o tipo de solicitação​<br>_Tabela de domínio: ACTipoSolicitacao_|
|<br>dataInicialProtocolo|<br>Date|<br>10|<br>Não|<br>Data inicial do protocolo que deseja filtrar.|
|dataFinalProtocolo|Date|10|Não|Data final do protocolo que deseja filtrar.|
|<br>dataInicialStatus|<br>Date|<br>10|<br>Não|<br>Data inicial da situação do protocolo que<br>deseja filtrar.|
|<br>dataFinalStatus|<br>Date|<br>10|<br>Não|<br>Data final da situação do protocolo que<br>deseja filtrar.|
|dataInicialCadastro|Date|10|Não|Data inicial do cadastro que deseja filtrar.|
|<br>dataFinalCadastro|<br>Date|<br>10|<br>Não|<br>Data final do cadastro que deseja filtrar.|
|cns|String|6|Não|Código CNS do cartório que deseja filtrar.|
|<br>documentoApresentante|<br> String|<br>14|<br>Não|<br>Número do documento (CPF ou CNPJ) do<br>apresentante que deseja filtrar.|
|<br>documentoInteressado|<br>String|<br>14|<br>Não|<br>Número do documento (CPF ou CNPJ) do<br>interessado que deseja filtrar.|
|protocolo|String|30|Não|Número do protocolo que deseja filtrar.|


Modelo do JSON da resposta de sucesso da requisição:

```
   { ​
     "totalRegistros": 0, ​
     "totalPaginas": 0, ​
     "paginaAtual": 0, ​
     "dados": [ ​
   { ​
          "protocolo": "string",   ​

```

www.registrodeimoveis.org.br


```
          "codigoSecundario": "string", ​
          "tipoSolicitacao": 0, ​
          "datas": { ​
          ​ "protocolo": "2022-08-04", ​
          ​ "previsaoEntrega": "2022-08-04", ​
        ​ }, ​
          "dataCadastro": "2022-08-04 10:00:00", ​
          "dataAtualizacao": "2022-08-04 10:00:00", ​
          "usarSenhaDetalhes": true, ​
          "usarSenhaArquivos": true, ​
          "status": { ​
          ​ "codigo": "string", ​
          ​ "dataStatus": "2022-08-04 10:00:00", ​
          ​ "mensagem": "string" ​
          } ​
   } ​
   ] ​
   }

```

Campos da resposta de sucesso da requisição:






|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>totalRegistros|<br>Int|<br>|<br>Sim|<br>Número total de registros encontrados.|
|totalPaginas|Int||Sim|Número total de páginas disponíveis.|
|<br>paginaAtual|<br>Int|<br>|<br>Sim|<br>Número da página atual.|
|dados|Array||Sim|Dados<br>dos<br>registros<br>da<br>fila<br>de<br>processamento.|



Campos do array dados da resposta de sucesso da requisição:







|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|protocolo|String|40|Não|Hash da fila de processamento.|
|<br>codigoSecundario|<br>String|<br>50|<br>Não|<br>Código secundário ao protocolo|
|tipoSolicitacao|Int|1|Não|Identifica o tipo de solicitação​<br>_Tabela de domínio: ACTipoSolicitacao_|
|datas|Object||Não|Dados das datas do protocolo..|
|<br>dataCadastro|<br>DateTime|<br>19|<br>Não|<br>Data e hora de cadastro.|
|dataAtualizacao|DateTime|19|Não|Data e hora da última atualização.|
|<br>usarSenhaDetalhes|<br> Boolean|<br>|<br>Não|<br>Se deve usar senha para visualizar os<br>detalhes|
|usarSenhaArquivos|Boolean||Não|Se deve usar senha para visualizar os<br>anexos|
|status|Object||Não|Dados da situação do protocolo.|


www.registrodeimoveis.org.br


Campos do objeto datas da resposta de sucesso da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>protocolo|<br>Date|<br>10|<br>Não|<br>Data do protocolo.|
|previsaoEntrega|Date|10|Não|Data prevista para entrega.|



Campos do objeto status da resposta de sucesso da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>codigo|<br>String|<br>|<br>Não|<br>Identificação da situação do andamento.​<br>_Tabela de domínio: ACCodigoStatus_|
|dataStatus|DateTime|19|Não|Data e hora da situação no cartório.|
|<br>mensagem|<br>String|<br>|<br>Não|<br>Mensagem de situação, se necessário.|



Modelo do JSON da resposta de erro da requisição:

```
   { ​
   ​ "codigo": 0, ​
   ​ "descricao": "string", ​
   ​ "campos": {} ​
   }

```

Campos da resposta de erro da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>codigo|<br>String|<br>11|<br>Não|<br>Código interno.|
|descricao|String||Sim|Breve descrição interno referente ao código.|
|<br>campos|<br>Object|<br>|<br>Não|<br>Campos com erro na requisição.|



[RFP-06] - Detalhamento do protocolo - V1


A funcionalidade de detalhamento de protocolos, permite que o cartório
realize a consulta e visualize os dados cadastrados, visualizar o hash da cobrança e
visualizar o hash dos arquivos anexados. Através do hash é possível realizar a
consulta da cobrança e/ou download do arquivo.


A visualização dos detalhes pode ser visualizados, porém, necessitam de
atenção, visto que a sua visualização pode exigir a geração de um novo token. O
novo token é exigido quando o protocolo cadastrado possui senha para a
visualização.


www.registrodeimoveis.org.br


Caso exista senha, será necessário realizar a requisição para a API de
autenticação do protocolo. Deve ser encaminhado o token JWT recebido na
autenticação e a senha do protocolo.


API da funcionalidade de geração do token do protocolo:



|Método|Endpoint|Descrição|
|---|---|---|
|<br>POST|<br>/v1/protocolo/{numeroProtocolo}/token|<br>API da geração do token para visualização dos<br>detalhes do protocolo e download dos arquivos|


API da funcionalidade:











|Método|Endpoint|Descrição|
|---|---|---|
|<br>POST|<br>/v1/protocolo/{numeroProtocolo}/token|<br>API da geração do token para visualização<br>dos detalhes do protocolo e download dos<br>arquivos|
|GET|/v1/protocolo/{numeroProtocolo}/detalhes|API de detalhamento do protocolo|
|<br>GET|<br>/v1/protocolo/{numeroProtocolo}/token/validacao|<br>API da validação do token para visualização<br>dos detalhes do protocolo e download dos<br>arquivos|
|<br>GET|<br>/v1/protocolo/{numeroProtocolo}/download/{has<br>hArquivo}|<br>API de download do anexo|
|<br>GET|<br>/v1/cobranca/{hashCobranca}|<br>API de visualização dos detalhes da cobrança|


POST /v1/protocolo/{numeroProtocolo}/token​
Campos do header da API:



|Campo|Tipo|Obrigatório|Descrição|
|---|---|---|---|
|Authorization|String|Sim|Token JWT gerado na API de token da autenticação.|


POST /v1/protocolo/{numeroProtocolo}/token​
Campos da path da API:



|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|numeroProtocolo|String|30|Sim|Hash do protocolo que deseja consultar os<br>detalhes.|


POST /v1/protocolo/{numeroProtocolo}/token​
Campos do body da API:









|Campo|Tipo|Obrigatório|Descrição|
|---|---|---|---|
|senha|String|Sim|Senha do protocolo.|
|<br>tipoSolicitacao|<br>Int|<br>Sim|<br>Identifica o tipo de solicitação (1 - Registro / 2 - Exame e<br>cálculo)|


www.registrodeimoveis.org.br


Modelo do JSON da requisição no body:

```
   { ​
   ​ "senha": "string", ​
   ​ "tipoSolicitacao": 1 ​
   }

```

Modelo do JSON da resposta de sucesso da requisição:

```
   { ​
     "access_token": "string", ​
     "expires_in": 0, ​
     "token_type": "Header" ​
   }

```

Campos da resposta de sucesso da requisição:






|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|access_token|String||Sim|Token de acesso em JWT.|
|<br>expires_in|<br>Int|<br>|<br>Sim|<br>Tempo de expiração do token.|
|token_type|String||Sim|Tipo do token de autenticação.<br>Tipo:<br>-​<br>Header|



Modelo do JSON da resposta de erro da requisição:

```
   { ​
   ​ "codigo": 0, ​
   ​ "descricao": "string", ​
   ​ "campos": {} ​
   }

```

Campos da resposta de erro da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|codigo|String|11|Não|Código interno.|
|<br>descricao|<br>String|<br>|<br>Sim|<br>Breve descrição interno referente ao código.|
|campos|Object||Não|Campos com erro na requisição.|



www.registrodeimoveis.org.br


GET /v1/protocolo/{numeroProtocolo}/detalhes​
Campos do header da API:

|Campo|Tipo|Obrigatório|Descrição|
|---|---|---|---|
|Authorization|String|Sim|Token JWT gerado na API de token da autenticação.|



GET /v1/protocolo/{numeroProtocolo}/detalhes​
Campos da path da API:






|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>numeroProtocolo|<br>String|<br>40|<br>Sim|<br>Hash do protocolo que deseja consultar os<br>detalhes.|



Modelo do JSON da resposta de sucesso da requisição:

```
{ ​
  "hash": "3fa85f64-5717-4562-b3fc-2c963f66afa6", ​
  "protocolo": "string",   ​
  "codigoSecundario": "string", ​
  "senha": "string", ​
  "tipoSolicitacao": 0, ​
  "dataCadastro": "2022-08-04 10:00:00", ​
  "dataAtualizacao": "2022-08-04 10:00:00", ​
  "datas": { ​
  "protocolo": "2022-08-04", ​
  "previsaoEntrega": "2022-08-04", ​
}, ​
  "valores": { ​
     "deposito": 0, ​
     "emolumentos": 0 ​
}, ​
  "apresentante": { ​
     "nome": "string", ​
     "documento": "string", ​
     "email": "string", ​
     "telefone": { ​
       "ddd": 0, ​
       "numero": 0 ​
}, ​
}, ​
  "interessado": { ​
     "nome": "string", ​
     "documento": "string", ​
     "email": "string", ​

```

www.registrodeimoveis.org.br


```
        "telefone": { ​
          "ddd": 0, ​
          "numero": 0 ​
   }, ​
   }, ​
     "status": { ​
        "status": 0, ​
        "data": "2023-04-24 11:50:00", ​
        "descricao": "string", ​
   }, ​
     "hashCobranca": "3fa85f64-5717-4562-b3fc-2c963f66afa6", ​
     "arquivos":[ ​
     ​  { ​ ​
          "hash": "3fa85f64-5717-4562-b3fc-2c963f66afa6", ​
          "nome": "string" ​
   ​ } ​
   ], ​
     "dataUltimaAtualizacaoSistema": "2023-04-24 11:50:00", ​
   }

```

Campos da resposta de sucesso da requisição:











|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|hash|String||Sim|Hash do protocolo.|
|<br>protocolo|<br>String|<br>30|<br>Sim|<br>Protocolo de identificação do título fornecido<br>pelo cartório.|
|codigoSecundari<br>o|String|50|Não|Código secundário ao protocolo|
|senha|String|20|Sim|Código verificador/ senha para consulta ao<br>título.|
|<br>tipoSolicitacao|<br>Int|<br>1|<br>Sim|<br>Identifica o tipo de solicitação​<br>_Tabela de domínio: ACTipoSolicitacao_|
|<br>dataCadastro|<br>DateTime|<br> 19|<br>Sim|<br>Data e hora de cadastro.|
|dataAtualizacao|DateTime|19|Sim|Data e hora da última atualização.|
|<br>datas|<br>Object|<br>|<br>Sim|<br>Dados das datas do protocolo.|
|valores|Object||Sim|Dados dos valores do protocolo.|
|<br>apresentante|<br>Object|<br>|<br>Sim|<br>Dados do apresentante do protocolo.|
|interessado|Object||Sim|Dados do interessado do protocolo.|
|<br>status|<br>Object|<br>|<br>Sim|<br>Dados da situação do protocolo.|
|hashCobranca|String||Sim|Hash da cobrança.|
|<br>arquivos|<br>Array|<br>|<br>Sim|<br>Dados dos arquivos do protocolo.|
|dataUltimaAtuali<br>zacaoSistema|DateTime|19|Sim|Data e hora da última atualização recebida<br>do cartório. A data e hora é independente<br>do protocolo.|


www.registrodeimoveis.org.br


GET /v1/protocolo/{numeroProtocolo}/detalhes


Campos do objeto datas da resposta de sucesso da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|protocolo|Date|10|Não|Data do protocolo.|
|<br>previsaoEntrega|<br> Date|<br>10|<br>Não|<br>Data prevista para entrega.|



GET /v1/protocolo/{numeroProtocolo}/detalhes


Campos do objeto valores da resposta de sucesso da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|deposito|Decimal|20.2|Não|Valor do depósito.|
|<br>emolumentos|<br>Decimal|<br>20.2|<br>Não|<br>Valor dos emolumentos.|



GET /v1/protocolo/{numeroProtocolo}/detalhes


Campos do objeto apresentante da resposta de sucesso da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|nome|String|220|Não|Nome completo do apresentante.|
|<br>documento|<br>String|<br>14|<br>Não|<br>Número do documento (CPF ou CNPJ).|
|email|String|220|Não|Endereço de e-mail.|
|<br>telefone|<br>Object|<br>|<br>Não|<br>Dados do telefone do apresentante.|



GET /v1/protocolo/{numeroProtocolo}/detalhes


Campos do objeto telefone do objeto apresentante:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|ddd|Number|3|Não|Número do DDD do telefone.|
|<br>numero|<br>Number|<br>10|<br>Não|<br>Número do telefone.|



GET /v1/protocolo/{numeroProtocolo}/detalhes


Campos do objeto interessado da resposta de sucesso da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|nome|String|220|Não|Nome completo do interessado.|
|<br>documento|<br>String|<br>14|<br>Não|<br>Número do documento (CPF ou CNPJ).|
|email|String|220|Não|Endereço de e-mail.|
|<br>telefone|<br>Object|<br>|<br>Não|<br>Dados do telefone do interessado.|



www.registrodeimoveis.org.br


GET /v1/protocolo/{numeroProtocolo}/detalhes


Campos do objeto telefone do objeto interessado:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|ddd|Number|3|Não|Número do DDD do telefone.|
|<br>numero|<br>Number|<br>10|<br>Não|<br>Número do telefone.|



GET /v1/protocolo/{numeroProtocolo}/detalhes


Campos do objeto status da resposta de sucesso da requisição:






|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|status|Int|11|Não|Código da situação.​<br>_Tabela de domínio: ACCodigoStatus_|
|data|DateTime|19|Não|Data da situação.|
|<br>descricao|<br>String|<br>|<br>Não|<br>Descrição da situação.|
|tipoDescricao|String|20|Não|Tipo do conteúdo da descrição.​<br>_Tabela de domínio: ACTipoDescricao_|



GET /v1/protocolo/{numeroProtocolo}/detalhes


Campos do array arquivos da resposta de sucesso da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>hash|<br>String|<br>|<br>Não|<br>Hash de acesso ao arquivo.|
|nome|String||Não|Nome do arquivo.|



Modelo do JSON da resposta de erro da requisição:

```
   { ​
   ​ "codigo": 0, ​
   ​ "descricao": "string", ​
   ​ "campos": {} ​
   }

```

Campos da resposta de erro da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|codigo|String|11|Não|Código interno.|
|<br>descricao|<br>String|<br>|<br>Sim|<br>Breve descrição interno referente ao código.|
|campos|Object||Não|Campos com erro na requisição.|



www.registrodeimoveis.org.br


GET /v1/protocolo/{numeroProtocolo}/token/validacao​
Campos do header da API:

|Campo|Tipo|Obrigatório|Descrição|
|---|---|---|---|
|Authorization|String|Sim|Token JWT gerado na API de token da autenticação.|



GET /v1/protocolo/{numeroProtocolo}/token/validacao​
Campos da path da API:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>numeroProtocolo|<br>String|<br>40|<br>Sim|<br>Hash do protocolo que deseja validar.|



Em caso de sucesso é retornado o código HTTP 200 (OK)


Modelo do JSON da resposta de erro da requisição:

```
   { ​
   ​ "codigo": 0, ​
   ​ "descricao": "string", ​
   ​ "campos": {} ​
   }

```

Campos da resposta de erro da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>codigo|<br>String|<br>11|<br>Não|<br>Código interno.|
|descricao|String||Sim|Breve descrição interno referente ao código.|
|<br>campos|<br>Object|<br>|<br>Não|<br>Campos com erro na requisição.|



GET /v1/protocolo/{numeroProtocolo}/download/{hashArquivo}​
Campos do header da API:

|Campo|Tipo|Obrigatório|Descrição|
|---|---|---|---|
|Authorization|String|Sim|Token JWT gerado na API de token da autenticação.|



GET /v1/protocolo/{numeroProtocolo}/download/{hashArquivo}​
Campos da path da API:





|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>numeroProtocolo|<br>String|<br>40|<br>Sim|<br>Hash do protocolo que o arquivo pertence.|
|hashArquivo|String||Sim|Hash do arquivo que deseja realizar o<br>download|


www.registrodeimoveis.org.br


Em caso de sucesso é retornado o código HTTP 200 (OK) com o download
do arquivo solicitado.


Modelo do JSON da resposta de erro da requisição:

```
   { ​
   ​ "codigo": 0, ​
   ​ "descricao": "string", ​
   ​ "campos": {} ​
   }

```

Campos da resposta de erro da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>codigo|<br>String|<br>11|<br>Não|<br>Código interno.|
|descricao|String||Sim|Breve descrição interno referente ao código.|
|<br>campos|<br>Object|<br>|<br>Não|<br>Campos com erro na requisição.|



GET /v1/cobranca/{hashCobranca}​
Campos do header da API:

|Campo|Tipo|Obrigatório|Descrição|
|---|---|---|---|
|Authorization|String|Sim|Token JWT gerado na API de token da autenticação.|



GET /v1/cobranca/{hashCobranca}​
Campos da path da API:






|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>hashCobranca|<br>String|<br>|<br>Sim|<br>Hash da cobrança que deseja consultar os<br>detalhes.|



Modelo do JSON da resposta de sucesso da requisição:

```
{ ​
​ "hash": "3fa85f64-5717-4562-b3fc-2c963f66afa6", ​
​ "status": 0, ​
​ "dataStatus": "2022-08-04", ​
​ "dataGeracao": "2022-08-04", ​
​ "url": "string", ​
​ "valorTotal": 10000, ​
​ "tipoCobranca": "PIX", ​
​ "dataVencimento": "2022-08-04", ​
​ "dadosPagador": { ​
      "nome": "string", ​
      "documento": "string", ​

```

www.registrodeimoveis.org.br


```
         "email": "string", ​
         "telefone": { ​
           "ddd": 0, ​
           "numero": 0 ​
   }, ​
        "endereco": { ​
          "cep": "string", ​
          "tipoLogradouro": "string", ​
          "logradouro": "string", ​
          "numero": "string", ​
          "bairro": "string", ​
          "cidade": "string", ​
          "estado": "st" ​
   } ​
   }, ​
     "servicos": [ ​
   { ​
          "codigo": 0, ​
          "valor": 10000 ​
   } ​
   ] ​
   }

```

Campos da resposta de sucesso da requisição:







|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>hash|<br>String|<br>36|<br>Sim|<br>Hash da cobrança|
|status|Int|11|Sim|Situação atual da cobrança​<br>_Tabela de domínio: StatusCobranca_|
|<br>dataStatus|<br>Date|<br>10|<br>Sim|<br>Data da situação da cobrança|
|dataGeracao|Date|10|Sim|Data da geração da cobrança|
|<br>url|<br>String|<br>|<br>Sim|<br>URL de acesso a cobrança|
|valorTotal|Int||Sim|Valor total da cobrança. O valor deverá ser<br>informado em formato numérico. (Exemplo<br>R$100,00 deverá ser informado 100000)|
|<br>tipoCobranca|<br>String|<br>10|<br>Sim|<br>Tipo da cobrança que será gerada.​<br>Tipos:<br>PIX<br>BOLETO|
|dataVencimento|Date|10|Sim|Data do vencimento da cobrança.|
|<br>observacao|<br>String|<br>150|<br>Não|<br>Observações para serem adicionadas na<br>cobrança.|
|<br>dadosPagador|<br>Object|<br>|<br>Sim|<br>Dados do pagador.|
|servicos|Array||Sim|Dados dos serviços.|


www.registrodeimoveis.org.br


Campos do objeto dadosPagador da resposta de sucesso da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>nome|<br>String|<br>60|<br>Sim|<br>Nome do pagador.|
|documento|String|14|Sim|Número do documento (CPF/CNPJ) do pagador<br>(somente número).|
|<br>email|<br>String|<br>150|<br>Sim|<br>Endereço de e-mail do pagador.|
|telefone|Object||Não|Dados do telefone do pagador.|
|<br>endereco|<br>Object|<br>|<br>Sim|<br>Dados do endereço do pagador.|



Campos do objeto telefone do objeto dadosPagador da resposta de sucesso da
requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|ddd|Number|3|Não|Número do DDD do telefone.|
|<br>numero|<br>Number|<br>10|<br>Não|<br>Número do telefone.|



Campos do objeto endereco do objeto dadosPagador da resposta de sucesso da
requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|cep|String|8|Sim|CEP do endereço do pagador.|
|<br>tipoLogradouro|<br> String|<br>16|<br>Sim|<br>Tipo do logradouro do endereço do pagador.|
|logradouro|String|150|Sim|Logradouro do endereço do pagador.|
|<br>numero|<br>String|<br>10|<br>Não|<br>Número do imóvel do pagador.|
|bairro|String|100|Sim|Bairro do endereço do pagador.|
|<br>cidade|<br>String|<br>100|<br>Sim|<br>Cidade do endereço do pagador.|
|estado|String|2|Sim|Sigla do estado do endereço do pagador.|



Campos do array serviços da resposta de sucesso da requisição:






|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>codigo|<br>Int|<br>|<br>Sim|<br>O código localizador é um campo numérico. É<br>importante enviar o número do protocolo e não o<br>recibo de pré-pagamento.|
|valor|Int||Sim|Valor do serviço. O valor deverá ser informado em<br>formato numérico. (Exemplo R$100,00 deverá ser<br>informado 100000).|



Modelo do JSON da resposta de erro da requisição:

```
{ ​
​ "codigo": 0, ​
​ "descricao": "string", ​
​ "campos": {} ​
}

```


www.registrodeimoveis.org.br


Campos da resposta de erro da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>codigo|<br>String|<br>11|<br>Não|<br>Código interno.|
|descricao|String||Sim|Breve descrição interno referente ao código.|
|<br>campos|<br>Object|<br>|<br>Não|<br>Campos com erro na requisição.|



[RFP-07] - Detalhamento do protocolo - V2


A funcionalidade de detalhamento de protocolos, permite que o cartório
realize a consulta e visualize os dados cadastrados, visualizar o hash da cobrança e
visualizar o hash dos arquivos anexados. Através do hash é possível realizar a
consulta da cobrança e/ou download do arquivo.


A visualização dos detalhes podem ser visualizados, porém, necessitam de
atenção, visto que a sua visualização pode exigir a geração de um novo token. O
novo token é exigido quando o protocolo cadastrado possui senha para a
visualização ou informar o número de documento (CPF ou CNPJ) do apresentante.


Caso exista senha, será necessário realizar a requisição para a API de
autenticação do protocolo. Deve ser encaminhado o token JWT recebido na
autenticação e a senha do protocolo.


API da funcionalidade de geração do token do protocolo:



|Método|Endpoint|Descrição|
|---|---|---|
|<br>POST|<br>/v2/protocolo/{numeroProtocolo}/token|<br>API da geração do token para visualização dos<br>detalhes do protocolo e download dos arquivos|


API da funcionalidade:











|Método|Endpoint|Descrição|
|---|---|---|
|<br>POST|<br>/v2/protocolo/{numeroProtocolo}/token|<br>API da geração do token para visualização<br>dos detalhes do protocolo e download dos<br>arquivos|
|GET|/v2/protocolo/{numeroProtocolo}/detalhes|API de detalhamento do protocolo|
|<br>GET|<br>/v2/protocolo/{numeroProtocolo}/token/validacao|<br>API da validação do token para visualização<br>dos detalhes do protocolo e download dos<br>arquivos|
|<br>GET|<br>/v1/protocolo/{numeroProtocolo}/download/{has<br>hArquivo}|<br>API de download do anexo|
|<br>GET|<br>/v1/cobranca/{hashCobranca}|<br>API de visualização dos detalhes da cobrança|


www.registrodeimoveis.org.br


POST /v2/protocolo/{numeroProtocolo}/token​
Campos do header da API:

|Campo|Tipo|Obrigatório|Descrição|
|---|---|---|---|
|Authorization|String|Sim|Token JWT gerado na API de token da autenticação.|



POST /v1/protocolo/{numeroProtocolo}/token​
Campos da path da API:



|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>numeroProtocolo|<br>String|<br>30|<br>Sim|<br>Hash do protocolo que deseja consultar os<br>detalhes.|


POST /v2/protocolo/{numeroProtocolo}/token​
Campos do body da API:










|Campo|Tipo|Obrigatório|Descrição|
|---|---|---|---|
|<br>senha|<br>String|<br>Sim|<br>Senha do protocolo.|
|tipoSolicitacao|Int|Sim|Identifica o tipo de solicitação (1 - Registro / 2 - Exame e<br>cálculo)|



Modelo do JSON da requisição no body:

```
   { ​
   ​ "senha": "string", ​
   ​ "tipoSolicitacao": 1 ​
   }

```

Modelo do JSON da resposta de sucesso da requisição:

```
   { ​
     "access_token": "string", ​
     "expires_in": 0, ​
     "token_type": "Header" ​
   }

```

Campos da resposta de sucesso da requisição:





|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>access_token|<br>String|<br>|<br>Sim|<br>Token de acesso em JWT.|
|expires_in|Int||Sim|Tempo de expiração do token.|
|<br>token_type|<br>String|<br>|<br>Sim|<br>Tipo do token de autenticação.<br>Tipo:<br>-​<br>Header|


www.registrodeimoveis.org.br


Modelo do JSON da resposta de erro da requisição:

```
   { ​
   ​ "codigo": 0, ​
   ​ "descricao": "string", ​
   ​ "campos": {} ​
   }

```

Campos da resposta de erro da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>codigo|<br>String|<br>11|<br>Não|<br>Código interno.|
|descricao|String||Sim|Breve descrição interno referente ao código.|
|<br>campos|<br>Object|<br>|<br>Não|<br>Campos com erro na requisição.|



GET /v2/protocolo/{numeroProtocolo}/detalhes​
Campos do header da API:

|Campo|Tipo|Obrigatório|Descrição|
|---|---|---|---|
|Authorization|String|Sim|Token JWT gerado na API de token da autenticação.|



GET /v2/protocolo/{numeroProtocolo}/detalhes​
Campos da path da API:






|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>numeroProtocolo|<br>String|<br>40|<br>Sim|<br>Hash do protocolo que deseja consultar os<br>detalhes.|



Modelo do JSON da resposta de sucesso da requisição:

```
{ ​
  "hash": "3fa85f64-5717-4562-b3fc-2c963f66afa6", ​
  "protocolo": "string",   ​
  "codigoSecundario": "string", ​
  "senha": "string", ​
  "tipoSolicitacao": 0, ​
  "dataCadastro": "2022-08-04 10:00:00", ​
  "dataAtualizacao": "2022-08-04 10:00:00", ​
  "datas": { ​
  "protocolo": "2022-08-04", ​
  "previsaoEntrega": "2022-08-04", ​
}, ​
  "valores": { ​

```

www.registrodeimoveis.org.br


```
     "deposito": 0, ​
     "emolumentos": 0 ​
}, ​
  "apresentante": { ​
     "nome": "string", ​
     "documento": "string", ​
     "email": "string", ​
     "telefone": { ​
       "ddd": 0, ​
       "numero": 0 ​
}, ​
}, ​
  "interessado": { ​
     "nome": "string", ​
     "documento": "string", ​
     "email": "string", ​
     "telefone": { ​
       "ddd": 0, ​
       "numero": 0 ​
}, ​
}, ​
  "listaStatus": [ ​
{ ​
       "id": 0, ​
       "status": 0, ​
       "data": "2023-04-24 11:50:00", ​
       "descricao": "string", ​
       "tipoDescricao": "string", ​
       "arquivos": [ ​
{ ​
            "hash": "3fa85f64-5717-4562-b3fc-2c963f66afa6", ​
            "nome": "string" ​
} ​
] ​
} ​
], ​
  "hashCobranca": "3fa85f64-5717-4562-b3fc-2c963f66afa6", ​
  "totalStatus": 0, ​
  "dataUltimaAtualizacaoSistema": "2023-04-24 11:50:00", ​
}

```

www.registrodeimoveis.org.br


Campos da resposta de sucesso da requisição:









|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>hash|<br>String|<br>|<br>Sim|<br>Hash do protocolo.|
|protocolo|String|30|Sim|Protocolo de identificação do título fornecido<br>pelo cartório.|
|<br>codigoSecundari<br>o|<br>String|<br>50|<br>Não|<br>Código secundário ao protocolo|
|<br>senha|<br>String|<br>20|<br>Sim|<br>Código verificador/ senha para consulta ao<br>título.|
|tipoSolicitacao|Int|1|Sim|Identifica o tipo de solicitação​<br>_Tabela de domínio: ACTipoSolicitacao_|
|<br>dataCadastro|<br>DateTime|<br> 19|<br>Sim|<br>Data e hora de cadastro.|
|dataAtualizacao|DateTime|19|Sim|Data e hora da última atualização.|
|<br>datas|<br>Object|<br>|<br>Sim|<br>Dados das datas do protocolo.|
|valores|Object||Sim|Dados dos valores do protocolo.|
|<br>apresentante|<br>Object|<br>|<br>Sim|<br>Dados do apresentante do protocolo.|
|interessado|Object||Sim|Dados do interessado do protocolo.|
|<br>listaStatus|<br>Array|<br>|<br>Sim|<br>Lista das situações do protocolo|
|hashCobranca|String||Sim|Hash da cobrança.|
|<br>dataUltimaAtuali<br>zacaoSistema|<br>DateTime|<br> 19|<br>Sim|<br>Data e hora da última atualização recebida<br>do cartório. A data e hora é independente<br>do protocolo.|


GET /v2/protocolo/{numeroProtocolo}/detalhes





Campos do objeto datas da resposta de sucesso da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|protocolo|Date|10|Não|Data do protocolo.|
|<br>previsaoEntrega|<br> Date|<br>10|<br>Não|<br>Data prevista para entrega.|



GET /v2/protocolo/{numeroProtocolo}/detalhes


Campos do objeto valores da resposta de sucesso da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|deposito|Decimal|20.2|Não|Valor do depósito.|
|<br>emolumentos|<br>Decimal|<br>20.2|<br>Não|<br>Valor dos emolumentos.|



GET /v2/protocolo/{numeroProtocolo}/detalhes


Campos do objeto apresentante da resposta de sucesso da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|nome|String|220|Não|Nome completo do apresentante.|
|<br>documento|<br>String|<br>14|<br>Não|<br>Número do documento (CPF ou CNPJ).|
|email|String|220|Não|Endereço de e-mail.|
|<br>telefone|<br>Object|<br>|<br>Não|<br>Dados do telefone do apresentante.|



www.registrodeimoveis.org.br


GET /v2/protocolo/{numeroProtocolo}/detalhes


Campos do objeto telefone do objeto apresentante:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|ddd|Number|3|Não|Número do DDD do telefone.|
|<br>numero|<br>Number|<br>10|<br>Não|<br>Número do telefone.|



GET /v1/protocolo/{numeroProtocolo}/detalhes


Campos do objeto interessado da resposta de sucesso da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|nome|String|220|Não|Nome completo do interessado.|
|<br>documento|<br>String|<br>14|<br>Não|<br>Número do documento (CPF ou CNPJ).|
|email|String|220|Não|Endereço de e-mail.|
|<br>telefone|<br>Object|<br>|<br>Não|<br>Dados do telefone do interessado.|



GET /v2/protocolo/{numeroProtocolo}/detalhes


Campos do objeto telefone do objeto interessado:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|ddd|Number|3|Não|Número do DDD do telefone.|
|<br>numero|<br>Number|<br>10|<br>Não|<br>Número do telefone.|



GET /v2/protocolo/{numeroProtocolo}/detalhes


Campos do array listaStatus da resposta de sucesso da requisição:






|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|status|Int|11|Não|Código da situação.​<br>_Tabela de domínio: ACCodigoStatus_|
|<br>data|<br>DateTime|<br>19|<br>Não|<br>Data da situação.|
|descricao|String||Não|Descrição da situação.|
|<br>arquivos|<br>Array|<br>|<br>Sim|<br>Dados dos arquivos do protocolo.|
|tipoDescricao|String|20|Não|Tipo do conteúdo da descrição.​<br>_Tabela de domínio: ACTipoDescricao_|



GET /v2/protocolo/{numeroProtocolo}/detalhes


Campos do array arquivos da resposta de sucesso da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|hash|String||Não|Hash de acesso ao arquivo.|
|<br>nome|<br>String|<br>|<br>Não|<br>Nome do arquivo.|



www.registrodeimoveis.org.br


Modelo do JSON da resposta de erro da requisição:

```
   { ​
   ​ "codigo": 0, ​
   ​ "descricao": "string", ​
   ​ "campos": {} ​
   }

```

Campos da resposta de erro da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>codigo|<br>String|<br>11|<br>Não|<br>Código interno.|
|descricao|String||Sim|Breve descrição interno referente ao código.|
|<br>campos|<br>Object|<br>|<br>Não|<br>Campos com erro na requisição.|



GET /v2/protocolo/{numeroProtocolo}/token/validacao​
Campos do header da API:

|Campo|Tipo|Obrigatório|Descrição|
|---|---|---|---|
|Authorization|String|Sim|Token JWT gerado na API de token da autenticação.|



GET /v2/protocolo/{numeroProtocolo}/token/validacao​
Campos da path da API:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>numeroProtocolo|<br>String|<br>40|<br>Sim|<br>Hash do protocolo que deseja validar.|



Em caso de sucesso é retornado o código HTTP 200 (OK)


Modelo do JSON da resposta de erro da requisição:

```
   { ​
   ​ "codigo": 0, ​
   ​ "descricao": "string", ​
   ​ "campos": {} ​
   }

```

Campos da resposta de erro da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>codigo|<br>String|<br>11|<br>Não|<br>Código interno.|
|descricao|String||Sim|Breve descrição interno referente ao código.|
|<br>campos|<br>Object|<br>|<br>Não|<br>Campos com erro na requisição.|



www.registrodeimoveis.org.br


GET /v1/protocolo/{numeroProtocolo}/download/{hashArquivo}​
Campos do header da API:

|Campo|Tipo|Obrigatório|Descrição|
|---|---|---|---|
|Authorization|String|Sim|Token JWT gerado na API de token da autenticação.|



GET /v1/protocolo/{numeroProtocolo}/download/{hashArquivo}​
Campos da path da API:






|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>numeroProtocolo|<br>String|<br>40|<br>Sim|<br>Hash do protocolo que o arquivo pertence.|
|hashArquivo|String||Sim|Hash do arquivo que deseja realizar o<br>download|



Em caso de sucesso é retornado o código HTTP 200 (OK) com o download
do arquivo solicitado.


Modelo do JSON da resposta de erro da requisição:

```
   { ​
   ​ "codigo": 0, ​
   ​ "descricao": "string", ​
   ​ "campos": {} ​
   }

```

Campos da resposta de erro da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|codigo|String|11|Não|Código interno.|
|<br>descricao|<br>String|<br>|<br>Sim|<br>Breve descrição interno referente ao código.|
|campos|Object||Não|Campos com erro na requisição.|



GET /v1/cobranca/{hashCobranca}​
Campos do header da API:

|Campo|Tipo|Obrigatório|Descrição|
|---|---|---|---|
|<br>Authorization|<br>String|<br>Sim|<br>Token JWT gerado na API de token da autenticação.|



GET /v1/cobranca/{hashCobranca}​
Campos da path da API:





|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|hashCobranca|String||Sim|Hash da cobrança que deseja consultar os<br>detalhes.|


www.registrodeimoveis.org.br


Modelo do JSON da resposta de sucesso da requisição:

```
{ ​
​ "hash": "3fa85f64-5717-4562-b3fc-2c963f66afa6", ​
​ "status": 0, ​
​ "dataStatus": "2022-08-04", ​
​ "dataGeracao": "2022-08-04", ​
​ "url": "string", ​
​ "valorTotal": 10000, ​
​ "tipoCobranca": "PIX", ​
​ "dataVencimento": "2022-08-04", ​
​ "dadosPagador": { ​
      "nome": "string", ​
      "documento": "string", ​
      "email": "string", ​
      "telefone": { ​
        "ddd": 0, ​
        "numero": 0 ​
}, ​
     "endereco": { ​
       "cep": "string", ​
       "tipoLogradouro": "string", ​
       "logradouro": "string", ​
       "numero": "string", ​
       "bairro": "string", ​
       "cidade": "string", ​
       "estado": "st" ​
} ​
}, ​
  "servicos": [ ​
{ ​
       "codigo": 0, ​
       "valor": 10000 ​
} ​
] ​
}

```

www.registrodeimoveis.org.br


Campos da resposta de sucesso da requisição:







|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>hash|<br>String|<br>36|<br>Sim|<br>Hash da cobrança|
|status|Int|11|Sim|Situação atual da cobrança​<br>_Tabela de domínio: StatusCobranca_|
|<br>dataStatus|<br>Date|<br>10|<br>Sim|<br>Data da situação da cobrança|
|dataGeracao|Date|10|Sim|Data da geração da cobrança|
|<br>url|<br>String|<br>|<br>Sim|<br>URL de acesso a cobrança|
|valorTotal|Int||Sim|Valor total da cobrança. O valor deverá ser<br>informado em formato numérico. (Exemplo<br>R$100,00 deverá ser informado 100000)|
|<br>tipoCobranca|<br>String|<br>10|<br>Sim|<br>Tipo da cobrança que será gerada.​<br>Tipos:<br>PIX<br>BOLETO|
|dataVencimento|Date|10|Sim|Data do vencimento da cobrança.|
|<br>observacao|<br>String|<br>150|<br>Não|<br>Observações para serem adicionadas na<br>cobrança.|
|dadosPagador|Object||Sim|Dados do pagador.|
|<br>servicos|<br>Array|<br>|<br>Sim|<br>Dados dos serviços.|


Campos do objeto dadosPagador da resposta de sucesso da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>nome|<br>String|<br>60|<br>Sim|<br>Nome do pagador.|
|documento|String|14|Sim|Número do documento (CPF/CNPJ) do pagador<br>(somente número).|
|<br>email|<br>String|<br>150|<br>Sim|<br>Endereço de e-mail do pagador.|
|telefone|Object||Não|Dados do telefone do pagador.|
|<br>endereco|<br>Object|<br>|<br>Sim|<br>Dados do endereço do pagador.|



Campos do objeto telefone do objeto dadosPagador da resposta de sucesso da
requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|ddd|Number|3|Não|Número do DDD do telefone.|
|<br>numero|<br>Number|<br>10|<br>Não|<br>Número do telefone.|



Campos do objeto endereco do objeto dadosPagador da resposta de sucesso da
requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|cep|String|8|Sim|CEP do endereço do pagador.|
|<br>tipoLogradouro|<br> String|<br>16|<br>Sim|<br>Tipo do logradouro do endereço do pagador.|
|logradouro|String|150|Sim|Logradouro do endereço do pagador.|
|<br>numero|<br>String|<br>10|<br>Não|<br>Número do imóvel do pagador.|
|bairro|String|100|Sim|Bairro do endereço do pagador.|
|<br>cidade|<br>String|<br>100|<br>Sim|<br>Cidade do endereço do pagador.|
|estado|String|2|Sim|Sigla do estado do endereço do pagador.|



www.registrodeimoveis.org.br


Campos do array serviços da resposta de sucesso da requisição:






|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|codigo|Int||Sim|O código localizador é um campo numérico. É<br>importante enviar o número do protocolo e não o<br>recibo de pré-pagamento.|
|<br>valor|<br>Int|<br>|<br>Sim|<br>Valor do serviço. O valor deverá ser informado em<br>formato numérico. (Exemplo R$100,00 deverá ser<br>informado 100000).|



Modelo do JSON da resposta de erro da requisição:

```
   { ​
   ​ "codigo": 0, ​
   ​ "descricao": "string", ​
   ​ "campos": {} ​
   }

```

Campos da resposta de erro da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|codigo|String|11|Não|Código interno.|
|<br>descricao|<br>String|<br>|<br>Sim|<br>Breve descrição interno referente ao código.|
|campos|Object||Não|Campos com erro na requisição.|



www.registrodeimoveis.org.br


### Fluxo das Funcionalidades - Acompanhamento Registral


[FFP-01] - Fluxo do envio do protocolo


www.registrodeimoveis.org.br


[FFP-02] - Fluxo de processamento do protocolo



www.registrodeimoveis.org.br


### Descrição das Funcionalidades - Cobrança


[RFC-01] - Geração de cobrança


A funcionalidade de geração de cobrança permite que o cartório realize
gerações de cobranças através do sistema interno, sem a necessidade de acessar o
gerenciamento de pagamentos disponibilizado na intranet.


A geração de cobrança permite que o cartório envie um endpoint de webhook
que será chamado no momento da atualização da situação do pagamento (ex: baixa
por pagamento, baixa de cancelamento). O webhook permite que o cartório realize o
processo de baixa automatizada no sistema interno. Serão realizadas três tentativas
de comunicação com o webhook, caso as três falhem, não será mais possível
receber a notificação.


Para o funcionamento, é necessário que o cartório realize a ativação dos
serviços de cobrança na intranet. O processo de ativação deverá ser verificado no
link [https://www.registrodeimoveis.org.br/manual-modulo-pagamentos](https://www.registrodeimoveis.org.br/manual-modulo-pagamentos)


API da funcionalidade:

|Método|Endpoint|Descrição|
|---|---|---|
|POST|/v1/cobranca|API de geração da cobrança.|



POST /v1/cobranca​
Campos do header da API:

|Campo|Tipo|Obrigatório|Descrição|
|---|---|---|---|
|Authorization|String|Sim|Token JWT gerado na API de token da autenticação.|



POST /v1/cobranca​
Campos do body da API:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>tipoCobranca|<br>String|<br>10|<br>Sim|<br>Tipo da cobrança que será gerada.​<br>Tipos:<br>PIX<br>BOLETO|
|dataVencimento|Date|10|Sim|Data do vencimento da cobrança.|
|<br>observacao|<br>String|<br>30|<br>Não|<br>Observações para serem adicionadas na<br>cobrança.|
|<br>identificadorCliente|<br> String|<br>100|<br>Não|<br>Identificador gerenciado pelo cliente|
|tipoPagamento|Int|11|Não|Código do tipo de pagamento previamente<br>cadastrado pelo cartório.|
|<br>dadosPagador|<br>Object|<br>|<br>Sim|<br>Dados do pagador.|
|servicos|Array||Sim|Dados dos serviços.|
|<br>webhook|<br>Object|<br>|<br>Não|<br>Dados do Webhook|



www.registrodeimoveis.org.br


POST /v1/cobranca​
Campos do objeto dadosPagador do body da API:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|nome|String|60|Sim|Nome do pagador.|
|<br>documento|<br>String|<br>14|<br>Sim|<br>Número do documento (CPF/CNPJ) do pagador<br>(somente número).|
|<br>email|<br>String|<br>150|<br>Sim|<br>Endereço de e-mail do pagador.|
|telefone|Object||Não|Dados do telefone do pagador.|
|<br>endereco|<br>Object|<br>|<br>Sim|<br>Dados do endereço do pagador.|



POST /v1/protocolo​
Campos do objeto telefone que encontra-se no objeto dadosPagador do body da
API:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|ddd|Number|3|Não|Número do DDD do telefone.|
|<br>numero|<br>Number|<br>10|<br>Não|<br>Número do telefone.|



POST /v1/cobranca​
Campos do objeto endereço que encontra-se no objeto dadosPagador do body da
API:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>cep|<br>String|<br>8|<br>Sim|<br>CEP do endereço do pagador.|
|tipoLogradouro|String|16|Sim|Tipo do logradouro do endereço do pagador.|
|<br>logradouro|<br>String|<br>150|<br>Sim|<br>Logradouro do endereço do pagador.|
|numero|String|10|Não|Número do imóvel do pagador.|
|<br>bairro|<br>String|<br>100|<br>Sim|<br>Bairro do endereço do pagador.|
|cidade|String|100|Sim|Cidade do endereço do pagador.|
|<br>estado|<br>String|<br>2|<br>Sim|<br>Sigla do estado do endereço do pagador.|



POST /v1/cobranca​
Campos do array serviços que encontra-se no objeto dadosPagador do body da
API:





|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|codigo|Int||Sim|O código localizador é um campo numérico.<br>É importante enviar o número do protocolo e<br>não o recibo de pré-pagamento.|
|valor|Int|10|Sim|Valor do serviço. O valor deverá ser<br>informado em formato numérico. (Exemplo<br>R$100,00 deverá ser informado 100000)|


www.registrodeimoveis.org.br


POST /v1/cobranca​
Campos do objeto webhook que encontra-se no objeto dadosPagador do body da
API:



|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|url|String||Sim|URL do webhook.|
|<br>metodo|<br>String|<br>10|<br>Sim|<br>Tipo do método de comunicação.​<br>Tipos:<br>-​<br>GET<br>-​<br>POST|
|<br>token|<br>String|<br>|<br>Não|<br>Token de autenticação para utilização no<br>webhook.|
|tipoToken|String|10|Não|Tipo<br>do<br>token<br>de<br>autenticação<br>para<br>utilização no webhook.<br>Tipos:<br>-​<br>Bearer<br>-​<br>Basic|


Modelo do JSON da requisição no body:

```
   { ​
     "tipoCobranca": "PIX", ​
     "dataVencimento": "2022-08-04", ​
     "observacao": "string", ​
     "identificadorCliente": "string", ​
     "dadosPagador": { ​
       "nome": "string", ​
       "documento": "string", ​
       "email": "string", ​
       "telefone": { ​
        "ddd": 0, ​
        "numero": 0 ​
   }, ​
       "endereco": { ​
        "cep": "string", ​
        "tipoLogradouro": "string", ​
        "logradouro": "string", ​
        "numero": "string", ​
        "bairro": "string", ​
        "cidade": "string", ​
        "estado": "st" ​
   } ​
   }, ​
     "servicos": [ ​
   { ​
        "codigo": 0, ​

```


www.registrodeimoveis.org.br


```
        "valor": 10000 ​
   } ​
   ], ​
     "webhook": { ​
       "url": "string", ​
       "metodo": "string", ​
       "token": "string", ​
       "tipoToken": 0 ​
   } ​
   } ​
   }

```

Modelo do JSON da resposta de sucesso da requisição:

```
   { ​
   ​ "hash": "3fa85f64-5717-4562-b3fc-2c963f66afa6", ​
   ​ "status": 0, ​
   ​ "dataStatus": "2022-08-04", ​
   ​ "url": "string", ​
   ​ "valorTotal": 10000, ​
   ​ "qrcode": "string" ​
   }

```

Campos da resposta de sucesso da requisição:






|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>hash|<br>String|<br>36|<br>Sim|<br>Hash da cobrança|
|status|Int|11|Sim|Situação atual da cobrança​<br>_Tabela de domínio: StatusCobranca_|
|dataStatus|Date|10|Sim|Data da situação da cobrança|
|<br>url|<br>String|<br>|<br>Sim|<br>URL de acesso a cobrança|
|valorTotal|Int||Sim|Valor total da cobrança. O valor deverá ser<br>informado em formato numérico. (Exemplo<br>R$100,00 deverá ser informado 100000)|
|qrcode|String||Sim|Imagem do QRCode para pagamento via<br>Pix|



Modelo do JSON da responsa de erro da requisição:

```
{ ​
​ "codigo": 0, ​
​ "descricao": "string", ​
​ "campos": {} ​
}

```

www.registrodeimoveis.org.br


Campos da responsa de erro da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|codigo|String|11|Não|Código interno.|
|<br>descricao|<br>String|<br>|<br>Sim|<br>Breve descrição interno referente ao código.|
|campos|Object||Não|Campos com erro na requisição.|



[RFC-02] - Listagem das cobranças


A funcionalidade da listagem das cobranças permite que o cartório consulte
todas as cobranças geradas. O retorno possui paginação com limite máximo de 50
registros por página que retorna somente dados base das cobranças, todos os
detalhamentos devem ser consultados funcionalidade de detalhamento.


Para o funcionamento, é necessário que o cartório realize a ativação dos
serviços de cobrança na intranet. O processo de ativação deverá ser verificado no
link [https://www.registrodeimoveis.org.br/manual-modulo-pagamentos](https://www.registrodeimoveis.org.br/manual-modulo-pagamentos)


API da funcionalidade:

|Método|Endpoint|Descrição|
|---|---|---|
|GET|/v1/cobranca|API da listagem das cobranças.|



GET /v1/cobranca​
Campos do header da API:

|Campo|Tipo|Obrigatório|Descrição|
|---|---|---|---|
|Authorization|String|Sim|Token JWT gerado na API de token da autenticação.|



GET /v1/cobranca​
Campos da query da API:





|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|registrosPorPagina|Int|3|Não|Total de registros que deve retornar por<br>página. Padrão é de 50 registros e pode ter<br>no máximo 100.|
|<br>numeroPagina|<br>Int|<br>|<br>Não|<br>Número da página que deseja acessar.|
|tipoCobranca|String|10|Não|Tipo da cobrança que será gerada.​<br>Tipos:<br>-​<br>PIX<br>-​<br>BOLETO|
|<br>status|<br>Int|<br>|<br>Não|<br>Situação da cobrança que deseja filtrar.​<br>_Tabela de domínio: StatusCobranca_|
|<br>pagadorDocumento|<br>String|<br>|<br>Não|<br>Número do documento (CPF ou CNPJ) do<br>pagador da cobrança que deseja filtrar.|
|pagadorEmail|String||Não|Endereço de e-mail do pagador da cobrança<br>que deseja filtrar.|


www.registrodeimoveis.org.br


|dataInicialGeracao|Date|10|Não|Data inicial da geração da cobrança que<br>deseja filtrar.|
|---|---|---|---|---|
|<br>dataFinalGeracao|<br>Date|<br>10|<br>Não|<br>Data final da geração da cobrança que deseja<br>filtrar.|
|<br>dataInicialStatus|<br>Date|<br>10|<br>Não|<br>Data inicial da situação da cobrança que<br>deseja filtrar. Só poderá ser usado em<br>conjunto com a situação.|
|<br>dataFinalStatus|<br>Date|<br>10|<br>Não|<br>Data final da situação da cobrança que<br>deseja filtrar. Só poderá ser usado em<br>conjunto com a situação.|
|dataInicialPagamento|Date|10|Não|Data inicial dopagamentoque deseja filtrar.|
|<br>dataFinalPagamento|<br>Date|<br>10|<br>Não|<br>Data final dopagamentoque deseja filtrar.|


Modelo do JSON da resposta de sucesso da requisição:

```
   { ​
   ​ "totalRegistros": 0, ​
   ​ "totalPaginas": 0, ​
   ​ "paginaAtual": 0, ​
   ​ "cobrancas": [ ​
   ​ ​ { ​
   ​ ​ ​ "hash": "3fa85f64-5717-4562-b3fc-2c963f66afa6", ​
   ​ ​ ​ "status": 0, ​
   ​ ​ ​ "dataStatus": "2022-08-04", ​
   ​ ​ ​ "url": "string", ​
   ​ ​ ​ "valorTotal": 10000, ​
   ​ ​ ​ "pagamentoVinculado": { ​
   ​ ​ ​ ​ "hash": "3fa85f64-5717-4562-b3fc-2c963f66afa6", ​
   ​ ​ ​ ​ "status": 0, ​
   ​ ​ ​ ​ "dataStatus": "2022-08-04", ​
   ​ ​ ​ ​ "url": "string", ​
   ​ ​ ​ ​ "valorTotal": 10000, ​
   ​ ​ ​ ​ "valorDevolucao": 10000 ​
   ​ ​ ​ } ​
   ​ ​ }

      ] ​
   }

```

Campos da resposta de sucesso da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|totalRegistros|Int||Sim|Número total de registros encontrados|
|<br>totalPaginas|<br>Int|<br>|<br>Sim|<br>Número total de páginas disponíveis|
|paginaAtual|Int||Sim|Número da página atual|
|<br>cobrancas|<br>Array|<br>|<br>Sim|<br>Dados das cobranças|



www.registrodeimoveis.org.br


pagamentoVincu
lado Object Não



Dados da cobrança vinculada a cobrança
original



Campos do array cobranças da resposta de sucesso da requisição:






|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>hash|<br>String|<br>36|<br>Não|<br>Hash da cobrança|
|status|Int|11|Não|Situação atual da cobrança​<br>_Tabela de domínio: StatusCobranca_|
|dataStatus|Date|10|Não|Data da situação da cobrança|
|<br>url|<br>String|<br>|<br>Não|<br>URL de acesso a cobrança|
|valorTotal|Int||Não|Valor total da cobrança. O valor deverá ser<br>informado em formato numérico. (Exemplo<br>R$100,00 deverá ser informado 100000)|



Campos do object pagamentoVinculado da resposta de sucesso da requisição:






|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|hash|String|36|Não|Hash da cobrança|
|<br>status|<br>Int|<br>11|<br>Não|<br>Situação atual da cobrança​<br>_Tabela de domínio: StatusCobranca_|
|<br>dataStatus|<br>Date|<br>10|<br>Não|<br>Data da situação da cobrança|
|url|String||Não|URL de acesso a cobrança|
|<br>valorTotal|<br>Int|<br>|<br>Não|<br>Valor total da cobrança. O valor deverá ser<br>informado em formato numérico. (Exemplo<br>R$100,00 deverá ser informado 100000)|
|<br>valorDevolucao|<br>Int|<br>|<br>Não|<br>Valor total da devolução. O valor deverá ser<br>informado em formato numérico. (Exemplo<br>R$100,00 deverá ser informado 100000)|



Modelo do JSON da responsa de erro da requisição:

```
   { ​
   ​ "codigo": 0, ​
   ​ "descricao": "string", ​
   ​ "campos": {} ​
   }

```

Campos da responsa de erro da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>codigo|<br>String|<br>11|<br>Não|<br>Código interno.|
|descricao|String||Sim|Breve descrição interno referente ao código.|
|<br>campos|<br>Object|<br>|<br>Não|<br>Campos com erro na requisição.|



www.registrodeimoveis.org.br


[RFC-03] - Detalhes da cobrança


A funcionalidade de detalhamento da cobrança permite que o cartório
consulte todos os dados da cobrança, incluindo a URL para o acesso ao documento
do boleto ou PIX.


Para o funcionamento, é necessário que o cartório realize a ativação dos
serviços de cobrança na intranet. O processo de ativação deverá ser verificado no
link [https://www.registrodeimoveis.org.br/manual-modulo-pagamentos](https://www.registrodeimoveis.org.br/manual-modulo-pagamentos)


API da funcionalidade:

|Método|Endpoint|Descrição|
|---|---|---|
|<br>GET|<br>/v1/cobranca/{hashCobranca}|<br>API de detalhamento da cobrança..|



GET /v1/cobranca/{hashCobranca}​
Campos do header da API:


GET /v1/cobranca/{hashCobranca}​
Campos da path da API:







Modelo do JSON da resposta de sucesso da requisição:

```
{ ​
​ "hash": "3fa85f64-5717-4562-b3fc-2c963f66afa6", ​
​ "status": 0, ​
​ "dataStatus": "2022-08-04", ​
​ "dataGeracao": "2022-08-04", ​
​ "url": "string", ​
​ "valorTotal": 10000, ​
​ "tipoCobranca": "PIX", ​
​ "dataVencimento": "2022-08-04", ​
   "identificadorCliente": "string", ​
​ "dadosPagador": { ​
      "nome": "string", ​
      "documento": "string", ​
      "email": "string", ​
      "telefone": { ​
        "ddd": 0, ​

```

www.registrodeimoveis.org.br


```
        "numero": 0 ​
}, ​
     "endereco": { ​
       "cep": "string", ​
       "tipoLogradouro": "string", ​
       "logradouro": "string", ​
       "numero": "string", ​
       "bairro": "string", ​
       "cidade": "string", ​
       "estado": "st" ​
} ​
}, ​
  "servicos": [ ​
{ ​
       "codigo": 0, ​
       "valor": 10000 ​
} ​
], ​ ​
​ "devolucoes": [ ​
​ ​ { ​
​ ​ ​ "hash": "3fa85f64-5717-4562-b3fc-2c963f66afa6", ​
​ ​ ​ "status": 0, ​
​ ​ ​ "valor": 10000, ​
​ ​ ​ "dataCadastro": "2025-01-29T20:10:55", ​
​ ​ ​ "dataAtualizacao": "2025-01-29T20:10:55" ​
​ ​ } ​
​ ], ​
  "pagamentoVinculado": { ​
​ ​ "hash": "3fa85f64-5717-4562-b3fc-2c963f66afa6", ​
​ ​ "status": 0, ​
​ ​ "dataStatus": "2022-08-04", ​
​ ​ "dataGeracao": "2022-08-04", ​
​ ​ "url": "string", ​
​ ​ "valorTotal": 10000, ​
​ ​ "tipoCobranca": "PIX", ​
​ ​ "dataVencimento": "2022-08-04", ​
   ​​ "identificadorCliente": "string", ​
​ ​ "dadosPagador": { ​
      ​ ​ "nome": "string", ​
      ​ ​ "documento": "string", ​
      ​ ​ "email": "string", ​
      ​ ​ "telefone": { ​

```

www.registrodeimoveis.org.br


```
           ​ ​ "ddd": 0, ​
           ​ ​ "numero": 0 ​
        ​ ​ }, ​
        ​ ​ "endereco": { ​
          ​ ​ "cep": "string", ​
          ​ ​ "tipoLogradouro": "string", ​
          ​ ​ "logradouro": "string", ​
          ​ ​ "numero": "string", ​
          ​ ​ "bairro": "string", ​
          ​ ​ "cidade": "string", ​
          ​ ​ "estado": "st" ​
        ​ ​ } ​
     ​ ​ }, ​
     ​ ​ "servicos": [ ​
        ​ ​ { ​
          ​ ​ "codigo": 0, ​
          ​ ​ "valor": 10000 ​
        ​ ​ } ​
     ​ ​ ], ​
   ​ ​ "devolucoes": [ ​
   ​ ​ ​ { ​
   ​ ​ ​ ​ "hash": "3fa85f64-5717-4562-b3fc-2c963f66afa6", ​
   ​ ​ ​ ​ "status": 0, ​
   ​ ​ ​ ​ "valor": 10000, ​
   ​ ​ ​ ​ "dataCadastro": "2025-01-29T20:10:55", ​
   ​ ​ ​ ​ "dataAtualizacao": "2025-01-29T20:10:55" ​
   ​ ​ ​ } ​
   ​ ​ ] ​
   ​ } ​
   }

```

Campos da resposta de sucesso da requisição:





|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>hash|<br>String|<br>36|<br>Sim|<br>Hash da cobrança|
|status|Int|11|Sim|Situação atual da cobrança​<br>_Tabela de domínio: StatusCobranca_|
|<br>dataStatus|<br>Date|<br>10|<br>Sim|<br>Data da situação da cobrança|
|dataGeracao|Date|10|Sim|Data da geração da cobrança|
|<br>url|<br>String|<br>|<br>Sim|<br>URL de acesso a cobrança|
|valorTotal|Int||Sim|Valor total da cobrança. O valor deverá ser<br>informado em formato numérico. (Exemplo<br>R$100,00 deverá ser informado 100000)|


www.registrodeimoveis.org.br


|tipoCobranca|String|10|Sim|Tipo da cobrança que será gerada.​<br>Tipos:<br>PIX<br>BOLETO|
|---|---|---|---|---|
|<br>dataVencimento|<br>Date|<br>10|<br>Sim|<br>Data do vencimento da cobrança.|
|observacao|String|150|Não|Observações para serem adicionadas na<br>cobrança.|
|dadosPagador|Object||Sim|Dados do pagador.|
|<br>servicos<br>|<br>Array|<br>|<br>Sim|<br>Dados dos serviços.|
|identificadorCliente|String|100|Não|Identificador gerenciado pelo cliente|
|devolucoes|Array||Não|Lista de operações de devolução de valores<br>pagos|
|pagamentoVincul<br>ado|Object||Não|Dados da cobrança vinculada a cobrança<br>original|



Campos do objeto dadosPagador da resposta de sucesso da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>nome|<br>String|<br>60|<br>Sim|<br>Nome do pagador.|
|documento|String|14|Sim|Número do documento (CPF/CNPJ) do pagador<br>(somente número).|
|email|String|150|Sim|Endereço de e-mail do pagador.|
|<br>telefone|<br>Object|<br>|<br>Não|<br>Dados do telefone do pagador.|
|endereco|Object||Sim|Dados do endereço do pagador.|



Campos do objeto telefone do objeto dadosPagador da resposta de sucesso da
requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>ddd|<br>Number|<br>3|<br>Não|<br>Número do DDD do telefone.|
|numero|Number|10|Não|Número do telefone.|



Campos do objeto endereco do objeto dadosPagador da resposta de sucesso da
requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>cep|<br>String|<br>8|<br>Sim|<br>CEP do endereço do pagador.|
|tipoLogradouro|String|16|Sim|Tipo do logradouro do endereço do pagador.|
|<br>logradouro|<br>String|<br>150|<br>Sim|<br>Logradouro do endereço do pagador.|
|numero|String|10|Não|Número do imóvel do pagador.|
|<br>bairro|<br>String|<br>100|<br>Sim|<br>Bairro do endereço do pagador.|
|cidade|String|100|Sim|Cidade do endereço do pagador.|
|<br>estado|<br>String|<br>2|<br>Sim|<br>Sigla do estado do endereço do pagador.|



www.registrodeimoveis.org.br


Campos do array serviços da resposta de sucesso da requisição:






|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>codigo|<br>Int|<br>|<br>Sim|<br>O código localizador é um campo numérico. É<br>importante enviar o número do protocolo e não o<br>recibo de pré-pagamento.|
|<br>valor|<br>Int|<br>|<br>Sim|<br>Valor do serviço. O valor deverá ser informado em<br>formato numérico. (Exemplo R$100,00 deverá ser<br>informado 100000).|



Campos do array devolucoes da resposta de sucesso da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|hash|String|36|Sim|Hash da devolução|
|<br>status|<br>Int|<br>|<br>Sim|<br>Situaçãoda devolução|
|valor|Number||Sim|Valor da devolução. O valor deverá ser<br>informado em formato numérico. (Exemplo<br>R$100,00 deverá ser informado 100000)|
|dataCadastro|DateTime|19|Sim|Data da solicitação da devolução|
|<br>dataAtualizaca<br>o|<br>DateTime|<br>19|<br>Sim|<br>Data da última atualização|



Campos do objeto pagamentoVinculado da resposta de sucesso da requisição:











|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>hash|<br>String|<br>36|<br>Sim|<br>Hash da cobrança|
|status|Int|11|Sim|Situação atual da cobrança​<br>_Tabela de domínio: StatusCobranca_|
|<br>dataStatus|<br>Date|<br>10|<br>Sim|<br>Data da situação da cobrança|
|dataGeracao|Date|10|Sim|Data da geração da cobrança|
|<br>url|<br>String|<br>|<br>Sim|<br>URL de acesso a cobrança|
|valorTotal|Int||Sim|Valor total da cobrança. O valor deverá ser<br>informado em formato numérico. (Exemplo<br>R$100,00 deverá ser informado 100000)|
|<br>tipoCobranca|<br>String|<br>10|<br>Sim|<br>Tipo da cobrança que será gerada.​<br>Tipos:<br>-​<br>PIX<br>-​<br>BOLETO|
|dataVencimento|Date|10|Sim|Data do vencimento da cobrança.|
|<br>observacao|<br>String|<br>150|<br>Não|<br>Observações para serem adicionadas na<br>cobrança.|
|<br>dadosPagador|<br>Object|<br>|<br>Sim|<br>Dados do pagador.|
|servicos|Array||Sim|Dados dos serviços.|
|<br>identificadorClient<br>e|<br>String|<br>100|<br>Não|<br>Identificador gerenciado pelo cliente|
|devolucoes|<br>Array|<br>|<br>Não|<br>Lista de operações de devolução de valores<br>pagos|


www.registrodeimoveis.org.br


Campos do objeto dadosPagador do objeto pagamentoVinculado da resposta de
sucesso da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|nome|String|60|Sim|Nome do pagador.|
|<br>documento|<br>String|<br>14|<br>Sim|<br>Número do documento (CPF/CNPJ) do pagador<br>(somente número).|
|<br>email|<br>String|<br>150|<br>Sim|<br>Endereço de e-mail do pagador.|
|telefone|Object||Não|Dados do telefone do pagador.|
|<br>endereco|<br>Object|<br>|<br>Sim|<br>Dados do endereço do pagador.|



Campos do objeto telefone do objeto dadosPagador da resposta de sucesso da
requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|ddd|Number|3|Não|Número do DDD do telefone.|
|<br>numero|<br>Number|<br>10|<br>Não|<br>Número do telefone.|



Campos do objeto endereco do objeto dadosPagador da resposta de sucesso da
requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|cep|String|8|Sim|CEP do endereço do pagador.|
|<br>tipoLogradouro|<br> String|<br>16|<br>Sim|<br>Tipo do logradouro do endereço do pagador.|
|logradouro|String|150|Sim|Logradouro do endereço do pagador.|
|<br>numero|<br>String|<br>10|<br>Não|<br>Número do imóvel do pagador.|
|bairro|String|100|Sim|Bairro do endereço do pagador.|
|<br>cidade|<br>String|<br>100|<br>Sim|<br>Cidade do endereço do pagador.|
|estado|String|2|Sim|Sigla do estado do endereço do pagador.|



Campos do array serviços da resposta de sucesso da requisição:






|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>codigo|<br>Int|<br>|<br>Sim|<br>O código localizador é um campo numérico. É<br>importante enviar o número do protocolo e não o<br>recibo de pré-pagamento.|
|<br>valor|<br>Int|<br>|<br>Sim|<br>Valor do serviço. O valor deverá ser informado em<br>formato numérico. (Exemplo R$100,00 deverá ser<br>informado 100000).|



Campos do array devolucoes da resposta de sucesso da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|hash|String|36|Sim|Hash da devolução|
|<br>status|<br>Int|<br>|<br>Sim|<br>Situação da devolução|
|valor|Number||Sim|Valor da devolução. O valor deverá ser<br>informado em formato numérico. (Exemplo<br>R$100,00 deverá ser informado 100000)|
|dataCadastro|DateTime|19|Sim|Data da solicitação da devolução|



www.registrodeimoveis.org.br


dataAtualizaca

 - DateTime 19 Sim Data da última atualização


Modelo do JSON da resposta de erro da requisição:

```
   { ​
   ​ "codigo": 0, ​
   ​ "descricao": "string", ​
   ​ "campos": {} ​
   }

```

Campos da resposta de erro da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|codigo|String|11|Não|Código interno.|
|<br>descricao|<br>String|<br>|<br>Sim|<br>Breve descrição interno referente ao código.|
|campos|Object||Não|Campos com erro na requisição.|



[RFC-04] - Cancelamento da cobrança


A funcionalidade de cancelamento da cobrança permite que o cartório realize

   - cancelamento de uma cobrança no portal do Registro de Imóveis do Brasil, porém
não será realizado o cancelamento automático junto ao banco.


Para o funcionamento, é necessário que o cartório realize a ativação dos
serviços de cobrança na intranet. O processo de ativação deverá ser verificado no
link [https://www.registrodeimoveis.org.br/manual-modulo-pagamentos](https://www.registrodeimoveis.org.br/manual-modulo-pagamentos)


API da funcionalidade:

|Método|Endpoint|Descrição|
|---|---|---|
|PATCH|/v1/cobranca/{hashCobranca}|API de cancelamento da cobrança..|



PATCH /v1/cobranca/{hashCobranca}​
Campos do header da API:

|Campo|Tipo|Obrigatório|Descrição|
|---|---|---|---|
|<br>Authorization|<br>String|<br>Sim|<br>Token JWT gerado na API de token da autenticação.|



PATCH /v1/cobranca/{hashCobranca}​
Campos da path da API:





|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|hashCobranca|String|40|Sim|Hash da cobrança que deseja consultar os<br>detalhes.|


www.registrodeimoveis.org.br


Modelo do JSON da resposta de sucesso da requisição:

```
   { ​
   ​ "hash": "3fa85f64-5717-4562-b3fc-2c963f66afa6", ​
   ​ "status": 0, ​
   ​ "dataStatus": "2022-08-04", ​
   ​ "url": "string", ​
   ​ "valorTotal": 10000 ​
   }

```

Campos da resposta de sucesso da requisição:






|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|hash|String|36|Sim|Hash da cobrança|
|<br>status|<br>Int|<br>11|<br>Sim|<br>Situação atual da cobrança​<br>_Tabela de domínio: StatusCobranca_|
|<br>dataStatus|<br>Date|<br>10|<br>Sim|<br>Data da situação da cobrança|
|url|String||Sim|URL de acesso a cobrança|
|<br>valorTotal|<br>Int|<br>|<br>Sim|<br>Valor total da cobrança. O valor deverá ser<br>informado em formato numérico. (Exemplo<br>R$100,00 deverá ser informado 100000)|



Modelo do JSON da resposta de erro da requisição:

```
   { ​
   ​ "codigo": 0, ​
   ​ "descricao": "string", ​
   ​ "campos": {} ​
   }

```

Campos da resposta de erro da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|codigo|String|11|Não|Código interno.|
|<br>descricao|<br>String|<br>|<br>Sim|<br>Breve descrição interno referente ao código.|
|campos|Object||Não|Campos com erro na requisição.|



[RFC-05] - Listagem dos tipos de pagamentos


A funcionalidade da listagem dos tipos de pagamentos permite que o cartório
consulte todos os tipos previamente cadastrados.


O retorno possui paginação com limite máximo de 50 registros por página
que retorna somente dados base do tipo de pagamento.


Para o funcionamento, é necessário que o cartório realize a ativação dos


www.registrodeimoveis.org.br


serviços de cobrança na intranet. O processo de ativação deverá ser verificado no
link [https://www.registrodeimoveis.org.br/manual-modulo-pagamentos](https://www.registrodeimoveis.org.br/manual-modulo-pagamentos)


API da funcionalidade:

|Método|Endpoint|Descrição|
|---|---|---|
|GET|/v1/cobranca/tipo/pagamento|API da listagem dos tipos de pagamentos|



GET /v1/cobranca/tipo/pagamento​
Campos do header da API:

|Campo|Tipo|Obrigatório|Descrição|
|---|---|---|---|
|<br>Authorization|<br>String|<br>Sim|<br>Token JWT gerado na API de token da autenticação.|



GET /v1/cobranca/tipo/pagamento​
Campos da query da API:






|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>registrosPorPagina|<br>Int|<br>3|<br>Não|<br>Total de registros que deve retornar por<br>página. Padrão é de 50 registros e pode ter<br>no máximo 100.|
|<br>numeroPagina|<br>Int|<br>|<br>Não|<br>Número da página que deseja acessar.|
|status|Int|1|Não|Situação do tipo de pagamento que deseja<br>filtrar.​<br>_Tabela de domínio: StatusTipoPagamento_|
|<br>descricao|<br>String|<br>|<br>Não|<br>Descrição ou parte da descrição que deseja<br>filtrar|



Modelo do JSON da resposta de sucesso da requisição:

```
{ ​
  "totalRegistros": 2, ​
  "totalPaginas": 1, ​
  "paginaAtual": 1, ​
  "cobrancas": [ ​
{ ​
       "id": 1, ​
       "descricao": "string", ​
       "dataCadastro": "2023-03-06 16:40:03", ​
       "dataAtualizacao": "2023-04-04 15:58:54", ​
       "status": 1 ​
}, ​
{ ​
       "id": 2, ​
       "descricao": "string", ​
       "dataCadastro": "2022-10-26 18:20:10", ​
       "dataAtualizacao": "2024-03-12 13:56:50", ​

```

www.registrodeimoveis.org.br


```
          "status": 1 ​
   } ​
   ] ​
   }

```

Campos da resposta de sucesso da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>totalRegistros|<br>Int|<br>|<br>Sim|<br>Número total de registros encontrados|
|totalPaginas|Int||Sim|Número total de páginas disponíveis|
|<br>paginaAtual|<br>Int|<br>|<br>Sim|<br>Número da página atual|
|dados|Array||Sim|Dados dos tipos de cobranças|



Campos do array dados da resposta de sucesso da requisição:












|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|id|Int|11|Sim|Id do tipo de pagamento que é utilizado para<br>definir na solicitação de cobrança no campo<br>tipoPagamento|
|descricao|String|250|Sim|Descrição do tipo de pagamento que será<br>exibido ao usuário|
|dataCadastro|DateTime|10|Sim|Data de cadastramento|
|<br>dataAtualizacao|<br>DateTime|<br>|<br>Não|<br>Data da última atualização|
|status|Int|1|Sim|Situação atual do tipo de pagamento​<br>_Tabela de domínio: StatusTipoPagamento_|



Modelo do JSON da responsa de erro da requisição:

```
   { ​
   ​ "codigo": 0, ​
   ​ "descricao": "string", ​
   ​ "campos": {} ​
   }

```

Campos da responsa de erro da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|codigo|String|11|Não|Código interno.|
|<br>descricao|<br>String|<br>|<br>Sim|<br>Breve descrição interno referente ao código.|
|campos|Object||Não|Campos com erro na requisição.|



[RFC-06] - Devolução de valores pagos no PIX


A funcionalidade de devolução de valores, permite que o cartório realize a
devolução de valores de uma cobrança específica que teve o seu pagamento


www.registrodeimoveis.org.br


através do PIX. A devolução poderá ser do valor total ou parcial da cobrança.


Para o funcionamento, é necessário que o cartório realize a ativação dos
serviços de cobrança na intranet. O processo de ativação deverá ser verificado no
link [https://www.registrodeimoveis.org.br/manual-modulo-pagamentos](https://www.registrodeimoveis.org.br/manual-modulo-pagamentos)


API da funcionalidade:

|Método|Endpoint|Descrição|
|---|---|---|
|PATCH|/v1/cobranca/{hashCobranca}|API de cancelamento da cobrança..|



PUT /v1/cobranca/{hashCobranca}/pix/devolucao​
Campos do header da API:

|Campo|Tipo|Obrigatório|Descrição|
|---|---|---|---|
|<br>Authorization|<br>String|<br>Sim|<br>Token JWT gerado na API de token da autenticação.|



PUT /v1/cobranca/{hashCobranca}/pix/devolucao​
Campos da path da API:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|hashCobranca|String|40|Sim|Hash da cobrança que deseja devolver.|



Modelo do JSON da resposta de sucesso da requisição:

```
   { ​
   ​ "valor": 10000 ​
   }

```

Campos da resposta de sucesso da requisição:






|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>valor|<br>Number|<br>|<br>Sim|<br>Valor total que deseja devolver. O valor<br>deverá ser informado em formato numérico.<br>(Exemplo R$100,00 deverá ser informado<br>100000). O limite do valor, será o valor da<br>cobrança.|



Modelo do JSON da resposta de sucesso da requisição:

```
{ ​
​ "hash": "3fa85f64-5717-4562-b3fc-2c963f66afa6", ​
​ "status": 0, ​
​ "dataStatus": "2022-08-04", ​
​ "valorTotal": 10000, ​
​ "valorTotalDevolvido": 10000 ​

```

www.registrodeimoveis.org.br


```
   }

```

Campos da resposta de sucesso da requisição:






|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>hash|<br>String|<br>36|<br>Sim|<br>Hash da cobrança|
|status|Int|11|Sim|Situação atual da cobrança​<br>_Tabela de domínio: StatusCobranca_|
|<br>dataStatus|<br>Date|<br>10|<br>Sim|<br>Data da situação da cobrança|
|valorTotal|Int||Sim|Valor total da cobrança. O valor deverá ser<br>informado em formato numérico. (Exemplo<br>R$100,00 deverá ser informado 100000)|
|<br>valorTotalDevolvi<br>do|<br>Int|<br>|<br>Sim|<br>Valor total já devolvido. O valor deverá ser<br>informado em formato numérico. (Exemplo<br>R$100,00 deverá ser informado 100000)|



Modelo do JSON da resposta de erro da requisição:

```
   { ​
   ​ "codigo": 0, ​
   ​ "descricao": "string", ​
   ​ "campos": {} ​
   }

```

Campos da resposta de erro da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|codigo|String|11|Não|Código interno.|
|<br>descricao|<br>String|<br>|<br>Sim|<br>Breve descrição interno referente ao código.|
|campos|Object||Não|Campos com erro na requisição.|



[RFC-07] - Atualização do protocolo vinculado ao pagamento


A funcionalidade de atualização do protocolo permite que o cartório realize a
atualização do número de protocolo vinculado ao pagamento já existente. Caso o
pagamento já possua mais de um protocolo vinculado, um novo será cadastrado.


Para o funcionamento, é necessário que o cartório realize a ativação dos
serviços de cobrança na intranet. O processo de ativação deverá ser verificado no
link [https://www.registrodeimoveis.org.br/manual-modulo-pagamentos](https://www.registrodeimoveis.org.br/manual-modulo-pagamentos)


API da funcionalidade:

|Método|Endpoint|Descrição|
|---|---|---|
|<br>PATCH|<br>/v1/cobranca/{hashCobranca}/protocolo|<br>API de atualização do protocolo.|



www.registrodeimoveis.org.br


PATCH /v1/cobranca/{hashCobranca}/protocolo​
Campos do header da API:

|Campo|Tipo|Obrigatório|Descrição|
|---|---|---|---|
|Authorization|String|Sim|Token JWT gerado na API de token da autenticação.|



PATCH /v1/cobranca/{hashCobranca}/protocolo​
Campos da path da API:

|Campo Tipo Tamanho|Col2|Obrigatório|Col4|Descrição|
|---|---|---|---|---|
|<br> <br> <br>hashCobranca<br>String<br>40<br>POST /v1/cobranca​|<br>Sim|<br>Sim|<br>Hash da cobrança que deseja consultar os<br>detalhes.|<br>Hash da cobrança que deseja consultar os<br>detalhes.|
|Campos do body da API:|||||
|**Campo**<br>**Tipo**<br>**Tamanho**||**Obrigatório**||** Descrição**|
|protocolo<br>String<br>50||Sim||Novo número do protocolo.|



Modelo do JSON da requisição no body:

```
   { ​
     "protocolo": "string" ​
   }

```

Modelo do JSON da resposta de sucesso da requisição:

```
   { ​
   ​ "hash": "3fa85f64-5717-4562-b3fc-2c963f66afa6", ​
   ​ "mensagem": "string" ​
   }

```

Campos da resposta de sucesso da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>hash|<br>String|<br>36|<br>Sim|<br>Hash da cobrança|
|mensagem|String||Sim|Mensagem de retorno da atualização|



Modelo do JSON da resposta de erro da requisição:

```
   { ​
   ​ "codigo": 0, ​
   ​ "descricao": "string", ​
   ​ "campos": {} ​
   }

```

www.registrodeimoveis.org.br


Campos da resposta de erro da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|codigo|String|11|Não|Código interno.|
|<br>descricao|<br>String|<br>|<br>Sim|<br>Breve descrição interno referente ao código.|
|campos|Object||Não|Campos com erro na requisição.|


### Descrição das Funcionalidades - Atendimento Eletrônico


[RAE-01] - Listagem da resposta de exigência


A funcionalidade de listagem da resposta de exigência, tem como objetivo
permitir que o cartório consulte e importe no sistema interno as respostas de
exigências realizadas através do acompanhamento registral.


API da funcionalidade:

|Método|Endpoint|Descrição|
|---|---|---|
|GET|/v1/atendimento/eletronico|API de listagem dos atendimentos eletrônicos|



GET /v1/atendimento/eletronico​
Campos do header da API:

|Campo|Tipo|Obrigatório|Descrição|
|---|---|---|---|
|<br>Authorization|<br>String|<br>Sim|<br>Token JWT gerado na API de token da autenticação.|



GET /v1/atendimento/eletronico​
Campos da query da API:





|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|registrosPorPagina|Int|3|Não|Total de registros que deve retornar por<br>página. Padrão é de 50 registros e pode<br>ter no máximo 100.|
|numeroPagina|Int||Não|Número da página que deseja acessar.|
|<br>tipoAtendimento|<br>Int|<br>3|<br>Não|<br>Identifica do tipo de atendimento​<br>_Tabela de domínio: AETipoAtendimento_|
|<br>dataInicialCadastro|<br>Date|<br>10|<br>Não|<br>Data inicial do cadastro que deseja filtrar.|
|dataFinalCadastro|Date|10|Não|Data final do cadastro que deseja filtrar.|
|<br>dataInicialAtualizacao|<br>Date|<br>10|<br>Não|<br>Data inicial da última atualização que<br>deseja filtrar|
|dataFinalAtualizacao|Date|10|Não|Data final da última atualização que<br>deseja filtrar|
|documento|String|19|Não|Número do documento (CPF ou CNPJ)<br>que deseja filtrar|
|<br>protocolo|<br>String|<br>150|<br>Não|<br>Número do protocolo cadastrado que<br>deseja filtrar|


www.registrodeimoveis.org.br


status Int 3 Não



Situação do atendimento eletrônico que
deseja filtrar​
_Tabela de domínio: AESituacao_



Modelo do JSON da resposta de sucesso da requisição:













Campos da resposta de sucesso da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|totalRegistros|Int||Sim|Número total de registros encontrados|
|<br>totalPaginas|<br>Int|<br>|<br>Sim|<br>Número total de páginas disponíveis|
|paginaAtual|Int||Sim|Número da página atual|
|<br>dados|<br>Array|<br>|<br>Sim|<br>Dados dos tipos de cobranças|



Campos do array dados da resposta de sucesso da requisição:





|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|id|Int|11|Sim|Código interno do atendimento|
|<br>idCartorio|<br>Int|<br>10|<br>Sim|<br>Id do cartório de destino do atendimento|
|protocolo|String|150|Não|Protocolo do atendimento informado pelo<br>usuário|


www.registrodeimoveis.org.br


|tipoAtendimento|Int|3|Sim|Tipo do atendimento​<br>Tabela de domínio: AETipoAtendimento|
|---|---|---|---|---|
|<br>tipoAtendimento<br>Descricao|<br>String|<br>150|<br>Sim|<br>Descrição do tipo do atendimento​<br>_Tabela de domínio: AETipoAtendimento_|
|<br>status|<br>Int|<br>3|<br>Sim|<br>Situação atual do atendimento​<br>_Tabela de domínio: AESituacao_|
|statusDescricao|String|150|Sim|Descrição da situação atual do atendimento​<br>_Tabela de domínio: AESituacao_|
|dataCadastro|Data|19|Sim|Data de cadastramento do atendimento|
|<br>dataAtualizacao|<br>Data|<br>19|<br>Sim|<br>Data da última atualização do atendimento|
|usuarioNome|String|200|Sim|Nome<br>do<br>usuário<br>que<br>solicitou<br>o <br>atendimento|
|<br>usuarioCpf|<br>String|<br>20|<br>Sim|<br>Número do documento (CPF ou CNPJ) do<br>usuário que solicitou o atendimento|
|<br>usuarioEmail|<br>String|<br>200|<br>Sim|<br>Endereço de e-mail do usuário que solicitou<br>o atendimento|



Modelo do JSON da responsa de erro da requisição:

```
   { ​
   ​ "codigo": 0, ​
   ​ "descricao": "string", ​
   ​ "campos": {} ​
   }

```

Campos da responsa de erro da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>codigo|<br>String|<br>11|<br>Não|<br>Código interno.|
|descricao|String||Sim|Breve descrição interno referente ao código.|
|<br>campos|<br>Object|<br>|<br>Não|<br>Campos com erro na requisição.|



[RAE-02] - Detalhes da resposta de exigência


A funcionalidade de detalhes da resposta de exigência, tem como objetivo
permitir que o cartório consulte o detalhamento completo de um registro do
atendimento eletrônico e importe no sistema interno as respostas de exigências
realizadas através do acompanhamento registral.


API da funcionalidade:

|Método|Endpoint|Descrição|
|---|---|---|
|GET|/v1/atendimento/eletronico/{id}|API de detalhes do atendimento eletrônico|



www.registrodeimoveis.org.br


GET /v1/atendimento/eletronico/{id}​
Campos do header da API:

|Campo|Tipo|Obrigatório|Descrição|
|---|---|---|---|
|Authorization|String|Sim|Token JWT gerado na API de token da autenticação.|



GET /v1/atendimento/eletronico/{id}​
Campos da path da API:


|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>id|<br>Int|<br>11|<br>Sim|<br>Código interno do atendimento|























www.registrodeimoveis.org.br


```
       "data": "2020-03-25 12:42:42", ​
       "origem": 0, ​
       "origemDescricao": "0 = Parte", ​
       "idCartorio": 0, ​
       "mensagem": "string", ​
       "arquivos": [ ​
   { ​
           "nome": "Lorem Ipsum.pdf", ​
           "url": "string" ​
   ​ } ​
   ] ​
   } ​
   ] ​
   }

```

Campos da resposta de sucesso da requisição:



























|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|id|Int|11|Sim|Código interno do atendimento|
|<br>idCartorio|<br>Int|<br>10|<br>Sim|<br>Id do cartório de destino do atendimento|
|protocolo|String|150|Não|Protocolo do atendimento informado pelo<br>usuário|
|tipoAtendimento|Int|3|Sim|Tipo do atendimento​<br>_Tabela de domínio: AETipoAtendimento_|
|<br>tipoAtendimento<br>Descricao|<br>String|<br>150|<br>Sim|<br>Descrição do tipo do atendimento​<br>_Tabela de domínio: AETipoAtendimento_|
|<br>status|<br>Int|<br>3|<br>Sim|<br>Situação atual do atendimento​<br>_Tabela de domínio: AESituacao_|
|statusDescricao|String|150|Sim|Descrição da situação atual do atendimento​<br>_Tabela de domínio: AESituacao_|
|dataCadastro|Data|19|Sim|Data de cadastramento do atendimento|
|<br>dataAtualizacao|<br>Data|<br>19|<br>Sim|<br>Data da última atualização do atendimento|
|usuarioNome|String|200|Sim|Nome<br>do<br>usuário<br>que<br>solicitou<br>o <br>atendimento|
|<br>usuarioCpf|<br>String|<br>20|<br>Sim|<br>Número do documento (CPF ou CNPJ) do<br>usuário que solicitou o atendimento|
|<br>usuarioEmail|<br>String|<br>200|<br>Sim|<br>Endereço de e-mail do usuário que solicitou<br>o atendimento|
|denominacao|String|150|Sim|Denominação/Nome do cartório|
|<br>data|<br>Date|<br>19|<br>Não|<br>Data e hora do atendimento|
|setor|String|100|Não|Nome do setor responsável|
|<br>atendenteNome|<br>String|<br>200|<br>Não|<br>Nome do atendente responsável|
|usuarioCidade|String|100|Não|Cidade<br>do<br>usuário<br>que<br>solicitou<br>o <br>atendimento|
|usuarioEstado|String|2|Não|Estado<br>do<br>usuário<br>que<br>solicitou<br>o <br>atendimento|


www.registrodeimoveis.org.br


|usuarioCelular|String|50|Não|Número do celular do usuário que solicitou o<br>atendimento|
|---|---|---|---|---|
|<br>atendimentoPrior<br>itario|<br>Int|<br>1|<br>Não|<br>Se é um atendimento prioritário​<br>_Tabela_<br>_de_<br>_domínio:_<br>_AEAtendimentoPrioritario_|
|formaAtendiment<br>o|Int|1|Não|Forma do atendimento​<br>_Tabela de domínio: AEFormaAtendimento_|
|<br>destinoContato|<br>Int|<br>3|<br>Não|<br>Tipo do contato​<br>_Tabela de domínio: AETipoContato_|
|<br>classificado|<br>Int|<br>1|<br>Não|<br>Se o contato foi classificado (encaminhado)<br>ou não|
|idSetorFaleCono<br>sco|Int|11|Não|Id do setor do fale conosco|
|observacoes|String|16777215|Não|Observações do contato|
|<br>idUsuario|<br>Int|<br>10|<br>Não|<br>ID do usuário|
|idUsuarioEncami<br>nhamento|Int|10|Não|ID<br>do<br>usuário<br>que<br>recebeu<br>o <br>encaminhamento|
|<br>interacoes|<br>Array|<br>|<br>Sim|<br>Array<br>de<br>interações<br>registradas<br>no<br>atendimento eletrônico|



Campos do objeto interacoes da resposta de sucesso da requisição:








|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>id|<br>Int|<br>10|<br>Sim|<br>Código interno da interação|
|data|Date|19|Sim|Data e hora da atualização|
|<br>origem|<br>Int|<br>4|<br>Sim|<br>Origem da interação​<br>_Tabela de domínio: AEOrigem_|
|origemDescrica<br>o|String|100|Sim|Descrição da origem da interação​<br>_Tabela de domínio: AEOrigem_|
|idCartorio|Int|10|Sim|Id do cartório que realizou a interação|
|<br>mensagem|<br>String|<br>65535|<br>Sim|<br>Mensagem da interação|
|arquivos|Array||Não|Lista de arquivos da integração|



Campos do objeto interacoes/arquivos da resposta de sucesso da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>nome|<br>String|<br>250|<br>Sim|<br>Nome do arquivo|
|url|String||Sim|URL para download do arquivo|



Modelo do JSON da responsa de erro da requisição:

```
   { ​
   ​ "codigo": 0, ​
   ​ "descricao": "string", ​
   ​ "campos": {} ​
   }

```

www.registrodeimoveis.org.br


Campos da responsa de erro da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>codigo|<br>String|<br>11|<br>Não|<br>Código interno.|
|descricao|String||Sim|Breve descrição interno referente ao código.|
|<br>campos|<br>Object|<br>|<br>Não|<br>Campos com erro na requisição.|



[RAE-03] - Cadastramento de interação


A funcionalidade de cadastramento de interação, permite que o cartório
realize a integração/finalização de um atendimento informando que a exigência foi
recebida e está sendo analisada.


API da funcionalidade:

|Método|Endpoint|Descrição|
|---|---|---|
|POST|/v1/atendimento/eletronico/{id}|API de cadastramento de interação|



POST /v1/atendimento/eletronico/{id}​
Campos do header da API:

|Campo|Tipo|Obrigatório|Descrição|
|---|---|---|---|
|<br>Authorization|<br>String|<br>Sim|<br>Token JWT gerado na API de token da autenticação.|



POST /v1/atendimento/eletronico/{id}​
Campos da path da API:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|id|Int|11|Sim|Código interno do atendimento|



POST /v1/atendimento/eletronico/{id}​
Campos do body da API:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>acao|<br>Int|<br>2|<br>Sim|<br>Código da ação que será realizada.​<br>_Tabela de domínio: AEAcao_|
|mensagem|String|65535|Sim|Mensagem para ser adicionada a integração|
|<br>formaAtendimento|<br>Int|<br>2|<br>Não|<br>Forma do atendimento​<br>_Tabela de domínio: AEFormaAtendimento_|
|<br>arquivos|<br>Array|<br>|<br>Não|<br>Lista de arquivos para cadastramento.|



POST /v1/atendimento/eletronico/{id}​
Campos do objeto arquivos do body da API:





|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|<br>nome|<br>String|<br>250|<br>Sim|<br>Nome do arquivo com a extensão.​<br>Exemplo: exemplo.pdf|


www.registrodeimoveis.org.br


|tipo|String|6|Sim|Tipo/extensão do arquivo​<br>Tabela de domínio: AEExtensoesArquivos|
|---|---|---|---|---|
|<br>base64|<br>String|<br>|<br>Sim|<br>Base64 do arquivo|


Modelo do JSON da requisição no body:

```
   { ​
    "acao": "0 = Informativo / mensagem", ​
    "mensagem": "string", ​
    "formaAtendimento": "1 = Presencial", ​
    "arquivos": [ ​
   { ​
       "nome": "string", ​
       "tipo": "pdf", ​
       "base64": "string" ​
   } ​
   ] ​
   }

```

Modelo do JSON da responsa de erro da requisição:

```
   { ​
   ​ "codigo": 0, ​
   ​ "descricao": "string", ​
   ​ "campos": {} ​
   }

```

Campos da responsa de erro da requisição:

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|codigo|String|11|Não|Código interno.|
|<br>descricao|<br>String|<br>|<br>Sim|<br>Breve descrição interno referente ao código.|
|campos|Object||Não|Campos com erro na requisição.|



www.registrodeimoveis.org.br


### Tabelas de Domínio


[TBD-01] - StatusCobranca

|Código|Descrição|
|---|---|
|0|Aguardando pagamento|
|1|Pagamento confirmado|
|2|Pagamento cancelado|



[TBD-02] - ACTipoSolicitacao

|Código|Descrição|
|---|---|
|1|Registro|
|2|Exame e cálculo|



[TBD-03] - ACCodigoStatus








|Código|Descrição do cartório|Descrição do usuário (site)|
|---|---|---|
|1|Título com reingresso|Exame|
|2|Cancelado|Cancelado|
|3|Título pronto para retirada|Pronto|
|4|Título prenotado|Exame|
|5|Exame e cálculo concluído|Pronto|
|6|Título Registrado - não disponível<br>para retirada|Registrado|
|7|Nota de exigência|Pendente|
|8|Título entregue|Entregue|
|9|Suscitação de dúvida|Dúvida|



www.registrodeimoveis.org.br


|10|Dúvida jugada procedente|Dúvida|
|---|---|---|
|11|Dúvida jugada improcedente|Dúvida|
|12|Exame e cálculo protocolado|Exame|
|13|Exame e cálculo pronto para a<br>retirada|Pronto|
|14|Bloqueio de matrículas|Bloqueio de matrículas|
|15|Prorrogado o prazo da prenotação|Prorrogado o prazo da prenotação|
|16|Prorrogado o prazo de entrega ou<br>devolução|Prorrogado o prazo de entrega ou<br>devolução|
|17|Prorrogado o prazo da Penhora<br>online|Prorrogado o prazo da Penhora<br>online|
|18|Notificação|Notificação|
|19|Prorrogado o prazo da Notificação|Prorrogado o prazo da Notificação|
|20|Processamento|Exame|
|21|Aguardando pagamento|Aguardando pagamento|
|22|Confirmação da Lavratura|Pendente de confirmação pelo<br>cartório de notas|
|23|Retirado pelo interessado|Retirado pelo interessado|



[TBD-04] - ACFilaSituacao


www.registrodeimoveis.org.br


|Código|Descrição|
|---|---|
|0|Pendente|
|1|Em processamento|
|2|Processado com sucesso|
|3|Processado com alertas|
|4|Processado com erros|


[TBD-05] - StatusTipoPagamento

|Código|Descrição|
|---|---|
|0|Inativo|
|1|Ativo|



[TBD-06] - ACTipoDescricao

|texto|Formato de texto puro|
|---|---|
|html|Formato de texto contendo tags HTML|
|pdf|Conteúdo em base64 de um arquivo PDF|
|csv|Conteúdo em base64 de um arquivo CSV|
|rtf|Conteúdo em base64 de um arquivo RTF|
|zip|Conteúdo em base64 de um arquivo ZIP|
|rar|Conteúdo em base64 de um arquivo RAR|
|7z|Conteúdo em base64 de um arquivo 7z|
|json|Conteúdo em base64 de um arquivo JSON|



[TBD-07] - AETipoAtendimento


www.registrodeimoveis.org.br


|Código|Descrição|
|---|---|
|1|Contato|
|2|Agendamento de atendimento|
|3|Institucional|
|4|Intranet|
|5|Formulário Interno Intranet|
|6|WhatsApp|


|7|Ligação|
|---|---|
|8|E-mail|
|9|Help Desk|
|10|LGPD|
|90|Acompanhamento Registral|
|91|Resposta de exigência|



[TBD-08] - AESituacao


|Código|Descrição|
|---|---|
|1|Em aberto|
|2|Confirmado|
|3|Cancelado|
|4|Finalizado|
|5|Reaberto|
|6|Respondido pela Associação|
|7|Respondido pela Serventia|
|8|Respondido pela Equipe de Suporte|
|9|Em análise|
|10|Finalizado pelo Solicitante|
|11|Respondido pelo Solicitante|
|12|Encaminhado|
|13|Respondido pela ValideInfo|
|14|Respondido pela VHL|
|15|Em análise - Programação|
|16|Em análise - Suporte|



www.registrodeimoveis.org.br


|17|Em análise - Pendente com Terceiros|
|---|---|
|18|Respondido pelo Usuário CORI-BR|
|19|Respondido pela ONR|
|20|Respondido por Portal de Assinatura|
|21|Respondido pela Prefácio|
|22|Respondido pela SERVCOM|
|23|Em análise - GIS|



[TBD-09] - AEAtendimentoPrioritario

|Código|Descrição|
|---|---|
|0|Atendimento não prioritario|
|1|Atendimento prioritario|



[TBD-10] - AEFormaAtendimento

|Código|Descrição|
|---|---|
|1|Presencial|
|2|Virtual|



[TBD-11] - AETipoContato


|Código|Descrição|
|---|---|
|1|Associação|
|2|Serventia|
|3|Outros|



www.registrodeimoveis.org.br


[TBD-12] - AEOrigem

|Código|Descrição|
|---|---|
|0|Parte|
|1|Cartório|
|2|Associação|
|3|Suporte|
|4|VHL|
|5|ValideInfo|
|6|ONR|
|7|Portal de Assinatura|
|8|Prefácio|
|9|SERVCOM|
|10|Jurídico|



[TBD-13] - AEAcao

|Código|Descrição|
|---|---|
|0|Informativo / mensagem|
|1|Confirmação de Contato|
|2|Cancelamento de Contato|
|3|Finalização de Contato|
|4|Reabertura de Contato|



[TBD-14] - AEExtensoesArquivos

|Código|Descrição|
|---|---|
|pdf|Conteúdo em base64 de um arquivo PDF|



www.registrodeimoveis.org.br


|csv|Conteúdo em base64|de um arquivo|CSV|
|---|---|---|---|
|rtf|Conteúdo em base64|de um arquivo|RTF|
|zip|Conteúdo em base64|de um arquivo|ZIP|
|rar|Conteúdo em base64|de um arquivo|RAR|
|7z|Conteúdo em base64|de um arquivo|7z|
|json|Conteúdo em base64|de um arquivo|JSON|


www.registrodeimoveis.org.br
