# GetArquivoXMLBDL

Método do WSOficio — **3.4 BD Light**.

## Resumo

| Campo | Valor |
|-------|-------|
| Tipo | Consulta |
| Módulo | 3.4 Envio e Controle de Arquivos — Banco de Dados Light |
| Operação SOAP | `GetArquivoXMLBDL` |

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

- `IDArquivo` deve existir e pertencer à serventia autenticada (erro **50** se sem permissão).
- Obter `IDArquivo` via [`ListArquivosXMLBDL`](ListArquivosXMLBDL.md) ou após [`ImportarArquivoBDL`](ImportarArquivoBDL.md).
- Status do arquivo: [`IDStatus-BDL`](../tabelas-dominio/IDStatus-BDL.md).
- `URLArquivo` pode estar indisponível ou expirar após a importação.

## Ordem do envelope (`oRequest`)

Tipo `GetArquivoXMLBDL_WSReq` (`wsdl/bdlight.wsdl`):

1. `Hash`
2. `IDArquivo`

## Parâmetros de entrada

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `Hash` | Hash de autenticação | string | sim | — | _(SHA-1)_ |
| `IDArquivo` | Código do arquivo | int | sim | — | 12345 |

## Parâmetros de saída

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `RETORNO` | Sucesso | boolean | sim | — | true |
| `CODIGOERRO` | Código do erro | int | sim | — | 0 |
| `ERRODESCRICAO` | Descrição do erro | string | não | se RETORNO=false | — |
| `IDStatus` | Status do arquivo | int | sim | se RETORNO=true | 2 |
| `IDUsuario` | Usuário da importação | int | sim | se RETORNO=true | — |
| `DataImportacao` | Data/hora importação | string | não | se RETORNO=true | 2025-01-15 10:30:00 |
| `QtdeRegistros` | Registros importados | int | sim | se RETORNO=true | — |
| `QtdeInvalidos` | CPF/CNPJ inválidos | int | sim | — | — |
| `URLArquivo` | URL para download do XML | string | não | se RETORNO=true | — |
| `ErrosImportacao` | Erros da importação | string | não | se RETORNO=true | — |
| `Invalidos[].CPFCNPJ` | CPF/CNPJ inválido | string | não | por item | — |
| `Invalidos[].NomeRazao` | Nome da pessoa | string | não | por item | — |
| `Invalidos[].NMatricula` | Número da matrícula | string | não | por item | — |

## Códigos de erro (amostra)

| Código | Descrição |
|--------|-----------|
| 11 | Hash não informado |
| 12 | IDArquivo inválido |
| 30 | Não foi possível obter os dados do arquivo |
| 45–47 | Erros de hash |
| 50 | Sem permissão para o arquivo |

## Implementação neste projeto

- Python: [`scripts/GetArquivoXmlBdl/getArquivoXmlBdl.py`](../../scripts/GetArquivoXmlBdl/getArquivoXmlBdl.py)
- JavaScript: [`scripts/GetArquivoXmlBdl/getArquivoXmlBdl.js`](../../scripts/GetArquivoXmlBdl/getArquivoXmlBdl.js)
- Lib: [`lib/onr_bdlight.py`](../../lib/onr_bdlight.py) · [`lib/onr_bdlight.js`](../../lib/onr_bdlight.js)
- Variáveis `.env`: `BDLIGHT_ID_ARQUIVO`, `BDLIGHT_*` (WSDL/endpoint/login)
- npm: `npm run get-arquivo-xml-bdl`

## Referências

- [`webservice/hash.md`](../hash.md)
- [`webservice/list-metodos.md`](../list-metodos.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — § 3.4.3–3.4.4
