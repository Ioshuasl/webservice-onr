#!/usr/bin/env node
/**
 * Sincroniza webservice-onr/especificacao/*.md para o Obsidian vault
 * com frontmatter, alinhamento à doc operacional e links cruzados.
 *
 * Uso: node webservice-onr/scripts/sync-especificacao-to-vault.cjs
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const SPEC_SRC = path.join(REPO_ROOT, 'webservice-onr', 'especificacao');
const VAULT_ROOT = path.join(process.env.OBSIDIAN_VAULT || 'C:\\Users\\kenio\\Obsidian Vault');
const VAULT_SPEC = path.join(
  VAULT_ROOT,
  'Orius',
  'integracoes',
  'registro-imoveis',
  'onr',
  'webservice-wsoficio',
  'especificacao',
);
const REPO_CODE = 'C:\\Users\\kenio\\automacoes e testes';
const TODAY = new Date().toISOString().slice(0, 10);

/** @type {Record<string, object>} */
const DOMAINS = {
  'autenticacao.md': {
    title: 'Autenticação',
    specSecao: '1, 2, 3.1',
    modulo: 'login',
    tags: ['login', 'hash', 'autenticacao'],
    indiceMetodos: '../metodos/login/00-indice-login',
    roadmap: '../automacao/roadmap-autenticacao-onr-n8n',
    extras: ['../hash', '../visao-geral', '../automacao/auth-n8n'],
    alinhamentoNota:
      'Capítulo oficial da spec ONR (escopo + segurança + login). A referência operacional do hash está em [[../hash|hash.md]]; cada operação SOAP documenta o parâmetro `Hash` individualmente.',
  },
  'acompanhamento-titulos-at.md': {
    title: 'Acompanhamento de Títulos (AT)',
    specSecao: '3.2',
    modulo: 'AT',
    tags: ['AT', 'acompanhamento-titulos'],
    indiceMetodos: '../metodos/AT/00-indice-AT',
    roadmap: '../automacao/roadmap-acompanhamento-titulos-onr-n8n',
    tabelas: ['../tabelas-dominio/IDTipoStatus-AT', '../tabelas-dominio/ModoNotificacaoStatus-AT', '../tabelas-dominio/TipoSolicitacao-AT'],
  },
  'penhora-online-po.md': {
    title: 'Penhora Online (PO)',
    specSecao: '3.3',
    modulo: 'PO',
    tags: ['PO', 'penhora-online'],
    indiceMetodos: '../metodos/PO/00-indice-PO',
    roadmap: '../automacao/roadmap-penhora-online-onr-n8n',
    tabelas: ['../tabelas-dominio/IDStatus-PO', '../tabelas-dominio/IDTipoPedido-PO'],
  },
  'bdlight-bdl.md': {
    title: 'Banco de Dados Light (BDL)',
    specSecao: '3.4, Anexo 4.1',
    modulo: 'BDL',
    tags: ['BDL', 'bdlight', 'legado'],
    indiceMetodos: '../metodos/BDL/00-indice-BDL',
    tabelas: ['../tabelas-dominio/IDStatus-BDL'],
    alinhamentoNota:
      'Serviço **desativado em 31/07/2023** (Indicador Pessoal). Manter apenas como referência histórica; ver aviso no capítulo e em [[../metodos/BDL/00-indice-BDL]].',
  },
  'oficio-eletronico-oe.md': {
    title: 'Ofício Eletrônico (OE)',
    specSecao: '3.5',
    modulo: 'OE',
    tags: ['OE', 'oficio-eletronico'],
    indiceMetodos: '../metodos/OE/00-indice-OE',
    roadmap: '../automacao/roadmap-oficio-eletronico-onr-n8n',
  },
  'certidoes.md': {
    title: 'Certidões a Emitir',
    specSecao: '3.6',
    modulo: 'certidoes',
    tags: ['certidoes'],
    indiceMetodos: '../metodos/certidoes/00-indice-certidoes',
    roadmap: '../automacao/roadmap-certidoes-n8n',
  },
  'ctp.md': {
    title: 'Consulta CPF/CNPJ e Consulta Eletrônica (CTP / CE)',
    specSecao: '3.7, 3.8',
    modulo: 'ctp-ce',
    tags: ['ctp', 'consulta-cpf', 'consulta-eletronica'],
    indiceMetodos: null,
    roadmap: null,
    extras: ['../metodos/ctp/00-indice-ctp'],
    alinhamentoNota:
      '**Atenção — homônimos:** este capítulo trata das seções **3.7** (Consulta CPF/CNPJ) e **3.8** (Consulta Eletrônica), ambas *em desenvolvimento* na spec ONR. A pasta [[../metodos/ctp/00-indice-ctp|metodos/ctp]] documenta o capítulo **3.12 Comunicação Prefeituras** (`ImportacaoArquivos`, `AtualizarStatusProcesso`) — domínio distinto, apesar da sigla CTP no vault.',
  },
  'matricula.md': {
    title: 'Matrícula Online (VM)',
    specSecao: '3.9',
    modulo: 'matricula',
    tags: ['matricula', 'matricula-online'],
    indiceMetodos: '../metodos/matricula/00-indice-matricula',
    roadmap: '../automacao/roadmap-matricula-online-onr-n8n',
  },
  'e-protocolo-ac.md': {
    title: 'E-Protocolo (AC)',
    specSecao: '3.10',
    modulo: 'AC',
    tags: ['AC', 'e-protocolo'],
    indiceMetodos: '../metodos/AC/00-indice-AC',
    roadmap: '../automacao/roadmap-e-protocolo-onr-n8n',
  },
  'intimacoes-in.md': {
    title: 'Intimações (IN)',
    specSecao: '3.11',
    modulo: 'IN',
    tags: ['IN', 'intimacoes'],
    indiceMetodos: '../metodos/IN/00-indice-IN',
    roadmap: '../automacao/roadmap-intimacoes-onr-n8n',
  },
};

