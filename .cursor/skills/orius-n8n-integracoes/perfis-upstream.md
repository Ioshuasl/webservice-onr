# Perfis upstream — orius-n8n-integracoes

Deltas por tipo de integração. O **pipeline** é sempre o mesmo ([SKILL.md](SKILL.md)); esta nota define montagem do request, auth e mapeamento de resposta.

---

## `soap-onr` — ONR WSOficio

| Item | Valor |
|------|-------|
| Plane | `autonr` · `AUTONR` |
| Label | `(webservice ONR)` |
| WSDL | `wsdl/*.wsdl` |
| Docs método | `webservice/metodos/<Operacao>.md` |
| Hash | `webservice/hash.md` — SHA1(chave+token); **exceto login** |
| Namespace | `http://tempuri.org/WSOficio` |
| Encoding | UTF-8 |
| Coleção Postman | `postman/onr-webservice-n8n.postman_collection.json` |
| Build | `npm run postman:build:onr` |

### Montagem SOAP

- Ordem dos campos = `<Operacao>_WSReq` no WSDL
- PascalCase no XML; entrada webhook em snake_case
- `LoginUsuarioCertificado`: sem `Hash`
- URL: `url_servico_onr` no body ou `$env` por módulo (`ACOMPANHAMENTO_TITULOS_*`, `CERTIDOES_*`, …)

### `status_http` ONR

| Situação | HTTP |
|----------|------|
| `RETORNO: true` | 200 |
| Validação local (2, 10–17) | 400 |
| Cód. 51 | 404 |
| Cód. 52, 53 | 403 |
| Demais negócio | 422 |
| Cód. 0 / XML inválido | 502 |
| Cód. 1 (tokens) | 503 |

### Resposta

- `sucesso` ← `RETORNO`
- `codigo_erro` ← `CODIGOERRO`
- `mensagem_erro` ← `ERRODESCRICAO`
- `dados` ← demais campos

### Cuidados

- BD Light (3.4): WS desativado 31/07/2023 — não proxy ativo
- Opcionais SOAP .NET: ver ordem WSDL; inserts podem exigir `""` em opcionais

---

## `soap-cra` — CRA21 Protesto

| Item | Valor |
|------|-------|
| Plane | `autocra` · `AUTOCRA` |
| Label | `(cra)` |
| WSDL | `wsdl/cra-webservice.wsdl` |
| XML ref | `scripts/cra/soap-requests/<SoapOp>.xml` |
| Vault | `Orius/integracoes/tabelionato-protesto/cra/webservice-soap/` |
| Coleção | `postman/cra-webservice-n8n.postman_collection.json` |
| Build | `npm run postman:build:cra` |
| Env | `CRA_USER`, `CRA_PASS`, `CRA_UF`, `CRA_AMBIENTE` |

### Montagem SOAP

- RPC encoded; namespace dinâmico por `uf` + ambiente
- SOAPAction: `{namespace}#{SoapOp}`
- Content-Type: `text/xml; charset=ISO-8859-1`
- Basic Auth CRA em **cada** `httpRequest` (sem workflow Auth separado)
- `userDados`: CDATA com XML interno quando upload

### URL

| Ambiente | Padrão |
|----------|--------|
| HML | `https://cra{uf}.cra21.com.br/cra{uf}/xml/protestos.php` |
| Prod | `https://cra{uf}.crabr.com.br/cra{uf}/xml/protestos.php` |

### `status_http` CRA

| Código CRA | HTTP |
|------------|------|
| `0001` | 401 |
| `0000`, `0002`, `0003` | 200 |
| `10000`, `2118`, … (negócio HML) | 422 |
| Validação local | 400 |
| Sem código / parse | 502 |

### Resposta

```json
{
  "status_http": 200,
  "sucesso": true,
  "codigo": "0000",
  "mensagem": "REGISTROS OK",
  "operacao": "Consulta",
  "dados": {}
}
```

(`codigo`/`mensagem` em vez de `codigo_erro`/`mensagem_erro` — manter padrão CRA nos workflows existentes)

---

## `rest-json` — REST genérico (CNIB, RIB, SEE TJGO, ONRCPN, …)

| Item | Valor |
|------|-------|
| Auth típico | Bearer OAuth, header custom (`X-CNIB-Access-Token`), Basic upstream |
| Body | JSON snake_case alinhado ao webhook |
| `httpRequest` | `contentType: json`, headers dinâmicos |
| Âncoras | `Auth CNIB`, `Auth RIB`, `Sessions SEE TJGO` |

### Montagem request

- URL base: `$env` ou body `ambiente` → HML/prod
- Repassar token de card âncora quando o lote exigir (documentar header)
- GET: query params no nó ou URL montada no Code

### `status_http` REST

| Situação | HTTP |
|----------|------|
| Upstream 2xx + corpo válido | 200 (ou espelhar 201/204 quando fizer sentido) |
| Validação local | 400 |
| Upstream 401/403/404 | Espelhar ou normalizar para 401/403/404 |
| Upstream 4xx negócio | 422 |
| Upstream 5xx / timeout | 502 |

### Resposta

- Preferir envelope padrão Orius (`sucesso`, `codigo_erro`, `mensagem_erro`, `dados`)
- Auth: pode retornar `token` / `access_token` em `dados` ou no topo (seguir âncora)

---

## `rest-json` + validação local — CENSEC

Mesmo perfil `rest-json`, com cadeia extra **antes** do upstream:

1. `normalizar-payload`
2. `validar-cep` → `validar-cesdi` → `validar-ctp`
3. `if` erros → 400 com lista `errors`/`warnings`
4. `POST /api/cargas/upload-json` + `X-Api-Key`

Vault: `Orius/integracoes/tabelionato-notas/censec/`  
Âncora: `CENSEC Upload JSON Gateway.workflow.ts`  
Plane: `autcensec` · `AUTCENSEC`

---

## Mapa rápido integração → perfil

| Integração | Perfil | Plane |
|------------|--------|-------|
| ONR WSOficio | `soap-onr` | AUTONR |
| CRA21 | `soap-cra` | AUTOCRA |
| CENSEC | `rest-json` + validação | AUTCENSEC |
| CNIB | `rest-json` | AUTCNIB |
| RIB | `rest-json` | AUTORIB |
| SEE TJGO | `rest-json` | AUTSEETJGO |
| ONRCPN | `rest-json` | AUTONRCPN |
| CCN, DOI, SIGEF | `rest-json` | AUTCCN, AUTDOI, … |

Ambiguidade `soap` / `onr` / `ctp` → perguntar ([routing-matrix.md](../agent-n8n-orchestrator/routing-matrix.md)).
