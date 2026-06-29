#!/usr/bin/env node
/** Lote 3 dmONR.pas — gravacao RI, XML, pesquisa, protocolo, CNM API. */
const fs = require('fs');
const path = require('path');
const { validateVaultNote, resolveVaultAbs } = require('./delphi-validate-lib.cjs');
const { loadBatchState } = require('./delphi-triage-lib.cjs');
const { CODE_ROOT } = require('./delphi-batch-paths.cjs');

const PAS = 'RegistroDeImoveis/geral_sistemas/wsgeral/dmONR.pas';
const VAULT = 'Orius/desenvolvimento/legado-delphi/produtos/imoveis/unidades/dmONR';

function readSrc(ls, le, max = 25) {
  const lines = fs.readFileSync(path.join(CODE_ROOT, PAS), 'latin1').split(/\r?\n/);
  const total = le - ls + 1;
  const excerpt = lines.slice(ls - 1, ls - 1 + Math.min(max, total)).join('\n');
  const omit = max < total ? `\n// ... (ver L${ls}–${le})` : '';
  return [`Fonte: \`${PAS}\` L${ls}–${le}.`, '', '```pascal', excerpt + omit, '```'].join('\n');
}

function buildNote(name, meta, sym) {
  const ls = sym.line_start;
  const le = sym.line_end;
  return `---
tipo: legado-delphi
produto: imoveis
unit: dmONR
simbolo: ${name}
arquivo: ${PAS}
linhas: ${ls}-${le}
status: revisado
---

# \`TdtmONR.${name}\`

## Localização

| Campo | Valor |
|-------|-------|
| Arquivo | \`${PAS}\` |
| Linhas | ${ls}–${le} |
| Classe | \`TdtmONR\` |

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

1. Depurar \`${name}\` no pipeline importação ONR.
2. Validar transações e logs ONR.
3. Revalidar com validate-delphi-symbol.
`;
}

