**VERSÃO 1.0**
###### **MANUAL DE USO**

## **Manual API para Envio** **dos Polígonos**


**MANUAL - MAPA - DOCUMENTAÇÃO API**

###### **APRESENTAÇÃO**


O presente documento tem como objetivo descrever o funcionamento e as diretrizes de utilização da API de envio de polígonos de registros de imóveis, no
formato shapefile (.shp, .shx, .dbf, .prj), destinada à integração de sistemas com a nossa plataforma, possibilitando o envio seguro, padronizado e eficiente de
polígonos geoespaciais.



**2**


###### **SUMÁRIO**




|Autenticação|4|
|---|---|
|Endpoints da API|**5**|
|Estratégia de consulta do Status|**13**|
|Geração de chave para API|**14**|
|Atributos do arquivo .shp para cadastro do polígono|**17**|
|Script para geração do arquivo shapefile no software QGIS|**18**|


**MANUAL - MAPA - DOCUMENTAÇÃO API**

###### **1. AUTENTICAÇÃO**


Para interagir com os endpoints da API, é necessário um token de acesso (Bearer Token) que deve ser enviado no cabeçalho (Header) de cada requisição.


**Fluxo de Geração do Token**


O token de acesso é gerado manualmente por um usuário autorizado do cartório, com perfis de usuário Oficial ou Substituto, através do portal Mapas ONR.



