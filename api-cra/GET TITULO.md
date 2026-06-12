## /url/titulo

## Parâmetros de Requisição (via GET)

| Parâmetro | Descrição | Opcional |
|---|---|---|
| idCartorio | Recuperado após autenticação ou através do serviço URL/cartorio | |
| idApresentante | Recuperado após autenticação ou através do serviço URL/apresentante | |
| identificador | Número identificador do título | |
| numeroTitulo | Número do título | |
| documentoDevedor | Documento do devedor do título | |
| documentoCredor | CPF/CNPJ do credor do título | |
| nomeCredor | Nome do credor do título | |
| ocorrenciaRetorno | Ocorrência do título, parâmetros de busca: protesto, pagamento, cancelamento, sustação, devolução, desistência | |
| dataRetorno | Data do retorno | |
| dataRemessa | Retorna apenas os títulos referentes à data de remessa informada | |
| apenasDevedoresEnderecoCompleto | Filtra títulos em que o apresentante informou um endereço de devedor maior que 45 caracteres (limite do layout FEBRABAN) | |
| apenasTitulosDadosComplementares | Retorna apenas os títulos que possuem dados complementares (telefone e e-mail) do devedor | |

## Exemplo de Resposta (JSON)

```json
{
  "links": {
    "self": {
      "href": "http://craUF.api.crabr.com.br/titulo?idCartorio=&numeroTitulo=&documentoDevedor=00000000000&ocorrenciaRetorno=protesto"
    }
  },
  "embedded": {
    "titulo": [
      {
        "id": 1,
        "numeroTitulo": "00000",
        "nossoNumero": "000-0000000-0",
        "protocolo": "00000000",
        "dataProtocolo": {
          "date": "2018-01-09T00:00:00.000000",
          "timezone_type": 3,
          "timezone": "America/Sao_Paulo"
        },
        "dataEmissao": {
          "date": "2016-12-07T00:00:00.000000",
          "timezone_type": 3,
          "timezone": "America/Sao_Paulo"
        },
        "dataVencimento": "00/00/2017",
        "valor": "00.0",
        "saldo": "000.00",
        "especie": "DMI",
        "descricaoEspecie": "Especie do titulo",
        "endosso": "M",
        "situacao": "RETORNADO",
        "nomeSacador": "TESTE 123",
        "tipoDocumentoSacador": ["CNPJ"],
        "documentoSacador": "00000000000000",
        "nomeCedente": "TESTE 123",
        "devedores": [
          {
            "nome": "NOME DO DEVEDOR",
            "tipoDocumento": "CPF",
            "documento": "99999999999",
            "telefone": "99999999",
            "email": "email@email.com",
            "endereco": {
              "endereco": "80686-508, RUA EXEMPLO99999. BC. 2 AP.999999",
              "enderecoCompleto": "80686-508, RUA EXEMPLO999999.ANEXOJOSED'OESTE",
              "bairro": "R. EXEMPLO 3. BC. 13",
              "cep": ["99999999"],
              "uf": "xx",
              "cidade": "CIDADE EXEMPL"
            }
          }
        ],
        "apresentante": {
          "id": 11,
          "nome": "APRESENTANTE",
          "codigo": "999",
          "endereco": {
            "endereco": "Endereco de testes",
            "bairro": "Centro",
            "cep": "99999999",
            "uf": "UF"
          },
          "telefones": [
            "6199999999",
            "61999999999"
          ],
          "fax": ["61888888888"],
          "emails": [
            {
              "id": 1,
              "nome": "Email 1",
              "email": "teste@gmail.com"
            },
            {
              "id": 2,
              "nome": "Email 2",
              "email": "teste@gmail.com"
            }
          ]
        },
        "cartorio": {
          "id": 1,
          "nome": "1° Oficio de testes",
          "documento": "00000000000000",
          "uf": "UF",
          "tipo": ["CARTORIO"],
          "codigo": "01",
          "endereco": {
            "endereco": "Avenida Francisco Raulino, 2061-A",
            "bairro": "Centro",
            "cep": "64290000",
            "uf": "PI"
          },
          "telefones": ["6100000000"],
          "fax": "6100000000",
          "emails": [
            {
              "id": 1,
              "nome": "NOME QUALQUER",
              "email": "TESTE@TESTE.COM.br"
            }
          ],
          "municipio": {
            "id": 1,
            "nome": "TESTELANDIA",
            "codigo": "1234567"
          }
        },
        "retornos": [
          {
            "id": 1234567,
            "dataApresentante": {
              "date": "2017-01-30T12:38:19.000000",
              "timezone_type": 3,
              "timezone": "America/Sao_Paulo"
            },
            "dataCartorio": {
              "date": "2017-01-30T12:38:19.000000",
              "timezone_type": 3,
              "timezone": "America/Sao_Paulo"
            },
            "ocorrencia": {
              "descricao": "Protestado",
              "data": {
                "date": "2017-01-27T00:00:00.000000",
                "timezone_type": 3,
                "timezone": "America/Sao_Paulo"
              }
            },
            "valor": "000.00",
            "saldo": "000.00",
            "protocolo": "0000000000",
            "dataProtocolo": {
              "date": "2017-01-19T00:00:00.000000",
              "timezone_type": 3,
              "timezone": "America/Sao_Paulo"
            },
            "nossoNumero": "000-0000000-0",
            "sequencial": "000001",
            "status": "LIBERADO",
            "confirmacao": {
              "id": 1,
              "dataConfirmacao": {
                "date": "2018-01-09T00:00:00.000000",
                "timezone_type": 3,
                "timezone": "America/Sao_Paulo"
              }
            },
            "remessa": {
              "id": 1,
              "sequencial": "009999",
              "nomeArquivo": "B9999999.181",
              "data": {
                "date": "2018-04-17T08:29:27.000000",
                "timezone_type": 3,
                "timezone": "America/Sao_Paulo"
              }
            },
            "custas": [
              {
                "tipo": "cancelamento",
                "valor": 10.34,
                "vigencia": {
                  "date": "2022-04-17T08:29:27.000000",
                  "timezone_type": 3,
                  "timezone": "America/Sao_Paulo"
                }
              },
              {
                "tipo": "desistencia",
                "valor": 25.69,
                "vigencia": {
                  "date": "2022-04-17T08:29:27.000000",
                  "timezone_type": 3,
                  "timezone": "America/Sao_Paulo"
                }
              }
            ],
            "andamentos": [
              {
                "codigo": ["AA"],
                "data": {
                  "date": "2024-10-08T19:05:45.000000",
                  "timezone_type": 3,
                  "timezone": "America/Sao_Paulo"
                }
              },
              {
                "codigo": ["AB"],
                "data": {
                  "date": "2024-10-09T11:18:32.000000",
                  "timezone_type": 3,
                  "timezone": "America/Sao_Paulo"
                }
              }
            ]
          }
        ],
        "links": {
          "self": {
            "href": "http://craUF.api.crabr.com.br/titulo/000000000"
          }
        }
      }
    ]
  },
  "total_items": 1
}
```
