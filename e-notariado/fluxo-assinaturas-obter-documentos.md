Aqui está a transcrição e estruturação completa do conteúdo do arquivo "obter os detalhes da versão assinada dos documentos" em formato Markdown:

# Fluxo de Assinaturas - Obter os detalhes e versão assinada dos documentos



*Modificado em Qui, 6 Nov, 2025 na (o) 5:13 PM*

## HISTÓRICO



| Versão | Data da Publicação | Alterações |
| --- | --- | --- |
| v1 | 14/03/2023 | - Primeira versão

 |
| v1.1 | 20/06/2024 | Inclusão dos tipos de documento da AEDO - Autorização Eletrônica de Doação de Órgãos

 |
| v1.2 | 16/11/2024 | Alterações na documentação para explicar como obter o traslado assinado.

 |
| v1.3 | 06/11/2025 | Inclusão do endpoint para baixar a versão assinada dos documentos do fluxo de assinaturas, exceto o traslado de ato eletrônico

 |

---

## ÍNDICE



* Introdução


* Integração por API


* Etapa 1 - Obter a lista dos atos do cartório


* Etapa 2 - Obter os detalhes do documento e a versão assinada do traslado de ato eletrônico


* Etapa 3 - Baixar a versão assinada do documento



---

## Introdução



O Fluxo de Assinaturas é o módulo da plataforma e-Notariado para a orquestração dos atos notariais eletrônicos.

---

## Integração por API



Para obter os detalhes dos documentos submetidos no fluxo de assinaturas e as versões assinadas correspondentes, a plataforma e-Notariado disponibiliza algumas APIs para essa finalidade.

Para executar as APIs, é necessário obter a API-KEY correspondente do cartório.
O Tabelião deverá gerar a chave da API do Fluxo de Assinaturas, seguindo os passos desse link AQUI.
A mesma API-KEY deverá ser utilizada para todas as APIs a serem consumidas do Fluxo de Assinaturas.

**Postman Authorization**

* **Type:** API Key


* **Key:** X-Api-Key


* **Value:** `<informar a API-KEY obtida com o CNB>`

* **url:** [https://assinatura.e-notariado.org.br](https://assinatura.e-notariado.org.br)


---

## Etapa 1 - Obter a lista dos atos do cartório



`GET [https://assinatura.e-notariado.org.br/api/documents](https://assinatura.e-notariado.org.br/api/documents)`

**Parâmetros:**

| Parâmetro | Descrição | Conteúdo |
| --- | --- | --- |
| `IsConcluded` | Indicativo de fluxo concluído | true, false

 |
| `IsCanceled` | Indicativo de fluxo cancelado | true, false

 |
| `Document Type` | Tipo do documento | "Deed" - Escritura <br>

<br> "PowerOfAttorney" - Procuração <br>

<br> "Testament" - Testamentos <br>

<br> "Notarial Minutes" - Ata Notarial <br>

<br> "TranscriptForPhysicalActs" - Traslado de ato físico <br>

<br> "Acknowledgement For PhysicalActs" - Certidão de ato físico <br>

<br> "Acknowledgment ForDigitalActs" - Certidão de ato eletrônico <br>

<br> "Private Document" e-Not Assina <br>

<br> "TravelPermit" - AEV <br>

<br> "SignatureNotarization Term" - Termo do Reconhecimento de Firma por Autenticidade (TEC) <br>

<br> "EnotAuto" - ATPV-e <br>

<br> "Organ DonationPermit" - AEDO emissão <br>

<br> "Organ Donation Permit Revocation" - AEDO revogação

 |
| `Limit` | Quantidade de resultados por execução | Ex.: 10

 |
| `Offset` | Offset do resultado | Ex.: 0

 |
| `Order` | Ordem do resultado | "asc" - ascedente <br>

<br> "desc" - descendente

 |

**Exemplo:**


`[https://assinatura.e-notariado.org.br/api/documents?IsConcluded=true&DocumentType=Deedt&Offset=0&order=desc&Limit=100](https://assinatura.e-notariado.org.br/api/documents?IsConcluded=true&DocumentType=Deedt&Offset=0&order=desc&Limit=100)`

---

## Etapa 2 - Obter os detalhes do documento e a versão assinada do traslado de ato eletrônico



`GET [https://assinatura.e-notariado.org.br/api/documents/](https://assinatura.e-notariado.org.br/api/documents/){id}`

sendo,
`{id}` - obtido no resultado da API da etapa 1

Neste endpoint é possível baixar o traslado assinado digitalmente, concatenando a url com o link apresentado em `files / location`.

---

## Etapa 3 - Baixar a versão assinada do documento



`GET [https://assinatura-hml.e-notariado.org.br/api/documents/:id/ticket?type=Signatures&preview=false](https://assinatura-hml.e-notariado.org.br/api/documents/:id/ticket?type=Signatures&preview=false)`

sendo,
`:id` - id do documento obtido no resultado da API da etapa 1

Baixar o documento com a url `[https://assinatura.e-notariado.org.br](https://assinatura.e-notariado.org.br)` concatenada com o resultado do campo `location`.