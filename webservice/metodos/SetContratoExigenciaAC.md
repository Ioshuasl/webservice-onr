# SetContratoExigenciaAC

Método do WSOficio — **3.10 E-Protocolo**.

## Resumo

| Campo | Valor |
|-------|-------|
| Tipo | Atualização / comando |
| Módulo | 3.10 E-Protocolo |
| Operação SOAP | `SetContratoExigenciaAC` |

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
| 4 | Chamar `SetContratoExigenciaAC` passando `Hash` + demais parâmetros |

Implementação: [`lib/onr_hash.py`](../../lib/onr_hash.py) · Helper: `resolve_auth_hash()` em [`lib/onr_acompanhamento.py`](../../lib/onr_acompanhamento.py).

Erros comuns: **45** (hash inválido), **46** (token já usado), **47** (expirado) — ver tabela em [`../hash.md`](../hash.md).

## Parâmetros de entrada

| Parâmetro | Descrição |
|-----------|-----------|
| `Hash` | Hash para validação da mensagem (tipo string(50)); |
| — | IDContrato - ID do contrato obtido da listagem de pedidos (tipo int); |
| `ExigenciaFinal` | Quando um contrato do tipo de serviço Exame/Cálculo, a exigência final corresponde ao último ato cadastrado (impossibilitando cadastro de novas exigências), informando inclusive o valor do contrato se alterado posteriormente para Registro/Averbação (tipo boolean); |
| `Resposta` | Resposta a ser adicionada na exigência do contrato (tipo string); |
| `Descricao` | Nome que descreve o arquivo (tipo string); |
| `URLArquivo` | URL do arquivo. O cartório precisa informar uma URL válida para download do arquivo anexado. Os arquivos informados serão colocados em uma fila e serão baixados posteriormente pelo sistema. O pedido não será efetivamente respondido antes que todos os arquivos sejam baixados. (tipo string). |

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
| 13 | A Resposta não foi informada. |
| 14 | Não foi informado nenhum anexo para vincular à exigência. |
| 45 | Hash inválido. |
| 46 | Hash inválido: Hash já utilizado. |
| 47 | Hash inválido: Hash expirado. |
| 51 | Não foi possível recuperar o contrato para prosseguir com a resposta. |
| 52 | Usuário não tem permissão para alterar esse contrato. |
| 53 | Esse contrato já foi respondido com averbação ou devolução. |

## Implementação neste projeto

- Script: _(ainda não implementado)_

## Referências

- [`webservice/hash.md`](../hash.md) — geração do `Hash`
- [`webservice/list-metodos.md`](../list-metodos.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — Envelope de Entrada/Saída `SetContratoExigenciaAC`
