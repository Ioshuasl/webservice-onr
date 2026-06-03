/** Converte XML de exportação ObterXMLSolicitacoes_v6 (ROOT/PEDIDO_CERTIDAO) para JSON snake_case. */

/** Desescapa conteúdo XML embutido na resposta SOAP (&lt; → <). Repete até estabilizar. */
export function decodeXmlEntities(texto) {
    let s = String(texto ?? '');
    let prev;
    do {
        prev = s;
        s = s
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&apos;/g, "'")
            .replace(/&amp;/g, '&');
    } while (s !== prev);
    return s;
}

export function tagParaSnake(tag) {
    return String(tag).toLowerCase();
}

export function extrairProximoElemento(xml, pos) {
    const start = xml.indexOf('<', pos);
    if (start < 0) return null;

    if (xml[start + 1] === '/' || xml[start + 1] === '?' || xml[start + 1] === '!') {
        const fim = xml.indexOf('>', start);
        return extrairProximoElemento(xml, fim >= 0 ? fim + 1 : xml.length);
    }

    const tagMatch = xml.slice(start).match(/^<([\w]+)(\s[^>]*)?>/);
    if (!tagMatch) return null;

    const tag = tagMatch[1];
    const selfClose = tagMatch[0].endsWith('/>');

    if (selfClose) {
        return { tag, inner: '', hasChildren: false, end: start + tagMatch[0].length };
    }

    const closeStr = `</${tag}>`;
    let depth = 0;
    let search = start;
    let endIdx = -1;

    while (search < xml.length) {
        const nextOpen = xml.indexOf(`<${tag}`, search);
        const nextClose = xml.indexOf(closeStr, search);
        if (nextClose < 0) break;

        let isOpen = false;
        if (nextOpen >= 0 && nextOpen < nextClose) {
            const afterTag = xml[nextOpen + tag.length + 1];
            if (afterTag !== '/') isOpen = true;
        }

        if (isOpen && (depth > 0 || nextOpen !== start)) {
            depth += 1;
            search = nextOpen + 1;
            continue;
        }

        if (depth > 0) {
            depth -= 1;
            search = nextClose + closeStr.length;
            continue;
        }

        endIdx = nextClose + closeStr.length;
        break;
    }

    if (endIdx < 0) return null;

    const chunk = xml.slice(start, endIdx);
    const innerMatch = chunk.match(new RegExp(`^<${tag}(?:\\s[^>]*)?>([\\s\\S]*)</${tag}>$`));
    const inner = innerMatch ? innerMatch[1] : '';
    const hasChildren = /<[\w]+/.test(inner);

    return { tag, inner, hasChildren, end: endIdx };
}

export function xmlBlocoParaObjeto(xml) {
    const resultado = {};
    let pos = 0;

    while (pos < xml.length) {
        const el = extrairProximoElemento(xml, pos);
        if (!el) break;

        const chave = tagParaSnake(el.tag);
        const valor = el.hasChildren ? xmlBlocoParaObjeto(el.inner) : el.inner.trim();

        if (resultado[chave] === undefined) {
            resultado[chave] = valor;
        } else if (!Array.isArray(resultado[chave])) {
            resultado[chave] = [resultado[chave], valor];
        } else {
            resultado[chave].push(valor);
        }

        pos = el.end;
    }

    return resultado;
}

/** @returns {{ pedidos_certidao: Record<string, unknown>[] } | null} */
export function parseXmlCertidaoExport(xmlExport) {
    if (!xmlExport || typeof xmlExport !== 'string') return null;

    const xml = decodeXmlEntities(xmlExport);
    const rootMatch = xml.match(/<ROOT>([\s\S]*)<\/ROOT>/i);
    const conteudo = rootMatch ? rootMatch[1] : xml;
    const pedidos = [];
    let pos = 0;

    while (pos < conteudo.length) {
        const el = extrairProximoElemento(conteudo, pos);
        if (!el) break;
        if (el.tag.toUpperCase() === 'PEDIDO_CERTIDAO') {
            pedidos.push(xmlBlocoParaObjeto(el.inner));
        }
        pos = el.end;
    }

    return { pedidos_certidao: pedidos };
}
