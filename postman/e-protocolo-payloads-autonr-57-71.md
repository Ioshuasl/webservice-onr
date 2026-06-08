# E-Protocolo (§ 3.10) — Payloads JSON para testes HML

> **Coleção:** `3.10 E-Protocolo` em `onr-webservice-n8n.postman_collection.json`  
> **Pré-requisito:** executar **Auth ONR — Login** → variável `onr_hash` (40 caracteres hex maiúsculos).  
> **Endpoint base:** `https://hml3-wsoficio.onr.org.br/eprotocolo.asmx`  
> **Modo teste n8n:** `{{n8n_base_url}}/webhook-test/<webhook_id>`

Substitua os valores de exemplo pelos retornados em HML. O `hash` abaixo é **placeholder** — use sempre o hash fresco do login.

```json
"hash": "A1B2C3D4E5F6789012345678901234567890ABCD"
```

---

## Cobertura do módulo

Os **15 métodos** listados em `webservice-onr/list-metodos.md` (§ 3.10) estão implementados como **AUTONR-57 … AUTONR-71**.  
Falta apenas **testar em HML** e validar regras de negócio (status do contrato, URLs reais, etc.).

| AUTONR | Operação SOAP | Request Postman |
|--------|---------------|-----------------|
| 57 | GetExtratoXMLAC | Get Extrato XML AC |
| 58 | ListPedidosAC | List Pedidos AC |
| 59 | ListAnexosAC | List Anexos AC |
| 60 | ListBoletosAC | List Boletos AC |
| 61 | SetBaixaBoletoAC | Set Baixa Boleto AC |
| 62 | GetPedidoAC_V3 | Get Pedido AC V3 |
| 63 | AlterarPedidoAC | Alterar Pedido AC |
| 64 | SetPrenotacaoAC | Set Prenotacao AC |
| 65 | SetCustasAC | Set Custas AC |
| 66 | SetPrenotacaoExameCalculoAC | Set Prenotacao Exame Calculo AC |
| 67 | SetContratoAverbadoAC | Set Contrato Averbado AC |
| 68 | SetContratoExigenciaAC | Set Contrato Exigencia AC |
| 69 | SetContratoDevolvidoAC | Set Contrato Devolvido AC |
| 70 | ListDocumentosRepositorioAC | List Documentos Repositorio AC *(SOAP: `ListRepositorioDocumentosAC`)* |
| 71 | ContratoXMLtoPDF | Contrato XML to PDF AC |

---

## Ordem sugerida de teste

```text
Auth ONR
  → 57 Get Extrato XML AC (opcional, se tiver protocolo)
  → 58 List Pedidos AC          → id_contrato, protocolo
  → 62 Get Pedido AC V3         → dados apresentante / prenotação
  → 59 List Anexos AC
  → 60 List Boletos AC          → id_boleto, convenio
  → 61 Set Baixa Boleto AC      (se houver boleto)
  → 63 Alterar Pedido AC        (se precisar corrigir apresentante)
  → 64 Set Prenotacao AC
  → 65 Set Custas AC
  → 66 Set Prenotacao Exame Calculo AC  (fluxo Exame/Cálculo)
  → 67 / 68 / 69  (averbação, exigência ou devolução — mutuamente excludentes por status)
  → 70 List Documentos Repositorio AC
  → 71 Contrato XML to PDF AC   (url do XML de 57 ou anexo)
```

---

## AUTONR-57 — GetExtratoXMLAC

> **Não use protocolo inventado** (ex.: `AC000123456`). A spec só valida formato (`string(12)`); o erro **52** significa que **não há Extrato XML** para aquele protocolo no ambiente/cartório. Use o `protocolo` retornado por **AUTONR-58** (`dados.pedidos[].protocolo`).

```json
{
  "hash": "{{onr_hash}}",
  "protocolo": "SUBSTITUIR_PELO_PROTOCOLO_DA_LISTAGEM",
  "url_servico_onr": "https://hml3-wsoficio.onr.org.br/eprotocolo.asmx"
}
```

**Encadeamento:** após AUTONR-58, copiar `pedidos[0].protocolo` → `E_PROTOCOLO_PROTOCOLO`. Sucesso retorna `dados.url_arquivo` → AUTONR-71.

---

## AUTONR-58 — ListPedidosAC

