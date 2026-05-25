# CEP

# Documento de detalhadamento da carga

[Documentação CEP](https://suporte.notariado.org.br/support/solutions/articles/43000536374-cep-especificac%C3%A3o-dos-campos-de-carga#)

# Especificação dos campos

Com base na documentação fornecida, estruturei a especificação dos campos, dividindo-a nas 3 categorias solicitadas (Geral, Referentes e Variável/Grupos). Como o foco é a integração via JSON, adaptei as observações de formato (como datas e booleanos) para refletir essa estrutura.

### 1. Especificações: Geral (Campos Principais)

Estes são os campos básicos que compõem o escopo principal do ato lavrado.

| Campo | Tipo | Formato | Obrigatório |
| --- | --- | --- | --- |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">tipoAtoCep</code> | Tipo do ato lavrado (tabela TipoAtoCep) | *variável (código ou JSON) | Sim |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">naturezaEscritura</code> | Natureza da escritura (tabela NaturezaEscritura) | *variável | Sim, se TipoAtoCep = 1 (Escritura) |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">naturezaAtaNotarialDeUsucapiao</code> | Natureza da ata notarial de usucapião | *variável | Sim, se TipoAtoCep = 9 (Ata Not. Usucapião) |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">mne</code> | Matrícula notarial eletrônica (sem pontuação). Ex: <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">100000202406140000120019</code>. Se físico, informar <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">null</code> | 29A | Sim, se o ato for digital ou híbrido (e-Notariado) |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">data</code> | Data em que o ato foi lavrado | DATA (YYYY-MM-DD em JSON) | Sim |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">livro</code> | Número do livro onde o ato foi lavrado | 8N | Sim |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">livroComplemento</code> | Identificação complementar do livro (ex: Livro 100F → informar F) | 50A | Não |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">folha</code> | Número da folha inicial em que o ato foi lavrado | 4N | Sim |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">folhaComplemento</code> | Identificação complementar da folha (ex: folha 123G → informar G) | 50A | Não |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">valor</code> | Valor do ato lavrado (valor discriminado no ato, não o pago pela lavratura) | 20N | Sim |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">regimeBens</code> | Regime de bens das partes | 50A | Sim, para escrituras declaratórias e de dissolução de união estável |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">existeBemEDireito</code> | Indicativo se o ato contempla bens e direitos | *variável (JSON: <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">true</code> ou <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">false</code>) | Não |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">dataContrato</code> | Data do contrato particular firmado entre as partes | DATA | Não |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">naturezaLitigio</code> | Natureza do litígio (tabela NaturezaLitigio) | 2N | Sim, para escrituras de mediação e conciliação |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">acordo</code> | Informação sobre o acordo (SIM ou NÃO) | 3A | Sim, para escrituras de mediação e conciliação |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">dataValidade</code> | Data de validade da procuração | DATA | Não |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">complementacao</code> | Campo opcional para observações e detalhamentos de procurações | 50A | Não |

---

### Especificações: Bloco referentes (Atos Anteriores)

Estes campos formam o bloco de referentes. O preenchimento é obrigatório para atos de Revogação, Renúncia, Substabelecimento e Escrituras de Rerratificação.

| Campo | Tipo | Formato | Obrigatório |
| --- | --- | --- | --- |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">tipoAtoCep</code> | Tipo do ato antecessor ou original da procuração | *variável | Sim |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">cns</code> | CNS do cartório do ato antecessor (para proc. privada, cartório de rec. de firma) | 6A | Sim |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">livro</code> | Número do livro em que o ato anterior foi lavrado | 20N | Sim |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">livroComplemento</code> | Identificação complementar do livro do ato revogado | 50A | Sim, se no ato antecessor foi informado |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">folha</code> | Número da folha em que o ato anterior foi lavrado | 10A | Sim |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">folhaComplemento</code> | Identificação complementar da folha do ato revogado | 50A | Sim, se no ato antecessor foi informado |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">referenteUFOrigem</code> | Sigla do estado onde o ato anterior foi lavrado (mantido para compab. legado) | 2A | Sim (em referentes, se não usar CNS) |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">referenteCidadeOrigem</code> | Código IBGE do município onde o ato anterior foi lavrado (compab. legado) | 7N | Sim (em referentes, se não usar CNS) |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">desconhecido</code> | Usado quando escrevente desconhece cartório/origem do ato anterior | 100A (JSON: <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">true</code>/<code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">false</code>) | Sim (em referentes) |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">referenteCartorio</code> | Denominação do cartório em que o ato anterior foi lavrado (compab. legado) | 50A | Sim (em referentes, se não usar CNS) |

---

### Especificações: Variável (Grupos bensEDireitos e partes)

Campos estruturados como listas de objetos no JSON, podendo conter múltiplas entradas para um único ato.

#### Grupo bensEDireitos

Obrigatório se existeBemEDireito = true.

| Campo | Tipo | Formato | Obrigatório |
| --- | --- | --- | --- |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">bensEDireitos</code> | Agrupador de múltiplos bens | (Array/Objeto JSON) | Sim, se existeBemEDireito = <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">true</code> |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">descricaoPormenorizada</code> | Descrição pormenorizada da operação realizada | <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">string</code> | Não explicitado |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">valorBemEDireito</code> | Valor do bem e direito | 20A | Não explicitado |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">valorFiscal</code> | Valor fiscal do bem | 20A | Não explicitado |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">formaPagamento</code> | Forma de Pagamento (tabela FormaPagamento) | *variável | Não explicitado |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">prazoPagamento</code> | Prazo de pagamento (tabela PrazoPagamento) | *variável | Não explicitado |

#### Grupo partes

Para cada ato deve ser incluída pelo menos uma parte, independente da qualidade.

| Campo | Tipo | Formato | Obrigatório |
| --- | --- | --- | --- |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">partes</code> | Informar as partes do ato notarial | (Array JSON) | Sim (Mínimo 1 por ato) |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">estrangeiro</code> | Indicativo de pessoa estrangeira (0-Não, 1-Sim) | 1A | Não |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">nome</code> | Nome da parte envolvida no ato lavrado | 150A | Sim |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">tipoDocumento</code> | Tipo do documento (tabela ParteTipoDocumento) | 50A | Sim |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">numeroDocumento</code> | Número do documento informado pela parte | 20N | Não explicitado |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">identidade</code> | Número do documento de identidade da parte | 20A | Não explicitado |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">orgaoEmissor</code> | Órgão emissor da identidade. (Ex.: SSP-RJ) | 20A | Não explicitado |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">qualidade</code> | Qualidade da parte envolvida (tabela ParteQualidade) | 60A | Sim |

---

Observação de Validação de Chave: Quando houver atos com mesma numeração de Livro e Folha, será obrigatório o preenchimento de livroComplemento ou folhaComplemento para evitar erro de duplicidade.

# Tabelas de domínio

### Tabela de Domínio: TipoAtoCep

Esta tabela define os identificadores textuais que o seu sistema deve enviar no campo tipoAtoCep do payload JSON.

| Código JSON | Descrição |
| --- | --- |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">Escritura</code> | Escritura |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">Procuracao</code> | Procuração |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">ProcuracaoParaFinsPrevidenciarios</code> | Procuração para Fins Previdenciários |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">RenunciaDeProcuracao</code> | Renúncia de Procuração |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">RevogacaoDeProcuracao</code> | Revogação de Procuração |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">Substabelecimento</code> | Substabelecimento |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">AtaNotarial</code> | Ata Notarial |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">AtaNotarialDeUsucapiao</code> | Ata Notarial de Usucapião |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">ProcuracaoPrivada</code> | Procuração Privada (Uso restrito a atos "Referentes") |

---

### Regras de Negócio e Validações de Requisitos

Para a implementação correta desta tabela no seu sistema, considere as seguintes condições lógicas baseadas no tipo de ato selecionado:

#### 1. Condicionais de Obrigatoriedade

- Se Escritura: Torna-se obrigatório o preenchimento dos campos naturezaEscritura e acordo.

- Se AtaNotarialDeUsucapiao: Torna-se obrigatório o preenchimento do campo naturezaAtaNotarialDeUsucapiao.

- Se RenunciaDeProcuracao, RevogacaoDeProcuracao ou Substabelecimento: É obrigatório enviar o bloco referentes contendo os dados do ato antecessor (como CNS, Livro, Folha e Tipo do Ato original).

#### 2. Regras Específicas

- Procuração Privada: O código ProcuracaoPrivada nunca deve ser usado para o ato principal que está sendo lavrado no seu cartório. Ele serve apenas para identificar que o ato original que está sendo revogado, renunciado ou substabelecido era uma procuração particular (com firma reconhecida).

- Revogação de Procuração: Ao utilizar o código RevogacaoDeProcuracao, não é necessário qualificar a "natureza" do ato.

- Não Enviar: Atos de Testamento nunca devem ser informados com esses códigos na central CEP; eles pertencem exclusivamente à central RCTO.

### Tabela de Domínio: NaturezaEscritura

Esta tabela define as naturezas jurídicas das escrituras lavradas. O preenchimento deste campo é obrigatório sempre que o tipoAtoCep for igual a 1 (Escritura).

| Código | Descrição |
| --- | --- |
| 1 | ACORDO EXTRAJUDICIAL |
| 4 | ALIENAÇÃO FIDUCIÁRIA |
| 5 | COMPRA E VENDA |
| 6 | CONFISSÃO DE DÍVIDA OU DAÇÃO EM PAGAMENTO |
| 10 | CESSÃO |
| 14 | DECLARAÇÃO |
| 15 | DECLARATÓRIA DE UNIÃO ESTÁVEL |
| 16 | DECLARATÓRIA DE UNIÃO ESTÁVEL HOMOAFETIVA |
| 17 | DESAPROPRIAÇÃO |
| 20 | DISSOLUÇÃO DE UNIÃO ESTÁVEL |
| 21 | DISTRATO |
| 22 | DOAÇÃO |
| 23 | EMANCIPAÇÃO |
| 24 | HIPOTECA |
| 25 | INCORPORAÇÃO |
| 26 | BEM DE FAMÍLIA |
| 28 | LOCAÇÃO |
| 30 | PACTO ANTENUPCIAL |
| 31 | PENHOR |
| 33 | PROMESSA DE CESSÃO DE DIREITOS AQUISITIVOS |
| 34 | QUITAÇÃO |
| 35 | RERRATIFICAÇÃO |
| 36 | RECONHECIMENTO DE PATERNIDADE |
| 38 | REGISTRO DE CHANCELA MECÂNICA |
| 39 | REMISSÃO DE FORO E LAUDÊMIOS |
| 43 | SEM VALOR DECLARADO |
| 45 | SERVIDÃO |
| 46 | USUFRUTO (RESERVA, INSTITUIÇÃO E RENÚNCIA) |
| 48 | CONDOMÍNIO |
| 49 | PARCELAMENTO |
| 50 | SOCIEDADE E FUNDAÇÕES |
| 51 | TRANSAÇÃO |
| 52 | DIREITO DE USO OU SUPERFÍCIE |
| 53 | DIVISÃO |
| 54 | FIANÇA |
| 55 | DIRETIVAS ANTECIPADAS DE VONTADE |
| 56 | CONFERÊNCIA DE BENS |
| 57 | NOVAÇÃO |
| 58 | CRÉDITO COM GARANTIA |
| 59 | EMISSÃO DE CÉDULA |
| 60 | EMISSÃO DE DEBENTURES |
| 61 | REVOGAÇÃO |
| 62 | RENÚNCIA DE DIREITOS HEREDITÁRIOS |
| 63 | COMODATO OU MÚTUO |
| 70 | PRESTAÇÃO DE SERVIÇOS |
| 71 | ARRENDAMENTO MERCANTIL (LEASING) |
| 72 | CONCESSÃO DE DOMÍNIO |
| 74 | CONTRATO DE NAMORO |
| 75 | CONCILIAÇÃO |
| 76 | MEDIAÇÃO |
| 77 | AFETAÇÃO |
| 78 | AUTOCURATELA |
| 79 | DECLATÓRIA COM DIRETIVAS DE CURATELA |
| 80 | PROMESSA DE COMPRA E VENDA |

---

### Observações e Regras de Negócio

Para garantir a integridade dos dados enviados, seu sistema deve observar as seguintes validações específicas para certas naturezas:

- Rerratificação (Código 35): É obrigatório o preenchimento do bloco de campos referentes (dados do ato original que está sendo retificado). Além disso, deve-se utilizar o código 4 (Aditamento) no campo prazoPagamento.

- Mediação (Código 76): Torna-se obrigatória a qualificação das seguintes partes no ato: requerente, requerido, mediador e interveniente. Também exige o preenchimento dos campos naturezaLitigio e acordo.

- Conciliação (Código 75): Exige a qualificação das partes: requerente, requerido, conciliador e interveniente. Também requer os campos naturezaLitigio e acordo.

- União Estável (Códigos 15, 16 e 20): Para estas naturezas, o preenchimento do campo regimeBens é obrigatório.

- Atos Não Informados na CEP:

    - Reestabelecimento de sociedade conjugal e Adjudicação de Inventário devem ser informados apenas na central CESDI.

    - Revogação de testamento deve ser informada apenas no RCTO.

### Tabela de Domínio: NaturezaAtaNotarialDeUsucapiao

Esta tabela deve ser utilizada exclusivamente quando o campo tipoAtoCep for preenchido com o valor 9 ou AtaNotarialDeUsucapiao. O preenchimento deste campo é obrigatório nesta condição.

| Código JSON | Natureza |
| --- | --- |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">Ordinaria</code> | Ordinária |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">Extraordinaria</code> | Extraordinária |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">EspecialRural</code> | Especial Rural |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">EspecialUrbana</code> | Especial Urbana |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">EspecialFamiliar</code> | Especial Familiar |

---

### Regras de Negócio e Validações

- Obrigatoriedade Condicional: O sistema deve validar que, se o tipo de ato selecionado for Ata Notarial de Usucapião, um dos valores desta tabela deve ser obrigatoriamente enviado no payload JSON.

- Formato do Campo: Assim como os demais campos de domínio, este campo aceita o código JSON (texto) conforme listado na tabela acima.

### Tabela de Domínio: Parte Tipo Documento

Esta tabela define o tipo de documento de identificação utilizado pelas partes envolvidas no ato notarial. O campo tipoDocumento é de preenchimento obrigatório.

| Código | Descrição |
| --- | --- |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">CPF</code> | Quando o documento informado pela parte for CPF |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">CNPJ</code> | Quando o documento informado pela parte for CNPJ |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">RNM</code> | Registro Nacional Migratório |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">Desconhecido</code> | Somente informar se realmente não existir documento conhecido |

> Nota de Validação: O sistema CENSEC realiza a verificação do dígito verificador para garantir que o número do CPF informado é válido. Caso um CPF seja considerado inválido, o sistema recusará o arquivo completo.

---

### Tabela de Domínio: Forma de Pagamento

Esta tabela deve ser utilizada para preencher o campo formaPagamento dentro do grupo de bensEDireitos.

| Código | Descrição |
| --- | --- |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">1</code> | Cheque |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">2</code> | Dinheiro |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">3</code> | Nota Promissória |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">4</code> | Permuta |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">5</code> | Transferência |
| <code class="bg-gray-100 dark:bg-gray-800 text-[#E25555] px-1.5 py-0.5 rounded font-mono text-[0.9em]">6</code> | Outras |

Regras de Implementação:

- Valor Nulo: É permitido informar o valor null neste campo caso a forma de pagamento não se aplique ao ato notarial praticado.

- Contexto: Este campo é parte integrante do grupo bensEDireitos, que deve ser preenchido sempre que o campo existeBemEDireito for sinalizado como verdadeiro (true).

### Tabela de Domínio: Prazo Pagamento

Esta tabela define os prazos acordados para o pagamento dos bens ou direitos envolvidos no ato notarial.

| Código | Descrição | Observação |
| --- | --- | --- |
| 1 | AVista |  |
| 2 | APrazo |  |
| 3 | Antecipado |  |
| 4 | Aditamento | Utilizar para as escrituras de rerratificação (Natureza Escritura = 35) |

---

### Regras de Negócio e Observações Técnicas

- Preenchimento Opcional: O sistema permite que este campo seja enviado como null caso o prazo de pagamento não se aplique ao ato notarial que está sendo praticado.

- Vínculo com Rerratificação: O código 4 (Aditamento) é de uso específico para escrituras que possuem a Natureza Escritura definida como 35 (Rerratificação).

### Tabela de Domínio: Parte Qualidade

Esta tabela define as qualidades que podem ser atribuídas às partes. Note que algumas qualidades são genéricas, enquanto outras são restritas a tipos específicos de escrituras.

| TipoAtoCep | Qualidade | Contempla |
| --- | --- | --- |
| Todos | Outorgado |  |
| Todos | Outorgante | Assistentes, assina a rogo, representante, credor, anuente e testemunha |
| Todos | Interveniente |  |
| Todos | Usufrutuário | Reversa, renúncia ou restabelecimento |
| Escritura de Conciliação e Mediação | Requerente |  |
| Escritura de Conciliação e Mediação | Requerido |  |
| Escritura de Conciliação | Conciliador |  |
| Escritura de Mediação | Mediador |  |

---

### Regras de Negócio e Validações

- Uso Geral: Embora existam restrições para atos específicos, as qualidades em geral podem ser utilizadas em qualquer ato.

- Acentuação Obrigatória: As qualidades que possuem acentuação (como "Usufrutuário") devem ser informadas exatamente como constam na tabela.

- Obrigatoriedade por Natureza:

    - Escrituras de Mediação: É obrigatória a inclusão das partes: Requerente, Requerido, Mediador e Interveniente.

    - Escrituras de Conciliação: É obrigatória a inclusão das partes: Requerente, Requerido, Conciliador e Interveniente.

- Regra de Quantidade: Para cada ato enviado à CENSEC, deve ser incluída pelo menos uma parte, independentemente da qualidade assumida.

- Usufrutuário: Esta qualidade abrange as partes existentes para reserva, instituição e renúncia de usufruto.

### Tabela de Domínio: NaturezaLitigio

| <b>Código</b> | <b>Descrição</b> |
| --- | --- |
| 1 | Bancário |
| 2 | Concessionária de Água |
| 3 | Concessionária de Gás |
| 4 | Concessionária de Luz |
| 5 | Consumidor |
| 6 | Contrato |
| 7 | Empresarial |
| 8 | Família |
| 9 | Locação |
| 10 | Mobiliário |
| 11 | Previdência |
| 12 | Saúde |
| 13 | Seguro |
| 14 | Serviço Público |
| 15 | Sucessões |
| 16 | Telefonia |
| 17 | Transporte |
| 18 | Transporte - Avião |
| 19 | Transporte - Barco |
| 20 | Transporte - Metrô |
| 21 | Transporte - Ônibus |

---

### Regras de Negócio e Validações

- Obrigatoriedade: O preenchimento desta tabela é obrigatório para escrituras de mediação e conciliação.

- Contexto de Uso: O código a ser utilizado varia conforme a natureza real do litígio tratada no ato notarial.

- Vínculo com Outros Campos: Sempre que esta tabela for utilizada, o campo acordo (SIM ou NÃO) também deverá ser preenchido obrigatoriamente.

Para finalizar o levantamento das tabelas de domínio do arquivo CEP, apresento a documentação da tabela Regime de Bens. Esta informação é crucial para atos que envolvem a definição ou dissolução de vínculos conjugais e de união estável.

### Tabela de Domínio: regimeBens

Esta tabela define os códigos que devem ser utilizados no campo regimeBens do payload JSON.

Código JSON

ComunhaoParcial

ComunhaoUniversal

ParticipacaoFinalNosAquestos

SeparacaoTotal

SeparacaoObrigatoria

RegimeEspecificoAtribuidoEmPactoAntenupcial

---

### Regras de Negócio e Observações Técnicas

- Obrigatoriedade: O preenchimento deste campo é obrigatório para escrituras declaratórias de união estável (incluindo homoafetiva) e escrituras de dissolução de união estável.

- Formatação: Para a integração via JSON, os códigos devem ser enviados exatamente como listados na coluna acima, sem espaços ou acentuações, respeitando o padrão CamelCase apresentado no documento.

# Exemplo de payload json

```json
{
  "Cns": 123456,
  "quinzena": {
    "anoReferencia": 2026,
    "quinzenaReferencia": 1,
    "mesReferencia": "Maio"
  },
  "AtosCep": [
    {
      "tipoAtoCep": "Escritura",
      "naturezaEscritura": 5,
      "data": "2026-05-02",
      "livro": 1500,
      "livroComplemento": "A",
      "folha": 12,
      "valor": 500000.00,
      "existeBemEDireito": true,
      "bensEDireitos": [
        {
          "descricaoPormenorizada": "Lote urbano localizado na quadra 10",
          "valorBemEDireito": "500000.00",
          "valorFiscal": "450000.00",
          "formaPagamento": 5,
          "prazoPagamento": 1
        }
      ],
      "partes": [
        {
          "estrangeiro": "0",
          "nome": "João da Silva",
          "tipoDocumento": "CPF",
          "numeroDocumento": "11122233344",
          "qualidade": "Outorgante"
        },
        {
          "estrangeiro": "0",
          "nome": "Empresa Fictícia LTDA",
          "tipoDocumento": "CNPJ",
          "numeroDocumento": "12345678000199",
          "qualidade": "Outorgado"
        }
      ]
    },
    {
      "tipoAtoCep": "RevogacaoDeProcuracao",
      "data": "2026-05-04",
      "livro": 1501,
      "folha": 55,
      "valor": 0.00,
      "referentes": {
        "tipoAtoCep": "Procuracao",
        "cns": "123456",
        "livro": 1400,
        "folha": "100"
      },
      "partes": [
        {
          "estrangeiro": "0",
          "nome": "Maria Souza",
          "tipoDocumento": "CPF",
          "numeroDocumento": "99988877766",
          "qualidade": "Outorgante"
        }
      ]
    }
  ]
}
```
