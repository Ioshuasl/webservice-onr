# Autenticacao e Endpoints

Fonte: capitulos 2.1, 2.3 e Anexo VIII do `manual sirc.md`.

## Endpoints

### SIRC Web

```text
https://sirc.dataprev.gov.br
```

### Webservice com Usuario e Senha

```text
https://sirc.dataprev.gov.br/SircWs/Movimento
```

WSDL:

```text
https://sirc.dataprev.gov.br/SircWs/Movimento?wsdl
```

Para essa modalidade, o manual informa que e necessario enviar usuario, senha e conteudo com os movimentos da serventia.

### Webservice com Certificado Digital

```text
https://sirc.dataprev.gov.br/SircWs/MovimentoCertificadoDigital
```

WSDL:

```text
https://sirc.dataprev.gov.br/SircWs/MovimentoCertificadoDigital?wsdl
```

Essa modalidade utiliza WS-Security. O certificado do usuario deve ser enviado no cabecalho SOAP; o cabecalho tambem deve conter assinatura XML e timestamp de seguranca.

## Validacao

As funcoes `validarMovimento*` sao disponibilizadas para testes. Dados enviados por essas funcoes nao sao inseridos na base do SIRC.

Na autenticacao por certificado digital, o manual informa que nao e necessario enviar usuario e senha para acessar as funcoes de validacao, desde que o certificado utilizado seja valido.

## Dados de Teste Citados no Manual

O Anexo VIII cita credenciais de teste para funcoes de validacao:

- Codigo CNS: `123456`
- Senha: `1234`

Confirme no ambiente atual se esses dados continuam validos antes de usar em automacao.

