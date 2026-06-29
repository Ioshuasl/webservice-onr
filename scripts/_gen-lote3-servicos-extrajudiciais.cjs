const fs = require('fs');
const path = require('path');

const items = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'codigo-normas', '_lote3_utf8.json'), 'utf8')
);
const incompletos = new Set(
  JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'codigo-normas', '_iii_extract_full.json'), 'utf8')
  ).incompletosChaves
);

const OUT = path.join(
  'C:',
  'Users',
  'kenio',
  'Obsidian Vault',
  'Orius',
  'desenvolvimento',
  'regras-de-negocio',
  'servicos-extrajudiciais',
  'regras'
);

const specs = [
  {
    slug: 'art-93-paragrafo-3-dias-horas-uteis',
    tituloRegra: 'Definição de dias e horas úteis (art. 93, §3º)',
    categoria: 'definicao',
    criticidade: 'media',
    palavras: ['dias úteis', 'horas úteis', 'expediente', 'funcionamento'],
    resumo:
      'Para fins do art. 93, **dias úteis** são os de expediente e **horas úteis** são as regulamentares do expediente.',
    quando: 'Na aplicação das regras de funcionamento do art. 93 que remetem a dias ou horas úteis.',
    obrigatorio:
      'Considerar dias úteis aqueles em que houver expediente e horas úteis aquelas regulamentares do expediente.',
    proibido: 'O texto normativo deste parágrafo não enumera vedações expressas.',
    impacto:
      'Módulos de agenda, prazos e controle de expediente no Orius devem alinhar cálculos de dias/horas úteis a esta definição.',
    baseRef: 'Art. 93, §3º',
    notaIncompleto: '*(texto extraído com prefixo truncado)*',
  },
  {
    slug: 'art-94-atendimento-publico-trecho-incompleto',
    tituloRegra: 'Atendimento ao público na serventia (art. 94, caput) — trecho incompleto',
    categoria: 'obrigacao',
    criticidade: 'alta',
    palavras: ['atendimento ao público', 'serventia extrajudicial', 'trecho incompleto'],
    resumo:
      'No atendimento ao público, o responsável pela serventia extrajudicial deve cumprir requisitos que **não constam integralmente** na extração da fonte — o caput está truncado.',
    quando: 'Quando se organizar o atendimento ao público na serventia extrajudicial, conforme o art. 94.',
    obrigatorio:
      'O texto normativo extraído está incompleto; consta apenas a introdução sobre o responsável no atendimento ao público (continuação não consta na fonte).',
    proibido: 'O texto normativo do caput extraído não enumera vedações expressas.',
    impacto:
      'Fluxos de atendimento ao público no [[Orius/empresa/produtos/00-indice-produtos]] devem aguardar complementação do caput; incisos II–VI deste artigo constam em notas separadas.',
    baseRef: 'Art. 94 (caput, trecho extraído)',
    notaIncompleto: '*(caput truncado — requisitos do atendimento não constam na fonte)*',
    forceIncompleto: true,
  },
  {
    slug: 'art-94-inc-ii-colaboradores-compativeis',
    tituloRegra: 'Colaboradores compatíveis com o fluxo de atendimento',
    categoria: 'obrigacao',
    criticidade: 'media',
    palavras: ['colaboradores', 'atendimento ao público', 'fluxo'],
    resumo:
      'O número de colaboradores no atendimento ao público deve ser **compatível** com o fluxo de pessoas que usam os serviços da serventia.',
    quando: 'No atendimento ao público da serventia extrajudicial, conforme inciso II do art. 94.',
    obrigatorio:
      'Destacar para a tarefa número de colaboradores compatível com o fluxo de pessoas que se utilizam dos serviços da serventia.',
    proibido: 'O texto normativo deste inciso não enumera vedações expressas.',
    impacto:
      'Gestão de equipe e filas de atendimento no Orius deve permitir dimensionamento de colaboradores conforme fluxo de usuários.',
    baseRef: 'Art. 94, inciso II',
    notaIncompleto: '*(inciso isolado — caput e demais incisos em notas separadas)*',
  },
  {
    slug: 'art-94-inc-iii-tempo-espera-30-minutos',
    tituloRegra: 'Limite de tempo de espera no atendimento',
    categoria: 'obrigacao',
    criticidade: 'alta',
    palavras: ['tempo de espera', '30 minutos', 'atendimento ao público'],
    resumo:
      'O tempo de espera para atendimento ao público **não pode superar 30 (trinta) minutos**.',
    quando: 'No atendimento presencial ao público na serventia extrajudicial, conforme inciso III do art. 94.',
    obrigatorio: 'Garantir que o tempo de espera para o atendimento não supere 30 (trinta) minutos.',
    proibido: 'O texto normativo deste inciso não enumera vedações expressas além do limite de espera.',
    impacto:
      'Painéis de senha e monitoramento de filas no Orius devem alertar quando o tempo de espera se aproximar ou exceder 30 minutos.',
    baseRef: 'Art. 94, inciso III',
    notaIncompleto: null,
  },
  {
    slug: 'art-94-inc-iv-sistema-senha',
    tituloRegra: 'Sistema de senha com horário de chegada',
    categoria: 'obrigacao',
    criticidade: 'media',
    palavras: ['sistema de senha', 'horário de chegada', 'atendimento'],
    resumo:
      'Deve ser adotado **sistema de senha** que registre o horário de chegada de cada usuário, independentemente da quantidade de serviços solicitados.',
    quando: 'No atendimento ao público da serventia extrajudicial, conforme inciso IV do art. 94.',
    obrigatorio:
      'Adotar sistema de senha indicando o horário de chegada correspondente a cada usuário, independente do número de serviços por ele solicitados.',
    proibido: 'O texto normativo deste inciso não enumera vedações expressas.',
    impacto:
      'Módulo de senhas e filas do Orius deve registrar horário de chegada por usuário, não por serviço solicitado.',
    baseRef: 'Art. 94, inciso IV',
    notaIncompleto: null,
  },
  {
    slug: 'art-94-inc-v-atendimento-discreto',
    tituloRegra: 'Atendimento em ambiente separado para preservar intimidade',
    categoria: 'obrigacao',
    criticidade: 'media',
    palavras: ['intimidade', 'discrição', 'ambiente separado', 'atendimento'],
    resumo:
      'Usuários em situação que exija maior discrição devem ser atendidos em **ambiente separado**, para preservar a intimidade.',
    quando:
      'Quando o usuário apresentar situação que exija maior discrição no atendimento ao público, conforme inciso V do art. 94.',
    obrigatorio:
      'Realizar o usuário que apresentar situação que exija maior discrição em ambiente separado, a fim de preservar sua intimidade.',
    proibido: 'O texto normativo deste inciso não enumera vedações expressas.',
    impacto:
      'Layout de salas e roteamento de atendimento no Orius deve prever ambiente reservado para casos de maior discrição.',
    baseRef: 'Art. 94, inciso V',
    notaIncompleto: '*(inciso com conector final «; e» — possível truncamento na fonte)*',
  },
  {
    slug: 'art-94-inc-vi-atendimento-titular',
    tituloRegra: 'Atendimento pelo titular ou substituto legal',
    categoria: 'obrigacao',
    criticidade: 'media',
    palavras: ['notário', 'oficial de registro', 'substituto legal', 'atendimento'],
    resumo:
      'Quando necessário ou a pedido do interessado, o atendimento deve ser prestado pelo **notário, oficial de registro ou substituto legal**.',
    quando:
      'Em caso de necessidade ou requerimento do interessado no atendimento ao público, conforme inciso VI do art. 94.',
    obrigatorio:
      'Prestar atendimento pelo notário, oficial de registro ou substituto legal, em caso de necessidade ou requerimento do interessado.',
    proibido: 'O texto normativo deste inciso não enumera vedações expressas.',
    impacto:
      'Escalonamento de atendimento no Orius deve permitir direcionar ao titular ou substituto legal quando exigido.',
    baseRef: 'Art. 94, inciso VI',
    notaIncompleto: null,
  },
  {
    slug: 'art-94-paragrafo-1-pesquisa-satisfacao',
    tituloRegra: 'Pesquisa permanente de satisfação dos usuários',
    categoria: 'obrigacao',
    criticidade: 'media',
    palavras: ['pesquisa de satisfação', 'atendimento', 'serventia'],
    resumo:
      'O responsável deve realizar **pesquisa permanente** sobre o grau de satisfação com os serviços e atendimentos da serventia.',
    quando: 'Na gestão do serviço extrajudicial, conforme §1º do art. 94.',
    obrigatorio:
      'Realizar pesquisa permanente que indique o grau de satisfação com os serviços prestados e atendimentos realizados na serventia.',
    proibido: 'O texto normativo deste parágrafo não enumera vedações expressas.',
    impacto:
      'Módulos de qualidade e feedback no Orius devem suportar pesquisa contínua de satisfação vinculada à serventia.',
    baseRef: 'Art. 94, §1º',
    notaIncompleto: '*(texto extraído com prefixo truncado)*',
  },
  {
    slug: 'art-94-paragrafo-2-vedacao-atos-internos',
    tituloRegra: 'Vedação de atos internos que limitem o atendimento',
    categoria: 'vedacao',
    criticidade: 'alta',
    palavras: ['vedação', 'atos internos', 'atendimento', 'serventia'],
    resumo:
      'É **vedada** a expedição de atos internos que limitem ou dificultem o atendimento às pessoas que usem os serviços da serventia.',
    quando: 'Na regulamentação interna e expediente de atos administrativos da serventia, conforme §2º do art. 94.',
    obrigatorio: 'O texto normativo deste parágrafo não impõe obrigações positivas além da vedação expressa.',
    proibido:
      'Expedir atos internos que limitem ou dificultem o atendimento às pessoas que se utilizem dos serviços da serventia.',
    impacto:
      'Normas internas e workflows administrativos no Orius não podem restringir atendimento além do permitido em lei.',
    baseRef: 'Art. 94, §2º',
    notaIncompleto: '*(texto extraído com prefixo truncado)*',
  },
  {
    slug: 'art-95-atendimento-prioritario',
    tituloRegra: 'Atendimento com respeito e prioridade a grupos vulneráveis',
    categoria: 'obrigacao',
    criticidade: 'alta',
    palavras: ['atendimento prioritário', 'deficiência', 'idosos', 'gestantes', 'acessibilidade'],
    resumo:
      'Notários e oficiais de registros devem atender com **respeito, eficiência e presteza**, garantindo **atendimento prioritário** a pessoas com deficiência, idosos (60+), gestantes, lactantes, pessoas com crianças de colo e obesos.',
    quando: 'Em todo atendimento às partes nas serventias extrajudiciais, conforme o art. 95.',
    obrigatorio:
      'Atender as partes com respeito, eficiência e presteza, observando atendimento prioritário aos grupos previstos, mediante lugar privilegiado em filas, senhas preferenciais ou atendimento personalizado e espaço com acessibilidade, ressalvada prioridade registral em lei.',
    proibido: 'O texto normativo deste artigo não enumera vedações expressas.',
    impacto:
      'Filas, senhas e layout de atendimento no [[Orius/empresa/produtos/00-indice-produtos]] devem implementar prioridades legais sem prejudicar prioridade registral quando aplicável.',
    baseRef: 'Art. 95 (caput)',
    notaIncompleto: null,
  },
  {
    slug: 'art-95-paragrafo-1-registro-imoveis',
    tituloRegra: 'Atendimento prioritário no RI sem direitos contraditórios',
    categoria: 'obrigacao',
    criticidade: 'media',
    palavras: ['Registro de Imóveis', 'atendimento prioritário', 'certidões', 'averbações'],
    resumo:
      'As regras de atendimento do art. 95 aplicam-se ao **Registro de Imóveis** em atos sem repercussão em direitos contraditórios (ex.: certidões, informações, averbações).',
    quando:
      'No serviço de Registro de Imóveis quando não houver repercussão em direitos contraditórios, conforme §1º do art. 95.',
    obrigatorio:
      'Aplicar o disposto no caput do art. 95 aos casos sem direitos contraditórios, como recepção de título para exame e cálculo de emolumentos, certidões, informações e pedidos de averbações.',
    proibido: 'O texto normativo deste parágrafo não enumera vedações expressas.',
    impacto:
      'Módulo de Registro de Imóveis no Orius deve distinguir atos sem contraditório (prioridade de atendimento do art. 95) dos que exigem ordem de precedência (§2º).',
    baseRef: 'Art. 95, §1º',
    notaIncompleto: '*(texto extraído com prefixo truncado)*',
  },
  {
    slug: 'art-95-paragrafo-2-ordem-precedencia',
    tituloRegra: 'Ordem de precedência em títulos com direitos contraditórios',
    categoria: 'procedimento',
    criticidade: 'alta',
    palavras: ['ordem de precedência', 'direitos contraditórios', 'número de ordem geral'],
    resumo:
      'O oficial de registro deve adotar regime interno que assegure a **ordem de precedência** na apresentação de títulos com direitos contraditórios, com **número de ordem geral**.',
    quando:
      'Na apresentação de títulos que geram direitos contraditórios no registro, conforme §2º do art. 95.',
    obrigatorio:
      'Adotar o melhor regime interno para assegurar às partes a ordem de precedência na apresentação dos títulos contraditórios, estabelecendo sempre o número de ordem geral.',
    proibido: 'O texto normativo deste parágrafo não enumera vedações expressas.',
    impacto:
      'Protocolo e numeração de ordem no Orius devem registrar precedência entre títulos contraditórios conforme regime interno do oficial.',
    baseRef: 'Art. 95, §2º',
    notaIncompleto: '*(texto extraído com prefixo truncado)*',
  },
  {
    slug: 'art-95-paragrafo-3-prioridade-deficiencia-trecho-incompleto',
    tituloRegra: 'Extensão do atendimento prioritário (art. 95, §3º) — trecho incompleto',
    categoria: 'obrigacao',
    criticidade: 'media',
    palavras: ['atendimento prioritário', 'deficiência', 'trecho incompleto'],
    resumo:
      'O atendimento prioritário da pessoa com deficiência é extensivo a alguém ou situação que **não consta** na extração — o §3º está truncado.',
    quando: 'Na aplicação do atendimento prioritário a pessoas com deficiência, conforme §3º do art. 95.',
    obrigatorio:
      'O texto normativo extraído está incompleto; consta apenas que o atendimento prioritário da pessoa com deficiência é extensivo ao seu (continuação não consta na fonte).',
    proibido: 'O texto normativo do §3º extraído não enumera vedações expressas.',
    impacto:
      'Regras de prioridade para acompanhantes ou terceiros vinculados à pessoa com deficiência no Orius dependem de complementação do §3º na fonte.',
    baseRef: 'Art. 95, §3º (trecho extraído)',
    notaIncompleto: '*(§3º truncado — extensão do benefício não consta na fonte)*',
    forceIncompleto: true,
  },
  {
    slug: 'art-96-acervo-serventia',
    tituloRegra: 'Permanência e conservação do acervo na serventia',
    categoria: 'obrigacao',
    criticidade: 'alta',
    palavras: ['acervo', 'livros', 'documentos', 'conservação', 'serventia'],
    resumo:
      'Livros, pastas, papéis, fichas e sistemas de computação devem **permanecer nas dependências** da serventia, salvo comunicação prévia ao Corregedor Permanente, sob guarda e conservação do responsável.',
    quando: 'Na gestão do acervo documental e digital da serventia extrajudicial, conforme o art. 96.',
    obrigatorio:
      'Manter livros, pastas, papéis, fichas e sistemas de computação nas dependências da serventia (salvo comunicação prévia ao Corregedor Permanente), zelando por ordem, segurança e conservação.',
    proibido: 'O texto normativo deste artigo não enumera vedações expressas além da permanência no §1º.',
    impacto:
      'Controle de acervo físico e digital no Orius deve refletir que documentos e sistemas integram o acervo extrajudicial e permanecem na serventia.',
    baseRef: 'Art. 96 (caput)',
    notaIncompleto: null,
    capituloOverride: 'IV',
    capituloNome: 'DO ACERVO SEÇÃO I – DAS DISPOSIÇÕES GERAIS',
  },
  {
    slug: 'art-96-paragrafo-1-vedacao-retirada-documentos',
    tituloRegra: 'Vedação de retirada de documentos da serventia',
    categoria: 'vedacao',
    criticidade: 'critica',
    palavras: ['vedação', 'retirada', 'livros', 'documentos', 'correição', 'FUNDESP'],
    resumo:
      'É **vedada** a retirada de livros, papéis e documentos da serventia, salvo autorização específica para fiscalização, correição, FUNDESP ou encadernação.',
    quando: 'Na movimentação de documentos do acervo da serventia extrajudicial, conforme §1º do art. 96.',
    obrigatorio: 'O texto normativo deste parágrafo não impõe obrigações positivas além das exceções à vedação.',
    proibido:
      'Retirar livros, papéis e documentos da serventia, salvo autorização do Corregedor-Geral, Juízes Auxiliares da CGJ, Corregedores Permanentes (fiscalização/correição/PAD/FUNDESP) ou encadernação sob guarda do responsável.',
    impacto:
      'Auditoria de saída de documentos e encadernação no Orius deve bloquear retiradas sem autorização correcional expressa.',
    baseRef: 'Art. 96, §1º',
    notaIncompleto: '*(texto extraído com prefixo truncado)*',
    capituloOverride: 'IV',
    capituloNome: 'DO ACERVO SEÇÃO I – DAS DISPOSIÇÕES GERAIS',
  },
];

