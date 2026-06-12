Segue a transcrição do arquivo **"DESISTENCIA.pdf"**.

# Desistência

**Estimated reading:** 2 minutes
**Views:** 87

## Arquivo de Desistência

| Atributo / Tag       | Descrição                                                                                                                                                                                     | Tamanho | Tipo         | Casas Decimais |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ------------ | -------------- |
| `<desistencia>`      | Tag de Desistência                                                                                                                                                                            | —       | —            | —              |
| `<CodMun>`           | Código do Município da Praça de Pagamento                                                                                                                                                     | 007     | Alfanumérico | —              |
| `<numero_cartorio>`  | Número do Cartório                                                                                                                                                                            | 002     | Numérico     | Nenhuma        |
| `<numero_protocolo>` | Número do Protocolo do Cartório                                                                                                                                                               | 010     | Numérico     | Nenhuma        |
| `<data_protocolo>`   | Data do Protocolo                                                                                                                                                                             | 008     | Numérico     | Nenhuma        |
| `<numero_titulo>`    | Número do Título                                                                                                                                                                              | 011     | Alfanumérico | —              |
| `<nome_devedor>`     | Nome do Devedor                                                                                                                                                                               | 045     | Alfanumérico | —              |
| `<valor_titulo>`     | Valor do Título                                                                                                                                                                               | 014     | Numérico     | 2              |
| `<imagem>`           | Para solicitação de Desistência ou Cancelamento: imagens dos documentos zipados e convertidos em Base64. Para autorização de Desistência ou Cancelamento: imagem em PDF convertida em Base64. | —       | —            | —              |

---

# Exemplo de XML Completo

```xml
<desistencia>

    <comarca>

        <CodMun>3550308</CodMun>

        <cartorio>

            <numero_cartorio>01</numero_cartorio>

            <titulo>

                <numero_protocolo>1234</numero_protocolo>
                <data_protocolo>13082012</data_protocolo>
                <numero_titulo>00345467</numero_titulo>
                <nome_devedor>JOSE SILVA</nome_devedor>
                <valor_titulo>268.82</valor_titulo>

            </titulo>

            <titulo>

                <numero_protocolo>9999</numero_protocolo>
                <data_protocolo>02082012</data_protocolo>
                <numero_titulo>06879999</numero_titulo>
                <nome_devedor>MARIA SILVA</nome_devedor>
                <valor_titulo>1342.65</valor_titulo>
                <imagem>YBIFAEZ0BQAcA=</imagem>

            </titulo>

        </cartorio>

    </comarca>

</desistencia>
```

### Observações

* O XML permite informar múltiplos títulos dentro de um mesmo cartório.
* O campo `<imagem>` deve conter o conteúdo convertido para **Base64**.
* Para **solicitação de desistência/cancelamento**, o documento deve ser enviado como imagem compactada (ZIP) e convertida para Base64.
* Para **autorização de desistência/cancelamento**, deve ser enviado um PDF convertido para Base64.
* O município (`CodMun`) utiliza o código IBGE da comarca/praça de pagamento.
