# Auth WebService ONR

Workflow **n8n** que expõe um webhook HTTP para autenticar na ONR via `LoginUsuarioCertificado`, repassando os dados do certificado ao webservice SOAP e devolvendo a resposta em JSON.

- **Arquivo de exportação:** [`Auth WebService ONR.json`](Auth%20WebService%20ONR.json)
- **Operação SOAP:** `LoginUsuarioCertificado` (módulo 3.1 Login)
- **Documentação do método:** [`webservice/metodos/LoginUsuarioCertificado.md`](../../webservice/metodos/LoginUsuarioCertificado.md)
- **Scripts equivalentes (CLI):** [`login_onr.py`](login_onr.py) · [`login_onr.js`](login_onr.js)

## Objetivo

Centralizar o login ONR atrás de um endpoint HTTP autenticado. O cliente envia os campos extraídos do certificado digital; o n8n monta o envelope SOAP, chama o `login.asmx` da ONR e retorna tokens e metadados do usuário em JSON.

Os tokens retornados alimentam o cálculo de `Hash` das demais operações SOAP — ver [`webservice/hash.md`](../../webservice/hash.md).

## Fluxo geral

```mermaid
flowchart LR
  Cliente["Cliente HTTP\n(POST + Basic Auth)"]
  Webhook["Webhook"]
  Sanitize["sanitize-input"]
  Auth["auth-onr"]
  Convert["convert-xml-to-json"]
  Respond["Respond to Webhook"]
  ONR["ONR login.asmx"]

  Cliente --> Webhook --> Sanitize --> Auth --> ONR
  Auth --> Convert --> Respond --> Cliente
```

| Etapa | Nó | Resumo |
|-------|-----|--------|
| 1 | Webhook | Recebe POST JSON com dados do certificado |
| 2 | normalizar-entrada | Mapeia body JSON (snake_case pt-BR) para uso interno |
| 3 | validar-cpf | Valida e normaliza CPF |
| 4 | if-cpf-valido | Desvia CPF inválido antes da ONR |
| 5 | auth-onr | Monta XML SOAP e chama a ONR |
| 6 | converter-resposta-onr | Parseia XML ONR → JSON pt-BR |
| 7 | resposta-cpf-invalido | Resposta de erro de validação local |
| 8 | Respond to Webhook | Devolve JSON ao cliente |

## Nós utilizados

### 1. Webhook

| Propriedade | Valor |
|-------------|-------|
| Tipo | `n8n-nodes-base.webhook` |
| Método | `POST` |
| Autenticação | HTTP Basic Auth (credencial **2FA Authentication**) |
| Modo de resposta | `responseNode` — resposta só pelo nó **Respond to Webhook** |
| Path (UUID) | `163d6b2d-36fa-4c1c-bb1b-ed6085de7de2` |

**Objetivo:** Ponto de entrada do workflow. Valida credenciais Basic Auth e repassa o body JSON para os nós seguintes.

A URL completa depende da instância n8n (ex.: `https://<instancia-n8n>/webhook/163d6b2d-36fa-4c1c-bb1b-ed6085de7de2` ou `/webhook-test/...` em modo de teste).

---

### 2. normalizar-entrada

| Propriedade | Valor |
|-------------|-------|
| Tipo | `n8n-nodes-base.set` |
| Modo | Raw JSON |

**Objetivo:** Ler o body do webhook (snake_case pt-BR) e repassar campos normalizados aos nós seguintes.

| Campo no body (entrada) | Uso interno / SOAP |
|-------------------------|-------------------|
| `assunto_certificado` | `SUBJECTCN` |
| `emissor_certificado` | `ISSUERO` |
| `chave_publica` | `PUBLICKEY` |
| `numero_serie_certificado` | `SERIALNUMBER` |
| `validade_certificado` | `VALIDUNTIL` |
| `cpf` | `CPF` |
| `email` | `EMAIL` |
| `id_parceiro_ws` | `IDParceiroWS` |
| `url_login_onr` | URL do POST SOAP |

Não extrai dados do PFX — o caller deve enviar todos os campos já preenchidos (por exemplo, via [`lib/cert_extract`](../../lib/cert_extract.py) ou [`login_onr.py`](login_onr.py)).

---

### 3. auth-onr

| Propriedade | Valor |
|-------------|-------|
| Tipo | `n8n-nodes-base.httpRequest` |
| Método | `POST` |
| URL | Dinâmica: `{{ $json.endpoint }}` |
| Content-Type | `text/xml` |

**Objetivo:** Montar o envelope SOAP de `LoginUsuarioCertificado` e enviá-lo ao endpoint informado no request.

Ordem dos campos em `<oRequest>` (conforme WSDL):

1. `SUBJECTCN`
2. `ISSUERO`
3. `PUBLICKEY`
4. `SERIALNUMBER`
5. `VALIDUNTIL`
6. `CPF`
7. `EMAIL`
8. `IDParceiroWS`

Namespace: `http://tempuri.org/WSOficio`.