function stripRepoHeader(content) {
  const lines = content.split(/\r?\n/);
  let i = 0;
  while (i < lines.length) {
    if (lines[i].startsWith('## **') || lines[i].startsWith('**3.')) {
      break;
    }
    if (lines[i].trim() === '---' && i + 1 < lines.length && (lines[i + 1].startsWith('## ') || lines[i + 1].startsWith('**3.'))) {
      i += 1;
      break;
    }
    i += 1;
  }
  return lines.slice(i).join('\n').trimStart();
}

function buildFrontmatter(domain, filename) {
  const tags = ['orius', 'onr', 'wsoficio', 'especificacao', ...(domain.tags || [])];
  return [
    '---',
    'tipo: documentacao',
    'area: orius',
    'central: onr',
    'protocolo: soap',
    'produto: imoveis',
    `modulo: ${domain.modulo}`,
    `tags: [${tags.join(', ')}]`,
    `spec_secao: "${domain.specSecao}"`,
    `fonte: ${REPO_CODE}`,
    `fonte_arquivo: webservice-onr/especificacao/${filename}`,
    `criado: ${TODAY}`,
    'status: revisado',
    '---',
  ].join('\n');
}

function buildAlinhamento(domain) {
  const rows = [
    '| Camada | Nota |',
    '|--------|------|',
    `| Capítulo da spec (este arquivo) | [[${path.basename(domain._outFile || '', '.md')}]] |`,
  ];
  if (domain.indiceMetodos) {
    rows.push(`| Métodos SOAP (referência operacional) | [[${domain.indiceMetodos}]] |`);
  }
  if (domain.roadmap) {
    rows.push(`| Roadmap n8n | [[${domain.roadmap}]] |`);
  }
  if (domain.tabelas?.length) {
    rows.push(`| Tabelas de domínio | ${domain.tabelas.map((t) => `[[${t}]]`).join(' · ')} |`);
  }
  if (domain.extras?.length) {
    for (const link of domain.extras) {
      rows.push(`| Relacionado | [[${link}]] |`);
    }
  }
  rows.push(`| Repositório de código | \`${REPO_CODE}\` |`);
  rows.push(`| Spec monolítica (repo) | \`${REPO_CODE}/especificacao_wsoficio_dev.md\` |`);

  const parts = [
    '## Alinhamento com a documentação operacional',
    '',
    'Este capítulo reproduz a **especificação oficial ONR** (envelopes completos, regras de negócio narrativas). Para implementação dia a dia, use também a doc por operação em `metodos/` e a automação n8n.',
    '',
    ...rows,
  ];
  if (domain.alinhamentoNota) {
    parts.push('', domain.alinhamentoNota);
  }
  parts.push('', 'Voltar: [[00-indice-especificacao]] · [[../00-indice-wsoficio]] · [[../metodos/README]]', '');
  return parts.join('\n');
}

