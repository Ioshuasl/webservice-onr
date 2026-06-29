#!/usr/bin/env node
const crypto = require("crypto");

const CHAVE = "54414123-9258-469E-A420-66CB70549435";
const ID_INST = "2492";
const TOKEN = process.argv[2] || "CQRWQY";
const NS = "http://wsassinador.arisp.com.br";
const WSA = "http://schemas.datacontract.org/2004/07/WSAssinador";
const EP_PROD = "http://wsassinador.onr.org.br/Assinador.svc";
const EP_HML3 = "http://hml3-wsoficio.onr.org.br/Assinador.svc";

const sha = (a, b) => crypto.createHash("sha1").update(`${a}${b}`, "utf8").digest("hex").toUpperCase();
const wsHash = sha(CHAVE, TOKEN);

async function soap(endpoint, action, body) {
  const xml = `<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="${NS}"><soap:Body>${body}</soap:Body></soap:Envelope>`;
  const r = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "text/xml; charset=utf-8", SOAPAction: action },
    body: xml,
  });
  return r.text();
}

function tag(xml, name) {
  const m = xml.match(new RegExp(`<(?:\\w+:)?${name}[^>]*>([^<]*)`, "i"));
  return m ? m[1] : null;
}

async function main() {
  console.log(`Token=${TOKEN} | wsHash=${wsHash} | IDInstituicao=${ID_INST}\n`);

  for (const [label, ep] of [
    ["PROD", EP_PROD],
    ["HML3", EP_HML3],
  ]) {
    console.log(`=== ${label} ${ep} ===`);
    try {
      const verXml = await soap(ep, `${NS}/IAssinador/ObterVersao`, "<tns:ObterVersao/>");
      console.log(`ObterVersao: ${tag(verXml, "ObterVersaoResult") || tag(verXml, "faultstring") || "?"}`);
    } catch (e) {
      console.log(`ObterVersao ERR: ${e.message}`);
    }

    const listBody = `<tns:ListarSolicitacoes><tns:idInstituicao>${ID_INST}</tns:idInstituicao><tns:protocolo>S20120000001D</tns:protocolo><tns:hash>${wsHash}</tns:hash></tns:ListarSolicitacoes>`;
    const listXml = await soap(ep, `${NS}/IAssinador/ListarSolicitacoes`, listBody);
    console.log(`ListarSolicitacoes: Codigo=${tag(listXml, "Codigo")} Desc=${tag(listXml, "Descricao")}`);

    const padesBody = `<tns:PADES_CadastrarArquivo><tns:oRequest xmlns:wsa="${WSA}"><wsa:HASH_Autenticacao>${wsHash}</wsa:HASH_Autenticacao><wsa:HASH_UDDI>${CHAVE}</wsa:HASH_UDDI><wsa:IDCartorio>${ID_INST}</wsa:IDCartorio><wsa:file></wsa:file></tns:oRequest></tns:PADES_CadastrarArquivo>`;
    const padesXml = await soap(ep, `${NS}/IAssinador/PADES_CadastrarArquivo`, padesBody);
    console.log(`PADES: OK=${tag(padesXml, "OK")} Erro=${tag(padesXml, "Erro")}\n`);
  }

  console.log("--- ListarSolicitacoes hash variants (PROD only) ---");
  for (const [label, hash] of [
    ["SHA1(chave+token)", wsHash],
    ["SHA1(token+chave)", sha(TOKEN, CHAVE)],
    ["token", TOKEN],
    ["CHAVE", CHAVE],
    ["sha lower", wsHash.toLowerCase()],
  ]) {
    const body = `<tns:ListarSolicitacoes><tns:idInstituicao>${ID_INST}</tns:idInstituicao><tns:protocolo>S20120000001D</tns:protocolo><tns:hash>${hash}</tns:hash></tns:ListarSolicitacoes>`;
    const xml = await soap(EP_PROD, `${NS}/IAssinador/ListarSolicitacoes`, body);
    console.log(`${label}: Codigo=${tag(xml, "Codigo")} Desc=${tag(xml, "Descricao")}`);
  }

  console.log("\n--- PADES_CadastrarArquivo ---");
  for (const [label, auth, uddi] of [
    ["AUTH=wsHash UDDI=CHAVE", wsHash, CHAVE],
    ["AUTH=CHAVE UDDI=CHAVE", CHAVE, CHAVE],
    ["AUTH=token UDDI=CHAVE", TOKEN, CHAVE],
    ["AUTH=CHAVE UDDI=token", CHAVE, TOKEN],
    ["AUTH=wsHash UDDI=wsHash", wsHash, wsHash],
    ["AUTH=CHAVE UDDI=2418", CHAVE, "2418"],
  ]) {
    const body = `<tns:PADES_CadastrarArquivo><tns:oRequest xmlns:wsa="${WSA}"><wsa:HASH_Autenticacao>${auth}</wsa:HASH_Autenticacao><wsa:HASH_UDDI>${uddi}</wsa:HASH_UDDI><wsa:IDCartorio>${ID_INST}</wsa:IDCartorio><wsa:file></wsa:file></tns:oRequest></tns:PADES_CadastrarArquivo>`;
    const xml = await soap(EP_PROD, `${NS}/IAssinador/PADES_CadastrarArquivo`, body);
    console.log(`${label}: OK=${tag(xml, "OK")} Erro=${tag(xml, "Erro")}`);
  }

  console.log("\n--- CriptografarDados ---");
  for (const [label, dados, hash] of [
    ["dados=CHAVE hash=wsHash", CHAVE, wsHash],
    ["dados=2418 hash=CHAVE", "2418", CHAVE],
    ["dados=CHAVE hash=TOKEN", CHAVE, TOKEN],
  ]) {
    const body = `<tns:CriptografarDados><tns:dados>${dados}</tns:dados><tns:hash>${hash}</tns:hash></tns:CriptografarDados>`;
    const xml = await soap(EP_PROD, `${NS}/IAssinador/CriptografarDados`, body);
    console.log(`${label}: Dado=${tag(xml, "Dado")?.slice(0, 40) || "(vazio)"} Mensagem=${tag(xml, "Mensagem")} Codigo=${tag(xml, "Codigo")}`);
  }
}

main().catch(console.error);
