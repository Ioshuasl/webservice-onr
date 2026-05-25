# Documentacao SIRC

Documentacao derivada de `manual sirc.md` para facilitar a consulta por metodo do webservice e por assunto tecnico.

## Fontes

- Manual convertido: [`manual sirc.md`](./manual%20sirc.md)
- Versao do manual: 7.4, janeiro de 2026
- Servico com usuario/senha: `https://sirc.dataprev.gov.br/SircWs/Movimento`
- WSDL com usuario/senha: `https://sirc.dataprev.gov.br/SircWs/Movimento?wsdl`
- Servico com certificado digital: `https://sirc.dataprev.gov.br/SircWs/MovimentoCertificadoDigital`
- WSDL com certificado digital: `https://sirc.dataprev.gov.br/SircWs/MovimentoCertificadoDigital?wsdl`

## Metodos do Webservice

### Envio efetivo

- [`enviarMovimentoNascimento`](./metodos/enviar-movimento-nascimento.md)
- [`enviarMovimentoObito`](./metodos/enviar-movimento-obito.md)
- [`enviarMovimentoCasamento`](./metodos/enviar-movimento-casamento.md)
- [`enviarMovimentoCancelamento`](./metodos/enviar-movimento-cancelamento.md)
- [`declararInexistenciaMovimento`](./metodos/declarar-inexistencia-movimento.md)

### Validacao sem insercao na base

- [`validarMovimentoNascimento`](./metodos/validar-movimento-nascimento.md)
- [`validarMovimentoObito`](./metodos/validar-movimento-obito.md)
- [`validarMovimentoCasamento`](./metodos/validar-movimento-casamento.md)
- [`validarMovimentoCancelamento`](./metodos/validar-movimento-cancelamento.md)

## Referencias Compartilhadas

- [`Autenticacao e endpoints`](./referencia/autenticacao-e-endpoints.md)
- [`WSDL e funcoes disponiveis`](./referencia/wsdl.md)
- [`Comunicacao SOAP e XML`](./referencia/comunicacao-soap-xml.md)
- [`Tabelas de dominio`](./referencia/tabelas-dominio.md)
- [`Anotacoes, averbacoes e retificacoes`](./referencia/anotacoes-averbacoes-retificacoes.md)

## Layouts XML

- [`Nascimento`](./layouts-xml/nascimento.md)
- [`Obito`](./layouts-xml/obito.md)
- [`Casamento`](./layouts-xml/casamento.md)
- [`Cancelamento`](./layouts-xml/cancelamento.md)
- [`Declaracao de inexistencia`](./layouts-xml/declaracao-inexistencia.md)

## Regras

- [`Regras de validacao`](./regras/validacao.md)
- [`Regras de negocio`](./regras/negocio.md)
- [`Matricula e campos obrigatorios`](./regras/matricula-campos-obrigatorios.md)
- [`Validacao de DNV`](./regras/validacao-dnv.md)
- [`Validacao de DO`](./regras/validacao-do.md)

## Como Usar

1. Abra o arquivo do metodo que pretende consumir.
2. Confira o endpoint e a forma de autenticacao em `referencia/autenticacao-e-endpoints.md`.
3. Monte o XML usando o layout correspondente em `layouts-xml/`.
4. Consulte as regras em `regras/` antes de enviar ou validar o movimento.

