# Set Pedido Pessoa Devolvido PO WebService ONR

Workflow n8n proxy para `SetPedidoPessoaDevolvidoPO` (módulo 3.3 Penhora Online).

- **Workflow:** `workflows/n8n/extensao-n8n-teste/Set Pedido Pessoa Devolvido PO.workflow.ts`
- **Método:** [`webservice-onr/metodos/SetPedidoPessoaDevolvidoPO.md`](../../webservice-onr/metodos/SetPedidoPessoaDevolvidoPO.md)
- **Endpoint ONR padrão:** `https://hml3-wsoficio.onr.org.br/penhoraonline.asmx`
- **Webhook:** `POST /webhook/b2c3d4e5-f6a7-4b8c-9d0e-f1a2b3c4d5e6`
- **Autenticação:** Basic Auth do n8n

## Request JSON

| Campo JSON | Campo SOAP | Obrigatório | Observação |
|------------|------------|-------------|------------|
| `hash` | `Hash` | sim | SHA-1 calculado com token do `LoginUsuarioCertificado`; 40 caracteres hexadecimais. |
| `id_pedido` | `IDPedido` | sim | Pedido de certidão por pessoa; deve ser `IDTipoPedido=2`. |
| `resposta` | `Resposta` | sim | Motivo da devolução. |
| `url_servico_onr` | endpoint HTTP | não | Padrão: homologação `penhoraonline.asmx`. |

Exemplo:

```json
{
  "hash": "0123456789ABCDEF0123456789ABCDEF01234567",
  "id_pedido": 12345,
  "resposta": "Documentação incompleta",
  "url_servico_onr": "https://hml3-wsoficio.onr.org.br/penhoraonline.asmx"
}
```

## Ordem SOAP

O `SetPedidoPessoaDevolvidoPO_WSReq` no WSDL local usa esta ordem:

1. `Hash`
2. `IDPedido`
3. `Resposta`

## Response JSON

Envelope padrão:

```json
{
  "status_http": 200,
  "sucesso": true,
  "codigo_erro": 0,
  "mensagem_erro": "",
  "dados": {
    "id_pedido": 12345,
    "resposta": "Documentação incompleta",
    "devolvido": true
  }
}
```

## Status HTTP

| Situação | HTTP |
|----------|------|
| Sucesso ONR | `200` |
| Validação local ou campos inválidos ONR (`10` a `13`) | `400` |
| Hash inválido, expirado ou já usado (`45`, `46`, `47`) | `401` |
| Pedido não localizado (`51`) | `404` |
| Sem permissão (`52`) | `403` |
| Erro de sistema ONR (`0`) ou XML inválido | `502` |
| Falha temporária (`1`) | `503` |
| Demais erros de negócio, incluindo tipo de pedido incompatível (`53`) | `422` |
