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

Implementação: [`lib/onr_hash.py`](../../lib/onr_hash.py) · Helper: `resolve_auth_hash()` em [`lib/onr_acompanhamento.py`](../../lib/onr_acompanhamento.py).

Erros comuns: **45** (hash inválido), **46** (token já usado), **47** (expirado) — ver tabela em [`../hash.md`](../hash.md).

## Parâmetros de entrada

| Parâmetro | Descrição |
|-----------|-----------|
| `Hash` | Hash para validação da mensagem (tipo string); |
| `IDEstado` | Código do Estado a ser filtrado. Para retornar todos, informar -1 (tipo int); |
| `IDComarca` | Código da Comarca a ser filtrada. Para retornar todas, informar -1 (tipo int); |
| `IDForo` | Código do Foro a ser filtrado. Para retornar todos, informar -1 (tipo int). |

## Parâmetros de saída

| Parâmetro | Descrição |
|-----------|-----------|
| `RETORNO` | Indica se houve erro ou não na execução do método (tipo boolean); |
| `CODIGOERRO` | (se RETORNO = false) Código do erro (tipo int); |
| `ERRODESCRICAO` | (se RETORNO = false) Descrição do erro (tipo string); |
| `IDVara` | Código da Vara(tipo int); |
| `IDForo` | Código do Foro (tipo int); |
| `IDComarca` | Código da Comarca (tipo int); |
| `IDEstado` | Código do Estado (tipo int); |
| `Vara` | Nome da Vara (tipo string); |
| `Foro` | Nome do Foro (tipo string); |
| `Comarca` | Nome da Comarca (tipo string); |
| `Estado` | Nome do Estado (tipo string). |

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

- Script Python: [`scripts/ListVarasPo/listVarasPo.py`](../../scripts/ListVarasPo/listVarasPo.py)
- Script JavaScript: [`scripts/ListVarasPo/listVarasPo.js`](../../scripts/ListVarasPo/listVarasPo.js)
- Lib: [`lib/onr_penhora_online.py`](../../lib/onr_penhora_online.py) · [`lib/onr_penhora_online.js`](../../lib/onr_penhora_online.js)
- Variáveis `.env`: `PENHORA_ONLINE_ID_ESTADO`, `PENHORA_ONLINE_ID_COMARCA`, `PENHORA_ONLINE_ID_FORO` (padrão `-1` = todos)

## Referências

- [`webservice/hash.md`](../hash.md) — geração do `Hash`
- [`webservice/list-metodos.md`](../list-metodos.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — Envelope de Entrada/Saída `ListVarasPO`
