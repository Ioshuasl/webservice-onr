/**
 * Constantes e builders — coleções Postman no repo N8N (GitHub Orius).
 */
const path = require('path');

const N8N_GIT = {
  remote: 'https://git.oriustecnologia.com/OriusTecnologia/N8N.git',
  web: 'https://git.oriustecnologia.com/OriusTecnologia/N8N',
  branch: 'main',
};

const POSTMAN_BY_MOD = {
  auth: {
    path: 'WebService ONR/Auth/postman/Auth-ONR-n8n.postman_collection.json',
    folder: 'Auth ONR',
    unified: 'WebService ONR/Certidoes/postman/onr-webservice-n8n.postman_collection.json',
    unifiedFolder: '3.1 Login',
  },
  AT: {
    path: 'WebService ONR/Acompanhamento de titulos/postman/Acompanhamento-Titulos-AT-n8n.postman_collection.json',
    folder: '3.2 Acompanhamento de Títulos',
    unified: 'WebService ONR/Certidoes/postman/onr-webservice-n8n.postman_collection.json',
    unifiedFolder: '3.2 Acompanhamento de Títulos',
  },
  PO: {
    path: 'WebService ONR/Penhora Online/postman/Penhora-Online-PO-n8n.postman_collection.json',
    folder: '3.3 Penhora Online',
    unified: 'WebService ONR/Certidoes/postman/onr-webservice-n8n.postman_collection.json',
    unifiedFolder: '3.3 Penhora Online',
  },
  OE: {
    path: 'WebService ONR/Oficios/postman/Oficios-OE-n8n.postman_collection.json',
    folder: '3.5 Ofícios',
    unified: 'WebService ONR/Certidoes/postman/onr-webservice-n8n.postman_collection.json',
    unifiedFolder: '3.5 Ofícios',
  },
  certidoes: {
    path: 'WebService ONR/Certidoes/postman/onr-webservice-n8n.postman_collection.json',
    folder: '3.6 Certidões a Emitir',
  },
  CCN: {
    path: 'CCN/postman/CCN-Upload-XML-n8n.postman_collection.json',
    folder: 'CCN Upload XML',
  },
  CENSEC: {
    path: 'Censec/postman/censec-n8n.postman_collection.json',
    folder: 'CENSEC',
  },
  DOI: {
    path: 'DOI/postman/DOI-Validate-JSON-n8n.postman_collection.json',
    folder: 'DOI Validate JSON',
  },
  SIGEF: {
    path: 'SIGEF/postman/Parse-Memorial-SIGEF-n8n.postman_collection.json',
    folder: 'Parse Memorial SIGEF',
  },
};

/** request Postman por operação (quando o nome não segue o padrão automático). */
const OP_POSTMAN_REQUEST = {
  LoginUsuarioCertificado: 'Auth ONR — Login',
  ObterXMLSolicitacoes_v6: 'Obter XML Solicitacoes v6',
  DevolverCertidao: 'Devolver Certidao',
  CCN_Uploads: 'Upload XML CCN — HML',
  CCN_ImportsGet: 'Get Import Status — HML',
  CCN_ImportsErros: 'Get Import Erros — HML',
  CENSEC_UploadJSON: 'Upload JSON — Payload completo',
  DOI_ValidateJSON: 'Payload válido — Notarial (exemplo)',
  ParseMemorialSIGEF: 'Parse Memorial SIGEF — PDF',
  InsertStatusAT: 'Insert Status AT — Cadastrar',
  UpdateStatusAT: 'Update Status AT — Atualizar',
  ListPedidosPO: 'List Pedidos PO — Listar',
  GetPedidoPO: 'Get Pedido PO — Consultar',
  ListVarasPO: 'List Varas PO — Listar',
  SetPrenotacaoPO: 'Set Prenotacao PO — Prenotar',
  SetPenhoraAverbadoPO: 'Set Penhora Averbado PO — Averbar',
  SetPenhoraExigenciaPO: 'Set Penhora Exigencia PO — Exigência',
  SetPedidoPessoaDevolvidoPO: 'Set Pedido Pessoa Devolvido PO — Devolver',
  SetPedidoMatriculaRespondidoPO: 'Set Pedido Matricula Respondido PO — Responder',
  SetPedidoMatriculaDevolvidoPO: 'Set Pedido Matricula Devolvido PO — Devolver',
  GetPedidoOE: 'Get Pedido OE — Consultar',
  ListInstituicoesOE: 'List Instituicoes OE — Listar',
  ListPedidosOE: 'List Pedidos OE — Listar',
  SetPedidoRespondidoOE: 'Set Pedido Respondido OE — Responder',
  SetPedidoDevolvidoOE: 'Set Pedido Devolvido OE — Devolver',
  SetPedidoRetransmitidoOE: 'Set Pedido Retransmitido OE — Retransmitir',
  ListCartoriosRestransmitirOE: 'List Cartorios Restransmitir OE — Listar',
};

