#!/usr/bin/env node
/**
 * Teste de autenticação Assinador ONR (wsassinador) — prod e HML.
 * Uso: node scripts/test-assinador-auth.cjs
 */
const crypto = require("crypto");

const NS = "http://wsassinador.arisp.com.br";
const WSA = "http://schemas.datacontract.org/2004/07/WSAssinador";
const ID_PARCEIRO = process.env.ASSINADOR_ID_PARCEIRO || process.env.ONR_SERVENTIA_ID || "";
const CHAVE = process.env.ASSINADOR_CHAVE || process.env.ONR_SERVENTIA_CHAVE || "";
/** Opcional: token + idInstituicao já obtidos via login WSOficio HML. */
const LOGIN = {
  idInstituicao: Number(process.env.ASSINADOR_ID_INSTITUICAO || 0),
  token: process.env.ASSINADOR_LOGIN_TOKEN || "",
};

const ENDPOINTS = [
  { label: "PROD", url: "http://wsassinador.onr.org.br/Assinador.svc" },
  { label: "PROD-HTTPS", url: "https://wsassinador.onr.org.br/Assinador.svc" },
  { label: "HML", url: "http://wsassinador.hml.onr.org.br/Assinador.svc" },
  { label: "HML-HTTPS", url: "https://wsassinador.hml.onr.org.br/Assinador.svc" },
  { label: "HML-alt", url: "http://hml.wsassinador.onr.org.br/Assinador.svc" },
];

function sha1Upper(a, b) {
  return crypto.createHash("sha1").update(`${a}${b}`, "utf8").digest("hex").toUpperCase();
}

function envelope(body) {
  return `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="${NS}">
  <soap:Body>${body}</soap:Body>
</soap:Envelope>`;
}

async function soapCall(endpoint, action, bodyXml) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
      SOAPAction: action,
    },
    body: envelope(bodyXml),
    signal: AbortSignal.timeout(30000),
  });
  const text = await res.text();
  return { status: res.status, text: text.slice(0, 4000) };
}

function extractTag(xml, tag) {
  const re = new RegExp(`<(?:[a-zA-Z0-9_]+:)?${tag}[^>]*>([^<]*)</`, "i");
  const m = xml.match(re);
  return m ? m[1] : null;
}

function extractAll(xml, tag) {
  const re = new RegExp(`<(?:[a-zA-Z0-9_]+:)?${tag}[^>]*>([^<]*)</`, "gi");
  const out = [];
  let m;
  while ((m = re.exec(xml))) out.push(m[1]);
  return out;
}

