# Perfis — produtos legado Delphi 7 / IDE Embarcadero (Orius)

Raiz comum: `C:\Users\kenio\sistema-delphi`

| Slug | Pasta código | Produto vault | Batch state | Vault hub legado |
|------|--------------|---------------|-------------|------------------|
| `imoveis` | `RegistroDeImoveis` | `registro-imoveis` | `scripts/delphi-imoveis-batch-state.json` | `Orius/desenvolvimento/legado-delphi/produtos/imoveis/` |
| `civil` | `RegistroCivil` | `registro-civil` | `scripts/delphi-civil-batch-state.json` | `.../produtos/civil/` |
| `protesto` | `TabelionatoDeProtesto` | `protesto` | `scripts/delphi-protesto-batch-state.json` | `.../produtos/protesto/` |
| `rtd` | `RegistroDeTitulosEDocumentos` | `rtd` | `scripts/delphi-rtd-batch-state.json` | `.../produtos/rtd/` |
| `caixa` | `Caixa` | `caixa` | `scripts/delphi-caixa-batch-state.json` | `.../produtos/caixa/` |

## Índices vault relacionados

| Slug | Produto | Banco / integrações |
|------|---------|---------------------|
| `imoveis` | [[Orius/empresa/produtos/registro-imoveis]] | ONR, CNIB, RIB, DOI — `integracoes/registro-imoveis/` |
| `civil` | [[Orius/empresa/produtos/registro-civil]] | CRC, SIRC, ONRCPN — `integracoes/registro-civil/` |
| `protesto` | [[Orius/empresa/produtos/protesto]] | CRA, CENPROT — `banco-de-dados/produtos/protesto/` |
| `rtd` | [[Orius/empresa/produtos/registro-titulos-documentos]] | ONRCPN |
| `caixa` | [[Orius/empresa/produtos/caixa]] | compartilhado `G_*` |

## Lotes piloto sugeridos (imóveis)

| `batch_id` | `execution_order` (exemplo) | Foco |
|------------|----------------------------|------|
| `imoveis-core-pedido` | `dmPedido.pas`, `Pedido.pas`, `Pedido.dfm`, `dmONR.pas` | Prenotação, andamento, ONR |
| `imoveis-doi` | `FrameDoi_Reg.pas`, … | DOI |

Replicar padrão para outros produtos após piloto RI.

## Units vendor (skip padrão)

`GifImage`, `frx*`, `gte*`, `WPT*`, cópias `Cópia de *.pas`

Tag no manifest: `"vendor": true`, `"skip_analyze": true`

## Convenção de prioridade de símbolos

No batch, campo opcional `priority_symbols[]` por arquivo — analisadores processam esses antes do restante da fila.

Exemplo `dmPedido.pas`: procedures com prefixo `Gravar`, `Cancelar`, `Enviar`, `ONR`, `Prenot`.
