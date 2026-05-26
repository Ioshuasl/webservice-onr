# Set Pedido Matricula Devolvido PO WebService ONR

Workflow n8n proxy para `SetPedidoMatriculaDevolvidoPO` (módulo 3.3 Penhora Online).

- **Workflow:** `workflows/n8n/extensao-n8n-teste/Set Pedido Matricula Devolvido PO.workflow.ts`
- **Método:** [`webservice-onr/metodos/SetPedidoMatriculaDevolvidoPO.md`](../../webservice-onr/metodos/SetPedidoMatriculaDevolvidoPO.md)
- **Endpoint ONR padrão:** `https://hml3-wsoficio.onr.org.br/penhoraonline.asmx`
- **Webhook:** `POST /webhook/c3d4e5f6-a7b8-4c9d-0e1f-a2b3c4d5e6f7`
- **Autenticação:** Basic Auth do n8n

## Request JSON

| Campo JSON | Campo SOAP | Obrigatório | Observação |
|------------|------------|-------------|------------|
| `hash` | `Hash` | sim | SHA-1 calculado com token do `LoginUsuarioCertificado`; 40 caracteres hexadecimais. |
| `id_pedido` | `IDPedido` | sim | Pedido de certidão por matrícula; deve ser `IDTipoPedido=1`. |
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

O `SetPedidoMatriculaDevolvidoPO_WSReq` no WSDL local usa esta ordem:

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
