# Regras de Validação CEP

```json
{
  "escopo": {
    "central": "CEP",
    "payload": "JSON",
    "blocoPrincipal": "atosCep",
    "fontes": [
      "censec/CEP.md",
      "censec/exemplo-cep-json.json"
    ]
  },
  "payload": {
    "camposObrigatorios": [
      "cns",
      "quinzena",
      "atosCep"
    ],
    "regras": [
      {
        "id": "payload-atos-cep-array",
        "campo": "atosCep",
        "validacao": "Deve ser um array JSON quando houver carga CEP."
      },
      {
        "id": "payload-ignorar-outras-centrais",
        "campo": "atosCesdi|testamentos|declaracoes",
        "validacao": "Nao fazem parte das regras CEP e nao devem ser considerados nesta validacao."
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
  "atoCep": {
    "camposObrigatorios": [
      "tipoAtoCep",
      "data",
      "livro",
      "folha",
      "valor",
      "partes"
    ],
    "formatos": {
      "data": "YYYY-MM-DD",
      "dataContrato": "YYYY-MM-DD",
      "dataValidade": "YYYY-MM-DD",
      "existeBemEDireito": "boolean",
      "acordo": "boolean",
      "estrangeiro": "boolean",
      "partes": "array",
      "referentes": "array",
      "bensEDireitos": "array"
    },
    "regras": [
      {
        "id": "ato-cep-partes-minimo",
        "campo": "partes",
        "validacao": "Cada ato CEP deve conter pelo menos uma parte."
      },
      {
        "id": "ato-cep-chave-duplicada",
        "campos": [
          "livro",
          "folha",
          "livroComplemento",
          "folhaComplemento"
        ],
        "validacao": "Quando houver atos com a mesma numeracao de livro e folha, deve ser preenchido livroComplemento ou folhaComplemento para evitar duplicidade."
      },
      {
        "id": "ato-cep-mne-digital-hibrido",
        "campo": "mne",
        "validacao": "Obrigatorio quando o ato for digital ou hibrido no e-Notariado; para ato fisico, informar null."
      },
      {
        "id": "ato-cep-procuracao-privada",
        "campo": "tipoAtoCep",
        "validacao": "ProcuracaoPrivada nao deve ser usada no ato principal; o valor e restrito ao bloco referentes."
      },
      {
        "id": "ato-cep-testamento-fora-cep",
        "campo": "tipoAtoCep",
        "validacao": "Atos de testamento nao devem ser enviados na CEP."
      },
      {
        "id": "ato-cep-revogacao-sem-natureza",
        "campo": "naturezaEscritura",
        "condicao": {
          "tipoAtoCep": "RevogacaoDeProcuracao"
        },
        "validacao": "RevogacaoDeProcuracao nao exige qualificacao de natureza."
      }
    ]
  },
  "obrigatoriedadeCondicional": [
    {
      "id": "tipo-escritura-natureza",
      "quando": {
        "tipoAtoCep": "Escritura"
      },
      "obrigatorio": [
        "naturezaEscritura"
      ]
    },
    {
      "id": "tipo-ata-usucapiao-natureza",
      "quando": {
        "tipoAtoCep": "AtaNotarialDeUsucapiao"
      },
      "obrigatorio": [
        "naturezaAtaNotarialDeUsucapiao"
      ]
    },
    {
      "id": "tipo-com-referentes",
      "quando": {
        "tipoAtoCep": [
          "RenunciaDeProcuracao",
          "RevogacaoDeProcuracao",
          "Substabelecimento"
        ]
      },
      "obrigatorio": [
        "referentes"
      ]
    },
    {
      "id": "natureza-rerratificacao",
      "quando": {
        "naturezaEscritura": "Rerratificacao"
      },
      "obrigatorio": [
        "referentes"
      ],
      "valoresObrigatorios": {
        "bensEDireitos[].prazoPagamento": "Aditamento"
      }
    },
    {
      "id": "natureza-mediacao",
      "quando": {
        "naturezaEscritura": "Mediacao"
      },
      "obrigatorio": [
        "naturezaLitigio",
        "acordo"
      ],
      "partesObrigatorias": [
        "Requerente",
        "Requerido",
        "Mediador",
        "Interveniente"
      ]
    },
    {
      "id": "natureza-conciliacao",
      "quando": {
        "naturezaEscritura": "Conciliacao"
      },
      "obrigatorio": [
        "naturezaLitigio",
        "acordo"
      ],
      "partesObrigatorias": [
        "Requerente",
        "Requerido",
        "Conciliador",
        "Interveniente"
      ]
    },
    {
      "id": "natureza-uniao-estavel-regime-bens",
      "quando": {
        "naturezaEscritura": [
          "DeclaratoriaDeUniaoEstavel",
          "DeclaratoriaDeUniaoEstavelHomoafetiva",
          "DissolucaoDeUniaoEstavel"
        ]
      },
      "obrigatorio": [
        "regimeBens"
      ]
    },
    {
      "id": "ato-com-bens-e-direitos",
      "quando": {
        "existeBemEDireito": true
      },
      "obrigatorio": [
        "bensEDireitos"
      ]
    }
  ],
  "referentes": {
    "uso": "Obrigatorio para atos de revogacao, renuncia, substabelecimento e escrituras de rerratificacao.",
    "camposObrigatorios": [
      "tipoAtoCep",
      "cns",
      "livro",
      "folha"
    ],
    "regras": [
      {
        "id": "referente-complemento-livro",
        "campo": "livroComplemento",
        "validacao": "Obrigatorio se o ato antecessor informou complemento do livro."
      },
      {
        "id": "referente-complemento-folha",
        "campo": "folhaComplemento",
        "validacao": "Obrigatorio se o ato antecessor informou complemento da folha."
      },
      {
        "id": "referente-origem-legado",
        "campos": [
          "referenteUFOrigem",
          "referenteCidadeOrigem",
          "referenteCartorio"
        ],
        "validacao": "Campos legados de origem podem ser exigidos em referentes quando nao houver CNS."
      },
      {
        "id": "referente-desconhecido",
        "campo": "desconhecido",
        "validacao": "Usar boolean quando o escrevente desconhecer o cartorio ou origem do ato anterior."
      }
    ]
  },
  "partes": {
    "camposObrigatorios": [
      "nome",
      "tipoDocumento",
      "qualidade"
    ],
    "regras": [
      {
        "id": "parte-documento-fiscal-valido",
        "campo": "numeroDocumento",
        "condicao": {
          "tipoDocumento": [
            "Cpf",
            "Cnpj",
            "CPF",
            "CNPJ"
          ]
        },
        "validacao": "Quando tipoDocumento for CPF/Cpf, numeroDocumento deve ser CPF com 11 digitos e digito verificador valido. Quando tipoDocumento for CNPJ/Cnpj, numeroDocumento deve ser CNPJ com 14 digitos e digito verificador valido."
      },
      {
        "id": "parte-qualidade-acentuacao",
        "campo": "qualidade",
        "validacao": "Valores com acentuacao devem ser enviados exatamente como constarem no dominio aceito pela API."
      }
    ]
  },
  "bensEDireitos": {
    "uso": "Obrigatorio quando existeBemEDireito for true.",
    "regras": [
      {
        "id": "bem-forma-pagamento-nulo",
        "campo": "formaPagamento",
        "validacao": "Pode ser null quando a forma de pagamento nao se aplicar ao ato."
      },
      {
        "id": "bem-prazo-pagamento-nulo",
        "campo": "prazoPagamento",
        "validacao": "Pode ser null quando o prazo de pagamento nao se aplicar ao ato."
      }
    ]
  }
}
```
