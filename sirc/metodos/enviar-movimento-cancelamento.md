# enviarMovimentoCancelamento

Envia ao SIRC movimentos de cancelamento de termo para processamento efetivo.

## Endpoint

- Usuario e senha: `https://sirc.dataprev.gov.br/SircWs/Movimento`
- Certificado digital: `https://sirc.dataprev.gov.br/SircWs/MovimentoCertificadoDigital`

Consulte tambem [`autenticacao-e-endpoints.md`](../referencia/autenticacao-e-endpoints.md).

## XML Esperado

- Tag raiz do movimento: `<movimentoCancelamentoTO>`
- Versao de layout indicada no manual: `1.1`
- Registro de cancelamento: `<registroTermoCancelado>`

## Regras Principais

Para cancelar termo existente:

- O registro civil cuja matricula sera cancelada deve estar excluido no sistema.
- A matricula nao pode estar previamente cancelada.

Para cancelar termo inexistente:

- A matricula nao deve existir no sistema; trata-se de matricula nunca utilizada em registros civis com ou sem historico associado.

## Exemplo XML

```xml
<movimentoCancelamentoTO>
  <versaoLayoutCancelamento>1.1</versaoLayoutCancelamento>
  <registroTermoCancelado>
    <!-- dados do termo cancelado -->
  </registroTermoCancelado>
</movimentoCancelamentoTO>
```

## Referencias

- Layout: [`layouts-xml/cancelamento.md`](../layouts-xml/cancelamento.md)
- Regras de validacao: [`regras/validacao.md`](../regras/validacao.md)
- Regras de negocio: [`regras/negocio.md`](../regras/negocio.md)
- Matricula e campos obrigatorios: [`regras/matricula-campos-obrigatorios.md`](../regras/matricula-campos-obrigatorios.md)

