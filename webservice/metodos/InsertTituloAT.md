# InsertTituloAT

Método do WSOficio — **3.2 Acompanhamento de Títulos**.

## Resumo

| Campo | Valor |
|-------|-------|
| Tipo | Inclusão |
| Módulo | 3.2 Acompanhamento de Títulos |
| Operação SOAP | `InsertTituloAT` |

## Serviço

- **WSDL (homologação):** `https://hml3-wsoficio.onr.org.br/acompanhamentotitulos.asmx?wsdl`
- **Endpoint:** `https://hml3-wsoficio.onr.org.br/acompanhamentotitulos.asmx`
- **WSDL local:** `wsdl/acompanhamentotitulos.wsdl`

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
| 4 | Chamar `InsertTituloAT` passando `Hash` + demais parâmetros |

Implementação: [`lib/onr_hash.py`](../../lib/onr_hash.py) · Helper: `resolve_auth_hash()` em [`lib/onr_acompanhamento.py`](../../lib/onr_acompanhamento.py).

Erros comuns: **45** (hash inválido), **46** (token já usado), **47** (expirado) — ver tabela em [`../hash.md`](../hash.md).

## Parâmetros de entrada

| Parâmetro | Descrição |
|-----------|-----------|
| `Hash` | Hash para validação da mensagem – tipo string(50); |
| `Protocolo` | Protocolo do título – tipo string(11); |
| `ApresentanteNome` | Nome do apresentante – tipo string(120); |
| `ApresentanteEmail` | E-mail do apresentante – opcional (obrigatório se ModoNotificacaoStatus = E) – tipo string(120); |
| `ApresentanteDDDTelefone` | DDD do telefone do apresentante – opcional (obrigatório se ModoNotificacaoStatus = S) –  tipostring(4); |
| `ApresentanteNumeroTelefone` | Número do telefone do apresentante – opcional (obrigatório se ModoNotificacaoStatus = S) – tipo string(15); |
| `ApresentanteCPFCNPJ` | CPF/CNPJ do apresentante – opcional –  tipostring(14); |
| `ValorDeposito` | Valor do depósito – opcional –  tipo decimal; |
| `ValorEmolumentos` | Valor dos emolumentos – opcional –  tipo decimal; |
| `DataProtocolo` | Data do protocolo. Formato: aaaa-mm-ddhh:mm:ss – tipo string(19); |
| `DataPrevisaoEntrega` | Data de previsão de entrega . Formato: aaaa-mm-ddhh:mm:ss – tipo string(19); |
| `ModoNotificacaoStatus` | Modo de notificação – tipo string(1). Valores permitidos: |
| `InteressadoNome` | Nome do interessado – tipo string(120); |
| `InteressadoCPFCNPJ` | CPF/CNPJ do interessado – opcional –  tipostring(14); |
| `NaturezaTitulo` | Natureza do título – tipo string(150); |
| `CodigoVerificador` | Código verificador – opcional –  tipostring(20); |
| `TipoSolicitacao` | Tipo da solicitação – tipo int. Valores permitidos: |
| `IDTipoStatus` | Código do tipo de status – verificar tipos permitidos no item 3.2.1 – tipo int; |
| `DataStatus` | Data do Status. Formato: aaaa-mm-ddhh:mm:ss – tipo string(19); |
| `DescricaoStatus` | Descrição do Status (obs.: A nota de devolução deve ser informada nesse campo) – opcional –  tipotext. |

## Parâmetros de saída

| Parâmetro | Descrição |
|-----------|-----------|
| `RETORNO` | Indica se houve erro ou não na execução do método – tipo boolean; |
| `CODIGOERRO` | (se RETORNO = false) Código do erro – tipo int; |
| `ERRODESCRICAO` | (se RETORNO = false) Descrição do erro – tipo string(200); |
| `IDTitulo` | (se RETORNO = true)  Código do título cadastrado – tipo int; |
| `IDStatus` | (se RETORNO = true)  Código do status cadastrado – tipo int. |

## Códigos de erro (amostra)

| Código | Descrição |
|--------|-----------|
| 0 | Erro de sistema. |
| 10 | Request inválido. |
| 11 | O Hash de validação não foi informado. |
| 12 | O protocolo não foi informado. |
| 13 | Protocolo inválido. Apenas valores numéricos são permitidos. |
| 14 | O nome do apresentante não foi informado. |
| 15 | O CPF/CNPJ do apresentante é inválido. |
| 16 | O nome do interessado não foi informado. |
| 17 | O CPF/CNPJ do interessado é inválido. |
| 18 | A natureza do título não foi informada. |
| 19 | O modo de notificação não foi informado. |
| 20 | O e-mail do apresentante não foi informado. |
| 21 | O telefone do apresentante não foi informado. |
| 22 | O código do tipo de status informado é inválido. |
| 23 | A data do protocolo não foi informada. |
| … | _+13 códigos na especificação_ |

## Implementação neste projeto

- Script: [`scripts/InsertTituloAt/insertTituloAt.py`](../../scripts/InsertTituloAt/insertTituloAt.py)

## Referências

- [`webservice/hash.md`](../hash.md) — geração do `Hash`
- [`webservice/list-metodos.md`](../list-metodos.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — Envelope de Entrada/Saída `InsertTituloAT`
