**==> picture [114 x 49] intentionally omitted <==**

## Manual de integração da API Editais 

V.8.0 20 de Março de 2026 

www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

## Histórico de Versões 

|**Versão**|**Data**|**Responsável**|**Alteração**|
|---|---|---|---|
|1.0|27/05/2025|Equipe Técnica CORI-BR|Criação do Documento|
|2.0|27/05/2025|Equipe Técnica CORI-BR|Atualização das informações|
|3.0|05/06/2025|Equipe Técnica CORI-BR|Atualização da cobrança|
|4.0|25/09/2025|Equipe Técnica CORI-BR|Atualização da geração|
|5.0|30/10/2025|Equipe Técnica CORI-BR|Atualização da geração/Atualização do<br>Webhook|
|6.0|19/11/2025|Equipe Técnica CORI-BR|Atualização das informações|
|7.0|15/01/2026|Equipe Técnica CORI-BR|Atualização das informações|
|8.0|20/03/2026|Equipe Técnica CORI-BR|Atualização das informações|



www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

## Sumário 

|**Objetivo**|**4**|
|---|---|
|**Funcionalidades**|**5**|
|**Endereços da API**|**6**|
|**Endereço do Swagger**|**7**|
|**Descrição das Funcionalidades - Gerais**|**8**|
|[RFG-01] - Autenticação|8|
|**Descrição das Funcionalidades - Edital**|**10**|
|[RFE-01] - Listagem dos tipos de editais|10|
|[RFE-02] - Listagem dos editais|12|
|[RFE-03] - Cadastro de cobrança|15|
|[RFE-04] - Atualização de cobrança|17|
|**Descrição das Funcionalidades - Edital simples**|**20**|
|[RFS-01] - Cadastramento de um edital simples|20|
|[RFS-02] - Cancelamento de um edital simples|27|
|[RFS-03] - Retificação de um edital simples|28|
|[RFS-04] - Detalhes de um edital simples|34|
|**Descrição das Funcionalidades - Edital leilão**|**40**|
|[RFL-01] - Cadastramento de um edital leilão|40|
|[RFL-02] - Cancelamento de um edital leilão|50|
|[RFL-03] - Retificação de um edital leilão|51|
|[RFL-04] - Detalhes de um edital leilão|59|
|**Tabelas de Domínio**|**68**|
|[TBD-01] - EPermiteAnexo|68|
|[TBD-02] - EAnexoObrigatorio|69|
|[TBD-03] - ETipoDiasPublicacoes|69|
|[TBD-04] - ETipoEdital|69|
|[TBD-05] - EStatus|69|
|[TBD-06] - LModalidade|70|
|[TBD-07] - LDisputa|70|
|[TBD-08] - WebHookMetodo|70|



www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

## Objetivo 

Esta documentação visa orientar as empresas desenvolvedoras de sistemas para cartórios a realizar a integração com os serviços disponibilizados pelo Registro de Imóveis do Brasil. 

Neste documento, você encontrará informações abrangentes sobre as funcionalidades disponibilizadas e formatos de dados. 

Ao seguir as diretrizes fornecidas neste documento, as empresas desenvolvedoras de sistemas poderão garantir a interoperabilidade dos seus sistemas com o Registro de Imóveis do Brasil. Isso permitirá a troca de dados de forma segura e confiável. 

Recomendamos que as empresas desenvolvedoras de sistemas para cartórios utilizem esta documentação como um guia completo para realizar a integração com os serviços do Registro de Imóveis do Brasil. Com isso, poderão proporcionar aos usuários uma experiência mais eficiente e moderna no acesso às informações relacionadas a imóveis, contribuindo assim para o aprimoramento do setor imobiliário todo. 

www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

## Funcionalidades 

As APIs disponibilizadas para o cartório realizar a integração automatizada dos editais. 

As funcionalidades disponíveis para a integração são: 

|**#**|**Referência**|**Descrição**|
|---|---|---|
|1|[RFG-01]|Autenticação|
|2|[RFE-01]|Listagem dos tipos de editais|
|3|[RFE-02]|Listagem dos editais|
|4|[RFE-03]|Cadastro de cobrança|
|5|[RFE-04]|Atualização de cobrança|
|6|[RFS-01]|Cadastramento de um edital simples|
|7|[RFS-02]|Cancelamento de um edital simples|
|8|[RFS-03]|Retificação de um edital simples|
|9|[RFS-04]|Detalhes de um edital simples|
|10|[RFL-01]|Cadastramento de um edital de leilão|
|11|[RFL-02]|Cancelamento de um edital de leilão|
|12|[RFL-03]|Retificação de um edital de leilão|
|13|[RFL-04]|Detalhes de um edital de leilão|



www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

## Endereços da API 

Abaixo encontram-se os endereços disponibilizados as APIs. 

- Produção: https://api.registrodeimoveis.org.br 

- ● Homologação: https://testes api.registrodeimoveis.org.br 

www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

## Endereço do Swagger 

Abaixo encontram-se os endereços disponíveis do Swagger. 

● https://www.registrodeimoveis.org.br/swagger/index.html 

www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

## Descrição das Funcionalidades - Gerais 

## [RFG-01] - Autenticação 

Ao tentar utilizar os serviços disponíveis, se faz necessário realizar o processo de autenticação. A função de autenticação deverá receber os valores via POST, no qual será realizada a validação dos dados e retorna com o token JWT quando bem sucedido. 

## API da funcionalidade: 

|**Método**|**Endpoint**|**Descrição**|
|---|---|---|
|POST|/v1/auth/token|API para geração do token de autenticação.|
|GET|/v1/auth/validacao|<br>APIparavalidação do tokende autenticação.|



POST /v1/auth/token Campos do body da API: 

|**Campo**|**Tipo**|**Obrigatório**|**Descrição**|
|---|---|---|---|
|client_id|String|<br>Sim|<br>Código do cliente.|
|<br>client_secret|<br>String|Sim|<br>Chave secreta do cliente.|
|grant_type|String|Sim|Tipo da autenticação.<br>Valores:<br>-<br>client_credentials<br>-<br>password|
|username|String|Não|Nome do usuário.<br>Utilizado quando grant_type definido como password.|
|password|<br>String|Não|<br>Senha do usuário.<br>Utilizado quando grant_type definido como password.|



## Modelo do JSON da resposta de sucesso da requisição: 

```
{
"access_token": "string",
"expires_in": 0,
"token_type": "Bearer"
}
```

## Campos da resposta de sucesso da requisição: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>access_token|<br>String||<br>Sim|<br>Token de acesso em JWT.|
|<br>expires_in|<br>Int||Sim|Tempo de expiração do token.|
|<br>token_type|String||Sim|<br>Tipo do token de autenticação.<br>Tipo:|



www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

- Bearer 

## Modelo do JSON da resposta de erro da requisição: 

```
{
```

```
"codigo": 0,
"descricao": "string",
"campos": {}
}
```

Campos da resposta de erro da requisição: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>codigo|<br>String|11|<br>Não|<br>Código interno.|
|<br>descricao|<br>String||Sim|<br>Breve descrição interno referente ao código.|
|campos|<br>Object||Não|<br>Campos com erro na requisição.|



## GET /v1/auth/validacao 

Campos do header da API: 

|**Campo**|**Tipo**|**Obrigatório**|**Descrição**|
|---|---|---|---|
|Authorization|String|<br>Sim|<br>Token JWT gerado na API de token da autenticação.|



## Modelo do JSON da resposta de erro da requisição: 

```
{
```

```
"codigo": 0,
"descricao": "string",
"campos": {}
}
```

Campos da resposta de erro da requisição: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>codigo|<br>String|11|<br>Não|<br>Código interno.|
|<br>descricao|<br>String||Sim|<br>Breve descrição interno referente ao código.|
|campos|<br>Object||Não|<br>Campos com erro na requisição.|



www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

## Descrição das Funcionalidades - Edital 

## [RFE-01] - Listagem dos tipos de editais 

A funcionalidade de listagem dos tipos de editais retornará as informações de todos os tipos permitidos para cadastramento e seus detalhes, como valores, quantidade de publicações e se é necessário anexo. 

No momento do cadastro são realizadas validações dos campos, e em caso de problemas, os retornos são exibidos no campo de alertas. 

API da funcionalidade: 

|**Método**|**Endpoint**|**Descrição**|
|---|---|---|
|GET|/v1/edital/tipo|Retorna a lista dos tipos de editais com paginação|



GET /v1/edital/tipo Campos do header da API: 

|**Campo**|**Tipo**|**Obrigatório**|**Descrição**|
|---|---|---|---|
|<br>Authorization|<br>String|<br>Sim|<br>TokenJWTgeradonaAPIdetokenda autenticação.|



GET /v1/edital/tipo 

Campos dos parâmetros da URL da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>registrosPorPagi<br>na|<br>Int|3|<br>Não|<br>Total de registros que deve retornar por<br>página. Padrão é de 50 registros e pode ter<br>no máximo 100|
|numeroPagina|Int||Não|Número da página que deseja acessar|



Modelo do JSON da resposta de sucesso da requisição: 

```
{
"totalRegistros": 0,
"totalPaginas": 0,
"paginaAtual": 0,
"dados": [
    {
"id": 0,
"descricaoResumida": "string",
"descricao": "string",
"permiteAnexo": 0,
```

www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

```
"anexoObrigatorio": 0,
"extensoesPermitidas": "string",
"numeroPublicacoes": 0,
"diasPublicacoes": 0,
"tipoDiasPublicacoes": 0,
"diasTerminoPrazoEdital": 0,
"valorPublicacao": 0,
"textoPadrao": "string",
"tipoEdital": "SIMPLES"
    }
  ]
}
```

Campos da resposta de sucesso da requisição: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|totalRegistros|Int||<br>Sim|<br>Número total de registros encontrados|
|<br>totalPaginas|Int||Sim|<br>Número totalde páginas disponíveis|
|paginaAtual|Int||Sim|Número da página atual|
|<br>dados|Array||Sim|<br>Dados dos tipos dos editais|



Campos do array dados da resposta de sucesso da requisição: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|id|Int|<br>10|<br>Sim|<br>Id do tipo do edital. Utilizado no cadastramento do<br>edital.|
|descricaoResu<br>mida|String|250|Sim|Descrição resumida do tipo de edital.|
|descricao|String|250|Não|Descrição do tipo de editais.|
|permiteAnexo|Int|1|Não|Se irá permitir anexo.<br>_Tabela de domínio: EPermiteAnexo_|
|<br>anexoObrigator<br>io|Int|1|Não|Se o anexo é obrigatório.<br>_Tabela de domínio: EAnexoObrigatorio_|
|extensoesPerm<br>itidas|String|250|Não|<br>Extensões permitidas para os arquivos anexados.<br>Se estiver vazio, permite qualquer extensão. Para<br>anexar, será válido o campo permiteAnexo.|
|numeroPublica<br>coes|<br>Int|1|Não|<br>Número de editais a serem criados.|
|diasPublicacoe<br>s|Int|2|Não|Dias entre cada publicação de um edital que<br>necessita de mais de uma publicação.|
|tipoDiasPublica<br>coes|Int|2|Não|<br>Tipo da contagem dos dias entre cada publicação.<br>_Tabela de domínio: ETipoDiasPublicacoes_|
|diasTerminoPra<br>zoEdital|Int|2|Não|Número de dias de prazo de término do edital.|
|valorPublicaca<br>o|Int|11|Sim|Valor da publicação do edital. O valor já<br>contempla todas as publicações.|
|textoPadrao|String|16.777.215|Não|<br>Texto padrão utilizado para cadastrar o edital.|



www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

|tipoEdital|String|30|Sim|Definição do tipo do Edital.<br>_Tabela de domínio: ETipoEdital_|
|---|---|---|---|---|



Modelo do JSON da resposta de erro da requisição: 

```
{
```

```
"codigo": 0,
"descricao": "string",
"campos": {}
}
```

Campos da resposta de erro da requisição: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|codigo|String|11|<br>Não|<br>Código interno.|
|<br>descricao|<br>String||Sim|<br>Breve descrição interno referente ao código.|
|campos|<br>Object||Não|<br>Campos com erro na requisição.|



## [RFE-02] - Listagem dos editais 

A funcionalidade de listagem dos editais retornará a lista com paginação de todos os editais cadastrados pelo cartório, independente se o edital for cadastrado através de API ou através da Intranet. 

## API da funcionalidade: 

|**Método**|**Endpoint**|**Descrição**|
|---|---|---|
|GET|/v1/edital|<br>API de retorno da listagem dos editais com paginação|



## GET /v1/edital 

Campos do header da API: 

|**Campo**|**Tipo**|**Obrigatório**|**Descrição**|
|---|---|---|---|
|<br>Authorization|<br>String|<br>Sim|<br>Token JWT gerado na API de token da autenticação.|



## GET /v1/edital 