function buildIndiceReadme() {
  const rows = Object.entries(DOMAINS).map(([file, d]) => {
    const slug = file.replace('.md', '');
    const metodosCol = d.indiceMetodos
      ? `[[${d.indiceMetodos}]]`
      : '— (*em desenvolvimento*; prefeituras 3.12 em [[../metodos/ctp/00-indice-ctp]])';
    return `| ${d.title} | [[${slug}]] | ${d.specSecao} | ${metodosCol} |`;
  });

  return `${buildFrontmatter(
    { modulo: '—', specSecao: '—', tags: ['indice'] },
    '00-indice-especificacao.md',
  ).replace('tipo: documentacao', 'tipo: indice')}

> **Fonte:** capítulos extraídos de \`${REPO_CODE}/especificacao_wsoficio_dev.md\` · sincronizar com \`node webservice-onr/scripts/sync-especificacao-to-vault.cjs\`

# Especificação WSOficio por domínio

Capítulos oficiais da spec ONR, complementando a documentação **por operação** em [[../metodos/README|metodos/]].

| Domínio | Capítulo spec | Seção ONR | Métodos (operacional) |
|---------|---------------|-----------|------------------------|
${rows.join('\n')}

## Camadas de documentação

| Camada | Onde | Uso |
|--------|------|-----|
| **Capítulo da spec** | \`especificacao/*.md\` (esta pasta) | Contexto de negócio, fluxos A–Z, envelopes completos da spec PDF |
| **Por operação** | [[../metodos/README|metodos/{domínio}/]] | Parâmetros, erros, scripts, link n8n |
| **Hash / auth** | [[../hash]] | SHA-1, tokens, erros 45–47 |
| **Automação** | [[../automacao/00-indice-automacao]] | Proxies n8n, Postman, Plane |

## Não incluído nesta divisão

- **3.12 Comunicação Prefeituras** — ver [[../metodos/ctp/00-indice-ctp]] (\`ImportacaoArquivos\`, \`AtualizarStatusProcesso\`)
- **Sumário do PDF** — índice de páginas no monolito \`especificacao_wsoficio_dev.md\`

Voltar: [[../00-indice-wsoficio]] · [[../../00-indice-onr]]
`;
}

function patchFile(filePath, replacements) {
  if (!fs.existsSync(filePath)) {
    console.warn(`Skip patch (missing): ${filePath}`);
    return;
  }
  let text = fs.readFileSync(filePath, 'utf8');
  for (const [from, to] of replacements) {
    if (!text.includes(from)) {
      console.warn(`Patch anchor not found in ${path.basename(filePath)}: ${from.slice(0, 60)}...`);
      continue;
    }
    text = text.replace(from, to);
  }
  fs.writeFileSync(filePath, text, 'utf8');
  console.log(`Patched ${path.basename(filePath)}`);
}

