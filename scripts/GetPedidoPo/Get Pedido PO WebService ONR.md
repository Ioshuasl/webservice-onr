# Get Pedido PO WebService ONR

Workflow n8n proxy para `GetPedidoPO` (módulo 3.3 Penhora Online).

- **Workflow:** `workflows/n8n/extensao-n8n-teste/Get Pedido PO.workflow.ts`
- **Workflow ID:** `qB8C62B2wWD6LYPc`
- **Método:** [`webservice-onr/metodos/GetPedidoPO.md`](../../webservice-onr/metodos/GetPedidoPO.md)
- **Endpoint ONR padrão:** `https://hml3-wsoficio.onr.org.br/penhoraonline.asmx`
- **Webhook:** `POST /webhook/a0b1c2d3-e4f5-4a6b-8c9d-0e1f2a3b4c5d`
- **Autenticação:** Basic Auth do n8n

## Request JSON

| Campo JSON | Campo SOAP | Obrigatório | Observação |
|------------|------------|-------------|------------|
| `hash` | `Hash` | sim | SHA-1 calculado com token do `LoginUsuarioCertificado`; 40 caracteres hexadecimais. |
| `id_pedido` | `IDPedido` | sim | Inteiro positivo obtido em `ListPedidosPO`. |
| `url_servico_onr` | endpoint HTTP | não | Padrão: homologação `penhoraonline.asmx`. |

Exemplo:

```json
{
  "hash": "0123456789ABCDEF0123456789ABCDEF01234567",
  "id_pedido": 18014820,
  "url_servico_onr": "https://hml3-wsoficio.onr.org.br/penhoraonline.asmx"
}
```

## Ordem SOAP

O `GetPedidoPO_WSReq` no WSDL local usa esta ordem:

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
    "id_pedido": 18014820,
    "id_tipo_pedido": 3,
    "id_status": 1,
    "id_processo": 123,
    "id_vara": 456,
    "id_boleto": 0,
    "protocolo": "20250000001",
    "numero_processo": "0000000-00.0000.0.00.0000",
    "observacao": "",
    "data_solicitacao": "2025-01-10 10:00:00",
    "tipo_resposta": "",
    "negativa": false,
    "resposta": "",
    "data_resposta": "",
    "motivo_devolucao": "",
    "pago": false,
    "valor_custas": 0,
    "valor_boleto_anexado": 0,
    "numero_prenotacao": "",
    "data_prenotacao": "",
    "data_vencimento_prenotacao": "",
    "advogado_nome": "",
    "advogado_telefone": "",
    "advogado_email": "",
    "parte_id": 0,
    "parte_nome": "",
    "parte_id_tipo": 0,
    "parte_cpf_cnpj": "",
    "matricula": "",
    "imoveis_direitos": false,
    "data_transferencia": "",
    "arquivo": "",
    "tipo_arquivo": 0
  }
}
```

## Status HTTP

| Situação | HTTP |
|----------|------|
| Sucesso ONR | `200` |
| Validação local ou request inválido (`10`, `11`, `12`) | `400` |
| Hash inválido, expirado ou já usado (`45`, `46`, `47`) | `401` |
| Sem permissão (`56`) | `403` |
| Pedido não encontrado (`57`) | `404` |
| Erro de sistema ONR (`0`) ou XML inválido | `502` |
| Falha temporária (`1`) | `503` |
| Demais erros de negócio (`51` a `55`) | `422` |

## Publicar

```bash
npx --yes n8nac skills validate "workflows/n8n/extensao-n8n-teste/Get Pedido PO.workflow.ts"
npx --yes n8nac push "workflows/n8n/extensao-n8n-teste/Get Pedido PO.workflow.ts" --verify
```

Ative o workflow no n8n para usar a URL de produção. Para `webhook-test`, execute o workflow no editor antes da chamada.