Campos dos parâmetros da URL da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|registrosPorPagi<br>na|Int|3|<br>Não|Total de registros que deve retornar por<br>página. Padrão é de 50 registros e pode ter<br>no máximo 100|
|numeroPagina|Int||Não|Número da página que deseja acessar|



www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

|tipoEdital|Int|11|Não|Identifica o tipo do edital|
|---|---|---|---|---|
|dataInicialPublic<br>acao|Date|10|Não|Data inicial da publicação que deseja filtrar|
|dataFinalPublica<br>cao|Date|10|Não|Datafinalda publicação que desejafiltrar|
|dataInicialCadas<br>tro|Date|10|Não|Data inicial do cadastro que deseja filtrar|
|dataFinalCadastr<br>o|Date|10|Não|<br>Data final do cadastro que deseja filtrar|
|documentoIntim<br>ado|String|14|Não|Número do documento (CPF ou CNPJ) do<br>intimado que deseja filtrar|
|documentoCred<br>or|<br>String|14|Não|<br>Número do CNPJ do credorque desejafiltrar|
|cns|String|10|Não|Código CNS do cartório|
|numeroMatricula|String||Não|Número damatrícula doimóvel|
|uuid|String|36|Não|Hash uuid do edital|
|numeroEdital|String|11|Não|Número do edital|
|status|String|11|Não|Situação do edital<br>_Tabela de domínio: EStatus_|



## Modelo do JSON da resposta de sucesso da requisição: 

```
{
```

```
"totalRegistros": 0,
```

```
"totalPaginas": 0,
"paginaAtual": 0,
"dados": [
```

```
"uuid": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
```

```
"cnm": "string",
```

```
"numeroEdital": 0,
```

```
"tipoEdital": 0,
```

```
"descricaoTipo": "string",
```

```
"numeroPublicacao": 0,
```

```
"paginas": 0,
```

```
"status": 0,
```

```
"descricaoStatus": "string",
```

```
"dataStatus": "2022-08-04 10:24:01",
```

```
"dataPublicacao": "2022-08-04",
```

```
"numeroEdicao": 0,
```

```
"anoEdicao": 0,
```

```
"dataCadastro": "2022-08-04 10:00:00",
```

```
"dataAtualizacao": "2022-08-04 10:00:00",
```

```
"urlPagamento": "string",
"urlRecibo": "string",
```

www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

```
"editaisVinculados": [
"string"
      ]
    },
"motivoRejeicao": "string",
"editaisRetificador": [
      {
"editalRejeitado": 0,
"editalRetificador": 0,
"uuidRetificador": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
      }
    ]
  ]
}
```

Campos da resposta de sucesso da requisição: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|totalRegistros|Int||<br>Sim|<br>Número total de registros encontrados|
|<br>totalPaginas|Int||Sim|<br>Número total de páginas disponíveis|
|<br>paginaAtual|Int||Sim|<br>Número da página atual|
|<br>dados|Array||Sim|<br>Dados dos editais|



Campos do array dados da resposta de sucesso da requisição: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>uuid|<br>String|<br>36|<br>Sim|<br>Hash uuid identificador do edital|
|cnm|<br>String||Não|Número CNM|
|numeroEdital|<br>Int|11|Sim|Número do edital|
|tipoEdital|Int|11|Sim|Identifica o tipo do edital|
|<br>descricaoTipo|String|250|Sim|<br>Descrição do tipo do edital|
|<br>numeroPublica<br>cao|<br>Int|2|Sim|<br>Número da publicação do edital|
|paginas|Int|4|Sim|Número de páginas do edital|
|status|Int|1|Sim|Situação atual do edital<br>_Tabela de domínio: EStatus_|
|descricaoStatu<br>s|String|250|Sim|Descrição da situação do edital|
|dataStatus|<br>DateTim<br>e|19|Sim|<br>Data da situação|
|dataPublicacao|DateTim<br>e|19|Não|Data da publicação do edital|
|numeroEdicao|Int|11|Não|Número da edição da publicação do edital|
|anoEdicao|Int|4|Não|Ano da edição da publicação do edital|
|dataCadastro|DateTim<br>e|19|Sim|Data e hora de cadastro|



www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

|dataAtualizaca<br>o|DateTim<br>e|19|Sim|Data e hora da última atualização|
|---|---|---|---|---|
|urlPagamento|String|65.535|Não|URL de acesso ao pagamento|
|urlRecibo|String|65.535|Não|URL de acesso ao recibo|
|editaisVinculad<br>os|Array||Não|Número dos editais vinculados|
|motivoRejeicao|<br>String|65.535|Não|Texto explicativo domotivo darejeição do edital|
|retificacao|Array||Não|Informaçõe sobre os editais de retificação|



## Campos do array retificacao: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>editalRejeitado|<br>Int|11|<br>Sim|<br>Id do edital rejeitado|
|<br>editalRetificador|Int|11|Sim|<br>Id do edital retificador|
|uuidRetificador|String|36|Sim|Hash do grupo de editais retificador|



## Modelo do JSON da resposta de erro da requisição: 

```
{
"codigo": 0,
"descricao": "string",
"campos": {}
}
```

Campos da resposta de erro da requisição: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>codigo|<br>String|11|<br>Não|<br>Código interno.|
|<br>descricao|<br>String||Sim|<br>Breve descrição interno referente ao código.|
|campos|<br>Object||Não|<br>Campos com erro na requisição.|



## [RFE-03] - Cadastro de cobrança 

Para cadastrar a cobrança gerada posteriormente para o sistema interno, deve ser enviado o token de autenticação no HEADER, e os dados da cobrança no formato JSON, via método POST. 

Rota da funcionalidade: 

|**Método**|**Endpoint**|**Descrição**|
|---|---|---|
|POST|<br>/edital/cobranca|<br>Rota para cadastrar a cobrança.|



POST /edital/cobranca Campos do header da rota: 

www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

**Campo Tipo Obrigatório Descrição** Authorization String Sim Token gerado na rota de autenticação. (Tipo do token: Bearer) 

## POST /edital/cobranca Campos do body da rota: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|cnsServentia|String|<br>6|<br>Sim|<br>CNS da serventia.|
|editais|<br>Array||Sim|Array comos editaisrelacionados à cobrança.|
|valor|Number||Sim|Valor da cobrança.|
|urlAcesso|String||Sim|<br>URLdoPDFda cobrança.|
|dataGeracao|String||Sim|Data da geração da cobrança.|
|dataVencimento|<br>String||Sim|<br>Data dovencimento da cobrança.|
|numeroDocumento|String||Sim|Número do documento da cobrança. (Nosso<br>número).|
|descricao|<br>String|250|Sim|<br>Descrição da cobrança.|
|pagador|Objeto||Sim|Dados do pagador da cobrança.|



## POST /edital/cobranca 

## Campos do objeto pagador do body da rota: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>nome|<br>String|150|<br>Sim|<br>Nome do pagador.|
|documento|<br>String|20|Sim|<br>CPF/CNPJ do pagador.|
|email|<br>String|150|Sim|<br>Email do pagador.|
|cep|<br>String|9|Não|<br>CEP do pagador.|
|<br>logradouro|<br>String|150|Não|<br>Logradouro do pagador.|
|<br>numero|<br>String|15|Não|<br>Número do pagador.|
|complemento|<br>String|150|Não|<br>Complemento do pagador.|
|<br>bairro|<br>String|150|Não|<br>Bairro do pagador.|
|cidade|<br>String|150|Não|<br>Cidade do pagador.|
|uf|<br>String|2|Não|<br>UF do pagador.|



## Modelo do JSON da requisição no body: 

```
{
```

```
"cnsServentia": "string",
```

```
"editais": [
```

```
"valor": 0,
"urlAcesso": "string",
"dataGeracao": "0000-00-00",
"dataVencimento": "0000-00-00",
"numeroDocumento": "string",
"descricao": "string",
```

www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

```
"pagador": {
"nome": "string",
"documento": "string",
"email": "string",
"cep": "string",
"logradouro": "string",
"numero": "string",
"complemento": "string",
"bairro": "string",
"cidade": "string",
"uf": "st"
}
```

Modelo do JSON da resposta de sucesso da requisição: 

```
{
"mensagem": "string"
}
```

Campos da resposta de sucesso da requisição: 

|**Campo**|**Tipo**|**Obrigatório**|**Descrição**|
|---|---|---|---|
|mensagem|String|<br>Sim|<br>Mensagem do retorno.|



Modelo do JSON da resposta de erro da requisição: 

```
{
"mensagem": "string"
}
```

Campos da resposta de erro da requisição: 

|**Campo**|**Tipo**|**Obrigatório**|**Descrição**|
|---|---|---|---|
|mensagem|String|<br>Sim|<br>Mensagem do retorno.|



## [RFE-04] - Atualização de cobrança 

Para atualizar a cobrança para o sistema interno, deve ser enviado o token de autenticação no HEADER, passar o número do documento da cobrança como parâmetro na URL e os dados da cobrança no formato JSON, via método PATCH. 

www.registrodeimoveis.org.br 

Rota da funcionalidade: 

**==> picture [114 x 49] intentionally omitted <==**

**Método Endpoint Descrição** PATCH /edital/cobranca/{numeroDocumento} Rota para atualizar a cobrança. 

PATCH /edital/cobranca/{numeroDocumento} Campos do header da rota: 

|**Campo**|**Tipo**|**Obrigatório**|**Descrição**|
|---|---|---|---|
|<br>Authorization|<br>String|<br>Sim|<br>Token gerado na rota de autenticação. (Tipo do token: Bearer)|



PATCH /edital/cobranca/{numeroDocumento} Campos do parâmetro da rota: 

|**Campo**|**Tipo**|**Obrigatório**|**Descrição**|
|---|---|---|---|
|<br>numeroDocumento|<br>String|<br>Sim|<br>Número do documento da cobrança cadastrada. (Nosso número)|



PATCH /edital/cobranca/{numeroDocumento} Campos do body da rota: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>cnsServentia|<br>String|6|<br>Sim|<br>CNS da serventia.|
|valorPago|<br>Number||Sim|Valor pago na cobrança.|
|<br>pago|Number||Sim|<br>Define se a cobrança foi paga. (0=Não; 1=Sim)|
|<br>dataPagamento|String||Sim|<br>Data do pagamento da cobrança.|



## Modelo do JSON da requisição no body: 

```
{
"cnsServentia": "string",
"valorPago": 0,
"pago": "string",
"dataPagamento": "0000-00-00"
}
```

Modelo do JSON da resposta de sucesso da requisição: 

```
{
"mensagem": "string",
"status": "200"
}
```

www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

## Campos da resposta de sucesso da requisição: 

|**Campo**|**Tipo**|**Obrigatório**|**Descrição**|
|---|---|---|---|
|<br>mensagem|<br>String|<br>Sim|<br>Mensagemdoretorno.|
|status|String|Sim|Status do retorno.|



## Modelo do JSON da resposta de erro da requisição: 

```
{
"mensagem": "string",
"status": "string"
}
```

## Campos da resposta de erro da requisição: 

|**Campo**|**Tipo**|**Obrigatório**|**Descrição**|
|---|---|---|---|
|<br>mensagem|<br>String|<br>Sim|<br>Mensagem do retorno.|
|<br>status|<br>String|Sim|<br>Status do retorno.|



www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

## Descrição das Funcionalidades - Edital simples 

## [RFS-01] - Cadastramento de um edital simples 

A funcionalidade do cadastramento do edital permite que o cartório realize o cadastramento dos editais sem a necessidade de acessar o gerenciamento de pagamentos disponibilizado na intranet. 

API da funcionalidade: 

|**Endpoint**|**Descrição**|
|---|---|
|<br>/v1/edital|<br>API de cadastramento do edital|



## POST /v1/edital 

Campos do header da API: 

|**Campo**|**Tipo**|**Obrigatório**|**Descrição**|
|---|---|---|---|
|Authorization|String|<br>Sim|<br>Token JWT gerado na API de token da autenticação.|



POST /v1/edital 

Campos do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>tipoEdital|<br>Int|<br>10|<br>Sim|<br>Código do tipo do edital|
|numeroMatricula|String|7|Não|Número da matrícula|
|cnm|<br>String|19|Não|Número do CNM|
|numeroProtocolo|String|20|Não|Número<br>do<br>protocolo/prenotação<br>de<br>referência do edital|
|anexo|String|4.294.967.295|Não|Código<br>base64<br>do<br>anexo<br>para<br>cadastramento no edital|
|numeroAto|String|30|Não|Número do ato|
|textoEdital|String|10000|Não|Texto do edital (Será utilizado quando não<br>existir o texto padrão do edital)|
|intimados|<br>Array||Sim|<br>Dados dos intimados|
|primeiroRequerente|<br>Object||Não|Dados do primeiro requerente|
|<br>dadosServentia|<br>Object|<br>|Sim|<br>Dados da serventia|
|dadosContrato|<br>Object|<br>|Não|Dados do contrato|
|imovel|<br>Object|<br>|Não|Dados do endereço do imóvel do edital|
|cobranca|<br>Object||Não|Define os dados para a geração da<br>cobrança do edital|
|webhook|Object||Não|Dados de webhook para notificação|



