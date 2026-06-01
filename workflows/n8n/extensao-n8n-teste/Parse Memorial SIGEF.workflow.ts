import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : Parse Memorial SIGEF
// Nodes   : 7  |  Connections: 7
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// Webhook                            webhook                    [creds]
// ValidarPdfEntrada                  code
// IfPdfValido                        if
// ReadMemorialPdf                    readPDF
// ParseMemorialSigef                 code
// RespostaErroEntrada                code
// RespondToWebhook                   respondToWebhook
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// Webhook
//    → ValidarPdfEntrada
//      → IfPdfValido
//        → ReadMemorialPdf
//          → ParseMemorialSigef
//            → RespondToWebhook
//       .out(1) → RespostaErroEntrada
//          → RespondToWebhook (↩ loop)
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'drRULxhBQUk10wbw',
    name: 'Parse Memorial SIGEF',
    active: false,
    isArchived: false,
    projectId: 'PP65Me8T4KDNsx9m',
    settings: {
        executionOrder: 'v1',
        binaryMode: 'separate',
        availableInMCP: false,
        callerPolicy: 'workflowsFromSameOwner',
    },
})
export class ParseMemorialSigefWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: '8e6f4c24-4925-49a6-ab6d-55d566be2a7a',
        webhookId: 'c8e7f6a5-b4d3-4c2b-a1f0-9e8d7c6b5a4f',
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [-848, 96],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    Webhook = {
        httpMethod: 'POST',
        path: 'sigef/memorial/parse',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'bbe34d66-fb45-4b2d-b9d0-e8f595ece0d1',
        name: 'validar-pdf-entrada',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [-560, 96],
    })
    ValidarPdfEntrada = {
        jsCode: `
const item = $input.first();
const binary = item.binary ?? {};
const keys = Object.keys(binary);

function erro(status, code, detail) {
  return [{ json: { status_http: status, sucesso: false, code, detail, pdf_valido: false } }];
}

if (!keys.length) {
  return erro(422, 'arquivo_invalido', 'Envie um arquivo PDF do memorial descritivo (campo multipart "memorial").');
}

const binaryKey = keys.includes('memorial') ? 'memorial' : keys.includes('data') ? 'data' : keys[0];
const bin = binary[binaryKey];
const fileName = (bin.fileName || '').toLowerCase();
const mime = (bin.mimeType || '').toLowerCase();

if (!fileName.endsWith('.pdf') && !mime.includes('pdf')) {
  return erro(422, 'arquivo_invalido', 'Envie um arquivo PDF do memorial descritivo.');
}

const maxBytes = 25 * 1024 * 1024;
if (bin.fileSize && Number(bin.fileSize) > maxBytes) {
  return erro(422, 'arquivo_muito_grande', 'Arquivo excede o limite de 25MB.');
}

return [{
  json: { pdf_valido: true, binary_property: binaryKey },
  binary: { data: bin },
}];
`,
    };

    @node({
        id: 'a784d295-f081-4370-983e-f78de8e9e8eb',
        name: 'if-pdf-valido',
        type: 'n8n-nodes-base.if',
        version: 2.2,
        position: [-288, 96],
    })
    IfPdfValido = {
        conditions: {
            options: {
                caseSensitive: true,
                leftValue: '',
                typeValidation: 'strict',
                version: 2,
            },
            conditions: [
                {
                    id: 'cond-pdf-valido',
                    leftValue: '={{ $json.pdf_valido }}',
                    rightValue: true,
                    operator: {
                        type: 'boolean',
                        operation: 'true',
                    },
                },
            ],
            combinator: 'and',
        },
        options: {},
    };

    @node({
        id: 'b58a1032-77cc-454a-ae3f-8a2e2cc9b204',
        name: 'read-memorial-pdf',
        type: 'n8n-nodes-base.readPDF',
        version: 1,
        position: [0, 0],
    })
    ReadMemorialPdf = {};

    @node({
        id: 'a6e9feff-91cd-41cf-b9c3-938d2c46abfc',
        name: 'parse-memorial-sigef',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [272, 0],
    })
    ParseMemorialSigef = {
        jsCode: `
const ROW_RE = /^(?<codigo>[A-Z0-9]+-[A-Z]-\\d+)\\s+(?<longitude>-?\\d+°\\d+'[\\d,]+")\\s+(?<latitude>-?\\d+°\\d+'[\\d,]+")\\s+(?<altitude>[-\\d\\.,]+)\\s+(?<codigo_vante>[A-Z0-9]+-[A-Z]-\\d+)\\s+(?<azimute>\\d+°\\d+'(?:[\\d,]+")?)\\s+(?<distancia_m>[-\\d\\.,]+)\\s*(?<confrontante>.*)$/;

const DMS_RE = /^\\s*(?<sign>-)?(?<deg>\\d+)[°º]\\s*(?<min>\\d+)(?:['']\\s*(?<sec>[\\d\\.,]+)?(?:"|”)?)?\\s*$/;

const LON_MIN = -74.0;
const LON_MAX = -35.0;
const LAT_MIN = -34.0;
const LAT_MAX = 5.0;
const TIPOS_VALIDOS = new Set(['M', 'P']);

function erro(status, code, detail) {
  return [{ json: { status_http: status, sucesso: false, code, detail } }];
}

function safeMatch(pattern, text) {
  const found = text.match(new RegExp(pattern, 'i'));
  return found ? found[1].trim() : null;
}

function toFloatBr(value) {
  if (value == null || value === '') return null;
  const cleaned = String(value).trim().replace(/\\./g, '').replace(',', '.');
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : null;
}

function dmsToDecimal(value) {
  const m = DMS_RE.exec(String(value).trim());
  if (!m) throw new Error('Formato DMS inválido: ' + value);
  const degrees = parseFloat(m.groups.deg);
  const minutes = parseFloat(m.groups.min);
  const secRaw = m.groups.sec;
  const seconds = secRaw ? parseFloat(secRaw.replace(',', '.')) : 0;
  const sign = m.groups.sign ? -1 : 1;
  return sign * (degrees + minutes / 60 + seconds / 3600);
}

function inferVertexType(codigo) {
  return String(codigo || '').toUpperCase().includes('-P-') ? 'P' : 'M';
}

function parseRows(rawText) {
  const linhasParcela = [];
  const linhasEncravada = [];
  let inTable = false;
  let inEncravada = false;
  const seen = new Set();

  for (const rawLine of rawText.split(/\\r?\\n/)) {
    const line = rawLine.trim().replace(/\\s+/g, ' ');
    if (!line) continue;

    if (line.toUpperCase().includes('DESCRIÇÃO DA PARCELA')) {
      inTable = true;
      continue;
    }
    if (!inTable) continue;

    if (line.toUpperCase().includes('ÁREA ENCRAVADA')) {
      inEncravada = true;
      continue;
    }
    if (line.startsWith('Página ') || line.startsWith('Este Memorial Descritivo foi gerado')) continue;

    const matched = ROW_RE.exec(line);
    if (!matched) continue;

    const row = matched.groups;
    const key = [row.codigo, row.codigo_vante, row.azimute, row.distancia_m].join('|');
    if (seen.has(key)) continue;
    seen.add(key);

    row.altitude = toFloatBr(row.altitude);
    row.distancia_m = toFloatBr(row.distancia_m);

    if (inEncravada) linhasEncravada.push(row);
    else linhasParcela.push(row);
  }
  return { linhasParcela, linhasEncravada };
}

function parseMemorialText(rawText) {
  const { linhasParcela, linhasEncravada } = parseRows(rawText);
  const cabecalho = {
    denominacao:
      safeMatch('Denominação:\\\\s*(.+?)(?:\\\\s+Natureza da Área:|$)', rawText) ||
      safeMatch('Denominação:\\\\s*(.+)', rawText),
    proprietario: safeMatch('Proprietário\\\\(a\\\\):\\\\s*(.+)', rawText),
    matricula_imovel: safeMatch('Matrícula do imóvel:\\\\s*(.+)', rawText),
    natureza_area: safeMatch('Natureza da Área:\\\\s*(.+)', rawText),
    cpf: safeMatch('CPF:\\\\s*(.+)', rawText),
    municipio_uf: safeMatch('Município/UF:\\\\s*(.+)', rawText),
    codigo_incra_sncr: safeMatch('Código INCRA/SNCR:\\\\s*([0-9]+)', rawText),
    responsavel_tecnico: safeMatch('Responsável Técnico\\\\(a\\\\):\\\\s*(.+)', rawText),
    datum: safeMatch('Sistema Geodésico de referência:\\\\s*(.+)', rawText),
    area_ha: toFloatBr(safeMatch('Área \\\\(Sistema Geodésico Local\\\\):\\\\s*([\\\\d\\\\.,]+)\\\\s*ha', rawText)),
    perimetro_m: toFloatBr(safeMatch('Perímetro \\\\(m\\\\):\\\\s*([\\\\d\\\\.,]+)\\\\s*m', rawText)),
    cartorio: safeMatch('Cartório \\\\(CNS\\\\):\\\\s*(.+)', rawText),
    cns: safeMatch('Cartório\\\\s*\\\\(CNS\\\\):\\\\s*\\\\(([^)]+)\\\\)', rawText),
    referencia:
      safeMatch('Documento de RT:\\\\s*(.+)', rawText) || safeMatch('Referência:\\\\s*(.+)', rawText),
  };
  const certificacao = {
    uuid: safeMatch('CERTIFICAÇÃO:\\\\s*([0-9a-fA-F\\\\-]{36})', rawText),
    status_certificacao: safeMatch('(Certificada\\\\s*-\\\\s*[^\\\\n\\\\r]+)', rawText),
    data_certificacao: safeMatch('Data Certificação:\\\\s*([0-9/: ]+)', rawText),
    data_geracao: safeMatch('Data da Geração:\\\\s*([0-9/: ]+)', rawText),
  };
  return { cabecalho, linhas_parcela: linhasParcela, linhas_area_encravada: linhasEncravada, certificacao };
}

function validateDatum(datum) {
  const upper = String(datum || '').toUpperCase();
  if (!upper.includes('SIRGAS') && !upper.includes('GRS_1980') && !upper.includes('GRS 1980')) {
    throw Object.assign(new Error('arquivo não está em SIRGAS 2000'), { code: 'datum_invalido' });
  }
}

function validateVertices(vertices) {
  if (vertices.length < 3) {
    throw Object.assign(new Error('menos de 3 vértices'), { code: 'geometria_invalida' });
  }
  for (const v of vertices) {
    if (v.longitude < LON_MIN || v.longitude > LON_MAX) {
      throw Object.assign(new Error('longitude fora do Brasil: ' + v.longitude + ' (vértice ' + v.codigo + ')'), {
        code: 'coordenada_invalida',
      });
    }
    if (v.latitude < LAT_MIN || v.latitude > LAT_MAX) {
      throw Object.assign(new Error('latitude fora do Brasil: ' + v.latitude + ' (vértice ' + v.codigo + ')'), {
        code: 'coordenada_invalida',
      });
    }
    const tipo = String(v.tipo || '').toUpperCase();
    if (!TIPOS_VALIDOS.has(tipo)) {
      throw Object.assign(new Error('tipo_vertice_invalido: ' + v.tipo + ' (vértice ' + v.codigo + ')'), {
        code: 'tipo_vertice_invalido',
      });
    }
  }
}

function collectWarnings(vertices, limites) {
  const warnings = [];
  for (const v of vertices) {
    if (v.altitude == null || v.altitude === 0) {
      warnings.push('Vértice ' + v.codigo + ' sem altitude registrada.');
    }
    const sigmaMax = Math.max(v.sigma_x || 0, v.sigma_y || 0, v.sigma_z || 0);
    if (sigmaMax > 3) {
      warnings.push('Vértice ' + v.codigo + ' com sigma elevado (' + sigmaMax.toFixed(2) + ' m) — baixa precisão.');
    }
  }
  for (const lim of limites) {
    if (!String(lim.confrontante || '').trim()) {
      warnings.push('Limite ' + lim.indice + ' (' + lim.do_vertice + ' → ' + lim.ao_vertice + ') sem confrontante.');
    }
  }
  return warnings;
}

function getUtmEpsg(lonCenter) {
  const zone = Math.floor((lonCenter + 180) / 6) + 1;
  return 31960 + zone;
}

function latLonToUtm(lat, lon, zone) {
  const a = 6378137;
  const f = 1 / 298.257223563;
  const k0 = 0.9996;
  const e2 = 2 * f - f * f;
  const e = Math.sqrt(e2);
  const latRad = (lat * Math.PI) / 180;
  const lonRad = (lon * Math.PI) / 180;
  const lonOrigin = ((-183 + zone * 6) * Math.PI) / 180;
  const n = a / Math.sqrt(1 - e2 * Math.sin(latRad) ** 2);
  const t = Math.tan(latRad) ** 2;
  const c = (e2 / (1 - e2)) * Math.cos(latRad) ** 2;
  const aa = Math.cos(latRad) * (lonRad - lonOrigin);
  const m =
    a *
    ((1 - e2 / 4 - (3 * e2 ** 2) / 64 - (5 * e2 ** 3) / 256) * latRad -
      ((3 * e2) / 8 + (3 * e2 ** 2) / 32 + (45 * e2 ** 3) / 1024) * Math.sin(2 * latRad) +
      ((15 * e2 ** 2) / 256 + (45 * e2 ** 3) / 1024) * Math.sin(4 * latRad) -
      ((35 * e2 ** 3) / 3072) * Math.sin(6 * latRad));
  const easting =
    k0 *
      n *
      (aa +
        ((1 - t + c) * aa ** 3) / 6 +
        ((5 - 18 * t + t ** 2 + 72 * c - 58 * (e2 / (1 - e2))) * aa ** 5) / 120) +
    500000;
  let northing =
    k0 *
    (m +
      n *
        Math.tan(latRad) *
        ((aa ** 2) / 2 +
          ((5 - t + 9 * c + 4 * c ** 2) * aa ** 4) / 24 +
          ((61 - 58 * t + t ** 2 + 600 * c - 330 * (e2 / (1 - e2))) * aa ** 6) / 720));
  if (lat < 0) northing += 10000000;
  return { x: easting, y: northing };
}

function ringAreaPerimeterUtm(ringLonLat, zone) {
  const pts = ringLonLat.map(([lon, lat]) => latLonToUtm(lat, lon, zone));
  let area = 0;
  let perimeter = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const x1 = pts[i].x;
    const y1 = pts[i].y;
    const x2 = pts[i + 1].x;
    const y2 = pts[i + 1].y;
    area += x1 * y2 - x2 * y1;
    perimeter += Math.hypot(x2 - x1, y2 - y1);
  }
  return { areaHa: Math.abs(area) / 2 / 10000, perimeterM: perimeter };
}

function buildPolygon(parcelaRows, encravadaRows) {
  if (parcelaRows.length < 3) {
    throw Object.assign(new Error('Memorial sem vértices suficientes para formar a parcela.'), { code: 'geometria_invalida' });
  }
  const exterior = parcelaRows.map((r) => [dmsToDecimal(r.longitude), dmsToDecimal(r.latitude)]);
  if (exterior[0][0] !== exterior[exterior.length - 1][0] || exterior[0][1] !== exterior[exterior.length - 1][1]) {
    exterior.push([...exterior[0]]);
  }
  const holes = [];
  if (encravadaRows.length >= 3) {
    const hole = encravadaRows.map((r) => [dmsToDecimal(r.longitude), dmsToDecimal(r.latitude)]);
    if (hole[0][0] !== hole[hole.length - 1][0] || hole[0][1] !== hole[hole.length - 1][1]) {
      hole.push([...hole[0]]);
    }
    holes.push(hole);
  }
  return { exterior, holes };
}

function polygonBounds(exteriorLonLat) {
  let xmin = Infinity, ymin = Infinity, xmax = -Infinity, ymax = -Infinity;
  for (const [lon, lat] of exteriorLonLat) {
    if (lon < xmin) xmin = lon;
    if (lon > xmax) xmax = lon;
    if (lat < ymin) ymin = lat;
    if (lat > ymax) ymax = lat;
  }
  return { xmin, ymin, xmax, ymax };
}

function ringToWkt(ringLonLat) {
  const coords = ringLonLat.map(([lon, lat]) => lon + ' ' + lat).join(', ');
  return '(' + coords + ')';
}

function polygonToWkt(exterior, holes) {
  const parts = [ringToWkt(exterior), ...holes.map(ringToWkt)];
  return 'POLYGON(' + parts.join(', ') + ')';
}

function toDescricaoRow(row) {
  return {
    codigo: row.codigo,
    longitude: row.longitude,
    latitude: row.latitude,
    altitude: row.altitude,
    codigo_vante: row.codigo_vante,
    azimute: row.azimute,
    distancia_m: row.distancia_m,
    confrontante: (row.confrontante || '').trim() || null,
  };
}

try {
  const item = $input.first();
  const rawText = String(item.json.text || item.json.data || '').trim();
  if (!rawText) {
    return erro(422, 'arquivo_invalido', 'Não foi possível extrair texto do PDF (arquivo vazio ou somente imagem).');
  }

  const memorial = parseMemorialText(rawText);
  const cabecalho = memorial.cabecalho;
  const certificacao = memorial.certificacao;
  const parcelaRows = memorial.linhas_parcela;
  const encravadaRows = memorial.linhas_area_encravada;
  const allRows = [...parcelaRows, ...encravadaRows];

  if (!parcelaRows.length) {
    return erro(422, 'memorial_invalido', 'Nenhuma linha da tabela "Descrição da Parcela" foi encontrada no PDF.');
  }

  const vertices = allRows.map((row, idx) => ({
    indice: idx + 1,
    codigo: row.codigo,
    tipo: inferVertexType(row.codigo),
    metodo_posicionamento: null,
    longitude: dmsToDecimal(row.longitude),
    latitude: dmsToDecimal(row.latitude),
    altitude: row.altitude,
    sigma_x: null,
    sigma_y: null,
    sigma_z: null,
    lado: null,
    coord_x_dms: row.longitude,
    coord_y_dms: row.latitude,
  }));

  validateDatum(cabecalho.datum || 'SIRGAS 2000');
  validateVertices(vertices);

  const limites = allRows.map((row, idx) => {
    const startLon = dmsToDecimal(row.longitude);
    const startLat = dmsToDecimal(row.latitude);
    const target = allRows.find((c) => c.codigo === row.codigo_vante);
    let geometria_wkt = null;
    if (target) {
      const endLon = dmsToDecimal(target.longitude);
      const endLat = dmsToDecimal(target.latitude);
      geometria_wkt = 'LINESTRING(' + startLon + ' ' + startLat + ', ' + endLon + ' ' + endLat + ')';
    }
    let azimuteDec = null;
    try {
      azimuteDec = dmsToDecimal(row.azimute);
    } catch (_) {
      azimuteDec = null;
    }
    return {
      indice: idx + 1,
      do_vertice: row.codigo,
      ao_vertice: row.codigo_vante,
      tipo: null,
      azimute: azimuteDec,
      comprimento: row.distancia_m,
      confrontante: (row.confrontante || '').trim() || null,
      lado: null,
      geometria_wkt,
    };
  });

  const { exterior, holes } = buildPolygon(parcelaRows, encravadaRows);
  const bounds = polygonBounds(exterior);
  const lonCenter = (bounds.xmin + bounds.xmax) / 2;
  const zone = Math.floor((lonCenter + 180) / 6) + 1;

  let areaHaUtm = 0;
  let perimetroMUtm = 0;
  const extMetrics = ringAreaPerimeterUtm(exterior, zone);
  areaHaUtm = extMetrics.areaHa;
  perimetroMUtm = extMetrics.perimeterM;
  for (const hole of holes) {
    const holeMetrics = ringAreaPerimeterUtm(hole, zone);
    areaHaUtm -= holeMetrics.areaHa;
    perimetroMUtm += holeMetrics.perimeterM;
  }
  areaHaUtm = Math.round(areaHaUtm * 10000) / 10000;
  perimetroMUtm = Math.round(perimetroMUtm * 100) / 100;

  const warnings = collectWarnings(vertices, limites);
  if (encravadaRows.length) {
    warnings.push('Memorial contém área encravada; geometria exportada com anel interno.');
  }

  const response = {
    status_http: 200,
    sucesso: true,
    qrcode: certificacao.uuid,
    nome: cabecalho.denominacao,
    area_ha: cabecalho.area_ha ?? areaHaUtm,
    perimetro_m: cabecalho.perimetro_m ?? perimetroMUtm,
    datum: cabecalho.datum || 'SIRGAS 2000',
    status_certificacao: String(certificacao.status_certificacao || 'CERTIFICADA').toUpperCase(),
    bbox: bounds,
    geometria_wkt: polygonToWkt(exterior, holes),
    codigo_incra_sncr: cabecalho.codigo_incra_sncr,
    cartorio: cabecalho.cartorio,
    cns: cabecalho.cns,
    matricula_imovel: cabecalho.matricula_imovel,
    proprietario: cabecalho.proprietario,
    municipio_uf: cabecalho.municipio_uf,
    natureza_area: cabecalho.natureza_area,
    responsavel: cabecalho.responsavel_tecnico,
    referencia: cabecalho.referencia,
    vertices,
    limites,
    descricao_parcela: parcelaRows.map(toDescricaoRow),
    descricao_area_encravada: encravadaRows.map(toDescricaoRow),
    validacoes: {
      datum_valido: true,
      total_vertices: vertices.length,
      total_limites: limites.length,
      warnings,
    },
    cabecalho,
    certificacao,
    utm_zone: zone,
    utm_epsg: getUtmEpsg(lonCenter),
  };

  return [{ json: response }];
} catch (exc) {
  const code = exc.code || 'erro_interno';
  const status = ['datum_invalido', 'geometria_invalida', 'coordenada_invalida', 'tipo_vertice_invalido'].includes(code)
    ? 400
    : 500;
  return erro(status, code, exc.message || String(exc));
}
`,
    };

    @node({
        id: '875b4e30-6163-4729-b550-69843278e2b7',
        name: 'resposta-erro-entrada',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [0, 240],
    })
    RespostaErroEntrada = {
        jsCode: `
const item = $input.first().json;
return [{
  json: {
    status_http: item.status_http ?? 422,
    sucesso: false,
    code: item.code ?? 'arquivo_invalido',
    detail: item.detail ?? 'Entrada inválida.',
  },
}];
`,
    };

    @node({
        id: 'e84faf1f-a8de-4fee-bb54-f5043b76d4e5',
        name: 'Respond to Webhook',
        type: 'n8n-nodes-base.respondToWebhook',
        version: 1.5,
        position: [560, 96],
    })
    RespondToWebhook = {
        options: {
            responseCode: '={{ $json.status_http ?? 200 }}',
        },
    };

    // =====================================================================
    // ROUTAGE ET CONNEXIONS
    // =====================================================================

    @links()
    defineRouting() {
        this.Webhook.out(0).to(this.ValidarPdfEntrada.in(0));
        this.ValidarPdfEntrada.out(0).to(this.IfPdfValido.in(0));
        this.IfPdfValido.out(0).to(this.ReadMemorialPdf.in(0));
        this.IfPdfValido.out(1).to(this.RespostaErroEntrada.in(0));
        this.ReadMemorialPdf.out(0).to(this.ParseMemorialSigef.in(0));
        this.ParseMemorialSigef.out(0).to(this.RespondToWebhook.in(0));
        this.RespostaErroEntrada.out(0).to(this.RespondToWebhook.in(0));
    }
}