---

### 4. converter-resposta-onr

| Propriedade | Valor |
|-------------|-------|
| Tipo | `n8n-nodes-base.code` (JavaScript) |

**Objetivo:** Converter XML da ONR para JSON público em snake_case pt-BR:

| Campo resposta | Tipo |
|-------|------|
| `sucesso` | `boolean` |
| `codigo_erro` | `number` |
| `mensagem_erro` | `string` |
| `id_usuario` | `number` |
| `id_instituicao` | `number` |
| `usuario_ativo` | `boolean` |
| `tokens` | `string[]` |

Cada token em `Tokens` é uma string de 6 caracteres, de uso único, com validade de ~8 horas.

---

### 5. Respond to Webhook

| Propriedade | Valor |
|-------------|-------|
| Tipo | `n8n-nodes-base.respondToWebhook` |

**Objetivo:** Enviar o JSON do nó anterior como resposta HTTP ao cliente que chamou o webhook.

Erros de execução não tratados no workflow disparam o **error workflow** configurado e podem retornar **500** do n8n.

## Request

### Headers

| Header | Valor |
|--------|-------|
| `Content-Type` | `application/json` |
| `Authorization` | `Basic <base64(usuario:senha)>` |

### Body (JSON)

Contrato público em **snake_case** (pt-BR). O workflow traduz internamente para os campos SOAP da ONR.

| Campo | Tipo | Obrigatório | Descrição | Campo SOAP (ONR) |
|-------|------|-------------|-----------|------------------|
| `assunto_certificado` | string | sim | Subject CN do certificado | `SUBJECTCN` |
| `emissor_certificado` | string | sim | Emissor do certificado | `ISSUERO` |
| `chave_publica` | string | sim | Chave pública (ex.: base64 DER) | `PUBLICKEY` |
| `numero_serie_certificado` | string | sim | Número de série do certificado | `SERIALNUMBER` |
| `validade_certificado` | string | sim | Validade (ISO ou epoch) | `VALIDUNTIL` |
| `cpf` | string | sim | CPF do usuário (11 dígitos) | `CPF` |
| `email` | string | sim | E-mail do usuário | `EMAIL` |
| `id_parceiro_ws` | number | sim | ID da serventia/parceiro | `IDParceiroWS` |
| `url_login_onr` | string | sim | URL do `login.asmx` (homolog ou produção) | — |
| `chave_serventia` | string | não* | Chave única da serventia (`ONR_SERVENTIA_CHAVE`) para calcular `hashes` na resposta | — |

\*Obrigatória para preencher `hashes`/`hash` na resposta, se não existir `ONR_SERVENTIA_CHAVE` no ambiente do n8n.

### Exemplo

```http
POST /webhook/163d6b2d-36fa-4c1c-bb1b-ed6085de7de2 HTTP/1.1
Host: <instancia-n8n>
Content-Type: application/json
Authorization: Basic dXN1YXJpbzpzZW5oYQ==

{
  "assunto_certificado": "JOAO DA SILVA:12345678901",
  "emissor_certificado": "AC Certisign RFB G5",
  "chave_publica": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...",
  "numero_serie_certificado": "0123456789ABCDEF",
  "validade_certificado": "2027-12-31T23:59:59",
  "cpf": "12345678901",
  "email": "usuario@cartorio.org.br",
  "id_parceiro_ws": 12345,
  "url_login_onr": "https://hml3-wsoficio.onr.org.br/login.asmx",
  "chave_serventia": "<ONR_SERVENTIA_CHAVE>"
}
```

### Exemplo com curl

```bash
curl -X POST "https://<instancia-n8n>/webhook/163d6b2d-36fa-4c1c-bb1b-ed6085de7de2" \
  -u "usuario:senha" \
  -H "Content-Type: application/json" \
  -d '{
    "assunto_certificado": "JOAO DA SILVA:12345678901",
    "emissor_certificado": "AC Certisign RFB G5",
    "chave_publica": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...",
    "numero_serie_certificado": "0123456789ABCDEF",
    "validade_certificado": "2027-12-31T23:59:59",
    "cpf": "12345678901",
    "email": "usuario@cartorio.org.br",
    "id_parceiro_ws": 12345,
    "url_login_onr": "https://hml3-wsoficio.onr.org.br/login.asmx"
  }'
```

Para obter os campos do certificado localmente antes de chamar o webhook:

```bash
py scripts/login/login_onr.py
# ou, só extração:
DUMP_CERT_ONLY=1 py scripts/login/login_onr.py
```

## Resposta

Todas as respostas incluem `status_http`, espelhando o **HTTP status code** retornado pelo webhook.

### Mapeamento HTTP

