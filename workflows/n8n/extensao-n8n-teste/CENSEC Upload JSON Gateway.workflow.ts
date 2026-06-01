import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : CENSEC Upload JSON Gateway
// Nodes   : 11  |  Connections: 10
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// ReceiveCensecPayload               webhook                    [creds]
// NormalizePayload                   code
// ValidateCepActs                    code
// ValidateCesdiActs                  code
// ValidateCtpDeclarations            code
// HasValidationErrors                if
// BuildValidationErrorResponse       code
// UploadJsonToCensec                 httpRequest                [onError→regular]
// BuildUploadResponse                code
// ReturnValidationError              respondToWebhook
// ReturnUploadResponse               respondToWebhook
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// ReceiveCensecPayload
//    → NormalizePayload
//      → ValidateCepActs
//        → ValidateCesdiActs
//          → ValidateCtpDeclarations
//            → HasValidationErrors
//              → BuildValidationErrorResponse
//                → ReturnValidationError
//             .out(1) → UploadJsonToCensec
//                → BuildUploadResponse
//                  → ReturnUploadResponse
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'tav97HSLIT79LpwO',
    name: 'CENSEC Upload JSON Gateway',
    active: false,
    isArchived: false,
    projectId: 'PP65Me8T4KDNsx9m',
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class CensecUploadJsonGatewayWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'c04749ed-78c7-49b0-8ac2-cc8043de1d13',
        webhookId: 'b5466eb9-9d7c-47d3-939b-dd5a26d60e1f',
        name: 'Receive CENSEC Payload',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 300],
        credentials: { httpBasicAuth: { id: 'CE3L7VlaRe4klqlk', name: 'ioshua + ioshua123' } },
    })
    ReceiveCensecPayload = {
        httpMethod: 'POST',
        path: 'censec/cargas/upload-json',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        responseBinaryPropertyName: 'data',
    };

    @node({
        id: 'f7a9ef90-ef5e-4888-87f2-3bef88e56865',
        name: 'Normalize Payload',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [260, 300],
    })
    NormalizePayload = {
        mode: 'runOnceForAllItems',
        language: 'javaScript',
        jsCode: `
const input = items[0]?.json ?? {};
const payload = input.body && typeof input.body === 'object' && !Array.isArray(input.body)
  ? input.body
  : input;

return [{
  json: {
    payload,
    validation: {
      errors: [],
      warnings: [],
      hasErrors: false,
    },
    meta: {
      receivedAt: new Date().toISOString(),
      source: 'n8n-censec-upload-json',
      headers: input.headers ?? {},
    },
  },
}];
`,
    };

    @node({
        id: '17e878ee-b111-440d-9876-a43c0af90225',
        name: 'Validate CEP Acts',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [540, 160],
    })
    ValidateCepActs = {
        mode: 'runOnceForAllItems',
        language: 'javaScript',
        jsCode: `
const item = items[0].json;
const payload = item.payload ?? {};
const errors = item.validation.errors;
const warnings = item.validation.warnings;

function addError(path, code, message) {
  errors.push({ central: 'CEP', path, code, message });
}

function digits(value) {
  return String(value ?? '').replace(/\\D/g, '');
}

function isCpf(value) {
  const cpf = digits(value);
  if (!/^\\d{11}$/.test(cpf) || /^(\\d)\\1{10}$/.test(cpf)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += Number(cpf[i]) * (10 - i);
  let check = 11 - (sum % 11);
  if (check >= 10) check = 0;
  if (check !== Number(cpf[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += Number(cpf[i]) * (11 - i);
  check = 11 - (sum % 11);
  if (check >= 10) check = 0;
  return check === Number(cpf[10]);
}

function isCnpj(value) {
  const cnpj = digits(value);
  if (!/^\\d{14}$/.test(cnpj) || /^(\\d)\\1{13}$/.test(cnpj)) return false;
  const calc = (base, weights) => {
    const sum = weights.reduce((acc, weight, index) => acc + Number(base[index]) * weight, 0);
    const mod = sum % 11;
    return mod < 2 ? 0 : 11 - mod;
  };
  const d1 = calc(cnpj, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const d2 = calc(cnpj, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  return d1 === Number(cnpj[12]) && d2 === Number(cnpj[13]);
}

function isDate(value) {
  return typeof value === 'string' && /^\\d{4}-\\d{2}-\\d{2}$/.test(value);
}

function requireField(obj, field, path) {
  if (obj[field] === undefined || obj[field] === null || obj[field] === '') {
    addError(path + '.' + field, 'required', 'Campo obrigatorio ausente.');
  }
}

if (payload.atosCep === undefined) {
  item.validation.hasErrors = errors.length > 0;
  return items;
}

if (!Array.isArray(payload.atosCep)) {
  addError('atosCep', 'array', 'atosCep deve ser um array JSON.');
  item.validation.hasErrors = errors.length > 0;
  return items;
}

const referenteTypes = new Set(['RenunciaDeProcuracao', 'RevogacaoDeProcuracao', 'Substabelecimento']);
const unionStableNatures = new Set(['DeclaratoriaDeUniaoEstavel', 'DeclaratoriaDeUniaoEstavelHomoafetiva', 'DissolucaoDeUniaoEstavel']);

payload.atosCep.forEach((ato, index) => {
  const base = 'atosCep[' + index + ']';
  ['tipoAtoCep', 'data', 'livro', 'folha', 'valor', 'partes'].forEach((field) => requireField(ato, field, base));

  if (ato.data !== undefined && !isDate(ato.data)) addError(base + '.data', 'date_format', 'Data deve estar em YYYY-MM-DD.');
  if (ato.dataContrato !== undefined && ato.dataContrato !== null && !isDate(ato.dataContrato)) addError(base + '.dataContrato', 'date_format', 'Data do contrato deve estar em YYYY-MM-DD.');
  if (ato.dataValidade !== undefined && ato.dataValidade !== null && !isDate(ato.dataValidade)) addError(base + '.dataValidade', 'date_format', 'Data de validade deve estar em YYYY-MM-DD.');

  if (ato.tipoAtoCep === 'Escritura') requireField(ato, 'naturezaEscritura', base);
  if (ato.tipoAtoCep === 'AtaNotarialDeUsucapiao') requireField(ato, 'naturezaAtaNotarialDeUsucapiao', base);
  if (referenteTypes.has(ato.tipoAtoCep) && (!Array.isArray(ato.referentes) || ato.referentes.length === 0)) {
    addError(base + '.referentes', 'required', 'referentes e obrigatorio para renuncia, revogacao e substabelecimento.');
  }
  if (ato.naturezaEscritura === 'Rerratificacao' && (!Array.isArray(ato.referentes) || ato.referentes.length === 0)) {
    addError(base + '.referentes', 'required', 'referentes e obrigatorio para rerratificacao.');
  }
  if (ato.naturezaEscritura === 'Mediacao' || ato.naturezaEscritura === 'Conciliacao') {
    requireField(ato, 'naturezaLitigio', base);
    requireField(ato, 'acordo', base);
  }
  if (unionStableNatures.has(ato.naturezaEscritura)) requireField(ato, 'regimeBens', base);
  if (ato.existeBemEDireito === true && (!Array.isArray(ato.bensEDireitos) || ato.bensEDireitos.length === 0)) {
    addError(base + '.bensEDireitos', 'required', 'bensEDireitos e obrigatorio quando existeBemEDireito for true.');
  }

  if (!Array.isArray(ato.partes) || ato.partes.length === 0) {
    addError(base + '.partes', 'required', 'Cada ato CEP deve conter pelo menos uma parte.');
  } else {
    ato.partes.forEach((parte, parteIndex) => {
      const partPath = base + '.partes[' + parteIndex + ']';
      ['nome', 'tipoDocumento', 'qualidade'].forEach((field) => requireField(parte, field, partPath));
      const tipoDocumento = String(parte.tipoDocumento ?? '');
      if (['Cpf', 'CPF'].includes(tipoDocumento) && !isCpf(parte.numeroDocumento)) {
        addError(partPath + '.numeroDocumento', 'cpf_invalid', 'numeroDocumento deve ser um CPF valido quando tipoDocumento for CPF.');
      }
      if (['Cnpj', 'CNPJ'].includes(tipoDocumento) && !isCnpj(parte.numeroDocumento)) {
        addError(partPath + '.numeroDocumento', 'cnpj_invalid', 'numeroDocumento deve ser um CNPJ valido quando tipoDocumento for CNPJ.');
      }
    });
  }
});

item.validation.hasErrors = errors.length > 0;
return items;
`,
    };

    @node({
        id: '6003d73c-26d8-465a-98ed-041d017af1b6',
        name: 'Validate CESDI Acts',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [820, 160],
    })
    ValidateCesdiActs = {
        mode: 'runOnceForAllItems',
        language: 'javaScript',
        jsCode: `
const item = items[0].json;
const payload = item.payload ?? {};
const errors = item.validation.errors;

function addError(path, code, message) {
  errors.push({ central: 'CESDI', path, code, message });
}

function digits(value) {
  return String(value ?? '').replace(/\\D/g, '');
}

function isCpf(value) {
  const cpf = digits(value);
  if (!/^\\d{11}$/.test(cpf) || /^(\\d)\\1{10}$/.test(cpf)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += Number(cpf[i]) * (10 - i);
  let check = 11 - (sum % 11);
  if (check >= 10) check = 0;
  if (check !== Number(cpf[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += Number(cpf[i]) * (11 - i);
  check = 11 - (sum % 11);
  if (check >= 10) check = 0;
  return check === Number(cpf[10]);
}

function isDate(value) {
  return typeof value === 'string' && /^\\d{4}-\\d{2}-\\d{2}$/.test(value);
}

function requireField(obj, field, path) {
  if (obj[field] === undefined || obj[field] === null || obj[field] === '') {
    addError(path + '.' + field, 'required', 'Campo obrigatorio ausente.');
  }
}

if (payload.atosCesdi === undefined) {
  item.validation.hasErrors = errors.length > 0;
  return items;
}

if (!Array.isArray(payload.atosCesdi)) {
  addError('atosCesdi', 'array', 'atosCesdi deve ser um array JSON.');
  item.validation.hasErrors = errors.length > 0;
  return items;
}

payload.atosCesdi.forEach((ato, index) => {
  const base = 'atosCesdi[' + index + ']';
  ['tipoAtoCesdi', 'data', 'livro', 'folha', 'partes'].forEach((field) => requireField(ato, field, base));

  if (ato.data !== undefined && !isDate(ato.data)) addError(base + '.data', 'date_format', 'Data deve estar em YYYY-MM-DD.');
  if (ato.dataCasamento !== undefined && ato.dataCasamento !== null && !isDate(ato.dataCasamento)) addError(base + '.dataCasamento', 'date_format', 'Data do casamento deve estar em YYYY-MM-DD.');
  if (['Separacao', 'DivorcioDireto'].includes(ato.tipoAtoCesdi)) {
    requireField(ato, 'dataCasamento', base);
    requireField(ato, 'regimeBens', base);
  }
  ['quantidadeFilhosMaiores', 'quantidadeFilhosMenores'].forEach((field) => {
    if (ato[field] !== undefined && (!Number.isInteger(Number(ato[field])) || Number(ato[field]) < 0)) {
      addError(base + '.' + field, 'integer_min_zero', field + ' deve ser inteiro maior ou igual a zero.');
    }
  });

  if (!Array.isArray(ato.partes) || ato.partes.length === 0) {
    addError(base + '.partes', 'required', 'Cada ato CESDI deve conter pelo menos uma parte.');
  } else {
    ato.partes.forEach((parte, parteIndex) => {
      const partPath = base + '.partes[' + parteIndex + ']';
      ['nome', 'qualidade', 'documentos'].forEach((field) => requireField(parte, field, partPath));
      if (['Separando', 'Divorciando'].includes(parte.qualidade)) requireField(parte, 'conjugeTipo', partPath);
      if (parte.dataNascimento !== undefined && parte.dataNascimento !== null && !isDate(parte.dataNascimento)) {
        addError(partPath + '.dataNascimento', 'date_format', 'Data de nascimento deve estar em YYYY-MM-DD.');
      }
      if (!Array.isArray(parte.documentos) || parte.documentos.length === 0) {
        addError(partPath + '.documentos', 'required', 'Cada parte deve conter pelo menos um documento.');
      } else {
        const hasPrimary = parte.documentos.some((documento) => documento.prioridade === 'Primario');
        if (!hasPrimary) addError(partPath + '.documentos', 'primary_document_required', 'Cada parte deve possuir documento com prioridade Primario.');
        parte.documentos.forEach((documento, docIndex) => {
          const docPath = partPath + '.documentos[' + docIndex + ']';
          ['documentoTipo', 'prioridade', 'documento'].forEach((field) => requireField(documento, field, docPath));
          if (['Cpf', 'CPF'].includes(String(documento.documentoTipo ?? '')) && !isCpf(documento.documento)) {
            addError(docPath + '.documento', 'cpf_invalid', 'documento deve ser CPF valido quando documentoTipo for CPF.');
          }
        });
      }
    });
  }
});

item.validation.hasErrors = errors.length > 0;
return items;
`,
    };

    @node({
        id: '28b05643-b716-4ffb-8834-fc5aae10c0cf',
        name: 'Validate CTP Declarations',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1100, 160],
    })
    ValidateCtpDeclarations = {
        mode: 'runOnceForAllItems',
        language: 'javaScript',
        jsCode: `
/** @typedef {{ scopeField?: string, scopeLabel?: string }} ValidateOptions */

const DOMAINS = {
  tipoDeclaracao: new Set(['0', '1', '3']),
  tipoServico: new Set(['1', '2', '3']),
  tipoAto: new Set(['1', '2', '3', '4', '5', '6']),
  tipoAtoByServico: {
    '1': new Set(['1', '2']),
    '2': new Set(['3', '4']),
    '3': new Set(['5', '6']),
  },
  tipoLivro: new Set(['1', '2']),
  naturezaTitulo: new Set(['1', '2', '3', '4', '5']),
  tipoOperacaoImobiliaria: new Set([
    '11', '13', '15', '19', '21', '31', '33', '35', '37', '39', '41', '45', '47',
    '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67',
    '68', '69', '70', '71', '72', '73', '74',
  ]),
  formaPagamento: new Set(['5', '7', '9', '10', '11']),
  tipoParteTransacionada: new Set(['1', '2']),
  destinacao: new Set(['1', '3']),
  motivoNaoIdentificacaoNi: new Set(['1', '2']),
  regimeBens: new Set(['1', '2', '3', '4']),
  tipoImovel: new Set(['15', '31', '65', '67', '69', '71', '89', '90', '91', '92', '93', '94', '95', '96']),
};

const FORMA_PAGAMENTO_ALIASES = {
  APrazo: '7',
  QuitadoAVista: '5',
  QuitadoAPrazo: '10',
  QuitadoSemInformacaoDaFormaDePagamento: '11',
  NaoSeAplica: '9',
};

const DESTINACAO_ALIASES = {
  Urbano: '1',
  Rural: '3',
};

const TIPO_SERVICO_ALIASES = {
  Notarial: '1',
  RegistroDeImoveis: '2',
  RegistroDeTitulosEDocumentos: '3',
};

function digits(value) {
  return String(value ?? '').replace(/\\D/g, '');
}

function isCpf(value) {
  const cpf = digits(value);
  if (!/^\\d{11}$/.test(cpf) || /^(\\d)\\1{10}$/.test(cpf)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += Number(cpf[i]) * (10 - i);
  let check = 11 - (sum % 11);
  if (check >= 10) check = 0;
  if (check !== Number(cpf[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += Number(cpf[i]) * (11 - i);
  check = 11 - (sum % 11);
  if (check >= 10) check = 0;
  return check === Number(cpf[10]);
}

function isCnpj(value) {
  const cnpj = digits(value);
  if (!/^\\d{14}$/.test(cnpj) || /^(\\d)\\1{13}$/.test(cnpj)) return false;
  const calc = (base, weights) => {
    const sum = weights.reduce((acc, weight, index) => acc + Number(base[index]) * weight, 0);
    const mod = sum % 11;
    return mod < 2 ? 0 : 11 - mod;
  };
  const d1 = calc(cnpj, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const d2 = calc(cnpj, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  return d1 === Number(cnpj[12]) && d2 === Number(cnpj[13]);
}

function isCpfOrCnpj(value) {
  const len = digits(value).length;
  if (len === 11) return isCpf(value);
  if (len === 14) return isCnpj(value);
  return false;
}

function isDate(value) {
  if (typeof value !== 'string' || !/^\\d{4}-\\d{2}-\\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function isEmpty(value) {
  return value === undefined || value === null || value === '';
}

function isBoolean(value) {
  return typeof value === 'boolean';
}

function normalizeTipoDeclaracao(value) {
  if (value === 'Original' || value === 0 || value === '0') return '0';
  if (value === 'Retificadora' || value === 1 || value === '1') return '1';
  if (value === 'Canceladora' || value === 3 || value === '3') return '3';
  return String(value ?? '');
}

function normalizeCodigo(value, aliases) {
  if (isEmpty(value)) return '';
  const raw = String(value);
  if (aliases[raw]) return aliases[raw];
  return raw;
}

function normalizeTipoServico(value) {
  return normalizeCodigo(value, TIPO_SERVICO_ALIASES);
}

function normalizeDestinacao(value) {
  return normalizeCodigo(value, DESTINACAO_ALIASES);
}

function normalizeFormaPagamento(value) {
  return normalizeCodigo(value, FORMA_PAGAMENTO_ALIASES);
}

function checkMaxLength(value, max, path, field, errors, scopeField, scopeLabel) {
  if (isEmpty(value)) return;
  if (String(value).length > max) {
    errors.push({
      [scopeField]: scopeLabel,
      path,
      code: 'max_length',
      message: \`\${field} excede tamanho maximo \${max}.\`,
    });
  }
}

/**
 * @param {unknown} payload
 * @param {ValidateOptions} [options]
 */
function validateDoiPayload(payload, options = {}) {
  const scopeField = options.scopeField || 'sistema';
  const scopeLabel = options.scopeLabel || 'DOI';
  const errors = [];
  const warnings = [];

  function addError(path, code, message) {
    errors.push({ [scopeField]: scopeLabel, path, code, message });
  }

  function addWarning(path, code, message) {
    warnings.push({ [scopeField]: scopeLabel, path, code, message });
  }

  function requireField(obj, field, path) {
    if (isEmpty(obj[field])) addError(path + '.' + field, 'required', 'Campo obrigatorio ausente.');
  }

  function requireBoolean(obj, field, path) {
    if (!isBoolean(obj[field])) addError(path + '.' + field, 'boolean', 'Campo booleano obrigatorio (true/false).');
  }

  function validateNi(value, path) {
    if (!isCpfOrCnpj(value)) {
      addError(path, 'ni_invalid', 'NI deve ser CPF (11 digitos) ou CNPJ (14 digitos) valido.');
    }
  }

  function checkDomain(field, value, domainSet, path) {
    if (isEmpty(value)) return;
    const code = String(value);
    if (!domainSet.has(code)) {
      addError(path, 'domain', \`Valor invalido para \${field}. Codigo "\${code}" fora do dominio.\`);
    }
  }

  if (payload === null || typeof payload !== 'object' || Array.isArray(payload)) {
    addError('payload', 'object', 'Payload deve ser um objeto JSON com declaracoes.');
    return { errors, warnings, hasErrors: true, declarationCount: 0 };
  }

  if (payload.declaracoes === undefined) {
    addError('declaracoes', 'required', 'Campo declaracoes e obrigatorio.');
    return { errors, warnings, hasErrors: true, declarationCount: 0 };
  }

  if (!Array.isArray(payload.declaracoes)) {
    addError('declaracoes', 'array', 'declaracoes deve ser um array JSON.');
    return { errors, warnings, hasErrors: true, declarationCount: 0 };
  }

  if (payload.declaracoes.length === 0) {
    addError('declaracoes', 'min_items', 'declaracoes deve conter ao menos uma declaracao.');
  }

  const today = todayIso();

  payload.declaracoes.forEach((declaracao, index) => {
    const base = 'declaracoes[' + index + ']';

    if (declaracao === null || typeof declaracao !== 'object' || Array.isArray(declaracao)) {
      addError(base, 'object', 'Cada declaracao deve ser um objeto JSON.');
      return;
    }

    [
      'tipoDeclaracao',
      'tipoServico',
      'dataLavraturaRegistroAverbacao',
      'tipoAto',
      'folha',
      'dataNegocioJuridico',
      'tipoOperacaoImobiliaria',
      'formaPagamento',
      'destinacao',
      'indicadorImovelPublicoUniao',
      'codigoIbge',
      'areaImovel',
      'tipoImovel',
      'tipoLogradouro',
      'nomeLogradouro',
      'numeroImovel',
      'bairro',
      'cep',
      'alienantes',
      'adquirentes',
    ].forEach((field) => requireField(declaracao, field, base));

    [
      'indicadorPermutaBens',
      'indicadorPagamentoDinheiro',
      'indicadorAreaLoteNaoConsta',
      'indicadorAreaConstruidaNaoConsta',
    ].forEach((field) => requireBoolean(declaracao, field, base));

    requireField(declaracao, 'tipoParteTransacionada', base);
    requireField(declaracao, 'valorParteTransacionada', base);

    const tipoDeclaracao = normalizeTipoDeclaracao(declaracao.tipoDeclaracao);
    if (!isEmpty(declaracao.tipoDeclaracao)) {
      checkDomain('tipoDeclaracao', tipoDeclaracao, DOMAINS.tipoDeclaracao, base + '.tipoDeclaracao');
      if (tipoDeclaracao !== '0') {
        addError(base + '.tipoDeclaracao', 'unsupported_batch_type', 'Somente declaracao Original (0) e importavel em lote.');
      }
    }

    const tipoServico = normalizeTipoServico(declaracao.tipoServico);
    checkDomain('tipoServico', tipoServico, DOMAINS.tipoServico, base + '.tipoServico');

    checkDomain('tipoAto', declaracao.tipoAto, DOMAINS.tipoAto, base + '.tipoAto');
    if (tipoServico && declaracao.tipoAto && DOMAINS.tipoAtoByServico[tipoServico]) {
      if (!DOMAINS.tipoAtoByServico[tipoServico].has(String(declaracao.tipoAto))) {
        addError(base + '.tipoAto', 'tipo_ato_servico', 'tipoAto incompativel com tipoServico ' + tipoServico + '.');
      }
    }

    if (tipoServico === '1' && !isEmpty(declaracao.numeroLivro)) {
      if (!/^\\d/.test(String(declaracao.numeroLivro))) {
        addError(base + '.numeroLivro', 'format', 'numeroLivro notarial deve comecar com digito.');
      }
      checkMaxLength(declaracao.numeroLivro, 7, base + '.numeroLivro', 'numeroLivro', errors, scopeField, scopeLabel);
    }

    if (tipoServico === '2') {
      requireField(declaracao, 'tipoLivro', base);
      requireField(declaracao, 'naturezaTitulo', base);
      requireBoolean(declaracao, 'existeDoiAnterior', base);
      checkDomain('tipoLivro', declaracao.tipoLivro, DOMAINS.tipoLivro, base + '.tipoLivro');
      checkDomain('naturezaTitulo', declaracao.naturezaTitulo, DOMAINS.naturezaTitulo, base + '.naturezaTitulo');
      const tipoLivro = String(declaracao.tipoLivro ?? '');
      if (tipoLivro === '1') {
        requireField(declaracao, 'numeroRegistroAverbacao', base);
        if (isEmpty(declaracao.matricula) && isEmpty(declaracao.codigoNacionalMatricula)) {
          addError(base + '.matricula', 'required', 'Informe matricula ou codigoNacionalMatricula quando RI e Lv.2-Matricula.');
        }
      }
      if (tipoLivro === '2') {
        requireField(declaracao, 'transcricao', base);
        if (isEmpty(declaracao.numeroLivro)) {
          addError(base + '.numeroLivro', 'required', 'numeroLivro obrigatorio quando RI e tipoLivro Transcricao.');
        }
      }
    }

    if (tipoServico === '3') {
      requireField(declaracao, 'numeroRegistro', base);
      checkMaxLength(declaracao.numeroRegistro, 30, base + '.numeroRegistro', 'numeroRegistro', errors, scopeField, scopeLabel);
    }

    if (!isEmpty(declaracao.matriculaNotarialEletronica) && tipoServico !== '1') {
      addWarning(base + '.matriculaNotarialEletronica', 'mne_servico', 'MNE costuma ser usada apenas com tipoServico Notarial (1).');
    }

    if (declaracao.dataLavraturaRegistroAverbacao !== undefined && !isDate(declaracao.dataLavraturaRegistroAverbacao)) {
      addError(base + '.dataLavraturaRegistroAverbacao', 'date_format', 'Data do ato deve estar em YYYY-MM-DD.');
    } else if (isDate(declaracao.dataLavraturaRegistroAverbacao) && declaracao.dataLavraturaRegistroAverbacao > today) {
      addError(base + '.dataLavraturaRegistroAverbacao', 'date_future', 'Data do ato nao pode ser maior que a data atual.');
    }

    if (declaracao.dataNegocioJuridico !== undefined && !isDate(declaracao.dataNegocioJuridico)) {
      addError(base + '.dataNegocioJuridico', 'date_format', 'dataNegocioJuridico deve estar em YYYY-MM-DD.');
    } else if (isDate(declaracao.dataNegocioJuridico) && declaracao.dataNegocioJuridico > today) {
      addError(base + '.dataNegocioJuridico', 'date_future', 'dataNegocioJuridico nao pode ser maior que a data atual.');
    }

    if (
      isDate(declaracao.dataLavraturaRegistroAverbacao) &&
      isDate(declaracao.dataNegocioJuridico) &&
      declaracao.dataNegocioJuridico > declaracao.dataLavraturaRegistroAverbacao
    ) {
      addError(base + '.dataNegocioJuridico', 'date_after_act', 'dataNegocioJuridico nao pode ser maior que dataLavraturaRegistroAverbacao.');
    }

    checkDomain('tipoOperacaoImobiliaria', declaracao.tipoOperacaoImobiliaria, DOMAINS.tipoOperacaoImobiliaria, base + '.tipoOperacaoImobiliaria');
    if (String(declaracao.tipoOperacaoImobiliaria) === '39') {
      requireField(declaracao, 'descricaoOutrasOperacoesImobiliarias', base);
      checkMaxLength(declaracao.descricaoOutrasOperacoesImobiliarias, 30, base + '.descricaoOutrasOperacoesImobiliarias', 'descricaoOutrasOperacoesImobiliarias', errors, scopeField, scopeLabel);
    }

    const forma = normalizeFormaPagamento(declaracao.formaPagamento);
    checkDomain('formaPagamento', forma, DOMAINS.formaPagamento, base + '.formaPagamento');
    checkDomain('tipoParteTransacionada', declaracao.tipoParteTransacionada, DOMAINS.tipoParteTransacionada, base + '.tipoParteTransacionada');

    const destinacao = normalizeDestinacao(declaracao.destinacao);
    checkDomain('destinacao', destinacao, DOMAINS.destinacao, base + '.destinacao');
    checkDomain('tipoImovel', declaracao.tipoImovel, DOMAINS.tipoImovel, base + '.tipoImovel');

    if (declaracao.indicadorNaoConstaValorOperacaoImobiliaria === true && declaracao.valorOperacaoImobiliaria !== undefined) {
      addError(base + '.valorOperacaoImobiliaria', 'must_omit', 'Nao enviar valorOperacaoImobiliaria quando indicadorNaoConstaValorOperacaoImobiliaria for true.');
    }
    if (declaracao.indicadorNaoConstaValorOperacaoImobiliaria !== true) {
      requireField(declaracao, 'valorOperacaoImobiliaria', base);
    }

    if (declaracao.indicadorNaoConstaValorBaseCalculoItbiItcmd === true && declaracao.valorBaseCalculoItbiItcmd !== undefined) {
      addError(base + '.valorBaseCalculoItbiItcmd', 'must_omit', 'Nao enviar valorBaseCalculoItbiItcmd quando indicadorNaoConstaValorBaseCalculoItbiItcmd for true.');
    }
    if (declaracao.indicadorNaoConstaValorBaseCalculoItbiItcmd !== true) {
      requireField(declaracao, 'valorBaseCalculoItbiItcmd', base);
    }

    if (forma === '7') {
      requireBoolean(declaracao, 'indicadorAlienacaoFiduciaria', base);
      requireField(declaracao, 'mesAnoUltimaParcela', base);
      requireField(declaracao, 'valorPagoAteDataAto', base);
      if (declaracao.mesAnoUltimaParcela !== undefined && !isDate(declaracao.mesAnoUltimaParcela)) {
        addError(base + '.mesAnoUltimaParcela', 'date_format', 'mesAnoUltimaParcela deve estar em YYYY-MM-DD.');
      }
    }

    if (declaracao.indicadorPagamentoDinheiro === true) {
      requireField(declaracao, 'valorPagoMoedaCorrenteDataAto', base);
    }

    if (declaracao.indicadorImovelPublicoUniao === true) {
      requireField(declaracao, 'registroImobiliarioPatrimonial', base);
      requireField(declaracao, 'certidaoAutorizacaoTransferencia', base);
      checkMaxLength(declaracao.registroImobiliarioPatrimonial, 13, base + '.registroImobiliarioPatrimonial', 'registroImobiliarioPatrimonial', errors, scopeField, scopeLabel);
      checkMaxLength(declaracao.certidaoAutorizacaoTransferencia, 11, base + '.certidaoAutorizacaoTransferencia', 'certidaoAutorizacaoTransferencia', errors, scopeField, scopeLabel);
    }

    if (destinacao === '1') {
      requireField(declaracao, 'inscricaoMunicipal', base);
      checkMaxLength(declaracao.inscricaoMunicipal, 45, base + '.inscricaoMunicipal', 'inscricaoMunicipal', errors, scopeField, scopeLabel);
      if (declaracao.indicadorAreaConstruidaNaoConsta !== true) {
        requireField(declaracao, 'areaConstruida', base);
      }
      if (declaracao.indicadorAreaLoteNaoConsta === true && declaracao.areaImovel !== undefined) {
        addWarning(base + '.areaImovel', 'area_mutual', 'areaImovel informada com indicadorAreaLoteNaoConsta true.');
      }
    }

    if (destinacao === '3') {
      ['codigoIncra', 'denominacao', 'localizacao'].forEach((field) => requireField(declaracao, field, base));
      checkMaxLength(declaracao.codigoIncra, 13, base + '.codigoIncra', 'codigoIncra', errors, scopeField, scopeLabel);
      checkMaxLength(declaracao.denominacao, 200, base + '.denominacao', 'denominacao', errors, scopeField, scopeLabel);
      checkMaxLength(declaracao.localizacao, 200, base + '.localizacao', 'localizacao', errors, scopeField, scopeLabel);
      if (declaracao.municipiosUF !== undefined && !Array.isArray(declaracao.municipiosUF)) {
        addError(base + '.municipiosUF', 'array', 'municipiosUF deve ser array de codigos IBGE.');
      }
    }

    if (isEmpty(declaracao.matricula) && isEmpty(declaracao.transcricao) && destinacao === '1') {
      addWarning(base + '.matricula', 'imovel_identificacao', 'Urbano sem matricula nem transcricao no bloco do imovel.');
    }

    if (declaracao.cib && !/^[A-Za-z0-9]{8}$/.test(String(declaracao.cib).replace(/-/g, ''))) {
      addError(base + '.cib', 'cib_format', 'CIB deve possuir 8 caracteres alfanumericos (sem hifen).');
    }

    if (declaracao.cep && !/^\\d{8}$/.test(digits(declaracao.cep))) {
      addError(base + '.cep', 'cep_format', 'CEP deve possuir 8 digitos.');
    }

    if (declaracao.codigoIbge && !/^\\d{7}$/.test(digits(declaracao.codigoIbge))) {
      addError(base + '.codigoIbge', 'ibge_format', 'codigoIbge deve possuir 7 digitos.');
    }

    checkMaxLength(declaracao.folha, 7, base + '.folha', 'folha', errors, scopeField, scopeLabel);
    checkMaxLength(declaracao.tipoLogradouro, 30, base + '.tipoLogradouro', 'tipoLogradouro', errors, scopeField, scopeLabel);
    checkMaxLength(declaracao.nomeLogradouro, 255, base + '.nomeLogradouro', 'nomeLogradouro', errors, scopeField, scopeLabel);
    checkMaxLength(declaracao.numeroImovel, 10, base + '.numeroImovel', 'numeroImovel', errors, scopeField, scopeLabel);
    checkMaxLength(declaracao.bairro, 150, base + '.bairro', 'bairro', errors, scopeField, scopeLabel);

    if (String(declaracao.tipoParteTransacionada) === '1' && declaracao.valorParteTransacionada !== undefined) {
      const pct = Number(declaracao.valorParteTransacionada);
      if (!Number.isFinite(pct) || pct <= 0 || pct > 100) {
        addError(base + '.valorParteTransacionada', 'percent_range', 'Percentual da parte transacionada deve ser > 0 e <= 100.');
      }
    }

    ['alienantes', 'adquirentes'].forEach((group) => {
      if (!Array.isArray(declaracao[group]) || declaracao[group].length === 0) {
        addError(base + '.' + group, 'required', group + ' deve ser array com pelo menos uma parte.');
        return;
      }

      let sum = 0;
      let hasMissingParticipationFlag = false;
      const seenNi = new Set();

      declaracao[group].forEach((parte, parteIndex) => {
        const partPath = base + '.' + group + '[' + parteIndex + ']';

        if (parte === null || typeof parte !== 'object' || Array.isArray(parte)) {
          addError(partPath, 'object', 'Cada parte deve ser um objeto JSON.');
          return;
        }

        [
          'indicadorNiIdentificado',
          'indicadorNaoConstaParticipacaoOperacao',
          'indicadorEstrangeiro',
          'indicadorEspolio',
          'indicadorConjuge',
          'indicadorRepresentante',
        ].forEach((field) => requireBoolean(parte, field, partPath));

        if (parte.indicadorNiIdentificado === true) {
          requireField(parte, 'ni', partPath);
          validateNi(parte.ni, partPath + '.ni');
          const niKey = digits(parte.ni);
          if (niKey && seenNi.has(niKey)) {
            addWarning(partPath + '.ni', 'ni_duplicate_group', 'NI repetido no mesmo grupo ' + group + '.');
          }
          if (niKey) seenNi.add(niKey);
        }

        if (parte.indicadorNiIdentificado === false) {
          requireField(parte, 'motivoNaoIdentificacaoNi', partPath);
          checkDomain('motivoNaoIdentificacaoNi', parte.motivoNaoIdentificacaoNi, DOMAINS.motivoNaoIdentificacaoNi, partPath + '.motivoNaoIdentificacaoNi');
        }

        if (parte.indicadorNaoConstaParticipacaoOperacao === true) {
          hasMissingParticipationFlag = true;
        } else if (!isEmpty(parte.participacao)) {
          sum += Number(parte.participacao);
        } else {
          addError(partPath + '.participacao', 'required', 'participacao e obrigatoria quando consta na operacao.');
        }

        if (parte.indicadorEspolio === true) {
          requireField(parte, 'cpfInventariante', partPath);
          if (parte.cpfInventariante && !isCpf(parte.cpfInventariante)) {
            addError(partPath + '.cpfInventariante', 'cpf_invalid', 'cpfInventariante deve ser CPF valido.');
          }
        }

        if (parte.indicadorConjuge === true) {
          requireField(parte, 'regimeBens', partPath);
          requireBoolean(parte, 'indicadorConjugeParticipa', partPath);
          checkDomain('regimeBens', parte.regimeBens, DOMAINS.regimeBens, partPath + '.regimeBens');
          if (parte.indicadorConjugeParticipa === true) {
            requireBoolean(parte, 'indicadorCpfConjugeIdentificado', partPath);
            if (parte.indicadorCpfConjugeIdentificado === true) {
              requireField(parte, 'cpfConjuge', partPath);
              if (parte.cpfConjuge && !isCpf(parte.cpfConjuge)) {
                addError(partPath + '.cpfConjuge', 'cpf_invalid', 'cpfConjuge deve ser CPF valido.');
              }
            }
          }
        }

        if (parte.indicadorRepresentante === true) {
          if (!Array.isArray(parte.representantes) || parte.representantes.length === 0) {
            addError(partPath + '.representantes', 'required', 'representantes e obrigatorio quando indicadorRepresentante for true.');
          } else {
            parte.representantes.forEach((representante, repIndex) => {
              const repBase = partPath + '.representantes[' + repIndex + ']';
              requireField(representante, 'ni', repBase);
              validateNi(representante.ni, repBase + '.ni');
            });
          }
        }
      });

      if (!hasMissingParticipationFlag && (sum < 99 || sum > 100)) {
        addError(base + '.' + group + '.participacao', 'participation_sum', 'A soma das participacoes de ' + group + ' deve ficar entre 99 e 100.');
      } else if (hasMissingParticipationFlag && sum > 0 && sum < 100) {
        addWarning(base + '.' + group + '.participacao', 'participation_sum_warning', 'Soma de participacao < 100% com indicador nao consta marcado.');
      }
    });
  });

  return {
    errors,
    warnings,
    hasErrors: errors.length > 0,
    declarationCount: Array.isArray(payload.declaracoes) ? payload.declaracoes.length : 0,
  };
}

const item = items[0].json;
const payload = item.payload ?? {};

if (payload.declaracoes === undefined) {
  item.validation.hasErrors = item.validation.errors.length > 0;
  return items;
}

const result = validateDoiPayload(payload, { scopeField: 'central', scopeLabel: 'CTP' });
item.validation.errors.push(...result.errors);
item.validation.warnings.push(...result.warnings);
item.validation.hasErrors = item.validation.errors.length > 0;
return items;
`,
    };

    @node({
        id: '12187d90-91aa-4739-bcca-1f8e18d10fc8',
        name: 'Has Validation Errors?',
        type: 'n8n-nodes-base.if',
        version: 2.3,
        position: [1380, 300],
    })
    HasValidationErrors = {
        conditions: {
            options: {
                caseSensitive: true,
                leftValue: '',
                typeValidation: 'strict',
                version: 2,
            },
            conditions: [
                {
                    id: 'has-validation-errors',
                    leftValue: '={{ $json.validation.hasErrors }}',
                    rightValue: true,
                    operator: {
                        type: 'boolean',
                        operation: 'true',
                        singleValue: true,
                    },
                },
            ],
            combinator: 'and',
        },
        looseTypeValidation: false,
        options: {},
    };

    @node({
        id: 'cce8b499-1d27-45a2-aa07-158f2396fedf',
        name: 'Build Validation Error Response',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1660, 160],
    })
    BuildValidationErrorResponse = {
        mode: 'runOnceForAllItems',
        language: 'javaScript',
        jsCode: `
const data = items[0].json;
return [{
  json: {
    statusCode: 400,
    response: {
      success: false,
      message: 'Payload rejeitado pela validacao local antes do envio para a CENSEC.',
      errors: data.validation.errors,
      warnings: data.validation.warnings,
      meta: data.meta,
    },
  },
}];
`,
    };

    @node({
        id: '0b819f48-a57f-4ab4-9385-b45b547c37bf',
        name: 'Upload JSON to CENSEC',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [1660, 460],
        onError: 'continueRegularOutput',
    })
    UploadJsonToCensec = {
        method: 'POST',
        url: 'https://censec.org.br/api/cargas/upload-json',
        authentication: 'none',
        sendHeaders: true,
        specifyHeaders: 'keypair',
        headerParameters: {
            parameters: [
                {
                    name: 'Content-Type',
                    value: 'application/json',
                },
                {
                    name: 'Accept',
                    value: 'application/json',
                },
                {
                    name: 'X-Api-Key',
                    value: '={{ $json.meta.headers["x-api-key"] || $json.meta.headers["X-Api-Key"] }}',
                },
            ],
        },
        sendBody: true,
        contentType: 'json',
        specifyBody: 'json',
        jsonBody: '={{ $json.payload }}',
        options: {},
    };

    @node({
        id: 'eaf1bc14-034b-4c5f-8aea-2ed3f8f9af49',
        name: 'Build Upload Response',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1940, 460],
    })
    BuildUploadResponse = {
        mode: 'runOnceForAllItems',
        language: 'javaScript',
        jsCode: `
const result = items[0].json;
const error = result.error;
const failed = Boolean(error);

function parseJsonSafe(value) {
  if (value === undefined || value === null) return null;
  if (typeof value === 'object') return value;
  if (typeof value !== 'string') return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function extractEmbeddedJson(message) {
  if (typeof message !== 'string') return null;

  const quotedJson = message.match(/^\\s*\\d{3}\\s*-\\s*"([\\s\\S]*)"\\s*$/);
  if (quotedJson) {
    return parseJsonSafe(quotedJson[1].replace(/\\\\"/g, '"'));
  }

  const start = message.indexOf('{');
  const end = message.lastIndexOf('}');
  if (start >= 0 && end > start) {
    return parseJsonSafe(message.slice(start, end + 1));
  }

  return null;
}

function normalizeHttpError(errorObject) {
  const rawMessage = errorObject?.message ?? 'Erro desconhecido ao chamar a CENSEC.';
  const status = Number(errorObject?.status ?? rawMessage.match(/^\\s*(\\d{3})\\s*-/)?.[1] ?? 502);
  const parsed = parseJsonSafe(errorObject?.response?.body)
    ?? parseJsonSafe(errorObject?.response?.data)
    ?? extractEmbeddedJson(rawMessage);

  return {
    statusCode: status || 502,
    error: {
      code: parsed?.code ?? errorObject?.code ?? 'CENSEC_HTTP_ERROR',
      message: parsed?.message ?? rawMessage,
      details: parsed?.details ?? null,
      httpStatus: status || null,
      source: 'CENSEC',
    },
    technical: {
      name: errorObject?.name ?? null,
      code: errorObject?.code ?? null,
      status: status || null,
    },
  };
}

if (!failed) {
  return [{
    json: {
      statusCode: 200,
      response: {
        success: true,
        message: 'Carga JSON enviada para a CENSEC.',
        censec: result,
      },
    },
  }];
}

const normalized = normalizeHttpError(error);

return [{
  json: {
    statusCode: normalized.statusCode,
    response: {
      success: false,
      message: normalized.error.message,
      error: normalized.error,
      technical: normalized.technical,
    },
  },
}];
`,
    };

    @node({
        id: '9d52dbe1-9602-4832-8f71-951f1ba6f67d',
        name: 'Return Validation Error',
        type: 'n8n-nodes-base.respondToWebhook',
        version: 1.5,
        position: [1940, 160],
    })
    ReturnValidationError = {
        respondWith: 'json',
        responseBody: '={{ $json.response }}',
        inputFieldName: 'data',
        redirectURL: '',
        options: {
            responseCode: 400,
        },
    };

    @node({
        id: '5bf209d9-02de-4827-8ea5-e47fbd20c8aa',
        name: 'Return Upload Response',
        type: 'n8n-nodes-base.respondToWebhook',
        version: 1.5,
        position: [2220, 460],
    })
    ReturnUploadResponse = {
        respondWith: 'json',
        responseBody: '={{ $json.response }}',
        inputFieldName: 'data',
        redirectURL: '',
        options: {
            responseCode: '={{ $json.statusCode || 200 }}',
        },
    };

    // =====================================================================
    // ROUTAGE ET CONNEXIONS
    // =====================================================================

    @links()
    defineRouting() {
        this.ReceiveCensecPayload.out(0).to(this.NormalizePayload.in(0));
        this.NormalizePayload.out(0).to(this.ValidateCepActs.in(0));
        this.ValidateCepActs.out(0).to(this.ValidateCesdiActs.in(0));
        this.ValidateCesdiActs.out(0).to(this.ValidateCtpDeclarations.in(0));
        this.ValidateCtpDeclarations.out(0).to(this.HasValidationErrors.in(0));
        this.HasValidationErrors.out(0).to(this.BuildValidationErrorResponse.in(0));
        this.HasValidationErrors.out(1).to(this.UploadJsonToCensec.in(0));
        this.BuildValidationErrorResponse.out(0).to(this.ReturnValidationError.in(0));
        this.UploadJsonToCensec.out(0).to(this.BuildUploadResponse.in(0));
        this.BuildUploadResponse.out(0).to(this.ReturnUploadResponse.in(0));
    }
}
