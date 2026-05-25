# Tabelas de Dominio

Fonte: capitulos 4, 5 e anexos 11.1, 11.6, 11.7 e 11.8 do `manual sirc.md`.

## Fontes Externas

- UF: tabela IBGE de unidades da federacao.
- Municipios: tabela IBGE, codigo com 7 digitos.
- Pais e nacionalidade: SDC TB0085.
- Profissoes: CBOCNIS, versao ampliada da CBO.

## Valores Especiais de Profissao

- `-1`: sem profissao remunerada.
- `-2`: outras.

## Sexo

Valores citados no XSD:

```text
MASCULINO
FEMININO
NAO_BINARIO
OUTROS
NAO_DECLARADO
IGNORADO
```

## Regime de Casamento

Valores citados no XSD:

```text
COMUNHAO_PARCIAL
COMUNHAO_UNIVERSAL
PARTICIPACAO_FINAL_AQUESTOS
SEPARACAO_BENS
OUTROS
COMUNHAO_GERAL
REGIME_HIBRIDO
PARTICIPACAO_FINAL_AQUESTROS
```

Observacao: o manual convertido preserva duas grafias proximas para participacao final nos aquestos/aquestros; confira o XSD vigente antes de validar por enum estrita.

## Tipo de Documento Civil

Valores citados no XSD:

```text
CPF
RIC
RG
RNE
CNH
CTPS
TITULO_ELEITOR
NIT
CARTEIRA_DE_MARITIMO
DOC_ESTRANGEIRO
CERT_DE_NASCIMENTO
CERT_DE_CASAMENTO
CERT_DE_RESERVISTA
NAO_IDENTIFICADO
```

## Cancelamento

Tipo de registro civil:

```text
NASCIMENTO
CASAMENTO
OBITO
```

## Obito

O manual cita dominios para:

- Cor do IBGE: branca, preta, amarela, parda ou indigena.
- Estado civil: SDC TB0400 / 34, exceto Uniao Estavel.
- Tipo de morte: natural ou acidental.
- Tipo do local de falecimento: hospital, outros servicos de saude, domicilio, via publica ou outros.

