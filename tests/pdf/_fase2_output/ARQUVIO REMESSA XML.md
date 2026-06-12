

<!-- ocr-retry page 1 -->

Remessa
O conteudo do arquivo foi desenvolvido com base no Layout FEBRABAN. O arquivo pode
conter mais de uma remessa, agrupadas uma abaixo da outra, desde que esteja em
conformidade com o padrao.
Casas
Tamanho
Atributo
Descrição
Tipo
Decimais
Identifica o registro
h01
header no arquixo -
001
Numerico
Nenhuma
Constante 0
Código do apresentante
h02
-Imformar"999" caso
003
Alfanumerico
Nenhuma
tenha mais de 3 digitos
h03
Nome do apresentante
040
Alfabetico
Data do envio do arquivo
h04
008
Numerico
Nenhuma
de remessa
Identificacao de
Tramsacao - Remetente
Preencher com a sigla
h05
003
Alfanumerico
do remetente do arquivo.
BFO -Bamco, Insttituicao
Financeira e Outros.

<br>

---

<!-- page 1 -->

|Atributo|Descrição|Tamanho|Tipo|Casas<br>Decimais|
|---|---|---|---|---|
|h06|Identificacao de<br>Transacao<br>Destinatario Preencher<br>com a sigla do<br>destinatario do arquivo:<br>SDTServiço de<br>Distribuicao de Titulos.|003|Alfanumérico||
|h07|Identificacao de<br>TransacaoTipo<br>Preencher com a sigla<br>de identificacao da<br>transacao: TPR<br>Remessa de títulos para<br>protesto.|003|Alfanumérico||
|h08|Sequencial da remessa|006|Numérico|Nenhuma|
|h09|Quantidade de registros<br>na transacao|004|Numerico|Nenhuma|
|h10|Quantidade de títulos na<br>remessa|004|Numerico|Nenhuma|
||Quantidade de<br>indicacoestipo: DMl,<br>DRIe CBI|004|Numerico|Nenhuma|
|h12|Quantidade de títulos<br>originais na remessa|004|Numerico|Nenhuma|
|h13|Número de identificacao<br>do apresentante<br>(opcional)|006|Alfanumérico||

---

<!-- page 2 -->

<!-- ocr-retry page 2 -->

Casas
Atributo
Tamanho
Descrição
Tipo
Decimais
Identifficacao de
Tramsacao -
Destinatario Preencher
h06
003
com a sigla do
Alfanumerico
destinatario do arquivo:
SDT --Srwxico de
Distribuicao de Titulos.
Identificacao de
Tramsacao - Tipo
Preencher com a sigla
h07
de identificacao da
003
Alfanumérico
tramsacao: TPR -
Remessa dke ttittulos para
protesto.
h08
Sequencial da rermessa
006
Numerico
Nenhuma
Quantidade de registros
h09
004
Numerico
Nenhuma
na transacao
Quantidade de títulos na
h10
004
Numérico
Nenhuma
remessa
Quantidade de
h11
indicacoes -ttipo: DMll,
004
Numerico
Nenhuma
DRIe CBI
Quantidade de títulos
h12
004
Numerico
Nenhuma
originais na remessa
Número de identifficacao
h13
do apresentante
006
Alfanumerico
(opcional)

<br>

<br>

---

<!-- page 3 -->

|Atributo|Descrição|Tam|Tipo|Casas<br>Decimais|
|---|---|---|---|---|
|t09|Cidade do Sacador|020|Alfanumérico||
|t10|UF do Sacador|002|Alfabético||
|t11|Nosso número|015|Alfanumérico||
|t12|Espécie do titulo|003|Alfabético||
|t13|Número do titulo|011|Alfanumérico||
|t14|Data da emissao do titulo|008|Numérico|Nenhuma|
|t15|Data de vencimento do titulo<br>Para casos de vencimento a<br>vista preencher com<br>"99999999"|008|Numérico|Nenhuma|
|t16|Tipo de moed001Real|003|Numerico|Nenhuma|
|t17|Valor do titulo|014|Numerico||
|t18|Saldo do tituloValor a<br>protestar|014|Numerico||
|t19|Praca de Pagamento|020|Alfanumérico||
|t20|Tipo de endossoFixo<br>Branco|001|Alfabético||
|t21|Informacao sobre aceite<br>Preencher com N|001|Alfabético||
|t22|Número de controle de<br>devedoresSequencial dos<br>devedores do titulo (devse|001|Numerico|Nenhuma|

---

<!-- page 4 -->

||informar o sequencial 9 partir<br>do 10° devedor)||||
|---|---|---|---|---|
|t23|Nome do devedor|045|Alfanumerico||
|t24|Tipo de documento do<br>devedor001= CNPJ ou 002<br>= CPF|003|Numérico|Nenhuma|
|t25|Número do documento do<br>devedorPara CPF informar<br>zero a esquerda|014|Numérico|Nenhuma|
|t26|R.G.Nao informar|011|Alfanumérico||
|t27|Endereco do devedor|045|Alfanumérico||
|t28|CEP do devedor|008|Numerico|Nenhuma|
|t29|Cidade do devedor|020|Alfanumérico||
|t30|UF do devedor|002|Alfabético||
|t31|Código do Cartorio Uso<br>restrito do Serviço de<br>DistribuicaoPreencher com<br>Zero|002|Numerico|Nenhuma|
|t32|Número do Protocolo do<br>Cartorio Uso restrito do<br>Serviço de Distribuicao<br>Preencher com Branco|010|Alfanumérico||
|t33|Tipo de Ocorréncia Uso<br>restrito do Serviço de<br>DistribuicaoPreencher com|001|Alfanumérico||

