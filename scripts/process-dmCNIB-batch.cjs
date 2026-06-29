#!/usr/bin/env node
/**
 * Gera notas vault dmCNIB.pas, valida e atualiza batch.
 */
const fs = require('fs');
const path = require('path');
const { validateVaultNote, resolveVaultAbs, validateBatchSymbols } = require('./delphi-validate-lib.cjs');
const { loadBatchState } = require('./delphi-triage-lib.cjs');
const { CODE_ROOT } = require('./delphi-batch-paths.cjs');

const PAS = 'RegistroDeImoveis/dmCNIB.pas';
const VAULT = 'Orius/desenvolvimento/legado-delphi/produtos/imoveis/unidades/dmCNIB';

const NOTES = {
  DataModuleCreate: {
    s: 181, e: 194, stub: false,
    r: 'Inicialização do data module CNIB: associa `Connection := dtmControles.DB` em todos os datasets (`sqlPesquisaCNIB*`, `sqlCNIB`, `sqlPessoaVinculo`, `sqlPessoa`, `sqlBuscaDadosPessoa`, `sqlCNIB_XML`); carrega flag `vgTrazerApenasVinculosDoi` de `G_CONFIG` chave `OUTROS/ONR_CNIB/TRAZER_APENAS_VINCULOS_DOI`.',
    ch: '`dtmControles.DB`, `BuscarConfig`',
    ca: '`TdtmCNIB` OnCreate (`dmCNIB.dfm`)',
    sq: '`G_CONFIG` (leitura TRAZER_APENAS_VINCULOS_DOI); datasets CNIB sem SQL neste handler.',
    rg: '1. Singleton global `dtmCNIB`. 2. Flag DOI filtra vínculos na pesquisa CNIB.',
  },
  DataModuleDestroy: {
    s: 196, e: 199, stub: false,
    r: 'Destroy do DM: zera referência global `dtmCNIB := nil` para evitar dangling pointer.',
    ch: 'Atribuição `dtmCNIB := nil`',
    ca: 'OnDestroy data module',
    sq: 'Sem SQL.',
    rg: '1. Padrão Delphi singleton DM.',
  },
  ImprimirRelatorioCNIB: {
    s: 201, e: 250, stub: false,
    r: 'Impressão/visualização relatório FastReport CNIB: aplica SQL dinâmico em até 4 datasets pesquisa, define `vgTipoImpressao` (T=todos, E=encontrados, P=parcial) e chama `ExibirRelatorio` no `frxPesquisaCNIB` com `ParametrosRelatorio`.',
    ch: '`sqlPesquisaCNIB*` CommandText, `ExibirRelatorio`, `ParametrosRelatorio`',
    ca: 'Form CNIB / rotinas exportação relatório',
    sq: 'SQL dinâmico via parâmetros vpSQL*; tabelas CNIB conforme query passada.',
    rg: '1. Tipo T exige pesquisa+consistência+cancelamento preenchidos. 2. Usa VisualizaRelatorios.',
  },
  ParametrosRelatorio: {
    s: 253, e: 260, stub: false,
    r: 'Popula variáveis FastReport do `frxPesquisaCNIB`: nome cartório, login, tipo impressão, data importação, erros.',
    ch: '`frxPesquisaCNIB.Variables`, `BuscarConfig` PRINCIPAL/CARTORIO/NOME',
    ca: '[[ImprimirRelatorioCNIB]] antes de ExibirRelatorio',
    sq: '`G_CONFIG` cartório; variáveis globais vgLogin, vgTipoImpressao, vgDataImportacao, vgErros.',
    rg: '1. Procedure sem parâmetros — side effect no report.',
  },
  sqlCNIBAfterEdit: {
    s: 262, e: 267, stub: false,
    r: 'Após Edit em `sqlCNIB`: habilita Gravar/Cancelar, desabilita Excluir no form CNIB.',
    ch: 'UI `frmCNIB` botões btnGravar, btnCancelar, btnExcluir',
    ca: '`sqlCNIB.OnAfterEdit` (dmCNIB.dfm)',
    sq: 'Sem SQL; buffer dataset CNIB.',
    rg: '1. Modo edição bloqueia exclusão até post/cancel.',
  },
  sqlPessoaVinculoAfterEdit: {
    s: 274, e: 281, stub: false,
    r: 'Após Edit em vínculo pessoa: habilita gravar/cancelar pessoa; desabilita incluir/alterar/excluir.',
    ch: 'UI frmCNIB botões pessoa',
    ca: '`sqlPessoaVinculo.OnAfterEdit`',
    sq: 'Sem SQL direto.',
    rg: '1. UX consistente com sqlCNIBAfterEdit para sub-grid pessoa.',
  },
  sqlPessoaVinculoBeforeEdit: {
    s: 288, e: 295, stub: false,
    r: 'BeforeEdit vínculo pessoa: mesma política de botões que AfterEdit (prepara UI para edição).',
    ch: 'UI frmCNIB botões pessoa',
    ca: '`sqlPessoaVinculo.OnBeforeEdit`',
    sq: 'Sem SQL.',
    rg: '1. Redundância intencional Before+After para garantir estado UI.',
  },
  sqlCNIBAfterScroll: {
    s: 269, e: 272, stub: true,
    r: 'Stub T4: após scroll em `sqlCNIB`, delega `frmCNIB.AtualizarLRI` para refresh indicador LRI.',
    sq: 'Sem SQL; leitura posição atual sqlCNIB.',
  },
  sqlPessoaVinculoAfterScroll: {
    s: 283, e: 286, stub: true,
    r: 'Stub T4: após scroll vínculo pessoa, chama `frmCNIB.ValidarFisicaOuJuridica`.',
    sq: 'Sem SQL.',
  },
  sqlPessoaVinculoCalcFields: {
    s: 297, e: 323, stub: true,
    r: 'Stub T4: campos calculados vínculo — Status Ativo/Cancelado, CPF formatado, dados cancelamento via `R_LRI_CANCELAMENTO`.',
    sq: '`R_LRI_CANCELAMENTO` SELECT; campos calc sqlPessoaVinculo*Calc.',
  },
};

