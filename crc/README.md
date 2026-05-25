# CRC - Webservices de Certidão

Fonte: [manual crc.md](manual%20crc.md), convertido a partir de `manual crc.pdf`.

Este diretório organiza o manual CRC por serviço CFC, mantendo o arquivo convertido original como referência bruta.

## Serviços

| Serviço | Arquivo | Finalidade | Produção |
| --- | --- | --- | --- |
| `obter2aViaCertidaoPendente.cfc` | [obter-2a-via-certidao-pendente.md](obter-2a-via-certidao-pendente.md) | Obter pedidos de 2ª via de certidão pendentes para o cartório dono do registro. | `http://ws.registrocivil.org.br/obter2aViaCertidaoPendente.cfc?wsdl`, `https://ws.registrocivil.org.br/obter2aViaCertidaoPendente.cfc?wsdl` |
| `enviarCertidao.cfc` | [enviar-certidao.md](enviar-certidao.md) | Enviar os dados da 2ª via da certidão para o cartório solicitante. | `http://ws.registrocivil.org.br/enviarCertidao.cfc?wsdl`, `https://ws.registrocivil.org.br/enviarCertidao.cfc?wsdl` |
| `obterRegistrosCarregados.cfc` | [obter-registros-carregados.md](obter-registros-carregados.md) | Listar registros já carregados pelo cartório. | `http://ws.registrocivil.org.br/obterRegistrosCarregados.cfc?wsdl`, `https://ws.registrocivil.org.br/obterRegistrosCarregados.cfc?wsdl` |

## Arquivos XML

- `obter2aViaCertidaoPendente.xml`: consulta pedidos de certidão pendentes.
- `enviarCertidao`: layouts por tipo de certidão, incluindo nascimento, casamento, óbito, emancipação, interdição, ausência e união estável.
- `obterRegistrosCarregados.xml`: consulta registros carregados por CNS, tipo de registro, livro e intervalo de datas.

## Tipos de Registro

O manual usa os seguintes códigos:

- `N`: Nascimento
- `C`: Casamento
- `O`: Óbito
- `TN`: Transcrição de Nascimento
- `TC`: Transcrição de Casamento
- `U`: União Estável
- `TO`: Transcrição de Óbito
- `E`: Emancipação
- `I`: Interdição
- `A`: Ausência

## Observações

Os XMLs devem ser assinados e enviados em formato BASE64, conforme indicado no manual.

Para emissão de 2ª via, preencher o grupo `<emissao>` e deixar `<rejeicao>` nulo. Para rejeição, preencher `<rejeicao>` e deixar `<emissao>` nulo.