function capLabel(m) {
  if (m.capituloOverride) return m.capituloOverride;
  return m.capitulo ? m.capitulo.id : '';
}

function buildMd(item, spec) {
  const m = item.metadados_origem;
  const inc = spec.forceIncompleto || incompletos.has(item.chave);
  const warn = inc ? '⚠️ ' : '';
  const par = m.paragrafo || '';
  const inciso = m.inciso || '';
  const capId = spec.capituloOverride || (m.capitulo ? m.capitulo.id : '');
  const capNome = spec.capituloNome || (m.capitulo ? m.capitulo.nome : '');
  const texto = item.texto_normativo_exato;
  const citacao = spec.notaIncompleto ? ` ${spec.notaIncompleto}` : '';

  let parFront = par || '';
  let incFront = inciso || '';

  const fm = `---
tipo: regra-negocio
area: orius
status: rascunho
fonte: cursor
fonte_normativa: codigo_normas_goias
parte_normativa: parte_geral
livro: III
livro_nome: DOS SERVIÇOS EXTRAJUDICIAIS
titulo: I
capitulo: ${capId}
artigo: "${m.artigo}"
paragrafo: ${parFront ? `"${parFront}"` : ''}
inciso: ${incFront ? incFront : ''}
produto: transversal
publico_alvo: leigo
categoria_regra: ${spec.categoria}
criticidade: ${spec.criticidade}
palavras_chave: [${spec.palavras.join(', ')}]
criado: 2026-06-16
atualizado_em: 2026-06-16
chave_origem: ${item.chave}
---

# Regra: ${warn}${spec.tituloRegra}

## Resumo para leigos

${spec.resumo}

## Quando se aplica

${spec.quando}

## O que e obrigatorio

${spec.obrigatorio}

## O que e proibido

${spec.proibido}

## Prazos e documentos

O texto normativo deste dispositivo não fixa prazos nem lista documentos.

## Impacto no sistema Orius

${spec.impacto}

## Excecoes

O texto normativo deste dispositivo não prevê exceções${par.includes('§1') && m.artigo === '96' ? ' além das autorizações expressas para retirada de documentos' : ''}.

## Base legal rastreavel

- Livro III — DOS SERVIÇOS EXTRAJUDICIAIS
- Título I — DAS SERVENTIAS EXTRAJUDICIAIS
- Capítulo ${capId} — ${capNome}
- ${spec.baseRef}: ${inc ? '⚠️ ' : ''}«${texto}»${citacao}

## Links internos (Produto: [[Orius/empresa/produtos/00-indice-produtos]])
`;

  return fm;
}

const results = [];
fs.mkdirSync(OUT, { recursive: true });

items.forEach((item, i) => {
  const spec = specs[i];
  const file = `${spec.slug}.md`;
  fs.writeFileSync(path.join(OUT, file), buildMd(item, spec), 'utf8');
  const inc = spec.forceIncompleto || incompletos.has(item.chave);
  const alertas = [];
  if (inc) alertas.push('truncado');
  if (spec.notaIncompleto && spec.notaIncompleto.includes('isolado')) alertas.push('inciso isolado');
  if (item.chave.includes('dup2')) alertas.push('dup2');
  results.push({ idx: 30 + i, chave: item.chave, arquivo: file, alertas: alertas.join(', ') || '—' });
});

console.log(JSON.stringify(results, null, 2));
