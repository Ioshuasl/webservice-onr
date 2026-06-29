#!/usr/bin/env node
const fs = require('fs');
const { resolveVaultAbs } = require('./delphi-validate-lib.cjs');
const V = 'Orius/desenvolvimento/legado-delphi/produtos/imoveis/formularios/Pedido';

const S = [
  ['ConsultarNotaNaSefaz',8087,8100,'Helper: monta link NFSe via `PegarLinkNota` e abre navegador ShellExecute; erro se nota não gerada.','`dtmPedido.PegarLinkNota`, `ShellExecute`','[[lblNFClick]], [[VisualizarNota1Click]]','C_NFSE (leitura link)','1. Só UF com URL montada (DF).'],
  ['cvHorizontalCustomDrawCell',8102,8121,'CustomDraw grid horizontal andamentos: cor vermelha cancelado (C), azul registrado (R), navy demais (Values[6]=TIPO).','DevExpress ACanvas.Font','cvHorizontal OnCustomDrawCell','R_TB_TIPO_ANDAMENTO.TIPO coluna oculta','1. Espelho visual de [[gridAndamentosCustomDrawCell]].'],
  ['cxGridDBTableView4CustomDrawCell',8123,8132,'CustomDraw grid NF: negrito vermelho se status Cancelada (Values[0]).','ACanvas.Font','cxGridDBTableView4 OnCustomDrawCell','sqlNotasDoProtocolo (exibição)','1. UI only.'],
  ['btnConfirmarNFClick',8134,8306,'Emissão NFSe: valida valor, GO bloqueia RPS duplicado, `SolicitarNota` com ISS DF, polling C_NFSE, impressão DANFE, atualiza lblNF.','`dtmPedido.SolicitarNota`, sqlAuxiliar C_NFSE SELECT, `ImprimirDanfeDF`, `MostrarNotasDoProtocolo`','btnConfirmarNF OnClick overlay emitir nota','C_NFSE INSERT/UPDATE via SolicitarNota; R_PEDIDO calc','1. Valor>0.01. 2. ISS DF LC 1009/2022. 3. Polling 60s se imprimir cupom.'],
  ['btnCancelarNFClick',8309,8322,'Fecha overlay NF sem emitir; refresh andamento (DELETE comentado).','pgcIncluir.Visible, sqlAndamento.Refresh','btnCancelarNF','Sem SQL ativo','1. Não cancela NF já emitida.'],
  ['actAndamentoCodigoBarrasExecute',8324,8333,'Action código barras genérico: tipo pesquisa vazio, andamento padrão, chama overlay.','`ChamarAndamentoCodigoBarras`','actAndamentoCodigoBarras','Sem SQL','1. Tipo protocolo não fixo.'],
  ['actAndamentoCodigoBarrasPedCertidaoExecute',8335,8344,'Action código barras ped. certidão (tipo 3) com andamento padrão 2.','`ChamarAndamentoCodigoBarras`, icx tipo 3','actAndamentoCodigoBarrasPedCertidao','Sem SQL','1. Par de action protocolo.'],
  ['btnBuscaGOClick',8346,8353,'Abre pesquisa imóveis GO (`TfrmReal_Pessoal_Pesquisa`) origem Pedido.','CreateForm Real_Pessoal_Pesquisa, Show','btnBuscaGO','Sem SQL direto','1. vpOrigemBusca=2.'],
  ['edtCPFApresentanteKeyDown',8355,8361,'Enter dispara pesquisa CPF/CNPJ apresentante.','btnPesquisarCPF_CNPJApresentanteClick','edtCPFApresentante OnKeyDown','Sem SQL','1. VK_RETURN only.'],
  ['edtCPFConjugeKeyPress',8363,8370,'Filtra dígitos CPF cônjuge.','Key filter, MessageBeep','edtCPFConjuge OnKeyPress','Sem SQL','1. Só 0-9 e backspace.'],
  ['edtCPFNFSEKeyDown',8372,8378,'Enter pesquisa CNPJ NFSe / Receita.','btnPesquisarCPF_CNPJ_NFClick','edtCPFNFSE OnKeyDown','Sem SQL','1. Dispara consulta Receita.'],
  ['edtCPFPessoaKeyPress',8380,8387,'Filtra dígitos CPF pessoa.','Key filter','edtCPFPessoa OnKeyPress','Sem SQL','1. Numérico only.'],
  ['edtCPFTransmitenteKeyDown',8389,8395,'Enter pesquisa CPF transmitente.','btnPesquisarCPF_CNPJTransmitenteClick','edtCPFTransmitente OnKeyDown','Sem SQL','1. VK_RETURN.'],
  ['edtDataPrevistaEditing',8397,8401,'OnEditing data prevista habilita btnGravarItem.','btnGravarItem.Enabled:=True','edtDataPrevista OnEditing','R_PEDIDO DATA_PREVISTA buffer','1. Sinaliza alteração pendente item.'],
  ['edtDescricaoTemplateKeyDown',8403,8407,'KeyDown filtra templates pedido via PesquisarTemplate.','dtmPedido.PesquisarTemplate','edtDescricaoTemplate OnKeyDown','R_PEDIDO_TEMPLATE SELECT','1. Busca incremental por descrição.'],
];

function mk([n,s,e,r,ch,ca,sq,rg]) {
  const isProc = !n.includes('Click') && !n.includes('Key') && !n.includes('Editing') && !n.includes('CustomDraw');
  return `---
tipo: legado-delphi
produto: imoveis
form: Pedido
simbolo: ${n}
arquivo: RegistroDeImoveis/Pedido.pas
linhas: ${s}-${e}
status: revisado
batch_id: imoveis-dmPedido-poc
---

# \`TfrmPedido.${n}\`

## Localização

| Campo | Valor |
|-------|-------|
| Arquivo | \`RegistroDeImoveis/Pedido.pas\` |
| Linhas | ${s}–${e} |

## Resumo

${r}

## SQL e tabelas

${sq}

## Chama

| Alvo | Observação |
|------|------------|
| ${ch} |

## Chamado por

| Caller | Contexto |
|--------|----------|
| ${ca} |

## Regras de negócio

${rg}

## Evidência

Ver L${s}–${e}.

## Briefing implementação

1. Depurar \`${n}\` L${s}–${e}.
2. Revalidar validate-delphi-symbol.
`;
}

for (const row of S) {
  fs.writeFileSync(resolveVaultAbs(`${V}/${row[0]}.md`), mk(row), 'utf8');
  console.log(row[0]);
}
