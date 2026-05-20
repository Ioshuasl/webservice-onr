# SetPedidoMatriculaRespondidoPO

Método do WSOficio — **3.3 Penhora Online**.

## Resumo

| Campo | Valor |
|-------|-------|
| Tipo | Atualização / comando |
| Módulo | 3.3 Penhora Online |
| Operação SOAP | `SetPedidoMatriculaRespondidoPO` |

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
| 4 | Chamar `SetPedidoMatriculaRespondidoPO` passando `Hash` + demais parâmetros |

Implementação: [`lib/onr_hash.py`](../../lib/onr_hash.py) · Helper: `resolve_auth_hash()` em [`lib/onr_penhora_online.py`](../../lib/onr_penhora_online.py).

Erros comuns: **45** (hash inválido), **46** (token já usado), **47** (expirado) — ver tabela em [`../hash.md`](../hash.md).

## Pré-requisitos e validações de negócio

- **[IDTipoPedido = 1](../tabelas-dominio/IDTipoPedido-PO.md)** (Certidão por Matrícula) — erro **53**.
- Ao menos um anexo com matrícula e URL pública (`.p7s` na spec; homolog pode aceitar `.pdf`).
- O pedido só é efetivamente respondido após o ONR baixar todos os arquivos (**502** se já houver resposta pendente de download).

Variante com Assinador Web: `SetPedidoMatriculaRespondidoPO_DocID` (não implementada neste projeto).

## Ordem do envelope (`oRequest`)

Tipo `SetPedidoMatriculaRespondidoPO_WSReq` (`wsdl/penhoraonline.wsdl`):

1. `Hash`
2. `IDPedido`
3. `Resposta`
4. `Anexos`

## Parâmetros de entrada

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `Hash` | Hash de autenticação | string | sim | — | _(SHA-1)_ |
| `IDPedido` | Pedido matrícula | int | sim | IDTipoPedido=1 | — |
| `Resposta` | Texto da resposta | string | sim | — | — |
| `Anexos[].Matricula` | Matrícula | string | sim | por item | 12345 |
| `Anexos[].URLArquivo` | URL do arquivo | string | sim | por item | https://…/doc.p7s |

## Parâmetros de saída

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `RETORNO` | Sucesso | boolean | sim | — | true |
| `CODIGOERRO` | Código do erro | int | sim | — | 0 |
| `ERRODESCRICAO` | Descrição do erro | string | não | se RETORNO=false | — |

## Códigos de erro (amostra)

| Código | Descrição |
|--------|-----------|
| 0 | Erro de sistema. |
| 10 | Request inválido. |
| 11 | O Hash de validação não foi informado. |
| 12 | O IDPedido informado é inválido. |
| 13 | A Resposta não foi informada. |
| 14 | Não foi informado nenhum anexo. |
| 45 | Hash inválido. |
| 46 | Hash inválido: Hash já utilizado. |
| 47 | Hash inválido: Hash expirado. |
| 51 | Não foi possível pegar os dados do pedido. Certifique-se que o pedido é do tipo Matrícula. |
| 52 | Usuário não tem permissão para cadastrar resposta para esse pedido. |
| 53 | Essa operação só pode ser realizada para pedidos do tipo Pedido de Certidão por Matrícula. |
| 54 | A matrícula de um ou mais anexos não foi informada. |
| 55 | Não foi informada a URL de um ou mais arquivos. |
| 60 | Não foi possível desbloquear os arquivos. |
| 101–105 | Erros de cadastro/validação de arquivo |
| 501 | Campos obrigatórios não informados. |
| 502 | Já existe resposta; aguardando download dos arquivos pelo ONR. |

## Implementação neste projeto

- Python: [`scripts/SetPedidoMatriculaRespondidoPo/setPedidoMatriculaRespondidoPo.py`](../../scripts/SetPedidoMatriculaRespondidoPo/setPedidoMatriculaRespondidoPo.py)
- JavaScript: [`scripts/SetPedidoMatriculaRespondidoPo/setPedidoMatriculaRespondidoPo.js`](../../scripts/SetPedidoMatriculaRespondidoPo/setPedidoMatriculaRespondidoPo.js)
- Variáveis `.env`: `PENHORA_ONLINE_SET_PEDIDO_MATRICULA_RESPONDIDO_*` (fallback `PENHORA_ONLINE_ID_PEDIDO`)
- npm: `npm run set-pedido-matricula-respondido-po`

## Referências

- [`webservice/hash.md`](../hash.md) — geração do `Hash`
- [`webservice/list-metodos.md`](../list-metodos.md)
- [`webservice/tabelas-dominio/`](../tabelas-dominio/README.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — Envelope de Entrada/Saída `SetPedidoMatriculaRespondidoPO`
