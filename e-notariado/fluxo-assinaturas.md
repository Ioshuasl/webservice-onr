Aqui está a transcrição e estruturação completa do conteúdo do documento "api e-notariado.pdf" em formato Markdown, conforme solicitado:

Fluxo de Assinaturas - Criação automática pelo sistema do cartório 

*Modificado em Dom, 17 Mai na (o) 9:00 AM* 

HISTÓRICO 

| Versão | Data da Publicação | Alterações |
| --- | --- | --- |
| v1 | 15/07/2020 | Primeira versão do documento 

 |
| v2 | 02/12/2023 | - Detalhamento dos campos das APIs 

 |
| v2.1 | 05/10/2024 | - Esclarecimentos de como baixar o traslado 

 |
| v2.2 | 02/11/2024 | - Complementos e correções na documentação 

 |
| v2.3 | 24/03/2026 | - Obrigatoriedade de informar se o ato tem imóvel ou não (hasRealEstates). Se tiver, informar a cidade 

 |
| v.2.4 | 27/04/2026 | - endpoint para obter os códigos de município 

<br>

<br> - endpoint para submeter os traslados de atos notariais eletrônicos no mesmo fluxo já anteriormente 

 |
| v.2.5 | 28/04/2026

 | ajustes nas explicações dos locais do imóvel e partes do ato. 

 |

---

ÍNDICE 

* Introdução 


* Processo de Integração com os sistemas dos cartórios 


* Integração por API 


* Criação do Fluxo de Assinaturas 


* Acompanhamento do ato notarial 


* Upload do Traslado 


* Explicação dos campos 


* Tabelas Dominio 


* Posicionamento das marcas de assinaturas 



---

Introdução 

O módulo de Fluxo de Assinaturas da plataforma e-Notariado é responsável pela realização dos atos notariais eletrônicos, conforme previsto no provimento CNJ n° 149/2023. Para conhecimento das funcionalidades deste módulo, acesse esse link AQUI. 

---

Processo de Integração com os sistemas dos cartórios 

A integração com os sistemas de gestão de cartórios é realizada através de APIs desenvolvidas pelo CNB-CF. Em linhas gerais, com essa integração, o sistema de gestão de cartórios poderá criar e disparar automaticamente fluxos de assinaturas na plataforma e-notariado, anexando o PDF/A do ato notarial (versão do livro) e definindo os participantes deste fluxo. Como retorno, poderá acompanhar o status do andamento do fluxo e baixar os arquivos assinados, com a informação da MNE - Matrícula Notarial Eletrônica. 

Deve-se subir dois PDFs para assinaturas, o ato do livro e o traslado, os quais serão realizados em momentos distintos: 

1. O ato do livro pode ser híbrido ou totalmente digital, por opção do tabelião. Deve-se indicar no sistema de gestão de cartórios quais partes e colaboradores do cartório irão assinar digitalmente para criar o fluxo. 


2. O traslado é obrigatório para concluir o fluxo e só é possível subir após as assinaturas do ato do livro. Deve ser assinado por apenas um notário detentor de um certificado digital ICP-Brasil, indicado por opção do tabelião. 



Para realizar testes no ambiente de homologação do e-notariado, a empresa responsável pelo desenvolvimento do sistema do cartório deverá previamente firmar um ACT-Acordo de Cooperação Técnica com o CNB-CF. Para isto, preencha o formulário desse link AQUI. Após o ACT enviado, a equipe do CNB criará o ambiente de homologação e concederá os acessos às pessoas informadas no formulário do ACT. Vale ressaltar que o acesso ao ambiente de homologação deve ser realizado com certificado digital notarizado ou ICP-Brasil. 

---

Integração por API 

