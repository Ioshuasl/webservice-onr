# enviarMovimentoObito

Envia ao SIRC movimentos de registro de obito para processamento efetivo na base de dados.

## Endpoint

- Usuario e senha: `https://sirc.dataprev.gov.br/SircWs/Movimento`
- Certificado digital: `https://sirc.dataprev.gov.br/SircWs/MovimentoCertificadoDigital`

Consulte tambem [`autenticacao-e-endpoints.md`](../referencia/autenticacao-e-endpoints.md).

## XML Esperado

- Tag raiz do movimento: `<movimentoObitoTO>`
- Versao de layout indicada no manual: `5.0`
- Situacoes previstas:
  - inclusao: `<registroObitoInclusao>`
  - alteracao: `<registroObitoAlteracao>`
  - exclusao: `<registroObitoExclusao>`

Na alteracao, o manual orienta enviar todos os dados do registro; campos omitidos podem ser considerados sem valor definido.

## Campos e Regras de Preenchimento

O manual destaca que, para obito, os campos `Matricula do Registro` e `Data da Lavratura do Obito` sao excecoes: os demais campos podem ser informados como ignorados quando a informacao nao existir.

Registro judicial de obito pode usar o conjunto minimo: matricula, numero do processo, data da sentenca e data da lavratura do registro, com `<registroJudicial>true</registroJudicial>`.

## Exemplo XML

```xml
<movimentoObitoTO>
  <versaoLayoutObito>5.0</versaoLayoutObito>
  <registroObitoInclusao>
    <!-- dados do registro de obito -->
  </registroObitoInclusao>
</movimentoObitoTO>
```

## Referencias

- Layout: [`layouts-xml/obito.md`](../layouts-xml/obito.md)
- Regras de validacao: [`regras/validacao.md`](../regras/validacao.md)
- Regras de negocio: [`regras/negocio.md`](../regras/negocio.md)
- DO: [`regras/validacao-do.md`](../regras/validacao-do.md)
- Matricula e campos obrigatorios: [`regras/matricula-campos-obrigatorios.md`](../regras/matricula-campos-obrigatorios.md)

