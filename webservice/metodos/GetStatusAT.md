# GetStatusAT

Método do WSOficio — **3.2 Acompanhamento de Títulos**.

## Resumo

| Campo | Valor |
|-------|-------|
| Tipo | Consulta |
| Módulo | 3.2 Acompanhamento de Títulos |
| Operação SOAP | `GetStatusAT` |

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
| 4 | Chamar `GetStatusAT` passando `Hash` + demais parâmetros |

Implementação: [`lib/onr_hash.py`](../../lib/onr_hash.py) · Helper: `resolve_auth_hash()` em [`lib/onr_acompanhamento.py`](../../lib/onr_acompanhamento.py).

Erros comuns: **45** (hash inválido), **46** (token já usado), **47** (expirado) — ver tabela em [`../hash.md`](../hash.md).

## Parâmetros de entrada

| Parâmetro | Descrição |
|-----------|-----------|
| `Hash` | Hash para validação da mensagem – tipo string(50); |
| `IDStatus` | Código do cadastro de status – tipo int; |

## Parâmetros de saída

| Parâmetro | Descrição |
|-----------|-----------|
| `RETORNO` | Indica se houve erro ou não na execução do método – tipo boolean; |
| `CODIGOERRO` | (se RETORNO = false) Código do erro – tipo int; |
| `ERRODESCRICAO` | (se RETORNO = false) Descrição do erro – tipo string(200); |
| `Protocolo` | (se RETORNO = true)  Protocolo do título – tipo string(11); |
| `ValorDeposito` | (se RETORNO = true)  Valor do depósito – tipo decimal; |
| `ValorEmolumentos` | (se RETORNO = true)  Valor dos emolumentos – tipo decimal; |
| `ApresentanteNome` | (se RETORNO = true)  Nome do apresentante – tipo string(120); |
| `ApresentanteCPFCNPJ` | (se RETORNO = true)  CPF/CNPJ do apresentante – tipo string(14); |
| `ApresentanteEmail` | (se RETORNO = true)  E-mail do apresentante – tipo string(120); |
| `ModoNotificacaoStatus` | (se RETORNO = true)  Modo de notificação – tipo string(1). Se for retornado uma string vazia, nenhum modo de notificação foi informado.  Valores possíveis: |
| `ApresentanteDDDTelefone` | (se RETORNO = true)  DDD do telefone do apresentante – tipo string(4); |
| `ApresentanteNumeroTelefone` | (se RETORNO = true)  Número do telefone do apresentante – tipo string(15); |
| `DataProtocolo` | (se RETORNO = true)  Data do protocolo, formato: aaaa-mm-ddhh:mm:ss – tipo string(19); |
| `DataPrevisaoEntrega` | (se RETORNO = true)  Data de previsão de entrega, formato: aaaa-mmddhh:mm:ss – tipo string(19); |
| `IDTipoStatus` | (se RETORNO = true)  Código do tipo de status – verificar tipos possíveis no item 3.2.1 – tipo int. |
| `DataStatus` | (se RETORNO = true)  Data do Status, formato: aaaa-mm-ddhh:mm:ss – tipo string(19); |
| `DescricaoStatus` | (se RETORNO = true) Descrição do Status – tipo text; |
| `NaturezaTitulo` | (se RETORNO = true)  Natureza do título – tipo string(150); |
| `InteressadoNome` | (se RETORNO = true)  Nome do interessado – tipo string(120); |
| `InteressadoCPFCNPJ` | (se RETORNO = true)  CPF/CNPJ do interessado – tipo string(14); |
| `CodigoVerificador` | (se RETORNO = true)  Código verificador – tipo string(20); |
| `TipoSolicitacao` | (se RETORNO = true)  Tipo da solicitação – tipo int. Valores possíveis: |

## Códigos de erro (amostra)

| Código | Descrição |
|--------|-----------|
| 0 | Erro de sistema. |
| 10 | Request inválido. |
| 11 | O Hash de validação não foi informado. |
| 12 | O IDStatus informado é inválido. |
| 1 | Não foi possível pegar os dados do título. |
| 45 | Hash inválido. |
| 46 | Hash inválido: Hash já utilizado. |
| 47 | Hash inválido: Hash expirado. |
| 50 | Usuário não tem permissão para acessar o Status informado. |

## Implementação neste projeto

- Script: [`scripts/GetStatusAt/getStatusAt.py`](../../scripts/GetStatusAt/getStatusAt.py)

## Referências

- [`webservice/hash.md`](../hash.md) — geração do `Hash`
- [`webservice/list-metodos.md`](../list-metodos.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — Envelope de Entrada/Saída `GetStatusAT`
