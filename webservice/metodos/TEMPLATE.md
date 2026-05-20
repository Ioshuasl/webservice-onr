# {Operacao}

Método do WSOficio — **{Modulo}**.

## Resumo

| Campo | Valor |
|-------|-------|
| Tipo | {TipoOperacao} |
| Módulo | {Modulo} |
| Operação SOAP | `{Operacao}` |

## Serviço

- **WSDL (homologação):** `{WSDL}`
- **Endpoint:** `{Endpoint}`
- **WSDL local:** `{WSDLLocal}`

## Hash de autenticação

_(omitir esta seção em `LoginUsuarioCertificado`; caso contrário, manter padrão de [`hash.md`](../hash.md).)_

## Pré-requisitos e validações de negócio

Regras que o serviço exige além do XSD (erros típicos entre parênteses):

- _(ex.: pedido com **IDTipoPedido = 2** — ver [IDTipoPedido (Penhora Online)](../tabelas-dominio/IDTipoPedido-PO.md))_
- _(ex.: pedido sem resposta finalizada — erro **502**)_

## Ordem do envelope (`oRequest`)

Conferir `<Operacao>_WSReq` em `wsdl/*.wsdl`:

1. `Campo1`
2. `Campo2`
3. …

## Parâmetros de entrada

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `Hash` | Hash de autenticação | `string(50)` | sim | — | _(via login + SHA-1)_ |
| … | … | … | sim / não | _(quando aplicável)_ | … |

> **Obrigatório:** `sim` = exigido pelo negócio ou `minOccurs=1` no WSDL; `não` = opcional no XSD (pode ainda ser exigido pelo serviço — ver erros **501**, **13**, etc.).
>
> **Condicional:** dependência de outro campo ou de `RETORNO`/tipo de pedido; use `—` se não houver.

## Parâmetros de saída

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `RETORNO` | Sucesso da operação | `boolean` | sim | — | `true` |
| `CODIGOERRO` | Código do erro | `int` | sim | preenchido quando `RETORNO=false` | `0` |
| `ERRODESCRICAO` | Descrição do erro | `string` | não | quando `RETORNO=false` | — |
| … | … | … | … | … | … |

## Códigos de erro (amostra)

| Código | Descrição |
|--------|-----------|
| … | … |

## Implementação neste projeto

- Python: `scripts/...`
- JavaScript: `scripts/...`
- Variáveis `.env`: `PREFIXO_*`

## Referências

- [`webservice/hash.md`](../hash.md)
- [`webservice/list-metodos.md`](../list-metodos.md)
- [`webservice/tabelas-dominio/`](../tabelas-dominio/)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md)
