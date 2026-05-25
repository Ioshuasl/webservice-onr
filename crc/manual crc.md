**==> picture [280 x 125] intentionally omitted <==**

**==> picture [593 x 290] intentionally omitted <==**

--- end of page.page_number=1 ---

Roteiro para utilização dos Webservices de emissão de certidão no CRC – Central de Informações 

## Índice 

**TÓPICO** ......................................................................................................................................................................... **PAG. INTRODUÇÃO A 2ª VIA DE CERTIDÕES 1-Processamento por Webservices, acoplados ao Sistema Interno do cartório** ............................................................ **1 EMITINDO 2ª VIA DE CERTIDÕES 2-Emitindo 2ª Via de Certidões por Webservices, acoplados ao Sistema Interno do cartório** ...................................... **1 OBTENDO LISTAGEM DOS REGISTROS CARREGADOS 3-Listando Registros Carregados no CRC** ........................................................................................................................ **12** 

--- end of page.page_number=2 ---

**==> picture [105 x 47] intentionally omitted <==**

## **INTRODUÇÃO A 2ª VIA DE CERTIDÕES** 

## **1-Processamento por Webservices, acoplados ao Sistema Interno do cartório:** 

- a-Um cartório faz a pesquisa, localiza um determinado registro e, se o registro for de outro cartório, pode-se solicitar uma 2ª via. 

- Também é possível solicitar uma 2ª via pelo link “Pedido Certidão Manual”, onde serão fornecidas o máximo de informações possíveis para localização do registro. É obrigatório informar em que cartório está o registro. 

b-O cartório dono do registro recebe a solicitação em seu inbox. 

- c-O cartório dono do registro executa o serviço “obter2aViaCertidaoPendente.cfc”, para receber em seu sistema interno a(s) solicitação(ões) de 2ª Via pendentes de emissão. 

- d-O cartório dono do registro executa o serviço “enviarCertidao.cfc”, acoplando o XML correspondente assinado e em formato BASE64 (vide layouts abaixo). 

- e-O cartório solicitante vê a chegada da certidão em seu inbox e a imprime na tela apropriada. 

## **EMITINDO 2ª VIA DE CERTIDÕES** 

## **2-Emitindo 2ª Via de Certidões por Webservices, acoplados ao Sistema Interno do cartório:** 

As obtenções de pendências (serviço obter2aViaCertidaoPendente.cfc) são feitas mediante o envio de um XML assinado e em formato BASE64 conforme layouts abaixo: 

As certidões serão transferidas do cartório dono do registro para o cartório solicitante (serviço enviarCertidao.cfc) mediante o envio de um XML correspondente, assinado e em formato BASE64 conforme layouts abaixo: 

- **Notas:** a-Em caso de Emissão de 2ª Via de certidão, preencha as Tags do grupo <emissao>, deixando as Tags do Grupo <rejeicao> nulas. 

   - b-Em caso de Rejeição, preencha as Tags do grupo <rejeicao>, deixando as Tags do grupo <emissao> nulos. 

Pág. 1 

--- end of page.page_number=3 ---

**==> picture [105 x 47] intentionally omitted <==**

## **SERVIÇO obter2aViaCertidaoPendente.cfc:** 

Este serviço serve para obter os pedidos de 2ª Via de certidão feitos por outros cartórios para o meu cartório. O endereço é: 

## **HOMOLOGAÇÃO:** 

https://wsh.registrocivil.org.br **(Tela para testes Disponível)** http://wsh.registrocivil.org.br//obter2aViaCertidaoPendente.cfc?wsdl **(Disponível)** 

## **PRODUÇÃO:** 

http://ws.registrocivil.org.br/obter2aViaCertidaoPendente.cfc?wsdl **(Disponível)** https://ws.registrocivil.org.br/obter2aViaCertidaoPendente.cfc?wsdl **(Disponível)** 

## **Arquivo obter2aViaCertidaoPendente.xml (Assinado e em formato BASE64)** 

<?xml version="1.0" encoding="ISO-8859-1"?> <pedido_certidao> 

