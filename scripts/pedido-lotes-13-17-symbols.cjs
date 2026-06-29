/**
 * Símbolos Pedido.pas documentados via gen-pedido-lote13…17-notes.cjs (revisão full).
 * Fonte: scripts/gen-pedido-lote{13..17}-notes.cjs
 */
const FILE = 'RegistroDeImoveis/Pedido.pas';

/** @type {Record<number, { priority: string, symbols: string[] }>} */
const LOTS = {
  13: {
    priority: 'P1',
    symbols: [
      'fmeDoi_Reg1gridPesquisaPedidosDblClick',
      'fmeDoi_Reg1IncluirNovoAdquirente1Click',
      'fmeDoi_Reg1IncluirNovoAlienante1Click',
      'fmeDoi_Reg1IrparaaMatrcula1Click',
      'fmeEditorSimplesAndamentobtnSalvarPDFClick',
      'fmeEditorSimplesAndamentoDataatualextenso1Click',
      'fmeEditorSimplesAndamentoMa1Click',
      'fmeEditorSimplesAndamentoMinscula1Click',
      'fmeEditorSimplesAndamentomniDicionarioGramaticalClick',
      'fmeEditorSimplesAndamentomniFormatarPalavraClick',
      'fmeEditorSimplesAndamentomniImportarTextoExternoClick',
      'fmeEditorSimplesAndamentomniMaisZoomClick',
      'fmeEditorSimplesAndamentomniMarcacaoAutomaticaClick',
      'fmeEditorSimplesAndamentomniMarcacaoAvancaoClick',
      'fmeEditorSimplesAndamentomniMarcacaoDesfazerClick',
    ],
  },
  14: {
    priority: 'P0',
    symbols: [
      'fmeEditorSimplesAndamentomniMarcacaoExcluirClick',
      'fmeEditorSimplesAndamentomniMarcacaoManualClick',
      'fmeEditorSimplesAndamentomniMenosZoomClick',
      'fmeEditorSimplesAndamentomniRedefinirTamanhoClick',
      'fmeEditorSimplesAndamentomniRetirarProtecaoClick',
      'fmeEditorSimplesAndamentomniRetornarMarcacaoClick',
      'fmeEditorSimplesAndamentoPargrafo1Click',
      'actNovoProtocoloComOficioExecute',
      'actNovoProtocoloSemDevolucaoExecute',
      'actOnusDoProtocoloExecute',
      'actDataInicialExecute',
      'btnCancelarInformarDataClick',
      'btnConfirmarInformarDataClick',
      'btnConfirmarNovaDataAndamentoClick',
      'btnConfirmarTemplateClick',
    ],
  },
  15: {
    priority: 'P0',
    symbols: [
      'pgcTipoImagemChange',
      'PreencherDadosParaNota',
      'fmeImagem1TwainPROPostScan',
      'edtQtdeEtiquetaEditing',
      'DuplicarMatriculaClick',
      'edtPorcentagemDescontoEditing',
      'edtValorDescontoEditing',
      'fmeImagem1btnExcluirImagemClick',
      'fmeImagem1btnImagemClick',
      'fmeImagem1btnImportarClick',
      'fmeImagem1btnLembreteClick',
      'fmeImagem1btnSalvar2Click',
      'fmeImagem1btnSalvarClick',
      'fmeImagem1btnSalvarImagemClick',
      'fmeImagem1btnTrocarImagemClick',
    ],
  },
  16: {
    priority: 'P0',
    symbols: [
      'actCompensacaoNovoProtocolo100Execute',
      'actCompensacaoNovoProtocoloExecute',
      'btnAndamentoPadrao2Click',
      'edtProtocoloCodigoBarrasKeyDown',
      'edtProtocoloCodigoBarrasKeyPress',
      'btnConfirmarCodigoBarrasClick',
      'actAndamentoCodigoBarrasProtocoloExecute',
      'btnFecharCodigoBarrasClick',
      'btnConfirmarAgendarPrioridadeClick',
      'btnCalcularFolhaExcedenteClick',
      'btnCancelarAgendarPrioridadeClick',
      'actAgendarPrioridadeExecute',
      'JogarItempara11Click',
      'LanaresteAtoemTodosositensdestePedido1Click',
      'ChamarAndamentoCodigoBarras',
    ],
  },
  17: {
    priority: 'P0',
    symbols: [
      'ConsultarNotaNaSefaz',
      'cvHorizontalCustomDrawCell',
      'cxGridDBTableView4CustomDrawCell',
      'btnConfirmarNFClick',
      'btnCancelarNFClick',
      'actAndamentoCodigoBarrasExecute',
      'actAndamentoCodigoBarrasPedCertidaoExecute',
      'btnBuscaGOClick',
      'edtCPFApresentanteKeyDown',
      'edtCPFConjugeKeyPress',
      'edtCPFNFSEKeyDown',
      'edtCPFPessoaKeyPress',
      'edtCPFTransmitenteKeyDown',
      'edtDataPrevistaEditing',
      'edtDescricaoTemplateKeyDown',
    ],
  },
};

const P0_SYMBOLS = new Set([
  'btnConfirmarNFClick',
  'btnConfirmarTemplateClick',
  'PreencherDadosParaNota',
  'actCompensacaoNovoProtocolo100Execute',
  'actCompensacaoNovoProtocoloExecute',
  'btnConfirmarCodigoBarrasClick',
  'ChamarAndamentoCodigoBarras',
  'actNovoProtocoloComOficioExecute',
  'actNovoProtocoloSemDevolucaoExecute',
]);

function allSymbolsFlat() {
  const out = [];
  for (const lot of Object.keys(LOTS).sort((a, b) => Number(a) - Number(b))) {
    for (const name of LOTS[lot].symbols) {
      out.push({ lot: Number(lot), name, lotPriority: LOTS[lot].priority });
    }
  }
  return out;
}

function totalCount() {
  return allSymbolsFlat().length;
}

module.exports = {
  FILE,
  LOTS,
  P0_SYMBOLS,
  allSymbolsFlat,
  totalCount,
};
