**Ofício** Estimated reading: 2 minutes 44 views 

---

Estrutura do Arquivo de Ofício 

| Atributo / Tag | Descrição | Tamanho | Tipo |
| --- | --- | --- | --- |
| <br>`<CodMun>` 

 | Código IBGE do município 

 | Variável 

 | Numérico 

 |
| <br>`<numero_cartorio>` 

 | código do cartório 

 | Variável 

 | Numérico 

 |
| <br>`<umero_protocolo>` 

 | protocolo 

 | Variável 

 | Alfanumérico 

 |
| <br>`<data_protocolo>` 

 | Data de protocolo 

 | 008 

 | Data (01012025) 

 |
| <br>`<numero titulo>` 

 | Número do título 

 | Variável 

 | Alfanumérico 

 |
| <br>`<nome devedor>` 

 | Nome do devedor 

 | Variável 

 | Alfanumérico 

 |
| <br>`<valor>` 

 | valor 

 | Variável 

 | Decimal 

 |
| <br>`<tipo oficio>` 

 | Tipo de ofício 0 - Suspensão/Sustação 1 - Revogação 2 - Cancelamento/Desistência 99 - Outros 

 | Variável 

 | Numérico 

 |
| <br>`<observacao>` 

 | Observação 

 | Variável 

 | Alfanumérico 

 |
| <br>`<imagem>` 

 | Imagem (base64) 

 | Variável 

 | Alfanumérico 

 |

---

Exemplo de XML Completo 

```xml
<oficio>
<CodMun>3550308</CodMun>
<numero cartorio>01</numero cartorio>
<numero_protocolo>20250001</numero_protocolo>
<data_protocolo>18092025</data_protocolo>
<numero_titulo>12345ABC</numero_titulo>
<nome devedor>EMPRESA EXEMPLO LTDA</nome devedor>
<valor>1500.50</valor>
<tipo_oficio>0</tipo_oficio>
<observacao>Observações pertinentes ao oficio judicial.
</observacao>
<imagem>SEU_CONTEUDO_EM BASE64 AQUI</imagem>
</oficio>

```