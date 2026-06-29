const fs = require('fs');
const path = require('path');

const VAULT = path.join(
  process.env.USERPROFILE || '',
  'Obsidian Vault',
  'Orius',
  'desenvolvimento',
  'regras-de-negocio',
  'servicos-extrajudiciais',
  'regras'
);

const items = [
  {
    file: 'art-106-paragrafo-unico-inc-iii-sircon.md',
    artigo: '106',
    paragrafo: '§único',
    inciso: 'III',
    titulo: 'II',
    capitulo: 'I',
    chave: 'III/II/I/art-106/paragrafo-unico/inciso-iii',
    categoria: 'obrigacao',
    criticidade: 'alta',
    palavras: ['SEE', 'SIRCON', 'registro civil', 'óbito', 'nascimento'],
    title: 'Sistema SIRCON no SEE',
    resumo:
      'O SEE inclui o Sistema Interligado de Registro Civil de Óbito e de Nascimento (SIRCON) como um dos sistemas da plataforma.',
    quando:
      'Quando se integrar ou referenciar os sistemas componentes do SEE previstos no parágrafo único do art. 106, especificamente o inciso III.',
    obrigatorio:
      'Reconhecer o Sistema Interligado de Registro Civil de Óbito e de Nascimento – SIRCON como sistema integrante da plataforma do SEE.',
    proibido: 'O texto normativo deste inciso não enumera vedações expressas.',
    prazos: 'O texto normativo deste inciso não fixa prazos nem lista documentos.',
    impacto:
      'Integrações do [[Orius/empresa/produtos/00-indice-produtos]] com o SEE devem contemplar o SIRCON conforme inciso III do art. 106.',
    excecoes: 'O texto normativo deste inciso não prevê exceções.',
    baseCap: 'Capítulo I — DAS DISPOSIÇÕES GERAIS',
    baseText:
      '«Sistema Interligado de Registro Civil de Óbito e de Nascimento – SIRCON; e»',
    truncado: false,
  },
  {
    file: 'art-106-paragrafo-unico-inc-iv-bate.md',
    artigo: '106',
    paragrafo: '§único',
    inciso: 'IV',
    titulo: 'II',
    capitulo: 'I',
    chave: 'III/II/I/art-106/paragrafo-unico/inciso-iv',
    categoria: 'obrigacao',
    criticidade: 'alta',
    palavras: ['SEE', 'BATE', 'aquisição de terras', 'estrangeiro'],
    title: 'Sistema BATE no SEE',
    resumo:
      'O SEE inclui a Base de Aquisição de Terras por Estrangeiro (BATE) como um dos sistemas da plataforma.',
    quando:
      'Quando se integrar ou referenciar os sistemas componentes do SEE previstos no parágrafo único do art. 106, especificamente o inciso IV.',
    obrigatorio:
      'Reconhecer a Base de Aquisição de Terras por Estrangeiro – BATE como sistema integrante da plataforma do SEE.',
    proibido: 'O texto normativo deste inciso não enumera vedações expressas.',
    prazos: 'O texto normativo deste inciso não fixa prazos nem lista documentos.',
    impacto:
      'Integrações do [[Orius/empresa/produtos/00-indice-produtos]] com o SEE devem contemplar a BATE conforme inciso IV do art. 106.',
    excecoes: 'O texto normativo deste inciso não prevê exceções.',
    baseCap: 'Capítulo I — DAS DISPOSIÇÕES GERAIS',
    baseText: '«Base de Aquisição de Terras por Estrangeiro – BATE.»',
    truncado: false,
  },
  {
    file: 'art-107-modulos-acesso-restrito-e-publico.md',
    artigo: '107',
    paragrafo: null,
    inciso: null,
    titulo: 'II',
    capitulo: 'I',
    chave: 'III/II/I/art-107',
    categoria: 'obrigacao',
    criticidade: 'critica',
    palavras: ['SEE', 'acesso restrito', 'acesso público', 'cadastro'],
    title: 'Módulos de acesso restrito e público no SEE',
    resumo:
      'O SEE terá módulo de acesso restrito para usuários cadastrados e módulo de acesso público aberto a qualquer interessado sem cadastro prévio.',
    quando: 'Na estruturação e disponibilização do Sistema Extrajudicial Eletrônico, conforme caput do art. 107.',
    obrigatorio:
      'Manter no SEE módulo de acesso restrito (usuários previamente cadastrados) e módulo de acesso público (acessível sem prévio cadastro).',
    proibido: 'O texto normativo do caput não enumera vedações expressas.',
    prazos: 'O texto normativo do caput não fixa prazos nem lista documentos.',
    impacto:
      'Arquitetura do SEE no [[Orius/empresa/produtos/00-indice-produtos]] deve separar módulos restrito e público conforme caput do art. 107.',
    excecoes: 'O texto normativo do caput não prevê exceções.',
    baseCap: 'Capítulo I — DAS DISPOSIÇÕES GERAIS',
    baseText:
      '«O Sistema Extrajudicial Eletrônico conterá módulo de acesso restrito, destinado a usuários previamente cadastrados, e de acesso público, acessível a qualquer interessado sem necessidade de prévio cadastro.»',
    truncado: false,
  },
  {
    file: 'art-107-paragrafo-unico-modulo-acesso-publico.md',
    artigo: '107',
    paragrafo: '§único',
    inciso: null,
    titulo: 'II',
    capitulo: 'I',
    chave: 'III/II/I/art-107/paragrafo-unico',
    categoria: 'obrigacao',
    criticidade: 'alta',
    palavras: ['SEE', 'acesso público', 'consulta', 'autenticidade'],
    title: 'Funções do módulo de acesso público',
    resumo:
      'O módulo de acesso público do SEE deve permitir consultas e verificações previstas nos incisos do parágrafo único do art. 107.',
    quando:
      'Na implementação das funcionalidades do módulo de acesso público do SEE, conforme parágrafo único do art. 107.',
    obrigatorio: 'Disponibilizar no módulo de acesso público as funcionalidades enumeradas nos incisos I e II do parágrafo único.',
    proibido: 'O texto normativo deste parágrafo não enumera vedações expressas.',
    prazos: 'O texto normativo deste parágrafo não fixa prazos nem lista documentos.',
    impacto:
      'Portal público do SEE no [[Orius/empresa/produtos/00-indice-produtos]] deve expor as consultas e verificações previstas no § único e incisos do art. 107.',
    excecoes: 'O texto normativo deste parágrafo não prevê exceções.',
    baseCap: 'Capítulo I — DAS DISPOSIÇÕES GERAIS',
    baseText: '«O módulo de acesso público permitirá:»',
    truncado: false,
  },
  {
    file: 'art-107-paragrafo-unico-inc-i-consulta-serventias.md',
    artigo: '107',
    paragrafo: '§único',
    inciso: 'I',
    titulo: 'II',
    capitulo: 'I',
    chave: 'III/II/I/art-107/paragrafo-unico/inciso-i',
    categoria: 'obrigacao',
    criticidade: 'alta',
    palavras: ['SEE', 'serventias', 'arrecadação', 'dados cadastrais', 'consulta pública'],
    title: 'Consulta pública de serventias no SEE',
    resumo:
      'Qualquer pessoa pode consultar no SEE a relação de serventias, arrecadação e dados cadastrais como endereço, telefone, site, responsável e substituto.',
    quando:
      'No módulo de acesso público do SEE, conforme inciso I do parágrafo único do art. 107.',
    obrigatorio:
      'Permitir consultar a relação de serventias extrajudiciais, sua arrecadação e principais dados cadastrais (endereço, telefone, sítio na internet, nome do responsável e do substituto legal).',
    proibido: 'O texto normativo deste inciso não enumera vedações expressas.',
    prazos: 'O texto normativo deste inciso não fixa prazos nem lista documentos.',
    impacto:
      'Consulta pública de cartórios no [[Orius/empresa/produtos/00-indice-produtos]] deve refletir os dados previstos no inciso I do art. 107.',
    excecoes: 'O texto normativo deste inciso não prevê exceções.',
    baseCap: 'Capítulo I — DAS DISPOSIÇÕES GERAIS',
    baseText:
      '«consultar a relação de serventias extrajudiciais, sua arrecadação e seus principais dados cadastrais, como endereço, telefone, sítio na internet, nome do responsável pela serventia e de seu substituto legal; e»',
    truncado: false,
  },
  {
    file: 'art-107-paragrafo-unico-inc-ii-autenticidade-selos.md',
    artigo: '107',
    paragrafo: '§único',
    inciso: 'II',
    titulo: 'II',
    capitulo: 'I',
    chave: 'III/II/I/art-107/paragrafo-unico/inciso-ii',
    categoria: 'obrigacao',
    criticidade: 'critica',
    palavras: ['SEE', 'selo eletrônico', 'autenticidade', 'verificação pública'],
    title: 'Verificação pública de autenticidade de selos',
    resumo:
      'O módulo público do SEE deve permitir verificar a autenticidade dos documentos selados pelas serventias extrajudiciais.',
    quando:
      'No módulo de acesso público do SEE, conforme inciso II do parágrafo único do art. 107.',
    obrigatorio:
      'Permitir verificar a autenticidade dos documentos selados pelas serventias extrajudiciais.',
    proibido: 'O texto normativo deste inciso não enumera vedações expressas.',
    prazos: 'O texto normativo deste inciso não fixa prazos nem lista documentos.',
    impacto:
      'Serviço de validação de selos no [[Orius/empresa/produtos/00-indice-produtos]] deve atender ao inciso II do art. 107.',
    excecoes: 'O texto normativo deste inciso não prevê exceções.',
    baseCap: 'Capítulo I — DAS DISPOSIÇÕES GERAIS',
    baseText:
      '«verificar a autenticidade dos documentos selados pelas serventias extrajudiciais.»',
    truncado: false,
  },
  {
    file: 'art-108-atualizacao-dados-see.md',
    artigo: '108',
    paragrafo: null,
    inciso: null,
    titulo: 'II',
    capitulo: 'I',
    chave: 'III/II/I/art-108',
    categoria: 'obrigacao',
    criticidade: 'critica',
    palavras: ['SEE', 'dados pessoais', 'prepostos', 'ato designativo', 'atualização'],
    title: 'Atualização de dados no SEE',
    resumo:
      'O responsável pela serventia deve manter atualizados no SEE seus dados pessoais e dos prepostos, juntando o ato designativo em campo próprio.',
    quando:
      'Na gestão cadastral de responsável e prepostos no SEE, conforme caput do art. 108.',
    obrigatorio:
      'Manter dados pessoais do responsável e de prepostos atualizados no SEE, com juntada do ato designativo em campo próprio.',
    proibido: 'O texto normativo do caput não enumera vedações expressas.',
    prazos: 'O texto normativo do caput não fixa prazos nem lista documentos.',
    impacto:
      'Cadastro de titular e prepostos no [[Orius/empresa/produtos/00-indice-produtos]] deve sincronizar com o SEE e anexar ato designativo conforme art. 108.',
    excecoes: 'O texto normativo do caput não prevê exceções.',
    baseCap: 'Capítulo I — DAS DISPOSIÇÕES GERAIS',
    baseText:
      '«O responsável pela serventia extrajudicial manterá os seus dados pessoais e de prepostos atualizados no SEE, fazendo a juntada do ato designativo em campo próprio destinado a essa finalidade.»',
    truncado: false,
  },
  {
    file: 'art-108-paragrafo-2-cadastro-empresas-automacao.md',
    artigo: '108',
    paragrafo: '§2º',
    inciso: null,
    titulo: 'II',
    capitulo: 'I',
    chave: 'III/II/I/art-108/paragrafo-2',
    categoria: 'obrigacao',
    criticidade: 'alta',
    palavras: ['SEE', 'empresas de automação', 'cadastro', 'responsável'],
    title: 'Cadastro de empresas de automação no SEE',
    resumo:
      'O responsável pela serventia deve cadastrar no SEE as empresas de automação que contratar.',
    quando:
      'Ao contratar empresa de automação para a serventia, conforme §2º do art. 108.',
    obrigatorio:
      'Cadastrar no Sistema Extrajudicial Eletrônico as empresas de automação contratadas pela serventia.',
    proibido: 'O texto normativo deste parágrafo não enumera vedações expressas.',
    prazos: 'O texto normativo deste parágrafo não fixa prazos nem lista documentos.',
    impacto:
      'Registro de fornecedor de automação no [[Orius/empresa/produtos/00-indice-produtos]] deve alimentar o cadastro previsto no §2º do art. 108.',
    excecoes: 'O texto normativo deste parágrafo não prevê exceções.',
    baseCap: 'Capítulo I — DAS DISPOSIÇÕES GERAIS',
    baseText:
      '«. Incumbe ao responsável pela serventia cadastrar no Sistema Extrajudicial Eletrônico as empresas de automação que contratar.»',
    truncado: true,
  },
  {
    file: 'art-109-selo-eletronico-cgj.md',
    artigo: '109',
    paragrafo: null,
    inciso: null,
    titulo: 'II',
    capitulo: 'II',
    chave: 'III/II/II/art-109',
    categoria: 'obrigacao',
    criticidade: 'critica',
    palavras: ['selo eletrônico', 'CGJ', 'autenticidade', 'repasses', 'tributos'],
    title: 'Adoção obrigatória do selo eletrônico da CGJ',
    resumo:
      'As serventias de Goiás adotarão o selo eletrônico da Corregedoria-Geral da Justiça para autenticar atos e aferir repasses e tributos.',
    quando:
      'Na prática de atos extrajudiciais e controle fiscal, conforme caput do art. 109.',
    obrigatorio:
      'Adotar o selo eletrônico fornecido por sistema próprio da Corregedoria-Geral da Justiça como forma de autenticidade dos atos e de aferição dos repasses e tributos devidos.',
    proibido: 'O texto normativo do caput não enumera vedações expressas.',
    prazos: 'O texto normativo do caput não fixa prazos nem lista documentos.',
    impacto:
      'Módulo de selo eletrônico no [[Orius/empresa/produtos/00-indice-produtos]] deve integrar o sistema da CGJ conforme art. 109.',
    excecoes: 'O texto normativo do caput não prevê exceções.',
    baseCap: 'Capítulo II — DO SISTEMA DE SELO ELETRÔNICO (Seção I — Das Disposições Gerais)',
    baseText:
      '«As serventias extrajudiciais do Estado de Goiás adotarão o selo eletrônico fornecido por sistema próprio da Corregedoria-Geral da Justiça como forma de autenticidade de seus atos e de aferição dos repasses e tributos devidos.»',
    truncado: false,
  },
  {
    file: 'art-109-paragrafo-unico-vinculacao-selo-ato.md',
    artigo: '109',
    paragrafo: '§único',
    inciso: null,
    titulo: 'II',
    capitulo: 'II',
    chave: 'III/II/II/art-109/paragrafo-unico',
    categoria: 'obrigacao',
    criticidade: 'critica',
    palavras: ['selo eletrônico', 'vinculação', 'ato extrajudicial', 'identificador único', 'fiscal'],
    title: 'Vinculação obrigatória de selo a cada ato',
    resumo:
      'Todo ato extrajudicial deve vincular-se a um selo eletrônico específico, com identificador único para fins fiscais e de autenticidade.',
    quando: 'Em cada ato praticado no foro extrajudicial, conforme parágrafo único do art. 109.',
    obrigatorio:
      'Vincular obrigatoriamente cada ato praticado no foro extrajudicial a um selo eletrônico específico, sendo o identificador único para efeitos fiscais e de autenticidade.',
    proibido: 'O texto normativo deste parágrafo não enumera vedações expressas.',
    prazos: 'O texto normativo deste parágrafo não fixa prazos nem lista documentos.',
    impacto:
      'Lavatura de atos no [[Orius/empresa/produtos/00-indice-produtos]] deve exigir selo vinculado conforme § único do art. 109.',
    excecoes: 'O texto normativo deste parágrafo não prevê exceções.',
    baseCap: 'Capítulo II — DO SISTEMA DE SELO ELETRÔNICO (Seção I — Das Disposições Gerais)',
    baseText:
      '«Todo ato praticado no foro extrajudicial vincula-se obrigatoriamente a um selo eletrônico específico, sendo o seu identificador único para efeitos fiscais e de autenticidade.»',
    truncado: false,
  },
  {
    file: 'art-110-gerenciamento-responsabilidade-notario.md',
    artigo: '110',
    paragrafo: null,
    inciso: null,
    titulo: 'II',
    capitulo: 'II',
    chave: 'III/II/II/art-110',
    categoria: 'obrigacao',
    criticidade: 'critica',
    palavras: ['gerenciamento', 'notário', 'registrador', 'automação', 'CGJ'],
    title: 'Responsabilidade do notário pelo gerenciamento',
    resumo:
      'O gerenciamento administrativo e financeiro dos serviços extrajudiciais é de responsabilidade exclusiva do notário e registrador, que deve observar normas da CGJ sobre automação.',
    quando:
      'Na gestão administrativa, financeira e de sistemas de automação da serventia, conforme caput do art. 110.',
    obrigatorio:
      'Assumir a responsabilidade exclusiva pelo gerenciamento administrativo e financeiro e observar normas da Corregedoria-Geral da Justiça sobre requisitos e funcionalidades de sistemas e serviços de automação.',
    proibido: 'O texto normativo do caput não enumera vedações expressas.',
    prazos: 'O texto normativo do caput não fixa prazos nem lista documentos.',
    impacto:
      'Governança de automação no [[Orius/empresa/produtos/00-indice-produtos]] deve refletir a responsabilidade do titular conforme art. 110.',
    excecoes: 'O texto normativo do caput não prevê exceções.',
    baseCap: 'Capítulo II — DO SISTEMA DE SELO ELETRÔNICO (Seção I — Das Disposições Gerais)',
    baseText:
      '«O gerenciamento administrativo e financeiro dos serviços extrajudiciais é de responsabilidade exclusiva do notário e registrador, cabendo-lhe observar as normas editadas pela Corregedoria-Geral da Justiça acerca dos requisitos e funcionalidades exigidos para os sistemas e serviços de automação.»',
    truncado: false,
  },
  {
    file: 'art-110-paragrafo-1-webservice-selos.md',
    artigo: '110',
    paragrafo: '§1º',
    inciso: null,
    titulo: 'II',
    capitulo: 'II',
    chave: 'III/II/II/art-110/paragrafo-1',
    categoria: 'obrigacao',
    criticidade: 'critica',
    palavras: ['automação', 'selo eletrônico', 'Web Service', 'integração'],
    title: 'Adequação do sistema de automação via Web Service',
    resumo:
      'O sistema de automação da serventia deve adequar-se à solicitação e retorno de informações dos selos, preferencialmente via Web Service.',
    quando:
      'Na integração do sistema de automação com o sistema de selos eletrônicos, conforme §1º do art. 110.',
    obrigatorio:
      'Adequar o sistema de automação da serventia à forma de solicitação e retorno das informações dos selos eletrônicos, preferencialmente via conexão Web Service.',
    proibido: 'O texto normativo deste parágrafo não enumera vedações expressas.',
    prazos: 'O texto normativo deste parágrafo não fixa prazos nem lista documentos.',
    impacto:
      'API de selos no [[Orius/empresa/produtos/00-indice-produtos]] deve priorizar Web Service conforme §1º do art. 110.',
    excecoes: 'O texto normativo deste parágrafo não prevê exceções.',
    baseCap: 'Capítulo II — DO SISTEMA DE SELO ELETRÔNICO (Seção I — Das Disposições Gerais)',
    baseText:
      '«. O sistema de automação da serventia se adequará à forma de solicitação e retorno das informações dos selos eletrônicos, a qual ocorrerá preferencialmente via conexão Web Service.»',
    truncado: true,
  },
  {
    file: 'art-110-paragrafo-2-estoque-selos-limite.md',
    artigo: '110',
    paragrafo: '§2º',
    inciso: null,
    titulo: 'II',
    capitulo: 'II',
    chave: 'III/II/II/art-110/paragrafo-2',
    categoria: 'obrigacao',
    criticidade: 'alta',
    palavras: ['estoque de selos', 'limite máximo', 'CGJ', 'gerenciamento eletrônico'],
    title: 'Gerenciamento de estoque de selos com limite da CGJ',
    resumo:
      'A ordenação e o gerenciamento eletrônico do estoque de selos devem obedecer ao limite máximo definido pela CGJ para o tipo de ato.',
    quando: 'No controle de estoque de selos eletrônicos solicitados, conforme §2º do art. 110.',
    obrigatorio:
      'Ordenar e gerenciar eletronicamente o estoque de selos solicitados em obediência ao limite máximo definido pela Corregedoria-Geral da Justiça para o tipo de ato respectivo.',
    proibido: 'O texto normativo deste parágrafo não enumera vedações expressas.',
    prazos: 'O texto normativo deste parágrafo não fixa prazos nem lista documentos.',
    impacto:
      'Controle de estoque de selos no [[Orius/empresa/produtos/00-indice-produtos]] deve respeitar limites da CGJ conforme §2º do art. 110.',
    excecoes: 'O texto normativo deste parágrafo não prevê exceções.',
    baseCap: 'Capítulo II — DO SISTEMA DE SELO ELETRÔNICO (Seção I — Das Disposições Gerais)',
    baseText:
      '«. A ordenação e o gerenciamento eletrônico do estoque de selos solicitados darse-á em obediência ao limite máximo definido pela Corregedoria-Geral da Justiça para o tipo de ato respectivo.»',
    truncado: true,
  },
  {
    file: 'art-110-paragrafo-3-uso-sequencial-selo.md',
    artigo: '110',
    paragrafo: '§3º',
    inciso: null,
    titulo: 'II',
    capitulo: 'II',
    chave: 'III/II/II/art-110/paragrafo-3',
    categoria: 'obrigacao',
    criticidade: 'critica',
    palavras: ['selo eletrônico', 'sequencial', 'lote', 'autenticidade', 'tipo de ato'],
    title: 'Uso sequencial e vinculação de selo por tipo de ato',
    resumo:
      'Os selos de um lote devem ser usados em sequência, cada um vinculado a um tipo de ato específico, garantindo correspondência entre ato lavrado e selo.',
    quando: 'Na utilização de selos de um lote, conforme §3º do art. 110.',
    obrigatorio:
      'Utilizar selos de um lote de forma sequencial, com vinculação de selo eletrônico específico a determinado tipo de ato, garantindo correspondência entre informações do ato lavrado e do selo e possibilitando verificar autenticidade.',
    proibido: 'O texto normativo deste parágrafo não enumera vedações expressas.',
    prazos: 'O texto normativo deste parágrafo não fixa prazos nem lista documentos.',
    impacto:
      'Fluxo de consumo de selos no [[Orius/empresa/produtos/00-indice-produtos]] deve ser sequencial e por tipo de ato conforme §3º do art. 110.',
    excecoes: 'O texto normativo deste parágrafo não prevê exceções.',
    baseCap: 'Capítulo II — DO SISTEMA DE SELO ELETRÔNICO (Seção I — Das Disposições Gerais)',
    baseText:
      '«. A utilização dos selos de um lote ocorrerá de forma sequencial e observará a necessária vinculação de um selo eletrônico específico a um determinado tipo de ato, de forma a garantir a exata correspondência entre as informações do ato lavrado e aquelas disponibilizadas no selo eletrônico, possibilitando verificar sua autenticidade.»',
    truncado: true,
  },
  {
    file: 'art-110-paragrafo-3-dup2-transmissao-selo-trecho-incompleto.md',
    artigo: '110',
    paragrafo: '§3º',
    inciso: null,
    titulo: 'II',
    capitulo: 'II',
    chave: 'III/II/II/art-110/paragrafo-3',
    categoria: 'obrigacao',
    criticidade: 'alta',
    palavras: ['selo eletrônico', 'transmissão', 'base unificada', 'trecho incompleto', 'dup2'],
    title: 'Transmissão de dados do selo à base unificada (trecho incompleto)',
    resumo:
      'Fragmento extraído indica obrigação de transmitir dados essenciais do selo eletrônico à base unificada, mas o texto corta antes de concluir a frase.',
    quando:
      'Na transmissão de dados de selos eletrônicos, conforme fragmento extraído com mesma chave do §3º do art. 110.',
    obrigatorio:
      'Transmitir os dados essenciais do selo eletrônico à base unificada da (continuação não consta na fonte).',
    proibido: 'O texto normativo deste fragmento extraído não enumera vedações expressas.',
    prazos: 'O texto normativo deste fragmento extraído não fixa prazos nem lista documentos.',
    impacto:
      'Integração de selos com base unificada no [[Orius/empresa/produtos/00-indice-produtos]] deve aguardar complementação normativa; fragmento registrado com mesma chave_origem do §3º.',
    excecoes: 'O texto normativo deste fragmento extraído não prevê exceções.',
    baseCap: 'Capítulo II — DO SISTEMA DE SELO ELETRÔNICO (Seção I — Das Disposições Gerais)',
    baseText:
      '«. A transmissão dos dados essenciais do selo eletrônico à base unificada da»',
    truncado: true,
    incompleto: true,
    dup2: true,
  },
];

