

<!-- ocr-retry page 1 -->

Metodos e Parâmetros do Web Service
Os dados (parâmetros) devem ser enviados via protocolo
) SoAP .Ao consumir o
WebService, em todos os serviços, a autenticação devera ser realizada utilizando
autenticação basica.
Deverao ser passados os parâmetros de
e senha ,fornecidos pela CRA.
usuário e
Apos a autenticação serao validados os parâmetros de entrada e por ultimo a critica
do arquivo.
Notas Tecnicas
O encoding do XML deve corresponder com
IS0-8859-1.
Assim como no HTML, o XML possui entidades, que devem ser substituidas conforme
tabela abaixo:
De
Para
&lt;
&gt;
&api
&aposi
&audt,

<br>

---

<!-- page 1 -->

Remessa

## Upload do arquivo de remessa.

## Confirmacao

## Download do arquivo de confirmacao.

## Retorno

Download do arquivo de retorno.

## Desistencia

Upload de desisténcia.

## Cancelamento

Upload de cancelamento.

## Autoriza Cancelamento

Upload de autorizacao de cancelamento.

## Autoriza Desistencia

Upload de autorizacao de desistéencia.

## Homologadas

## Download de comarcas homologadas.

## Consulta

Consulta de titulo.

## Consulta_slip

Consulta de dados do slip

## Instrumento

## Consulta dos instrumentos eletronicos.

## Imagem

Upload de imagens do titulo apos o envio da remessa.

Oficio Titulo

Upload do arquivo de oficio.

---

<!-- page 2 -->

Parâmetros dos Serviços

## Upload

## user_arq

## Nome do arquivo no formato FEBRABAN.

user dados

Conteudo do arquivo XML

## Download

## user_arq

Nome do arquivo no formato FEBRABAN.

## Homologadas

## codapres

Informar o código do apresentante.

cartorios

Informar '1' para obter dados dos cartorios (OPCIONAL)

## Consulta

## nosso número

Nosso número do titulo no CRA21.

número titulo

Número do titulo no CRA21.

## Consulta_Slip

cod municipio

Código do municipio no formato FEBRABAN.

cod cartorio

Código do cartorio

protocolo

---

<!-- page 3 -->

Número do protocolo.

data_protocolo

Data do protocolo.

## Instrumento

## userArq

Formato informado em Download e Consulta

## Imagem

## userArq

Nome do arquivo no formato FEBRABAN.

## userDados

Conteudo do arquivo XML em Envio de Imagens.

## Oficio_ Titulo

## userArq

Nome do arquivo no formato definido.

## userDados

Conteudo do arquivo XML em Envio de oficio

---

<!-- page 4 -->
