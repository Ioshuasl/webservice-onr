# Web Service — SoapUI

Estimated reading: 2 minutes · 49 views

## Visão geral

O **SoapUI** é um aplicativo de teste de serviço da Web de código aberto para **SOAP** e **REST**. Sua funcionalidade abrange inspeção de serviços da Web, invocação, desenvolvimento, simulação, testes funcionais, testes de carga e de conformidade.

Com ele, é possível realizar testes de envio de arquivo com a **CRA21**.

Para testar a conexão com o Web Service da CRA utilizando o SoapUI, siga os passos abaixo.

---

<!-- page 1 -->

## Passo 1 — Download do SoapUI

Faça o download da ferramenta no site oficial e instale em seu computador:

https://www.soapui.org/downloads/soapui/

## Passo 2 — Criação do projeto SOAP

Após a instalação, abra o SoapUI e crie um novo projeto do tipo **SOAP** (ícone correspondente na barra de ferramentas ou menu **File → New SOAP Project**).

Opções disponíveis na criação:

- **Create Empty Project** — projeto vazio
- **Import Project** — importar projeto existente
- **Import Remote Project** — importar projeto remoto

---

<!-- page 2 -->

## Passo 3 — Configuração do WSDL

Na janela **New SOAP Project**, preencha:

| Campo | Descrição |
|-------|-----------|
| **Project Name** | Nome do projeto (ex.: `Exemplo de Projeto`) |
| **Initial WSDL** | URL do WSDL do ambiente CRA (ex.: `https://crars.cra21.com.br/crars/xml/protestos.php?wsdl`) |

Opções adicionais (conforme necessidade):

- **Create Requests** — criar requisições de exemplo para todas as operações
- **Create TestSuite** — criar TestSuite para o WSDL importado
- **Relative Paths** — armazenar caminhos relativos ao arquivo do projeto

> Substitua `UF` pela sigla do estado. Exemplo DF (homologação): `https://cradf.cra21.com.br/cradf/xml/protestos.php?wsdl`

## Passo 4 — Seleção do serviço

Com o projeto criado, navegue pela árvore de serviços no painel esquerdo. Escolha a operação desejada e crie ou selecione uma **request** (requisição).

Operações típicas expostas pelo WSDL da CRA:

- Autoriza Cancelamento
- Autoriza Desistência
- Boleto Autorização
- Cancelamento
- Consulta
- Consulta Slip
- Desistência
- Homologadas
- Instrumento
- Remessa
- Retorno

---

<!-- page 3 -->

## Passo 5 — Autenticação e dados da requisição

Na janela da requisição:

1. Selecione a aba **Auth** → **Basic**
2. Preencha **Username** e **Password** com as credenciais fornecidas pelo gestor da CRA
3. Marque **Authenticate pre-emptively**
4. No corpo da requisição, insira o conteúdo do arquivo de teste dentro de **CDATA**

Exemplo de envelope SOAP para a operação **Remessa**:

```xml
<soapenv:Envelope
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:xsd="http://www.w3.org/2001/XMLSchema"
    xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
    xmlns:urn="urn:cradf.crateste.com.br">
  <soapenv:Header/>
  <soapenv:Body>
    <urn:Remessa soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
      <userArq xsi:type="xsd:string">B0242501.2025</userArq>
      <userDados xsi:type="xsd:string"><![CDATA[
<remessa>
  <hd h01="0" h02="024" h03="MONTEZUMA E CONDE ADVOGADOS ASSOCIADOS" h04="25012025" ... />
  <tr t01="1" t02="024" t03="" t04="BANCO GM S/A" t05="BANCO GM S/A" t06="592746..." ... />
  <tl t01="9" t02="024" t03="MONTEZUMA E CONDE ADVOGADOS ASSOCIADOS" t04="25012025" ... />
</remessa>
      ]]></userDados>
    </urn:Remessa>
  </soapenv:Body>
</soapenv:Envelope>
```

> O conteúdo XML da remessa deve ser inserido integralmente dentro do bloco `CDATA` em `userDados`. O nome do arquivo de remessa vai em `userArq`.

---

<!-- page 4 -->

## Passo 6 — Execução e análise do resultado

Após preencher todos os dados:

1. Clique no botão **Play** (▶) na parte superior da requisição
2. Analise a resposta do servidor no painel direito
3. Utilize as abas **RAW** ou **XML** para inspecionar o retorno

Abas úteis na requisição:

- **Headers** — cabeçalhos HTTP
- **Attachments** — anexos
- **WS-A / WS-RM** — configurações WS-Addressing e WS-ReliableMessaging (quando aplicável)

---

<!-- page 5 -->
