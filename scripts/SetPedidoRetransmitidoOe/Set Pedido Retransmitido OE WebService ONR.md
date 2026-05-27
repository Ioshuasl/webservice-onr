# Set Pedido Retransmitido OE WebService ONR

Proxy n8n HTTP -> SOAP para o metodo `SetPedidoRetransmitidoOE` do modulo Oficios Eletronicos.

## Endpoint n8n

- Workflow: `Set Pedido Retransmitido OE`
- Workflow ID: `9euY3Y5fEQ7QPin0`
- Webhook path: `74213246-f338-4574-ae26-17a12337a247`
- Metodo HTTP: `POST`
- Autenticacao: Basic Auth do n8n

## Request JSON

```json
{
  "hash": "HASH_SHA1_EM_HEXADECIMAL",
  "id_pedido": 12345,
  "id_cartorio": 987,
  "observacoes": "Retransmissao para cartorio competente.",
  "url_servico_onr": "https://hml3-wsoficio.onr.org.br/oficios.asmx"
}
```

## Mapeamento JSON -> SOAP

| Campo JSON | Campo SOAP | Obrigatorio | Observacao |
|------------|------------|-------------|------------|
| `hash` | `Hash` | sim | SHA-1 em hexadecimal, calculado com chave da serventia + token |
| `id_pedido` | `IDPedido` | sim | Inteiro positivo |
| `id_cartorio` | `IDCartorio` | sim | Cartorio destino permitido para o pedido |
| `observacoes` | `Observacoes` | nao | Omitido do envelope quando vazio |
| `url_servico_onr` | Endpoint HTTP | sim | Default homologacao ONR |

## Ordem do envelope SOAP

1. `Hash`
2. `IDPedido`
3. `IDCartorio`
4. `Observacoes` (opcional)

## Response JSON

```json
{
  "status_http": 200,
  "sucesso": true,
  "codigo_erro": 0,
  "mensagem_erro": "",
  "dados": {
    "id_pedido": 12345,
    "id_cartorio": 987,
    "observacoes": "Retransmissao para cartorio competente.",
    "retransmitido": true
  }
}
```

## Status HTTP

| Situacao | HTTP |
|----------|------|
| `RETORNO=true` | `200` |
| Validacao local ou codigos `2`, `10`, `11`, `12`, `13` | `400` |
| Codigos de hash `45`, `46`, `47` | `401` |
| Sem permissao (`52`) | `403` |
| Pedido nao encontrado (`51`) | `404` |
| Regras de conflito (`501`, `502`) | `409` |
| Erro de negocio de elegibilidade (`503`, `504`) | `422` |
| Erro sistemico ONR / XML invalido / conexao | `502` |
| Falha transitoria ONR | `503` |

## Validacoes locais

- `hash` e obrigatorio e deve ter 40 caracteres hexadecimais.
- `id_pedido` e obrigatorio e deve ser inteiro positivo.
- `id_cartorio` e obrigatorio e deve ser inteiro positivo.
- `url_servico_onr` e obrigatoria e deve ser URL `http` ou `https` valida.
