# validarMovimentoObito

Valida um movimento de obito sem inserir os dados na base do SIRC.

## Endpoint

- Usuario e senha: `https://sirc.dataprev.gov.br/SircWs/Movimento`
- Certificado digital: `https://sirc.dataprev.gov.br/SircWs/MovimentoCertificadoDigital`

## Comportamento

O manual informa que as funcoes de validacao estao disponiveis para testes e que os dados enviados por meio delas nao serao inseridos na base de dados do SIRC.

Para a modalidade com certificado digital, o manual indica que nao e necessario informar usuario e senha para acessar as funcoes de validacao; basta que o certificado utilizado seja valido.

## XML Validado

Usa o mesmo conteudo do metodo [`enviarMovimentoObito`](./enviar-movimento-obito.md):

- Tag raiz: `<movimentoObitoTO>`
- Versao de layout: `5.0`
- Situacoes: inclusao, alteracao e exclusao de obito.

## Referencias

- Metodo efetivo equivalente: [`enviarMovimentoObito`](./enviar-movimento-obito.md)
- Layout: [`layouts-xml/obito.md`](../layouts-xml/obito.md)
- Regras de validacao: [`regras/validacao.md`](../regras/validacao.md)
- DO: [`regras/validacao-do.md`](../regras/validacao-do.md)

