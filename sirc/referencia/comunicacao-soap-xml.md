# Comunicacao SOAP e XML

Fonte: capitulos 2.1, 2.3, 3 e 10 do `manual sirc.md`.

## Modelo de Comunicacao

O envio via Webservice usa SOAP/HTTPS. O aplicativo da serventia:

1. Gera uma sequencia XML conforme layout especificado.
2. Chama remotamente o Webservice do SIRC com os parametros necessarios.
3. O SIRC processa o XML.
4. O resultado e devolvido como relatorio de transmissao em XML.

## Documento XML

- Codificacao: `UTF-8`.
- O XML deve respeitar o XSD disponibilizado pela Dataprev.
- Nao incluir tags que nao estejam no XSD.
- Evitar caracteres de formatacao desnecessarios entre tags.
- Booleanos devem ser escritos em letra minuscula: `true` e `false`.

## Schema XML

O atributo `minOccurs` tem valor padrao `1`; quando ausente, o elemento e obrigatorio.

Nem todas as tags descritas no XSD existirao sempre. A geracao do XML depende das regras de negocio do manual.

## Arquivo de Movimento

Para transferencia de arquivo, o manual define:

- Formato XML.
- Tamanho maximo: 1024 KB.
- Quantidade maxima: 250 registros.
- Compactacao GZIP.
- Criptografia AES.
- Extensao `.mrc`.

## Retorno

O SIRC gera recibo comprovando o envio e relatorio de processamento dos registros. No caso de envio via Webservice, o manual indica devolucao de relatorio de transmissao no formato XML.

