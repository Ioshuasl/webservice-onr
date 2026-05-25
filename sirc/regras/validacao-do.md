# Validacao de DO

Fonte: Anexo X do `manual sirc.md`.

A Declaracao de Obito (DO) possui numero sujeito a validacao por digito verificador conforme regras disponibilizadas pelo Ministerio da Saude.

Formato geral atual: `XXXXXXXX-D`, em que os oito primeiros digitos compoem a sequencia e o 9º digito e o DV.

## Geracoes

### 1ª Geracao

- Numeros com 8 digitos, sem DV.
- Numeracao ate `12075500`.
- Impressos antes de 2006 e distribuidos ate o 1º semestre de 2006.

### 2ª Geracao

- Numeros com 8 digitos + 1 DV.
- Metodo: divisao por 11.
- Faixa aproximada: `12075501-X` a `13599999-X`.
- Impressos no 2º semestre de 2006 e distribuidos ate o 1º semestre de 2008.

Regra:

1. Usar a sequencia formada do 1º ao 8º caractere.
2. Dividir por 11 e obter o resto.
3. Se o resto for `0` ou `10`, o digito e `0`.
4. Caso contrario, o digito e o proprio resto.

### 3ª Geracao

- Numeros com 8 digitos + 1 DV.
- Metodo: modulo 11 DSR.
- Numeracao acima de `13600002-X`.
- Impressos no 2º semestre de 2008 e distribuidos a partir do 1º semestre de 2009.

Pesos indicados no manual para os 8 primeiros algarismos:

```text
9 8 7 6 5 4 3 2
```

Regra:

1. Multiplicar os 8 primeiros algarismos pelos pesos.
2. Somar os produtos.
3. Dividir o somatorio por 11 e obter o resto.
4. Se o resto for `0` ou `1`, o digito e `0`.
5. Caso contrario, o digito e `11 - resto`.

## Uso

A DO aparece nos movimentos de obito:

- [`enviarMovimentoObito`](../metodos/enviar-movimento-obito.md)
- [`validarMovimentoObito`](../metodos/validar-movimento-obito.md)

## Regras Relacionadas no Manual

- A data de nascimento do falecido deve ser menor ou igual a data do obito, a data de lavratura e a data atual.
- A data de lavratura do obito deve ser maior ou igual a data do obito e a data de nascimento, e menor ou igual a data atual.
- A data do obito deve ser maior ou igual a data de nascimento, menor ou igual a data de lavratura e menor ou igual a data atual.
- Em registros de obito efetuados no exterior e posteriormente transcritos no Brasil, o manual informa que a DO nao deve ser preenchida.

## Observacao

O manual usa a descricao textual "3ª geracao ... novo metodo - DN" dentro do anexo de DO; nesta documentacao isso foi mantido como regra de DO, pois o contexto e o exemplo da secao sao de Declaracao de Obito.