## POST /v1/edital 

Campos do array intimados do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>documentoDes<br>conhecido|<br>Boolean||<br>Não|<br>Informa se o documento do intimado é<br>desconhecido, caso seja true, não é necessário<br>informar o documento.|



www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

|documento|String|14|Sim|Número do documento do intimado CPF ou<br>CNPJ , informar somente os números.|
|---|---|---|---|---|
|nome|String|50|Não|Nome completo do intimado ou razão social. A<br>API irá realizar a consulta do documento para<br>buscarasinformações donome.|
|endereco|Object||Não|Dados do endereço do intimado|



## POST /v1/edital 

## Campos do objeto intimados/endereco do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>cep|<br>String|8|<br>Sim|<br>CEPdo endereço.|
|tipoLogradouro|String|16|Sim|Tipo do logradouro do endereço.|
|<br>logradouro|<br>String|150|Sim|<br>Logradouro do endereço.|
|numero|String|10|Não|Número do imóvel.|
|bairro|<br>String|100|Sim|Bairro do endereço.|
|cidade|String|100|Sim|Cidade do endereço.|
|estado|<br>String|2|Sim|<br>Sigla do estado do endereço.|



## POST /v1/edital 

## Campos do object primeiroRequerente do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório **|**Descrição**|
|---|---|---|---|---|
|documento|String|200|Sim|Documento do primeiro requerente|
|nome|<br>Number||Sim|<br>Nome do primeirorequerente|



## POST /v1/edital 

## Campos do object dadosServentia do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>nomeOficial|<br>String|200|<br>Não|<br>Nome do oficial|
|cns|<br>Number||Sim|Código CNS|
|denominacao|String|200|Não|<br>Denominação da serventia|
|endereco|<br>Object||Não|<br>Dados do endereço do intimado|



## POST /v1/edital 

## Campos do objeto dadosServentia/endereco do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>cep|<br>String|8|<br>Sim|<br>CEP do endereço.|
|<br>tipoLogradouro|<br>String|16|Sim|<br>Tipo do logradouro do endereço.|
|<br>logradouro|<br>String|150|Sim|<br>Logradouro do endereço.|
|<br>numero|<br>String|10|Não|<br>Número do imóvel.|
|bairro|<br>String|100|Sim|Bairro do endereço.|
|cidade|<br>String|100|Sim|<br>Cidade do endereço.|
|estado|<br>String|2|Sim|<br>Sigla do estado do endereço.|



www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

## POST /v1/edital Campos do objeto dadosContrato do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|nomeCredor|String|400|<br>Sim|<br>Nome do credor|
|numero|<br>String|30|Sim|Número do contrato|
|dataContrato|<br>Date|10|Sim|Data do contrato|
|dataAssinatura<br>Contrato|Date|10|Sim|Data da assinatura do contrato|
|dataPosiciona<br>mentoDivida|Date|10|Sim|Data do posicionamento da divida|
|valorDivida|Number||Sim|Valor da dívida (Exemplo R$100,00 deverá ser<br>informado 100000)|
|cidadeAssinatu<br>ra|String|150|Sim|<br>Cidade onde foi assinado o contrato|
|estadoAssinatu<br>ra|<br>String|2|Sim|Sigla do estado onde foi assinado o contrato|



## POST /v1/edital 

## Campos do objeto imovel do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>cep|<br>String|8|<br>Sim|<br>CEPdo endereço.|
|tipoLogradouro|String|16|Sim|Tipo do logradouro do endereço.|
|<br>logradouro|<br>String|150|Sim|<br>Logradouro do endereço.|
|numero|String|10|Não|Número do imóvel.|
|bairro|<br>String|100|Sim|Bairro do endereço.|
|cidade|String|100|Sim|Cidade do endereço.|
|estado|<br>String|2|Sim|<br>Sigla do estado do endereço.|



## POST /v1/edital 

## Campos do objeto cobranca do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|observacao|String|30|<br>Não|<br>Observações<br>para<br>serem<br>adicionadas na<br>cobrança|
|dadosPagador|<br>Object||Sim|Dados do pagador|



## POST /v1/edital 

## Campos do objeto cobranca/dadosPagador do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|nome|String|60|<br>Sim|<br>Nome do pagador.|
|documento|<br>String|14|Sim|<br>Número do documento (CPF/CNPJ) do pagador<br>(somente número).|
|email|String|150|Sim|Endereço de e-mail do pagador.|
|telefone|<br>Object||Não|<br>Dados do telefone do pagador.|



www.registrodeimoveis.org.br 

endereco Object Sim Dados do endereço do pagador. 

**==> picture [114 x 49] intentionally omitted <==**

## POST /v1/edital 

## Campos do objeto cobranca/dadosPagador/telefone do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>ddd|<br>Number|<br>3|<br>Não|<br>Número doDDDdotelefone.|
|numero|Number|10|Não|Número do telefone.|



## POST /v1/edital 

## Campos do objeto cobranca/dadosPagador/endereco do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>cep|<br>String|<br>8|<br>Sim|<br>CEPdo endereço do pagador.|
|tipoLogradouro|String|16|Sim|Tipo do logradouro do endereço do pagador.|
|<br>logradouro|<br>String|150|Sim|<br>Logradouro do endereço do pagador.|
|numero|String|10|Não|Número do imóvel do pagador.|
|bairro|<br>String|100|Sim|<br>Bairro do endereço do pagador.|
|cidade|String|100|Sim|Cidade do endereço do pagador.|
|estado|<br>String|2|Sim|<br>Sigla do estado do endereço do pagador.|



## POST /v1/edital 

## Campos do objeto webhook do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>url|<br>String||<br>Sim|<br>URL do webhook|
|metodo|<br>String||Sim|Tipo do método de comunicação<br>_Tabela de domínio: WebHookMetodo_|



## Modelo do JSON da requisição no body: 

```
{
"tipoEdital": 0,
"numeroMatricula": "string",
"cnm": "stringstringstrings",
"numeroProtocolo": "string",
"anexo": "string",
"numeroAto": "string",
"textoEdital": "string",
"intimados": [
    {
"documentoDesconhecido": false,
"documento": "stringstrin",
```

www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

```
"nome": "string",
```

```
"endereco": {
```

```
"cep": "string",
```

```
"tipoLogradouro": "string",
```

```
"logradouro": "string",
```

```
"numero": "string",
```

```
"bairro": "string",
```

```
"cidade": "string",
```

```
"estado": "st"
```

```
      }
```

```
    }
```

```
  ],
```

```
"primeiroRequerente": {
```

```
"documento": "string",
```

```
"nome": "string",
```

```
  },
```

```
"dadosServentia": {
```

```
"nomeOficial": "string",
```

```
"cns": 0,
```

```
"denominacao": "string",
```

```
"endereco": {
```

```
"cep": "string",
```

```
"tipoLogradouro": "string",
```

```
"logradouro": "string",
```

```
"numero": "string",
```

```
"bairro": "string",
```

```
"cidade": "string",
```

```
"estado": "st"
```

```
    }
```

```
  },
```

```
"dadosContrato": {
```

```
"nomeCredor": "string",
```

```
"numero": "string",
```

```
"dataContrato": "2022-08-04",
```

```
"dataAssinaturaContrato": "2022-08-04",
```

```
"dataPosicionamentoDivida": "2022-08-04",
```

```
"valorDivida": 10000,
```

```
"cidadeAssinatura": "string",
```

```
"estadoAssinatura": "st"
```

```
  },
```

```
"imovel": {
```

www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

```
"cep": "string",
```

```
"tipoLogradouro": "string",
"logradouro": "string",
"numero": "string",
"bairro": "string",
"cidade": "string",
"estado": "st"
"cobranca": {
```

```
"observacao": "string",
```

```
"dadosPagador": {
```

```
"nome": "string",
"documento": "string",
```

```
"email": "string",
"telefone": {
"ddd": 0,
"numero": 0
```

```
"endereco": {
```

```
"cep": "string",
```

```
"tipoLogradouro": "string",
```

```
"logradouro": "string",
```

```
"numero": "string",
"bairro": "string",
"cidade": "string",
"estado": "st"
      }
    }
  },
"webhook": {
"url": "string",
"metodo": "string"
  }
}
```

## Modelo do JSON da resposta de sucesso da requisição: 

```
{
```

```
"editaisCadastrados": [
"hash": "string",
```

www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

```
"documentosIntimados": [
"string"
      ],
"idsGerados": [
        0
      ],
"datasPublicacoes": [
"2022-08-04"
      ]
    }
  ],
"status": 0,
"dataStatus": "2022-08-04 15:16:23",
"urlPagamento": "string",
"valor": 10000,
"totalPublicacoes": 0
}
```

## Campos da resposta de sucesso da requisição: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>editaisCadastrad<br>os|<br>Array||<br>Sim|<br>Array com os dados dos editais cadastrados|
|status|<br>Int||Sim|<br>Situação atual do edital<br>_Tabela de domínio: EStatus_|
|dataStatus|DateTime|19|Sim|Data da situação do edital|
|urlPagamento|String|65.535|Não|URL de acesso ao pagamento|
|valor|Number||Sim|Valor total da publicação do edital. O valor<br>será<br>informado em formato numérico.<br>(Exemplo R$100,00 deverá ser informado<br>100000)|
|totalPublicacoes|Int|2|Sim|Total de publicações geradas|



## Campos do array editaisCadastrados da resposta de sucesso da requisição: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>hash|<br>String|<br>8|<br>Sim|<br>Hash do edital|
|documentosIntimad<br>os|<br>String|16|Sim|Número do documento dos intimados de cada<br>edital|
|idsGerados|<br>String|150|Sim|IDs dos editais cadastrados|
|datasPublicacoes|Array|10|Não|Datas das publicações|



Modelo do JSON da responsa de erro da requisição: 

```
{
```

www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

```
"codigo": 0,
"descricao": "string",
"campos": {}
}
```

Campos da responsa de erro da requisição: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>codigo|<br>String|11|<br>Não|<br>Código interno.|
|<br>descricao|<br>String||Sim|<br>Breve descrição interno referente ao código.|
|campos|<br>Object||Não|<br>Campos com erro na requisição.|



## [RFS-02] - Cancelamento de um edital simples 

A funcionalidade de cancelamento permite que o cartório realize o cancelamento de um edital que não tenha sido pago ou publicado. 

API da funcionalidade: 

|**Método**|**Endpoint**|**Descrição**|
|---|---|---|
|DELETE|<br>/v1/edital/{numeroEdital}|<br>API de cancelamento do edital|



DELETE /v1/edital/{numeroEdital} Campos do header da API: 

|**Campo**|**Tipo**|**Obrigatório**|**Descrição**|
|---|---|---|---|
|Authorization|String|<br>Sim|<br>Token JWT gerado na API de token da autenticação.|



DELETE /v1/edital/{numeroEdital} Campos do path da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|numeroEdital|String||<br>Sim|<br>Número do edital|



A solicitação de cancelamento quando bem sucedida, retorna o status 200 sem conteúdo. 

Modelo do JSON da responsa de erro da requisição: 

www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

```
{
```

```
"codigo": 0,
"descricao": "string",
"campos": {}
}
```

Campos da responsa de erro da requisição: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|codigo|String|11|<br>Não|<br>Código interno.|
|<br>descricao|<br>String||Sim|<br>Breve descriçãointernoreferente ao código.|
|campos|Object||Não|Campos com erro na requisição.|



## [RFS-03] - Retificação de um edital simples 

A funcionalidade de retificação permite que o edital seja alterado caso o mesmo esteja com rejeição de publicação após análise do jornalista. 

API da funcionalidade: 

|**Método**|**Endpoint**|**Descrição**|
|---|---|---|
|PUT|/v1/edital/{numeroEdital}|<br>API de retificação do edital|



PUT /v1/edital/{numeroEdital} Campos do header da API: 

|**Campo**|**Tipo**|**Obrigatório**|**Descrição**|
|---|---|---|---|
|<br>Authorization|<br>String|<br>Sim|<br>Token JWT gerado na API de token da autenticação.|



PUT /v1/edital/{numeroEdital} Campos da path da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|numeroEdital|String||<br>Sim|<br>Número do edital|



PUT /v1/edital/{numeroEdital} Campos do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>tipoEdital|<br>Int|10|<br>Sim|<br>Código do tipo do edital|
|exibeMencao|Boolean||Não|<br>Se deve exibir a menção no edital|
|numeroMatricula|String|7|Não|<br>Número da matrícula|
|cnm|<br>String|19|Não|Número do CNM|



www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

