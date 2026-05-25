# SetPedidoFinalizarPrenotacaoVencida

Método do WSOficio — **3.3 Penhora Online**.

## Resumo

| Campo | Valor |
|-------|-------|
| Tipo | Atualização / comando |
| Módulo | 3.3 Penhora Online |
| Operação SOAP | `SetPedidoFinalizarPrenotacaoVencida` |

Finaliza pedido de **certidão por matrícula** com prenotação vencida ([IDStatus = 11](../tabelas-dominio/IDStatus-PO.md) — Aguardando Pagto – Vencido), enviando resposta e anexos (download assíncrono pelo ONR).

## Serviço

- **WSDL (homologação):** `https://hml3-wsoficio.onr.org.br/penhoraonline.asmx?wsdl`
- **Endpoint:** `https://hml3-wsoficio.onr.org.br/penhoraonline.asmx`
- **WSDL local:** `wsdl/penhoraonline.wsdl`

## Hash de autenticação

Parâmetro obrigatório **`Hash`** no envelope de entrada (`string(50)`).

Cálculo (detalhes em [`../hash.md`](../hash.md)):

```text
Hash = SHA1( ONR_SERVENTIA_CHAVE + token ).encode('utf-8').hexdigest().upper()
```

Implementação: [`lib/onr_penhora_online.py`](../../lib/onr_penhora_online.py) · `resolve_auth_hash()`.

## Pré-requisitos e validações de negócio

- **[IDTipoPedido = 1](../tabelas-dominio/IDTipoPedido-PO.md)** (Certidão por Matrícula) — erro **53**.
- Pedido em situação de prenotação vencida (em geral **IDStatus = 11**).
- `Resposta` e ao menos um anexo com `Nome` + `URLArquivo` (URL pública; spec `.p7s`).

> No WSDL local, cada anexo usa **`Nome`** e **`URLArquivo`** (`SetPedidoFinalizarPrenotacaoVencida_Anexo_WSReq`). A especificação PDF cita `Matricula`; os scripts aceitam `Matricula` no JSON e mapeiam para `Nome`.

## Ordem do envelope (`oRequest`)

Tipo `SetPedidoFinalizarPrenotacaoVencida_WSReq` (`wsdl/penhoraonline.wsdl`):

1. `Hash`
2. `IDPedido`
3. `Resposta`
4. `Anexos`

## Parâmetros de entrada

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `Hash` | Hash de autenticação | string | sim | — | _(SHA-1)_ |
| `IDPedido` | Pedido matrícula | int | sim | IDTipoPedido=1 | — |
| `Resposta` | Texto da resposta | string | sim | — | — |
| `Anexos[].Nome` | Nome/descrição do anexo (WSDL) | string | sim | por item | Certidão mat. 12345 |
| `Anexos[].URLArquivo` | URL do arquivo | string | sim | por item | https://…/doc.p7s |

## Parâmetros de saída

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `RETORNO` | Sucesso | boolean | sim | — | true |
| `CODIGOERRO` | Código do erro | int | sim | — | 0 |
| `ERRODESCRICAO` | Descrição do erro | string | não | se RETORNO=false | — |

## Códigos de erro (amostra)

| Código | Descrição |
|--------|-----------|
| 12 | IDPedido inválido |
| 13 | Resposta não informada |
| 14 | Nenhum anexo informado |
| 51–55 | Pedido tipo / permissão / anexos |
| 502 | Resposta já cadastrada; aguardando download |
| 45–47 | Erros de hash |

## Implementação neste projeto

- Python: [`scripts/SetPedidoFinalizarPrenotacaoVencida/setPedidoFinalizarPrenotacaoVencida.py`](../../scripts/SetPedidoFinalizarPrenotacaoVencida/setPedidoFinalizarPrenotacaoVencida.py)
- JavaScript: [`scripts/SetPedidoFinalizarPrenotacaoVencida/setPedidoFinalizarPrenotacaoVencida.js`](../../scripts/SetPedidoFinalizarPrenotacaoVencida/setPedidoFinalizarPrenotacaoVencida.js)
- Variáveis `.env`: `PENHORA_ONLINE_SET_FINALIZAR_PRENOTACAO_VENCIDA_*`
- npm: `npm run set-pedido-finalizar-prenotacao-vencida`

## Referências

- [`webservice/hash.md`](../hash.md)
- [`webservice/list-metodos.md`](../list-metodos.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — § 3.3.38–3.3.39