function gitBlobUrl(repoPath) {
  const encoded = repoPath.split('/').map(encodeURIComponent).join('/');
  return `${N8N_GIT.web}/-/blob/${N8N_GIT.branch}/${encoded}`;
}

function workflowFileToDisplayName(fileName) {
  return fileName.replace(/\.workflow\.ts$/i, '').trim();
}

function guessPostmanRequestName(workflowFileName, op) {
  if (OP_POSTMAN_REQUEST[op]) return OP_POSTMAN_REQUEST[op];
  const base = workflowFileToDisplayName(workflowFileName);
  const rules = [
    [/^List (.+) V2$/i, '$1 V2 — Listar'],
    [/^List /i, ' — Listar'],
    [/^Get /i, ' — Consultar'],
    [/^Insert /i, ' — Cadastrar'],
    [/^Update /i, ' — Atualizar'],
    [/^Delete /i, ' — Excluir'],
    [/^Set Baixa Boleto /i, ' — Baixar'],
    [/^Set Custas /i, ' — Informar'],
    [/^Set Pedido Pessoa Respondido /i, ' — Responder'],
    [/^Set Pedido Pessoa Devolvido /i, ' — Devolver'],
    [/^Set Pedido Matricula Respondido /i, ' — Responder'],
    [/^Set Pedido Matricula Devolvido /i, ' — Devolver'],
    [/^Set Pedido Negativa Lote /i, ' — Negativar'],
    [/^Set Pedido Finalizar Prenotacao Vencida/i, 'Set Pedido Finalizar Prenotacao Vencida — Finalizar'],
    [/^Set Pedido Respondido /i, ' — Responder'],
    [/^Set Pedido Devolvido /i, ' — Devolver'],
    [/^Set Pedido Retransmitido /i, ' — Retransmitir'],
    [/^Set Penhora Averbado /i, ' — Averbar'],
    [/^Set Penhora Exigencia /i, ' — Exigência'],
    [/^Set Prenotacao /i, ' — Prenotar'],
    [/^Obter XML Solicitacoes V6/i, 'Obter XML Solicitacoes v6'],
    [/^Devolver Certidao/i, 'Devolver Certidao'],
  ];
  for (const [re, suffix] of rules) {
    if (re.test(base)) {
      if (suffix.startsWith('Set ') || suffix.startsWith('Obter') || suffix.startsWith('Devolver')) {
        return suffix;
      }
      return base.replace(re, (m) => m.trim()) + suffix;
    }
  }
  return base;
}

function getBodyModes(mod, op) {
  if (mod === 'CCN' && op === 'CCN_Uploads') {
    return {
      primary: 'form-data',
      rows: [
        ['**Body → form-data**', '`file`', 'Arquivo `.xml` CCN (ISO-8859-1); `CCN_XML_PATH` no pre-request'],
      ],
      extraHeaders: [
        ['`X-Ambiente`', '`{{CCN_X_AMBIENTE}}`', 'sim'],
        ['`X-Ccn-Api-Key`', '`{{CCN_X_API_KEY}}`', 'sim'],
        ['`X-Ccn-Subscription`', '`{{CCN_X_SUBSCRIPTION}}`', 'sim (upload/import)'],
      ],
      authNote: 'Basic Auth (coleção) + headers CCN acima',
    };
  }
  if (mod === 'CENSEC') {
    return {
      primary: 'raw JSON',
      rows: [['**Body → raw → JSON**', 'application/json', 'Payload CENSEC (ex.: `cns`, atos)']],
      extraHeaders: [['`X-Api-Key`', '`{{CENSEC_API_KEY}}`', 'sim']],
      authNote: 'Basic Auth (webhook) + `X-Api-Key` CENSEC',
    };
  }
  if (mod === 'SIGEF') {
    return {
      primary: 'form-data',
      rows: [['**Body → form-data**', '`file`', 'PDF do memorial SIGEF']],
      extraHeaders: [],
      authNote: 'Basic Auth (webhook)',
    };
  }
  if (mod === 'auth') {
    return {
      primary: 'raw JSON',
      rows: [['**Body → raw → JSON**', 'application/json', 'Campos certificado: `assunto_certificado`, `chave_publica`, …']],
      extraHeaders: [],
      authNote: 'Basic Auth (webhook n8n)',
    };
  }
  return {
    primary: 'raw JSON',
    rows: [['**Body → raw → JSON**', 'application/json', 'Payload snake_case + `hash` (exceto Auth)']],
    extraHeaders: [],
    authNote: mod === 'CCN' || mod === 'DOI' ? 'Basic Auth + headers da integração' : 'Basic Auth + `hash` no body (ONR)',
  };
}

