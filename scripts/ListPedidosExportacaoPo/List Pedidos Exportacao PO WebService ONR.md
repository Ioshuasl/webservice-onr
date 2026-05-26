# List Pedidos Exportacao PO WebService ONR

Proxy n8n HTTP -> SOAP para o metodo `ListPedidosExportacaoPO` do modulo Penhora Online.

## Endpoint n8n

- Workflow: `List Pedidos Exportacao PO`
- Workflow ID: `lY1cDcyN3GRAuh9f`
- Webhook path: `b28f7a63-4d9d-40a3-a7ac-d7b53a6a8f1d`
- Metodo HTTP: `POST`
- Autenticacao: Basic Auth do n8n

## Request JSON

```json
{
  "hash": "HASH_SHA1_EM_HEXADECIMAL",
  "protocolo": "",
  "id_tipo_pedido": -1,
  "id_status": -1,
  "id_vara": -1,
  "data_solicitacao_inicial": "2025-02-01",
  "data_solicitacao_final": "2025-02-28",
  "data_resposta_inicial": "",
  "data_resposta_final": "",
  "url_servico_onr": "https://hml3-wsoficio.onr.org.br/penhoraonline.asmx"
}
```

## Mapeamento JSON -> SOAP

| Campo JSON | Campo SOAP | Obrigatorio | Observacao |
|------------|------------|-------------|------------|
| `hash` | `Hash` | sim | SHA-1 em hexadecimal, calculado com chave da serventia + token |
| `protocolo` | `Protocolo` | nao | Filtro opcional |
| `id_tipo_pedido` | `IDTipoPedido` | sim | `-1`, `1`, `2` ou `3` |
| `id_status` | `IDStatus` | sim | `-1`, `1`, `2`, `3`, `5`, `7` a `14` |
| `id_vara` | `IDVara` | sim | `-1` para todas ou ID positivo |
| `data_solicitacao_inicial` | `DataSolicitacaoInicial` | sim | Formato `aaaa-mm-dd` |
| `data_solicitacao_final` | `DataSolicitacaoFinal` | sim | Periodo maximo de 30 dias |
| `data_resposta_inicial` | `DataRespostaInicial` | nao | Formato `aaaa-mm-dd` quando informado |
| `data_resposta_final` | `DataRespostaFinal` | nao | Formato `aaaa-mm-dd` quando informado |
| `url_servico_onr` | Endpoint HTTP | sim | Default homologacao ONR |

## Ordem do envelope SOAP

1. `Hash`
2. `Protocolo`
3. `IDTipoPedido`
4. `IDStatus`
5. `IDVara`
6. `DataSolicitacaoInicial`
7. `DataSolicitacaoFinal`
8. `DataRespostaInicial`
9. `DataRespostaFinal`

## Response JSON

```json
{
  "status_http": 200,
  "sucesso": true,
  "codigo_erro": 0,
  "mensagem_erro": "",
  "dados": {
    "filtros": {
      "protocolo": "",
      "id_tipo_pedido": -1,
      "id_status": -1,
      "id_vara": -1,
      "data_solicitacao_inicial": "2025-02-01",
      "data_solicitacao_final": "2025-02-28",
      "data_resposta_inicial": "",
      "data_resposta_final": ""
    },
    "quantidade_pedidos": 1,
    "pedidos": [
      {
        "id_pedido": 123,
        "id_processo": 456,
        "id_tipo_pedido": 3,
        "id_status": 1,
        "tipo_penhora": 1,
        "tipo_certidao": 1,
        "protocolo": "PO123",
        "numero_processo": "0000000-00.0000.0.00.0000",
        "data_pedido": "2025-02-01",
        "estado": "SP",
        "comarca": "Sao Paulo",
        "foro": "",
        "id_vara": 10,
        "vara": "1a Vara",
        "nome_pesquisado": "Nome",
        "cpf_cnpj": "00000000000",
        "matricula_pesquisada": "12345",
        "imoveis_direito": "",
        "data_transferencia": "",
        "mandado": "",
        "natureza_execucao": "",
        "id_grupo_reenvio": "",
        "usuario": "",
        "usuario_cpf": "",
        "valor_da_divida": "",
        "partes": [
          {
            "id_parte": 1,
            "nome": "Parte",
            "cpf_cnpj": "00000000000",
            "qualidade": "Executado",
            "passivo_penhora": "S"
          }
        ],
        "imoveis": [
          {
            "id_imovel": 1,
            "proprietario": "Proprietario",
            "estado": "SP",
            "comarca": "Sao Paulo",
            "matricula": "12345",
            "endereco": "",
            "bairro": "",
            "municipio": "",
            "tipo_constricao": "",
            "imovel_data_auto_termo": "",
            "polo_passivo": "",
            "motivo_tipo": "",
            "outros_motivos": "",
            "estado_civil": "",
            "nome_conjuge": "",
            "intimado_penhora": "",
            "data_intimacao": "",
            "motivo_dispensa": "",
            "nome_depositario": "",
            "tipo_emolumento": "",
            "data_decisao": "",
            "folhas": "",
            "percentual_executado": "",
            "percentual_penhorado": ""
          }
        ]
      }
    ]
  }
}
```

## Status HTTP

| Situacao | HTTP |
|----------|------|
| `RETORNO=true` | `200` |
| Validacao local ou codigos `10`, `11`, `14` a `23` | `400` |
| Codigos de hash `45`, `46`, `47` | `401` |
| Permissao ou usuario/instituicao inativos | `403` |
| Usuario nao encontrado | `404` |
| Erro sistemico ONR / XML invalido / conexao | `502` |
| Falha transitoria ONR | `503` |
| Demais erros de negocio | `422` |

## Validacoes locais

- `hash` e obrigatorio e deve ter 40 caracteres hexadecimais.
- `id_tipo_pedido` aceita `-1`, `1`, `2` ou `3`.
- `id_status` aceita `-1`, `1`, `2`, `3`, `5`, `7`, `8`, `9`, `10`, `11`, `12`, `13` ou `14`.
- `id_vara` aceita `-1` ou inteiro positivo.
- Datas de solicitacao sao obrigatorias no formato `aaaa-mm-dd`.
- Periodo entre `data_solicitacao_inicial` e `data_solicitacao_final` nao pode exceder 30 dias.
- Datas de resposta sao opcionais, mas devem usar `aaaa-mm-dd` quando informadas.
