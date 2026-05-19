# Métodos a serem referenciados — WSOficio

Extraído de `especificacao_wsoficio_dev.md` (seções **“Métodos a serem referenciados”**).

Total: **81 métodos** em **10 módulos**.

**WSDL locais no repositório:** `wsdl/certidoes.wsdl`, `wsdl/comunicacaoprefeituras.wsdl` (serviço homologação `ComunicacaoMunicipios.asmx`).

**Autenticação:** parâmetro `Hash` em cada operação (exceto login) — ver [`hash.md`](hash.md).

---

## 3.1 Login

**WSDL (homologação):** `https://hml3-wsoficio.onr.org.br/login.asmx?wsdl`

| # | Método |
|---|--------|
| 1 | LoginUsuarioCertificado |

---

## 3.2 Acompanhamento de Títulos

**WSDL (homologação):** `https://hml3-wsoficio.onr.org.br/acompanhamentotitulos.asmx?wsdl`

| # | Método |
|---|--------|
| 1 | ListTitulosAT |
| 2 | ListStatusAT |
| 3 | GetTituloAT |
| 4 | GetStatusAT |
| 5 | InsertTituloAT |
| 6 | UpdateTituloAT |
| 7 | DeleteTituloAT |
| 8 | InsertStatusAT |
| 9 | UpdateStatusAT |

---

## 3.3 Penhora Online

**WSDL (homologação):** `https://hml3-wsoficio.onr.org.br/penhoraonline.asmx?wsdl`

| # | Método |
|---|--------|
| 1 | ListPedidosPO |
| 2 | ListVarasPO |
| 3 | GetPedidoPO |
| 4 | ListBoletosPO |
| 5 | SetBaixaBoletoPO |
| 6 | SetPrenotacaoPO |
| 7 | SetCustasPO |
| 8 | SetPenhoraAverbadoPO |
| 9 | SetPenhoraExigenciaPO |
| 10 | SetPedidoPessoaRespondidoPO |
| 11 | SetPedidoPessoaDevolvidoPO |
| 12 | SetPedidoMatriculaRespondidoPO |
| 13 | SetPedidoMatriculaDevolvidoPO |
| 14 | SetPedidoNegativaLotePO |
| 15 | ListPedidosExportacaoPO |
| 16 | SetPedidoFinalizarPrenotacaoVencida |

---

## 3.4 Envio e Controle de Arquivos — Banco de Dados Light

**WSDL (homologação):** `https://hml3-wsoficio.onr.org.br/bdlight.asmx?wsdl`

| # | Método |
|---|--------|
| 1 | ListArquivosXMLBDL |
| 2 | GetArquivoXMLBDL |
| 3 | ImportarArquivoBDL |
| 4 | SetBDLightAtualizado |

---

## 3.5 Ofícios

**WSDL (homologação):** `https://hml3-wsoficio.onr.org.br/oficios.asmx?wsdl`

| # | Método |
|---|--------|
| 1 | ListInstituicoesOE |
| 2 | GetPedidoOE |
| 3 | ListPedidosOE |
| 4 | ListPedidosOE_V2 |
| 5 | SetPedidoRespondidoOE |
| 6 | SetPedidoDevolvidoOE |
| 7 | SetPedidoNegativaLoteOE |
| 8 | SetPedidoRetransmitidoOE |
| 9 | ListCartoriosRestransmitirOE |

---

## 3.6 Certidões a Emitir

**WSDL (homologação):** `https://hml3-wsoficio.onr.org.br/Certidoes.asmx?wsdl`  
**WSDL local:** `wsdl/certidoes.wsdl`

| # | Método |
|---|--------|
| 1 | ObterXMLSolicitacoes_v4 |
| 2 | ObterXMLSolicitacoes_v5 |
| 3 | ObterXMLSolicitacoes_v6 |
| 4 | DevolverCertidao |
| 5 | EnviarAnexoCertidao |
| 6 | EnviarAnexoCertidao_DocID |
| 7 | EnviarAnexosListCertidao_DocID |
| 8 | FinalizarRespostaCertidao |
| 9 | EnviarAnexoCertidao_DocID_V2 |
| 10 | EnviarAnexosListCertidao_DocID_V2 |
| 11 | InformarCustasCertidao |

---

## 3.9 Matrícula Online / Rel. VM

**WSDL (homologação):** `https://hml3-wsoficio.onr.org.br/matriculaonline.asmx?wsdl`

| # | Método |
|---|--------|
| 1 | ObterXMLSolicitacoes |
| 2 | ObterXMLSolicitacoesV2 |

---

## 3.10 E-Protocolo

**WSDL (homologação):** `https://hml3-wsoficio.onr.org.br/eprotocolo.asmx?wsdl`