|numeroProtocolo|String|20|Não|Número do protocolo/prenotação de referência<br>do edital|
|---|---|---|---|---|
|anexo|String|4.294.967.295|Não|Código base64 do anexo para cadastramento<br>no edital|
|numeroAto|String|30|Não|Número do ato|
|textoEdital|String|10000|Não|Texto do edital (Será utilizado quando não<br>existir o texto padrão do edital)|
|intimados|<br>Array||Sim|<br>Dados dos intimados|
|primeiroRequerente|Object||Não|Dados do primeiro requerente|
|<br>dadosServentia|<br>Object||Sim|Dados da serventia|
|dadosContrato|Object||Não|Dados do contrato|
|imovel|<br>Object||Não|Dados do endereço do imóvel do edital|



## PUT /v1/edital/{numeroEdital} 

## Campos do array intimados do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|documentoDes<br>conhecido|Boolean||<br>Não|<br>Informa se o documento do intimado é<br>desconhecido, caso seja true, não é necessário<br>informar o documento.|
|documento|String|14|Sim|Número do documento do intimado CPF ou<br>CNPJ , informar somente os números.|
|nome|String|50|Não|Nome completo do intimado ou razão social. A<br>API irá realizar a consulta do documento para<br>buscar as informações do nome.|
|endereco|<br>Object||Não|Dados do endereço dointimado|



## PUT /v1/edital/{numeroEdital} 

## Campos do objeto intimados/endereco do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>cep|<br>String|8|<br>Sim|<br>CEP do endereço.|
|<br>tipoLogradouro|<br>String|16|Sim|<br>Tipo do logradouro do endereço.|
|<br>logradouro|<br>String|150|Sim|<br>Logradouro do endereço.|
|<br>numero|<br>String|10|Não|<br>Número do imóvel.|
|bairro|<br>String|100|Sim|Bairro do endereço.|
|cidade|<br>String|100|Sim|<br>Cidade do endereço.|
|estado|<br>String|2|Sim|<br>Sigla do estado do endereço.|



## PUT /v1/edital 

## Campos do object primeiroRequerente do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>documento|<br>String|200|<br>Sim|<br>Documento do primeiro requerente|
|nome|<br>Number||Sim|<br>Nome do primeiro requerente|



PUT /v1/edital/{numeroEdital} 

Campos do object dadosServentia do body da API: 

www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>nomeOficial|<br>String|200|<br>Não|<br>Nome do oficial|
|cns|Number||Sim|Código CNS|
|denominacao|String|200|Não|<br>Denominação da serventia|
|endereco|Object||Não|Dados do endereço do intimado|



## PUT /v1/edital/{numeroEdital} Campos do objeto dadosServentia/endereco do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>cep|<br>String|8|<br>Sim|<br>CEP do endereço.|
|<br>tipoLogradouro|<br>String|16|Sim|<br>Tipo do logradouro do endereço.|
|<br>logradouro|<br>String|150|Sim|<br>Logradouro do endereço.|
|<br>numero|<br>String|10|Não|<br>Número do imóvel.|
|bairro|<br>String|100|Sim|Bairro do endereço.|
|cidade|<br>String|100|Sim|<br>Cidade do endereço.|
|estado|<br>String|2|Sim|<br>Sigla do estado do endereço.|



## PUT /v1/edital/{numeroEdital} Campos do objeto dadosContrato do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>nomeCredor|<br>String|400|<br>Sim|<br>Nome do credor|
|numero|<br>String|30|Sim|Número do contrato|
|dataContrato|<br>Date|10|Sim|Data do contrato|
|dataAssinatura<br>Contrato|Date|10|Sim|Data da assinatura do contrato|
|dataPosiciona<br>mentoDivida|Date|10|Sim|Data do posicionamento da divida|
|valorDivida|Number||Sim|Valor da dívida (Exemplo R$100,00 deverá ser<br>informado 100000)|
|cidadeAssinatu<br>ra|String|150|Sim|<br>Cidade onde foi assinado o contrato|
|estadoAssinatu<br>ra|String|2|Sim|Sigla do estado onde foi assinado o contrato|



## PUT /v1/edital/{numeroEdital} 

## Campos do objeto imovel do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|cep|String|8|<br>Sim|<br>CEP do endereço.|
|<br>tipoLogradouro|<br>String|16|Sim|<br>Tipo do logradouro do endereço.|
|<br>logradouro|<br>String|150|Sim|<br>Logradouro do endereço.|
|<br>numero|<br>String|10|Não|<br>Número do imóvel.|
|bairro|<br>String|100|Sim|Bairro do endereço.|
|cidade|<br>String|100|Sim|<br>Cidade do endereço.|
|estado|<br>String|2|Sim|Sigla do estado do endereço.|



www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

## Modelo do JSON da requisição no body: 

```
{
```

```
"tipoEdital": 0,
"exibeMencao": true,
```

```
"numeroMatricula": "string",
"cnm": "stringstringstrings",
"numeroProtocolo": "string",
```

```
"anexo": "string",
"numeroAto": "string",
"textoEdital": "string",
```

```
"intimados": [
```

```
"documentoDesconhecido": false,
```

```
"documento": "stringstrin",
```

```
"nome": "string",
```

```
"endereco": {
```

```
"cep": "string",
```

```
"tipoLogradouro": "string",
```

```
"logradouro": "string",
```

```
"numero": "string",
```

```
"bairro": "string",
```

```
"cidade": "string",
```

```
"estado": "st"
```

```
"primeiroRequerente": {
```

```
"documento": "string",
```

```
"nome": "string",
```

```
"dadosServentia": {
```

```
"nomeOficial": "string",
```

```
"cns": 0,
```

```
"denominacao": "string",
```

```
"endereco": {
```

```
"cep": "string",
```

```
"tipoLogradouro": "string",
```

```
"logradouro": "string",
```

www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

```
"numero": "string",
```

```
"bairro": "string",
```

```
"cidade": "string",
```

```
"estado": "st"
```

```
"dadosContrato": {
```

```
"nomeCredor": "string",
```

```
"numero": "string",
```

```
"dataContrato": "2022-08-04",
```

```
"dataAssinaturaContrato": "2022-08-04",
```

```
"dataPosicionamentoDivida": "2022-08-04",
```

```
"valorDivida": 10000,
```

```
"cidadeAssinatura": "string",
```

```
"estadoAssinatura": "st"
```

```
"imovel": {
```

```
"cep": "string",
```

```
"tipoLogradouro": "string",
```

```
"logradouro": "string",
```

```
"numero": "string",
```

```
"bairro": "string",
```

```
"cidade": "string",
"estado": "st"
  }
}
```

## Modelo do JSON da resposta de sucesso da requisição: 

```
{
"editaisCadastrados": [
    {
"hash": "string",
"documentosIntimados": [
"string"
      ],
"idsGerados": [
        0
      ],
"datasPublicacoes": [
"2022-08-04"
```

www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

```
"status": 0,
```

```
"dataStatus": "2022-08-04 15:16:23",
"urlPagamento": "string",
"valor": 10000,
```

```
"totalPublicacoes": 0
```

```
}
```

## Campos da resposta de sucesso da requisição: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>editaisCadastrados|<br>Array||<br>Sim|<br>Array com os dados dos editais cadastrados|
|status|<br>Int||Sim|<br>Situação atual do edital<br>_Tabela de domínio: EStatus_|
|dataStatus|DateTime|19|Sim|Data da situação do edital|
|urlPagamento|String|65.535|Não|URL de acesso ao pagamento|
|<br>valor|<br>Number||Sim|<br>Valor total da publicação do edital. O valor<br>será<br>informado em formato numérico.<br>(Exemplo R$100,00 deverá ser informado<br>100000)|
|totalPublicacoes|Int|2|Sim|<br>Total de publicações geradas|



## Campos do array editaisCadastrados da resposta de sucesso da requisição: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|hash|String|<br>8|<br>Sim|<br>Hash do edital|
|documentosIntimad<br>os|<br>String|16|Sim|Número do documento dos intimados de cada<br>edital|
|idsGerados|<br>String|150|Sim|IDs dos editais cadastrados|
|datasPublicacoes|Array|10|Não|Datas das publicações|



Modelo do JSON da resposta de erro da requisição: 

```
{
"codigo": 0,
"descricao": "string",
"campos": {}
}
```

Campos da resposta de erro da requisição: 

**Campo Tipo Tamanho Obrigatório Descrição** 

www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

|codigo|String|11|Não|Código interno.|
|---|---|---|---|---|
|<br>descricao|<br>String||Sim|<br>Breve descriçãointernoreferente ao código.|
|campos|Object||Não|Campos com erro na requisição.|



## [RFS-04] - Detalhes de um edital simples 

A funcionalidade de detalhamento do edital permite que o cartório realize a consulta dos detalhes de um edital previamente cadastrado. 

API da funcionalidade: 

|**Método**|**Endpoint**|**Descrição**|
|---|---|---|
|GET|/v1/edital/{numeroEdital}|<br>API de detalhes do edital|



GET /v1/edital/{numeroEdital} Campos do header da API: 

|**Campo**|**Tipo**|**Obrigatório**|**Descrição**|
|---|---|---|---|
|<br>Authorization|<br>String|<br>Sim|<br>Token JWT gerado na API de token da autenticação.|



GET /v1/edital/{numeroEdital} Campos da path da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>numeroEdital|<br>String||<br>Sim|<br>Número do edital|



## Modelo do JSON da resposta de sucesso da requisição: 

```
{
"uuid": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
"cnm": "string",
"numeroEdital": 0,
"tipoEdital": 0,
"descricaoTipo": "string",
"numeroMatricula": "string",
"numeroPublicacao": 0,
"paginas": 0,
"status": 0,
"descricaoStatus": "string",
"dataPublicacao": "2022-08-04",
```

www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

```
"numeroEdicao": 0,
```

```
"anoEdicao": 0,
```

```
"dataCadastro": "2022-08-04 10:00:00",
```

```
"urlPagamento": "string",
```

```
"urlRecibo": "string",
```

```
"editaisVinculados": [
```

```
"string"
```

```
  ],
```

```
"numeroProtocolo": "string",
"anexo": "string",
"numeroAto": "string",
```

```
"intimados": [
```

```
    {
```

```
"documento": "stringstrin",
```

```
"nome": "string",
"endereco": {
```

```
"cep": "string",
```

```
"tipoLogradouro": "string",
```

```
"logradouro": "string",
```

```
"numero": "string",
```

```
"bairro": "string",
"cidade": "string",
```

```
"estado": "st"
```

```
      }
```

```
    }
  ],
```

```
"primeiroRequerente": {
```

```
"documento": "string",
"nome": "string",
  },
```

```
"dadosServentia": {
"nomeOficial": "string",
"cns": 0,
"denominacao": "string",
```

```
"endereco": {
```

```
"cep": "string",
"tipoLogradouro": "string",
```

```
"logradouro": "string",
"numero": "string",
"bairro": "string",
"cidade": "string",
```

www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

```
"estado": "st"
```

```
"dadosContrato": {
```

```
"nomeCredor": "string",
```

```
"numero": "string",
```

```
"dataContrato": "2022-08-04",
```

```
"dataAssinaturaContrato": "2022-08-04",
```

```
"dataPosicionamentoDivida": "2022-08-04",
```

```
"valorDivida": 10000,
```

```
"cidadeAssinatura": "string",
```

```
"estadoAssinatura": "st"
```

```
"imovel": {
```

```
"cep": "string",
```

```
"tipoLogradouro": "string",
```

```
"logradouro": "string",
```

```
"numero": "string",
```

```
"bairro": "string",
```

```
"cidade": "string",
```

```
"estado": "st"
```

```
"motivoRejeicao": "string",
```

```
"editaisRetificador": [
```

```
"editalRejeitado": 0,
```

```
"editalRetificador": 0,
```

```
"uuidRetificador": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
```

```
  ]
}
```

## Campos da resposta de sucesso da requisição: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>uuid|<br>String|36|<br>Sim|<br>Hash do edital|
|cnm|<br>String|19|Sim|Número do CNM|
|numeroEdital|<br>Int|10|Sim|Número do edital|
|tipoEdital|Int|10|Sim|Código do tipo do edital|
|<br>descricaoTipo|String|250|Sim|<br>Descrição do tipo do edital|
|<br>numeroMatricula|<br>String|7|Não|<br>Número da matrícula|
|numeroPublicacao|<br>Int|11|Não|Número da publicação do edital|



www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

