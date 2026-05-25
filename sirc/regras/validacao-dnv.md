# Validacao de DNV

Fonte: Anexo IX do `manual sirc.md`.

Cada formulario da DNV e pre-numerado com 11 algarismos. O 11º digito e o digito verificador.

Formato geral: `XXXXXXXXXX-D`, em que os dez primeiros digitos compoem a sequencia e o ultimo e o DV.

## Geracoes

### 1ª Geracao

- Numeros com 8 digitos, sem DV.
- Numeracao ate `43700000`.
- Impressos antes de 2006 e distribuidos ate o 1º semestre de 2006.

### 2ª Geracao

- Numeros com 10 digitos + 1 DV.
- Metodo: divisao por 11.
- Faixa aproximada: `00-43700001-X` a `00-48101000-X`.
- Impressos no 2º semestre de 2006 e distribuidos ate o 1º semestre de 2008.
- Os dois primeiros digitos sao sempre `00`.

Regra:

1. Formar o numero com os digitos do 1º ao 10º caractere.
2. Calcular o resto da divisao por 11.
3. Se o resto for `0` ou `10`, o digito e `0`.
4. Caso contrario, o digito e o proprio resto.

### 3ª Geracao

- Numeros com 10 digitos + 1 DV.
- Metodo: modulo 11 DSR.
- Numeracao acima de `30-48101000-X`.
- Impressos a partir do 2º semestre de 2008 e distribuidos a partir do 1º semestre de 2009.
- Os dois primeiros digitos sao sempre `30`.

Pesos indicados no manual para os 10 primeiros algarismos:

```text
3 2 9 8 7 6 5 4 3 2
```

## Uso nos Metodos

- [`enviarMovimentoNascimento`](../metodos/enviar-movimento-nascimento.md)
- [`validarMovimentoNascimento`](../metodos/validar-movimento-nascimento.md)

