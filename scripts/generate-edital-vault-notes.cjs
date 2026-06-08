const fs = require('fs');
const path = require('path');

const VAULT = 'C:/Users/kenio/Obsidian Vault/Orius/integracoes/registro-imoveis/api-registro-imoveis/edital';
const HUB = 'Orius/integracoes/registro-imoveis/api-registro-imoveis';
const AUTH = `${HUB}/autenticacao/RFG-01-autenticacao`;
const BASE_PROD = 'https://api.registrodeimoveis.org.br';
const BASE_HML = 'https://testes-api.registrodeimoveis.org.br';

function fm(meta, body) {
  const tags = meta.tags || ['orius', 'imoveis', 'rib', 'api', 'edital'];
  const lines = ['---', 'tipo: ' + (meta.tipo || 'integracao'), 'area: orius', 'produto: imoveis', 'portal: registrodeimoveis', 'modulo: edital', 'tags: [' + tags.join(', ') + ']'];
  if (meta.codigo) lines.push('codigo: ' + meta.codigo);
  lines.push('manual: v8.0', 'status: ' + (meta.status || 'documentado'), '---', '', body);
  return lines.join('\n');
}

function write(rel, content) {
  const p = path.join(VAULT, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content, 'utf8');
  console.log('wrote', rel);
}

const header = (modIdx, extra = '') => `> **Hub API RIB:** [[${HUB}/00-indice]]
> **Índice módulo:** [[${HUB}/edital/${modIdx}]]
> **Visão geral edital:** [[${HUB}/edital/visao-geral]]
> **Autenticação:** [[${AUTH}]]${extra ? '\n' + extra : ''}

`;

// --- dominio ---
const tbds = [
  { code: 'TBD-01', slug: 'tbd-01-epermite-anexo', name: 'EPermiteAnexo', rows: [['0', 'Não permite'], ['1', 'Permite']], uso: 'RFE-01, RFS-01' },
  { code: 'TBD-02', slug: 'tbd-02-eanexo-obrigatorio', name: 'EAnexoObrigatorio', rows: [['0', 'Não obrigatório'], ['1', 'Obrigatório']], uso: 'RFE-01' },
  { code: 'TBD-03', slug: 'tbd-03-etipo-dias-publicacoes', name: 'ETipoDiasPublicacoes', rows: [['0', 'Dias úteis'], ['1', 'Dias corridos']], uso: 'RFE-01' },
  { code: 'TBD-04', slug: 'tbd-04-etipo-edital', name: 'ETipoEdital', rows: [['SIMPLES', 'Editais de cadastramento simplificado'], ['LEILAO_IMOVEL', 'Editais de leilão de imóveis']], uso: 'RFE-01, RFE-02' },
  { code: 'TBD-05', slug: 'tbd-05-estatus', name: 'EStatus', rows: [['0', 'Todos'], ['1', 'Publicado'], ['2', 'Rejeitado'], ['3', 'Aguardando Publicação'], ['4', 'Aguardando Pagamento'], ['5', 'Inativo']], uso: 'RFE-02, RFS, RFL' },
  { code: 'TBD-06', slug: 'tbd-06-lmodalidade', name: 'LModalidade', rows: [['ONLINE', 'Modalidade OnLine'], ['PRESENCIAL', 'Modalidade presencial']], uso: 'RFL-01' },
  { code: 'TBD-07', slug: 'tbd-07-ldisputa', name: 'LDisputa', rows: [['ABERTO', 'Disputa aberta'], ['FECHADO', 'Disputa fechada']], uso: 'RFL-01' },
  { code: 'TBD-08', slug: 'tbd-08-webhook-metodo', name: 'WebHookMetodo', rows: [['POST', 'Requisição POST'], ['GET', 'Requisição GET']], uso: 'RFS-01, RFL-01 (webhook)' },
];

