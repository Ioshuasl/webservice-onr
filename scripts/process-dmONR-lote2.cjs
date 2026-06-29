#!/usr/bin/env node
/** Lote 2 dmONR.pas — 15 símbolos (chat, CNM, BDLight, e-Protocolo, NFSe, SOAP). */
const fs = require('fs');
const path = require('path');
const { validateVaultNote, resolveVaultAbs } = require('./delphi-validate-lib.cjs');
const { loadBatchState } = require('./delphi-triage-lib.cjs');
const { CODE_ROOT } = require('./delphi-batch-paths.cjs');

const PAS = 'RegistroDeImoveis/geral_sistemas/wsgeral/dmONR.pas';
const VAULT = 'Orius/desenvolvimento/legado-delphi/produtos/imoveis/unidades/dmONR';
const UNIT = 'dmONR';
const CLASS = 'TdtmONR';

function readSrc(lineStart, lineEnd, max = 25) {
  const lines = fs.readFileSync(path.join(CODE_ROOT, PAS), 'latin1').split(/\r?\n/);
  const total = lineEnd - lineStart + 1;
  const excerpt = lines.slice(lineStart - 1, lineStart - 1 + Math.min(max, total)).join('\n');
  const omit = max < total ? `\n// ... (ver L${lineStart}–${lineEnd})` : '';
  return [`Fonte: \`${PAS}\` L${lineStart}–${lineEnd}.`, '', '```pascal', excerpt + omit, '```'].join('\n');
}

function buildNote(name, meta, sym) {
  const ls = sym.line_start;
  const le = sym.line_end;
  return `---
tipo: legado-delphi
produto: imoveis
unit: ${UNIT}
simbolo: ${name}
arquivo: ${PAS}
linhas: ${ls}-${le}
status: revisado
---

# \`${CLASS}.${name}\`

## Localização

| Campo | Valor |
|-------|-------|
| Arquivo | \`${PAS}\` |
| Linhas | ${ls}–${le} |
| Classe | \`${CLASS}\` |
| Índice | [[Orius/desenvolvimento/legado-delphi/produtos/imoveis/unidades/dmONR]] |

## Resumo

${meta.r}

## SQL e tabelas

${meta.sq}

## Chama

| Alvo | Observação |
|------|------------|
| ${meta.ch} |

## Chamado por

| Caller | Contexto |
|--------|----------|
| ${meta.ca} |

## Regras de negócio

${meta.rg}

## Evidência

${readSrc(ls, le)}

## Briefing implementação

1. Depurar \`${name}\` L${ls}–${le} no fluxo ONR/wsgeral.
2. Cruzar config G_CONFIG e forms ONR.
3. Revalidar com validate-delphi-symbol.
`;
}

