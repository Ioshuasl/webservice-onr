/**
 * Extrai campos do certificado PFX para LoginUsuarioCertificado (ONR).
 */
import fs from "node:fs";
import forge from "node-forge";

function getRdnValue(attrs, shortName) {
  const attr = attrs?.find((a) => a.shortName === shortName || a.name === shortName);
  return attr?.value ?? null;
}

function formatValidUntil(date, fmt) {
  const pad = (n) => String(n).padStart(2, "0");
  const d = pad(date.getDate());
  const m = pad(date.getMonth() + 1);
  const y = date.getFullYear();
  const h = pad(date.getHours());
  const min = pad(date.getMinutes());
  const s = pad(date.getSeconds());

  if (fmt === "br_datetime") return `${d}/${m}/${y} ${h}:${min}:${s}`;
  if (fmt === "br_date") return `${d}/${m}/${y}`;
  return `${y}-${m}-${d}T${h}:${min}:${s}`;
}

function formatPublicKey(cert, fmt) {
  const spkiDer = forge.asn1.toDer(forge.pki.publicKeyToAsn1(cert.publicKey)).getBytes();
  const b64 = forge.util.encode64(spkiDer);

  if (fmt === "pem") {
    return forge.pki.publicKeyToPem(cert.publicKey);
  }
  if (fmt === "pem_stripped") {
    return forge.pki
      .publicKeyToPem(cert.publicKey)
      .replace(/-----BEGIN PUBLIC KEY-----/g, "")
      .replace(/-----END PUBLIC KEY-----/g, "")
      .replace(/\r?\n/g, "")
      .trim();
  }
  return b64.replace(/\r?\n/g, "");
}

function formatSerial(serialHex) {
  const hex = serialHex.toUpperCase();
  return hex.length % 2 === 0 ? hex : `0${hex}`;
}

export function extractFromPfx(pfxPath, password, options = {}) {
  const { publickeyFormat = "base64_der", validuntilFormat = "iso" } = options;

  if (!fs.existsSync(pfxPath)) {
    throw new Error(`Certificado não encontrado: ${pfxPath}`);
  }

  const pfxBuffer = fs.readFileSync(pfxPath, { encoding: "binary" });
  const p12Asn1 = forge.asn1.fromDer(pfxBuffer);
  const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, password || "");

  const certBags =
    p12.getBags({ bagType: forge.pki.oids.certBag })[forge.pki.oids.certBag] ?? [];
  const cert = certBags[0]?.cert;
  if (!cert) {
    throw new Error("Nenhum certificado encontrado no arquivo PFX.");
  }

  const subjectCn = getRdnValue(cert.subject.attributes, "CN");
  if (!subjectCn) {
    throw new Error("CN (SUBJECTCN) não encontrado no certificado.");
  }

  const issuerO =
    getRdnValue(cert.issuer.attributes, "O") ||
    getRdnValue(cert.issuer.attributes, "OU") ||
    getRdnValue(cert.issuer.attributes, "CN") ||
    "";

  const keyBags =
    p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag })[
      forge.pki.oids.pkcs8ShroudedKeyBag
    ] ?? [];

  return {
    SUBJECTCN: subjectCn,
    ISSUERO: issuerO.slice(0, 10),
    PUBLICKEY: formatPublicKey(cert, publickeyFormat),
    SERIALNUMBER: formatSerial(cert.serialNumber),
    VALIDUNTIL: formatValidUntil(cert.validity.notAfter, validuntilFormat),
    _has_private_key: keyBags.length > 0,
  };
}
