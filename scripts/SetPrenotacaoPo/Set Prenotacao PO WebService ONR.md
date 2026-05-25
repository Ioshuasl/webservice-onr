# Set Prenotacao PO WebService ONR

Workflow n8n proxy para `SetPrenotacaoPO` (módulo 3.3 Penhora Online).

- **Workflow:** `workflows/n8n/extensao-n8n-teste/Set Prenotacao PO.workflow.ts`
- **Método:** [`webservice-onr/metodos/SetPrenotacaoPO.md`](../../webservice-onr/metodos/SetPrenotacaoPO.md)
- **Endpoint ONR padrão:** `https://hml3-wsoficio.onr.org.br/penhoraonline.asmx`
- **Webhook:** `POST /webhook/a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d`
- **Autenticação:** Basic Auth do n8n

## Request JSON

| Campo JSON | Campo SOAP | Obrigatório | Observação |
|------------|------------|-------------|------------|
| `hash` | `Hash` | sim | SHA-1 calculado com token do `LoginUsuarioCertificado`; 40 caracteres hexadecimais. |
| `id_pedido` | `IDPedido` | sim | Pedido de Penhora Online; deve ser `IDTipoPedido=3`. |
| `numero_prenotacao` | `NumeroPrenotacao` | sim | Número da prenotação. |
| `data_prenotacao` | `DataPrenotacao` | sim | Formato `aaaa-mm-dd`. |
| `data_vencimento` | `DataVencimento` | sim | Formato `aaaa-mm-dd`; não pode ser anterior à prenotação. |
| `url_servico_onr` | endpoint HTTP | não | Padrão: homologação `penhoraonline.asmx`. |

Exemplo:

```json
{
  "hash": "0123456789ABCDEF0123456789ABCDEF01234567",
  "id_pedido": 18014820,
  "numero_prenotacao": "1516",
  "data_prenotacao": "2025-01-09",
  "data_vencimento": "2025-02-09",
  "url_servico_onr": "https://hml3-wsoficio.onr.org.br/penhoraonline.asmx"
}
```

## Ordem SOAP

O `SetPrenotacaoPO_WSReq` no WSDL local usa esta ordem:

1. `Hash`
2. `IDPedido`
3. `NumeroPrenotacao`
4. `DataPrenotacao`
5. `DataVencimento`

## Response JSON

Envelope padrão:

```json
{
  "status_http": 200,
  "sucesso": true,
  "codigo_erro": 0,
  "mensagem_erro": "",
  "dados": {
    "id_pedido": 18014820,
    "numero_prenotacao": "1516",
    "data_prenotacao": "2025-01-09",
    "data_vencimento": "2025-02-09",
    "prenotacao_registrada": true
  }
}
```

## Status HTTP

| Situação | HTTP |
|----------|------|
| Sucesso ONR | `200` |
| Validação local ou campos inválidos ONR (`10` a `18`) | `400` |
| Hash inválido, expirado ou já usado (`45`, `46`, `47`) | `401` |
| Pedido não localizado (`51`) | `404` |
| Sem permissão (`52`) | `403` |
| Pedido já possui prenotação (`55`) | `409` |
| Erro de sistema ONR (`0`) ou XML inválido | `502` |
| Falha temporária (`1`) | `503` |
| Demais erros de negócio, incluindo tipo de pedido incompatível (`53`, `54`) | `422` |
