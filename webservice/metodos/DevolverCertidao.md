# DevolverCertidao

Método do WSOficio — **3.6 Certidões a Emitir**.

## Resumo

| Campo | Valor |
|-------|-------|
| Tipo | Escrita / devolução |
| Módulo | 3.6 Certidões a Emitir |
| Operação SOAP | `DevolverCertidao` |

## Serviço

- **WSDL (homologação):** `https://hml3-wsoficio.onr.org.br/Certidoes.asmx?wsdl`
- **Endpoint:** `https://hml3-wsoficio.onr.org.br/Certidoes.asmx`
- **WSDL local:** `wsdl/certidoes.wsdl`

## Hash de autenticação

Implementação: [`lib/onr_certidoes.py`](../../lib/onr_certidoes.py) · `resolve_auth_hash()`.

## Pré-requisitos e validações de negócio

- `Protocolo` da solicitação a devolver (obtido em `ObterXMLSolicitacoes_v6` ou portal *Certidões a Emitir*).
- `Motivo` obrigatório (erro **13**).
- Marca a solicitação com status **Devolvido** no fluxo de certidões (spec § 3.6.7).

## Ordem do envelope (`oRequest`)

Tipo `DevolverCertidao_WSReq` (`wsdl/certidoes.wsdl`):

1. `Hash`
2. `Protocolo`
3. `Motivo`

## Parâmetros de entrada

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `Hash` | Hash de autenticação | string | sim | — | _(SHA-1)_ |
| `Protocolo` | Protocolo da solicitação | string | sim | — | — |
| `Motivo` | Razão da devolução | string | sim | — | Documentação incompleta |

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
| 13 | Motivo não informado |
| 45–47 | Erros de hash |
| 200 | Protocolo não localizado / inelegível |

## Implementação neste projeto

- Python: [`scripts/DevolverCertidao/devolverCertidao.py`](../../scripts/DevolverCertidao/devolverCertidao.py)
- JavaScript: [`scripts/DevolverCertidao/devolverCertidao.js`](../../scripts/DevolverCertidao/devolverCertidao.js)
- Lib: [`lib/onr_certidoes.py`](../../lib/onr_certidoes.py) · [`lib/onr_certidoes.js`](../../lib/onr_certidoes.js)
- Variáveis `.env`: `CERTIDOES_DEVOLVER_CERTIDAO_*` (ou `CERTIDOES_PROTOCOLO`)
- npm: `npm run devolver-certidao`

## Referências

- [`webservice/hash.md`](../hash.md)
- [`ObterXMLSolicitacoes_v6.md`](ObterXMLSolicitacoes_v6.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — § 3.6.7–3.6.8