| Situação | `status_http` | Quando |
|----------|---------------|--------|
| Login OK | **200** | `sucesso: true` |
| CPF inválido/ausente, request inválido ONR (2, 10–17) | **400** | Erro de entrada/validação |
| Usuário não encontrado (51) | **404** | ONR |
| Usuário/instituição inativos (52, 53) | **403** | ONR |
| Demais erros de negócio ONR | **422** | ONR rejeitou autenticação |
| Erro de sistema ONR (0) ou XML inválido | **502** | Falha upstream |
| Falha ao gerar tokens (1) | **503** | ONR indisponível |
| Falha de conexão com `login.asmx` | **502** | Timeout/rede |

### Sucesso (`status_http: 200`)

```json
{
  "status_http": 200,
  "sucesso": true,
  "codigo_erro": 0,
  "mensagem_erro": "",
  "id_usuario": 9876,
  "id_instituicao": 543,
  "usuario_ativo": true,
  "tokens": [
    "A1B2C3",
    "D4E5F6",
    "G7H8I9"
  ],
  "hashes": [
    "A1B2C3D4E5F6...",
    "..."
  ],
  "hash": "A1B2C3D4E5F6..."
}
```

| Campo | Descrição |
|-------|-----------|
| `tokens` | Tokens retornados pela ONR (6 caracteres cada). |
| `hashes` | SHA-1 de `chave_serventia + token` para cada item de `tokens` (mesma ordem). |
| `hash` | Primeiro hash de `hashes` (índice `ONR_HASH_TOKEN_INDEX`, padrão `0`) — use em `onr_hash` / body dos demais webhooks. |

Os hashes só são preenchidos quando a chave da serventia está disponível:

- no body: `chave_serventia` (ou `onr_serventia_chave`), **ou**
- no ambiente do n8n: variável `ONR_SERVENTIA_CHAVE`.

Fórmula: `Hash = SHA1_UTF8_HEX_UPPER(chave + token)` — ver `webservice-onr/hash.md` ou `lib/onr_hash.js`.

Cada hash corresponde a **um** uso em operação SOAP (token de uso único).

### Falha de validação local (`status_http: 400`)

```json
{
  "status_http": 400,
  "sucesso": false,
  "codigo_erro": 2,
  "mensagem_erro": "CPF inválido: informe 11 dígitos com dígitos verificadores corretos.",
  "id_usuario": 0,
  "id_instituicao": 0,
  "usuario_ativo": false,
  "tokens": []
}
```

### Falha de negócio ONR (`status_http: 400/403/404/422`)

```json
{
  "status_http": 400,
  "sucesso": false,
  "codigo_erro": 17,
  "mensagem_erro": "O IDParceiroWS informado é inválido.",
  "id_usuario": 0,
  "id_instituicao": 0,
  "usuario_ativo": false,
  "tokens": []
}
```

| Campo resposta | Campo SOAP (ONR) |
|----------------|------------------|
| `status_http` | — (HTTP status do webhook) |
| `sucesso` | `RETORNO` |
| `codigo_erro` | `CODIGOERRO` |
| `mensagem_erro` | `ERRODESCRICAO` |
| `id_usuario` | `IDUsuario` |
| `id_instituicao` | `IDInstituicao` |
| `usuario_ativo` | `Ativo` |
| `tokens` | `Tokens` |

Códigos de erro comuns: ver tabela em [`LoginUsuarioCertificado.md`](../../webservice/metodos/LoginUsuarioCertificado.md).

### Falha de execução no n8n

Se o nó `auth-onr` não receber XML válido ou ocorrer exceção no código JavaScript, o workflow dispara o **error workflow** configurado. Nesse caso o cliente pode receber erro HTTP genérico do n8n, dependendo da configuração da instância.

## Configurações do workflow

| Setting | Valor | Efeito |
|---------|-------|--------|
| `active` | `true` | Workflow publicado |
| `errorWorkflow` | `7HzCiYLSeXnzvhpN` | Tratamento centralizado de erros |
| `saveDataSuccessExecution` | `none` | Não persiste dados de execução bem-sucedida |
| `saveDataErrorExecution` | `none` | Não persiste dados de execução com erro |
| `timezone` | `America/Sao_Paulo` | Fuso horário |
| `callerPolicy` | `workflowsFromSameOwner` | Restringe chamadas internas |

## Relação com os scripts do projeto

| Aspecto | Workflow n8n | Scripts locais |
|---------|--------------|----------------|
| Extração do PFX | Não — caller envia campos | Sim (`lib/cert_extract`) |
| Cliente SOAP | HTTP Request + XML manual | zeep / node-soap + WSDL |
| Endpoint ONR | Dinâmico no body | Variável `.env` (`ONR_LOGIN_ENDPOINT`) |
| Autenticação do caller | Basic Auth no webhook | `.env` local |
| Uso típico | Gateway/API centralizado | CLI, automação local |

## Referências

- [`webservice/metodos/LoginUsuarioCertificado.md`](../../webservice/metodos/LoginUsuarioCertificado.md) — spec do método
- [`webservice/hash.md`](../../webservice/hash.md) — uso dos tokens e cálculo do Hash
- [`wsdl/login.wsdl`](../../wsdl/login.wsdl) — contrato WSDL local