function readSrc(lineStart, lineEnd) {
  const lines = fs.readFileSync(path.join(CODE_ROOT, PAS), 'latin1').split(/\r?\n/);
  const max = Math.min(30, lineEnd - lineStart + 1);
  const excerpt = lines.slice(lineStart - 1, lineStart - 1 + max).join('\n');
  const omit = max < lineEnd - lineStart + 1 ? `\n// ... (ver L${lineStart}–${lineEnd})` : '';
  return [`Fonte: \`${PAS}\` L${lineStart}–${lineEnd}.`, '', '```pascal', excerpt + omit, '```'].join('\n');
}

function buildNote(name, meta) {
  const mode = meta.stub ? 'stub' : 'full';
  if (meta.stub) {
    return `---
tipo: legado-delphi
produto: imoveis
unit: dmCNIB
simbolo: ${name}
arquivo: ${PAS}
linhas: ${meta.s}-${meta.e}
status: revisado
---

# \`TdtmCNIB.${name}\`

## Localização

| Campo | Valor |
|-------|-------|
| Arquivo | \`${PAS}\` |
| Linhas | ${meta.s}–${meta.e} |
| Classe | \`TdtmCNIB\` |

## Resumo

${meta.r}

## SQL e tabelas

${meta.sq}

## Evidência

${readSrc(meta.s, meta.e)}
`;
  }
  return `---
tipo: legado-delphi
produto: imoveis
unit: dmCNIB
simbolo: ${name}
arquivo: ${PAS}
linhas: ${meta.s}-${meta.e}
status: revisado
---

# \`TdtmCNIB.${name}\`

## Localização

| Campo | Valor |
|-------|-------|
| Arquivo | \`${PAS}\` |
| Linhas | ${meta.s}–${meta.e} |
| Classe | \`TdtmCNIB\` |
| Índice | [[Orius/desenvolvimento/legado-delphi/produtos/imoveis/unidades/dmCNIB]] |

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

${readSrc(meta.s, meta.e)}

## Briefing implementação

1. Depurar \`${name}\` L${meta.s}–${meta.e} em contexto CNIB/ONR.
2. Cruzar \`dmCNIB.dfm\` e form [[CNIB]].
3. Revalidar com validate-delphi-symbol.
`;
}

function main() {
  const { path: batchPath, state } = loadBatchState('imoveis');
  const fileState = state.batches[state.active_batch_id].files[PAS];
  const results = [];

  fs.mkdirSync(resolveVaultAbs(VAULT), { recursive: true });

  for (const [name, meta] of Object.entries(NOTES)) {
    const sym = fileState.symbols[name];
    if (!sym) {
      results.push({ symbol: name, pass: false, errors: ['ausente no batch'] });
      continue;
    }
    const rel = `${VAULT}/${name}.md`;
    const abs = resolveVaultAbs(rel);
    fs.writeFileSync(abs, buildNote(name, meta), 'utf8');

    const mode = sym.analyze_action === 'stub' || meta.stub ? 'stub' : 'full';
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

    results.push({ symbol: name, pass: v.pass, mode, errors: v.errors });
  }

  const syms = Object.values(fileState.symbols);
  fileState.symbols_done = syms.filter((s) => s.status === 'done').length;
  if (fileState.symbols_done === fileState.symbols_total) {
    fileState.analyze_status = 'done';
  } else if (fileState.symbols_done > 0) {
    fileState.analyze_status = 'in_progress';
  }

  fs.writeFileSync(batchPath, JSON.stringify(state, null, 2) + '\n', 'utf8');

  console.log(
    JSON.stringify(
      {
        passed: results.filter((r) => r.pass).length,
        failed: results.filter((r) => !r.pass).length,
        symbols_done: fileState.symbols_done,
        symbols_total: fileState.symbols_total,
        results,
      },
      null,
      2,
    ),
  );
  process.exit(results.some((r) => !r.pass) ? 1 : 0);
}

main();
