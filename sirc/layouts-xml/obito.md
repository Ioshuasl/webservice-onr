# Layout XML - Registro de Obito

Fonte: capitulos 6.2, 7.2 e XSD de obito do `manual sirc.md`.

## Movimento

- Tag raiz: `<movimentoObitoTO>`
- Versao: `<versaoLayoutObito>5.0</versaoLayoutObito>`
- Metodo de envio: [`enviarMovimentoObito`](../metodos/enviar-movimento-obito.md)
- Metodo de validacao: [`validarMovimentoObito`](../metodos/validar-movimento-obito.md)

## Operacoes

```xml
<movimentoObitoTO>
  <versaoLayoutObito>5.0</versaoLayoutObito>
  <registroObitoInclusao>
    <!-- dados do registro de obito -->
  </registroObitoInclusao>
  <registroObitoAlteracao>
    <!-- em alteracao, enviar todos os dados do registro -->
  </registroObitoAlteracao>
  <registroObitoExclusao>
    <!-- dados para exclusao -->
  </registroObitoExclusao>
</movimentoObitoTO>
```

## Exemplo XML minimo - inclusao

Exemplo ilustrativo para montar payload SOAP. Ajuste os valores conforme a serventia, matricula e regras do SIRC.

```xml
<movimentoObitoTO>
  <versaoLayoutObito>5.0</versaoLayoutObito>
  <registroObitoInclusao>
    <acervo>01</acervo>
    <anoRegistro>2026</anoRegistro>
    <codServentia>123456</codServentia>
    <dataLavraturaObito>25/05/2026</dataLavraturaObito>
    <dataObito>24/05/2026</dataObito>
    <dvMatricula>00</dvMatricula>
    <folha>001</folha>
    <numeroLivro>00001</numeroLivro>
    <termo>0000001</termo>
    <tipoLivro>4</tipoLivro>
    <tipoServico>55</tipoServico>
    <nome>JOAO EXEMPLO</nome>
    <sexo>MASCULINO</sexo>
    <dataNascimento>01/01/1950</dataNascimento>
    <numeroDO>136005039</numeroDO>
    <tipoMorte>NATURAL</tipoMorte>
    <nomeDeclarante>DECLARANTE EXEMPLO</nomeDeclarante>
    <registroJudicial>false</registroJudicial>
  </registroObitoInclusao>
</movimentoObitoTO>
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

### Cronologia e Declaracao de Obito

- Numero da DO.
- Data de lavratura do falecimento.
- Hora do falecimento.
- Data do falecimento.

### Lugar do Falecimento

- Pais de falecimento.
- Tipo do local de falecimento.
- Nome e endereco do local de falecimento.
- Municipio do local de falecimento por codigo IBGE.
- Domicilio estrangeiro do local de falecimento.

### Dados do Falecido

- Nome.
- Sexo.
- Data de nascimento.
- Idade.
- Raca/cor.
- Profissao.
- Pais e municipio de nascimento.
- Nacionalidade.
- Estado civil.
- Domicilio e residencia.
- Documentos, preferencialmente CPF.
- Numero de beneficio do INSS.

### Demais Blocos

- Filiacao.
- Tipo de morte e causa conhecida.
- Nome do atestante.
- Lugar do sepultamento.
- Indicador de eleitor.
- Nome e documentos do declarante.
- Impressos de seguranca, habilitados somente na alteracao.
- Observacoes, anotacoes, averbacoes e retificacoes.
- Justificativas de ausencia de campos obrigatorios em lei.
- Dados de consulado para registros efetuados no exterior e transcritos no Brasil.

## Observacoes

O manual indica que, com excecao de matricula e data da lavratura do obito, os demais campos podem ser marcados como ignorados quando a informacao nao existir.

