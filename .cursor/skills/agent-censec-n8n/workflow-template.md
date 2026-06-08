# Template — gateway CENSEC (n8n-as-code)

Referência para workflows REST JSON CENSEC. Canônico: `CENSEC Upload JSON Gateway.workflow.ts`.

## Esqueleto de roteamento

```typescript
@links()
defineRouting() {
  this.ReceiveCensecPayload.out(0).to(this.NormalizePayload.in(0));
  this.NormalizePayload.out(0).to(this.ValidateCepActs.in(0));
  this.ValidateCepActs.out(0).to(this.ValidateCesdiActs.in(0));
  this.ValidateCesdiActs.out(0).to(this.ValidateCtpDeclarations.in(0));
  this.ValidateCtpDeclarations.out(0).to(this.HasValidationErrors.in(0));
  this.HasValidationErrors.out(0).to(this.BuildValidationErrorResponse.in(0));
  this.HasValidationErrors.out(1).to(this.UploadJsonToCensec.in(0));
  this.BuildValidationErrorResponse.out(0).to(this.ReturnValidationError.in(0));
  this.UploadJsonToCensec.out(0).to(this.BuildUploadResponse.in(0));
  this.BuildUploadResponse.out(0).to(this.ReturnUploadResponse.in(0));
}
```

## Webhook

```typescript
@node({ name: 'Receive CENSEC Payload', type: 'n8n-nodes-base.webhook', version: 2.1 })
ReceiveCensecPayload = {
  httpMethod: 'POST',
  path: 'censec/cargas/upload-json',
  authentication: 'basicAuth',
  responseMode: 'responseNode',
};
```

## Normalize Payload (trecho)

```javascript
const rawBody = input.body ?? input;
const amb = resolveAmbiente(rawBody.ambiente); // homologacao | producao
const payload = { ...rawBody };
delete payload.ambiente;

return [{
  json: {
    payload,
    validation: { errors: [], warnings: [], hasErrors: false },
    meta: {
      ambiente: amb.key,
      censecBaseUrl: amb.baseUrl,
      censecUploadUrl: amb.baseUrl + '/api/cargas/upload-json',
      headers: input.headers ?? {},
    },
  },
}];
```

## Validador (padrão por módulo)

```javascript
function addError(path, code, message) {
  errors.push({ central: 'CEP', path, code, message });
}
// ... regras do módulo ...
item.validation.hasErrors = errors.length > 0;
return items;
```

## HTTP Request → CENSEC

```typescript
UploadJsonToCensec = {
  method: 'POST',
  url: '={{ $json.meta.censecUploadUrl }}',
  sendHeaders: true,
  headerParameters: {
    parameters: [
      { name: 'Content-Type', value: 'application/json' },
      { name: 'X-Api-Key', value: '={{ $json.meta.headers["x-api-key"] || $json.meta.headers["X-Api-Key"] }}' },
    ],
  },
  sendBody: true,
  contentType: 'json',
  jsonBody: '={{ $json.payload }}',
};
// onError: 'continueRegularOutput'
```

## Respond to Webhook

```typescript
ReturnUploadResponse = {
  respondWith: 'json',
  responseBody: '={{ $json.response }}',
  options: { responseCode: '={{ $json.statusCode || 200 }}' },
};

ReturnValidationError = {
  respondWith: 'json',
  responseBody: '={{ $json.response }}',
  options: { responseCode: 400 },
};
```

## Postman — test script mínimo

```javascript
pm.test('Resposta JSON válida', () => {
  const json = pm.response.json();
  pm.expect(json).to.have.property('success');
});
```
