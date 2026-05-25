# SetPenhoraExigenciaPO

Método do WSOficio — **3.3 Penhora Online**.

## Resumo

| Campo | Valor |
|-------|-------|
| Tipo | Atualização / comando |
| Módulo | 3.3 Penhora Online |
| Operação SOAP | `SetPenhoraExigenciaPO` |

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
| 4 | Chamar `SetPenhoraExigenciaPO` passando `Hash` + demais parâmetros |

Implementação: [`lib/onr_hash.py`](../../lib/onr_hash.py) · Helper: `resolve_auth_hash()` em [`lib/onr_acompanhamento.py`](../../lib/onr_acompanhamento.py).

Erros comuns: **45** (hash inválido), **46** (token já usado), **47** (expirado) — ver tabela em [`../hash.md`](../hash.md).

## Pré-requisitos e validações de negócio

- **[IDTipoPedido = 3](../tabelas-dominio/IDTipoPedido-PO.md)**.
- Pedido prenotado; **não** respondido (IDStatus 2/5/14) — ver `lib/onr_penhora_exigencia.validatePedidoForExigencia`.
- Pré-checagem opcional via `GetPedidoPO` no script.

## Ordem do envelope (`oRequest`)

Tipo `SetPenhoraExigenciaPO_WSReq` (ordem usada nos scripts):

1. `Hash`
2. `IDPedido`
3. `Resposta`
4. `Anexos`

## Parâmetros de entrada

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `Hash` | Hash de autenticação | string | sim | — | _(SHA-1)_ |
| `IDPedido` | Pedido penhora | int | sim | IDTipoPedido=3 | 18014871 |
| `Resposta` | Texto da nota de exigência | string | sim | — | Segue nota de exigência… |
| `Anexos` | Anexos da exigência | ArrayOf… | sim | — | — |
| `Anexos[].Nome` | Nome do anexo | string | sim | por item | Nota de exigência |
| `Anexos[].URLArquivo` | URL pública | string | sim | por item | https://…/doc.pdf |

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
| 51 | Não foi possível pegar os dados do pedido. Certifique-se que o pedido é do tipo Penhora. |
| 52 | Usuário não tem permissão para cadastrar resposta para esse pedido. |
| 53 | Essa operação só pode ser realizada para pedidos do tipo Penhora. |
| 54 | Pedido ainda sem prenotação. |
| 55 | O nome de um ou mais anexos não foi informado. |
| 56 | Não foi informada a URL de um ou mais arquivos. |
| … | _+8 códigos na especificação_ |

## Implementação neste projeto

- Python: [`scripts/SetPenhoraExigenciaPo/setPenhoraExigenciaPo.py`](../../scripts/SetPenhoraExigenciaPo/setPenhoraExigenciaPo.py)
- JavaScript: [`scripts/SetPenhoraExigenciaPo/setPenhoraExigenciaPo.js`](../../scripts/SetPenhoraExigenciaPo/setPenhoraExigenciaPo.js)
- Variáveis `.env`: `PENHORA_ONLINE_SET_PENHORA_EXIGENCIA_*`, `ANEXOS_JSON`
- Helper: `lib/onr_penhora_exigencia`
- `findEligiblePedido.py`
## Referências

- [`webservice/hash.md`](../hash.md) — geração do `Hash`
- [`webservice/list-metodos.md`](../list-metodos.md)
- [`webservice/tabelas-dominio/`](../tabelas-dominio/README.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — Envelope de Entrada/Saída `SetPenhoraExigenciaPO`
