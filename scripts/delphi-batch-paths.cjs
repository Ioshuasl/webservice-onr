/**
 * Perfis batch Delphi legado — um JSON por produto em scripts/.
 */
const path = require('path');

const ROOT = path.join(__dirname);
const CODE_ROOT = 'C:\\Users\\kenio\\sistema-delphi';
const VAULT_ROOT = 'C:\\Users\\kenio\\Obsidian Vault';

/** @type {Record<string, {
 *   product_slug: string,
 *   product_path: string,
 *   batch_file: string,
 *   vault_hub: string,
 *   produto_vault: string,
 * }>} */
const DELPHI_PRODUCTS = {
  imoveis: {
    product_slug: 'imoveis',
    product_path: 'RegistroDeImoveis',
    batch_file: path.join(ROOT, 'delphi-imoveis-batch-state.json'),
    vault_hub: 'Orius/desenvolvimento/legado-delphi/produtos/imoveis',
    produto_vault: 'registro-imoveis',
  },
  civil: {
    product_slug: 'civil',
    product_path: 'RegistroCivil',
    batch_file: path.join(ROOT, 'delphi-civil-batch-state.json'),
    vault_hub: 'Orius/desenvolvimento/legado-delphi/produtos/civil',
    produto_vault: 'registro-civil',
  },
  protesto: {
    product_slug: 'protesto',
    product_path: 'TabelionatoDeProtesto',
    batch_file: path.join(ROOT, 'delphi-protesto-batch-state.json'),
    vault_hub: 'Orius/desenvolvimento/legado-delphi/produtos/protesto',
    produto_vault: 'protesto',
  },
  rtd: {
    product_slug: 'rtd',
    product_path: 'RegistroDeTitulosEDocumentos',
    batch_file: path.join(ROOT, 'delphi-rtd-batch-state.json'),
    vault_hub: 'Orius/desenvolvimento/legado-delphi/produtos/rtd',
    produto_vault: 'rtd',
  },
  caixa: {
    product_slug: 'caixa',
    product_path: 'Caixa',
    batch_file: path.join(ROOT, 'delphi-caixa-batch-state.json'),
    vault_hub: 'Orius/desenvolvimento/legado-delphi/produtos/caixa',
    produto_vault: 'caixa',
  },
};

const VENDOR_UNIT_PATTERNS = [
  /^GifImage$/i,
  /^frx/i,
  /^gte/i,
  /^WPT/i,
  /^cx/i,
];

module.exports = {
  CODE_ROOT,
  VAULT_ROOT,
  DELPHI_PRODUCTS,
  VENDOR_UNIT_PATTERNS,
};