const SYMBOLS = {
  EnviarChatAtualizacaoGed_e_Pessoal_ONR: {
    r: 'Broadcast chat interno após atualização GED/Pessoal ONR: nested `InserirChat` grava `G_CHAT` para cada usuário ativo com flag `RECEBER_CHAT_ENVIO_ONR = S`, mensagem compactada via `wsRotinas_CompactarString`.',
    ch: '`dtmDataModule.sqlAuxiliar.ExecSql`, `wsRotinas_CompactarString`, `DataHoraBanco`',
    ca: 'Rotinas importação/atualização GED e Real Pessoal ONR',
    sq: '`INSERT INTO G_CHAT` (GEN_ID CHAT_SEQ); `SELECT USUARIO_ID FROM G_USUARIO WHERE RECEBER_CHAT_ENVIO_ONR = S`.',
    rg: '1. Remetente fixo USUARIO_ENVIOU_ID `123456` (Orius).\n2. Loop em SimpleAuxiliar4.',
  },
  EnviarChatPedidoONR: {
    r: 'Broadcast chat quando pedido/e-Protocolo ONR é gerado: mesma nested `InserirChat`, filtra usuários com `RECEBER_CHAT_CERTIDAO_ONLINE = S`.',
    ch: '`InserirChat` nested, `SimpleAuxiliar4`',
    ca: '[[GerarEProtocolo]] após protocolar com sucesso',
    sq: '`G_CHAT`, `G_USUARIO` (RECEBER_CHAT_CERTIDAO_ONLINE).',
    rg: '1. Par de EnviarChatAtualizacaoGed_e_Pessoal_ONR com filtro diferente.',
  },
  EnviarRegistroCnm: {
    r: 'Registra CNM na API ONR: monta JSON Chilkat (lote/registro), mapeia situação imóvel, calcula CNM via `RetornarCNM`, chama `CNM_apiRegistraCNM` e consulta; em sucesso UPDATE `R_IMOVEL` e INSERT `R_IMOVEL_CNM`.',
    ch: '`CNM_apiRegistraCNM`, `CNM_apiConsultaCNM`, `RetornarCNM`, Chilkat JSON',
    ca: 'Cadastro imóvel / rotina envio CNM ONR',
    sq: '`UPDATE R_IMOVEL SET CNM_NUMERO, CNM_HASH`; `INSERT INTO R_IMOVEL_CNM`.',
    rg: '1. Situação A/N/E/C/I/B → código 0–5.\n2. Falha registro tenta consulta manual.\n3. Retorno TEnviarRegistroCnm.',
  },
  GerarBackupBDLight_DeImagem: {
    r: 'Backup BDLight ONR modo imagem: valida pastas origem/destino, percorre `sqlPesquisaMatriculas`, copia `.spd` → `.KEN` via `wsRotinas_CopiarArquivo`, UPDATE `R_IMOVEL` DATA_BDLIGHT_* e log.',
    ch: '`wsRotinas_CopiarArquivo`, `sqlPesquisaMatriculas`, gauge/label UI',
    ca: 'Rotina backup matrículas ONR (form wsgeral)',
    sq: '`UPDATE R_IMOVEL SET DATA_BDLIGHT_REG, DATA_BDLIGHT_ATUALIZACAO, DATA_ATUALIZAR_ONR`.',
    rg: '1. Exige vpLocalImagem e vpLocalImagemOnrBackup configurados.\n2. Layout subpastas por número matrícula.',
  },
  GerarBackupBDLight_DeTexto: {
    r: 'Backup BDLight modo texto: extrai TEXTO de `R_IMOVEL` (nested `RetornaTextoMatriculaWptoos`), valida/converte WPTools, copia para destino ONR e atualiza datas BDLight.',
    ch: '`RetornaTextoMatriculaWptoos`, TWPRichText, `wsRotinas_CopiarArquivo`',
    ca: 'Backup matrículas ONR alternativo a imagem',
    sq: '`SELECT TEXTO FROM R_IMOVEL WHERE TIPO_REGISTRO = M AND NUMERO = ...`; UPDATE R_IMOVEL BDLight.',
    rg: '1. Suporta múltiplos cartórios (vpUsarMultiplosCartorios).\n2. Validação texto antes de copiar.',
  },
  GerarBackupBDLight_Misto: {
    r: 'Orquestra backup BDLight misto: delega para imagem ou texto conforme `VerificaSeSeraImagemOuTexto` por matrícula, agregando logs e contadores.',
    ch: '[[GerarBackupBDLight_DeImagem]], [[GerarBackupBDLight_DeTexto]], [[VerificaSeSeraImagemOuTexto]]',
    ca: 'Entry point backup BDLight ONR',
    sq: 'Sem SQL próprio; delega UPDATE R_IMOVEL nos filhos.',
    rg: '1. Combina resultados TGerarBackupImagem + TGerarBackupTexto.',
  },
  VerificaSeSeraImagemOuTexto: {
    r: 'Decide modo BDLight por matrícula: verifica existência arquivo imagem `.spd` no path GED vs presença TEXTO em R_IMOVEL; retorna flag imagem/texto/misto.',
    ch: '`FileExists`, consulta R_IMOVEL.TEXTO',
    ca: '[[GerarBackupBDLight_Misto]]',
    sq: '`R_IMOVEL` leitura TEXTO; filesystem GED.',
    rg: '1. Heurística por matrícula individual.',
  },
  GerarEProtocolo: {
    r: 'Materializa e-Protocolo ONR em pedido RI: lê `R_ONR_PEDIDO`/itens, grava `R_PEDIDO`/itens/andamento, `Protocolar`, `SelarProtocolo`, opcional NFSe (`GerarNotaONR`) e chat.',
    ch: '`GravarRPedido`, `GravarRPedidoItemProtocolo`, `Protocolar`, `SelarProtocolo`, `GerarNotaONR`, `EnviarChatPedidoONR`',
    ca: 'Importação e-Protocolo após seleção em MemOnrEProtContrato',
    sq: '`R_ONR_PEDIDO`, `R_ONR_PEDIDO_ITEM`, `R_PEDIDO`, `R_PEDIDO_ITEM`, `R_PROTOCOLO`, `R_ANDAMENTO`.',
    rg: '1. Aborta se protocolo ONR já existe (`BuscarPedidoIdONR`).\n2. Transação commit/rollback por etapa.\n3. Isenção TIPO_COBRANCA=0.',
  },
  GerarNotaONR: {
    r: 'Gera NFS-e para pedido originado site ONR: lê pedido/apresentante, valida config recepção, monta serviço emolumento e chama rotina NFSe do cartório.',
    ch: 'Config G_CONFIG, datasets pedido, integração NFSe',
    ca: '[[GerarEProtocolo]] quando vgGerarNfseEProtocoloNaRecepcaoONR = S',
    sq: 'Consultas R_PEDIDO / emolumentos; tabelas NFSe conforme módulo fiscal.',
    rg: '1. Só pedidos origem site ONR.\n2. Flag config recepção.',
  },
  GerarOnrXml: {
    r: 'Monta XML de retorno/resposta ONR a partir de estruturas internas (pedido/protocolo) para envio webservice.',
    ch: '`XMLDocument`, rotinas ONR XML',
    ca: 'Exportação/resposta pedidos ONR',
    sq: 'Sem SQL direto; serialização XML.',
    rg: '1. Formato XML ONR legado.',
  },
  ValidarCPF: {
    r: 'Valida CPF (dígitos verificadores) para dados importados ONR; retorna boolean.',
    ch: 'Algoritmo módulo 11 CPF',
    ca: 'Importação XML pedido / compradores ONR',
    sq: 'Sem SQL.',
    rg: '1. Rejeita CPF inválido antes de gravar pessoa.',
  },
  GerarPedidoCertidao: {
    r: 'Converte pedido certidão ONR (sqlOnrPedido) em pedido RI certidão: grava R_PEDIDO, itens, matrículas, emolumentos, andamento e protocolo certidão.',
    ch: '`GravarRPedido`, `GravarRPedidoItemCertidao`, `Protocolar`, rotinas certidão',
    ca: 'Pós-importação XML pedido certidão ONR',
    sq: '`R_ONR_PEDIDO*`, `R_PEDIDO`, `R_PEDIDO_ITEM`, `R_PROTOCOLO`.',
    rg: '1. Fluxo paralelo a GerarEProtocolo para tipo certidão.\n2. Transacional.',
  },
  GerarProtocoloIntimacao: {
    r: 'Gera protocolo de intimação a partir de pedido ONR intimacao: grava pedido/itens/endereços, protocolo tipo intimação, selagem e andamento.',
    ch: '`GravarRPedido`, `Protocolar`, `SelarProtocolo`, datasets ONR intimacao',
    ca: 'Importação pedidos intimação ONR',
    sq: '`R_ONR_PEDIDO*`, `R_PEDIDO`, `R_PROTOCOLO`, tabelas intimação RI.',
    rg: '1. Usa vgTituloIntimacao e tipo protocolo específico.',
  },
  GetDetalhesAC: {
    r: 'SOAP/HTTP ONR: obtém detalhes e-Protocolo (contrato AC) por hash e ID contrato; retorna `TRetornoGetDetalhesAC` com protocolo, status, solicitante, compradores/vendedores.',
    ch: 'Webservice ONR WSOficio / cliente SOAP interno',
    ca: '[[ProcessarWebserviceListaProtocoloONR]]',
    sq: 'Sem SQL; consome API ONR.',
    rg: '1. Requer hash login válido.\n2. Base para MemOnrEProtContrato.',
  },
  GetDetalhesIN: {
    r: 'SOAP ONR: obtém detalhes pedido intimação (IN) por hash e identificadores; popula estrutura retorno com devedores, imóveis, endereços.',
    ch: 'Webservice ONR intimacao',
    ca: 'Importação lista/detalhe intimação ONR',
    sq: 'Sem SQL direto; API ONR.',
    rg: '1. Par de GetDetalhesAC para tipo intimação.',
  },
};