let dominioIdx = `---
tipo: indice
area: orius
produto: imoveis
portal: registrodeimoveis
modulo: edital
tags: [orius, imoveis, rib, edital, dominio, tbd]
manual: v8.0
---

> **Módulo edital:** [[${HUB}/edital/00-indice]]

# Tabelas de domínio — Edital (TBD)

Enums do manual v8.0 (API Editais RIB).

| Código | Nome | Nota | Uso |
|--------|------|------|-----|
`;
for (const t of tbds) {
  write(`dominio/${t.slug}.md`, fm({ tipo: 'referencia', codigo: t.code, tags: ['orius', 'imoveis', 'rib', 'edital', 'dominio', t.code] },
    `> **Índice domínio:** [[dominio/00-indice-dominio]]

# [${t.code}] — ${t.name}

| Código | Descrição |
|--------|-----------|
${t.rows.map(([c, d]) => `| ${c} | ${d} |`).join('\n')}

**Uso:** ${t.uso}

**Fonte:** \`api-registro-imoveis/manual-api-editais-v8.0.md\` — \`[${t.code}]\`
`));
  dominioIdx += `| **${t.code}** | \`${t.name}\` | [[dominio/${t.slug}]] | ${t.uso} |\n`;
}
dominioIdx += `\nVoltar: [[${HUB}/edital/00-indice]]\n`;
write('dominio/00-indice-dominio.md', dominioIdx);

// --- visao geral ---
write('visao-geral.md', fm({ tipo: 'integracao', tags: ['orius', 'imoveis', 'rib', 'edital', 'diario-registral'] },
`${header('00-indice')}

# Visão geral — Edital eletrônico (RIB)

Publicação de editais no **Diário Registral** (Registro de Imóveis Eletrônico) via REST. Manual **v8.0** (mar/2026).

## O que é o edital

Instrumento oficial de notificação e publicidade de atos registrais: alienação fiduciária, usucapião extrajudicial, adjudicação compulsória, leilões, loteamentos, etc. Alguns tipos exigem **anexo** (planta/croqui/metragem); o sistema proíbe dados sensíveis em anexos.

## Ambientes

| Ambiente | Base URL |
|----------|----------|
| Produção | \`${BASE_PROD}\` |
| Homologação | \`${BASE_HML}\` |

**Swagger:** [registrodeimoveis.org.br/swagger](https://www.registrodeimoveis.org.br/swagger/index.html)

## Blocos do módulo

| Bloco | Códigos | Prefixo API |
|-------|---------|-------------|
| Geral edital | RFE-01 … RFE-04 | \`/v1/edital/tipo\`, \`/v1/edital\`, \`/v1/edital/cobranca\` |
| Edital simples | RFS-01 … RFS-04 | \`/v1/edital\` |
| Edital leilão | RFL-01 … RFL-04 | \`/v1/edital/leilao\` |
| Extração de dados | RFX-01 … RFX-05 | \`/v1/edital/extracao\` (Swagger/Postman) |
| Domínio | TBD-01 … TBD-08 | [[dominio/00-indice-dominio]] |

## Autenticação

[[${AUTH}]] — \`Authorization: Bearer {token}\` em todas as rotas.

## Formato de valores monetários

Valores em **centavos × 1000** (ex.: R$ 100,00 → \`100000\`), mesmo padrão da API de protocolo/cobrança RIB.

## Erro padrão (edital simples/leilão)

\`\`\`json
{ "codigo": 0, "descricao": "string", "campos": {} }
\`\`\`

Cobrança edital (RFE-03/04) retorna \`{ "mensagem": "string", "status": "200" }\`.

## Fontes

- Manual: \`api-registro-imoveis/manual-api-editais-v8.0.md\`
- Postman: \`api-registro-imoveis/API - Registro de Imóveis do Brasil.postman_collection.json\`
- Legado: [[Orius/integracoes/registro-imoveis/rib-edital]]
`));

// Helper for func notes
function funcNote({ codigo, slug, title, phrase, endpoints, prereq, request, response, related, fonte }) {
  const epTable = endpoints.map(e => `| \`${e.m}\` | \`${e.p}\` | ${e.d} |`).join('\n');
  return fm({ codigo, tags: ['orius', 'imoveis', 'rib', 'edital', codigo.toLowerCase()] },
`${header('00-indice')}

# [${codigo}] — ${title}

**Uma frase:** ${phrase}

---

## Endpoints

| Método | Caminho | Descrição |
|--------|---------|-----------|
${epTable}

**Base:** \`${BASE_PROD}\` · homolog: \`${BASE_HML}\`

---

## Pré-requisitos

${prereq}

---

## Request

${request}

---

## Response

${response}

---

## Relacionado

${related}

**Fonte:** \`api-registro-imoveis/manual-api-editais-v8.0.md\` — \`[${codigo}]\`${fonte ? ' · ' + fonte : ''}
`);
}

