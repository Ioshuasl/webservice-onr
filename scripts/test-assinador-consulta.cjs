#!/usr/bin/env node
/**
 * Teste de consulta Assinador ONR — login WSOficio HML + métodos Listar* / ObterVersao.
 * Uso: node scripts/test-assinador-consulta.cjs
 */
const crypto = require("crypto");
const { spawnSync } = require("child_process");
const path = require("path");

const REPO = path.resolve(__dirname, "..");
const NS = "http://wsassinador.arisp.com.br";
const EP = process.env.ASSINADOR_ENDPOINT || "http://wsassinador.onr.org.br/Assinador.svc";

const CHAVE =
  process.env.ASSINADOR_CHAVE_INTEGRACAO ||
  process.env.ONR_SERVENTIA_CHAVE ||
  "54414123-9258-469E-A420-66CB70549435";
const ID_PARCEIRO = process.env.ASSINADOR_ID_PARCEIRO_WS || "2418";
const LOGIN_EP =
  process.env.ASSINADOR_LOGIN_ENDPOINT ||
  "https://hml3-wsoficio.onr.org.br/login.asmx";

function sha1(chave, token) {
  return crypto.createHash("sha1").update(`${chave}${token}`, "utf8").digest("hex").toUpperCase();
}

function envelope(body) {
  return `<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="${NS}"><soap:Body>${body}</soap:Body></soap:Envelope>`;
}

async function soap(op, body) {
  const action = `${NS}/IAssinador/${op}`;
  const res = await fetch(EP, {
    method: "POST",
    headers: { "Content-Type": "text/xml; charset=utf-8", SOAPAction: action },
    body: envelope(body),
    signal: AbortSignal.timeout(45000),
  });
  const text = await res.text();
  return { status: res.status, text };
}

function tags(xml, name) {
  const re = new RegExp(`<(?:[a-zA-Z0-9_]+:)?${name}[^>]*>([^<]*)`, "gi");
  const out = [];
  let m;
  while ((m = re.exec(xml))) out.push(m[1]);
  return out;
}

function tag1(xml, name) {
  const t = tags(xml, name);
  return t.length ? t[0] : null;
}

function loginHml() {
  const py = spawnSync(
    process.platform === "win32" ? "py" : "python3",
    [
      "-c",
      `
import json, sys
sys.path.insert(0, ${JSON.stringify(REPO.replace(/\\/g, "/"))})
from dotenv import load_dotenv
load_dotenv(${JSON.stringify(path.join(REPO, ".env").replace(/\\/g, "/"))})
import os
os.environ["ONR_SERVENTIA_ID"] = ${JSON.stringify(ID_PARCEIRO)}
os.environ["ONR_SERVENTIA_CHAVE"] = ${JSON.stringify(CHAVE)}
os.environ["ONR_LOGIN_ENDPOINT"] = ${JSON.stringify(LOGIN_EP)}
from scripts.login.login_onr import load_config, build_login_request, login
from lib.cert_extract import extract_from_pfx
cfg = load_config()
cfg["id_parceiro_ws"] = int(${JSON.stringify(ID_PARCEIRO)})
cert = extract_from_pfx(cfg["cert_path"], cfg["cert_password"])
req = build_login_request(cert, cfg)
res = login(cfg, req)
token = res["Tokens"][0] if isinstance(res["Tokens"], list) else res["Tokens"].string[0]
print(json.dumps({"ok": res["RETORNO"], "idInst": res["IDInstituicao"], "token": token, "erro": res.get("ERRODESCRICAO")}))
`,
    ],
    { encoding: "utf8", cwd: REPO }
  );
  if (py.status !== 0) {
    console.error(py.stderr || py.stdout);
    throw new Error("Login falhou");
  }
  return JSON.parse(py.stdout.trim());
}

