#!/usr/bin/env node
/**
 * Testa métodos Assinador ONR sem hash / sem login WSOficio.
 */
const path = require("path");

const NS = "http://wsassinador.arisp.com.br";
const EP = process.env.ASSINADOR_ENDPOINT || "http://wsassinador.onr.org.br/Assinador.svc";
const ID = process.env.ASSINADOR_ID_INSTITUICAO || "2492";

function envelope(body) {
  return `<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="${NS}"><soap:Body>${body}</soap:Body></soap:Envelope>`;
}

async function soap(op, body) {
  const res = await fetch(EP, {
    method: "POST",
    headers: { "Content-Type": "text/xml; charset=utf-8", SOAPAction: `${NS}/IAssinador/${op}` },
    body: envelope(body),
    signal: AbortSignal.timeout(45000),
  });
  return { status: res.status, text: await res.text() };
}

function tag1(xml, name) {
  const m = xml.match(new RegExp(`<(?:[a-zA-Z0-9_]+:)?${name}[^>]*>([^<]*)`, "i"));
  return m ? m[1] : null;
}

function summarize(label, r) {
  const cod = tag1(r.text, "Codigo");
  const desc = tag1(r.text, "Descricao");
  const fault = tag1(r.text, "faultstring");
  const result = tag1(r.text, `${label.split(" ")[0]}Result`) || tag1(r.text, "ObterVersaoResult");
  console.log(`${label}:`);
  console.log(`  HTTP ${r.status} | Codigo=${cod ?? "-"} | Desc=${desc ?? result ?? fault ?? r.text.slice(0, 120).replace(/\s+/g, " ")}`);
}

const tinyPdf =
  "JVBERi0xLjQKMSAwIG9iago8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PgplbmRvYmoKMiAwIG9iago8PC9UeXBlL1BhZ2VzL0tpZHMgMyAwIFJIL0NvdW50IDE+PgplbmRvYmoKMyAwIG9iago8PC9UeXBlL1BhZ2UvTWVkaWFCb3ggWzAgMCA2MTIgNzkyXS9QYXJlbnQgMiAwIFI+PgplbmRvYmoKeHJlZgowIDQKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNTggMDAwMDAgbiAKMDAwMDAwMDExNSAwMDAwMCBuIAp0cmFpbGVyCjw8L1NpemUgNC9Sb290IDEgMCBSCj4+CnN0YXJ0eHJlZgoyMDUKJSVFT0YK";

async function main() {
  console.log("=== Assinador ONR — testes SEM hash ===\n");
  console.log(`Endpoint: ${EP}\n`);

  console.log("--- Métodos que não usam hash (documentação) ---");
  summarize("ObterVersao", await soap("ObterVersao", "<tns:ObterVersao/>"));

  summarize(
    "ValidarArquivoOficial",
    await soap(
      "ValidarArquivoOficial",
      `<tns:ValidarArquivoOficial><tns:file>${tinyPdf}</tns:file><tns:strProtocolo>S20120000001D</tns:strProtocolo></tns:ValidarArquivoOficial>`
    )
  );

  console.log("\n--- Listar* sem campo hash ---");
  summarize(
    "ListarSolicitacoes",
    await soap(
      "ListarSolicitacoes",
      `<tns:ListarSolicitacoes><tns:idInstituicao>${ID}</tns:idInstituicao><tns:protocolo></tns:protocolo></tns:ListarSolicitacoes>`
    )
  );

  summarize(
    "ListarPedidosClientes",
    await soap(
      "ListarPedidosClientes",
      `<tns:ListarPedidosClientes><tns:IdInstituicao>${ID}</tns:IdInstituicao><tns:dtPedidoInicial>2025-01-01T00:00:00</tns:dtPedidoInicial><tns:dtPedidoFinal>2026-06-15T23:59:59</tns:dtPedidoFinal></tns:ListarPedidosClientes>`
    )
  );

  console.log("\n--- Listar* com hash vazio ---");
  summarize(
    "ListarSolicitacoes",
    await soap(
      "ListarSolicitacoes",
      `<tns:ListarSolicitacoes><tns:idInstituicao>${ID}</tns:idInstituicao><tns:protocolo></tns:protocolo><tns:hash></tns:hash></tns:ListarSolicitacoes>`
    )
  );

  summarize(
    "TipoArquivoAssinado",
    await soap("TipoArquivoAssinado", `<tns:TipoArquivoAssinado><tns:protocolo>S20120000001D</tns:protocolo></tns:TipoArquivoAssinado>`)
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
