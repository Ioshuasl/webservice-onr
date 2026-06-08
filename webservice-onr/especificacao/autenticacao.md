# WSOficio — Autenticação

> Extraído de [`especificacao_wsoficio_dev.md`](../../especificacao_wsoficio_dev.md) (seções 1, 2 e 3.1).
> Inclui definição/escopo, requisitos de segurança (hash SHA-1) e login (`LoginUsuarioCertificado`). Ver também [`hash.md`](../hash.md).

---
## **1 Definição e Escopo** 

O presente documento visa descrever e especificar os parâmetros de entrada e saída necessários para que sejam desenvolvidos internamente pelos parceiros do ONR – Operador Nacional do Sistema de Registro Eletrônico de imóveis – módulos de aplicação que ofereçam comunicação e integração com os diversos serviços oferecidos pela SAEC. 

A proposta contempla comunicação via Web Services, desta maneira serão detalhados neste documento os requisitos de segurança, bem como os dados componentes dos envelopes de entrada e retorno. 

## **2 Requisitos de Segurança** 

O modelo de segurança consiste em validação de hash entre as mensagens. Além disso, como acréscimo de segurança, o acesso aos serviços do ONR está restrito por IP. 

Um hash de autenticação é formado pela combinação da chave + token. O hash é então codificado no padrão SHA-1, codificação UTF-8. 

A chave é uma string única que é de conhecimento somente do ONR e da instituição. Essa chave não é transmitida entre as mensagens.  Para obter a chave única referente à sua instituição entre em contato com o ONR através do e-mail: oficioeletronico@onr.org. 

O token é uma string dinâmica criada para, em conjunto com a chave, gerar o hash de autenticação. Dessa forma o hash usado em cada mensagem será diferente e poderá ser usado apenas uma vez. Caso a mensagem seja interceptada, o mesmo hash não poderá ser reaproveitado impedindo assim o uso indevido da aplicação. 

Esse modelo de autenticação é de gerenciamento simples e seguro, pois o token é gerado no momento da requisição, além da chave que precisa ser de conhecimento para cada entidade envolvida. 

## **3 Definição e Regras de Serviços** 

## **3.1 Login** 

Todos os serviços disponibilizados pelo ONR através de Web Services utilizam um sistema de validação por hash. Um hash válido é gerado através da combinação de uma chave + token (Para mais informações consulte o capítulo 2). O token necessário para gerar o hash é obtido através da validação de usuário, utilizando um serviço de “Login”. 

O Web Service de Login tem o único propósito de retornar os tokens a serem utilizados para gerar o hash necessário para a troca das mensagens. Os tokens são apenas retornados após validação das credenciais de um usuário válido, previamente cadastrado no sistema OFÍCIO ELETRÔNICO. O serviço pode retornar vários tokens em uma única requisição, isso para que não seja 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

14 

necessário uma nova requisição de token sempre que for executado outro serviço. A quantidade padrão de tokens retornados pelo serviço em uma única requisição é 5, porém esse valor pode ser alterado. 

Os tokens são strings dinâmicas, formadas por 6 caracteres. Ex.: 

JGX3QL LGO8A7 XUWR08 AG5K3U 1MLG7B 

Cada token poderá ser usado apenas uma vez. Depois de usado o sistema não permitirá que o mesmo token seja reutilizado. Além disso cada token tem uma validade de 8 horas a partir de sua geração. 

Segue diagrama que contempla uma visão geral referente à utilização dos serviços oferecidos pelo ONR através de Web Services: 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

15 

**==> picture [525 x 428] intentionally omitted <==**

- O contrato WSDL para homologação pode ser visualizado em:  https://hml3- wsoficio.onr.org.br/login.asmx?wsdl 

Métodos a serem referenciados: **LoginUsuarioCertificado** 

## **3.1.1 Envelope de Entrada - LoginUsuarioCertificado** 

Os parâmetros de entrada são: 

- SUBJECTCN – Valor SUBJECTCN do certificado do usuário (tipo string(100)); 

- ISSUERO – Valor ISSUERO do certificado do usuário (tipo string(10)); 

- PUBLICKEY – Valor PUBLICKEY do certificado do usuário (tipo string(1000)); 

- SERIALNUMBER – Valor SERIALNUMBER do certificado do usuário (tipo string(100)); 

- VALIDUNTIL – Valor VALIDUNTIL do certificado do usuário (tipo string); 

- CPF – CPF do usuário (tipo string(11)); 

- EMAIL – E-mail do usuário (tipo string(100)); 

**==> picture [129 x 76] intentionally omitted <==**

**Especificação de Serviços para Interoperabilidade com o Sistema do ONR (WSOficio)** 

16 

- IDParceiroWS – Código do parceiro para utilização do sistema de Web Services (tipo int). Esse código deve ser solicitado previamente à ao ONR, assim como a chave para geração de hash. 

## **3.1.2 Envelope de Saída - LoginUsuarioCertificado** 

Os parâmetros de saída são: 

- RETORNO – Indica se houve erro ou não na execução do método (tipo boolean); 

- CODIGOERRO – (se RETORNO = false) Código do erro (tipo int); 

- ERRODESCRICAO – (se RETORNO = false) Descrição do erro (tipo string(200)); 

- IDUsuario – (se RETORNO = true)  Código do usuário no Ofício Eletrônico (tipo int); 

- IDInstituicao – (se RETORNO = true)  Código da Instituição/Cartório no Ofício Eletrônico (tipo int); 

- Ativo – (se retorno = true) Indica se cliente está ativo ou não (tipo boolean); 

- Tokens – (se retorno = true) Tokens gerados (array de strings(6)). 

Listagem de erros possíveis retornados no envelope de saída: 

|Codigoerro|Errodescricao|
|---|---|
|0|Erro de sistema.|
|1|Não foi possível gerar os tokens.|
|2|Request inválido.|
|10|O SUBJECTCN não foi informado.|
|11|O ISSUERO não foi informado.|
|12|O PUBLICKEY não foi informado.|
|13|O SERIALNUMBER não foi informado.|
|14|O VALIDUNTIL não foi informado.|
|15|O CPF não foi informado.|
|16|O EMAIL não foi informado.|
|17|O IDParceiroWS informado é inválido.|
|51|Usuário não encontrado.|
|52|O departamento ou instituição do usuário não estão<br>ativados.|
|53|Usuário não está ativo.|