| # | Método |
|---|--------|
| 1 | GetExtratoXMLAC |
| 2 | ListPedidosAC |
| 3 | ListAnexosAC |
| 4 | ListBoletosAC |
| 5 | SetBaixaBoletoAC |
| 6 | GetPedidoAC_V3 |
| 7 | AlterarPedidoAC |
| 8 | SetPrenotacaoAC |
| 9 | SetCustasAC |
| 10 | SetPrenotacaoExameCalculoAC |
| 11 | SetContratoAverbadoAC |
| 12 | SetContratoExigenciaAC |
| 13 | SetContratoDevolvidoAC |
| 14 | ListDocumentosRepositorioAC |
| 15 | ContratoXMLtoPDF |

---

## 3.11 Intimações

**WSDL (homologação):** `https://hml3-wsoficio.onr.org.br/intimacoes.asmx?wsdl`

| # | Método |
|---|--------|
| 1 | ImportarPrenotacaoIN |
| 2 | ListPedidosIN |
| 3 | ListMensagensPedidoIN |
| 4 | AdicionarMensagemIN |
| 5 | GetDetalhesIN_V2 |
| 6 | GetDetalhesIN_V3 |
| 7 | GetMensagemIN |
| 8 | GetEmolumentosIN |
| 9 | AdicionarEmolumentoIN |
| 10 | ExcluirEmolumentoIN |
| 11 | ListPagamentosIN |
| 12 | ListStatusIN |

---

## 3.12 Comunicação Prefeituras (CTP)

**WSDL (homologação):** `https://hml3-wsoficio.onr.org.br/ComunicacaoMunicipios.asmx?wsdl`  
**WSDL local:** `wsdl/comunicacaoprefeituras.wsdl` (serviço `ComunicacaoMunicipios` na spec)

Integração CTP: importação de arquivos (URL assinada de upload) e consulta de status do processo.

| # | Método |
|---|--------|
| 1 | ImportacaoArquivos |
| 2 | AtualizarStatusProcesso |

---

## Lista consolidada (alfabética)

```
AdicionarEmolumentoIN
AdicionarMensagemIN
AlterarPedidoAC
AtualizarStatusProcesso
ContratoXMLtoPDF
DeleteTituloAT
DevolverCertidao
EnviarAnexoCertidao
EnviarAnexoCertidao_DocID
EnviarAnexoCertidao_DocID_V2
EnviarAnexosListCertidao_DocID
EnviarAnexosListCertidao_DocID_V2
ExcluirEmolumentoIN
FinalizarRespostaCertidao
GetArquivoXMLBDL
GetDetalhesIN_V2
GetDetalhesIN_V3
GetEmolumentosIN
GetExtratoXMLAC
GetMensagemIN
GetPedidoAC_V3
GetPedidoOE
GetPedidoPO
GetStatusAT
GetTituloAT
ImportacaoArquivos
ImportarArquivoBDL
ImportarPrenotacaoIN
InformarCustasCertidao
InsertStatusAT
InsertTituloAT
ListAnexosAC
ListArquivosXMLBDL
ListBoletosAC
ListBoletosPO
ListCartoriosRestransmitirOE
ListDocumentosRepositorioAC
ListInstituicoesOE
ListMensagensPedidoIN
ListPagamentosIN
ListPedidosAC
ListPedidosExportacaoPO
ListPedidosIN
ListPedidosOE
ListPedidosOE_V2
ListPedidosPO
ListStatusAT
ListStatusIN
ListTitulosAT
ListVarasPO
LoginUsuarioCertificado
ObterXMLSolicitacoes
ObterXMLSolicitacoes_v4
ObterXMLSolicitacoes_v5
ObterXMLSolicitacoes_v6
ObterXMLSolicitacoesV2
SetBaixaBoletoAC
SetBaixaBoletoPO
SetBDLightAtualizado
SetContratoAverbadoAC
SetContratoDevolvidoAC
SetContratoExigenciaAC
SetCustasAC
SetCustasPO
SetPedidoDevolvidoOE
SetPedidoFinalizarPrenotacaoVencida
SetPedidoMatriculaDevolvidoPO
SetPedidoMatriculaRespondidoPO
SetPedidoNegativaLoteOE
SetPedidoNegativaLotePO
SetPedidoPessoaDevolvidoPO
SetPedidoPessoaRespondidoPO
SetPedidoRespondidoOE
SetPedidoRetransmitidoOE
SetPenhoraAverbadoPO
SetPenhoraExigenciaPO
SetPrenotacaoAC
SetPrenotacaoExameCalculoAC
SetPrenotacaoPO
UpdateStatusAT
UpdateTituloAT
```

---

## Módulos documentados sem lista “a serem referenciados”

Estes capítulos existem na especificação, mas **não** trazem a seção *Métodos a serem referenciados* (ou estão em desenvolvimento):

| Capítulo | Observação |
|----------|------------|
| 3.7 Consulta CPF/CNPJ | Em desenvolvimento |
| 3.8 Consulta Eletrônica / Rel. CE | Em desenvolvimento |
