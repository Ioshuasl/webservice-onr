# WSDL e Funcoes Disponiveis

Fonte: Anexo VIII do `manual sirc.md`.

## WSDL

- Usuario e senha: `https://sirc.dataprev.gov.br/SircWs/Movimento?wsdl`
- Certificado digital: `https://sirc.dataprev.gov.br/SircWs/MovimentoCertificadoDigital?wsdl`

## Funcoes

O manual lista nove funcoes no Webservice do SIRC:

| Funcao | Persistencia | Documentacao |
|---|---|---|
| `enviarMovimentoNascimento` | Insere/processa na base | [`metodos/enviar-movimento-nascimento.md`](../metodos/enviar-movimento-nascimento.md) |
| `enviarMovimentoObito` | Insere/processa na base | [`metodos/enviar-movimento-obito.md`](../metodos/enviar-movimento-obito.md) |
| `enviarMovimentoCasamento` | Insere/processa na base | [`metodos/enviar-movimento-casamento.md`](../metodos/enviar-movimento-casamento.md) |
| `enviarMovimentoCancelamento` | Insere/processa na base | [`metodos/enviar-movimento-cancelamento.md`](../metodos/enviar-movimento-cancelamento.md) |
| `declararInexistenciaMovimento` | Insere/processa declaracao | [`metodos/declarar-inexistencia-movimento.md`](../metodos/declarar-inexistencia-movimento.md) |
| `validarMovimentoNascimento` | Somente validacao | [`metodos/validar-movimento-nascimento.md`](../metodos/validar-movimento-nascimento.md) |
| `validarMovimentoObito` | Somente validacao | [`metodos/validar-movimento-obito.md`](../metodos/validar-movimento-obito.md) |
| `validarMovimentoCasamento` | Somente validacao | [`metodos/validar-movimento-casamento.md`](../metodos/validar-movimento-casamento.md) |
| `validarMovimentoCancelamento` | Somente validacao | [`metodos/validar-movimento-cancelamento.md`](../metodos/validar-movimento-cancelamento.md) |

## Observacao Sobre Validacao

As funcoes de validacao estao disponiveis para testes. O manual declara que os dados enviados por meio dessas funcoes nao serao inseridos na base de dados do SIRC.