<numero_cnj></numero_cnj> **Número do CNJ do cartório dono do registro** </pedido_certidao> 

## **RETÔRNO:** 

<?xml version="1.0" encoding="UTF-8"?> <certidoes> 

<codigo_retorno></codigo_retorno> **00000 = Ok   Outro número = Erro** <mensagem_retorno></mensagem_retorno> **Mensagem correspondente ao código acima** <qtd_registros></qtd_registros> **Quantidade de registros  retornados** <certidao> 

<codigo_hash></codigo_hash> **Identificador do pedido de 2ª via** <num_pedido></num_pedido> **Identificador do pedido de 2ª via nas telas do sistema** <metodo></metodo> **B = Via Busca - M = Manual (por formulário)** <numero_cnj_solicitante></numero_cnj_solicitante> **Número do CNJ do cartório que está solicitando a 2ª via** <numero_cnj_recebedor></numero_cnj_recebedor> **Número do CNJ do cartório dono do registro** 

<tipo_registro></tipo_registro> **N=Nascimento, C=Casamento, O=Óbito, TN=Transcrição de Nascimento, TC = Transcrição de Casamento, U = União Estável, TO = Transcrição de Óbito, E=Emancipação, I=Interdição e A=Ausência** <data_solicitacao></data_solicitacao> **Data em que foi feita a solicitação (DD/MM/AAAA)** <nome_registrado_1></nome_registrado_1> **Nome do Registrado (da criança, do cônjuge, do  falecido, etc.)** <nome_registrado_2></nome_registrado_2> **Nome do outro cônjuge                                       \   Preenchidas só em Certidões de** <novo_nome_registrado_1></novo_nome_registrado_2> **Novo Nome do cônjuge              > Casamento e Transcrições de** <novo_nome_registrado_2></novo_nome_registrado_2> **Novo Nome do outro cônjuge /   Casamento** <nome_pai></nome_pai> **Nome do Pai do Registrado (da criança, do  falecido, etc.)** <nome_mae></nome_mae> **Nome da Mãe do Registrado (da criança, do  falecido, etc.)** <data_ocorrido></data_ocorrido> **Data de Nascimento, data de Casamento, data do Óbito, etc. (DD/MM/AAAA)** <data_registro></data_registro> **Data do Registro de Nascimento, Casamento ou Óbito, etc. (DD/MM/AAAA)** <num_livro></num_livro> <num_folha></num_folha> <num_registro></num_registro> <matricula></matricula> <obs_solicitacao></obs_solicitacao> **Observação digitada pelo cartório solicitante para informações ao cartório emitente.** <emolumentos>0</emolumentos> **Valor da Certidão.** </certidao> </certidoes> 

**Nota:** A tag <metodo> pode ser B (Busca) ou M (Manual). 

Se for “B”, significa que o registro foi localizado no cartório e é certo que será encontrado. 

Se for “M”, significa que o registro foi solicitado fornecendo dados incompletos, sem a certeza que está realmente no cartório. 

Pág. 2 

--- end of page.page_number=4 ---

**==> picture [105 x 47] intentionally omitted <==**

## **SERVIÇO enviarCertidao.cfc:** 

Este serviço envia os dados da 2ª Via da certidão para o cartório solicitante, para ser impressa. O serviço identifica o tipo de certidão enviada a partir da Tag <codigo_hash>. O endereço é: 

## **HOMOLOGAÇÃO (Tela para testes):** 

https://wsh.registrocivil.org.br/enviarCertidao.cfc?wsdl **(Disponível)** http://wsh.registrocivil.org.br/enviarCertidao.cfc?wsdl **(Disponível)** 

## **PRODUÇÃO:** 

http://ws.registrocivil.org.br/enviarCertidao.cfc?wsdl **(Disponível)** https://ws.registrocivil.org.br/enviarCertidao.cfc?wsdl **(Disponível)** 

## **Arquivo para Nascimento e Transcrição de Nascimento (Assinado e em formato BASE64)** 

