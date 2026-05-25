# Update Status AT WebService ONR

Workflow n8n proxy para `UpdateStatusAT` (módulo 3.2 Acompanhamento de Títulos).

- **Workflow:** `workflows/n8n/extensao-n8n-teste/Update Status AT.workflow.ts`
- **Método:** [`webservice-onr/metodos/UpdateStatusAT.md`](../../webservice-onr/metodos/UpdateStatusAT.md)
- **Endpoint ONR padrão:** `https://hml3-wsoficio.onr.org.br/acompanhamentotitulos.asmx`
- **Webhook:** `POST /webhook/d8e9f0a1-b2c3-4d5e-8f90-a1b2c3d4e5f6`
- **Autenticação:** Basic Auth do n8n

## Request JSON

| Campo JSON | Campo SOAP | Obrigatório | Observação |
|------------|------------|-------------|------------|
| `hash` | `Hash` | sim | SHA-1 calculado com token do `LoginUsuarioCertificado`; 40 caracteres hexadecimais. |
| `id_status` | `IDStatus` | sim | Status existente a alterar. |
| `id_tipo_status` | `IDTipoStatus` | sim | Valores `1` a `13`; ver domínio `IDTipoStatus-AT`. |
| `data_status` | `DataStatus` | sim | Formato `aaaa-mm-dd hh:mm:ss`; não pode ser anterior a `2011-01-01`. |
| `descricao_status` | `DescricaoStatus` | sim | Descrição do status. |
| `url_servico_onr` | endpoint HTTP | não | Padrão: homologação `acompanhamentotitulos.asmx`. |

Exemplo:

```json
{
  "hash": "0123456789ABCDEF0123456789ABCDEF01234567",
  "id_status": 5001,
  "id_tipo_status": 7,
  "data_status": "2026-05-25 15:00:00",
  "descricao_status": "Nota de exigência atualizada",
  "url_servico_onr": "https://hml3-wsoficio.onr.org.br/acompanhamentotitulos.asmx"
}
```

## Ordem SOAP

O `UpdateStatusAT_WSReq` no WSDL local usa esta ordem:

1. `Hash`
2. `IDStatus`
3. `IDTipoStatus`
4. `DataStatus`
5. `DescricaoStatus`

## Response JSON

Envelope padrão:

```json
{
  "status_http": 200,
  "sucesso": true,
  "codigo_erro": 0,
  "mensagem_erro": "",
  "dados": {
    "id_status": 5001,
    "id_tipo_status": 7,
    "data_status": "2026-05-25 15:00:00",
    "descricao_status": "Nota de exigência atualizada",
    "atualizado": true
  }
}
```

## Status HTTP

| Situação | HTTP |
|----------|------|
| Sucesso ONR | `200` |
| Validação local ou campos inválidos ONR (`10` a `17`) | `400` |
| Hash inválido, expirado ou já usado (`45`, `46`, `47`) | `401` |
| Status não localizado (`30`) | `404` |
| Sem permissão (`32`, `50`, `52`, `53`) | `403` |
| Erro de sistema ONR (`0`) ou XML inválido | `502` |
| Falha temporária (`1`) | `503` |
| Demais erros de negócio | `422` |