---

<!-- page 5 -->

||Branco (Vide aba "Códigos de<br>ocorrencia e irregularidade")||||
|---|---|---|---|---|
|t34|Data do Protocolo Uso restrito<br>do Serviço de Distribuicao<br>Preencher com Zero|008|Numerico|Nenhuma|
|t35|Valor das Custas do Cartorio<br>Uso restrito do Serviço de<br>DistribuicaoPreencher com<br>Zero|010|Numérico||
|t36|Declaracao do Portador<br>(PREENCHIMENTO DE<br>ACORDO COM A ESPECIE<br>CONTATE A CRA PARA<br>ESCLARECIMENTO) Informe o<br>tipo de declaracao, exemplo:<br>D: Para DMl ou DSI onde o<br>apresentante/credor declara<br>estar de posse da<br>documentacao que comprova<br>a divida A: Para títulos que<br>exigem a apresentacao fisica<br>do documento original G:<br>Dispensa documentacao I:<br>Envia imagem Campo<br>opcional.|001|Alfanumerico||
|t37|Data da Ocorréncia Uso<br>restrito do Serviço de<br>DistribuicaoPreencher com<br>Zero|008|Numerico|Nenhuma|
|t38|Código de Irregularidade Uso<br>restrito do Serviço de|002|Alfanumerico||

---

<!-- page 6 -->

||DistribuicaoPreencher com<br>Branco (Vide aba "códigos de<br>ocorréncia e irregularidade")||||
|---|---|---|---|---|
|t39|Bairro do devedor|020|Alfanumérico||
|t40|Valor das Custas do Cartorio<br>Distribuidor Uso restrito do<br>Serviço de Distribuicao<br>Preencher com Zero|010|Numerico||
|t41|Registro de Distribuicao Uso<br>restrito do Serviço de<br>DistribuicaoPreencher com<br>Zero|006|Numerico|Nenhuma|
|t42|Valor da gravacao eletronica e<br>demais despesas Uso restrito<br>da Centralizadora (CRA)<br>Preencher com Zero|010|Numerico||
|t43|Número da Operacao do<br>Banco Fixo0|005|Numerico|Nenhuma|
|t44|Número do Contrato do<br>Banco Fixo0|015|Numerico|Nenhuma|
|t45|Número da Parcela do<br>Contrato Fixo0|003|Numérico|Nenhuma|
|t46|Tipo da Letra de Cambio Fixo<br>0|001|Alfanumerico||
|t47|Complemento Código de<br>Irregularidade Uso restrito do|008|Alfanumérico||

---

<!-- page 7 -->

||Serviço de Distribuicao<br>Preencher com Branco||||
|---|---|---|---|---|
|t48|Protesto por Motivo de<br>Falencia FixoBranco|001|Alfabético||
|t49|Instrumento de Protesto Fixo<br>Branco|001|Alfabético||
|t50|Valor das demais despesas<br>Uso restrito dos cartorios<br>Preencher com zeros|010|Numérico||
|t51|Imagens dos documentos<br>zipados e convertidos em<br>base64 (Nao inserir em co<br>devedores)||||
|t52|Sequencial do registro|004|Numerico||
|t53|Telefone do devedor||Alfanumerico|Nenhuma|
|t54|Email do devedor||Alfanumérico|Nenhuma|
|t55|Linha digitavel (Uso exclusivo<br>para o Maranhao)||Numerico||
|t56|Linha digitavel (Uso exclusivo<br>para o Maranhao)||Numerico||

---

<!-- page 8 -->

|Identifica o registro trailler no<br>arquivoConstante 9|001|Numérico|Numérico|
|---|---|---|---|
|Código do apresentante|003|Numérico||
|Nome do apresentante|040|Alfabético||
|Data do envio do arquivo de<br>remessa|008|Numérico||
|Somatorio de Seguranca<br>(somar as tags<br>h09+h10+h11+h12 do<br>registro HEADER)|005|Numérico||
|Somatorio do campo t18 do<br>registro de transacao|018|Numérico||
|FixoBranco|521|Alfanumerico||
|Sequencial do registro|004|Numérico|Nenhuma|

---

<!-- page 9 -->
