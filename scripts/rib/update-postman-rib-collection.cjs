#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { formatAutonrRequestName } = require('../postman/postman-request-naming.cjs');

const COLLECTION_PATH = path.join(__dirname, '../../postman/RIB-n8n.postman_collection.json');

const TOKEN_PREREQUEST = [
  "function getVar(key) {",
  "  const fromEnv = pm.environment.get(key);",
  "  if (fromEnv !== undefined && fromEnv !== null && String(fromEnv).length > 0) return fromEnv;",
  "  return pm.collectionVariables.get(key);",
  "}",
  "if (!getVar('rib_access_token')) {",
  "  throw new Error('rib_access_token vazio. Execute [AUTONR-91] Auth Token primeiro.');",
  "}",
];

function ribRequest(cfg) {
  const events = [];
  if (cfg.needsToken) {
    events.push({ listen: 'prerequest', script: { type: 'text/javascript', exec: TOKEN_PREREQUEST } });
  }
  events.push({
    listen: 'test',
    script: {
      type: 'text/javascript',
      exec: [
        `pm.test('HTTP ${cfg.expectStatus}', () => pm.response.to.have.status(${cfg.expectStatus}));`,
        'const json = pm.response.json();',
        "pm.test('Resposta estruturada RIB', () => {",
        '  pm.expect(json).to.be.an(\'object\');',
        '  pm.expect(json.sucesso).to.eql(true);',
        '  pm.expect(json.meta).to.be.an(\'object\');',
        '});',
      ],
    },
  });

  const headers = [{ key: 'Accept', value: 'application/json' }];
  if (cfg.needsToken) headers.push({ key: 'X-RIB-Access-Token', value: '{{rib_access_token}}' });
  if (cfg.method === 'POST' || cfg.method === 'PATCH' || cfg.method === 'PUT') headers.push({ key: 'Content-Type', value: 'application/json' });

  const item = {
    name: formatAutonrRequestName(`AUTONR-${cfg.autonr}`, cfg.label),
    description: cfg.description,
    event: events,
    request: {
      method: cfg.method || 'GET',
      header: headers,
      url: cfg.url,
    },
  };

  if (cfg.body) {
    item.request.body = { mode: 'raw', raw: cfg.body, options: { raw: { language: 'json' } } };
  }
  return item;
}

