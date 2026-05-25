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
    id: '8ZVf9yiRyrL2cLGw',
    name: 'CENSEC Upload JSON Gateway',
    active: false,
    isArchived: false,
    settings: {
        executionOrder: 'v1',
        callerPolicy: 'workflowsFromSameOwner',
        availableInMCP: false,
        binaryMode: 'separate',
    },
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
const item = items[0].json;
const payload = item.payload ?? {};
const errors = item.validation.errors;
const warnings = item.validation.warnings;

function addError(path, code, message) {
  errors.push({ central: 'CTP', path, code, message });
}

function addWarning(path, code, message) {
  warnings.push({ central: 'CTP', path, code, message });
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

function isCpfOrCnpj(value) {
  const valueDigits = digits(value);
  if (valueDigits.length === 11) return isCpf(valueDigits);
  if (valueDigits.length === 14) return isCnpj(valueDigits);
  return false;
}

function isDate(value) {
  return typeof value === 'string' && /^\\d{4}-\\d{2}-\\d{2}$/.test(value);
}

function requireField(obj, field, path) {
  if (obj[field] === undefined || obj[field] === null || obj[field] === '') {
    addError(path + '.' + field, 'required', 'Campo obrigatorio ausente.');
  }
}

function validateNi(value, path) {
  if (!isCpfOrCnpj(value)) {
    addError(path, 'ni_invalid', 'NI deve ser CPF valido com 11 digitos ou CNPJ valido com 14 digitos.');
  }
}

if (payload.declaracoes === undefined) {
  item.validation.hasErrors = errors.length > 0;
  return items;
}

if (!Array.isArray(payload.declaracoes)) {
  addError('declaracoes', 'array', 'declaracoes deve ser um array JSON.');
  item.validation.hasErrors = errors.length > 0;
  return items;
}

payload.declaracoes.forEach((declaracao, index) => {
  const base = 'declaracoes[' + index + ']';
  [
    'tipoDeclaracao',
    'dataLavraturaRegistroAverbacao',
    'tipoAto',
    'dataNegocioJuridico',
    'tipoOperacaoImobiliaria',
    'formaPagamento',
    'indicadorPermutaBens',
    'indicadorPagamentoDinheiro',
    'tipoParteTransacionada',
    'valorParteTransacionada',
    'destinacao',
    'indicadorImovelPublicoUniao',
    'codigoIbge',
    'tipoImovel',
    'tipoLogradouro',
    'nomeLogradouro',
    'numeroImovel',
    'bairro',
    'cep',
    'alienantes',
    'adquirentes',
  ].forEach((field) => requireField(declaracao, field, base));

  if (declaracao.dataLavraturaRegistroAverbacao !== undefined && !isDate(declaracao.dataLavraturaRegistroAverbacao)) addError(base + '.dataLavraturaRegistroAverbacao', 'date_format', 'Data do ato deve estar em YYYY-MM-DD.');
  if (declaracao.dataNegocioJuridico !== undefined && !isDate(declaracao.dataNegocioJuridico)) addError(base + '.dataNegocioJuridico', 'date_format', 'Data do negocio juridico deve estar em YYYY-MM-DD.');
  if (isDate(declaracao.dataLavraturaRegistroAverbacao) && isDate(declaracao.dataNegocioJuridico) && declaracao.dataNegocioJuridico > declaracao.dataLavraturaRegistroAverbacao) {
    addError(base + '.dataNegocioJuridico', 'date_after_act', 'dataNegocioJuridico nao pode ser maior que dataLavraturaRegistroAverbacao.');
  }
  if (declaracao.tipoDeclaracao && declaracao.tipoDeclaracao !== 'Original' && declaracao.tipoDeclaracao !== '0') {
    addError(base + '.tipoDeclaracao', 'unsupported_batch_type', 'Somente declaracao Original e importavel em lote.');
  }
  if (declaracao.indicadorNaoConstaValorOperacaoImobiliaria === true && declaracao.valorOperacaoImobiliaria !== undefined) {
    addError(base + '.valorOperacaoImobiliaria', 'must_omit', 'Nao enviar valorOperacaoImobiliaria quando indicadorNaoConstaValorOperacaoImobiliaria for true.');
  }
  if (declaracao.indicadorNaoConstaValorOperacaoImobiliaria !== true) requireField(declaracao, 'valorOperacaoImobiliaria', base);
  if (declaracao.indicadorNaoConstaValorBaseCalculoItbiItcmd !== true) requireField(declaracao, 'valorBaseCalculoItbiItcmd', base);
  if (declaracao.formaPagamento === 'APrazo' || declaracao.formaPagamento === '7') {
    ['indicadorAlienacaoFiduciaria', 'mesAnoUltimaParcela', 'valorPagoAteDataAto'].forEach((field) => requireField(declaracao, field, base));
  }
  if (declaracao.indicadorPagamentoDinheiro === true) requireField(declaracao, 'valorPagoMoedaCorrenteDataAto', base);
  if (declaracao.indicadorImovelPublicoUniao === true) {
    ['registroImobiliarioPatrimonial', 'certidaoAutorizacaoTransferencia'].forEach((field) => requireField(declaracao, field, base));
  }
  if (declaracao.destinacao === 'Urbano' || declaracao.destinacao === '1') requireField(declaracao, 'inscricaoMunicipal', base);
  if (declaracao.destinacao === 'Rural' || declaracao.destinacao === '3') {
    ['codigoIncra', 'denominacao', 'localizacao'].forEach((field) => {
      if (!declaracao[field]) addWarning(base + '.' + field, 'rural_field_missing', 'Campo rural ausente; confirme se e exigido para esta operacao.');
    });
  }
  if (declaracao.cib && !/^[A-Za-z0-9]{8}$/.test(String(declaracao.cib).replace('-', ''))) {
    addError(base + '.cib', 'cib_format', 'CIB deve possuir 8 caracteres alfanumericos, sem hifen.');
  }
  if (declaracao.cep && !/^\\d{8}$/.test(digits(declaracao.cep))) addError(base + '.cep', 'cep_format', 'CEP deve possuir 8 digitos.');
  if (declaracao.codigoIbge && !/^\\d{7}$/.test(digits(declaracao.codigoIbge))) addError(base + '.codigoIbge', 'ibge_format', 'codigoIbge deve possuir 7 digitos.');

  ['alienantes', 'adquirentes'].forEach((group) => {
    if (!Array.isArray(declaracao[group]) || declaracao[group].length === 0) {
      addError(base + '.' + group, 'required', group + ' deve ser array com pelo menos uma parte.');
      return;
    }

    let sum = 0;
    let hasMissingParticipationFlag = false;

    declaracao[group].forEach((parte, parteIndex) => {
      const partPath = base + '.' + group + '[' + parteIndex + ']';
      [
        'indicadorNiIdentificado',
        'indicadorNaoConstaParticipacaoOperacao',
        'indicadorEstrangeiro',
        'indicadorEspolio',
        'indicadorConjuge',
        'indicadorRepresentante',
      ].forEach((field) => requireField(parte, field, partPath));

      if (parte.indicadorNiIdentificado === true) {
        requireField(parte, 'ni', partPath);
        validateNi(parte.ni, partPath + '.ni');
      }
      if (parte.indicadorNiIdentificado === false) requireField(parte, 'motivoNaoIdentificacaoNi', partPath);
      if (parte.indicadorNaoConstaParticipacaoOperacao === true) {
        hasMissingParticipationFlag = true;
      } else if (parte.participacao !== undefined && parte.participacao !== null && parte.participacao !== '') {
        sum += Number(parte.participacao);
      } else {
        addError(partPath + '.participacao', 'required', 'participacao e obrigatoria quando consta na operacao.');
      }
      if (parte.indicadorEspolio === true) {
        requireField(parte, 'cpfInventariante', partPath);
        if (parte.cpfInventariante && !isCpf(parte.cpfInventariante)) addError(partPath + '.cpfInventariante', 'cpf_invalid', 'cpfInventariante deve ser CPF valido.');
      }
      if (parte.indicadorConjuge === true) requireField(parte, 'regimeBens', partPath);
      if (parte.indicadorCpfConjugeIdentificado === true) {
        requireField(parte, 'cpfConjuge', partPath);
        if (parte.cpfConjuge && !isCpf(parte.cpfConjuge)) addError(partPath + '.cpfConjuge', 'cpf_invalid', 'cpfConjuge deve ser CPF valido.');
      }
      if (parte.indicadorRepresentante === true) {
        if (!Array.isArray(parte.representantes) || parte.representantes.length === 0) {
          addError(partPath + '.representantes', 'required', 'representantes e obrigatorio quando indicadorRepresentante for true.');
        } else {
          parte.representantes.forEach((representante, repIndex) => {
            const repPath = partPath + '.representantes[' + repIndex + '].ni';
            requireField(representante, 'ni', partPath + '.representantes[' + repIndex + ']');
            validateNi(representante.ni, repPath);
          });
        }
      }
    });

    if (!hasMissingParticipationFlag && (sum < 99 || sum > 100)) {
      addError(base + '.' + group + '.participacao', 'participation_sum', 'A soma das participacoes deve ficar entre 99 e 100.');
    }
  });
});

item.validation.hasErrors = errors.length > 0;
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