function buildPostmanGitSection(mod, op, workflowFileName) {
  const cfg = POSTMAN_BY_MOD[mod] || POSTMAN_BY_MOD.AT;
  const requestName = guessPostmanRequestName(workflowFileName, op);
  const collPath = cfg.path;
  const blob = gitBlobUrl(collPath);
  const unifiedNote =
    cfg.unified && mod !== 'certidoes' && mod !== 'CCN' && mod !== 'CENSEC' && mod !== 'DOI' && mod !== 'SIGEF'
      ? `\n| Coleção unificada (todos os módulos ONR) | [onr-webservice-n8n.postman_collection.json](${gitBlobUrl(cfg.unified)}) — pasta **${cfg.unifiedFolder}** |`
      : '';

  return `## Coleção Postman (repositório Git — fonte canônica)

> Todas as coleções versionadas ficam no repo **N8N** (branch \`main\`). Espelho local após \`git pull\`: \`orius N8N/\` no repo \`automacoes e testes\` ou clone em \`projetos-orius/N8N\`.

| Item | Valor |
|------|-------|
| Repositório | [OriusTecnologia/N8N](${N8N_GIT.remote}) |
| Branch | \`${N8N_GIT.branch}\` |
| Arquivo da coleção | [\`${collPath}\`](${blob}) |
| Pasta / domínio | **${cfg.folder}** |
| Request | **${requestName}** |
| Variáveis | Aba **Collection variables** da coleção (HML); environment Postman opcional |
| Sync dev → Git | \`npm run n8n:sync:postman:orius\` (a partir de \`automacoes e testes\`) |${unifiedNote}

\`\`\`bash
git clone ${N8N_GIT.remote}
cd N8N && git checkout ${N8N_GIT.branch} && git pull origin ${N8N_GIT.branch}
\`\`\`

Importar no Postman: **Import** → arquivo \`.postman_collection.json\` do path acima no repositório clonado.`;
}

function buildRequestDefinitionSection({
  mod,
  op,
  webhookProd,
  webhookTest,
  workflowFileName = '',
  method = 'POST',
  jsonExample,
  bodyModes,
}) {
  const bm = bodyModes || getBodyModes(mod, op);
  const headerRows = [
    ['`Content-Type`', 'application/json', 'sim (body JSON)'],
    ...bm.extraHeaders,
  ];
  const headerTable = headerRows
    .map((r) => `| ${r[0]} | ${r[1]} | ${r[2]} |`)
    .join('\n');

  const bodyTable = bm.rows.map((r) => `| ${r[0]} | ${r[1]} | ${r[2]} |`).join('\n');

  const queryNote =
    mod === 'CCN' && op !== 'CCN_Uploads'
      ? '| **Params** | `importId` ou path na URL conforme request Postman | — |'
      : '| — | — | Esta operação não usa query/path params no webhook |';

  return `## Definição da requisição (Postman e HTTP)

> No Postman, configure **Authorization**, **Headers**, **Params** e **Body** conforme a tabela. O request **${guessPostmanRequestName(workflowFileName, op)}** na coleção Git já traz o preset; use esta seção como referência unificada.

### Método e URL

| Item | Valor |
|------|-------|
| Método | \`${method}\` |
| Produção | \`${webhookProd}\` |
| Teste (editor n8n) | \`${webhookTest}\` |
| Modo teste | \`n8n_webhook_mode=webhook-test\` + **Execute workflow** |

### Autenticação (aba Authorization / credenciais)

| Camada | Tipo Postman | Configuração |
|--------|--------------|--------------|
| Webhook n8n | **Basic Auth** | Username \`{{N8N_BASIC_AUTH_USER}}\` · Password \`{{N8N_BASIC_AUTH_PASSWORD}}\` |
| Upstream | — | ${bm.authNote} |

> Coleção: auth herdada em **Collection** → Authorization; pode sobrescrever no request.

### Headers (aba Headers)

| Header | Valor | Obrigatório |
|--------|-------|-------------|
${headerTable}

### Parâmetros (Query / Path)

| Tipo | Nome | Observação |
|------|------|------------|
${queryNote}

### Body (aba Body)

| Modo Postman | Campo / tipo | Uso |
|--------------|--------------|-----|
${bodyTable}

**Exemplo (${bm.primary}):**

\`\`\`json
${jsonExample || '{\n}\n'}
\`\`\`

${mod === 'CCN' && op === 'CCN_Uploads' ? `\n> **XML:** no Postman use **form-data** campo \`file\` (não colar XML em raw). Referência: request *Upload XML CCN — HML* na coleção Git.\n` : ''}
${mod === 'SIGEF' ? `\n> **PDF:** Body → **form-data** → \`file\`. Ver request *Parse Memorial SIGEF — PDF* na coleção Git.\n` : ''}`;
}

module.exports = {
  N8N_GIT,
  POSTMAN_BY_MOD,
  OP_POSTMAN_REQUEST,
  gitBlobUrl,
  guessPostmanRequestName,
  getBodyModes,
  buildPostmanGitSection,
  buildRequestDefinitionSection,
  workflowFileToDisplayName,
};
