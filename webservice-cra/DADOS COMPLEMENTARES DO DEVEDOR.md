**Dados complementares do devedor** Estimated reading: 2 minutes 67 views 

Rotina criada para possibilitar ao apresentante informar o e-mail e o telefone do devedor. Os apresentantes poderão enviar as informações na remessa (XML), pelo Digita e Excel. Os dados serão exibidos na consulta do título e também poderão ser baixados pelos cartórios por meio do webservice de remessa (XML).

---

FORMAS DE UPLOAD 

UPLOAD POR XML 

Para enviar por XML, o apresentante deverá preencher os dados nas tags: t53 = Telefone, t54= E-mail. Exemplo: 

```xml
<remessa>
<hd ... h17="0001"/>
<tr ... t51="" t52="0002" t53="99999999999" t54="Emaildevedor@email.com.br"/>
<tr ... t51="" t52="0003" t53="99999999999" t54="Emaildevedor@email.com.br"/>
<tl... t08="0004"/>
</remessa>

```

> 
> **Copiar** 
> 
> 

ENVIO PELA APLICAÇÃO CRA21 

Para informar os dados pela aplicação CRA21, o apresentante irá acessar o menu Remessa -> Gerar remessa -> informar os dados nos campos telefone e e-mail.

ENVIO POR EXCEL APLICAÇÃO CRA21 

Para efetuar o upload por Excel pela aplicação o apresentante irá acessar o menu Remessa -> Upload remessa Excel -> informar os dados nos campos telefone e e-mail na planilha (Conforme na imagem).

---

Múltiplos contatos 

Atualmente, é possível incluir mais de um telefone e e-mail para o devedor em um título. Para realizar esse envio, é necessário separar os contatos com ponto e vírgula ";", conforme o exemplo abaixo: 

```xml
<remessa>
<hd ... h17="0001"/>
<tr ... t51="" t53="(99) 9999-9999; (99) 9999-9999" t54="devedor@email.com.br; devedor@email.com.br"/>
<tr ... t51="" t53="(99) 9999-9999; (99) 9999-9999" t54="devedor@email.com.br; devedor@email.com.br"/>
<tl... t08="0004"/>
</remessa>

```

> 
> **Copiar** 
> 
> 

---

Visualização pela aplicação CRA21 

O e-mail e telefone do devedor pode ser verificado pela aplicação CRA21, acessando o menu Consulta -> Consulta titulo.