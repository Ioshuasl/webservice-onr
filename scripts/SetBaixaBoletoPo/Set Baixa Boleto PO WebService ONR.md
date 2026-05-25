# Set Baixa Boleto PO — WebService ONR (n8n)

Workflow n8n proxy para `SetBaixaBoletoPO` (módulo 3.3 Penhora Online).

- **Workflow:** [`workflows/n8n/extensao-n8n-teste/Set Baixa Boleto PO.workflow.ts`](../../workflows/n8n/extensao-n8n-teste/Set%20Baixa%20Boleto%20PO.workflow.ts)
- **Método:** [`webservice-onr/metodos/SetBaixaBoletoPO.md`](../../webservice-onr/metodos/SetBaixaBoletoPO.md)
- **Scripts CLI:** [`setBaixaBoletoPo.js`](setBaixaBoletoPo.js) · [`setBaixaBoletoPo.py`](setBaixaBoletoPo.py)
- **Postman:** [`postman/onr-webservice-n8n.postman_collection.json`](../../postman/onr-webservice-n8n.postman_collection.json) (request **Set Baixa Boleto PO — Baixar**)

## Pré-requisito

Obter `hash` via workflow **Auth ONR** ou `npm run login`. Ver [`webservice-onr/hash.md`](../../webservice-onr/hash.md).

O `id_boleto` vem de `ListBoletosPO`.

## Request (JSON snake_case)

| Campo | Tipo | Obrigatório | SOAP |
|-------|------|-------------|------|
| `hash` | string | sim | `Hash` |
| `id_boleto` | number | sim | `IDBoleto` |
| `url_servico_onr` | string | sim | endpoint SOAP |

### Exemplo

```json
{
  "hash": "A1B2C3D4E5F6789012345678901234567890ABCDEF",
  "id_boleto": 184569,
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
    "id_boleto": 184569,
    "baixa_efetuada": true
  }
}
```

### HTTP status

| Situação | Código |
|----------|--------|
| Sucesso | 200 |
| Validação local / request inválido (10–12) | 400 |
| Hash inválido/usado/expirado (45–47) | 401 |
| Boleto não localizado / dados indisponíveis (51) | 404 |
| Baixa não efetuada / já efetuada (52, 501) | 422 |
| Falha ONR / conexão | 502 |

## Webhook

- Path: `c7d8e9f0-a1b2-4c3d-8e9f-0a1b2c3d4e5f`
- URL teste: `https://<n8n>/webhook-test/c7d8e9f0-a1b2-4c3d-8e9f-0a1b2c3d4e5f`
- Basic Auth (mesmas credenciais do Auth ONR)

## Publicar

```bash
npx --yes n8nac skills validate "workflows/n8n/extensao-n8n-teste/Set Baixa Boleto PO.workflow.ts"
npx --yes n8nac push "workflows/n8n/extensao-n8n-teste/Set Baixa Boleto PO.workflow.ts" --verify
```

Ative o workflow no n8n e use `n8n_webhook_mode=webhook` em produção (ou `webhook-test` + **Execute workflow** no editor).
