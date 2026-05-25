# Set Penhora Averbado PO WebService ONR

Workflow n8n proxy para `SetPenhoraAverbadoPO` (módulo 3.3 Penhora Online).

- **Workflow:** `workflows/n8n/extensao-n8n-teste/Set Penhora Averbado PO.workflow.ts`
- **Workflow ID:** `JOrrjEb379A0TaEz`
- **Método:** [`webservice-onr/metodos/SetPenhoraAverbadoPO.md`](../../webservice-onr/metodos/SetPenhoraAverbadoPO.md)
- **Endpoint ONR padrão:** `https://hml3-wsoficio.onr.org.br/penhoraonline.asmx`
- **Webhook:** `POST /webhook/f1a2b3c4-d5e6-4f7a-8b9c-d0e1f2a3b4c5`
- **Autenticação:** Basic Auth do n8n

## Pré-requisitos

- Obter `hash` via workflow **Auth ONR** ou `npm run login`.
- O pedido precisa ser `IDTipoPedido=3` (Penhora).
- A penhora deve estar prenotada e com pagamento confirmado conforme regras da ONR.
- Cada matrícula deve ter no máximo uma certidão.
- `url_arquivo` deve ser uma URL pública para download. A especificação exige `.p7s` (homologação pode aceitar `.pdf`).

## Request JSON

| Campo JSON | Campo SOAP | Obrigatório | Observação |
|------------|------------|-------------|------------|
| `hash` | `Hash` | sim | SHA-1 calculado com token do `LoginUsuarioCertificado`; 40 caracteres hexadecimais. |
| `id_pedido` | `IDPedido` | sim | Inteiro positivo obtido em `ListPedidosPO` / `GetPedidoPO`. |
| `resposta` | `Resposta` | sim | Texto da resposta da penhora averbada. |
| `certidoes[].matricula` | `CertidaoPenhora[].Matricula` | sim | Número da matrícula. |
| `certidoes[].url_arquivo` | `CertidaoPenhora[].URLArquivo` | sim | URL pública do arquivo. |
| `url_servico_onr` | endpoint HTTP | não | Padrão: homologação `penhoraonline.asmx`. |

Também aceita `certidao_penhora` como alias de `certidoes` e, em cada item, os nomes SOAP `Matricula` / `URLArquivo`.

Exemplo:

```json
{
  "hash": "0123456789ABCDEF0123456789ABCDEF01234567",
  "id_pedido": 18014820,
  "resposta": "Penhora averbada conforme mandado.",
  "certidoes": [
    {
      "matricula": "12345",
      "url_arquivo": "https://exemplo.com/certidoes/12345.p7s"
    }
  ],
  "url_servico_onr": "https://hml3-wsoficio.onr.org.br/penhoraonline.asmx"
}
```

## Ordem SOAP

O `SetPenhoraAverbadoPO_WSReq` no WSDL local usa esta ordem:

1. `Hash`
2. `IDPedido`
3. `Resposta`
4. `CertidaoPenhora`

Cada item de `CertidaoPenhora` usa `SetPenhoraAverbadoPO_Certidao_WSReq` com:

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
    "quantidade_certidoes": 1,
    "penhora_averbada": true
  }
}
```

## Status HTTP

| Situação | HTTP |
|----------|------|
| Sucesso ONR | `200` |
| Validação local ou request inválido (`10` a `14`, `58`, `59`, `104`, `501`) | `400` |
| Hash inválido, expirado ou já usado (`45`, `46`, `47`) | `401` |
| Sem permissão (`52`) | `403` |
| Pedido/matrícula/arquivo não encontrado (`51`, `57`, `102`) | `404` |
| Pedido já respondido ou resposta já cadastrada (`55`, `502`) | `409` |
| Erro de sistema ONR, desbloqueio ou verificação de arquivo (`0`, `60`, `103`) | `502` |
| Falha de cadastro do arquivo (`101`) | `503` |
| Demais erros de negócio (`53`, `54`, `56`, `105`) | `422` |

## Publicar

```bash
npx --yes n8nac skills validate "workflows/n8n/extensao-n8n-teste/Set Penhora Averbado PO.workflow.ts"
npx --yes n8nac push "workflows/n8n/extensao-n8n-teste/Set Penhora Averbado PO.workflow.ts" --verify
```

Ative o workflow no n8n para usar a URL de produção. Para `webhook-test`, execute o workflow no editor antes da chamada.
