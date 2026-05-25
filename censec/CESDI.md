# CESDI

> Na CESDI (Central de Escrituras de Separações, Divórcios e Inventários) devem ser informados somente atos referentes às ESCRITURAS de Separações, Divórcios e Inventários.

# Documento de detalhadamento da carga

[Documentação CESDI](https://suporte.notariado.org.br/support/solutions/articles/43000536375-cesdi-especificac%C3%A3o-dos-campos-de-carga)

### Exemplo de corpo de requisição

```json
"AtosCesdi": [
        {
            "tipoAtoCesdi": "Separacao",
            "data": "2024-07-09",
            "livro": "22",
			"livroComplemento": null,
            "folha": "112",
            "folhaComplemento": null,
            "dataCasamento": "2010-10-15",
            "regimeBens": "SeparacaoTotal",
            "quantidadeFilhosMaiores": 2,
            "quantidadeFilhosMenores": 0,
            "responsavel": "AmbosConjuges",
            "partes": [
                {
                    "nome": "Evelyn Giovana Silva",
                    "conjugeTipo": "Conjuge2",
                    "qualidade": "Separando",
                    "dataNascimento": "2001-10-15",
                    "LocalNascimentoPais": "BRASIL",
                    "localNascimentoUf": "DF",
                    "LocalResidenciaPais": "BRASIL",
                    "LocalResidenciaMunicipio": "BRASÍLIA",
                    "localResidenciaUf": "DF",
                    "sexo": "F",
                    "documentos": [
                        {
                            "documentoTipo": "Cpf",
                            "prioridade": "Primario",
                            "documento": "017.302.932-98"
                        }
                    ]
                },
                {
                    "nome": "Fernando Adventista",
                    "qualidade": "Advogado",
                    "documentos": [
                        {
                            "documentoTipo": "Cpf",
                            "prioridade": "Primario",
                            "documento": "05519922128"
                        }
                    ]
                },
                {
                    "nome": "Renato Eduardo Santos",
                    "conjugeTipo": "Conjuge1",
                    "qualidade": "Separando",
                    "dataNascimento": "2000-10-15",
                    "LocalNascimentoPais": "brasil",
                    "localNascimentoUf": "DF",
                    "LocalResidenciaPais": "brasil",
                    "LocalResidenciaMunicipio": "BRASÍLIA",
                    "localResidenciaUf": "DF",
                    "sexo": "M",
                    "documentos": [
                        {
                            "documentoTipo": "Cpf",
                            "prioridade": "Primario",
                            "documento": "663.589.580-97"
                        }
                    ]
                }
            ]
        },
        {
            "tipoAtoCesdi": "DivorcioDireto",
            "data": "2024-07-09",
            "livro": "22",
            "folha": "113",
            "livroComplemento": "teste",
            "folhaComplemento": "",
            "dataCasamento": "2004-10-15",
            "regimeBens": "SeparacaoTotal",
            "quantidadeFilhosMaiores": 2,
            "quantidadeFilhosMenores": 1,
            "responsavel": "AmbosConjuges",
            "partes": [
                {
                    "nome": "Fernando Adventista",
                    "qualidade": "Advogado",
                    "documentos": [
                        {
                            "documentoTipo": "Cpf",
                            "prioridade": "Primario",
                            "documento": "017.302.932-98"
                        },
                        {
                            "documentoTipo": "Rg",
                            "prioridade": "Secundario",
                            "documento": "39.908.977-9"
                        }
                    ]
                },
                {
                    "nome": "Giovanni Bernardo Dias API",
                    "conjugeTipo": "Conjuge2",
                    "qualidade": "Divorciando",
                    "dataNascimento": "2000-10-15T14:00:00.000Z",
                    "LocalNascimentoPais": "brasil",
                    "localNascimentoUf": "DF",
                    "LocalResidenciaPais": "brasil",
                    "LocalResidenciaMunicipio": "BRASÍLIA",
                    "localResidenciaUf": "DF",
                    "sexo": "M",
                    "documentos": [
                        {
                            "documentoTipo": "Cpf",
                            "prioridade": "Primario",
                            "documento": "318.731.487-20"
                        },
                        {
                            "documentoTipo": "Outros",
                            "prioridade": "Secundario",
                            "documento": "32.098.807-7",
                            "uf": null
                        }
                    ]
                },
                {
                    "nome": "Priscila Sandra da Mota",
                    "conjugeTipo": "Conjuge1",
                    "qualidade": "Divorciando",
                    "dataNascimento": "2000-10-15T14:00:00.000Z",
                    "LocalNascimentoPais": "BRASIL",
                    "localNascimentoUf": "DF",
                    "LocalResidenciaPais": "BRASIL",
                    "LocalResidenciaMunicipio": "BRASÍLIA",
                    "localResidenciaUf": "DF",
                    "sexo": "F",
                    "documentos": [
                        {
                            "documentoTipo": "Cpf",
                            "prioridade": "Primario",
                            "documento": "108.774.348-67"
                        },
                        {
                            "documentoTipo": "Rg",
                            "prioridade": "Secundario",
                            "documento": "41.395.133-9",
                            "uf": null
                        }
                    ]
                }
            ]
        }
    ],
```
