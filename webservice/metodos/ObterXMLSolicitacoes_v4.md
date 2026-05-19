# ObterXMLSolicitacoes_v4

Método do WSOficio — **3.6 Certidões a Emitir**.

## Resumo

| Campo | Valor |
|-------|-------|
| Tipo | Consulta |
| Módulo | 3.6 Certidões a Emitir |
| Operação SOAP | `ObterXMLSolicitacoes_v4` |

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
| 4 | Chamar `ObterXMLSolicitacoes_v4` passando `Hash` + demais parâmetros |

Implementação: [`lib/onr_hash.py`](../../lib/onr_hash.py) · Helper: `resolve_auth_hash()` em [`lib/onr_acompanhamento.py`](../../lib/onr_acompanhamento.py).

Erros comuns: **45** (hash inválido), **46** (token já usado), **47** (expirado) — ver tabela em [`../hash.md`](../hash.md).

## Parâmetros de entrada

_Consultar `especificacao_wsoficio_dev.md` — Envelope de Entrada._

## Parâmetros de saída

| Parâmetro | Descrição |
|-----------|-----------|
| `Hash` | Hash para validação da mensagem (tipo string). |
| — | Protocolo - Filtro opcional para um protocolo específico (tipo string) |
| — | Solicitante - Filtro opcional para o nome do solicitante (tipo string) |
| — | TipoCertidao - Filtro opcional para o tipo de certidão, baseado na seguinte tabela: |
| `1` | POSITIVA/NEGATIVA DE PROPRIEDADE |
| `2` | VINTENÁRIA |
| `3` | MATRÍCULA – INTEIRO TEOR |
| `4` | TRANSCRIÇÃO |
| `5` | PACTO ANTENUPCIAL |
| `6` | ÔNUS E ALIENAÇÕES |
| `7` | DOCUMENTO ARQUIVADO |
| `8` | CONVENÇÃO DE CONDOMÍNIO |
| `9` | LIVRO3 – GARANTIAS |
| `10` | OUTROS REGISTROS LIVRO3 – AUXILIAR |
| `11` | OUTRAS CERTIDÕES |
| `12` | INTEIRO TEOR, ÔNUS E AÇÕES |
| `13` | POR QUESITO |
| `14` | NEGATIVA DE PENHOR |
| `15` | ÔNUS REAIS E AÇÕES REIPERSECUTÓRIAS |
| `16` | USUCAPIÃO |
| `17` | PROPRIEDADE, ÔNUS E ALIENAÇÕES |
| `18` | CADEIA DOMINIAL (FILIAÇÃO ATÉ ORIGEM) |
| `19` | AÇÕES REIPERSECUTÓRIAS |
| `20` | ÔNUS REAIS |
| `21` | CERTIDÃO DA SITUAÇÃO JURÍDICA ATUALIZADA DO IMÓVEL |
| `22` | CERTIDÃO AGRONEGÓCIO |
| — | PedidoPor - Filtro opcional para o tipo de pesquisa, baseado na seguinte tabela: |
| `1` | ENDEREÇO RUA |
| `2` | ENDEREÇO EDIFÍCIO |
| `3` | ENDEREÇO LOTEAMENTO |
| `4` | MATRÍCULA |
| `5` | TRANSCRIÇÃO |
| `6` | PESSOA |
| `7` | REGISTRO |
| `8` | PACTUANTES |
| `9` | ENDEREÇO |
| `10` | Nº DO PROTOCOLO |
| `11` | N° DO REGISTRO DO LIVRO 3 |
| `12` | NOME DO CONDOMÍNIO |
| `13` | PARA FINS DE USUCAPIÃO |
| … | _+10 parâmetros — ver especificação_ |

## Implementação neste projeto

- Script: _(ainda não implementado)_

## Referências

- [`webservice/hash.md`](../hash.md) — geração do `Hash`
- [`webservice/list-metodos.md`](../list-metodos.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — Envelope de Entrada/Saída `ObterXMLSolicitacoes_v4`
