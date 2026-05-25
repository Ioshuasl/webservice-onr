# Delete Titulo AT — WebService ONR (n8n)

Workflow n8n proxy para `DeleteTituloAT` (módulo 3.2 Acompanhamento de Títulos).

- **Workflow:** [`workflows/n8n/extensao-n8n-teste/Delete Titulo AT.workflow.ts`](../../workflows/n8n/extensao-n8n-teste/Delete%20Titulo%20AT.workflow.ts)
- **Método:** [`webservice-onr/metodos/DeleteTituloAT.md`](../../webservice-onr/metodos/DeleteTituloAT.md)
- **Scripts CLI:** [`deleteTituloAt.js`](deleteTituloAt.js) · [`deleteTituloAt.py`](deleteTituloAt.py)
- **Postman:** [`postman/onr-webservice-n8n.postman_collection.json`](../../postman/onr-webservice-n8n.postman_collection.json) (request **Delete Titulo AT — Excluir**)

## Pré-requisito

Obter `hash` via workflow **Auth ONR** ou `npm run login`. Ver [`webservice-onr/hash.md`](../../webservice-onr/hash.md).

## Request (JSON snake_case)

| Campo | Tipo | Obrigatório | SOAP |
|-------|------|-------------|------|
| `hash` | string | sim | `Hash` |
| `id_titulo` | number | sim | `IDTitulo` |
| `url_servico_onr` | string | sim | endpoint SOAP |

### Exemplo

```json
{
  "hash": "A1B2C3D4E5F6789012345678901234567890ABCDEF",
  "id_titulo": 18151909,
  "url_servico_onr": "https://hml3-wsoficio.onr.org.br/acompanhamentotitulos.asmx"
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
    "id_titulo": 18151909,
    "excluido": true
  }
}
```

### HTTP status

| Situação | Código |
|----------|--------|
| Sucesso | 200 |
| Validação local / request inválido (10–12) | 400 |
| Hash inválido/usado/expirado (45–47) | 401 |
| Sem permissão (50) | 403 |
| Título não localizado (30) | 404 |
| Erro negócio ONR | 422 |
| Falha ONR / conexão | 502 |

## Webhook

- Path: `b5c6d7e8-f9a0-4b1c-2d3e-4f5a6b7c8d9e`
- URL teste: `https://<n8n>/webhook-test/b5c6d7e8-f9a0-4b1c-2d3e-4f5a6b7c8d9e`
- Basic Auth (mesmas credenciais do Auth ONR)

## Publicar

```bash
npx --yes n8nac skills validate "workflows/n8n/extensao-n8n-teste/Delete Titulo AT.workflow.ts"
npx --yes n8nac push "workflows/n8n/extensao-n8n-teste/Delete Titulo AT.workflow.ts" --verify
```

Ative o workflow no n8n e use `n8n_webhook_mode=webhook` em produção (ou `webhook-test` + **Execute workflow** no editor).
