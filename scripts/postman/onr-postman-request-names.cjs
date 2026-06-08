/**
 * Nomes de exibição dos requests Postman ONR (sem prefixo AUTONR).
 */
const REQUEST_SUFFIX = {
  "List Titulos AT": "Listar",
  "List Status AT": "Listar",
  "Get Titulo AT": "Consultar",
  "Get Status AT": "Consultar",
  "Insert Titulo AT": "Cadastrar",
  "Update Titulo AT": "Atualizar",
  "Delete Titulo AT": "Excluir",
  "Insert Status AT": "Cadastrar status",
  "Update Status AT": "Atualizar status",
  "List Pedidos PO": "Listar",
  "Get Pedido PO": "Consultar",
  "List Varas PO": "Listar varas",
  "List Boletos PO": "Listar boletos",
  "List Pedidos Exportacao PO": "Listar exportação",
  "List Pedidos Exportacao PO V2": "Listar exportação (v2)",
  "Set Prenotacao PO": "Prenotar",
  "Set Baixa Boleto PO": "Baixar",
  "Set Custas PO": "Informar",
  "Set Penhora Averbado PO": "Averbar penhora",
  "Set Penhora Exigencia PO": "Registrar exigência",
  "Set Pedido Pessoa Respondido PO": "Responder",
  "Set Pedido Pessoa Devolvido PO": "Devolver (pessoa)",
  "Set Pedido Matricula Respondido PO": "Responder (matrícula)",
  "Set Pedido Matricula Devolvido PO": "Devolver (matrícula)",
  "Set Pedido Negativa Lote PO": "Negativar",
  "Set Pedido Finalizar Prenotacao Vencida": "Finalizar prenotação vencida",
  "List Pedidos OE": "Listar",
  "List Pedidos OE V2": "Listar (v2)",
  "Get Pedido OE": "Consultar",
  "List Instituicoes OE": "Listar instituições",
  "Set Pedido Respondido OE": "Responder",
  "Set Pedido Devolvido OE": "Devolver",
  "Set Pedido Retransmitido OE": "Retransmitir",
  "Set Pedido Negativa Lote OE": "Negativar",
  "List Cartorios Restransmitir OE": "Listar cartórios",
  "Importacao Arquivos CTP": "Solicitar URL upload",
  "Atualizar Status Processo CTP": "Consultar status",
};

function requestDisplayName(workflowName) {
  const suffix = REQUEST_SUFFIX[workflowName];
  return suffix ? `${workflowName} — ${suffix}` : workflowName;
}

module.exports = {
  REQUEST_SUFFIX,
  requestDisplayName,
};
