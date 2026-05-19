# ObterXMLSolicitacoes_v5

Método do WSOficio — **3.6 Certidões a Emitir**.

## Resumo

| Campo | Valor |
|-------|-------|
| Tipo | Consulta |
| Módulo | 3.6 Certidões a Emitir |
| Operação SOAP | `ObterXMLSolicitacoes_v5` |

## Serviço

- **WSDL (homologação):** `https://hml3-wsoficio.onr.org.br/Certidoes.asmx?wsdl`
- **Endpoint:** `https://hml3-wsoficio.onr.org.br/Certidoes.asmx`
- **WSDL local:** `wsdl/certidoes.wsdl`

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
| 4 | Chamar `ObterXMLSolicitacoes_v5` passando `Hash` + demais parâmetros |

Implementação: [`lib/onr_hash.py`](../../lib/onr_hash.py) · Helper: `resolve_auth_hash()` em [`lib/onr_acompanhamento.py`](../../lib/onr_acompanhamento.py).

Erros comuns: **45** (hash inválido), **46** (token já usado), **47** (expirado) — ver tabela em [`../hash.md`](../hash.md).

## Parâmetros de entrada

| Parâmetro | Descrição |
|-----------|-----------|
| `Hash` | Hash para validação da mensagem (tipo string). |
| — | Protocolo - Filtro opcional para um protocolo específico (tipo string) |
| — | Solicitante - Filtro opcional para o nome do solicitante (tipo string) |
| — | TipoCertidao - Filtro opcional para o tipo de certidão, baseado na seginte tabela: |
| `9 - LIVRO3` | Garantias |
| `10 - OUTROS REGISTROS LIVRO3` | Auxiliar |
| `13` | POR QUESITO |
| `14` | NEGATIVA DE PENHOR |
| `15` | ÔNUS REAIS E AÇÕES REIPERSECUTÓRIAS |
| `16` | USUCAPIÃO |
| `17` | PROPRIEDADE, ÔNUS E ALIENAÇÕES |
| `18` | CADEIA DOMINIAL (FILIAÇÃO ATÉ ORIGEM) |
| `19` | AÇÕES REIPERSECUTÓRIAS |
| `20` | ÔNUS REAIS |
| — | PesquisaPor - Filtro opcional para o tipo de pesquisa, baseado na seguinte tabela: |
| `4` | MATRÍCULA |
| `5` | TRANSCRIÇÃO |
| `6` | PESSOA |
| `9` | ENDEREÇO |
| `10` | PROTOCOLO |
| `12` | Cancelado |
| `13` | Pendente de Resposta |
| `23` | Cancelado pelo Solicitante |
| — | TipoResposta - Filtro opcional, somente aplicável quando o filtro "Status = 3 (Respondido)". Baseia-se na seguinte tabela: |
| — | DataPedidoDe - Filtro opcional no formato: aaaa-mm-dd (tipo string), com a data inicial do período de solicitações |
| — | DataPedidoAte - Filtro opcional no formato: aaaa-mm-dd (tipo string), com a data final do período de solicitações |
| — | DataConferenciaDe - Filtro opcional no formato: aaaa-mm-dd (tipo string), com a data inicial do período de respostas |
| — | DataConferenciaAte - Filtro opcional no formato: aaaa-mm-dd (tipo string), com a data final do período de respostas |

## Parâmetros de saída

| Parâmetro | Descrição |
|-----------|-----------|
| `RETORNO` | Indica se houve erro ou não na execução do método (tipo boolean); |
| `CODIGOERRO` | (se RETORNO = false) Código do erro (tipo int); |
| `ERRODESCRICAO` | (se RETORNO = false) Descrição do erro (tipo string); |
| `Hash` | Hash para validação da mensagem (tipo string). |
| — | Protocolo - Filtro opcional para um protocolo específico (tipo string) |
| — | Solicitante - Filtro opcional para o nome do solicitante (tipo string) |
| — | TipoCertidao - Filtro opcional para o tipo de certidão, baseado na seginte tabela: |
| `9 - LIVRO3` | Garantias |
| `10 - OUTROS REGISTROS LIVRO3` | Auxiliar |
| `13` | POR QUESITO |
| `14` | NEGATIVA DE PENHOR |
| `15` | ÔNUS REAIS E AÇÕES REIPERSECUTÓRIAS |
| `16` | USUCAPIÃO |
| `17` | PROPRIEDADE, ÔNUS E ALIENAÇÕES |
| `18` | CADEIA DOMINIAL (FILIAÇÃO ATÉ ORIGEM) |
| `19` | AÇÕES REIPERSECUTÓRIAS |
| `20` | ÔNUS REAIS |
| `21` | CERTIDÃO DA SITUAÇÃO JURÍDICA ATUALIZADA DO IMÓVEL |
| ``o` 22` | CERTIDÃO AGRONEGÓCIO |
| — | PesquisaPor - Filtro opcional para o tipo de pesquisa, baseado na seguinte tabela: |
| `4` | MATRÍCULA |
| `5` | TRANSCRIÇÃO |
| `6` | PESSOA |
| `9` | ENDEREÇO |
| `10` | PROTOCOLO |
| ``o` 15` | BUSCA DE GARANTIAS |
| `12` | Cancelado |
| `13` | Pendente de Resposta |
| `23` | Cancelado pelo Solicitante |
| — | TipoResposta - Filtro opcional, somente aplicável quando o filtro "Status = 3 (Respondido)". Baseia-se na seguinte tabela: |
| — | DataPedidoDe - Filtro opcional no formato: aaaa-mm-dd (tipo string), com a data inicial do período de solicitações |
| — | DataPedidoAte - Filtro opcional no formato: aaaa-mm-dd (tipo string), com a data final do período de solicitações |
| — | DataConferenciaDe - Filtro opcional no formato: aaaa-mm-dd (tipo string), com a data inicial do período de respostas |
| — | DataConferenciaAte - Filtro opcional no formato: aaaa-mm-dd (tipo string), com a data final do período de respostas |

## Códigos de erro (amostra)

| Código | Descrição |
|--------|-----------|
| 0 | Erro de sistema. |
| 10 | Request inválido. |
| 11 | O Hash de validação não foi informado. |
| 18 | Status Inválido. |
| 19 | Data inválida em"DataPedidoDe" |
| 20 | Data inválida em"DataPedidoAte" |
| 21 | Data inválida em"DataConferenciaDe" |
| 22 | Data inválida em"DataConferenciaAte" |
| 23 | Campo "TipoCertidao" deve estar em branco ou entre 1 e 10. |
| 24 | Campo "PesquisaPor" deve estar em branco ou entre 4 e 12. |
| 26 | Campo "TipoResposta" inválido. Valores permitidos: "" (vazio), "D" ou "C". Os valores "D" e "C" somente são permitidos se o campo "Sttatus"  estiver preenchido com"3"(Respondido). |
| 45 | Hash inválido. |
| 46 | Hash inválido: Hash já utilizado. |
| 47 | Hash inválido: Hash expirado. |
| 200 | Não foram localizados registros para exportação |

## Implementação neste projeto

- Script: _(ainda não implementado)_

## Referências

- [`webservice/hash.md`](../hash.md) — geração do `Hash`
- [`webservice/list-metodos.md`](../list-metodos.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — Envelope de Entrada/Saída `ObterXMLSolicitacoes_v5`