A documentação da API do Identificação de pessoas está disponível no endereço [https://assinatura-hml.e-notariado.org.br/swagger/index.html](https://assinatura-hml.e-notariado.org.br/swagger/index.html) 

Atentem-se que as urls dos ambientes de homologação e produção são diferentes e, portanto, devem ser tratadas pela aplicação. 

* 
**Homologação**: [https://assinatura-hml.e-notariado.org.br](https://assinatura-hml.e-notariado.org.br) 


* 
**Produção**: [https://assinatura.e-notariado.org.br](https://assinatura.e-notariado.org.br) 



Para obter a API KEY do ambiente de produção, o responsável do cartório deverá efetuar os procedimentos desse link AQUI. 

---

Criação do Fluxo de Assinaturas 

Procedimento básico para a criação e acompanhamento do fluxo: 

1. Dispare a API POST/api/uploads para efetuar o upload do arquivo PDF/A correspondente ao ato do livro; 


2. Obtenha o ID deste documento no retorno da API POST/api/uploads: 


3. Dispare a API POST/api/documents para criar o fluxo de assinaturas no e-Notariado. Obtenha os códigos de municipio pelo endpoint `/api/parent/cities`. 



---

Acompanhamento do ato notarial 

1. Obtenha o status do fluxo com `GET/api/documents` 


2. Para fazer a videoconferência, redirecionar o usuário para `http://assinatura.e-notariado.org.br/private/documents/[id]` 


3. Efetue o download do documento assinado com `GET /api/documents/{id}/ticket` 



---

Upload do Traslado 

Após o ato do livro estar assinado por todos os participantes e a videoconferência realizada, é possível também subir o traslado para a assinatura digital. 

1. Dispare a API POST/api/uploads para efetuar o upload do arquivo PDF/A correspondente ao Traslado; 


2. Execute o endpoint PUT/api/documents/{id}/pending-transcript, informando o id apresentado no resultado da /api/uploads 


3. Direcione o tabelião ou preposto autorizado a assinar o traslado no e-Notariado em `https://assinatura.e-notariado.org.br/private/documents/(id)/upload-files` 


4. Para baixar os traslados, consulte a documentação técnica neste link AQUI 



> 
> **Nota:** A versão atual das APIs ainda não contempla a possibilidade de baixar os arquivos das videoconferências. 
> 
> 

---

EXEMPLOS DE FORMATAÇÃO DAS APIS 

```json
"files":[
    {
        "displayName": "Escritura",
        "id": "0429c723-a66d-4e55-a912-ff636d1b2745",
        "name": "Escritura.pdf",
        "contentType": "application/pdf"
    }
],
"flowActions": [
    {
        "type": "Signer",
        "step": 1,
        "user": {
            "name": "John Wick",
            "identifier": "81976153069",
            "email": "john.wick@mailinator.com"
        }
    }
],
"type": "Deed",
"notarization Date": "2020-07-22T21:11:13.8462"

```

(Baseado nas fontes )

---

Explicação dos campos 

| Campo | Tipo | Obrigatório | Formato |
| --- | --- | --- | --- |
| `files` |  |  |  |
| `. displayName` | Deriominação do fluxo a ser criado que aparecerá em tela para o usuário Ex: Escritura livro 10 folha 15 | Sim

 | string |
| `. id` | Id do arquivo obtido no resultado do endpoint api/uploads | Sim

 | string |
| `. name` | Nome do arquivo com extensão .pdf | Sim

 | string |
| `. contentType` | Formatar como "application/pdf" | Sim

 | string |
| `folderid` | Id da pasta criada no endpoint /api/folders | Não |  |
| `type` | Tipo do ato (vide tabela dominio TypeOfAct) | Sim

 | string |
| `FlowActions` |  |  | 1 a n

 |
| `. type` | Tipo do participante (vide tabela dominio TypeOfParticipant) | Sim

 | string |
| `. step` | Número da etapa da ordem das ações (1, 2, 3... n) Se desejar que todos assinem ao mesmo tempo, informe o mesmo número para todos | Sim

 | numeric |
| `. user` | dados do participante |  |  |
| `.. id` | Id do participante => não utilizar | Não

 | string |
| `.. name` | Nome completo do participante | Sim

 | string |
| `.. identifier` | CPF do participante => formatar com somente números, sem pontuações | Sim

 | string |
| `.. email` | e-mail do participante | Sim

 | string |
| `. numberRequiredSignatures` | => não utilizar | Não

 | numeric |
| `. ruleName` | => não utilizar | Não

 | string |
| `. title` | Identificação do participante ex.: Vendedor, Comprador. Advogado, Procurador, Tabelião, Escrevente | Não

 | string |
| `. signRuleUsers` | => não utilizar | Não |  |
| `. prePositionedMarks` | Dados de posicionamento da representação da assinatura digital no documento | Não |  |
| `.. type` | formatar com "SignatureVisualRepresentation" | Sim

 | string |
| `.. marks` |  | Sim |  |
| `... id` | Id do documento que a assinatura é posicionada | Sim

 | string |
| `... topLeftX` | coordenada do eixo X | Sim

 | numeric |
| `... topLeftY` | coordenada do eixo Y | Sim

 | numeric |
| `... width` | largura da representação da assinatura digital | Sim

 | numeric |
| `... height` | altura da representação da assinatura digital | Sim

 | numeric |
| `... pageNumber` | número da página do documento que a representação da assinatura digital será posicionada | Sim

 | numeric |
| `observers` | Dados do observador do fluxo | Não |  |
| `. user` |  | Sim |  |
| `.. id` |  | Sim |  |
| `.. name` |  |  |  |
| `.. identifier` |  |  |  |
| `.. email` |  |  |  |
| `disablePendingActionNotifications` | => não utilizar | Não | <br>$true/false$ |
| `newFolderName` | Nome da pasta para armazenar o fluxo a ser criado | Não

 | string |
| `notarization Date` | => não utilizar | Não

 | datetime |
| `referenceDocumentid` | => não utilizar | Não

 | string |
| `book` | Número do livro notarial => obrigatorio se o ato for traslado ou certidão de ato fisico | Depende

 | string |
| `page` | Número da folha do livro notarial => obrigatório se o ato for traslado ou certidão de ato fisico | Depende

 | string |
| `protocol` | protocolo do ato notarial gerado pelo sistema do cartório | Não

 | string |
| `isHybridAct` | Indicativo se o ato é híbrido, ou seja, se haverá tanto assinaturas fisicas quanto digitais | Sim | <br>$true/false$ |
| `hasReal Estates` | Indicativo que o ato notarial trata de imóvel | Sim | <br>$true/false$ |
| `realEstates` | Dados referentes a imóveis, caso for objeto da escritura ou procuração | Depende do hasRealEstates | 1 a n

 |
| `. quantity` | Quantidade de imóveis | Sim

 | numeric |
| `. cityld` | Id do municipio (endpoint /api/parent/cities) | Sim

 | string |
| `residences` | Informar os locais de residência dos adquirentes de escrituras de compra e venda de imóveis, cessionário e cedente de escrituração de cessão de créditos, outorgantes de procuração, testadores de testamentos e requerentes de ata notarial ou escrituras sem adquirentes. | Sim | 1 a n

 |
| `. isForeign` | Indicativo de residencia no exterior | Sim | <br>$true/false$ |
| `. quantity` | Quantidade de adquirentes | Sim |  |
| `. cityld` | Id do município (endpoint /api/parent/cities) informar se residência for no Brasil | Depende |  |
| `findings` | Local da constatação do fato. => somente para Atas Notariais | Depende |  |
| `. isDigital` | Indicativo de midia social ou origem digital | Sim

 | true/false |
| `. cityld` | Id do município (base e-Notariado) Obter pelo endpoint /api/parent/cities. | Sim, se isDigital =false |  |

---

Tabelas Domínio 

TypeOfAct 

| Type | Descrição do ato | Considerações |
| --- | --- | --- |
| `Deed` | Escritura |  |
| `PowerOfAttorney` | Procuração |  |
| `Notarial Minutes` | Ata Notarial |  |
| `Testament` | Testamento |  |
| `AcknowledgmentForPhysicalActs` | Certidão de ato notarial fisico

 | informar o livro e folha do ato origem <br>

<br> book-livro <br>

<br> page-folha |
| `TranscriptForPhysicalActs` | Traslado de ato notarial fisico

 | obrigatório informar o livro e folha do ato origem |

TypeOfParticipant 

| Type | Descrição do ato | Considerações |
| --- | --- | --- |
| `Signer` | Signatário: que irá assinar digitalmente o documento |  |
| `Approver` | Aprovador: apenas aprova o documento |  |

---

Posicionamento das marcas de assinaturas 

Para posicionar as marcas de assinaturas no documento, proceda conforme exemplo abaixo. Vide também arquivo anexo "signer-cnb.postman_collection.json" 

Segue exemplo com dois assinantes e dois documentos: 

```json
"files": [
    {
        "id": "ba922fen-987-4bfe-9945-cen2291bf58",
        "name": "empty.pdf",
        "displayName": "empty",
        "contentType": "application/pdf"
    },
    {
        "id": "d6102026-c055-4422-036-0023dd146415",
        "name": "empty2.pdf",
        "displayName": "empty2",
        "contentType": "application/pdf"
    }
],
"flowActions": [
    {
        "type": "Signer",
        "step": 1,
        "user": { ... },
        "prepositionedMarks": [
            {
                "marks": [
                    {
                        "ba922fee-387e-4bfe-99f5-cea2291bf684": [
                            {
                                "topLeftX": 262.66666666666663,
                                "topLeftY": 69.12,
                                "width": 170.08484848484546,
                                "height": 93.54666666666665,
                                "pageNumber": 1
                            }
                        ],
                        "46102026-c655-4422-836-002360146415": [
                            {
                                "topLeftX": 386.66666666666663,
                                "topLeftY": 557.12,
                                "width": 170.08484848484846,
                                "height": 93.54666666666665,
                                "pageNumber": 1
                            }
                        ]
                    }
                ],
                "type": "SignatureVisualRepresentation"
            }
        ]
    },
    {
        "type": "Signer",
        "step": 2,
        "user": { ... },
        "prepositionedMarks": [
            {
                "marks": [
                    {
                        "ha922fee-387e-4fe-9975-cra2291684": [
                            {
                                "topLeftX": 2,
                                "topLeftY": 8,
                                "width": 170.08484848484846,
                                "height": 93.54666666666665,
                                "pageNumber": 1
                            }
                        ],
                        "46102026-655-4422-83ba-0023dd146415": [
                            {
                                "topLeftX": 0,
                                "topLeftY": 0,
                                "width": 170.06484848484546,
                                "height": 93.54066666666665,
                                "pageNumber": 2
                            }
                        ]
                    }
                ],
                "type": "SignatureVisualRepresentation"
            }
        ]
    }
]

```

(Baseado nas fontes )

---

Anexos (3) 

* 
**JSON:** signer-cnb.postman_collection.json (8.94 KB) 


* 
**PDF:** exemplos de marcas de assinatura.pdf (231 KB) 


* 
**XLSX:** Tabela de municipios e-Notariado.xlsx (338 KB)