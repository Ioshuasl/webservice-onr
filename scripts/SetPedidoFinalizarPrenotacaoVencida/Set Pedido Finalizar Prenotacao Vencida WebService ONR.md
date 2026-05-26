# Set Pedido Finalizar Prenotacao Vencida — WebService ONR (n8n)

Workflow n8n proxy para `SetPedidoFinalizarPrenotacaoVencida` (módulo 3.3 Penhora Online).

- **Workflow:** [`workflows/n8n/extensao-n8n-teste/Set Pedido Finalizar Prenotacao Vencida.workflow.ts`](../../workflows/n8n/extensao-n8n-teste/Set%20Pedido%20Finalizar%20Prenotacao%20Vencida.workflow.ts)
- **Método:** [`webservice-onr/metodos/SetPedidoFinalizarPrenotacaoVencida.md`](../../webservice-onr/metodos/SetPedidoFinalizarPrenotacaoVencida.md)
- **Scripts CLI:** [`setPedidoFinalizarPrenotacaoVencida.js`](setPedidoFinalizarPrenotacaoVencida.js) · [`setPedidoFinalizarPrenotacaoVencida.py`](setPedidoFinalizarPrenotacaoVencida.py)
- **Postman:** [`postman/onr-webservice-n8n.postman_collection.json`](../../postman/onr-webservice-n8n.postman_collection.json) (request **Set Pedido Finalizar Prenotacao Vencida — Finalizar**)

## Pré-requisito

Obter `hash` via workflow **Auth ONR** ou `npm run login`. Ver [`webservice-onr/hash.md`](../../webservice-onr/hash.md).

O pedido deve ser de **Certidão por Matrícula** (`IDTipoPedido=1`) e estar com prenotação vencida, em geral `IDStatus=11`.

## Request (JSON snake_case)

| Campo | Tipo | Obrigatório | SOAP |
|-------|------|-------------|------|
| `hash` | string | sim | `Hash` |
| `id_pedido` | number | sim | `IDPedido` |
| `resposta` | string | sim | `Resposta` |
| `anexos[]` | array | sim | `Anexos[]` |
| `anexos[].nome` | string | sim | `Anexos[].Nome` |
| `anexos[].url_arquivo` | string | sim | `Anexos[].URLArquivo` |
| `url_servico_onr` | string | sim | endpoint SOAP |

`anexos[].matricula` também é aceito como alias de `nome`, seguindo o script de referência.

### Exemplo

```json
{
  "hash": "A1B2C3D4E5F6789012345678901234567890ABCDEF",
  "id_pedido": 18014709,
  "resposta": "Certidão emitida conforme solicitado.",
  "anexos": [
    {
      "nome": "Certidão matrícula 12345",
      "url_arquivo": "https://exemplo.com/certidao-12345.p7s"
    }
  ],
  "url_servico_onr": "https://hml3-wsoficio.onr.org.br/penhoraonline.asmx"
}
```

## Response

```json
{
  "status_http": 200,
  "sucesso": true,
  "codigo_erro": 0,
  "mensagem_erro": "",
  "dados": {
    "id_pedido": 18014709,
    "quantidade_anexos": 1,
    "prenotacao_vencida_finalizada": true
  }
}
```

### HTTP status

| Situação | Código |
|----------|--------|
| Sucesso | 200 |
| Validação local / request inválido (10–14, 54, 55, 104, 501) | 400 |
| Hash inválido/usado/expirado (45–47) | 401 |
| Sem permissão (52) | 403 |
| Pedido/arquivo não localizado (51, 102) | 404 |
| Resposta já cadastrada aguardando download (502) | 409 |
| Falha ONR / conexão | 502 |
| Falha temporária/cadastro de arquivo | 503 |
| Demais regras de negócio | 422 |

## Webhook

- Path: `b2c3d4e5-f6a7-4b8c-9d0e-f1a2b3c4d5e7`
- URL teste: `https://<n8n>/webhook-test/b2c3d4e5-f6a7-4b8c-9d0e-f1a2b3c4d5e7`
- Basic Auth (mesmas credenciais do Auth ONR)

## Publicar

```bash
npx --yes n8nac skills validate "workflows/n8n/extensao-n8n-teste/Set Pedido Finalizar Prenotacao Vencida.workflow.ts"
npx --yes n8nac push "workflows/n8n/extensao-n8n-teste/Set Pedido Finalizar Prenotacao Vencida.workflow.ts" --verify
```

Ative o workflow no n8n e use `n8n_webhook_mode=webhook` em produção (ou `webhook-test` + **Execute workflow** no editor).
