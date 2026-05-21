# Referência — Agent Webservice

## Scripts existentes (padrão de referência)

| Método | Python | JavaScript | Observação |
|--------|--------|------------|------------|
| LoginUsuarioCertificado | `scripts/login/login_onr.py` | `scripts/login/login_onr.js` | Sem hash; certificado PFX |
| ListTitulosAT | `scripts/ListTitulosAt/listTitulosAt.py` | `scripts/ListTitulosAt/listTitulos.js` | JS legado — preferir refatorar para `onr_acompanhamento.js` |
| GetTituloAT | `scripts/GetTituloAt/getTituloAt.py` | `scripts/GetTituloAt/getTituloAt.js` | **Modelo JS atual** |
| GetStatusAT | `scripts/GetStatusAt/getStatusAt.py` | `scripts/GetStatusAt/getStatusAt.js` | `ACOMPANHAMENTO_TITULOS_ID_STATUS` |
| InsertTituloAT | `scripts/InsertTituloAt/insertTituloAt.py` | `scripts/InsertTituloAt/insertTituloAt.js` | Usa `lib/onr_insert_titulo_at*` — ordem WSDL + opcionais `""` |
| UpdateTituloAT | `scripts/UpdateTituloAt/updateTituloAt.py` | `scripts/UpdateTituloAt/updateTituloAt.js` | `ACOMPANHAMENTO_TITULOS_UPDATE_*` · `lib/onr_update_titulo_at*` |
| DeleteTituloAT | `scripts/DeleteTituloAt/deleteTituloAt.py` | `scripts/DeleteTituloAt/deleteTituloAt.js` | `DELETE_ID_TITULO` ou `ID_TITULO` |
| InsertStatusAT | `scripts/InsertStatusAt/insertStatusAt.py` | `scripts/InsertStatusAt/insertStatusAt.js` | `INSERT_STATUS_*` · `lib/onr_insert_status_at*` |
| UpdateStatusAT | `scripts/UpdateStatusAt/updateStatusAt.py` | `scripts/UpdateStatusAt/updateStatusAt.js` | `UPDATE_STATUS_*` · `lib/onr_update_status_at*` |
| ListStatusAT | `scripts/ListStatusAT/listStatusAt.py` | `scripts/ListStatusAT/listStatusAt.js` | Listas aninhadas |
| ListPedidosPO | `scripts/ListPedidosPo/listPedidosPo.py` | `scripts/ListPedidosPo/listPedidosPo.js` | Penhora Online · `lib/onr_penhora_online*` |
| ListPedidosExportacaoPO | `scripts/ListPedidosExportacaoPo/listPedidosExportacaoPo.py` | `scripts/ListPedidosExportacaoPo/listPedidosExportacaoPo.js` | `PENHORA_ONLINE_DATA_SOLICITACAO_*`, filtros |
| ListPedidosExportacaoPO_v2 | `scripts/ListPedidosExportacaoPo_v2/listPedidosExportacaoPo_v2.py` | `scripts/ListPedidosExportacaoPo_v2/listPedidosExportacaoPo_v2.js` | Idem v1; + `ValorDaDivida`, percentuais em `Imovel` |
| ListVarasPO | `scripts/ListVarasPo/listVarasPo.py` | `scripts/ListVarasPo/listVarasPo.js` | Filtros `PENHORA_ONLINE_ID_ESTADO/COMARCA/FORO` |
| GetPedidoPO | `scripts/GetPedidoPo/getPedidoPo.py` | `scripts/GetPedidoPo/getPedidoPo.js` | `PENHORA_ONLINE_ID_PEDIDO` |
| ListBoletosPO | `scripts/ListBoletosPo/listBoletosPo.py` | `scripts/ListBoletosPo/listBoletosPo.js` | `PENHORA_ONLINE_ID_PROCESSO` |
| SetBaixaBoletoPO | `scripts/SetBaixaBoletoPo/setBaixaBoletoPo.py` | `scripts/SetBaixaBoletoPo/setBaixaBoletoPo.js` | `PENHORA_ONLINE_SET_BAIXA_ID_BOLETO` / `ID_BOLETO` |
| SetPrenotacaoPO | `scripts/SetPrenotacaoPo/setPrenotacaoPo.py` | `scripts/SetPrenotacaoPo/setPrenotacaoPo.js` | `PENHORA_ONLINE_SET_PRENOTACAO_*` |
| SetCustasPO | `scripts/SetCustasPo/setCustasPo.py` | `scripts/SetCustasPo/setCustasPo.js` | `PENHORA_ONLINE_SET_CUSTAS_VALOR`, `ID_PEDIDO` |
| SetPenhoraAverbadoPO | `scripts/SetPenhoraAverbadoPo/setPenhoraAverbadoPo.py` | `scripts/SetPenhoraAverbadoPo/setPenhoraAverbadoPo.js` | `PENHORA_ONLINE_SET_PENHORA_AVERBADO_*`, `CERTIDOES_JSON` |
| SetPenhoraExigenciaPO | `scripts/SetPenhoraExigenciaPo/setPenhoraExigenciaPo.py` | `scripts/SetPenhoraExigenciaPo/setPenhoraExigenciaPo.js` | `PENHORA_ONLINE_SET_PENHORA_EXIGENCIA_*`, `ANEXOS_JSON` |
| SetPedidoPessoaRespondidoPO | `scripts/SetPedidoPessoaRespondidoPo/setPedidoPessoaRespondidoPo.py` | `scripts/SetPedidoPessoaRespondidoPo/setPedidoPessoaRespondidoPo.js` | `PENHORA_ONLINE_SET_PEDIDO_PESSOA_RESPONDIDO_*`, `ANEXOS_JSON` |
| SetPedidoPessoaDevolvidoPO | `scripts/SetPedidoPessoaDevolvidoPo/setPedidoPessoaDevolvidoPo.py` | `scripts/SetPedidoPessoaDevolvidoPo/setPedidoPessoaDevolvidoPo.js` | `PENHORA_ONLINE_SET_PEDIDO_PESSOA_DEVOLVIDO_*` |
| SetPedidoMatriculaRespondidoPO | `scripts/SetPedidoMatriculaRespondidoPo/setPedidoMatriculaRespondidoPo.py` | `scripts/SetPedidoMatriculaRespondidoPo/setPedidoMatriculaRespondidoPo.js` | `PENHORA_ONLINE_SET_PEDIDO_MATRICULA_RESPONDIDO_*`, `ANEXOS_JSON` |
| SetPedidoMatriculaDevolvidoPO | `scripts/SetPedidoMatriculaDevolvidoPo/setPedidoMatriculaDevolvidoPo.py` | `scripts/SetPedidoMatriculaDevolvidoPo/setPedidoMatriculaDevolvidoPo.js` | `PENHORA_ONLINE_SET_PEDIDO_MATRICULA_DEVOLVIDO_*` |
| SetPedidoNegativaLotePO | `scripts/SetPedidoNegativaLotePo/setPedidoNegativaLotePo.py` | `scripts/SetPedidoNegativaLotePo/setPedidoNegativaLotePo.js` | `PENHORA_ONLINE_SET_PEDIDO_NEGATIVA_LOTE_*`, `PEDIDOS_JSON` |
| SetPedidoFinalizarPrenotacaoVencida | `scripts/SetPedidoFinalizarPrenotacaoVencida/setPedidoFinalizarPrenotacaoVencida.py` | `scripts/SetPedidoFinalizarPrenotacaoVencida/setPedidoFinalizarPrenotacaoVencida.js` | `PENHORA_ONLINE_SET_FINALIZAR_PRENOTACAO_VENCIDA_*`, `ANEXOS_JSON` |