[1.Acesso ao Portal: o usuário com perfil de Oficial, Substituto ou Preposto deve acessar o portal https://www.mapa.onr.org.br](https://mapa.onr.org.br/)
2.Autenticação: o acesso deve ser realizado mediante autenticação com certificado digital e-CPF do tipo A3, padrão ICP-Brasil.
3.Navegação: após efetuar o login, o usuário deve navegar até o menu Configurações > Chave API para envio de polígonos e selecionar a opção Gerar Nova



Chave API.
4.Geração e Armazenamento: O portal irá gerar e exibir um novo token. Este token deverá ser copiado e armazenado de forma segura para posterior



utilização na aplicação integrada.



Importante: O token de acesso tem uma validade de 15 dias. Após esse período, ele expirará automaticamente, sendo necessária a geração de um novo
token por um usuário autorizado, seguindo o mesmo procedimento descrito acima.


[BASE_URL: https://www.mapa.onr.org.br/](https://www.mapa.onr.org.br/)



**4**


**MANUAL - MAPA - DOCUMENTAÇÃO API**

###### **2. Endpoints da API**


**Endpoint 1: Gerar URLs para Importação de Polígonos**


Este endpoint inicia o processo de importação dos imóveis em formato shapefile (.shp, .shx, .dbf, .prj). O usuário envia os metadados do polígono e a lista de
nomes de arquivos, e a API retorna um ID de importação (importation_id) e uma lista de URLs pré-assinadas, uma para cada arquivo.


Método: POST
URL: BASE_URL+sistemas/api/v1/poligonos/gerar-url-importacao
Headers:
Content-Type: application/json
Authorization: Bearer SEU_TOKEN_DE_ACESSO_AQUI
Shapefile: .shp, e seus arquivos complementares .shx, .dbf, .prj. Todos os arquivos do Shapefile devem possuir o mesmo nome (exemplo: lote.shp,
lote.shx, lote.dbf, lote.prj).


**Corpo da Requisição (Request Body)**
**Exemplo:**
{
"categoria_poligono": "urbano",
"nivel_publicidade": 3,
"classificacao_poligonos": 2,
"numero_prenotacao": "2024-54321",
"descricao_importacao": "Importação do polígono referente ao loteamento Alpha, quadra 10.",
"nomes_arquivos": [
"loteamento_alpha.shp",
"loteamento_alpha.shx",
"loteamento_alpha.dbf",
"loteamento_alpha.prj"
]
}



**5**


**MANUAL - MAPA - DOCUMENTAÇÃO API**


JSON Schema da Requisição:


{
"$schema": "http://json-schema.org/draft-07/schema#",
"title": "Schema para Importação de Polígonos",
"type": "object",
"properties": {
"categoria_poligono": {
"type": "string",
"enum": [
"urbano",
"rural"
]
},
"numero_prenotacao": {
"type": "string"
},
{
"nivel_publicidade": {
"type": "integer",
"description": "Define o nível de acesso aos dados do polígono. (1: Somente quem enviou, 2: Somente a serventia,
3: Todos oficiais pela internet, 4: Público geral pela internet)",
"enum": [
1,
2,
3,
4
]
},
"classificacao_poligonos": {
"type": "integer",
"description": "Classificação do tipo de polígono. (1: Geral, 2: Loteamento, 3: Usucapião, 4: Retificação,
5: REURB, 6: Definido pelo RI1, 7: Definido pelo RI2, 8: Estrangeiro,
9: Fusão, 10: Desmembramento)",
"enum": [
1,
2,
3,
4,
5,
6,
7,
8,
9,
10
]
},
"descricao_importacao": {
"type": "string"
},
"nomes_arquivos": {
"type": "array",
"items": {
"type": "string",
"pattern": "^.+\\.(shp|shx|dbf|prj|SHP|SHX|DBF|PRJ)$"
},
"minItems": 4,
"uniqueItems": true
}
},
"required": [
"categoria_poligono",
"numero_prenotacao",
"nivel_publicidade",
"classificacao_poligonos",
"descricao_importacao",
"nomes_arquivos"
]
}



**6**


**MANUAL - MAPA - DOCUMENTAÇÃO API**


**Resposta (Response)**
**Exemplo de Sucesso (200 OK):**


{
"mensagem": "Upload URL gerado com sucesso",
"status": "200",
"data": {
"importation_id": "a1b2c3d4-e5f6-7890-abcd-ef0123456789",
"upload_urls": [
{
"filename": "loteamento_alpha.dbf",
"upload_url": "[https://storage.googleapis.com/...signed-url..](https://storage.googleapis.com/...signed-url..)."
},
{
"filename": "loteamento_alpha.shp",
"upload_url": "[https://storage.googleapis.com/...signed-url..](https://storage.googleapis.com/...signed-url..)."
},
{
"filename": "loteamento_alpha.shx",
"upload_url": "[https://storage.googleapis.com/...signed-url..](https://storage.googleapis.com/...signed-url..)."
},
{
"filename": "loteamento_alpha.prj",
"upload_url": "[https://storage.googleapis.com/...signed-url..](https://storage.googleapis.com/...signed-url..)."
}
],
"expires_in_minutes": 30
}
}



**7**


**MANUAL - MAPA - DOCUMENTAÇÃO API**


**Exemplos de Erro** 👎
**400 Bad Request (Entrada Inválida):**
{
"mensagem": "Arquivos shapefile incompletos: quadraA - Faltando: prj, shx",
"status": "422"
}


**Exemplos de Erro** 👎
**401 Unauthorized (Token Inválido/Expirado):**


{
"error": "Unauthorized",
"message": "Token de autenticação inválido ou expirado."
}



**8**


**MANUAL - MAPA - DOCUMENTAÇÃO API**


**Endpoint 2: Confirmar Importação**


Após a conclusão do upload dos files para o Bucket no Cloud Storage, utilize este endpoint informando no payload o importation_idpara informar o ONR a
conclusão do processo.

**Método:** POST
**URL:** BASE_URL+sistemas/api/v1/poligonos/confirmar
**Headers:**
Content-Type: application/json
Authorization: Bearer SEU_TOKEN_DE_ACESSO_AQUI


**Corpo da Requisição (Request Body)**


**Exemplo:**


{
"importation_id": "a1b2c3d4-e5f6-7890-abcd-ef0123456789"
}



**9**


**MANUAL - MAPA - DOCUMENTAÇÃO API**


**Resposta (Response)**
**Exemplo de Sucesso (200 OK):**


**{**
"mensagem": "Arquivos confirmados com sucesso!",
"status": "200",
"data": {
"importation_id": "a1b2c3d4-e5f6-7890-abcd-ef0123456789",
"message": "Arquivos confirmados e adicionados a fila de processamento com sucesso"
}
}


**Exemplos de Erro** 👎
**401 Unauthorized (Token Inválido/Expirado):**


{
"mensagem": "Sem permissao para confirmar esta importacao",
"status": "401"
}



**10**


**MANUAL - MAPA - DOCUMENTAÇÃO API**


**Endpoint 3: Consultar Status da Importação**


Após o upload dos arquivos e a confirmação, o sistema da serventia poderá usar este endpoint para consultar o status do processamento da sua importação.


**Método:** POST
**URL:** BASE_URL+sistemas/api/v1/poligonos/status
**Headers:**
Authorization: Bearer SEU_TOKEN_DE_ACESSO_AQUI


**Parâmetros da URL**

importation_id (string, obrigatório): O ID da importação retornado pelo primeiro endpoint.


**Corpo da Requisição (Request Body)**


**Exemplo:**
{
"importation_id": "a1b2c3d4-e5f6-7890-abcd-ef0123456789"
}



**11**


**MANUAL - MAPA - DOCUMENTAÇÃO API**


**Resposta (Response)**
**Exemplo de Sucesso (200 OK):**
{
"mensagem:": "Status encontrado com sucesso",
"status": "200",
"data": {
"status": "PROCESSANDO"
}
}


**Exemplos de Erro** 👎
**(404 Not Found):**


{
"error": "Not Found",
"message": "Importação com o ID 'a1b2c3d4-e5f6-...' não encontrada."
}



**12**


**MANUAL - MAPA - DOCUMENTAÇÃO API**

###### **4. Estratégia de consulta do Status**


Recomendamos implementar uma estratégia de backoff exponencial para consultar este endpoint, aumentando o intervalo entre as chamadas para evitar
sobrecarga. O polling deve cessar assim que um status terminal for recebido.


**Status**


WAITING_CONFIRMATION
Processamento pendente
Processamento em andamento
Erro identificado durante o processamento do(s) arquivos
Erro identificado ao tentar salvar o polígono no banco de dados
Arquivo não identificado para processamento
Processamento finalizado com sucesso
Processo cancelado pelo usuário
Foram identificados arquivos que não satisfazem as condições básicas para o processamento das informações
Projeção não suportada pelo sistema {[data_processamento]}. Por favor aguarde revisão da equipe técnica
Arquivos em processo de envio



**13**


**MANUAL - MAPA - DOCUMENTAÇÃO API**

###### **5. Geração de chave para API**


Segue abaixo o processo para o login no Mapa para acesso ao token.



**14**


**MANUAL - MAPA - DOCUMENTAÇÃO API**


Para que a autenticação na API seja realizada, é necessário gerar a chave única por meio do módulo “ **Configurações > Chave API para envio de polígonos** ” na
INTRANET.


Ao clicar no botão “ **Gerar Nova Chave API** ”, irá abrir a caixa de diálogo abaixo:



**15**


**MANUAL - MAPA - DOCUMENTAÇÃO API**


A chave gerada será exibida na tabela “Histórico de Chaves API” com a data de criação e a data de expiração.


Dúvidas ou sugestões quanto ao conteúdo deste manual devem ser encaminhadas para o e-mail mapa@onr.org.br.



**16**


**MANUAL - MAPA - DOCUMENTAÇÃO API**

###### **6. Atributos do arquivo .shp para cadastro do polígono**



**17**


**MANUAL - MAPA - DOCUMENTAÇÃO API**

###### **7. Script para geração do arquivo shapefile no software QGIS**



**18**
