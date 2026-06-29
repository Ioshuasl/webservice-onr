# Template — workflow proxy Orius (unificado)

Substitui templates de `agent-onr-n8n-soap`, `agent-cra-n8n-soap` e REST.  
Ajustar nós 5–7 conforme perfil em [perfis-upstream.md](perfis-upstream.md).

## Esqueleto

```typescript
import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : [{IDENTIFICADOR}-n] (<integracao>) <Operacao> - <Dominio>
// ...
// </workflow-map>

@workflow({
  id: '<id-n8n>',
  name: '[{IDENTIFICADOR}-n] (<integracao>) <Operacao> - <Dominio>',
  active: false,
  settings: { executionOrder: 'v1', availableInMCP: false },
})
export class MeuWorkflowIntegracao {
  @node({
    name: 'Webhook',
    type: 'n8n-nodes-base.webhook',
    version: 2.1,
    credentials: { httpBasicAuth: { id: '...', name: 'orius - master@orius' } },
  })
  Webhook = {
    httpMethod: 'POST',
    path: '<integracao>/<slug>',
    authentication: 'basicAuth',
    responseMode: 'responseNode',
    options: {},
  };

  @node({ name: 'normalizar-entrada', type: 'n8n-nodes-base.set', version: 3.4 })
  NormalizarEntrada = {
    mode: 'raw',
    jsonOutput: `={
  "campo_exemplo": "{{ $json.body.campo_exemplo }}"
}`,
    options: {},
  };

  @node({ name: 'validar-entrada', type: 'n8n-nodes-base.code', version: 2 })
  ValidarEntrada = {
    jsCode: `
const item = $input.first().json;
// regras → entrada_valida, codigo_erro, mensagem_erro
return [{ json: { ...item, entrada_valida: true, codigo_erro: 0, mensagem_erro: '' } }];
`,
  };

  @node({ name: 'if-entrada-valida', type: 'n8n-nodes-base.if', version: 2.2 })
  IfEntradaValida = { /* $json.entrada_valida === true */ };

  // --- Perfil soap-onr / soap-cra: montar XML no Code ---
  @node({ name: 'montar-request-upstream', type: 'n8n-nodes-base.code', version: 2 })
  MontarRequestUpstream = {
    jsCode: `// retornar { xml_body, url, headers } ou body REST`,
  };

  @node({
    name: 'consumir-upstream',
    type: 'n8n-nodes-base.httpRequest',
    version: 4.4,
    onError: 'continueErrorOutput',
  })
  ConsumirUpstream = {
    method: 'POST',
    url: '={{ $json.url }}',
    sendBody: true,
    contentType: 'raw', // SOAP: raw + text/xml · REST: json
    body: '={{ $json.xml_body || $json.body }}',
    options: {},
  };

  @node({ name: 'converter-resposta', type: 'n8n-nodes-base.code', version: 2 })
  ConverterResposta = {
    jsCode: `
// XML ou JSON → { status_http, sucesso, codigo_erro, mensagem_erro, dados }
return [{ json: { status_http: 200, sucesso: true, codigo_erro: 0, mensagem_erro: '', dados: {} } }];
`,
  };

  @node({ name: 'resposta-validacao', type: 'n8n-nodes-base.code', version: 2 })
  RespostaValidacao = {
    jsCode: `return [{ json: { status_http: 400, sucesso: false, codigo_erro: 10, mensagem_erro: '...', dados: {} } }];`,
  };

  @node({ name: 'resposta-erro-conexao', type: 'n8n-nodes-base.code', version: 2 })
  RespostaErroConexao = {
    jsCode: `return [{ json: { status_http: 502, sucesso: false, codigo_erro: 0, mensagem_erro: 'Falha de conexão', dados: {} } }];`,
  };

  @node({ name: 'Respond to Webhook', type: 'n8n-nodes-base.respondToWebhook', version: 1.1 })
  RespondToWebhook = {
    respondWith: 'json',
    responseBody: '={{ $json }}',
    options: { responseCode: '={{ $json.status_http }}' },
  };

  @links()
  static connections = [
    ['Webhook', 'normalizar-entrada'],
    ['normalizar-entrada', 'validar-entrada'],
    ['validar-entrada', 'if-entrada-valida'],
    ['if-entrada-valida', 'montar-request-upstream', { output: 0 }],
    ['if-entrada-valida', 'resposta-validacao', { output: 1 }],
    ['montar-request-upstream', 'consumir-upstream'],
    ['consumir-upstream', 'converter-resposta', { output: 0 }],
    ['consumir-upstream', 'resposta-erro-conexao', { output: 1 }],
    ['converter-resposta', 'Respond to Webhook'],
    ['resposta-validacao', 'Respond to Webhook'],
    ['resposta-erro-conexao', 'Respond to Webhook'],
  ];
}
```

## REST simplificado

Quando não há montagem complexa, omitir `montar-request-upstream` e configurar `httpRequest` direto com expressões `={{ $json.campo }}` — ver `Auth CNIB.workflow.ts`.

## Helpers `status_http`

Copiar `mapearStatusHttp` do workflow âncora do perfil (Auth ONR para ONR; `mapearStatusHttpCra` para CRA; espelhar status REST quando aplicável).
