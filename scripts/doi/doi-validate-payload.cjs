/**
 * Validacao local de payload DOI-Web (importacao JSON).
 *
 * Fonte de verdade (Obsidian):
 *   Orius/integracoes/tabelionato-notas/doi/campos-json/
 *   Orius/integracoes/tabelionato-notas/doi/tabelas-dominio/
 *   Orius/integracoes/tabelionato-notas/doi/regras-validacao/
 *
 * A validacao CTP embarcada no gateway CENSEC e legado/incompleta; use este modulo.
 *
 * Uso:
 *   node scripts/doi/doi-validate-payload.cjs caminho/arquivo.json
 */

'use strict';

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
  return String(value ?? '').replace(/\D/g, '');
}

function isCpf(value) {
  const cpf = digits(value);
  if (!/^\d{11}$/.test(cpf) || /^(\d)\1{10}$/.test(cpf)) return false;
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
  if (!/^\d{14}$/.test(cnpj) || /^(\d)\1{13}$/.test(cnpj)) return false;
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
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
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
      message: `${field} excede tamanho maximo ${max}.`,
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
      addError(path, 'domain', `Valor invalido para ${field}. Codigo "${code}" fora do dominio.`);
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
      if (!/^\d/.test(String(declaracao.numeroLivro))) {
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

    if (declaracao.cep && !/^\d{8}$/.test(digits(declaracao.cep))) {
      addError(base + '.cep', 'cep_format', 'CEP deve possuir 8 digitos.');
    }

    if (declaracao.codigoIbge && !/^\d{7}$/.test(digits(declaracao.codigoIbge))) {
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

module.exports = { validateDoiPayload, DOMAINS };

if (require.main === module) {
  const fs = require('fs');
  const path = process.argv[2];
  if (!path) {
    console.error('Uso: node scripts/doi/doi-validate-payload.cjs <arquivo.json>');
    process.exit(1);
  }
  const payload = JSON.parse(fs.readFileSync(path, 'utf8'));
  const result = validateDoiPayload(payload);
  console.log(JSON.stringify(result, null, 2));
  process.exit(result.hasErrors ? 1 : 0);
}
