## Guia de Integracao via Webservice

Estimated reading: 3 minutes : 185 views

A comunicacao entre o conveniado e o CRA21 é realizada por meio da troca de arquivos no formato XML, permitindo o envio eletronico de titulos e documentos de divida aos cartorios de protesto.

## Arquivos que podem ser enviados pelo Conveniado

O conveniado utiliza o CRA21 para enviar uma variedade de arquivos aos cartorios de protesto, todos contidos em arquivos XML. Os arquivos de envio sao:

- Autorizacoes de Desisténcia e Cancelamento: Autoriza que o devedor solicite a interrupcao ou o encerramento de um protesto.

- Pedidos de Cancelamentos e Desisténcias: Solicita o cancelamento ou desisténcia de um protesto.

Imagens: Documentos e informações adicionais que podem ser anexados a remessa para complementar o processo.

Oficios: Envio de oficios para os cartorios referente a algum titulo

## Arquivos que serao baixados pelo Conveniado

O CRA21 retorna arquivos XML conforme os cartorios atualizam as informações dos titulos. Os arquivos que deverao ser baixados sao:

Confirmacoes: Arquivos enviados pelos cartorios, confirmando o recebimento e o processamento inicial da remessa. Neles, você encontrara os dados dos titulos, o número e a data do protocolo, e a indicacao de possiveis titulos devolvidos por irregularidade.

---

<!-- page 1 -->

Retornos: Arquivos que trazem a ocorréncia de cada titulo, indicando se foi

protestado, pago, cancelado, etc.

Instrumentos de Protesto: Documentos eletronicos que confirmam a efetivacao do

protesto de um titulo.

## Informações de Acesso e Configuracoes

## Endpoints do Sistema (URLs)

## Ambiente de Homologacao (Testes)

Utilize este ambiente para realizar todos os seus testes de integracao. Lembre  e de substituir UF pela sigla do estado correspondente.

## WSDL: craUF.cra2l.com.br/craUF/xml/protestos.php?wsdl

Exemplo (DF): https://cradf.cra21.com.br/cradf/xml/protestos.php?wsdl

## Ambiente de Producao

Este ambiente é para uso oficial, apos a conclusao e validacao de todos os testes em homologacao.

## WSDL:: craUF.crabr.com.br/craUF/xml/protestos.php?wsdl

Exemplo (DF): https://cradf.crabr.com.br/cradf/xml/protestos.php?wsdl

Atencao: Em ambos os ambientes, é obrigatorio o uso do protocolo HTTPs para todas as requisicoes.

## Configuracoes do Servidor

Tamanho máximo de arquivos: 100 MB (média)

Tempo limite de upload (Timeout): 30 minutos.

---

<!-- page 2 -->

Observacao: Caso ocorra um erro de timeout antes dos 30 minutos, verifique as configuracoes de tempo de espera na sua aplicação cliente.

---

<!-- page 3 -->
