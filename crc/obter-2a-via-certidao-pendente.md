# CRC - obter2aViaCertidaoPendente.cfc

Fonte: [manual crc.md](manual%20crc.md). Origem: página 2 do manual convertido.

Este serviço serve para obter os pedidos de 2ª Via de certidão feitos por outros cartórios para o meu cartório.

## Serviço

`obter2aViaCertidaoPendente.cfc`

## Homologação

https://wsh.registrocivil.org.br **(Tela para testes Disponível)**

http://wsh.registrocivil.org.br//obter2aViaCertidaoPendente.cfc?wsdl **(Disponível)**

## Produção

http://ws.registrocivil.org.br/obter2aViaCertidaoPendente.cfc?wsdl **(Disponível)**

https://ws.registrocivil.org.br/obter2aViaCertidaoPendente.cfc?wsdl **(Disponível)**

## Arquivo obter2aViaCertidaoPendente.xml

Assinado e em formato BASE64.

<?xml version="1.0" encoding="ISO-8859-1"?> <pedido_certidao>

<numero_cnj></numero_cnj> **Número do CNJ do cartório dono do registro** </pedido_certidao>

## Retorno

<?xml version="1.0" encoding="UTF-8"?> <certidoes>

<codigo_retorno></codigo_retorno> **00000 = Ok   Outro número = Erro** <mensagem_retorno></mensagem_retorno> **Mensagem correspondente ao código acima** <qtd_registros></qtd_registros> **Quantidade de registros  retornados** <certidao>

<codigo_hash></codigo_hash> **Identificador do pedido de 2ª via** <num_pedido></num_pedido> **Identificador do pedido de 2ª via nas telas do sistema** <metodo></metodo> **B = Via Busca - M = Manual (por formulário)** <numero_cnj_solicitante></numero_cnj_solicitante> **Número do CNJ do cartório que está solicitando a 2ª via** <numero_cnj_recebedor></numero_cnj_recebedor> **Número do CNJ do cartório dono do registro**

<tipo_registro></tipo_registro> **N=Nascimento, C=Casamento, O=Óbito, TN=Transcrição de Nascimento, TC = Transcrição de Casamento, U = União Estável, TO = Transcrição de Óbito, E=Emancipação, I=Interdição e A=Ausência** <data_solicitacao></data_solicitacao> **Data em que foi feita a solicitação (DD/MM/AAAA)** <nome_registrado_1></nome_registrado_1> **Nome do Registrado (da criança, do cônjuge, do  falecido, etc.)** <nome_registrado_2></nome_registrado_2> **Nome do outro cônjuge                                       \   Preenchidas só em Certidões de** <novo_nome_registrado_1></novo_nome_registrado_2> **Novo Nome do cônjuge              > Casamento e Transcrições de** <novo_nome_registrado_2></novo_nome_registrado_2> **Novo Nome do outro cônjuge /   Casamento** <nome_pai></nome_pai> **Nome do Pai do Registrado (da criança, do  falecido, etc.)** <nome_mae></nome_mae> **Nome da Mãe do Registrado (da criança, do  falecido, etc.)** <data_ocorrido></data_ocorrido> **Data de Nascimento, data de Casamento, data do Óbito, etc. (DD/MM/AAAA)** <data_registro></data_registro> **Data do Registro de Nascimento, Casamento ou Óbito, etc. (DD/MM/AAAA)** <num_livro></num_livro> <num_folha></num_folha> <num_registro></num_registro> <matricula></matricula> <obs_solicitacao></obs_solicitacao> **Observação digitada pelo cartório solicitante para informações ao cartório emitente.** <emolumentos>0</emolumentos> **Valor da Certidão.** </certidao> </certidoes>

## Notas

A tag `<metodo>` pode ser `B` (Busca) ou `M` (Manual).

Se for `B`, significa que o registro foi localizado no cartório e é certo que será encontrado.

Se for `M`, significa que o registro foi solicitado fornecendo dados incompletos, sem a certeza que está realmente no cartório.
