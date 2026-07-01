-- Feature 005: rebate (cashback) no aviso de pagamento.
-- Algumas Contratantes têm um serviço (config do gestor, app_metadata.rebate_ativo) em que
-- pagam a Originação MENOS o rebate (= Σ cashback do lote). O aviso congela esse rebate no
-- envio (junto de valor/códigos, feature 004): o Valor a Pagar (= valor − rebate) é o que o
-- parceiro paga e o gestor verifica. Contratantes sem o serviço → rebate 0 (paga a Originação
-- cheia); linhas legadas assumem 0 pelo default (retrocompatível).

alter table public.pagamentos_avisos
  add column if not exists rebate numeric(14,2) not null default 0;
