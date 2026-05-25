# RCTO

> Na RCTO (Registro Central de Testamento) devem ser informados somente atos referentes à escrituras de TESTAMENTO.

### Documento de detalhadamento da carga

[Documentação RCTO](https://suporte.notariado.org.br/support/solutions/articles/43000536373)

### Exemplo de corpo de requisição

```json
"Testamentos": [
        {
            "tipoTestamento": "Testamento",
            "cpf": "63138145922",
            "nome": "Lavínia Giovanna Ramos",
            "dataNascimento": "2001-02-15",
            "nomeMae": "Cristiane Rosa Marli da Paz",
            "nomePai": "Heitor Luís Joaquim Teixeira",
            "dataTestamento": "2024-07-07",
            "livro": "22",
            "folha": "114",
            "tipoDocumento": "Rg",
            "documento": "41.823.609-4",
            "observacao": "teste"
        },
        {
            "tipoTestamento": "Revogacao",
            "cpf": "63138145922",
            "nome": "Lavínia Giovanna Ramos",
            "dataNascimento": "2001-02-15",
            "nomeMae": "Sônia Fátima Brenda Santos",
            "nomePai": "Jorge Edson Enzo da Cruz",
            "dataTestamento": "2024-07-07",
            "livro": "22",
            "livroComplemento": null,
            "folha": "115",
            "folhaComplemento": null,
            "tipoDocumento": "Rg",
            "documento": "41.823.609-4",
            "documentoComplemento": null,
            "observacao": "teste",
            "revogacaoCartorioCns": 991000,
            "revogacaoUf": "DF",
            "revogacaoDataTestamento": "2000-02-15",
            "revogacaoLivro": "5",
            "revogacaoFolha": "10"
        }
    ]
```