const SYMBOLS = {
  GravarLogOnr: {
    r: 'Persiste log textual de operação ONR (sucesso/erro) em tabela/arquivo de auditoria wsgeral via sqlAuxiliar.',
    ch: '`dtmDataModule.sqlAuxiliar.ExecSql`',
    ca: 'Fluxos importação ONR após processamento',
    sq: 'INSERT log ONR (tabela conforme G_CONFIG/wsgeral).',
    rg: '1. Centraliza rastreio importação XML/webservice.',
  },
  GravarRAndamento: {
    r: 'Insere registro em `R_ANDAMENTO` vinculado ao pedido/protocolo ONR gerado (tipo, pedido_id, observação protocolo ONR).',
    ch: '`PegarSequencia`, `SimpleAuxiliar.ApplyUpdates`',
    ca: '[[GerarEProtocolo]], [[GerarPedidoCertidao]], [[GerarProtocoloIntimacao]]',
    sq: '`INSERT/SELECT R_ANDAMENTO`; sequência ANDAMENTO.',
    rg: '1. Retorna ANDAMENTO_ID ou 0 em falha.',
  },
  GravarRPedido: {
    r: 'Cria cabeçalho `R_PEDIDO` a partir de dataset ONR pedido: apresentante, origem site, valores, isenção, vínculo ONR_PEDIDO_ID.',
    ch: '`SimpleAuxiliar` insert, `PegarSequencia`',
    ca: 'Geradores de pedido ONR (e-Protocolo, certidão, intimação)',
    sq: '`INSERT INTO R_PEDIDO` campos origem/ONR/apresentante.',
    rg: '1. Origem pedido site ONR.\n2. Parâmetros tipo serviço e isenção.',
  },
  GravarRPedidoItemCertidao: {
    r: 'Insere item pedido certidão em `R_PEDIDO_ITEM` a partir de node ONR certidão (matrícula, tipo certidão, emolumentos, endereço).',
    ch: '`R_CALCULAR_EMOLUMENTO`, sqlGravar insert',
    ca: '[[GerarPedidoCertidao]] loop itens certidão',
    sq: '`R_PEDIDO_ITEM`, emolumentos, matrícula RI.',
    rg: '1. Um item por certidão XML.\n2. Valida matrícula/pessoa.',
  },
  GravarRPedidoItemProtocolo: {
    r: 'Insere item pedido e-Protocolo em `R_PEDIDO_ITEM` com matrícula, emolumentos e flags isenção conforme tipo XML ONR.',
    ch: '`GravarRPedidoItem*` helpers, sqlGravar',
    ca: '[[GerarEProtocolo]] por item ONR_PEDIDO_ITEM',
    sq: '`R_PEDIDO_ITEM` INSERT.',
    rg: '1. Exige MAT_NUMERO preenchido.',
  },
  GravarXmlONR_Pedido: {
    r: 'Grava blob XML recebido ONR em `R_ONR_PEDIDO_XML` com metadados (tipo, data, hash) para fila processamento.',
    ch: '`PegarSequencia`, sqlAuxiliar',
    ca: 'Recepção upload/fila XML ONR',
    sq: '`INSERT R_ONR_PEDIDO_XML` (XML blob).',
    rg: '1. Retorna ONR_PEDIDO_XML_ID.',
  },
  PegarXmlNoBancoONR: {
    r: 'Recupera conteúdo XML string de `R_ONR_PEDIDO_XML` por ID para parse TXMLDocument.',
    ch: '`sqlAuxiliar` SELECT blob',
    ca: '[[ProcessarXmlPedidoCertidaoONR]], ProcessarXml* ONR',
    sq: '`SELECT XML FROM R_ONR_PEDIDO_XML WHERE ONR_PEDIDO_XML_ID = ...`',
    rg: '1. Usado antes de TratarXnlOnr.',
  },
  PesquisarMatriculas: {
    r: 'Monta pesquisa matrículas para exportação/backup ONR (sqlPesquisaMatriculas): filtros cartório, intervalo, situação BDLight.',
    ch: '`sqlPesquisaMatriculas.CommandText`',
    ca: 'Backup BDLight, telas pesquisa ONR',
    sq: '`R_IMOVEL`, joins unidade/ficha; SELECT dinâmico.',
    rg: '1. Base para GerarBackupBDLight_*.',
  },
  PesquisarPessoas: {
    r: 'Pesquisa pessoas (CPF/CNPJ/nome) para exportação Real Pessoal ONR em sqlPesquisaPessoas com filtros cartório.',
    ch: '`sqlPesquisaPessoas`',
    ca: 'Exportação Real Pessoal ONR',
    sq: 'Tabelas pessoa RI (`R_PESSOA` / vínculos) — SELECT.',
    rg: '1. Paralelo a PesquisarMatriculas para cadastro pessoal.',
  },
  ProcessarWebserviceListaIntimacaoONR: {
    r: 'Processa lista intimações ONR via webservice: loop protocolos, GetDetalhesIN, grava MemOnr* e tabelas R_ONR_PEDIDO_* analogo e-Protocolo.',
    ch: '`GetDetalhesIN`, `BuscarHashLogin`, `BuscarPedidoIdONR`, MemOnr datasets',
    ca: 'Importação lista intimação ONR (form wsgeral)',
    sq: '`R_ONR_PEDIDO*`, SimpleAuxiliar inserts.',
    rg: '1. Espelha ProcessarWebserviceListaProtocoloONR para intimação.',
  },
  ProcessarXmlBuscasONR: {
    r: 'Parse XML buscas ONR (CODHAB/qualificada): transação, nodes PESQUISA, grava pedidos busca, emolumentos e log resultado.',
    ch: '`PegarXmlNoBancoONR`, `XMLDocument`, `CalcularEmolumentos`',
    ca: 'Fila XML tipo busca ONR',
    sq: '`R_ONR_PEDIDO*`, R_PEDIDO busca; XML PESQUISA.',
    rg: '1. Contadores vQtdeBuscas* por tipo.',
  },
  ProcessarXmlVisualizacaoMatriculasONR: {
    r: 'Processa XML visualização matrículas ONR: extrai matrículas solicitadas, valida existência RI, monta resposta/log vgOkXml*.',
    ch: '`XMLDocument`, consultas R_IMOVEL',
    ca: 'Fila XML visualização matrícula ONR',
    sq: '`R_IMOVEL` SELECT por número; sem insert pedido.',
    rg: '1. Modo consulta/visualização, não gera protocolo.',
  },
  Protocolar: {
    r: 'Insere registro em `R_PROTOCOLO` para pedido ONR: tipo protocolo, contador, apresentante, valor, vínculo ONR; retorna número protocolo.',
    ch: '`R_CONTADOR`, sqlGravar, `PegarSequencia`',
    ca: '[[GerarEProtocolo]], geradores pedido ONR',
    sq: '`INSERT R_PROTOCOLO`; incremento R_CONTADOR.',
    rg: '1. Transação externa; falha retorna 0.',
  },
  CNM_apiConsultaCNM: {
    r: 'Chama API REST ONR consulta CNM por número; parse JSON retorno (hash, situação, CNS, data registro) em TConsultaCNM.',
    ch: 'HTTP/Chilkat cliente CNM ONR',
    ca: '[[EnviarRegistroCnm]] pós-registro',
    sq: 'Sem SQL; API CNM ONR.',
    rg: '1. Consulta confirma registro antes de gravar R_IMOVEL_CNM.',
  },
  CNM_apiRegistraCNM: {
    r: 'POST API ONR registra lote CNM (JSON Chilkat); retorna qtde registros/falhas e erros por item.',
    ch: 'HTTP POST CNM, Chilkat JsonObject',
    ca: '[[EnviarRegistroCnm]]',
    sq: 'Sem SQL local; API externa.',
    rg: '1. Primeira tentativa registro; falhas acionam consulta.',
  },
};

function main() {
  const { path: batchPath, state } = loadBatchState('imoveis');
  const fileState = state.batches[state.active_batch_id].files[PAS];
  const results = [];
  for (const [name, meta] of Object.entries(SYMBOLS)) {
    const sym = fileState.symbols[name];
    if (!sym) {
      results.push({ symbol: name, pass: false, errors: ['ausente'] });
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
      mode: 'full',
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
  fileState.analyze_progress_pct = Math.round((100 * fileState.symbols_done) / (fileState.symbols_total || 1));
  fileState.analyze_status =
    fileState.symbols_done === fileState.symbols_total
      ? 'done'
      : fileState.symbols_done > 0
        ? 'in_progress'
        : fileState.analyze_status;
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