|paginas|Int|4|Não|Número de páginas do edital|
|---|---|---|---|---|
|<br>status|Int||Sim|<br>Situação atual do edital<br>_Tabela de domínio: EStatus_|
|descricaoStatus|String|250|Sim|Descrição da situação do edital|
|dataPublicacao|Date|10|Não|Data da publicação do edital|
|numeroEdicao|Int|11|Não|Número da edição da publicação do edital|
|anoEdicao|Int|4|Não|Ano da edição da publicação do edital|
|dataCadastro|DateTime|19|Sim|Data e hora de cadastro|
|urlPagamento|String|65.535|Não|URL de acesso ao pagamento|
|urlRecibo|String|65.535|Não|URL de acesso ao recibo|
|editaisVinculados|Array||Não|Número dos editais vinculados|
|numeroProtocolo|String|30|Não|Número do protocolo/prenotação de referência do<br>edital|
|anexo|String|4.294.967.295|Não|Código base64do anexo|
|numeroAto|String|30|Não|Número do ato|
|intimados|<br>Array||Sim|Dados dosintimados|
|primeiroRequerente|Object||Não|Dados do primeiro requerente|
|<br>dadosServentia|<br>Object||Sim|<br>Dados da serventia|
|dadosContrato|Object||Não|Dados do contrato|
|imovel|<br>Object||Sim|Dados do endereço doimóveldo edital|
|motivoRejeicao|String|65.535|Não|Texto explicativo do motivo da rejeição do edital|
|<br>retificacao|<br>Array||Não|<br>Informaçõe sobre os editais deretificação|



## Campos do array intimados do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|documento|String|14|<br>Sim|<br>Número do documento do intimado CPF ou<br>CNPJ (somente número)|
|nome|<br>String|200|Sim|<br>Nome completo do intimado ou razão social|
|endereco|Object||Não|Dados do endereço do intimado|



## Campos do objeto intimados/endereco do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>cep|<br>String|8|<br>Sim|<br>CEP do endereço.|
|<br>tipoLogradouro|<br>String|16|Sim|<br>Tipo do logradouro do endereço.|
|<br>logradouro|<br>String|150|Sim|<br>Logradouro do endereço.|
|<br>numero|<br>String|10|Não|<br>Número do imóvel.|
|bairro|<br>String|100|Sim|Bairro do endereço.|
|cidade|<br>String|100|Sim|<br>Cidade do endereço.|
|estado|<br>String|2|Sim|<br>Sigla do estado do endereço.|



## Campos do object primeiroRequerente do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>documento|<br>String|200|<br>Sim|<br>Documento do primeirorequerente|
|nome|Number||Sim|Nome do primeiro requerente|



www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

Campos do object dadosServentia do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>nomeOficial|<br>String|200|<br>Sim|<br>Nome do oficial|
|cns|Number||Sim|Código CNS|
|denominacao|String|200|Sim|<br>Denominação da serventia|
|endereco|Object||Não|Dados do endereço do intimado|



Campos do objeto dadosServentia/endereco do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>cep|<br>String|8|<br>Sim|<br>CEPdo endereço.|
|tipoLogradouro|String|16|Sim|Tipo do logradouro do endereço.|
|<br>logradouro|<br>String|150|Sim|<br>Logradouro do endereço.|
|numero|String|10|Não|Número do imóvel.|
|bairro|<br>String|100|Sim|Bairro do endereço.|
|cidade|String|100|Sim|Cidade do endereço.|
|estado|<br>String|2|Sim|<br>Sigla do estado do endereço.|



Campos do objeto dadosContrato do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|nomeCredor|String|400|<br>Sim|<br>Nome do credor|
|numero|<br>String|30|Sim|Número do contrato|
|dataContrato|<br>Date|10|Sim|Data do contrato|
|dataAssinatura<br>Contrato|Date|10|Sim|Data da assinatura do contrato|
|dataPosiciona<br>mentoDivida|Date|10|Sim|Data do posicionamento da divida|
|valorDivida|Number||Sim|Valor da dívida (Exemplo R$100,00 deverá ser<br>informado 100000)|
|cidadeAssinatu<br>ra|String|150|Sim|<br>Cidade onde foi assinado o contrato|
|estadoAssinatu<br>ra|<br>String|2|Sim|Sigla do estado onde foi assinado o contrato|



Campos do objeto imovel do body da API: 

|**Campo**|**Tipo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|---|
|<br>cep|<br>String||8|<br>Sim|<br>CEP do endereço.|
|<br>tipoLogradouro|<br>String||16|Sim|<br>Tipo do logradouro do endereço.|
|<br>logradouro|<br>String||150|Sim|<br>Logradouro do endereço.|
|<br>numero|<br>String||10|Não|<br>Número do imóvel.|
|bairro|<br>String||100|Sim|Bairro do endereço.|
|cidade|<br>String||100|Sim|<br>Cidade do endereço.|
|estado|<br>String||2|Sim|<br>Sigla do estado do endereço.|
|<br>Campos do array|||<br> retificacao:|||
|**Campo**||**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|



www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

|editalRejeitado|Int|11|Sim|Id do edital rejeitado|
|---|---|---|---|---|
|<br>editalRetificador|Int|11|Sim|<br>Id do edital retificador|
|uuidRetificador|String|36|Sim|Hash do grupo de editais retificador|



## Modelo do JSON da resposta de erro da requisição: 

```
{
"codigo": 0,
"descricao": "string",
"campos": {}
}
```

## Campos da resposta de erro da requisição: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|codigo|String|11|<br>Não|<br>Código interno.|
|<br>descricao|<br>String||Sim|<br>Breve descrição interno referente ao código.|
|campos|<br>Object||Não|<br>Campos com erro na requisição.|



www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

## Descrição das Funcionalidades - Edital leilão 

## [RFL-01] - Cadastramento de um edital leilão 

A funcionalidade do cadastramento do edital permite que o cartório e empresas de leilão realizem o cadastramento dos editais sem a necessidade de acessar o gerenciamento de pagamentos disponibilizado na intranet. 

## API da funcionalidade: 

|**Endpoint**|**Descrição**|
|---|---|
|/v1/edital/leilao|<br>API de cadastramento do edital|



## POST /v1/edital/leilao 

Campos do header da API: 

|**Campo**|**Tipo**|**Obrigatório**|**Descrição**|
|---|---|---|---|
|<br>Authorization|<br>String|<br>Sim|<br>Token JWT gerado na API de token da autenticação.|



## POST /v1/edital/leilao 

Campos do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|tipoEdital|Int|10|<br>Sim|<br>Código do tipo do edital|
|<br>sumario|Object||Sim|<br>Dados do sumário|
|leilao|<br>Object||Sim|Dados do leilão|
|intimados|<br>Array||Sim|Dados dos intimados|
|imoveis|Array||Sim|Dados dos imóveis|
|dadosCredor|Object||Sim|Dados do credor|
|informacoesGerai<br>s|<br>Object||Sim|Informações gerais|
|cobranca|Object||Não|Define os dados para a geração da<br>cobrança do edital|
|webhook|Object||Não|Dados de webhook para notificação|



## POST /v1/edital/leilao 

## Campos do object sumario do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|publicacao|Object||<br>Sim|<br>Dados da publicação|
|<br>foro|<br>Object||Não|<br>Dados do foro|
|titulo|<br>String|85|Não|Título do sumário|
|subtitulo|<br>String|85|Não|Subtítulo do sumário|
|subtitulo2|<br>String|85|Não|Subtítulo 2 do sumário|
|texto|<br>String||Não|Texto do sumário|



www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

## POST /v1/edital/leilao 

## Campos do object sumario/publicacao do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|numeroPublica<br>cao|String|30|<br>Sim|<br>Número da publicação|
|objeto|<br>String|200|Sim|<br>Objeto|
|descricao|String|60|Não|Descrição|



## POST /v1/edital/leilao 

Campos do object sumario/foro do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>local|<br>String|150|<br>Não|<br>Local|
|dataPorExtens<br>o|String|50|Não|Data por extenso|
|texto|<br>String|65.535|Não|<br>Texto|



## POST /v1/edital/leilao 

Campos do array leilao do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|modalidade|String|30|<br>Sim|<br>Modalidade do leilão<br>_Tabela de domínio: LModalidade_|
|modoDisputa|String|30|Sim|Modo de disputa<br>_Tabela de domínio: LDisputa_|
|tipo|String|200|Sim|Tipo|
|linkDisputa|String|800|Não|Link da disputa online|
|leiloes|Array||Sim|Data e hora dos leilões|
|leiloeiro|Object||Sim|Dados do leiloeiro oficial|
|preposto|Object||Sim|Dados do preposto|



POST /v1/edital/leilao Campos do array leilao/leiloes do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório **|**Descrição**|
|---|---|---|---|---|
|data|Date|10|Sim|Data do leilão|
|hora|Time|5|Sim|Horário do leilão|



www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

## POST /v1/edital/leilao Campos do object leilao/leiloeiro do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|documento|String|11|<br>Sim|<br>Número do CPF do leiloeiro (somente número)|
|nome|String|200|Sim|Nome do leiloeiro|
|numeroInscrica<br>o|<br>String|100|Sim|Número de inscrição do leiloeiro|
|numeroTelefon<br>e|String|11|Sim|Número de telefone do leiloeiro|
|email|<br>String|200|Sim|Endereço de e-mail do leiloeiro|
|endereco|Object||Não|Dados do endereço do leiloeiro|



## POST /v1/edital/leilao 

## Campos do objeto leilao/leiloeiro/endereco do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|cep|String|8|<br>Não|<br>CEP do endereço.|
|<br>tipoLogradouro|<br>String|16|Não|<br>Tipo dologradouro do endereço.|
|logradouro|String|150|Não|Logradouro do endereço.|
|<br>numero|<br>String|10|Não|<br>Número doimóvel.|
|bairro|String|100|Não|Bairro do endereço.|
|cidade|<br>String|100|Não|<br>Cidade do endereço.|
|estado|String|2|Não|Sigla do estado do endereço.|



## POST /v1/edital/leilao Campos do object leilao/preposto do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>documento|<br>String|11|<br>Não|<br>Número do CPF do preposto (somente número)|
|nome|String|200|Não|Nome do preposto|
|numeroInscrica<br>o|String|100|Não|Número de inscrição do preposto|
|numeroTelefon<br>e|String|11|Não|Número de telefone do preposto|
|email|<br>String|200|Não|<br>Endereço de e-mail do preposto|
|endereco|Object||Não|Dados do endereço do preposto|



## POST /v1/edital/leilao 

## Campos do objeto leilao/preposto/endereco do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|cep|String|8|<br>Não|<br>CEP do endereço.|
|<br>tipoLogradouro|<br>String|16|Não|<br>Tipo do logradouro do endereço.|
|<br>logradouro|<br>String|150|Não|<br>Logradouro do endereço.|
|<br>numero|<br>String|10|Não|<br>Número do imóvel.|
|bairro|<br>String|100|Não|Bairro do endereço.|



www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

|cidade|String|100|Não|Cidade do endereço.|
|---|---|---|---|---|
|estado|<br>String|2|Não|Sigla do estado do endereço.|



## POST /v1/edital/leilao 

## Campos do array intimados do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório **|**Descrição**|
|---|---|---|---|---|
|documentoDes<br>conhecido|Boolean||Não|Informa se o documento do intimado é<br>desconhecido, caso seja true, não é necessário<br>informar o documento.|
|documento|String|14|Sim|Número do documento do intimado CPF ou<br>CNPJ ,informarsomente osnúmeros.|
|nome|String|50|Sim|Nome completo do intimado ou razão social. A<br>API irá realizar a consulta do documento para<br>buscar as informações do nome.|



## POST /v1/edital/leilao 

## Campos do array imoveis do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|numeroLote|String|14|<br>Sim|<br>Número do lote|
|idImovel|String|200|Sim|ID do imóvel|
|numeroMatricul<br>a|<br>String|200|Sim|Matrícula|
|tipoImovel|<br>String|200|Sim|Tipo de imóvel|
|condicoes|<br>String|200|Sim|Condição|
|cns|<br>String|6|Sim|<br>Código CNS da serventia onde fica o imóvel|
|leiloes|<br>Array||Não|<br>Dados dos leilões|
|consideracoes|<br>String|65.535|Não|Considerações importantes|
|endereco|<br>Object||Sim|Dados do endereço do imóvel|



## POST /v1/edital/leilao 

Campos do array imoveis/leiloes do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>valor|<br>Number||<br>Sim|<br>Valor do leilão|



## POST /v1/edital/leilao 

## Campos do objeto imoveis/endereco do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>cep|<br>String|8|<br>Sim|<br>CEP do endereço.|
|<br>tipoLogradouro|<br>String|16|Sim|Tipo do logradouro do endereço.|
|<br>logradouro|<br>String|150|Sim|<br>Logradouro do endereço.|
|<br>numero|<br>String|10|Sim|<br>Número do imóvel.|
|unidade|<br>String|10|Não|Unidade do imóvel|



www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

|lote|String|10|Não|Lote do imóvel|
|---|---|---|---|---|
|quadra|<br>String|10|Não|Quadra doimóvel|
|torre|String|10|Não|Torre do imóvel|
|bloco|<br>String|10|Não|Bloco doimóvel|
|nomeLoteamen<br>to|String|100|Não|Nome do loteamento do imóvel|
|nomeCondomi<br>nio|String|100|Não|Nome do condomínio do imóvel|
|complemento|<br>String|10|Não|Complemento doimóvel|
|bairro|String|100|Sim|Bairro do endereço.|
|cidade|<br>String|100|Sim|<br>Cidade do endereço.|
|estado|String|2|Sim|Sigla do estado do endereço.|
|vagas|<br>Array||Não|<br>Vagas de garagem|



