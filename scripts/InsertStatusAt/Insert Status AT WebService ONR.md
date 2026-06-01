# Insert Status AT — WebService ONR (n8n)

Workflow n8n proxy para `InsertStatusAT` (módulo 3.2 Acompanhamento de Títulos).

- **Workflow:** [`workflows/n8n/extensao-n8n-teste/Insert Status AT.workflow.ts`](../../workflows/n8n/extensao-n8n-teste/Insert%20Status%20AT.workflow.ts)
- **Workflow ID:** `vVAREdSNXOu9HTT6`
- **Método:** [`webservice-onr/metodos/InsertStatusAT.md`](../../webservice-onr/metodos/InsertStatusAT.md)
- **Scripts CLI:** [`insertStatusAt.js`](insertStatusAt.js) · [`insertStatusAt.py`](insertStatusAt.py)

## Pré-requisito

Obter `hash` via workflow **Auth ONR** ou `npm run login`. Ver [`webservice-onr/hash.md`](../../webservice-onr/hash.md).

O envelope SOAP envia os elementos do `InsertStatusAT_WSReq` na ordem do WSDL:

1. `Hash`
2. `IDTitulo`
3. `IDTipoStatus`
4. `DataStatus`
5. `DescricaoStatus`

## Request (JSON snake_case)

| Campo | Tipo | Obrigatório | SOAP |
|-------|------|-------------|------|
| `hash` | string | sim | `Hash` |
| `id_titulo` | number | sim | `IDTitulo` |
| `id_tipo_status` | number | sim | `IDTipoStatus` (`1` a `13`) |
| `data_status` | string | sim | `DataStatus` (`aaaa-mm-dd hh:mm:ss`) |
| `descricao_status` | string | sim | `DescricaoStatus` |
| `url_servico_onr` | string | não | endpoint SOAP; padrão homologação |

### Exemplo

```json
{
  "hash": "A1B2C3D4E5F6789012345678901234567890ABCDEF",
  "id_titulo": 18151909,
  "id_tipo_status": 7,
  "data_status": "2026-05-25 10:00:00",
  "descricao_status": "Nota de exigência cadastrada via homologação",
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
    "id_tipo_status": 7,
    "id_status": 5001,
    "status_cadastrado": true
  }
}
```

### HTTP status

| Situação | Código |
|----------|--------|
| Sucesso | 200 |
| Validação local / request inválido (10–17) | 400 |
| Hash inválido/usado/expirado (45–47) | 401 |
| Sem permissão (31, 32, 50) | 403 |
| Título não encontrado / dados indisponíveis (30) | 404 |
| Status já cadastrado (501) | 409 |
| Erro negócio ONR | 422 |
| Falha persistência (101) | 503 |
| Falha ONR / conexão | 502 |

## Webhook

- Path: `c6d7e8f9-a0b1-4c2d-3e4f-5a6b7c8d9e0f`
- URL teste: `https://api-n8n.gbrqne.easypanel.host/webhook-test/c6d7e8f9-a0b1-4c2d-3e4f-5a6b7c8d9e0f`
- URL produção: `https://api-n8n.gbrqne.easypanel.host/webhook/c6d7e8f9-a0b1-4c2d-3e4f-5a6b7c8d9e0f`
- Basic Auth: mesmas credenciais do Auth ONR

## Publicar

```bash
npx --yes n8nac skills validate "workflows/n8n/extensao-n8n-teste/Insert Status AT.workflow.ts"
npx --yes n8nac push "workflows/n8n/extensao-n8n-teste/Insert Status AT.workflow.ts" --verify
```

Ative o workflow no n8n para usar a URL de produção. Para `webhook-test`, execute o workflow no editor antes da chamada.
