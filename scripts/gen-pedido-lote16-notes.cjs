#!/usr/bin/env node
const fs = require('fs');
const { resolveVaultAbs } = require('./delphi-validate-lib.cjs');
const V = 'Orius/desenvolvimento/legado-delphi/produtos/imoveis/formularios/Pedido';

const S = [
  ['actCompensacaoNovoProtocolo100Execute',7613,7672,'Action compensação 100%: valida protocolo OK, clone pedido, `vExisteDevolucao=1`, `vpValorCompensado=vpTotalJaRecebido`, modal COMPENSACAO100, confirma prenotação direto.','`VerificarSeProtocoloEstaOk`, `CriarNovoPedidoComBaseNoPedidoAtual`, `MontarFormConfirmacao`, `btnConfirmarPrenotacaoClick`','actCompensacaoNovoProtocolo100 OnExecute','R_PEDIDO, R_PROTOCOLO, C_CAIXA_ITEM (indireto)','1. Natureza/tabela incompletas bloqueiam. 2. Compensa 100% emolumentos já recebidos.'],
  ['actCompensacaoNovoProtocoloExecute',7674,7733,'Action compensação 75%: espelho do 100% com `vpFC_TipoSolicitacao=COMPENSACAO75` e valor compensado de `vpValorCompensado`.','Mesmo fluxo compensação','actCompensacaoNovoProtocolo OnExecute','R_PEDIDO, R_PROTOCOLO','1. Mensagem confirma 75% emolumentos.'],
  ['btnAndamentoPadrao2Click',7735,7741,'Botão andamento padrão 2: `NovoAndamento` com `vgUsuarioAndamentoPadrao2` e opcional destino serviço.','`dtmPedido.NovoAndamento`, `lcxUsuarioDestino`','btnAndamentoPadrao2 OnClick','R_ANDAMENTO (via NovoAndamento)','1. Distribuição serviço quando `vpUsarDistribuicaoServico=S`.'],
  ['edtProtocoloCodigoBarrasKeyDown',7743,7749,'Enter no campo código barras dispara confirmação.','`btnConfirmarCodigoBarrasClick`','edtProtocoloCodigoBarras OnKeyDown','Sem SQL','1. Só VK_RETURN (13).'],
  ['edtProtocoloCodigoBarrasKeyPress',7751,7758,'Filtra apenas dígitos e backspace no código barras.','MessageBeep, Key:=#0','OnKeyPress código barras','Sem SQL','1. Bloqueia caracteres não numéricos.'],
  ['btnConfirmarCodigoBarrasClick',7760,7834,'Decodifica prefixo 01-04 (tipo protocolo), pesquisa rápida, lança andamento via `NovoAndamento` se pedido encontrado.','`btnPesquisaRapidaClick`, `NovoAndamento`, parsers Copy prefixo','btnConfirmarCodigoBarras OnClick','R_ANDAMENTO via NovoAndamento; R_PROTOCOLO pesquisa','1. Prefixos: 01=protocolo,02=exame,03=certidão,04=cert.especial.'],
  ['actAndamentoCodigoBarrasProtocoloExecute',7836,7844,'Action abre fluxo código barras tipo protocolo (1) com andamento padrão pré-selecionado.','`ChamarAndamentoCodigoBarras`, combos andamento','actAndamentoCodigoBarrasProtocolo','Sem SQL direto','1. Delega UI para [[ChamarAndamentoCodigoBarras]].'],
  ['btnFecharCodigoBarrasClick',7846,7851,'Fecha overlay código barras limpando campos.','VCL pgcIncluir, clears','btnFecharCodigoBarras','Sem SQL','1. Cancelamento sem andamento.'],
  ['btnConfirmarAgendarPrioridadeClick',7853,7893,'Grava ou remove prioridade: UPDATE R_PEDIDO DATA_PRIORIDADE ou ApplyUpdates dataset.','sqlAuxiliar UPDATE ou sqlPedido.ApplyUpdates','btnConfirmarAgendarPrioridade','R_PEDIDO DATA_PRIORIDADE, USUARIO_PRIORIDADE_ID','1. Data obrigatória salvo retirar prioridade.'],
  ['btnCalcularFolhaExcedenteClick',7895,7957,'Calcula folhas excedentes a partir TIFF registro (XpressCalculo páginas), grava QUANTIDADE_FOLHA_EXCEDENTE.','sqlAuxiliar R_CARTORIO, BuscarConfig, XpressCalculo, sqlPedidoItem','btnCalcularFolhaExcedente','R_CARTORIO, R_PEDIDO_ITEM; G_CONFIG IMAGEM','1. Fórmula: páginas arredondadas p/ par, /2 -1.'],
  ['btnCancelarAgendarPrioridadeClick',7959,7962,'Fecha overlay prioridade sem gravar.','pgcIncluir.Visible:=False','btnCancelarAgendarPrioridade','Sem SQL','1. Cancelamento.'],
  ['actAgendarPrioridadeExecute',7964,7999,'Abre overlay agendar prioridade; valida permissão; pré-preenche se já agendado.','VerificarPermissao, VCL tabs','actAgendarPrioridade','R_PEDIDO leitura prioridade existente','1. Permissão AgendarPrioridade obrigatória.'],
  ['JogarItempara11Click',8001,8019,'Reordena item pedido via função `R_GERAR_SEQUENCIA_PEDIDO_ITEM` em transação.','StartTransaction, sqlAuxiliar SELECT função, Refresh','JogarItempara11 menu popup item','R_PEDIDO_ITEM (stored function)','1. Move item para posição 1.'],
  ['LanaresteAtoemTodosositensdestePedido1Click',8021,8062,'Propaga ATO_TIPO/ATO_NUMERO do item focado para todos itens do pedido (UPDATE em lote).','sqlAuxiliar UPDATE R_PEDIDO_ITEM_NUMERO','Menu popup item pedido','R_PEDIDO_ITEM_NUMERO, R_PEDIDO_ITEM','1. Valida ato preenchido; confirmação MessageBox.'],
  ['ChamarAndamentoCodigoBarras',8064,8085,'Helper UI: configura overlay `tbsAndamentoCodigoBarras`, foco no edit código barras.','VCL pgcIncluir/tabs','Chamado por actions código barras','Sem SQL','1. Não lança andamento — só abre painel.'],
];

function mk([n,s,e,r,ch,ca,sq,rg]) {
  return `---
tipo: legado-delphi
area: orius
produto: imoveis
artefato: pas
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
| Classe | \`TfrmPedido\` |

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

Ver L${s}–${e} em \`Pedido.pas\`.

## Briefing implementação

1. Depurar \`${n}\` L${s}–${e}.
2. Cruzar DFM e dmPedido callees.
3. Revalidar validate-delphi-symbol.
`;
}

for (const row of S) {
  const rel = `${V}/${row[0]}.md`;
  fs.writeFileSync(resolveVaultAbs(rel), mk(row), 'utf8');
  console.log(row[0]);
}
