**Imagens da remessa** Estimated reading: 2 minutes 55 views 

---

Estrutura do Arquivo 

| Atributo / Tag | Descrição | Tamanho | Tipo | Casas Decimais |
| --- | --- | --- | --- | --- |
| <br>`<remessas>` 

 | Tag de Remessas 

 | - | - | - |
| <br>`<remessa>` 

 | Tag de Remessa 

 | - | - | - |
| <br>`<sequencial>` 

 | Número sequencial da remessa 

 | 006 

 | Numérico 

 | Nenhuma 

 |
| <br>`<municipio>` 

 | Código do Município da Praça de Pagamento 

 | 007 

 | Alfanumérico 

 | - |
| <br>`<titulos>` 

 | Tag de títulos da remessa 

 | - | - | - |
| <br>`<titulo>` 

 | Tag de título na remessa 

 | - | - | - |
| <br>`<documento devedor>` 

 | Documento do devedor 

 | 014 

 | Numérico 

 | Nenhuma 

 |
| <br>`<nosso_numero>` 

 | Nosso número 

 | 015 

 | Alfanumérico 

 | - |
| <br>`<numero_titulo>` 

 | Número do Título 

 | 011 

 | Alfanumérico 

 | - |
| <br>`<saldo>` 

 | Saldo do Título 

 | 011 

 | Numérico 

 | 2 

 |
| <br>`<imagem>` 

 | Imagem arquivo compactado em formato .zip convertido em base 64. Extensões .pdf, .jpg, .png e .p7s 

 | - | - | - |

---

Exemplo de XML Completo 

Abaixo está o bloco de código exato conforme documentado:

```xml
<remessas>
<remessa>
<sequencial>001184</sequencial>
<municipio>1234567</municipio>
 <titulos>
<titulo>
<documento devedor>12966628000125</documento devedor>
<nosso numero>112-29098743-0</nosso numero>
<numero_titulo>0424776302</numero_titulo>
<saldo>99.00</saldo>
<imagem>UEsDBBQAAA...</imagem>
</titulo>
</titulos>
</remessa>
<remessa>
<sequencial>001185</sequencial>
<municipio>1234567</municipio>
<titulos>
<titulo>
<documento devedor>19314704000167</documento devedor>
<nosso numero>109-00006850-9</nosso_numero>
<numero_titulo>0156402301</numero_titulo>
<saldo>99.55</saldo>
<imagem>UESDBBQAAA...</imagem>
</titulo>
<titulo>
<documento_devedor>11161204000120</documento_devedor>
<nosso numero>112-27570574-0</nosso numero>
<numero titulo>566839027</numerot titulo>
<saldo>99.00</saldo>
<imagem>UESDBBQAAA...</imagem>
</Litulo>
</titulos>
</remessa>
</remessas>

```

> 
> **Copiar** 
> 
>