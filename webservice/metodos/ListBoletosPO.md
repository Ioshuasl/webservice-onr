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

## Parâmetros de entrada

| Parâmetro | Descrição |
|-----------|-----------|
| `Hash` | Hash para validação da mensagem (tipo string); |
| `IDProcesso` | Código do Processo a ser filtrado (tipo int). |

## Parâmetros de saída

| Parâmetro | Descrição |
|-----------|-----------|
| `RETORNO` | Indica se houve erro ou não na execução do método (tipo boolean); |
| `CODIGOERRO` | (se RETORNO = false) Código do erro (tipo int); |
| `ERRODESCRICAO` | (se RETORNO = false) Descrição do erro (tipo string); |
| `IDBoleto` | Código do boleto (tipo int); |
| `NumeroBoleto` | Número do boleto (tipo string); |
| `DataGerado` | Data que o boleto foi gerado, formato: aaaa-mm-ddhh:mm:ss (tipo string); |
| `DataVencimento` | Data de vencimento do boleto, formato: aaaa-mm-ddhh:mm:ss (tipo string); |
| `DataPagamento` | Data da baixa do boleto, formato: aaaa-mm-ddhh:mm:ss (tipo string); |
| `ValorBoleto` | Valor do boleto (tipo decimal); |
| `Pago` | Indica se foi pago (tipo boolean); |
| `Protocolos` | Protocolos associados com o boleto (tipo string); |
| `BoletoAnexado` | Indica se o boleto é do tipo anexado ou gerado (tipo boolean); |
| `URLBoleto` | URL do boleto (tipo string). |

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

- Script Python: [`scripts/ListBoletosPo/listBoletosPo.py`](../../scripts/ListBoletosPo/listBoletosPo.py)
- Script JavaScript: [`scripts/ListBoletosPo/listBoletosPo.js`](../../scripts/ListBoletosPo/listBoletosPo.js)
- Lib: [`lib/onr_penhora_online.py`](../../lib/onr_penhora_online.py) · [`lib/onr_penhora_online.js`](../../lib/onr_penhora_online.js)
- Variável `.env`: `PENHORA_ONLINE_ID_PROCESSO` (campo `IDProcesso` de `GetPedidoPO`)

## Referências

- [`webservice/hash.md`](../hash.md) — geração do `Hash`
- [`webservice/list-metodos.md`](../list-metodos.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — Envelope de Entrada/Saída `ListBoletosPO`
