**Arquivo de andamento** Estimated reading: 4 minutes 49 views 

---

Objetivo e Métodos de Acesso 

O objetivo desse arquivo é viabilizar que as informações de andamento dos títulos sejam enviadas para a CRA e, consequentemente, para o apresentante. 

Opções de Download para o Apresentante 

O Apresentante terá à disposição três opções para baixar essas informações: 

1. Download via arquivo TXT. 


2. Download via arquivo XML. 


3. Consulta Manual, disponível pela aplicação web. 



Passo a Passo para o Download 

1. 
**Acesse a tela de download**: No menu principal do sistema, navegue até a opção Andamento > Download Andamento. 


2. 
**Baixe os arquivos pendentes**: Se houver arquivos disponíveis para download, o sistema os listará com o status "Pendente". Para baixar, basta clicar no ícone de download azul ao lado do arquivo desejado. 


3. 
**Como baixar um arquivo novamente (já baixado)**: Se você precisar baixar um arquivo que já foi coletado, siga estes passos: 


* Utilize o campo de busca "Data do Andamento" para informar a data do arquivo. O sistema exibirá os arquivos da data selecionada, que estarão marcados como Baixado: "Sim". 


* Clique no mesmo ícone azul de download para baixá-lo novamente. 





---

Andamento em XML 

Para efetuar o download do arquivo via XML é necessário utilizar a URL do WEBSERVICE e invocar o endpoint Andamento. 

Nomenclatura do Arquivo 

Na tag `<userArq>`, informe o nome do arquivo que deseja baixar, obedecendo a seguinte estrutura: 

```text
MCCCDDMM.AAS

```

> 
> **Copiar** 
> 
> 

* 
**M**: Constante - Identifica tratar-se do arquivo de andamento. 


* 
**CCC**: Código do Apresentante/Portador ou constante 000. 


* 
**DD**: Dia do envio do arquivo de andamento. 


* 
**MM**: Mês do envio do arquivo de andamento. 


* 
**AA**: Ano do envio do arquivo de andamento. 


* 
**S**: Número Sequencial do arquivo (mínimo 1, máximo 9). 



O download trará as informações da data informada no nome do arquivo e também as que estiverem pendentes de download de datas anteriores. 

---

Exemplo de Requisição (SoapUI) 

```xml
<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:cradf.crateste.com.br">
<soapenv:Header/>
<soapenv:Body>
<urn:Andamento soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
<userArq xsi:type="xsd:string">M0002308.231</userArq>
</urn:Andamento>
</soapenv:Body>
</soapenv:Envelope>

```

> 
> **Copiar** 
> 
> 

---

Exemplo de Resposta (SoapUI) 

Os dados apresentados na resposta são fictícios. 

```xml
<SOAP-ENV:Envelope SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/" xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/">
<SOAP-ENV:Body>
<ns1:AndamentoResponse xmlns:ns1="urn:cradf.crateste.com.br">
<return xsi:type="xsd:string">
<![CDATA[<?xml version="1.0" encoding="ISO-8859-1" standalone="no"?>
<relatorio>
<nome_arquivo>M0002308.231</nome_arquivo>
<comarca CodMun="5300108">
<hd h01="0" h02="000" h03="APRESENTANTE" h04="23082023" h05="SDT" h06="BFO" h07="AND" h08="000001" h09="0024" h10="0000" h11="0000" h12="0000" h13="114043" h15="5300108" h16="" h17="0001" />
<tr t01="1" t02="000" t03="221832325837281" t04="ANDRESSA LIRA LOZANO" t05="DR. JULIO SANDOVAL FIDALGO" t06="05280532000143" t07="38109-330, AV. DENIS GUERRA, 25194DIOGO DO LE" t08="63720372" t09="SANTA AUGUSTO" t10="MT" t11="092/0159-840419" t12="DR" t13="685-361/969" t14="09072023" t15="24072023" t16="001" t17="7889.42" t18="7959.74" t19="ESTELA DO LESTE" t20="M" t21="N" t22="1" t23="CRISTIAN RICHARD DIAS" t24="002" t25="00003338759908" t26="0000000000000" t27="42100-067, TRAVESSA JAMES VELASQUES, 467FRANC" t28="04092842" t29="JOYCE DO LESTE" t30="RN" t31="59" t32="64553/3335" t33="0" t34="23082023" t35="0" t36="" t37="23082023" t38="AB" t39="LARGO MARILIA, 45" t40="0" t41="000000" t42="0" t43="000000" t44="0000000000000" t45="000" t46="" t47="" t48="" t49="" t50="0" t51="23082023:210000" t52="0025" />
<tl t01="9" t02="000" t03="APRESENTANTE" t04="23082023" t05="00024" t06="205153.59" t07="" t08="0028"/>
</relatorio>]]>
</return>
</ns1:AndamentoResponse>
</SOAP-ENV:Body>
</SOAP-ENV:Envelope>

```