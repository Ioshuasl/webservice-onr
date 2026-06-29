#!/usr/bin/env node
/**
 * Bootstrap ecosystem-state + mvp batch para rtd, protesto, caixa.
 * Uso: node scripts/bootstrap-delphi-mvp-products.cjs
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname);

const TRIAGE = [
  { glob: '**/dependencias/**', tier: 'T0', action: 'skip' },
  { glob: '**/ResponsiveListDemo.dpr', tier: 'T0', action: 'skip' },
  { glob: '**/DemoObjHID.dpr', tier: 'T0', action: 'skip' },
  { glob: '**/demoprj/Project1.dpr', tier: 'T0', action: 'skip' },
  { glob: '**/Tests/**', tier: 'T0', action: 'skip' },
  { glob: '**/*Cópia*', tier: 'T0', action: 'skip' },
  { glob: '**/*Copia*', tier: 'T0', action: 'skip' },
  { glob: '**/frxClass.pas', tier: 'T0', action: 'skip' },
  { glob: '**/mORMotReport.pas', tier: 'T0', action: 'skip' },
  { glob: '**/*.old/**', tier: 'T0', action: 'skip' },
  { glob: '**/geral/Controles.pas', tier: 'T1', action: 'full' },
  { glob: '**/Principal.pas', tier: 'T1', action: 'full' },
  { glob: '**/dm*.pas', tier: 'T1', action: 'full' },
  { glob: '**/Lockup*.pas', tier: 'T1', action: 'full' },
  { glob: '**/ws*.pas', tier: 'T2', action: 'full' },
  { glob: '**/geral_sistemas/**', tier: 'T2', action: 'full' },
  { glob: '**/Frame*.pas', tier: 'T3', action: 'full' },
  { glob: '**/wsInterface.pas', tier: 'T4', action: 'stub' },
];

