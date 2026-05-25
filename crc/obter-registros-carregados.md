# CRC - obterRegistrosCarregados.cfc

Fonte: [manual crc.md](manual%20crc.md). Origem: página 12 do manual convertido.

Este serviço lista os registros que já foram carregados pelo cartório.

## Serviço

`obterRegistrosCarregados.cfc`

## Endpoints

### Homologação

- <https://sistemah.registrocivil.org.br/webservice> - **Não disponível**

### Produção

- <http://www.arpensp.org.br/webservice/obterRegistrosCarregados.cfc?wsdl> - **Descontinuado**
- <http://ws.registrocivil.org.br/obterRegistrosCarregados.cfc?wsdl> - **Disponível**
- <https://ws.registrocivil.org.br/obterRegistrosCarregados.cfc?wsdl> - **Disponível**

## Arquivo `obterRegistrosCarregados.xml`

O arquivo deve ser assinado e codificado em BASE64. Os comentários indicam as descrições do manual e não devem ser enviados no XML final.

```xml
<?xml version="1.0" encoding="ISO-8859-1"?>
<registros_carregados>
  <numero_cnj>111111</numero_cnj> <!-- CNS do cartório que faz a pesquisa -->
  <tipo_registro>N</tipo_registro> <!-- N=Nascimento, C=Casamento, O=Óbito, TN=Transcrição de Nascimento, TC=Transcrição de Casamento, U=União Estável, TO=Transcrição de Óbito, E=Emancipação, I=Interdição, A=Ausência -->
  <num_livro></num_livro> <!-- NNNNN -->
  <data_registro_ini></data_registro_ini> <!-- DD/MM/YYYY -->
  <data_registro_fim></data_registro_fim> <!-- DD/MM/YYYY -->
</registros_carregados>
```

## Retorno

```xml
<?xml version="1.0" encoding="UTF-8"?>
<registros>
  <codigo_retorno>00000</codigo_retorno> <!-- 00000 = OK; 99999 = Erro -->
  <mensagem_retorno>Executado com sucesso</mensagem_retorno> <!-- Mensagem relativa ao código acima -->
  <qtd_registros>5</qtd_registros> <!-- Qtd. Registros Retornados -->
  <registro> <!-- Um grupo deste para cada registro -->
    <tipo_registro></tipo_registro> <!-- N=Nascimento, C=Casamento, O=Óbito, TN=Transcrição de Nascimento, TC=Transcrição de Casamento, U=União Estável, TO=Transcrição de Óbito, E=Emancipação, I=Interdição, A=Ausência -->
    <nome_registrado></nome_registrado> <!-- Preenchido somente em N, TN, O, TO, I, E e A -->
    <nome_registrado_1></nome_registrado_1> <!-- Preenchido somente em C, TC e UE -->
    <nome_registrado_2></nome_registrado_2> <!-- Preenchido somente em C, TC e UE -->
    <novo_nome_registrado_1></novo_nome_registrado_1> <!-- Preenchido somente em C, TC e UE -->
    <novo_nome_registrado_2></novo_nome_registrado_2> <!-- Preenchido somente em C, TC e UE -->
    <nome_pai></nome_pai> <!-- Preenchido somente em N, TN, O, TO, I, E e A -->
    <nome_mae></nome_mae> <!-- Preenchido somente em N, TN, O, TO, I, E e A -->
    <data_registro></data_registro> <!-- DD/MM/YYYY -->
    <matricula></matricula>
    <data_averbacao></data_averbacao> <!-- DD/MM/YYYY -->
    <codigo_motivo></codigo_motivo> <!-- Vide Manual de Carga em Lote de Registros -->
    <flag_escondido></flag_escondido> <!-- S=Sigilo, de Transporte, Justificativa de salto na numeração; N=Não escondido -->
  </registro>
</registros>
```
