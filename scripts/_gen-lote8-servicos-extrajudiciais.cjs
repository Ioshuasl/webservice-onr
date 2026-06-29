const fs = require('fs');
const path = require('path');

const data = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'codigo-normas', '_iii_extract_full.json'), 'utf8')
);
const incompletos = new Set(data.incompletosChaves);
const items = data.items.slice(105, 120);

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
    slug: 'art-114-guia-selo-eletronico-trecho-incompleto',
    tituloRegra: 'Guia do Selo Eletrônico — base de cálculo (art. 114, caput) — trecho incompleto',
    categoria: 'custo',
    criticidade: 'critica',
    palavras: ['Guia do Selo Eletrônico', 'selo eletrônico', 'fundos estaduais', 'taxa judiciária', 'SEE', 'trecho incompleto'],
    resumo:
      'A Guia do Selo Eletrônico deve corresponder aos valores de repasse dos fundos estaduais e da taxa judiciária, com base na quantidade de selos solicitados, redimensionados e confirmados pelo notário ou registrador — **o texto extraído interrompe-se** antes de concluir a frase.',
    quando: 'Na emissão e conferência da Guia do Selo Eletrônico no Sistema de Selo Eletrônico (SSE), conforme o art. 114.',
    obrigatorio:
      'A Guia do Selo Eletrônico corresponderá aos valores de repasse dos fundos estaduais e taxa judiciária, tendo como base de cálculo a quantidade de selos eletrônicos solicitados, redimensionados e confirmados pelo notário ou registrador (continuação normativa não consta na fonte extraída).',
    proibido: 'O texto normativo extraído não enumera vedações expressas.',
    prazos: 'O texto normativo extraído não fixa prazos nem lista documentos.',
    impacto:
      'Integração SEE/SSE no [[Orius/empresa/produtos/00-indice-produtos]] deve tratar a guia conforme selos solicitados, redimensionados e confirmados; complementar regra quando o caput integral estiver disponível na fonte.',
    excecoes: 'O texto normativo extraído não prevê exceções.',
    baseRef: 'Art. 114 (caput, trecho extraído)',
    notaIncompleto: '*(caput truncado — frase interrompe em «referente»)*',
    forceIncompleto: true,
    tituloId: 'II',
    capId: 'II',
    capNome: 'DO SISTEMA DE SELO ELETRÔNICO SEÇÃO I – DAS DISPOSIÇÕES GERAIS',
  },
  {
    slug: 'art-115-redimensionamento-selo-eletronico',
    tituloRegra: 'Definição de redimensionamento de selos eletrônicos',
    categoria: 'definicao',
    criticidade: 'critica',
    palavras: ['redimensionamento', 'SSE', 'selo eletrônico', 'decêndio', 'guia'],
    resumo:
      '**Redimensionamento** é redefinir, pelo SSE, a quantidade de selos solicitados no decêndio, atestando que a guia gerada e confirmada corresponde aos selos solicitados e utilizados no período.',
    quando: 'Para fins do Código de Normas, ao operar pedidos e guias de selo eletrônico no decêndio, conforme o art. 115.',
    obrigatorio:
      'Considerar redimensionamento o ato de redefinir, por meio do Sistema de Selo Eletrônico – SSE, a quantidade de selos eletrônicos solicitados no decêndio, atestando-se que a guia a ser gerada e confirmada corresponderá aos selos solicitados e utilizados no período.',
    proibido: 'O texto normativo deste artigo não enumera vedações expressas.',
    prazos: 'Período de referência: decêndio. O texto normativo não fixa outros prazos nem lista documentos.',
    impacto:
      'Módulo de selo eletrônico no [[Orius/empresa/produtos/00-indice-produtos]] deve implementar fluxo de redimensionamento no SSE antes da confirmação da guia.',
    excecoes: 'O texto normativo deste artigo não prevê exceções.',
    baseRef: 'Art. 115 (caput)',
    tituloId: 'II',
    capId: 'II',
    capNome: 'DO SISTEMA DE SELO ELETRÔNICO SEÇÃO I – DAS DISPOSIÇÕES GERAIS',
  },
  {
    slug: 'art-115-paragrafo-1-guia-sem-redimensionamento',
    tituloRegra: 'Guia automática quando não houver redimensionamento',
    categoria: 'obrigacao',
    criticidade: 'critica',
    palavras: ['redimensionamento', 'SSE', 'guia', 'selos solicitados'],
    resumo:
      'Se o responsável pela serventia **não efetuar o redimensionamento**, o SSE gera guia com valor correspondente ao **quantitativo de selos solicitados**.',
    quando: 'Ao fechar o decêndio de selos eletrônicos sem redimensionamento pelo responsável, conforme §1º do art. 115.',
    obrigatorio:
      'Caso o responsável pela serventia não efetue o redimensionamento, o Sistema de Selo Eletrônico – SSE gerará guia com valor correspondente ao quantitativo de selos solicitados.',
    proibido: 'O texto normativo deste parágrafo não enumera vedações expressas.',
    prazos: 'O texto normativo deste parágrafo não fixa prazos nem lista documentos.',
    impacto: 'O Orius deve alertar quando o redimensionamento não for realizado, pois a guia será emitida pelo valor integral dos selos solicitados.',
    excecoes: 'O texto normativo deste parágrafo não prevê exceções.',
    baseRef: 'Art. 115, §1º',
    notaIncompleto: '*(texto extraído com prefixo truncado)*',
    tituloId: 'II',
    capId: 'II',
    capNome: 'DO SISTEMA DE SELO ELETRÔNICO SEÇÃO I – DAS DISPOSIÇÕES GERAIS',
  },
  {
    slug: 'art-115-paragrafo-2-confirmar-guia-decendio',
    tituloRegra: 'Declaração e botão Confirmar Guia na guia de decêndio',
    categoria: 'obrigacao',
    criticidade: 'critica',
    palavras: ['Confirmar Guia', 'guia de decêndio', 'checagem', 'declaração'],
    resumo:
      'Antes de emitir a guia de decêndio, o responsável deve **declarar** que realizou a checagem dos valores e só então acionar o botão **«Confirmar Guia»**.',
    quando: 'Na emissão da guia de decêndio de selo eletrônico, conforme §2º do art. 115.',
    obrigatorio:
      'A emissão da guia de decêndio será precedida de declaração do responsável pela serventia de que realizou a checagem necessária para aferir a consistência dos valores nela contabilizados, na forma deste artigo, mediante a exibição prévia do botão «Confirmar Guia».',
    proibido: 'O texto normativo deste parágrafo não enumera vedações expressas.',
    prazos: 'O texto normativo deste parágrafo não fixa prazos nem lista documentos.',
    impacto:
      'Interface SEE/SSE no [[Orius/empresa/produtos/00-indice-produtos]] deve exigir declaração de checagem e botão «Confirmar Guia» antes da emissão da guia de decêndio.',
    excecoes: 'O texto normativo deste parágrafo não prevê exceções.',
    baseRef: 'Art. 115, §2º',
    notaIncompleto: '*(texto extraído com prefixo truncado)*',
    tituloId: 'II',
    capId: 'II',
    capNome: 'DO SISTEMA DE SELO ELETRÔNICO SEÇÃO I – DAS DISPOSIÇÕES GERAIS',
  },
  {
    slug: 'art-116-prazo-pagamento-guia-selo-dias-uteis',
    tituloRegra: 'Prazo de pagamento da Guia do Selo Eletrônico — dias úteis',
    categoria: 'prazo',
    criticidade: 'critica',
    palavras: ['Guia do Selo Eletrônico', '5 dias úteis', 'decêndio', 'juros', 'multa'],
    resumo:
      'O pagamento da Guia do Selo Eletrônico deve ocorrer em **5 dias úteis** após o fim do decêndio; depois disso incidem juros, multa e correção monetária conforme Decreto Judiciário nº 48/2015.',
    quando: 'Após o encerramento de cada decêndio de selo eletrônico, conforme caput do art. 116 (redação anterior à variante dup2).',
    obrigatorio: 'Pagar a Guia do Selo Eletrônico em 5 (cinco) dias úteis, contados do fim do decêndio.',
    proibido: 'O texto normativo deste caput não enumera vedações expressas.',
    prazos:
      '5 (cinco) dias úteis, contados do fim do decêndio. Após esse prazo: juros, multa e correção monetária nos termos do art. 2º, §5º, do Decreto Judiciário nº 48/2015.',
    impacto:
      'Controle de vencimento de guias de selo no Orius deve considerar esta redação em dias úteis; verificar vigência frente à variante dup2 (Provimento nº 170/2025).',
    excecoes: 'O texto normativo deste caput não prevê exceções.',
    baseRef: 'Art. 116 (caput, dias úteis)',
    tituloId: 'II',
    capId: 'II',
    capNome: 'DO SISTEMA DE SELO ELETRÔNICO SEÇÃO I – DAS DISPOSIÇÕES GERAIS',
  },
  {
    slug: 'art-116-dup2-prazo-pagamento-dias-corridos',
    tituloRegra: 'Prazo de pagamento da Guia do Selo Eletrônico — dias corridos (Prov. 170/2025)',
    categoria: 'prazo',
    criticidade: 'critica',
    palavras: ['Guia do Selo Eletrônico', '5 dias corridos', 'decêndio', 'Provimento 170', 'dup2'],
    resumo:
      'Redação atual (Provimento nº 170/2025): o pagamento da Guia do Selo Eletrônico ocorre em **5 dias corridos** após o fim do decêndio, com juros, multa e correção monetária após o prazo.',
    quando: 'Após o encerramento de cada decêndio de selo eletrônico, conforme caput do art. 116 com redação do Provimento nº 170/2025 (variante dup2).',
    obrigatorio: 'Pagar a Guia do Selo Eletrônico em 5 (cinco) dias corridos, contados do fim do decêndio.',
    proibido: 'O texto normativo desta variante não enumera vedações expressas.',
    prazos:
      '5 (cinco) dias corridos, contados do fim do decêndio. Após esse prazo: juros, multa e correção monetária nos termos do §5º, art. 2º, do Decreto Judiciário nº 48/2015.',
    impacto:
      'Implementações de vencimento de guia de selo no [[Orius/empresa/produtos/00-indice-produtos]] devem priorizar esta redação em dias corridos (Prov. 170/2025).',
    excecoes: 'O texto normativo desta variante não prevê exceções.',
    baseRef: 'Art. 116 (caput, dias corridos — Prov. 170/2025)',
    tituloId: 'II',
    capId: 'II',
    capNome: 'DO SISTEMA DE SELO ELETRÔNICO SEÇÃO I – DAS DISPOSIÇÕES GERAIS',
  },
  {
    slug: 'art-116-paragrafo-1-bloqueio-pedidos-selos',
    tituloRegra: 'Bloqueio de novos pedidos de selos por inadimplência',
    categoria: 'vedacao',
    criticidade: 'critica',
    palavras: ['bloqueio', 'pedidos de selos', 'inadimplência', 'guia'],
    resumo:
      'Se o responsável **não pagar** a Guia do Selo Eletrônico no prazo, ocorre **bloqueio de novos pedidos de selos** até a quitação dos valores devidos.',
    quando: 'Quando houver atraso no pagamento da Guia do Selo Eletrônico prevista no caput do art. 116, conforme §1º.',
    obrigatorio: 'Quitar os valores devidos da guia para liberar novos pedidos de selos.',
    proibido: 'Solicitar novos selos enquanto persistir inadimplência da guia — o sistema bloqueará novos pedidos.',
    prazos: 'Bloqueio vigente até quitação dos valores devidos da guia.',
    impacto: 'Integração SSE no Orius deve refletir bloqueio automático de pedidos de selo em caso de guia em atraso não paga.',
    excecoes: 'O texto normativo deste parágrafo não prevê exceções.',
    baseRef: 'Art. 116, §1º',
    tituloId: 'II',
    capId: 'II',
    capNome: 'DO SISTEMA DE SELO ELETRÔNICO SEÇÃO I – DAS DISPOSIÇÕES GERAIS',
  },
  {
    slug: 'art-116-paragrafo-2-desbloqueio-automatico-pagamento',
    tituloRegra: 'Desbloqueio automático de pedidos de selos após pagamento',
    categoria: 'obrigacao',
    criticidade: 'critica',
    palavras: ['desbloqueio', 'pagamento', 'instituição financeira', 'selos'],
    resumo:
      'O **desbloqueio** para solicitar selos é **automático** e depende do retorno eletrônico da confirmação de pagamento da guia pela instituição financeira.',
    quando: 'Após o pagamento da Guia do Selo Eletrônico que havia gerado bloqueio, conforme §2º do art. 116.',
    obrigatorio:
      'Aguardar o retorno eletrônico da informação de pagamento da guia pela instituição financeira para que o desbloqueio ocorra automaticamente.',
    proibido: 'O texto normativo deste parágrafo não enumera vedações expressas.',
    prazos: 'Desbloqueio condicionado ao retorno eletrônico do pagamento pela instituição financeira.',
    impacto: 'O Orius deve monitorar confirmação bancária de pagamento de guia para liberar novos pedidos de selo no SSE.',
    excecoes: 'O texto normativo deste parágrafo não prevê exceções.',
    baseRef: 'Art. 116, §2º',
    tituloId: 'II',
    capId: 'II',
    capNome: 'DO SISTEMA DE SELO ELETRÔNICO SEÇÃO I – DAS DISPOSIÇÕES GERAIS',
  },
  {
    slug: 'art-118-guia-recolhimento-teto-remuneratorio',
    tituloRegra: 'Emissão automática da Guia de Recolhimento do Teto Remuneratório',
    categoria: 'custo',
    criticidade: 'critica',
    palavras: ['SDC', 'teto remuneratório', 'guia de recolhimento', 'interino', 'custeio'],
    resumo:
      'O Sistema Declaração de Custeio (SDC) emite automaticamente a **Guia de Recolhimento do Teto Remuneratório** com base nas despesas de custeio informadas pelo interino da serventia vaga, observando receita, despesa e prazo de pagamento nos incisos.',
    quando: 'Na apuração mensal do teto remuneratório de serventia vaga, conforme caput do art. 118.',
    obrigatorio:
      'A Guia de Recolhimento do Teto Remuneratório será emitida automaticamente pelo Sistema Declaração de Custeio, levando-se em consideração as despesas com custeio informadas pelo interino responsável pelo expediente da serventia vaga, observado o seguinte (incisos I a III em notas separadas).',
    proibido: 'O texto normativo do caput não enumera vedações expressas.',
    prazos: 'Prazo de pagamento consta no inciso III (notas separadas).',
    impacto:
      'Módulo SDC no [[Orius/empresa/produtos/00-indice-produtos]] deve integrar emissão automática da guia de teto com dados de custeio do interino.',
    excecoes: 'O texto normativo do caput não prevê exceções.',
    baseRef: 'Art. 118 (caput)',
    tituloId: 'II',
    capId: 'III',
    capNome: 'DO SISTEMA DE DECLARAÇÃO DE CUSTEIO – SDC',
  },
  {
    slug: 'art-118-inc-i-receita-serventia',
    tituloRegra: 'Receita da serventia para cálculo do teto (três guias de decêndio)',
    categoria: 'custo',
    criticidade: 'critica',
    palavras: ['receita', 'emolumentos', 'guias de decêndio', 'teto remuneratório'],
    resumo:
      'A **receita** da serventia, para fins da guia de teto, é o somatório dos emolumentos das **três guias de decêndio** do mês de referência.',
    quando: 'No cálculo da Guia de Recolhimento do Teto Remuneratório pelo SDC, conforme inciso I do art. 118.',
    obrigatorio:
      'Considerar como receita da serventia o somatório dos emolumentos das três guias de decêndio do mês de referência.',
    proibido: 'O texto normativo deste inciso não enumera vedações expressas.',
    prazos: 'Mês de referência das três guias de decêndio. O inciso não fixa outros prazos.',
    impacto: 'Apuração de teto no Orius/SDC deve somar emolumentos das três guias de decêndio do mês.',
    excecoes: 'O texto normativo deste inciso não prevê exceções.',
    baseRef: 'Art. 118, inciso I',
    tituloId: 'II',
    capId: 'III',
    capNome: 'DO SISTEMA DE DECLARAÇÃO DE CUSTEIO – SDC',
  },
  {
    slug: 'art-118-inc-ii-despesa-custeio',
    tituloRegra: 'Despesa de custeio informada pelo interino no SDC',
    categoria: 'custo',
    criticidade: 'critica',
    palavras: ['despesa', 'custeio', 'interino', 'SDC', 'mês de referência'],
    resumo:
      'A **despesa com custeio** da serventia é o somatório dos valores informados pelo interino no Sistema Declaração de Custeio no mês de referência.',
    quando: 'No cálculo da Guia de Recolhimento do Teto Remuneratório, conforme inciso II do art. 118.',
    obrigatorio:
      'Considerar como despesa com custeio da serventia o somatório dos valores informados pelo interino no Sistema Declaração de Custeio no mês de referência.',
    proibido: 'O texto normativo deste inciso não enumera vedações expressas.',
    prazos: 'Mês de referência da declaração de custeio. O inciso não fixa outros prazos.',
    impacto: 'Formulários de custeio no Orius/SDC devem alimentar o somatório de despesas do mês para a guia de teto.',
    excecoes: 'O texto normativo deste inciso não prevê exceções.',
    baseRef: 'Art. 118, inciso II',
    tituloId: 'II',
    capId: 'III',
    capNome: 'DO SISTEMA DE DECLARAÇÃO DE CUSTEIO – SDC',
  },
  {
    slug: 'art-118-inc-iii-prazo-pagamento-teto-dias-uteis',
    tituloRegra: 'Prazo de pagamento da guia de teto — dias úteis',
    categoria: 'prazo',
    criticidade: 'critica',
    palavras: ['teto remuneratório', '5 dias úteis', 'juros', 'multa', 'SDC'],
    resumo:
      'O pagamento da Guia de Recolhimento do Teto Remuneratório ocorre em **5 dias úteis** após o prazo para prestação das informações; depois disso incidem juros, multa e correção monetária.',
    quando: 'Após o encerramento do prazo para prestação das informações de custeio no SDC, conforme inciso III do art. 118 (redação anterior à variante dup2).',
    obrigatorio:
      'Pagar a Guia de Recolhimento do Teto Remuneratório em 5 (cinco) dias úteis, após finalizado o prazo para prestação das informações.',
    proibido: 'O texto normativo deste inciso não enumera vedações expressas.',
    prazos:
      '5 (cinco) dias úteis após finalizado o prazo para prestação das informações. Após: juros, multa e correção monetária (Decreto Judiciário nº 48/2015, art. 2º, §5º).',
    impacto:
      'Vencimento de guia de teto no Orius deve considerar esta redação em dias úteis; confrontar com variante dup2 (Prov. 170/2025).',
    excecoes: 'O texto normativo deste inciso não prevê exceções.',
    baseRef: 'Art. 118, inciso III (dias úteis)',
    tituloId: 'II',
    capId: 'III',
    capNome: 'DO SISTEMA DE DECLARAÇÃO DE CUSTEIO – SDC',
  },
  {
    slug: 'art-118-inc-iii-dup2-prazo-pagamento-dias-corridos',
    tituloRegra: 'Prazo de pagamento da guia de teto — dias corridos (Prov. 170/2025)',
    categoria: 'prazo',
    criticidade: 'critica',
    palavras: ['teto remuneratório', '5 dias corridos', 'Provimento 170', 'dup2', 'SDC'],
    resumo:
      'Redação atual (Provimento nº 170/2025): pagamento da guia de teto em **5 dias corridos** após o prazo para prestação das informações, com encargos após o prazo.',
    quando: 'Após o encerramento do prazo para prestação das informações de custeio, conforme inciso III do art. 118 com redação do Prov. 170/2025 (variante dup2).',
    obrigatorio:
      'Pagar a Guia de Recolhimento do Teto Remuneratório em 5 (cinco) dias corridos após finalizado o prazo para prestação das informações.',
    proibido: 'O texto normativo desta variante não enumera vedações expressas.',
    prazos:
      '5 (cinco) dias corridos após finalizado o prazo para prestação das informações. Após: juros, multa e correção monetária (Decreto Judiciário nº 48/2015, §5º, art. 2º).',
    impacto:
      'Implementações de vencimento de guia de teto no [[Orius/empresa/produtos/00-indice-produtos]] devem priorizar dias corridos (Prov. 170/2025).',
    excecoes: 'O texto normativo desta variante não prevê exceções.',
    baseRef: 'Art. 118, inciso III (dias corridos — Prov. 170/2025)',
    tituloId: 'II',
    capId: 'III',
    capNome: 'DO SISTEMA DE DECLARAÇÃO DE CUSTEIO – SDC',
  },
  {
    slug: 'art-120-debitos-excedente-teto-fiscalizacao',
    tituloRegra: 'Débitos de excedente de teto por fiscalização do TJGO',
    categoria: 'obrigacao',
    criticidade: 'alta',
    palavras: ['excedente de teto', 'fiscalização', 'TJGO', 'SDC', 'débitos'],
    resumo:
      'Os valores apurados pelo SDC nas guias de recolhimento **não excluem** eventuais débitos de excedente de teto identificados em fiscalização dos setores competentes do TJGO.',
    quando: 'Na conferência de obrigações de teto remuneratório após emissão de guias pelo SDC, conforme art. 120.',
    obrigatorio:
      'Considerar que guias do SDC não quitam automaticamente débitos de excedente de teto eventualmente apurados em fiscalização.',
    proibido: 'O texto normativo deste artigo não enumera vedações expressas.',
    prazos: 'O texto normativo deste artigo não fixa prazos nem lista documentos.',
    impacto:
      'O Orius deve manter alertas de débitos de excedente de teto apurados em fiscalização, independentemente das guias geradas pelo SDC.',
    excecoes: 'O texto normativo deste artigo não prevê exceções.',
    baseRef: 'Art. 120',
    tituloId: 'II',
    capId: 'III',
    capNome: 'DO SISTEMA DE DECLARAÇÃO DE CUSTEIO – SDC',
  },
  {
    slug: 'art-121-substituicao-interino-declaracao-custeio',
    tituloRegra: 'Declaração de custeio na substituição do interino',
    categoria: 'obrigacao',
    criticidade: 'alta',
    palavras: ['substituição', 'interino', 'declaração de custeio', 'transmissão de acervo', 'Diretoria do Foro'],
    resumo:
      'Se houver **substituição** do responsável pelo expediente vago, a declaração de custeio do mês da transmissão de acervo deve ser apresentada pelo **novo designado** à Diretoria do Foro, em formulário próprio, com receita e despesa de cada período de respondência.',
    quando: 'No mês em que ocorrer substituição do interino e transmissão de acervo da serventia vaga, conforme art. 121.',
    obrigatorio:
      'Apresentar declaração de custeio referente ao mês da transmissão de acervo pelo novo designado diretamente à Diretoria do Foro, em formulário próprio, especificando receita e despesa dos respectivos períodos de respondência do anterior e do atual interino.',
    proibido: 'O texto normativo deste artigo não enumera vedações expressas.',
    prazos: 'Mês em que ocorrer a transmissão de acervo. Formulário próprio à Diretoria do Foro.',
    impacto:
      'Fluxo de custeio no Orius deve permitir declaração segregada por período de respondência quando houver troca de interino no mês.',
    excecoes: 'O texto normativo deste artigo não prevê exceções.',
    baseRef: 'Art. 121',
    tituloId: 'II',
    capId: 'III',
    capNome: 'DO SISTEMA DE DECLARAÇÃO DE CUSTEIO – SDC',
  },
];