const PRODUCTS = {
  rtd: {
    product_path: 'RegistroDeTitulosEDocumentos',
    vault_hub: 'Orius/desenvolvimento/legado-delphi/produtos/rtd',
    prefix: 'rtd',
    active_domain: 'rtd-core-controles',
    mvp: [
      'RegistroDeTitulosEDocumentos/geral/Controles.pas',
      'RegistroDeTitulosEDocumentos/LockupRTD.pas',
      'RegistroDeTitulosEDocumentos/geral/Login.pas',
      'RegistroDeTitulosEDocumentos/Principal.pas',
      'RegistroDeTitulosEDocumentos/LivroProtocolo.pas',
      'RegistroDeTitulosEDocumentos/RegistroDocumento.pas',
      'RegistroDeTitulosEDocumentos/Documento.pas',
      'RegistroDeTitulosEDocumentos/Certidao.pas',
      'RegistroDeTitulosEDocumentos/RegistroAverbacao.pas',
    ],
    domains: {
      'rtd-shell': {
        label: 'Shell, login e configuração',
        priority: 'P0',
        execution_order: [
          'RegistroDeTitulosEDocumentos/geral/Login.pas',
          'RegistroDeTitulosEDocumentos/geral/Splash.pas',
          'RegistroDeTitulosEDocumentos/geral/Config.pas',
          'RegistroDeTitulosEDocumentos/Principal.pas',
        ],
      },
      'rtd-core-controles': {
        label: 'Núcleo global — Controles + Rotinas',
        priority: 'P0',
        execution_order: [
          'RegistroDeTitulosEDocumentos/geral/Controles.pas',
          'RegistroDeTitulosEDocumentos/geral/Rotinas.pas',
          'RegistroDeTitulosEDocumentos/LockupRTD.pas',
        ],
      },
      'rtd-livro-protocolo': {
        label: 'Livro e protocolo RTD',
        priority: 'P0',
        execution_order: [
          'RegistroDeTitulosEDocumentos/LivroProtocolo.pas',
          'RegistroDeTitulosEDocumentos/LivroAndamento.pas',
          'RegistroDeTitulosEDocumentos/ImpressaoProtocolo.pas',
        ],
      },
      'rtd-registro-documento': {
        label: 'Registro de documento (extragrande)',
        priority: 'P0',
        execution_order: ['RegistroDeTitulosEDocumentos/RegistroDocumento.pas'],
      },
      'rtd-documento': {
        label: 'Documento / entrada',
        priority: 'P0',
        execution_order: [
          'RegistroDeTitulosEDocumentos/Documento.pas',
          'RegistroDeTitulosEDocumentos/Pessoa.pas',
          'RegistroDeTitulosEDocumentos/Cadastro.pas',
        ],
      },
      'rtd-certidao': {
        label: 'Certidões RTD',
        priority: 'P1',
        execution_order: [
          'RegistroDeTitulosEDocumentos/Certidao.pas',
          'RegistroDeTitulosEDocumentos/CertidaoCadastro.pas',
          'RegistroDeTitulosEDocumentos/CertidaoImprimir.pas',
        ],
      },
      'rtd-averbacao': {
        label: 'Averbações',
        priority: 'P1',
        execution_order: ['RegistroDeTitulosEDocumentos/RegistroAverbacao.pas'],
      },
      'rtd-doi': {
        label: 'DOI',
        priority: 'P2',
        execution_order: [
          'RegistroDeTitulosEDocumentos/Doi.pas',
          'RegistroDeTitulosEDocumentos/Doi_Individual.pas',
        ],
      },
      'rtd-pagamentos-ws': {
        label: 'ONR / PIX / boleto (xref)',
        priority: 'P2',
        execution_order: [
          'RegistroDeTitulosEDocumentos/geral_sistemas/wsgeral/dmONR.pas',
          'RegistroDeTitulosEDocumentos/geral_sistemas/wsgeral/dmPix.pas',
          'RegistroDeTitulosEDocumentos/geral_sistemas/wsgeral/dmBoleto.pas',
        ],
        notes: 'xref Imóveis/Civil quando possível',
      },
      'rtd-dfm-core': {
        label: 'DFM core (após .pas)',
        priority: 'P2',
        execution_order: [
          'RegistroDeTitulosEDocumentos/Principal.dfm',
          'RegistroDeTitulosEDocumentos/RegistroDocumento.dfm',
          'RegistroDeTitulosEDocumentos/Documento.dfm',
        ],
      },
      'rtd-vendor': {
        label: 'Vendor',
        priority: 'P4',
        execution_order: ['RegistroDeTitulosEDocumentos/geral/frxClass.pas'],
        notes: 'T0 skip',
      },
    },
  },
  protesto: {
    product_path: 'TabelionatoDeProtesto',
    vault_hub: 'Orius/desenvolvimento/legado-delphi/produtos/protesto',
    prefix: 'pt',
    active_domain: 'pt-core-controles',
    mvp: [
      'TabelionatoDeProtesto/geral/Controles.pas',
      'TabelionatoDeProtesto/LockupProtesto.pas',
      'TabelionatoDeProtesto/Login.pas',
      'TabelionatoDeProtesto/Principal.pas',
      'TabelionatoDeProtesto/CadTitulo.pas',
      'TabelionatoDeProtesto/Protocolo.pas',
      'TabelionatoDeProtesto/Protestos.pas',
      'TabelionatoDeProtesto/ConfirmarTitulos.pas',
      'TabelionatoDeProtesto/CaixaServico.pas',
    ],
    domains: {
      'pt-shell': {
        label: 'Shell e login',
        priority: 'P0',
        execution_order: [
          'TabelionatoDeProtesto/Login.pas',
          'TabelionatoDeProtesto/geral/Splash.pas',
          'TabelionatoDeProtesto/geral/Config.pas',
          'TabelionatoDeProtesto/Principal.pas',
        ],
      },
      'pt-core-controles': {
        label: 'Controles + LockupProtesto',
        priority: 'P0',
        execution_order: [
          'TabelionatoDeProtesto/geral/Controles.pas',
          'TabelionatoDeProtesto/geral/Rotinas.pas',
          'TabelionatoDeProtesto/LockupProtesto.pas',
        ],
      },
      'pt-titulo': {
        label: 'Cadastro de título',
        priority: 'P0',
        execution_order: [
          'TabelionatoDeProtesto/CadTitulo.pas',
          'TabelionatoDeProtesto/Pessoa.pas',
          'TabelionatoDeProtesto/Cadastro.pas',
        ],
      },
      'pt-protocolo': {
        label: 'Protocolo protesto',
        priority: 'P0',
        execution_order: [
          'TabelionatoDeProtesto/Protocolo.pas',
          'TabelionatoDeProtesto/ConfirmarTitulos.pas',
        ],
      },
      'pt-protesto-lavrar': {
        label: 'Lavratura / protestos',
        priority: 'P0',
        execution_order: ['TabelionatoDeProtesto/Protestos.pas'],
      },
      'pt-intimacao': {
        label: 'Intimações',
        priority: 'P1',
        execution_order: [
          'TabelionatoDeProtesto/GerarIntimacoes.pas',
          'TabelionatoDeProtesto/IntimacoesAceitas.pas',
        ],
      },
      'pt-importacao-cra': {
        label: 'Importação títulos / CRA',
        priority: 'P1',
        execution_order: [
          'TabelionatoDeProtesto/ImportarTitulos.pas',
          'TabelionatoDeProtesto/DMImportacaoTitulo.pas',
          'TabelionatoDeProtesto/LayoutArquivoFebraban.pas',
        ],
      },
      'pt-cancelamento': {
        label: 'Cancelamentos',
        priority: 'P1',
        execution_order: [
          'TabelionatoDeProtesto/Cancelamentos.pas',
          'TabelionatoDeProtesto/dmCancelamento.pas',
        ],
      },
      'pt-serasa-cenprot': {
        label: 'SERASA e CENPROT',
        priority: 'P1',
        execution_order: ['TabelionatoDeProtesto/Serasa.pas'],
      },
      'pt-caixa-servico': {
        label: 'Caixa no protesto',
        priority: 'P1',
        execution_order: [
          'TabelionatoDeProtesto/CaixaServico.pas',
          'TabelionatoDeProtesto/ConfirmarPagamento.pas',
        ],
      },
      'pt-pagamentos-ws': {
        label: 'ONR / PIX (xref)',
        priority: 'P2',
        execution_order: [
          'TabelionatoDeProtesto/geral_sistemas/wsgeral/dmONR.pas',
          'TabelionatoDeProtesto/geral_sistemas/wsgeral/dmPix.pas',
        ],
      },
      'pt-dfm-core': {
        label: 'DFM core',
        priority: 'P2',
        execution_order: [
          'TabelionatoDeProtesto/Principal.dfm',
          'TabelionatoDeProtesto/CadTitulo.dfm',
          'TabelionatoDeProtesto/Protestos.dfm',
        ],
      },
      'pt-vendor': {
        label: 'Vendor',
        priority: 'P4',
        execution_order: ['TabelionatoDeProtesto/geral/frxClass.pas'],
      },
    },
  },
  caixa: {
    product_path: 'Caixa',
    vault_hub: 'Orius/desenvolvimento/legado-delphi/produtos/caixa',
    prefix: 'cx',
    active_domain: 'cx-core-controles',
    mvp: [
      'Caixa/geral/Controles.pas',
      'Caixa/Lookup_Caixa.pas',
      'Caixa/geral/Login.pas',
      'Caixa/Principal.pas',
      'Caixa/ControleCaixa.pas',
      'Caixa/CaixaSimplificado.pas',
      'Caixa/ReciboCaixa.pas',
      'Caixa/CaixaPagamentos.pas',
      'Caixa/ConfirmarPagamento.pas',
    ],
    domains: {
      'cx-shell': {
        label: 'Shell e login',
        priority: 'P0',
        execution_order: [
          'Caixa/geral/Login.pas',
          'Caixa/geral/Config.pas',
          'Caixa/Principal.pas',
        ],
      },
      'cx-core-controles': {
        label: 'Controles + Lookup_Caixa',
        priority: 'P0',
        execution_order: [
          'Caixa/geral/Controles.pas',
          'Caixa/geral/Rotinas.pas',
          'Caixa/Lookup_Caixa.pas',
        ],
      },
      'cx-controle-caixa': {
        label: 'Controle de caixa',
        priority: 'P0',
        execution_order: [
          'Caixa/ControleCaixa.pas',
          'Caixa/CaixaSimplificado.pas',
          'Caixa/TotalizarCaixa.pas',
        ],
      },
      'cx-recibo-pagamento': {
        label: 'Recibo e pagamentos',
        priority: 'P0',
        execution_order: [
          'Caixa/ReciboCaixa.pas',
          'Caixa/CaixaPagamentos.pas',
          'Caixa/ConfirmarPagamento.pas',
          'Caixa/AlterarFormaPagamento.pas',
        ],
      },
      'cx-livro-diario': {
        label: 'Livro diário auxiliar',
        priority: 'P1',
        execution_order: [
          'Caixa/LivroDiarioAuxiliarDF.pas',
          'Caixa/LivroDiarioAuxiliar.pas',
        ],
      },
      'cx-boleto-nfse': {
        label: 'Boleto e NFSe',
        priority: 'P1',
        execution_order: [
          'Caixa/geral/EmitirBoleto.pas',
          'Caixa/geral/EmissaoNFSe.pas',
          'Caixa/geral_sistemas/wsgeral/dmBoleto.pas',
        ],
      },
      'cx-estorno-cheque': {
        label: 'Estorno e cheque',
        priority: 'P1',
        execution_order: ['Caixa/Estorno.pas', 'Caixa/Cheque.pas'],
      },
      'cx-pagamentos-ws': {
        label: 'ONR / PIX (xref)',
        priority: 'P2',
        execution_order: [
          'Caixa/geral_sistemas/wsgeral/dmONR.pas',
          'Caixa/geral_sistemas/wsgeral/dmPix.pas',
        ],
      },
      'cx-transversal-produtos': {
        label: 'Uso por outros produtos',
        priority: 'P2',
        execution_order: ['Caixa/ReciboCaixa.pas'],
        notes: 'Referenciado por Civil, RTD, Protesto, Imóveis',
      },
      'cx-dfm-core': {
        label: 'DFM core',
        priority: 'P2',
        execution_order: [
          'Caixa/Principal.dfm',
          'Caixa/ControleCaixa.dfm',
          'Caixa/CaixaSimplificado.dfm',
        ],
      },
      'cx-vendor': {
        label: 'Vendor',
        priority: 'P4',
        execution_order: ['Caixa/geral/frxClass.pas'],
      },
    },
  },
};

