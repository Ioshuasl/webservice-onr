# Layout XML - Registro de Nascimento

Fonte: capitulos 6.1, 7.1 e XSD de nascimento do `manual sirc.md`.

## Movimento

- Tag raiz: `<movimentoNascimentoTO>`
- Versao: `<versaoLayoutNascimento>5.0</versaoLayoutNascimento>`
- Metodo de envio: [`enviarMovimentoNascimento`](../metodos/enviar-movimento-nascimento.md)
- Metodo de validacao: [`validarMovimentoNascimento`](../metodos/validar-movimento-nascimento.md)

## Operacoes

```xml
<movimentoNascimentoTO>
  <versaoLayoutNascimento>5.0</versaoLayoutNascimento>
  <registroNascimentoInclusao>
    <!-- dados do registro de nascimento -->
  </registroNascimentoInclusao>
  <registroNascimentoAlteracao>
    <!-- em alteracao, enviar todos os dados do registro -->
  </registroNascimentoAlteracao>
  <registroNascimentoExclusao>
    <!-- dados para exclusao -->
  </registroNascimentoExclusao>
</movimentoNascimentoTO>
```

## Exemplo XML minimo - inclusao

Exemplo ilustrativo para montar payload SOAP. Ajuste os valores conforme a serventia, matricula e regras do SIRC.

```xml
<movimentoNascimentoTO>
  <versaoLayoutNascimento>5.0</versaoLayoutNascimento>
  <registroNascimentoInclusao>
    <acervo>01</acervo>
    <anoRegistro>2026</anoRegistro>
    <codServentia>123456</codServentia>
    <dataRegistro>25/05/2026</dataRegistro>
    <dvMatricula>00</dvMatricula>
    <folha>001</folha>
    <numeroLivro>00001</numeroLivro>
    <termo>0000001</termo>
    <tipoLivro>1</tipoLivro>
    <tipoServico>55</tipoServico>
    <nome>MARIA EXEMPLO</nome>
    <dataNascimento>25/05/2026</dataNascimento>
    <horaNascimento>10:30</horaNascimento>
    <sexo>FEMININO</sexo>
    <cpfIgnorado>true</cpfIgnorado>
    <codigoIBGEMunicipioNaturalidade>3550308</codigoIBGEMunicipioNaturalidade>
    <localNascimento>UNIDADE_SAUDE</localNascimento>
    <dnv>30123456789</dnv>
    <dnvInexistente>false</dnvInexistente>
    <registroJudicial>false</registroJudicial>
  </registroNascimentoInclusao>
</movimentoNascimentoTO>
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

### Dados do Nascido

- Nome do individuo.
- Data de nascimento.
- Marcador de data de nascimento ignorada.
- Hora de nascimento.
- Marcador de hora ignorada.
- Sexo.
- Data do registro.
- CPF.
- Municipio de nascimento por codigo IBGE.
- Marcador de municipio de nascimento ignorado.
- Local de nascimento.
- DNV.
- Marcador de DNV inexistente.
- Existencia e quantidade de gemeos.
- Pais de nascimento.
- Nacionalidade.

### Filiacao e Progenitores

- Nome da filiacao.
- Sexo da filiacao.
- Data de nascimento ou idade da filiacao.
- Pais, municipio, nacionalidade e profissao da filiacao.
- Documentos da filiacao.
- Progenitores vinculados a filiacao, quando informados.
- Domicilio da filiacao.

### Informacoes Complementares

- Impressos de seguranca, habilitados somente na alteracao.
- Observacoes.
- Anotacoes, averbacoes e retificacoes.
- Justificativas de ausencia de campos obrigatorios em lei.
- Orgao emissor do documento original.
- Dados de consulado para registros efetuados no exterior e transcritos no Brasil.

## Campos Minimos

Para inclusao ou alteracao, consulte [`enviarMovimentoNascimento`](../metodos/enviar-movimento-nascimento.md#campos-minimos-para-inclusao-ou-alteracao).

