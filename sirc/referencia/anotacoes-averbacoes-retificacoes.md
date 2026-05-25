# Anotacoes, Averbacoes e Retificacoes

Fonte: capitulos 4.8, 5.9 e Anexo XVII do `manual sirc.md`.

## Anotacao

Validacoes:

- Data da anotacao deve ser maior ou igual a data do registro civil.
- Data da anotacao deve ser menor ou igual a data atual.
- Dados complementares: minimo 10 e maximo 1000 caracteres.

Regras de negocio:

- Deve ser informada a matricula ou o complemento da anotacao.
- Ao menos um desses campos e obrigatorio.
- Quando o motivo for `Outros`, o complemento e obrigatorio.

## Averbacao

Validacoes:

- Data da averbacao deve ser maior ou igual a data do registro civil.
- Data da averbacao deve ser menor ou igual a data atual.
- Data do motivo deve ser menor ou igual a data da averbacao.
- Data da sentenca deve ser menor ou igual a data da averbacao.
- Dados complementares: minimo 10 e maximo 1000 caracteres.

Regras de negocio:

- Quando o motivo for `Outros`, o complemento e obrigatorio.

## Retificacao

Validacoes:

- Data da retificacao deve ser maior ou igual a data do registro civil.
- Data da retificacao deve ser menor ou igual a data atual.
- Data da sentenca deve ser menor ou igual a data da retificacao.
- Dados complementares: minimo 10 e maximo 1000 caracteres.

Regras de negocio:

- Para simples correcao de erro de digitacao no SIRC, basta alterar o campo correspondente.
- Em caso de retificacao, o registro civil deve ter ao menos um campo alterado ou o complemento da retificacao deve ser preenchido.

## Motivos

O Anexo XVII do manual lista motivos por tipo de registro civil:

- Registro de nascimento.
- Registro de casamento.
- Registro de obito.

Consulte o trecho integral do manual convertido quando precisar montar a tabela completa de motivos.