const prereqAuth = `- [x] Token JWT — [[${AUTH}|RFG-01]]`;

// RFE notes
write('RFE-01-listagem-tipos-edital.md', funcNote({
  codigo: 'RFE-01', slug: 'rfe-01', title: 'Listagem dos tipos de editais', phrase: 'listar tipos de edital permitidos com regras de anexo, publicações e valores.',
  endpoints: [{ m: 'GET', p: '/v1/edital/tipo', d: 'Tipos de edital paginados' }],
  prereq: prereqAuth,
  request: `### Query\n\n| Parâmetro | Tipo | Obrig. | Descrição |\n|-----------|------|--------|------------|\n| registrosPorPagina | int | Não | Padrão 50, máx. 100 |\n| numeroPagina | int | Não | Página |`,
  response: `### Sucesso (paginado)\n\nCampos em \`dados[]\`: \`id\` (usar em cadastro), \`descricaoResumida\`, \`descricao\`, \`permiteAnexo\` ([[dominio/tbd-01-epermite-anexo]]), \`anexoObrigatorio\` ([[dominio/tbd-02-eanexo-obrigatorio]]), \`extensoesPermitidas\`, \`numeroPublicacoes\`, \`diasPublicacoes\`, \`tipoDiasPublicacoes\` ([[dominio/tbd-03-etipo-dias-publicacoes]]), \`diasTerminoPrazoEdital\`, \`valorPublicacao\`, \`textoPadrao\`, \`tipoEdital\` ([[dominio/tbd-04-etipo-edital]]).`,
  related: `| [[RFS-01-cadastro-edital-simples]] | Usa \`id\` de \`tipoEdital\` |\n| [[RFL-01-cadastro-edital-leilao]] | Idem |`
}));

write('RFE-02-listagem-editais.md', funcNote({
  codigo: 'RFE-02', slug: 'rfe-02', title: 'Listagem dos editais', phrase: 'listar editais do cartório (API ou intranet) com filtros e paginação.',
  endpoints: [{ m: 'GET', p: '/v1/edital', d: 'Listagem paginada' }],
  prereq: prereqAuth,
  request: `### Query (filtros)\n\n| Parâmetro | Descrição |\n|-----------|------------|\n| registrosPorPagina, numeroPagina | Paginação |\n| tipoEdital | Id do tipo |\n| dataInicialPublicacao, dataFinalPublicacao | Publicação |\n| dataInicialCadastro, dataFinalCadastro | Cadastro |\n| documentoIntimado, documentoCredor | CPF/CNPJ |\n| cns, numeroMatricula, uuid, numeroEdital | Identificadores |\n| status | [[dominio/tbd-05-estatus]] |`,
  response: `\`dados[]\`: \`uuid\`, \`numeroEdital\`, \`tipoEdital\`, \`status\` ([[dominio/tbd-05-estatus]]), \`dataPublicacao\`, \`urlPagamento\`, \`urlRecibo\`, \`editaisVinculados\`, \`motivoRejeicao\`, \`retificacao[]\` (\`editalRejeitado\`, \`editalRetificador\`, \`uuidRetificador\`).`,
  related: `| [[RFS-04-detalhe-edital-simples]] | Detalhe por \`numeroEdital\` |\n| [[RFL-04-detalhe-edital-leilao]] | Detalhe leilão |`
}));

write('RFE-03-cadastro-cobranca-edital.md', funcNote({
  codigo: 'RFE-03', slug: 'rfe-03', title: 'Cadastro de cobrança do edital', phrase: 'registrar no RIB uma cobrança gerada no sistema interno do cartório (pós-geração).',
  endpoints: [{ m: 'POST', p: '/v1/edital/cobranca', d: 'Cadastra cobrança' }],
  prereq: prereqAuth + '\n- Cobrança já gerada no sistema interno com PDF em `urlAcesso`',
  request: `### Body\n\n| Campo | Obrig. | Descrição |\n|-------|--------|------------|\n| cnsServentia | Sim | CNS (6) |\n| editais | Sim | Array de números/ids de editais |\n| valor | Sim | Valor da cobrança |\n| urlAcesso | Sim | URL do PDF |\n| dataGeracao, dataVencimento | Sim | Datas |\n| numeroDocumento | Sim | Nosso número |\n| descricao | Sim | Descrição |\n| pagador | Sim | nome, documento, email, endereço (cep, logradouro, …) |`,
  response: `Sucesso: \`{ "mensagem": "string" }\`\n\nErro: \`{ "mensagem": "string" }\` (sem \`codigo/descricao\` padrão).`,
  related: `| [[RFE-04-atualizacao-cobranca-edital]] | Baixa/atualização |`
}));