const PROTOCOLO_ITEMS = [
  ribRequest({
    autonr: 92, label: 'Listagem Protocolos', needsToken: true, expectStatus: 200,
    description: 'GET /rib/protocolo → GET /v1/protocolo (RFP-05)',
    url: {
      raw: '{{n8n_base_url}}/{{n8n_webhook_mode}}/rib/protocolo?ambiente={{RIB_AMBIENTE}}&registrosPorPagina=50&numeroPagina=1',
      host: ['{{n8n_base_url}}'], path: ['{{n8n_webhook_mode}}', 'rib', 'protocolo'],
      query: [{ key: 'ambiente', value: '{{RIB_AMBIENTE}}' }, { key: 'registrosPorPagina', value: '50' }, { key: 'numeroPagina', value: '1' }],
    },
  }),
  ribRequest({
    autonr: 93, label: 'Detalhe Protocolo V2', needsToken: true, expectStatus: 200,
    description: 'GET /rib/protocolo/detalhes → GET /v2/protocolo/{numero}/detalhes (RFP-07). Ajuste query `numero`.',
    url: {
      raw: '{{n8n_base_url}}/{{n8n_webhook_mode}}/rib/protocolo/detalhes?ambiente={{RIB_AMBIENTE}}&numero=2024/123456&versao=2',
      host: ['{{n8n_base_url}}'], path: ['{{n8n_webhook_mode}}', 'rib', 'protocolo', 'detalhes'],
      query: [{ key: 'ambiente', value: '{{RIB_AMBIENTE}}' }, { key: 'numero', value: '2024/123456' }, { key: 'versao', value: '2' }],
    },
  }),
  ribRequest({
    autonr: 94, label: 'Token Detalhe Protocolo', needsToken: true, expectStatus: 201,
    description: 'POST /rib/protocolo/token → POST /v2/protocolo/{numero}/token (RFP-06/07)',
    url: '{{n8n_base_url}}/{{n8n_webhook_mode}}/rib/protocolo/token',
    body: '{\n  "ambiente": "{{RIB_AMBIENTE}}",\n  "numero": "2024/123456",\n  "senha": "senha-exemplo",\n  "tipoSolicitacao": 1,\n  "versao": 2\n}',
    method: 'POST',
  }),
  ribRequest({
    autonr: 95, label: 'Detalhe Basico Protocolo', needsToken: true, expectStatus: 200,
    description: 'GET /rib/protocolo/basico → GET /v1/protocolo/{numero} (RFP-06)',
    url: {
      raw: '{{n8n_base_url}}/{{n8n_webhook_mode}}/rib/protocolo/basico?ambiente={{RIB_AMBIENTE}}&numero=2024/123456',
      host: ['{{n8n_base_url}}'], path: ['{{n8n_webhook_mode}}', 'rib', 'protocolo', 'basico'],
      query: [{ key: 'ambiente', value: '{{RIB_AMBIENTE}}' }, { key: 'numero', value: '2024/123456' }],
    },
  }),
  ribRequest({
    autonr: 96, label: 'Download Anexo Protocolo', needsToken: true, expectStatus: 200,
    description: 'GET /rib/protocolo/download → GET /v1/protocolo/{numero}/download/{hash}',
    url: {
      raw: '{{n8n_base_url}}/{{n8n_webhook_mode}}/rib/protocolo/download?ambiente={{RIB_AMBIENTE}}&numero=2024/123456&hash_arquivo=hash-exemplo',
      host: ['{{n8n_base_url}}'], path: ['{{n8n_webhook_mode}}', 'rib', 'protocolo', 'download'],
      query: [{ key: 'ambiente', value: '{{RIB_AMBIENTE}}' }, { key: 'numero', value: '2024/123456' }, { key: 'hash_arquivo', value: 'hash-exemplo' }],
    },
  }),
  ribRequest({
    autonr: 97, label: 'Envio Protocolo Online', needsToken: true, expectStatus: 201,
    description: 'POST /rib/protocolo/envio → POST /v1/protocolo (RFP-01)',
    url: '{{n8n_base_url}}/{{n8n_webhook_mode}}/rib/protocolo/envio',
    method: 'POST',
    body: '{\n  "ambiente": "{{RIB_AMBIENTE}}",\n  "protocolo": "2024/999001",\n  "tipoSolicitacao": 1,\n  "apresentante": { "documento": "12345678901" },\n  "datas": { "protocolo": "2026-06-05" },\n  "status": { "codigo": 1, "dataStatus": "2026-06-05" }\n}',
  }),
  ribRequest({
    autonr: 98, label: 'Envio Protocolo Lote', needsToken: true, expectStatus: 202,
    description: 'POST /rib/protocolo/lote → POST /v1/protocolo/lote (RFP-02)',
    url: '{{n8n_base_url}}/{{n8n_webhook_mode}}/rib/protocolo/lote',
    method: 'POST',
    body: '{\n  "ambiente": "{{RIB_AMBIENTE}}",\n  "lote": [\n    {\n      "protocolo": "2024/999002",\n      "tipoSolicitacao": 1,\n      "apresentante": { "documento": "12345678901" },\n      "datas": { "protocolo": "2026-06-05" },\n      "status": { "codigo": 1, "dataStatus": "2026-06-05" }\n    }\n  ]\n}',
  }),
  ribRequest({
    autonr: 101, label: 'Exclusao Protocolo', needsToken: true, expectStatus: 200,
    description: 'DELETE /rib/protocolo/exclusao → DELETE /v1/protocolo/{numero} (RFP-04)',
    method: 'DELETE',
    url: {
      raw: '{{n8n_base_url}}/{{n8n_webhook_mode}}/rib/protocolo/exclusao?ambiente={{RIB_AMBIENTE}}&numero=2024/123456',
      host: ['{{n8n_base_url}}'], path: ['{{n8n_webhook_mode}}', 'rib', 'protocolo', 'exclusao'],
      query: [{ key: 'ambiente', value: '{{RIB_AMBIENTE}}' }, { key: 'numero', value: '2024/123456' }],
    },
  }),
];

