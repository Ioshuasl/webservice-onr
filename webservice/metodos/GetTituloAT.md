# GetTituloAT

Método do WSOficio — **3.2 Acompanhamento de Títulos**.

## Resumo

| Campo | Valor |
|-------|-------|
| Tipo | Consulta |
| Módulo | 3.2 Acompanhamento de Títulos |
| Operação SOAP | `GetTituloAT` |

## Serviço

- **WSDL (homologação):** `https://hml3-wsoficio.onr.org.br/acompanhamentotitulos.asmx?wsdl`
- **Endpoint:** `https://hml3-wsoficio.onr.org.br/acompanhamentotitulos.asmx`
- **WSDL local:** `wsdl/acompanhamentotitulos.wsdl`

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
| 4 | Chamar `GetTituloAT` passando `Hash` + demais parâmetros |

Implementação: [`lib/onr_hash.py`](../../lib/onr_hash.py) · Helper: `resolve_auth_hash()` em [`lib/onr_acompanhamento.py`](../../lib/onr_acompanhamento.py).

Erros comuns: **45** (hash inválido), **46** (token já usado), **47** (expirado) — ver tabela em [`../hash.md`](../hash.md).

## Pré-requisitos e validações de negócio

- `ACOMPANHAMENTO_TITULOS_ID_TITULO` definido no `.env`.

## Ordem do envelope (`oRequest`)

Tipo `GetTituloAT_WSReq` (ordem usada nos scripts):

1. `Hash`
2. `IDTitulo`

## Parâmetros de entrada

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `Hash` | Hash de autenticação | string | sim | — | _(SHA-1)_ |
| `IDTitulo` | Código do título | int | sim | — | 1001 |

## Parâmetros de saída

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `RETORNO` | Sucesso | boolean | sim | — | true |
| `CODIGOERRO` | Código do erro | int | sim | — | 0 |
| `ERRODESCRICAO` | Descrição do erro | string | não | se RETORNO=false | — |
| `_(demais campos)_` | Dados do título (protocolo, status, ModoNotificacaoStatus, …) | — | não | se RETORNO=true | — |
## Códigos de erro (amostra)

| Código | Descrição |
|--------|-----------|
| 0 | Erro de sistema. |
| 10 | Request inválido. |
| 11 | O Hash de validação não foi informado. |
| 12 | O IDTitulo informado é inválido. |
| 30 | Não foi possível pegar os dados do título. |
| 45 | Hash inválido. |
| 46 | Hash inválido: Hash já utilizado. |
| 47 | Hash inválido: Hash expirado. |
| 50 | Usuário não tem permissão para acessar o título informado. |

## Implementação neste projeto

- **n8n webhook:** [`scripts/GetTituloAt/Get Titulo AT WebService ONR.md`](../../scripts/GetTituloAt/Get%20Titulo%20AT%20WebService%20ONR.md)
- Python: [`scripts/GetTituloAt/getTituloAt.py`](../../scripts/GetTituloAt/getTituloAt.py)
- JavaScript: [`scripts/GetTituloAt/getTituloAt.js`](../../scripts/GetTituloAt/getTituloAt.js)
- Variáveis `.env`: `ACOMPANHAMENTO_TITULOS_ID_TITULO`
## Referências

- [`webservice/hash.md`](../hash.md) — geração do `Hash`
- [`webservice/list-metodos.md`](../list-metodos.md)
- [`webservice/tabelas-dominio/`](../tabelas-dominio/README.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — Envelope de Entrada/Saída `GetTituloAT`