## WSDL ↔ módulo ↔ env

| Módulo | WSDL local | Endpoint homologação (padrão) | Prefixo `.env` sugerido |
|--------|------------|-------------------------------|-------------------------|
| Login | `wsdl/login.wsdl` | `https://hml3-wsoficio.onr.org.br/login.asmx` | `ONR_*`, `CERT_*` |
| Acompanhamento Títulos | `wsdl/acompanhamentotitulos.wsdl` | `.../acompanhamentotitulos.asmx` | `ACOMPANHAMENTO_TITULOS_*` |
| Penhora Online | `wsdl/penhoraonline.wsdl` | `.../penhoraonline.asmx` | `PENHORA_ONLINE_*` |
| ListArquivosXMLBDL | `scripts/ListArquivosXmlBdl/listArquivosXmlBdl.py` | `scripts/ListArquivosXmlBdl/listArquivosXmlBdl.js` | `BDLIGHT_*`, `DATA_INICIAL`/`FINAL` |
| GetArquivoXMLBDL | `scripts/GetArquivoXmlBdl/getArquivoXmlBdl.py` | `scripts/GetArquivoXmlBdl/getArquivoXmlBdl.js` | `BDLIGHT_ID_ARQUIVO` |
| ImportarArquivoBDL | `scripts/ImportarArquivoBdl/importarArquivoBdl.py` | `scripts/ImportarArquivoBdl/importarArquivoBdl.js` | `BDLIGHT_IMPORTAR_URL_*`, `XML_PATH`, `VALIDAR_XML` |
| SetBDLightAtualizado | `scripts/SetBdlightAtualizado/setBdlightAtualizado.py` | `scripts/SetBdlightAtualizado/setBdlightAtualizado.js` | `BDLIGHT_*` (somente Hash) |
| ListInstituicoesOE | `scripts/ListInstituicoesOe/listInstituicoesOe.py` | `scripts/ListInstituicoesOe/listInstituicoesOe.js` | `OFICIOS_*` |
| GetPedidoOE | `scripts/GetPedidoOe/getPedidoOe.py` | `scripts/GetPedidoOe/getPedidoOe.js` | `OFICIOS_ID_PEDIDO` |
| ListPedidosOE_V2 | `scripts/ListPedidosOe_v2/listPedidosOe_v2.py` | `scripts/ListPedidosOe_v2/listPedidosOe_v2.js` | `OFICIOS_DATA_SOLICITACAO_*`, filtros |
| SetPedidoRespondidoOE | `scripts/SetPedidoRespondidoOe/setPedidoRespondidoOe.py` | `scripts/SetPedidoRespondidoOe/setPedidoRespondidoOe.js` | `OFICIOS_SET_PEDIDO_RESPONDIDO_*` |
| SetPedidoDevolvidoOE | `scripts/SetPedidoDevolvidoOe/setPedidoDevolvidoOe.py` | `scripts/SetPedidoDevolvidoOe/setPedidoDevolvidoOe.js` | `OFICIOS_SET_PEDIDO_DEVOLVIDO_*` |
| SetPedidoNegativaLoteOE | `scripts/SetPedidoNegativaLoteOe/setPedidoNegativaLoteOe.py` | `scripts/SetPedidoNegativaLoteOe/setPedidoNegativaLoteOe.js` | `OFICIOS_SET_PEDIDO_NEGATIVA_LOTE_*` |
| SetPedidoRetransmitidoOE | `scripts/SetPedidoRetransmitidoOe/setPedidoRetransmitidoOe.py` | `scripts/SetPedidoRetransmitidoOe/setPedidoRetransmitidoOe.js` | `OFICIOS_SET_PEDIDO_RETRANSMITIDO_*` |
| ListCartoriosRestransmitirOE | `scripts/ListCartoriosRestransmitirOe/listCartoriosRestransmitirOe.py` | `scripts/ListCartoriosRestransmitirOe/listCartoriosRestransmitirOe.js` | `ONR_*`, `OFICIOS_*` (somente Hash) |
| Ofícios (outros) | `wsdl/oficios.wsdl` | `.../oficios.asmx` | `ListPedidosOE`, `SetPedidoRespondidoOE_DocID` |
| ObterXMLSolicitacoes_v6 | `scripts/ObterXmlSolicitacoes_v6/obterXmlSolicitacoes_v6.py` | `scripts/ObterXmlSolicitacoes_v6/obterXmlSolicitacoes_v6.js` | `CERTIDOES_OBTER_XML_V6_*` |
| DevolverCertidao | `scripts/DevolverCertidao/devolverCertidao.py` | `scripts/DevolverCertidao/devolverCertidao.js` | `CERTIDOES_DEVOLVER_CERTIDAO_*`, `CERTIDOES_PROTOCOLO` |
| EnviarAnexoCertidao | `scripts/EnviarAnexoCertidao/enviarAnexoCertidao.py` | `scripts/EnviarAnexoCertidao/enviarAnexoCertidao.js` | `CERTIDOES_ENVIAR_ANEXO_*` |
| Certidões (outros) | `wsdl/certidoes.wsdl` | `.../Certidoes.asmx` | `FinalizarRespostaCertidao`, `InformarCustasCertidao`, … |
| Comunicação Prefeituras (CTP) | `wsdl/comunicacaoprefeituras.wsdl` | `.../ComunicacaoMunicipios.asmx` | `COMUNICACAO_PREFEITURAS_*` |
| Matrícula Online | `wsdl/matriculaonline.wsdl` | `.../matriculaonline.asmx` | `MATRICULA_ONLINE_*` |
| E-Protocolo | `wsdl/eprotocolo.wsdl` | `.../eprotocolo.asmx` | `EPROTOCOLO_*` |
| Intimações | `wsdl/intimacoes.wsdl` | `.../intimacoes.asmx` | `INTIMACOES_*` |

