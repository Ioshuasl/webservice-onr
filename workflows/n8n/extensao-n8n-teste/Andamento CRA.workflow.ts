import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : [AUTOCRA-14] (cra) Andamento - Andamento
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
    id: 'WZCP5YdKA7KzQ2uj',
    name: '[AUTOCRA-14] (cra) Andamento - Andamento',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class Autocra14CraAndamentoAndamentoWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'a1400001-0001-4000-8000-000000000001',
        webhookId: 'a1400001-0001-4000-8000-000000000011',
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [0, 300],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    Webhook = {
        httpMethod: 'POST',
        path: 'cra/andamento',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: 'a1400001-0001-4000-8000-000000000002',
        name: 'normalizar-entrada',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [240, 300],
    })
    NormalizarEntrada = {
        mode: 'raw',
        jsonOutput: `={{
  {
    operacao: 'Andamento',
    soap_op: 'Andamento',
    ambiente: $json.body?.ambiente || $env.CRA_AMBIENTE || 'homologacao',
    uf: String($json.body?.uf || $env.CRA_UF || 'go').toLowerCase(),
    usuario_cra: $json.body?.usuario_cra || $env.CRA_USER || '',
    senha_cra: $json.body?.senha_cra || $env.CRA_PASS || '',
    user_arq: String($json.body?.user_arq ?? '').trim()
  }
}}`,
        options: {},
    };

    @node({
        id: 'a1400001-0001-4000-8000-000000000003',
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
if (!item.user_arq) {
  erros.push('user_arq');
} else if (!/^M[A-Z0-9]+\\.[0-9]+$/i.test(item.user_arq)) {
  erros.push('user_arq (padrão Febraban M…DDMM.AAS, ex.: M0000101.251)');
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
        id: 'a1400001-0001-4000-8000-000000000004',
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
                    id: 'a140-valid',
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
        id: 'a1400001-0001-4000-8000-000000000005',
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
const soapAction = ns + '#Andamento';
const body = \`<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="\${ns}">
  <soapenv:Header/>
  <soapenv:Body>
    <urn:Andamento soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
      <userArq xsi:type="xsd:string">\${esc(item.user_arq)}</userArq>
    </urn:Andamento>
  </soapenv:Body>
</soapenv:Envelope>\`;
const cra_auth_header = 'Basic ' + Buffer.from(item.usuario_cra + ':' + item.senha_cra).toString('base64');
return [{ json: { ...item, cra_soap_url: url, cra_soap_action: soapAction, cra_soap_body: body, cra_auth_header } }];`,
    };

    @node({
        id: 'a1400001-0001-4000-8000-000000000006',
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
        id: 'a1400001-0001-4000-8000-000000000007',
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
function extrairBloco(xml, tag) {
  const re = new RegExp('<' + tag + '[^>]*>([\\\\s\\\\S]*?)<\\\\/' + tag + '>', 'i');
  const m = String(xml || '').match(re);
  return m ? m[0] : '';
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
const nome_arquivo = extrairTag(xml, 'nome_arquivo') || extrairTag(xml, 'nome arquivo') || prev.user_arq;
const datahora = extrairTag(xml, 'datahora') || null;
const dataoperacao = extrairTag(xml, 'dataoperacao') || null;
const relatorio_xml = extrairBloco(xml, 'relatorio');
const sucesso = ['0000', '0002', '0003'].includes(codigo);
const status_http = mapearStatusHttpCra(codigo);
return [{
  json: {
    status_http,
    sucesso,
    codigo: codigo || null,
    mensagem: mensagem || (sucesso ? 'REGISTROS OK' : ''),
    operacao: prev.operacao,
    dados: {
      nome_arquivo,
      datahora,
      dataoperacao,
      relatorio_xml: relatorio_xml || null,
      user_arq: prev.user_arq
    }
  }
}];`,
    };

    @node({
        id: 'a1400001-0001-4000-8000-000000000008',
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
        id: 'a1400001-0001-4000-8000-000000000009',
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
        id: 'a1400001-0001-4000-8000-00000000000a',
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
