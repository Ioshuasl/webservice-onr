# List Status AT — WebService ONR (n8n)

Workflow n8n proxy para `ListStatusAT` (módulo 3.2 Acompanhamento de Títulos).

- **Workflow:** [`workflows/n8n/gentle-juniper-bb6f8f0940a3/List Status AT.workflow.ts`](../../workflows/n8n/gentle-juniper-bb6f8f0940a3/List%20Status%20AT.workflow.ts)
- **Método:** [`webservice/metodos/ListStatusAT.md`](../../webservice/metodos/ListStatusAT.md)
- **Scripts CLI:** [`listStatusAt.js`](listStatusAt.js) · [`listStatusAt.py`](listStatusAt.py)
- **Postman:** [`postman/onr-webservice-n8n.postman_collection.json`](../../postman/onr-webservice-n8n.postman_collection.json) (request **List Status AT — Listar**)

## Pré-requisito

Obter `hash` via workflow **Auth ONR** ou `npm run login`. Ver [`webservice/hash.md`](../../webservice/hash.md).

## Request (JSON snake_case)

| Campo | Tipo | Obrigatório | SOAP |
|-------|------|-------------|------|
| `hash` | string | sim | `Hash` |
| `max_registros_por_pagina` | number | sim (mín. 10) | `MaxRowPerPage` |
| `numero_pagina` | number | sim (mín. 1) | `PageNumber` |
| `id_titulo` | number | sim | `IDTitulo` |
| `id_tipo_status` | number | sim | `IDTipoStatus` (`-1` = todos, ver [IDTipoStatus-AT](../../webservice/tabelas-dominio/IDTipoStatus-AT.md)) |
| `data_status_inicio` | string | não | `DataStatusInicio` |
| `data_status_final` | string | não | `DataStatusFinal` |
| `url_servico_onr` | string | sim | endpoint SOAP |

### Exemplo

```json
{
  "hash": "A1B2C3D4E5F6789012345678901234567890ABCDEF",
  "max_registros_por_pagina": 50,
  "numero_pagina": 1,
  "id_titulo": 18151720,
  "id_tipo_status": -1,
  "data_status_inicio": "2025-01-01",
  "data_status_final": "2026-12-31",
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
    "quantidade_registros": 5,
    "quantidade_paginas": 1,
    "id_titulo": 18151720,
    "id_cartorio": 1,
    "protocolo": "20250100001",
    "apresentante_nome": "Banco X",
    "status": [
      {
        "id_status": 66701083,
        "id_tipo_status": 4,
        "data_status": "2025-06-01T10:00:00"
      }
    ]
  }
}
```

### HTTP status

| Situação | Código |
|----------|--------|
| Sucesso | 200 |
| Validação local / request inválido (2, 10–18, 25) | 400 |
| Hash inválido/usado/expirado (45–47) | 401 |
| Sem permissão (50) | 403 |
| Erro negócio ONR | 422 |
| Falha ONR / conexão | 502 |

## Webhook

- Path: `b4c5d6e7-f8a9-4b0c-9d1e-2f3a4b5c6d7e`
- URL teste: `https://<n8n>/webhook-test/b4c5d6e7-f8a9-4b0c-9d1e-2f3a4b5c6d7e`
- Basic Auth (mesmas credenciais do Auth ONR)

## Publicar

Workflow n8n ID: `MUChLALDYxCFeeyf`

```bash
npx --yes n8nac skills validate "workflows/n8n/gentle-juniper-bb6f8f0940a3/List Status AT.workflow.ts"
npx --yes n8nac push "workflows/n8n/gentle-juniper-bb6f8f0940a3/List Status AT.workflow.ts" --verify
```

Ative o workflow no n8n e use `n8n_webhook_mode=webhook` em produção (ou `webhook-test` + **Execute workflow** no editor).