## SOAP — detalhes técnicos

### Envelope de entrada

Todas as operações (exceto login) recebem um único parâmetro **`oRequest`** (elemento XML com filhos PascalCase).

**Python (zeep):**
```python
client.service.GetTituloAT(oRequest={"Hash": "...", "IDTitulo": 123})
# ou
call_operation_from_cfg(cfg, "GetTituloAT", o_request)
```

**JavaScript (node-soap):**
```javascript
await client.GetTituloATAsync({ oRequest: { Hash, IDTitulo } });
```

### Resposta

- Campo raiz: `<Operacao>Result` (ex.: `GetTituloATResult`).
- Sempre validar **`RETORNO`** (boolean).
- Erro: `CODIGOERRO`, `ERRODESCRICAO`.

### SOAP .NET — deserialização, ordem e opcionais

O WSDL marca muitos campos com `minOccurs="0"` (opcional no schema). Na prática, **alguns endpoints .NET do WSOficio falham** se elementos forem omitidos ou fora de ordem — comportamento **por operação**, não documentado como regra única para todo o webservice.

#### Ordem dos elementos

1. No WSDL, abra `complexType name="<Operacao>_WSReq"` e liste os `<s:element name="..."/>` **de cima para baixo**.
2. Monte `oRequest` exatamente nessa ordem ao serializar para XML.

