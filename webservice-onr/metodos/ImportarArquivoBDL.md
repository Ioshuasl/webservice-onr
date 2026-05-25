# ImportarArquivoBDL

Método do WSOficio — **3.4 BD Light**.

## Resumo

| Campo | Valor |
|-------|-------|
| Tipo | Importação |
| Módulo | 3.4 Envio e Controle de Arquivos — Banco de Dados Light |
| Operação SOAP | `ImportarArquivoBDL` |

## Serviço

- **WSDL (homologação):** `https://hml3-wsoficio.onr.org.br/bdlight.asmx?wsdl`
- **Endpoint:** `https://hml3-wsoficio.onr.org.br/bdlight.asmx`
- **WSDL local:** `wsdl/bdlight.wsdl`

## Hash de autenticação

Parâmetro obrigatório **`Hash`** no envelope de entrada.

Implementação: [`lib/onr_bdlight.py`](../../lib/onr_bdlight.py) · `resolve_auth_hash()`.

## Pré-requisitos e validações de negócio

- Informar ao menos uma **URL pública** (`http`/`https`) apontando para arquivo **`.xml`** (máx. **5MB**).
- Conteúdo conforme modelo **BANCOLIGHT** — spec § **4.1** (Anexo 1).
- A ONR baixa e processa os arquivos **assincronamente**; use [`ListArquivosXMLBDL`](ListArquivosXMLBDL.md) para acompanhar e obter `IDArquivo`.
- Erro **104** se extensão não for `.xml`; **106** se > 5MB; **102** se URL inacessível.
- Estrutura XML: raiz `BANCOLIGHT`, blocos `INDIVIDUO` com `NOME`, `CNPJCPF`, `NMATRICULA`, `TIPODEATO`, `DTREGAVERB`, `DTVENDA` (modelo [`bdlight-xml-exemplo/bdlight-exemplo-1.xml`](../../bdlight-xml-exemplo/bdlight-exemplo-1.xml)).
- Validação local/URL antes do SOAP: [`lib/onr_bdlight_xml.py`](../../lib/onr_bdlight_xml.py) · [`lib/onr_bdlight_xml.js`](../../lib/onr_bdlight_xml.js).

## Ordem do envelope (`oRequest`)

Tipo `ImportarArquivoBDL_WSReq` (`wsdl/bdlight.wsdl`):

1. `Hash`
2. `Arquivos` → `ImportarArquivoBDL_Arquivo_WSReq[]`
   - `URLArquivo` (por item)

## Parâmetros de entrada

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `Hash` | Hash de autenticação | string | sim | — | _(SHA-1)_ |
| `Arquivos[].URLArquivo` | URL pública do XML | string | sim | por item | https://exemplo/arquivo.xml |

## Parâmetros de saída

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `RETORNO` | Sucesso | boolean | sim | — | true |
| `CODIGOERRO` | Código do erro | int | sim | — | 0 |
| `ERRODESCRICAO` | Descrição do erro | string | não | se RETORNO=false | — |

> A resposta **não** retorna `IDArquivo`; após processamento, liste com `ListArquivosXMLBDL`.

## Códigos de erro (amostra)

| Código | Descrição |
|--------|-----------|
| 12 | Nenhum arquivo informado |
| 45–47 | Erros de hash |
| 50 | Sem permissão |
| 101–106 | Cadastro / URL / extensão / tamanho / XML |
| 501–502 | XML inválido / fila de resposta |

## Implementação neste projeto

- Python: [`scripts/ImportarArquivoBdl/importarArquivoBdl.py`](../../scripts/ImportarArquivoBdl/importarArquivoBdl.py)
- JavaScript: [`scripts/ImportarArquivoBdl/importarArquivoBdl.js`](../../scripts/ImportarArquivoBdl/importarArquivoBdl.js)
- Lib: [`lib/onr_bdlight.py`](../../lib/onr_bdlight.py) · [`lib/onr_bdlight.js`](../../lib/onr_bdlight.js)
- Variáveis `.env`:
  - `BDLIGHT_IMPORTAR_URL_ARQUIVO` — uma URL
  - `BDLIGHT_IMPORTAR_URLS` — várias URLs separadas por vírgula/espaço
  - `BDLIGHT_IMPORTAR_ARQUIVOS_JSON` — `[{"URLArquivo":"https://..."}]` ou `["https://..."]`
  - `BDLIGHT_IMPORTAR_VALIDAR_XML` — `true` valida paths + URLs antes do SOAP
  - `BDLIGHT_IMPORTAR_XML_PATH` — arquivo(s) local(is) separados por vírgula
- npm: `npm run importar-arquivo-bdl` · `npm run validate-bdlight-xml`

## Referências

- [`webservice/hash.md`](../hash.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — § 3.4.5–3.4.6, § 4.1 (modelo XML)
