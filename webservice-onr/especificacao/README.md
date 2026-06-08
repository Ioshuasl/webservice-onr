# Especificação WSOficio por domínio

Documentação dividida a partir de [`especificacao_wsoficio_dev.md`](../especificacao_wsoficio_dev.md).

| Domínio | Arquivo | Seção |
| --- | --- | --- |
| Autenticação | [autenticacao.md](autenticacao.md) | 1, 2, 3.1 |
| Acompanhamento de Títulos (AT) | [acompanhamento-titulos-at.md](acompanhamento-titulos-at.md) | 3.2 |
| Penhora Online (PO) | [penhora-online-po.md](penhora-online-po.md) | 3.3 |
| Banco de Dados Light (BDL) | [bdlight-bdl.md](bdlight-bdl.md) | 3.4, Anexo 4.1 |
| Ofício Eletrônico (OE) | [oficio-eletronico-oe.md](oficio-eletronico-oe.md) | 3.5 |
| Certidões | [certidoes.md](certidoes.md) | 3.6 |
| CTP / Consulta Eletrônica | [ctp.md](ctp.md) | 3.7, 3.8 |
| Matrícula Online | [matricula.md](matricula.md) | 3.9 |
| E-Protocolo (AC) | [e-protocolo-ac.md](e-protocolo-ac.md) | 3.10 |
| Intimações (IN) | [intimacoes-in.md](intimacoes-in.md) | 3.11 |

## Não incluído nesta divisão

- **3.12 Comunicação Prefeituras** — permanece apenas no arquivo monolítico (`ImportacaoArquivos`, `AtualizarStatusProcesso`). Métodos em [`metodos/`](../metodos/).
- **Sumário (páginas 9–12)** — índice do PDF original; consultar o arquivo monolítico.

## Relacionados

- [`list-metodos.md`](../list-metodos.md) — índice de métodos por módulo
- [`hash.md`](../hash.md) — autenticação hash SHA-1
- [`metodos/`](../metodos/) — um arquivo por operação SOAP
- **Obsidian vault:** `Orius/integracoes/registro-imoveis/onr/webservice-wsoficio/especificacao/` — sincronizar com `node webservice-onr/scripts/sync-especificacao-to-vault.cjs`
