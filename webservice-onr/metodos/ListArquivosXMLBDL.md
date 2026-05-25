# ListArquivosXMLBDL

Método do WSOficio — **3.4 BD Light**.

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

Implementação: [`lib/onr_bdlight.py`](../../lib/onr_bdlight.py) · `resolve_auth_hash()`.

## Pré-requisitos e validações de negócio

- `DataInicial` e `DataFinal` obrigatórias (aaaa-mm-dd), período máximo **90 dias** (erro **18**).
- `MaxRowPerPage` mínimo **10** (erro **12**).
- Status do arquivo: [`IDStatus-BDL`](../tabelas-dominio/IDStatus-BDL.md).

## Ordem do envelope (`oRequest`)

Tipo `ListArquivosXMLBDL_WSReq` (`wsdl/bdlight.wsdl`):

1. `Hash`
2. `MaxRowPerPage`
3. `PageNumber`
4. `DataInicial`
5. `DataFinal`

## Parâmetros de entrada

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `Hash` | Hash de autenticação | string | sim | — | _(SHA-1)_ |
| `MaxRowPerPage` | Registros por página (mín. 10) | int | sim | — | 50 |
| `PageNumber` | Página | int | sim | — | 1 |
| `DataInicial` | Data importação início | string | sim | aaaa-mm-dd | 2025-01-01 |
| `DataFinal` | Data importação fim | string | sim | máx. 90 dias | 2025-03-31 |

## Parâmetros de saída

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `RETORNO` | Sucesso | boolean | sim | — | true |
| `CODIGOERRO` | Código do erro | int | sim | — | 0 |
| `ERRODESCRICAO` | Descrição do erro | string | não | se RETORNO=false | — |
| `QtdeRegistros` | Total de registros | int | sim | se RETORNO=true | — |
| `QtdePaginas` | Total de páginas | int | sim | se RETORNO=true | — |
| `Arquivos[].IDArquivo` | Código do arquivo | int | sim | por item | — |
| `Arquivos[].IDStatus` | Status | int | sim | ver domínio | 2 |
| `Arquivos[].IDUsuario` | Usuário importação | int | sim | — | — |
| `Arquivos[].Usuario` | Nome do usuário | string | não | — | — |
| `Arquivos[].DataImportacao` | Data/hora importação | string | não | — | — |
| `Arquivos[].QtdeRegistros` | Registros importados | int | sim | por item | — |
| `Arquivos[].QtdeInvalidos` | CPF/CNPJ inválidos | int | sim | por item | — |

## Códigos de erro (amostra)

| Código | Descrição |
|--------|-----------|
| 12 | MaxRowPerPage inválido (mínimo 10) |
| 13–17 | Página / datas inválidas ou ausentes |
| 18 | Período > 90 dias |
| 30 | Página além do máximo |
| 45–47 | Erros de hash |
| 51 | Não foi possível obter os arquivos |

## Implementação neste projeto

- Python: [`scripts/ListArquivosXmlBdl/listArquivosXmlBdl.py`](../../scripts/ListArquivosXmlBdl/listArquivosXmlBdl.py)
- JavaScript: [`scripts/ListArquivosXmlBdl/listArquivosXmlBdl.js`](../../scripts/ListArquivosXmlBdl/listArquivosXmlBdl.js)
- Lib: [`lib/onr_bdlight.py`](../../lib/onr_bdlight.py) · [`lib/onr_bdlight.js`](../../lib/onr_bdlight.js)
- Variáveis `.env`: `BDLIGHT_*`
- npm: `npm run list-arquivos-xml-bdl`

## Referências

- [`webservice/hash.md`](../hash.md)
- [`webservice/list-metodos.md`](../list-metodos.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — § 3.4.1–3.4.2
