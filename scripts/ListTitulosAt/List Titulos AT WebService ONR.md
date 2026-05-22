# List Titulos AT — WebService ONR (n8n)

Workflow n8n proxy para `ListTitulosAT` (módulo 3.2 Acompanhamento de Títulos).

- **Workflow:** [`workflows/n8n/gentle-juniper-bb6f8f0940a3/List Titulos AT.workflow.ts`](../../workflows/n8n/gentle-juniper-bb6f8f0940a3/List%20Titulos%20AT.workflow.ts)
- **Método:** [`webservice/metodos/ListTitulosAT.md`](../../webservice/metodos/ListTitulosAT.md)
- **Script CLI:** [`listTitulos.js`](listTitulos.js)
- **Postman:** [`postman/onr-webservice-n8n.postman_collection.json`](../../postman/onr-webservice-n8n.postman_collection.json) (pasta **3.2 Acompanhamento**). Sync: `npm run postman:sync` — ver [`postman/README.md`](../../postman/README.md).

## Pré-requisito

Obter `hash` via workflow **Auth ONR** ou `npm run login` + cálculo SHA-1 (`ONR_SERVENTIA_CHAVE` + token). Ver [`webservice/hash.md`](../../webservice/hash.md).

## Request (JSON snake_case)

| Campo | Tipo | Obrigatório | SOAP |
|-------|------|-------------|------|
| `hash` | string | sim | `Hash` |
| `max_registros_por_pagina` | number | sim (mín. 10) | `MaxRowPerPage` |
| `numero_pagina` | number | sim (mín. 1) | `PageNumber` |
| `data_protocolo_inicio` | string | sim | `DataProtocoloInicio` |
| `data_protocolo_final` | string | sim | `DataProtocoloFinal` |
| `id_tipo_status` | number | sim | `IDTipoStatus` (`-1` = todos) |
| `exportado` | number | sim | `Exportado` |
| `protocolo` | string | não | `Protocolo` |
| `apresentante` | string | não | `Apresentante` |
| `url_servico_onr` | string | sim | endpoint SOAP |

### Exemplo

```json
{
  "hash": "A1B2C3D4E5F6789012345678901234567890ABCDEF",
  "max_registros_por_pagina": 50,
  "numero_pagina": 1,
  "data_protocolo_inicio": "2025-01-01",
  "data_protocolo_final": "2026-12-31",
  "id_tipo_status": -1,
  "exportado": -1,
  "protocolo": "",
  "apresentante": "",
  "url_servico_onr": "https://hml3-wsoficio.onr.org.br/acompanhamentotitulos.asmx"
}
```

## Response

```json
{
  "status_http": 200,
  "sucesso": true,
  "codigo_erro": 0,
  "mensagem_erro": "",
  "dados": {
    "quantidade_registros": 10,
    "quantidade_paginas": 1,
    "titulos": [
      {
        "id_titulo": 1,
        "apresentante": "Banco X",
        "protocolo": "20250100001",
        "data_ultimo_status": "2025-06-01T10:00:00",
        "id_status": 1,
        "id_tipo_status": 2
      }
    ]
  }
}
```

### HTTP status

| Situação | Código |
|----------|--------|
| Sucesso | 200 |
| Validação local / request inválido | 400 |
| Hash inválido/usado/expirado (45–47) | 401 |
| Erro negócio ONR | 422 |
| Falha ONR / conexão | 502 |

## Webhook

- Path: `f8e2a1b0-9c3d-4e5f-a6b7-8d9e0f1a2b3c`
- URL teste: `https://<n8n>/webhook-test/f8e2a1b0-9c3d-4e5f-a6b7-8d9e0f1a2b3c`
- Basic Auth (mesmas credenciais do Auth ONR)

## Publicar

```bash
npx --yes n8nac push "workflows/n8n/gentle-juniper-bb6f8f0940a3/List Titulos AT.workflow.ts" --verify
```