<?xml version="1.0" encoding="ISO-8859-1"?> <certidao> <numero_cnj></numero_cnj> **Número do CNJ do cartório dono do registro** <codigo_hash></codigo_hash> **Código do Pedido de Certidão** <emissao> <qtd_averbacoes></qtd_averbacoes> <nome_crianca></nome_crianca> <cpf_registrado></cpf_registrado> <matricula></matricula> <data_registro></data_registro> **Data do Registro de nascimento - DD/MM/YYYY** <data_nascimento_extenso></data_nascimento_extenso> **Data de nascimento por extenso** <data_nascimento></data_nascimento> **Data de nascimento - DD/MM/YYYY** <hora_nascimento></hora_nascimento> **Hora Do nascimento - HH:mm (17:30)** <naturalidade></naturalidade> <municipio_nascimento></municipio_nascimento> **Município da Maternidade - UF da Maternidade** <municipio_registro></municipio_registro> **Município do Cartório - UF do Cartório** <local_nascimento></local_nascimento> **Nome da Maternidade – Endereço da Maternidade** <sexo></sexo> **Sexo da criança (Masculino ou Feminino)** <filiacao></filiacao> **Mãe: xxxxxxxxxxxxxx – Natural de  xxxxxxx Pai: xxxxxxxxxxxxxx – Natural de xxxxxxxx** <avos></avos> **Maternos: xxxxxxxxxxxxxx e xxxxxxxxxxxxxx  Paternos:  xxxxxxxxxxxxxx e xxxxxxxxxxxxxx** <flag_gemeo></flag_gemeo> **Sim=Nasceu também irmão(s) gêmeo(s) - Não=Não nasceu irmão(s) gêmeo(s)** <gemeos> <qtd_irmaos>2</qtd_irmaos> **Quantidade de IRMÃOS gêmeos (Se nasceram 3 crianças, são 2 irmãos – 0 se nenhum)** <irmao> **\** <nome_matricula></nome_matricula> **\    Nome e Matrícula dos irmãos** </irmao> **\  (Repetir este grupo para cada um dos irmãos)** <irmao> **/  (Deixar 1 grupo em branco (nulos), caso não haja irmãos gêmeos)** <nome_matricula></nome_matricula> **/** </irmao> **/** </gemeos> <data_registro_extenso></data_registro_extenso> **Data do registro por extenso** <numero_dnv></numero_dnv> **Número da DNV (Declaração de Nascido Vivo) da criança** <observacoes_averbacoes></observacoes_averbacoes> <valor_adicional></valor_adicional> **Valor Adicional para emissão da certidão (Se aplicável) – NNN.NN** <num_selo></num_selo> **Número do Selo Digital (Se aplicável)** <cod_selo></cod_selo> **Código de Validação do Selo Digital (Para consulta no site - Se aplicável)** <desc_selo></desc_selo> **Linha de Descrição do Selo Digital (Se aplicável)** 

<anotacoes_cadastro> <registrado> <cep_res></cep_res> <grupo_sanguineo></grupo_sanguineo> <titulo_eleitor> 

Pág. 3 

--- end of page.page_number=5 ---

**==> picture [105 x 47] intentionally omitted <==**

<numero></numero> <zona_secao></zona_secao> <uf></uf> <municipio></municipio> </titulo_eleitor> <documentos> <documento> **Repetir o grupo DOCUMENTO para cada um dos documentos** <tipo_doc></tipo_doc> **RG, PIS, PASSAPORTE, CARTAO_NAC_SAUDE, CTPS, RESERVISTA, CNH** <numero></numero> <data_emissao></data_emissao> <orgao_emissor></orgao_emissor> <uf_emissao></uf_emissao> <data_validade></data_validade> <documento> </documentos> </registrado> <anotacoes_cadastro> </emissao> <rejeicao> <motivo_rejeicao></motivo_rejeicao> **Motivo da Rejeição (Textual)** </rejeicao> </certidao> 

## **RETÔRNO:** 

