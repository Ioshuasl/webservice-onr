# Template — workflow proxy CRA21 (n8n-as-code)

Referência mínima. Substituir `<SoapOp>`, `<slug>`, campos e ramos conforme vault `metodos/<Operacao>.md` e `scripts/cra/soap-requests/<SoapOp>.xml`.

## Esqueleto de classe

```typescript
import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : [AUTONR-142] (webservice CRA) ConsultaJustificativa - Consulta
// Nodes   : N  |  Connections: ...
// </workflow-map>

@workflow({
  id: '<id-n8n>',
  name: '[AUTONR-142] (webservice CRA) ConsultaJustificativa - Consulta',
  active: false,
  settings: { executionOrder: 'v1', binaryMode: 'separate' },
})
export class ConsultaJustificativaCraWorkflow {
  @node({ name: 'Webhook', type: 'n8n-nodes-base.webhook', version: 2.1 })
  Webhook = {
    httpMethod: 'POST',
    path: 'cra/consulta-justificativa',
    authentication: 'basicAuth',
    responseMode: 'responseNode',
    options: {},
  };

  @node({ name: 'normalizar-entrada', type: 'n8n-nodes-base.set', version: 3.4 })
  NormalizarEntrada = {
    mode: 'raw',
    jsonOutput: `={{
  {
    operacao: 'ConsultaJustificativa',
    soap_op: 'ConsultaJustificativa',
    ambiente: $json.body?.ambiente || $env.CRA_AMBIENTE || 'homologacao',
    uf: String($json.body?.uf || $env.CRA_UF || 'go').toLowerCase(),
    usuario_cra: $json.body?.usuario_cra || $env.CRA_USER || '',
    senha_cra: $json.body?.senha_cra || $env.CRA_PASS || ''
  }
}}`,
    options: {},
  };

  @node({ name: 'validar-entrada', type: 'n8n-nodes-base.code', version: 2 })
  ValidarEntrada = {
    jsCode: `const item = $input.first().json;
const erros = [];
if (!item.usuario_cra) erros.push('usuario_cra');
if (!item.senha_cra) erros.push('senha_cra');
if (!item.uf) erros.push('uf');
const entrada_valida = erros.length === 0;
return [{
  json: {
    ...item,
    entrada_valida,
    codigo_erro: entrada_valida ? 0 : 10,
    mensagem_erro: entrada_valida ? '' : 'Campos obrigatórios: ' + erros.join(', ')
  }
}];`,
  };

  @node({ name: 'if-entrada-valida', type: 'n8n-nodes-base.if', version: 2.2 })
  IfEntradaValida = {
    conditions: {
      options: { caseSensitive: true, leftValue: '', typeValidation: 'strict', version: 2 },
      conditions: [{
        leftValue: '={{ $json.entrada_valida }}',
        rightValue: '',
        operator: { type: 'boolean', operation: 'true', singleValue: true },
      }],
      combinator: 'and',
    },
    options: {},
  };

  @node({ name: 'montar-soap-cra', type: 'n8n-nodes-base.code', version: 2 })
  MontarSoapCra = {
    jsCode: `const item = $input.first().json;
