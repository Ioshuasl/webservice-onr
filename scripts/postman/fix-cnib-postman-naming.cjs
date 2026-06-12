#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const p = path.join(__dirname, '../../postman/cnib-n8n/collection_postman.json');
let c = fs.readFileSync(p, 'utf8');
c = c.replace(/AUTCNIB-1…148/g, 'AUTCNIB-1…6');
c = c.replace(/\(API CNIB\)/g, '(cnib)');
c = c.replace(
  /## Workflows cobertos \(AUTCNIB-1…6\)[\s\S]*?## Pastas/,
  `## Workflows cobertos (AUTCNIB-1…6)

| AUTCNIB | Operação | Webhook n8n |
|---------|----------|-------------|
| 1 | AuthToken | POST /cnib/auth/token |
| 2 | Consultar | POST /cnib/ordem/consultar |
| 3 | VisualizarOrdens | POST /cnib/ordem/visualizar |
| 4 | ResponderOrdem | POST /cnib/ordem/responder |
| 5 | ResponderLista | POST /cnib/ordem/responder/lista |
| 6 | DocumentosTipos | POST /cnib/documentos/tipos |

## Pastas`,
);
fs.writeFileSync(p, c);
console.log('fixed', p);
