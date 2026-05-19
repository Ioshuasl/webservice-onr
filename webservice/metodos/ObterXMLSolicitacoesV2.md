# ObterXMLSolicitacoesV2

Método do WSOficio — **3.9 Matrícula Online / Rel. VM**.

## Resumo

| Campo | Valor |
|-------|-------|
| Tipo | Consulta |
| Módulo | 3.9 Matrícula Online / Rel. VM |
| Operação SOAP | `ObterXMLSolicitacoesV2` |

## Serviço

- **WSDL (homologação):** `https://hml3-wsoficio.onr.org.br/matriculaonline.asmx?wsdl`
- **Endpoint:** `https://hml3-wsoficio.onr.org.br/matriculaonline.asmx`
- **WSDL local:** `wsdl/matriculaonline.wsdl`

## Hash de autenticação

Parâmetro obrigatório **`Hash`** no envelope de entrada (`string(50)`).

Cálculo (detalhes em [`../hash.md`](../hash.md)):

```text
Hash = SHA1( ONR_SERVENTIA_CHAVE + token ).encode('utf-8').hexdigest().upper()
```

| Etapa | Ação |
|-------|------|
| 1 | `LoginUsuarioCertificado` → obter `Tokens` |
| 2 | Escolher token (`ONR_HASH_TOKEN_INDEX`, padrão `0`) |
| 3 | Calcular hash com a chave da serventia (não enviar chave na SOAP) |
| 4 | Chamar `ObterXMLSolicitacoesV2` passando `Hash` + demais parâmetros |

Implementação: [`lib/onr_hash.py`](../../lib/onr_hash.py) · Helper: `resolve_auth_hash()` em [`lib/onr_acompanhamento.py`](../../lib/onr_acompanhamento.py).

Erros comuns: **45** (hash inválido), **46** (token já usado), **47** (expirado) — ver tabela em [`../hash.md`](../hash.md).

## Parâmetros de entrada

| Parâmetro | Descrição |
|-----------|-----------|
| `Hash` | Hash para validação da mensagem (tipo string(50)); |
| `Protocolo` | Protocolo da solicitação de matrícula (tipo string); |
| `Data Inicial` | Data inicial da solicitação de matrícula a ser pesquisada (tipo string). |
| — | Data Final - Data final da solicitação de matrícula a ser pesquisada, com intervalo de 30 dias a partir da data inicial (tipo string). |
| `ID Pedido` | ID do pedido de matrícula (tipo string) |

## Parâmetros de saída

| Parâmetro | Descrição |
|-----------|-----------|
| `RETORNO` | Indica se houve erro ou não na execução do método (tipo boolean); |
| `CODIGOERRO` | (se RETORNO = false) Código do erro (tipo int); |
| `ERRODESCRICAO` | (se RETORNO = false) Descrição do erro (tipo string(200)); |
| `XML da Matricula` | Retorna o XML com uma ou mais matrículas solicitadas(tipo XML CDATA). |

## Códigos de erro (amostra)

| Código | Descrição |
|--------|-----------|
| 0 | Erro de sistema. |
| 10 | Request inválido. |
| 11 | O Hash de validação não foi informado. |
| 12 | O IDCartório informado é inválido. |
| 13 | Formato de data inválido, utilize o padrão AAAA-MM- DD. |
| 13 | Você deve informar a DATA INICIAL, utilize o padrão AAAA-MM-DD. |
| 13 | Você deve informar a DATA FINAL, utilize o padrão AAAA- MM-DD. |
| 13 | Você deve informar um intervalo de data menor ou igual a 30 dias. |
| 13 | IDPedido inválido, utilize o padrão de número inteiro, ex: |
| 14 | Não foram encontrados resultados para o período Informado. |
| 45 | Hash inválido. |
| 46 | Hash inválido: Hash já utilizado. |
| 47 | Hash inválido: Hash expirado. |

## Implementação neste projeto

- Script: _(ainda não implementado)_

## Referências

- [`webservice/hash.md`](../hash.md) — geração do `Hash`
- [`webservice/list-metodos.md`](../list-metodos.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — Envelope de Entrada/Saída `ObterXMLSolicitacoesV2`
