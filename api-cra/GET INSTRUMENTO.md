## /url/instrumento

## Parâmetros de Requisição (via GET)

| Parâmetro | Descrição | Opcional |
|---|---|---|
| codigoAutenticacao | Código de autenticação gerado no upload do instrumento de protesto. | |
| imagem | Preencher com 1 (Com imagem) ou 0 (Sem imagem) | |

## Exemplo de Resposta (JSON)

```json
{
  "links": {
    "self": {
      "href": "http://uf.teste.craapi.com.br/instrumento?codigoAutenticacao=Txx-Xxx-Xxx&imagem=1"
    }
  },
  "embedded": {
    "instrumento": [
      {
        "id": 479777,
        "devedores": [
          {
            "nome": "DEVEDOR TESTE",
            "tipoDocumento": "CPF",
            "documento": "00000000000"
          }
        ],
        "cartorio": {
          "nome": "Tabelionato de Protesto de Titulos"
        },
        "protocolo": "100000000001",
        "dataProtesto": {
          "date": "2018-07-17T00:00:00.000000",
          "timezone_type": 3,
          "timezone": "America/Sao_Paulo"
        },
        "numeroTitulo": "124511",
        "saldoTitulo": "264.97",
        "imagem": "JVBERiOxLjbmRzdHJlYWOKZW5kb2JqCjUg",
        "links": {
          "self": {
            "href": "http://uf.teste.craapi.com.br/instrumento/558844"
          }
        }
      }
    ]
  },
  "total_items": 1
}
```
