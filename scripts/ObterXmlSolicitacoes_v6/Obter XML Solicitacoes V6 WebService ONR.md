# Obter XML Solicitacoes V6 WebService ONR

Workflow **n8n** proxy para `ObterXMLSolicitacoes_v6` (módulo 3.6 Certidões a Emitir).

- **Workflow:** `workflows/n8n/extensao-n8n-teste/Obter XML Solicitacoes V6.workflow.ts`
- **Workflow ID:** `8Ym0nQ3oRwSxZuAb`
- **Método:** [`webservice-onr/metodos/ObterXMLSolicitacoes_v6.md`](../../webservice-onr/metodos/ObterXMLSolicitacoes_v6.md)
- **Endpoint ONR padrão:** `https://hml3-wsoficio.onr.org.br/Certidoes.asmx`
- **Webhook:** `POST /webhook/{n8n_webhook_mode}/b2c3d4e5-f6a7-4890-b123-456789abcdef`
- **Autenticação:** Basic Auth do n8n

## Pré-requisitos

- Obter `hash` via **Auth ONR** ou `npm run login`.
- Filtros não usados: enviar string vazia `""` (spec § 3.6.5).
- `tipo_resposta`: `""`, `D` ou `C` — somente com `status=3` (Respondido).

## Request JSON

| Campo JSON | Campo SOAP | Obrigatório | Observação |
|------------|------------|-------------|------------|
| `hash` | `Hash` | sim | 40 hex maiúsculos |
| `protocolo` | `Protocolo` | não | `""` se omitido |
| `solicitante` | `Solicitante` | não | |
| `tipo_certidao` | `TipoCertidao` | não | 1–22 (spec) |
| `pesquisa_por` | `PesquisaPor` | não | 4–15 |
| `status` | `Status` | não | 1,2,3,10,11,12,13,23 |
| `tipo_resposta` | `TipoResposta` | não | só com `status=3` |
| `data_pedido_de` | `DataPedidoDe` | não | `aaaa-mm-dd` |
| `data_pedido_ate` | `DataPedidoAte` | não | |
| `data_conferencia_de` | `DataConferenciaDe` | não | |
| `data_conferencia_ate` | `DataConferenciaAte` | não | |
| `url_servico_onr` | endpoint | não | Padrão `Certidoes.asmx` |

Exemplo (pedidos em aberto em janeiro/2025):

```json
{
  "hash": "0123456789ABCDEF0123456789ABCDEF01234567",
  "protocolo": "",
  "solicitante": "",
  "tipo_certidao": "",
  "pesquisa_por": "",
  "status": "1",
  "tipo_resposta": "",
  "data_pedido_de": "2025-01-01",
  "data_pedido_ate": "2025-01-31",
  "data_conferencia_de": "",
  "data_conferencia_ate": "",
  "url_servico_onr": "https://hml3-wsoficio.onr.org.br/Certidoes.asmx"
}
```

## Ordem SOAP

Tipo `ObterXMLSolicitacoesv2_WSReq`: Hash, Protocolo, Solicitante, TipoCertidao, PesquisaPor, Status, TipoResposta, DataPedidoDe, DataPedidoAte, DataConferenciaDe, DataConferenciaAte.

## Response JSON

```json
{
  "status_http": 200,
  "sucesso": true,
  "codigo_erro": 0,
  "mensagem_erro": "",
  "dados": {
    "protocolo": "",
    "status_filtro": "1",
    "xml": "<?xml version=\"1.0\"...<ROOT>...</ROOT> (tags reais, sem &lt;/&gt;)",
    "tamanho_xml": 12345,
    "xml_certidao_json": {
      "pedidos_certidao": [
        {
          "protocolo_solicitacao": "S26050000539D",
          "data_pedido": "27/05/2026 11:09:00",
          "status_solicitacao": "Processando",
          "solicitante": { "nome": "...", "endereco": { "cep": "..." } },
          "certidao": { "tipo": "1", "pessoa": { "nome": "..." } }
        }
      ]
    }
  }
}
```

`xml_certidao_json` — parse do XML de exportação (`ROOT` / `PEDIDO_CERTIDAO`) em objeto JSON com chaves **snake_case**; `null` se `sucesso=false`. Lógica espelhada em [`lib/onr_certidoes_xml_json.js`](../../lib/onr_certidoes_xml_json.js).

## Scripts CLI equivalentes

- `npm run obter-xml-solicitacoes-v6`
- [`obterXmlSolicitacoes_v6.js`](obterXmlSolicitacoes_v6.js) · [`lib/onr_certidoes_obter_xml.js`](../../lib/onr_certidoes_obter_xml.js)

## Postman

Coleção unificada [`postman/onr-webservice-n8n.postman_collection.json`](../../postman/onr-webservice-n8n.postman_collection.json) — pasta **3.6 Certidões a Emitir**.
