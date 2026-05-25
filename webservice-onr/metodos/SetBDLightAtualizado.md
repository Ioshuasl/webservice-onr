# SetBDLightAtualizado

Método do WSOficio — **3.4 BD Light**.

## Resumo

| Campo | Valor |
|-------|-------|
| Tipo | Comando / atualização de status |
| Módulo | 3.4 Envio e Controle de Arquivos — Banco de Dados Light |
| Operação SOAP | `SetBDLightAtualizado` |

## Serviço

- **WSDL (homologação):** `https://hml3-wsoficio.onr.org.br/bdlight.asmx?wsdl`
- **Endpoint:** `https://hml3-wsoficio.onr.org.br/bdlight.asmx`
- **WSDL local:** `wsdl/bdlight.wsdl`

## Hash de autenticação

Parâmetro obrigatório **`Hash`** no envelope de entrada.

Implementação: [`lib/onr_bdlight.py`](../../lib/onr_bdlight.py) · `resolve_auth_hash()`.

## Pré-requisitos e validações de negócio

- Informa ao sistema ONR que a serventia concluiu a atualização do **Banco de Dados Light**.
- Uso típico após importação/processamento via [`ImportarArquivoBDL`](ImportarArquivoBDL.md) e conferência com [`ListArquivosXMLBDL`](ListArquivosXMLBDL.md) / [`GetArquivoXMLBDL`](GetArquivoXMLBDL.md).
- Erro **502** se ainda há arquivos na fila de download da ONR.
- Erro **51** se o estado da serventia não permitir marcar como atualizado.

## Ordem do envelope (`oRequest`)

Tipo `SetBDLightAtualizadoBDL_WSReq` (`wsdl/bdlight.wsdl`):

1. `Hash`

## Parâmetros de entrada

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `Hash` | Hash de autenticação | string | sim | — | _(SHA-1)_ |

## Parâmetros de saída

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `RETORNO` | Sucesso | boolean | sim | — | true |
| `CODIGOERRO` | Código do erro | int | sim | — | 0 |
| `ERRODESCRICAO` | Descrição do erro | string | não | se RETORNO=false | — |

## Códigos de erro (amostra)

| Código | Descrição |
|--------|-----------|
| 11 | Hash não informado |
| 45–47 | Erros de hash |
| 51 | Não foi possível alterar o BD Light para atualizado |
| 502 | Resposta/fila pendente — aguarde processamento dos XMLs |

## Implementação neste projeto

- Python: [`scripts/SetBdlightAtualizado/setBdlightAtualizado.py`](../../scripts/SetBdlightAtualizado/setBdlightAtualizado.py)
- JavaScript: [`scripts/SetBdlightAtualizado/setBdlightAtualizado.js`](../../scripts/SetBdlightAtualizado/setBdlightAtualizado.js)
- Lib: [`lib/onr_bdlight.py`](../../lib/onr_bdlight.py) · [`lib/onr_bdlight.js`](../../lib/onr_bdlight.js)
- Variáveis `.env`: `BDLIGHT_*` (WSDL, endpoint, login — sem parâmetros extras)
- npm: `npm run set-bdlight-atualizado`

## Referências

- [`webservice/hash.md`](../hash.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — § 3.4.7–3.4.8
