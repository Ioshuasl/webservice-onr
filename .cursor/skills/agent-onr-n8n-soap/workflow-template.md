# Template — workflow proxy ONR (n8n-as-code)

Referência mínima para novos workflows. Substituir `<Operacao>`, campos e ramos conforme `webservice/metodos/<Operacao>.md`.

## Esqueleto de classe

```typescript
import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : <Nome>
// Nodes   : N  |  Connections: ...
// ...
// </workflow-map>

@workflow({
  id: '<id-n8n>',
  name: '<Nome>',
  active: false,
  settings: { executionOrder: 'v1', binaryMode: 'separate' },
})
export class MeuWorkflowOnr {
  @node({ name: 'Webhook', type: 'n8n-nodes-base.webhook', version: 2.1, /* webhookId */ })
  Webhook = {
    httpMethod: 'POST',
    path: '<uuid>',
    authentication: 'basicAuth',
    responseMode: 'responseNode',
    options: {},
  };

  @node({ name: 'normalizar-entrada', type: 'n8n-nodes-base.set', version: 3.4 })
  NormalizarEntrada = {
    mode: 'raw',
    jsonOutput: `={
  "campo_exemplo": "{{ $json.body.campo_exemplo }}",
  "url_servico_onr": "{{ $json.body.url_servico_onr }}",
  "hash": "{{ $json.body.hash }}"
}`,
    options: {},
  };

  @node({ name: 'validar-entrada', type: 'n8n-nodes-base.code', version: 2 })
  ValidarEntrada = {
    jsCode: `// validações → entrada_valida, codigo_erro, mensagem_erro
return [{ json: { ...item, entrada_valida: true, codigo_erro: 0, mensagem_erro: '' } }];`,
  };

  @node({ name: 'if-entrada-valida', type: 'n8n-nodes-base.if', version: 2.2 })
  IfEntradaValida = {
    conditions: {
      options: { caseSensitive: true, leftValue: '', typeValidation: 'strict', version: 2 },
      conditions: [{
        id: '<uuid>',
        leftValue: '={{ $json.entrada_valida }}',
        rightValue: '',
        operator: { type: 'boolean', operation: 'true', singleValue: true },
      }],
      combinator: 'and',
    },
    options: {},
  };

  @node({
    name: 'consumir-soap-onr',
    type: 'n8n-nodes-base.httpRequest',
    version: 4.4,
    onError: 'continueErrorOutput',
  })
  ConsumirSoapOnr = {
    method: 'POST',
    url: '={{ $json.url_servico_onr }}',
    sendBody: true,
    contentType: 'raw',
    rawContentType: 'text/xml',
    body: `=<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <tns:<Operacao> xmlns:tns="http://tempuri.org/WSOficio">
      <tns:oRequest>
        <tns:Hash>{{ $json.hash }}</tns:Hash>
        <!-- demais campos na ordem do WSDL -->
      </tns:oRequest>
    </tns:<Operacao>>
  </soap:Body>
</soap:Envelope>`,
    options: {},
  };

  @node({ name: 'converter-resposta-onr', type: 'n8n-nodes-base.code', version: 2 })
  ConverterRespostaOnr = {
    jsCode: `// copiar mapearStatusHttp + extrairTag de Auth ONR.workflow.ts
// retornar { status_http, sucesso, codigo_erro, mensagem_erro, dados: { ... } }`,
  };

  @node({ name: 'resposta-validacao', type: 'n8n-nodes-base.code', version: 2 })
  RespostaValidacao = {
    jsCode: `return [{
  json: {
    status_http: 400,
    sucesso: false,
    codigo_erro: item.codigo_erro,
    mensagem_erro: item.mensagem_erro,
    dados: {}
  }
}];`,
  };

  @node({ name: 'resposta-erro-conexao-onr', type: 'n8n-nodes-base.code', version: 2 })
  RespostaErroConexaoOnr = {
    jsCode: `return [{
  json: {
    status_http: 502,
    sucesso: false,
    codigo_erro: 0,
    mensagem_erro: 'Falha ao conectar com a ONR.',
    dados: {}
  }
}];`,
  };

  @node({ name: 'Respond to Webhook', type: 'n8n-nodes-base.respondToWebhook', version: 1.5 })
  RespondToWebhook = {
    respondWith: 'firstIncomingItem',
    options: { responseCode: '={{ $json.status_http }}' },
  };

  @links()
  defineRouting() {
    this.Webhook.out(0).to(this.NormalizarEntrada.in(0));
    this.NormalizarEntrada.out(0).to(this.ValidarEntrada.in(0));
    this.ValidarEntrada.out(0).to(this.IfEntradaValida.in(0));
    this.IfEntradaValida.out(0).to(this.ConsumirSoapOnr.in(0));
    this.IfEntradaValida.out(1).to(this.RespostaValidacao.in(0));
    this.ConsumirSoapOnr.out(0).to(this.ConverterRespostaOnr.in(0));
    this.ConsumirSoapOnr.error().to(this.RespostaErroConexaoOnr.in(0));
    this.ConverterRespostaOnr.out(0).to(this.RespondToWebhook.in(0));
    this.RespostaValidacao.out(0).to(this.RespondToWebhook.in(0));
    this.RespostaErroConexaoOnr.out(0).to(this.RespondToWebhook.in(0));
  }
}
```

## `mapearStatusHttp` (copiar do Auth ONR)

```javascript
function mapearStatusHttp(sucesso, codigoErro, origem = 'onr') {
  if (sucesso) return 200;
  if (origem === 'validacao') return 400;
  if ([2, 10, 11, 12, 13, 14, 15, 16, 17].includes(codigoErro)) return 400;
  if (codigoErro === 51) return 404;
  if (codigoErro === 52 || codigoErro === 53) return 403;
  if (codigoErro === 0) return 502;
  if (codigoErro === 1) return 503;
  return 422;
}
```

## Login (sem Hash)

Remover `<tns:Hash>` do XML. Body JSON com campos de certificado (`assunto_certificado`, `cpf`, `url_login_onr`, …). Resposta com `tokens[]` no topo — ver `Auth ONR.workflow.ts`.
