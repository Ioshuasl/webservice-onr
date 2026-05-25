# Regras de Validacao CESDI

```json
{
  "escopo": {
    "central": "CESDI",
    "payload": "JSON",
    "blocoPrincipal": "atosCesdi",
    "fontes": [
      "censec/CESDI.md",
      "censec/exemplo-censec-json.json"
    ]
  },
  "payload": {
    "camposObrigatorios": [
      "cns",
      "quinzena",
      "atosCesdi"
    ],
    "regras": [
      {
        "id": "payload-atos-cesdi-array",
        "campo": "atosCesdi",
        "validacao": "Deve ser um array JSON quando houver carga CESDI."
      },
      {
        "id": "payload-ignorar-outras-centrais",
        "campo": "atosCep|testamentos|declaracoes",
        "validacao": "Nao fazem parte das regras CESDI e nao devem ser considerados nesta validacao."
      }
    ]
  },
  "quinzena": {
    "camposObrigatorios": [
      "anoReferencia",
      "quinzenaReferencia",
      "mesReferencia"
    ]
  },
  "atoCesdi": {
    "uso": "Na CESDI devem ser informados somente atos referentes a escrituras de separacoes, divorcios e inventarios.",
    "camposObrigatorios": [
      "tipoAtoCesdi",
      "data",
      "livro",
      "folha",
      "partes"
    ],
    "formatos": {
      "data": "YYYY-MM-DD",
      "dataCasamento": "YYYY-MM-DD",
      "livro": "string",
      "folha": "string",
      "livroComplemento": "string|null",
      "folhaComplemento": "string|null",
      "quantidadeFilhosMaiores": "number",
      "quantidadeFilhosMenores": "number",
      "partes": "array",
      "documentos": "array",
      "referentes": "array",
      "bensEDireitos": "array",
      "existeBemEDireito": "boolean",
      "estrangeiro": "boolean"
    },
    "regras": [
      {
        "id": "ato-cesdi-partes-minimo",
        "campo": "partes",
        "validacao": "Cada ato CESDI deve conter pelo menos uma parte."
      },
      {
        "id": "ato-cesdi-data-casamento",
        "campo": "dataCasamento",
        "condicao": {
          "tipoAtoCesdi": [
            "Separacao",
            "DivorcioDireto"
          ]
        },
        "validacao": "Deve ser informado para atos de separacao e divorcio quando houver casamento relacionado ao ato."
      },
      {
        "id": "ato-cesdi-regime-bens",
        "campo": "regimeBens",
        "condicao": {
          "tipoAtoCesdi": [
            "Separacao",
            "DivorcioDireto"
          ]
        },
        "validacao": "Deve ser informado para atos que dependem do regime de bens do casamento."
      },
      {
        "id": "ato-cesdi-filhos-nao-negativos",
        "campos": [
          "quantidadeFilhosMaiores",
          "quantidadeFilhosMenores"
        ],
        "validacao": "Quando informadas, as quantidades de filhos devem ser numeros inteiros maiores ou iguais a zero."
      },
      {
        "id": "ato-cesdi-chave-duplicada",
        "campos": [
          "livro",
          "folha",
          "livroComplemento",
          "folhaComplemento"
        ],
        "validacao": "Quando houver atos com a mesma numeracao de livro e folha, usar livroComplemento ou folhaComplemento para diferenciar os atos."
      },
      {
        "id": "ato-cesdi-mne-digital-hibrido",
        "campo": "mne",
        "validacao": "Quando o ato possuir matricula notarial eletronica, informar mne sem pontuacao; se nao se aplicar, omitir ou informar null conforme a API aceitar."
      },
      {
        "id": "ato-cesdi-bens-e-direitos",
        "campo": "bensEDireitos",
        "condicao": {
          "existeBemEDireito": true
        },
        "validacao": "Quando existeBemEDireito for true, informar bensEDireitos como array."
      },
      {
        "id": "ato-cesdi-referentes",
        "campo": "referentes",
        "validacao": "Quando houver ato anterior relacionado, informar referentes como array com os dados de origem."
      }
    ]
  },
  "partes": {
    "camposObrigatorios": [
      "nome",
      "qualidade",
      "documentos"
    ],
    "formatos": {
      "dataNascimento": "YYYY-MM-DD",
      "documentos": "array"
    },
    "regras": [
      {
        "id": "parte-documentos-minimo",
        "campo": "documentos",
        "validacao": "Cada parte deve conter pelo menos um documento."
      },
      {
        "id": "parte-conjuge-tipo",
        "campo": "conjugeTipo",
        "condicao": {
          "qualidade": [
            "Separando",
            "Divorciando"
          ]
        },
        "validacao": "Para partes que representam conjuges no ato, informar Conjuge1 ou Conjuge2."
      },
      {
        "id": "parte-dados-pessoais-conjuge",
        "campos": [
          "dataNascimento",
          "localNascimentoPais",
          "localNascimentoUf",
          "localResidenciaPais",
          "localResidenciaMunicipio",
          "localResidenciaUf",
          "sexo"
        ],
        "condicao": {
          "qualidade": [
            "Separando",
            "Divorciando"
          ]
        },
        "validacao": "Para conjuges, informar dados pessoais e de residencia quando disponiveis no cadastro."
      },
      {
        "id": "parte-advogado-documento",
        "campo": "documentos",
        "condicao": {
          "qualidade": "Advogado"
        },
        "validacao": "Advogado deve possuir ao menos um documento informado."
      }
    ]
  },
  "documentos": {
    "camposObrigatorios": [
      "documentoTipo",
      "prioridade",
      "documento"
    ],
    "regras": [
      {
        "id": "documento-prioridade-primario",
        "campo": "prioridade",
        "validacao": "Cada parte deve possuir um documento com prioridade Primario."
      },
      {
        "id": "documento-cpf-valido",
        "campo": "documento",
        "condicao": {
          "documentoTipo": [
            "Cpf",
            "CPF"
          ]
        },
        "validacao": "Quando documentoTipo for CPF/Cpf, documento deve ser CPF com 11 digitos e digito verificador valido."
      },
      {
        "id": "documento-uf-opcional",
        "campo": "uf",
        "validacao": "Pode ser informado quando o tipo de documento exigir UF; nos exemplos tambem aparece como null."
      }
    ]
  },
  "referentes": {
    "camposObrigatorios": [
      "tipoAtoCesdi",
      "livro",
      "folha",
      "cns"
    ],
    "regras": [
      {
        "id": "referente-complementos",
        "campos": [
          "livroComplemento",
          "folhaComplemento"
        ],
        "validacao": "Informar complementos quando existirem no ato anterior."
      }
    ]
  },
  "bensEDireitos": {
    "uso": "Presente no exemplo JSON para atos CESDI quando existeBemEDireito e true.",
    "regras": [
      {
        "id": "bem-valores-numericos",
        "campos": [
          "valorBemEDireito",
          "valorFiscal"
        ],
        "validacao": "Quando informados, devem ser valores numericos."
      },
      {
        "id": "bem-forma-prazo-pagamento",
        "campos": [
          "formaPagamento",
          "prazoPagamento"
        ],
        "validacao": "Quando informados, devem usar valores aceitos pelas tabelas de dominio compartilhadas no payload JSON."
      }
    ]
  }
}
```
