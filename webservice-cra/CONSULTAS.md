## Consultas

Estimated reading: 1 minute : 223 views

## COMARCASHOMOLOGADAS

Informar os seguintes parametros:

## codapres

Serao retornados todos os municipios e as comarcas associadas que estao habilitados para o apresentante informado.

## cartorios

(Opcional) Informe "1" para consultar os dados dos cartorios que o apresentante esta habilitado a enviar titulos.

## Exemplo de Chamada (PHP)

> / Consulta comarcas cartorios para apresentante1999" Copiar $resultadoXml = $client-  omologadas（'999'，'1'）;

## CONSULTA

## Informar os parametros "nossoNúmero" e "númeroTitulo"

## Exemplo de Chamada (PHP)

/ Consulta um titulo especifico

$nossoNúmero 1123456789012345＇;

$númeroTitulo 987654321＇;

$resultadoXml = $client-  onsulta($nossoNúmero, $númeroTitulo);

---

<!-- page 1 -->

CONSULTA SLIP

Informar os parametros “cod_municipio",“"cod_cartorio","protocolo" e“data_protocolo".

Observagao: Informar a "data_protocolo" no padrao brasileiro. Ex.: 02/05/2016.

## Exemplo de Chamada (PHP)

/Consulta OS dados do slip de um protocolo Copiar

sparams

' cod municipio'[=>] 3550308 'cod cartorio' => 01 "protocolo' => 11234567890＇

'data_protocolo'=>'02/05/2016'

$resultadoXml = $client  Consulta Slip($params);

---

<!-- page 2 -->
