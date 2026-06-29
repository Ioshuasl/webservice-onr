#!/usr/bin/env node
/**
 * Lote 1 dmONR.pas — segmentos (2+3), merge, 13 símbolos.
 */
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

function buildSymbolNote(name, meta, sym) {
  const ls = sym?.line_start ?? meta.s;
  const le = sym?.line_end ?? meta.e;
  if (meta.stub) {
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

## Resumo

${meta.r}

## SQL e tabelas

${meta.sq}

## Evidência

${readSrc(ls, le)}
`;
  }
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

1. Depurar \`${name}\` L${ls}–${le} no contexto ONR/e-Protocolo/Pix.
2. Cruzar \`dmONR.dfm\` e forms wsgeral.
3. Revalidar com validate-delphi-symbol.
`;
}

function buildSegmentNote(parent, seg, idx, total, summary, sql, calls) {
  return `---
tipo: legado-delphi
produto: imoveis
unit: ${UNIT}
simbolo: ${parent}
segment_id: "${seg.id}"
segment_key: ${seg.key}
segment_index: ${idx}
segments_total: ${total}
arquivo: ${PAS}
linhas: ${seg.s}-${seg.e}
status: revisado
fonte: agent-delphi-analyzer-segment
---

# ${parent} — segmento ${seg.id}/${String(total).padStart(2, '0')}

## Escopo

- **Arquivo:** \`${PAS}\`
- **Linhas:** ${seg.s}–${seg.e}
- **Símbolo completo:** \`${CLASS}.${parent}\`

## Resumo

${summary}

## SQL e tabelas

${sql}

## Chama

| Alvo | Observação |
|------|------------|
| ${calls} |

## Chamado por

| Caller | Contexto |
|--------|----------|
| Importação e-Protocolo / pedido certidão ONR via webservice |

## Evidência

${readSrc(seg.s, seg.e)}

## Briefing implementação

1. Trecho ${idx}/${total} de \`${parent}\`; usar nota merge após todos segmentos done.
`;
}

function buildMergeNote(parent, meta) {
  const segs = meta.segments.map((s) => `- [[${parent}/${s.key}]] L${s.s}–${s.e}`).join('\n');
  return `---
tipo: legado-delphi
produto: imoveis
unit: ${UNIT}
simbolo: ${parent}
arquivo: ${PAS}
linhas: ${meta.s}-${meta.e}
status: revisado
fonte: agent-delphi-analyzer-merge
segmentos: ${meta.segments.length}
---

# \`${CLASS}.${parent}\`

## Localização

| Campo | Valor |
|-------|-------|
| Arquivo | \`${PAS}\` |
| Linhas | ${meta.s}–${meta.e} |
| Classe | \`${CLASS}\` |
| Segmentos | pasta [[${parent}/segment-01]] … |

## Resumo global

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

${readSrc(meta.s, meta.s + 8, 12)}

${readSrc(meta.e - 5, meta.e, 8)}

## Briefing implementação

1. Ler segmentos abaixo para debug linha-a-linha.
2. Fluxo ONR: certificado → hash → webservice → memória/SimpleAuxiliar.
3. Revalidar após alteração em \`dmONR.pas\`.

## Detalhamento por segmento (referência)

${segs}
`;
}

const SYMBOLS = {
  PesquisarMatriculasReal: {
    r: 'Pesquisa matrículas para exportação REAL ONR: valida intervalo numérico, monta SQL dinâmico em `R_IMOVEL`/`R_IMOVEL_UNIDADE`/`R_IMOVEL_FICHAAUXILIAR` com filtros de cartório, alterações (`ATUALIZAR_REAL_ONR`), localização (`TIPO_CLASSE`) e tipo registro; executa em `sqlPesquisaReal` e retorna status/qtde.',
    ch: '`sqlPesquisaReal`, `wsRotinas_SalvarLogArquivo`, `QuotedStr`',
    ca: '[[GerarJSONRealOnr]] e rotinas exportação REAL ONR',
    sq: '`R_IMOVEL`, `R_IMOVEL_UNIDADE`, `R_IMOVEL_FICHAAUXILIAR`, `G_TB_BAIRRO`, `R_IMOVEL_TIPO`, `G_TB_TIPOLOGRADOURO` — SELECT DISTINCT com filtros CARTORIO/NUMERO/TIPO.',
    rg: '1. `vpAlteracoesInclusoes` altera filtro ATUALIZAR_REAL_ONR e intervalo opcional.\n2. Matrícula inicial > final → erro.\n3. Resultado em `sqlPesquisaReal.RecordCount`.',
  },
  RetornaCodUFIBGE: {
    r: 'Retorna código UF IBGE da sigla em `vgUF` via `dtmDataModule.GetInt` em `G_UF`.',
    ch: '`dtmDataModule.GetInt`, `G_UF`',
    ca: '[[GerarJSONRealOnr]] montagem JSON indicador REAL',
    sq: '`SELECT COD_UF_IBGE FROM G_UF WHERE SIGLA = :vgUF`',
    rg: '1. Função pura de lookup; depende de `vgUF` global.',
  },
  GerarJSONRealOnr: {
    r: 'Abre função `GerarJSONRealOnr`: declara variáveis/indicador REAL, nested `RemoveVirgula`, `AtualizaMatricula`, `GerarArquivo` e inicia corpo com gauge de progresso e `RetornaCodUFIBGE`.',
    ch: '`RetornaCodUFIBGE`, `sqlPesquisaReal`, `TINDICADORREAL`, `SaveDialog1`',
    ca: 'Form/menu exportação REAL ONR no wsgeral',
    sq: 'Iteração `sqlPesquisaReal`; UPDATE matrícula via nested `AtualizaMatricula` em `R_IMOVEL`.',
    rg: '1. Exporta lotes de até 5000 registros por arquivo JSON.\n2. Nested helpers documentados em símbolos irmãos.',
  },
  RemoveVirgula: {
    r: 'Nested em `GerarJSONRealOnr`: remove vírgulas de string (`StringReplace`) para normalizar valores numéricos no JSON REAL.',
    ch: '`StringReplace`',
    ca: '[[GerarJSONRealOnr]] loop montagem campos JSON',
    sq: 'Sem SQL.',
    rg: '1. Helper local; não chamar fora do escopo de GerarJSONRealOnr.',
  },
  AtualizaMatricula: {
    r: 'Nested em `GerarJSONRealOnr`: após exportar imóvel, UPDATE `R_IMOVEL` setando `DATA_REAL_ONR_REG` e limpando `ATUALIZAR_REAL_ONR` para IMOVEL_ID corrente em `sqlPesquisaReal`.',
    ch: '`dtmDataModule.sqlAuxiliar.ExecSql`, `DataHoraBanco`',
    ca: '[[GerarJSONRealOnr]] a cada registro processado',
    sq: '`UPDATE R_IMOVEL SET DATA_REAL_ONR_REG = :DATA_REAL_ONR_REG, ATUALIZAR_REAL_ONR = NULL WHERE IMOVEL_ID = ...`',
    rg: '1. Marca imóvel como enviado ao REAL ONR.',
  },
  GerarArquivo: {
    r: 'Nested em `GerarJSONRealOnr`: incrementa contador, SaveDialog para nome `real_{CNS}_{data}_{n}.json`, serializa `INDICADOR_REAL` AsJson em UTF-8 e acumula log em `Result.Log`.',
    ch: '`SaveDialog1`, `TStringList.SaveToFile`, `TINDICADORREAL.AsJson`',
    ca: '[[GerarJSONRealOnr]] a cada 5000 registros ou fim',
    sq: 'Sem SQL; arquivo JSON local.',
    rg: '1. Corrige artefato `"[\\"0\\"]"` → `[]` no texto JSON.',
  },
  AfterScrollOnrPedido: {
    r: 'Handler scroll `sqlOnrPedido`: se pedido ONR válido, recarrega datasets filhos (`R_ONR_PEDIDO_ITEM`, `_DEVEDOR`, `_END_INTIMACAO`, `_PREST_VENCIDA`, `_IMOVEL`, `_PURGA`, `_COMPRADOR`, `_VENDEDOR`) filtrando por `ONR_PEDIDO_ID`.',
    ch: '`sqlOnrPedidoItem`, `sqlOnrPedidoDevedor`, … `CommandText`',
    ca: '`sqlOnrPedido.OnAfterScroll` (dmONR.dfm)',
    sq: 'SELECT * FROM `R_ONR_PEDIDO_*` WHERE ONR_PEDIDO_ID = :id (8 tabelas).',
    rg: '1. Só dispara refresh quando ONR_PEDIDO_ID > 0.',
  },
  AjustarDataOnr: {
    r: 'Converte string datetime ONR `YYYYMMDDhhmmss` (ou similar) para `TDateTime` Delphi; retorna 0 se vazio.',
    ch: '`Copy`, `StrToDateTime`',
    ca: '[[ProcessarWebserviceListaProtocoloONR]], importação XML ONR',
    sq: 'Sem SQL.',
    rg: '1. Formato fixo posicional ano-mês-dia hora.',
  },
  BuscarHashLogin: {
    r: 'Obtém hash WSOficio ONR: carrega certificado via `frmWsGed.BuscarCertificado` se vazio, chama `LoginWsOficio` e retorna hash ou string vazia.',
    ch: '`frmWsGed.BuscarCertificado`, `LoginWsOficio`',
    ca: 'Importação e-Protocolo, pedidos ONR, múltiplos fluxos wsgeral',
    sq: 'Sem SQL direto; autenticação SOAP ONR.',
    rg: '1. Depende certificado digital configurado.',
  },
  BuscarPedidoIdONR: {
    r: 'Localiza `PEDIDO_ID` interno a partir do protocolo online ONR (`NUMERO_ONLINE`) com origem pedido site (`ORIGEM_PEDIDO = 2`) via join `R_PEDIDO`/`R_PROTOCOLO`.',
    ch: '`dtmDataModule.SimpleAuxiliar`',
    ca: '[[ProcessarWebserviceListaProtocoloONR]] deduplicação protocolo',
    sq: '`SELECT PE.PEDIDO_ID FROM R_PEDIDO PE, R_PROTOCOLO PR WHERE ... NUMERO_ONLINE = :protocolo`',
    rg: '1. Retorna 0 se protocolo vazio ou não encontrado.',
  },
  CalcularEmolumentos: {
    r: 'Inicialmente zera variáveis globais de emolumento/taxa/fundo/ISS e define data cálculo (`vpDataPedido` ou banco); inicia SELECT em `R_CALCULAR_EMOLUMENTO` via `sqlAuxiliar` com parâmetros de tabela, quantidades e valores.',
    ch: '`dtmDataModule.sqlAuxiliar`, `DataHoraBanco`',
    ca: 'Importação pedido certidão ONR, cobrança e-Protocolo',
    sq: '`R_CALCULAR_EMOLUMENTO(:V_EMOLUMENTO_ID, ...)` — stored function Firebird.',
    rg: '1. Popula vpValor* out params usados na gravação do pedido ONR.',
  },
  DataModuleCreate: {
    r: 'OnCreate do DM ONR: delega `IniciarConfigONR` (configurações globais webservice ONR).',
    ch: '`IniciarConfigONR`',
    ca: '`TdtmONR` OnCreate (dmONR.dfm)',
    sq: 'Sem SQL neste handler; leitura config em IniciarConfigONR.',
    rg: '1. Singleton `dtmONR` inicializado na abertura do módulo.',
  },
  DescricaoStatusIntimacao: {
    r: 'Mapeia código inteiro de status intimação ONR (`INTIMA_*` constants) para descrição legível pt-BR (Em Aberto, Devolvido, Prenotado, etc.).',
    ch: 'Constantes `INTIMA_*`',
    ca: 'Logs importação e-Protocolo, grids ONR, [[ProcessarWebserviceListaProtocoloONR]]',
    sq: 'Sem SQL; lookup em memória.',
    rg: '1. Função pura; ~30 status mapeados.',
  },
};

const SEGMENT_PARENTS = {
  ProcessarWebserviceListaProtocoloONR: {
    s: 5243,
    e: 5493,
    r: 'Processa lista de e-Protocolos ONR (`TRetornoListPedidosAC`): para cada protocolo obtém hash/login, chama `GetDetalhesAC`, grava contrato em memória `MemOnrEProtContrato`, insere/atualiza tabelas `R_ONR_PEDIDO_*` via `SimpleAuxiliar`, compradores/vendedores, e loga OK/ERRO no RichEdit.',
    ch: '`BuscarPedidoIdONR`, `BuscarHashLogin`, `GetDetalhesAC`, `AjustarDataOnr`, `DescricaoStatusIntimacao`, `MemOnrEProtContrato`, `SimpleAuxiliar.ApplyUpdates`',
    ca: 'Importação webservice e-Protocolo ONR (form wsgeral)',
    sq: '`R_ONR_PEDIDO`, `R_ONR_PEDIDO_ITEM`, `R_ONR_PEDIDO_COMPRADOR`, `R_ONR_PEDIDO_VENDEDOR`, `R_ONR_PEDIDO_DEVEDOR`, etc. — SELECT/Insert via SimpleAuxiliar.',
    rg: '1. Pula protocolo já importado (`BuscarPedidoIdONR` > 0) com AVISO.\n2. Falha login certificado aborta com ERRO.\n3. Mapeia tipo documento/serviço ONR → códigos internos.',
    segments: [
      {
        key: 'segment-01',
        id: '01',
        s: 5243,
        e: 5441,
        summary:
          'Loop principal e-Protocolos: label progresso, `BuscarPedidoIdONR`, `GetDetalhesAC`, popula `MemOnrEProtContrato` (protocolo, status, datas, solicitante, mapeamento tipo documento/serviço) e inicia persistência ONR_PEDIDO / itens / devedores.',
        sql: '`MemOnrEProtContrato` (memtable); `SimpleAuxiliar` SELECT/Insert em `R_ONR_PEDIDO`, `R_ONR_PEDIDO_ITEM`, `R_ONR_PEDIDO_DEVEDOR`, `R_ONR_PEDIDO_END_INTIMACAO`.',
        calls: '`BuscarPedidoIdONR`, `BuscarHashLogin`, `GetDetalhesAC`, `AjustarDataOnr`, `PegarSequencia`',
      },
      {
        key: 'segment-02',
        id: '02',
        s: 5442,
        e: 5493,
        summary:
          'Finaliza loop: grava compradores/vendedores (`R_ONR_PEDIDO_COMPRADOR`/`VENDEDOR`), log OK/ERRO com `DescricaoStatusIntimacao`, trata falha login e exceções; retorna boolean.',
        sql: '`R_ONR_PEDIDO_COMPRADOR`, `R_ONR_PEDIDO_VENDEDOR` — Insert ApplyUpdates.',
        calls: '`DescricaoStatusIntimacao`, `SimpleAuxiliar.ApplyUpdates`, `Application.ProcessMessages`',
      },
    ],
  },
  ProcessarXmlPedidoCertidaoONR: {
    s: 5744,
    e: 6234,
    r: 'Importa XML pedido certidão ONR: transação, carrega XML do banco (`PegarXmlNoBancoONR`), parse `PEDIDO_CERTIDAO`, grava pedido/itens/endereços/matriculas/pessoas em tabelas RI/ONR, calcula emolumentos e monta log `vgOkXmlPedidoONR`/`vgErroXmlPedidoONR`.',
    ch: '`PegarXmlNoBancoONR`, `TratarXnlOnr`, `XMLDocument`, `CalcularEmolumentos`, `dtmDataModule.StartTransaction`',
    ca: 'Processamento fila XML ONR pedido certidão (wsgeral)',
    sq: '`R_ONR_PEDIDO*`, `R_PEDIDO`, inserts via SimpleAuxiliar/sqlAuxiliar; XML nodes PEDIDO_CERTIDAO/CERTIDAO/MATRICULA/PESSOA.',
    rg: '1. Um node PEDIDO_CERTIDAO por iteração com label progresso.\n2. Commit/rollback transacional.\n3. Validações de CEP/matrícula/pessoa acumulam log texto.',
    segments: [
      {
        key: 'segment-01',
        id: '01',
        s: 5744,
        e: 5935,
        summary:
          'Setup transação, load XML, contagem nodes `PEDIDO_CERTIDAO`, loop inicial: extrai protocolo, solicitante, endereço, tipo cobrança, inicia gravação pedido ONR.',
        sql: 'Transação Firebird; leitura XML; INSERT pedido certidão ONR.',
        calls: '`PegarXmlNoBancoONR`, `TratarXnlOnr`, `StartTransaction`, `PegarSequencia`',
      },
      {
        key: 'segment-02',
        id: '02',
        s: 5936,
        e: 6136,
        summary:
          'Processa certidões aninhadas: endereço imóvel, matrícula, pessoa, emolumentos (`CalcularEmolumentos`), itens pedido e vínculos RI.',
        sql: '`R_ONR_PEDIDO_ITEM`, matrícula/pessoa; `R_CALCULAR_EMOLUMENTO` via CalcularEmolumentos.',
        calls: '`CalcularEmolumentos`, `SimpleAuxiliar`, `BuscarPedidoIdONR`',
      },
      {
        key: 'segment-03',
        id: '03',
        s: 6137,
        e: 6234,
        summary:
          'Monta mensagens OK detalhadas (CEP, matrícula, pessoa), commit transação, tratamento exceções e retorno boolean.',
        sql: 'Commit; sem SQL adicional — logging `vgOkXmlPedidoONR`.',
        calls: '`Commit`, exception handler',
      },
    ],
  },
};

function processSegments(fileState, results) {
  for (const [parent, meta] of Object.entries(SEGMENT_PARENTS)) {
    const sym = fileState.symbols[parent];
    if (!sym) {
      results.push({ symbol: parent, pass: false, errors: ['ausente batch'] });
      continue;
    }
    const dir = `${VAULT}/${parent}`;
    fs.mkdirSync(resolveVaultAbs(dir), { recursive: true });

    for (let i = 0; i < meta.segments.length; i++) {
      const seg = meta.segments[i];
      const rel = `${dir}/${seg.key}.md`;
      const abs = resolveVaultAbs(rel);
      fs.writeFileSync(
        abs,
        buildSegmentNote(parent, seg, i + 1, meta.segments.length, seg.summary, seg.sql, seg.calls),
        'utf8',
      );
      sym.segments[seg.key].status = 'done';
      sym.segments[seg.key].vault_path = rel;
    }
    sym.segments_done = meta.segments.length;
    sym.segment_status = 'done';

    const mergeRel = `${VAULT}/${parent}.md`;
    const mergeAbs = resolveVaultAbs(mergeRel);
    fs.writeFileSync(mergeAbs, buildMergeNote(parent, meta), 'utf8');

    const v = validateVaultNote({
      vaultPath: mergeAbs,
      symbolName: parent,
      pasPath: PAS,
      lineStart: sym.line_start,
      lineEnd: sym.line_end,
      mode: 'full',
    });

    sym.vault_path = mergeRel;
    sym.gates = { ...sym.gates, ...v.gates };
    sym.validation_pass = v.pass;
    sym.validation_errors = v.errors;
    sym.validated_at = new Date().toISOString();
    sym.merge_status = 'done';
    if (v.pass) sym.status = 'done';

    const planPath = resolveVaultAbs(sym.segment_plan_vault);
    if (fs.existsSync(planPath)) {
      const plan = JSON.parse(fs.readFileSync(planPath, 'utf8'));
      for (const s of plan.segments) s.status = 'done';
      fs.writeFileSync(planPath, JSON.stringify(plan, null, 2) + '\n', 'utf8');
    }

    results.push({ symbol: parent, pass: v.pass, type: 'merge', errors: v.errors });
  }
}

function processSymbols(fileState, results) {
  for (const [name, meta] of Object.entries(SYMBOLS)) {
    const sym = fileState.symbols[name];
    if (!sym) {
      results.push({ symbol: name, pass: false, errors: ['ausente batch'] });
      continue;
    }
    const rel = `${VAULT}/${name}.md`;
    const abs = resolveVaultAbs(rel);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, buildSymbolNote(name, meta, sym), 'utf8');

    const mode = sym.analyze_action === 'stub' ? 'stub' : 'full';
    const v = validateVaultNote({
      vaultPath: abs,
      symbolName: name,
      pasPath: PAS,
      lineStart: sym.line_start,
      lineEnd: sym.line_end,
      mode,
    });

    sym.vault_path = rel;
    sym.gates = { ...sym.gates, ...v.gates };
    sym.validation_pass = v.pass;
    sym.validation_errors = v.errors;
    sym.validated_at = new Date().toISOString();
    if (v.pass) sym.status = 'done';

    results.push({ symbol: name, pass: v.pass, errors: v.errors });
  }
}

function main() {
  const { path: batchPath, state } = loadBatchState('imoveis');
  const fileState = state.batches[state.active_batch_id].files[PAS];
  const results = [];

  processSegments(fileState, results);
  processSymbols(fileState, results);

  const syms = Object.values(fileState.symbols);
  fileState.symbols_done = syms.filter((s) => s.status === 'done').length;
  fileState.analyze_progress_pct = Math.round(
    (100 * fileState.symbols_done) / (fileState.symbols_total || 1),
  );
  if (fileState.symbols_done === fileState.symbols_total) {
    fileState.analyze_status = 'done';
  } else if (fileState.symbols_done > 0) {
    fileState.analyze_status = 'in_progress';
  }

  fs.writeFileSync(batchPath, JSON.stringify(state, null, 2) + '\n', 'utf8');

  const out = {
    passed: results.filter((r) => r.pass).length,
    failed: results.filter((r) => !r.pass).length,
    symbols_done: fileState.symbols_done,
    symbols_total: fileState.symbols_total,
    failures: results.filter((r) => !r.pass),
  };
  console.log(JSON.stringify(out, null, 2));
  process.exit(out.failed ? 1 : 0);
}

main();
