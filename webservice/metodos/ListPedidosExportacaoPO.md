# ListPedidosExportacaoPO

Método do WSOficio — **3.3 Penhora Online**.

## Resumo

| Campo | Valor |
|-------|-------|
| Tipo | Listagem |
| Módulo | 3.3 Penhora Online |
| Operação SOAP | `ListPedidosExportacaoPO` |

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
| 4 | Chamar `ListPedidosExportacaoPO` passando `Hash` + demais parâmetros |

Implementação: [`lib/onr_hash.py`](../../lib/onr_hash.py) · Helper: `resolve_auth_hash()` em [`lib/onr_acompanhamento.py`](../../lib/onr_acompanhamento.py).

Erros comuns: **45** (hash inválido), **46** (token já usado), **47** (expirado) — ver tabela em [`../hash.md`](../hash.md).

## Parâmetros de entrada

| Parâmetro | Descrição |
|-----------|-----------|
| `Hash` | Hash para validação da mensagem (tipo string); |
| `Protocolo` | Protocolo a ser filtrado – * opcional (tipo string(20)); |
| `IDVara` | Código da Vara a ser filtrado. Para retornar todos, informar -1. Para obter os códigos das Varas conferir o método ListVarasPO, item 3.3.3 (tipo int); |
| `IDTipoPedido` | Código do tipo do pedido -  verificar tipos possíveis no item 3.3.1 - (tipo int); |
| `IDStatus` | Código do status – verificar tipos possíveis no item 3.3.1 -  (tipo int); |
| `DataSolicitacaoInicial` | Data da solicitação inicial a ser filtrada, formato: aaaa-mm-dd (tipo string); |
| `DataSolicitacaoFinal` | Data da solicitação final a ser filtrada, formato: aaaa-mm-dd (tipo string); |
| `DataRespostaInicial` | Data da resposta inicial a ser filtrada, formato: aaaa-mm-dd – * opcional (tipo string); |
| `DataRespostaFinal` | Data da resposta final a ser filtrada, formato: aaaa-mm-dd – * opcional (tipo string). |

## Parâmetros de saída

| Parâmetro | Descrição |
|-----------|-----------|
| `RETORNO` | Indica se houve erro ou não na execução do método (tipo boolean); |
| `CODIGOERRO` | (se RETORNO = false) Código do erro (tipo int); |
| `ERRODESCRICAO` | (se RETORNO = false) Descrição do erro (tipo string); |
| `IDPedido` | Código do pedido (tipo int); |
| `IDProcesso` | Código do processo (tipo int); |
| `IDTipoPedido` | Código do tipo do pedido – verificar tipos possíveis no item 3.3.1 - (tipo int); |
| `IDStatus` | Código do status – verificar tipos possíveis no item 3.3.1 -  (tipo int); |
| `TipoPenhora` | Se for pedido de penhora (cf. IDTipoPedido), identifica o tipo de penhora (tipo int). Valores possíveis: |
| `TipoCertidao` | Se for pedido de certidão (cf. IDTipoPedido), identifica o tipo de certidão (tipo int). Valores possíveis: |
| `Protocolo` | Protocolo do Pedido (tipo string(20)); |
| `NumeroProcesso` | Número do processo (tipo string(35)); |
| — | DataPed - Data da solicitação, formato: aaaa-mm-ddhh:mm:ss (tipo string); |
| `Estado` | Estado do vara (tipo string(100)); |
| `Comarca` | Comarca da vara (tipo string(100)); |
| `Foro` | Foro da vara (tipo string(100)); |
| `IDVara` | Código da vara (tipo int); |
| `Vara` | Nome da vara (tipo string(100)); |
| ``o` NomePesqPed` | Se for pedidos de certidão, do tipo pessoa (cf. TipoCertidao) – Nome para pesquisa (tipo string(60)); |
| `CPFCNPJ - Se for pedidos de certidão, do tipo pessoa (cf. TipoCertidao)` | CPF ou CNPJ da pessoa pesquisada (tipo string(20)); |
| `Matr1PesqPed - Se for pedidos de certidão, do tipo matrícula (cf. TipoCertidao)` | Número da matrícula (tipo string(30)); |
| `ImoveisDireito` | Se for pedido de certidão (cf. IDTipoPedido) – Imóveis de direito (tipo string(1)). Valores possíveis: |
| `DataTransferencia - Se for pedido de certidão (cf. IDTipoPedido)` | Data de Transferência, formato: aaaa-mm-dd. Obrigatório caso ImoveisDireito = 2 (tipo string); |
| `Mandado` | Se for penhora (cf. IDTipoPedido) – Indica se é mandado ou certidão (tipo string(1)). Valores possíveis: |
| `NaturezaExecucao` | Natureza da execução (tipo string(2)). Valores possíveis: |
| `ValorDaDivida*` | Valor da Divida do pedido (tipo string(20)); |
| `IDGrupoReenvio` | Indica se é um reenvio. Se for maior que “0” significa que o pedido foi reenviado. Para cada reenvio um número diferente é informado. (tipo int); |
| `Usuario` | Nome do usuário do sistema (usuário da Vara) que gerou o pedido (tipo string(100)); |
| `UsuarioCPF` | CPF do usuário do sistema (usuário da Vara) que gerou o pedido (tipo string(11)); |
| `IDParte` | Código da parte no sistema (tipo int); |
| `Nome` | Nome da parte (tipo string(100)); |
| `CPFCNPJ` | CPF ou CNPJ da parte (tipo string(20)); |
| `Qualidade` | Qualidade da parte (tipo string(10)). Valores possíveis: |
| `PassivoPenhora` | Indica se é passivo de penhora (tipo string(1)). Valores possíveis: ● 1 = Sim; |
| `IDImovel` | Código da imóvel no sistema (tipo int); |
| `Proprietario` | Nome do proprietário (tipo string(100)); |
| `Estado` | Estado (UF) do imóvel (tipo string(2)); |
| `Comarca` | Comarca do imóvel (tipo string(100)); |
| `Matricula` | Matrícula do imóvel (tipo string(14)); |
| `Endereco` | Endereço do imóvel (tipo string(150)); |
| `Bairro` | Bairro do imóvel (tipo string(50)); |
| … | _+17 parâmetros — ver especificação_ |

## Códigos de erro (amostra)

| Código | Descrição |
|--------|-----------|
| 0 | Erro de sistema. |
| 10 | Request inválido. |
| 11 | O Hash de validação não foi informado. |
| 14 | A Vara informada é inválida. |
| 15 | O tipo do pedido informado é inválido. |
| 16 | O Status informado é inválido. |
| 17 | A data de solicitação inicial não foi informada. |
| 18 | A data de solicitação final não foi informada. |
| 19 | A data de solicitação inicial é inválida. |
| 20 | A data de solicitação final é inválida. |
| 21 | O período da data de solicitação não pode ser maior que 30 dias. |
| 22 | A data de resposta inicial é inválida. |
| 23 | A data de resposta final é inválida. |
| 45 | Hash inválido. |
| 46 | Hash inválido: Hash já utilizado. |
| … | _+2 códigos na especificação_ |

## Implementação neste projeto

- Script: _(ainda não implementado)_

## Referências

- [`webservice/hash.md`](../hash.md) — geração do `Hash`
- [`webservice/list-metodos.md`](../list-metodos.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — Envelope de Entrada/Saída `ListPedidosExportacaoPO`
