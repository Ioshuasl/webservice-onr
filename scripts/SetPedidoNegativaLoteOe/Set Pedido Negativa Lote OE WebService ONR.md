# Set Pedido Negativa Lote OE — WebService ONR (proxy n8n)

Webhook n8n para o método SOAP `SetPedidoNegativaLoteOE` (módulo 3.5 Ofícios), seguindo o pipeline do Auth ONR: validação local, chamada SOAP e resposta JSON em snake_case.

## Endpoint (n8n)

- Método: `POST`
- URL (teste): `{{n8n_base_url}}/webhook-test/{{n8n_webhook_id_set_pedido_negativa_lote_oe}}`
- URL (produção): `{{n8n_base_url}}/webhook/{{n8n_webhook_id_set_pedido_negativa_lote_oe}}`
- Autenticação: Basic Auth do n8n

## Request JSON

```json
{
  "hash": "40_HEX_UPPERCASE",
  "pedidos": [
    { "id_pedido": 101 },
    102
  ],
  "url_servico_onr": "https://hml3-wsoficio.onr.org.br/oficios.asmx"
}
```

### Regras de validação

- `hash`: obrigatório, 40 hexadecimais (`[0-9A-F]{40}`).
- `pedidos`: obrigatório, array não vazio.
- Cada item de `pedidos` aceita:
  - número inteiro positivo, ou
  - objeto com `id_pedido`, `idPedido` ou `IDPedido`.
- IDs duplicados são rejeitados.
- `url_servico_onr`: obrigatória (default do workflow: endpoint de homologação do módulo Ofícios).

## Mapeamento JSON -> SOAP

| JSON | SOAP (`SetPedidoNegativaLoteOE_WSReq`) |
|---|---|
| `hash` | `Hash` |
| `pedidos[].id_pedido` | `Pedidos/int[]` (`ArrayOfInt`) |

## Response JSON (envelope padrão)

```json
{
  "status_http": 200,
  "sucesso": true,
  "codigo_erro": 0,
  "mensagem_erro": "",
  "dados": {
    "operacao_soap": "SetPedidoNegativaLoteOE",
    "quantidade_pedidos": 2,
    "quantidade_falhas": 0,
    "pedidos": [
      {
        "id_pedido": 101,
        "sucesso": true,
        "codigo_erro": 0,
        "mensagem_erro": ""
      }
    ]
  }
}
```

### Mapeamento de status HTTP

- `200`: sucesso global e sem falhas por pedido.
- `400`: erro de validação local (`10`, `11`, `12`) ou ID inválido por pedido (`151`).
- `401`: erro de hash ONR (`45`, `46`, `47`).
- `403`: sem permissão (`153`).
- `404`: pedido não encontrado/sem dados (`152`).
- `422`: erro de negócio ONR (demais códigos por pedido, ex.: `154`, `155`).
- `502`: falha de conexão com ONR, XML inválido, ou erro interno ONR (`0`).
- `503`: indisponibilidade temporária ONR (`1`).

## Exemplo cURL

```bash
curl --request POST \
  --url "$N8N_BASE_URL/webhook-test/$N8N_WEBHOOK_ID_SET_PEDIDO_NEGATIVA_LOTE_OE" \
  --user "$N8N_BASIC_AUTH_USER:$N8N_BASIC_AUTH_PASSWORD" \
  --header "Content-Type: application/json" \
  --data '{
    "hash": "'"$ONR_HASH"'",
    "pedidos": [{ "id_pedido": 18014708 }],
    "url_servico_onr": "https://hml3-wsoficio.onr.org.br/oficios.asmx"
  }'
```
