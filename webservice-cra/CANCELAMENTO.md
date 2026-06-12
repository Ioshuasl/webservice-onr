Aqui está a transcrição estruturada do documento **CANCELAMENTO.pdf**, formatada rigorosamente em Markdown:

**Cancelamento**
Estimated reading: 2 minutes 130 views

---

### Estrutura do Arquivo de Cancelamento

| Atributo / Tag | Descrição | Tamanho | Tipo | Casas Decimais |
| --- | --- | --- | --- | --- |
| `<cancelamento>` | Tag de Cancelamento | - | - | - |
| `<CodMun>` | Código do Município da Praça de Pagamento | 007 | Alfanumérico | - |
| `<numero cartorio>` | Número do Cartório | 002 | Numérico | Nenhuma |
| `<numero_protocolo>` | Número do Protocolo do Cartório | 010 | Numérico | Nenhuma |
| `<data_protocolo>` | Data do Protocolo | 008 | Numérico | Nenhuma |
| `<numero titulo>` | Número do Título | 011 | Alfanumérico | - |
| `<nome_devedor>` | Nome do Devedor | 045 | Alfanumérico | - |
| `<valor titulo>` | Valor do Título | 014 | Numérico | 2 |
| `<imagem>` | Para solicitação de Desistência ou Cancelamento: Imagens dos documentos zipados e convertidos em base64. Para autorização de Desistência ou Cancelamento: Imagem em PDF convertido em base64. | - | - | - |

---

### Exemplo de XML Completo

```xml
<cancelamento>
<comarca>
<CodMun>3550308</CodMun>
<cartorio>
<numero_cartorio>01</numero_cartorio>
 <titulo>
<numero_protocolo>1234</numero_protocolo>
 <data_protocolo>13082012</data_protocolo>
 <numero_titulo 00345467</numero_titulo>
 <nome_devedor>JOSE SILVA </nome_devedor>
 <valor titulo>268.82</valor titulo>
</titulo>
<titulo>
<numero_protocolo>9999</numero protocolo>
_protocolo>02082012</data_protocolo>
<numere titulo 06879999</numero titulo>
<nome devedor>MARIA SILVA</nome_devedor>
<valor_titulo>1342.65</valor_titulo>
<imagem>YBIFAEZOBQACA=</imagem>
</titulo
</cartorio>
</comarca>
</cancelamento>

```