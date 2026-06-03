# Devolver Certidao WebService ONR

Workflow **n8n** proxy para `DevolverCertidao` (módulo 3.6 Certidões a Emitir).

- **Workflow:** `workflows/n8n/extensao-n8n-teste/Devolver Certidao.workflow.ts`
- **Workflow ID:** `7Xk9mP2nQvRwYtZa`
- **Método:** [`webservice-onr/metodos/DevolverCertidao.md`](../../webservice-onr/metodos/DevolverCertidao.md)
- **Endpoint ONR padrão:** `https://hml3-wsoficio.onr.org.br/Certidoes.asmx`
- **Webhook:** `POST /webhook/{n8n_webhook_mode}/a1b2c3d4-e5f6-4789-a012-3456789abcde`
- **Autenticação:** Basic Auth do n8n

## Pré-requisitos

- Obter `hash` via workflow **Auth ONR** ou `npm run login`.
- `protocolo` da solicitação (export `ObterXMLSolicitacoes_v6` ou portal).

## Request JSON

| Campo JSON | Campo SOAP | Obrigatório | Observação |
|------------|------------|-------------|------------|
| `hash` | `Hash` | sim | 40 caracteres hexadecimais maiúsculos |
| `protocolo` | `Protocolo` | sim | Protocolo da solicitação |
| `motivo` | `Motivo` | sim | Razão da devolução |
| `url_servico_onr` | endpoint HTTP | não | Padrão: homologação `Certidoes.asmx` |

Exemplo:

```json
{
  "hash": "0123456789ABCDEF0123456789ABCDEF01234567",
  "protocolo": "123456789012345",
  "motivo": "Documentação incompleta para emissão da certidão.",
  "url_servico_onr": "https://hml3-wsoficio.onr.org.br/Certidoes.asmx"
}
```

## Ordem SOAP

1. `Hash`
2. `Protocolo`
3. `Motivo`

## Response JSON

```json
{
  "status_http": 200,
  "sucesso": true,
  "codigo_erro": 0,
  "mensagem_erro": "",
  "dados": {
    "protocolo": "123456789012345",
    "motivo": "Documentação incompleta para emissão da certidão.",
    "devolvido": true
  }
}
```

## Scripts CLI equivalentes

- `npm run devolver-certidao`
- [`devolverCertidao.js`](devolverCertidao.js) · [`devolverCertidao.py`](devolverCertidao.py)

## Postman

Coleção unificada [`postman/onr-webservice-n8n.postman_collection.json`](../../postman/onr-webservice-n8n.postman_collection.json) — pasta **3.6 Certidões a Emitir**.
