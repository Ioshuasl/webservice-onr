# Layout XML - Declaracao de Inexistencia de Movimento

Fonte: capitulos 6.5 e 7.4 do `manual sirc.md`.

## Movimento

- Tag raiz: `<declaracaoInexistenciaMovimentoTO>`
- Versao: `1.0`
- Metodo: [`declararInexistenciaMovimento`](../metodos/declarar-inexistencia-movimento.md)

## Estrutura

```xml
<declaracaoInexistenciaMovimentoTO>
  <competencia>AAAA-MM</competencia>
  <indicadorInexistenciaMovimentoCasamento>true</indicadorInexistenciaMovimentoCasamento>
  <indicadorInexistenciaMovimentoNascimento>true</indicadorInexistenciaMovimentoNascimento>
  <indicadorInexistenciaMovimentoObito>true</indicadorInexistenciaMovimentoObito>
  <indicadorInexistenciaMovimentoNatimorto>true</indicadorInexistenciaMovimentoNatimorto>
</declaracaoInexistenciaMovimentoTO>
```

## Exemplo XML minimo

Exemplo ilustrativo para declarar inexistencia de todos os movimentos da competencia.

```xml
<declaracaoInexistenciaMovimentoTO>
  <competencia>2026-05</competencia>
  <indicadorInexistenciaMovimentoCasamento>true</indicadorInexistenciaMovimentoCasamento>
  <indicadorInexistenciaMovimentoNascimento>true</indicadorInexistenciaMovimentoNascimento>
  <indicadorInexistenciaMovimentoObito>true</indicadorInexistenciaMovimentoObito>
  <indicadorInexistenciaMovimentoNatimorto>true</indicadorInexistenciaMovimentoNatimorto>
</declaracaoInexistenciaMovimentoTO>
```

## Campos

- Competencia.
- Indicador de inexistencia de movimento de casamento.
- Indicador de inexistencia de movimento de nascimento.
- Indicador de inexistencia de movimento de obito.
- Indicador de inexistencia de movimento de natimorto.

## Observacao

Use somente quando a serventia precisa declarar ausencia de movimentos na competencia informada.

