## /url/produtividade-geral

## Parâmetros de Requisição (via GET)

| Parâmetro | Descrição | Opcional |
|---|---|---|
| dataInicial | Data inicial do período de apresentação dos títulos. Preencher da seguinte forma: dmy Ex: 01012017 | |
| dataFinal | Data final do período de apresentação dos títulos. Preencher da seguinte forma: dmy Ex: 01012017 | |
| idCartorio | Recuperado após autenticação ou através do serviço URL/cartorio. Ao informar esse parâmetro, o serviço irá retornar somente títulos do cartório informado. | |
| tipoApresentante | Informando este parâmetro, o serviço irá retornar apresentantes do tipo informado. Preencher com 1, 2, 3, 4, 5 ou 0 (1: Todos, 2: Tipo banco, 3: Tipo convênio, 4: Somente convênios públicos, 5: Somente convênios privados, 0: Específico). | |
| idApresentante | Recuperado após autenticação ou através do serviço URL/apresentante. ATENÇÃO: Ao informar o idApresentante, o campo tipoApresentante deve ser preenchido com 0. | |

## Exemplo de Resposta (JSON)

```json
{
  "links": {
    "self": {
      "href": "http://craUF.api.crabr.com.br/produtividade-geral?dataInicial=03012017&dataFinal=03012017&tipoApresentante=3"
    }
  },
  "embedded": {
    "produtividade-geral": [
      {
        "totalGeral": "5716",
        "valorTotal": "9391861.39",
        "valorProcessados": "9127033.69",
        "devolvidos": "128",
        "valorDevolvidos": "264827.70"
      }
    ]
  },
  "total_items": 1
}
```
