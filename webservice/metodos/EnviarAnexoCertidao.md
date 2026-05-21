# EnviarAnexoCertidao

Método do WSOficio — **3.6 Certidões a Emitir**.

## Resumo

| Campo | Valor |
|-------|-------|
| Tipo | Escrita / anexo |
| Módulo | 3.6 Certidões a Emitir |
| Operação SOAP | `EnviarAnexoCertidao` |

## Serviço

- **WSDL (homologação):** `https://hml3-wsoficio.onr.org.br/Certidoes.asmx?wsdl`
- **Endpoint:** `https://hml3-wsoficio.onr.org.br/Certidoes.asmx`
- **WSDL local:** `wsdl/certidoes.wsdl`

## Hash de autenticação

Implementação: [`lib/onr_certidoes.py`](../../lib/onr_certidoes.py) · `resolve_auth_hash()`.

## Pré-requisitos e validações de negócio

- `Protocolo` da solicitação (mesmo fluxo de `ObterXMLSolicitacoes_v6` / `CERTIDOES_PROTOCOLO`).
- `NomeArquivo` obrigatório (erro **14**).
- `ArquivoBase64` com conteúdo do arquivo (erro **15**).
- Extensão **.pdf** ou **.p7s** apenas (erro **25**); validação local no script.
- Variante Assinador Web: `EnviarAnexoCertidao_DocID` / `_V2` (não implementada neste projeto).

## Ordem do envelope (`oRequest`)

Tipo `EnviarAnexoCertidao_WSReq` (`wsdl/certidoes.wsdl`):

1. `Hash`
2. `Protocolo`
3. `NomeArquivo`
4. `ArquivoBase64`

## Parâmetros de entrada

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `Hash` | Hash de autenticação | string | sim | — | _(SHA-1)_ |
| `Protocolo` | Protocolo da solicitação | string | sim | — | — |
| `NomeArquivo` | Nome do arquivo (.pdf / .p7s) | string | sim | — | certidao.pdf |
| `ArquivoBase64` | Conteúdo em Base64 | string | sim | — | _(base64)_ |

## Parâmetros de saída

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `RETORNO` | Sucesso | boolean | sim | — | true |
| `CODIGOERRO` | Código do erro | int | sim | — | 0 |
| `ERRODESCRICAO` | Descrição do erro | string | não | se RETORNO=false | — |

## Códigos de erro (amostra)

| Código | Descrição |
|--------|-----------|
| 14 | NomeArquivo não informado |
| 15 | ArquivoBase64 vazio |
| 25 | Extensão não permitida (só .PDF / .P7S) |
| 45–47 | Erros de hash |
| 200 | Protocolo não localizado |

## Implementação neste projeto

- Python: [`scripts/EnviarAnexoCertidao/enviarAnexoCertidao.py`](../../scripts/EnviarAnexoCertidao/enviarAnexoCertidao.py)
- JavaScript: [`scripts/EnviarAnexoCertidao/enviarAnexoCertidao.js`](../../scripts/EnviarAnexoCertidao/enviarAnexoCertidao.js)
- Lib: [`lib/onr_certidoes.py`](../../lib/onr_certidoes.py) · [`lib/onr_certidoes_anexo.py`](../../lib/onr_certidoes_anexo.py)
- Variáveis `.env`: `CERTIDOES_ENVIAR_ANEXO_*`, `CERTIDOES_PROTOCOLO`
- npm: `npm run enviar-anexo-certidao`

## Referências

- [`webservice/hash.md`](../hash.md)
- [`ObterXMLSolicitacoes_v6.md`](ObterXMLSolicitacoes_v6.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — § 3.6.9–3.6.10