write('RFE-04-atualizacao-cobranca-edital.md', funcNote({
  codigo: 'RFE-04', slug: 'rfe-04', title: 'Atualização de cobrança do edital', phrase: 'informar pagamento de cobrança previamente cadastrada (baixa no RIB).',
  endpoints: [{ m: 'PATCH', p: '/v1/edital/cobranca/{numeroDocumento}', d: 'Atualiza cobrança' }],
  prereq: prereqAuth + '\n- Cobrança cadastrada via [[RFE-03-cadastro-cobranca-edital]]',
  request: `### Path: \`numeroDocumento\` (nosso número)\n\n### Body\n\n| Campo | Obrig. | Descrição |\n|-------|--------|------------|\n| cnsServentia | Sim | CNS |\n| valorPago | Sim | Valor pago |\n| pago | Sim | 0=Não, 1=Sim |\n| dataPagamento | Sim | Data do pagamento |`,
  response: `Sucesso: \`{ "mensagem": "string", "status": "200" }\``,
  related: `| [[RFE-03-cadastro-cobranca-edital]] | Cadastro prévio |`
}));

// RFS - shared body doc
const rfsBody = `### Body — campos raiz

| Campo | Tam. | Obrig. | Descrição |
|-------|------|--------|------------|
| tipoEdital | 10 | Sim | Id do tipo ([[RFE-01-listagem-tipos-edital]]) |
| intimados | — | Sim | Array (documento, nome, endereco; \`documentoDesconhecido\`) |
| dadosServentia | — | Sim | cns, denominacao, endereco |
| numeroMatricula | 7 | Não | Matrícula |
| cnm | 19 | Não | CNM |
| numeroProtocolo | 20 | Não | Protocolo/prenotação |
| anexo | — | Não | Base64 do anexo |
| numeroAto | 30 | Não | Número do ato |
| textoEdital | 10000 | Não | Texto (se sem padrão do tipo) |
| primeiroRequerente | — | Não | documento, nome |
| dadosContrato | — | Não | credor, datas, valorDivida (formato numérico) |
| imovel | — | Não | Endereço do imóvel |
| cobranca | — | Não | observacao + dadosPagador (nome, documento, email, telefone, endereco) |
| webhook | — | Não | url + metodo ([[dominio/tbd-08-webhook-metodo]]) |

**Endereço** (intimado, serventia, imóvel, pagador): cep, tipoLogradouro, logradouro, numero, bairro, cidade, estado.`;

const rfsResponse = `### Sucesso

\`editaisCadastrados[]\`: hash, documentosIntimados, idsGerados, datasPublicacoes.

Raiz: \`status\` ([[dominio/tbd-05-estatus]]), \`dataStatus\`, \`urlPagamento\`, \`valor\`, \`totalPublicacoes\`.

### Erro

\`{ "codigo", "descricao", "campos" }\` — padrão RIB.`;

write('RFS-01-cadastro-edital-simples.md', funcNote({
  codigo: 'RFS-01', slug: 'rfs-01', title: 'Cadastramento de edital simples', phrase: 'cadastrar edital no Diário Registral sem usar a intranet — com cobrança e webhook opcionais.',
  endpoints: [{ m: 'POST', p: '/v1/edital', d: 'Cadastro de edital simples' }],
  prereq: prereqAuth + '\n- [[RFE-01-listagem-tipos-edital]] para obter `tipoEdital`\n- Validar regras de anexo do tipo (`permiteAnexo`, `anexoObrigatorio`)',
  request: rfsBody,
  response: rfsResponse,
  related: `| [[RFS-04-detalhe-edital-simples]] | Consulta após cadastro |\n| [[RFS-02-cancelamento-edital-simples]] | Cancelar se não pago/publicado |\n| [[RFS-03-retificacao-edital-simples]] | Se rejeitado |`
}));

