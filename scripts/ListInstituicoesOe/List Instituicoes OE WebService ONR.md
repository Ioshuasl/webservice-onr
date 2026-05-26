# List Instituicoes OE WebService ONR

Workflow n8n proxy para `ListInstituicoesOE` (módulo 3.5 Ofícios Eletrônicos).

- **Workflow:** `workflows/n8n/extensao-n8n-teste/List Instituicoes OE.workflow.ts`
- **Método:** [`webservice-onr/metodos/ListInstituicoesOE.md`](../../webservice-onr/metodos/ListInstituicoesOE.md)
- **Endpoint ONR padrão:** `https://hml3-wsoficio.onr.org.br/oficios.asmx`
- **Webhook:** `POST /webhook/91f0d4c2-7a6b-4e5f-9c81-2d3e4f5a6b7c`
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

O `ListInstituicoesOE_WSReq` no WSDL local usa esta ordem:

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
    "instituicoes": [
      {
        "id_instituicao": 123,
        "instituicao": "Instituição solicitante"
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
| Instituições não localizadas/indisponíveis (`51`) | `404` |
| Erro de sistema ONR (`0`) ou XML inválido | `502` |
| Falha temporária (`1`) | `503` |
| Demais erros de negócio | `422` |
