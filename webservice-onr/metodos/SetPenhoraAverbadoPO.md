# SetPenhoraAverbadoPO

Método do WSOficio — **3.3 Penhora Online**.

## Resumo

| Campo | Valor |
|-------|-------|
| Tipo | Atualização / comando |
| Módulo | 3.3 Penhora Online |
| Operação SOAP | `SetPenhoraAverbadoPO` |

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
| 4 | Chamar `SetPenhoraAverbadoPO` passando `Hash` + demais parâmetros |

Implementação: [`lib/onr_hash.py`](../../lib/onr_hash.py) · Helper: `resolve_auth_hash()` em [`lib/onr_acompanhamento.py`](../../lib/onr_acompanhamento.py).

Erros comuns: **45** (hash inválido), **46** (token já usado), **47** (expirado) — ver tabela em [`../hash.md`](../hash.md).

## Pré-requisitos e validações de negócio

- **[IDTipoPedido = 3](../tabelas-dominio/IDTipoPedido-PO.md)** — erro **53**.
- Prenotação e pagamento conforme spec (erros **54–56**).
- Ao menos uma certidão (`CertidaoPenhora`) com URL pública; spec **.p7s** (homolog pode aceitar `.pdf`).

## Ordem do envelope (`oRequest`)

Tipo `SetPenhoraAverbadoPO_WSReq` (ordem usada nos scripts):

1. `Hash`
2. `IDPedido`
3. `Resposta`
4. `CertidaoPenhora`

## Parâmetros de entrada

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `Hash` | Hash de autenticação | string | sim | — | _(SHA-1)_ |
| `IDPedido` | Pedido penhora | int | sim | IDTipoPedido=3 | 18014820 |
| `Resposta` | Texto da resposta | string | sim | — | Penhora averbada conforme mandado. |
| `CertidaoPenhora` | Lista de certidões | ArrayOf… | sim | — | — |
| `CertidaoPenhora[].Matricula` | Matrícula | string | sim | por item | 12345 |
| `CertidaoPenhora[].URLArquivo` | URL do arquivo | string | sim | por item | https://…/doc.p7s |

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
| 14 | Não foi informada nenhuma certidão de penhora. |
| 45 | Hash inválido. |
| 46 | Hash inválido: Hash já utilizado. |
| 47 | Hash inválido: Hash expirado. |
| 51 | Não foi possível pegar os dados do pedido. Certifique-se que o pedido é do tipo Penhora. |
| 52 | Usuário não tem permissão para cadastrar resposta para esse pedido. |
| 53 | Essa operação só pode ser realizada para pedidos do tipo Penhora. |
| 54 | Pedido ainda sem prenotação. |
| 55 | Esse pedido já foi respondido. |
| 56 | Pedido ainda sem confirmação de pagamento. |

## Implementação neste projeto

- Python: [`scripts/SetPenhoraAverbadoPo/setPenhoraAverbadoPo.py`](../../scripts/SetPenhoraAverbadoPo/setPenhoraAverbadoPo.py)
- JavaScript: [`scripts/SetPenhoraAverbadoPo/setPenhoraAverbadoPo.js`](../../scripts/SetPenhoraAverbadoPo/setPenhoraAverbadoPo.js)
- Variáveis `.env`: `PENHORA_ONLINE_SET_PENHORA_AVERBADO_*`, `CERTIDOES_JSON`
## Referências

- [`webservice/hash.md`](../hash.md) — geração do `Hash`
- [`webservice/list-metodos.md`](../list-metodos.md)
- [`webservice/tabelas-dominio/`](../tabelas-dominio/README.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — Envelope de Entrada/Saída `SetPenhoraAverbadoPO`