**Python — ordem garantida:**

```python
FIELD_ORDER = ("Hash", "Protocolo", ...)  # do WSDL
values = {"Hash": h, "Protocolo": p, ...}
o_request = {k: values[k] for k in FIELD_ORDER}
```

**JavaScript — ordem garantida:**

```javascript
const FIELD_ORDER = ["Hash", "Protocolo", ...];
const values = { Hash: h, Protocolo: p, ... };
const oRequest = Object.fromEntries(FIELD_ORDER.map((k) => [k, values[k]]));
```

**Sintoma de ordem errada (confirmado em homologação):** `InsertTituloAT` → `CODIGOERRO` **50**, mensagem sobre protocolo não numérico, com protocolo só dígitos.

#### Opcionais omitidos vs. string vazia

| Método (exemplos) | Omitir opcionais vazios | Observação |
|-------------------|-------------------------|------------|
| `GetTituloAT` | Sim | Só `Hash` + `IDTitulo` |
| `ListTitulosAT` | Sim | `Protocolo` / `Apresentante` só se preenchidos |
| `InsertTituloAT` | **Não** | Omitir → `CODIGOERRO` **0**, `Não foi possível prosseguir. - IDMsg:…` |
| `UpdateTituloAT` | **Não** | Usar `build_update_titulo_request` / `buildUpdateTituloRequest` |

Para opcionais sem valor em métodos “sensíveis”, enviar **tag presente com conteúdo vazio**:

```xml
<ApresentanteCPFCNPJ></ApresentanteCPFCNPJ>
```

Em código: `""` (não `null` / não omitir a chave no objeto que vira XML).

**Fluxo de diagnóstico:**

```
RETORNO=false
  ├─ CODIGOERRO específico (13, 20, 22, 45, 501…) → corrigir dado de negócio
  ├─ CODIGOERRO=50 com mensagem estranha → conferir ORDEM no WSDL
  └─ CODIGOERRO=0 + "IDMsg" → tentar enviar opcionais vazios na ordem do WSDL
```

#### Helper `InsertTituloAT`

```python
from lib.onr_insert_titulo_at import build_insert_titulo_request
o_request = build_insert_titulo_request(hash_value, cfg)
```

```javascript
import { buildInsertTituloRequest } from "../../lib/onr_insert_titulo_at.js";
const oRequest = buildInsertTituloRequest(hash, cfg);
```

Campos sempre enviados (vazios se não configurados): `ApresentanteDDDTelefone`, `ApresentanteNumeroTelefone`, `ApresentanteCPFCNPJ`, `InteressadoCPFCNPJ`, `DescricaoStatus`.

Ao criar helpers para outros métodos de escrita, extrair `FIELD_ORDER` do WSDL para `lib/onr_<operacao>_<modulo>.py` / `.js` em vez de duplicar lógica nos scripts.

### Listas (zeep / node-soap)

Python — tipo composto no WSDL:
```python
serialize_zeep_list(result.Titulos, "ListTitulosAT_Titulos_WSResp")
serialize_zeep_list(result.Status, "ListStatusAT_Status_WSResp")
```

JavaScript:
```javascript
const items = result.Titulos?.ListTitulosAT_Titulos_WSResp;
return Array.isArray(items) ? items : items ? [items] : [];
```

## Hash (resumo)

Ver [`webservice/hash.md`](../../webservice/hash.md).

