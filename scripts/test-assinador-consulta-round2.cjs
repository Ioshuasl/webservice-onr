#!/usr/bin/env node
/** Variantes de consulta Assinador — diagnóstico hash / idInstituicao */
const crypto = require("crypto");
const { spawnSync } = require("child_process");
const path = require("path");

const REPO = path.resolve(__dirname, "..");
const NS = "http://wsassinador.arisp.com.br";
const EP = process.env.ASSINADOR_ENDPOINT || "http://wsassinador.onr.org.br/Assinador.svc";

function sha1(chave, token) {
  return crypto.createHash("sha1").update(`${chave}${token}`, "utf8").digest("hex").toUpperCase();
}

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

function pyLogin(overrides = {}) {
  const id = overrides.id ?? "2418";
  const chave = overrides.chave ?? "54414123-9258-469E-A420-66CB70549435";
  const loginEp = overrides.loginEp ?? "https://hml3-wsoficio.onr.org.br/login.asmx";
  const useEnv = overrides.useEnv ?? false;
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
${useEnv ? "" : `os.environ["ONR_SERVENTIA_ID"] = ${JSON.stringify(id)}
os.environ["ONR_SERVENTIA_CHAVE"] = ${JSON.stringify(chave)}`}
os.environ["ONR_LOGIN_ENDPOINT"] = ${JSON.stringify(loginEp)}
from scripts.login.login_onr import load_config, build_login_request, login
from lib.cert_extract import extract_from_pfx
from lib.onr_hash import compute_onr_auth_hash
cfg = load_config()
${useEnv ? "" : `cfg["id_parceiro_ws"] = int(${JSON.stringify(id)})`}
cert = extract_from_pfx(cfg["cert_path"], cfg["cert_password"])
res = login(cfg, build_login_request(cert, cfg))
if not res["RETORNO"]:
  print(json.dumps({"ok": False, "erro": res.get("ERRODESCRICAO"), "cod": res.get("CODIGOERRO")}))
else:
  token = res["Tokens"][0] if isinstance(res["Tokens"], list) else res["Tokens"].string[0]
  ch = cfg["serventia_chave"]
  print(json.dumps({"ok": True, "idInst": res["IDInstituicao"], "token": token, "chave": ch, "hash": compute_onr_auth_hash(ch, token)}))
`,
    ],
    { encoding: "utf8", cwd: REPO }
  );
  if (py.status !== 0) throw new Error(py.stderr || py.stdout);
  return JSON.parse(py.stdout.trim());
}

async function tryList(label, idInst, hash) {
  const r = await soap(
    "ListarSolicitacoes",
    `<tns:ListarSolicitacoes><tns:idInstituicao>${idInst}</tns:idInstituicao><tns:protocolo></tns:protocolo><tns:hash>${hash}</tns:hash></tns:ListarSolicitacoes>`
  );
  console.log(`${label}: HTTP ${r.status} | Codigo=${tag1(r.text, "Codigo")} | ${tag1(r.text, "Descricao") ?? tag1(r.text, "faultstring") ?? "?"}`);
}

async function main() {
  console.log("=== Assinador — round 2 (variantes) ===\n");

  const login2418 = pyLogin();
  console.log("Login HML parceiro 2418:", login2418.ok ? `idInst=${login2418.idInst} token=${login2418.token}` : login2418.erro);

  const loginProd = pyLogin({ loginEp: "https://wsoficio.onr.org.br/login.asmx" });
  console.log("Login PROD parceiro 2418:", loginProd.ok ? `idInst=${loginProd.idInst}` : `FALHOU cod=${loginProd.cod} ${loginProd.erro}`);

  const loginEnv = pyLogin({ useEnv: true });
  console.log("Login HML .env serventia:", loginEnv.ok ? `idInst=${loginEnv.idInst} chave=${loginEnv.chave.slice(0, 8)}…` : loginEnv.erro);

  console.log("\n--- ValidarArquivoOficial (sem hash) ---");
  const tinyPdf = "JVBERi0xLjQKMSAwIG9iago8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PgplbmRvYmoKMiAwIG9iago8PC9UeXBlL1BhZ2VzL0tpZHMgMyAwIFJIL0NvdW50IDE+PgplbmRvYmoKMyAwIG9iago8PC9UeXBlL1BhZ2UvTWVkaWFCb3ggWzAgMCA2MTIgNzkyXS9QYXJlbnQgMiAwIFI+PgplbmRvYmoKeHJlZgowIDQKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNTggMDAwMDAgbiAKMDAwMDAwMDExNSAwMDAwMCBuIAp0cmFpbGVyCjw8L1NpemUgNC9Sb290IDEgMCBSCj4+CnN0YXJ0eHJlZgoyMDUKJSVFT0YK";
  const val = await soap("ValidarArquivoOficial", `<tns:ValidarArquivoOficial><tns:file>${tinyPdf}</tns:file></tns:ValidarArquivoOficial>`);
  console.log(`HTTP ${val.status} | Codigo=${tag1(val.text, "Codigo")} | ${tag1(val.text, "Descricao") ?? tag1(val.text, "Valido") ?? tag1(val.text, "faultstring") ?? val.text.slice(0, 180)}`);

  console.log("\n--- ListarSolicitacoes (idInst + hash) ---");
  if (login2418.ok) {
    await tryList("idInst=2492 (login)", login2418.idInst, login2418.hash);
    await tryList("idInst=2418 (parceiro)", "2418", login2418.hash);
  }
  if (loginEnv.ok) {
    await tryList(`idInst=${loginEnv.idInst} (.env chave)`, loginEnv.idInst, loginEnv.hash);
  }

  console.log("\n--- ListarSolicitacoesEProtocolo (Hash maiúsculo) ---");
  if (login2418.ok) {
    const r = await soap(
      "ListarSolicitacoesEProtocolo",
      `<tns:ListarSolicitacoesEProtocolo><tns:idInstituicao>${login2418.idInst}</tns:idInstituicao><tns:protocolo></tns:protocolo><tns:Hash>${login2418.hash}</tns:Hash></tns:ListarSolicitacoesEProtocolo>`
    );
    console.log(`HTTP ${r.status} | Codigo=${tag1(r.text, "Codigo")} | ${tag1(r.text, "Descricao") ?? tag1(r.text, "faultstring") ?? "?"}`);
  }

  console.log("\n--- WSOficio Certidoes (controle — hash HML deve funcionar) ---");
  const py = spawnSync("py", ["-c", `
import sys; sys.path.insert(0, r'${REPO.replace(/\\/g, "/")}')
from dotenv import load_dotenv; load_dotenv(r'${path.join(REPO, ".env").replace(/\\/g, "/")}')
import os; os.environ['ONR_SERVENTIA_ID']='2418'; os.environ['ONR_SERVENTIA_CHAVE']='54414123-9258-469E-A420-66CB70549435'
from scripts.login.login_onr import load_config, build_login_request, login
from lib.cert_extract import extract_from_pfx
from lib.onr_hash import compute_onr_auth_hash
from zeep import Client
from zeep.transports import Transport
cfg=load_config(); cfg['id_parceiro_ws']=2418
cert=extract_from_pfx(cfg['cert_path'], cfg['cert_password'])
res=login(cfg, build_login_request(cert,cfg))
token=res['Tokens'][0] if isinstance(res['Tokens'],list) else res['Tokens'].string[0]
h=compute_onr_auth_hash('54414123-9258-469E-A420-66CB70549435', token)
c=Client('https://hml3-wsoficio.onr.org.br/Certidoes.asmx?wsdl', transport=Transport(timeout=60))
c.service._binding_options['address']='https://hml3-wsoficio.onr.org.br/Certidoes.asmx'
r=c.service.ObterXMLSolicitacoes_v6(oRequest={'Hash':h,'Protocolo':'','Solicitante':'','TipoCertidao':'','PesquisaPor':'','Status':'','TipoResposta':'','DataPedidoDe':'2025-01-01T00:00:00','DataPedidoAte':'2026-06-15T23:59:59','DataConferenciaDe':'','DataConferenciaAte':''})
print('Certidoes RETORNO', r.RETORNO, 'CODIGO', getattr(r,'CODIGOERRO',None))
`], { encoding: "utf8", cwd: REPO });
  console.log(py.stdout.trim() || py.stderr.trim());
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