function patchVaultIndices() {
  const wsoficio = path.join(VAULT_ROOT, 'Orius', 'integracoes', 'registro-imoveis', 'onr', 'webservice-wsoficio');

  patchFile(path.join(wsoficio, '00-indice-wsoficio.md'), [
    [
      '- [[hash]] · [[tabelas-dominio/00-indice-dominios]] · [[auditoria-implementacao]] · [[automacao/00-indice-automacao|Automação n8n]]',
      '- [[especificacao/00-indice-especificacao|Capítulos da spec ONR]] · [[hash]] · [[tabelas-dominio/00-indice-dominios]] · [[auditoria-implementacao]] · [[automacao/00-indice-automacao|Automação n8n]]',
    ],
    [
      '**Fonte da verdade:** este vault (Obsidian). **Código/WSDL:** `C:\\Users\\kenio\\soap-ui test`',
      `**Fonte da verdade:** este vault (Obsidian). **Código/WSDL:** \`${REPO_CODE}\``,
    ],
    [
      '**WSDL locais no repositório:** `C:\\Users\\kenio\\soap-ui test\\webservice-onr\\wsdl\\certidoes.wsdl`, `C:\\Users\\kenio\\soap-ui test\\webservice-onr\\wsdl\\comunicacaoprefeituras.wsdl`',
      `**WSDL locais:** \`${REPO_CODE}/webservice-onr/wsdl/\` (certidoes, comunicacaoprefeituras, …)`,
    ],
  ]);

  patchFile(path.join(wsoficio, 'metodos', 'README.md'), [
    [
      '| Sigla | Domínio | Pasta |',
      '| Sigla | Domínio | Pasta | Capítulo spec |',
    ],
    [
      '| **AT** | Acompanhamento de título | [[AT/00-indice-AT]] |',
      '| **AT** | Acompanhamento de título | [[AT/00-indice-AT]] | [[../especificacao/acompanhamento-titulos-at]] |',
    ],
    [
      '| **PO** | Penhora online | [[PO/00-indice-PO]] |',
      '| **PO** | Penhora online | [[PO/00-indice-PO]] | [[../especificacao/penhora-online-po]] |',
    ],
    [
      '| **OE** | Ofício eletrônico | [[OE/00-indice-OE]] |',
      '| **OE** | Ofício eletrônico | [[OE/00-indice-OE]] | [[../especificacao/oficio-eletronico-oe]] |',
    ],
    [
      '| **AC** | E-protocolo | [[AC/00-indice-AC]] |',
      '| **AC** | E-protocolo | [[AC/00-indice-AC]] | [[../especificacao/e-protocolo-ac]] |',
    ],
    [
      '| **IN** | Intimação | [[IN/00-indice-IN]] |',
      '| **IN** | Intimação | [[IN/00-indice-IN]] | [[../especificacao/intimacoes-in]] |',
    ],
    [
      '| **BDL** | BD Light (legado) | [[BDL/00-indice-BDL]] |',
      '| **BDL** | BD Light (legado) | [[BDL/00-indice-BDL]] | [[../especificacao/bdlight-bdl]] |',
    ],
    [
      '| — | Login | [[login/LoginUsuarioCertificado]] |',
      '| — | Login | [[login/LoginUsuarioCertificado]] | [[../especificacao/autenticacao]] |',
    ],
    [
      '| — | Certidões | [[certidoes/00-indice-certidoes]] |',
      '| — | Certidões | [[certidoes/00-indice-certidoes]] | [[../especificacao/certidoes]] |',
    ],
    [
      '| — | Matrícula online | [[matricula/00-indice-matricula]] |',
      '| — | Matrícula online | [[matricula/00-indice-matricula]] | [[../especificacao/matricula]] |',
    ],
    [
      '| — | CTP / prefeituras | [[ctp/00-indice-ctp]] |',
      '| — | CTP / prefeituras (3.12) | [[ctp/00-indice-ctp]] | [[../especificacao/ctp]] (3.7–3.8, em dev.) |',
    ],
    [
      '**Código local:** `C:\\Users\\kenio\\soap-ui test`',
      `**Código local:** \`${REPO_CODE}\``,
    ],
  ]);

  const onrHub = path.join(VAULT_ROOT, 'Orius', 'integracoes', 'registro-imoveis', 'onr', '00-indice-onr.md');
  patchFile(onrHub, [
    [
      '| [[webservice-wsoficio/metodos/README|Métodos por módulo]] | AT, PO, OE, AC, IN, … |',
      '| [[webservice-wsoficio/especificacao/00-indice-especificacao|Capítulos da spec ONR]] | Spec oficial por domínio (PDF destrinchado) |\n| [[webservice-wsoficio/metodos/README|Métodos por módulo]] | AT, PO, OE, AC, IN, … |',
    ],
  ]);
  if (fs.existsSync(onrHub)) {
    let onrText = fs.readFileSync(onrHub, 'utf8');
    if (onrText.includes('soap-ui test')) {
      onrText = onrText.replace(/\*\*Código\/scripts:\*\* `C:\\Users\\kenio\\soap-ui test`[^\n]*/g, `**Código/scripts:** \`${REPO_CODE}\``);
      fs.writeFileSync(onrHub, onrText, 'utf8');
    }
  }

  const domainIndexLinks = {
    'login/00-indice-login.md': '../especificacao/autenticacao',
    'AT/00-indice-AT.md': '../especificacao/acompanhamento-titulos-at',
    'PO/00-indice-PO.md': '../especificacao/penhora-online-po',
    'BDL/00-indice-BDL.md': '../especificacao/bdlight-bdl',
    'OE/00-indice-OE.md': '../especificacao/oficio-eletronico-oe',
    'certidoes/00-indice-certidoes.md': '../especificacao/certidoes',
    'matricula/00-indice-matricula.md': '../especificacao/matricula',
    'AC/00-indice-AC.md': '../especificacao/e-protocolo-ac',
    'IN/00-indice-IN.md': '../especificacao/intimacoes-in',
    'ctp/00-indice-ctp.md': '../especificacao/ctp',
  };

  for (const [rel, specLink] of Object.entries(domainIndexLinks)) {
    const fp = path.join(wsoficio, 'metodos', rel);
    if (!fs.existsSync(fp)) continue;
    let text = fs.readFileSync(fp, 'utf8');
    const anchor = 'Voltar: [[../README|Métodos por domínio]] · [[../../00-indice-wsoficio]]';
    const replacement = `Capítulo spec ONR: [[${specLink}]]\n\n${anchor}`;
    if (!text.includes('Capítulo spec ONR:')) {
      text = text.replace(anchor, replacement);
      fs.writeFileSync(fp, text, 'utf8');
      console.log(`Patched ${rel}`);
    }
  }

  // ctp index: extra note about 3.12 vs 3.7-3.8
  const ctpIdx = path.join(wsoficio, 'metodos', 'ctp', '00-indice-ctp.md');
  if (fs.existsSync(ctpIdx)) {
    let text = fs.readFileSync(ctpIdx, 'utf8');
    const note =
      '> **Nota:** operações abaixo são do capítulo **3.12 Comunicação Prefeituras**. As seções **3.7/3.8** (Consulta CPF/CNPJ e Consulta Eletrônica) estão em [[../../especificacao/ctp|especificacao/ctp]] (*em desenvolvimento*).\n\n';
    if (!text.includes('3.12 Comunicação Prefeituras')) {
      text = text.replace('**WSDL (HML):**', note + '**WSDL (HML):**');
      fs.writeFileSync(ctpIdx, text, 'utf8');
      console.log('Patched ctp/00-indice-ctp.md (nota 3.12 vs 3.7)');
    }
  }

  // login index uses different footer layout
  const loginIdx = path.join(wsoficio, 'metodos', 'login', '00-indice-login.md');
  if (fs.existsSync(loginIdx)) {
    let text = fs.readFileSync(loginIdx, 'utf8');
    if (!text.includes('Capítulo spec ONR:')) {
      text = text.replace('# Login\n\n', '# Login\n\nCapítulo spec ONR: [[../../especificacao/autenticacao]]\n\n');
      fs.writeFileSync(loginIdx, text, 'utf8');
      console.log('Patched login/00-indice-login.md');
    }
  }
}

function main() {
  fs.mkdirSync(VAULT_SPEC, { recursive: true });

  for (const [filename, domain] of Object.entries(DOMAINS)) {
    const srcPath = path.join(SPEC_SRC, filename);
    if (!fs.existsSync(srcPath)) {
      console.error(`Missing source: ${srcPath}`);
      process.exitCode = 1;
      continue;
    }
    domain._outFile = filename;
    const body = stripRepoHeader(fs.readFileSync(srcPath, 'utf8'));
    const content = [
      buildFrontmatter(domain, filename),
      '',
      `# WSOficio — ${domain.title}`,
      '',
      buildAlinhamento(domain),
      body,
      '',
    ].join('\n');
    fs.writeFileSync(path.join(VAULT_SPEC, filename), content, 'utf8');
    console.log(`Synced ${filename}`);
  }

  fs.writeFileSync(path.join(VAULT_SPEC, '00-indice-especificacao.md'), buildIndiceReadme(), 'utf8');
  console.log('Synced 00-indice-especificacao.md');

  patchVaultIndices();
}

main();
