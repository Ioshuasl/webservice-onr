# Regras de Validacao CTP

```json
{
  "escopo": {
    "central": "CTP",
    "payload": "JSON",
    "blocoPrincipal": "declaracoes",
    "fontes": [
      "censec/CTP.md",
      "censec/DOI.md",
      "censec/exemplo-censec-json.json"
    ]
  },
  "payload": {
    "camposObrigatorios": [
      "cns",
      "quinzena",
      "declaracoes"
    ],
    "regras": [
      {
        "id": "payload-declaracoes-array",
        "campo": "declaracoes",
        "validacao": "Deve ser um array JSON quando houver carga CTP."
      },
      {
        "id": "payload-ignorar-outras-centrais",
        "campo": "atosCep|atosCesdi|testamentos",
        "validacao": "Nao fazem parte das regras CTP e nao devem ser considerados nesta validacao."
      },
      {
        "id": "payload-json-valido",
        "validacao": "Erros estruturais de JSON, como virgulas, chaves ou tipos incorretos, rejeitam o arquivo todo."
      }
    ]
  },
  "quinzena": {
    "camposObrigatorios": [
      "anoReferencia",
      "mesReferencia",
      "quinzenaReferencia"
    ]
  },
  "declaracao": {
    "camposObrigatorios": [
      "tipoDeclaracao",
      "tipoServico",
      "dataLavraturaRegistroAverbacao",
      "tipoAto",
      "folha",
      "dataNegocioJuridico",
      "tipoOperacaoImobiliaria",
      "formaPagamento",
      "indicadorPermutaBens",
      "indicadorPagamentoDinheiro",
      "tipoParteTransacionada",
      "valorParteTransacionada",
      "cib",
      "destinacao",
      "indicadorImovelPublicoUniao",
      "codigoIbge",
      "areaImovel",
      "indicadorAreaLoteNaoConsta",
      "indicadorAreaConstruidaNaoConsta",
      "tipoImovel",
      "tipoLogradouro",
      "nomeLogradouro",
      "numeroImovel",
      "bairro",
      "cep",
      "alienantes",
      "adquirentes"
    ],
    "formatos": {
      "dataLavraturaRegistroAverbacao": "YYYY-MM-DD",
      "dataNegocioJuridico": "YYYY-MM-DD",
      "mesAnoUltimaParcela": "YYYY-MM-DD",
      "alienantes": "array",
      "adquirentes": "array",
      "municipiosUF": "array",
      "representantes": "array",
      "booleanos": "true|false",
      "valoresMonetarios": "number",
      "cep": "string com 8 digitos",
      "codigoIbge": "string com 7 digitos",
      "cib": "string com 8 caracteres",
      "matriculaNotarialEletronica": "string sem pontos ou tracos",
      "codigoNacionalMatricula": "string sem pontos ou tracos"
    }
  },
  "dadosIniciais": {
    "regras": [
      {
        "id": "tipo-declaracao-lote",
        "campo": "tipoDeclaracao",
        "validacao": "Para importacao em lote, deve ser Original; retificadoras e canceladoras nao sao importadas via lote conforme DOI.md."
      },
      {
        "id": "tipo-livro-registro-imoveis",
        "campo": "tipoLivro",
        "condicao": {
          "tipoServico": "RegistroDeImoveis"
        },
        "validacao": "Obrigatorio quando tipoServico for Registro de Imoveis."
      },
      {
        "id": "numero-livro-notarial",
        "campo": "numeroLivro",
        "condicao": {
          "tipoServico": "Notarial"
        },
        "validacao": "Quando informado para servico notarial, deve comecar com numero."
      },
      {
        "id": "matricula-registro-imoveis",
        "campo": "matricula",
        "condicao": {
          "tipoServico": "RegistroDeImoveis",
          "tipoLivro": "Matricula"
        },
        "validacao": "Obrigatoria se tipoLivro for Matricula, salvo quando codigoNacionalMatricula estiver preenchido."
      },
      {
        "id": "transcricao-registro-imoveis",
        "campo": "transcricao",
        "condicao": {
          "tipoLivro": "TranscricaoDasTransmissoes"
        },
        "validacao": "Obrigatoria quando tipoLivro for Transcricao das Transmissoes."
      },
      {
        "id": "numero-registro-averbacao",
        "campo": "numeroRegistroAverbacao",
        "condicao": {
          "tipoServico": "RegistroDeImoveis",
          "tipoLivro": "Matricula"
        },
        "validacao": "Obrigatorio para Registro de Imoveis com tipoLivro Matricula."
      },
      {
        "id": "natureza-titulo",
        "campo": "naturezaTitulo",
        "condicao": {
          "tipoServico": "RegistroDeImoveis"
        },
        "validacao": "Obrigatoria quando tipoServico for Registro de Imoveis."
      },
      {
        "id": "numero-registro-rtd",
        "campo": "numeroRegistro",
        "condicao": {
          "tipoServico": "RegistroDeTitulosEDocumentos"
        },
        "validacao": "Obrigatorio quando tipoServico for Registro de Titulos e Documentos."
      },
      {
        "id": "existe-doi-anterior",
        "campo": "existeDoiAnterior",
        "condicao": {
          "tipoServico": "RegistroDeImoveis"
        },
        "validacao": "Obrigatorio quando tipoServico for Registro de Imoveis."
      }
    ]
  },
  "operacaoImobiliaria": {
    "regras": [
      {
        "id": "descricao-outras-operacoes",
        "campo": "descricaoOutrasOperacoesImobiliarias",
        "condicao": {
          "tipoOperacaoImobiliaria": "Outras"
        },
        "validacao": "Obrigatoria quando tipoOperacaoImobiliaria for Outras."
      },
      {
        "id": "valor-operacao-obrigatorio",
        "campo": "valorOperacaoImobiliaria",
        "condicao": {
          "indicadorNaoConstaValorOperacaoImobiliaria": false
        },
        "validacao": "Obrigatorio quando o valor constar nos documentos."
      },
      {
        "id": "valor-operacao-nao-enviar",
        "campo": "valorOperacaoImobiliaria",
        "condicao": {
          "indicadorNaoConstaValorOperacaoImobiliaria": true
        },
        "validacao": "Nao enviar quando indicadorNaoConstaValorOperacaoImobiliaria for true."
      },
      {
        "id": "valor-base-calculo-obrigatorio",
        "campo": "valorBaseCalculoItbiItcmd",
        "condicao": {
          "indicadorNaoConstaValorBaseCalculoItbiItcmd": false
        },
        "validacao": "Obrigatorio quando o valor base ITBI/ITCMD constar nos documentos."
      },
      {
        "id": "forma-pagamento-a-prazo",
        "campos": [
          "indicadorAlienacaoFiduciaria",
          "mesAnoUltimaParcela",
          "valorPagoAteDataAto"
        ],
        "condicao": {
          "formaPagamento": "APrazo"
        },
        "validacao": "Obrigatorios quando a forma de pagamento for A prazo."
      },
      {
        "id": "pagamento-dinheiro",
        "campo": "valorPagoMoedaCorrenteDataAto",
        "condicao": {
          "indicadorPagamentoDinheiro": true
        },
        "validacao": "Obrigatorio quando houve pagamento em especie."
      },
      {
        "id": "data-negocio-nao-futura",
        "campo": "dataNegocioJuridico",
        "validacao": "Nao pode ser maior que a data atual nem maior que dataLavraturaRegistroAverbacao."
      },
      {
        "id": "valor-parte-transacionada",
        "campo": "valorParteTransacionada",
        "validacao": "Deve representar percentual ou area conforme tipoParteTransacionada."
      }
    ]
  },
  "dadosImovel": {
    "regras": [
      {
        "id": "cib-digito-verificador",
        "campo": "cib",
        "validacao": "Deve possuir 8 caracteres e ser validado por digito verificador conforme algoritmo do DOI.md."
      },
      {
        "id": "imovel-publico-uniao",
        "campos": [
          "registroImobiliarioPatrimonial",
          "certidaoAutorizacaoTransferencia"
        ],
        "condicao": {
          "indicadorImovelPublicoUniao": true
        },
        "validacao": "Obrigatorios quando o imovel for publico da Uniao."
      },
      {
        "id": "matricula-ou-transcricao",
        "campos": [
          "matricula",
          "transcricao"
        ],
        "validacao": "Informar matricula se transcricao nao for informada; informar transcricao se matricula nao for informada."
      },
      {
        "id": "imovel-urbano-inscricao-municipal",
        "campo": "inscricaoMunicipal",
        "condicao": {
          "destinacao": "Urbano"
        },
        "validacao": "Obrigatoria para imovel urbano."
      },
      {
        "id": "imovel-rural-campos",
        "campos": [
          "codigoIncra",
          "denominacao",
          "localizacao"
        ],
        "condicao": {
          "destinacao": "Rural"
        },
        "validacao": "Obrigatorios ou exigiveis para imovel rural conforme disponibilidade e regra de origem."
      },
      {
        "id": "area-imovel",
        "campo": "areaImovel",
        "validacao": "Obrigatoria, salvo se a regra da API aceitar indicadorAreaLoteNaoConsta como justificativa."
      },
      {
        "id": "area-construida-urbano",
        "campo": "areaConstruida",
        "condicao": {
          "destinacao": "Urbano",
          "indicadorAreaConstruidaNaoConsta": false
        },
        "validacao": "Obrigatoria para imovel urbano quando a area construida constar."
      },
      {
        "id": "municipios-uf-multimunicipio",
        "campo": "municipiosUF",
        "validacao": "Informar lista de codigos IBGE quando o imovel se localizar em mais de um municipio."
      }
    ]
  },
  "partes": {
    "grupos": [
      "alienantes",
      "adquirentes"
    ],
    "camposObrigatorios": [
      "indicadorNiIdentificado",
      "participacao",
      "indicadorNaoConstaParticipacaoOperacao",
      "indicadorEstrangeiro",
      "indicadorEspolio",
      "indicadorConjuge",
      "indicadorRepresentante"
    ],
    "regras": [
      {
        "id": "partes-minimo",
        "campos": [
          "alienantes",
          "adquirentes"
        ],
        "validacao": "Cada declaracao deve possuir alienantes e adquirentes como arrays."
      },
      {
        "id": "ni-identificado",
        "campo": "ni",
        "aplicavelEm": [
          "alienantes[]",
          "adquirentes[]"
        ],
        "condicao": {
          "indicadorNiIdentificado": true
        },
        "validacao": "Obrigatorio quando o CPF/CNPJ constar no documento. Em alienantes[] e adquirentes[], ni deve ser CPF com 11 digitos ou CNPJ com 14 digitos e digito verificador valido."
      },
      {
        "id": "motivo-ni-nao-identificado",
        "campo": "motivoNaoIdentificacaoNi",
        "condicao": {
          "indicadorNiIdentificado": false
        },
        "validacao": "Obrigatorio quando indicadorNiIdentificado for false."
      },
      {
        "id": "participacao-soma",
        "campo": "participacao",
        "validacao": "A soma das participacoes de alienantes ou adquirentes deve ficar entre 99 e 100, exceto quando indicadorNaoConstaParticipacaoOperacao justificar a ausencia."
      },
      {
        "id": "espolio",
        "campo": "cpfInventariante",
        "condicao": {
          "indicadorEspolio": true
        },
        "validacao": "Obrigatorio quando a parte for espolio."
      },
      {
        "id": "conjuge",
        "campo": "regimeBens",
        "condicao": {
          "indicadorConjuge": true
        },
        "validacao": "Obrigatorio quando a parte possuir conjuge."
      },
      {
        "id": "cpf-conjuge",
        "campo": "cpfConjuge",
        "condicao": {
          "indicadorCpfConjugeIdentificado": true
        },
        "validacao": "Obrigatorio quando o CPF do conjuge estiver identificado."
      },
      {
        "id": "representantes",
        "campo": "representantes",
        "condicao": {
          "indicadorRepresentante": true
        },
        "validacao": "Obrigatorio como array com objetos contendo ni dos representantes."
      },
      {
        "id": "representante-ni-valido",
        "campo": "representantes[].ni",
        "condicao": {
          "indicadorRepresentante": true
        },
        "validacao": "Para cada representante informado, ni deve ser CPF com 11 digitos ou CNPJ com 14 digitos e digito verificador valido."
      }
    ]
  },
  "duplicidade": {
    "validacao": "O sistema pode verificar duplicidade pela combinacao de CNS, data do ato, livro, folha, tipo de operacao, data do negocio, valor, CIB e NIs das partes."
  }
}
```
