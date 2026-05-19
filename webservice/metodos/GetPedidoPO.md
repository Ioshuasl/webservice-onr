# GetPedidoPO

Método do WSOficio — **3.3 Penhora Online**.

## Resumo

| Campo | Valor |
|-------|-------|
| Tipo | Consulta |
| Módulo | 3.3 Penhora Online |
| Operação SOAP | `GetPedidoPO` |

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
| 4 | Chamar `GetPedidoPO` passando `Hash` + demais parâmetros |

Implementação: [`lib/onr_hash.py`](../../lib/onr_hash.py) · Helper: `resolve_auth_hash()` em [`lib/onr_acompanhamento.py`](../../lib/onr_acompanhamento.py).

Erros comuns: **45** (hash inválido), **46** (token já usado), **47** (expirado) — ver tabela em [`../hash.md`](../hash.md).

## Parâmetros de entrada

| Parâmetro | Descrição |
|-----------|-----------|
| `Hash` | Hash para validação da mensagem (tipo string); |
| `IDPedido` | Código do pedido (tipo int); |

## Parâmetros de saída

| Parâmetro | Descrição |
|-----------|-----------|
| `RETORNO` | Indica se houve erro ou não na execução do método (tipo boolean); |
| `CODIGOERRO` | (se RETORNO = false) Código do erro (tipo int); |
| `ERRODESCRICAO` | (se RETORNO = false) Descrição do erro (tipo string); |
| `IDTipoPedido` | (se RETORNO = true)  Código do tipo do pedido – verificar tipos possíveis no item 3.3.1 - (tipo int); |
| `IDStatus` | (se RETORNO = true)  Código do status do pedido – verificar tipos possíveis no item 3.3.1 - (tipo int); |
| `IDProcesso` | (se RETORNO = true)  Código do processo (tipo int); |
| `IDVara` | (se RETORNO = true)  Código da Vara (tipo int); |
| `IDBoleto` | (se RETORNO = true) Código do boleto, se existir. Se não existir retorna 0 (zero) (tipo int); |
| `Protocolo` | (se RETORNO = true) Protocolo do pedido (tipo string); |
| `NumeroProcesso` | (se RETORNO = true) Número do processo (tipo string); |
| `Observacao` | (se RETORNO = true) Observações (tipo string); |
| `DataSolicitacao` | (se RETORNO = true)  Data da solicitação, formato: aaaa-mm-ddhh:mm:ss (tipo string); |
| `TipoResposta` | (se RETORNO = true e se foi respondido)  Tipo da resposta (tipo string). Valores possíveis: |
| `Negativa` | (se RETORNO = true e se foi respondido) Indica se a resposta foi negativa (tipo boolean); |
| `Resposta` | (se RETORNO = true e se foi respondido) Descrição da resposta (tipo string); |
| `DataResposta` | (se RETORNO = true e se foi respondido)  Data da Resposta, formato: aaaa-mmddhh:mm:ss (tipo string); |
| `MotivoDevolucao` | (se RETORNO = true e se foi respondido)  Motivo da devolução, caso a resposta tenha sido devolução (tipo string); |
| `Pago` | (se RETORNO = true) Indica se o pedido foi pago (tipo boolean); |
| `ValorCustas` | (se RETORNO = true e IDTipoPedido = 3) Valor das custas. Retorna 0 (zero) se o cartório ainda não informou as custas (tipo decimal); |
| `ValorBoletoAnexado` | (se RETORNO = true e IDTipoPedido = 3)  Valor do boleto anexado. Apenas para cartórios de Estados que permitem o anexo de boletos. Retorna 0 (zero) se o cartório ainda não anexou o boleto (tipo decimal); |
| `NumeroPrenotacao` | (se RETORNO = true e IDTipoPedido = 3 e se foi prenotado) Número da prenotação (tipo string); |
| `DataPrenotacao` | (se RETORNO = true e IDTipoPedido = 3 e se foi prenotado) Data da prenotação, formato: aaaa-mm-ddhh:mm:ss (tipo string); |
| `DataVencimentoPrenotacao` | (se RETORNO = true e IDTipoPedido = 3 e se foi prenotado) Data de vencimento da prenotação, formato: aaaa-mm-ddhh:mm:ss (tipo string); |
| `AdvogadoNome` | (se RETORNO = true e IDTipoPedido = 3)  Nome do advogado (tipo string); |
| `AdvogadoTelefone` | (se RETORNO = true e IDTipoPedido = 3) Telefone do advogado (tipo string); |
| `AdvogadoEmail` | (se RETORNO = true e IDTipoPedido = 3) E-mail do advogado (tipo string); |
| `ParteID` | (se RETORNO = true e IDTipoPedido = 3) Código da Parte (tipo int); |
| `ParteNome` | (se RETORNO = true e IDTipoPedido = 3) Nome da Parte (tipo string); |
| `ParteIDTipo` | (se RETORNO = true e IDTipoPedido = 3) Tipo da Parte (tipo int). Valores possíveis: `o` 1 = Pessoa física |
| `ParteCPFCNPJ` | (se RETORNO = true e IDTipoPedido = 3) CPF ou CNPJ da Parte (tipo string); |
| `Matricula` | (se RETORNO = true e IDTipoPedido = 1) Matrícula solicitada (tipo string); |
| `ImoveisDireitos` | (se RETORNO = true e IDTipoPedido = 1 ou 2) Indica se deve “Informar também os imóveis/direitos que foram transferidos” (tipo boolean); |
| `DataTransferencia` | (se RETORNO = true e IDTipoPedido = 1 ou 2 e ImoveisDireitos = true) Data da transferência, formato: aaaa-mm-ddhh:mm:ss (tipo string); |
| `Arquivo` | (se RETORNO = true e IDTipoPedido = 3) URL do Mandado ou Certidão (tipo string); |
| `TipoArquivo` | (se RETORNO = true e IDTipoPedido = 3) Tipo do arquivo (tipo string). Valores possíveis: |

## Códigos de erro (amostra)

| Código | Descrição |
|--------|-----------|
| 0 | Erro de sistema. |
| 10 | Request inválido. |
| 11 | O Hash de validação não foi informado. |
| 12 | O IDPedido informado é inválido. |
| 45 | Hash inválido. |
| 46 | Hash inválido: Hash já utilizado. |
| 47 | Hash inválido: Hash expirado. |
| 51 | Não foi possível verificar o tipo de pedido. |
| 52 | Não foi possível obter os dados do pedido de matrícula. |
| 53 | Não foi possível obter os dados do pedido de pessoa. |
| 54 | Não foi possível obter os dados do pedido de penhora. |
| 55 | Não foi possível obter o mandado/certidão. |
| 56 | Usuário não tem permissão para acessar o pedido informado. |
| 57 | O pedido informado não foi encontrado. |

## Implementação neste projeto

- Script Python: [`scripts/GetPedidoPo/getPedidoPo.py`](../../scripts/GetPedidoPo/getPedidoPo.py)
- Script JavaScript: [`scripts/GetPedidoPo/getPedidoPo.js`](../../scripts/GetPedidoPo/getPedidoPo.js)
- Lib: [`lib/onr_penhora_online.py`](../../lib/onr_penhora_online.py) · [`lib/onr_penhora_online.js`](../../lib/onr_penhora_online.js)
- Variável `.env`: `PENHORA_ONLINE_ID_PEDIDO` (ID retornado por `ListPedidosPO`)

## Referências

- [`webservice/hash.md`](../hash.md) — geração do `Hash`
- [`webservice/list-metodos.md`](../list-metodos.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — Envelope de Entrada/Saída `GetPedidoPO`