<?xml version="1.0" encoding="ISO-8859-1" ?> <certidao> <codigo_retorno>00000</codigo_retorno> **00000 = OK - Outro número = ERRO** <mensagem_retorno>Certidão enviada com sucesso!</mensagem_retorno> **(Mensagem explicativa ou de erro)** .............. **Conteúdo do seu arquivo XML** </certidao> 

**Nota:** Caso não conste a TAG <data_ocorrido>, entre com “--/--/----“ 

Pág. 4 

--- end of page.page_number=6 ---

**==> picture [105 x 47] intentionally omitted <==**

## **Arquivo para Casamento e Transcrição de Casamento (Assinado e em formato BASE64)** 

<?xml version="1.0" encoding="ISO-8859-1"?> <certidao> <numero_cnj></numero_cnj> **Número do CNJ do cartório dono do registro** <codigo_hash></codigo_hash> **Código do Pedido de Certidão** <emissao> <qtd_averbacoes></qtd_averbacoes> <nome_registrado_1></nome_registrado_1> **Nome do cônjuge 1 após casamento (caso não houver  informe  nome de solteriro)** <nome_registrado_2></nome_registrado_2> **Nome do cônjuge 2 após casamento (caso não houver  informe  nome de solteriro)** <cpf_registrado_1></cpf_registrado_1> **CPF do cônjuge 1** <cpf_registrado_2></cpf_registrado_2> **CPF do cônjuge 2** <matricula></matricula> <nomes_datas_locais></nomes_datas_locais> <data_registro_extenso></data_registro_extenso> **Data do registro por extenso** <data_registro></data_registro> **Data de registro - DD/MM/YYYY** <regime_bens></regime_bens> <novos_nomes></novos_nomes> <observacoes_averbacoes></observacoes_averbacoes> <valor_adicional></valor_adicional> **Valor Adicional para emissão da certidão (Se aplicável) – NNN.NN** <num_selo></num_selo> **Número do Selo Digital (Se aplicável)** <cod_selo></cod_selo> **Código de Validação do Selo Digital (Para consulta no site - Se aplicável)** <desc_selo></desc_selo> **Linha de Descrição do Selo Digital (Se aplicável)** <anotacoes_cadastro> <registrados> <registrado_1> <cep_res></cep_res> <grupo_sanguineo></grupo_sanguineo> <titulo_eleitor> <numero></numero> <zona_secao></zona_secao> <uf></uf> <municipio></municipio> </titulo_eleitor> <documentos> <documento> **Repetir o grupo DOCUMENTO para cada um dos documentos** <tipo_doc></tipo_doc> **RG, PIS, PASSAPORTE, CARTAO_NAC_SAUDE, CTPS, RESERVISTA, CNH** <numero></numero> <data_emissao></data_emissao> <orgao_emissor></orgao_emissor> <uf_emissao></uf_emissao> <data_validade></data_validade> <documento> </documentos> </registrado_1> <registrado_2> <cep_res></cep_res> <grupo_sanguineo></grupo_sanguineo> <titulo_eleitor> <numero></numero> <zona_secao></zona_secao> <uf></uf> <municipio></municipio> </titulo_eleitor> <documentos> <documento> **Repetir o grupo DOCUMENTO para cada um dos documentos** <tipo_doc></tipo_doc> **RG, PIS, PASSAPORTE, CARTAO_NAC_SAUDE, CTPS, RESERVISTA, CNH** <numero></numero> <data_emissao></data_emissao> <orgao_emissor></orgao_emissor> <uf_emissao></uf_emissao> 

Pág. 5 

--- end of page.page_number=7 ---

**==> picture [105 x 47] intentionally omitted <==**

<data_validade></data_validade> <documento> </documentos> </registrado_2> </registrados> <anotacoes_cadastro> </emissao> <rejeicao> <motivo_rejeicao></motivo_rejeicao> **Motivo da Rejeição (Textual)** </rejeicao> </certidao> 

## **RETÔRNO:** 

