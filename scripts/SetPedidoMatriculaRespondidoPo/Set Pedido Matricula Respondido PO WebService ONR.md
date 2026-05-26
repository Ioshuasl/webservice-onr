# Set Pedido Matricula Respondido PO WebService ONR

Workflow n8n proxy para `SetPedidoMatriculaRespondidoPO` (módulo 3.3 Penhora Online).

- **Workflow:** `workflows/n8n/extensao-n8n-teste/Set Pedido Matricula Respondido PO.workflow.ts`
- **Workflow ID:** `HYYFoaHz09qOwuyp`
- **Método:** [`webservice-onr/metodos/SetPedidoMatriculaRespondidoPO.md`](../../webservice-onr/metodos/SetPedidoMatriculaRespondidoPO.md)
- **Endpoint ONR padrão:** `https://hml3-wsoficio.onr.org.br/penhoraonline.asmx`
- **Webhook:** `POST /webhook/c3d4e5f6-a7b8-49c0-8d9e-f0a1b2c3d4e5`
- **Autenticação:** Basic Auth do n8n

## Pré-requisitos

- Obter `hash` via workflow **Auth ONR** ou `npm run login`.
- O pedido precisa ser `IDTipoPedido=1` (Pedido Matricula).
- Cada anexo deve informar matricula e URL publica para download.
- A especificacao exige `.p7s`; homologacao pode aceitar `.pdf`.
- O pedido so sera efetivamente respondido apos o ONR baixar todos os arquivos.

## Request JSON

| Campo JSON | Campo SOAP | Obrigatório | Observação |
|------------|------------|-------------|------------|
| `hash` | `Hash` | sim | SHA-1 calculado com token do `LoginUsuarioCertificado`; 40 caracteres hexadecimais. |
| `id_pedido` | `IDPedido` | sim | Inteiro positivo obtido em `ListPedidosPO` / `GetPedidoPO`. |
| `resposta` | `Resposta` | sim | Texto da resposta. |
| `anexos[].matricula` | `Anexos[].Matricula` | sim | Matricula referente ao arquivo. |
| `anexos[].url_arquivo` | `Anexos[].URLArquivo` | sim | URL publica do arquivo. |
| `url_servico_onr` | endpoint HTTP | não | Padrão: homologação `penhoraonline.asmx`. |

Tambem aceita, em cada item de `anexos`, os nomes SOAP `Matricula` / `URLArquivo`.

Exemplo:

```json
{
  "hash": "0123456789ABCDEF0123456789ABCDEF01234567",
  "id_pedido": 18014820,
  "resposta": "Certidao por matricula respondida.",
  "anexos": [
    {
      "matricula": "12345",
      "url_arquivo": "https://exemplo.com/certidoes/12345.p7s"
    }
  ],
  "url_servico_onr": "https://hml3-wsoficio.onr.org.br/penhoraonline.asmx"
}
```

## Ordem SOAP

O `SetPedidoMatriculaRespondidoPO_WSReq` no WSDL local usa esta ordem:

1. `Hash`
2. `IDPedido`
3. `Resposta`
4. `Anexos`

Cada item de `Anexos` usa `SetPedidoMatriculaRespondidoPO_Anexo_WSReq` com:

1. `Matricula`
2. `URLArquivo`

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
    "quantidade_anexos": 1,
    "pedido_matricula_respondido": true
  }
}
```

## Status HTTP

| Situação | HTTP |
|----------|------|
| Sucesso ONR | `200` |
| Validação local ou request inválido (`10` a `14`, `54`, `55`, `104`, `501`) | `400` |
| Hash inválido, expirado ou já usado (`45`, `46`, `47`) | `401` |
| Sem permissão (`52`) | `403` |
| Pedido/arquivo não encontrado (`51`, `102`) | `404` |
| Resposta já cadastrada (`502`) | `409` |
| Erro de sistema ONR, desbloqueio ou verificação de arquivo (`0`, `60`, `103`) | `502` |
| Falha de cadastro do arquivo (`101`) | `503` |
| Demais erros de negócio (`53`, `105`) | `422` |

## Publicar

```bash
npx --yes n8nac skills validate "workflows/n8n/extensao-n8n-teste/Set Pedido Matricula Respondido PO.workflow.ts"
npx --yes n8nac push "workflows/n8n/extensao-n8n-teste/Set Pedido Matricula Respondido PO.workflow.ts" --verify
```

Ative o workflow no n8n para usar a URL de produção. Para `webhook-test`, execute o workflow no editor antes da chamada.
