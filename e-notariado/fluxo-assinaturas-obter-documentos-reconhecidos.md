Aqui está a transcrição e estruturação completa do conteúdo do arquivo "obter documentos reconhecidos.pdf" em formato Markdown:

# e-Not Assina - Obter os documentos reconhecidos



*Modificado em Sex, 13 Jan, 2023 na (o) 11:33 AM*

## HISTÓRICO



| Versão | Data da Publicação | Alterações |
| --- | --- | --- |
| v1 | 13/01/2023 | - Primeira versão

 |

---

## ÍNDICE



* Introdução


* Integração por API


* Obter a lista de documentos reconhecidos do e-Not Assina


* Explicação dos campos



---

## Introdução



O e-Not Assina é o módulo que permite aos clientes dos serviços notariais submeterem seus instrumentos particulares na plataforma e-Notariado, assinando digitalmente e essas assinaturas serem reconhecidas pelos tabeliães emissores dos certificados digitais notarizados.

---

## Integração por API



Para obter os documentos do e-Not Assina reconhecidos pelo tabelião, deve-se utilizar as APIs abaixo. Para executar essas APIs, é necessário obter a API-KEY correspondente do cartório.

O Tabelião deverá solicitar a API-KEY do ambiente de produção do Fluxo de Assinaturas do e-Notariado, enviando e-mail para servicos@notariado.org.br.
A equipe do CNB providenciará a chave e responderá em seguida.
A mesma API-KEY deverá ser utilizada para todas as APIs a serem consumidas do Fluxo de Assinaturas.

---

## Obter a lista de documentos reconhecidos do e-Not Assina



`GET [https://assinatura.e-notariado.org.br/api/reports/organizations/:organizationld/e-not-assina-recognitions?StartDateUtc=](https://assinatura.e-notariado.org.br/api/reports/organizations/:organizationld/e-not-assina-recognitions?StartDateUtc=)<data/hora>&EndDateUtc=<data/hora>`

sendo:
`organizationld`: obtido na url do fluxo de assinaturas do determinado cartório

```json
{
  "total": 0,
  "netTotal": 0,
  "cnbFee": 0,
  "items": [
    {
      "orderNumber": "string",
      "notarization Mne": "string",
      "documentName": "string",
      "authorName": "string",
      "authorEmail": "string",
      "authorCpf": "string",
      "signerName": "string",
      "signerCpf": "string",
      "signatureRecognition Date": "2023-01-13T14:08:34.9612",
      "signatureDate": "2023-01-13T14:08:34.961Z",
      "detranUf": "SP",
      "detranStatus": "Uploaded",
      "detranInconsistency": "string",
      "netTotal": 0,
      "total": 0,
      "gatewayFee": 0,
      "cnbFee": 0
    }
  ],
  "totalCount": 0,
  "nextCursor": "string"
}

```

### Exemplo



**Request:**


`GET [https://assinatura.e-notariado.org.br/api/reports/organizations/:organizationId/e-not-assina-recognitions?StartDateUtc=2023-01-01T00:00:00.001Z&EndDateUtc=2023-01-02T00:00:00.001Z](https://assinatura.e-notariado.org.br/api/reports/organizations/:organizationId/e-not-assina-recognitions?StartDateUtc=2023-01-01T00:00:00.001Z&EndDateUtc=2023-01-02T00:00:00.001Z)`

**Response:**

```json
{
  "total": 264.31,
  "netTotal": 255.64,
  "cnbFee": 2.80,
  "items": [
    {
      "orderNumber": "RAE000012320",
      "notarization Mne": "9999992023010108130000060106",
      "documentName": "Primeiras Declarações final",
      "authorName": "FULANO DE TAL",
      "authorEmail": "email@email.com",
      "authorCpf": "99999999999",
      "signerName": "FULANO DE TAL 2",
      "signerCpf": "88888888888",
      "signatureRecognition Date": "2023-01-01T14:04:58.6447356+00:00",
      "signatureDate": "2023-01-01T14:04:38+00:00",
      "detranUf": null,
      "detranStatus": null,
      "detran Inconsistency": null,
      "netTotal": 9.13,
      "total": 9.27,
      "gatewayFee": 0.04,
      "cnbFee": 0.10
    }
  ],
  "totalCount": 28,
  "nextCursor": null
}

```

---

## Explicação dos campos



| Campo | Tipo | Formato |
| --- | --- | --- |
| `total` | Valor total dos pedidos do intervalo de datas informado | value

 |
| `netTotal` | Valor líquido total que o tabelião receberá | value

 |
| `cnbFee` | Valor total pelo uso da plataforma e-Notariado direcionado ao CNB-CF | value

 |
| `orderNumber` | Número do pedido do e-Not Assina RAE...... | string

 |
| `notarization Mne` | Matrícula Notarial Eletrônica | string

 |
| `documentName` | Nome do documento submetido pelo cliente | string

 |
| `authorName` | Nome do orquestrador do fluxo de pagamentos que fez o pagamento | string

 |
| `authorEmail` | e-mail do orquestrador do fluxo | string

 |
| `authorCpf` | CPF do orquestrador | string

 |
| `signerName` | Nome do signatário | string

 |
| `signerCpf` | CPF do signatário | string

 |
| `signatureRecognitionDate` | Data do reconhecimento da assinatura eletrônica pelo tabelião | datetime

 |
| `signatureDate` | Data da assinatura digital pelo signatário | datetime

 |
| `detranUf` | UF da ATPV-e Detran (se aplicável) | string

 |
| `detranStatus` | Status do processamento do Detran | string

 |
| `detranInconsistency` | Motivo da inconsistência da ATPV-e (desativado) | string

 |
| `net Total` | Valor líquido do reconhecimento da assinatura eletrônico que o tabelião receberá | value

 |
| `total` | Valor bruto do reconhecimento da assinatura eletrônico | value

 |
| `gatewayFee` | Valor da despesa de cobrança do Gateway de Pagamentos (Parcela Express) | value

 |
| `cnbFee` | Valor pelo uso da plataforma e-Notariado (CNB) | value

 |
| `totalCount` | Total de reconhecimentos realizados no intervalo de datas informado na API | int

 |
| `nextCursor` | desconsiderar | string

 |