function parRef(p) {
  if (!p) return 'caput';
  if (p === '§único') return 'parágrafo único';
  return p;
}

function artRef(it) {
  let r = `Art. ${it.artigo}`;
  if (it.paragrafo) r += `, ${it.paragrafo}`;
  if (it.inciso) r += `, inciso ${it.inciso}`;
  return r;
}

function buildMd(it) {
  const warnTitle = it.incompleto ? '⚠️ ' : it.truncado ? '⚠️ ' : '';
  const parLine = it.paragrafo ? `paragrafo: "${it.paragrafo}"` : 'paragrafo:';
  const incLine = it.inciso ? `inciso: ${it.inciso}` : 'inciso:';

  let incompletoBlock = '';
  if (it.incompleto) {
    incompletoBlock = `

> **Texto incompleto na fonte:** o fragmento interrompe-se antes de concluir a frase. O conteúdo abaixo reflete apenas o que consta no JSON, sem complementação.`;
  }

  const truncNote = it.truncado
    ? it.incompleto
      ? ' *(texto incompleto na fonte; mesma chave_origem que redação principal do §3º)*'
      : ' *(texto extraído com prefixo truncado)*'
    : '';

  const dupNote = it.dup2 ? ' *(fragmento dup2 com mesma chave_origem)*' : '';

  return `---
tipo: regra-negocio
area: orius
status: rascunho
fonte: cursor
fonte_normativa: codigo_normas_goias
parte_normativa: parte_geral
livro: III
livro_nome: DOS SERVIÇOS EXTRAJUDICIAIS
titulo: ${it.titulo}
capitulo: ${it.capitulo}
artigo: "${it.artigo}"
${parLine}
${incLine}
produto: transversal
publico_alvo: leigo
categoria_regra: ${it.categoria}
criticidade: ${it.criticidade}
palavras_chave: [${it.palavras.join(', ')}]
criado: 2026-06-16
atualizado_em: 2026-06-16
chave_origem: ${it.chave}
---

# Regra: ${warnTitle}${it.title}
${incompletoBlock}

## Resumo para leigos

${it.resumo}

## Quando se aplica

${it.quando}

## O que e obrigatorio

${it.obrigatorio}

## O que e proibido

${it.proibido}

## Prazos e documentos

${it.prazos}

## Impacto no sistema Orius

${it.impacto}

## Excecoes

${it.excecoes}

## Base legal rastreavel

- Livro III — DOS SERVIÇOS EXTRAJUDICIAIS
- Título II — DO SISTEMA EXTRAJUDICIAL ELETRÔNICO – SEE
- ${it.baseCap}
- ${artRef(it)}: ${it.truncado || it.incompleto ? '⚠️ ' : ''}${it.baseText}${truncNote}${dupNote}

## Links internos (Produto: [[Orius/empresa/produtos/00-indice-produtos]])
`;
}

if (!fs.existsSync(VAULT)) {
  console.error('Vault path not found:', VAULT);
  process.exit(1);
}

for (const it of items) {
  const dest = path.join(VAULT, it.file);
  fs.writeFileSync(dest, buildMd(it), 'utf8');
  console.log('Wrote', it.file);
}

console.log('Done:', items.length, 'files');
