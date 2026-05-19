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
- **WSDL local:**`wsdl/penhoraonline.wsdl`

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

## Parâmetros de entrada

| Parâmetro | Descrição |
|-----------|-----------|
| `Hash` | Hash para validação da mensagem (tipo string); |
| `IDPedido` | Código do pedido (tipo int); |
| `Resposta` | Resposta do pedido (tipo string); |
| `Matricula` | Número da matrícula (tipo string); |
| `URLArquivo` | URL do arquivo. O cartório precisa informar uma URL válida para download do arquivo anexado. Os arquivos informados serão colocados em uma fila e serão baixados posteriormente pelo sistema do Ofício Eletrônico. O pedido não será efetivamente respondido antes que todos os arquivos sejam baixados. (tipo string). |

## Parâmetros de saída

| Parâmetro | Descrição |
|-----------|-----------|
| `RETORNO` | Indica se houve erro ou não na execução do método (tipo boolean); |
| `CODIGOERRO` | (se RETORNO = false) Código do erro (tipo int); |
| `ERRODESCRICAO` | (se RETORNO = false) Descrição do erro (tipo string); |

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

- Script Python: [`scripts/SetPenhoraAverbadoPo/setPenhoraAverbadoPo.py`](../../scripts/SetPenhoraAverbadoPo/setPenhoraAverbadoPo.py)
- Script JavaScript: [`scripts/SetPenhoraAverbadoPo/setPenhoraAverbadoPo.js`](../../scripts/SetPenhoraAverbadoPo/setPenhoraAverbadoPo.js)
- Lib: [`lib/onr_penhora_online.py`](../../lib/onr_penhora_online.py) · [`lib/onr_penhora_online.js`](../../lib/onr_penhora_online.js)
- Variáveis `.env`: `PENHORA_ONLINE_SET_PENHORA_AVERBADO_RESPOSTA`, certidões via `MATRICULA`+`URL_ARQUIVO` ou `CERTIDOES_JSON`
- **Atenção:** spec § 3.3.15 cita apenas `.p7s` (erro **104**); em **homologação (hml3)** `.pdf` em URL pública também foi aceito nos testes. Produção: preferir `.p7s`. Pedido só conclui após download pelo ONR (ver **502**)
- Variante DocID (`SetPenhoraAverbadoPO_DocID`) não implementada neste projeto

## Referências

- [`webservice/hash.md`](../hash.md) — geração do `Hash`
- [`webservice/list-metodos.md`](../list-metodos.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — Envelope de Entrada/Saída `SetPenhoraAverbadoPO`
