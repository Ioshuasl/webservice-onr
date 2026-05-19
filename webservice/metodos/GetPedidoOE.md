# GetPedidoOE

Método do WSOficio — **3.5 Ofícios**.

## Resumo

| Campo | Valor |
|-------|-------|
| Tipo | Consulta |
| Módulo | 3.5 Ofícios |
| Operação SOAP | `GetPedidoOE` |

## Serviço

- **WSDL (homologação):** `https://hml3-wsoficio.onr.org.br/oficios.asmx?wsdl`
- **Endpoint:** `https://hml3-wsoficio.onr.org.br/oficios.asmx`
- **WSDL local:** `wsdl/oficios.wsdl`

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
| 4 | Chamar `GetPedidoOE` passando `Hash` + demais parâmetros |

Implementação: [`lib/onr_hash.py`](../../lib/onr_hash.py) · Helper: `resolve_auth_hash()` em [`lib/onr_acompanhamento.py`](../../lib/onr_acompanhamento.py).

Erros comuns: **45** (hash inválido), **46** (token já usado), **47** (expirado) — ver tabela em [`../hash.md`](../hash.md).

## Parâmetros de entrada

| Parâmetro | Descrição |
|-----------|-----------|
| `Hash` | Hash para validação da mensagem (tipo string); |
| `IDPedido` | Código do pedido (tipo int). |

## Parâmetros de saída

| Parâmetro | Descrição |
|-----------|-----------|
| `RETORNO` | Indica se houve erro ou não na execução do método (tipo boolean); |
| `CODIGOERRO` | (se RETORNO = false) Código do erro (tipo int); |
| `ERRODESCRICAO` | (se RETORNO = false) Descrição do erro (tipo string); |
| — | IDPedido - (se RETORNO = true) Código do pedido (tipo int); |
| — | IDStatus - (se RETORNO = true) Código do status (tipo int). Valores possíveis: |
| `11 = Aguardando Pagto` | Vencido |
| — | IDInstituicao - (se RETORNO = true) Código da Instituição solicitante (tipo int); |
| — | Instituicao - (se RETORNO = true) Nome da Instituição solicitante (tipo string); |
| — | Departamento - (se RETORNO = true) Departamento da Instituição solicitante (tipo string); |
| — | IDUsuario - (se RETORNO = true) Código do usuário solicitante (tipo int); |
| — | Usuario - (se RETORNO = true) Nome do usuário solicitante (tipo string); |
| — | IDTipoPesquisa - (se RETORNO = true) Código do tipo da pesquisa (tipo int). Valores possíveis: |
| — | IDTipoCertidao - (se RETORNO = true) Código do tipo de certidão (tipo int). Valores possíveis: |
| — | Protocolo - (se RETORNO = true) Protocolo do pedido (tipo string); |
| — | Ticket - (se RETORNO = true) Ticket do pedido (tipo int); |
| — | NumeroOficio - (se RETORNO = true) Número do Ofício (tipo string); |
| — | DataSolicitacao - (se RETORNO = true) Data do pedido, formato: aaaa-mm-dd (tipo string); |
| — | DataResposta - (se RETORNO = true) Data da resposta, formato: aaaa-mm-dd (tipo string); |
| — | Resposta - (se RETORNO = true) Resposta (tipo string); |
| — | Retransmitido - (se RETORNO = true) true/false indicando se o pedido foi retransmitido (tipo boolean); |
| — | TipoPessoa - (se RETORNO = true) Tipo da pessoa (tipo int). Valores possíveis: |
| — | NomeRazao - (se RETORNO = true) Nome ou Razão (tipo string); |
| — | CPFCNPJ - (se RETORNO = true) CPF ou CNPJ (tipo string); |
| — | RGIE - (se RETORNO = true) RG ou IE (tipo string); |
| — | ImoveisDireitos - (se RETORNO = true) (tipo int). Valores possíveis: |
| — | DataTransferencia - (se RETORNO = true) Data da transferência, formato: aaaa-mm-dd (tipo string); |
| — | Observacoes - (se RETORNO = true) Observações (tipo string); |
| — | Matricula - (se RETORNO = true) Número da Matrícula (tipo string); |
| — | Transcricao - (se RETORNO = true) Número da Transcrição (tipo string); |
| — | DataTranscricao - (se RETORNO = true) Data da transcrição, formato: aaaa-mm-dd (tipo string); |
| — | LivroNumero - (se RETORNO = true) Número do Livro (tipo string); |
| — | Endereco - (se RETORNO = true) Endereço (tipo string); |
| — | Numero - (se RETORNO = true) Número do Endereço (tipo string); |
| — | Complemento - (se RETORNO = true) Complemento do Endereço (tipo string); |
| — | CEP - (se RETORNO = true) CEP do Endereço (tipo string); |
| — | Edificio - (se RETORNO = true) Nome do edifício (tipo string); |
| — | Apartamento - (se RETORNO = true) Número do Apartamento (tipo string); |
| — | ComplementoApto - (se RETORNO = true) Complemento do Edifício (tipo string); |
| — | Loteamento - (se RETORNO = true) Loteamento (tipo string); |
| — | Lote - (se RETORNO = true) Lote (tipo string); |
| … | _+6 parâmetros — ver especificação_ |

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
| 51 | Não foi possível pegar os dados do pedido. |
| 56 | Usuário não tem permissão para acessar o pedido informado. |

## Implementação neste projeto

- Script: _(ainda não implementado)_

## Referências

- [`webservice/hash.md`](../hash.md) — geração do `Hash`
- [`webservice/list-metodos.md`](../list-metodos.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — Envelope de Entrada/Saída `GetPedidoOE`
