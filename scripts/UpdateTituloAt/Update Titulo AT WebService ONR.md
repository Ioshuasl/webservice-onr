# Update Titulo AT — WebService ONR (n8n)

Workflow n8n proxy para `UpdateTituloAT` (módulo 3.2 Acompanhamento de Títulos).

- **Workflow:** [`workflows/n8n/gentle-juniper-bb6f8f0940a3/Update Titulo AT.workflow.ts`](../../workflows/n8n/gentle-juniper-bb6f8f0940a3/Update%20Titulo%20AT.workflow.ts)
- **Método:** [`webservice-onr/metodos/UpdateTituloAT.md`](../../webservice-onr/metodos/UpdateTituloAT.md)
- **Scripts CLI:** [`updateTituloAt.js`](updateTituloAt.js) · [`updateTituloAt.py`](updateTituloAt.py)
- **Postman:** [`postman/onr-webservice-n8n.postman_collection.json`](../../postman/onr-webservice-n8n.postman_collection.json) (request **Update Titulo AT — Atualizar**)

## Pré-requisito

Obter `hash` via workflow **Auth ONR** ou `npm run login`. Ver [`webservice-onr/hash.md`](../../webservice-onr/hash.md).

O envelope SOAP envia todos os elementos do `UpdateTituloAT_WSReq`, inclusive opcionais vazios, na ordem do WSDL.

## Request (JSON snake_case)

| Campo | Tipo | Obrigatório | SOAP |
|-------|------|-------------|------|
| `hash` | string | sim | `Hash` |
| `id_titulo` | number | sim | `IDTitulo` |
| `protocolo` | string | sim | `Protocolo` (só dígitos, máx. 11) |
| `apresentante_nome` | string | sim | `ApresentanteNome` |
| `apresentante_email` | string | se `modo_notificacao_status=E` | `ApresentanteEmail` |
| `apresentante_ddd_telefone` | string | se `modo_notificacao_status=S` | `ApresentanteDDDTelefone` |
| `apresentante_numero_telefone` | string | se `modo_notificacao_status=S` | `ApresentanteNumeroTelefone` |
| `apresentante_cpf_cnpj` | string | não | `ApresentanteCPFCNPJ` |
| `valor_deposito` | number | sim | `ValorDeposito` |
| `valor_emolumentos` | number | sim | `ValorEmolumentos` |
| `data_protocolo` | string | sim | `DataProtocolo` |
| `data_previsao_entrega` | string | sim | `DataPrevisaoEntrega` |
| `modo_notificacao_status` | string | sim | `ModoNotificacaoStatus` (`E` ou `S`) |
| `interessado_nome` | string | sim | `InteressadoNome` |
| `interessado_cpf_cnpj` | string | não | `InteressadoCPFCNPJ` |
| `natureza_titulo` | string | sim | `NaturezaTitulo` |
| `codigo_verificador` | string | não | `CodigoVerificador` |
| `tipo_solicitacao` | number | sim | `TipoSolicitacao` (`1` ou `2`) |
| `url_servico_onr` | string | sim | endpoint SOAP |

### Exemplo

```json
{
  "hash": "A1B2C3D4E5F6789012345678901234567890ABCDEF",
  "id_titulo": 18151909,
  "protocolo": "887766",
  "apresentante_nome": "Banco Homologacao Atualizado S.A.",
  "apresentante_email": "homologacao.atualizado@example.com",
  "apresentante_ddd_telefone": "",
  "apresentante_numero_telefone": "",
  "apresentante_cpf_cnpj": "11222333000181",
  "valor_deposito": 1750.25,
  "valor_emolumentos": 260.4,
  "data_protocolo": "2026-05-25T10:00:00",
  "data_previsao_entrega": "2026-06-24T17:00:00",
  "modo_notificacao_status": "E",
  "interessado_nome": "Maria de Teste Atualizada",
  "interessado_cpf_cnpj": "12345678909",
  "natureza_titulo": "Escritura publica de compra e venda - homologacao atualizada",
  "codigo_verificador": "UPDHMLG20260525",
  "tipo_solicitacao": 1,
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
    "id_titulo": 18151909
  }
}
```

### HTTP status

| Situação | Código |
|----------|--------|
| Sucesso | 200 |
| Validação local / request inválido (10–23, 27, 28) | 400 |
| Hash inválido/usado/expirado (45–47) | 401 |
| Sem permissão (32, 50) | 403 |
| Erro negócio ONR | 422 |
| Falha persistência (101) | 503 |
| Falha ONR / conexão | 502 |

## Webhook

- Path: `a4b5c6d7-e8f9-4a0b-1c2d-3e4f5a6b7c8d`
- URL teste: `https://<n8n>/webhook-test/a4b5c6d7-e8f9-4a0b-1c2d-3e4f5a6b7c8d`
- Basic Auth (mesmas credenciais do Auth ONR)

## Publicar

```bash
npx --yes n8nac skills validate "workflows/n8n/gentle-juniper-bb6f8f0940a3/Update Titulo AT.workflow.ts"
npx --yes n8nac push "workflows/n8n/gentle-juniper-bb6f8f0940a3/Update Titulo AT.workflow.ts" --verify
```

Ative o workflow no n8n e use `n8n_webhook_mode=webhook` em produção (ou `webhook-test` + **Execute workflow** no editor).