```json
{
  "hash": "A1B2C3D4E5F6789012345678901234567890ABCD",
  "max_registros_por_pagina": 50,
  "numero_pagina": 1,
  "protocolo": "",
  "instituicao": "",
  "id_tipo_servico": -1,
  "id_status": -1,
  "data_solicitacao_inicial": "2025-01-01",
  "data_solicitacao_final": "2025-01-31",
  "numero_banco": -1,
  "url_servico_onr": "https://hml3-wsoficio.onr.org.br/eprotocolo.asmx"
}
```

**Encadeamento:** `dados.pedidos[0].id_contrato` → `E_PROTOCOLO_ID_CONTRATO`; `protocolo` → `E_PROTOCOLO_PROTOCOLO`.

---

## AUTONR-59 — ListAnexosAC

```json
{
  "hash": "A1B2C3D4E5F6789012345678901234567890ABCD",
  "id_contrato": 12345,
  "url_servico_onr": "https://hml3-wsoficio.onr.org.br/eprotocolo.asmx"
}
```

---

## AUTONR-60 — ListBoletosAC

```json
{
  "hash": "A1B2C3D4E5F6789012345678901234567890ABCD",
  "id_contrato": 12345,
  "url_servico_onr": "https://hml3-wsoficio.onr.org.br/eprotocolo.asmx"
}
```

**Encadeamento:** `dados.boletos[0].id_boleto` → `E_PROTOCOLO_ID_BOLETO`; `convenio` → `E_PROTOCOLO_CONVENIO`.

---

## AUTONR-61 — SetBaixaBoletoAC

```json
{
  "hash": "A1B2C3D4E5F6789012345678901234567890ABCD",
  "id_boleto": 98765,
  "convenio": false,
  "url_servico_onr": "https://hml3-wsoficio.onr.org.br/eprotocolo.asmx"
}
```

---

## AUTONR-62 — GetPedidoAC_V3

```json
{
  "hash": "A1B2C3D4E5F6789012345678901234567890ABCD",
  "id_contrato": 12345,
  "url_servico_onr": "https://hml3-wsoficio.onr.org.br/eprotocolo.asmx"
}
```

**Encadeamento:** preenche `E_PROTOCOLO_*` (apresentante, endereço, prenotação) para AUTONR-63/64/66.

---

## AUTONR-63 — AlterarPedidoAC

```json
{
  "hash": "A1B2C3D4E5F6789012345678901234567890ABCD",
  "id_contrato": 12345,
  "tipo_documento": 1,
  "apresentante_nome": "João da Silva",
  "apresentante_email": "joao.silva@exemplo.com",
  "endereco_via": "Rua",
  "endereco_logradouro": "das Flores",
  "endereco_numero": 100,
  "endereco_complemento": "Sala 1",
  "endereco_bairro": "Centro",
  "endereco_uf": "SP",
  "endereco_cidade": "São Paulo",
  "endereco_cep": 01001000,
  "contato_ddd": "11",
  "contato_telefone": "987654321",
  "url_servico_onr": "https://hml3-wsoficio.onr.org.br/eprotocolo.asmx"
}
```

---

## AUTONR-64 — SetPrenotacaoAC

```json
{
  "hash": "A1B2C3D4E5F6789012345678901234567890ABCD",
  "id_contrato": 12345,
  "numero_prenotacao": "1234567",
  "data_prenotacao": "2025-01-15",
  "data_vencimento": "2025-02-15",
  "senha": "SENHA_PRENOTACAO",
  "url_servico_onr": "https://hml3-wsoficio.onr.org.br/eprotocolo.asmx"
}
```

---

## AUTONR-65 — SetCustasAC

```json
{
  "hash": "A1B2C3D4E5F6789012345678901234567890ABCD",
  "id_contrato": 12345,
  "valor_custas": 150.75,
  "url_servico_onr": "https://hml3-wsoficio.onr.org.br/eprotocolo.asmx"
}
```

---

## AUTONR-66 — SetPrenotacaoExameCalculoAC

```json
{
  "hash": "A1B2C3D4E5F6789012345678901234567890ABCD",
  "id_contrato": 12345,
  "numero_prenotacao": "1234567",
  "data_prenotacao": "2025-01-15",
  "senha": "SENHA_PRENOTACAO",
  "url_servico_onr": "https://hml3-wsoficio.onr.org.br/eprotocolo.asmx"
}
```

