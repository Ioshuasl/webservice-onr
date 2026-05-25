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

## Pré-requisitos e validações de negócio

- Envelope completo na ordem WSDL — opcionais omitidos podem gerar erro **0** / `IDMsg` (.NET).
- [ModoNotificacaoStatus](../tabelas-dominio/ModoNotificacaoStatus-AT.md): `E` exige e-mail; `S` exige DDD e telefone.
- [TipoSolicitacao](../tabelas-dominio/TipoSolicitacao-AT.md) e [IDTipoStatus](../tabelas-dominio/IDTipoStatus-AT.md) no status inicial.

## Ordem do envelope (`oRequest`)

Tipo `InsertTituloAT_WSReq` (ordem usada nos scripts):

1. `Hash`
2. `Protocolo`
3. `ApresentanteNome`
4. `ApresentanteEmail`
5. `ApresentanteDDDTelefone`
6. `ApresentanteNumeroTelefone`
7. `ApresentanteCPFCNPJ`
8. `ValorDeposito`
9. `ValorEmolumentos`
10. `DataProtocolo`
11. `DataPrevisaoEntrega`
12. `ModoNotificacaoStatus`
13. `InteressadoNome`
14. `InteressadoCPFCNPJ`
15. `NaturezaTitulo`
16. `CodigoVerificador`
17. `TipoSolicitacao`
18. `IDTipoStatus`
19. `DataStatus`
20. `DescricaoStatus`

## Parâmetros de entrada

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `Hash` | Hash de autenticação | string | sim | — | _(SHA-1)_ |
| `Protocolo` | Número do protocolo | string | sim | — | 20250100001 |
| `ModoNotificacaoStatus` | Modo de notificação | string(1) | sim | ver [ModoNotificacaoStatus-AT](../tabelas-dominio/ModoNotificacaoStatus-AT.md) | E |
| `TipoSolicitacao` | Tipo da solicitação | int | sim | ver [TipoSolicitacao-AT](../tabelas-dominio/TipoSolicitacao-AT.md) | 1 |
| `IDTipoStatus` | Status inicial do título | int | sim | ver [IDTipoStatus-AT](../tabelas-dominio/IDTipoStatus-AT.md) | 4 |
| `_(+ demais campos)_` | Apresentante, valores, datas, interessado — ver `lib/onr_insert_titulo_at` | — | sim | vários opcionais enviados como `""` | — |

## Parâmetros de saída

| Campo | Descrição | Tipo | Obrigatório | Condicional | Exemplo |
|-------|-----------|------|-------------|-------------|---------|
| `RETORNO` | Sucesso | boolean | sim | — | true |
| `CODIGOERRO` | Código do erro | int | sim | — | 0 |
| `ERRODESCRICAO` | Descrição do erro | string | não | se RETORNO=false | — |
| `IDTitulo` | ID do título criado | int | sim | se RETORNO=true | 1001 |
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

- Python: [`scripts/InsertTituloAt/insertTituloAt.py`](../../scripts/InsertTituloAt/insertTituloAt.py)
- JavaScript: [`scripts/InsertTituloAt/insertTituloAt.js`](../../scripts/InsertTituloAt/insertTituloAt.js)
- Variáveis `.env`: `ACOMPANHAMENTO_TITULOS_INSERT_*`
- Helper: `lib/onr_insert_titulo_at`
## Referências

- [`webservice/hash.md`](../hash.md) — geração do `Hash`
- [`webservice/list-metodos.md`](../list-metodos.md)
- [`webservice/tabelas-dominio/`](../tabelas-dominio/README.md)
- [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) — Envelope de Entrada/Saída `InsertTituloAT`