const FILA_ITEMS = [
  ribRequest({
    autonr: 99, label: 'Listagem Fila Protocolo', needsToken: true, expectStatus: 200,
    description: 'GET /rib/fila/processamento/protocolo → GET /v1/fila/processamento/protocolo (RFF-01)',
    url: {
      raw: '{{n8n_base_url}}/{{n8n_webhook_mode}}/rib/fila/processamento/protocolo?ambiente={{RIB_AMBIENTE}}&registrosPorPagina=50&numeroPagina=1',
      host: ['{{n8n_base_url}}'], path: ['{{n8n_webhook_mode}}', 'rib', 'fila', 'processamento', 'protocolo'],
      query: [{ key: 'ambiente', value: '{{RIB_AMBIENTE}}' }, { key: 'registrosPorPagina', value: '50' }, { key: 'numeroPagina', value: '1' }],
    },
  }),
  ribRequest({
    autonr: 100, label: 'Detalhe Fila Protocolo', needsToken: true, expectStatus: 200,
    description: 'GET /rib/fila/processamento/protocolo/detalhe → GET /v1/fila/.../{hash} (RFF-02)',
    url: {
      raw: '{{n8n_base_url}}/{{n8n_webhook_mode}}/rib/fila/processamento/protocolo/detalhe?ambiente={{RIB_AMBIENTE}}&hash_fila=hash-exemplo',
      host: ['{{n8n_base_url}}'], path: ['{{n8n_webhook_mode}}', 'rib', 'fila', 'processamento', 'protocolo', 'detalhe'],
      query: [{ key: 'ambiente', value: '{{RIB_AMBIENTE}}' }, { key: 'hash_fila', value: 'hash-exemplo' }],
    },
  }),
];

const COBRANCA_TIPO_ITEMS = [
  ribRequest({
    autonr: 120, label: 'Listagem Tipos Pagamento', needsToken: true, expectStatus: 200,
    description: 'GET /rib/cobranca/tipo/pagamento → GET /v1/cobranca/tipo/pagamento (RFC-05)',
    url: {
      raw: '{{n8n_base_url}}/{{n8n_webhook_mode}}/rib/cobranca/tipo/pagamento?ambiente={{RIB_AMBIENTE}}&status=1&registrosPorPagina=50&numeroPagina=1',
      host: ['{{n8n_base_url}}'],
      path: ['{{n8n_webhook_mode}}', 'rib', 'cobranca', 'tipo', 'pagamento'],
      query: [
        { key: 'ambiente', value: '{{RIB_AMBIENTE}}' },
        { key: 'status', value: '1' },
        { key: 'registrosPorPagina', value: '50' },
        { key: 'numeroPagina', value: '1' },
      ],
    },
  }),
];

