10/01/2025, 15:39 Integração Externa - Serventias Extrajudiciais - Overview
# **Integração Externa - Serventias Extrajudiciais**

Last updated by | Fernando gomes | 10 de jan. de 2025 at 10:08 BRT

## **Introdução da documentação API serventias**

Esta documentação tem como objetivo detalhar a interação para Serventias de Registros de Imóveis,
Registros Civis e Tabeliães de Notas que desejarem realizar a integração automatizada através de API com a
Central Nacional de Indisponibilidade de Bens 2.0 (CNIB2.0) através de chamadas REST

### **Versão do documento: 1.0**


**Ambientes:**

Desenvolvimento | URI: `https://stg-serventia-api.onr.org.br`

Produção | URI: `https://serventia-api.onr.org.br`


**Endpoints:**

As endpoints da API serão apresentadas e detalhadas neste documento, com as seguintes especificações:


URL

Versão da Endpoint

Status da Endpoint

Tipos de requisições da verbologia REST

Formato dos dados

Atores de interação

Tipagem dos dados

Descrição e detalhamento dos campos

Obrigatoriedade dos campos


**1. Endpoint de autenticação**

URL: `https://auth.id.onr.org.br/connect/token`

Versão da endpoint: `1.0`

Status da endpoint: `Ativa`

Tipo de requisição: `POST`

Formato dos dados: `application/json`

Atores: `Registros de Imóveis`, `Registros Civis`, `Tabeliães de Notas`


https://dev.azure.com/ONR-SAEC/ONR-CNIB/_wiki/wikis/ONR-CNIB/808/Integração-Externa-Serventias-Extrajudiciais 1/14


10/01/2025, 15:39 Integração Externa - Serventias Extrajudiciais - Overview

**Objetivos da endpoint**

```
     Autenticar cliente a API

```

**Descrição e detalhamento dos campos do payload:**


Para realizar a emissão das credenciais de acesso da serventia, acessar o manual da serventia e localizar o
tópico “Usuários – Acesso API”.


A credencial de acesso de produção é diferente da credencial de STG. As credenciais podem ser emitidas
utilizando os ambientes abaixo:


