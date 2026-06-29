#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { resolveVaultAbs } = require('./delphi-validate-lib.cjs');

const VAULT_BASE =
  'Orius/desenvolvimento/legado-delphi/produtos/imoveis/formularios/Pedido';

const SYMBOLS = [
  { name: 'fmeEditorSimplesAndamentomniMarcacaoExcluirClick', start: 7074, end: 7079, frame: 'mniMarcacaoExcluirClick', sql: 'Sem SQL; exclusão de marcação WPTools.' },
  { name: 'fmeEditorSimplesAndamentomniMarcacaoManualClick', start: 7081, end: 7086, frame: 'actDicionarioGramaticalExecute', sql: 'Sem SQL; dicionário gramatical (handler form vs menu — ver DFM).' },
  { name: 'fmeEditorSimplesAndamentomniMenosZoomClick', start: 7088, end: 7093, frame: 'mniMenosZoomClick', sql: 'Sem SQL; zoom WPTools.' },
  { name: 'fmeEditorSimplesAndamentomniRedefinirTamanhoClick', start: 7095, end: 7100, frame: 'mniRedefinirTamanhoClick', sql: 'Sem SQL; reset zoom editor.' },
  { name: 'fmeEditorSimplesAndamentomniRetirarProtecaoClick', start: 7102, end: 7107, frame: 'mniRetirarProtecaoClick', sql: 'Sem SQL; desprotege documento WPTools.' },
  { name: 'fmeEditorSimplesAndamentomniRetornarMarcacaoClick', start: 7109, end: 7114, frame: 'mniRetornarMarcacaoClick', sql: 'Sem SQL; retorna marcação anterior.' },
  { name: 'fmeEditorSimplesAndamentoPargrafo1Click', start: 7116, end: 7120, frame: 'Pargrafo1Click', sql: 'Sem SQL; formatação parágrafo WPTools.' },
  {
    name: 'actNovoProtocoloComOficioExecute', start: 7122, end: 7168, kind: 'action',
    resumo: 'Action menu Opções: confirma criação de novo protocolo tipo ofício (sem depósito, valor a receber depois). Seta `vExisteDevolucao=7`, clona pedido via `CriarNovoPedidoComBaseNoPedidoAtual`, prenotação tipo 1, modal confirmação `vpFC_TipoSolicitacao=OFICIO` com selos GO/TO/DF.',
    chama: '`MontarTotaisPedido`, `CriarNovoPedidoComBaseNoPedidoAtual`, `MontarFormConfirmacao`, `frmPedidoConfirmacao.ShowModal`',
    chamado: '`actNovoProtocoloComOficio` OnExecute (`Pedido.dfm`)',
    sql: '`R_PEDIDO`, `R_PROTOCOLO`, `R_CONTADOR` (indireto via clone/prenotação); `C_CAIXA_ITEM` pós-modal.',
    regras: '1. `vCreditoDebito=C`, `vpValorCompensado=0`. 2. Confirmação obrigatória MessageBox.',
  },
  {
    name: 'actNovoProtocoloSemDevolucaoExecute', start: 7170, end: 7216, kind: 'action',
    resumo: 'Action: novo protocolo sem devolução de emolumentos (`vExisteDevolucao=5`). Fluxo espelhado ao ofício com `vpFC_TipoSolicitacao=SEMDEVOLUCAO`.',
    chama: '`MontarTotaisPedido`, `CriarNovoPedidoComBaseNoPedidoAtual`, `MontarFormConfirmacao`, `ShowModal`',
    chamado: '`actNovoProtocoloSemDevolucao` OnExecute',
    sql: '`R_PEDIDO`, `R_PROTOCOLO` (clone/prenotação).',
    regras: '1. Sem devolução de emolumentos ao cartório. 2. Selos visíveis GO/TO/DF.',
  },
  {
    name: 'actOnusDoProtocoloExecute', start: 7218, end: 7226, kind: 'action',
    resumo: 'Abre `TfrmOnusPorProtocolo` listando ônus do pedido/protocolo corrente via `BuscarOnusdoProtocolo`.',
    chama: '`Application.CreateForm(TfrmOnusPorProtocolo)`, `BuscarOnusdoProtocolo`, `Show`',
    chamado: '`actOnusDoProtocolo` OnExecute',
    sql: 'Tabelas ônus consultadas em `OnusPorProtocolo.pas` (leitura por `PEDIDO_ID`).',
    regras: '1. Somente consulta/listagem; caption com número de ordem.',
  },
  {
    name: 'actDataInicialExecute', start: 7228, end: 7253, kind: 'action',
    resumo: 'Abre overlay `pgcIncluir` aba data cancelamento/devolução inicial. Valida permissão `AlterarDataIniCanceladoDevolucao`; pré-preenche de `G_CONFIG` via `BuscarConfig`.',
    chama: '`VerificarPermissao`, `BuscarConfig`, VCL `pgcIncluir`/tabs',
    chamado: '`actDataInicial` OnExecute',
    sql: '`G_CONFIG` chave `PEDIDO/GERAL/DATA_INI_CANCELADO_DEVOLUCAO` (leitura).',
    regras: '1. Permissão obrigatória. 2. Gravação em [[btnConfirmarInformarDataClick]].',
  },
  {
    name: 'btnCancelarInformarDataClick', start: 7257, end: 7260, kind: 'btn',
    resumo: 'Fecha overlay de data inicial sem gravar (`pgcIncluir.Visible := False`).',
    chama: 'VCL `pgcIncluir`',
    chamado: '`btnCancelarInformarData` OnClick',
    sql: 'Sem SQL.',
    regras: '1. Cancelamento sem alterar `G_CONFIG`.',
  },
  {
    name: 'btnConfirmarInformarDataClick', start: 7262, end: 7295, kind: 'btn',
    resumo: 'Persiste data inicial cancelamento/devolução em `G_CONFIG` via `G_BUSCAR_CONFIG` + UPDATE.',
    chama: '`dtmControles.sqlAuxiliar` SELECT/UPDATE, `ExecSql`',
    chamado: '`btnConfirmarInformarData` OnClick; fluxo [[actDataInicialExecute]]',
    sql: '`G_CONFIG` (`CONFIG_ID`, `VALOR`); função `G_BUSCAR_CONFIG`.',
    regras: '1. Data obrigatória. 2. Cursor wait durante UPDATE.',
  },
  {
    name: 'btnConfirmarNovaDataAndamentoClick', start: 7297, end: 7315, kind: 'btn',
    resumo: 'UPDATE `R_ANDAMENTO.DATA` do andamento focado; refresh dataset e `AfterScrollAndamento`.',
    chama: '`sqlAuxiliar.ExecSql`, `sqlAndamento.Refresh`, `AfterScrollAndamento`',
    chamado: '`btnConfirmarNovaDataAndamento` OnClick; aberto por [[AlterarDatadoAndamento1Click]]',
    sql: '`R_ANDAMENTO` UPDATE `DATA` WHERE `ANDAMENTO_ID`.',
    regras: '1. Formato data `YYYY/MM/DD hh:mm:ss`. 2. Desabilita AfterScroll durante update.',
  },
  {
    name: 'btnConfirmarTemplateClick', start: 7317, end: 7418, kind: 'btn',
    resumo: 'Confirma inclusão por template: copia protocolo/exame/certidão (`DuplicarPedido`) ou template selecionado; pesquisa pedido pendente; UPDATE `DATA_PREVISTA`; recalcula itens via `btnGravarItemClick`.',
    chama: '`DuplicarPedido`, `CalculaDataPrevista_MP1805`, `btnPesquisaRapidaClick`, `btnGravarItemClick`, transação `dtmControles`',
    chamado: '`btnConfirmarTemplate` OnClick; fluxo [[btnConfirmarIncluirClick]] template',
    sql: '`R_PROTOCOLO` SELECT; `R_PEDIDO` UPDATE `DATA_PREVISTA`; `R_PEDIDO_TEMPLATE` leitura.',
    regras: '1. Valida existência protocolo copiado. 2. Modo pendente `@id` até gravar.',
  },
];