const COBRANCA_CORE_ITEMS = [
  ribRequest({
    autonr: 121, label: 'Listagem Cobrancas', needsToken: true, expectStatus: 200,
    description: 'GET /rib/cobranca → GET /v1/cobranca (RFC-02)',
    url: {
      raw: '{{n8n_base_url}}/{{n8n_webhook_mode}}/rib/cobranca?ambiente={{RIB_AMBIENTE}}&registrosPorPagina=50&numeroPagina=1',
      host: ['{{n8n_base_url}}'],
      path: ['{{n8n_webhook_mode}}', 'rib', 'cobranca'],
      query: [
        { key: 'ambiente', value: '{{RIB_AMBIENTE}}' },
        { key: 'registrosPorPagina', value: '50' },
        { key: 'numeroPagina', value: '1' },
      ],
    },
  }),
  ribRequest({
    autonr: 122, label: 'Detalhe Cobranca', needsToken: true, expectStatus: 200,
    description: 'GET /rib/cobranca/detalhes → GET /v1/cobranca/{hash} (RFC-03). Use hash de AUTONR-121 ou rib_hash_cobranca.',
    url: {
      raw: '{{n8n_base_url}}/{{n8n_webhook_mode}}/rib/cobranca/detalhes?ambiente={{RIB_AMBIENTE}}&hash_cobranca={{rib_hash_cobranca}}',
      host: ['{{n8n_base_url}}'],
      path: ['{{n8n_webhook_mode}}', 'rib', 'cobranca', 'detalhes'],
      query: [
        { key: 'ambiente', value: '{{RIB_AMBIENTE}}' },
        { key: 'hash_cobranca', value: '{{rib_hash_cobranca}}' },
      ],
    },
  }),
  (() => {
    const item = ribRequest({
      autonr: 123,
      label: 'Geracao Cobranca',
      needsToken: true,
      expectStatus: 201,
      description: 'POST /rib/cobranca → POST /v1/cobranca (RFC-01). Ajuste servicos[].codigo e valores conforme homologação.',
      method: 'POST',
      url: '{{n8n_base_url}}/{{n8n_webhook_mode}}/rib/cobranca',
      body: [
        '{',
        '  "ambiente": "{{RIB_AMBIENTE}}",',
        '  "tipo_cobranca": "PIX",',
        '  "data_vencimento": "2026-09-15",',
        '  "observacao": "Emolumentos",',
        '  "identificador_cliente": "ORIUS-PEDIDO-8842",',
        '  "tipo_pagamento": 1,',
        '  "dados_pagador": {',
        '    "nome": "Joao Pagador",',
        '    "documento": "98765432100",',
        '    "email": "joao@exemplo.com",',
        '    "telefone": { "ddd": 11, "numero": 987654321 },',
        '    "endereco": {',
        '      "cep": "01310100",',
        '      "tipo_logradouro": "Avenida",',
        '      "logradouro": "Paulista",',
        '      "numero": "1000",',
        '      "bairro": "Bela Vista",',
        '      "cidade": "Sao Paulo",',
        '      "estado": "SP"',
        '    }',
        '  },',
        '  "servicos": [',
        '    { "codigo": 2024123456, "valor": 150000 }',
        '  ]',
        '}',
      ].join('\n'),
    });
    item.event.push({
      listen: 'test',
      script: {
        type: 'text/javascript',
        exec: [
          "const json = pm.response.json();",
          "if (json.hash_cobranca) {",
          "  pm.collectionVariables.set('rib_hash_cobranca', json.hash_cobranca);",
          "  pm.environment.set('rib_hash_cobranca', json.hash_cobranca);",
          "}",
        ],
      },
    });
    return item;
  })(),
  ribRequest({
    autonr: 124,
    label: 'Cancelamento Cobranca',
    needsToken: true,
    expectStatus: 200,
    description: 'PATCH /rib/cobranca/cancelamento → PATCH /v1/cobranca/{hash} (RFC-04). Use hash de AUTONR-123 ou rib_hash_cobranca.',
    method: 'PATCH',
    url: '{{n8n_base_url}}/{{n8n_webhook_mode}}/rib/cobranca/cancelamento',
    body: '{\n  "ambiente": "{{RIB_AMBIENTE}}",\n  "hash_cobranca": "{{rib_hash_cobranca}}"\n}',
  }),
  ribRequest({
    autonr: 125,
    label: 'Devolucao Pix',
    needsToken: true,
    expectStatus: 200,
    description: 'POST /rib/cobranca/devolucao-pix → PUT /v1/cobranca/{hash}/pix/devolucao (RFC-06). Cobrança PIX paga; ajuste valor conforme saldo devolvível.',
    method: 'POST',
    url: '{{n8n_base_url}}/{{n8n_webhook_mode}}/rib/cobranca/devolucao-pix',
    body: '{\n  "ambiente": "{{RIB_AMBIENTE}}",\n  "hash_cobranca": "{{rib_hash_cobranca}}",\n  "valor": 100000\n}',
  }),
  (() => {
    const item = ribRequest({
      autonr: 126,
      label: 'Cadastramento Cobranca Externa',
      needsToken: true,
      expectStatus: 201,
      description: 'POST /rib/cobranca/externa → POST /v1/cobranca/cadastrar (cobrança externa). Requer liberação RIB no cartório; ajuste editais[] conforme homologação.',
      method: 'POST',
      url: '{{n8n_base_url}}/{{n8n_webhook_mode}}/rib/cobranca/externa',
      body: [
        '{',
        '  "ambiente": "{{RIB_AMBIENTE}}",',
        '  "editais": ["edital-hash-exemplo"],',
        '  "valor": 100000,',
        '  "url": "https://pagamento.exemplo.com/boleto/12345",',
        '  "data_geracao": "2026-06-10 14:30:00",',
        '  "data_vencimento": "2026-07-10",',
        '  "numero_pagamento": "NOSSO-NUMERO-12345",',
        '  "descricao": "Cobranca externa registrada no Orius",',
        '  "dados_pagador": {',
        '    "nome": "Joao Pagador",',
        '    "documento": "98765432100",',
        '    "email": "joao@exemplo.com",',
        '    "telefone": { "ddd": 11, "numero": 987654321 },',
        '    "endereco": {',
        '      "cep": "01310100",',
        '      "tipo_logradouro": "Avenida",',
        '      "logradouro": "Paulista",',
        '      "numero": "1000",',
        '      "bairro": "Bela Vista",',
        '      "cidade": "Sao Paulo",',
        '      "estado": "SP"',
        '    }',
        '  }',
        '}',
      ].join('\n'),
    });
    item.event.push({
      listen: 'test',
      script: {
        type: 'text/javascript',
        exec: [
          "const json = pm.response.json();",
          "if (json.hash_cobranca) {",
          "  pm.collectionVariables.set('rib_hash_cobranca', json.hash_cobranca);",
          "  pm.environment.set('rib_hash_cobranca', json.hash_cobranca);",
          "}",
        ],
      },
    });
    return item;
  })(),
];