async function testObterVersao(ep) {
  const body = "<tns:ObterVersao/>";
  const action = `${NS}/IAssinador/ObterVersao`;
  try {
    const { status, text } = await soapCall(ep.url, action, body);
    const versao = extractTag(text, "ObterVersaoResult");
    const fault = extractTag(text, "faultstring") || extractTag(text, "Text");
    return { ok: status === 200 && versao, status, versao, fault, snippet: text.slice(0, 500) };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

async function testCriptografarChaveCartorio(ep, dados, hash) {
  const body = `<tns:CriptografarChaveCartorio>
      <tns:dados>${dados}</tns:dados>
      <tns:hash>${hash}</tns:hash>
    </tns:CriptografarChaveCartorio>`;
  const action = `${NS}/IAssinador/CriptografarChaveCartorio`;
  try {
    const { status, text } = await soapCall(ep.url, action, body);
    const dado = extractTag(text, "Dado");
    const msg = extractTag(text, "Mensagem");
    const codigo = extractTag(text, "Codigo");
    const fault = extractTag(text, "faultstring");
    return { ok: status === 200 && !fault, status, dado, msg, codigo, fault, snippet: text.slice(0, 800) };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

async function testObterTokensOficial(ep, hashAuth, hashUddi) {
  const body = `<tns:ObterTokensOficial>
      <tns:file></tns:file>
      <tns:HASH_Autenticacao>${hashAuth}</tns:HASH_Autenticacao>
    </tns:ObterTokensOficial>`;
  const action = `${NS}/IAssinador/ObterTokensOficial`;
  try {
    const { status, text } = await soapCall(ep.url, action, body);
    const fault = extractTag(text, "faultstring");
    const tokens = extractAll(text, "string");
    return { ok: status === 200 && !fault, status, tokens, fault, snippet: text.slice(0, 800) };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

async function testPadesCadastrar(ep, idCartorio, hashAuth, hashUddi) {
  const body = `<tns:PADES_CadastrarArquivo>
      <tns:oRequest xmlns:wsa="${WSA}">
        <wsa:HASH_Autenticacao>${hashAuth}</wsa:HASH_Autenticacao>
        <wsa:HASH_UDDI>${hashUddi}</wsa:HASH_UDDI>
        <wsa:IDCartorio>${idCartorio}</wsa:IDCartorio>
        <wsa:file></wsa:file>
      </tns:oRequest>
    </tns:PADES_CadastrarArquivo>`;
  const action = `${NS}/IAssinador/PADES_CadastrarArquivo`;
  try {
    const { status, text } = await soapCall(ep.url, action, body);
    const ok = extractTag(text, "OK");
    const erro = extractTag(text, "Erro");
    const id = extractTag(text, "ID");
    const fault = extractTag(text, "faultstring");
    return { ok: status === 200 && !fault, status, soapOk: ok, erro, id, fault, snippet: text.slice(0, 800) };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

async function testListarSolicitacoes(ep, idInstituicao, hash) {
  const body = `<tns:ListarSolicitacoes>
      <tns:idInstituicao>${idInstituicao}</tns:idInstituicao>
      <tns:protocolo>S20120000001D</tns:protocolo>
      <tns:hash>${hash}</tns:hash>
    </tns:ListarSolicitacoes>`;
  const action = `${NS}/IAssinador/ListarSolicitacoes`;
  try {
    const { status, text } = await soapCall(ep.url, action, body);
    const codigo = extractTag(text, "Codigo");
    const desc = extractTag(text, "Descricao");
    const fault = extractTag(text, "faultstring");
    return { ok: status === 200 && !fault, status, codigo, desc, fault, snippet: text.slice(0, 800) };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

async function main() {
  console.log("=== Assinador ONR — teste de autenticação ===\n");
  console.log(`ID Parceiro: ${ID_PARCEIRO}`);
  console.log(`Chave: ${CHAVE.slice(0, 8)}…\n`);

  // 1) Conectividade
  console.log("--- 1. ObterVersao (conectividade) ---");
  const live = [];
  for (const ep of ENDPOINTS) {
    const r = await testObterVersao(ep);
    console.log(`[${ep.label}] ${ep.url}`);
    if (r.error) console.log(`  ERRO: ${r.error}`);
    else if (r.versao) console.log(`  OK HTTP ${r.status} — versão: ${r.versao}`);
    else console.log(`  HTTP ${r.status} — fault: ${r.fault || "(sem versão)"}`);
    if (r.versao) live.push(ep);
  }

  if (live.length === 0) {
    console.log("\nNenhum endpoint respondeu ObterVersao. Abortando testes de auth.");
    process.exit(1);
  }

  const ep = live[0];
  console.log(`\nUsando endpoint ${ep.label} para testes de auth.\n`);

  // 2) CriptografarChaveCartorio — hipóteses de mapeamento credencial → HASH_*
  console.log("--- 2. CriptografarChaveCartorio ---");
  const cryptoTests = [
    { label: "dados=CHAVE hash=ID_PARCEIRO", dados: CHAVE, hash: ID_PARCEIRO },
    { label: "dados=ID_PARCEIRO hash=CHAVE", dados: ID_PARCEIRO, hash: CHAVE },
    { label: "dados=CHAVE hash=SHA1(CHAVE+ID)", dados: CHAVE, hash: sha1Upper(CHAVE, ID_PARCEIRO) },
    { label: "dados=ID hash=SHA1(ID+CHAVE)", dados: ID_PARCEIRO, hash: sha1Upper(ID_PARCEIRO, CHAVE) },
    { label: "dados=CHAVE hash=CHAVE", dados: CHAVE, hash: CHAVE },
  ];
  for (const t of cryptoTests) {
    const r = await testCriptografarChaveCartorio(ep, t.dados, t.hash);
    console.log(`\n  ${t.label}:`);
    if (r.error) console.log(`    ERRO: ${r.error}`);
    else console.log(`    HTTP ${r.status} | Codigo=${r.codigo} | Mensagem=${r.msg} | Dado=${r.dado ? r.dado.slice(0, 60) + "…" : "(vazio)"} | fault=${r.fault || "-"}`);
  }

  // 3) ObterTokensOficial — testar mapeamentos diretos
  console.log("\n--- 3. ObterTokensOficial (HASH_Autenticacao) ---");
  const authTests = [
    { label: "HASH_AUTH=CHAVE (UDDI implícito)", auth: CHAVE },
    { label: "HASH_AUTH=ID_PARCEIRO", auth: ID_PARCEIRO },
    { label: "HASH_AUTH=SHA1(CHAVE+ID)", auth: sha1Upper(CHAVE, ID_PARCEIRO) },
    { label: "HASH_AUTH=SHA1(ID+CHAVE)", auth: sha1Upper(ID_PARCEIRO, CHAVE) },
  ];
  for (const t of authTests) {
    const r = await testObterTokensOficial(ep, t.auth, CHAVE);
    console.log(`\n  ${t.label}:`);
    if (r.error) console.log(`    ERRO: ${r.error}`);
    else console.log(`    HTTP ${r.status} | tokens=${r.tokens.length ? r.tokens.join(", ") : "(nenhum)"} | fault=${r.fault || "-"}`);
  }

  if (!CHAVE || !ID_PARCEIRO) {
    console.error("Defina ASSINADOR_CHAVE + ASSINADOR_ID_PARCEIRO (ou ONR_SERVENTIA_*).");
    process.exit(1);
  }

  // 4) ListarSolicitacoes — hash de sessão (modelo WSOficio: SHA1(chave+token))
  if (!LOGIN.token || !LOGIN.idInstituicao) {
    console.log("\n--- 4. ListarSolicitacoes ---");
    console.log("  Pulado: defina ASSINADOR_LOGIN_TOKEN + ASSINADOR_ID_INSTITUICAO (via login WSOficio).");
  } else {
  const wsHash = sha1Upper(CHAVE, LOGIN.token);
  console.log("\n--- 4. ListarSolicitacoes (hash WSOficio SHA1(chave+token)) ---");
  console.log(`  token=${LOGIN.token} | idInstituicao=${LOGIN.idInstituicao} | hash=${wsHash}`);
  const listTests = [
    { label: "id=login hash=SHA1(CHAVE+token)", id: String(LOGIN.idInstituicao), hash: wsHash },
    { label: "id=parceiro hash=SHA1(CHAVE+token)", id: ID_PARCEIRO, hash: wsHash },
  ];
  for (const t of listTests) {
    const r = await testListarSolicitacoes(ep, t.id, t.hash);
    console.log(`\n  ${t.label}:`);
    if (r.error) console.log(`    ERRO: ${r.error}`);
    else console.log(`    HTTP ${r.status} | Codigo=${r.codigo} | Descricao=${r.desc} | fault=${r.fault || "-"}`);
  }

  // 5) PADES_CadastrarArquivo — HASH_Autenticacao + HASH_UDDI
  console.log("\n--- 5. PADES_CadastrarArquivo (HASH_Autenticacao + HASH_UDDI) ---");
  const padesTests = [
    { label: "AUTH=SHA1(chave+token) UDDI=CHAVE", auth: wsHash, uddi: CHAVE },
    { label: "AUTH=CHAVE UDDI=ID_PARCEIRO", auth: CHAVE, uddi: ID_PARCEIRO },
    { label: "AUTH=CHAVE UDDI=CHAVE", auth: CHAVE, uddi: CHAVE },
    { label: "AUTH=token UDDI=CHAVE", auth: LOGIN.token, uddi: CHAVE },
    { label: "AUTH=SHA1(chave+token) UDDI=SHA1(ID+CHAVE)", auth: wsHash, uddi: sha1Upper(ID_PARCEIRO, CHAVE) },
  ];
  for (const t of padesTests) {
    const r = await testPadesCadastrar(ep, LOGIN.idInstituicao, t.auth, t.uddi);
    console.log(`\n  ${t.label}:`);
    if (r.error) console.log(`    ERRO: ${r.error}`);
    else console.log(`    HTTP ${r.status} | OK=${r.soapOk} | Erro=${r.erro} | ID=${r.id} | fault=${r.fault || "-"}`);
  }
  }

}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
