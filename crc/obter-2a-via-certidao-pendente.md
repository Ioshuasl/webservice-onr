# CRC - obter2aViaCertidaoPendente.cfc

Fonte: [manual crc.md](manual%20crc.md). Origem: página 2 do manual convertido.

Este serviço obtém os pedidos de 2ª via de certidão feitos por outros cartórios para o cartório consultado.

## Serviço

`obter2aViaCertidaoPendente.cfc`

## Endpoints

### Homologação

- <https://wsh.registrocivil.org.br> - **Tela para testes disponível**
- <http://wsh.registrocivil.org.br//obter2aViaCertidaoPendente.cfc?wsdl> - **Disponível**

### Produção

- <http://ws.registrocivil.org.br/obter2aViaCertidaoPendente.cfc?wsdl> - **Disponível**
- <https://ws.registrocivil.org.br/obter2aViaCertidaoPendente.cfc?wsdl> - **Disponível**

## Arquivo `obter2aViaCertidaoPendente.xml`

O arquivo deve ser assinado e codificado em BASE64. Os comentários indicam as descrições do manual e não devem ser enviados no XML final.

```xml
<?xml version="1.0" encoding="ISO-8859-1"?>
<pedido_certidao>
  <numero_cnj></numero_cnj> <!-- Número do CNJ do cartório dono do registro -->
</pedido_certidao>
```

## Retorno

```xml
<?xml version="1.0" encoding="UTF-8"?>
<certidoes>
  <codigo_retorno></codigo_retorno> <!-- 00000 = Ok; outro número = Erro -->
  <mensagem_retorno></mensagem_retorno> <!-- Mensagem correspondente ao código acima -->
  <qtd_registros></qtd_registros> <!-- Quantidade de registros retornados -->
  <certidao>
    <codigo_hash></codigo_hash> <!-- Identificador do pedido de 2ª via -->
    <num_pedido></num_pedido> <!-- Identificador do pedido de 2ª via nas telas do sistema -->
    <metodo></metodo> <!-- B = Via Busca; M = Manual (por formulário) -->
    <numero_cnj_solicitante></numero_cnj_solicitante> <!-- Número do CNJ do cartório que está solicitando a 2ª via -->
    <numero_cnj_recebedor></numero_cnj_recebedor> <!-- Número do CNJ do cartório dono do registro -->
    <tipo_registro></tipo_registro> <!-- N=Nascimento, C=Casamento, O=Óbito, TN=Transcrição de Nascimento, TC=Transcrição de Casamento, U=União Estável, TO=Transcrição de Óbito, E=Emancipação, I=Interdição, A=Ausência -->
    <data_solicitacao></data_solicitacao> <!-- Data em que foi feita a solicitação (DD/MM/AAAA) -->
    <nome_registrado_1></nome_registrado_1> <!-- Nome do registrado (criança, cônjuge, falecido etc.) -->
    <nome_registrado_2></nome_registrado_2> <!-- Nome do outro cônjuge; preenchido somente em certidões de casamento e transcrições de casamento -->
    <novo_nome_registrado_1></novo_nome_registrado_1> <!-- Novo nome do cônjuge; preenchido somente em certidões de casamento e transcrições de casamento -->
    <novo_nome_registrado_2></novo_nome_registrado_2> <!-- Novo nome do outro cônjuge; preenchido somente em certidões de casamento e transcrições de casamento -->
    <nome_pai></nome_pai> <!-- Nome do pai do registrado (criança, falecido etc.) -->
    <nome_mae></nome_mae> <!-- Nome da mãe do registrado (criança, falecido etc.) -->
    <data_ocorrido></data_ocorrido> <!-- Data de nascimento, casamento, óbito etc. (DD/MM/AAAA) -->
    <data_registro></data_registro> <!-- Data do registro de nascimento, casamento, óbito etc. (DD/MM/AAAA) -->
    <num_livro></num_livro>
    <num_folha></num_folha>
    <num_registro></num_registro>
    <matricula></matricula>
    <obs_solicitacao></obs_solicitacao> <!-- Observação digitada pelo cartório solicitante para informações ao cartório emitente -->
    <emolumentos>0</emolumentos> <!-- Valor da certidão -->
  </certidao>
</certidoes>
```

## Notas

- A tag `<metodo>` pode ser `B` (Busca) ou `M` (Manual).
- Se for `B`, significa que o registro foi localizado no cartório e é certo que será encontrado.
- Se for `M`, significa que o registro foi solicitado com dados incompletos, sem certeza de que está realmente no cartório.
