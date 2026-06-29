#!/usr/bin/env node
/**
 * Gera notas vault mínimas lote 13 Pedido.pas — fix-pedido-validation completa gates.
 */
const fs = require('fs');
const path = require('path');
const { resolveVaultAbs } = require('./delphi-validate-lib.cjs');

const VAULT_BASE =
  'Orius/desenvolvimento/legado-delphi/produtos/imoveis/formularios/Pedido';

const SYMBOLS = [
  {
    name: 'fmeDoi_Reg1gridPesquisaPedidosDblClick',
    start: 6965,
    end: 6972,
    resumo:
      'Adapter `OnDblClick` da grid de pesquisa DOI no frame `fmeDoi_Reg1`: lazy-create de `TfrmDoi_Reg_Individual`, `vpOrigemChamada := PROTOCOLO` e delegação a `AlterarDadosdaDOI1Click` do frame.',
    chama: '`Application.CreateForm(TfrmDoi_Reg_Individual)`, `fmeDoi_Reg1.AlterarDadosdaDOI1Click`',
    chamado: '`gridPesquisaPedidos.OnDblClick` (`Pedido.dfm`, frame DOI)',
    sql: 'Sem SQL neste handler; persistência indireta em `R_DOI` via frame/modal Individual.',
    regras:
      '1. Origem `PROTOCOLO` direciona persistência para `frmPedido.fmeDoi_Reg1`.\n2. DblClick na grid de pedidos DOI abre edição individual da DOI selecionada.',
  },
  {
    name: 'fmeDoi_Reg1IncluirNovoAdquirente1Click',
    start: 6974,
    end: 6981,
    resumo:
      'Adapter menu incluir adquirente DOI: lazy-create `TfrmDoi_Reg_Envolvidos`, origem PROTOCOLO, delega `IncluirNovoAdquirente1Click` ao frame.',
    chama: '`Application.CreateForm(TfrmDoi_Reg_Envolvidos)`, `fmeDoi_Reg1.IncluirNovoAdquirente1Click`',
    chamado: '`IncluirNovoAdquirente1.OnClick` (menu frame DOI, `Pedido.dfm`)',
    sql: 'Sem SQL direto; inserts em `R_DOI_ADQUIRENTE` via modal Envolvidos.',
    regras: '1. Mesmo padrão adapter DOI com `vpOrigemChamada := PROTOCOLO`.',
  },
  {
    name: 'fmeDoi_Reg1IncluirNovoAlienante1Click',
    start: 6983,
    end: 6990,
    resumo:
      'Adapter menu incluir alienante/transmitente DOI: lazy-create Envolvidos, origem PROTOCOLO, delega `IncluirNovoAlienante1Click`.',
    chama: '`Application.CreateForm(TfrmDoi_Reg_Envolvidos)`, `fmeDoi_Reg1.IncluirNovoAlienante1Click`',
    chamado: '`IncluirNovoAlienante1.OnClick` (menu frame DOI)',
    sql: 'Sem SQL direto; inserts em `R_DOI_ALIENANTE` via modal Envolvidos.',
    regras: '1. Par simétrico de `fmeDoi_Reg1IncluirNovoAdquirente1Click`.',
  },
  {
    name: 'fmeDoi_Reg1IrparaaMatrcula1Click',
    start: 6992,
    end: 6999,
    resumo:
      'Adapter menu ir para matrícula: lazy-create `TfrmReal_Pessoal`, origem PROTOCOLO, delega navegação ao frame DOI.',
    chama: '`Application.CreateForm(TfrmReal_Pessoal)`, `fmeDoi_Reg1.IrparaaMatrcula1Click`',
    chamado: '`IrparaaMatrcula1.OnClick` (menu frame DOI)',
    sql: 'Sem SQL neste handler; navegação para form Real Pessoal com matrícula do contexto DOI.',
    regras: '1. Abre cadastro imobiliário a partir da aba DOI do pedido.',
  },
  {
    name: 'fmeEditorSimplesAndamentobtnSalvarPDFClick',
    start: 7001,
    end: 7006,
    resumo:
      'Thin wrapper: repassa clique em Salvar PDF do editor de andamento (`fmeEditorSimplesAndamento`) para o frame `TfmeEditorSimples`.',
    chama: '`fmeEditorSimplesAndamento.btnSalvarPDFClick`',
    chamado: '`btnSalvarPDF.OnClick` do frame editor andamento (`Pedido.dfm`)',
    sql: 'Sem SQL; exportação PDF via WPTools no frame compartilhado.',
    regras: '1. Texto persistido separadamente em `btnGravarTextoClick` → `R_ANDAMENTO.OBSERVACAO`.',
  },
  {
    name: 'fmeEditorSimplesAndamentoDataatualextenso1Click',
    start: 7008,
    end: 7013,
    resumo: 'Wrapper menu data por extenso no editor de andamento; delega ao frame `Dataatualextenso1Click`.',
    chama: '`fmeEditorSimplesAndamento.Dataatualextenso1Click`',
    chamado: 'Menu `Dataatualextenso1` do popup editor andamento',
    sql: 'Sem SQL; inserção de data formatada no documento WPTools.',
    regras: '1. Utilitário de formatação textual no OBSERVACAO do andamento.',
  },
  {
    name: 'fmeEditorSimplesAndamentoMa1Click',
    start: 7015,
    end: 7019,
    resumo: 'Wrapper menu MAÍUSCULAS: delega `Ma1Click` ao frame editor andamento.',
    chama: '`fmeEditorSimplesAndamento.Ma1Click`',
    chamado: 'Menu `Ma1` popup editor andamento',
    sql: 'Sem SQL; transformação de seleção/texto no WPTools.',
    regras: '1. Formatação local no editor; gravação via `btnGravarTextoClick`.',
  },
  {
    name: 'fmeEditorSimplesAndamentoMinscula1Click',
    start: 7021,
    end: 7025,
    resumo: 'Wrapper menu minúsculas: delega `Minscula1Click` ao frame editor andamento.',
    chama: '`fmeEditorSimplesAndamento.Minscula1Click`',
    chamado: 'Menu `Minscula1` popup editor andamento',
    sql: 'Sem SQL; transformação de texto no WPTools.',
    regras: '1. Par de `fmeEditorSimplesAndamentoMa1Click`.',
  },
  {
    name: 'fmeEditorSimplesAndamentomniDicionarioGramaticalClick',
    start: 7027,
    end: 7031,
    resumo:
      'Wrapper menu dicionário gramatical no form; **delega `actMarcacaoAutomaticaExecute`** (nome do handler no form difere do callee no frame — verificar binding DFM).',
    chama: '`fmeEditorSimplesAndamento.actMarcacaoAutomaticaExecute`',
    chamado: 'Menu `mniDicionarioGramatical` popup editor andamento',
    sql: 'Sem SQL; recurso de marcação/dicionário no frame editor.',
    regras:
      '1. Possível inconsistência de nomenclatura handler vs ação no frame.\n2. Sem efeito em banco até gravar texto.',
  },
  {
    name: 'fmeEditorSimplesAndamentomniFormatarPalavraClick',
    start: 7033,
    end: 7038,
    resumo: 'Wrapper formatar palavra: delega `mniFormatarPalavraClick` ao frame editor andamento.',
    chama: '`fmeEditorSimplesAndamento.mniFormatarPalavraClick`',
    chamado: 'Menu `mniFormatarPalavra` popup editor andamento',
    sql: 'Sem SQL; formatação WPTools.',
    regras: '1. Utilitário ortográfico/formatação no editor de andamento.',
  },
  {
    name: 'fmeEditorSimplesAndamentomniImportarTextoExternoClick',
    start: 7040,
    end: 7045,
    resumo: 'Wrapper importar texto externo: delega `mniImportarTextoExternoClick` ao frame.',
    chama: '`fmeEditorSimplesAndamento.mniImportarTextoExternoClick`',
    chamado: 'Menu `mniImportarTextoExterno` popup editor andamento',
    sql: 'Sem SQL; importação de arquivo/texto para `wptTexto`.',
    regras: '1. Habilita `btnGravarTexto` via `fmeEditorSimplesAndamentowptTextoChange`.',
  },
  {
    name: 'fmeEditorSimplesAndamentomniMaisZoomClick',
    start: 7047,
    end: 7051,
    resumo: 'Wrapper aumentar zoom do editor: delega `mniMaisZoomClick` ao frame.',
    chama: '`fmeEditorSimplesAndamento.mniMaisZoomClick`',
    chamado: 'Menu `mniMaisZoom` popup editor andamento',
    sql: 'Sem SQL; ajuste de zoom WPTools.',
    regras: '1. Apenas UI do viewer/editor.',
  },
  {
    name: 'fmeEditorSimplesAndamentomniMarcacaoAutomaticaClick',
    start: 7053,
    end: 7058,
    resumo:
      'Wrapper marcação automática: delega **`actMarcacaoManualExecute`** (handler form vs nome menu — verificar DFM).',
    chama: '`fmeEditorSimplesAndamento.actMarcacaoManualExecute`',
    chamado: 'Menu `mniMarcacaoAutomatica` popup editor andamento',
    sql: 'Sem SQL; marcação automática de campos no documento.',
    regras: '1. Nomenclatura cruzada automático/manual entre form e frame.',
  },
  {
    name: 'fmeEditorSimplesAndamentomniMarcacaoAvancaoClick',
    start: 7060,
    end: 7065,
    resumo: 'Wrapper marcação avançada: delega `mniMarcacaoAvancaoClick` ao frame editor.',
    chama: '`fmeEditorSimplesAndamento.mniMarcacaoAvancaoClick`',
    chamado: 'Menu `mniMarcacaoAvancao` popup editor andamento',
    sql: 'Sem SQL; marcação avançada WPTools.',
    regras: '1. Parte do submenu de marcação do editor de andamento.',
  },
  {
    name: 'fmeEditorSimplesAndamentomniMarcacaoDesfazerClick',
    start: 7067,
    end: 7072,
    resumo: 'Wrapper desfazer marcação: delega `mniMarcacaoDesfazerClick` ao frame editor.',
    chama: '`fmeEditorSimplesAndamento.mniMarcacaoDesfazerClick`',
    chamado: 'Menu `mniMarcacaoDesfazer` popup editor andamento',
    sql: 'Sem SQL; undo de marcação no documento.',
    regras: '1. Complementa fluxo de marcação automática/avançada.',
  },
];

