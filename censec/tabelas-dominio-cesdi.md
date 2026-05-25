# Tabelas de Dominio CESDI

```json
{
  "escopo": {
    "central": "CESDI",
    "payload": "JSON",
    "blocoPrincipal": "atosCesdi",
    "fontes": [
      "censec/CESDI.md",
      "censec/exemplo-censec-json.json"
    ],
    "observacao": "Dominios extraidos somente dos exemplos CESDI disponiveis nas fontes informadas."
  },
  "dominios": {
    "tipoAtoCesdi": [
      {
        "valor": "Separacao",
        "descricao": "Escritura de separacao"
      },
      {
        "valor": "DivorcioDireto",
        "descricao": "Escritura de divorcio direto"
      }
    ],
    "regimeBens": [
      {
        "valor": "ComunhaoParcial",
        "descricao": "Comunhao parcial"
      },
      {
        "valor": "SeparacaoTotal",
        "descricao": "Separacao total"
      }
    ],
    "responsavel": [
      {
        "valor": "Conjuge1",
        "descricao": "Conjuge 1"
      },
      {
        "valor": "AmbosConjuges",
        "descricao": "Ambos os conjuges"
      }
    ],
    "conjugeTipo": [
      {
        "valor": "Conjuge1",
        "descricao": "Conjuge 1"
      },
      {
        "valor": "Conjuge2",
        "descricao": "Conjuge 2"
      }
    ],
    "parteQualidade": [
      {
        "valor": "Separando",
        "descricao": "Parte separanda",
        "aplicavelQuando": {
          "tipoAtoCesdi": "Separacao"
        }
      },
      {
        "valor": "Divorciando",
        "descricao": "Parte divorcianda",
        "aplicavelQuando": {
          "tipoAtoCesdi": "DivorcioDireto"
        }
      },
      {
        "valor": "Advogado",
        "descricao": "Advogado participante do ato"
      }
    ],
    "sexo": [
      {
        "valor": "F",
        "descricao": "Feminino"
      },
      {
        "valor": "M",
        "descricao": "Masculino"
      }
    ],
    "documentoTipo": [
      {
        "valor": "Cpf",
        "descricao": "CPF"
      },
      {
        "valor": "Rg",
        "descricao": "RG"
      },
      {
        "valor": "Outros",
        "descricao": "Outro documento"
      }
    ],
    "documentoPrioridade": [
      {
        "valor": "Primario",
        "descricao": "Documento principal da parte"
      },
      {
        "valor": "Secundario",
        "descricao": "Documento secundario da parte"
      }
    ],
    "ufObservada": [
      {
        "valor": "AC",
        "descricao": "Acre"
      },
      {
        "valor": "DF",
        "descricao": "Distrito Federal"
      }
    ],
    "tipoAtoCesdiReferente": [
      {
        "valor": "Separacao",
        "descricao": "Ato anterior de separacao"
      }
    ],
    "formaPagamento": [
      {
        "valor": "Cheque",
        "descricao": "Cheque"
      }
    ],
    "prazoPagamento": [
      {
        "valor": "AVista",
        "descricao": "A vista"
      }
    ]
  },
  "camposComDominio": {
    "atosCesdi[].tipoAtoCesdi": "tipoAtoCesdi",
    "atosCesdi[].regimeBens": "regimeBens",
    "atosCesdi[].responsavel": "responsavel",
    "atosCesdi[].partes[].conjugeTipo": "conjugeTipo",
    "atosCesdi[].partes[].qualidade": "parteQualidade",
    "atosCesdi[].partes[].sexo": "sexo",
    "atosCesdi[].partes[].documentos[].documentoTipo": "documentoTipo",
    "atosCesdi[].partes[].documentos[].prioridade": "documentoPrioridade",
    "atosCesdi[].partes[].localNascimentoUf": "ufObservada",
    "atosCesdi[].partes[].localResidenciaUf": "ufObservada",
    "atosCesdi[].partes[].documentos[].uf": "ufObservada",
    "atosCesdi[].referentes[].tipoAtoCesdi": "tipoAtoCesdiReferente",
    "atosCesdi[].bensEDireitos[].formaPagamento": "formaPagamento",
    "atosCesdi[].bensEDireitos[].prazoPagamento": "prazoPagamento"
  }
}
```
