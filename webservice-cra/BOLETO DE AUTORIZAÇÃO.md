**Boletos de autorização** Estimated reading: 2 minutes 43 views 

---

Serviço Disponível 

* 
**BoletoAutorizacao**: Download de boletos de autorização. 



Parâmetros de Requisição 

* 
**numeroTitulo**: Número do título. 


* 
**documentoDevedor**: Documento do devedor. 



---

Estrutura da Resposta 

| Atributo 

 | Descrição 

 |
| --- | --- |
| <br>`boleto` 

 | Base64 do boleto. 

 |
| <br>`nomeMunicipio` 

 | Nome do município. 

 |
| <br>`nomeCartorio` 

 | Nome do cartório. 

 |
| <br>`valorTitulo` 

 | Valor do título. 

 |
| <br>`saldoTitulo` 

 | Saldo do título. 

 |
| <br>`nossoNumero` 

 | Nosso número. 

 |
| <br>`nomeDevedor` 

 | Nome do devedor. 

 |

---

Exemplos de Requisição e Resposta 

Exemplo de Requisição do Serviço 

```xml
<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:localhost">
<soapenv:Header/>
<soapenv:Body>
<urn:BoletoAutorizacao soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
<numeroTitulo xsi:type="xsd:string">999999999</numeroTitulo>
<documentoDevedor xsi:type="xsd:string">999999999</documentoDevedor>
</urn:BoletoAutorizacao>
</soapenv:Body>
</soapenv:Envelope>

```

(Estrutura em XML obtida a partir das fontes )

> 
> **Copiar** 
> 
> 

Exemplo de Resposta do Serviço 

```xml
<relatorio>
<boleto>JVBERi0xLjMKMyAwIG9iago</boleto>
<nomeMunicipio>Nome do Municipio</nomeMunicipio>
<nomeCartorio Nome de cartório do municipio</nomeCartorio>
<valorTitulo>99999.99</valorTitulo>
<saldoTitulo>99999.99</saldoTitulo>
<nossoNumero>99999999</nossoNumero>
<nomeDevedor>Nome do Devedor</nomeDevedor>
</relatorio>

```

(Estrutura em XML obtida a partir das fontes )

> 
> **Copiar** 
> 
> 

---

Códigos de Erro 

| CÓDIGO 

 | DESCRIÇÃO 

 |
| --- | --- |
| <br>**2298** 

 | Informe pelo menos o número do título 

 |
| <br>**2299** 

 | Foi encontrado mais de um boleto com os dados informados 

 |
| <br>**2300** 

 | Não foi encontrado boleto com os parâmetros informados 

 |
| <br>**10003** 

 | Acesso negado. Contate o administrador. 

 |