function main() {
  const { path: batchPath, state } = loadBatchState('imoveis');
  const fileState = state.batches[state.active_batch_id].files[PAS];
  const results = [];

  for (const [name, meta] of Object.entries(SYMBOLS)) {
    const sym = fileState.symbols[name];
    if (!sym) {
      results.push({ symbol: name, pass: false, errors: ['ausente batch'] });
      continue;
    }
    const rel = `${VAULT}/${name}.md`;
    const abs = resolveVaultAbs(rel);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, buildNote(name, meta, sym), 'utf8');

    const v = validateVaultNote({
      vaultPath: abs,
      symbolName: name,
      pasPath: PAS,
      lineStart: sym.line_start,
      lineEnd: sym.line_end,
      mode: sym.analyze_action === 'stub' ? 'stub' : 'full',
    });

    sym.vault_path = rel;
    sym.gates = { ...sym.gates, ...v.gates };
    sym.validation_pass = v.pass;
    sym.validation_errors = v.errors;
    sym.validated_at = new Date().toISOString();
    if (v.pass) sym.status = 'done';

    results.push({ symbol: name, pass: v.pass, errors: v.errors });
  }

  const syms = Object.values(fileState.symbols);
  fileState.symbols_done = syms.filter((s) => s.status === 'done').length;
  fileState.analyze_progress_pct = Math.round(
    (100 * fileState.symbols_done) / (fileState.symbols_total || 1),
  );
  if (fileState.symbols_done === fileState.symbols_total) fileState.analyze_status = 'done';
  else if (fileState.symbols_done > 0) fileState.analyze_status = 'in_progress';

  fs.writeFileSync(batchPath, JSON.stringify(state, null, 2) + '\n', 'utf8');
  console.log(
    JSON.stringify(
      {
        passed: results.filter((r) => r.pass).length,
        failed: results.filter((r) => !r.pass).length,
        symbols_done: fileState.symbols_done,
        symbols_total: fileState.symbols_total,
        failures: results.filter((r) => !r.pass),
      },
      null,
      2,
    ),
  );
  process.exit(results.some((r) => !r.pass) ? 1 : 0);
}

main();