## POST /v1/edital/leilao 

## Campos do objeto dadosCredor do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório **|**Descrição**|
|---|---|---|---|---|
|documento|String|19|Sim|Número do CNPJ do credor (somente número)|
|nome|<br>String|400|Sim|<br>Nome do credor|
|cidade|String|100|Sim|Cidade do credor|
|estado|<br>String|100|Sim|Estado do credor|



## POST /v1/edital/leilao 

## Campos do objeto informacoesGerais do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório **|**Descrição**|
|---|---|---|---|---|
|titulo|String|200|Sim|Título das informações gerais|
|texto|<br>String|65.535|Sim|<br>Texto comasinformações gerais|



## POST /v1/edital/leilao 

## Campos do objeto cobranca do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>observacao|<br>String|30|<br>Não|<br>Observações<br>para<br>serem<br>adicionadas na<br>cobrança|
|dadosPagador|<br>Object||Sim|Dados do pagador|



## POST /v1/edital/leilao 

## Campos do objeto cobranca/dadosPagador do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|nome|String|60|<br>Sim|<br>Nome do pagador.|
|documento|<br>String|14|Sim|<br>Número do documento (CPF/CNPJ) do pagador<br>(somente número).|
|email|String|150|Sim|Endereço de e-mail do pagador.|
|telefone|<br>Object||Não|<br>Dados do telefone do pagador.|
|endereco|Object||Sim|Dados do endereço do pagador.|



www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

## POST /v1/edital/leilao 

## Campos do objeto cobranca/dadosPagador/telefone do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|ddd|Number|<br>3|<br>Não|<br>Número do DDD do telefone.|
|numero|Number|10|Não|Número do telefone.|



## POST /v1/edital/leilao 

## Campos do objeto cobranca/dadosPagador/endereco do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|cep|String|<br>8|<br>Sim|<br>CEP do endereço do pagador.|
|<br>tipoLogradouro|<br>String|16|Sim|<br>Tipo do logradouro do endereço do pagador.|
|<br>logradouro|<br>String|150|Sim|<br>Logradouro do endereço do pagador.|
|<br>numero|<br>String|10|Não|<br>Número do imóvel do pagador.|
|bairro|<br>String|100|Sim|<br>Bairro do endereço do pagador.|
|cidade|<br>String|100|Sim|<br>Cidade do endereço do pagador.|
|estado|<br>String|2|Sim|<br>Sigla do estado do endereço do pagador.|



## POST /v1/edital/leilao 

Campos do objeto webhook do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>url|<br>String||<br>Sim|<br>URL do webhook|
|metodo|<br>String||Sim|Tipo do método de comunicação<br>_Tabela de domínio: WebHookMetodo_|



## Modelo do JSON da requisição no body: 

```
{
"tipoEdital": 0,
"sumario": {
"publicacao": {
"numeroPublicacao": "string",
"objeto": "string",
"descricao": "string"
    },
"foro": {
"local": "string",
"dataPorExtenso": "string",
"texto": "string"
    },
"titulo": "string",
```

www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

```
"subtitulo": "string",
```

```
"subtitulo2": "string",
"texto": "string"
  },
"leilao": {
"modalidade": "online",
"modoDisputa": "aberto",
"tipo": "string",
"linkDisputa": "string",
"leiloes": [
      {
```

```
"data": "2022-08-04",
```

```
"hora": "10:22"
```

```
      }
    ],
```

```
"leiloeiro": {
"documento": "stringstrin",
```

```
"nome": "string",
"numeroInscricao": "string",
"numeroTelefone": "string",
```

```
"email": "string",
"endereco": {
```

```
"cep": "string",
"tipoLogradouro": "string",
```

```
"logradouro": "string",
```

```
"numero": "string",
"complemento": "string",
"bairro": "string",
"cidade": "string",
```

```
"estado": "st"
```

```
      }
    },
"preposto": {
"documento": "stringstrin",
```

```
"nome": "string",
"numeroInscricao": "string",
"numeroTelefone": "string",
"email": "string",
"endereco": {
"cep": "string",
"tipoLogradouro": "string",
```

www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

```
"logradouro": "string",
"numero": "string",
"complemento": "string",
"bairro": "string",
"cidade": "string",
"estado": "st"
      }
    }
  },
"intimados": [
    {
"documentoDesconhecido": false,
"documento": "stringstrin",
```

```
"nome": "string"
    }
  ],
"imoveis": [
    {
```

```
"numeroLote": "stringstrin",
```

```
"idImovel": "string",
"numeroMatricula": "string",
```

```
"tipoImovel": "string",
```

```
"condicoes": "string",
```

```
"cns": "string",
"leiloes": [
```

```
        {
```

```
"valor": 0
```

```
        }
      ],
"consideracoes": "string",
```

```
"endereco": {
"cep": "string",
"tipoLogradouro": "string",
```

```
"logradouro": "string",
```

```
"numero": "string",
"unidade": "string",
```

```
"lote": "string",
"quadra": "string",
"torre": "string",
"bloco": "string",
"nomeLoteamento": "string",
```

www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

```
"nomeCondominio": "string",
"complemento": "string",
"bairro": "string",
"cidade": "string",
"estado": "st",
"vagas": [
"string"
```

```
        ]
      }
    }
  ],
"dadosCredor": {
"documento": "stringstringstrings",
```

```
"nome": "string",
"cidade": "string",
"estado": "string"
  },
```

```
"informacoesGerais": {
"titulo": "string",
"texto": "string"
  },
"cobranca": {
```

```
"observacao": "string",
"dadosPagador": {
"nome": "string",
"documento": "string",
```

```
"email": "string",
"telefone": {
```

```
"ddd": 0,
```

```
"numero": 0
```

```
      },
```

```
"endereco": {
```

```
"cep": "string",
"tipoLogradouro": "string",
"logradouro": "string",
"numero": "string",
"bairro": "string",
"cidade": "string",
"estado": "st"
      }
    }
```

www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

```
"webhook": {
```

```
"url": "string",
```

```
"metodo": "string"
```

```
}
```

## Modelo do JSON da resposta de sucesso da requisição: 

```
{
```

```
"hash": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
"status": 0,
"dataStatus": "2022-08-04 15:16:23",
"urlPagamento": "string",
"valor": 10000,
"totalPublicacoes": 0,
"datasPublicacoes": [
"2022-08-04"
  ]
}
```

## Campos da resposta de sucesso da requisição: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>hash|<br>String|<br>36|<br>Sim|<br>Hashdo edital|
|status|Int||Sim|Situação atual do edital<br>_Tabela de domínio: EStatus_|
|dataStatus|DateTime|19|Sim|Data da situação do edital|
|urlPagamento|String|65.535|Não|URL de acesso ao pagamento|
|<br>valor|<br>Number||Sim|<br>Valor total da publicação do edital. O valor<br>será<br>informado em formato numérico.<br>(Exemplo R$100,00 deverá ser informado<br>100000)|
|totalPublicacoes|Int|2|Sim|<br>Totalde publicações geradas|
|datasPublicacoes|Array||Sim|Datas das publicações|



## Modelo do JSON da responsa de erro da requisição: 

```
{
```

```
"codigo": 0,
"descricao": "string",
"campos": {}
}
```

www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

Campos da responsa de erro da requisição: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|codigo|String|11|<br>Não|<br>Código interno.|
|<br>descricao|<br>String||Sim|<br>Breve descrição interno referente ao código.|
|campos|<br>Object||Não|<br>Campos com erro na requisição.|



## [RFL-02] - Cancelamento de um edital leilão 

A funcionalidade de cancelamento permite que o cartório ou a empresa de leilão realize o cancelamento de um edital que não tenha sido pago ou publicado. 

API da funcionalidade: 

|**Método**|**Endpoint**|**Descrição**|
|---|---|---|
|DELETE|/v1/edital/leilao/{numeroEdital}|<br>API de cancelamento do edital|



DELETE /v1/edital/leilao/{numeroEdital} Campos do header da API: 

|**Campo**|**Tipo**|**Obrigatório**|**Descrição**|
|---|---|---|---|
|<br>Authorization|<br>String|<br>Sim|<br>Token JWT gerado na API de token da autenticação.|



DELETE /v1/edital/leilao/{numeroEdital} Campos do path da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>numeroEdital|<br>String||<br>Sim|<br>Número do edital|



A solicitação de cancelamento quando bem sucedida, retorna o status 200 sem conteúdo. 

Modelo do JSON da responsa de erro da requisição: 

```
{
"codigo": 0,
"descricao": "string",
"campos": {}
}
```

www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

Campos da responsa de erro da requisição: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|codigo|String|11|<br>Não|<br>Código interno.|
|<br>descricao|<br>String||Sim|<br>Breve descrição interno referente ao código.|
|campos|<br>Object||Não|<br>Campos com erro na requisição.|



## [RFL-03] - Retificação de um edital leilão 

A funcionalidade de retificação permite que o edital seja alterado caso o mesmo esteja com rejeição de publicação após análise do jornalista. 

API da funcionalidade: 

|**Método**|**Endpoint**|**Descrição**|
|---|---|---|
|PUT|<br>/v1/edital/leilao/{numeroEdital}|<br>API de retificação do edital|



PUT /v1/edital/leilao/{numeroEdital} Campos do header da API: 

|**Campo**|**Tipo**|**Obrigatório**|**Descrição**|
|---|---|---|---|
|<br>Authorization|<br>String|<br>Sim|<br>Token JWT gerado na API de token da autenticação.|



PUT /v1/edital/leilao/{numeroEdital} Campos da path da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|numeroEdital|String||<br>Sim|<br>Número do edital|



PUT /v1/edital/leilao/{numeroEdital} Campos do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>tipoEdital|<br>Int|10|<br>Sim|<br>Código do tipo do edital|
|exibeMencao|Boolean||Não|<br>Se deve exibir a menção no edital|
|sumario|Object||Sim|<br>Dados do sumário|
|leilao|<br>Object||Sim|Dados do leilão|
|intimados|<br>Array||Sim|Dados dos intimados|
|imoveis|<br>Array||Sim|Dados dos imóveis|
|dadosCredor|<br>Object||Sim|Dados do credor|



www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

|informacoesGerai<br>s|Object||Sim|Informações gerais|
|---|---|---|---|---|



## PUT /v1/edital/leilao/{numeroEdital} Campos do object sumario do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>publicacao|<br>Object||<br>Sim|<br>Dados da publicação|
|foro|<br>Object||Não|Dados do foro|
|titulo|<br>String|85|Não|Título do sumário|
|subtitulo|<br>String|85|Não|Subtítulo do sumário|
|subtitulo2|<br>String|85|Não|Subtítulo 2 do sumário|
|texto|<br>String||Não|Texto do sumário|



## POST /v1/edital/leilao/{numeroEdital} Campos do object sumario/publicacao do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>numeroPublica<br>cao|<br>String|30|<br>Sim|<br>Número da publicação|
|objeto|<br>String|200|Sim|Objeto|
|descricao|String|60|Não|Descrição|



## PUT /v1/edital/leilao/{numeroEdital} Campos do object sumario/foro do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>local|<br>String|150|<br>Não|<br>Local|
|dataPorExtens<br>o|String|50|Não|Data por extenso|
|texto|<br>String|65.535|Não|<br>Texto|



PUT /v1/edital/leilao/{numeroEdital} Campos do array leilao do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>modalidade|<br>String|30|<br>Sim|<br>Modalidade do leilão<br>_Tabela de domínio: LModalidade_|
|modoDisputa|<br>String|30|Sim|Modo de disputa<br>_Tabela de domínio: LDisputa_|
|tipo|String|200|Sim|Tipo|
|linkDisputa|String|800|Não|Link da disputa online|
|leiloes|Array||Sim|Data e hora dos leilões|
|leiloeiro|Object||Sim|Dados do leiloeiro oficial|
|preposto|Object||Sim|Dados do preposto|



## PUT /v1/edital/leilao/{numeroEdital} 

www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

Campos do array leilao/leiloes do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>data|<br>Date|10|<br>Sim|<br>Data do leilão|
|hora|Time|5|Sim|Horário do leilão|



## PUT /v1/edital/leilao 

## Campos do object leilao/leiloeiro do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|documento|String|11|<br>Sim|<br>Número do CPF do leiloeiro (somente número)|
|nome|String|200|Sim|Nome do leiloeiro|
|numeroInscrica<br>o|<br>String|100|Sim|Número de inscrição do leiloeiro|
|numeroTelefon<br>e|String|11|Sim|Número de telefone do leiloeiro|
|email|<br>String|200|Sim|Endereço de e-mail do leiloeiro|
|endereco|Object||Não|Dados do endereço do leiloeiro|



