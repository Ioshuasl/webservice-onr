# Get Pedido OE WebService ONR

Workflow n8n proxy para `GetPedidoOE` (módulo 3.5 Ofícios Eletrônicos).

- **Workflow:** `workflows/n8n/extensao-n8n-teste/Get Pedido OE.workflow.ts`
- **Método:** [`webservice-onr/metodos/GetPedidoOE.md`](../../webservice-onr/metodos/GetPedidoOE.md)
- **Endpoint ONR padrão:** `https://hml3-wsoficio.onr.org.br/oficios.asmx`
- **Webhook:** `POST /webhook/2f3a4b5c-6d7e-4f8a-9b0c-1d2e3f4a5b6c`
- **Autenticação:** Basic Auth do n8n

## Request JSON

| Campo JSON | Campo SOAP | Obrigatório | Observação |
|------------|------------|-------------|------------|
| `hash` | `Hash` | sim | SHA-1 calculado com token do `LoginUsuarioCertificado`; 40 caracteres hexadecimais. |
| `id_pedido` | `IDPedido` | sim | Pedido obtido em `ListPedidosOE` ou `ListPedidosOE_V2`. |
| `url_servico_onr` | endpoint HTTP | não | Padrão: homologação `oficios.asmx`. |

Exemplo:

```json
{
  "hash": "0123456789ABCDEF0123456789ABCDEF01234567",
  "id_pedido": 12345,
  "url_servico_onr": "https://hml3-wsoficio.onr.org.br/oficios.asmx"
}
```

## Ordem SOAP

O `GetPedidoOE_WSReq` no WSDL local usa esta ordem:

1. `Hash`
2. `IDPedido`

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
    "id_status": 1,
    "id_instituicao": 10,
    "instituicao": "Instituição solicitante",
    "protocolo": "OE-0001",
    "numero_oficio": "123/2026"
  }
}
```

`dados` também inclui os demais campos do WSDL em snake_case: usuário, tipo de pesquisa/certidão, datas, resposta, pessoa pesquisada, imóvel/endereço e pactuantes.

## Status HTTP

| Situação | HTTP |
|----------|------|
| Sucesso ONR | `200` |
| Validação local ou campos inválidos ONR (`10`, `11`, `12`) | `400` |
| Hash inválido, expirado ou já usado (`45`, `46`, `47`) | `401` |
| Pedido não localizado/dados indisponíveis (`51`) | `404` |
| Sem permissão para o pedido (`56`) | `403` |
| Erro de sistema ONR (`0`) ou XML inválido | `502` |
| Falha temporária (`1`) | `503` |
| Demais erros de negócio | `422` |
