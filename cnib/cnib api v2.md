# Integração Externa — Serventias Extrajudiciais (API SERVENTIAS — v1/v2)

**Versão recomendada** · Documento **2.0** (atualizado)

| | |
|---|---|
| **Última atualização** | Tamara Dias de Souza — 28 de nov. de 2025, 17:17 BRT |
| **Fonte (wiki)** | [Azure DevOps — API SERVENTIAS v1/v2](https://dev.azure.com/ONR-SAEC/ONR-CNIB/_wiki/wikis/ONR-CNIB/5487/Integração-Externa-Serventias-Extrajudiciais-(API-SERVENTIAS-Nova-Versão-v1-v2)) |

Esta documentação descreve a integração via API destinada às **Serventias de Registros de Imóveis**, **Registros Civis** e **Tabelionatos de Notas**, permitindo consulta, visualização e resposta de ordens de indisponibilidade pelo serviço **SERVENTIAS API (CNIB 2.0)**.

---

## Mudanças principais em relação à versão antiga

- Endpoint `/api/ordem/visualizar` → **`/api/v2/ordem/visualizar`** (recomendado)
- `protocol` deve ser `null` **sem aspas** quando a consulta for por período
- `data_inicial` e `data_final` só podem ser `null` se `protocol` tiver valor
- **Paginação obrigatória** no endpoint v2 (limite máximo **500** registros por página)
- Payload e tipos de campos atualizados
- Resposta JSON padronizada, com totalizador de ordens
- Correções: inconsistência de dados, retornos incompletos, interpretação de datas e protocolos
- Endpoints auxiliares documentados:
  - `POST /api/ordem/responder`
  - `POST /api/ordem/responder/lista`
  - `POST /api/documentos/tipos`

---

## 1. Ambientes

| Ambiente | URL base (API) | Swagger |
|---|---|---|
| Desenvolvimento (STG) | `https://stg-serventia-api.onr.org.br` | `/swagger` |
| Produção | `https://serventia-api.onr.org.br` | `/swagger` |

---

## 2. Autenticação

Todas as requisições às endpoints exigem **OAuth2** (fluxo *client credentials*).

| | |
|---|---|
| **Método** | `POST` |
| **URL** | `https://auth.id.onr.org.br/connect/token` |
| **Content-Type** | `application/json` |

### Campos do payload

| Campo | Obrigatório | Descrição |
|---|---|---|
| `grant_type` | Sim | Valor fixo: `client_credentials` |
| `client_id` | Sim | Gerado no portal da serventia |
| `client_secret` | Sim | Gerado no portal da serventia |
| `scope` | Sim | Valor fixo: `cnib-serventia-api` |

### Geração das credenciais

| Ambiente | Portal |
|---|---|
| STG | [https://stg-indisponibilidade.onr.org.br](https://stg-indisponibilidade.onr.org.br/) — menu **Usuários → Acesso API** |
| Produção | [https://indisponibilidade.onr.org.br](https://indisponibilidade.onr.org.br/) — menu **Usuários → Acesso API** |

> A credencial de produção é diferente da credencial de STG.

### Exemplo de payload

```json
{
  "grant_type": "client_credentials",
  "client_id": "string",
  "client_secret": "string",
  "scope": "cnib-serventia-api"
}
```

### Exemplo de resposta (200 OK)

```json
{
  "access_token": "token"
}
```

> O `access_token` deve ser enviado no header de **todas** as demais requisições:  
> `Authorization: Bearer <token>`

---

## 3. Consultar indisponibilidades por CPF/CNPJ ou hash

| | |
|---|---|
| **Método** | `POST` |
| **URL** | `/api/ordem/consultar` |

Permite consultar a existência de indisponibilidades por CPF/CNPJ ou por hash de consulta.

### Payload

```json
{
  "cpf_usuario": "string",
  "documento": "string",
  "hash": "string"
}
```

### Regras

- `cpf_usuario` é **obrigatório**
- Deve ser informado **`documento`** OU **`hash`** (um dos dois)
- Todos os campos aceitam `null` (exceto a regra de presença de `documento` ou `hash`)

---

## 4. Visualizar ordens de indisponibilidade

Existem duas versões do endpoint de visualização.

### 4.1 Endpoint legado

| | |
|---|---|
| **Método** | `POST` |
| **URL** | `/api/ordem/visualizar` |

Compatível com sistemas anteriores.

#### Payload básico

```json
{
  "cpf_usuario": "string",
  "ordens_visualizadas": true,
  "protocol": "string",
  "data_inicial": "string",
  "data_final": "string"
}
```

### 4.2 Novo endpoint (recomendado)

| | |
|---|---|
| **Método** | `POST` |
| **URL** | `/api/v2/ordem/visualizar` |

- Layout JSON padronizado
- Paginação obrigatória

#### Regras de validação

| Campo | Regra |
|---|---|
| `cpf_usuario` | Obrigatório; não pode ser nulo ou vazio |
| `ordens_visualizadas` | Obrigatório; apenas `true` ou `false` |
| `protocol` | Deve ser `null` **sem aspas** quando a consulta for por período |
| `data_inicial`, `data_final` | Devem ser `null` se `protocol` tiver valor |
| `pagina_inicial` | Obrigatório (default `0`) |
| `tamanho_pagina` | Obrigatório (default e máximo **500**) |
| `proxima_pagina` | Obrigatório |

#### Exemplo — por período

```json
{
  "cpf_usuario": "12345678900",
  "ordens_visualizadas": false,
  "protocol": null,
  "data_inicial": "2025-01-01",
  "data_final": "2025-11-25",
  "pagina_inicial": 0,
  "tamanho_pagina": 500,
  "proxima_pagina": false
}
```

#### Exemplo — por protocolo

```json
{
  "cpf_usuario": "12345678900",
  "ordens_visualizadas": true,
  "protocol": "PROT-2025-001",
  "data_inicial": null,
  "data_final": null,
  "pagina_inicial": 0,
  "tamanho_pagina": 500,
  "proxima_pagina": false
}
```

> **Atenção:** valores `null` devem ser enviados **sem aspas**. Enviar `"null"` ou `"string"` entre aspas causará erro.

---

## 5. Responder ordem de indisponibilidade

| | |
|---|---|
| **Método** | `POST` |
| **URL** | `/api/ordem/responder` |

### Payload

```json
{
  "cpf_usuario": "string",
  "protocolo": "string",
  "tipo_matricula": 0,
  "cpf_cnpj": "string",
  "numero_matricula": "string",
  "numero_inscricao": "string",
  "bens_detalhes": "string",
  "bens_parte_cpf_cnpj": "string",
  "bens_parte_nome_razao": "string"
}
```

### Regras de obrigatoriedade

| Campo | Obrigatório | Condição |
|---|---|---|
| `cpf_usuario` | Sim | — |
| `protocolo` | Não | — |
| `tipo_matricula` | Não | — |
| `cpf_cnpj` | Sim | — |
| `numero_matricula` | Sim | Se `tipo_matricula` = 22, 24, 25 ou 27 |
| `numero_inscricao` | Não | Se `tipo_matricula` = 24 |
| `bens_detalhes` | Sim | Se `tipo_matricula` = 26 |
| `bens_parte_cpf_cnpj` | Sim | Se `tipo_matricula` = 26 |
| `bens_parte_nome_razao` | Sim | Se `tipo_matricula` = 26 |

---

## 6. Responder lista de ordens

| | |
|---|---|
| **Método** | `POST` |
| **URL** | `/api/ordem/responder/lista` |

### Payload

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
      "bens_detalhes": "string",
      "bens_parte_cpf_cnpj": "string",
      "bens_parte_nome_razao": "string"
    }
  ]
}
```

As regras de obrigatoriedade dos campos em cada item de `bens` seguem a mesma tabela da seção **5**.

---

## 7. Tipos de bens (`tipo_matricula`)

Valores para os endpoints `/api/ordem/responder` e `/api/ordem/responder/lista`:

| ID | Descrição |
|---|---|
| 22 | matrícula |
| 24 | inscrição |
| 25 | transcrição |
| 26 | bens |
| 27 | ficha complementar |

---

## 8. Endpoint auxiliar — tipos de documento

| | |
|---|---|
| **Método** | `POST` |
| **URL** | `/api/documentos/tipos` |

Obter tipos de status da ordem (conforme documentação oficial).
