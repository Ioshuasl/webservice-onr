# GetPedidoOE

Método do WSOficio — **3.5 Ofícios**.

## Resumo

| Campo | Valor |
|-------|-------|
| Tipo | Consulta |
| Módulo | 3.5 Ofícios Eletrônicos |
| Operação SOAP | `GetPedidoOE` |

## Serviço

- **WSDL (homologação):** `https://hml3-wsoficio.onr.org.br/oficios.asmx?wsdl`
- **Endpoint:** `https://hml3-wsoficio.onr.org.br/oficios.asmx`
- **WSDL local:** `wsdl/oficios.wsdl`

## Hash de autenticação

Implementação: [`lib/onr_oficios.py`](../../lib/onr_oficios.py) · `resolve_auth_hash()`.

## Pré-requisitos e validações de negócio

- `IDPedido` obtido em `ListPedidosOE` ou `ListPedidosOE_V2`.
- `IDInstituicao` de referência: [`ListInstituicoesOE`](ListInstituicoesOE.md).
- `IDStatus` (amostra spec § 3.5.4): 1=Aberto, 2=Respondido, 3=Devolvido, 5=Finalizado sem Pagamento, 7=Nota de Exigência, 9=Prenotado, 10/11=Aguardando Pagto, etc.

## Ordem do envelope (`oRequest`)

Tipo `GetPedidoOE_WSReq` (`wsdl/oficios.wsdl`):

1. `Hash`
2. `IDPedido`

## Parâmetros de entrada

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `Hash` | Hash de autenticação | string | sim | — | _(SHA-1)_ |
| `IDPedido` | Código do pedido | int | sim | — | — |

## Parâmetros de saída

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `RETORNO` | Sucesso | boolean | sim | — | true |
| `CODIGOERRO` | Código do erro | int | sim | — | 0 |
| `ERRODESCRICAO` | Descrição do erro | string | não | se RETORNO=false | — |
| `IDPedido` | Código do pedido | int | sim | se RETORNO=true | — |
| `IDStatus` | Status do pedido | int | sim | se RETORNO=true | 1 |
| `IDInstituicao` | Instituição solicitante | int | sim | se RETORNO=true | — |
| `Instituicao` | Nome da instituição | string | não | se RETORNO=true | — |
| `Departamento` | Departamento | string | não | se RETORNO=true | — |
| `IDUsuario` | Usuário solicitante | int | sim | se RETORNO=true | — |
| `Usuario` | Nome do usuário | string | não | se RETORNO=true | — |
| `IDTipoPesquisa` | Tipo de pesquisa (1–8) | int | sim | se RETORNO=true | — |
| `IDTipoCertidao` | Tipo de certidão (1–5) | int | sim | se RETORNO=true | — |
| `Protocolo` | Protocolo | string | não | se RETORNO=true | — |
| `Ticket` | Ticket | int | sim | se RETORNO=true | — |
| `NumeroOficio` | Número do ofício | string | não | se RETORNO=true | — |
| `DataSolicitacao` | Data solicitação (aaaa-mm-dd) | string | não | se RETORNO=true | — |
| `DataResposta` | Data resposta (aaaa-mm-dd) | string | não | se RETORNO=true | — |
| `Resposta` | Texto da resposta | string | não | se RETORNO=true | — |
| `Retransmitido` | Pedido retransmitido | boolean | sim | se RETORNO=true | — |
| `TipoPessoa` | 1=PF, 2=PJ | int | sim | se RETORNO=true | — |
| `NomeRazao` | Nome ou razão social | string | não | se RETORNO=true | — |
| `CPFCNPJ` | CPF ou CNPJ | string | não | se RETORNO=true | — |
| `RGIE` | RG ou IE | string | não | se RETORNO=true | — |
| `ImoveisDireitos` | Escopo imóveis (1 ou 2) | int | sim | se RETORNO=true | — |
| `DataTransferencia` | Data transferência | string | não | se RETORNO=true | — |
| `Observacoes` | Observações | string | não | se RETORNO=true | — |
| `Matricula` | Matrícula | string | não | se RETORNO=true | — |
| `Transcricao` | Transcrição | string | não | se RETORNO=true | — |
| `DataTranscricao` | Data transcrição | string | não | se RETORNO=true | — |
| `LivroNumero` | Livro | string | não | se RETORNO=true | — |
| `Endereco` … `NomeEsposa` | Campos de endereço/pactuantes | string | não | conforme tipo pesquisa | — |

> Demais campos de endereço no WSDL: `Numero`, `Complemento`, `CEP`, `Edificio`, `Apartamento`, `ComplementoApto`, `Loteamento`, `Lote`, `Quadra`, `NContribuinte`, `Registro`, `DataCasamento`, `NomeMarido`, `NomeEsposa`.

## Códigos de erro (amostra)

| Código | Descrição |
|--------|-----------|
| 12 | IDPedido inválido |
| 45–47 | Erros de hash |
| 51 | Não foi possível obter os dados do pedido |
| 56 | Sem permissão para o pedido |

## Implementação neste projeto

- Python: [`scripts/GetPedidoOe/getPedidoOe.py`](../../scripts/GetPedidoOe/getPedidoOe.py)
- JavaScript: [`scripts/GetPedidoOe/getPedidoOe.js`](../../scripts/GetPedidoOe/getPedidoOe.js)
- Lib: [`lib/onr_oficios.py`](../../lib/onr_oficios.py) · [`lib/onr_oficios.js`](../../lib/onr_oficios.js)
- Variáveis `.env`: `OFICIOS_ID_PEDIDO`, `OFICIOS_*`
- npm: `npm run get-pedido-oe`

## Referências

- [`webservice/hash.md`](../hash.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — § 3.5.3–3.5.4
