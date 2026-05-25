# Regras de Negocio

Fonte: capitulo 5 do `manual sirc.md`.

## Registro Civil

- Endereco: preencher somente endereco nacional ou endereco estrangeiro.
- Filiacao: quando os dados de filiacao nao forem ignorados, ao menos nome e sexo devem estar preenchidos.
- Campo ignorado: quando o campo nao estiver informado, o marcador de ignorado deve ser informado; quando o campo estiver preenchido, o marcador nao deve estar informado.
- Nacionalidade: se o pais de nascimento for diferente de Brasil, municipio e UF de nascimento nao devem ser informados nem ignorados. Se o pais for Brasil, municipio e UF devem ser informados.
- Termo: nao devem existir termos iguais para a mesma serventia, acervo, tipo de registro civil e tipo do livro, salvo quando livro/folha permitirem matriculas distintas.
- Municipio: quando houver codigo IBGE e campo livre, os dois nao podem ser preenchidos simultaneamente. Quando municipio for ignorado, nenhum outro campo referente ao municipio deve ser preenchido.

## Documentos

Estruturas por tipo:

- Carteira de Maritimo: digitos do documento + data de emissao.
- Certidao de Casamento: matricula da certidao.
- Certidao de Nascimento: matricula da certidao.
- Certidao de Reservista: digitos do documento.
- CNH: digitos do documento + data da primeira habilitacao.
- CPF: digitos do documento.
- CTPS: digitos + serie + UF de emissao + data de emissao.
- Identidades estrangeiras aceitas por tratados: digitos + texto livre do tipo.
- Outros: digitos + texto livre do tipo.
- Passaporte: digitos + serie + data de emissao.
- RG / carteira de identificacao profissional: digitos + orgao emissor + UF + data de emissao opcional.
- RIC: digitos.
- RNE: digitos.
- Titulo de eleitor: digitos + data de emissao opcional.

## Nascimento

- DNV e local de nascimento: informar numero da DNV ou declarar inexistencia; nunca preencher DNV e marcador de inexistencia simultaneamente.
- Nome do nascido nao pode ser ignorado.
- Nomes da filiacao podem ser ignorados.
- Nomes dos progenitores podem ser nulos.
- Gemeos: quando houver indicador de gemeos, quantidade de irmaos gemeos e obrigatoria; quando nao houver gemeos, quantidade nao deve ser preenchida.
- Hora de nascimento, CPF, data de nascimento e local de nascimento seguem a regra de preenchimento exclusiva entre valor e marcador de ignorado.
- Municipio de naturalidade em texto deve ser usado somente quando nao houver codigo IBGE.

## Casamento

- Endereco: preencher somente endereco nacional ou endereco estrangeiro.
- Os campos de conjuges e filiacao seguem as regras comuns de documentos, municipio, nacionalidade e campos ignorados.

## Obito

- Finado desconhecido: o assento deve conter dados que auxiliem reconhecimento futuro quando possivel.
- Assento posterior ao enterro: seguem exigencias legais citadas no manual.
- Cremacao: depende de manifestacao de vontade ou interesse de saude publica e atestado conforme regra legal.
- Idade do falecido: se a data de nascimento for informada, a idade e calculada automaticamente; se a data for desconhecida, a idade pode ser informada manualmente.
- Natimorto: para falecido natimorto, o tipo do livro na matricula deve ser `5`.

## Registro Civil Efetuado no Exterior

Campos complementares:

- Orgao emissor do documento original.
- CNS do consulado.
- Informacoes complementares sobre o consulado.

Particularidades:

- Nascimento no exterior nao permite UF/municipio de nascimento do registrado, local de nascimento nem DNV.
- Nascimento no exterior permite pais de nascimento e nacionalidade.
- Obito no exterior nao permite DO nem endereco brasileiro do local de falecimento.
- Obito no exterior permite pais de falecimento.
- Casamento no exterior inclui opcao `Outros` em regime de casamento, documento dos conjuges e pais de celebracao.
- Registros civis do exterior nao possuem campos obrigatorios alem da dinamica equivalente aos registros judiciais.

## Cancelamento de Termos

Uso restrito a termos nao utilizados para registro civil ou cancelados no livro pela serventia.

Campos obrigatorios:

- Motivo.
- Tipo de registro civil.
- Codigo da serventia.
- Acervo.
- Tipo de servico.
- Numero do termo.
- Tipo do livro.
- Ano do registro.
- Numero da folha.
- Numero do livro.

Data de envio para CER e opcional.

O termo cancelado e unico para serventia, acervo e tipo de livro; quando cancelado, nao sera permitido registro de outra matricula com esses mesmos campos.

### Cancelamento de um Termo Existente

- O registro civil cuja matricula sera cancelada deve estar excluido no sistema.
- A matricula nao pode estar cancelada previamente.

### Cancelamento de um Termo Inexistente

- A matricula nao deve existir no sistema.

## Declaracao de Inexistencia

Tipos passiveis de declaracao:

- Nascimento, livro 1.
- Casamento, livros 2 e 3.
- Obito, livro 4.
- Natimorto, livro 5.

Observacoes:

- E dispensado o envio de declaracao de inexistencia para livro 7.
- E obrigatorio declarar inexistencia de movimento para natimorto, livro 5, a partir da competencia 07/2019.