function editorNote(sym) {
  const fn = sym.name.replace('fmeEditorSimplesAndamento', '');
  return buildNote({
    ...sym,
    resumo: `Wrapper editor andamento: delega \`${sym.frame}\` ao frame \`fmeEditorSimplesAndamento\`.`,
    chama: `\`fmeEditorSimplesAndamento.${sym.frame}\``,
    chamado: `Menu/popup editor andamento (\`${fn}\`)`,
    regras: '1. Thin adapter form→frame. 2. Persistência texto via [[btnGravarTextoClick]].',
  });
}

function buildNote(sym) {
  const isEditor = sym.name.startsWith('fmeEditorSimplesAndamento');
  return `---
tipo: legado-delphi
area: orius
produto: imoveis
artefato: pas
form: Pedido
unit: Pedido
simbolo: ${sym.name}
simbolo_tipo: ${sym.kind === 'action' ? 'action' : 'evento'}
arquivo: RegistroDeImoveis/Pedido.pas
linhas: ${sym.start}-${sym.end}
tags: [delphi7, embarcadero, vcl, ri, pedido${isEditor ? ', andamento, wptools' : sym.kind === 'action' ? ', protocolo, opcoes' : ''}]
status: revisado
fonte: agent-delphi-analyzer
atualizado: 2026-06-15
batch_id: imoveis-dmPedido-poc
---

# \`TfrmPedido.${sym.name}\`

## Localização

| Campo | Valor |
|-------|-------|
| Arquivo | \`RegistroDeImoveis/Pedido.pas\` |
| Linhas | ${sym.start}–${sym.end} |
| Classe | \`TfrmPedido\` |
| Índice form | [[Orius/desenvolvimento/legado-delphi/produtos/imoveis/formularios/Pedido]] |

## Assinatura

\`\`\`pascal
procedure TfrmPedido.${sym.name}(Sender: TObject);
\`\`\`

## Resumo

${sym.resumo}

## Parâmetros e retorno

| Nome | Tipo | Direção | Significado |
|------|------|---------|-------------|
| \`Sender\` | \`TObject\` | in | Componente/action que disparou o evento |

Retorno: \`procedure\` (sem valor).

## Efeitos colaterais

Ver resumo e callees; efeitos de banco documentados em SQL.

## SQL e tabelas

${sym.sql}

## Chama

| Alvo | Observação |
|------|------------|
| ${sym.chama} |

## Chamado por

| Caller | Contexto |
|--------|----------|
| ${sym.chamado} |

## Regras de negócio

${sym.regras}

## Evidência

Ver trecho L${sym.start}–${sym.end} em \`Pedido.pas\`.

## Briefing implementação

1. Depurar \`${sym.name}\` L${sym.start}–${sym.end}.
2. Cruzar DFM e callees grep no repositório.
3. Revalidar com \`node scripts/validate-delphi-symbol.cjs --product-slug imoveis\`.
`;
}

for (const sym of SYMBOLS) {
  const content = sym.frame ? editorNote(sym) : buildNote(sym);
  const rel = `${VAULT_BASE}/${sym.name}.md`;
  fs.writeFileSync(resolveVaultAbs(rel), content, 'utf8');
  console.log('wrote', sym.name);
}

console.log(`\n${SYMBOLS.length} notas.`);
