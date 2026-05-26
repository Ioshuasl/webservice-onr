# Set Pedido Negativa Lote PO — WebService ONR (n8n)

Workflow n8n proxy para `SetPedidoNegativaLotePO` (módulo 3.3 Penhora Online).

- **Workflow:** [`workflows/n8n/extensao-n8n-teste/Set Pedido Negativa Lote PO.workflow.ts`](../../workflows/n8n/extensao-n8n-teste/Set%20Pedido%20Negativa%20Lote%20PO.workflow.ts)
- **Método:** [`webservice-onr/metodos/SetPedidoNegativaLotePO.md`](../../webservice-onr/metodos/SetPedidoNegativaLotePO.md)
- **Scripts CLI:** [`setPedidoNegativaLotePo.js`](setPedidoNegativaLotePo.js) · [`setPedidoNegativaLotePo.py`](setPedidoNegativaLotePo.py)
- **Postman:** [`postman/onr-webservice-n8n.postman_collection.json`](../../postman/onr-webservice-n8n.postman_collection.json) (request **Set Pedido Negativa Lote PO — Negativar**)

## Pré-requisito

Obter `hash` via workflow **Auth ONR** ou `npm run login`. Ver [`webservice-onr/hash.md`](../../webservice-onr/hash.md).

Os pedidos devem ser do tipo **Certidão por Pessoa** (`IDTipoPedido=2`).

## Request (JSON snake_case)

| Campo | Tipo | Obrigatório | SOAP |
|-------|------|-------------|------|
| `hash` | string | sim | `Hash` |
| `pedidos[]` | array | sim | `Pedidos[]` |
| `pedidos[].id_pedido` | number | sim | `Pedidos[].IDPedido` |
| `url_servico_onr` | string | sim | endpoint SOAP |

`pedidos[]` também aceita itens numéricos, além de objetos `{ "id_pedido": 18014708 }`.

### Exemplo

```json
{
  "hash": "A1B2C3D4E5F6789012345678901234567890ABCDEF",
  "pedidos": [
    { "id_pedido": 18014708 }
  ],
  "url_servico_onr": "https://hml3-wsoficio.onr.org.br/penhoraonline.asmx"
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
    "quantidade_pedidos": 1,
    "quantidade_falhas": 0,
    "pedidos": [
      {
        "id_pedido": 18014708,
        "sucesso": true,
        "codigo_erro": 0,
        "mensagem_erro": ""
      }
    ]
  }
}
```

Se o envelope global retornar sucesso, mas algum item do lote falhar, `sucesso=false`, `status_http=422` (ou outro status mapeado pelo primeiro erro por pedido) e `dados.pedidos[]` mantém o detalhe individual.

### HTTP status

| Situação | Código |
|----------|--------|
| Sucesso global + todos pedidos OK | 200 |
| Validação local / request inválido (10–12, 151) | 400 |
| Hash inválido/usado/expirado (45–47) | 401 |
| Sem permissão por pedido (153) | 403 |
| Pedido não localizado / tipo inválido (152) | 404 |
| Regra de negócio por pedido (154, 155) | 422 |
| Falha ONR / conexão | 502 |

## Webhook

- Path: `f0a1b2c3-d4e5-4f6a-8b9c-d0e1f2a3b4c6`
- URL teste: `https://<n8n>/webhook-test/f0a1b2c3-d4e5-4f6a-8b9c-d0e1f2a3b4c6`
- Basic Auth (mesmas credenciais do Auth ONR)

## Publicar

```bash
npx --yes n8nac skills validate "workflows/n8n/extensao-n8n-teste/Set Pedido Negativa Lote PO.workflow.ts"
npx --yes n8nac push "workflows/n8n/extensao-n8n-teste/Set Pedido Negativa Lote PO.workflow.ts" --verify
```

Ative o workflow no n8n e use `n8n_webhook_mode=webhook` em produção (ou `webhook-test` + **Execute workflow** no editor).
