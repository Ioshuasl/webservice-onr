# enviarMovimentoCasamento

Envia ao SIRC movimentos de registro de casamento para processamento efetivo na base de dados.

## Endpoint

- Usuario e senha: `https://sirc.dataprev.gov.br/SircWs/Movimento`
- Certificado digital: `https://sirc.dataprev.gov.br/SircWs/MovimentoCertificadoDigital`

Consulte tambem [`autenticacao-e-endpoints.md`](../referencia/autenticacao-e-endpoints.md).

## XML Esperado

- Tag raiz do movimento: `<movimentoCasamentoTO>`
- Versao de layout indicada no manual: `5.0`
- Situacoes previstas:
  - inclusao: `<registroCasamentoInclusao>`
  - alteracao: `<registroCasamentoAlteracao>`
  - exclusao: `<registroCasamentoExclusao>`

Na alteracao, o manual orienta enviar todos os dados do registro; campos omitidos podem ser considerados sem valor definido.

## Campos e Regras de Preenchimento

O manual destaca que, para casamento, os campos `Matricula do Registro`, nomes, sexo dos conjuges e data de registro do casamento sao excecoes: os demais campos podem ser informados como ignorados quando a informacao nao existir.

Registro judicial de casamento pode usar o conjunto minimo: matricula, numero do processo, data da sentenca e data do registro, com `<registroJudicial>true</registroJudicial>`.

## Exemplo XML

```xml
<movimentoCasamentoTO>
  <versaoLayoutCasamento>5.0</versaoLayoutCasamento>
  <registroCasamentoInclusao>
    <!-- dados do registro de casamento -->
  </registroCasamentoInclusao>
</movimentoCasamentoTO>
```

## Referencias

- Layout: [`layouts-xml/casamento.md`](../layouts-xml/casamento.md)
- Regras de validacao: [`regras/validacao.md`](../regras/validacao.md)
- Regras de negocio: [`regras/negocio.md`](../regras/negocio.md)
- Tabelas de dominio: [`referencia/tabelas-dominio.md`](../referencia/tabelas-dominio.md)
- Matricula e campos obrigatorios: [`regras/matricula-campos-obrigatorios.md`](../regras/matricula-campos-obrigatorios.md)

