# CNIB

# Explicando o CNIB e a Indisponibilidade de Bens

Aqui está um resumo simplificado sobre esses conceitos, com base nos manuais técnicos fornecidos:

## Indisponibilidade de Bens: O que é e por que existe?

- O que é: É uma restrição jurídica que impede o proprietário de vender, doar ou dar seu patrimônio (como um imóvel) como garantia de dívidas.

- Por que existe: O objetivo é garantir a "efetividade do processo judicial". Isso significa que, se uma pessoa deve dinheiro ou está sendo processada, a justiça bloqueia os bens para evitar que ela os venda "escondido" e fique sem patrimônio para pagar o que deve.

## O impacto no Cartório de Registro de Imóveis

- Fiscalização Diária: O cartório é obrigado a verificar o sistema todos os dias, na abertura e no encerramento do expediente, para checar se há novas ordens de bloqueio.

- Bloqueio de Transferências: Se o cartório localizar um imóvel pertencente a alguém que teve a indisponibilidade decretada, ele deve "responder" no sistema e impedir qualquer tentativa de venda ou transferência dessa propriedade.

- Gestão de Documentos: O cartório precisa anotar essa restrição na matrícula do imóvel (o "histórico" do bem) e pode emitir notas de exigência caso falte alguma informação para efetivar o bloqueio.

## O que é o CNIB?

- Definição: A Central Nacional de Indisponibilidade de Bens é o sistema eletrônico que centraliza e distribui essas ordens de bloqueio para todos os cartórios do Brasil em tempo real.

- Tipos de Bloqueio: O sistema gerencia dois tipos principais de ordens:

    - Indisponibilidade Genérica (IA): Bloqueia qualquer bem que a pessoa possua em todo o país.

    - Indisponibilidade Específica (IE): Foca em um imóvel ou bem exato e determinado.

- Agilidade: Antes, o juiz precisava enviar ofícios em papel para cada cartório; hoje, através da CNIB, uma ordem postada eletronicamente chega instantaneamente a todos os registradores.

# Swagger