<?xml version="1.0" encoding="ISO-8859-1" ?> <certidao> <codigo_retorno>00000</codigo_retorno> **00000 = OK - Outro número = ERRO** <mensagem_retorno>Certidão enviada com sucesso!</mensagem_retorno> **(Mensagem explicativa ou de erro)** .............. **Conteúdo do seu arquivo XML** </certidao> 

Os campos declarados no XML de entrada “enviarCertidaoCasamento.xml”, correspondem ao impresso abaixo, na mesma ordem. 

Pág. 6 

--- end of page.page_number=8 ---

**==> picture [105 x 47] intentionally omitted <==**

## **Arquivo para Óbito e Transcrição de Óbito (Assinado e em formato BASE64)** 

<?xml version="1.0" encoding="ISO-8859-1"?> <certidao> <numero_cnj></numero_cnj> **Número do CNJ do cartório dono do registro** <codigo_hash></codigo_hash> **Código do Pedido de Certidão** <emissao> <qtd_averbacoes></qtd_averbacoes> <nome_falecido></nome_falecido> <cpf_registrado></cpf_registrado> <matricula></matricula> <sexo></sexo> **Sexo do falecido (Masculino ou Feminino)** <cor></cor> **Cor da pele do falecido** <estado_civil_idade></estado_civil_idade> <naturalidade></naturalidade> <documento_identificacao></documento_identificacao> <matricula_nascimento></matricula_nascimento> <eleitor></eleitor> <residencia_filiacao></residencia_filiacao> <data_hora_falecimento_extenso></data_hora_falecimento_extenso> **Data e Hora de falecimento por extenso** <data_falecimento></data_falecimento> **Data de falecimento - DD/MM/YYYY** <local_falecimento></local_falecimento> <causa_morte></causa_morte> <cemiterio></cemiterio> <declarante></declarante> <nome_numero_medico></nome_numero_medico> <observacoes_averbacoes></observacoes_averbacoes> <valor_adicional></valor_adicional> **Valor Adicional para emissão da certidão (Se aplicável) – NNN.NN** <num_selo></num_selo> **Número do Selo Digital (Se aplicável)** <cod_selo></cod_selo> **Código de Validação do Selo Digital (Para consulta no site - Se aplicável)** <desc_selo></desc_selo> **Linha de Descrição do Selo Digital (Se aplicável)** <anotacoes_cadastro> <registrado> <cep_res></cep_res> <grupo_sanguineo></grupo_sanguineo> <titulo_eleitor> <numero></numero> <zona_secao></zona_secao> <uf></uf> <municipio></municipio> </titulo_eleitor> <documentos> <documento> **Repetir o grupo DOCUMENTO para cada um dos documentos** <tipo_doc></tipo_doc> **RG, PIS, PASSAPORTE, CARTAO_NAC_SAUDE, CTPS, RESERVISTA, CNH** <numero></numero> <data_emissao></data_emissao> <orgao_emissor></orgao_emissor> <uf_emissao></uf_emissao> <data_validade></data_validade> <documento> </documentos> </registrado> <anotacoes_cadastro> </emissao> <rejeicao> <motivo_rejeicao></motivo_rejeicao> **Motivo da Rejeição (Textual)** </rejeicao> </certidao> 

## **RETÔRNO:** 

<?xml version="1.0" encoding="ISO-8859-1" ?> <certidao> <codigo_retorno>00000</codigo_retorno> **00000 = OK - Outro número = ERRO** <mensagem_retorno>Certidão enviada com sucesso!</mensagem_retorno> **(Mensagem explicativa ou de erro)** .............. **Conteúdo do seu arquivo XML** </certidao> 

**Nota:** Caso não conste a TAG <data_falecimento >, entre com “--/--/----“ 

Pág. 7 

--- end of page.page_number=9 ---

**==> picture [105 x 47] intentionally omitted <==**

## **Arquivo para Emancipação (Assinado e em formato BASE64)** 