const prod = item.ambiente === 'producao';
const host = prod ? 'crabr.com.br' : 'cra21.com.br';
const ns = \`urn:cra\${item.uf}.\${host}\`;
const url = \`https://cra\${item.uf}.\${host}/cra\${item.uf}/xml/protestos.php\`;
const soapAction = ns + '#ConsultaJustificativa';
const body = \`<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="\${ns}">
  <soapenv:Header/>
  <soapenv:Body>
    <urn:ConsultaJustificativa soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"/>
  </soapenv:Body>
</soapenv:Envelope>\`;
return [{ json: { ...item, cra_soap_url: url, cra_soap_action: soapAction, cra_soap_body: body } }];`,
  };

  @node({
    name: 'consumir-soap-cra',
    type: 'n8n-nodes-base.httpRequest',
    version: 4.4,
    onError: 'continueErrorOutput',
  })
  ConsumirSoapCra = {
    method: 'POST',
    url: '={{ $json.cra_soap_url }}',
    authentication: 'genericCredentialType',
    genericAuthType: 'httpBasicAuth',
    sendHeaders: true,
    headerParameters: {
      parameters: [
        { name: 'Content-Type', value: 'text/xml; charset=ISO-8859-1' },
        { name: 'SOAPAction', value: '={{ $json.cra_soap_action }}' },
      ],
    },
    sendBody: true,
    contentType: 'raw',
    rawContentType: 'text/xml',
    body: '={{ $json.cra_soap_body }}',
    options: { timeout: 1800000 },
  };

  @node({ name: 'converter-resposta-cra', type: 'n8n-nodes-base.code', version: 2 })
  ConverterRespostaCra = {
    jsCode: `function extrairTag(xml, tag) {
  const re = new RegExp('<' + tag + '[^>]*>([\\\\s\\\\S]*?)<\\\\/' + tag + '>', 'i');
  const m = String(xml || '').match(re);
  return m ? m[1].trim() : '';
}
function mapearStatusHttpCra(codigo, origem = 'cra') {
  if (origem === 'validacao') return 400;
  const c = String(codigo ?? '').trim();
  if (c === '0001') return 401;
  if (['0000', '0002', '0003'].includes(c)) return 200;
  if (!c) return 502;
  return 422;
}
const prev = $('montar-soap-cra').first().json;
const raw = $input.first().json?.data ?? $input.first().json?.body ?? '';
const xml = typeof raw === 'string' ? raw : String(raw);
const codigo = extrairTag(xml, 'codigo') || (xml.includes('0001') ? '0001' : '');
const mensagem = extrairTag(xml, 'ocorrencia') || extrairTag(xml, 'mensagem') || '';
const sucesso = ['0000', '0002', '0003'].includes(codigo);
const status_http = mapearStatusHttpCra(codigo);
return [{
  json: {
    status_http,
    sucesso,
    codigo: codigo || null,
    mensagem,
    operacao: prev.operacao,
    dados: { xml_parseado: xml.length > 0 },
  }
}];`,
  };

  @node({ name: 'resposta-validacao', type: 'n8n-nodes-base.code', version: 2 })
  RespostaValidacao = {
    jsCode: `const item = $input.first().json;
return [{
  json: {
    status_http: 400,
    sucesso: false,
    codigo: String(item.codigo_erro || 10),
    mensagem: item.mensagem_erro || 'Entrada inválida',
    operacao: item.operacao,
    dados: {}
  }
}];`,
  };

  @node({ name: 'resposta-erro-conexao-cra', type: 'n8n-nodes-base.code', version: 2 })
  RespostaErroConexaoCra = {
    jsCode: `return [{
  json: {
    status_http: 502,
    sucesso: false,
    codigo: null,
    mensagem: 'Falha ao conectar com o webservice CRA.',
    operacao: $('montar-soap-cra').first().json.operacao,
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
    this.IfEntradaValida.out(0).to(this.MontarSoapCra.in(0));
    this.IfEntradaValida.out(1).to(this.RespostaValidacao.in(0));
    this.MontarSoapCra.out(0).to(this.ConsumirSoapCra.in(0));
    this.ConsumirSoapCra.out(0).to(this.ConverterRespostaCra.in(0));
    this.ConsumirSoapCra.error().to(this.RespostaErroConexaoCra.in(0));
    this.ConverterRespostaCra.out(0).to(this.RespondToWebhook.in(0));
    this.RespostaValidacao.out(0).to(this.RespondToWebhook.in(0));
    this.RespostaErroConexaoCra.out(0).to(this.RespondToWebhook.in(0));
  }
}
```

## Variações por operação

### Upload (`Remessa`, `Desistencia`, …)

No `montar-soap-cra`, incluir parâmetros com CDATA:

```javascript
const userDados = item.user_dados;
const cdata = userDados.includes('<') ? userDados : `<![CDATA[${userDados}]]>`;
// dentro do envelope:
// <userArq xsi:type="xsd:string">${item.user_arq}</userArq>
// <userDados xsi:type="xsd:string">${cdata}</userDados>
```

### Download (`Confirmacao`, `Retorno`, `Andamento`)

Somente `<userArq xsi:type="xsd:string">…</userArq>`.

### `Homologadas`

```xml
<urn:Homologadas soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
  <codapres xsi:type="xsd:string">{{ codapres }}</codapres>
  <cartorios xsi:type="xsd:string">{{ cartorios || '0' }}</cartorios>
</urn:Homologadas>
```

### `Consulta`

```xml
<nossoNumero xsi:type="xsd:string">{{ nosso_numero }}</nossoNumero>
<numeroTitulo xsi:type="xsd:string">{{ numero_titulo }}</numeroTitulo>
```

### `Consulta_Slip`

Parâmetros WSDL: `codMunicipio`, `codCartorio`, `protocolo`, `dataProtocolo` (mapear de snake_case).

### `Instrumento`

Apenas `userDados` com XML `<instrumento>…</instrumento>` em CDATA.

### `BoletoAutorizacao`

```xml
<numeroTitulo xsi:type="xsd:string">{{ numero_titulo }}</numeroTitulo>
<documentoDevedor xsi:type="xsd:string">{{ documento_devedor }}</documentoDevedor>
```

## Credencial HTTP Basic CRA no n8n

Opção A (recomendada): credencial **HTTP Basic Auth** no n8n com `CRA_USER`/`CRA_PASS` do Easypanel; nó `consumir-soap-cra` referencia a credencial.

Opção B: montar header Authorization no `montar-soap-cra` a partir de `usuario_cra`/`senha_cra` (evitar logar senha).

## `mapearStatusHttpCra`

```javascript
function mapearStatusHttpCra(codigo, origem = 'cra') {
  if (origem === 'validacao') return 400;
  const c = String(codigo ?? '').trim();
  if (c === '0001') return 401;
  if (['0000', '0002', '0003'].includes(c)) return 200;
  if (!c) return 502;
  return 422;
}
```

Adaptar lista de códigos de sucesso por operação em `converter-resposta-cra` quando necessário (ex.: consulta sem título → sem `codigo` em `<relatorio>`).
