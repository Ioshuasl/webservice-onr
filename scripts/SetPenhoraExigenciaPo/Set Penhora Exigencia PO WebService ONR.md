# Set Penhora Exigencia PO WebService ONR

Workflow n8n proxy para `SetPenhoraExigenciaPO` (módulo 3.3 Penhora Online).

- **Workflow:** `workflows/n8n/extensao-n8n-teste/Set Penhora Exigencia PO.workflow.ts`
- **Workflow ID:** `cCKrInQyHC2yYMgX`
- **Método:** [`webservice-onr/metodos/SetPenhoraExigenciaPO.md`](../../webservice-onr/metodos/SetPenhoraExigenciaPO.md)
- **Endpoint ONR padrão:** `https://hml3-wsoficio.onr.org.br/penhoraonline.asmx`
- **Webhook:** `POST /webhook/e2f3a4b5-c6d7-4e8f-9a0b-c1d2e3f4a5b6`
- **Autenticação:** Basic Auth do n8n

## Pré-requisitos

- Obter `hash` via workflow **Auth ONR** ou `npm run login`.
- O pedido precisa ser `IDTipoPedido=3` (Penhora).
- O pedido deve estar prenotado e ainda não respondido.
- Cada anexo deve ter nome e URL pública para download.
- A especificação aceita arquivos `.pdf` ou `.p7s`.

## Request JSON

| Campo JSON | Campo SOAP | Obrigatório | Observação |
|------------|------------|-------------|------------|
| `hash` | `Hash` | sim | SHA-1 calculado com token do `LoginUsuarioCertificado`; 40 caracteres hexadecimais. |
| `id_pedido` | `IDPedido` | sim | Inteiro positivo obtido em `ListPedidosPO` / `GetPedidoPO`. |
| `resposta` | `Resposta` | sim | Texto da nota de exigência. |
| `anexos[].nome` | `Anexos[].Nome` | sim | Nome descritivo do anexo. |
| `anexos[].url_arquivo` | `Anexos[].URLArquivo` | sim | URL pública do arquivo `.pdf` ou `.p7s`. |
| `url_servico_onr` | endpoint HTTP | não | Padrão: homologação `penhoraonline.asmx`. |

Também aceita, em cada item de `anexos`, os nomes SOAP `Nome` / `URLArquivo`.

Exemplo:

```json
{
  "hash": "0123456789ABCDEF0123456789ABCDEF01234567",
  "id_pedido": 18014871,
  "resposta": "Segue nota de exigência para regularização.",
  "anexos": [
    {
      "nome": "Nota de exigência",
      "url_arquivo": "https://exemplo.com/anexos/nota-exigencia.pdf"
    }
  ],
  "url_servico_onr": "https://hml3-wsoficio.onr.org.br/penhoraonline.asmx"
}
```

## Ordem SOAP

O `SetPenhoraExigenciaPO_WSReq` no WSDL local usa esta ordem:

1. `Hash`
2. `IDPedido`
3. `Resposta`
4. `Anexos`

Cada item de `Anexos` usa `SetPenhoraExigenciaPO_Anexo_WSReq` com:

1. `Nome`
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
    "id_pedido": 18014871,
    "quantidade_anexos": 1,
    "exigencia_registrada": true
  }
}
```

## Status HTTP

| Situação | HTTP |
|----------|------|
| Sucesso ONR | `200` |
| Validação local ou request inválido (`10` a `14`, `55`, `56`, `104`, `501`) | `400` |
| Hash inválido, expirado ou já usado (`45`, `46`, `47`) | `401` |
| Sem permissão (`52`) | `403` |
| Pedido/arquivo não encontrado (`51`, `102`) | `404` |
| Resposta já cadastrada (`502`) | `409` |
| Erro de sistema ONR, desbloqueio ou verificação de arquivo (`0`, `60`, `103`) | `502` |
| Falha de cadastro do arquivo (`101`) | `503` |
| Demais erros de negócio (`53`, `54`, `105`) | `422` |

## Publicar

```bash
npx --yes n8nac skills validate "workflows/n8n/extensao-n8n-teste/Set Penhora Exigencia PO.workflow.ts"
npx --yes n8nac push "workflows/n8n/extensao-n8n-teste/Set Penhora Exigencia PO.workflow.ts" --verify
```

Ative o workflow no n8n para usar a URL de produção. Para `webhook-test`, execute o workflow no editor antes da chamada.
