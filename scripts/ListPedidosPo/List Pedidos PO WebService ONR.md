# List Pedidos PO WebService ONR

Workflow n8n proxy para `ListPedidosPO` (módulo 3.3 Penhora Online).

- **Workflow:** `workflows/n8n/extensao-n8n-teste/List Pedidos PO.workflow.ts`
- **Método:** [`webservice-onr/metodos/ListPedidosPO.md`](../../webservice-onr/metodos/ListPedidosPO.md)
- **Endpoint ONR padrão:** `https://hml3-wsoficio.onr.org.br/penhoraonline.asmx`
- **Webhook:** `POST /webhook/e9f0a1b2-c3d4-4e5f-9a0b-c1d2e3f4a5b6`
- **Autenticação:** Basic Auth do n8n

## Request JSON

| Campo JSON | Campo SOAP | Obrigatório | Observação |
|------------|------------|-------------|------------|
| `hash` | `Hash` | sim | SHA-1 calculado com token do `LoginUsuarioCertificado`; 40 caracteres hexadecimais. |
| `max_registros_por_pagina` | `MaxRowPerPage` | não | Padrão `50`; mínimo `10`. |
| `numero_pagina` | `PageNumber` | não | Padrão `1`. |
| `protocolo` | `Protocolo` | não | Vazio remove o filtro. |
| `id_vara` | `IDVara` | não | Padrão `-1` para todas; use `ListVarasPO` para códigos. |
| `id_tipo_pedido` | `IDTipoPedido` | não | Padrão `-1`; valores `1`, `2`, `3` ou `-1`. |
| `id_status` | `IDStatus` | não | Padrão `-1`; ver domínio `IDStatus-PO`. |
| `data_solicitacao_inicial` | `DataSolicitacaoInicial` | sim | Formato `aaaa-mm-dd`. |
| `data_solicitacao_final` | `DataSolicitacaoFinal` | sim | Formato `aaaa-mm-dd`; período máximo de 30 dias. |
| `data_resposta_inicial` | `DataRespostaInicial` | não | Formato `aaaa-mm-dd`; vazio se não usar. |
| `data_resposta_final` | `DataRespostaFinal` | não | Formato `aaaa-mm-dd`; vazio se não usar. |
| `url_servico_onr` | endpoint HTTP | não | Padrão: homologação `penhoraonline.asmx`. |

Exemplo:

```json
{
  "hash": "0123456789ABCDEF0123456789ABCDEF01234567",
  "max_registros_por_pagina": 50,
  "numero_pagina": 1,
  "protocolo": "",
  "id_vara": -1,
  "id_tipo_pedido": -1,
  "id_status": -1,
  "data_solicitacao_inicial": "2025-01-01",
  "data_solicitacao_final": "2025-01-31",
  "data_resposta_inicial": "",
  "data_resposta_final": "",
  "url_servico_onr": "https://hml3-wsoficio.onr.org.br/penhoraonline.asmx"
}
```

## Ordem SOAP

O `ListPedidosPO_WSReq` no WSDL local usa esta ordem:

1. `Hash`
2. `MaxRowPerPage`
3. `PageNumber`
4. `Protocolo`
5. `IDVara`
6. `IDTipoPedido`
7. `IDStatus`
8. `DataSolicitacaoInicial`
9. `DataSolicitacaoFinal`
10. `DataRespostaInicial`
11. `DataRespostaFinal`

O workflow sempre envia os campos opcionais como string vazia quando não usados, acompanhando o script JavaScript para evitar `NullReferenceException` no servidor .NET.

## Response JSON

Envelope padrão:

```json
{
  "status_http": 200,
  "sucesso": true,
  "codigo_erro": 0,
  "mensagem_erro": "",
  "dados": {
    "quantidade_registros": 1,
    "quantidade_paginas": 1,
    "pedidos": [
      {
        "id_pedido": 123,
        "protocolo": "20250000001",
        "id_vara": 10,
        "vara": "1ª Vara",
        "id_tipo_pedido": 3,
        "id_status": 1,
        "data_solicitacao": "2025-01-10",
        "data_resposta": ""
      }
    ]
  }
}
```

## Status HTTP

| Situação | HTTP |
|----------|------|
| Sucesso ONR | `200` |
| Validação local ou campos inválidos ONR (`10` a `23`) | `400` |
| Hash inválido, expirado ou já usado (`45`, `46`, `47`) | `401` |
| Recurso não encontrado (`51`) | `404` |
| Sem permissão ou operação incompatível (`50`, `52`, `53`) | `403` |
| Erro de sistema ONR (`0`) ou XML inválido | `502` |
| Falha temporária (`1`) | `503` |
| Demais erros de negócio | `422` |