write('RFS-02-cancelamento-edital-simples.md', funcNote({
  codigo: 'RFS-02', slug: 'rfs-02', title: 'Cancelamento de edital simples', phrase: 'cancelar edital não pago e não publicado.',
  endpoints: [{ m: 'DELETE', p: '/v1/edital/{numeroEdital}', d: 'Cancelamento' }],
  prereq: prereqAuth + '\n- Edital ainda não pago/publicado',
  request: `### Path: \`numeroEdital\` (string)`,
  response: `**204/200** sem body em sucesso.\n\nErro: padrão \`codigo\`, \`descricao\`, \`campos\`.`,
  related: `| [[RFS-01-cadastro-edital-simples]] | Cadastro |`
}));

write('RFS-03-retificacao-edital-simples.md', funcNote({
  codigo: 'RFS-03', slug: 'rfs-03', title: 'Retificação de edital simples', phrase: 'alterar edital rejeitado na análise do jornalista.',
  endpoints: [{ m: 'PUT', p: '/v1/edital/{numeroEdital}', d: 'Retificação' }],
  prereq: prereqAuth + '\n- Edital com status Rejeitado ([[dominio/tbd-05-estatus]])',
  request: `### Path: \`numeroEdital\`\n\n### Body\n\nMesma estrutura do [[RFS-01-cadastro-edital-simples]] + \`exibeMencao\` (boolean, opcional).`,
  response: rfsResponse,
  related: `| [[RFS-04-detalhe-edital-simples]] | Consultar após retificação |`
}));

write('RFS-04-detalhe-edital-simples.md', funcNote({
  codigo: 'RFS-04', slug: 'rfs-04', title: 'Detalhes de edital simples', phrase: 'consultar dados completos de um edital simples cadastrado.',
  endpoints: [{ m: 'GET', p: '/v1/edital/{numeroEdital}', d: 'Detalhe do edital' }],
  prereq: prereqAuth,
  request: `### Path: \`numeroEdital\``,
  response: `Retorna metadados (\`uuid\`, \`status\`, \`urlPagamento\`, …) + corpo do cadastro: \`intimados\`, \`dadosServentia\`, \`dadosContrato\`, \`imovel\`, anexo, etc.`,
  related: `| [[RFE-02-listagem-editais]] | Localizar \`numeroEdital\` |`
}));

// RFL
const rflBody = `### Body — campos raiz

| Campo | Obrig. | Descrição |
|-------|--------|------------|
| tipoEdital | Sim | Id do tipo |
| sumario | Sim | publicacao (numeroPublicacao, objeto, descricao), foro, titulo, subtitulo, texto |
| leilao | Sim | modalidade ([[dominio/tbd-06-lmodalidade]]), modoDisputa ([[dominio/tbd-07-ldisputa]]), tipo, linkDisputa, leiloes[] (data, hora), leiloeiro, preposto |
| intimados | Sim | documento, nome |
| imoveis | Sim | numeroLote, idImovel, numeroMatricula, tipoImovel, leiloes[] (valor), endereco (com unidade, lote, quadra, vagas…) |
| dadosCredor | Sim | documento, nome, cidade, estado |
| informacoesGerais | Sim | titulo, texto |
| cobranca, webhook | Não | Igual RFS-01 |
| exibeMencao, anexo | Não | Retificação/cadastro |`;

write('RFL-01-cadastro-edital-leilao.md', funcNote({
  codigo: 'RFL-01', slug: 'rfl-01', title: 'Cadastramento de edital leilão', phrase: 'cadastrar edital de leilão de imóveis (cartório ou empresa de leilão).',
  endpoints: [{ m: 'POST', p: '/v1/edital/leilao', d: 'Cadastro edital leilão' }],
  prereq: prereqAuth + '\n- Tipo com `tipoEdital` = LEILAO_IMOVEL ([[dominio/tbd-04-etipo-edital]])',
  request: rflBody,
  response: rfsResponse,
  related: `| [[RFL-04-detalhe-edital-leilao]] | Consulta |\n| Postman | Exemplo completo de body em \`POST /v1/edital/leilao\` |`,
  fonte: 'Postman collection'
}));