```text
Hash = SHA1( ONR_SERVENTIA_CHAVE + token ).upper()   # UTF-8, hex 40 chars
```

| Código | Significado |
|--------|-------------|
| 45 | Hash inválido / token já usado (mensagem ambígua — usar hint) |
| 46 | Hash já utilizado |
| 47 | Hash expirado (token > 8h) |

## Lib Python — API rápida

```python
# onr_env
env_str(key, default=None) -> str | None
env_int(key, default=None) -> int | None
resolve_path(rel) -> Path

# onr_hash
compute_onr_auth_hash(chave, token) -> str
pick_token(tokens, index=None) -> str

# onr_login
login_tokens(cfg) -> list[str]

# onr_acompanhamento
load_serventia_chave() -> str
load_login_config() -> dict | None
load_acompanhamento_soap_config() -> {wsdl_path, endpoint}
resolve_auth_hash(chave, login_cfg) -> str
hash_error_hint(codigo_erro: int) -> str | None

# onr_soap
call_operation_from_cfg(cfg, operation, o_request)

# onr_insert_titulo_at (InsertTituloAT — ordem WSDL + opcionais "")
build_insert_titulo_request(hash_value, cfg) -> dict

# onr_update_titulo_at (UpdateTituloAT — ordem WSDL + opcionais "")
build_update_titulo_request(hash_value, cfg) -> dict

# onr_insert_status_at (InsertStatusAT — ordem WSDL + DescricaoStatus)
build_insert_status_request(hash_value, cfg) -> dict

# onr_update_status_at (UpdateStatusAT — ordem WSDL + DescricaoStatus)
build_update_status_request(hash_value, cfg) -> dict

# onr_zeep_serialize
serialize_result(obj)
serialize_zeep_list(container, item_tag_name)
```

## Lib JavaScript — API rápida

```javascript
// onr_env.js
envStr, envInt, stripQuotes, resolvePath, ROOT

// onr_hash.js
computeOnrAuthHash(chave, token)
pickToken(tokens, index)

// onr_login.js
loginTokens(cfg)  // async

// onr_insert_titulo_at.js
buildInsertTituloRequest(hash, cfg)

// onr_update_titulo_at.js
buildUpdateTituloRequest(hash, cfg)

// onr_insert_status_at.js
buildInsertStatusRequest(hash, cfg)

// onr_update_status_at.js
buildUpdateStatusRequest(hash, cfg)

// onr_acompanhamento.js
loadServentiaChave()
loadLoginConfig()  // null se override ou auto_login off
loadAcompanhamentoSoapConfig()
resolveAuthHash(chave, loginCfg)  // async
hashErrorHint(codigoErro)
```

## Execução

```bash
# Python
py scripts/GetTituloAt/getTituloAt.py

# Node
node scripts/GetTituloAt/getTituloAt.js
npm run get-titulo
```

Dependências: `requirements.txt` (zeep, python-dotenv, cryptography); `package.json` (soap, dotenv, node-forge).

## Saída no terminal (padrão)

```
=== Parâmetros <Operacao> ===
{ ... json do oRequest ... }

Endpoint: https://...

=== Resposta ===
{ ... json ... }

OK — <mensagem resumida de sucesso>
```

Falha: stderr com `[CODIGOERRO] ERRODESCRICAO` + dica de hash se aplicável; exit code `1`.

## Métodos pendentes (81 no total, 10 módulos)

Consultar [`webservice/list-metodos.md`](../../webservice/list-metodos.md).

**Implementados (módulo 3.2 completo):** Login, ListTitulosAT, GetTituloAT, GetStatusAT, InsertTituloAT, UpdateTituloAT, DeleteTituloAT, InsertStatusAT, UpdateStatusAT, ListStatusAT.

**Documentados, sem scripts:** 3.6 Certidões (11 métodos, incl. `EnviarAnexoCertidao_DocID_V2`, `EnviarAnexosListCertidao_DocID_V2`, `InformarCustasCertidao`) · 3.12 Comunicação Prefeituras — `ImportacaoArquivos`, `AtualizarStatusProcesso`.

Ao concluir um método, editar `webservice/metodos/<Operacao>.md`:

```markdown
## Implementação neste projeto

- Script: [`scripts/...`](../../scripts/...)
```

## Dívida técnica conhecida

- `listTitulos.js` duplica lógica de `resolveAuthHash` — alinhar com `getTituloAt.js`.
- `lib/onr_acompanhamento*` acoplado ao prefixo `ACOMPANHAMENTO_TITULOS_AUTO_LOGIN` — generalizar ao adicionar Penhora/E-Protocolo/etc.
