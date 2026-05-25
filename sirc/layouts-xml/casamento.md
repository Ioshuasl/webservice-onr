# Layout XML - Registro de Casamento

Fonte: capitulos 6.3, 7.3 e XSD de casamento do `manual sirc.md`.

## Movimento

- Tag raiz: `<movimentoCasamentoTO>`
- Versao: `<versaoLayoutCasamento>5.0</versaoLayoutCasamento>`
- Metodo de envio: [`enviarMovimentoCasamento`](../metodos/enviar-movimento-casamento.md)
- Metodo de validacao: [`validarMovimentoCasamento`](../metodos/validar-movimento-casamento.md)

## Operacoes

```xml
<movimentoCasamentoTO>
  <versaoLayoutCasamento>5.0</versaoLayoutCasamento>
  <registroCasamentoInclusao>
    <!-- dados do registro de casamento -->
  </registroCasamentoInclusao>
  <registroCasamentoAlteracao>
    <!-- em alteracao, enviar todos os dados do registro -->
  </registroCasamentoAlteracao>
  <registroCasamentoExclusao>
    <!-- dados para exclusao -->
  </registroCasamentoExclusao>
</movimentoCasamentoTO>
```

## Exemplo XML minimo - inclusao

Exemplo ilustrativo para montar payload SOAP. Ajuste os valores conforme a serventia, matricula e regras do SIRC.

```xml
<movimentoCasamentoTO>
  <versaoLayoutCasamento>5.0</versaoLayoutCasamento>
  <registroCasamentoInclusao>
    <acervo>01</acervo>
    <anoRegistro>2026</anoRegistro>
    <codServentia>123456</codServentia>
    <dataRegistroCasamento>25/05/2026</dataRegistroCasamento>
    <dataCelebracaoCasamento>25/05/2026</dataCelebracaoCasamento>
    <dvMatricula>00</dvMatricula>
    <folha>001</folha>
    <numeroLivro>00001</numeroLivro>
    <termo>0000001</termo>
    <tipoLivro>2</tipoLivro>
    <tipoServico>55</tipoServico>
    <regimeCasamento>COMUNHAO_PARCIAL</regimeCasamento>
    <nomeConjuge1>JOAO EXEMPLO</nomeConjuge1>
    <sexoConjuge1>MASCULINO</sexoConjuge1>
    <dataNascimentoConjuge1>01/01/1990</dataNascimentoConjuge1>
    <nomeConjuge2>MARIA EXEMPLO</nomeConjuge2>
    <sexoConjuge2>FEMININO</sexoConjuge2>
    <dataNascimentoConjuge2>02/02/1992</dataNascimentoConjuge2>
    <registroJudicial>false</registroJudicial>
  </registroCasamentoInclusao>
</movimentoCasamentoTO>
```

## Campos do Registro

### Matricula

- Serventia.
- Acervo.
- Tipo.
- Ano do registro.
- Tipo do livro.
- Numero do livro.
- Numero da folha.
- Numero do termo.
- Digito verificador da matricula.

### Dados do Casamento

- Data da publicacao dos proclamas.
- Data da celebracao do casamento.
- Data de registro do casamento.
- Regime de casamento.
- Data e serventia da escritura antenupcial, quando houver.
- Pais de celebracao do casamento.
- Dados de casamento religioso, quando aplicavel.

### Dados dos Conjuges

Para primeiro e segundo conjuges:

- Nome.
- Nome que passa a ter em virtude do casamento.
- Sexo.
- Data de nascimento.
- Profissao.
- Pais e municipio de nascimento.
- Nacionalidade.
- Nome do conjuge precedente.
- Data da dissolucao do casamento anterior.
- Documentos, preferencialmente CPF.
- Domicilio e residencia.
- Filiacao do conjuge.

### Informacoes Complementares

- Impressos de seguranca, habilitados somente na alteracao.
- Observacoes.
- Anotacoes, averbacoes e retificacoes.
- Justificativas de ausencia de campos obrigatorios em lei.
- Orgao emissor do documento original.
- Dados de consulado para registros efetuados no exterior e transcritos no Brasil.

## Observacoes

O manual indica que matricula, nomes, sexo dos conjuges e data de registro do casamento sao excecoes; os demais campos podem ser marcados como ignorados quando a informacao nao existir.