write('RFL-02-cancelamento-edital-leilao.md', funcNote({
  codigo: 'RFL-02', slug: 'rfl-02', title: 'Cancelamento de edital leilão', phrase: 'cancelar edital de leilão não pago/publicado.',
  endpoints: [{ m: 'DELETE', p: '/v1/edital/leilao/{numeroEdital}', d: 'Cancelamento' }],
  prereq: prereqAuth,
  request: `### Path: \`numeroEdital\``,
  response: `Sucesso sem body. Erro: padrão RIB.`,
  related: `| [[RFL-01-cadastro-edital-leilao]] |`
}));

write('RFL-03-retificacao-edital-leilao.md', funcNote({
  codigo: 'RFL-03', slug: 'rfl-03', title: 'Retificação de edital leilão', phrase: 'retificar edital de leilão rejeitado.',
  endpoints: [{ m: 'PUT', p: '/v1/edital/leilao/{numeroEdital}', d: 'Retificação' }],
  prereq: prereqAuth,
  request: `### Path: \`numeroEdital\`\n\n### Body\n\nMesma estrutura do [[RFL-01-cadastro-edital-leilao]] (ver Postman para exemplo JSON).`,
  response: rfsResponse,
  related: `| [[RFL-04-detalhe-edital-leilao]] |`
}));

write('RFL-04-detalhe-edital-leilao.md', funcNote({
  codigo: 'RFL-04', slug: 'rfl-04', title: 'Detalhes de edital leilão', phrase: 'consultar edital de leilão cadastrado.',
  endpoints: [{ m: 'GET', p: '/v1/edital/leilao/{numeroEdital}', d: 'Detalhe' }],
  prereq: prereqAuth,
  request: `### Path: \`numeroEdital\``,
  response: `Metadados + sumario, leilao, imoveis, intimados, dadosCredor, informacoesGerais.`,
  related: `| [[RFE-02-listagem-editais]] |`
}));

// RFX extracao
const rfxHeader = `> **Submódulo:** [[extracao/00-indice]]\n`;
const rfxPrereq = prereqAuth;

write('extracao/00-indice.md', `---
tipo: indice
area: orius
produto: imoveis
portal: registrodeimoveis
modulo: edital
tags: [orius, imoveis, rib, edital, extracao]
manual: swagger
---

> **Módulo edital:** [[${HUB}/edital/00-indice]]

# Submódulo — Extração de dados (edital)

Solicitação e download de extrações em lote. **Não consta no manual v8.0**; documentado via Swagger/Postman.

| Código | Descrição | Nota |
|--------|-----------|------|
| **RFX-01** | Listagem de solicitações | [[RFX-01-listagem-extracao]] |
| **RFX-02** | Solicitar extração | [[RFX-02-solicitar-extracao]] |
| **RFX-03** | Detalhe da solicitação | [[RFX-03-detalhe-extracao]] |
| **RFX-04** | Download do arquivo | [[RFX-04-download-extracao]] |
| **RFX-05** | Dados da extração | [[RFX-05-dados-extracao]] |

Voltar: [[${HUB}/edital/00-indice]]
`);

[
  ['RFX-01-listagem-extracao', 'RFX-01', 'Listagem de solicitações de extração', 'GET', '/v1/edital/extracao', 'registrosPorPagina, numeroPagina, hash, dataInicialCadastro, dataFinalCadastro, situacao'],
  ['RFX-02-solicitar-extracao', 'RFX-02', 'Solicitar extração de dados', 'POST', '/v1/edital/extracao', 'Body JSON com filtros da extração (ver Postman/Swagger)'],
  ['RFX-03-detalhe-extracao', 'RFX-03', 'Detalhe de uma solicitação', 'GET', '/v1/edital/extracao/{hash}', 'Retorna hash, filtros, situacao, financeiro (valor, urlCobranca, urlRecibo)'],
  ['RFX-04-download-extracao', 'RFX-04', 'Download do arquivo gerado', 'GET', '/v1/edital/extracao/download/{hash}', 'Retorno binário do arquivo'],
  ['RFX-05-dados-extracao', 'RFX-05', 'Dados da extração processada', 'GET', '/v1/edital/extracao/dados/{hash}', 'Payload com dados extraídos'],
].forEach(([slug, code, title, method, pathEp, detail]) => {
  write(`extracao/${slug}.md`, fm({ codigo: code, tags: ['orius', 'imoveis', 'rib', 'edital', 'extracao', code] },
`${rfxHeader}
# [${code}] — ${title}

**Uma frase:** ${detail}

## Endpoint

| Método | Caminho |
|--------|---------|
| \`${method}\` | \`${pathEp}\` |

## Pré-requisitos

${rfxPrereq}

## Detalhes

${method === 'GET' && pathEp.includes('{hash}') ? '### Path\n\n`hash` — identificador da solicitação (UUID).' : ''}
${code === 'RFX-01' ? '### Query\n\nPaginação + filtros por hash, datas, situacao (`processado`, etc.).' : ''}
${code === 'RFX-03' ? '### Response (exemplo Postman)\n\n```json\n{\n  "hash": "uuid",\n  "filtros": "string",\n  "situacao": null,\n  "dataCadastro": "2022-08-04 10:00:00",\n  "financeiro": {\n    "valor": "string",\n    "quantidadeRegistros": 0,\n    "situacao": "pendente",\n    "urlCobranca": "string",\n    "urlRecibo": "string"\n  }\n}\n```' : ''}

**Fonte:** Postman — \`API - Registro de Imóveis do Brasil.postman_collection.json\`
`));
});