function buildMd(item, spec) {
  const m = item.metadados_origem;
  const inc = spec.forceIncompleto || incompletos.has(item.chave);
  const warn = inc ? '⚠️ ' : '';
  const par = m.paragrafo || '';
  const inciso = m.inciso || '';
  const texto = item.texto_normativo_exato;
  const citacao = spec.notaIncompleto ? ` ${spec.notaIncompleto}` : '';
  const tituloNome = 'DO SISTEMA EXTRAJUDICIAL ELETRÔNICO – SEE';

  return `---
tipo: regra-negocio
area: orius
status: rascunho
fonte: cursor
fonte_normativa: codigo_normas_goias
parte_normativa: parte_geral
livro: III
livro_nome: DOS SERVIÇOS EXTRAJUDICIAIS
titulo: ${spec.tituloId}
capitulo: ${spec.capId}
artigo: "${m.artigo}"
paragrafo: ${par ? `"${par}"` : ''}
inciso: ${inciso || ''}
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

${spec.prazos}

## Impacto no sistema Orius

${spec.impacto}

## Excecoes

${spec.excecoes}

## Base legal rastreavel

- Livro III — DOS SERVIÇOS EXTRAJUDICIAIS
- Título ${spec.tituloId} — ${tituloNome}
- Capítulo ${spec.capId} — ${spec.capNome}
- ${spec.baseRef}: ${inc ? '⚠️ ' : ''}«${texto}»${citacao}

## Links internos (Produto: [[Orius/empresa/produtos/00-indice-produtos]])
`;
}

fs.mkdirSync(OUT, { recursive: true });
const results = [];
items.forEach((item, i) => {
  const spec = specs[i];
  const file = `${spec.slug}.md`;
  fs.writeFileSync(path.join(OUT, file), buildMd(item, spec), 'utf8');
  const alerts = [];
  if (spec.forceIncompleto || incompletos.has(item.chave)) alerts.push('truncado');
  if (item.chave.includes('dup2')) alerts.push('dup2');
  results.push({ idx: 105 + i, chave: item.chave, arquivo: file, alertas: alerts.join(', ') || '—' });
});
console.log(JSON.stringify(results, null, 2));
