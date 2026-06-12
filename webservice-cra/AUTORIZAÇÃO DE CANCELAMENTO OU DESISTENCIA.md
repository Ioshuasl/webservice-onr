Aqui está a transcrição estruturada do documento **AUTORIZAÇÃO DE CANCELAMENTO OU DESISTENCIA.pdf**, seguindo rigorosamente o mesmo padrão em Markdown:

**Autorização de Cancelamento/Desistência** Estimated reading: 2 minutes 91 views 

> 
> **DOWNLOAD DO ARQUIVO EXEMPLO** 
> 
> 

---

Estrutura do Arquivo de Autorização 

| Atributo / Tag | Descrição | Tamanho | Tipo | Casas Decimais |
| --- | --- | --- | --- | --- |
| <br>`<autoriza cancelamento>` 

 | Tag de Autorização de Cancelamento 

 | - | - | - |
| <br>`<autoriza desistencia>` 

 | Tag de Autorização de Desistência 

 | - | - | - |
| <br>`<CodMun>` 

 | Código do Município da Praça de Pagamento 

 | 007 

 | Alfanumérico 

 | - |
| <br>`<numero_cartorio>` 

 | Número do Cartório 

 | 002 

 | Numérico 

 | Nenhuma 

 |
| <br>`<numero protocolo>` 

 | Número do Protocolo do Cartório 

 | 010 

 | Numérico 

 | Nenhuma 

 |
| <br>`<data_protocolo>` 

 | Data do Protocolo 

 | 008 

 | Numérico 

 | Nenhuma 

 |
| <br>`<numero_titulo>` 

 | Número do Título 

 | 011 

 | Alfanumérico 

 | - |
| <br>`<nome_devedor>` 

 | Nome do Devedor 

 | 045 

 | Alfanumérico 

 | - |
| <br>`<valor_titulo>` 

 | Valor do Título 

 | 014 

 | Numérico 

 | 2 

 |
| <br>`<imagem>` 

 | Para solicitação de Desistência ou Cancelamento: Imagens dos documentos zipados e convertidos em base64. Para autorização de Desistência ou Cancelamento: Imagem em PDF convertido em base64. 

 | - | - | - |

Para autorizações de cancelamento assinadas digitalmente, a CRA aceita arquivos no formato P7S, independentemente da ferramenta utilizada para a assinatura. Entre os exemplos de certificados digitais utilizados para a assinatura estão o A1 e o A3. 

---

Exemplo de XML Completo 

Abaixo está o bloco de código exato conforme documentado:

```xml
<autoriza cancelamento> ou <autoriza desistencia>
<comarca>
<CodMun>355030B</CodMun>
<cartoric>
<numero_cartorio>01</numero_cartorio>
<titulo>
<numero_protocolo>1234</numero_protocolo>
<data_protocolo>13082012</data_protocolo>
<numero_titulo 00345467</numero titulo>
<nome devedor>JOSE SILVA </nome devedor>
<valor titulo>268.82</valor titulo>
</titulo>
<titulo>
<numero_protocolo>9999</numero_protocolo>
<data_protocolo>02082012</data_protocolo>
<numero_titulo>06879999</numero_titulo>
<nome devedor>MARIA SILVA</nome devedor>
<valor titulo>1342.65</valor titulo>
<imagem>YBIFAEZOBQACA=</imagem>
</titulo>
</cartorio>
</comarca>
</autoriza cancelamento ou </autoriza desistencia>

```