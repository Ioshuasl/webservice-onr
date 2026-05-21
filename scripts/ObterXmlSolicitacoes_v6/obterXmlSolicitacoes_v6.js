/**
 * Exporta solicitações de certidões em XML (ObterXMLSolicitacoes_v6) no webservice Certidões da ONR.
 */
import fs from "node:fs";
import path from "node:path";
import soap from "soap";
import { resolvePath } from "../../lib/onr_env.js";
import {
  buildObterXmlSolicitacoesRequest,
  businessErrorHintObterXml,
  loadObterXmlFilters,
  responseForDisplay,
} from "../../lib/onr_certidoes_obter_xml.js";
import {
  hashErrorHint,
  loadCertidoesSoapConfig,
  loadLoginConfig,
  loadServentiaChave,
  resolveAuthHash,
} from "../../lib/onr_certidoes.js";

const PREFIX = "CERTIDOES_OBTER_XML_V6_";
const OPERATION = "ObterXMLSolicitacoes_v6";

function loadConfig() {
  return {
    chave: loadServentiaChave(),
    loginCfg: loadLoginConfig(),
    filters: loadObterXmlFilters(PREFIX),
    ...loadCertidoesSoapConfig(),
  };
}

function extractResult(response) {
  return (
    response?.ObterXMLSolicitacoes_v6Result ??
    response?.ObterXMLSolicitacoes_v6Response?.ObterXMLSolicitacoes_v6Result ??
    response
  );
}

async function obterXmlSolicitacoesV6(cfg, oRequest) {
  const wsdlPath = resolvePath(cfg.wsdlPath);
  if (!fs.existsSync(wsdlPath)) {
    throw new Error(`WSDL não encontrado: ${wsdlPath}`);
  }

  const client = await soap.createClientAsync(wsdlPath, {
    endpoint: cfg.endpoint,
    forceSoap12Headers: false,
    wsdl_options: { timeout: 120000 },
  });

  let response;
  try {
    [response] = await client[OPERATION + "Async"]({ oRequest });
  } catch (err) {
    const status = err?.response?.status;
    const body =
      typeof err?.body === "string"
        ? err.body
        : typeof err?.response?.data === "string"
          ? err.response.data
          : null;

    if (status === 503 || (body && !body.trimStart().startsWith("<"))) {
      throw new Error(
        `Servidor ONR indisponível (HTTP ${status ?? "?"}): ${body ?? err.message}`
      );
    }
    throw err;
  }

  return extractResult(response);
}

async function main() {
  const cfg = loadConfig();
  const hash = await resolveAuthHash(cfg.chave, cfg.loginCfg);
  const oRequest = buildObterXmlSolicitacoesRequest(hash, cfg.filters);

  console.log(`=== Parâmetros ${OPERATION} ===`);
  console.log(JSON.stringify(oRequest, null, 2));
  console.log(`\nEndpoint: ${cfg.endpoint}`);

  const result = await obterXmlSolicitacoesV6(cfg, oRequest);
  console.log("\n=== Resposta (XML resumido) ===");
  console.log(JSON.stringify(responseForDisplay(result), null, 2));

  if (!result.RETORNO) {
    console.error(
      `\n${OPERATION} falhou: [${result.CODIGOERRO}] ${result.ERRODESCRICAO}`
    );
    const hint =
      businessErrorHintObterXml(result.CODIGOERRO) ??
      hashErrorHint(result.CODIGOERRO);
    if (hint) console.error(hint);
    process.exit(1);
  }

  const xml = result.XML ?? "";
  if (!xml.length) {
    console.error("\nRETORNO=true mas XML vazio.");
    process.exit(1);
  }

  if (cfg.filters.xmlOutputPath) {
    const outPath = resolvePath(cfg.filters.xmlOutputPath);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, xml, "utf8");
    console.log(`\nOK — XML gravado em ${outPath} (${xml.length} caracteres).`);
  } else {
    console.log(
      `\nOK — XML exportado (${xml.length} caracteres). ` +
        `Defina ${PREFIX}XML_OUTPUT_PATH para salvar em arquivo.`
    );
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