Para emitir a credencial do ambiente STG, acesse: [https://stg-indisponibilidade.onr.org.br](https://stg-indisponibilidade.onr.org.br/) . Menu
Usuário, Acesso API.

Para emitir a credencial do ambiente de produção, acesse: [https://indisponibilidade.onr.org.br](https://indisponibilidade.onr.org.br/) . Menu
Usuário, Acesso API.


`grant_type:` Parâmetro obrigatório e com valor fixo -> client_credentials

`client_id:` Id de cliente por serventia, gerado a partir da interface gráfica. Consultar manual do usuário para
a geração.

`client_secret:` Chave única por serventia, gerada a partir da interface gráfica. Consultar manual do usuário
para a geração.

`scope:` Paramentro obrigatório e com valor fixo -> cnib-serventia-api


Para gerar o client_secret e client_id acessar `https://stg-cnib.onr.org.br`, se logar com certificado digital
ICP-Brasil e-CPF A3, clicar no menu superior em Usuários, Acesso via API e em seguida em gerar chaves.


**Obrigatoriedade dos campos:**

```
     grant_type

     client_id

     client_secret

     scope

```

**Obervação:** Obtido o access token, o mesmo deve ser encaminhado no cabeçalho de todas requisições das
demais endpoints. Exemplo: Authorization: Bearer + token


**Exemplo para interações usando o Postman:**


https://dev.azure.com/ONR-SAEC/ONR-CNIB/_wiki/wikis/ONR-CNIB/808/Integração-Externa-Serventias-Extrajudiciais 2/14


10/01/2025, 15:39 Integração Externa - Serventias Extrajudiciais - Overview


https://dev.azure.com/ONR-SAEC/ONR-CNIB/_wiki/wikis/ONR-CNIB/808/Integração-Externa-Serventias-Extrajudiciais 3/14


10/01/2025, 15:39 Integração Externa - Serventias Extrajudiciais - Overview

**Exemplo do payload:**

```
  {
  "grant_type": "string",
  "client_id": "string",
  "client_secret": "string",
  "scope": "string"
  }

```

**Exemplo de response (200 OK)**

```
  {
  "access_token": token,
  }

```

**Exemplo de response (400 Bad Request)**

```
  {

  "error": "invalid_request"

  }

```

**2. Endpoint consultar por documento**

URL: `/api/ordem/consultar`

Versão da endpoint: `1.0`

Status da endpoint: `Ativa`

Tipo de requisição: `POST`

Atores: `Registros de Imóveis`, `Registros Civis`, `Tabeliães de Notas`


**Objetivos da endpoint:**

```
     Busca de situação de parte por número de documento (CPF/CNPJ)

     Busca de pesquisa realizada através de HASH.

```

**Descricção e detalhamento dos campos do payload:**


1. cpf_usuario: Documento do titular ou preposto da serventia cadastrado na Central Nacional de

Indisponibilidade de Bens.

2. documento: CPF/CNPJ da parte a ser pesquisada.

3. hash: Número de HASH gerado em pesquisa realizada anteriormente.


**Obrigatoriedade dos campos:**

```
     cpf_usuario

     documento

     hash
```

**Documento ou hash deverão estar presentes**













https://dev.azure.com/ONR-SAEC/ONR-CNIB/_wiki/wikis/ONR-CNIB/808/Integração-Externa-Serventias-Extrajudiciais 4/14


10/01/2025, 15:39 Integração Externa - Serventias Extrajudiciais - Overview

**Exemplo do payload:**

```
  {
  "cpf_usuario": "string",
  "documento": "string",
  "hash": "string"
  }

```

**Exemplo de response (200 OK)**

```
  {
  "success": true,
  "message": "string",
  "status": 0,
  "data": {
  "documento": "string",
  "nomeRazao": "string",
  "indisponivel": true,
  "qtdOrdens": 0,
  "protocolos": [
     "string"
  ],
  "dados_usuario": {
  "hash": "string",
  "data": "2024-06-24T17:43:25.193Z",
  "nome": "string",
  "documento": "string",
  "organizacao": "string",
  "filtros": "string"
  }
  }
  }

```

**Exemplo de response (400 Bad Request)**

```
  {
  "success": false,
  "message": "Requisição inválida",
  "status": 400,
  "notifications": [
  {
  "title": "Campo obrigatório não fornecido",
  "reason": "O campo 'cpf_usuario' é obrigatório."
  }
  ]
  }

```

**3. Endpoint visualizar ordens**

URL: `/api/ordem/visualizar`

Versão da endpoint: `1.0`

Status da endpoint: `Ativa`

Tipo de requisição: `POST`

Formato dos dados: `application/json`

Atores: `Registros de Imóveis`













https://dev.azure.com/ONR-SAEC/ONR-CNIB/_wiki/wikis/ONR-CNIB/808/Integração-Externa-Serventias-Extrajudiciais 5/14


10/01/2025, 15:39 Integração Externa - Serventias Extrajudiciais - Overview

**Objetivos da endpoint:**

```
     Visualizar ordem através do número do protocolo

     Visualizar lote de ordens através de range de datas

     Entregar ao cliente requisitante o total de ordens ainda não visualizadas pela serventia

     Detalhamento de cada ordem retornada no Response

```

**Descricção e detalhamento dos campos do payload:**


1. cpf_usuario: Documento do titular ou preposto da serventia cadastrado na Central Nacional de

Indisponibilidade de Bens.

2. ordens_visualizadas: Campo boleano que se enviado sim, exibirá ordens já marcadas como vistas pela

serventia requisitante, caso enviado não retornará caso haja somente ordens ainda não visualizadas
pela serventia requisitante.

3. protocol: Caso informado, retornará o detalhamento do protocolo informado.

4. data_inicial: Formato `dd-mm-aaaa`

5. data_final: Formato `dd-mm-aaaa`

**Observação:** Caso utilizados o intervalo `data_inicial` e `data_final`, o range deve ser de no máximo 30
dias.


**Obrigatoriedade dos campos:**

```
     cpf_usuario

     ordens_visualizadas

     protocol

     data_inicial

     data_final

```

Para consultar as novas ordens de indisponibilidade genéricas criadas pelo Poder Judiciário utilize o
seguinte payload:


**Exemplo do payload:**


```
{
"cpf_usuario": "string",
"ordens_visualizadas": false
}

```






A quantidade máxima de registros entregues neste endpoint é de 1000 registros.
No final da requisição é exibida a quantidade de registros que ainda não foram visualizados
(totalordensrestantes), se uma nova requisição for realizada, uma nova requisição contendo as próximas
1000 ordens serão entregues e o totalizador das ordens será decrementado em 1000. Para obter todas
as ordens não visualizadas, basta repetir esta operação até que o contador de ordens restantes
apresente o valor zero. Desta forma a serventia terá obtido todas as ordens e cancelamentos de
indisponibilidades genérica.


https://dev.azure.com/ONR-SAEC/ONR-CNIB/_wiki/wikis/ONR-CNIB/808/Integração-Externa-Serventias-Extrajudiciais 6/14


10/01/2025, 15:39 Integração Externa - Serventias Extrajudiciais - Overview

**Exemplo de response indisponibilidade genérica (IA) (200 OK) quando houver ordens a serem**
**entregues**

```
  {

  "data": {
  "ordens": {
  "totalordens": 1000,
  "orders": [{
  "status": "INDISPONIBILIDADE",
  "protocoloindisponibilidade": "String",
  "numeroprocesso": "String",
  "usuario": "String",
  "ordemstatus": "String",
  "nomeinstituicao": "String",
  "forumvara": "String",
  "email": "String",
  "telefone": "String",
  "datapedido": Datetime",
  "partes": [{
  "cpfcnpj": "String",
  "nomerazao": "String",
  "matricula": []
  }],
  "totalordens": int }]
  },
  "totalordens": int,
  "totalordensrestantes": int
  },

  "identifierRequest": uuid,
  "success": boolean,
  "message": "String",
  "status": 200
  }

```

**Exemplo de response indisponibilidade genérica (IA) (200 OK) quando não houver ordens a serem**
**entregues**

```
  {
  "data": "Não há ordens para os critérios informados.",
  "identifierRequest": "string",
  "success": true,
  "message": "Sucesso!",
  "status": 200
  }

```

Para consultar uma ordem já visualizada a partir do número do protocolo utilize o seguinte payload:

```
  {
  "cpf_usuario": "string",
  "ordens_visualizadas": true,
  "protocol": "string"
  }

```

**Exemplo de response cancelamento total (TA) e cancelamento pessoa(PA) (200 OK)**













https://dev.azure.com/ONR-SAEC/ONR-CNIB/_wiki/wikis/ONR-CNIB/808/Integração-Externa-Serventias-Extrajudiciais 7/14


10/01/2025, 15:39 Integração Externa - Serventias Extrajudiciais - Overview

```
  {
  "status": "string",
  "cancelamentodeindisponibilidade": "string",
  "cancelamentotipo": 0,
  "cancelamentodata": "2024-09-19T12:02:27.164Z",
  "protocoloindisponibilidade": "string",
  "numeroprocesso": "string",
  "usuario": "string",
  "ordemstatus": "string",
  "forumvara": "string",
  "nomeinstituicao": "string",
  "email": "string",
  "telefone": "string",
  "datapedido": "2024-09-19T12:02:27.164Z",
  "partes": [
  {
  "cpfcnpj": "string",
  "nomerazao": "string",
  "matricula": []
  }
  ]
  }

```

**Exemplo de response cancelamento matr;icula (MA) e cancelamento ouros bens(BA) genérica (200**
**OK)**

```
  {
  "status": "string",
  "cancelamentodeindisponibilidade": "string",
  "cancelamentotipo": 0,
  "cancelamentodata": "2024-09-19T12:02:27.164Z",
  "protocoloindisponibilidade": "string",
  "numeroprocesso": "string",
  "usuario": "string",
  "ordemstatus": "string",
  "forumvara": "string",
  "nomeinstituicao": "string",
  "email": "string",
  "telefone": "string",
  "datapedido": "2024-09-19T12:02:27.164Z",
  "partes": [
  {
  "cpfcnpj": "string",
  "nomerazao": "string",
  "matricula": [
  {
  "matricula": "string",
  "cpfcnpjbens": "string",
  "infoadicionalbens": "string",
  "tipomatricula": 0,
  "comrestricao": false
  }
  ]
  }
  ]
  }

```

**Exemplo de response (400 Bad Request)**










https://dev.azure.com/ONR-SAEC/ONR-CNIB/_wiki/wikis/ONR-CNIB/808/Integração-Externa-Serventias-Extrajudiciais 8/14


10/01/2025, 15:39 Integração Externa - Serventias Extrajudiciais - Overview

```
  {
  "success": true,
  "message": "string",
  "status": 0,
  "notifications": [
  {
  "title": "string",
  "reason": "string"
  }
  ]

```






https://dev.azure.com/ONR-SAEC/ONR-CNIB/_wiki/wikis/ONR-CNIB/808/Integração-Externa-Serventias-Extrajudiciais 9/14


10/01/2025, 15:39 Integração Externa - Serventias Extrajudiciais - Overview


**4. Endpoint responder ordem**

URL: `/api/ordem/responder`

Versão da endpoint: `1.0`

Status da endpoint: `Ativa`

Tipo de requisição: `POST`

Formato dos dados: `application/json`

Atores: `Registros de Imóveis`


**Objetivos da endpoint:**

```
     Responder Ordem de Indisponibilidade através do Protocolo

```

**Descricção e detalhamento dos campos do payload:**


1. cpf_usuario: Documento do titular ou preposto da serventia cadastrado na Central Nacional de

Indisponibilidade de Bens.

2. protocolo: Número do protocolo da ordem a ser respondida.

3. tipo_matricula: Tipo de documento, o campo espera um valor do tipo `INT` . Consultar o `ITEM 5` deste

documento, onde disponibilizamos a tabela de tipos de bens e seus respectivos IDs.

4. cpf_cnpj: Formato Documento da parte indisponibilizada.

5. numero_matricula: Número da matrícula, inscrição, transcrição e etc.. da parte indisponibilizada na

serventia.

6. numero_inscricao: Número da Inscrição

7. bens_detalhes: Detalhe do bem.

8. bens_parte_cpf_cnpj:

9. bens_parte_nome_razao:


**Obrigatoriedade dos campos:**

```
     cpf_usuario

     protocolo

     tipo_matricula

     cpf_cnpj
```

`numero_matricula` | `obrigatório se tipo_matricula for: 22, 24, 25 ou 27.`

`numero_inscricao` | `obrigatório se tipo_matricula for: 24.`

`bens_detalhes` | `obrigatório se tipo_matricula for: 26.`

`bens_parte_cpf_cnpj` | `obrigatório se tipo_matricula for: 26.`

`bens_parte_nome_razao` | `obrigatório se tipo_matricula for: 26.`


https://dev.azure.com/ONR-SAEC/ONR-CNIB/_wiki/wikis/ONR-CNIB/808/Integração-Externa-Serventias-Extrajudiciais 10/14


10/01/2025, 15:39 Integração Externa - Serventias Extrajudiciais - Overview

**Exemplo de payload:**

```
  {
  "cpf_usuario": "string",
  "protocolo": "string",
  "tipo_matricula": int,
  "cpf_cnpj": "string",
  "numero_matricula": "string",
  "numero_inscricao": "string",
  "bens_detalhe": "string",
  "bens_parte_cpf_cnpj": "string",
  "bens_parte_nome_razao": "string"
  }

```

**Exemplo de response (200 OK)**

```
  {
  "success": true,
  "message": "string",
  "status": 0,
  "data": "string"
  }

```

**Exemplo de response (400 Bad Request)**

```
  {
  "success": true,
  "message": "string",
  "status": 0,
  "notifications": [
  {
  "title": "string",
  "reason": "string"
  }
  ]
  }

```

**5. Enpoint responder lista**

URL: `/api/ordem/responder/lista`

Versão da endpoint: `1.0`

Status da endpoint: `Ativa`

Tipo de requisição: `POST`

Formato dos dados: `application/json`

Atores: `Registros de Imóveis`


**Objetivos da endpoint:**

```
     Responder uma lista de Ordens de Indisponibilidades através do Protocolo

```












https://dev.azure.com/ONR-SAEC/ONR-CNIB/_wiki/wikis/ONR-CNIB/808/Integração-Externa-Serventias-Extrajudiciais 11/14


10/01/2025, 15:39 Integração Externa - Serventias Extrajudiciais - Overview

**Descricção e detalhamento dos campos do payload:**


1. cpf_usuario: Documento do titular ou preposto da serventia cadastrado na Central Nacional de

Indisponibilidade de Bens.

2. protocolo: Número do protocolo da ordem a ser respondida.

3. tipo_matricula: Tipo de documento, o campo espera um valor do tipo `INT` . Consultar o `ITEM 5` deste

documento, onde disponibilizamos a tabela de tipos de bens e seus respectivos IDs.

4. cpf_cnpj: Formato Documento da parte indisponibilizada.

5. numero_matricula: Número da matrícula, inscrição, transcrição e etc.. da parte indisponibilizada na

serventia.

6. numero_inscricao: Número da Inscrição

7. bens_detalhes: Detalhe do bem.

8. bens_parte_cpf_cnpj:

9. bens_parte_nome_razao:


**Obrigatoriedade dos campos:**

```
     cpf_usuario

     protocolo

     tipo_matricula

     cpf_cnpj
```

`numero_matricula` | `obrigatório se tipo_matricula for: 22, 24, 25 ou 27.`

`numero_inscricao` | `obrigatório se tipo_matricula for: 24.`

`bens_detalhes` | `obrigatório se tipo_matricula for: 26.`

`bens_parte_cpf_cnpj` | `obrigatório se tipo_matricula for: 26.`

`bens_parte_nome_razao` | `obrigatório se tipo_matricula for: 26.`


**Exemplo de payload:**


```
 {
 "cpf_usuario": "string",
 "bens": [
 {
 "protocolo": "string",
 "tipo_matricula": int,
 "cpf_cnpj": "string",
 "numero_matricula": "string",
 "numero_inscricao": "string",
 "bens_detalhe": "string",
 "bens_parte_cpf_cnpj": "string",
 "bens_parte_nome_razao": "string"
 }
 ]

```

**Exemplo de response (200 OK)**

```
 {
 "success": true,
 "message": "string",
 "status": 0,
 "data": "string"
 }

```









https://dev.azure.com/ONR-SAEC/ONR-CNIB/_wiki/wikis/ONR-CNIB/808/Integração-Externa-Serventias-Extrajudiciais 12/14


10/01/2025, 15:39 Integração Externa - Serventias Extrajudiciais - Overview


https://dev.azure.com/ONR-SAEC/ONR-CNIB/_wiki/wikis/ONR-CNIB/808/Integração-Externa-Serventias-Extrajudiciais 13/14


10/01/2025, 15:39 Integração Externa - Serventias Extrajudiciais - Overview

**Exemplo de response (400 Bad Request)**

```
  {
  "success": true,
  "message": "string",
  "status": 0,
  "notifications": [
  {
  "title": "string",
  "reason": "string"
  }
  ]
  }

```

**6. Tabela tipos documentos:**

A lista a seguir exibe como material de apoio para interação nas _**Endpoints**_ `/api/ordem/responder/` e

`/api/ordem/responder/lista`, com os IDs para os tipos de bens bloqueados a serem _**imputados**_ no campo

`tipo_matricula` :






|Id|Descrição|
|---|---|
|22|matrícula|
|24|inscrição|
|25|transcrição|
|26|bens|
|27|ficha complementar|



https://dev.azure.com/ONR-SAEC/ONR-CNIB/_wiki/wikis/ONR-CNIB/808/Integração-Externa-Serventias-Extrajudiciais 14/14
