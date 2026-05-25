# Métodos WSOficio

Um arquivo `.md` por operação listada em [`../list-metodos.md`](../list-metodos.md).

**Autenticação:** todas as operações (exceto login) exigem o parâmetro `Hash`, calculado conforme [`../hash.md`](../hash.md).

Para regenerar a partir da especificação:

```bash
py webservice/generate_metodos.py
```

## Índice

### 3.1 Login
- [LoginUsuarioCertificado](LoginUsuarioCertificado.md)

### 3.2 Acompanhamento de Títulos
- [ListTitulosAT](ListTitulosAT.md) · [ListStatusAT](ListStatusAT.md) · [GetTituloAT](GetTituloAT.md) · [GetStatusAT](GetStatusAT.md)
- [InsertTituloAT](InsertTituloAT.md) · [UpdateTituloAT](UpdateTituloAT.md) · [DeleteTituloAT](DeleteTituloAT.md)
- [InsertStatusAT](InsertStatusAT.md) · [UpdateStatusAT](UpdateStatusAT.md)

### 3.3 Penhora Online
- [ListPedidosPO](ListPedidosPO.md) · [ListVarasPO](ListVarasPO.md) · [GetPedidoPO](GetPedidoPO.md) · [ListBoletosPO](ListBoletosPO.md)
- [SetBaixaBoletoPO](SetBaixaBoletoPO.md) · [SetPrenotacaoPO](SetPrenotacaoPO.md) · [SetCustasPO](SetCustasPO.md)
- [SetPenhoraAverbadoPO](SetPenhoraAverbadoPO.md) · [SetPenhoraExigenciaPO](SetPenhoraExigenciaPO.md)
- [SetPedidoPessoaRespondidoPO](SetPedidoPessoaRespondidoPO.md) · [SetPedidoPessoaDevolvidoPO](SetPedidoPessoaDevolvidoPO.md)
- [SetPedidoMatriculaRespondidoPO](SetPedidoMatriculaRespondidoPO.md) · [SetPedidoMatriculaDevolvidoPO](SetPedidoMatriculaDevolvidoPO.md)
- [SetPedidoNegativaLotePO](SetPedidoNegativaLotePO.md) · [ListPedidosExportacaoPO](ListPedidosExportacaoPO.md)
- [SetPedidoFinalizarPrenotacaoVencida](SetPedidoFinalizarPrenotacaoVencida.md)

### 3.4 BD Light
- [ListArquivosXMLBDL](ListArquivosXMLBDL.md) · [GetArquivoXMLBDL](GetArquivoXMLBDL.md) · [ImportarArquivoBDL](ImportarArquivoBDL.md) · [SetBDLightAtualizado](SetBDLightAtualizado.md)

### 3.5 Ofícios
- [ListInstituicoesOE](ListInstituicoesOE.md) · [GetPedidoOE](GetPedidoOE.md) · [ListPedidosOE](ListPedidosOE.md) · [ListPedidosOE_V2](ListPedidosOE_V2.md)
- [SetPedidoRespondidoOE](SetPedidoRespondidoOE.md) · [SetPedidoDevolvidoOE](SetPedidoDevolvidoOE.md) · [SetPedidoNegativaLoteOE](SetPedidoNegativaLoteOE.md)
- [SetPedidoRetransmitidoOE](SetPedidoRetransmitidoOE.md) · [ListCartoriosRestransmitirOE](ListCartoriosRestransmitirOE.md)

### 3.6 Certidões a Emitir
- [ObterXMLSolicitacoes_v4](ObterXMLSolicitacoes_v4.md) · [ObterXMLSolicitacoes_v5](ObterXMLSolicitacoes_v5.md) · [ObterXMLSolicitacoes_v6](ObterXMLSolicitacoes_v6.md)
- [DevolverCertidao](DevolverCertidao.md) · [EnviarAnexoCertidao](EnviarAnexoCertidao.md) · [EnviarAnexoCertidao_DocID](EnviarAnexoCertidao_DocID.md)
- [EnviarAnexosListCertidao_DocID](EnviarAnexosListCertidao_DocID.md) · [FinalizarRespostaCertidao](FinalizarRespostaCertidao.md)
- [EnviarAnexoCertidao_DocID_V2](EnviarAnexoCertidao_DocID_V2.md) · [EnviarAnexosListCertidao_DocID_V2](EnviarAnexosListCertidao_DocID_V2.md) · [InformarCustasCertidao](InformarCustasCertidao.md)

### 3.12 Comunicação Prefeituras (CTP)
- [ImportacaoArquivos](ImportacaoArquivos.md) · [AtualizarStatusProcesso](AtualizarStatusProcesso.md)

### 3.9 Matrícula Online
- [ObterXMLSolicitacoes](ObterXMLSolicitacoes.md) · [ObterXMLSolicitacoesV2](ObterXMLSolicitacoesV2.md)

### 3.10 E-Protocolo
- [GetExtratoXMLAC](GetExtratoXMLAC.md) · [ListPedidosAC](ListPedidosAC.md) · [ListAnexosAC](ListAnexosAC.md) · [ListBoletosAC](ListBoletosAC.md)
- [SetBaixaBoletoAC](SetBaixaBoletoAC.md) · [GetPedidoAC_V3](GetPedidoAC_V3.md) · [AlterarPedidoAC](AlterarPedidoAC.md)
- [SetPrenotacaoAC](SetPrenotacaoAC.md) · [SetCustasAC](SetCustasAC.md) · [SetPrenotacaoExameCalculoAC](SetPrenotacaoExameCalculoAC.md)
- [SetContratoAverbadoAC](SetContratoAverbadoAC.md) · [SetContratoExigenciaAC](SetContratoExigenciaAC.md) · [SetContratoDevolvidoAC](SetContratoDevolvidoAC.md)
- [ListDocumentosRepositorioAC](ListDocumentosRepositorioAC.md) · [ContratoXMLtoPDF](ContratoXMLtoPDF.md)

### 3.11 Intimações
- [ImportarPrenotacaoIN](ImportarPrenotacaoIN.md) · [ListPedidosIN](ListPedidosIN.md) · [ListMensagensPedidoIN](ListMensagensPedidoIN.md)
- [AdicionarMensagemIN](AdicionarMensagemIN.md) · [GetDetalhesIN_V2](GetDetalhesIN_V2.md) · [GetDetalhesIN_V3](GetDetalhesIN_V3.md)
- [GetMensagemIN](GetMensagemIN.md) · [GetEmolumentosIN](GetEmolumentosIN.md) · [AdicionarEmolumentoIN](AdicionarEmolumentoIN.md)
- [ExcluirEmolumentoIN](ExcluirEmolumentoIN.md) · [ListPagamentosIN](ListPagamentosIN.md) · [ListStatusIN](ListStatusIN.md)
