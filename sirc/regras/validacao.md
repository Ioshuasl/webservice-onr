# Regras de Validacao

Fonte: capitulo 4 do `manual sirc.md`.

## Regras Comuns

### Nomes

Regras aceitas:

- Deve conter ao menos uma palavra.
- Deve conter letras, com suporte a acentuacao, cedilha e sinais ortograficos usuais.
- Pode conter palavras de uma letra.
- Apostrofo e hifen sao aceitos quando estiverem entre letras.
- Letras repetidas duas vezes sao aceitas.
- Mais de um espaco entre palavras pode ser ajustado automaticamente pelo sistema.

Regras especiais exigem confirmacao por indicador de nome especial. O manual lista palavras como `falecido`, `ignorado`, `inexistente`, `judicial`, `natimorto`, `teste` e outras como exemplos de palavras sensiveis.

Regras invalidas:

- Algarismos arabicos em nomes.
- Caracteres fora das regras aceitas.
- Abreviaturas compostas por uma letra seguida de ponto, como `Jr.`
- Apostrofo no inicio do nome ou apos espaco.

### Matricula

A matricula deve ser numerica e composta por 32 digitos:

- Identificador da serventia: 5 digitos + 1 DV modulo 10.
- Acervo: 2 digitos.
- Tipo de servico: 2 digitos, valor previsto `55`.
- Ano do registro: 4 digitos.
- Tipo do livro: 1 digito.
- Numero do livro: 5 digitos.
- Numero da folha: 3 digitos.
- Numero do termo: 7 digitos.
- DV da matricula: 2 digitos, modulo 11 conforme CNJ.

### Documentos

- CPF: modulo 11.
- NIT: modulo 11.
- Titulo de eleitor: regras da Justica Eleitoral.

### Tabelas Externas

- Profissao: tabela CBOCNIS, com valores especiais `-1` para sem profissao remunerada e `-2` para outras.
- Nacionalidade e pais: tabela SDC TB0085.
- Impresso de seguranca: 11 caracteres no formato `AAnnnnnnnnn`.

## Nascimento

- Data de nascimento: menor ou igual a data atual, formato `dd/mm/aaaa`.
- Hora: formato `hh:mm`.
- Municipio: codigo de municipio compativel com IBGE/SDC.
- Data do registro: maior ou igual a data de nascimento e menor ou igual a data atual.
- Local de nascimento: dominio enumerado.
- DNV: validar conforme [`validacao-dnv.md`](./validacao-dnv.md).
- Sexo: `MASCULINO`, `FEMININO`, `NAO_BINARIO`, `OUTROS`, `NAO_DECLARADO` ou `IGNORADO`.
- Genero: texto livre com ate 100 caracteres.
- Municipio de naturalidade em texto nao deve ser usado junto com codigo IBGE de naturalidade.

## Obito

- Data de nascimento do falecido: menor ou igual a data do obito, data de lavratura e data atual.
- Data de lavratura do obito: maior ou igual a data do obito e nascimento, menor ou igual a data atual.
- Data do obito: maior ou igual a data de nascimento, menor ou igual a lavratura e data atual.
- Numero do beneficio do INSS: 10 digitos com DV modulo 11.
- Cor: dominio de cor do IBGE.
- Estado civil: TB0400 / 34, exceto `Uniao Estavel`.
- Tipo de morte: dominio natural ou acidental.
- DO: validar conforme [`validacao-do.md`](./validacao-do.md).
- Tipo do local de falecimento: hospital, outros servicos de saude, domicilio, via publica ou outros.
- Sexo: `MASCULINO`, `FEMININO`, `NAO_BINARIO`, `OUTROS`, `NAO_DECLARADO` ou `IGNORADO`.
- Genero: texto livre com ate 100 caracteres.

## Casamento

- Data dos proclamas: menor que a data de registro do casamento.
- Data de celebracao: menor ou igual a data de registro.
- Data de registro: menor ou igual a data atual.
- Regime de casamento: dominio de regime de casamento.
- Data da escritura antenupcial: menor que a data de registro.
- Data da dissolucao do casamento anterior: menor que a celebracao e menor que o registro.
- Data de nascimento do conjuge: menor que a celebracao e menor que a data atual.
- Data de nascimento da filiacao do conjuge: menor que a celebracao e menor que a data atual.
- Data de falecimento da filiacao do conjuge: menor ou igual a data de registro.
- Sexo: dominio aplicavel aos conjuges.
- Genero: texto livre com ate 100 caracteres.

## Registro Civil Efetuado no Exterior

- CNS do consulado: 5 digitos + 1 DV modulo 10.
- Regras complementares em [`negocio.md`](./negocio.md#registro-civil-efetuado-no-exterior).

## Transferencia de Arquivo

- Formato XML valido contra XSD disponibilizado pela Dataprev.
- Codificacao UTF-8.
- Tamanho maximo: 1024 KB.
- Quantidade maxima: 250 registros.
- Intervalo minimo entre submissoes: 1 minuto.
- Compactacao GZIP.
- Criptografia AES com chave baseada no MD5 do codigo CNS da serventia.
- Extensao `.mrc`.

## Cancelamento de Termos

- Motivo: minimo 15 e maximo 350 caracteres.
- Tipo de registro civil: `NASCIMENTO`, `CASAMENTO` ou `OBITO`.
- Identificador da serventia: 5 digitos + 1 DV modulo 10.
- Acervo: 2 digitos.
- Tipo de servico: valor `55`.
- Termo: 7 digitos.
- Tipo do livro: 1 digito.
- Ano do registro: 4 digitos.
- Numero da folha: 3 digitos.
- Numero do livro: 5 digitos.