<?xml version="1.0" encoding="ISO-8859-1"?> <certidao> <numero_cnj></numero_cnj> **Número do CNJ do cartório dono do registro** <codigo_hash></codigo_hash> **Código do Pedido de Certidão** <emissao> <qtd_averbacoes></qtd_averbacoes> <nome_emancipado></nome_emancipado> <cpf_registrado></cpf_registrado> **CPF do registrado** <matricula></matricula> <data_nascimento></data_nascimento> <data_nascimento_extenso></data_nascimento_extenso> <profissao></profissao> <naturalidade></naturalidade> <documentos_pessoais></documentos_pessoais> <filiacao></filiacao> <domicilio_emancipado></domicilio_emancipado> <genitor_tutor></genitor_tutor> <titulo></titulo> <serventia_data_registro_nascimento></serventia_data_registro_nascimento> <data_registro_extenso></data_registro_extenso> <observacoes_averbacoes></observacoes_averbacoes> <valor_adicional></valor_adicional> **Valor Adicional para emissão da certidão (Se aplicável) – NNN.NN** <num_selo></num_selo> **Número do Selo Digital (Se aplicável)** <cod_selo></cod_selo> **Código de Validação do Selo Digital (Para consulta no site - Se aplicável)** <desc_selo></desc_selo> **Linha de Descrição do Selo Digital (Se aplicável)** </emissao> <rejeicao> <motivo_rejeicao></motivo_rejeicao> **Motivo da Rejeição (Textual)** </rejeicao> </certidao> 

## **RETÔRNO:** 

<?xml version="1.0" encoding="ISO-8859-1" ?> <certidao> <codigo_retorno>00000</codigo_retorno> **00000 = OK - Outro número = ERRO** <mensagem_retorno>Certidão enviada com sucesso!</mensagem_retorno> **(Mensagem explicativa ou de erro)** .............. **Conteúdo do seu arquivo XML** </certidao> 

**Nota:** Caso não conste a TAG <data_nascimento >, entre com “--/--/----“ 

Pág. 8 

--- end of page.page_number=10 ---

**==> picture [105 x 47] intentionally omitted <==**

## **Arquivo para Interdição (Assinado e em formato BASE64)** 

<?xml version="1.0" encoding="ISO-8859-1"?> <certidao> <numero_cnj></numero_cnj> **Número do CNJ do cartório dono do registro** <codigo_hash></codigo_hash> **Código do Pedido de Certidão** <emissao> <qtd_averbacoes></qtd_averbacoes> <nome_registrado></nome_registrado> <cpf_registrado></cpf_registrado> **CPF do registrado** <matricula></matricula> <data_nascimento></data_nascimento> <data_nascimento_extenso></data_nascimento_extenso> <estado_civil></estado_civil> <profissao></profissao> <naturalidade></naturalidade> <documentos_pessoais></documentos_pessoais> <domicilio_interdito></domicilio_interdito> <nome_requerente_interdicao></nome_requerente_interdicao> <sentenca></sentenca> <causa_interdicao></causa_interdicao> <limites_curatela></limites_curatela> <curador></curador> <data_registro_extenso></data_registro_extenso> <observacoes_averbacoes></observacoes_averbacoes> <valor_adicional></valor_adicional> **Valor Adicional para emissão da certidão (Se aplicável) – NNN.NN** <num_selo></num_selo> **Número do Selo Digital (Se aplicável)** <cod_selo></cod_selo> **Código de Validação do Selo Digital (Para consulta no site - Se aplicável)** <desc_selo></desc_selo> **Linha de Descrição do Selo Digital (Se aplicável)** </emissao> <rejeicao> <motivo_rejeicao></motivo_rejeicao> **Motivo da Rejeição (Textual)** </rejeicao> </certidao> 

## **RETÔRNO:** 

<?xml version="1.0" encoding="ISO-8859-1" ?> <certidao> 

<codigo_retorno>00000</codigo_retorno> **00000 = OK - Outro número = ERRO** 

<mensagem_retorno>Certidão enviada com sucesso!</mensagem_retorno> **(Mensagem explicativa ou de erro)** .............. **Conteúdo do seu arquivo XML** 

</certidao> 

