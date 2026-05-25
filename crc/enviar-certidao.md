# CRC - enviarCertidao.cfc

Fonte: [manual crc.md](manual%20crc.md). Origem: páginas 3 a 11 do manual convertido.

Este serviço envia os dados da 2ª via da certidão para o cartório solicitante, para ser impressa. O serviço identifica o tipo de certidão enviada a partir da tag `<codigo_hash>`.

## Serviço

`enviarCertidao.cfc`

## Endpoints

### Homologação

- <https://wsh.registrocivil.org.br/enviarCertidao.cfc?wsdl> - **Disponível**
- <http://wsh.registrocivil.org.br/enviarCertidao.cfc?wsdl> - **Disponível**

### Produção

- <http://ws.registrocivil.org.br/enviarCertidao.cfc?wsdl> - **Disponível**
- <https://ws.registrocivil.org.br/enviarCertidao.cfc?wsdl> - **Disponível**

## Orientações Gerais

- Em caso de emissão de 2ª via de certidão, preencha as tags do grupo `<emissao>` e deixe as tags do grupo `<rejeicao>` nulas.
- Em caso de rejeição, preencha as tags do grupo `<rejeicao>` e deixe as tags do grupo `<emissao>` nulas.
- Todos os arquivos de envio devem ser assinados e codificados em BASE64.
- Os comentários nos exemplos abaixo indicam as descrições do manual e não devem ser enviados no XML final.

## Arquivo para Nascimento e Transcrição de Nascimento

```xml
<?xml version="1.0" encoding="ISO-8859-1"?>
<certidao>
  <numero_cnj></numero_cnj> <!-- Número do CNJ do cartório dono do registro -->
  <codigo_hash></codigo_hash> <!-- Código do Pedido de Certidão -->
  <emissao>
    <qtd_averbacoes></qtd_averbacoes>
    <nome_crianca></nome_crianca>
    <cpf_registrado></cpf_registrado>
    <matricula></matricula>
    <data_registro></data_registro> <!-- Data do Registro de nascimento - DD/MM/YYYY -->
    <data_nascimento_extenso></data_nascimento_extenso> <!-- Data de nascimento por extenso -->
    <data_nascimento></data_nascimento> <!-- Data de nascimento - DD/MM/YYYY -->
    <hora_nascimento></hora_nascimento> <!-- Hora do nascimento - HH:mm (17:30) -->
    <naturalidade></naturalidade>
    <municipio_nascimento></municipio_nascimento> <!-- Município da Maternidade - UF da Maternidade -->
    <municipio_registro></municipio_registro> <!-- Município do Cartório - UF do Cartório -->
    <local_nascimento></local_nascimento> <!-- Nome da Maternidade - Endereço da Maternidade -->
    <sexo></sexo> <!-- Sexo da criança (Masculino ou Feminino) -->
    <filiacao></filiacao> <!-- Mãe/Pai e respectivas naturalidades -->
    <avos></avos> <!-- Avós maternos e paternos -->
    <flag_gemeo></flag_gemeo> <!-- Sim=Nasceu também irmão(s) gêmeo(s); Não=Não nasceu irmão(s) gêmeo(s) -->
    <gemeos>
      <qtd_irmaos>2</qtd_irmaos> <!-- Quantidade de irmãos gêmeos; use 0 se nenhum -->
      <irmao>
        <nome_matricula></nome_matricula> <!-- Nome e matrícula dos irmãos -->
      </irmao>
      <irmao>
        <nome_matricula></nome_matricula> <!-- Repita este grupo para cada irmão; deixe 1 grupo em branco se não houver irmãos gêmeos -->
      </irmao>
    </gemeos>
    <data_registro_extenso></data_registro_extenso> <!-- Data do registro por extenso -->
    <numero_dnv></numero_dnv> <!-- Número da DNV (Declaração de Nascido Vivo) da criança -->
    <observacoes_averbacoes></observacoes_averbacoes>
    <valor_adicional></valor_adicional> <!-- Valor adicional para emissão da certidão, se aplicável - NNN.NN -->
    <num_selo></num_selo> <!-- Número do Selo Digital, se aplicável -->
    <cod_selo></cod_selo> <!-- Código de Validação do Selo Digital, se aplicável -->
    <desc_selo></desc_selo> <!-- Linha de descrição do Selo Digital, se aplicável -->
    <anotacoes_cadastro>
      <registrado>
        <cep_res></cep_res>
        <grupo_sanguineo></grupo_sanguineo>
        <titulo_eleitor>
          <numero></numero>
          <zona_secao></zona_secao>
          <uf></uf>
          <municipio></municipio>
        </titulo_eleitor>
        <documentos>
          <documento> <!-- Repita o grupo documento para cada documento -->
            <tipo_doc></tipo_doc> <!-- RG, PIS, PASSAPORTE, CARTAO_NAC_SAUDE, CTPS, RESERVISTA, CNH -->
            <numero></numero>
            <data_emissao></data_emissao>
            <orgao_emissor></orgao_emissor>
            <uf_emissao></uf_emissao>
            <data_validade></data_validade>
          </documento>
        </documentos>
      </registrado>
    </anotacoes_cadastro>
  </emissao>
  <rejeicao>
    <motivo_rejeicao></motivo_rejeicao> <!-- Motivo da rejeição (textual) -->
  </rejeicao>
</certidao>
```

