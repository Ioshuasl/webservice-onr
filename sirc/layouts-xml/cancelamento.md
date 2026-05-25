# Layout XML - Cancelamento de Termo

Fonte: capitulos 6.4, 7.5 e XSD de cancelamento do `manual sirc.md`.

## Movimento

- Tag raiz: `<movimentoCancelamentoTO>`
- Versao: `<versaoLayoutCancelamento>1.1</versaoLayoutCancelamento>`
- Metodo de envio: [`enviarMovimentoCancelamento`](../metodos/enviar-movimento-cancelamento.md)
- Metodo de validacao: [`validarMovimentoCancelamento`](../metodos/validar-movimento-cancelamento.md)

## Operacao

```xml
<movimentoCancelamentoTO>
  <versaoLayoutCancelamento>1.1</versaoLayoutCancelamento>
  <registroTermoCancelado>
    <!-- dados do termo cancelado -->
  </registroTermoCancelado>
</movimentoCancelamentoTO>
```

## Exemplo XML minimo - cancelamento

Exemplo ilustrativo para montar payload SOAP. Ajuste os valores conforme a serventia, matricula e regras do SIRC.

```xml
<movimentoCancelamentoTO>
  <versaoLayoutCancelamento>1.1</versaoLayoutCancelamento>
  <registroTermoCancelado>
    <motivo>Cancelamento informado pela serventia conforme livro.</motivo>
    <tipoRegistroCivil>NASCIMENTO</tipoRegistroCivil>
    <codServentia>123456</codServentia>
    <acervo>01</acervo>
    <tipoServico>55</tipoServico>
    <termo>0000001</termo>
    <tipoLivro>1</tipoLivro>
    <anoRegistro>2026</anoRegistro>
    <folha>001</folha>
    <numeroLivro>00001</numeroLivro>
    <dvMatricula>00</dvMatricula>
  </registroTermoCancelado>
</movimentoCancelamentoTO>
```

## Campos do Termo Cancelado

- Motivo.
- Tipo do registro civil.
- Codigo da serventia.
- Acervo.
- Tipo do servico.
- Termo.
- Tipo do livro.
- Ano do registro.
- Data de envio para CER, quando aplicavel.
- Digito verificador da matricula.
- Numero da folha.
- Numero do livro.

## Regras

Consulte [`enviarMovimentoCancelamento`](../metodos/enviar-movimento-cancelamento.md#regras-principais) e [`negocio.md`](../regras/negocio.md#cancelamento-de-termos).

