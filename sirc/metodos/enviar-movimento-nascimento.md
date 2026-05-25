# enviarMovimentoNascimento

Envia ao SIRC movimentos de registro de nascimento para processamento efetivo na base de dados.

## Endpoint

- Usuario e senha: `https://sirc.dataprev.gov.br/SircWs/Movimento`
- Certificado digital: `https://sirc.dataprev.gov.br/SircWs/MovimentoCertificadoDigital`

Consulte tambem [`autenticacao-e-endpoints.md`](../referencia/autenticacao-e-endpoints.md).

## XML Esperado

- Tag raiz do movimento: `<movimentoNascimentoTO>`
- Versao de layout indicada no manual: `5.0`
- Situacoes previstas:
  - inclusao: `<registroNascimentoInclusao>`
  - alteracao: `<registroNascimentoAlteracao>`
  - exclusao: `<registroNascimentoExclusao>`

Na alteracao, o manual orienta enviar todos os dados do registro; campos omitidos podem ser considerados sem valor definido.

## Campos Minimos Para Inclusao ou Alteracao

- Matricula do registro.
- Nome.
- Data de nascimento ou marcador de data de nascimento ignorada.
- Hora de nascimento ou marcador de hora ignorada.
- Municipio de nascimento ou marcador de municipio de nascimento ignorado.
- Sexo.
- Data do registro de nascimento.
- CPF ou marcador de CPF ignorado.
- Local de nascimento.
- Numero da DNV ou marcador de inexistencia de DNV.

Registros judiciais de nascimento podem usar um conjunto minimo proprio: matricula, numero do processo, data da sentenca e data do registro, com `<registroJudicial>true</registroJudicial>`.

## Exemplo XML

```xml
<movimentoNascimentoTO>
  <versaoLayoutNascimento>5.0</versaoLayoutNascimento>
  <registroNascimentoInclusao>
    <!-- dados do registro de nascimento -->
  </registroNascimentoInclusao>
</movimentoNascimentoTO>
```

## Referencias

- Layout: [`layouts-xml/nascimento.md`](../layouts-xml/nascimento.md)
- Regras de validacao: [`regras/validacao.md`](../regras/validacao.md)
- Regras de negocio: [`regras/negocio.md`](../regras/negocio.md)
- DNV: [`regras/validacao-dnv.md`](../regras/validacao-dnv.md)
- Matricula e campos obrigatorios: [`regras/matricula-campos-obrigatorios.md`](../regras/matricula-campos-obrigatorios.md)

