O documento descreve o **layout do Arquivo de Remessa XML/FEBRABAN para protesto de títulos**, contendo:

# Remessa


---

# REGISTRO HEADER – ARQUIVO REMESSA (Tag hd)

| Atributo | Descrição                                                                                                                             | Tamanho | Tipo         |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------- | ------------ |
| h01      | Identifica o registro header no arquivo – Constante 0                                                                                 | 001     | Numérico     |
| h02      | Código do apresentante – Informar "999" caso tenha mais de 3 dígitos                                                                  | 003     | Alfanumérico |
| h03      | Nome do apresentante                                                                                                                  | 040     | Alfabético   |
| h04      | Data do envio do arquivo de remessa                                                                                                   | 008     | Numérico     |
| h05      | Identificação de Transação – Remetente. Preencher com a sigla do remetente do arquivo: BFO – Banco, Instituição Financeira e Outros   | 003     | Alfanumérico |
| h06      | Identificação de Transação – Destinatário. Preencher com a sigla do destinatário do arquivo: SDT – Serviço de Distribuição de Títulos | 003     | Alfanumérico |
| h07      | Identificação de Transação – Tipo. Preencher com a sigla de identificação da transação: TPR – Remessa de títulos para protesto        | 003     | Alfanumérico |
| h08      | Sequencial da remessa                                                                                                                 | 006     | Numérico     |
| h09      | Quantidade de registros na transação                                                                                                  | 004     | Numérico     |
| h10      | Quantidade de títulos na remessa                                                                                                      | 004     | Numérico     |
| h11      | Quantidade de indicações (DMI, DRI e CBI)                                                                                             | 004     | Numérico     |
| h12      | Quantidade de títulos originais na remessa                                                                                            | 004     | Numérico     |
| h13      | Número de identificação do apresentante (opcional)                                                                                    | 006     | Alfanumérico |
| h14      | Versão do Layout                                                                                                                      | 003     | Numérico     |
| h15      | Código do município                                                                                                                   | 007     | Alfanumérico |
| h16      | Preencher em caso de código do apresentante com mais de 3 dígitos                                                                     | 497     | Alfanumérico |
| h17      | Sequencial do registro                                                                                                                | 004     | Numérico     |

---

# REGISTRO DE TRANSAÇÃO (Tag t)

| Atributo | Descrição                                                | Tamanho |
| -------- | -------------------------------------------------------- | ------- |
| t01      | Identifica o registro transação no arquivo – Constante 1 | 001     |
| t02      | Código do apresentante                                   | 003     |
| t03      | Código do cedente do título                              | 015     |
| t04      | Nome do Cedente/Favorecido                               | 045     |
| t05      | Nome do Sacador                                          | 045     |
| t06      | Número do CNPJ do Sacador                                | 014     |
| t07      | Endereço do Sacador                                      | 045     |
| t08      | CEP do Sacador                                           | 008     |
| t09      | Cidade do Sacador                                        | 020     |
| t10      | UF do Sacador                                            | 002     |
| t11      | Nosso número                                             | 015     |
| t12      | Espécie do título                                        | 003     |
| t13      | Número do título                                         | 011     |
| t14      | Data da emissão do título                                | 008     |
| t15      | Data de vencimento do título                             | 008     |
| t16      | Para vencimento à vista preencher "99999999"             | 003     |
| t17      | Tipo de moeda – 001 = Real                               | 003     |
| t18      | Valor do título                                          | 014     |
| t19      | Saldo do título (valor a protestar)                      | 014     |
| t20      | Praça de pagamento                                       | 020     |
| t21      | Tipo de endosso – Fixo Branco                            | 001     |
| t22      | Informação sobre aceite – preencher com N                | 001     |
| t23      | Número de controle de devedores                          | 001     |
| t24      | Nome do devedor                                          | 045     |
| t25      | Tipo de documento do devedor (001=CNPJ / 002=CPF)        | 003     |
| t26      | Número do documento do devedor                           | 014     |
| t27      | RG (não informar)                                        | 011     |
| t28      | Endereço do devedor                                      | 045     |
| t29      | CEP do devedor                                           | 008     |
| t30      | Cidade do devedor                                        | 020     |
| t31      | UF do devedor                                            | 002     |
| t32      | Código do Cartório (uso restrito)                        | 010     |
| t33      | Número do protocolo do cartório (uso restrito)           | 001     |
| t34      | Tipo de ocorrência (uso restrito)                        | 008     |
| t35      | Data do protocolo (uso restrito)                         | 010     |
| t36      | Valor das custas do cartório (uso restrito)              | 001     |
| t37      | Declaração do portador                                   | 008     |
| t38      | Data da ocorrência (uso restrito)                        | 002     |
| t39      | Código de irregularidade (uso restrito)                  | 020     |
| t40      | Bairro do devedor                                        | 010     |
| t41      | Valor das custas do cartório distribuidor                | 006     |
| t42      | Registro de distribuição                                 | 010     |
| t43      | Valor da gravação eletrônica e demais despesas           | 005     |
| t44      | Número da operação do banco (fixo = 0)                   | 015     |
| t45      | Número do contrato do banco (fixo = 0)                   | 003     |
| t46      | Número da parcela do contrato (fixo = 0)                 | 001     |
| t47      | Tipo da letra de câmbio (fixo = 0)                       | 008     |
| t48      | Complemento código de irregularidade                     | 001     |
| t49      | Protesto por motivo de falência (fixo branco)            | 001     |
| t50      | Instrumento de protesto (fixo branco)                    | 010     |
| t51      | Valor das demais despesas                                | —       |
| t52      | Imagens dos documentos zipados e convertidos para Base64 | —       |
| t53      | Sequencial do registro                                   | 004     |
| t54      | Telefone do devedor                                      | —       |
| t55      | E-mail do devedor                                        | —       |
| t56      | Linha digitável (uso exclusivo Maranhão)                 | —       |

---

# REGISTRO TRAILER

| Atributo | Descrição                                                | Tamanho |
| -------- | -------------------------------------------------------- | ------- |
| t01      | Identifica o registro trailer no arquivo – Constante 9   | 001     |
| t02      | Código do apresentante                                   | 003     |
| t03      | Nome do apresentante                                     | 040     |
| t04      | Data do envio do arquivo de remessa                      | 008     |
| t05      | Somatório de segurança (somar h09+h10+h11+h12 do HEADER) | 005     |
| t06      | Somatório do campo t18 dos registros de transação        | 018     |
| t07      | Fixo – Branco                                            | 521     |
| t08      | Sequencial do registro                                   | 004     |