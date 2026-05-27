# List Pedidos OE V2 — WebService ONR (n8n)

Workflow n8n proxy para `ListPedidosOE_V2` (módulo 3.5 Ofícios Eletrônicos).

- **Workflow:** [`workflows/n8n/extensao-n8n-teste/List Pedidos OE V2.workflow.ts`](../../workflows/n8n/extensao-n8n-teste/List%20Pedidos%20OE%20V2.workflow.ts)
- **Método:** [`webservice-onr/metodos/ListPedidosOE_V2.md`](../../webservice-onr/metodos/ListPedidosOE_V2.md)
- **Scripts CLI:** [`listPedidosOe_v2.js`](listPedidosOe_v2.js) · [`listPedidosOe_v2.py`](listPedidosOe_v2.py)
- **Postman:** [`postman/onr-webservice-n8n.postman_collection.json`](../../postman/onr-webservice-n8n.postman_collection.json) (request **List Pedidos OE V2 — Listar**)

## Pré-requisito

Obter `hash` via workflow **Auth ONR** ou `npm run login`. Ver [`webservice-onr/hash.md`](../../webservice-onr/hash.md).

## Request (JSON snake_case)

| Campo | Tipo | Obrigatório | SOAP |
|-------|------|-------------|------|
| `hash` | string | sim | `Hash` |
| `max_registros_por_pagina` | number | sim | `MaxRowPerPage` |
| `numero_pagina` | number | sim | `PageNumber` |
| `protocolo` | string | não | `Protocolo` |
| `id_instituicao` | number | sim | `IDInstituicao` |
| `id_tipo_pesquisa` | number | sim | `IDTipoPesquisa` |
| `id_status` | number | sim | `IDStatus` |
| `data_solicitacao_inicial` | string | sim | `DataSolicitacaoInicial` |
| `data_solicitacao_final` | string | sim | `DataSolicitacaoFinal` |
| `data_resposta_inicial` | string | não | `DataRespostaInicial` |
| `data_resposta_final` | string | não | `DataRespostaFinal` |
| `url_servico_onr` | string | sim | endpoint SOAP |

Use `-1` em `id_instituicao`, `id_tipo_pesquisa` e `id_status` para listar todos. O período de solicitação deve ter no máximo 30 dias e `max_registros_por_pagina` mínimo 10.

### Exemplo

```json
{
  "hash": "A1B2C3D4E5F6789012345678901234567890ABCDEF",
  "max_registros_por_pagina": 50,
  "numero_pagina": 1,
  "protocolo": "",
  "id_instituicao": -1,
  "id_tipo_pesquisa": -1,
  "id_status": -1,
  "data_solicitacao_inicial": "2026-05-01",
  "data_solicitacao_final": "2026-05-26",
  "data_resposta_inicial": "",
  "data_resposta_final": "",
  "url_servico_onr": "https://hml3-wsoficio.onr.org.br/oficios.asmx"
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
    "operacao_soap": "ListPedidosOE_V2",
    "filtros": {},
    "quantidade_registros": 1,
    "quantidade_paginas": 1,
    "quantidade_pedidos": 1,
    "pedidos": [
      {
        "id_pedido": 123,
        "id_status": 1,
        "id_instituicao": 10,
        "cnpj_instituicao": "00000000000000",
        "instituicao": "Instituicao",
        "id_tipo_pesquisa": 1,
        "protocolo": "ABC",
        "numero_oficio": "123/2026",
        "data_solicitacao": "2026-05-01",
        "data_resposta": ""
      }
    ]
  }
}
```

### HTTP status

| Situação | Código |
|----------|--------|
| Sucesso | 200 |
| Validação local / request inválido (10–20, 30) | 400 |
| Hash inválido/usado/expirado (45–47) | 401 |
| Pedidos não localizados/erro de consulta (51) | 404 |
| Falha ONR / XML inválido / conexão | 502 |
| Falha temporária | 503 |
| Demais regras de negócio | 422 |

## Webhook

- Path: `d5e6f7a8-b9c0-4d1e-af2a-b3c4d5e6f7a9`
- URL teste: `https://<n8n>/webhook-test/d5e6f7a8-b9c0-4d1e-af2a-b3c4d5e6f7a9`
- Basic Auth (mesmas credenciais do Auth ONR)

## Publicar

```bash
npx --yes n8nac skills validate "workflows/n8n/extensao-n8n-teste/List Pedidos OE V2.workflow.ts"
npx --yes n8nac push "workflows/n8n/extensao-n8n-teste/List Pedidos OE V2.workflow.ts" --verify
```

Ative o workflow no n8n e use `n8n_webhook_mode=webhook` em produção (ou `webhook-test` + **Execute workflow** no editor).