## PUT /v1/edital/leilao/{numeroEdital} Campos do objeto leilao/leiloeiro/endereco do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>cep|<br>String|8|<br>Não|<br>CEP do endereço.|
|<br>tipoLogradouro|<br>String|16|Não|<br>Tipo do logradouro do endereço.|
|<br>logradouro|<br>String|150|Não|<br>Logradouro do endereço.|
|<br>numero|<br>String|10|Não|<br>Número do imóvel.|
|bairro|<br>String|100|Não|Bairro do endereço.|
|cidade|<br>String|100|Não|<br>Cidade do endereço.|
|estado|<br>String|2|Não|<br>Sigla do estado do endereço.|



## PUT /v1/edital/leilao/{numeroEdital} Campos do object leilao/preposto do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|documento|String|11|<br>Não|<br>Número do CPF do preposto (somente número)|
|nome|String|200|Não|Nome do preposto|
|numeroInscrica<br>o|<br>String|100|Não|<br>Número de inscrição do preposto|
|numeroTelefon<br>e|String|11|Não|Número de telefone do preposto|
|email|<br>String|200|Não|<br>Endereço de e-mail do preposto|
|endereco|Object||Não|Dados do endereço do preposto|



## PUT /v1/edital/leilao/{numeroEdital} 

Campos do objeto leilao/preposto/endereco do body da API: 

**Campo Tipo Tamanho Obrigatório Descrição** 

www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

|cep|String|8|Não|CEP do endereço.|
|---|---|---|---|---|
|tipoLogradouro|<br>String|16|Não|Tipo dologradouro do endereço.|
|logradouro|String|150|Não|Logradouro do endereço.|
|<br>numero|<br>String|10|Não|<br>Número doimóvel.|
|bairro|String|100|Não|Bairro do endereço.|
|cidade|<br>String|100|Não|Cidade do endereço.|
|estado|String|2|Não|Sigla do estado do endereço.|



## PUT /v1/edital/leilao/{numeroEdital} Campos do array intimados do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>documentoDes<br>conhecido|<br>Boolean||<br>Não|<br>Informa se o documento do intimado é<br>desconhecido, caso seja true, não é necessário<br>informar o documento.|
|documento|String|14|Sim|Número do documento do intimado CPF ou<br>CNPJ , informar somente os números.|
|nome|<br>String|50|Não|Nome completo do intimado ou razão social. A<br>API irá realizar a consulta do documento para<br>buscar as informações do nome.|



## PUT /v1/edital/leilao/{numeroEdital} Campos do array imoveis do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>numeroLote|<br>String|14|<br>Sim|<br>Número do lote|
|idImovel|<br>String|200|Sim|ID do imóvel|
|numeroMatricul<br>a|String|200|Sim|Matrícula|
|tipoImovel|<br>String|200|Sim|Tipo de imóvel|
|<br>condicoes|<br>String|200|Sim|<br>Condição|
|cns|<br>String|6|Sim|Código CNS da serventia onde fica o imóvel|
|leiloes|<br>Array||Não|<br>Dados dos leilões|
|consideracoes|<br>String|65.535|Não|Considerações importantes|
|endereco|<br>Object||Sim|<br>Dados do endereço do imóvel|



PUT /v1/edital/leilao/{numeroEdital} Campos do array imoveis/leiloes do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|valor|Number||<br>Sim|<br>Valor do leilão|



PUT /v1/edital/leilao/{numeroEdital} Campos do objeto imoveis/endereco do body da API: 

**Campo Tipo Tamanho Obrigatório Descrição** 

www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

|cep|String|8|Sim|CEP do endereço.|
|---|---|---|---|---|
|tipoLogradouro|<br>String|16|Sim|Tipo dologradouro do endereço.|
|logradouro|String|150|Sim|Logradouro do endereço.|
|<br>numero|<br>String|10|Sim|<br>Número doimóvel.|
|unidade|String|10|Não|Unidade do imóvel|
|lote|<br>String|10|Não|Lote doimóvel|
|quadra|String|10|Não|Quadra do imóvel|
|torre|<br>String|10|Não|Torre doimóvel|
|bloco|String|10|Não|Bloco do imóvel|
|nomeLoteamen<br>to|<br>String|100|Não|Nome do loteamento do imóvel|
|nomeCondomi<br>nio|String|100|Não|Nome do condomínio doimóvel|
|complemento|String|10|Não|Complemento do imóvel|
|<br>bairro|<br>String|100|Sim|<br>Bairro do endereço.|
|cidade|String|100|Sim|Cidade do endereço.|
|estado|<br>String|2|Sim|<br>Sigla do estado do endereço.|
|vagas|Array||Não|Vagas de garagem|



## PUT /v1/edital/leilao/{numeroEdital} Campos do objeto dadosCredor do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>documento|<br>String|19|<br>Sim|<br>Número do CNPJ do credor(somentenúmero)|
|nome|String|400|Sim|Nome do credor|
|cidade|<br>String|100|Sim|Cidade do credor|
|estado|String|100|Sim|Estado do credor|



## PUT /v1/edital/leilao/{numeroEdital} 

## Campos do objeto informacoesGerais do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>titulo|<br>String|200|<br>Sim|<br>Título dasinformações gerais|
|texto|String|65.535|Sim|Texto com as informações gerais|



## Modelo do JSON da requisição no body: 

```
{
"tipoEdital": 0,
"exibeMencao": true,
"sumario": {
"publicacao": {
"numeroPublicacao": "string",
"objeto": "string",
"descricao": "string"
```

www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

```
    },
```

```
"foro": {
"local": "string",
"dataPorExtenso": "string",
"texto": "string"
```

```
    },
```

```
"titulo": "string",
"subtitulo": "string",
"subtitulo2": "string",
"texto": "string"
```

```
  },
```

```
"leilao": {
```

```
"modalidade": "online",
```

```
"modoDisputa": "aberto",
```

```
"tipo": "string",
"linkDisputa": "string",
"leiloes": [
```

```
      {
```

```
"data": "2022-08-04",
```

```
"hora": "10:22"
```

```
      }
```

```
    ],
```

```
"leiloeiro": {
```

```
"documento": "stringstrin",
```

```
"nome": "string",
"numeroInscricao": "string",
"numeroTelefone": "string",
```

```
"email": "string",
"endereco": {
```

```
"cep": "string",
"tipoLogradouro": "string",
```

```
"logradouro": "string",
```

```
"numero": "string",
"complemento": "string",
```

```
"bairro": "string",
```

```
"cidade": "string",
```

```
"estado": "st"
```

```
      }
```

```
    },
"preposto": {
"documento": "stringstrin",
```

www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

```
"nome": "string",
```

```
"numeroInscricao": "string",
```

```
"numeroTelefone": "string",
"email": "string",
"endereco": {
```

```
"cep": "string",
"tipoLogradouro": "string",
```

```
"logradouro": "string",
```

```
"numero": "string",
```

```
"complemento": "string",
```

```
"bairro": "string",
```

```
"cidade": "string",
```

```
"estado": "st"
```

```
      }
    }
  },
```

```
"intimados": [
```

```
    {
```

```
"documentoDesconhecido": false,
```

```
"documento": "stringstrin",
```

```
"nome": "string"
```

```
    }
  ],
"imoveis": [
```

```
    {
```

```
"numeroLote": "stringstrin",
```

```
"idImovel": "string",
"numeroMatricula": "string",
```

```
"tipoImovel": "string",
```

```
"condicoes": "string",
```

```
"cns": "string",
"leiloes": [
        {
"valor": 0
        }
      ],
"consideracoes": "string",
"endereco": {
"cep": "string",
"tipoLogradouro": "string",
"logradouro": "string",
```

www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

```
"numero": "string",
"unidade": "string",
"lote": "string",
"quadra": "string",
"torre": "string",
"bloco": "string",
"nomeLoteamento": "string",
"nomeCondominio": "string",
"complemento": "string",
"bairro": "string",
"cidade": "string",
"estado": "st",
"vagas": [
"string"
        ]
      }
    }
  ],
"dadosCredor": {
"documento": "stringstringstrings",
"nome": "string",
"cidade": "string",
"estado": "string"
  },
"informacoesGerais": {
"titulo": "string",
"texto": "string"
  }
}
```

## Modelo do JSON da resposta de sucesso da requisição: 

```
{
"hash": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
"status": 0,
"dataStatus": "2022-08-04 15:16:23",
"urlPagamento": "string",
"valor": 10000,
```

www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

```
"totalPublicacoes": 0,
```

```
"datasPublicacoes": [
```

```
"2022-08-04"
```

```
}
```

Campos da resposta de sucesso da requisição: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|hash|String|<br>36|<br>Sim|<br>Hash do edital|
|status|<br>Int||Sim|Situação atual do edital<br>_Tabela de domínio: EStatus_|
|dataStatus|DateTime|19|Sim|Data da situação do edital|
|urlPagamento|String|65.535|Não|URL de acesso ao pagamento|
|valor|Number||Sim|Valor total da publicação do edital. O valor<br>será<br>informado em formato numérico.<br>(Exemplo R$100,00 deverá ser informado<br>100000)|
|totalPublicacoes|Int|2|Sim|Total de publicações geradas|
|datasPublicacoes|Array||Sim|<br>Datas das publicações|



## Modelo do JSON da resposta de erro da requisição: 

```
{
"codigo": 0,
"descricao": "string",
"campos": {}
}
```

Campos da resposta de erro da requisição: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>codigo|<br>String|11|<br>Não|<br>Código interno.|
|<br>descricao|<br>String||Sim|<br>Breve descrição interno referente ao código.|
|campos|<br>Object||Não|<br>Campos com erro na requisição.|



## [RFL-04] - Detalhes de um edital leilão 

A funcionalidade de detalhamento do edital permite que o cartório ou a empresa de leilão realize a consulta dos detalhes de um edital previamente cadastrado. 

API da funcionalidade: 

www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

|**Método**|**Endpoint**|**Descrição**|
|---|---|---|
|GET|<br>/v1/edital/leilao/{numeroEdital}|<br>APIde detalhes do edital|



GET /v1/edital/leilao/{numeroEdital} Campos do header da API: 

|**Campo**|**Tipo**|**Obrigatório**|**Descrição**|
|---|---|---|---|
|Authorization|String|<br>Sim|<br>Token JWT gerado na API de token da autenticação.|



GET /v1/edital/leilao/{numeroEdital} Campos da path da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>numeroEdital|<br>String||<br>Sim|<br>Número do edital|



Modelo do JSON da resposta de sucesso da requisição: 

```
{
"uuid": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
"cnm": "string",
"numeroEdital": 0,
"tipoEdital": 0,
"descricaoTipo": "string",
"numeroPublicacao": 0,
"paginas": 0,
"status": 0,
"descricaoStatus": "string",
"dataPublicacao": "2022-08-04",
"numeroEdicao": 0,
"anoEdicao": 0,
"dataCadastro": "2022-08-04 10:00:00",
"urlPagamento": "string",
"urlRecibo": "string",
"editaisVinculados": [
"string"
  ],
"anexo": "string",
"sumario": {
"publicacao": {
"numeroPublicacao": "string",
"objeto": "string",
"descricao": "string"
```

www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

```
    },
```

```
"foro": {
"local": "string",
"dataPorExtenso": "string",
"texto": "string"
```

```
    },
```

```
"titulo": "string",
"subtitulo": "string",
"subtitulo2": "string",
"texto": "string"
```

```
  },
```

```
"leilao": {
```

```
"modalidade": "online",
```

```
"modoDisputa": "aberto",
```

```
"tipo": "string",
"linkDisputa": "string",
"leiloes": [
```

```
      {
```

```
"data": "2022-08-04",
```

```
"hora": "10:22"
```

```
      }
```

```
    ],
```

```
"leiloeiro": {
```

```
"documento": "stringstrin",
```

```
"nome": "string",
"numeroInscricao": "string",
"numeroTelefone": "string",
```

```
"email": "string",
"endereco": {
```

```
"cep": "string",
"tipoLogradouro": "string",
```

```
"logradouro": "string",
```

```
"numero": "string",
"complemento": "string",
```

```
"bairro": "string",
```

```
"cidade": "string",
```

```
"estado": "st"
```

```
      }
```

```
    },
"preposto": {
"documento": "stringstrin",
```

www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

```
"nome": "string",
```

```
"numeroInscricao": "string",
```

```
"numeroTelefone": "string",
```

```
"email": "string",
"endereco": {
```

```
"cep": "string",
```

```
"tipoLogradouro": "string",
```

```
"logradouro": "string",
```

```
"numero": "string",
```

```
"complemento": "string",
```

```
"bairro": "string",
```

```
"cidade": "string",
```

```
"estado": "st"
```

```
      }
```

```
    }
  },
```

```
"intimados": [
```

```
    {
```

```
"documento": "stringstrin",
```

```
"nome": "string"
```

```
    }
```

```
  ],
"imoveis": [
```

