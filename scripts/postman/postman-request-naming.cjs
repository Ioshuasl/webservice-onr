/**
 * Convenção obrigatória de nomes de requests Postman alinhados ao Plane (AUTONR).
 *
 * Formato canônico: `[AUTONR-n] Nome descritivo`
 * Ex.: `[AUTONR-2] Auth ONR — Login`
 *
 * Legado (migrar com --fix): `AUTONR-n: Nome`
 */
const AUTONR_CANONICAL_RE = /^\[AUTONR-\d+\] .+/;
const AUTONR_LEGACY_COLON_RE = /^AUTONR-\d+: .+/;
const AUTONR_ANY_PREFIX_RE = /^(?:\[AUTONR-\d+\] |AUTONR-\d+: )/;

function formatAutonrRequestName(planeKey, baseName) {
  const key = String(planeKey || "").trim();
  const base = String(baseName || "").trim();
  if (!/^AUTONR-\d+$/.test(key)) {
    throw new Error(`plane_key inválido: ${planeKey}`);
  }
  if (!base) throw new Error("baseName obrigatório para formatAutonrRequestName");
  return `[${key}] ${base}`;
}

function stripAutonrPrefix(name) {
  return String(name || "")
    .replace(/^\[AUTONR-\d+\]\s*/, "")
    .replace(/^AUTONR-\d+:\s*/, "");
}

function hasAutonrPrefix(name) {
  return AUTONR_ANY_PREFIX_RE.test(String(name || ""));
}

function isCanonicalAutonrName(name) {
  return AUTONR_CANONICAL_RE.test(String(name || ""));
}

function isLegacyColonAutonrName(name) {
  return AUTONR_LEGACY_COLON_RE.test(String(name || ""));
}

function migrateLegacyColonName(name) {
  const s = String(name || "");
  const m = s.match(/^(AUTONR-\d+):\s+(.+)$/);
  if (!m) return s;
  return formatAutonrRequestName(m[1], m[2]);
}

function ensureCanonicalPrefix(name, planeKey) {
  const bare = stripAutonrPrefix(name);
  return formatAutonrRequestName(planeKey, bare);
}

function collectLeafRequests(items, out = [], folderStack = []) {
  for (const it of items || []) {
    const folders = it.request ? folderStack : [...folderStack, it.name];
    if (it.request) {
      out.push({ name: it.name, item: it, folders });
    }
    if (it.item) collectLeafRequests(it.item, out, folders);
  }
  return out;
}

function walkItems(items, fn) {
  for (const it of items || []) {
    fn(it);
    if (it.item) walkItems(it.item, fn);
  }
}

function migrateLegacyColonNaming(collection) {
  let changed = 0;
  walkItems(collection.item, (it) => {
    if (!it.request || !isLegacyColonAutonrName(it.name)) return;
    const next = migrateLegacyColonName(it.name);
    if (next !== it.name) {
      it.name = next;
      changed += 1;
    }
  });
  return changed;
}

module.exports = {
  AUTONR_CANONICAL_RE,
  AUTONR_LEGACY_COLON_RE,
  formatAutonrRequestName,
  stripAutonrPrefix,
  hasAutonrPrefix,
  isCanonicalAutonrName,
  isLegacyColonAutonrName,
  migrateLegacyColonName,
  ensureCanonicalPrefix,
  collectLeafRequests,
  walkItems,
  migrateLegacyColonNaming,
};
