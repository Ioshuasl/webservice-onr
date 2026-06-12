## /url/protesto-cancelamento

## Parâmetros de Requisição (via GET)

| Parâmetro | Descrição | Opcional |
|---|---|---|
| dataInicial | Data inicial do período de apresentação dos títulos. Preencher da seguinte forma: dmy Ex: 01012017 | |
| dataFinal | Data final do período de apresentação dos títulos. Preencher da seguinte forma: dmy Ex: 01012017 | |
| idCartorio | Recuperado após autenticação ou através do serviço URL/cartorio. Ao informar esse parâmetro, o serviço irá retornar somente títulos do cartório informado. | |
| tipoApresentante | Informando este parâmetro, o serviço irá retornar apresentantes do tipo informado. Preencher com 1, 2, 3, 4, 5 ou 0 (1: Todos, 2: Tipo banco, 3: Tipo convênio, 4: Somente convênios públicos, 5: Somente convênios privados, 0: Específico). | |
| idApresentante | Recuperado após autenticação ou através do serviço URL/apresentante. ATENÇÃO: Ao informar o idApresentante, o campo tipoApresentante deve ser preenchido com 0. | |

Obs: Quando não possuir com autorização cancelamento e com autorização desistência o relatório deve ser preenchido como 100% Não cancelado.

## Exemplo de Resposta (JSON)

```json
{
  "links": {
    "self": {
      "href": "http://craUF.api.crabr.com.br/protesto-cancelamento?dataInicial=03012017&dataFinal=03012017&tipoApresentante=3"
    }
  },
  "embedded": {
    "protesto-cancelamento": [
      {
        "ocorrencia": "Com autorização cancelamento",
        "totalOcorrencia": "1118",
        "valorOcorrencia": "1434296.64"
      },
      {
        "ocorrencia": "Com autorização desistência",
        "totalOcorrencia": "0",
        "valorOcorrencia": "0"
      },
      {
        "ocorrencia": "Sem autorização",
        "totalOcorrencia": "6771",
        "valorOcorrencia": "13743638.45"
      }
    ]
  },
  "total_items": 3
}
```