function buildNote(sym) {
  const isDoi = sym.name.startsWith('fmeDoi_Reg1');
  const frame = isDoi ? 'fmeDoi_Reg1 (`TfmeDoi_Reg`)' : 'fmeEditorSimplesAndamento (`TfmeEditorSimples`)';
  return `---
tipo: legado-delphi
area: orius
produto: imoveis
artefato: pas
form: Pedido
unit: Pedido
simbolo: ${sym.name}
simbolo_tipo: evento
arquivo: RegistroDeImoveis/Pedido.pas
linhas: ${sym.start}-${sym.end}
tags: [delphi7, embarcadero, vcl, ri, pedido, ${isDoi ? 'doi' : 'andamento, wptools'}]
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
| Frame | ${frame} |
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
| \`Sender\` | \`TObject\` | in | Componente que disparou o evento (repasse ao frame) |

Retorno: \`procedure\` (sem valor).

## Efeitos colaterais

- Delegação integral ao frame embutido; sem datasets abertos neste handler.
- ${isDoi ? 'Modal auxiliar criado lazy (`CreateForm`) com `vpOrigemChamada := PROTOCOLO`.' : 'Alterações de UI/texto no WPTools; persistência via [[btnGravarTextoClick]].'}

## SQL e tabelas

${sym.sql}

## Chama

| Alvo | Observação |
|------|------------|
| ${sym.chama.split(', ').map((c) => c.trim()).join(' |\n| ')} |

## Chamado por

| Caller | Contexto |
|--------|----------|
| ${sym.chamado} | evento publicado no \`Pedido.dfm\` |

## Regras de negócio

${sym.regras}

## Evidência

Ver trecho L${sym.start}–${sym.end} em \`Pedido.pas\`.

## Briefing implementação

1. Depurar \`${sym.name}\` em \`Pedido.pas\` L${sym.start}–${sym.end}.
2. Cruzar binding no \`Pedido.dfm\` e implementação no frame (${isDoi ? 'FrameDoi_Reg.pas' : 'FrameEditorSimples.pas'}).
3. Revalidar com \`node scripts/validate-delphi-symbol.cjs --product-slug imoveis\`.
`;
}

for (const sym of SYMBOLS) {
  const rel = `${VAULT_BASE}/${sym.name}.md`;
  const abs = resolveVaultAbs(rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, buildNote(sym), 'utf8');
  console.log('wrote', rel);
}

console.log(`\n${SYMBOLS.length} notas geradas.`);
