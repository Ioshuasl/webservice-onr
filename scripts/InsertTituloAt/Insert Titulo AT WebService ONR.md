# Insert Titulo AT — WebService ONR (n8n)

Workflow n8n proxy para `InsertTituloAT` (módulo 3.2 Acompanhamento de Títulos).

- **Workflow:** [`workflows/n8n/gentle-juniper-bb6f8f0940a3/Insert Titulo AT.workflow.ts`](../../workflows/n8n/gentle-juniper-bb6f8f0940a3/Insert%20Titulo%20AT.workflow.ts)
- **Método:** [`webservice/metodos/InsertTituloAT.md`](../../webservice/metodos/InsertTituloAT.md)
- **Scripts CLI:** [`insertTituloAt.js`](insertTituloAt.js) · [`insertTituloAt.py`](insertTituloAt.py)
- **Postman:** [`postman/onr-webservice-n8n.postman_collection.json`](../../postman/onr-webservice-n8n.postman_collection.json) (request **Insert Titulo AT — Cadastrar**)

## Pré-requisito

Obter `hash` via workflow **Auth ONR** ou `npm run login`. Ver [`webservice/hash.md`](../../webservice/hash.md).

O envelope SOAP envia **todos** os elementos do WSDL (opcionais vazios), conforme exigido pelo serviço .NET.

## Request (JSON snake_case)

| Campo | Tipo | Obrigatório | SOAP |
|-------|------|-------------|------|
| `hash` | string | sim | `Hash` |
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
| `codigo_verificador` | string | sim | `CodigoVerificador` (máx. 20) |
| `tipo_solicitacao` | number | sim | `TipoSolicitacao` (`1` ou `2`) |
| `id_tipo_status` | number | sim | `IDTipoStatus` (`1`–`13`, ex.: `4`) |
| `data_status` | string | sim | `DataStatus` |
| `descricao_status` | string | não | `DescricaoStatus` |
| `url_servico_onr` | string | sim | endpoint SOAP |

### Exemplo

```json
{
  "hash": "A1B2C3D4E5F6789012345678901234567890ABCDEF",
  "protocolo": "887766",
  "apresentante_nome": "Banco Exemplo",
  "apresentante_email": "contato@banco.com",
  "apresentante_ddd_telefone": "",
  "apresentante_numero_telefone": "",
  "apresentante_cpf_cnpj": "",
  "valor_deposito": 0,
  "valor_emolumentos": 0,
  "data_protocolo": "2025-01-15T08:30:00",
  "data_previsao_entrega": "2025-02-15T17:00:00",
  "modo_notificacao_status": "E",
  "interessado_nome": "Fulano",
  "interessado_cpf_cnpj": "",
  "natureza_titulo": "Prenotação",
  "codigo_verificador": "ABC123",
  "tipo_solicitacao": 1,
  "id_tipo_status": 4,
  "data_status": "2025-01-15T08:30:00",
  "descricao_status": "",
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
    "id_titulo": 18151720,
    "id_status": 66701083
  }
}
```

Em erro **501** (protocolo já cadastrado), `dados.id_titulo` pode trazer o ID existente.

### HTTP status

| Situação | Código |
|----------|--------|
| Sucesso | 200 |
| Validação local / request inválido (10–23, 36) | 400 |
| Hash inválido/usado/expirado (45–47) | 401 |
| Sem permissão (32, 50) | 403 |
| Protocolo duplicado (501) | 422 |
| Erro negócio ONR | 422 |
| Falha persistência (101) | 503 |
| Falha ONR / conexão | 502 |

## Webhook

- Path: `f3a4b5c6-d7e8-4f9a-0b1c-2d3e4f5a6b7c`
- URL teste: `https://<n8n>/webhook-test/f3a4b5c6-d7e8-4f9a-0b1c-2d3e4f5a6b7c`
- Basic Auth (mesmas credenciais do Auth ONR)

## Publicar

Workflow n8n ID: `KBwdjzpiY8PWNnyp`

```bash
npx --yes n8nac skills validate "workflows/n8n/gentle-juniper-bb6f8f0940a3/Insert Titulo AT.workflow.ts"
npx --yes n8nac push "workflows/n8n/gentle-juniper-bb6f8f0940a3/Insert Titulo AT.workflow.ts" --verify
```

Ative o workflow no n8n e use `n8n_webhook_mode=webhook` em produção (ou `webhook-test` + **Execute workflow** no editor).