### Retorno

```xml
<?xml version="1.0" encoding="ISO-8859-1"?>
<certidao>
  <codigo_retorno>00000</codigo_retorno> <!-- 00000 = OK; outro número = ERRO -->
  <mensagem_retorno>Certidão enviada com sucesso!</mensagem_retorno> <!-- Mensagem explicativa ou de erro -->
  <!-- Conteúdo do seu arquivo XML -->
</certidao>
```

> **Nota:** caso não conste a tag `<data_ocorrido>`, informe `--/--/----`.

## Arquivo para Casamento e Transcrição de Casamento

```xml
<?xml version="1.0" encoding="ISO-8859-1"?>
<certidao>
  <numero_cnj></numero_cnj> <!-- Número do CNJ do cartório dono do registro -->
  <codigo_hash></codigo_hash> <!-- Código do Pedido de Certidão -->
  <emissao>
    <qtd_averbacoes></qtd_averbacoes>
    <nome_registrado_1></nome_registrado_1> <!-- Nome do cônjuge 1 após casamento; se não houver, informe nome de solteiro -->
    <nome_registrado_2></nome_registrado_2> <!-- Nome do cônjuge 2 após casamento; se não houver, informe nome de solteiro -->
    <cpf_registrado_1></cpf_registrado_1> <!-- CPF do cônjuge 1 -->
    <cpf_registrado_2></cpf_registrado_2> <!-- CPF do cônjuge 2 -->
    <matricula></matricula>
    <nomes_datas_locais></nomes_datas_locais>
    <data_registro_extenso></data_registro_extenso> <!-- Data do registro por extenso -->
    <data_registro></data_registro> <!-- Data de registro - DD/MM/YYYY -->
    <regime_bens></regime_bens>
    <novos_nomes></novos_nomes>
    <observacoes_averbacoes></observacoes_averbacoes>
    <valor_adicional></valor_adicional> <!-- Valor adicional para emissão da certidão, se aplicável - NNN.NN -->
    <num_selo></num_selo> <!-- Número do Selo Digital, se aplicável -->
    <cod_selo></cod_selo> <!-- Código de Validação do Selo Digital, se aplicável -->
    <desc_selo></desc_selo> <!-- Linha de descrição do Selo Digital, se aplicável -->
    <anotacoes_cadastro>
      <registrados>
        <registrado_1>
          <cep_res></cep_res>
          <grupo_sanguineo></grupo_sanguineo>
          <titulo_eleitor>
            <numero></numero>
            <zona_secao></zona_secao>
            <uf></uf>
            <municipio></municipio>
          </titulo_eleitor>
          <documentos>
            <documento> <!-- Repita o grupo documento para cada documento -->
              <tipo_doc></tipo_doc> <!-- RG, PIS, PASSAPORTE, CARTAO_NAC_SAUDE, CTPS, RESERVISTA, CNH -->
              <numero></numero>
              <data_emissao></data_emissao>
              <orgao_emissor></orgao_emissor>
              <uf_emissao></uf_emissao>
              <data_validade></data_validade>
            </documento>
          </documentos>
        </registrado_1>
        <registrado_2>
          <cep_res></cep_res>
          <grupo_sanguineo></grupo_sanguineo>
          <titulo_eleitor>
            <numero></numero>
            <zona_secao></zona_secao>
            <uf></uf>
            <municipio></municipio>
          </titulo_eleitor>
          <documentos>
            <documento> <!-- Repita o grupo documento para cada documento -->
              <tipo_doc></tipo_doc> <!-- RG, PIS, PASSAPORTE, CARTAO_NAC_SAUDE, CTPS, RESERVISTA, CNH -->
              <numero></numero>
              <data_emissao></data_emissao>
              <orgao_emissor></orgao_emissor>
              <uf_emissao></uf_emissao>
              <data_validade></data_validade>
            </documento>
          </documentos>
        </registrado_2>
      </registrados>
    </anotacoes_cadastro>
  </emissao>
  <rejeicao>
    <motivo_rejeicao></motivo_rejeicao> <!-- Motivo da rejeição (textual) -->
  </rejeicao>
</certidao>
```

