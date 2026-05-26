# Set Pedido Pessoa Respondido PO — WebService ONR (n8n)

Workflow n8n proxy para `SetPedidoPessoaRespondidoPO` (módulo 3.3 Penhora Online).

- **Workflow:** [`workflows/n8n/extensao-n8n-teste/Set Pedido Pessoa Respondido PO.workflow.ts`](../../workflows/n8n/extensao-n8n-teste/Set%20Pedido%20Pessoa%20Respondido%20PO.workflow.ts)
- **Método:** [`webservice-onr/metodos/SetPedidoPessoaRespondidoPO.md`](../../webservice-onr/metodos/SetPedidoPessoaRespondidoPO.md)
- **Scripts CLI:** [`setPedidoPessoaRespondidoPo.js`](setPedidoPessoaRespondidoPo.js) · [`setPedidoPessoaRespondidoPo.py`](setPedidoPessoaRespondidoPo.py)
- **Postman:** [`postman/onr-webservice-n8n.postman_collection.json`](../../postman/onr-webservice-n8n.postman_collection.json) (request **Set Pedido Pessoa Respondido PO — Responder**)

## Pré-requisito

Obter `hash` via workflow **Auth ONR** ou `npm run login`. Ver [`webservice-onr/hash.md`](../../webservice-onr/hash.md).

O pedido deve ser do tipo **Certidão por Pessoa** (`IDTipoPedido=2`) e deve ter ao menos um anexo com matrícula e URL pública.

## Request (JSON snake_case)

| Campo | Tipo | Obrigatório | SOAP |
|-------|------|-------------|------|
| `hash` | string | sim | `Hash` |
| `id_pedido` | number | sim | `IDPedido` |
| `resposta` | string | sim | `Resposta` |
| `negativa` | boolean | sim | `Negativa` |
| `anexos[].matricula` | string | sim | `Anexos[].Matricula` |
| `anexos[].url_arquivo` | string | sim | `Anexos[].URLArquivo` |
| `url_servico_onr` | string | sim | endpoint SOAP |

### Exemplo

```json
{
  "hash": "A1B2C3D4E5F6789012345678901234567890ABCDEF",
  "id_pedido": 18014709,
  "resposta": "Certidão emitida conforme solicitado.",
  "negativa": false,
  "anexos": [
    {
      "matricula": "12345",
      "url_arquivo": "https://example.com/certidao.p7s"
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
    "negativa": false,
    "quantidade_anexos": 1,
    "respondido": true
  }
}
```

### HTTP status

| Situação | Código |
|----------|--------|
| Sucesso | 200 |
| Validação local / request inválido (10–14, 54, 55, 501) | 400 |
| Hash inválido/usado/expirado (45–47) | 401 |
| Sem permissão (52) | 403 |
| Pedido/arquivo não encontrado (51, 102) | 404 |
| Regra de negócio ONR (53, 60, 101, 103–105, 502) | 422 |
| Falha ONR / conexão | 502 |

## Webhook

- Path: `e9f0a1b2-c3d4-4e5f-9a0b-c1d2e3f4a5b7`
- URL teste: `https://<n8n>/webhook-test/e9f0a1b2-c3d4-4e5f-9a0b-c1d2e3f4a5b7`
- Basic Auth (mesmas credenciais do Auth ONR)

## Publicar

```bash
npx --yes n8nac skills validate "workflows/n8n/extensao-n8n-teste/Set Pedido Pessoa Respondido PO.workflow.ts"
npx --yes n8nac push "workflows/n8n/extensao-n8n-teste/Set Pedido Pessoa Respondido PO.workflow.ts" --verify
```

Ative o workflow no n8n e use `n8n_webhook_mode=webhook` em produção (ou `webhook-test` + **Execute workflow** no editor).