[Swagger UI](https://serventia-api.onr.org.br/swagger/index.html)

# Documentação API CNIB 2.0

## POST /api/Operation/testeLogInformationLogError

endpoint

POST /api/Operation/testeLogInformationLogError

lembrete se precisa estar autenticado

Sim (requer token/autenticação)

parameters

Sem parameters definidos.

| campo | tipo de dado | obrigatório | descrição |
| --- | --- | --- | --- |
| - | - | não | - |

resposta retornada (200/201)

```json
{
  "descricao": "Success"
}
```

| campo | tipo de dado | obrigatório | descrição |
| --- | --- | --- | --- |
| descricao | string | não | Descrição do retorno HTTP quando não há schema de resposta. |

## POST /api/documentos/tipos

endpoint

POST /api/documentos/tipos

lembrete se precisa estar autenticado

Sim (requer token/autenticação)

parameters

Sem parameters definidos.

| campo | tipo de dado | obrigatório | descrição |
| --- | --- | --- | --- |
| - | - | não | - |

resposta retornada (200/201)

```json
{
  "identifierRequest": "string",
  "success": false,
  "message": "string",
  "status": 0,
  "data": {
    "id": 0,
    "descricao": "string"
  }
}
```

| campo | tipo de dado | obrigatório | descrição |
| --- | --- | --- | --- |
| identifierRequest | string | não | - |
| success | boolean | não | - |
| message | string | não | - |
| status | integer | não | - |
| data | object | não | - |
| data.id | integer | não | - |
| data.descricao | string | não | - |

## POST /api/ordem/consultar

endpoint

POST /api/ordem/consultar

lembrete se precisa estar autenticado

Sim (requer token/autenticação)

body json

```json
{
  "cpf_usuario": "string",
  "documento": "string",
  "hash": "string"
}
```

| campo | tipo de dado | obrigatório | descrição |
| --- | --- | --- | --- |
| cpf_usuario | string | não | - |
| documento | string | não | - |
| hash | string | não | - |

resposta retornada (200/201)

```json
{
  "identifierRequest": "string",
  "success": false,
  "message": "string",
  "status": 0,
  "data": {
    "documento": "string",
    "nomeRazao": "string",
    "indisponivel": false,
    "qtdOrdens": 0,
    "protocolos": [
      "string"
    ],
    "dados_usuario": {
      "hash": "string",
      "data": "2026-01-01T00:00:00Z",
      "nome": "string",
      "documento": "string",
      "organizacao": "string",
      "filtros": "string"
    }
  }
}
```

| campo | tipo de dado | obrigatório | descrição |
| --- | --- | --- | --- |
| identifierRequest | string | não | - |
| success | boolean | não | - |
| message | string | não | - |
| status | integer | não | - |
| data | object | não | - |
| data.documento | string | não | - |
| data.nomeRazao | string | não | - |
| data.indisponivel | boolean | não | - |
| data.qtdOrdens | integer | não | - |
| data.protocolos | array&lt;string&gt; | não | - |
| data.dados_usuario | object | não | - |
| data.dados_usuario.hash | string | não | - |
| data.dados_usuario.data | string | não | - |
| data.dados_usuario.nome | string | não | - |
| data.dados_usuario.documento | string | não | - |
| data.dados_usuario.organizacao | string | não | - |
| data.dados_usuario.filtros | string | não | - |

## POST /api/ordem/responder

endpoint

POST /api/ordem/responder

lembrete se precisa estar autenticado

Sim (requer token/autenticação)

body json

```json
{
  "cpf_usuario": "string",
  "protocolo": "string",
  "tipo_matricula": 0,
  "cpf_cnpj": "string",
  "numero_matricula": "string",
  "numero_inscricao": "string",
  "bens_detalhe": "string",
  "bens_parte_cpf_cnpj": "string",
  "bens_parte_nome_razao": "string"
}
```

| campo | tipo de dado | obrigatório | descrição |
| --- | --- | --- | --- |
| cpf_usuario | string | não | - |
| protocolo | string | não | - |
| tipo_matricula | integer | não | - |
| cpf_cnpj | string | não | - |
| numero_matricula | string | não | - |
| numero_inscricao | string | não | - |
| bens_detalhe | string | não | - |
| bens_parte_cpf_cnpj | string | não | - |
| bens_parte_nome_razao | string | não | - |

resposta retornada (200/201)

```json
{
  "identifierRequest": "string",
  "success": false,
  "message": "string",
  "status": 0,
  "data": "string"
}
```

| campo | tipo de dado | obrigatório | descrição |
| --- | --- | --- | --- |
| identifierRequest | string | não | - |
| success | boolean | não | - |
| message | string | não | - |
| status | integer | não | - |
| data | string | não | - |

## POST /api/ordem/responder/lista

endpoint

POST /api/ordem/responder/lista

lembrete se precisa estar autenticado

Sim (requer token/autenticação)

body json

```json
{
  "cpf_usuario": "string",
  "bens": [
    {
      "protocolo": "string",
      "tipo_matricula": 0,
      "cpf_cnpj": "string",
      "numero_matricula": "string",
      "numero_inscricao": "string",
      "bens_detalhe": "string",
      "bens_parte_cpf_cnpj": "string",
      "bens_parte_nome_razao": "string"
    }
  ]
}
```

| campo | tipo de dado | obrigatório | descrição |
| --- | --- | --- | --- |
| cpf_usuario | string | não |  |
| bens | array&lt;object&gt; | não |  |
| bens[].protocolo | string | não |  |
| bens[].tipo_matricula | integer | não |  |
| bens[].cpf_cnpj | string | não |  |
| bens[].numero_matricula | string | não |  |
| bens[].numero_inscricao | string | não |  |
| bens[].bens_detalhe | string | não |  |
| bens[].bens_parte_cpf_cnpj | string | não |  |
| bens[].bens_parte_nome_razao | string | não |  |

resposta retornada (200/201)

```json
{
  "identifierRequest": "string",
  "success": false,
  "message": "string",
  "status": 0,
  "data": {}
}
```

| campo | tipo de dado | obrigatório | descrição |
| --- | --- | --- | --- |
| identifierRequest | string | não | - |
| success | boolean | não | - |
| message | string | não | - |
| status | integer | não | - |
| data | object | não | - |

## POST /api/ordem/visualizar

endpoint

POST /api/ordem/visualizar

lembrete se precisa estar autenticado

Sim (requer token/autenticação)

body json

```json
{
  "cpf_usuario": "string",
  "ordens_visualizadas": false,
  "protocol": "string",
  "data_inicial": "string",
  "data_final": "string"
}
```

| campo | tipo de dado | obrigatório | descrição |
| --- | --- | --- | --- |
| cpf_usuario | string | sim | - |
| ordens_visualizadas | boolean | não | - |
| protocol | string | não | - |
| data_inicial | string | não | - |
| data_final | string | não | - |

resposta retornada (200/201)

```json
{
  "identifierRequest": "string",
  "success": false,
  "message": "string",
  "status": 0,
  "data": {
    "ordens": [
      {
        "protocoloindisponibilidade": "string",
        "status": "string",
        "datapedido": "2026-01-01T00:00:00Z",
        "numeroprocesso": "string",
        "telefone": "string",
        "nomeinstituicao": "string",
        "forumvara": "string",
        "usuario": "string",
        "email": "string",
        "ordemstatus": "string",
        "partes": [
          {
            "cpfcnpj": "string",
            "nomerazao": "string",
            "matricula": [
              {
                "tipomatricula": 0,
                "matricula": "string",
                "cpfcnpjbens": "string",
                "infoadicionalbens": "string",
                "comrestricao": false
              }
            ]
          }
        ]
      }
    ],
    "totalordensrestantes": 0
  }
}
```

| campo | tipo de dado | obrigatório | descrição |
| --- | --- | --- | --- |
| identifierRequest | string | não | - |
| success | boolean | não | - |
| message | string | não | - |
| status | integer | não | - |
| data | object | não | - |
| data.ordens | array&lt;object&gt; | não | - |
| data.ordens[].protocoloindisponibilidade | string | não | - |
| data.ordens[].status | string | não | - |
| data.ordens[].datapedido | string | não | - |
| data.ordens[].numeroprocesso | string | não | - |
| data.ordens[].telefone | string | não | - |
| data.ordens[].nomeinstituicao | string | não | - |
| data.ordens[].forumvara | string | não | - |
| data.ordens[].usuario | string | não | - |
| data.ordens[].email | string | não | - |
| data.ordens[].ordemstatus | string | não | - |
| data.ordens[].partes | array&lt;object&gt; | não | - |
| data.ordens[].partes[].cpfcnpj | string | não | - |
| data.ordens[].partes[].nomerazao | string | não | - |
| data.ordens[].partes[].matricula | array&lt;object&gt; | não | - |
| data.ordens[].partes[].matricula[].tipomatricula | integer | não | - |
| data.ordens[].partes[].matricula[].matricula | string | não | - |
| data.ordens[].partes[].matricula[].cpfcnpjbens | string | não | - |
| data.ordens[].partes[].matricula[].infoadicionalbens | string | não | - |
| data.ordens[].partes[].matricula[].comrestricao | boolean | não | - |
| data.totalordensrestantes | integer | não | - |

## POST /api/v2/ordem/visualizar

endpoint

POST /api/v2/ordem/visualizar

lembrete se precisa estar autenticado

Sim (requer token/autenticação)

body json

```json
{
  "cpf_usuario": "string",
  "ordens_visualizadas": false,
  "protocol": "string",
  "data_inicial": "string",
  "data_final": "string",
  "pagina_inicial": 0,
  "tamanho_pagina": 0,
  "proxima_pagina": false
}
```

| campo | tipo de dado | obrigatório | descrição |
| --- | --- | --- | --- |
| cpf_usuario | string | sim | - |
| ordens_visualizadas | boolean | não | - |
| protocol | string | não | - |
| data_inicial | string | não | - |
| data_final | string | não | - |
| pagina_inicial | integer | sim | - |
| tamanho_pagina | integer | sim | - |
| proxima_pagina | boolean | sim | - |

resposta retornada (200/201)

```json
{
  "identifierRequest": "string",
  "success": false,
  "message": "string",
  "status": 0,
  "data": {
    "ordens": [
      {
        "mappedProperties": {},
        "id": 0,
        "orderCode": 0,
        "relOrderToOrderStatusCode": 0,
        "protocol": "string",
        "cancellationProtocol": "string",
        "processNumber": "string",
        "processName": "string",
        "organizationLabelComplete": "string",
        "processNumberType": false,
        "cancellationType": 0,
        "orderStatusCode": 0,
        "orderStatusLabel": "string",
        "organizationHierarchyCode": 0,
        "organizationLabel": "string",
        "organizationHierarchyName": "string",
        "createdOn": "2026-01-01T00:00:00Z",
        "cancellationCreatedOn": "2026-01-01T00:00:00Z",
        "orderApprovedName": "string",
        "email": "string",
        "phone": "string",
        "parties": [
          {
            "mappedProperties": {},
            "relOrderPersonNameCode": 0,
            "relOrderStatusCode": 0,
            "orderCode": 0,
            "documentNumber": "string",
            "personName": "string",
            "orderStatusCode": 0,
            "flatTableOrderCode": 0,
            "properties": [
              {
                "mappedProperties": {},
                "relOrderPersonNameCode": 0,
                "relOrderStatusCode": 0,
                "documentNumber": "string",
                "documentTypeCode": 0,
                "restrictionStatusCode": 0,
                "cpF_CNPJ": "string",
                "details": "string",
                "identification": "string"
              }
            ]
          }
        ],
        "ordersOrigin": [
          {
            "mappedProperties": {},
            "orderCode": 0,
            "protocol": "string",
            "createdOn": "2026-01-01T00:00:00Z",
            "isPriorityOrder": false
          }
        ],
        "visualized": false,
        "isPriorityOrder": false,
        "isSecretJustice": false
      }
    ],
    "paginação": {
      "mappedProperties": {},
      "pageSize": 0,
      "totalRows": 0,
      "totalPages": 0,
      "pageIndex": 0,
      "firstID": 0,
      "lastID": 0,
      "pageForward": false,
      "totalRowsShowUser": 0
    }
  }
}
```

| campo | tipo de dado | obrigatório | descrição |
| --- | --- | --- | --- |
| identifierRequest | string | não | - |
| success | boolean | não | - |
| message | string | não | - |
| status | integer | não | - |
| data | object | não | - |
| data.ordens | array&lt;object&gt; | não | - |
| data.ordens[].mappedProperties | object | não | - |
| data.ordens[].id | integer | não | - |
| data.ordens[].orderCode | integer | não | - |
| data.ordens[].relOrderToOrderStatusCode | integer | não | - |
| data.ordens[].protocol | string | não | - |
| data.ordens[].cancellationProtocol | string | não | - |
| data.ordens[].processNumber | string | não | - |
| data.ordens[].processName | string | não | - |
| data.ordens[].organizationLabelComplete | string | não | - |
| data.ordens[].processNumberType | boolean | não | - |
| data.ordens[].cancellationType | integer | não | - |
| data.ordens[].orderStatusCode | integer | não | - |
| data.ordens[].orderStatusLabel | string | não | - |
| data.ordens[].organizationHierarchyCode | integer | não | - |
| data.ordens[].organizationLabel | string | não | - |
| data.ordens[].organizationHierarchyName | string | não | - |
| data.ordens[].createdOn | string | não | - |
| data.ordens[].cancellationCreatedOn | string | não | - |
| data.ordens[].orderApprovedName | string | não | - |
| data.ordens[].email | string | não | - |
| data.ordens[].phone | string | não | - |
| data.ordens[].parties | array&lt;object&gt; | não | - |
| data.ordens[].parties[].mappedProperties | object | não | - |
| data.ordens[].parties[].relOrderPersonNameCode | integer | não | - |
| data.ordens[].parties[].relOrderStatusCode | integer | não | - |
| data.ordens[].parties[].orderCode | integer | não | - |
| data.ordens[].parties[].documentNumber | string | não | - |
| data.ordens[].parties[].personName | string | não | - |
| data.ordens[].parties[].orderStatusCode | integer | não | - |
| data.ordens[].parties[].flatTableOrderCode | integer | não | - |
| data.ordens[].parties[].properties | array&lt;object&gt; | não | - |
| data.ordens[].parties[].properties[].mappedProperties | object | não | - |
| data.ordens[].parties[].properties[].relOrderPersonNameCode | integer | não | - |
| data.ordens[].parties[].properties[].relOrderStatusCode | integer | não | - |
| data.ordens[].parties[].properties[].documentNumber | string | não | - |
| data.ordens[].parties[].properties[].documentTypeCode | integer | não | - |
| data.ordens[].parties[].properties[].restrictionStatusCode | integer | não | - |
| data.ordens[].parties[].properties[].cpF_CNPJ | string | não | - |
| data.ordens[].parties[].properties[].details | string | não | - |
| data.ordens[].parties[].properties[].identification | string | não | - |
| data.ordens[].ordersOrigin | array&lt;object&gt; | não | - |
| data.ordens[].ordersOrigin[].mappedProperties | object | não | - |
| data.ordens[].ordersOrigin[].orderCode | integer | não | - |
| data.ordens[].ordersOrigin[].protocol | string | não | - |
| data.ordens[].ordersOrigin[].createdOn | string | não | - |
| data.ordens[].ordersOrigin[].isPriorityOrder | boolean | não | - |
| data.ordens[].visualized | boolean | não | - |
| data.ordens[].isPriorityOrder | boolean | não | - |
| data.ordens[].isSecretJustice | boolean | não | - |
| data.paginação | object | não | - |
| data.paginação.mappedProperties | object | não | - |
| data.paginação.pageSize | integer | não | - |
| data.paginação.totalRows | integer | não | - |
| data.paginação.totalPages | integer | não | - |
| data.paginação.pageIndex | integer | não | - |
| data.paginação.firstID | integer | não | - |
| data.paginação.lastID | integer | não | - |
| data.paginação.pageForward | boolean | não | - |
| data.paginação.totalRowsShowUser | integer | não | - |
