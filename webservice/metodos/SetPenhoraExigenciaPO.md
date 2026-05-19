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
| 4 | Chamar `SetPenhoraExigenciaPO` passando `Hash` + demais parâmetros |

Implementação: [`lib/onr_hash.py`](../../lib/onr_hash.py) · Helper: `resolve_auth_hash()` em [`lib/onr_acompanhamento.py`](../../lib/onr_acompanhamento.py).

Erros comuns: **45** (hash inválido), **46** (token já usado), **47** (expirado) — ver tabela em [`../hash.md`](../hash.md).

## Parâmetros de entrada

| Parâmetro | Descrição |
|-----------|-----------|
| `Hash` | Hash para validação da mensagem (tipo string); |
| `IDPedido` | Código do pedido (tipo int); Resposta – Resposta do pedido (tipo string); |
| `Nome` | Nome que descreve o arquivo (tipo string); |
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

- Script Python: [`scripts/SetPenhoraExigenciaPo/setPenhoraExigenciaPo.py`](../../scripts/SetPenhoraExigenciaPo/setPenhoraExigenciaPo.py)
- Script JavaScript: [`scripts/SetPenhoraExigenciaPo/setPenhoraExigenciaPo.js`](../../scripts/SetPenhoraExigenciaPo/setPenhoraExigenciaPo.js)
- Lib: [`lib/onr_penhora_online.py`](../../lib/onr_penhora_online.py) · [`lib/onr_penhora_online.js`](../../lib/onr_penhora_online.js)
- Variáveis `.env`: `PENHORA_ONLINE_SET_PENHORA_EXIGENCIA_RESPOSTA`, anexos via `NOME`+`URL_ARQUIVO` ou `ANEXOS_JSON`
- Pré-validação `GetPedidoPO`: bloqueia pedido já respondido (status 2/5/14 ou campo `Resposta` preenchido); evita `InvalidCastException` do servidor
- **Atenção:** pedido Penhora prenotado e sem resposta (ex. IDStatus 9 ou 10); anexos `.pdf` ou `.p7s` em URL pública; ver **502**
- Variante DocID (`SetPenhoraExigenciaPO_DocID`) não implementada neste projeto

## Referências

- [`webservice/hash.md`](../hash.md) — geração do `Hash`
- [`webservice/list-metodos.md`](../list-metodos.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — Envelope de Entrada/Saída `SetPenhoraExigenciaPO`
