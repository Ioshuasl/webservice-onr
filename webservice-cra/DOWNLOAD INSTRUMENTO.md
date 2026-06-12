**Download instrumento** Estimated reading: 2 minutes 52 views 

---

Recepção/Consulta 

Para apresentantes, é possível verificar o instrumento de protesto eletrônico no sistema através dos seguintes métodos: 

* 1. Verificação Rápida: A consulta pode ser feita diretamente nos menus 'Consulta título' ou 'Consulta retorno'.


* 2. Download de Imagens: O download dos arquivos do instrumento (com ou sem assinatura digital) está disponível no menu 'Retorno' -> 'Download retorno'.



---

Serviço Instrumento (Xml) 

No serviço instrumento, pode ser consultado um instrumento específico ou vários. Para isso, deve-se informar o parâmetro `userDados` com a seguinte estrutura XML:

```xml
<instrumento>
<municipios>
<municipio>
<codigoMunicipio>3100203</codigoMunicipio>
<cartorios>
<cartorio>
<codigoCartorio>01</codigoCartorio>
<titulos>
<titulo>
<protocolo>0000038317</protocolo>
<dataProtocolo>28/12/2018</dataProtocolo>
</titulo>
<titulo>
<protocolo>1020304050</protocolo>
<dataProtocolo 01/03/2018</dataProtocolo>
</titulo>
</titulos>
</cartorio>
</cartorios>
</municipio>
<municipio>
<codigoMunicipio>3100209</codigoMunicipio>
<cartorios>
<cartorio>
<codigoCartorio>02</codigoCartorio>
<titulos>
<titulo>
<protocolo>5040302010</protocolo>
<dataProtocolo 28/12/2018</dataProtocolo>
</titulo>
<titulo>
<protocolo>1738544625</protocolo>
<dataProtocolo>28/12/2018</dataProtocolo>
</titulo>
</titulos>
</cartorio>
</cartorios>
</municipio>
</municipios>
</Instrumento>

```