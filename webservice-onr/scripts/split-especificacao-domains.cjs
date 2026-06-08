#!/usr/bin/env node
/**
 * Divide especificacao_wsoficio_dev.md em arquivos markdown por domínio.
 * Uso: node webservice-onr/scripts/split-especificacao-domains.cjs
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const SPEC_PATH = path.join(ROOT, 'especificacao_wsoficio_dev.md');
const OUT_DIR = path.join(ROOT, 'webservice-onr', 'especificacao');

/** @type {Record<string, { title: string; sections: string; start: number; end: number; extra?: { start: number; end: number }[]; note?: string }>} */
const DOMAINS = {
  'autenticacao.md': {
    title: 'Autenticação',
    sections: '1, 2 e 3.1',
    start: 269,
    end: 387,
    note: 'Inclui definição/escopo, requisitos de segurança (hash SHA-1) e login (`LoginUsuarioCertificado`). Ver também [`hash.md`](../hash.md).',
  },
  'acompanhamento-titulos-at.md': {
    title: 'Acompanhamento de Títulos (AT)',
    sections: '3.2',
    start: 388,
    end: 1223,
  },
  'penhora-online-po.md': {
    title: 'Penhora Online (PO)',
    sections: '3.3',
    start: 1224,
    end: 2847,
  },
  'bdlight-bdl.md': {
    title: 'Banco de Dados Light (BDL)',
    sections: '3.4 e Anexo 4.1',
    start: 2848,
    end: 3123,
    extra: [{ start: 9273, end: Infinity }],
    note: 'Serviço desativado em 31/07/2023 (Indicador Pessoal). Anexo 4.1 contém o modelo XML de importação.',
  },
  'oficio-eletronico-oe.md': {
    title: 'Ofício Eletrônico (OE)',
    sections: '3.5',
    start: 3124,
    end: 3927,
  },
  'certidoes.md': {
    title: 'Certidões a Emitir',
    sections: '3.6',
    start: 3928,
    end: 4902,
  },
  'ctp.md': {
    title: 'Consulta CPF/CNPJ e Consulta Eletrônica (CTP / CE)',
    sections: '3.7 e 3.8',
    start: 4903,
    end: 4910,
    note: 'Ambas as seções constam como **EM DESENVOLVIMENTO** na especificação original.',
  },
  'matricula.md': {
    title: 'Matrícula Online (VM)',
    sections: '3.9',
    start: 4911,
    end: 5097,
  },
  'e-protocolo-ac.md': {
    title: 'E-Protocolo (AC)',
    sections: '3.10',
    start: 5098,
    end: 7823,
  },
  'intimacoes-in.md': {
    title: 'Intimações (IN)',
    sections: '3.11',
    start: 7824,
    end: 9180,
  },
};

function extractLines(lines, start, end) {
  const slice = lines.slice(start - 1, end === Infinity ? undefined : end);
  return slice.join('\n').trimEnd();
}

function buildHeader(domain) {
  const lines = [
    `# WSOficio — ${domain.title}`,
    '',
    `> Extraído de [\`especificacao_wsoficio_dev.md\`](../../especificacao_wsoficio_dev.md) (seções ${domain.sections}).`,
  ];
  if (domain.note) {
    lines.push(`> ${domain.note}`);
  }
  lines.push('', '---', '');
  return lines.join('\n');
}

function main() {
  const raw = fs.readFileSync(SPEC_PATH, 'utf8');
  const lines = raw.split(/\r?\n/);
  const totalLines = lines.length;

  fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const [filename, domain] of Object.entries(DOMAINS)) {
    let body = extractLines(lines, domain.start, domain.end);
    if (domain.extra) {
      for (const part of domain.extra) {
        const end = part.end === Infinity ? totalLines : part.end;
        body += '\n\n' + extractLines(lines, part.start, end);
      }
    }
    const content = `${buildHeader(domain)}${body}\n`;
    fs.writeFileSync(path.join(OUT_DIR, filename), content, 'utf8');
    console.log(`Wrote ${filename} (${domain.start}-${domain.end})`);
  }

  const readme = `# Especificação WSOficio por domínio

Documentação dividida a partir de [\`especificacao_wsoficio_dev.md\`](../especificacao_wsoficio_dev.md).

| Domínio | Arquivo | Seção |
| --- | --- | --- |
| Autenticação | [autenticacao.md](autenticacao.md) | 1, 2, 3.1 |
| Acompanhamento de Títulos (AT) | [acompanhamento-titulos-at.md](acompanhamento-titulos-at.md) | 3.2 |
| Penhora Online (PO) | [penhora-online-po.md](penhora-online-po.md) | 3.3 |
| Banco de Dados Light (BDL) | [bdlight-bdl.md](bdlight-bdl.md) | 3.4, Anexo 4.1 |
| Ofício Eletrônico (OE) | [oficio-eletronico-oe.md](oficio-eletronico-oe.md) | 3.5 |
| Certidões | [certidoes.md](certidoes.md) | 3.6 |
| CTP / Consulta Eletrônica | [ctp.md](ctp.md) | 3.7, 3.8 |
| Matrícula Online | [matricula.md](matricula.md) | 3.9 |
| E-Protocolo (AC) | [e-protocolo-ac.md](e-protocolo-ac.md) | 3.10 |
| Intimações (IN) | [intimacoes-in.md](intimacoes-in.md) | 3.11 |

## Não incluído nesta divisão

- **3.12 Comunicação Prefeituras** — permanece apenas no arquivo monolítico (\`ImportacaoArquivos\`, \`AtualizarStatusProcesso\`). Métodos em [\`metodos/\`](../metodos/).
- **Sumário (páginas 9–12)** — índice do PDF original; consultar o arquivo monolítico.

## Relacionados

- [\`list-metodos.md\`](../list-metodos.md) — índice de métodos por módulo
- [\`hash.md\`](../hash.md) — autenticação hash SHA-1
- [\`metodos/\`](../metodos/) — um arquivo por operação SOAP
`;

  fs.writeFileSync(path.join(OUT_DIR, 'README.md'), readme, 'utf8');
  console.log('Wrote README.md');
}

main();
