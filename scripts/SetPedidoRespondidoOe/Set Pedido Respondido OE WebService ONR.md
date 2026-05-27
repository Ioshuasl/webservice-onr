# Set Pedido Respondido OE WebService ONR

Workflow n8n proxy para `SetPedidoRespondidoOE` (módulo 3.5 Ofícios Eletrônicos).

- **Workflow:** `workflows/n8n/extensao-n8n-teste/Set Pedido Respondido OE.workflow.ts`
- **Método:** [`webservice-onr/metodos/SetPedidoRespondidoOE.md`](../../webservice-onr/metodos/SetPedidoRespondidoOE.md)
- **Endpoint ONR padrão:** `https://hml3-wsoficio.onr.org.br/oficios.asmx`
- **Webhook:** `POST /webhook/7b8c9d0e-1f2a-4b3c-8d4e-5f6a7b8c9d0e`
- **Autenticação:** Basic Auth do n8n

## Request JSON

| Campo JSON | Campo SOAP | Obrigatório | Observação |
|------------|------------|-------------|------------|
| `hash` | `Hash` | sim | SHA-1 calculado com token do `LoginUsuarioCertificado`; 40 caracteres hexadecimais. |
| `id_pedido` | `IDPedido` | sim | Pedido obtido em `ListPedidosOE` / `ListPedidosOE_V2` ou `GetPedidoOE`. |
| `resposta` | `Resposta` | sim | Texto da resposta ao ofício. |
| `negativa` | `Negativa` | não | Padrão `false`. Use `true` para resposta negativa. |
| `anexos` | `Anexos[]` | sim | Array com ao menos um item. |
| `anexos[].nome` | `Anexos[].Nome` | sim | Nome do arquivo (spec: extensão `.p7s`). |
| `anexos[].url_arquivo` | `Anexos[].URLArquivo` | sim | URL pública http(s) do anexo. |
| `url_servico_onr` | endpoint HTTP | não | Padrão: homologação `oficios.asmx`. |

Exemplo:

```json
{
  "hash": "0123456789ABCDEF0123456789ABCDEF01234567",
  "id_pedido": 12345,
  "resposta": "Certidão emitida conforme solicitado.",
  "negativa": false,
  "anexos": [
    {
      "nome": "certidao.p7s",
      "url_arquivo": "https://exemplo.com/arquivos/certidao.p7s"
    }
  ],
  "url_servico_onr": "https://hml3-wsoficio.onr.org.br/oficios.asmx"
}
```

## Ordem SOAP

O `SetPedidoRespondidoOE_WSReq` no WSDL local usa esta ordem:

1. `Hash`
2. `IDPedido`
3. `Resposta`
4. `Negativa`
5. `Anexos` → `SetPedidoRespondidoOE_Anexo_WSReq[]`
   - `Nome`
   - `URLArquivo`

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
    "negativa": false,
    "quantidade_anexos": 1,
    "respondido": true
  }
}
```

## Pré-requisitos de negócio

Antes de chamar este webhook, confira com `GetPedidoOE` que o pedido está em status elegível (não respondido — erro ONR **53**, nem devolvido). O script CLI faz essa pré-validação automaticamente; o proxy n8n valida apenas o contrato de entrada.

## Status HTTP

| Situação | HTTP |
|----------|------|
| Sucesso ONR | `200` |
| Validação local ou campos inválidos (`10`–`14`, `54`, `55`, `501`) | `400` |
| Hash inválido, expirado ou já usado (`45`, `46`, `47`) | `401` |
| Sem permissão (`52`) | `403` |
| Pedido/arquivo não localizado (`51`, `102`) | `404` |
| Erro de sistema ONR (`0`) ou XML inválido | `502` |
| Falha temporária (`1`) | `503` |
| Demais erros de negócio (`53`, `56`, `60`, `101`–`105`, `502`) | `422` |
