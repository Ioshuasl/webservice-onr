# Mapa e Estatísticas ONR

# Arquivo Postman

[Arquivo: Mapa Onr API.postman_collection.json](https://orius-tools.s3.sa-east-1.amazonaws.com/community/1778180425756-Mapa%20Onr%20API.postman_collection.json)

# Documentação API Mapa ONR

## Base URL

https://mapa.onr.org.br/api-estatisticas

## Endpoints

### Autenticação

- endpoint: POST /auth

- path parameters: nenhum

- query parameters: nenhum

- body json:

```json
{
  "cns_cpf": "OTk5OTk5fDk0NjgzMjAwMDY2"
}
```

- resposta de sucesso (201):

```json
{
  "mensagem": "Arquivo enviado com sucesso.",
  "uuid": "2229181396025dad9f752d89c9.27409072",
  "status": "201"
}
```

Para realizar a autenticação, deve ser enviado um JSON contendo cns|cpf em Base64, via método POST:

1. CNS = 999999

2. CPF = 94683200066

### Envio json

- endpoint: POST /enviar-arquivo

- path parameters: nenhum

- query parameters: nenhum

- body json:

```json
{
  "hash": "93104779dfbe834853c7a2146f5b5cb7821e8340",
  "dataEnvio": "15/10/2019",
  "sequencial": "0001",
  "extratos": [
    {
      "cns": "999992",
      "operacao": {
        "numero_controle": "0",
        "data_lavratura": "01/01/2018",
        "livro": "2",
        "folha": "12",
        "matricula": "63767",
        "registro": "1",
        "situacao": "0",
        "atribuicao_doi": "2",
        "tipo_transacao": "11",
        "descricao_tipo_transacao": "Outros",
        "retificacao_ato": "0",
        "data_alienacao": "29/09/2017",
        "forma_alienacao_aquisicao": "5",
        "valor_nao_consta_documentos": "0",
        "valor_alienacao_aquisicao": "103790,00",
        "base_calculo_itbi": "124740,00",
        "tipo_imovel": "17",
        "descricao_tipo_imovel": "Outros",
        "situacao_construcao": "0",
        "localizacao": "1",
        "area_nao_consta": "1",
        "area_imovel": "0",
        "endereco_imovel": "AVENIDA MARIAT ERESA",
        "numero_imovel": "260",
        "complemento_imovel": "SL5 10",
        "bairro_imovel": "CAMPO GRANDE",
        "cep_imovel": "20000000",
        "municipio_imovel": "RIO DE JANEIRO",
        "uf_imovel": "RJ",
        "inscricao_nirf": "32385171",
        "valor_itbi_nao_consta_nos_documentos": "0"
      },
      "alienantes": [
        {
          "cpf_cnpj": "73155455063",
          "participacao_na_operacao": "100,00",
          "cpf_procurador": "19801776005"
        }
      ],
      "adquirentes": [
        {
          "cpf_cnpj": "76596482090",
          "participacao_na_operacao": "50,00",
          "cpf_procurador": "19801776005"
        },
        {
          "cpf_cnpj": "01107774098",
          "participacao_na_operacao": "50,00",
          "cpf_procurador": "19801776005"
        }
      ]
    }
  ]
}
```

### Envio doiweb json

- endpoint: POST /enviar-arquivo

- path parameters: nenhum

- query parameters: nenhum

- body json:

```json
{
  "hash": "93104779dfbe834853c7a2146f5b5cb7821e8340",
  "declaracoes": [
    {
      "adquirentes": [
        {
          "cpfConjuge": "00000000000",
          "cpfInventariante": "00000000000",
          "indicadorConjuge": false,
          "indicadorConjugeParticipa": false,
          "indicadorCpfConjugeIdentificado": false,
          "indicadorEspolio": false,
          "indicadorEstrangeiro": false,
          "indicadorNaoConstaParticipacaoOperacao": false,
          "indicadorNiIdentificado": false,
          "indicadorRepresentante": false,
          "motivoNaoIdentificacaoNi": 0,
          "ni": "",
          "nome": "Nome da parte",
          "nomeConjuge": "",
          "nomeInventariante": "",
          "participacao": 100,
          "regimeBens": "1",
          "representantes": [
            {
              "ni": "",
              "nome": ""
            }
          ]
        }
      ],
      "alienantes": [
        {
          "cpfConjuge": "00000000000",
          "cpfInventariante": "00000000000",
          "indicadorConjuge": false,
          "indicadorConjugeParticipa": false,
          "indicadorCpfConjugeIdentificado": false,
          "indicadorEspolio": false,
          "indicadorEstrangeiro": false,
          "indicadorNaoConstaParticipacaoOperacao": false,
          "indicadorNiIdentificado": false,
          "indicadorRepresentante": false,
          "motivoNaoIdentificacaoNi": 0,
          "ni": "",
          "nome": "Nome da parte",
          "nomeConjuge": "",
          "nomeInventariante": "",
          "participacao": 100,
          "regimeBens": "1",
          "representantes": [
            {
              "ni": "",
              "nome": ""
            }
          ]
        }
      ],
      "areaConstruida": 0,
      "areaImovel": 0,
      "bairro": "",
      "cep": "00000000",
      "certidaoAutorizacaoTransferencia": "",
      "cib": "0",
      "codigoIbge": "",
      "codigoIncra": "",
      "codigoNacionalMatricula": "",
      "complementoEndereco": "",
      "complementoNumeroImovel": "",
      "dataLavraturaRegistroAverbacao": "0000-00-00",
      "dataNegocioJuridico": "0000-00-00",
      "denominacao": "",
      "descricaoOutrasOperacoesImobiliarias": "",
      "destinacao": "1",
      "existeDoiAnterior": false,
      "folha": "0",
      "formaPagamento": "5",
      "indicadorAlienacaoFiduciaria": false,
      "indicadorAreaConstruidaNaoConsta": false,
      "indicadorAreaLoteNaoConsta": false,
      "indicadorImovelImportado": false,
      "indicadorImovelPublicoUniao": false,
      "indicadorNaoConstaValorBaseCalculoItbiItcmd": false,
      "indicadorNaoConstaValorOperacaoImobiliaria": false,
      "indicadorPagamentoDinheiro": false,
      "indicadorPermutaBens": true,
      "inscricaoMunicipal": "123456",
      "localizacao": "distrito",
      "matricula": "",
      "matriculaNotarialEletronica": "",
      "mesAnoUltimaParcela": "",
      "motivoCancelamento": "",
      "municipiosUF": [
        "0000000"
      ],
      "naturezaTitulo": "1",
      "nomeLogradouro": "",
      "numeroImovel": "",
      "numeroLivro": "",
      "numeroReciboDeclaracaoRetificada": 0,
      "numeroRegistro": "",
      "numeroRegistroAverbacao": "",
      "registroImobiliarioPatrimonial": "",
      "retificacaoAto": false,
      "tipoAto": "1",
      "tipoDeclaracao": "0",
      "tipoImovel": "67",
      "tipoLivro": "1",
      "tipoLogradouro": "Rua",
      "tipoOperacaoImobiliaria": "11",
      "tipoParteTransacionada": "1",
      "tipoServico": "2",
      "transcricao": 0,
      "valorBaseCalculoItbiItcmd": 0,
      "valorOperacaoImobiliaria": 0,
      "valorPagoAteDataAto": 0,
      "valorPagoMoedaCorrenteDataAto": 0,
      "valorParteTransacionada": 100
    }
  ]
}
```

- resposta de sucesso (201):

```json
{
  "mensagem": "Arquivo enviado com sucesso.",
  "uuid": "2229181396025dad9f752d89c9.27409072",
  "status": "201"
}
```

### Consultar processamento do json enviado

- endpoint: GET /consultar-arquivo/:uuid

- path parameters:

  - uuid

- query parameters: nenhum

- body json: não se aplica (GET)

- resposta de sucesso (200):

```json
{
  "dados_arquivo": {
    "arquivo_uuid": "7243603176025dd18091c9.83878922",
    "arquivo_data_envio": "15/10/2019 15:54:43",
    "arquivo_status_envio": "OK",
    "arquivo_status_processamento": "OK",
    "descricao_erro": "",
    "arquivo_nome_original": "JSON_API",
    "arquivo_nome_salvo": "999992_sinter_estatistica_json_20191015_155443_c3b30c31bac9905a3f93e76ad2d477c39e0497ef.json",
    "arquivo_tamanho": "2.11 KB",
    "arquivo_inconsistencias": "Registro(s) com inconsistência(s):1ª operação. Campo data da lavratura",
    "cartorio_nome": "Nome do Cartório",
    "cartorio_comarca": "Ilhéus",
    "cartorio_estado": "Bahia",
    "cartorio_cns": "999992",
    "cartorio_ddd_telefone": "12",
    "cartorio_telefone": "3900-1111",
    "cartorio_email_principal": "teste@webcartorios.com.br",
    "usuario_nome": "Nome de usuário"
  },
  "status": "200"
}
```

Atenção ao campo arquivo_status_processamento

- Quando vier OK, o arquivo foi processado corretamente.

- Quando vier ERRO, verificar o campo descricao_erro para identificar o problema.

Exemplos de erro:

```json
{
  "arquivo_status_processamento": "ERRO",
  "descricao_erro": "Erro na validação do arquivo 157776_sinter__estatistica_json_20191205_115033_28002309e6103eced360d0cbca0d84a02274b904.json. Erro, o arquivo enviado possui dados de um lote já enviado, os campos duplicados foram: CNS, Sequencial e Data Envio"
}
```

```json
{
  "arquivo_status_processamento": "ERRO",
  "descricao_erro": "Erro crítico, entrar em contato com o Suporte Técnico."
}
```
