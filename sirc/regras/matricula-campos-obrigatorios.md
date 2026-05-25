# Matricula e Campos Obrigatorios

Fonte: capitulos 4, 6 e 10 do `manual sirc.md`.

## Matricula

A matricula e formada por 32 digitos:

| Parte | Tamanho | Regra |
|---|---:|---|
| Identificador da serventia | 5 + 1 DV | DV modulo 10 conforme CNJ |
| Acervo | 2 | Deve pertencer aos acervos da serventia |
| Tipo de servico | 2 | Valor previsto `55` |
| Ano do registro | 4 | Deve corresponder ao ano da data de registro |
| Tipo do livro | 1 | Conforme tipo de registro |
| Numero do livro | 5 | Numerico |
| Numero da folha | 3 | Numerico |
| Numero do termo | 7 | Numerico |
| DV da matricula | 2 | Modulo 11 conforme CNJ |

## Campos Ignorados

Quando um campo obrigatorio nao estiver preenchido, deve-se informar o marcador correspondente de ignorado como `true`. Quando o valor estiver preenchido, o marcador de ignorado nao deve ser informado.

Exemplo extraido da regra geral do manual:

```xml
<nome></nome>
<nomeIgnorado>true</nomeIgnorado>
```

Tambem e aceito apenas o marcador:

```xml
<nomeIgnorado>true</nomeIgnorado>
```

Essa regra nao se aplica a registros judiciais nem a registros civis efetuados no exterior e transcritos no Brasil; nesses casos, os marcadores de campos ignorados devem ser desconsiderados.

## Obrigatorios Por Tipo de Movimento

### Nascimento

Campos minimos para inclusao ou alteracao:

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

### Obito

O manual destaca como campos nao ignoraveis:

- Matricula do registro.
- Data da lavratura do obito.

Os demais campos podem ser marcados como ignorados quando a informacao nao existir, conforme regras de cada campo.

### Casamento

O manual destaca como campos nao ignoraveis:

- Matricula do registro.
- Nomes.
- Sexo dos conjuges.
- Data de registro do casamento.

Os demais campos podem ser marcados como ignorados quando a informacao nao existir, conforme regras de cada campo.

### Cancelamento

Campos obrigatorios:

- Motivo.
- Tipo de registro civil.
- Codigo da serventia.
- Acervo.
- Tipo de servico.
- Numero do termo.
- Tipo do livro.
- Ano do registro.
- Numero da folha.
- Numero do livro.

### Declaracao de Inexistencia

Campos centrais:

- Competencia.
- Indicadores de inexistencia para casamento, nascimento, obito e natimorto.

