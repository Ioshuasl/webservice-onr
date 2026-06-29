#!/usr/bin/env node
const fs = require('fs');
const { resolveVaultAbs } = require('./delphi-validate-lib.cjs');
const VAULT = 'Orius/desenvolvimento/legado-delphi/produtos/imoveis/formularios/Pedido';

const SYMBOLS = [
  { n: 'pgcTipoImagemChange', s: 7421, e: 7434, r: 'Troca aba GED (título/exigência/recibos/plantas): `BuscarImagem` com tipo T/X/R/P; ajusta preview no frame.', ch: '`dtmPedido.BuscarImagem`, `fmeImagem1.AtivarNotate`, preview buttons', ca: 'Tab GED `pgcTipoImagem.OnChange`', sq: 'Imagens protocolo via dmPedido (paths GED); sem SQL direto.', rg: '1. Tipo T=título, X=exigência, R=recibos, P=plantas.' },
  { n: 'PreencherDadosParaNota', s: 7436, e: 7466, r: 'Copia variáveis vp* NFSe para campos `sqlPedido` se `SubstituirDados` ou CPF NFSe vazio.', ch: 'Atribuições `sqlPedido*NFSE`', ca: 'Chamado por fluxos emissão NFS-e (ex. [[btnGravarClick]])', sq: '`R_PEDIDO` campos NFSe (buffer dataset, ApplyUpdates em caller).', rg: '1. Só preenche campos vazios quando SubstituirDados=False.' },
  { n: 'fmeImagem1TwainPROPostScan', s: 7468, e: 7502, r: 'Pós-scan Twain: desabilita gravação auto, exibe `pnlSalvarDigitalizacao`, delega frame; bloco andamento exigência comentado.', ch: '`fmeImagem1.TwainPROPostScan`, toggles `vgGravarAutomaticamente`', ca: 'Evento Twain do frame `fmeImagem1`', sq: 'Sem SQL ativo (bloco R_ANDAMENTO comentado L7477-7501).', rg: '1. Usuário deve confirmar salvar via painel digitalização.' },
  { n: 'edtQtdeEtiquetaEditing', s: 7504, e: 7508, r: 'OnEditing etiqueta: atualiza estado botões item via `AtualizarBotoesPedidoItem(A)`.', ch: '`dtmPedido.AtualizarBotoesPedidoItem`', ca: '`edtQtdeEtiqueta.OnEditing`', sq: 'Sem SQL.', rg: '1. UI only durante edição quantidade etiquetas.' },
  { n: 'DuplicarMatriculaClick', s: 7510, e: 7542, r: 'Abre overlay duplicar item modo matrícula (`vDuplicarItemMatricula=M`): configura aba `tbsDuplicarItem`, quantidade 1, rdbQuantidade.', ch: 'VCL `pgcIncluir`, flags duplicação', ca: 'Menu/contexto duplicar matrícula', sq: 'Sem SQL; inserts em [[btnConfirmarDuplicarClick]].', rg: '1. Requer item ativo em `sqlPedidoItem`.' },
  { n: 'edtPorcentagemDescontoEditing', s: 7544, e: 7552, r: 'Entrada em % desconto: força Edit no item e zera `VALOR_DESCONTO`.', ch: '`sqlPedidoItem.Edit`, zera VALOR_DESCONTO', ca: '`edtPorcentagemDesconto.OnEditing`', sq: '`R_PEDIDO_ITEM` campos desconto (buffer).', rg: '1. Exclusão mútua % vs valor fixo.' },
  { n: 'edtValorDescontoEditing', s: 7554, e: 7562, r: 'Entrada valor desconto: Edit no item e zera `PORCENTAGEM_DESCONTO`.', ch: '`sqlPedidoItem.Edit`, zera PORCENTAGEM_DESCONTO', ca: '`edtValorDesconto.OnEditing`', sq: '`R_PEDIDO_ITEM` campos desconto.', rg: '1. Par de [[edtPorcentagemDescontoEditing]].' },
  { n: 'fmeImagem1btnExcluirImagemClick', s: 7564, e: 7568, r: 'Posiciona popup `popupExcluir` sob botão excluir imagem do frame GED.', ch: '`popupExcluir.Popup`', ca: '`btnExcluirImagem` frame fmeImagem1', sq: 'Sem SQL; exclusão via itens popup.', rg: '1. UX escolha excluir página vs arquivo inteiro.' },
  { n: 'fmeImagem1btnImagemClick', s: 7570, e: 7573, r: 'Wrapper digitalização: delega `btnImagemClick` ao frame.', ch: '`fmeImagem1.btnImagemClick`', ca: 'Botão imagem frame GED', sq: 'Sem SQL direto.', rg: '1. Abre scanner/import imagem.' },
  { n: 'fmeImagem1btnImportarClick', s: 7575, e: 7580, r: 'Importar arquivo imagem + salvar + refresh aba via `pagDadosChange`.', ch: '`btnImportarClick`, `btnSalvarImagemClick`, `pagDadosChange`', ca: 'Botão importar frame GED', sq: 'GED persistência via frame GravarImagem.', rg: '1. Salva automaticamente após import.' },
  { n: 'fmeImagem1btnLembreteClick', s: 7582, e: 7586, r: 'Lembrete anotação imagem: valida `ESP_DIGITALIZACAO` e delega frame.', ch: '`VerificarPermissao`, `fmeImagem1.btnLembreteClick`', ca: 'Botão lembrete frame GED', sq: 'Sem SQL neste handler.', rg: '1. Permissão digitalização obrigatória.' },
  { n: 'fmeImagem1btnSalvar2Click', s: 7588, e: 7593, r: 'Salvar digitalização pós-scan: delega salvar imagem e oculta painel/botão salvar.', ch: '`btnSalvarImagemClick`, UI `pnlSalvarDigitalizacao`', ca: 'Botão salvar2 painel digitalização', sq: 'GED via frame.', rg: '1. Par de fluxo Twain PostScan.' },
  { n: 'fmeImagem1btnSalvarClick', s: 7595, e: 7598, r: 'Wrapper salvar imagem GED: delega `btnSalvarClick` frame.', ch: '`fmeImagem1.btnSalvarClick`', ca: 'Botão salvar frame GED', sq: 'GED persistência indireta.', rg: '1. Thin adapter.' },
  { n: 'fmeImagem1btnSalvarImagemClick', s: 7600, e: 7605, r: 'Salvar imagem e ocultar painel digitalização (igual btnSalvar2 sem nome alternativo).', ch: '`btnSalvarImagemClick`, oculta painel', ca: 'Botão salvar imagem frame', sq: 'GED via frame.', rg: '1. Finaliza fluxo digitalização pendente.' },
  { n: 'fmeImagem1btnTrocarImagemClick', s: 7607, e: 7611, r: 'Wrapper trocar imagem: delega `btnTrocarImagemClick` ao frame GED.', ch: '`fmeImagem1.btnTrocarImagemClick`', ca: 'Botão trocar imagem frame', sq: 'Sem SQL direto.', rg: '1. Substitui TIFF página/arquivo conforme frame.' },
];

