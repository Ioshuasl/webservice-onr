/**
 * Metadados compartilhados da coleção ONR WebService n8n (variáveis explícitas).
 */
const path = require("path");

const ROOT = path.resolve(__dirname, "../..");
const POSTMAN = path.join(ROOT, "postman");

const COLLECTION_NAME = "ONR WebService — n8n (variáveis explícitas)";
const COLLECTION_FILE_EXPLICITAS = "onr-webservice-n8n-variaveis-explicitas.postman_collection.json";
const COLLECTION_FILE_LEGACY = "onr-webservice-n8n.postman_collection.json";

const COLLECTION_DESCRIPTION = `Coleção unificada dos webhooks n8n e referência SOAP para o **WSOficio ONR** (homologação).

## Variáveis explícitas (substituição total)

O bloco \`variable\` deste JSON é a **lista completa** de Collection variables. Ao importar no Postman, escolha **Replace** na coleção existente (mesmo \`_postman_id\`) para **sobrescrever todas** as variáveis da coleção com os valores do arquivo.

Fonte no build: \`onr-webservice-n8n.postman_environment.template.json\` + webhooks dos workflows + chaves \`{{…}}\` usadas nos requests. **Não** importa environment para carregar defaults HML.

Environment separado: opcional só para secrets/overrides locais (não substitui o conjunto da coleção na importação).

## Domínios (pastas)

| Pasta | Serviço |
|-------|---------|
| 3.1 Login | \`login.asmx\` |
| 3.2 Acompanhamento de Títulos | \`acompanhamentotitulos.asmx\` |
| 3.3 Penhora Online | \`penhoraonline.asmx\` |
| 3.5 Ofícios | \`oficios.asmx\` |
| 3.6 Certidões a Emitir | \`Certidoes.asmx\` |
| 3.9 Matrícula Online | \`matriculaonline.asmx\` |
| 3.11 Intimações | \`intimacoes.asmx\` |
| 3.12 Comunicação Prefeituras (CTP) | \`ComunicacaoMunicipios.asmx\` |

## Fluxo recomendado

1. Preencha certificado e \`ONR_SERVENTIA_CHAVE\` nas **Collection variables**
2. **3.1 Login → n8n — Auth ONR** (grava \`onr_hash\` na coleção)
3. Execute requests do domínio desejado

## Regenerar

\`npm run postman:build:onr\`

Arquivo canônico: \`${COLLECTION_FILE_EXPLICITAS}\` (cópia espelhada em \`${COLLECTION_FILE_LEGACY}\` para sync legado).

## Sync Postman Cloud

\`npm run postman:sync\``;

function collectionOutputPaths() {
  return [
    path.join(POSTMAN, COLLECTION_FILE_EXPLICITAS),
    path.join(POSTMAN, COLLECTION_FILE_LEGACY),
  ];
}

function writeCollectionJson(collection) {
  const fs = require("fs");
  const json = JSON.stringify(collection, null, 2) + "\n";
  for (const p of collectionOutputPaths()) {
    fs.writeFileSync(p, json, "utf8");
  }
}

module.exports = {
  COLLECTION_NAME,
  COLLECTION_FILE_EXPLICITAS,
  COLLECTION_FILE_LEGACY,
  COLLECTION_DESCRIPTION,
  POSTMAN,
  collectionOutputPaths,
  writeCollectionJson,
};