**Nota:** Caso não conste a TAG <data_nascimento >, entre com “--/--/----“ 

Pág. 9 

--- end of page.page_number=11 ---

**==> picture [105 x 47] intentionally omitted <==**

## **Arquivo para Ausência (Assinado e em formato BASE64)** 

<?xml version="1.0" encoding="ISO-8859-1"?> <certidao> <numero_cnj></numero_cnj> **Número do CNJ do cartório dono do registro** <codigo_hash></codigo_hash> **Código do Pedido de Certidão** <emissao> <qtd_averbacoes></qtd_averbacoes> <nome_registrado></nome_registrado> <cpf_registrado></cpf_registrado> **CPF do registrado** <matricula></matricula> <data_nascimento></data_nascimento> <data_nascimento_extenso></data_nascimento_extenso> <estado_civil></estado_civil> <profissao></profissao> <naturalidade></naturalidade> <documentos_pessoais></documentos_pessoais> <domicilio_anterior_ausente></domicilio_anterior_ausente> <nome_requerente_processo></nome_requerente_processo> <sentenca></sentenca> <tempo_ausencia_data_sentenca></tempo_ausencia_data_sentenca> <limites_curatela></limites_curatela> <curador></curador> <data_registro_extenso></data_registro_extenso> <observacoes_averbacoes></observacoes_averbacoes> <valor_adicional></valor_adicional> **Valor Adicional para emissão da certidão (Se aplicável) – NNN.NN** <num_selo></num_selo> **Número do Selo Digital (Se aplicável)** <cod_selo></cod_selo> **Código de Validação do Selo Digital (Para consulta no site - Se aplicável)** <desc_selo></desc_selo> **Linha de Descrição do Selo Digital (Se aplicável)** </emissao> <rejeicao> <motivo_rejeicao></motivo_rejeicao> **Motivo da Rejeição (Textual)** </rejeicao> </certidao> 

## **RETÔRNO:** 

<?xml version="1.0" encoding="ISO-8859-1" ?> <certidao> 

<codigo_retorno>00000</codigo_retorno> **00000 = OK - Outro número = ERRO** 

<mensagem_retorno>Certidão enviada com sucesso!</mensagem_retorno> **(Mensagem explicativa ou de erro)** .............. **Conteúdo do seu arquivo XML** 

</certidao> 

**Nota:** Caso não conste a TAG <data_nascimento >, entre com “--/--/----“ 

Pág. 10 

--- end of page.page_number=12 ---

**==> picture [105 x 47] intentionally omitted <==**

## **Arquivo para União Estável (Assinado e em formato BASE64)** 

<?xml version="1.0" encoding="ISO-8859-1"?> <certidao> <numero_cnj></numero_cnj> **Número do CNJ do cartório dono do registro** <codigo_hash></codigo_hash> **Código do Pedido de Certidão** <emissao> <qtd_averbacoes></qtd_averbacoes> <nome_registrado_1></nome_registrado_1> <nome_registrado_2></nome_registrado_2> <cpf_registrado_1></cpf_registrado_1> **CPF do registrado 1** <cpf_registrado_1></cpf_registrado_1> **CPF do registrado 2** <matricula></matricula> <primeiro_companheiro></primeiro_companheiro> <segundo_companheiro></segundo_companheiro> <data_registro_extenso></data_registro_extenso> <titulo></titulo> <regime_bens></regime_bens> <novos_nomes></novos_nomes> <observacoes_averbacoes></observacoes_averbacoes> <valor_adicional></valor_adicional> **Valor Adicional para emissão da certidão (Se aplicável) – NNN.NN** <num_selo></num_selo> **Número do Selo Digital (Se aplicável)** <cod_selo></cod_selo> **Código de Validação do Selo Digital (Para consulta no site - Se aplicável)** <desc_selo></desc_selo> **Linha de Descrição do Selo Digital (Se aplicável)** </emissao> <rejeicao> <motivo_rejeicao></motivo_rejeicao> **Motivo da Rejeição (Textual)** </rejeicao> </certidao> 

