# CTP

### Documento de detalhadamento da carga

[Documentação CTP](https://suporte.notariado.org.br/support/solutions/articles/43000733326-ctp-especificac%C3%A3o-dos-campos-de-carga)

Este documento apresenta as características do arquivo CTP-Comunicação de Transações às Prefeituras, a ser configurado pelos sistemas de gestão de cartórios para transmissão à CENSEC.

### Exemplo de Corpo da Requisição

```json
{
  "cns": 991018, 
  "quinzena": {
	"anoReferencia": 2024,
    "mesReferencia": 7,
    "quinzenaReferencia": 1
    }, 
  "declaracoes": [
    {
      "adquirentes": [
        {
          "cpfConjuge": "00000000191",
          "cpfInventariante": "00000000272",
          "indicadorConjuge": true,
          "indicadorConjugeParticipa": true,
          "indicadorCpfConjugeIdentificado": true,
          "indicadorEspolio": true,
          "indicadorEstrangeiro": true,
          "indicadorNaoConstaParticipacaoOperacao": false,
          "indicadorNiIdentificado": true,
          "indicadorRepresentante": true,
          "ni": "00000000353",
          "participacao": 100,
          "regimeBens": "ComunhaoUniversalDeBens",
          "representantes": [
            {
              "ni": "00000000191"
            }
          ]
        }
      ],
      "alienantes": [
        {
          "cpfInventariante": "00000000272",
          "indicadorConjuge": true,
          "indicadorConjugeParticipa": true,
          "indicadorCpfConjugeIdentificado": false,
          "indicadorEspolio": true,
          "indicadorEstrangeiro": false,
          "indicadorNaoConstaParticipacaoOperacao": false,
          "indicadorNiIdentificado": false,
          "indicadorRepresentante": false,
          "motivoNaoIdentificacaoNi": "SemCPFCNPJDecisaoJudicial",
          "participacao": 100,
          "regimeBens": "SeparacaoDeBens",
          "representantes": []
        }
      ],
      "areaImovel": 100,
      "bairro": "Limoeiro",
      "cep": "02520300",
      "matricula": "21314432",
      "certidaoAutorizacaoTransferencia": "1234567890",
      "cib": "12345678",
      "complementoEndereco": "Próximo ao Campinho",
      "complementoNumeroImovel": "A",
      "dataLavraturaRegistroAverbacao": "2024-07-01",
      "dataNegocioJuridico": "2024-06-01",
      "destinacao": "Urbano",
      "formaPagamento": "QuitadoAVista",
      "indicadorAreaConstruidaNaoConsta": true,
      "indicadorAreaLoteNaoConsta": false,
      "indicadorImovelImportado": true,
      "indicadorImovelPublicoUniao": true,
      "indicadorNaoConstaValorBaseCalculoItbiItcmd": false,
      "indicadorNaoConstaValorOperacaoImobiliaria": false,
      "indicadorPagamentoDinheiro": false,
      "indicadorPermutaBens": true,
      "inscricaoMunicipal": "123456",
      "codigoIbge": "3550308",
      "municipiosUF": [],
      "nomeLogradouro": "do Limão",
      "numeroImovel": "32",
      "numeroReciboDeclaracaoRetificada": 50,
      "numeroRegistro": "1234567",
      "registroImobiliarioPatrimonial": "1234567890123",
      "tipoAto": "Escritura",
      "tipoDeclaracao": "Original",
      "tipoImovel": "Casa",
      "tipoLogradouro": "Rua",
      "tipoOperacaoImobiliaria": "Adjudicacao",
      "tipoParteTransacionada": "Percentual",
      "valorBaseCalculoItbiItcmd": 7191.71,
      "valorOperacaoImobiliaria": 62284.09,
      "valorParteTransacionada": 15074.01,
      "folha": "201",
      "numeroLivro": "15"
    }
  ]
}
```

### Schema de validação carga CCN

[Arquivo: CCN v4 (2).xsd](https://orius-tools.s3.sa-east-1.amazonaws.com/community/1777903150798-CCN%20v4%20(2).xsd)