function mkFileEntry() {
  return {
    index_status: 'pending',
    analyze_status: 'pending',
    symbols_total: 0,
    symbols_done: 0,
    manifest_vault: null,
    priority_symbols: [],
    vendor: false,
    duplicate: false,
  };
}

for (const [slug, cfg] of Object.entries(PRODUCTS)) {
  const domains = {};
  for (const [id, d] of Object.entries(cfg.domains)) {
    domains[id] = {
      domain_id: id,
      label: d.label,
      priority: d.priority,
      status: 'pending',
      execution_order: d.execution_order,
      files_total: d.execution_order.length,
      files_done: 0,
      current_file: d.execution_order[0] || null,
      active_file_batch_id: `${slug}-mvp-poc`,
      ...(d.notes ? { notes: d.notes } : {}),
    };
  }

  const eco = {
    product_slug: slug,
    product_path: cfg.product_path,
    code_root: 'C:\\Users\\kenio\\sistema-delphi',
    ecosystem_state_file: `scripts/delphi-${slug}-ecosystem-state.json`,
    vault_hub: cfg.vault_hub,
    inventario_vault: `${cfg.vault_hub}/inventario/inventario-fontes.json`,
    active_domain_id: cfg.active_domain,
    status: 'pending',
    started_at: null,
    completed_at: null,
    triage_rules: TRIAGE,
    domains,
    file_progress: {},
  };

  const ecoPath = path.join(ROOT, `delphi-${slug}-ecosystem-state.json`);
  fs.writeFileSync(ecoPath, JSON.stringify(eco, null, 2) + '\n');

  const batchPath = path.join(ROOT, `delphi-${slug}-batch-state.json`);
  let batchState = fs.existsSync(batchPath)
    ? JSON.parse(fs.readFileSync(batchPath, 'utf8'))
    : {
        product_slug: slug,
        code_root: 'C:\\Users\\kenio\\sistema-delphi',
        product_path: cfg.product_path,
        batch_state_file: `scripts/delphi-${slug}-batch-state.json`,
        active_batch_id: null,
        batches: {},
      };

  const files = {};
  for (const fp of cfg.mvp) files[fp] = mkFileEntry();

  batchState.active_batch_id = `${slug}-mvp-poc`;
  batchState.batches[`${slug}-mvp-poc`] = {
    batch_id: `${slug}-mvp-poc`,
    product_slug: slug,
    product_path: cfg.product_path,
    vault_hub: cfg.vault_hub,
    started_at: null,
    completed_at: null,
    execution_order: cfg.mvp,
    current_file: cfg.mvp[0],
    status: 'pending',
    files,
  };

  fs.writeFileSync(batchPath, JSON.stringify(batchState, null, 2) + '\n');
  console.log(`${slug}: ecosystem + ${cfg.mvp.length} mvp files`);
}