## **RETÔRNO:** 

<?xml version="1.0" encoding="ISO-8859-1" ?> <certidao> <codigo_retorno>00000</codigo_retorno> **00000 = OK - Outro número = ERRO** <mensagem_retorno>Certidão enviada com sucesso!</mensagem_retorno> **(Mensagem explicativa ou de erro)** .............. **Conteúdo do seu arquivo XML** </certidao> 

Pág. 11 

--- end of page.page_number=13 ---

**==> picture [105 x 47] intentionally omitted <==**

## **3-Listando Registros Carregados no CRC:** 

## **SERVIÇO obterRegistrosCarregados.cfc:** 

Este serviço serve para listar os registros que já foram carregados pelo cartório. O endereço é: 

## **HOMOLOGAÇÃO (Tela para testes não disponível):** 

https://sistemah.registrocivil.org.br/webservice **(Não Disponível)** 

## **PRODUÇÃO:** 

http://www.arpensp.org.br/webservice/obterRegistrosCarregados.cfc?wsdl **(Descontinuado)** http://ws.registrocivil.org.br/obterRegistrosCarregados.cfc?wsdl **(Disponível)** https://ws.registrocivil.org.br/obterRegistrosCarregados.cfc?wsdl **(Disponível)** 

## **Arquivo obterRegistrosCarregados.xml (Assinado e em formato BASE64)** 

<?xml version="1.0" encoding="ISO-8859-1"?> 

<registros_carregados> 

<numero_cnj>111111</numero_cnj> **CNS do cartório que faz a pesquisa** 

<tipo_registro>N</tipo_registro> **N=Nascimento, C=Casamento, O=Óbito, TN=Transcrição de Nascimento, TC = Transcrição de Casamento, U = União Estável, TO = Transcrição de Óbito, E=Emancipação, I=Interdição e A=Ausência** 

<num_livro></num_livro> **NNNNN** 

<data_registro_ini></data_registro_ini> **DD/MM/YYYY** 

<data_registro_fim></data_registro_fim> **DD/MM/YYYY** 

</registros_carregados> 

## **RETÔRNO:** 

<?xml version="1.0" encoding="UTF-8"?> 

<registros> 

<codigo_retorno>00000</codigo_retorno> **00000 = OK  -  99999 = Erro** 

<mensagem_retorno>Executado com sucesso</mensagem_retorno> **Mensagem relativa ao código acima** <qtd_registros>5</qtd_registros> **Qtd. Registros Retornados** 

<registro> **Um grupo destes para cada registro** 

<tipo_registro></tipo_registro> **N=Nascimento,  C=Casamento, O=Óbito, TN=Transcrição de Nascimento, TC = Transcrição de Casamento, U = União Estável, TO = Transcrição de Óbito, E=Emancipação, I=Interdição e A=Ausência** <nome_registrado></nome_registrado> **Preenchidos somente em N, TN, O, TO, I, E e A** 

<nome_registrado_1></nome_registrado_1> **Preenchido somente em C, TC e UE** 

<nome_registrado_2></nome_registrado_2> **Preenchido somente em C, TC e UE** 

<novo_nome_registrado_1></novo_nome_registrado_1> **Preenchido somente em C, TC e UE** 

<novo_nome_registrado_2></novo_nome_registrado_2> **Preenchido somente em C, TC e UE** <nome_pai></nome_pai> **Preenchido somente em N, TN, O, TO, I, E e A** 

<nome_mae></nome_mae> **Preenchido somente em N, TN, O, TO, I, E e A** 

<data_registro></data_registro> **DD/MM/YYYY** <matricula></matricula> 

<data_averbacao></data_ averbacao> **DD/MM/YYYY** 

<codigo_motivo></codigo_motivo> **Vide Manual de Carga em Lote de Registros** 

<flag_escondido></flag_escondido> **S=Sigilo, de Transporte, Justificativa de salto na numeração – N=Não escondido** </registro> </registros> 

Pág. 12 

--- end of page.page_number=14 ---
