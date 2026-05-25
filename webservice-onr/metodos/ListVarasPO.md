# ListVarasPO

Método do WSOficio — **3.3 Penhora Online**.

## Resumo

| Campo | Valor |
|-------|-------|
| Tipo | Listagem |
| Módulo | 3.3 Penhora Online |
| Operação SOAP | `ListVarasPO` |

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
| 4 | Chamar `ListVarasPO` passando `Hash` + demais parâmetros |

Implementação: [`lib/onr_hash.py`](../../lib/onr_hash.py) · Helper: `resolveAuthHash()` em [`lib/onr_penhora_online.js`](../../lib/onr_penhora_online.js).

Erros comuns: **45** (hash inválido), **46** (token já usado), **47** (expirado) — ver tabela em [`../hash.md`](../hash.md).

## Pré-requisitos e validações de negócio

- Filtros geográficos opcionais (`PENHORA_ONLINE_ID_ESTADO/COMARCA/FORO`).

## Ordem do envelope (`oRequest`)

Tipo `ListVarasPO_WSReq` (ordem usada nos scripts):

1. `Hash`
2. `IDEstado`
3. `IDComarca`
4. `IDForo`

## Parâmetros de entrada

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `Hash` | Hash de autenticação | string | sim | — | _(SHA-1)_ |
| `IDEstado` | Estado | int | sim | — | 0 |
| `IDComarca` | Comarca | int | sim | — | 0 |
| `IDForo` | Foro | int | sim | — | 0 |

## Parâmetros de saída

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `RETORNO` | Sucesso | boolean | sim | — | true |
| `CODIGOERRO` | Código do erro | int | sim | — | 0 |
| `ERRODESCRICAO` | Descrição do erro | string | não | se RETORNO=false | — |
| `Varas` | Lista de varas | ListVarasPO_Vara_WSResp[] | não | se RETORNO=true | — |
## Códigos de erro (amostra)

| Código | Descrição |
|--------|-----------|
| 0 | Erro de sistema. |
| 10 | Request inválido. |
| 11 | O Hash de validação não foi informado. |
| 12 | O IDEstado informado é inválido. |
| 13 | O IDComarca informado é inválido. |
| 14 | O IDForo informado é inválido. |
| 45 | Hash inválido. |
| 46 | Hash inválido: Hash já utilizado. |
| 47 | Hash inválido: Hash expirado. |
| 51 | Não foi possível obter as Varas. |

## Implementação neste projeto

- Python: [`scripts/ListVarasPo/listVarasPo.py`](../../scripts/ListVarasPo/listVarasPo.py)
- JavaScript: [`scripts/ListVarasPo/listVarasPo.js`](../../scripts/ListVarasPo/listVarasPo.js)
- Workflow n8n: [`scripts/ListVarasPo/List Varas PO WebService ONR.md`](../../scripts/ListVarasPo/List%20Varas%20PO%20WebService%20ONR.md)
- Variáveis `.env`: `PENHORA_ONLINE_ID_ESTADO`, `PENHORA_ONLINE_ID_COMARCA`, `PENHORA_ONLINE_ID_FORO`
## Referências

- [`webservice/hash.md`](../hash.md) — geração do `Hash`
- [`webservice/list-metodos.md`](../list-metodos.md)
- [`webservice/tabelas-dominio/`](../tabelas-dominio/README.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — Envelope de Entrada/Saída `ListVarasPO`