const COBRANCA_PROTOCOLO_ITEMS = [
  ribRequest({
    autonr: 102, label: 'Atualizar Protocolo Cobranca', needsToken: true, expectStatus: 200,
    description: 'PATCH /rib/cobranca/protocolo → PATCH /v1/cobranca/{hash}/protocolo (RFC-07)',
    method: 'PATCH',
    url: '{{n8n_base_url}}/{{n8n_webhook_mode}}/rib/cobranca/protocolo',
    body: '{\n  "ambiente": "{{RIB_AMBIENTE}}",\n  "hash_cobranca": "hash-cobranca-exemplo",\n  "protocolo": "2024/123456"\n}',
  }),
];

const WORKFLOW_TABLE = `| AUTONR | Workflow | ID | Webhook |
|--------|----------|-----|---------|
| 91 | AuthToken | Idas4wAPEfIA17xq | POST /rib/auth/token |
| 92 | ListagemProtocolos | Sw88u5Dn1Wnbs9c6 | GET /rib/protocolo |
| 93 | DetalheProtocoloV2 | 6imnqEJHXSvp2EAX | GET /rib/protocolo/detalhes |
| 94 | TokenDetalheProtocolo | HMpCCRnGi6yitVy4 | POST /rib/protocolo/token |
| 95 | DetalheBasicoProtocolo | w9DuDDE9e74jFwVl | GET /rib/protocolo/basico |
| 96 | DownloadAnexoProtocolo | uSexWi4TgIUZ0xno | GET /rib/protocolo/download |
| 97 | EnvioProtocoloOnline | lGuyT9TxzELzUHa4 | POST /rib/protocolo/envio |
| 98 | EnvioProtocoloLote | H8gMs70WzJW2uVlJ | POST /rib/protocolo/lote |
| 99 | ListagemFilaProtocolo | 3G5maOXe8FOoJksV | GET /rib/fila/processamento/protocolo |
| 100 | DetalheFilaProtocolo | Z0jlhH7XDrY9KKUa | GET /rib/fila/processamento/protocolo/detalhe |
| 101 | ExclusaoProtocolo | rPEIpPQRxOvda4ya | DELETE /rib/protocolo/exclusao |
| 102 | AtualizarProtocoloCobranca | anWU5nm66RxqPKPh | PATCH /rib/cobranca/protocolo |
| 120 | ListagemTiposPagamento | 1C9hQMPCfrBuaJ78 | GET /rib/cobranca/tipo/pagamento |
| 121 | ListagemCobrancas | zWqpw3J2H21zZIxl | GET /rib/cobranca |
| 122 | DetalheCobranca | vdX5HRRokKzYiMEn | GET /rib/cobranca/detalhes |
| 123 | GeracaoCobranca | dCoacaX1Oj0hBOm5 | POST /rib/cobranca |
| 124 | CancelamentoCobranca | TcPxms2EcnItTasU | PATCH /rib/cobranca/cancelamento |
| 125 | DevolucaoPix | ZCsiyyLsJkOzUIdV | POST /rib/cobranca/devolucao-pix |
| 126 | CadastramentoCobranca | WXOPh0N92vCWkh5B | POST /rib/cobranca/externa |`;

