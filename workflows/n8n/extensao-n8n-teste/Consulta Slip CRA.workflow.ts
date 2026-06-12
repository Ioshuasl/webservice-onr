import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : [AUTOCRA-10] (cra) Consulta_Slip - Consulta
// Nodes   : 10  |  Connections: 11
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// Webhook                            webhook                    [creds]
// NormalizarEntrada                  set
// ValidarEntrada                     code
// IfEntradaValida                    if
// MontarSoapCra                      code
// ConsumirSoapCra                    httpRequest                [onError→out(1)]
// ConverterRespostaCra               code
// RespostaValidacao                  code
// RespostaErroConexaoCra             code
// RespondToWebhook                   respondToWebhook
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// Webhook
//    → NormalizarEntrada
//      → ValidarEntrada
//        → IfEntradaValida
//          → MontarSoapCra
//            → ConsumirSoapCra
//              → ConverterRespostaCra
//                → RespondToWebhook
//              → RespostaErroConexaoCra
//                → RespondToWebhook (↩ loop)
//         .out(1) → RespostaValidacao
//            → RespondToWebhook (↩ loop)
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'iqe1B9FKkAP3rZPK',
    name: '[AUTOCRA-10] (cra) Consulta_Slip - Consulta',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class Autocra10CraConsultaSlipConsultaWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: '5040b584-7aac-403c-9963-d995d2b7e2a4',
        webhookId: 'f5f0032b-ba3b-4612-a7e0-83ea6f08edde',
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 300],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    Webhook = {
        httpMethod: 'POST',
        path: 'cra/consulta-slip',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'ea2d46a9-9f12-4cbe-8d13-913c0e09cd80',
        name: 'normalizar-entrada',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [240, 300],
    })
    NormalizarEntrada = {
        mode: 'raw',
        jsonOutput: `={{
  {
    operacao: 'Consulta_Slip',
    soap_op: 'Consulta_Slip',
    ambiente: $json.body?.ambiente || $env.CRA_AMBIENTE || 'homologacao',
    uf: String($json.body?.uf || $env.CRA_UF || 'go').toLowerCase(),
    usuario_cra: $json.body?.usuario_cra || $env.CRA_USER || '',
    senha_cra: $json.body?.senha_cra || $env.CRA_PASS || '',
    cod_municipio: String($json.body?.cod_municipio || ''),
    cod_cartorio: String($json.body?.cod_cartorio || ''),
    protocolo: String($json.body?.protocolo || ''),
    data_protocolo: String($json.body?.data_protocolo || '')
  }
}}`,
        options: {},
    };

    @node({
        id: 'c62fc9f8-f0c6-4595-91e4-0144e76deae1',
        name: 'validar-entrada',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [480, 300],
    })
    ValidarEntrada = {
        mode: 'runOnceForAllItems',
        language: 'javaScript',
        jsCode: `
const item = $input.first().json;
const erros = [];
if (!item.usuario_cra) erros.push('usuario_cra');
if (!item.senha_cra) erros.push('senha_cra');
if (!item.uf) erros.push('uf');
if (!item.cod_municipio) erros.push('cod_municipio');
if (!item.cod_cartorio) erros.push('cod_cartorio');
if (!item.protocolo) erros.push('protocolo');
if (!item.data_protocolo) {
  erros.push('data_protocolo');
} else if (!/^\\d{2}\\/\\d{2}\\/\\d{4}$/.test(item.data_protocolo)) {
  erros.push('data_protocolo (formato DD/MM/AAAA)');
}
const entrada_valida = erros.length === 0;
return [{
  json: {
    ...item,
    entrada_valida,
    codigo_erro: entrada_valida ? 0 : 10,
    mensagem_erro: entrada_valida ? '' : 'Campos obrigatórios: ' + erros.join(', ')
  }
}];`,
    };

    @node({
        id: 'b6b39377-a357-4c56-a748-713db1c93fe7',
        name: 'if-entrada-valida',
        type: 'n8n-nodes-base.if',
        version: 2.2,
        position: [720, 300],
    })
    IfEntradaValida = {
        conditions: {
            options: {
                caseSensitive: true,
                leftValue: '',
                typeValidation: 'strict',
                version: 2,
            },
            conditions: [
                {
                    id: 'a136-valid',
                    leftValue: '={{ $json.entrada_valida }}',
                    rightValue: '',
                    operator: {
                        type: 'boolean',
                        operation: 'true',
                        singleValue: true,
                    },
                },
            ],
            combinator: 'and',
        },
        options: {},
    };

    @node({
        id: '3ff3cad4-8075-4fce-837f-9e1cc4a98a24',
        name: 'montar-soap-cra',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [960, 200],
    })
    MontarSoapCra = {
        mode: 'runOnceForAllItems',
        language: 'javaScript',
        jsCode: `
function esc(v) {
  return String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
const item = $input.first().json;
const prod = item.ambiente === 'producao';
const host = prod ? 'crabr.com.br' : 'cra21.com.br';
const ns = \`urn:cra\${item.uf}.\${host}\`;
const url = \`https://cra\${item.uf}.\${host}/cra\${item.uf}/xml/protestos.php\`;
const soapAction = ns + '#Consulta_Slip';
const body = \`<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="\${ns}">
  <soapenv:Header/>
  <soapenv:Body>
    <urn:Consulta_Slip soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
      <codMunicipio xsi:type="xsd:string">\${esc(item.cod_municipio)}</codMunicipio>
      <codCartorio xsi:type="xsd:string">\${esc(item.cod_cartorio)}</codCartorio>
      <protocolo xsi:type="xsd:string">\${esc(item.protocolo)}</protocolo>
      <dataProtocolo xsi:type="xsd:string">\${esc(item.data_protocolo)}</dataProtocolo>
    </urn:Consulta_Slip>
  </soapenv:Body>
</soapenv:Envelope>\`;
const cra_auth_header = 'Basic ' + Buffer.from(item.usuario_cra + ':' + item.senha_cra).toString('base64');
return [{ json: { ...item, cra_soap_url: url, cra_soap_action: soapAction, cra_soap_body: body, cra_auth_header } }];`,
    };

    @node({
        id: 'e4e299c1-9b5b-45a0-867f-64c04a8904d4',
        name: 'consumir-soap-cra',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.2,
        position: [1200, 200],
        onError: 'continueErrorOutput',
    })
    ConsumirSoapCra = {
        method: 'POST',
        url: '={{ $json.cra_soap_url }}',
        authentication: 'none',
        sendHeaders: true,
        headerParameters: {
            parameters: [
                {
                    name: 'Authorization',
                    value: '={{ $json.cra_auth_header }}',
                },
                {
                    name: 'Content-Type',
                    value: 'text/xml; charset=ISO-8859-1',
                },
                {
                    name: 'SOAPAction',
                    value: '={{ $json.cra_soap_action }}',
                },
            ],
        },
        sendBody: true,
        contentType: 'raw',
        rawContentType: 'text/xml',
        body: '={{ $json.cra_soap_body }}',
        options: {
            timeout: 1800000,
        },
    };

    @node({
        id: '84f5be4f-57e9-4ed5-b124-a52ba9c1493f',
        name: 'converter-resposta-cra',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1440, 200],
    })
    ConverterRespostaCra = {
        mode: 'runOnceForAllItems',
        language: 'javaScript',
        jsCode: `
function extrairTag(xml, tag) {
  const re = new RegExp('<' + tag + '[^>]*>([\\\\s\\\\S]*?)<\\\\/' + tag + '>', 'i');
  const m = String(xml || '').match(re);
  return m ? m[1].trim() : '';
}
function mapearStatusHttpCra(codigo, origem = 'cra') {
  if (origem === 'validacao') return 400;
  const c = String(codigo ?? '').trim();
  if (c === '0001') return 401;
  if (['0000', '0002', '0003'].includes(c)) return 200;
  if (!c) return 502;
  return 422;
}
const prev = $('montar-soap-cra').first().json;
const raw = $input.first().json?.data ?? $input.first().json?.body ?? '';
const xml = typeof raw === 'string' ? raw : String(raw);
const codigo = extrairTag(xml, 'codigo') || (xml.includes('0001') ? '0001' : '');
const mensagem = extrairTag(xml, 'ocorrencia') || extrairTag(xml, 'mensagem') || '';
const slipXml = extrairTag(xml, 'slip') || extrairTag(xml, 'consulta');
const sucesso = ['0000', '0002', '0003'].includes(codigo);
const status_http = slipXml && !codigo ? 200 : mapearStatusHttpCra(codigo);
return [{
  json: {
    status_http,
    sucesso: sucesso || (slipXml && !codigo),
    codigo: codigo || (slipXml ? '0000' : null),
    mensagem: mensagem || (slipXml ? 'REGISTROS OK' : ''),
    operacao: prev.operacao,
    dados: { slip: slipXml || null }
  }
}];`,
    };

    @node({
        id: 'eebe5d4e-a1a0-4231-a9ce-ffdda59ddbb0',
        name: 'resposta-validacao',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [960, 420],
    })
    RespostaValidacao = {
        mode: 'runOnceForAllItems',
        language: 'javaScript',
        jsCode: `
const item = $input.first().json;
return [{
  json: {
    status_http: 400,
    sucesso: false,
    codigo: String(item.codigo_erro || 10),
    mensagem: item.mensagem_erro || 'Entrada inválida',
    operacao: item.operacao,
    dados: {}
  }
}];`,
    };

    @node({
        id: 'c42d4b2c-bb47-415f-8bc0-c5b204628365',
        name: 'resposta-erro-conexao-cra',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1440, 380],
    })
    RespostaErroConexaoCra = {
        mode: 'runOnceForAllItems',
        language: 'javaScript',
        jsCode: `
return [{
  json: {
    status_http: 502,
    sucesso: false,
    codigo: null,
    mensagem: 'Falha ao conectar com o webservice CRA.',
    operacao: $('montar-soap-cra').first().json.operacao,
    dados: {}
  }
}];`,
    };

    @node({
        id: '8d963030-c6d3-411b-89da-a3accd9406a0',
        name: 'Respond to Webhook',
        type: 'n8n-nodes-base.respondToWebhook',
        version: 1.5,
        position: [1680, 300],
    })
    RespondToWebhook = {
        respondWith: 'firstIncomingItem',
        options: {
            responseCode: '={{ $json.status_http }}',
        },
    };

    // =====================================================================
    // ROUTAGE ET CONNEXIONS
    // =====================================================================

    @links()
    defineRouting() {
        this.Webhook.out(0).to(this.NormalizarEntrada.in(0));
        this.NormalizarEntrada.out(0).to(this.ValidarEntrada.in(0));
        this.ValidarEntrada.out(0).to(this.IfEntradaValida.in(0));
        this.IfEntradaValida.out(0).to(this.MontarSoapCra.in(0));
        this.IfEntradaValida.out(1).to(this.RespostaValidacao.in(0));
        this.MontarSoapCra.out(0).to(this.ConsumirSoapCra.in(0));
        this.ConsumirSoapCra.out(0).to(this.ConverterRespostaCra.in(0));
        this.ConsumirSoapCra.error().to(this.RespostaErroConexaoCra.in(0));
        this.ConverterRespostaCra.out(0).to(this.RespondToWebhook.in(0));
        this.RespostaValidacao.out(0).to(this.RespondToWebhook.in(0));
        this.RespostaErroConexaoCra.out(0).to(this.RespondToWebhook.in(0));
    }
}
