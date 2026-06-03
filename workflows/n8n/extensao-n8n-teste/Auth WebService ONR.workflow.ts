import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : [AUTONR-2] (webservice ONR) LoginUsuarioCertificado - Autenticação
// Nodes   : 9  |  Connections: 10
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// NormalizarEntrada                  set
// ValidarCpf                         code
// IfCpfValido                        if
// ConverterRespostaOnr               code
// RespostaCpfInvalido                code
// RespostaErroConexaoOnr             code
// Webhook1                           webhook                    [creds]
// AuthOnr1                           httpRequest                [onError→out(1)]
// RespondToWebhook1                  respondToWebhook
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// Webhook1
//    → NormalizarEntrada
//      → ValidarCpf
//        → IfCpfValido
//          → AuthOnr1
//            → ConverterRespostaOnr
//              → RespondToWebhook1
//            → RespostaErroConexaoOnr
//              → RespondToWebhook1 (↩ loop)
//         .out(1) → RespostaCpfInvalido
//            → RespondToWebhook1 (↩ loop)
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'BsrV8WFHGbwugwrm',
    name: '[AUTONR-2] (webservice ONR) LoginUsuarioCertificado - Autenticação',
    active: false,
    isArchived: false,
    settings: {
        executionOrder: 'v1',
        binaryMode: 'separate',
        availableInMCP: false,
        callerPolicy: 'workflowsFromSameOwner',
    },
})
export class Autonr2WebserviceOnrLoginusuariocertificadoAutenticacaoWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: '49b0fce4-daa5-4913-8b4c-2ccdaf4d9a5e',
        name: 'normalizar-entrada',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [-576, 512],
    })
    NormalizarEntrada = {
        mode: 'raw',
        jsonOutput: `={
  "assunto_certificado": "{{ $json.body.assunto_certificado }}",
  "emissor_certificado": "{{ $json.body.emissor_certificado }}",
  "chave_publica": "{{ $json.body.chave_publica }}",
  "numero_serie_certificado": "{{ $json.body.numero_serie_certificado }}",
  "validade_certificado": "{{ $json.body.validade_certificado }}",
  "cpf": "{{ $json.body.cpf }}",
  "email": "{{ $json.body.email }}",
  "id_parceiro_ws": {{ $json.body.id_parceiro_ws }},
  "url_login_onr": "{{ $json.body.url_login_onr }}",
  "chave_serventia": "{{ $json.body.chave_serventia ?? $json.body.onr_serventia_chave ?? '' }}"
}
 `,
        options: {},
    };

    @node({
        id: '5f79d6a5-4e7d-40f4-a65c-c2d1abfdf019',
        name: 'validar-cpf',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [-256, 512],
    })
    ValidarCpf = {
        jsCode: `const item = $input.first().json;

function normalizarCpf(valor) {
    return String(valor ?? '').replace(/\\D/g, '');
}

function cpfValido(cpf) {
    if (cpf.length !== 11) return false;
    if (/^(\\d)\\1{10}$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf[i], 10) * (10 - i);
    }
    let digito1 = (soma * 10) % 11;
    if (digito1 === 10) digito1 = 0;
    if (digito1 !== parseInt(cpf[9], 10)) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf[i], 10) * (11 - i);
    }
    let digito2 = (soma * 10) % 11;
    if (digito2 === 10) digito2 = 0;
    if (digito2 !== parseInt(cpf[10], 10)) return false;

    return true;
}

const cpf = normalizarCpf(item.cpf);
let cpf_valido = false;
let codigo_erro = 15;
let mensagem_erro = 'O CPF não foi informado.';

if (!cpf) {
    cpf_valido = false;
} else if (!cpfValido(cpf)) {
    cpf_valido = false;
    codigo_erro = 2;
    mensagem_erro = 'CPF inválido: informe 11 dígitos com dígitos verificadores corretos.';
} else {
    cpf_valido = true;
    codigo_erro = 0;
    mensagem_erro = '';
}

return [{
    json: {
        ...item,
        cpf,
        cpf_valido,
        codigo_erro,
        mensagem_erro
    }
}];`,
    };

    @node({
        id: '24049e4d-75b4-4b5e-a5b0-17bdd8b69fac',
        name: 'if-cpf-valido',
        type: 'n8n-nodes-base.if',
        version: 2.2,
        position: [64, 512],
    })
    IfCpfValido = {
        conditions: {
            options: {
                caseSensitive: true,
                leftValue: '',
                typeValidation: 'strict',
                version: 2,
            },
            conditions: [
                {
                    id: 'c0e5a3b4-6d7f-8091-0123-456789012345',
                    leftValue: '={{ $json.cpf_valido }}',
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
        id: 'ec50f10c-1e5a-4d0f-9bd5-6fa81eb41159',
        name: 'converter-resposta-onr',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [704, 384],
    })
    ConverterRespostaOnr = {
        jsCode: `const entrada = $input.first().json;
const xml = entrada.data;

function mapearStatusHttp(sucesso, codigoErro, origem = 'onr') {
    if (sucesso) return 200;
    if (origem === 'validacao') return 400;
    if ([2, 10, 11, 12, 13, 14, 15, 16, 17].includes(codigoErro)) return 400;
    if (codigoErro === 51) return 404;
    if (codigoErro === 52 || codigoErro === 53) return 403;
    if (codigoErro === 0) return 502;
    if (codigoErro === 1) return 503;
    return 422;
}

function respostaErro(statusHttp, codigoErro, mensagemErro) {
    return {
        status_http: statusHttp,
        sucesso: false,
        codigo_erro: codigoErro,
        mensagem_erro: mensagemErro,
        id_usuario: 0,
        id_instituicao: 0,
        usuario_ativo: false,
        tokens: [],
        hashes: [],
        hash: ''
    };
}

/** SHA-1 FIPS 180-1 (ASCII/Latin-1). OK para chave UUID + token ONR (sem require('crypto')). */
function sha1HexUpperAscii(message) {
    let h0 = 0x67452301;
    let h1 = 0xefcdab89;
    let h2 = 0x98badcfe;
    let h3 = 0x10325476;
    let h4 = 0xc3d2e1f0;
    const block = new Uint32Array(80);
    let offset = 0;
    let shift = 24;
    let totalLength = 0;

    function write(byte) {
        block[offset] |= (byte & 0xff) << shift;
        if (shift) {
            shift -= 8;
        } else {
            offset++;
            shift = 24;
        }
        if (offset === 16) processBlock();
    }

    function processBlock() {
        for (let i = 16; i < 80; i++) {
            const w = block[i - 3] ^ block[i - 8] ^ block[i - 14] ^ block[i - 16];
            block[i] = (w << 1) | (w >>> 31);
        }
        let a = h0;
        let b = h1;
        let c = h2;
        let d = h3;
        let e = h4;
        for (let i = 0; i < 80; i++) {
            let f;
            let k;
            if (i < 20) {
                f = d ^ (b & (c ^ d));
                k = 0x5a827999;
            } else if (i < 40) {
                f = b ^ c ^ d;
                k = 0x6ed9eba1;
            } else if (i < 60) {
                f = (b & c) | (d & (b | c));
                k = 0x8f1bbcdc;
            } else {
                f = b ^ c ^ d;
                k = 0xca62c1d6;
            }
            const temp = (a << 5 | a >>> 27) + f + e + k + (block[i] | 0);
            e = d;
            d = c;
            c = b << 30 | b >>> 2;
            b = a;
            a = temp;
        }
        h0 = (h0 + a) | 0;
        h1 = (h1 + b) | 0;
        h2 = (h2 + c) | 0;
        h3 = (h3 + d) | 0;
        h4 = (h4 + e) | 0;
        offset = 0;
        for (let i = 0; i < 16; i++) block[i] = 0;
    }

    function toHex(word) {
        let hex = '';
        for (let i = 28; i >= 0; i -= 4) {
            hex += ((word >> i) & 0xf).toString(16);
        }
        return hex;
    }

    const text = String(message);
    totalLength = text.length * 8;
    for (let i = 0; i < text.length; i++) {
        write(text.charCodeAt(i));
    }

    write(0x80);
    if (offset > 14 || (offset === 14 && shift < 24)) {
        processBlock();
    }
    offset = 14;
    shift = 24;
    write(0x00);
    write(0x00);
    write(totalLength > 0xffffffffff ? totalLength / 0x10000000000 : 0x00);
    write(totalLength > 0xffffffff ? totalLength / 0x100000000 : 0x00);
    for (let s = 24; s >= 0; s -= 8) {
        write(totalLength >> s);
    }

    return (toHex(h0) + toHex(h1) + toHex(h2) + toHex(h3) + toHex(h4)).toUpperCase();
}

function computeOnrAuthHash(chave, token) {
    return sha1HexUpperAscii(String(chave) + String(token));
}

function resolverChaveServentia() {
    const ctx = $('validar-cpf').first().json;
    const doBody = String(ctx.chave_serventia ?? '').trim();
    if (doBody) return doBody;
    return String($env.ONR_SERVENTIA_CHAVE ?? '').trim();
}

function hashesDosTokens(tokens, chave) {
    if (!chave || !tokens.length) return [];
    return tokens.map((token) => computeOnrAuthHash(chave, token));
}

if (!xml || typeof xml !== 'string') {
    return {
        json: respostaErro(
            502,
            0,
            'Resposta inválida da ONR: XML não encontrado.'
        )
    };
}

const extrairTag = (tag, origem) => {
    const regex = new RegExp(\`<\${tag}>(.*?)</\${tag}>\`, 's');
    const match = origem.match(regex);
    return match ? match[1].trim() : '';
};

const extrairTokens = (origem) => {
    const secaoTokens = extrairTag('Tokens', origem);
    const regexToken = /<string>(.*?)<\\/string>/g;
    const tokens = [];
    let match;

    while ((match = regexToken.exec(secaoTokens)) !== null) {
        tokens.push(match[1]);
    }
    return tokens;
};

const sucesso = extrairTag('RETORNO', xml) === 'true';
const codigo_erro = parseInt(extrairTag('CODIGOERRO', xml) || '0', 10);
const mensagem_erro = extrairTag('ERRODESCRICAO', xml);
const tokens = extrairTokens(xml);
const chave = resolverChaveServentia();
const hashes = sucesso ? hashesDosTokens(tokens, chave) : [];

return {
    json: {
        status_http: mapearStatusHttp(sucesso, codigo_erro, 'onr'),
        sucesso,
        codigo_erro,
        mensagem_erro,
        id_usuario: parseInt(extrairTag('IDUsuario', xml), 10) || 0,
        id_instituicao: parseInt(extrairTag('IDInstituicao', xml), 10) || 0,
        usuario_ativo: extrairTag('Ativo', xml) === 'true',
        tokens,
        hashes,
        hash: hashes[0] ?? '',
        hash_versao: 'sha1-fips-ascii-1'
    }
};`,
    };

    @node({
        id: '7a3917a2-cd6b-44c2-92e4-fed1d69ce9d0',
        name: 'resposta-cpf-invalido',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [384, 640],
    })
    RespostaCpfInvalido = {
        jsCode: `const item = $input.first().json;

return [{
    json: {
        status_http: 422,
        sucesso: false,
        codigo_erro: item.codigo_erro,
        mensagem_erro: item.mensagem_erro,
        id_usuario: 0,
        id_instituicao: 0,
        usuario_ativo: false,
        tokens: [],
        hashes: [],
        hash: ''
    }
}];`,
    };

    @node({
        id: 'edbd2b89-51ab-45f3-91fa-071e82c7bfcc',
        name: 'resposta-erro-conexao-onr',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [704, 640],
    })
    RespostaErroConexaoOnr = {
        jsCode: `const erro = $input.first().json;
const mensagem = erro.error?.message || erro.message || 'Falha ao conectar com a ONR.';

return [{
    json: {
        status_http: 502,
        sucesso: false,
        codigo_erro: 0,
        mensagem_erro: mensagem,
        id_usuario: 0,
        id_instituicao: 0,
        usuario_ativo: false,
        tokens: [],
        hashes: [],
        hash: ''
    }
}];`,
    };

    @node({
        id: '328a2f36-d351-4885-99f3-e7ec6c4f62e4',
        webhookId: '163d6b2d-36fa-4c1c-bb1b-ed6085de7de2',
        name: 'Webhook1',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [-912, 512],
        credentials: { httpBasicAuth: { id: 'zyTOdADUUemJkEzk', name: 'orius - master@orius' } },
    })
    Webhook1 = {
        httpMethod: 'POST',
        path: '163d6b2d-36fa-4c1c-bb1b-ed6085de7de2',
        authentication: 'basicAuth',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: '86bf2759-5753-4499-96a6-ffc0688e154f',
        name: 'auth-onr1',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [384, 384],
        onError: 'continueErrorOutput',
    })
    AuthOnr1 = {
        method: 'POST',
        url: '={{ $json.url_login_onr }}',
        sendBody: true,
        contentType: 'raw',
        rawContentType: 'text/xml',
        body: `=<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <tns:LoginUsuarioCertificado xmlns:tns="http://tempuri.org/WSOficio">
      <tns:oRequest>
        <tns:SUBJECTCN>{{ $json.assunto_certificado }}</tns:SUBJECTCN>
        <tns:ISSUERO>{{ $json.emissor_certificado }}</tns:ISSUERO>
        <tns:PUBLICKEY>{{ $json.chave_publica }}</tns:PUBLICKEY>
        <tns:SERIALNUMBER>{{ $json.numero_serie_certificado }}</tns:SERIALNUMBER>
        <tns:VALIDUNTIL>{{ $json.validade_certificado }}</tns:VALIDUNTIL>
        <tns:CPF>{{ $json.cpf }}</tns:CPF>
        <tns:EMAIL>{{ $json.email }}</tns:EMAIL>
        <tns:IDParceiroWS>{{ $json.id_parceiro_ws }}</tns:IDParceiroWS>
      </tns:oRequest>
    </tns:LoginUsuarioCertificado>
  </soap:Body>
</soap:Envelope>`,
        options: {},
    };

    @node({
        id: '50c0a2ff-848f-4f36-b4dc-2fa096019b75',
        name: 'Respond to Webhook1',
        type: 'n8n-nodes-base.respondToWebhook',
        version: 1.5,
        position: [1024, 512],
    })
    RespondToWebhook1 = {
        options: {
            responseCode: '={{ $json.status_http }}',
        },
    };

    // =====================================================================
    // ROUTAGE ET CONNEXIONS
    // =====================================================================

    @links()
    defineRouting() {
        this.NormalizarEntrada.out(0).to(this.ValidarCpf.in(0));
        this.ValidarCpf.out(0).to(this.IfCpfValido.in(0));
        this.IfCpfValido.out(0).to(this.AuthOnr1.in(0));
        this.IfCpfValido.out(1).to(this.RespostaCpfInvalido.in(0));
        this.ConverterRespostaOnr.out(0).to(this.RespondToWebhook1.in(0));
        this.RespostaCpfInvalido.out(0).to(this.RespondToWebhook1.in(0));
        this.RespostaErroConexaoOnr.out(0).to(this.RespondToWebhook1.in(0));
        this.Webhook1.out(0).to(this.NormalizarEntrada.in(0));
        this.AuthOnr1.out(0).to(this.ConverterRespostaOnr.in(0));
        this.AuthOnr1.out(0).to(this.RespostaErroConexaoOnr.in(0));
    }
}