### Retorno

```xml
<?xml version="1.0" encoding="ISO-8859-1"?>
<certidao>
  <codigo_retorno>00000</codigo_retorno> <!-- 00000 = OK; outro número = ERRO -->
  <mensagem_retorno>Certidão enviada com sucesso!</mensagem_retorno> <!-- Mensagem explicativa ou de erro -->
  <!-- Conteúdo do seu arquivo XML -->
</certidao>
```

Os campos declarados no XML de entrada `enviarCertidaoCasamento.xml` correspondem ao impresso abaixo, na mesma ordem.

## Arquivo para Óbito e Transcrição de Óbito

```xml
<?xml version="1.0" encoding="ISO-8859-1"?>
<certidao>
  <numero_cnj></numero_cnj> <!-- Número do CNJ do cartório dono do registro -->
  <codigo_hash></codigo_hash> <!-- Código do Pedido de Certidão -->
  <emissao>
    <qtd_averbacoes></qtd_averbacoes>
    <nome_falecido></nome_falecido>
    <cpf_registrado></cpf_registrado>
    <matricula></matricula>
    <sexo></sexo> <!-- Sexo do falecido (Masculino ou Feminino) -->
    <cor></cor> <!-- Cor da pele do falecido -->
    <estado_civil_idade></estado_civil_idade>
    <naturalidade></naturalidade>
    <documento_identificacao></documento_identificacao>
    <matricula_nascimento></matricula_nascimento>
    <eleitor></eleitor>
    <residencia_filiacao></residencia_filiacao>
    <data_hora_falecimento_extenso></data_hora_falecimento_extenso> <!-- Data e hora de falecimento por extenso -->
    <data_falecimento></data_falecimento> <!-- Data de falecimento - DD/MM/YYYY -->
    <local_falecimento></local_falecimento>
    <causa_morte></causa_morte>
    <cemiterio></cemiterio>
    <declarante></declarante>
    <nome_numero_medico></nome_numero_medico>
    <observacoes_averbacoes></observacoes_averbacoes>
    <valor_adicional></valor_adicional> <!-- Valor adicional para emissão da certidão, se aplicável - NNN.NN -->
    <num_selo></num_selo> <!-- Número do Selo Digital, se aplicável -->
    <cod_selo></cod_selo> <!-- Código de Validação do Selo Digital, se aplicável -->
    <desc_selo></desc_selo> <!-- Linha de descrição do Selo Digital, se aplicável -->
    <anotacoes_cadastro>
      <registrado>
        <cep_res></cep_res>
        <grupo_sanguineo></grupo_sanguineo>
        <titulo_eleitor>
          <numero></numero>
          <zona_secao></zona_secao>
          <uf></uf>
          <municipio></municipio>
        </titulo_eleitor>
        <documentos>
          <documento> <!-- Repita o grupo documento para cada documento -->
            <tipo_doc></tipo_doc> <!-- RG, PIS, PASSAPORTE, CARTAO_NAC_SAUDE, CTPS, RESERVISTA, CNH -->
            <numero></numero>
            <data_emissao></data_emissao>
            <orgao_emissor></orgao_emissor>
            <uf_emissao></uf_emissao>
            <data_validade></data_validade>
          </documento>
        </documentos>
      </registrado>
    </anotacoes_cadastro>
  </emissao>
  <rejeicao>
    <motivo_rejeicao></motivo_rejeicao> <!-- Motivo da rejeição (textual) -->
  </rejeicao>
</certidao>
```

### Retorno

```xml
<?xml version="1.0" encoding="ISO-8859-1"?>
<certidao>
  <codigo_retorno>00000</codigo_retorno> <!-- 00000 = OK; outro número = ERRO -->
  <mensagem_retorno>Certidão enviada com sucesso!</mensagem_retorno> <!-- Mensagem explicativa ou de erro -->
  <!-- Conteúdo do seu arquivo XML -->
</certidao>
```

> **Nota:** caso não conste a tag `<data_falecimento>`, informe `--/--/----`.