async function main() {
  console.log("=== Assinador ONR — teste de consulta ===\n");
  console.log(`Endpoint: ${EP}`);
  console.log(`Login HML: ${LOGIN_EP}`);
  console.log(`ID Parceiro: ${ID_PARCEIRO}\n`);

  // 1) ObterVersao (sem auth)
  console.log("--- 1. ObterVersao (sem autenticação) ---");
  const ver = await soap("ObterVersao", "<tns:ObterVersao/>");
  const versao = tag1(ver.text, "ObterVersaoResult");
  console.log(`HTTP ${ver.status} | versão: ${versao || tag1(ver.text, "faultstring") || "?"}`);
  if (!versao) {
    console.error("Serviço indisponível. Abortando.");
    process.exit(1);
  }

  // 2) Login
  console.log("\n--- 2. LoginUsuarioCertificado (WSOficio HML) ---");
  let login;
  try {
    login = loginHml();
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
  if (!login.ok) {
    console.error("Login rejeitado:", login.erro);
    process.exit(1);
  }
  const hash = sha1(CHAVE, login.token);
  console.log(`OK | IDInstituicao=${login.idInst} | token=${login.token}`);
  console.log(`hash = SHA1(chave+token) = ${hash}\n`);

  const id = String(login.idInst);
  const now = new Date();
  const ate = now.toISOString().slice(0, 19);
  const de = new Date(now.getTime() - 90 * 86400000).toISOString().slice(0, 19);

  const consultas = [
    {
      label: "ListarPedidosClientes (últimos 90 dias)",
      op: "ListarPedidosClientes",
      body: `<tns:ListarPedidosClientes><tns:IdInstituicao>${id}</tns:IdInstituicao><tns:dtPedidoInicial>${de}</tns:dtPedidoInicial><tns:dtPedidoFinal>${ate}</tns:dtPedidoFinal><tns:hash>${hash}</tns:hash></tns:ListarPedidosClientes>`,
    },
    {
      label: "ListarSolicitacoes (sem protocolo — lista geral)",
      op: "ListarSolicitacoes",
      body: `<tns:ListarSolicitacoes><tns:idInstituicao>${id}</tns:idInstituicao><tns:protocolo></tns:protocolo><tns:hash>${hash}</tns:hash></tns:ListarSolicitacoes>`,
    },
    {
      label: "ListarSolicitacoesOficio (sem protocolo)",
      op: "ListarSolicitacoesOficio",
      body: `<tns:ListarSolicitacoesOficio><tns:idInstituicao>${id}</tns:idInstituicao><tns:protocolo></tns:protocolo><tns:hash>${hash}</tns:hash></tns:ListarSolicitacoesOficio>`,
    },
  ];

  console.log("--- 3. Consultas autenticadas ---");
  let algumOk = false;
  for (const c of consultas) {
    const r = await soap(c.op, c.body);
    const cod = tag1(r.text, "Codigo");
    const desc = tag1(r.text, "Descricao");
    const fault = tag1(r.text, "faultstring");
    const pedidos = tags(r.text, "Numero").length || tags(r.text, "Protocolo").length;
    const ok = cod === "0" || (cod === null && !fault && r.status === 200 && !desc?.includes("inválido"));
    if (cod === "0") algumOk = true;
    console.log(`\n${c.label}:`);
    console.log(`  HTTP ${r.status} | Codigo=${cod ?? "(null)"} | Desc=${desc ?? "(null)"} | fault=${fault ?? "-"}`);
    if (pedidos) console.log(`  Registros (Protocolo/Numero): ~${pedidos}`);
    if (cod === "0" && r.text.length < 3000) {
      console.log("  Amostra:", r.text.replace(/\s+/g, " ").slice(0, 400));
    }
  }

  // 4) Se hash inválido, tentar com ONR_SERVENTIA_CHAVE do .env (outra serventia)
  if (!algumOk) {
    console.log("\n--- 4. Diagnóstico: hash rejeitado (código 45?) ---");
    console.log(
      "O Assinador SOAP (prod) não aceitou o token/hash do login HML.",
      "\nPossíveis causas:",
      "\n  • Credenciais HML (parceiro 2418) não habilitadas no wsassinador prod",
      "\n  • HASH_Autenticacao/HASH_UDDI distintos do hash WSOficio",
      "\n  • IP não cadastrado no serviço Assinador",
      "\n  • Ambiente HML só via UI (assinador-web.hml.onr.org.br)"
    );
    console.log("\nObterVersao OK confirma que o **serviço SOAP responde**.");
    console.log("Login WSOficio HML OK confirma **credenciais parceiro/chave** no ecossistema ONR.");
  } else {
    console.log("\n✓ Pelo menos uma consulta retornou Codigo=0 — Assinador operacional com estas credenciais.");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
