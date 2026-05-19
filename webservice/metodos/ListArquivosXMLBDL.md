# ListArquivosXMLBDL

Método do WSOficio — **3.4 Envio e Controle de Arquivos — Banco de Dados Light**.

## Resumo

| Campo | Valor |
|-------|-------|
| Tipo | Listagem |
| Módulo | 3.4 Envio e Controle de Arquivos — Banco de Dados Light |
| Operação SOAP | `ListArquivosXMLBDL` |

## Serviço

- **WSDL (homologação):** `https://hml3-wsoficio.onr.org.br/bdlight.asmx?wsdl`
- **Endpoint:** `https://hml3-wsoficio.onr.org.br/bdlight.asmx`
- **WSDL local:** `wsdl/bdlight.wsdl`

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
| 4 | Chamar `ListArquivosXMLBDL` passando `Hash` + demais parâmetros |

Implementação: [`lib/onr_hash.py`](../../lib/onr_hash.py) · Helper: `resolve_auth_hash()` em [`lib/onr_acompanhamento.py`](../../lib/onr_acompanhamento.py).

Erros comuns: **45** (hash inválido), **46** (token já usado), **47** (expirado) — ver tabela em [`../hash.md`](../hash.md).

## Parâmetros de entrada

| Parâmetro | Descrição |
|-----------|-----------|
| `Hash` | Hash para validação da mensagem (tipo string); |
| `MaxRowPerPage` | Quantidade máxima de registros a serem retornados por página (tipo int); |
| `PageNumber` | Página a ser retornada (tipo int); |
| `DataInicial` | Data da importação inicial a ser filtrada, formato: aaaa-mm-dd (tipo string); |
| `DataFinal` | Data da importação final a ser filtrada, formato: aaaa-mm-dd (tipo string). |

## Parâmetros de saída

| Parâmetro | Descrição |
|-----------|-----------|
| `RETORNO` | Indica se houve erro ou não na execução do método (tipo boolean); |
| `CODIGOERRO` | (se RETORNO = false) Código do erro (tipo int); |
| `ERRODESCRICAO` | (se RETORNO = false) Descrição do erro (tipo string); |
| `QtdeRegistros` | (se RETORNO = true)  Quantidade total de registros encontrados (tipo int); |
| `QtdePaginas` | (se RETORNO = true)  Quantidade total de páginas, de acordo com o total de registros encontrados e com a quantidade máxima de registros por página que foi informada no envelope de entrada - MaxRowPerPage - (tipo int); |
| `IDArquivo` | Código do arquivo (tipo int); |
| `IDStatus` | Código do Status (tipo int).  Valores possíveis: |
| `IDUsuario` | Código do Usuário que realizou a importação (tipo int); |
| `Usuario` | Nome do Usuário que realizou a importação (tipo string); |
| `DataImportacao` | Data da importação, formato: aaaa-mm-ddhh:mm:ss (tipo string); |
| `QtdeRegistros` | Quantidade de registros importados (tipo int); |
| `QtdeInvalidos` | Quantidade de CPFs/CNPJs inválidos (tipo int). |

## Códigos de erro (amostra)

| Código | Descrição |
|--------|-----------|
| 0 | Erro de sistema. |
| 10 | Request inválido. |
| 11 | O Hash de validação não foi informado. |
| 12 | A quantidade de registros por página informada é inválida. A quantidade mínima permitida é 10. |
| 13 | A página informada é inválida. |
| 14 | A data de importação inicial não foi informada. |
| 15 | A data de importação final não foi informada. |
| 16 | A data de importação inicial é inválida. |
| 17 | A data de importação final é inválida. |
| 18 | O período da data de solicitação não pode ser maior que 90 dias. |
| 30 | A página informada é inválida. Página máxima possível: [PAGINA] |
| 45 | Hash inválido. |
| 46 | Hash inválido: Hash já utilizado. |
| 47 | Hash inválido: Hash expirado. |
| 51 | Não foi possível obter os arquivos. |

## Implementação neste projeto

- Script: _(ainda não implementado)_

## Referências

- [`webservice/hash.md`](../hash.md) — geração do `Hash`
- [`webservice/list-metodos.md`](../list-metodos.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — Envelope de Entrada/Saída `ListArquivosXMLBDL`