// 00-indice
write('00-indice.md', `---
tipo: indice
area: orius
produto: imoveis
portal: registrodeimoveis
modulo: edital
tags: [orius, imoveis, rib, api, edital, diario-registral]
manual: v8.0
---

> **Hub API RIB:** [[${HUB}/00-indice]]
> **Auth:** [[${HUB}/autenticacao/00-indice]]
> **Legado:** [[Orius/integracoes/registro-imoveis/rib-edital]]

# Módulo — Edital eletrônico

Diário Registral (CORI-BR). Manual **v8.0** (mar/2026).

| Doc | Conteúdo |
|-----|----------|
| Visão geral do módulo | [[visao-geral]] |
| Domínio TBD | [[dominio/00-indice-dominio]] |

## Geral (edital)

| Código | Descrição | Nota | Status |
|--------|-----------|------|--------|
| **RFE-01** | Listagem dos tipos de editais | [[RFE-01-listagem-tipos-edital]] | documentado |
| **RFE-02** | Listagem dos editais | [[RFE-02-listagem-editais]] | documentado |
| **RFE-03** | Cadastro de cobrança | [[RFE-03-cadastro-cobranca-edital]] | documentado |
| **RFE-04** | Atualização de cobrança | [[RFE-04-atualizacao-cobranca-edital]] | documentado |

## Edital simples

| Código | Descrição | Nota | Status |
|--------|-----------|------|--------|
| **RFS-01** | Cadastramento | [[RFS-01-cadastro-edital-simples]] | documentado |
| **RFS-02** | Cancelamento | [[RFS-02-cancelamento-edital-simples]] | documentado |
| **RFS-03** | Retificação | [[RFS-03-retificacao-edital-simples]] | documentado |
| **RFS-04** | Detalhes | [[RFS-04-detalhe-edital-simples]] | documentado |

## Edital leilão

| Código | Descrição | Nota | Status |
|--------|-----------|------|--------|
| **RFL-01** | Cadastramento | [[RFL-01-cadastro-edital-leilao]] | documentado |
| **RFL-02** | Cancelamento | [[RFL-02-cancelamento-edital-leilao]] | documentado |
| **RFL-03** | Retificação | [[RFL-03-retificacao-edital-leilao]] | documentado |
| **RFL-04** | Detalhes | [[RFL-04-detalhe-edital-leilao]] | documentado |

## Extração (Swagger/Postman)

| Código | Descrição | Nota | Status |
|--------|-----------|------|--------|
| **RFX-01 … RFX-05** | Extração de dados | [[extracao/00-indice]] | documentado |

## Tabelas de domínio

[[dominio/00-indice-dominio]]

## Fontes

| Artefato | Caminho |
|----------|---------|
| Manual v8.0 | \`api-registro-imoveis/manual-api-editais-v8.0.md\` |
| Postman | \`api-registro-imoveis/API - Registro de Imóveis do Brasil.postman_collection.json\` |
| Swagger | [registrodeimoveis.org.br/swagger](https://www.registrodeimoveis.org.br/swagger/index.html) |

Voltar: [[${HUB}/00-indice]]
`);

console.log('Done.');