function note(sym) {
  const img = sym.n.startsWith('fmeImagem1');
  return `---
tipo: legado-delphi
area: orius
produto: imoveis
artefato: pas
form: Pedido
simbolo: ${sym.n}
simbolo_tipo: ${sym.n.includes('Editing') || sym.n.includes('Change') || sym.n.includes('PostScan') ? 'evento' : sym.n.startsWith('Preencher') ? 'procedure' : 'evento'}
arquivo: RegistroDeImoveis/Pedido.pas
linhas: ${sym.s}-${sym.e}
tags: [delphi7, embarcadero, vcl, ri, pedido${img ? ', ged, imagem' : sym.n.includes('Nota') || sym.n.includes('Desconto') ? ', nfse, item' : ''}]
status: revisado
fonte: agent-delphi-analyzer
batch_id: imoveis-dmPedido-poc
---

# \`TfrmPedido.${sym.n}\`

## Localização

| Campo | Valor |
|-------|-------|
| Arquivo | \`RegistroDeImoveis/Pedido.pas\` |
| Linhas | ${sym.s}–${sym.e} |
| Classe | \`TfrmPedido\` |
| Índice | [[Orius/desenvolvimento/legado-delphi/produtos/imoveis/formularios/Pedido]] |

## Assinatura

\`\`\`pascal
procedure TfrmPedido.${sym.n}(${sym.n.includes('Preencher') ? 'SubstituirDados: boolean' : sym.n.includes('PostScan') ? 'ASender: TObject; var Cancel: WordBool' : sym.n.includes('Editing') ? 'Sender: TObject; var CanEdit: Boolean' : 'Sender: TObject'});
\`\`\`

## Resumo

${sym.r}

## SQL e tabelas

${sym.sq}

## Chama

| Alvo | Observação |
|------|------------|
| ${sym.ch} |

## Chamado por

| Caller | Contexto |
|--------|----------|
| ${sym.ca} |

## Regras de negócio

${sym.rg}

## Evidência

Ver L${sym.s}–${sym.e} em \`Pedido.pas\`.

## Briefing implementação

1. Depurar \`${sym.n}\` L${sym.s}–${sym.e}.
2. Cruzar DFM e frame \`${img ? 'FrameImagem.pas' : 'dmPedido.pas'}\`.
3. Revalidar com validate-delphi-symbol.
`;
}

for (const sym of SYMBOLS) {
  const rel = `${VAULT}/${sym.n}.md`;
  fs.writeFileSync(resolveVaultAbs(rel), note(sym), 'utf8');
  console.log(sym.n);
}
