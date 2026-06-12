## /url/desistencia

## Parâmetros de Requisição (via GET)

| Parâmetro | Descrição | Opcional |
|---|---|---|
| status | (2: Não baixados) | Preencher com 2 |
| idCartorio | Recuperado após autenticação ou através do serviço URL/cartorio | |
| idApresentante | Recuperado após autenticação ou através do serviço URL/apresentante | |

## Exemplo de Resposta (JSON)

```json
{
  "links": {
    "self": {
      "href": "http://craUF.api.crabr.com.br/desistencia?status=2"
    }
  },
  "embedded": {
    "desistencia": [
      {
        "id": 1,
        "nomeArquivo": "DP0003105.171",
        "data": {
          "date": "2017-05-31T15:09:35.000000",
          "timezone_type": 3,
          "timezone": "America/Sao_Paulo"
        },
        "cartorio": {
          "id": 1,
          "nome": "Cartório 1° Ofício",
          "documento": "00000000000000",
          "uf": "UF",
          "tipo": ["CARTORIO"],
          "codigo": "01",
          "telefones": [
            "0000000000",
            "0000000000"
          ],
          "fax": "0000000000",
          "emails": [
            {
              "id": 1,
              "nome": "CARTORIO",
              "email": "cartorio@cartorio.com"
            }
          ],
          "municipio": {
            "id": 1,
            "nome": "Municipio",
            "codigo": "0000000"
          }
        },
        "apresentante": {
          "id": 1,
          "nome": "BANCO SA",
          "codigo": "000"
        },
        "links": {
          "self": {
            "href": "http://craUF.api.crabr.com.br/desistencia/1"
          }
        }
      }
    ]
  },
  "total_items": 1
}
```
