# MedFlow — Portal do Parceiro

Portal de leitura da operação de antecipação de recebíveis médicos. Este glossário fixa a
linguagem do produto na interface, separando-a dos nomes técnicos vindos da planilha.

## Language

**Originação**:
Montante antecipado de uma solicitação (o principal originado). É o rótulo de produto do
campo técnico `valor`.
_Avoid_: Valor (como rótulo de UI), Montante, Principal.

**Rebate**:
Devolução paga ao médico sobre a antecipação. É o rótulo de produto do campo técnico
`cashback`.
_Avoid_: Cashback (na UI; permanece só na planilha e nos identificadores de código).

**Ticket Médio**:
Originação Total dividida pelo número de médicos distintos no recorte — equivale à média
dos totais por médico.
_Avoid_: Valor médio, Média por solicitação.

**Código**:
Identificador exibido de uma solicitação no formato `AAA-N` = três primeiras letras
(sem acento, maiúsculas) da **Contratante** + `-` + número da solicitação. Ex.: `BES-1102`.
Sem Contratante resolvida (quarentena), o prefixo é `???`.
_Avoid_: usar só o número cru na UI.

**Unidade**:
Subdivisão operacional de uma **Contratante** (ex.: uma UPA/UBS específica da franquia).
É o rótulo de produto do campo técnico `unidade` (Unidade Referência). Toda **Solicitação**
válida pertence a uma Unidade. Uma Unidade **existe** quando aparece no sheet; a quais
parceiros ela é **visível** é definido pelo gestor (allowlist por parceiro — feature 003 /
ADR 0002), não mais inferido só da planilha.
_Avoid_: Sub-unidade, filial (na UI).

**Parceiro**:
Uma **Contratante** sob a ótica da administração (feature 003): tem uma cor, uma allowlist de
**Unidades** e 1..N **logins** de acesso. login→Contratante é escolhido pelo gestor (dropdown);
a config (cor + unidades) é compartilhada/sincronizada entre os logins da Contratante.

**Tudo pago**:
Estado de uma **Contratante** (ou **Unidade**) sem nenhuma pendência — toda **Solicitação**
do recorte está quitada (Originação pendente = 0).
_Avoid_: Quitado, Em dia, Zerado.

## Relationships

- Uma **Solicitação** tem uma **Originação**, um **Rebate** e um **Código**.
- Uma **Solicitação** pertence a exatamente uma **Contratante** (fronteira de isolamento).
- Uma **Contratante** tem uma ou mais **Unidades**; no dado, cada **Solicitação** traz
  Contratante + Unidade. A **visibilidade** Unidade→parceiro é definida pelo gestor (allowlist):
  o que o parceiro vê = Solicitações da sua Contratante **E** com Unidade na allowlist
  (ADR 0002). A allowlist nunca concede acesso cross-Contratante.
- Um **Parceiro** (Contratante) tem 1..N **logins**; todos compartilham cor + allowlist.
- **Ticket Médio** é derivado do conjunto de **Solicitações** no recorte (escopo + filtros + toggle).

## Flagged ambiguities

- "Valor" era usado para (a) Originação da solicitação e (b) montantes de pagamento
  pendente ("Total Pendente", "A Receber", "Vencido"). Resolvido: só (a) vira **Originação**;
  os termos de pagamento pendente permanecem como estão.
- Rebate (UI) vs Cashback: a planilha e os identificadores de código mantêm `cashback`;
  apenas o rótulo visível vira **Rebate**. Mesma regra para Originação vs `valor`.
- **Rótulos de status (UI)**: os 3 status de solicitação têm rótulo de exibição **só no
  frontend** — chaves internas seguem `pago`/`a_pagar`/`atrasado` (e o `status_label` do
  backend não muda). UI mostra: `pago→`**Pago**, `a_pagar→`**A Vencer**, `atrasado→`**Vencido**.
  Fonte única: `frontend/src/lib/format.ts` (`STATUS_LABEL`), consumida por `BadgeStatus` e
  pelo registry de filtros.
- **Em Análise**: 4º status de pagamento, no nível de **Unidade**. Gatilho = aviso de pagamento
  (feature 004): quando o parceiro clica em **Pagar** e o gestor **ainda não verificou**, a
  unidade fica **Em Análise** (parceiro vê a pílula "Em Análise"; gestor vê o bloco "Em Análise"
  com o botão "Verificar pagamento"). Verificado/rejeitado/cancelado encerram o estado.
