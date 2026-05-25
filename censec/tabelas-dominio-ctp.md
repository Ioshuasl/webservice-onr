# Tabelas de Dominio CTP

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
    ],
    "observacao": "Dominios relacionados ao payload CTP/DOI em JSON. Quando a fonte DOI informa codigos numericos e os exemplos usam nomes, este arquivo preserva o codigo de origem e explicita o valor JSON observado ou normalizado."
  },
  "dominios": {
    "tipoDeclaracao": [
      {
        "codigoOrigem": "0",
        "valor": "Original",
        "descricao": "Original",
        "importavelEmLote": true
      },
      {
        "codigoOrigem": "1",
        "valor": "Retificadora",
        "descricao": "Retificadora",
        "importavelEmLote": false
      },
      {
        "codigoOrigem": "3",
        "valor": "Canceladora",
        "descricao": "Canceladora",
        "importavelEmLote": false
      }
    ],
    "tipoServico": [
      {
        "codigoOrigem": "1",
        "valor": "Notarial",
        "descricao": "Notarial"
      },
      {
        "codigoOrigem": "2",
        "valor": "RegistroDeImoveis",
        "descricao": "Registro de Imoveis"
      },
      {
        "codigoOrigem": "3",
        "valor": "RegistroDeTitulosEDocumentos",
        "descricao": "Registro de Titulos e Documentos"
      }
    ],
    "tipoAto": [
      {
        "codigoOrigem": "1",
        "valor": "Escritura",
        "descricao": "Escritura"
      },
      {
        "codigoOrigem": "2",
        "valor": "Procuracao",
        "descricao": "Procuracao"
      },
      {
        "codigoOrigem": "3",
        "valor": "Averbacao",
        "descricao": "Averbacao"
      },
      {
        "codigoOrigem": "4",
        "valor": "Registro",
        "descricao": "Registro"
      },
      {
        "codigoOrigem": "5",
        "valor": "RegistrosParaFinsDePublicidade",
        "descricao": "Registros para fins de publicidade"
      },
      {
        "codigoOrigem": "6",
        "valor": "RegistroParaFinsDeConservacao",
        "descricao": "Registro para fins de conservacao"
      },
      {
        "valor": "Desconhecido",
        "descricao": "Valor observado no exemplo JSON para ato nao classificado"
      }
    ],
    "tipoLivro": [
      {
        "codigoOrigem": "1",
        "valor": "Matricula",
        "descricao": "Lv.2 - Registro Geral, matricula"
      },
      {
        "codigoOrigem": "2",
        "valor": "TranscricaoDasTransmissoes",
        "descricao": "Transcricao das Transmissoes"
      }
    ],
    "naturezaTitulo": [
      {
        "codigoOrigem": "1",
        "valor": "InstrumentoParticularComForcaDeEscrituraPublica",
        "descricao": "Instrumento particular com forca de escritura publica"
      },
      {
        "codigoOrigem": "2",
        "valor": "EscrituraPublica",
        "descricao": "Escritura Publica"
      },
      {
        "codigoOrigem": "3",
        "valor": "TituloJudicial",
        "descricao": "Titulo Judicial"
      },
      {
        "codigoOrigem": "4",
        "valor": "ContratosOuTermosAdministrativos",
        "descricao": "Contratos ou termos administrativos"
      },
      {
        "codigoOrigem": "5",
        "valor": "AtosAutenticosDePaisesEstrangeiros",
        "descricao": "Atos autenticos de paises estrangeiros"
      }
    ],
    "tipoOperacaoImobiliaria": [
      {
        "codigoOrigem": "11",
        "valor": "CompraEVenda",
        "descricao": "Compra e Venda"
      },
      {
        "codigoOrigem": "13",
        "valor": "Permuta",
        "descricao": "Permuta"
      },
      {
        "codigoOrigem": "55",
        "valor": "DoacaoAdiantamentoLegitima",
        "descricao": "Doacao adiantamento legitima"
      },
      {
        "codigoOrigem": "67",
        "valor": "Doacao",
        "descricao": "Doacao"
      },
      {
        "codigoOrigem": "69",
        "valor": "Inventario",
        "descricao": "Inventario"
      },
      {
        "valor": "Adjudicacao",
        "descricao": "Adjudicacao, valor observado em CTP.md"
      },
      {
        "valor": "Outras",
        "descricao": "Outras operacoes imobiliarias"
      },
      {
        "valor": "Desconhecido",
        "descricao": "Valor observado no exemplo JSON para operacao nao classificada"
      }
    ],
    "formaPagamento": [
      {
        "codigoOrigem": "5",
        "valor": "QuitadoAVista",
        "descricao": "Quitado a vista"
      },
      {
        "codigoOrigem": "10",
        "valor": "QuitadoAPrazo",
        "descricao": "Quitado a prazo"
      },
      {
        "codigoOrigem": "11",
        "valor": "QuitadoSemInformacaoDaFormaDePagamento",
        "descricao": "Quitado sem informacao da forma de pagamento"
      },
      {
        "codigoOrigem": "7",
        "valor": "APrazo",
        "descricao": "A prazo"
      },
      {
        "codigoOrigem": "9",
        "valor": "NaoSeAplica",
        "descricao": "Nao se aplica"
      },
      {
        "valor": "Desconhecido",
        "descricao": "Valor observado no exemplo JSON para forma de pagamento nao classificada"
      }
    ],
    "tipoParteTransacionada": [
      {
        "codigoOrigem": "1",
        "valor": "Percentual",
        "descricao": "Percentual"
      },
      {
        "codigoOrigem": "2",
        "valor": "Area",
        "descricao": "Area em ha ou m2"
      },
      {
        "valor": "Desconhecido",
        "descricao": "Valor observado no exemplo JSON para parte transacionada nao classificada"
      }
    ],
    "destinacao": [
      {
        "codigoOrigem": "1",
        "valor": "Urbano",
        "descricao": "Urbano"
      },
      {
        "codigoOrigem": "3",
        "valor": "Rural",
        "descricao": "Rural"
      },
      {
        "valor": "Desconhecido",
        "descricao": "Valor observado no exemplo JSON para destinacao nao classificada"
      }
    ],
    "motivoNaoIdentificacaoNi": [
      {
        "codigoOrigem": "1",
        "valor": "SemCPFCNPJDecisaoJudicial",
        "descricao": "Sem CPF/CNPJ - Decisao Judicial"
      },
      {
        "codigoOrigem": "2",
        "valor": "NaoConstaNoDocumento",
        "descricao": "Nao consta no documento"
      }
    ],
    "regimeBens": [
      {
        "codigoOrigem": "1",
        "valor": "SeparacaoDeBens",
        "descricao": "Separacao de Bens"
      },
      {
        "codigoOrigem": "2",
        "valor": "ComunhaoParcialDeBens",
        "descricao": "Comunhao Parcial de Bens"
      },
      {
        "codigoOrigem": "3",
        "valor": "ComunhaoUniversalDeBens",
        "descricao": "Comunhao Universal de Bens"
      },
      {
        "codigoOrigem": "4",
        "valor": "ParticipacaoFinalNosAquestos",
        "descricao": "Participacao Final nos Aquestos"
      }
    ],
    "tipoImovel": [
      {
        "codigoOrigem": "15",
        "valor": "Loja",
        "descricao": "Loja"
      },
      {
        "codigoOrigem": "65",
        "valor": "Apartamento",
        "descricao": "Apartamento"
      },
      {
        "codigoOrigem": "67",
        "valor": "Casa",
        "descricao": "Casa"
      },
      {
        "codigoOrigem": "69",
        "valor": "FazendaSitio",
        "descricao": "Fazenda/Sitio"
      },
      {
        "codigoOrigem": "71",
        "valor": "Terreno",
        "descricao": "Terreno"
      }
    ],
    "tipoLogradouro": [
      {
        "valor": "Rua",
        "descricao": "Rua"
      },
      {
        "valor": "string",
        "descricao": "Valor generico observado no exemplo JSON"
      }
    ],
    "booleanosIndicadores": [
      "indicadorNaoConstaValorOperacaoImobiliaria",
      "indicadorNaoConstaValorBaseCalculoItbiItcmd",
      "indicadorAlienacaoFiduciaria",
      "indicadorPermutaBens",
      "indicadorPagamentoDinheiro",
      "indicadorImovelPublicoUniao",
      "indicadorAreaLoteNaoConsta",
      "indicadorAreaConstruidaNaoConsta",
      "indicadorNiIdentificado",
      "indicadorNaoConstaParticipacaoOperacao",
      "indicadorEstrangeiro",
      "indicadorEspolio",
      "indicadorConjuge",
      "indicadorConjugeParticipa",
      "indicadorCpfConjugeIdentificado",
      "indicadorRepresentante",
      "existeDoiAnterior"
    ]
  },
  "camposComDominio": {
    "declaracoes[].tipoDeclaracao": "tipoDeclaracao",
    "declaracoes[].tipoServico": "tipoServico",
    "declaracoes[].tipoAto": "tipoAto",
    "declaracoes[].tipoLivro": "tipoLivro",
    "declaracoes[].naturezaTitulo": "naturezaTitulo",
    "declaracoes[].tipoOperacaoImobiliaria": "tipoOperacaoImobiliaria",
    "declaracoes[].formaPagamento": "formaPagamento",
    "declaracoes[].tipoParteTransacionada": "tipoParteTransacionada",
    "declaracoes[].destinacao": "destinacao",
    "declaracoes[].tipoImovel": "tipoImovel",
    "declaracoes[].tipoLogradouro": "tipoLogradouro",
    "declaracoes[].alienantes[].motivoNaoIdentificacaoNi": "motivoNaoIdentificacaoNi",
    "declaracoes[].adquirentes[].motivoNaoIdentificacaoNi": "motivoNaoIdentificacaoNi",
    "declaracoes[].alienantes[].regimeBens": "regimeBens",
    "declaracoes[].adquirentes[].regimeBens": "regimeBens"
  }
}
```
