# List Cartorios Restransmitir OE WebService ONR

Workflow n8n proxy para `ListCartoriosRestransmitirOE` (módulo 3.5 Ofícios Eletrônicos).

- **Workflow:** `workflows/n8n/extensao-n8n-teste/List Cartorios Restransmitir OE.workflow.ts`
- **Método:** [`webservice-onr/metodos/ListCartoriosRestransmitirOE.md`](../../webservice-onr/metodos/ListCartoriosRestransmitirOE.md)
- **Endpoint ONR padrão:** `https://hml3-wsoficio.onr.org.br/oficios.asmx`
- **Webhook:** `POST /webhook/36f93de2-d160-453e-a11f-94d8f6dedebc`
- **Autenticação:** Basic Auth do n8n

## Request JSON

| Campo JSON | Campo SOAP | Obrigatório | Observação |
|------------|------------|-------------|------------|
| `hash` | `Hash` | sim | SHA-1 calculado com token do `LoginUsuarioCertificado`; 40 caracteres hexadecimais. |
| `url_servico_onr` | endpoint HTTP | não | Padrão: homologação `oficios.asmx`. |

Exemplo:

```json
{
  "hash": "0123456789ABCDEF0123456789ABCDEF01234567",
  "url_servico_onr": "https://hml3-wsoficio.onr.org.br/oficios.asmx"
}
```

## Ordem SOAP

O `ListCartoriosRestransmitirOE_WSReq` no WSDL local usa esta ordem:

1. `Hash`

## Response JSON

Envelope padrão:

```json
{
  "status_http": 200,
  "sucesso": true,
  "codigo_erro": 0,
  "mensagem_erro": "",
  "dados": {
    "cartorios": [
      {
        "id_cartorio": 123,
        "cartorio": "01º RI"
      }
    ]
  }
}
```

## Status HTTP

| Situação | HTTP |
|----------|------|
| Sucesso ONR | `200` |
| Validação local, request inválido ou hash não informado (`10`, `11`) | `400` |
| Hash inválido, expirado ou já usado (`45`, `46`, `47`) | `401` |
| Usuário sem perfil/cartório válido (`51`, `52`) | `403` |
| Cartórios não localizados (`53`) | `404` |
| Erro de sistema ONR (`0`) ou XML inválido | `502` |
| Falha temporária (`1`) | `503` |
| Demais erros de negócio | `422` |
