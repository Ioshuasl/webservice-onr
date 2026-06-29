/**
 * Servidor mínimo ONLYOFFICE Docs API — dev / demonstração integração.
 *
 * Pré-requisitos:
 *   1. cp onlyoffice/.env.example onlyoffice/.env  (ajustar ONLYOFFICE_JWT_SECRET)
 *   2. Colocar onlyoffice/files/sample.docx
 *   3. npm run onlyoffice:up
 *   4. npm run onlyoffice:dev
 *   5. Abrir http://localhost:3001
 */
import crypto from "node:crypto";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pipeline } from "node:stream/promises";
import { createWriteStream } from "node:fs";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
dotenv.config({ path: path.join(ROOT, ".env") });
const FILES_DIR = path.join(ROOT, "files");

const DS_URL = process.env.ONLYOFFICE_DS_URL || "http://localhost:8080";
const PORT = Number(process.env.ONLYOFFICE_APP_PORT || 3001);
const APP_HOST = process.env.ONLYOFFICE_APP_HOST || "host.docker.internal";
const JWT_SECRET = process.env.ONLYOFFICE_JWT_SECRET || "";
const JWT_ENABLED =
  (process.env.ONLYOFFICE_JWT_ENABLED_APP ?? process.env.ONLYOFFICE_JWT_ENABLED ?? "true") ===
  "true";

const SAMPLE_NAME = "sample.docx";
const SAMPLE_PATH = path.join(FILES_DIR, SAMPLE_NAME);

function base64urlJson(obj) {
  return Buffer.from(JSON.stringify(obj)).toString("base64url");
}

function signJwt(payload, secret) {
  const header = base64urlJson({ alg: "HS256", typ: "JWT" });
  const body = base64urlJson(payload);
  const sig = crypto.createHmac("sha256", secret).update(`${header}.${body}`).digest("base64url");
  return `${header}.${body}.${sig}`;
}

function buildConfig() {
  const key = `sample-${Date.now()}`;
  const baseUrl = `http://${APP_HOST}:${PORT}`;

  const config = {
    documentType: "word",
    document: {
      fileType: "docx",
      key,
      title: SAMPLE_NAME,
      url: `${baseUrl}/files/${SAMPLE_NAME}`,
    },
    editorConfig: {
      callbackUrl: `${baseUrl}/callback`,
      lang: "pt-BR",
      mode: "edit",
      user: { id: "dev-user", name: "Dev Orius" },
      customization: { forcesave: true, chat: false },
    },
    height: "100%",
    width: "100%",
  };

  if (JWT_ENABLED && JWT_SECRET) {
    return { token: signJwt(config, JWT_SECRET) };
  }
  return config;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
      try {
        const raw = Buffer.concat(chunks).toString("utf8");
        resolve(raw ? JSON.parse(raw) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
}

async function handleCallback(body) {
  const { status, key, url } = body;
  console.log("[callback]", { status, key, url: url ? "(present)" : undefined });

  if (status === 2 || status === 6) {
    if (!url) throw new Error("callback status save sem url");
    const out = path.join(FILES_DIR, `saved-${key}.docx`);
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`download ${resp.status}`);
    await pipeline(resp.body, createWriteStream(out));
    console.log("[callback] salvo em", out);
  }

  return { error: 0 };
}

function htmlPage() {
  const apiJs = `${DS_URL}/web-apps/apps/api/documents/api.js`;
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <title>ONLYOFFICE — exemplo integração</title>
  <style>
    html, body { margin: 0; height: 100%; font-family: system-ui, sans-serif; }
    #bar { padding: 8px 12px; background: #1e293b; color: #f8fafc; font-size: 14px; }
    #editor { height: calc(100% - 40px); }
    #editor iframe { border: 0; }
  </style>
</head>
<body>
  <div id="bar">DS: ${DS_URL} · App: localhost:${PORT} · JWT: ${JWT_ENABLED}</div>
  <div id="editor"></div>
  <script src="${apiJs}"></script>
  <script>
    fetch("/api/config")
      .then((r) => r.json())
      .then((cfg) => {
        window.docEditor = new DocsAPI.DocEditor("editor", {
          ...cfg,
          events: {
            onDocumentReady: () => console.log("ONLYOFFICE ready"),
            onError: (e) => console.error("ONLYOFFICE error", e),
          },
        });
      })
      .catch((e) => {
        document.getElementById("editor").innerHTML =
          "<pre style='padding:16px;color:#b91c1c'>" + e + "</pre>";
      });
  </script>
</body>
</html>`;
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://localhost:${PORT}`);

    if (req.method === "GET" && url.pathname === "/") {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(htmlPage());
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/config") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(buildConfig()));
      return;
    }

    if (req.method === "GET" && url.pathname.startsWith("/files/")) {
      const name = path.basename(url.pathname);
      const filePath = path.join(FILES_DIR, name);
      if (!fs.existsSync(filePath)) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end(`Arquivo não encontrado: ${name}. Coloque sample.docx em onlyoffice/files/`);
        return;
      }
      res.writeHead(200, {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      fs.createReadStream(filePath).pipe(res);
      return;
    }

    if (req.method === "POST" && url.pathname === "/callback") {
      const body = await readBody(req);
      const result = await handleCallback(body);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result));
      return;
    }

    if (req.method === "GET" && url.pathname === "/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true, jwt: JWT_ENABLED, ds: DS_URL }));
      return;
    }

    res.writeHead(404);
    res.end("Not found");
  } catch (err) {
    console.error(err);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: 1, message: String(err.message || err) }));
  }
});

if (!fs.existsSync(FILES_DIR)) fs.mkdirSync(FILES_DIR, { recursive: true });

server.listen(PORT, () => {
  console.log(`ONLYOFFICE dev server http://localhost:${PORT}`);
  console.log(`Document Server: ${DS_URL}`);
  console.log(`document.url host for DS: ${APP_HOST}:${PORT}`);
  if (JWT_ENABLED && !JWT_SECRET) {
    console.warn("AVISO: JWT_ENABLED mas ONLYOFFICE_JWT_SECRET vazio — defina em onlyoffice/.env");
  }
  if (!fs.existsSync(SAMPLE_PATH)) {
    console.warn(`AVISO: copie um .docx para ${SAMPLE_PATH}`);
  }
});
