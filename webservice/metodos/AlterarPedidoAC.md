# AlterarPedidoAC

Método do WSOficio — **3.10 E-Protocolo**.

## Resumo

| Campo | Valor |
|-------|-------|
| Tipo | Alteração |
| Módulo | 3.10 E-Protocolo |
| Operação SOAP | `AlterarPedidoAC` |

## Serviço

- **WSDL (homologação):** `https://hml3-wsoficio.onr.org.br/eprotocolo.asmx?wsdl`
- **Endpoint:** `https://hml3-wsoficio.onr.org.br/eprotocolo.asmx`
- **WSDL local:** `wsdl/eprotocolo.wsdl`

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
| 4 | Chamar `AlterarPedidoAC` passando `Hash` + demais parâmetros |

Implementação: [`lib/onr_hash.py`](../../lib/onr_hash.py) · Helper: `resolve_auth_hash()` em [`lib/onr_acompanhamento.py`](../../lib/onr_acompanhamento.py).

Erros comuns: **45** (hash inválido), **46** (token já usado), **47** (expirado) — ver tabela em [`../hash.md`](../hash.md).

## Parâmetros de entrada

| Parâmetro | Descrição |
|-----------|-----------|
| `Hash` | Hash para validação da mensagem (tipo string(50)); |
| — | IDContrato - ID do contrato obtido da listagem de pedidos (tipo int); |
| — | TipoDocumento - Tipo de contrato a ser alterado, onde 1 = Escritura Pública (tipo int); |
| — | ApresentanteNome - Nome do apresentante vinculado ao contrato (tipo string); |
| — | ApresentanteEmail - E-mail do apresentante vinculado ao contrato (tipo string); |
| — | EnderecoVia - Via referente ao endereço do apresentante vinculado ao contrato (Rua, Avenida, etc) (tipo string(20)); |
| — | EnderecoLogradouro - Logradouro referente ao endereço do apresentante vinculado ao contrato (tipo string); |
| — | EnderecoNumero - Número referente ao endereço do apresentante vinculado ao contrato (tipo int); |
| — | EnderecoComplemento - Complemento referente ao endereço do apresentante vinculado ao contrato (tipo string); |
| — | EnderecoBairro - Bairro referente ao endereço do apresentante vinculado ao contrato (tipo string); |
| `EnderecoUF` | UF do Estado referente ao endereço do apresentante vinculado ao contrato (tipo string(2)); |
| — | EnderecoCidade - Cidade referente ao endereço do apresentante vinculado ao contrato (tipo string); |
| — | EnderecoCEP - CEP referente ao endereço do apresentante vinculado ao contrato (tipo int); |
| — | ContatoDDD - DDD referente ao telefone de contato do apresentante vinculado ao contrato (tipo string); |
| — | ContatoTelefone - Telefone de contato (sem DDD) do apresentante vinculado ao contrato (tipo |

## Parâmetros de saída

| Parâmetro | Descrição |
|-----------|-----------|
| `RETORNO` | Indica se houve erro ou não na execução do método (tipo boolean); |
| `CODIGOERRO` | (se RETORNO = false) Código do erro (tipo int); |
| `ERRODESCRICAO` | (se RETORNO = false) Descrição do erro (tipo string(200)). |

## Códigos de erro (amostra)

| Código | Descrição |
|--------|-----------|
| 0 | Erro de sistema. |
| 10 | Request inválido. |
| 11 | O Hash de validação não foi informado. |
| 12 | O código informado para o contrato não é válido. |
| 45 | Hash inválido. |
| 46 | Hash inválido: Hash já utilizado. |
| 47 | Hash inválido: Hash expirado. |
| 51 | Não foi possível recuperar o contrato para edição. |
| 55 | Usuário não tem permissão para consultar o pedido da instituição informada. |

## Implementação neste projeto

- Script: _(ainda não implementado)_

## Referências

- [`webservice/hash.md`](../hash.md) — geração do `Hash`
- [`webservice/list-metodos.md`](../list-metodos.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — Envelope de Entrada/Saída `AlterarPedidoAC`
