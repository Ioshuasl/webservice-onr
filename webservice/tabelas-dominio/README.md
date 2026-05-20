# Tabelas de domínio — WSOficio

Constantes e enums referenciados nos métodos SOAP. **Não duplicar** listas completas em cada `metodos/<Operacao>.md` — linkar daqui.

| Arquivo | Escopo | Uso típico |
|---------|--------|------------|
| [IDTipoPedido-PO.md](IDTipoPedido-PO.md) | Penhora Online (§ 3.3.1) | Filtro `ListPedidosPO`, validação `Set*PO` |
| [IDStatus-PO.md](IDStatus-PO.md) | Penhora Online (§ 3.3.1) | Filtro listagem, elegibilidade de resposta |
| [IDTipoStatus-AT.md](IDTipoStatus-AT.md) | Acompanhamento de Títulos (§ 3.2.1) | `ListTitulosAT`, `InsertStatusAT`, … |
| [ModoNotificacaoStatus-AT.md](ModoNotificacaoStatus-AT.md) | Acompanhamento de Títulos (§ 3.2.12) | `InsertTituloAT`, `UpdateTituloAT` |
| [TipoSolicitacao-AT.md](TipoSolicitacao-AT.md) | Acompanhamento de Títulos (§ 3.2.12) | `InsertTituloAT`, `UpdateTituloAT` |
| [IDStatus-BDL.md](IDStatus-BDL.md) | BD Light (§ 3.4.2) | `ListArquivosXMLBDL`, `GetArquivoXMLBDL` |

Outros domínios (criar sob demanda, citando capítulo da spec):
- Domínios de Ofícios, Certidões, Intimações, etc.

## Como manter

1. Extrair valores de `especificacao_wsoficio_dev.md` (item “Valores possíveis”).
2. Um arquivo por domínio; sufixo `-PO`, `-AT`, `-OE` quando o mesmo nome tiver listas diferentes por módulo.
3. Ao implementar script: referenciar no método em **Pré-requisitos** e em hints de erro (`CODIGOERRO` **53**, etc.).
