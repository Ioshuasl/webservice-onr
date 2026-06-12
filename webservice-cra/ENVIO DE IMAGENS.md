**Envio de imagens** Estimated reading: 3 minutes 51 views 

O sistema permite o upload de arquivos com tamanho máximo de 200MB por arquivo. 

---

Métodos de Envio de Imagem 

1. Imagem do Título no Arquivo de Remessa 

* 1. As imagens podem ser assinadas opcionalmente. 


* 2. Compactar os arquivos de imagens para a extensão *.zip. 


* 3. Converter o arquivo compactado para base64. 


* 4. Inserir o código gerado no atributo t51 da tag `<tr />` do XML. 


* 5. O restante do conteúdo do arquivo deve estar de acordo com o Layout pré-estabelecido. 



```xml
Cremessa>
<hd.../>
<tr... t51="YBIFADZOBQACA==".../>
$\pm1.../>$
</remessa>

```



---

2. Imagem do Título em Arquivo de Imagem 

* 1. As imagens podem ser assinadas opcionalmente. 


* 2. Compactar os arquivos de imagens para a extensão *.zip. 


* 3. Converter o arquivo compactado para base64. 


* 4. Inserir o código gerado na tag `<imagem>` do XML. 


* 5. O restante do conteúdo do arquivo deve corresponder com o Layout pré-estabelecido. 



> 
> **Copiar** 
> 
> 

```xml
<?xml version $=^{\prime\prime}1.0^{\prime\prime}$ encoding="ISO-8859-1" standalone="no" ?>
 Cremessas>
<remessa>
<sequencial>000249</sequencial>
<municipio>3100203</municipio>
<titulos>
<titulo>
Copiar
<documento_devedor>10964681668</documento_devedor>
<nosso numero>1350100099999</nosso numero>
<numero_titulo 13501000999</numero_titulo>
<saldo>5114.85</saldo>
<imagem>UESDBBQAAAATALdVXVMk==</imagem>
</titulo>
</titulos>
</remessa>
</remessas>

```



---

3. Imagem em Arquivo de Cancelamento/Desistência 

* 1. As imagens podem ser assinadas opcionalmente. 


* 2. Compactar os arquivos de imagens para a extensão *.zip. 


* 3. Converter o arquivo compactado para base64. 


* 4. Inserir o código gerado na tag `<imagem>` do XML. 



```xml
<?xml version $=^{\prime\prime}1.0^{\prime\prime}$ encoding="ISO-8859-1" standalone="no" ?>
 <desistencia>
<comarca>
<cartoria>
<titulo>
<image>YBIFAEZOBQACA==</imagem>
</titulo>
</cartorio>
</comarca>
</desistencia>

```



---

4. Imagem em Arquivo de Autorização 

> 
> **IMPORTANTE:** Ao enviar imagens pelo serviço, a aplicação não gerará a carta de autorização, ou seja, o apresentante deverá gerar e enviar a carta de autorização. 
> 
> 

* 1. As imagens devem ser assinadas se o parâmetro "exige autorização assinada" estiver cadastrado na CRA. 


* 2. Converter o arquivo PDF ou assinado (P7S) para base64. 


* 3. Inserir o código gerado na tag `<imagem>` do XML. 



```xml

```