const https = require('https');
const fs = require('fs');
const path = require('path');

const url = 'https://servicosh.registrocivil.org.br/api/proclama/doc/swagger-ui-init.js';
const out = path.join(__dirname, 'proclama-swagger.json');

https.get(url, (res) => {
  let data = '';
  res.on('data', (c) => (data += c));
  res.on('end', () => {
    const marker = '"swaggerDoc":';
    const start = data.indexOf(marker);
    if (start < 0) throw new Error('swaggerDoc not found');

    let i = data.indexOf('{', start);
    let depth = 0;
    let inString = false;
    let escape = false;

    for (; i < data.length; i++) {
      const ch = data[i];
      if (inString) {
        if (escape) escape = false;
        else if (ch === '\\') escape = true;
        else if (ch === '"') inString = false;
        continue;
      }
      if (ch === '"') {
        inString = true;
        continue;
      }
      if (ch === '{') depth++;
      else if (ch === '}') {
        depth--;
        if (depth === 0) {
          const json = data.slice(data.indexOf('{', start), i + 1);
          const doc = JSON.parse(json);
          fs.writeFileSync(out, JSON.stringify(doc, null, 2), 'utf8');
          console.log('Saved:', out);
          console.log('Paths:', Object.keys(doc.paths).join(', '));
          return;
        }
      }
    }
    throw new Error('Could not parse swaggerDoc object');
  });
}).on('error', (err) => {
  console.error(err);
  process.exit(1);
});
