# List Varas PO WebService ONR

Workflow n8n proxy para `ListVarasPO` (módulo 3.3 Penhora Online).

- **Workflow:** `workflows/n8n/extensao-n8n-teste/List Varas PO.workflow.ts`
- **Método:** [`webservice-onr/metodos/ListVarasPO.md`](../../webservice-onr/metodos/ListVarasPO.md)
- **Endpoint ONR padrão:** `https://hml3-wsoficio.onr.org.br/penhoraonline.asmx`
- **Webhook:** `POST /webhook/f0a1b2c3-d4e5-4f6a-9b8c-d7e6f5a4b3c2`
- **Autenticação:** Basic Auth do n8n

## Request JSON

| Campo JSON | Campo SOAP | Obrigatório | Observação |
|------------|------------|-------------|------------|
| `hash` | `Hash` | sim | SHA-1 calculado com token do `LoginUsuarioCertificado`; 40 caracteres hexadecimais. |
| `id_estado` | `IDEstado` | não | Padrão `-1` para todos; use inteiro positivo para filtrar. |
| `id_comarca` | `IDComarca` | não | Padrão `-1` para todas; use inteiro positivo para filtrar. |
| `id_foro` | `IDForo` | não | Padrão `-1` para todos; use inteiro positivo para filtrar. |
| `url_servico_onr` | endpoint HTTP | não | Padrão: homologação `penhoraonline.asmx`. |

Exemplo:

```json
{
  "hash": "0123456789ABCDEF0123456789ABCDEF01234567",
  "id_estado": -1,
  "id_comarca": -1,
  "id_foro": -1,
  "url_servico_onr": "https://hml3-wsoficio.onr.org.br/penhoraonline.asmx"
}
```

## Ordem SOAP

O `ListVarasPO_WSReq` no WSDL local usa esta ordem:

1. `Hash`
2. `IDEstado`
3. `IDComarca`
4. `IDForo`

## Response JSON

Envelope padrão:

```json
{
  "status_http": 200,
  "sucesso": true,
  "codigo_erro": 0,
  "mensagem_erro": "",
  "dados": {
    "varas": [
      {
        "id_vara": 123,
        "id_foro": 10,
        "id_comarca": 20,
        "id_estado": 26,
        "vara": "1ª Vara",
        "foro": "Foro Central",
        "comarca": "São Paulo",
        "estado": "SP"
      }
    ]
  }
}
```

## Status HTTP

| Situação | HTTP |
|----------|------|
| Sucesso ONR | `200` |
| Validação local ou campos inválidos ONR (`10` a `14`) | `400` |
| Hash inválido, expirado ou já usado (`45`, `46`, `47`) | `401` |
| Varas não localizadas/indisponíveis (`51`) | `404` |
| Sem permissão (`50`, `52`, `53`) | `403` |
| Erro de sistema ONR (`0`) ou XML inválido | `502` |
| Falha temporária (`1`) | `503` |
| Demais erros de negócio | `422` |