```
    {
```

```
"numeroLote": "stringstrin",
```

```
"idImovel": "string",
"numeroMatricula": "string",
"tipoImovel": "string",
```

```
"condicoes": "string",
```

```
"cns": "string",
"leiloes": [
```

```
        {
"valor": 0
        }
      ],
"consideracoes": "string",
"endereco": {
"cep": "string",
"tipoLogradouro": "string",
"logradouro": "string",
"numero": "string",
```

www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

```
"unidade": "string",
"lote": "string",
"quadra": "string",
"torre": "string",
"bloco": "string",
"nomeLoteamento": "string",
"nomeCondominio": "string",
"complemento": "string",
"bairro": "string",
"cidade": "string",
"estado": "st",
"vagas": [
"string"
```

```
"dadosCredor": {
"documento": "stringstringstrings",
"nome": "string",
"cidade": "string",
"estado": "string"
"informacoesGerais": {
"titulo": "string",
"texto": "string"
"motivoRejeicao": "string",
"editaisRetificador": [
"editalRejeitado": 0,
"editalRetificador": 0,
"uuidRetificador": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
```

Campos da resposta de sucesso da requisição: 

**Campo** 

**Tipo Tamanho Obrigatório Descrição** 

www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

|uuid|String|36|Sim|Hash do edital|
|---|---|---|---|---|
|cnm|<br>String|19|Sim|Número do CNM|
|numeroEdital|Int|10|Sim|Número do edital|
|tipoEdital|Int|10|Sim|Código do tipo do edital|
|descricaoTipo|String|250|Sim|Descrição do tipo do edital|
|numeroPublicac<br>ao|<br>Int|11|Não|Número da publicação do edital|
|paginas|Int|4|Não|Número de páginas do edital|
|status|Int||Sim|Situação atual do edital<br>_Tabela de domínio: EStatus_|
|descricaoStatus|String|250|Sim|Descrição da situação do edital|
|dataPublicacao|Date|10|Não|Data da publicação do edital|
|numeroEdicao|Int|11|Não|<br>Número da edição da publicação do edital|
|anoEdicao|Int|4|Não|Ano da edição da publicação do edital|
|dataCadastro|DateTime|19|Sim|<br>Data ehora de cadastro|
|urlPagamento|String|65.535|Não|URL de acesso ao pagamento|
|<br>urlRecibo|<br>String|65.535|Não|<br>URLde acesso aorecibo|
|editaisVinculado<br>s|Array||Não|Número dos editais vinculados|
|anexo|String|4.294.967.295|Não|Código base64 do anexo|
|sumario|Object||Sim|Dados do sumário|
|leilao|Object||Sim|Dados do leilão|
|intimados|Array||Sim|Dados dos intimados|
|imoveis|Array||Sim|Dados dos imóveis|
|dadosCredor|Object||Sim|Dados do credor|
|informacoesGer<br>ais|Object||Sim|Informações gerais|
|motivoRejeicao|String|65.535|Não|Texto explicativo do motivo da rejeição do<br>edital|
|<br>retificacao|<br>Array||Não|Informaçõe sobre os editais de retificação|



## GET /v1/edital/leilao/{numeroEdital} 

## Campos do object sumario do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|publicacao|Object||<br>Sim|<br>Dados da publicação|
|<br>foro|<br>Object||Sim|<br>Dados do foro|
|titulo|<br>String|85|Não|Título do sumário|
|subtitulo|<br>String|85|Não|Subtítulo do sumário|
|subtitulo2|<br>String|85|Não|Subtítulo 2 do sumário|
|texto|<br>String||Não|Texto do sumário|



## GET /v1/edital/leilao/{numeroEdital} 

## Campos do object sumario/publicacao do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|numeroPublica<br>cao|String|30|<br>Sim|<br>Número da publicação|



www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

|objeto|String|200|Sim|Objeto|
|---|---|---|---|---|
|<br>descricao|<br>String|60|Não|<br>Descrição|



## GET /v1/edital/leilao/{numeroEdital} Campos do object sumario/foro do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório **|**Descrição**|
|---|---|---|---|---|
|local|String|150|Sim|Local|
|dataPorExtens<br>o|String|50|Sim|Data porextenso|
|texto|String|65.535|Sim|Texto|



## GET /v1/edital/leilao/{numeroEdital} Campos do array leilao do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>modalidade|<br>String|30|<br>Sim|<br>Modalidade do leilão<br>_Tabela de domínio: LModalidade_|
|modoDisputa|String|30|Sim|Modo de disputa<br>_Tabela de domínio: LDisputa_|
|tipo|String|200|Sim|Tipo|
|linkDisputa|String|800|Não|Link da disputa online|
|leiloes|Array||Sim|Data e hora dos leilões|
|leiloeiro|Object||Sim|Dados do leiloeiro oficial|
|preposto|Object||Sim|Dados do preposto|



## GET /v1/edital/leilao/{numeroEdital} Campos do array leilao/leiloes do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>data|<br>Date|10|<br>Sim|<br>Data do leilão|
|hora|Time|5|Sim|Horário do leilão|



## GET /v1/edital/leilao 

## Campos do object leilao/leiloeiro do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|documento|String|11|<br>Sim|<br>Número do CPF do leiloeiro (somente número)|
|nome|String|200|Sim|Nome do leiloeiro|
|numeroInscrica<br>o|<br>String|100|Sim|Número de inscrição do leiloeiro|
|numeroTelefon<br>e|String|11|Sim|Número de telefone do leiloeiro|
|email|<br>String|200|Sim|Endereço de e-mail do leiloeiro|
|endereco|Object||Não|Dados do endereço do leiloeiro|



## GET /v1/edital/leilao/{numeroEdital} 

www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

Campos do objeto leilao/leiloeiro/endereco do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>cep|<br>String|8|<br>Não|<br>CEP do endereço.|
|tipoLogradouro|String|16|Não|Tipo do logradouro do endereço.|
|<br>logradouro|<br>String|150|Não|<br>Logradouro do endereço.|
|numero|String|10|Não|Número do imóvel.|
|bairro|<br>String|100|Não|Bairro do endereço.|
|cidade|String|100|Não|Cidade do endereço.|
|estado|<br>String|2|Não|<br>Sigla do estado do endereço.|



## GET /v1/edital/leilao/{numeroEdital} Campos do object leilao/preposto do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>documento|<br>String|11|<br>Não|<br>Número do CPF do preposto (somente número)|
|nome|String|200|Não|Nome do preposto|
|numeroInscrica<br>o|<br>String|100|Não|Número de inscrição do preposto|
|numeroTelefon<br>e|String|11|Não|Número de telefone do preposto|
|email|<br>String|200|Não|<br>Endereço de e-mail do preposto|
|endereco|Object||Não|Dados do endereço do preposto|



## GET /v1/edital/leilao/{numeroEdital} Campos do objeto leilao/preposto/endereco do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>cep|<br>String|8|<br>Não|<br>CEP do endereço.|
|tipoLogradouro|<br>String|16|Não|Tipo do logradouro do endereço.|
|<br>logradouro|<br>String|150|Não|<br>Logradouro do endereço.|
|<br>numero|<br>String|10|Não|<br>Número do imóvel.|
|bairro|<br>String|100|Não|Bairro do endereço.|
|cidade|<br>String|100|Não|Cidade do endereço.|
|estado|<br>String|2|Não|<br>Sigla do estado do endereço.|



GET /v1/edital/leilao/{numeroEdital} Campos do array intimados do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|documento|String|14|<br>Sim|<br>Número do documento do intimado CPF ou<br>CNPJ (somente número)|
|nome|<br>String|200|Sim|<br>Nome completo do intimado ou razão social|



GET /v1/edital/leilao/{numeroEdital} Campos do array imoveis do body da API: 

www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>numeroLote|<br>String|14|<br>Sim|<br>Número do lote|
|idImovel|String|200|Sim|ID do imóvel|
|numeroMatricul<br>a|String|200|Sim|Matrícula|
|tipoImovel|String|200|Sim|Tipo de imóvel|
|<br>condicoes|<br>String|200|Sim|<br>Condição|
|cns|String|6|Sim|Código CNS da serventia onde fica o imóvel|
|leiloes|<br>Array||Não|<br>Dados dosleilões|
|consideracoes|String|65.535|Não|Considerações importantes|
|endereco|<br>Object||Sim|<br>Dados do endereço doimóvel|



## GET /v1/edital/leilao/{numeroEdital} Campos do array imoveis/leiloes do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|valor|Number||<br>Sim|<br>Valor do leilão|



## GET /v1/edital/leilao/{numeroEdital} 

## Campos do objeto imoveis/endereco do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|cep|String|8|<br>Sim|<br>CEP do endereço.|
|<br>tipoLogradouro|<br>String|16|Sim|<br>Tipo do logradouro do endereço.|
|<br>logradouro|<br>String|150|Sim|<br>Logradouro do endereço.|
|<br>numero|<br>String|10|Sim|<br>Número do imóvel.|
|unidade|<br>String|10|Não|Unidade do imóvel|
|lote|<br>String|10|Não|Lote do imóvel|
|quadra|<br>String|10|Não|Quadra do imóvel|
|<br>torre|<br>String|10|Não|Torre do imóvel|
|bloco|<br>String|10|Não|Bloco do imóvel|
|nomeLoteamen<br>to|<br>String|100|Não|Nome do loteamento do imóvel|
|nomeCondomi<br>nio|<br>String|100|Não|Nome do condomínio do imóvel|
|complemento|String|10|Não|Complemento do imóvel|
|bairro|String|100|Sim|Bairro do endereço.|
|cidade|String|100|Sim|Cidade do endereço.|
|estado|String|2|Sim|Sigla do estado do endereço.|
|vagas|Array||Não|Vagas de garagem|



## GET /v1/edital/leilao/{numeroEdital} Campos do objeto dadosCredor do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>documento|<br>String|19|<br>Sim|<br>Número do CNPJ do credor (somente número)|
|nome|<br>String|400|Sim|<br>Nome do credor|
|cidade|<br>String|100|Sim|Cidade do credor|



www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

estado String 100 Sim Estado do credor 

## GET /v1/edital/leilao/{numeroEdital} Campos do objeto informacoesGerais do body da API: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>titulo|<br>String|200|<br>Sim|<br>Título dasinformações gerais|
|texto|String|65.535|Sim|Texto com as informações gerais|



GET /v1/edital/leilao/{numeroEdital} Campos do array retificacao: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>editalRejeitado|<br>Int|11|<br>Sim|<br>Id do edital rejeitado|
|editalRetificador|Int|11|Sim|Id do edital retificador|
|uuidRetificador|String|36|Sim|Hashdo grupo de editaisretificador|



Modelo do JSON da resposta de erro da requisição: 

```
{
"codigo": 0,
"descricao": "string",
"campos": {}
}
```

Campos da resposta de erro da requisição: 

|**Campo**|**Tipo**|**Tamanho**|**Obrigatório**|**Descrição**|
|---|---|---|---|---|
|<br>codigo|<br>String|11|<br>Não|<br>Códigointerno.|
|descricao|String||Sim|Breve descrição interno referente ao código.|
|campos|<br>Object||Não|<br>Campos comerronarequisição.|



## Tabelas de Domínio 

[TBD-01] - EPermiteAnexo 

|**Código**|**Descrição**|
|---|---|
|0|Não permite|



www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

|**Código**|**Descrição**|
|---|---|
|1|Permite|



## [TBD-02] - EAnexoObrigatorio 

|**Código**|**Descrição**|
|---|---|
|0|Não obrigatório|
|1|Obrigatório|



## [TBD-03] - ETipoDiasPublicacoes 

|**Código**|**Descrição**|
|---|---|
|0|Dias úteis|
|1|Dias corridos|



## [TBD-04] - ETipoEdital 

|**Código**|**Descrição**|
|---|---|
|SIMPLES|Editais de cadastramento simplificado|
|LEILAO_IMOVEL|Editais de leilão de imóveis|



## [TBD-05] - EStatus 

|**Código**|**Descrição**|
|---|---|
|0|Todos|
|1|Publicado|
|2|Rejeitado|
|3|Aguardando Publicação|



www.registrodeimoveis.org.br 

**==> picture [114 x 49] intentionally omitted <==**

|**Código**|**Descrição**|
|---|---|
|4|Aguardando Pagamento|
|5|Inativo|



## [TBD-06] - LModalidade 

|**Código**|**Descrição**|
|---|---|
|ONLINE|Modalidade OnLine|
|PRESENCIAL|Modalidade presencial|



## [TBD-07] - LDisputa 

|**Código**|**Descrição**|
|---|---|
|ABERTO|Disputa aberta|
|FECHADO|Disputa fechada|



## [TBD-08] - WebHookMetodo 

|**Código**|**Descrição**|
|---|---|
|POST|Tipo de requisição POST|
|GET|Tipo de requisição GET|



www.registrodeimoveis.org.br
