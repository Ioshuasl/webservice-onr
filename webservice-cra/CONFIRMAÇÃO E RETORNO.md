Segue a transcrição do PDF **"CONFIRMAÇÃO E RETORNO.pdf"**. Como o arquivo é uma imagem, alguns caracteres podem ter sido reconhecidos incorretamente pelo OCR, principalmente dentro dos exemplos XML.

# Confirmação e Retorno

**Estimated reading:** 2 minutes
**Views:** 80

Informar somente o parâmetro **user_arg**. Serão retornados todos os arquivos de confirmação/retorno conforme a data informada no nome do arquivo.

Por exemplo, ao requisitar a **CONFIRMAÇÃO** com o nome do arquivo **c3412401.141**, será retornada a confirmação de **24/01/2014**, independente da data de envio da remessa, tendo como base a data de envio da confirmação pelo cartório.

A mesma regra se aplica para o download de **RETORNO**.

## Observação

Quando há centavos no valor, esses são separados por ponto.

Exemplos:

```text
R$ 274,00 = "274"
R$ 134,80 = "134.8"
R$ 27,01  = "27.01"
```

---

# Exemplo de Arquivo de Confirmação

```xml
<?xml version="1.0" encoding="UTF-8"?>
<confirmacao>
  <nome_arquivo>C9992401.141</nome_arquivo>

  <comarca CodMun="1302603">

    <hd
      h01="0"
      h02="999"
      h03="CLUBE DE DIRETORES LOJISTAS"
      h04="18032011"
      h05="BFO"
      h06="SDT"
      h07="TPR"
      h08="10"
      h09="2"
      h10="1"
      h11="0"
      h12="1"
      h13=""
      h14="043"
      h15="1302603"
      h16=""
      h17="1"
    />

    <tr
      t01="1"
      t02="999"
      t03="77"
      t04="MIKITOS IND E COM LT"
      t05="MIKITOS IND E COM LT"
      t06="05492907000139"
      t07="FRANCISCA MENDES"
      t08="69099345"
      t09="MANAUS"
      t10="AM"
      t11=""
      t12="DM"
      t13="54995"
      t14="23042009"
      t15="14052009"
      t16="001"
      t17="959.66"
      t18="959.66"
      t19="MANAUS"
      t20="M"
      t21="N"
      t22="1"
      t23="CARLOS TADEU ROCHA DE ALMEIDA"
      t24="002"
      t25="00003535215234"
      t26="00002744212"
      t27="BIRIBA N 03"
      t28="69405000"
      t29="IRANDUBA"
      t30="AM"
      t31="01"
      t32="0000000123"
      t33=""
      t34="05072011"
      t35="0000000000"
      t36=""
      t37="00000000"
      t38=""
      t39="CENTRO"
      t40="0000000000"
      t41="000000"
      t42="0000000200"
      t43="00000"
      t44="000000000000000"
      t45="000"
      t46=""
      t47="0"
      t48="1"
      t49=""
      t50="0"
      t51=""
      t52="2"
    />

    <tl
      t01="9"
      t02="999"
      t03="CLUBE DE DIRETORES LOJISTAS"
      t04="18032011"
      t05="1"
      t06="1346.30"
      t07=""
      t08="3"
    />

  </comarca>
</confirmacao>
```

---

# Exemplo de Arquivo de Retorno

```xml
<?xml version="1.0" encoding="UTF-8"?>
<retorno>

  <nome_arquivo>R9992401.141</nome_arquivo>

  <comarca CodMun="1302603">

    <hd
      h01="0"
      h02="999"
      h03="CLUBE DE DIRETORES LOJISTAS"
      h04="18032011"
      h05="SDT"
      h06="BFO"
      h07="RTP"
      h08="10"
      h09="2"
      h10="0"
      h11="0"
      h12="0"
      h13=""
      h14="043"
      h15="1302603"
      h16=""
      h17="1"
    />

    <tr
      t01="1"
      t02="999"
      t03="77"
      t16="001"
      t17="959.66"
      t18="959.66"
      t31="01"
      t32="0000000123"
      t33="2"
      t34="05072011"
      t35="0000000000"
      t37="04012014"
      t52="2"
    />

    <tl
      t01="9"
      t02="999"
      t03="CLUBE DE DIRETORES LOJISTAS"
      t04="18032011"
      t05="00006"
      t06="1346.30"
      t07=""
      t08="3"
    />

  </comarca>

</retorno>
```