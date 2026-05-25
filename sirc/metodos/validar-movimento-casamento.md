# validarMovimentoCasamento

Valida um movimento de casamento sem inserir os dados na base do SIRC.

## Endpoint

- Usuario e senha: `https://sirc.dataprev.gov.br/SircWs/Movimento`
- Certificado digital: `https://sirc.dataprev.gov.br/SircWs/MovimentoCertificadoDigital`

## Comportamento

O manual informa que as funcoes de validacao estao disponiveis para testes e que os dados enviados por meio delas nao serao inseridos na base de dados do SIRC.

Para a modalidade com certificado digital, o manual indica que nao e necessario informar usuario e senha para acessar as funcoes de validacao; basta que o certificado utilizado seja valido.

## XML Validado

Usa o mesmo conteudo do metodo [`enviarMovimentoCasamento`](./enviar-movimento-casamento.md):

- Tag raiz: `<movimentoCasamentoTO>`
- Versao de layout: `5.0`
- Situacoes: inclusao, alteracao e exclusao de casamento.

## Referencias

- Metodo efetivo equivalente: [`enviarMovimentoCasamento`](./enviar-movimento-casamento.md)
- Layout: [`layouts-xml/casamento.md`](../layouts-xml/casamento.md)
- Regras de validacao: [`regras/validacao.md`](../regras/validacao.md)
- Tabelas de dominio: [`referencia/tabelas-dominio.md`](../referencia/tabelas-dominio.md)

