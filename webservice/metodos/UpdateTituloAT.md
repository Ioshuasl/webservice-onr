# UpdateTituloAT

Método do WSOficio — **3.2 Acompanhamento de Títulos**.

## Resumo

| Campo | Valor |
|-------|-------|
| Tipo | Alteração |
| Módulo | 3.2 Acompanhamento de Títulos |
| Operação SOAP | `UpdateTituloAT` |

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
| 4 | Chamar `UpdateTituloAT` passando `Hash` + demais parâmetros |

Implementação: [`lib/onr_hash.py`](../../lib/onr_hash.py) · Helper: `resolve_auth_hash()` em [`lib/onr_acompanhamento.py`](../../lib/onr_acompanhamento.py).

Erros comuns: **45** (hash inválido), **46** (token já usado), **47** (expirado) — ver tabela em [`../hash.md`](../hash.md).

## Parâmetros de entrada

| Parâmetro | Descrição |
|-----------|-----------|
| `Hash` | Hash para validação da mensagem – tipo string(50); |
| `IDTitulo` | Código do título no Ofício Eletrônico – tipo int. Código obtido no momento do cadastro do título, ver item 3.2.10; |
| `Protocolo` | Protocolo do título – tipo string(11); |
| `ApresentanteNome` | Nome do apresentante –  tipostring(120); |
| `ApresentanteEmail` | E-mail do apresentante –  opcional (obrigatório se ModoNotificacaoStatus = |
| `ApresentanteDDDTelefone` | DDD do telefone do apresentante – opcional (obrigatório se ModoNotificacaoStatus = S) –  tipostring(4); |
| `ApresentanteNumeroTelefone` | Número do telefone do apresentante –  opcional (obrigatório se ModoNotificacaoStatus = S) – tipo string(15); |
| `ApresentanteCPFCNPJ` | CPF/CNPJ do apresentante – opcional – tipo string(14); |
| `ValorDeposito` | Valor do depósito – opcional – tipo decimal; |
| `ValorEmolumentos` | Valor dos emolumentos – opcional – tipo decimal; |
| `DataProtocolo` | Data do protocolo. Formato: aaaa-mm-ddhh:mm:ss – tipo string(19); |
| `DataPrevisaoEntrega` | Data de previsão de entrega . Formato: aaaa-mm-ddhh:mm:ss – tipo string(19); |
| `ModoNotificacaoStatus` | Modo de notificação – tipo string(1). Valores permitidos: |
| `InteressadoNome` | Nome do interessado – tipo string(120); |
| `InteressadoCPFCNPJ` | CPF/CNPJ do interessado – opcional – tipo string(14); |
| `NaturezaTitulo` | Natureza do título – tipo string(150); |
| `CodigoVerificador` | Código verificador – opcional – tipo string(20); |
| `TipoSolicitacao` | Tipo da solicitação - tipo int. Valores permitidos: |

## Parâmetros de saída

| Parâmetro | Descrição |
|-----------|-----------|
| `RETORNO` | Indica se houve erro ou não na execução do método – tipo boolean; |
| `CODIGOERRO` | (se RETORNO = false) Código do erro – tipo int; |
| `ERRODESCRICAO` | (se RETORNO = false) Descrição do erro – tipo string(200). |

## Códigos de erro (amostra)

| Código | Descrição |
|--------|-----------|
| 0 | Erro de sistema. |
| 10 | Request inválido. |
| 11 | O Hash de validação não foi informado. |
| 12 | O código do título informado é inválido. |
| 13 | O nome do apresentante não foi informado. |
| 14 | O CPF/CNPJ do apresentante é inválido. |
| 15 | O nome do interessado não foi informado. |
| 16 | O CPF/CNPJ do interessado é inválido. |
| 17 | A natureza do título não foi informada. |
| 18 | O modo de notificação não foi informado. |
| 19 | O e-mail do apresentante não foi informado. |
| 20 | O telefone do apresentante não foi informado. |
| 21 | A data do protocolo não foi informada. |
| 22 | A data do protocolo é inválida. |
| 23 | A data do protocolo é inválida. Não pode ser anterior |

## Implementação neste projeto

- Script: [`scripts/UpdateTituloAt/updateTituloAt.py`](../../scripts/UpdateTituloAt/updateTituloAt.py)

## Referências

- [`webservice/hash.md`](../hash.md) — geração do `Hash`
- [`webservice/list-metodos.md`](../list-metodos.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — Envelope de Entrada/Saída `UpdateTituloAT`
