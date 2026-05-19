---
name: agent-webservice
description: >-
  Desenvolve scripts Python e JavaScript para webservices ONR (WSOficio): login,
  hash SHA-1, SOAP zeep/node-soap, .env e lib compartilhada. Use quando criar ou
  estender scripts em scripts/, integrar novos métodos de webservice/list-metodos.md,
  ou quando o usuário mencionar agent-webservice, WSOficio, ONR SOAP.
---

# Agent Webservice — ONR WSOficio

Agente desenvolvedor para scripts de integração SOAP. **Sempre** entregar par **Python + JavaScript** com a mesma semântica.

## Antes de codar

1. Ler [`webservice/metodos/<Operacao>.md`](../../webservice/metodos/) — parâmetros, WSDL, hash.
2. Ler [`webservice/hash.md`](../../webservice/hash.md) — `Hash = SHA1_UTF8_HEX_UPPER(chave + token)`.
3. Conferir operação no WSDL local em `wsdl/` — **ordem exata** dos elementos em `<Operacao>_WSReq` (ver [SOAP .NET](#soap-net--ordem-e-opcionais-cautela)).
4. Verificar se já existe script em `scripts/` ou helper em `lib/`.
5. Atualizar `.env.example` com novas variáveis (nunca commitar `.env` com segredos).

Lista completa (**81 métodos**, **10 módulos**): [`webservice/list-metodos.md`](../../webservice/list-metodos.md) · índice: [`webservice/metodos/README.md`](../../webservice/metodos/README.md).

## Mapa de módulos

| Cap. | Módulo | WSDL homologação | Prefixo `.env` | Scripts no projeto |
|------|--------|------------------|----------------|-------------------|
| 3.1 | Login | `login.asmx` | `ONR_*`, `CERT_*` | `login_onr` |
| 3.2 | Acompanhamento de Títulos | `acompanhamentotitulos.asmx` | `ACOMPANHAMENTO_TITULOS_*` | **9/9** (completo) |
| 3.3 | Penhora Online | `penhoraonline.asmx` · `wsdl/penhoraonline.wsdl` | `PENHORA_ONLINE_*` | `ListPedidosPO`…`SetPenhoraExigenciaPO`, `SetPedidoPessoaRespondidoPO` (10/16) |
| 3.4 | BD Light | `bdlight.asmx` | `BDLIGHT_*` | pendente |
| 3.5 | Ofícios | `oficios.asmx` | `OFICIOS_*` | pendente |
| 3.6 | **Certidões a Emitir** | `Certidoes.asmx` · `wsdl/certidoes.wsdl` | `CERTIDOES_*` | **pendente** (ver abaixo) |
| 3.9 | Matrícula Online | `matriculaonline.asmx` | `MATRICULA_ONLINE_*` | pendente |
| 3.10 | E-Protocolo | `eprotocolo.asmx` | `EPROTOCOLO_*` | pendente |
| 3.11 | Intimações | `intimacoes.asmx` | `INTIMACOES_*` | pendente |
| 3.12 | **Comunicação Prefeituras (CTP)** | `ComunicacaoMunicipios.asmx` · `wsdl/comunicacaoprefeituras.wsdl` | `COMUNICACAO_PREFEITURAS_*` | **pendente** |

**Não confundir:** `ObterXMLSolicitacoes_v4`–`v6` são do serviço **Certidões** (`Certidoes.asmx`, cap. 3.6). `ObterXMLSolicitacoes` e `ObterXMLSolicitacoesV2` são **Matrícula Online** (`matriculaonline.asmx`, cap. 3.9) — WSDL e filtros diferentes.

### 3.6 Certidões a Emitir — métodos prioritários

Documentados em [`webservice/metodos/`](../../webservice/metodos/) (gerados a partir da spec). Ainda **sem scripts** em `scripts/`:

| Método | Uso na spec |
|--------|-------------|
| `ObterXMLSolicitacoes_v4` | Exportar solicitações (XML) — filtros Hash, Protocolo, Solicitante, TipoCertidao, … |
| `ObterXMLSolicitacoes_v5` | Idem v5 (evolução de filtros) |
| `ObterXMLSolicitacoes_v6` | Idem v6 |
| `DevolverCertidao` | Marcar solicitação como devolvida |
| `EnviarAnexoCertidao` | Anexo (base64) ao protocolo |
| `EnviarAnexoCertidao_DocID` | Anexo via Assinador Web (DocID) |
| `EnviarAnexosListCertidao_DocID` | Lista de anexos DocID |
| `FinalizarRespostaCertidao` | Status “Respondido” após anexos |
| `EnviarAnexoCertidao_DocID_V2` | Anexo DocID (v2 — evolução do envelope) |
| `EnviarAnexosListCertidao_DocID_V2` | Lista de anexos DocID (v2) |
| `InformarCustasCertidao` | Informar custas da certidão |

Ao implementar Certidões: WSDL em `wsdl/certidoes.wsdl`, criar `lib/onr_certidoes.py` + `.js` (espelhar `onr_acompanhamento`), aplicar [cautela SOAP .NET](#soap-net--ordem-e-opcionais-cautela) em envelopes de escrita.

### 3.12 Comunicação Prefeituras (CTP) — métodos

WSDL local: `wsdl/comunicacaoprefeituras.wsdl` (serviço `ComunicacaoMunicipios` na homologação). Documentação em [`webservice/metodos/`](../../webservice/metodos/). **Sem scripts** ainda:

| Método | Uso na spec |
|--------|-------------|
| `ImportacaoArquivos` | Solicitar URL assinada para upload de arquivos CTP |
| `AtualizarStatusProcesso` | Consultar status do processo (`IdProcesso`) |

Ao implementar: `lib/onr_comunicacao_prefeituras.py` + `.js`, prefixo `COMUNICACAO_PREFEITURAS_*` em `.env.example`.

## Layout obrigatório

```
scripts/<PastaMetodo>/
  <nomeMetodo>.py    # zeep + lib/
  <nomeMetodo>.js    # soap + lib/
```

| Item | Convenção |
|------|-----------|
| Pasta | PascalCase alinhado ao método (`GetTituloAt`, `ListPedidosPO`) |
| Arquivo | camelCase (`getTituloAt.py`, `listPedidosPo.js`) |
| Docstring/comentário topo | Uma linha: o que o método SOAP faz |
| `ROOT` | `parents[2]` (Python) ou `../../lib/onr_env.js` → `ROOT` (JS) |

## Arquitetura (reutilizar `lib/`)

| Responsabilidade | Python | JavaScript |
|------------------|--------|------------|
| `.env` | `dotenv` + `lib/onr_env` | `dotenv` ou `onr_env.js` |
| Hash | `lib/onr_hash` | `lib/onr_hash.js` |
| Login / tokens | `lib/onr_login` | `lib/onr_login.js` |
| Chave + hash + config AT | `lib/onr_acompanhamento` | `lib/onr_acompanhamento.js` |
| Chamada SOAP | `lib/onr_soap.call_operation_from_cfg` | `soap.createClientAsync` + `*Async({ oRequest })` |
| JSON seguro | `lib/onr_json.to_json_safe` | `JSON.stringify` direto |
| Listas zeep | `lib/onr_zeep_serialize` | `normalizeResponse` + `serialize*List` local |
| Certificado (só login) | `lib/cert_extract` | `lib/cert_extract.js` |
| InsertTituloAT (ordem + opcionais vazios) | `lib/onr_insert_titulo_at` | `lib/onr_insert_titulo_at.js` |
| UpdateTituloAT (ordem + opcionais vazios) | `lib/onr_update_titulo_at` | `lib/onr_update_titulo_at.js` |
| InsertStatusAT (ordem WSDL) | `lib/onr_insert_status_at` | `lib/onr_insert_status_at.js` |
| UpdateStatusAT (ordem WSDL) | `lib/onr_update_status_at` | `lib/onr_update_status_at.js` |
| Penhora Online (config + hash) | `lib/onr_penhora_online` | `lib/onr_penhora_online.js` |

**Padrão preferido (JS):** usar `loadServentiaChave`, `loadLoginConfig`, `loadAcompanhamentoSoapConfig`, `resolveAuthHash`, `hashErrorHint` de `onr_acompanhamento.js` — como em `getTituloAt.js` e `listStatusAt.js`.

**Evitar:** duplicar login/hash inline (legado em `listTitulos.js`). Ao editar, migrar para `onr_acompanhamento.js`.

## Fluxo padrão (métodos com Hash)

```
load_config() → resolve_auth_hash(chave, login_cfg) → build_request(hash, …)
→ call SOAP → checar RETORNO → imprimir JSON → exit 0/1
```

**Login** (`LoginUsuarioCertificado`): sem `Hash`; `extract_from_pfx` → `build_login_request` → SOAP → exibir `Tokens`.

## SOAP .NET — ordem e opcionais (cautela)

O WSOficio roda em **ASP.NET** com deserialização frágil em vários métodos. **Não é regra global** (leituras costumam aceitar payload mínimo), mas **sempre verificar por operação** antes de assumir que `minOccurs="0"` permite omitir campos.

### 1. Ordem dos elementos no XML

- Montar `oRequest` na **mesma sequência** do tipo `<Operacao>_WSReq` no WSDL (`wsdl/*.wsdl`).
- Em Python: `dict` na ordem de inserção ou lista de tuplas → `dict`.
- Em JavaScript: `Object.fromEntries([...])` na ordem do WSDL (não confiar em ordem alfabética de chaves literais).
- **Sintoma se errar:** códigos enganosos (ex.: **50** “protocolo não numérico” no `InsertTituloAT` mesmo com protocolo válido).

### 2. Opcionais omitidos vs. vazios

| Situação | Abordagem |
|----------|-----------|
| Consultas simples (`GetTituloAT`, filtros pontuais em `ListTitulosAT`) | Omitir opcionais sem valor costuma funcionar |
| Envelopes grandes de escrita (`InsertTituloAT`, possivelmente `UpdateTituloAT`, `InsertStatusAT`, …) | **Testar** omitindo; se falhar com **código 0** + `IDMsg` ou erro estranho, enviar opcionais como **`""`** (string vazia), mantendo a ordem do WSDL |
| `InsertTituloAT` / `UpdateTituloAT` | Helpers `lib/onr_insert_titulo_at*` / `onr_update_titulo_at*` |
| `InsertStatusAT` / `UpdateStatusAT` | Helpers `lib/onr_insert_status_at*` / `onr_update_status_at*` |
| Certidões / outros writes | Testar omitindo; criar `lib/onr_*_request` com `FIELD_ORDER` do WSDL se necessário |

**Não generalizar** “enviar tudo vazio em todo método”. Reutilizar o padrão só após reproduzir o mesmo sintoma na homologação.

### 3. Checklist rápido ao implementar `build_request`

1. Abrir `wsdl/<servico>.wsdl` → localizar `<Operacao>_WSReq` → copiar a lista de elementos na ordem.
2. Implementar `build_request` respeitando essa ordem.
3. Decidir política de opcionais: omitir (padrão leve) **ou** `""` (padrão defensivo em inserts/updates).
4. Se resposta `RETORNO=false` com `CODIGOERRO=0` e `ERRODESCRICAO` contendo `IDMsg`, tentar incluir opcionais vazios antes de concluir bug de negócio.
5. Documentar em `webservice/metodos/<Operacao>.md` se o método exigir opcionais presentes.

Detalhes, sintomas e exemplos: [reference.md — SOAP .NET](reference.md#soap-net-deserialização-ordem-e-opcionais).

## Estrutura Python (template)

```python
#!/usr/bin/env python3
"""<descrição> (<Operacao>) no webservice <Módulo> da ONR."""

from __future__ import annotations
import json, sys
from pathlib import Path
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))

from lib.onr_acompanhamento import (
    hash_error_hint, load_acompanhamento_soap_config,
    load_login_config, load_serventia_chave, resolve_auth_hash,
)
from lib.onr_env import env_int, env_str
from lib.onr_json import to_json_safe
from lib.onr_soap import call_operation_from_cfg
# + serialize_* se resposta tiver listas

def load_config() -> dict: ...
def build_request(...) -> dict: ...

def main() -> int:
    cfg = load_config()
    hash_value = resolve_auth_hash(cfg["chave"], cfg["login_cfg"])
    o_request = build_request(cfg, hash_value)
    print("=== Parâmetros <Operacao> ===")
    print(json.dumps(o_request, ensure_ascii=False, indent=2))
    result = call_operation_from_cfg(cfg, "<Operacao>", o_request)
    # build_response + to_json_safe se necessário
    if not response.get("RETORNO"):
        # stderr + hash_error_hint(45)
        return 1
    print("\nOK — ...")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
```

- `o_request`: chaves **PascalCase** iguais ao WSDL (`Hash`, `IDTitulo`, …).
- Opcionais: omitir se vazio **só quando** o método já foi validado assim (ex.: `listTitulosAt.py`). Em inserts/updates complexos, preferir helper compartilhado ou enviar `""` — ver [SOAP .NET](#soap-net--ordem-e-opcionais-cautela).

## Estrutura JavaScript (template)

```javascript
/**
 * <descrição> (<Operacao>) no webservice <Módulo> da ONR.
 */
import fs from "node:fs";
import soap from "soap";
import { envInt, envStr, resolvePath } from "../../lib/onr_env.js";
import {
  hashErrorHint, loadAcompanhamentoSoapConfig, loadLoginConfig,
  loadServentiaChave, resolveAuthHash,
} from "../../lib/onr_acompanhamento.js";

async function callOperacao(cfg, oRequest) {
  const wsdlPath = resolvePath(cfg.wsdlPath);
  if (!fs.existsSync(wsdlPath)) throw new Error(`WSDL não encontrado: ${wsdlPath}`);
  const client = await soap.createClientAsync(wsdlPath, {
    endpoint: cfg.endpoint,
    forceSoap12Headers: false,
    wsdl_options: { timeout: 60000 },
  });
  try {
    const [response] = await client.<Operacao>Async({ oRequest });
    return response?.<Operacao>Result ?? response?.<Operacao>Response?.<Operacao>Result ?? response;
  } catch (err) {
    // HTTP 503 / corpo não-XML → mensagem amigável (ver getTituloAt.js)
    throw err;
  }
}
```

- `main().catch` → `process.exit(1)`.
- Mesmas seções de log que Python.

## Variáveis `.env`

| Escopo | Variáveis |
|--------|-----------|
| Global | `ONR_SERVENTIA_CHAVE`, `ONR_HASH_TOKEN_INDEX`, `ONR_HASH_OVERRIDE`, `CERT_*`, `CPF`, `EMAIL`, `ONR_SERVENTIA_ID`, `ONR_WSDL_LOGIN_PATH`, `ONR_LOGIN_ENDPOINT` |
| Acompanhamento AT | `ACOMPANHAMENTO_TITULOS_*`, `ACOMPANHAMENTO_TITULOS_AUTO_LOGIN` |
| Certidões | `CERTIDOES_*` (ex.: `CERTIDOES_WSDL_PATH`, `CERTIDOES_ENDPOINT`, `CERTIDOES_AUTO_LOGIN`) |
| Comunicação Prefeituras | `COMUNICACAO_PREFEITURAS_*` (WSDL: `wsdl/comunicacaoprefeituras.wsdl`, endpoint `ComunicacaoMunicipios.asmx`) |
| Outros módulos | `PENHORA_ONLINE_*`, `OFICIOS_*`, `MATRICULA_ONLINE_*`, `EPROTOCOLO_*`, `INTIMACOES_*`, `BDLIGHT_*` |
| Novo módulo | Prefixo por serviço + `lib/onr_<modulo>.py` e `.js` espelhando `onr_acompanhamento` |

Documentar novas chaves em `.env.example` com comentário.

## Novo módulo (não é Acompanhamento de Títulos)

Exemplos: **Certidões** (`Certidoes.asmx`), **Comunicação Prefeituras** (`ComunicacaoMunicipios.asmx` → `wsdl/comunicacaoprefeituras.wsdl`), Penhora, E-Protocolo.

1. Baixar/copiar WSDL de homologação → `wsdl/<servico>.wsdl` (ex.: `wsdl/certidoes.wsdl`, `wsdl/comunicacaoprefeituras.wsdl`).
2. Criar `lib/onr_<servico>.py` + `.js` com `load_*_soap_config()` e reutilizar `resolve_auth_hash` (login global ou `CERTIDOES_AUTO_LOGIN` + mesmas credenciais).
3. Scripts em `scripts/<PastaMetodo>/` (par `.py` + `.js`).
4. Documentação em `webservice/metodos/<Operacao>.md` — regenerar com `py webservice/generate_metodos.py` se o método já estiver em `list-metodos.md`.
5. Atualizar [mapa de módulos](#mapa-de-módulos) e `webservice/metodos/README.md` se necessário.

## Checklist de entrega

- [ ] `.py` e `.js` criados/atualizados
- [ ] Parâmetros conforme `webservice/metodos/<Operacao>.md`
- [ ] `oRequest` na **ordem do WSDL** (`<Operacao>_WSReq`)
- [ ] Política de opcionais definida (omitir vs. `""`) e testada na homologação
- [ ] Se insert/update AT: usar helpers `onr_insert_*` / `onr_update_*` existentes ou novo helper por operação
- [ ] Novo módulo (ex. Certidões): `lib/onr_<modulo>*` + entrada no [mapa de módulos](#mapa-de-módulos)
- [ ] `Hash` em todos os métodos exceto login
- [ ] Tratamento `RETORNO` / `CODIGOERRO` / `ERRODESCRICAO` (+ dica se `CODIGOERRO=0` com `IDMsg`)
- [ ] `hash_error_hint` para código 45
- [ ] `.env.example` atualizado
- [ ] `package.json` → script npm opcional (`"operacao": "node scripts/..."`)
- [ ] Atualizar link em `webservice/metodos/<Operacao>.md` → seção Implementação (+ nota de integração SOAP se aplicável)

## Referência detalhada

- Módulos WSDL, libs, exemplos: [reference.md](reference.md)
- Hash: [webservice/hash.md](../../webservice/hash.md)