## Arquivo para Emancipação

```xml
<?xml version="1.0" encoding="ISO-8859-1"?>
<certidao>
  <numero_cnj></numero_cnj> <!-- Número do CNJ do cartório dono do registro -->
  <codigo_hash></codigo_hash> <!-- Código do Pedido de Certidão -->
  <emissao>
    <qtd_averbacoes></qtd_averbacoes>
    <nome_emancipado></nome_emancipado>
    <cpf_registrado></cpf_registrado> <!-- CPF do registrado -->
    <matricula></matricula>
    <data_nascimento></data_nascimento>
    <data_nascimento_extenso></data_nascimento_extenso>
    <profissao></profissao>
    <naturalidade></naturalidade>
    <documentos_pessoais></documentos_pessoais>
    <filiacao></filiacao>
    <domicilio_emancipado></domicilio_emancipado>
    <genitor_tutor></genitor_tutor>
    <titulo></titulo>
    <serventia_data_registro_nascimento></serventia_data_registro_nascimento>
    <data_registro_extenso></data_registro_extenso>
    <observacoes_averbacoes></observacoes_averbacoes>
    <valor_adicional></valor_adicional> <!-- Valor adicional para emissão da certidão, se aplicável - NNN.NN -->
    <num_selo></num_selo> <!-- Número do Selo Digital, se aplicável -->
    <cod_selo></cod_selo> <!-- Código de Validação do Selo Digital, se aplicável -->
    <desc_selo></desc_selo> <!-- Linha de descrição do Selo Digital, se aplicável -->
  </emissao>
  <rejeicao>
    <motivo_rejeicao></motivo_rejeicao> <!-- Motivo da rejeição (textual) -->
  </rejeicao>
</certidao>
```

### Retorno

```xml
<?xml version="1.0" encoding="ISO-8859-1"?>
<certidao>
  <codigo_retorno>00000</codigo_retorno> <!-- 00000 = OK; outro número = ERRO -->
  <mensagem_retorno>Certidão enviada com sucesso!</mensagem_retorno> <!-- Mensagem explicativa ou de erro -->
  <!-- Conteúdo do seu arquivo XML -->
</certidao>
```

> **Nota:** caso não conste a tag `<data_nascimento>`, informe `--/--/----`.

## Arquivo para Interdição

```xml
<?xml version="1.0" encoding="ISO-8859-1"?>
<certidao>
  <numero_cnj></numero_cnj> <!-- Número do CNJ do cartório dono do registro -->
  <codigo_hash></codigo_hash> <!-- Código do Pedido de Certidão -->
  <emissao>
    <qtd_averbacoes></qtd_averbacoes>
    <nome_registrado></nome_registrado>
    <cpf_registrado></cpf_registrado> <!-- CPF do registrado -->
    <matricula></matricula>
    <data_nascimento></data_nascimento>
    <data_nascimento_extenso></data_nascimento_extenso>
    <estado_civil></estado_civil>
    <profissao></profissao>
    <naturalidade></naturalidade>
    <documentos_pessoais></documentos_pessoais>
    <domicilio_interdito></domicilio_interdito>
    <nome_requerente_interdicao></nome_requerente_interdicao>
    <sentenca></sentenca>
    <causa_interdicao></causa_interdicao>
    <limites_curatela></limites_curatela>
    <curador></curador>
    <data_registro_extenso></data_registro_extenso>
    <observacoes_averbacoes></observacoes_averbacoes>
    <valor_adicional></valor_adicional> <!-- Valor adicional para emissão da certidão, se aplicável - NNN.NN -->
    <num_selo></num_selo> <!-- Número do Selo Digital, se aplicável -->
    <cod_selo></cod_selo> <!-- Código de Validação do Selo Digital, se aplicável -->
    <desc_selo></desc_selo> <!-- Linha de descrição do Selo Digital, se aplicável -->
  </emissao>
  <rejeicao>
    <motivo_rejeicao></motivo_rejeicao> <!-- Motivo da rejeição (textual) -->
  </rejeicao>
</certidao>
```

### Retorno

```xml
<?xml version="1.0" encoding="ISO-8859-1"?>
<certidao>
  <codigo_retorno>00000</codigo_retorno> <!-- 00000 = OK; outro número = ERRO -->
  <mensagem_retorno>Certidão enviada com sucesso!</mensagem_retorno> <!-- Mensagem explicativa ou de erro -->
  <!-- Conteúdo do seu arquivo XML -->
</certidao>
```

