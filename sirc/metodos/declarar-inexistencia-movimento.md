# declararInexistenciaMovimento

Declara inexistencia de movimento para uma competencia, por tipo de registro civil.

## Endpoint

- Usuario e senha: `https://sirc.dataprev.gov.br/SircWs/Movimento`
- Certificado digital: `https://sirc.dataprev.gov.br/SircWs/MovimentoCertificadoDigital`

Consulte tambem [`autenticacao-e-endpoints.md`](../referencia/autenticacao-e-endpoints.md).

## XML Esperado

- Tag raiz do movimento: `<declaracaoInexistenciaMovimentoTO>`
- Versao de layout indicada no manual: `1.0`
- Conteudo por competencia.

## Campos Principais

- Competencia.
- Indicador de inexistencia de movimento de casamento.
- Indicador de inexistencia de movimento de nascimento.
- Indicador de inexistencia de movimento de obito.
- Indicador de inexistencia de movimento de natimorto.

## Observacoes

O metodo representa uma declaracao de inexistencia por competencia; nao substitui os envios de movimentos quando houver registros a informar.

## Exemplo XML

```xml
<declaracaoInexistenciaMovimentoTO>
  <competencia>AAAA-MM</competencia>
  <indicadorInexistenciaMovimentoCasamento>true</indicadorInexistenciaMovimentoCasamento>
  <indicadorInexistenciaMovimentoNascimento>true</indicadorInexistenciaMovimentoNascimento>
  <indicadorInexistenciaMovimentoObito>true</indicadorInexistenciaMovimentoObito>
  <indicadorInexistenciaMovimentoNatimorto>true</indicadorInexistenciaMovimentoNatimorto>
</declaracaoInexistenciaMovimentoTO>
```

## Referencias

- Layout: [`layouts-xml/declaracao-inexistencia.md`](../layouts-xml/declaracao-inexistencia.md)
- Regras de negocio: [`regras/negocio.md`](../regras/negocio.md)
- WSDL: [`referencia/wsdl.md`](../referencia/wsdl.md)