const COLLECTION_VAR_DEFAULTS = [
  { key: 'rib_hash_cobranca', value: '', type: 'string' },
];

const collection = JSON.parse(fs.readFileSync(COLLECTION_PATH, 'utf8'));
collection.variable = collection.variable ?? [];
for (const def of COLLECTION_VAR_DEFAULTS) {
  if (!collection.variable.some((v) => v.key === def.key)) {
    collection.variable.push(def);
  }
}
collection.info.description = collection.info.description.replace(
  /\| Módulo[\s\S]*?\| \*\*protocolo\*\*[\s\S]*?\| `GET \/v1\/protocolo` \|/,
  WORKFLOW_TABLE.split('\n').slice(2).join('\n').replace(/^\|/, '| Módulo | Workflow | ID | Webhook |\n|--------|----------|-----|---------|')
);

// Rebuild description workflows section more cleanly
const descParts = collection.info.description.split('## Workflows cobertos');
const prefix = descParts[0];
const suffix = descParts[1].split('## Pré-requisitos');
collection.info.description = `${prefix}## Workflows cobertos\n\n${WORKFLOW_TABLE}\n\n## Pré-requisitos${suffix[1]}`;

for (const folder of collection.item) {
  if (folder.name === 'protocolo') {
    folder.description = 'Módulo **protocolo** (RFP-01…07). Uma request por AUTONR. Pré-requisito: **AUTONR-91**.';
    folder.item = PROTOCOLO_ITEMS;
  }
  if (folder.name === 'fila-processamento') {
    folder.description = 'Módulo **fila** (RFF-01/02). Uma request por AUTONR.';
    folder.item = FILA_ITEMS;
  }
  if (folder.name === 'cobranca') {
    folder.description = 'Módulo **cobrança** (RFC-01…07). Uma request por AUTONR. Pré-requisito: **AUTONR-91**.';
    folder.item = [
      ...COBRANCA_CORE_ITEMS,
      {
        name: 'tipo',
        description: 'RFC-05 — tipos de pagamento.',
        item: COBRANCA_TIPO_ITEMS,
      },
      {
        name: 'protocolo',
        description: 'RFC-07 — vínculo protocolo na cobrança.',
        item: COBRANCA_PROTOCOLO_ITEMS,
      },
    ];
  }
}

fs.writeFileSync(COLLECTION_PATH, JSON.stringify(collection, null, 2) + '\n', 'utf8');
console.log('Postman collection atualizada:', COLLECTION_PATH);