> **Nota:** caso não conste a tag `<data_nascimento>`, informe `--/--/----`.

## Arquivo para Ausência

```xml
<?xml version="1.0" encoding="ISO-8859-1"?>
<certidao>
  <numero_cnj></numero_cnj> <!-- Número do CNJ do cartório dono do registro -->
  <codigo_hash></codigo_hash> <!-- Código do Pedido de Certidão -->
  <emissao>
    <qtd_averbacoes></qtd_averbacoes>
    <nome_registrado></nome_registrado>
    <cpf_registrado></cpf_registrado> <!-- CPF do registrado -->
    <matricula></matricula>
    <data_nascimento></data_nascimento>
    <data_nascimento_extenso></data_nascimento_extenso>
    <estado_civil></estado_civil>
    <profissao></profissao>
    <naturalidade></naturalidade>
    <documentos_pessoais></documentos_pessoais>
    <domicilio_anterior_ausente></domicilio_anterior_ausente>
    <nome_requerente_processo></nome_requerente_processo>
    <sentenca></sentenca>
    <tempo_ausencia_data_sentenca></tempo_ausencia_data_sentenca>
    <limites_curatela></limites_curatela>
    <curador></curador>
    <data_registro_extenso></data_registro_extenso>
    <observacoes_averbacoes></observacoes_averbacoes>
    <valor_adicional></valor_adicional> <!-- Valor adicional para emissão da certidão, se aplicável - NNN.NN -->
    <num_selo></num_selo> <!-- Número do Selo Digital, se aplicável -->
    <cod_selo></cod_selo> <!-- Código de Validação do Selo Digital, se aplicável -->
    <desc_selo></desc_selo> <!-- Linha de descrição do Selo Digital, se aplicável -->
  </emissao>
  <rejeicao>
    <motivo_rejeicao></motivo_rejeicao> <!-- Motivo da rejeição (textual) -->
  </rejeicao>
</certidao>
```

### Retorno

```xml
<?xml version="1.0" encoding="ISO-8859-1"?>
<certidao>
  <codigo_retorno>00000</codigo_retorno> <!-- 00000 = OK; outro número = ERRO -->
  <mensagem_retorno>Certidão enviada com sucesso!</mensagem_retorno> <!-- Mensagem explicativa ou de erro -->
  <!-- Conteúdo do seu arquivo XML -->
</certidao>
```

> **Nota:** caso não conste a tag `<data_nascimento>`, informe `--/--/----`.

## Arquivo para União Estável

```xml
<?xml version="1.0" encoding="ISO-8859-1"?>
<certidao>
  <numero_cnj></numero_cnj> <!-- Número do CNJ do cartório dono do registro -->
  <codigo_hash></codigo_hash> <!-- Código do Pedido de Certidão -->
  <emissao>
    <qtd_averbacoes></qtd_averbacoes>
    <nome_registrado_1></nome_registrado_1>
    <nome_registrado_2></nome_registrado_2>
    <cpf_registrado_1></cpf_registrado_1> <!-- CPF do registrado 1 -->
    <cpf_registrado_1></cpf_registrado_1> <!-- CPF do registrado 2 -->
    <matricula></matricula>
    <primeiro_companheiro></primeiro_companheiro>
    <segundo_companheiro></segundo_companheiro>
    <data_registro_extenso></data_registro_extenso>
    <titulo></titulo>
    <regime_bens></regime_bens>
    <novos_nomes></novos_nomes>
    <observacoes_averbacoes></observacoes_averbacoes>
    <valor_adicional></valor_adicional> <!-- Valor adicional para emissão da certidão, se aplicável - NNN.NN -->
    <num_selo></num_selo> <!-- Número do Selo Digital, se aplicável -->
    <cod_selo></cod_selo> <!-- Código de Validação do Selo Digital, se aplicável -->
    <desc_selo></desc_selo> <!-- Linha de descrição do Selo Digital, se aplicável -->
  </emissao>
  <rejeicao>
    <motivo_rejeicao></motivo_rejeicao> <!-- Motivo da rejeição (textual) -->
  </rejeicao>
</certidao>
```

### Retorno

```xml
<?xml version="1.0" encoding="ISO-8859-1"?>
<certidao>
  <codigo_retorno>00000</codigo_retorno> <!-- 00000 = OK; outro número = ERRO -->
  <mensagem_retorno>Certidão enviada com sucesso!</mensagem_retorno> <!-- Mensagem explicativa ou de erro -->
  <!-- Conteúdo do seu arquivo XML -->
</certidao>
```
