# ListBoletosPO

Método do WSOficio — **3.3 Penhora Online**.

## Resumo

| Campo | Valor |
|-------|-------|
| Tipo | Listagem |
| Módulo | 3.3 Penhora Online |
| Operação SOAP | `ListBoletosPO` |

## Serviço

- **WSDL (homologação):** `https://hml3-wsoficio.onr.org.br/penhoraonline.asmx?wsdl`
- **Endpoint:** `https://hml3-wsoficio.onr.org.br/penhoraonline.asmx`
- **WSDL local:** `wsdl/penhoraonline.wsdl`

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
| 4 | Chamar `ListBoletosPO` passando `Hash` + demais parâmetros |

Implementação: [`lib/onr_hash.py`](../../lib/onr_hash.py) · Helper: `resolve_auth_hash()` em [`lib/onr_acompanhamento.py`](../../lib/onr_acompanhamento.py).

Erros comuns: **45** (hash inválido), **46** (token já usado), **47** (expirado) — ver tabela em [`../hash.md`](../hash.md).

## Pré-requisitos e validações de negócio

- `PENHORA_ONLINE_ID_PROCESSO` de `GetPedidoPO`.

## Ordem do envelope (`oRequest`)

Tipo `ListBoletosPO_WSReq` (ordem usada nos scripts):

1. `Hash`
2. `IDProcesso`

## Parâmetros de entrada

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `Hash` | Hash de autenticação | string | sim | — | _(SHA-1)_ |
| `IDProcesso` | Código do processo | int | sim | — | 2642149 |

## Parâmetros de saída

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `RETORNO` | Sucesso | boolean | sim | — | true |
| `CODIGOERRO` | Código do erro | int | sim | — | 0 |
| `ERRODESCRICAO` | Descrição do erro | string | não | se RETORNO=false | — |
| `Boletos` | Lista de boletos | ListBoletosPO_Boleto_WSResp[] | não | se RETORNO=true | — |
## Códigos de erro (amostra)

| Código | Descrição |
|--------|-----------|
| 0 | Erro de sistema. |
| 10 | Request inválido. |
| 11 | O Hash de validação não foi informado. |
| 12 | O IDProcesso informado é inválido. |
| 45 | Hash inválido. |
| 46 | Hash inválido: Hash já utilizado. |
| 47 | Hash inválido: Hash expirado. |
| 51 | Não foi possível obter os boletos. |

## Implementação neste projeto

- Python: [`scripts/ListBoletosPo/listBoletosPo.py`](../../scripts/ListBoletosPo/listBoletosPo.py)
- JavaScript: [`scripts/ListBoletosPo/listBoletosPo.js`](../../scripts/ListBoletosPo/listBoletosPo.js)
- Variáveis `.env`: `PENHORA_ONLINE_ID_PROCESSO`
## Referências

- [`webservice/hash.md`](../hash.md) — geração do `Hash`
- [`webservice/list-metodos.md`](../list-metodos.md)
- [`webservice/tabelas-dominio/`](../tabelas-dominio/README.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — Envelope de Entrada/Saída `ListBoletosPO`
