# SetPedidoRespondidoOE

Método do WSOficio — **3.5 Ofícios**.

## Resumo

| Campo | Valor |
|-------|-------|
| Tipo | Escrita / resposta |
| Módulo | 3.5 Ofícios Eletrônicos |
| Operação SOAP | `SetPedidoRespondidoOE` |

## Serviço

- **WSDL (homologação):** `https://hml3-wsoficio.onr.org.br/oficios.asmx?wsdl`
- **Endpoint:** `https://hml3-wsoficio.onr.org.br/oficios.asmx`
- **WSDL local:** `wsdl/oficios.wsdl`

## Hash de autenticação

Implementação: [`lib/onr_oficios.py`](../../lib/onr_oficios.py) · `resolve_auth_hash()`.

## Pré-requisitos e validações de negócio

- **Pré-validação local (scripts):** antes de `SetPedidoRespondidoOE`, o script chama `GetPedidoOE` e bloqueia se `IDStatus=2` (Respondido — evita erro **53** *"Pedido já respondido."*), `IDStatus=3` (Devolvido) ou se `DataResposta` / `Resposta` já estiverem preenchidos (risco de erro **502**). Usa dois tokens do login (`ONR_HASH_TOKEN_INDEX` e `+1`). Desligar: `OFICIOS_SET_PEDIDO_RESPONDIDO_SKIP_VALIDAR_STATUS=true`.
- Pedido em status elegível (não respondido — erro **53**).
- `Resposta` obrigatória (erro **13**).
- Pelo menos um anexo com `Nome` e `URLArquivo` (erro **14**).
- Anexos: URL pública; spec exige extensão **.p7s** (erro **104**).
- `Negativa`: `true`/`1` para resposta negativa; padrão `false`.
- Status do pedido só muda após a ONR baixar todos os anexos (erro **502** se já houver resposta pendente).

Variante com Assinador Web: `SetPedidoRespondidoOE_DocID` (não implementada neste projeto).

## Ordem do envelope (`oRequest`)

Tipo `SetPedidoRespondidoOE_WSReq` (`wsdl/oficios.wsdl`):

1. `Hash`
2. `IDPedido`
3. `Resposta`
4. `Negativa`
5. `Anexos` → `SetPedidoRespondidoOE_Anexo_WSReq[]`
   - `Nome`
   - `URLArquivo`

## Parâmetros de entrada

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `Hash` | Hash de autenticação | string | sim | — | _(SHA-1)_ |
| `IDPedido` | Código do pedido | int | sim | — | — |
| `Resposta` | Texto da resposta | string | sim | — | — |
| `Negativa` | Resposta negativa | boolean | sim | — | false |
| `Anexos[].Nome` | Nome do arquivo | string | sim | por item | certidao.p7s |
| `Anexos[].URLArquivo` | URL pública do anexo | string | sim | por item | https://... |

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
| 45–47 | Erros de hash |
| 51–56 | Pedido / permissão / resposta |
| 60, 101–105 | Arquivos / URL / extensão |
| 501–502 | Campos ou resposta já existente |

## Implementação neste projeto

- Python: [`scripts/SetPedidoRespondidoOe/setPedidoRespondidoOe.py`](../../scripts/SetPedidoRespondidoOe/setPedidoRespondidoOe.py)
- JavaScript: [`scripts/SetPedidoRespondidoOe/setPedidoRespondidoOe.js`](../../scripts/SetPedidoRespondidoOe/setPedidoRespondidoOe.js)
- Lib: [`lib/onr_oficios.py`](../../lib/onr_oficios.py) · [`lib/onr_oficios.js`](../../lib/onr_oficios.js)
- Pré-validação: [`lib/onr_oficios_respondido.py`](../../lib/onr_oficios_respondido.py) · [`lib/onr_oficios_respondido.js`](../../lib/onr_oficios_respondido.js)
- Variáveis `.env`: `OFICIOS_SET_PEDIDO_RESPONDIDO_*` (ou `OFICIOS_ID_PEDIDO`)
- npm: `npm run set-pedido-respondido-oe`

## Referências

- [`webservice/hash.md`](../hash.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — § 3.5.9–3.5.10