> Sem `data_vencimento` (conforme WSDL desta operação).

---

## AUTONR-67 — SetContratoAverbadoAC

```json
{
  "hash": "A1B2C3D4E5F6789012345678901234567890ABCD",
  "id_contrato": 12345,
  "resposta": "Contrato averbado conforme documentação apresentada.",
  "certidoes_averbacao": [
    {
      "descricao": "XMLRETORNO",
      "url_arquivo": "https://exemplo.com/arquivos/certidao-averbacao.pdf"
    }
  ],
  "url_servico_onr": "https://hml3-wsoficio.onr.org.br/eprotocolo.asmx"
}
```

---

## AUTONR-68 — SetContratoExigenciaAC

```json
{
  "hash": "A1B2C3D4E5F6789012345678901234567890ABCD",
  "id_contrato": 12345,
  "exigencia_final": false,
  "resposta": "Documentação complementar solicitada.",
  "anexos": [
    {
      "nome": "PARECER_EXIGENCIA",
      "url_arquivo": "https://exemplo.com/arquivos/parecer.pdf"
    }
  ],
  "url_servico_onr": "https://hml3-wsoficio.onr.org.br/eprotocolo.asmx"
}
```

---

## AUTONR-69 — SetContratoDevolvidoAC

```json
{
  "hash": "A1B2C3D4E5F6789012345678901234567890ABCD",
  "id_contrato": 12345,
  "resposta": "Contrato devolvido por documentação incompleta.",
  "url_servico_onr": "https://hml3-wsoficio.onr.org.br/eprotocolo.asmx"
}
```

---

## AUTONR-70 — ListDocumentosRepositorioAC

```json
{
  "hash": "A1B2C3D4E5F6789012345678901234567890ABCD",
  "id_contrato": 12345,
  "id_departamento": 0,
  "cpf_vinculado": "",
  "data_vencimento_inicial": "2025-01-01",
  "data_vencimento_final": "2025-01-07",
  "url_servico_onr": "https://hml3-wsoficio.onr.org.br/eprotocolo.asmx"
}
```

> Filtros de data opcionais; se ambos informados, intervalo máximo **7 dias**.  
> `id_departamento: 0` = sem filtro de departamento.

Versão mínima (sem filtros opcionais):

```json
{
  "hash": "A1B2C3D4E5F6789012345678901234567890ABCD",
  "id_contrato": 12345,
  "id_departamento": 0,
  "cpf_vinculado": "",
  "data_vencimento_inicial": "",
  "data_vencimento_final": "",
  "url_servico_onr": "https://hml3-wsoficio.onr.org.br/eprotocolo.asmx"
}
```

---

## AUTONR-71 — ContratoXMLtoPDF

```json
{
  "hash": "A1B2C3D4E5F6789012345678901234567890ABCD",
  "url_arquivo": "https://exemplo.com/contratos/pedido-123.xml",
  "url_servico_onr": "https://hml3-wsoficio.onr.org.br/eprotocolo.asmx"
}
```

**Encadeamento:** `url_arquivo` de AUTONR-57 (`dados.url_arquivo`) ou URL de anexo listado em AUTONR-59.

---

## Variáveis Postman (referência rápida)

| Variável | Origem típica |
|----------|----------------|
| `onr_hash` | Auth ONR — Login |
| `E_PROTOCOLO_ID_CONTRATO` | AUTONR-58 |
| `E_PROTOCOLO_PROTOCOLO` | AUTONR-58 / 57 |
| `E_PROTOCOLO_ID_BOLETO` | AUTONR-60 |
| `E_PROTOCOLO_CONVENIO` | AUTONR-60 |
| `E_PROTOCOLO_*` apresentante/endereço | AUTONR-62 |
| `E_PROTOCOLO_URL_ARQUIVO` | AUTONR-57 ou anexo |

---

## Fora do escopo AUTONR-57…71

O WSDL `eprotocolo.asmx` contém operações adicionais (ex.: `GetPedidoAC_V4`…`V6`, `SetFinalizarProtocoloAC`, `SetContratoCumprimentoExigenciaRI`) que **não** constam na lista oficial de 15 métodos do § 3.10 em `list-metodos.md`.
