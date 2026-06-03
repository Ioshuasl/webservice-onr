# ObterXMLSolicitacoes_v6

Método do WSOficio — **3.6 Certidões a Emitir**.

## Resumo

| Campo | Valor |
|-------|-------|
| Tipo | Consulta / exportação XML |
| Módulo | 3.6 Certidões a Emitir |
| Operação SOAP | `ObterXMLSolicitacoes_v6` |
| Serviço | `Certidoes.asmx` (não Matrícula Online) |

## Serviço

- **WSDL (homologação):** `https://hml3-wsoficio.onr.org.br/Certidoes.asmx?wsdl`
- **Endpoint:** `https://hml3-wsoficio.onr.org.br/Certidoes.asmx`
- **WSDL local:** `wsdl/certidoes.wsdl`

## Hash de autenticação

Implementação: [`lib/onr_certidoes.py`](../../lib/onr_certidoes.py) · `resolve_auth_hash()`.

## Pré-requisitos e validações de negócio

- Filtros não usados: enviar **string vazia** `""` (spec § 3.6.5).
- `TipoResposta`: `""`, `D` ou `C` — **somente** com `Status=3` (Respondido); validação local no script (erro **26**).
- `Status`, `TipoCertidao`, `PesquisaPor`: tabelas na spec § 3.6.5.
- Saída `XML`: equivalente ao export do portal *Certidões a Emitir / Exportar*.
- **Não confundir** com `ObterXMLSolicitacoes` / `ObterXMLSolicitacoesV2` (`matriculaonline.asmx`, cap. 3.9).

## Ordem do envelope (`oRequest`)

Tipo `ObterXMLSolicitacoesv2_WSReq` (`wsdl/certidoes.wsdl`) — compartilhado por v4–v6:

1. `Hash`
2. `Protocolo`
3. `Solicitante`
4. `TipoCertidao`
5. `PesquisaPor`
6. `Status`
7. `TipoResposta`
8. `DataPedidoDe`
9. `DataPedidoAte`
10. `DataConferenciaDe`
11. `DataConferenciaAte`

## Parâmetros de entrada

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `Hash` | Hash de autenticação | string | sim | — | _(SHA-1)_ |
| `Protocolo` | Filtro por protocolo | string | não | — | — |
| `Solicitante` | Nome do solicitante | string | não | — | — |
| `TipoCertidao` | Tipo de certidão (1–22, spec) | string | não | — | — |
| `PesquisaPor` | Tipo de pesquisa (4–15, spec) | string | não | — | — |
| `Status` | Status do pedido (1,2,3,10–13,23, spec) | string | não | — | 1 |
| `TipoResposta` | `""`, `D` ou `C` | string | não | se Status=3 | — |
| `DataPedidoDe` | Data inicial pedido (aaaa-mm-dd) | string | não | — | 2025-01-01 |
| `DataPedidoAte` | Data final pedido | string | não | — | 2025-01-31 |
| `DataConferenciaDe` | Data inicial resposta | string | não | — | — |
| `DataConferenciaAte` | Data final resposta | string | não | — | — |

## Parâmetros de saída

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `RETORNO` | Sucesso | boolean | sim | — | true |
| `CODIGOERRO` | Código do erro | int | sim | — | 0 |
| `ERRODESCRICAO` | Descrição do erro | string | não | se RETORNO=false | — |
| `XML` | Conteúdo XML da exportação | string | não | se RETORNO=true | — |

## Códigos de erro (amostra)

| Código | Descrição |
|--------|-----------|
| 18–26 | Filtros inválidos (status, datas, tipo resposta) |
| 45–47 | Erros de hash |
| 200 | Nenhum registro para exportação |

## Implementação neste projeto

- **n8n:** [`workflows/n8n/extensao-n8n-teste/Obter XML Solicitacoes V6.workflow.ts`](../../workflows/n8n/extensao-n8n-teste/Obter%20XML%20Solicitacoes%20V6.workflow.ts) · doc [`scripts/ObterXmlSolicitacoes_v6/Obter XML Solicitacoes V6 WebService ONR.md`](../../scripts/ObterXmlSolicitacoes_v6/Obter%20XML%20Solicitacoes%20V6%20WebService%20ONR.md)
- Python: [`scripts/ObterXmlSolicitacoes_v6/obterXmlSolicitacoes_v6.py`](../../scripts/ObterXmlSolicitacoes_v6/obterXmlSolicitacoes_v6.py)
- JavaScript: [`scripts/ObterXmlSolicitacoes_v6/obterXmlSolicitacoes_v6.js`](../../scripts/ObterXmlSolicitacoes_v6/obterXmlSolicitacoes_v6.js)
- Lib: [`lib/onr_certidoes.py`](../../lib/onr_certidoes.py) · [`lib/onr_certidoes_obter_xml.py`](../../lib/onr_certidoes_obter_xml.py)
- Variáveis `.env`: `CERTIDOES_*`, `CERTIDOES_OBTER_XML_V6_*`
- npm: `npm run obter-xml-solicitacoes-v6`
- Postman: [`postman/onr-webservice-n8n.postman_collection.json`](../../postman/onr-webservice-n8n.postman_collection.json) — § 3.6

## Referências

- [`webservice/hash.md`](../hash.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — § 3.6.5–3.6.6
